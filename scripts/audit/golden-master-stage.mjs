#!/usr/bin/env node
/**
 * scripts/audit/golden-master-stage.mjs — THE GENERATOR GOLDEN MASTER'S BYTES AT ANY TREE, WITHOUT THE DOOR.
 *
 * WHAT IT IS. A measuring tool, never a writer of a golden: it imports `generateSettlementPipeline`
 * and `goldenCorpus` FROM THE TREE NAMED ON THE COMMAND LINE (a scratch worktree at a first-parent
 * step of a window branch, say) and prints, or writes to a scratch path, the exact manifest bytes
 * `tests/property/generatorGoldenMaster.test.js` would hand the signed door at that tree. With
 * `--against <manifest.json>` it also prints how many rows move, by tier, so a shift record's
 * `predictedRows` and its `_doc` row figures can be MEASURED before the write (README step 1).
 *
 * WHY IT EXISTS ON THE TREE. The staged-tree method (DOORS-2 ruling 1; LANDING-3's brief) writes one
 * signed record per moving step from the stage at that step's commit. Every window so far rebuilt
 * this measurement in a scratch kit that died with its session (LANDING-2's report: "the golden-master
 * bytes per tree via generateSettlementPipeline plus goldenCorpus, ~28 s per stage"); the door to the
 * measurement now lives here.
 *
 * ⛔ IT WRITES NO FIXTURE. `--out` must name a path outside tests/fixtures/; the golden itself moves only
 * through tests/helpers/goldenRecordDoor.js with a signed record.
 *
 * Usage:
 *   node scripts/audit/golden-master-stage.mjs <tree> [--out <scratch.json>] [--against <manifest.json>]
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const tree = args[0];
if (!tree || tree.startsWith('--')) {
  console.error('usage: golden-master-stage.mjs <tree> [--out <scratch.json>] [--against <manifest.json>]');
  process.exit(2);
}
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};
const out = flag('--out');
const against = flag('--against');
if (out && /tests[\\/]fixtures[\\/]/.test(resolve(out))) {
  console.error('refused: --out names a path under tests/fixtures/; a golden moves only through the signed door');
  process.exit(2);
}

const root = resolve(tree);
const { generateSettlementPipeline } = await import(pathToFileURL(`${root}/src/generators/generateSettlementPipeline.js`).href);
const { goldenCorpus, keyOf } = await import(pathToFileURL(`${root}/tests/helpers/goldenMasterCorpus.js`).href);

const started = Date.now();
const manifest = {};
for (const config of goldenCorpus()) {
  const { _seed, ...cfg } = config;
  const settlement = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  manifest[keyOf(config)] = createHash('sha256').update(JSON.stringify(settlement)).digest('hex');
}
// The suite's own serialization, byte for byte.
const bytes = JSON.stringify(manifest, Object.keys(manifest).sort(), 2) + '\n';
const sha = createHash('sha256').update(bytes).digest('hex');
if (out) writeFileSync(out, bytes, 'utf8');

const summary = { tree: root, rows: Object.keys(manifest).length, sha256: sha, seconds: Math.round((Date.now() - started) / 1000) };
if (against) {
  const prior = JSON.parse(readFileSync(against, 'utf8'));
  const byTier = {};
  let moved = 0;
  let added = 0;
  for (const [key, hash] of Object.entries(manifest)) {
    if (!(key in prior)) { added += 1; continue; }
    if (prior[key] !== hash) {
      moved += 1;
      const tier = key.split('|')[0];
      byTier[tier] = (byTier[tier] ?? 0) + 1;
    }
  }
  const removed = Object.keys(prior).filter((k) => !(k in manifest)).length;
  Object.assign(summary, { moved, added, removed, byTier });
}
console.log(JSON.stringify(summary));
