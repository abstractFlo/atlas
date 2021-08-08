import ts from 'rollup-plugin-typescript2';
import builtinModules from 'builtin-modules';
import path from 'path';

import pkg from './package.json';
import pkgRoot from '../../../package.json';

let hasTSChecked = false;

const outputConfigs = {
  cjs: {
    file: pkg.main,
    format: `cjs`,
  },
};

const allFormats = Object.keys(outputConfigs);
const packageFormats = allFormats;
const packageConfigs = packageFormats.map((format) => createConfig(outputConfigs[format]));

export default packageConfigs;

function createConfig(output) {
  output.sourcemap = !!process.env.SOURCE_MAP;
  output.externalLiveBindings = false;
  output.banner = '#!/usr/bin/env node \n';

  const shouldEmitDeclarations = !hasTSChecked;

  const tsPlugin = ts({
    check: !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
      },
    },
  });

  hasTSChecked = true;

  const external = [
    'yargs/helpers',
    '@abstractflo/atlas-devtools',
    ...builtinModules,
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkgRoot.devDependencies || {}),
    ...Object.keys(pkgRoot.dependencies || {}),
    ...Object.keys(pkgRoot.peerDependencies || {}),
  ];

  return {
    input: `src/atlas-cli.ts`,
    external,
    plugins: [tsPlugin],
    output,
  };
}
