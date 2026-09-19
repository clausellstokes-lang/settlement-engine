---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-19
  type: milestone
  branch: claude/wave-e-launch-ops
  base: aad6265e
  tip: f61f80a9
  folded: false
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T15:13:25.684Z
---

# WAVE E — LAUNCH OPS shipped (NOT folded)

⭐ Five operational launch gaps, on `claude/wave-e-launch-ops` (base aad6265e, tip f61f80a9,
9 lettered commits WE-a…WE-h + WE-a2). **Dark / additive — not merged.**

## Why this matters (the big finding)
The wave brief was **heavily stale**: ~70% of "the five gaps" were ALREADY BUILT. Trusting the
repo over the brief (as instructed) collapsed the work to gap-fills. What already existed:
`src/lib/errorReporter.js` (client hook), `log-client-error` fn + `client_error_events` table
(migration 081) = the "report-error function + error_reports table" the brief wanted NEW;
`send-email` fn (inert-without-keys, dual-map template registry, `credit_low` low-balance template
already defined but unwired); `scripts/generate-sitemap.mjs` (prebuild-wired, CI-gated);
`index.html` og/twitter meta (og:image = house-sealed `og-craft.png`); a per-route title manager
(`seo.js` applyDocumentHead) + `/api/gallery-meta` slug prerender; refund/cancellation policy
(`TermsPage` §Refunds, `/refunds` route, DRAFT banner); `docs/DEPLOY.md` + `docs/RUNBOOK_BACKUP_RESTORE.md`.

## What was actually built (the genuine gaps)
- **WE-a/WE-a2** client error dedup + 25/session sampling cap in errorReporter.js (signature =
  `kind|message|first-stack-frame` string as the dedup Set key; no hash needed).
- **WE-b** migration **156** = two service-role SECURITY DEFINER reads over client_error_events
  (`report_client_errors` grouped-by-normalized-signature, `report_client_error_alert` last-hour
  threshold=8/hr) + admin-actions `get_client_error_dashboard` case + AdminClientErrorsPanel + always-visible alert banner. Migration WRITTEN-NOT-DEPLOYED.
- **WE-c** NEW `health` edge function (anon liveness + `?deep=1` DB probe) + `scripts/ops/uptime-probe.mjs` + config.toml `[functions.health]`.
- **WE-d** NEW `_shared/mailAdapter.ts` provider-neutral adapter (Resend default + Postmark, env-selected via EMAIL_PROVIDER, inert without keys) + `ops_error_alert` template (both maps, authenticated-only).
- **WE-e** og:image JS defaults `og-default.png`→`og-craft.png` (seo.js + api/_galleryMeta.js) + honest SSR comment.
- **WE-f** PurchaseModal point-of-purchase legal links (Terms·Refunds·Privacy, additive).
- **WE-g** `docs/ops/` DEPLOY_ROLLBACK + DATA_BACKUP + PRODUCTION_EMAIL runbooks.
- **WE-h** design-ratchet + verify_jwt fixes for the admin errors view (see hazards).

## Cross-lane flags (for the manager at fold)
- **config.toml** `[functions.health]` — additive; perimeter lane may also touch config.toml.
- Additive edits to EXISTING edge functions: **admin-actions** (new case), **send-email** (adapter
  wiring + ops_error_alert template) — both flagged; perimeter lane owns "existing edge functions".
- **ARCHITECTURE.md / DEPLOY.md / abuse-model.md** function counts bumped 25→26 for `health` +
  migration count 155→156 (all machine-checked by docCounts/deployRunbookFreshness/abuseModelFreshness).
  ⚠ If the perimeter lane ALSO adds a function, the final count must be reconciled at fold (the tests will catch it).
- **DEFERRED**: `og-image/index.ts` error-fallback redirect still targets og-default.png (perimeter-owned edge fn, low-impact); the proactive cron→email alert (needs anon-template surface = perimeter/owner-gated) — the always-on admin banner is the shipped alert.

## Hazards / gotchas (reusable)
- ⚠️ **First-paint budget red is PRE-EXISTING, not mine.** verify:dist first-paint static-closure is
  ~996 B over the 1,040,000 budget ON THE BASE (proved by reverting my eager files → 1,040,996).
  My whole-wave net eager delta is **+18 bytes** (the footer `Refunds` key); errorReporter's dedup is
  absorbed to ~0 in the built index chunk. The sibling 41KB de-eager reclaim covers it.
- ⚠️ **[commit-message-backtick-hazard]** — backticks inside a double-quoted `git commit -m "..."`
  are shell command-substituted ("command not found: health"), silently mangling the message. Use
  `git commit -F <file>` or a heredoc for any message containing backticks.
- ⚠️ **[pglite-hook-timeout-under-load]** — under heavy machine load (parallel lanes), ALL
  `tests/security/*.pglite.test.js` fail at their `beforeAll` PGlite cold-start (default 10s hook
  timeout). The flake count SCALES WITH LOAD (3→11 across two runs) and every failure is at the
  setup line. They PASS in isolation. Give new pglite tests an explicit `beforeAll(fn, 60000)` (my
  clientErrorReports.pglite.test.js did, so it survived). Triage timeout-shaped pglite reds with
  isolation re-runs, never a raw failing-set diff.
- ⚠️ **Two design ratchets collide for a NEW admin Section.** AdminPanel's local `<Section>` carries
  the counted `borderRadius:R.xl` frame, so you MUST reuse it (inlining a copy re-trips deepCraft
  borderRadius), but `<Section title=>` adds a `title=` to the shrink-only guidance-walker census (485,
  `<=`). Resolution: fold the new panel INTO an existing Section (rename the title string, no new
  title=) + give the panel its own `<h3>`. Also: kill-list `tintedCallouts` matches `dangerBg` /
  `*_BG` — use a left-rule plate, not a `swatch.dangerBg` wash. deepCraftKillList is tolerance-0 (count === ceiling); DO NOT edit that test.

## Verification (2026-07-19, machine under parallel load)
Fast gates (validate:data/migration-head/edge/map, domain:strict, lint) + full typecheck + build =
GREEN. Full suite: only reds are the **4 parked golden families** (beliefMapGolden,
generatorGoldenMaster, worldpulseDeityGolden, pdf goldenViewModel — my diff touches none of that
code) + load-flaky pglite/store tests (pass in isolation) + the pre-existing first-paint budget red.
Every surface I touched passes. New pins: errorReporter dedup/cap, clientErrorReports.pglite (RPC
grouping/threshold), health deno (6), mailAdapter deno (6), ops_error_alert template parity.
