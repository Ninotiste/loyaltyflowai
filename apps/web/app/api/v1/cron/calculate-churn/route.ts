import { NextResponse } from 'next/server'
import { serverEnv } from '@loyaltyflowai/config/server'
import { createLogger } from '@loyaltyflowai/logger'
import { calculateChurnJob } from '@/lib/services/calculateChurn'

const logger = createLogger('api:cron:calculate-churn')

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${serverEnv.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await calculateChurnJob()
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('Cron job failed', { error: String(err) })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
