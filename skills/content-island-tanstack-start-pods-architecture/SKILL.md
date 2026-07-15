---
name: content-island-tanstack-start-pods-architecture
description: Use this skill to define a clear architecture for TanStack Start projects using a PODS (feature/islands) approach, ensuring consistent organization of UI, API models, business logic, and mapping within isolated pods.
---

You are working in a **TanStack Start** codebase that follows a **PODS (feature/islands) architecture**.  
Your goal is to implement features by placing **UI, API models, API clients, business logic, view-models, and mapping logic inside PODS**, while keeping **routes thin** and mostly focused on **server/client orchestration**.

---

## 1) Project Structure

### TanStack Start conventions

- **Routes** live in: `src/routes/`
- **Root route (app shell / global layout)**: `src/routes/__root.tsx`
- **Router setup / configuration**: `src/router.tsx`
- **Generated route tree (do not edit)**: `src/routeTree.gen.ts`
- **Server functions / loaders / actions**: colocated in routes or extracted per pod

Routes should contain minimal logic:

- Server-side data fetching (via loaders or server functions)
- Params handling (`params`, `search`)
- Composition of pods

Everything else (components, API implementation, business logic, models, mapping) belongs in PODS.

---

### PODS root

- All PODS live in: `src/pods/`

There is **no required 1:1 mapping** between routes and PODS:

- One POD can serve multiple routes
- One route can compose multiple PODS
- Layouts (root or nested) can also compose PODS

---

## 2) POD Naming and File Conventions

Each pod must follow this structure:

- `src/pods/{pod-name}/{pod-name}.pod.tsx`
- `src/pods/{pod-name}/components/{component-name}.tsx`
- `src/pods/{pod-name}/api/{api-model-name}.api-model.ts`
- `src/pods/{pod-name}/api/{api-name}.api.ts`
- `src/pods/{pod-name}/{pod-name}.model.ts`
- `src/pods/{pod-name}/{pod-name}.mapper.ts`
- `src/pods/{pod-name}/{pod-name}.repository.ts`
- `src/pods/{pod-name}/{pod-name}.business.ts`

> **About the repository**
>
> - The `repository` is **optional**: create it only in pods that load or persist data (pods that have an `api`). Pure UI pods don't need it.
> - It is the **only** place that imports `api` and `mapper`.
> - It always returns the pod `model` (domain / ViewModel). Its consumers (loaders, `pod.tsx`, components) never see the api models or the mappers.

---

## 3) Architectural Rules

- Pods are isolated
- Avoid cross-pod imports as a default rule — pods should not import from each other
- **Exception**: if there is a strong justification for a cross-pod import, do **not** do it silently. Stop and ask the user first, explaining the reason; only proceed if the user agrees. Otherwise, prefer extracting the shared piece into `src/common/`
- Shared logic only in `src/common/`
- Routes must stay thin
- **Data access goes through the repository (single access point)**: only `{pod-name}.repository.ts` may import/use `api` and `mapper`. Route loaders, `pod.tsx` and components must obtain data **always** through the repository, which returns the `model` (domain / ViewModel)

---

## 4) Responsibilities

### Routes

- Compose pods
- Handle params
- Load data (loaders call the pod `repository`, never `api`/`mapper` directly)

### Pods

- UI + logic + API + mapping

### Business

- Pure logic only

### API

- Fetch + I/O only

### Mapper

- Pure transformations

### Repository

- Orchestrates `api` + `mapper`
- **Single data-access point** of the pod: the only place allowed to touch `api` and `mapper`
- Always returns the pod `model` (domain / ViewModel); hides api models and mappers from its consumers

---

## 5) Checklist

- Create pod
- Add API + mapper + model + business
- Add repository (only if the pod loads/persists data): wraps `api` + `mapper` and returns the `model`
- Build UI (consumes the repository, never `api`/`mapper` directly)
- Keep route clean (loaders call the repository)
- No cross-pod imports — if you think you need one, stop and ask the user first

---

## Summary

- Routes = orchestration
- Pods = features (isolated, no cross-pod imports by default — ask the user if a strong exception arises)
- Repository = data access (api + mapper → model), single access point
- Common = shared
