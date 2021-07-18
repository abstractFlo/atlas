import {
  OutputOptions,
  rollup,
  RollupBuild,
  RollupOptions,
  RollupWatcher,
  RollupWatchOptions,
  VERSION,
  watch
} from 'rollup';
import {
  env,
  fsJetpack,
  getResetScreen,
  handleError,
  isTTY,
  relativeId,
  stderr,
  successMessage
} from '@abstractflo/atlas-devtools';
import { bold, cyan, green, underline } from 'colorette';
import ms from 'pretty-ms';
import { getDefinedPreserves } from './builder.helpers';

export class Builder {

  /**
   * State for watch mode
   *
   * @type {boolean}
   * @private
   */
  private readonly watch: boolean;

  /**
   * Contains the buildOutput
   *
   * @type {string}
   * @private
   */
  private readonly buildOutput: string = env('ATLAS_BUILD_OUTPUT', 'dist');

  constructor(watch: boolean) {
    this.watch = watch;
  }

  /**
   * Run the build process
   *
   * @param {RollupOptions[]} configs
   */
  public async run(configs: RollupOptions[]): Promise<void> {
    await this.prepare();

    /*this.watch
        ? await this.startWatching(configs)
        : await this.buildAll(configs);*/
  }

  /**
   * Build one config
   *
   * @param {RollupOptions} config
   * @return {Promise<void>}
   * @private
   */
  private async build(config: RollupOptions): Promise<void> {
    const start = Date.now();
    const output = config.output as OutputOptions;
    const file = relativeId(output.file || output.dir!);

    let inputFiles: string | undefined;

    if (typeof config.input === 'string') {
      inputFiles = config.input;
    } else if (config.input instanceof Array) {
      inputFiles = config.input.join(', ');
    } else if (typeof config.input === 'object' && config.input !== null) {
      inputFiles = Object.values(config.input).join(', ');
    }

    stderr(cyan(`\b${bold(inputFiles!)} -> ${bold(file)}...`));

    let bundle: RollupBuild;

    try {
      bundle = await rollup(config);
      await bundle.write(output);
    } catch (err) {
      return handleError(err);
    } finally {
      if (bundle) {
        await bundle.close;
      }
    }

    stderr(green(`created ${bold(file)} in ${bold(ms(Date.now() - start))}`));
  }

  /**
   * Build all given configs
   * @param {RollupOptions[]} configs
   * @return {Promise<void>}
   * @private
   */
  private async buildAll(configs: RollupOptions[]): Promise<void> {
    const config = configs.shift();

    await this.build(config);

    if (configs.length) await this.buildAll(configs);
  }

  /**
   * Watch given configs for filechange
   *
   * @param {RollupOptions[]} configs
   * @return {Promise<void>}
   * @private
   */
  private async startWatching(configs: RollupWatchOptions[]): Promise<void> {
    //@ts-ignore
    const resetScreen = getResetScreen(configs!, isTTY);
    let watcher: RollupWatcher;

    try {
      watcher = watch(configs);
    } catch (err) {
      return handleError(err);
    }

    watcher.on('event', event => {
      switch (event.code) {
        case 'ERROR':
          handleError(event.error, true);
          break;

        case 'START':
          resetScreen(underline(`rollup v${VERSION}`));
          break;

        case 'BUNDLE_START':
          let input = event.input;
          if (typeof input !== 'string') {
            input = Array.isArray(input)
                ? input.join(', ')
                : Object.values(input as Record<string, string>).join(', ');
          }
          stderr(cyan(`bundles ${bold(input)} → ${bold(event.output.map(relativeId).join(', '))}...`));
          break;

        case 'BUNDLE_END':
          stderr(green(`created ${bold(event.output.map(relativeId).join(', '))} in ${bold(ms(event.duration))}`));
          break;

        case 'END':
          if (isTTY) {
            stderr(`\n[${new Date().toLocaleTimeString()}] waiting for changes...`);
          }
          break;
      }

      if ('result' in event && event.result) {
        event.result.close().catch(error => handleError(error, true));
      }
    });

  }

  /**
   * Prepare the build process
   *
   * @return {Promise<void>}
   * @private
   */
  private prepare(): Promise<void> {
    return new Promise((resolve) => {
      this.cleanup();
      this.copyFiles();
      resolve();
    });
  }

  /**
   * Cleanup the build output
   *
   * @private
   */
  private cleanup(): void {

    if (!env('ATLAS_CLEAR_BEFORE_BUILD', false) || !fsJetpack().exists(this.buildOutput)) return;


    const preserved = getDefinedPreserves();
    const removeablePaths = fsJetpack().find(this.buildOutput, {
      matching: [
        '!(node_modules|map)',
        ...preserved.map((preserve: string) => `!${preserve}*`)
      ],
      recursive: false
    });

    removeablePaths.forEach((path: string) => {
      fsJetpack().remove(path);
      successMessage(path, 'Removed');
    });
  }

  /**
   * Copy all static files they needed
   * @private
   */
  private copyFiles(): void {
    const filesForCopy = [
      { from: 'package.json', to: `${this.buildOutput}/package.json` }
    ];

    const staticFolder = env('ATLAS_RETAIL_FOLDER', 'retail');

    const removeablePaths = fsJetpack().find(staticFolder, {
      matching: [
        '!(node_modules|_*|.*|*.example.*)'
      ],
      directories: true,
      recursive: false
    });


    console.log(removeablePaths);
  }
}
