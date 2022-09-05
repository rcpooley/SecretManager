const fs = require("fs");
const path = require("path");

const CONFIG_FILE_NAME = ".sm.json";

const cwd = process.cwd();

function error(msg) {
  console.log(msg);
  process.exit(1);
}

function readFile(relPath) {
  const smPath = path.join(cwd, relPath);
  let smContent;
  try {
    smContent = fs.readFileSync(smPath);
  } catch (e) {
    error(`Could not find ${smPath}`);
  }
  try {
    return JSON.parse(smContent);
  } catch (e) {
    error(`Invalid ${smPath}`);
  }
}

function recurse(dirOrFile, targets) {
  const stat = fs.lstatSync(dirOrFile);
  if (stat.isDirectory()) {
    const children = fs.readdirSync(dirOrFile);
    for (const child of children) {
      recurse(
        path.join(dirOrFile, child),
        targets.map(({ secret, out }) => ({
          secret,
          out: path.join(out, child),
        }))
      );
    }
  } else {
    const content = fs.readFileSync(dirOrFile, "utf-8");
    for (const { secret, out } of targets) {
      let newContent = content;
      for (const [k, v] of Object.entries(secret)) {
        newContent = newContent.replace(new RegExp(`{${k}}`, "g"), v);
      }
      const dirName = path.dirname(out);
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }
      fs.writeFileSync(out, newContent);
    }
  }
}

function doReplacement(replacement) {
  const source = path.join(cwd, replacement.source);
  const targets = replacement.targets.map((target) => ({
    secret: readFile(target.secret),
    out: path.join(cwd, target.out),
  }));
  recurse(source, targets);
}

function main() {
  const config = readFile(CONFIG_FILE_NAME);
  config.replacements.forEach(doReplacement);
}

main();
