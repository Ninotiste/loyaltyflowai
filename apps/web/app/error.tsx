'use client'

import { useEffect } from 'react'
import { createLogger } from '@loyaltyflowai/logger'

const logger = createLogger('error-boundary')

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Unhandled error', { message: error.message, digest: error.digest })
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <div className="mb-4 text-4xl">⚠️</div>
        <h1 className="text-xl font-bold text-gray-900">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-gray-500">
          Nous sommes désolés. Une erreur inattendue s&apos;est produite.
          {error.digest && (
            <span className="mt-1 block text-xs text-gray-400">Référence : {error.digest}</span>
          )}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="bg-brand-600 hover:bg-brand-700 rounded-lg px-4 py-2 text-sm font-medium text-white"
          >
            Réessayer
          </button>
          <a
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    </div>
  )
}
