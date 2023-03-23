import * as vscode from "vscode";
import { getHtmlContent } from "./html-content";
import { asTree } from "./lock-tree";

function getDocumentAsJson(document: vscode.TextDocument) {
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

export function LockEditor(
  context: vscode.ExtensionContext
): vscode.CustomTextEditorProvider {
  return {
    /**
     * onOpen
     */
    resolveCustomTextEditor(
      document: vscode.TextDocument,
      webviewPanel: vscode.WebviewPanel,
      _token: vscode.CancellationToken
    ) {
      webviewPanel.webview.options = {
        enableScripts: true,
      };
      webviewPanel.webview.html = getHtmlContent(
        context.extensionUri,
        webviewPanel.webview
      );

      function updateWebview() {
        const json = getDocumentAsJson(document);
        const data = {
          type: "update",
          lockTree: asTree(json, { filterDevDependencies: true }),
        };
        webviewPanel.webview.postMessage(data);
      }

      const changeDocumentSubscription =
        vscode.workspace.onDidChangeTextDocument((e) => {
          if (e.document.uri.toString() === document.uri.toString()) {
            updateWebview();
          }
        });

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
    },
  };
}
