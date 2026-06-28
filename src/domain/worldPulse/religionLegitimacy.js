/**
 * domain/worldPulse/religionLegitimacy.js — a faith's LEGITIMACY: its *rightful
 * claim* to be a settlement's patron, distinct from its momentary adherent SHARE.
 *
 * Two knobs drive the pantheon (see religionState.js):
 *   - GROWTH (share velocity) — how fast a cult converts the population. Rank +
 *     carrier + prevalence + receptivity (deityLocalStrength). Fast and volatile.
 *   - LEGITIMACY (this module) — how *rightful* a faith's claim is. Slow, and it
 *     LAGS share: it accrues only by holding (tenure), by the ruler's endorsement,
 *     by neighbour recognition, and by the chronicle of recent changes read through
 *     the ruler's character; it is dragged by corruption and by the heresy stain of
 *     a faith that rose by force. A conqueror can convert a town overnight (share)
 *     but the new faith stays illegitimate and brittle until it earns tenure.
 *
 * Legitimacy is what selectPatron defends with: the patron holds the seat on
 * rightfulness even as a flashier cult out-converts it — until the cult earns
 * legitimacy or the patron's collapses (a regime change, lost neighbours, rot).
 *
 * PURE + DETERMINISTIC: codepoint-sorted, no RNG, no wall-clock. Every input is a
 * read off the immutable pulse snapshot / worldState, so it is replay-identical.
 */

import { deityRankStrength, RELIGION_TUNING } from './religionState.js';
import { npcAlignmentScore, readCorruptionClimate, deityAlignmentDirection, npcCorruptibleFlaw } from '../corruption.js';

// Deity character axes as 0..1 positions (mirrors religiousContest's TEMPER/ALIGN).
const TEMPER_POS = /** @type {Record<string, number>} */ ({ warlike: 1, neutral: 0.5, peaceful: 0 });
const ALIGN_POS = /** @type {Record<string, number>} */ ({ evil: 0, neutral: 0.5, good: 1 });

// A governing faction's archetype implies a temperament + alignment lean (0..1),
// the institutional "character of who holds power".
const ARCHETYPE_LEAN = /** @type {Record<string, { temper: number, align: number }>} */ ({
  military:   { temper: 0.9, align: 0.5 },
  government: { temper: 0.5, align: 0.6 },
  religious:  { temper: 0.4, align: 0.7 },
  merchant:   { temper: 0.4, align: 0.5 },
  craft:      { temper: 0.4, align: 0.6 },
  arcane:     { temper: 0.5, align: 0.4 },
  criminal:   { temper: 0.7, align: 0.15 },
  occupation: { temper: 0.95, align: 0.35 },
  other:      { temper: 0.5, align: 0.5 },
});

export const RELIGION_LEGITIMACY_TUNING = Object.freeze({
  LAG: 0.12,                  // per-tick approach to target — slow, so legitimacy lags share
  COMPROMISE_EVIL_AMP: 0.45,  // a rotten rulership (NPC→faction→ruler + criminal insts) SIGNIFICANTLY speeds evil faiths
  COMPROMISE_MOOD_EROSION: 0.55, // a compromised populace resists an alien creed LESS (frayed moral fabric),
                              // scaled by compromise — so DEEP corruption converts faster than mild (the gradient)
  STAIN_DECAY: 0.06,          // heresy stain burns off per tick of held standing (seed in RELIGION_TUNING.LEGIT_*)
  TENURE_HALF: 8,             // ticks of held standing for tenure term to reach ~0.5
  PREVALENCE_CAP: 0.5,        // max neighbour-endorsement contribution
  CHRONICLE_WINDOW: 12,       // pulseHistory records scanned (recency-weighted)
  CHRONICLE_MAX: 0.25,        // max |chronicle momentum| swing
  CHRONICLE_GROWTH_AMP: 0.6,  // recent matching/clashing events spike/slow conversion by ±(this×MAX)
  W_RULER: 0.42, W_NEIGHBOUR: 0.20, W_TENURE: 0.30, W_CHRONICLE: 0.08, // target weights (sum 1)
  // A COMPROMISED rulership OVERRIDES tradition: the captured state's endorsement
  // dominates legitimacy (ruler weight rises) while the organic, slow sources (tenure
  // + neighbour recognition) fade — so a rotten regime can de/re-legitimize faiths by
  // fiat, and an imposed creed it favours can actually seize the patron seat.
  COMPROMISE_RULER_SHIFT: 0.40,   // added to W_RULER at full compromise
  COMPROMISE_TRADITION_FADE: 0.5, // fraction of tenure+neighbour weight stripped at full compromise (entrenched faiths keep some)
});

