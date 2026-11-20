# PAGE-6's hand-back (PEOPLE AND PLACE). Last written 2026-11-20 19:05 UTC by `date -u`

A successor (PAGE-8, seated 17:51 by the chair) needs this file and the briefs only: `briefs/BUILDER-RULES.md`,
`briefs/L2-FINISH.md`, `briefs/L4-FINISH.md`, `briefs/S9-POST.md` (designs: `briefs/L2.md`, `briefs/S-v2.md`). PAGE-6
integrates; builders (the Agent tool) build. PAGE-5 owns the trouble half: never edit `historyGenerator.js`,
`historyData.js`, `tensionSideMeanings.js`, `tensionCauses.js`.

## 00. DONE AT THE HAND-OVER ("PAGE-PART", PAGE-6's last)

- L2 MERGED 299f1545d; its doors 5d1829f3f (lighting 3707->3708; wiring census rewritten; `--tighten` ONCE: 0 raised,
  59 lowered, 0 rows added/dropped, every one in `measures/page-6/pool-dominance-tighten-L2.txt`).
- S9 MERGED ba7a04c86 (with the no-market gap closed, 75828848a); its door de0d83b64 (lighting 3708->3709; wiring CURRENT).
- AT de0d83b64: tests/lint 220/220 files, 3271/3271; the units' five test files 19/19. Red/green re-run by PAGE-6: L2 3 failed
  (3) -> 8 passed (8); S9 5 failed (5) -> 11 passed (11). Base reds not ours (at the lane base too): generatorGoldenMaster,
  espionageDormancyFence, nameHeldThroughAssembly, worldFactRederive A7, rosterFinalUnderHeldRoster A1 (builders' reads).
- TWO-TREE CONFINEMENT d448de3a3 (src/tests = the lane base) -> de0d83b64, EXECUTED: golden 525: identical 6, NON-STRING 0,
  strings 909 = arrivalScene 517 docs; npcs[].secret.what/.stakes 196 (167 docs). Census 720: identical 54, NON-STRING 0,
  strings 1117 = arrivalScene 654; secret.what/.stakes 230 (171 docs); npcs[].personality.dominant 3 (3 docs: S9's
  temperament no longer yielding to the new line, as measured). Nothing else moved. Log: scratch `confine-final.log`.
- For the owner: `OWNER-ARRIVAL-LINES.md` (the 79 lines beside their pools, one paragraph of counts).
- The builders' worktrees /home/user/wt-p6-l2 and /home/user/wt-p6-s9 are done (merged); the Agent ids in §2 are spent.

## 0. THE SPLIT (the chair, 17:51)

PAGE-6 KEEPS: L2's merge and S9's merge. EVERYTHING AFTER PASSES TO PAGE-8: L4; the cure of the 139 (F5, on the chair's
ruling after A-NARROW); the guard (S9-POST commit 2, after L4); ARRIVAL-LINES-2; SECRET-LINES. PAGE-6 ends with
"PAGE-PART <commit>, HANDED OVER" when L2 and S9 are merged, or at 420,000 by the chair's read.

## 0a. F5 IS RULED (the chair, 18:26 UTC, VERBATIM, for PAGE-8)

"F5 IS RULED: THE CURE IS A-NARROW. A principled, honest, incorruptible or plain-dealing card does not keep a venal secret: its secret walks, draw-free, to the next line its office admits; nothing else moves (arms A and B are withdrawn: they moved 902 and 1,031 cards to cure 139). CONDITIONS FOR THE BUILD (PAGE-8's, after your L2 and S9 merges and the hand-over): (1) THE PASS READS THE FINAL TEMPERAMENT: it runs after the last writer of temperament (`rankPowers`' yield moved 7 cards under it); red: on the 300, a card's temperament at the pass equals the one the record ends with, 0 differ. If that order cannot be had by moving one call, STOP and tell me why. (2) THE PASS NEVER HANDS A CARD A VENAL SECRET: the garrison commander who took "...inspection records for a fee" is a defect in the probe's admits: TRACED AND CURED before the merge; red: no card the pass moved ends with a secret on F5's venal list. (3) The 3 postmasters reached through title rows: accepted (they are narrow cards). (4) THE 20 SURVIVORS are named in the hand-back by office (prison warden 7, black marketeer 4, luxury merchant 2, seven singles) with the reason each has no admitted line; the black marketeer's is the trade, not the secret: left. (5) The two-tree tool: 0 non-string differences; the moved fields listed (secret, and the 5 personality and 1 goal lines explained or cured: a pass that walks a SECRET should not move a personality: say why it does)."

A-NARROW's probe (scratch of c727a4d17, the 300): narrow F5 139 -> 20; F5 1,019 -> 894; 130 cards moved in 91 towns (119
narrow + 11 others: 7 narrow at the pass but made warm-hearted later by `rankPowers`' yield, 3 principled postmasters via
title rows, 1 house boss whose yield no longer fires); fields: secret 130, personality 5, goal.long 1. SURVIVORS 20: prison
warden 7, black marketeer 4, luxury merchant 2, one each priest, bowyer, lord, chandler, dean, customs collector, brickmaker.
Files: `measures/page-6/f5/A-narrow-diff.txt`, `A-narrow-cards.txt` (ten narrow cards whole before/after). The probe's patch
lives only in the helper's scratch (`<scratch>/f5`); PAGE-8 rebuilds it from this description.

