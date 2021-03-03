import { RollupConfigInterface } from '../interfaces/rollup-config.interface';
import { Plugin } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { ResourceAnalyzer } from './resource-analyzer';
import typescript from '@rollup/plugin-typescript';
import convertNamedImports from './transform';
import { GameResourceInterface } from '../interfaces/game-resource.interface';
import path from 'path';

export class ConfigBuilder {

  /**
   * Contains if build is production
   *
   * @type {boolean}
   * @private
   */
  private static isProduction: boolean = Boolean(process.env.ATLAS_PRODUCTION) || false;

  /**
   * Create the server config
   *
   * @return {RollupConfigInterface}
   * @param resource
   * @param pkgJson
   * @param buildOutput
   */
  public static serverConfig(resource: string, buildOutput: string, pkgJson: GameResourceInterface): RollupConfigInterface {
    const basePkgJson = ResourceAnalyzer.readPackageJson(process.cwd()) as any;
    const modulesForConvert = [
      'rxjs/operators',
      ...Object.keys(basePkgJson.devDependencies || {}),
      ...Object.keys(basePkgJson.dependencies || {})
    ].filter((name: string) => !name.startsWith('@abstractflo'));

    const convertedImports = pkgJson.convert || [];
    const external = pkgJson.externals || [];


    const plugins: Plugin[] = [
      convertNamedImports([...convertedImports, ...modulesForConvert])
    ];

    external.push('alt-server', ...modulesForConvert);

    return this.baseConfig(
        path.resolve(resource, 'server', 'index.ts'),
        path.resolve(buildOutput, 'resources', pkgJson.name, 'server.js'),
        external,
        plugins
    );

  }

  /**
   * Create the client config
   *
   * @return {RollupConfigInterface}
   * @param resource
   * @param buildOutput
   * @param pkgJson
   */
  public static clientConfig(resource: string, buildOutput: string, pkgJson: GameResourceInterface): RollupConfigInterface {
    const external: string[] = ['alt-client', 'natives'];
    return this.baseConfig(
        path.resolve(resource, 'client', 'index.ts'),
        path.resolve(buildOutput, 'resources', pkgJson.name, 'client.js'),
        external
    );
  }

  /**
   * Config template for server/client side
   *
   * @param {string} input
   * @param {string} output
   * @param {string[]} external
   * @param {Plugin[]} plugins
   * @return {RollupConfigInterface}
   * @private
   */
  private static baseConfig(
      input: string,
      output: string,
      external: string[] = [],
      plugins: Plugin[] = []
  ): RollupConfigInterface {

    if (this.isProduction) {
      plugins.push(terser({
        keep_classnames: true,
        keep_fnames: true,
        output: {
          comments: false
        }
      }));
    }

    return {
      input,
      output: {
        file: output,
        format: 'esm',
        preserveModules: false
      },
      external,
      plugins: [
        nodeResolve({
          dedupe: [
            'alt-server',
            'alt-client',
            'natives',
            '@abstractflo/atlas-server',
            '@abstractflo/atlas-client',
            '@abstractflo/atlas-shared'
          ]
        }),
        typescript(),
        ...plugins
      ],
      watch: {
        chokidar: true,
        clearScreen: true
      }
    };
  }


}
