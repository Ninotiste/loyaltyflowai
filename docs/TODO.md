# TODO — Prioritized Action List

> **Version :** 1.0.0 | **Date :** 2026-06-28
> **Mise à jour :** À chaque sprint / début de semaine
> **Format :** P0 = Bloquant MVP | P1 = Important pour launch | P2 = Phase 1 | P3 = Phase 2+

---

## P0 — Bloquants avant MVP (à résoudre AVANT de prendre un client payant)

| ID       | Action                                                                                                    | Document de référence                                                                      | Assigné   |
| -------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------- |
| TODO-001 | Résoudre QO-MVP-04 : décider du mécanisme d'attribution physique des points (manuelle vs intégration POS) | [DISCOVERY.md ADR-09](./technical/DISCOVERY.md), [LOYALTY_BRAIN.md](./ai/LOYALTY_BRAIN.md) | Fondateur |
| TODO-002 | Résoudre ADR-08 : polling vs WebSocket pour le widget                                                     | [DISCOVERY.md ADR-08](./technical/DISCOVERY.md)                                            | Fondateur |
| TODO-003 | Implémenter l'idempotency des webhooks Stripe (`stripe_event_id` unique en DB)                            | [DISCOVERY.md §2.8](./technical/DISCOVERY.md#28-module-billing)                            | Dev       |
| TODO-004 | Implémenter la pagination cursor-based sur GET /api/v1/customers                                          | [API.md](./technical/API.md), [INVESTMENT_REVIEW.md §Nicolas](./INVESTMENT_REVIEW.md)      | Dev       |
| TODO-005 | Ajouter bundle size check (< 30 KB gzip) dans le pipeline CI/CD                                           | [SCREENS.md](./ux/SCREENS.md), [INVESTMENT_REVIEW.md §Nicolas](./INVESTMENT_REVIEW.md)     | Dev       |

---

## P1 — Important avant le premier client payant

