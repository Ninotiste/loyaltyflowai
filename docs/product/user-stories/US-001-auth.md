# US-001 — Inscription et connexion sécurisée

> **Module :** Authentification
> **Statut :** À affiner
> **Priorité :** Must Have
> **Phase :** 1 (MVP)
> **Lié à :** [PRD.md §5.1](../PRD.md#51-authentification--comptes) | [ARCHITECTURE.md](../../technical/ARCHITECTURE.md) | [SECURITY.md](../../technical/SECURITY.md)

---

## User Stories

### US-001-A — Inscription

```
En tant que restaurateur,
Je veux créer un compte LoyaltyFlowAI avec mon email et un mot de passe,
Afin d'accéder à ma plateforme de fidélisation en moins de 5 minutes.
```

### US-001-B — Connexion

```
En tant que restaurateur inscrit,
Je veux me connecter à mon tableau de bord,
Afin de gérer mon programme de fidélité à tout moment.
```

### US-001-C — Déconnexion et session

```
En tant que restaurateur connecté,
Je veux que ma session soit sécurisée et que je puisse me déconnecter,
Afin de protéger les données de mes clients.
```

### US-001-D — Récupération de mot de passe

```
En tant que restaurateur ayant oublié son mot de passe,
Je veux recevoir un lien de réinitialisation par email,
Afin de récupérer l'accès à mon compte sans contacter le support.
```

---

## Critères d'acceptation

### US-001-A
- **Given** je suis sur la page d'inscription
- **When** je saisis un email valide, un mot de passe ≥ 8 caractères et je soumets le formulaire
- **Then** mon compte est créé, je reçois un email de confirmation, et je suis redirigé vers le dashboard

- **Given** je saisis un email déjà utilisé
- **When** je soumets le formulaire
- **Then** un message d'erreur m'indique que cet email est déjà associé à un compte

### US-001-B
- **Given** je suis sur la page de connexion
- **When** je saisis mes identifiants corrects
- **Then** je suis authentifié et redirigé vers mon dashboard

- **Given** je saisis un mot de passe incorrect
- **When** je soumets le formulaire
- **Then** un message d'erreur générique s'affiche (sans préciser si c'est l'email ou le mot de passe qui est incorrect)

### US-001-C
- **Given** je suis inactif pendant 15 minutes
- **When** j'essaie d'effectuer une action
- **Then** mon access token est rafraîchi automatiquement via le refresh token (si < 7 jours)

### US-001-D
- **Given** je suis sur la page de connexion et je clique "Mot de passe oublié"
- **When** je saisis mon email et je soumets
- **Then** je reçois un email avec un lien de réinitialisation valable 1 heure

---

## Notes techniques

- Auth managée via **Supabase Auth**
- JWT access token : durée de vie 15 minutes
- Refresh token : durée de vie 7 jours, rotation à chaque usage
- Mot de passe : hashé par Supabase (bcrypt)
- Rate limiting sur les endpoints d'auth : 5 tentatives / 15 min par IP

→ [Détails sécurité](../../technical/SECURITY.md) | [Architecture auth](../../technical/ARCHITECTURE.md)

---

## Définition de "Terminé" (DoD)

- [ ] Inscription fonctionnelle (email + mot de passe)
- [ ] Email de confirmation envoyé via Resend
- [ ] Connexion fonctionnelle avec redirection vers dashboard
- [ ] Déconnexion fonctionnelle
- [ ] Récupération de mot de passe fonctionnelle
- [ ] Rate limiting en place sur tous les endpoints d'auth
- [ ] Tests d'intégration couvrant les cas nominaux et les erreurs
- [ ] Testé manuellement en staging
