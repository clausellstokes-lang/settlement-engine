/**
 * Pure planning and admission policy for the production migration train.
 *
 * The executable shell lives in migration-rehearsal.mjs. Keeping the contract
 * here makes three consequential properties testable without a database:
 *
 *   - the checked-in waves cover every pending migration exactly once;
 *   - rollback posture is explicit even when an older migration omitted its own
 *     `@rollback` annotation;
 *   - a database is admitted only when a short-lived attestation binds an exact
 *     clone target to the source backup and declares the isolation controls.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

export const MIGRATION_TRAIN_BASE_HEAD = 117;
export const MIGRATION_TRAIN_REPO_HEAD = 190;

const FORWARD_ONLY_REASON = [
  'No automatic schema rollback is admitted for this wave.',
  'Recover by a reviewed forward-fix; use PITR only for destructive data repair.',
].join(' ');

/**
 * The boundaries are intentionally semantic rather than equal-sized batches.
 * A failed wave stops the train before the next product subsystem is exposed.
 */
export const MIGRATION_WAVES = Object.freeze([
  Object.freeze({
    id: 'activation-trust-and-market-plane',
    from: 118,
    to: 136,
    purpose: 'Activation, idempotency, projection privacy, email preferences, analytics, and corpus contracts.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: FORWARD_ONLY_REASON,
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.ai_request_claims' }),
      Object.freeze({ kind: 'table', name: 'public.dossier_purchases' }),
      Object.freeze({ kind: 'table', name: 'public.user_action_rate_limits' }),
      Object.freeze({ kind: 'table', name: 'public.email_preferences' }),
    ]),
  }),
  Object.freeze({
    id: 'founder-surveyor-and-community',
    from: 137,
    to: 156,
    purpose: 'Founder-seat custody, Surveyor entitlements/governors, AI audit, gallery reactions, and abuse controls.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: FORWARD_ONLY_REASON,
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.founder_seats' }),
      Object.freeze({ kind: 'table', name: 'public.ai_operation_log' }),
      Object.freeze({ kind: 'table', name: 'public.surveyor_entitlements' }),
      Object.freeze({ kind: 'table', name: 'public.gallery_reactions' }),
      Object.freeze({ kind: 'table', name: 'public.token_buckets' }),
    ]),
  }),
  Object.freeze({
    id: 'money-lifecycle-and-moderation',
    from: 157,
    to: 174,
    purpose: 'Money events, auto-reload, founder lifecycle, sessions, retention, moderation, and margin policy.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: FORWARD_ONLY_REASON,
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.money_events' }),
      Object.freeze({ kind: 'table', name: 'public.credit_auto_reload_settings' }),
      Object.freeze({ kind: 'table', name: 'public.founder_transfer_cases' }),
      Object.freeze({ kind: 'table', name: 'public.current_account_session' }),
      Object.freeze({ kind: 'table', name: 'public.gallery_map_reports' }),
    ]),
  }),
  Object.freeze({
    id: 'durable-external-obligations',
    from: 175,
    to: 182,
    purpose: 'Crash-recoverable deletion, refund, webhook, and operator-attention obligations.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Roll workers and webhook callers back before forward-fixing their database contracts.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.account_deletion_cleanup_jobs' }),
      Object.freeze({ kind: 'table', name: 'public.payment_refund_obligations' }),
      Object.freeze({ kind: 'table', name: 'public.operational_obligation_acknowledgements' }),
      Object.freeze({ kind: 'function', name: 'report_operational_obligation_health' }),
      Object.freeze({ kind: 'function', name: 'claim_stripe_webhook_event' }),
    ]),
  }),
  Object.freeze({
    id: 'application-command-authority',
    from: 183,
    to: 184,
    purpose: 'Durable command identity, revision compare-and-swap, reconciliation, and the first atomic canon-event and structured-import verticals.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Roll the CUT_TRADE_ROUTE and structured-import callers back before forward-fixing the journal/RPC contracts.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.application_command_journal' }),
      Object.freeze({ kind: 'function', name: 'claim_application_command' }),
      Object.freeze({ kind: 'function', name: 'apply_cut_trade_route_command' }),
      Object.freeze({ kind: 'function', name: 'apply_import_reconciliation_command' }),
      Object.freeze({ kind: 'function', name: 'report_application_command_health' }),
    ]),
  }),
  Object.freeze({
    id: 'versioned-custom-content',
    from: 185,
    to: 185,
    purpose: 'Immutable custom-content revisions, pack and environment versions, reviewed activation, and the transactional extension-language command boundary.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Before the first revisioned write, an unused rehearsal clone may be discarded.',
        'After the first write, preserve authored history and repair only with a reviewed forward migration.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.custom_content_definitions' }),
      Object.freeze({ kind: 'table', name: 'public.custom_content_revisions' }),
      Object.freeze({ kind: 'table', name: 'public.content_pack_versions' }),
      Object.freeze({ kind: 'table', name: 'public.content_environment_revisions' }),
      Object.freeze({ kind: 'function', name: 'apply_custom_content_command' }),
    ]),
  }),
  Object.freeze({
    id: 'campaign-content-binding-authority',
    from: 186,
    to: 186,
    purpose: 'Server-authoritative campaign content-binding compare-and-swap on the canonical saved-map envelope.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Roll campaign-binding writers back before forward-fixing the saved-map trigger and compare-and-swap RPC.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'function',
        name: 'compare_and_swap_campaign_content_binding',
      }),
      Object.freeze({
        kind: 'function',
        name: 'enforce_campaign_content_binding_cas',
      }),
    ]),
  }),
  Object.freeze({
    id: 'custom-content-archive-transfer',
    from: 187,
    to: 187,
    purpose: 'Canonical custom-content archive export, deterministic restore, and browser-local premium cutover.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Preserve imported constitutional history and repair archive-transfer contracts only with a reviewed forward migration.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'table',
        name: 'public.custom_content_archive_imports',
      }),
      Object.freeze({
        kind: 'function',
        name: 'import_custom_content_archive',
      }),
      Object.freeze({
        kind: 'function',
        name: 'export_custom_content_archive',
      }),
    ]),
  }),
  Object.freeze({
    id: 'reviewed-supply-chain-persistence',
    from: 188,
    to: 188,
    purpose: 'Exact reviewed-derived supply-chain identity, transaction-bound command authority, archive repair, and campaign-binding persistence.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Preserve reviewed revisions, lifecycle generations, environment and campaign references, archive receipts, and quarantine evidence.',
        'Repair reviewed supply-chain persistence only with a reviewed forward migration.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'function',
        name: 'apply_reviewed_supply_chain_command',
      }),
    ]),
  }),
  Object.freeze({
    id: 'wave8-reversal-safety',
    from: 189,
    to: 190,
    purpose: 'Wave 8 money-and-privacy safety: faction-member public-scrub parity and the credit-pack refund clawback.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        '189 recreates the gallery sanitizer net-current (a narrower predicate would re-open the member-privacy leak);',
        '190 writes clawback ledger rows that are money truth — never unwound automatically.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'function',
        name: '_gallery_sanitize_public_json',
      }),
      Object.freeze({
        kind: 'function',
        name: 'system_clawback_credits',
      }),
    ]),
  }),
]);

