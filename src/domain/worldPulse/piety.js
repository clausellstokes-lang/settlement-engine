/**
 * domain/worldPulse/piety.js — the PIETY AMPLIFIER (Phase 4 W-F3).
 *
 * The owner's contract: `deityEffect = base × f(localPiety) × g(realmPiety)`. In a
 * very religious world, religion matters even MORE — and where faith is thin it
 * matters less. This module is the PURE, rng-free DERIVATION of those two
 * multipliers and the composite every amplified coupling site consumes; it never
 * rewrites the engine, it is a MULTIPLIER FIELD over it (§2.3), so with the spans
 * forced to 0 (the neutrality theorem) every multiplier is exactly 1.0 and the
 * engine is byte-identical.
 *
 * THREE derivations live here:
 *   1. local piety (`localPiety01` → `localMult`) — a pure per-settlement reading
 *      (religious authority + institution backing + patron devotion), distorted by
 *      the CLERGY lens (flawed priests weaken the channel — the owner's addendum),
 *      ALWAYS applied. f ∈ [0.65,1.65].
 *   2. realm piety (`realmPietyMult` → `realmMult`) — the tick-START mean of
 *      members' local piety, toggle-gated (exactly 1.0 when spread is off / no
 *      campaign). g ∈ [0.825,1.325]. Composite hard-clamped to [0.5,2.0].
 *   3. the CORRUPTION-PLANE amplifier (`corruptionPlaneMult`) — a superadditive
 *      surface over the deity's (evil01, chaos01): ~0 at lawful-good, clamped-max
 *      at chaotic-evil, ~1.0 at plane centre, scaled by piety bleed-through. It
 *      multiplies corruption PRESSURE channels only and is inert for a legacy
 *      3-axis deity (no authored lawAxis) ⇒ legacy fixtures byte-identical.
 *
 * IDENTITY SHORT-CIRCUIT (the dormancy anchor): a settlement with no projected
 * `faithProfile.piety` reads literal 1.0 at every site — deity-free worlds cannot
 * observe the feature. The `*Of(settlement)` readers below encode that: absent
 * record ⇒ 1.0. The read-model is projected at tick end (religionState.js) and
 * consumed at the NEXT tick's sites — the tick-START, anti-runaway measurement the
 * owner named (this tick's amplified effects cannot re-enter this tick's piety).
 *
 * PURE: no rng, no wall-clock, no mutation, codepoint-ordered aggregation. Imports
 * only the axis-projection + trait-plane leaves (deityAxes, clergyTraitPlane) and
 * corruption is reached transitively through clergyTraitPlane — no religion-engine
 * import, so religionState/religiousContest can import THIS without a cycle.
 */

import { evil01, chaos01 } from './deityAxes.js';