const clamp01 = (/** @type {number} */ n) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Importance → org-power weight (mirrors entities/npcs importanceWeight). @param {any} npc */
function orgPower(npc) {
  const w = /** @type {Record<string, number>} */ ({ minor: 0.0, notable: 0.4, key: 0.7, pillar: 1.0 });
  return w[String(npc?.importance || 'minor')] ?? 0;
}

/**
 * The ruling power's CHARACTER as a lens (deterministic): its temperament + alignment
 * lean, how much org-power backs it, and the corruption it sits in. Folds the
 * governing faction's archetype with its strongest linked NPC's authored alignment.
 * @param {any} settlement
 * @returns {{ temper: number, align: number, power: number, corrupt: number, compromise: number }}
 */
export function rulerLens(settlement) {
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const governing = String(ps.governingName || '').toLowerCase();
  // Match the governing faction by name; fall back to the highest-power faction.
  let ruler = factions.find((/** @type {any} */ f) => String(f?.name || '').toLowerCase() === governing);
  if (!ruler && governing) ruler = factions.find((/** @type {any} */ f) => governing.startsWith(String(f?.name || '').toLowerCase()) && f?.name);
  if (!ruler) ruler = factions.slice().sort((/** @type {any} */ a, /** @type {any} */ b) => (Number(b?.power) || 0) - (Number(a?.power) || 0))[0];
  const lean = ARCHETYPE_LEAN[String(ruler?.archetype || 'other')] || ARCHETYPE_LEAN.other;

  // The faction's strongest linked NPC sharpens the alignment lean (authored character).
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  const rulerId = String(ruler?.id || '');
  let lead = null; let leadPow = -1; let rulerFlaw = 0;
  for (const n of npcs) {
    const linked = Array.isArray(n?.linkedFactionIds) ? n.linkedFactionIds.map(String) : [];
    if (rulerId && !linked.includes(rulerId)) continue;
    const p = orgPower(n);
    if (p > leadPow) { leadPow = p; lead = n; }
    // A corruptible flaw on a power-holder rots the throne proportional to their clout.
    if (npcCorruptibleFlaw(n)) rulerFlaw = Math.max(rulerFlaw, 0.4 + 0.6 * p);
  }
  // npcAlignmentScore: −1 (evil) .. +1 (good) → 0..1 position; blend with archetype lean.
  const npcAlign = lead ? (npcAlignmentScore(lead) + 1) / 2 : lean.align;
  const align = clamp01(0.5 * lean.align + 0.5 * npcAlign);
  const power = clamp01(0.45 + 0.55 * Math.max(Number(ruler?.power) / 100 || 0, leadPow > 0 ? leadPow : 0));
  const climate = /** @type {any} */ (readCorruptionClimate(settlement) || {});
  const crime = clamp01(Number(climate.crime) || 0);
  // COMPROMISE CHAIN: ambient crime + criminal institutions + a flawed power-holder +
  // a criminal ruling faction each rot the legitimate rulership. Saturating 0..1. This
  // is the variable amplifier for evil faiths (consumed by deityGrowthFavor).
  const crimInst = climate.hasCriminalInst ? clamp01(0.3 + 0.18 * (Array.isArray(climate.criminalInstitutions) ? climate.criminalInstitutions.length : 1)) : 0;
  const factionDark = String(ruler?.archetype) === 'criminal' ? 0.5 : 0;
  const compromise = clamp01(0.35 * crime + 0.28 * crimInst + 0.40 * rulerFlaw + 0.25 * factionDark);
  return { temper: clamp01(lean.temper), align, power, corrupt: crime, compromise };
}

/** 0..1 fit between a deity and a ruling-power lens (alignment + temperament). @param {any} deity @param {{temper:number,align:number}} lens */
function deityRulerFit(deity, lens) {
  const dT = TEMPER_POS[deity?.temperamentAxis] ?? 0.5;
  const dA = ALIGN_POS[deity?.alignmentAxis] ?? 0.5;
  const temperFit = 1 - Math.abs(dT - lens.temper);
  const alignFit = 1 - Math.abs(dA - lens.align);
  return clamp01(0.5 * temperFit + 0.5 * alignFit);
}

