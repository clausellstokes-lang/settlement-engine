// @ts-check
/**
 * importRederive.js — THE IMPORTER'S SAVE RE-DERIVES WHAT THE SHARE WITHHOLDS (the seventh chair's ruling VR25,
 * 2026-11-20 01:15 UTC, vetoable by the owner; VR16 condition (2); VEIL-20, item 3a).
 *
 * THE LAW IT SERVES: an import never carries what a non-owner page withholds. The share withholds, on every non-owner
 * read, fields no shared page draws (VR16) and the precise part of a value every page draws (VR19); the importer's own
 * app reads some of them, and with them absent it drew wrong values (R2-IMPORT-MEASURE.md, outcome (c): a default
 * readiness of 50, the hamlet floor for every district, ": Name ·" crisis rows, a wrong legitimacy cause). So the
 * import's save puts each such field back FROM THE SERVED DOCUMENT ALONE, with the engine's own function: the importer
 * gets what the served town implies, never a hidden house's term. Where no served field decides a value, the field
 * reads as an ordinary "not known": it is left out, and so is any row that would draw it as a blank.
 *
 * HOW "NOT KNOWN" IS DECIDED: an input the served document cannot give (a Subsistence town's prosperity, which took a
 * birth draw) is tried at every value it could take; a value derived from it is kept only where every try agrees.
 * The prosperity band itself is served as stored (VR28, tier 2): where the document carries it, it is kept and is the
 * one value tried; the re-derivation runs only where it is absent.
 * A document with no config (the floor every share keeps) decides nothing: every field below is left out.
 *
 * Measured first (docs/chair/2026-11-20/veil/measure/vr25/derivers.probe.jsx; 72 born towns, the default veil, and
 * 36 with magic off): each deriver reads no withheld path and equals the stored value on the full town, and on every
 * town with nothing hidden equals the stored value from the served document (prosperity: where its base is not a
 * Subsistence base).
 *
 * NOTHING HERE RUNS ON AN OWNER'S OWN RECORD: it is called by the gallery import alone.
 */
import { deepClone } from '../clone.js';
import { getInstFlags } from '../../generators/priorityHelpers.js';
import { defenceExactOf, generateDefenseProfile } from '../../generators/defenseGenerator.js';
import { keepOfRecord } from '../facts/keep.js';
import { promoteStressorsToConditions } from '../conditionPromotion.js';
import { computePublicLegitimacy } from '../../generators/factionDynamics.js';
import { generateSpatialLayout } from '../../generators/spatialGenerator.js';
import { computeBaseProsperity, deriveProsperityLabel } from '../../generators/economy/prosperity.js';
import { rederiveCrimeTypes, rederiveRecentConflict, rederiveStanding } from './pageRederive.js';

/** @typedef {Record<string, unknown>} Doc */

/** The compound's figures the save re-derives (its `inst` flags are the served houses' own and stay as served). */
export const REDERIVED_COMPOUND_KEYS = Object.freeze(['criminalEffective', 'criminalPreStress', 'militaryEffective', 'economyOutput', 'religionInfluence', 'magicInfluence', 'raw']);

/** The defence scores the share withholds on every read (VR33; 212 :: _gallery_veil_withhold_always), re-derived at the save. */
export const REDERIVED_DEFENCE_SCORES = Object.freeze(['disaster', 'economic', 'internal', 'magical', 'military', 'monster']);

/** The labels a Subsistence base can end at: its birth draw picks one, capped at Poor (prosperity.js :: labelFromBase). */
const SUBSISTENCE_OUTCOMES = Object.freeze(['Struggling', 'Poor']);

/** @param {unknown} v @returns {v is Doc} */
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** The record at `v`, or null. @param {unknown} v @returns {Doc | null} */
const recOf = (v) => (isRec(v) ? v : null);
/** @param {unknown[]} xs */
const same = (xs) => xs.length > 0 && xs.every((x) => JSON.stringify(x) === JSON.stringify(xs[0]));
/** @param {unknown} v @returns {unknown[]} */
const listOf = (v) => (Array.isArray(v) ? v : []);

/**
 * The prosperity labels the served document allows: one where it decides the label, the Subsistence outcomes where the
 * label took the birth draw.
 * @param {Doc} s @param {Doc} config @returns {string[]}
 */
export function servedProsperityOutcomes(s, config) {
  const e = recOf(s.economicState);
  const houses = listOf(s.institutions);
  const names = houses.map((i) => recOf(i)?.name);
  const base = computeBaseProsperity(s.tier, config.tradeRouteAccess, houses, config, names, listOf(e?.incomeSources), /** @type {null} */ (/** @type {unknown} */ (recOf(e?.foodSecurity)))).label;
  return base === 'Subsistence' ? [...SUBSISTENCE_OUTCOMES] : [deriveProsperityLabel(base, config, houses)];
}

