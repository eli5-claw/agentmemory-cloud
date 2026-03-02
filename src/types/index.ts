export interface Memory {
  id: string;
  agentId: string;
  memoryType: MemoryType;
  content: string;
  importance: number;
  metadata?: Record<string, unknown>;
  vectorId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastAccessed?: Date;
  accessCount: number;
}

export type MemoryType = 'episodic' | 'semantic' | 'procedural' | 'working';

export interface MemoryInput {
  agentId: string;
  memoryType: MemoryType;
  content: string;
  importance?: number;
  metadata?: Record<string, unknown>;
}

export interface MemoryQuery {
  agentId: string;
  query: string;
  memoryType?: MemoryType;
  topK?: number;
  minImportance?: number;
}

export interface MemorySearchResult {
  memory: Memory;
  score: number;
}

export interface AgentContext {
  id: string;
  agentId: string;
  sessionId: string;
  contextData: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  description?: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  apiKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}
