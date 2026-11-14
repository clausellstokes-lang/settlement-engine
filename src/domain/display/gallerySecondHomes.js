/**
 * domain/display/gallerySecondHomes.js — THE SECOND HOMES OF A HIDDEN FACT (COHERENCE-VEIL-6; the fifth
 * review's V5-1, REVIEW-VEIL-211-333b33973-2026-11-13.md §2; the owner's law, record 331: what a user hides
 * by hand is never sent, by any of the four reads, in either stored shape).
 *
 * The veil (galleryVeil.js :: applyVeil) hides a fact at its one address. The stored town keeps some facts a
 * second time, at a path no card list walks. Each such home goes WITH THE EYE THAT GOVERNS ITS SOURCE, and
 * nothing else goes: a copy loses the hidden key; a composed sentence that embeds a hidden string is withheld
 * WHOLE (never a sentence with a hole in it, no new prose); a list loses the hidden name and nothing else.
 * The homes, from the review's §2 (by planted marker and by sentence search):
 *   prominentRelationship.full / .tension / .phrasing   a tie's description and tension (its source tie: the
 *                                                       same two names and type, or the same text)
 *   pressureSentence                                    a tie's description or tension, embedded
 *   history.siegeNarrative                              a current tension's description, embedded
 *   defenseProfile.institutions.<slot>[]                a house's copy, by name: its description and function;
 *                                                       the whole entry for a house hidden whole
 *   economicState.activeChains[]                        a house hidden whole: each processing name it answers
 *                                                       to and no open house does (its own, or the engine's
 *                                                       processor match: 'Black market' for 'Black market
 *                                                       bazaar') leaves the list, and the dependency on it goes;
 *                                                       a chain that is that house's own (its label is the name,
 *                                                       or no processing house is left) is withheld whole: its
 *                                                       id prints as the name
 *   simulationTrace[]                                   a house hidden whole: each cause or effect that holds
 *                                                       one of those names; an entry that holds one elsewhere,
 *                                                       whole
 *   <a person>.presentation.impression                  a sentence of the appearance (`physical`) embedded
 *
 * SQL TWIN, rule for rule: migration 212 :: _gallery_veil_pieces, _gallery_veil_embeds, _gallery_veil_names,
 * _gallery_veil_sources, _gallery_veil_tie_pieces, _gallery_veil_second_homes and the impression arm of
 * _gallery_veil_card. PINNED BY EXECUTION: tests/security/gallerySecondHomes.pglite.test.js (planted markers,
 * every eye shut, the whole payload of the four reads searched as text, both stored shapes), and the twin's
 * parity by tests/security/galleryServerVeil.pglite.test.js and galleryVeilCures.pglite.test.js.
 *
 * A HOUSE BY EVERY NAME (COHERENCE-VEIL-9; the chair's ruling on PART 9's limits): a house's name in any spelling
 * includes the name it was BORN with. The rename's writer (institutionRename.js) moves `name` only; a stamped house
 * keeps its catalogue identity, `catalogId`, which is the fold of its birth name (institutionalCatalog.js ::
 * catalogIdForName; 519 of 519 catalogue names). So the two derived name lists are sent BY POSITIVE ACCOUNT (an entry
 * stays only where a native house still listed accounts for it, each house for one entry: a stamped house by its
 * catalogue identity, an unstamped one by its name), the five booleans read from the entries that stay, and every
 * birth name of a house removed whole is searched with its current name.
 *
 * Pure; works in place on applyVeil's own clone only.
 */

import { isMaterializedCustomContent } from '../content/customContentSemanticAuthority.js';

/** @typedef {Record<string, unknown>} Rec */
/** @typedef {{ card: Rec, desc: boolean, tension: boolean }} TieSource */

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

/**
 * Two lengths, one frozen record (not tuning: a twin's exact copy of the SQL's `char_length(t) >= 12` and
 * `left(lower(v), 12)`). `pieceMin`: a piece shorter than this is never searched for (a word or a name is no
 * sentence). `processorPrefix`: the engine's processor match reads this many characters of a pattern
 * (computeActiveChains.js :: fuzzyProcessorMatch).
 */
