#!/usr/bin/env node
/**
 * harness/laneDRESS2/statePlacementCensus.mjs — ⛔⛔ **THE RED W1's OWN CENSUSES COULD NOT SEE.**
 *
 * ═══ HOW THIS WAS FOUND, AND WHY THAT MATTERS MORE THAN THE DEFECT ═══
 * W1 shipped the §10 register onto the page and every census it wrote came back green: the
 * element-diff counted the new marks, the legend census closed its bijection, the value census
 * cleared every rung, the gate ran 20 files / 479 tests. **A fresh-context reader with no project
 * knowledge convicted it in one pass**, saying of the siege and plague plates:
 *
 *   *"three short parallel black strokes float in open country north-west of the wall, touching
 *    nothing, at no gate, no road, no building, and unlike any other symbol on the sheet. I cannot
 *    assign it a meaning."*
 *
 * and of the migration plate: *"both read as glyphs that have come off their anchors."*
 *
 * ⭐⭐ **THE CLASS, AND IT GENERALISES BEYOND THIS CAR: EVERY CENSUS W1 WROTE ASKED WHETHER THE
 * MARK EXISTS. NOT ONE ASKED WHETHER IT IS ON THE THING IT MEANS.** A count, a roster bijection and
 * a tone ratio are all satisfied by ink in the wrong place. This file asks the missing question.
 *
 * ═══ THE DEFECT, MEASURED ═══
 * `deriveStateMarks` anchors on the LEGACY fabric's geometry — `walls[].gates` (the legacy rings),
 * `web.roads`, `meta.centre`, `meta.builtRadius` — while the dress page draws the PARTITION's wall
 * band, ways and water. Same coordinate space, DIFFERENT GEOMETRY. So:
 *
 *   siege      9 tents derived, **0 inside the fitted page** — the camp is entirely off-plate
 *   siege      barredGate 81.5 u from the nearest DRAWN wall band = **16.1 road widths**
 *   plague     one quarantineBar off-page; the other 81.5 u (16.1 road widths) from the band
 *   migration  2 of 4 watch-fires off-page; the rest 9.7 and 11.4 road widths from the band
 *   city       12 camp huts 23.7 u from the drawn water ring — the reader saw them IN the bay
 *   famine     6 empty stalls, ALL in frame and correctly placed
 *
 * ⭐ **THE FAMINE ROW IS THE CONTROL THAT PROVES THE DIAGNOSIS.** Its stalls anchor to
 * `web.squares[0]` — the market — which BOTH surfaces put in the same place. The one family
 * anchored to something the two geometries agree about is the one family that lands correctly.
 *
 * ═══ ⛔ WHY THIS FILE REPORTS RATHER THAN CURES ═══
 * Two cures exist and NEITHER is inside a dress car's boundary:
 *   (a) re-derive `stateMarks` against the partition — but `fabric.stateMarks` is also consumed by
 *       `renderFolio` §15b and by `groundRefusal`'s drawn-body census, so moving it would move the
 *       shipped corpus render and take the folio dormancy claim with it;
 *   (b) re-anchor at DRAW time in `partitionDress` — but that is a renderer deciding where a world
 *       fact belongs, which is exactly what `partitionView`'s own law forbids.
 * ⇒ It is a BRIDGE car of its own: the same shape as CAR-SEATING §708.2 and as DRESS-2 W1/W2, one
 * layer deeper. Chartering it is the chair's act.
 *
 * ⚠ THIS CENSUS IS DELIBERATELY **NOT** WIRED INTO THE VITEST GATE. It reds today, on purpose, and
 * a gate arm that reds at its own tip is a broken gate rather than an honest one. It is executable,
 * reproducible and exits non-zero so that whoever cures the anchoring has a bar to clear — and it
 * SHOULD become a gate arm in the same commit that cures it.
 *
 * Usage: node harness/laneDRESS2/statePlacementCensus.mjs [--leaves=a,b] [--json=<p>]
 */
import { writeFileSync } from 'node:fs';
import { dressLeaf } from '../laneDRESS1/renderPage.mjs';
import { CORPUS } from '../exemplars.mjs';

