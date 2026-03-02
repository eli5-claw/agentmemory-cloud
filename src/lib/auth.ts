import { auth } from '@clerk/nextjs/server';
import { prisma } from './db';
import crypto from 'crypto';

export async function validateApiKey(apiKey: string): Promise<{
  valid: boolean;
  userId?: string;
  agentId?: string;
}> {
  if (!apiKey) return { valid: false };

  // Check agent API key
  const agent = await prisma.agent.findUnique({
    where: { apiKey },
    select: { id: true, userId: true },
  });

  if (agent) {
    return { valid: true, userId: agent.userId, agentId: agent.id };
  }

  // Check user API key
  const user = await prisma.user.findUnique({
    where: { apiKey },
    select: { id: true },
  });

  if (user) {
    return { valid: true, userId: user.id };
  }

  return { valid: false };
}

export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function generateApiKey(): string {
  const prefix = 'amc_live_';
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return `${prefix}${randomBytes}`;
}

export function generateAgentApiKey(): string {
  const prefix = 'amc_agent_';
  const randomBytes = crypto.randomBytes(24).toString('hex');
  return `${prefix}${randomBytes}`;
}
