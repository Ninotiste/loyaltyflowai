import type { ChurnLevel } from '@loyaltyflowai/types'
import { calculateChurnLevel, getDaysSinceLastVisit } from '../churn'

const BATCH_SIZE = 500

export interface ChurnProgram {
  organization_id: string
  inactivity_threshold_days: number
}

export interface ChurnCustomer {
  id: string
  last_visit_at: Date | null
}

export interface ChurnScoreInput {
  customerId: string
  score: ChurnLevel
  daysSinceLastVisit: number
  scoredDate: string
}

export interface ChurnJobAdaptor {
  getActivePrograms(): Promise<ChurnProgram[]>
  getCustomerBatch(orgId: string, take: number, skip: number): Promise<ChurnCustomer[]>
  saveChurnScore(data: ChurnScoreInput): Promise<void>
}

export interface ChurnJobResult {
  processed: number
  errors: number
}

export async function runCalculateChurnJob(adaptor: ChurnJobAdaptor): Promise<ChurnJobResult> {
  const programs = await adaptor.getActivePrograms()
  const today = new Date().toISOString().slice(0, 10)

  let processed = 0
  let errors = 0

  for (const program of programs) {
    let skip = 0
    let batch: ChurnCustomer[]

    do {
      batch = await adaptor.getCustomerBatch(program.organization_id, BATCH_SIZE, skip)

      const results = await Promise.allSettled(
        batch.map(async (customer) => {
          const days = getDaysSinceLastVisit(customer.last_visit_at)
          const score = calculateChurnLevel(customer.last_visit_at, program.inactivity_threshold_days)
          await adaptor.saveChurnScore({
            customerId: customer.id,
            score,
            daysSinceLastVisit: Math.min(days, 9999),
            scoredDate: today,
          })
        })
      )

      for (const result of results) {
        if (result.status === 'fulfilled') processed++
        else errors++
      }

      skip += batch.length
    } while (batch.length === BATCH_SIZE)
  }

  return { processed, errors }
}
