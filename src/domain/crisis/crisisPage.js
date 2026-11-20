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
import { CAST_ABSENCES, CRISIS_ROLE_LABEL, RAISED_BY_CRISIS, castReasonShown, effectiveCastOf } from './crisisCast.js';
import { stakeReasonKey } from '../../data/crisis/stakeReasonLines.js';
import { LODGING_HOUSE } from '../tension/sideArchetypes.js';
import { isOfficeStandIn } from '../dossier/seatHolder.js';
import { composeTonightSheet, TONIGHT_AUDIENCES } from '../summary/tonightSheet.js';
import { entityIdFor } from '../dossier/entityLinks.js';
import { factionIdFromName } from '../../lib/entities.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { speakTierNoun } from '../display/stateProse/tierVoice.js';
import { tierNounFor } from '../display/stateProse/weaveBlock.js';
import { migrationDirectionOf } from './migrationDirection.js';
import { governingFactionOf } from '../rulingPower.js';
import { pluralPowerName, powerNameInProse } from '../display/governanceAccount.js';
import { powerVerb } from '../display/powerSentenceName.js';

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
  // TAIL-CRISIS batch 4 (the chair's ruling K12; READ-ALL B12521 B13860 B18039 13199 06464 13370: "Merchant Guilds no stake
  // yet" where the record has Merchant Guilds in an open quarrel, and "City-State Council no stake yet" in a migration whose
  // own text names the council's choice): the label has its verb, agreeing with the name (`pluralPowerName`); a power the
  // record's quarrels name is said to be at odds already, and the governing power, which the crisis's choice falls on, to
  // answer for it (`stakeShown`). The record's stakes are untouched: the page reads them.
  // FRAME-6 · C2 (the chair's ruling 23 of 2026-11-20, vetoable by the owner): the record's own three stakes take the
  // power's number too ("The Religious Authorities gain"); `gainsMany` and `losesMany` are their plural forms (`stakeOpening`).
  stake: Object.freeze({
    gains: 'gains', loses: 'loses', split: 'split',
    gainsMany: 'gain', losesMany: 'lose',
    untouched: 'has no stake yet', untouchedMany: 'have no stake yet',
    atOdds: 'is already at odds', atOddsMany: 'are already at odds',
    answers: 'must answer for it',
  }),
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
 * @property {StakeShown} stake  'untouched': the record's split stake with the untouched reason (and its twins: `stakeShown`)
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
 * @property {string} [creditor]  FRAME-6 · P4A: who the town owes, on a debt crisis's page, for the owner only; absent elsewhere
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

/** @typedef {'gains' | 'loses' | 'split' | 'untouched' | 'untouchedMany' | 'atOdds' | 'atOddsMany' | 'answers'} StakeShown */

/**
 * The others a power is in an open quarrel with, by the record's own quarrels (`powerStructure.conflicts`, the settled
 * list the page's Tensions block prints), each by its prose form; [] where the record names none. FRAME-6 · C2B (c) (the
 * chair's ruling of 2026-11-20 15:58 UTC, vetoable by the owner; C2 § found 3): each stands inside the at-odds reason as a
 * sentence names a power, with its article (`powerNameInProse`): "in its own quarrel with the Elder Council", "… with the
 * Guard", never the bare leaf ("with Elder Council", "with The Guard"). Display only: no record moves.
 * @param {PageSettlement} s @param {string} name @returns {string[]}
 */
function quarrelsOf(s, name) {
  const rows = /** @type {{ powerStructure?: { conflicts?: unknown } }} */ (s).powerStructure?.conflicts;
  /** @type {string[]} */
  const out = [];
  for (const c of Array.isArray(rows) ? rows : []) {
    const parties = Array.isArray(c?.parties) ? c.parties.map(str) : [];
    if (!parties.includes(name)) continue;
    for (const p of parties) if (p && p !== name && !out.includes(powerNameInProse(p))) out.push(powerNameInProse(p));
  }
  return out;
}

/** The shown stakes of a power the crisis has not touched: printed as no row (K25 (c)). */
const UNTOUCHED_SHOWN = new Set(['untouched', 'untouchedMany']);

