/**
 * cohesionWeave.js — THE COHESION WEAVE modulation layer (E1a companion).
 *
 * docs/DESIGN_COHESION_WEAVE.md §B (the faith × alignment quadrants) + §C (the
 * structural lenses). These land WITH E1a (design §E: "the quadrant modulator +
 * structural lens table land WITH E1a — they weight its kernel"); the generosity
 * kernel (generosityEV.js) is their FIRST consumer, W-PEACE's mediator scoring their
 * second, W-DOCTRINE's the third.
 *
 * §B — THE FAITH × ALIGNMENT QUADRANTS. Same-patron vs rival-patron × kindred vs
 * opposite alignment = four NAMED postures, ALREADY COMPUTABLE from state the engine
 * has (cultureDistance's faith axis + the alignment-proximity + compatibility reads).
 * The weave makes the quadrant ONE named modulator read consistently everywhere:
 *   - brothers          (same deity + kindred): max bond, generosity flows easiest.
 *   - schism_axis       (same deity + opposite): co-religionists who despise each
 *                        other's ways — generosity is GUILT-DRIVEN but grudging.
 *   - respectable_rival (rival deity + kindred): kin in temperament — generosity runs
 *                        on STRATEGY and history, not warmth.
 *   - natural_enemy     (rival deity + opposite): the gate almost never opens.
 * Plus the CROSS-PRESSURE peacemaker read (a settlement whose faith-brother fights its
 * alignment-kin is TORN — the natural mediator), exposed for W-PEACE.
 *
 * §C — THE STRUCTURAL LENSES (economic base × ruling power). The economic base sets
 * NEEDS / FEARS / WAR STYLE; the ruling power sets WHO DECIDES and HOW (decision tempo
 * + texture, the legitimacy nerve, and the coalition weightings the generosity kernel
 * reads — a merchant seat gives as LOANS, a temple seat gives ALMS, a warlord seat
 * gives only STRATEGY). All lens values derive from EXISTING generation state (design
 * §C: "zero new authored data; one lens table").
 *
 * CONSTITUTIONAL: every modulator is BOUNDED and CENTERED ON 1.0 (1.0 = no signal), so
 * a garbage/absent read is a no-op multiplier — the kernel is unchanged where the weave
 * has nothing to say. PURE + LAZY + ZERO-IMPORT LEAF (no worldPulse import — the
 * adapter extracts faith/alignment/base/archetype from live state and passes primitives,
 * mirroring cultureDistance.js / embattlement.js): chunk-safe, zero first-paint bytes.
 * No Date, no Math.random, no mutation; total on garbage.
 */

// ── §B tuning (documented; retuned in the E1a soak) ───────────────────────────
// Every modulator is a BOUNDED multiplier CENTERED ON 1.0. bond/conscience/gate are
// the generosity-kernel consumers named in §B ("generosity bond/conscience weights").
export const QUADRANT_TUNING = Object.freeze({
  // Alignment kinship threshold: alignmentKinship01 ≥ KINDRED_AT reads KINDRED, below
  // reads OPPOSITE. 0.5 is the neutral midpoint (no-signal alignment reads neither
  // strongly — it lands just at the boundary and is treated as kindred, the charitable
  // default, so an unknown pair is never pushed into "natural enemy" by absence).
  KINDRED_AT: 0.5,
  // The four quadrants' generosity modulators { bond, conscience, gate }:
  //   bond      — scales the relationship BOND term (brothers bind hardest).
  //   conscience— scales the CONSCIENCE/need term (the schism axis gives from guilt).
  //   gate      — scales how readily the §0.1 gate opens (natural enemies rarely qualify).
  BROTHERS: Object.freeze({ bond: 1.3, conscience: 1.15, gate: 1.25 }),
  SCHISM_AXIS: Object.freeze({ bond: 0.85, conscience: 1.2, gate: 0.95 }),
  RESPECTABLE_RIVAL: Object.freeze({ bond: 1.0, conscience: 0.95, gate: 1.0 }),
  NATURAL_ENEMY: Object.freeze({ bond: 0.7, conscience: 0.75, gate: 0.55 }),
});

