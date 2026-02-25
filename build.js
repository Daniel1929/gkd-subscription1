import fs from "fs";
import fetch from "node-fetch";

const sources = [
  "https://easylist.to/easylist/easylist.txt",
  "https://filters.adtidy.org/extension/ublock/filters/2.txt",
  "https://filters.adtidy.org/extension/ublock/filters/11.txt",
  "https://raw.githubusercontent.com/DandelionSprout/adfilt/master/ChineseList.txt"
];

async function fetchRules(url) {
  const res = await fetch(url);
  return await res.text();
}

function cleanRules(text) {
  return text
    .split("\n")
    .map(l => l.trim())
    .filter(l =>
      l &&
      !l.startsWith("!") &&
      !l.startsWith("[") &&
      !l.startsWith("#")
    );
}

async function main() {
  let allRules = [];

  for (const url of sources) {
    const text = await fetchRules(url);
    allRules = allRules.concat(cleanRules(text));
  }

  const uniqueRules = [...new Set(allRules)];

  const output = {
    name: "Custom GKD Auto Updated",
    author: "Auto Build",
    version: new Date().toISOString().slice(0, 10),
    updateTime: new Date().toISOString(),
    rules: uniqueRules
  };

  fs.writeFileSync(
    "Adpro_Custom.json5",
    JSON.stringify(output, null, 2)
  );
}

main();
