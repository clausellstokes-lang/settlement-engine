import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  MIGRATION_TRAIN_BASE_HEAD,
  MIGRATION_TRAIN_REPO_HEAD,
  MIGRATION_WAVES,
  buildMigrationRehearsalPlan,
  compareIntegritySnapshots,
  parseRehearsalTarget,
  validateCloneAttestation,
} from '../../scripts/ops/migrationRehearsalCore.mjs';
import {
  captureWaveWorkspaceSnapshot,
  stageWaveWorkspace,
} from '../../scripts/ops/migration-rehearsal.mjs';
import {
  writeJsonReceiptAtomically,
} from '../../scripts/ops/releaseEvidenceCore.mjs';

const ROOT = process.cwd();
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');
const ROLLBACK = join(ROOT, 'supabase', 'rollback');
const SCRIPT = join(ROOT, 'scripts', 'ops', 'migration-rehearsal.mjs');
const temporaryDirectories = [];

function cloneAttestation(overrides = {}) {
  return {
    schemaVersion: 1,
    kind: 'settlementforge_migration_rehearsal_clone',
    rehearsalId: 'release-2026-07-24-a',
    environment: 'migration-rehearsal',
    createdAt: '2026-07-24T12:00:00.000Z',
    expiresAt: '2026-07-26T12:00:00.000Z',
    source: {
      appliedHead: MIGRATION_TRAIN_BASE_HEAD,
      snapshotReceiptSha256: 'a'.repeat(64),
    },
    target: {
      host: 'clone.release.internal',
      port: '5432',
      database: 'settlementforge_rehearsal',
    },
    isolation: {
      customerTrafficDisabled: true,
      outboundNetworkDisabled: true,
      productionSecretsRemoved: true,
      scheduledJobsPaused: true,
    },
    ...overrides,
  };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    chmodSync(directory, 0o700);
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('bounded migration rehearsal plan', () => {
  const plan = buildMigrationRehearsalPlan({
    migrationDirectory: MIGRATIONS,
    rollbackDirectory: ROLLBACK,
    appliedHead: MIGRATION_TRAIN_BASE_HEAD,
  });

  it('covers the exact applied-head to repository-head gap in semantic waves', () => {
    expect(plan.appliedHead).toBe(117);
    expect(plan.repoHead).toBe(192);
    expect(plan.pendingCount).toBe(75);
    expect(plan.waves.map(({ from, to }) => [from, to])).toEqual([
      [118, 136],
      [137, 156],
      [157, 174],
      [175, 182],
      [183, 184],
      [185, 185],
      [186, 186],
      [187, 187],
      [188, 188],
      [189, 190],
      [191, 192],
    ]);
    expect(MIGRATION_WAVES.at(-1).to).toBe(MIGRATION_TRAIN_REPO_HEAD);

    const covered = plan.waves.flatMap((wave) =>
      wave.migrations.map((migration) => migration.number));
    expect(covered).toEqual(
      Array.from({ length: 75 }, (_, index) => 118 + index),
    );
    expect(new Set(covered).size).toBe(covered.length);

    expect(plan.waves.at(-1)).toMatchObject({
      id: 'surveyor-probe-and-tier-price',
      from: 191,
      to: 192,
      expectedObjects: [{
        kind: 'function',
        name: 'surveyor_byok_set_probe_tier',
      }, {
        kind: 'function',
        name: 'spend_credits',
      }],
    });
  });

  it('gives every pending migration an explicit rollback posture', () => {
    for (const wave of plan.waves) {
      expect(wave.rollback.mode).toBe('forward-only');
      for (const migration of wave.migrations) {
        expect([
          'data-safe-down-script',
          'documented-manual-reversal',
          'forward-only',
        ]).toContain(migration.rollback.mode);
        expect([
          'down-script',
          'migration-annotation',
          'wave-policy',
        ]).toContain(migration.rollback.source);
      }
    }
    // Older omissions are not silently "unknown": the train owns their policy.
    const dossierStore = plan.waves
      .flatMap((wave) => wave.migrations)
      .find((migration) => migration.number === 122);
    expect(dossierStore.rollback).toMatchObject({
      mode: 'forward-only',
      source: 'wave-policy',
    });

    const customContentCutover = plan.waves
      .flatMap((wave) => wave.migrations)
      .find((migration) => migration.number === 185);
    expect(customContentCutover.rollback).toMatchObject({
      mode: 'forward-only',
      source: 'migration-annotation',
    });
    expect(customContentCutover.rollback.note).toMatch(
      /forward-fix only after the first revisioned command write/i,
    );

    const reviewedSupplyChainPersistence = plan.waves
      .flatMap((wave) => wave.migrations)
      .find((migration) => migration.number === 188);
    expect(reviewedSupplyChainPersistence.rollback).toMatchObject({
      mode: 'forward-only',
      source: 'migration-annotation',
    });
    expect(reviewedSupplyChainPersistence.rollback.note).toMatch(
      /reviewed revisions.*durable evidence/i,
    );
  });

  it('stages no migration beyond the selected wave boundary', () => {
    const snapshot = captureWaveWorkspaceSnapshot(plan);
    const staged = stageWaveWorkspace(136, snapshot);
    temporaryDirectories.push(staged.workspace);
    const numbers = staged.copied.map((name) => Number(name.split('_')[0]));

    expect(snapshot).toMatchObject({
      repoHead: 192,
      migrationCount: 192,
      configSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
      workspaceSourceSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect(Math.max(...numbers)).toBe(136);
    expect(numbers).toContain(118);
    expect(numbers).not.toContain(137);
    expect(readFileSync(
      join(staged.workspace, 'supabase', 'config.toml'),
      'utf8',
    )).toContain('project_id');
  });
});

describe('clone admission is positive and source-bound', () => {
  const targetUrl = [
    'postgresql://operator:super-secret@clone.release.internal:5432/',
    'settlementforge_rehearsal?sslmode=verify-full',
  ].join('');
  const target = parseRehearsalTarget(targetUrl);

  it('admits an exact, fresh, isolated clone attestation', () => {
    expect(validateCloneAttestation({
      attestation: cloneAttestation(),
      target,
      appliedHead: 117,
      allowedHosts: ['clone.release.internal'],
      productionRefs: ['db.production-ref.supabase.co', 'production-ref'],
      now: new Date('2026-07-25T00:00:00.000Z'),
    })).toMatchObject({
      rehearsalId: 'release-2026-07-24-a',
      target: 'clone.release.internal:5432/settlementforge_rehearsal',
    });
  });

  it.each([
    ['postgresql://postgres:secret@127.0.0.1:5432/postgres?sslmode=require', /production-shaped clone/i],
    ['postgresql://postgres:secret@clone.release.internal:5432/postgres', /must require TLS/i],
    ['https://clone.release.internal/postgres', /must use postgres/i],
  ])('rejects a non-production-shaped target before any runner starts', (url, error) => {
    expect(() => parseRehearsalTarget(url)).toThrow(error);
  });

  it('rejects production identity and missing isolation controls', () => {
    expect(() => validateCloneAttestation({
      attestation: cloneAttestation(),
      target,
      appliedHead: 117,
      allowedHosts: ['clone.release.internal'],
      productionRefs: ['clone.release.internal'],
      now: new Date('2026-07-25T00:00:00.000Z'),
    })).toThrow(/production host/i);

    const productionPoolerTarget = parseRehearsalTarget([
      'postgresql://postgres.production-ref:secret@',
      'clone.release.internal:5432/settlementforge_rehearsal?sslmode=require',
    ].join(''));
    expect(() => validateCloneAttestation({
      attestation: cloneAttestation(),
      target: productionPoolerTarget,
      appliedHead: 117,
      allowedHosts: ['clone.release.internal'],
      productionRefs: ['production-ref'],
      now: new Date('2026-07-25T00:00:00.000Z'),
    })).toThrow(/production host/i);

    const unsafe = cloneAttestation({
      isolation: {
        ...cloneAttestation().isolation,
        outboundNetworkDisabled: false,
      },
    });
    expect(() => validateCloneAttestation({
      attestation: unsafe,
      target,
      appliedHead: 117,
      allowedHosts: ['clone.release.internal'],
      productionRefs: ['db.production-ref.supabase.co'],
      now: new Date('2026-07-25T00:00:00.000Z'),
    })).toThrow(/outboundNetworkDisabled/);

    expect(() => validateCloneAttestation({
      attestation: cloneAttestation(),
      target,
      appliedHead: 117,
      allowedHosts: ['clone.release.internal'],
      productionRefs: [],
      now: new Date('2026-07-25T00:00:00.000Z'),
    })).toThrow(/explicit production database host/i);
  });

  it('rejects an internally impossible attestation lifetime', () => {
    expect(() => validateCloneAttestation({
      attestation: cloneAttestation({
        createdAt: '2026-07-25T00:04:00.000Z',
        expiresAt: '2026-07-25T00:03:00.000Z',
      }),
      target,
      appliedHead: 117,
      allowedHosts: ['clone.release.internal'],
      productionRefs: ['db.production-ref.supabase.co'],
      now: new Date('2026-07-25T00:00:00.000Z'),
    })).toThrow(/expire after it was created/i);
  });

  it('never prints a credential from the environment in plan mode', () => {
    const result = spawnSync(process.execPath, [SCRIPT, '--plan', '--json'], {
      cwd: ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        REHEARSAL_DATABASE_URL: targetUrl,
      },
    });
    expect(result.status).toBe(0);
    expect(`${result.stdout}${result.stderr}`).not.toContain('super-secret');
    expect(JSON.parse(result.stdout)).toMatchObject({
      appliedHead: 117,
      repoHead: 192,
    });
  });
});

describe('integrity and receipt evidence', () => {
  const before = {
    invalidConstraints: 0,
    creditBalanceMismatches: 2,
    orphanSpendAllocations: 0,
    rowCounts: {
      profiles: 10,
      settlements: 40,
      creditLedger: 100,
      creditSpendAllocations: 30,
    },
  };

  it('admits additive/fixing changes and fails destructive or worsening deltas', () => {
    expect(compareIntegritySnapshots(before, {
      ...before,
      creditBalanceMismatches: 1,
      rowCounts: { ...before.rowCounts, creditLedger: 101 },
    })).toEqual({ ok: true, failures: [] });

    expect(compareIntegritySnapshots(before, {
      ...before,
      invalidConstraints: 1,
      rowCounts: { ...before.rowCounts, settlements: 39 },
    })).toEqual({
      ok: false,
      failures: [
        'settlements row count decreased',
        'invalidConstraints increased',
      ],
    });

    expect(compareIntegritySnapshots(before, {
      ...before,
      rowCounts: { ...before.rowCounts, profiles: undefined },
    })).toEqual({
      ok: false,
      failures: ['profiles row count is invalid'],
    });
  });

  it('publishes a private receipt atomically and never overwrites evidence', () => {
    const directory = mkdtempSync(join(tmpdir(), 'sf-receipt-'));
    temporaryDirectories.push(directory);
    const file = join(directory, 'receipt.json');

    writeJsonReceiptAtomically(file, { passed: true, source: 'one' });
    expect(statSync(file).mode & 0o777).toBe(0o600);
    expect(JSON.parse(readFileSync(file, 'utf8'))).toEqual({
      passed: true,
      source: 'one',
    });
    expect(() => writeJsonReceiptAtomically(
      file,
      { passed: true, source: 'two' },
    )).toThrow(/EEXIST/);
    expect(JSON.parse(readFileSync(file, 'utf8')).source).toBe('one');
  });
});
