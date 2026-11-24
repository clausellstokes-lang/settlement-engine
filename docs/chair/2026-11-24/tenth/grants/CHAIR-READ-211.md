# THE CHAIR'S OWN READ OF MIGRATION 211 (the tenth chair, 2026-11-24 18:22 UTC; the text at `lane/grants-1-2026-11-24` fe62c9575)

This is the top-tier read the security work owes before a file goes to the owner. It is one read; the fresh security
reader's unit (2) is the other, and neither replaces the other. NOTHING HERE TOUCHED A HOSTED DATABASE: every run is
PGlite on the chair's own machine, with the lane's harness (`tests/security/hostedDefaultHarness.js`), which MODELS the
hosted platform's default grants. The owner's database is the only proof of the owner's database.

## What was read
Parts B, C and D whole (lines 497 to 600) and the file's header; part A (245 revokes, generated) by its header, by its
three "left open" rows, and by the mechanical checks below. The scripts are beside this file in `chair-probe/` with
their outputs. They were run with the working directory at a worktree of fe62c9575.

## What was executed (CONFIRMED)
1. **A user can still save.** On BOTH chains (the lane to 211; the chain as production stands, to 203, then the owner's
   files 3 and 4 as he would paste them), as the role `authenticated`: the pages' plain insert of a settlement and of a
   campaign succeeds; the pages' upsert over a row the server has since counted and featured succeeds and leaves
   `view_count`, `import_count` and `is_featured` as the server set them; an owner column updates; a server column is
   refused on update and on insert. Profiles: `avatar_url`, `email_notifications`, `public_identity_opt_in` update;
   `display_name` written directly, `tier` and `free_narrative_claimed_at` are refused; the RPC `update_display_name`
   works; a user can neither insert nor delete a profile row. (`out-lane-to-211.txt`, `out-live-shape-203-plus-owner-files.txt`)
2. **Part A cuts off no one but visitors and signed-in users.** Of its 245 signatures, on plain Postgres (no hosted
   default) a role holding nothing of its own could run exactly ONE before 211: `_audit_action`. Its 11 callers (last
   definitions) are all SECURITY DEFINER; no policy, trigger or default names it.
3. **No page calls a closed function.** The browser code (`src/`) calls 77 distinct RPC names, on `origin/master` and on
   the lane's tip alike; none is among the 245. No RPC is called by a computed name or by a raw REST path. In
   `supabase/functions`, every receiver of `.rpc('<a closed name>')` is `supabaseAdmin`, `admin`, `adminClient` or
   `deps.adminClient`, or (the 36 calls on a variable named `supabase` or `client`) resolves to a client made with the
   service-role key: `stripe-webhook/index.ts`, `_shared/stripeWebhookLease.ts`, `unsubscribe/index.ts`.
