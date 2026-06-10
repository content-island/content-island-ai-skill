import fs from 'node:fs';
import path from 'node:path';
import { DEST_DIR } from './paths.helper';
import type { Skill } from './discover.helper';

// Whether a skill is already present in the `.claude/skills/` of `baseDir`.
export const isInstalled = (skill: Skill, baseDir: string = process.cwd()): boolean =>
  fs.existsSync(path.join(baseDir, DEST_DIR, skill.folder));

export interface InstallResult {
  installed: boolean;
  skipped: boolean;
  reason?: string;
}

// Copy a skill from the bundled `skillsDir` into `baseDir`'s `.claude/skills/`.
// Existing installs are skipped unless `force` is set.
export const installSkill = (
  skill: Skill,
  skillsDir: string,
  force: boolean,
  baseDir: string = process.cwd(),
): InstallResult => {
  const dest = path.join(baseDir, DEST_DIR, skill.folder);
  if (fs.existsSync(dest)) {
    if (!force) {
      return { installed: false, skipped: true, reason: 'already installed' };
    }
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(baseDir, DEST_DIR), { recursive: true });
  fs.cpSync(path.join(skillsDir, skill.folder), dest, { recursive: true });
  return { installed: true, skipped: false };
};
