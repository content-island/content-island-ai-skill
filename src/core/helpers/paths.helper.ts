import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PREFIX = 'content-island-';
export const SKILL_FILE = 'SKILL.md';

// Destination inside the consuming project where skills are installed.
export const DEST_DIR = path.join('.claude', 'skills');

// Absolute path to the bundled `skills/` directory.
// At runtime the built file lives at `<pkg>/dist/index.mjs`, so `skills/`
// sits one level up. When running from source (tsx) it lives at
// `<pkg>/src/core/helpers/paths.helper.ts`, three levels up. Pick whichever exists.
export const resolveSkillsDir = (): string => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(here, '..', 'skills'), // dist/index.mjs -> ../skills
    path.resolve(here, '..', '..', '..', 'skills'), // src/core/helpers/paths.helper.ts -> ../../../skills
  ];
  return candidates.find(dir => fs.existsSync(dir)) ?? candidates[0];
};
