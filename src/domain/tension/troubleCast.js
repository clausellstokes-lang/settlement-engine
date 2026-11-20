/**
 * domain/tension/troubleCast.js — A TOWN'S SHARPEST STANDING TROUBLE, AND THREE PEOPLE ON ITS THREE SIDES (FRAME-1, the
 * seventh chair's CF1–CF6; the owner, 2026-11-20: "Do it pre deploy. I like it. But make sure there is variability of
 * who is relevant to a crisis where appropriate").
 *
 * The sibling, for a standing trouble, of crisis/crisisCast.js (docs/DESIGN_CRISIS_TAB.md), with one difference that
 * is the whole of CF2: NOTHING IS STORED. The cast is derived AT RENDER from the record by pure rules; no field is
 * written, nothing changes at generation, and so no stored town and no golden moves.
 *
 *   THE TROUBLE: the tension of `history.currentTensions` with the sharpest severity its record carries (the record's
 *   `severity`, a list of the grades it may take: catastrophic over major over minor, by the highest it admits), the
 *   record's own order breaking a tie (the generator writes the town's own pressures first: its crime, its neighbour,
 *   its stress; then the fill).
 *
 *   ITS SIDES: the tension's three `factions`, each classed by its template label (sideArchetypes.js) and filled
 *   through its archetype's LADDER: office, a tie on the record that speaks of the matter, trade, an outsider reached
 *   through a person who would know them, the criminal power. Facts first (a side the generator wrote as a POWER'S
 *   NAME stands for that power's head; a criminal side stands for the criminal power where the roster holds one), then
 *   the hash of the seed, the tension's type and the side against the kind's rate (FRAME_TUNING), then the first kind
 *   the town can fill. CAPS: one side of a trouble by office alone; the seat-holder fronts one side at most; nobody
 *   holds two sides; a person an active crisis's cast holds keeps that role (is never put on a side).
 *
 * ⛔ NOTHING IS INVENTED. Every name is a person (or a house) on the record; an outsider is never named, only reached
 * through a person on it; every reason is one of FRAME_REASONS, filled from the record; a side no rule fills is ABSENT
 * and says so in its own words. No placeholder name, ever.
 *
 * ⛔ THE SHARE VEIL (CF3). The cast needs the record's generation seed (`_seed`), which every shared projection
 * strips (display/publicSafe.js :: toPublicSafe, the gallery's and the party link's posture): on a record without it
 * no trouble is cast, so no page built from a shared record can draw the frame. Fail closed.
 *
 * Pure: no store, no React, no I/O, no rng.
 */

import { castHash } from '../crisis/crisisCast.js';
import { factionArchetype } from '../factionArchetypes.js';
import { crimeSignalOf } from '../crimeSignal.js';
import { governingFactionOf } from '../rulingPower.js';
import { rulingChainOf } from '../dossier/powerStrata.js';
import { isOfficeStandIn } from '../dossier/seatHolder.js';
import { membersByRank } from '../people/membership.js';
import { powerNameInProse } from '../display/governanceAccount.js';
import { ARCHETYPE_LADDER, FRAME_TUNING, GENERATOR_REPLACED_SIDES, LODGING_HOUSE, SIDE_ARCHETYPE, TROUBLE_MATTER, TROUBLE_MATTER_DEFAULT } from './sideArchetypes.js';

