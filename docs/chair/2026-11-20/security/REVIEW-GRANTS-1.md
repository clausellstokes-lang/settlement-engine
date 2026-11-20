# REVIEW-GRANTS-1: migration 213 (function grants, default deny), read cold and executed (2026-11-20 04:44 UTC)

**Verdict: 213 CLEAR at sha256 `c87283acce8223884e9ea973b9be2f2cd19a3fbebbffa48808171c5e3cd82bfb`.** Nothing found
blocks it. Four advisories follow (F1–F4); none is a door and none breaks the app.

Assignment read at lane/chair-2026-11-08 `95931eb0e`. Base: origin/lane/sec-grants-2-2026-11-20 at `fac781e7e`
(read back; it had not moved). Veil: origin/lane/veil-21-2026-11-20 at **`0d28ccf19`** when I ran (211 sha256
`eface6d0…`, 212 `fec111c2…`, the same bytes the builder used at d5323b8b8). Every database was a scratch
PostgreSQL 16.15 in this container (`listen_addresses=''`, socket `/var/tmp/rg1`), built by my own
`review/chain.sh` on the builder's `proof/scaffold.sql`. I reused none of the builder's outputs as evidence. I used
two of the builder's instruments, `fill-rows.sql` and `fill-rows-2.sql`, to give every table one row after my own
victim seed. Every probe is under `review/`, and its small outputs are under `review/out/`.

## 1. Does it break the app? No (EXECUTED)

**The 21 invoker helpers.** `review/helper-paths.sql` is wider than the builder's closure. It reads `pg_depend` of
every class, every function body in every schema, argument defaults, views, policies, constraints (domains
included), defaults and generated columns, index expressions, trigger definitions and WHEN clauses, rules, casts,
operators, aggregates and event triggers. On the post-213 chain it finds **46 references, all of them function
bodies** (`out/helper-paths-post213.txt`). Not one constraint, default, policy, view, index or trigger names any of
the 21. The six invoker bodies that call one are themselves among the 21 (the civility trio, the chronicle pair, and
`_gallery_apply_member_overrides`). Every other caller is SECURITY DEFINER owned by `postgres`, so it runs as the
owner. The app never calls one of them with `rpc(…)` (grep of src, api, supabase/functions).

By execution, `review/flows-review.sql` runs the visitor paths as the browser's own roles:
- sign-up;
- profile edits (a direct update, display name, security answers, email preference);
- a town insert, update, upsert and batch, and a map insert and update;
- publishing a town and a map;
- sharing a town and a map by link, and rotating each link;
- the gallery signed out (every list, dossier, map, unlisted read, more-by-creator, view bump, founders roll, seats,
  comments, vote and reaction state);
- a vote, a reaction, a comment (plus the blocked-word path), a report of a dossier and of a comment, an import;
- a support ticket, my-tickets, and the thread read as its owner, another user and anon;
- credits, Surveyor entitlement, BYOK set, the edge's service calls, a no-role (cron) call;
- unpublish, the two deletes, a deletion request.

Before 213 and after it, the output is **identical except one line**: anon calling `list_ticket_thread` now gets
`permission denied`, which is intended (`out/flows-*.txt`). The fresh history equals the emergency history.
`track_functions` shows **10 of the 21 actually executing inside those flows after the revoke** (civility ×4,
security-question and email-category validators, sanitize, member overrides, dm_full, chronicle_json), every one of
them under a definer frame. The other 11 are reached only from definers the 157 already closed, or are not reached
by these flows.

**On the veil composition**, in production order (001..210 + emergency → 211 → 212 → 213), the result is the same
(`out/flows-post213-veil-production-order.txt`). The flows are identical before and after except the same anon
ticket-thread line, and byte-identical to the 001..210 run. 10 of the 21 and 16 `_gallery_veil_*` helpers execute
during the flows. Three veil invoker bodies call 213's helpers (`_gallery_veil_second_homes`, `_member_revealed`,
`_roster_members`), but that whole invoker web is closed to the visitor roles: no invoker body a visitor may execute
names a `_gallery_veil_*` function (count 0), and on that chain too only function bodies reference the 21 (50 rows,
all BODY). So it is entered only from definers.