const MIGRATION_FILE = /^(\d+)_.*\.sql$/;
const SHA256 = /^[a-f0-9]{64}$/;
const REHEARSAL_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{7,79}$/;
const LOOPBACK = new Set(['localhost', '127.0.0.1', '::1']);
const REQUIRED_ISOLATION = Object.freeze([
  'customerTrafficDisabled',
  'outboundNetworkDisabled',
  'productionSecretsRemoved',
  'scheduledJobsPaused',
]);

/** @param {string} value */
function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

/** @param {string} migrationDirectory */
export function readMigrationFiles(migrationDirectory) {
  return readdirSync(migrationDirectory)
    .map((name) => {
      const match = name.match(MIGRATION_FILE);
      if (!match) return null;
      const file = join(migrationDirectory, name);
      const source = readFileSync(file, 'utf8');
      return Object.freeze({
        number: Number(match[1]),
        name,
        file,
        bytes: Buffer.byteLength(source),
        sha256: digest(source),
        source,
      });
    })
    .filter(Boolean)
    .sort((left, right) =>
      left.number - right.number || left.name.localeCompare(right.name));
}

/**
 * Capture the annotation plus its contiguous comment continuation. The receipt
 * keeps only operational metadata, never the SQL body.
 *
 * @param {string} source
 */