/**
 * @typedef {import('./sideArchetypes.js').SideArchetype} SideArchetype
 * @typedef {import('./sideArchetypes.js').FaceKind} FaceKind
 * @typedef {{ id?: unknown, name?: unknown, role?: unknown, title?: unknown, gender?: unknown, power?: unknown,
 *   category?: unknown, ousted?: unknown, temporary?: unknown, plotHooks?: unknown, secret?: unknown,
 *   institution?: unknown, memberships?: unknown }} FrameNpc
 * @typedef {{ faction?: unknown, category?: unknown, power?: unknown, isGoverning?: unknown }} FramePower
 * @typedef {{ type?: unknown, description?: unknown, factions?: unknown, plotHooks?: unknown, severity?: unknown }} FrameTension
 * @typedef {{ from?: unknown, to?: unknown, typeName?: unknown }} FrameTie
 * @typedef {{ _seed?: unknown, name?: unknown, npcs?: unknown, relationships?: unknown, stress?: unknown,
 *   history?: { currentTensions?: unknown } | null, powerStructure?: { factions?: unknown } | null }} FrameSettlement
 *
 * @typedef {Object} SideFace
 * @property {FaceKind} kind         the rung that filled the side
 * @property {'seat'|'head'|'commander'|'tie'|'hook'|'trade'|'criminal'|'criminalHouse'|'outsider'} rule the rule that fired
 * @property {string} [npcId]         the person standing there (absent for an outsider or a house)
 * @property {string} [name]          their name, or the house's name in prose for a criminal house
 * @property {string} [viaId]         for an outsider: the person they are reached through
 * @property {string} [viaName]
 * @property {string} reason          one of FRAME_REASONS, filled
 *
 * @typedef {Object} TroubleSide
 * @property {string} words           the side as the record holds it (a power's name in prose where it names one)
 * @property {string} label           its template label (the archetype's key)
 * @property {SideArchetype} archetype
 * @property {SideFace | null} face   null where no rule fills it
 *
 * @typedef {Object} TroubleFrame
 * @property {string} type            the tension's template type
 * @property {number} at              its place in `history.currentTensions`
 * @property {string} line            the record's own sentence for it
 * @property {string[]} hooks         its own hooks, as the record holds them
 * @property {TroubleSide[]} sides
 */

/** THE GRADES of a tension's severity, sharpest highest. */
const SEVERITY_ORDER = Object.freeze(/** @type {Record<string, number>} */ ({ minor: 1, major: 2, catastrophic: 3 }));

/**
 * THE REASONS (CF6): the closed set of words a face stands on its side with, in the page's own register. `{they}`,
 * `{their}` and `{them}` read the person's own `gender` (a person carries it from birth); a verb written `[owes|owe]`
 * takes its first form after "she" or "he", its second after "they". `{other}`, `{power}` and `{house}` are names
 * from the record.
 */
export const FRAME_REASONS = Object.freeze({
  seat: 'because {they} [holds|hold] the seat',
  head: 'because {they} [heads|head] {power}',
  commander: 'because {they} [commands|command] {power}',
  debtor: 'because {they} [owes|owe] {other} a debt not yet paid',
  creditor: 'because {other} owes {them} a debt not yet paid',
  tie: 'because {they} and {other} {gloss}',
  hook: 'because {their} own trouble is part of it',
  trade: 'because the trouble touches {their} trade',
  criminal: 'because {they} [heads|head] {power}, which works outside the law',
  criminalHouse: 'it works outside the law, and no one in it is named here',
  outsider: 'not named here; {other} keeps {house}, where strangers lodge, and would know of them',
});

/** The tie's words after "{they} and {other}", by its archetype label (data/npcData.js); a tie not listed reads `tieDefault`. */
export const FRAME_TIE_GLOSS = Object.freeze(/** @type {Record<string, string>} */ ({
  'Financial Dependence': 'are tied by money, one depending on the other',
  'Silent Partnership': 'are partners in something neither will name',
  'The Patron No One Names': 'are bound by a patronage no one names',
  'Corrupt Arrangement': 'are in a crooked arrangement together',
  'Held Over Them': 'are bound by something one holds over the other',
  'Active Suppression': 'are at open odds, one working to shut the other down',
  'Mentor and Successor': 'are teacher and heir',
  'Family Complication': 'are family, and it is not simple',
  'Professional Rivalry': 'are rivals, and neither gives the other ground',
  'Unresolved History': 'share a past neither has put behind them',
  'Outstanding Debt': 'are tied by a debt not yet paid',
}));
const TIE_DEFAULT = 'are closely tied';

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
/** @param {unknown} v @returns {unknown[]} */
const arr = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} v @returns {number} */
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
/** @param {FrameNpc} n @returns {string} */
const idOf = (n) => str(n.id) || str(n.name);
/** @param {FramePower} f @returns {string} */
const powerName = (f) => str(f.faction);

/**
 * Fill a reason for a person: their pronouns and the verb forms after them, then the named slots.
 * @param {string} text @param {FrameNpc | null} npc @param {Record<string, string>} [slots] @returns {string}
 */
