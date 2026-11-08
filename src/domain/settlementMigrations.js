/**
 * domain/settlementMigrations.js — Tier 1.4 migration runner.
 *
 * Saved settlements survive engine evolution. Every settlement
 * carries `schemaVersion` (stamped by normalizeSettlement at create
 * time). When the schema changes incompatibly — a field is renamed,
 * a substructure restructures, a derivation moves to the canonical
 * shape — the SCHEMA_VERSION constant bumps and a migration function
 * is registered here that rewrites the older shape into the new one.
 *
 * On load, `migrateSettlementToLatest(settlement)` walks the registry
 * and applies every migration whose `from` version equals the
 * settlement's current `schemaVersion`. The chain proceeds until the
 * settlement reaches SCHEMA_VERSION.
 *
 * Design:
 *   - Migrations are pure. Each takes a settlement, returns a new
 *     object. No I/O, no mutation, no async.
 *   - The registry is ordered by `from` version. A migration's
 *     `to` value MUST equal `from + 1` so the chain is a linear
 *     sequence — no fanout, no branches, no skips.
 *   - Adding a migration: bump SCHEMA_VERSION in settlement.schema.js,
 *     then append `{ from: <old>, to: <new>, migrate: (s) => ... }`
 *     here. Add a test in tests/domain/settlementMigrations.test.js
 *     for the new step.
 *   - The V1 entry below is intentionally a no-op. It exists to
 *     prove the runner contract works end-to-end before any real
 *     migration is needed.
 *   - The V2 entry (PEOPLE-5B, 2026-11-07, the chair's ruling M-7) is
 *     the FIRST REAL MIGRATION: the people car's card shape (see
 *     `migrateV1toV2` below and docs/GENERATION_CONTRACTS.md, "The NPC
 *     card and the powers").
 */

import { SCHEMA_VERSION } from './settlement.schema.js';
import { resolveFactionRef } from './factionRefs.js';
import { tagEntityCanon } from './canonStatus.js';
import { factionIdFromName } from '../lib/entities.js';
import { isVeiledPower, stampVeil } from './people/cardVeil.js';

/** The per-card faction fields a v2 record does not carry (M-2's six, less `structuralRank`, which is carried). */
const V1_CARD_FIELDS = Object.freeze(['factionAffiliation', 'secondaryAffiliation', 'linkedFactionIds', 'factionGoal', 'densityRungRole']);
const INSTITUTION_KINDS = new Set(['house', 'power']);

/** A record read from a save: every key is unknown until it is narrowed. @typedef {{ [key: string]: unknown }} SaveRecord */
/** One value the v1 -> v2 step could not map. @typedef {{ id: unknown, field: string, value: unknown, names?: string }} Unmapped */
/**
 * What the v1 -> v2 step did to one record.
 * @typedef {{
 *   cards: number, cardsUntouched: number, dmCards: Array<{ id: unknown, why: string[] }>,
 *   moved: { factionAffiliation: number, secondaryAffiliation: number, linkedFactionIds: number },
 *   deleted: { factionGoal: number, densityRungRole: number }, structuralRankCarried: number,
 *   houseLinked: number, dmHouseCleared: number, membershipsPerCard: Record<string, number>,
 *   unmapped: Unmapped[], groupingDropped: number,
 *   groupingOrphans: Array<{ name: string, eventId: unknown, members: unknown[] }>,
 *   ties: number, tiesMoved: number, outDegreeOver1: number,
 * }} MigrationReport
 */
/** @param {unknown} v @returns {v is SaveRecord} */
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
/** @param {unknown} p @returns {string} the power's display name (the FACTION-ACCESS LAW's precedence) */
const powerNameOf = (p) => (isObj(p) ? String(p.faction || p.name || '') : '');

/**
 * The power a v1 handle (a display name or an id) addresses, or null — the name or id first
 * (factionRefs.js :: resolveFactionRef), then the id `factionIdFromName` derives from a name.
 * @param {Array<SaveRecord>} powers @param {unknown} ref @returns {SaveRecord | null}
 */
