#!/usr/bin/env node
/**
 * harness/laneDRESS2/statePlacementCensus.mjs — ⭐⭐ **THE CENSUS THAT ASKS WHETHER THE MARK IS ON
 * THE THING IT MEANS**, and it is now GREEN because `partitionState.js` re-anchored the register
 * (CAR-STATE-BRIDGE, ODQ §710.6).
 *
 * ═══ HOW THIS WAS FOUND, AND WHY THAT STILL MATTERS MORE THAN THE DEFECT ═══
 * DRESS-2 W1 put the §10 register on the page and every census it wrote came back green: the
 * element-diff counted the new marks, the legend census closed its bijection, the value census
 * cleared every rung, the gate ran 20 files / 479 tests. **A fresh-context reader with no project
 * knowledge convicted it in one pass**, saying of the siege and plague plates:
 *
 *   *"three short parallel black strokes float in open country north-west of the wall, touching
 *    nothing, at no gate, no road, no building, and unlike any other symbol on the sheet. I cannot
 *    assign it a meaning."*
 *
 * ⭐⭐ **THE CLASS, AND IT GENERALISES BEYOND THIS CAR: EVERY CENSUS W1 WROTE ASKED WHETHER THE
 * MARK EXISTS. NOT ONE ASKED WHETHER IT IS ON THE THING IT MEANS.** A count, a roster bijection and
 * a tone ratio are all satisfied by ink in the wrong place. This file asks the missing question.
 *
 * ═══ ⛔⛔ AND THE FIRST VERSION OF THIS FILE HAD THE DEFECT IT NAMES — THREE TIMES ═══
 * At `c4d772590` it read **RED 4/9** and it was RIGHT about those four. It was also, measured,
 * PASSING three leaves that were wrong on the page:
 *   1. **`city`** — its water test was `dmin` to the water RING, and a distance to a boundary is
 *      positive INSIDE the polygon too. **Twelve of twelve camp huts were inside the coast face**
 *      and the census called the leaf PASS. The reader had already said they were "in the bay".
 *   2. **`metropolis`** — its `trampled` mark was in frame and **280 units from any drawn wall**,
 *      anchored to nothing. The census asserted an anchor for two mark kinds and no others.
 *   3. body containment read **`polygon[0]`** — one vertex of a quad.
 * ⇒ *A census that would pass with a mark floating in a field has re-created the defect.* Every
 * arm below is therefore a CONTAINMENT or a RELATION against a drawn face, never a count.
 *
 * ═══ THE ARMS, AND WHAT EACH ONE CAUGHT ═══
 *   A · ON THE PAGE          every §10 body and mark is inside the drawn frame      (siege, thorp)
 *   B · ON LAND              no land-anchored family is inside a drawn WATER face   (city, migration)
 *   C · EXTRAMURAL           besiegers and migrants are OUTSIDE every drawn circuit (this car's
 *                            own first spelling put city's camp inside the walls)
 *   D · BEYOND BOWSHOT       the SIEGE CAMP's near edge clears the drawn band by its own §10.12
 *                            bowshot — and only the siege camp; see `STANDOFF_FAMILIES`
 *   E · AT A GATE            every gate mark is within `GATE_REACH_RW` of a drawn band face AND
 *                            inside a drawn WAY face flagged `gate`                 (siege 16.1 rw)
 *   F · EVERY GATE           the quarantine bars number exactly the gates of the DRAWN circuit,
 *                            counted by the census's own independent read           (§10.13)
 *   G · ON A FIELD           the trampled patch lies wholly inside ONE drawn field  (thorp, metro)
 *   H · IN THE TOWN          the market family is INTRAMURAL — a market is inside its town
 *   I · NOT ON A ROOF        nothing outward is drawn on top of a drawn mass
 *
 * ⚠ **THE NEGATIVE CONTROL IS THE POINT OF THE FILE.** `--source=fabric` runs every arm against
 * `fabric.stateMarks` — the LEGACY geometry, i.e. the pre-bridge corpus — and it must RED. A
 * placement census that passes on the geometry it was written to convict is measuring nothing.
 * MEASURED at this tip: `--source=page` **GREEN 9/9, exit 0**; `--source=fabric` **RED 2/9,
 * exit 1**, and the widened arms convict three leaves the first version of this file passed.
 * ⭐⭐ **AND `famine` PASSES ON BOTH GEOMETRIES.** That is the control §710.6's diagnosis rests on,
 * holding in both directions: the one family anchored to something the two surfaces AGREE about is
 * unmoved by the bridge and unconvicted by the census, before and after.
 *
 * Usage: node harness/laneDRESS2/statePlacementCensus.mjs [--leaves=a,b] [--json=<p>]
 *                                                         [--source=page|fabric]
 */
