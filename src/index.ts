import { cac } from 'cac';
import { runList } from './commands/list.js';
import { runInstall } from './commands/install.js';
import { runInteractive } from './commands/interactive.js';
import packageJson from '../package.json' with { type: 'json' };

const cli = cac('content-island-skills');

cli
  .command('', 'Interactively select skills to install (all pre-selected)')
  .action(async () => {
    await runInteractive();
  });

cli.command('list', 'List available skills').action(() => {
  runList();
});

cli
  .command('install <name>', 'Install a skill into .claude/skills/ (use "all" for every skill)')
  .option('--force', 'Overwrite a skill that is already installed')
  .action((name: string, options: { force?: boolean }) => {
    runInstall(name, { force: options.force });
  });

cli.help();
cli.version(packageJson.version);

cli.parse();
