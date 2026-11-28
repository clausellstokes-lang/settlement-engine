/**
 * domain/voices/voicePlan.js — THE VOICES' PLAN: which cards of a page speak, who speaks, and what is said (S-G1; the
 * owner's fourth to ninth messages, `SURVEY-CHARTER.md`; the design's §4; VOICES-CARDS' `F-proposal.md`, accepted with the
 * chair's twelve rulings of E28).
 *
 *   voicePlanOf(settlement, { audience, customTraditions })   the whole page's plan, memoised on the record
 *   quoteFor(plan, kind, id)                                   one card's quote, or null (the card is silent)
 *
 * THE FRAME: every unmarked sentence of the page is the surveyor's; only townspeople are quoted, and sparingly. A quote
 * sits INSIDE an existing card, one slot a card, signed "<Name>, <role>"; not every card speaks.
 *
 * THE THREE DECISIONS, IN THIS ORDER, so a line added to a pool moves no "speaks" and no speaker:
 *   1. DOES THE CARD SPEAK? A seeded draw on the town's key and the card's own id, `u < min(odds[weight] × sizeFactor[tier],
 *      tabBudget[weight] / n)` (n: the speaking cards of that weight on the tab), the weightiest first under the TAB CAP.
 *   2. WHO SPEAKS? The card's speakers (`cardsOf.js`: its own people first, then anyone), each a LAWFUL speaker (named, not
 *      ousted, a house the public may see), never one the card excludes (a grievance's own officers: ruling 3), never one
 *      who has already spoken on the page (ONE QUOTE A PERSON A PAGE), a temper not yet heard on the tab before one that has
 *      (ruling 9, where another lawful speaker stands), then the earlier tier, then the rendezvous rank on the town's key.
 *      The speaker is spent the moment the card wins: a speaker is spent only where the card won its quote.
 *   3. WHAT IS SAID? The card's pools (`data/voices/saidLines.js`), less an INELIGIBLE line (a needs word with no atom),
 *      a line whose speaker rule does not take this speaker, and a version whose slot the card cannot fill; ASKED OF THE
 *      RECORD THROUGH THE ONE DOOR (`facts/drawDeclared.js`, the ranked mode: a line's `needs` and its version's), skipping a
 *      line already printed on the page. The version is the speaker's stored disposition (none reads transactional).
 * A card that won and found no line is silent ("silent for want of a line"); its speaker stays spent.
 *
 * THE CRISIS CARD FIRST (ruling 8), then tab order: Institutions, Power, NPCs, Traditions, History.
 * A THORP's QUIET (ruling 6): the size factor stands, but a page with a lawful speaker and a card that can speak shows at
 * least one quote: where the draw gave the page none, the cards are tried weightiest first (the draw's order among equals),
 * the mouths spent on silent cards given back, until one speaks. This is the ONE place the plan lets a pool's lines move a
 * speaker (a page that would otherwise be silent); everywhere else a line added to a pool moves no speaks and no speaker.
 *
 * THE LIAR (ruling 11): at most one a town, the one person with a criminal tie who sits in a lawful house
 * (`people/allegiance.js :: allegianceOf`), chosen explicitly by rank on the town's key; the false line by the tie's way
 * and the house's family, and by the criminal house's kind (`data/voices/liarLines.js`); it sits on the card of the
 * holder's own house, which speaks for it. It carries `liar: { inTruth }`: a surface that cannot show the DM's mark safely
 * shows nothing on that card (the plan does not decide the surface).
 *
 * THE SHARED PAGE SHOWS NO QUOTE (ruling 12): the plan is EMPTY for every audience but the owner's own ('owner'). The
 * share strips the key (`_seed`) and whether a card speaks, and who, would tell a reader what is hidden. The player view
 * inside the owner's app is a reader's audience too.
 *
 * THE TOWN'S KEY (ruling 1): `pickKeyOf` below, ONE local function: the record's `id`, else its `_seed`, else its name, so an
 * imported copy and a renamed town keep their quotes. Point 124 moves every pick onto `domain/display/pickKey.js ::
 * pickKeyOf`: this function becomes that import by a one-line change at the join.
 *
 * VIEW TIME, NOTHING STORED: no birth moves; a saved town gains its quotes.
 * Pure: no randomness, no clock, no write (the door notes its draws in the open presumption ledger, as every draw does).
 * @enforced-by tests/domain/voices/voicePlan.test.js
 */
