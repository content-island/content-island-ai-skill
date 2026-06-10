import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { discoverSkills, resolveSkill, type Skill } from './discover.helper.js';

let tmp: string;

// Create a skill folder with a SKILL.md frontmatter inside the temp skills dir.
const makeSkill = (folder: string, description = 'desc'): void => {
  const dir = path.join(tmp, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${folder}\ndescription: ${description}\n---\n`);
};

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-discover-'));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe('discoverSkills', () => {
  it('discovers every folder that contains a SKILL.md', () => {
    // Arrange
    makeSkill('content-island-alpha');
    makeSkill('content-island-beta');

    // Act
    const skills = discoverSkills(tmp);

    // Assert
    expect(skills.map(s => s.folder)).toEqual(['content-island-alpha', 'content-island-beta']);
  });

  it('strips the content-island- prefix into the alias', () => {
    // Arrange
    makeSkill('content-island-client-api');

    // Act
    const [skill] = discoverSkills(tmp);

    // Assert
    expect(skill.folder).toBe('content-island-client-api');
    expect(skill.alias).toBe('client-api');
  });

  it('uses the folder name as alias when there is no prefix', () => {
    // Arrange
    makeSkill('standalone-skill');

    // Act
    const [skill] = discoverSkills(tmp);

    // Assert
    expect(skill.alias).toBe('standalone-skill');
  });

  it('reads the description from the SKILL.md frontmatter', () => {
    // Arrange
    makeSkill('content-island-x', 'A precise description');

    // Act
    const [skill] = discoverSkills(tmp);

    // Assert
    expect(skill.description).toBe('A precise description');
  });

  it('sorts skills by folder name', () => {
    // Arrange
    makeSkill('content-island-zebra');
    makeSkill('content-island-apple');
    makeSkill('content-island-mango');

    // Act
    const skills = discoverSkills(tmp);

    // Assert
    expect(skills.map(s => s.folder)).toEqual([
      'content-island-apple',
      'content-island-mango',
      'content-island-zebra',
    ]);
  });

  it('ignores directories without a SKILL.md', () => {
    // Arrange
    makeSkill('content-island-valid');
    fs.mkdirSync(path.join(tmp, 'content-island-empty'), { recursive: true });

    // Act
    const skills = discoverSkills(tmp);

    // Assert
    expect(skills.map(s => s.folder)).toEqual(['content-island-valid']);
  });

  it('ignores loose files at the top level', () => {
    // Arrange
    makeSkill('content-island-valid');
    fs.writeFileSync(path.join(tmp, 'README.md'), '# not a skill');

    // Act
    const skills = discoverSkills(tmp);

    // Assert
    expect(skills.map(s => s.folder)).toEqual(['content-island-valid']);
  });

  it('returns an empty array for an empty directory', () => {
    // Arrange (tmp is freshly created and empty)

    // Act
    const skills = discoverSkills(tmp);

    // Assert
    expect(skills).toEqual([]);
  });

  it('returns an empty array for a missing directory', () => {
    // Arrange
    const missing = path.join(tmp, 'does-not-exist');

    // Act
    const skills = discoverSkills(missing);

    // Assert
    expect(skills).toEqual([]);
  });
});

describe('resolveSkill', () => {
  const skills: Skill[] = [
    { folder: 'content-island-client-api', alias: 'client-api', description: '' },
    { folder: 'content-island-astro-pods', alias: 'astro-pods', description: '' },
    { folder: 'content-island-tanstack-pods', alias: 'tanstack-pods', description: '' },
  ];

  it('resolves by exact full folder name', () => {
    // Act
    const result = resolveSkill('content-island-client-api', skills);

    // Assert
    expect(result?.folder).toBe('content-island-client-api');
  });

  it('resolves by exact alias', () => {
    // Act
    const result = resolveSkill('client-api', skills);

    // Assert
    expect(result?.folder).toBe('content-island-client-api');
  });

  it('resolves case-insensitively', () => {
    // Act
    const result = resolveSkill('CLIENT-API', skills);

    // Assert
    expect(result?.folder).toBe('content-island-client-api');
  });

  it('resolves a unique partial match', () => {
    // Act
    const result = resolveSkill('client', skills);

    // Assert
    expect(result?.folder).toBe('content-island-client-api');
  });

  it('throws on an ambiguous partial match listing the candidates', () => {
    // Act + Assert
    expect(() => resolveSkill('pods', skills)).toThrow(/Ambiguous skill "pods"/);
    expect(() => resolveSkill('pods', skills)).toThrow(/content-island-astro-pods/);
    expect(() => resolveSkill('pods', skills)).toThrow(/content-island-tanstack-pods/);
  });

  it('returns null when nothing matches', () => {
    // Act
    const result = resolveSkill('nope-nope', skills);

    // Assert
    expect(result).toBeNull();
  });

  it('prefers an exact folder match over a partial one', () => {
    // Arrange
    const overlapping: Skill[] = [
      { folder: 'api', alias: 'api', description: '' },
      { folder: 'api-extended', alias: 'api-extended', description: '' },
    ];

    // Act
    const result = resolveSkill('api', overlapping);

    // Assert
    expect(result?.folder).toBe('api');
  });

  it('returns null for an empty skill list', () => {
    // Act
    const result = resolveSkill('anything', []);

    // Assert
    expect(result).toBeNull();
  });
});
