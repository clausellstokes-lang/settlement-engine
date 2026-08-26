/**
 * domain/townMap/fabric/partitionDecline.js — ⭐⭐⭐ SPINE-2 · DESIGN_SPINE **§3f** · **THE PIECES
 * THAT EMPTY: LossRegion FACES UNDER THE RULED STATE MACHINE.**
 *
 * §3f: *"pieces empty → abandon → LossRegion per the ruled state machine (time-driven decay,
 * pressure-driven recovery, never conflated; §643.3)."*
 *
 * ⭐⭐⭐ **THE MACHINE IS NOT INVENTED HERE. IT IS `growthLedger.LOSS_REGION_SCHEMA`, BUILT.**
 * GROW-A reserved the shape — six states, two clocks, the field roster — precisely *"so B never
 * re-shapes the ledger"*. This module is that shape given faces, and every state name and clock
 * name below is the schema's own, imported rather than re-spelled so a drift is a syntax error.
 *
 * ⛔⛔ **THE TWO CLOCKS ARE TWO FUNCTIONS, AND THAT IS THE WHOLE OF "NEVER CONFLATED".** §643.3 and
 * A1.4 both say it and the schema says it twice more:
 *   `stageClock`    — *"TIME-driven — hf379's decay ladder on the abandoned"*
 *   `pressureClock` — *"PRESSURE-driven — recovery is a function of urban pressure, never of time"*
 * A single function taking both would let one leak into the other on any later edit, and the leak
 * would be invisible: a settlement whose ruins healed because a century passed reads exactly like a
 * settlement whose ruins healed because people came back. So `decayByTime` takes ELAPSED YEARS and
 * cannot see pressure; `recoverByPressure` takes PRESSURE and cannot see the year. The unit suite
 * plants both halves — a zero-year epoch under pressure, and a zero-pressure epoch across a
 * century — and asserts the OTHER clock does not move.
 *
 * ⚠ **WHERE THE DECLINE SIGNAL COMES FROM, SAID PLAINLY.** `ledger.epochs[k].lossRegions` is `[]`
 * on every ledger the estate mints and GROW-A **pins it empty by test** (`builtBy: REG-GROW-B`).
 * So this module reads that channel FIRST — history wins where it speaks, and when car B fills it
 * these faces will be born from its records — and otherwise reads the ledger's own POPULATION FALL,
 * which is not an invention: it is `deriveTrajectory`'s stepped decline expressed on the substrate.
 * Measured across the corpus, exactly ONE leaf of eighteen falls at all (`highwater`, 5,001 → 3,502
 * across two epochs), which is why the synthetic control below is not optional.
 *
 * PURITY: pure. No Date, no Math.random, no rng.
 */

import { LOSS_REGION_SCHEMA } from './growthLedger.js';
import { faceCentroid, liveFaces } from './partitionArrangement.js';

/** The schema's six states, taken from their one home. */
export const LOSS_STATES = LOSS_REGION_SCHEMA.states;

/**
 * ⭐⭐ **THE DECAY LADDER AND THE RECOVERY PRICE.**
 *
 *  debrisYears     how long an abandoned piece STANDS before it reads as debris. A generation:
 *                  a roof unmaintained fails inside 25 years and the building follows it.
 *  breakdownYears  cumulative years to BREAKING_DOWN — walls down to their footings, the plot
 *                  legible only as a rectangle in the grass. Three generations.
 *  reclaimCost     the pressure, in plots of demand, that buys back ONE abandoned piece. It is
 *                  above 1 because a ruin must be CLEARED before it is built on, and below 2.5
 *                  because the footings, the boundaries and the lane are all still there — which
 *                  is why real towns re-occupy their own ruins before they extend.
 *  contactReach    ⚠ THERE IS NO DISTANCE CONSTANT. The growth front CONTACTS a region when a live
 *                  piece shares an EDGE with it, which the partition can answer structurally; a
 *                  radius here would be a second adjacency truth beside the one the faces already
 *                  carry.
 * ⚠ PROPOSED; rides the chair's signature and the owner's tuning re-signature.
 */