/**
 * Run `fn` on the document at each prosperity outcome; the answer where all agree, else `undefined`.
 * @template T @param {Doc} s @param {string[]} outcomes @param {(r: Doc) => T} fn @returns {T | undefined}
 */
function underEachOutcome(s, outcomes, fn) {
  const answers = outcomes.map((p) => fn({ ...s, economicState: { ...(recOf(s.economicState) ?? {}), prosperity: p } }));
  return same(answers) ? answers[0] : undefined;
}

/** The crisis casts of both copies, either shape (one crisis or a list). @param {Doc} s @returns {Doc[]} */
function castsOf(s) {
  /** @type {Doc[]} */ const out = [];
  for (const k of ['stress', 'stressors']) {
    for (const x of Array.isArray(s[k]) ? s[k] : [s[k]]) {
      const cast = recOf(recOf(x)?.cast);
      if (cast) out.push(cast);
    }
  }
  return out;
}

/** The crisis cast's rows are not known on the importer's record (step 9). @param {Doc} s */
function castsNotKnown(s) {
  for (const cast of castsOf(s)) for (const key of ['roles', 'absent', 'stakes']) if (Object.hasOwn(cast, key)) cast[key] = [];
}

/**
 * The served document with every field VR25 names re-derived from it, or left out where it cannot be. Pure: the input
 * is not changed.
 * @template T
 * @param {T} served the share's document as the import read received it
 * @returns {T}
 */
export function rederiveServed(served) {
  return isRec(served) ? /** @type {T} */ (/** @type {unknown} */ (rederiveInPlace(/** @type {Doc} */ (deepClone(served))))) : served;
}

/**
 * The same, on the document itself (it is changed and returned): what `rederiveServed` runs on its copy. Exported so a
 * test can run it under a recorder of every read.
 * @param {Doc} s @returns {Doc}
 */
