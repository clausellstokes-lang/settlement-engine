/**
 * domain/voices/cardsOf.js — THE CARD ADAPTERS (S-G1): the six card kinds a quote may sit on, read off the record by the
 * readers the cards themselves print from (VOICES-CARDS' `survey/cards/A-cards.md`, `D-speakers.md`, `E-states.md`; the
 * chair's rulings E28).
 *
 *   cardsOf(settlement, { customTraditions })   every card of the six kinds, in TAB ORDER (the crisis first, ruling 8):
 *                                               { kind, id, tab, label, state, pools, weight, silent, tiers, house, power,
 *                                                 exclude, fill, wrongedFit }
 *
 * ONE CARD A THING (ruling 4): a seat power is its roster row (`FactionRow`) alone, never the seat card; a tension is its
 * History card (`TensionRow`) alone, never the Overview's row. A SURFACE SHOWS A QUOTE ONLY WHERE IT SHOWS THE CARD
 * (ruling 5): the surfaces read this one list.
 *
 * STABLE IDS (ruling 7): a person `npc.id`; the crisis `crisis.<type>` (its page section's own id); an institution its
 * catalogue id where it has one, else its name; a power its roster key (`factionIdFromName`); a tension its `type`; a
 * tradition its stored `rec.id` once the town is lit, else its element and act. SAID HERE: a DM's rename of a power, or
 * of a custom house with no catalogue id, re-deals that one card's quote (point 124's unit K3 may give a power a stored
 * id later; this is the one place that would change).
 *
 * THE WEIGHT (VOICES-CARDS' C-weight table, the owner's to sign with the numbers): `WEIGHTY` below, one predicate a kind.
 * Everything else is lesser. NAMED FOR THE CHAIR: C's institution row also counts an Impaired house weighty; the chain
 * sets that say "Impaired" are read by a component helper (`tabHelpers.js :: computeChainSets`) the domain may not import,
 * so this predicate reads the crisis role and the mark alone (88 houses of 34,407 on C were Impaired).
 *
 * A card's SPEAKERS are given as TIERS of people (the first tier is the card's own: the house's face and people, the
 * power's members, the crisis's cast, the rite's keepers; the next is anyone else), filtered for the reader by the plan.
 * Which tier a kind and state draws from is the plan's rule, decided from the record, never from a pool's lines (a line
 * added to a pool moves no speaker).
 *
 * Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/voices/voicePlan.test.js
 */
import { houseFamilyOf } from './houseFamily.js';
import { cardHouseOf, facesByHouse, isHousePublic } from '../people/cardPowers.js';
import { holdsMembership, membersByRank } from '../people/membership.js';
import { isHideableHouse, isVeiledPower } from '../people/cardVeil.js';
import { isCriminalPower } from '../people/allegiance.js';
import { seatHouseFaceOf } from '../dossier/seatHolder.js';
import { derivePowerStrata } from '../dossier/powerStrata.js';
import { composeCrisisPage } from '../crisis/crisisPage.js';
import { crisisNounOf, isVentureMark, rowShortOf, rowStoppedBy, stoppingCrisesOf } from '../display/crisisStoppedRow.js';
import { shownTraditionsOf } from '../traditions/shownTraditions.js';
import { describeTraditions } from '../traditions/traditionDescription.js';
import { legitimacyCrisisOf } from '../facts/legitimacyCrisis.js';
import { powerNameWithArticle } from '../display/powerSentenceName.js';
import { factionIdFromName } from '../../lib/entities.js';

/** The tabs a quote can sit on, in the plan's order (ruling 8: the crisis card first, then tab order). */
export const VOICE_TABS = Object.freeze(['crisis', 'institutions', 'power', 'npcs', 'traditions', 'history']);

/** A current tension's type → the group its lines are keyed on (A-keys §3, with ruling L-1's merges). */
export const TENSION_GROUP = Object.freeze(/** @type {Record<string, string>} */ ({
  legitimacy_crisis: 'rule', tyranny: 'rule', popular_uprising: 'rule', succession_crisis: 'rule', leadership_vacuum: 'rule',
  guild_conflict: 'trade', trade_dispute: 'trade',
  resource_scarcity: 'want', demographic_pressure: 'want',
  outside_debt: 'money', market_crash: 'money', trade_collapse: 'money', economic_disparity: 'money',
  plague_years: 'calamity', great_fire: 'calamity', great_flood: 'calamity',
  religious_tension: 'faith', heresy_trial: 'faith', pilgrimage_surge: 'faith',
  crime_wave: 'crime', corruption_scandal: 'crime',
  generational_divide: 'neighbours', population_friction: 'neighbours', disputed_land: 'neighbours',
  infiltration_fear: 'neighbours', occupation_legacy: 'neighbours',
  external_threat: 'threat',
  magical_controversy: 'arcane', wild_magic: 'arcane',
}));

