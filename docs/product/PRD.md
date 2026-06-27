# PRD — Product Requirements Document

> **Projet :** LoyaltyFlowAI
> **Version :** 0.1.0
> **Statut :** En rédaction — Phase 0
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [MASTER_PLAN.md §12](../../MASTER_PLAN.md#12-objectifs-du-mvp)

---

## Sommaire

1. [Objectif du document](#1-objectif-du-document)
2. [Contexte et problème](#2-contexte-et-problème)
3. [Utilisateurs cibles](#3-utilisateurs-cibles)
4. [Objectifs produit](#4-objectifs-produit)
5. [Périmètre du MVP](#5-périmètre-du-mvp)
6. [User Stories](#6-user-stories)
7. [Critères d'acceptation globaux](#7-critères-dacceptation-globaux)
8. [Hors périmètre MVP](#8-hors-périmètre-mvp)
9. [Dépendances](#9-dépendances)
10. [Questions ouvertes](#10-questions-ouvertes)

---

## 1. Objectif du document

Ce PRD définit les exigences fonctionnelles et non-fonctionnelles du MVP de LoyaltyFlowAI. Il sert de référence commune entre le produit, le design et le développement pour la Phase 1.

---

## 2. Contexte et problème

Les restaurateurs indépendants perdent des clients réguliers sans le savoir. Leurs outils actuels (cartes tampon papier, tableurs) ne leur permettent pas de :
- Identifier les clients sur le point de partir
- Comprendre les comportements d'achat
- Agir automatiquement avant la perte

→ Détail des problèmes adressés : [MASTER_PLAN.md §11](../../MASTER_PLAN.md#11-problèmes-que-nous-résolvons)

---

## 3. Utilisateurs cibles

### Utilisateur principal (opérateur)
**Lucas, le restaurateur indépendant** — propriétaire d'un restaurant avec 200 à 2 000 clients actifs, peu technique, cherche un ROI visible en < 30 jours.

→ [Persona complet](../../MASTER_PLAN.md#10-personas)

### Utilisateur secondaire (client final)
Le client du restaurant qui interagit avec le widget de fidélité embarqué sur le site du restaurateur.

---

## 4. Objectifs produit

| Objectif | Métrique de succès | Horizon |
|---|---|---|
| Démontrer la valeur au restaurateur | ROI visible (fréquence de visite +X%) | 30 jours |
| Onboarding autonome | Setup complet en < 30 min sans aide | MVP |
| Fidélisation mesurable | Taux de retour clients actifs > baseline | 60 jours |
| Satisfaction | NPS > 30 | Phase 1 |

---

## 5. Périmètre du MVP

### 5.1 Authentification & Comptes
- Inscription par email + mot de passe
- Connexion sécurisée (JWT + refresh tokens)
- Gestion de profil établissement (nom, logo, adresse)
- Tableau de bord principal (overview des métriques clés)

### 5.2 Programme de fidélité
- Création d'un programme de points (1 visite / 1€ = X points)
- Configuration des règles de gain
- Configuration des récompenses (seuil de points → récompense)
- Activation / désactivation du programme

### 5.3 Clients & Données
- Import manuel de clients (CSV)
- Fiche client individuelle (historique de points et visites)
- Attribution manuelle de points par l'opérateur

### 5.4 Widget de fidélité (canal client final)
- Snippet JS embarquable sur le site du restaurateur
- Affichage du solde de points du client
- Liste des récompenses disponibles
- Design responsive, personnalisé aux couleurs de l'établissement

### 5.5 IA — Score de churn
- Score de risque de départ par client (basé sur l'inactivité)
- Alerte automatique dans le dashboard pour les clients à risque
- Suggestion de récompense personnalisée (règles heuristiques)

### 5.6 Reporting
- Dashboard : clients actifs, points émis, récompenses distribuées
- Export CSV basique

### 5.7 Administration
- Gestion des membres de l'équipe (Admin + Membre)
- Paramètres de la plateforme

---

## 6. User Stories

→ [Index des user stories](./user-stories/README.md)

| ID | Module | Titre |
|---|---|---|
| [US-001](./user-stories/US-001-auth.md) | Auth | Inscription et connexion |
| [US-002](./user-stories/US-002-loyalty-program.md) | Programme | Création et gestion du programme de points |
| [US-003](./user-stories/US-003-customers.md) | Clients | Import et gestion des clients |
| [US-004](./user-stories/US-004-widget.md) | Widget | Widget de fidélité embarquable |
| [US-005](./user-stories/US-005-ai-churn.md) | IA | Score de churn et alertes |
| [US-006](./user-stories/US-006-reporting.md) | Reporting | Dashboard et exports |

---

## 7. Critères d'acceptation globaux

- [ ] L'onboarding complet (inscription → premier programme actif) se fait en < 30 minutes
- [ ] Le widget s'intègre sur un site en < 5 minutes (copier-coller d'un snippet)
- [ ] Les scores de churn se mettent à jour au moins 1 fois par jour
- [ ] Aucune donnée d'un client A n'est visible par un client B (isolation multi-tenant)
- [ ] L'application répond en < 300 ms au p95
- [ ] Uptime ≥ 99,9 %

---

## 8. Hors périmètre MVP

- Intégrations natives (Shopify, WooCommerce, caisse)
- Programme de parrainage
- Niveaux de fidélité (tiers Bronze/Silver/Gold)
- Notifications email automatisées
- Application mobile native
- White-labeling
- API publique

→ [Liste complète](../../MASTER_PLAN.md#13-fonctionnalités-hors-mvp)

---

## 9. Dépendances

| Dépendance | Type | Impact |
|---|---|---|
| Supabase Auth | Externe | Bloquant — authentification |
| Claude API | Externe | Bloquant — suggestions IA |
| Vercel | Externe | Bloquant — déploiement |
| Design system (shadcn/ui) | Interne | Phase 0 — design system à construire |

---

## 10. Questions ouvertes

| ID | Question | Priorité | Responsable |
|---|---|---|---|
| PRD-QO-001 | Quelle est l'unité de point pour la restauration ? (visite / montant dépensé / plat commandé) | Haute | À valider avec design partners |
| PRD-QO-002 | Le widget affiche-t-il le QR code du client pour identification en caisse ? | Haute | À décider en Phase 0 |
| PRD-QO-003 | Quel est le mécanisme d'identification du client final lors d'une visite ? (email, téléphone, QR code) | Critique | À valider avec design partners |