/** @param {string[]} names @returns {string} "A", "A and B", "A, B and C" */
const andList = (names) => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);

/**
 * The stake the page prints, and its reason: the record's own, except a split that is the untouched power's (the record
 * keeps `split` for the waverer's rule; the reader is told the power has no stake yet). TAIL-CRISIS batch 4 (K12): an
 * untouched power is not said to have no stake where the record makes that false. The governing power answers for the
 * crisis (its choice is the one the crisis text names: "City-State Council, which can neither turn people away nor keep
 * them fed"); a power the record's quarrels name is already at odds, with whom. Display only: no record moves, no draw.
 * @param {PageSettlement} s @param {string} govName the governing power's name, or ''
 * @param {{ factionId: string, stake: 'gains' | 'loses' | 'split', reason: string }} k
 * @returns {{ stake: StakeShown, reason: string }}
 */
function stakeShown(s, govName, k) {
  if (!(k.stake === 'split' && stakeReasonKey(k.reason) === 'untouched')) return { stake: k.stake, reason: k.reason }; // FRAME-7 · SR1: a key, never a sentence
  const many = pluralPowerName(k.factionId);
  if (govName && k.factionId === govName) return { stake: 'answers', reason: many ? 'they govern here' : 'it governs here' };
  const others = quarrelsOf(s, k.factionId);
  if (others.length) return { stake: many ? 'atOddsMany' : 'atOdds', reason: `in ${many ? 'their' : 'its'} own quarrel with ${andList(others)}` };
  return many ? { stake: 'untouchedMany', reason: k.reason.replace(/^it\b/, 'they') } : { stake: 'untouched', reason: k.reason };
}

/** The record's own stakes whose verb takes the power's number: the plural form's key in `CRISIS_PAGE_COPY.stake`. */
const STAKE_MANY = Object.freeze({ gains: 'gainsMany', loses: 'losesMany', split: 'split' });

/**
 * A STAKES ROW IS A SENTENCE (FRAME-6 · C2; FRAME-5's brief C2-STAKES-PROSE, the chair's ruling 23 of 2026-11-20, vetoable
 * by the owner): the row's opening, composed once for every renderer that prints it (the Crisis tab; the PDF through
 * `pdf/lib/crisisPrint.js :: stakeLines`). The power stands with its article at the head of the sentence
 * (`powerNameInProse(name, true)`: "The Religious Authorities", "The Guard"), and the verb of the record's own stakes takes
 * its number (`powerVerb`: "gain"/"gains", "lose"/"loses", "split"). The shown stakes `stakeShown` writes already agree
 * ("are already at odds", "must answer for it") and print their own word. Before C2 the row opened on the bare roster
 * leaf with a singular verb: "Religious Authorities gains". Display only: no record moves, no draw.
 * @param {{ factionId: string, stake: StakeShown }} k a composed stake row
 * @returns {{ subject: string, verb: string }} the row's subject (the power, with its article) and its verb
 */
export function stakeOpening(k) {
  const word = CRISIS_PAGE_COPY.stake;
  const many = Object.hasOwn(STAKE_MANY, k.stake) ? STAKE_MANY[/** @type {keyof typeof STAKE_MANY} */ (k.stake)] : null;
  return {
    subject: powerNameInProse(k.factionId, true),
    verb: many ? powerVerb(k.factionId, word[k.stake], word[many]) : word[k.stake],
  };
}

/**
 * WHO REACHES AN ABSENCE (FRAME-5 · P1B; B7 §P1b, the chair's rulings of 2026-11-20, each vetoable by the owner): the closed
 * set of words the OWNER's page adds after an absence's stored reason, never stored, never shown to another reader. One
 * sentence: an infiltration's instigator absent as "an outside hand, unnamed" is reached through the keeper of a house
 * where strangers lodge. The hand is never named, nor the infiltrator power's face; `{keeper}` is a person on the record
 * (named once, in full) and `{house}` the record's own word for the house (`lodgingKeeperOf`).
 * THE WORDS (FRAME-6 · P1BF; the chair's ruling of 2026-11-20, 12:52 UTC, the modest one, vetoable by the owner): the
 * standing trouble's own words for the same keeper (troubleCast.js :: FRAME_REASONS.outsider). P1B's first sentence said
 * the hand's people come and go through the house, which the record does not hold; this one says only that strangers
 * lodge there and that its keeper would know of them (CF9: no more than the record holds).
 */
