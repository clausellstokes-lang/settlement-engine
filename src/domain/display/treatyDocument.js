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
  return decorate(doc);
}

/**
 * Every treaty document where `settlementId` is a party, dressed in the house
 * voice (the dossier's "treaties where this settlement is a party" render).
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} settlementId
 * @returns {Array<ReturnType<typeof decorate>>}
 */
export function renderTreatiesForSettlement(worldState, settlementId) {
  return treatyDocumentsForSettlement(worldState, settlementId).map(decorate);
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
    if (doc) out.push(decorate(doc));
  }
  return out;
}

/** Dress one structured document in the house voice. @param {import('../worldPulse/peaceTerms.js').TreatyDocument} doc */
function decorate(doc) {
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
    title: `The Peace of ${doc.loserName}`,
    termLines,
    frayingLine,
    mediatorLine,
    coalitionLine,
  };
}
