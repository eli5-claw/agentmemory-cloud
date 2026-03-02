import { NextRequest } from 'next/server';
import { withApiAuth, successResponse, errorResponse } from '@/lib/api';
import { queryMemories, getMemoriesByAgent } from '@/lib/memory';
import { MemoryType } from '@/types';

export const POST = (req: NextRequest) =>
  withApiAuth(req, async (request, _context) => {
    try {
      const body = await request.json();
      const {
        agent_id,
        query,
        memory_type,
        top_k,
        min_importance,
        list_only,
        limit,
        offset,
      } = body;

      if (!agent_id) {
        return errorResponse('Missing required field: agent_id');
      }

      // List mode - return all memories without vector search
      if (list_only) {
        const { memories, total } = await getMemoriesByAgent(agent_id, {
          memoryType: memory_type as MemoryType,
          limit: limit || 20,
          offset: offset || 0,
        });

        return successResponse({
          memories: memories.map((m) => ({
            id: m.id,
            agent_id: m.agentId,
            memory_type: m.memoryType,
            content: m.content,
            importance: m.importance,
            metadata: m.metadata,
            created_at: m.createdAt,
            updated_at: m.updatedAt,
            access_count: m.accessCount,
          })),
          total,
          limit: limit || 20,
          offset: offset || 0,
        });
      }

      // Vector search mode
      if (!query) {
        return errorResponse('Missing required field: query (or set list_only: true)');
      }

      const results = await queryMemories({
        agentId: agent_id,
        query,
        memoryType: memory_type as MemoryType,
        topK: top_k || 5,
        minImportance: min_importance,
      });

      return successResponse({
        results: results.map((r) => ({
          memory: {
            id: r.memory.id,
            agent_id: r.memory.agentId,
            memory_type: r.memory.memoryType,
            content: r.memory.content,
            importance: r.memory.importance,
            metadata: r.memory.metadata,
            created_at: r.memory.createdAt,
            updated_at: r.memory.updatedAt,
            access_count: r.memory.accessCount,
          },
          score: r.score,
        })),
        query,
        total_results: results.length,
      });
    } catch (error) {
      console.error('Error querying memories:', error);
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to query memories',
        500
      );
    }
  });
