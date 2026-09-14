#!/usr/bin/env node
/**
 * scripts/scribe-exemplars.mjs — THE EXEMPLAR PACK, AS A DENO MODULE (W3a car 1; chair ruling 31).
 *
 * ⛔ WHY IT IS GENERATED AND NOT HAND-TRANSCRIBED. `voice.ts` is a hand transcription with a
 * length pin, and it is 21 KB; the exemplar pack is 66 KB and moves whenever the corpus lane
 * re-cuts it. A hand copy of that size is a copy that drifts, and the estate already knows what
 * two copies of one law do. So the markdown under `docs/content/` is the ONE source and this
 * script derives the module from it, in `voice.ts`'s own idiom — one double-quoted literal plus
 * a `_CHARS` pin so a truncated or re-wrapped copy reds rather than shortens.
 *
 * ⛔ THE EDGE FUNCTION CANNOT READ A FILE. Deno Deploy ships the function's module graph and
 * nothing else, so the pack has to BE a module for the brief to carry it. The harness reads the
 * markdown directly from the dock, which is the same bytes by construction (`--check` below).
 *
 *   node scripts/scribe-exemplars.mjs            write supabase/functions/scribe-render/exemplars.ts
 *   node scripts/scribe-exemplars.mjs --check    rebuild into memory and diff byte-for-byte
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/** The ONE source of the pack, in tree, read by the harness and by this script alike. */
export const EXEMPLAR_MD = 'docs/content/scribe-exemplar-pack.md';
/** The generated module the edge function imports. */
export const EXEMPLAR_TS = 'supabase/functions/scribe-render/exemplars.ts';

/**
 * The module source, as bytes.
 * @returns {{source: string, chars: number}}
 */
export function buildExemplarsModule() {
  const md = readFileSync(join(ROOT, EXEMPLAR_MD), 'utf8');
  const source = `/**
 * scribe-render/exemplars.ts — THE EXEMPLAR PACK, GENERATED. DO NOT EDIT BY HAND.
 *
 * Generated from ${EXEMPLAR_MD} by scripts/scribe-exemplars.mjs. Edit the markdown and re-run:
 *
 *   node scripts/scribe-exemplars.mjs
 *
 * ⛔ IT IS THE SELECTOR'S GROUND AND NEVER A REFUTER'S FINDING. No clause of the pack is an arm,
 * a gate or a floor; the bars that DROP a unit are in the brief above it and in the tier-0
 * instruments. The pack is what good looks like in this register, which is a different kind of
 * thing from a rule, and the brief says so where it introduces it.
 *
 * IT IS ALSO THE CACHED PREFIX'S BULK, which is why it is a module-level constant: these bytes
 * are written once per hour per model and read at a fraction of the price on every tab of every
 * settlement after that.
 */

export const SCRIBE_EXEMPLARS = ${JSON.stringify(md)};

/** The pack's own length, so a truncated or re-wrapped copy reds rather than shortens. */
export const SCRIBE_EXEMPLARS_CHARS = ${md.length};
`;
  return { source, chars: md.length };
}

async function main() {
  const check = process.argv.includes('--check');
  const out = join(ROOT, EXEMPLAR_TS);
  const { source, chars } = buildExemplarsModule();
  const kb = (Buffer.byteLength(source, 'utf8') / 1024).toFixed(1);
  if (check) {
    if (!existsSync(out)) {
      console.error(`${EXEMPLAR_TS} is missing; run \`node scripts/scribe-exemplars.mjs\`.`);
      process.exit(1);
    }
    if (readFileSync(out, 'utf8') !== source) {
      console.error(`${EXEMPLAR_TS} is stale; run \`node scripts/scribe-exemplars.mjs\`.`);
      process.exit(1);
    }
    console.log(`[scribe-exemplars] verified ${EXEMPLAR_TS} (${chars} chars of pack, ${kb} KB module)`);
    return;
  }
  writeFileSync(out, source);
  console.log(`[scribe-exemplars] wrote ${EXEMPLAR_TS} (${chars} chars of pack, ${kb} KB module)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
