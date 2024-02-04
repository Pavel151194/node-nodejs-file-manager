import { Command } from "./constants/index.js";
import nwd from "./nwd/index.js";
import fs from "./fs/index.js";
import os from "./os/index.js";
import hash from "./hash/index.js";
import zip from "./zip/index.js";

const controller = {
  [Command.UP]: nwd.up,
  [Command.CD]: nwd.cd,
  [Command.LS]: nwd.ls,

  [Command.CAT]: fs.cat,
  [Command.ADD]: fs.add,
  [Command.RN]: fs.rn,
  [Command.CP]: fs.cp,
  [Command.MV]: fs.mv,
  [Command.RM]: fs.rm,

  [Command.OS]: os,

  [Command.HASH]: hash,

  [Command.COMPRESS]: zip.compress,
  [Command.DECOMPRESS]: zip.decompress,

  [Command.EXIT]: process.exit.bind(0),
};

export default controller;
