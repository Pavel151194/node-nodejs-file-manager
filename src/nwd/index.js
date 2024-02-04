import { readdir } from "node:fs/promises";
import { INVALID_INPUT_ERROR_MESSAGE, OPERATION_FAILED_ERROR_MESSAGE, DirentType } from "../constants/index.js";
import { resolvePath } from "../utils/index.js";

const cd = async (path) => {
  if (!path) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  try {
    process.chdir(resolvePath(process.cwd(), path));
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const ls = async () => {
  try {
    const dirents = await readdir(process.cwd(), { withFileTypes: true });

    const result = dirents
      .map((dirent) => ({
        Name: dirent.name,
        Type: dirent.isFile() ? DirentType.FILE : DirentType.DIRECTORY,
      }))
      .sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name));

    console.table(result);
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const up = async () => {
  try {
    process.chdir(resolvePath(process.cwd(), ".."));
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

export default { cd, ls, up };