/**
 * The bar, in ROAD WIDTHS, and stated in road widths for §179's reason: a gate passage is about a
 * road wide at every tier, so a mark that means "this gate is shut" has to sit within a couple of
 * road widths of a drawn gate to mean it. Three is generous.
 */
export const GATE_REACH_RW = 3;

const dmin = (p, rings) => {
  let best = Infinity;
  for (const r of rings) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i]; const b = r[(i + 1) % r.length];
      const vx = b[0] - a[0]; const vy = b[1] - a[1];
      const L2 = vx * vx + vy * vy || 1;
      const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L2));
      const d = Math.hypot(p[0] - (a[0] + vx * t), p[1] - (a[1] + vy * t));
      if (d < best) best = d;
    }
  }
  return best;
};

/** the two families whose whole meaning is WHERE they are */
const GATE_ANCHORED = new Set(['barredGate', 'quarantineBar']);

export function placementOf(leafKey) {
  const r = dressLeaf(leafKey, 'parchment');
  const F = r.page.frame;
  const rw = r.input.roadWidth;
  const inF = (x, y) => x >= F.x && x <= F.x + F.w && y >= F.y && y <= F.y + F.h;
  const band = r.page.band.map((b) => b.ring).filter((x) => x && x.length > 2);
  const S = r.fabric.stateMarks || { bodies: [], marks: [], expressed: [] };
  const bodies = (S.bodies || []).filter((b) => String(b.key || '').startsWith('state.'));
  const bodiesOffPage = bodies.filter((b) => !inF(b.polygon[0][0], b.polygon[0][1])).length;
  let marksOffPage = 0; let gateStrays = 0; const worst = [];
  for (const m of (S.marks || [])) {
    const p = m.x != null ? [m.x, m.y] : (m.polygon ? m.polygon[0] : null);
    if (!p) continue;
    if (!inF(p[0], p[1])) { marksOffPage++; continue; }
    if (!GATE_ANCHORED.has(m.kind) || !band.length) continue;
    const d = dmin(p, band) / rw;
    if (d > GATE_REACH_RW) { gateStrays++; worst.push(`${m.kind} ${d.toFixed(1)}rw`); }
  }
  return {
    leaf: leafKey,
    expressed: S.expressed || [],
    bodies: bodies.length,
    bodiesOffPage,
    marks: (S.marks || []).length,
    marksOffPage,
    gateStrays,
    worst,
    /** a leaf passes when everything it expresses is ON the page and ON its anchor */
    pass: bodiesOffPage === 0 && marksOffPage === 0 && gateStrays === 0,
  };
}

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };

if (process.argv[1] && process.argv[1].endsWith('statePlacementCensus.mjs')) {
  const keys = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);
  const rows = [];
  for (const k of keys) {
    const row = placementOf(k);
    if (!row.expressed.length && !row.bodies && !row.marks) continue;
    rows.push(row);
    console.log(`${row.leaf.padEnd(12)} ${row.pass ? 'PASS' : 'FAIL'}`
      + ` expressed ${JSON.stringify(row.expressed).padEnd(28)}`
      + ` bodies ${row.bodies} (${row.bodiesOffPage} OFF-PAGE)`
      + ` · marks ${row.marks} (${row.marksOffPage} OFF-PAGE, ${row.gateStrays} off their anchor)`
      + `${row.worst.length ? ` — ${row.worst.join(', ')}` : ''}`);
  }
  const bad = rows.filter((r) => !r.pass);
  console.log(`\nSTATE_PLACEMENT ${bad.length ? 'RED' : 'GREEN'} — ${rows.length - bad.length}/${rows.length}`
    + ` expressing leaf/leaves place every mark ON the page and ON its anchor`
    + ` (gate reach ${GATE_REACH_RW} road widths)`);
  const j = arg('json', '');
  if (j) writeFileSync(j, `${JSON.stringify(rows, null, 2)}\n`);
  process.exit(bad.length ? 1 : 0);
}
