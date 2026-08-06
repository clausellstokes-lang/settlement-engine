/**
 * domain/display/treatyDocument.js — THE TREATY AS A DOCUMENT (the crier's voice
 * for peace, DESIGN_PEACE_ENGINE.md §13 legibility). A pure DISPLAY read-model,
 * cut from the same cloth as the newsVoice sidecar: it READS the structured
 * treaty document (peaceTerms.treatyDocument — ledger facts only) and dresses each
 * term's compliance in a short, speakable, register-appropriate HOUSE-VOICE line
 * a herald would proclaim ("the tribute is paid, but grudgingly; the granaries
 * grumble"). It is byte-inert to the engine:
 *
 *   • It NEVER mutates state — it reads the document and returns strings.
 *   • It is imported ONLY by the lazy treaty panels (TreatyPanel + the dossier's
 *     war/faith tab), so it rides the lazy chunk and adds ZERO first-paint bytes.
 *     It must NEVER be imported by generation or the world-pulse kernel
 *     (SAME-SEED / GOLDEN laws); the engine modules (peaceTerms/peaceReasons) must
 *     never import THIS.
 *   • THE INSTITUTIONCARD HONESTY GATE: it renders only what the ledger holds. The
 *     strain line is a fixed register phrasing keyed on the term's actual
 *     complianceState — it never invents a fact the treaty does not carry.
 *
 * The voice is diegetic and settlement-AGNOSTIC: it says "the tribute", "the
 * garrison", "the compelled banner" — never a place name (the panel already shows
 * the party pills), keeping the module a pure (document) → lines.
 */

import { treatyDocument, treatyDocumentsForSettlement, treatyLedgerOf, termLabel } from '../worldPulse/peaceTerms.js';
// GR-0 — THE LONGEVITY VOICE AND THE DM CHIP. Both draw their sentence from the authored
// GRAMMAR corpus rather than from a table minted here, because the annex already carries
// the angle palette and a second spelling of these lines would drift from it. The chip is
// the ONLY read in this module that touches ground truth, and it is fail-closed: without
// `includeGroundTruth` it returns null before it reads a single term.
import { grammarReceipt, grammarSlotRoles } from '../worldPulse/grammarNews.js';
import { treatyAgeBandWord, treatyAgeClass } from '../worldPulse/treatyLifecycleVoice.js';
// THE ONE ORIENTATION READER (CR-WR10-G), and it is load-bearing here rather than tidy:
// the GRAMMAR pools bind their party slots to the OBLIGATION axis (who owes, who is
// owed), which on a war settlement matches the document's receiver/giver pair and on a
// WR-10 sale is its exact MIRROR — the buyer receives the holding and still pays. Reading
// the document's victorName/loserName here would put the wrong court on every sale chip.
import { treatyOrientationOf } from '../worldPulse/treatyOrientation.js';

/**
 * THE HOUSE-VOICE COMPLIANCE TABLE — VOICE[family][state] is a speakable line for
 * a term of that family in that compliance state. Every (family × honored |
 * strained | defaulted) is authored; the walker test guards totality + register
 * (settlement-agnostic, ends in terminal punctuation, no template tokens). The
 * families are peaceTerms.TERM_CATALOG's §13 stacking axes.
 * @type {Readonly<Record<string, Readonly<Record<'honored'|'strained'|'defaulted', string>>>>}
 */
