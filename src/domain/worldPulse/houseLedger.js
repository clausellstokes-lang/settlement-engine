/**
 * houseLedger.js — TR-2 THE HOUSE: the ONE writer of `spatialLedgers.houses`
 * (docs/DESIGN_FP_TRADE.md §TR-2; docs/DESIGN_FP_ARCH_TR.md §3 and §4 TR-2; the compiled
 * block #24; the §4 sub-key row: PRESERVED, a load-time normalizer).
 *
 * WHAT A HOUSE IS ON THE RECORD. A house is an EXISTING faction that has earned BOOKS: its
 * canonical archetype (`factionArchetypes.js :: factionArchetype`, the ONLY eligibility door)
 * reads `merchant`, and its settlement holds a live commercial institution
 * (`institutionRoster.js :: liveInstitutions`, the ruin-filter accessor). Books are earned
 * state, never a birthright (the universality clause): a faction carries none until it
 * forms here. The key is `<settlementId>:<slug of the display name>` — EQUAL to the faction
 * plane's own identity (`factionCompetition.js :: factionCompetitionId`) for every GENERATED
 * faction, executed in the acceptance file. ⚠ RECORDED DIVERGENCE: a DM-added faction that
 * carries a durable `id` is keyed by that id on the faction plane and by its name here. The
 * faction plane is INTERIOR's (tests/lint/couplingInclusion.walker.test.js), so importing its
 * identity from this TRADE leaf owes a coupling row, and re-spelling its `id`/`label` arms here
 * reads roster keys the generator never writes (tests/lint/observedShapeReaders.walker.test.js);
 * the name arm is the one both walkers admit. A rename therefore moves every house's key, and
 * the ELIGIBILITY-LOSS latch below is what keeps that from orphaning books.
 *
 * THE LATCHES (the design's fp-audit corrections, all four stateful and all here):
 *   FORMATION — an eligible faction gains an entry while its settlement is under
 *     `maxHousesPerSettlement`; among the eligible the order is DETERMINISTIC — institution
 *     seniority first (the roster position of the first live commercial institution whose
 *     `factionSource` names the faction; an unlinked faction ranks after every linked one),
 *     then the faction id by codepoint. Zero draws.
 *   THE RUIN LATCH — a house whose holdings fall to `broken` CLOSES: its books go and a
 *     tombstone keeps `ruinedAtTick`, so a still-eligible faction cannot re-open inside
 *     `ruinCooldownTicks` (no undead house). After the cooldown it re-forms as a NEW entry
 *     with fresh books and a `lineage` count the receipt names.
 *   ELIGIBILITY LOSS — a faction that stops reading `merchant` (a DM rename breaking the
 *     name-regex fallback; the town's last live commerce ruined) goes DORMANT-WITH-BOOKS:
 *     `dormantSince` stamped, books frozen, no acts; restored eligibility wakes the SAME
 *     entry. A faction that leaves the roster goes dormant the same way and CLOSES with a
 *     receipt once it has been gone `absenceGraceTicks` (the faction plane's own prune grace),
 *     which is dissolution — or a rename of a faction whose id is its name, because the faction
 *     plane itself reads that as a new faction. Never orphaned, never silently deleted.
 *   GROWTH AND RUIN — on a season-grade dwell, holdings step ONE band toward the town's own
 *     fortune band, raised one rung while any interest is live. No wealth ratchet: a house
 *     whose interests lapse falls back to its town, and a town fallen to its bottom band
 *     carries its houses to `broken` — ruin is reachable from the top band.
 *
 * THE LIFECYCLE PATHS (L4; the TR volume §3 clause, quoted): "create: the TR-2 formation rule
 * (eligibility predicate + deterministic selection, codepoint tie-break); read: band words
 * only; persist: JSON-round-trip (members ARE npcs[] — JSON-alias round-trip mandatory);
 * regenerate: books are event-accrued, NOT re-derivable — regen PRESERVES books (the J-TR-3
 * disclosed exception, second instance of J-WR-3's idiom); undo/import: round-trip both
 * shapes; migrate: a load-time normalizer LANDS WITH THE WRITER (the dormant-with-books shape
 * needs one — rename/eligibility loss must round-trip from old saves); veil: covert interests
 * ride includeCovert fail-closed upstream; DM rename → dormant-with-books + receipt,
 * dissolution → closed through the one writer, never orphaned." Every read of the ledger here
 * goes through `normalizeHouses`, so an old or hand-built shape heals at first touch.
 *
 * THE FACTOR (the named-actor rule, L10 (d)). An act casts its factor by READ-WIRING, never
 * stored: the house faction's member (`factionAffiliation` = the faction's display name) with
 * the lowest id by codepoint that `roads/state.js :: isOffStage` admits, paired with the one
 * status that chokepoint leaves to its consumers — no filter of this module's own.
 *
 * ⛔ DARK BY DEFAULT: `merchantHousesEnabled` is VIRTUAL (L2), read BY NAME with the strict
 * `=== true` idiom in `merchantHousesActive`, the one gate. Dark, `advanceHouses` returns its
 * input world BY REFERENCE and reads nothing else. No mount at this wave: the writer has no
 * `src/` caller (TR-1's precedent), and the house news kinds are not minted here.
 *
 * PURE, ZERO-DRAW: no rng, no clock, no store; the world is never mutated in place.
 */

