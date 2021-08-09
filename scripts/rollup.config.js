import ts from 'rollup-plugin-typescript2';
import builtinModules from 'builtin-modules';
import path from 'path';

import pkgRoot from '../package.json';

let hasTSChecked = false;

const createRollupConfig = (options) => {
  if (!Reflect.has(options, 'output')) options.output = {
    esm: {
      file: options.pkg.module,
      format: `es`,
    },
    cjs: {
      file: options.pkg.main,
      format: `cjs`,
    },
  };

  const packageFormats = Object.keys(options.output);

  return packageFormats.map(
      (format) => createConfig(options, options.output[format]));
};

function createConfig(options, output) {
  if (!Reflect.has(options, 'input')) options.input = 'src/index.ts';
  if (!Reflect.has(options, 'external')) options.external = [];
  if (!Reflect.has(options, 'plugins')) options.plugins = [];
  if (!Reflect.has(options, 'pkg')) options.pkg = {};

  const {input, external, plugins, pkg} = options;

  const shouldEmitDeclarations = !hasTSChecked;

  const tsPlugin = ts({
    check: !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
      },
    },
  });

  hasTSChecked = true;

  external.push(
      ...builtinModules,
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkgRoot.devDependencies || {}),
      ...Object.keys(pkgRoot.dependencies || {}),
      ...Object.keys(pkgRoot.peerDependencies || {}),
  );

  return {
    input,
    external,
    plugins: [tsPlugin, ...plugins],
    output,
  };
}

export default createRollupConfig;