export const CRISIS_ABSENCE_REACH = Object.freeze({
  outsideHand: '{keeper} keeps the {house}, where strangers lodge, and would know of them',
});

/** @typedef {{ id?: unknown, name?: unknown, role?: unknown, title?: unknown, power?: unknown, temporary?: unknown, ousted?: unknown, institution?: unknown }} KeeperNpc */

/**
 * The keeper an outside hand is reached through, by the standing trouble's own outsider rule (tension/troubleCast.js ::
 * castTroubleFrame, its `outsider` rung, read here because only the sheet's composer may import the trouble cast): the
 * live roster (no temporary person, nobody ousted, no office stand-in), nobody an active crisis's cast holds (they keep
 * that role), strongest first and then roster order, the first whose role, title or house (key or family) names a house
 * where strangers lodge (`LODGING_HOUSE`) and whose house the record names; the house in the record's own wording (its
 * key, less a trailing parenthesis, lower case). Rate 1 (a fact filling an absence): no hash. Null where none stands.
 * Exported for one reader only, tests/domain/crisis/crisisKeeperBothDoors.test.js, which holds it to the rung it copies
 * (troubleCast.js :: lodgingKeepersOf, the first of them) until one module serves both doors (FRAME-6 · P1BF).
 * @param {PageSettlement} s @returns {{ keeper: string, house: string } | null}
 */
export function lodgingKeeperOf(s) {
  const held = new Set(crisisContainer(s).flatMap((e) => {
    const roles = /** @type {{ cast?: { roles?: unknown } } | null} */ (e)?.cast?.roles;
    return Array.isArray(roles) ? roles : [];
  }).filter((r) => r?.kind === 'npc').map((r) => str(r.id)));
  /** @param {KeeperNpc} n */
  const inst = (n) => /** @type {{ key?: unknown, family?: unknown }} */ (n.institution && typeof n.institution === 'object' ? n.institution : {});
  /** @param {KeeperNpc} n */
  const houseOf = (n) => str(inst(n).key).replace(/\s*\([^)]*\)\s*$/, '').toLowerCase();
  /** @param {KeeperNpc} n */
  const tradeWordsOf = (n) => [str(n.role), str(n.title), str(inst(n).key), str(inst(n).family)].join(' | ');
  /** @param {unknown} v */
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const roster = /** @type {KeeperNpc[]} */ (Array.isArray(s.npcs) ? s.npcs : [])
    .filter((n) => !!n && typeof n === 'object' && !n.temporary && !n.ousted && !!str(n.name) && !isOfficeStandIn(/** @type {never} */ (n)));
  const keeper = roster.map((n, i) => ({ n, i }))
    .sort((a, b) => (num(b.n.power) - num(a.n.power)) || (a.i - b.i))
    .map(({ n }) => n)
    .find((n) => !held.has(str(n.id) || str(n.name)) && LODGING_HOUSE.test(tradeWordsOf(n)) && !!houseOf(n));
  return keeper ? { keeper: str(keeper.name), house: houseOf(keeper) } : null;
}

/**
 * WHO THE TOWN OWES (FRAME-6 · P4A; B7 §P4a, the chair's rulings of 2026-11-20, each vetoable by the owner): the closed set
 * of the one line the OWNER's page adds to a debt crisis's section, never stored, never shown to another reader, outside
 * the cast's role vocabulary (no cast row). `line` is keyed by the stake reason of the `RAISED_BY_CRISIS` row that marks the
 * crisis's creditor power (`creditorOf`); a marked power with no sentence here draws nothing (the Crown Creditors'
 * `holdsDebt`: the noble houses hold the crown's debt themselves, so "an outside lender, never named" would contradict the
 * record). The lender is never named; `{face}` is the person holding rank 1 in the creditor power (named once, in full),
 * `{title}` the record's own title for them. `tie` is the one clause an Outstanding Debt tie touching the face adds, in the
 * tie's own direction (`from` owes `to`): `{other}` the other end, by title and name; `{face}` the face's second mention
 * (the names rule: the pronoun of the face's own `gender` where the other end is not of that gender, else the face's
 * title). CF9: each word is the record's ("Resident agent of the external creditor"; "it speaks for the creditor the town
 * owes"; the tie's own debt).
 */
