#!/usr/bin/env node
/**
 * scripts/audit/refence.mjs — THE ESPIONAGE FENCE'S DRIVEN CORPUS, MEASURED AT ANY TREE, AND ITS NEW BYTES PRODUCED.
 *
 * WHAT IT IS. `tests/property/espionageDormancyFence.test.js` pins `PRE_COUPLING_CORPUS_SHA`, the hash of 360
 * settlements (six tiers x four route accesses x fifteen seeds) driven at the tip. The fence's header says the constant
 * is re-recorded ONLY inside a named chartered window, "through the door" — and until this file the only writer of that
 * door traffic lived in a seat's scratch kit (the DOORS seats' `fence.mjs` / `fence-door.mjs`). This is that writer on
 * the tree, so the door exists where the next window can find it.
 *
 * TWO MODES, AND NEITHER WRITES THE TREE:
 *   node scripts/audit/refence.mjs <tree> [--rows-out <scratch.tsv>] [--against <prior.tsv>]
 *       measures the corpus FROM <tree>'s own generator: prints the corpus sha, the distinct count and, with
 *       --against, how many of the 360 rows moved and by tier.
 *   node scripts/audit/refence.mjs <tree> --produce <scratch.js> --header <block.txt>
 *       additionally writes, to a SCRATCH path, the fence file's next bytes: <tree>'s fence file with the constant
 *       replaced (it must occur exactly once) and <block.txt> inserted as the newest movement block. Those bytes reach
 *       the tree only through `scripts/audit/door-write.mjs`, i.e. through tests/helpers/goldenRecordDoor.js with a
 *       signed record — never by this script.
 *
 * ⛔ THE CORPUS IS RE-SPELLED HERE (the fence keeps its corpus private), so the spelling is PROVEN, not trusted: a run
 * at a tree whose fence is green must print that tree's own constant. The fence's own plain run stays the receipt.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const FENCE_REL = 'tests/property/espionageDormancyFence.test.js';
const CONSTANT_RE = /const PRE_COUPLING_CORPUS_SHA = '([0-9a-f]{64})';/g;
const NEWEST_BLOCK_ANCHOR = ' * 2026-09-01, TE-AGNOSTIC-1 cars `f2c1ad181` / `97d119c9b`); before that at T8.\n *\n';

const CORPUS_TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CORPUS_ROUTES = ['road', 'isolated', 'port', 'crossroads'];
const CORPUS_SEEDS = 15;

/** The fence's own key-sorted serializer, verbatim. */
function stable(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
}
const sha = (s) => createHash('sha256').update(s).digest('hex');

const args = process.argv.slice(2);
const tree = args[0];
if (!tree || tree.startsWith('--')) {
  console.error('usage: refence.mjs <tree> [--rows-out f] [--against f] [--produce <scratch.js> --header <block.txt>]');
  process.exit(2);
}
const flag = (name) => { const i = args.indexOf(name); return i === -1 ? null : args[i + 1]; };
const root = resolve(tree);
const { generateSettlementPipeline } = await import(pathToFileURL(`${root}/src/generators/generateSettlementPipeline.js`).href);

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
const corpusSha = sha(rows.join('\n'));
const distinct = new Set(rows.map((row) => row.split('\t')[3])).size;
const summary = { tree: root, rows: rows.length, distinct, corpusSha };

const rowsOut = flag('--rows-out');
if (rowsOut) writeFileSync(rowsOut, `${rows.join('\n')}\n`, 'utf8');
const against = flag('--against');
if (against) {
  const prior = new Map(readFileSync(against, 'utf8').trim().split('\n').map((l) => { const p = l.split('\t'); return [p[2], p[3]]; }));
  const byTier = {};
  let moved = 0;
  for (const row of rows) {
    const [tier, , seed, hash] = row.split('\t');
    if (prior.get(seed) !== hash) { moved += 1; byTier[tier] = (byTier[tier] ?? 0) + 1; }
  }
  Object.assign(summary, { moved, byTier });
}

const produce = flag('--produce');
if (produce) {
  const headerPath = flag('--header');
  if (!headerPath) { console.error('--produce needs --header <block.txt>'); process.exit(2); }
  if (/tests[\\/]/.test(resolve(produce))) { console.error('refused: --produce must name a scratch path, never the tree'); process.exit(2); }
  const text = readFileSync(`${root}/${FENCE_REL}`, 'utf8');
  const hits = [...text.matchAll(CONSTANT_RE)];
  if (hits.length !== 1) { console.error(`refused: the constant occurs ${hits.length} times, not once`); process.exit(1); }
  if (text.split(NEWEST_BLOCK_ANCHOR).length !== 2) { console.error('refused: the movement-list anchor does not occur exactly once'); process.exit(1); }
  const block = readFileSync(headerPath, 'utf8').replace(/\n?$/, '\n');
  const next = text
    .replace(NEWEST_BLOCK_ANCHOR, `${NEWEST_BLOCK_ANCHOR}${block} *\n`)
    .replace(CONSTANT_RE, `const PRE_COUPLING_CORPUS_SHA = '${corpusSha}';`);
  writeFileSync(produce, next, 'utf8');
  Object.assign(summary, { priorSha: hits[0][1], produced: produce });
}
console.log(JSON.stringify(summary));
