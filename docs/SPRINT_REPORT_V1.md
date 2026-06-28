# Sprint Report V1 — LoyaltyFlowAI MVP

**Période :** Sprint 2 → Sprint 6  
**Statut :** Terminé  
**TypeScript :** 0 erreur  
**Tests :** 26/26 ✅

---

## Sprint 2 — API Core + Auth + Dashboard

### Routes API créées (22 endpoints)

| Méthode          | Route                                 | Description                                |
| ---------------- | ------------------------------------- | ------------------------------------------ |
| POST             | `/api/v1/auth/setup`                  | Création organisation + admin (idempotent) |
| GET/POST/PATCH   | `/api/v1/programs/current`            | Programme fidélité                         |
| POST             | `/api/v1/programs/earning-rules`      | Règles de gain                             |
| DELETE           | `/api/v1/programs/earning-rules/[id]` | Suppression règle                          |
| POST             | `/api/v1/programs/rewards`            | Création récompense                        |
| PATCH/DELETE     | `/api/v1/programs/rewards/[id]`       | Gestion récompense                         |
| GET/POST         | `/api/v1/customers`                   | Liste paginée + création client            |
| GET/PATCH/DELETE | `/api/v1/customers/[id]`              | Profil client complet                      |
| POST             | `/api/v1/customers/[id]/points`       | Attribution points (montant ou manuel)     |
| POST             | `/api/v1/customers/[id]/redeem`       | Utilisation récompense                     |
| GET              | `/api/v1/customers/[id]/export`       | Export RGPD JSON (Art.15)                  |
| POST             | `/api/v1/customers/[id]/anonymize`    | Anonymisation RGPD (Art.17)                |
| GET/POST         | `/api/v1/team`                        | Équipe + invitations                       |
| DELETE           | `/api/v1/team/[memberId]`             | Révocation accès                           |
| GET              | `/api/v1/team/accept/[token]`         | Acceptation invitation (public)            |
| GET              | `/api/v1/dashboard/metrics`           | KPIs tableau de bord                       |

### Pages dashboard créées

- `/dashboard` — Vue d'ensemble avec métriques réelles
- `/dashboard/customers` — Liste paginée (cursor-based), filtres churn
- `/dashboard/customers/[id]` — Profil complet, attribution points, export/anonymize
- `/dashboard/program` — Éditeur programme, règles, récompenses
- `/dashboard/settings` — Équipe, abonnement, RGPD
- Login/Register — Auth Supabase réelle (signInWithPassword, signUp)

---

## Sprint 3 — Widget + Billing

### Widget JS (`/public/widget.js`)

- Architecture vanilla JS + Shadow DOM (< 30KB gzip estimé)
- Flux complet : inscription → identification → carte points → récompense
- Stockage token JWT en sessionStorage (7 jours)
- Code de récompense généré côté client

### Routes Widget (public, auth via public_key + JWT)

| Route                          | Description                                   |
| ------------------------------ | --------------------------------------------- |
| `POST /api/v1/widget/identify` | Identification client existant                |
| `POST /api/v1/widget/register` | Inscription nouveau client + consentement     |
| `GET /api/v1/widget/status`    | État compte (points, récompenses, historique) |
| `POST /api/v1/widget/redeem`   | Utilisation récompense via widget             |

### Routes Billing (mock Stripe)

| Route                              | Description              |
| ---------------------------------- | ------------------------ |
| `GET /api/v1/billing/subscription` | Plan actuel + usage      |
| `POST /api/v1/billing/upgrade`     | Changement de plan       |
| `GET /api/v1/billing/invoices`     | Factures (3 mois mockés) |

---

## Sprint 4 — Loyalty Brain + Analytics

### Routes IA

- `POST /api/v1/ai/suggest` — Suggestion campagne (Claude claude-sonnet-4-6 ou mock)
- `POST /api/v1/alerts/send-reactivation` — Envoi email réactivation client

