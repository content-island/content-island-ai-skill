import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEST_DIR, PREFIX, SKILL_FILE, resolveSkillsDir } from './paths.helper';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_SKILLS_DIR = path.resolve(HERE, '..', '..', '..', 'skills');

describe('constants', () => {
  it('exposes the content-island folder prefix', () => {
    // Arrange + Act + Assert
    expect(PREFIX).toBe('content-island-');
  });

  it('exposes the skill manifest filename', () => {
    // Arrange + Act + Assert
    expect(SKILL_FILE).toBe('SKILL.md');
  });

  it('points the install destination at .claude/skills', () => {
    // Arrange + Act + Assert
    expect(DEST_DIR).toBe(path.join('.claude', 'skills'));
  });
});

describe('resolveSkillsDir', () => {
  it('resolves to an existing directory', () => {
    // Arrange + Act
    const dir = resolveSkillsDir();

    // Assert
    expect(fs.existsSync(dir)).toBe(true);
  });

  it('resolves to the bundled skills directory', () => {
    // Arrange + Act
    const dir = resolveSkillsDir();

    // Assert
    expect(path.basename(dir)).toBe('skills');
    expect(path.resolve(dir)).toBe(REPO_SKILLS_DIR);
  });

  it('resolves to a directory that contains the bundled skills', () => {
    // Arrange + Act
    const dir = resolveSkillsDir();
    const entries = fs.readdirSync(dir);

    // Assert
    expect(entries.some(name => name.startsWith(PREFIX))).toBe(true);
  });
});