function powerFor(powers, ref) {
  if (ref == null || ref === '') return null;
  const hit = resolveFactionRef(powers, ref);
  if (hit) return /** @type {SaveRecord} */ (hit);
  const byId = powers.filter((p) => factionIdFromName(powerNameOf(p)) === String(ref));
  return byId.length === 1 ? byId[0] : null;
}

/**
 * Is this card the DM's (M-7; PEOPLE-5-PREP §3.3)? The canon tagger's `user` and `event` sources
 * (`_authored`/`userAuthored`/`source`; `createdByEventId`/`appliedAt`/`causeEventId`), the entity's
 * own lock (`locked`/`pinned`), or a DM edit on it (`_userEdits`). The envelope's lock map
 * (`campaignState.locks`) is outside the settlement object: this step never sees it and never
 * touches it.
 * @param {SaveRecord} npc @returns {string[]} the reasons, empty for a generated card
 */
export function dmCardReasons(npc) {
  const tag = tagEntityCanon(/** @type {import('./canonStatus.js').CanonTaggable} */ (npc));
  const reasons = [];
  if (tag.source === 'user') reasons.push('authored');
  if (tag.source === 'event') reasons.push('event-born');
  if (npc.locked === true || npc.pinned === true) reasons.push('entity-locked');
  if (tag.source !== 'user' && isObj(npc._userEdits) && Object.keys(npc._userEdits).length > 0) reasons.push('user-edited');
  return reasons;
}

/**
 * THE V1 -> V2 STEP (M-7): the people car's card. Pure; returns `{ settlement, report }`.
 *
 *   npcs[].factionAffiliation    -> a membership `{ power, rank: null, share: null, veiled }` where it resolves to a power
 *     (FIX-PUBLIC-VEIL: every built membership carries THAT power's veil bit, people/cardVeil.js)
 *   npcs[].secondaryAffiliation  -> a second membership only where it names a power; else REPORTED
 *   npcs[].linkedFactionIds[]    -> memberships (each resolved against the powers); an unresolved one REPORTED
 *   npcs[].factionGoal, densityRungRole -> deleted (generated text and a retired rung; no reader in v2)
 *   npcs[].structuralRank        -> carried
 *   npcs[].memberships (a card born by the car before the bump) -> kept as written, the old fields merged in once
 *   npcs[].institution: a string naming a roster house -> `{ kind: 'house', key, family: null, title: null, veiled }`
 *     (FIX-PUBLIC-VEIL: the veil bit stamped from the house's roster row by people/cardVeil.js)
 *     (the card shape's spelling, people/representatives.js: the house's roster name is `key`); a car-born
 *     record `{ kind, key, ... }` -> kept; anything else -> REPORTED and null. A DM card -> null (M-7).
 *   settlement.factions (the grouping) -> dropped; an entry naming no power is REPORTED with its members
 *   relationships[] { npc1Id, npc2Id } -> { from: npc1Id, to: npc2Id }, every other field kept; a card's
 *     out-degree > 1 is KEPT (DM content is never dropped)
 *   schemaVersion -> 2
 *
 * A card that carries none of the moved fields is passed through untouched (a DM card of that shape gains
 * `institution: null`). Every other field of every card is carried byte-for-byte (the DM's `_userEdits`, `_authored`, `locked`,
 * custom content ...). What the step cannot map is never dropped silently: it is written to the record's
 * `migrationReports` (HISTORY, saved-only) and returned in `report`.
 *
 * @param {SaveRecord} settlement
 * @returns {{ settlement: SaveRecord, report: MigrationReport }}
 */
