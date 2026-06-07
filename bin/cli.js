#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PREFIX = "content-island-";
const SKILL_FILE = "SKILL.md";
const DEST_DIR = path.join(".claude", "skills");

// Package root = one level up from bin/, independent of the current working dir.
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

// Read the `name`/`description` from a SKILL.md frontmatter block.
function readFrontmatter(skillMdPath) {
  const meta = { name: "", description: "" };
  let content;
  try {
    content = fs.readFileSync(skillMdPath, "utf8");
  } catch {
    return meta;
  }
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return meta;
  for (const line of match[1].split(/\r?\n/)) {
    const nameMatch = line.match(/^name:\s*(.+)$/);
    if (nameMatch) meta.name = nameMatch[1].trim();
    const descMatch = line.match(/^description:\s*(.+)$/);
    if (descMatch) meta.description = descMatch[1].trim();
  }
  return meta;
}

// Discover every folder in the package root that contains a SKILL.md.
function discoverSkills() {
  return fs
    .readdirSync(packageRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((folder) => fs.existsSync(path.join(packageRoot, folder, SKILL_FILE)))
    .map((folder) => {
      const meta = readFrontmatter(path.join(packageRoot, folder, SKILL_FILE));
      return {
        folder,
        alias: folder.startsWith(PREFIX) ? folder.slice(PREFIX.length) : folder,
        description: meta.description,
      };
    })
    .sort((a, b) => a.folder.localeCompare(b.folder));
}

// Resolve a user-provided name to a single skill folder.
function resolveSkill(input, skills) {
  const query = input.toLowerCase();

  const exactFolder = skills.filter((s) => s.folder.toLowerCase() === query);
  if (exactFolder.length === 1) return exactFolder[0];

  const exactAlias = skills.filter((s) => s.alias.toLowerCase() === query);
  if (exactAlias.length === 1) return exactAlias[0];

  const partial = skills.filter((s) => s.folder.toLowerCase().includes(query));
  if (partial.length === 1) return partial[0];
  if (partial.length > 1) {
    fail(
      `Ambiguous skill "${input}". Matches:\n` +
        partial.map((s) => `  - ${s.folder} (${s.alias})`).join("\n") +
        `\nPlease be more specific.`
    );
  }

  fail(`Skill "${input}" not found. Run "content-island-skills list" to see available skills.`);
}

function installSkill(skill, force) {
  const dest = path.join(process.cwd(), DEST_DIR, skill.folder);
  if (fs.existsSync(dest)) {
    if (!force) {
      console.warn(`⚠ ${skill.folder} already exists at ${path.join(DEST_DIR, skill.folder)}, use --force to overwrite. Skipped.`);
      return false;
    }
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(process.cwd(), DEST_DIR), { recursive: true });
  fs.cpSync(path.join(packageRoot, skill.folder), dest, { recursive: true });
  console.log(`✓ Installed ${skill.folder} → ${path.join(DEST_DIR, skill.folder)}`);
  return true;
}

function printHelp(skills) {
  console.log(`Content Island AI Skills

Usage:
  npx @content-island/ai-skills <command> [options]

Commands:
  list                       List available skills
  install <name>             Install a skill into .claude/skills/
  install all                Install all skills

Options:
  --force                    Overwrite a skill that is already installed
  -h, --help                 Show this help

Examples:
  npx @content-island/ai-skills list
  npx @content-island/ai-skills install astro-pods
  npx @content-island/ai-skills install content-island-client-api
  npx @content-island/ai-skills install all --force
`);
  if (skills.length) {
    console.log("Available skills:");
    for (const s of skills) console.log(`  - ${s.alias}  (${s.folder})`);
  }
}

function printList(skills) {
  if (!skills.length) {
    console.log("No skills found in this package.");
    return;
  }
  console.log("Available skills:\n");
  for (const s of skills) {
    console.log(`  ${s.alias}`);
    console.log(`    folder: ${s.folder}`);
    if (s.description) console.log(`    ${s.description}`);
    console.log("");
  }
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const positional = args.filter((a) => !a.startsWith("-"));
  const command = positional[0];
  const skills = discoverSkills();

  if (!command || args.includes("-h") || args.includes("--help")) {
    printHelp(skills);
    return;
  }

  if (command === "list") {
    printList(skills);
    return;
  }

  if (command === "install") {
    const target = positional[1];
    if (!target) fail(`Missing skill name. Usage: install <name|all>`);

    if (target === "all") {
      if (!skills.length) fail("No skills available to install.");
      let installed = 0;
      for (const skill of skills) {
        if (installSkill(skill, force)) installed++;
      }
      console.log(`\nDone. ${installed}/${skills.length} skill(s) installed.`);
      return;
    }

    const skill = resolveSkill(target, skills);
    installSkill(skill, force);
    return;
  }

  fail(`Unknown command "${command}". Run with --help for usage.`);
}

main();
