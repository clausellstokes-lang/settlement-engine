/**
 * domain/crisis/crisisPage.js — THE CRISIS PAGE, COMPOSED ONCE (docs/DESIGN_CRISIS_TAB.md, "The
 * Crisis tab"; the owner, 2026-11-03: "Do it").
 *
 * One section per active crisis, worst first (the cast's own casting order, `cast.rank`, which is
 * the engine's severity ranking), and in each section exactly what the design names: the event in
 * one line; the cast by role with the reason beside each name and a door to the person, the house
 * or the institution; the stakes, one line per faction; the levers; what the players see first;
 * what happens if nothing is done. The Crisis tab renders it, and the print chapter and the
 * Foundry journal page print the same sections from the same record (ONE FACT, ONE HOME).
 *
 * ⛔ NOTHING IS INVENTED. Every string is a record value, a sentence of the cast's fixed
 * vocabulary (crisisCast.js), a Tonight-sheet fact (tonightSheet.js), or a label of
 * CRISIS_PAGE_COPY. "Since when" is printed only where a record holds it: an entry the DM's own
 * event began says so; a generated crisis has no onset on any record and prints none.
 *
 * Pure; lazy-only (its readers are the Crisis tab, the print chapter, the journal).
 */

import { crisisHookFor } from './crisisHooks.js';
import { crisisContainer } from '../facts/crisisKind.js';
import { CRISIS_ROLE_LABEL, STAKE_REASONS, effectiveCastOf } from './crisisCast.js';
import { composeTonightSheet } from '../summary/tonightSheet.js';
import { entityIdFor } from '../dossier/entityLinks.js';
import { factionIdFromName } from '../../lib/entities.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { speakTierNoun } from '../display/stateProse/tierVoice.js';
import { tierNounFor } from '../display/stateProse/weaveBlock.js';
import { migrationDirectionOf } from './migrationDirection.js';

/** The page's one copy constant, on every surface that prints it. */
export const CRISIS_PAGE_COPY = Object.freeze({
  tab: 'Crisis',
  cast: 'Who it touches',
  stakes: 'Stakes',
  levers: 'Levers',
  seeFirst: 'What the players see first',
  ifNothing: 'If nothing is done',
  hook: 'Hook',
  // R3-CODE-C-3 (ROUND-3-CUT-INCREMENT #ww-1263, #ww-702): two claims of zero the record does not hold. An empty cast
  // (an infiltration, whose infiltrator and recruits are the roster's secrets, or a war with no defender here) is not
  // a crisis that touches nobody: no one is yet NAMED for it. An empty `levers` list holds no institution: it says
  // nothing of a person who holds the cast's lever role (rww-thorp-monster_pressure-1's acting warden).
  nobody: 'no one yet named',
  noLevers: 'No house here holds what this crisis turns on.',
  edited: '✎ YOU',
  editedTitle: 'Named by you',
  edit: '✎ Edit',
  done: 'Done',
  revert: 'As the engine has it',
  cancel: 'Cancel',
  remove: 'Remove',
  add: 'Add',
  pointer: 'Open the Crisis tab',
  begunByYou: 'begun by your event',
  // SW-6 CRISIS-SURFACES (B3, A·C4: "split. not touched yet" contradicted itself on every untouched row): a power
  // the crisis has not touched prints as having no stake yet, never as split.
  stake: Object.freeze({ gains: 'gains', loses: 'loses', split: 'split', untouched: 'no stake yet' }),
  // STYLE-AUDIT row 21 (W4 PEOPLE, second seat, 2026-11-07): the event line prints the kind as its
  // heading; the cast's classification (natural, social, engineered, external) is machinery and is
  // no longer printed. A migration says which way it runs (WAVE-RULINGS item 8: both sets).
  direction: Object.freeze({ influx: 'people arriving', exodus: 'people leaving' }),
});

