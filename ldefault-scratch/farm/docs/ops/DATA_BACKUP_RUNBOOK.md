# Data Backup Runbook

The posture, verification, and cadence for not losing user data. The mechanics of
the portable dump/restore **drill** live in **`docs/RUNBOOK_BACKUP_RESTORE.md`**
(the authority on `scripts/backup-restore-drill.mjs`); this document is the
ops-framing on top — what the backup posture *is*, how to confirm it's real, when
to test it, and who owns each step.

> Steps marked `[OWNER]` require the Supabase dashboard + credentials that are not
> (and must not be) in the repo. The production project ref and access token live
> only in the operator's environment. Nothing in this repo can verify or configure
> the platform backup posture — it is entirely a dashboard/plan concern.

---

## 1. What backs the data up

Two independent lines of defense:

1. **Supabase-managed backups + Point-in-Time Recovery (PITR).** The first line of
   recovery, restorable from the dashboard. **PITR is a paid-plan feature** (Supabase
   gates it behind Pro-tier + the PITR add-on; the exact tier is a Supabase pricing
   fact, not knowable from this repo). It is **not** expressible in
   `supabase/config.toml` — `config.toml` is local-dev config only and carries no
   backup settings. So "is PITR on?" is answerable **only** in the dashboard.
2. **A portable second copy** — the logical dump/restore/verify drill in
   `docs/RUNBOOK_BACKUP_RESTORE.md` via `scripts/backup-restore-drill.mjs`
   (`--check` → `--dump` → `--restore --target` → `--verify`). This is the
   provider-independent fallback if the Supabase project itself is lost.

---

## 2. [OWNER] Verify PITR is actually enabled

Nothing in-repo proves prod has backups on. Confirm it, on a schedule:

1. Supabase dashboard → **Project → Database → Backups**.
2. Confirm **Point-in-Time Recovery** shows *enabled* with a retention window
   (typically 7 days on the base PITR add-on) — not just the free daily logical
   backups.
3. If it shows disabled, PITR is **not protecting you** — enable the add-on before
   treating the project as launch-ready. Note the retention window; it is your
   maximum "how far back can we go".

Record the check (date + retention window) somewhere durable. An unverified "we
have PITR" is the assumption that fails exactly when you reach for it.

---

## 3. Quarterly restore-test checklist

A backup you have never restored is a hypothesis. Run this attended, on a quarterly
cadence (the drill execution is [OWNER] — it needs credentials and is not automated;
the repo provides the tooling, not the run):

- [ ] `[OWNER]` **PITR reachable** — dashboard → Backups shows a restorable window (§2).
- [ ] `[OWNER]` **Logical dump succeeds** — `node scripts/backup-restore-drill.mjs --check` then `--dump` (see `docs/RUNBOOK_BACKUP_RESTORE.md` for the exact env + flags).
- [ ] `[OWNER]` **Restore into a scratch target** — `--restore --target <fresh-db-url>` (never restore over prod in a test).
- [ ] `[OWNER]` **Verify the restore** — `--verify` (row-count / integrity checks per the drill).
- [ ] `[OWNER]` **Migration head matches** — `SUPABASE_MIGRATION_HEAD=<restored-head> npm run validate:migration-head` on the restored copy has no drift.
- [ ] Record the date, the retention window, and any surprises.

For a **real** data-loss incident (not a drill), the abbreviated procedure is in
`docs/RUNBOOK_BACKUP_RESTORE.md` §"Recovery-in-anger": stop writes → prefer PITR
from the dashboard → fall back to the latest verified logical dump into a fresh
project + repoint env vars → verify before re-enabling writes.

---

## 4. User-data export — what it is and is NOT

The in-app **Export** button (Account → Data & Privacy →
`src/lib/accountData.js` `buildAccountExport`) writes a JSON snapshot assembled
from the user's **live browser store**: profile basics (email / display name /
tier), their settlements, and campaigns. That is all it contains.

It is **not** a full data-subject-access export. Ticket history, purchase records,
deletion-request rows, and analytics envelopes are **not** in it — that data exists
only in Postgres, i.e. only in the backup/PITR path this runbook covers. If a real
GDPR-scope export or erasure-of-record request must be honored beyond the in-app
tool, it is served from the database (a manual query + the backup lineage), not
from the Export button. Account **deletion** is separate and server-side
(`account-actions` `request_deletion` → soft-delete with a grace window; the client
can never hard-delete — RLS forbids it).

---

## 5. Housekeeping gap to close

`.gitignore` has **no `backups/` entry**, yet `docs/RUNBOOK_BACKUP_RESTORE.md`
instructs keeping dumps off the repo. Nothing currently blocks a careless
`git add` of a dump (which would commit real user data). [OWNER] add `backups/` to
`.gitignore` (or keep dumps entirely outside the repo tree) before running the
drill for real.

---

## See also
- `docs/RUNBOOK_BACKUP_RESTORE.md` — the drill mechanics + recovery-in-anger (authority).
- `docs/ops/DEPLOY_ROLLBACK_RUNBOOK.md` — deploy/rollback; the forward-only migration law.
- `docs/PHASE6_DATA_LIFECYCLE.md` — research/analytics data lifecycle (distinct from account backup).