import { NPC_UNAVAILABLE_STATUSES } from '../entities/npcs.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { prosperityRank01 } from '../prosperityRank.js';
import { OFF_STAGE_STATUSES, isOffStage } from '../roads/state.js';
import { nameOf } from '../rulingPower.js';
import { dropSpatialLedger, getSpatialLedger, setSpatialLedger } from '../spatial/spatialLedgerAccess.js';
import { stablePart } from './stablePart.js';
import {
  HOUSE_ACT_INTEREST, HOUSE_APPETITE_BANDS, HOUSE_CREDIT_BANDS, HOUSE_HOLDINGS_BANDS,
  HOUSE_INTEREST_KINDS, bandIndex, chooseHouseAct, liveInterestKinds,
} from './houseActs.js';

/** The `spatialLedgers` sub-key this module is the ONE writer of (§4, priced). */
export const HOUSES_LEDGER_KEY = 'houses';

/** The world condition this module defines for the editor (J-EM-3: it names its subjects). */
export const HOUSE_STANDING_CONDITION = 'houseStanding';

/**
 * THE LEDGER TUNING — raw-authored, owner-signed at the soak redo (THE PROMISE). Ticks are
 * the pulse's weeks: a dwell is a season, an interest lives two seasons, the ruin cooldown is
 * two seasons, and a vanished faction is forgotten on the faction plane's own grace.
 */
export const HOUSE_LEDGER_TUNING = Object.freeze({
  maxHousesPerSettlement: 2,
  dwellTicks: 13,
  interestTermTicks: 26,
  ruinCooldownTicks: 26,
  // The faction plane's own prune grace (`FACTION_STATE_PRUNE_GRACE_TICKS`), held equal by the
  // acceptance file rather than imported, for the coupling reason the header records.
  absenceGraceTicks: 3,
});

/**
 * THE UNAVAILABLE STATUSES THE CHOKEPOINT LEAVES TO EACH CONSUMER. `isOffStage` is the ONE
 * participation read and it deliberately omits the status its consumers pair themselves; that
 * pairing is DERIVED here from the two canonical lists, so no status word is spelled in this
 * file and the union's totality walker stays the only place the vocabulary lives.
 * @type {readonly string[]}
 */
const CONSUMER_PAIRED_STATUSES = Object.freeze(NPC_UNAVAILABLE_STATUSES
  .filter((status) => !(/** @type {readonly string[]} */ (OFF_STAGE_STATUSES)).includes(status)));

