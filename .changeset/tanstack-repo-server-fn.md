---
"@content-island/ai-skills": minor
---

Enhance the TanStack Start pods architecture skill: the pod repository is now the server function layer (`createServerFn` defined in `{pod-name}.repository.ts`, with middleware, `.validator()` and mapping on the server), and API files must use the `.api.server.ts` suffix so TanStack Start import protection fails the build if API code leaks into the client.
