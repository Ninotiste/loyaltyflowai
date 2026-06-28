import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, requireRole, apiError, apiSuccess } from '@/lib/auth'
import { sendTeamInvitation } from '@/lib/email'
import { randomBytes } from 'crypto'
import { createLogger } from '@loyaltyflowai/logger'

const logger = createLogger('api:team')

const inviteSchema = z.object({
  email: z.string().email().toLowerCase(),
  role: z.enum(['MANAGER', 'EMPLOYEE']),
})

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    const [members, invitations] = await Promise.all([
      db.teamMember.findMany({
        where: { organization_id: auth.orgId },
        orderBy: { created_at: 'asc' },
      }),
      db.invitation.findMany({
        where: { organization_id: auth.orgId, accepted_at: null, expires_at: { gt: new Date() } },
        orderBy: { created_at: 'desc' },
      }),
    ])

    return NextResponse.json({ members, pending_invitations: invitations })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to fetch team')
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)
    requireRole(auth, ['ADMIN', 'MANAGER'])
    const body = await request.json()
    const parsed = inviteSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid input')

    const { email, role } = parsed.data

    const existingMember = await db.teamMember.findFirst({
      where: { organization_id: auth.orgId, email },
    })
    if (existingMember)
      return apiError(409, 'ALREADY_MEMBER', 'This email is already a team member')

    // Revoke any existing pending invitation for this email
    await db.invitation.updateMany({
      where: { organization_id: auth.orgId, email, accepted_at: null },
      data: { expires_at: new Date() },
    })

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const invitation = await db.invitation.create({
      data: {
        organization_id: auth.orgId,
        email,
        role,
        token,
        expires_at: expiresAt,
      },
    })

    const org = await db.organization.findUnique({
      where: { id: auth.orgId },
      select: { name: true },
    })
    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/team/accept/${token}`

    sendTeamInvitation(email, org?.name ?? 'Le restaurant', acceptUrl).catch((err) =>
      logger.error('Failed to send invitation email', { error: String(err) })
    )

    return apiSuccess({ invitation }, 201)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to send invitation')
  }
}
