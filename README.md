# Content Island AI Skill

A reusable `skill.md` that defines Content Island behavior for Claude Code, GitHub Copilot, and other LLM-based coding tools.

---

## What is this?

This repository contains a **portable AI skill definition** (`skill.md`) that encodes the principles of Content Island as an AI-readable behavior contract.

Instead of relying on ad-hoc prompts, this skill provides a **consistent, reusable way** to guide LLMs when working on content-driven projects.

Think of it as:

- a shared context
- a behavioral spec
- a lightweight “system prompt” you can reuse across tools

---

## Why does this exist?

When using LLM-based coding tools, content decisions tend to drift over time:

- tone becomes inconsistent
- structural rules are forgotten
- constraints must be re-explained repeatedly

This skill addresses that by:

- making expectations explicit
- keeping content rules close to the project
- reducing prompt repetition
- improving consistency across sessions and tools

---

## What's inside?

- `skill.md`  
  The skill definition itself. This is the only required file.

---

## How to use it

1. Copy `skill.md` into your project repository
2. Make it available to your LLM tool as part of the project context
3. Instruct the model to follow the rules defined in the skill

Example instruction:

> “Follow the Content Island rules defined in `skill.md` for this project.”

No additional setup is required.

---

## Design principles

This skill is intentionally:

- **Tool-agnostic**
- **Human-readable**
- **Explicit**
- **Portable**

It is not:

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