export function fillReason(text, npc, slots = {}) {
  const g = str(npc?.gender).toLowerCase();
  const p = g === 'female' ? { they: 'she', their: 'her', them: 'her' } : g === 'male' ? { they: 'he', their: 'his', them: 'him' } : { they: 'they', their: 'their', them: 'them' };
  const plural = p.they === 'they';
  return text
    .replace(/\[([^|\]]+)\|([^\]]+)\]/g, (_, one, many) => (plural ? many : one))
    .replace(/\{(they|their|them)\}/g, (_, k) => /** @type {Record<string, string>} */ (p)[k])
    .replace(/\{(\w+)\}/g, (whole, k) => (Object.hasOwn(slots, k) ? slots[k] : whole));
}

/** The highest grade a tension's severity admits. @param {FrameTension} t @returns {number} */
function sharpnessOf(t) {
  const grades = Array.isArray(t.severity) ? t.severity : [t.severity];
  return Math.max(0, ...grades.map((g) => SEVERITY_ORDER[str(g)] || 0));
}

/**
 * THE SHARPEST STANDING TROUBLE: the highest severity grade the record admits, the record's order breaking a tie.
 * @param {FrameSettlement} s @returns {{ tension: FrameTension, at: number } | null}
 */
export function sharpestTroubleOf(s) {
  const list = /** @type {FrameTension[]} */ (arr(s?.history?.currentTensions))
    .map((tension, at) => ({ tension, at }))
    .filter(({ tension }) => !!tension && typeof tension === 'object' && str(tension.type) && arr(tension.factions).some((f) => str(f)));
  if (!list.length) return null;
  return [...list].sort((a, b) => (sharpnessOf(b.tension) - sharpnessOf(a.tension)) || (a.at - b.at))[0];
}

/**
 * The template label a side came from: the side's own words where they are a label the table classes, else the label the
 * generator wrote over at that place (a power's name or its fallback words at birth: `GENERATOR_REPLACED_SIDES`).
 * Reads no template table, so the sheet's closure does not reach data/historyData.js.
 * @param {string} type @param {number} at @param {string} words @returns {string}
 */
export function templateLabelOf(type, at, words) {
  if (Object.hasOwn(SIDE_ARCHETYPE, words)) return words;
  const replaced = /** @type {Record<string, Readonly<Record<number, string>>>} */ (GENERATOR_REPLACED_SIDES)[type];
  return replaced && Object.hasOwn(replaced, at) ? replaced[at] : '';
}

/** @param {FrameSettlement} s @returns {FrameNpc[]} the live roster */
function rosterOf(s) {
  return /** @type {FrameNpc[]} */ (arr(s.npcs)).filter((n) => !!n && typeof n === 'object' && !n.temporary && !n.ousted && !!str(n.name) && !isOfficeStandIn(/** @type {never} */ (n)));
}

/** @param {FrameSettlement} s @returns {FramePower[]} */
function powersOf(s) {
  return /** @type {FramePower[]} */ (arr(s.powerStructure?.factions)).filter((f) => !!f && typeof f === 'object' && !!powerName(f));
}

/** The people an active crisis's cast already holds (they keep that role). @param {FrameSettlement} s @returns {Set<string>} */
function crisisHeld(s) {
  const entries = Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : [];
  return new Set(entries.flatMap((e) => arr(/** @type {{ cast?: { roles?: unknown } }} */ (e)?.cast?.roles))
    .filter((r) => /** @type {{ kind?: unknown }} */ (r)?.kind === 'npc').map((r) => str(/** @type {{ id?: unknown }} */ (r).id)));
}

/** A person's own words that may speak of the trouble: their hooks and their secret. @param {FrameNpc} n @returns {string} */
function ownWordsOf(n) {
  const secret = typeof n.secret === 'object' && n.secret ? /** @type {{ what?: unknown }} */ (n.secret).what : n.secret;
  return [...arr(n.plotHooks).map(str), str(secret)].join(' ');
}

