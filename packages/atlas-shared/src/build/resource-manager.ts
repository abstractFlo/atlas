import path from 'path';
import fs from 'fs-extra';
import { config } from 'dotenv';
import { ResourceAnalyzer } from './resource-analyzer';
import { RollupConfigInterface } from '../interfaces/rollup-config.interface';
import { ConfigBuilder } from './config-builder';
import { GameResourceInterface } from '../interfaces/game-resource.interface';

config();

export class ResourceManager {

  /**
   * Rollup Configs Array
   * @type {RollupConfigInterface[]}
   */
  public configs: RollupConfigInterface[] = [];

  /**
   * Current working dir
   * @type {string}
   * @private
   */
  private cwd: string = process.cwd();

  /**
   * Path to buildOutput
   *
   * @type {string}
   * @private
   */
  private buildOutput: string = path.resolve(this.cwd, process.env.ATLAS_BUILD_OUTPUT || 'dist');

  /**
   * Path to retail folder
   *
   * @type {string}
   * @private
   */
  private retailFolder: string = path.resolve(this.cwd, process.env.ATLAS_RETAIL_FOLDER || 'retail');

  /**
   * Path to resource folder
   *
   * @type {string}
   * @private
   */
  private resourceFolder: string = path.resolve(this.cwd, process.env.ATLAS_RESOURCE_FOLDER || 'resources');

  private preserveFilesAndFolders: string[] = [
    'altv-server.exe',
    'altv-server',
    '.env',
    'start.sh',
    'cache',
    'data',
    'modules',
    'node_modules',
    'package-lock.json',
    'server.log',
    '.docker',
    'docker-data',
    'resources',
    'docker-compose'
  ];

  /**
   * Return the final config
   *
   * @return {RollupConfigInterface[]}
   */
  public getConfigs(): RollupConfigInterface[] {
    this.cleanup();
    this.createConfigs();
    this.copyRetail();
    this.copyPackageJson();

    return this.configs;
  }

  /**
   * Create all needed config objects for each valid resource
   *
   * @private
   */
  private createConfigs() {
    try {

      const availableResources = ResourceAnalyzer.getValidResources(this.resourceFolder);

      availableResources.forEach((resource: string) => {
        const pkgJson = ResourceAnalyzer.readPackageJson(resource);

        if (!pkgJson.isGameResource) return;

        if (ResourceAnalyzer.hasFolder(resource, 'server')) {
          this.configs.push(ConfigBuilder.serverConfig(resource, this.buildOutput, pkgJson));
        }

        if (ResourceAnalyzer.hasFolder(resource, 'client')) {
          this.configs.push(ConfigBuilder.clientConfig(resource, this.buildOutput, pkgJson));
        }

        if (ResourceAnalyzer.hasFolder(resource, 'assets')) {
          this.copyAssets(resource, pkgJson);
        }
      });

    } catch (e) {
      console.error('There are no resources for given folder');
      console.error(this.resourceFolder);
      throw new Error(e);
    }
  }

  /**
   * Copy assets to destination dir
   *
   * @param {string} resource
   * @param {GameResourceInterface} pkgJson
   * @private
   */
  private copyAssets(resource: string, pkgJson: GameResourceInterface): void {
    const destinationPath = path.resolve(this.buildOutput, 'resources', pkgJson.name);
    const assetsPath = ResourceAnalyzer.pathToFolderInResource(resource, 'assets');

    this.copyFilesSecure(assetsPath, destinationPath);
  }

  /**
   * Copy the retail folder to build output
   *
   * @private
   */
  private copyRetail(): void {
    const retailFilesAndFolders = ResourceAnalyzer.getOnlyVisibleFoldersAndFiles(this.retailFolder);

    retailFilesAndFolders.forEach((fileOrFolderPath) => {
      const filename = path.basename(fileOrFolderPath);
      this.copyFilesSecure(fileOrFolderPath, path.resolve(this.buildOutput, filename));
    });
  }

  /**
   * Copy files from given path to destination and check before if destination exists
   *
   * @param {string} srcPath
   * @param {string} destinationPath
   * @private
   */
  private copyFilesSecure(srcPath: string, destinationPath: string) {
    const stats = fs.lstatSync(srcPath);

    if (stats.isFile()) {
      fs.ensureFileSync(destinationPath);
    }

    if (stats.isDirectory()) {
      fs.ensureDirSync(destinationPath);
    }

    fs.copySync(srcPath, destinationPath);

    console.log(`Successfully copied ${srcPath} => ${destinationPath}`);
  }

  /**
   * Copy the package json to build output
   *
   * @private
   */
  private copyPackageJson(): void {
    const filename = 'package.json';
    this.copyFilesSecure(path.resolve(this.cwd, filename), path.resolve(this.buildOutput, filename));
  }

  /**
   * Clean up the build output
   *
   * @private
   */
  private cleanup(): void {
    const cleanUpNeeded = process.env.ATLAS_CLEAR_BEFORE_BUILD === 'true';

    if (!cleanUpNeeded || !fs.pathExistsSync(this.buildOutput)) return;

    const hasDefinedPreserve = process.env.ATLAS_CLEAR_PRESERVE && process.env.ATLAS_CLEAR_PRESERVE !== 'null';

    if (hasDefinedPreserve) {
      const preservedFilesAndFolders = process.env.ATLAS_CLEAR_PRESERVE.split(',');
      this.preserveFilesAndFolders.push(...preservedFilesAndFolders);
    }

    const filterFiles = (file: string) => !this.preserveFilesAndFolders.find((wFile: string) => wFile.startsWith(file));
    const files = fs
        .readdirSync(this.buildOutput)
        .filter((file: string) => filterFiles(file))
        .map((file: string) => path.resolve(this.buildOutput, file));

    files.forEach((file: string) => {
      fs.removeSync(file);
    });

    if (fs.pathExistsSync(path.resolve(this.buildOutput, 'resources'))) {
      fs.emptyDirSync(path.resolve(this.buildOutput, 'resources'));
    }

    console.log(`Cleanup ${this.buildOutput}`);
  }
}