/** The receipt words this writer returns (never persisted; the news unit voices them). */
export const HOUSE_RECEIPT_EVENTS = Object.freeze(/** @type {const} */ ([
  'act', 'closed', 'dormant', 'formed', 'holdings', 'returned', 'ruined', 'woke',
]));

/** The rung a fresh house opens on (`steady`), and the ruin rung (`broken`). */
const OPENING_HOLDINGS = HOUSE_HOLDINGS_BANDS[2];
const RUIN_HOLDINGS = HOUSE_HOLDINGS_BANDS[0];
const OPENING_CREDIT = HOUSE_CREDIT_BANDS[2];
const OPENING_APPETITE = HOUSE_APPETITE_BANDS[1];
const OPENING_CREDIBILITY = 'untested';

/**
 * @typedef {{ kind: string, sinceTick: number }} HouseInterest
 * @typedef {{ holdings: string, credit: string, interests: HouseInterest[] }} HouseBooks
 * @typedef {{ factionId: string, settlementId: string, books: HouseBooks, appetite: string,
 *   credibility: string, updatedTick: number, dormantSince?: number, lineage?: number }} HouseEntry
 * @typedef {{ factionId: string, settlementId: string, ruinedAtTick: number,
 *   lineage?: number }} HouseTombstone
 * @typedef {HouseEntry | HouseTombstone} HouseRow
 * @typedef {{ event: string, settlementId: string, factionId: string } & Record<string, unknown>} HouseReceipt
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain object */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {value is string} a non-empty string */
function isName(value) {
  return typeof value === 'string' && value.length > 0;
}

/** @param {unknown} value @returns {value is number} a finite number */
function isTick(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Codepoint order, the estate's byte-stable comparator. @param {string} a @param {string} b */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {HouseRow} row @returns {row is HouseTombstone} */
function isTombstone(row) {
  return 'ruinedAtTick' in row;
}

/**
 * THE ONE GATE. The by-name strict read of the virtual flag (L2; the conjunction-gate hole
 * is why it is spelled by name).
 * @param {{ merchantHousesEnabled?: unknown } | null | undefined} rules
 * @returns {boolean}
 */
export function merchantHousesActive(rules) {
  return rules?.merchantHousesEnabled === true;
}

/**
 * THE HOUSE KEY of one roster faction: the display name (`rulingPower.nameOf`), slugged the way
 * the faction plane slugs it, with the plane's own positional fallback.
 * @param {string} settlementId @param {Record<string, unknown>} faction @param {number} index
 * @returns {string}
 */
export function houseFactionId(settlementId, faction, index) {
  const name = nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (faction));
  return `${settlementId}:${stablePart(name || `faction_${index}`)}`;
}

/**
 * One interest row, healed, or null.
 * @param {unknown} row @returns {HouseInterest|null}
 */
function normalizeInterest(row) {
  if (!isPlainObject(row) || !isName(row.kind) || !isTick(row.sinceTick)) return null;
  if (!HOUSE_INTEREST_KINDS.includes(row.kind)) return null;
  return { kind: row.kind, sinceTick: row.sinceTick };
}

/**
 * The interests of one book, healed: known kinds only, one row per kind (the latest
 * opening wins), codepoint-sorted by kind.
 * @param {unknown} raw @returns {HouseInterest[]}
 */
function normalizeInterests(raw) {
  /** @type {Map<string, number>} */
  const latest = new Map();
  for (const row of Array.isArray(raw) ? raw : []) {
    const interest = normalizeInterest(row);
    if (!interest) continue;
    latest.set(interest.kind, Math.max(interest.sinceTick, latest.get(interest.kind) ?? -Infinity));
  }
  return [...latest.keys()].sort(compareCodepoint).map((kind) => ({ kind, sinceTick: latest.get(kind) ?? 0 }));
}

