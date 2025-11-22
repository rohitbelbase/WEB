import { NextResponse } from 'next/server';
import { VerificationService } from '@/lib/verification';

export async function POST(request: Request) {
  try {
    const { userId, note } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const result = await VerificationService.submitVerificationRequest(
      Number(userId),
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