import { SAID_LINES } from '../../data/voices/saidLines.js';
import { LIAR_LINES } from '../../data/voices/liarLines.js';
import { VOICES_TUNING } from './voicesTuning.js';
import { VOICE_TABS, cardsOf, isLawfulSpeaker } from './cardsOf.js';
import { houseFamilyOf } from './houseFamily.js';
import { cardHouseOf } from '../people/cardPowers.js';
import { holdsMembership } from '../people/membership.js';
import { allegianceOf } from '../people/allegiance.js';
import { drawDeclared } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import { fnv1a32, mix32, rankRendezvous } from '../../kernel/proseHash.js';

/** The four tempers, by the stored disposition. */
export const TEMPERS = Object.freeze(['welcoming', 'transactional', 'cautious', 'dismissive']);
/** A person with no stored disposition speaks this version (`npcData.js :: dealingLineFor`'s own fallback). */
export const DEFAULT_TEMPER = 'transactional';
/** The one audience that hears quotes (ruling 12). */
export const OWNER_AUDIENCE = 'owner';

/** @typedef {import('./cardsOf.js').VoiceCard} VoiceCard */
/**
 * @typedef {object} Quote
 * @property {string} kind @property {string} id @property {string} tab
 * @property {string} lineId @property {string} text the version as it prints, slots filled
 * @property {{ id: string, name: string, role: string, temper: string }} speaker
 * @property {{ inTruth: string } | null} liar the DM's note, on the liar's line alone
 */
/**
 * @typedef {object} VoicePlan
 * @property {Map<string, Quote>} quotes by `<kind>:<id>`
 * @property {Map<string, string>} outcome every card's outcome: quote, quote:floor, silent:<why>, not-drawn, capped,
 *   no-speaker, no-line
 * @property {Map<string, string>} speakers every card that won a speaker → the speaker's id (a no-line card's too, but
 *   for the mouths the floor gave back)
 * @property {string[]} order the cards that won a speaker, in the order they spoke
 * @property {VoiceCard[]} cards
 */

/** @type {VoicePlan} */
const EMPTY_PLAN = Object.freeze({ quotes: new Map(), outcome: new Map(), speakers: new Map(), order: [], cards: [] });

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * THE TOWN'S KEY (ruling 1): the record's id, else its seed, else its name. ONE local function; point 124's
 * `pickKeyOf` takes its place at the join.
 * @param {Record<string, any>} settlement @returns {string}
 */
export function pickKeyOf(settlement) {
  return str(settlement?.id) || str(settlement?._seed) || str(settlement?.name);
}

/** @param {string} key @param {string} what @returns {number} a draw in [0, 1) on the key */
const drawOf = (key, what) => mix32(fnv1a32(`${key}::${what}`)) / 4294967296;

/** @param {Record<string, any>} npc @returns {string} the person's temper (the stored disposition) */
export function temperOf(npc) {
  const d = str(npc?.presentation?.disposition);
  return TEMPERS.includes(d) ? d : DEFAULT_TEMPER;
}

/** @param {Record<string, any>} npc @returns {{ id: string, name: string, role: string, temper: string }} */
const speakerOf = (npc) => ({ id: str(npc.id), name: str(npc.name), role: str(npc.title) || str(npc.role), temper: temperOf(npc) });

/**
 * Whether a line's speaker rule takes this person on this card (the writer's `speaker` column; an unknown mouth takes no
 * one: fail-closed, and the leaf's test holds that every mouth of the data is known here).
 * @param {ReadonlyArray<string>} tokens @param {Record<string, any>} npc @param {VoiceCard} card
 * @param {{ seatName: string, seatMembers: Set<string>, instByName: Map<string, Record<string, any>> }} ctx
 * @param {boolean} tier0 the person is of the card's own first tier
 * @returns {boolean}
 */
export function speakerAdmits(tokens, npc, card, ctx, tier0) {
  const id = str(npc.id);
  const ofHouse = !!card.house && cardHouseOf(npc) === card.house;
  const ofPower = !!card.power && holdsMembership(npc, card.power);
  const ofSeat = ctx.seatMembers.has(id);
  const family = houseFamilyOf(ctx.instByName.get(cardHouseOf(npc) || '') || null);
  return tokens.some((t) => {
    switch (t) {
      case 'anyone': return true;
      // a house's keeper is its own people, and its FACE (the card's first tier: the Connection row's person, who may be
      // the seat's holder of another house where the seat's house is faced by its leader)
      case 'keeper': case 'works-there': case 'watch-officer': return ofHouse || (card.kind === 'institution' && tier0);
      case 'member': return ofPower;
      case 'not-member': return !!card.power && !ofPower;
      case 'not-seat': return !ofSeat;
      case 'wronged': return !card.exclude.has(id);
      case 'wronged-not-officer': return !card.exclude.has(id) && !ofSeat && family !== 'watch';
      case 'market-worker': return family === 'market';
      case 'rite-keeper': return card.keeperTier0 === 'keeper' && tier0;
      case 'own-person': return !!card.npc && str(card.npc.id) === id;
      case 'depends': return false;
      default: return false;
    }
  });
}

