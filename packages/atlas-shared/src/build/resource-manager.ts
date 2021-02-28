import fs from 'fs-extra';
import * as path from 'path';
import { terser } from 'rollup-plugin-terser';
import { Plugin } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { GameResourceInterface, RollupConfigInterface } from '../interfaces';

//@ts-ignore
import autoExternal from 'rollup-plugin-auto-external';
import convertNamedImports from './transform';
import { config } from 'dotenv';

config();

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

  constructor(resourcePath: string) {
    this.filterAvailableResources(path.resolve(this.__dirname, resourcePath));
  }

  /**
   * Return the rollup config ready to use
   *
   * @returns {any}
   */
  public getConfig(outputPath: string): RollupConfigInterface[] {
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
            path.resolve(`${outputPath}/${pkg.name}/server.js`),
            externals,
            convertedModules
        );

        this.config.push(serverConfig);
      }

      if (hasClientFolder) {
        const clientConfig = this.createClientConfig(
            path.resolve(`${resource}/client/index.ts`),
            path.resolve(`${outputPath}/${pkg.name}/client.js`)
        );

        this.config.push(clientConfig);
      }

    });

    return this.config;
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
      input: string, output: string, external: string[] = [], plugins: Plugin[] = []): RollupConfigInterface {
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
}