export function readRollbackAnnotation(source) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => /--\s*@rollback:/i.test(line));
  if (start < 0) return null;
  const note = [];

  for (let index = start; index < lines.length && note.length < 12; index += 1) {
    const match = lines[index].match(/^\s*--\s?(.*)$/);
    if (!match) break;
    note.push(match[1].replace(/^@rollback:\s*/i, '').trim());
  }
  return note.filter(Boolean).join(' ').replace(/\s+/g, ' ').slice(0, 1_200);
}

/**
 * @param {{ number: number, source: string }} migration
 * @param {string} rollbackDirectory
 * @param {{ mode: string, reason: string }} waveRollback
 */
export function classifyRollback(
  migration,
  rollbackDirectory,
  waveRollback,
) {
  const downScript = readdirSync(rollbackDirectory).find((name) =>
    name.startsWith(`${String(migration.number).padStart(3, '0')}_`)
      && name.endsWith('.down.sql'));
  if (downScript) {
    return Object.freeze({
      mode: 'data-safe-down-script',
      source: 'down-script',
      path: `supabase/rollback/${downScript}`,
    });
  }

  const annotation = readRollbackAnnotation(migration.source);
  if (annotation) {
    return Object.freeze({
      mode: /forward[- ]fix only/i.test(annotation)
        ? 'forward-only'
        : 'documented-manual-reversal',
      source: 'migration-annotation',
      note: annotation,
    });
  }

  return Object.freeze({
    mode: waveRollback.mode,
    source: 'wave-policy',
    note: waveRollback.reason,
  });
}

/**
 * @param {{
 *   migrationDirectory: string,
 *   rollbackDirectory: string,
 *   appliedHead: number,
 *   waves?: typeof MIGRATION_WAVES,
 * }} options
 */
export function buildMigrationRehearsalPlan({
  migrationDirectory,
  rollbackDirectory,
  appliedHead,
  waves = MIGRATION_WAVES,
}) {
  const files = readMigrationFiles(migrationDirectory);
  if (files.length === 0) throw new Error('No migration files were found.');

  const numbers = files.map((migration) => migration.number);
  const duplicates = numbers.filter((number, index) =>
    numbers.indexOf(number) !== index);
  if (duplicates.length) {
    throw new Error(`Duplicate migration numbers: ${[...new Set(duplicates)].join(', ')}.`);
  }
  for (let index = 1; index < numbers.length; index += 1) {
    if (numbers[index] !== numbers[index - 1] + 1) {
      throw new Error(
        `Migration chain is not contiguous at ${numbers[index - 1]} → ${numbers[index]}.`,
      );
    }
  }

  const repoHead = numbers.at(-1);
  if (appliedHead > repoHead) {
    throw new Error(`Applied head ${appliedHead} exceeds repository head ${repoHead}.`);
  }
  if (appliedHead === repoHead) {
    return Object.freeze({
      schemaVersion: 1,
      kind: 'settlementforge_migration_rehearsal_plan',
      appliedHead,
      repoHead,
      pendingCount: 0,
      migrationSetSha256: digest(''),
      waves: Object.freeze([]),
    });
  }
  if (appliedHead !== MIGRATION_TRAIN_BASE_HEAD) {
    throw new Error(
      `The checked-in wave train starts at applied head ${MIGRATION_TRAIN_BASE_HEAD}, `
      + `but the ledger says ${appliedHead}. Rebase and review the wave boundaries.`,
    );
  }
  if (repoHead !== MIGRATION_TRAIN_REPO_HEAD) {
    throw new Error(
      `The wave manifest ends at ${MIGRATION_TRAIN_REPO_HEAD}, but the repository `
      + `head is ${repoHead}. Extend and review the final bounded wave.`,
    );
  }

  const pending = files.filter((migration) => migration.number > appliedHead);
  const covered = [];
  const plannedWaves = waves.map((wave) => {
    const migrations = pending
      .filter((migration) =>
        migration.number >= wave.from && migration.number <= wave.to)
      .map((migration) => {
        covered.push(migration.number);
        return Object.freeze({
          number: migration.number,
          name: migration.name,
          bytes: migration.bytes,
          sha256: migration.sha256,
          rollback: classifyRollback(
            migration,
            rollbackDirectory,
            wave.rollback,
          ),
        });
      });
    if (migrations.length !== wave.to - wave.from + 1) {
      throw new Error(
        `Wave ${wave.id} must cover every migration ${wave.from}–${wave.to}.`,
      );
    }
    return Object.freeze({
      id: wave.id,
      from: wave.from,
      to: wave.to,
      purpose: wave.purpose,
      rollback: wave.rollback,
      expectedObjects: wave.expectedObjects,
      migrations: Object.freeze(migrations),
    });
  });

  const expected = pending.map((migration) => migration.number);
  if (covered.join(',') !== expected.join(',')) {
    throw new Error(
      'Migration waves do not cover every pending migration exactly once.',
    );
  }

  const migrationSetSha256 = digest(
    plannedWaves.flatMap((wave) =>
      wave.migrations.map((migration) =>
        `${migration.number}\0${migration.name}\0${migration.sha256}\n`))
      .join(''),
  );
  return Object.freeze({
    schemaVersion: 1,
    kind: 'settlementforge_migration_rehearsal_plan',
    appliedHead,
    repoHead,
    pendingCount: pending.length,
    migrationSetSha256,
    waves: Object.freeze(plannedWaves),
  });
}

