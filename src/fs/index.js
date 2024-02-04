import { createReadStream, createWriteStream } from "node:fs";
import { rename, rm as removeFile, writeFile } from "node:fs/promises";
import { basename, parse, resolve } from "node:path";
import { finished, pipeline } from "node:stream/promises";
import { INVALID_INPUT_ERROR_MESSAGE, OPERATION_FAILED_ERROR_MESSAGE } from "../constants/index.js";

const cat = async (source) => {
  if (!source) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const readStream = createReadStream(resolve(process.cwd(), source));

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
    await writeFile(resolve(process.cwd(), fileName), "", { flag: "wx" });
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const rm = async (source) => {
  if (!source) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  try {
    await removeFile(resolve(process.cwd(), source));
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const rn = async (source, newFileName) => {
  if (!source || !newFileName) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  try {
    await rename(resolve(process.cwd(), source), resolve(process.cwd(), newFileName));
  } catch {
    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const cp = async (source, destination) => {
  if (!source) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const readPath = resolve(process.cwd(), source);
  const { dir, ext, name } = parse(readPath);

  const writePath = resolve(process.cwd(), destination || dir, `${name}_copy${ext}`);

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

  const readPath = resolve(process.cwd(), source);
  const writePath = resolve(process.cwd(), destination, basename(readPath));

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
