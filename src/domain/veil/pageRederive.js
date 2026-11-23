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
 * THE RECENT-CONFLICT SENTENCE (R5-RECENT; the chair's rulings E92 (1)-(2), E93 and E97 (1) of 2026-11-22, THE OTHER WAY):
 *   powerStructure.recentConflict                    generatePowerStructure(tier, the served economy, the adversarial
 *                                                    neighbour, config, the served houses, { the served stress entries })
 *                                                    .recentConflict: the engine's own writer (buildGovernanceLabels)
 * withheld on every non-owner read of every place since R5-RECENT (212 :: _gallery_veil_withhold_always, the twin
 * galleryWithholdAlways.js :: withholdAlways), it is drawn by the Summary's danger line, the governance account's vignette,
 * the stability lens and the guard line. THE ONE READER (rederiveRecentConflict, below: reader B, E93) puts it back on the
 * page's own copy FROM THE SERVED DOCUMENT ALONE, so it names only what the served town implies: a power the read withholds
 * is never there to be named. Where the stored sentence was a TRANSFER's (rulingPower.js :: transferRulingPower), the page
 * prints the baseline sentence over the served powers (E93 (3), pre-ruled). A page whose record holds a house a coherence
 * repair added after the power step reads that house as born (E93 (1): listed by name in the plant's fidelity arm). The
 * top-level `pressureSentence`, withheld wherever it copied the sentence, is NOT re-filled (E97 (1)). The import's save
 * calls the same reader (importRederive.js), authoritative.
 *
 * THE PAGE READERS' ROSTER (R5-DESC; the chair's E128 (b), VEIL-34's review (H), vetoable by the owner): A PAGE READER PRINTS
 * NO POWER'S NAME AND NO KIND WORD OF A POWER THE SERVED ROSTER DOES NOT CARRY. The served roster (servedRosterOf, below) is
 * `powerStructure.factions` with every row the read hides OUT, as if never there: a row flagged `hidden` (the DM door serves
 * it stamped) and a row under the projection's mask (publicSafe.js :: HIDDEN_POWER_MASK, act T's owner-hidden taker). Every
 * reader here reads that roster: the crime list's seats; THE STANDING (below); and the recent-conflict sentence, whose writer
 * (generatePowerStructure) builds its OWN roster from the served houses and config and may re-create a power the read
 * withholds (a power the owner hid by hand: R5DESC-MEASURE, 930 of 1,410 hiding pages). What it builds is CUT to the served
 * roster's rows before its sentence is drawn: the writer's rows the served roster does not carry, and the rows the read
 * hides, are cut, and a sentence that names a cut power by the lane's fold (gallerySecondHomes.js :: buildNameSearch) is NOT
 * DRAWN (toward withholding, never a mask). The writer's KIND reads of its roster (a noble power, a religious power of
 * weight) are held by the differential, not by a cut: no page can tell a row the player view dropped (an owner's hide)
 * from a row the density law trimmed after the power step, and the writer re-creates both alike on the place where the
 * power was never there; cutting the writer's reads by every unserved row withheld the sentence on 7 of the 21
 * nothing-hidden births of R5C2's slice measured (r5c2-m3-<size>-0..5; R5D-PAGE-A's hand-back: the seat's to rule).
 *
 * THE STANDING (R5-DESC; the chair's E115, E116, E121, E126, E129, each vetoable by the owner):
 *   powerStructure.factions[].desc's standing tail    rosterText.js :: standingRosterOf + factionStanding.js ::
 *                                                    annotateFactionStanding over the SERVED ROSTER (the served houses'
 *                                                    force, the served seat's legitimacy), appended to the served base
 * cut on every non-owner read of every place (212 :: _gallery_veil_withhold_always, by ONE table, STANDING_FORMS; the twin
 * galleryWithholdAlways.js :: standingBase), it is drawn by every power card. THE ONE READER (rederiveStanding, below: reader
 * S, R5DESC-MEASURE's) writes each served power's standing again by the engine's own writer over the served roster, the cut
 * rows out, and appends it to the served base. The served desc is cut again by the twin's table first (a base is its own
 * cut), so the reader is idempotent and a server that still sends the tail cannot double it. A cut row's own desc is
 * served by neither engine; the import's save (importRederive.js, authoritative) drops one whatever the document held. On
 * a nothing-hidden page it reproduces the stored desc but for one class, LISTED by the fidelity arm
 * (tests/security/galleryVeilDesc.pglite.test.js): a stored standing carrying the seat-contest line
 * (factionStanding.js :: SEAT_CONTESTED_STANDING, which reads the seat's legitimacy after the last standing write).
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
import { generatePowerStructure } from '../../generators/power/rulingStructure.js';
import { isAdversarialRelationship } from '../relationships/canonicalRelationship.js';
import { deepClone } from '../clone.js';
import { standingRosterOf, standingForceOf } from '../../generators/power/rosterText.js';
import { annotateFactionStanding } from '../../generators/power/factionStanding.js';
import { HIDDEN_POWER_MASK } from '../display/publicSafe.js';
import { standingBase } from '../display/galleryWithholdAlways.js';
import { buildNameSearch } from '../display/gallerySecondHomes.js';

/** @typedef {Record<string, unknown>} Doc */

/** @param {unknown} v @returns {v is Doc} */
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** @param {unknown} v @returns {Doc | null} */
const recOf = (v) => (isRec(v) ? v : null);
/** @param {unknown} v @returns {unknown[]} */
const listOf = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} v @returns {v is number} */
const finite = (v) => typeof v === 'number' && Number.isFinite(v);

/** A row the read hides: flagged `hidden` (the DM door serves it stamped) or under the projection's mask. @param {Doc} f */
const isCutRow = (f) => f.hidden === true || f.faction === HIDDEN_POWER_MASK || f.name === HIDDEN_POWER_MASK;
/** A power row's name. @param {unknown} f @returns {string} */
const powerNameOf = (f) => (isRec(f) ? String(f.faction ?? f.name ?? '') : '');

/**
 * THE SERVED ROSTER (E128 (b)): the served `powerStructure.factions` rows a page reader may read, every row the read hides
 * OUT (flagged `hidden`, or under the projection's mask), as if never there. The rows themselves, not copies.
 * @param {unknown} doc @returns {Doc[]}
 */
export function servedRosterOf(doc) {
  const ps = recOf(recOf(doc)?.powerStructure);
  return listOf(ps?.factions).filter(isRec).filter((f) => powerNameOf(f) !== '' && !isCutRow(f));
}

/**
 * Whether a sentence the writer drew over ITS roster names only the served roster (E128 (b)): the writer's rows the served
 * roster does not carry, and the served rows the read hides (stamped or masked), are CUT; the sentence holds where it names
 * no cut power by the lane's fold (gallerySecondHomes.js :: buildNameSearch, the served powers' and houses' names open).
 * @param {string} sentence @param {Doc} fresh the writer's power structure @param {Doc} s the served document @returns {boolean}
 */
function holdsOverServed(sentence, fresh, s) {
  const served = servedRosterOf(s);
  const servedNames = new Set(served.map(powerNameOf));
  const marked = listOf(recOf(s.powerStructure)?.factions).filter((f) => isRec(f) && isCutRow(f)).map(powerNameOf).filter((n) => n && n !== HIDDEN_POWER_MASK);
  const cut = new Set([...listOf(fresh.factions).filter(isRec).map(powerNameOf).filter((n) => n && !servedNames.has(n)), ...marked]);
  if (!cut.size) return true;
  const opens = [...servedNames, ...listOf(s.institutions).filter(isRec).map((h) => h.name)].filter((n) => typeof n === 'string' && n && !cut.has(n));
  const search = buildNameSearch([...cut], opens);
  return !search || !search.hit(sentence);
}

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
    const powers = recOf(s.powerStructure); // E128 (b): the seats are the served roster, every row the read hides out
    const lists = /** @type {any} */ ({ seats: powers ? servedRosterOf(s) : undefined, estate: s.institutions, tensions: recOf(s.history)?.currentTensions, services: s.availableServices });
    const list = recOf(recOf(settleCrimeLinesToSignal(/** @type {any} */ ({ ...e, safetyProfile: fresh }), lists))?.safetyProfile)?.crimeTypes;
    if (Array.isArray(list)) sp.crimeTypes = list.map((c) => (isRec(c) ? { ...c } : c));
  } catch {
    // a document the engine cannot read: the page draws no list
  }
  return doc;
}

/**
 * THE ONE READER OF THE RECENT-CONFLICT SENTENCE (R5-RECENT, reader B): the sentence the served document implies, by the
 * engine's own writer over the served tier, economy, neighbour, config, houses and stress entries (on copies: the writer is
 * handed nothing of the page's own), put back on the document in hand (in place) where its power structure was served and
 * holds no sentence. A document the engine cannot read, or one with no config, draws nothing. It never names
 * `pressureSentence` (E97 (1)).
 * @template T @param {T} doc
 * @param {{ authoritative?: boolean }} [opts] `authoritative` (the import's save): the sentence is ALWAYS the reader's,
 *   whatever the document held (the share sends none), and none where the reader draws none
 * @returns {T}
 */
export function rederiveRecentConflict(doc, { authoritative = false } = {}) {
  if (!isRec(doc)) return doc;
  const s = /** @type {Doc} */ (doc);
  const ps = recOf(s.powerStructure);
  if (!ps) return doc;
  if (authoritative) delete ps.recentConflict;
  else if ('recentConflict' in ps) return doc;
  const config = recOf(s.config);
  if (!config) return doc;
  try {
    const entries = listOf(s.stressors).length ? listOf(s.stressors) : isRec(s.stress) ? [s.stress] : listOf(s.stress);
    const nb = s.neighborRelationship ?? config.neighborRelationship;
    const neighbour = isRec(nb) && typeof nb.relationshipType === 'string' && isAdversarialRelationship(nb.relationshipType) ? nb : null;
    const projection = { stressEntries: deepClone(entries) };
    const fresh = generatePowerStructure(s.tier, deepClone(recOf(s.economicState) ?? {}), deepClone(neighbour), deepClone(config),
      deepClone(listOf(s.institutions).filter(isRec)), projection);
    const v = recOf(fresh)?.recentConflict;
    // E128 (b): the writer's roster CUT to the served roster's rows; a sentence that still needs a cut power is not drawn
    if (typeof v === 'string' && holdsOverServed(v, /** @type {Doc} */ (fresh), s)) ps.recentConflict = v;
  } catch {
    // a document the engine cannot read: the page draws no sentence
  }
  return doc;
}

/**
 * THE ONE READER OF THE STANDING (R5-DESC, reader S): each served power's standing written again by the engine's own writer
 * (rosterText.js :: standingRosterOf, factionStanding.js :: annotateFactionStanding, as rosterText.js :: standingsOf calls
 * it) over the SERVED ROSTER (servedRosterOf: every row the read hides out), with the served houses' force and the served
 * seat's legitimacy, and appended to each served row's base (its served desc as the one table cuts it:
 * galleryWithholdAlways.js :: standingBase, so a desc already re-derived, or sent whole, is never doubled). In place. A row
 * with no desc is left so; where the writer cannot read the roster the base is drawn alone.
 * @template T @param {T} doc
 * @param {{ authoritative?: boolean }} [opts] `authoritative` (the import's save): a row the read hides keeps no desc,
 *   whatever the document held
 * @returns {T}
 */
export function rederiveStanding(doc, { authoritative = false } = {}) {
  if (!isRec(doc)) return doc;
  const s = /** @type {Doc} */ (doc);
  const ps = recOf(s.powerStructure);
  if (!ps || !Array.isArray(ps.factions)) return doc;
  if (authoritative) for (const f of ps.factions) if (isRec(f) && isCutRow(f)) delete f.desc;
  const roster = servedRosterOf(s);
  /** @type {Map<string, string> | null} */ let standings;
  try {
    const seats = standingRosterOf(roster).map((f) => ({ ...f, desc: '' }));
    annotateFactionStanding(seats, standingForceOf(s.institutions), { publicLegitimacy: ps.publicLegitimacy });
    standings = new Map(seats.map((f) => [f.faction, String(f.desc || '')]));
  } catch {
    standings = null; // a roster the engine cannot read: the page draws the base alone
  }
  for (const f of roster) {
    if (typeof f.desc !== 'string') continue;
    const base = standingBase(f.desc);
    const tail = standings?.get(String(f.faction || '')) ?? '';
    f.desc = base && tail ? `${base} ${tail}` : (base || tail);
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
  rederiveRecentConflict(s);
  rederiveStanding(s);
  for (const c of listOf(s.activeConditions)) {
    const cond = recOf(c);
    if (cond && !('severity' in cond) && typeof cond.severityBand === 'string' && BANDS.includes(cond.severityBand)) {
      cond.severity = defaultSeverityForBand(cond.severityBand);
    }
  }
  return doc;
}
