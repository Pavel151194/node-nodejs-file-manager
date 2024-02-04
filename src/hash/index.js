import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { INVALID_INPUT_ERROR_MESSAGE, OPERATION_FAILED_ERROR_MESSAGE } from "../constants/index.js";
import { resolvePath } from "../utils/index.js";

const hash = async (source) => {
  if (!source) throw new Error(INVALID_INPUT_ERROR_MESSAGE);

  const readStream = createReadStream(resolvePath(process.cwd(), source));
  const hashStream = createHash("sha256");

  try {
    await pipeline(readStream, hashStream);

    process.stdout.write(`${hashStream.digest("hex")}\n`);
  } catch {
    readStream.destroy();
    hashStream.destroy();

    throw new Error(OPERATION_FAILED_ERROR_MESSAGE);
  }
};

export default hash;
