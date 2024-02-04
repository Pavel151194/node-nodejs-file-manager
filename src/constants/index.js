export const BROTLI_EXTNAME = ".br";
export const CURRENT_DIR_MESSAGE = "You are currently in {0}\n";
export const EXIT_MESSAGE = "Thank you for using File Manager, {0}, goodbye!\n";
export const INVALID_INPUT_ERROR_MESSAGE = "Invalid input\n";
export const MATCH_COMMAND_LINE_PATTERN = /(["'])[^"']*\1|\S+/g;
export const OPERATION_FAILED_ERROR_MESSAGE = "Operation failed\n";
export const WELCOME_MESSAGE = "Welcome to the File Manager, {0}!\n";

export const Command = {
  UP: "up",
  CD: "cd",
  LS: "ls",
  CAT: "cat",
  ADD: "add",
  RN: "rn",
  CP: "cp",
  MV: "mv",
  RM: "rm",
  OS: "os",
  HASH: "hash",
  COMPRESS: "compress",
  DECOMPRESS: "decompress",
  EXIT: ".exit",
};

export const DirentType = { DIRECTORY: "directory", FILE: "file" };

export const OsArg = {
  EOL: "--EOL",
  CPUS: "--cpus",
  HOMEDIR: "--homedir",
  USERNAME: "--username",
  ARCHITECTURE: "--architecture",
};
