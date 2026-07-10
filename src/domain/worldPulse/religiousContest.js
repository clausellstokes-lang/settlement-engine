/**
 * domain/worldPulse/religiousContest.js — the religion core (gradual pantheon
 * driver + conversion spread + religious_authority mint).
 *
 * The LIVE driver is `advanceReligionStates` (mounted by pulseKernel): each tick
 * every settlement's per-deity adherent SHARES evolve toward their strengths, a
 * conversion fires only when the PATRON seat actually changes, and a conversion
 * RE-EMBEDS the new patron snapshot onto C's `config.primaryDeitySnapshot` (never
 * customContent; the pulse never reads customContent), stamps a conversion
 * condition, and SEEDS the existing `religious_conversion_fracture` stressor on C
 * so the conversion SPREADS along religious_authority (the stressor already
 * declares `spreadChannels:['religious_authority']`). We do NOT invent a parallel
 * spread. (The original binary winner-take-all `evaluateReligiousContest` driver
 * was superseded by this gradual driver and has been REMOVED — it was mounted
 * nowhere and silently duplicated the mint/carrier/occupation logic below.)
 *
 * TWO-LANE GATE (Phase 4 W-F1) — byte-identical when dormant.
 *   LOCAL lane — per-settlement pantheon evolution (entry-as-cult, share drift,
 *   legitimacy, patron contest/schism, the divine-mandate substrate) runs whenever
 *   isSubsystemActive(snapshot,'religion') holds (≥1 settlement carries an embedded
 *   config.primaryDeitySnapshot OR a DM-imposed cult) — NO rule flag. This is the
 *   owner's standalone-faith contract: a deity-bearing settlement evolves its faith
 *   in place with no campaign toggle.
 *   SPREAD lane — cross-settlement propagation (religious_authority mints, carrier
 *   reach into OTHER settlements, regional prevalence, neighbour recognition,
 *   occupation faith-pull) is opt-in via isFaithSpreadEnabled(rules): the
 *   faithSpreadEnabled flag (default false), tolerant of the legacy
 *   religionDynamicsEnabled alias.
 * If the subsystem gate is false ⇒ pure no-op returning empties ⇒ byte-identical
 * legacy (a no-deity campaign is unchanged even with spread on — the activation
 * gate short-circuits before any fork or mint). Subsystem active but spread OFF ⇒
 * no mints, no reach, no cross-settlement outcomes: each settlement's pantheon
 * evolves as if it were the only faith-bearing settlement in the realm.
 *
 * DETERMINISM CONTRACT (sacred, identical to A1/A2):
 *   - No Date.now / Math.random / argless new Date. Gradual movement needs no RNG;
 *     the seeded patron contest forks the INJECTED pulse PRNG per settlement+tick.
 *   - Every output iteration is over a CODEPOINT-SORTED key list — bearers,
 *     settlements, reaching faiths, mint endpoints. Never insertion order.
 *   - All reads come from the SINGLE pre-tick snapshot. Mints are deterministic
 *     (id derives from type+from+to; `now` injected).
 *   - SAME-TICK multi-spread is a COMMUTATIVE field-merge (union of affected ids,
 *     MAX of severities) so apply order cannot change the result.
 */

import { mintDirectedChannel, stablePart } from '../region/graph.js';
import { clamp01 } from '../region/contestMath.js';
import { isSubsystemActive } from './subsystemActivation.js';
import { isFaithSpreadEnabled } from './simulationRules.js';
import { normalizeStressor } from './stressors.js';
import { PANTHEON_TUNING } from './pantheon.js';
import { militaryCapacityScalar } from './militaryStrength.js';
import { ensureReligionState, attemptEntry, advanceShares, selectPatron, resolvePatronContest, patronSnapshot, RELIGION_TUNING, faithMass, neighbourFaithInfluence } from './religionState.js';
import { rulerLens, deityLegitimacyTarget, stepDeityLegitimacy, deityGrowthFavor, chronicleMomentum, institutionBackingOf, governmentLawAffinity, RELIGION_LEGITIMACY_TUNING } from './religionLegitimacy.js';
import { deityTemper, chaos01 } from './deityAxes.js';
import { methodClash, STANCE_TUNING } from './deityStance.js';
import { effectiveStressorSeverity } from './stressorSeverity.js';
import { prosperityRank } from '../../data/constants.js';
// Phase 4 W-F3 — the piety amplifier (§2.3 sites #1/#4/#5) + the clergy lens. All
// reads go through the identity short-circuit (absent record ⇒ 1.0), so every
// deity-free / tick-0 / zero-span path stays byte-identical.
import { pietyMultOf, pietyRecord, devotionOf, amplifierTag, oppositionDampener } from './piety.js';
import { readClergyPlane } from './clergyTraitPlane.js';

// Regional-prevalence reinforcement: a deity grows stronger in C for each neighbour
// of C that already holds it as patron (geographic faith clustering), capped.
const PREVALENCE_PER_NEIGHBOUR = 0.06;
const PREVALENCE_MAX = 0.3;

