import fs from 'fs-extra';
import * as path from 'path';
import { terser } from 'rollup-plugin-terser';
import { Plugin } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import multiEntry from '@rollup/plugin-multi-entry';
import { GameResourceInterface } from '../interfaces/game-resource.interface';
import { RollupConfigInterface } from '../interfaces/rollup-config.interface';
import convertNamedImports from './transform';

export class ResourceManager {

  /**
   * Contains all availableResource
   *
   * @type {string[]}
   */
  protected availableResources: string[] = [];

  /**
   * __dirname fallback for esModule
   *
   * @type {string}
   * @private
   */
  private __dirname: string = path.resolve(process.cwd());

  /**
   * Contains the complete config
   *
   * @type {RollupConfigInterface[]}
   * @private
   */
  private config: RollupConfigInterface[] = [];

  /**
   * Check if production environment
   *
   * @type {boolean}
   * @private
   */
  private readonly isProduction: boolean = process.env.NODE_ENV === 'production';

  /**
   * Contains the path to config folder
   *
   * @type {string}
   * @private
   */
  private readonly configFolderPath: string;

  /**
   * Contains the outputPath for build files
   *
   * @type {string}
   * @private
   */
  private readonly outputPath: string;

  constructor(resourcePath: string, pathToConfigFolder: string = 'config') {
    this.configFolderPath = pathToConfigFolder;
    this.filterAvailableResources(path.resolve(process.cwd(), resourcePath));
  }

  /**
   * Return the rollup config ready to use
   *
   * @returns {any}
   */
  public async getConfig(): Promise<RollupConfigInterface[]> {
    const destination = path.resolve(process.cwd(), process.env.ATLAS_BUILD_OUTPUT || 'dist');

    await this.cleanUpAndCopyStatics();

    this.availableResources.forEach((resource: string) => {
      const pkg = this.readPackageJson(resource);

      if (!pkg.isGameResource) return;

      const hasServerFolder = this.hasFolder(resource, 'server');
      const hasClientFolder = this.hasFolder(resource, 'client');

      if (hasServerFolder) {
        const externals = pkg.externals || [];
        const convertedModules = pkg.convert || [];

        const serverConfig = this.createServerConfig(
            path.resolve(`${resource}/server/index.ts`),
            path.resolve(`${destination}/resources/${pkg.name}/server.js`),
            externals,
            convertedModules
        );

        this.config.push(serverConfig);
      }

      if (hasClientFolder) {
        const clientConfig = this.createClientConfig(
            path.resolve(`${resource}/client/index.ts`),
            path.resolve(`${destination}/resources/${pkg.name}/client.js`)
        );

        this.config.push(clientConfig);
      }
    });

    const configFolderConfig = this.createConfigFolderConfig(`${destination}/config.js`);
    this.config.push(configFolderConfig);

    return this.config;
  }

  /**
   * Cleanup and copy statics
   *
   * @return {Promise<void>}
   */
  public async cleanUpAndCopyStatics(): Promise<void> {
    const cwd = process.cwd();
    const destination = path.resolve(cwd, process.env.ATLAS_BUILD_OUTPUT || 'dist');
    const retailFolder = path.resolve(cwd, process.env.ATLAS_RETAIL_FOLDER || 'retail');
    const packageJsonPath = path.resolve(cwd, 'package.json');
    const filesAndFolders = await fs.readdir(retailFolder);

    await fs.emptyDir(destination);
    console.log(`Cleanup ${destination}`);

    for (const content of filesAndFolders.filter((c => !c.startsWith('.') && !c.startsWith('_')))) {
      const contentFolderPath = path.resolve(retailFolder, content);
      const destinationFolderPath = path.resolve(destination, content);
      await fs.copy(contentFolderPath, destinationFolderPath);
      console.log(`Successfully copied ${contentFolderPath} => ${destinationFolderPath}`);
    }

    await fs.copy(packageJsonPath, path.resolve(destination, 'package.json'));
    console.log(`Successfully copied ${packageJsonPath} => ${path.resolve(destination, 'package.json')}`);

  }

