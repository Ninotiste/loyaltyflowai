# User Stories — Index

> **Projet :** LoyaltyFlowAI
> **Lié à :** [PRD.md](../PRD.md) | [MASTER_PLAN.md §12](../../../MASTER_PLAN.md#12-objectifs-du-mvp)

---

## Format standard

Chaque user story suit le format :

```
En tant que [persona],
Je veux [action],
Afin de [bénéfice mesurable].
```

**Champs obligatoires :**
- Statut : `À affiner` / `Prêt` / `En cours` / `Terminé`
- Priorité : `Must Have` / `Should Have` / `Could Have` / `Won't Have (MVP)`
- Critères d'acceptation (Given / When / Then)
- Définition de "Terminé" (DoD)

---

## Index MVP (Phase 1)

| ID | Module | Titre | Statut | Priorité |
|---|---|---|---|---|
| [US-001](./US-001-auth.md) | Auth | Inscription et connexion sécurisée | À affiner | Must Have |
| [US-002](./US-002-loyalty-program.md) | Programme | Création et gestion du programme de points | À affiner | Must Have |
| [US-003](./US-003-customers.md) | Clients | Import et gestion des clients | À affiner | Must Have |
| [US-004](./US-004-widget.md) | Widget | Widget de fidélité embarquable | À affiner | Must Have |
| [US-005](./US-005-ai-churn.md) | IA | Score de churn et alertes automatiques | À affiner | Must Have |
| [US-006](./US-006-reporting.md) | Reporting | Dashboard et exports | À affiner | Must Have |

---

## User Stories Phase 2+ (non créées)

Ces stories seront rédigées en Phase 1, avant le démarrage de la Phase 2.

- Intégration Shopify
- Programme de parrainage
- Niveaux de fidélité (tiers)
- Notifications email automatisées

---

## Convention de nommage des fichiers

```
US-[NNN]-[module-slug].md
```

Exemple : `US-001-auth.md`, `US-007-referral.md`
