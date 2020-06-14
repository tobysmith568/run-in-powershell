import * as vscode from "vscode";
import * as util from "util";

const exec = util.promisify(require("child_process").exec);

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("run-in-powershell.runInPS", async (d: { fsPath: string }) => {

		let location: string | undefined= d?.fsPath;

		if (location === undefined) {
			location = vscode.window.activeTextEditor?.document.fileName;
		}

		if (location === undefined) {
			vscode.window.showErrorMessage("No file is currently open");
			return;
		}

		await run(location);
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}

export async function run(location: string): Promise<void> {
	const command: string = `START powershell -noexit "& ""${location}"""`;
	console.log("Running Powershell command:", command);

	try {
		await exec(command);
	} catch (err) {
		console.error(err);
		vscode.window.showErrorMessage(JSON.stringify(err));
	};
}