import { writeFileSync } from 'node:fs';
import { dressLeaf } from '../laneDRESS1/renderPage.mjs';
import { CORPUS } from '../exemplars.mjs';
import { pointInPolygon, distToSegment } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import {
  STATE_STANDOFF, STATE_ANCHOR_DISPOSITION, GATE_BAND_REACH_RW,
} from '../../src/domain/townMap/fabric/partitionState.js';

/**
 * The bar, in ROAD WIDTHS, and stated in road widths for §179's reason: a gate passage is about a
 * road wide at every tier, so a mark that means "this gate is shut" has to sit within a couple of
 * road widths of a drawn gate to mean it.
 * ⚠ IT IS THE PRODUCER'S OWN CONSTANT, IMPORTED RATHER THAN RESPELLED (§262.2(a) / G-34), and the
 * consequence is stated plainly rather than dressed up: **arms E and F are REGRESSION arms, not
 * discovery arms.** They cannot find a new defect, because the module that places the bar and the
 * census that checks it share one predicate. Their job is that a later change which moved a bar
 * off its gate would red. The DISCOVERY arms — the ones that convicted real ink — are A, B, C, G,
 * H and the `--source=fabric` negative control, and none of those shares anything with the placer.
 */
export const GATE_REACH_RW = GATE_BAND_REACH_RW;

/** The families whose §10 anchor is GROUND OUTSIDE THE WALL — arms B, C and I apply to these. */
export const OUTWARD_FAMILIES = Object.freeze(['siegeCamp', 'gateCamp', 'lazar', 'watchFire']);

/**
 * ⭐⭐ **ARM D APPLIES TO THE SIEGE CAMP AND TO NOTHING ELSE, AND THE SCOPING IS §10's OWN.**
 * *"A besieging camp stood beyond bowshot of the walls, which is what made a siege a siege rather
 * than an assault"* — that is a STANDOFF and it is measured against the whole circuit. A migrant
 * camp (§10.A11) is pressed up **against** the busiest gate and a watch-fire (§10.15) burns **on**
 * an approach road; neither is standing off from anything, so requiring them to clear the wall by
 * their own offset would be reading a defensive law into two families that do not carry it.
 */
export const STANDOFF_FAMILIES = Object.freeze(['siegeCamp']);

/**
 * ⛔⛔ **RULED DARK: A DEFECT MEASURED, NAMED, AND NOT CURABLE IN THIS CAR.** The idiom is
 * `wallRuns.walker.test.js`'s own — *"entries are removed by MEASUREMENT and never by
 * convenience"* — and the gate below pins this roster EXACTLY, so a second extramural market mark
 * reds instead of joining a growing whitelist.
 *
 * `town-2`'s `publicWork` stands OUTSIDE its drawn circuit. It is not a §10 stressor expression at
 * all — `deriveStateMarks` emits it from `prosperityRank` and it appears in no leaf's
 * `expressed[]` — but it rides the same channel and anchors on the same legacy market. **It cannot
 * be re-anchored, and the reason is a measurement: `page.voids` is 100 % `court` on every leaf of
 * the corpus, so the partition publishes NO MARKET FACE for a market mark to be moved to.** The
 * legacy `web.squares[0]` is the only market either geometry has — and it is the anchor that made
 * `famine` the control §710.6's diagnosis rests on. Moving it would break the control and could
 * not improve the placement. → REPORTED to the chair, on the docket beside the market face.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const RULED_DARK = Object.freeze({
  'town-2': Object.freeze(['publicWork EXTRAMURAL — a market is inside its town']),
});

/** the two families whose whole meaning is WHERE they are, at a gate */
const GATE_ANCHORED = new Set(['barredGate', 'quarantineBar']);

const dmin = (p, rings) => {
  let best = Infinity;
  for (const r of rings) {
    for (let i = 0; i < r.length; i++) {
      const a = r[i]; const b = r[(i + 1) % r.length];
      best = Math.min(best, distToSegment(p[0], p[1], a[0], a[1], b[0], b[1]));
    }
  }
  return best;
};
const inAny = (p, rings) => rings.some((r) => pointInPolygon(p[0], p[1], r));
const cen = (poly) => {
  let x = 0; let y = 0;
  for (const q of poly) { x += q[0]; y += q[1]; }
  return [x / poly.length, y / poly.length];
};
const ringsOf = (list) => (list || []).map((o) => o && o.ring).filter((r) => Array.isArray(r) && r.length > 2);

