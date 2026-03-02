import { NextRequest } from 'next/server';
import { withApiAuth, successResponse } from '@/lib/api';
import { prisma } from '@/lib/db';

export const GET = (req: NextRequest) =>
  withApiAuth(req, async (request, context) => {
    const { userId } = context;

    // Get counts
    const [totalMemories, totalAgents, totalContexts] = await Promise.all([
      prisma.memory.count({
        where: {
          agent: {
            userId,
          },
        },
      }),
      prisma.agent.count({
        where: { userId },
      }),
      prisma.agentContext.count({
        where: {
          agent: {
            userId,
          },
        },
      }),
    ]);

    return successResponse({
      totalMemories,
      totalAgents,
      totalContexts,
      recentQueries: Math.floor(Math.random() * 500), // Placeholder
      avgResponseTime: '45ms', // Placeholder
    });
  });
