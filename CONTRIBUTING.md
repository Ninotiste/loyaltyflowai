# Guide de contribution

> LoyaltyFlowAI — Phase 0

---

## Branches

Le dépôt utilise actuellement `main` comme branche par défaut. Créez une branche dédiée pour chaque contribution, puis ouvrez une Pull Request vers `main`.

| Préfixe | Usage |
|---|---|
| `feat/nom-court` | Nouvelles fonctionnalités |
| `fix/nom-court` | Corrections de bugs |
| `chore/nom-court` | Maintenance (dépendances, configuration, documentation) |

---

## Commits

Format : `type(scope): description courte`

```
feat(auth): ajouter la page de connexion Supabase
fix(churn): corriger le calcul du score pour les nouveaux clients
chore(deps): mettre à jour une dépendance
docs(arch): documenter une décision d'architecture
```

**Types :** `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`

---

## Pull Requests

1. Partez de la branche à jour `main`.
2. Créez une branche descriptive, par exemple `docs/corriger-guide-installation`.
3. Faites des changements ciblés et vérifiez-les localement.
4. Lancez les vérifications disponibles dans le projet :
   - `pnpm type-check`
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build` (si la configuration locale le permet)
5. Ouvrez une Pull Request vers `main`.
6. Décrivez le contexte, les changements et les vérifications effectuées.

Si une commande ne peut pas être exécutée faute de configuration ou de services externes, indiquez-le clairement dans la Pull Request au lieu de prétendre qu'elle a réussi.

---

## Conventions de code

### TypeScript
- Respecter le mode strict et éviter `any` lorsque c'est possible.
- Ne pas préfixer les interfaces par `I` (`User`, pas `IUser`).
- Préférer les exports nommés ; suivre les conventions requises par Next.js pour ses pages et routes.
- Garder les types Prisma et les types métier séparés (voir `packages/types`).

### Nommage
- Fichiers : `kebab-case.ts`
- Composants : `PascalCase.tsx`
- Variables et fonctions : `camelCase`
- Constantes globales : `SCREAMING_SNAKE_CASE`
- Variables d'environnement : `SCREAMING_SNAKE_CASE`

### Structure
- Placer la logique métier dans les modules dédiés de `apps/web/`.
- Placer les composants UI partagés dans `packages/ui/`.
- Placer les types partagés dans `packages/types/`.
- Placer les fonctions utilitaires pures dans `packages/utils/`.
- Éviter la logique métier directement dans les composants React.
- Utiliser le logger du projet plutôt que des `console.log` laissés dans le code.

### Variables d'environnement
- Suivre la configuration centralisée de `@loyaltyflowai/config` lorsqu'elle est disponible.
- Ne jamais committer de secrets, clés API, mots de passe ou fichiers d'environnement locaux.
- Réserver les variables `NEXT_PUBLIC_*` aux valeurs qui peuvent être exposées dans le navigateur.

---

## Tests

- Ajouter ou mettre à jour les tests pertinents pour chaque changement.
- Placer les tests près du code testé, selon les conventions du package concerné.
- Ne pas dépendre de services externes dans les tests unitaires.
- Documenter les prérequis des tests d'intégration qui nécessitent une base de données ou un service externe.

---

## Dépendances

- Justifier l'ajout d'une dépendance (utilité, maintenance, alternatives).
- Préférer les packages maintenus et disposant de types TypeScript adaptés.
- Éviter d'ajouter une dépendance pour une fonctionnalité simple déjà couverte par la plateforme.

---

→ [Guide de développement local](./DEVELOPMENT.md) | [Architecture](./docs/technical/ARCHITECTURE.md)
