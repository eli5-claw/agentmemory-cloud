import { prisma } from '@/lib/db';
import {
  generateEmbedding,
  upsertVector,
  deleteVector,
  searchVectorsByAgent,
} from '@/lib/pinecone';
import { invalidatePattern } from '@/lib/redis';
import {
  Memory,
  MemoryInput,
  MemoryQuery,
  MemorySearchResult,
  MemoryType,
} from '@/types';

export async function createMemory(input: MemoryInput): Promise<Memory> {
  const { agentId, memoryType, content, importance = 5, metadata } = input;

  // Generate embedding for the content
  const embedding = await generateEmbedding(content);

  // Create memory in database
  const memory = await prisma.memory.create({
    data: {
      agentId,
      memoryType,
      content,
      importance,
      metadata: (metadata || {}) as never,
    },
  });

  // Store vector in Pinecone
  await upsertVector(memory.id, embedding, {
    agentId,
    memoryType,
    content: content.substring(0, 1000), // Store truncated content
    importance,
    memoryId: memory.id,
  });

  // Update memory with vector ID
  await prisma.memory.update({
    where: { id: memory.id },
    data: { vectorId: memory.id },
  });

  // Invalidate cache
  await invalidatePattern(`memories:${agentId}:*`);

  return memory as Memory;
}

export async function getMemoryById(id: string): Promise<Memory | null> {
  const memory = await prisma.memory.findUnique({
    where: { id },
  });

  if (memory) {
    // Update access stats
    await prisma.memory.update({
      where: { id },
      data: {
        lastAccessed: new Date(),
        accessCount: { increment: 1 },
      },
    });
  }

  return memory as Memory | null;
}

export async function updateMemory(
  id: string,
  updates: Partial<Omit<MemoryInput, 'agentId'>>
): Promise<Memory> {
  const existing = await prisma.memory.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error('Memory not found');
  }

  const updateData: Record<string, unknown> = {};

  if (updates.content !== undefined) {
    updateData.content = updates.content;
    // Regenerate embedding if content changed
    const embedding = await generateEmbedding(updates.content);
    await upsertVector(id, embedding, {
      agentId: existing.agentId,
      memoryType: updates.memoryType || existing.memoryType,
      content: updates.content.substring(0, 1000),
      importance: updates.importance ?? existing.importance,
      memoryId: id,
    });
  }

  if (updates.memoryType !== undefined) {
    updateData.memoryType = updates.memoryType;
  }

  if (updates.importance !== undefined) {
    updateData.importance = updates.importance;
  }

  if (updates.metadata !== undefined) {
    updateData.metadata = updates.metadata as never;
  }

  const memory = await prisma.memory.update({
    where: { id },
    data: updateData,
  });

  // Invalidate cache
  await invalidatePattern(`memories:${existing.agentId}:*`);

  return memory as Memory;
}

export async function deleteMemory(id: string): Promise<void> {
  const memory = await prisma.memory.findUnique({
    where: { id },
  });

  if (!memory) {
    throw new Error('Memory not found');
  }

  // Delete from Pinecone
  if (memory.vectorId) {
    await deleteVector(memory.vectorId);
  }

  // Delete from database
  await prisma.memory.delete({
    where: { id },
  });

  // Invalidate cache
  await invalidatePattern(`memories:${memory.agentId}:*`);
}

export async function queryMemories(
  query: MemoryQuery
): Promise<MemorySearchResult[]> {
  const { agentId, query: queryText, memoryType, topK = 5, minImportance } = query;

  // Generate embedding for query
  const embedding = await generateEmbedding(queryText);

  // Search vectors
  const vectorResults = await searchVectorsByAgent(
    embedding,
    agentId,
    topK,
    memoryType
  );

  // Fetch full memory records
  const results: MemorySearchResult[] = [];

  for (const vectorResult of vectorResults) {
    const memoryId = vectorResult.metadata?.memoryId as string;
    if (!memoryId) continue;

    const memory = await getMemoryById(memoryId);
    if (!memory) continue;

    // Filter by importance if specified
    if (minImportance !== undefined && memory.importance < minImportance) {
      continue;
    }

    results.push({
      memory,
      score: vectorResult.score,
    });
  }

  return results;
}

export async function getMemoriesByAgent(
  agentId: string,
  options?: {
    memoryType?: MemoryType;
    limit?: number;
    offset?: number;
    orderBy?: 'createdAt' | 'importance' | 'lastAccessed';
    order?: 'asc' | 'desc';
  }
): Promise<{ memories: Memory[]; total: number }> {
  const {
    memoryType,
    limit = 20,
    offset = 0,
    orderBy = 'createdAt',
    order = 'desc',
  } = options || {};

  const where: Record<string, unknown> = { agentId };
  if (memoryType) {
    where.memoryType = memoryType;
  }

  const [memories, total] = await Promise.all([
    prisma.memory.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { [orderBy]: order },
    }),
    prisma.memory.count({ where }),
  ]);

  return {
    memories: memories as Memory[],
    total,
  };
}

export async function getRecentMemories(
  agentId: string,
  limit: number = 10
): Promise<Memory[]> {
  const memories = await prisma.memory.findMany({
    where: { agentId },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return memories as Memory[];
}

export async function getImportantMemories(
  agentId: string,
  minImportance: number = 7,
  limit: number = 10
): Promise<Memory[]> {
  const memories = await prisma.memory.findMany({
    where: {
      agentId,
      importance: { gte: minImportance },
    },
    take: limit,
    orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }],
  });

  return memories as Memory[];
}
