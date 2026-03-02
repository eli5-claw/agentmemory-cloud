import { NextRequest } from 'next/server';
import { withApiAuth, successResponse, errorResponse } from '@/lib/api';
import { prisma } from '@/lib/db';
import { generateAgentApiKey } from '@/lib/auth';

export const GET = (req: NextRequest) =>
  withApiAuth(req, async (request, context) => {
    try {
      const { userId } = context;

      const agents = await prisma.agent.findMany({
        where: { userId },
        include: {
          _count: {
            select: { memories: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return successResponse({
        agents: agents.map((agent) => ({
          id: agent.id,
          name: agent.name,
          description: agent.description,
          api_key: agent.apiKey,
          memory_count: agent._count.memories,
          created_at: agent.createdAt,
          updated_at: agent.updatedAt,
        })),
      });
    } catch (error) {
      console.error('Error fetching agents:', error);
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to fetch agents',
        500
      );
    }
  });

export const POST = (req: NextRequest) =>
  withApiAuth(req, async (request, context) => {
    try {
      const { userId } = context;
      const body = await request.json();
      const { name, description } = body;

      if (!name) {
        return errorResponse('Missing required field: name');
      }

      const agent = await prisma.agent.create({
        data: {
          userId,
          name,
          description,
          apiKey: generateAgentApiKey(),
        },
      });

      return successResponse(
        {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          api_key: agent.apiKey,
          created_at: agent.createdAt,
        },
        'Agent created successfully'
      );
    } catch (error) {
      console.error('Error creating agent:', error);
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to create agent',
        500
      );
    }
  });
