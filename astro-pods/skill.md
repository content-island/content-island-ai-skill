---
name: content-island-astro-pods-architecture
description: Use this skill to define a clear architecture for Astro projects using a PODS (feature/islands) approach, ensuring consistent organization of UI, API models, business logic, and mapping within isolated pods.
---

You are working in an **Astro** codebase that follows a **PODS (feature/islands) architecture**.  
Your goal is to implement features by placing **UI, API models, API clients, business logic, view-models, and mapping logic inside PODS**, while keeping Astro **pages** thin and mostly server-only orchestration.

## 1) Project Structure

### Astro conventions

- **Astro layouts** live in: `src/layouts/astro/`
- **Astro pages** live in: `src/pages/astro/`

Pages should contain minimal logic:

- Server-side API calls only
- Optional slug handling
- `getStaticPaths` (or similar server-only routing helpers) if needed

Everything else (components, API implementation, business logic, models, mapping) belongs in PODS.

### PODS root

- All PODS live in: `src/pods/`

There is **no required 1:1 mapping** between pages and PODS:

- One POD can serve multiple pages.
- One page can compose multiple PODS.
- A layout can also be composed of PODS.

Examples:

- A `search-area` pod
- A `items-list` pod
- A `contact-form` pod
- A page can combine `search-area` + `items-list` + `contact-form`
- A layout can include pods like `header` + `footer` + `nav`

## 2) POD Naming and File Conventions

Each pod must follow this structure:

- `src/pods/{pod-name}/{pod-name}.pod.astro`  
  Main pod component (public entry point)

- `src/pods/{pod-name}/components/{component-name}.astro`  
  Secondary components used internally by the pod

- `src/pods/{pod-name}/api/{api-model-name}.api-model.ts`  
  API models (DTOs / API shapes) for that pod, IMPORTANT: do not try to have the api model in a common folder, just repeat the entries per pod, reason why, in some scenarios we can use: includeRelatedContent and the entity will be different, only place in common enums like.

- `src/pods/{pod-name}/api/{api-name}.api.ts`  
  API clients/functions for that pod (fetchers, request wrappers, etc.)

- `src/pods/{pod-name}/{pod-name}.model.ts`  
  Pod view-models / UI-facing models

- `src/pods/{pod-name}/{pod-name}.mapper.ts`  
  Mapping between API models and view-models (pure conversions)

- `src/pods/{pod-name}/{pod-name}.business.ts`  
  Business logic and helper functions specific to the pod

> Notes:
>
> - Mapping files must be `.ts` and contain only pure transformation logic.
> - Business logic must live in `{pod-name}.business.ts`, not in components or pages.

## 3) Architectural Rules (Hard Constraints)

### Isolation

- A pod is an **isolated island**.
- A pod **must not share logic or resources** with sibling pods.
- The only supported way to share logic/resources is via `src/common/`.

### Imports

- A pod **cannot import anything** from another pod.
- **Exception (rare):** a “container pod” may import **only** the main components of child pods:
  - Allowed: `import ChildPod from "../child/child.pod.astro"`
  - Not allowed: importing child pod internal components, API files, models, mappers, or business logic.

### Pages usage

- A page may import one or more pods (usually the main `.pod.astro` component).
- A page may call a pod API function plus mapper only when needed for server-side routing helpers like `getStaticPaths`.

### Component size

- No component should exceed **100 lines of markup**.
- If it grows beyond that, split into smaller components:
  - Single Responsibility Principle
  - Same level of abstraction in each component

### Testing

Mappers and business logic should be designed for easy unit testing (pure functions, no side effects), and should have unit tests implemented.

### Language consistency

- **Comments and variable names must always be in English**.

### Best practices

- Follow Astro + TypeScript best practices:
  - Use types and interfaces
  - Prefer pure functions
  - Keep business rules deterministic
  - Keep I/O (fetch, cookies, env) at the edges (API layer / page server code)

## 4) Responsibilities by Layer

### Pages (`src/pages/astro/`)

Do:

- Compose pods
- Perform server-only orchestration
- Handle slugs / params
- Use `getStaticPaths` if needed

Avoid:

- UI implementation details
- Business logic
- Mapping logic
- API model definitions

### Layouts (`src/layouts/astro/`)

Do:

- Provide global composition
- Optionally compose pods (header/footer/nav pods)
- Keep logic minimal

### Pods (`src/pods/`)

Do:

- Contain all feature-specific UI + behavior
- Define API DTOs in `api/*.api.ts`
- Define API clients in `api/*.api.ts`
- Define business rules in `{pod}.business.ts`
- Define view models in `{pod}.model.ts`
- Map DTOs -> view models in `{pod}.mapper.ts`
- Use secondary components under `components/`

Avoid:

- Depending on other pods
- Putting shared logic in the pod (move shared logic to `src/common/`)

### Business Logic (`{pod-name}.business.ts`)

Do:

- Encapsulate domain rules and calculations
- Provide reusable helper functions for the pod
- Be framework-agnostic (no Astro-specific APIs)
- Use pure functions whenever possible

Avoid:

- Direct API calls (belongs to `api/`)
- UI concerns
- Cross-pod logic

### Common (`src/common/`)

Do:

- Shared UI primitives
- Shared utilities (formatting, validation, functional helpers)
- Shared fetch wrappers (if truly cross-pod)
- Shared types (only if not pod-specific)

Avoid:

- Feature-specific business rules

## 5) Implementation Checklist (When Adding a Feature)

1. Identify whether this is a new pod or an extension of an existing pod.
2. Create/update:
   - API DTOs: `src/pods/{pod}/api/*.api.ts`
   - API clients: `src/pods/{pod}/api/*.api.ts`
   - Business logic: `src/pods/{pod}/{pod}.business.ts`
   - View models: `src/pods/{pod}/{pod}.model.ts`
   - Mappers: `src/pods/{pod}/{pod}.mapper.ts`
   - UI:
     - main entry: `src/pods/{pod}/{pod}.pod.astro`
     - subcomponents: `src/pods/{pod}/components/*.astro`
3. Ensure the page is thin and only composes pods / performs server-only tasks.
4. Ensure there are **no cross-pod imports**.
5. If something must be shared, move it to `src/common/`.
6. Enforce < 100 lines of markup per component by splitting.

## 6) Patterns and Examples

### Example: Page composing multiple pods

- `src/pages/astro/products/[slug].astro`
  - imports:
    - `src/pods/search-area/search-area.pod.astro`
    - `src/pods/items-list/items-list.pod.astro`
    - `src/pods/contact-form/contact-form.pod.astro`

### Example: getStaticPaths calling a pod API (allowed)

- The page may import and call:
  - `src/pods/items-list/api/items.api.ts`
    for `getStaticPaths` only.

## 7) Code Quality Rules

- Keep business logic isolated:
  - `calculatePriceWithDiscount(...)`
  - `filterVisibleItems(...)`
- Keep mapping functions pure:
  - `mapApiToVm(dto): ViewModel`
- Keep API layer functions focused on I/O:
  - `fetchItems(params): Promise<ItemsDto>`
- Keep pod component UI declarative:
  - minimal imperative logic
- Prefer composition over large monolithic components

---

## Summary

- Pages/layouts: composition and server-only orchestration.
- Pods: feature islands containing UI + API DTOs + API clients + business logic + view models + mapping.
- No cross-pod imports (except rare container pod main-component-only).
- Shared logic goes to `src/common/`.
- English-only comments/variables.
- Keep components small (< 100 lines of markup).