export const CRISIS_CREDITOR_LINE = Object.freeze({
  line: Object.freeze({ creditorAgent: 'The town owes an outside lender, never named; {face}, {title}, speaks for them{tie}.' }),
  tie: Object.freeze({ owedToFace: ', and {other} owes {face} besides', faceOwes: ', and {face} owes {other} besides' }),
});

/**
 * @typedef {{ id?: unknown, name?: unknown, title?: unknown, gender?: unknown, memberships?: unknown }} CreditorNpc
 * @typedef {{ faction?: unknown, name?: unknown, desc?: unknown }} CreditorPower
 * @typedef {{ from?: unknown, to?: unknown, typeName?: unknown }} CreditorTie
 */

/**
 * The creditor of a crisis, read from the record (FRAME-6 · P4A): the first of the entry's STORED stake rows whose power's
 * `desc` opens with that crisis kind's `opens` text in `RAISED_BY_CRISIS` (the marker the power the crisis raised carries,
 * whatever its display name), and only where `CRISIS_CREDITOR_LINE.line` holds a sentence for that row; its face, the
 * first person of the roster holding rank 1 in that power, with a name and a title; and the first Outstanding Debt tie of
 * the record touching the face whose other end is a named person of the roster. Rate 1 (facts of the record): no hash.
 * Null where the record holds no such power or no such face.
 * @param {PageSettlement} s @param {PageEntry} entry
 * @returns {{ sentence: string, face: CreditorNpc, other: CreditorNpc | null, faceOwes: boolean } | null}
 */
function creditorOf(s, entry) {
  const kind = str(entry.type);
  const marks = RAISED_BY_CRISIS.filter(([k, , reason, how]) => k === kind && how === 'opens' && Object.hasOwn(CRISIS_CREDITOR_LINE.line, reason));
  if (!marks.length) return null;
  const powers = /** @type {CreditorPower[]} */ (Array.isArray(/** @type {{ powerStructure?: { factions?: unknown } }} */ (s).powerStructure?.factions) ? /** @type {{ powerStructure: { factions: CreditorPower[] } }} */ (s).powerStructure.factions : []);
  const roster = /** @type {CreditorNpc[]} */ (Array.isArray(s.npcs) ? s.npcs : []).filter((n) => !!n && typeof n === 'object');
  for (const k of entry.cast?.stakes || []) {
    const power = powers.find((f) => !!f && str(f.faction) === k.factionId);
    const desc = power && typeof power.desc === 'string' ? power.desc : '';
    const mark = marks.find(([, text]) => desc.startsWith(text));
    if (!mark) continue;
    const face = roster.find((n) => !!str(n.name) && !!str(n.title) && Array.isArray(n.memberships)
      && n.memberships.some((m) => !!m && m.power === k.factionId && m.rank === 1));
    if (!face) return null;
    const fid = str(face.id) || str(face.name);
    /** @param {unknown} id */
    const personOf = (id) => roster.find((n) => (str(n.id) || str(n.name)) === str(id) && !!str(n.name)) || null;
    const ties = /** @type {CreditorTie[]} */ (Array.isArray(/** @type {{ relationships?: unknown }} */ (s).relationships) ? /** @type {{ relationships: CreditorTie[] }} */ (s).relationships : []);
    const tie = ties.find((t) => !!t && str(t.typeName) === 'Outstanding Debt' && (str(t.from) === fid || str(t.to) === fid)
      && !!personOf(str(t.from) === fid ? t.to : t.from));
    const faceOwes = !!tie && str(tie.from) === fid;
    return { sentence: CRISIS_CREDITOR_LINE.line[/** @type {keyof typeof CRISIS_CREDITOR_LINE.line} */ (mark[2])], face, other: tie ? personOf(faceOwes ? tie.to : tie.from) : null, faceOwes };
  }
  return null;
}

