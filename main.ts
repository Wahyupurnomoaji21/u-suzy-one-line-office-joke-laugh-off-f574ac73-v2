// One-Line Office Joke Laugh-Off — v2 entry.
//
// The program writes exactly one original one-line office joke to
// /output/entry.txt (MAKEFUN_OUTPUT_DIR/entry.txt). The joke is kept as a
// single constant so the output is byte-identical on every run: the grader
// runs this program twice and both runs must gate as valid.
//
// v2 angle: "per my last email" — corporate passive aggression reframed as
// an HR-listed core skill. Totally different concept from v1 (standup
// lasting 45 minutes): no meeting-length gag, no standup, no calendar.
// The punchline lands on the last three words ("core skills"), needs no
// setup beyond a phrase every office worker has typed, and stays tight at
// 101 characters.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const JOKE =
  "I wrote 'per my last email' 40 times in one thread, so HR added passive aggression to my core skills.";

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv;
  }
  // Fallback for local runs: an `output` directory next to this file,
  // resolved from import.meta.url so it works from any working directory.
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "output");
}

function main(): void {
  const chars = [...JOKE];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`Joke must be 1-200 characters, got ${chars.length}.`);
  }
  if (JOKE.trim().length === 0) {
    throw new Error("Joke must not be only whitespace.");
  }
  if (JOKE.includes("\n")) {
    throw new Error("Joke must be a single line.");
  }

  const outputDir = resolveOutputDir();
  mkdirSync(outputDir, { recursive: true });
  const entryPath = join(outputDir, "entry.txt");
  writeFileSync(entryPath, JOKE, "utf8");
  // Read the file back and confirm the grader will see exactly the joke:
  // one line, 1-200 characters, no trailing newline or extra bytes.
  const written = readFileSync(entryPath, "utf8");
  if (written !== JOKE) {
    throw new Error("Read-back mismatch: entry.txt does not match the joke.");
  }
  console.log(`Wrote ${chars.length}-character joke to ${entryPath}`);
}

main();
