import outDir from '../../scripts/outdir';
import typescript from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';
import builtinModules from 'builtin-modules';
import {convertNamedImports} from '../../scripts/convertNamedImports';
import pkg from './package.json';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: './index.ts',
    output: outDir.map((oDir) => (
        {
          file: `${oDir}/server/index.js`,
          format: 'esm',
        }
    )),
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
      }),
      convertNamedImports({
        modules: [
          ...Object.keys(pkg.dependencies),
          ...Object.keys(pkg.devDependencies),
        ],
      }),
      autoExternal({
        builtins: true,
        dependencies: true,
        packagePath: './package.json',
        peerDependencies: true,
      }),
    ],
    external: [
      '@abstractFlo/shared',
      'alt-server',
      'rxjs',
      'rxjs/operators',
      'jscodeshift',
      'discord.js',
      ...builtinModules,
    ],
  },
  {
    input: '../../dist/types/server/index.d.ts',
    output: outDir.map((oDir) => (
        {
          file: `${oDir}/server/index.d.ts`,
          format: 'esm',
        }
    )),
    plugins: [
      dts(),
      autoExternal({
        builtins: true,
        dependencies: true,
        packagePath: './package.json',
        peerDependencies: true,
      }),
    ],
    external: [
      'alt-server',
      '@abstractFlo/shared',
      '@abraham/reflection',
      ...builtinModules,
    ],
  },
];