export const PIETY_TUNING = Object.freeze({
  // local01 term weights (sum 1) — §2.1
  W_AUTHORITY: 0.40,   // religious_authority causal variable, 0..1 (score/100)
  W_INSTITUTION: 0.35, // institutionBackingOf(settlement) — temples/monasteries/shrines
  W_DEVOTION: 0.25,    // patron dominance × standing weight
  STANDING_DEVOTION: Object.freeze({ ascendant: 1, established: 0.6, cult: 0.25 }),
  MULTIFAITH_BONUS: 0.15, // a живой multi-faith pantheon lifts devotion a little
  // multiplier maps: f = 1 + SPAN_LOCAL × (local01 − PIVOT_LOCAL)
  PIVOT_LOCAL: 0.35,   // "a modest town with a patron and one temple" ≈ neutral
  SPAN_LOCAL: 1.0,     // f ∈ [0.65, 1.65] over local01 ∈ [0,1]
  PIVOT_REALM: 0.35,
  SPAN_REALM: 0.5,     // g ∈ [0.825, 1.325] — global tilt gentler than local
  MULT_MIN: 0.5, MULT_MAX: 2.0,   // hard composite bound (owner's ~0.5–2.0)
  // ── DEVOTIONAL MOMENTUM + CONDUCT DRIFT (owner piety-dynamics addenda, 2026-07-10) ─
  // Piety is the SLOWEST-moving faith quantity. The measured local01 does not snap to
  // its structural target — it LAGS toward it (legitimacy's pattern), so becoming pious
  // or secular is an ARC, not a step: a burned church holds its flock for years, a new
  // temple stands empty a while. PIETY_LAG is HALF legitimacy's 0.12 (religionLegitimacy
  // LAG) — felt devotion trails even the rightful-claim axis (half-life ~11 ticks vs
  // legitimacy's ~5). First measurement seeds AT the target (no cold-start artifact).
  PIETY_LAG: 0.06,
  // Conduct drift: the town that no longer LIVES like its god feels less of it. The
  // structural target gains a signed conduct-fit term (W-F4a's endogenous conduct-plane
  // signal, REUSED — never recomputed), delivered through the same LAG so disillusion is
  // an arc. ASYMMETRIC (architect ruling): DRIFT (fit<0) erodes ~2× faster than agreement
  // (fit>0) builds — loss aversion, and the brake that keeps the term SUBCRITICAL against
  // devout lock-in. 0 for a neutral deity OR neutral conduct ⇒ byte-identical (the signal
  // itself is 0 there); 0 with no conduct-fit passed ⇒ pre-momentum record byte-identical.
  CONDUCT_PIETY_W: 0.15,   // max piety-target swing from ±full conduct alignment
  DRIFT_ASYMMETRY: 2,      // loss aversion: negative fit weighs 2× — pews empty before the throne falls
  // ── CLERGY bleed-through (the owner's clergy-lens addendum) ────────────────
  // Flawed / evil-leaning clergy DISTORT the amplifier: the god's influence
  // arrives through bad priests, so the local multiplier's deviation from 1.0 is
  // pulled back toward neutral. EXACTLY 1.0 (no distortion) for a trait-neutral,
  // unflawed priesthood — the neutrality theorem extends over the lens.
  CLERGY_TAINT_W: 0.5,   // corruptible-flaw presence in the clergy weakens the channel…
  CLERGY_EVIL_W: 0.35,   // …as does an evil-leaning priesthood…
  CLERGY_VARIANCE_W: 0.2,// …and a divided one reads noisily (conflict, not consensus)
  CLERGY_INTEGRITY_MIN: 0.4, // never fully severs the channel
  // ── CORRUPTION-PLANE surface (owner addendum, 2026-07-10) ──────────────────
  // Multiplier over corruption PRESSURE, superadditive over (evil01, chaos01):
  // corruption requires BOTH restraints absent (conscience = good, systems = law),
  // so raw = evil01·chaos01. Centre (0.5,0.5) ⇒ 0.25 ⇒ multiplier 1.0.
  PLANE_PIVOT: 0.25,     // evil01·chaos01 at the neutral plane centre
  PLANE_FLOOR: 0.05,     // lawful-good corner ⇒ ~0 new compromise (starves the rot)
  PLANE_CEIL: 1.65,      // chaotic-evil corner ⇒ dramatic, NOT degenerate
  PLANE_MIN: 0.05, PLANE_MAX: 1.65, // hard clamp (the owner's playable-thieves'-city bound)
  // ── OPPOSED-RUNNER-UP dampener (owner addenda f683c0b3 + a80d4bd9) ──────────
  // The seat's megaphone is MUTED by opposed runners-up, decomposed PER AXIS: a
  // moral-opposed rival mutes the moral channel, a law-opposed rival mutes the law
  // channel. D_axis = Σ over the next 1–2 ranked rivals of opposition(axis) ×
  // closeness(rival, seat). KIN on an axis (same alignment / same-or-neutral law)
  // ⇒ opposition 0 on that axis ⇒ D 0 ⇒ byte-identical (single-deity or per-axis-kin
  // pantheon). Floor-clamped so the seat ALWAYS steers something.
  DAMP_RIVALS: 2,        // how many ranked runners-up feed the dampener
  DAMP_MAX: 0.6,         // cap on each per-axis D ⇒ megaphone floor 0.4 (seat still steers)
  CLOSE_SHARE_W: 0.6,    // share-gap weight in closeness…
  CLOSE_LEGIT_W: 0.4,    // …vs legitimacy-gap weight
});

