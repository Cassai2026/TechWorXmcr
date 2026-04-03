# TechWorX Manchester — Sovereign Edition

> Bridging the digital divide for neurodivergent learners and global communities.
> Licensed under **GNU GPLv3**.

---

## The 1:10:1 Impact Model

Every paying client engagement directly funds community impact:

```
1 Client  →  10 local kids supported  →  1 international node activated
```

Scaling towards the **15 Billion Hearts** goal.

---

## Repository Structure

```
.
├── index.html                          # Main site (industrial Manchester aesthetic)
├── styles.css                          # CSS — "Joe Bargain" design system
├── app.js                              # Lightweight vanilla JS
├── impact-data.json                    # Live 1:10:1 tracker data
├── docs/
│   └── sovereign-edition-gcp.md       # Google Cloud technical documentation
├── .github/
│   ├── copilot-instructions.md        # Sovereign Systems Architect prompt
│   └── workflows/
│       └── impact-tracker.yml         # Automated 1:10:1 Impact Tracker (daily)
└── LICENSE                             # GNU General Public License v3
```

---

## Quick Start

Open `index.html` in a browser, or serve it locally:

```bash
npx serve .
# → http://localhost:3000
```

For the full Sovereign Edition deployment (Vertex AI + Firebase Hosting),
see [`docs/sovereign-edition-gcp.md`](docs/sovereign-edition-gcp.md).

---

## Sovereign Gemini

AI layer powered by **Vertex AI** (`gemini-pro`, `europe-west2`).
System-instructed with the 1:10:1 ethos and neuro-inclusive design principles.

---

## Impact Tracker

The [`impact-tracker.yml`](.github/workflows/impact-tracker.yml) GitHub Actions
workflow runs daily at 06:00 UTC. It applies the 1:10:1 multiplier to new client
entries and commits the updated `impact-data.json` back to the repository.

Run manually via **Actions → Impact Tracker → Run workflow**.

---

## GitHub Copilot Custom Instructions

[`.github/copilot-instructions.md`](.github/copilot-instructions.md) contains
the **Sovereign Systems Architect** prompt. It instructs Copilot to generate
GPLv3-compatible code, follow the Joe Bargain design ethos, and align every
solution with the 15 Billion Hearts mandate.

---

## Licence

Copyright &copy; 2026 TechWorX Manchester.
Released under the [GNU General Public License v3](LICENSE).
