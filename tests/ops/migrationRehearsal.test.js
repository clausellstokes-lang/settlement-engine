import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
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
import { sqlRegexAlternation } from '../helpers/sourceContract.js';

const ROOT = process.cwd();
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');
const ROLLBACK = join(ROOT, 'supabase', 'rollback');
const SCRIPT = join(ROOT, 'scripts', 'ops', 'migration-rehearsal.mjs');
const temporaryDirectories = [];

/**
 * Latest-wins extraction of the net-current `public._gallery_world_snapshot_is_safe`
 * definition across the migrations — the same line-anchored, latest-wins idiom
 * tests/security/snapshotDenylistDrift.test.js uses, so the arm below reads the
 * EFFECTIVE server denylist rather than whichever migration first wrote the scanner.
 * @returns {{ sql: string, owner: string|null }}
 */
function netCurrentGalleryScanner() {
  const re = /^create\s+or\s+replace\s+function\s+public\._gallery_world_snapshot_is_safe\b[\s\S]*?\$\$;/igm;
  let sql = '';
  let owner = null;
  for (const file of readdirSync(MIGRATIONS).filter((f) => /^\d.*\.sql$/.test(f)).sort()) {
    const matches = readFileSync(join(MIGRATIONS, file), 'utf8').match(re);
    if (matches && matches.length) {
      sql = matches[matches.length - 1].toLowerCase();
      owner = file;
    }
  }
  return { sql, owner };
}

