import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { sendWelcomeRestaurant } from '@/lib/email'
import { createLogger } from '@loyaltyflowai/logger'

const logger = createLogger('api:auth:setup')

const setupSchema = z.object({
  restaurant_name: z.string().min(1).max(100),
})

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = setupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      )
    }

    const { restaurant_name } = parsed.data

    // Idempotent — return existing if already set up
    const existing = await db.teamMember.findUnique({
      where: { user_id: user.id },
      include: { organization: true },
    })
    if (existing) {
      return NextResponse.json({ organization: existing.organization, already_setup: true })
    }

    // Generate unique slug
    const baseSlug = slugify(restaurant_name)
    let slug = baseSlug
    let attempt = 0
    while (await db.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${++attempt}`
    }

    const org = await db.organization.create({
      data: {
        name: restaurant_name,
        slug,
        team_members: {
          create: {
            user_id: user.id,
            email: user.email ?? '',
            role: 'ADMIN',
          },
        },
      },
    })

    logger.info('Organization created', { orgId: org.id, slug })

    // Send welcome email async (don't block response)
    sendWelcomeRestaurant(user.email ?? '', restaurant_name).catch((err) =>
      logger.error('Failed to send welcome email', { error: String(err) })
    )

    return NextResponse.json({ organization: org }, { status: 201 })
  } catch (err) {
    logger.error('Setup failed', { error: String(err) })
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Setup failed' } },
      { status: 500 }
    )
  }
}