/**
 * A band word healed onto its ladder: a word the ladder does not carry reads as the rung the
 * house opens on, so an old or hand-edited save keeps its house rather than losing it.
 * @param {readonly string[]} ladder @param {unknown} word @param {string} fallback @returns {string}
 */
function bandOr(ladder, word, fallback) {
  return bandIndex(ladder, word) >= 0 ? String(word) : fallback;
}

/**
 * THE LOAD-TIME NORMALIZER. Heals any shape a save can carry into the one this writer
 * writes: a closed field set, band words on their ladders, the settlement id derived from the
 * faction-plane key when a hand-built row omits it, and the two conditional fields
 * (`dormantSince`, `lineage`) kept only when present and well-formed (drop-when-absent).
 * Rows it cannot place (no key, no settlement) are dropped; nothing else is.
 * @param {unknown} raw @returns {Record<string, HouseRow>} key-sorted, plain JSON
 */
export function normalizeHouses(raw) {
  /** @type {Record<string, HouseRow>} */
  const out = {};
  if (!isPlainObject(raw)) return out;
  for (const key of Object.keys(raw).sort(compareCodepoint)) {
    const row = raw[key];
    if (!isName(key) || !isPlainObject(row)) continue;
    const factionId = isName(row.factionId) ? row.factionId : key;
    const derived = factionId.includes(':') ? factionId.slice(0, factionId.indexOf(':')) : '';
    const settlementId = isName(row.settlementId) ? row.settlementId : derived;
    if (!settlementId) continue;
    const lineage = typeof row.lineage === 'number' && Number.isInteger(row.lineage) && row.lineage > 0
      ? row.lineage : null;
    if (isTick(row.ruinedAtTick)) {
      out[key] = { factionId, settlementId, ruinedAtTick: row.ruinedAtTick, ...(lineage ? { lineage } : {}) };
      continue;
    }
    const books = isPlainObject(row.books) ? row.books : {};
    /** @type {HouseEntry} */
    const entry = {
      factionId,
      settlementId,
      books: {
        holdings: bandOr(HOUSE_HOLDINGS_BANDS, books.holdings, OPENING_HOLDINGS),
        credit: bandOr(HOUSE_CREDIT_BANDS, books.credit, OPENING_CREDIT),
        interests: normalizeInterests(books.interests),
      },
      appetite: bandOr(HOUSE_APPETITE_BANDS, row.appetite, OPENING_APPETITE),
      credibility: isName(row.credibility) ? row.credibility : OPENING_CREDIBILITY,
      updatedTick: isTick(row.updatedTick) ? row.updatedTick : 0,
    };
    if (isTick(row.dormantSince)) entry.dormantSince = row.dormantSince;
    if (lineage) entry.lineage = lineage;
    out[key] = entry;
  }
  return out;
}

/**
 * The ledger as this writer reads it: always through the normalizer.
 * @param {Record<string, unknown> | null | undefined} worldState @returns {Record<string, HouseRow>}
 */
export function readHouses(worldState) {
  return normalizeHouses(getSpatialLedger(worldState, HOUSES_LEDGER_KEY));
}

/**
 * A settlement's power roster, read at the two homes the generator writes, in the faction
 * layer's own order (its third, `politics.factions`, is a key no producer writes).
 * @param {Record<string, unknown>} settlement @returns {Record<string, unknown>[]}
 */
function rosterOf(settlement) {
  const structure = isPlainObject(settlement.powerStructure) ? settlement.powerStructure : {};
  const factions = structure.factions || settlement.factions;
  return Array.isArray(factions) ? factions.filter(isPlainObject) : [];
}

/**
 * The settlement's LIVE commercial institutions, through the ruin-filter accessor. An
 * institution is commercial when its category reads `merchant` on the canonical category
 * map (`economy`, `trade`, `merchant`) — the one vocabulary, never a second spelling of it.
 * @param {Record<string, unknown>} settlement @returns {Record<string, unknown>[]}
 */
