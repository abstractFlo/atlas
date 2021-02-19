import outDir from '../../scripts/outdir';
import typescript from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';
import builtinModules from 'builtin-modules';
import {convertNamedImports} from '../../scripts/convertNamedImports';
import pkg from './package.json';
import dts from 'rollup-plugin-dts';
import {terser} from 'rollup-plugin-terser';

export default [
  {
    input: './src/index.ts',
    output: outDir.map((oDir) => {

      let path = `${oDir}/server`;

      if (process.env.NODE_ENV === 'production') {
        path = path.replace('/server', '');
      }

      return {
        file: `${path}/index.js`,
        format: 'esm',
      };
    }),
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
      terser({
        keep_classnames: true,
        keep_fnames: true,
        output: {
          comments: false,
        },
      }),
    ],
    external: [
      '@abstractflo/shared',
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
    output: outDir.map((oDir) => {
      let path = `${oDir}/server`;

      if (process.env.NODE_ENV === 'production') {
        path = path.replace('/server', '');
      }
      return {
        file: `${path}/index.d.ts`,
        format: 'esm',
      };
    }),
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
      '@abstractflo/shared',
      '@abraham/reflection',
      ...builtinModules,
    ],
  },
];
