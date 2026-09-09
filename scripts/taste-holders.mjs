#!/usr/bin/env node
/**
 * scripts/taste-holders.mjs — THE HOLDER STANDING OF THE TASTE'S TWO INTERESTED-FACT TOWNS
 * (TASTE car M-6; SITTING §Q.3, §R c-22; SEAM cars 5b and 5c).
 *
 * WHAT IT ANSWERS. SITTING §Q.3 gives an INTERESTED fact two licensed faces on one pool: the
 * player's as the office compiled it, the DM's naming the holder and its interest. §R c-22
 * fixes when a fact IS interested — a settlement-wide capture of the ruling structure makes
 * the STATE'S OWN ORGANS (office, court, treasury, watch) interested parties in their own
 * records, and no other kind. The writers of the taste's interested fact need to know, for
 * their own two towns, exactly which census rows that reaches; this script prints it.
 *
 *   node scripts/taste-holders.mjs               both towns, per kind and per row
 *   node scripts/taste-holders.mjs --out <file>  the machine-readable table beside it
 *
 * READ-ONLY except the `--out` file it is asked for.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { spineRows, WIRING_STATUS } from '../src/domain/prose/wiringCensus.js';
import { holdersOf, sourceOfForTown, STATE_ORGAN_KINDS } from '../src/domain/prose/holderTable.js';
import { INTERESTED_TOWNS, tasteTown } from '../tests/fixtures/tasteTowns.js';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

/**
 * ⭐ THE ONE ROW THE TASTE COMPOSES ITS INTERESTED FACT ON (SITTING §R c-22, the chair's own
 * worked example): a TREASURY-held fact whose shipped variant already cites a record holder,
 * so the DM face has a model in the corpus rather than an invention.
 */
export const INTERESTED_ROW = Object.freeze({
  block: 'DS-GEN-11',
  pool: 'viable: true: the arithmetic closes',
});

/**
 * The standing of every LICENSED census row on one town.
 * @param {object} settlement
 * @param {ReadonlyArray<object>} rows the census's SPINE rows
 */
export function standingOfTown(settlement, rows) {
  /** @type {Map<string, {named: number, interested: number}>} */
  const byKind = new Map();
  /** @type {Array<{at: string, kind: string, holder: string|null, interested: boolean, marks: string[]}>} */
  const interested = [];
  let licensed = 0;
  let named = 0;
  for (const row of rows) {
    if (row.status !== WIRING_STATUS.RESOLVED) continue;
    if (row.source?.standing !== 'LICENSED') continue;
    licensed += 1;
    const resolved = sourceOfForTown(row, settlement, {});
    if (resolved.holder) named += 1;
    for (const kind of row.source.kinds || []) {
      const seat = byKind.get(kind) || { named: 0, interested: 0 };
      // ⛔ A KIND IS COUNTED INTERESTED ONLY WHERE THIS TOWN NAMES A HOLDER FOR IT. A row can
      // carry TWO kinds (`muster + watch`, `court + watch`), and the row's own standing is the
      // OR over its pairs; attributing that standing to every kind on the row read `watch
      // 0/2` on the first cut — a kind with no holder in this town at all, reported as
      // interested twice through its partner's holder.
      const holders = holdersOf(kind, settlement).length > 0;
      if (holders) seat.named += 1;
      if (holders && resolved.standing === 'INTERESTED') seat.interested += 1;
      byKind.set(kind, seat);
    }
    if (resolved.standing === 'INTERESTED') {
      interested.push({
        at: `${row.block} :: ${row.pool}`,
        kind: row.source.kind,
        holder: resolved.holder,
        interested: true,
        marks: resolved.marks || [],
      });
    }
  }
  return {
    licensed, named, interested, byKind,
  };
}

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const outAt = argv.indexOf('--out');
  const census = JSON.parse(readFileSync(path.join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
  const rows = spineRows(census.rows);
  /** @type {Array<object>} */
  const table = [];
  for (const spec of INTERESTED_TOWNS) {
    const settlement = tasteTown(spec);
    const standing = standingOfTown(settlement, rows);
    console.log(`\n── ${spec.label.toUpperCase()} · ${spec.seed} · ${settlement.name} · ${settlement.tier}`
      + ` · criminalCaptureState ${settlement.powerStructure?.criminalCaptureState}`);
    console.log(`   LICENSED rows walked ${standing.licensed} · rows whose holder this town names`
      + ` ${standing.named} · rows INTERESTED ${standing.interested.length}`);
    const kinds = [...standing.byKind].sort((a, b) => b[1].interested - a[1].interested || (a[0] < b[0] ? -1 : 1));
    console.log(`   by KIND (named / interested): ${kinds.map(([k, v]) => `${k} ${v.named}/${v.interested}`).join(' · ')}`);
    console.log(`   the STATE'S ORGANS (§R c-22): ${STATE_ORGAN_KINDS.join(' · ')}`);
    const row = rows.find((r) => r.block === INTERESTED_ROW.block && r.pool === INTERESTED_ROW.pool);
    const resolved = row ? sourceOfForTown(row, settlement, {}) : null;
    console.log(`   THE TASTE'S ROW ${INTERESTED_ROW.block} :: ${INTERESTED_ROW.pool}`);
    console.log(`     kind ${resolved?.kind ?? '(none)'} · holder ${resolved?.holder ?? '(none)'}`
      + ` · standing ${resolved?.standing ?? '(no row)'} · marks ${(resolved?.marks || []).join(' ') || '(none)'}`);
    for (const hit of standing.interested.slice(0, 12)) {
      console.log(`     INTERESTED  ${hit.at.padEnd(48)} ${hit.kind} · ${hit.holder}`);
    }
    if (standing.interested.length > 12) console.log(`     … and ${standing.interested.length - 12} more`);
    table.push({
      label: spec.label,
      seed: spec.seed,
      name: settlement.name,
      tier: settlement.tier,
      criminalCaptureState: settlement.powerStructure?.criminalCaptureState ?? null,
      licensed: standing.licensed,
      named: standing.named,
      interestedRows: standing.interested.length,
      byKind: Object.fromEntries([...standing.byKind].map(([k, v]) => [k, v])),
      tasteRow: resolved ? {
        kind: resolved.kind, holder: resolved.holder, standing: resolved.standing, marks: resolved.marks,
      } : null,
      interested: standing.interested,
    });
  }
  if (outAt >= 0 && argv[outAt + 1]) {
    writeFileSync(argv[outAt + 1], `${JSON.stringify({ row: INTERESTED_ROW, towns: table }, null, 1)}\n`);
    console.log(`\n  wrote ${argv[outAt + 1]}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('taste-holders.mjs')) await main();
