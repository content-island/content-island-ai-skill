import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
  target: 'node24',
  // Shebang so the built file can run as an npm bin (npx content-island-skills).
  outputOptions: {
    banner: '#!/usr/bin/env node',
  },
});
