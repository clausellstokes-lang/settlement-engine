/**
 * domain/settlementMigrations.js - Tier 1.4 migration runner.
 *
 * Saved settlements survive engine evolution. Every settlement
 * carries `schemaVersion` (stamped by normalizeSettlement at create
 * time). When the schema changes incompatibly - a field is renamed,
 * a substructure restructures, a derivation moves to the canonical
 * shape - the SCHEMA_VERSION constant bumps and a migration function
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
 *     sequence - no fanout, no branches, no skips.
 *   - Adding a migration: bump SCHEMA_VERSION in settlement.schema.js,
 *     then append `{ from: <old>, to: <new>, migrate: (s) => ... }`
 *     here. Add a test in tests/domain/settlementMigrations.test.js
 *     for the new step.
 *   - The V1 entry below is intentionally a no-op. It exists to
 *     prove the runner contract works end-to-end before any real
 *     migration is needed.
 */

import { SCHEMA_VERSION } from './settlement.schema.js';

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
    migrate(settlement) {
      // Pure passthrough: normalizeSettlement already stamps the
      // version stamp. This entry exists to make the chain explicit
      // from "no version" to v1.
      return { ...settlement, schemaVersion: 1 };
    },
  },
  // Future:
  // { from: 1, to: 2, description: '...', migrate(s) { ... } },
]);

/**
 * Map a settlement's stored `schemaVersion` to the runner's current
 * pointer. Missing / null / 0 values are treated as v0 so the V0→V1
 * migration applies (which is the no-op stamp).
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
 * mean MIGRATIONS got reordered or had a hole - a code bug, not
 * runtime data drift.
 */
export function migrateSettlementToLatest(settlement) {
  if (!settlement || typeof settlement !== 'object') return settlement;

  let out = settlement;
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
      throw new Error('[settlementMigrations] runaway migration chain - abort');
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
