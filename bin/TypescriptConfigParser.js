"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fse = require("fs-extra");
const upath = require("upath");
const TypeScript = require("typescript");
const jsonc = require("strip-json-comments");
const Shout_1 = require("./Shout");
const chalk = require("chalk");
const fallbackTypeScriptConfig = {
    compilerOptions: {
        alwaysStrict: true,
        skipLibCheck: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        allowSyntheticDefaultImports: true,
        experimentalDecorators: true,
        jsx: "react",
        target: "es2016",
        module: "esnext",
        moduleResolution: "node",
        lib: [
            "dom",
            "es2016",
            "dom.iterable"
        ]
    }
};
function parseTypescriptConfig(folder, json) {
    const o = JSON.parse(JSON.stringify(json));
    const tsconfig = TypeScript.parseJsonConfigFileContent(o, TypeScript.sys, folder);
    if (tsconfig.errors.length) {
        throw Error(tsconfig.errors[0].messageText.toString());
    }
    return tsconfig;
}
exports.parseTypescriptConfig = parseTypescriptConfig;
async function tryReadTypeScriptConfigJson(folder) {
    const tsconfigJsonPath = upath.join(folder, 'tsconfig.json');
    try {
        const tsconfigRaw = await fse.readFile(tsconfigJsonPath, 'utf8');
        const tsconfig = JSON.parse(jsonc(tsconfigRaw));
        const tryParse = parseTypescriptConfig(folder, tsconfig);
        const errorMessage = tryParse.errors.join('\n\n');
        if (tryParse.errors.length) {
            throw new Error(errorMessage);
        }
        return tsconfig;
    }
    catch (error) {
        Shout_1.Shout.error('when reading', chalk.cyan(tsconfigJsonPath), error);
        Shout_1.Shout.warning('Using the default fallback TypeScript configuration!');
        return fallbackTypeScriptConfig;
    }
}
exports.tryReadTypeScriptConfigJson = tryReadTypeScriptConfigJson;
