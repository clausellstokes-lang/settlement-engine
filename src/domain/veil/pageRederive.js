// @ts-check
/**
 * pageRederive.js — THE SHARED PAGE RE-DERIVES WHAT IT DRAWS OF A VALUE THE SHARE WITHHOLDS ON EVERY READ (the seventh
 * chair's VR19 (c), VR33 and VR37 (a), each vetoable by the owner; VEIL-21, R2).
 *
 * THE LAW IT SERVES: a precise figure that could carry a hidden house's term never reaches a non-owner read (VR28 tier
 * 1). The server withholds the defence profile's six scores, its gates, the readiness score, a condition's severity and the
 * compound's figures on EVERY non-owner read (212 :: _gallery_veil_withhold_always; the twin gallerySecondHomes.js ::
 * withholdAlways). Where a non-owner page DRAWS one of them (R2's render-twice measure: the Summary's Overview bars and
 * Foundations chips, the Defense tab's threat rows, the Economics header), the page draws it again FROM THE SERVED
 * DOCUMENT ALONE, by the engine's own function, so it draws what the served town implies and never a hidden house's term:
 *   defenseProfile.scores.*, .readiness.score,  generateDefenseProfile
 *   .economicGates over the served document (its houses, config,
 *                                               served prosperity band, chains and the food record's own months)
 *   economicState.compound.economyOutput        getInstFlags(config, the served houses)
 *   activeConditions[].severity                 VR37: drawn FROM THE BAND, which is served (tier 2): the band's own
 *                                               default severity (activeConditions.js :: defaultSeverityForBand)
 * A value is put back only where the served document lacks it and the object that holds it was served (a grouping that
 * removed the defence profile is never undone); a value the served document cannot decide stays absent (not drawn).
 * The gates (`economicGates`), which the Defense tab's law and guard lines read (tests/components/publicProseEquality.test.jsx,
 * soak1k-3 and -9), are put back whole where the served profile lacks them.
 *
 * THE BLACK MARKET'S CAPTURE (R2-CURE, VEIL-21; the chair's ruling of 04:27 UTC, "cure it by identity"; VR19 (c)):
 *   economicState.safetyProfile.blackMarketCapture   generateSafetyProfile(config, tier, the served houses)
 * withheld on every read since R2, it is drawn by the Economics tab's Shadow Economy block and read by the law's band
 * (causalState.js :: deriveLawOrder), which the Defense tab's guard paragraph and the Foundations row print. The engine's
 * own deriver gives the stored figure on 40 of 40 soak towns' unmarked shares, and with it the law band and the guard
 * paragraph the owner's page prints (docs/chair/2026-11-20/veil/out/v21/r2/cure/). It is put back ONLY where the caller
 * KNOWS the share carries no veil at all (`unveiled`: an unmarked share's own read, src/lib/gallery.js ::
 * sanitizeDossier), so a grouping that shut it (galleryVeil.js 'block:power.criminalUnderside', which leaves no evidence
 * in the data) is never undone: a page that cannot be sure (a marked share, the campaign map's member, which carries no
 * veil record) does not draw it, as before (VR17: where the veil cannot be sure, it withholds).
 *
 * THE CRIME LIST (R3-TELL-8; the eighth chair's ruling (b) of 2026-11-22, THE OTHER WAY, and ruling 88):
 *   economicState.safetyProfile.crimeTypes           settleCrimeLinesToSignal(generateSafetyProfile(config, tier, the
 *                                                    served houses)) over the served seats, houses, tensions and services
 * withheld on every non-owner read of every place since R3-TELL-8 (212 :: _gallery_veil_withhold_always), it is drawn by the
 * Defense tab's crime patterns, the Economics tab's shadow economy and the Defense key's readings. THE ONE READER
 * (rederiveCrimeTypes, below) puts it back on the page's own copy, so every downstream surface reads one derived list, ONLY
 * where the served data PROVES the types' grouping open: the safety profile still carries `criminalInstitutions` as an array
 * (the key the grouping's remover deletes with it, and the generator always writes: 6,528 of 6,528 measured pages, TELL8 1e)
 * and the page model is not marked with the grouping shut. Where it cannot be sure it draws no list (VR17). The import's save
 * calls the same reader (importRederive.js). No seed: the writer's list is the record's on every nothing-hidden reading (TELL8 1c).
 *
 * NOTHING HERE RUNS ON AN OWNER'S OWN RECORD: it is called on a non-owner page's served document alone
 * (src/lib/gallery.js :: fetchPublicDossier, fetchGalleryMap). Pure in its input's values; works in place on the page's
 * own copy and returns it.
 */
