# Load-Test Runbook

How to load-test SettlementForge's expensive edge functions (the AI endpoints and
checkout) before a launch or a capacity change. The tooling is
`scripts/load-test.mjs`; this runbook is how and when to run it, and the rules
that keep it from ever hitting production.

> **Ownership.** Running load is on the **owner's attended checklist** `[OWNER]`.
> The harness ships **written-not-run**: with no target it prints a plan and sends
> nothing. Aiming and firing it is a deliberate, attended act against a target you
> control.

---

## The one rule that matters

**Never run load against a live endpoint.** The harness enforces this in code so a
mistake cannot cost you:

1. **No `--target` sends nothing.** The default is a printed plan, zero requests.
2. **Plan unless `--execute`.** Even with a target, it only prints the plan until
   you add `--execute`. A pasted URL never fires by itself.
3. **Production is hard-refused, no override.** Any target on `settlementforge.com`
   or a Supabase-hosted project (`*.supabase.co`) is refused outright. Point it at
   **localhost** (`supabase start` / `supabase functions serve`) or a **throwaway
   staging deploy** you can safely hammer.

## What it measures (and what it does not)

It measures how the **edge and the rate limiters** behave under concurrency: request
latency percentiles (p50 / p95 / p99) and the status-code mix. It sends
**unauthenticated** requests, so the AI functions reject them at the auth / rate-limit
gate **before any provider call**. That means:

- It **never spends AI provider budget** and **never creates a real checkout**.
- The health signals are **gate latency** and **rate-limit behaviour** under load,
  not AI output quality or correctness.
- A response that is NOT rejected at the gate (a `200` where a `401`/`429` was
  expected) is surfaced as `gateHealthy: false` — investigate before trusting the run,
  because it means an unauthenticated request reached real work.

To load-test the authenticated hot path (real spend, real credits) you would supply a
staging service token and a staging Stripe test mode by hand. That is a separate,
deliberate exercise; this harness deliberately stops at the gate.

## Running it

```bash
# 1. Plan only — always safe, sends nothing. Review the endpoints it would hit.
node scripts/load-test.mjs

# 2. Bring up local edge functions in another terminal (owner machine).
supabase start
supabase functions serve

# 3. Plan against the local target (still sends nothing without --execute).
node scripts/load-test.mjs --target http://localhost:54321

# 4. Execute against LOCAL / STAGING only.
node scripts/load-test.mjs \
  --target http://localhost:54321 \
  --execute \
  --concurrency 10 \
  --requests 300 \
  --timeout-ms 10000
```

| Flag | Default | Meaning |
|---|---|---|
| `--target <url>` | none | Base URL. No target ⇒ plan only. Prod hosts refused. |
| `--execute` | off | Actually send requests. Off ⇒ plan only. |
| `--concurrency <n>` | 5 | Requests in flight at once. |
| `--requests <n>` | 50 | Total requests, round-robin over the scenarios. |
| `--timeout-ms <n>` | 10000 | Per-request abort timeout. |

## Reading the output

```json
{
  "count": 300, "ok": 300, "errors": 0,
  "byStatus": { "401": 225, "429": 75 },
  "p50": 34, "p95": 120, "p99": 210,
  "gateHealthy": true
}
```

- **`byStatus`** — the mix of gate responses. A rising share of `429` under load is
  the rate limiter doing its job; `5xx` is the edge buckling and is the signal to
  scale or add a queue.
- **`p95` / `p99`** — gate latency under concurrency. Watch the tail, not the median.
- **`gateHealthy: false`** — a request slipped past auth/rate-limit. Stop and
  investigate; do not read the latency numbers as trustworthy.
- **`errors`** — client-side timeouts/aborts (the target could not keep up within
  `--timeout-ms`).

## Recording the run

Log the date, the target (local/staging), the concurrency/requests, and the
p95/p99 + status mix alongside the other launch-ops checks, so "the edge held N
concurrent at p95 X ms" is a recorded fact rather than a memory.

## See also
- `scripts/load-test.mjs` — the harness (safety law in its header).
- `docs/PERIMETER_RUNBOOK.md` — the rate limits the AI/checkout functions ship with.
- `docs/ops/DEPLOY_ROLLBACK_RUNBOOK.md` — what a deploy is and how to roll it back.
