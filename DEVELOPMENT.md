# Guide de développement local

---

## Prérequis

| Outil | Version minimale | Installation |
|---|---|---|
| Node.js | 20 LTS | [nodejs.org](https://nodejs.org) |
| pnpm | 9.14+ | `npm install -g pnpm` |
| Git | 2.x | système |

**Comptes requis :**
- [Supabase](https://supabase.com) — projet de développement (gratuit)
- [Upstash](https://upstash.com) — base Redis de développement (gratuit)
- [Anthropic](https://console.anthropic.com) — clé API Claude (pay-as-you-go)

---

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/[org]/loyaltyflowai
cd loyaltyflowai

# 2. Installer toutes les dépendances (workspaces inclus)
pnpm install

# 3. Générer le client Prisma
pnpm --filter @loyaltyflowai/web exec prisma generate
```

---

## Configuration des variables d'environnement

```bash
cp .env.example apps/web/.env.local
```

Ouvrir `apps/web/.env.local` et remplir chaque variable — voir [ENVIRONMENTS.md](./docs/technical/ENVIRONMENTS.md) pour la liste complète et les instructions de récupération des valeurs.

**Variables minimales pour démarrer :**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:password@db.xxxx.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx
ANTHROPIC_API_KEY=sk-ant-xxxx
RESEND_API_KEY=re_xxxx
CRON_SECRET=une-chaine-aleatoire-de-32-caracteres-minimum
```

---

## Base de données

```bash
# Appliquer toutes les migrations existantes
pnpm --filter @loyaltyflowai/web exec prisma migrate dev

# Vérifier l'état des migrations
pnpm --filter @loyaltyflowai/web exec prisma migrate status

# Ouvrir Prisma Studio (interface visuelle)
pnpm --filter @loyaltyflowai/web exec prisma studio

# Créer une nouvelle migration (après modification du schéma)
pnpm --filter @loyaltyflowai/web exec prisma migrate dev --name nom-de-la-migration
```

> **Important :** `DATABASE_URL` pointe vers PgBouncer (port 6543, pooled) — pour les migrations, `DIRECT_URL` pointe vers PostgreSQL direct (port 5432). Les deux sont nécessaires.

---

## Démarrage

```bash
# Démarrer tous les packages en parallèle (web + worker)
pnpm dev

# Démarrer uniquement l'app web
pnpm --filter @loyaltyflowai/web dev

# Démarrer uniquement le worker
pnpm --filter @loyaltyflowai/worker dev
```

L'app web est disponible sur `http://localhost:3000`.

---

## Commandes de qualité

```bash
pnpm type-check    # TypeScript strict — doit être vert avant tout commit
pnpm lint          # ESLint sur tous les packages
pnpm test          # Tests unitaires (jest + ts-jest)
pnpm format        # Formatage Prettier

# Build de production local (nécessite les vraies env vars)
pnpm build

# Build sans env vars (vérifie la compilation uniquement)
SKIP_ENV_VALIDATION=1 pnpm build
```

---

## Structure des packages

```
packages/config/   → Importer serverEnv ou clientEnv (jamais process.env directement)
packages/logger/   → createLogger('nom-module') pour tous les logs
packages/types/    → Types TypeScript partagés (ChurnLevel, etc.)
packages/ui/       → Composants shadcn/ui (ChurnBadge, etc.)
packages/utils/    → Fonctions pures utilitaires (crypto, calculateChurn core)
```

---

## Workflow quotidien

```bash
git checkout develop
git pull origin develop
git checkout -b feat/ma-feature

# ... développement ...

pnpm type-check && pnpm lint && pnpm test
git add -p
git commit -m "feat(scope): description"
git push origin feat/ma-feature
# → Ouvrir PR vers develop
```

---

## Résolution de problèmes courants

**`Cannot find module '@loyaltyflowai/config'`**
→ `pnpm install` puis `pnpm --filter @loyaltyflowai/web exec prisma generate`

**Erreur de validation des env vars au démarrage**
→ Vérifier que `apps/web/.env.local` contient toutes les variables requises

**Prisma : `P1001 Can't reach database server`**
→ Vérifier `DIRECT_URL` (pas `DATABASE_URL` pour les migrations) et les credentials Supabase

**`pnpm build` échoue sans env vars**
→ Utiliser `SKIP_ENV_VALIDATION=1 pnpm build` pour les builds de vérification uniquement

---

→ [CONTRIBUTING.md](./CONTRIBUTING.md) | [DEPLOYMENT.md](./DEPLOYMENT.md) | [Environnements](./docs/technical/ENVIRONMENTS.md)
