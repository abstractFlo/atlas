import baseConfig from '../../../scripts/rollup.config';
import pkg from './package.json';

export default baseConfig({
  external: ['alt-client', 'natives', 'alt-shared'],
  pkg,
});
