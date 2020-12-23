import outDir from '../../scripts/outdir';
import typescript from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';
import builtinModules from 'builtin-modules';
import dts from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: './index.ts',
    output: [
      {
        file: `${outDir}/client/index.js`,
        format: 'esm',
      },
    ],
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
      '@abstractFlo/shared',
      'alt-client',
      'alt-webview',
      'natives',
      ...builtinModules,
    ],
  },
  {
    input: '../../dist/types/client/index.d.ts',
    output: {
      file: `${outDir}/client/index.d.ts`,
      format: 'esm',
    },
    plugins: [
      dts(),
    ],
    external: [
      'alt-client',
      'natives',
      '@abstractFlo/shared',
    ],
  },
];
