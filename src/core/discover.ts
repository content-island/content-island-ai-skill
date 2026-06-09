import fs from 'node:fs';
import path from 'node:path';
import { PREFIX, SKILL_FILE } from './paths.js';
import { readFrontmatter } from './frontmatter.js';

export interface Skill {
  folder: string;
  alias: string;
  description: string;
}

// Discover every folder inside `skillsDir` that contains a SKILL.md.
export const discoverSkills = (skillsDir: string): Skill[] => {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(folder => fs.existsSync(path.join(skillsDir, folder, SKILL_FILE)))
    .map(folder => {
      const meta = readFrontmatter(path.join(skillsDir, folder, SKILL_FILE));
      return {
        folder,
        alias: folder.startsWith(PREFIX) ? folder.slice(PREFIX.length) : folder,
        description: meta.description,
      };
    })
    .sort((a, b) => a.folder.localeCompare(b.folder));
};

// Resolve a user-provided name to a single skill folder. Returns null when
// the input matches zero skills, and throws on an ambiguous match.
export const resolveSkill = (input: string, skills: Skill[]): Skill | null => {
  const query = input.toLowerCase();

  const exactFolder = skills.filter(s => s.folder.toLowerCase() === query);
  if (exactFolder.length === 1) return exactFolder[0];

  const exactAlias = skills.filter(s => s.alias.toLowerCase() === query);
  if (exactAlias.length === 1) return exactAlias[0];

  const partial = skills.filter(s => s.folder.toLowerCase().includes(query));
  if (partial.length === 1) return partial[0];
  if (partial.length > 1) {
    const matches = partial.map(s => `  - ${s.folder} (${s.alias})`).join('\n');
    throw new Error(`Ambiguous skill "${input}". Matches:\n${matches}\nPlease be more specific.`);
  }

  return null;
};
