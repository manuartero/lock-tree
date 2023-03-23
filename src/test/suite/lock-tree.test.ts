import * as assert from "assert";

import { asTree } from "../../lock-tree";

const example = {
  name: "example",
  version: "1.0.0",
  lockfileVersion: 2,
  requires: true,
  dependencies: {
    a: {
      version: "1.0.0",
      resolved: "https://registry.npmjs.org/a/-/a-1.0.0.tgz",
      integrity: "sha512-1",
      dev: true,
      requires: {
        b: "^1.0.0",
      },
      dependencies: {
        b: {
          version: "1.0.0",
          resolved: "https://registry.npmjs.org/b/-/b-1.0.0.tgz",
          integrity: "sha512-2",
          dev: true,
          requires: {},
          dependencies: {},
        },
      },
    },
  },
};

suite("LockTree", () => {
  test("asTree()", () => {
    const lockTree = asTree(example);
    assert.deepStrictEqual(lockTree, {
      name: "example",
      children: [
        {
          name: "a",
          size: 1,
          children: [
            {
              name: "b",
              size: 0,
              children: [],
            },
          ],
        },
      ],
    });
  });
});
