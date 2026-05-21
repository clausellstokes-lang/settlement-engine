# Refund + Credit-Touching Path Audit — Tier 9.9

Once the ledger-consistent RPCs (`spend_credits`, `refund_credits`,
`admin_grant_credits`) landed in migration 009, every credit-touching
path needed to migrate off `update profiles set credits = ...` writes
to those RPCs. This document is the catalogue + the migration status.

## Why this matters

Direct writes to `profiles.credits` are racy under concurrent
transactions (a credit-spend that interleaves with a Stripe webhook
can lose the purchase) and they bypass the `credit_ledger`
append-only audit trail. Both problems disappear when every change
goes through the RPCs:

- `spend_credits(feature)` — atomic decrement, ledger insert, returns
  new balance.
- `refund_credits(spend_row_id, reason)` — writes a *new* `grant` row
  with `reversed_by` pointing at the original spend. Never resets
  `credits` to an old value.
- `admin_grant_credits(target, amount, reason)` — privileged write,
  ledger insert, audit log.

## Inventory: every credit-touching path

### Edge functions

| Path | File / Line | Direction | Current implementation | Ledger-consistent? |
|------|-------------|-----------|------------------------|-------------------|
| Stripe webhook credit pack delivery | `supabase/functions/stripe-webhook/index.ts:85` | + grant | `update({ credits: (profile.credits || 0) + amount })` | ❌ Direct write |
| Stripe webhook single-dossier metadata | `supabase/functions/stripe-webhook/index.ts:~142` | (metadata only) | n/a | ✅ N/A — no credit change |
| Admin: update_user_credits | `supabase/functions/admin-actions/index.ts:132` | ± set | `update({ credits: parseInt(...) })` | ❌ Direct write |
| AI narrative spend (initial) | `supabase/functions/generate-narrative/index.ts:1589` | – spend | `update({ credits: currentCredits - cost })` | ❌ Direct write |
| AI narrative refund (failure) | `supabase/functions/generate-narrative/index.ts:1650` | + refund | `rpc('refund_credits', { spend_ledger_row, refund_reason })` | ✅ Uses RPC (preferred path) |
| AI narrative refund fallback | `supabase/functions/generate-narrative/index.ts:1667` | + refund | `update({ credits: currentCredits })` | ❌ Fallback only — kept "so refunds still happen if the RPC errors" |

### RPCs (the canonical paths)

| RPC | Migration | What it does |
|-----|-----------|--------------|
| `spend_credits(feature text)` | 009 line 193 | Atomic decrement guarded by `credits >= cost`. Writes a `kind='spend'` row to `credit_ledger`. Returns new balance + spend_ledger_row id. |
| `refund_credits(spend_ledger_row uuid, refund_reason text)` | 009 line 284 | Writes a NEW `kind='grant'` row with `source='refund'` and `reversed_by` pointing at the spend row. Never overwrites the live balance with a stale value. |
| `admin_grant_credits(target_user uuid, amount integer, reason text)` | 009 line 369 | Privileged write. Inserts into `credit_ledger` + legacy `credit_transactions`, bumps `profiles.credits`, writes admin audit log. |

## Risk assessment per path

| Path | Race condition risk | Audit gap | Migration urgency |
|------|---------------------|-----------|-------------------|
| Stripe webhook credit pack | **Medium** — webhook + concurrent spend can interleave | High — purchase has no ledger row, only a counter bump | **High** |
| Admin update_user_credits | Low — single admin actor expected | Medium — admin sets but no per-grant context | Medium |
| AI narrative spend (initial) | **High** — credit-spend on every narrative pass; race with concurrent passes | High — spend lives in `credit_transactions` only, no `credit_ledger` row → no refund correlation | **High** |
| AI narrative refund (RPC path) | Low — RPC is atomic | None | ✅ Done |
| AI narrative refund (fallback) | Medium — race with concurrent spend | Medium — no ledger row, only counter restore | Low — fires only if RPC errored, which is rare |

## Migration plan

Each path migrates independently. None of them is being touched in
this audit commit — the audit is the deliverable. The migrations
land in their own commits with their own tests so a single rollback
maps cleanly to a single regression.

### 1. Stripe webhook → `admin_grant_credits`

Replace the direct write in `stripe-webhook/index.ts:85` with:

```ts
const { error } = await supabaseAdmin.rpc('admin_grant_credits', {
  target_user: user_id,
  amount,
  reason: `stripe_purchase:${session.id}`,
});
```

The `admin_grant_credits` RPC checks `current_user_is_privileged()`,
so the webhook must call with the service-role JWT (it already does).
Audit row carries the Stripe session ID for traceability.

Risk to monitor: `admin_grant_credits` is currently rate-limited to
10,000 credits per call. The largest pack is 150 credits, so this is
fine for purchases — but if we ever ship a "bulk grant" pack >10k,
we'd need to revisit the cap.

### 2. Admin update_user_credits → `admin_grant_credits`

The `update_user_credits` admin action currently does a SET. The
roadmap pattern is to make this an INCREMENT (positive or negative)
via `admin_grant_credits` for grants and a TBD `admin_revoke_credits`
RPC for revocations. Until the revoke RPC exists, the admin UI
should call `admin_grant_credits` for positive deltas only.

This is lower priority than #1 because admins are a tiny, trusted
caller cohort and bad audit data here is less catastrophic than at
purchase time.

### 3. AI narrative spend → `spend_credits`

Replace the direct decrement in `generate-narrative/index.ts:1589`:

```ts
const { data: spendId, error } = await supabaseUser.rpc('spend_credits', {
  feature: 'narrative',  // or 'dailyLife' / 'progression'
});
if (error) {
  // 402 — insufficient credits, etc.
  return new Response(JSON.stringify({ error: error.message }), { status: 402, ... });
}
// spendId is the credit_ledger row id; pass it to the refund path on failure.
```

This couples the spend more tightly to the refund flow — the
refund_credits RPC at line 1650 already takes a `spend_ledger_row`
argument, so the migration here also closes the loop: the spend
returns the row id, the refund uses that row id, and the ledger
correlates spend ↔ refund automatically via `reversed_by`.

Implementation note: the streaming generator captures `spend_id`
already (line 1556 comment); the migration is mechanical.

### 4. Drop the AI narrative refund fallback (line 1667)

Once #3 lands, the fallback at line 1667 becomes dead code. The
refund RPC is the only path; if it errors we surface the failure
loudly (the user got the result but the refund failed → support
ticket), rather than silently restoring credits via a racy direct
write. Remove the fallback in the same commit.

## Tests

`tests/security/refundLedger.contract.test.js` (new) — pgTAP-style
assertion that the three RPCs exist with the expected signatures.
Cheap pin against schema drift. Real concurrency tests live in the
`tests/security/` server-side runner (already in place from Tier 0.6).

## How to extend

When a new credit-touching path lands:
1. Add a row to the inventory table above.
2. Use an existing RPC where possible. If the operation doesn't fit
   `spend_credits` / `refund_credits` / `admin_grant_credits`, write
   a new SECURITY DEFINER RPC in a new migration — never write
   directly to `profiles.credits` from the client or an edge
   function.
3. The RPC must:
   - Either INSERT into `credit_ledger` (preferred), or write to
     `credit_transactions` (legacy audit) and bump `profiles.credits`
     atomically.
   - Call `_audit_action()` if the actor is privileged.
4. Add a contract test that the new RPC exists with the expected
   signature.