export function migrateV1toV2(settlement) {
  const s = settlement;
  const powerStructure = isObj(s.powerStructure) ? s.powerStructure : {};
  /** @type {SaveRecord[]} */
  const powers = Array.isArray(powerStructure.factions) ? powerStructure.factions.filter(isObj) : [];
  const houses = new Set((Array.isArray(s.institutions) ? s.institutions : [])
    .map((i) => (isObj(i) ? String(i.name || '') : '')).filter(Boolean));
  /** @type {MigrationReport} */
  const report = {
    cards: 0, cardsUntouched: 0, dmCards: [], moved: { factionAffiliation: 0, secondaryAffiliation: 0, linkedFactionIds: 0 },
    deleted: { factionGoal: 0, densityRungRole: 0 }, structuralRankCarried: 0, houseLinked: 0, dmHouseCleared: 0,
    membershipsPerCard: {}, unmapped: [], groupingDropped: 0, groupingOrphans: [], ties: 0, tiesMoved: 0, outDegreeOver1: 0,
  };
  const npcs = (Array.isArray(s.npcs) ? s.npcs : []).map((npc) => {
    if (!isObj(npc)) return npc;
    report.cards += 1;
    const dm = dmCardReasons(npc);
    if (dm.length) report.dmCards.push({ id: npc.id ?? null, why: dm });
    // A card that carries none of the fields this step moves — a pre-car person `{ name, role, goal, secret }`
    // — is passed through BYTE-EQUAL (the same object); a DM card of that shape gains only `institution: null`.
    const carries = V1_CARD_FIELDS.some((key) => key in npc) || 'institution' in npc || 'memberships' in npc;
    if (!carries) {
      report.cardsUntouched += 1;
      if (!dm.length) return npc;
      return { ...npc, institution: null };
    }
    /** @type {Array<SaveRecord>} */
    const memberships = Array.isArray(npc.memberships) ? npc.memberships.slice() : [];
    /** @param {SaveRecord} p */
    const add = (p) => {
      const name = powerNameOf(p);
      if (!name || memberships.some((m) => isObj(m) && m.power === name)) return;
      memberships.push({ power: name, rank: null, share: null, veiled: isVeiledPower(p) });
    };
    /** @param {string} field @param {unknown} value @param {string} [names] */
    const unmapped = (field, value, names) => report.unmapped.push({ id: npc.id ?? null, field, value, ...(names ? { names } : {}) });
    if (npc.factionAffiliation != null && npc.factionAffiliation !== '') {
      const p = powerFor(powers, npc.factionAffiliation);
      if (p) { add(p); report.moved.factionAffiliation += 1; } else unmapped('factionAffiliation', npc.factionAffiliation);
    }
    if (npc.secondaryAffiliation != null && npc.secondaryAffiliation !== '') {
      const p = powerFor(powers, npc.secondaryAffiliation);
      if (p) { add(p); report.moved.secondaryAffiliation += 1; } else {
        unmapped('secondaryAffiliation', npc.secondaryAffiliation,
          houses.has(String(npc.secondaryAffiliation)) ? 'a house on the roster' : 'neither a power nor a house on the roster');
      }
    }
    for (const ref of Array.isArray(npc.linkedFactionIds) ? npc.linkedFactionIds : []) {
      const p = powerFor(powers, ref);
      if (p) { add(p); report.moved.linkedFactionIds += 1; } else unmapped('linkedFactionIds[]', ref);
    }
    if ('factionGoal' in npc) report.deleted.factionGoal += 1;
    if ('densityRungRole' in npc) report.deleted.densityRungRole += 1;
    if ('structuralRank' in npc) report.structuralRankCarried += 1;
    const next = { ...npc };
    for (const key of V1_CARD_FIELDS) delete next[key];
    next.memberships = memberships;
    const inst = npc.institution;
    if (dm.length) {
      if (inst != null) report.dmHouseCleared += 1;
      next.institution = null;
    } else if (isObj(inst) && typeof inst.kind === 'string' && INSTITUTION_KINDS.has(inst.kind) && typeof inst.key === 'string' && inst.key) {
      next.institution = inst;
    } else if (typeof inst === 'string' && houses.has(inst)) {
      next.institution = stampVeil({ kind: 'house', key: inst, family: null, title: null }, s);
      report.houseLinked += 1;
    } else {
      if (inst != null) unmapped('institution', inst);
      next.institution = null;
    }
    report.membershipsPerCard[memberships.length] = (report.membershipsPerCard[memberships.length] || 0) + 1;
    return next;
  });
  const grouping = Array.isArray(s.factions) ? s.factions : [];
  report.groupingDropped = grouping.length;
  for (const group of grouping) {
    if (!isObj(group)) continue;
    const named = powerNameOf(group);
    if (!powerFor(powers, named)) {
      report.groupingOrphans.push({
        name: named, eventId: group.createdByEventId ?? null,
        members: (Array.isArray(group.members) ? group.members : []).map((m) => (isObj(m) ? (m.id ?? m.name ?? null) : null)),
      });
    }
  }
  /** @type {Map<string, number>} */
  const outDegree = new Map();
  const relationships = (Array.isArray(s.relationships) ? s.relationships : []).map((tie) => {
    if (!isObj(tie)) return tie;
    report.ties += 1;
    if (tie.from !== undefined && tie.to !== undefined) {
      outDegree.set(String(tie.from), (outDegree.get(String(tie.from)) || 0) + 1);
      return tie;
    }
    const { npc1Id, npc2Id, ...rest } = tie;
    if (npc1Id === undefined || npc2Id === undefined) {
      report.unmapped.push({ id: tie.id ?? null, field: 'relationships[]', value: 'a tie with no end ids' });
      return tie;
    }
    report.tiesMoved += 1;
    outDegree.set(String(npc1Id), (outDegree.get(String(npc1Id)) || 0) + 1);
    return { ...rest, from: npc1Id, to: npc2Id };
  });
  report.outDegreeOver1 = [...outDegree.values()].filter((n) => n > 1).length;
  /** @type {SaveRecord} */
  const out = { ...s, npcs, relationships, schemaVersion: 2 };
  if (!Array.isArray(s.npcs)) delete out.npcs;
  if (!Array.isArray(s.relationships)) delete out.relationships;
  delete out.factions;
  if (report.unmapped.length || report.groupingOrphans.length) {
    out.migrationReports = [
      ...(Array.isArray(s.migrationReports) ? s.migrationReports : []),
      { from: 1, to: 2, cause: 'M-7: the people car (the grouping and the per-card faction fields leave the record)',
        unmapped: report.unmapped, groupingOrphans: report.groupingOrphans },
    ];
  }
  return { settlement: out, report };
}

