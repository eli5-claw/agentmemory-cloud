import { NextRequest } from 'next/server';
import { withApiAuth, successResponse, errorResponse } from '@/lib/api';
import {
  getContext,
  updateContext,
  deleteContext,
  addWorkingMemory,
  getWorkingMemory,
} from '@/lib/context';

export const GET = (req: NextRequest) =>
  withApiAuth(req, async (request) => {
    try {
      const { searchParams } = new URL(request.url);
      const agentId = searchParams.get('agent_id');
      const sessionId = searchParams.get('session_id');
      const workingMemory = searchParams.get('working_memory') === 'true';

      if (!agentId || !sessionId) {
        return errorResponse('Missing required parameters: agent_id, session_id');
      }

      if (workingMemory) {
        const memories = await getWorkingMemory(agentId, sessionId);
        return successResponse({
          agent_id: agentId,
          session_id: sessionId,
          working_memories: memories,
        });
      }

      const context = await getContext(agentId, sessionId);

      if (!context) {
        return errorResponse('Context not found', 404);
      }

      return successResponse({
        id: context.id,
        agent_id: context.agentId,
        session_id: context.sessionId,
        context_data: context.contextData,
        created_at: context.createdAt,
        updated_at: context.updatedAt,
        expires_at: context.expiresAt,
      });
    } catch (error) {
      console.error('Error fetching context:', error);
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to fetch context',
        500
      );
    }
  });

export const POST = (req: NextRequest) =>
  withApiAuth(req, async (request) => {
    try {
      const body = await request.json();
      const {
        agent_id,
        session_id,
        context_data,
        working_memory,
      } = body;

      if (!agent_id || !session_id) {
        return errorResponse('Missing required fields: agent_id, session_id');
      }

      // Handle working memory addition
      if (working_memory) {
        const { content, importance } = working_memory;
        if (!content) {
          return errorResponse('Working memory requires content');
        }
        await addWorkingMemory(agent_id, session_id, content, importance || 5);
        return successResponse(null, 'Working memory added');
      }

      // Handle context creation/update
      if (!context_data) {
        return errorResponse('Missing required field: context_data');
      }

      const context = await updateContext(
        agent_id,
        session_id,
        context_data,
        true
      );

      return successResponse(
        {
          id: context.id,
          agent_id: context.agentId,
          session_id: context.sessionId,
          context_data: context.contextData,
          created_at: context.createdAt,
          updated_at: context.updatedAt,
          expires_at: context.expiresAt,
        },
        'Context updated successfully'
      );
    } catch (error) {
      console.error('Error updating context:', error);
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to update context',
        500
      );
    }
  });

export const DELETE = (req: NextRequest) =>
  withApiAuth(req, async (request) => {
    try {
      const { searchParams } = new URL(request.url);
      const agentId = searchParams.get('agent_id');
      const sessionId = searchParams.get('session_id');

      if (!agentId || !sessionId) {
        return errorResponse('Missing required parameters: agent_id, session_id');
      }

      await deleteContext(agentId, sessionId);

      return successResponse(null, 'Context deleted successfully');
    } catch (error) {
      console.error('Error deleting context:', error);
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to delete context',
        500
      );
    }
  });
