// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
import { Tree } from './tree.js';

/**
 * d3
 * @see https://gist.github.com/mbostock/4339083
 */
function render(lockTree) {
  if (!lockTree) {
    throw new Error('No lock tree');
  }
  // @ts-ignore
  if (!d3) {
    throw new Error('No d3');
  }

  const svg = Tree(lockTree, {
    width: 500,
    label: d => d.name,
    title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}`, // hover text
  });

  console.debug({ chart: svg });
  if (svg) {
    document.getElementById("chart")?.appendChild(svg);
  }
}

function run() {
  const vscode = acquireVsCodeApi();

  const oldState = /** @type {{ count: number} | undefined} */ (vscode.getState());

  console.log('Initial state:', oldState);

  window.addEventListener('message', event => {
    const { type, lockTree } = event.data;
    console.debug('Message received from extension of type: ', type);
    render(lockTree);
  });
}

run();
