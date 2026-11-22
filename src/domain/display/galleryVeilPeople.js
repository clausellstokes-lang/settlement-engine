// @ts-check
/**
 * galleryVeilPeople.js — R4-IDS, EVERY PERSON ID RE-KEYED PER READ (VEIL-35, R4I-PAGE; brief R4-IDS PART TWO items 1, 3, 4,
 * 5, 6; the chair's VR10, VR46, rulings 15, 16, 17, 48, 53; each vetoable by the owner): the client twin of 212's
 * section "R4-IDS: every person id re-keyed per read" (_gallery_veil_rekey_id, _rekey_ref, _rekey_at, _rekey_each,
 * _rekey, _rekey_served), rule for rule, each rule naming its row of the roster-choice registry
 * (src/domain/veil/rosterChoiceRegistry.js, `people.rekey`). Brought from a4b89bf9d's twin (its re-key part only:
 * readSalt, rekeyId, rekeyAt, rekeyEach, rekeyPeople; VR9's withholdHolders is not this unit), CHANGED where 212 now
 * reads otherwise: an id's text is galleryRosterChoices.js :: idText (ruling 53's one helper; 212 ::
 * _gallery_veil_id_text) and an empty text is no id; STOP 1's card-own ties are re-keyed; the served marker's rule
 * (rekeyServed) is decided by the card, never by the key's spelling.
 *
 * Pure but for the one salt a read (readSalt: one a projection call); works in place on the caller's own clone only.
 * Fixed-path passes: no text of the document is scanned (the cost law).
 */

import { sha256Hex } from '../content/contentFingerprint.js';
import { galleryMemberKey } from './publicSafe.js';
import { idText } from './galleryRosterChoices.js';

/** @typedef {Record<string, unknown>} Rec */

