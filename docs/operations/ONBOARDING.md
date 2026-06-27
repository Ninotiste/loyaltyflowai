# ONBOARDING.md — Guide d'onboarding équipe

> **Projet :** LoyaltyFlowAI
> **Version :** 0.1.0
> **Statut :** En cours de rédaction — Phase 0
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [ENVIRONMENTS.md](../technical/ENVIRONMENTS.md) | [ARCHITECTURE.md](../technical/ARCHITECTURE.md) | [RUNBOOK.md](./RUNBOOK.md)

---

## Sommaire

1. [Bienvenue](#1-bienvenue)
2. [Accès et outils à configurer](#2-accès-et-outils-à-configurer)
3. [Setup de l'environnement de développement](#3-setup-de-lenvironnement-de-développement)
4. [Comprendre le projet](#4-comprendre-le-projet)
5. [Workflow de développement](#5-workflow-de-développement)
6. [Checklist première semaine](#6-checklist-première-semaine)

---

## 1. Bienvenue

Bienvenue dans l'équipe LoyaltyFlowAI.

Ce guide te permettra d'être opérationnel en moins d'une journée. Lis-le dans l'ordre, ne saute pas d'étapes.

**Avant de commencer :** assure-toi que le fondateur t'a transmis les accès listés en §2.

---

## 2. Accès et outils à configurer

### Accès à demander au fondateur
- [ ] GitHub : invitation au repository
- [ ] Linear : invitation au workspace
- [ ] Vercel : invitation au projet (rôle Viewer ou Developer)
- [ ] Supabase : invitation au projet staging
- [ ] Sentry : invitation à l'organisation
- [ ] Upstash : accès en lecture à la console

### Outils à installer localement
- [ ] **Node.js ≥ 20** — [nodejs.org](https://nodejs.org)
- [ ] **pnpm ≥ 9** — `npm install -g pnpm`
- [ ] **Git** — configuré avec ton email
- [ ] **VS Code** (recommandé) avec les extensions :
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense
  - TypeScript (built-in)

### Configuration Git
```bash
git config --global user.name "Ton Prénom Nom"
git config --global user.email "ton@email.com"
```

---

## 3. Setup de l'environnement de développement

### Étape 1 — Cloner le repo
```bash
git clone https://github.com/[org]/loyaltyflowai
cd loyaltyflowai
```

### Étape 2 — Installer les dépendances
```bash
pnpm install
```

### Étape 3 — Variables d'environnement
```bash
cp .env.example apps/web/.env.local
cp .env.example apps/worker/.env.local
```

Remplir les variables avec les valeurs de développement (transmises par le fondateur via un canal sécurisé — jamais par email).

→ [Liste complète des variables](../technical/ENVIRONMENTS.md#2-variables-denvironnement)

### Étape 4 — Base de données
```bash
cd apps/web
pnpm prisma migrate dev    # Applique les migrations
pnpm prisma db seed        # Données de test (si disponibles)
pnpm prisma studio         # Interface visuelle de la DB (optionnel)
```

### Étape 5 — Démarrer le développement
```bash
# Depuis la racine du monorepo
pnpm dev
```

L'application est accessible sur `http://localhost:3000`.

---

## 4. Comprendre le projet

### Documents à lire dans l'ordre
1. **[README.md](../../README.md)** — Vue d'ensemble (15 min)
2. **[MASTER_PLAN.md](../../MASTER_PLAN.md)** — Vision, stratégie, stack (45 min)
3. **[docs/product/PRD.md](../product/PRD.md)** — Ce qu'on construit (30 min)
4. **[docs/technical/ARCHITECTURE.md](../technical/ARCHITECTURE.md)** — Comment c'est construit (30 min)
5. **[docs/technical/DATABASE.md](../technical/DATABASE.md)** — Le schéma de données (20 min)

### Questions fréquentes
**Pourquoi Next.js full-stack et pas NestJS séparé ?**
→ Voir [ADR-001](../technical/ARCHITECTURE.md#adr-001--nextjs-full-stack-api-routes)

**Pourquoi Supabase et pas PostgreSQL hébergé directement ?**
→ Voir [ADR-003](../technical/ARCHITECTURE.md#adr-003--vercel--supabase--upstash)

**Comment fonctionne le multi-tenant ?**
→ Voir [SECURITY.md §7](../technical/SECURITY.md#7-multi-tenancy)

---

## 5. Workflow de développement

### Branches
```
main        ← Production (merge via PR uniquement)
develop     ← Staging (intégration continue)
feat/xxx    ← Nouvelles fonctionnalités
fix/xxx     ← Corrections de bugs
docs/xxx    ← Documentation
```

### Créer une feature
```bash
git checkout develop
git pull origin develop
git checkout -b feat/nom-de-la-feature
# Développer...
git commit -m "feat(module): description courte en impératif"
# Ouvrir une PR vers develop
```

### Convention de commits
→ [Conventional Commits](../../MASTER_PLAN.md#17-règles-de-développement)

```
feat(loyalty): add points calculation engine
fix(auth): resolve token expiration edge case
docs(api): update endpoint documentation
```

### Avant d'ouvrir une PR
- [ ] Tests unitaires écrits et passants (`pnpm test`)
- [ ] Lint passant (`pnpm lint`)
- [ ] TypeScript sans erreurs (`pnpm type-check`)
- [ ] Testé manuellement sur `localhost:3000`
- [ ] Description de PR remplie (quoi, pourquoi, comment tester)

### Review de code
- Minimum 1 review avant merge
- Utiliser la [checklist de review](../../MASTER_PLAN.md#17-règles-de-développement)

---

## 6. Checklist première semaine

### Jour 1 — Setup
- [ ] Accès configurés (§2)
- [ ] Environnement de développement fonctionnel (§3)
- [ ] Documents fondateurs lus (§4)
- [ ] Présentation rapide du projet avec le fondateur

### Jour 2-3 — Exploration
- [ ] Explorer le code existant (si Phase 1+)
- [ ] Lire les user stories du module qui te concerne
- [ ] Faire tourner les tests existants

### Jour 4-5 — Première contribution
- [ ] Identifier une première tâche dans Linear
- [ ] Ouvrir ta première PR (même petite)
- [ ] Recevoir ta première review

### Fin de première semaine
- [ ] Retour au fondateur : ce qui était clair, ce qui était flou
- [ ] Mise à jour de ce document si quelque chose manquait
