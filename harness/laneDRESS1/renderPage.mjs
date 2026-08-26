#!/usr/bin/env node
/**
 * harness/laneDRESS1/renderPage.mjs — ⭐⭐⭐ DRESS-1 · **THE PARTITION PAGE, INKED.**
 *
 * The folio still paints the LEGACY fabric (§686.6(iii)), so this harness renders the partition
 * page as its own artifact. That is deliberate and it is what makes the DORMANCY exit trivially
 * true rather than argued: `renderFolio.mjs` is not touched by this wave, so the shipped corpus
 * render is byte-identical by construction — and the claim is proved by executing both, not by
 * reasoning about it. At the port the folio switches over; until then the ink is judged here.
 *
 * Usage: node harness/laneDRESS1/renderPage.mjs [outDir] [--leaves=a,b] [--lens=parchment]
 *                                               [--lenses=all] [--json=<path>]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
import { publishWallWorks } from '../../src/domain/townMap/fabric/wallPublication.js';
import { dressPage, accessibleHatch } from '../../src/domain/townMap/fabric/partitionDress.js';
import { seatPartition } from '../../src/domain/townMap/fabric/partitionSeating.js';
import { wallForm } from '../../src/domain/townMap/fabric/walls.js';
import { pubOpts } from '../laneSPINE3/pubOpts.mjs';
import { faceRing } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { LENS_IDS } from '../../src/domain/townMap/fabric/folioLenses.js';

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const outDir = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'out/dress1';
const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);
const lenses = arg('lenses', '') === 'all' ? [...LENS_IDS] : [arg('lens', 'parchment')];

/** ⭐ ONE LEAF, ONE PAGE, ONE DRESS — exported so probes measure the harness, never a fork. */
export function dressLeaf(key, lens = 'parchment', over = {}) {
  const spec = CORPUS.find((s) => s.key === key);
  if (!spec) throw new Error(`NO_SUCH_LEAF ${key}`);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const page = projectPage(P, { roadWidth: input.roadWidth });
  // ⭐ SPINE-3 · ONE SPELLING (`harness/laneSPINE3/pubOpts.mjs`) — it carries the SITE and the
  //   present year from the key the fabric actually publishes. See that file for the two facts
  //   every caller here was silently dropping.
  const walls = publishWallWorks(P, {
    ...pubOpts(settlement, fabric, input),
  });
  // ⭐⭐ ⟦CAR-SEATING W3⟧ the seated institutions, computed here and handed to the dress the same
  //   way `walls` is. It cannot ride the page: the seating pass READS the page (`bound`, `gates`,
  //   `voids`, `water`), so a page key would be a cycle — see `buildFabric.js`'s sibling publication.
  const seating = seatPartition(P, page, settlement, {
    prosperity: (settlement.economicState || {}).prosperity || null,
    tier: fabric.meta.tier,
  });
  const dress = dressPage(page, {
    lens,
    roadWidth: input.roadWidth,
    walls,
    seating,
    // ⭐⭐ ⟦DRESS-2 W1⟧ THE §10 REGISTER, CROSSING THE BRIDGE. `fabric.stateMarks` is already in
    //   scope here (this function returns the fabric so the corpus arm can drive both renderers
    //   off one build), and `partitionInputs` carries no state — so the page cannot know the leaf
    //   is besieged and the dress has to be told, exactly as it is told about `walls`.
    state: fabric.stateMarks,
    tier: fabric.meta.tier,
    ringOfFace: (fid) => (P.arrangement.faces[fid] && P.arrangement.faces[fid].alive
      ? faceRing(P.arrangement, fid) : null),
    ...over,
  });
  const acc = lens === 'accessible'
    ? accessibleHatch(page, { roadWidth: input.roadWidth }) : { svg: '', segments: 0 };
  // ⛔ THE 4×ROAD-WIDTH PAD IS GONE (DRESS-FRAME, ODQ §702.1). It was one of the three framing
  //    paths that disagreed, and the reference has **no margin constant at all** — it fits the
  //    settlement hard against the page edge. A pad also makes the settlement's share of the
  //    plate depend on the road width, which is a tier-varying quantity, so the very
  //    tier-invariance the fit exists to buy was being spent by the padding.
  const F = dress.frame;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${F.x.toFixed(2)}`
    + ` ${F.y.toFixed(2)} ${F.w.toFixed(2)} ${F.h.toFixed(2)}"`
    + ` width="1000" height="${Math.max(1, Math.round(1000 * F.h / F.w))}">`
    + dress.svg + acc.svg + '</svg>';
  return {
    key, tier: fabric.meta.tier, lens, svg, dress, page, walls, acc, seating,
    /** ⭐ THE FABRIC THE LEAF WAS BUILT FROM, published so a caller that also needs the FOLIO
     *  plate of the same leaf can render both from ONE build. The corpus-render gate arm
     *  (DRESS-FRAME, ODQ §703.4) is that caller, and without this it paid for the fabric twice. */
    fabric, settlement, model, input,
    // ⛔ `Buffer.byteLength`, NEVER `.length` — SIGNED_CONSTANTS' own instruction.
    bytes: Buffer.byteLength(svg, 'utf8'),
    ops: dress.elements,
    primitives: dress.primitives,
    pageShapes: page.budget.shapes,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  mkdirSync(outDir, { recursive: true });
  const rows = [];
  for (const key of leaves) {
    for (const lens of lenses) {
      const r = dressLeaf(key, lens);
      writeFileSync(join(outDir, `${key}-${r.tier}-${lens}.svg`), r.svg);
      rows.push({
        key: r.key, tier: r.tier, lens, bytes: r.bytes, ops: r.ops, primitives: r.primitives,
        pageShapes: r.pageShapes, census: r.dress.census,
      });
      console.log(`${key.padEnd(12)} ${r.tier.padEnd(11)} ${lens.padEnd(12)}`
        + ` bytes ${String(r.bytes).padStart(7)} ops ${String(r.ops).padStart(3)}`
        + ` prims ${String(r.primitives).padStart(6)} pageShapes ${String(r.pageShapes).padStart(5)}`
        + `  ridges ${r.dress.census.ridges}/${r.dress.census.ridgeClipped}clip/${r.dress.census.ridgeOutside}out`
        + ` grainOut ${r.dress.census.grainOutside}`);
    }
  }
  const j = arg('json', '');
  if (j) writeFileSync(j, JSON.stringify(rows, null, 1));
  console.log(`\n${rows.length} artifact(s) -> ${outDir}`);
}
