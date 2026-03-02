import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { VectorSearchResult } from '@/types';

let pinecone: Pinecone | null = null;

function getPineconeClient(): Pinecone {
  if (!pinecone) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY is not set');
    }
    pinecone = new Pinecone({ apiKey });
  }
  return pinecone;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const INDEX_NAME = process.env.PINECONE_INDEX || 'agent-memories';

export async function getIndex() {
  return getPineconeClient().index(INDEX_NAME);
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Return zero vector if no API key (for build time)
    return new Array(1536).fill(0);
  }
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

export async function upsertVector(
  id: string,
  embedding: number[],
  metadata: Record<string, unknown>
): Promise<void> {
  try {
    const index = await getIndex();
    await index.upsert([
      {
        id,
        values: embedding,
        metadata: metadata as Record<string, string | number | boolean | string[]>,
      },
    ]);
  } catch (error) {
    console.error('Error upserting vector:', error);
    // Silently fail during build or if Pinecone is not configured
  }
}

export async function deleteVector(id: string): Promise<void> {
  try {
    const index = await getIndex();
    await index.deleteOne(id);
  } catch (error) {
    console.error('Error deleting vector:', error);
  }
}

export async function searchVectors(
  embedding: number[],
  topK: number = 5,
  filter?: Record<string, unknown>
): Promise<VectorSearchResult[]> {
  try {
    const index = await getIndex();
    const results = await index.query({
      vector: embedding,
      topK,
      filter: filter as Record<string, string | number | boolean | string[]>,
      includeMetadata: true,
    });

    return results.matches?.map((match) => ({
      id: match.id,
      score: match.score || 0,
      metadata: match.metadata as Record<string, unknown> | undefined,
    })) || [];
  } catch (error) {
    console.error('Error searching vectors:', error);
    return [];
  }
}

export async function searchVectorsByAgent(
  embedding: number[],
  agentId: string,
  topK: number = 5,
  memoryType?: string
): Promise<VectorSearchResult[]> {
  const filter: Record<string, unknown> = { agentId };
  if (memoryType) {
    filter.memoryType = memoryType;
  }
  return searchVectors(embedding, topK, filter);
}
