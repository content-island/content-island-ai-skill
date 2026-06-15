import fs from 'node:fs';

export interface Frontmatter {
  name: string;
  description: string;
}

// Read the `name`/`description` from a SKILL.md frontmatter block.
export const readFrontmatter = (skillMdPath: string): Frontmatter => {
  const meta: Frontmatter = { name: '', description: '' };
  let content: string;
  try {
    content = fs.readFileSync(skillMdPath, 'utf8');
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
};