/** A crisis kind → the group its lines are keyed on (A-keys §4). */
export const CRISIS_GROUP = Object.freeze(/** @type {Record<string, string>} */ ({
  succession_void: 'seat', politically_fractured: 'seat', wartime: 'war', occupied: 'war', recently_betrayed: 'trust',
  infiltrated: 'trust', indebted: 'debt', monster_pressure: 'raids', famine: 'hunger', insurgency: 'rising',
  slave_revolt: 'rising', under_siege: 'siege', mass_migration: 'newcomers', plague_onset: 'sickness',
  religious_conversion: 'faith',
}));

/**
 * RULING 3's preference: where a tension's line speaks for "one it has wronged", a person whose house family fits the
 * tension's group comes first (the traders for a quarrel over trade or a crime wave, the market for money trouble).
 * NAMED FOR THE CHAIR: the table is this seat's reading of the lines' `seen` column; a group it does not name has none.
 */
export const WRONGED_FIT = Object.freeze(/** @type {Record<string, ReadonlyArray<string>>} */ ({
  trade: Object.freeze(['workshop', 'market']),
  money: Object.freeze(['market', 'inn', 'workshop']),
  crime: Object.freeze(['workshop', 'market', 'inn']),
  want: Object.freeze(['grain', 'field']),
}));

/** A rite's act → its pool (A-keys §5: the acts of `data/traditionCorpus.js`). */
const TRADITION_ACT_POOLS = Object.freeze(['feast', 'fair', 'procession', 'offering', 'vigil', 'contest']);

/**
 * THE WEIGHTY TABLE (VOICES-CARDS' C-weight, proposed; the owner's to sign beside the numbers). A card is weighty when its
 * kind's predicate holds; else lesser.
 */
export const WEIGHTY = Object.freeze({
  crisis: () => true,
  tension: (/** @type {{ severity: string[] }} */ t) => t.severity.includes('catastrophic'),
  power: (/** @type {{ ruler: boolean, stake: boolean }} */ p) => p.ruler || p.stake,
  institution: (/** @type {{ crisisRole: boolean, marked: boolean }} */ i) => i.crisisRole || i.marked,
  tradition: (/** @type {{ element: string }} */ r) => r.element === 'founding',
  person: (/** @type {{ influence: string, inCast: boolean }} */ n) => n.influence === 'high' || n.inCast,
});

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v.trim() : '');
/** @param {unknown} v @returns {Record<string, any>} */
const rec = (v) => (v && typeof v === 'object' ? /** @type {Record<string, any>} */ (v) : {});

/**
 * A named person of the record the plan may sign a quote with: named, not ousted, and whose house the public may see
 * (`cardPowers.js :: isHousePublic`: VOICES-CARDS' D, "the one function"). A veiled face is never a speaker.
 * @param {unknown} npc @returns {boolean}
 */
export function isLawfulSpeaker(npc) {
  const n = rec(npc);
  return !!str(n.name) && !!str(n.id) && !n.ousted && isHousePublic(/** @type {never} */ (n));
}

/**
 * @typedef {object} VoiceCard
 * @property {'crisis'|'institution'|'power'|'person'|'tradition'|'tension'} kind
 * @property {string} id the card's stable id (ruling 7)
 * @property {string} tab one of VOICE_TABS
 * @property {string} label what the card is of (for a measure's eye)
 * @property {string} state the card's state key (A-keys)
 * @property {string[]} pools the SAID_LINES pools its lines come from
 * @property {'weighty'|'lesser'} weight
 * @property {string | null} silent why the card never speaks (its kind or state), or null
 * @property {Array<Array<Record<string, any>>>} tiers its speakers by tier (lawful or not: the plan filters)
 * @property {string | null} house the house a keeper's line speaks for (an institution's, a person's own)
 * @property {string | null} power the power a member's line speaks for (a power card's own)
 * @property {Set<string>} exclude people who may never voice this card (a grievance's own officers: ruling 3)
 * @property {{ crisisNoun?: string, good?: string, seat?: string }} fill the slots' values the card can give
 * @property {ReadonlyArray<string>} wrongedFit the house families ruling 3 prefers for a grievance
 * @property {Record<string, any> | null} npc a person card's own person
 * @property {string | null} keeperTier0 the keepers of a rite are the first tier (the line's "keeper of the rites")
 */

