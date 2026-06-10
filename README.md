# Content Island AI Skills

A collection of reusable AI skills for Claude Code, GitHub Copilot, and other LLM-based coding tools to work with Content Island projects.

---

## What is this?

This repository contains **portable AI skill definitions** that encode Content Island principles and best practices as AI-readable behavior contracts.

Instead of relying on ad-hoc prompts, these skills provide a **consistent, reusable way** to guide LLMs when working on content-driven projects.

Think of them as:

- shared context for AI assistants
- behavioral specs
- lightweight "system prompts" you can reuse across tools

---

## Installation via npx

Install any skill into your project's standard Claude Code folder (`.claude/skills/`) with a single command — no `postinstall`, no lifecycle scripts, you decide when code runs.

> **You don't install this package.** It's a one-shot installer, so just run it
> with `npx` — it's fetched, run once, and leaves nothing in your project.
> The command is the package name, `npx @content-island/ai-skills`. (Internally
> the binary is `content-island-skills`; an npm `bin` can't contain a scope, but
> `npx @content-island/ai-skills` resolves to it automatically.)

### Interactive mode (recommended)

Run with no arguments to open an interactive selector. **All skills come pre-selected** — just unselect the ones you don't want and press enter:

```bash
npx @content-island/ai-skills
```

- Navigate with the arrow keys, toggle with `space`, confirm with `enter`.
- Skills already present in `.claude/skills/` are labelled `(installed)`; if you keep them selected you'll be asked to confirm before overwriting.
- Press `Ctrl-C` to cancel without installing anything.

### Command mode (CI / scripting)

```bash
# List available skills
npx @content-island/ai-skills list

# Install one skill (short alias or full folder name both work)
npx @content-island/ai-skills install astro-pods
npx @content-island/ai-skills install content-island-client-api

# Install every skill
npx @content-island/ai-skills install all

# Overwrite an already-installed skill
npx @content-island/ai-skills install astro-pods --force
```

Result:

```text
my-project/
└── .claude/
    └── skills/
        └── content-island-astro-pods-architecture/
            └── SKILL.md
```

---

## Development

This package is written in TypeScript and built with tsdown. Functions are
written as arrow functions and tests follow the AAA (Arrange / Act / Assert)
structure.

### Project layout

```text
src/
  index.ts                       # cac CLI: default -> interactive, list, install
  core/helpers/*.helper.ts       # discover, install, frontmatter, paths
  core/helpers/*.helper.spec.ts  # vitest tests (AAA)
  commands/                      # list, install, interactive (@clack/prompts)
config/test/          # vitest config (config.ts)
skills/               # one folder per skill, each with a SKILL.md
tsdown.config.ts      # build config (tsdown) -> dist/index.mjs
local-npm-registry/   # Verdaccio (Docker) for local publish testing
```

### npm scripts

| Script | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run type-check` | `tsc --noEmit` |
| `npm run build` | Bundle `src/` → `dist/index.mjs` (tsdown) |
| `npm run test` | Run vitest (config in `config/test/config.ts`) |
| `npm run changeset` | Create a changeset describing your change |
| `npm run start:local-npm-registry` | Build + start Verdaccio at `localhost:4873` |
| `npm run stop:local-npm-registry` | Stop Verdaccio |
| `npm run local:publish` | Build + publish to Verdaccio **without bumping the version** |
| `npm run local:publish:release` | Full versioned rehearsal: consumes changesets, bumps version, publishes to Verdaccio |

### Adding a new skill

Create `skills/content-island-<name>/SKILL.md` with `name:` and `description:`
frontmatter. That's it — the CLI discovers skills automatically (no code
changes) and the `skills` entry in `files` ships it on publish.

---

## Running locally (all options)

You don't need to publish to try the CLI. Pick whichever fits:

### 1. Run the built file directly (fastest)

```bash
npm run build

# Interactive selector (all skills pre-selected)
node dist/index.mjs

# Commands
node dist/index.mjs list
node dist/index.mjs install astro-pods
node dist/index.mjs install all --force
```

Skills are installed into `.claude/skills/` of the **current working
directory**, so `cd` into a throwaway folder to test the result.

### 2. `npm link` (test as a real dependency, live updates)

```bash
# In this repo
npm run build
npm link

# In a test project
npm link @content-island/ai-skills
npx @content-island/ai-skills          # interactive
npx @content-island/ai-skills list

