#!/usr/bin/env node
/**
 * scripts/fact-layers-door.mjs — THE DOOR of the layer walker's register (W2-A-LEAVES, 2026-11-12).
 *
 *   node scripts/fact-layers-door.mjs            read the tree; print every arm's rows against the register
 *   node scripts/fact-layers-door.mjs --shrink   write the register ONLY where the tree reads LESS: a row
 *                                                falls or goes; refused (exit 1, nothing written) if any row
 *                                                would rise or any new row would be born
 *
 * The register (`tests/lint/factLayers.register.json`) is shrink-only from its first commit. A cure lowers it
 * through this door in the same commit; nothing ever raises it. The walker
 * (`tests/lint/factLayers.walker.test.js`) holds the tree equal to the register, so a new violation is red in
 * the lane that writes it, and a cure that does not lower the register is red too.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  REGISTER_REL, POOL_TABLE_REL, ROOT, corpusPools, gridBirths, leafArm, poolArm, readJson, readerArm,
} from '../tests/lint/factLayers.shared.mjs';

const shrink = process.argv.includes('--shrink');

/** The three arms, read now, in the register's shape. */
async function now() {
  const leaves = await leafArm(await gridBirths());
  const pools = await poolArm(await corpusPools(), readJson(POOL_TABLE_REL).rows);
  return {
    leaves: Object.fromEntries(Object.entries(leaves).filter(([, v]) => v.violations.length).map(([k, v]) => [k, v.violations])),
    pools: pools.violations,
    readers: readerArm(),
  };
}

const reg = readJson(REGISTER_REL);
const tree = await now();
/** @type {string[]} */ const rises = [];
/** @type {string[]} */ const falls = [];
for (const arm of /** @type {const} */ (['leaves', 'pools'])) {
  for (const [id, list] of Object.entries(tree[arm])) {
    const banked = new Set(reg[arm][id] || []);
    for (const x of list) if (!banked.has(x)) rises.push(`${arm} ${id}: ${x}`);
  }
  for (const [id, list] of Object.entries(reg[arm])) {
    for (const x of list) if (!(tree[arm][id] || []).includes(x)) falls.push(`${arm} ${id}: ${x}`);
  }
}
for (const [file, fams] of Object.entries(tree.readers)) {
  for (const [fam, n] of Object.entries(fams)) {
    const banked = reg.readers[file]?.[fam] ?? 0;
    if (n > banked) rises.push(`readers ${file} ${fam}: ${banked} → ${n}`);
  }
}
for (const [file, fams] of Object.entries(reg.readers)) {
  for (const [fam, n] of Object.entries(/** @type {Record<string, number>} */ (fams))) {
    const m = tree.readers[file]?.[fam] ?? 0;
    if (m < n) falls.push(`readers ${file} ${fam}: ${n} → ${m}`);
  }
}
for (const r of rises) console.log(`RISE  ${r}`);
for (const f of falls) console.log(`FALL  ${f}`);
console.log(`fact-layers door: ${rises.length} rise(s), ${falls.length} fall(s)`);
if (rises.length) {
  console.log('REFUSED: the register is shrink-only; cure the rise, never bank it.');
  process.exit(1);
}
if (shrink && falls.length) {
  writeFileSync(join(ROOT, REGISTER_REL), `${JSON.stringify({ ...reg, ...tree }, null, 1)}\n`);
  console.log(`written: ${REGISTER_REL}`);
}