const CHANNEL_TYPE = 'religious_authority';
// The relationship labels that carry a faith — a deity's influence travels with
// alliance, patronage, vassalage, and trade. (Occupation is carried by the
// war_front/military_protection channels enumerated below: "the occupier's faith
// arrives with its garrison" — the existing religiousConversionGate's 1.6× boost.)
const FAITH_CARRIER_RELATIONSHIPS = Object.freeze([
  'allied', 'ally', 'trade_partner', 'patron', 'vassal',
]);
// Channel types that already exist in the graph and along which a deity's
// influence can be projected directly (the occupation/garrison carrier).
const FAITH_CARRIER_CHANNELS = Object.freeze([
  'war_front', 'military_protection', 'political_authority',
]);
// A neighbour deity needs a minimally-real carrier strength to even contest.
const MIN_CARRIER = 0.15;
// Deity rank → base 0..1 strength (major god > minor god > cult). Sourced from the
// zero-import pantheon tuning leaf so the engine and the presentation layer read ONE
// constant; re-exported here for back-compat with the engine's public surface.
export const DEITY_RANK_STRENGTH = PANTHEON_TUNING.DEITY_RANK_STRENGTH;

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The embedded deity snapshot for a settlement id, or null (never customContent).
 * @param {any} snapshot
 * @param {any} id
 */
function deitySnapshotFor(snapshot, id) {
  const item = snapshot?.byId?.get?.(String(id));
  return item?.settlement?.config?.primaryDeitySnapshot || null;
}

// ── Occupation → conversion coupling ─────────────────────────────────────────
// A conquered settlement tends to adopt its occupier's faith — "the creed follows
// the garrison." The pull scales with the SIZE of the occupying force (the
// occupier's military capacity) tempered by how firmly the occupation is held (a
// garrison still fighting resistance converts less), and is amplified when the
// occupier's deity is WARBOUND (warlike temperament — a martial creed spreads at
// the point of a spear). It is COUNTERED by an incumbent faith of opposed nature:
// FULL force lands against a warlike or adjacent (neutral-temperament) creed, but a
// peaceful or alignment-opposed (good↔evil) faith digs in and resists. The lift is
// bounded — it pushes the occupier's claim toward, never past, certainty.
const OCC_CONVERSION_GAIN = 0.5;        // max claim-lift fraction at full control, peaceful occupier deity
const WARBOUND_CONVERSION_MULT = 1.35;  // warlike occupier deity lifts the pull "a little further"
const OCC_CARRIER_FLOOR = 0.5;          // an occupation is itself a strong faith carrier (the garrison path)
// Temperament / alignment axes mapped onto a line so opposition = distance.
const TEMPER_POS = /** @type {Record<string, number>} */ (Object.freeze({ warlike: 1, neutral: 0.5, peaceful: 0 }));
const ALIGN_POS = /** @type {Record<string, number>} */ (Object.freeze({ evil: 0, neutral: 0.5, good: 1 }));

// ── CRISIS CONVERSION — "chaos converts in the cracks" (owner, 2026-07-10) ─────
// Each pole converts best in the world that resembles it: law owns the long game
// (tenure/legitimacy), so the SHORT-run counterforce is a CHAOS-SIDE receptivity
// bonus where order is broken. It is ADDITIVE to a newcomer's receptivity (never
// its patron FIT — endogeneity intact), keyed on the deity's chaos coordinate so a
// lawful/neutral creed gets EXACTLY ZERO (asymmetric by design — no lawful mirror
// penalty), and it reads a bounded DISORDER scalar over the owner's five contexts:
// active stressors, war/occupation, the small-tier ladder (strongest at thorp,
// faded by the government's lawfulness), compromise depth, and inverse prosperity.
// DISORDER is 0 in a stable high-tier peaceful settlement ⇒ zero lift ⇒ byte-
// identical (and every deity-free / law-neutral / lawful-patron fixture is untouched).
const CRISIS_CONVERSION_TUNING = Object.freeze({
  W_STRESSOR: 0.35,     // 1. active stressor load/severity on the settlement
  W_WAR: 0.25,          // 2. war/occupation state (the warbound pull folds toward chaos)
  W_TIER: 0.20,         // 3. SMALL_TIERS ladder — strongest at thorp, faded by govt lawfulness
  W_COMPROMISE: 0.25,   // 4. compromise depth (covert+revealed rot is chaos-friendly soil)
  W_PROSPERITY: 0.20,   // 5. inverse prosperity — chaos recruits where law didn't pay
  // SMALL_TIERS chaos ladder (0 for town/city/metropolis — canonical TIER_ORDER).
  TIER_LADDER: /** @type {Record<string, number>} */ (Object.freeze({ thorp: 1, hamlet: 0.6, village: 0.3 })),
  TIER_LAW_FADE: 0.5,   // a fully-lawful government halves the small-tier bonus
  DISORDER_MAX: 1,      // hard cap on the combined disorder scalar
  RECEPTIVITY_MAX: 0.6, // max receptivity lift a fully-chaotic creed gets at max disorder
});

/** @param {number} x @returns {number} */
const pos = (x) => (x > 0 ? x : 0);
/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clampTo = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);

// Statuses at which a stressor no longer exerts live pressure.
const INERT_STRESSOR_STATUS = /** @type {Set<string>} */ (new Set(['resolved', 'dormant', 'residual']));

/**
 * The 0..1 DISORDER of settlement C — the owner's five crisis contexts combined and
 * capped. This is CHAOS-agnostic (it describes the settlement, not the creed); the
 * chaos-side gating happens in deityLocalStrength. Pure, deterministic, tick-start.
 * @param {{ settlement: { powerStructure?: { government?: string|null, governingName?: string|null }, economicState?: { prosperity?: string|null } } | null,
 *   tier: string, cid: string,
 *   occupations: Record<string, { occupierId?: string|number } | undefined> | null,
 *   lens: { compromise?: number } | null,
 *   worldState: { stressors?: import('../settlement.schema.js').SimStressor[] } | null }} args
 * @returns {number}
 */