export const TREATY_COMPLIANCE_VOICE = Object.freeze({
  economic: Object.freeze({
    honored: 'The tribute is paid on time, the wagons rolling as the treaty promised.',
    strained: 'The tribute is paid, but grudgingly — the granaries grumble and the wagons run late.',
    defaulted: 'The promised wagons no longer come; the tribute has stopped, and the oath lies broken here.',
  }),
  relational: Object.freeze({
    honored: 'The compelled banner still answers the muster, if without love.',
    strained: 'The compelled banner answers slowly now, and the ranks mutter of desertion.',
    defaulted: 'The compelled banner has turned away; the forced allyship is renounced.',
  }),
  security: Object.freeze({
    honored: 'The cap on arms holds; no muster gathers where none is allowed.',
    strained: 'The cap on arms frays; drills are held quietly, just past the letter of the terms.',
    defaulted: 'The cap on arms is thrown off, and the forbidden muster gathers in the open.',
  }),
  territorial: Object.freeze({
    honored: 'The garrison keeps the walls without incident — resented, but unremoved.',
    strained: 'The garrison keeps the walls uneasily; the townsfolk chafe and stones are thrown.',
    defaulted: 'The garrison is besieged in the very town it holds; the occupation is repudiated.',
  }),
  political: Object.freeze({
    honored: 'The installed seat still sits, propped and precarious as the day it was set.',
    strained: 'The installed seat wavers; its writ runs thin beyond the palace gate.',
    defaulted: 'The installed seat is cast down, and the strings that held it are cut.',
  }),
  informational: Object.freeze({
    honored: 'The court stays open to watching eyes, as the clause requires.',
    strained: 'The openness of the court narrows; the observers see less than they are owed.',
    defaulted: 'The court has closed its doors, and the disclosure clause is dead.',
  }),
  sovereignty: Object.freeze({
    honored: 'No foreign banner marches on the other\'s succession; the pledge of non-intervention holds.',
    strained: 'Foreign coin stirs beneath the other\'s contests again; the non-intervention pledge frays at its edges.',
    defaulted: 'An army crosses into the other\'s internal quarrel; the pledge of non-intervention lies broken.',
  }),
  // WR-10 (amendment S). The conveyance's own family, so it gets its own voice rather
  // than the floor — a town changing hands is the loudest thing a treaty can say, and the
  // strain register is the sold settlement's, not the signatories': the people did not
  // move, only the banner over them, and that is exactly where this term frays.
  sovereignty_transfer: Object.freeze({
    honored: 'The conveyed town answers to its new banner; the old lord\'s writ has withdrawn as the deed required.',
    strained: 'The conveyed town answers its new banner slowly, and the seller\'s old stewards have not all gone home.',
    defaulted: 'The conveyed town has thrown off the banner it was sold under, and the deed is waste parchment.',
  }),
  // GR-3 — the three families the peacetime catalog gained. The register is the same one
  // every row above keeps: settlement-agnostic, diegetic, and honest about the fact that a
  // GRANTED right frays QUIETLY. A right is not seized back the way a garrison is thrown
  // off; it is narrowed, delayed, made unwelcome — which is why every `strained` line here
  // is about friction rather than refusal, and why the fog reads them as honored until the
  // watcher is close enough to see.
  //
  // ⚠ LAW ONE GOVERNS THE FAITH ROW ABSOLUTELY. Not one of these three sentences says
  // whether a god is real, answered, or pleased. They speak about PRIESTS, ROADS, DOORS
  // and PEOPLE — the things a treaty can actually bind — and the theological question the
  // engine never answers stays unasked.
  faith: Object.freeze({
    honored: 'The strangers\' priests walk the roads and speak in the squares, and no hand is raised against them.',
    strained: 'The strangers\' priests find the roads longer than they were, and the squares oddly empty when they arrive.',
    defaulted: 'The doors are shut to the strangers\' priests, and what was written about the rites is no longer kept.',
  }),
  population: Object.freeze({
    honored: 'The families cross as the compact allows, and the fields they clear are theirs to work.',
    strained: 'The families still cross, but the crossing has grown slow and the welcome at the far end thin.',
    defaulted: 'The crossings are closed and the compact of passage is dead; those already over are on their own.',
  }),
  commercial: Object.freeze({
    honored: 'The named house trades on the terms it was promised, and the tollmen wave its wagons through.',
    strained: 'The named house still trades, but the tollmen find new reasons to count, and the counting takes all day.',
    defaulted: 'The promised terms of trade are withdrawn; the named house pays what any stranger pays, or is turned away.',
  }),
});

/** A generic register floor for any future family the table does not name (keeps
 *  the read-model total). @type {Readonly<Record<'honored'|'strained'|'defaulted', string>>} */
export const TREATY_COMPLIANCE_FLOOR = Object.freeze({
  honored: 'The term is kept as written, and the peace holds here.',
  strained: 'The term is kept only barely; the strain of it shows, and grows.',
  defaulted: 'The term is broken, and this seam of the peace has torn.',
});

/** @param {string} state @returns {'honored'|'strained'|'defaulted'} */
function normalizeState(state) {
  return state === 'defaulted' ? 'defaulted' : state === 'strained' ? 'strained' : 'honored';
}

/**
 * The house-voice compliance line for a term of `family` in `complianceState`.
 * Total (falls to the floor for an unknown family). Pure.
 * @param {string} family @param {string} complianceState @returns {string}
 */
export function treatyStrainLine(family, complianceState) {
  const state = normalizeState(String(complianceState));
  const row = TREATY_COMPLIANCE_VOICE[String(family)] || TREATY_COMPLIANCE_FLOOR;
  return /** @type {Record<string, string>} */ (row)[state] || TREATY_COMPLIANCE_FLOOR[state];
}

