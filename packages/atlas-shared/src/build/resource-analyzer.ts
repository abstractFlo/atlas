import { GameResourceInterface } from '../interfaces/game-resource.interface';
import fs from 'fs-extra';
import path from 'path';

export class ResourceAnalyzer {
  /**
   * Read the package.json for given resource path
   * @param {string} resourcePath
   * @return {Promise<GameResourceInterface>}
   */
  public static readPackageJson(resourcePath: string): GameResourceInterface | undefined {
    return fs.readJSONSync(`${resourcePath}/package.json`) || undefined;
  }

  /**
   * Return all valid resources
   *
   * A valid resource has a package.json
   *
   * @param {string} resourcePath
   * @return {Promise<string[]>}
   */
  public static getValidResources(resourcePath: string): string[] {
    const resources = this.getResourceFolders(resourcePath);
    return resources.filter((folder: string) => fs.pathExistsSync(`${folder}/package.json`));
  }

  /**
   * Check if folder exists in given resource
   *
   * @param {string} resource
   * @param {string} folderName
   * @return {Promise<boolean>}
   */
  public static hasFolder(resource: string, folderName: string): boolean {
    return fs.pathExistsSync(`${resource}/${folderName}`);
  }

  /**
   * Return a path to a folder inside given resource
   *
   * @param {string} resource
   * @param {string} folder
   * @return {string}
   */
  public static pathToFolderInResource(resource: string, folder: string): string {
    return path.resolve(resource, folder);
  }

  /**
   * Return only visible folder and files from given path
   *
   * @param {string} srcPath
   * @return {string[]}
   */
  public static getOnlyVisibleFoldersAndFiles(srcPath: string): string[] {
    const filesAndFolders = fs.readdirSync(srcPath);

    return filesAndFolders
      .filter((target) => !target.startsWith('.') && !target.startsWith('_') && !target.includes('.example.'))
      .map((target: string) => path.resolve(srcPath, target));
  }

  /**
   * Return all resources from given path
   *
   * @param {string} resourcePath
   * @return {Promise<string[]>}
   * @private
   */
  private static getResourceFolders(resourcePath: string): string[] {
    const filesAndFolders = fs.readdirSync(resourcePath);
    return filesAndFolders.map((resource: string) => path.resolve(resourcePath, resource));
  }
}
