// lib/verification.ts
import prisma from './prisma';
import { VerificationStatus } from '@prisma/client';

export class VerificationService {
  /**
   * User submits a new verification request
   */
  static async submitVerificationRequest(userId: number, note?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        verificationRequests: {
          where: { status: VerificationStatus.PENDING },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) throw new Error('User not found');
    if (user.verificationStatus === VerificationStatus.VERIFIED) {
      throw new Error('User is already verified');
    }
    if (user.verificationRequests.length > 0) {
      throw new Error('A verification request is already pending');
    }

    const request = await prisma.verificationRequest.create({
      data: {
        userId,
        note,
        status: VerificationStatus.PENDING,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: VerificationStatus.PENDING },
    });

    return request;
  }

  /**
   * Admin approves a pending request
   */
  static async approveVerification(requestId: number, adminNote?: string) {
    const request = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) throw new Error('Verification request not found');
    if (request.status !== VerificationStatus.PENDING) {
      throw new Error('Request is not pending');
    }

    const [updatedRequest, updatedUser] = await prisma.$transaction([
      prisma.verificationRequest.update({
        where: { id: requestId },
        data: {
          status: VerificationStatus.VERIFIED,
          note: adminNote || request.note,
        },
      }),
      prisma.user.update({
        where: { id: request.userId },
        data: {
          verificationStatus: VerificationStatus.VERIFIED,
          verifiedAt: new Date(),
          verificationNote: adminNote,
        },
      }),
    ]);

    return { updatedRequest, updatedUser };
  }

  /**
   * Admin rejects a pending request
   */
  static async rejectVerification(requestId: number, reason: string) {
    const request = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new Error('Verification request not found');
    if (request.status !== VerificationStatus.PENDING) {
      throw new Error('Request is not pending');
    }

    const [updatedRequest, updatedUser] = await prisma.$transaction([
      prisma.verificationRequest.update({
        where: { id: requestId },
        data: {
          status: VerificationStatus.UNVERIFIED,
          note: reason,
        },
      }),
      prisma.user.update({
        where: { id: request.userId },
        data: {
          verificationStatus: VerificationStatus.UNVERIFIED,
          verificationNote: reason,
        },
      }),
    ]);

    return { updatedRequest, updatedUser };
  }

  /**
   * Admin view – list all pending verification requests
   */
  static async getPendingRequests() {
    return prisma.verificationRequest.findMany({
      where: { status: VerificationStatus.PENDING },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Profile / banner – show user's current verification status
   */
  static async getUserVerificationStatus(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        verificationStatus: true,
        verificationNote: true,
        verifiedAt: true,
        verificationRequests: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  /**
   * Admin can revoke verification later if something goes wrong
   */
  static async revokeVerification(userId: number, reason: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');
    if (user.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new Error('User is not verified');
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: VerificationStatus.UNVERIFIED,
        verificationNote: reason,
        verifiedAt: null,
      },
    });
  }
}