/** The net-current scanner's `hard_deny` array members (lower-cased with the SQL). */
function hardDenyMembers(sql) {
  const array = sql.match(/hard_deny\s+constant\s+text\[\]\s*:=\s*array\[([\s\S]*?)\];/);
  if (!array) throw new Error('no hard_deny array found in the net-current gallery scanner');
  return [...array[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

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
    expect(plan.appliedHead).toBe(121);
    expect(plan.repoHead).toBe(202);
    expect(plan.pendingCount).toBe(81);
    expect(plan.waves.map(({ from, to }) => [from, to])).toEqual([
      [122, 136],
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
      [193, 193],
      [194, 194],
      [195, 195],
      [196, 196],
      [197, 197],
      [198, 198],
      [199, 199],
      [200, 200],
      [201, 201],
      [202, 202],
    ]);
    expect(MIGRATION_WAVES.at(-1).to).toBe(MIGRATION_TRAIN_REPO_HEAD);

    const covered = plan.waves.flatMap((wave) =>
      wave.migrations.map((migration) => migration.number));
    expect(covered).toEqual(
      Array.from({ length: 81 }, (_, index) => 122 + index),
    );
    expect(new Set(covered).size).toBe(covered.length);

    expect(plan.waves.find((wave) => wave.id === 'surveyor-probe-and-tier-price')).toMatchObject({
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
    expect(plan.waves.find((wave) => wave.id === 'bilateral-user-route-command')).toMatchObject({
      id: 'bilateral-user-route-command',
      from: 193,
      to: 193,
      expectedObjects: [{
        kind: 'function',
        name: 'apply_create_route_command',
      }, {
        kind: 'function',
        name: 'assert_create_route_half',
      }],
    });
    expect(plan.waves.find((wave) => wave.id === 'operator-messages-consent-and-courier')).toMatchObject({
      id: 'operator-messages-consent-and-courier',
      from: 194,
      to: 194,
      expectedObjects: [{
        kind: 'table',
        name: 'public.operator_messages',
      }, {
        kind: 'table',
        name: 'public.operator_message_receipts',
      }, {
        kind: 'table',
        name: 'public.operator_message_delivery_jobs',
      }, {
        kind: 'table',
        name: 'public.consent_change_records',
      }, {
        kind: 'function',
        name: 'claim_operator_message_recipient',
      }, {
        kind: 'function',
        name: 'list_my_operator_messages',
      }],
    });
    expect(plan.waves.find((wave) => wave.id === 'civility-guard-and-public-identity')).toMatchObject({
      id: 'civility-guard-and-public-identity',
      from: 195,
      to: 195,
      expectedObjects: [{
        kind: 'table',
        name: 'public.civility_terms',
      }, {
        kind: 'table',
        name: 'public.civility_allow',
      }, {
        kind: 'function',
        name: 'civility_normalize',
      }, {
        kind: 'function',
        name: 'civility_blocked',
      }],
    });
    // ⭐ 196 EXPOSES NO PRODUCT SUBSYSTEM AT ALL. It stores engine evidence for the
    // diagnostic soak harness; no running code path reads the table, which is why its
    // forward-only posture is cheap and why reversing it is nonetheless a
    // data-destroying act that must be deliberate.
    expect(plan.waves.find((wave) => wave.id === 'simulation-metrics-storage')).toMatchObject({
      id: 'simulation-metrics-storage',
      from: 196,
      to: 196,
      expectedObjects: [{
        kind: 'table',
        name: 'public.world_sim_metrics',
      }, {
        kind: 'function',
        name: 'load_sim_metrics',
      }, {
        kind: 'function',
        name: 'rollup_sim_metrics',
      }],
    });
    // ⭐⭐ 197 IS THE TRAIN'S FIRST *DATA* WAVE, AND THAT IS WHY IT IS
    // PINNED SEPARATELY. Every wave before it moves SHAPE — new tables, new functions,
    // altered columns — so a rehearsal could judge it by what the schema looks like
    // afterwards. 197 creates nothing and defines nothing; it rewrites rows in an
    // existing column, and its whole risk is WHICH rows. Its `expectedObjects` is
    // therefore a single already-existing table, and the thing an operator must
    // actually review is the predicate, not the DDL.
    expect(plan.waves.find((wave) => wave.id === 'consent-person-adjacent-default')).toMatchObject({
      id: 'consent-person-adjacent-default',
      from: 197,
      to: 197,
      expectedObjects: [{
        kind: 'table',
        name: 'public.profiles',
      }],
    });
    // …and it takes its posture from its OWN annotation rather than the wave policy,
    // because the column-default half is reversible in one statement while the data
    // half deliberately is not. A wave-policy classification here would flatten that
    // distinction and tell an operator the whole wave is forward-only.
    const consentDefault = plan.waves
      .flatMap((wave) => wave.migrations)
      .find((migration) => migration.number === 197);
    expect(consentDefault.rollback).toMatchObject({
      mode: 'documented-manual-reversal',
      source: 'migration-annotation',
    });
    expect(consentDefault.rollback.note).toMatch(/not mechanically reversible/i);
    // ⭐⭐ 198 IS THE TRAIN'S FIRST *DESTRUCTIVE* WAVE. 197 rewrote rows and could
    // in principle be walked back row by row; 198 DELETES — raw events past 90 days,
    // exported research rows past 400 — and no annotation can make that reversible.
    // Its expectedObjects therefore carry both halves that an operator must review
    // together: the durable aggregate that must exist BEFORE the window shortens, and
    // the two prune/maintenance functions that decide what disappears. Pinning only
    // the table would let a rehearsal call the wave "additive".
    expect(plan.waves.find((wave) => wave.id === 'retention-numbers')).toMatchObject({
      id: 'retention-numbers',
      from: 198,
      to: 198,
      expectedObjects: [{
        kind: 'table',
        name: 'public.analytics_retention_cohorts',
      }, {
        kind: 'function',
        name: 'append_retention_cohorts',
      }, {
        kind: 'function',
        name: 'analytics_monthly_prune',
      }, {
        kind: 'function',
        name: 'analytics_nightly_maintenance',
      }, {
        kind: 'function',
        name: 'report_retention',
      }],
    });
    // Like 197 it takes its posture from its OWN annotation, and for the opposite
    // reason: 197's annotation exists because half of it IS reversible, 198's because
    // half of it emphatically is not. The wave policy would say "forward-only" and
    // stop there; the annotation is what tells an operator that reverting the shape
    // WITHOUT reverting the window is the one combination that loses data silently.
    const retentionNumbers = plan.waves
      .flatMap((wave) => wave.migrations)
      .find((migration) => migration.number === 198);
    expect(retentionNumbers.rollback).toMatchObject({
      mode: 'documented-manual-reversal',
      source: 'migration-annotation',
    });
    expect(retentionNumbers.rollback.note).toMatch(/NOT REVERSIBLE — the deletions/);
    // ⭐ THE TAIL WAVE (199, WEB-3) IS THE TRAIN'S FIRST *READ-ONLY* WAVE. It creates one
    // SECURITY DEFINER report function and nothing else — no table, no column, no policy,
    // no row — because the referral funnel's conversion half deliberately mints no record
    // of its own: public.referrals already holds the money-grade truth and a second ledger
    // on the money path was the refused alternative. Its `expectedObjects` is therefore a
    // single function, and it is pinned here rather than left to the relative walk above so
    // that a later wave appended past it cannot quietly inherit this row's identity.
    // (The SUBSTRATE landing appended wave 200 past it — exactly the event this pin
    // anticipated — so the pin re-points BY ID, and the new tail takes its own pin below.)
    expect(plan.waves.find((wave) => wave.id === 'referral-funnel-report')).toMatchObject({
      id: 'referral-funnel-report',
      from: 199,
      to: 199,
      expectedObjects: [{
        kind: 'function',
        name: 'report_referral_funnel',
      }],
    });
    // ⭐ THE NEW TAIL WAVE (200, W-FAITH F1c): one re-stated CHECK on the legacy
    // custom_content table — the deity's authored character admitted at the database
    // wall, the 049/056 idiom. No table, no column, no function, no row; the JS wall
    // and migration 185 already enforce the same law, so this is its only
    // not-yet-true-in-production half. Deployment stays the owner's manual act.
    expect(plan.waves.find((wave) => wave.id === 'deity-authored-character-check')).toMatchObject({
      id: 'deity-authored-character-check',
      from: 200,
      to: 200,
      expectedObjects: [{
        kind: 'table',
        name: 'public.custom_content',
      }],
    });
    // ⭐ THE 201 WAVE (ODQ §934.28): one re-stated SECURITY DEFINER function —
    // has_surveyor_entitlement() is 139's body plus the staff disjunct, checked before the
    // entitlement row. No table, no column, no policy, no row, no entitlement minted; the
    // nine edge functions that gate on it are untouched. Deployment stays the owner's manual
    // act, so the applied head (200) sits behind this repo head by design until then.
    // ⚠ ITS OWN WARNING CAME TRUE: this pin was written relative (`at(-1)`) and rotted the
    // moment 202 was appended below, so it now re-points BY ID like every pin above it.
    expect(plan.waves.find((wave) => wave.id === 'staff-unlock-surveyor-entitlement')).toMatchObject({
      id: 'staff-unlock-surveyor-entitlement',
      from: 201,
      to: 201,
      expectedObjects: [{
        kind: 'function',
        name: 'has_surveyor_entitlement',
      }],
    });
    // ⭐ THE NEW TAIL WAVE (202, design §12.4 / ODQ §934.36): one re-stated SECURITY DEFINER
    // function — _gallery_world_snapshot_is_safe is 136's body verbatim plus two hard_deny
    // members and one alternation alternative, so a stored gallery world snapshot carrying
    // the settlement editor's dmLayer or decrees is rejected server-side. It creates no
    // table, no column, no policy and no row. Deployment stays the owner's manual act, so
    // the applied head (200) now sits TWO migrations behind this repo head by design.
    expect(plan.waves.find((wave) => wave.id === 'edit-registry-public-denylist')).toMatchObject({
      id: 'edit-registry-public-denylist',
      from: 202,
      to: 202,
      expectedObjects: [{
        kind: 'function',
        name: '_gallery_world_snapshot_is_safe',
      }],
    });
    // …and 199, like 197, takes its posture from its OWN annotation rather than the wave
    // policy — but for the opposite reason: 197's data half is deliberately unscripted,
    // while 199's whole reversal IS one scripted statement. Both are
    // documented-manual-reversal, and flattening either into the wave's forward-only
    // policy would tell an operator something untrue about what a rollback costs.
    const referralFunnel = plan.waves
      .flatMap((wave) => wave.migrations)
      .find((migration) => migration.number === 199);
    expect(referralFunnel.rollback).toMatchObject({
      mode: 'documented-manual-reversal',
      source: 'migration-annotation',
    });
    expect(referralFunnel.rollback.note).toMatch(/drop function if exists public\.report_referral_funnel/i);
  });

  // ⭐ MIGRATION 202 IS THE THIRD HAND-MIRRORED DENYLIST (design §12.4, ODQ §934.36).
  // The settlement editor's two persisted keys are refused SERVER-side before any client
  // token for them exists: snapshotDenylistDrift.test.js is one-directional (every client
  // token must have an SQL alternative, never the reverse), so the SQL mirror may — and
  // must — land first. Inert until the owner's `supabase db push`, like every migration here.
  it('denies the settlement editor keys in the net-current gallery scanner, and rejects nothing that exists', () => {
    const scanner = netCurrentGalleryScanner();
    // 202 IS the net-current scanner (latest-wins), and it hard-denies both edit keys.
    expect(scanner.owner).toBe('202_edit_registry_public_denylist.sql');
    expect(hardDenyMembers(scanner.sql)).toEqual(expect.arrayContaining(['dmlayer', 'decrees']));
    // `decrees` now matches the covert/private alternation as a WHOLE key — the membership
    // property the drift test will check EM-B3a's client token against. `dmLayer` already
    // matched through the \m word-boundary `dm` token and gains an explicit hard-deny.
    const alternatives = sqlRegexAlternation(scanner.sql);
    const denies = (key) => alternatives.some((alt) => new RegExp(`^${alt}$`, 'i').test(key));
    expect(denies('decrees')).toBe(true);
    expect(denies('dmLayer')).toBe(true);
    // COUNTERFORCE: the executed scanner/sanitizer fixtures carry zero decree* tokens, so the
    // added alternative rejects nothing that exists today (the pglite suites prove the same
    // property by execution; this arm keeps the claim honest if a fixture ever gains one).
    for (const fixture of [
      'galleryWorldSnapshotScanner.pglite.test.js',
      'gallerySanitize.pglite.test.js',
    ]) {
      expect(
        readFileSync(join(ROOT, 'tests', 'security', fixture), 'utf8'),
        `${fixture} gained a decree* token — re-measure what the new alternative now rejects`,
      // anchored: the positive control two lines up proved the fixture is read and non-empty (its length is asserted), so an absent token is a measured absence, not an unread file
      ).not.toMatch(/decree/i);
    }
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

    // ⭐ 195 is the FIRST migration inside the train to resolve through a DOWN SCRIPT
    // rather than through an annotation or the wave policy, so that branch of
    // classifyRollback is pinned here instead of being carried as an untested arm.
    // Delete supabase/rollback/195_*.down.sql and this reds, next to the rollback
    // discipline walker that owns the same fact from the other side.
    const civilityGuard = plan.waves
      .flatMap((wave) => wave.migrations)
      .find((migration) => migration.number === 195);
    expect(civilityGuard.rollback).toMatchObject({
      mode: 'data-safe-down-script',
      source: 'down-script',
      path: 'supabase/rollback/195_civility_guard_and_public_identity.down.sql',
    });
  });

  it('uses only expected objects touched inside each bounded wave', () => {
    for (const wave of plan.waves) {
      const waveSource = wave.migrations
        .map((migration) => readFileSync(
          join(MIGRATIONS, migration.name),
          'utf8',
        ))
        .join('\n');
      for (const expectedObject of wave.expectedObjects) {
        const unqualifiedName = expectedObject.name.replace(/^public\./, '');
        expect(
          waveSource,
          `${wave.id} does not touch ${expectedObject.name}`,
        ).toContain(unqualifiedName);
      }
    }
  });

  it('plans from a wave boundary the ledger has reached, and refuses a head inside a wave', () => {
    // Production sits at 200 (wave 200's `to`) since the owner's 2026-09-16 push: the live
    // plan starts THERE and carries only the waves past it, without rebasing the train's
    // historical record. A head inside a wave has no checked-in wave describing the
    // remainder, so it is still refused with the boundaries named.
    const live = buildMigrationRehearsalPlan({
      migrationDirectory: MIGRATIONS,
      rollbackDirectory: ROLLBACK,
      appliedHead: 200,
    });
    expect(live).toMatchObject({ appliedHead: 200, repoHead: 202, pendingCount: 2 });
    expect(live.waves.map(({ id, from, to }) => [id, from, to])).toEqual([
      ['staff-unlock-surveyor-entitlement', 201, 201],
      ['edit-registry-public-denylist', 202, 202],
    ]);
    // The ledger itself does NOT move for 202: the owner bumps appliedHead in the same act
    // as `supabase db push`, so the repo sits two migrations ahead until that hand falls.
    const ledgerHead = JSON.parse(
      readFileSync(join(ROOT, 'supabase', 'applied-head.json'), 'utf8'),
    ).appliedHead;
    expect(ledgerHead).toBe(200);
    expect(() => buildMigrationRehearsalPlan({
      migrationDirectory: MIGRATIONS,
      rollbackDirectory: ROLLBACK,
      appliedHead: 150,
    })).toThrow(/wave boundaries are 121, 136, 156, .*200, 201, 202, but the ledger says 150/);
  });

  it('stages no migration beyond the selected wave boundary', () => {
    const snapshot = captureWaveWorkspaceSnapshot(plan);
    const staged = stageWaveWorkspace(136, snapshot);
    temporaryDirectories.push(staged.workspace);
    const numbers = staged.copied.map((name) => Number(name.split('_')[0]));

    expect(snapshot).toMatchObject({
      repoHead: 202,
      migrationCount: 202,
      configSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
      workspaceSourceSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect(Math.max(...numbers)).toBe(136);
    expect(numbers).toContain(MIGRATION_TRAIN_BASE_HEAD + 1);
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
      appliedHead: MIGRATION_TRAIN_BASE_HEAD,
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
      appliedHead: MIGRATION_TRAIN_BASE_HEAD,
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
      appliedHead: MIGRATION_TRAIN_BASE_HEAD,
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
      appliedHead: MIGRATION_TRAIN_BASE_HEAD,
      allowedHosts: ['clone.release.internal'],
      productionRefs: ['db.production-ref.supabase.co'],
      now: new Date('2026-07-25T00:00:00.000Z'),
    })).toThrow(/outboundNetworkDisabled/);

    expect(() => validateCloneAttestation({
      attestation: cloneAttestation(),
      target,
      appliedHead: MIGRATION_TRAIN_BASE_HEAD,
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
      appliedHead: MIGRATION_TRAIN_BASE_HEAD,
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
    // The LIVE plan reads supabase/applied-head.json (200 since the owner applied 122–200 to
    // production on 2026-09-16); the fixture arms above keep MIGRATION_TRAIN_BASE_HEAD as the
    // train's historical base. Pinning the constant here failed the day production caught up.
    const liveAppliedHead = JSON.parse(readFileSync(join(ROOT, 'supabase', 'applied-head.json'), 'utf8')).appliedHead;
    expect(JSON.parse(result.stdout)).toMatchObject({
      appliedHead: liveAppliedHead,
      repoHead: 202,
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