/**
 * THE LONGEVITY LINE (GR-0). One authored sentence about how long this parchment has
 * stood, drawn from the pool families that are honest about ITS age class — a two-year
 * pact can never draw "Old enough that the roads it opened are simply the roads now".
 * Null when the document carries no age, which is exactly what a dark world's read-model
 * hands back (the key is drop-when-absent behind the flag).
 * @param {{ pairKey?: unknown, signedTick?: unknown, ageYears?: unknown }} doc
 * @param {Record<string, unknown> | null | undefined} [treaty] the raw record, for its
 *   obligation axis; omitted, the line falls to its party-free families.
 * @returns {string | null}
 */
export function treatyAgeLine(doc, treaty) {
  const ageYears = Number(doc?.ageYears);
  if (!Number.isFinite(ageYears)) return null;
  const receipt = grammarReceipt(
    'treaty_age_line',
    `${String(doc.pairKey || '')}.${Number(doc.signedTick) || 0}`,
    { ...partySlots('treaty_age_line', treaty), band: treatyAgeBandWord(ageYears) },
    treatyAgeClass(ageYears),
  );
  return receipt ? receipt.line : null;
}

/**
 * Bind one pool's `{settlement}` / `{counterpart}` to a treaty's obligation axis under
 * that pool's own declared roles. A name that never resolved yields no slot at all, so
 * the pool's slotless families answer instead of a slug reaching a reader.
 * @param {string} kind @param {Record<string, unknown> | null | undefined} treaty
 * @returns {Record<string, string>}
 */
function partySlots(kind, treaty) {
  const orientation = treatyOrientationOf(treaty);
  if (!orientation.resolved) return {};
  const named = (/** @type {string} */ id, /** @type {string} */ name) => (
    name && name !== id ? name : '');
  const obligor = named(orientation.obligorId, orientation.obligorName);
  const obligee = named(orientation.obligeeId, orientation.obligeeName);
  if (!obligor || !obligee) return {};
  const roles = grammarSlotRoles(kind);
  const partyFor = (/** @type {string} */ role) => (role === 'obligor' ? obligor : obligee);
  return { settlement: partyFor(roles.settlement), counterpart: partyFor(roles.counterpart) };
}

/**
 * THE DM TRUE-STATE CHIP (GR-0). The audience-projection law, executed: a free surface
 * never sees a quiet default, and this returns null before it reads anything unless the
 * caller holds ground-truth authority. Reads the RAW ledger record rather than the
 * document read-model, deliberately — `trueState` is not on the read-model and must not
 * be, or every consumer of a treaty document would carry the truth the fog exists to hide.
 * Null when nothing diverges: an honest term has no chip.
 * @param {Record<string, unknown> | null | undefined} worldState @param {string} pairKey
 * @param {{ includeGroundTruth?: boolean }} [options]
 * @returns {string | null}
 */
export function treatyTrueStateChip(worldState, pairKey, options = {}) {
  if (options.includeGroundTruth !== true) return null;
  const doc = treatyDocument(worldState, String(pairKey));
  const ledger = treatyLedgerOf(worldState);
  const treaty = doc && ledger ? ledger[doc.pairKey] : null;
  if (!doc || !treaty) return null;
  const terms = Array.isArray(treaty.terms) ? treaty.terms : [];
  // The quiet ones only: a term whose TRUTH has failed while the ledger's own observed
  // state still reads honored. A detected default is public and speaks for itself.
  const quiet = terms.filter((t) => normalizeState(String(t.trueState)) !== 'honored'
    && normalizeState(String(t.complianceState)) === 'honored')
    .sort((a, b) => (String(a.type) < String(b.type) ? -1 : String(a.type) > String(b.type) ? 1 : 0));
  if (quiet.length === 0) return null;
  const receipt = grammarReceipt(
    'treaty_true_state_chip',
    `${doc.pairKey}.${quiet[0].type}`,
    { ...partySlots('treaty_true_state_chip', treaty), term: termLabel(String(quiet[0].type)) },
    null,
  );
  return receipt ? receipt.line : null;
}

/** One rendered term row of the document. @typedef {Object} TreatyTermLine
 *  @property {string} type @property {string} label @property {string} family
 *  @property {number} yearsRemaining @property {string} complianceState
 *  @property {boolean} fraying @property {string} strainLine @property {string} [good] */

/**
 * THE DOCUMENT VIEW — dress the structured treaty document (ledger facts) in the
 * house voice: a title, the parties, each term with its years remaining and its
 * compliance strain line, and the fraying seam named. Null when no treaty stands
 * (dark / absent / no pair). Pure; same document ⇒ same lines.
 * @param {Record<string, unknown> | null | undefined} worldState @param {string} pairKey
 * @returns {(import('../worldPulse/peaceTerms.js').TreatyDocument & {
 *            title: string, termLines: TreatyTermLine[], frayingLine: string | null,
 *            mediatorLine: string | null, coalitionLine: string | null }) | null}
 */