/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
/** @param {number} x @returns {number} */
const clamp01 = (x) => clamp(x, 0, 1);
/** @param {number} x @returns {number} */
const pos = (x) => (x > 0 ? x : 0);
/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** @typedef {import('./clergyTraitPlane.js').ClergyPlaneReading} ClergyPlaneReading */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {{ alignmentAxis?: string, lawAxis?: string, name?: string }} DeitySnapshot */
/** @typedef {{ share?: number, standing?: string, legitimacy?: number, suppressed?: boolean, snapshot?: DeitySnapshot }} DeityEntry */
/** @typedef {{ deities: Record<string, DeityEntry>, patronRef?: string|null, capacity?: number }} ReligionStateLike */
/** @typedef {{ source: string, value: number }} PietyCause */
/** @typedef {Object} OppositionDampener
 * @property {number} dLaw               0..DAMP_MAX law-axis dilution from opposed runners-up (0 = kin / single-deity)
 * @property {number} dMoral             0..DAMP_MAX moral-axis dilution from opposed runners-up
 * @property {number} megaphoneLaw       law-channel megaphone 1−dLaw (1 = undiluted)
 * @property {number} megaphoneMoral     moral-channel megaphone 1−dMoral
 * @property {number} megaphoneCombined  product megaphone for mixed sites
 * @property {Array<{ ref: string, oppLaw: number, oppMoral: number, closeness: number }>} rivals
 */
/** @typedef {Object} PietyRecord
 * @property {number} local01              0..1 LAGGED piety reading (devotional momentum)
 * @property {number} structuralTarget     0..1 structural + conduct-fit target local01 lags toward
 * @property {number} localMult            f(localPiety), clergy-distorted — 1.0-exact when neutral
 * @property {number} realmMult            g(realmPiety) — 1.0-exact when toggle-gated / no campaign
 * @property {number} composite            clamp(localMult × realmMult × megaphoneCombined) — mixed sites consume this
 * @property {number} moralMult            clamp(localMult × realmMult × megaphoneMoral) — the corruption (moral) channel
 * @property {number} clergyIntegrity      (0,1] channel integrity from the clergy lens (1 = undistorted)
 * @property {PietyCause[]} causes         receipts substrate — inputs in weight order
 * @property {ClergyPlaneReading} clergy   the named/typed clergy seam (W-F4 legitimacy/conversion reads it)
 * @property {OppositionDampener} dampener the per-axis opposed-runner-up seam (W-F4 conduct steering reads it)
 */

// ── term maps ────────────────────────────────────────────────────────────────

/** f: local01 → the local amplifier, PRE clergy distortion. @param {number} local01 @returns {number} */
export function localMultFromLocal01(local01) {
  const T = PIETY_TUNING;
  return 1 + T.SPAN_LOCAL * (clamp01(local01) - T.PIVOT_LOCAL);
}

/** g: realm01 → the realm amplifier. @param {number} realm01 @returns {number} */
export function realmMultFromRealm01(realm01) {
  const T = PIETY_TUNING;
  return 1 + T.SPAN_REALM * (clamp01(realm01) - T.PIVOT_REALM);
}

/**
 * 0..1 patron DEVOTION of a religion state: patron share × its standing weight,
 * plus a small живой-pantheon bonus for a multi-faith settlement. 0 when there is
 * no patron/state (a deity-free settlement never reaches here). Pure.
 * @param {ReligionStateLike|null|undefined} state a per-settlement religion state ({ deities, patronRef, capacity })
 * @returns {number}
 */
export function devotionOf(state) {
  const deities = state?.deities;
  if (!deities) return 0;
  const patron = state.patronRef ? deities[state.patronRef] : null;
  const T = PIETY_TUNING;
  const share = patron ? clamp01((Number(patron.share) || 0) / 100) : 0;
  const standingW = patron ? (/** @type {Record<string, number>} */ (T.STANDING_DEVOTION)[String(patron.standing)] ?? 0.25) : 0;
  const active = Object.keys(deities).filter((k) => !deities[k].suppressed).length;
  const capacity = Math.max(1, Number(state.capacity) || 1);
  const multiFaith = T.MULTIFAITH_BONUS * clamp01((active - 1) / capacity);
  return clamp01(share * standingW + multiFaith);
}