export const SECOND_HOME_LIMITS = Object.freeze({ pieceMin: 12, processorPrefix: 12 });

/**
 * The engine's five criminal-house booleans and the substrings of a lower-cased house name that raise each
 * (priorityHelpers.js :: getInstitutionNames, word for word; migration 212's table is the same). The chair's
 * ruling (b), COHERENCE-VEIL-8: each reads as the houses the projection still lists would raise it. The guard
 * holds the copy to the engine's own getInstFlags.
 */
export const HOUSE_FLAG_NAMES = Object.freeze({
  hasCriminalInst: Object.freeze(["thieves' guild", 'black market', 'smuggling', 'assassins', 'street gang', 'front business', 'gambling den', 'underground city', 'multiple criminal']),
  hasThievesGuild: Object.freeze(["thieves' guild chapter", "thieves' guild (powerful)"]),
  hasBlackMarket: Object.freeze(['black market', 'black market bazaar']),
  hasSmuggling: Object.freeze(['smuggling network', 'smuggling operation']),
  hasGangInfra: Object.freeze(['street gang', 'multiple criminal factions', 'front business']),
});

/**
 * The searchable pieces of a hidden value: each string leaf, trimmed, and each run of it between
 * sentence stops and dashes (U+2014), of SECOND_HOME_LIMITS.pieceMin code points or more.
 * @param {unknown} v @param {string[]} [out] @returns {string[]}
 */
export function secondHomePieces(v, out = []) {
  if (typeof v === 'string') {
    for (const p of [v, ...v.split(/[.!?—]+/)]) {
      const t = p.replace(/^[ \t\n\r]+|[ \t\n\r]+$/g, '');
      if (Array.from(t).length >= SECOND_HOME_LIMITS.pieceMin) out.push(t);
    }
  } else if (Array.isArray(v)) v.forEach(x => secondHomePieces(x, out));
  else if (isRec(v)) Object.values(v).forEach(x => secondHomePieces(x, out));
  return out;
}

/**
 * A name in ANOTHER SPELLING (COHERENCE-VEIL-8; REVIEW-VEIL-6's twelfth): lower case, every run of characters
 * that are not a letter or a digit one '_', none at either end. SQL twin: migration 212 :: _gallery_veil_fold, which
 * gives the same string for every input (COHERENCE-VEIL-9): the only characters outside A-Z whose lower case holds a
 * letter a-z are U+0130 and U+212A (every code point measured), and the SQL spells both out.
 * @param {unknown} t @returns {string}
 */
