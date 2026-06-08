import { execSync } from 'child_process';
import { wait } from './helpers';
import type { DebugConfig, TerminalConfig } from './types';

export type OpenTerminalProps = {
  /**
   * @default 'vscode'
   */
  ide?: 'vscode' | 'cursor';
  config: TerminalConfig | DebugConfig;
  isDebugConsole?: boolean;
  /**
   * If set to `true`, opens a JavaScript Debug Terminal — a special integrated terminal
   * where any Node.js process started inside it is automatically attached to the debugger.
   *
   * When using this option, `config` should be of type `TerminalConfig`.
   * The `config.command` value is the shell command that will run inside the JS Debug Terminal.
   *
   * Note: `isDebugTerminal` and `isDebugMode` are mutually exclusive.
   */
  isDebugTerminal?: boolean;
  delayNextFor?: number;
};

export async function openTerminal(props: OpenTerminalProps) {
  const { ide = 'vscode', config, isDebugConsole, isDebugTerminal, delayNextFor } = props;

  let path = '';

  if (isDebugConsole) {
    path = '/debug';
  } else if (isDebugTerminal) {
    path = '/js-debug';
  }

  const configAsString = encodeURIComponent(btoa(JSON.stringify(config)));

  const command = `open '${ide}://open.in-terminal${path}?config=${configAsString}&encoded=true'`;

  execSync(command);

  if (delayNextFor) await wait(delayNextFor);
}