/** Every drawn WAY face carrying the gate flag, with its ring — the population arm E contains against. */
export function drawnGates(page) {
  const out = [];
  for (const g of (page.gates || [])) {
    const wf = (page.ways || []).find((w) => w.face === g.face);
    if (wf && Array.isArray(wf.ring) && wf.ring.length > 2) out.push({ ...g, ring: wf.ring });
  }
  return out;
}

/** Those of them that stand within the drawn wall's reach — §10.13's "every gate", read off the page. */
export function circuitGates(page, roadWidth) {
  const band = ringsOf(page.band);
  if (!band.length) return drawnGates(page);
  return drawnGates(page).filter((g) => dmin(g.at, band) <= roadWidth * GATE_REACH_RW);
}

/** every point a family puts on the page, so containment is asked of the whole mark, not a vertex */
function pointsOf(item) {
  if (Array.isArray(item.polygon) && item.polygon.length >= 3) return item.polygon.slice();
  if (Number.isFinite(item.x) && Number.isFinite(item.y)) return [[item.x, item.y]];
  return [];
}

function familyOf(item, key) {
  if (String(key || '').startsWith('state.billet.')) return 'seat';
  const row = STATE_ANCHOR_DISPOSITION[item.kind];
  return row ? row.family : null;
}

/**
 * @param {string} leafKey
 * @param {'page'|'fabric'} source `page` = the re-anchored register (what is DRAWN);
 *   `fabric` = `fabric.stateMarks`, the LEGACY geometry — the negative control.
 */
