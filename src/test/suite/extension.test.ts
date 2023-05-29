import * as assert from "assert";
import { readFile } from "fs/promises";
import { join } from "path";
import * as vscode from "vscode";

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const projectRoot = join(__dirname, "../../..");

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("should run the open script", async () => {
    const fiveSecondsAgo = Math.floor(Date.now() / 1000) - 5;
    const uri = vscode.Uri.file(join(projectRoot, "test-scripts", "test1.ps1"));

    const configuration = vscode.workspace.getConfiguration();
    await configuration.update(
      "runInPowerShell.CloseWhenFinished",
      true,
      vscode.ConfigurationTarget.Global
    );

    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);
    await vscode.commands.executeCommand("run-in-powershell.runInPS");

    await sleep(2000);
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");

    const result = await readFile(join(projectRoot, "test-output", "test1.txt"), "utf8");

    assert.ok(+result > fiveSecondsAgo);
  });
});
