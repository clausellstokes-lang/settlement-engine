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
  const dress = dressPage(page, {
    lens,
    roadWidth: input.roadWidth,
    walls,
    tier: fabric.meta.tier,
    ringOfFace: (fid) => (P.arrangement.faces[fid] && P.arrangement.faces[fid].alive
      ? faceRing(P.arrangement, fid) : null),
    ...over,
  });
  const acc = lens === 'accessible'
    ? accessibleHatch(page, { roadWidth: input.roadWidth }) : { svg: '', segments: 0 };
  const F = dress.frame;
  const pad = input.roadWidth * 4;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(F.x - pad).toFixed(2)}`
    + ` ${(F.y - pad).toFixed(2)} ${(F.w + pad * 2).toFixed(2)} ${(F.h + pad * 2).toFixed(2)}"`
    + ` width="1000" height="${Math.max(1, Math.round(1000 * (F.h + pad * 2) / (F.w + pad * 2)))}">`
    + dress.svg + acc.svg + '</svg>';
  return {
    key, tier: fabric.meta.tier, lens, svg, dress, page, walls, acc,
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
