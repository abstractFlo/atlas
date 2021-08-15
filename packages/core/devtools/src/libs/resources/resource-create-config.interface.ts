import { RollupOptions } from 'rollup';

export interface ResourceCreateConfigInterface {
  configs: RollupOptions[];
  prepareForCopy: PrepareForCopyInterface[];
}

export interface PrepareForCopyInterface {
  from: string;
  to: string;
}
