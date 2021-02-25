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
      ...builtinModules,
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  {
    input: ['src/build/resource-manager.ts'],
    output: {
      file: 'resource-manager.js',
      format: 'esm',
    },
    plugins: [
      typescript(),
    ],
    external: [
      ...builtinModules,
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
];
