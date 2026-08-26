/**
 * domain/townMap/fabric/growthLedger.js — ⭐⭐⭐ THE GROWTH LEDGER (DESIGN_REG_GROW **A1.1**,
 * ODQ §643.2(i)): **the kernel is a PRE-STAGE that produces an append-only, year-indexed
 * LEDGER as PURE DATA; `buildFabric` stays single-shot and renders the ledger's FINAL state.**
 *
 * ⭐⭐⭐ THE ONE SENTENCE THE WHOLE FILE OBEYS: *"An intermediate frame is the SAME single-shot
 * pipeline run on the ledger truncated at epoch K — prefix-closure holds by construction because
 * the ledger is append-only; each frame is one lawful construction."* So there is no epoch loop
 * inside the assembly, no per-epoch claim set, and none of the banked composition-order laws is
 * touched: `lawClaims` is still built ONCE (buildFabric.js:684-688), the circuit still runs ahead
 * of the ground law (buildFabric.js:577-585), the fossils still reserve before the packer
 * (buildFabric.js:677-698). The kernel runs BEFORE all of it and hands down one state.
 *
 * ⛔⛔ THE DEFECT THIS CURES, MEASURED AT THIS LANE'S BASE AND NOT INHERITED. `settlementAtYear`
 * re-issues the EVENT HORIZON and never the SIZE — `population` is held constant across snapshots
 * BY DECLARATION (snapshot.js:23-30) — and `tierScale` is the single funnel every growth stage
 * sizes through and reads no year at all. Measured on the corpus's own town at the base seal:
 * years **0, 18, 100, 154 and 191 all draw the same 1,232 plots with the same geometry**
 * (`parcelGeom 9f7f4b73d600`), `tierScale` digest `c01baf496667` at every one of them. The town at
 * its founding is drawn parcel-for-parcel identical to the town at 191 years. **So the cure is
 * not to teach a stage about the year: it is to give the FRAME ITS OWN POPULATION**, which
 * `tierScale` then sizes and every growth stage follows for free. That is `frameAtEpoch` below,
 * and it is why the cartouche starts printing the frame's souls without the lens being touched.
 *
 * ⭐⭐⭐ THE TRAJECTORY LAW (A1.2 / §643.2(ii) — **NO INVENTED HISTORY**). The sealed code forbids
 * the alternative by name: *"the snapshot does not invent a trajectory… Inventing the curve would
 * be a visual past the record never had, which §11.10 forbids by name"* (snapshot.js:26-30);
 * *"EVERY MARK CITES ITS SOURCE OR IS NOT DRAWN"* (immersion.js:12-14); growth monotone to the
 * high water is *"the only shape the record can defend"* (compile.js:239-242). Therefore a curve
 * here is a **CONSTRAINED INTERPOLANT, never an author**:
 *   • pinned through the PRESENT `C = settlement.population`;
 *   • its peak is `deriveHighWater(s).population` — **the SOLE peak deriver**, and the curve may
 *     never exceed it (S1's M2(ii): a minted peak above P is *"physical evidence of a peak the
 *     settlement NEVER HELD"*, the §631.3 defect one layer up). Asserted, not assumed;
 *   • **every down-step is anchored to a RECORDED, dated, severity-graded loss event** — REG-T
 *     §3's CASE discipline, its LOSS/MILITARY template rosters and its severity weights, adopted
 *     verbatim rather than re-derived;
 *   • **zero loss events ⇒ MONOTONE.** No fabricated famines. Decline FREQUENCY is an
 *     ENGINE-generation question for the owner's tuning pass, never a fabric-side invention.
 *
 * ⚠⚠ EVERY CURVE PARAMETER BELOW IS **TUNING-CLASS AND PROPOSED, NOT MINTED** (A1.2's last
 * clause). Each carries its proposal, its measurement where one exists, and the fact that the
 * chair signs and the owner re-signs at the tuning pass. §110.3's declared-shift discipline
 * covers BOTH shifts — this kernel's landing, and any later owner-signed constant change.
 *
 * ⭐⭐ THE `LossRegion` CHANNEL IS **FILLED FROM THE RECORD** (A1.4; ODQ §683). Car A reserved the
 * shape *"so car B never re-shapes the ledger"*; car B was dissolved into the spine (DESIGN_REG_GROW
 * A2), so the filling is this file's. **A region is born at a RECORDED, DATED, SEVERITY-GRADED loss
 * event and at nothing else** — A1.4 verbatim, *"monotone seeds included … debris never keys to
 * falling population"* — so a rising ledger with a great fire on its record carries ruins, and a
 * ledger whose record speaks no dated event carries none. ⛔ AN EMPTY CHANNEL IS THEREFORE A CORRECT
 * ANSWER, NOT A GAP, and `assertLossRegionsRecorded` states that law rather than pinning a zero.
 *
 * PURITY: pure arithmetic over the record. No Date, no Math.random, no runtime trig, no I/O,
 * no geometry. The ledger is data; the pipeline draws it.
 */

import { tierScale, tierForPopulation, deriveHighWater, TIERS, TIER_PROFILE } from './tierGrammar.js';
import { presentYear } from './snapshot.js';
import { deriveWallVintage } from './compile.js';
import { annotate, beatEvent, PROVENANCE } from './growthAnnotation.js';

/** The ledger's schema version. A consumer that reads a ledger checks this before its fields. */
export const LEDGER_VERSION = 1;

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §1 · THE RECORDED VOCABULARY — REG-T §3's rosters, ADOPTED VERBATIM
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐ THE LOSS ANCHORS a record can actually speak, taken from `laneREGT-receipt.md` §3 rather
 * than re-derived — one vocabulary, not two. A down-step may be dated to one of these and to
 * nothing else, which is what makes a minted FADE's famine **recorded**: the plague is typed,
 * dated and severity-graded in `historicalEvents`; only its numeric effect is derived.
 */
export const LOSS_TEMPLATES = Object.freeze([
  'external_threat', 'great_fire', 'plague_years', 'great_flood', 'occupation_legacy',
  'popular_uprising', 'tyranny', 'market_crash', 'trade_collapse', 'resource_scarcity',
  'demographic_pressure', 'population_friction',
]);

/** The SACK class — REG-T §3's MILITARY_TEMPLATES, verbatim. */
export const MILITARY_TEMPLATES = Object.freeze([
  'external_threat', 'occupation_legacy', 'popular_uprising', 'tyranny',
]);

/** The event CATEGORIES that carry loss even where the template is unfamiliar. */
export const LOSS_CATEGORIES = Object.freeze(['disaster']);
/** The categories that carry the sack class. */
export const MILITARY_CATEGORIES = Object.freeze(['occupation_infiltration']);

/**
 * ⚠ TUNING-CLASS, PROPOSED. REG-T §3's severity weights, pre-registered by that lane BEFORE its
 * census ran and reused here unchanged so the two instruments cannot disagree about one record.
 * The chair signs; the owner re-signs at the tuning pass.
 */
