import outDir from '../../scripts/outdir';
import typescript from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';
import builtinModules from 'builtin-modules';
import dts from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: './src/index.ts',
    output: outDir.map((oDir) => {

      let path = `${oDir}/client`;

      if (process.env.NODE_ENV === 'production') {
        path = path.replace('/client', '');
      }

      return {
        file: `${path}/index.js`,
        format: 'esm',
      };
    }),
    plugins: [
      nodeResolve(),
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
      '@abstractflo/atlas-shared',
      'alt-client',
      'alt-webview',
      'natives',
      ...builtinModules,
    ],
  },
  {
    input: '../../dist/types/client/src/index.d.ts',
    output: outDir.map((oDir) => {
      let path = `${oDir}/client`;

      if (process.env.NODE_ENV === 'production') {
        path = path.replace('/client', '');
      }
      return {
        file: `${path}/index.d.ts`,
        format: 'esm',
      };
    }),
    plugins: [
      dts(),
    ],
    external: [
      'alt-client',
      'natives',
      '@abstractflo/atlas-shared',
      '@abraham/reflection',
    ],
  },
];