**The five guards.** On each, `pg_get_functiondef` on 001..210 against the same after 213 differs by exactly ONE
line, and it is the line the header names. Owner, `prosecdef`, `proconfig` and the ACL are kept by
`create or replace` (verified in the ACL dumps).

## 2. Does it close the class? Yes, on the chain (EXECUTED)

After 213, the set a visitor may execute (extension members excluded) is **105 signatures, exactly the written
allowlist**: 86 doors, 6 visitor-needed and 13 triggers. 84 of them are open to anon.

`review/wide-harness.sql` calls all 92 non-trigger functions as anon and as an attacker (authenticated, user 1111)
against a seeded victim. The victim (user 2222) has a private town, a public town, an unlisted town, a private map, a
public map, a ticket with a user-visible reply and an internal note, comments, a report, credits and security
answers, all marked `VICTIMSECRET` or `PUBLICOK`. An admin (3333) and a support agent (4444) are also seeded, and
every table holds a row. Each uuid argument is set in turn to every uuid stored anywhere (51), each uuid[] to the
whole pool, and each text argument to every slug, code and marker (27). The neutral values are first the victim's,
then the attacker's own id, with the neutral text cycled through 15 enum values. Every call runs in a subtransaction
that is rolled back, and its writes are read from `pg_stat_xact_user_tables`.

That is **106,736 calls in all**. **No call returned a victim secret.** The only marker hits are the attacker's own
display name echoed back. **No write touched anything but** a public town (vote, reaction, comment, report, view
bump), the attacker's own comment or profile or email preference or Surveyor settings, or a report of a comment
(`out/wide-write-targets.txt`). Reads keyed on another user's id return either the public value or a guard's
`false`: `has_dossier_entitlement` and `welcome_credit_available` read `auth.uid()`, and `get_gallery_vote_state` is
restricted to `is_public`. `account_is_active` answers for anyone, which is VR38's accepted residual and is not
reopened here.

Negative controls: two planted definers with no caller check. The harness flags the rename (3 victim towns written)
and the thread leak (`out/wide-plant-controls.txt`).

**NULL-slips in what stays open.** I scanned every `<>`, `!=`, `not in` and `is distinct from` line of the 92
bodies (274 lines). Each comparison between a caller value and a target sits behind an earlier
`if v_uid is null … raise` (all seven `p_expected_owner <> v_uid` doors, `mutate_settlement_batch`,
`set_my_email_preference`, `set_my_telemetry_consent`, `reactivate_free_settlement`, `welcome_credit_available`),
and anon holds none of those grants. The rest are shape validations.

**The allowlist, by habit: see F4.**

## 3. The four histories: identical (EXECUTED)

I built five histories from each chain: fresh; the emergency script; the emergency script plus the two ticket lines;
the two BYOK revokes by hand from public, anon and authenticated; the same two revokes from anon and authenticated
only. I applied 213 twice on each. On every public function I compared the ACL, owner, `prosecdef`, `proconfig` and
`md5(pg_get_functiondef)`:

- **001..210: 440 functions, md5 `bd84ac9e5e2f`, the same on all five.**
- **001..212: 511 functions, md5 `486cf0030e42`, the same on all five.**

I also ran the **production order**. The repo records production at **203** (`applied-head.json`), not 210, so I
took the paths 001..210 + {emergency | emergency + ticket lines | BYOK pair} → 211 → 212 → 213, and also
**001..203 + emergency → 204..212 → 213**. Every one of these ends at the same 511, `486cf0030e42`
(`out/histories-md5.txt`).

## 4. The rollback (EXECUTED)

213 ships no rollback file. Its `@rollback` comment prescribes two steps: re-state the five 210 bodies, and grant
the 21 to anon and authenticated. I made exactly that executable (`review/rollback-213.sql`) and applied it after
213 on all ten histories and on the production-from-203 path. It applies cleanly. It **converges to one state per
chain**, and on every history it **keeps the 157 and the four doors closed**: it does not reopen V10-8. The bodies
return byte for byte. Against each "before" it differs only as follows:

| history | rows that differ from "before" | what differs |
|---|---|---|
| emergency + ticket lines | 14 | PUBLIC's `=X` is not restored on 14 helpers (7 of the 21 never had it). Inert: no role outside anon, authenticated, service_role and postgres runs them as itself; the `auth.users` triggers are definers. |
| production as it likely stands (emergency, no ticket lines) | 15 | The same 14, plus `list_ticket_thread` stays closed to anon. Stricter than before. |
| fresh, or BYOK pair only | 175 / 173 | The 157 and the four doors stay closed. Stricter. |