export function renderTreatyDocument(worldState, pairKey) {
  const doc = treatyDocument(worldState, String(pairKey));
  if (!doc) return null;
  return decorate(doc, recordFor(worldState, doc));
}

/** The raw ledger record behind a rendered document — the obligation axis the GRAMMAR
 *  pools bind to lives there and deliberately not on the read-model.
 *  @param {Record<string, unknown> | null | undefined} worldState
 *  @param {{ pairKey: string }} doc */
function recordFor(worldState, doc) {
  const ledger = treatyLedgerOf(worldState);
  return ledger ? ledger[doc.pairKey] || null : null;
}

/**
 * Every treaty document where `settlementId` is a party, dressed in the house
 * voice (the dossier's "treaties where this settlement is a party" render).
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} settlementId
 * @returns {Array<ReturnType<typeof decorate>>}
 */
export function renderTreatiesForSettlement(worldState, settlementId) {
  return treatyDocumentsForSettlement(worldState, settlementId)
    .map((doc) => decorate(doc, recordFor(worldState, doc)));
}

/**
 * Every treaty in the realm, dressed in the house voice (the realm-wide TreatyPanel
 * render), codepoint-ordered by pair key. Empty when dark/absent.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @returns {Array<ReturnType<typeof decorate>>}
 */
export function renderAllTreaties(worldState) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return [];
  /** @type {Array<ReturnType<typeof decorate>>} */
  const out = [];
  for (const key of Object.keys(ledger).sort()) {
    const doc = treatyDocument(worldState, key);
    if (doc) out.push(decorate(doc, ledger[key] || null));
  }
  return out;
}

/** The holding a conveyance document conveys, or '' when it conveys none. Reads the
 *  term view's own drop-when-absent `assetId` — the crier never invents a place name,
 *  and a sale whose clause somehow lost its object says "a holding" rather than a lie
 *  (the InstitutionCard honesty gate, applied to WR-10's instrument).
 *  @param {import('../worldPulse/peaceTerms.js').TreatyDocument} doc @returns {string} */
function conveyedHoldingOf(doc) {
  const term = (doc.terms || []).find((t) => typeof t.assetId === 'string' && t.assetId.length > 0);
  return term && term.assetId ? String(term.assetId) : '';
}

/** Dress one structured document in the house voice.
 *  @param {import('../worldPulse/peaceTerms.js').TreatyDocument} doc
 *  @param {Record<string, unknown> | null} [treaty] the raw record, for the age line's
 *    obligation-axis binding. Absent ⇒ the age line falls to its party-free families. */
function decorate(doc, treaty = null) {
  /** @type {TreatyTermLine[]} */
  const termLines = doc.terms.map((t) => {
    /** @type {TreatyTermLine} */
    const line = {
      type: t.type,
      label: t.label,
      family: t.family,
      yearsRemaining: t.yearsRemaining,
      complianceState: t.complianceState,
      fraying: t.fraying,
      strainLine: treatyStrainLine(t.family, t.complianceState),
    };
    if (t.good) line.good = t.good;
    return line;
  });
  const frayingLine = doc.frayingType
    ? `The seam that will tear first: the ${termLabel(doc.frayingType)}.`
    : null;
  const mediatorLine = doc.mediator && doc.mediator.name
    ? `Brokered by ${doc.mediator.name}, torn between the courts — the terms came the lighter for it.`
    : null;
  const coalitionLine = doc.separateExit && doc.fracture
    ? `A separate peace: ${doc.victorName} peeled from a coalition of ${doc.fracture.coalitionSize}, its co-besiegers abandoned at the walls.`
    : (doc.coalitionScope && doc.coalitionScope.length > 1
      ? `A coalition peace binding ${doc.loserName} — ${doc.coalitionScope.length} besiegers, the spoils split by the strength each brought.`
      : null);
  return {
    ...doc,
    // THE TITLE FOLLOWS THE INSTRUMENT (chair ruling CR-WR10-G). "The Peace of X" is the
    // right sentence for a war settlement and a false one for a purchase, and WR-10 mints
    // treaties that are purchases. The read-model tells us which; the crier says so. The
    // parties are still whatever the orientation resolved, so neither branch can render
    // the string "undefined" the way `String(treaty.loserId)` once could.
    title: doc.orientationKind === 'sale'
      ? `The Conveyance of ${conveyedHoldingOf(doc) || 'a holding'} — ${doc.loserName} to ${doc.victorName}`
      : `The Peace of ${doc.loserName}`,
    termLines,
    frayingLine,
    mediatorLine,
    coalitionLine,
    // GR-0 THE LONGEVITY VOICE. Null while the flag is dark, because the read-model
    // carries no `ageYears` then — one gate, read once, upstream of every surface.
    ageLine: treatyAgeLine(doc, treaty),
  };
}