/** 0..1 ruler endorsement: fit × how much power backs the ruler. @param {any} deity @param {{temper:number,align:number,power:number}} lens */
function rulerEndorsement(deity, lens) {
  return clamp01(deityRulerFit(deity, lens)) * (0.5 + 0.5 * lens.power);
}

/**
 * 0..1 GROWTH favour — how much the ruling power + the settlement's corruption climate
 * SPEED this faith's conversion (the "how fast a cult grows" knob, distinct from
 * legitimacy/the contest). A deity the rulers favour converts faster; high corruption
 * speeds evil/chaotic-leaning faiths and slows the good. Pure, deterministic. Multiply
 * a deity's local strength by ~(0.7 + 0.6 × this) so it modulates ±30% of growth.
 * @param {any} deity @param {{ temper:number, align:number, power:number, corrupt:number, compromise?:number }} lens
 */
export function deityGrowthFavor(deity, lens) {
  if (!lens) return 0.5;
  const rulerFit = deityRulerFit(deity, lens);                 // 0..1 fit with who holds power
  const alignDir = deityAlignmentDirection(deity);             // −1 evil .. +1 good
  // Ambient corruption GENTLY slows the bright (good only) — the evil side of rot is
  // the richer compromise chain below, so we don't double-count corruption for evil.
  const corruptFavor = clamp01(0.5 - 0.5 * (Number(lens.corrupt) || 0) * Math.max(0, alignDir));
  const base = clamp01(0.6 * rulerFit + 0.4 * corruptFavor);
  // The COMPROMISE CHAIN (a flawed/criminal rulership + criminal institutions) is the
  // SINGLE, significant, VARIABLE amplifier for EVIL faiths — the dark thrives where
  // rule rots. Evil-only, and it stays responsive across the full compromise range.
  const evilBoost = Math.max(0, -alignDir) * (Number(lens.compromise) || 0);   // 0..1, evil-only
  return clamp01(base + RELIGION_LEGITIMACY_TUNING.COMPROMISE_EVIL_AMP * evilBoost);
}

/**
 * 0..1 neighbour endorsement: the fraction of neighbours whose PATRON is this deity,
 * weighted toward higher-rank patrons (a metropolis's creed confers more). Capped.
 * @param {any} snapshot @param {string[]} neighbourIds @param {string} deityRef
 * @param {(snapshot:any, id:string)=>any} deitySnapshotFor
 */
function neighbourEndorsement(snapshot, neighbourIds, deityRef, deitySnapshotFor) {
  if (!neighbourIds.length) return 0;
  let acc = 0;
  for (const nid of neighbourIds) {
    const snap = deitySnapshotFor(snapshot, nid);
    if (snap && String(snap._deityRef || snap.name) === String(deityRef)) acc += 0.5 + 0.5 * deityRankStrength(snap);
  }
  return clamp01(Math.min(RELIGION_LEGITIMACY_TUNING.PREVALENCE_CAP, acc / Math.max(1, neighbourIds.length)));
}

/**
 * −CHRONICLE_MAX..+CHRONICLE_MAX recency-weighted momentum: recent CHANGES touching the
 * settlement (corruption exposures, faction captures, applied outcomes) read through the
 * ruler's character. A change under a ruler whose lens matches the deity vindicates it;
 * a mismatched change erodes it. Bounded so no single beat swings legitimacy wildly.
 * Also DI'd into deityLocalStrength as a temporal GROWTH modulator (a settlement that
 * just turned dark/bright spikes the matching faith's conversion, fading over ticks).
 * @param {any} worldState @param {string} cid @param {any} deity @param {{temper:number,align:number}} lens
 */
