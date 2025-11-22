import { NextResponse } from 'next/server';
import { VerificationService } from '@/lib/verification';

export async function GET() {
  try {
    const requests = await VerificationService.getPendingRequests();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
