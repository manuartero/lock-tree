import type { PackageLock, PackageLockDependency } from "./types";

type Tree = {
  name: string;
  size?: number;
  children: Tree[];
};

export function asTree(lock: PackageLock): Tree {
  if (lock.lockfileVersion < 2) {
    throw new Error("lockfileVersion < 2 not supported");
  }
  console.debug("asTree(): ", lock);
  return { name: lock.name, children: asTreeChildren(lock.dependencies) };
}

function asTreeChildren(deps: Record<string, PackageLockDependency>): Tree[] {
  if (!deps) {
    return [];
  }
  return Object.entries(deps).map(([name, dependency]) => {
    const children = asTreeChildren(dependency.dependencies);
    return { name, size: children.length, children };
  });
}