function liveCommerceOf(settlement) {
  return liveInstitutions(settlement).filter((inst) => isPlainObject(inst)
    && isName(inst.category)
    && factionArchetype({ category: inst.category }) === FACTION_ARCHETYPES.MERCHANT);
}

/**
 * The band the town's own fortune points a house at, as an index on the holdings ladder.
 * @param {Record<string, unknown>} settlement @returns {number}
 */
export function townBandOf(settlement) {
  const economic = isPlainObject(settlement.economicState) ? settlement.economicState : {};
  const rank = prosperityRank01(economic.prosperity);
  if (rank < 0.2) return 0;
  if (rank < 0.4) return 1;
  if (rank < 0.6) return 2;
  if (rank < 0.75) return 3;
  return 4;
}

/**
 * THE FACTOR, cast by read-wiring: never stored, cast per act.
 * @param {Record<string, unknown>} settlement @param {Record<string, unknown>} faction
 * @returns {string} the member's id, or '' when no member can take the errand
 */
export function castHouseFactor(settlement, faction) {
  const house = nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (faction));
  if (!house) return '';
  const people = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  const ids = people
    .filter((npc) => isPlainObject(npc) && isName(npc.id) && npc.factionAffiliation === house
      && !CONSUMER_PAIRED_STATUSES.includes(String(npc.status ?? '').toLowerCase()) && !isOffStage(npc))
    .map((npc) => String(npc.id))
    .sort(compareCodepoint);
  return ids[0] || '';
}

/**
 * @param {HouseEntry} entry @param {Partial<HouseEntry>} patch @returns {HouseEntry}
 */
function withEntry(entry, patch) {
  /** @type {HouseEntry} */
  const next = { ...entry, ...patch };
  if (patch.dormantSince === undefined && 'dormantSince' in patch) delete next.dormantSince;
  return next;
}

/**
 * The eligible factions of one settlement that could form a house, in formation order.
 * @param {string} settlementId @param {Record<string, unknown>} settlement
 * @param {Record<string, unknown>[]} roster @param {boolean} hasCommerce
 * @returns {{ factionId: string, seniority: number }[]}
 */
function formationOrder(settlementId, settlement, roster, hasCommerce) {
  if (!hasCommerce) return [];
  const commerce = liveCommerceOf(settlement);
  /** @type {{ factionId: string, seniority: number }[]} */
  const out = [];
  roster.forEach((faction, index) => {
    if (factionArchetype(faction) !== FACTION_ARCHETYPES.MERCHANT) return;
    const factionId = houseFactionId(settlementId, faction, index);
    const name = nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (faction));
    const linked = commerce.findIndex((inst) => isName(name) && inst.factionSource === name);
    out.push({ factionId, seniority: linked < 0 ? Number.MAX_SAFE_INTEGER : linked });
  });
  return out.sort((a, b) => (a.seniority - b.seniority) || compareCodepoint(a.factionId, b.factionId));
}

/**
 * THE WRITER. One pass over every settlement of the snapshot, in id order.
 *
 * @param {{ snapshot?: unknown, worldState: Record<string, unknown>, tick?: unknown,
 *   rules?: { merchantHousesEnabled?: unknown } | null }} input
 * @returns {{ worldState: Record<string, unknown>, ledger: Record<string, HouseRow> | null,
 *   receipts: readonly HouseReceipt[] }}
 */