/**
 * The ordered chain. Append-only: every new entry has from = the
 * previous entry's `to`, and to = from + 1.
 *
 * The first entry's `from` is 0 (covers any pre-versioned save with
 * no `schemaVersion` field at all) and `to` is 1. The chain ends at
 * SCHEMA_VERSION.
 */
const MIGRATIONS = Object.freeze([
  {
    from: 0,
    to:   1,
    description: 'Stamp schemaVersion = 1. No structural changes; v0 settlements just lacked the version field.',
    /**
     * @param {Record<string, unknown>} settlement
     * @returns {Record<string, unknown>}
     */
    migrate(settlement) {
      // Pure passthrough: normalizeSettlement already stamps the
      // version stamp. This entry exists to make the chain explicit
      // from "no version" to v1.
      return { ...settlement, schemaVersion: 1 };
    },
  },
  {
    from: 1,
    to:   2,
    description: 'M-7 (PEOPLE-5B): the people car: per-card faction fields -> ranked memberships, the card\'s house, the grouping dropped, ties directed.',
    /**
     * @param {Record<string, unknown>} settlement
     * @returns {Record<string, unknown>}
     */
    migrate(settlement) {
      return migrateV1toV2(/** @type {SaveRecord} */ (settlement)).settlement;
    },
  },
  // Future:
  // { from: 2, to: 3, description: '...', migrate(s) { ... } },
]);

/**
 * Map a settlement's stored `schemaVersion` to the runner's current
 * pointer. Missing / null / 0 values are treated as v0 so the V0→V1
 * migration applies (which is the no-op stamp).
 *
 * @param {{ schemaVersion?: unknown } | null | undefined} settlement
 * @returns {number}
 */
function currentVersion(settlement) {
  const v = settlement?.schemaVersion;
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return v;
  return 0;
}

/**
 * Apply every migration whose `from` equals the settlement's current
 * schemaVersion, stopping when `to` reaches SCHEMA_VERSION.
 *
 * Idempotent: running this on an already-current settlement returns
 * an object structurally equal to the input.
 *
 * Throws if a chain gap is detected (`from` doesn't match the
 * settlement's current version after a migration step). That would
 * mean MIGRATIONS got reordered or had a hole — a code bug, not
 * runtime data drift.
 *
 * @param {unknown} settlement
 * @returns {unknown}
 */
