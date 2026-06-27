# METRICS.md — Définition des métriques et KPIs

> **Projet :** LoyaltyFlowAI
> **Version :** 0.1.0
> **Statut :** Actif
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [MASTER_PLAN.md §6](../../MASTER_PLAN.md#6-north-star-metric) | [MASTER_PLAN.md §7](../../MASTER_PLAN.md#7-kpis-principaux) | [GTM.md](./GTM.md)

---

## Sommaire

1. [North Star Metric](#1-north-star-metric)
2. [KPIs Business](#2-kpis-business)
3. [KPIs Produit](#3-kpis-produit)
4. [KPIs Techniques](#4-kpis-techniques)
5. [Définitions précises](#5-définitions-précises)
6. [Dashboard de suivi](#6-dashboard-de-suivi)
7. [Alertes et seuils d'alerte](#7-alertes-et-seuils-dalerte)

---

## 1. North Star Metric

```
Nombre de transactions de fidélité traitées par mois
sur des comptes actifs (≥ 1 transaction dans les 30 derniers jours)
```

**Seuil de santé :** > 10 transactions/mois/compte actif.

**Pourquoi :** Capture à la fois la rétention (comptes actifs) et l'usage réel (volume de transactions). Ne peut pas être manipulée par des inscriptions inactives.

---

## 2. KPIs Business

| Métrique | Définition | Cible Phase 1 | Cible Phase 2 | Fréquence |
|---|---|---|---|---|
| **MRR** | Revenu récurrent mensuel (somme des abonnements actifs) | 500€ | 15 000€ | Hebdomadaire |
| **ARR** | MRR × 12 | 6 000€ | 180 000€ | Mensuelle |
| **Clients payants** | Comptes avec abonnement actif (hors essai) | 10 | 100 | Hebdomadaire |
| **Churn Rate** | % clients perdus par mois = (clients perdus / clients début de mois) × 100 | < 5% | < 3% | Mensuelle |
| **NRR** | Net Revenue Retention = (MRR fin - churns + expansions) / MRR début × 100 | > 95% | > 100% | Mensuelle |
| **CAC** | Coût d'acquisition = dépenses marketing / nouveaux clients | < 200€ | < 100€ | Mensuelle |
| **LTV** | Lifetime Value = MRR moyen par client / Churn Rate mensuel | > 1 000€ | > 3 000€ | Trimestrielle |
| **LTV:CAC** | Rapport LTV / CAC (cible > 3:1) | > 5:1 | > 10:1 | Trimestrielle |
| **Payback Period** | Mois pour récupérer le CAC | < 6 mois | < 4 mois | Trimestrielle |

---

## 3. KPIs Produit

| Métrique | Définition | Cible Phase 1 | Fréquence |
|---|---|---|---|
| **Time-to-Value** | Temps entre inscription et 1ère transaction de fidélité créée | < 30 min | Hebdomadaire |
| **Onboarding Completion Rate** | % de comptes ayant complété le setup (programme actif + 1 client) | > 70% | Hebdomadaire |
| **DAU/MAU** | Ratio d'engagement quotidien / mensuel | > 20% | Hebdomadaire |
| **Feature Adoption — Widget** | % de comptes actifs ayant installé le widget | > 80% | Mensuelle |
| **Feature Adoption — Churn Score** | % de comptes ayant consulté le score de churn | > 60% | Mensuelle |
| **NPS** | Net Promoter Score (enquête mensuelle) | > 30 | Trimestrielle |
| **CSAT** | Customer Satisfaction Score (post-support) | > 4/5 | Mensuelle |
| **Support Volume** | Tickets de support par client par mois | < 0,5 | Hebdomadaire |

---

## 4. KPIs Techniques

| Métrique | Définition | Cible | Fréquence |
|---|---|---|---|
| **Uptime** | Disponibilité de la plateforme | > 99,9% | Continu |
| **API Response Time (p95)** | Latence au 95e percentile des requêtes API | < 300 ms | Continu |
| **API Response Time (p99)** | Latence au 99e percentile | < 1 000 ms | Continu |
| **Error Rate** | % de requêtes retournant une erreur 5xx | < 0,1% | Continu |
| **Widget Load Time** | Temps de chargement du widget JS | < 500 ms | Hebdomadaire |
| **Deployment Frequency** | Fréquence de déploiement en production | ≥ 1/semaine | Hebdomadaire |
| **MTTR** | Temps moyen de résolution d'incident | < 1 heure | Par incident |
| **Test Coverage** | Couverture de tests du code critique | > 70% | Par PR |

---

## 5. Définitions précises

### Client actif (LoyaltyFlowAI)
Un compte restaurateur ayant eu **au moins 1 transaction de fidélité traitée** dans les 30 derniers jours.

### Client actif (côté restaurateur — dans le widget)
Un client final du restaurateur ayant **au moins 1 visite enregistrée** dans les 30 derniers jours.

### Transaction de fidélité
Tout enregistrement dans la table `point_transactions` : gain de points, échange de récompense, ajustement manuel.

### Churn (LoyaltyFlowAI)
Un compte est considéré churné s'il annule son abonnement ou ne renouvelle pas à l'échéance.

### Score de churn (client final du restaurateur)
Calculé quotidiennement. Voir [US-005](../product/user-stories/US-005-ai-churn.md) pour la définition des niveaux.

---

## 6. Dashboard de suivi

### Outils
| Outil | Usage | Phase |
|---|---|---|
| **Vercel Analytics** | Trafic et performance web | MVP |
| **Sentry** | Erreurs et performance API | MVP |
| **Supabase Dashboard** | Métriques base de données | MVP |
| **Tableau de bord interne** | MRR, clients, churn (à construire) | Phase 1 |
| **Mixpanel ou Posthog** | Analytics produit (feature adoption, funnels) | Phase 2 |
| **Metabase ou Grafana** | Reporting avancé | Phase 2 |

### Revue hebdomadaire (solo fondateur)
Chaque lundi, revue de 30 minutes sur :
1. MRR et variation vs semaine précédente
2. Nouveaux essais et conversions
3. Clients churned ou à risque
4. North Star Metric (transactions / compte actif)
5. Incidents ou anomalies techniques de la semaine

---

## 7. Alertes et seuils d'alerte

| Condition | Action |
|---|---|
| Uptime < 99% sur 1 heure | Alerte immédiate (PagerDuty ou email) |
| Error Rate > 1% sur 15 min | Alerte immédiate |
| MRR drop > 10% en 1 semaine | Analyse manuelle urgente |
| Churn Rate mensuel > 5% | Revue des clients perdus, appels de succès client |
| NPS < 20 | Revue des verbatims, ajustements produit |
