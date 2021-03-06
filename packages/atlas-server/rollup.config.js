import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import builtinModules from 'builtin-modules';

export default [
  {
    input: ['src/index.ts'],
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [
      typescript(),
    ],
    external: [
      'alt-server',
      'rxjs/operators',
      ...builtinModules,
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },

  {
    input: ['src/helpers.ts'],
    output: {
      dir: './',
      format: 'esm',
    },
    plugins: [
      typescript(),
    ],
    external: [
      'alt-server',
      'rxjs/operators',
      ...builtinModules,
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
];