export const SEVERITY_WEIGHT = Object.freeze({ minor: 1, major: 2, catastrophic: 3 });

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §2 · THE TUNING SURFACE — every one PROPOSED with its rationale and its measurement
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⚠⚠ TUNING-CLASS, **PROPOSED AT 1.0 AND THE VALUE IS THE ARGUMENT.** The rise between anchors is
 * `R(t) = peak · (t/t_peak)^RISE_EXPONENT`. At 1.0 this is **exactly** the fabric's own
 * established reconstruction — `compile.deriveWallVintage`'s arithmetic, *"growth is treated as
 * monotone to the high water — the only shape the record can defend"* — so car A's trajectory is
 * PRECEDENTED AT THE SEAL rather than newly asserted (the machinery skeptic's own words: *"REG-
 * GROW-A can start: its monotone trajectory R(t)=C·t/A is the fabric's own established
 * reconstruction… already precedented at the seal"*).
 *
 * ⭐ A value above 1.0 would say settlements grow slowly then quickly; below 1.0, the reverse.
 * **Neither is in the record**, so proposing anything other than 1.0 would be this lane minting a
 * historical claim under a tuning constant's cover. The dial is DECLARED so the owner can turn it
 * at the tuning pass with the shift declared; car A does not turn it.
 */
export const RISE_EXPONENT = 1.0;

/**
 * ⚠ TUNING-CLASS, PROPOSED. **The band-splitting cap (A1.4): "split until no band moves more than
 * a chair-set fraction of extent."** A band whose built radius moves more than this share of the
 * FINAL built radius is split at its midpoint. 0.08 is proposed because it is the smallest value
 * that keeps every corpus tier inside `BAND_CEILING` while giving the steep segments their frames
 * — MEASURED per tier in the lane receipt's banding table. A tighter fraction starves nothing but
 * spends bands; a looser one lets a 30 %-in-6-years metropolis collapse into a single step, which
 * is the degenerate arc the panel's S3 measured on `regt-metropolis-14`.
 */
export const BAND_MAX_EXTENT_FRACTION = 0.08;

/**
 * ⚠ TUNING-CLASS, PROPOSED. §5's *"≤ ~40 replay steps for the oldest metropolis"*, stated as a
 * hard cap so the ledger's size is bounded by construction rather than by hope. ⚠ THESE ARE TIME
 * BANDS, NOT DRAWN EPOCHS — `epochAxis`'s `EPOCH_CEILING` of 4 is a RENDER vocabulary and the
 * reader below maps however many bands there are onto at most four drawn boundaries (A1.5). The
 * two numbers answer different questions and the collision the panel flagged cannot occur.
 */
export const BAND_CEILING = 40;

/**
 * ⚠⚠ TUNING-CLASS, PROPOSED AND **MEASURED** (§3b's *"under a saturation threshold (chair-minted,
 * tuning-surface)"*). While a circuit stands and the settlement's souls sit below
 * `SATURATION × capacity(ring)`, growth is INTRAMURAL INFILL; beyond it, growth leaves by TYPED
 * EMISSION ONLY and sprawl is structurally impossible.
 *
 * ⭐⭐ **PROPOSED AT 1.00, AND THE MEASUREMENT IS WHY THE DIAL IS NOT FREE.** §161m.1's circuit
 * economy raises the wall ON the fabric — *"the wall hugs the fabric tight"* — so a ring has
 * **zero geometric headroom at its own raise epoch by construction**: `capacity(ring)` is the
 * population whose `tierScale` built radius equals the ring's FROZEN radius, and at the raise
 * epoch that population IS the epoch's population. Measured over the corpus's walled leaves, the
 * saturation share at the raise epoch is 1.000 on every one of them. Proposing 0.90 would
 * therefore date the emission BEFORE the wall, which is not a threshold — it is an error.
 *
 * ⚠ SO THE DIAL BELOW ONLY BECOMES FREE IF THE CIRCUIT-ECONOMY LAW CHANGES (a wall raised with
 * room to grow inside it). It is declared as tuning-class because the owner may want exactly
 * that at the tuning pass, and the value must then move here rather than in a stage.
 */
export const SATURATION = 1.00;

/**
 * ⚠ TUNING-CLASS, PROPOSED — AND **MEASURED**. A1.5: *"the kernel's capacity accounting EXCLUDES
 * the square."* The market place is not room to build in; counting it as capacity would let a
 * town infill the one void §18.4's drift form is about, and `marketColonization` would then
 * double-count it as infill room (the panel's M4, ruled).
 *
 * ⭐ 0.02 is the MEASURED median share of a circuit's enclosed area that the squares take, over
 * the 12 walled corpus leaves at this lane's base: min 0.0123 (year-100) · median 0.0172 ·
 * max 0.0309 (city). ⚠ The first spelling of this constant was 0.06 — a guess, and it was three
 * times the measurement. Recorded rather than quietly corrected.
 */
export const SQUARE_CAPACITY_EXCLUSION = 0.02;

/**
 * ⚠⚠ TUNING-CLASS, PROPOSED — AND **MEASURED, WITH THE SPREAD REPORTED RATHER THAN AVERAGED
 * AWAY.** How much of an epoch's growth leaves the walls once saturation is passed. Below 1.0
 * because a saturated town still subdivides: the extramural share is what the fabric can no
 * longer take, never the whole increment.
 *
 * ⭐ THE CALIBRATION TARGET IS THE CORPUS'S OWN PRESENT-DAY SPLIT, measured at this lane's base
 * over the 12 walled leaves (extramural ÷ all drawn urban growth, LOD-corrected):
 *   town 0.419 · town-2 0.343 · polycentric 0.467 · crossing 0.395 · city 0.293 ·
 *   metropolis 0.119 · highwater 0.036 · year-100 0.041   → median **0.369**
 * Solving `extramural = X · (C − capacity)` against those targets gives **town ≈ 0.56 · city ≈
 * 0.40 · metropolis ≈ 0.19** — so the constant is TIER-VARYING and no single number fits.
 * **0.40 is proposed as the value that reproduces the corpus median**, and the per-tier table is
 * reported to the tuning pass rather than hidden inside an average. ⚠ A tier-indexed table is the
 * honest shape and it is NOT minted here: minting one would be this lane choosing three numbers
 * where it measured three, which is tuning wearing measurement's clothes.
 */
export const EXTRAMURAL_SHARE = 0.40;

/** ⚠ REPORTED, NOT CONSUMED. The measured per-tier solution behind `EXTRAMURAL_SHARE`'s single
 *  value — carried in the ledger's `tuning` block so the owner's pass sees the spread. */
export const EXTRAMURAL_SHARE_MEASURED = Object.freeze({ town: 0.56, city: 0.40, metropolis: 0.19 });

/** The tiers that earn a circuit — `epochAxis.CIRCUIT_THRESHOLDS`' vocabulary, spelled from
 *  `TIERS` so this module owes S5 no import (the stage manifest would refuse the edge). */
export const WALLED_TIERS = Object.freeze(TIERS.slice(TIERS.indexOf('town')));

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §3 · THE RESERVED LossRegion CHANNEL (A1.4) — SHAPE ONLY, CAR B BUILDS THE MECHANICS
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐ RESERVED, AND RESERVING IT IS THE POINT. A1.4 makes reclamation first-class kernel
 * mechanics with its own state machine — born at a RECORDED disaster (192/200 monotone seeds
 * carry dated disasters with NO trajectory fall, so **debris never keys to falling population**),
 * persisting as landscape fact, with per-epoch growth-front contact tests and TWO CLOCKS KEPT
 * SEPARATE (hf379's decay ladder is TIME-driven on the abandoned; recovery is PRESSURE-driven,
 * never time). Car B builds all of that. **Car A reserves the shape so B never re-shapes the
 * ledger** — a ledger whose channel arrives late is a ledger every car-A consumer must re-read.
 *
 * ⛔ `lossRegions` IS `[]` ON EVERY LEDGER THIS CAR MINTS, and that is asserted by a pin rather
 * than promised in a comment.
 */
export const LOSS_REGION_SCHEMA = Object.freeze({
  reservedBy: 'REG-GROW-A',
  builtBy: 'REG-GROW-B',
  law: 'DESIGN_REG_GROW.md A1.4; ODQ §643.3; A6.3 mints RECLAMATION_START/HALT into this stream',
  fields: Object.freeze([
    'key', 'bornEpoch', 'bornYear', 'sourceEvent', 'severity', 'kind',
    'state', 'stageClock', 'pressureClock', 'footprint', 'contactEpochs', 'ops',
  ]),
  states: Object.freeze(['INTACT', 'DEBRIS', 'CONTACTED', 'BREAKING_DOWN', 'FROZEN_MID_BITE', 'RECLAIMED']),
  clocks: Object.freeze({
    stageClock: 'TIME-driven — hf379\'s decay ladder on the abandoned',
    pressureClock: 'PRESSURE-driven — recovery is a function of urban pressure, never of time (§614.1)',
  }),
});

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §4 · THE TRAJECTORY — a CONSTRAINED INTERPOLANT (A1.2)
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/** Is this event a dated loss anchor? REG-T §3's test, one home. */
export function isLossAnchor(ev) {
  if (!ev || !Number.isFinite(ev.yearsAgo)) return false;
  const t = String(ev.templateType || '');
  const c = String(ev.type || '');
  return LOSS_TEMPLATES.indexOf(t) >= 0 || LOSS_CATEGORIES.indexOf(c) >= 0
    || MILITARY_TEMPLATES.indexOf(t) >= 0 || MILITARY_CATEGORIES.indexOf(c) >= 0;
}

/** Is this anchor MILITARY — the sack class? */
export function isMilitaryAnchor(ev) {
  const t = String((ev && ev.templateType) || '');
  const c = String((ev && ev.type) || '');
  return MILITARY_TEMPLATES.indexOf(t) >= 0 || MILITARY_CATEGORIES.indexOf(c) >= 0;
}

/**
 * ⭐⭐⭐ THE TRAJECTORY. Returns a pure function of the year plus the anchors it was pinned
 * through, so every consumer reads ONE series (§624.3's whole reason for minting T2: *"so the
 * film, REG-D and the soak legs read one canonical series instead of three private
 * reconstructions"*).
 *
 * @param {any} settlement
 * @returns {{ A:number, C:number, P:number, tPeak:number, anchors:Array<any>, shape:string,
 *             undatedDecline:boolean, at:(t:number)=>number, reason:string }}
 */
export function deriveTrajectory(settlement) {
  const s = settlement || {};
  const A = Math.max(0, presentYear(s));
  const C = Number.isFinite(s.population) ? Number(s.population) : 0;
  // ⭐⭐ deriveHighWater IS THE SOLE PEAK DERIVER (A1.2 / M3(a)). This module does not compute a
  // peak of its own and must not: if the curve's peak disagreed with the deriver's, the replay
  // would grow to one extent while every stage below sized to another and the final frame could
  // not equal the present map.
  const P = Math.max(C, deriveHighWater(s).population);
  const events = Array.isArray(s.history && s.history.historicalEvents) ? s.history.historicalEvents : [];

  /** The dated loss anchors, ascending by YEAR SINCE FOUNDING. */
  const anchors = events.filter(isLossAnchor).map((ev) => ({
    year: Math.max(0, Math.min(A, A - Math.trunc(ev.yearsAgo))),
    templateType: String(ev.templateType || ev.type || 'unknown'),
    severity: String(ev.severity || 'minor'),
    weight: SEVERITY_WEIGHT[String(ev.severity || 'minor')] || 1,
    military: isMilitaryAnchor(ev),
  })).sort((a, b) => (a.year - b.year)
    || (a.templateType < b.templateType ? -1 : a.templateType > b.templateType ? 1 : 0));

  // ── CASE P ≤ C · NO DEMOTION EVIDENCE. The record speaks no decline, so the curve is MONOTONE
  //    — A1.2's law in one line. **No fabricated famines**, whatever the event roster holds.
  if (A <= 0) {
    return {
      A: 0, C, P, tPeak: 0, anchors, shape: 'MONOTONE-GROWTH', undatedDecline: false,
      at: () => C,
      reason: 'no recorded age — the trajectory is the present, held; nothing is interpolated',
    };
  }
  if (P <= C) {
    const at = (t) => {
      const u = clamp01(t / A);
      return C * Math.pow(u, RISE_EXPONENT);
    };
    return {
      A, C, P, tPeak: A, anchors, shape: 'MONOTONE-GROWTH', undatedDecline: false, at,
      reason: `MONOTONE: the high water (${P}) does not exceed the present (${C}), so the record`
        + ` speaks no decline — ${anchors.length} dated loss anchor(s) present and NONE is given a`
        + ' population effect (A1.2: no invented history)',
    };
  }

  // ── CASE P > C · A RECORDED DEMOTION. Every down-step is dated to an anchor, or the fall is
  //    stamped UNDATABLE and reported (REG-T §3's own refusal, kept).
  if (!anchors.length) {
    // ⚠ THE UNDATABLE DECLINE, DECLARED (S1's M2(iii): *"the kernel must declare its rule and
    // stamp it"*). The record says a peak was held and does not say when it was lost. The
    // kernel refuses to date it: the whole fall lands in the FINAL band and is stamped
    // `interpolated` — never `recorded` — so nothing downstream can cite a year for it.
    const at = (t) => (t >= A ? C : P * clamp01(t / A));
    return {
      A, C, P, tPeak: A, anchors, shape: 'FADE', undatedDecline: true, at,
      reason: `UNDATED DECLINE: peak ${P} > present ${C} with ZERO dated loss anchors. The kernel`
        + ' refuses to date the fall — it lands in the final band, stamped `interpolated`, and no'
        + ' beat may cite a year for it (A6.3: no beat without a source event)',
    };
  }
  const lastAnchor = anchors[anchors.length - 1];
  // ⭐⭐ THE PEAK STANDS ON THE **EVE** OF THE FIRST BLOW, AND THAT IS `snapshotYears`' OWN
  //    CONVENTION, NOT A NEW ONE (*"every event year AND ITS EVE"*, snapshot.js:111-119). A
  //    disaster dated year Y means the place held its peak through year Y−1 and shows the
  //    aftermath at year Y — the same reading `settlementAtYear` takes when it keeps events with
  //    `at <= Y`. ⛔ Without the eve the peak is never a frame: the rise branch would own year Y
  //    and the fall would appear in the NEXT band with no anchor inside it, which is exactly what
  //    `assertTrajectoryLaw` clause (ii) convicted on the `highwater` fixture before this cure.
  const tPeak = Math.max(0, Math.min(A - 1, anchors[0].year - 1));
  const totalWeight = anchors.reduce((n, a) => n + a.weight, 0) || 1;
  const D = P - C;
  const at = (t) => {
    if (t <= 0) return 0;
    if (t <= tPeak) return P * Math.pow(clamp01(tPeak > 0 ? t / tPeak : 1), RISE_EXPONENT);
    let lost = 0;
    for (const a of anchors) if (a.year <= t) lost += (D * a.weight) / totalWeight;
    return Math.max(C, P - lost);
  };
  const deficit = P > 0 ? (P - C) / P : 0;
  const biggest = anchors.reduce((best, a) => (best && best.weight >= a.weight ? best : a), null);
  const shape = deficit > 0.25
    ? (biggest.military && (biggest.severity === 'major' || biggest.severity === 'catastrophic')
      ? 'SACKED-NEVER-RECOVERED' : 'BOOM-BUST')
    : 'FADE';
  return {
    A, C, P, tPeak, anchors, shape, undatedDecline: false, at,
    reason: `${shape}: peak ${P} at year ${tPeak}, present ${C}; the ${P - C}-soul fall is stepped`
      + ` at ${anchors.length} RECORDED anchor(s) (${anchors.map((a) => `${a.templateType}@${a.year}/${a.severity}`).join(', ')})`
      + `, shares proportional to severity weight; last anchor year ${lastAnchor.year}`,
  };
}

function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §5 · EXTENT ARITHMETIC — the ledger's one geometric read, and it is a SCALAR
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐ THE FRAME PROJECTION (and the whole cure, in six lines). A settlement record as it stood at
 * one epoch: its own souls, and a stored tier carrying the PEAK SO FAR — which is exactly
 * `deriveHighWater`'s channel 1 (*"a stored tier over a `derivedTier`-scale population — a
 * recorded demotion"*), so a frame after a fall keeps its high-water extent by the sealed law
 * rather than by a new one.
 *
 * ⛔⛔ `populationHistory` AND `calamityHistory` ARE **DROPPED**, AND THAT IS LOAD-BEARING. Both
 * are PRESENT-DAY records; a lived world carrying them would hand `deriveHighWater` today's peak
 * at every epoch, the extent would never shrink below it, and the zero-growth defect would walk
 * straight back in through the one door the projection exists to close. They are re-attached at
 * the final epoch by the identity below.
 *
 * ⭐ AND AT THE FINAL EPOCH IT RETURNS THE RECORD **BY IDENTITY** — the same short-circuit
 * `settlementAtYear` takes at `Y === age` (snapshot.js:77). So the map (the final frame) is sized
 * from the untouched record and the trajectory can never move the present-day drawing: the only
 * thing that moves it is the circuit law, which is the declared shift and is stated as such.
 */
export function frameAtEpoch(settlement, ledger, K) {
  const s = settlement || {};
  const idx = clampEpoch(ledger, K);
  if (idx >= ledger.epochs.length - 1) return s;
  const e = ledger.epochs[idx];
  const projected = { ...s, population: e.population, tier: tierForPopulation(e.peakSoFar) };
  delete projected.populationHistory;
  delete projected.calamityHistory;
  // The event horizon moves too — the frame is a document re-issued with fewer events on it AND
  // a smaller town, which is precisely what snapshot.js said it could not yet be.
  const h = s.history || {};
  const events = Array.isArray(h.historicalEvents) ? h.historicalEvents : [];
  const age = presentYear(s);
  const kept = [];
  for (const ev of events) {
    if (!ev || !Number.isFinite(ev.yearsAgo)) continue;
    const at = age - ev.yearsAgo;
    if (at > e.year) continue;
    kept.push({ ...ev, yearsAgo: e.year - at });
  }
  projected.history = h.founding
    ? { ...h, age: e.year, historicalEvents: kept, founding: { ...h.founding, age: e.year } }
    : { ...h, age: e.year, historicalEvents: kept };
  return projected;
}

/**
 * ⭐⭐ **WHICH EPOCH IS YEAR Y?** The last band whose year has arrived — the same reading
 * `settlementAtYear` takes when it keeps events with `at <= Y`, so a frame at year Y shows the town
 * as it stood at the close of the band containing Y and never a band it has not reached.
 * ⚠ ONE HOME. Every consumer that turns a YEAR into a FRAME asks here; two spellings of this
 * lookup would let the film and the folio disagree about which year a frame is.
 */
export function epochAtYear(ledger, year) {
  const eps = (ledger && ledger.epochs) || [];
  if (!eps.length) return 0;
  if (!Number.isFinite(year)) return eps.length - 1;
  let k = 0;
  for (let i = 0; i < eps.length; i++) if (eps[i].year <= year) k = i;
  return k;
}

/** The built radius a population implies, through the fabric's OWN sizer — never re-derived. */
function radiusAt(settlement, population, peak) {
  const probe = { ...settlement, population, tier: tierForPopulation(peak) };
  delete probe.populationHistory;
  delete probe.calamityHistory;
  return tierScale(probe).builtRadius;
}

/**
 * ⭐ THE INVERSE — the population whose built radius is `r`. Used for a ring's CAPACITY, and it is
 * a bisection over the fabric's own `tierScale` rather than an inversion of its arithmetic,
 * because `tierScale` has two derivations (1:1 below town, area-share above) and a closed form
 * would fork one of them.
 */
export function populationForRadius(settlement, r, hi) {
  let lo = 1, top = Math.max(2, Math.trunc(hi));
  if (radiusAt(settlement, top, top) <= r) return top;
  for (let i = 0; i < 48 && top - lo > 1; i++) {
    const m = Math.floor((lo + top) / 2);
    if (radiusAt(settlement, m, m) <= r) lo = m; else top = m;
  }
  return lo;
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §6 · THE BANDS — EVENT-DENSE, NOT UNIFORM (A1.4)
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐ *"Banding is EVENT-DENSE, not uniform: bands narrow at dated events and at steep trajectory
 * segments (the 30 %-in-6-years metropolis gets its frames), and a monotone band-splitting rule
 * caps per-band change."* (A1.4.)
 *
 * The seeds are FACTS — year 0, the present, every dated event year, every derived circuit raise
 * year — so no band edge is invented. The splitting is then monotone and terminating: each split
 * halves a span, and the loop stops at `BAND_CEILING` or when no band moves more than
 * `BAND_MAX_EXTENT_FRACTION` of the final extent.
 */
export function bandYears(settlement, traj, seedYears) {
  const A = traj.A;
  const edges = new Set([0, A]);
  for (const y of seedYears || []) {
    if (Number.isFinite(y) && y >= 0 && y <= A) edges.add(Math.trunc(y));
  }
  let years = [...edges].sort((a, b) => a - b);
  if (A <= 0) return years;
  const rFinal = Math.max(1e-6, radiusAt(settlement, traj.C, traj.P));
  const peakSoFar = (t) => {
    // the running maximum of a curve that rises to tPeak then steps down
    return t <= traj.tPeak ? traj.at(t) : traj.at(traj.tPeak);
  };
  const rAt = (t) => radiusAt(settlement, Math.max(1, Math.round(traj.at(t))), Math.max(1, Math.round(peakSoFar(t))));
  for (let guard = 0; guard < BAND_CEILING * 2 && years.length < BAND_CEILING; guard++) {
    let worst = -1, worstMove = 0;
    for (let i = 1; i < years.length; i++) {
      if (years[i] - years[i - 1] < 2) continue;         // a one-year band cannot be split
      const move = Math.abs(rAt(years[i]) - rAt(years[i - 1])) / rFinal;
      if (move > worstMove) { worstMove = move; worst = i; }
    }
    if (worst < 0 || worstMove <= BAND_MAX_EXTENT_FRACTION) break;
    const mid = Math.floor((years[worst - 1] + years[worst]) / 2);
    if (mid <= years[worst - 1] || mid >= years[worst]) break;
    years.push(mid);
    years.sort((a, b) => a - b);
  }
  return years;
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §7 · THE LEDGER
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ BUILD THE GROWTH LEDGER. Append-only, year-indexed, pure data.
 *
 * @param {any} settlement
 * @param {any} model    the landed model — read ONLY for `meta.hasWalls` (the one-decider rule)
 * @param {{ wallBuiltAtAge?:number|null }} [options]
 */
export function buildGrowthLedger(settlement, model, options = {}) {
  const s = settlement || {};
  const traj = deriveTrajectory(s);
  const scaleNow = tierScale(s);
  const hasWalls = !!(model && model.meta && model.meta.hasWalls);

  // ⭐⭐ THE FIRST CIRCUIT'S DATE IS THE RECORD'S, NOT THE KERNEL'S. `compile.deriveWallVintage`
  //    is the estate's one wall-dating authority and it stays it; the caller may stamp the
  //    present-day value (§11.11's cure) and the kernel then freezes THAT. Its provenance is
  //    `derived-frozen` — the third enum value exists for exactly this date (A1.2).
  const stamped = Number.isFinite(options.wallBuiltAtAge) ? Math.trunc(options.wallBuiltAtAge) : null;
  const vintage = stamped != null ? { ageAtBuild: stamped } : deriveWallVintage(s, scaleNow);
  const raiseYear = hasWalls && vintage && Number.isFinite(vintage.ageAtBuild)
    ? Math.max(0, Math.min(traj.A, vintage.ageAtBuild)) : null;

  const seeds = [];
  // ⭐ EVERY ANCHOR YEAR **AND ITS EVE** — `snapshotYears`' convention, so the peak before a blow
  //   and the aftermath after it are two frames rather than one averaged one.
  for (const a of traj.anchors) { seeds.push(a.year); if (a.year > 0) seeds.push(a.year - 1); }
  const events = Array.isArray(s.history && s.history.historicalEvents) ? s.history.historicalEvents : [];
  for (const ev of events) {
    if (ev && Number.isFinite(ev.yearsAgo)) seeds.push(traj.A - Math.trunc(ev.yearsAgo));
  }
  if (raiseYear != null) seeds.push(raiseYear);
  if (traj.tPeak > 0 && traj.tPeak < traj.A) seeds.push(traj.tPeak);
  const years = bandYears(s, traj, seeds);

  const eventYears = new Set(seeds.filter((y) => Number.isFinite(y) && y >= 0 && y <= traj.A));
  const rFinal = Math.max(1e-6, radiusAt(s, traj.C, traj.P));

  /** @type {Array<any>} */ const epochs = [];
  /** @type {Array<any>} */ const circuitEvents = [];
  /** @type {Array<any>} */ const emissions = [];
  /** @type {Array<any>} */ const quarterMints = [];
  /** @type {Array<any>} */ const lossRegions = [];
  /** @type {Record<string, any>} */ const annotations = {};
  let peakSoFar = 0;
  let walledTiersSeen = 0;
  let prevPop = 0;
  let prevRadius = 0;

  for (let k = 0; k < years.length; k++) {
    const year = years[k];
    const isFinal = k === years.length - 1;
    // ⭐ THE FINAL EPOCH IS THE PRESENT, EXACTLY. Not the curve's value at A — the RECORD's own
    //   population — so the map is the record's map and the trajectory can never move it.
    const population = isFinal ? traj.C : Math.max(1, Math.round(traj.at(year)));
    peakSoFar = Math.max(peakSoFar, population);
    const extentTier = tierForPopulation(peakSoFar);
    const radius = isFinal ? rFinal : radiusAt(s, population, peakSoFar);
    const provenance = eventYears.has(year) ? 'recorded' : 'interpolated';

    // ── 3b · THE CIRCUIT LAW. A wall is a DATED OBJECT: raised once, FROZEN thereafter.
    /** @type {Array<any>} */ const raised = [];
    if (hasWalls) {
      const firstDue = raiseYear != null && circuitEvents.length === 0 && year >= raiseYear;
      // ⭐ A LATER CIRCUIT IS EARNED, NOT PERMITTED, and it needs BOTH: a new walled tier passed
      //   (§240.2 — the ring count is derived from the thresholds a settlement crossed) AND the
      //   standing ring OUTGROWN. That second test is `epochAxis`'s own OUTGROWN_SHARE economics
      //   become the kernel's raise heuristic where no wall event is recorded (A1.5) — and here
      //   it reads a FROZEN radius against a LIVE one, which the sealed ladder could not do.
      const tierIdx = WALLED_TIERS.indexOf(extentTier);
      const laterDue = circuitEvents.length > 0
        && tierIdx >= circuitEvents.length
        && tierIdx > walledTiersSeen - 1
        && circuitEvents[circuitEvents.length - 1].frozenRadius / Math.max(1e-6, radius) <= OUTGROWN_SHARE_LOCAL;
      if (firstDue || laterDue) {
        const ev = Object.freeze({
          index: circuitEvents.length,
          epoch: k,
          year,
          thresholdTier: extentTier,
          /** ⛔⛔ FROZEN. THE EXTENT NEVER RE-DERIVES FROM THE UMBRELLA ONCE RAISED — C2 dies
           *  here, and this single field is the whole of it. */
          frozenRadius: radius,
          frozenPopulation: population,
          /**
           * ⛔⛔ **THIS WAS A DEAD TERNARY, AND THE CONDITION IT DISCARDED IS THE ONE THAT
           * MATTERS** (found SPINE-3, ODQ §692.9's *"one site, three wall-raise years"*).
           * It read `firstDue && raiseYear != null && eventYears.has(raiseYear) ? 'derived-frozen'
           * : 'derived-frozen'` — **both arms the same literal**, so the test *"does the record
           * actually name this year as an event?"* was computed on every circuit and thrown away.
           * The enum machinery works everywhere else in this file (epochs at `:545` use a live
           * `eventYears.has(year) ? 'recorded' : 'interpolated'`); the circuit alone was frozen at
           * one value by a condition that looked like a decision.
           *
           * ⛔ **TWO LIVE BRANCHES DOWNSTREAM ARE THEREFORE UNREACHABLE**, and both are real:
           *   `partitionConstruct.mintDerivedGates` runs on EVERY wrap — its *"recorded history
           *   always wins where it speaks"* branch has never executed;
           *   `wallPublication.wearOfCircuit`'s `kept = provenance === 'recorded' ? 1 : 0.72`
           *   discounts EVERY circuit's maintenance forever; the `1` branch has never executed.
           *
           * ⛔ **IT IS LEFT AS THE LITERAL, DELIBERATELY, AND THE DECISION GOES TO THE OWNER.**
           * Making the condition live would flip some circuits to `'recorded'`, which moves gate
           * minting (partition GEOMETRY) and every wear grade in the corpus — a DECLARED SHIFT
           * with the owner's signature on it, not a repair a lane takes. What is fixed here is the
           * lie: the code no longer pretends to test something it discards. **Recorded, not
           * silently corrected.**
           */
          provenance: 'derived-frozen',
          reason: firstDue
            ? `the recorded/derived vintage: the circuit was raised in year ${raiseYear} and its`
              + ` extent is frozen at the built radius of that year (${radius.toFixed(3)})`
            : `a later circuit EARNED: the ${extentTier} threshold was passed and the standing ring`
              + ` encloses ${(circuitEvents[circuitEvents.length - 1].frozenRadius / radius).toFixed(3)}`
              + ` of today's extent — below the ${OUTGROWN_SHARE_LOCAL} outgrown share`,
        });
        circuitEvents.push(ev);
        raised.push(ev);
        walledTiersSeen = Math.max(walledTiersSeen, WALLED_TIERS.indexOf(extentTier) + 1);
        annotations[`wall.E${ev.index}`] = annotate({
          appearanceEpoch: k,
          withinEpochOrder: 0,
          provenance: 'derived-frozen',
          beatEvents: [beatEvent('CIRCUIT_RAISED', year, `wall-built-year (${vintage && vintage.source ? vintage.source : 'stamped by the caller'})`, 'derived-frozen')],
        });
      }
    }

    // ── 3b · SATURATION AND TYPED EMISSION. Beyond saturation the growth LEAVES, and it leaves
    //    by a TYPED act stamped AT EMISSION (A1.5) — never as untyped sprawl.
    const standing = circuitEvents.length ? circuitEvents[circuitEvents.length - 1] : null;
    let capacity = null, saturationShare = null;
    /** @type {Array<any>} */ const epochEmissions = [];
    let intramural = Math.max(0, population - prevPop);
    if (standing) {
      capacity = Math.round(populationForRadius(s, standing.frozenRadius, Math.max(peakSoFar * 4, 1000))
        * (1 - SQUARE_CAPACITY_EXCLUSION));
      saturationShare = capacity > 0 ? population / capacity : 0;
      if (saturationShare > SATURATION && intramural > 0) {
        const out = Math.round(intramural * EXTRAMURAL_SHARE);
        intramural -= out;
        if (out > 0) {
          const origin = emissionOrigin(s, emissions.length);
          const act = Object.freeze({
            key: `emit.E${k}.${emissions.length}`,
            epoch: k, year, souls: out, kind: 'faubourg', origin,
            /** ⭐ STAMPED AT EMISSION BY THE KERNEL. `deriveFaubourgOrigins` becomes the VERIFIER
             *  (A1.5) — generator writes, reader checks, disagreement is a census RED. */
            stampedBy: 'growthLedger.buildGrowthLedger',
            provenance,
            reason: `the circuit encloses room for ${capacity} souls and the settlement holds`
              + ` ${population} (${(saturationShare * 100).toFixed(1)}% of capacity, past the`
              + ` ${(SATURATION * 100).toFixed(0)}% saturation): ${out} of this epoch's ${out + intramural}`
              + ` new souls settle EXTRAMURALLY, typed '${origin}'`,
          });
          emissions.push(act);
          epochEmissions.push(act);
          annotations[act.key] = annotate({
            appearanceEpoch: k,
            withinEpochOrder: epochEmissions.length - 1,
            provenance,
            beatEvents: [beatEvent('FAUBOURG_EMITTED', year, `saturation of circuit E${standing.index} raised in year ${standing.year}`, provenance)],
          });
        }
      }
    }

    // ── 3f · QUARTER MINTING. A named quarter is EARNED at a tier threshold, never pre-assigned:
    //    a 512-soul village has neighbourhoods at most (C7). `wardLabels` is the fabric's own
    //    test for "this tier HAS quarters to label" — read, never re-spelled.
    const prof = TIER_PROFILE[extentTier];
    if (prof && prof.wardLabels && !quarterMints.length) {
      const mint = Object.freeze({
        epoch: k, year, tier: extentTier, provenance,
        reason: `the place reached ${extentTier} scale in year ${year} — the tier at which the`
          + ' fabric\'s own `wardLabels` says there are quarters to name (C7: a village has'
          + ' neighbourhoods at most, and the label appears in the epoch it is earned)',
      });
      quarterMints.push(mint);
      annotations[`quarter.E${k}`] = annotate({
        appearanceEpoch: k,
        withinEpochOrder: 0,
        provenance,
        beatEvents: [beatEvent('QUARTER_MINT', year, `tier threshold '${extentTier}' crossed`, provenance)],
      });
    }

    // ── ⭐⭐⭐ A1.4 · **THE LossRegion CHANNEL, FILLED FROM THE RECORD** (ODQ §683). Car A reserved
    //    the shape and pinned it empty *"so car B never re-shapes the ledger"*; car B was dissolved
    //    into the spine (A2), so the filling is this lane's. **The birth condition is a RECORDED,
    //    DATED, SEVERITY-GRADED loss event and nothing else** — A1.4 verbatim: *"born at a RECORDED
    //    disaster (monotone seeds included: 192/200 seeds carry dated disasters with no trajectory
    //    fall — debris never keys to falling population)"*. So a rising ledger with a great fire on
    //    its record carries ruins, and a falling ledger with no dated event carries none.
    //    ⛔ ZERO RECORDED EVENTS ⇒ AN EMPTY CHANNEL, AND THAT IS CORRECT, NOT A GAP. The ledger may
    //    not invent a disaster to give the dress something to draw (A1.2's law, one layer down).
    const yearFrom = k === 0 ? 0 : years[k - 1];
    /** @type {Array<any>} */ const epochLosses = [];
    for (const a of traj.anchors) {
      if (!(k === 0 ? a.year <= year : (a.year > yearFrom && a.year <= year))) continue;
      // ⚠ THE COUNT IS THE **SEVERITY WEIGHT**, IN PIECES, and it is REG-T §3's own pre-registered
      //   weight re-used rather than a second scale invented beside it (minor 1 · major 2 ·
      //   catastrophic 3). A count proportional to the settlement's size would be a RATE this lane
      //   has not measured, and minting one here would be exactly the class A1.2 forbids.
      for (let n = 0; n < a.weight; n++) {
        const region = Object.freeze({
          key: `loss.E${k}.${lossRegions.length}`,
          bornEpoch: k,
          bornYear: a.year,
          sourceEvent: `${a.templateType}@${a.year} (${a.severity}${a.military ? ', military' : ''})`,
          severity: a.severity,
          /** ⭐ THE KIND IS THE RECORD'S OWN TEMPLATE — typed by the history, never by this file. */
          kind: a.templateType,
          state: 'INTACT',
          stageClock: 0,
          pressureClock: 0,
          /** ⚠ NULL BY DESIGN: the ledger holds NO GEOMETRY (its purity clause). The partition
           *  constructor binds each region to a face at the epoch it folds. */
          footprint: null,
          contactEpochs: Object.freeze([]),
          ops: 0,
          provenance: 'recorded',
        });
        lossRegions.push(region);
        epochLosses.push(region);
      }
      annotations[`loss.${a.templateType}@${a.year}`] = annotate({
        appearanceEpoch: k,
        withinEpochOrder: 0,
        provenance: 'recorded',
        beatEvents: [beatEvent('ABANDONMENT', a.year, `${a.templateType} (${a.severity})`, 'recorded')],
      });
    }

    epochs.push(Object.freeze({
      index: k,
      year,
      yearFrom,
      population,
      peakSoFar,
      extentTier,
      builtRadius: radius,
      /** ⭐ THE PLOT-SET DELTA — how many souls this epoch's fabric must hold that the last one
       *  did not. It is the ledger's own growth increment and the film's INFILL beat's subject. */
      plotSetDelta: Math.max(0, population - prevPop),
      intramuralDelta: Math.max(0, intramural),
      extramuralDelta: epochEmissions.reduce((n, e) => n + e.souls, 0),
      radiusDelta: radius - prevRadius,
      circuitEvents: Object.freeze(raised),
      emissions: Object.freeze(epochEmissions.slice()),
      quarterMints: Object.freeze(quarterMints.filter((q) => q.epoch === k)),
      /** ⭐ A1.4 · the RECORDED disasters this epoch carries, each one dated and severity-graded. */
      lossRegions: Object.freeze(epochLosses),
      provenance,
      saturation: saturationShare,
      capacity,
    }));
    prevPop = population;
    prevRadius = radius;
  }

  annotations['founding.E0'] = annotate({
    appearanceEpoch: 0,
    withinEpochOrder: 0,
    provenance: Number.isFinite(s.history && s.history.age) ? 'recorded' : 'interpolated',
    beatEvents: [beatEvent('FOUNDING', 0, 'history.founding.age', Number.isFinite(s.history && s.history.age) ? 'recorded' : 'interpolated')],
  });

  return Object.freeze({
    version: LEDGER_VERSION,
    seed: s._seed != null ? String(s._seed) : (s.id != null ? String(s.id) : 'town-map-seedless'),
    presentYear: traj.A,
    trajectory: Object.freeze({
      A: traj.A, C: traj.C, P: traj.P, tPeak: traj.tPeak, shape: traj.shape,
      undatedDecline: traj.undatedDecline, anchors: Object.freeze(traj.anchors),
      riseExponent: RISE_EXPONENT, reason: traj.reason,
    }),
    epochs: Object.freeze(epochs),
    circuitEvents: Object.freeze(circuitEvents),
    emissions: Object.freeze(emissions),
    quarterMints: Object.freeze(quarterMints),
    /** ⭐ A1.4 · every RECORDED, dated, severity-graded loss the record speaks. Empty where the
     *  record speaks none — which is correct, not a gap. */
    lossRegions: Object.freeze(lossRegions),
    lossRegionSchema: LOSS_REGION_SCHEMA,
    annotations: Object.freeze(annotations),
    tuning: Object.freeze({
      RISE_EXPONENT, BAND_MAX_EXTENT_FRACTION, BAND_CEILING, SATURATION,
      SQUARE_CAPACITY_EXCLUSION, EXTRAMURAL_SHARE, SEVERITY_WEIGHT,
      status: 'PROPOSED — chair signs; the owner re-signs at the tuning pass (§110.3 second shift)',
    }),
    reason: `${epochs.length} epoch(s) over a ${traj.A}-year life (event-dense bands, cap`
      + ` ${BAND_CEILING}); ${circuitEvents.length} dated circuit event(s); ${emissions.length}`
      + ` typed emission act(s); ${quarterMints.length} quarter mint(s). ${traj.reason}`,
  });
}

/** `epochAxis.OUTGROWN_SHARE`, spelled locally so this module owes S5 no import — the stage
 *  manifest refuses an S5→S0 edge (it would be a THIRD public-order inversion). The two values
 *  are pinned equal by a test rather than by an import. */
export const OUTGROWN_SHARE_LOCAL = 0.86;

/**
 * ⭐ THE EMISSION'S TYPE, STAMPED AT EMISSION. A1.5 rules the emission type SENIOR and demotes
 * `deriveFaubourgOrigins` to a consistency census. ⚠ THE ORDER IS THE ESTATE'S OWN: `faubourgOrigin`
 * resolves gate-first BY CONSTRUCTION, so a kernel that emitted a road ribbon before any gate
 * existed would break `gateRoster` resolution (the panel's M5). Gate first, then the crossing,
 * then the road.
 */
function emissionOrigin(settlement, n) {
  const access = String((settlement && settlement.config && settlement.config.tradeRouteAccess) || '').toLowerCase();
  if (n === 0) return 'gate';
  if (/crossroads|bridge|river|port/.test(access) && n === 1) return 'bridgehead';
  return 'road';
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §8 · TRUNCATION — prefix-closure by construction
 * ════════════════════════════════════════════════════════════════════════════════════════ */

function clampEpoch(ledger, K) {
  const n = ledger && ledger.epochs ? ledger.epochs.length : 0;
  if (!n) return 0;
  if (!Number.isFinite(K)) return n - 1;
  return Math.max(0, Math.min(n - 1, Math.trunc(K)));
}

/**
 * ⭐⭐⭐ TRUNCATE THE LEDGER AT EPOCH K. Because the ledger is APPEND-ONLY, the prefix is itself a
 * lawful ledger — every field is either a per-epoch row (sliced) or an append-only stream
 * (filtered by epoch). **That is prefix-closure by construction, and it is why an intermediate
 * frame is one lawful single-shot construction rather than a rewind.**
 */
export function truncateLedger(ledger, K) {
  const idx = clampEpoch(ledger, K);
  if (idx >= ledger.epochs.length - 1) return ledger;
  const epochs = ledger.epochs.slice(0, idx + 1);
  const circuitEvents = ledger.circuitEvents.filter((e) => e.epoch <= idx);
  const emissions = ledger.emissions.filter((e) => e.epoch <= idx);
  const quarterMints = ledger.quarterMints.filter((q) => q.epoch <= idx);
  /** @type {Record<string, any>} */ const annotations = {};
  for (const [k, an] of Object.entries(ledger.annotations)) {
    if (an.appearanceEpoch <= idx) annotations[k] = an;
  }
  return Object.freeze({
    ...ledger,
    truncatedAt: idx,
    epochs: Object.freeze(epochs),
    circuitEvents: Object.freeze(circuitEvents),
    emissions: Object.freeze(emissions),
    quarterMints: Object.freeze(quarterMints),
    annotations: Object.freeze(annotations),
    reason: `TRUNCATED at epoch ${idx} of ${ledger.epochs.length - 1} (year ${epochs[idx].year} of`
      + ` ${ledger.presentYear}): ${epochs.length} epoch(s), ${circuitEvents.length} circuit`
      + ` event(s), ${emissions.length} emission act(s). Prefix-closure holds by construction —`
      + ' the ledger is append-only.',
  });
}

/** The ledger's FINAL state — what `buildFabric` consumes as a declared input (A1.1). */
export function ledgerFinalState(ledger) {
  const e = ledger.epochs[ledger.epochs.length - 1];
  return Object.freeze({
    epoch: e.index,
    year: e.year,
    population: e.population,
    peakSoFar: e.peakSoFar,
    extentTier: e.extentTier,
    builtRadius: e.builtRadius,
    circuits: ledger.circuitEvents,
    emissions: ledger.emissions,
    saturation: e.saturation,
    capacity: e.capacity,
  });
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §9 · THE SEAM READERS (A1.5) — ONE OWNER PER SEAM
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ THE EPOCH-LADDER READER. `epochAxis.deriveEpochs` becomes a READER of ledger circuit
 * events (A1.5: *"one wall authority"*), and this is the shape it reads.
 *
 * ⚠⚠ THE ≤4 CEILING IS A **RENDER VOCABULARY**, NOT A LIMIT ON THE KERNEL. However many time
 * bands the ledger carries, they map onto at most `cap` DRAWN boundaries here — so
 * `EPOCH_CEILING`'s hard throw (epochAxis.js:296) can never fire from a ledger. Pinned by a test
 * that hands the reader a 40-band ledger.
 *
 * @returns {{extents:number[], boundaries:Array<{tier:string|null, extent:number}>, reason:string}}
 */
export function ledgerEpochBoundaries(ledger, frameBuiltRadius, cap) {
  const now = Math.max(1e-6, frameBuiltRadius);
  const lim = Math.max(1, Math.trunc(cap));
  // Every DATED circuit is a boundary, at its FROZEN radius as a share of the frame's extent.
  const walled = ledger.circuitEvents.map((e) => ({
    tier: e.thresholdTier,
    extent: Math.min(1, e.frozenRadius / now),
    walled: true,
    year: e.year,
  }));
  // Every tier the settlement PASSED is a fabric boundary, walled or not (G-42's law kept).
  /** @type {Array<{tier:string|null, extent:number, walled:boolean, year:number}>} */ const fabric = [];
  let seen = '';
  for (const e of ledger.epochs) {
    if (e.extentTier === seen) continue;
    seen = e.extentTier;
    fabric.push({ tier: e.extentTier, extent: Math.min(1, e.builtRadius / now), walled: false, year: e.year });
  }
  const all = fabric.concat(walled)
    .filter((b) => b.extent > 0)
    .sort((a, b) => (a.extent - b.extent) || (a.year - b.year));
  // Dedupe on extent — a walled boundary and the fabric boundary it was raised at are ONE line.
  /** @type {Array<any>} */ const merged = [];
  for (const b of all) {
    const last = merged[merged.length - 1];
    if (last && Math.abs(last.extent - b.extent) < 1e-9) { last.walled = last.walled || b.walled; continue; }
    merged.push({ ...b });
  }
  if (!merged.length || merged[merged.length - 1].extent < 1) {
    merged.push({ tier: null, extent: 1, walled: false, year: ledger.presentYear });
  }
  // ⭐ THE OUTERMOST BOUNDARIES SURVIVE — `deriveFabricEpochs`' own absorption rule, kept, so the
  //   ladder the reader returns is the ladder the sealed consumers already expect.
  const kept = merged.length <= lim ? merged : merged.slice(merged.length - lim);
  return {
    boundaries: kept.map((b) => ({ tier: b.tier, extent: b.extent })),
    extents: kept.filter((b) => b.walled).map((b) => b.extent),
    walledFlags: kept.map((b) => !!b.walled),
    reason: `LEDGER LADDER: ${kept.length} drawn boundary(ies) mapped from ${ledger.epochs.length}`
      + ` time band(s) (cap ${lim}); ${ledger.circuitEvents.length} DATED circuit(s), each at its`
      + ` FROZEN extent — ${ledger.circuitEvents.map((e) => `E${e.index} year ${e.year} r=${e.frozenRadius.toFixed(1)}`).join(', ') || 'none'}`,
  };
}

/**
 * ⭐⭐ THE §18.4 CONSUMER (A1.5: *"marketColonization becomes a ledger CONSUMER — ONE infill
 * clock"*). The middle rows harden when the ledger says the fabric inside the walls has run out
 * of room, not on a private share-of-life clock that a snapshot slides.
 *
 * ⛔ THE CLOCK IT REPLACES was `age × min(0.95, 0.42 + order·0.50)` with the present age stamped
 * by the caller — a second infill clock for a process §3b already charters as the kernel's own
 * arm. Two writers, two clocks (the panel's M4). Now: one clock, and it is saturation.
 *
 * @returns {{colonised:boolean, atYear:number|null, reason:string}}
 */
export function colonizationFromLedger(ledger, lawfulness) {
  const order = Number.isFinite(lawfulness) ? Math.max(0, Math.min(1, lawfulness)) : 0.5;
  // ⭐ ORDER STILL RESISTS, because §18.4's own finding is that a lawful town clears its market.
  //   It now resists a SATURATION, not a birthday: a well-run place tolerates a fuller town
  //   before it lets the stalls harden.
  const threshold = SATURATION + (1 - SATURATION) * order;
  for (const e of ledger.epochs) {
    if (e.saturation != null && e.saturation >= threshold) {
      return {
        colonised: true,
        atYear: e.year,
        reason: `§18.4 via the ledger: the fabric inside the circuit reached`
          + ` ${(e.saturation * 100).toFixed(1)}% of its capacity in year ${e.year}, past the`
          + ` ${(threshold * 100).toFixed(1)}% an order of ${order.toFixed(2)} holds out for —`
          + ' the middle rows harden. ONE infill clock, and it is the kernel\'s.',
      };
    }
  }
  return {
    colonised: false,
    atYear: null,
    reason: `§18.4 via the ledger: the market place is still open — the fabric never passed`
      + ` ${(threshold * 100).toFixed(1)}% of the circuit's capacity`
      + ` (peak ${(Math.max(0, ...ledger.epochs.map((e) => e.saturation || 0)) * 100).toFixed(1)}%)`,
  };
}

/**
 * ⭐ THE §161g PEAK COUNT, READ FROM THE CURVE (A1.5: *"compile.js reads the curve for
 * population-peaks"*). `countPeaks` runs over `populationHistory`, which is ABSENT on every
 * generated record — so the signal is structurally 0 at head (REG-T §11.5, measured). The ledger
 * carries a real series, so the count becomes real.
 */
export function peaksFromLedger(ledger) {
  const series = ledger.epochs.map((e) => e.population);
  if (series.length < 2) return series.length ? 1 : 0;
  let n = 0;
  for (let i = 0; i < series.length; i++) {
    const prev = i > 0 ? series[i - 1] : -Infinity;
    const next = i < series.length - 1 ? series[i + 1] : -Infinity;
    if (series[i] > prev && series[i] > next) n++;
  }
  return n;
}

/**
 * ⭐ THE FAUBOURG-ORIGIN VERIFIER (A1.5: *"generator writes, reader checks; disagreement is a
 * census RED"*). Takes the kernel's stamped acts and the reader's post-hoc derivation and
 * reports the disagreements. It does NOT re-type anything — the emission is senior.
 */
export function verifyFaubourgOrigins(ledger, derivedOrigins) {
  const stamped = ledger.emissions.filter((e) => e.kind === 'faubourg');
  const read = Array.isArray(derivedOrigins) ? derivedOrigins : [];
  const kernelKinds = countBy(stamped.map((e) => e.origin));
  const readerKinds = countBy(read.map((d) => String(d.origin || d.kind || 'unknown')));
  const kinds = [...new Set([...Object.keys(kernelKinds), ...Object.keys(readerKinds)])].sort();
  const rows = kinds.map((k) => ({ origin: k, kernel: kernelKinds[k] || 0, reader: readerKinds[k] || 0 }));
  const disagreements = rows.filter((r) => r.kernel !== r.reader);
  return {
    rows,
    disagreements,
    agree: disagreements.length === 0,
    reason: disagreements.length === 0
      ? `the kernel stamped ${stamped.length} typed emission(s) and the reader derives the same roster`
      : `⛔ ${disagreements.length} origin class(es) disagree: `
        + disagreements.map((r) => `${r.origin} kernel ${r.kernel} vs reader ${r.reader}`).join('; '),
  };
}

function countBy(arr) {
  /** @type {Record<string, number>} */ const out = {};
  for (const v of arr) out[v] = (out[v] || 0) + 1;
  return out;
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * §10 · THE LAW ASSERTIONS — each one a claim the panel required, checkable
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ THE TRAJECTORY LAW, ASSERTED RATHER THAN ASSUMED. Returns the violations; an empty array
 * is the claim. Every clause is one of A1.2's, and each names the panel finding it answers.
 */
export function assertTrajectoryLaw(ledger) {
  /** @type {string[]} */ const bad = [];
  const t = ledger.trajectory;
  // (i) THE PEAK BOUND — S1's M2(ii). No epoch may exceed deriveHighWater's P.
  for (const e of ledger.epochs) {
    if (e.population > t.P) {
      bad.push(`epoch ${e.index} (year ${e.year}) holds ${e.population} souls against a derived peak of ${t.P}`
        + ' — a peak the settlement NEVER HELD (A1.2: deriveHighWater is the SOLE peak deriver)');
    }
  }
  // (ii) EVENT ANCHORING — S1's M2(i). Every down-step lands on a recorded anchor year.
  const anchorYears = new Set(t.anchors.map((a) => a.year));
  for (let i = 1; i < ledger.epochs.length; i++) {
    const a = ledger.epochs[i - 1], b = ledger.epochs[i];
    if (b.population >= a.population) continue;
    const dated = [...anchorYears].some((y) => y > a.year && y <= b.year);
    if (!dated && !t.undatedDecline) {
      bad.push(`epoch ${b.index} steps down ${a.population}→${b.population} across years`
        + ` ${a.year}–${b.year} with NO recorded loss anchor in that span (A1.2: every down-step`
        + ' is anchored to a recorded, dated, severity-graded loss event)');
    }
  }
  // (iii) ZERO LOSS EVENTS ⇒ MONOTONE — A1.2's headline clause.
  if (!t.anchors.length) {
    for (let i = 1; i < ledger.epochs.length; i++) {
      if (ledger.epochs[i].population < ledger.epochs[i - 1].population) {
        bad.push(`epoch ${i} falls with ZERO dated loss anchors on the record — a fabricated famine`);
      }
    }
  }
  // (iv) THE PRESENT IS PINNED — the final frame is the record's own map.
  const last = ledger.epochs[ledger.epochs.length - 1];
  if (last.population !== t.C) {
    bad.push(`the final epoch holds ${last.population} against the record's ${t.C} — the curve must`
      + ' be pinned through the present (A1.2)');
  }
  return bad;
}

/**
 * ⭐⭐ THE CIRCUIT LAW, ASSERTED. C2's cure is one property: **a frozen extent never moves.**
 */
export function assertCircuitLaw(ledger) {
  /** @type {string[]} */ const bad = [];
  for (let i = 1; i < ledger.circuitEvents.length; i++) {
    const a = ledger.circuitEvents[i - 1], b = ledger.circuitEvents[i];
    if (b.year < a.year) bad.push(`circuit E${b.index} is dated before E${a.index}`);
    if (b.frozenRadius <= a.frozenRadius) {
      bad.push(`circuit E${b.index} (r=${b.frozenRadius.toFixed(3)}) does not exceed E${a.index}`
        + ` (r=${a.frozenRadius.toFixed(3)}) — a later circuit that does not enclose the earlier one`);
    }
  }
  for (const e of ledger.circuitEvents) {
    // ⛔⛔ **A1.3's S2-M4 · VINTAGE HONESTY, MADE STRUCTURAL** (GROW-A-RESUME). *"The wall event's
    // year comes from the ledger's recorded/derived-frozen value with provenance — the §11.11 stamp
    // defect (a vintage with no year) is structurally excluded by the schema requiring the year
    // field."* The defect this closes is measured in this receipt's §2.4: `wallStandingFor` built a
    // stamped vintage as `{ ageAtBuild, source }` with NO `year`, and `epochAxis.deriveEpochs` gates
    // on `dated = vintage.ageAtBuild && vintage.year` — so the stamp meant to CURE the
    // fraction-of-now hazard silently collapsed the epoch ladder to ONE circuit at today's extent,
    // and every snapshot leaf in the corpus was drawn against a ladder the present leaf did not use.
    // A ledger circuit event that reached a consumer without a year could do it again; it cannot
    // now, because the assertion is the schema.
    if (!Number.isFinite(e.year)) {
      bad.push(`circuit E${e.index} carries no year — the §11.11 stamped-vintage class (A1.3 S2-M4)`);
    }
    if (e.provenance !== 'recorded' && e.provenance !== 'derived-frozen') {
      bad.push(`circuit E${e.index} is stamped '${e.provenance}' — a circuit is recorded or derived-frozen, never interpolated`);
    }
    const at = ledger.epochs[e.epoch];
    if (!at) { bad.push(`circuit E${e.index} cites epoch ${e.epoch}, which the ledger does not carry`); continue; }
    if (Math.abs(at.builtRadius - e.frozenRadius) > 1e-9) {
      bad.push(`circuit E${e.index}'s frozen radius ${e.frozenRadius} disagrees with its own raise`
        + ` epoch's built radius ${at.builtRadius}`);
    }
  }
  // ⛔ SPRAWL IS STRUCTURALLY IMPOSSIBLE: every extramural soul carries a typed origin.
  for (const em of ledger.emissions) {
    if (!em.origin || !em.stampedBy) {
      bad.push(`emission ${em.key} left the walls untyped — sprawl is structurally impossible (§3b)`);
    }
  }
  return bad;
}

/**
 * ⭐⭐⭐ **EVERY LossRegion CITES A RECORDED, DATED EVENT — AND ZERO EVENTS MEANS ZERO REGIONS.**
 * (A1.4 / ODQ §683.) This replaces the reservation pin `assertLossRegionsReserved`, which asserted
 * the channel was EMPTY. That pin was right while car B was unbuilt and is wrong now: a pin that
 * says "there are none" cannot tell a correct absence from a broken filler, which is precisely the
 * shape of zero this estate keeps paying for. The law it is replaced with is the one A1.2 states
 * one layer up — **no invented history** — expressed on the debris channel:
 *   (i)   every region's `bornYear` is a year the record actually speaks;
 *   (ii)  every region's (`bornYear`, `kind`) pair matches a RECORDED anchor's (year, templateType).
 *         ⚠ THE FIRST SPELLING CHECKED THE KIND AGAINST `LOSS_TEMPLATES` AND CONVICTED FOUR REAL
 *         LEAVES: `isLossAnchor` admits an event by its CATEGORY as well as by its template, so a
 *         genuine `occupation_infiltration` disaster typed `infiltration_fear` is a lawful anchor
 *         whose template is simply not on the template list. Matching the region to its own anchor
 *         asks the question that actually matters — *does this ruin cite an event the record
 *         speaks?* — instead of re-litigating the roster in a second place;
 *   (iii) every region is stamped `recorded` — an `interpolated` ruin is a fabricated disaster;
 *   (iv)  ZERO dated loss anchors ⇒ ZERO regions;
 *   (v)   the epoch rows and the top-level roster hold the same regions (append-only agreement).
 */
export function assertLossRegionsRecorded(ledger) {
  /** @type {string[]} */ const bad = [];
  const top = ledger.lossRegions || [];
  const anchors = ledger.trajectory.anchors || [];
  const anchorYears = new Set(anchors.map((a) => a.year));
  const known = new Set(anchors.map((a) => `${a.year}|${a.templateType}`));
  if (!anchors.length && top.length) {
    bad.push(`the ledger carries ${top.length} LossRegion(s) with ZERO dated loss anchors on the`
      + ' record — a fabricated disaster (A1.4: born at a RECORDED disaster and at nothing else)');
  }
  for (const L of top) {
    if (!anchorYears.has(L.bornYear)) {
      bad.push(`LossRegion ${L.key} is dated to year ${L.bornYear}, which carries no recorded loss anchor`);
    }
    if (!known.has(`${L.bornYear}|${L.kind}`)) {
      bad.push(`LossRegion ${L.key} cites '${L.kind}' in year ${L.bornYear}, which matches no recorded loss anchor`);
    }
    if (L.provenance !== 'recorded') {
      bad.push(`LossRegion ${L.key} is stamped '${L.provenance}' — a ruin that cites no source event may not be drawn`);
    }
  }
  const inEpochs = ledger.epochs.reduce((a, e) => a + (e.lossRegions || []).length, 0);
  if (inEpochs !== top.length) {
    bad.push(`the epoch rows hold ${inEpochs} LossRegion(s) against the roster's ${top.length}`);
  }
  return bad;
}
