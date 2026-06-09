import fs from 'node:fs';
import path from 'node:path';
import { DEST_DIR } from './paths.js';
import type { Skill } from './discover.js';

// Whether a skill is already present in the local .claude/skills/ directory.
export const isInstalled = (skill: Skill): boolean =>
  fs.existsSync(path.join(process.cwd(), DEST_DIR, skill.folder));

export interface InstallResult {
  installed: boolean;
  skipped: boolean;
  reason?: string;
}

// Copy a skill from the bundled `skillsDir` into `.claude/skills/`.
// Existing installs are skipped unless `force` is set.
export const installSkill = (skill: Skill, skillsDir: string, force: boolean): InstallResult => {
  const dest = path.join(process.cwd(), DEST_DIR, skill.folder);
  if (fs.existsSync(dest)) {
    if (!force) {
      return { installed: false, skipped: true, reason: 'already installed' };
    }
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(process.cwd(), DEST_DIR), { recursive: true });
  fs.cpSync(path.join(skillsDir, skill.folder), dest, { recursive: true });
  return { installed: true, skipped: false };
};
