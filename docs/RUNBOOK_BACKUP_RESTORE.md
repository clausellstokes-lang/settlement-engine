# Runbook — Supabase Backup & Restore Drill

The production database is the only application state that is **not** in git —
settlements, saves, the credit ledger, and auth rows all live in Supabase. A
backup you have never restored is not a backup. This runbook is the disaster-
recovery rehearsal; `scripts/backup-restore-drill.mjs` is its tooling.

> **Ownership.** The *drill execution* (dumping prod, restoring it, verifying)
> is on the **owner's human checklist** — it touches production credentials and
> is done attended, on a cadence (quarterly is the target). The script makes the
> rehearsal repeatable and its outcome checkable; it does not run the drill for
> you unattended, and it **hard-refuses to restore over a production host.**

## What Supabase already gives you

- **Automated daily backups + Point-in-Time Recovery (PITR)** on the paid
  project — managed by Supabase, restorable from the dashboard
  (Project → Database → Backups). This is the first line of recovery.
- This runbook adds the **portable second copy**: a logical `pg_dump`/
  `supabase db dump` you hold outside Supabase, and — crucially — the **proof
  that it restores**.

## Prerequisites

| Requirement | Notes |
|---|---|
| Supabase CLI | `npx supabase --version` (the repo already uses it in `scripts/deploy.sh`). |
| `psql` (libpq) | For the restore + verify legs (local Postgres client). |
| `SUPABASE_PROJECT_REF` | The prod project ref (e.g. from `scripts/deploy.sh`). |
| `SUPABASE_ACCESS_TOKEN` | A Supabase access token with read access to the project. |
| A local/scratch Postgres | The **restore target** — never prod. `supabase start` gives you one at `postgresql://postgres:postgres@127.0.0.1:54322/postgres`. |

## The drill (four steps)

### 0. Preflight (non-destructive, no secrets needed)

```bash
node scripts/backup-restore-drill.mjs           # --check is the default
```

Verifies the CLI is reachable, the drill env vars, and that
`supabase/applied-head.json` is internally consistent with the migration files
(contiguous, head not exceeded). This is the leg that is safe to run in a
scheduled CI lane — it exits 0 with no database access.

### 1. Dump production (attended, owner)

```bash
export SUPABASE_PROJECT_REF=<prod-ref>
export SUPABASE_ACCESS_TOKEN=<token>
node scripts/backup-restore-drill.mjs --dump
```

Links the project and writes `backups/supabase-<ref>-<timestamp>.sql`, then
asserts the artifact is non-empty. Keep this file **off** the repo (the
`backups/` directory is drill scratch — do not commit dumps; they contain user
data). Store it in the encrypted backup location per the security policy.

### 2. Restore into a scratch database (attended, owner)

```bash
# e.g. a local `supabase start` instance — NEVER a *.supabase.co host
node scripts/backup-restore-drill.mjs \
  --restore backups/supabase-<ref>-<timestamp>.sql \
  --target 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
```

The script **refuses** any `--target` whose host looks like a Supabase prod
host. On success it runs the verification leg automatically.

### 3. Verify the restore (integrity checks)

```bash
node scripts/backup-restore-drill.mjs \
  --verify 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
```

Checks the core tables (`settlements`, `saves`, `credit_ledger`) exist and carry
rows — a hollow restore (schema but no data, or a partial COPY) is a failed
restore and reds the drill.

## Recording the drill

After a successful rehearsal, log it (date, dump size, restore time, any
surprises) in the RISK_REGISTER / owner checklist so the "last verified restore"
date is never tribal knowledge. If any leg fails, that is the signal the backup
strategy is broken **before** you need it — treat it as a P0.

## Recovery-in-anger (real incident, abbreviated)

1. Stop writes (put the app in maintenance / disable the deploy).
2. Prefer **PITR from the Supabase dashboard** to the closest good point — it is
   faster and more complete than a logical restore.
3. If PITR is unavailable, restore the latest verified logical dump into a fresh
   project, repoint `VITE_SUPABASE_URL`/keys, and re-run `validate:migration-head`
   to confirm the schema head. The migration ledger (`supabase/applied-head.json`,
   head **117** applied of repo head **127** at last edit) tells you which
   migrations must be re-applied to reach code parity.
4. Verify with step 3's checks against the restored DB before re-enabling writes.
