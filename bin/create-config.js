import { ConfigGenerator } from "../lib/config-generator.js";
// import { findPackageJson } from "../lib/utils/utils";
import process from "node:process";
import fs from "node:fs/promises";

const cwd = process.cwd();
const packageJsonPath = '';
// const pkg = JSON.parse(await fs.readFile(new URL("../package.json", import.meta.url), "utf8"));

// const cwd = process.cwd();
// const packageJsonPath = findPackageJson(cwd);

// if (packageJsonPath === null) {
//     throw new Error("A package.json file is necessary to initialize ESLint. Run `npm init` to create a package.json file and try again.");
// }

const generator = new ConfigGenerator({ cwd, packageJsonPath });

await generator.prompt();
generator.build();
await generator.output();