/**
 * Every card, in tab order. `customTraditions`: the DM's authored traditions the Traditions tab merges in (its store).
 * @param {Record<string, any> | null | undefined} settlement
 * @param {{ customTraditions?: unknown }} [options]
 * @returns {VoiceCard[]}
 */
export function cardsOf(settlement, options = {}) {
  const s = rec(settlement);
  const npcs = /** @type {Record<string, any>[]} */ ((Array.isArray(s.npcs) ? s.npcs : []).filter((n) => n && typeof n === 'object'));
  const byId = new Map(npcs.map((n) => [str(n.id), n]));
  const crises = composeCrisisPage(s);
  const crisisNoun = crises.length ? crisisNounOf(crises[0].type) || '' : '';
  const castIds = new Set(crises.flatMap((c) => c.cast.filter((r) => r.kind === 'npc').map((r) => str(r.id))));
  const institutions = /** @type {Record<string, any>[]} */ ((Array.isArray(s.institutions) ? s.institutions : []).filter((i) => i && typeof i === 'object'));
  const instByName = new Map(institutions.map((i) => [str(i.name), i]));
  const faces = facesByHouse(npcs);
  const peopleOf = (/** @type {string} */ house) => npcs.filter((n) => cardHouseOf(n) === house);
  const strata = derivePowerStrata(/** @type {never} */ (s), { audience: 'owner' });
  const ruler = strata.powers.find((p) => p.role === 'ruler') || null;
  const seatName = ruler ? str(ruler.seatOf) || str(ruler.name) : '';
  const seatMembers = seatName ? new Set(npcs.filter((n) => holdsMembership(n, seatName)).map((n) => str(n.id))) : new Set();
  const fillSeat = seatName ? powerNameWithArticle(seatName, false) : '';
  const stopping = stoppingCrisesOf(s);
  const lever = new Set(crises.flatMap((c) => [...c.levers.map((l) => str(l.institution)), ...c.cast.filter((r) => r.kind === 'institution').map((r) => str(r.id))]));
  const stakes = new Set(crises.flatMap((c) => c.stakes.map((k) => str(k.factionId))));
  /** @type {VoiceCard[]} */
  const cards = [];
  /** @param {Partial<VoiceCard> & { kind: VoiceCard['kind'], id: string, tab: string }} c */
  const push = (c) => cards.push(/** @type {VoiceCard} */ ({
    label: '', state: '', pools: [], weight: 'lesser', silent: null, tiers: [], house: null, power: null, exclude: new Set(),
    fill: {}, wrongedFit: [], npc: null, keeperTier0: null, ...c,
  }));

  // ── THE CRISIS (ruling 8: first) ──
  for (const c of crises) {
    const group = Object.hasOwn(CRISIS_GROUP, c.type) ? CRISIS_GROUP[c.type] : null;
    const cast = c.cast.filter((r) => r.kind === 'npc').map((r) => byId.get(str(r.id))).filter(Boolean);
    push({
      kind: 'crisis', id: c.id, tab: 'crisis', label: c.label, state: group || '', pools: group ? [`crisis.${group}`] : [],
      weight: 'weighty', silent: group ? null : 'no-pool', tiers: [/** @type {Record<string, any>[]} */ (cast), npcs],
      fill: { crisisNoun: crisisNounOf(c.type) || '' },
    });
  }

  // ── THE INSTITUTIONS ──
  /** The condition of a house: its pools and slot values, or why it is silent. @param {Record<string, any>} inst */
  const conditionOf = (inst) => {
    const family = houseFamilyOf(inst);
    if (!family || ['criminal', 'works', 'exotic', 'access'].includes(family)) return { family, silent: `family-${family}`, pools: [], state: '', fill: {}, marked: false };
    if (isHideableHouse(inst)) return { family, silent: 'hideable', pools: [], state: '', fill: {}, marked: false };
    const stopped = rowStoppedBy(s, 'house', inst, stopping);
    if (stopped) return { family, silent: null, pools: ['institution.any-crisismarked'], state: 'crisismarked', fill: { crisisNoun: crisisNounOf(stopped) || crisisNoun }, marked: true };
    const short = rowShortOf(s, 'house', inst);
    if (short && isVentureMark(short)) return { family, silent: 'failing', pools: [], state: 'failing', fill: {}, marked: true };
    if (short) return { family, silent: null, pools: ['institution.any-short'], state: 'short', fill: short.split(/\s+/).length <= 2 ? { good: short } : {}, marked: true };
    if (crises.length) return { family, silent: null, pools: [`institution.${family}-ordinary`, 'institution.any-crisisunmarked'], state: 'crisisunmarked', fill: { crisisNoun }, marked: false };
    return { family, silent: null, pools: [`institution.${family}-ordinary`], state: 'ordinary', fill: {}, marked: false };
  };
  for (const inst of institutions) {
    const name = str(inst.name);
    if (!name) continue;
    const cond = conditionOf(inst);
    const face = faces.get(name) || seatHouseFaceOf(/** @type {never} */ (s), name) || null;
    const people = peopleOf(name).filter((n) => n !== face);
    push({
      kind: 'institution', id: str(inst.catalogId) || name, tab: 'institutions', label: name, state: `${cond.family}-${cond.state}`,
      pools: cond.pools, silent: cond.silent, weight: WEIGHTY.institution({ crisisRole: lever.has(name), marked: cond.marked }) ? 'weighty' : 'lesser',
      tiers: [face ? [face] : [], people], house: name, fill: cond.fill,
    });
  }

  // ── THE POWERS (the roster row: FactionRow) ──
  const legit = /** @type {Record<string, any>} */ (rec(rec(s.powerStructure).publicLegitimacy));
  const capture = str(rec(s.powerStructure).criminalCaptureState);
  for (const r of strata.roster) {
    const name = str(r.name);
    if (!name) continue;
    const id = factionIdFromName(name) || name;
    const members = membersByRank(npcs, name);
    const memberIds = new Set(members.map((n) => str(n.id)));
    const others = npcs.filter((n) => !memberIds.has(str(n.id)));
    const isRuler = r.powerRole === 'ruler';
    const criminal = isCriminalPower(r.faction) || isVeiledPower(r.faction);
    let state = 'lesser-standing';
    if (isRuler) {
      const contenders = ruler ? Number(ruler.contenderCount) || 0 : 0;
      const critical = contenders > 0 && !!ruler && ruler.gated === false;
      const doubted = critical || legitimacyCrisisOf(s) === true || /contested|crisis/i.test(str(legit.label));
      state = ['corrupted', 'capture'].includes(capture) ? 'seat-captured' : doubted ? 'seat-doubted'
        : contenders > 0 ? 'seat-contested' : 'seat-secure';
    } else if (r.powerRole === 'contender') state = 'lesser-contender';
    // whose mouth a power's lines want first (A-keys §2 and the lines' speaker rules): the aggrieved for a doubted or
    // captured seat; the rest of the town first for a contested one; its own members otherwise
    const tiers = ['seat-doubted', 'seat-captured'].includes(state) ? [others]
      : state === 'seat-contested' ? [others, members] : [members, others];
    push({
      kind: 'power', id, tab: 'power', label: name, state, pools: criminal ? [] : [`power.${state}`],
      silent: criminal ? 'criminal-power' : null,
      weight: WEIGHTY.power({ ruler: isRuler, stake: stakes.has(name) || stakes.has(id) }) ? 'weighty' : 'lesser',
      tiers, power: name, fill: fillSeat ? { seat: fillSeat } : {},
    });
  }

  // ── THE PEOPLE (a person's own card: a line of their own trade; the power's own face, three of its own) ──
  for (const npc of npcs) {
    const id = str(npc.id);
    if (!id || !str(npc.name)) continue;
    const house = cardHouseOf(npc);
    const inst = house ? instByName.get(house) : null;
    const cond = inst ? conditionOf(inst) : null;
    const powerFace = !house && Array.isArray(npc.memberships) && npc.memberships.length > 0;
    const pools = cond && !cond.silent ? cond.pools : powerFace ? ['person.powerface'] : [];
    const silent = !isLawfulSpeaker(npc) ? 'not-lawful' : cond ? cond.silent : powerFace ? null : 'no-house';
    push({
      kind: 'person', id, tab: 'npcs', label: str(npc.name), state: cond ? `${cond.family}-${cond.state}` : powerFace ? 'powerface' : '',
      pools, silent, weight: WEIGHTY.person({ influence: str(npc.influence), inCast: castIds.has(id) }) ? 'weighty' : 'lesser',
      tiers: [[npc]], house: house || null, npc, fill: cond ? cond.fill : {},
    });
  }

  // ── THE TRADITIONS ──
  const shown = shownTraditionsOf(/** @type {never} */ (s), options.customTraditions);
  const lit = !shown.preview;
  const described = describeTraditions(shown.recs, /** @type {never} */ (s), { audience: 'owner' });
  shown.recs.forEach((r, at) => {
    const motif = rec(r.coreMotif);
    const element = str(motif.element);
    const act = str(motif.act);
    const named = described[at] ? described[at].named : { houses: [], powers: [] };
    const keepers = [
      ...named.houses.map((h) => faces.get(h) || null).filter(Boolean),
      ...named.powers.flatMap((p) => membersByRank(npcs, p).slice(0, 3)),
    ];
    const pools = [...(TRADITION_ACT_POOLS.includes(act) ? [`tradition.${act}`] : []), ...(crises.length ? ['tradition.any-crisis'] : [])];
    push({
      kind: 'tradition', id: lit && str(r.id) ? str(r.id) : `${element}.${act}`, tab: 'traditions', label: str(r.name), state: act,
      pools, silent: pools.length ? null : 'no-pool', weight: WEIGHTY.tradition({ element }) ? 'weighty' : 'lesser',
      tiers: [/** @type {Record<string, any>[]} */ (keepers), npcs], fill: { crisisNoun }, keeperTier0: 'keeper',
    });
  });

  // ── THE TENSIONS (the History card: TensionRow) ──
  const tensions = Array.isArray(rec(s.history).currentTensions) ? rec(s.history).currentTensions : [];
  const rosterNames = new Set(strata.roster.map((r) => str(r.name)));
  for (const t of tensions) {
    const type = str(rec(t).type);
    if (!type) continue;
    const group = Object.hasOwn(TENSION_GROUP, type) ? TENSION_GROUP[type] : null;
    const severity = (Array.isArray(t.severity) ? t.severity : [t.severity]).map(str);
    // RULING 3: never a member of a power the tension names (a grievance is never voiced by an officer of the power it
    // complains of); a quarrel over the rule is never voiced by the seat's own
    const named = /** @type {unknown[]} */ (Array.isArray(t.factions) ? t.factions : []).map(str).filter((f) => rosterNames.has(f));
    const exclude = new Set(npcs.filter((n) => named.some((/** @type {string} */ p) => holdsMembership(n, p))).map((n) => str(n.id)));
    if (group === 'rule') for (const m of seatMembers) exclude.add(m);
    const fit = group && Object.hasOwn(WRONGED_FIT, group) ? WRONGED_FIT[group] : [];
    const fitted = fit.length ? npcs.filter((n) => fit.includes(houseFamilyOf(instByName.get(cardHouseOf(n) || '') || null) || '')) : [];
    push({
      kind: 'tension', id: type, tab: 'history', label: type, state: group || '', pools: group ? [`tension.${group}`] : [],
      silent: group ? null : 'no-pool', weight: WEIGHTY.tension({ severity }) ? 'weighty' : 'lesser',
      tiers: fitted.length ? [fitted, npcs] : [npcs], exclude, wrongedFit: fit, fill: {},
    });
  }

  for (const c of cards) c.fill = { ...c.fill, ...(fillSeat && !c.fill.seat ? { seat: fillSeat } : {}) };
  return attachContext(cards, { seatName, seatMembers, instByName });
}

/** @typedef {{ seatName: string, seatMembers: Set<string>, instByName: Map<string, Record<string, any>> }} VoiceContext */
/**
 * The page-level facts a line's speaker rule reads, carried on the list (not on each card).
 * @param {VoiceCard[]} cards @param {VoiceContext} ctx
 * @returns {VoiceCard[] & { context: VoiceContext }}
 */
function attachContext(cards, ctx) {
  return Object.assign(cards, { context: ctx });
}
