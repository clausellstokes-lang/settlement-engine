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

import { deityRankStrength, RELIGION_TUNING, faithMass, neighbourFaithInfluence } from './religionState.js';
import { npcAlignmentScore, readCorruptionClimate, deityAlignmentDirection, npcCorruptibleFlaw } from '../corruption.js';
// Phase 4 W-F3 — the government-form × law-axis synergy reads the patron's signed
// law position (lawSign: +1 lawful · −1 chaotic · 0 neutral/legacy) off the ONE
// axis projection, so a law-neutral/legacy patron contributes EXACTLY 0.
import { lawSign } from './deityStance.js';
// Phase 4 W-F4 — the reciprocal patron loop reads the deity's two-axis plane position
// (evil01 / chaos01) to score its fit with the settlement's ENDOGENOUS conduct.
import { evil01, chaos01, deityTemper } from './deityAxes.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { outcomesForMechanicalHistory } from './pulseHelpers.js';
// Phase 4 W-F8 — the ENDOGENOUS CONDUCT plane also reads the settlement's own domestic
// STRUCTURE: its morally-loaded institutions (a standing slave market is cruel conduct)
// and its martial readiness (a maintained war machine is warlike conduct). Both close
// the fit loop: keeping a cruel institution under a good patron, or arming under a
// peacelike one, registers as DRIFT. Both read 0 for a settlement with none ⇒ byte-identical.
import { settlementMoralConductLean } from './moralMartialLean.js';
import { settlementMartialConductLean } from './martialReadiness.js';
// THE FACTION-KEY BUG (same class as the ladder's, commits 25749ae5 + dc0b6e2b): real
// powerStructure.factions records carry the display name in `.faction` and carry NEITHER
// `.name` NOR `.id` NOR `.archetype`. rulerLens hand-rolled its own `.name` lookups and its
// own `.id` join, so all three read dead on every generated settlement. These are the
// canonical accessors — the SAME chokepoints the other faction consumers use — imported
// rather than re-spelled, because a tenth hand-rolled variant is how this class propagates.
// rulingPower/factionArchetypes are EAGER modules and this is a lazy worldPulse leaf, so
// the import runs in the safe lazy → eager direction and adds 0 first-paint bytes.
import { governingFactionOf } from '../rulingPower.js';
import { factionArchetype } from '../factionArchetypes.js';
import { npcInFaction, ladderFactionKey } from './npcLadderState.js';