/**
 * @typedef {import('./crisisCast.js').CrisisRole} CrisisRole
 * @typedef {import('./crisisCast.js').CrisisNature} CrisisNature
 * @typedef {import('./crisisCast.js').CrisisCast} CrisisCast
 *
 * @typedef {Object} CrisisPageRow
 * @property {CrisisRole} role
 * @property {string} roleLabel
 * @property {'npc' | 'faction' | 'institution'} kind
 * @property {string} id         the cast's own id (NPC id, faction name, institution name)
 * @property {string} doorId     the dossier entity id the door resolves (entityLinks.js)
 * @property {string} name
 * @property {string} reason
 * @property {boolean} temporary
 *
 * @typedef {Object} CrisisPageStake
 * @property {string} factionId
 * @property {string} doorId
 * @property {'gains' | 'loses' | 'split' | 'untouched'} stake  'untouched': the record's split stake with the untouched reason
 * @property {string} reason
 *
 * @typedef {Object} CrisisPageLever
 * @property {string} institution
 * @property {string} doorId
 * @property {string | null} holderName
 * @property {string | null} holderDoorId
 *
 * @typedef {Object} CrisisPageSection
 * @property {string} id          `crisis.<type>`, the index's id for this crisis
 * @property {number} index       the entry's place in the stress container (the edit's address)
 * @property {string} type
 * @property {string} label
 * @property {CrisisNature | null} nature
 * @property {string} line        the event in one line
 * @property {string} summary     the record's own sentence
 * @property {string} hook        the record's crisis hook
 * @property {CrisisPageRow[]} cast
 * @property {Array<{ role: CrisisRole, roleLabel: string, reason: string }>} absent
 * @property {boolean} edited     the DM spoke
 * @property {CrisisPageStake[]} stakes
 * @property {CrisisPageLever[]} levers
 * @property {Array<{ id: string, label: string, text: string }>} seeFirst
 * @property {string} ifNothingIsDone
 *
 * @typedef {{ name?: unknown, id?: unknown }} PageNpc
 * @typedef {{ name?: unknown, id?: unknown }} PageInstitution
 * @typedef {{ type?: unknown, label?: unknown, summary?: unknown, crisisHook?: unknown, viabilityNote?: unknown, addedByEventId?: unknown, direction?: unknown, cast?: CrisisCast, _userEdits?: Record<string, { value?: unknown }> }} PageEntry
 * @typedef {{ name?: unknown, tier?: unknown, stress?: PageEntry | PageEntry[] | null, npcs?: PageNpc[], institutions?: PageInstitution[] }} PageSettlement
 */

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');

/**
 * The stress container's entries with their container index (the edit's address). An array, or
 * a bare object for one crisis; the `stressors` alias is the same record and is not read twice.
 * @param {PageSettlement | null | undefined} settlement
 * @returns {Array<{ entry: PageEntry, index: number }>}
 */
export function crisisEntriesOf(settlement) {
  // The crisis-kind home's carrier order (`stressors` → `stress` → `stresses`): one object at
  // birth and under every writer, so the index is the same edit address in either home.
  return crisisContainer(settlement)
    .map((entry, index) => ({ entry: /** @type {PageEntry} */ (entry), index }))
    .filter(({ entry }) => !!entry && typeof entry === 'object' && !!(str(entry.type) || str(entry.label)));
}

/**
 * Whether the settlement has an active crisis: the Crisis tab's whole presence rule (the owner:
 * "the tab only appears when there is a crises").
 * @param {PageSettlement | null | undefined} settlement
 */
export function hasActiveCrisis(settlement) {
  return crisisEntriesOf(settlement).length > 0;
}

/**
 * The dossier id a cast row's door resolves (entityLinks.js :: buildDossierEntityIndex): an NPC
 * and an institution by their own entity id, a faction by its snake id.
 * @param {PageSettlement} settlement @param {'npc' | 'faction' | 'institution'} kind @param {string} id
 * @returns {string}
 */
export function castDoorId(settlement, kind, id) {
  if (kind === 'faction') return factionIdFromName(id) || id;
  if (kind === 'npc') {
    const npc = (Array.isArray(settlement.npcs) ? settlement.npcs : []).find((n) => !!n && (str(n.id) || str(n.name)) === id);
    return npc ? entityIdFor('npc', /** @type {{ id?: string, name?: string }} */ (npc)) : id;
  }
  // The standing roster (the ruin filter): a ruined house is not a door the lever opens.
  const inst = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement)).find((i) => !!i && str(i.name) === id);
  return inst ? entityIdFor('institution', /** @type {{ id?: string, name?: string }} */ (inst)) : entityIdFor('institution', { name: id });
}

/**
 * The event in one line: the crisis, a migration's direction, and whether the DM's event began it.
 * Spoken with the place's own noun (`noun`), as every fixed line on this page is.
 * @param {string} label @param {PageEntry} entry
 * @param {string | null} noun the place's tier noun, or null when the record has no tier
 * @returns {string}
 */