### Pages créées

- `/dashboard/alerts` — Clients HIGH churn + suggestion IA + envoi campagne
- `/dashboard/analytics` — KPIs, distribution clients, recommandations Loyalty Brain

---

## Sprint 5 — Qualité

### Tests unitaires

```
packages/utils/src/__tests__/
├── churn.test.ts     — 9 tests (getDaysSinceLastVisit, calculateChurnLevel)
├── crypto.test.ts    — 4 tests (generatePublicKey)
└── format.test.ts    — 13 tests (formatPoints, formatDate, maskEmail)

Total : 26 tests, 0 échec
```

### Type-check

```
7 packages vérifiés, 0 erreur TypeScript
```

### Dépendances installées

- `jose` — JWT pour widget (SignJWT, jwtVerify)
- `stripe` — SDK Stripe v22 (mock actif par défaut)

---

## Sprint 6 — Launch Prep

### Onboarding flow (`/onboarding`)

Flow 4 étapes guidé :

1. Profil — Présentation + confirmation compte créé
2. Programme — Type de gains (visite/montant), récompense initiale, couleur
3. Widget — Snippet copie-coller avec la clé publique
4. Équipe — Invitation employés (optionnel)

### Error boundaries

- `app/error.tsx` — Boundary global avec rapport d'erreur
- `app/loading.tsx` — Skeleton global

### RGPD vérification finale

- Export JSON structuré (Art.15) — `/api/v1/customers/[id]/export`
- Anonymisation PII (Art.17) — `/api/v1/customers/[id]/anonymize`
- Suppression ChurnScores à l'anonymisation
- Email anonymisé : `anonymized-{id}@deleted.invalid`
- Transactions conservées (obligation comptable Art.6.1.c)

---

## Architecture finale

```
apps/web/
├── app/
│   ├── (auth)/           → /login, /register
│   ├── (dashboard)/
│   │   └── dashboard/    → /dashboard/* (layout avec sidebar)
│   ├── onboarding/       → /onboarding (hors sidebar)
│   └── api/v1/           → 26 routes REST
├── lib/
│   ├── auth.ts           → requireAuth(), apiError(), apiSuccess()
│   ├── ai.ts             → suggestCampaign(), generateReactivationMessage()
│   ├── email.ts          → 6 templates email (mock Resend)
│   └── stripe.ts         → getSubscription(), upgradePlan() (mock Stripe)
└── public/
    └── widget.js         → Widget vanilla JS (Shadow DOM)

packages/utils/           → 3 modules testés à 100% (churn, crypto, format)
```

---

## Dette technique

| Priorité | Description                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| P0       | Migrer le schéma Prisma en production (`prisma migrate deploy`)               |
| P0       | Brancher les vraies clés : Supabase, Stripe, Resend, Anthropic                |
| P0       | Configurer CRON_SECRET + NEXT_PUBLIC_APP_URL en production                    |
| P1       | Webhook Stripe (`/api/webhooks/stripe`) — handler à compléter                 |
| P1       | Pagination cursor-based dans l'UI — `loadMore` à tester en charge             |
| P1       | Test E2E avec Playwright (flow inscription → attribution points → récompense) |
| P2       | Analytics avancées avec recharts (graphiques historique 12 semaines)          |
| P2       | Export ZIP RGPD (toutes les données org)                                      |
| P2       | Notifications push (service worker)                                           |
| P3       | Internationalisation (anglais pour expansion hors France)                     |

---

## Prochaines priorités (Sprint 7)

1. **Déploiement Vercel** — Configurer les variables d'environnement de production
2. **Migration Supabase** — `prisma migrate deploy` sur la base de prod
3. **Clés réelles** — Stripe (sandbox), Resend, Anthropic
4. **5 premiers bêta-testeurs** — Restaurateurs pilotes à Paris
5. **Monitoring** — Sentry + Vercel Analytics + alertes Upstash
