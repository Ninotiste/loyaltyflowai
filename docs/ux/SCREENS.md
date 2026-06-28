# UX DOCUMENTATION — Écrans, Flows et Micro-interactions

> **Version :** 1.0.0 | **Date :** 2026-06-28
> **Scope :** Toutes les pages, tous les écrans, tous les flows — dashboard restaurateur + widget client
> **Lié à :** [US-001 à US-011](../product/user-stories/) | [PRODUCT_BIBLE.md §9](../product/PRODUCT_BIBLE.md) | [DISCOVERY.md](../technical/DISCOVERY.md)

---

## Table des matières

1. [Principes UX](#1-principes-ux)
2. [Navigation globale](#2-navigation-globale)
3. [Authentification](#3-authentification)
4. [Onboarding](#4-onboarding)
5. [Dashboard principal](#5-dashboard-principal)
6. [Gestion du programme](#6-gestion-du-programme)
7. [Gestion des clients](#7-gestion-des-clients)
8. [Analytics](#8-analytics)
9. [Paramètres](#9-paramètres)
10. [Interface employé (mode simplifié)](#10-interface-employé-mode-simplifié)
11. [Widget client final](#11-widget-client-final)
12. [États spéciaux](#12-états-spéciaux)
13. [Micro-interactions et animations](#13-micro-interactions-et-animations)
14. [Notifications](#14-notifications)
15. [Design tokens](#15-design-tokens)

---

## 1. Principes UX

### Le restaurateur n'est pas un "digital native"

Lucas (gérant de restaurant, 42 ans) utilise son iPhone pour WhatsApp et Doctolib. Il a peur des outils compliqués. Marie-Claude (55 ans) préfère appeler que de remplir un formulaire. **L'UX doit être au niveau d'une app de grande distribution — pas d'une SaaS B2B.**

### Principes non-négociables

| Principe                     | Application concrète                                         |
| ---------------------------- | ------------------------------------------------------------ |
| **Zéro jargon technique**    | "Clients à risque" et non "Churn rate élevé"                 |
| **Action visible en 1 clic** | L'action principale de chaque page a un CTA primaire évident |
| **Feedback immédiat**        | Toute action déclenche une réponse visible en < 200ms        |
| **Mobile-first**             | 60 % des gérants accèdent depuis leur téléphone              |
| **Accessibilité AA**         | WCAG 2.1, contraste ≥ 4.5:1, navigation clavier              |
| **État vide ≠ page blanche** | Les empty states guidant la prochaine action                 |

---

## 2. Navigation globale

### Structure de navigation (Dashboard Restaurateur)

```
Sidebar (desktop) / Bottom nav (mobile)
├── 🏠 Accueil (Dashboard)
├── 👥 Clients
├── 🎁 Programme
├── 📊 Analytics
└── ⚙️  Paramètres
    ├── Mon restaurant
    ├── Équipe
    ├── Widget
    ├── Abonnement
    └── RGPD / Confidentialité
```

### Breadcrumb pattern

```
Accueil > Clients > Emma Dupont
```

### Responsive breakpoints

| Breakpoint          | Layout        | Navigation        |
| ------------------- | ------------- | ----------------- |
| < 640px (mobile)    | Single column | Bottom tab bar    |
| 640-1024px (tablet) | 2 colonnes    | Sidebar collapsed |
| > 1024px (desktop)  | 3 colonnes    | Sidebar expanded  |

---

## 3. Authentification

### Page Login

```
┌─────────────────────────────────────────────┐
│                                             │
│            🍽️  LoyaltyFlowAI               │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  Email                                │  │
│  │  [lucas@bistrot-du-marche.fr        ] │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  Mot de passe                         │  │
│  │  [••••••••••••••••••••              ] │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [         Se connecter          ]          │
│                                             │
│  ─────────── ou ───────────────             │
│                                             │
│  [  G  Continuer avec Google    ]           │
│                                             │
│  Mot de passe oublié ?                      │
│  Pas de compte ? Essayer gratuitement →     │
│                                             │
└─────────────────────────────────────────────┘
```

**États :**

- Default : formulaire vide
- Loading : bouton "Se connecter" → spinner + désactivé
- Error email invalide : bordure rouge + message sous le champ
- Error credentials : bandeau rouge en haut "Email ou mot de passe incorrect"
- Success : redirection vers dashboard (ou onboarding si premier login)

**Micro-interactions :**

- Focus sur un champ → label flotte vers le haut (floating label)
- Mot de passe : icône œil pour toggle visibilité
- Bouton submit : ripple effect au clic

---

### Page Mot de passe oublié

```
┌──────────────────────────────────────────┐
│  ← Retour à la connexion                 │
│                                          │
│  Réinitialiser mon mot de passe          │
│                                          │
│  Saisissez votre email — nous vous       │
│  enverrons un lien de réinitialisation.  │
│                                          │
│  [Email                               ]  │
│                                          │
│  [   Envoyer le lien de réinitialisation ]│
│                                          │
│  ─ Succès ──────────────────────────── ─ │
│  ✅ Email envoyé à lucas@...             │
│  Vérifiez votre boîte (et les spams).   │
└──────────────────────────────────────────┘
```

---

## 4. Onboarding

### Barre de progression

```
  ① ────── ② ────── ③ ────── ④
  Profil   Programme  Widget   Équipe

  ● ────── ○ ────── ○ ────── ○
  (Étape en cours = cercle plein)
```

### Étape 1 — Profil du restaurant

```
┌────────────────────────────────────────────┐
│  Bienvenue ! Parlons de votre restaurant.  │
│                                            │
│  ① ── ② ── ③ ── ④                          │
│                                            │
│  Nom du restaurant *                       │
│  [Le Bistrot du Marché               ]     │
│                                            │
│  Type de restauration                      │
│  ┌──────────────────────────────────────┐  │
│  │ ○ Brasserie / Bistrot                │  │
│  │ ○ Restaurant gastronomique           │  │
│  │ ○ Fast-casual / Sandwicherie         │  │
│  │ ○ Pizzeria / Italienne               │  │
│  │ ○ Autre                              │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Nombre de clients par mois (estimation)   │
│  [ < 100 ▼ ]                               │
│                                            │
│  ☐ J'accepte les CGU et la DPA RGPD       │
│    [Lire la DPA]                           │
│                                            │
│  [  Continuer  ]  Je complèterai plus tard │
└────────────────────────────────────────────┘
```

### Étape 2 — Créer mon programme

```
┌────────────────────────────────────────────┐
│  Créez votre premier programme.            │
│  Vous pourrez le modifier plus tard.       │
│                                            │
│  ① ── ② ── ③ ── ④                          │
│                                            │
│  Comment récompenser vos clients ?         │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ ● Carte à tampons (Recommandé)       │  │
│  │   Le plus simple pour commencer      │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ ○ Points sur montant dépensé         │  │
│  │   1 point = 1 euro (configurable)    │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Mode : Carte à tampons sélectionné        │
│                                            │
│  Tampons pour une récompense               │
│  [ ─ ] [ 10 ] [ + ]                        │
│                                            │
│  La récompense obtenue                     │
│  [ Café offert                       ]     │
│                                            │
│  ─────────────── Aperçu ──────────────── │
│  ●●●●●●●●●○  →  ☕ Café offert           │
│  ─────────────────────────────────────── │
│                                            │
│  [  Créer mon programme  ]                 │
└────────────────────────────────────────────┘
```

### Étape 3 — Widget

```
┌────────────────────────────────────────────┐
│  Installez le widget sur votre site.       │
│                                            │
│  ① ── ② ── ③ ── ④                          │
│                                            │
│  Copiez ce code sur votre site web :       │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ <script src="https://cdn.loyalty     │  │
│  │ flowai.fr/widget.js"                 │  │
│  │ data-public-key="pk_live_xxx">       │  │
│  │ </script>                            │  │
│  │                              [Copier]│  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Comment faire ?                           │
│  [WordPress] [Wix] [Site custom]           │
│                                            │
│  [  Voir la démo du widget  ] →           │
│                                            │
│  ─────────────────────────────────────── │
│  ☐ Mon site n'est pas encore prêt         │
│    (Nous vous enverrons un rappel)         │
│  ─────────────────────────────────────── │
│                                            │
│  [  Continuer  ]                           │
└────────────────────────────────────────────┘
```

### Étape 4 — Équipe

```
┌────────────────────────────────────────────┐
│  Invitez votre équipe (optionnel).         │
│                                            │
│  ① ── ② ── ③ ── ④                          │
│                                            │
│  Email de l'employé                        │
│  [sarah@bistrot.fr                   ]     │
│                                            │
│  Rôle                                      │
│  [ Manager ▼ ]                             │
│                                            │
│  [  Envoyer l'invitation  ]                │
│                                            │
│  [  Passer cette étape  ]                  │
└────────────────────────────────────────────┘
```

### Célébration finale

```
┌────────────────────────────────────────────┐
│          🎉  Félicitations !               │
│                                            │
│  Votre programme de fidélité est prêt.     │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  ✅ Programme "10 tampons" créé       │  │
│  │  ✅ Widget installé                  │  │
│  │  ✅ Sarah invitée                    │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [  Enregistrer mon premier client  ]      │
│                                            │
│  Découvrir le dashboard →                  │
└────────────────────────────────────────────┘
```

---

## 5. Dashboard principal

### Layout desktop

```
┌──────────┬────────────────────────────────────────────┐
│          │  Bonjour Lucas 👋                  [🔔 2]  │
│  🏠 Home │  ─────────────────────────────────────── │
│  👥 Clients│                                          │
│  🎁 Prog. │  KPIs du mois                             │
│  📊 Stats │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  ⚙️ Param │  │ 1823 │ │ 142  │ │  8 % │ │  67  │    │
│          │  │Clients│ │Nouv. │ │Churn │ │Rois. │    │
│          │  └──────┘ └──────┘ └──────┘ └──────┘    │
│          │                                           │
│          │  ⚠️  3 clients à risque de partir          │
│          │  [ Voir les alertes ]                     │
│          │                                           │
│          │  Activité récente                         │
│          │  · Emma D. — +1 tampon — 14:23            │
│          │  · Pierre M. — Récompense utilisée        │
│          │  · Marie C. — Nouveau client              │
│          │  [Voir tout]                              │
│          │                                           │
│          │  Checklist d'activation         3/5 ████░ │
│          │  ✅ Programme créé                        │
│          │  ✅ 1er client enregistré                 │
│          │  □ Widget installé                        │
│          │  □ 5 clients enregistrés                  │
│          │  □ 1er employé invité                     │
└──────────┴───────────────────────────────────────────┘
```

### Encart "Clients à risque" (Loyalty Brain)

```
┌─────────────────────────────────────────────────────┐
│  🧠 Loyalty Brain — 3 clients à risque               │
│  ─────────────────────────────────────────────────  │
│  Emma Dupont        67 jours inactive     [Contacter]│
│  Jean Lefebvre      54 jours inactif      [Contacter]│
│  Sophie Martin      48 jours inactive     [Contacter]│
│                                                     │
│  [ Envoyer une campagne de réactivation ]           │
└─────────────────────────────────────────────────────┘
```

**Comportement "Contacter" :**

- Ouvre un panneau latéral
- Suggestion de message pré-rédigé par l'IA
- Option d'envoi email immédiat ou programmé

---

## 6. Gestion du programme

### Liste des règles d'attribution

```
┌─────────────────────────────────────────────────────┐
│  Mon Programme                          [Modifier]  │
│  ─────────────────────────────────────────────────  │
│  Statut : ● Actif                                   │
│  Type : Carte à tampons                             │
│  Récompense : 1 café offert pour 10 tampons         │
│                                                     │
│  Règles d'attribution                    [+ Ajouter]│
│  ─────────────────────────────────────────────────  │
│  ✓  Visite standard          +1 tampon    [Éditer]  │
│  ✓  Visite ≥ 30 €            +2 tampons   [Éditer]  │
│                                                     │
│  Récompenses disponibles                  [+ Ajouter]│
│  ─────────────────────────────────────────────────  │
│  🏆 10 tampons = Café offert              [Éditer]  │
│                                                     │
│  [  Suspendre le programme  ]                       │
└─────────────────────────────────────────────────────┘
```

### Éditeur de règle (panel latéral)

```
┌──────────────────────────────────────┐
│  Modifier la règle               [✕] │
│  ──────────────────────────────────  │
│  Déclencheur                         │
│  [ Toute visite ▼ ]                  │
│                                      │
│  Points / Tampons attribués          │
│  [ ─ ] [ 1 ] [ + ]                   │
│                                      │
│  Condition (optionnel)               │
│  ☐ Montant minimum                   │
│     [     ] €                        │
│                                      │
│  ☐ Valable uniquement certains jours  │
│     [Lun] [Mar] [Mer] [Jeu] [Ven]    │
│     [Sam] [Dim]                      │
│                                      │
│  [  Annuler  ]  [  Sauvegarder  ]    │
└──────────────────────────────────────┘
```

---

## 7. Gestion des clients

### Liste clients

```
┌─────────────────────────────────────────────────────┐
│  Clients (1 823)              [🔍 Rechercher]  [+ Nouveau] │
│  ─────────────────────────────────────────────────  │
│  Filtres : [Tous ▼] [Ce mois ▼] [Statut ▼]         │
│                                                     │
│  Nom              Points   Dernier passage  Statut  │
│  Emma Dupont      7 ●●●●●●●○○○  24 juin    ● Actif  │
│  Jean Lefebvre    4 ●●●●○○○○○○  3 juin     ⚠ Risque │
│  Pierre Martin    10 ●●●●●●●●●● 28 juin    🏆 Récomp │
│  Sophie Martin    0 ○○○○○○○○○○  11 mai     🔴 Inactif│
│                                                     │
│  [Charger plus]                                     │
└─────────────────────────────────────────────────────┘
```

**Codes couleur statut :**

- ● Vert : actif (visité dans les 30 derniers jours)
- ⚠ Orange : à risque (30-60 jours d'inactivité)
- 🔴 Rouge : inactif (> 60 jours)
- 🏆 Or : récompense disponible

### Profil client

```
┌─────────────────────────────────────────────────────┐
│  ← Clients    Emma Dupont                           │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  📧 emma.dupont@gmail.com                           │
│  📅 Membre depuis le 15 mars 2026                   │
│  🏠 Dernière visite : 24 juin 2026 (il y a 4 jours)│
│                                                     │
│  Sa carte :  ●●●●●●●○○○  7/10 tampons               │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  🧠 Analyse IA                                      │
│  Risque de churn : LOW (15 %)                       │
│  Fréquence habituelle : 1 visite / 10 jours         │
│  Suggestion : "Emma est votre cliente la plus régulière │
│  — pensez à la remercier lors de sa prochaine visite" │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  Historique des transactions                        │
│  24 juin  +1 tampon  (Alex)                         │
│  18 juin  +2 tampons (Lucas — visite ≥ 30 €)        │
│  10 juin  +1 tampon  (Sarah)                        │
│  3 juin   Récompense utilisée ✅                     │
│  [Voir tout]                                        │
│                                                     │
│  [  Attribuer des points  ]  [  Envoyer un message ]│
│  [  Exporter les données  ]  [  Supprimer (RGPD)  ] │
└─────────────────────────────────────────────────────┘
```

### Modal d'attribution manuelle de points

```
┌────────────────────────────────────────┐
│  Attribuer des points à Emma       [✕] │
│  ────────────────────────────────────  │
│  Montant de la commande                │
│  [ 42,50               ] €            │
│                                        │
│  ↳ Emma gagnera : 1 tampon             │
│    (règle : visite standard)           │
│                                        │
│  ─ ou ─────────────────────────────── │
│                                        │
│  Attribuer manuellement                │
│  [ ─ ] [ 1 ] [ + ] tampon(s)          │
│  Raison : [ex: Erreur à corriger ]     │
│                                        │
│  [ Annuler ]  [ Confirmer ]            │
└────────────────────────────────────────┘
```

---

## 8. Analytics

### Vue analytique principale

```
┌─────────────────────────────────────────────────────┐
│  Analytics                    [Ce mois ▼] [Export]  │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Vue d'ensemble                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  1 823   │  │   142    │  │   67 %   │          │
│  │ Clients  │  │ Nouveaux │  │ Taux act.│          │
│  │ actifs   │  │ ce mois  │  │ (30j)    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
│  Nouveaux clients / mois (12 mois glissants)        │
│  █▄▂▄▅▇▆█▅▄▆▇                                      │
│  J A S O N D J F M A M J                           │
│                                                     │
│  Distribution des statuts clients                   │
│  ■ Actifs (1142)   ■ À risque (482)   ■ Inactifs (199)│
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░▒▒▒▒                   │
│                                                     │
│  Récompenses utilisées ce mois : 34                 │
│  Taux de rédemption : 18 %                          │
└─────────────────────────────────────────────────────┘
```

---

## 9. Paramètres

### Paramètres — Widget (personnalisation)

```
┌─────────────────────────────────────────────────────┐
│  Configuration du widget                            │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Couleur principale                                 │
│  [████] #2563EB  [Choisir]                          │
│                                                     │
│  Texte du bouton                                    │
│  [ Mes points 🎁                    ]               │
│                                                     │
│  Position                                           │
│  ● Bas droite  ○ Bas gauche                         │
│                                                     │
│  Message de bienvenue                               │
│  [ Bienvenue chez Le Bistrot du Marché !      ]     │
│                                                     │
│  ─────── Aperçu en temps réel ─────────             │
│  [  Voir la démo  ]                                 │
│                                                     │
│  Code à copier                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ <script src="...widget.js"                    │ │
│  │ data-public-key="pk_live_xxx">                │ │
│  │ </script>                          [Copier]   │ │
│  └────────────────────────────────────────────────┘ │
│                                                     │
│  [  Régénérer la clé  ] (invalide l'ancienne)       │
└─────────────────────────────────────────────────────┘
```

---

## 10. Interface employé (mode simplifié)

```
┌─────────────────────────────────────────────────────┐
│  🍽️ Le Bistrot du Marché      Bonjour Alex  [↪ Exit] │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  [🔍  Rechercher un client par email ou nom...   ]  │
│                                                     │
│  ─ ou ──────────────────────────────────────────── │
│                                                     │
│  [  📷 Scanner le QR du client  ]                   │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  [  + Nouveau client  ]   [  💳 Récompense  ]       │
│                                                     │
│  ─ Activité récente ─────────────────────────────── │
│  14:23  Emma D.     +1 tampon                       │
│  13:55  Pierre M.   Récompense ✅                   │
│  13:42  Marie C.    Nouveau client                  │
└─────────────────────────────────────────────────────┘
```

### Résultat de recherche (employé)

```
┌─────────────────────────────────────────────────────┐
│  Emma Dupont                                        │
│  emma.dupont@gmail.com                              │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ●●●●●●●○○○   7 / 10 tampons                        │
│                                                     │
│  Saisir le montant de la commande :                 │
│  [          ] €                                     │
│                                                     │
│  [  ✅ Confirmer (+1 tampon)  ]                      │
└─────────────────────────────────────────────────────┘
```

**Animation après confirmation :**
→ La carte s'affiche avec le nouveau tampon ajouté
→ Son remplissage animé (◯ → ●) sur 400ms
→ Message positif si seuil : "🎉 Emma a débloqué sa récompense !"

---

## 11. Widget client final

### État initial (bouton)

```
                ┌────────────────┐
                │ 🎁 Mes points  │  ← Bouton flottant bas droite
                └────────────────┘
```

### Panneau ouvert — Non identifié

```
┌────────────────────────────────────┐
│  🍽️ Le Bistrot du Marché       [✕] │
│  ──────────────────────────────── │
│                                   │
│  Rejoignez notre programme        │
│  de fidélité !                    │
│                                   │
│  10 tampons = 1 café offert ☕    │
│                                   │
│  Email *                          │
│  [                             ]  │
│                                   │
│  Prénom *                         │
│  [                             ]  │
│                                   │
│  ☐ J'accepte de recevoir des     │
│    communications du restaurant  │
│                                   │
│  [  Rejoindre le programme  ]     │
│                                   │
│  Déjà membre ? [Me connecter]     │
└────────────────────────────────────┘
```

### Panneau — Client identifié (carte tampons)

```
┌────────────────────────────────────┐
│  🍽️ Le Bistrot du Marché       [✕] │
│  Bonjour, Emma ! 👋               │
│  ──────────────────────────────── │
│                                   │
│  Vos tampons                      │
│  ●●●●●●●○○○                       │
│                                   │
│  7 sur 10 — Plus que 3 !          │
│  ████████████████░░░░░░  70 %     │
│                                   │
│  Prochain objectif :              │
│  ☕ Café offert                    │
│                                   │
│  ──────────────────────────────── │
│  Dernières visites                │
│  · 24 juin +1 tampon              │
│  · 18 juin +2 tampons             │
│  · 10 juin +1 tampon              │
│                                   │
│  [  Partager avec un ami 🎁  ]    │
└────────────────────────────────────┘
```

### Panneau — Récompense disponible

```
┌────────────────────────────────────┐
│  🍽️ Le Bistrot du Marché       [✕] │
│  ──────────────────────────────── │
│                                   │
│     🎉  Félicitations, Emma !     │
│                                   │
│   Vous avez gagné votre récompense│
│        ☕  Café offert             │
│                                   │
│  [  Afficher mon code  ]          │
│                                   │
│  ──────────────────────────────── │
│  Votre nouveau compteur : 0/10    │
│  ○○○○○○○○○○                       │
└────────────────────────────────────┘
```

### Modal de récompense (QR code)

```
┌────────────────────────────────────┐
│  Montrez ce code à notre équipe    │
│                                    │
│       ┌─────────────────┐          │
│       │                 │          │
│       │   [QR CODE]     │          │
│       │                 │          │
│       └─────────────────┘          │
│                                    │
│       Code : LFLW-4892-XK          │
│                                    │
│       ⏱ Valide 15 minutes          │
│                                    │
│  [  Fermer  ]                      │
└────────────────────────────────────┘
```

---

## 12. États spéciaux

### Empty states

| Page          | Situation            | Message                                                                      | CTA                   |
| ------------- | -------------------- | ---------------------------------------------------------------------------- | --------------------- |
| Clients       | 0 clients            | "Vos premiers clients vous attendent ! Partagez le widget sur votre site."   | "Installer le widget" |
| Analytics     | < 7 jours de données | "Les analytics s'enrichissent avec le temps. Revenez dans une semaine !"     | —                     |
| Alertes churn | 0 alertes            | "Excellent ! Aucun client à risque en ce moment. Continuez comme ça."        | —                     |
| Transactions  | 0 transactions       | "Aucune transaction ce mois. Encouragez votre équipe à utiliser le système." | —                     |

### États de chargement

- **Liste clients :** Skeleton loaders (3 lignes grises animées)
- **Profil client :** Skeleton sur les KPI puis le graphique
- **Widget :** Spinner centré dans le panneau
- **Dashboard :** Skeleton sur les 4 KPI cards

### États d'erreur

| Erreur               | Contexte     | Message                                                            | Action             |
| -------------------- | ------------ | ------------------------------------------------------------------ | ------------------ |
| 500 API              | Toute page   | "Une erreur est survenue. Notre équipe a été notifiée."            | Bouton "Réessayer" |
| 404 client           | Recherche    | "Client introuvable. Vérifiez l'email ou créez un nouveau profil." | "Nouveau client"   |
| Widget hors-ligne    | Perte réseau | Pas d'affichage — graceful degradation                             | —                  |
| Session expirée      | Navigation   | Bandeau "Session expirée"                                          | "Se reconnecter"   |
| Limite plan atteinte | Ajout client | "Vous avez atteint la limite de X clients. Passez à Growth."       | "Upgrader"         |

---

## 13. Micro-interactions et animations

### Principes

- **Durée :** 150-300ms pour les transitions, 400-600ms pour les animations de contenu
- **Easing :** ease-in-out pour les transitions, spring pour les éléments interactifs
- **Aucune animation de > 700ms** (nuit à la fluidité perçue)

### Animations spécifiques

| Élément                       | Animation                            | Durée                 |
| ----------------------------- | ------------------------------------ | --------------------- |
| Tampon ajouté (carte employé) | Circle fill + scale-up bounce        | 400ms                 |
| Récompense débloquée          | Confetti + slide-in celebration card | 600ms                 |
| KPI mis à jour                | Count-up animation                   | 800ms                 |
| Sidebar mobile open           | Slide-in from left                   | 200ms                 |
| Widget panneau open           | Slide-up + fade-in                   | 250ms                 |
| Toast notification            | Slide-in top right                   | 200ms + auto-close 4s |
| Skeleton loader               | Shimmer gradient gauche → droite     | Boucle infinie        |
| Score churn badge             | Pulse si HIGH risk                   | Boucle toutes les 2s  |

---

## 14. Notifications

### Notifications in-app (toasts)

```
Position : top-right
Durée d'affichage : 4 secondes (success) / 6 secondes (error)
Superposition : max 3 toasts simultanés

Styles :
  ✅ [Succès] Points attribués à Emma (+1 tampon)
  ❌ [Erreur] Impossible d'attribuer les points — Réessayez
  ⚠️  [Warning] Vous approchez de votre limite (450/500 clients)
  ℹ️  [Info] Emma vient de débloquer sa récompense
```

### Centre de notifications (🔔)

```
┌────────────────────────────────────────┐
│  Notifications           Tout marquer lu│
│  ──────────────────────────────────── │
│  Aujourd'hui                           │
│  🔴 3 clients à risque de partir      │
│     Il y a 2 heures                   │
│                                        │
│  Hier                                  │
│  🏆 Emma D. a débloqué sa récompense  │
│  ✅ Nouveau client enregistré (Sarah)  │
└────────────────────────────────────────┘
```

### Emails (résumé des templates)

| Template                | Déclencheur        | Sujet                                        |
| ----------------------- | ------------------ | -------------------------------------------- |
| Bienvenue restaurant    | Inscription        | "Bienvenue sur LoyaltyFlowAI 🎉"             |
| Invitation employé      | Invitation team    | "[Nom] vous invite à rejoindre [Restaurant]" |
| Facture                 | Paiement réussi    | "Votre facture LoyaltyFlowAI — [mois]"       |
| Paiement échoué         | Échec prélèvement  | "Action requise — Problème de paiement"      |
| Bienvenue client        | Inscription widget | "Bienvenue chez [Restaurant] 🎁"             |
| Activation client       | J+2 sans usage     | "[Restaurant] : votre carte vous attend"     |
| Récompense disponible   | Seuil atteint      | "Votre [récompense] est prête ! 🎊"          |
| Réactivation léger      | 45 jours inactif   | "Vous nous manquez, [prénom]"                |
| Réactivation avec offre | 75 jours inactif   | "Un cadeau vous attend chez [Restaurant] 🎁" |

---

## 15. Design tokens

### Couleurs

```css
/* Couleurs primaires */
--color-primary-500: #2563eb; /* Bleu LoyaltyFlowAI */
--color-primary-600: #1d4ed8; /* Hover */
--color-primary-100: #dbeafe; /* Background léger */

/* Statuts */
--color-success: #16a34a;
--color-warning: #d97706;
--color-danger: #dc2626;
--color-info: #0891b2;

/* Neutrals */
--color-gray-900: #111827; /* Texte principal */
--color-gray-600: #4b5563; /* Texte secondaire */
--color-gray-200: #e5e7eb; /* Bordures */
--color-gray-50: #f9fafb; /* Background pages */
```

### Typographie

```css
/* Font */
--font-family: 'Inter', system-ui, sans-serif;

/* Scales */
--text-xs: 0.75rem; /* 12px — Labels, captions */
--text-sm: 0.875rem; /* 14px — Body, tables */
--text-base: 1rem; /* 16px — Corps principal */
--text-lg: 1.125rem; /* 18px — Sous-titres */
--text-xl: 1.25rem; /* 20px — Titres de section */
--text-2xl: 1.5rem; /* 24px — Titres de page */
--text-3xl: 1.875rem; /* 30px — KPI chiffres */
```

### Espacements

```css
/* Spacing scale (base 4px) */
--space-1: 4px /* Gap minimal */ --space-2: 8px /* Padding interne tight */ --space-3: 12px
  /* Gap medium */ --space-4: 16px /* Padding standard */ --space-6: 24px /* Gap large */
  --space-8: 32px /* Section padding */;
```

### Ombres

```css
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1); /* Cards, modals */
--shadow-xl: 0 20px 25px rgb(0 0 0 / 0.1); /* Widget panneau */
```

---

_LoyaltyFlowAI — Document confidentiel — © 2026_
