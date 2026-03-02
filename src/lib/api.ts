import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';

export async function withApiAuth(
  request: NextRequest,
  handler: (req: NextRequest, context: { userId: string; agentId?: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization');
  const apiKey = authHeader?.replace('Bearer ', '');

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'Missing API key' },
      { status: 401 }
    );
  }

  const validation = await validateApiKey(apiKey);

  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: 'Invalid API key' },
      { status: 401 }
    );
  }

  return handler(request, {
    userId: validation.userId!,
    agentId: validation.agentId,
  });
}

export function successResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

export function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}