// Deity character axes as 0..1 positions (mirrors religiousContest's TEMPER/ALIGN).
// 'peacelike' is deriveTemper's spelling (deityAxes); 'peaceful' is the
// legacy stored-axis spelling. BOTH map to 0 so a derived temper reads correctly
// through this lens. [worldpulse-religion-trade-1]
const TEMPER_POS = /** @type {Record<string, number>} */ ({ warlike: 1, neutral: 0.5, peaceful: 0, peacelike: 0 });
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
  W_INSTITUTION: 0.12,            // max legitimacy a temple-rich settlement lends the ESTABLISHED faith (a bounded
                                  // bonus atop the sum-1 base — creed-agnostic structural backing that entrenches incumbents)
  // W-F3 government-form × law-axis synergy: a patron whose law position MATCHES the
  // governance form's law affinity earns extra legitimacy standing; a mismatch (the
  // trickster over a dukedom, the lawgiver in a freebooter port) is a friction. LAW
  // AXIS ONLY — the FORM of rule is a law-chaos matter (conduct is good-evil, handled
  // elsewhere). Bounded (max ±SYNERGY_W × composite piety) and piety-scaled; EXACTLY 0
  // for a law-neutral/legacy patron or a settlement with no measured piety.
  SYNERGY_W: 0.06,
  // ── W-F4 RECIPROCAL PATRON LOOP (owner addendum 2026-07-10) ─────────────────
  // A patron is chosen AND RETAINED partly by ALIGNMENT FIT: how much the settlement's
  // OWN ENDOGENOUS conduct matches the deity's two-axis plane. The relationship is
  // reciprocal but NOT perpetual — the fit is re-derived from CURRENT conduct each tick
  // (drifting conduct erodes the signal) and the LAG step decays legitimacy toward it,
  // so an imposed patron over misaligned conduct WITHERS unless conduct comes to match.
  // ENDOGENEITY (strict): the conduct plane reads ONLY domestic signals — governance
  // character, corruption/compromise depth, and the settlement's own governance-form law
  // affinity. War, trade, partnerships, the USER, and the PARTY are EXCLUDED (foreign
  // policy and divine fiat never feed the loop). SIGNED and 0 at a neutral deity OR
  // neutral conduct ⇒ byte-identical for legacy/neutral deities. SUBCRITICAL: the swing
  // is bounded and small (no absorbing state — entrenchment is strong, not ownership).
  CONDUCT_FIT_W: 0.14,          // max legitimacy swing from ±full conduct alignment
  CONDUCT_GOV_W: 0.6,           // governance-character weight in the conduct plane…
  CONDUCT_COMPROMISE_W: 0.4,    // …vs corruption/compromise depth
  // ── W-F8 endogenous STRUCTURE terms (moral institutions + martial readiness) ──
  // Additive nudges on the conduct plane from the settlement's own STANDING structure,
  // both EXACTLY 0 when absent (no morally-coded institution / no readiness record) ⇒
  // byte-identical. The moral term shifts BOTH axes (cruelty→evil, disorder→chaos);
  // the martial term shifts toward the warlike quadrant (evil+chaos), so a peacelike
  // patron over a war machine reads a mismatch (the demilitarization pressure).
  CONDUCT_MORAL_INST_W: 0.3,    // signed cruelty/disorder lean of morally-coded institutions
  CONDUCT_MARTIAL_W: 0.35,      // warlike lean from martial readiness (already 0..~0.6 signed +)
  // ── W-F4 CLERGY LEGITIMACY DRAG (owner clergy-lens addendum) ────────────────
  // A scandalous priesthood is a legitimacy drag: the god's seat is only as clean as
  // the clergy who minister it. Keyed on the influence-weighted corruptible-flaw taint,
  // SHARPENED when the compromise is already publicly REVEALED (a covert stain hurts
  // less than an open scandal). Cross-term: a HOSTILE court (a ruler misaligned with the
  // patron) amplifies the scandal, a SYNERGISTIC court shields it. EXACTLY 0 for an
  // unflawed / trait-neutral / no-religious-faction priesthood ⇒ byte-identical.
  CLERGY_SCANDAL_W: 0.16,       // max legitimacy drag from a fully-tainted revealed priesthood
  CLERGY_REVEALED_SHARPEN: 0.6, // extra weight on the REVEALED share of the taint (covert→revealed)
  CLERGY_COURT_AMP: 0.5,        // hostile court amplifies / synergistic court shields the scandal
});

// Each governance form carries a signed law-axis affinity (+1 lawful … −1 chaotic,
// 0 centre) — the "how ordered is the FORM of rule" reading the owner named. Matched
// by name like mandateGovWeight. THEOCRACY is special (its affinity IS the patron's
// own law position — synergy by construction), handled in governmentLawFit.
const GOVERNMENT_LAW_AFFINITY = /** @type {Array<[RegExp, number]>} */ ([
  [/crimin|syndicate|thiev|outlaw|pirate|bandit/, -1.0],                 // criminal syndicates ⇒ chaotic
  [/free.?town|frontier|tribal|moot|clan|nomad|compact|commune|anarch/, -0.6], // free-towns / frontier / tribal ⇒ chaotic-lean
  [/merchant|council|republic|oligarch|confeder|guild|senate|parliament/, 0], // merchant councils ⇒ centre
  [/monarch|feudal|autocra|imperial|empire|kingdom|throne|royal|king|queen|emperor|duke|dukedom|magistr|magocra|despot|dynast|principality/, 1.0], // feudal/royal/dukedom/magistracy ⇒ lawful
]);

