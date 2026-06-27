# INCIDENTS.md — Gestion des incidents et post-mortems

> **Projet :** LoyaltyFlowAI
> **Version :** 0.1.0
> **Statut :** Actif
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [RUNBOOK.md](./RUNBOOK.md) | [SECURITY.md](../technical/SECURITY.md) | [METRICS.md](../business/METRICS.md)

---

## Sommaire

1. [Niveaux de sévérité](#1-niveaux-de-sévérité)
2. [Procédure de réponse aux incidents](#2-procédure-de-réponse-aux-incidents)
3. [Communication pendant un incident](#3-communication-pendant-un-incident)
4. [Template de post-mortem](#4-template-de-post-mortem)
5. [Registre des incidents](#5-registre-des-incidents)

---

## 1. Niveaux de sévérité

| Niveau | Description | Exemples | Temps de réponse | Temps de résolution |
|---|---|---|---|---|
| **S1 — Critique** | Service totalement indisponible ou fuite de données | Plateforme down, accès non autorisé aux données multi-tenant | < 1 heure | < 4 heures |
| **S2 — Élevée** | Fonctionnalité critique dégradée | Widget non fonctionnel, scores de churn non calculés, impossible de se connecter | < 2 heures | < 8 heures |
| **S3 — Moyenne** | Fonctionnalité dégradée, workaround possible | Lenteurs API, export CSV en erreur, alertes de dashboard manquantes | < 24 heures | < 48 heures |
| **S4 — Faible** | Problème mineur, pas d'impact sur les opérations | Texte incorrect, UI légèrement cassée sur un navigateur spécifique | < 7 jours | < 30 jours |

---

## 2. Procédure de réponse aux incidents

### Phase 1 — Détection (0-15 min)
- [ ] Confirmer l'incident (reproduire ou valider via monitoring)
- [ ] Ouvrir un incident dans le registre (§5)
- [ ] Évaluer la sévérité
- [ ] Commencer la communication si S1 ou S2 (§3)

### Phase 2 — Diagnostic (15-60 min)
- [ ] Identifier le composant en cause (Vercel, Supabase, Upstash, code)
- [ ] Consulter les logs (Sentry, Vercel Logs, Supabase Logs)
- [ ] Identifier la cause probable

### Phase 3 — Résolution
- [ ] Appliquer le correctif (hotfix ou rollback selon le cas)
- [ ] Valider la résolution
- [ ] Surveiller 30 minutes post-résolution

### Phase 4 — Post-incident
- [ ] Clore l'incident dans le registre
- [ ] Informer les clients affectés de la résolution
- [ ] Rédiger un post-mortem dans les 48h (pour S1 et S2)

---

## 3. Communication pendant un incident

### Clients (via email + status page)
**Template ouverture d'incident (S1/S2) :**
```
Sujet : [LoyaltyFlowAI] Incident en cours — [Description courte]

Nous avons identifié un problème affectant [fonctionnalité].
Nos équipes travaillent activement à la résolution.

Statut : En cours d'investigation
Prochaine mise à jour : dans 1 heure

Nous vous informerons dès que la situation sera résolue.
L'équipe LoyaltyFlowAI
```

**Template résolution d'incident :**
```
Sujet : [LoyaltyFlowAI] Incident résolu — [Description courte]

L'incident affectant [fonctionnalité] est résolu depuis [heure].
Durée totale : [X heures].

Cause : [Description non-technique de la cause]
Action corrective : [Ce que nous avons fait]

Nous nous excusons pour la gêne occasionnée.
L'équipe LoyaltyFlowAI
```

---

## 4. Template de post-mortem

> Rédiger dans les 48h suivant la clôture d'un incident S1 ou S2.

---

### Post-Mortem — INC-XXX — [Titre de l'incident]

**Date :** YYYY-MM-DD
**Sévérité :** S1 / S2
**Durée :** De HH:MM à HH:MM (X heures)
**Auteur :** [Nom]

#### Résumé
*2-3 phrases décrivant ce qui s'est passé.*

#### Impact
- **Clients affectés :** X clients
- **Fonctionnalités affectées :** [Liste]
- **Transactions perdues / dégradées :** [Nombre]

#### Timeline
| Heure | Événement |
|---|---|
| HH:MM | Incident détecté via [monitoring / rapport client] |
| HH:MM | Début d'investigation |
| HH:MM | Cause identifiée |
| HH:MM | Correctif déployé |
| HH:MM | Incident confirmé résolu |

#### Cause racine
*Description technique précise de la cause.*

#### Ce qui a bien fonctionné
*Points positifs dans la réponse à l'incident.*

#### Ce qui n'a pas fonctionné
*Points à améliorer.*

#### Actions correctives
| Action | Responsable | Deadline | Statut |
|---|---|---|---|
| [Action 1] | [Nom] | YYYY-MM-DD | À faire |

---

## 5. Registre des incidents

| ID | Date | Sévérité | Titre | Durée | Statut | Post-mortem |
|---|---|---|---|---|---|---|
| *Aucun incident enregistré à ce jour.* | | | | | | |

---

*Le registre sera alimenté dès le premier incident en Phase 1.*
