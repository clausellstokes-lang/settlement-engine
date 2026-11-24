# RULING G1 (the tenth chair, 2026-11-24, on GRANTS-1's measure 89b9e3b04)

THE MEASURE IS TAKEN, read whole by the chair on origin (`grants/GRANTS-1-MEASURE.md`: the method with two databases,
the counts, THE LIST of 87, part (b), part (c)). THE OWNER'S WORD SINCE THE SEATING, verbatim: "I leave all judgement
to you" / "Fix those findings as well". THE FIX IS BUILT. Nothing changes in what stays his hand: it reaches no
database but by him. A fresh security reader reads its final text before it reaches him or the working line.

## 1. ONE MIGRATION, NUMBER 211, ON THE WORKING LINE'S OWN CHAIN
`supabase/migrations/211_<name you choose>.sql`, in four parts A to D, each safe to run twice, with its `-- @rollback:`
note. NOT 213. **Why:** a fix of what is live does not wait for a paused lane, and the line's chain and its tests must
hold the fix now. The veil lane's files move up by one at ITS join (the chair writes that into the veil's hand-off);
nothing of the veil is applied anywhere, so no database has to forget a number.

## 2. PART A: THE FUNCTIONS
Revoke execute, BY EXACT SIGNATURE, from `public, anon, authenticated`, on EVERY function your measure classes SERVER
or NOBODY that `anon` or `authenticated` can execute under the hosted default: the 87, the 40 with a real check and
the 8 invoker ones (135), and `_audit_action`. `service_role` is granted again only where a migration granted it. No
blanket statement. THE PROVISO: a function that ANY call site reaches with a visitor's or a user's token is LEFT OUT
and listed for me. CHECK BOTH TREES, CONFIRMED by grep with the hits written into your report: your checkout (the
line) AND `origin/master` (WHAT IS LIVE: `git fetch origin master`): under src/, `rpc('<name>'`; under
supabase/functions/, every call site of a listed function and WHICH client it uses (the service-role one or the
caller's own token).

## 3. PART B: THE DEFAULT
`alter default privileges in schema public revoke execute on functions from anon, authenticated;` (the migrating
role's own default; NOT from `public`). **Why:** it makes this repository's own convention (`revoke ... from public;
grant ... to service_role`) true on the hosted platform; a function with no statement at all stays as open as in
plain Postgres, so nothing that relies on that today changes. Its own section, LAST in the file, with a comment in
plain words. Say in your report what the harness shows for a function created AFTER it with the convention's two
lines, and for one created with none. The reader weighs it; the owner is told in plain words.

## 4. PART C: profiles
THE ALLOWED LIST, BY COLUMN GRANTS: `revoke update on public.profiles from anon, authenticated;` then
`grant update (<columns>) on public.profiles to authenticated;`. THE COLUMNS: exactly the union of the columns a
DIRECT client update writes, IN BOTH TREES (line and master), each call site named in your report. `display_name` is
on the list ONLY IF a call site has no RPC path to write it. The 087 policy stays as it stands (it is not restated).
If master's client writes a column the line's does not, or the reverse, SAY SO: part 7 then holds this part back.
THE CLIENT'S ROUTE ROUND THE CIVILITY GUARD (`src/lib/auth.js :: supabaseUpdateDisplayName` writes `display_name`
directly when the RPC errors): removed in this lane, its own commit, red first: a refusal is shown, never routed
round.

## 5. PART D: settlements AND saved_maps
The guard trigger in 171's idiom, as you propose, on a function that is SECURITY INVOKER (a definer trigger function
would read its owner as `current_user`): it refuses a change by `anon` or `authenticated` to the columns the server
owns. BEFORE YOU LIST A COLUMN, grep BOTH trees for a direct client write of it: a column a client writes stays out
and is listed for a ruling. The definer RPCs that write those columns (view counts, import counts, bans) must still
write: prove each with one call in the test.

## 6. THE TESTS, EACH SEEN RED BEFORE ITS PART AND GREEN AFTER
(i) The hosted-default harness COMMITTED as a shared helper (not scratch). THE REGISTER of every SECURITY DEFINER
function in `public` with its class: no SERVER or NOBODY function is executable by `anon` or `authenticated`; every
USER function is executable by `authenticated`; every ANYONE function by `anon`; A FUNCTION WITH NO ROW REDS.
(ii) profiles: a signed-in user changes no column outside the allowed list; A COLUMN WITH NO CLASS REDS.
(iii) settlements and saved_maps: every column classed (its owner may write it / the server alone); an owner cannot
change a server column; a banned and soft-deleted row cannot be cleared and published by its owner; A COLUMN WITH NO
CLASS REDS.
(iv) What your part (c) names: the sequence test, the rehearsal's wave and its pins, the @rollback note, the document
counts. `tests/security` whole and `tests/lint` whole after the last commit, reds by name against the red list.

## 7. THE OWNER'S PLAIN FILE, GENERATED FROM YOUR CATALOG (never typed by hand)
`docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS.sql` with a page of plain words beside it.
Block 0 ONLY READS: the 136 functions, each with `has_function_privilege` for `anon` and for `authenticated`; the rows
of `pg_default_acl` for schema `public`; the count of `public.surveyor_byok_keys` (a number).
Block 1 is PART A alone: it is safe on the live site if no LIVE call site uses a visitor's or a user's token (the
proviso of part 2 on `origin/master`): say CONFIRMED or not.
Block 2 is PART B.
Blocks 3 and 4 (PARTS C and D) are in the file ONLY IF master's client is shown compatible with them; else the page
says "with the release" and why.
Every block: one plain sentence of what it does; safe to run twice; the one statement that undoes it.

## 8. APART, LISTED FOR THE READER, NOT BUILT
The 59 USER functions `anon` can execute: name those that ACT ON AN ARGUMENT without refusing a null `auth.uid()`.
The 16 admin functions that trust the `p_actor` they are handed: PART A closes them to visitors; their body is the
server's trust in the edge function that calls them: say which edge functions call them and how each proves the
caller is staff.

## 9. ORDER AND LINES
A and its test first; then B; then C (with the client's commit); then D. Each pushed on `lane/grants-1-2026-11-24`
(a builder's work as `-<unit>-wip` first, its diff read once by you). ONE LINE to me after each part. Then your
hand-back and "GRANTS <commit>". Say CONFIRMED for what you executed and PLAUSIBLE for what you only read.
