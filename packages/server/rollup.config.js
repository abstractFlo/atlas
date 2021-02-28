import outDir from '../../scripts/outdir';
import typescript from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';
import builtinModules from 'builtin-modules';
import dts from 'rollup-plugin-dts';

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
      autoExternal({
        builtins: true,
        dependencies: true,
        packagePath: './package.json',
        peerDependencies: true,
      }),
    ],
    external: [
      '@abstractflo/atlas-shared',
      'alt-server',
      'rxjs',
      'rxjs/operators',
      'jscodeshift',
      'discord.js',
      ...builtinModules,
    ],
  },
  {
    input: '../../dist/types/server/src/index.d.ts',
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
      '@abstractflo/atlas-shared',
      '@abraham/reflection',
      ...builtinModules,
    ],
  },
];
