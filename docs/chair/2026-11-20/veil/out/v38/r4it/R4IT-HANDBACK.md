# R4I-TONIGHT HANDBACK (VEIL-38, chain B). STOPPED AT ITEM M: THE MEASURE WAS NOT RUN ON EITHER SET. NOTHING BUILT.

Branch `lane/veil-38-2026-11-23-r4tonight-wip` (local, never pushed), cut at b088fcfc5. Brief: `briefs/R4I-TONIGHT-BRIEF.md`
(52063cb41). Window: 01:03 to 03:02 UTC. No line of `src/` and no test is changed in any commit of this lane.

## M — THE MEASURE: BUILT, ITS TEETH PROVEN; NOT RUN ON THE 140 OR THE POOL (a STOP)
- `tonight-names.probe.jsx` + `tonight-names.sh <tree> <outdir> [template] [pooldir]` + `tonight-names-an.mjs` (order.sh's shape).
  Per place: Reveal off and on x {the default veil, own, g:000..g:110, allOpen, off} (tell-common.mjs :: settings), each read by
  the TWIN (fetchPublicDossier over the unserved row) and the SERVER (get_gallery_dossier on PG16 `v28tpl`, then the client fetch):
  44 reads a place. (i) distinct cast person ids sharing (card name, crisis, role), owner page and every read. (ii) each served
  cast person's card name and row name against the stored person's: the twin's salt is FIXED for its read (randomUUID stubbed,
  every stored id re-keyed under it), the server's id mapped through `canonPeople` to the twin's of the same canonical name.
  Unmapped served cast ids and server/twin canonical inequality are counted too.
- TEETH (`RV9_PLANT=1`, logs/m-plant.txt): one renamed card and a same-named second cast person planted on one twin read:
  (i) 1 place, (ii) 4 person-reads, unmapped 1. CONFIRMED.
- TRIAL ONLY (logs/m-trial.txt): 2 of the 140 (shard 1/4, limit 2), 88 reads, twin and server: (i) 0, (ii) 0, unmapped 0,
  server vs twin canonical unequal 0; no cast person without a name. PLAUSIBLE for the sets; it is not M.
- WHY NOT RUN: the mutex. Try 1 (01:09) GAVE UP after 40 polls (logs/m-140-try1-gaveup.log). Try 2 (one hold for the 140 then
  the pool) acquired the lock at about 02:18 and then waited out legacy runners until 03:01: the seat's own `order-pool` run
  (/var/tmp/v18/out/v38/order-pool, no mutex; its shards 1-3 ended rc=1 after the kernel's OOM kills about 02:40, shard 0 rc=143)
  and `/home/user/wt/r4ip4`'s pglite runs (no mutex). Stopped at the window's end; the lock dir is left STALE from dead PID 32734
  (`gate-mutex.sh` reports it and `--run` reclaims it). Not removed by hand.
- The pool `/var/tmp/v18/t2/pool-v38` was ready (doneA, doneB: four rc=0 each; 1,200 + 608 births).

## C — NOT DONE (M has not read 0 and 0). PREPARED, NOT APPLIED, NOT RUN:
- `C-prepared-cure.patch`: `tonightSheet.js` new `castWantKeyOf(name, id)` (clean(name) || clean(id)); `castWantOf`'s second
  parameter `personId` -> `personKey`; `peopleOf` passes `castWantKeyOf(hit.npc.name, row.id)`; `crisisFactFindings.js ::
  crisisCastSenseFindings` passes `castWantKeyOf(p.name, p.castId)`. Applies cleanly to b088fcfc5 (`git apply --check`).
- `C-prepared-shareRenderTwice.patch`: every view's served person/tie ids named by the read's bijection (`canonPeople`), and the
  TONIGHT arm (twin x2, server x2, twin = server, eight salts by `rekeyPeople`, the owner's role lines). Not run.
- `owner-sheet.probe.jsx`, `owner-moves.mjs`, `tonight-arm.probe.jsx/.sh/-an.mjs`; `owner-before-140/` is the owner's sheet of
  the 140 at b088fcfc5 (both shards rc=0), the "before" of OWNER-MOVES.
- FINDING for the chair (arm trial, 6 of the 140, uncured, logs/arm-trial-uncured-6.txt): "EQUAL to the owner's own sheet on
  nothing-hidden places" is 0 of 4 for a cause the key does not touch: a non-owner read withholds the card's goal and secret,
  so the served sheet voices a temperament or a role line where the owner's voices the goal (Li He: goal vs "Methodical.").
  The prepared arm asserts the tooth the key owns instead (each cast person the owner voices with a ROLE line has the same
  line served): a judgment, vetoable.
- D baseline at b088fcfc5 (logs/d-before.txt): 30 files (tests/domain, components, pdf naming either file, plus
  crisisBlindWidened and coherence/readerBattery): 238 of 238 green.

## L, D, the join: NOT DONE. No golden, snapshot, register or signature touched or named as moved.
