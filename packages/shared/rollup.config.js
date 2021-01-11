import outDir from '../../scripts/outdir';
import typescript from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';
import builtinModules from 'builtin-modules';
import dts from 'rollup-plugin-dts';

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
    ],
    external: [
      'sjcl',
      'rxjs/operators',
      ...builtinModules,
    ],
  },
  {
    input: './registry.ts',
    output: outDir.map((oDir) => (
        {
          file: `${oDir}/shared/registry.js`,
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
    ],
    external: [...builtinModules],
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
    ],
    external: [
      ...builtinModules,
    ],
  },
];
