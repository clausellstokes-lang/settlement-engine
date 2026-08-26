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
import { dressPage, accessibleHatch, DRESS_LEGEND } from '../../src/domain/townMap/fabric/partitionDress.js';
import { seatPartition } from '../../src/domain/townMap/fabric/partitionSeating.js';
import { anchorStateMarks } from '../../src/domain/townMap/fabric/partitionState.js';
import { wallForm } from '../../src/domain/townMap/fabric/walls.js';
import { pubOpts } from '../laneSPINE3/pubOpts.mjs';
import { faceRing } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { LENS_IDS, resolveLens } from '../../src/domain/townMap/fabric/folioLenses.js';
import { scaleBarFor } from '../../src/domain/townMap/fabric/measure.js';
import { pageWords, groupInk, PAGE_SPAN, CARTOUCHE, WORDS_OP_BUDGET } from '../../src/domain/townMap/fabric/pageChrome.js';
import { spliceLettering } from '../../src/domain/townMap/fabric/lettering.js';

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
  // ⭐⭐⭐ ⟦CAR-STATE-BRIDGE · ODQ §710.6⟧ THE §10 REGISTER, RE-ANCHORED ONTO THE DRAWN PAGE.
  //   `fabric.stateMarks` is derived against the LEGACY geometry — `walls[].gates`, `web.roads`,
  //   `meta.builtRadius` — and the dress draws the PARTITION, so the marks existed, passed every
  //   count, and landed nowhere: `siege` 9 tents 0 of them on the page, `city` 12 camp huts inside
  //   the coast polygon. The pass sits exactly where `seatPartition` sits — a DOMAIN pass that
  //   reads the projected page — so `fabric.stateMarks` itself is never written and the folio's
  //   dormancy holds by construction rather than by argument.
  const state = anchorStateMarks(page, fabric.stateMarks, {
    frontage: fabric.meta.plotFrontage,
    roadWidth: input.roadWidth,
    centre: fabric.meta.centre,
    seats: (seating && Array.isArray(seating.seats)) ? seating.seats : [],
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
    //   ⟦CAR-STATE-BRIDGE⟧ it is now told the RE-ANCHORED register, computed above.
    state,
    // ⭐⭐ ⟦DRESS-2 W2⟧ THE LAND'S OWN MARKS, crossing the same bridge. `fabric.relief` reached
    //   `renderFolio` and nothing else; §646.2 convicted the dress page for having ZERO relief
    //   marks against a steep-hills cartouche, and that was literally true.
    relief: fabric.relief,
    // ⭐⭐⭐ ⟦REG-D⟧ THE DECLINE RECORD, CROSSING THE SAME BRIDGE. `partitionDecline` has been
    //   minting LOSSREGION faces since SPINE-2 and `partitionDress` contained ZERO occurrences of
    //   the class: 467 faces on `highwater` — 2.598 % of that plate — drawing nothing at all, so
    //   the dead quarter read as a STREET GRID WITH EMPTY BLOCKS (an unfinished drawing) rather
    //   than as a ruined one. Measured off the crop, not inferred from the absence.
    //   ⛔ IT IS THE PUBLISHED RECORD AND NOT THE FACES, because a RECLAIMED region has no face
    //   left (`recoverByPressure` returns the ground to FIELD) and survives ONLY here — PA.8's own
    //   rule for the census, applied to the ink that census measures.
    losses: P.losses,
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
  const base = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${F.x.toFixed(2)}`
    + ` ${F.y.toFixed(2)} ${F.w.toFixed(2)} ${F.h.toFixed(2)}"`
    + ` width="1000" height="${Math.max(1, Math.round(1000 * F.h / F.w))}">`
    + dress.svg + acc.svg + '</svg>';
  /**
   * ⭐⭐⭐ ⟦CAR-WORDS-2 · ODQ §717⟧ **THE WORDS LAYER, SPLICED OVER THE FINISHED PAGE.**
   *
   * REG-F0 measured this surface at **ZERO `<text>` on 18 of 18 leaves** against the folio's 950
   * (F0-31 chrome, F0-32 legend, F0-33 the lettering). The cure is `pageChrome.js` + the shipped
   * `lettering.js` typesetter, and it runs HERE rather than inside `dressPage` for two reasons that
   * both matter:
   *   1 · §173's own law — *text placement is the one decision that cannot be made until everything
   *       else on the page exists* — which is why `renderFolio.mjs:3206` splices at exactly this
   *       point, over the finished draw list, on `injectFog`'s precedent.
   *   2 · ⛔ `partitionDress.js` is stage **S22** and `lettering.js` is **S23**. An import inside the
   *       dress would derive the cross-node edge `S23>S22` — a NEW public-order inversion the stage
   *       walker's arm 6 convicts. Spliced from the harness, and with `pageChrome.js` sitting on
   *       S23 beside `lettering.js`, no cross-node edge is created at all.
   *
   * ⚠ THE ARGUMENTS ARE ALL PLAIN DATA, and the two that carry a UNIT say which (§711.6):
   *   • `bar` is a `scaleBarFor` result in **WORLD** units — `measure.metresPerUnit` is metres per
   *     world unit, so the room it is asked for is a world-unit room and `pageChrome` converts the
   *     answer to page px through the ONE projector.
   *   • `legendRows` is the leaf's OWN drawn families. Scoping to `dress.groups` is what makes the
   *     §692.9 caution mechanical rather than remembered: the four rows that teach marks the
   *     parchment plate never draws (`dress-stepping`, `dress-barricade`, `dress-ruin-standing`,
   *     `dress-ruin-clearing`) are absent from `dress.groups` and so cannot be printed.
   */
  const words = pageWords({
    page,
    meta: fabric.meta,
    palette: resolveLens(lens).roles,
    districts: fabric.umbrella.partition,
    nameOf: (k) => {
      const o = fabric.organisms.find((x) => x.key === k);
      return o && o.name ? o.name : null;
    },
    // ⚠ THE ROOM IS ASKED FOR IN WORLD UNITS. `CARTOUCHE.w * 0.42` is the folio's own bar room in
    //   page px; `PAGE_SPAN / F.w` is page px per world unit, so the division is the room on the
    //   ground. Asking in page px would return a bar whose LABEL disagreed with its LENGTH.
    bar: fabric.measure ? scaleBarFor(fabric.measure, (CARTOUCHE.w * 0.42) / (PAGE_SPAN / F.w)) : null,
    legendRows: DRESS_LEGEND.filter((r) => dress.groups.includes(r.group)),
    inkOf: (g) => groupInk(dress.svg, g),
    notes: (fabric.immersion && fabric.immersion.notes) ? fabric.immersion.notes.notes : [],
    // ⚠ A REFUSAL BOUND, NOT A RATION — the dress page carries no signed op ceiling in this tree.
    //   See `WORDS_OP_BUDGET`. ⛔ The first spelling here derived it as
    //   `page.budget.shapes - dress.primitives`, which is two DIFFERENT quantities subtracted:
    //   `budget.shapes` counts PAGE shapes (2,520 on `town`) and `dress.primitives` counts DRAWN
    //   primitives (8,852), so the difference was negative on every leaf and the clamp was the only
    //   thing setting the budget. §711.6's class one more time — two units, one subtraction, and a
    //   number that looked like a derivation.
    budget: WORDS_OP_BUDGET,
  });
  const svg = spliceLettering(base, words.fragment);
  return {
    key, tier: fabric.meta.tier, lens, svg, dress, page, walls, acc, seating,
    /** ⭐ ⟦CAR-WORDS-2⟧ the words layer, published beside the ink so a census measures the SAME
     *  build the letters came from — projector, per-family counts, drops and refusals included. */
    words,
    /** ⭐ ⟦CAR-STATE-BRIDGE⟧ THE RE-ANCHORED §10 REGISTER — the geometry that was actually DRAWN.
     *  `fabric.stateMarks` is still published untouched beside it, so a census can measure the
     *  before and the after off ONE build and attribute the move. ⛔ A placement census that
     *  read `fabric.stateMarks` here would be measuring the surface the page does not draw. */
    state,
    /** ⭐ ⟦REG-D⟧ THE DECLINE RECORD, published beside the dress so `declineCensus` measures the
     *  SAME build the ink came from rather than a second one. PA.8: the totality census is defined
     *  over this record and never over a face-walk. */
    losses: P.losses,
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
        /** ⟦CAR-WORDS-2⟧ the words layer's own row, so a run's JSON carries the F0-31/32/33 exit */
        text: (r.svg.match(/<text\b/g) || []).length, words: r.words.census, wordsOps: r.words.ops,
      });
      console.log(`${key.padEnd(12)} ${r.tier.padEnd(11)} ${lens.padEnd(12)}`
        + ` bytes ${String(r.bytes).padStart(7)} ops ${String(r.ops).padStart(3)}`
        + ` prims ${String(r.primitives).padStart(6)} pageShapes ${String(r.pageShapes).padStart(5)}`
        + `  ridges ${r.dress.census.ridges}/${r.dress.census.ridgeClipped}clip/${r.dress.census.ridgeOutside}out`
        + ` grainOut ${r.dress.census.grainOutside}`
        + `  text ${String((r.svg.match(/<text\b/g) || []).length).padStart(3)}`
        + ` (${r.words.census.wards} quarter, ${r.words.census.legendRows} key, ${r.words.census.notes} note)`);
    }
  }
  const j = arg('json', '');
  if (j) writeFileSync(j, JSON.stringify(rows, null, 1));
  console.log(`\n${rows.length} artifact(s) -> ${outDir}`);
}
