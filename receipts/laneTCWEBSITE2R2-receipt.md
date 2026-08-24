# laneTCWEBSITE2R2 receipt — TC-WEBSITE-2-R2 (chair COMPILE seat, ODQ §471 → draft-WEBSITE-PLAN-2.md)

STARTED 2026-08-23T11:00:11Z

Mode: compile-only. Zero repo writes, zero git mutations, zero test/build runs. Solo (§465 cap).
Tree for re-verification: scratchpad/chair-baseproof-b10ed1a1 (clean, b10ed1a1).

## Edit ledger (filled as each §471.x/F# lands)

## RESUME POINT 2026-08-23T11:28Z
- READ: ODQ §449/§464.2/§470/§471 (verbatim); the skeptic's JSON (9 findings + 14 solid rows); the charter (all 1042 lines); the prior receipt. Pre-edit copy saved: draft-WEBSITE-PLAN-2.pre-R2.md (93520 bytes).
- RE-VERIFIED at b10ed1a1 (clean: `git status --short` = 0 lines), all executed:
  - implementation-packets.mjs:43 TERMINAL = {LANDED, SUPERSEDED}; :543 `reservesChangePaths = !TERMINAL.has(status)`; :561-568 the cross-packet duplicate-path error. DRAFT/READY/BLOCKED/STALE all reserve. F1 CONFIRMED.
  - scripts/.size-baseline.json:7 `"src/App.jsx": 650`; tests/lint/sizeBaseline.test.js:112-127 pins equality BOTH directions; layer ceiling for src-root .jsx = 600 (:69). MEASURED with the test's own eslint helper (in-memory Linter, not a test run): App.jsx = 650 at base; simulated 5→1 toast extraction = 646; + one dep line = 647 (above 600 ⇒ entry stays, ratchets DOWN). F2 CONFIRMED; net-zero is NOT the natural shape — the ratchet-down row is.
  - entitlementLadder.js: 19 rows EXECUTED through the predicate. `free !== cartographer` ⇒ 11 claiming (saves, custom-content, living-realm, map-chains, map-editing, dm-pins, change-view, fog-table, interiors, v2-redraw, export-bundle) / 8 parity (every-size, gallery-viewing, same-engine, map-view, provenance-hover, all-lenses, panorama, surveyor-stages). `free !== true` ⇒ 13 — the two extras are exactly all-lenses + surveyor-stages. F4 CONFIRMED.
  - webhook :359-373 gate + :406 hard 30 re-read; :3293 title = 'THE ALLOWANCE TRAP: a Surveyor invoice mints NO 30-credit allowance + is a surveyor_renewal'. F5 CONFIRMED as read.
  - `grep -rln stripe-webhook tests` = 14; `grep -rln create-checkout tests` = 9 (narrow spellings: 4 / 2). Classified per file (below). moneyPathCoverageContract:42 requires tokens 'Missing signature'(:318) 'Invalid signature'(:329) 'system_grant_credits'(×42) 'does NOT double-grant'(×3) in index.test.ts + >120 lines; moneySecurityExecutionFloor:39 requires 'signature' + ≥3 tests + >400 bytes; contracts:119-125 requires ≥50 `(Deno|scopedEnv).test(` registrations (115 at base). None of those tokens is the :3293 title. F6 CONFIRMED.
  - `grep -rl monthly_allowance supabase/migrations` = 16 files (018 024 057 114 116 131 140 149 151 153 158 161 163 174 178 192). FIFO clause re-minted 12× — ACTIVE body = 192:255 inside `spend_credits` (192:110). Idempotency: unique index idx_credit_ledger_monthly_invoice 018:92-94 (ONE mint, never re-created); credit_grant_idempotency table + backfill 024:8-32 (one mint); BUT the `system_grant_credits` delivery-key arm IS re-minted 024:67 → 116:94 → 158:344 → 163:126 → 178:242 (ACTIVE: 178:196 is the latest `create or replace function public.system_grant_credits`); the webhook's grantCredits calls rpc('system_grant_credits') (index.ts:90). F7 CONFIRMED + refined (three idempotency layers, one of them re-minted).
  - DEPLOY.md:305 `STRIPE_PRICE_FOUNDER_LIFETIME` in the money block (:298 opens it); :407-413 names the SAME env as the worked example of the tolerated documented-but-unconsumed state; `grep -rn FOUNDER_LIFETIME tests` = 0; create-checkout ABOLISHED_PRODUCTS :113; no Deno.env.get of it anywhere in supabase/functions (a header comment :35 + a test fixture :35 only). F9 CONFIRMED; strike is inert to every pin.
  - create-checkout PRICE_MAP :63-79 (active block :65-72, legacy :74-78); .env.example :33-35 (CREDITS_10/50/PREMIUM only); App.jsx toast ternary :256-260; reconcile deps :243-245.