import { getInstFlags } from '../../generators/priorityHelpers.js';
import { generateDefenseProfile } from '../../generators/defenseGenerator.js';
import { keepOfRecord } from '../facts/keep.js';
import { defaultSeverityForBand } from '../activeConditions.js';
import { generateSafetyProfile, settleCrimeLinesToSignal } from '../../generators/safetyProfile.js';
import { veilGroupingsOf } from '../display/galleryVeil.js';
import { READINESS_BANDS } from '../../data/bandLadders.js';

/** @typedef {Record<string, unknown>} Doc */

/** @param {unknown} v @returns {v is Doc} */
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** @param {unknown} v @returns {Doc | null} */
const recOf = (v) => (isRec(v) ? v : null);
/** @param {unknown} v @returns {unknown[]} */
const listOf = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} v @returns {v is number} */
const finite = (v) => typeof v === 'number' && Number.isFinite(v);

/** The six scores (VR33): the page draws five on every town (R2's render-twice) and re-derives the sixth with them. */
export const PAGE_DRAWN_SCORES = Object.freeze(['disaster', 'economic', 'internal', 'magical', 'military', 'monster']);
/** The condition bands the engine names (activeConditions.js :: severityBand). */
const BANDS = Object.freeze(['low', 'medium', 'high', 'critical']);

/**
 * VR37 SHARPENED (the chair, 04:50 UTC): the served `readiness.label` (tier 2) owns a band of the readiness ladder
 * (bandLadders.js :: READINESS_BANDS, from its `min` up to the next band's); a re-derived score outside it would contradict
 * the label beside it, so the page draws the label alone there. A label off the ladder owns no band: label alone too.
 * @param {number} score @param {string} label @returns {boolean}
 */
function inLabelBand(score, label) {
  const i = READINESS_BANDS.findIndex((b) => b.label === label);
  return i >= 0 && score >= READINESS_BANDS[i].min && (i === 0 || score < READINESS_BANDS[i - 1].min);
}

/**
 * The defence profile the served document implies (the engine's own generator over it), or null where it cannot say.
 * @param {Doc} s @returns {Doc | null}
 */
function servedDefence(s) {
  const config = recOf(s.config);
  const e = recOf(s.economicState);
  if (!config || !e) return null;
  const food = recOf(e.foodSecurity);
  const months = recOf(food?.foodRecord)?.storageMonths;
  const scratch = {
    ...s,
    economicState: {
      ...e,
      ...(food ? { foodSecurity: { ...food, ...(finite(months) ? { storageMonths: months } : {}) } } : {}),
    },
  };
  try {
    return /** @type {Doc} */ (generateDefenseProfile(scratch, keepOfRecord(/** @type {any} */ (scratch.economicState))));
  } catch {
    return null; // a document the engine cannot read: the page does not draw the figure
  }
}

/** The types' grouping (galleryVeil.js :: GROUPING_REMOVERS). */
const CRIMINAL_STRUCTURE = 'block:defense.criminalStructure';

/**
 * THE ONE READER OF THE CRIME LIST (R3-TELL-8): the list the served document implies, by the engine's own writer, put back
 * on the document in hand (in place), only where the served data proves the types' grouping open and the document holds no
 * list; else nothing is drawn. A document the engine cannot read draws nothing.
 * @template T @param {T} doc
 * @param {{ authoritative?: boolean }} [opts] `authoritative` (the import's save): the list is ALWAYS the reader's, whatever
 *   the document held (the share sends none: it is never asked), and none where the reader draws none
 * @returns {T}
 */
