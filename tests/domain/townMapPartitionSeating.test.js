/**
 * tests/domain/townMapPartitionSeating.test.js — ⭐⭐⭐ CAR-SEATING · **THE INSTITUTIONS ON THE
 * PARTITION, AND EVERY ZERO WITH A LIVE CONTROL.**
 *
 * This file inherits `townMapPartition.test.js`'s law verbatim — *"every zero with a live
 * control"* — because the headline figure of this car is a zero (`physicalViolations`) and a zero
 * is exactly what a DEAD INSTRUMENT reports. So the physical arms come in PAIRS: a fixture whose
 * ground is absent must CONVICT, and the same fixture with the ground restored must ACQUIT *and
 * land the body on that exact face*. Neither half is worth anything alone — a count that only ever
 * reads 0 cannot be told from a counter nobody wired up.
 *
 * ⚠ THE FIXTURES ARE SYNTHETIC AND SMALL, ON THIS SUITE'S OWN STANDING ORDER. `townMapPartition`
 * records it: a corpus leaf costs real wall-clock and the invariants here are properties of the
 * STRUCTURE — a deck, an order, a scorer and a residue — so a hand-built candidate set exercises
 * every one of them. ⭐ The CORPUS-SCALE censuses deliberately live in
 * `harness/laneSEAT1/seatingCensus.mjs` instead, which is where a wall-clock budget belongs and
 * where `bothTotals` can publish the distinct-site denominator a test cannot.
 *
 * ⭐⭐ WHY THE DISTRIBUTION ARMS ASSERT A **SPREAD** AND NOT A TARGET. This car exists to stop a
 * uniform map. A pass that seated every settlement the same way would satisfy any single-value
 * assertion perfectly and still be the failure — so what is pinned here is that the output MOVES
 * with the facts (prosperity changes the standing residue; a different roster changes the family
 * mix) and that within one leaf the ladder OCCUPIES ITS RUNGS rather than collapsing onto one.
 * The matching pin in the other direction is determinism: same facts in, byte-same seats out.
 * Variety without determinism is noise; determinism without variety is a diagram. Both are pinned.
 */
import { describe, it, expect } from 'vitest';
import {
  PHYSICAL_FAMILIES, PHYSICAL_PULL, FAMILY_SCORERS, VOID_SEEKING_FAMILIES,
  buildQuotaDeck, deckOrder, seatOnPartition, gradeStanding, prosperityReach,
  PROSPERITY_REACH_DEFAULT, PARTITION_SEATING_SCHEMA_VERSION,
} from '../../src/domain/townMap/fabric/partitionSeating.js';
import { GENERATION_NODES, NODE_EDGES } from '../../src/domain/townMap/fabric/stageManifest.js';
import {
  DRESS_GROUPS, DRESS_LEGEND, dressPage, legendCensus,
} from '../../src/domain/townMap/fabric/partitionDress.js';
import { atlasRow } from '../../src/data/institutionAtlas.js';

/** The smallest page `dressPage` will accept — every roster empty, so the ONLY ink that can
 *  appear is the paper and whatever the arm under test adds. That emptiness is the control. */
const flatPage = () => ({
  frame: { x: 0, y: 0, w: 100, h: 100 }, contentFrame: { x: 0, y: 0, w: 100, h: 100 },
  fields: [], water: [], ways: [], voids: [], masses: [], crossings: [], quays: [],
  gates: [], band: [], loss: [], budget: { shapes: 0 }, bound: { cx: 50, cy: 50, radius: 50 },
});

/**
 * A hand-built candidate set: `n` faces on a line running out from the centre, so `toCentre`
 * climbs with the index and every positional scorer has something to grade. `over` re-writes
 * named faces, which is how the plants below are surgical.
 */
