import * as vscode from "vscode";
import * as util from "util";
import { dirname } from "path";

const exec = util.promisify(require("child_process").exec);
const adminSection: string = "-Verb runAs";
const powershellCoreSetting: string = "runInPowerShell.PowershellCoreLocation";
const powershell1: string = "powershell.exe";

type ContextData = {
  fsPath: string;
};

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("Run in Powershell");

  let runInPSDisposable = vscode.commands.registerCommand("run-in-powershell.runInPS", async (data: ContextData) =>
    runInPowershell(data, false)
  );

  let runInPSAdminDisposable = vscode.commands.registerCommand(
    "run-in-powershell.runInPSAdmin",
    async (data: ContextData) => runInPowershell(data, true)
  );

  context.subscriptions.push(runInPSDisposable);
  context.subscriptions.push(runInPSAdminDisposable);
}

export function deactivate() {}

export async function runInPowershell(contextData: ContextData, asAdmin: boolean): Promise<void> {
  const fileLocation: string | undefined = getFileLocation(contextData);

  if (fileLocation === undefined) {
    vscode.window.showErrorMessage("No file is currently open");
    return;
  }

  await run(fileLocation, asAdmin);
}

export function getFileLocation(contextData?: ContextData): string | undefined {
  let location: string | undefined = contextData?.fsPath;

  if (location === undefined) {
    location = vscode.window.activeTextEditor?.document.fileName;
  }

  return location;
}

export async function run(location: string, admin: boolean = false): Promise<void> {
  const workingDir: string = dirname(location);
  let powerShellLocation: string | undefined = vscode.workspace.getConfiguration().get(powershellCoreSetting);

  if (powerShellLocation === undefined || powerShellLocation.length === 0) {
    powerShellLocation = powershell1;
  }

  const command: string = `"${powerShellLocation}" -NoProfile -ExecutionPolicy Unrestricted -Command "& {Start-Process ${escapeSpaces(
    powerShellLocation
  )} -ArgumentList '-NoProfile -NoExit -ExecutionPolicy Unrestricted -Command cd ${escapeSpaces(
    workingDir
  )} ; & ${escapeSpaces(location)}""' ${admin ? adminSection : ""}}"`;

  outputChannel.appendLine("Running Powershell command: " + command);

  try {
    await exec(command);
  } catch (err) {
    outputChannel.appendLine(JSON.stringify(err));
    vscode.window.showErrorMessage(JSON.stringify(err));
  }
}

export function escapeSpaces(value: string): string {
	return value.replace(" ", "` ");
}
