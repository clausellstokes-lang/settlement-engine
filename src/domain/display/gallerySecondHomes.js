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
 * Pure; works in place on applyVeil's own clone only.
 */

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

/** @param {unknown} text @param {string[]} pieces @returns {boolean} */
const embedsAny = (text, pieces) => typeof text === 'string' && pieces.some(p => text.includes(p));

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
  return { ties, tensionPieces, houses };
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
 */
export function withholdSecondHomes(s, src, gone, openNames, houseFields) {
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
  if (!gone.size) return;
  // the chair's ruling (b): a flag only a house removed whole raised reads false (never true where it was false)
  const listed = openNames.map(n => n.toLowerCase());
  const econF = recAt(s, 'economicState');
  for (const inst of [recAt(recAt(econF || {}, 'compound') || {}, 'inst'), recAt(recAt(recAt(econF || {}, 'safetyProfile') || {}, 'compound') || {}, 'inst')]) {
    if (!inst) continue;
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
  /** @param {unknown} x @returns {boolean} */
  const hiddenName = (x) => [...gone].some(g => answers(g, str(x))) && !openNames.some(o => answers(o, str(x)));
  /** every name of a house removed whole: its own, and each processing name only it answers to */
  const named = new Set(gone);
  const econ0 = recAt(s, 'economicState');
  for (const c of (econ0 && Array.isArray(econ0.activeChains) ? econ0.activeChains : []).filter(isRec)) {
    for (const x of Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []) if (typeof x === 'string' && hiddenName(x)) named.add(x);
  }
  /** @param {unknown} v @returns {boolean} */
  const names = (v) => {
    if (typeof v === 'string') { for (const g of named) if (v.includes(g)) return true; return false; }
    if (Array.isArray(v)) return v.some(names);
    if (isRec(v)) return Object.values(v).some(names);
    return false;
  };
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
}
