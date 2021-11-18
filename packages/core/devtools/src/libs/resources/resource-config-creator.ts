import { GameResourceModel } from '../../models/game-resource.model';
import { Plugin, RollupOptions } from 'rollup';
import { ResourceConfigModel } from '../../models/resource-config.model';
import { unique } from '../../array';
import { fsJetpack, resolvePath } from '../../filesystem';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import { ResourceCreateConfigInterface } from './resource-create-config.interface';
import typescript from '@rollup/plugin-typescript';
import { isProduction } from '../../environment';
import { terser } from 'rollup-plugin-terser';

export class ResourceConfigCreator {

  /**
   * Contains all resources
   *
   * @type {GameResourceModel[]}
   * @private
   */
  private readonly resources: GameResourceModel[] = [];

  /**
   * Contains the root package json
   * @type {any}
   * @private
   */
  private pkgJson = fsJetpack().read('package.json', 'json');

  constructor(resources: GameResourceModel[]) {
    this.resources = resources;
  }

  /**
   * Create a base config for rollup
   *
   * @param {ResourceConfigModel} config
   * @return {RollupOptions}
   */
  public createConfig(config: ResourceConfigModel): RollupOptions {

    const plugins = [
      json(),
      nodeResolve(),
      typescript()
    ];

    if (isProduction) {
      plugins.push(terser({
        keep_classnames: true,
        keep_fnames: true,
        output: {
          comments: false
        }
      }));
    }

    const base = new ResourceConfigModel().cast({
      input: config.input,
      output: config.output,
      plugins
    });

    base.plugins = unique<Plugin>([...base.plugins, ...config.plugins]);
    base.external = unique<string>([...base.external, ...config.external]);

    return base;
  }

  /**
   * Return the final configs and copy sources
   *
   * @return {{configs: RollupOptions[], prepareForCopy: {from: string, to: string}[]}}
   */
  public getConfigs(): ResourceCreateConfigInterface {
    const configs = [];
    const prepareForCopy: { from: string, to: string }[] = [];

    this.resources.forEach((resource: GameResourceModel) => {
      if (resource.isServer) {
        const config = this.createServerConfig(resource);
        configs.push(config);
      }

      if (resource.isClient) {
        const config = this.createClientConfig(resource);
        configs.push(config);
      }

      if (resource.hasAssets) {
        prepareForCopy.push({
          from: fsJetpack().path(resource.source, 'assets'),
          to: resource.output
        });
      }

    });

    return { configs, prepareForCopy };
  }

  /**
   * Generate the config for server files
   *
   * @param {GameResourceModel} resource
   * @return {RollupOptions}
   * @private
   */
  private createServerConfig(resource: GameResourceModel): RollupOptions {
    const localInstalledPackages = [
      ...Object.keys(this.pkgJson.dependencies || {}),
      ...Object.keys(this.pkgJson.devDependencies || {})
    ];

    const modulesForConvert = [
      '@abraham/reflection',
      'dotenv',
      'fs-extra',
      'tsyringe',
      'rxjs',
      'rxjs/operators'
    ];


    const config = new ResourceConfigModel().cast({
      input: resolvePath([resource.source, 'server', 'index.ts']),
      output: {
        file: resolvePath([resource.output, 'server.js'])
      },
      plugins: [],
      external: ['alt-server', ...modulesForConvert, ...localInstalledPackages]
    });

    return this.createConfig(config);
  }

  /**
   * Generate the config for client files
   *
   * @param {GameResourceModel} resource
   * @return {RollupOptions}
   * @private
   */
  private createClientConfig(resource: GameResourceModel): RollupOptions {
    const config = new ResourceConfigModel().cast({
      input: resolvePath([resource.source, 'client', 'index.ts']),
      output: {
        file: resolvePath([resource.output, 'client.js'])
      },
      plugins: [],
      external: ['alt-client', 'natives']
    });

    return this.createConfig(config);
  }
}
