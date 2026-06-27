'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'

type Step = 1 | 2 | 3 | 4

interface ProgramForm {
  name: string
  earning_type: 'PER_VISIT' | 'PER_AMOUNT_SPENT'
  points_per_unit: number
  reward_name: string
  reward_points: number
  primary_color: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'MANAGER' | 'EMPLOYEE'>('EMPLOYEE')
  const [inviteSent, setInviteSent] = useState(false)

  const [program, setProgram] = useState<ProgramForm>({
    name: 'Mon programme fidélité',
    earning_type: 'PER_VISIT',
    points_per_unit: 1,
    reward_name: 'Café offert',
    reward_points: 10,
    primary_color: '#0284c7',
  })

  async function createProgram() {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/programs/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: program.name, primary_color: program.primary_color }),
      })
      if (!res.ok) return
      const data = await res.json()
      setPublicKey(data.program.public_key)

      await fetch('/api/v1/programs/earning-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: program.earning_type,
          points_per_unit: program.points_per_unit,
        }),
      })

      await fetch('/api/v1/programs/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: program.reward_name, points_required: program.reward_points }),
      })

      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/v1/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      setInviteSent(true)
      setInviteEmail('')
    } finally {
      setLoading(false)
    }
  }

  const widgetSnippet = publicKey
    ? `<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js"\n  data-public-key="${publicKey}"\n  async>\n</script>`
    : ''

  const steps = [
    { num: 1, label: 'Profil' },
    { num: 2, label: 'Programme' },
    { num: 3, label: 'Widget' },
    { num: 4, label: 'Équipe' },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-gray-900">LoyaltyFlow</span>
          <span className="text-brand-600 text-2xl font-bold">AI</span>
          <p className="mt-2 text-sm text-gray-500">Configuration de votre programme de fidélité</p>
        </div>

        {/* Steps indicator */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step > s.num
                    ? 'bg-brand-600 text-white'
                    : step === s.num
                      ? 'bg-brand-600 ring-brand-100 text-white ring-4'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span
                className={`ml-2 text-xs font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {s.label}
              </span>
              {idx < steps.length - 1 && (
                <div
                  className={`mx-3 h-0.5 w-12 ${step > s.num ? 'bg-brand-600' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Bienvenue ! Votre compte est prêt.
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Votre profil restaurateur a été créé automatiquement lors de l&apos;inscription.
                  Passons maintenant à la configuration de votre programme.
                </p>
              </div>
              <div className="bg-brand-50 rounded-xl p-4">
                <h3 className="text-brand-800 text-sm font-semibold">Ce que vous allez créer :</h3>
                <ul className="text-brand-700 mt-2 space-y-1 text-sm">
                  <li>• Un programme de points personnalisé</li>
                  <li>• Un widget à intégrer sur votre site</li>
                  <li>• Les accès pour votre équipe</li>
                </ul>
              </div>
              <button
                onClick={() => setStep(2)}
                className="bg-brand-600 hover:bg-brand-700 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white"
              >
                Créer mon programme →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Configurez votre programme</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Vous pourrez tout modifier après. Commencez simple.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nom du programme
                </label>
                <input
                  type="text"
                  value={program.name}
                  onChange={(e) => setProgram({ ...program, name: e.target.value })}
                  className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Comment gagner des points ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: 'PER_VISIT',
                      label: 'Par visite',
                      sub: 'X points par passage en caisse',
                    },
                    {
                      value: 'PER_AMOUNT_SPENT',
                      label: 'Par montant',
                      sub: 'X points par € dépensé',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setProgram({
                          ...program,
                          earning_type: opt.value as ProgramForm['earning_type'],
                        })
                      }
                      className={`rounded-xl border-2 p-4 text-left ${program.earning_type === opt.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}
                    >
                      <p className="font-semibold text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Points par {program.earning_type === 'PER_VISIT' ? 'visite' : '€ dépensé'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={program.points_per_unit}
                    onChange={(e) =>
                      setProgram({ ...program, points_per_unit: parseInt(e.target.value) })
                    }
                    className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="mb-3 text-sm font-semibold text-gray-700">Première récompense</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={program.reward_name}
                      onChange={(e) => setProgram({ ...program, reward_name: e.target.value })}
                      placeholder="Café offert"
                      className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Points requis
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={program.reward_points}
                      onChange={(e) =>
                        setProgram({ ...program, reward_points: parseInt(e.target.value) })
                      }
                      className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  onClick={createProgram}
                  disabled={loading}
                  className="bg-brand-600 hover:bg-brand-700 flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loading ? 'Création...' : 'Créer le programme →'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Intégrez le widget sur votre site
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Copiez ce snippet dans votre site web, juste avant la balise{' '}
                  <code>&lt;/body&gt;</code>.
                </p>
              </div>
              {publicKey && (
                <div>
                  <div className="relative rounded-lg bg-gray-900 p-4">
                    <pre className="overflow-x-auto text-xs text-green-400">{widgetSnippet}</pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(widgetSnippet)}
                      className="absolute right-3 top-3 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600"
                    >
                      Copier
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Clé publique : <code className="rounded bg-gray-100 px-1">{publicKey}</code>
                  </p>
                </div>
              )}
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-sm text-amber-700">
                  <strong>Pas de site web ?</strong> Pas de problème. Vous pouvez utiliser le
                  tableau de bord pour enregistrer manuellement les visites de vos clients.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Mon site n&apos;est pas prêt — passer
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-brand-600 hover:bg-brand-700 flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                >
                  Widget intégré → Continuer
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Invitez votre équipe</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ajoutez vos employés pour qu&apos;ils puissent enregistrer les visites clients.
                  Étape optionnelle.
                </p>
              </div>
              {inviteSent && (
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
                  Invitation envoyée ! Vous pouvez en envoyer d&apos;autres.
                </div>
              )}
              <form onSubmit={handleInvite} className="flex gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@employe.fr"
                  required
                  className="focus:ring-brand-500 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                  className="focus:ring-brand-500 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                >
                  <option value="EMPLOYEE">Employé</option>
                  <option value="MANAGER">Manager</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-60"
                >
                  Inviter
                </button>
              </form>
              <button
                onClick={() => router.push('/dashboard' as Route)}
                className="bg-brand-600 hover:bg-brand-700 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white"
              >
                Accéder à mon tableau de bord 🎉
              </button>
              <p className="text-center text-xs text-gray-400">
                Vous pourrez inviter des membres depuis les paramètres à tout moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
