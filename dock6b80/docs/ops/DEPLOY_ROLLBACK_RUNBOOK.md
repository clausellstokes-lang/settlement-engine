# Deploy / Rollback Runbook

Incident-time rollback for SettlementForge. This is the "it's on fire, get us back
to a known-good state" runbook. For the full first-cutover / forward-deploy
procedure see **`docs/DEPLOY.md`** (the canonical deploy runbook — it is
freshness-pinned and lists every edge function + the current migration head); this
document does not duplicate it, it restates the reverse path in incident form.

> **Owner-dashboard steps are marked `[OWNER]`.** They require Vercel / Supabase
> dashboard access and credentials that are deliberately not in the repo. Claude
> and CI cannot perform them.

---

## 0. What "a deploy" actually is here

Three independently-deployed surfaces, each with its own rollback:

| Surface | How it ships | Rollback unit |
|---|---|---|
| **Client** (the SPA) | Vercel builds `npm run build` on a push to `master` (Vercel's own git integration) | a **commit SHA** on `master` |
| **Edge functions** | `npx supabase functions deploy <name>` (or `scripts/deploy.sh`) — **by hand, from the local tree**, ungated | a **commit SHA** (per function) |
| **Database** | `npx supabase db push` — **forward-only** | *not* rolled back (see §3) |

**There are no git tags** (`git tag -l` is empty) and no `CHANGELOG`; the release
unit is a commit SHA. "Redeploy the prior tag" does not map onto this repo — read
every step below as "the prior **SHA**". If you want tag-based releases going
forward, that is a new practice to propose, not one that exists.

Deploy detection: the app is on **Vercel** (`vercel.json` → `buildCommand: npm run
build`, `outputDirectory: dist`). CI (`.github/workflows/ci.yml`) is an **advisory
gate** today — `VERCEL_TOKEN` / `VERCEL_DEPLOY_HOOK_URL` are unset, so the CI
`deploy`/`redeploy` jobs are dormant and Vercel's own push-build is what actually
ships. [OWNER] confirm in the Vercel dashboard whether push-auto-deploy is still on.

---

## 1. Client rollback (the SPA)

The client is static and safe to revert freely.

**Preferred — revert the commit (keeps history honest, re-runs the gate):**
```bash
git revert <bad-sha>            # or a range: git revert <first>^..<last>
git push origin master          # Vercel auto-builds the revert commit
```
The revert is a normal forward build; the sitemap regenerates in `prebuild`, and
the app is back to the prior behavior once Vercel finishes (~1–2 min).

**Faster — promote the last-good Vercel deployment [OWNER]:**
Vercel dashboard → Project → Deployments → the last-known-good build → **⋯ →
Promote to Production**. Instant, no rebuild, no git change. Use this when you need
the site back *now* and will land the `git revert` immediately after so the repo
and prod agree.

> Do **not** leave prod promoted to an old deployment without a matching `git
> revert` — the next push to `master` rebuilds from `master`'s tip and silently
> re-ships the bad code.

---

## 2. Edge-function rollback

Edge functions are **the one ungated path to prod** (`docs/DEPLOY.md` §"Edge
functions"): deployed by hand from whatever the local tree contains, with nothing
checking CI is green or the tree is clean. That cuts both ways — it also means you
can roll a single function back in seconds without touching anything else.

**Roll one function back to a known-good SHA:**
```bash
git checkout <good-sha> -- supabase/functions/<name>/
npx supabase functions deploy <name>       # add --no-verify-jwt for the anon set (see config.toml / DEPLOY.md)
git checkout master -- supabase/functions/<name>/   # restore your working tree
```
The `--no-verify-jwt` flag is derived from `supabase/config.toml`'s
`[functions.<name>]` block when you use `bash scripts/deploy.sh` — prefer that
script (it parses config.toml, the single source of truth) over a hand-typed flag.

**Discipline (from `docs/DEPLOY.md`):** deploy only from a clean tree at a pushed,
CI-green commit, and **write down the deploying SHA** — there is no automated
ledger of which commit's functions are live. If `_shared/` changed, rebuild it
first: `npm run build:edge-shared`.

---

## 3. Database — the never-rollback-schema law

**Supabase migrations are forward-only.** `supabase db push` applies `NNN_*.sql`
in lexical order; there is no built-in `down`. This is documented in
**`supabase/rollback/README.md`** — read it before touching a live schema.

**Do NOT try to "roll back" a schema in anger.** Instead:

1. **Forward-fix.** Write a *new* migration that corrects the problem (drops the
   bad constraint/trigger/index, restores the prior shape) and `db push` it. This
   is the default and almost always the right move.
2. **Only for cleanly-additive, data-safe reversals** (a trigger/function/index a
   migration *added*), a partial down-migration may exist in `supabase/rollback/`
   (currently 5: 087, 097, 103, 107, 108). Run by hand:
   ```bash
   psql "$DATABASE_URL" -f supabase/rollback/<n>_*.down.sql
   ```
   These never reverse data migrations or RLS tightening — reversing those
   re-opens security holes or loses data. For those, restore from **PITR**
   (see `docs/ops/DATA_BACKUP_RUNBOOK.md`).
3. New money/PII migrations must ship a reversal or a `-- @rollback:` note
   (enforced by `tests/docs/migrationRollbackDiscipline.test.js`).

Before a production push, the bounded clone rehearsal in
`docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md` classifies every pending migration.
An existing `.down.sql` or migration-local `@rollback` note is preserved;
otherwise the enclosing wave records an explicit forward-only posture. That
receipt is the incident-time map from a failed subsystem wave to its reviewed
recovery rule—it is not permission to reverse data or RLS automatically.

**Applied-head caveat.** `supabase/applied-head.json` records the migration live in
prod. It can lag the repo head — that is the *documented-normal* commit→push window
(`tests/docs/migrationAppliedHead.test.js` treats "pending" as OK). Before any
deploy, [OWNER] reconcile: `db push` the pending migrations, verify with
`npx supabase migration list`, then bump `applied-head.json`. Do **not** bump the
ledger before the push actually ran — the ledger's whole job is to not lie about
prod.

---

## 4. Fast triage — what to look at

| Symptom | Likely surface | First move |
|---|---|---|
| Whole site blank / JS error after a push | Client | §1 (revert or promote-last-good) |
| One feature 500s; checkout/mail/AI fails | Edge function | §2 (roll that one function back) |
| DB errors / RLS denials after a migration | Database | §3 (forward-fix; never reverse) |
| "Is it even up?" | Any | run the probe below |

**Uptime probe** (`scripts/ops/uptime-probe.mjs`, added in Wave E):
```bash
SITE_URL=https://settlementforge.com \
HEALTH_URL=https://<project-ref>.functions.supabase.co/health \
node scripts/ops/uptime-probe.mjs --deep --json
```
Exits non-zero on failure. The `health` edge function answers liveness (`GET` →
200) and, with `?deep=1`, a DB reachability probe (200 `db:up` / 503 `db:down`).
[OWNER] schedule the probe (cron / GitHub Action / an external uptime service —
UptimeRobot, Better Stack, Pingdom are already on the edge bot allow-list) and
wire alerting there.

---

## See also
- `docs/DEPLOY.md` — the canonical forward-deploy runbook (client / DB / edge / Stripe).
- `docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md` — bounded production-clone migration proof.
- `docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md` — source/CSP/head/obligation release receipt.
- `docs/ops/SERVICE_OBJECTIVES.md` — launch objectives and complete release-evidence policy.
- `supabase/rollback/README.md` — the forward-only law + the partial down-migrations.
- `docs/ops/DATA_BACKUP_RUNBOOK.md` — PITR + restore drill (the data-loss recovery path).
- `docs/ops/PRODUCTION_EMAIL_RUNBOOK.md` — auth SMTP + the transactional mail seam.
