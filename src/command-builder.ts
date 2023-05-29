export const commandBuilder = (
  powerShellLocation: string,
  workingDir: string,
  isAdmin: boolean,
  location: string
): string => {
  const outerFlags = "-NoProfile -ExecutionPolicy Unrestricted";

  const innerCommand = buildInnerCommand(powerShellLocation, workingDir, isAdmin, location);

  const command: string = `"${powerShellLocation}" ${outerFlags} -Command "${innerCommand}"`;
  return command;
};

const buildInnerCommand = (
  powerShellLocation: string,
  workingDir: string,
  isAdmin: boolean,
  location: string
) => {
  const adminSection = isAdmin ? " -Verb RunAs" : "";

  const escapedPowerShellLocation = escapeChars(powerShellLocation);
  const escapedWorkingDir = escapeChars(workingDir);
  const escapedLocation = escapeChars(location);

  const command = `& {Start-Process ${escapedPowerShellLocation}${adminSection} -ArgumentList '-NoProfile -NoExit -ExecutionPolicy Unrestricted -Command cd ${escapedWorkingDir} ; & ${escapedLocation}'}`;
  return command;
};

const escapeChars = (input: string): string => input.replace(/( |\(|\))/g, "`$1");
