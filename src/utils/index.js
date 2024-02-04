import { userInfo } from "node:os";
import { resolve } from "node:path";

export const getUserName = () => {
  const userNameArg = process.argv.find((arg) => arg.includes("--username"));

  return userNameArg?.replace(/^[^=]*=/, "") || userInfo().userName || process.env.USERNAME || "Guest";
};

export const resolvePath = (...path) => resolve(...path).replace(/["']/g, "");

export const stringInject = (string = "", replacements = []) =>
  string.replace(/({\d})/g, (char) => replacements[char.replace(/{/, "").replace(/}/, "")]);