## 1. State

- Lane `lane/page-6-2026-11-20`, cut at 79710682d (PAGE-3's final tip) + docs. NOTHING under `src/`/`tests/` merged yet.
- Every gate and every push through `sh scripts/gate-mutex.sh --run -- …`, one at a time (the container restarted at 14:29
  with two builders' gates and a push hook at once). Pushes: `git ls-remote` first; push only if the remote differs;
  never commit on a branch while its push is in flight; check the push log for `npm run check` (never seen so far).
- Base births for the two-tree tool cached in this container's scratchpad `cw/` at d448de3a3 (src/tests = 79710682d);
  the tool: `node <scratch>/conf/trees.mjs <before> <after> <scratch>/cw --words=none` from the repo root (copied from
  origin `lane/names-3-2026-11-20` `docs/chair/2026-11-20/content/tools/confinement/`).
- Base reds at the lane commit (NOT ours): generatorGoldenMaster, espionageDormancyFence, nameHeldThroughAssembly,
  worldFactRederive (A7), rosterFinalUnderHeldRoster A1.

## 2. Builders, branches, what each owes

| unit | builder (Agent id) | worktree / branch | origin | state | owes |
|---|---|---|---|---|---|
| L2 | a6ab5a6b7f17fff6b | /home/user/wt-p6-l2, `page6/l2` (local tip 5b7eef5ee, 4 files uncommitted at 17:51: in progress) | `lane/page-6-2026-11-20-l2-wip` 41412e502 | cures in (the chair's 15:35 word); 3 pins re-pinned with cause; 10 anchors re-keyed | (1) `arrivalIndebtedDistrictTwin` D1 re-keyed AT FULL STRENGTH (my send-back: the re-recorded REST proved nothing), planted-redraw red; (2) the three fish twins (the chair, 17:13, text in §4); (3) full gates once more; then PAGE-6 reads the diff once, red/green, lighting + wiring censuses by their doors, the ONE `pool-dominance --tighten` (§3), merge |
| S9 | ae73aced757a438db | /home/user/wt-p6-s9, `page6/s9` (local tip befc73792, 5 files uncommitted: in progress) | `lane/page-6-2026-11-20-s9-wip` befc73792 | post-pass c727a4d17 (accepted design: the chair 16:11, ONE call line in `narrativeGenerator.js :: enrichNpcCoherence` + one import, both appended to existing lines; the chair resolves the join with the goals lane); `informantNoThievesGuild` re-keyed by cause befc73792 | the NO-MARKET GAP (the owner's own example): the merchants' rewrite to "households" runs before the pass, so a priest in a no-market town keeps a protection scheme (`r2r-village-12`): map the rewrite to its source row, settle, re-apply the rewrite, others byte for byte, or STOP and say why; then gates; then PAGE-6 reads and merges |
| F5 measure | a3bddcced2b36f92c | scratch only (`<scratch>/f5`) | reports on the lane: `measures/page-6/f5/` | arms A, B, C done (§3) | A-NARROW (A on the 139 only) + ten of the 139 whole before/after → to the chair, who then rules the cure |
| L4 | not dispatched | — | `lane/page-2-2026-11-20-s-wip` f2957d5be (L4 + the REFUSED old S9) | brief `L4-FINISH.md` amended (the nine mercy rows as fourth rows; register into S9's pass via `noteSecretSource(card, { rows: OFFICE_SECRETS[title], holderClass })`) | PAGE-8: dispatch after S9 merges |

## 3. Rulings in force (the chair)

- L2 lines: 73 approved + three changes (14:17); declarations, four rewordings, `colour: true` on livestock NEW[7] only
  (15:35); three fish twins (17:13). NAMED SURVIVOR: smiths dominant NEW[8]–[10] and livestock NEW[5]/[6] declare no
  `trade at work`; undrawn where the trade is short/stopped on the 720; left as their siblings are.
- `--tighten` (14:29): ONCE, on the lane, at L2's merge, by the integrator, cause in the commit ("76 approved lines appended
  to named pools"), every moved ceiling before/after here; STOP and tell the chair if any would LOOSEN.
- L4 rows: 23 of batch 1 + 7 reworked (all approved 14:17) + 9 mercy rows (14:37; the dean's: "Allowed a burial in
  consecrated ground that the rule forbids, because the family begged for it.").
- S9 order: S9 before L4; the guard after L4.
- S9 survivors (named, 16:11): 38 misfits keep their draw (the `economic_betrayal` pool is tagged trade/merchant
  throughout), 3 kept for a secret-bound presentation.
- F5 (17:13, 17:51): the owner is told S9/L4 leave it standing. PAGE-1's f5.mjs: 1,014/5,452 base; 1,019 after S9;
  1,019 projected after L4 (969 at best). Arms: A (secret side, all F5) 1,019→136, moves 902 secrets + 11 others; B
  (temperament side) →0, 1,031 temperaments, goals on 144 cards/79 towns; C narrow = principled 34, honest 35,
  incorruptible 34, plain-dealing 36 = 139. The chair's lean: only the 139 are a contradiction; cure on the secret side
  where another row exists; name survivors. Ruling after A-NARROW.
- ARRIVAL-LINES-2 (15:54, 15:58): after L2's merge; pools still shared on the 300 by size; lines to bring three-in-a-row
  under 10%, each with its law's word and its siblings' declarations from the start; the SIGHT-beat landmarks
  (`structuralValidator.js :: checkInstCompat`) IN SCOPE: said from the house that stands, several wordings by keyed hash
  (no new draw), new lines in their OWN NEW DATA FILE + ONE call line; lines to the chair first ("ARRIVAL-LINES-2 <commit>").
- SECRET-LINES (16:38): after L2 and S9; the secret on nearly every place ("Was present when # did something…", "Has been
  reading #'s correspondence…", stakes "Those they've sold out…"): its pool, lines held, cards drawn by size; lines that bring
  the commonest under ~15% of a size's places; a secret may propose a hidden fact, never name a house the place lacks nor an
  age or household the card may contradict; to the chair first ("SECRET-LINES <commit>"). Source: SAME-1's `OFF-LIST.md`
  (origin `lane/same-1-2026-11-20`, `docs/chair/2026-11-20/content/same/census/`).

## 4. Lines (all chair-read; files under `lines/`)

- `L2-LINES-TO-CHAIR.md` (the 76, by script), `L2-REDS-CLASSIFIED.md` (the 14 reds), `L4-SEVEN-TO-CHAIR.md`,
  `L4-MERCY-TO-CHAIR.md`.
- The three fish twins (approved 17:13), each `twinOf` its original, needs = the original's minus the fish keys:
  "Talk in {name} turns to fish sooner or later, and lately to how few there are." /
  "A gutting knife hangs by more than one doorway, and few of them have seen much use of late." /
  "The dogs here still run to meet anyone coming up from the water, and get little for it these days."

## 5. Measures (before → after)

| measure | before | after |
|---|---|---|
| arrival: two of three forges share a sentence (300) | 22.9% | 14.2% (L2 with cures, builder's; PAGE-6 re-runs at merge) |
| misfit secrets by calling (300) | clergy 9.8%, justice 9.9%, watch 1.1% | 4.5%, 7.7%, 0.4% (S9 c727a4d17, builder's) |
| principled + venal, S9's own test | 7 | 5 |
| principled + venal, PAGE-1's F5 | 1,014/5,452 | 1,019 after S9 |
