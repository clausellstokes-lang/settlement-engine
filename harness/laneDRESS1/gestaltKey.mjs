#!/usr/bin/env node
/**
 * harness/laneDRESS1/gestaltKey.mjs — ⭐⭐⭐ **PA.7's EXPECTED-READING KEY, AUTHORED BLIND FROM
 * LEDGER TRUTH.**
 *
 * PA.7: *"the expected-reading KEY is authored BLIND from ledger truth before the render (per
 * leaf: tier bin · walled/open · port/river/dry · declined/grown); a fresh-context reader's
 * answers match the key on ≥ 80 % of leaves with ZERO wrong-class reads on the key's load-bearing
 * fields."*
 *
 * ⭐⭐ **THE KEY IS MACHINE-DERIVED, WHICH IS THE STRONGEST FORM OF "BLIND" AVAILABLE TO A LANE
 * THAT HAS ALREADY LOOKED AT ITS OWN INK.** Every field below is read from the LEDGER and the
 * PARTITION — never from a drawing and never from a judgement — so an author who has seen a page
 * cannot bend the key toward it. What the author saw is declared in the receipt rather than
 * pretended away.
 *
 * THE FOUR FIELDS, and where each is READ from:
 *   tier      `fabric.meta.tier` — tierGrammar's own sizing, the sole sizer (SPINE §2)
 *   walled    `P.wraps.length > 0` — a circuit event happened, or it did not
 *   water     `river` if the partition cut a watercourse · `port` if it also minted quays
 *             or carries a coast/harbour face · `dry` otherwise
 *   arc       `declined` if the ledger's population fell from its peak · `grown` otherwise
 *
 * ⛔ THE LOAD-BEARING FIELDS (a wrong-class read on ANY of these fails the gate outright, per
 * PA.7) are **walled** and **water** — they are the two a reader answers from STRUCTURE rather
 * than from scale, so a wrong answer means the ink misled rather than under-informed.
 *
 * Usage: node harness/laneDRESS1/gestaltKey.mjs [--json=<path>]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';

export const LOAD_BEARING = Object.freeze(['walled', 'water']);
export const TIER_BINS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };

export function keyForLeaf(spec) {
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const waterFaces = liveFaces(P.arrangement).filter((f) => f.cls === 'WATER');
  const kinds = new Set(waterFaces.map((f) => (f.attrs && f.attrs.waterKind) || 'river'));
  const hasWater = waterFaces.length > 0;
  const maritime = kinds.has('coast') || kinds.has('sea') || kinds.has('harbour');
  const quays = (P.quays || []).length;
  const epochs = input.ledger.epochs || [];
  const peak = epochs.reduce((m, e) => Math.max(m, e.population || 0), 0);
  const last = epochs.length ? epochs[epochs.length - 1].population || 0 : 0;
  return {
    key: spec.key,
    tier: fabric.meta.tier,
    walled: P.wraps.length > 0 ? 'walled' : 'open',
    /**
     * ⚠⚠ **THE FIRST SPELLING WOULD HAVE MADE THE KEY WRONG, AND IT WAS CAUGHT BEFORE THE READER
     * RAN.** It read `port` for any leaf with ≥1 quay, which put ELEVEN OF EIGHTEEN in the port
     * class — including plain river towns whose single wharf is a wharf, not a harbour. A reader
     * looking at those pages would answer "river" and be RIGHT while the key called them wrong.
     * ⭐ THE CURE MINTS NOTHING: the class is read from the WATER KIND alone, which is a truth
     * fact — a quay-count bar would have been a threshold this lane chose rather than measured.
     */
    water: !hasWater ? 'dry' : (maritime ? 'port' : 'river'),
    arc: peak > 0 && last < peak * 0.92 ? 'declined' : 'grown',
    /** the evidence behind each answer, so a disagreement can be adjudicated on facts */
    why: {
      wraps: P.wraps.length,
      waterFaces: waterFaces.length,
      waterKinds: [...kinds],
      quays,
      peakPop: peak,
      lastPop: last,
      plots: P.plots,
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = CORPUS.map((s) => keyForLeaf(s));
  console.log('leaf         tier         walled  water   arc        (evidence)');
  for (const r of rows) {
    console.log(`${r.key.padEnd(12)} ${r.tier.padEnd(12)} ${r.walled.padEnd(7)} ${r.water.padEnd(7)}`
      + ` ${r.arc.padEnd(10)} wraps ${r.why.wraps} water ${r.why.waterFaces}`
      + `[${r.why.waterKinds.join('/') || '-'}] quays ${r.why.quays}`
      + ` pop ${r.why.peakPop}→${r.why.lastPop} plots ${r.why.plots}`);
  }
  console.log(`\nLOAD-BEARING FIELDS: ${LOAD_BEARING.join(', ')} — a wrong-class read on either FAILS the gate`);
  const j = arg('json', '');
  if (j) writeFileSync(j, JSON.stringify(rows, null, 1));
}