/**
 * 0..1 local piety from the three weighted inputs (all 0..1). Pure — the caller
 * supplies the already-derived inputs (authority from the causal score, institution
 * from institutionBackingOf, devotion from devotionOf) so this leaf takes no
 * religion-engine import.
 * @param {{ authority01?: number, institutionBacking?: number, devotion01?: number }} inputs
 * @returns {number}
 */
export function localPiety01({ authority01 = 0, institutionBacking = 0, devotion01 = 0 } = {}) {
  const T = PIETY_TUNING;
  return clamp01(T.W_AUTHORITY * clamp01(authority01) + T.W_INSTITUTION * clamp01(institutionBacking) + T.W_DEVOTION * clamp01(devotion01));
}

/**
 * (0,1] clergy-channel integrity from the clergy plane reading: flawed / evil-leaning
 * / divided clergy weaken the amplifier. EXACTLY 1.0 for a trait-neutral, unflawed,
 * consensual priesthood (weight 0 or all-zero reading) — the neutrality anchor. Pure.
 * @param {ClergyPlaneReading | null | undefined} clergy @returns {number}
 */
export function clergyIntegrity(clergy) {
  const T = PIETY_TUNING;
  if (!clergy || clergy.weight <= 0) return 1;
  const penalty = T.CLERGY_TAINT_W * clamp01(clergy.taint)
    + T.CLERGY_EVIL_W * pos(clergy.e)
    + T.CLERGY_VARIANCE_W * clamp01(clergy.variance);
  return clamp(1 - penalty, T.CLERGY_INTEGRITY_MIN, 1);
}

/** @param {{ alignmentAxis?: string }|null|undefined} a @param {{ alignmentAxis?: string }|null|undefined} b @returns {number} */
const oppMoralOf = (a, b) => Math.abs(evil01(a) - evil01(b));     // 0..1 moral opposition; kin ⇒ 0
/** @param {{ lawAxis?: string }|null|undefined} a @param {{ lawAxis?: string }|null|undefined} b @returns {number} */
const oppLawOf = (a, b) => Math.abs(chaos01(a) - chaos01(b));     // 0..1 law opposition; kin / law-neutral ⇒ 0

/**
 * The PER-AXIS opposed-runner-up dampener for a religion state (owner addenda). D_law
 * and D_moral each sum opposition(that axis) × closeness(rival, seat) over the next
 * 1–2 ranked rivals of the patron. A single-deity pantheon, or one whose runners-up
 * are KIN on an axis, yields exactly 0 on that axis ⇒ megaphone 1 ⇒ byte-identical.
 * Floor-clamped (DAMP_MAX) so the seat always steers something. Pure.
 * @param {ReligionStateLike|null|undefined} state a per-settlement religion state ({ deities, patronRef })
 * @returns {OppositionDampener}
 */
export function oppositionDampener(state) {
  const T = PIETY_TUNING;
  /** @type {OppositionDampener} */
  const none = { dLaw: 0, dMoral: 0, megaphoneLaw: 1, megaphoneMoral: 1, megaphoneCombined: 1, rivals: [] };
  const deities = state?.deities;
  const patronRef = state?.patronRef;
  const patron = deities && patronRef ? deities[patronRef] : null;
  if (!patron || !deities) return none;
  const patronShare = Number(patron.share) || 0;
  const patronLegit = Number(patron.legitimacy) || 0;
  const ranked = Object.keys(deities)
    .filter((k) => k !== patronRef && !deities[k].suppressed)
    .sort((a, b) => (Number(deities[b].share) || 0) - (Number(deities[a].share) || 0) || codepoint(a, b))
    .slice(0, T.DAMP_RIVALS);
  let dLaw = 0; let dMoral = 0;
  /** @type {Array<{ ref: string, oppLaw: number, oppMoral: number, closeness: number }>} */
  const rivals = [];
  for (const ref of ranked) {
    const r = deities[ref];
    const oppLaw = oppLawOf(patron.snapshot, r.snapshot);
    const oppMoral = oppMoralOf(patron.snapshot, r.snapshot);
    const shareClose = clamp01((Number(r.share) || 0) / Math.max(1, patronShare));
    const legitClose = clamp01((Number(r.legitimacy) || 0) / Math.max(0.05, patronLegit));
    const closeness = clamp01(T.CLOSE_SHARE_W * shareClose + T.CLOSE_LEGIT_W * legitClose);
    dLaw += oppLaw * closeness;
    dMoral += oppMoral * closeness;
    if (oppLaw > 0 || oppMoral > 0) rivals.push({ ref, oppLaw, oppMoral, closeness });
  }
  dLaw = clamp(dLaw, 0, T.DAMP_MAX);
  dMoral = clamp(dMoral, 0, T.DAMP_MAX);
  const megaphoneLaw = 1 - dLaw;
  const megaphoneMoral = 1 - dMoral;
  return { dLaw, dMoral, megaphoneLaw, megaphoneMoral, megaphoneCombined: megaphoneLaw * megaphoneMoral, rivals };
}

