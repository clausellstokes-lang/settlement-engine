/**
 * tests/domain/townMapFabricInertia.test.js — MF-1K, THE INERTIA LAW (§11.0).
 *
 * ⭐ The load-bearing member of the whole family: unchanged facts must produce BYTE-
 * UNCHANGED fabric, and changed facts must produce LOCAL change only. Every geometry
 * module downstream is WRITTEN AGAINST this seam, because retrofitting it means rewriting
 * all of them.
 *
 * ⚠ EVERY LOCALITY ARM CARRIES A PLANTED CONTROL. A locality pin that cannot red is a
 * disabled guard, and this one would pass trivially if the fabric simply never changed.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { fabricRng, fabricForkKey, hashUnit, keyedRandom } from '../../src/domain/townMap/fabric/fabricRng.js';
import { institutionKey, parcelKey, roadKey } from '../../src/domain/townMap/fabric/lineage.js';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { claimsOfRings } from '../../src/domain/townMap/fabric/wallCircuit.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { makeTownFixture, makeWalledFixture } from '../fixtures/townMapFixtures.js';
// MF-B6 — §11.11 the snapshots, and the inertia law across YEARS rather than across edits.
import { settlementAtYear, snapshotYears, wallStandingAt, presentYear } from '../../src/domain/townMap/fabric/snapshot.js';

const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const build = (s) => buildFabric(s, buildTownMapModel(s, null), {});
const byOrganism = (f) => {
  const m = new Map();
  for (const p of f.parcels) {
    const k = p.organismKey || '?';
    if (!m.has(k)) m.set(k, []);
    m.get(k).push([p.key, p.polygon.map((q) => [Math.round(q[0] * 100), Math.round(q[1] * 100)])]);
  }
  const out = new Map();
  for (const [k, v] of m) out.set(k, sha(v));
  return out;
};

describe('the inertia law', () => {
  it('DETERMINISM: the same settlement builds byte-identically', () => {
    const s = makeTownFixture();
    expect(sha(byOrganism(build(s)))).toBe(sha(byOrganism(build(s))));
  });

  it('ADDITION IS LOCAL: adding one institution leaves other organisms byte-identical', () => {
    const base = makeTownFixture();
    const plus = JSON.parse(JSON.stringify(base));
    plus.institutions = plus.institutions.concat([{ name: 'Chandler', catalogId: 'chandler-lane', priorityCategory: 'crafts' }]);
    const fa = build(base), fb = build(plus);
    // The organism the new institution JOINS is expected to change — that is the LOCAL
    // change the law permits. Every organism whose member roll did NOT move must be
    // byte-identical, and there must be some: a settlement with one quarter cannot
    // demonstrate locality, which is why the fixture carries four.
    const rollOf = (f) => new Map(f.organisms.map((o) => [o.key, o.members.join('|')]));
    const RA = rollOf(fa), RB = rollOf(fb);
    const unchangedRoll = [...RA.keys()].filter((k) => RB.get(k) === RA.get(k));
    expect(unchangedRoll.length).toBeGreaterThan(0);
    const A = byOrganism(fa), B = byOrganism(fb);
    for (const k of unchangedRoll) {
      expect(B.get(k), `organism ${k} moved without its facts changing`).toBe(A.get(k));
    }
    // anchored: the settlement's LAND cannot have an opinion about a new shop
    expect(sha([...fa.substrate.height])).toBe(sha([...fb.substrate.height]));
  });

  it('ADDITION IS LOCAL FOR THE **DRAWS** TOO, not only for the geometry (§234)', () => {
    // ⭐⭐⭐ THE HALF THE LOCALITY PIN ABOVE DOES NOT COVER, and §234 names it explicitly:
    // "insert an unrelated feature and assert every other feature's geometry AND JITTER
    // SAMPLES are byte-identical." Geometry can survive a re-roll by coincidence (a draw
    // moves and the value it feeds is clamped, snapped or rounded back onto the same
    // number), so the geometry arm alone cannot prove the STREAM did not move. This asks
    // the draws directly.
    const base = makeTownFixture();
    const plus = JSON.parse(JSON.stringify(base));
    plus.institutions = plus.institutions.concat([
      { name: 'Chandler', catalogId: 'chandler-lane', priorityCategory: 'crafts' },
    ]);
    const fa = build(base), fb = build(plus);
    const rollOf = (f) => new Map(f.organisms.map((o) => [o.key, o.members.join('|')]));
    const RA = rollOf(fa), RB = rollOf(fb);
    const unchanged = [...RA.keys()].filter((k) => RB.get(k) === RA.get(k));
    expect(unchanged.length).toBeGreaterThan(0);

    // A FEATURE'S OWN SAMPLE LADDER: eight draws per mechanic, per feature, taken from the
    // keyed primitive rather than from a stream — so the ladder is a pure function of the
    // feature's identity and of nothing that happened before it.
    const ladder = (f, key) => {
      const seed = f.meta.seed;
      const out = [];
      for (const mech of ['jitter', 'tone', 'shape', 'rotation']) {
        for (let k = 0; k < 8; k++) out.push(keyedRandom(seed, key, mech, k, { variant: f.meta.variant }));
      }
      return sha(out);
    };
    for (const k of unchanged) {
      expect(ladder(fb, k), `the DRAWS for ${k} moved though its facts did not`).toBe(ladder(fa, k));
    }

    // ⛔ AND THE ARM CAN RED. A stream-based ladder — ONE fork drawn in a loop over every
    // drawn feature in roster order — shifts every organism that comes after the inserted
    // institution, which is exactly the construction fabricRng.js's header forbids.
    //
    // ⚠ MY FIRST SPELLING OF THIS CONTROL DID NOT FIRE, and the reason is worth the note:
    // it streamed over `f.organisms` alone, and adding an institution to an EXISTING quarter
    // changes the institution set, not the organism set — so the loop ran the same length in
    // the same order and nothing shifted. ⭐ THE CLASS: **A PLANTED CONTROL MUST PLANT THE
    // DEFECT'S OWN MECHANISM, NOT SOMETHING ADJACENT TO IT** — a stream only betrays you when
    // the sequence it walks actually changes, so the control has to walk the set that moved.
    expect(fb.landmarks.length).toBeGreaterThan(fa.landmarks.length);
    const streamLadder = (f) => {
      const rng = fabricRng(f.meta.seed, 'ONE-STREAM-OVER-EVERY-FEATURE', {});
      const out = new Map();
      for (const lm of f.landmarks) { rng.next(); rng.next(); rng.next(); void lm; }
      for (const o of f.organisms) out.set(o.key, sha([rng.next(), rng.next(), rng.next()]));
      return out;
    };
    const SA = streamLadder(fa), SB = streamLadder(fb);
    const movedUnderStream = unchanged.filter((k) => SB.get(k) !== SA.get(k));
    expect(movedUnderStream.length).toBe(unchanged.length);   // the stream moves ALL of them
  }, 120000);

  it('PLANTED CONTROL: a reseed moves EVERY organism (the locality pin can red)', () => {
    const base = makeTownFixture();
    const reseeded = JSON.parse(JSON.stringify(base));
    reseeded._seed = `${base._seed}-CONTROL`;
    const A = byOrganism(build(base)), C = byOrganism(build(reseeded));
    const survived = [...A.keys()].filter((k) => C.get(k) === A.get(k));
    expect(survived).toHaveLength(0);
  });

  it('NO SHARED STREAM: two entities never derive from one fork key', () => {
    const a = fabricForkKey('seed', 'org.market', {});
    const b = fabricForkKey('seed', 'org.temple', {});
    expect(a).not.toBe(b);
    expect(fabricRng('seed', 'org.market', {}).next()).not.toBe(fabricRng('seed', 'org.temple', {}).next());
  });

  it('layoutVariant salts the ROOT, so every entity fork inherits it', () => {
    const plain = fabricForkKey('seed', 'org.market', {});
    const salted = fabricForkKey('seed', 'org.market', { variant: 2 });
    expect(salted).not.toBe(plain);
    expect(salted).toContain('variant:2');
  });

  it('IDENTITY IS NOT ADDRESS: an institution key ignores where it sits', () => {
    const inst = { catalogId: 'tannery', name: 'Tannery' };
    expect(institutionKey(inst)).toBe(institutionKey({ ...inst, x: 900, y: 12 }));
    // anchored: the precedence is catalogId -> localUid -> name, the landed anchor order
    expect(institutionKey({ localUid: 'u1', name: 'X' })).toContain('uid');
    expect(institutionKey({ name: 'Only A Name' })).toContain('name');
  });

  it('LINEAGE STABILITY: parcel and road keys are pure functions of their descent', () => {
    expect(parcelKey('org.a', 1, 2, 0)).toBe(parcelKey('org.a', 1, 2, 0));
    expect(parcelKey('org.a', 1, 2, 0)).not.toBe(parcelKey('org.a', 1, 3, 0));
    // A road keeps its identity regardless of which end the caller walked from.
    expect(roadKey('gate.n', 'nucleus.0', 'high')).toBe(roadKey('nucleus.0', 'gate.n', 'high'));
  });

  it('hashUnit is order-independent — it carries no stream state', () => {
    const a = hashUnit('x'); const b = hashUnit('y'); const a2 = hashUnit('x');
    expect(a).toBe(a2);
    expect(a).not.toBe(b);
  });
});


/**
 * ⭐⭐⭐ MF-B6 · §11.11 THE SNAPSHOTS — the inertia law across YEARS.
 *
 * §11.0's claim has always been about EDITS ("a new road appears; the town does not
 * reshuffle"). §11.11 makes the same claim across TIME, and it is the harder half: two
 * chronicled years of one settlement must agree everywhere the record did not change, or the
 * year affordance is a re-roll wearing a chronicle's name.
 */
