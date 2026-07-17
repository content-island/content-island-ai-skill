---
"@content-island/ai-skills": minor
---

Enhance the TanStack Start pods architecture skill: introduce the optional pod `repository` as the single data-access point (it wraps `api` + `mapper` and returns the domain `model`, so loaders, server functions and pod code never touch API models directly). Clarify the route file layout (`__root.tsx`, `router.tsx`, `routeTree.gen.ts`) and soften the cross-pod import rule to "avoid by default, ask before making an exception".
