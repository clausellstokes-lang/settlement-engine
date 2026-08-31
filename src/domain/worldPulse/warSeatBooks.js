/**
 * warSeatBooks.js — WR-5's pure ruler/realm objective read.
 *
 * A war decision is made by a legitimate seat, not by an abstract settlement.
 * This leaf resolves that seat through the existing governing-faction and ladder
 * authorities, then describes how much of the decision belongs to the realm's
 * books, the ruler's private books, (for an exactly matched foreign asset) a
 * covert patron's books, or — since W-SEAT SEAT-2a — an OVERT foreign seat's:
 * the occupier or overlord the owner's §735.2 directive names. It owns no state,
 * performs no roll, and writes no prose.
 *
 * ⛔ THE WEIGHTS ARE A PARTITION AND NOTHING OUTSIDE THIS FILE MAY HAND-SUM THEM.
 * See `seatBooksPartition` below for the law, the defect that wrote it, and the
 * one licensed exception.
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
import { foreignSeatOf } from '../rulingPowerSeat.js';
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
import { factionPowerShare01 } from '../factionPowerShare.js';
import { LADDER_TUNING, ladderFactionKey, npcInFaction } from './npcLadderState.js';
import { coalitionConsolidation01, settlementPoliticsActive } from './settlementPolitics.js';
import { stablePart } from './stablePart.js';

/** @typedef {import('../rulingPower.js').RulingFaction} RulingFaction */

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

/** A faction power field as 0..1, or null when unreadable — through the ONE reader.
 *  ⚠ THE COMMENT HERE USED TO READ "Power fields in this estate may be 0..1 or 0..100",
 *  which was the honest statement of an UNDECLARED UNIT and the licence for the magnitude
 *  sniff whose cliff at share=1 is §759.3. The unit is declared now: percent, 0-100. */
