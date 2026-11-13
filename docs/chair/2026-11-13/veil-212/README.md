# Applying migration 212: the owner's step

**For the owner's hand only, and only after a security reader has cleared this pack.** No session applies this.
Do it in the SQL editor of the production project. Do NOT use a database push from any branch: that would send
migrations 204 to 210 with it, and 208 must not go before the new site.

**What it needs first.** Migration 211, applied from its own pack (`docs/chair/2026-11-13/APPLY-211/`), exactly as
the security review cleared it. 212 is written to run after that file and nothing else; `1-read-first.sql` checks
that production holds it, function by function, before you go on.

**What it changes for a user.** 211 stopped the server sending what a game master hid by hand. But a town keeps a
few facts twice, and 211 withheld only the first copy. With 212, the second copy goes too:

- a relationship whose description or tension the game master hid: its words no longer travel in the town's
  "most notable relationship" summary or in its pressure sentence (on the old page, the italic line under the
  Overview and the lines on the Summary tab simply do not appear for such a town);
- a current tension whose description was hidden: it no longer travels inside the siege history;
- a house whose description was hidden: the defence tab's force cards show its name without that description;
  a house hidden whole leaves the defence lists, and its name leaves the economy's chains (a chain that only that
  house ran is not shown) and the simulation notes;
- a person whose appearance was hidden: a first impression that repeats those words is not shown;
- on a share with "reveal to DM" on: the author's custom-content library (which no page ever showed) is no longer
  sent, and a person the game master switched off is no longer sent in full inside a power's member list.

Nothing that is not hidden changes. Nothing is written: no table, column, policy or row; it creates ten helper
functions and replaces five. It is the cure the lane's sixth seat built, moved out of 211's file unchanged so that
211 could stay the file you apply.

**What was checked** (on local scratch databases only, never a hosted one): 211 + 212 leaves the database exactly as
the lane's tested version did (0 lines differ, on a chain at 203 and on the full chain); the security review's
planted-marker run finds nothing hidden in any of the four reads with 212 (it finds the review's own rows with 211
alone, as the review did); this pack's own four files were rehearsed in order, and the rollback returns exactly to
211 (`docs/chair/2026-11-13/veil-probe-7/`).

## The files

| File | sha256 |
|---|---|
| `1-read-first.sql` | `1dfbfa2fd8f51e07a46984902939edf000ef4b45dd2f51181d335a43e6facc16` |
| `2-apply-212.sql` | `ccccb0251dbbf31d36de55cccca2a91a3a9f461698f0a29c6e94d5bec427f09e` |
| `3-check-after.sql` | `2c80395b33d54b337ab4b516c4a3adcf99d2617e186009fb91272fa4dea09b4b` |
| `4-rollback-ONLY-IF-NEEDED.sql` | `e465abd827a5e7ad1135d7052d30897a5bbf9152459e57d51263f3d0cad67580` |

`2-apply-212.sql` is `begin;`, the file `supabase/migrations/212_share_veil_later_cures.sql` byte for byte (sha256
`057e215cd86bfaf8c5302e321dd91ce2eb17d1b7975d8cd1e7d96a4231a0489f`), and `commit;`. `4-rollback-ONLY-IF-NEEDED.sql` is `begin;`, the file
`supabase/rollback/212_share_veil_later_cures.down.sql` byte for byte (sha256 `e1061909a1f0523dcb20a777d5834e12bcd890078214868afc2f7d7b303ab50c`), and `commit;`.
Check a file: `git show <commit>:docs/chair/2026-11-13/veil-212/<file> | sha256sum`.

## The steps

1. **Run `1-read-first.sql`** (read-only; it ends in a rollback). Look at:
   - (1) the statement time limits of `anon` and `authenticated`: if either is under 1.5 seconds, STOP and tell the chair.
   - (2) must read `45 | 45 |` and three empty cells. Anything else: STOP and tell the chair, with the names it prints.
     (If it says 212 is already applied, go to step 3.)
   - (3) must read `40 | 0`.
   - (4) is information: four numbers, d1 to d4, sizing what 212 closes. Send them to the chair if convenient.
2. **Run the whole of `2-apply-212.sql`, once.** One transaction: if any statement fails, nothing has changed. Do not
   split it. If the editor refuses its size, stop and tell the chair.
3. **Run `3-check-after.sql`.** Expect `50 | 0` first, then `55 | 55 |` and three empty cells, then
   `search_path=public, pg_temp` on each of the four reads.
4. **Look as a visitor** (a private window, signed out): a shared town whose game master hid things still draws; a
   frozen share shows its frozen copy; a party link opens; a shared map's member towns open. Signed in: an
   importable town imports.
5. **Only if something is wrong: run `4-rollback-ONLY-IF-NEEDED.sql`.** One transaction; it returns the database to
   211 exactly (then `1-read-first.sql` reads `45 | 45` again), and so sends the second copies again.

## Afterwards

Tell the chair it is applied, with the numbers from step 1. At the release the normal push applies 204 to 212 in
order; 211 and 212 go on again in their places and nothing else is needed (rehearsed: the result equals a chain that
never had the early steps). Never push the release without 212 once it is applied here: 211 re-run alone would put
the second copies back until 212 follows.
