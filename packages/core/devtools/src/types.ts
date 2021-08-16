export interface PackageJson {
  name: string;
  version: string;
  'atlas-plugin': boolean;

  devDependencies: PackageJsonDep,
  dependencies: PackageJsonDep,
}

export type PackageJsonDep = Record<string, string>;
