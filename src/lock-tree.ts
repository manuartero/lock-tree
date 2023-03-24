import type { PackageDefinition, PackageLock, RootPackage } from "./types";

type Tree = {
  name: string;
  version: string;
  size: number;
  deduped?: boolean;
  resolved?: string;
  children: Tree[];
};

type Opts = {
  filterDevDependencies?: boolean;
};

/**
 * @example
 *  npmUrl("https://registry.npmjs.org/react/-/react-18.2.0.tgz")
 *  =>
 * "https://registry.npmjs.org/react/18.2.0"
 */
function npmUrl(resolved: string) {
  const regex =
    /^https?:\/\/registry\.npmjs\.org\/([^\/]+)\/-\/\1-(\d+\.\d+\.\d+)\.tgz$/;
  const match = resolved.match(regex);
  if (!match) {
    return undefined;
  }
  const pkgName = match[1];
  const pkgVersion = match[2];
  const newUrl = `https://registry.npmjs.org/${pkgName}/${pkgVersion}`;
  return newUrl;
}

let deduped: string[] = [];

export function asTree(
  lock: PackageLock,
  opts: Opts = { filterDevDependencies: true }
): Tree {
  if (lock.lockfileVersion < 2) {
    throw new Error("lockfileVersion < 2 not supported");
  }

  const root = lock.packages[""] as RootPackage;

  // pro dependencies
  const children = Object.keys(root.dependencies).map((dep) =>
    createTreeFromDependency(
      dep,
      lock.packages as Record<string, PackageDefinition>
    )
  );

  return {
    name: root.name,
    version: root.version,
    size: children.length,
    children,
  };
}

/**
 * createTreeFromDependency('react', { ... })
 */
function createTreeFromDependency(
  dep: string,
  packages: Record<string, PackageDefinition>
): Tree {
  const p = packages[`node_modules/${dep}`];
  if (!p) {
    throw new Error(`${dep}: Package not installed!`);
  }

  if (!p.dependencies || Object.keys(p.dependencies).length === 0) {
    return {
      name: dep,
      version: p.version,
      resolved: npmUrl(p.resolved),
      size: 0,
      children: [],
    };
  }

  const children = Object.keys(p.dependencies).map((dep) => {
    if (deduped.includes(dep)) {
      return {
        name: dep,
        version: p.version,
        size: 0,
        children: [],
        deduped: true,
        resolved: npmUrl(p.resolved),
      };
    }
    deduped.push(dep);
    return createTreeFromDependency(dep, packages);
  });
  return {
    name: dep,
    version: p.version,
    size: children.length,
    resolved: npmUrl(p.resolved),
    children,
  };
}