function eventLine(label, entry, noun) {
  const parts = [label];
  if (str(entry.type) === 'mass_migration') parts.push(CRISIS_PAGE_COPY.direction[migrationDirectionOf(entry)]);
  if (str(entry.addedByEventId)) parts.push(CRISIS_PAGE_COPY.begunByYou);
  return speakTierNoun(`${parts.join(', ')}.`, noun);
}

/**
 * The stake the page prints: the record's own, except a split that is the untouched power's (the record keeps
 * `split` for the waverer's rule; the reader is told the power has no stake yet).
 * @param {{ stake: 'gains' | 'loses' | 'split', reason: string }} k
 * @returns {'gains' | 'loses' | 'split' | 'untouched'}
 */
function stakeShown(k) {
  return k.stake === 'split' && k.reason === STAKE_REASONS.untouched ? 'untouched' : k.stake;
}

/**
 * Compose the whole page: one section per active crisis, worst first.
 * @param {PageSettlement | null | undefined} settlement
 * @returns {CrisisPageSection[]}
 */
export function composeCrisisPage(settlement) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const entries = crisisEntriesOf(s);
  if (!entries.length) return [];
  const facts = composeTonightSheet(/** @type {Parameters<typeof composeTonightSheet>[0]} */ (s)).facts;
  // THE PLACE'S OWN NOUN (lane RUNG1-TRUTH unit B, 2026-11-04): the nature copy and the cast's
  // reason vocabulary write "the town" for a place of any size ("a crisis of the town itself",
  // "the town's defence, …"), and rung 1 counted 326 + 8 of 1,000 non-towns printing it. Every
  // sentence this page composes from a fixed vocabulary goes through the estate's ONE
  // substitution, as the fixed pools do (lane TIER-NOUN-POOLS); a town's line is returned by
  // identity. The record's own sentences (summary, hook, the viability note) are their
  // writers' business and are not re-spoken here.
  const noun = tierNounFor(typeof s.tier === 'string' ? s.tier : '');
  /** @template T @param {T} text @returns {T} a non-string passes through untouched */
  const speak = (text) => /** @type {T} */ (typeof text === 'string' ? speakTierNoun(text, noun) : text);
  const sections = entries.map(({ entry, index }) => {
    const type = str(entry.type);
    const label = str(entry.label) || type;
    const { cast, edited } = effectiveCastOf(/** @type {Parameters<typeof effectiveCastOf>[0]} */ (s), entry);
    const nature = entry.cast?.nature || null;
    /** @type {CrisisPageSection} */
    const section = {
      id: `crisis.${type || label}`,
      index,
      type,
      label,
      nature,
      line: eventLine(label, entry, noun),
      summary: str(entry.summary),
      hook: crisisHookFor(s, entry),
      cast: (cast?.roles || []).map((r) => ({
        role: r.role,
        roleLabel: CRISIS_ROLE_LABEL[r.role] || r.role,
        kind: r.kind,
        id: r.id,
        doorId: castDoorId(s, r.kind, r.id),
        name: r.name,
        reason: speak(r.reason),
        temporary: !!r.temporary,
      })),
      absent: (cast?.absent || []).map((a) => ({ role: a.role, roleLabel: CRISIS_ROLE_LABEL[a.role] || a.role, reason: speak(a.reason) })),
      edited,
      stakes: (entry.cast?.stakes || []).map((k) => ({ factionId: k.factionId, doorId: castDoorId(s, 'faction', k.factionId), stake: stakeShown(k), reason: speak(k.reason) })),
      levers: (entry.cast?.levers || []).map((l) => ({
        institution: l.institution,
        doorId: castDoorId(s, 'institution', l.institution),
        holderName: l.holderName,
        holderDoorId: l.holderId ? castDoorId(s, 'npc', l.holderId) : null,
      })),
      seeFirst: (entry.cast?.playersSeeFirst || []).flatMap((id) => facts.filter((f) => f.id === id).map((f) => ({ id: f.id, label: f.label, text: f.text }))),
      ifNothingIsDone: str(entry.viabilityNote),
    };
    return { section, rank: entry.cast?.rank || Number.MAX_SAFE_INTEGER };
  });
  return sections
    .map((x, at) => ({ ...x, at }))
    .sort((a, b) => (a.rank - b.rank) || (a.at - b.at))
    .map((x) => x.section);
}
