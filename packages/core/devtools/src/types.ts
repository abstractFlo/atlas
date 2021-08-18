export interface PackageJson {
  name: string;
  version: string;
  'atlas-plugin': boolean;

  devDependencies: PackageJsonDep,
  dependencies: PackageJsonDep,

  hooks?: PackageJsonAtlasHooks
}

export type PackageJsonDep = Record<string, string>;

export interface PackageJsonAtlasHooks {
  postinstall?: string;
  preinstall?: string;
  postupdate?: string;
  preupdate?: string;
}