function normalizedPower(value) {
  return factionPowerShare01(finite(value));
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
 *
 * ⛔ `factionId` HERE IS DELIBERATELY NOT THE ADDRESS ID `readWarSeatBooks`
 * BUILDS BELOW, and the two expressions must not be re-converged. This one is
 * `.id`-only, so it is null on 100% of generated data (0 of 2,175 measured
 * powerStructure rows carry `id`) — that is the correct reading of the header's
 * rule that a faction rename must never look like a succession. The address id
 * below is a slug of the DISPLAY NAME; folding it into this signature would
 * make every rename break the war-decision continuity that reads this string.
 * Discrimination on generated worlds comes from `rulerId` plus the label-free
 * `authorityTransferEpochFor`; the `id` slot only sharpens it for authored
 * records that carry a genuinely rename-decoupled id.
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

/**
 * THE GOVERNING SEAT'S NEWS ADDRESS. The News Address Law requires every entry
 * to carry its full containment chain (settlement › power › faction › npc), and
 * this is the faction rung of that chain for every WR-5 war ruling.
 *
 * It cannot be `governing.id`: no generator writes one. The estate already
 * defines the settlement-scoped faction address space this must join —
 * `warRulingsNews.factionName` resolves `${settlementId}:${stablePart(name)}`
 * (its third arm) and `npcVerdictPulse` already MINTS `${settlementId}:${id}`
 * for the same `factionIds` slot. Until now that third arm was a reader with no
 * writer: the books emitted no faction id at all, so the war-ruling entries
 * omitted `factionIds` entirely and lost the faction rung of the address.
 *
 * A display-name slug is right HERE and wrong in the authority signature above:
 * an address is resolved at render time against the current roster, so a
 * renamed faction simply addresses under its new name, whereas the signature is
 * a continuity discriminator a rename must not disturb.
 *
 * ⭐ THE DERIVED FORM IS BYTE-IDENTICAL TO `realmFactionPulseId` (dossier/
 * realmEntityWeb.js), which is the id space the link web's `resolveFaction`
 * indexes — and that resolver REQUIRES the `<saveId>:<slug>` scoping, returning
 * null outright on a colonless id. The equality is pinned rather than shared by
 * import, because realmEntityWeb is a dossier-layer module and dragging it into
 * this lazy worldPulse leaf would re-parent its closure; see
 * tests/domain/warSeatBooksFactionAddress.test.js, which asserts the two agree
 * over real generated worlds and reds if either spelling drifts.
 *
 * ⏳ DELIBERATELY DEFERRED, not a bug to re-find: an AUTHORED `governing.id`
 * still passes through verbatim (unscoped), matching the estate-wide "authored
 * id wins verbatim" convention that `ladderFactionKey`, `npcInFaction` and
 * `entityLinks`' aliasIds all keep, and the contract asserted at
 * tests/domain/warSeatBooks.test.js:99. Such an id will not resolve in
 * `resolveFaction` unless it happens to carry a colon — a pre-existing property
 * of the authored path, unreachable on generated data (0 of 2,175 rows carry
 * `id`), and changing it means changing an asserted contract rather than fixing
 * a live defect.
 *
 * @param {string} settlementId @param {RulingFaction|null} governing @returns {string|null}
 */
function seatAddressFactionId(settlementId, governing) {
  if (!governing) return null;
  if (typeof governing.id === 'string' && governing.id) return governing.id;
  const name = nameOf(governing);
  return settlementId && name ? `${settlementId}:${stablePart(name)}` : null;
}

/**
 * THE OVERT FOREIGN BOOK (volume §3-D2, as ruled by A1.1.7).
 *
 * ⛔ THE ONE GATE FOR ALL NINE CONSUMERS. `readWarSeatBooks` has nine production
 * consumer files and ten call sites; gating the foreign book at each of them
 * would be nine chances to forget one, and the ninth would be a silent partial
 * lighting. The gate is HERE, once, so the whole family is dark or lit together.
 *
 * ⛔ THE POSITIVE `=== true` SPELLING IS LOAD-BEARING, NOT STYLE — the
 * engine-gated-key census (tests/lint/engineGatedRuleKeys.walker.test.js)
 * discovers virtual flags by scanning for exactly this form, and a negative-
 * polarity early return reads identically at runtime while being INVISIBLE to
 * it. The flag is read off the RAW worldState rather than normalized rules
 * because a virtual key has no `DEFAULT_SIMULATION_RULES` entry to normalize and
 * the normalizer would strip it (the `brokerageEffectsActive` idiom).
 *
 * ⚠ THE COVERT PATRON AND THE OVERT SEAT COEXIST, WITH DISTINCT PROVENANCE
 * (A1.1.7). A ruler bought by a foreign court and a town held by an occupier are
 * two different facts about two different substrates; folding them onto one
 * weight would be §711.6's failure — one name, two units, every consumer
 * internally consistent, nothing ever red. So `patronWeight01` keeps meaning
 * exactly "a compromised ruler's exact patron" and the occupier/overlord gets
 * its own book beside it.
 *
 * The foreign court's DIRECTION is read from that court's own seat, by the same
 * law the covert patron's is: no ruler resolvable there means the book votes the
 * neutral midpoint rather than borrowing the occupied ruler's character.
 *
 * @param {Record<string, unknown>} state @param {unknown} snapshot @param {string} actorId
 * @returns {{ view: import('../rulingPowerSeat.js').ForeignSeatView,
 *             continueBias01:number, peaceBias01:number, courtName:string } | null}
 */
function foreignBookFor(state, snapshot, actorId) {
  const simulationRules = asObject(state.simulationRules);
  if (simulationRules.foreignSeatEnabled !== true) return null;
  const view = foreignSeatOf(state, snapshot, actorId);
  if (!view || !(view.weight01 > 0)) return null;
  const courtId = String(view.patronSettlementId || '');
  const courtItem = courtId ? itemFor(snapshot, courtId) : null;
  const courtSettlement = courtItem ? settlementOf(courtItem) : null;
  const courtGoverning = courtSettlement
    ? governingFactionOf(
      /** @type {Parameters<typeof governingFactionOf>[0]} */ (courtSettlement),
    )
    : null;
  const courtRulerId = courtSettlement
    ? rulingSeatId(state, courtId, courtSettlement, courtGoverning)
    : null;
  const courtRuler = courtSettlement ? rosterNpcById(courtId, courtSettlement, courtRulerId) : null;
  const courtAxes = courtRulerId && courtRuler
    ? rulerAlignment(state, courtRulerId, courtRuler)
    : { lawfulness01: 0.5, malice01: 0.5 };
  const biases = rulerBiases(courtRuler, courtAxes);
  const courtName = courtItem
    ? String(asObject(courtItem).name || settlementOf(courtItem).name || '').trim()
    : '';
  return { view, ...biases, courtName };
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

// ── THE BOOKS ARE A PARTITION, AND THE PARTITION IS THE CONTRACT (A1.1.7) ────

/**
 * ⛔⛔ THE LAW THIS SECTION EXISTS TO ENFORCE, AND THE DEFECT THAT WROTE IT.
 *
 * Before W-SEAT SEAT-2a this record carried exactly THREE weights under a hard
 * XOR (`seatWeight01` and `patronWeight01` could never both be non-zero), and
 * every consumer that needed "the private mass" HAND-SUMMED the field names it
 * happened to know: `seat + patron` at armyTransitKernel:260 and
 * conquestFeasibility:546, `Math.max(seat, patron)` at sovereigntyIntent:262
 * (correct only BECAUSE of the XOR), and `realm + (seat + patron)` inside
 * warTermination's `blendBooksTerm`.
 *
 * That last one is the reason this is a law and not a helper. It re-normalized
 * by its OWN computed total, so a fourth weight it did not know about would
 * neither throw nor produce NaN — it would SILENTLY REDISTRIBUTE the missing
 * mass across the three books it did know, moving all four war-termination terms
 * with no receipt anywhere saying so. A defensive line was the most dangerous
 * line in the family precisely because it was defensive. ODQ §823 ordered it
 * cured FIRST, as "a typed refusal or an explicit fourth-weight admission, NEVER
 * silent"; this is the admission, generalized so the next book cannot repeat it.
 *
 * THE LAW: no consumer outside this file may enumerate book weight FIELD NAMES.
 * Read the partition. A fifth book then joins by adding one row to
 * `SEAT_BOOK_KINDS` and one key to `BOOK_WEIGHT_KEY`, and every mass every
 * consumer reads widens by construction rather than by a sweep that misses one.
 * The one licensed exception is `conquestFeasibility.js`, whose module header
 * declares "no imports at all"; it names the fourth weight literally and says so.
 *
 * @enforced-by tests/domain/warSeatBooksPartition.test.js (the closure law, the
 *   no-hand-sum source scan, and the dark-path bit-identity of `blendBooksTerm`).
 */
export const SEAT_BOOK_KINDS = Object.freeze(['realm', 'seat', 'patron', 'foreign']);

/** The record field each book's weight lives on. @type {Readonly<Record<string, string>>} */
const BOOK_WEIGHT_KEY = Object.freeze({
  realm: 'settlementWeight01',
  seat: 'seatWeight01',
  patron: 'patronWeight01',
  foreign: 'foreignWeight01',
});

/** Every book that is NOT the realm's. Ordered as `SEAT_BOOK_KINDS`. */
export const PRIVATE_BOOK_KINDS = Object.freeze(
  SEAT_BOOK_KINDS.filter((kind) => kind !== 'realm'),
);

/**
 * Four `round4`s cannot close to a bit-exact 1; the widest they can miss by is
 * 4 × 5e-5. This tolerance is an order of magnitude above that and two orders
 * below any weight difference a consumer bands on.
 */
const PARTITION_EPSILON = 1e-3;

/** @param {unknown} value @returns {number} */
function finiteWeight(value) {
  const number = Number(value);
  return Number.isFinite(number) ? clamp01(number) : 0;
}

/**
 * THE ENUMERATED BOOKS — `books[]`, derived rather than stored.
 *
 * A1.1.7 rules that "the seat books become `books[]`". They become one HERE, as
 * a projection over the record, so that the three field names three years of
 * consumers already read keep working and their pins keep meaning what they
 * meant, while every MASS question is answered from the enumeration.
 *
 * ⚠ `domesticPrivateMass01` is spelled `clamp01(seat + patron)` VERBATIM, not
 * summed through the generic loop, because `blendBooksTerm` must stay BIT
 * IDENTICAL on the dark path and `b*(x+y)` is not `b*x + b*y` in IEEE-754
 * (§713.3's law: n × k ≠ k summed n times). The foreign mass is added as a
 * separate product, and `w + 0`/`t * 0` are exact, so a dark run reproduces the
 * old arithmetic to the last bit rather than to six decimal places.
 *
 * @param {unknown} books
 * @returns {{ books: Array<{kind:string, weight01:number, private:boolean}>,
 *             realmMass01:number, domesticPrivateMass01:number, foreignMass01:number,
 *             privateMass01:number, total01:number, closed:boolean }}
 */
export function seatBooksPartition(books) {
  const row = asObject(books);
  const rows = SEAT_BOOK_KINDS.map((kind) => ({
    kind,
    weight01: finiteWeight(row[BOOK_WEIGHT_KEY[kind]]),
    private: kind !== 'realm',
  }));
  const realmMass01 = finiteWeight(row.settlementWeight01);
  const domesticPrivateMass01 = clamp01(
    finiteWeight(row.seatWeight01) + finiteWeight(row.patronWeight01),
  );
  const foreignMass01 = finiteWeight(row.foreignWeight01);
  const total01 = realmMass01 + domesticPrivateMass01 + foreignMass01;
  return {
    books: rows,
    realmMass01,
    domesticPrivateMass01,
    foreignMass01,
    privateMass01: clamp01(domesticPrivateMass01 + foreignMass01),
    total01,
    closed: Math.abs(total01 - 1) <= PARTITION_EPSILON,
  };
}

/**
 * Read the books for one actor against one opponent. All numeric fields are
 * ephemeral bounded controls; a persisted receipt should project their closed bands.
 * The four weights are a PARTITION — read masses through `seatBooksPartition`.
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
  const factionId = seatAddressFactionId(actor, governing);
  const factionName = governing ? nameOf(governing) : '';
  const rulerName = ruler ? String(ruler.name || ruler.label || '').trim() : '';
  const signature = authoritySignatureFor({ worldState: state, snapshot, actorId: actor });
  const foreign = foreignBookFor(state, snapshot, actor);
  const foreignWeight01 = foreign ? round4(clamp01(foreign.view.weight01)) : 0;
  // ⚠ `× 1` IS BIT-EXACT IN IEEE-754 AND THAT IS THE WHOLE DORMANCY PROOF at this
  // producer: with no foreign book `keep` is exactly 1, so every weight below is
  // the identical double it was before this car, not a value that merely rounds
  // to the same six decimals. A raw-byte bar cannot be met by `toBeCloseTo`.
  const keep = 1 - foreignWeight01;
  const foreignFields = foreign ? {
    foreignSeatId: foreign.view.patronSettlementId,
    foreignRegime: foreign.view.regime,
    foreignSeatBand: foreign.view.band,
    foreignPrimacy: foreign.view.primacy,
    foreignBasis: foreign.view.basis,
    foreignContinueBias01: foreign.continueBias01,
    foreignPeaceBias01: foreign.peaceBias01,
    ...(foreign.courtName ? { foreignSeatName: foreign.courtName } : {}),
    ...(foreign.view.rung ? { foreignRung: foreign.view.rung } : {}),
  } : {};

  // No ladder-backed ruler means the realm's books alone decide. The governing
  // body may still be identified, but no NPC identity or character is invented.
  //
  // A1.1.7's UNSEATED BRANCH RULING: the foreign book attaches BESIDE the
  // settlement book here too. An occupier does not stop reaching a court because
  // that court's own ladder cannot name a ruler — if anything a seatless town is
  // the one an occupier reaches furthest into, and returning `settlementWeight01:
  // 1` under a live occupation would have been the loudest silent drop of all.
  if (!rulerId || !ruler) {
    return {
      actorId: actor,
      opponentId: opponent,
      authoritySignature: signature,
      interestKind: foreign && foreign.view.primacy ? 'foreign' : 'realm',
      settlementWeight01: round4(keep),
      seatWeight01: 0,
      patronWeight01: 0,
      foreignWeight01,
      securityBand: 'unseated',
      lawfulness01: 0.5,
      malice01: 0.5,
      lawfulnessBand: 'balanced',
      moralityBand: 'balanced',
      continueBias01: 0.5,
      peaceBias01: 0.5,
      ...foreignFields,
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
  // THE FOREIGN BOOK TAKES ITS D1 SHARE OF THE WHOLE, and the remaining `keep`
  // rescales the existing realm/private split in its own proportions — ONE
  // derivation for both regimes (§711.6), and the legitimate seat's book is
  // still COMPUTED rather than displaced, so the competition the owner's
  // directive describes is visible in the record and narratable from it.
  //
  // ⛔ THE OWNER'S "ALWAYS JUST GREATER" IS NOT SPENT HERE. Law §2.3 makes
  // primacy an ORDERING guarantee carried by a typed decision-class list, never
  // by a tuned number staying bigger — so this scalar is honestly free to be
  // smaller than the local seat's on a weak occupation, and a tuning pass can
  // move it without inverting the directive. The ordering lives on `primacy`.
  const settlementWeight01 = round4((1 - privateWeight) * keep);
  const seatWeight01 = patronId ? 0 : round4(privateWeight * keep);
  const patronWeight01 = patronId ? round4(privateWeight * keep) : 0;
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
    // ⭐ THE FOURTH VALUE, AND THE RULE THAT PICKS IT — a JUDGMENT row, vetoable.
    // `interestKind` names the book that CARRIES the decision, and the honest
    // rule for a fourth book is the design's own §2.3: an OCCUPIER's book is
    // senior because occupation confers ORDERING, so `foreign` wins the label
    // under primacy and never by out-weighing anything. A VASSAL overlord holds
    // a scalar that competes honestly, so it leaves the label domestic and shows
    // up as its own row in the partition and its own band on the receipt.
    // The alternative — "the heaviest book wins the label" — was rejected because
    // it makes a reader-facing attribution depend on a tuned float, which is the
    // exact inversion law §2.3 exists to forbid.
    interestKind: foreign && foreign.view.primacy ? 'foreign' : patronId ? 'patron' : 'seat',
    settlementWeight01,
    seatWeight01,
    patronWeight01,
    foreignWeight01,
    securityBand,
    lawfulness01: round4(axes.lawfulness01),
    malice01: round4(axes.malice01),
    lawfulnessBand: lawWordFor(axes.lawfulness01),
    moralityBand: moralityBand(axes.malice01),
    rivalTriumph01: rivalRisk01,
    rivalTriumphBand: rivalRisk01 >= 0.5 ? 'pressing' : rivalRisk01 > 0 ? 'present' : 'absent',
    ...biases,
    ...foreignFields,
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
