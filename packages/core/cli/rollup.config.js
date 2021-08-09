import baseConfig from '../../../scripts/rollup.config';
import pkg from './package.json';

const outputConfigs = {
  cjs: {
    file: pkg.main,
    format: `cjs`,
  },
};

export default baseConfig({
  input: 'src/atlas-cli.ts',
  output: outputConfigs,
  external: ['yargs/helpers', '@abstractflo/atlas-devtools'],
  pkg,
});
