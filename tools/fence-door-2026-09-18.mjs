#!/usr/bin/env node
/**
 * fence-door-2026-09-18.mjs — THE ONE-OFF DOOR RUNNER for `espionage-dormancy-fence`.
 * ⛔ DELIBERATELY NOT IN THE REPO: a one-off act leaves a commit, not a script.
 *
 * ⛔⛔ IT HAD A DEFECT THAT SHIPPED THE WRONG HISTORY, and the cure is the whole shape of
 * this file now. The first spelling hardcoded the record path AND the docblock paragraph,
 * so the SECOND act wrote the FIRST act's paragraph over its own movement: the same
 * heading, "THE SECOND MOVEMENT" when it was the third, citing a record and a cause that
 * had nothing to do with the rows that had just moved. A docblock is the only place a
 * reader learns WHY a frozen constant moved, and one naming the wrong cause is worse than
 * none. Every field of the paragraph is now taken from the record named by
 * GOLDEN_SHIFT_SIGNED — the same file the door itself verifies — or from the file being
 * edited. Nothing about the act is spelled twice.
 *
 * TWO MODES:
 *
 *   WRITE (default) — re-measure, refuse unless the measurement equals --expected, then
 *   rewrite `PRE_COUPLING_CORPUS_SHA`, insert the derived paragraph at the top of the
 *   header's chartered-windows enumeration, and re-record the register row, all through
 *   tests/helpers/goldenRecordDoor.js's `recordGolden`.
 *
 *     GOLDEN_SHIFT_SIGNED=docs/shift-records/<record>.json \
 *       node <this> --expected <64-hex> --moved <n-of-360> [--root <dir>] [--base <dir>]
 *
 *   --docblock-only — REPAIR a paragraph without moving the constant. Re-measures and
 *   refuses unless the measurement equals the constant ALREADY IN THE FILE (so the file's
 *   frozen bytes are provably correct and only its prose is wrong), replaces the topmost
 *   door-act paragraph with the one derived from this record, and re-records the register
 *   row — whose sha256 is of the TEST-FILE BYTES, so prose alone moves it and the row must
 *   be re-stamped through the door rather than by hand.
 *
 *     GOLDEN_SHIFT_SIGNED=docs/shift-records/<record>.json \
 *       node <this> --docblock-only --moved <n-of-360> [--root <dir>] [--confirm-replace]
 *
 *   ⚠ --docblock-only is a DRY RUN until --confirm-replace is given: it prints the
 *   paragraph it would delete and the one it would write, because replacing a paragraph is
 *   destructive to a history nothing else records, and a runner may not guess that the
 *   topmost one is the wrong one.
 *
 * EXIT CODES: 2 = refused or dry run, nothing written. 3 = the door fired and WROTE (its
 * success throw). 0 is impossible on a write path.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

// ── the fence's own recipe, replicated AND then proved equal to the tree's ───────────────
// ⛔ REPLICATION IS THE RISK THIS BLOCK EXISTS TO CLOSE. The fence exports neither `stable`
// nor `sha` nor its corpus constants, so they have to be copied — and a copy that silently
// drifts from the file it mirrors would hash a DIFFERENT corpus and write the answer to a
// question nobody asked. Every copy is checked against the live source before use.
const RECIPE_SOURCE_PINS = [
  "function stable(v) {\n  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';\n  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;\n  return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;\n}",
  "const sha = (s) => createHash('sha256').update(s).digest('hex');",
  "const CORPUS_TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);",
  "const CORPUS_ROUTES = Object.freeze(['road', 'isolated', 'port', 'crossroads']);",
  'const CORPUS_SEEDS = 15;',
  "const seed = `SUBw4-fence1-${tier}-${route}-${String(i).padStart(3, '0')}`;",
  "{ settType: tier, tier, tradeRouteAccess: route, culture: 'germanic' }, null, { seed },",
];

function stable(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
}
const sha = (s) => createHash('sha256').update(s).digest('hex');
const CORPUS_TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CORPUS_ROUTES = ['road', 'isolated', 'port', 'crossroads'];
const CORPUS_SEEDS = 15;

const FENCE_REL = 'tests/property/espionageDormancyFence.test.js';
const SURFACE = 'espionage-dormancy-fence';
const WINDOW_ANCHOR_RE = /^ \* ── \d{4}-\d{2}-\d{2}, .*\(owner-signed, through the door\).*$/m;
const ENUMERATION_ANCHOR = ' * ── 2026-09-02, T13 TRANS';
const CONSTANT_RE = /^const PRE_COUPLING_CORPUS_SHA = '([0-9a-f]{64})';$/m;
const DOOR_ACT_RE = /\(owner-signed, through the door\)/g;

const die = (code, msg) => { console.error(`\nREFUSED: ${msg}\n`); process.exit(code); };

// ── argv + the record the DOOR itself will verify ───────────────────────────────────────
const argv = process.argv.slice(2);
const has = (name) => argv.includes(name);
const flag = (name) => { const i = argv.indexOf(name); return i === -1 ? null : argv[i + 1] ?? null; };
const root = resolve(flag('--root') || process.cwd());
const docblockOnly = has('--docblock-only');
// --restamp-only: the header was repaired BY HAND (the derived paragraph could not say what
// the file needed); re-measure, refuse unless the tree equals the constant already in the
// file, then re-stamp the register row for the bytes as they stand. Nothing else moves.
const restampOnly = has('--restamp-only');
const expected = (flag('--expected') || '').trim().toLowerCase();
const basePath = flag('--base');
const movedFlag = flag('--moved');

// ⛔ THE RECORD PATH IS NOT A CONSTANT IN THIS FILE. It is whatever GOLDEN_SHIFT_SIGNED
// names, which is the file `recordGolden` reads and verifies — so the paragraph and the
// authorization can never describe two different acts, which is exactly what went wrong.
const signature = (process.env.GOLDEN_SHIFT_SIGNED ?? '').trim();
if (signature === '' || signature === '1') {
  die(2, 'GOLDEN_SHIFT_SIGNED must name the signed shift-record FILE. This runner writes the'
    + " docblock paragraph FROM that record, so without it there is nothing to write and no"
    + ' authorization to write it with.');
}
const recordAbs = resolve(root, signature);
const recordRel = relative(root, recordAbs);
let record;
try { record = JSON.parse(readFileSync(recordAbs, 'utf8')); } catch (e) { die(2, `cannot read/parse ${signature} (${e.message}).`); }
for (const field of ['ownerWords', 'ownerDate', 'cause']) {
  if (typeof record[field] !== 'string' || record[field].trim() === '') {
    die(2, `the record's '${field}' is empty. The paragraph is written FROM the record, so an`
      + ' empty field would become an empty claim in the file that explains a frozen constant.');
  }
}

if (!docblockOnly && !restampOnly && !/^[0-9a-f]{64}$/.test(expected)) {
  die(2, '--expected must be the 64-hex corpus hash the consist measurement printed. Without it'
    + ' this runner writes whatever it happened to measure, which is a rubber stamp, not a door.');
}
if (movedFlag === null && !basePath) {
  die(2, 'give --moved <n-of-360> (measured) or --base <pristine base worktree>. The paragraph'
    + ' states this figure and the runner will not invent one.');
}

// ── the recipe check ────────────────────────────────────────────────────────────────────
const fenceAbs = join(root, FENCE_REL);
let fenceSrc;
try { fenceSrc = readFileSync(fenceAbs, 'utf8'); } catch (e) { die(2, `cannot read ${FENCE_REL} under ${root} (${e.message}).`); }
for (const pin of RECIPE_SOURCE_PINS) {
  if (!fenceSrc.includes(pin)) {
    die(2, `the fence's recipe has changed under this runner. Not found in ${FENCE_REL}:\n\n${pin}\n\n`
      + 'A one-off runner that mirrors a moved target hashes the wrong corpus. Re-derive it, then re-run.');
  }
}
const constantMatch = fenceSrc.match(CONSTANT_RE);
if (!constantMatch) die(2, `no single \`const PRE_COUPLING_CORPUS_SHA = '<64hex>';\` line in ${FENCE_REL}.`);
if (fenceSrc.split('\n').filter((l) => CONSTANT_RE.test(l)).length !== 1) die(2, 'the constant appears more than once.');
const previousConstant = constantMatch[1];

// ── measure, with the fence's own anti-vacuity arms ──────────────────────────────────────
async function measure(treeRoot) {
  const url = pathToFileURL(join(treeRoot, 'src/generators/generateSettlementPipeline.js')).href;
  const { generateSettlementPipeline } = await import(url);
  const rows = [];
  for (const tier of CORPUS_TIERS) {
    for (const route of CORPUS_ROUTES) {
      for (let i = 0; i < CORPUS_SEEDS; i += 1) {
        const seed = `SUBw4-fence1-${tier}-${route}-${String(i).padStart(3, '0')}`;
        const settlement = generateSettlementPipeline(
          { settType: tier, tier, tradeRouteAccess: route, culture: 'germanic' }, null, { seed },
        );
        rows.push(`${tier}\t${route}\t${seed}\t${sha(stable(settlement))}`);
      }
    }
  }
  const want = CORPUS_TIERS.length * CORPUS_ROUTES.length * CORPUS_SEEDS;
  if (rows.length !== want) die(2, `the corpus is ${rows.length} rows, not ${want}.`);
  if (rows.some((r) => r.includes('\tERROR:'))) die(2, 'the corpus threw.');
  const distinct = new Set(rows.map((r) => r.split('\t')[3])).size;
  if (distinct !== rows.length) {
    die(2, `the corpus stopped discriminating seeds (${distinct} distinct of ${rows.length}). A collapsed`
      + ' corpus hashes stably to a WRONG constant and would read as a pass forever.');
  }
  return { rows, hash: sha(rows.join('\n')) };
}

const here = await measure(root);
const target = (docblockOnly || restampOnly) ? previousConstant : expected;
console.log(`measured  ${here.hash}`);
console.log(`${(docblockOnly || restampOnly) ? 'constant ' : 'expected '} ${target}`);
if (here.hash !== target) {
  die(2, (docblockOnly || restampOnly)
    ? 'the re-measurement does not equal the constant already in the file. --docblock-only repairs'
      + ' PROSE over frozen bytes that are already correct; this tree disagrees with those bytes, so'
      + ' what is owed is a signed movement, not a paragraph. NOTHING was written.'
    : 'the re-measurement does not equal --expected. NOTHING was written. Either the consist figure'
      + ' came from a different tree, or this tree is not the one that was measured.');
}

let moved = movedFlag === null ? null : Number(movedFlag);
if (basePath) {
  const base = await measure(resolve(basePath));
  const key = (r) => r.split('\t').slice(0, 3).join('\t');
  const baseMap = new Map(base.rows.map((r) => [key(r), r.split('\t')[3]]));
  const measured = here.rows.filter((r) => baseMap.get(key(r)) !== r.split('\t')[3]).length;
  if (moved !== null && moved !== measured) die(2, `--moved says ${moved} but the base comparison measures ${measured}. Nothing written.`);
  moved = measured;
}
if (!Number.isInteger(moved) || moved < 0 || moved > here.rows.length) die(2, '--moved must be an integer within the corpus size.');
console.log(`moved     ${moved} of ${here.rows.length}`);

// ── the paragraph, DERIVED FROM THE RECORD THIS RUN WAS AUTHORIZED BY ───────────────────
/** The shouted title the cause opens with — the heading, taken rather than invented. */
const titleMatch = record.cause.match(/^([A-Z0-9][A-Z0-9 ,'’-]{9,140}?)(?=[.,:])/);
// --restamp-only takes the header AS WRITTEN (its own doc above), so it derives no heading:
// a cause whose shouted clause quotes a lowercase title (this record's does) must not block
// the re-stamp of bytes the runner has just proven correct. Patched 2026-09-19 for act six.
if (!titleMatch && !restampOnly) {
  die(2, "the record's `cause` does not open with a shouted title clause, so this runner cannot take"
    + ' a heading from it. Give the cause a leading capitalised clause, or write the paragraph by'
    + ' hand — it will not be guessed.');
}
// The heading shares one line with the date and the rule, so it is capped rather than
// allowed to run the line to 140 columns; the full clause is in `cause` either way.
const rawHeading = (titleMatch ? titleMatch[1] : 'HAND-WRITTEN HEADER').trim();
const heading = rawHeading.length > 58 ? `${rawHeading.slice(0, 55).replace(/[ ,]+$/, '')}…` : rawHeading;
/** The cause's first sentence, QUOTED rather than paraphrased: the record is the authority. */
const moverMatch = record.cause.match(/^[\s\S]{40,}?\.(?=\s)/);
const mover = (moverMatch ? moverMatch[0] : record.cause).trim();
/**
 * Which movement this is — the paragraph's POSITION in the enumeration, counted from the
 * acts recorded BELOW it, never from a total. The enumeration is newest-first, so an
 * inserted paragraph sits above everything already there and a replaced one keeps the
 * position it occupied. ⚠ This counts what the FILE records, so if an act never got its
 * paragraph the numbering here will be short by one and say so loudly rather than quietly:
 * the ordinal is a claim about the enumeration, not about history.
 */
const ORDINALS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH'];
const priorActs = (fenceSrc.match(DOOR_ACT_RE) || []).length;
const actsBelow = (text, at) => (text.slice(at).match(DOOR_ACT_RE) || []).length;

const wrap = (text) => {
  const out = []; let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > 86) { out.push(` * ${line}`); line = word; } else line = line ? `${line} ${word}` : word;
  }
  if (line) out.push(` * ${line}`);
  return out.join('\n');
};

const buildParagraph = (ordinalIndex, from, to) => {
  const ordinal = ORDINALS[ordinalIndex] || `${ordinalIndex + 1}TH`;
  const rule = '─'.repeat(Math.max(4, 92 - (` * ── ${record.ownerDate}, ${heading} (owner-signed, through the door) `).length));
  const movementLine = from === to
    ? `The constant itself does NOT move in this act: these bytes were already correct and only this paragraph was wrong. \`${to.slice(0, 8)}…\` stands.`
    : `On THIS corpus ${moved} of ${here.rows.length} rows move; ${here.rows.length}/${here.rows.length} hashes stay distinct. \`${from.slice(0, 8)}…\` -> \`${to.slice(0, 8)}…\`.`;
  return `${` * ── ${record.ownerDate}, ${heading} (owner-signed, through the door) ${rule}`}
${wrap(`THE ${ordinal} MOVEMENT OF THIS CONSTANT since the genesis freeze, and like the ones before it a signed`
  + ` re-record under tests/helpers/goldenRecordDoor.js rather than a spend of the one window this file's STOP`
  + ` still names. The owner's order: "${record.ownerWords}" (${record.ownerDate}); the record is ${recordRel}`
  + ` (odqRow ${record.odqRow || '— blank in the record; the chair cites it'}). THE MOVER, IN THE RECORD'S OWN`
  + ` WORDS, because the record is the authority and this paragraph does not paraphrase it: ${mover}`)}
