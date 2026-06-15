# @content-island/ai-skills

## 0.1.0

### Minor Changes

- d35020d: Rewrite the CLI in TypeScript (built with tsdown, Node 24 target) with a modular `src/` layout: helpers live under `src/core/helpers/` with a `*.helper.ts` naming convention. Add an interactive `@clack/prompts` selector (all skills pre-selected) as the default command, move skills under `skills/`, and add Changesets + a Verdaccio local registry for local publishing. Also add a Vitest test setup (config under `config/test/`) with thorough per-helper tests, and wire up the Changesets release GitHub Action.