/**
 * The owner's creditor line of one section (FRAME-6 · P4A), or '' where the record does not hold it. The fixed sentence is
 * spoken with the place's own noun BEFORE the record's names fill it, so no name is re-spoken.
 * @param {PageSettlement} s @param {PageEntry} entry @param {(text: string) => string} speak
 * @returns {string}
 */
function creditorLineOf(s, entry, speak) {
  const c = creditorOf(s, entry);
  if (!c) return '';
  const gender = str(c.face.gender).toLowerCase();
  const other = c.other;
  /** @param {CreditorNpc} n */
  const titled = (n) => (str(n.title) ? `${str(n.title)} ${str(n.name)}` : str(n.name));
  // the face's second mention: its own pronoun where the other end is not of its gender, else its title
  const pronoun = gender === 'female' ? (c.faceOwes ? 'she' : 'her') : gender === 'male' ? (c.faceOwes ? 'he' : 'him') : '';
  const again = pronoun && other && str(other.gender).toLowerCase() !== gender ? pronoun : str(c.face.title);
  const tie = other ? (c.faceOwes ? CRISIS_CREDITOR_LINE.tie.faceOwes : CRISIS_CREDITOR_LINE.tie.owedToFace) : '';
  /** @type {Record<string, string>} */
  const slots = { face: str(c.face.name), title: str(c.face.title) };
  const head = speak(c.sentence).replace(/\{(face|title)\}/g, (_, k) => slots[k]);
  return head.replace('{tie}', () => tie.replace(/\{(other|face)\}/g, (_, k) => (k === 'other' && other ? titled(other) : again)));
}

/** @typedef {import('../summary/tonightSheet.js').TonightOptions} CrisisPageOptions */

/**
 * WHO READS THE PAGE (FRAME-4 · U0; the chair, 2026-11-20: P1b's and P4a's new lines are drawn FOR THE OWNER ONLY, behind
 * an explicit audience argument, and a reader who is not the owner gets today's crisis page byte for byte): the readers
 * are the session sheet's own closed set (`TONIGHT_AUDIENCES`, not a second set). The page is the owner's ONLY when
 * `options.audience` is exactly `'owner'`; any other value, a missing `audience` or no options at all is a reader who is
 * not the owner: FAIL CLOSED.
 * @param {CrisisPageOptions | null | undefined} options
 * @returns {boolean}
 */
export function crisisPageForOwner(options) {
  return !!options && typeof options === 'object' && options.audience === TONIGHT_AUDIENCES.owner;
}

/**
 * Compose the whole page: one section per active crisis, worst first.
 *
 * THE AUDIENCE (FRAME-4 · U0): every production caller says who reads the page (`{ audience }`, the closed set of
 * `crisisPageForOwner`). Owner-only content is composed only where `forOwner`: the lines drawn there are the outside hand's
 * keeper, after the infiltration's absent instigator (FRAME-5 · P1B, `CRISIS_ABSENCE_REACH`), and who the town owes, on the
 * debt crisis's section (FRAME-6 · P4A, `CRISIS_CREDITOR_LINE`, the section's `creditor`); every other reader gets today's
 * page, byte for byte. The sheet's facts the page reads
 * are composed for the same reader (the sheet fails closed too; its facts are the same for every reader).
 * @param {PageSettlement | null | undefined} settlement
 * @param {CrisisPageOptions | null} [options]
 * @returns {CrisisPageSection[]}
 */
