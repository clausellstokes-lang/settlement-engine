# Service objectives and release evidence

**Status:** launch policy targets; not a claim of current production performance  
**Owner:** designated release operator  
**Review cadence:** before each production release and monthly after launch

These objectives define what SettlementForge must measure and how an operator reacts.
An objective becomes an achieved service level only when production telemetry covers
the full window.

The CI browser gate (`npm run test:e2e:performance`) serves the minified build and
retains a build-fingerprinted synthetic receipt. It is an anti-regression signal,
not evidence that the field p75 objective below has been achieved.

The realm-scale receipt separately runs the production advance-worker module in
an actual Node `worker_threads` isolate and records its cold round trip and
in-isolate handler duration. That proves isolated execution and output parity on
the measured host; it does not measure the browser Web Worker implementation or
replace field-device evidence.

## User-facing objectives

| Service | Launch objective | Evidence |
|---|---:|---|
| Public application availability | 99.9% per calendar month | External HTTPS probe from at least two regions |
| Saved-world read availability | 99.9% per calendar month | Authenticated synthetic read, excluding customer data |
| Durable command integrity | 100% of accepted commands finalize or remain visibly reconcilable; zero silent loss | Command journal phase/receipt reconciliation |
| Browser experience | p75 LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on supported mobile and desktop | Field telemetry, split by route/device/network band |
| Obligation visibility | Critical refund, deletion, webhook, or unresolved application-command work alerts within 5 minutes of threshold breach | Scheduled obligation probe plus alert-delivery receipt |

Planned maintenance is reported separately but is not erased from the user-visible
availability record. A dependency incident may explain an error-budget burn; it does
not make the outage disappear.

## Recovery objectives

The minimum launch targets are:

- **RPO:** no more than 24 hours of durable customer state.
- **RTO:** restore core read/write service within 4 hours.
- **Release rollback decision:** within 15 minutes of a confirmed release-caused
  severity-one incident.
- **Rollback execution:** within 30 minutes when the previous application and
  database shape are backward compatible.

After point-in-time recovery and its restore drill are verified, the target becomes
RPO ≤ 15 minutes and RTO ≤ 2 hours. The stronger numbers must not be advertised from
provider configuration alone; a timed restore receipt is required.

## Obligation thresholds

| Queue | Warning | Critical | Immediate operator action |
|---|---:|---:|---|
| Payment refund | age ≥ 15 min or repeated retry | age ≥ 60 min, manual action, or terminal failure | Inspect provider state, retry through the owning recovery path, never issue an unjournaled duplicate refund |
| Account deletion cleanup | age ≥ 1 h or retry/lease anomaly | age ≥ 24 h or high attempts | Inspect external-object blockers; preserve the deletion fence while recovery runs |
| Stripe webhook | unprocessed age ≥ 15 min or lease/retry anomaly | unprocessed age ≥ 60 min | Verify signature/event ownership and reclaim only through the leased worker contract |

Acknowledgement records operator attention. It does not resolve, hide, retry, or
cancel work.

Age begins when the durable obligation is created, or at a webhook's immutable
first claim. It does not restart when a retry is scheduled, a failed webhook is
released, or a lease is renewed, so backoff and recovery cannot suppress a breach.

## Private-monitor deployment contract

The repository provides the fail-closed probe and its pure policy tests; it does
not contain or prove a production scheduler, paging destination, or secret
installation. Until an operator configures the following contract and retains a
successful alert-delivery drill, the five-minute obligation-visibility objective
remains unachieved:

The selected paging destination is `ops@settlementforge.com` through an external
monitoring provider. Selection is not delivery evidence; the mailbox, provider
route, and drill receipt must still exist.

- run `npm run ops:obligations -- --max-severity=healthy --json` from a private,
  secret-bearing monitor at least every four minutes;
- provide only the production `SUPABASE_URL` and
  `SUPABASE_SERVICE_ROLE_KEY`; never expose the service-role key to a browser,
  public build job, or receipt;
- page on exit 1 (observed warning/critical work) and exit 2 (missing,
  malformed, timed-out, or otherwise untrustworthy evidence);
- cap the monitor attempt at 10 seconds, avoid overlapping attempts, and alert
  if the scheduler itself misses two consecutive expected starts;
- retain a scrubbed record containing schedule time, completion time, exit
  class, combined severity when available, notification destination identifier,
  and notification-provider delivery acknowledgement.

The probe calls both migration-182 external-obligation health and migration-184
application-command health. A healthy response from one cannot hide an absent
or unhealthy response from the other. Repository CI tests that composition; CI
does not substitute for the private production schedule or an alert-delivery
receipt.

## Incident levels

- **SEV-1:** customer-state loss/cross-owner exposure, incorrect financial mutation,
  broad inability to read saved worlds, or a security boundary failure. Freeze
  releases, preserve evidence, page the operator immediately.
- **SEV-2:** material workflow unavailable, persistent obligation backlog, or severe
  performance regression with a working fallback. Stop releases and investigate
  during the active operating window.
- **SEV-3:** isolated degradation with no state/trust risk. Triage into the next
  maintenance window and watch for escalation.

## Release evidence bundle

Before a public release, retain:

- Git commit and dependency lock hash;
- complete code, Deno, build, and distribution gate receipts;
- migration plan, clone-rehearsal result, and applied-head comparison;
- backup checksum/manifest and timed restore verification;
- realm-scale release receipt;
- desktop and lower-end mobile browser measurements;
- CSP/map-origin post-deploy result;
- authenticated save/read/delete canary using synthetic data;
- combined obligation/application-command health snapshot;
- private-monitor cadence configuration and alert-delivery drill receipt;
- rollback target and compatibility decision.

No receipt may contain access tokens, database passwords, customer text, raw email,
or full customer identifiers.

## Error-budget response

At 50% monthly burn, pause discretionary releases and identify the leading failure
class. At 100%, only reliability, security, or incident-recovery changes ship until
the service is back inside its objective. A launch objective may be revised only
with an explicit product decision and a documented reason—not because the current
implementation missed it.