function fixtureGeom(n, over = {}) {
  const cands = [];
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    cands.push({
      face: i, cx: t * 100, cy: 0, area: 10, areaRatio: 1,
      isVoid: false, intramural: t < 0.5, inBand: false, touchesBand: false,
      onArtery: false, frontsWater: false,
      toCentre: t, toEdge: 1 - t, toPlaza: t, toGate: 1 - t, toWater: 1,
      near: {},
      ...(over[i] || {}),
    });
  }
  return { candidates: () => cands, radius: 100 };
}

/** A deck card, spelled the way `buildQuotaDeck` spells one. */
const card = (name, family, extra = {}) => ({
  name, family, ring: 'E', disp: 'D', founds: false, atlased: true, ...extra,
});

const RUNG = (standing) => standing.reduce((o, r) => { o[r.standing] = (o[r.standing] || 0) + 1; return o; }, {});

describe('CAR-SEATING · the institutions take their places on the partition', () => {
  // ── THE PHYSICAL PAIR ───────────────────────────────────────────────────────
  it('1 · ⛔ THE PLANT CONVICTS — a waterfront body on a leaf with no water is a VIOLATION', () => {
    const geom = fixtureGeom(8);                       // not one face fronts water
    const r = seatOnPartition({ deck: [card('Docks/port facilities', 'WATERFRONT')], facts: {}, geom });
    expect(r.physicalViolations).toBe(1);
    expect(r.violations).toHaveLength(1);
    expect(r.violations[0].name).toBe('Docks/port facilities');
    expect(r.violations[0].why).toMatch(/fronts water/);
  });

  it('2 · ⭐ THE CONTROL ACQUITS — restore ONE water face and the count drops to 0 AND the body '
    + 'lands on that exact face', () => {
    // Face 6 is far from the centre, so the family scorer (`pull(toCentre)`) actively prefers
    // almost every other face. If the seat still lands there, the pass SOUGHT the ground.
    const geom = fixtureGeom(8, { 6: { frontsWater: true } });
    const r = seatOnPartition({ deck: [card('Docks/port facilities', 'WATERFRONT')], facts: {}, geom });
    expect(r.physicalViolations).toBe(0);
    expect(r.violations).toHaveLength(0);
    expect(r.seats[0].face).toBe(6);
  });

  it('3 · ⭐ THE REGRESSION PIN FOR THE DEFECT THIS CAR FOUND: the constraint is SOUGHT, not '
    + 'merely CHECKED. Without the pull, `pull(toCentre)` wins and the quay goes dry.', () => {
    const geom = fixtureGeom(8, { 7: { frontsWater: true } });   // the WORST face for the scorer
    const r = seatOnPartition({ deck: [card('Fish market', 'WATERFRONT')], facts: {}, geom });
    expect(r.seats[0].face).toBe(7);
    // and the family scorer, read alone, would have chosen face 0 — which is the whole point.
    const bare = geom.candidates().map((c) => ({ f: c.face, w: FAMILY_SCORERS.WATERFRONT({ ...c, near: { COMMERCE: 0 } }) }));
    bare.sort((a, b) => b.w - a.w || a.f - b.f);
    expect(bare[0].f).toBe(0);
    expect(PHYSICAL_PULL).toBeGreaterThan(44);          // dominates the widest unlawful/lawful ratio
    expect(Number.isFinite(PHYSICAL_PULL)).toBe(true);  // ⛔ and stays a WEIGHT, never a wall
  });

  it('4 · ⭐ WEIGHTS, NEVER WALLS — a body whose ground does not exist is STILL SEATED and still '
    + 'counted. Absent ground must not become a missing institution.', () => {
    const geom = fixtureGeom(8);
    const r = seatOnPartition({ deck: [card('Docks/port facilities', 'WATERFRONT')], facts: {}, geom });
    expect(r.seats).toHaveLength(1);                    // seated
    expect(r.physicalViolations).toBe(1);               // and visible
    expect(r.notes.join(' ')).toMatch(/PHYSICAL constraint fails/);
  });

  it('5 · ⭐ A PRECONDITION OUTRANKS A PREFERENCE — the physical family takes first refusal on '
    + 'its own scarce ground, ahead even of a FOUNDER', () => {
    const order = deckOrder([
      card('Monastery or friary', 'WORSHIP', { founds: true, disp: 'U' }),
      card('Sawmill', 'HEAVY', { founds: true }),
      card('Fish market', 'WATERFRONT'),
    ]);
    expect(order[0].name).toBe('Fish market');
    // ⛔ THE PLANT: with only ONE water face, the founders would otherwise consume it — which is
    //   exactly what was measured on `fjord` before this key existed.
    const geom = fixtureGeom(3, { 2: { frontsWater: true } });
    const r = seatOnPartition({ deck: order, facts: {}, geom });
    expect(r.physicalViolations).toBe(0);
    expect(r.seats.find((s) => s.name === 'Fish market').face).toBe(2);
  });

  // ── THE DECK ────────────────────────────────────────────────────────────────
  it('6 · ⛔ THE DECK READS THE ATLAS, NEVER `priorityCategory` — the tannery is NOXIOUS, and a '
    + 'placer reading the catalog would have filed it under government', () => {
    const deck = buildQuotaDeck([{ name: 'Tanners', priorityCategory: 'government' }]);
    expect(deck.cards).toHaveLength(1);
    expect(deck.cards[0].family).toBe('NOXIOUS');
    expect(atlasRow('Tanners').family).toBe('NOXIOUS');
    // and the scorer that family draws is the edge/water one, never the civic-core one
    expect(FAMILY_SCORERS.NOXIOUS).toBeTypeOf('function');
  });

  it('7 · §174.3 — nonBuilding entries keep an ANCHOR and draw no silhouette, and they leave by '
    + 'NAME so a census can tell a household from a cathedral', () => {
    const deck = buildQuotaDeck([
      { name: 'Town hall' }, { name: 'Household elder' }, { name: 'Tanners' },
    ]);
    expect(deck.cards.map((c) => c.name)).toEqual(['Tanners']);
    expect(deck.dropped.map((d) => d.name).sort()).toEqual(['Household elder', 'Town hall']);
    for (const d of deck.dropped) expect(d.via).toMatch(/anchor kept, no silhouette drawn/);
    // ⚠ the POLITY consequence, pinned so it is noticed rather than rediscovered: it is an
    //   UPSTREAM atlas fact, not a decision this module is free to make.
    expect(atlasRow('Town hall').nonBuilding).toBe(true);
    expect(atlasRow('City hall').nonBuilding).toBe(true);
  });

  it('8 · an institution the atlas has never heard of is a recorded DERIVATION, never an '
    + 'invented family', () => {
    const deck = buildQuotaDeck([{ name: 'Ministry of Utterly Invented Affairs' }]);
    expect(deck.unatlased).toEqual(['Ministry of Utterly Invented Affairs']);
    expect(deck.cards[0].family).toBe(null);
    expect(deck.cards[0].atlased).toBe(false);
  });

  // ── THE DISTRIBUTIONS ───────────────────────────────────────────────────────
  it('9 · ⭐⭐ THE STANDING LADDER OCCUPIES ITS RUNGS — a spread, not a collapse', () => {
    const geom = fixtureGeom(40);
    const r = seatOnPartition({ deck: [card('Mint', 'FINANCE'), card('Tanners', 'NOXIOUS')], facts: { prosperity: 'Comfortable' }, geom });
    const rung = RUNG(r.standing);
    expect(Object.keys(rung).length).toBeGreaterThanOrEqual(3);
    // ⛔ NON-DEGENERACY: no single grade may swallow the leaf. A pass that graded everything
    //   'poor' would satisfy "a distribution exists" and be exactly the failure this car prevents.
    for (const k of Object.keys(rung)) expect(rung[k]).toBeLessThan(r.standing.length);
    expect(r.standing).toHaveLength(40);
  });

  it('10 · ⭐⭐ POVERTY IS A RESIDUE, AND IT MOVES WITH THE SETTLEMENT\'S OWN WEALTH — same '
    + 'geometry, two economies, two different shares of poor ground', () => {
    const geom = fixtureGeom(40);
    const seats = [];
    const poorOf = (prosperity) => RUNG(gradeStanding(geom.candidates(), seats, { prosperity }, geom)).poor;
    const destitute = poorOf('Destitute');
    const rich = poorOf('Rich');
    expect(destitute).toBeGreaterThan(rich);            // the wealth reaches less far
    expect(rich).toBeGreaterThan(0);                    // ⛔ and no town is ALL comfortable
    expect(destitute).toBeLessThan(40);                 // ⛔ nor is any town ALL poor
    // the reaches themselves are ordered, and an unknown label is the honest middle
    expect(prosperityReach('Destitute')).toBeLessThan(prosperityReach('Rich'));
    expect(prosperityReach('a label no table has ever seen')).toBe(PROSPERITY_REACH_DEFAULT);
  });

  it('11 · ⭐ THE FACTS MOVE THE MAP — two different rosters on identical ground seat differently', () => {
    const geom = fixtureGeom(20);
    const a = seatOnPartition({ deck: [card('Mint', 'FINANCE'), card('Tanners', 'NOXIOUS')], facts: {}, geom });
    const b = seatOnPartition({ deck: [card('Tanners', 'NOXIOUS'), card('Brothel', 'VICE')], facts: {}, geom });
    expect(a.byFamily).not.toEqual(b.byFamily);
    const faceOf = (r, n) => r.seats.find((s) => s.name === n).face;
    // the tannery is in both decks; its seat is decided by what ELSE is in the town
    expect(faceOf(a, 'Tanners')).toBeTypeOf('number');
    expect(faceOf(b, 'Tanners')).toBeTypeOf('number');
  });

  it('12 · ⭐ DETERMINISM, THE OTHER HALF OF THE PAIR — same facts in, byte-same seats out, with '
    + 'no dice anywhere to launder a flat deck', () => {
    const deck = [card('Mint', 'FINANCE'), card('Tanners', 'NOXIOUS'), card('Coaching inn', 'HOSPITALITY')];
    const one = seatOnPartition({ deck, facts: { prosperity: 'Modest' }, geom: fixtureGeom(20) });
    const two = seatOnPartition({ deck, facts: { prosperity: 'Modest' }, geom: fixtureGeom(20) });
    expect(JSON.stringify(one.seats)).toBe(JSON.stringify(two.seats));
    expect(JSON.stringify(one.standing)).toBe(JSON.stringify(two.standing));
  });

  it('13 · ⛔ NO SCORER IS A REFUSAL — every family scorer returns a finite, positive multiplier '
    + 'at both ends of every axis (the weights-not-walls law, made checkable)', () => {
    const lo = { toCentre: 0, toPlaza: 0, toGate: 0, toWater: 0, toEdge: 0, areaRatio: 0, onArtery: false, intramural: true, inBand: false, touchesBand: false, isVoid: false, frontsWater: false, near: {} };
    const hi = { ...lo, toCentre: 1, toPlaza: 1, toGate: 1, toWater: 1, toEdge: 1, areaRatio: 3, onArtery: true, intramural: false, touchesBand: true };
    for (const fam of Object.keys(FAMILY_SCORERS)) {
      for (const c of [lo, hi]) {
        const near = {}; for (const k of Object.keys(FAMILY_SCORERS)) near[k] = 0.5;
        const w = FAMILY_SCORERS[fam]({ ...c, near });
        expect(Number.isFinite(w), `${fam} returned a non-finite weight`).toBe(true);
        expect(w, `${fam} returned a refusal`).toBeGreaterThan(0);
      }
    }
  });

  // ── THE GRAPH ───────────────────────────────────────────────────────────────
  it('14 · the stage manifest assigns partitionSeating.js to S16 and DECLARES `S8>S16` rather '
    + 'than hiding it behind an injected reader (⟦DRESS-1 §686.7⟧)', () => {
    const s16 = GENERATION_NODES.find((x) => x.nodeId === 'S16');
    const s8 = GENERATION_NODES.find((x) => x.nodeId === 'S8');
    expect(s16.modules).toContain('partitionSeating.js');
    expect(s8.modules).not.toContain('partitionSeating.js');
    expect(s16.allowedImports).toContain('partitionArrangement.js');
    expect(NODE_EDGES).toContain('S8>S16');
    // ⭐ the pass mints no namespace and opens no stream, so S16's fork count does not move
    expect(s16.statefulForkSites).toBe(1);
    // and the schema the seat record publishes against is declared, so a shape change is visible
    expect(PARTITION_SEATING_SCHEMA_VERSION).toBe(1);
  });

  it('15 · the physical roster is DELIBERATELY SHORT — only families the GROUND itself decides', () => {
    expect(Object.keys(PHYSICAL_FAMILIES).sort()).toEqual(['CIRCUIT', 'WATERFRONT']);
    // a VOID-seeking family is a preference, and must never have leaked into the physical roster
    for (const f of VOID_SEEKING_FAMILIES) expect(PHYSICAL_FAMILIES[f]).toBeUndefined();
  });

  // ── W3 · THE REGISTER MARK ──────────────────────────────────────────────────
  it('16 · ⭐ THE REGISTER MARK IS DECLARED IN BOTH ROSTERS AND ITS PLATE IS A REAL CITATION', () => {
    expect(DRESS_GROUPS).toContain('dress-register');
    const row = DRESS_LEGEND.find((x) => x.group === 'dress-register');
    expect(row).toBeTruthy();
    // ⛔ the `plate` column is not decoration — a row with no plate is a mark this estate invented,
    //   which is the `hf61-chrome-plate` failure `partitionDress` names. This glyph is licensed by
    //   `shapeCode.js`'s own `mark` archetype: "A SINGLE SMALL FIGURE", sourced hf303.
    expect(row.plate).toMatch(/hf303/);
    expect(row.teaches.length).toBeGreaterThan(10);
  });

  it('17 · ⭐⭐ EVERY SEAT IS MARKED AND NOTHING ELSE IS — with the dormancy control beside it', () => {
    const page = flatPage();
    const seating = { seats: [{ name: 'A', x: 20, y: 20 }, { name: 'B', x: 60, y: 40 }, { name: 'C', x: 80, y: 70 }] };
    const withSeats = dressPage(page, { roadWidth: 5, seating });
    expect(withSeats.census.registerMarks).toBe(3);          // one mark per seat, no more
    expect(withSeats.groups).toContain('dress-register');
    // ⛔ THE CONTROL: no seating ⇒ the group is not emitted AT ALL, so the mark cannot be the
    //   thing that was always there. A group that appears unconditionally proves nothing.
    const without = dressPage(page, { roadWidth: 5 });
    expect(without.census.registerMarks).toBe(0);
    expect(without.groups).not.toContain('dress-register');
    expect(without.svg).not.toMatch(/dress-register/);
  });

  it('18 · ⭐ THE LEGEND CENSUS IS A BIJECTION, BOTH DIRECTIONS, WITH THE NEW MARK IN IT', () => {
    const seating = { seats: [{ name: 'A', x: 20, y: 20 }] };
    const lc = legendCensus(dressPage(flatPage(), { roadWidth: 5, seating }));
    expect(lc.untaught).toEqual([]);        // nothing drawn that the legend does not teach
    expect(lc.unlocatable).toEqual([]);     // nothing taught that the dress cannot draw
    expect(lc.plateless).toEqual([]);       // and no row without a plate
    expect(lc.ok).toBe(true);
  });

  it('19 · a seat with no finite position is SKIPPED rather than emitting a NaN path', () => {
    const seating = { seats: [{ name: 'ok', x: 10, y: 10 }, { name: 'bad', x: NaN, y: 3 }, { name: 'gone' }] };
    const d = dressPage(flatPage(), { roadWidth: 5, seating });
    expect(d.census.registerMarks).toBe(1);
    expect(d.svg).not.toMatch(/NaN/);
  });
});
