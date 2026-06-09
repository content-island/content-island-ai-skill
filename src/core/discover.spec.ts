import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverSkills, resolveSkill } from './discover.js';
import { installSkill, isInstalled } from './install-skill.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_SKILLS_DIR = path.resolve(HERE, '..', '..', 'skills');

describe('discoverSkills', () => {
  it('discovers the bundled content-island skills', () => {
    // Arrange
    const skillsDir = REPO_SKILLS_DIR;

    // Act
    const skills = discoverSkills(skillsDir);

    // Assert
    expect(skills.length).toBeGreaterThanOrEqual(3);
    const clientApi = skills.find(s => s.folder === 'content-island-client-api');
    expect(clientApi).toBeDefined();
    expect(clientApi?.alias).toBe('client-api'); // alias strips the content-island- prefix
    expect(clientApi?.description).not.toBe('');
  });

  it('returns an empty array for a missing directory', () => {
    // Arrange
    const missingDir = path.join(os.tmpdir(), 'does-not-exist-xyz');

    // Act
    const skills = discoverSkills(missingDir);

    // Assert
    expect(skills).toEqual([]);
  });
});

describe('resolveSkill', () => {
  it('resolves by alias and by full folder name', () => {
    // Arrange
    const skills = discoverSkills(REPO_SKILLS_DIR);

    // Act
    const byAlias = resolveSkill('client-api', skills);
    const byFolder = resolveSkill('content-island-client-api', skills);

    // Assert
    expect(byAlias?.folder).toBe('content-island-client-api');
    expect(byFolder?.folder).toBe('content-island-client-api');
  });

  it('returns null when nothing matches', () => {
    // Arrange
    const skills = discoverSkills(REPO_SKILLS_DIR);

    // Act
    const result = resolveSkill('nope-nope', skills);

    // Assert
    expect(result).toBeNull();
  });
});

describe('installSkill / isInstalled', () => {
  let cwd: string;
  let tmp: string;

  beforeEach(() => {
    cwd = process.cwd();
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-skills-'));
    process.chdir(tmp);
  });

  afterEach(() => {
    process.chdir(cwd);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('copies a skill into .claude/skills/ on a clean install', () => {
    // Arrange
    const skill = discoverSkills(REPO_SKILLS_DIR).find(s => s.folder === 'content-island-client-api')!;
    expect(isInstalled(skill)).toBe(false);

    // Act
    const result = installSkill(skill, REPO_SKILLS_DIR, false);

    // Assert
    expect(result.installed).toBe(true);
    expect(isInstalled(skill)).toBe(true);
    expect(fs.existsSync(path.join(tmp, '.claude', 'skills', skill.folder, 'SKILL.md'))).toBe(true);
  });

  it('skips an already-installed skill unless force is set', () => {
    // Arrange
    const skill = discoverSkills(REPO_SKILLS_DIR).find(s => s.folder === 'content-island-client-api')!;
    installSkill(skill, REPO_SKILLS_DIR, false);

    // Act
    const withoutForce = installSkill(skill, REPO_SKILLS_DIR, false);
    const withForce = installSkill(skill, REPO_SKILLS_DIR, true);

    // Assert
    expect(withoutForce.installed).toBe(false);
    expect(withoutForce.skipped).toBe(true);
    expect(withForce.installed).toBe(true);
  });
});
