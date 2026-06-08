import { openTerminal, type TerminalConfig } from '../src';

const program = {
  config: {
    name: 'My First AutoFocus Echo',
    command: 'echo hello world and focus',
    autoFocus: true,
  },
};

async function runProgramInTerminal() {
  const { config } = program;

  const extendedConfig: TerminalConfig = { ...config, color: 'blue' };

  await openTerminal({ config: extendedConfig });
}

runProgramInTerminal();
