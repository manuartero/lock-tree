// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
  const vscode = acquireVsCodeApi();

  const oldState = /** @type {{ count: number} | undefined} */ (vscode.getState());

  console.log('Initial state:', oldState);

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    switch (message.command) {
      case 'refactor':
        console.log('Refactor command received');
        break;
    }
  });
}());
