// @ts-check
/**
 * galleryVeilPeople.js — R4, THE PEOPLE (VEIL-22; SUB-BRIEF-VR7 point 5, stage R4; the chair's VR9, VR10, VR21, each
 * vetoable by the owner): the client twin of 212's section "R4: the people" (_gallery_veil_holders,
 * _gallery_veil_rekey), rule for rule, each rule naming its row of the roster-choice registry
 * (src/domain/veil/rosterChoiceRegistry.js). Its own module beside the second homes' (gallerySecondHomes.js stands at
 * its layer's size ceiling), as R2's withhold-always twin is (galleryWithholdAlways.js).
 *
 * Pure but for the one salt a page load (READ_SALT); works in place on the caller's own clone only.
 */

import { sha256Hex } from '../content/contentFingerprint.js';

/** @typedef {Record<string, unknown>} Rec */

/** @param {unknown} v @returns {v is Rec} */
function isRec(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** @param {unknown} v @returns {string} */
function str(v) {
  return typeof v === 'string' ? v : '';
}

/** @param {Rec} s @param {string} key @returns {Rec|null} */
function recAt(s, key) {
  const v = s[key];
  return isRec(v) ? v : null;
}

/** The ASCII lowering of 212's translate(…, 'A…Z', 'a…z'). @param {string} t @returns {string} */
const asciiLower = (t) => t.replace(/[A-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + 32));

// galleryVeil.js :: applyVeil runs both immediately before withholdAlways (whose crisis cast matches a role of kind 'npc'
// BY ID against the served people, so the ids are re-keyed first); projectShareVeil runs the re-key on an unmarked share
// too. Fixed-path passes: no text of the document is scanned.

/**
 * VEIL-22 (R4; VR10): ONE SALT A READ. The server's is drawn per read and never ships (212 :: _gallery_veil). The twin's
 * is drawn once per page load: one read of a page is one load, and within it two projections of one payload spell one
 * person's id alike, so a comparison of two projections (criminalVeilSwitch.js) still sees only what a veil changed.
 */
const READ_SALT = globalThis.crypto.randomUUID();

/** The person card lists (galleryVeil.js CARD_KINDS.npc.lists; 211 :: _gallery_veil_kinds). */
const PEOPLE_LISTS = Object.freeze([['npcs'], ['powerStructure', 'factions', '*', 'members'], ['factions', '*', 'members']]);

/** A criminal guild's or the underworld's word in a secret (crimeSignal.js :: withTownsOwnUnderworld's choice). */
const UNDERWORLD_WORDS = /(thieves['’]?|criminal) guild|underworld/i;

/** @param {Rec} s @returns {Rec[]} every person card of the document */
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

/**
 * VEIL-22 (R4; VR10): an id re-keyed under the read's salt: `prefix` and the first 16 hex of sha256(salt '|' id), the
 * text as UTF-8. 212 :: _gallery_veil_rekey_id.
 * @param {string} prefix @param {string} v @param {string} salt @returns {string}
 */
export function rekeyId(prefix, v, salt) {
  return `${prefix}${sha256Hex(`${salt}|${v}`).slice(0, 16)}`;
}

/**
 * The reference at each dotted path inside `x` re-keyed where it is a person's id or spelled in a person id's form
 * (212 :: _gallery_veil_rekey_ref, _gallery_veil_rekey_at). In place.
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
    if (!isRec(at) || typeof at[leaf] !== 'string') continue;
    const v = /** @type {string} */ (at[leaf]);
    if (ids.has(v) || v.startsWith('npc_')) at[leaf] = rekeyId('npc_', v, salt);
  }
}

/** Each record of the array `arr` with its references at `paths` re-keyed (212 :: _gallery_veil_rekey_each). In place.
 * @param {unknown} arr @param {ReadonlyArray<string>} paths @param {Set<string>} ids @param {string} salt */
function rekeyEach(arr, paths, ids, salt) {
  if (Array.isArray(arr)) for (const e of arr) rekeyAt(e, paths, ids, salt);
}

/**
 * VEIL-22 (R4; the chair's VR10): every person's id re-keyed under `salt`, and every reference the served payload holds
 * to a person follows (the reference census of born towns through the server: out/v21/r4/measure). No stored id and no
 * form (`npc_veiled_`, `npc_power_`, `npc_<house slug>`) survives. In place on the caller's own clone; returns it.
 * 212 :: _gallery_veil_rekey, rule for rule.
 * @param {Rec} s @param {string} [salt] @returns {Rec}
 */
export function rekeyPeople(s, salt = READ_SALT) {
  if (!isRec(s)) return s;
  const ids = new Set(peopleCards(s).map(c => c.id).filter(v => typeof v === 'string'));
  // registry: people.rekey (the cards: each id; a goal's targets; the handler)
  rekeyEach(s.npcs, ['id', 'goal.intent.short.target.id', 'goal.intent.long.target.id', 'allegiance.handler'], ids, salt);
  // registry: people.rekey (the ties: their ends, either shape; a tie's own id, which spells its ends', re-keyed whole)
  rekeyEach(s.relationships, ['from', 'to', 'npc1Id', 'npc2Id'], ids, salt);
  if (Array.isArray(s.relationships)) for (const t of s.relationships) if (isRec(t) && typeof t.id === 'string') t.id = rekeyId('tie_', t.id, salt);
  // registry: people.rekey (the crisis cast, both copies, one crisis or a list: a role's person, a lever's holder)
  for (const k of ['stress', 'stressors']) {
    const v = s[k];
    for (const c of (isRec(v) ? [v] : Array.isArray(v) ? v : [])) {
      if (!isRec(c) || !isRec(c.cast)) continue;
      rekeyEach(c.cast.roles, ['id'], ids, salt);
      rekeyEach(c.cast.levers, ['holderId'], ids, salt);
    }
  }
  // registry: people.rekey (the simulation trace's targets)
  rekeyEach(s.simulationTrace, ['targetId'], ids, salt);
  if (Array.isArray(s.simulationTrace)) for (const e of s.simulationTrace) if (isRec(e)) rekeyEach(e.downstreamEffects, ['target'], ids, salt);
  // registry: people.rekey (master's roster copies: a power's member by id, either list)
  for (const list of [s.factions, recAt(s, 'powerStructure')?.factions]) {
    if (Array.isArray(list)) for (const f of list) if (isRec(f)) rekeyEach(f.members, ['id'], ids, salt);
  }
  return s;
}

/**
 * VEIL-22 (R4; the chair's VR9): where a house is hidden whole on this read, the person who HOLDS it is withheld WHOLE
 * WITH ITS TIES, never blanked. A holder: a person of `pub` (the projection before the veil) whose house identity
 * (`houseOf`) names a house removed whole (`gone.names`: its name, its catalogue identity, the label of a nameless one);
 * where the identity cannot be read, or names no house still served, a card minted `npc_veiled_` or of category
 * 'criminal'. With the card go every tie it is an end of, every copy of such a tie, its roster copies, a crisis cast's
 * role and lever naming it, another person's goal aimed at it or naming it and an allegiance it handles; where a criminal house is
 * removed whole, a secret worded by a criminal guild or the underworld. What is left stays dense, in order (VR21). In
 * place on applyVeil's own clone; returns it. 212 :: _gallery_veil_holders, rule for rule.
 * @param {Rec} s
 * @param {Rec} pub
 * @param {{ names: Set<string>, ids: Set<string>, criminal: boolean }} gone the houses removed whole (applyVeil's decision)
 * @param {(s: Rec, kind: string) => Rec[]} cardsOf
 * @param {(inst: Rec) => string} idOf an institution card's id
 * @param {(npc: Rec) => string} houseOf a person card's house identity ('' where none)
 * @returns {Rec}
 */
export function withholdHolders(s, pub, gone, cardsOf, idOf, houseOf) {
  if (!isRec(s) || (!gone.names.size && !gone.criminal)) return s;
  const opens = new Set(cardsOf(pub, 'institution').filter(i => !gone.ids.has(idOf(i))).map(i => str(i.name)).filter(Boolean));
  // registry: people.entry
  // registry: people.card (the holders, read from the projection before the veil touched a card)
  const holders = cardsOf(pub, 'npc').filter((c) => {
    const house = str(houseOf(c));
    if (house !== '' && gone.names.has(house)) return true;
    return (house === '' || !opens.has(house)) && (str(c.id).startsWith('npc_veiled_') || asciiLower(str(c.category)) === 'criminal');
  });
  const hids = new Set(holders.filter(c => typeof c.id === 'string').map(c => /** @type {string} */ (c.id)));
  const hnames = new Set(holders.map(c => str(c.name)).filter(Boolean));
  if (hids.size + hnames.size > 0) {
    // registry: people.entry
    // registry: people.card (the card whole, its category with it; a card with no id by its name)
    if (Array.isArray(s.npcs)) s.npcs = s.npcs.filter(e => !(isRec(e) && (typeof e.id === 'string' ? hids.has(e.id) : (typeof e.name === 'string' && hnames.has(e.name)))));
    // registry: people.ties (a tie the holder is an end of leaves whole, by id or by name, either shape)
    /** @type {string[]} */
    const words = [];
    if (Array.isArray(s.relationships)) {
      /** @param {unknown} t */
      const touches = t => isRec(t) && (hids.has(str(t.from)) || hids.has(str(t.to)) || hids.has(str(t.npc1Id)) || hids.has(str(t.npc2Id))
        || hnames.has(str(t.npc1Name)) || hnames.has(str(t.npc2Name)));
      for (const t of s.relationships) if (touches(t) && isRec(t)) for (const w of [str(t.description), str(t.tension)]) if (w) words.push(w);
      s.relationships = s.relationships.filter(t => !touches(t));
    }
    // registry: people.prominentRelationship (the copy of a gone tie leaves whole: it names the holder, or holds the tie's words)
    const pr = s.prominentRelationship;
    if (isRec(pr) && (hnames.has(str(pr.npc1)) || hnames.has(str(pr.npc2)) || words.includes(str(pr.full)) || words.includes(str(pr.tension)))) {
      delete s.prominentRelationship;
      for (const w of [str(pr.full), str(pr.tension), str(pr.phrasing)]) if (w) words.push(w);
    }
    // registry: people.pressureSentence (it names a holder, or is a gone tie's words)
    const ps = s.pressureSentence;
    if (typeof ps === 'string' && (words.includes(ps) || [...hnames].some(nm => ps.includes(nm)))) delete s.pressureSentence;
    // registry: people.rosterCopy (a power's member naming the holder, by id or by name, either list)
    for (const list of [s.factions, recAt(s, 'powerStructure')?.factions]) {
      if (!Array.isArray(list)) continue;
      for (const f of list) {
        if (!isRec(f) || !Array.isArray(f.members)) continue;
        f.members = f.members.filter(m => !(isRec(m) ? (hids.has(str(m.id)) || hnames.has(str(m.name))) : (typeof m === 'string' && hnames.has(m))));
      }
    }
    // registry: cast.roles.entry
    // registry: cast.levers.holder (a role or a lever naming the holder, by id or by name; both copies)
    for (const k of ['stress', 'stressors']) {
      const v = s[k];
      for (const c of (isRec(v) ? [v] : Array.isArray(v) ? v : [])) {
        if (!isRec(c) || !isRec(c.cast)) continue;
        const cast = c.cast;
        if (Array.isArray(cast.roles)) cast.roles = cast.roles.filter(e => !(isRec(e) && (hids.has(str(e.id)) || hnames.has(str(e.name)))));
        if (Array.isArray(cast.levers)) cast.levers = cast.levers.filter(e => !(isRec(e) && (hids.has(str(e.holderId)) || hnames.has(str(e.holderName)))));
      }
    }
    // registry: people.ties (another person's goal aimed at the holder or naming it, side by side, its intent with it; an
    // allegiance the holder handles)
    if (Array.isArray(s.npcs)) {
      for (const n of s.npcs) {
        if (!isRec(n)) continue;
        const goal = n.goal;
        if (isRec(goal)) {
          const intent = isRec(goal.intent) ? goal.intent : null;
          /** @param {string} side */
          const aimed = side => { const t = intent && isRec(intent[side]) ? intent[side] : null; const tg = isRec(t) && isRec(t.target) ? t.target : null; const line = str(goal[side]); return hids.has(str(tg?.id)) || [...hnames].some(nm => line.includes(nm)); };
          const sides = ['short', 'long'].filter(aimed);
          if (sides.length) {
            const next = { ...goal };
            for (const side of sides) delete next[side];
            if (intent) { const ni = { ...intent }; for (const side of sides) delete ni[side]; next.intent = ni; }
            n.goal = next;
          }
        }
        if (isRec(n.allegiance) && hids.has(str(n.allegiance.handler))) delete n.allegiance;
      }
    }
  }
  // registry: people.secret (where a criminal house is removed whole: a secret worded by a criminal guild or the underworld)
  if (gone.criminal && Array.isArray(s.npcs)) {
    for (const n of s.npcs) {
      if (!isRec(n)) continue;
      const sec = n.secret;
      if ((typeof sec === 'string' && UNDERWORLD_WORDS.test(sec)) || (isRec(sec) && typeof sec.what === 'string' && UNDERWORLD_WORDS.test(sec.what))) delete n.secret;
    }
  }
  return s;
}
