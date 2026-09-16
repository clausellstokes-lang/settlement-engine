# Post-deploy verification and release receipt

This is the final fail-closed proof after the client, migrations, and edge
functions have been deployed. It performs no deploy and no production write.
A successful run emits one source-bound release receipt; a partial or failed
run emits diagnostics only and cannot mint a release receipt.

This runbook implements the release evidence obligations in
`docs/ops/SERVICE_OBJECTIVES.md`. Those objectives remain policy; this tool is
the concrete evidence collector for the HTTPS/CSP, migration-history, public
health, durable-obligation, and unresolved application-command portions.

## What is proved

The verifier requires all of the following:

1. **Source identity.** `/api/release` on both the app and map origins reports
   the exact Git commit of the clean checkout running the verifier. Vercel
   supplies `VERCEL_GIT_COMMIT_SHA`; other hosts may set a hexadecimal
   `VITE_RELEASE` or `RELEASE`.
2. **Application HTTPS/CSP.** The request stays on the configured HTTPS origin,
   returns 2xx, has enforced (not report-only) CSP and HSTS, keeps the app
   `script-src` strict, and admits exactly the configured FMG origin in
   `frame-src`.
3. **FMG isolation.** The map request stays on its dedicated HTTPS origin, pins
   the repository's map revision and exact `parentOrigin`, carries enforced CSP
   whose `frame-ancestors` exactly match the declared app origins, retains only
   the fork's scoped inline/eval allowances, has no conflicting
   `X-Frame-Options`, and serves bridge/main references carrying the pinned map
   revision. The receipt records the served index hash, never its body.
4. **Public health.** At least one named, configurable HTTPS JSON probe returns
   `ok=true`. A URL with `deep=1` must additionally report `db=up`.
5. **Migration currency.** The PostgreSQL host and pooled principal are bound
   to the same explicit production project as `SUPABASE_URL`; a query forced to
   `default_transaction_read_only=on` then proves its live migration history is
   numeric and contiguous from 1 through the exact repository head.
6. **Combined operational health.** Both service-only health RPCs return their
   versioned schemas. The verifier takes the worse severity across external
   refund/deletion/webhook obligations and unresolved application commands, and
   requires that combined result to remain inside the declared ceiling. A
   missing or malformed response from either authority fails closed.

The receipt contains response decisions, status codes, timings, public
credential-free origins, migration-history summary, map revision, Git identity,
and an evidence digest. It never stores response bodies, authorization headers,
database URLs, access tokens, customer content, or raw operational errors.

## Prerequisites

- Run from the clean checkout/commit that should be live. Dirty release evidence
  is rejected.
- Complete the production steps in `docs/DEPLOY.md`.
- Deploy `api/release.js` on both public origins. In each Vercel project's
  Settings → Environment Variables, enable **Automatically expose System
  Environment Variables** so the runtime receives `VERCEL_GIT_COMMIT_SHA`;
  otherwise set a hexadecimal `RELEASE` explicitly. The endpoint fails closed
  when neither is available.
- Deploy the public `health` function. Use `?deep=1` for release verification.
- Apply migrations 182 and 184 so
  `report_operational_obligation_health(integer)` and
  `report_application_command_health(integer)` exist.
- Install `psql`.

Use a dedicated login with only `USAGE` on `supabase_migrations` and `SELECT` on
`supabase_migrations.schema_migrations` when practical. The verifier also
forces every psql session read-only, so an accidentally broader login cannot be
used by this process to mutate state.

`SUPABASE_SERVICE_ROLE_KEY` is necessarily privileged. The verifier derives two
fixed RPC URLs from `SUPABASE_URL`, rejects non-HTTPS configuration, forbids
redirects, sends the key only to those exact requests, and never prints it.

## Run

Supply the PostgreSQL URL through the environment, not as a command-line
argument:

```bash
export POST_DEPLOY_DATABASE_URL='postgresql://release_verifier:REDACTED@db.production-ref.supabase.co:5432/postgres?sslmode=verify-full'
export SF_PRODUCTION_DATABASE_HOST='db.production-ref.supabase.co'
export SUPABASE_URL='https://production-ref.supabase.co'
export SUPABASE_SERVICE_ROLE_KEY='REDACTED'

npm run ops:post-deploy -- \
  --app-url https://settlementforge.com \
  --health 'edge=https://production-ref.functions.supabase.co/health?deep=1' \
  --receipt /secure/release/post-deploy.json
```

The production defaults are:

- app: `https://settlementforge.com`;
- map: `https://map.settlementforge.com/map/index.html`;
- allowed map parents: `https://settlementforge.com` and
  `https://www.settlementforge.com`;
- combined operational-health ceiling: `healthy`;
- request timeout: 10 seconds;
- operational stale window: 30 minutes.

Additional public probes are repeatable:

```bash
npm run ops:post-deploy -- \
  --health 'edge=https://production-ref.functions.supabase.co/health?deep=1' \
  --health status=https://status.settlementforge.com/api/health \
  --json
```

The release receipt is deliberately pinned to the two production app origins
and `https://map.settlementforge.com/map/index.html`. Use a separate
non-release diagnostic for staging; a staging or preview host cannot mint this
production receipt. `--app-origin` remains repeatable only to declare the exact
production parents that the map CSP must expose.

## Interpret the outcome

Success prints the receipt path and exits 0. The receipt has:

- `kind=settlementforge_post_deploy_verification`;
- `passed=true`;
- a clean source identity and exact deployed `expectedRelease`;
- no `failedChecks`;
- live migration history contiguous through the repository head;
- both operational schemas and their combined severity inside the chosen ceiling.

Any failed check exits 1 and **does not write a receipt**. This distinction is
intentional: diagnostic JSON is not release evidence.

Common failures:

| Failure | Meaning | Action |
|---|---|---|
| `release.app.source` / `release.map.source` | an origin serves a different commit | Stop; inspect deployment promotion/alias before any further release action |
| `app.csp.map-origin` | app cannot frame the exact FMG host | Correct the deployed `vercel.json`/host assignment and redeploy |
| `map.csp.frame-ancestors` | map accepts too many/few parents | Correct the map-host CSP; do not weaken the app CSP |
| `map.x-frame-options` | legacy header blocks cross-origin framing | Remove it from the map path; CSP `frame-ancestors` is authoritative |
| `health.*.database` | edge runtime is up but DB is not proven reachable | Inspect Supabase availability/configuration |
| `migration.history-contiguous` | schema history is skipped, non-numeric, or internally inconsistent | Stop; repair the migration ledger before evaluating currency |
| `migration.head-current` | schema and code disagree | Stop the release; reconcile migration history before serving dependent code |
| `obligations.schema` | the migration-182 authority is absent or malformed | Stop; verify the deployed migration and RPC response before trusting queue state |
| `application-commands.schema` | the migration-184 authority is absent or malformed | Stop; verify the deployed migration and RPC response before trusting command state |
| `operational-health.severity` | refund/deletion/webhook or unresolved application-command work needs attention | Follow the recovery actions in `SERVICE_OBJECTIVES.md`; acknowledgement alone does not clear it |

Do not raise `--max-operational-severity` merely to obtain a green receipt. A
temporary `warning` ceiling is an explicit incident/release-owner decision and
must be recorded with the diagnostic output. The older
`--max-obligation-severity` spelling remains accepted for automation
compatibility, but it controls the same combined decision.

## Retention

The default path is `artifacts/ops/post-deploy/`, which is gitignored. Copy the
receipt into the encrypted release evidence store alongside:

- code, Deno, build, and distribution gate receipts;
- migration-clone rehearsal and backup/restore receipts;
- realm-scale certification;
- browser/mobile measurements;
- authenticated synthetic data canary evidence;
- private-monitor configuration and its latest alert-delivery drill receipt;
- rollback target and compatibility decision.

Receipts are written mode `0600`, atomically published, and never overwrite an
existing file.