export const LOSS_LAW = Object.freeze({
  debrisYears: 25,
  breakdownYears: 75,
  reclaimCost: 2,
  contactReach: null,
});

/**
 * ⭐⭐⭐ **BIRTH · pieces empty → abandon.** The epoch's ledger target sits below what the partition
 * already holds, so souls have left and their tenure stands empty.
 *
 * ⚠ **THE OUTERMOST GO FIRST, AND THAT IS THE LEDGER'S OWN SHAPE, NOT A PREFERENCE.** `builtRadius`
 * is a function of population in `growthLedger`, so a fall IS a contraction of the built radius —
 * the ground a shrinking settlement stops holding is the ground furthest from its core. Abandoning
 * a random scatter would draw a moth-eaten town; abandoning the rim draws one that pulled in.
 *
 * @returns {Array<any>} the LossRegions born this epoch
 */
export function declineEpoch(state, ep, want) {
  const { arr, input } = state;
  const born = [];
  if (!(want > 0)) return born;
  // ⭐ HISTORY FIRST, WHERE IT SPEAKS. When car B fills the ledger's reserved channel these regions
  //   are born from its dated records and the population fall is not consulted at all.
  const recorded = (ep && ep.lossRegions) || [];
  const cx = input.extent.cx; const cy = input.extent.cy;
  const cands = liveFaces(arr)
    .filter((f) => f.cls === 'PLOT' && !(f.attrs && f.attrs.moored))
    .map((f) => ({ f, r: Math.hypot(faceCentroid(arr, f.id)[0] - cx, faceCentroid(arr, f.id)[1] - cy) }))
    .sort((a, b) => b.r - a.r || a.f.id - b.f.id);
  const n = Math.min(want, cands.length);
  for (let k = 0; k < n; k++) {
    const f = cands[k].f;
    const rec = recorded[k] || null;
    const key = `loss.${state.losses.length}`;
    const sourceEvent = rec && rec.sourceEvent
      ? rec.sourceEvent
      : `growthLedger trajectory fall at epoch ${state.epoch}: population ${ep.population}`
        + ` against a peak of ${ep.peakSoFar}`;
    const loss = {
      key,
      /** ⚠ THE SCHEMA'S OWN FIELD ROSTER — `LOSS_REGION_SCHEMA.fields`, in its order. */
      bornEpoch: state.epoch,
      bornYear: ep.year,
      sourceEvent,
      severity: rec && rec.severity ? rec.severity : 'major',
      kind: rec && rec.kind ? rec.kind : 'abandonment',
      state: 'INTACT',
      stageClock: 0,
      pressureClock: 0,
      footprint: f.id,
      contactEpochs: [],
      ops: 0,
      provenance: rec ? 'recorded' : 'interpolated',
    };
    f.cls = 'LOSSREGION';
    f.attrs = { ...f.attrs, loss: key, lossState: 'INTACT' };
    state.plots--;
    state.losses.push(loss);
    born.push(loss);
    state.stamp(`loss.${f.id}`, 'ABANDONMENT', ep,
      `the piece emptied — ${sourceEvent}`);
  }
  return born;
}

/**
 * ⛔⛔ **CLOCK ONE · TIME.** Advances `stageClock` by ELAPSED YEARS and walks the decay ladder.
 * **IT CANNOT SEE PRESSURE**, and the signature is the enforcement: `years` is the only number it
 * takes. A region under the growth front decays at exactly the rate one in open country does,
 * because decay is what weather does to a roof.
 */