  /**
   * Create the server side rollup config
   *
   * @param {string} input
   * @param {string} output
   * @param {string[]} external
   * @param convertedImports
   * @returns {RollupConfigInterface}
   */
  public createServerConfig(
      input: string,
      output: string,
      external: string[] = [],
      convertedImports: string[] = []
  ): RollupConfigInterface {

    const pkg = this.readPackageJson(process.cwd()) as any;
    const modulesForConvert = [
      'rxjs/operators',
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.dependencies || {})
    ].filter(name => !name.startsWith('@abstractflo'));

    const plugins = [
      nodeResolve(),
      typescript(),
      convertNamedImports(['rxjs/operators', ...convertedImports, ...modulesForConvert])
    ];

    external.push('alt-server', ...modulesForConvert);

    return this.createRollupConfig(input, output, external, plugins);
  }

  /**
   * Create client side rollup config
   *
   * @param {string} input
   * @param {string} output
   * @returns {RollupConfigInterface}
   */
  public createClientConfig(
      input: string,
      output: string
  ): RollupConfigInterface {

    let plugins = [nodeResolve(), typescript()];

    const external = ['alt-client', 'natives'];

    return this.createRollupConfig(input, output, external, plugins);
  }

  /**
   * Return the package.json for given resource
   *
   * @param {string} resource
   * @returns {GameResourceInterface}
   * @private
   */
  private readPackageJson(resource: string): GameResourceInterface {
    return fs.readJSONSync(`${resource}/package.json`);
  }

  /**
   * Filter all resource they have an package.json file
   *
   * @private
   */
  private filterAvailableResources(resourcePath: string): void {
    this.availableResources = this.getResourceFolders(resourcePath).filter(
        (folder: string) => fs.existsSync(`${folder}/package.json`)
    );
  }

  /**
   * Return all folders for given resourcePath
   *
   * @param {string} resourcePath
   * @returns {string[]}
   * @private
   */
  private getResourceFolders(resourcePath: string): string[] {
    return fs.readdirSync(resourcePath)
        .map((resource: string) =>
            path.resolve(resourcePath, resource)
        );
  }

  /**
   * Create the base rollup config for both sides
   *
   * @param {string} input
   * @param {string} output
   * @param {string[]} external
   * @param {Plugin[]} plugins
   * @returns {RollupConfigInterface}
   * @private
   */
  private createRollupConfig(
      input: string, output: string, external: string[] = [], plugins: Plugin[] = []
  ): RollupConfigInterface {
    const nodeResolveModules = nodeResolve({
      dedupe: [
        'alt-server',
        'alt-client',
        'native',
        '@abraham/reflection',
        'reflect-metadata',
        '@abstractflo/atlas-shared',
        '@abstractflo/atlas-server',
        '@abstractflo/atlas-client'
      ]
    });

    plugins.push(nodeResolveModules);


    if (this.isProduction) {
      const terserPlugin = terser({
        keep_classnames: true,
        keep_fnames: true,
        output: {
          comments: false
        }
      });
      plugins.push(terserPlugin);
    }

    return {
      input,
      output: {
        file: output,
        format: 'esm',
        preserveModules: false
      },
      external,
      plugins,
      watch: {
        chokidar: true,
        clearScreen: true
      }
    };
  }

  /**
   * Check if given folder exists in given resource
   *
   * @param {string} resource
   * @param {string} folderName
   * @returns {boolean}
   * @private
   */
  private hasFolder(resource: string, folderName: string): boolean {
    return fs.existsSync(`${resource}/${folderName}`);
  }

  /**
   * Create Rollup Config for config files
   *
   * @param {string} output
   * @return {{output: {file: string, format: string}, input: string, external: string[], plugins: any[]}}
   * @private
   */
  private createConfigFolderConfig(output: string): RollupConfigInterface {
    const plugins = [];

    if (this.isProduction) {
      const terserPlugin = terser({
        keep_classnames: true,
        keep_fnames: true,
        output: {
          comments: false
        }
      });
      plugins.push(terserPlugin);
    }

    plugins.push(multiEntry({
      entryFileName: 'config.js'
    }));

    return {
      input: `${this.configFolderPath}/**/*.ts`,
      output: {
        file: output,
        format: 'esm'
      },
      plugins,
      external: ['@abstractflo/atlas-server/helpers']
    };
  }
}