# Cleanup
npm unlink @content-island/ai-skills      # in the test project
npm rm --global @content-island/ai-skills # in this repo
```

Re-run `npm run build` after code changes (the link points at `dist/`).

### 3. Tarball (closest to the real `npm install`)

```bash
npm run build
npm pack                       # creates content-island-ai-skills-<v>.tgz

# In a test project
npm install /absolute/path/to/content-island-ai-skills-<v>.tgz
npx @content-island/ai-skills
```

### 4. Verdaccio local registry (full publish simulation, requires Docker)

Mirrors the Content Island local-registry flow end to end.

**In this repo** — start Verdaccio and publish:

```bash
npm run start:local-npm-registry      # build + Verdaccio at localhost:4873

# Publish WITHOUT bumping the version (the usual case for local testing):
npm run local:publish

# …or the full versioned rehearsal (consumes changesets):
npm run local:publish:release
```

Now the package is available at `http://localhost:4873`.

**In your test project** — add an `.npmrc` pointing at the local registry, then
install normally (no `--registry` flag needed):

```ini
# .npmrc
registry=http://localhost:4873
//localhost:4873/:_authToken="local-token"
@content-island:registry=http://localhost:4873
```

```bash
npm install @content-island/ai-skills
npx @content-island/ai-skills             # interactive selector
npx @content-island/ai-skills install all
```

> Without that `.npmrc` (and without `--registry`), `npm install` goes to the
> public registry and fails with `404` until the package is published there.

Stop the registry when done (and remove the test project's `.npmrc` so it goes
back to the public registry):

```bash
npm run stop:local-npm-registry
```

> Publishing to the **public npm registry** runs automatically from the
> `Release` GitHub Action when changesets are merged to `main`.

---

## Available Skills

### 1. Client API Skill (`content-island-client-api`)

Helps developers interact with the **Content Island Client API** using only the official documentation.

**Use this skill when:**

- Working with `@content-island/api-client` library
- Querying content via `getContentList`, `getContent`, `getRawContentList`, etc.
- Mapping raw content to models
- Handling access tokens and preview mode

**Key features:**

- Strict adherence to official documentation
- Anti-hallucination safeguards
- TypeScript-first examples
- Security best practices for tokens

### 2. Astro PODS Architecture Skill (`content-island-astro-pods-architecture`)

Defines a clear **PODS (feature/islands) architecture** for Astro projects.

**Use this skill when:**

- Structuring an Astro project with Content Island
- Creating or extending PODS (feature islands)
- Organizing UI, API models, business logic, and mappers
- Ensuring consistent project architecture

**Key features:**

- Clear folder structure conventions
- Isolation rules between pods
- Layer responsibilities (pages, layouts, pods, common)
- Implementation checklists

### 3. TanStack Start PODS Architecture Skill (`content-island-tanstack-start-pods-architecture`)

Defines a clear **PODS (feature/islands) architecture** for TanStack Start projects.

**Use this skill when:**

- Structuring a TanStack Start project with Content Island
- Creating or extending PODS (feature islands)
- Ensuring consistent project architecture

---

## Why do these skills exist?

When using LLM-based coding tools, decisions tend to drift over time:

- API usage becomes inconsistent
- Architectural patterns are forgotten
- Constraints must be re-explained repeatedly

These skills address that by:

- Making expectations explicit
- Keeping rules close to the project
- Reducing prompt repetition
- Improving consistency across sessions and tools

---

## How to use

The recommended way is the [npx installer](#installation-via-npx) above, which copies the skill into `.claude/skills/` so Claude Code picks it up automatically.

Alternatively, you can install manually:

1. Copy the relevant `SKILL.md` into `.claude/skills/<skill-name>/` in your project
2. Make it available to your LLM tool as part of the project context
3. Instruct the model to follow the rules defined in the skill

Example instructions:

> "Follow the Content Island Client API rules defined in `content-island-client-api`."

> "Use the PODS architecture defined in `content-island-astro-pods-architecture` for this Astro project."

---

## Design principles

These skills are intentionally:

- **Tool-agnostic** — work with any LLM-based coding tool
- **Human-readable** — plain Markdown, easy to review
- **Explicit** — no hidden assumptions
- **Portable** — copy and use anywhere

They are not:

- a prompt collection
- a framework
- a plugin

---

## Status

This is an **experimental convention**, not a formal standard.

The goal is to explore how lightweight, markdown-based skill definitions can improve consistency when working with LLMs across tools.

---

## License

MIT
