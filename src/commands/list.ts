import { discoverSkills } from '../core/helpers/discover.helper';
import { resolveSkillsDir } from '../core/helpers/paths.helper';

export const runList = (): void => {
  const skills = discoverSkills(resolveSkillsDir());
  if (!skills.length) {
    console.log('No skills found in this package.');
    return;
  }
  console.log('Available skills:\n');
  for (const s of skills) {
    console.log(`  ${s.alias}`);
    console.log(`    folder: ${s.folder}`);
    if (s.description) console.log(`    ${s.description}`);
    console.log('');
  }
};
