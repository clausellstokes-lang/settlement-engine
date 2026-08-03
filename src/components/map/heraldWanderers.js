/**
 * heraldWanderers.js — the read model behind THE HERALD's WANDERERS register
 * (design DESIGN_NPC_CONSEQUENCES.md §8, wave W-H4).
 *
 * THE THIRD REGISTER. heraldRegister.js reports the two halves of the SETTLEMENT
 * roster: who is still standing (Gazetteer) and who is not (Ruins & Remembrance).
 * This one reports the register of PEOPLE the realm no longer has a place for: the
 * roaming pool, as an in-world ledger rather than a debug view of a state map.
 *
 * ONE TRUTH, TWO VIEWS (design §6c) — the invariant this file exists to hold. The
 * Wanderers tab is the WORLD scope and a settlement dossier's Unaffiliates section is
 * the LOCAL scope, and they are the SAME projection with a different filter, not two
 * read models. Both go through `projectNpcPool`, whose optional `settlementId`
 * argument was written by H1 precisely so H4 could not fork a second one. If these ever
 * disagree about who is where, it will be because someone added a third door, not
 * because the two drifted.
 *
 * THE SECRETS SEAM (law 7, AUDIENCE PROJECTION). A roamer's record carries DM truth:
 * where their leash was held is covert intelligence. `seesSecrets` rides straight into
 * the projection's `includeCovert`, so a player view is never BUILT with the covert
 * field rather than being built and hidden. This module adds no second scrub of its
 * own, because a second scrub is a second thing that can be forgotten; the allowlist
 * one door up is the whole mechanism.
 *
 * THE LEGIBILITY LAW. Every row is SENTENCES in world words. This register never
 * prints a band token ('notorious'), a verdict token ('criminal_founding'), a tick, or
 * a durable id: the notoriety band becomes what people say, the verdict cause becomes
 * the one-line why the design asks each card to carry, and the time in the pool becomes
 * TURNINGS, the Herald's own established time word. The ONE id that reaches the page is
 * a settlement save id, and only inside a RealmEntityLink, where it is a destination
 * rather than a printed token.
 *
 * Pure; the sibling of heraldRegister.js / heraldFeed.js / heraldFilter.js. No rng, no
 * wall clock, no store, no React. It builds no state and rules on nothing.
 *
 * @enforced-by tests/ui/heraldWanderersRegister.test.jsx
 */

import { npcConsequencesActive } from '../../domain/worldPulse/npcLedger.js';
import { projectNpcPool } from '../../domain/worldPulse/npcLedgerProjection.js';
import { registerIdOf, registerNameOf } from './heraldRegister.js';

/**
 * Is the Wanderers door open for this campaign?
 *
 * PRESENCE, NEVER A DISABLED TAB (the ai_notes presence lesson). A realm whose rules do
 * not run the consequence economy has no roaming pool at all, so the door is ABSENT
 * rather than present-and-empty: an empty register of a system that is switched off
 * teaches a reader that the system is broken. The check is the canonical gate reader
 * from the ledger's own module, so this surface can never disagree with the engine
 * about whether the lane is live.
 *
 * @param {{ worldState?: unknown } | null | undefined} campaign
 * @returns {boolean}
 */
export function wanderersDoorOpen(campaign) {
  return npcConsequencesActive(campaign?.worldState || null);
}

/** A name lookup over the campaign's saves, in the register's own resolution order.
 *  Returns a function so a row builder never has to carry the saves array around.
 *  @param {ReadonlyArray<unknown>} [saves]
 *  @returns {(id: string) => string} */
export function settlementNameLookup(saves) {
  /** @type {Map<string, string>} */
  const byId = new Map();
  for (const save of Array.isArray(saves) ? saves : []) {
    const id = registerIdOf(save);
    if (id) byId.set(id, registerNameOf(save));
  }
  return (id) => byId.get(String(id)) || '';
}

/** What people say about them. The band is an ORDERED closed vocabulary; this is its
 *  sentence, and no rung is allowed to fall through to a raw token. */
const NOTORIETY_LINE = Object.freeze({
  unknown: 'No word of them has travelled ahead.',
  whispered: 'Their name is spoken quietly, and not often.',
  known: 'Their name is known on the roads.',
  notorious: 'Their name carries badly wherever it is spoken.',
  infamous: 'There is nowhere in the realm their name is not known.',
});

/** The one-line WHY each card carries (design §6c). Total over VERDICT_CAUSES. */
const CAUSE_LINE = Object.freeze({
  none: 'They keep their own counsel about why they left.',
  jailed: 'They are held under sentence.',
  banished: 'They were put out by an edict.',
  turncoat: 'They went over to another power.',
  criminal_founding: 'They threw in with the underworld.',
  destruction_dispersal: 'Their home was destroyed and scattered its people.',
});

