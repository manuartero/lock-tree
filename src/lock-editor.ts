import * as vscode from "vscode";
import { getWebviewContent } from "./webview-content";

function getDocumentAsJSON(document: vscode.TextDocument) {
  const text = document.getText();
  if (text.trim().length === 0) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "Could not get document as json. Content is not valid json"
    );
  }
}

export class LockEditor implements vscode.CustomTextEditorProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  /** onOpen */
  resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ) {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = getWebviewContent(
      this.context.extensionUri,
      webviewPanel.webview
    );

    function updateWebview() {
      webviewPanel.webview.postMessage({
        type: "update",
        document: document,
      });
    }

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === document.uri.toString()) {
          updateWebview();
        }
      }
    );

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    webviewPanel.webview.onDidReceiveMessage((e) => {
      switch (e.type) {
        case "add":
          console.log("add");
          // TODO
          return;
      }
    });

    updateWebview();
  }
}