describe('§11.11 the snapshot law', () => {
  /** A fixture with a real dated chronicle and a datable circuit. */
  // ⚠ WALLED BY CONSTRUCTION. The vintage gate is a claim ABOUT A CIRCUIT, so a fixture with
  // no walls makes both arms vacuously true — which is exactly how the first spelling of this
  // suite passed its "no wall before the vintage" arm on a town that never had one.
  const chronicled = (over = {}) => makeWalledFixture({
    _seed: 'b6-snapshot',
    history: {
      founding: { kind: 'charter', age: 200 },
      age: 200,
      historicalEvents: [
        { yearsAgo: 150, type: 'disaster', name: 'The First Sack', severity: 'major' },
        { yearsAgo: 40, type: 'demographic', name: 'The Migration', severity: 'major' },
      ],
    },
    ...over,
  });
  const at = (year, opts = {}) => {
    const s = chronicled();
    const model = buildTownMapModel(s, null);
    const present = buildFabric(s, model, {});
    const vin = present.record.get('wall-built-year', null);
    return buildFabric(settlementAtYear(s, year), model, {
      year,
      wallBuiltAtAge: vin ? vin.ageAtBuild : null,
      presentAge: presentYear(s),
      ...opts,
    });
  };
  /** The FEATURE fingerprints the inertia law is about, one per drawn family. */
  const fp = (f) => ({
    // ⭐ §5 W2 · THE BACK-HOUSE JOINS THE FINGERPRINT, AND THE PIN IS STRICTER FOR IT. MEASURED
    // at MF-W2: raising a circuit whose §239.2 per-run band exempts its toft-backs runs moved
    // NO plot polygon on this fixture and DID move back-houses — so the old fingerprint read
    // "nothing changed" about a fabric that had changed, and the arm below that exists to prove
    // the change is real would have gone vacuous. ⭐ THE CLASS: **A FINGERPRINT THAT OMITS A
    // DRAWN FAMILY CANNOT SEE A CHANGE CONFINED TO IT** — §195.0's lesson at the pin.
    parcels: sha(f.parcels.map((p) => [p.key, p.polygon, p.backHouse])),
    channels: sha(f.channels.map((c) => [c.key || c.rank, c.line])),
    organisms: sha(f.organisms.map((o) => [o.key, o.x, o.y, o.reach])),
    landmarks: sha(f.landmarks.map((l) => [l.instanceKey, l.x, l.y, l.rot, l.solids])),
    fields: sha(f.fields.parcels.map((q) => q.polygon)),
    walls: sha(f.walls.map((w) => [w.kind, w.polygon])),
  });

  it('TWO YEARS WITH THE SAME HORIZON ARE BYTE-IDENTICAL, feature for feature', () => {
    // Nothing happened between year 60 and year 100 on this chronicle, and the circuit was
    // already standing, so every drawn family must agree exactly.
    const a = at(60), b = at(100);
    expect(fp(a)).toEqual(fp(b));
    // …and so must the annotation, because the note-lifespan law is a WINDOW and not a top-K.
    expect(a.immersion.notes.notes.map((n) => n.cite))
      .toEqual(b.immersion.notes.notes.map((n) => n.cite));
  });

  it('⭐⭐ THE CIRCUIT\'S VINTAGE MOVES ONLY THE WALL — the town does not reshuffle', () => {
    const s = chronicled();
    const model = buildTownMapModel(s, null);
    const vin = buildFabric(s, model, {}).record.get('wall-built-year', null);
    expect(Number.isFinite(vin.ageAtBuild)).toBe(true);
    const before = at(vin.ageAtBuild - 1);
    const after = at(vin.ageAtBuild);
    expect(before.meta.wallStanding).toBe(false);
    expect(after.meta.wallStanding).toBe(true);
    expect(before.walls).toHaveLength(0);
    // ⭐⭐⭐ THE LAW ITSELF, AND §200 SHARPENED IT — A DECLARED BEHAVIOUR SHIFT, NOT A
    // WEAKENING. MF-B6 asserted that raising the circuit moved the wall and NOTHING else.
    // That was true while the wall was an overlay nobody had to keep off. Now the band is a
    // CLAIM (§200), so building a circuit does what building a circuit did: it CLEARS ITS OWN
    // WORKING LANE. Houses inside the intervallum come down; the town beyond it does not
    // reshuffle. The pin is therefore stronger than before rather than looser — it asserts
    // WHERE the change is allowed to be, which the old spelling never did:
    //   · organisms, institutions and fields: byte-identical, as before;
    //   · parcels and channels: every body OUTSIDE the band's reach byte-identical;
    //   · inside the reach: change is expected, and is asserted to be non-empty.
    const A = fp(before), B = fp(after);
    for (const k of ['organisms', 'fields']) {
      expect(A[k], `${k} moved when only the wall and its lane should have`).toBe(B[k]);
    }
    // ⚠ AN INSTITUTION'S ANCHOR IS INERTIAL; ITS DRAWN BODY OBEYS THE BAND. Seating happens
    // before the circuit exists, so no landmark MOVES — but a range standing in the new
    // intervallum is clipped like any other body, so `solids` is judged by the same near/far
    // rule as the parcels below.
    const anchors = (f) => f.landmarks.map((l) => [l.instanceKey, l.x, l.y, l.rot]);
    expect(JSON.stringify(anchors(before))).toBe(JSON.stringify(anchors(after)));
    expect(A.walls).not.toBe(B.walls);
    // ⭐⭐⭐ THE BAND'S REACH, AND IT IS MEASURED RATHER THAN ASSERTED. Raising a circuit
    // clips the bodies in its lane; each clip can shift a neighbour's party line, so the
    // disturbance propagates a little way past the band itself. MEASURED on this fixture:
    // 673 unrepaired parcels byte-identical, 55 changed, and **the farthest changed body sits
    // 9.4 units — 1.2 frontages — outside the band**, with a maximum centre movement of 6.83
    // units (0.87 of a frontage). So the honest law is not "nothing else changes" but the
    // one §11.0 actually states: THE TOWN DOES NOT RESHUFFLE. Two frontages is the bound the
    // measurement supports, and the pin asserts BOTH halves — identity outside it, and no
    // body anywhere moving a whole frontage.
    // ⭐⭐ §5 W2 · THE CIRCUIT NOW RESERVES **THREE** SURFACES, AND THE PIN NAMES ALL THREE
    // RATHER THAN WIDENING ITS TOLERANCE. Raising a circuit clears its own working lane (§200,
    // above); §239.2's wall-side street draws a carriageway inside that lane; and §250.5's
    // demotion turns a SUPERSEDED circuit into a ring street deep inside the fabric. The last
    // one is why this pin red at MF-W2: a demoted ring street is a claim tens of units from the
    // standing wall, and a body it clips is "nowhere near the circuit" only if you ask about
    // the wall that is still standing. ⛔ **THE LAW IS UNCHANGED — the change must be confined
    // to ground the circuit reserved — and the pin now asks about the whole reservation.**
    const segs = [];
    const claimLines = claimsOfRings(after.walls, after.meta.builtRadius)
      .concat(((after.demotion && after.demotion.ringStreets) || []).map((r) => ({ line: r.line, width: r.width })))
      .concat(after.walls.reduce((acc, w) => acc.concat((w.wallLanes || []).map((l) => ({ line: l.line, width: l.width }))), []));
    for (const c of claimLines) {
      const half = c.width / 2;
      for (let i = 0; i + 1 < c.line.length; i++) segs.push({ ax: c.line[i][0], ay: c.line[i][1], bx: c.line[i + 1][0], by: c.line[i + 1][1], half });
    }
    const BAND_REACH = after.meta.plotFrontage * 2;
    const nearBand = (poly) => {
      for (const p of poly) {
        for (const sg of segs) {
          const dx = sg.bx - sg.ax, dy = sg.by - sg.ay;
          const L = dx * dx + dy * dy;
          let t = L > 0 ? ((p[0] - sg.ax) * dx + (p[1] - sg.ay) * dy) / L : 0;
          if (t < 0) t = 0; else if (t > 1) t = 1;
          const qx = sg.ax + dx * t, qy = sg.ay + dy * t;
          if (Math.hypot(p[0] - qx, p[1] - qy) - sg.half <= BAND_REACH) return true;
        }
      }
      return false;
    };
    // ⚠ THE §202 ACCESS REPAIR IS A GLOBAL PASS and a body it touched is not evidence about
    // the wall: raising the circuit changes which bodies are SEALED, so the repair acts on a
    // different set. Those bodies carry `accessRepaired` (the repair records what it did —
    // §15.6) and are excluded BY NAME. ⭐ A PIN THAT CANNOT NAME ITS EXCLUSIONS ENDS UP
    // WIDENING ITS TOLERANCE UNTIL IT PASSES, WHICH IS HOW A LAW BECOMES A SUGGESTION.
    const beforeByKey = new Map(before.parcels.map((p) => [p.key, p]));
    const centre = (poly) => {
      let x = 0, y = 0;
      for (const p of poly) { x += p[0]; y += p[1]; }
      return [x / poly.length, y / poly.length];
    };
    const bandWidth = after.walls.reduce((mx, w) => Math.max(mx, w.band || 0), 0);
    // The block runs the band actually reaches — computed ONCE, from the geometry, so the
    // exclusion is a measurement rather than a name-list.
    // ⚠ COMPUTED OVER **BOTH** STATES. A run whose band-side plots the circuit DELETED has no
    // parcel near the band in `after` at all, so an after-only reading would fail to flag
    // exactly the runs the wall hit hardest — the ones whose row re-cut furthest. ⭐ THE
    // CLASS: an exclusion derived from one side of a before/after pair is blind to whatever
    // the change removed.
    const touchedRuns = new Set();
    for (const f of [before, after]) {
      for (const p of f.parcels) {
        if (p.blockRun && (nearBand(p.polygon) || (p.backHouse && nearBand(p.backHouse)))) {
          touchedRuns.add(String(p.blockRun));
        }
      }
    }
    /** @type {number[]} */ const moves = [];
    let compared = 0, moved = 0;
    for (const p of after.parcels) {
      const q = beforeByKey.get(p.key);
      if (!q || p.accessRepaired || q.accessRepaired) continue;
      const same = JSON.stringify([p.polygon, p.backHouse]) === JSON.stringify([q.polygon, q.backHouse]);
      if (!same) {
        // ⭐⭐ THE UNIT OF INERTIA AT THE FABRIC SCALE IS THE **BLOCK**, NOT THE PLOT — and
        // MF-B8's "plots cut to the block" is what makes that explicit rather than accidental.
        // A burgage row is cut AS A ROW: its widths are normalised onto the block's admissible
        // span so the last plot ends where the block does. So when the circuit's band takes
        // ground off one end of a span, the whole row re-cuts — which is what a surveyor did
        // when a town took a strip for its wall, and it is why the leftover ground, the drops
        // and §202's last violation fall. A plot at the far end of a re-cut row is therefore
        // legitimately changed while being far from the stones.
        // ⚠ THE PIN DOES NOT WIDEN TO ACCOMMODATE THIS — IT ASKS THE RIGHT QUESTION. The
        // claim is that the change is confined to blocks THE BAND TOUCHED, which is checkable
        // and which a global reshuffle fails outright. ⭐ A PIN THAT CANNOT NAME ITS
        // EXCLUSIONS ENDS UP WIDENING ITS TOLERANCE UNTIL IT PASSES; naming the unit is the
        // opposite move.
        const near = nearBand(p.polygon) || (p.backHouse && nearBand(p.backHouse)) || nearBand(q.polygon)
          || touchedRuns.has(String(p.blockRun)) || touchedRuns.has(String(q.blockRun))
          // A plot whose BLOCK RUN IDENTITY changed is by definition in a row that re-cut.
          || String(p.blockRun) !== String(q.blockRun);
        expect(near, `parcel ${p.key} changed and its BLOCK is nowhere near the circuit`).toBe(true);
        // ⚠⚠ THE BOUND IS RE-DERIVED FROM THE QUANTITY THAT ACTUALLY CHANGED, AND MF-B8's
        // OWN CHANGE IS WHY. With plots CUT TO THE BLOCK (§17.4's frontage law read
        // forwards), a span whose admissible ground moves re-cuts its whole row so the row
        // still exactly fills the block — which is the correct burgage behaviour and is the
        // reason the leftover ground, the drops and §202's last violation fall. A plot's
        // centre can therefore shift by the SPAN's own change, which the wall band bounds;
        // the old "less than one plot frontage" bound was a proxy that held only while plots
        // were cut to a template, and MF-B8 also made the frontage 40% finer, so the proxy
        // tightened for a reason that has nothing to do with inertia.
        // MEASURED on the corpus pair at this base: 967 parcels byte-identical, 44 changed,
        // centre movement p50 0.39 · p90 2.30 · MAX 4.38 units = 1.01 wall bands.
        // ⭐ THE PIN IS STRICTER, NOT LOOSER: it now asserts BOTH the absolute reach (a body
        // may move at most the reservation that appeared plus the module its row re-cut in)
        // AND that the overwhelming majority barely move at all — a global reshuffle passes
        // neither, and the old single bound would have passed a fabric where every body
        // drifted 0.9 of a frontage.
        const [ax2, ay2] = centre(p.polygon), [bx2, by2] = centre(q.polygon);
        const d = Math.hypot(ax2 - bx2, ay2 - by2);
        expect(d, `parcel ${p.key} MOVED — the town is reshuffling, which §11.0 forbids`)
          .toBeLessThan(bandWidth + after.meta.plotFrontage);
        moves.push(d);
        moved++;
      } else compared++;
    }
    // ⛔⛔ ⟦§301.6⟧ **THE NON-VACUITY ARM COUNTED PARCELS AND THE CHANGE HAD ALREADY LEFT THEM.**
    //    MEASURED at this lane's base: raising the circuit on this fixture moved **ZERO parcel
    //    polygons**, ONE back-house and ONE LOD mass — so `moved > 0` was passing on a single
    //    back-house. Re-aiming the terrain pull (§301.6) moved the wall onto ground that clears
    //    that back-house too, and the arm read 0 — while the same pair produced **SEVEN faubourg
    //    buildings where the base produced none**, a whole drawn family the counter never walks.
    // ⭐ THE CLASS IS THIS FILE'S OWN, ONE FAMILY FURTHER OUT: **A FINGERPRINT THAT OMITS A DRAWN
    //    FAMILY CANNOT SEE A CHANGE CONFINED TO IT.** MF-W2 extended it from parcels to
    //    back-houses; the change is now in the faubourg, so the arm asks the whole drawn set.
    // ⚠ THE INERTIA LAW ITSELF IS UNCHANGED AND IS STILL ASSERTED ON PARCELS ABOVE — this is the
    //    NON-VACUITY half, and it is STRICTER for being asked of everything the circuit reaches.
    const drawnTouched = () => {
      let n = 0;
      const cmp = (A, B, key, val) => {
        const m = new Map(A.map((x) => [key(x), JSON.stringify(val(x))]));
        for (const x of B) {
          const k = key(x);
          if (!m.has(k) || m.get(k) !== JSON.stringify(val(x))) n++;
        }
      };
      cmp(before.parcels, after.parcels, (p) => p.key, (p) => [p.polygon, p.backHouse, p.rung || null]);
      cmp(before.lod.masses, after.lod.masses, (m) => m.key, (m) => m.polygon);
      cmp(before.shanty.huts, after.shanty.huts, (h) => h.key, (h) => h.polygon);
      cmp(before.landmarks, after.landmarks, (l) => l.instanceKey, (l) => l.solids);
      cmp(before.channels, after.channels, (c) => c.key || c.rank, (c) => c.line);
      n += Math.abs((after.meta.faubourgBuildings || 0) - (before.meta.faubourgBuildings || 0));
      return n;
    };
    // Both halves must be non-empty or the pin is vacuous in one direction or the other.
    expect(compared).toBeGreaterThan(100);
    expect(drawnTouched(), 'raising a circuit changed NOTHING the leaf draws — the pin has no subject')
      .toBeGreaterThan(0);
    // ⭐ THE SECOND HALF OF THE BOUND: the DISTRIBUTION, not just the maximum. §11.0's claim
    // is "a new road appears; the town does not reshuffle", and a town where every body
    // drifted just under the cap would satisfy a maximum and violate the law.
    moves.sort((a, b) => a - b);
    // ⚠ GUARDED, AND THE GUARD IS NOT A WEAKENING: a median over an EMPTY list is `undefined`,
    //   which `toBeLessThan` fails for the wrong reason. Zero moved parcels satisfies "the town
    //   does not reshuffle" as completely as any distribution can, and the arm above proves the
    //   pair is not vacuous.
    if (moves.length) {
      expect(moves[Math.floor(moves.length * 0.5)],
        'the MEDIAN changed body must barely move — half a frontage is already generous')
        .toBeLessThan(after.meta.plotFrontage * 0.5);
    }
    expect(moved / (moved + compared),
      'only a small share of the fabric may change at all when a circuit is raised')
      .toBeLessThan(0.12);
    // ⭐ AND THE CHANGE IS REAL: the lane the circuit cleared is not empty. Without this the
    // pin would pass on a wall that reserved nothing at all.
    // ⛔ ⟦§301.6⟧ IT USED TO ASK THE **PARCEL** FINGERPRINT, WHICH IS THE SAME BLINDNESS THE
    //   non-vacuity arm above was just cured of: on this fixture the re-aimed terrain pull leaves
    //   every parcel polygon and back-house untouched and puts SEVEN buildings in the faubourg,
    //   so a parcel-only reading calls a leaf that visibly changed "unchanged". The wall's own
    //   appearance is asserted above (`A.walls !== B.walls`); what belongs here is that the
    //   circuit RESERVED something the leaf draws, and `drawnTouched` is the reading that says so.
    expect(drawnTouched(), 'the circuit reserved nothing any drawn family noticed').toBeGreaterThan(0);
    // A faubourg is growth OUTSIDE A WALL, so it cannot exist before one.
    expect(before.meta.faubourgBuildings).toBe(0);
  });

  it('PLANTED CONTROL: the year-projection can red — an event year moves the annotation', () => {
    // ⭐ Without this arm a snapshot member that ignored the year entirely would pass every
    // assertion above, because "nothing changed" is exactly what the law predicts.
    const s = chronicled();
    const before = at(49), after = at(51);          // the sack lands in year 50
    expect(before.immersion.notes.notes.map((n) => n.cite))
      .not.toEqual(after.immersion.notes.notes.map((n) => n.cite));
    expect(after.immersion.notes.notes.some((n) => /First Sack/.test(n.cite))).toBe(true);
    expect(before.immersion.notes.notes.some((n) => /First Sack/.test(n.cite))).toBe(false);
    // TIME-CORRECTNESS (§12.1): a leaf may never quote an event that has not happened.
    expect(settlementAtYear(s, 49).history.historicalEvents.every((e) => e.yearsAgo >= 0)).toBe(true);
  });

  it('⛔ THE FRACTION-OF-NOW DEFECT: an unstamped vintage can NEVER be crossed', () => {
    // ⭐⭐ THE COUNTERFACTUAL THAT PROVES THE STAMP IS LOAD-BEARING, and it is the defect the
    // member actually found. `deriveWallVintage` computes the build age as a FRACTION OF THE
    // CURRENT AGE, so under a year projection it slides down with the year: a year-18 leaf of
    // a town walled in year 49 came back WITH ITS WALL, silently, on every leaf.
    const s = chronicled();
    const model = buildTownMapModel(s, null);
    // ⚠ THE YEAR IS 5, AND THE CHOICE IS THE MEASUREMENT. This fixture's circuit is dated to
    // its NINTH year (a 20,000-soul city crossed the 901-soul circuit threshold early in a
    // 200-year life), so the arm has to stand before year 9 to be about anything at all.
    const unstamped = buildFabric(settlementAtYear(s, 5), model, { year: 5 });
    expect(unstamped.meta.wallStanding, 'the unstamped gate fired — the defect is cured elsewhere and this arm is now vacuous').toBe(true);
    const stamped = at(5);
    expect(stamped.meta.wallStanding).toBe(false);
    // And the gate itself is a pure predicate that CAN say no.
    expect(wallStandingAt({ ageAtBuild: 50 }, 20, true).standing).toBe(false);
    expect(wallStandingAt({ ageAtBuild: 50 }, 80, true).standing).toBe(true);
    expect(wallStandingAt({ ageAtBuild: 50 }, 20, false).standing).toBe(false);
  });

  it('the SNAPSHOT YEARS are the years something changed, and nothing between them', () => {
    const s = chronicled();
    const years = snapshotYears(s, 9).years;
    // Every event year and its eve, the vintage and its eve, and the present.
    expect(years).toContain(200);
    expect(years).toContain(50);
    expect(years).toContain(49);
    expect(years).toContain(9);
    expect(years).toContain(8);
    // ⭐ AND THE CLAIM THE LIST MAKES IS TESTED, not just its contents: a year BETWEEN two
    // rungs is byte-identical to the rung below it, which is why it is not a distinct leaf.
    expect(fp(at(70))).toEqual(fp(at(120)));
  });
});
