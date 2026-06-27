import type { ChurnJobAdaptor } from '@loyaltyflowai/utils'
import { runCalculateChurnJob } from '@loyaltyflowai/utils'
import { createLogger } from '@loyaltyflowai/logger'
import { db } from '@/lib/db'

const logger = createLogger('cron:calculateChurn')

const adaptor: ChurnJobAdaptor = {
  getActivePrograms: () =>
    db.loyaltyProgram.findMany({
      where: { status: 'ACTIVE' },
      select: { organization_id: true, inactivity_threshold_days: true },
    }),

  getCustomerBatch: (orgId, take, skip) =>
    db.customer.findMany({
      where: { organization_id: orgId, deleted_at: null },
      select: { id: true, last_visit_at: true },
      take,
      skip,
    }),

  saveChurnScore: (data) =>
    db.churnScore
      .upsert({
        where: {
          customer_id_scored_date: {
            customer_id: data.customerId,
            scored_date: data.scoredDate,
          },
        },
        update: {
          score: data.score,
          days_since_last_visit: data.daysSinceLastVisit,
          calculated_at: new Date(),
        },
        create: {
          customer_id: data.customerId,
          score: data.score,
          days_since_last_visit: data.daysSinceLastVisit,
          scored_date: data.scoredDate,
        },
      })
      .then(() => undefined),
}

export async function calculateChurnJob(): Promise<void> {
  logger.info('Starting churn calculation')
  const result = await runCalculateChurnJob(adaptor)
  if (result.errors > 0) {
    logger.warn('Churn calculation completed with errors', { ...result })
  } else {
    logger.info('Churn calculation completed', { ...result })
  }
}
