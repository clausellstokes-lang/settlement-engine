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

The hook's wrappers are installed (`core.hooksPath` = `.husky/_`, `.husky/_/pre-push` present). The lane is pushed once, `git push -u origin lane/coherence-veil-2026-11-11`, through the whole check in the hook; its exit is in the message to the chair.