/** Every mouth `speakerAdmits` knows, by the generator's keys (the leaf's test holds the data to it). */
export const KNOWN_MOUTHS = Object.freeze(['anyone', 'keeper', 'works-there', 'watch-officer', 'member', 'not-member', 'not-seat',
  'wronged', 'wronged-not-officer', 'market-worker', 'rite-keeper', 'own-person', 'depends']);

/**
 * A version with its slots filled from the card, or null where a slot has no value.
 * @param {string} text @param {{ crisisNoun?: string, good?: string, seat?: string }} fill @returns {string | null}
 */
export function filled(text, fill) {
  let ok = true;
  const out = text.replace(/\{(\w+)\}/g, (_m, slot) => {
    const v = Object.hasOwn(fill, slot) ? str(/** @type {Record<string, string>} */ (fill)[slot]) : '';
    if (!v) ok = false;
    return v;
  });
  return ok ? out : null;
}

/** @type {WeakMap<object, Map<string, VoicePlan>>} */
const MEMO = new WeakMap();

/**
 * THE PLAN for one record and audience (memoised on the record's identity; a custom-traditions list joins the key).
 * @param {Record<string, any> | null | undefined} settlement
 * @param {{ audience?: string, customTraditions?: unknown }} [options]
 * @returns {VoicePlan}
 */
export function voicePlanOf(settlement, options = {}) {
  if (!settlement || typeof settlement !== 'object' || options.audience !== OWNER_AUDIENCE) return EMPTY_PLAN;
  const memoKey = Array.isArray(options.customTraditions) && options.customTraditions.length ? JSON.stringify(options.customTraditions) : '';
  let byKey = MEMO.get(settlement);
  if (!byKey) { byKey = new Map(); MEMO.set(settlement, byKey); }
  const held = byKey.get(memoKey);
  if (held) return held;
  const plan = composePlan(settlement, options);
  byKey.set(memoKey, plan);
  return plan;
}

/**
 * One card's quote.
 * @param {VoicePlan} plan @param {string} kind @param {string | null | undefined} id @returns {Quote | null}
 */
export function quoteFor(plan, kind, id) {
  if (!plan || !id) return null;
  return plan.quotes.get(`${kind}:${id}`) || null;
}

/**
 * The liar: the one lawful person with a criminal tie, by rank on the town's key; their line by the tie's way and their
 * house's family, and by the criminal house's kind, by rank. Null where the town holds none, or no line fits.
 * @param {Record<string, any>} settlement @param {Record<string, any>[]} npcs @param {string} key
 * @param {Map<string, Record<string, any>>} instByName
 * @returns {{ npc: Record<string, any>, house: string, line: Record<string, any>, text: string } | null}
 */
export function liarOf(settlement, npcs, key, instByName) {
  const holders = npcs.filter((n) => isLawfulSpeaker(n) && allegianceOf(n) && cardHouseOf(n));
  if (!holders.length) return null;
  const npc = rankRendezvous(holders, `${key}::voices.liar`, (n) => str(n.id))[0];
  const tie = /** @type {{ via: string, house: string }} */ (allegianceOf(npc));
  const house = /** @type {string} */ (cardHouseOf(npc));
  const family = houseFamilyOf(instByName.get(house) || null) || '';
  const way = tie.via === 'office' ? (['hall', 'watch'].includes(family) ? 'office.hall' : ['temple', 'care', 'learning'].includes(family) ? 'office.faith' : null)
    : tie.via === 'front' ? (['market', 'inn', 'workshop', 'grain', 'pit', 'water'].includes(family) ? 'front.trade' : 'front.other')
      : 'retainer';
  const h = tie.house;
  const kind = /smuggl/i.test(h) ? 'smuggling' : /black market|bazaar/i.test(h) ? 'blackmarket' : /thie|rookery|fence/i.test(h) ? 'theft'
    : /whisper/i.test(h) ? 'secrets' : /assassin|killer/i.test(h) ? 'killing' : /gang|criminal factions/i.test(h) ? 'extortion'
      : /underground/i.test(h) ? 'tunnels' : null;
  const lines = /** @type {Record<string, any>[]} */ ([...(way ? LIAR_LINES[/** @type {keyof typeof LIAR_LINES} */ (way)] || [] : []),
    ...(kind ? LIAR_LINES[/** @type {keyof typeof LIAR_LINES} */ (kind)] || [] : [])]);
  if (!lines.length) return null;
  // the false line is asked of the record through the one door, as every line is (its note's nouns and its version's)
  const temper = temperOf(npc);
  const domain = lines.map((l) => ({ id: str(l.id), text: str(l.versions[temper].text), line: l,
    needs: [...(l.needs || []), ...(l.versions[temper].needs || [])], excludes: [...(l.excludes || []), ...(l.versions[temper].excludes || [])] }));
  const drawn = drawDeclared(domain, { rankKey: `${key}::voices.liar.line`, facts: () => factsOf(settlement), poolId: 'voices.liar', surface: 'voices' });
  return drawn.line ? { npc, house, line: drawn.line.line, text: drawn.line.text } : null;
}

