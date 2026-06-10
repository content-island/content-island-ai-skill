import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { installSkill, isInstalled } from './install-skill.helper.js';
import { DEST_DIR } from './paths.helper.js';
import type { Skill } from './discover.helper.js';

const SKILL: Skill = { folder: 'content-island-demo', alias: 'demo', description: 'demo' };

let originalCwd: string;
let cwd: string;
let sourceDir: string;

// Build a source skills dir containing SKILL with a nested file, so the
// recursive copy can be asserted.
const seedSource = (skillBody = 'original'): void => {
  const skillDir = path.join(sourceDir, SKILL.folder);
  fs.mkdirSync(path.join(skillDir, 'nested'), { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), `---\nname: demo\ndescription: demo\n---\n${skillBody}\n`);
  fs.writeFileSync(path.join(skillDir, 'nested', 'extra.md'), 'extra');
};

const installedPath = (...segments: string[]): string => path.join(cwd, DEST_DIR, SKILL.folder, ...segments);

beforeEach(() => {
  originalCwd = process.cwd();
  cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-install-cwd-'));
  sourceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-install-src-'));
  process.chdir(cwd);
  seedSource();
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(cwd, { recursive: true, force: true });
  fs.rmSync(sourceDir, { recursive: true, force: true });
});

describe('isInstalled', () => {
  it('is false before installing', () => {
    // Act + Assert
    expect(isInstalled(SKILL)).toBe(false);
  });

  it('is true after installing', () => {
    // Arrange
    installSkill(SKILL, sourceDir, false);

    // Act + Assert
    expect(isInstalled(SKILL)).toBe(true);
  });
});

describe('installSkill', () => {
  it('copies the skill into .claude/skills on a clean install', () => {
    // Act
    const result = installSkill(SKILL, sourceDir, false);

    // Assert
    expect(result).toEqual({ installed: true, skipped: false });
    expect(fs.existsSync(installedPath('SKILL.md'))).toBe(true);
  });

  it('copies nested files recursively', () => {
    // Act
    installSkill(SKILL, sourceDir, false);

    // Assert
    expect(fs.existsSync(installedPath('nested', 'extra.md'))).toBe(true);
    expect(fs.readFileSync(installedPath('nested', 'extra.md'), 'utf8')).toBe('extra');
  });

  it('creates the .claude/skills directory when it does not exist', () => {
    // Arrange
    expect(fs.existsSync(path.join(cwd, DEST_DIR))).toBe(false);

    // Act
    installSkill(SKILL, sourceDir, false);

    // Assert
    expect(fs.existsSync(path.join(cwd, DEST_DIR))).toBe(true);
  });

  it('skips an already-installed skill when force is false', () => {
    // Arrange
    installSkill(SKILL, sourceDir, false);

    // Act
    const result = installSkill(SKILL, sourceDir, false);

    // Assert
    expect(result).toEqual({ installed: false, skipped: true, reason: 'already installed' });
  });

  it('does not modify an existing install when skipped', () => {
    // Arrange
    installSkill(SKILL, sourceDir, false);
    fs.writeFileSync(installedPath('SKILL.md'), 'locally edited');

    // Act
    installSkill(SKILL, sourceDir, false);

    // Assert
    expect(fs.readFileSync(installedPath('SKILL.md'), 'utf8')).toBe('locally edited');
  });

  it('overwrites an existing install when force is true', () => {
    // Arrange
    installSkill(SKILL, sourceDir, false);
    fs.writeFileSync(installedPath('SKILL.md'), 'locally edited');

    // Act
    const result = installSkill(SKILL, sourceDir, true);

    // Assert
    expect(result).toEqual({ installed: true, skipped: false });
    expect(fs.readFileSync(installedPath('SKILL.md'), 'utf8')).toContain('original');
  });

  it('removes stale files from the previous install when forced', () => {
    // Arrange
    installSkill(SKILL, sourceDir, false);
    fs.writeFileSync(installedPath('stale.md'), 'remove me');

    // Act
    installSkill(SKILL, sourceDir, true);

    // Assert
    expect(fs.existsSync(installedPath('stale.md'))).toBe(false);
  });
});