export function advanceHouses({ snapshot, worldState, tick, rules }) {
  if (!merchantHousesActive(rules)) return { worldState, ledger: null, receipts: Object.freeze([]) };
  const now = isTick(tick) ? tick : 0;
  const tuning = HOUSE_LEDGER_TUNING;
  const ledger = readHouses(worldState);
  /** @type {HouseReceipt[]} */
  const receipts = [];
  const items = isPlainObject(snapshot) && Array.isArray(snapshot.settlements)
    ? snapshot.settlements.filter(isPlainObject) : [];
  const ordered = [...items].sort((a, b) => compareCodepoint(String(a.id ?? ''), String(b.id ?? '')));
  for (const item of ordered) {
    const settlementId = isName(item.id) ? item.id : '';
    if (!settlementId) continue;
    const settlement = isPlainObject(item.settlement) ? item.settlement : {};
    const roster = rosterOf(settlement);
    /** @type {Map<string, Record<string, unknown>>} */
    const byId = new Map();
    roster.forEach((faction, index) => {
      byId.set(houseFactionId(settlementId, faction, index), faction);
    });
    const hasCommerce = liveCommerceOf(settlement).length > 0;
    const townBand = townBandOf(settlement);
    const note = (/** @type {string} */ event, /** @type {string} */ factionId, /** @type {Record<string, unknown>} */ extra = {}) => {
      receipts.push(Object.freeze({ event, settlementId, factionId, ...extra }));
    };
    for (const key of Object.keys(ledger).sort(compareCodepoint)) {
      const row = ledger[key];
      if (row.settlementId !== settlementId) continue;
      const faction = byId.get(key);
      if (isTombstone(row)) {
        if (!faction) { delete ledger[key]; note('closed', key, { reason: 'dissolved' }); }
        continue;
      }
      if (!faction) {
        if (row.dormantSince === undefined) {
          ledger[key] = withEntry(row, { dormantSince: now });
          note('dormant', key, { reason: 'absent' });
        } else if (now - row.dormantSince >= tuning.absenceGraceTicks) {
          delete ledger[key];
          note('closed', key, { reason: 'dissolved' });
        }
        continue;
      }
      const eligible = hasCommerce && factionArchetype(faction) === FACTION_ARCHETYPES.MERCHANT;
      if (!eligible) {
        if (row.dormantSince === undefined) {
          ledger[key] = withEntry(row, { dormantSince: now });
          note('dormant', key, { reason: hasCommerce ? 'archetype' : 'commerce' });
        }
        continue;
      }
      let entry = row;
      if (entry.dormantSince !== undefined) {
        entry = withEntry(entry, { dormantSince: undefined, updatedTick: now });
        note('woke', key);
      }
      if (now - entry.updatedTick >= tuning.dwellTicks) {
        const live = liveInterestKinds(entry.books.interests, now, tuning.interestTermTicks);
        const held = bandIndex(HOUSE_HOLDINGS_BANDS, entry.books.holdings);
        const target = Math.min(HOUSE_HOLDINGS_BANDS.length - 1, townBand + (live.length > 0 ? 1 : 0));
        const step = Math.sign(target - held);
        const holdings = HOUSE_HOLDINGS_BANDS[held + step];
        const appetiteAt = bandIndex(HOUSE_APPETITE_BANDS, entry.appetite) + step;
        const appetite = HOUSE_APPETITE_BANDS[Math.max(0, Math.min(HOUSE_APPETITE_BANDS.length - 1, appetiteAt))];
        const interests = entry.books.interests.filter((i) => live.includes(i.kind));
        if (step !== 0) note('holdings', key, { from: entry.books.holdings, to: holdings });
        if (holdings === RUIN_HOLDINGS) {
          ledger[key] = { factionId: entry.factionId, settlementId, ruinedAtTick: now,
            ...(entry.lineage ? { lineage: entry.lineage } : {}) };
          note('ruined', key);
          continue;
        }
        entry = withEntry(entry, { books: { ...entry.books, holdings, interests }, appetite, updatedTick: now });
      }
      const verb = chooseHouseAct({
        books: entry.books,
        appetite: entry.appetite,
        townBand,
        liveInterests: liveInterestKinds(entry.books.interests, now, tuning.interestTermTicks),
      });
      if (verb) {
        const kind = HOUSE_ACT_INTEREST[verb];
        const interests = [...entry.books.interests.filter((i) => i.kind !== kind), { kind, sinceTick: now }]
          .sort((a, b) => compareCodepoint(a.kind, b.kind));
        entry = withEntry(entry, { books: { ...entry.books, interests } });
        note('act', key, { verb, factorId: castHouseFactor(settlement, faction) });
      }
      ledger[key] = entry;
    }
    let open = Object.values(ledger).filter((r) => r.settlementId === settlementId && !isTombstone(r)).length;
    for (const { factionId } of formationOrder(settlementId, settlement, roster, hasCommerce)) {
      if (open >= tuning.maxHousesPerSettlement) break;
      const prior = ledger[factionId];
      if (prior && !isTombstone(prior)) continue;
      if (prior && isTombstone(prior) && now - prior.ruinedAtTick < tuning.ruinCooldownTicks) continue;
      const lineage = prior && isTombstone(prior) ? (prior.lineage ?? 0) + 1 : 0;
      ledger[factionId] = {
        factionId,
        settlementId,
        books: { holdings: OPENING_HOLDINGS, credit: OPENING_CREDIT, interests: [] },
        appetite: OPENING_APPETITE,
        credibility: OPENING_CREDIBILITY,
        updatedTick: now,
        ...(lineage > 0 ? { lineage } : {}),
      };
      note(lineage > 0 ? 'returned' : 'formed', factionId, lineage > 0 ? { lineage } : {});
      open += 1;
    }
  }
  const next = normalizeHouses(ledger);
  if (Object.keys(next).length === 0) {
    return { worldState: dropSpatialLedger(worldState, HOUSES_LEDGER_KEY), ledger: null, receipts: Object.freeze(receipts) };
  }
  return { worldState: setSpatialLedger(worldState, HOUSES_LEDGER_KEY, next), ledger: next, receipts: Object.freeze(receipts) };
}

