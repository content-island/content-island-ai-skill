import childProcess from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

// Publishes the (scoped) package to the local Verdaccio registry.
// Run from the repo root, e.g.:
//   node local-npm-registry/publish.js npm publish
//   node local-npm-registry/publish.js changeset publish
//
// It writes a temporary .npmrc pointing at localhost:4873, best-effort
// unpublishes the current version (so re-running is idempotent — npm/Verdaccio
// reject publishing over an existing version), runs the given publish command,
// and removes the .npmrc afterwards. This script is ONLY used for local
// testing; the real npm release runs `changeset publish` from CI directly.

const [...publishCommandArgs] = process.argv.slice(2);
const publishCommand = publishCommandArgs.join(' ');

const REGISTRY = 'http://localhost:4873';
const npmrcContent = `registry=${REGISTRY}
//localhost:4873/:_authToken="local-token"
@content-island:registry=${REGISTRY}
`;
const NPMRC_FILE_PATH = path.resolve(process.cwd(), '.npmrc');

const run = (command, { ignoreErrors = false } = {}) => {
  try {
    childProcess.execSync(command, { stdio: 'inherit', shell: true });
  } catch (error) {
    if (!ignoreErrors) throw error;
  }
};

try {
  const pkg = JSON.parse(await fs.readFile(path.resolve(process.cwd(), 'package.json'), 'utf-8'));
  await fs.writeFile(NPMRC_FILE_PATH, npmrcContent);

  // Best-effort: remove a previous copy from the local registry so the publish
  // below doesn't fail with a 409 Conflict on repeated runs.
  run(`npm unpublish ${pkg.name}@${pkg.version} --force --registry ${REGISTRY}`, { ignoreErrors: true });

  run(publishCommand);
} finally {
  await fs.rm(NPMRC_FILE_PATH, { force: true });
}
