import { glob } from "glob";
import * as Mocha from "mocha";
import * as path from "path";

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
    timeout: 10000
  });

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise(async (c, e) => {
    try {
      const files = await glob("**/**.test.js", { cwd: testsRoot });

      // Add files to the test suite
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

      // Run the mocha test
      mocha.run(failures => {
        if (failures > 0) {
          e(new Error(`${failures} tests failed.`));
        } else {
          c();
        }
      });
    } catch (err) {
      console.error(err);
      e(err);
    }
  });
}
