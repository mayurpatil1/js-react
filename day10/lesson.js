/* ============================================================
   DAY 10 — Node.js basics + npm + package.json
            (the last "plain tooling" day before TypeScript)
   ============================================================

   Run with: node lesson.js some arg1 arg2
   (try it both with and without extra args after "lesson.js" —
   see section 1 below)

   Note: this file uses require()/module-style Node — CommonJS,
   the classic way Node scripts are written, as opposed to the
   import/export ES modules you used in Day 8. Both exist in the
   Node world; React/Vite projects use ES modules exclusively, but
   plenty of Node tooling and scripts (like this one) still use
   CommonJS, so it's worth recognizing both.
   ------------------------------------------------------------ */

const fs = require("fs");
const path = require("path");

// -------------------------------------------------------------
// 1. process.argv — command-line arguments
// -------------------------------------------------------------
// Java equivalent: `public static void main(String[] args)`.
// process.argv[0] is the node binary path, [1] is this script's
// path, and anything after that is what YOU passed in.
console.log("argv:", process.argv.slice(2));
// try: node lesson.js hello world  ->  argv: [ 'hello', 'world' ]

// -------------------------------------------------------------
// 2. process.env — environment variables
// -------------------------------------------------------------
// Java equivalent: System.getenv("SOME_VAR"). This is how apps
// read config/secrets without hardcoding them — e.g. your Spring
// Boot app probably reads DB credentials from env vars already;
// a React/Node app does the exact same thing.
console.log("NODE env example (may be undefined):", process.env.NODE_ENV);
console.log("current working directory:", process.cwd());

// -------------------------------------------------------------
// 3. The `path` module — building file paths safely
// -------------------------------------------------------------
// Never hand-concatenate paths with "/" — path.join handles the
// separator differences between operating systems for you.
const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, "notes.txt");
console.log("resolved path:", filePath);
console.log("extension:", path.extname(filePath)); // ".txt"
console.log("just the filename:", path.basename(filePath)); // "notes.txt"

// __dirname — the directory this FILE lives in (CommonJS gives you
// this for free; in an ES module like Day 8's .mjs files, you'd
// need `import.meta.url` instead — one more small difference
// between the two module systems).
console.log("this file's directory:", __dirname);

// -------------------------------------------------------------
// 4. Reading & writing files — sync vs async (Day 6 connection)
// -------------------------------------------------------------
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Synchronous — blocks until done. Fine for small scripts/tools,
// but never do this in a real server (it freezes everything else
// on that single JS thread while it waits).
fs.writeFileSync(filePath, "Day 10 notes: npm, package.json, Vite\n");
const syncContent = fs.readFileSync(filePath, "utf8");
console.log("read synchronously:", syncContent.trim());

// Asynchronous — the Day 6-style way, doesn't block the thread.
// This is what real Node servers use.
async function readAsync() {
  const content = await fs.promises.readFile(filePath, "utf8");
  console.log("read asynchronously:", content.trim());
}
readAsync();

/* ============================================================
   EXERCISES
   ============================================================ */

// TODO 1: Run this file with two extra arguments, e.g.
//         node lesson.js DON 90
//         then log a sentence using them: "DON is 90 years old"
//         (pull them out of process.argv).
const [name, age] = process.argv.slice(2);
if (name && age) {
  console.log(`${name} is ${age} years old`);
} else {
  console.log("TODO 1: pass two args, e.g. `node lesson.js DON 90`");
}

// TODO 2: Use path.join to build a path to a file called
//         "profile.json" inside a "config" folder next to this
//         file, without hardcoding "/" anywhere.
const profilePath = path.join(__dirname, "config", "profile.json");
console.log("profile path:", profilePath);

// TODO 3: Write an async function `appendLog(message)` that uses
//         fs.promises.appendFile to add a line to notes.txt
//         (created above) each time it's called, with a
//         try/catch around it (Day 9) in case the write fails.
async function appendLog(message) {
  try {
    await fs.promises.appendFile(filePath, message + "\n");
    console.log("appended log:", message);
  } catch (err) {
    console.error("failed to append log:", err.message);
  }
}
appendLog("logged via appendLog()");

// TODO 4: Look at package.json in this same folder. Identify:
//         which field is the entry point convention, what
//         "scripts" lets you do, and what the difference is
//         between "dependencies" and "devDependencies". Write
//         your answers as comments here (see PACKAGE_JSON_GUIDE.md
//         in this folder if you want the full explanation).
//
// - "main": "lesson.js" is the entry point convention — it tells
//   Node (and other tools) which file to load when something does
//   require("day10-npm-basics"), i.e. requires this package by name.
// - "scripts" defines named shortcuts for shell commands, run via
//   `npm run <name>` (e.g. `npm start` for "start", `npm run greet`
//   for "greet"). Saves you from retyping/remembering long commands.
// - "dependencies" are packages the app needs at runtime (shipped/
//   installed in production). "devDependencies" are only needed
//   during development (test runners, linters, bundlers) and are
//   skipped when installing with `npm install --production` or
//   `npm ci --omit=dev`.

// TODO 5 (the one for later): Read VITE_SETUP.md in this folder —
//         it has the exact commands to create a real React +
//         TypeScript project with Vite.
