export type PackageLock = {
  name: string;
  version: string;
  lockfileVersion: number;
  requires: boolean;
  dependencies: Record<string, PackageLockDependency>;
};

export type PackageLockDependency = {
  version: string;
  resolved: string; // npm url
  integrity: string; // SHA
  dev: boolean;
  requires: Record<string, string>;
  dependencies: Record<string, PackageLockDependency>;
};
