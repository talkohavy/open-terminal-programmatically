import { openTerminal, type TerminalConfig } from '../src';

async function runProgramInJsDebugTerminal() {
  const extendedConfig: TerminalConfig = {
    name: 'Dummy Backend',
    command: 'echo "hello world"',
    autoFocus: true,
    color: 'blue',
  };

  await openTerminal({ ide: 'cursor', config: extendedConfig, isDebugTerminal: true });
}

runProgramInJsDebugTerminal();