function crisisDisorder01({ settlement, tier, cid, occupations, lens, worldState }) {
  const T = CRISIS_CONVERSION_TUNING;
  // 1. active stressor load — summed effective severity of live stressors on C.
  let stressorLoad = 0;
  for (const s of (Array.isArray(worldState?.stressors) ? worldState.stressors : [])) {
    if (INERT_STRESSOR_STATUS.has(String(s?.status))) continue;
    if (!(s?.affectedSettlementIds || []).map(String).includes(String(cid))) continue;
    stressorLoad += effectiveStressorSeverity(s, cid);
  }
  const stressor01 = clamp01(stressorLoad);
  // 2. war/occupation state (siege/war manifest as stressors above; occupation is
  //    the explicit garrison state, folding the warbound pull toward the chaos axis).
  const war01 = occupations?.[String(cid)]?.occupierId ? 1 : 0;
  // 3. small-tier ladder, faded by the government's lawfulness.
  const govLaw = clampTo(governmentLawAffinity(settlement?.powerStructure?.government ?? settlement?.powerStructure?.governingName), 0, 1);
  const tier01 = (T.TIER_LADDER[String(tier)] ?? 0) * (1 - T.TIER_LAW_FADE * govLaw);
  // 4. compromise depth (the rulerLens covert+revealed proxy).
  const comp01 = clamp01(Number(lens?.compromise) || 0);
  // 5. inverse prosperity (0 when unknown — a fresh/standalone settlement injects none).
  const rank = prosperityRank(settlement?.economicState?.prosperity);
  const prosperity01 = rank >= 0 ? 1 - rank / 6 : 0;
  return clampTo(
    T.W_STRESSOR * stressor01 + T.W_WAR * war01 + T.W_TIER * tier01 + T.W_COMPROMISE * comp01 + T.W_PROSPERITY * prosperity01,
    0, T.DISORDER_MAX,
  );
}

/**
 * The occupation faith-pull an occupier O exerts on the city C it holds.
 * { control, warbound } or null when O does not occupy C. `control` (0..1) scales
 * with O's military capacity (the occupying-force size) and how firmly the
 * occupation is established (1 − resistance); a present garrison always pulls some.
 * @param {any} snapshot @param {any} occupations @param {any} occupierId @param {any} convertId
 * @returns {{ control: number, warbound: boolean } | null}
 */
function occupationFaithPull(snapshot, occupations, occupierId, convertId) {
  const rec = occupations?.[String(convertId)];
  if (!rec || String(rec.occupierId) !== String(occupierId)) return null;
  const occItem = snapshot?.byId?.get?.(String(occupierId));
  const force = clamp01(militaryCapacityScalar(occItem || {}));            // size of occupying forces
  const established = clamp01(1 - (Number(rec.resistance) || 0));          // garrison in control vs still fighting
  const control = clamp01(force * (0.4 + 0.6 * established));
  const deity = deitySnapshotFor(snapshot, occupierId);
  const warbound = deityTemper(deity) === 'warlike';                       // through the W-F2 shim (stored verbatim)
  return { control, warbound };
}

/**
 * The counter-force (0..1) an INCUMBENT faith mounts against an occupier's creed —
 * 0 = no resistance (full conversion force), 1 = fully countered. Zero when the two
 * creeds are kindred (warlike occupier vs a warlike/adjacent incumbent — "full force
 * against a warlike or adjacent deity"); rises with temperament opposition (a
 * peaceful incumbent) and alignment opposition (good↔evil).
 * @param {any} occDeity @param {any} incDeity
 * @returns {number}
 */
function incumbentCounterForce(occDeity, incDeity) {
  if (!incDeity) return 0;                                                  // no entrenched faith → no resistance
  const tGap = Math.abs((TEMPER_POS[deityTemper(occDeity) ?? 'neutral'] ?? 0.5) - (TEMPER_POS[deityTemper(incDeity) ?? 'neutral'] ?? 0.5)); // 0..1 (temper via the W-F2 shim)
  const aGap = Math.abs((ALIGN_POS[occDeity?.alignmentAxis] ?? 0.5) - (ALIGN_POS[incDeity?.alignmentAxis] ?? 0.5));       // 0..1
  // Adjacent temperament (gap ≤ 0.5) mounts NO temperament resistance; an opposed
  // temperament (warlike↔peaceful, gap = 1) does. Opposed alignment resists too.
  const tempResist = Math.max(0, tGap - 0.5) * 2;                           // 0 at gap ≤ 0.5, 1 at gap = 1
  // W-F2 law-METHOD term: opposed law axes (lawful↔chaotic) add resistance; 0 for
  // any law-neutral/legacy creed ⇒ byte-identical on every existing fixture.
  const methodResist = STANCE_TUNING.LAW_METHOD_COUNTER * methodClash(occDeity, incDeity);
  return clamp01(0.6 * tempResist + 0.6 * aGap + methodResist);             // either opposition alone can substantially counter
}

/**
 * 0..1 base strength for a deity snapshot from its rank (major>minor>cult).
 * @param {any} deity
 * @returns {number}
 */
