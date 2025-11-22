import { NextResponse } from 'next/server';
import { VerificationService } from '@/lib/verification';

export async function POST(request: Request) {
  try {
    const { requestId, reason } = await request.json();

    if (!requestId || !reason) {
      return NextResponse.json(
        { error: 'requestId and reason are required' },
        { status: 400 }
      );
    }

    const result = await VerificationService.rejectVerification(
      Number(requestId),
      reason
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