## 5. The walker (EXECUTED: green 10/10 on the base; plants in a scratch copy of the tree)

| plant | result |
|---|---|
| P1: a new definer, no grant change | RED (unlisted) |
| P1b: the same with `revoke … from public` only | RED |
| P2: a listed door's check removed | RED (check arm) |
| P5: set_curated reverted to its 210 guard | RED on both the NULL-slip arm and the check arm |
| P4: list_ticket_thread's guard moved into a WHERE | RED, but by the check-text arm, not the NULL-slip arm |
| **P3: welcome_credit_available's target-limit line removed, its `auth.uid() is null` return kept** | **GREEN: a blind spot (F3)** |

What it cannot see beyond P3:
- schemas other than public (PostgREST also serves `graphql_public`);
- a function made on production outside the migrations (CHECK_213's `unlisted_open` covers that);
- a name reached only through dynamic SQL;
- guards written as `where` filters (these fail closed, so they matter less).

## 6. CHECK_213.sql and the deploy note (EXECUTED)

It is one statement and returns one row. Its allow list equals the JS allowlist (105). Its closed list is 157 + 21 =
178. Its `not in` has no NULL members.

| state | reading |
|---|---|
| after 213, every production-order path | `0 · 0 · 0 · 0 · 0 · 5 · 0` |
| before 213, emergency without the ticket lines | `21 · 0 · 0 · **1** · 0 · 0 · 21` |
| after a rollback | `21 · 0 · 0 · 0 · 0 · 0 · 21` |

All readings are in `out/check213-runs.txt`. The before-213 row matters for F2.

## Findings (none blocking; each executed)

- **F1 (docs, rollback).** Two problems in the rollback text and the hand-back:
  - They call production's pre-213 state "001..210 plus the emergency script and the ticket thread's two lines".
    The repo records production at 203, and whether the two ticket lines were run is not recorded.
  - No executable rollback exists: the owner would have to assemble one under pressure.

  The behaviour itself is safe on every history (§4). `review/rollback-213.sql` is that rollback, ready to use.
- **F2 (deploy note).** The note says "before 213 it reads 21 still open and 0 guards". It omits `anon_doors_open 1`
  (the ticket thread, if the two lines were not run) and `unlisted_open 21`. An owner who runs CHECK_213 before the
  push should expect exactly that row. The after-row is the one that matters, and it is stated correctly.
- **F3 (walker).** The door arm checks that a text is present, and 59 doors' check is the bare `auth.uid()`. P3
  stays green: a definer's target-limit line can be removed while it still mentions `auth.uid()`. The fix belongs
  to the walker, after the deploy: a per-door check line rather than a token.
- **F4 (allowlist).** 30 of the 71 anon-granted doors refuse anon on every call ("not authenticated" / "Sign in…",
  100% of 30 doors × every value). Their anon grant is Supabase's default, not a signed-out context, so the in-body
  uid check is their only lock. They belong to the post-deploy default-deny migration (revoke anon on these 30),
  not to 213.

## For the owner, in plain words

213 is safe to apply after 212, in the same push. I rebuilt the database from scratch in every order production
could have taken: from 203, from 210, with the emergency script, with or without the ticket lines, with only the two
key functions closed by hand. 213 lands every one of them in the same place. Nothing a user does changes: sign-up,
saving, maps, publishing, sharing, the gallery, votes, comments, reports, tickets, credits and Surveyor all behave
the same before and after. The only difference is that signed-out visitors can no longer read a ticket's thread.

I called every function a visitor can still reach about 107,000 times, as a stranger and as a signed-in attacker,
aimed at another user's real data. None leaked a private row, and none changed anything the caller does not own.

The rollback, if ever needed, does not reopen the 157. After the push, `CHECK_213.sql` should read
`0 · 0 · 0 · 0 · 0 · 5 · 0`. **213 CLEAR at sha256 `c87283acce8223884e9ea973b9be2f2cd19a3fbebbffa48808171c5e3cd82bfb`.**
