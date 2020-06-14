import * as vscode from "vscode";
import * as util from "util";

const exec = util.promisify(require("child_process").exec);

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