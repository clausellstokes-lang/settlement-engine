# GRANTS-1 — hand-back

## WHERE THE LANE STANDS (2026-11-24 17:25 UTC)

- Branch `lane/grants-1-2026-11-24` at `dc4bf5775` (pushed): migration `supabase/migrations/211_close_visitor_reach.sql` holds PART A (245 functions; generated), PART C (profiles allowed list) and PART B (last). Tests: `tests/security/hostedDefaultGrants.pglite.test.js` with its register `functionGrantClasses.js` and harness `hostedDefaultHarness.js`; `tests/security/profileColumnGrants.pglite.test.js`; the client change in `src/lib/auth.js :: supabaseUpdateDisplayName`, pinned by `tests/security/profile_escalation.test.js`.
- MERGED on the lane: A, B, and C (C built by a builder on `lane/grants-1-2026-11-24-c-wip`, tip `bc4247e9d`, local only; cherry-picked).
- IN FLIGHT: PART D, a builder on `lane/grants-1-2026-11-24-d-wip` from `dc4bf5775`, briefed by `briefs/BRIEF-PART-D.md` (plus the corrections in its prompt: compose with every part in place; mutex retry with GATE_MUTEX_MAX_POLLS=240).
- WITH THE OWNER: `FOR-THE-OWNER-URGENT.sql` (105 functions; cleared by the reader "CLEAR 0ea91fe18").
- READY TO FINISH: `measure/owner-files.mjs` generates `FOR-THE-OWNER-GRANTS/` (one file per result, guarded, executed twice on the 203 and 210 chains). The page in plain words is still owed.
- NEXT, in one line: read D's diff once, merge it, regenerate the owner's files and write their page, then run tests/security and tests/lint whole, then send "GRANTS <commit>".

## Rulings in force

1. RULING-G1 (chair branch `docs/chair/2026-11-24/tenth/grants/RULING-G1.md`): one migration, number 211, parts A–D; tests per §6; the owner's plain file per §7; §8 listed, not built; order A, B, C, D, with one line to the chair after each.
2. G1a: part A is the generated block whole (all SERVER and NOBODY functions except the two invoker helpers), under the three checks, plus `_audit_action` revoked from public, anon and authenticated.
3. G1b: part B is the schema-level revoke from anon and authenticated only. Show the convention case. The global form is REFUSED.
4. G1c: `has_role`, `account_is_active` and `profile_has_premium_access` are listed for the reader, not built.
5. G1d: in the owner's full file, every revoke line is guarded as in URGENT.
6. URGENT first: groups 1 and 2, guarded, with a read check before and after; each function must pass checks (a), (b) and (c).
7. The chair's 16:03 read: the mark is 700,000; HAND OVER by 620,000 at a part's boundary; C and D are each built by one builder.
8. The reader's notes for the full file (F1-F4): give the figures the check shows; one file per result; service_role shown; _audit_action listed with its definer callers.
