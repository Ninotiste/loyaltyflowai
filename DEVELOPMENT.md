# Guide de développement local

---

## Prérequis

| Outil | Version minimale | Installation |
|---|---|---|
| Node.js | 20 LTS | [nodejs.org](https://nodejs.org) |
| pnpm | 9.14+ | `npm install -g pnpm` |
| Git | 2.x | système |

**Services externes utilisés par certaines fonctionnalités :**
- [Supabase](https://supabase.com) — base de données de développement
- [Upstash](https://upstash.com) — Redis de développement
- [Anthropic](https://console.anthropic.com) — API Claude
- [Resend](https://resend.com) — envoi d'e-mails, si cette fonctionnalité est activée

Les comptes et clés nécessaires dépendent des fonctionnalités que vous souhaitez exécuter localement.

---

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Ninotiste/loyaltyflowai.git
cd loyaltyflowai

# 2. Installer les dépendances
pnpm install

# 3. Générer le client Prisma
pnpm --filter @loyaltyflowai/web exec prisma generate
```

---

## Configuration des variables d'environnement

Si le fichier `.env.example` existe à la racine :

```bash
cp .env.example apps/web/.env.local
```

Complétez uniquement les variables nécessaires à votre environnement local. Consultez [ENVIRONMENTS.md](./docs/technical/ENVIRONMENTS.md) pour les détails.

**Sécurité :**
- Ne partagez jamais vos clés API, mots de passe ou jetons.
- Ne commitez pas `.env`, `.env.local` ou tout fichier contenant des secrets.
- Utilisez des valeurs de test pour le développement lorsque c'est possible.
- Les variables `NEXT_PUBLIC_*` sont exposées au navigateur : n'y placez aucun secret.

---

## Base de données

```bash
# Appliquer les migrations existantes
pnpm --filter @loyaltyflowai/web exec prisma migrate dev

# Vérifier l'état des migrations
pnpm --filter @loyaltyflowai/web exec prisma migrate status

# Ouvrir Prisma Studio
pnpm --filter @loyaltyflowai/web exec prisma studio

# Créer une migration après modification du schéma
pnpm --filter @loyaltyflowai/web exec prisma migrate dev --name nom-de-la-migration
```

Vérifiez la configuration Prisma du projet avant d'exécuter des migrations. Utilisez la connexion directe prévue pour les migrations si le projet distingue une URL directe d'une URL poolée.

---

## Démarrage

```bash
# Démarrer les applications et packages configurés
pnpm dev

# Démarrer uniquement l'application web
pnpm --filter @loyaltyflowai/web dev

# Démarrer uniquement le worker, si son script dev est configuré
pnpm --filter @loyaltyflowai/worker dev
```

L'application web est généralement disponible sur `http://localhost:3000`, selon la configuration locale.

---

## Commandes de qualité

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm format
pnpm build
```

Certaines commandes peuvent nécessiter des variables d'environnement ou des services externes. Consultez les scripts définis dans les fichiers `package.json` des packages avant de les exécuter.

---

## Structure des packages

```
packages/config/   → Configuration et validation des variables d'environnement
packages/logger/   → Logger partagé
packages/types/    → Types TypeScript partagés
packages/ui/       → Composants UI partagés
packages/utils/    → Fonctions utilitaires partagées
```

---

## Workflow de contribution

Le dépôt utilise `main` comme branche par défaut. Pour contribuer :

```bash
git switch main
git pull origin main
git switch -c docs/ma-contribution

# ... effectuer les changements ...

pnpm type-check
pnpm lint
pnpm test
git add .
git commit -m "docs(scope): décrire le changement"
git push -u origin docs/ma-contribution
```

Ouvrez ensuite une Pull Request de votre branche vers `main`. Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour les conventions détaillées.

---

## Résolution de problèmes courants

**Dépendances ou packages introuvables**
→ Vérifiez la version de Node.js et de pnpm, puis relancez `pnpm install`.

**Erreur de validation des variables d'environnement**
→ Vérifiez les variables requises par la fonctionnalité lancée et leur présence dans votre fichier local.

**Prisma ne peut pas joindre la base de données**
→ Vérifiez les URLs et identifiants de connexion, ainsi que l'accessibilité du projet Supabase.

**Le build échoue sans variables d'environnement**
→ Consultez la configuration du projet pour connaître les variables nécessaires. N'utilisez un mode de contournement de validation que s'il est explicitement prévu par le projet.

---

→ [CONTRIBUTING.md](./CONTRIBUTING.md) | [DEPLOYMENT.md](./DEPLOYMENT.md) | [Environnements](./docs/technical/ENVIRONMENTS.md)
