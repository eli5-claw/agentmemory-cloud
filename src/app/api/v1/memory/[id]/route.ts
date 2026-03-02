import { NextRequest } from 'next/server';
import { withApiAuth, successResponse, errorResponse } from '@/lib/api';
import { getMemoryById, updateMemory, deleteMemory } from '@/lib/memory';
import { MemoryType } from '@/types';

export const GET = (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) =>
  withApiAuth(req, async (_request) => {
    try {
      const { id } = await params;
      const memory = await getMemoryById(id);

      if (!memory) {
        return errorResponse('Memory not found', 404);
      }

      return successResponse({
        id: memory.id,
        agent_id: memory.agentId,
        memory_type: memory.memoryType,
        content: memory.content,
        importance: memory.importance,
        metadata: memory.metadata,
        created_at: memory.createdAt,
        updated_at: memory.updatedAt,
        last_accessed: memory.lastAccessed,
        access_count: memory.accessCount,
      });
    } catch (error) {
      console.error('Error fetching memory:', error);
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to fetch memory',
        500
      );
    }
  });

export const PATCH = (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) =>
  withApiAuth(req, async (request) => {
    try {
      const { id } = await params;
      const body = await request.json();
      const { content, memory_type, importance, metadata } = body;

      const memory = await updateMemory(id, {
        content,
        memoryType: memory_type as MemoryType,
        importance,
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
          updated_at: memory.updatedAt,
        },
        'Memory updated successfully'
      );
    } catch (error) {
      console.error('Error updating memory:', error);
      if (error instanceof Error && error.message === 'Memory not found') {
        return errorResponse('Memory not found', 404);
      }
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to update memory',
        500
      );
    }
  });

export const DELETE = (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) =>
  withApiAuth(req, async (_request) => {
    try {
      const { id } = await params;
      await deleteMemory(id);

      return successResponse(null, 'Memory deleted successfully');
    } catch (error) {
      console.error('Error deleting memory:', error);
      if (error instanceof Error && error.message === 'Memory not found') {
        return errorResponse('Memory not found', 404);
      }
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to delete memory',
        500
      );
    }
  });
