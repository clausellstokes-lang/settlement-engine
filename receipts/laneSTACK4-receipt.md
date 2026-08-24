# TE-STACK-4 receipt — LANDING seat (stacked: TE-AIP-1 + MF-CH2B)

STARTED 2026-08-24. Slot 79b78881ca86612ec312602c2e3dc6d06aa34df8.
Worktree: scratchpad/laneSTACK4-tree (detached; node_modules symlinked to the repo's).
Disk at start 19,281,872 KB free; before the gate 17,900,092 KB.

## STACK TIP: 86794b5d2480d6bf7821aa390a82f99f4babeeca  ✅ GATE GREEN
## PINNED AT: refs/preserve/holding-stack4
    86794b5d2  TE-AIP-1 + MF-CH2B LANDED at slot 79b78881c: two cars, one gate — ...  (landing act)
    e6102e1e0  MF-CH2B: the packet — DRAFT, not READY, and one ruling decides it       (car 2)
    7d93a93db  TE-AIP-1: the AI-media provenance floor — ...                           (car 1)

## RESUME POINT
- DONE: both rebases + resolutions + content proofs + census re-walk + five per-figure
  controls + the three-ratchet check + landing commit 911c8ebe1.
- IN FLIGHT: the FULL GATE at 911c8ebe1 — `npm run check:tail` run BARE (never inside
  gate-mutex: `test:ratchet`, `test` and `verify:dist` each acquire the mutex themselves,
  so wrapping `check` self-deadlocks). Log: scratchpad/S4-GATE.log, which ends with
  `TRUE_EXIT=` and a DISK AFTER line.
- NEXT: read the gate lines out of S4-GATE.log; if green, amend 911c8ebe1's MESSAGE ONLY to
  add the gate paragraph and prove `<old>^{tree}` == `<new>^{tree}` so the gated tree is the
  shipped tree. Then report.
- CMD: tail -60 scratchpad/S4-GATE.log

## Rebases — completion proved explicitly, never through a pipe
- HOP 1 car 1: `git rebase --onto 79b78881c 567030f1d` from detached 08f39dba4.
  Two conflicts. `git rebase --continue` exit 0; no `.git/worktrees/laneSTACK4-tree/rebase-merge`
  and no `rebase-apply` (both `ls` exit 1); `git status --porcelain` free of UU/AA/DD/AU/UA/DU/UD
  (grep -c = 0); `git rev-list --count 79b78881c..HEAD` = 1. Result 7d93a93db.
- HOP 2 car 2: `git rebase --onto 7d93a93db 70bb64f23` from detached 2ccb20d59. Exit 0, clean,
  no rebase dirs, rev-list count 2. Result e6102e1e0.
  ⚠ car 2's parent 70bb64f23 is NOT an ancestor of the slot (`merge-base --is-ancestor` exit 1);
  `--onto` replays the single commit correctly regardless.

## Content preservation (hazard 5)
- Byte-identical blobs after the rebase: scripts/ai-media-provenance.json (32f3039b1),
  tests/build/aiMediaProvenance.test.js (a9aea3940), scripts/optimize-backgrounds.mjs
  (c0a3d2e4e), scripts/optimize-landing-backgrounds.mjs (5760b502b), and car 2's packet
  docs/implementation/packets/catalog-hygiene/MF-CH2B.md (9cbff9937).
- The two notices files differ from the holding by design (resolution 2 below) and the moved
  prose was proved identical modulo the section number: 2,172 bytes (md) and 2,463 bytes (html)
  on both sides, each equality run again with a one-character mutation that returned false.
- The walker is dropped from car 1 entirely; numstat 42/1 -> 41/0 (md) and 9/1 -> 8/0 (html) and
  the arithmetic closes — the removed line each side was the heading car 1 renumbered.

## The two conflict resolutions
1. CENSUS ROW -> SLOT side (dropped). §417/§420: the row belongs to the landing act. Resolved
   file cmp 0 against the slot blob, with a one-byte probe proving the cmp was live (exit 1).
2. NOTICES PAIR. ⚠⚠ `THIRD-PARTY-NOTICES.md` AUTO-MERGED WITH NO CONFLICT INTO A BROKEN
   DOCUMENT — two `## 6.` headings, because the slot added "6. Art and media served from the
   app origin" while car 1 had renumbered "Keeping this current" from 5 to 6. Only the HTML
   twin conflicted. Resolved by appending car 1's section as SECTION 7 and touching no
   existing section: the slot's rewritten "Keeping this current" is not regressed to car 1's
   older copy and the cross-reference "§1.7 and §6" stays valid. No test pins section numbers
   (checked thirdPartyNoticesPage, shippedAssetLicence, aiMediaProvenance).

## Census — base + sum of deltas (§420), walked once at the stacked tree
    SLOT 79b78881c   2523 / 366 / 2157 / 20982 / 5840   (= the walker's committed tuple: the lift is CALIBRATED)
    CAR1 7d93a93db   2524 / 366 / 2158 / 21002 / 5845
    TIP  e6102e1e0   2524 / 366 / 2158 / 21002 / 5845
    CAR 1 (TE-AIP-1) delta  +1 / +0 / +1 / +20 / +5   ONE file, tests/build/aiMediaProvenance.test.js
                                                       (20 titles, 5 suite titles, parkReasons [])
    CAR 2 (MF-CH2B)  delta  +0 / +0 / +0 / +0 / +0    MEASURED (0 per-file rows changed)
    366 + 2158 = 2524. Recorded tuple at the tip: files 2524, parked 366, credited 2158,
    titles 21002, suiteTitles 5845.
- Method: the walker's classifier (lines 485-1400) LIFTED out of vitest and run under plain
  node with S4_ROOT, giving per-file attribution a walk cannot. Copy kept at
  scratchpad/S4-lifted-census-classifier.mjs.txt. Per-file dumps: S4-pf-{slot,car1,tip}.json.
- Car 2's zero is non-vacuous: planting a 2-title/1-suite test file under tests/docs moved the
  tuple to 2525/366/2159/21004/5846; planting a PARKING file (reason OPENER_UNRESOLVED:it)
  moved parked to 367. Both removed, both restorations exact.

## Five negative controls — ONE PER FIGURE, each red on its own figure (verbatim)
CLEAN: 33 passed of 33, exit 0. md5 before and after both 2ffd1217d22e0366d0b3319163a935bb;
each substitution hash-guarded to abort on a no-op; final cmp exit 0.
- FILES     expected 2524 to be 2523   ("the estate's file count moved — re-measure, do not re-word")
- PARKED    expected 366 to be 365     (live on the figure that did NOT move)
- CREDITED  expected 2158 to be 2157
- TITLES    expected 21002 to be 20982 (= the SLOT value: car 1's WHOLE title delta removed
                                        while every file figure stays correct, so the red
                                        cannot land on `files`)
- SUITE     expected 5845 to be 5840   (likewise; proves the LAST assertion is reachable)

## The three ratchets (hazard 4) — checked AT the stack tip
`tests/lint/sovereigntyLightingContract.walker.test.js`, `negativeAssertionAnchor.walker`,
`mutationCoverageManifest`, `controlBytes`, `thirdPartyNoticesPage`, `aiMediaProvenance`:
6 files passed, 103 tests passed, exit 0.
⭐ THE THIRD RATCHET DOES NOT FIRE, AND IT IS MEASURED. tests/lint/mutationCoverage.shared.mjs
enumerates the seven ENFORCER DIRS plus basenames carrying invariant nomenclature;
`tests/build/aiMediaProvenance.test.js` is in neither set. DIFFERENTIAL PROBE, not a reading:
the same trivial probe file under tests/lint/ REDS "TOTALITY: every enumerated invariant file
has a manifest entry" naming itself; under tests/build/ it does not (8 of 8 green); and the
arm is 8 of 8 green again once removed. So no mutation-coverage-manifest entry is owed.

## Judgment calls
- J1 PACKET NOT REGISTERED. The MF-CH2B document lands alone: no PACKET_MANIFEST.json row, no
  INDEX.md row, packet surface stays 175 / 0 READY. (a) the validator asserts `requiredSymbols`
  at EVERY status by its own recorded design and MF-CH2B's symbols do not exist at this tip
  because its car is HELD; (b) a non-terminal row RESERVES its change paths estate-wide — the
  five gate files and the generator golden — which would block other lanes for as long as the
  CH-5 ruling takes; (c) the validator has no orphan-packet-file arm (joins are manifest->index
  and index->manifest only), so the document is validator-neutral. Precedent: TE-STACK-3 landed
  175 where 176 was predicted, for the same "this car carries no packet row" reason.
  ⭐ CHAIR MAY OVERTURN — minting the DRAFT row is a one-file edit once CH-5 is ruled.
- J2 NOTICES SECTION 7. See resolution 2. The alternative (renumber Keeping-this-current to 7)
  was rejected: it churns cross-references and risks regressing the slot's newer prose.
- J3 MEMBER COMMIT BODIES LEFT UNAMENDED. Car 1's body still says "a new section 5" and quotes
  a census walked at 567030f1d. Both are now wrong at this tip. Rewriting a member's own record
  is worse than annotating it, so the landing commit states both corrections instead — the same
  shape the previous landing used.
- J4 STATUS UNTOUCHED. MF-CH2B stays DRAFT; not flipped to READY, and its held code is not landed.

## Do-not list honoured
No CAS of the build ref, no pin deleted, no push, no sub-agent spawned, no `git add -A/-u/.`
(every stage was an explicit path list).

## Gate lines captured so far (run in flight at 911c8ebe1)
    [hazard-registry] OK — 29 class(es): MACHINERY 12, PARTIAL 11, DOCUMENT 6, ACCEPTED 0.
                      DOCUMENT 6/6, OWED 17/18 (shrink-only), MACHINERY 12/9 (grow-only), floor 27.
    [premortem] SELF-CHECK OK — 28 predicates ... 23/29 registry classes routed to a trigger.
    [implementation-packets] valid: 175 packets (0 READY)      <- unchanged from the slot (J1)
    [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    [domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
    lint: ✖ 29 problems (0 errors, 29 warnings)
    test:ratchet / build / verify:dist — still running.

## Extra proofs banked while the gate ran
- DISJOINTNESS: car 1 names 6 paths, car 2 names 1, union at tip 7, `comm -12` intersection
  EMPTY; the instrument proved live by self-intersecting car 1's list (returns 6).
- NO MINT TRIGGER: no package.json / package-lock / deno.json byte change anywhere in the
  stack; no `src/`, no `supabase/`, no migration. Eight files total.
- THE CHOKEPOINT SURVIVED THE REBASE: `.keepMetadata()` appears 3x in each optimiser at the
  tip and 0x in each at the slot.
- NAKED-CLAIM DEBT: the exact CLAIM_RE run over both changed .md files returns ZERO hits in
  each (THIRD-PARTY-NOTICES.md and MF-CH2B.md), with a probe string proving the scanner fires.
  So `enforcement-claims`' per-claim FROZEN_NAKED arm — a GREEN test, not banked — stays green.
- MEMORY: the lane's durable findings are banked at
  memory/fourth-stack-the-automerge-trap-and-the-scoped-third-ratchet.md. The shared MEMORY.md
  INDEX was deliberately NOT touched — it has concurrent writers and is the chair's surface;
  the chair should add the index row.

## ⛔ GATE RUN 1 — RED, AND THE CAUSE IS THE ENVIRONMENT, NOT THE STACK
    TRUE_EXIT=1
    [gate-tail] exit: 1 (the gate's own status, not a pipe's)
    DISK AFTER: 16,928,464 KB free
`test:ratchet` fired the SCOPE SENTINEL over TWO suites that produced no measurable test:
    tests/security/customContentLockOrder.postgres.test.js — Cannot find package 'pg'
    tests/ui/townSceneCanvas.contract.test.jsx — Failed to resolve import "three"
ROOT CAUSE: LANE-LAW §1's `ln -s <repo>/node_modules` pointed every lane at a tree last
written 2026-07-16 and built from a 36-dependency manifest, while the SLOT's package.json
declares 40 — `three`, `pg`, `@types/node` and `espree` are slot-only. The chair has since
corrected LANE-LAW §1 to forbid the symlink.

ATTRIBUTED BY EXECUTION, not by argument, and INDEPENDENTLY of the chair's diagnosis:
- All five relevant blobs are IDENTICAL between the slot and my tip — both failing test
  files, the importing `src/components/townMap/scene3d/TownSceneCanvas.jsx`, `package.json`
  AND `package-lock.json`. My stack touches none of them.
- A fresh SLOT baseproof worktree (scratchpad/laneSTACK4-slotproof at 79b78881c, same
  symlink) running exactly those two files returns `TRUE_EXIT=1` with the IDENTICAL two
  errors and `Test Files 2 failed (2) / Tests no tests`. So the SLOT ITSELF was not gateable
  on this box; nothing in the stack caused it.
- `three` and `pg` were absent from the shared tree's own `.package-lock.json` (574 entries),
  and both entered package.json at a88be4f11 — long before this slot.

## CURE APPLIED IN MY WORKTREE ONLY
    rm -f node_modules            # a symlink: removes the LINK, and the shared target was
                                  # verified intact afterwards at 434 entries
    npm ci --no-audit --no-fund   # exit 0, "added 589 packages in 5s"
`pg` and `three` now resolve; 468 top-level entries; `git status --porcelain` EMPTY (a real
directory matches .gitignore's `node_modules/`, which the symlink did not — that is why the
symlink used to show as `??`); HEAD unchanged at 911c8ebe1.
⚠ `npm ci` ran the `prepare` script, so this worktree NOW HAS a `.husky/_` shim — commits
from here no longer bypass pre-commit. That reverses the LANE-LAW §1 warning for this tree.

## GATE RUN 2 — in flight at 911c8ebe1, log scratchpad/S4-GATE2.log

## ✅ GATE RUN 2 — GREEN. VERBATIM.
    [hazard-registry] OK — 29 class(es): MACHINERY 12, PARTIAL 11, DOCUMENT 6, ACCEPTED 0.
    [premortem] SELF-CHECK OK — 28 predicates ... 6 uncovered and each explicitly exempted.
    [implementation-packets] valid: 175 packets (0 READY)
    [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    [domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
    ✖ 29 problems (0 errors, 29 warnings)
    [test-ratchet] OK — no test regressions (11 known failure(s) of 29029 tests, ceiling 11).
    [prerender] wrote 314 static route documents under dist/
    [test-ratchet] STRICT DIST OK — 53 discovered/reported file(s), 458 test(s), zero
      failed/non-run/uncollected/missing/extra/duplicate rows.
    [gate-tail] exit: 0 (the gate's own status, not a pipe's)
    TRUE_EXIT=0
    DISK AFTER: /dev/disk3s1s1 239362496 12929512 14234244 48% ... /   (14,234,244 KB free)
    GATE2 END 2026-08-24T08:29:55Z
LANE-LAW §2 GREEN on all three: TRUE_EXIT=0 AND [gate-tail] exit: 0 AND free disk 14,234,244 KB
>= 300 MB. And it is a VERDICT, not a bare exit code: 29,029 tests collected, 11 known failures
against a ceiling of 11 — the banked eleven exactly, none of them this stack's. Both the test
total and the ceiling reproduce LANE-LAW's stated slot figures exactly, which is independent
evidence that the repaired worktree now matches the chair's reference environment.

## FINAL TIP AND THE TREE-IDENTITY PROOF
The gate ran at 911c8ebe1. Its message was then amended ONLY to add the gate paragraph above,
producing 86794b5d2480d6bf7821aa390a82f99f4babeeca. THE GATED TREE IS THE SHIPPED TREE:
    gated tree   3f23dd463c183640cf23eea2921f32f1890b72b3
    shipped tree 3f23dd463c183640cf23eea2921f32f1890b72b3   IDENTICAL
compared with a probe showing a wrong hash compares unequal. The amend ran pre-commit (this
worktree has a husky shim since `npm ci`) and lint-staged reported "could not find any staged
files" — a no-op, which the tree identity independently confirms.

## REF STATE AT HANDOFF (nothing of the chair's was touched)
    refs/preserve/holding-stack4 -> 86794b5d2480d6bf7821aa390a82f99f4babeeca   (mine, new)
    claude/composite-r4          -> 79b78881ca86612ec312602c2e3dc6d06aa34df8   (UNMOVED, not CAS'd)
    refs/preserve/holding-aip1   -> 08f39dba4ec2bc3ca7508375f0f0a9e98f18e13f   (untouched)
    refs/preserve/holding-ch2    -> 2ccb20d598c93a263f9bd48a9c86a92264d1a81e   (untouched)
No push. No pin deleted. No sub-agent. No `git add -A/-u/.`.

## LEFT BEHIND FOR THE CHAIR
- scratchpad/laneSTACK4-tree — the stack, WITH a real `npm ci` node_modules (468 entries).
- scratchpad/laneSTACK4-slotproof — the slot baseproof worktree, still on the BROKEN symlink;
  it is the evidence for the run-1 attribution. Remove it (and reclaim ~700 MB) when done:
  `git -C <repo> worktree remove --force <path>`.
- scratchpad/S4-GATE.log (red run 1), S4-GATE2.log (green run 2), S4-pf-{slot,car1,tip}.json,
  S4-lifted-census-classifier.mjs.txt, S4-orig-{aip1,ch2}.diff.
- memory/fourth-stack-the-automerge-trap-and-the-scoped-third-ratchet.md — five durable
  findings. The shared MEMORY.md INDEX was deliberately NOT edited (concurrent writers, the
  chair's surface); it needs an index row pointing at that file.

## CORRECTION TO THE CHAIR'S three.module OBSERVATION (checked, not inherited)
The chair read run 1's ZERO occurrences of `three.module` as evidence that this box "was
previously producing a dist missing the 3D scene entirely". That inference is NOT supported.
RUN 1 NEVER REACHED THE BUILD. `check` is an `&&` chain and `test:ratchet` precedes `build`;
the sentinel killed the chain there. Measured over both logs:
    pattern                          run1   run2
    settlementforge@1.0.0 build        0      1
    vite build                         0      1
    built in                           0      1
    three.module                       0      1
    settlementforge@1.0.0 postbuild    0      1
Run 1's last lifecycle line is `> settlementforge@1.0.0 test:ratchet`. It produced NO dist at
all, so it says nothing about what a dist would have contained. And an unresolved bare import
is a hard rollup resolve error, so a build under the broken tree would most likely have
ERRORED rather than silently emitting a 3D-less bundle.
CONFIRMED, on the substantive point: `tests/lint/sizeBaseline.test.js` walks `src/` and freezes
per-file max-lines (EFFECTIVE LINES, not bytes); its baseline holds 16 entries and ZERO `dist/`
keys, so it cannot see a dist chunk. The chair's reading is right.
⭐ BUT THE CHUNK IS NOT UNGUARDED. `tests/build/townScene3dLazy.test.js` pins the emitted chunk
BY NAME — `const THREE_CHUNK_RE = /^three\.module-[A-Za-z0-9_-]+\.js$/` — and it runs in the
dist phase, which reported `zero failed/non-run/uncollected/missing/extra/duplicate rows` over
53 files / 458 tests. "non-run" and "missing" both zero means that guard genuinely executed and
passed. So the 3D chunk's presence and laziness ARE enforced; what is unenforced is only its
BYTE SIZE. Nothing trips, and I agree no ratchet needs re-recording.

## ✅ COLLECTED BY THE CHAIR — LANE CLOSED
Verified 2026-08-24 after the collection (not assumed — the pins and worktree vanishing is what
prompted the check):
    claude/composite-r4  ->  86794b5d2480d6bf7821aa390a82f99f4babeeca   (was 79b78881c)
    slot tree            ->  3f23dd463c183640cf23eea2921f32f1890b72b3   = MY GATED TREE, exact
    all three commits are ancestors of the new slot; 79b78881c still an ancestor;
    control: the pre-rebase holding 2ccb20d59 is correctly NOT an ancestor.
Standing at the landed slot: census row `files: 2524, parked: 366, credited: 2158,
titles: 21002, suiteTitles: 5845`; packet surface 175 (LANDED 174 / SUPERSEDED 1), MF-CH2B
NOT registered and its document present at `Status: DRAFT` — J1 and J4 both landed as decided.
Both my worktrees (laneSTACK4-tree, laneSTACK4-slotproof) have been removed by the chair and
refs/preserve/{holding-stack4,holding-aip1,holding-ch2} are gone. All nine evidence artifacts
in this scratchpad survive.

## THE ONE THING STILL OWED, AND IT IS NOT MINE TO DO
memory/fourth-stack-the-automerge-trap-and-the-scoped-third-ratchet.md is an ORPHAN: it has no
row in MEMORY.md. I did not add one on purpose — the index has concurrent writers and a ~17KB
hard read limit where a careless append is the documented failure mode, and it is the chair's
surface. It needs a row under "Live program hazards".
