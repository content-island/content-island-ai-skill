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

## Available Skills

### 1. Client API Skill (`client-api/skill.md`)

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

### 2. Astro PODS Architecture Skill (`astro-pods/skill.md`)

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

1. Copy the relevant `skill.md` into your project repository
2. Make it available to your LLM tool as part of the project context
3. Instruct the model to follow the rules defined in the skill

Example instructions:

> "Follow the Content Island Client API rules defined in `client-api/skill.md`."

> "Use the PODS architecture defined in `astro-pods/skill.md` for this Astro project."

No additional setup is required.

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
