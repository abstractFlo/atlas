import typescript from 'rollup-plugin-typescript2';

export default {
  input: ['src/index.ts', 'src/helpers.ts', 'src/build/resource-manager.ts'],
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    typescript(),
  ],
  external: [],
};