/**
 * Parse a credential-bearing target for admission without returning its secret.
 *
 * @param {string} value
 */
export function parseRehearsalTarget(value) {
  let parsed;
  try {
    parsed = new URL(String(value || ''));
  } catch {
    throw new Error('REHEARSAL_DATABASE_URL is not a valid PostgreSQL URL.');
  }
  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    throw new Error('The rehearsal target must use postgres:// or postgresql://.');
  }

  const host = parsed.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  const database = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  if (!host || !database) {
    throw new Error('The rehearsal target must name an exact host and database.');
  }
  if (LOOPBACK.has(host)) {
    throw new Error(
      'A local database is not admitted as a production-shaped clone.',
    );
  }
  if (!['require', 'verify-ca', 'verify-full'].includes(
    parsed.searchParams.get('sslmode') || '',
  )) {
    throw new Error('The remote rehearsal target must require TLS via sslmode.');
  }

  return Object.freeze({
    host,
    port: parsed.port || '5432',
    database,
    principal: decodeURIComponent(parsed.username || '').toLowerCase(),
    label: `${host}:${parsed.port || '5432'}/${database}`,
  });
}

/**
 * @param {{
 *   attestation: Record<string, any>,
 *   target: ReturnType<typeof parseRehearsalTarget>,
 *   appliedHead: number,
 *   allowedHosts: string[],
 *   productionRefs?: string[],
 *   now?: Date,
 * }} options
 */