/**
 * Assemble the full per-settlement piety record from the derived inputs + the realm
 * multiplier (default 1.0) + the opposed-runner-up dampener (default none). The localMult
 * is the raw f(local01) DISTORTED by clergy integrity; `composite` folds in the COMBINED
 * megaphone (mixed sites), `moralMult` folds in the MORAL megaphone only (the corruption
 * channel — a fellow-evil rival does not mute the seat's corruption drive). Both hard-
 * clamped. Pure.
 * DEVOTIONAL MOMENTUM: `local01` is the LAGGED reading, not the raw structural sum. The
 * structural inputs (+ the signed `conductFit` term) form the TARGET; the record's local01
 * approaches it from `priorLocal01` at PIETY_LAG. `priorLocal01` absent (first measurement)
 * ⇒ seed AT target (no cold-start). `conductFit` 0 (default) + no prior ⇒ local01 = the raw
 * structural sum = the pre-momentum record, byte-identical.
 * @param {{ authority01?: number, institutionBacking?: number, devotion01?: number,
 *   clergy?: ClergyPlaneReading|null, realmMult?: number, dampener?: OppositionDampener|null,
 *   priorLocal01?: number|null, conductFit?: number }} args
 * @returns {PietyRecord}
 */
export function pietyRecord({ authority01 = 0, institutionBacking = 0, devotion01 = 0, clergy = null, realmMult = 1, dampener = null, priorLocal01 = null, conductFit = 0 } = {}) {
  const T = PIETY_TUNING;
  const structural = localPiety01({ authority01, institutionBacking, devotion01 });
  // Conduct drift feeds the TARGET (asymmetric: drift erodes 2× faster than agreement builds).
  const fit = clamp(Number(conductFit) || 0, -1, 1);
  const conductTerm = T.CONDUCT_PIETY_W * (fit >= 0 ? fit : T.DRIFT_ASYMMETRY * fit);
  const target = clamp01(structural + conductTerm);
  // Devotional momentum: lag the recorded reading toward the target; seed at target first tick.
  const local01 = Number.isFinite(priorLocal01)
    ? clamp01(/** @type {number} */ (priorLocal01) + T.PIETY_LAG * (target - /** @type {number} */ (priorLocal01)))
    : target;
  const rawLocalMult = localMultFromLocal01(local01);
  const integ = clergyIntegrity(clergy);
  const localMult = 1 + integ * (rawLocalMult - 1);   // clergy distortion (exact 1× when integ = 1)
  const rMult = Number.isFinite(realmMult) ? realmMult : 1;
  const damp = dampener || { dLaw: 0, dMoral: 0, megaphoneLaw: 1, megaphoneMoral: 1, megaphoneCombined: 1, rivals: [] };
  const composite = clamp(localMult * rMult * damp.megaphoneCombined, T.MULT_MIN, T.MULT_MAX);
  const moralMult = clamp(localMult * rMult * damp.megaphoneMoral, T.MULT_MIN, T.MULT_MAX);
  /** @type {PietyCause[]} */
  const causes = [
    { source: 'religious_authority', value: clamp01(authority01) },
    { source: 'institutions', value: clamp01(institutionBacking) },
    { source: 'devotion', value: clamp01(devotion01) },
  ];
  if (integ < 1) causes.push({ source: 'clergy_distortion', value: 1 - integ });
  if (damp.megaphoneCombined < 1) causes.push({ source: 'opposed_rivals', value: 1 - damp.megaphoneCombined });
  // Legibility law: name the conduct-fit driver. Erosion ('the town no longer lives like
  // its god') and its inverse are both surfaced; omitted entirely at fit 0 (byte-identical).
  if (conductTerm < 0) causes.push({ source: 'conduct_drift', value: -conductTerm });
  else if (conductTerm > 0) causes.push({ source: 'conduct_alignment', value: conductTerm });
  const clergyOut = clergy || { e: 0, c: 0, taint: 0, variance: 0, revealedTaint: 0, weight: 0 };
  return { local01, structuralTarget: target, localMult, realmMult: rMult, composite, moralMult, clergyIntegrity: integ, causes, clergy: clergyOut, dampener: damp };
}

