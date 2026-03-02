import { NextRequest } from 'next/server';
import { withApiAuth, successResponse, errorResponse } from '@/lib/api';
import { createMemory } from '@/lib/memory';
import { MemoryType } from '@/types';

export const POST = (req: NextRequest) =>
  withApiAuth(req, async (request, _context) => {
    try {
      const body = await request.json();
      const { agent_id, memory_type, content, importance, metadata } = body;

      // Validate required fields
      if (!agent_id || !memory_type || !content) {
        return errorResponse(
          'Missing required fields: agent_id, memory_type, content'
        );
      }

      // Validate memory type
      const validTypes: MemoryType[] = ['episodic', 'semantic', 'procedural', 'working'];
      if (!validTypes.includes(memory_type)) {
        return errorResponse(
          `Invalid memory_type. Must be one of: ${validTypes.join(', ')}`
        );
      }

      // Create memory
      const memory = await createMemory({
        agentId: agent_id,
        memoryType: memory_type,
        content,
        importance: importance || 5,
        metadata,
      });

      return successResponse(
        {
          id: memory.id,
          agent_id: memory.agentId,
          memory_type: memory.memoryType,
          content: memory.content,
          importance: memory.importance,
          metadata: memory.metadata,
          created_at: memory.createdAt,
        },
        'Memory stored successfully'
      );
    } catch (error) {
      console.error('Error storing memory:', error);
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to store memory',
        500
      );
    }
  });
