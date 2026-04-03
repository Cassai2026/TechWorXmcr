# Sovereign Edition — Google Cloud Technical Documentation
<!--
  TechWorX Manchester — Sovereign Edition
  Copyright (C) 2026 TechWorX Manchester
  SPDX-License-Identifier: GPL-3.0-or-later
-->

> **Status:** Draft v1.0 · April 2026

---

## Overview

This document describes the **Sovereign Edition** deployment of TechWorX
Manchester's AI-powered platform on Google Cloud. It covers architecture,
service configuration, deployment steps, and the operating principles that
ensure every workload serves the **15 Billion Hearts** mandate under
**GNU GPLv3**.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Google Cloud Services](#google-cloud-services)
3. [Sovereign Gemini — Vertex AI](#sovereign-gemini--vertex-ai)
4. [GitHub Actions CI/CD Pipeline](#github-actions-cicd-pipeline)
5. [Security & Compliance](#security--compliance)
6. [Neuro-Inclusive Design Notes](#neuro-inclusive-design-notes)
7. [Deployment Steps](#deployment-steps)
8. [Environment Variables & Secrets](#environment-variables--secrets)
9. [Licence](#licence)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Enterprise                             │
│   Repo: Cassai2026/TechWorXmcr  (GNU GPLv3)                     │
│   ┌──────────────┐   push/PR    ┌──────────────────────────┐    │
│   │  Source Code │ ──────────►  │  GitHub Actions Workflows │    │
│   └──────────────┘              │  • impact-tracker.yml     │    │
│                                 │  • deploy.yml (future)    │    │
│                                 └────────────┬─────────────┘    │
└─────────────────────────────────────────────┼───────────────────┘
                                               │ deploy
                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Google Cloud Platform                       │
│   Region: europe-west2 (London)                                  │
│                                                                  │
│   ┌──────────────────┐   ┌────────────────────────────────────┐  │
│   │  Firebase Hosting │   │  Cloud Run (API / SSR, future)    │  │
│   │  index.html       │   │  Node.js 20 container             │  │
│   │  styles.css       │   └──────────────┬───────────────────┘  │
│   │  app.js           │                  │                       │
│   └──────────────────┘          Vertex AI SDK                   │
│                                          │                       │
│                         ┌────────────────▼──────────────────┐   │
│                         │   Vertex AI — Sovereign Gemini     │   │
│                         │   Model: gemini-pro                │   │
│                         │   Region: europe-west2             │   │
│                         │   System instruction: 1:10:1 ethos │   │
│                         └───────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Guiding Principles

| Principle | Implementation |
|-----------|---------------|
| Open source | GNU GPLv3 on every file; no proprietary dependencies |
| Data sovereignty | All processing in `europe-west2`; no data leaves the EU |
| Neuro-inclusivity | UI built for non-linear cognitive styles |
| 1:10:1 impact | Every paid workload funds 10 local + 1 global node |

---

## Google Cloud Services

| Service | Purpose | Tier |
|---------|---------|------|
| **Firebase Hosting** | Serve static site (`index.html`, `styles.css`, `app.js`) | Spark (free) |
| **Vertex AI** | Sovereign Gemini inference (`gemini-pro`) | Pay-per-use |
| **Cloud Run** *(future)* | API layer for Vertex AI proxy & Impact Tracker REST endpoints | Pay-per-use |
| **Secret Manager** | Store Vertex AI API keys and service-account credentials | Pay-per-use |
| **Cloud IAM** | Least-privilege service accounts for GitHub Actions OIDC auth | Included |

### GCP Project Configuration

```bash
# Create dedicated project
gcloud projects create techworx-sovereign \
  --name="TechWorX Sovereign Edition"

# Set default project and region
gcloud config set project techworx-sovereign
gcloud config set run/region europe-west2

# Enable required APIs
gcloud services enable \
  aiplatform.googleapis.com \
  run.googleapis.com \
  firebasehosting.googleapis.com \
  secretmanager.googleapis.com
```

---

## Sovereign Gemini — Vertex AI

### Model Selection

| Parameter | Value |
|-----------|-------|
| Model ID | `gemini-pro` |
| API | `aiplatform.googleapis.com` |
| Region | `europe-west2` |
| Project | `techworx-sovereign` |

### System Instruction

Every request to Sovereign Gemini includes the following system instruction,
embedding the TechWorX mission and the 1:10:1 mandate:

```text
You are Sovereign Gemini, the AI assistant for TechWorX Manchester.

Your purpose: bridge the digital divide for neurodivergent learners and
global communities.

Constraints:
- Every response must be plain English, short sentences, active voice.
- Optimise for non-linear, high-intensity, and pattern-matching cognitive styles.
- Never recommend proprietary-only solutions — prefer open-source (GNU GPLv3).
- Always relate technical advice to the 1:10:1 impact model:
  1 client → 10 local kids supported → 1 global node activated.
- Serve the 15 Billion Hearts goal in every answer.
```

### JavaScript SDK Example (Node.js)

```javascript
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 TechWorX Manchester

const { VertexAI } = require('@google-cloud/vertexai');

const vertex = new VertexAI({
  project: 'techworx-sovereign',
  location: 'europe-west2',
});

const model = vertex.getGenerativeModel({
  model: 'gemini-pro',
  systemInstruction: {
    role: 'system',
    parts: [{
      text: `You are Sovereign Gemini, the AI assistant for TechWorX Manchester.
Your purpose: bridge the digital divide for neurodivergent learners and
global communities. Every response must be plain English, short sentences,
active voice. Serve the 15 Billion Hearts goal in every answer.`,
    }],
  },
});

async function ask(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.candidates[0].content.parts[0].text;
}

module.exports = { ask };
```

---

## GitHub Actions CI/CD Pipeline

### Workflows

| File | Trigger | Purpose |
|------|---------|---------|
| `.github/workflows/impact-tracker.yml` | Daily (06:00 UTC) / manual | Apply 1:10:1 multiplier; update `impact-data.json` |
| `.github/workflows/deploy.yml` *(planned)* | Push to `main` | Deploy static assets to Firebase Hosting |

### Workload Identity Federation (recommended)

Use GitHub OIDC tokens instead of long-lived service-account keys:

```yaml
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: >-
      projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider
    service_account: github-actions@techworx-sovereign.iam.gserviceaccount.com
```

**Required IAM roles for the service account:**

| Role | Reason |
|------|--------|
| `roles/firebase.admin` | Deploy to Firebase Hosting |
| `roles/aiplatform.user` | Call Vertex AI inference |
| `roles/secretmanager.secretAccessor` | Read API keys at runtime |

---

## Security & Compliance

### GPLv3 Compliance

- Every source file carries `SPDX-License-Identifier: GPL-3.0-or-later`.
- The full licence text is in `/LICENSE`.
- No dependencies may be added that are incompatible with GPL-3.0.

### Data Protection

- All GCP resources reside in `europe-west2` (UK/EU) to comply with
  UK GDPR / GDPR.
- No user PII is collected by the static site.
- Vertex AI requests must not include PII in prompts.

### Secrets Management

```bash
# Store Vertex AI service account key in Secret Manager
gcloud secrets create vertex-ai-sa-key \
  --replication-policy="user-managed" \
  --locations="europe-west2"

gcloud secrets versions add vertex-ai-sa-key \
  --data-file="service-account.json"
```

Store the secret name in GitHub Actions secrets:
`GCP_VERTEX_SA_KEY_SECRET` → `projects/techworx-sovereign/secrets/vertex-ai-sa-key/versions/latest`

---

## Neuro-Inclusive Design Notes

| Pattern | Implementation |
|---------|---------------|
| Reduced motion | `@media (prefers-reduced-motion: reduce)` in `styles.css` |
| High contrast | Charcoal background + cream text (≥ 7:1 contrast ratio) |
| Focus indicators | 3 px solid orange outline on all interactive elements |
| Plain language | Flesch-Kincaid reading level ≤ 8 for all UI copy |
| No distractions | No auto-play media, no cookie banners, no pop-ups |
| ARIA labels | All buttons and icon-only links have descriptive `aria-label` |
| Skip link | Keyboard users can bypass navigation with `.skip-link` |

---

## Deployment Steps

### 1. One-time GCP Setup

```bash
# See "GCP Project Configuration" above
gcloud projects create techworx-sovereign ...
```

### 2. Firebase Hosting Init

```bash
npm install -g firebase-tools
firebase login
firebase init hosting --project techworx-sovereign
# Public directory: . (root)
# Single-page app: No
# Auto-deploy via GitHub: Yes (generates deploy.yml)
```

### 3. First Deployment

```bash
firebase deploy --only hosting --project techworx-sovereign
```

### 4. Ongoing Deployments

Push to `main` → GitHub Actions `deploy.yml` → Firebase Hosting auto-deploy.

---

## Environment Variables & Secrets

| Name | Where | Purpose |
|------|-------|---------|
| `GCP_PROJECT_ID` | GitHub Actions variable | GCP project (`techworx-sovereign`) |
| `GCP_REGION` | GitHub Actions variable | Vertex AI region (`europe-west2`) |
| `GCP_WIF_PROVIDER` | GitHub Actions secret | Workload Identity Federation provider URI |
| `GCP_SA_EMAIL` | GitHub Actions secret | Service account email for GCP auth |

---

## Licence

```
TechWorX Manchester — Sovereign Edition documentation
Copyright (C) 2026 TechWorX Manchester

Permission is granted to copy, distribute and/or modify this document
under the terms of the GNU General Public License as published by the
Free Software Foundation; either version 3, or (at your option) any
later version.
```
