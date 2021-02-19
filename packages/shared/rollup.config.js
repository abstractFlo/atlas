import outDir from '../../scripts/outdir';
import typescript from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';
import builtinModules from 'builtin-modules';
import dts from 'rollup-plugin-dts';
import {terser} from 'rollup-plugin-terser';

export default [
  {
    input: './index.ts',
    output: outDir.map((oDir) => (
        {
          file: `${oDir}/shared/index.js`,
          format: 'esm',
        }
    )),
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
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
      'sjcl',
      'rxjs/operators',
      ...builtinModules,
    ],
  },
  {
    input: '../../dist/types/shared/index.d.ts',
    output: outDir.map((oDir) => (
        {
          file: `${oDir}/shared/index.d.ts`,
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
      'tsyringe/dist/typings/types',
      '@abstractFlo/shared',
      ...builtinModules,
    ],
  },
];
