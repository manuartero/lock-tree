import type { PackageLock, PackageLockDependency } from "./types";

type Tree = {
  name: string;
  size?: number;
  children: Tree[];
};

type Opts = {
  filterDevDependencies?: boolean;
};

export function asTree(
  lock: PackageLock,
  opts: Opts = { filterDevDependencies: true }
): Tree {
  if (lock.lockfileVersion < 2) {
    throw new Error("lockfileVersion < 2 not supported");
  }
  console.debug("asTree(): ", lock);

  return { name: lock.name, children: asTreeChildren(lock.dependencies, opts) };
}

function asTreeChildren(
  deps: Record<string, PackageLockDependency>,
  opts: Opts
): Tree[] {
  if (!deps) {
    return [];
  }

  let entries = Object.entries(deps);
  if (opts.filterDevDependencies) {
    entries = entries.filter(([_, dependency]) => dependency.dev === undefined);
  }

  return entries.map(([name, dependency]) => {
    const children = asTreeChildren(dependency.dependencies, opts);
    return { name, size: children.length, children };
  });
}
