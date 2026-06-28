'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, CheckCheck, Gift, Zap, Settings2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

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
  const [keyCopied, setKeyCopied] = useState(false)

  const [ruleType, setRuleType] = useState<'PER_VISIT' | 'PER_AMOUNT_SPENT'>('PER_VISIT')
  const [rulePoints, setRulePoints] = useState('1')
  const [ruleMin, setRuleMin] = useState('')

  const [rewardName, setRewardName] = useState('')
  const [rewardDesc, setRewardDesc] = useState('')
  const [rewardPoints, setRewardPoints] = useState('100')

  const [programName, setProgramName] = useState('')
  const [welcomeMsg, setWelcomeMsg] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [color, setColor] = useState('#7c3aed')

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
          setColor(p.primary_color ?? '#7c3aed')
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

  function copyKey() {
    if (!program) return
    navigator.clipboard.writeText(program.public_key)
    setKeyCopied(true)
    setTimeout(() => setKeyCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Programme de fidélité"
        description="Configurez vos règles de gain et vos récompenses."
      />

      {!program ? (
        <div className="panel flex flex-col items-center p-10 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
            <Gift className="h-8 w-8 text-violet-600" />
          </div>
          <h2 className="font-display mb-2 text-xl font-bold text-zinc-900">
            Créer votre programme
          </h2>
          <p className="mb-6 max-w-sm text-sm text-zinc-500">
            Donnez un nom à votre programme et commencez à fidéliser vos clients en quelques
            minutes.
          </p>
          <div className="flex gap-3">
            <Input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              placeholder="Club Fidèle du Bistrot"
              className="w-64"
            />
            <Button onClick={createProgram} loading={saving}>
              Créer le programme
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Settings section */}
          <section className="panel space-y-5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-zinc-400" />
                <h2 className="font-display text-base font-bold text-zinc-900">Paramètres</h2>
              </div>
              <Badge variant={program.status === 'ACTIVE' ? 'success' : 'secondary'} dot size="md">
                {program.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nom du programme"
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700">Couleur principale</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-xl border border-zinc-200 p-1"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>
              <Input
                label="Texte du bouton widget"
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
              />
              <Input
                label="Message d'accueil"
                type="text"
                value={welcomeMsg}
                onChange={(e) => setWelcomeMsg(e.target.value)}
                placeholder="Bienvenue dans notre programme !"
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Clé publique :</span>
                <code className="rounded-lg bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600">
                  {program.public_key}
                </code>
                <button
                  onClick={copyKey}
                  className="text-zinc-400 transition-colors hover:text-violet-600"
                  title="Copier"
                >
                  {keyCopied ? (
                    <CheckCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Button onClick={updateProgram} loading={saving} size="sm">
                Enregistrer
              </Button>
            </div>
          </section>

          {/* Earning rules */}
          <section className="panel space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <h2 className="font-display text-base font-bold text-zinc-900">Règles de gain</h2>
            </div>

            {program.earning_rules.filter((r) => r.is_active).length === 0 ? (
              <p className="text-sm italic text-zinc-400">
                Aucune règle. Ajoutez-en une ci-dessous.
              </p>
            ) : (
              <ul className="space-y-2">
                {program.earning_rules
                  .filter((r) => r.is_active)
                  .map((rule) => (
                    <li
                      key={rule.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-sm text-zinc-700">
                          {rule.type === 'PER_VISIT'
                            ? `${rule.points_per_unit} point${rule.points_per_unit > 1 ? 's' : ''} par visite`
                            : `${rule.points_per_unit} point${rule.points_per_unit > 1 ? 's' : ''} par € dépensé${rule.minimum_amount ? ` (min. ${rule.minimum_amount}€)` : ''}`}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}

            <form onSubmit={addRule} className="flex gap-3 border-t border-zinc-100 pt-2">
              <select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value as typeof ruleType)}
                className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
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
                className="h-10 w-24 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
              {ruleType === 'PER_AMOUNT_SPENT' && (
                <input
                  type="number"
                  min="1"
                  value={ruleMin}
                  onChange={(e) => setRuleMin(e.target.value)}
                  placeholder="Min. (€)"
                  className="h-10 w-28 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              )}
              <Button type="submit" variant="secondary" size="md" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </form>
          </section>

          {/* Rewards */}
          <section className="panel space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-violet-600" />
              <h2 className="font-display text-base font-bold text-zinc-900">Récompenses</h2>
            </div>

            {program.rewards.filter((r) => r.is_active).length === 0 ? (
              <p className="text-sm italic text-zinc-400">
                Aucune récompense. Ajoutez-en une ci-dessous.
              </p>
            ) : (
              <ul className="space-y-2">
                {program.rewards
                  .filter((r) => r.is_active)
                  .map((reward) => (
                    <li
                      key={reward.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{reward.name}</p>
                        {reward.description && (
                          <p className="text-xs text-zinc-500">{reward.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="primary" size="md">
                          {reward.points_required} pts
                        </Badge>
                        <button
                          onClick={() => deleteReward(reward.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}

            <form onSubmit={addReward} className="flex gap-3 border-t border-zinc-100 pt-2">
              <input
                type="text"
                value={rewardName}
                onChange={(e) => setRewardName(e.target.value)}
                placeholder="Café offert"
                required
                className="h-10 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
              <input
                type="text"
                value={rewardDesc}
                onChange={(e) => setRewardDesc(e.target.value)}
                placeholder="Description (optionnel)"
                className="h-10 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
              <input
                type="number"
                min="1"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                placeholder="Points"
                required
                className="h-10 w-24 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
              <Button type="submit" variant="secondary" size="md" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </form>
          </section>
        </>
      )}
    </div>
  )
}