function deityRankStrength(deity) {
  if (!deity) return 0;
  return /** @type {Record<string, number>} */ (DEITY_RANK_STRENGTH)[deity.rankAxis] ?? DEITY_RANK_STRENGTH.minor;
}

/**
 * Codepoint-sorted ids of every settlement that has an embedded deity.
 * @param {any} snapshot
 * @returns {string[]}
 */
function deityBearers(snapshot) {
  return (snapshot?.settlements || [])
    .filter((/** @type {any} */ item) => Boolean(item?.settlement?.config?.primaryDeitySnapshot))
    .map((/** @type {any} */ item) => String(item.id))
    .sort(codepoint);
}

/**
 * The faith-carrier neighbours OUT of a deity-bearing settlement S: every other
 * settlement reachable from S along a faith-carrier relationship edge or a
 * faith-carrier channel. Returns a codepoint-sorted array of
 * `{ to, strength }` — the strongest carrier strength per neighbour.
 * @param {any} snapshot
 * @param {any} fromId
 * @returns {Array<{ to: string, strength: number }>}
 */
function faithCarriersOut(snapshot, fromId) {
  const id = String(fromId);
  const byTo = new Map();
  const note = (/** @type {any} */ to, /** @type {number} */ strength) => {
    const t = String(to);
    if (!t || t === id) return;
    const prev = byTo.get(t) ?? 0;
    if (strength > prev) byTo.set(t, strength);
  };

  // Faith-carrier RELATIONSHIP edges (allied/trade/patron/vassal). An edge is
  // one-per-pair; faith travels along it in BOTH directions, so we read it from
  // either orientation.
  for (const edge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const type = String(edge?.relationshipType || edge?.type || '');
    if (!FAITH_CARRIER_RELATIONSHIPS.includes(type)) continue;
    const a = String(edge?.from ?? '');
    const b = String(edge?.to ?? '');
    if (a === id) note(b, 0.45);
    else if (b === id) note(a, 0.45);
  }

  // Faith-carrier CHANNELS directed OUT of S (war_front/military_protection/
  // political_authority — the occupier/garrison carrier). Confirmed only.
  for (const channel of snapshot?.regionalGraph?.channels || snapshot?.channels || []) {
    if (String(channel?.from) !== id) continue;
    if (!FAITH_CARRIER_CHANNELS.includes(String(channel?.type))) continue;
    if (String(channel?.status || 'confirmed') !== 'confirmed') continue;
    note(channel.to, clamp01(channel.strength ?? channel.severity ?? 0.5));
  }

  return [...byTo.entries()]
    .map(([to, strength]) => ({ to, strength }))
    .sort((x, y) => codepoint(x.to, y.to));
}

/**
 * A probability-1 CONVERSION outcome. It is a STRESSOR outcome that SEEDS the
 * EXISTING `religious_conversion_fracture` stressor on the convert C (so the
 * conversion SPREADS along religious_authority via the stressor's own
 * spreadChannels — we drive that stressor, never a parallel one). The stable id
 * (`world_stressor.religious_conversion_fracture.<C>`) means the crisis is born
 * ONCE per convert and a re-fire merges (the apply-side commutative merge). The
 * outcome ALSO carries `deityReembed` so the apply pass re-embeds the winning
 * neighbour's snapshot onto C's config.primaryDeitySnapshot.
 * @param {{ id: any, targetSaveId: any, severity: any, headline: any, summary: any, reasons: any, tick: any, sourceEventTargetId: any, deityReembed: any, cause?: string, amplifiers?: {localMult:number,realmMult:number}|null }} args
 */
