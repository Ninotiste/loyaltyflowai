# MASTER_PLAN.md — LoyaltyFlowAI

> **Document de référence stratégique**
> Version : 0.3.0 — Pré-seed
> Statut : Phase 0 — Fondation en cours
> Dernière mise à jour : 2026-06-27
> Propriétaire : Fondateur(s) de LoyaltyFlowAI
> Confidentialité : Strictement confidentiel

---

> Ce document est la **source de vérité unique** du projet LoyaltyFlowAI.
> Toute décision technique, produit ou business doit être alignée avec ce document.
> Toute contradiction entre ce document et une autre ressource doit être résolue ici.

---

## Table des matières

1. [Vision](#1-vision)
2. [Mission](#2-mission)
3. [Valeurs](#3-valeurs)
4. [Principes Produit](#4-principes-produit)
5. [Objectifs Business](#5-objectifs-business)
6. [North Star Metric](#6-north-star-metric)
7. [KPIs Principaux](#7-kpis-principaux)
8. [Positionnement](#8-positionnement)
9. [Proposition de Valeur](#9-proposition-de-valeur)
10. [Personas](#10-personas)
11. [Problèmes que nous résolvons](#11-problèmes-que-nous-résolvons)
12. [Objectifs du MVP](#12-objectifs-du-mvp)
13. [Fonctionnalités hors MVP](#13-fonctionnalités-hors-mvp)
14. [Architecture Documentaire](#14-architecture-documentaire)
15. [Organisation des Dossiers](#15-organisation-des-dossiers)
16. [Conventions de Nommage](#16-conventions-de-nommage)
17. [Règles de Développement](#17-règles-de-développement)
18. [Standards de Qualité](#18-standards-de-qualité)
19. [Sécurité](#19-sécurité)
20. [Principes UX](#20-principes-ux)
21. [Contraintes Techniques](#21-contraintes-techniques)
22. [Stack Cible](#22-stack-cible)
23. [Règles IA](#23-règles-ia)
24. [Roadmap Générale](#24-roadmap-générale)
25. [Définition de chaque Phase](#25-définition-de-chaque-phase)
26. [Dépendances entre les Phases](#26-dépendances-entre-les-phases)
27. [Checklist avant Développement](#27-checklist-avant-développement)
28. [Checklist avant Production](#28-checklist-avant-production)
29. [Checklist avant Lancement](#29-checklist-avant-lancement)
30. [Risques Connus](#30-risques-connus)
31. [Hypothèses](#31-hypothèses)
32. [Questions Ouvertes](#32-questions-ouvertes)
33. [Glossaire](#33-glossaire)

---

## 1. Vision

> _L'étoile du nord. Ce que le monde devient grâce à LoyaltyFlowAI._

**LoyaltyFlowAI aspire à devenir la plateforme de référence mondiale pour la fidélisation client intelligente — un monde où chaque entreprise, quelle que soit sa taille, peut offrir une expérience de fidélisation aussi sophistiquée que celle des plus grandes marques mondiales, sans équipe data ni budget marketing exorbitant.**

Dans dix ans, la fidélisation client ne sera plus un programme de points générique. Ce sera une relation vivante, personnalisée et prédictive entre une marque et ses clients. LoyaltyFlowAI construit l'infrastructure qui rend cela possible.

---

## 2. Mission

> _Pourquoi nous existons. Ce que nous faisons concrètement._

**LoyaltyFlowAI donne aux entreprises les outils d'intelligence artificielle pour transformer leurs données clients en relations durables, en automatisant la fidélisation de manière personnalisée, prédictive et mesurable.**

Nous rendons accessible aux PME et startups ce que seules les grandes entreprises pouvaient se permettre : une fidélisation client pilotée par la donnée, en temps réel, à grande échelle.

---

## 3. Valeurs

> _Les principes non négociables qui guident chaque décision._

### 3.1 Clarté avant complexité

Nous construisons des produits que nos clients comprennent sans formation. La sophistication technologique doit être invisible. L'utilisateur voit le résultat, pas la mécanique.

### 3.2 Données au service du client — pas l'inverse

Les données appartiennent aux entreprises qui nous font confiance. Nous ne les monétisons pas, nous ne les revendons pas. Notre modèle économique repose sur la valeur créée, non sur les données collectées.

### 3.3 Impact mesurable

Chaque fonctionnalité doit avoir un impact mesurable sur un KPI client. Nous ne livrons pas de fonctionnalités. Nous livrons des résultats.

### 3.4 Obsession de la fiabilité

Un programme de fidélité qui tombe en panne à minuit le soir du Black Friday est catastrophique pour nos clients. La fiabilité est une fonctionnalité de premier rang, pas un bonus.

### 3.5 Itération honnête

Nous écoutons nos clients, nous testons nos hypothèses, et nous avons le courage d'admettre quand nous avons tort. La vitesse d'apprentissage est plus précieuse que la certitude.

### 3.6 Long terme

Nous construisons pour durer. Les décisions qui sacrifient la qualité à long terme pour une croissance à court terme sont contraires à nos valeurs fondatrices.

---

## 4. Principes Produit

> _Les règles qui gouvernent ce que nous construisons et comment._

**P1 — Un seul problème à la fois**
Chaque release résout un problème clairement identifié pour un persona clairement défini. Nous ne construisons pas de fonctionnalités sans validation préalable du besoin.

**P2 — La valeur avant l'élégance**
Un produit qui délivre de la valeur de manière imparfaite est supérieur à un produit parfait qui ne délivre rien. L'itération est la voie vers l'excellence.

**P3 — Zéro friction à l'onboarding**
Un nouvel utilisateur doit comprendre la valeur fondamentale du produit en moins de 5 minutes. Le time-to-value est notre métrique d'onboarding principale.

**P4 — Tout est mesurable**
Chaque fonctionnalité lancée est accompagnée d'une définition claire de succès, d'une métrique associée et d'une date de revue.

**P5 — Le produit doit s'expliquer lui-même**
Si une fonctionnalité nécessite plus d'un écran de documentation pour être utilisée, elle est trop complexe. Nous re-concevons avant de documenter.

**P6 — Mobile-first, desktop-ready**
L'expérience mobile est conçue en premier. L'expérience desktop est une extension, jamais une priorité par défaut.

**P7 — Sécurité by design**
La sécurité n'est pas ajoutée après coup. Elle est intégrée dès la conception de chaque fonctionnalité.

---

## 5. Objectifs Business

> _Ce que nous voulons accomplir, avec des cibles chiffrées et des horizons temporels._

### Horizon 12 mois (Pré-seed → Seed)

- Atteindre **50 clients payants** actifs
- Générer **10 000 € MRR** (Monthly Recurring Revenue)
- Maintenir un **churn mensuel < 3 %**
- Collecter **au moins 20 témoignages clients** documentés
- Valider le product-market fit sur **1 segment de marché primaire**

### Horizon 24 mois (Seed → Série A)

- Atteindre **500 clients payants** actifs
- Générer **100 000 € MRR**
- Churn mensuel **< 1,5 %**
- Lancer sur **2 marchés géographiques** (ex. France + Belgique ou France + Canada francophone)
- Recruter une **équipe core** de 5 à 8 personnes

### Horizon 36 mois (Série A)

- Atteindre **2 000 clients payants** actifs
- Générer **500 000 € MRR**
- Développer un **réseau de partenaires revendeurs** (agences, intégrateurs)
- Lancer une **API publique** avec marketplace d'intégrations

---

## 6. North Star Metric

> _L'unique métrique qui capture la valeur créée pour nos clients et prédit notre croissance._

```
North Star Metric : Nombre de transactions de fidélité traitées par mois
                    sur des comptes actifs (= ayant eu au moins 1 transaction
                    les 30 derniers jours)
```

**Pourquoi cette métrique ?**

- Elle reflète l'usage réel, pas seulement les inscriptions
- Elle est directement corrélée à la valeur délivrée au client
- Elle capture la rétention (comptes actifs) et la croissance (volume de transactions)
- Elle ne peut pas être manipulée par des inscriptions gratuites inactives

**Seuil de santé :** > 10 transactions/mois/compte actif indique un usage sain.

---

## 7. KPIs Principaux

> _Les indicateurs qui mesurent la santé de l'entreprise à chaque niveau._

### KPIs Business

| Indicateur     | Description                               | Fréquence de revue |
| -------------- | ----------------------------------------- | ------------------ |
| MRR            | Monthly Recurring Revenue                 | Hebdomadaire       |
| ARR            | Annual Recurring Revenue                  | Mensuelle          |
| Churn Rate     | % clients perdus par mois                 | Mensuelle          |
| NRR            | Net Revenue Retention (expansion - churn) | Mensuelle          |
| CAC            | Coût d'acquisition client                 | Mensuelle          |
| LTV            | Lifetime Value client                     | Trimestrielle      |
| LTV:CAC ratio  | Efficacité d'acquisition (cible > 3:1)    | Trimestrielle      |
| Payback Period | Mois pour récupérer le CAC                | Trimestrielle      |

### KPIs Produit

| Indicateur            | Description                                  | Fréquence de revue |
| --------------------- | -------------------------------------------- | ------------------ |
| DAU / MAU ratio       | Engagement quotidien vs mensuel              | Hebdomadaire       |
| Time-to-Value         | Temps entre inscription et 1ère valeur reçue | Hebdomadaire       |
| Feature Adoption Rate | % utilisateurs activant chaque feature       | Mensuelle          |
| NPS                   | Net Promoter Score                           | Trimestrielle      |
| CSAT                  | Customer Satisfaction Score                  | Mensuelle          |
| Support Ticket Volume | Volume de tickets par catégorie              | Hebdomadaire       |

### KPIs Technique

| Indicateur              | Description                          | Cible       |
| ----------------------- | ------------------------------------ | ----------- |
| Uptime                  | Disponibilité de la plateforme       | > 99,9 %    |
| API Response Time (p95) | Latence au 95e percentile            | < 300 ms    |
| Error Rate              | % de requêtes en erreur              | < 0,1 %     |
| Deployment Frequency    | Fréquence de déploiement             | ≥ 1/semaine |
| Time to Recovery (MTTR) | Temps moyen de résolution d'incident | < 1 heure   |

---

## 8. Positionnement

> _Comment nous nous situons sur le marché, et pourquoi les clients nous choisissent._

### Marché cible

**Segment MVP (Focus absolu) :** Restauration & food — restaurants indépendants, cafés, dark kitchens, food trucks — avec une base de clients récurrents, cherchant à augmenter la fréquence de visite et réduire le churn.

**Marché primaire (Phase 2+) :** PME et startups avec 100 à 10 000 clients actifs, cherchant à automatiser et personnaliser leur programme de fidélité sans équipe data dédiée.

**Marchés secondaires :** Agences digitales gérant des programmes de fidélité pour leurs clients, e-commerçants multi-canal, applications mobiles à fort volume d'utilisateurs.

**Zone géographique :** France uniquement pour le lancement (Phase 0-1). Extension possible en Phase 2.

### Positionnement concurrentiel

```
                        COMPLEXITÉ ÉLEVÉE
                              │
              Salesforce      │    Platforms Enterprise
              Loyalty Mgmt    │    (Annex Cloud, Comarch)
                              │
PRIX BAS ────────────────────────────────────── PRIX ÉLEVÉ
                              │
    Outils simples de         │    LoyaltyFlowAI ← CIBLE
    points (Stamp,            │    (Simple + IA + Abordable)
    Loopy Loyalty)            │
                              │
                        COMPLEXITÉ FAIBLE
```

### Statement de positionnement

> _Pour les PME et startups qui veulent fidéliser leurs clients intelligemment, LoyaltyFlowAI est la plateforme SaaS de fidélisation client alimentée par l'IA qui automatise et personnalise chaque interaction de récompense — contrairement aux outils traditionnels qui offrent des programmes de points génériques, LoyaltyFlowAI apprend des comportements clients pour maximiser la rétention de manière prédictive et mesurable._

---

## 9. Proposition de Valeur

> _La valeur concrète que nous apportons à chaque persona._

### Pour le dirigeant / fondateur

- **Gain :** Augmentation mesurable du taux de rétention client (+15 à +30 % attendus)
- **Gain :** Réduction du coût d'acquisition par la réactivation des clients existants
- **Douleur soulagée :** Plus besoin de justifier des dépenses marketing sans ROI mesurable
- **Promesse :** "Connaissez enfin la vraie valeur de chaque client — et agissez en conséquence."

### Pour le responsable marketing / CRM

- **Gain :** Campagnes de fidélisation automatisées, sans dev ni data scientist
- **Gain :** Segmentation comportementale en temps réel
- **Douleur soulagée :** Fin des envois d'emails génériques à toute la base
- **Promesse :** "Le bon message, à la bonne personne, au bon moment — sans effort manuel."

### Pour le client final (utilisateur du programme de fidélité)

- **Gain :** Récompenses pertinentes, pas des points inutilisables
- **Gain :** Expérience cohérente sur tous les canaux
- **Douleur soulagée :** Plus de sentiment d'être traité comme un numéro
- **Promesse :** "Une fidélisation qui vous reconnaît vraiment."

---

## 10. Personas

> _Les archétypes des utilisateurs que nous servons en priorité._

### Persona 0 — "Lucas, le restaurateur indépendant" _(Persona MVP — priorité absolue)_

- **Rôle :** Propriétaire d'un restaurant indépendant, café ou food concept (1 à 3 établissements)
- **Taille d'entreprise :** Solo ou petite équipe (2 à 15 employés), 200 à 2 000 couverts/mois
- **Âge :** 28 à 50 ans
- **Niveau technique :** Faible à intermédiaire (utilise un logiciel de caisse, parfois Instagram, peu à l'aise avec les outils SaaS)
- **Douleurs :**
  - Ses clients viennent une fois et ne reviennent pas
  - Son programme de fidélité actuel (carte tampon papier) est impossible à mesurer
  - Il ne sait pas quels clients sont sur le point de partir ou d'arrêter de venir
  - Il n'a ni le temps ni les compétences pour analyser des données
- **Objectif :** Augmenter la fréquence de visite de ses clients réguliers et en reconquérir les perdus
- **Décision d'achat :** Il achète si le setup prend < 30 minutes et si le ROI est visible en < 30 jours
- **Canal d'acquisition prioritaire :** Bouche-à-oreille entre restaurateurs, groupes Facebook de gérants de restaurants

---

### Persona 1 — "Marie, la fondatrice e-commerce"

- **Rôle :** Fondatrice d'une boutique e-commerce (mode, beauté, lifestyle)
- **Taille d'entreprise :** 2 à 10 personnes, 500 à 5 000 commandes/mois
- **Âge :** 28 à 42 ans
- **Niveau technique :** Intermédiaire (utilise Shopify, Mailchimp, mais pas développeuse)
- **Douleurs :**
  - Ne sait pas quels clients sont sur le point de partir
  - Son programme de fidélité actuel (stamps) n'est pas utilisé
  - Elle manque de temps pour analyser ses données
- **Objectif :** Augmenter le panier moyen et faire revenir ses clients sans augmenter son budget pub
- **Décision d'achat :** Elle achète si elle voit un ROI clair en moins de 60 jours

### Persona 2 — "Thomas, le responsable CRM d'une PME"

- **Rôle :** Responsable CRM / Marketing automation dans une PME (50 à 200 employés)
- **Taille d'entreprise :** PME, 10 000 à 100 000 clients dans la base
- **Âge :** 30 à 45 ans
- **Niveau technique :** Avancé (utilise HubSpot, Klaviyo, SQL basique)
- **Douleurs :**
  - Les outils actuels ne parlent pas entre eux
  - Il doit exporter des CSV pour segmenter manuellement
  - Il peine à justifier son budget devant la direction
- **Objectif :** Avoir un tableau de bord unique qui pilote automatiquement la fidélisation
- **Décision d'achat :** Il achète si les intégrations avec ses outils existants fonctionnent

### Persona 3 — "Sarah, l'agence digitale"

- **Rôle :** Directrice de compte dans une agence web / digitale
- **Taille d'entreprise :** Agence de 10 à 50 personnes gérant 20+ clients
- **Âge :** 32 à 48 ans
- **Niveau technique :** Avancé
- **Douleurs :**
  - Elle doit gérer plusieurs programmes de fidélité pour différents clients
  - Les outils actuels ne permettent pas le multi-tenant facilement
  - Elle a besoin de white-labeling pour présenter les résultats à ses clients
- **Objectif :** Proposer la fidélisation IA à ses clients comme nouvelle offre de service
- **Décision d'achat :** Elle achète si elle peut revendre la solution avec une marge

---

## 11. Problèmes que nous résolvons

> _Les douleurs réelles, documentées, que LoyaltyFlowAI adresse._

### Problème 1 — La fidélisation générique ne fidélise plus

Les programmes de points "taille unique" ont un taux d'engagement de moins de 30 % en moyenne. Les consommateurs sont insensibles aux récompenses non personnalisées. **Conséquence pour nos clients :** argent gaspillé, clients qui partent quand même.

### Problème 2 — L'IA est inaccessible sans équipe data

Les grandes marques utilisent le machine learning pour prédire le churn, segmenter et personnaliser. Cette technologie est inaccessible aux PME sans data scientists et infrastructure coûteuse. **Conséquence :** les PME perdent face aux grandes marques sur l'expérience client.

### Problème 3 — Les données client sont fragmentées

Un client peut acheter en boutique, sur le site, et via l'application — trois systèmes différents qui ne se parlent pas. Le programme de fidélité ne voit qu'une partie du comportement client. **Conséquence :** des décisions prises sur des données incomplètes.

### Problème 4 — Le ROI de la fidélisation est opaque

Les directeurs marketing ne peuvent pas démontrer clairement le ROI de leur programme de fidélité. Les métriques sont fragmentées, les dashboards absents ou incomplets. **Conséquence :** budget réduit ou supprimé lors des cycles de révision.

### Problème 5 — L'onboarding des outils de fidélisation est trop long

Les solutions enterprise comme Comarch ou Annex Cloud nécessitent 3 à 6 mois d'intégration et des consultants. Les PME ne peuvent pas se permettre ce délai. **Conséquence :** les PME utilisent des outils basiques qui ne délivrent pas de valeur réelle.

---

## 12. Objectifs du MVP

> _Ce que le MVP doit accomplir — et rien de plus._

### Définition du MVP

Le MVP de LoyaltyFlowAI est la version minimale du produit capable de démontrer la valeur fondamentale de la plateforme à un client réel, et de générer un premier paiement.

### Critères de succès du MVP

- [ ] Au moins **10 clients payants** en utilisation active
- [ ] Au moins **3 témoignages clients** documentés avec métriques
- [ ] Un taux de rétention des clients MVP **> 80 % à 60 jours**
- [ ] Un NPS MVP **> 30**
- [ ] Aucun incident de sécurité majeur

### Fonctionnalités incluses dans le MVP

**Authentification & Comptes**

- Inscription / Connexion sécurisée (email + mot de passe)
- Gestion de profil entreprise
- Tableau de bord principal (overview)

**Gestion du Programme de Fidélité**

- Création d'un programme de points simple (gain / dépense)
- Configuration des règles de gain (1€ = X points)
- Configuration des récompenses (seuils de points → récompenses)
- Activation / désactivation du programme

**Clients & Données**

- Import manuel de clients (CSV)
- Fiche client individuelle (historique de points, transactions)
- Attribution manuelle de points (par l'admin)

**Widget de fidélité (canal client final)**

- Snippet JS embarquable sur le site du restaurateur
- Identification du client final par email
- Affichage du solde de points et des récompenses disponibles
- Personnalisation couleur et logo

**IA — Fonctionnalité Core**

- Score de risque de churn par client (simple, basé sur l'inactivité)
- Alerte automatique pour les clients à risque
- Suggestion de récompense personnalisée (règle basée sur le comportement)

**Reporting**

- Dashboard : nombre de clients actifs, points émis, récompenses distribuées
- Export de rapport basique (CSV)

**Administration**

- Gestion des utilisateurs de l'équipe (admin + membre)
- Paramètres de la plateforme

---

## 13. Fonctionnalités hors MVP

> _Ce que nous ne construisons pas maintenant — mais que nous avons planifié._

### Phase 2 (Post-MVP)

- Intégration native Shopify
- Intégration native WooCommerce
- Programme de parrainage (referral)
- Niveaux de fidélité (Bronze, Silver, Gold)
- Notifications email automatisées

### Phase 3

- Intégration Stripe (pour récompenses en cash/crédit)
- API publique pour développeurs
- Application mobile (iOS & Android) pour les utilisateurs finaux
- Programme multicanal (in-store + online)

### Phase 4

- White-labeling complet pour agences
- Multi-tenant avancé (gestion multi-marques depuis un seul compte)
- Marketplace d'intégrations
- IA avancée : modèles de propension, LTV prediction, next best offer
- Analyses prédictives avancées

### Fonctionnalités exclues définitivement

- Gestion de caisse / POS : hors périmètre
- Réseau social entre clients : hors périmètre
- Marketplace de récompenses tierces : post-Série A uniquement

---

## 14. Architecture Documentaire

> _Comment la connaissance du projet est organisée et maintenue._

### Hiérarchie documentaire

```
MASTER_PLAN.md              ← Source de vérité (ce document)
│
├── docs/
│   ├── product/
│   │   ├── PRD.md          ← Product Requirements Document
│   │   ├── user-stories/   ← User stories par feature
│   │   └── wireframes/     ← Maquettes et prototypes
│   │
│   ├── technical/
│   │   ├── ARCHITECTURE.md ← Décisions d'architecture (ADRs)
│   │   ├── API.md          ← Documentation API
│   │   ├── DATABASE.md     ← Schéma de base de données
│   │   └── SECURITY.md     ← Politiques de sécurité
│   │
│   ├── business/
│   │   ├── PRICING.md      ← Stratégie de pricing
│   │   ├── GTM.md          ← Go-to-market strategy
│   │   └── METRICS.md      ← Définition des métriques
│   │
│   └── operations/
│       ├── RUNBOOK.md      ← Procédures opérationnelles
│       ├── INCIDENTS.md    ← Post-mortems d'incidents
│       └── ONBOARDING.md   ← Guide d'onboarding équipe
│
├── CHANGELOG.md            ← Journal des versions
└── README.md               ← Point d'entrée public du repo
```

### Statut de l'architecture documentaire

> **Architecture documentaire créée le 2026-06-27 — complète pour la Phase 0.**

| Document                       | Statut                      | Lien                                                |
| ------------------------------ | --------------------------- | --------------------------------------------------- |
| README.md                      | ✅ Créé                     | [README.md](./README.md)                            |
| CHANGELOG.md                   | ✅ Créé                     | [CHANGELOG.md](./CHANGELOG.md)                      |
| docs/product/PRD.md            | ✅ Créé                     | [PRD.md](./docs/product/PRD.md)                     |
| docs/product/user-stories/     | ✅ Créé (US-001 à US-006)   | [user-stories/](./docs/product/user-stories/)       |
| docs/product/wireframes/       | ✅ Créé (structure + guide) | [wireframes/](./docs/product/wireframes/)           |
| docs/technical/ARCHITECTURE.md | ✅ Créé (ADRs inclus)       | [ARCHITECTURE.md](./docs/technical/ARCHITECTURE.md) |
| docs/technical/API.md          | ✅ Créé                     | [API.md](./docs/technical/API.md)                   |
| docs/technical/DATABASE.md     | ✅ Créé (schéma Prisma MVP) | [DATABASE.md](./docs/technical/DATABASE.md)         |
| docs/technical/SECURITY.md     | ✅ Créé                     | [SECURITY.md](./docs/technical/SECURITY.md)         |
| docs/technical/ENVIRONMENTS.md | ✅ Créé                     | [ENVIRONMENTS.md](./docs/technical/ENVIRONMENTS.md) |
| docs/business/PRICING.md       | ✅ Créé                     | [PRICING.md](./docs/business/PRICING.md)            |
| docs/business/GTM.md           | ✅ Créé                     | [GTM.md](./docs/business/GTM.md)                    |
| docs/business/METRICS.md       | ✅ Créé                     | [METRICS.md](./docs/business/METRICS.md)            |
| docs/operations/RUNBOOK.md     | ✅ Créé                     | [RUNBOOK.md](./docs/operations/RUNBOOK.md)          |
| docs/operations/INCIDENTS.md   | ✅ Créé                     | [INCIDENTS.md](./docs/operations/INCIDENTS.md)      |
| docs/operations/ONBOARDING.md  | ✅ Créé                     | [ONBOARDING.md](./docs/operations/ONBOARDING.md)    |

### Règles documentaires

1. **MASTER_PLAN.md est toujours à jour.** Si une décision change, ce document est mis à jour avant toute implémentation.
2. **Tout ADR (Architecture Decision Record) est documenté** dans `docs/technical/ARCHITECTURE.md` avec contexte, décision et conséquences.
3. **Les user stories** suivent le format : _En tant que [persona], je veux [action] afin de [bénéfice]._
4. **Aucune décision orale** n'est valide sans être transcrite dans le document approprié dans les 24 heures.

---

## 15. Organisation des Dossiers

> _La structure de répertoires standard du projet LoyaltyFlowAI._

```
loyaltyflowai/
│
├── MASTER_PLAN.md          ← Ce document
├── README.md
├── CHANGELOG.md
├── .gitignore
├── .env.example
│
├── docs/                   ← Documentation (voir §14)
│
├── apps/
│   ├── web/                ← Application frontend (dashboard client)
│   ├── api/                ← Backend API (REST ou GraphQL)
│   └── worker/             ← Service de traitement en arrière-plan
│
├── packages/               ← Code partagé entre les apps
│   ├── ui/                 ← Composants UI réutilisables
│   ├── types/              ← Types TypeScript partagés
│   └── utils/              ← Fonctions utilitaires partagées
│
├── infra/                  ← Infrastructure as Code
│   ├── terraform/
│   └── docker/
│
├── scripts/                ← Scripts de build, migration, seeding
│
└── tests/
    ├── e2e/                ← Tests end-to-end
    └── load/               ← Tests de charge
```

---

## 16. Conventions de Nommage

> _Les règles de nommage à respecter dans tout le projet._

### Fichiers et dossiers

- **Dossiers :** `kebab-case` (ex. `user-profile`, `loyalty-program`)
- **Fichiers de composants :** `PascalCase.tsx` (ex. `UserCard.tsx`)
- **Fichiers de services / utilitaires :** `camelCase.ts` (ex. `calculatePoints.ts`)
- **Fichiers de configuration :** `kebab-case.config.ts` (ex. `database.config.ts`)
- **Fichiers de tests :** `[nom-du-fichier].test.ts` ou `[nom-du-fichier].spec.ts`
- **Variables d'environnement :** `SCREAMING_SNAKE_CASE` (ex. `DATABASE_URL`)

### Code

- **Variables et fonctions :** `camelCase`
- **Classes et types :** `PascalCase`
- **Constantes globales :** `SCREAMING_SNAKE_CASE`
- **Enums :** `PascalCase` pour le type, `SCREAMING_SNAKE_CASE` pour les valeurs
- **Interfaces TypeScript :** **Pas de préfixe `I`** — ex. `User`, `LoyaltyProgram`, `Customer` (style Next.js / Prisma)

### Base de données

- **Tables :** `snake_case` au pluriel (ex. `loyalty_programs`, `customer_points`)
- **Colonnes :** `snake_case` (ex. `created_at`, `user_id`)
- **Index :** `idx_[table]_[colonne]` (ex. `idx_customers_email`)
- **Clés étrangères :** `fk_[table_source]_[table_cible]` (ex. `fk_points_customers`)

### Git

- **Branches :** `[type]/[description-courte]`
  - Types : `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/`
  - Ex. : `feat/loyalty-points-engine`, `fix/churn-score-calculation`
- **Commits :** Convention Conventional Commits (voir §17)

### API

- **Endpoints REST :** `/api/v1/[ressource]` en `kebab-case`
- **Méthodes HTTP :** respecter la sémantique (GET=lecture, POST=création, PATCH=modification partielle, DELETE=suppression)

---

## 17. Règles de Développement

> _Les standards non négociables du processus de développement._

### Workflow Git

1. Aucun commit direct sur `main` ou `develop`
2. Toute modification passe par une Pull Request (PR)
3. Toute PR requiert au minimum **1 review** avant merge
4. Les tests automatisés doivent passer avant tout merge
5. Le titre de la PR doit décrire le changement en termes de valeur utilisateur

### Convention de commits (Conventional Commits)

```
[type](scope): description courte en impératif

Types autorisés :
- feat     : nouvelle fonctionnalité
- fix      : correction de bug
- docs     : documentation uniquement
- style    : formatage (aucun changement logique)
- refactor : restructuration de code sans changement de comportement
- test     : ajout ou modification de tests
- chore    : tâches de maintenance (dépendances, config)
- perf     : amélioration de performance

Exemples :
feat(loyalty): add points calculation engine
fix(auth): resolve token expiration edge case
docs(api): update endpoint documentation for v1.2
```

### Règles de code

1. **Pas de `TODO` en production** — soit on le fait, soit on crée un ticket
2. **Pas de `console.log` en production** — utiliser le système de logging
3. **Pas de secrets dans le code** — toujours dans les variables d'environnement
4. **Pas de logique métier dans les composants UI**
5. **Toute fonction complexe doit avoir un test unitaire**
6. **Couverture de tests minimum : 70 %** (cible : 85 %)

### Revue de code — checklist

- [ ] Le code répond-il exactement au besoin décrit dans la PR ?
- [ ] Y a-t-il des cas limites non couverts ?
- [ ] Les erreurs sont-elles gérées correctement ?
- [ ] Y a-t-il un risque de sécurité ?
- [ ] La performance est-elle acceptable à l'échelle ?
- [ ] Les tests sont-ils présents et suffisants ?

---

## 18. Standards de Qualité

> _Ce que "qualité" signifie concrètement chez LoyaltyFlowAI._

### Qualité du code

| Dimension               | Standard                                                         |
| ----------------------- | ---------------------------------------------------------------- |
| Lisibilité              | Le code se lit comme de la prose. Les noms révèlent l'intention. |
| Complexité cyclomatique | < 10 par fonction                                                |
| Longueur de fonction    | < 50 lignes (idéalement < 20)                                    |
| Longueur de fichier     | < 300 lignes                                                     |
| Duplication             | Aucune logique dupliquée (DRY)                                   |
| Couplage                | Modules faiblement couplés, fortement cohésifs                   |

### Qualité des tests

| Type de test        | Couverture cible                        | Responsable          |
| ------------------- | --------------------------------------- | -------------------- |
| Tests unitaires     | 85 % des fonctions critiques            | Développeur          |
| Tests d'intégration | Tous les endpoints API                  | Développeur          |
| Tests E2E           | Tous les parcours utilisateur critiques | QA / Développeur     |
| Tests de charge     | Avant chaque release majeure            | Développeur / DevOps |

### Definition of Done (DoD)

Une fonctionnalité est considérée **terminée** uniquement si :

- [ ] Le code est mergé sur `develop`
- [ ] Les tests automatisés passent (couverture atteinte)
- [ ] La documentation est à jour
- [ ] La fonctionnalité a été testée manuellement en staging
- [ ] Le ticket correspondant est fermé
- [ ] Les métriques de succès sont configurées (analytics/monitoring)

---

## 19. Sécurité

> _La sécurité est une exigence de premier rang, intégrée dès la conception._

### Principes de sécurité

1. **Principe du moindre privilège :** Chaque composant n'a accès qu'à ce dont il a besoin.
2. **Defense in depth :** Plusieurs couches de sécurité, jamais une seule barrière.
3. **Fail securely :** En cas d'erreur, le système échoue vers un état sécurisé.
4. **Zero trust :** Aucune confiance implicite, même entre services internes.

### Authentification & Autorisation

- Authentification par JWT avec refresh tokens à rotation courte (15 min / 7 jours)
- RBAC (Role-Based Access Control) : Admin, Manager, Member, Read-only
- Support OAuth 2.0 (Google, GitHub) en phase 2
- MFA obligatoire pour les comptes admin dès la Phase 2
- Rate limiting sur tous les endpoints d'authentification

### Données

- Toutes les données sensibles chiffrées au repos (AES-256)
- Toutes les communications chiffrées en transit (TLS 1.3 minimum)
- Les mots de passe hashés avec bcrypt (coût ≥ 12)
- Les PII (données personnelles identifiables) isolées et loggées
- Politique de rétention des données définie et appliquée

### Conformité

- **RGPD** : Conformité obligatoire dès le MVP (droit à l'oubli, export de données, consentement)
- **PCI-DSS** : Hors scope pour le MVP (pas de traitement de cartes bancaires en interne)
- **SOC 2 Type II** : Objectif Phase 3 (requis pour les clients enterprise)

### Pratiques de développement sécurisé

- Analyse SAST (Static Application Security Testing) intégrée dans la CI
- Dépendances scannées pour les vulnérabilités (ex. npm audit, Snyk)
- Aucun secret dans Git (pre-commit hooks + scanning)
- Politique de divulgation responsable (responsible disclosure) publiée

### Gestion des incidents

- Temps de réponse à un incident de sécurité : < 4 heures
- Notification aux clients affectés : < 72 heures (obligation RGPD)
- Post-mortem documenté pour tout incident de sévérité ≥ 2

---

## 20. Principes UX

> _Comment nous concevons l'expérience utilisateur._

### Philosophie UX

**"Invisible Intelligence"** — L'IA doit être puissante dans les coulisses et simple en surface. L'utilisateur ne doit jamais avoir à comprendre comment le moteur fonctionne pour en tirer de la valeur.

### Principes directeurs

**UX1 — Clarté avant tout**
Chaque écran doit avoir une action principale évidente. L'utilisateur ne doit jamais se demander "que dois-je faire ici ?"

**UX2 — Progressive Disclosure**
Montrer d'abord l'essentiel. Les options avancées sont disponibles mais ne surchargent pas l'interface de base.

**UX3 — Feedback immédiat**
Chaque action de l'utilisateur doit produire un retour visible dans les 100 ms. Les opérations longues affichent une progression.

**UX4 — Tolérance à l'erreur**
Les erreurs doivent être impossibles à commettre (validation), ou facilement réversibles (undo). Les messages d'erreur expliquent le problème et sa solution.

**UX5 — Cohérence**
Les mêmes patterns d'interaction produisent les mêmes résultats sur toute la plateforme. Le système de design est respecté sans exception.

**UX6 — Accessibilité**
Conformité WCAG 2.1 niveau AA minimum. Navigation clavier complète. Support des lecteurs d'écran. Contrastes suffisants.

### Design System

- Palette de couleurs définie (primaire, secondaire, états)
- Typographie définie (hiérarchie, tailles, poids)
- Composants standardisés (boutons, formulaires, cartes, modales)
- Iconographie cohérente (bibliothèque unique)
- Motion design : animations fonctionnelles uniquement, jamais décoratives

---

## 21. Contraintes Techniques

> _Les limites réelles dans lesquelles nous opérons._

### Contraintes humaines

- Équipe initiale : très réduite (fondateur(s) + 0 à 2 développeurs)
- Pas d'équipe ops dédiée au lancement — DevOps doit être quasi-automatisé
- Budget infrastructure limité (< 500 €/mois pour le MVP)

### Contraintes techniques

- **Temps de réponse API :** < 300 ms au p95 pour toutes les requêtes standard
- **Disponibilité :** 99,9 % (soit < 8,7 heures de downtime/an)
- **Scalabilité MVP :** Supporter 100 clients simultanés sans dégradation
- **Scalabilité Phase 2 :** Supporter 1 000 clients simultanés
- **Data retention :** 2 ans de données clients par défaut (configurable)

### Contraintes légales

- Hébergement des données UE obligatoire (RGPD) — serveurs en Europe
- Conformité RGPD dès le premier client
- CGU et Politique de confidentialité rédigées avant tout lancement public

### Contraintes de compatibilité

- Navigateurs supportés : Chrome, Firefox, Safari, Edge (2 dernières versions majeures)
- Mobile : iOS Safari et Chrome Android (responsive, non natif en phase 1)
- Pas de support d'Internet Explorer

---

## 22. Stack Cible

> _Stack confirmée — toute modification doit être documentée avec sa justification dans `docs/technical/ARCHITECTURE.md`._

### Architecture générale

**Next.js full-stack (monorepo Turborepo)** — API Routes dans le même projet que le frontend. Pas de backend séparé pour le MVP. Le worker est un service Next.js indépendant dans le monorepo.

### Frontend + Backend (Next.js full-stack)

| Composant         | Technologie                               | Statut      |
| ----------------- | ----------------------------------------- | ----------- |
| Framework         | Next.js 14+ (App Router)                  | ✅ Confirmé |
| Language          | TypeScript (no `I` prefix)                | ✅ Confirmé |
| Styling           | Tailwind CSS                              | ✅ Confirmé |
| Composants UI     | shadcn/ui                                 | ✅ Confirmé |
| Server state      | TanStack Query                            | ✅ Décidé   |
| Client state      | Zustand (léger, pour UI state uniquement) | ✅ Décidé   |
| Graphiques        | Recharts                                  | ✅ Décidé   |
| ORM               | Prisma                                    | ✅ Confirmé |
| Monorepo          | Turborepo                                 | ✅ Décidé   |
| Gestion de projet | Linear                                    | ✅ Décidé   |

### Base de données & Cache

| Composant      | Technologie                                          | Statut    |
| -------------- | ---------------------------------------------------- | --------- |
| BDD principale | Supabase PostgreSQL (région EU — Frankfurt)          | ✅ Décidé |
| Auth managée   | Supabase Auth                                        | ✅ Décidé |
| Cache / Queue  | Upstash Redis (région EU)                            | ✅ Décidé |
| Search         | PostgreSQL full-text (Phase 1) / Typesense (Phase 2) | Phase 2   |
| Analytics      | TimescaleDB ou ClickHouse                            | Phase 3   |

### IA / ML

| Composant           | Technologie                                          | Statut      |
| ------------------- | ---------------------------------------------------- | ----------- |
| LLM pour génération | Claude API (Anthropic) — claude-sonnet-4-6           | ✅ Confirmé |
| Churn scoring MVP   | Règles heuristiques (inactivité) — pas de ML Phase 1 | ✅ Décidé   |
| ML embarqué         | Python (scikit-learn)                                | Phase 2     |
| Feature store       | À définir                                            | Phase 2     |

### Infrastructure

| Composant              | Technologie                                              | Statut      |
| ---------------------- | -------------------------------------------------------- | ----------- |
| Hosting frontend + API | Vercel (région EU — Frankfurt)                           | ✅ Décidé   |
| CI/CD                  | GitHub Actions                                           | ✅ Confirmé |
| Erreurs & monitoring   | Sentry                                                   | ✅ Confirmé |
| Emails transactionnels | Resend (EU)                                              | ✅ Décidé   |
| Containerisation       | Docker (dev local uniquement, pas requis en prod Vercel) | ✅ Confirmé |
| Orchestration          | N/A pour MVP (Vercel gère le scaling)                    | MVP         |

### Pricing confirmé

| Plan          | Prix       | Limite                         |
| ------------- | ---------- | ------------------------------ |
| Starter       | 49 €/mois  | Jusqu'à 500 clients            |
| Growth        | 149 €/mois | Jusqu'à 5 000 clients          |
| Pro           | 299 €/mois | Clients illimités + IA avancée |
| Essai gratuit | 14 jours   | Tous les plans                 |

---

## 23. Règles IA

> _Comment nous intégrons et gouvernons l'intelligence artificielle dans le produit._

### Philosophie IA

L'IA dans LoyaltyFlowAI est un **outil d'amplification**, jamais de substitution. Elle augmente la capacité de décision de l'utilisateur — elle ne décide pas à sa place sans supervision.

### Règles d'usage de l'IA

**R1 — Transparence des recommandations**
Toute recommandation générée par IA doit être accompagnée d'une explication accessible ("Nous suggérons cette récompense car ce client n'a pas acheté depuis 45 jours").

**R2 — L'humain reste en contrôle**
Aucune action à impact client (email, récompense, déduction de points) n'est déclenchée par l'IA sans validation explicite de l'opérateur humain — sauf si ce dernier a configuré une automatisation en connaissance de cause.

**R3 — Données d'entraînement isolées**
Les données clients ne sont jamais partagées entre tenants. Les modèles IA sont entraînés par tenant ou sur des données anonymisées et agrégées.

**R4 — Graceful degradation**
Si le service IA est indisponible, le produit continue de fonctionner sans fonctionnalité IA. Les features core ne dépendent pas de l'IA.

**R5 — Audit trail**
Toute décision ou suggestion IA est loggée avec horodatage, modèle utilisé, version, inputs et outputs — pour auditabilité et débogage.

**R6 — Biais et équité**
Les modèles sont régulièrement évalués pour détecter des biais discriminatoires (âge, genre, origine) dans les recommandations.

### Gouvernance de l'IA

- Un responsable IA est désigné dès que l'équipe dépasse 5 personnes
- Les modèles en production sont versionnés et documentés
- Un processus de rollback de modèle est défini avant tout déploiement IA

---

## 24. Roadmap Générale

> _La vision temporelle du développement de LoyaltyFlowAI._

```
2026 ───────────────────────────────────────────────────────────────────────▶

Q3 2026          Q4 2026          Q1 2027          Q2 2027          Q3 2027
│                │                │                │                │
▼                ▼                ▼                ▼                ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ PHASE 0 │  │ PHASE 1 │  │ PHASE 2 │  │ PHASE 3 │  │ PHASE 4 │
│ Fondation│  │   MVP   │  │ Traction│  │  Scale  │  │ Platform│
│ & Setup  │  │ Launch  │  │         │  │         │  │         │
└─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘
```

---

## 25. Définition de chaque Phase

### Phase 0 — Fondation (Q3 2026, ~6 semaines)

**Objectif :** Préparer tout ce qui est nécessaire pour développer rapidement et en sécurité.

**Livrables :**

- Infrastructure de base provisionnée
- Environnements dev, staging, production configurés
- CI/CD opérationnel
- Authentification de base (inscription / connexion)
- Structure de base de données initiale
- Design system de base
- 3 à 5 clients "design partners" identifiés et engagés

**Critères de sortie de phase :**

- Un développeur peut créer une feature et la déployer en production en < 30 minutes
- Les 3 premiers design partners ont validé le problème et la solution proposée

---

### Phase 1 — MVP (Q4 2026, ~8 semaines)

**Objectif :** Livrer la valeur fondamentale à un premier groupe de clients payants.

**Livrables :**

- Toutes les fonctionnalités décrites en §12
- Documentation utilisateur minimale
- Processus de support client défini
- Pricing initial défini et intégré

**Critères de sortie de phase :**

- 10 clients payants actifs
- NPS > 30
- Aucun bug critique en production pendant 2 semaines consécutives

---

### Phase 2 — Traction (Q1 2027, ~10 semaines)

**Objectif :** Accélérer la croissance et valider le product-market fit.

**Livrables :**

- Intégrations Shopify + WooCommerce
- Programme de parrainage
- Niveaux de fidélité (tiers)
- Notifications email automatisées
- Dashboard analytics avancé
- Processus d'onboarding automatisé (self-serve)

**Critères de sortie de phase :**

- 100 clients payants actifs
- Churn mensuel < 3 %
- 50 % des nouveaux clients proviennent d'un canal non-direct (bouche-à-oreille, SEO, partenaires)

---

### Phase 3 — Scale (Q2 2027, ~12 semaines)

**Objectif :** Préparer la croissance à grande échelle et ouvrir de nouveaux canaux.

**Livrables :**

- API publique avec documentation complète
- Widget embarquable
- Application mobile (iOS & Android)
- Support multi-devise et multi-langue
- Programme partenaires (agences)

**Critères de sortie de phase :**

- 500 clients payants actifs
- MRR 100 000 €
- API utilisée par au moins 20 partenaires externes

---

### Phase 4 — Platform (Q3 2027+)

**Objectif :** Devenir une plateforme, pas seulement un produit.

**Livrables :**

- White-labeling complet
- Marketplace d'intégrations
- IA avancée (LTV prediction, next best offer)
- Certifications enterprise (SOC 2)
- Expansion internationale

---

## 26. Dépendances entre les Phases

> _Ce qui doit exister dans une phase pour que la suivante soit possible._

```
Phase 0 ──┐
          │ → Fournit : infrastructure, auth, DB, CI/CD
          ↓
Phase 1 ──┐
          │ → Fournit : produit fonctionnel, clients payants, feedback
          ↓
Phase 2 ──┐
          │ → Fournit : intégrations, croissance organique, MRR stable
          ↓
Phase 3 ──┐
          │ → Fournit : API, partenaires, mobile, internationalisation
          ↓
Phase 4
```

### Dépendances critiques

| Phase cible | Dépend de                                    | Risque si non respecté              |
| ----------- | -------------------------------------------- | ----------------------------------- |
| Phase 1     | Design partners validés en Phase 0           | Construire le mauvais produit       |
| Phase 2     | Intégrations API clients validées en Phase 1 | Pas de marché pour les intégrations |
| Phase 3     | Modèle économique prouvé en Phase 2          | API publique sans utilisateurs      |
| Phase 4     | Base clients enterprise en Phase 3           | White-labeling sans clients cibles  |

---

## 27. Checklist avant Développement

> _À compléter avant d'écrire la première ligne de code d'une nouvelle fonctionnalité._

### Alignement stratégique

- [ ] La fonctionnalité est-elle dans le scope de la phase en cours ?
- [ ] Répond-elle à un besoin documenté d'un persona défini ?
- [ ] A-t-elle été validée avec au moins un client réel ?
- [ ] Dispose-t-elle d'une user story complète ?

### Clarté technique

- [ ] L'architecture de la solution est-elle documentée ?
- [ ] Les impacts sur la base de données sont-ils identifiés ?
- [ ] Les risques de sécurité ont-ils été évalués ?
- [ ] La stratégie de test est-elle définie ?

### Organisation

- [ ] Un ticket est créé dans l'outil de gestion de projet
- [ ] La feature est assignée à un développeur
- [ ] Les critères d'acceptation sont définis et mesurables
- [ ] La définition de "terminé" (DoD) est connue de tous

---

## 28. Checklist avant Production

> _À compléter avant tout déploiement en production._

### Qualité

- [ ] Tous les tests automatisés passent (unitaires, intégration, E2E)
- [ ] La couverture de tests est au niveau requis (≥ 70 %)
- [ ] La PR a été revue et approuvée par au moins 1 pair
- [ ] Le code a été testé manuellement en staging

### Sécurité

- [ ] Aucun secret n'est présent dans le code ou les logs
- [ ] Les nouvelles dépendances ont été auditées (npm audit)
- [ ] Les nouvelles routes API sont protégées par authentification
- [ ] Les inputs utilisateurs sont validés et sanitizés

### Infrastructure

- [ ] Les variables d'environnement de production sont configurées
- [ ] Les migrations de base de données ont été testées en staging
- [ ] Le rollback est planifié et documenté
- [ ] Les alertes de monitoring sont configurées pour les nouvelles métriques

### Communication

- [ ] Le CHANGELOG.md est mis à jour
- [ ] L'équipe support est informée des changements impactant les utilisateurs
- [ ] La documentation utilisateur est à jour

---

## 29. Checklist avant Lancement

> _À compléter avant l'annonce publique ou l'ouverture au grand public._

### Légal & Conformité

- [ ] CGU rédigées et approuvées par un juriste
- [ ] Politique de confidentialité conforme au RGPD
- [ ] Politique de cookies implémentée
- [ ] Mentions légales complètes sur le site
- [ ] DPO (Data Protection Officer) identifié ou désigné

### Produit

- [ ] L'onboarding complet fonctionne sans assistance humaine
- [ ] Les emails transactionnels sont configurés et testés
- [ ] Le flux de paiement est testé de bout en bout
- [ ] Le flow de résiliation fonctionne (obligatoire RGPD)
- [ ] La page de statut (status page) est active

### Support

- [ ] Un canal de support est opérationnel (email, chat)
- [ ] La base de connaissances minimale est publiée (FAQ)
- [ ] Un processus de réponse aux incidents clients est défini (SLA)

### Marketing

- [ ] Le site vitrine est finalisé et optimisé
- [ ] Les métriques Google Analytics / Plausible sont configurées
- [ ] La stratégie de lancement est définie (canaux, contenu, calendrier)
- [ ] Les comptes réseaux sociaux sont créés et optimisés

### Infrastructure

- [ ] Les sauvegardes automatiques sont configurées et testées
- [ ] Le plan de reprise après sinistre (DR) est documenté
- [ ] Les limites de rate limiting sont en place
- [ ] Un test de charge a été exécuté

---

## 30. Risques Connus

> _Les risques identifiés, leur probabilité, leur impact et les mesures de mitigation._

| Risque                                               | Probabilité | Impact   | Mitigation                                                       |
| ---------------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------- |
| Mauvaise définition du persona cible                 | Élevée      | Critique | Validation avec 10+ interviews avant le MVP                      |
| Dépendance sur une API tierce (ex. Stripe, Claude)   | Moyenne     | Élevée   | Abstraire les dépendances, prévoir des fallbacks                 |
| Churn élevé post-MVP                                 | Moyenne     | Élevée   | Suivi hebdomadaire, calls de succès client à J+7 et J+30         |
| Dette technique accumulée trop vite                  | Élevée      | Moyenne  | Code reviews systématiques, sprints de refactoring planifiés     |
| Fuite de données client                              | Faible      | Critique | RGPD by design, pen testing avant production                     |
| Concurrence d'un acteur établi sur notre niche       | Moyenne     | Élevée   | Différenciation par l'IA et la simplicité, rapidité d'exécution  |
| Scalabilité insuffisante lors d'une forte croissance | Faible      | Élevée   | Tests de charge en Phase 2, architecture scalable dès le départ  |
| Épuisement du fondateur (burnout)                    | Moyenne     | Critique | Limiter les sprints > 3 semaines, intégrer des pauses planifiées |
| Budget infrastructure dépassé                        | Moyenne     | Moyenne  | Monitoring des coûts cloud dès J1, alertes de budget             |
| Problèmes RGPD / légaux                              | Faible      | Critique | Consultation juridique en Phase 0, conformité by design          |

---

## 31. Hypothèses

> _Les suppositions sur lesquelles nous basons notre stratégie — à valider activement._

### Hypothèses marché

- **H1 :** Les PME e-commerce sont prêtes à payer entre 49 € et 299 €/mois pour une solution de fidélisation IA si le ROI est démontrable en < 60 jours.
- **H2 :** Le principal frein à l'adoption des outils de fidélisation existants est leur complexité d'intégration, pas leur prix.
- **H3 :** Un programme de parrainage entre clients existants sera le premier canal d'acquisition efficace.

### Hypothèses produit

- **H4 :** La fonctionnalité de score de churn sera la fonctionnalité la plus utilisée du MVP.
- **H5 :** L'import CSV est suffisant pour la Phase 1 — les clients n'ont pas besoin d'intégration native immédiatement.
- **H6 :** Les clients PME préfèrent un tableau de bord simple à un dashboard riche mais complexe.

### Hypothèses techniques

- **H7 :** PostgreSQL sera suffisant pour les besoins analytiques jusqu'à Phase 3.
- **H8 :** Une architecture monolithique modulaire est plus efficace qu'une architecture microservices pour les phases 0 et 1.
- **H9 :** Next.js avec App Router offre le meilleur équilibre entre vitesse de développement et performance.

---

## 32. Questions Ouvertes

> _Toutes les questions initiales ont été résolues le 2026-06-27. Le registre ci-dessous sert d'historique des décisions._

### ✅ Décisions actées — Stratégie

- **QO-001 :** Marché géographique → **France uniquement** pour le lancement (Phase 0-1). Extension en Phase 2.
- **QO-002 :** Pricing → **Essai gratuit 14 jours**, puis Starter 49€ / Growth 149€ / Pro 299€ par mois.
- **QO-003 :** Stratégie de sortie → **Acquisition** (horizon 5-7 ans).
- **QO-004 :** Structure fondateurs → **Fondateur solo**. Pas de co-fondateur pour l'instant.

### ✅ Décisions actées — Produit

- **QO-005 :** Segment MVP → **Restauration & food** (restaurants indépendants, cafés, food concepts). Voir Persona 0 (§10).
- **QO-006 :** Design partners → **Pas encore identifiés**. Action prioritaire de Phase 0 : identifier 3 à 5 restaurants partenaires avant de coder.
- **QO-007 :** Canal client final MVP → **Widget web embarquable** (snippet JS intégré sur le site du restaurateur).
- **QO-008 :** White-labeling → **Branding LoyaltyFlowAI visible** ("Powered by LoyaltyFlowAI") dès le MVP. White-label en option payante plus tard.

### ✅ Décisions actées — Technique

- **QO-009 :** Architecture → **Next.js full-stack** (API Routes). Pas de backend séparé pour le MVP.
- **QO-010 :** Cloud → **Vercel** (hosting, EU) + **Supabase** (PostgreSQL + Auth, EU) + **Upstash** (Redis, EU).
- **QO-011 :** TypeScript → **Pas de préfixe `I`** pour les interfaces. Ex. `User`, `LoyaltyProgram`.
- **QO-012 :** Gestion de projet → **Linear**.
- **QO-013 :** Structure repo → **Monorepo avec Turborepo**.

### ✅ Décisions actées — Business

- **QO-014 :** Statut juridique → **SAS** (Société par Actions Simplifiée), France.
- **QO-015 :** Investisseurs → **Aucun pour l'instant**. Projet bootstrappé.
- **QO-016 :** Runway → **6 à 12 mois** de financement personnel disponible.

### Questions ouvertes restantes

_Aucune question bloquante non résolue à ce jour._

---

## 33. Glossaire

> _Définitions communes pour éviter les malentendus au sein de l'équipe._

| Terme              | Définition                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| **ARR**            | Annual Recurring Revenue — Revenu récurrent annualisé                                                        |
| **CAC**            | Customer Acquisition Cost — Coût d'acquisition d'un nouveau client                                           |
| **Churn**          | Taux d'attrition — % de clients qui annulent leur abonnement sur une période                                 |
| **Design Partner** | Client précoce qui co-construit le produit en échange d'un accès prioritaire et/ou d'un tarif préférentiel   |
| **DoD**            | Definition of Done — Critères objectifs définissant qu'une tâche est terminée                                |
| **Feature**        | Fonctionnalité — Une capacité du produit apportant de la valeur à l'utilisateur                              |
| **ICP**            | Ideal Customer Profile — Profil du client idéal pour lequel le produit crée le plus de valeur                |
| **LTV**            | Lifetime Value — Valeur totale générée par un client sur toute sa durée de relation                          |
| **MRR**            | Monthly Recurring Revenue — Revenu récurrent mensuel                                                         |
| **MVP**            | Minimum Viable Product — Version minimale du produit capable de tester les hypothèses clés                   |
| **NPS**            | Net Promoter Score — Indicateur de satisfaction et de recommandation (échelle -100 à +100)                   |
| **NRR**            | Net Revenue Retention — Rétention du revenu après expansion et churn (> 100 % = croissance interne)          |
| **OKR**            | Objectives and Key Results — Cadre de définition et suivi des objectifs                                      |
| **Onboarding**     | Processus d'accueil et d'activation d'un nouveau client ou utilisateur                                       |
| **p95**            | 95e percentile — 95 % des requêtes sont traitées en-dessous de ce temps de réponse                           |
| **Payback Period** | Nombre de mois nécessaires pour récupérer le CAC via le revenu généré par le client                          |
| **Persona**        | Archétype d'utilisateur représentant un segment cible avec ses caractéristiques, motivations et frustrations |
| **PME**            | Petite et Moyenne Entreprise                                                                                 |
| **PRD**            | Product Requirements Document — Document décrivant les exigences d'une feature ou d'un produit               |
| **RBAC**           | Role-Based Access Control — Contrôle d'accès basé sur les rôles                                              |
| **RGPD**           | Règlement Général sur la Protection des Données (GDPR en anglais)                                            |
| **ROI**            | Return on Investment — Retour sur investissement                                                             |
| **SaaS**           | Software as a Service — Logiciel distribué sous forme d'abonnement via le cloud                              |
| **SLA**            | Service Level Agreement — Engagement de niveau de service                                                    |
| **Tenant**         | Instance isolée d'un client dans une architecture multi-tenant (chaque client a son espace séparé)           |
| **Time-to-Value**  | Temps entre l'inscription et le premier moment où l'utilisateur perçoit la valeur du produit                 |
| **UX**             | User Experience — Expérience utilisateur                                                                     |
| **Uptime**         | Disponibilité de la plateforme, exprimée en pourcentage sur une période                                      |
| **WCAG**           | Web Content Accessibility Guidelines — Standards d'accessibilité web                                         |

---

## Historique des versions de ce document

| Version | Date       | Auteur    | Changements                                                                                                                                                                                                  |
| ------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0.1.0   | 2026-06-27 | Fondateur | Création initiale du document                                                                                                                                                                                |
| 0.2.0   | 2026-06-27 | Fondateur | Décisions actées : toutes les QO fermées, stack confirmée (Next.js full-stack / Turborepo / Vercel + Supabase + Upstash), segment MVP restauration, pricing défini, Persona 0 ajouté                         |
| 0.3.0   | 2026-06-27 | Fondateur | Base documentaire complète créée (16 documents) : PRD, 6 user stories MVP, ARCHITECTURE (ADRs), DATABASE (schéma Prisma), API, SECURITY, ENVIRONMENTS, PRICING, GTM, METRICS, RUNBOOK, INCIDENTS, ONBOARDING |
| 0.4.0   | 2026-06-28 | Fondateur | Correction IC-01 : Widget ajouté dans §12 (MVP) et retiré de §13 (Phase 3 — erreur). Cohérent avec QO-007 actée.                                                                                             |

---

_Ce document est vivant. Il évolue avec le projet. Toute modification significative doit être versionnée et datée dans la table ci-dessus._

_LoyaltyFlowAI — Confidentiel — © 2026_
