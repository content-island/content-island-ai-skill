import * as p from '@clack/prompts';
import path from 'node:path';
import { DEST_DIR, resolveSkillsDir } from '../core/helpers/paths.helper';
import { discoverSkills } from '../core/helpers/discover.helper';
import { installSkill, isInstalled } from '../core/helpers/install-skill.helper';

// Interactive selector: every skill is pre-selected; already-installed ones
// are labelled and require confirmation before being overwritten.
export const runInteractive = async (): Promise<void> => {
  p.intro('Content Island AI Skills');

  const skillsDir = resolveSkillsDir();
  const skills = discoverSkills(skillsDir);

  if (!skills.length) {
    p.cancel('No skills found in this package.');
    process.exit(0);
  }

  const result = await p.multiselect({
    message: 'Select skills to install into .claude/skills/',
    options: skills.map(s => ({
      value: s.folder,
      label: `${s.alias}${isInstalled(s) ? ' (installed)' : ''}`,
      hint: s.description,
    })),
    initialValues: skills.map(s => s.folder),
    required: false,
  });

  if (p.isCancel(result)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }

  const selected = result as string[];
  if (!selected.length) {
    p.outro('Nothing selected. Nothing to do.');
    return;
  }

  const chosen = skills.filter(s => selected.includes(s.folder));
  const existing = chosen.filter(s => isInstalled(s));

  let overwrite = false;
  if (existing.length) {
    const answer = await p.confirm({
      message: `${existing.length} selected skill(s) are already installed and will be overwritten. Continue?`,
      initialValue: true,
    });
    if (p.isCancel(answer)) {
      p.cancel('Cancelled.');
      process.exit(0);
    }
    overwrite = answer;
  }

  let installed = 0;
  let skipped = 0;
  for (const skill of chosen) {
    if (isInstalled(skill) && !overwrite) {
      p.log.warn(`Skipped ${skill.folder} (already installed).`);
      skipped++;
      continue;
    }
    const res = installSkill(skill, skillsDir, true);
    if (res.installed) {
      installed++;
      p.log.success(`Installed ${skill.folder} → ${path.join(DEST_DIR, skill.folder)}`);
    }
  }

  p.outro(`Done. ${installed}/${chosen.length} skill(s) installed.${skipped ? ` ${skipped} skipped.` : ''}`);
};
