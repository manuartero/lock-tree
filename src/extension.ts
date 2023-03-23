import * as vscode from "vscode";
import { LockEditor } from "./lock-editor";

/**
 * Entry point: called the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext) {
  console.debug("lockTree: activate");

  const editorProvider = LockEditor(context);
  const disposable = vscode.window.registerCustomEditorProvider(
    "lock-tree.editor.view",
    editorProvider
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
