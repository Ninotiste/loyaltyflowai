# SECURITY.md — Politiques de sécurité

> **Projet :** LoyaltyFlowAI
> **Version :** 0.1.0
> **Statut :** En vigueur — Phase 0
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [MASTER_PLAN.md §19](../../MASTER_PLAN.md#19-sécurité) | [ARCHITECTURE.md](./ARCHITECTURE.md) | [INCIDENTS.md](../operations/INCIDENTS.md)

---

## Sommaire

1. [Principes fondamentaux](#1-principes-fondamentaux)
2. [Authentification et autorisation](#2-authentification-et-autorisation)
3. [Protection des données](#3-protection-des-données)
4. [Sécurité de l'API](#4-sécurité-de-lapi)
5. [Sécurité du widget](#5-sécurité-du-widget)
6. [Développement sécurisé](#6-développement-sécurisé)
7. [Multi-tenancy](#7-multi-tenancy)
8. [Conformité RGPD](#8-conformité-rgpd)
9. [Gestion des incidents de sécurité](#9-gestion-des-incidents-de-sécurité)
10. [Divulgation responsable](#10-divulgation-responsable)

---

## 1. Principes fondamentaux

Hérités du [MASTER_PLAN.md §19](../../MASTER_PLAN.md#19-sécurité) :

1. **Moindre privilège** : chaque composant n'accède qu'à ce dont il a besoin.
2. **Defense in depth** : plusieurs couches de sécurité, jamais une seule barrière.
3. **Fail securely** : en cas d'erreur, le système échoue vers un état sécurisé.
4. **Zero trust** : aucune confiance implicite, même entre services internes.
5. **Security by design** : la sécurité est intégrée dès la conception, jamais ajoutée après.

---

## 2. Authentification et autorisation

### Authentification
- Gérée par **Supabase Auth** (JWT RS256)
- Access token : durée de vie **15 minutes**
- Refresh token : durée de vie **7 jours**, rotation à chaque usage
- Mots de passe : hashés par Supabase (**bcrypt**, coût ≥ 12)
- MFA : optionnel en Phase 1, obligatoire pour les admins en Phase 2

### Rôles (RBAC)
| Rôle | Permissions |
|---|---|
| `ADMIN` | Toutes les opérations, gestion de l'équipe, facturation |
| `MEMBER` | Lecture + attribution de points, pas de gestion du programme |

### Sessions
- La déconnexion invalide le refresh token en base
- Les sessions inactives depuis > 7 jours nécessitent une reconnexion
- Pas de session persistante sur les appareils partagés (option "Se souvenir de moi" à désactiver)

---

## 3. Protection des données

### En transit
- TLS 1.3 minimum sur toutes les communications
- HSTS activé (Strict-Transport-Security)
- Certificats gérés par Vercel et Supabase

### Au repos
- Données chiffrées au repos par Supabase (AES-256, géré par l'infrastructure AWS sous-jacente)
- Les backups automatiques de Supabase sont chiffrés

### Données sensibles
| Donnée | Traitement |
|---|---|
| Mot de passe | Jamais stocké — hashé par Supabase Auth |
| Email client | PII — soumis au RGPD, soft delete |
| Numéro de téléphone | PII — optionnel, stocké chiffré |
| Tokens JWT | Stockés en mémoire côté client (pas localStorage) |
| Clé publique widget | Exposée publiquement — ne donne que la lecture widget |
| Variables d'environnement | Jamais dans Git — dans Vercel/Supabase secrets |

---

## 4. Sécurité de l'API

### Headers de sécurité (Next.js)
```
Content-Security-Policy: default-src 'self'; script-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Validation des inputs
- Tous les inputs sont validés avec **Zod** avant traitement
- Les paramètres de route (UUIDs) sont vérifiés côté serveur
- Aucune requête SQL construite par concaténation — Prisma uniquement

### Protection contre les attaques courantes
| Attaque | Mitigation |
|---|---|
| Injection SQL | Prisma (requêtes paramétrées uniquement) |
| XSS | Next.js escaping automatique + CSP |
| CSRF | Tokens Supabase Auth (SameSite cookies) |
| Enumération d'IDs | UUIDs v4 comme clés primaires |
| Force brute auth | Rate limiting (5 tentatives / 15 min / IP) |
| Mass assignment | Zod schema — whitelist des champs acceptés |

---

## 5. Sécurité du widget

Le widget est la surface exposée publiquement. Règles spécifiques :

- **Clé publique uniquement** : la `public_key` ne donne accès qu'en lecture aux données non-sensibles du widget
- **Isolation DOM** : le widget utilise Shadow DOM pour éviter les conflits et injections CSS
- **CSP du site hôte** : documenter que le site hôte doit autoriser `*.loyaltyflowai.com` dans sa CSP
- **Aucun cookie** : le widget n'utilise pas de cookies — `sessionStorage` uniquement
- **Pas de données sensibles** : l'API widget ne retourne jamais d'email complet (masqué : `jo***@gmail.com`)

---

## 6. Développement sécurisé

### Règles absolues
- **Zéro secret dans Git** : pre-commit hook (git-secrets ou Husky) qui bloque les commits contenant des patterns de secrets
- **npm audit** : exécuté dans la CI à chaque PR — les vulnérabilités critiques bloquent le merge
- **Dépendances** : mises à jour régulières (Dependabot ou Renovate configuré)
- **SAST** : analyse statique intégrée dans la CI (à définir en Phase 0)

### Variables d'environnement
Voir [ENVIRONMENTS.md](./ENVIRONMENTS.md) pour la liste complète et les conventions.

---

## 7. Multi-tenancy

L'isolation entre tenants est garantie à **deux niveaux** :

**Niveau applicatif :**
- Le `tenant_id` (organization_id) est toujours extrait du JWT — jamais fourni par le client
- Toutes les requêtes Prisma filtrent explicitement par `organization_id`

**Niveau base de données (Supabase RLS) :**
- Row-Level Security activée sur toutes les tables de données métier
- Politique RLS : `organization_id = auth.jwt() -> 'organization_id'`

**Test de régression :**
- Un test automatisé vérifie qu'un tenant A ne peut pas accéder aux données du tenant B

---

## 8. Conformité RGPD

| Obligation | Implémentation |
|---|---|
| Consentement | Collecte explicite lors de l'inscription du client final |
| Droit d'accès | Export CSV des données d'un client sur demande |
| Droit à l'effacement | Soft delete + anonymisation des données PII |
| Portabilité | Export JSON des données sur demande |
| Notification de violation | < 72h aux autorités (CNIL), < 72h aux clients affectés |
| DPO | À désigner avant le premier client public |
| Registre des traitements | À créer avant le lancement (Phase 1) |

---

## 9. Gestion des incidents de sécurité

| Sévérité | Description | Temps de réponse |
|---|---|---|
| Critique (S1) | Fuite de données, accès non autorisé à des données multi-tenant | < 1 heure |
| Élevée (S2) | Vulnérabilité exploitée en production, indisponibilité de service | < 4 heures |
| Moyenne (S3) | Vulnérabilité détectée non encore exploitée | < 24 heures |
| Faible (S4) | Problème de sécurité mineur, aucun impact immédiat | < 7 jours |

→ [Procédures d'incidents](../operations/INCIDENTS.md)

---

## 10. Divulgation responsable

Si vous découvrez une vulnérabilité de sécurité dans LoyaltyFlowAI :

1. **Ne divulguez pas publiquement** avant résolution
2. **Contactez-nous** à `security@loyaltyflowai.com` *(adresse à créer avant le lancement public)*
3. **Délai de réponse :** < 72 heures
4. **Délai de résolution :** 30 jours pour les vulnérabilités critiques

*Une page de divulgation responsable sera publiée sur le site avant le lancement public.*