/**
 * @typedef {'brothers'|'schism_axis'|'respectable_rival'|'natural_enemy'} Quadrant
 */

/**
 * @typedef {Object} QuadrantRead
 * @property {Quadrant} quadrant       the named posture
 * @property {boolean} samePatron      whether the pair share a patron deity
 * @property {boolean} kindred         whether the pair's alignments are kindred
 * @property {{ bond: number, conscience: number, gate: number }} modulators  bounded, centered-on-1.0
 */

/** @param {unknown} v @param {number} fallback @returns {number} */
function finite01(v, fallback) {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : fallback;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/**
 * Classify the faith × alignment quadrant for a pair, and emit the generosity
 * modulators (§B). `samePatron` is the deity-identity read (the adapter derives it
 * from shared patron ref, or falls back to a faith-axis proximity threshold);
 * `alignmentKinship01` is the alignment proximity (0 = opposite … 1 = kindred), from the
 * compatibility overlay or the alignment-axis distance. Pure, total.
 * @param {{ samePatron?: boolean, alignmentKinship01?: number }} [inputs]
 * @returns {QuadrantRead}
 */
export function faithAlignmentQuadrant({ samePatron = false, alignmentKinship01 = 0.5 } = {}) {
  const same = samePatron === true;
  const kindred = finite01(alignmentKinship01, 0.5) >= QUADRANT_TUNING.KINDRED_AT;
  /** @type {Quadrant} */
  let quadrant;
  /** @type {{ bond: number, conscience: number, gate: number }} */
  let modulators;
  if (same && kindred) { quadrant = 'brothers'; modulators = QUADRANT_TUNING.BROTHERS; }
  else if (same && !kindred) { quadrant = 'schism_axis'; modulators = QUADRANT_TUNING.SCHISM_AXIS; }
  else if (!same && kindred) { quadrant = 'respectable_rival'; modulators = QUADRANT_TUNING.RESPECTABLE_RIVAL; }
  else { quadrant = 'natural_enemy'; modulators = QUADRANT_TUNING.NATURAL_ENEMY; }
  return { quadrant, samePatron: same, kindred, modulators: { ...modulators } };
}

/**
 * THE CROSS-PRESSURE PEACEMAKER read (§B): a settlement is TORN when its faith-brother
 * is at war with its alignment-kin — a cross-cutting cleavage that produces a neutral
 * broker. Returns the mediation IMPULSE (0 = not cross-pressured … 1 = maximally torn)
 * for a candidate mediator M relative to belligerents A and B. Exposed for W-PEACE's
 * mediator scoring (design §B / §G.1); E1a ships it tested but unconsumed by the kernel.
 * Pure, total.
 * @param {Object} args
 * @param {QuadrantRead} args.toA   M's quadrant read toward belligerent A
 * @param {QuadrantRead} args.toB   M's quadrant read toward belligerent B
 * @returns {{ crossPressured: boolean, mediationImpulse: number }}
 */
export function crossPressureMediation({ toA, toB }) {
  // Torn when M is bonded to BOTH sides on DIFFERENT cleavages: e.g. a faith-brother of
  // A and an alignment-kin of B (or vice-versa). The impulse peaks when each side is a
  // strong-but-DISTINCT tie (brothers vs respectable_rival), and is zero when M relates
  // to both sides the same way (no cross-cutting cleavage — just picks the closer side).
  const closeA = toA && (toA.quadrant === 'brothers' || toA.quadrant === 'respectable_rival');
  const closeB = toB && (toB.quadrant === 'brothers' || toB.quadrant === 'respectable_rival');
  if (!closeA || !closeB) return { crossPressured: false, mediationImpulse: 0 };
  // The cleavages differ when one tie is faith-led (same patron) and the other is
  // alignment-led (kindred but rival patron) — the political-science cross-cut.
  const faithLedA = !!toA.samePatron;
  const faithLedB = !!toB.samePatron;
  const crossCut = faithLedA !== faithLedB;
  if (!crossCut) return { crossPressured: false, mediationImpulse: 0 };
  return { crossPressured: true, mediationImpulse: 1 };
}

// ── §C tuning — the structural lens table (economic base × ruling power) ───────

/** The five economic bases (design §C), each with its NIGHTMARE and war style. */
export const ECONOMIC_BASES = Object.freeze(['extraction', 'agrarian', 'trade_hub', 'craft', 'mixed']);

/** The ruling-power kinds (design §C), derived from the governing faction archetype. */
export const RULING_POWERS = Object.freeze(['autocrat', 'council', 'theocracy', 'merchant_league', 'criminal', 'mixed']);

/**
 * The economic-base lens (design §C): each base's NEEDS / FEARS / WAR STYLE. The
 * generosity kernel reads `supplyFearMod` (a base whose nightmare is a route cut prices
 * an upstream partner's famine as its own supply risk more heavily). Centered on 1.0.
 * @type {Readonly<Record<string, { fear: string, warStyle: string, supplyFearMod: number }>>}
 */
export const ECONOMIC_BASE_LENS = Object.freeze({
  extraction: { fear: 'mine depletion', warStyle: 'turtle the chokepoints', supplyFearMod: 1.1 },
  agrarian: { fear: 'harvest failure', warStyle: 'seasonal army (the harvest imperative bites)', supplyFearMod: 1.0 },
  trade_hub: { fear: 'route cuts', warStyle: 'route wars; folds to embargoes', supplyFearMod: 1.3 },
  craft: { fear: 'input starvation', warStyle: 'limited; guards its supply', supplyFearMod: 1.2 },
  mixed: { fear: 'compound shock', warStyle: 'balanced', supplyFearMod: 1.0 },
});

/**
 * The ruling-power lens (design §C): WHO DECIDES and HOW. The generosity-relevant terms:
 *   - conscienceMod / strategyMod / leverageMod — the coalition weightings (a temple
 *     seat gives ALMS → conscience up; a merchant seat gives LOANS → leverage up; a
 *     warlord gives only STRATEGY → strategy up, conscience down).
 *   - domesticNerveMod — how sharply the domestic-legitimacy term bites (the legitimacy
 *     nerve: councils fear unrest, lords fear coups, theocracies fear heresy).
 *   - hysteresisWiden — the decision-tempo texture (a council's averaged, sticky
 *     decisions widen the verdict deadband; an autocrat's are fast + high-variance).
 * All *Mod centered on 1.0; hysteresisWiden ≥ 1.0 (a multiplier on the dwell/deadband).
 * @type {Readonly<Record<string, { conscienceMod: number, strategyMod: number, leverageMod: number, domesticNerveMod: number, hysteresisWiden: number, legitimacyNerve: string }>>}
 */
export const RULING_POWER_LENS = Object.freeze({
  autocrat: { conscienceMod: 1.0, strategyMod: 1.1, leverageMod: 1.05, domesticNerveMod: 1.15, hysteresisWiden: 1.0, legitimacyNerve: 'coup' },
  council: { conscienceMod: 1.05, strategyMod: 1.0, leverageMod: 1.0, domesticNerveMod: 1.2, hysteresisWiden: 1.4, legitimacyNerve: 'unrest' },
  theocracy: { conscienceMod: 1.3, strategyMod: 0.9, leverageMod: 0.85, domesticNerveMod: 1.1, hysteresisWiden: 1.1, legitimacyNerve: 'heresy' },
  merchant_league: { conscienceMod: 0.85, strategyMod: 1.05, leverageMod: 1.35, domesticNerveMod: 0.9, hysteresisWiden: 1.0, legitimacyNerve: 'insolvency' },
  criminal: { conscienceMod: 0.7, strategyMod: 1.1, leverageMod: 1.4, domesticNerveMod: 0.95, hysteresisWiden: 1.0, legitimacyNerve: 'betrayal' },
  mixed: { conscienceMod: 1.0, strategyMod: 1.0, leverageMod: 1.0, domesticNerveMod: 1.0, hysteresisWiden: 1.0, legitimacyNerve: 'unrest' },
});

/** Map a governing faction archetype (FACTION_ARCHETYPES.* string) to a ruling power. */
const ARCHETYPE_TO_RULING = Object.freeze({
  noble: 'autocrat', military: 'autocrat', occupation: 'autocrat',
  government: 'council', civic: 'council', labor: 'council',
  religious: 'theocracy', arcane: 'theocracy',
  merchant: 'merchant_league', craft: 'merchant_league',
  criminal: 'criminal',
});

/** Normalize an economic-base string to one of ECONOMIC_BASES (fail-soft to 'mixed'). */
/** @param {string|null|undefined} base @returns {string} */
export function normalizeEconomicBase(base) {
  const b = String(base || '').toLowerCase().replace(/[\s-]+/g, '_');
  if (ECONOMIC_BASES.includes(b)) return b;
  // Tolerant aliases from the generator's economicState vocabulary.
  if (b === 'mining' || b === 'resource') return 'extraction';
  if (b === 'farming' || b === 'agriculture' || b === 'agricultural') return 'agrarian';
  if (b === 'trade' || b === 'commerce' || b === 'entrepot' || b === 'market') return 'trade_hub';
  if (b === 'crafting' || b === 'manufacturing' || b === 'artisan') return 'craft';
  return 'mixed';
}

/** Map a governing archetype to a ruling power (fail-soft to 'mixed'). */
/** @param {string|null|undefined} archetype @returns {string} */
export function rulingPowerFromArchetype(archetype) {
  const key = String(archetype || '').toLowerCase();
  return /** @type {Record<string, string>} */ (ARCHETYPE_TO_RULING)[key] || 'mixed';
}

/**
 * @typedef {Object} StructuralLens
 * @property {string} economicBase   one of ECONOMIC_BASES
 * @property {string} rulingPower    one of RULING_POWERS
 * @property {string} fear           the base's nightmare (receipt fragment)
 * @property {string} warStyle       the base's war posture (receipt fragment)
 * @property {string} legitimacyNerve the ruling power's fear (unrest/coup/heresy/…)
 * @property {number} hysteresisWiden ≥1.0 multiplier on the verdict deadband/dwell
 * @property {{ conscience: number, strategy: number, leverage: number, domesticNerve: number, supplyFear: number }} modulators  bounded, centered-on-1.0
 */

/**
 * The composite structural lens for a settlement (§C): economic base × ruling power →
 * the coalition weightings + decision texture the generosity kernel reads. The adapter
 * passes the derived economic-base string + the governing archetype string (both live
 * reads); this leaf maps them through the two lens tables. Pure, total.
 * @param {{ economicBase?: string|null, governingArchetype?: string|null, rulingPower?: string|null }} [inputs]
 * @returns {StructuralLens}
 */
export function structuralLens({ economicBase, governingArchetype, rulingPower } = {}) {
  const base = normalizeEconomicBase(economicBase);
  const ruling = rulingPower && RULING_POWERS.includes(String(rulingPower))
    ? String(rulingPower)
    : rulingPowerFromArchetype(governingArchetype);
  const el = /** @type {Record<string, { fear: string, warStyle: string, supplyFearMod: number }>} */ (ECONOMIC_BASE_LENS)[base];
  const rl = /** @type {Record<string, { conscienceMod: number, strategyMod: number, leverageMod: number, domesticNerveMod: number, hysteresisWiden: number, legitimacyNerve: string }>} */ (RULING_POWER_LENS)[ruling];
  return {
    economicBase: base,
    rulingPower: ruling,
    fear: el.fear,
    warStyle: el.warStyle,
    legitimacyNerve: rl.legitimacyNerve,
    hysteresisWiden: rl.hysteresisWiden,
    modulators: {
      conscience: rl.conscienceMod,
      strategy: rl.strategyMod,
      leverage: rl.leverageMod,
      domesticNerve: rl.domesticNerveMod,
      supplyFear: el.supplyFearMod,
    },
  };
}
