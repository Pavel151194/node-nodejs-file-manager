import { createReadStream, createWriteStream } from "node:fs";
import { rename, rm as removeFile, writeFile } from "node:fs/promises";
import { basename, parse } from "node:path";
import { finished, pipeline } from "node:stream/promises";
import { INVALID_INPUT_ERROR_MESSAGE, OPERATION_FAILED_ERROR_MESSAGE } from "../constants/index.js";
import { resolvePath } from "../utils/index.js";

const cat = async (source) => {
  if (!source) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const readStream = createReadStream(resolvePath(source));

  try {
    readStream.pipe(process.stdout);

    await finished(readStream);
  } catch {
    readStream.destroy();
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const add = async (fileName) => {
  if (!fileName) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  try {
    await writeFile(resolvePath(fileName), "", { flag: "wx" });
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const rm = async (source) => {
  if (!source) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  try {
    await removeFile(resolvePath(source));
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const rn = async (source, newFileName) => {
  if (!source || !newFileName) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const { dir } = parse(source);

  try {
    await rename(resolvePath(source), resolvePath(dir, newFileName));
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const cp = async (source, destination) => {
  if (!source) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const readPath = resolvePath(source);
  const { dir, ext, name } = parse(readPath);

  const writePath = resolvePath(destination || dir, `${name}_copy${ext}`);

  const readStream = createReadStream(readPath);
  const writeStream = createWriteStream(writePath, { flags: "wx" });

  try {
    await pipeline(readStream, writeStream);
  } catch (error) {
    readStream.destroy();
    writeStream.destroy();

    if (error.code !== "EEXIST") {
      await rm(writePath);
    }

    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const mv = async (source, destination) => {
  if (!source || !destination) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const readPath = resolvePath(source);
  const writePath = resolvePath(destination, basename(readPath));

  const readStream = createReadStream(readPath);
  const writeStream = createWriteStream(writePath, { flags: "wx" });

  try {
    await pipeline(readStream, writeStream);
    await rm(readPath);
  } catch (error) {
    readStream.destroy();
    writeStream.destroy();

    if (error.code !== "EEXIST") {
      await rm(writePath);
    }

    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

export default { cat, add, rm, rn, cp, mv };
