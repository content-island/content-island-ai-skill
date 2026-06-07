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

Install any skill into your project's standard Claude Code folder (`.claude/skills/`) with a single command — no `postinstall`, no lifecycle scripts, you decide when code runs:

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