/** A person's trade as the record writes it: role, title, house. @param {FrameNpc} n @returns {string} */
function tradeWordsOf(n) {
  const inst = typeof n.institution === 'object' && n.institution ? /** @type {{ key?: unknown, family?: unknown }} */ (n.institution) : {};
  return [str(n.role), str(n.title), str(inst.key), str(inst.family)].join(' | ');
}

/** The house a keeper keeps, in prose. @param {FrameNpc} n @returns {string} */
function houseOf(n) {
  const inst = typeof n.institution === 'object' && n.institution ? /** @type {{ key?: unknown }} */ (n.institution) : {};
  const key = str(inst.key).replace(/\s*\([^)]*\)\s*$/, '').toLowerCase();
  return key ? `the ${key}` : '';
}

/**
 * @typedef {{ npc?: FrameNpc, power?: FramePower, via?: FrameNpc, rule: SideFace['rule'], slots?: Record<string, string> }} Candidate
 */

/**
 * Cast the sides of a town's sharpest standing trouble. Null where the record holds no trouble, or no seed (CF3).
 * @param {FrameSettlement | null | undefined} settlement
 * @returns {TroubleFrame | null}
 */
export function castTroubleFrame(settlement) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const seed = str(s._seed);
  if (!seed) return null; // CF3: a shared projection carries no seed, so no frame
  const sharpest = sharpestTroubleOf(s);
  if (!sharpest) return null;
  const { tension, at } = sharpest;
  const type = str(tension.type);
  const matter = TROUBLE_MATTER[type] || TROUBLE_MATTER_DEFAULT;
  const roster = rosterOf(s);
  const byId = new Map(roster.map((n) => [idOf(n), n]));
  const powers = powersOf(s);
  const held = crisisHeld(s);
  const seatName = str(rulingChainOf(/** @type {never} */ (s)).npc?.name);
  const seat = roster.find((n) => str(n.name) === seatName) || null;
  const governing = /** @type {FramePower | null} */ (governingFactionOf(/** @type {never} */ (s)));
  const ties = /** @type {FrameTie[]} */ (arr(s.relationships)).filter((t) => !!t && typeof t === 'object' && matter.ties.includes(str(t.typeName)));
  const byPower = (/** @type {number} */ a, /** @type {number} */ b) => b - a;

  /** @type {Set<string>} */
  const used = new Set();
  let officeUsed = 0;
  let seatUsed = 0;

  /** May this person stand on a side now? @param {FrameNpc | undefined} n */
  const free = (n) => !!n && !used.has(idOf(n)) && !held.has(idOf(n)) && !(seat && idOf(n) === idOf(seat) && seatUsed >= FRAME_TUNING.seatSidesMax);
  /** The head of a power: its first by rank. @param {FramePower} f */
  const headOf = (f) => membersByRank(roster, powerName(f))[0];
  /** Strongest first, then roster order. @param {FrameNpc[]} list */
  const strongest = (list) => list.map((n, i) => ({ n, i })).sort((a, b) => byPower(num(a.n.power), num(b.n.power)) || (a.i - b.i)).map(({ n }) => n);

  /**
   * The candidates for one kind on one side.
   * @param {FaceKind} kind @param {SideArchetype} archetype @returns {Candidate[]}
   */
  const candidatesOf = (kind, archetype) => {
    if (kind === 'office') {
      if (officeUsed >= FRAME_TUNING.officeSidesMax) return [];
      if (archetype === 'authority') return seat && free(seat) ? [{ npc: seat, rule: 'seat' }] : [];
      const archOf = (/** @type {FramePower} */ f) => factionArchetype(/** @type {never} */ (f));
      const notGoverning = (/** @type {FramePower} */ f) => !governing || powerName(f) !== powerName(governing);
      /** @type {string[]} */
      const wanted = archetype === 'enforcer' ? ['military']
        : archetype === 'faithful' ? ['religious']
          : archetype === 'profiteer' ? ['merchant']
            : archetype === 'establishment' ? [...matter.office]
              : archetype === 'reformer' ? ['civic', 'labor', 'religious', 'arcane']
                : archetype === 'challenger' ? ['noble', 'merchant', 'craft', 'labor', 'religious', 'arcane', 'civic'] : [];
      const fit = powers.filter((f) => wanted.includes(archOf(f)) && (archetype === 'challenger' || archetype === 'reformer' ? notGoverning(f) : true))
        .sort((a, b) => byPower(num(a.power), num(b.power)));
      // a side that presses against the seat is never fronted by the seat's own people
      const ofSeat = (/** @type {FrameNpc | undefined} */ n) => !!n && ((!!seat && idOf(n) === idOf(seat)) || (!!governing && membersByRank([n], powerName(governing)).length > 0));
      const against = archetype === 'challenger' || archetype === 'reformer';
      return fit.map((f) => ({ f, n: headOf(f) })).filter(({ n }) => free(n) && !(against && ofSeat(n)))
        .map(({ f, n }) => ({ npc: n, power: f, rule: /** @type {SideFace['rule']} */ (archOf(f) === 'military' ? 'commander' : 'head'), slots: { power: powerNameInProse(powerName(f)) } }));
    }
    if (kind === 'tie') {
      /** @type {Candidate[]} */
      const out = [];
      for (const t of ties) {
        const from = byId.get(str(t.from));
        const to = byId.get(str(t.to));
        if (!from || !to) continue;
        const debt = str(t.typeName) === 'Outstanding Debt';
        /** @type {Array<[FrameNpc, FrameNpc, SideFace['rule'], string]>} */
        const ends = debt
          ? (archetype === 'payer' || archetype === 'blamed' || archetype === 'authority' ? [[from, to, 'tie', FRAME_REASONS.debtor]]
            : archetype === 'profiteer' || archetype === 'creditor' ? [[to, from, 'tie', FRAME_REASONS.creditor]] : [])
          : [[from, to, 'tie', FRAME_REASONS.tie], [to, from, 'tie', FRAME_REASONS.tie]];
        for (const [who, other, rule, reason] of ends) {
          if (free(who)) out.push({ npc: who, rule, slots: { other: str(other.name), gloss: FRAME_TIE_GLOSS[str(t.typeName)] || TIE_DEFAULT, reasonText: reason } });
        }
      }
      if (['payer', 'blamed', 'middle', 'challenger', 'reformer'].includes(archetype)) {
        for (const n of strongest(roster)) if (free(n) && matter.words.test(ownWordsOf(n))) out.push({ npc: n, rule: 'hook' });
      }
      return out;
    }
    if (kind === 'trade') {
      return strongest(roster).filter((n) => free(n) && matter.trade.test(tradeWordsOf(n))).map((n) => ({ npc: n, rule: /** @type {SideFace['rule']} */ ('trade') }));
    }
    if (kind === 'criminal') {
      // the crime fact through its home leaf (crimeSignal.js): the criminal powers the roster seats
      const seated = new Set(crimeSignalOf({ seats: powers, estate: [] }).powerNames);
      const crooks = powers.filter((f) => seated.has(powerName(f)) && num(f.power) >= FRAME_TUNING.criminalMinPower)
        .sort((a, b) => byPower(num(a.power), num(b.power)));
      return crooks.map((f) => {
        const head = headOf(f);
        /** @type {Candidate} */
        const c = head && free(head)
          ? { npc: head, power: f, rule: /** @type {SideFace['rule']} */ ('criminal'), slots: { power: powerNameInProse(powerName(f)) } }
          : { power: f, rule: /** @type {SideFace['rule']} */ ('criminalHouse'), slots: {} };
        return c;
      }).filter((c) => c.npc || !used.has(`power:${powerName(/** @type {FramePower} */ (c.power))}`));
    }
    // outsider: never named; reached through the keeper of a house where strangers lodge
    return strongest(roster).filter((n) => free(n) && LODGING_HOUSE.test(tradeWordsOf(n)) && houseOf(n))
      .map((n) => ({ via: n, rule: /** @type {SideFace['rule']} */ ('outsider'), slots: { other: str(n.name), house: houseOf(n) } }));
  };

  /** @param {Candidate} c @param {FaceKind} kind @returns {SideFace} */
  const take = (c, kind) => {
    if (c.npc) used.add(idOf(c.npc));
    if (c.power && !c.npc) used.add(`power:${powerName(c.power)}`);
    if (c.via) used.add(idOf(c.via));
    if (kind === 'office') officeUsed += 1;
    if (c.npc && seat && idOf(c.npc) === idOf(seat)) seatUsed += 1;
    const slots = c.slots || {};
    const text = slots.reasonText || /** @type {Record<string, string>} */ (FRAME_REASONS)[c.rule];
    const reason = fillReason(text, c.npc || null, slots);
    return {
      kind, rule: c.rule, reason,
      ...(c.npc ? { npcId: idOf(c.npc), name: str(c.npc.name) } : {}),
      ...(!c.npc && c.power ? { name: powerNameInProse(powerName(c.power), true) } : {}),
      ...(c.via ? { viaId: idOf(c.via), viaName: str(c.via.name) } : {}),
    };
  };

  const sides = arr(tension.factions).map(str).slice(0, 3).map((raw, i) => {
    const label = templateLabelOf(type, i, raw);
    const archetype = SIDE_ARCHETYPE[label];
    const named = powers.find((f) => powerName(f) === raw);
    const words = named ? powerNameInProse(raw, true) : raw ? raw[0].toUpperCase() + raw.slice(1) : '';
    return { i, raw, label, archetype, named, words };
  });

  /** @type {TroubleSide[]} */
  const out = [];
  // The side that holds the office is cast first, so the seat stands where the record puts it; the sides print in the
  // record's order.
  const castOrder = [...sides].sort((a, b) => (Number(b.archetype === 'authority') - Number(a.archetype === 'authority')) || (a.i - b.i));
  for (const side of castOrder) {
    if (!side.archetype) { out[side.i] = { words: side.words, label: side.label, archetype: /** @type {SideArchetype} */ ('middle'), face: null }; continue; }
    const ladder = ARCHETYPE_LADDER[side.archetype];
    const rates = /** @type {Partial<Record<FaceKind, number>>} */ (FRAME_TUNING.rates[side.archetype]);
    const key = `${type}`;
    /** @type {SideFace | null} */
    let face = null;
    // FACTS FIRST: the town decides who CAN stand by each rung. A side the record writes as a power's name is filled by
    // office only by that power's head; a criminal side stands for the criminal power wherever one is strong enough.
    if (side.archetype === 'criminal') {
      const c = candidatesOf('criminal', side.archetype)[0];
      if (c) face = take(c, 'criminal');
    }
    /** @param {FaceKind} kind @returns {Candidate[]} */
    const listOf = (kind) => {
      if (kind !== 'office' || !side.named) return candidatesOf(kind, side.archetype);
      const f = side.named;
      const head = headOf(f);
      if (officeUsed >= FRAME_TUNING.officeSidesMax || !free(head) || factionArchetype(/** @type {never} */ (f)) === 'criminal') return [];
      const rule = factionArchetype(/** @type {never} */ (f)) === 'military' ? 'commander' : (seat && head && idOf(head) === idOf(seat) ? 'seat' : 'head');
      return [{ npc: head, power: f, rule: /** @type {SideFace['rule']} */ (rule), slots: { power: powerNameInProse(powerName(f)) } }];
    };
    // THEN THE HASH against the rate, rung by rung; then the first rung the town can fill at all. Office takes the
    // first by rank; a tie, a trade or a keeper is chosen among the eligible by the hash (no draw).
    /** @type {Array<{ kind: FaceKind, list: Candidate[] }>} */
    const open = face ? [] : ladder.map((kind) => ({ kind, list: listOf(kind) })).filter((x) => x.list.length);
    if (!face) {
      const fired = open.find(({ kind }) => castHash(seed, key, `${side.i}:${kind}`) < (rates[kind] ?? 0)) || open[0];
      if (fired) {
        const at = fired.kind === 'office' ? 0 : Math.floor(castHash(seed, key, `${side.i}:${fired.kind}:who`) * fired.list.length);
        face = take(fired.list[at], fired.kind);
      }
    }
    out[side.i] = { words: side.words, label: side.label, archetype: side.archetype, face };
  }

  return {
    type,
    at,
    line: str(tension.description),
    hooks: arr(tension.plotHooks).map(str).filter(Boolean).slice(0, FRAME_TUNING.hookCount),
    sides: out,
  };
}
