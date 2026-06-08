import { openTerminal, type TerminalConfig } from '../src';

const program = {
  config: {
    name: 'My First Echo',
    command: 'echo hello world',
  },
};

async function runProgramInTerminal() {
  const { config } = program;

  const extendedConfig: TerminalConfig = { ...config, color: 'black' };

  await openTerminal({ ide: 'cursor', config: extendedConfig });
}

runProgramInTerminal();