export function migrateSettlementToLatest(settlement) {
  if (!settlement || typeof settlement !== 'object') return settlement;

  // Surface a forward-versioned (newer-than-this-engine) save instead of silently
  // treating it as already-current. The migration chain only walks UPWARD; a save
  // stamped with a higher schemaVersion than this build knows about may carry a
  // shape this engine cannot read, and handing it to consumers that assume the
  // older shape risks subtle corruption. We warn loudly (rather than throwing) so a
  // single-user session can still attempt to open the save — and pass it through
  // UNCHANGED rather than fabricating a downgrade, since no down-migration exists.
  const startVersion = currentVersion(/** @type {Record<string, unknown>} */ (settlement));
  if (startVersion > SCHEMA_VERSION) {
    console.warn(
      `[settlementMigrations] settlement schemaVersion=${startVersion} is newer than this engine's ` +
      `SCHEMA_VERSION=${SCHEMA_VERSION}. The save was made by a newer version of SettlementForge — ` +
      `update the app to load it safely. Passing it through unchanged (no down-migration exists).`,
    );
    return settlement;
  }

  let out = /** @type {Record<string, unknown>} */ (settlement);
  let safety = 0;
  while (currentVersion(out) < SCHEMA_VERSION) {
    const v = currentVersion(out);
    const step = MIGRATIONS.find(m => m.from === v);
    if (!step) {
      throw new Error(
        `[settlementMigrations] no migration registered for schemaVersion=${v} → ${SCHEMA_VERSION}. ` +
        `Either add a migration to MIGRATIONS in domain/settlementMigrations.js, ` +
        `or check whether the SCHEMA_VERSION constant was bumped without a corresponding migration.`,
      );
    }
    const next = step.migrate(out);
    if (currentVersion(next) !== step.to) {
      throw new Error(
        `[settlementMigrations] migration ${step.from}→${step.to} produced schemaVersion=${currentVersion(next)} ` +
        `(expected ${step.to}). The migration function must set the new version on its returned object.`,
      );
    }
    out = next;
    if (++safety > 100) {
      throw new Error('[settlementMigrations] runaway migration chain — abort');
    }
  }
  return out;
}

/**
 * Public catalog of registered migrations (frozen). Tests and tooling
 * can iterate it to verify the chain is well-formed.
 */
export function listMigrations() {
  return MIGRATIONS.map(m => ({
    from: m.from,
    to: m.to,
    description: m.description,
  }));
}

/**
 * Sanity check the migration registry. Returns null when the chain
 * is well-formed; otherwise an array of diagnostic strings.
 *
 * Verifies:
 *   - First entry's `from` is 0
 *   - Last entry's `to` equals SCHEMA_VERSION
 *   - Each entry's `to === from + 1`
 *   - Adjacent entries chain (entry[i+1].from === entry[i].to)
 *
 * Run from a test so a future SCHEMA_VERSION bump without a matching
 * migration trips immediately.
 */
export function diagnoseMigrationChain() {
  const problems = [];
  if (MIGRATIONS.length === 0) {
    if (SCHEMA_VERSION > 0) {
      problems.push(`SCHEMA_VERSION is ${SCHEMA_VERSION} but MIGRATIONS is empty`);
    }
    return problems.length ? problems : null;
  }
  if (MIGRATIONS[0].from !== 0) {
    problems.push(`first migration must start at from=0, got ${MIGRATIONS[0].from}`);
  }
  const last = MIGRATIONS[MIGRATIONS.length - 1];
  if (last.to !== SCHEMA_VERSION) {
    problems.push(`last migration ends at to=${last.to}, but SCHEMA_VERSION is ${SCHEMA_VERSION}`);
  }
  for (let i = 0; i < MIGRATIONS.length; i++) {
    const m = MIGRATIONS[i];
    if (m.to !== m.from + 1) {
      problems.push(`migration #${i} jumps from=${m.from} to=${m.to} (must increment by 1)`);
    }
    if (i > 0 && m.from !== MIGRATIONS[i - 1].to) {
      problems.push(`migration #${i} starts at from=${m.from} but previous ended at ${MIGRATIONS[i - 1].to}`);
    }
  }
  return problems.length ? problems : null;
}