/** @param {unknown} v @returns {v is Rec} */
function isRec(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** @param {Rec} s @param {string} key @returns {Rec|null} */
function recAt(s, key) {
  const v = s[key];
  return isRec(v) ? v : null;
}

/**
 * R4-IDS (item 1; VR10): ONE SALT A READ. The server's is drawn once per call of 212 :: _gallery_veil (VOLATILE, never
 * shipped). The twin's is drawn once per PROJECTION call (galleryVeil.js :: applyVeil, and projectShareVeil's unmarked
 * path), one salt for the whole payload of that call: two projections of one share spell every person's id differently,
 * each consistent within its payload.
 * @returns {string}
 */
export const readSalt = () => globalThis.crypto.randomUUID();

/** The person card lists (galleryVeil.js CARD_KINDS.npc.lists; 211 :: _gallery_veil_cards 'npc'). */
const PEOPLE_LISTS = Object.freeze([['npcs'], ['powerStructure', 'factions', '*', 'members'], ['factions', '*', 'members']]);

/** @param {unknown} s @returns {Rec[]} every person card of the document */
function peopleCards(s) {
  /** @type {Rec[]} */
  const out = [];
  for (const path of PEOPLE_LISTS) {
    /** @type {unknown[]} */
    let level = [s];
    for (const key of path) {
      if (key === '*') { level = level.flatMap(v => (Array.isArray(v) ? v : [])); continue; }
      level = level.map(v => (isRec(v) ? v[key] : undefined));
    }
    for (const v of level) if (Array.isArray(v)) out.push(...v.filter(isRec));
  }
  return out;
}

/** A person's id as the re-key reads it: a string or a number with text (212: jsonb_typeof in ('string', 'number') and
 * _gallery_veil_id_text <> ''); anything else ''. @param {unknown} v @returns {string} */
function personIdText(v) {
  return typeof v === 'string' || typeof v === 'number' ? idText(v) : '';
}

/**
 * R4-IDS (VR10): an id re-keyed under the read's salt: `prefix` and the first 16 hex of sha256(salt '|' id), the text as
 * UTF-8. 212 :: _gallery_veil_rekey_id.
 * @param {string} prefix @param {string} v @param {string} salt @returns {string}
 */
export function rekeyId(prefix, v, salt) {
  return `${prefix}${sha256Hex(`${salt}|${v}`).slice(0, 16)}`;
}

/**
 * The reference at each dotted path inside `x` re-keyed where it is a served card's id (by its text: a NUMBER id is a
 * person's id by its text, ruling 48) or a string spelled `npc_` (a dangling reference: no form survives); an empty text
 * is no id (212 :: _gallery_veil_rekey_ref, _gallery_veil_rekey_at). In place.
 * @param {unknown} x @param {ReadonlyArray<string>} paths @param {Set<string>} ids @param {string} salt
 */
function rekeyAt(x, paths, ids, salt) {
  if (!isRec(x)) return;
  for (const p of paths) {
    const keys = p.split('.');
    /** @type {unknown} */
    let at = x;
    for (const k of keys.slice(0, -1)) at = isRec(at) ? at[k] : undefined;
    const leaf = keys[keys.length - 1];
    if (!isRec(at)) continue;
    const raw = at[leaf];
    const v = personIdText(raw);
    if (v === '') continue;
    if (ids.has(v) || (typeof raw === 'string' && v.startsWith('npc_'))) at[leaf] = rekeyId('npc_', v, salt);
  }
}

/** Each record of the array `arr` with its references at `paths` re-keyed (212 :: _gallery_veil_rekey_each). In place.
 * @param {unknown} arr @param {ReadonlyArray<string>} paths @param {Set<string>} ids @param {string} salt */
function rekeyEach(arr, paths, ids, salt) {
  if (Array.isArray(arr)) for (const e of arr) rekeyAt(e, paths, ids, salt);
}

/** A tie's own id re-keyed WHOLE (it spells its ends' ids), where it is a string or a number (212: `tie_` ||
 * _gallery_veil_rekey_id over _gallery_veil_id_text). In place. @param {unknown} arr @param {string} salt */
function rekeyTieIds(arr, salt) {
  if (!Array.isArray(arr)) return;
  for (const t of arr) if (isRec(t) && (typeof t.id === 'string' || typeof t.id === 'number')) t.id = rekeyId('tie_', idText(t.id), salt);
}

/**
 * R4-IDS (item 3; the chair's VR10): every person's id re-keyed under `salt`, and every reference the served payload
 * holds to a person follows, at fixed paths: the cards' ids (npcs[], both roster copies); a goal's two target ids; an
 * allegiance's handler; the ties' ends (from, to; master's npc1Id, npc2Id) and a tie's own id (re-keyed whole); STOP 1, a
 * card's OWN ties (npcs[].relationships[]: from, to, npc1Id, npc2Id, targetId, npcId, and that tie's own id, whole); the
 * crisis cast's roles and lever holders (both copies, one crisis or a list); the simulation trace's targetId and its
 * effects' target. No stored id and no form (`npc_veiled_`, `npc_power_`, `npc_<house slug>`) survives at these paths.
 * In place on the caller's own clone; returns it. 212 :: _gallery_veil_rekey, rule for rule.
 * @param {Rec} s @param {string} [salt]  the read's salt; omitted, a fresh one (one a projection call)
 * @returns {Rec}
 */
export function rekeyPeople(s, salt = readSalt()) {
  if (!isRec(s)) return s;
  const ids = new Set(peopleCards(s).map(c => personIdText(c.id)).filter(v => v !== ''));
  // registry: people.rekey (the cards: each id; a goal's two targets; the handler)
  rekeyEach(s.npcs, ['id', 'goal.intent.short.target.id', 'goal.intent.long.target.id', 'allegiance.handler'], ids, salt);
  // registry: people.rekey (STOP 1: a card's OWN ties, npcs[].relationships[]: their ends and references, and each tie's own
  // id re-keyed whole)
  if (Array.isArray(s.npcs)) {
    for (const n of s.npcs) {
      if (!isRec(n) || !Array.isArray(n.relationships)) continue;
      rekeyEach(n.relationships, ['from', 'to', 'npc1Id', 'npc2Id', 'targetId', 'npcId'], ids, salt);
      rekeyTieIds(n.relationships, salt);
    }
  }
  // registry: people.rekey (the ties: their ends, either shape; a tie's own id, which spells its ends', re-keyed whole)
  rekeyEach(s.relationships, ['from', 'to', 'npc1Id', 'npc2Id'], ids, salt);
  rekeyTieIds(s.relationships, salt);
  // registry: people.rekey (the crisis cast, both copies, one crisis or a list: a role's person, a lever's holder)
  for (const k of ['stress', 'stressors']) {
    const v = s[k];
    for (const c of (isRec(v) ? [v] : Array.isArray(v) ? v : [])) {
      if (!isRec(c) || !isRec(c.cast)) continue;
      rekeyEach(c.cast.roles, ['id'], ids, salt);
      rekeyEach(c.cast.levers, ['holderId'], ids, salt);
    }
  }
  // registry: people.rekey (the simulation trace's targets, and each effect's)
  rekeyEach(s.simulationTrace, ['targetId'], ids, salt);
  if (Array.isArray(s.simulationTrace)) for (const e of s.simulationTrace) if (isRec(e)) rekeyEach(e.downstreamEffects, ['target'], ids, salt);
  // registry: people.rekey (master's roster copies: a power's member by id, either list)
  for (const list of [s.factions, recAt(s, 'powerStructure')?.factions]) {
    if (Array.isArray(list)) for (const f of list) if (isRec(f)) rekeyEach(f.members, ['id'], ids, salt);
  }
  return s;
}

/**
 * R4-IDS (item 6; A CORRECTION OF a4b89bf9d, which kept every `npc.` key as a name key): the served marker's person
 * entries (a person's own revealDm / allowImport, keyed by the person's member key, publicSafe.js :: galleryMemberKey)
 * under the read's salt, DECIDED BY THE CARD, never by the key's spelling. `body` is the body as served BEFORE the re-key
 * (the same cards: nothing after the re-key removes a person). `$veil` as it is; a key that is the STORED id of a person
 * the body serves (a string or a number with text) is re-keyed exactly as that card's id is; a key that is the member key
 * of a served card with NO such id (its name key npc.<slug>) is kept; every other key leaves. A new object; returns
 * `served` itself where it is not an object. 212 :: _gallery_veil_rekey_served, rule for rule.
 * @param {unknown} served  the served marker (gallery_member_overrides as the read sends it) @param {unknown} body
 * @param {string} salt  the read's salt (the one its body is re-keyed under)
 * @returns {unknown}
 */
export function rekeyServed(served, body, salt) {
  if (!isRec(served)) return served;
  // registry: people.rekey (the served marker's person keys)
  /** @type {Rec} */
  const out = {};
  if (Object.prototype.hasOwnProperty.call(served, '$veil')) out.$veil = served.$veil;
  for (const c of peopleCards(isRec(body) ? body : {})) {
    const k = galleryMemberKey(c);
    if (k === '$veil' || !Object.prototype.hasOwnProperty.call(served, k)) continue;
    const id = personIdText(c.id);
    out[id !== '' ? rekeyId('npc_', id, salt) : k] = served[k];
  }
  return out;
}
