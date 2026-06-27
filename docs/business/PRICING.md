# PRICING.md — Stratégie de pricing

> **Projet :** LoyaltyFlowAI
> **Version :** 0.1.0
> **Statut :** Décidé — à valider avec les design partners
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [MASTER_PLAN.md §5](../../MASTER_PLAN.md#5-objectifs-business) | [GTM.md](./GTM.md) | [METRICS.md](./METRICS.md)

---

## Sommaire

1. [Philosophie de pricing](#1-philosophie-de-pricing)
2. [Plans tarifaires](#2-plans-tarifaires)
3. [Essai gratuit](#3-essai-gratuit)
4. [Logique de passage d'un plan à l'autre](#4-logique-de-passage-dun-plan-à-lautre)
5. [Pricing et segments](#5-pricing-et-segments)
6. [Hypothèses à valider](#6-hypothèses-à-valider)
7. [Révision du pricing](#7-révision-du-pricing)

---

## 1. Philosophie de pricing

> "Le prix doit refléter la valeur créée, pas le coût de la solution."

**Unité de valeur choisie : le nombre de clients actifs.**

Nous choisissons de faire payer en fonction du nombre de clients dans la base, car :
- C'est un indicateur direct de la valeur reçue (plus de clients = plus de fidélisation possible)
- C'est prévisible pour le restaurateur (il sait combien il paie)
- Cela crée un alignement d'intérêts : notre succès = leur succès

**Positionnement prix :** Accessible aux PME, premium vs les outils de stamps basiques.

---

## 2. Plans tarifaires

| Plan | Prix | Limite clients | Features clés |
|---|---|---|---|
| **Starter** | 49 €/mois | Jusqu'à 500 clients | Programme de points, widget, dashboard, score de churn basique |
| **Growth** | 149 €/mois | Jusqu'à 5 000 clients | Tout Starter + alertes avancées, suggestions IA, export avancé |
| **Pro** | 299 €/mois | Illimité | Tout Growth + API access, multi-établissements (Phase 3+), support prioritaire |

*Tous les plans incluent l'essai gratuit de 14 jours.*

*Facturation mensuelle ou annuelle (remise annuelle à définir — suggestion : -20%).*

### Détail des features par plan

| Feature | Starter | Growth | Pro |
|---|---|---|---|
| Programme de points | ✅ | ✅ | ✅ |
| Widget embarquable | ✅ | ✅ | ✅ |
| Import CSV | ✅ | ✅ | ✅ |
| Dashboard métriques | ✅ | ✅ | ✅ |
| Score de churn basique | ✅ | ✅ | ✅ |
| Alertes clients à risque | ❌ | ✅ | ✅ |
| Suggestions IA (Claude) | ❌ | ✅ | ✅ |
| Export avancé | ❌ | ✅ | ✅ |
| Support chat prioritaire | ❌ | ❌ | ✅ |
| API publique (Phase 3) | ❌ | ❌ | ✅ |
| Multi-établissements (Phase 3) | ❌ | ❌ | ✅ |

---

## 3. Essai gratuit

- **Durée :** 14 jours
- **Accès :** Plan Growth complet (toutes les features)
- **Limite :** Jusqu'à 100 clients maximum pendant l'essai
- **Pas de carte bancaire requise** pour démarrer l'essai
- **Conversion :** Au jour 12, email de rappel avec offre de conversion

**Objectif de conversion essai → payant :** > 25% (à mesurer et améliorer en Phase 1)

---

## 4. Logique de passage d'un plan à l'autre

**Upgrade automatique :**
- Si le restaurateur dépasse la limite clients de son plan, il est notifié et invité à passer au plan supérieur
- Pas de blocage immédiat : une période de grâce de 7 jours est accordée avant blocage des nouvelles inscriptions de clients

**Downgrade :**
- Possible à tout moment
- Effectif au début du prochain cycle de facturation
- Si la base clients dépasse la limite du plan inférieur : les clients sont conservés mais les nouvelles inscriptions sont bloquées

---

## 5. Pricing et segments

### Restauration (segment MVP)
Un restaurant indépendant avec 200-1 000 clients actifs → **Plan Starter (49€)** est le point d'entrée naturel.
Le ROI attendu : si le programme récupère 5% des clients perdus (1 visite/mois à 30€ moyen) → ROI de 10x le prix du plan.

### PME e-commerce (Phase 2+)
5 000+ clients → **Plan Growth ou Pro** comme point d'entrée.

---

## 6. Hypothèses à valider

| Hypothèse | Méthode de validation | Statut |
|---|---|---|
| H1 : Les restaurateurs acceptent 49€/mois si ROI démontrable en 30 jours | Conversations design partners | À valider |
| H2 : La limite de 500 clients couvre 80% des restaurants indépendants | Données sectorielles | À vérifier |
| H3 : L'essai sans CB augmente le taux de démarrage | A/B test (Phase 1) | À tester |
| H4 : La facturation mensuelle est préférée à l'annuelle | Analyse des paiements (Phase 1) | À mesurer |

---

## 7. Révision du pricing

Le pricing sera revu après :
- Les 10 premiers clients payants (Phase 1)
- 3 mois d'utilisation en production
- Analyse du ratio valeur perçue / prix (interviews clients)

**Outil de pricing :** Stripe (à intégrer en Phase 1) avec Stripe Billing pour la gestion des abonnements.
