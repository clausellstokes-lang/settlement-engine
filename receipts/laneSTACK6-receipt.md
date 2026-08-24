# TE-STACK-6 receipt — LANDING seat (stack CH-5 + R3 onto slot 510c51b76)

STARTED 2026-08-24T12:44Z

Slot: claude/composite-r4 = 510c51b766a4ef329a697d61f3006e23d4fb2325 (58 cars, packets 177,
census 2525/366/2159/21017/5847, ratchet 11 of 29,044)
Cars: refs/preserve/holding-ch5 = 7f40d4454d0ec2fa79c3ca63a4521714849cad25 (3 commits, delta 0/0/0/0/0)
      refs/preserve/holding-r3  = 5efef38fad73c20135f585704df25b21ca8a1cd3 (2 commits, delta +0/+0/+0/+9/+1)
Disk at start: 18,761,356 KB free on /

## RESUME POINT
DONE: refs verified, disk checked.
NEXT: worktree add laneSTACK6-tree @ slot, npm ci.
CMD: git -C /Users/cstokes/Desktop/settlement-engine worktree add <tree> 510c51b76 && npm ci

## §1 STACK BUILT + REGISTERED (12:44–13:00Z)
Stack tip (pre-registration) `c861f6c4c` = CH-5 tip 7f40d4454 (3 commits verbatim, NOT rebased)
+ cherry-pick of R3's 264225618, 5efef38fa. Zero conflicts.
SUM PROOF: file sets disjoint (OVERLAP_COUNT=0); every R3 file byte-identical to 5efef38fa;
every CH-5 file byte-identical to 7f40d4454; added-over-CH5 set == R3's file set exactly.

PACKET SURFACE — the brief's premise is FALSE: **MF-CH3 is STILL DRAFT** at the slot and at the
stacked tip (verifiedBase 86794b5d2, two slots behind). Only 2 non-terminal packets exist
(MF-CH3, MF-CG2). Executed both ways:
  - mint MF-CH5 at DRAFT  -> TRUE_EXIT=1, exactly 9 `duplicate change path across packets`, all (MF-CH3, MF-CH5)
  - mint MF-CH5 at LANDED -> TRUE_EXIT=0, `valid: 179 packets (0 READY)`
JUDGMENT: minted at LANDED (same act AIP-2 took in the sibling car). Three places stamped.
Two departures from the prepared entry: status LANDED not DRAFT; INDEX row given its FIFTH cell.
Registration commit **c3289244d58b7259205d80594856e8e0cc520817** = STACK TIP.
Packet counts re-derived by execution: 177 slot -> 178 pre-registration -> 179 tip.

## RESUME POINT
DONE: stack built, sum-proved, MF-CH5 registered at LANDED, committed at c3289244d, tree clean.
NEXT: re-execute both cars' declared digests at the tip, then the FULL gate.
CMD: npm run check:tail  (BARE, fresh shell, ; echo TRUE_EXIT=$?)

## §2 DIGESTS RE-EXECUTED AT THE STACKED TIP c3289244d (12:52–12:56Z)
CH-5 declared shift — RE-EXECUTED, HOLDS: base 510c51b76 -> tip fixture differential is
CHANGED **187** / ADDED **0** / REMOVED **0** of 525, key order identical.
  control: CH-5-tip -> stack-tip differential is 0 rows (R3 moves no generator input).
  TOTALITY: `every config produces byte-identical output to the golden master` regenerates all
  525 at the tip and passed — 0 drift.
R3 declared payload — RE-EXECUTED, HOLDS on count and total: 46 files under public/, TOTAL BYTE
DELTA **+71,229** (declared +71,229). Two independent instruments (per-file `cat-file -s`, and
`git ls-tree -r -l`) agree.
  ⚠ ONE PROSE FIGURE IS OFF BY ONE, and it is NOT the digest: AIP-2.md:194 declares the per-file
  range "between +1,489 and +1,606"; execution reads **1,488 .. 1,606**, the minimum being
  public/media/journey-legs/bg/leg-5-town-to-city.mp4. Exactly one file falls below the stated
  floor. NOT EDITED — see judgment J-S6-3.
BOTH INSTRUMENTS PROVED LIVE by deliberate mutation: one hex char of one of the 525 golden
hashes, and one `require` marker string in the provenance register -> 2 failed / 30 passed of 32,
TRUE_EXIT=1, each plant redding its OWN arm and no other. Both restored cmp-exact (md5
5f28b27416e75c1158cde7f4e751dc5d / d2328171c5fefbe078e16fe6d9c29e61), tree clean.

## RESUME POINT
DONE: stack, registration (c3289244d), both digests re-executed + proved live, FULL GATE running.
GATE LOG (found by grepping MY worktree path, not mtime):
  /var/folders/0l/_sz6gzvd11x6sthjy1jdj0_80000gp/T/gate-tail.15157.log
NEXT: finish gate; then census per-car attribution + the three parking/figure plants.

## §3 READ-ONLY CORROBORATION (13:00Z) — a THIRD instrument on each car's title delta
Source-line diff of every test file each car touches, slot -> tip:
  CH-5: **ZERO** added/removed `it(`/`test(`/`describe(` lines. The only title lines that move are
        TWO RENAMES in magicLicenceCensus.walker.test.js (A5 and A8). Net +0 titles / +0 suites —
        which is the mechanism behind its 0/0/0/0/0 delta, visible in the source.
  R3:   **+11** added `it(` lines, **-2** removed (renames) = **net +9**; **+1** `describe(` = +1
        suite title. Exactly the declared +9/+1, from an instrument independent of both the
        walker and the runtime count.