export function composeCrisisPage(settlement, options) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const entries = crisisEntriesOf(s);
  if (!entries.length) return [];
  const forOwner = crisisPageForOwner(options);
  const facts = composeTonightSheet(/** @type {Parameters<typeof composeTonightSheet>[0]} */ (s), forOwner ? { audience: TONIGHT_AUDIENCES.owner } : null).facts;
  // THE PLACE'S OWN NOUN (lane RUNG1-TRUTH unit B, 2026-11-04): the nature copy and the cast's
  // reason vocabulary write "the town" for a place of any size ("a crisis of the town itself",
  // "the town's defence, …"), and rung 1 counted 326 + 8 of 1,000 non-towns printing it. Every
  // sentence this page composes from a fixed vocabulary goes through the estate's ONE
  // substitution, as the fixed pools do (lane TIER-NOUN-POOLS); a town's line is returned by
  // identity. The record's own sentences (summary, hook, the viability note) are their
  // writers' business and are not re-spoken here.
  const noun = tierNounFor(typeof s.tier === 'string' ? s.tier : '');
  const governing = /** @type {{ faction?: unknown, name?: unknown } | null} */ (governingFactionOf(/** @type {never} */ (s)));
  const govName = governing ? str(governing.faction) || str(governing.name) : '';
  /** @template T @param {T} text @returns {T} a non-string passes through untouched */
  const speak = (text) => /** @type {T} */ (typeof text === 'string' ? speakTierNoun(text, noun) : text);
  // FRAME-5 · P1B (owner-only, behind U0's seam): the clause an absence's line adds, '' for every other reader and every
  // other absence. The infiltration's instigator absent as "an outside hand, unnamed" keeps that stored reason first; the
  // owner reads who reaches the hand (CRISIS_ABSENCE_REACH), where a free lodging keeper stands. The keeper's clause is the
  // record's names and a fixed sentence with no place noun, so it is not re-spoken. A DM-edited cast shows no absence row
  // (effectiveCastOf), so the clause follows it. Read once a page, and only where it is wanted.
  /** @type {{ keeper: string, house: string } | null | undefined} */
  let keeper;
  /** @param {{ role: string, reason: string }} a @returns {string} */
  const reachOf = (a) => {
    if (!forOwner || a.role !== 'instigator' || a.reason !== CAST_ABSENCES.outsideHand) return '';
    if (keeper === undefined) keeper = lodgingKeeperOf(s);
    if (!keeper) return '';
    const k = keeper;
    return `; ${CRISIS_ABSENCE_REACH.outsideHand.replace(/\{(keeper|house)\}/g, (_, slot) => (slot === 'keeper' ? k.keeper : k.house))}`;
  };
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
        reason: speak(castReasonShown(r.reason)), // FRAME-5 · C1: a row stored before C1 prints without the dealer's tail
        temporary: !!r.temporary,
      })),
      absent: (cast?.absent || []).map((a) => ({ role: a.role, roleLabel: CRISIS_ROLE_LABEL[a.role] || a.role, reason: speak(a.reason) + reachOf(a) })),
      edited,
      // TAIL-CRISIS-6 (the chair's ruling K25 (c), 2026-11-15, vetoable by the owner): a power the crisis has truly not
      // touched (no stake of its own, no quarrel the record names, not the governing power) takes NO ROW: "has no stake yet"
      // claims a future nobody knows, and silence is true. Its record keeps its `split` for the waverer's rule.
      stakes: (entry.cast?.stakes || []).flatMap((k) => {
        const shown = stakeShown(s, govName, k);
        if (UNTOUCHED_SHOWN.has(shown.stake)) return [];
        return [{ factionId: k.factionId, doorId: castDoorId(s, 'faction', k.factionId), stake: shown.stake, reason: speak(shown.reason) }];
      }),
      levers: (entry.cast?.levers || []).map((l) => ({
        institution: l.institution,
        doorId: castDoorId(s, 'institution', l.institution),
        holderName: l.holderName,
        holderDoorId: l.holderId ? castDoorId(s, 'npc', l.holderId) : null,
      })),
      seeFirst: (entry.cast?.playersSeeFirst || []).flatMap((id) => facts.filter((f) => f.id === id).map((f) => ({ id: f.id, label: f.label, text: f.text }))),
      ifNothingIsDone: str(entry.viabilityNote),
    };
    // FRAME-6 · P4A (owner-only, behind U0's seam): who the town owes, on the debt crisis's page; the key is added only
    // where the line is drawn, so every other page and every other reader's page is today's, byte for byte.
    const creditor = forOwner ? creditorLineOf(s, entry, speak) : '';
    if (creditor) section.creditor = creditor;
    return { section, rank: entry.cast?.rank || Number.MAX_SAFE_INTEGER };
  });
  return sections
    .map((x, at) => ({ ...x, at }))
    .sort((a, b) => (a.rank - b.rank) || (a.at - b.at))
    .map((x) => x.section);
}
