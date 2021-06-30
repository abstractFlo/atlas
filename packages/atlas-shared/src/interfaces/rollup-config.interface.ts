import { Plugin } from 'rollup';

export interface RollupConfigInterface {
  input: string;
  output: RollupConfigOutputInterface;
  external: string[];
  plugins: Plugin[];
  watch?: RollupConfigWatchInterface;
}

export interface RollupConfigOutputInterface {
  file: string;
  format: string;
  preserveModules?: boolean;
  inlineDynamicImports?: boolean;
}

export interface RollupConfigWatchInterface {
  chokidar: boolean;
  clearScreen: boolean;
}