PACKET/DIFF CORRESPONDENCE: MF-CH5 declares 17 paths and touches exactly 17 — no undeclared path,
no declared-but-untouched path. AIP-2 declares 50 and touches 53; the three extra are its own
registration artifacts (INDEX.md, PACKET_MANIFEST.json, AIP-2.md), and 139 of the estate's 179
packets likewise do not self-declare, so this is the convention and not a defect.
MF-CH2B UNTOUCHED, verified: Status DRAFT, absent from the manifest, 0 INDEX rows, byte-identical
to the slot.
GATE PHASES SO FAR (from my own log, located by worktree-path grep):
  [hazard-registry] OK — 29 class(es) ... floor 27.
  [premortem] SELF-CHECK OK — 28 predicates ...
  [implementation-packets] valid: 179 packets (0 READY)
  [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
  [domain-strict] OK — no strict-type regressions (1134 errors, ceiling 1134).
  lint: 29 problems (0 errors, 29 warnings)
  test:ratchet — RUNNING

## §4 ⚠⚠ FINDING FOR THE CHAIR — MF-CH3 IS A LANDED CAR WEARING A DRAFT PACKET
The brief said MF-CH3 "landed with the fifth stack". Half true, and the half that is false is the
half that matters. Measured at the slot:
  - **MF-CH3's CODE IS LANDED.** 18 CH-3 commits are ancestors of 510c51b76 (308c7ee0d,
    31445ad90, db649552b, 216f579a3, da2c7085c, 7d1c2187e all `--is-ancestor` true). Its one
    CREATE row, tests/lint/catalogTierGateParity.walker.test.js, EXISTS at the slot. Of its 22
    changeManifest rows, **18 moved between its own verifiedBase and the slot** — every MODIFY,
    every DOC and the CREATE. The only four that did not are its four `TEST`-action rows, which
    name tests it is checked against rather than files it edits.
  - **ITS PACKET STILL READS DRAFT** in all three places, with verifiedBase 86794b5d2 — two
    landings behind (23 commits).
CONSEQUENCE: the nine change paths it reserves are a reservation over work that ALREADY SHIPPED,
and that stale reservation is the ONLY reason MF-CH5 could not mint at DRAFT. It also means
MF-CH3's own figures are stale: **all nine** of the paths it contests have since been moved again
by CH-5.
NOT ACTED ON. A three-place flip on MF-CH3 is a landing act on TE-CH-3's car — it needs that
lane's acceptance arms certified and its verifiedBase re-stamped, exactly the reason hazard 6
forbids touching MF-CH2B. Handed to the chair.

## §5 THE GATE — GREEN at c3289244d (12:57–13:10Z), verbatim
    [implementation-packets] valid: 179 packets (0 READY)
    [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    [domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
    ✖ 29 problems (0 errors, 29 warnings)
    [test-ratchet] OK — no test regressions (11 known failure(s) of 29044 tests, ceiling 11).
    [prerender] wrote 314 static route documents (13 views + 15 gallery hubs + 286 compendium entries) under dist/
    [test-ratchet] STRICT DIST OK — 53 discovered/reported file(s), 467 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.
    [gate-tail] full log: /var/folders/0l/_sz6gzvd11x6sthjy1jdj0_80000gp/T//gate-tail.15157.log
    [gate-tail] exit: 0 (the gate's own status, not a pipe's)
    TRUE_EXIT=0
FREE DISK at end: 17,861,816 KB on / (~17.0 GB; floor is 300 MB).
STRICT DIST is the phase R3's titles land in: **458 -> 467 over an unchanged 53 files**, exactly
as declared. The SOURCE ratchet is UNMOVED at 11/29,044 because SOURCE_TEST_EXCLUDE='tests/build/**'.

## §6 CENSUS — tuple, per-car attribution, and per-figure liveness
TUPLE AT THE TIP, asserted by the walker inside the gate:
    files: 2525, parked: 366, credited: 2159, titles: 21026, suiteTitles: 5848
That is the PREDICTED value, and it was TESTED rather than targeted. Clean control: 1 passed,
CENSUS_TRUE_EXIT=0.
PER-CAR ATTRIBUTION (each an executed control on the census arm):
  CH-5 = **0/0/0/0/0**. Slot copies of ALL FOUR test files it touches, tuple left at the stacked
    value -> GREEN. Reverting the whole of CH-5's test surface moves no figure.
  R3   = **+0/+0/+0/+9/+1**. Slot copy of its ONE test file + tuple pinned to 21017/5847 -> GREEN.
  NO-OP GUARD on that revert: same revert with the tuple LEFT at 21026 -> RED, verbatim
    `expected 21017 to be 21026`. So removing R3's one file lands the WALKED titles on the slot
    value to the digit — the guard and the measurement in one.
  ARITHMETIC CLOSES: 21017 + 0 + 9 = 21026, and 366 + 2159 = 2525.
PER-FIGURE LIVENESS of the three figures NEITHER car moves — each plant reds its OWN arm with the
WALKED value, so none of them is a dead assertion:
  files    NEW parked test file            -> `expected 2526 to be 2525`
  parked   an existing credited file parked -> `expected 367 to be 366`
  credited CENSUS.credited nudged to 2160   -> `expected 2159 to be 2160`
All plants restored; tree clean; HEAD c3289244d unchanged.

## §7 PIN
    refs/preserve/holding-stack6 = c3289244d58b7259205d80594856e8e0cc520817
No CAS, no pin deletion, no push.

## RESUME POINT — LANE COMPLETE
Nothing outstanding. Worktree left in place at .../scratchpad/laneSTACK6-tree (clean, detached at
the pinned tip) with its own node_modules.