function conversionOutcome({ id, targetSaveId, severity, headline, summary, reasons, tick, sourceEventTargetId, deityReembed, cause = 'contest', amplifiers = null }) {
  const stressor = normalizeStressor({
    type: 'religious_conversion_fracture',
    originSettlementId: targetSaveId,
    severity,
    affectedSettlementIds: [targetSaveId],
  });
  return {
    id,
    type: 'stressor',
    candidateType: 'stressor_birth_religious_conversion_fracture',
    ruleId: 'religious_contest_conversion',
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId,
    severity,
    headline,
    summary,
    reasons,
    stressor,
    metadata: {
      lifecycleStage: stressor.lifecycleStage,
      durationPolicy: stressor.durationPolicy,
      spreadChannels: stressor.spreadChannels,
      conversionCause: cause,
      // W-F3: name both piety multipliers on the receipt (owner: "name both
      // multipliers with causes"). Omitted entirely when no piety was measured, so a
      // legacy/deity-free conversion outcome is byte-identical.
      ...(amplifiers ? { amplifiers } : {}),
    },
    // The embed bridge: the apply pass re-embeds this winning-neighbour snapshot
    // onto the convert's config.primaryDeitySnapshot (copied from the neighbour's
    // EXISTING embedded snapshot, never customContent).
    deityReembed,
    // A conversion condition for the dossier/news surfaces.
    condition: {
      archetype: 'religious_conversion_fracture',
      severity,
      triggeredAt: { tick, sourceEventType: 'RELIGIOUS_CONVERSION', sourceEventTargetId },
      causes: [{ source: sourceEventTargetId, effect: 'religious_conversion_fracture', reason: `${sourceEventTargetId} converted ${targetSaveId}.` }],
    },
    conflictTags: [`stressor:religious_conversion_fracture:${targetSaveId}`, `settlement:${targetSaveId}:stressor_birth`],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GRADUAL PANTHEON DRIVER (religion rework — see docs/RELIGION_REWORK.md). Replaces
// the binary winner-take-all flip: each tick every settlement's per-deity adherent
// SHARES evolve toward their strengths (global rank + carrier reach + regional
// prevalence + receptivity), faiths ENTER as cults and climb, the patron is held with
// an erodable incumbency buffer, and a conversion outcome (re-embed) fires only when
// the CHIEF actually changes. Returns the evolved per-settlement religionStates for
// the kernel to persist as a CONDITIONAL worldState ledger (absent ⇒ byte-identical
// dormant), plus patron-change outcomes and the religious_authority mints.
// Deterministic — gradual movement needs no RNG.
// ─────────────────────────────────────────────────────────────────────────────

/** Neighbour ids of C across relationship edges + graph channels (codepoint-sorted). @param {any} snapshot @param {string} id */
function neighbourIdsOf(snapshot, id) {
  const set = new Set();
  for (const e of snapshot?.regionalGraph?.edges || []) {
    if (String(e?.from) === id) set.add(String(e.to));
    else if (String(e?.to) === id) set.add(String(e.from));
  }
  for (const c of snapshot?.regionalGraph?.channels || []) {
    if (String(c?.from) === id) set.add(String(c.to));
    else if (String(c?.to) === id) set.add(String(c.from));
  }
  set.delete(id);
  return [...set].sort(codepoint);
}

/**
 * Capped prevalence bonus: neighbours whose embedded patron faith IS this deity, each
 * weighted by THEIR deity rank AND by the SIZE ASYMMETRY between that neighbour and this
 * settlement — a neighbouring metropolis's creed presses hard on a village, while a
 * hamlet's barely registers on a city (via neighbourFaithInfluence on faith mass).
 * @param {any} snapshot @param {string[]} neighbourIds @param {string} deityRef @param {number} [targetMass]
 */
function prevalenceBonus(snapshot, neighbourIds, deityRef, targetMass) {
  let acc = 0;
  for (const nid of neighbourIds) {
    const snap = deitySnapshotFor(snapshot, nid);
    if (!snap || String(snap._deityRef || snap.name) !== String(deityRef)) continue;
    const nItem = snapshot?.byId?.get?.(String(nid))?.settlement;
    const influence = neighbourFaithInfluence(faithMass(nItem), targetMass);   // bigger neighbour ⇒ stronger pull
    acc += PREVALENCE_PER_NEIGHBOUR * (0.5 + 0.5 * deityRankStrength(snap)) * influence;
  }
  return Math.min(PREVALENCE_MAX, acc);
}

/**
 * A deity's 0..1 local GROWTH strength in settlement C — how fast it converts: global
 * rank + carrier reach + regional prevalence (count × avg neighbour rank), modulated by
 * receptivity (fit with C's current mood), by growth favour (the ruling power's leaning
 * + corruption climate), AND by the CHRONICLE — recent settlement events that match the
 * faith's character spike its conversion (action-alignment, temporal + fading).
 * Occupation force-pull is layered on by the caller.
 * @param {{ snapshot: any, deity: any, deityRef: string, neighbourIds: string[], carrier: number, moodDeity: any, lens?: any, worldState?: any, cid?: string, targetMass?: number, crisisDisorder?: number }} args
 */
function deityLocalStrength({ snapshot, deity, deityRef, neighbourIds, carrier, moodDeity, lens, worldState, cid, targetMass, crisisDisorder = 0 }) {
  const base = clamp01(0.45 * deityRankStrength(deity) + 0.3 * clamp01(carrier) + prevalenceBonus(snapshot, neighbourIds, deityRef, targetMass));
  // Receptivity: the settlement's mood resists alien creeds — but a COMPROMISED populace
  // resists LESS (frayed moral fabric), so deeper corruption opens the door wider.
  const counter = moodDeity ? incumbentCounterForce(deity, moodDeity) * (1 - RELIGION_LEGITIMACY_TUNING.COMPROMISE_MOOD_EROSION * clamp01(Number(lens?.compromise) || 0)) : 0;
  // Crisis conversion (chaos converts in the cracks): a CHAOS-SIDE creed reads extra
  // receptivity where order is broken, ADDITIVE to fit and proportional to the deity's
  // chaos coordinate × the settlement's disorder. EXACTLY 0 for a lawful/neutral creed
  // (no mirror penalty) or a stable-peace settlement (crisisDisorder 0) ⇒ byte-identical.
  const chaosSide = pos(2 * chaos01(deity) - 1);   // 0 lawful/neutral … 1 chaotic
  const crisisLift = chaosSide * clamp01(crisisDisorder) * CRISIS_CONVERSION_TUNING.RECEPTIVITY_MAX;
  const fit = 1 - counter + crisisLift;
  // Growth favour: who holds power + the corruption climate speed or slow conversion.
  const growth = lens ? deityGrowthFavor(deity, lens) : 0.5;
  // Chronicle: recent events whose character matches this faith spike its growth (and
  // clashing events slow it) — a temporal, fading action-alignment pull. ~0 when the
  // settlement's recent history is quiet or absent (e.g. a fresh standalone settlement).
  const chronicle = (worldState && cid && lens) ? chronicleMomentum(worldState, cid, deity, lens) : 0;
  const chronMult = 1 + RELIGION_LEGITIMACY_TUNING.CHRONICLE_GROWTH_AMP * chronicle;
  return clamp01(base * (0.7 + 0.3 * fit) * (0.7 + 0.6 * growth) * chronMult);
}

/**
 * @param {Object} args
 * @param {any} args.snapshot @param {any} [args.worldState]
 * @param {number} [args.tick] @param {string|null} [args.now] @param {any} args.rules
 * @param {any} [args.rng]  the pulse PRNG (DI'd, not imported — keeps the domain off
 *   the generators layer). The patron contest forks it per settlement; forking is
 *   consumption-independent, so it never perturbs the rest of the pulse's RNG stream.
 * @param {number} [args.realmMult]  W-F3: the realm-piety multiplier g, computed at tick
 *   START by the kernel (1.0 when spread is off / no campaign). Amplifies the spread-lane
 *   mints (site #5) and composes into each settlement's composite; 1.0 ⇒ byte-identical.
 * @returns {{ religionStates: Record<string, any>|null, outcomes: any[], graphChannels: any[], pietyByCid: Record<string, import('./piety.js').PietyRecord> }}
 */
export function advanceReligionStates({ snapshot, worldState = null, tick = 0, now = null, rules = {}, rng = null, realmMult = 1 }) {
  // LOCAL lane gate: deity presence alone (no rule flag). Deity-free ⇒ byte-identical
  // (short-circuit before any fork/mint/state).
  if (!isSubsystemActive(snapshot, 'religion')) return { religionStates: null, outcomes: [], graphChannels: [], pietyByCid: {} };
  // SPREAD lane gate: cross-settlement propagation is opt-in (faithSpreadEnabled,
  // tolerant of the legacy religionDynamicsEnabled). When off, steps 1-2 (mints +
  // carrier reach) and every cross-settlement read (prevalence + neighbour
  // recognition via neighbourIds, occupation faith-pull) are skipped; step 3 evolves
  // each settlement's pantheon in isolation.
  const spread = isFaithSpreadEnabled(rules);

  /** @param {any} id */
  const nameFor = (id) => { const it = snapshot?.byId?.get?.(String(id)); return it?.name || it?.settlement?.name || String(id); };
  const occupations = worldState?.occupations && typeof worldState.occupations === 'object' ? worldState.occupations : null;
  const prior = worldState?.religionStates && typeof worldState.religionStates === 'object' ? worldState.religionStates : {};
  const outcomes = [];
  const graphChannels = [];
  /** @type {Record<string, any>} */
  const religionStates = {};
  // W-F3: the per-settlement piety read-model (derived, NOT persisted into
  // religionStates) — the kernel projects it onto faithProfile.piety, and next tick's
  // amplified sites read it (tick-START measurement). Empty ⇒ no faithProfile.piety.
  /** @type {Record<string, import('./piety.js').PietyRecord>} */
  const pietyByCid = {};
  const bearers = deityBearers(snapshot);
  // convertId → Map(deityRef → { deity, carrier, occupied }). SPREAD-lane only; it
  // stays EMPTY when spread is off, so every reach lookup in step 3 yields undefined
  // and each settlement evolves in isolation (no carrier entries, no cross-settlement
  // faith crossing a boundary).
  const reach = new Map();

  if (spread) {
    // 1. Mint religious_authority channels along faith carriers (deity-gated, directed).
    for (const fromId of bearers) {
      const deity = deitySnapshotFor(snapshot, fromId);
      const rankStrength = deityRankStrength(deity);
      for (const { to, strength } of faithCarriersOut(snapshot, fromId)) {
        if (strength < MIN_CARRIER) continue;
        // W-F3 site #5: the realm-piety multiplier amplifies the mint strength (a very
        // religious realm projects authority harder). Spread-lane-only by construction;
        // realmMult is 1.0 (byte-identical) whenever spread is off / no campaign.
        const mintStrength = clamp01((0.35 + strength * 0.4 + rankStrength * 0.25) * realmMult);
        graphChannels.push(mintDirectedChannel({
          type: CHANNEL_TYPE, from: fromId, to, strength: mintStrength, confidence: 0.75,
          explanation: `${deity?.name || nameFor(fromId)} projects religious authority from ${nameFor(fromId)} to ${nameFor(to)}.`,
          relationshipKey: `${CHANNEL_TYPE}.${stablePart(fromId)}.${stablePart(to)}`,
          source: 'religious_authority_mint', now,
        }));
      }
    }

    // 2. Carrier reach.
    /** @param {any} to @param {any} deity @param {number} carrier @param {boolean} [occupied] */
    const note = (to, deity, carrier, occupied = false) => {
      const t = String(to); const dref = String(deity?._deityRef || deity?.name || '');
      if (!t || !dref) return;
      if (!reach.has(t)) reach.set(t, new Map());
      const m = reach.get(t); const prev = m.get(dref);
      m.set(dref, { deity, carrier: Math.max(prev?.carrier ?? 0, carrier), occupied: occupied || Boolean(prev?.occupied) });
    };
    for (const fromId of bearers) {
      const deity = deitySnapshotFor(snapshot, fromId);
      if (!deity) continue;
      // A faith's REACH (its primary entry/spread channel) scales with the SOURCE's size
      // relative to the TARGET: a metropolis's creed spreads strongly to a small neighbour,
      // a hamlet's barely reaches a city. The link must still clear MIN_CARRIER on its RAW
      // strength to exist at all (the gate) — only the effective pull is size-weighted.
      const sourceMass = faithMass(snapshot?.byId?.get?.(String(fromId))?.settlement);
      for (const { to, strength } of faithCarriersOut(snapshot, fromId)) {
        if (strength < MIN_CARRIER) continue;
        const targetMass = faithMass(snapshot?.byId?.get?.(String(to))?.settlement);
        note(to, deity, clamp01(strength * neighbourFaithInfluence(sourceMass, targetMass)));
      }
    }
    if (occupations) {
      for (const cid of Object.keys(occupations).sort(codepoint)) {
        const occId = occupations[cid]?.occupierId ? String(occupations[cid].occupierId) : null;
        if (!occId || occId === cid) continue;
        const deity = deitySnapshotFor(snapshot, occId);
        if (deity) note(cid, deity, OCC_CARRIER_FLOOR, true);
      }
    }
  }

  // 3. Evolve each settlement's pantheon (codepoint-sorted ⇒ deterministic).
  const ids = (snapshot?.settlements || []).map((/** @type {any} */ it) => String(it.id)).sort(codepoint);
  for (const cid of ids) {
    const settlement = snapshot?.byId?.get?.(cid)?.settlement;
    if (!settlement) continue;
    const reaching = reach.get(cid);
    const hasState = Boolean(prior[cid]?.deities && Object.keys(prior[cid].deities).length);
    // A settlement carries faith if it has an embedded patron OR any DM-imposed cult.
    const hasDeity = Boolean(deitySnapshotFor(snapshot, cid)) || ((settlement.config?.cultDeitySnapshots || []).length > 0);
    if (!hasDeity && !hasState && !reaching) continue;     // dormancy: untouched ⇒ no state

    const tier = settlement.tier || settlement.config?.tier || 'village';
    const state = ensureReligionState(prior[cid], settlement, tier);
    const prevPatron = state.patronRef;
    // SPREAD-lane cross-settlement reads: neighbourIds feeds regional prevalence
    // (deityLocalStrength) and neighbour recognition (deityLegitimacyTarget). With
    // spread OFF the settlement recognizes no neighbours' faiths ⇒ both terms are
    // zero ⇒ its shares/legitimacy evolve identically whether or not OTHER members
    // carry deities (the settlementFaithStandalone contract).
    const neighbourIds = spread ? neighbourIdsOf(snapshot, cid) : [];
    const moodDeity = patronSnapshot(state);
    // The ruling power as a character lens — drives both growth favour (here) and the
    // legitimacy target (below). Computed once per settlement per tick (deterministic).
    const lens = rulerLens(settlement);
    // Religious-institution backing (0..1): temples lend creed-agnostic legitimacy to
    // whatever faith holds the seat. Computed once per settlement (read off institutions).
    const institutionBacking = institutionBackingOf(settlement);
    // The clergy plane (W-F3 leaf) — WHO ministers, distinct from who governs. Computed
    // ONCE per settlement and shared by the legitimacy target (W-F4 scandal drag) and the
    // piety record (W-F3 bleed-through). Zero on every field for an unflawed / no-clergy
    // priesthood ⇒ byte-identical.
    const clergyPlane = readClergyPlane(settlement);
    // This settlement's faith mass (by current tier) — scales how hard neighbouring
    // faiths press on it: a small settlement is swayed strongly by a big neighbour.
    const targetMass = faithMass(settlement);
    // W-F3: the TICK-START piety composite for this settlement, read off LAST tick's
    // projected faithProfile.piety (the anti-runaway seam — this tick's amplified
    // effects cannot re-enter this tick's piety). 1.0 (byte-identical) on tick-0 /
    // deity-free / zero-span. `pietySynergy` is the same value but NULL when there is
    // no measured piety, so the legitimacy synergy stays exactly 0 on those fixtures.
    const pietyMult = pietyMultOf(settlement);
    const pietySynergy = settlement?.config?.faithProfile?.piety ? pietyMult : null;
    // Crisis conversion: the settlement's DISORDER (owner's five contexts), computed once
    // per settlement per tick. Chaos-side newcomers read extra receptivity from it inside
    // deityLocalStrength; a stable high-tier peaceful settlement reads 0 (byte-identical).
    const crisisDisorder = crisisDisorder01({ settlement, tier, cid, occupations, lens, worldState });

    // 3a. entries — faiths reaching C not yet present (or resurging from suppression).
    if (reaching) {
      for (const dref of [...reaching.keys()].sort(codepoint)) {
        const { deity, carrier, occupied } = reaching.get(dref);
        const cur = state.deities[dref];
        if (cur && !cur.suppressed) continue;
        // Site #1 (conversion pressure): amplify the target-side local strength — a
        // devout town is a fiercer battleground both to hold and to take. The
        // occupation lift (#2) inherits via this amplified strength (not double-counted).
        let strength = clamp01(pietyMult * deityLocalStrength({ snapshot, deity, deityRef: dref, neighbourIds, carrier, moodDeity, lens, worldState, cid, targetMass, crisisDisorder }));
        if (occupied) {
          const pull = occupationFaithPull(snapshot, occupations, String(occupations[cid].occupierId), cid);
          if (pull) {
            const lift = clamp01(OCC_CONVERSION_GAIN * pull.control * (pull.warbound ? WARBOUND_CONVERSION_MULT : 1) * (1 - incumbentCounterForce(deity, moodDeity)));
            strength = clamp01(strength + lift * (1 - strength));
          }
        }
        attemptEntry(state, deity, strength, { force: Boolean(occupied) });
      }
    }

    // 3b. advance shares for all present (active) deities toward their strengths.
    /** @type {Record<string, number>} */
    const strengthByRef = {};
    for (const dref of Object.keys(state.deities)) {
      if (state.deities[dref].suppressed) continue;
      const carrier = reaching?.get(dref)?.carrier ?? (dref === state.patronRef ? 0.5 : 0.25);   // home faith keeps innate footing
      // Site #1 (share targets): the SAME target-side piety amplification on every
      // present faith's growth toward its strength (hold AND take, symmetric).
      strengthByRef[dref] = clamp01(pietyMult * deityLocalStrength({ snapshot, deity: state.deities[dref].snapshot, deityRef: dref, neighbourIds, carrier, moodDeity, lens, worldState, cid, targetMass, crisisDisorder }));
    }
    advanceShares(state, strengthByRef);
    // Legitimacy: each active faith drifts (slowly) toward its rightful-claim target —
    // ruler endorsement + neighbour recognition + tenure + chronicle momentum, minus
    // the heresy stain and corruption rot. Distinct from share; it LAGS conversion.
    for (const dref of Object.keys(state.deities)) {
      const entry = state.deities[dref];
      if (entry.suppressed) continue;
      const target = deityLegitimacyTarget({ settlement, snapshot, worldState, cid, deity: entry.snapshot, deityRef: dref, neighbourIds, entry, lens, institutionBacking, deitySnapshotFor, government: settlement?.powerStructure?.government ?? settlement?.powerStructure?.governingName, pietyMult: pietySynergy, clergy: clergyPlane });
      stepDeityLegitimacy(entry, target);
    }
    // Patron seat: a CONTESTED niche (a rival in the patron's own niche — e.g. an
    // imposed cult) is decided by a SEEDED, legitimacy-weighted top-three contest;
    // an uncontested pantheon (or an absent PRNG) uses the deterministic share-based
    // flip. The PRNG is forked per settlement+tick ⇒ reproducible, never Math.random.
    const contestRng = rng?.fork ? rng.fork(`religion-contest::${tick}::${cid}`) : null;
    if (!contestRng || !resolvePatronContest(state, contestRng)) selectPatron(state);
    religionStates[cid] = state;

    // W-F3: derive THIS tick's piety read-model from the EVOLVED state (authority from
    // the causal religious_authority score — rank-derived fallback when the causal
    // snapshot is absent; institution + devotion + the clergy lens). The kernel projects
    // it onto faithProfile.piety, and NEXT tick's amplified sites read it. Side read-model
    // only — it does not touch THIS tick's mechanics, so unit fixtures stay byte-identical.
    const causalAuthority = snapshot?.byId?.get?.(cid)?.causal?.scores?.religious_authority;
    const authority01 = Number.isFinite(causalAuthority)
      ? clamp01(Number(causalAuthority) / 100)
      : clamp01(0.3 + 0.4 * deityRankStrength(patronSnapshot(state)));
    pietyByCid[cid] = pietyRecord({
      authority01,
      institutionBacking,
      devotion01: devotionOf(state),
      clergy: clergyPlane,
      realmMult,
      dampener: oppositionDampener(state),
    });

    // 3c. patron change → a gradual conversion outcome (re-embed the new patron).
    if (state.patronRef && state.patronRef !== prevPatron) {
      // An occupation-DRIVEN patron flip stains the new patron: a faith that took the
      // seat under the garrison (not by earned devotion) carries the heresy stain even
      // if it had already entered un-forced → low legitimacy → brittle. Covers the
      // share-flip case that attemptEntry's force-stain (entry-only) misses.
      if (occupations?.[cid]?.occupierId && state.deities[state.patronRef]) {
        const e = state.deities[state.patronRef];
        e.heresyStain = Math.max(Number(e.heresyStain) || 0, RELIGION_TUNING.LEGIT_STAIN_IMPOSED);
      }
      const newPatron = patronSnapshot(state);
      // Site #4 (contest stakes): a devout city's conversion is a bigger crisis — the
      // severity scales with the target's piety (0.5 exactly when no record). The
      // amplifier tag (localMult/realmMult) rides the receipt for legibility.
      const amplifiers = amplifierTag(settlement);
      const reasons = [`${newPatron?.name || 'a rising faith'} overtook the former patron to become ${nameFor(cid)}'s patron creed.`];
      if (amplifiers && pietyMult !== 1) reasons.push(`Deep local devotion (piety ×${pietyMult.toFixed(2)}) sharpened the upheaval.`);
      if (newPatron) outcomes.push(conversionOutcome({
        cause: occupations?.[cid]?.occupierId ? 'occupation' : 'contest',
        id: `world_stressor.religious_conversion_fracture.${stablePart(cid)}`,
        targetSaveId: cid,
        severity: clamp01(0.5 * pietyMult),
        headline: `${nameFor(cid)} turns to the faith of ${newPatron.name || 'a new creed'}`,
        summary: `After a long contest of devotion, ${newPatron.name || 'a rising faith'} has become the patron creed of ${nameFor(cid)}.`,
        reasons,
        tick,
        sourceEventTargetId: cid,
        deityReembed: { snapshot: newPatron, fromSettlementId: cid },
        amplifiers,
      }));
    }
  }

  return { religionStates, outcomes, graphChannels, pietyByCid };
}
