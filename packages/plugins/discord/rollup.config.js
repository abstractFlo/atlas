import baseConfig from '../../../scripts/rollup.config';
import pkg from './package.json';

const outputConfigs = {
  esm: {
    file: pkg.module,
    format: `es`,
  },
  cjs: {
    file: pkg.main,
    format: `cjs`,
  },
};

export default baseConfig({
  output: outputConfigs,
  external: ['alt-server'],
  pkg,
});
