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
- `src/pods/{pod-name}/{pod-name}.business.ts`

---

## 3) Architectural Rules

- Pods are isolated
- No cross-pod imports
- Shared logic only in `src/common/`
- Routes must stay thin

---

## 4) Responsibilities

### Routes

- Compose pods
- Handle params
- Load data

### Pods

- UI + logic + API + mapping

### Business

- Pure logic only

### API

- Fetch + I/O only

### Mapper

- Pure transformations

---

## 5) Checklist

- Create pod
- Add API + business + mapper + model
- Build UI
- Keep route clean

---

## Summary

- Routes = orchestration
- Pods = features
- Common = shared