// ── realm aggregate (tick-start, in the kernel) ───────────────────────────────

/**
 * The realm piety multiplier g: the mean of members' `local01` (a member with no
 * piety record contributes the neutral PIVOT_REALM — a mostly-secular realm dilutes
 * toward 1.0, it does not zero out), measured on the tick-START snapshot over
 * CODEPOINT-SORTED member ids. EXACTLY 1.0 when `spread` is false or there are no
 * members (toggle-gated / no campaign). Pure, deterministic.
 * @param {Array<{ id?: string|number, settlement?: SimSettlement }>} members  snapshot settlement items
 * @param {{ spread?: boolean }} [opts]
 * @returns {number}
 */
export function realmPietyMult(members, { spread = false } = {}) {
  if (!spread) return 1;
  const T = PIETY_TUNING;
  const rows = (Array.isArray(members) ? members : [])
    .map((it) => ({ id: String(it?.id ?? ''), local01: local01Of(it?.settlement) }))
    .sort((a, b) => codepoint(a.id, b.id));
  if (!rows.length) return 1;
  let acc = 0;
  for (const r of rows) acc += Number.isFinite(r.local01) ? r.local01 : T.PIVOT_REALM;
  return realmMultFromRealm01(acc / rows.length);
}

// ── site readers: the identity short-circuit (absent record ⇒ literal 1.0) ─────

/** The projected piety record on a settlement, or null. @param {SimSettlement|null|undefined} settlement @returns {PietyRecord|null} */
function pietyOf(settlement) {
  const p = settlement?.config?.faithProfile?.piety;
  return p && typeof p === 'object' ? /** @type {PietyRecord} */ (p) : null;
}

/** local01 of a settlement's projected record, or PIVOT_REALM when absent (realm mean). @param {SimSettlement|null|undefined} settlement @returns {number} */
function local01Of(settlement) {
  const p = pietyOf(settlement);
  return p && Number.isFinite(p.local01) ? clamp01(p.local01) : PIETY_TUNING.PIVOT_REALM;
}

/** Composite piety multiplier (localMult × realmMult) for a settlement — literal 1.0 when
 *  no record (deity-free / tick-0 / zero-span). Sites #1/#3/#4 read this. @param {SimSettlement} settlement @returns {number} */
export function pietyMultOf(settlement) {
  const p = pietyOf(settlement);
  return p && Number.isFinite(p.composite) ? p.composite : 1;
}

/** LOCAL amplifier (site #8 disposition — local zeal drives local posture). 1.0 when absent. @param {SimSettlement} settlement @returns {number} */
export function pietyLocalMultOf(settlement) {
  const p = pietyOf(settlement);
  return p && Number.isFinite(p.localMult) ? p.localMult : 1;
}

/** Piety bleed-through 0..1 = clamp01(composite − 1): how strongly a devout settlement
 *  lets deity-plane pressure through. 0 when absent / not devout (composite ≤ 1). @param {SimSettlement} settlement @returns {number} */
export function pietyBleedOf(settlement) {
  return clamp01(pietyMultOf(settlement) - 1);
}

/** MORAL-channel bleed-through 0..1 = clamp01(moralMult − 1): the corruption plane reads
 *  THIS (only a MORAL-opposed runner-up dilutes the seat's corruption drive; a fellow-evil
 *  rival does not). Falls back to the composite bleed when a record predates the per-axis
 *  seam. 0 when absent. @param {SimSettlement} settlement @returns {number} */
export function pietyMoralBleedOf(settlement) {
  const p = pietyOf(settlement);
  const moral = p && Number.isFinite(p.moralMult) ? p.moralMult : pietyMultOf(settlement);
  return clamp01(moral - 1);
}

