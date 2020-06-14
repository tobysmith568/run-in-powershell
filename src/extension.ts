import * as vscode from "vscode";
import { run } from "./run";

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("run-in-powershell.runInPS", async (d: { fsPath: string }) => await run(d.fsPath));
	context.subscriptions.push(disposable);
}

export function deactivate() {}