/** Signed law-axis affinity of a governance form (+1 lawful … −1 chaotic, 0 centre/unknown).
 *  Exported so the W-F4 crisis-conversion term can fade the small-tier chaos bonus by how
 *  lawful the government is (a chartered town resists the whisper a thorp cannot).
 *  @param {string|null|undefined} government @returns {number} */
export function governmentLawAffinity(government) {
  const g = String(government || '').toLowerCase();
  for (const [re, v] of GOVERNMENT_LAW_AFFINITY) if (re.test(g)) return v;
  return 0;
}

/**
 * The signed government-form × patron-law ALIGNMENT ∈ [−1, +1]: +1 when the patron's
 * law position matches the form's affinity (prop), −1 on full mismatch (friction), 0
 * for a law-neutral/legacy patron (lawSign 0) — the byte-identity anchor. A THEOCRACY's
 * affinity IS the patron's own law position, so alignment = lawSign² ∈ {0, +1}: synergy
 * by construction, and still 0 for a law-neutral patron. Pure.
 * @param {{ lawAxis?: string }|null|undefined} deity @param {string|null|undefined} government @returns {number}
 */
export function governmentLawFit(deity, government) {
  const law = lawSign(deity);                       // +1 lawful · −1 chaotic · 0 neutral/legacy
  if (law === 0) return 0;
  const g = String(government || '').toLowerCase();
  const affinity = /theocra/.test(g) ? law : governmentLawAffinity(government);
  return law * affinity;                            // ∈ [−1, +1]
}

const clamp01 = (/** @type {number} */ n) => (n < 0 ? 0 : n > 1 ? 1 : n);

// ── Religious-institution backing ────────────────────────────────────────────
// A settlement's organized worship (temples, churches, monasteries, shrines) lends
// STANDING to whatever faith already holds the seat — creed-agnostic structural
// legitimacy. Institutions carry no strength field (verified: they are presence
// records), so the signal is count×scale, saturated. It is NOT read by
// deriveReligiousAuthority, so this is genuinely new signal (no double-count).
const INSTITUTION_SCALE = /** @type {Record<string, number>} */ ({ church: 1, monastery: 0.6 });
const INSTITUTION_SAT = 2.2;     // weighted religious-institution count that saturates backing to ~1
// Backing entrenches the ESTABLISHED faith, not a fresh cult: temples back the seat.
const STANDING_BACKING = /** @type {Record<string, number>} */ ({ ascendant: 1, established: 0.6, cult: 0.1 });

/**
 * 0..1 religious-institution backing of a settlement (count × scale, saturated). A
 * cathedral/church weighs full, a monastery less, a shrine least. Creed-agnostic.
 * @param {import('../settlement.schema.js').SimSettlement} settlement @returns {number}
 */
export function institutionBackingOf(settlement) {
  // LIVE roster only — a calamity-destroyed cathedral is a ruin, not standing worship,
  // and lends no faith backing (ruin-filter class).
  const insts = liveInstitutions(settlement);
  let weighted = 0;
  for (const it of insts) {
    const tags = Array.isArray(it?.tags) ? it.tags : [];
    if (!tags.includes('religious') && String(it?.priorityCategory) !== 'religion') continue;
    weighted += tags.includes('church') ? INSTITUTION_SCALE.church : tags.includes('monastery') ? INSTITUTION_SCALE.monastery : 0.35;
  }
  return clamp01(weighted / INSTITUTION_SAT);
}

/** Importance → org-power weight (mirrors entities/npcs importanceWeight). Exported so
 *  the clergy lens (W-F3) aggregates the priesthood on the SAME weight. @param {import('../settlement.schema.js').SimNpc} npc */
export function orgPower(npc) {
  const w = /** @type {Record<string, number>} */ ({ minor: 0.0, notable: 0.4, key: 0.7, pillar: 1.0 });
  return w[String(npc?.importance || 'minor')] ?? 0;
}

/**
 * The ruling power's CHARACTER as a lens (deterministic): its temperament + alignment
 * lean, how much org-power backs it, and the corruption it sits in. Folds the
 * governing faction's archetype with its strongest linked NPC's authored alignment.
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @returns {{ temper: number, align: number, power: number, corrupt: number, compromise: number, moralLean: { cruelty: number, disorder: number }, martialLean: number }}
 */
