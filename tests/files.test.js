// Checks on the files of the site: translations in both languages,
// the offline file list of the service worker, and the two app manifests.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const read = (path) => readFileSync(path, "utf8");

// "a.b.c" for every text in a language file
function keys(object, prefix = "") {
  return Object.entries(object).flatMap(([key, value]) =>
    value && typeof value === "object" ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]);
}

test("English and Dutch have the same texts, and none is empty", () => {
  const en = JSON.parse(read("data/i18n/en.json"));
  const nl = JSON.parse(read("data/i18n/nl.json"));
  assert.deepEqual(keys(nl).sort(), keys(en).sort());
  for (const [lang, texts] of [["en", en], ["nl", nl]]) {
    for (const key of keys(texts)) {
      const value = key.split(".").reduce((node, part) => node[part], texts);
      assert.ok(typeof value === "string" && value.trim() !== "", `${lang}: ${key} is empty`);
    }
  }
});

test("every text key used in the HTML pages exists", () => {
  const en = JSON.parse(read("data/i18n/en.json"));
  const known = new Set(keys(en));
  const pages = readdirSync(".").filter((file) => file.endsWith(".html"));
  for (const page of pages) {
    const html = read(page);
    for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) assert.ok(known.has(match[1]), `${page}: ${match[1]}`);
    for (const match of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
      for (const pair of match[1].split(";")) {
        const key = pair.split(":")[1]?.trim();
        if (key) assert.ok(known.has(key), `${page}: ${key}`);
      }
    }
  }
});

// Every file the game needs to work offline
function gameFiles() {
  const walk = (dir) => readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path.split("\\").join("/")];
  });
  const top = readdirSync(".").filter((file) => /\.(html|webmanifest)$/.test(file));
  const folders = ["css", "data", "js", "assets"].flatMap(walk).filter((file) => !file.includes("og-image"));
  return [...top, ...folders].map((file) => `./${file}`);
}

test("the service worker saves every game file, and only files that exist", () => {
  const sw = read("sw.js");
  const listed = [...sw.matchAll(/^\s+"(\.\/[^"]*)",$/gm)].map((match) => match[1]);
  for (const file of gameFiles()) assert.ok(listed.includes(file), `${file} is missing in sw.js`);
  for (const file of listed) {
    if (file === "./") continue;
    assert.ok(existsSync(file.slice(2)), `${file} in sw.js does not exist`);
  }
  assert.match(sw, /const CACHE_NAME = "hanglet-v\d+";/);
});

test("the app manifest exists in English and Dutch, with the Kids shortcut to kids.html", () => {
  for (const [file, lang] of [["manifest.webmanifest", "en"], ["manifest-nl.webmanifest", "nl"]]) {
    const manifest = JSON.parse(read(file));
    assert.equal(manifest.lang, lang);
    assert.ok(manifest.shortcuts.some((shortcut) => shortcut.url === "./kids.html"), `${file}: Kids shortcut`);
    for (const icon of manifest.icons) assert.ok(existsSync(icon.src), icon.src);
  }
});