4. **What the live site's pages write directly** (`origin/master`): profiles: `avatar_url`, `public_identity_opt_in`,
   `email_notifications`, `model_preference` (all four are on part C's list), and `display_name` only as the fallback
   after the RPC refuses, which part C now refuses: the user is shown an error instead of the civility guard being
   routed round. Settlements and saved_maps: six write sites (`src/lib/saves.js` three, `src/lib/campaigns.js` one,
   `src/lib/gallery.js` two); no payload names a server column (searched by key on both trees).
5. **No server writer is narrowed.** The last definitions of all 34 functions that write settlements or saved_maps, and
   of all 30 that write profiles, are SECURITY DEFINER (they run as their owner, whom the guard and the column grants
   let through). No trigger that fires before the guard sets a server column on the new row.
6. **The same class of hole on tables and views: none found** (the chain to 203, modelled hosted defaults): no table
   of schema public with row level security off; no view a visitor or user may select; no policy whose check is
   literally true; 48 tables have row level security on and no policy at all (closed to both roles), among them
   `surveyor_byok_keys`, `security_answers` and `redeem_codes`. (`out-tables-203.txt`)

## What was only read (PLAUSIBLE)
- Part B's effect on the hosted platform. `alter default privileges in schema public revoke execute on functions from
  anon, authenticated` changes the defaults of the role that runs it. Whether that is the role whose defaults name the
  two roles on the owner's project is shown only by his own read of the defaults before and after (file `0b`).
- Part C's revoke on the hosted platform removes what the revoking role granted. If the table's grants there were made
  by another role, the read after shows it: hence ask 2.

## Found, and asked of the lane (before its hand-in)
1. **The column test has no positive control for insert.** Its arm "a row an owner inserts cannot carry a SERVER
   value" passes just the same if the guard refuses EVERY insert (a hard-coded default that drifts from the column's
   own; a listed column a later migration drops). The worst failure of part D, no user can save, had no test. Asked: a
   plain insert and the pages' upsert, as `authenticated`, on both tables, must succeed. (The probe shows they do today.)
2. **The owner's files read back only part A.** Asked: a read after for parts C, D and B, one result a file.
3. **A rule for pages, to be written down:** an insert or upsert payload never names a server column, even at its
   current value (an upsert repeating `view_count` 57 is refused: the insert half of an upsert is checked against the
   column's default). No page does so today.

## Not judged here
The three functions left open by name and the three named for the reader and not built (`has_role`,
`account_is_active`, `profile_has_premium_access`): the reader's. Whether `is_public`, `public_slug`, `published_at`,
`unlisted_slug` and `visibility` should stay the owner's to write directly (part D leaves them out by ruling G1): a
later ruling, on the lane's hand-back.

## ADDED 18:41 UTC: THE ORDER, AND THE READER'S VERDICT
**Does it matter whether the owner pastes his files before the deploy's migrations?** NO (CONFIRMED in PGlite, the
lane's harness, at 72b6e0ae2; `chair-probe/chair-order.mjs`, `out-order-owner-first-vs-tested.txt`). Two orders were
replayed under the modelled hosted defaults: THE TESTED ORDER (001 to 210, then 211, part B last) and THE OWNER-FIRST
ORDER (001 to 203, then the owner's files 1, 2, 3 and 4 by hand, so that part B is already in force, THEN 204 to 211
as the deploy's push would apply them). 405 functions in each; NOT ONE differs in what a visitor, a signed-in user or
the server may run; four profile columns and two guard triggers in both; no statement of 204 to 211 failed. So no
function that 204 to 210 create leans on the hosted default grant for a path a page needs.

**The fresh security reader's unit (2)** (REVIEW-GRANTS-1, on 39bfb0831e, by its own catalog queries and greps):
PART A CLEAR, PART B CLEAR, PART C CLEAR, PART D CLEAR (each CONFIRMED on 203 and on 210). THE OWNER'S FILES "NOT
CLEAR, FOR VISIBILITY ONLY": files 1 to 4 equal the migration exactly, but nothing read back parts C and D, and part
B's read is filtered to schema public (a global default grant would be hidden; part B run under another role does
nothing without a word). Its other findings: part A's header calls `operator_message_class_for_template` "left open"
though it is closed to both roles before and after (a comment); `scripts/ops/migrationRehearsalCore.mjs` still calls
211 "grants only" and its expected objects omit the guard function and the two triggers. ALL SENT TO THE LANE as its
last four items, with a standing check the owner can run after every deploy (every function a visitor or a signed-in
user can execute that the register does not class as theirs: expect no row).

**Decided by the chair, vetoable:** THE TWO ORACLES THE READER NAMES ARE NOT CLOSED IN 211. `has_role` and
`profile_has_premium_access` tell anyone who holds an account's id whether that account is staff or premium (the
second has no caller at all; `account_is_active` must stay, twelve policies use it). **Why not now:** part A is
generated from the register and cleared; re-classing two functions re-opens the cleared text for a fault that leaks
one yes or no about an id the visitor must already hold. **Where it goes:** the first unit after the first deploy's
security work ("G2: close the two oracles to visitors"), named in the owner's page as the residual risk in plain
words. **What would change it:** a page that shows account ids to visitors (then the oracle names the staff): the
share veil's measure will say whether one does.
