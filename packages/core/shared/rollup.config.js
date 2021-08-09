import baseConfig from '../../../scripts/rollup.config';
import pkg from './package.json';

export default baseConfig({
  external: ['alt-shared', '@abstractflo/atlas-devtools', 'rxjs/operators'],
  pkg,
});
