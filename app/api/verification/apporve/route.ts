import { NextResponse } from 'next/server';
import { VerificationService } from '@/lib/verification';

export async function POST(request: Request) {
  try {
    const { requestId, note } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { error: 'requestId is required' },
        { status: 400 }
      );
    }

    const result = await VerificationService.approveVerification(
      Number(requestId),
      note
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
