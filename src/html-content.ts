import * as vscode from "vscode";
import { getMediaUris } from "./media-uris";
import { generateNonce } from "./nonce";

export function getHtmlContent(
  extensionUri: vscode.Uri,
  webview: vscode.Webview
) {
  const media = getMediaUris(extensionUri, webview);
  const nonce = generateNonce();

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!--
      content security policy:
       - only allow loading images from https or from our extension directory,
       - only allow scripts that have a specific nonce.
    -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="${media["reset.css"]}" rel="stylesheet">
    <link href="${media["vscode.css"]}" rel="stylesheet">
    <link href="${media["styles.css"]}" rel="stylesheet">
  </head>
  <body>
    <h1 id="heading">Hello</h1>
    <script nonce="${nonce}" src="${media["main.js"]}"></script>
  </body>
  </html>`;
}