export function placementOf(leafKey, source = 'page') {
  const r = dressLeaf(leafKey, 'parchment');
  const P = r.page;
  const F = P.frame;
  const rw = r.input.roadWidth;
  const S = (source === 'fabric' ? r.fabric.stateMarks : r.state) || { bodies: [], marks: [], expressed: [] };

  const band = ringsOf(P.band);
  const water = ringsOf(P.water);
  const masses = ringsOf(P.masses);
  const fields = ringsOf(P.fields);
  const inner = ((P.wraps || []).map((w) => w && w.inner)).filter((x) => Array.isArray(x) && x.length > 2);
  const allGates = drawnGates(P);
  const gates = circuitGates(P, rw);
  const inF = (p) => p[0] >= F.x && p[0] <= F.x + F.w && p[1] >= F.y && p[1] <= F.y + F.h;

  const fail = [];
  let bodies = 0; let marks = 0;

  /** @param {any} item @param {string} fam @param {string} label */
  const check = (item, fam, label) => {
    const pts = pointsOf(item);
    if (!pts.length) return;
    const c = cen(pts);
    // ── A · ON THE PAGE
    for (const p of pts) if (!inF(p)) { fail.push(`${label} OFF-PAGE`); return; }
    if (OUTWARD_FAMILIES.includes(fam)) {
      // ── B · ON LAND
      if (water.length && inAny(c, water)) { fail.push(`${label} IN WATER`); return; }
      // ── C · EXTRAMURAL
      if (inner.length && inAny(c, inner)) { fail.push(`${label} INTRAMURAL`); return; }
      // ── I · NOT ON A ROOF
      if (masses.length && inAny(c, masses)) { fail.push(`${label} ON A MASS`); return; }
    }
    // ── E · AT A GATE
    if (GATE_ANCHORED.has(item.kind)) {
      if (band.length) {
        const d = dmin(c, band) / rw;
        if (d > GATE_REACH_RW) { fail.push(`${label} ${d.toFixed(1)}rw from the band`); return; }
      }
      if (allGates.length && !allGates.some((g) => pointInPolygon(c[0], c[1], g.ring))) {
        fail.push(`${label} not inside any drawn gate face`);
        return;
      }
    }
    // ── G · ON A FIELD (the whole patch inside ONE drawn field face)
    if (item.kind === 'trampled' && fields.length) {
      const rr = Number.isFinite(item.r) ? item.r : 0;
      const probe = [c, [c[0] + rr, c[1]], [c[0] - rr, c[1]], [c[0], c[1] + rr], [c[0], c[1] - rr]];
      const home = fields.find((f) => probe.every((p) => pointInPolygon(p[0], p[1], f)));
      if (!home) { fail.push(`${label} not wholly inside one drawn field face`); return; }
    }
    // ── H · IN THE TOWN
    if (fam === 'market' && inner.length && !inAny(c, inner)) {
      fail.push(`${label} EXTRAMURAL — a market is inside its town`);
    }
  };

  for (const b of (S.bodies || [])) {
    const key = String(b.key || '');
    if (!key.startsWith('state.')) continue;
    bodies++;
    check(b, familyOf(b, key), `${b.kind}`);
  }
  for (const m of (S.marks || [])) {
    marks++;
    check(m, familyOf(m, ''), `${m.kind}`);
  }

  // ── D · BEYOND BOWSHOT. Each outward family's near edge stands at least its own §10 standoff
  //    beyond the gate it took. Measured from the DRAWN band rather than from the anchor record,
  //    so the arm is a geometric relation and not a re-reading of the producer's own claim.
  const B = P.bound;
  const R = B.radius > 0 ? B.radius : 1;
  const frontage = r.fabric.meta.plotFrontage;
  const standoffs = {};
  for (const fam of STANDOFF_FAMILIES) {
    const rule = STATE_STANDOFF[fam];
    if (!rule) continue;
    const want = Math.max(frontage * rule.frontages, R * rule.radiusShare);
    const pts = [];
    for (const b of (S.bodies || [])) {
      const key = String(b.key || '');
      if (!key.startsWith('state.')) continue;
      if (familyOf(b, key) === fam) for (const p of pointsOf(b)) pts.push(p);
    }
    for (const m of (S.marks || [])) if (familyOf(m, '') === fam) for (const p of pointsOf(m)) pts.push(p);
    if (!pts.length || !band.length) continue;
    let near = Infinity;
    for (const p of pts) near = Math.min(near, dmin(p, band));
    standoffs[fam] = { near, want };
    // ⚠ the bar is 0.9× the standoff and the slack is DECLARED: the standoff is measured from the
    //   gate the family took, while this arm measures from the NEAREST band face anywhere on the
    //   circuit, which on a re-entrant wall is a different and shorter distance.
    if (near < want * 0.9) fail.push(`${fam} stands ${near.toFixed(1)}u off the band, inside its own ${want.toFixed(1)}u standoff`);
  }

  // ── F · EVERY GATE. §10.13 bars every gate of the circuit, so the bar count IS the gate count.
  {
    const bars = (S.marks || []).filter((m) => m.kind === 'quarantineBar').length;
    if (bars && gates.length && bars !== gates.length) {
      fail.push(`${bars} quarantine bar(s) against ${gates.length} gate(s) of the drawn circuit`);
    }
  }

  // ── THE RULED-DARK SUBTRACTION, applied LAST and reported rather than hidden.
  const dark = RULED_DARK[leafKey] || [];
  const ruled = fail.filter((f) => dark.includes(f));
  const live = fail.filter((f) => !dark.includes(f));

  const expressed = S.expressed || [];
  return {
    leaf: leafKey,
    source,
    expressed,
    bodies,
    marks,
    circuitGates: gates.length,
    flaggedGates: (P.gates || []).length,
    standoffs,
    fail: live,
    /** ⭐ the failures this leaf is KNOWN to carry and cannot cure here — see `RULED_DARK` */
    ruledDark: ruled,
    pass: live.length === 0,
  };
}

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };

if (process.argv[1] && process.argv[1].endsWith('statePlacementCensus.mjs')) {
  const source = arg('source', 'page') === 'fabric' ? 'fabric' : 'page';
  const keys = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);
  const rows = [];
  for (const k of keys) {
    const row = placementOf(k, source);
    if (!row.expressed.length && !row.bodies && !row.marks) continue;
    rows.push(row);
    console.log(`${row.leaf.padEnd(12)} ${row.pass ? 'PASS' : 'FAIL'}`
      + ` expressed ${JSON.stringify(row.expressed).padEnd(30)}`
      + ` bodies ${String(row.bodies).padStart(2)} · marks ${String(row.marks).padStart(2)}`
      + ` · gates ${row.circuitGates}/${row.flaggedGates} in circuit`
      + `${row.fail.length ? ` — ${row.fail.join('; ')}` : ''}`
      + `${row.ruledDark.length ? `  [RULED DARK: ${row.ruledDark.join('; ')}]` : ''}`);
  }
  const bad = rows.filter((r) => !r.pass);
  console.log(`\nSTATE_PLACEMENT[${source}] ${bad.length ? 'RED' : 'GREEN'} — ${rows.length - bad.length}/${rows.length}`
    + ` expressing leaf/leaves place every mark ON the page and ON the thing it means`
    + ` (gate reach ${GATE_REACH_RW} road widths)`);
  const j = arg('json', '');
  if (j) writeFileSync(j, `${JSON.stringify(rows, null, 2)}\n`);
  process.exit(bad.length ? 1 : 0);
}