export function decayByTime(state, ep, years) {
  const moved = [];
  if (!(years > 0)) return moved;
  for (const L of state.losses) {
    if (L.state === 'RECLAIMED') continue;
    L.stageClock += years;
    const was = L.state;
    // ⭐⭐ **THE LADDER IS A FUNCTION OF THE CLOCK, NOT OF HOW OFTEN IT WAS ASKED.** The first
    //   spelling advanced ONE rung per call, so a region's decay depended on the ledger's EPOCH
    //   SPACING rather than on elapsed years — a settlement with 36 banded epochs would rot faster
    //   than one with 8 across the same three centuries, which is a clock reading its own caller.
    // ⚠ AND IT ONLY DESCENDS FROM THE STANDING STATES. A region the growth front has bitten
    //   (CONTACTED / FROZEN_MID_BITE) keeps its clock running but keeps its state: what happens to
    //   it next is the PRESSURE clock's sentence to pass, not time's.
    if (was === 'INTACT' || was === 'DEBRIS') {
      if (L.stageClock >= LOSS_LAW.breakdownYears) L.state = 'BREAKING_DOWN';
      else if (L.stageClock >= LOSS_LAW.debrisYears) L.state = 'DEBRIS';
    }
    if (L.state !== was) {
      L.ops++;
      moved.push(L);
      const f = state.arr.faces[L.footprint];
      if (f) f.attrs = { ...f.attrs, lossState: L.state };
      state.stamp(`loss.${L.footprint}`, 'DEBRIS', ep,
        `${L.stageClock} year(s) standing empty since ${L.bornYear} — ${was} → ${L.state} on the`
        + ' TIME clock alone');
    }
  }
  return moved;
}

/**
 * ⛔⛔ **CLOCK TWO · PRESSURE.** Advances `pressureClock` by the epoch's own growth demand where the
 * growth front TOUCHES the region, and **IT CANNOT SEE THE YEAR**. A century of quiet moves nothing
 * here; one epoch of real demand against a ruin's edge moves everything.
 *
 * THE THREE TRANSITIONS, each with the schema's own name:
 *   CONTACTED        the front reached it and demand is being spent on it → `RECLAMATION_START`
 *   FROZEN_MID_BITE  it was being taken and the demand stopped → `RECLAMATION_HALT`
 *   RECLAIMED        the price is paid; the ground returns to FIELD for the recursion to develop
 *
 * @param {number} pressure plots of demand this epoch has to spend, ≥ 0
 * @returns {{reclaimed:Array<number>, spent:number}}
 */
export function recoverByPressure(state, ep, pressure) {
  const { arr } = state;
  const out = { reclaimed: [], spent: 0, started: 0, halted: 0 };
  let budget = Math.max(0, pressure);
  // nearest the core first — a settlement re-takes its own centre before its rim
  const cx = state.input.extent.cx; const cy = state.input.extent.cy;
  const live = state.losses.filter((L) => L.state !== 'RECLAIMED')
    .map((L) => {
      const f = arr.faces[L.footprint];
      const c = f && f.alive ? faceCentroid(arr, L.footprint) : [Infinity, Infinity];
      return { L, r: Math.hypot(c[0] - cx, c[1] - cy) };
    })
    .sort((a, b) => a.r - b.r || a.L.footprint - b.L.footprint);
  for (const { L } of live) {
    const f = arr.faces[L.footprint];
    if (!f || !f.alive || f.cls !== 'LOSSREGION') continue;
    const touched = frontTouches(arr, L.footprint);
    if (!touched) continue;
    if (budget <= 0) {
      // ⭐ THE BITE THAT STOPPED. Only a region already under the front can FREEZE — a ruin nobody
      //   reached is not frozen mid-bite, it is simply standing, and calling it frozen would make
      //   the state name mean nothing.
      if (L.state === 'CONTACTED') {
        L.state = 'FROZEN_MID_BITE'; L.ops++; out.halted++;
        f.attrs = { ...f.attrs, lossState: L.state };
        state.stamp(`loss.${L.footprint}`, 'RECLAMATION_HALT', ep,
          `the growth front reached it and the demand ran out at ${L.pressureClock.toFixed(2)} of`
          + ` ${LOSS_LAW.reclaimCost} — ${L.sourceEvent}`);
      }
      continue;
    }
    if (L.state !== 'CONTACTED') {
      L.state = 'CONTACTED'; L.ops++; out.started++;
      L.contactEpochs.push(state.epoch);
      f.attrs = { ...f.attrs, lossState: L.state };
      state.stamp(`loss.${L.footprint}`, 'RECLAMATION_START', ep,
        `the growth front reached the ruin at epoch ${state.epoch} — ${L.sourceEvent}`);
    }
    const spend = Math.min(budget, LOSS_LAW.reclaimCost - L.pressureClock);
    L.pressureClock += spend;
    budget -= spend;
    out.spent += spend;
    if (L.pressureClock >= LOSS_LAW.reclaimCost) {
      L.state = 'RECLAIMED'; L.ops++;
      // ⭐ THE GROUND COMES BACK AS **FIELD**, NOT AS A PLOT. Reclaiming clears the ruin; what is
      //   built on it afterwards is the stop-rule recursion's business at the epoch's own floor, so
      //   a re-occupied quarter is drawn by the same law that drew it the first time.
      f.cls = 'FIELD';
      f.attrs = { ...f.attrs, lossState: 'RECLAIMED', reclaimed: true, run: null, block: null };
      out.reclaimed.push(L.footprint);
    }
  }
  return out;
}

