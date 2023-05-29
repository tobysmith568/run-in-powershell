export const commandBuilder = (
  powerShellLocation: string,
  workingDir: string,
  location: string,
  isAdmin: boolean,
  shouldCloseWhenFinished: boolean
): string => {
  const outerFlags = "-NoProfile -ExecutionPolicy Unrestricted";

  const innerCommand = buildInnerCommand(
    powerShellLocation,
    workingDir,
    location,
    isAdmin,
    shouldCloseWhenFinished
  );

  const command: string = `"${powerShellLocation}" ${outerFlags} -Command "${innerCommand}"`;
  return command;
};

const buildInnerCommand = (
  powerShellLocation: string,
  workingDir: string,
  location: string,
  isAdmin: boolean,
  shouldCloseWhenFinished: boolean
) => {
  const adminSection = isAdmin ? " -Verb RunAs" : "";
  const closeSection = shouldCloseWhenFinished ? "" : " -NoExit";

  const escapedPowerShellLocation = escapeChars(powerShellLocation);
  const escapedWorkingDir = escapeChars(workingDir);
  const escapedLocation = escapeChars(location);

  const command = `& {Start-Process ${escapedPowerShellLocation}${adminSection} -ArgumentList '-NoProfile${closeSection} -ExecutionPolicy Unrestricted -Command cd ${escapedWorkingDir} ; & ${escapedLocation}'}`;
  return command;
};

const escapeChars = (input: string): string => input.replace(/( |\(|\))/g, "`$1");