/** How the world reads their capability, when it has formed a read at all.
 *  DELIBERATELY TOKEN-FREE: no line here repeats its own band word, so a pin can
 *  assert that no vocabulary token reaches the page without having to carve out
 *  exceptions for the rungs whose token happens to be an ordinary English word. */
const COMPETENCE_LINE = Object.freeze({
  unknown: '',
  inept: 'Those who have dealt with them thought little of their skill.',
  adequate: 'They are reckoned to do what is asked of them.',
  capable: 'They are reckoned a steady pair of hands.',
  formidable: 'Even those who will not have them speak of their skill with respect.',
});

/** The nature of the story that follows them, when there is one. */
const SCANDAL_LINE = Object.freeze({
  none: '',
  venality: 'What is spoken of them is a matter of bought loyalty.',
  betrayal: 'What is spoken of them is a matter of betrayal.',
  brutality: 'What is spoken of them is a matter of cruelty.',
  conspiracy: 'What is spoken of them is a matter of conspiracy.',
  heresy: 'What is spoken of them is a matter of heresy.',
});

/**
 * How long they have been on the road, in TURNINGS. A tick is an engine count and never
 * reaches the page; the band is what the reader gets. The bands mirror
 * heraldRegister.turningsAgoLabel's shape so the two registers speak the same time.
 *
 * @param {number} elapsedTicks
 * @returns {string}
 */
function wanderingLabel(elapsedTicks) {
  const elapsed = Number.isFinite(elapsedTicks) ? Number(elapsedTicks) : 0;
  if (elapsed <= 0) return 'On the road since this turning.';
  if (elapsed === 1) return 'On the road since last turning.';
  if (elapsed <= 4) return 'On the road a few turnings now.';
  if (elapsed <= 13) return 'On the road some turnings now.';
  return 'On the road longer than most care to count.';
}

/** The same span, said for somebody who is NOT roaming (jailed, or settled again). */
function restingLabel(elapsedTicks) {
  const elapsed = Number.isFinite(elapsedTicks) ? Number(elapsedTicks) : 0;
  if (elapsed <= 0) return 'Their standing changed this turning.';
  if (elapsed === 1) return 'Their standing changed last turning.';
  if (elapsed <= 4) return 'Their standing has held a few turnings.';
  if (elapsed <= 13) return 'Their standing has held some turnings.';
  return 'Their standing has held longer than most care to count.';
}

/**
 * The title line: design §6c asks for a "(former ...)" prefix, so a reader sees at a
 * glance that the office is in the past tense. A person the ledger holds no role for
 * gets an honest plain word instead of an empty parenthesis.
 * @param {string} role @returns {string}
 */
function formerTitle(role) {
  const r = String(role || '').trim();
  return r ? `former ${r}` : 'no office in the realm';
}

/** How many doors are shut, as a sentence rather than a count beside an id list. */
function shutDoorsLine(shutDoors, nameFor) {
  const doors = Array.isArray(shutDoors) ? shutDoors : [];
  if (doors.length === 0) return '';
  if (doors.length === 1) {
    const where = nameFor(doors[0]);
    return where ? `${where} will not have them back.` : 'One gate is shut against them.';
  }
  return `${doors.length} gates are shut against them.`;
}

/**
 * @typedef {Object} WandererRow
 * @property {string} key            a stable React key; NEVER rendered
 * @property {string} name
 * @property {string} title          the "(former ...)" line
 * @property {boolean} roaming       false ⇒ hosted somewhere (jailed, or settled again)
 * @property {string} whyLine        the one-line why (design §6c)
 * @property {string} notorietyLine  what people say
 * @property {ReadonlyArray<string>} standingLines  competence / scandal, when read
 * @property {string} whenLine       the time band, in turnings
 * @property {string} doorsLine      the shut-doors sentence, or ''
 * @property {string} whereaboutsLine the supported present-location sentence, or ''
 * @property {string} originId       the origin STORY POINTER, for a link (never printed)
 * @property {string} originName
 * @property {string} restingId      where they are now, for a link (never printed)
 * @property {string} restingName
 * @property {string} dmLine         DM-ONLY: the covert read, or '' for a player
 */

/** Where their leash was held. DM TRUTH: this branch is only reachable when the
 *  projection was asked for the covert half, so a player row can never carry it. */
const COMPROMISE_LINE = Object.freeze({
  rival_power: 'Your notes: a rival power held their leash.',
  criminal_institution: 'Your notes: the underworld held their leash.',
});

