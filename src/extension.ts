import * as vscode from "vscode";
import { LockEditor } from "./lock-editor";

/* defined at package.json */
const lockViewType = "lock-tree.lock";
const openLockCommand = "lock-tree.lock.open";

/**
 * Entry point: called the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext) {
  console.debug("lockTree: activate");

  const lockEditor = new LockEditor(context);
  const editorProvider = vscode.window.registerCustomEditorProvider(
    lockViewType,
    lockEditor
  );
  context.subscriptions.push(editorProvider);
}

export function deactivate() {}