| ID       | Action                                                                                                       | Document de référence                                                                | Assigné   |
| -------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | --------- |
| TODO-006 | Écrire les tests unitaires pour le churn scoring (couverture > 80 %)                                         | [DISCOVERY.md §3](./technical/DISCOVERY.md#3-module-1--churn-scoring)                | Dev       |
| TODO-007 | Écrire les tests E2E Playwright pour le flow critique : inscription widget → attribution points → récompense | [SCREENS.md §11](./ux/SCREENS.md#11-widget-client-final)                             | Dev       |
| TODO-008 | Implémenter le RLS PostgreSQL sur toutes les tables et le tester avec un utilisateur non-admin               | [DISCOVERY.md §2.2](./technical/DISCOVERY.md#22-module-organisation)                 | Dev       |
| TODO-009 | Implémenter le flow d'onboarding 4 étapes (US-009)                                                           | [US-009-onboarding.md](./product/user-stories/US-009-onboarding.md)                  | Dev       |
| TODO-010 | Implémenter le module Billing avec Stripe (US-007)                                                           | [US-007-billing.md](./product/user-stories/US-007-billing.md)                        | Dev       |
| TODO-011 | Implémenter le mode employé simplifié (US-010)                                                               | [US-010-team.md](./product/user-stories/US-010-team.md)                              | Dev       |
| TODO-012 | Implémenter les fonctionnalités RGPD — export et suppression (US-008)                                        | [US-008-rgpd.md](./product/user-stories/US-008-rgpd.md)                              | Dev       |
| TODO-013 | Valider la DPA auprès d'un avocat spécialisé RGPD avant le premier client                                    | [US-008-rgpd.md §Contexte](./product/user-stories/US-008-rgpd.md#contexte-juridique) | Fondateur |
| TODO-014 | Construire le widget JS vanilla (US-011) et le tester sur Chrome/Safari/Firefox/Edge                         | [US-011-widget-client.md](./product/user-stories/US-011-widget-client.md)            | Dev       |
| TODO-015 | Tester l'UX employé avec 3 vrais serveurs dans un contexte de service                                        | [INVESTMENT_REVIEW.md §Amélie](./INVESTMENT_REVIEW.md)                               | Fondateur |

---

## P2 — Sprint post-MVP (Phase 1 — 10 clients payants)

| ID       | Action                                                                               | Document de référence                                                                           |
| -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| TODO-016 | Implémenter le churn scoring multi-facteurs (5 variables)                            | [LOYALTY_BRAIN.md §3](./ai/LOYALTY_BRAIN.md#3-module-1--churn-scoring)                          |
| TODO-017 | Ajouter Sentry pour le error tracking en production                                  | [DISCOVERY.md §9](./technical/DISCOVERY.md#9-observabilité)                                     |
| TODO-018 | Documenter et implémenter apps/worker avec système de queue                          | [DISCOVERY.md §7](./technical/DISCOVERY.md#7-scalabilité-et-limites)                            |
| TODO-019 | Implémenter les insights hebdomadaires automatiques (textuels)                       | [LOYALTY_BRAIN.md §7](./ai/LOYALTY_BRAIN.md#7-module-5--analytics-ia)                           |
| TODO-020 | Tester le plan d'acquisition avec 5 restaurants cibles identifiés                    | [INVESTMENT_REVIEW.md §Marie](./INVESTMENT_REVIEW.md)                                           |
| TODO-021 | Créer le contenu de formation employé (vidéo 10 min ou guide PDF)                    | [US-010-team.md](./product/user-stories/US-010-team.md)                                         |
| TODO-022 | Mettre en place les metrics Vercel Analytics et un dashboard de monitoring           | [DISCOVERY.md §9](./technical/DISCOVERY.md#9-observabilité)                                     |
| TODO-023 | Intégrer le flow de connexion Magic Link (sans mot de passe) pour les clients finaux | [US-011-widget-client.md CA-011-03](./product/user-stories/US-011-widget-client.md)             |
| TODO-024 | Implémenter la séquence d'emails automatiques d'onboarding client (3 emails)         | [CUSTOMER_LIFECYCLE.md §13](./customer/CUSTOMER_LIFECYCLE.md#13-séquences-demails-automatiques) |
| TODO-025 | Écrire les tests de charge pour le widget (100 req simultanées)                      | [DISCOVERY.md §7](./technical/DISCOVERY.md#7-scalabilité-et-limites)                            |

---

## P3 — Phase 2 (100 clients payants)

| ID       | Action                                                             | Document de référence                                                                            |
| -------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| TODO-026 | Intégrer Claude API pour les suggestions de campagnes              | [LOYALTY_BRAIN.md §8](./ai/LOYALTY_BRAIN.md#8-intégration-claude-api)                            |
| TODO-027 | Implémenter Apple Wallet + Google Wallet pour la carte client      | [COMPETITIVE_ANALYSIS.md §3.9-3.10](./business/COMPETITIVE_ANALYSIS.md)                          |
| TODO-028 | Créer le programme de parrainage (referral)                        | [CUSTOMER_LIFECYCLE.md §8](./customer/CUSTOMER_LIFECYCLE.md#8-étape-7--référence)                |
| TODO-029 | Implémenter les niveaux de fidélité (Silver, Gold, Platinum)       | [PRODUCT_BIBLE.md Feature Map](./product/PRODUCT_BIBLE.md)                                       |
| TODO-030 | Développer l'API publique v1 pour les intégrations POS             | [COMPETITIVE_ANALYSIS.md §10](./business/COMPETITIVE_ANALYSIS.md#10-opportunités-de-partenariat) |
| TODO-031 | Contacter Lightspeed et Zelty pour des partenariats d'intégration  | [COMPETITIVE_ANALYSIS.md §10](./business/COMPETITIVE_ANALYSIS.md#10-opportunités-de-partenariat) |
| TODO-032 | Implémenter le benchmarking anonymisé entre restaurants similaires | [LOYALTY_BRAIN.md §7](./ai/LOYALTY_BRAIN.md#7-module-5--analytics-ia)                            |
| TODO-033 | Lancer la campagne d'acquisition payante (test Ads Meta/LinkedIn)  | [GTM.md](./business/GTM.md)                                                                      |

---

## Documentation — Gaps à compléter

| ID       | Document manquant                                   | Priorité | Notes                                 |
| -------- | --------------------------------------------------- | -------- | ------------------------------------- |
| TODO-D01 | `docs/product/user-stories/US-012-notifications.md` | P2       | Notifications push (Phase 2)          |
| TODO-D02 | `docs/product/user-stories/US-013-referral.md`      | P3       | Programme de parrainage               |
| TODO-D03 | `docs/technical/WIDGET.md`                          | P1       | Spec technique détaillée du widget JS |
| TODO-D04 | `docs/operations/MONITORING.md`                     | P2       | Runbook monitoring production         |
| TODO-D05 | Mise à jour `docs/product/wireframes/`              | P1       | Wireframes haute-fidélité (Figma)     |

---

## Décisions en suspens — bloqueuses

| ID      | Décision                                        | Impact                     | Deadline                        |
| ------- | ----------------------------------------------- | -------------------------- | ------------------------------- |
| DEC-001 | QO-MVP-04 : mécanisme d'attribution physique    | CRITIQUE — cœur du produit | Avant dev widget                |
| DEC-002 | QO-OB-01 : essai gratuit 14 jours ou freemium ? | Acquisition                | Avant launch marketing          |
| DEC-003 | QO-TEAM-02 : nombre max de membres par plan     | Pricing                    | Avant finalisation Stripe plans |

→ Voir la liste complète des décisions dans [DECISIONS.md](../DECISIONS.md)

---

_Mise à jour : 2026-06-28 — Foundation Sprint V1_
