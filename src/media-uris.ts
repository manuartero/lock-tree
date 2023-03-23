/* eslint-disable @typescript-eslint/naming-convention */

import * as vscode from "vscode";

export type MediaResource =
  | "reset.css"
  | "vscode.css"
  | "styles.css"
  | "main.js";

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
    "main.js": uri("main.js"),
  };
}
