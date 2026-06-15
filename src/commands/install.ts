import path from 'node:path';
import { DEST_DIR, resolveSkillsDir } from '../core/helpers/paths.helper';
import { discoverSkills, resolveSkill } from '../core/helpers/discover.helper';
import { installSkill } from '../core/helpers/install-skill.helper';

export interface InstallOptions {
  force?: boolean;
}

const fail = (message: string): never => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

const reportResult = (folder: string, result: { installed: boolean; reason?: string }): void => {
  const rel = path.join(DEST_DIR, folder);
  if (result.installed) {
    console.log(`✓ Installed ${folder} → ${rel}`);
  } else {
    console.warn(`⚠ ${folder} ${result.reason ?? 'skipped'} at ${rel}, use --force to overwrite. Skipped.`);
  }
};

// Install a single skill by name/alias, or all of them when `target` is "all".
export const runInstall = (target: string, options: InstallOptions = {}): void => {
  const force = Boolean(options.force);
  const skillsDir = resolveSkillsDir();
  const skills = discoverSkills(skillsDir);

  if (!skills.length) {
    fail('No skills available to install.');
  }

  if (target === 'all') {
    let installed = 0;
    for (const skill of skills) {
      const result = installSkill(skill, skillsDir, force);
      reportResult(skill.folder, result);
      if (result.installed) installed++;
    }
    console.log(`\nDone. ${installed}/${skills.length} skill(s) installed.`);
    return;
  }

  let skill;
  try {
    skill = resolveSkill(target, skills);
  } catch (err) {
    fail((err as Error).message);
  }
  if (!skill) {
    fail(`Skill "${target}" not found. Run "content-island-skills list" to see available skills.`);
  }
  reportResult(skill!.folder, installSkill(skill!, skillsDir, force));
};