${wrap(movementLine)}
 *
`;
};

let nextSrc;
if (restampOnly) {
  nextSrc = fenceSrc;
  const acts = (fenceSrc.match(DOOR_ACT_RE) || []).length;
  console.log(`\n── RESTAMP ONLY: ${acts} door-act paragraph(s) stand as written; the register row takes sha256 of these bytes ──`);
} else if (docblockOnly) {
  const existing = fenceSrc.match(WINDOW_ANCHOR_RE);
  if (!existing) die(2, 'there is no door-act paragraph in the header to repair.');
  const blockStart = fenceSrc.indexOf(existing[0]);
  const blockEnd = fenceSrc.indexOf('\n *\n', blockStart) + '\n *\n'.length;
  const oldParagraph = fenceSrc.slice(blockStart, blockEnd);
  if (oldParagraph.includes(recordRel)) {
    die(2, `the topmost door-act paragraph already cites ${recordRel}. Nothing to repair — and this`
      + ' runner will not stack a second paragraph for the same record.');
  }
  const mode = flag('--mode') || 'replace';
  if (mode !== 'replace' && mode !== 'insert') die(2, "--mode must be 'replace' or 'insert'.");
  // REPLACE keeps the position the paragraph occupied; INSERT takes the one above it.
  const ordinalIndex = mode === 'replace' ? actsBelow(fenceSrc, blockEnd) : priorActs;
  const paragraph = buildParagraph(ordinalIndex, previousConstant, previousConstant);
  nextSrc = mode === 'replace'
    ? fenceSrc.slice(0, blockStart) + paragraph + fenceSrc.slice(blockEnd)
    : fenceSrc.slice(0, blockStart) + paragraph + fenceSrc.slice(blockStart);
  if (mode === 'insert') console.log('\n── MODE: INSERT (nothing is deleted) ─────────────────────');
  if (mode === 'replace') console.log(`\n── WOULD DELETE ──────────────────────────────────────────\n${oldParagraph}`);
  console.log(`── WOULD WRITE ───────────────────────────────────────────\n${paragraph}`);
  if (!has('--confirm-replace')) {
    console.log('DRY RUN. Replacing a paragraph destroys history nothing else records, and this runner');
    console.log('may not assume the topmost one is the wrong one. Re-run with --confirm-replace.');
    process.exit(2);
  }
  if (!nextSrc.includes(`const PRE_COUPLING_CORPUS_SHA = '${previousConstant}';`)) die(2, 'the constant would have moved; refusing.');
} else {
  if (!ENUMERATION_ANCHOR || fenceSrc.split(ENUMERATION_ANCHOR).length - 1 !== 1) {
    die(2, 'the chartered-windows enumeration anchor is absent or duplicated, so a new paragraph has'
      + ' no unambiguous home. The header was restructured; re-derive the anchor.');
  }
  const insertAt = fenceSrc.indexOf(WINDOW_ANCHOR_RE.test(fenceSrc) ? fenceSrc.match(WINDOW_ANCHOR_RE)[0] : ENUMERATION_ANCHOR);
  const paragraph = buildParagraph(priorActs, previousConstant, here.hash);
  nextSrc = `${fenceSrc.slice(0, insertAt)}${paragraph}${fenceSrc.slice(insertAt)}`
    .replace(CONSTANT_RE, `const PRE_COUPLING_CORPUS_SHA = '${here.hash}';`);
  if (!nextSrc.includes(`const PRE_COUPLING_CORPUS_SHA = '${here.hash}';`)) die(2, 'the constant rewrite did not take.');
}
if (!restampOnly && nextSrc === fenceSrc) die(2, 'the rewrite produced identical bytes; nothing to do.');

// ── the door ────────────────────────────────────────────────────────────────────────────
const { recordGolden } = await import(pathToFileURL(join(root, 'tests/helpers/goldenRecordDoor.js')).href);
try {
  recordGolden({ surface: SURFACE, path: fenceAbs, produce: () => nextSrc, root });
  die(2, 'the door returned without throwing, which it never does on a write.');
} catch (error) {
  const wrote = /RE-RECORDED through the signed door/.test(error.message);
  console.log(`\n${error.message}\n`);
  if (!wrote) { console.error('REFUSED by the door. Nothing was written.'); process.exit(2); }
  console.log((docblockOnly || restampOnly)
    ? `PRE_COUPLING_CORPUS_SHA unchanged at ${previousConstant}; the register row is re-stamped because its sha256 is of the TEST-FILE BYTES.`
    : `PRE_COUPLING_CORPUS_SHA  ${previousConstant}\n                      -> ${here.hash}`);
  console.log('\nWROTE, and exits non-zero BY DESIGN so a re-record can never read as a passing gate.');
  console.log('The receipt is the plain re-run: espionageDormancyFence + goldenFreeze.walker, green.');
  process.exit(3);
}
