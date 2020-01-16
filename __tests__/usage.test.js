const {execSync} = require("child_process");
const sh = require("sh-thunk");
const fs = require("fs");

const webpack = __dirname + "/../node_modules/.bin/webpack";

beforeEach(sh({stdio: null})`rm -rf __tests__/fixtures/*/dist/`);

test("can render template", () => {
    execSync(`${webpack} --mode production`, {
        cwd: __dirname + "/fixtures/template",
        stdio: "inherit",
    });

    const files = fs.readdirSync(__dirname + "/fixtures/template/dist");

    expect(files).toEqual([
        "main.js",
        "main.js.map",
        "manifest.json",
        "module.js",
        "module.js.map",
        "out.php",
    ]);

    const out = fs
        .readFileSync(__dirname + "/fixtures/template/dist/out.php")
        .toString();

    expect(out).toMatch(`<?php define( 'JS', 'main.js?v=`);
    expect(out).toMatch(`' );`);

    const mainOut = fs
        .readFileSync(__dirname + "/fixtures/template/dist/main.js")
        .toString();

    expect(mainOut).toContain("CHANGED_WITH_DEFINE_PLUGIN");
});
