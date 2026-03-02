import { prisma } from '@/lib/db';
import { setCache, getCache, deleteCache } from '@/lib/redis';
import { AgentContext } from '@/types';

const CONTEXT_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export async function createContext(
  agentId: string,
  sessionId: string,
  contextData: Record<string, unknown>,
  ttlHours: number = 24
): Promise<AgentContext> {
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

  const context = await prisma.agentContext.create({
    data: {
      agentId,
      sessionId,
      contextData: contextData as never,
      expiresAt,
    },
  });

  // Cache the context
  const cacheKey = `context:${agentId}:${sessionId}`;
  await setCache(cacheKey, context, CONTEXT_TTL_SECONDS);

  return context as AgentContext;
}

export async function getContext(
  agentId: string,
  sessionId: string
): Promise<AgentContext | null> {
  const cacheKey = `context:${agentId}:${sessionId}`;

  // Try cache first
  const cached = await getCache<AgentContext>(cacheKey);
  if (cached) {
    // Check if expired
    if (new Date(cached.expiresAt) > new Date()) {
      return cached;
    }
    // Expired, delete from cache
    await deleteCache(cacheKey);
  }

  // Fetch from database
  const context = await prisma.agentContext.findFirst({
    where: {
      agentId,
      sessionId,
      expiresAt: { gt: new Date() },
    },
  });

  if (context) {
    // Cache it
    await setCache(cacheKey, context, CONTEXT_TTL_SECONDS);
  }

  return context as AgentContext | null;
}

export async function updateContext(
  agentId: string,
  sessionId: string,
  updates: Record<string, unknown>,
  merge: boolean = true
): Promise<AgentContext> {
  const existing = await getContext(agentId, sessionId);

  let contextData: Record<string, unknown>;
  if (merge && existing) {
    contextData = { ...existing.contextData, ...updates };
  } else {
    contextData = updates;
  }

  if (existing) {
    const updated = await prisma.agentContext.update({
      where: { id: existing.id },
      data: {
        contextData: contextData as never,
        updatedAt: new Date(),
      },
    });

    // Update cache
    const cacheKey = `context:${agentId}:${sessionId}`;
    await setCache(cacheKey, updated, CONTEXT_TTL_SECONDS);

    return updated as AgentContext;
  }

  // Create new context if not exists
  return createContext(agentId, sessionId, contextData);
}

export async function deleteContext(
  agentId: string,
  sessionId: string
): Promise<void> {
  await prisma.agentContext.deleteMany({
    where: {
      agentId,
      sessionId,
    },
  });

  // Delete from cache
  const cacheKey = `context:${agentId}:${sessionId}`;
  await deleteCache(cacheKey);
}

export async function getActiveContexts(agentId: string): Promise<AgentContext[]> {
  const contexts = await prisma.agentContext.findMany({
    where: {
      agentId,
      expiresAt: { gt: new Date() },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return contexts as AgentContext[];
}

export async function cleanupExpiredContexts(): Promise<number> {
  const result = await prisma.agentContext.deleteMany({
    where: {
      expiresAt: { lte: new Date() },
    },
  });

  return result.count;
}

export async function addWorkingMemory(
  agentId: string,
  sessionId: string,
  content: string,
  importance: number = 5
): Promise<void> {
  const context = await getContext(agentId, sessionId);

  const workingMemories = (context?.contextData?.workingMemories as Array<{
    content: string;
    importance: number;
    timestamp: string;
  }>) || [];

  workingMemories.push({
    content,
    importance,
    timestamp: new Date().toISOString(),
  });

  // Keep only top 20 by importance
  workingMemories.sort((a, b) => b.importance - a.importance);
  const trimmedMemories = workingMemories.slice(0, 20);

  await updateContext(agentId, sessionId, {
    workingMemories: trimmedMemories,
  });
}

export async function getWorkingMemory(
  agentId: string,
  sessionId: string,
  limit: number = 5
): Promise<string[]> {
  const context = await getContext(agentId, sessionId);

  const workingMemories = (context?.contextData?.workingMemories as Array<{
    content: string;
    importance: number;
    timestamp: string;
  }>) || [];

  return workingMemories
    .sort((a, b) => b.importance - a.importance)
    .slice(0, limit)
    .map((m) => m.content);
}