export const foldName = (t) => String(t ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

/** A custom house (customContentSemanticAuthority.js), read as a plain answer. @param {unknown} v @returns {boolean} */
const isCustomHouse = (v) => isMaterializedCustomContent(v);

/** A-Z to a-z and nothing else: the same in both engines whatever their locale (SQL: translate). @param {string} t */
const asciiLower = (t) => t.replace(/[A-Z]/g, c => c.toLowerCase());

/**
 * The engine's processor match by a stamped house's catalogue identity, on the fold (computeActiveChains.js ::
 * institutionMatchesProcessor is id-first: the house answers by the name it was born with): the fold of the pattern's
 * first SECOND_HOME_LIMITS.processorPrefix characters inside the identity. SQL twin: _gallery_veil_hidden_name.
 * @param {string} cid @param {string} x @returns {boolean}
 */
function answersByBirth(cid, x) {
  const f = foldName(Array.from(x).slice(0, SECOND_HOME_LIMITS.processorPrefix).join(''));
  return f !== '' && cid.includes(f);
}

/**
 * The text, folded, holds the name, folded, between '_' boundaries, outside every open name (folded) that holds
 * it. SQL twin: _gallery_veil_folded_name.
 * @param {string} t @param {string} f the name, folded @param {ReadonlyArray<string>} opens @returns {boolean}
 */
function foldedHolds(t, f, opens) {
  if (!f) return false;
  let hay = `_${foldName(t)}_`;
  for (const o of opens) hay = hay.split(`_${o}_`).join('_#_');
  return hay.includes(`_${f}_`);
}

/**
 * The text holds one of the pieces, in any case (COHERENCE-VEIL-8: a composer that lower-cases the first letter of
 * what it embeds, legacyGenerator.js :: annotationBody, still embeds it). SQL twin: _gallery_veil_embeds.
 * @param {unknown} text @param {string[]} pieces @returns {boolean}
 */
const embedsAny = (text, pieces) => typeof text === 'string' && pieces.some(p => text.toLowerCase().includes(p.toLowerCase()));

/**
 * The impression on a person's face loses a sentence of the appearance its eye shuts (whole). Called on a
 * card whose `physical` eye is shut, before the eye removes `physical`.
 * @param {Rec} card
 */
export function withholdImpression(card) {
  const pres = card.presentation;
  if (!isRec(pres) || !embedsAny(pres.impression, secondHomePieces(card.physical))) return;
  const next = { ...pres };
  delete next.impression;
  card.presentation = next;
}

/**
 * What each second home's source said, read BEFORE the eyes run.
 * @param {Rec} s
 * @param {(kind: string, id: string, eye: string) => boolean} eyeShut
 * @param {(s: Rec, kind: string) => Rec[]} cardsOf
 * @param {(kind: string, card: Rec) => string} idOf the veil's address of a card of a kind
 */
export function secondHomeSources(s, eyeShut, cardsOf, idOf) {
  /** @type {TieSource[]} */
  const ties = cardsOf(s, 'relationship').map((card) => {
    const id = idOf('relationship', card);
    return { card: { npc1Name: card.npc1Name, npc2Name: card.npc2Name, typeName: card.typeName, description: card.description, tension: card.tension },
      desc: eyeShut('relationship', id, 'description'), tension: eyeShut('relationship', id, 'tension') };
  });
  /** @type {string[]} */
  const tensionPieces = [];
  for (const card of cardsOf(s, 'tension')) {
    if (eyeShut('tension', idOf('tension', card), 'description')) secondHomePieces([card.description, card.desc], tensionPieces);
  }
  /** @type {Map<string, { desc: boolean, fn: boolean }>} house name -> its shut eyes */
  const houses = new Map();
  for (const card of cardsOf(s, 'institution')) {
    const name = str(card.name);
    if (!name) continue;
    const id = idOf('institution', card);
    const h = houses.get(name) || { desc: false, fn: false };
    if (eyeShut('institution', id, 'description')) h.desc = true;
    if (eyeShut('institution', id, 'function')) h.fn = true;
    houses.set(name, h);
  }
  // COHERENCE-VEIL-8 (T1): the pieces of every shut string of an event (its description, lasting effects, hooks)
  /** @type {string[]} */
  const eventPieces = [];
  for (const card of cardsOf(s, 'event')) {
    const id = idOf('event', card);
    if (eyeShut('event', id, 'description')) secondHomePieces([card.description, card.desc], eventPieces);
    if (eyeShut('event', id, 'lastingEffects')) secondHomePieces(card.lastingEffects, eventPieces);
    if (eyeShut('event', id, 'hooks')) secondHomePieces(card.plotHooks, eventPieces);
  }
  return { ties, tensionPieces, houses, eventPieces };
}

/** @param {TieSource} t @param {string[]} out @returns {string[]} */
function tiePieces(t, out) {
  if (t.desc) secondHomePieces(t.card.description, out);
  if (t.tension) secondHomePieces(t.card.tension, out);
  return out;
}

/**
 * Withhold every second home whose source an eye shut (in place, on applyVeil's own clone).
 * @param {Rec} s
 * @param {ReturnType<typeof secondHomeSources>} src
 * @param {Set<string>} gone names of houses removed whole
 * @param {ReadonlyArray<string>} openNames the names of the houses the projection still lists
 * @param {Readonly<Record<string, ReadonlyArray<string>>>} houseFields the house's eyes and the keys each removes
 * @param {Set<string>} [births] the catalogue identities of the houses removed whole (COHERENCE-VEIL-9)
 */
export function withholdSecondHomes(s, src, gone, openNames, houseFields, births = new Set()) {
  const shutTies = src.ties.filter(t => t.desc || t.tension);
  if (shutTies.length) {
    const pr = s.prominentRelationship;
    if (isRec(pr)) {
      const own = shutTies.filter(t => (str(t.card.npc1Name) === str(pr.npc1) && str(t.card.npc2Name) === str(pr.npc2) && str(t.card.typeName) === str(pr.type))
        || (str(pr.full) !== '' && t.card.description === pr.full) || (str(pr.tension) !== '' && t.card.tension === pr.tension));
      if (own.length) {
        const next = { ...pr };
        if (own.some(t => t.desc)) delete next.full;
        if (own.some(t => t.tension)) delete next.tension;
        if (embedsAny(next.phrasing, own.flatMap(t => tiePieces(t, [])))) delete next.phrasing;
        s.prominentRelationship = next;
      }
    }
    if (embedsAny(s.pressureSentence, shutTies.flatMap(t => tiePieces(t, [])))) delete s.pressureSentence;
  }
  const hist = recAt(s, 'history');
  if (hist && embedsAny(hist.siegeNarrative, src.tensionPieces)) delete hist.siegeNarrative;
  // T1: the legacy annotation embeds its event's first lasting effect, first letter lower-cased; a shut string of an
  // event inside it takes the annotation (the entry's event name, type and years stay)
  if (hist && Array.isArray(hist.legacyAnnotations) && src.eventPieces.length) {
    hist.legacyAnnotations = hist.legacyAnnotations.map((a) => {
      if (!isRec(a) || !embedsAny(a.annotation, src.eventPieces)) return a;
      const next = { ...a };
      delete next.annotation;
      return next;
    });
  }

  const def = recAt(recAt(s, 'defenseProfile') || {}, 'institutions');
  if (def) {
    for (const [slot, rows] of Object.entries(def)) {
      if (!Array.isArray(rows)) continue;
      def[slot] = rows.filter(r => !(isRec(r) && gone.has(str(r.name)))).map((r) => {
        const h = isRec(r) ? src.houses.get(str(r.name)) : undefined;
        if (!h || (!h.desc && !h.fn)) return r;
        const next = { ...r };
        if (h.desc) for (const k of houseFields.description) delete next[k];
        if (h.fn) for (const k of houseFields.function) delete next[k];
        return next;
      });
    }
  }
  if (!gone.size && !births.size) return;
  // COHERENCE-VEIL-9: the houses still listed that the engine read (native: priorityHelpers.js :: getInstitutionNames
  // stamps nativeSemanticNames, so a custom house is in neither list nor any flag), each with its identity
  const accountants = (Array.isArray(s.institutions) ? s.institutions : []).filter(isRec).filter(i => !isCustomHouse(i))
    .map(i => ({ cid: typeof i.catalogId === 'string' && i.catalogId !== '' ? i.catalogId : null, low: asciiLower(str(i.name)) }));
  // THE TWO DERIVED NAME LISTS, BY POSITIVE ACCOUNT (REVIEW-VEIL-6's twelfth; the chair's ruling on PART 9's limits):
  // the engine's lower-cased roster, stamped once at birth, keeps an entry only where a native house still listed
  // accounts for it, each house for one entry, in the list's order: a stamped house by its catalogue identity (the fold
  // of the name it was born with), an unstamped one by its name. A hidden house's birth name cannot outlive a rename,
  // and no difference between two engines' case folds can leave a spelling behind. The chair's ruling (b): a flag only a
  // house removed whole raised reads false (never true where it was false)
  const listed = openNames.map(n => n.toLowerCase());
  const econF = recAt(s, 'economicState');
  for (const inst of [recAt(recAt(econF || {}, 'compound') || {}, 'inst'), recAt(recAt(recAt(econF || {}, 'safetyProfile') || {}, 'compound') || {}, 'inst')]) {
    if (!inst) continue;
    if (Array.isArray(inst.names)) {
      const used = accountants.map(() => false);
      inst.names = inst.names.filter((x) => {
        if (typeof x !== 'string') return false;
        const k = accountants.findIndex((a, j) => !used[j] && (a.cid !== null ? a.cid === foldName(x) : a.low === x));
        if (k < 0) return false;
        used[k] = true;
        return true;
      });
    }
    for (const [flag, words] of Object.entries(HOUSE_FLAG_NAMES)) {
      if (inst[flag] === true && !listed.some(l => words.some(w => l.includes(w)))) inst[flag] = false;
    }
  }
  // A chain names a house by the ENGINE's processor match, not only by the card's name (computeActiveChains.js ::
  // fuzzyProcessorMatch: the lower-cased name holds the pattern's first processorPrefix characters), so a house
  // hidden whole as 'Black market bazaar' is processing name 'Black market'. A processing name that a house hidden
  // whole answers to, and no house left open does, is that house's name.
  /** @param {string} name @param {string} x @returns {boolean} */
  const answers = (name, x) => name === x || name.toLowerCase().includes(x.toLowerCase().slice(0, SECOND_HOME_LIMITS.processorPrefix));
  // COHERENCE-VEIL-9: a house answers by its birth name too (a stamped house, by its catalogue identity), and an open
  // house answers as the engine reads it: a stamped one by its identity, an unstamped one by its name
  const openHouses = (Array.isArray(s.institutions) ? s.institutions : []).filter(isRec)
    .map(i => (typeof i.catalogId === 'string' && i.catalogId !== '' ? { cid: i.catalogId, name: null } : { cid: null, name: str(i.name) }));
  /** @param {unknown} x @returns {boolean} */
  const hiddenName = (x) => ([...gone].some(g => answers(g, str(x))) || [...births].some(b => answersByBirth(b, str(x))))
    && !openHouses.some(o => (o.cid !== null ? answersByBirth(o.cid, str(x)) : answers(/** @type {string} */ (o.name), str(x))));
  /** every name of a house removed whole: its own, the one it was born with, and each processing name only it answers to */
  const named = new Set([...gone, ...births]);
  const econ0 = recAt(s, 'economicState');
  for (const c of (econ0 && Array.isArray(econ0.activeChains) ? econ0.activeChains : []).filter(isRec)) {
    for (const x of Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []) if (typeof x === 'string' && hiddenName(x)) named.add(x);
  }
  // the open names, folded: every house still listed and every power shown (a shown power is not reached); each
  // hidden name with the open names that hold it (blanked before a folded search: an open name is not the hidden one)
  const ps = recAt(s, 'powerStructure');
  const powers = (ps && Array.isArray(ps.factions) ? ps.factions : []).filter(f => isRec(f) && f.hidden !== true).map(f => `${str(f.faction)} `);
  const openFolds = [...openNames, ...powers, ...openHouses.flatMap(o => (o.cid !== null ? [o.cid] : []))].map(foldName).filter(Boolean);
  const forms = [...named].map((g) => {
    const f = foldName(g);
    return { g, f, opens: [...new Set(openFolds.filter(o => o !== f && `_${o}_`.includes(`_${f}_`)))] };
  });
  /** @param {string} t @returns {boolean} the text names a house removed whole, in its own spelling or folded */
  const namesText = (t) => forms.some(h => t.includes(h.g) || foldedHolds(t, h.f, h.opens));
  /** @param {unknown} v @returns {boolean} */
  const names = (v) => {
    if (typeof v === 'string') return namesText(v);
    if (Array.isArray(v)) return v.some(names);
    if (isRec(v)) return Object.values(v).some(names);
    return false;
  };
  const sp0 = recAt(econ0 || {}, 'safetyProfile');
  // N4: the name inside the economy's fixed prose: an income source whose label names it is withheld whole, one
  // whose description names it loses the description, the safety profile's description that names it goes
  if (econ0 && Array.isArray(econ0.incomeSources)) {
    econ0.incomeSources = econ0.incomeSources.filter(r => !(isRec(r) && names(r.source))).map((r) => {
      if (!isRec(r) || !names(r.desc)) return r;
      const next = { ...r };
      delete next.desc;
      return next;
    });
  }
  if (sp0 && names(sp0.safetyDesc)) delete sp0.safetyDesc;
  const econ = recAt(s, 'economicState');
  if (econ && Array.isArray(econ.activeChains)) {
    econ.activeChains = econ.activeChains.flatMap((c) => {
      if (!isRec(c)) return [c];
      if (gone.has(str(c.label))) return [];
      const next = { ...c };
      if (Array.isArray(c.processingInstitutions)) {
        const kept = c.processingInstitutions.filter(x => !hiddenName(x));
        if (c.processingInstitutions.length && !kept.length) return [];
        next.processingInstitutions = kept;
      }
      if (isRec(c.dependency) && hiddenName(c.dependency.institution)) delete next.dependency;
      return [next];
    });
  }
  if (Array.isArray(s.simulationTrace)) {
    s.simulationTrace = s.simulationTrace.flatMap((e) => {
      if (!isRec(e)) return [e];
      if (Object.entries(e).some(([k, v]) => k !== 'causes' && k !== 'downstreamEffects' && names(v))) return [];
      const next = { ...e };
      for (const k of ['causes', 'downstreamEffects']) {
        const list = e[k];
        if (Array.isArray(list)) next[k] = list.filter(x => !names(x));
      }
      return [next];
    });
  }
  // the chair's ruling (a): last, every string of the projection that names a house removed whole leaves it (a list
  // loses the entry, a record the key); the joins and the town's name stay. SQL twin: _gallery_veil_sweep.
  sweepNames(s, namesText, true);
}

/** Keys the sweep never takes: the joins of a tie. A card's own `id` beside its `name`, and the town's `name`, stay too. */
const SWEEP_KEEPS = Object.freeze(['from', 'to', 'npc1Id', 'npc2Id']);

/**
 * In place: every string leaf that names a hidden house leaves its record or list.
 * @param {unknown} v @param {(t: string) => boolean} namesText @param {boolean} isRoot
 */
function sweepNames(v, namesText, isRoot) {
  if (Array.isArray(v)) {
    for (let i = v.length - 1; i >= 0; i -= 1) {
      if (typeof v[i] === 'string' && namesText(v[i])) v.splice(i, 1);
      else if (v[i] && typeof v[i] === 'object') sweepNames(v[i], namesText, false);
    }
  } else if (isRec(v)) {
    for (const [k, x] of Object.entries(v)) {
      if (typeof x === 'string') {
        const kept = (isRoot && k === 'name') || SWEEP_KEEPS.includes(k) || (k === 'id' && 'name' in v);
        if (!kept && namesText(x)) delete v[k];
      } else if (x && typeof x === 'object') sweepNames(x, namesText, false);
    }
  }
}

/** The groupings that hide what the criminal income row is built from (its label's list, its sentence's figure). */
const CRIMINAL_INCOME_SOURCES = Object.freeze(['block:defense.criminalStructure', 'block:power.criminalUnderside']);

/**
 * The chair's ruling (c), COHERENCE-VEIL-8: the criminal income row (economicState.incomeSources[] with
 * `isCriminal`) is built from what two groupings hide: its label from safetyProfile.criminalInstitutions, its
 * sentence from safetyProfile.blackMarketCapture. Where either grouping is shut it is withheld whole (in place, on
 * applyVeil's own clone). SQL twin: migration 212 :: _gallery_veil_apply.
 * @param {Rec} s @param {ReadonlyArray<string>} groupings
 */
export function withholdCriminalIncome(s, groupings) {
  const econ = recAt(s, 'economicState');
  if (!econ || !Array.isArray(econ.incomeSources) || !groupings.some(g => CRIMINAL_INCOME_SOURCES.includes(g))) return;
  econ.incomeSources = econ.incomeSources.filter(r => !(isRec(r) && r.isCriminal === true));
}
