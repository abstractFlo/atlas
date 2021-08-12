import { bold, cyan, dim, green, red } from 'colorette';
import { RollupError, WatcherOptions } from 'rollup';
import { relativeId } from './relativeId';
import ProgressBar, { ProgressBarOptions } from 'progress';

const CLEAR_SCREEN = '\u001Bc';

/**
 * Clear the terminal screen
 */
export function getResetScreen(
    config: WatcherOptions,
    allowClearScreen: boolean | undefined
) {
  let clearScreen = allowClearScreen;
  if (config && config.clearScreen === false) {
    clearScreen = false;
  }

  if (clearScreen) {
    return (heading: string) => stderr(CLEAR_SCREEN + heading);
  }

  let firstRun = true;
  return (heading: string) => {
    if (firstRun) {
      stderr(heading);
      firstRun = false;
    }
  };
}

/**
 * Bind output to console.error to prevent bundle from breaking
 * @type {any}
 */
export const stderr = console.error.bind(console);

/**
 * Handle errors
 *
 * @param {RollupError} err
 * @param {boolean} recover
 */
export function handleError(err: RollupError, recover = false) {
  let description = err.message || err;
  if (err.name) description = `${err.name}: ${description}`;
  const message = (err.plugin ? `(plugin ${err.plugin}) ${description}` : description) || err;

  stderr(bold(red(`[!] ${bold(message.toString())}`)));

  if (err.url) {
    stderr(cyan(err.url));
  }

  if (err.loc) {
    stderr(`${relativeId((err.loc.file || err.id)!)} (${err.loc.line}:${err.loc.column})`);
  } else if (err.id) {
    stderr(relativeId(err.id));
  }

  if (err.frame) {
    stderr(dim(err.frame));
  }

  if (err.stack) {
    stderr(dim(err.stack));
  }

  stderr('');

  if (!recover) process.exit(1);
}

/**
 * Check if tty is available
 *
 * @type {boolean}
 */
export const isTTY = process.stderr.isTTY;

/**
 * Generate success console message
 *
 * @param {string} message
 * @param {string} type
 */
export function successMessage(message: string, type: string = 'Success'): void {
  stderr(`${green(type)} -> ${message}`);
}

/**
 * Generate error console message
 *
 * @param {string} message
 * @param {string} type
 */
export function errorMessage(message: string, type: string = 'Error'): void {
  stderr(`${red(type)} -> ${message}`);
}

/**
 * Create a cli progress bar
 *
 * @param {string} format
 * @param {ProgressBar.ProgressBarOptions} options
 * @param startingMessage
 * @return {ProgressBar}
 */
export function createProgressBar(format: string, options: ProgressBarOptions, startingMessage: string): ProgressBar {

  const defaultOptions: ProgressBarOptions = {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 1,
    total: 0
  };

  stderr(startingMessage);

  return new ProgressBar(
      format,
      { ...defaultOptions, ...options }
  );
}