/**
 * Build ONE register row from ONE projected person.
 *
 * ONE GATE, NOT TWO. This function deliberately does NOT take `seesSecrets`. The
 * audience decision was made one door up, by the projection, which BUILDS the covert
 * field or does not; reading the flag again here would be a second gate that can
 * disagree with the first, and the failure mode of a second gate is that it MASKS a
 * leak in the first (a projection that started shipping covert data to players would
 * keep looking correct because the row was hiding it anyway). So the presence of the
 * field IS the permission, and a pin that breaks the projection's gate reds here.
 *
 * @param {Record<string, unknown>} person
 * @param {(id: string) => string} nameFor
 * @param {boolean} roaming
 * @returns {WandererRow}
 */
function rowOf(person, nameFor, roaming) {
  const originId = String(person.originSettlementId || '');
  const restingId = String(person.restingAt || person.hostSettlementId || '');
  const covert = person.dmTruth && typeof person.dmTruth === 'object'
    ? String(/** @type {Record<string, unknown>} */ (person.dmTruth).compromiseSource || '')
    : '';
  const standing = [
    COMPETENCE_LINE[String(person.competenceRead || 'unknown')] || '',
    SCANDAL_LINE[String(person.scandalClass || 'none')] || '',
  ].filter(Boolean);
  return {
    key: String(person.wnpcId || ''),
    name: String(person.name || '') || 'A stranger',
    title: formerTitle(String(person.role || '')),
    roaming,
    whyLine: CAUSE_LINE[String(person.verdictCause || 'none')] || CAUSE_LINE.none,
    notorietyLine: NOTORIETY_LINE[String(person.notorietyBand || 'unknown')] || NOTORIETY_LINE.unknown,
    standingLines: Object.freeze(standing),
    whenLine: roaming
      ? wanderingLabel(Number(person.elapsedTicks))
      : restingLabel(Number(person.elapsedTicks)),
    doorsLine: shutDoorsLine(person.shutDoors, nameFor),
    whereaboutsLine: person.whereaboutsUnknown === true
      ? 'Their present whereabouts are unknown.'
      : '',
    originId,
    originName: nameFor(originId),
    restingId,
    restingName: nameFor(restingId),
    // Present ONLY because the projection built it. A player row cannot reach this
    // branch, because a player projection carries no covert field to read.
    dmLine: COMPROMISE_LINE[covert] || '',
  };
}

/**
 * THE WANDERERS REGISTER — the realm's roaming pool, world scope.
 *
 * Roamers lead, because they are what the register is FOR; the people the pool has
 * already placed follow, so the DM can see the whole graduated cast in one page without
 * two doors. Order inside each half is the projection's own codepoint order, which is
 * permutation-independent and therefore stable across saves.
 *
 * @param {Object} args
 * @param {any} args.campaign
 * @param {ReadonlyArray<unknown>} [args.saves]
 * @param {boolean} [args.seesSecrets]  a proven owner session (viewerSeesDmSecrets)
 * @returns {{ roaming: WandererRow[], settled: WandererRow[], total: number }}
 */
export function wandererRows({ campaign, saves, seesSecrets = false }) {
  if (!wanderersDoorOpen(campaign)) return { roaming: [], settled: [], total: 0 };
  const worldState = campaign?.worldState || null;
  const tick = Number(campaign?.worldState?.tick) || 0;
  const nameFor = settlementNameLookup(saves);
  const pool = projectNpcPool({ worldState, tick, includeCovert: seesSecrets === true });
  return {
    roaming: pool.roamers.map((p) => rowOf(p, nameFor, true)),
    settled: pool.placed.map((p) => rowOf(p, nameFor, false)),
    total: pool.total,
  };
}

/**
 * THE UNAFFILIATES SECTION — the SAME ledger, local scope (design §6c).
 *
 * "Roamers REST somewhere": a settlement's dossier shows the people who are lodging
 * here without belonging to anything here, plus the graduated people this settlement
 * actually hosts (a released official, a jailed one). It is one projection call with a
 * settlementId, and that is the whole difference between this and the world register.
 *
 * @param {Object} args
 * @param {any} args.campaign
 * @param {string} args.settlementId
 * @param {ReadonlyArray<unknown>} [args.saves]
 * @param {boolean} [args.seesSecrets]
 * @returns {{ roaming: WandererRow[], settled: WandererRow[], total: number }}
 */
export function unaffiliateRows({ campaign, settlementId, saves, seesSecrets = false }) {
  if (!wanderersDoorOpen(campaign) || !settlementId) return { roaming: [], settled: [], total: 0 };
  const worldState = campaign?.worldState || null;
  const tick = Number(campaign?.worldState?.tick) || 0;
  const nameFor = settlementNameLookup(saves);
  const pool = projectNpcPool({
    worldState,
    tick,
    includeCovert: seesSecrets === true,
    settlementId: String(settlementId),
  });
  return {
    roaming: pool.roamers.map((p) => rowOf(p, nameFor, true)),
    settled: pool.placed.map((p) => rowOf(p, nameFor, false)),
    total: pool.total,
  };
}
