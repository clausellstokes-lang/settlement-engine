# Production migration rehearsal

This runbook proves the pending Supabase migration train on a
production-shaped clone before any production database write. It is an
attended release operation, not a CI substitute and not a deployment command.

The current checked-in train starts at the production ledger head in
`supabase/applied-head.json` (117) and ends at the repository head (188):

| Wave | Migrations | Boundary |
|---|---:|---|
| Activation, trust, and market plane | 118–136 | Activation, request idempotency, projections, consent/email, analytics |
| Founder, Surveyor, and community | 137–156 | Founder custody, AI/Surveyor controls, gallery reactions, abuse limits |
| Money, lifecycle, and moderation | 157–174 | Money events, auto-reload, sessions, founder lifecycle, retention/moderation |
| Durable external obligations | 175–182 | Deletion, refunds, leased webhooks, operator health |
| Application-command authority | 183–184 | Durable command identity, reconciliation, atomic canon-event CAS, and atomic structured-import create/rehome |
| Versioned custom content | 185 | Immutable definitions and revisions, pack and environment versions, reviewed activation, and the transactional extension-language boundary |
| Campaign content-binding authority | 186 | Saved-map row locking, reviewed binding compare-and-swap, and blind-write prevention |
| Custom-content archive transfer | 187 | Constitutional archive export, deterministic identity remapping, transactional restore, and local-to-cloud cutover |
| Reviewed supply-chain persistence | 188 | Exact reviewed-chain identity, transaction-bound command authority, archive repair, campaign bindings, lifecycle generations, and legacy quarantine |

The manifest is deliberately finite. If either the applied ledger or repository
head changes, planning fails until an engineer reviews and rebases these
boundaries. The tool never absorbs an unreviewed migration into “the rest.”

## What the runner proves

For every wave, the runner:

1. captures one immutable migration/config workspace, verifies its pending
   hashes against the reviewed plan, and rejects source drift;
2. stages a temporary Supabase project from that snapshot containing no
   migration above the wave;
3. runs `supabase db push --dry-run`;
4. applies that bounded set with `supabase db push`;
5. proves migration history is numeric and contiguous through the wave head;
6. proves the wave's expected tables/functions exist;
7. captures pre/post exact counts for profiles, settlements, the credit ledger,
   and spend allocations;
8. rejects missing/invalid observations, disappearing core rows, or increases
   in invalid constraints, credit
   balance mismatches, or orphan spend allocations.

The final private receipt binds the observations to:

- Git commit plus a fingerprint of tracked and untracked release inputs;
- SHA-256 of every migration in the train;
- SHA-256 of the full staged migration/config workspace;
- the source snapshot/backup receipt;
- exact attested clone host, database, and rehearsal id;
- the Supabase CLI version and per-wave output digests.

Every migration also receives a rollback classification. A migration's own
`@rollback` note or data-safe `.down.sql` wins; older omissions inherit the
wave's explicit **forward-only** policy. There is no “unknown” rollback state.

## Hard safety boundary

Execution requires all of these independent controls:

- a non-loopback, TLS-required PostgreSQL URL supplied only through
  `REHEARSAL_DATABASE_URL`;
- the exact host in `SF_MIGRATION_REHEARSAL_ALLOWED_HOSTS`;
- a fresh clone attestation matching the target host, port, database, source
  applied head, and source snapshot receipt;
- clone-only Postgres settings matching the same rehearsal id;
- four positive isolation attestations: no customer traffic, no outbound
  network, no production secrets, and paused scheduled jobs;
- at least one explicit production database host/project reference is required
  and denylisted (host and pooled-connection principal are checked).

The runner does not accept a connection URL on the command line, does not use
`DATABASE_URL`, and does not infer a target from a linked Supabase project.
Read probes are forced to `default_transaction_read_only=on`. Only the
Supabase CLI subprocess can write, and only after all clone admissions pass.

## 1. Provision the production-shaped clone

Use a fresh Supabase branch or restore the release-candidate backup into an
isolated remote PostgreSQL environment. Follow
`docs/ops/DATA_BACKUP_RUNBOOK.md` / `docs/RUNBOOK_BACKUP_RESTORE.md` and retain
the source backup or clone-provisioning receipt.

Before connecting the runner:

