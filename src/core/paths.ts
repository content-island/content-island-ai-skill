import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PREFIX = 'content-island-';
export const SKILL_FILE = 'SKILL.md';

// Destination inside the consuming project where skills are installed.
export const DEST_DIR = path.join('.claude', 'skills');

// Absolute path to the bundled `skills/` directory.
// At runtime the built file lives at `<pkg>/dist/index.js`, so `skills/`
// sits one level up. When running from source (tsx) it lives at
// `<pkg>/src/core/paths.ts`, two levels up. Pick whichever exists.
export const resolveSkillsDir = (): string => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(here, '..', 'skills'), // dist/index.js -> ../skills
    path.resolve(here, '..', '..', 'skills'), // src/core/paths.ts -> ../../skills
  ];
  return candidates.find(dir => fs.existsSync(dir)) ?? candidates[0];
};
