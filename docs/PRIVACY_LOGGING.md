# Privacy & logging policy — IDs, IPs, and fingerprints

This codifies how SettlementForge handles potentially-identifying data in logs,
analytics, and telemetry. It is descriptive of the current implementation and is
locked by regression pins (named below) so it cannot silently drift.

## Principle

Non-personal by construction. Identifiers used for product analytics are
pseudonymous and coarse; raw IP addresses are used only transiently (never
persisted to an analytics row); settlement content (names, prose, secrets) never
leaves the device in any telemetry payload.

## IP addresses — transient only, never persisted

`supabase/functions/_shared/requestMeta.ts` reads the caller IP
(`cf-connecting-ip` → `x-forwarded-for` leftmost → `x-real-ip` → `0.0.0.0`). It
is used for exactly three transient purposes and is **never written to an
analytics/telemetry table**:

1. **Rate-limiting** — as a bucket key (`ip:<addr>`) only when no actor/device id
   is present (`ingest-events`). The key indexes a rate-limit counter; the raw
   address is not retained as analytics data.
2. **Bot rejection** — a single `console.warn` line (`bot rejected ip=… ua=…`)
   in the ephemeral edge-function log sink. Not a durable store.
3. **Coarse geography** — the IP is resolved by the edge platform to a
   **2-letter country code** (`cf-ipcountry` / `x-vercel-ip-country`); only that
   country code is persisted on analytics rows. The address itself is discarded.

There is no `inet` column and no raw-IP column anywhere in the analytics schema
(migrations 036–043). Pinned by `tests/security/ipPrivacy.test.js`.

## Identifiers — pseudonymous

- **Actor / device ids** stitch the funnel (anonymous → signed-up) and are
  random pseudonymous ids, not personal data.
- **Settlement fingerprints** (`src/lib/structuralFingerprint.js`) are
  allowlist-extracted STRUCTURAL hashes — enum/count paths only. Names, NPC
  prose, secrets, history, hooks, and DM notes are provably excluded. This is the
  research-plane grouping key; it carries no settlement content. Pinned by
  `tests/lib/structuralFingerprint.test.js` (a fixture stuffed with sensitive
  strings, every one asserted absent from the output).

## Analytics props — coarse, allowlisted

Event props are coarse (enums, counts, bands) — never names, prose, secrets, or
whole domain objects. Enforced statically by the `analytics/analytics-props-hygiene`
eslint rule and at the ingest boundary by `stripProps` in `ingest-events`.

## What is NEVER logged or transmitted

- Customer email / PII in edge logs (e.g. `stripe-webhook` redaction, A+ P0.2).
- Settlement names / NPC names / prose / secrets / DM notes in any telemetry.
- Raw IP addresses in any persisted row.

## Regression pins (the policy as tests)

| Property | Pin |
|---|---|
| Fingerprint carries no settlement content | `tests/lib/structuralFingerprint.test.js` |
| Raw IP never persisted (no inet/ip column; country is the only geo) | `tests/security/ipPrivacy.test.js` |
| Analytics props stay coarse | `analytics/analytics-props-hygiene` (eslint) |
| Stripe logs carry no customer PII | `tests/edgeFunctions/contracts.test.js` (P0.2) |