/** The LAW-channel megaphone (1 = undiluted) for a settlement — law-derived sites (the
 *  government-form synergy, and W-F4's chaos-conduct steering) read this. 1 when absent /
 *  no opposed law rival. @param {SimSettlement} settlement @returns {number} */
export function pietyLawMegaphoneOf(settlement) {
  const p = pietyOf(settlement);
  return p && p.dampener && Number.isFinite(p.dampener.megaphoneLaw) ? p.dampener.megaphoneLaw : 1;
}

/** The `{ localMult, realmMult }` receipt tag for an amplified outcome, or null when there is
 *  no record (so deity-free outcomes carry no tag). @param {SimSettlement} settlement
 *  @returns {{ localMult: number, realmMult: number } | null} */
export function amplifierTag(settlement) {
  const p = pietyOf(settlement);
  if (!p) return null;
  return { localMult: p.localMult, realmMult: p.realmMult };
}

/** Piety causes for an amplified outcome, or []. @param {SimSettlement} settlement @returns {PietyCause[]} */
export function pietyCausesOf(settlement) {
  const p = pietyOf(settlement);
  return p && Array.isArray(p.causes) ? p.causes : [];
}

// ── corruption-plane amplifier (owner addendum) ───────────────────────────────

/** True iff the deity carries an AUTHORED law axis (a 4-axis deity). A legacy 3-axis
 *  deity (no lawAxis) has no plane position ⇒ the surface is inert ⇒ byte-identical.
 * @param {DeitySnapshot} deity @returns {boolean} */
function hasLawAxis(deity) {
  const a = deity?.lawAxis;
  return a === 'lawful' || a === 'chaotic' || a === 'neutral';
}

/**
 * The corruption-plane multiplier for a deity + piety bleed-through, over the
 * PRESSURE channels. Superadditive over (evil01, chaos01): raw = evil01·chaos01
 * (corruption requires BOTH restraints absent). ~0 at lawful-good, clamped-max at
 * chaotic-evil, 1.0 at plane centre; the god's plane position gives direction, the
 * `bleed` (0..1) gives strength. Returns literal 1.0 (byte-identical) when:
 *   • the deity is legacy 3-axis (no authored lawAxis), OR
 *   • bleed ≤ 0 (deity-free / non-devout / zero-piety / zero-span).
 * Never mints or erases stamped corruption — it only tilts the forward RATE, and is
 * hard-clamped so the chaotic-evil corner is dramatic, not degenerate. Pure.
 * @param {DeitySnapshot} deity @param {number} bleed 0..1 piety bleed-through @returns {number}
 */
export function corruptionPlaneMult(deity, bleed) {
  const T = PIETY_TUNING;
  const b = clamp01(bleed);
  if (b <= 0 || !hasLawAxis(deity)) return 1;
  const raw = evil01(deity) * chaos01(deity);   // 0..1, centre 0.25
  const surface = raw <= T.PLANE_PIVOT
    ? T.PLANE_FLOOR + (1 - T.PLANE_FLOOR) * (raw / T.PLANE_PIVOT)
    : 1 + (T.PLANE_CEIL - 1) * ((raw - T.PLANE_PIVOT) / (1 - T.PLANE_PIVOT));
  const mult = 1 + b * (surface - 1);
  return clamp(mult, T.PLANE_MIN, T.PLANE_MAX);
}

/** Corruption-plane multiplier read straight off a settlement's tick-START piety +
 *  patron deity snapshot — the corruption pressure channels' seam. 1.0 when no
 *  record / legacy deity. @param {SimSettlement} settlement @param {DeitySnapshot} [deity] patron snapshot
 *  (defaults to config.primaryDeitySnapshot) @returns {number} */
export function corruptionPlaneMultOf(settlement, deity) {
  const d = deity ?? settlement?.config?.primaryDeitySnapshot;
  // MORAL-channel bleed: the corruption plane is a moral-rot channel, so a fellow-evil
  // (moral-kin) runner-up leaves it undiluted; only a moral-opposed rival mutes it.
  return corruptionPlaneMult(d, pietyMoralBleedOf(settlement));
}
