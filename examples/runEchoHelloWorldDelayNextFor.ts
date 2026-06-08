import { openTerminal, type TerminalConfig } from '../src';

const program = {
  delayNextFor: 3000,
  config: {
    name: 'My First Echo',
    command: 'echo hello world',
  },
};

async function runProgramInTerminal() {
  const { config, delayNextFor } = program;

  const extendedConfig: TerminalConfig = { ...config, color: 'blue' };

  await openTerminal({ config: extendedConfig, delayNextFor });
}

runProgramInTerminal();
