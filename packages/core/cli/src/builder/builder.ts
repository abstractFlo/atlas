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
  copy,
  env,
  errorMessage,
  fsJetpack,
  GameResourceModel,
  getResetScreen,
  handleError,
  isTTY,
  PrepareForCopyInterface,
  readCfg,
  relativeId,
  ResourceCreateConfigInterface,
  stderr,
  successMessage
} from '@abstractflo/atlas-devtools';
import { blueBright, bold, cyan, green, underline, yellow } from 'colorette';
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
   * @param creator
   */
  public async run(): Promise<void> {
    await this.prepare();
    await this.copyResourceAssets(creator.prepareForCopy);

    successMessage('Waiting...', 'Start Bundle');

    this.watch
        ? await this.startWatching(creator.configs)
        : await this.buildAll(creator.configs);
  }

  /**
   *
   * @return {Promise<void>}
   * @private
   */
  public addResourcesToServerCfg(availableResources: GameResourceModel[]): void {
    const addResources = env<string>('ATLAS_AUTO_ADD_RESOURCE', 'false') === 'true';

    if (!addResources) return;

    const pathToServerCfg = fsJetpack().path(env<string>('ATLAS_RETAIL_FOLDER'), 'server.cfg');
    const serverCfg = readCfg(pathToServerCfg);
    const resources = availableResources.map((resource: GameResourceModel) => resource.config.name);

    serverCfg.set('resources', resources);

    fsJetpack().write(pathToServerCfg, serverCfg.serialize());
    successMessage(`${yellow(JSON.stringify(resources))}`, 'Added');
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
    const cleanBeforeBuild = env<string>('ATLAS_CLEAR_BEFORE_BUILD', 'false') !== 'true';

    if (cleanBeforeBuild || !fsJetpack().exists(this.buildOutput)) return;

    const preserved = getDefinedPreserves();
    const removeablePaths = fsJetpack()
        .find(this.buildOutput, {
          matching: preserved.map((path: string) => `!${path}`),
          directories: false

        });

    removeablePaths.forEach((path: string) => {
      fsJetpack().remove(path);
      errorMessage(path, 'Removed');
    });
  }

  /**
   * Copy all static files they needed
   * @private
   */
  private copyFiles(): void {
    const staticFolder = env('ATLAS_RETAIL_FOLDER', 'retail');

    fsJetpack()
        .find(staticFolder, { matching: ['!*.example.*', '!node_modules', '!.*', '!_*'], directories: false })
        .filter((path: string) => !path.includes('\\_'))
        .forEach((path: string) => {
          const buildOutput = fsJetpack().path(this.buildOutput, path.slice(
              env('ATLAS_RETAIL_FOLDER').length + 1
          ));

          copy(path, buildOutput);
          successMessage(blueBright(`${path} -> ${buildOutput}`), 'Copied');
        });

    copy('package.json', `${this.buildOutput}/package.json`);
    successMessage(blueBright(`package.json -> ${this.buildOutput}/package.json`), 'Copied');
  }

  /**
   * Copy all resource assets
   *
   * @return {Promise<void>}
   * @private
   */
  private async copyResourceAssets(filesAndFolders: PrepareForCopyInterface[]): Promise<void> {
    return new Promise((resolve) => {

      filesAndFolders.forEach((item: PrepareForCopyInterface) => {
        copy(item.from, item.to);
        successMessage(blueBright(`${item.from} -> ${item.to}...`), 'Copied');
      });

      resolve();
    });
  }
}