1. remove production Stripe, Resend, AI-provider, cron, and webhook secrets;
2. disable external network egress;
3. pause `pg_cron`, worker schedules, and webhook delivery;
4. ensure no customer/application traffic can reach the clone;
5. confirm the restored migration history ends at the checked-in applied head.

These are substantive isolation controls. Do not mark an attestation `true`
because the clone is merely named “staging.”

Set two clone-only database settings using an attended admin session. Replace
the database name and rehearsal id with the exact attestation values:

```sql
alter database settlementforge_rehearsal
  set "settlementforge.environment" = 'migration-rehearsal';
alter database settlementforge_rehearsal
  set "settlementforge.rehearsal_id" = 'release-2026-07-24-a';
```

Disconnect after setting them; `ALTER DATABASE ... SET` is observed by new
connections.

## 2. Create the short-lived attestation

Store this outside the repository (for example in the encrypted release
evidence directory):

```json
{
  "schemaVersion": 1,
  "kind": "settlementforge_migration_rehearsal_clone",
  "rehearsalId": "release-2026-07-24-a",
  "environment": "migration-rehearsal",
  "createdAt": "2026-07-24T12:00:00.000Z",
  "expiresAt": "2026-07-26T12:00:00.000Z",
  "source": {
    "appliedHead": 117,
    "snapshotReceiptSha256": "64-lowercase-hex-characters"
  },
  "target": {
    "host": "clone.release.internal",
    "port": "5432",
    "database": "settlementforge_rehearsal"
  },
  "isolation": {
    "customerTrafficDisabled": true,
    "outboundNetworkDisabled": true,
    "productionSecretsRemoved": true,
    "scheduledJobsPaused": true
  }
}
```

Attestations expire in at most seven days. The receipt hash is the SHA-256 of
the backup/clone-provisioning receipt, not the database dump's password-bearing
command or URL.

## 3. Review the plan

Planning is local and read-only:

```bash
npm run ops:migrations:rehearse
npm run ops:migrations:rehearse -- --json
```

Review all wave boundaries, object expectations, migration hashes, and rollback
classifications. A new repository head, changed migration byte, numbering gap,
or changed applied ledger is a release-plan change that must be reviewed.

## 4. Execute on the clone

Install a reviewed Supabase CLI on `PATH` and `psql`. Record the CLI provenance
in the release record; the generated receipt records `supabase --version`.

Use a percent-encoded connection URL and an exact host allowlist:

```bash
export SF_MIGRATION_REHEARSAL_ALLOWED_HOSTS=clone.release.internal
export SF_PRODUCTION_DATABASE_HOST=db.production-ref.supabase.co
export SUPABASE_PROJECT_REF=production-ref
export REHEARSAL_DATABASE_URL='postgresql://operator:REDACTED@clone.release.internal:5432/settlementforge_rehearsal?sslmode=verify-full'

npm run ops:migrations:rehearse -- \
  --execute \
  --attestation /secure/release/clone-attestation.json \
  --receipt /secure/release/migration-rehearsal.json
```

`SF_SUPABASE_CLI_BIN=/reviewed/path/to/supabase` may select an explicitly
installed binary. The command uses argument-array child processes; it never
constructs a shell command.

## 5. Read the result

A passing receipt has `kind=settlementforge_migration_rehearsal`,
`passed=true`, final history 188, nine passed wave receipts, and no integrity
failure. Receipts are mode `0600`, atomically published, and never overwritten.

On a failed wave:

1. stop; never continue manually into the next wave;
2. preserve the clone and command output;
3. diagnose against that wave's migration list and pre/post snapshot;
4. write a new forward-fix migration in the repository;
5. provision a fresh clone from the same production-shaped source and rerun the
   full reviewed train.

Do not repair the rehearsal clone into a pass and treat it as evidence. The
proof target is a reproducible ordered train from the applied production head.

## 6. Production remains a separate attended decision

A clone pass authorizes review of a production migration, not the write itself.
Before production:

- run the full code/edge/build gate;
- retain the backup and restore-drill receipts;
- verify the exact commit is the release candidate;
- follow `docs/DEPLOY.md` for migration/function choreography;
- after deployment, run `docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`.

Never update `supabase/applied-head.json` from the clone result. Update it only
after the production push and live-head verification actually succeed.