export function rulerLens(settlement) {
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  // THE SEAT. governingFactionOf is the canonical accessor (`.isGoverning` first, then
  // nameOf === governingName, where nameOf reads `.faction || .name`). The two hand-rolled
  // `.name` finds it replaces were DEAD on real data — 0 matches over every generated
  // record probed — so every settlement fell through to the highest-power fallback.
  //
  // THAT FALLBACK IS WRONG ON FRESH WORLDS, not merely on exotic ones. rulingStructure sorts
  // the faction array governing-first REGARDLESS of power, so the seat is routinely not the
  // strongest faction and the array order hides it; re-sorting by power alone lands
  // elsewhere. Measured through the full generateSettlementPipeline: the fallback picks the
  // WRONG faction on 66/180 = 36.7% of freshly generated settlements (an independent probe
  // over a different corpus measured 25-35%, so the rate is corpus-sensitive but the
  // direction is not). A repeat coup makes it worse — each win banks +6 on the winner while
  // the seat's own power never moves. Measuring against the BARE generatePowerStructure
  // instead shows 360/360 agreement and reads as harmless; that corpus is not
  // representative, and believing it is how this defect stayed unnoticed.
  //
  // The fallback is KEPT as a last resort for the shape that has no seat to find: no
  // `.isGoverning` record and no matching governingName (the legacy/partial fixture shape).
  const ruler = governingFactionOf(
    /** @type {Parameters<typeof governingFactionOf>[0]} */ (/** @type {unknown} */ (settlement)))
    || factions.slice().sort((/** @type {any} */ a, /** @type {any} */ b) => (Number(b?.power) || 0) - (Number(a?.power) || 0))[0];
  // THE ARCHETYPE. `.archetype` is a hand-authored fixture key only — no generator writes
  // it, so `String(ruler?.archetype || 'other')` resolved 'other' on 100% of real data and
  // the whole ARCHETYPE_LEAN table was dead weight. factionArchetype is the canonical
  // detector and reads the `.category` every real record DOES carry. Fixture `.archetype`
  // keeps precedence so the legacy unit shape still drives the lens it was written for.
  // The cast is load-bearing DOCUMENTATION, not a silencer: now that `ruler` comes from the
  // typed governingFactionOf, tsc correctly reports that `.archetype` is not on
  // RulingFaction — which is exactly the defect. It stays OFF the typedef (adding it would
  // legitimize a key no writer produces) and is read here only to honour hand-authored
  // fixtures, so the read is cast at the one site that needs it.
  const archetype = String(/** @type {{ archetype?: string }} */ (ruler)?.archetype || '') || factionArchetype(ruler);
  const lean = ARCHETYPE_LEAN[archetype] || ARCHETYPE_LEAN.other;

  // The ruling faction's strongest linked NPC sharpens the alignment lean (authored
  // character). The old join read `String(ruler?.id || '')` — always '' on real data, because
  // no generated record carries `.id` — so the filter never skipped anyone and the scan
  // silently covered the WHOLE roster. `lead` was therefore the strongest NPC in the
  // settlement, not the seat's, and `rulerFlaw` rotted the throne for a flaw carried by
  // ANY townsperson. Membership now routes through npcInFaction, the canonical chokepoint,
  // which matches the generator's real joins (factionAffiliation / linkedFactionIds, both of
  // which hold the DISPLAY NAME) as well as `.id` for authored records.
  //
  // THIS NARROWING FIRES ON REAL DATA: measured over generateSettlementPipeline, the
  // governing seat has at least one affiliated NPC in 180/180 settlements, so the scan
  // genuinely narrows from the roster to the seat. (A bare-generatePowerStructure probe
  // suggested the opposite — that the seat is always memberless — because it does not run
  // the pipeline's NPC affiliation step. It is not a representative corpus; see the note in
  // tests/domain/religionLegitimacyFactionKey.test.js.)
  //
  // The whole-roster fallback is kept for the shape where the seat has NO members at all —
  // hand-authored fixtures and sparse worlds — where an empty set would null `lead` and zero
  // `rulerFlaw`, making the lens read blanker than before.
  // @enforced-by tests/domain/religionLegitimacyFactionKey.test.js (the pin's two join cases).
  const allNpcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  const seatKey = ruler ? ladderFactionKey(ruler) : '';
  const seatMembers = ruler
    ? allNpcs.filter((n) => npcInFaction(/** @type {Record<string, unknown>} */ (n || {}), ruler, seatKey))
    : [];
  const npcs = seatMembers.length ? seatMembers : allNpcs;
  let lead = null; let leadPow = -1; let rulerFlaw = 0;
  for (const n of npcs) {
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
  // Reads the DERIVED archetype for the same reason the lean does: `.archetype` is absent
  // from every generated record, so this compromise term could never fire on real data.
  const factionDark = archetype === 'criminal' ? 0.5 : 0;
  const compromise = clamp01(0.35 * crime + 0.28 * crimInst + 0.40 * rulerFlaw + 0.25 * factionDark);
  // W-F8: the settlement's own STANDING structure as endogenous conduct — its
  // morally-coded institutions ({cruelty,disorder} signed lean) and its martial
  // readiness (signed warlike lean). Both 0 when absent ⇒ the conduct plane is
  // unchanged ⇒ byte-identical for every settlement without them.
  const moralLean = settlementMoralConductLean(settlement);
  const martialLean = settlementMartialConductLean(settlement);
  return { temper: clamp01(lean.temper), align, power, corrupt: crime, compromise, moralLean, martialLean };
}

/** 0..1 fit between a deity and a ruling-power lens (alignment + temperament). @param {any} deity @param {{temper:number,align:number}} lens */
function deityRulerFit(deity, lens) {
  // Temper via the DERIVATION (deityTemper), NOT the retired stored
  // temperamentAxis — otherwise this dominant ruler-fit lane splits temper
  // semantics from the rest of the engine (a 4-axis evil+chaotic deity derives
  // 'warlike' everywhere else but read 0.5/neutral here off a stale/absent
  // stored field). [worldpulse-religion-trade-1]
  const dT = TEMPER_POS[deityTemper(deity) ?? 'neutral'] ?? 0.5;
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
 * 0..1 neighbour endorsement: neighbours whose PATRON is this deity, each weighted by
 * patron rank AND by the SIZE ASYMMETRY between that neighbour and this settlement — a
 * neighbouring city lends a creed far more standing here than a hamlet does (mirrors the
 * growth-side prevalence weighting). Capped.
 * @param {any} snapshot @param {string[]} neighbourIds @param {string} deityRef
 * @param {(snapshot:any, id:string)=>any} deitySnapshotFor @param {number} [targetMass]
 */
function neighbourEndorsement(snapshot, neighbourIds, deityRef, deitySnapshotFor, targetMass, rankStrengthOf = deityRankStrength) {
  if (!neighbourIds.length) return 0;
  let acc = 0;
  for (const nid of neighbourIds) {
    const snap = deitySnapshotFor(snapshot, nid);
    if (!snap || String(snap._deityRef || snap.name) !== String(deityRef)) continue;
    const nItem = snapshot?.byId?.get?.(String(nid))?.settlement;
    // [worldpulse-religion-trade-4] G1d — an endorsing neighbour's EARNED pantheon
    // tier lends more standing (rankStrengthOf blends snapshot rank with pantheon tier;
    // defaults to the base rank when no resolver is threaded ⇒ byte-identical).
    acc += (0.5 + 0.5 * rankStrengthOf(snap)) * neighbourFaithInfluence(faithMass(nItem), targetMass);
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
    for (const o of outcomesForMechanicalHistory(rec)) if (String(o?.targetSaveId) === cid) touches += 0.4 * (Number(o?.severity) || 0.3);
    if (touches <= 0) continue;
    momentum += recency * Math.min(2, touches) * (fit - 0.5) * 2;  // (fit−0.5)*2 ⇒ −1..+1 direction
    wsum += recency * Math.min(2, touches);
  }
  if (wsum <= 0) return 0;
  return Math.max(-MAX, Math.min(MAX, (momentum / wsum) * MAX));
}

/**
 * The settlement's ENDOGENOUS conduct plane (evilness, chaoticness), each 0..1 and
 * 0.5-neutral, from DOMESTIC signals ONLY: governance character (lens.align, 0 evil …
 * 1 good), corruption/compromise depth, and the settlement's own governance-FORM law
 * affinity. No external actions (war/trade/partnerships), no user/party. Pure.
 * @param {{ align?: number, compromise?: number, moralLean?: { cruelty?: number, disorder?: number }, martialLean?: number }} lens
 * @param {string|null|undefined} government
 * @returns {{ evil01: number, chaos01: number }}
 */
function conductPlane(lens, government) {
  const T = RELIGION_LEGITIMACY_TUNING;
  const compromise = clamp01(Number(lens?.compromise) || 0);
  const align = Number.isFinite(lens?.align) ? clamp01(Number(lens.align)) : 0.5;   // 0 evil … 1 good
  const rot = 0.5 + 0.5 * compromise;                                               // 0.5 clean … 1 rotten
  // W-F8 endogenous STRUCTURE nudges — 0 when absent (⇒ byte-identical). Signed
  // cruelty/disorder from morally-coded institutions; signed warlike lean from readiness
  // (pushes BOTH axes toward the warlike evil+chaos quadrant).
  const moral = lens?.moralLean || { cruelty: 0, disorder: 0 };
  const martial = Number(lens?.martialLean) || 0;
  const evilStruct = (Number(moral.cruelty) || 0) * T.CONDUCT_MORAL_INST_W + martial * T.CONDUCT_MARTIAL_W;
  const chaosStruct = (Number(moral.disorder) || 0) * T.CONDUCT_MORAL_INST_W + martial * T.CONDUCT_MARTIAL_W;
  const conductEvil01 = clamp01((1 - align) * T.CONDUCT_GOV_W + rot * T.CONDUCT_COMPROMISE_W + evilStruct);
  const govChaos = (1 - governmentLawAffinity(government)) / 2;                      // 0 lawful … 1 chaotic (0.5 neutral)
  const conductChaos01 = clamp01(govChaos * T.CONDUCT_GOV_W + rot * T.CONDUCT_COMPROMISE_W + chaosStruct);
  return { evil01: conductEvil01, chaos01: conductChaos01 };
}

/**
 * Signed ALIGNMENT FIT ∈ [−1,+1] of a deity's plane with the settlement's endogenous
 * conduct: per-axis agreement (both same sign ⇒ aligned, opposite ⇒ opposed), averaged.
 * EXACTLY 0 for a neutral deity (evil01/chaos01 = 0.5) OR neutral conduct ⇒ the reciprocal
 * loop is invisible to legacy/neutral fixtures. Pure — read from CURRENT conduct only, so
 * a drift in conduct erodes the signal (the "continuously fed / never perpetual" rule).
 * REUSED by the piety amplifier (W-F5.5 conduct-drift-erodes-piety): the SAME endogenous
 * signal that erodes legitimacy also erodes felt devotion — exported so piety never
 * recomputes it (the owner's "reuse, never recompute" mandate).
 * @param {{ alignmentAxis?: string, lawAxis?: string }} deity
 * @param {{ align?: number, compromise?: number }} lens
 * @param {string|null|undefined} government
 * @returns {number}
 */
export function conductFitSignal(deity, lens, government) {
  const c = conductPlane(lens, government);
  const agreeMoral = (evil01(deity) - 0.5) * (c.evil01 - 0.5) * 4;   // −1..+1; 0 at neutral either side
  const agreeLaw = (chaos01(deity) - 0.5) * (c.chaos01 - 0.5) * 4;
  const s = 0.5 * (agreeMoral + agreeLaw);
  return s < -1 ? -1 : s > 1 ? 1 : s;
}

/**
 * The 0..1 legitimacy TARGET a deity drifts toward this tick. Composes ruler
 * endorsement, neighbour recognition, accumulated tenure, and chronicle momentum,
 * minus the heresy stain and corruption drag. Deterministic.
 * @param {{ settlement:any, snapshot:any, worldState:any, cid:string, deity:any, deityRef:string,
 *   neighbourIds:string[], entry:any, lens?:any, institutionBacking?:number, deitySnapshotFor:(s:any,id:string)=>any,
 *   government?:string|null, pietyMult?:number|null, clergy?:import('./clergyTraitPlane.js').ClergyPlaneReading|null,
 *   rankStrengthOf?:(deity:unknown)=>number }} args
 * @returns {number}
 */
export function deityLegitimacyTarget({ settlement, snapshot, worldState, cid, deity, deityRef, neighbourIds, entry, lens, institutionBacking = 0, deitySnapshotFor, government = null, pietyMult = null, clergy = null, rankStrengthOf = deityRankStrength }) {
  const T = RELIGION_LEGITIMACY_TUNING;
  const L = lens || rulerLens(settlement);
  const ruler = rulerEndorsement(deity, L);
  // [worldpulse-religion-trade-4] G1d — thread the pantheon-tier-blended rank resolver
  // into neighbour recognition so a neighbouring seat-won creed lends more standing.
  const neighbour = neighbourEndorsement(snapshot, neighbourIds, deityRef, deitySnapshotFor, faithMass(settlement), rankStrengthOf);
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
  // Religious-institution backing: temples lend bounded, creed-agnostic legitimacy to
  // the faith that holds the seat (scaled by its standing) — entrenching the incumbent.
  const instTerm = T.W_INSTITUTION * clamp01(institutionBacking) * (STANDING_BACKING[entry?.standing] ?? 0.1);
  // W-F3 government-form × law synergy: a law-matched patron earns standing, a mismatch
  // frets it — piety-scaled, and EXACTLY 0 for a law-neutral/legacy patron (governmentLawFit)
  // OR when no piety was measured (pietyMult null ⇒ deity-free / tick-0 / unit fixtures) ⇒
  // byte-identical. Governance form read off powerStructure (passed by the driver).
  const gov = government ?? settlement?.powerStructure?.government ?? settlement?.powerStructure?.governingName;
  const synergy = pietyMult == null ? 0 : T.SYNERGY_W * governmentLawFit(deity, gov) * pietyMult;
  // W-F4 reciprocal patron loop: an endogenous conduct-alignment term grafted onto the
  // W_RULER family. Gated on a measured piety record (pietyMult != null) — the SAME
  // discipline as synergy — so static/unit fixtures without piety are byte-identical, and
  // SET_PRIMARY_DEITY (which mints no piety and no conduct fit) never feeds the loop: an
  // imposed patron over misaligned conduct withers here until conduct comes to match.
  // SIGNED (raises the aligned patron, erodes the misaligned) and 0 for a neutral deity.
  const conductFit = pietyMult == null ? 0 : T.CONDUCT_FIT_W * conductFitSignal(deity, L, gov);
  // W-F4 clergy legitimacy drag: a scandalous priesthood erodes the seat's standing,
  // sharpened when the taint is publicly REVEALED, and modulated by the court — a ruler
  // HOSTILE to the patron amplifies the scandal, a synergistic one shields it. EXACTLY 0
  // for an unflawed / trait-neutral / no-religious-faction priesthood ⇒ byte-identical.
  let clergyDrag = 0;
  if (clergy && Number(clergy.weight) > 0) {
    const scandal = clamp01(Number(clergy.taint) + T.CLERGY_REVEALED_SHARPEN * Number(clergy.revealedTaint));
    const courtMod = 1 + T.CLERGY_COURT_AMP * (0.5 - deityRulerFit(deity, L)) * 2;   // hostile ⇒ >1, synergistic ⇒ <1
    clergyDrag = T.CLERGY_SCANDAL_W * scandal * courtMod;
  }
  return clamp01(base + instTerm + synergy + conductFit - stain - clergyDrag);
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
