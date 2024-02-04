import { createReadStream, createWriteStream } from "node:fs";
import { extname, parse } from "node:path";
import { pipeline } from "node:stream/promises";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { BROTLI_EXTNAME, INVALID_INPUT_ERROR_MESSAGE, OPERATION_FAILED_ERROR_MESSAGE } from "../constants/index.js";
import { resolvePath } from "../utils/index.js";
import fs from "../fs/index.js";

const compress = async (source, destination) => {
  if (!source) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const readPath = resolvePath(process.cwd(), source);
  const { dir, ext, name } = parse(readPath);

  const writePath = resolvePath(process.cwd(), destination || dir, `${name}${ext}${BROTLI_EXTNAME}`);

  const readStream = createReadStream(readPath);
  const compressStream = createBrotliCompress();
  const writeStream = createWriteStream(writePath, { flags: "wx" });

  try {
    await pipeline(readStream, compressStream, writeStream);
  } catch (error) {
    readStream.destroy();
    compressStream.destroy();
    writeStream.destroy();

    if (error.code !== "EEXIST") {
      await fs.rm(writePath);
    }

    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

const decompress = async (source, destination) => {
  if (!source) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const readPath = resolvePath(process.cwd(), source);
  const { dir, ext, name } = parse(readPath);

  if (ext !== BROTLI_EXTNAME) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const writePath = resolvePath(process.cwd(), destination || dir, name);

  if (!extname(writePath)) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const readStream = createReadStream(readPath);
  const decompressStream = createBrotliDecompress();
  const writeStream = createWriteStream(writePath, { flags: "wx" });

  try {
    await pipeline(readStream, decompressStream, writeStream);
  } catch (error) {
    readStream.destroy();
    decompressStream.destroy();
    writeStream.destroy();

    if (error.code !== "EEXIST") {
      await fs.rm(writePath);
    }

    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

export default { compress, decompress };
