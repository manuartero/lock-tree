/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from "vscode";

export type MediaResource =
  | "reset.css"
  | "vscode.css"
  | "styles.css"
  | "d3.min.js"
  | "main.js"
  | "tree.js";

export function getMediaUris(
  extensionUri: vscode.Uri,
  webview: vscode.Webview
) {
  const uri = (resource: MediaResource) => {
    return webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", resource)
    );
  };

  return {
    "reset.css": uri("reset.css"),
    "vscode.css": uri("vscode.css"),
    "styles.css": uri("styles.css"),
    "d3.min.js": uri("d3.min.js"),
    "main.js": uri("main.js"),
    "tree.js": uri("tree.js"),
  };
}
