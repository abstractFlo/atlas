import { GameResourceModel } from '../../models/game-resource.model';
import { fsJetpack, hasFolder, resolvePath } from '../../filesystem';
import { env } from '../../environment';
import { normalize } from '../../string';

export class ResourceManager {

  /**
   * Find all available resources
   */
  public async findAvailableResources(): Promise<GameResourceModel[]> {
    const jetpack = fsJetpack();
    const outDir = env('ATLAS_BUILD_OUTPUT', '');

    return jetpack
        .find('.', { matching: 'atlas-resource.json', files: true, directories: false })
        .map(normalize)
        .filter((resource: string) => this.isGameResource(resource))
        .map((resource: string) => {
          const config = this.readResourceConfig(resource);
          const extracted = resource.split('/');
          extracted.pop();

          const resourcePath = extracted.join('/');

          return new GameResourceModel().cast({
            config: { ...config, name: config.name || resourcePath },
            source: resolvePath([resourcePath]),
            output: resolvePath([outDir, resourcePath]),
            isServer: !!hasFolder(`${resourcePath}/server`),
            isClient: !!hasFolder(`${resourcePath}/client`),
            hasAssets: !!hasFolder(`${resourcePath}/assets`)
          });
        });
  }

  /**
   * Check if resource is a gameresource and relevant for build process
   *
   * @param {string} resource
   * @return {boolean}
   * @private
   */
  private isGameResource(resource: string): boolean {
    return this.readResourceConfig(resource).isGameResource || false;
  }


  /**
   * Read the atlas-resource.json from resource
   * @param {string} resource
   * @return {Record<string, any>}
   * @private
   */
  private readResourceConfig(resource: string): Record<string, any> {
    const jetpack = fsJetpack();
    return jetpack.read(resource, 'json');
  }
}
