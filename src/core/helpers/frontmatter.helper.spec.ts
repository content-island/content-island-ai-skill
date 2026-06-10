import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readFrontmatter } from './frontmatter.helper.js';

let tmp: string;

const writeSkill = (content: string): string => {
  const file = path.join(tmp, 'SKILL.md');
  fs.writeFileSync(file, content);
  return file;
};

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-frontmatter-'));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe('readFrontmatter', () => {
  it('reads name and description from a valid frontmatter block', () => {
    // Arrange
    const file = writeSkill('---\nname: my-skill\ndescription: Does a thing\n---\n# Body\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta).toEqual({ name: 'my-skill', description: 'Does a thing' });
  });

  it('trims surrounding whitespace from values', () => {
    // Arrange
    const file = writeSkill('---\nname:   spaced-name   \ndescription:   spaced desc   \n---\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta).toEqual({ name: 'spaced-name', description: 'spaced desc' });
  });

  it('preserves colons and special characters inside the description', () => {
    // Arrange
    const file = writeSkill('---\nname: x\ndescription: Use this: do X & Y (now)\n---\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta.description).toBe('Use this: do X & Y (now)');
  });

  it('handles CRLF line endings', () => {
    // Arrange
    const file = writeSkill('---\r\nname: crlf\r\ndescription: windows\r\n---\r\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta).toEqual({ name: 'crlf', description: 'windows' });
  });

  it('ignores unrelated frontmatter fields', () => {
    // Arrange
    const file = writeSkill('---\nname: x\nversion: 1.0\ndescription: y\nauthor: someone\n---\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta).toEqual({ name: 'x', description: 'y' });
  });

  it('returns only the name when the description is missing', () => {
    // Arrange
    const file = writeSkill('---\nname: only-name\n---\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta).toEqual({ name: 'only-name', description: '' });
  });

  it('returns only the description when the name is missing', () => {
    // Arrange
    const file = writeSkill('---\ndescription: only-desc\n---\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta).toEqual({ name: '', description: 'only-desc' });
  });

  it('returns empty meta when there is no frontmatter block', () => {
    // Arrange
    const file = writeSkill('# Just a heading\nNo frontmatter here.\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta).toEqual({ name: '', description: '' });
  });

  it('returns empty meta for an unterminated frontmatter block', () => {
    // Arrange
    const file = writeSkill('---\nname: broken\ndescription: never closed\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta).toEqual({ name: '', description: '' });
  });

  it('returns empty meta for a non-existent file', () => {
    // Arrange
    const missing = path.join(tmp, 'nope', 'SKILL.md');

    // Act
    const meta = readFrontmatter(missing);

    // Assert
    expect(meta).toEqual({ name: '', description: '' });
  });

  it('keeps the first occurrence... and is overridden by the last for a repeated key', () => {
    // Arrange
    const file = writeSkill('---\nname: first\nname: second\ndescription: d\n---\n');

    // Act
    const meta = readFrontmatter(file);

    // Assert
    expect(meta.name).toBe('second');
  });
});
