import outDir from '../../scripts/outdir';
import typescript from 'rollup-plugin-typescript2';
import builtinModules from 'builtin-modules';
import dts from 'rollup-plugin-dts';
import autoExternal from 'rollup-plugin-auto-external';
import pkg from './package.json';

export default [
  {
    input: './src/index.ts',
    output: outDir.map((oDir) => {

      let path = `${oDir}/shared`;

      if (process.env.NODE_ENV === 'production') {
        path = path.replace('/shared', '');
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
      autoExternal({
        builtins: true,
        dependencies: true,
        packagePath: './package.json',
        peerDependencies: true,
      }),
    ],
    external: [
      'sjcl',
      'rxjs/operators',
      ...builtinModules,
      ...Object.keys(pkg.devDependencies),
    ],
  },
  {
    input: '../../dist/types/shared/src/index.d.ts',
    output: outDir.map((oDir) => {
      let path = `${oDir}/shared`;

      if (process.env.NODE_ENV === 'production') {
        path = path.replace('/shared', '');
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
      'tsyringe/dist/typings/types',
      'rollup',
      ...builtinModules,
      ...Object.keys(pkg.devDependencies),
    ],
  },
];