/**
 * THE STANDING HOUSES ON ONE RECORD — the subjects of `houseStanding`. A house stands when
 * its entry is open and awake; a dormant house takes no act and a ruined one has no books, so
 * neither is a subject. Dark (the flag unlit on the campaign's rules, or no ledger), none.
 * @param {unknown} record the card's subject settlement
 * @param {unknown} campaignState the campaign, or null where the caller has none
 * @returns {readonly string[]} frozen, codepoint-sorted house ids
 */
export function standingHousesOn(record, campaignState) {
  const world = isPlainObject(campaignState) && isPlainObject(campaignState.worldState)
    ? campaignState.worldState : null;
  const settlementId = isPlainObject(record) && record.id != null ? String(record.id) : '';
  if (!world || !settlementId) return Object.freeze([]);
  const rules = isPlainObject(world.simulationRules) ? world.simulationRules : null;
  if (!merchantHousesActive(rules)) return Object.freeze([]);
  const ledger = readHouses(world);
  return Object.freeze(Object.keys(ledger)
    .filter((key) => {
      const row = ledger[key];
      return row.settlementId === settlementId && !isTombstone(row) && row.dormantSince === undefined;
    })
    .sort(compareCodepoint));
}

/**
 * THE PREDICATE ROW, in `worldConditions.js`'s `liveRow` shape (J-EM-3, R-38: it names its
 * subjects, and the predicate is DERIVED from them, the `pendingPeaceOffer` idiom). The chair
 * composes it into `WORLD_CONDITIONS` at the merge; the seal it lights is "Direct the house."
 */
export const HOUSE_STANDING_ROW = Object.freeze({
  predicate: (/** @type {unknown} */ record, /** @type {unknown} */ campaignState) => standingHousesOn(record, campaignState).length > 0,
  subjects: standingHousesOn,
  readers: Object.freeze([Object.freeze({
    id: 'house-ledger',
    module: 'src/domain/worldPulse/houseLedger.js',
    symbol: 'readHouses',
    gate: null,
  })]),
  source: /** @type {const} */ ('live'),
});
