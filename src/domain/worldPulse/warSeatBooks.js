/**
 * warSeatBooks.js — WR-5's pure ruler/realm objective read.
 *
 * A war decision is made by a legitimate seat, not by an abstract settlement.
 * This leaf resolves that seat through the existing governing-faction and ladder
 * authorities, then describes how much of the decision belongs to the realm's
 * books, the ruler's private books, or (for an exactly matched foreign asset) a
 * covert patron's books. It owns no state, performs no roll, and writes no prose.
 *
 * The authority signature deliberately excludes display names. A faction or NPC
 * rename must not look like a succession. The signature changes only when the
 * ladder's ruling NPC changes, a stable governing-faction id changes, or the
 * label-free transfer lineage records another legitimate power transfer.
 */

import { clamp01 } from '../../kernel/math.js';
import { acquiredTraitDescriptors, TRAIT_AGGRESSION, TRAIT_ALIGNMENT } from '../../data/npcTraitWeights.js';
import { governanceLedger } from '../governanceLedger.js';
import { npcFacetOf } from '../npc/npcBank.js';
import {
  authorityTransferEpochFor,
  governingFactionOf,
  previousGovernmentLabelsOf,
  nameOf,
} from '../rulingPower.js';
import { isOffStage } from '../roads/state.js';
import { factionArchetype } from '../factionArchetypes.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { npcId } from './npcAgency.js';
import { foreignAssetsByPatron } from './corruptionWeb.js';
import { rulingSeatNidOf } from './gratitudeBonds.js';
import { lawWordFor } from './lawWord.js';
import { LADDER_TUNING, ladderFactionKey, npcInFaction } from './npcLadderState.js';
import { coalitionConsolidation01, settlementPoliticsActive } from './settlementPolitics.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {number|null} */
function finite(value) {
  if (value == null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** Repository-wide deterministic order without locale-dependent collation. */
function compareCodepoint(/** @type {string} */ a, /** @type {string} */ b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {unknown} snapshot @returns {{settlements?:unknown[], byId?:Map<string, unknown>}} */
function snapshotShape(snapshot) {
  return /** @type {{settlements?:unknown[], byId?:Map<string, unknown>}} */ (asObject(snapshot));
}

/** The canonical snapshot item for an id, tolerating a snapshot without byId. */
function itemFor(/** @type {unknown} */ snapshot, /** @type {string} */ id) {
  const shaped = snapshotShape(snapshot);
  if (shaped.byId instanceof Map) return shaped.byId.get(id) || null;
  const items = Array.isArray(shaped.settlements) ? shaped.settlements : [];
  return items.find((raw) => String(asObject(raw).id ?? '') === id) || null;
}

/** @param {unknown} item @returns {Record<string, unknown>} */
function settlementOf(item) {
  const row = asObject(item);
  const nested = asObject(row.settlement);
  return Object.keys(nested).length ? nested : row;
}

/** Locate a roster NPC by the same stable id the ladder stores. */
function rosterNpcById(/** @type {string} */ sid, /** @type {Record<string, unknown>} */ settlement, /** @type {string|null} */ wanted) {
  if (!wanted) return null;
  const roster = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  for (let index = 0; index < roster.length; index += 1) {
    const npc = asObject(roster[index]);
    if (npcId(sid, /** @type {Parameters<typeof npcId>[1]} */ (npc), index) !== wanted) continue;
    // The roster keeps dead people as canon; a stale pre-ladder rung may still
    // name one during the interval in which the vacancy has not reconciled.
    // Their identity remains in the authority signature (a kill is not itself a
    // succession), but their character must never continue making decisions.
    if (String(npc.status || '').toLowerCase() === 'dead' || isOffStage(npc)) return null;
    return npc;
  }
  return null;
}

/** Power fields in this estate may be 0..1 or 0..100. */
function normalizedPower(value) {
  const number = finite(value);
  if (number == null) return null;
  return clamp01(number > 1 ? number / 100 : number);
}

/** The governing faction's share of the recorded faction power, when readable. */
function governingPowerShare(settlement, governing) {
  const factions = Array.isArray(asObject(settlement.powerStructure).factions)
    ? /** @type {Record<string, unknown>[]} */ (asObject(settlement.powerStructure).factions)
    : [];
  const powerOf = (/** @type {Record<string, unknown>} */ faction) => {
    for (const key of ['power', 'influence', 'score', 'weight']) {
      const value = normalizedPower(faction[key]);
      if (value != null) return value;
    }
    return null;
  };
  const govPower = governing ? powerOf(asObject(governing)) : null;
  if (govPower == null) return null;
  const readable = factions.map((faction) => powerOf(asObject(faction))).filter((value) => value != null);
  const total = readable.reduce((sum, value) => sum + /** @type {number} */ (value), 0);
  return total > 0 ? clamp01(govPower / total) : govPower;
}

/**
 * The explicit internal rival that would be strengthened by a victory. This is
 * intentionally sparse: only a non-governing military/noble faction joined to
 * the governing seat by an authored competitive/escalating relationship counts.
 * A merely powerful faction is not silently declared a rival.
 */
function rivalTriumph01(settlement, governing) {
  if (!governing) return 0;
  const power = asObject(settlement.powerStructure);
  const factions = Array.isArray(power.factions)
    ? /** @type {Record<string, unknown>[]} */ (power.factions.map(asObject))
    : [];
  const relationships = Array.isArray(power.factionRelationships)
    ? power.factionRelationships.map(asObject)
    : [];
  const governingName = nameOf(governing);
  let strongest = 0;
  for (const faction of factions) {
    if (faction === governing || faction.isGoverning === true) continue;
    const archetype = String(factionArchetype(/** @type {any} */ (faction)) || '');
    if (!['military', 'noble'].includes(archetype)) continue;
    const name = nameOf(/** @type {any} */ (faction));
    const opposed = relationships.some((relationship) => {
      const pair = Array.isArray(relationship.pair) ? relationship.pair.map(String) : [];
      if (!pair.includes(governingName) || !pair.includes(name)) return false;
      const type = String(relationship.type || '').toLowerCase();
      const direction = String(relationship.direction || '').toLowerCase();
      return ['competitive', 'hostile', 'adversarial', 'rival'].includes(type)
        || ['escalating', 'worsening'].includes(direction);
    });
    if (!opposed) continue;
    strongest = Math.max(strongest, governingPowerShare(settlement, faction) || 0);
  }
  return round4(clamp01(strongest));
}

/**
 * Resolve the ruling seat from the canonical key first. Name-only factions need
 * two bounded compatibility paths. After a real governing transfer, the ladder
 * and name-only NPC affiliations may still carry the exact previous-government
 * label. After a pure rename, the rename cascade has already moved the NPC's
 * affiliation while the ladder still has its old key. Both paths inspect only
 * persisted rungs and require a live roster member; neither re-derives a ruler.
 */
function rulingSeatId(worldState, actorId, settlement, governing) {
  const ladder = asObject(getSpatialLedger(worldState, 'npcLadder'));
  const record = asObject(ladder[actorId]);
  const canonical = rulingSeatNidOf(record, settlement);
  if (canonical || !governing) return canonical;
  const factionRecords = asObject(record.factions);
  const aliasLabels = previousGovernmentLabelsOf(
    /** @type {Parameters<typeof previousGovernmentLabelsOf>[0]} */ (settlement),
  );
  const aliasFactions = aliasLabels.map((label) => {
    const faction = { faction: label };
    return { faction, key: ladderFactionKey(faction) };
  });
  for (const rungAlias of aliasFactions) {
    const rungs = asObject(factionRecords[rungAlias.key]).rungs;
    if (!Array.isArray(rungs)) continue;
    for (const rawNid of rungs) {
      const nid = typeof rawNid === 'string' && rawNid ? rawNid : null;
      const npc = rosterNpcById(actorId, settlement, nid);
      // A rung persisted under the exact immediately-previous governing-body
      // alias has already been vetted by the ladder. Keep that living holder
      // even after the bounded label history drops the NPC's oldest authored
      // affiliation; otherwise a long-lived clerk becomes magically unseated
      // on the seventh legitimate transfer.
      if (nid && npc) return nid;
    }
  }
  const currentKey = ladderFactionKey(
    /** @type {Parameters<typeof ladderFactionKey>[0]} */ (governing),
  );
  for (const priorKey of Object.keys(factionRecords).sort(compareCodepoint)) {
    const rungs = asObject(factionRecords[priorKey]).rungs;
    if (!Array.isArray(rungs)) continue;
    for (const rawNid of rungs) {
      const nid = typeof rawNid === 'string' && rawNid ? rawNid : null;
      const npc = rosterNpcById(actorId, settlement, nid);
      if (nid && npc && npcInFaction(
        npc,
        /** @type {Parameters<typeof npcInFaction>[1]} */ (governing),
        currentKey,
      )) return nid;
    }
  }
  return null;
}

/** The ruler's authoritative ladder standing, normalized to 0..1. */
function rulerStanding01(worldState, actorId, rulerId) {
  if (!rulerId) return null;
  const ladder = asObject(getSpatialLedger(worldState, 'npcLadder'));
  const standing = asObject(asObject(asObject(ladder[actorId]).npcs)[rulerId]);
  const stock = finite(standing.stock);
  return stock == null ? null : clamp01(stock / LADDER_TUNING.STAND_MAX);
}

/** Authored personality plus learned overlay; declared temperament is included once. */
function rulerTraits(ruler) {
  if (!ruler) return [];
  const personality = ruler.personality;
  /** @type {string[]} */
  let traits;
  if (typeof personality === 'string') traits = [personality];
  else if (Array.isArray(personality)) traits = personality.filter((value) => typeof value === 'string').map(String);
  else {
    const p = asObject(personality);
    traits = [p.dominant, p.flaw, p.modifier]
      .filter((value) => typeof value === 'string')
      .map(String);
  }
  traits.push(...acquiredTraitDescriptors(
    /** @type {Parameters<typeof acquiredTraitDescriptors>[0]} */ (ruler),
  ));
  const declared = npcFacetOf(
    /** @type {Parameters<typeof npcFacetOf>[0]} */ (ruler),
    'temperament',
  );
  if (declared && !traits.some((trait) => trait.toLowerCase() === declared.toLowerCase())) traits.push(declared);
  return traits;
}

/** Sum a closed trait table, bounded so three descriptors cannot run away. */
function traitScore(ruler, table) {
  let score = 0;
  for (const trait of rulerTraits(ruler)) {
    const value = table[String(trait).trim().toLowerCase()];
    if (Number.isFinite(value)) score += value;
  }
  return Math.max(-1, Math.min(1, score));
}

/** Parse the existing NPC categorical/numeric alignment shapes. */
function alignmentAxes(value) {
  if (typeof value === 'string' && value) {
    const token = value.toLowerCase();
    return {
      lawfulness01: token.includes('lawful') ? 1 : token.includes('chaotic') ? 0 : 0.5,
      malice01: token.includes('evil') ? 1 : token.includes('good') ? 0 : 0.5,
    };
  }
  const row = asObject(value);
  const law = finite(row.law ?? row.lawfulness ?? row.order ?? row.lawfulness01);
  const malice = finite(row.malice ?? row.malice01);
  const good = finite(row.good ?? row.morality);
  if (law == null || (malice == null && good == null)) return null;
  return { lawfulness01: clamp01(law), malice01: clamp01(malice != null ? malice : 1 - /** @type {number} */ (good)) };
}

/** Declared alignment wins; otherwise the existing seeded npcState is the authority. */
function rulerAlignment(worldState, rulerId, ruler) {
  if (!rulerId || !ruler) return { lawfulness01: 0.5, malice01: 0.5 };
  const declared = npcFacetOf(
    /** @type {Parameters<typeof npcFacetOf>[0]} */ (ruler),
    'alignment',
  );
  const stateAlignment = asObject(asObject(worldState).npcStates)[rulerId];
  const axes = alignmentAxes(declared) || alignmentAxes(asObject(stateAlignment).alignment);
  if (axes) return axes;
  // Authored conscience is still a real ruler signal when the random/declared
  // categorical alignment is absent. Positive TRAIT_ALIGNMENT means good.
  const conscience = traitScore(ruler, TRAIT_ALIGNMENT);
  return { lawfulness01: 0.5, malice01: clamp01(0.5 - conscience * 0.35) };
}

/**
 * ⚠ CR-ES-3 (chair 2026-08-05, countersigned): THE SEAT VOCABULARY IS THE CONSUMER'S.
 *
 * This file's three seat-character ladders each disagreed with their consumers on
 * EXACTLY ONE RUNG — `chaotic` vs `lawless`, `benevolent` vs `merciful`, `contested` vs
 * `holding`. The consumers (`RANSOM_SEAT_*` in ransomChoices.js, `TESTIMONY_SEAT_*` in
 * envoyTestimony.js) normalize through `closedValue`, which nulls the WHOLE ROW on a
 * non-member, so a wired row would not have been mis-graded — it would have VANISHED.
 * `envoyTestimony`'s credibility-first arm already tested `lawfulnessBand === 'lawless'`,
 * a value this producer could not emit: a dead arm, shipped. The consumer sets are
 * EXPORTED constants two built leaves enforce; these words were module-private and
 * cheapest to move. Three rungs moved, not three vocabularies.
 *
 * ⛔ THE ALIGNMENT TOKEN PARSE IN `alignmentAxes` ABOVE IS A DIFFERENT VOCABULARY and is
 * DELIBERATELY UNTOUCHED. Its `token.includes('chaotic')` reads a D&D alignment string,
 * as `settlementPolitics.js` and `piety.js` do on their own inputs. A text sweep of the
 * word would break all three silently; the retarget is by SYMBOL.
 */

/** @param {number} value @returns {'merciful'|'balanced'|'malicious'} */
function moralityBand(value) {
  if (value >= 0.67) return 'malicious';
  if (value <= 0.33) return 'merciful';
  return 'balanced';
}

/** Closed ruler-goal tilt. Positive holds the war; negative seeks peace. */
const GOAL_WAR_DRIVE = Object.freeze({
  settle_rivalry: 0.7,
  expand_influence: 0.45,
  control_institution: 0.25,
  bind_external_patron: 0.2,
  mobilize_defenses: 0.55,
  punish_rivals: 0.85,
  consolidate_power: 0.35,
  secure_office: 0.25,
  protect_followers: -0.45,
  restore_order: -0.4,
  win_public_legitimacy: -0.25,
  survive_crisis: -0.65,
  survive_tribute: -0.35,
});

/** Directional private-books tilt; the four termination terms remain separate. */
function rulerBiases(ruler, axes) {
  if (!ruler) return { continueBias01: 0.5, peaceBias01: 0.5 };
  const aggression = traitScore(ruler, TRAIT_AGGRESSION);
  const goal = npcFacetOf(
    /** @type {Parameters<typeof npcFacetOf>[0]} */ (ruler),
    'goal',
  );
  const goalDrive = goal && Number.isFinite(GOAL_WAR_DRIVE[goal]) ? GOAL_WAR_DRIVE[goal] : 0;
  const maliceDrive = 2 * axes.malice01 - 1;
  const lawDrive = 2 * axes.lawfulness01 - 1;
  const drive = Math.max(-1, Math.min(1,
    aggression * 0.5 + goalDrive * 0.25 + maliceDrive * 0.2 - lawDrive * 0.05,
  ));
  const continueBias01 = round4(clamp01(0.5 + 0.35 * drive));
  return { continueBias01, peaceBias01: round4(1 - continueBias01) };
}

/**
 * Stable legitimate-authority signature. Display names are intentionally absent.
 * @param {{worldState?:unknown, snapshot?:unknown, actorId?:unknown}} args
 * @returns {string}
 */
export function authoritySignatureFor({ worldState = null, snapshot = null, actorId = '' } = {}) {
  const actor = String(actorId || '');
  const item = itemFor(snapshot, actor);
  const settlement = settlementOf(item);
  const governing = governingFactionOf(
    /** @type {Parameters<typeof governingFactionOf>[0]} */ (settlement),
  );
  const rulerId = rulingSeatId(asObject(worldState), actor, settlement, governing);
  const factionId = governing && typeof governing.id === 'string' && governing.id ? governing.id : null;
  return `authority:${JSON.stringify([actor, rulerId, factionId, authorityTransferEpochFor(settlement)])}`;
}

/** Exact ruling-seat asset, deterministic if malformed data supplies several patrons. */
function patronForSeat(snapshot, actorId, rulerId) {
  if (!rulerId) return null;
  const patrons = foreignAssetsByPatron(
    /** @type {Parameters<typeof foreignAssetsByPatron>[0]} */ (snapshotShape(snapshot)),
  );
  return [...patrons.keys()]
    .sort(compareCodepoint)
    .find((patronId) => (patrons.get(patronId) || [])
      .some((asset) => asset.targetId === actorId && asset.npcKey === rulerId)) || null;
}

/**
 * Read the two books for one actor against one opponent. All numeric fields are
 * ephemeral bounded controls; a persisted receipt should project their closed bands.
 * @param {{worldState?:unknown, snapshot?:unknown, actorId?:unknown, opponentId?:unknown}} args
 */
export function readWarSeatBooks({
  worldState = null,
  snapshot = null,
  actorId = '',
  opponentId = '',
} = {}) {
  const actor = String(actorId || '');
  const opponent = String(opponentId || '');
  const state = asObject(worldState);
  const item = itemFor(snapshot, actor);
  const settlement = settlementOf(item);
  const governing = governingFactionOf(
    /** @type {Parameters<typeof governingFactionOf>[0]} */ (settlement),
  );
  const rulerId = rulingSeatId(state, actor, settlement, governing);
  const ruler = rosterNpcById(actor, settlement, rulerId);
  const factionId = governing && typeof governing.id === 'string' && governing.id ? governing.id : null;
  const factionName = governing ? nameOf(governing) : '';
  const rulerName = ruler ? String(ruler.name || ruler.label || '').trim() : '';
  const signature = authoritySignatureFor({ worldState: state, snapshot, actorId: actor });

  // No ladder-backed ruler means the realm's books alone decide. The governing
  // body may still be identified, but no NPC identity or character is invented.
  if (!rulerId || !ruler) {
    return {
      actorId: actor,
      opponentId: opponent,
      authoritySignature: signature,
      interestKind: 'realm',
      settlementWeight01: 1,
      seatWeight01: 0,
      patronWeight01: 0,
      securityBand: 'unseated',
      lawfulness01: 0.5,
      malice01: 0.5,
      lawfulnessBand: 'balanced',
      moralityBand: 'balanced',
      continueBias01: 0.5,
      peaceBias01: 0.5,
      ...(factionId ? { factionId } : {}),
      ...(factionName ? { factionName } : {}),
    };
  }

  const axes = rulerAlignment(state, rulerId, ruler);
  const rivalRisk01 = rivalTriumph01(settlement, governing);
  const legitimacy = governanceLedger(
    /** @type {Parameters<typeof governanceLedger>[0]} */ (settlement),
  );
  const factionShare = governingPowerShare(settlement, governing);
  const standing01 = rulerStanding01(state, actor, rulerId);
  const politicsLit = settlementPoliticsActive(
    /** @type {Parameters<typeof settlementPoliticsActive>[0]} */ (state),
  );
  const consolidation01 = politicsLit
    ? coalitionConsolidation01(
      /** @type {Parameters<typeof coalitionConsolidation01>[0]} */ (state),
      actor,
      /** @type {Parameters<typeof coalitionConsolidation01>[2]} */ (item),
    )
    : null;

  // Absent machinery is not evidence of insecurity. Average only facts that are
  // genuinely present; a ruler with no security inputs reads the neutral midpoint.
  /** @type {Array<{value:number, weight:number}>} */
  const securityFacts = [];
  if (legitimacy.present) securityFacts.push({ value: clamp01(legitimacy.legitimacyScore / 100), weight: 0.35 });
  if (factionShare != null) securityFacts.push({ value: factionShare, weight: 0.25 });
  if (standing01 != null) securityFacts.push({ value: standing01, weight: 0.25 });
  if (consolidation01 != null) securityFacts.push({ value: consolidation01, weight: 0.15 });
  const securityWeight = securityFacts.reduce((sum, fact) => sum + fact.weight, 0);
  const security01 = securityWeight > 0
    ? clamp01(securityFacts.reduce((sum, fact) => sum + fact.value * fact.weight, 0) / securityWeight)
    : 0.5;
  const securityBand = security01 >= 0.67 ? 'secure' : security01 >= 0.4 ? 'holding' : 'precarious';

  const aggression = traitScore(ruler, TRAIT_AGGRESSION);
  const privateWeight = clamp01(
    0.2
      + (1 - security01) * 0.45
      + Math.max(0, axes.malice01 - 0.5) * 0.2
      + Math.max(0, aggression) * 0.15,
  );
  const patronId = patronForSeat(snapshot, actor, rulerId);
  const settlementWeight01 = round4(1 - privateWeight);
  const seatWeight01 = patronId ? 0 : round4(privateWeight);
  const patronWeight01 = patronId ? round4(privateWeight) : 0;
  const patronItem = patronId ? itemFor(snapshot, patronId) : null;
  const patronName = patronItem
    ? String(asObject(patronItem).name || settlementOf(patronItem).name || '').trim()
    : '';
  const patronSettlement = patronItem ? settlementOf(patronItem) : null;
  const patronGoverning = patronSettlement
    ? governingFactionOf(
      /** @type {Parameters<typeof governingFactionOf>[0]} */ (patronSettlement),
    )
    : null;
  const patronRulerId = patronId && patronSettlement
    ? rulingSeatId(state, patronId, patronSettlement, patronGoverning)
    : null;
  const patronRuler = patronId && patronSettlement
    ? rosterNpcById(patronId, patronSettlement, patronRulerId)
    : null;
  const patronAxes = patronRulerId && patronRuler
    ? rulerAlignment(state, patronRulerId, patronRuler)
    : null;
  // Compromise redirects the private book to the patron's actual court. If that
  // court cannot resolve a named ruler, the patron book stays neutral; borrowing
  // the compromised ruler's character would silently put the wrong person back in charge.
  const biases = patronId
    ? rulerBiases(patronRuler, patronAxes || { lawfulness01: 0.5, malice01: 0.5 })
    : rulerBiases(ruler, axes);

  return {
    actorId: actor,
    opponentId: opponent,
    authoritySignature: signature,
    interestKind: patronId ? 'patron' : 'seat',
    settlementWeight01,
    seatWeight01,
    patronWeight01,
    securityBand,
    lawfulness01: round4(axes.lawfulness01),
    malice01: round4(axes.malice01),
    lawfulnessBand: lawWordFor(axes.lawfulness01),
    moralityBand: moralityBand(axes.malice01),
    rivalTriumph01: rivalRisk01,
    rivalTriumphBand: rivalRisk01 >= 0.5 ? 'pressing' : rivalRisk01 > 0 ? 'present' : 'absent',
    ...biases,
    rulerId,
    ...(rulerName ? { rulerName } : {}),
    ...(factionId ? { factionId } : {}),
    ...(factionName ? { factionName } : {}),
    ...(patronId ? { patronId } : {}),
    ...(patronName ? { patronName } : {}),
    ...(patronRulerId ? { patronRulerId } : {}),
    ...(patronAxes ? {
      patronLawfulness01: round4(patronAxes.lawfulness01),
      patronMalice01: round4(patronAxes.malice01),
      patronLawfulnessBand: lawWordFor(patronAxes.lawfulness01),
      patronMoralityBand: moralityBand(patronAxes.malice01),
    } : {}),
  };
}