- NEXT: apply the nine edits section by section (header → §0 → §1 → §2 → §3 dep line → §4 → §5 → §9 → §10/§11/§12/§13), then CLAIM_RE + C0 scans.

## EDIT LEDGER — nine §471 items → charter locations (draft-WEBSITE-PLAN-2.md, 1304 lines / 130271 bytes after; 1042 / 93520 before; diff = 603 changed lines; pre-edit copy draft-WEBSITE-PLAN-2.pre-R2.md intact)
| item | applied at | what changed |
|---|---|---|
| Header | :3-10 | "RULED at ODQ §471 (2026-08-23); skeptic-verified at b10ed1a1"; RULED-AS-AMENDED wording; pre-R2 copy named |
| Preamble §403.1 | :47-53 | the sentence made true: the monthly_allowance census (2 → 16) and the reader floors are named as corrected; every other census re-executed |
| F1 STOP (de-dup) | §0 train table :83-88 + new "Shared change paths" paragraph :97-104; §1 contract 5 (dial-aware ACTIVE_CHECKOUT_SKUS + F8 two-way parity arm + .env pre-list), NEW contracts 6 (the stubs: SURVEYOR_PLAN at monthlyCredits 0; ANNUAL_FACTOR = 0 + CARTOGRAPHER_ANNUAL) and 7; §1 non-goals; §1 manifest re-priced (pricing.js ~41, pricing.test.js ~68, DEPLOY.md 1; totals ~76 eff / 7 files / 1 new leaf — cap not approached); §1 A6/A8, M7/M8, interior reds (vii), STOP (name-collision grep = 0), trust boundary; §2 contract 1 (reads the stub), non-goals, manifest (pricing.js + pricing.test.js DROPPED; ~38 eff / 6 files), A1; §3 dependency line + totals (no shared path); §4 contract 3 (the TWO dial flips = the one residue, serial-mint), non-goals, manifest (pricing.js ~2 + pricing.test.js ~8 under serial mint; .env.example DROPPED; ~42 eff / 8 files), A6/A7, M7; §9 "Shared change paths" bullet rewritten as the validator enforces it (:543/:561-568; at most one non-terminal packet per path; de-dup; WEB-10 minted after WEB-8 LANDED; DEPLOY.md/stripe.js/.size-baseline.json serial cases; minting consequence); §11 C7 re-stated; §12 J-R2-1/-3/-5; §13 new reservation-law bullet + doc-writes bullet |
| F2 App.jsx | §0 WEB-9a row; §2 "What exists" NEW bullet (measured 650; sim 646/647; layer ceiling 600); §2 contract 2 (checkoutSuccessMessage) + contract 4 (extraction MANDATORY; −3; ratchet-DOWN); §2 manifest (App.jsx −3; .size-baseline.json row; stripe.js ~24); §2 A1 (the map) + A8 (measured baseline); M3/M4/M5; interior reds; §5 WEB-11 (App.jsx out of its set; same rule if needed); §13 size-baseline bullet; §12 J-R2-2 |
| F3 annual | §0 WEB-10 row ("annual CTA light" STRUCK → "exists server-side and is UNPURCHASABLE until WEB-11"); §0 overflow paragraph (W-D = ONE car, W-C + W-D together); §4 intro paragraph (said plainly); §4 non-goals; §5 heading + topology paragraph; §9 W-D bullet (CHARTERED, one car; telemetry rider NOT in W-D); §11 C6 + C7 |
| F4 rule A | §1 manifest walker row (predicate `row.free !== row.cartographer`; executed sets 11/8 at base; the two `free !== true` extras named; second negative control); §1 A1 (claiming NINE / parity EIGHT over 17 rows at the tip, both printed) + A2; M6 |
| F5 narrowing | §0 WEB-10 row; §4 contract 1 rewritten (four-step resolution; Cartographer row PRESENT-BY-DEFAULT; arm (iv) preserved; the victim named); §4 manifest (webhook ~34; index.test.ts NEW case); A3 three arms; M6; trust boundary; owner to-do #2 reworded BOTH directions |
| F6 reader floor | §4 pin table "Readers" row (14 webhook hits classified 6 source / 3 index.test.ts / 6 name-only; 9 create-checkout hits classified 3+1 / 5; corrected floor 6+3 and 3(+1)); §4 index.test.ts manifest row (tokens preserved by construction, verify at tip); §4 interior reds rewritten; §13 widened sweep gains tests/security; §12 J-R2-8 |
| F7 migrations | §4 intro bullet (16 files printed; FIFO 12 mints, ACTIVE 192:255 in spend_credits 192:110; grant arm 5 mints, ACTIVE 178:242 in system_grant_credits 178:196, called by index.ts:90; once-minted index 018:92-94 + table 024:8-32; conclusion kept); §4 pin table Idempotency + Spend order rows; preamble; §12 J-R2-7 |
| F8 (folded) | §1 contract 5 two-way arm, A6, M7; §4 contract 3, A6/A7, M7 |
| F9 DEPLOY.md | §1 "What exists" NEW paragraph (:298/:305; :407-413 example; 0 test readers; no Deno.env.get); §1 contract 7; §1 manifest row (+1 doc line); interior reds (vi) (52 → 51 documented names by the test's own parser); §13 doc-writes bullet; §12 J-R2-4 |
| Cosmetic | §0 "$1.58" → "$1.57" with the arithmetic |
| Extras | §1 A7+A8 merged (J-R2-5) · §3 A5 three-armed + WEB-10 A8 as a RE-RUN (J-R2-6 — an unlisted shared path the skeptic did not name: WEB-10's first-revision A8 REPLACED 9b's test arm) · §1 census titles +12..+16 · §9 first bullet (C6 ruled; .env pre-list) |

## NOT APPLIED / refinements beyond the literal ruling (each a vetoable J-R2 row in §12)
- F1's "WEB-9a/9b/10 touch none of those paths" is applied for 9a and 9b; for WEB-10 the two dial flips are an irreducible pricing.js touch (the flip must land atomically with the webhook table) — compiled under the ruling's own serial-mint clause (J-R2-1; contract 4.3). A net-zero App.jsx shape (F2's primary) is NOT compiled because the executed simulation shows −3 (J-R2-2).
- F7's "idempotency sites 018:92-94 + 024:26-30 (never re-minted)" refined: those are the once-minted STRUCTURES; the grant-RPC delivery-key ARM is re-minted and active at 178:242 (J-R2-7).
- F9: DEPLOY.md:407-413's example sentence left as written (J-R2-4).
- .env.example pre-lists STRIPE_PRICE_PREMIUM_ANNUAL in WEB-8 so WEB-10 drops that path (J-R2-3); DEPLOY.md is NOT pre-documented the same way.

## SCANS (exact, plain `node -e`; re-run after the last edit)
- CLAIM_RE (tests/docs/enforcement-claims.test.js:40, verbatim): charter 0 hits · receipt 0 hits.
- C0 (controlBytes.test.js:58 isBanned rule): charter 0 banned bytes · receipt 0.
- Tag census: §471.1/F1 ×26 · F2 ×11 · F3 ×8 · F4 ×4 · F5 ×8 · F6 ×4 · F7 ×5 · F8 ×13 · F9 ×7 · J-R2-1..8 all present · header ×1. Stale-phrase sweep: every remaining "split promotion" / "annual CTA" / "$1.58" occurrence is the sentence that STRIKES it.

## MEMORY
- packet-validator-reserves-change-paths.md gains a §471 companion (de-duplicate first; serial-mint the residue; "split promotion" ≠ "exists at DRAFT"); MEMORY.md:41 hook sharpened in place (17007 bytes).

## RESUME POINT 2026-08-23T11:58Z — COMPLETE
- All 9/9 items + extras applied; charter RULED-AS-AMENDED pending the chair's read. Zero repo writes, zero git mutations, zero test/build runs (the two in-memory measurements — eslint Linter over App.jsx and the DEPLOY.md name parser — were read-only node scripts in the clean tree, not vitest). No sub-agent spawned (§465).