/** Does any live PIECE or WAY face share an edge with this one? The growth front, structurally. */
function frontTouches(arr, fid) {
  let h = arr.faces[fid].he;
  const start = h;
  let guard = 0;
  do {
    const he = arr.halfEdges[h];
    const nb = arr.faces[arr.halfEdges[he.twin].face];
    if (nb && nb.alive && (nb.cls === 'PLOT' || nb.cls === 'WAY' || nb.cls === 'VOID')) return true;
    h = he.next;
    if (++guard > 100000) break;
  } while (h !== start);
  return false;
}

/**
 * ⭐ THE EPOCH'S DECLINE PASS, in the order §3f fixes: the two clocks run FIRST and INDEPENDENTLY,
 * and only then does the epoch decide whether it is growing or shrinking. Running recovery before
 * decay would let one epoch's demand outrun the same epoch's weather, which is the conflation the
 * whole design forbids stated as an ordering bug.
 */
export function reclaimEpoch(state, ep, years, pressure) {
  const decayed = decayByTime(state, ep, years);
  const rec = recoverByPressure(state, ep, pressure);
  return { decayed: decayed.length, ...rec };
}

/** The published decline record — every figure a reader can re-derive. */
export function publishLosses(state) {
  const byState = {};
  for (const L of state.losses) byState[L.state] = (byState[L.state] || 0) + 1;
  return Object.freeze({
    schema: LOSS_REGION_SCHEMA,
    /**
     * ⭐⭐ ⟦REG-D⟧ **THE LAW TRAVELS WITH THE RECORD, AND THIS IS THE §711.6 CLASS KILLED BEFORE
     * IT CAN FORM.** A `pressureClock` of 1.00 means nothing to a reader without the price it is
     * counting toward, so any consumer that wants the share a clearance reached — the decline
     * dress does — must have `reclaimCost`. There were exactly two ways to give it one: publish
     * it here, or let the consumer re-spell `2`. This programme has now caught that second shape
     * four times in four waves (`OP_CEILING` in two files with two meanings, §712.7; `ADVANCE`
     * with three consumers, §713.1; `trampled.ang` read three ways, §711.6) and every time the
     * error was invisible because each consumer was internally consistent. The law has ONE home,
     * `LOSS_LAW` above, and it rides the publication so a second spelling cannot exist.
     * ⚠ ADDITIVE ONLY: no existing field moves, and the record is still frozen.
     */
    law: LOSS_LAW,
    regions: Object.freeze(state.losses.map((L) => Object.freeze({ ...L, contactEpochs: Object.freeze(L.contactEpochs.slice()) }))),
    byState: Object.freeze(byState),
    reason: `${state.losses.length} LossRegion(s): `
      + (LOSS_STATES.map((s) => `${byState[s] || 0} ${s}`).join(' · ')),
  });
}
