# GRANTS-1 — hand-back

## WHERE THE LANE STANDS (2026-11-24 18:12 UTC)

- DONE. Branch `lane/grants-1-2026-11-24` (pushed) holds migration `supabase/migrations/211_close_visitor_reach.sql`, parts A, C, D and then B (B last), merged with the line `f03e9a868` (point 113). Nothing was applied anywhere.
- How each part landed:
  - A and B: built by the seat.
  - C: a builder on `lane/grants-1-2026-11-24-c-wip` (tip `bc4247e9d`, local only), cherry-picked, plus one docblock commit by the seat.
  - D: a builder on `lane/grants-1-2026-11-24-d-wip` (tip `34077ead2`, local only), cherry-picked without its census commit; the census was re-taken once after the line merge.
- Tests:
  - `tests/security/hostedDefaultGrants.pglite.test.js` (16; register `functionGrantClasses.js`, 405 functions; harness `hostedDefaultHarness.js`)
  - `profileColumnGrants.pglite.test.js` (6)
  - `serverOwnedColumns.pglite.test.js` (12)
  - `profile_escalation.test.js` (3; the client change in `src/lib/auth.js :: supabaseUpdateDisplayName`)
  - Each was seen RED before its part and GREEN after; the logs are in `measure/out/part*-red.log` and `part*-green.log`.
- FINAL RUN on the merged tree, `tests/security` + `tests/lint` whole (`measure/out/final-security-lint.log`): 382 files, 5366 passed, 3 failed, 1 skipped. All 3 reds are RED-AT-LINE rows: proseComposed A0b, and proseCorpusBytes RAW and GZIP.
- For the owner:
  - `FOR-THE-OWNER-URGENT.sql`: groups 1 and 2, cleared by the reader, already given to him.
  - `FOR-THE-OWNER-GRANTS/`: files 0a–5, every revoke guarded, executed twice in PGlite on the 203 and 210 chains: 134 open, then 0; service_role unchanged.
  - `FOR-THE-OWNER-GRANTS.md`: the page in plain words; files 3 and 4 are shown compatible with master's client, except the display_name fallback after an RPC error.
- PART D's standing rule (the chair's ask 3): a page's insert or upsert payload never names a server column of settlements or saved_maps, even at its current value (an upsert repeating view_count is refused). No page does, on origin/master or on this lane.
- The 211 rehearsal wave expects `_surveyor_byok_secret` and `_guard_server_owned_columns`; the rehearsal's presence query knows tables and functions only, so part D's two triggers are represented by their function (read 6b shows them to the owner).
- The owner's standing check `FOR-THE-OWNER-GRANTS/7-standing-check.sql` is generated from the register: regenerate it (`measure/owner-files.mjs`) whenever `tests/security/functionGrantClasses.js` changes.
- For the reader: `GRANTS-1-APART.md` (ruling §8, G1c, part D's excluded columns).
- NEXT, in one line: the fresh security reader reads 211's final text; nothing reaches the working line or any database before its word and the owner's hand.

## Rulings in force

1. RULING-G1 (chair branch `docs/chair/2026-11-24/tenth/grants/RULING-G1.md`): one migration, number 211, parts A–D; tests per §6; the owner's plain file per §7; §8 listed, not built; order A, B, C, D, with one line to the chair after each.
2. G1a: part A is the generated block whole (all SERVER and NOBODY functions except the two invoker helpers), under the three checks, plus `_audit_action` revoked from public, anon and authenticated.
3. G1b: part B is the schema-level revoke from anon and authenticated only. Show the convention case. The global form is REFUSED.
4. G1c: `has_role`, `account_is_active` and `profile_has_premium_access` are listed for the reader, not built.
5. G1d: in the owner's full file, every revoke line is guarded as in URGENT.
6. URGENT first: groups 1 and 2, guarded, with a read check before and after; each function must pass checks (a), (b) and (c).
7. The chair's 16:03 read: the mark is 700,000; HAND OVER by 620,000 at a part's boundary; C and D are each built by one builder.
8. The reader's notes for the full file (F1-F4): give the figures the check shows; one file per result; service_role shown; _audit_action listed with its definer callers.
