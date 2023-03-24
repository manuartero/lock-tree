export type PackageLock = {
  name: string;
  version: string;
  lockfileVersion: number;
  packages: {
    [key: string]: RootPackage | PackageDefinition;
  };
  dependencies: Record<string, PackageLockDependency>;
};

export type RootPackage = {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  engines: Record<string, string>;
};

export type PackageDefinition = {
  version: string;
  resolved: string; // npm url
  integrity: string; // SHA
  dev?: boolean; // true if dev dependency
  dependencies?: Record<string, string>;
  engines?: Record<string, string>;
};

export type PackageLockDependency = {
  version: string;
  resolved: string; // npm url
  integrity: string; // SHA
  dev?: boolean; // true if dev dependency
  requires?: Record<string, string>;
  dependencies?: Record<string, PackageLockDependency>;
};
