---
name: fp-cycle1-serialized-landing-and-cq5-row-guard
description: "2026-08-04 — FP cycle 1 LANDED (93c118b6/caab995a/b441bca5/d1cfdb67); the CQ5 collision's cure is the constructed-blob serialized landing, and the flag law's uncaught shape is MANIFESTED-PLUS-PENDING, not manifested-without-a-row"
metadata: 
  node_type: memory
  type: project
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-06T10:24:56.179Z
---

# FP CYCLE 1 IS LANDED, AND THE CQ5 DEADLOCK HAS A RECIPE

**State (2026-08-04, branch `claude/composite-r4`, worktree minifold).** The
CQ5 × parallel-lane collision recorded in
[cq5-flag-law-collides-with-parallel-lanes](cq5-flag-law-collides-with-parallel-lanes.md)
is CLEARED. Four commits on top of TR-1's d7ea69a4:

- `93c118b6` TR-1 red repair (the casus certification row + the walker's new direction 3)
- `caab995a` GR-1 the oath-holder identity, whole
- `b441bca5` GR-0 the lifecycle voice, whole
- `d1cfdb67` GR-0's premium-census row (found by the post-landing whole-suite diff)

Tree clean; whole `tests/lint` returns the base's 19 failing rows with the set
difference EMPTY both ways (19 fail / 888 pass at d7ea69a4 → 19 fail / 926 pass at
d1cfdb67); `typecheck:domain:strict` 1313/1313 at every commit.

## THE LANDING RECIPE (use this whenever N lanes share files in one tree)

Serialize, and stage **constructed blobs** — never a pathspec commit of a shared file:

1. Build the intended content in a scratch dir: either `git show HEAD:path` **plus**
   this lane's rows, or the worktree copy **minus** the other lanes' rows (anchored,
   fail-loud line ranges — a missing or ambiguous anchor must abort).
2. `SHA=$(git hash-object -w <constructed>)` then
   `git update-index --cacheinfo 100644,$SHA,<path>`. This writes the INDEX ONLY; the
   worktree is never touched (verify md5 before == after).
3. `git add` only the files this lane owns outright.
4. **Prove the index, not the worktree**: `TREE=$(git write-tree)`, then
   `git archive $TREE | tar -x -C <tmp>`, symlink `node_modules`, and run the gates
   THERE. A worktree run proves the union of every lane, which is not what ships.
5. `git commit --no-verify -F <msgfile>` with lint-staged's sole action
   (`eslint --fix` over the staged set) executed by hand — its partially-staged path
   performs an internal `git stash` and other lanes' unlanded work is in the tree.

Scripts as landed: `fp1-land-apply-casus.py` (add rows to a pristine blob) and
`fp1-land-strip-gr0.py` (subtract a lane's rows from the worktree copy).

## ⚠⚠ THE FLAG LAW'S UNCAUGHT SHAPE IS NOT THE OBVIOUS ONE

`tests/lint/engineGatedRuleKeys.walker.test.js` now carries **direction 3**, and the
first design of it was written, mutated, and REFUTED before it landed:

- **Manifested with NO row and NO pending entry is ALREADY CAUGHT** — by
  `subsystemCertificationTotality.walker` ("uncertified rule keys: <key>"), because the
  manifest is what grows the census. Executed: deleting the casus row from a clean tree
  reds the totality walker while `engineGatedRuleKeys` stays green. A guard of the form
  "a row OR a pending entry" would have been theatre.
- **The real hole is MANIFESTED *plus* PARKED AS PENDING in another lane file.** That
  partition is legal, so the totality walker passes; the virtual lane's own contract
  (`tests/domain/subsystemRowsVirtual.test.js`) forbids it, so a DOMAIN suite reds while
  every lint walker a lane would think to run stays green. TR-1 shipped exactly that at
  d7ea69a4.

Direction 3 therefore measures the law as the virtual lane states it: every manifest
member is authored in `VIRTUAL_SUBSYSTEM_ROWS` **and** stands in no lane's pending list
(`manifestWithoutRow` + `manifestStillPending`). Proven by running the new walker over an
unrepaired archive of d7ea69a4 — it reds naming `casusCommerciiEnabled` on both arms,
while the old walker plus the totality walker pass 12/12 on that same tree.

**Ruling banked:** DESIGN_FP_ARCH_TR.md §6's Q4 ("TRADE flags land pending, TR-9 converts
all eight at once") is SUPERSEDED for any flag that manifests. A flag may land pending,
but then it does not join `ENGINE_GATED_VIRTUAL_RULE_KEYS` yet.

## HOW TO APPLY

Before landing any flag wave: run `tests/domain/subsystemRowsVirtual.test.js`, not only
the two lint walkers. Before believing any new structural guard: build the *actual*
defect shape that shipped and check the guard reds on it — and check the guards that
already existed do not, or the new one is decoration.

## THE CLOSE ARC (2026-08-05, appended by the chair)

v1r2 = **PASS** with ONE repair owed: mutant C2 (delete the prevLedger arm
of the crossing guard, peaceTerms.js ~716) survives — the pin at
treatyLifecycleVoice.test.js ~333 is VACUOUS (never drives the arm). The
shipped guard is correct; only the test moves. w (cycle close) = **REJECT**
on ONE blocker, CR-FP-11: couplingInclusion.walker's frozen LAYER_PATTERNS
makes any module matching NO family prefix invisible on BOTH sides —
NINE of the cycle's ten new leaves unwatched (all commercial*, oathHolder,
grammarNews, grammarReceiptPools, bandFamilies, bandedStock; only
treatyLifecycleVoice has a home via the treaty prefix). PROVEN by matched
pair: a WAR import appended to commercialReasons.js is SILENT; the same
line in treatyLifecycleVoice.js reds. RULED both arms: extend
LAYER_PATTERNS + floors AND an unlayered-module census (shrink-only
baseline) + the CANNOT-CATCH doc clause. Everything else at close was
clean: lint rows byte-identical both directions, strict 1313, build + 314
routes + smoke:boot PASS, a 110-tick all-dark TWO-LIFETIME pulse (8-year
instrument survives the window, 1-year lapses inside it — a single
lifetime proves one lane and blinds the other) with world state
byte-identical. Close repairs + CR-FP-1 (desk authority-routing) +
CR-FP-2 (proseNumerics re-record) executing in run wf_4ac35381-06e.

**Disclosures that will read as bugs later, and are not:** GR-0 LIT
displaces ranked wizardNews entries (fixed-capacity feed doing its job —
a whole-projection lit-vs-dark hash is the WRONG instrument for feed
surfaces); TR-1's lit path is STRUCTURALLY UNREACHABLE until a later wave
wires advanceCommercialReasons (its cert row says so); THREE flags this
cycle, not four. **Still open:** DESIGN_FP_ARCH_GR.md §3 item 1 erratum
(self-contradictory preset-`false`-plus-manifest — next four GR flags
re-derive it unless amended; routed to the fold landing, task #34);
GR-1's fourth stamp site (generosity credit-obligation) blocked by
generosityKernel.js at exactly 800/800 — cure is an L8 lazy-leaf
extraction, deliberately deferred; the nine-copy intensity-ladder
consolidation (CHAIR DECISION OWED, frozen shrink-only meanwhile).

## ✅ CYCLE 1 CLOSED (2026-08-05, run wf_4ac35381-06e)

Close span: 1137f935 (CR-FP-11 — LAYER_PATTERNS gains commercial*/
grammar*/oath*, floors re-measured ZERO-SLACK at HEAD, ARGUED_UNLAYERED
map with written reasons, and the unlayered census: **179-entry
shrink-only baseline** — 192 of 383 domain modules carried no layer, far
beyond the brief's framing) · f786df89 (the crossing pin now MINTS
same-tick so only the prevLedger arm can satisfy it; mutant C2 reds BY
NAME; src untouched) · 79bceff5 (CR-FP-1 — schema v4 optional
deskAuthority, 7 rows amended zero deleted, walker joins per-KIND
against the four governed registries, THE FORBID + probe-row controls;
the walker header's own 5/2 dispute partition was WRONG — measured 7
resolve-by-authority / 4 real) · 88150241 (CR-FP-2 re-record 404→413
with per-detector ceilings; ⚠ THE RULING'S STATED CAUSE WAS REFUTED —
the instrument is byte-identical to the one that banked 404 yet yields
413 on that same tree; slice 4's reach was absorbed at 401→404; the act
executed with the MEASURED cause declared) · 32cc17f7 (the 89-line
cycle-1 close ledger row). Verify PASS: matched pair flipped, census 3
polarities, whole tests/lint AND tests/domain (13,024) EMPTY diff both
directions, +9 lint tests fully attributed, 27 registry rows exactly
(7 gained deskAuthority only), strict 1313.

**Debts minted at close:** TWO REACH_OWED_ROWS frozen in the inclusion
walker (program-era cross-layer reads Arm A made visible, incl.
commercialReasons→relationshipState INTERIOR→TRADE) — registry rows
OWED, not laundered into the legacy baseline · cosmetic vacuous line at
couplingDesk.walker.test.js:323 (no kind argument) · the sovereignty
authority honored by heraldRouting but STRIPPED by the normalizer
(pre-existing observation) · TR-1's CPL-1 row is SAME-LAYER after Arm A
so its licensing join is unexercised. ⚠ perl \Q...\n...\E anchors bit
AGAIN (matched nothing, exit 0) — caught by empty-diff-vs-backup; ⚠
commits used --no-verify (lint-staged stash hazard), compensated with
explicit eslint per commit, exit 0 each.

## THE CYCLE'S FULL SPAN (migrated from the memory index, 2026-08-06)

Cycle 1's commit span is **`59df13a9..32cc17f7`** — SP-A ("the shared shapes are
minted, and one ladder turned out to have nine copies", 2026-08-04) OPENS it; the
89-line close ledger row shuts it. The four close commits recorded above
(1137f935 + f786df89 + 79bceff5 + 88150241) sit inside that span, not at its head.
Re-derived from `git log` on 2026-08-06: THIRTEEN commits inclusive — 59df13a9 ·
e30770bd · c7933e84 · d7ea69a4 · 93c118b6 · caab995a · b441bca5 · d1cfdb67 ·
1137f935 · f786df89 · 79bceff5 · 88150241 · 32cc17f7 — which is the twelve the
ledger row's own subject line claims, PLUS the row itself. The earlier sections of
this file name only the tail (d7ea69a4 onward), so the span head was recoverable
from the index alone; it is written down here now.
