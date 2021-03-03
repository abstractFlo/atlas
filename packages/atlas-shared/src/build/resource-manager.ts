import path from 'path';
import fs from 'fs-extra';
import { config } from 'dotenv';
import { ResourceAnalyzer } from './resource-analyzer';
import { RollupConfigInterface } from '../interfaces/rollup-config.interface';
import { ConfigBuilder } from './config-builder';
import { GameResourceInterface } from '../interfaces/game-resource.interface';

config();

export class ResourceManager {

  public config: RollupConfigInterface[] = [];
  private cwd: string = process.cwd();
  private buildOutput: string = path.resolve(this.cwd, process.env.ATLAS_BUILD_OUPUT || 'dist');
  private retailFolder: string = path.resolve(this.cwd, process.env.ATLAS_RETAIL_FOLDER || 'retail');
  private resourceFolder: string = path.resolve(this.cwd, process.env.ATLAS_RESOURCE_FOLDER || 'resources');
  private configFolder: string = path.resolve(this.cwd, process.env.ATLAS_CONFIG_FOLDER || 'config');
  private serverConfigPath: string = path.resolve(this.cwd, process.env.ATLAS_SERVER_CFG_PATH || 'docker-data');

  constructor() {}

  /**
   * Return the final config
   *
   * @return {RollupConfigInterface[]}
   */
  public getConfig(): RollupConfigInterface[] {
    this.cleanup();
    this.createConfigs();
    this.copyRetail();
    this.copyPackageJson();
    this.copyServerConfig();

    return this.config;
  }

  private createConfigs() {
    try {

      const availableResources = ResourceAnalyzer.getValidResources(this.resourceFolder);

      availableResources.forEach((resource: string) => {
        const pkgJson = ResourceAnalyzer.readPackageJson(resource);

        if (!pkgJson.isGameResource) return;

        if (ResourceAnalyzer.hasFolder(resource, 'server')) {
          this.config.push(ConfigBuilder.serverConfig(resource, this.buildOutput, pkgJson));
        }

        if (ResourceAnalyzer.hasFolder(resource, 'client')) {
          this.config.push(ConfigBuilder.clientConfig(resource, this.buildOutput, pkgJson));
        }

        if (ResourceAnalyzer.hasFolder(resource, 'assets')) {
          this.copyAssets(resource, pkgJson);
        }
      });

    } catch (e) {
      console.error('There are no resources for given folder');
      console.error(this.resourceFolder);
      console.error(e);
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
   * Copy the server.cfg to build output
   *
   * @private
   */
  private copyServerConfig(): void {
    const filename = 'server.cfg';
    this.copyFilesSecure(path.resolve(this.serverConfigPath, filename), path.resolve(this.buildOutput, filename));
  }

  /**
   * Clean up the build output
   *
   * @private
   */
  private cleanup(): void {
    fs.emptyDirSync(this.buildOutput);
    console.log(`Cleanup ${this.buildOutput}`);
  }
}


