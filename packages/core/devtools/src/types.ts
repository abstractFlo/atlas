export interface PackageJson {
  name: string;
  version: string;

  devDependencies: PackageJsonDep,
  dependencies: PackageJsonDep,

  atlas: PackageJsonAtlas
}

export type PackageJsonDep = Record<string, string>;

/**
 * Define atlas keywords
 */
export interface PackageJsonAtlas {
  postinstall?: string;
  preinstall?: string;
  postupdate?: string;
  preupdate?: string;
  cli?: string;
}
