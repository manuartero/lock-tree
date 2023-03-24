import * as assert from "assert";

import { asTree } from "../../lock-tree";
import * as packageLock from "../../examples/package-lock.json";

suite.skip("LockTree", () => {
  /**
   *   ├─┬ @telefonica/living-apps-core-react@0.37.0
   *   │ ├── classnames@2.3.2
   *   │ ├── react-dom@18.2.0 deduped
   *   │ └── react@18.2.0 deduped
   *   ├─┬ react-dom@18.2.0
   *   │ ├─┬ loose-envify@1.4.0
   *   │ │ └── js-tokens@4.0.0
   *   │ ├── react@18.2.0 deduped
   *   │ └─┬ scheduler@0.23.0
   *   │   └── loose-envify@1.4.0 deduped
   *   └─┬ react@18.2.0
   *     └── loose-envify@1.4.0 deduped
   */
  test("asTree()", () => {
    const lockTree = asTree(packageLock);
    assert.deepStrictEqual(lockTree, {
      name: "living-app-v2-la-rae",
      version: "0.1.0",
      size: 3,
      children: [
        {
          name: "@telefonica/living-apps-core-react",
          version: "0.37.0",
          size: 3,
          children: [
            {
              name: "classnames",
              version: "2.3.2",
              size: 0,
              children: [],
            },
            {
              name: "react-dom ✅",
              version: "18.2.0",
              size: 0,
              children: [],
            },
            {
              name: "react ✅",
              version: "18.2.0",
              size: 0,
              children: [],
            },
          ],
        },
        {
          name: "react",
          version: "18.2.0",
          size: 1,
          children: [
            {
              name: "loose-envify ✅",
              version: "1.4.0",
              size: 0,
              children: [],
            },
          ],
        },
        {
          name: "react-dom",
          version: "18.2.0",
          size: 3,
          children: [
            {
              name: "loose-envify",
              version: "1.4.0",
              size: 1,
              children: [
                {
                  name: "js-tokens",
                  version: "4.0.0",
                  size: 0,
                  children: [],
                },
              ],
            },
            {
              name: "scheduler",
              version: "0.23.0",
              size: 1,
              children: [
                {
                  name: "loose-envify ✅",
                  version: "1.4.0",
                  size: 0,
                  children: [],
                },
              ],
            },
            {
              name: "react ✅",
              version: "18.2.0",
              size: 0,
              children: [],
            },
          ],
        },
      ],
    });
  });
});
