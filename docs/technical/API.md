# API.md — Documentation API

> **Projet :** LoyaltyFlowAI
> **Version :** v1 (MVP)
> **Statut :** En conception — Phase 0
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [ARCHITECTURE.md](./ARCHITECTURE.md) | [DATABASE.md](./DATABASE.md) | [SECURITY.md](./SECURITY.md)

---

## Sommaire

1. [Principes de l'API](#1-principes-de-lapi)
2. [Authentification](#2-authentification)
3. [Conventions](#3-conventions)
4. [Endpoints — Dashboard (privé)](#4-endpoints--dashboard-privé)
5. [Endpoints — Widget (public)](#5-endpoints--widget-public)
6. [Gestion des erreurs](#6-gestion-des-erreurs)
7. [Rate Limiting](#7-rate-limiting)
8. [Versioning](#8-versioning)

---

## 1. Principes de l'API

- **REST** : ressources nommées, méthodes HTTP sémantiques
- **JSON** : format unique d'échange (request + response)
- **Versioning** : préfixe `/api/v1/` — les breaking changes créent une `/api/v2/`
- **Validation** : tous les inputs sont validés avec **Zod** avant traitement
- **Multi-tenant** : le `tenant_id` est dérivé du JWT — jamais envoyé par le client
- **Deux audiences** : API privée (dashboard restaurateur) + API publique widget (clé publique)

---

## 2. Authentification

### API Privée (Dashboard)
Authentification via **Supabase Auth** — JWT Bearer Token.

```
Authorization: Bearer <access_token>
```

Le `tenant_id` (organization_id) est extrait du JWT côté serveur. Le client ne l'envoie jamais.

### API Publique (Widget)
Authentification via une **clé publique** (public key) dans le header.

```
X-Public-Key: pk_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

La clé publique est spécifique à un programme de fidélité et ne donne accès qu'aux données du widget (lecture seule, données non-sensibles).

---

## 3. Conventions

### URL
```
/api/v1/{ressource}              ← Collection
/api/v1/{ressource}/{id}         ← Ressource individuelle
/api/v1/{ressource}/{id}/{action} ← Action sur une ressource
```

### Méthodes HTTP
| Méthode | Usage |
|---|---|
| `GET` | Lecture |
| `POST` | Création |
| `PATCH` | Modification partielle |
| `DELETE` | Suppression |

### Format de réponse

**Succès :**
```json
{
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

**Erreur :**
```json
{
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Le client demandé n'existe pas.",
    "details": {}
  }
}
```

### Pagination
```
GET /api/v1/customers?page=1&limit=20&sort=last_visit_at&order=desc
```

---

## 4. Endpoints — Dashboard (privé)

> Tous ces endpoints nécessitent un JWT valide via Supabase Auth.

### Auth
| Méthode | URL | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Inscription (email + mot de passe) |
| `POST` | `/api/v1/auth/login` | Connexion |
| `POST` | `/api/v1/auth/logout` | Déconnexion |
| `POST` | `/api/v1/auth/refresh` | Rafraîchissement du token |
| `POST` | `/api/v1/auth/forgot-password` | Demande de réinitialisation |
| `POST` | `/api/v1/auth/reset-password` | Réinitialisation avec token |

> Note : La plupart de ces endpoints sont gérés directement par Supabase Auth — les Route Handlers sont des wrappers légers.

### Organisation
| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/v1/organization` | Profil de l'organisation |
| `PATCH` | `/api/v1/organization` | Mise à jour du profil |
| `GET` | `/api/v1/organization/team` | Liste des membres |
| `POST` | `/api/v1/organization/team` | Invitation d'un membre |
| `DELETE` | `/api/v1/organization/team/{id}` | Révocation d'un accès |

### Programme de fidélité
| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/v1/program` | Récupération du programme |
| `POST` | `/api/v1/program` | Création du programme |
| `PATCH` | `/api/v1/program` | Mise à jour du programme |
| `POST` | `/api/v1/program/activate` | Activation |
| `POST` | `/api/v1/program/deactivate` | Désactivation |
| `GET` | `/api/v1/program/snippet` | Récupération du snippet widget |

### Règles de gain
| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/v1/program/earning-rules` | Liste des règles |
| `POST` | `/api/v1/program/earning-rules` | Création d'une règle |
| `PATCH` | `/api/v1/program/earning-rules/{id}` | Modification |
| `DELETE` | `/api/v1/program/earning-rules/{id}` | Suppression |

### Récompenses
| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/v1/program/rewards` | Liste des récompenses |
| `POST` | `/api/v1/program/rewards` | Création d'une récompense |
| `PATCH` | `/api/v1/program/rewards/{id}` | Modification |
| `DELETE` | `/api/v1/program/rewards/{id}` | Suppression |

### Clients
| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/v1/customers` | Liste avec pagination, tri, recherche |
| `POST` | `/api/v1/customers` | Ajout manuel d'un client |
| `GET` | `/api/v1/customers/{id}` | Fiche client |
| `PATCH` | `/api/v1/customers/{id}` | Modification |
| `DELETE` | `/api/v1/customers/{id}` | Suppression (soft delete, RGPD) |
| `POST` | `/api/v1/customers/import` | Import CSV |
| `GET` | `/api/v1/customers/export` | Export CSV |
| `POST` | `/api/v1/customers/{id}/points` | Attribution manuelle de points |
| `GET` | `/api/v1/customers/{id}/transactions` | Historique des transactions |
| `GET` | `/api/v1/customers/{id}/churn` | Score de churn et suggestion |

### Reporting
| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/v1/dashboard/metrics` | Métriques principales (overview) |
| `GET` | `/api/v1/dashboard/alerts` | Alertes actives (clients à risque) |

---

## 5. Endpoints — Widget (public)

> Authentification par `X-Public-Key`. Données en lecture seule. Aucune donnée sensible exposée.

| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/v1/widget/program` | Infos publiques du programme (nom, récompenses) |
| `POST` | `/api/v1/widget/identify` | Identification du client par email |
| `GET` | `/api/v1/widget/customer` | Solde et récompenses du client identifié |

---

## 6. Gestion des erreurs

| Code HTTP | Code d'erreur | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Input invalide (détails dans `details`) |
| 401 | `UNAUTHORIZED` | Token manquant ou expiré |
| 403 | `FORBIDDEN` | Accès refusé (mauvais tenant ou rôle insuffisant) |
| 404 | `NOT_FOUND` | Ressource introuvable |
| 409 | `CONFLICT` | Conflit (ex. email déjà utilisé) |
| 422 | `UNPROCESSABLE` | Logique métier invalide |
| 429 | `RATE_LIMITED` | Trop de requêtes |
| 500 | `INTERNAL_ERROR` | Erreur serveur (loggée dans Sentry) |

---

## 7. Rate Limiting

| Endpoint | Limite | Fenêtre |
|---|---|---|
| Endpoints d'auth (`/auth/*`) | 5 req | 15 minutes / IP |
| API Dashboard (globale) | 100 req | 1 minute / token |
| API Widget | 60 req | 1 minute / clé publique |
| Import CSV | 3 req | 1 heure / token |

Implémenté via **Upstash Redis** (sliding window rate limiter).

---

## 8. Versioning

- **Version actuelle :** `v1`
- **Politique :** Les breaking changes créent une nouvelle version (v2). L'ancienne version est maintenue 6 mois après l'annonce de dépréciation.
- **Header de version (optionnel) :** `API-Version: 2026-06-27`
