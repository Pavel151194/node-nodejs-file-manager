import { homedir } from "node:os";
import { createInterface } from "node:readline";
import {
  CURRENT_DIR_MESSAGE,
  EXIT_MESSAGE,
  INVALID_INPUT_ERROR_MESSAGE,
  WELCOME_MESSAGE,
} from "./src/constants/index.js";
import { getUserName, stringInject } from "./src/utils/index.js";
import controller from "./src/controller.js";

const startDir = process.cwd();
const homeDir = homedir();

if (startDir !== homeDir) {
  process.chdir(homeDir);
}

const userName = getUserName();

const readCommandLineStream = createInterface(process.stdin, process.stdout);

process.stdout.write(stringInject(WELCOME_MESSAGE, [userName]));
process.stdout.write(stringInject(CURRENT_DIR_MESSAGE, [process.cwd()]));

const execute = async (line) => {
  const [command, ...args] = line.trim().split(" ");

  if (!controller.hasOwnProperty(command)) {
    process.stderr.write(INVALID_INPUT_ERROR_MESSAGE);
    return;
  }

  try {
    await controller[command](...args);
  } catch (error) {
    process.stderr.write(error.message);
  }

  process.stdout.write(stringInject(CURRENT_DIR_MESSAGE, [process.cwd()]));
};

readCommandLineStream.on("line", execute);

process.on("exit", () => {
  readCommandLineStream.close();
  process.stdout.write(stringInject(EXIT_MESSAGE, [userName]));
});