/**
 * @param {Record<string, any>} s @param {{ customTraditions?: unknown }} options @returns {VoicePlan}
 */
function composePlan(s, options) {
  const T = VOICES_TUNING;
  const key = pickKeyOf(s);
  const cards = cardsOf(s, { customTraditions: options.customTraditions });
  const ctx = /** @type {any} */ (cards).context;
  const npcs = /** @type {Record<string, any>[]} */ ((Array.isArray(s.npcs) ? s.npcs : []).filter((n) => n && typeof n === 'object'));
  const tier = str(s.tier) || str(s.config?.settType);
  const size = Object.hasOwn(T.sizeFactor, tier) ? T.sizeFactor[/** @type {keyof typeof T.sizeFactor} */ (tier)] : 1;
  /** @type {Map<string, Quote>} */ const quotes = new Map();
  /** @type {Map<string, string>} */ const outcome = new Map();
  /** @type {Map<string, number>} */ const spoken = new Map();
  /** @type {Set<string>} */ const taken = new Set();
  /** @type {Map<string, string>} */ const speakers = new Map();
  /** @type {string[]} */ const order = [];
  const facts = () => factsOf(s);
  const ck = (/** @type {VoiceCard} */ c) => `${c.kind}:${c.id}`;
  const u = new Map(cards.map((c) => [ck(c), drawOf(key, `voices.speaks::${c.kind}:${c.id}`)]));

  // THE LIAR, chosen first so no ordinary card spends the liar's mouth; the holder's own house speaks for the lie
  const liar = liarOf(s, npcs, key, ctx.instByName);
  const liarCard = liar ? cards.find((c) => c.kind === 'institution' && c.house === liar.house && !c.silent) || null : null;
  const liarId = liar && liarCard ? str(liar.npc.id) : '';
  if (liarId) spoken.set(liarId, T.personCap);

  /** @param {VoiceCard} card @param {Set<string>} tempers @returns {{ npc: Record<string, any>, tier0: boolean } | null} */
  const chooseSpeaker = (card, tempers) => {
    /** @type {Array<{ npc: Record<string, any>, tier: number, rank: number }>} */ const pool = [];
    const seen = new Set();
    card.tiers.forEach((people, t) => {
      const ranked = rankRendezvous(people.filter((n) => isLawfulSpeaker(n)), `${key}::voices.who::${card.kind}:${card.id}`, (n) => str(n.id));
      ranked.forEach((n, r) => {
        const id = str(n.id);
        if (seen.has(id) || card.exclude.has(id) || (spoken.get(id) || 0) >= T.personCap) return;
        seen.add(id);
        pool.push({ npc: n, tier: t, rank: r });
      });
    });
    if (!pool.length) return null;
    pool.sort((a, b) => (Number(tempers.has(temperOf(a.npc))) - Number(tempers.has(temperOf(b.npc)))) || (a.tier - b.tier) || (a.rank - b.rank));
    return { npc: pool[0].npc, tier0: pool[0].tier === 0 };
  };

  /** @param {VoiceCard} card @param {Record<string, any>} npc @param {boolean} tier0 @returns {Quote | null} */
  const chooseLine = (card, npc, tier0) => {
    const temper = temperOf(npc);
    const lines = /** @type {Record<string, any>[]} */ (card.pools.flatMap((p) => /** @type {Record<string, any>} */ (SAID_LINES)[p] || []));
    const domain = lines.flatMap((l) => {
      if (l.ineligible || !speakerAdmits(l.speaker, npc, card, ctx, tier0)) return [];
      const v = l.versions[temper];
      const text = filled(v.text, card.fill);
      if (text === null) return [];
      return [{ id: str(l.id), text, needs: v.needs || [], excludes: v.excludes || [] }];
    });
    if (!domain.length) return null;
    const drawn = drawDeclared(domain, { rankKey: `${key}::voices.line::${card.kind}:${card.id}`, taken, facts, poolId: 'voices.said', surface: 'voices' });
    if (!drawn.line) return null;
    return { kind: card.kind, id: card.id, tab: card.tab, lineId: drawn.line.id, text: /** @type {string} */ (drawn.text), speaker: speakerOf(npc), liar: null };
  };

  /** @param {VoiceCard} card @param {Set<string>} tempers @returns {boolean} the card won a speaker (the cap counts it) */
  const speak = (card, tempers) => {
    if (liarCard && card === liarCard && liar) {
      const temper = temperOf(liar.npc);
      quotes.set(ck(card), { kind: card.kind, id: card.id, tab: card.tab, lineId: str(liar.line.id), text: liar.text, speaker: speakerOf(liar.npc), liar: { inTruth: str(liar.line.inTruth) } });
      tempers.add(temper);
      outcome.set(ck(card), 'quote');
      speakers.set(ck(card), str(liar.npc.id));
      order.push(ck(card));
      return true;
    }
    const who = chooseSpeaker(card, tempers);
    if (!who) { outcome.set(ck(card), 'no-speaker'); return false; }
    const id = str(who.npc.id);
    spoken.set(id, (spoken.get(id) || 0) + 1);
    speakers.set(ck(card), id);
    order.push(ck(card));
    tempers.add(temperOf(who.npc));
    const q = chooseLine(card, who.npc, who.tier0);
    if (!q) { outcome.set(ck(card), 'no-line'); return true; }
    taken.add(q.lineId);
    quotes.set(ck(card), q);
    outcome.set(ck(card), 'quote');
    return true;
  };

  const weightRank = (/** @type {VoiceCard} */ c) => (c.weight === 'weighty' ? 0 : 1);
  for (const tab of VOICE_TABS) {
    const onTab = cards.filter((c) => c.tab === tab);
    for (const c of onTab) if (c.silent) outcome.set(ck(c), `silent:${c.silent}`);
    const live = onTab.filter((c) => !c.silent);
    /** @type {Record<string, number>} */ const n = { weighty: 0, lesser: 0 };
    for (const c of live) n[c.weight] += 1;
    const winners = live.filter((c) => c === liarCard
      || /** @type {number} */ (u.get(ck(c))) < Math.min(T.odds[c.weight] * size, T.tabBudget[c.weight] / n[c.weight]));
    for (const c of live) if (!winners.includes(c)) outcome.set(ck(c), 'not-drawn');
    winners.sort((a, b) => (Number(b === liarCard) - Number(a === liarCard)) || (weightRank(a) - weightRank(b))
      || (/** @type {number} */ (u.get(ck(a))) - /** @type {number} */ (u.get(ck(b)))));
    /** @type {Set<string>} */ const tempers = new Set();
    let count = 0;
    for (const c of winners) {
      if (count >= T.tabCap) { outcome.set(ck(c), 'capped'); continue; }
      if (speak(c, tempers)) count += 1;
    }
  }

  // A THORP's QUIET (ruling 6): at least one quote where a lawful speaker and a card that can speak stand. Where the draw
  // gave the page none, the speakers it spent on cards that printed nothing are given back, and the cards are tried in
  // weight, tab and draw order until one speaks (THE ONE PLACE a pool's lines can move a speaker: said in the head).
  if (quotes.size === 0 && npcs.some((n) => isLawfulSpeaker(n))) {
    const giveBack = (/** @type {string} */ k) => {
      const id = speakers.get(k);
      if (!id) return;
      spoken.set(id, 0);
      speakers.delete(k);
      order.splice(order.indexOf(k), 1);
    };
    for (const k of [...speakers.keys()]) if (outcome.get(k) === 'no-line') giveBack(k);
    const tries = cards.filter((c) => !c.silent && outcome.get(ck(c)) !== 'no-line')
      .sort((a, b) => (weightRank(a) - weightRank(b)) || (VOICE_TABS.indexOf(a.tab) - VOICE_TABS.indexOf(b.tab))
        || (/** @type {number} */ (u.get(ck(a))) - /** @type {number} */ (u.get(ck(b)))));
    for (const c of tries) {
      if (!chooseSpeaker(c, new Set())) continue;
      speak(c, new Set());
      if (quotes.has(ck(c))) { outcome.set(ck(c), 'quote:floor'); break; }
      giveBack(ck(c)); // the card printed nothing: its mouth is given back for the next
    }
  }
  return { quotes, outcome, speakers, order, cards };
}
