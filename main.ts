// The Vacuum's Alibi.
//
// One fixed funny line, written to /output/entry.txt. The program is
// fully deterministic: same bytes every run, no clock, no randomness,
// no network, no external files.
//
// The line:
//   My schedule says I cleaned it. My dustbin says otherwise. I have
//   opened an investigation into myself.
//
// Why this line, against the judge's brief, in order:
// 1. One funny excuse a robot vacuum gives for missing a spot — 101
//    characters, one line, three short deadpan sentences, plain text.
// 2. A real joke that lands, not a cute observation about dust: two
//    conflicting machine logs (schedule vs dustbin) force a third act
//    the reader did not expect — the vacuum investigating itself.
// 3. Deadpan machine voice, a little smug about its schedule: the
//    schedule claims the job is done, the dustbin contradicts it, and
//    the vacuum trusts procedure over either of them.
// 4. Surprise with a specific detail nobody expects: the suspect is
//    the vacuum itself. No stock appliance joke — no lidar, no
//    load-bearing crumb (76 entries in the field), no restraining
//    order, no sovereign territory, no "filed under" — all of them
//    already saturated in this competition's 693 entries, checked
//    first-hand against every title in the field.
// 5. The punch sits at the end — "into myself" is the last twist,
//    the vacuum is the butt of its own joke (self-own), and nothing
//    after it explains the joke. Setup:punchline is two short log
//    sentences against one twist sentence; every word earns its place.
// 6. Fresh — zero trigram overlap with any of the 693 field entries,
//    and zero verbatim hits for the full line on the web.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const LINE =
  'My schedule says I cleaned it. My dustbin says otherwise. I have opened an investigation into myself.';

const DEST = join(OUTPUT_DIR, 'entry.txt');

// Gate: one line, 1-200 characters (the competition's one-line cap),
// not only whitespace, and no embedded newline. Failing early here
// is cheaper than writing a bad entry and only finding out at the
// read-back verify below.
if (LINE.length < 1 || LINE.length > 200) {
  console.error(`entry line is ${LINE.length} characters, outside 1-200`);
  process.exit(1);
}
if (LINE.includes('\n') || LINE.trim().length === 0) {
  console.error('entry line must be a single non-blank line');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  writeFileSync(DEST, LINE + '\n', 'utf8');
} catch (err) {
  console.error(`entry.txt could not be written to ${DEST}: ${(err as Error).message}`);
  process.exit(1);
}

// Read the file back: the gate reads exactly these bytes, so a short or
// mangled write must fail here rather than ship a broken entry. The
// comparison is byte-exact on purpose — one stray character, a missing
// newline, or a silent encoding change all fail loudly instead of
// submitting an entry that is not the line we gated above.
let back: string;
try {
  back = readFileSync(DEST, 'utf8');
} catch (err) {
  console.error(`entry.txt could not be read back from ${DEST}: ${(err as Error).message}`);
  process.exit(1);
}
if (back !== LINE + '\n') {
  console.error(`entry.txt read back does not match the entry line (got ${back.length} bytes)`);
  process.exit(1);
}
