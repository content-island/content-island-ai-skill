# @content-island/ai-skills

## 0.2.0

### Minor Changes

- 97e1b6e: Enhance the TanStack Start pods architecture skill: introduce the optional pod `repository` as the single data-access point (it wraps `api` + `mapper` and returns the domain `model`, so loaders, server functions and pod code never touch API models directly). Clarify the route file layout (`__root.tsx`, `router.tsx`, `routeTree.gen.ts`) and soften the cross-pod import rule to "avoid by default, ask before making an exception".

## 0.1.0

### Minor Changes

- d35020d: Rewrite the CLI in TypeScript (built with tsdown, Node 24 target) with a modular `src/` layout: helpers live under `src/core/helpers/` with a `*.helper.ts` naming convention. Add an interactive `@clack/prompts` selector (all skills pre-selected) as the default command, move skills under `skills/`, and add Changesets + a Verdaccio local registry for local publishing. Also add a Vitest test setup (config under `config/test/`) with thorough per-helper tests, and wire up the Changesets release GitHub Action.