export function rederiveCrimeTypes(doc, { authoritative = false } = {}) {
  if (!isRec(doc)) return doc;
  const s = /** @type {Doc} */ (doc);
  const e = recOf(s.economicState);
  const sp = recOf(e?.safetyProfile);
  const config = recOf(s.config);
  if (!e || !sp) return doc;
  if (authoritative) delete sp.crimeTypes;
  else if ('crimeTypes' in sp) return doc;
  if (!config || !Array.isArray(sp.criminalInstitutions) || veilGroupingsOf(s).includes(CRIMINAL_STRUCTURE)) return doc;
  try {
    const fresh = generateSafetyProfile(config, typeof s.tier === 'string' ? s.tier : undefined, listOf(s.institutions));
    const powers = recOf(s.powerStructure);
    const lists = /** @type {any} */ ({ seats: powers?.factions, estate: s.institutions, tensions: recOf(s.history)?.currentTensions, services: s.availableServices });
    const list = recOf(recOf(settleCrimeLinesToSignal(/** @type {any} */ ({ ...e, safetyProfile: fresh }), lists))?.safetyProfile)?.crimeTypes;
    if (Array.isArray(list)) sp.crimeTypes = list.map((c) => (isRec(c) ? { ...c } : c));
  } catch {
    // a document the engine cannot read: the page draws no list
  }
  return doc;
}

/**
 * The served document with each drawn, withheld-on-every-read value put back from the served document alone (in place).
 * @template T @param {T} doc
 * @param {{ unveiled?: boolean }} [opts] `unveiled`: the caller KNOWS the share carries no veil (an unmarked share's own
 *   read); only then is the black market's capture put back
 * @returns {T}
 */
export function rederiveForPage(doc, { unveiled = false } = {}) {
  if (!isRec(doc)) return doc;
  const s = /** @type {Doc} */ (doc);
  const dp = recOf(s.defenseProfile);
  const scores = recOf(dp?.scores);
  const readiness = recOf(dp?.readiness);
  const needScores = !!scores && PAGE_DRAWN_SCORES.some((k) => !(k in scores));
  const needReadiness = !!readiness && !('score' in readiness);
  const needGates = !!dp && !('economicGates' in dp);
  if (needScores || needReadiness || needGates) {
    const d = servedDefence(s);
    const ds = recOf(d?.scores);
    if (scores && ds) for (const k of PAGE_DRAWN_SCORES) if (!(k in scores) && finite(ds[k])) scores[k] = ds[k];
    const dr = recOf(d?.readiness)?.score;
    if (readiness && needReadiness && finite(dr) && (typeof readiness.label !== 'string' || inLabelBand(dr, readiness.label))) readiness.score = dr;
    const dg = recOf(d?.economicGates);
    if (dp && needGates && dg) dp.economicGates = dg;
  }
  const compound = recOf(recOf(s.economicState)?.compound);
  const config = recOf(s.config);
  if (compound && config && !('economyOutput' in compound)) {
    const v = /** @type {Doc} */ (getInstFlags(config, listOf(s.institutions))).economyOutput;
    if (finite(v)) compound.economyOutput = v;
  }
  const sp = recOf(recOf(s.economicState)?.safetyProfile);
  if (unveiled && sp && config && !('blackMarketCapture' in sp)) {
    try {
      const v = recOf(generateSafetyProfile(config, typeof s.tier === 'string' ? s.tier : undefined, listOf(s.institutions)))?.blackMarketCapture;
      if (finite(v)) sp.blackMarketCapture = v;
    } catch {
      // a document the engine cannot read: the page does not draw the figure
    }
  }
  rederiveCrimeTypes(s);
  for (const c of listOf(s.activeConditions)) {
    const cond = recOf(c);
    if (cond && !('severity' in cond) && typeof cond.severityBand === 'string' && BANDS.includes(cond.severityBand)) {
      cond.severity = defaultSeverityForBand(cond.severityBand);
    }
  }
  return doc;
}