export function validateCloneAttestation({
  attestation,
  target,
  appliedHead,
  allowedHosts,
  productionRefs = [],
  now = new Date(),
}) {
  if (!attestation || typeof attestation !== 'object') {
    throw new Error('The clone attestation must be a JSON object.');
  }
  if (
    attestation.schemaVersion !== 1
    || attestation.kind !== 'settlementforge_migration_rehearsal_clone'
  ) {
    throw new Error('The clone attestation kind or schema version is invalid.');
  }
  if (!REHEARSAL_ID.test(String(attestation.rehearsalId || ''))) {
    throw new Error('The clone attestation has an invalid rehearsalId.');
  }
  if (attestation.environment !== 'migration-rehearsal') {
    throw new Error('The attested environment must be migration-rehearsal.');
  }
  if (Number(attestation.source?.appliedHead) !== appliedHead) {
    throw new Error('The attested source head does not match the rehearsal plan.');
  }
  if (!SHA256.test(String(attestation.source?.snapshotReceiptSha256 || ''))) {
    throw new Error('The attestation must bind a SHA-256 backup/clone receipt.');
  }
  if (
    String(attestation.target?.host || '').toLowerCase() !== target.host
    || String(attestation.target?.port || '5432') !== target.port
    || String(attestation.target?.database || '') !== target.database
  ) {
    throw new Error('The attested target does not match REHEARSAL_DATABASE_URL.');
  }

  const admittedHosts = new Set(
    allowedHosts.map((host) => host.trim().toLowerCase()).filter(Boolean),
  );
  if (!admittedHosts.has(target.host)) {
    throw new Error(
      `Target host ${target.host} is not in SF_MIGRATION_REHEARSAL_ALLOWED_HOSTS.`,
    );
  }
  const explicitProductionReferences = productionRefs.map((value) =>
    value.trim().toLowerCase()).filter(Boolean);
  if (explicitProductionReferences.length === 0) {
    throw new Error(
      'An explicit production database host or project reference is required.',
    );
  }
  for (const reference of explicitProductionReferences) {
    const isHostname = reference.includes('.');
    const matches = isHostname
      ? target.host === reference
      : (
        target.host.split('.').includes(reference)
        || target.principal.split(/[.:_]/).includes(reference)
      );
    if (matches) {
      throw new Error('The rehearsal target matches an explicit production host/reference.');
    }
  }
  for (const control of REQUIRED_ISOLATION) {
    if (attestation.isolation?.[control] !== true) {
      throw new Error(`Clone isolation control ${control} is not attested.`);
    }
  }

  const createdAt = new Date(attestation.createdAt);
  const expiresAt = new Date(attestation.expiresAt);
  if (
    !Number.isFinite(createdAt.getTime())
    || !Number.isFinite(expiresAt.getTime())
  ) {
    throw new Error('The clone attestation timestamps are invalid.');
  }
  if (createdAt.getTime() > now.getTime() + 5 * 60_000) {
    throw new Error('The clone attestation was created in the future.');
  }
  if (expiresAt.getTime() <= now.getTime()) {
    throw new Error('The clone attestation has expired.');
  }
  if (expiresAt.getTime() <= createdAt.getTime()) {
    throw new Error('The clone attestation must expire after it was created.');
  }
  if (expiresAt.getTime() - createdAt.getTime() > 7 * 24 * 60 * 60_000) {
    throw new Error('The clone attestation lifetime may not exceed seven days.');
  }

  return Object.freeze({
    rehearsalId: attestation.rehearsalId,
    snapshotReceiptSha256: attestation.source.snapshotReceiptSha256,
    target: target.label,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    isolation: Object.freeze(Object.fromEntries(
      REQUIRED_ISOLATION.map((control) => [control, true]),
    )),
  });
}

/**
 * psql returns this query as one compact JSON row.
 */
export const REHEARSAL_IDENTITY_SQL = `
select json_build_object(
  'database', current_database(),
  'environment', coalesce(current_setting('settlementforge.environment', true), ''),
  'rehearsalId', coalesce(current_setting('settlementforge.rehearsal_id', true), ''),
  'readOnly', current_setting('default_transaction_read_only'),
  'serverVersion', current_setting('server_version')
);`;

export const MIGRATION_HEAD_SQL = `
select coalesce(
  max(case
    when version::text ~ '^[0-9]+$' then version::text::numeric
    else null
  end),
  0
)::text
from supabase_migrations.schema_migrations;`;

export const MIGRATION_HISTORY_SQL = `
with numeric_history as (
  select distinct version::text::integer as version
  from supabase_migrations.schema_migrations
  where version::text ~ '^[0-9]+$'
),
summary as (
  select
    coalesce(max(version), 0)::integer as head,
    count(*)::integer as count
  from numeric_history
)
select json_build_object(
  'head', summary.head,
  'count', summary.count,
  'nonNumeric', (
    select count(*)::integer
    from supabase_migrations.schema_migrations
    where version::text !~ '^[0-9]+$'
  ),
  'missing', coalesce((
    select json_agg(candidate order by candidate)
    from generate_series(1, summary.head) candidate
    where not exists (
      select 1 from numeric_history h where h.version = candidate
    )
  ), '[]'::json)
)
from summary;`;

