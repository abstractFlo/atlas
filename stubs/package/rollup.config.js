import pkg from './package.json';
import pkgRoot from '../../package.json';
import builtinModules from 'builtin-modules';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
      },
    ],
    plugins: [
      typescript(),
    ],
    external: [
      ...builtinModules,
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkgRoot.devDependencies || {}),
      ...Object.keys(pkgRoot.dependencies || {}),
      ...Object.keys(pkgRoot.peerDependencies || {}),
    ],
  },
];
