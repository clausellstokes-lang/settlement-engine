# Runbook — Supabase backup and restore proof

**Status:** current operational runbook
**Owner:** production operator
**Last code verification:** 2026-07-24
**Tool:** `scripts/backup-restore-drill.mjs`

The database is the part of SettlementForge that git cannot recreate: accounts,
settlements, campaigns, credit history, payment obligations, and deletion work
live in Supabase. A backup is not proven until it has restored into an isolated
database and passed integrity checks.

This runbook has two layers:

1. Supabase-managed backups and Point-in-Time Recovery are the primary recovery
   path.
2. An encrypted logical dump is the portable second copy. The drill below proves
   that copy can restore.

The script is safe by positive admission:

- restore targets are localhost unless their exact hostname is listed in
  `SF_RESTORE_DRILL_ALLOWED_HOSTS`;
- every Supabase-hosted target is refused, even if it is allowlisted;
- connection credentials are never printed;
- a dump must match its adjacent SHA-256 manifest unless an attended operator
  explicitly passes `--allow-unmanifested`;
- receipts contain counts and opaque ID checksums, not row bodies or secrets;
- `backups/` is gitignored and every artifact is written mode `0600`.

## Prerequisites

| Requirement | Purpose |
|---|---|
| Supabase CLI (`npx supabase --version`) | Creates the portable logical dump. |
| `psql` | Restores and executes integrity queries. |
| `SUPABASE_PROJECT_REF` | Selects the source project for `--dump`. |
| `SUPABASE_ACCESS_TOKEN` | Authorizes the attended dump. |
| Isolated PostgreSQL target | Receives the restore. Local Supabase at `127.0.0.1:54322` is the normal target. |
| Encrypted backup store | Receives the dump, manifest, and successful drill receipt after rehearsal. |

The repository never stores production database credentials or dump artifacts.

## 0. Preflight

```bash
node scripts/backup-restore-drill.mjs --check
```

Preflight is non-destructive. It verifies:

- `npx`, `psql`, and `git` are available;
- migration filenames are contiguous;
- `supabase/applied-head.json` names a real migration and does not exceed the
  repository head;
- `backups/` is excluded from git;
- dump credentials are reported as present or absent without printing them.

A missing `psql` is a failure because a machine that can create but not rehearse
a backup is not drill-ready.

## 1. Create the portable copy

Run attended:

```bash
export SUPABASE_PROJECT_REF=<production-project-ref>
export SUPABASE_ACCESS_TOKEN=<supabase-access-token>
node scripts/backup-restore-drill.mjs --dump
```

The tool writes:

```text
backups/supabase-<ref>-<timestamp>.sql
backups/supabase-<ref>-<timestamp>.sql.manifest.json
```

The manifest records the source project ref, recorded production migration head,
repository head and commit, byte size, and SHA-256. It contains no access token,
database password, or row data.

Move both files into the encrypted backup store. Do not email them, attach them
to a task, upload them to an unencrypted drive, or add them to git.

## 2. Restore into an isolated target

Local Supabase is the preferred rehearsal target:

```bash
node scripts/backup-restore-drill.mjs \
  --restore backups/supabase-<ref>-<timestamp>.sql \
  --target 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
```

For a remote scratch database, admit its exact hostname for this attended
command:

```bash
export SF_RESTORE_DRILL_ALLOWED_HOSTS='drill-db.internal.example'
node scripts/backup-restore-drill.mjs \
  --restore backups/supabase-<ref>-<timestamp>.sql \
  --target "$SCRATCH_DATABASE_URL"
```

Do not add a production hostname. The script independently rejects
`*.supabase.co`, `*.supabase.com`, and `*.supabase.net`.

An older independently verified dump without a manifest can be restored only
with `--allow-unmanifested`. Record the provenance check in the incident/drill
log; the resulting receipt will show that no source manifest was available.

## 3. What verification proves

Restore automatically runs verification. It can also run separately:

```bash
node scripts/backup-restore-drill.mjs \
  --verify 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
```

The verifier checks:

- `profiles`, `settlements`, `saved_maps`, and `credit_ledger` exist;
- the restore contains application rows (an intentionally empty fixture needs
  explicit `--allow-empty`);
- the Supabase migration ledger reaches the production head recorded in
  `supabase/applied-head.json`;
- row-level security is enabled on core owner data;
- public foreign keys are validated;
- profiles, settlements, saved maps, and credit rows have no missing auth owner;
- profile credit balances are non-negative;
- when present at the restored migration head, account-deletion, refund, and
  Stripe-webhook queue states are internally coherent.

It records row counts and SHA-like checksums over ordered opaque IDs. Those
checksums detect hollow or materially different restores without copying row
content into the receipt.

The evidence receipt is written under:

```text
backups/drill-receipts/backup-restore-drill-<timestamp>.json
```

It includes restore and verification durations, artifact age, source manifest,
schema heads, counts, checksums, and every pass/fail result. Copy the successful
receipt into the encrypted operational evidence store.

## 4. Cadence and acceptance

Run the full attended drill:

- quarterly;
- after changing the backup/PITR plan;
- after a material schema or auth-provider change;
- before launch;
- after moving projects or regions.

A passing code preflight is not a completed drill. Acceptance requires:

1. a fresh production dump and manifest;
2. an isolated restore;
3. a green evidence receipt;
4. the measured restore time within the current recovery objective;
5. an operator review of any new warnings or unexpectedly large count change.

The service objectives and last completed drill date live in
`docs/ops/SERVICE_OBJECTIVES.md`, not in a hard-coded migration number here.

## Recovery during an incident

1. Stop or fence writes.
2. Record incident start and the newest known-good time.
3. Prefer Supabase PITR to a fresh project when it meets the recovery point.
4. If PITR is unavailable, restore the newest verified logical copy into a fresh
   project. Never overwrite the damaged project in place.
5. Run this verifier and the post-deploy verification suite against the new
   project.
6. Apply any migrations after the restored source head using the rehearsed
   migration waves. Do not edit `applied-head.json` until live schema probes pass.
7. Rotate keys, repoint the application, verify account/billing/deletion workers,
   then reopen writes.
8. Preserve the incident receipt and perform a no-blame review.

Logical dumps do not by themselves prove the RPO promised by the managed backup
plan. The receipt records artifact age; the production operator must also verify
Supabase backup/PITR cadence in the provider console.
