# COHERENCE-VEIL — phase 2 hand-back, part 5: the fourth seat's cures for REVIEW-VEIL-211-f07db8760

Seat: COHERENCE-VEIL-4, lane `lane/coherence-veil-2026-11-11`, from `f07db8760`. The review is `origin/lane/chair-2026-11-08 :: docs/chair/2026-11-12/REVIEW-VEIL-211-f07db8760-2026-11-12.md` (CLEAR; V3-1 MEDIUM, V3-2 and V3-5 LOW). Migration 211 is edited in place and applied nowhere. Every database was an in-process pglite or a scratch native PostgreSQL 16.15 cluster on this machine (`/var/tmp/cv4`, UTF8, trust auth, unix socket only, torn down at the end). No hosted database was touched. No `src/` file changed.

## 0. Calls taken without the chair (each vetoable)

1. **V3-1's cure is in the two reads, not in `_gallery_dm_full_json`.** The gallery read and the import take `_gallery_dm_full_json(src.j) - array['decrees', 'dmLayer']` as the full projection. Restating `_gallery_dm_full_json` in 211 would have needed a new rollback body; this way 211's header line "NOT CHANGED: _gallery_dm_full_json" stays true and the rollback stays exact, unchanged. The link and the map read through the sanitiser, whose top-level allowlist already drops both keys (`210 :: public_toplevel`), so they need nothing.
2. **The server's `block:housekeeping.decrees` remover is kept** (the review offered "marker-only"). It now removes nothing on any read, since both keys are gone before the veil runs, but it stays the character-for-character twin of the client's `GROUPING_REMOVERS` entry. Declared: the curate panel's "Pending decrees" eye now changes nothing a reader receives, in either direction (the client never drew them). Removing the eye is a design change and first-paint bytes, so it is not this lane's: noted for the owner.
3. **V3-2 is cured, not declared.** Counted first (§2): 0 on generated towns. The cure is 8 lines added and 1 changed in 211's `_gallery_veil` (2 of them comment), so the brief's rule says cure it. It runs on every body the veil serves (the gallery and import of a marked share, every party link, a marked map member). An unmarked listing is served as before and the client projects it. A non-object `npcs[]` element is left as it was served (out of the review's class).
4. **V3-1's owner count is section (9) of the read-only block.** The block is the one file the owner runs before the push. It carries the review's query verbatim, plus a second count. At 203 there is no server veil, so every public Reveal-DM share holding either key sends it today, marked or not. The review's query counts only those that 211-as-reviewed would still have sent.
5. **V3-5: "at 210" in a section of the block is kept, now defined.** It names the reads as migration 210 leaves them, the baseline every proof compared against. Part 4's sentence carries its correction in place.
6. **The probes gained counts, not new probes.** `towns.probe.mjs` counts `editorState` (top-level `decrees`/`dmLayer` in any of the four responses) and `nameless` / `nameless210` (a card the client drops, drawn on the 211 / 210 page). `iddiff.probe.mjs` takes `OUT_FILE`, so part 4's records are not overwritten.

## 1. The findings: commit, red before, green after

| Finding | Commit | Red at f07db8760 → after | Pin (`tests/security/galleryVeilCures.pglite.test.js`) |
|---|---|---|---|
| V3-1, the gallery read | `6417a05e8` | an unmarked Reveal-DM listing: decrees and DM layer in the anonymous gallery response → absent (link, map, page absent before and after; 210 the red control) | "V3-1 (the review row, the gallery read) …" |
| V3-1, the import | `6417a05e8` | unmarked, Pending decrees opened, a frozen copy holding both, a narration holding both: 4 of 5 sent → 0 (the default veil already removed them) | "V3-1 (the review row, the import) …" |
| V3-1, Pending decrees opened | `6417a05e8` | live, frozen copy, narration, every grouping opened: gallery, import and the page object carried both → none | "V3-1 (the review row, Pending decrees opened) …" |
| V3-2 | `105efd1c6` | default veil, every eye open, Reveal DM with the person revealed: the nameless card's text on the 211 page and in the gallery and link responses, 3 of 3 → 0; the 210 page clean in all three (the control) | "V3-2 (the review row) …" |
| V3-5 | `b3dcf8188` | the block's header, the fixture's header, part 4 §5 said production stands at 210 → 203 | words only |

Each pin was run red on the tree before its cure and green after; each anchor (the DM-full read, the named person drawn, 210's own behaviour) held in the red run. One red was the pin's own error: with Reveal DM on, person x keeps its role (full mode applies no face veil) and is rightly drawn. The pin was narrowed to the bare card before the cure, then re-run red.

## 2. V3-2 counted first, and V3-1 counted, on the six-size probe

`veil-probe-2/towns.probe.mjs` (counts added), native, at **f07db8760's 211** (`out/towns-cv4-count-f07.json`): 522 rows, 8,136 reads, every chain applied whole. **nameless 0, nameless210 0, editorState 0**; carried, overrides, changed, sameRow, oldShows, postFreeze, splice 0 each; importMap 84 (part 4 and the review's figures exactly). Generated towns carry no `decrees` or `dmLayer` and every generated person has a name, so both findings live in hand-edited rows. The pins are their measure.

## 3. Re-proofs at the final 211 (`105efd1c6`)

| Proof | Result |
|---|---|
| Both veil pin files whole (the R3/R4 class fuzz, 400 documents × 4 reads × 2 chains, parity with 210; `galleryServerVeil`'s client-projection parity; every R and F row; the rollback rehearsal) | **exit 0, 39/39** (part 4's 35 + V3-1's 3 + V3-2's 1); at `6417a05e8` alone 38/38 |
| The rollback, native, both ways, a 1,352-line catalogue (every non-system function with body md5, volatility, definer, settings, ACL, owner, result, parallel, strictness, definition md5; every relation in public/auth/storage/cron with kind, ACL, RLS; policies; default ACLs; triggers; public constraints) | down: exit 0, **0 lines differ from 210**, no `_gallery_veil*` left; down twice: 0; 211 again: **0 lines differ from 211**; control 210 vs 211: 50 lines (the review's 50) |
| The six-size probe (`out/towns-cv4.json`) | exit 0; every chain applied whole; **522 rows, 8,136 reads: carried, overrides, changed, sameRow, oldShows, postFreeze, splice, editorState, nameless, nameless210 0 each**; importMap 84, unchanged (the review classed all 84 as "map lacks") |
| The id differential (`out/iddiff-cv4.json`) | exit 0, against the final 211's chain: **26,515 compared, 0 unequal, 0 raised**; 570 client `idOf` throws and 915 anonymous legacy events counted apart, part 4's figures exactly |
| The owner's push rehearsed: 204..211 over the 203 fixture, each file in its own transaction | every file exit 0; section (9)'s four Reveal-DM rows send both keys at 203 and neither at 211 (gallery and import) |
| eslint on every touched file | exit 0 |

`check-domain-strict` and `typecheck:ratchet` were not run: no commit touches `src/`.

## 4. The owner's count before the push (V3-1), read-only

Section (9) of `veil-probe-2/predeploy-readonly.sql`. The review's own count:

```sql
begin transaction read only;
select count(*) as reveal_dm_listings_sending_editor_state
  from public.settlements
 where is_public and gallery_share_dm
   and (jsonb_typeof(gallery_member_overrides -> '$veil') is distinct from 'object'
        or (gallery_member_overrides #> '{$veil,deltas}') @> '[{"address":"block:housekeeping.decrees","hidden":false}]')
   and (data ?| array['decrees','dmLayer'] or coalesce(ai_data -> 'aiSettlement', '{}') ?| array['decrees','dmLayer']
        or coalesce(gallery_member_overrides #> '{$veil,snapshot}', '{}') ?| array['decrees','dmLayer']);
rollback;
```

Beside it, `reveal_dm_shares_sending_editor_state_today`: the same without the veil condition, so every public Reveal-DM share sending either key now, at 203. **Run on the fixture** (five rows: unmarked; marked; opened; a narration, opened; and a share without Reveal DM) at 203 and at 210: **3 and 4**, as built. Every other number in the block is unchanged (part 4 §5's table). The md5 of every row, the md5 of every function and the write counters are equal before and after. The READ ONLY control is refused. Record: `veil-probe-3/out/predeploy-run-cv4-203.txt`. **Reading it:** above zero, those towns' staged decrees and DM layer have been readable by every visitor and importer until 211 lands. 211 as cured ends it, so it is no reason to hold. The owner may wish to tell those sharers.

## 5. The golden surfaces

None of the six (gm, fence, prose, herald, witness, PDF) can move. Every one is produced from `src/`, and `git diff --name-only f07db8760 105efd1c6 -- src` lists **0 files**. The pre-push whole check runs their pins at the tip. No golden's door was run.

## 6. Migration 211 against f07db8760

**+24 / −3 lines** (`git diff f07db8760 105efd1c6 -- supabase/migrations/211_server_side_share_veil.sql`):
- header items (7) and (8): 9 comment lines;
- `_gallery_veil`: 8 lines added (a variable, the body built once, 2 comment lines, and 4 that drop a card with no truthy name and no truthy role from `npcs`) and the return's one line changed to use it;
- `get_gallery_dossier` and `import_gallery_dossier`: 2 comment lines each, and one line each changed: `public._gallery_dm_full_json(src.j)` → `public._gallery_dm_full_json(src.j) - array['decrees', 'dmLayer']` as the base of the splice under Reveal DM.

The rollback file is unchanged: it restores the reads' 210 bodies and drops every `_gallery_veil*` by signature, which covers both cures.

## 7. Leaving

The hook's wrappers are installed (`core.hooksPath` = `.husky/_`, `.husky/_/pre-push` present). The first push through the whole check in the hook failed and sent nothing (§8). The lane is pushed once, `git push -u origin lane/coherence-veil-2026-11-11`, after §8's cure. The hand-run check's exit and the push's are in the message to the chair.

## 8. The first push, the leak it exposed, and the cure (the chair's ruling of 2026-11-13)

**What happened.** The first push, from this seat's linked worktree at `7cc74d252`, ran the whole check in the hook and exited 1 at `test:ratchet`. Nothing was sent; the remote stayed at `f07db8760`. Git exports `GIT_DIR` to a hook, and from a linked worktree that path is absolute. So five suites that run git in `mkdtemp` folders acted on the real repository instead:
- `tests/scripts/implementationPackets.test.js`
- `tests/scripts/implementationSession.test.js`
- `tests/scripts/landingStageMeasure.test.js`
- `tests/soak-harness/soakRegister.test.js`
- `tests/lint/tuningRegister.walker.test.js` (a bare `git init`)

They moved the lane branch onto fixture commits ("packet authority") and created branches `other` and `side`. They wrote `user.email=fixture@example.test`, `user.name=Fixture` and `commit.gpgsign=false` into the shared `.git/config`, and set `core.bare=true`. The main checkout stopped reading as a work tree. Four suites then collected zero tests, which tripped the ratchet's scope sentinel:
- `declaredLineShape` and `drawDeclaredKeys`: their `git grep` failed against the now-bare repository.
- `ledgerCitationIntegrity` and `provenanceMap`: no local `review-fixes-2026-07-08` ref.

It never bit before because every earlier whole-check push ran from a main checkout.

**Restored by this seat, each from the record:**
- The lane ref went back to `7cc74d252`, read from its reflog, with an old-value guard. The worktree's HEAD and index went back to it.
- `core.bare=false` again, and the `[user]` and `[commit]` sections removed. Every commit on the lane carries `Claude <noreply@anthropic.com>`. The fixture sections were appended after `[branch]`, so they postdate the clone; `[gc] auto = 0` sits before `[remote]`, so it predates the run and stays.
- The main checkout reads as a work tree again, detached at `f07db8760` as before the push.
- A copy of the leaked config is in the seat's scratch area.

Then, on the chair's ruling:
- `other` and `side` were deleted after reading them. `other` held 16 commits outside every other ref, all by `t <t@t>` at 00:45:06; `side` held none of its own.
- The ledger ref was fetched: `review-fixes-2026-07-08` → `235efce1a`.

**The cure** (`ec861dbd8`, tests only, no `src/`). One helper, `tests/helpers/fixtureGit.js`:
- `fixtureEnv()` returns the environment with the repository-locating variables removed: `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR`, `GIT_OBJECT_DIRECTORY`, `GIT_ALTERNATE_OBJECT_DIRECTORIES`, `GIT_PREFIX` and every `GIT_CONFIG*`.
- `fixtureGit()` spawns git with that environment.
- `isolateFromHostRepo()` removes the same variables from `process.env` for a file that builds a fixture repository, so the library code and CLIs under test act on the fixture too.

The five suites use it. The walker `tests/lint/fixtureGitIsolation.walker.test.js` enforces two rules:
- **R1:** a test may not run git with a cwd outside the repository root unless it passes `env: fixtureEnv()`.
- **R2:** a file that builds a repository must call `isolateFromHostRepo()`.

`tests/helpers/goldenRecordDoor.js` stays outside R1. Its `root` is its caller's, and five scripts that run outside vitest import it, so it may not import vitest. The mutation-coverage manifest takes the walker's rationale entry through its own door. Scope: 8 files, under the chair's bound of about thirteen.

| Proof | Result |
|---|---|
| Red, never against the real repository: a throwaway with `GIT_DIR` exported to it, the five suites run | the throwaway's `main` moved to "packet authority"; it gained `other` and `side`; its config took the Fixture identity: **7 lines moved** (the hook's damage, reproduced); with `GIT_WORK_TREE` and `GIT_INDEX_FILE` also exported: 3 lines |
| Green, the same throwaway runs, the five suites and the walker | `GIT_DIR` only, and all three: **6 files, 133/133, 0 lines moved**; plain run 133/133; the real repository's refs and config byte-identical before and after |
| The walker on the five suites' pre-cure bytes (cured copies held aside, restored by cp) | **R1 red at the 5 call sites, R2 red at the 5 files**; green after, 5/5 |
| The walker's own non-vacuity | under a foreign `GIT_DIR` its subject list read empty and its subject test **red**; the list now reads through `fixtureGit` |
| The four zero-test suites, the manifest totality, `testRatchet` (the walker-census law) | 7 files, 124/124 |
| eslint on the 8 files | exit 0 |

**The push.** The whole check is run by hand first (`sh scripts/gate-tail.sh npm run check`). Then `git for-each-ref` and `git config --local --list` are snapshotted, the lane is pushed once, and both are compared. Anything moved means restore and stop.