/**
 * The snapshot intentionally uses exact counts for the four durable core tables.
 * A schema train may add rows, but it must not make profiles, saved settlements,
 * ledger rows, or spend allocations disappear. Mismatch/orphan counts may
 * improve and may never increase.
 */
export const INTEGRITY_SNAPSHOT_SQL = `
select json_build_object(
  'migrationHead', (${MIGRATION_HEAD_SQL.replace(/;\s*$/, '')}),
  'invalidConstraints', (
    select count(*)::integer
    from pg_constraint
    where not convalidated
  ),
  'rowCounts', json_build_object(
    'profiles', (select count(*)::bigint from public.profiles),
    'settlements', (select count(*)::bigint from public.settlements),
    'creditLedger', (select count(*)::bigint from public.credit_ledger),
    'creditSpendAllocations', (
      select count(*)::bigint from public.credit_spend_allocations
    )
  ),
  'creditBalanceMismatches', (
    select count(*)::integer
    from public.profiles p
    where p.credits is distinct from public.get_credit_balance(p.id)
  ),
  'orphanSpendAllocations', (
    select count(*)::integer
    from public.credit_spend_allocations a
    left join public.credit_ledger spend on spend.id = a.spend_id
    left join public.credit_ledger grant_row on grant_row.id = a.grant_id
    where spend.id is null or grant_row.id is null
  ),
  'schemaFingerprint', (
    select md5(coalesce(string_agg(
      table_schema || '.' || table_name || '.' || column_name || ':'
        || data_type || ':' || is_nullable,
      '|' order by table_schema, table_name, ordinal_position
    ), ''))
    from information_schema.columns
    where table_schema in ('public', 'auth', 'storage')
  )
);`;

/**
 * @param {Record<string, any>} before
 * @param {Record<string, any>} after
 */
export function compareIntegritySnapshots(before, after) {
  const failures = [];
  for (const key of [
    'profiles',
    'settlements',
    'creditLedger',
    'creditSpendAllocations',
  ]) {
    const beforeValue = Number(before.rowCounts?.[key]);
    const afterValue = Number(after.rowCounts?.[key]);
    if (
      !Number.isFinite(beforeValue)
      || !Number.isFinite(afterValue)
      || beforeValue < 0
      || afterValue < 0
    ) {
      failures.push(`${key} row count is invalid`);
    } else if (afterValue < beforeValue) {
      failures.push(`${key} row count decreased`);
    }
  }
  for (const key of [
    'invalidConstraints',
    'creditBalanceMismatches',
    'orphanSpendAllocations',
  ]) {
    const beforeValue = Number(before[key]);
    const afterValue = Number(after[key]);
    if (
      !Number.isFinite(beforeValue)
      || !Number.isFinite(afterValue)
      || beforeValue < 0
      || afterValue < 0
    ) {
      failures.push(`${key} is invalid`);
    } else if (afterValue > beforeValue) {
      failures.push(`${key} increased`);
    }
  }
  return Object.freeze({ ok: failures.length === 0, failures });
}

/**
 * Build a read-only presence query from manifest-owned object names.
 *
 * @param {{ kind: string, name: string }[]} expectedObjects
 */
export function expectedObjectPresenceSql(expectedObjects) {
  const rows = expectedObjects.map((object) => {
    const escaped = object.name.replaceAll("'", "''");
    if (object.kind === 'table') {
      return `('${escaped}', to_regclass('${escaped}') is not null)`;
    }
    if (object.kind === 'function') {
      return `('${escaped}', exists (
        select 1
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.proname = '${escaped}'
      ))`;
    }
    throw new Error(`Unsupported expected object kind: ${object.kind}.`);
  });
  return `
select coalesce(json_object_agg(name, present), '{}'::json)
from (values ${rows.join(',\n')}) as expected(name, present);`;
}

/** @param {Record<string, boolean>} presence */
export function missingExpectedObjects(presence) {
  return Object.entries(presence)
    .filter(([, present]) => present !== true)
    .map(([name]) => name)
    .sort();
}

/** @param {string} file */
export function readAttestationFile(file) {
  if (!existsSync(file)) {
    throw new Error(`Clone attestation not found: ${basename(file)}.`);
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}
