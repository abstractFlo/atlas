import pkg from './package.json';
import pkgRoot from '../../../package.json';
import builtinModules from 'builtin-modules';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/atlas-cli.ts',
    output: [
      {
        file: 'dist/atlas-cli.js',
        format: 'cjs',
        banner: '#!/usr/bin/env node \n',
      },
    ],
    plugins: [
      typescript(),
    ],
    external: [
      'yargs/helpers',
      '@abstractflo/atlas-devtools',
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