export function chronicleMomentum(worldState, cid, deity, lens) {
  const history = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  if (!history.length) return 0;
  const { CHRONICLE_WINDOW: W, CHRONICLE_MAX: MAX } = RELIGION_LEGITIMACY_TUNING;
  // Newest records first; the kernel appends oldest→newest, so walk from the tail.
  const recent = history.slice(-W);
  const fit = deityRulerFit(deity, lens);          // 0..1; >0.5 vindicates, <0.5 erodes
  let momentum = 0; let wsum = 0;
  for (let i = 0; i < recent.length; i++) {
    const rec = recent[i];
    const recency = (i + 1) / recent.length;        // oldest→newest in the window ⇒ newest weighs most
    let touches = 0;
    for (const e of (rec?.corruptionEvents || [])) if (String(e?.settlementId) === cid) touches += 1;
    for (const e of (rec?.factionCaptureEvents || [])) if (String(e?.settlementId) === cid) touches += 1.5;
    for (const o of (rec?.selectedOutcomes || [])) if (String(o?.targetSaveId) === cid) touches += 0.4 * (Number(o?.severity) || 0.3);
    if (touches <= 0) continue;
    momentum += recency * Math.min(2, touches) * (fit - 0.5) * 2;  // (fit−0.5)*2 ⇒ −1..+1 direction
    wsum += recency * Math.min(2, touches);
  }
  if (wsum <= 0) return 0;
  return Math.max(-MAX, Math.min(MAX, (momentum / wsum) * MAX));
}

/**
 * The 0..1 legitimacy TARGET a deity drifts toward this tick. Composes ruler
 * endorsement, neighbour recognition, accumulated tenure, and chronicle momentum,
 * minus the heresy stain and corruption drag. Deterministic.
 * @param {{ settlement:any, snapshot:any, worldState:any, cid:string, deity:any, deityRef:string,
 *   neighbourIds:string[], entry:any, lens?:any, deitySnapshotFor:(s:any,id:string)=>any }} args
 * @returns {number}
 */
export function deityLegitimacyTarget({ settlement, snapshot, worldState, cid, deity, deityRef, neighbourIds, entry, lens, deitySnapshotFor }) {
  const T = RELIGION_LEGITIMACY_TUNING;
  const L = lens || rulerLens(settlement);
  const ruler = rulerEndorsement(deity, L);
  const neighbour = neighbourEndorsement(snapshot, neighbourIds, deityRef, deitySnapshotFor);
  const tenure = (Number(entry?.tenure) || 0) / ((Number(entry?.tenure) || 0) + T.TENURE_HALF);   // 0..~1, saturating
  const chronicle = chronicleMomentum(worldState, cid, deity, L);
  const stain = Math.max(0, Number(entry?.heresyStain) || 0);
  // Compromise RE-WEIGHTS the sources: a captured state's endorsement dominates, while
  // tradition (tenure) + neighbour recognition fade. A clean settlement keeps the
  // balanced organic weighting; a deeply rotten one legitimizes whatever the rulers
  // favour — so a corrupt regime delegitimizes its good church and an imposed dark
  // creed can actually earn the standing to seize the patron seat. (Replaces the old
  // corruptionDrag, which perversely eroded the very faith the corrupt rulers backed.)
  const c = clamp01(Number(L.compromise) || 0);
  const wRuler = T.W_RULER + c * T.COMPROMISE_RULER_SHIFT;
  const fade = 1 - c * T.COMPROMISE_TRADITION_FADE;
  const base = wRuler * ruler + (T.W_NEIGHBOUR * fade) * neighbour + (T.W_TENURE * fade) * tenure + T.W_CHRONICLE * (0.5 + chronicle);
  return clamp01(base - stain);
}

/**
 * Advance a deity entry's legitimacy toward its target (lagged), accrue tenure while
 * it holds established+ standing, and burn off its heresy stain. Mutates the entry.
 * @param {any} entry @param {number} target
 */
export function stepDeityLegitimacy(entry, target) {
  const T = RELIGION_LEGITIMACY_TUNING;
  const seed = RELIGION_TUNING.LEGIT_SEED_CULT ?? 0.08;
  const cur = Number(entry.legitimacy);
  const start = Number.isFinite(cur) ? cur : seed;
  entry.legitimacy = clamp01(start + T.LAG * (target - start));
  const established = entry.standing === 'established' || entry.standing === 'ascendant';
  entry.tenure = Math.max(0, (Number(entry.tenure) || 0) + (established ? 1 : -1));
  if (entry.heresyStain) entry.heresyStain = Math.max(0, entry.heresyStain - (established ? T.STAIN_DECAY : 0));
}
