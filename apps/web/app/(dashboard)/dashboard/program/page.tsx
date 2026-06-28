'use client'

import { useState, useEffect } from 'react'

interface EarningRule {
  id: string
  type: 'PER_VISIT' | 'PER_AMOUNT_SPENT'
  points_per_unit: number
  unit_description: string | null
  minimum_amount: number | null
  is_active: boolean
}

interface Reward {
  id: string
  name: string
  description: string | null
  points_required: number
  is_active: boolean
}

interface Program {
  id: string
  name: string
  status: string
  public_key: string
  primary_color: string | null
  welcome_message: string | null
  button_text: string | null
  earning_rules: EarningRule[]
  rewards: Reward[]
}

export default function ProgramPage() {
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // New earning rule form
  const [ruleType, setRuleType] = useState<'PER_VISIT' | 'PER_AMOUNT_SPENT'>('PER_VISIT')
  const [rulePoints, setRulePoints] = useState('1')
  const [ruleMin, setRuleMin] = useState('')

  // New reward form
  const [rewardName, setRewardName] = useState('')
  const [rewardDesc, setRewardDesc] = useState('')
  const [rewardPoints, setRewardPoints] = useState('100')

  // Program settings
  const [programName, setProgramName] = useState('')
  const [welcomeMsg, setWelcomeMsg] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [color, setColor] = useState('#0284c7')

  useEffect(() => {
    fetch('/api/v1/programs/current')
      .then((r) => r.json())
      .then((d) => {
        const p = d.program
        if (p) {
          setProgram(p)
          setProgramName(p.name)
          setWelcomeMsg(p.welcome_message ?? '')
          setButtonText(p.button_text ?? 'Mes points 🎁')
          setColor(p.primary_color ?? '#0284c7')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function createProgram() {
    setSaving(true)
    try {
      const res = await fetch('/api/v1/programs/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: programName || 'Mon programme de fidélité' }),
      })
      if (res.ok) {
        const d = await res.json()
        setProgram(d.program)
      }
    } finally {
      setSaving(false)
    }
  }

  async function updateProgram() {
    if (!program) return
    setSaving(true)
    try {
      const res = await fetch('/api/v1/programs/current', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: programName,
          welcome_message: welcomeMsg,
          button_text: buttonText,
          primary_color: color,
        }),
      })
      if (res.ok) {
        const d = await res.json()
        setProgram((prev) => (prev ? { ...prev, ...d.program } : prev))
      }
    } finally {
      setSaving(false)
    }
  }

  async function addRule(e: React.FormEvent) {
    e.preventDefault()
    if (!program) return
    const res = await fetch('/api/v1/programs/earning-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: ruleType,
        points_per_unit: parseInt(rulePoints),
        minimum_amount: ruleMin ? parseInt(ruleMin) : undefined,
      }),
    })
    if (res.ok) {
      const d = await res.json()
      setProgram((prev) =>
        prev ? { ...prev, earning_rules: [...prev.earning_rules, d.rule] } : prev
      )
      setRulePoints('1')
      setRuleMin('')
    }
  }

  async function deleteRule(id: string) {
    await fetch(`/api/v1/programs/earning-rules/${id}`, { method: 'DELETE' })
    setProgram((prev) =>
      prev ? { ...prev, earning_rules: prev.earning_rules.filter((r) => r.id !== id) } : prev
    )
  }

  async function addReward(e: React.FormEvent) {
    e.preventDefault()
    if (!program) return
    const res = await fetch('/api/v1/programs/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: rewardName,
        description: rewardDesc,
        points_required: parseInt(rewardPoints),
      }),
    })
    if (res.ok) {
      const d = await res.json()
      setProgram((prev) => (prev ? { ...prev, rewards: [...prev.rewards, d.reward] } : prev))
      setRewardName('')
      setRewardDesc('')
      setRewardPoints('100')
    }
  }

  async function deleteReward(id: string) {
    await fetch(`/api/v1/programs/rewards/${id}`, { method: 'DELETE' })
    setProgram((prev) =>
      prev ? { ...prev, rewards: prev.rewards.filter((r) => r.id !== id) } : prev
    )
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-brand-600 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Programme de fidélité</h1>
        <p className="mt-1 text-sm text-gray-500">Configurez vos règles et récompenses.</p>
      </div>

      {!program ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Aucun programme créé</h2>
          <p className="mb-4 text-sm text-gray-500">
            Créez votre programme pour commencer à fidéliser vos clients.
          </p>
          <div className="flex justify-center gap-3">
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              placeholder="Nom du programme (ex: Club Fidèle)"
              className="focus:ring-brand-500 w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
            <button
              onClick={createProgram}
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? 'Création...' : 'Créer le programme'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Programme settings */}
          <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Paramètres</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${program.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
              >
                {program.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nom du programme
                </label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Couleur principale
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="focus:ring-brand-500 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Texte du bouton widget
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Message d&apos;accueil
                </label>
                <input
                  type="text"
                  value={welcomeMsg}
                  onChange={(e) => setWelcomeMsg(e.target.value)}
                  placeholder="Bienvenue dans notre programme !"
                  className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Clé publique :{' '}
                <code className="rounded bg-gray-100 px-1">{program.public_key}</code>
              </p>
              <button
                onClick={updateProgram}
                disabled={saving}
                className="bg-brand-600 hover:bg-brand-700 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </section>

          {/* Earning rules */}
          <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="font-semibold text-gray-900">Règles de gain</h2>
            {program.earning_rules.filter((r) => r.is_active).length === 0 ? (
              <p className="text-sm text-gray-500">Aucune règle. Ajoutez-en une ci-dessous.</p>
            ) : (
              <ul className="space-y-2">
                {program.earning_rules
                  .filter((r) => r.is_active)
                  .map((rule) => (
                    <li
                      key={rule.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                    >
                      <span className="text-sm text-gray-700">
                        {rule.type === 'PER_VISIT'
                          ? `${rule.points_per_unit} point${rule.points_per_unit > 1 ? 's' : ''} par visite`
                          : `${rule.points_per_unit} point${rule.points_per_unit > 1 ? 's' : ''} par € dépensé${rule.minimum_amount ? ` (min. ${rule.minimum_amount}€)` : ''}`}
                      </span>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </li>
                  ))}
              </ul>
            )}
            <form onSubmit={addRule} className="flex gap-3 border-t border-gray-100 pt-2">
              <select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value as typeof ruleType)}
                className="focus:ring-brand-500 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              >
                <option value="PER_VISIT">Par visite</option>
                <option value="PER_AMOUNT_SPENT">Par montant dépensé</option>
              </select>
              <input
                type="number"
                min="1"
                max="1000"
                value={rulePoints}
                onChange={(e) => setRulePoints(e.target.value)}
                placeholder="Points"
                required
                className="focus:ring-brand-500 w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              />
              {ruleType === 'PER_AMOUNT_SPENT' && (
                <input
                  type="number"
                  min="1"
                  value={ruleMin}
                  onChange={(e) => setRuleMin(e.target.value)}
                  placeholder="Min. (€)"
                  className="focus:ring-brand-500 w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              )}
              <button
                type="submit"
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                Ajouter
              </button>
            </form>
          </section>

          {/* Rewards */}
          <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="font-semibold text-gray-900">Récompenses</h2>
            {program.rewards.filter((r) => r.is_active).length === 0 ? (
              <p className="text-sm text-gray-500">Aucune récompense. Ajoutez-en une ci-dessous.</p>
            ) : (
              <ul className="space-y-2">
                {program.rewards
                  .filter((r) => r.is_active)
                  .map((reward) => (
                    <li
                      key={reward.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{reward.name}</p>
                        {reward.description && (
                          <p className="text-xs text-gray-500">{reward.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-brand-600 text-sm font-semibold">
                          {reward.points_required} pts
                        </span>
                        <button
                          onClick={() => deleteReward(reward.id)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
            <form onSubmit={addReward} className="flex gap-3 border-t border-gray-100 pt-2">
              <input
                type="text"
                value={rewardName}
                onChange={(e) => setRewardName(e.target.value)}
                placeholder="Nom (ex: Café offert)"
                required
                className="focus:ring-brand-500 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              />
              <input
                type="text"
                value={rewardDesc}
                onChange={(e) => setRewardDesc(e.target.value)}
                placeholder="Description (optionnel)"
                className="focus:ring-brand-500 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              />
              <input
                type="number"
                min="1"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                placeholder="Points"
                required
                className="focus:ring-brand-500 w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              />
              <button
                type="submit"
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                Ajouter
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  )
}
