import { EOL, arch, cpus, homedir, userInfo } from "node:os";
import { INVALID_INPUT_ERROR_MESSAGE, OPERATION_FAILED_ERROR_MESSAGE, OsArg } from "../constants/index.js";

const printEol = async () => {
  process.stdout.write(`${JSON.stringify(EOL)}\n`);
};

const printCpus = async () => {
  const cpuInfo = cpus().map(({ model, speed }) => ({ Model: model, Speed: `${speed / 1000} GHz` }));
  console.table(cpuInfo);
  process.stdout.write(`Amount of CPUS: ${cpuInfo.length}\n`);
};

const printHomeDir = async () => {
  process.stdout.write(`${homedir()}\n`);
};

const printUserName = async () => {
  const { username } = userInfo();
  process.stdout.write(`${username}\n`);
};

const printArchitecture = async () => {
  process.stdout.write(`${arch()}\n`);
};

const osController = {
  [OsArg.EOL]: printEol,
  [OsArg.CPUS]: printCpus,
  [OsArg.HOMEDIR]: printHomeDir,
  [OsArg.USERNAME]: printUserName,
  [OsArg.ARCHITECTURE]: printArchitecture,
};

const os = async (arg) => {
  if (!arg || !osController.hasOwnProperty(arg)) throw new Error(INVALID_INPUT_ERROR_MESSAGE)

  try {
    await osController[arg]();
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

export default os;
