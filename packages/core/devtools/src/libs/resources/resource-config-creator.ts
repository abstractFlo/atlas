import { GameResourceModel } from '../../models/game-resource.model';
import { Plugin, RollupOptions } from 'rollup';
import { ResourceConfigModel } from '../../models/resource-config.model';
import { unique } from '../../array';
import { fsJetpack, resolvePath } from '../../filesystem';
import convertNamedImports from '../../transformers/convertNamedImports';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import swc from 'rollup-plugin-swc';
import { env } from '../../environment';

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
    const base = new ResourceConfigModel().cast({
      input: config.input,
      output: config.output,
      plugins: [
        json(),
        nodeResolve(),
        swc({
          jsc: {
            parser: {
              syntax: 'typescript',
              dynamicImport: true,
              decorators: true
            },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true
            },
            loose: true,
            target: 'es2020',
            keepClassNames: true
          },
          minify: env<boolean>('atlasProduction', false)
        })
      ]
    });

    base.plugins = unique<Plugin>([...base.plugins, ...config.plugins]);
    base.external = unique<string>([...base.external, ...config.external]);

    return base;
  }

  /**
   * Return the final configs
   *
   * @return {RollupOptions[]}
   */
  public getConfigs(): RollupOptions[] {
    const configs = [];

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
        // Get all files for copy
        // Don't copy directly
      }

    });

    return configs;
  }

  /**
   * Generate the config for server files
   *
   * @param {GameResourceModel} resource
   * @return {RollupOptions}
   * @private
   */
  private createServerConfig(resource: GameResourceModel): RollupOptions {
    const modulesForConvert = [
      '@abraham/reflection',
      'dotenv',
      'fs-extra',
      'tsyringe',
      'rxjs',
      'rxjs/operators',
      ...Object.keys(this.pkgJson.dependencies || {}),
      ...Object.keys(this.pkgJson.devDependencies || {})
    ];

    const config = new ResourceConfigModel().cast({
      input: resolvePath([resource.source, 'server', 'index.ts']),
      output: {
        file: resolvePath([resource.output, 'server.js'])
      },
      plugins: [
        convertNamedImports(
            [
              ...resource.config.convert,
              ...modulesForConvert.filter((m => !m.startsWith('@abstractflo')))
            ],
            resource.config
        )
      ],
      external: ['alt-server', ...modulesForConvert]
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