export function rederiveInPlace(s) {
  const config = recOf(s.config);
  const e = recOf(s.economicState);
  const sp = recOf(e?.safetyProfile);
  const food = recOf(e?.foodSecurity);
  const dp = recOf(s.defenseProfile);
  const readiness = recOf(dp?.readiness);
  const scores = recOf(dp?.scores);
  const legitimacy = recOf(recOf(s.powerStructure)?.publicLegitimacy);
  const layout = recOf(s.spatialLayout);
  if (!config) {
    if (e) delete e.compound; // the served prosperity band stays as served (VR28; step 4)
    if (sp) { delete sp.compound; delete sp.safetyRatio; }
    if (food) delete food.storageMonths;
    if (readiness) delete readiness.score;
    if (scores) for (const k of REDERIVED_DEFENCE_SCORES) delete scores[k];
    if (dp) delete dp.economicGates;
    if (legitimacy) delete legitimacy.breakdown;
    if (layout) delete layout.quarters;
    if (Array.isArray(s.activeConditions)) s.activeConditions = [];
    castsNotKnown(s);
    rederiveStanding(s, { authoritative: true }); // 12 (below): the standing's cut reads the served roster alone, no config
    return s;
  }

  // 1. THE COMPOUND, both copies: the engine's own reading over the served config and houses.
  const flags = /** @type {Doc} */ (getInstFlags(config, listOf(s.institutions)));
  /** @returns {Doc} */
  const figures = () => Object.fromEntries(REDERIVED_COMPOUND_KEYS.map((k) => [k, deepClone(flags[k])]));
  if (e) e.compound = { ...(recOf(e.compound) ?? {}), ...figures() };
  if (sp) {
    sp.compound = { ...(recOf(sp.compound) ?? {}), ...figures() };
    // 2. THE SAFETY RATIO, from that compound (safetyProfile.js :: generateSafetyProfile's own rule).
    sp.safetyRatio = Math.round((Number(flags.militaryEffective) / Math.max(8, Number(flags.criminalEffective))) * 10) / 10;
  }

  // 3. THE STORES: the food record's own months, which the record keeps beside the stores' figure.
  if (food) {
    const months = recOf(food.foodRecord)?.storageMonths;
    if (typeof months === 'number' && Number.isFinite(months)) food.storageMonths = months;
    else delete food.storageMonths;
  }

  // 4. PROSPERITY: the band is SERVED as stored (VR28, tier 2): kept where the served document carries it, and then
  //    the one outcome every step below reads; re-derived only where it is absent (else not known, as above).
  const servedBand = e && typeof e.prosperity === 'string' && e.prosperity !== '' ? e.prosperity : null;
  const outcomes = servedBand !== null ? [servedBand] : servedProsperityOutcomes(s, config);
  if (e) {
    if (outcomes.length === 1) e.prosperity = outcomes[0];
    else delete e.prosperity;
  }

  // 5. THE READINESS SCORE: the defence arithmetic over the served document, the page's whole point.
  if (readiness) {
    const score = underEachOutcome(s, outcomes, (r) => Math.round(Math.round(Number(defenceExactOf(r).readiness) * 100) / 100));
    if (typeof score === 'number' && Number.isFinite(score)) readiness.score = score;
    else delete readiness.score;
  }

  // 5b. THE DEFENCE SCORES AND GATES (VEIL-21, R2; VR33): the defence profile the engine generates over the served
  //     document (the food record's own months, as step 3 keeps them); a score or gate the served document does not decide
  //     (where the prosperity outcomes disagree) is not known and is left out.
  if (dp) {
    const prof = underEachOutcome(s, outcomes, (r) => {
      const d = /** @type {Doc} */ (generateDefenseProfile(r, keepOfRecord(/** @type {any} */ (r.economicState))));
      return { scores: Object.fromEntries(REDERIVED_DEFENCE_SCORES.map((k) => [k, recOf(d.scores)?.[k]])), gates: d.economicGates };
    });
    if (scores) {
      for (const k of REDERIVED_DEFENCE_SCORES) {
        const v = prof?.scores[k];
        if (typeof v === 'number' && Number.isFinite(v)) scores[k] = v;
        else delete scores[k];
      }
    }
    if (prof && isRec(prof.gates)) dp.economicGates = prof.gates;
    else delete dp.economicGates;
  }

  // 6. THE CONDITIONS' SEVERITY: each condition as its stressor promotes it on the served document; a condition no
  //    served stressor promotes, or whose severity the served document does not decide, is not known and is left out
  //    (its band is recomputed from the severity by deriveActiveCondition).
  if (Array.isArray(s.activeConditions)) {
    const by = underEachOutcome(s, outcomes, (r) => Object.fromEntries(listOf(promoteStressorsToConditions({ ...r, activeConditions: [] }).activeConditions)
      .map((c) => [String(recOf(c)?.archetype), recOf(c)?.severity])));
    s.activeConditions = listOf(s.activeConditions).flatMap((c) => {
      const cond = recOf(c);
      const sev = cond && by ? by[String(cond.archetype)] : undefined;
      if (!cond || typeof sev !== 'number' || !Number.isFinite(sev)) return [];
      return [{ ...Object.fromEntries(Object.entries(cond).filter(([k]) => k !== 'severityBand')), severity: sev }];
    });
  }

  // 7. THE LEGITIMACY BREAKDOWN: each withheld cause from the served labels; a cause the served document does not
  //    decide is not known and is left out.
  if (legitimacy) {
    const b = recOf(legitimacy.breakdown) ?? {};
    legitimacy.breakdown = b;
    for (const key of ['prosperity', 'safety', 'defense']) {
      const v = underEachOutcome(s, outcomes, (r) => {
        const label = recOf(recOf(r.defenseProfile)?.readiness)?.label;
        return /** @type {Doc} */ (computePublicLegitimacy(recOf(r.economicState) ?? {}, typeof label === 'string' ? label : '', String(r.tier)).breakdown)[key];
      });
      if (typeof v === 'number' && Number.isFinite(v)) b[key] = v;
      else delete b[key];
    }
  }

  // 8. THE QUARTERS: the town plan over the served houses (spatialGenerator.js, draw-free).
  if (layout) layout.quarters = generateSpatialLayout(String(s.tier), listOf(s.institutions), /** @type {string} */ (config.tradeRouteAccess), /** @type {string | undefined} */ (config.terrainType)).quarters;

  // 9. THE CRISIS CAST: no served field gives a role or a reason (the occasional roles take the seed, which never
  //    ships), and the share withholds them on every read: the cast's roles, absences and stakes are not known on the
  //    importer's record, and are left out whole (a row with a name and no role would draw as a blank).
  castsNotKnown(s);

  // 10. THE CRIME LIST (R3-TELL-8, ruling (b)): withheld on every read, re-derived by the page's ONE reader over the served
  //     document (pageRederive.js :: rederiveCrimeTypes), only where the served data proves its grouping open; else left out.
  //     AUTHORITATIVE: the saved list is the reader's whatever the document held (the share sends none; it is never asked).
  rederiveCrimeTypes(s, { authoritative: true });

  // 11. THE RECENT-CONFLICT SENTENCE (R5-RECENT; E92 (2), E93): withheld on every read, re-derived by the page's ONE reader
  //     over the served document (pageRederive.js :: rederiveRecentConflict, the engine's own writer); else left out.
  //     AUTHORITATIVE: the saved sentence is the reader's whatever the document held. Its pressureSentence copy, withheld
  //     where it equalled the sentence, is not re-filled (E97 (1)).
  rederiveRecentConflict(s, { authoritative: true });

  // 12. THE STANDING (R5-DESC; E115, E121, E126, E129; RULING V15: THE CUT ALONE): cut on every read, and cut again by the
  //     page's ONE reader (pageRederive.js :: rederiveStanding, which writes no standing) on each SERVED ROSTER row's desc,
  //     so the saved copy holds the served base alone. AUTHORITATIVE: a row the read hides keeps no desc, whatever the
  //     document held.
  rederiveStanding(s, { authoritative: true });
  return s;
}
