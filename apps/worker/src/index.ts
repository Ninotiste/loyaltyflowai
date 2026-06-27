import { createLogger } from '@loyaltyflowai/logger'
import { calculateChurnJob } from './jobs/calculateChurn'
import { db } from './lib/db'

const logger = createLogger('worker')

const JOB_MAP: Record<string, () => Promise<void>> = {
  'calculate-churn': calculateChurnJob,
}

async function main() {
  const jobName = process.env.JOB_NAME ?? process.argv[2]

  if (!jobName) {
    logger.error('No job specified', {
      usage: 'JOB_NAME=<job> node dist/index.js',
      available: Object.keys(JOB_MAP),
    })
    process.exit(1)
  }

  const job = JOB_MAP[jobName]
  if (!job) {
    logger.error('Unknown job', { jobName, available: Object.keys(JOB_MAP) })
    process.exit(1)
  }

  logger.info('Starting job', { jobName })
  try {
    await job()
    logger.info('Job completed successfully', { jobName })
  } catch (err) {
    logger.error('Job failed', { jobName, error: String(err) })
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()
