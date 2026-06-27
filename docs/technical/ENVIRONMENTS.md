# ENVIRONMENTS.md — Environnements et configuration

> **Projet :** LoyaltyFlowAI
> **Version :** 0.2.0
> **Statut :** Phase 0 — Fondation (post-hardening)
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [ARCHITECTURE.md](./ARCHITECTURE.md) | [DEVELOPMENT.md](../../DEVELOPMENT.md) | [DEPLOYMENT.md](../../DEPLOYMENT.md)

---

## Sommaire

1. [Environnements](#1-environnements)
2. [Variables d'environnement](#2-variables-denvironnement)
3. [Configuration Vercel](#3-configuration-vercel)
4. [Configuration Supabase](#4-configuration-supabase)
5. [Configuration Upstash](#5-configuration-upstash)
6. [Démarrage en développement local](#6-démarrage-en-développement-local)

---

## 1. Environnements

| Environnement | URL | Branche Git | Usage |
|---|---|---|---|
| **Development** | `localhost:3000` | N/A (local) | Développement quotidien |
| **Staging** | `staging.loyaltyflowai.com` | `develop` | Tests avant production |
| **Production** | `app.loyaltyflowai.com` | `main` | Clients réels |

**Règles :**
- Staging utilise une base de données séparée de la production (projets Supabase distincts)
- Aucune donnée de production n'est copiée en staging
- Les migrations sont toujours testées en staging avant production

---

## 2. Variables d'environnement

> Le fichier `.env.example` à la racine du repo contient toutes les variables avec des valeurs d'exemple.
> Les vraies valeurs ne sont jamais dans Git — elles sont dans Vercel (prod/staging) et `.env.local` (dev).
> La validation est effectuée par `packages/config` au premier accès (validation lazy).

### Variables requises — `apps/web`

```bash
# ─── Base de données (Prisma) ─────────────────────────────
# Connexion poolée via PgBouncer — utilisée par l'application en production
DATABASE_URL=postgresql://postgres:password@db.xxxx.supabase.co:6543/postgres?pgbouncer=true

# Connexion directe (non-poolée) — utilisée par prisma migrate UNIQUEMENT
DIRECT_URL=postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres

# ─── Supabase ─────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co       # URL publique du projet
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                    # Clé publique (frontend, RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJ...                        # Clé privée (contourne RLS — JAMAIS exposée côté client)

# ─── Upstash Redis ────────────────────────────────────────
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx

# ─── Anthropic Claude ─────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-xxxx

# ─── Resend (emails transactionnels) ──────────────────────
RESEND_API_KEY=re_xxxx

# ─── Sécurité ─────────────────────────────────────────────
# Minimum 32 caractères — générer avec: openssl rand -base64 32
CRON_SECRET=une-chaine-aleatoire-de-32-caracteres-minimum

# ─── Application ──────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://app.loyaltyflowai.com
NODE_ENV=production

# ─── Build (CI uniquement) ────────────────────────────────
# Mettre à 1 pour permettre le build sans vraies credentials
# N'utiliser qu'en CI — jamais en production
SKIP_ENV_VALIDATION=1
```

### Variables requises — `apps/worker`

```bash
DATABASE_URL=postgresql://...      # Même connexion poolée que apps/web
DIRECT_URL=postgresql://...        # Connexion directe (si migrations depuis le worker)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
ANTHROPIC_API_KEY=...
```

### Règles de sécurité
- Les variables préfixées `NEXT_PUBLIC_` sont exposées au navigateur — ne jamais y mettre de secrets
- `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais apparaître dans du code côté client
- `ANTHROPIC_API_KEY` et `CRON_SECRET` sont des secrets serveur stricts
- Accéder aux variables via `serverEnv` ou `clientEnv` de `@loyaltyflowai/config` — jamais `process.env` directement

---

## 3. Configuration Vercel

### Projets Vercel
| Projet | App | Environnements |
|---|---|---|
| `loyaltyflowai-web` | `apps/web` | production, preview (staging) |
| `loyaltyflowai-worker` | `apps/worker` | production, preview (staging) |

### Déploiement automatique
- **Production** : déclenchée par un merge sur `main`
- **Staging** : déclenchée par un merge sur `develop`
- **Preview** : déclenchée par chaque PR (URL unique par PR)

---

## 4. Configuration Supabase

### Projets Supabase
| Projet | Environnement | Région |
|---|---|---|
| `loyaltyflowai-prod` | Production | eu-central-1 (Frankfurt) |
| `loyaltyflowai-staging` | Staging | eu-central-1 (Frankfurt) |

### Paramètres Auth
- **JWT expiry :** 900s (15 minutes)
- **Refresh token rotation :** activée
- **Email templates :** personnalisés avec le branding LoyaltyFlowAI
- **URL de redirection autorisées :** `https://app.loyaltyflowai.com`, `https://staging.loyaltyflowai.com`, `http://localhost:3000`

### Row-Level Security
- RLS activée sur toutes les tables (voir [SECURITY.md §7](./SECURITY.md#7-multi-tenancy))
- Les politiques RLS sont documentées dans `apps/web/prisma/rls-policies.sql`

### Connexions DATABASE_URL vs DIRECT_URL
- **`DATABASE_URL`** (port 6543) → PgBouncer (connection pooler) — pour l'application en production
- **`DIRECT_URL`** (port 5432) → PostgreSQL direct — pour `prisma migrate` uniquement
- Les deux URLs sont obligatoires depuis la configuration Prisma (ADR-004)

---

## 5. Configuration Upstash

### Bases de données Redis
| Base | Environnement | Région |
|---|---|---|
| `loyaltyflowai-prod` | Production | eu-west-1 (Ireland) |
| `loyaltyflowai-staging` | Staging | eu-west-1 (Ireland) |

### Utilisation
| Clé Redis | TTL | Usage |
|---|---|---|
| `widget:customer:{id}` | 60s | Cache données widget client |
| `rate_limit:{ip}:{endpoint}` | 900s | Rate limiting auth |
| `rate_limit:{token}` | 60s | Rate limiting API dashboard |
| `churn:job:lock` | 3600s | Lock du job quotidien de churn |

---

## 6. Démarrage en développement local

→ [Guide complet dans DEVELOPMENT.md](../../DEVELOPMENT.md)

**Setup rapide :**
```bash
pnpm install
cp .env.example apps/web/.env.local
# → Remplir apps/web/.env.local avec les valeurs de dev
pnpm --filter @loyaltyflowai/web exec prisma generate
pnpm --filter @loyaltyflowai/web exec prisma migrate dev
pnpm dev
```
