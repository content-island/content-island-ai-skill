---
"@content-island/ai-skills": patch
---

Rewrite the CLI in TypeScript (built with Vite) with a modular `src/` layout, add an interactive `@clack/prompts` selector (all skills pre-selected) as the default command, move skills under `skills/`, and add Changesets + a Verdaccio local registry for local publishing. Also add a Vitest test setup (config under `config/test/`) with tests for skill discovery, wire up the Changesets release GitHub Action.
