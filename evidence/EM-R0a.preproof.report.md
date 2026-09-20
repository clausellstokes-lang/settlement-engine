# EM-R0a — PRE-PROOF REPORT (Opus PRE-PROOF lane, 2026-09-20 06:53–07:2x EDT)

## Verdict

**READY-able at `141a1d775`.** Every verified-fact row re-found BY SYMBOL at the tip; no premise
refuted; nothing BLOCKED. The chair's standing instruction is **discharged** — the ruling that names
the `history` consistency group was found, its premise re-executed on this lane's own harness, and
the group declared. **Four facts changed and are rewritten; one contradiction was found INSIDE the
packet and cured; one governing enforcer was missing and is added.** Status stays `DRAFT`, header
stamped READY-able at `141a1d775`, `__BASE__` left for the chair.

**Files (all under `$SP/lane-preproof-EM-R0a-scratch/`; nothing written to the kit or any worktree):**

- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-R0a-scratch/EM-R0a.md`
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-R0a-scratch/EM-R0a.manifest.json`
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-R0a-scratch/EM-R0a.evidence.md` (E-35…E-48 appended; E-1…E-34 untouched)
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-R0a-scratch/EM-R0a.preproof.report.md` (this file)
- probe: `…/lane-preproof-EM-R0a-scratch/probe-history-group.mjs`; draft leaf for the detector run: `…/draft/recordRegister.js`

**Tree:** `$SP/read-tip-141a1d775`, HEAD `141a1d7752e8d9199c0bf347ea99808121733b0b`,
`git status --short` = **0 lines at entry and at exit**. No tracked file edited anywhere; no gate
run; no vitest, eslint, npm script or build. Only plain `node` probes and the two read-only registers.

## THE J-T1 WINDOW (quoted)

```
$ git diff --stat ad7ddf2c9 141a1d775 -- src/domain/edit/recordRegister.js \
    tests/lint/recordRegisterTotality.walker.test.js scripts/mutation-coverage-manifest.json \
    src/generators/generateSettlementPipeline.js tests/helpers/goldenMasterCorpus.js \
    tests/lint/mutationCoverage.shared.mjs
 scripts/mutation-coverage-manifest.json | 19 +++++++++++++++++++
 1 file changed, 19 insertions(+)
$ git merge-base --is-ancestor ad7ddf2c9 141a1d775 && echo ancestor
ancestor
$ git rev-list --count ad7ddf2c9..141a1d775
33
```

Thirty-three commits moved under the packet; **exactly one of its six paths moved, the REGISTER row,
by APPEND only** (EM-B1d v5's and EM-B1k2's rows). Every `requiredSymbols` path is byte-identical to
the compile's base — which is why all four symbols re-find at the lines the compile recorded.

## VERIFIED-FACT VERDICTS

| row | verdict | command |
|---|---|---|
| `generateSettlementPipeline` present | ✅ HOLDS, `:77` | `grep -cF 'export function generateSettlementPipeline' …` → **1** |
| `goldenCorpus` present | ✅ HOLDS, `:76` | `grep -cF 'export function goldenCorpus' …` → **1** |
| `keyOf` present | ✅ HOLDS, `:60` | `grep -cF 'export const keyOf' …` → **1** |
| `ENFORCER_DIRS` present, `tests/lint` a member | ✅ HOLDS, `:36` | `grep -cF 'export const ENFORCER_DIRS' …` → **1** |
| Both CREATE targets ABSENT | ✅ HOLDS | `ls src/domain/edit/` → No such file; `ls tests/lint/recordRegisterTotality…` → No such file |
| E-17: zero production refs to `domain/edit` | ✅ HOLDS | `git grep -n "domain/edit" -- src tests scripts vite.config.js` → **2 lines, both comments in test files** |
| 41 generated top-level keys; 63-row stride | ✅ HOLDS | this lane's own harness: `TOP-LEVEL KEYS: 41`, `STRIDE ROWS: 63` |
| All six version-2 groups live | ✅ HOLDS | roots + members 63/63; `activeConditions[]` at all 54 entries |
| Golden posture unchanged | ✅ HOLDS | neither golden is in §7; A8 runs, never re-records |
| ⛔ EM-B1d reserves the mutation manifest | ❌ **REFUTED — EM-B1d is LANDED; EM-P2 holds it** | manifest at tip: 193 packets, 190 LANDED, 2 SUPERSEDED, **1 READY = EM-P2**, REGISTER on that path |
| ⚠ `:889` / `:891` dispatch citations | ❌ **off by one → `:890` / `:892`** | `grep -n "verifiedBase disagrees…"` → `890`; `grep -n verifiedBranch` → `892` |
| ⚠ "seven `SURFACE_ROOTS`" | ❌ **SIX** | `writer-reach-scan.mjs:93-102` — web · dossier-pdf · campaign-pdf · world-book · foundry · json-export |
| ⛔ A6 "no root nested inside another's" | ❌ **REDS ON ITS OWN REGISTER** | executed: `economicViability.metrics.foodBalance` nested inside `economicViability` |

## ⭐ THE CHAIR'S STANDING INSTRUCTION — DISCHARGED

**The ruling, found:** ODQ §934.47 addendum 38 ruling (1) (2026-09-20 02:47 EDT, EM-R0b v3's
acceptance): *"BOTH — the `V-HISTORY-AGE` check DETECTS in this packet, and a `history` consistency
GROUP PREVENTS the split: one row added at EM-R0a's pre-proof with this measurement cited (a group
rooted at `history` is legal; …)"*, with the seat-queue row *"the EM-R pre-proofs (R0a + the
`history` group; …)"*.

**The premise, re-executed** (plain `node`, this lane's own 63-row stride, E-41):

```
history.age  ==  history.founding.age    both present 63/63 | EQUAL 63/63 | neither 0
  sample value: 157 (typeof number)
CANDIDATE GROUP { root: "history", members: ["age","founding.age"] }
  root history resolves 63/63 | member age 63/63 | member founding.age 63/63
```

Addendum 38's other two duplicated leaves also reproduce (both defence pairs equal 63/63).

**The three things the instruction asked me to satisfy:**

1. **The group declaration** — `{ id: 'history-age', root: 'history', members: ['age','founding.age'] }`
   added to `CONSISTENCY_GROUPS` as G8, six → **seven**. ⛔ **The member list is load-bearing:**
   `history` also carries `eventsTimeline`, `historicalEvents` and `currentTensions`, the
   ORDER-BEARING collections §5.2 keeps out of every group, so `members: null` would move all eight
   keys whenever the age moved — the failure §22.2 item 2 exists to forbid.
2. **The keys-by-path classification** — satisfied unchanged: `history` is already classed `READING`
   in `RECORD_CLASSES`, and the group sits inside a READING, which is where groups operate. No class
   moves, no `CLASS_EXCEPTIONS` row is added, and `RECORD_CLASSES` is not re-cut.
3. **The `recordInvariants` guard** — **not this packet's, by the ruling's own division.**
   `recordInvariants` is EM-R0b's module and an explicit non-goal at §2; `V-HISTORY-AGE` is the
   DETECTION half and is already shipped in EM-R0b version 3 (ACCEPTED, addendum 38, 30 → 33 checks).
   This packet owes the PREVENTION half only. Recorded as CANNOT-CATCH row 12 so the boundary is
   written down rather than assumed. **No contradiction; nothing to STOP on.**

## ⛔ THE ONE CONTRADICTION FOUND, AND ITS CURE

A6 was spelled *"no group's root is nested inside another group's root"* in §6, §9 and the manifest.
Executed over the packet's own six groups (E-42):

```
READING 1 — ROOT PREFIX (what A6 said):
   RED: economicViability.metrics.foodBalance  is nested inside  economicViability
READING 2 — COVERED PATH SETS (root expanded by its member list):
   (none) — every group's covered paths are disjoint
```

**The walker as specified would have reddened at the build on data the same packet declares**, before
the new group was even considered. Design §22.3 item 2 created the member list for exactly that pair
(*"`economicViability` whole would swallow `metrics.foodBalance`, which is a group of its own"*), so
the test is over what a group COVERS. A6, §9's A6 row, the manifest's A6 case and the module's own
comment are re-cut to covered sets. **This is a cure inside the packet, not an adjudication of a
design ruling** — but it does cost the chair a stated reason: see Q-A.

## `requiredSymbols` DELTA

**None.** All four rows re-proved verbatim at the tip; none owed, none removed. `retiredSymbols`
stays `null`, and the post-edit simulation is re-run and still returns empty: the packet CREATEs two
files and APPENDS one JSON row, moving/renaming/deleting no symbol at any path, so no LANDED packet's
(path, symbol) pair is disturbed.

## STEP 5 — THE BUNDLE MEASUREMENT, AND WHAT IT ADDED

**It added nothing, and that is the measurement, not an assumption.** `EAGER_FIRST_PAINT_MODULES`
was re-measured **BY IMPORTING THE SET** exactly as §P2 row 11's amendment demands (*"never by
reading a list"*): **268 modules**, the amendment's own figure independently re-derived, with **zero
`src/domain/edit/` members**; `factionLifecycle.js` confirmed a member (1), corroborating the
amendment. The leaf has zero importers, so it enters no chunk:

| budget | delta | how measured |
|---|---:|---|
| generation worker (`WORKER_BUNDLE_CEILING_BYTES`, zero slack) | **0 B** | no importer → not in the closure |
| lazy engine (`vendorPdfLazy.test.js`) | **0 B** | same |
| eager first paint (`EAGER_FIRST_PAINT_MODULES`) | **0 B** | imported the set: 268 modules, 0 `domain/edit` |
| edge-shared metas (§P2 row 10) | **not an input** | imported by nothing, so in no bundle's input closure |

No budget TEST row, no byte bound, no re-mint, and row 11's skipped-byte-arm sentence has no arm to
skip. **No STOP.**

## REGISTERS AND DELTAS

- **Lighting census: stated as this packet's DELTA only, no absolute anywhere.** `files +1` ·
  `parked +0` · `credited +1` · `titles +7` · `suiteTitles +1`, counted from the packet's own CREATE
  rows (one new test file, one literal `describe`, seven literal `it`s). **Version 3 adds a data row
  and no arm, so the delta is unchanged from version 2.** The live tuple is frozen at the tip by the
  fourth refreeze and is the chair's to read at promotion; the packet quotes none, and version 2's
  `files 2646 / 2649` absolute is removed.
- **Observed-shape: NO movement — CONFIRMED by execution** (the packet's own owed measurement, Q4,
  discharged). Scanner green at the tip (`1964 finding(s), exactly matching the frozen inventory`,
  exit 0). A finding requires a property access whose receiver resolves to exactly one known shape;
  the draft leaf's only property access is `Object.freeze` (15 occurrences, one distinct, receiver the
  `Object` global). Live precedent: **7,301 `Object.freeze` across 1,084 `src/` files mint zero
  findings today.** No exemptions row, no migration-bundle door, no chair act.
- **Writer-reach: NO movement.** `WRWALKER HOLD`, exit 0; six surface classes, all entry-file
  reachability, and the leaf has no importer.
- **Prose-numerics / stamped producers / `path:line` citations: NO movement, CONFIRMED.** The packet
  modifies no existing file, so it shifts no line above any FILE+LINE-addressed row,
  `wiring-census.json`'s 7 stamped producers are untouched, and no citation can be re-addressed.
- **Mutation-coverage: +1 row**, and it is what forces the base to the tip and collides with EM-P2.

## STEPS 11–16 AND THE DIRECTORY RULE

- **Step 11:** no generator among the `checks`; and, because the rule is *"every path a declared
  command WRITES"*, both §10 typecheck commands were checked — their baselines are written only
  behind an explicit update flag — and `implementation-packets.mjs` has **no `writeFileSync` at all**.
  No generated-artifact row owed.
- **Step 12:** every literal the packet adds swept across `tests`, `src`, `scripts`, `docs/content`
  — `recordRegister`, `recordRegisterTotality`, `domain/edit/recordRegister`, `history-age`,
  `CONSISTENCY_GROUPS`, `RECORD_CLASSES` — **all zero files.** No exact pin, no fixture spelling, no
  helper default argument. The packet retires no literal and widens no EXISTING named set.
- **Steps 13, 15, 16:** confirmed NO, each with its command (above).
- **Step 14:** (a) no generator, so no re-ordering owed. (b) The file is NEW, so the census rule is
  the straight-line-registration one; §6 now carries the three construction rules, including the
  `it`/`test`/`describe` re-binding ban that parked EM-B1e's file, and requires the build lane to
  PRINT `parkReasonsFor` before claiming `credited +1`.
- ⛔ **The 2026-09-20 directory-whole rule found a real gap.**
  `tests/lint/contractTestAntiVacuity.walker.test.js` governs `tests/lint/*.test.js` by its own
  declared scope header, and **EM-B1k2 and EM-B3c both name it in their `checks` for the same
  reason** — version 2 did not. It is added to the sealed `checks` and to §10, and the `tests/lint`
  WHOLE run (172 files) is added as the build lane's instrument with the census named in advance as
  its one lawful interior red. Its **Rule 2 is a live risk** for six of the seven exhaustive-claim
  arm titles; §6 construction rule 3 pins the cure.

## BUDGET

| limit | value | bound |
|---|---:|---|
| Handwritten files | 3 | 12 |
| New/changed effective production lines | **164** (163 + the seventh group's one line) | ≤ 210 |
| Effective lines per new leaf | **164** | 250 (no split) |
| New logic-bearing leaves | 0 (pure frozen data) | 2 |
| Existing logic files modified | 0 | 3 |
| Acceptance cases | 8 | 8 |
| Bundle byte delta | 0 B in every budget | — |

## THE QUESTIONS (four new, three standing; each with a recommendation)

1. **Q-A — A6's nesting reading, and the reason it costs.** The ROOT reading reds on the packet's own
   register; the COVERED-SET reading is clean. **RECOMMEND: keep covered sets** (adopted here) **and
   keep addendum 38's OUTCOME**, re-cutting only its parenthesis — under covered sets a
   `defenseProfile` group with a member list would NOT clash with `G7 defense-readiness`, so the
   defence pairs stay detection-only on the §22.2 item 3 division, not on a nesting bar. One sentence
   in the ODQ; no packet change either way. **A lane does not edit the ODQ, so this is the chair's.**
2. **Q-B — should this walker ASSERT `history.age === history.founding.age`?** **RECOMMEND: no new
   arm.** The ruling divides detection (EM-R0b's `V-HISTORY-AGE`, already shipped with its control
   and mutant) from prevention (this group). A new arm would duplicate it and cost a title against a
   frozen census. Recorded as CANNOT-CATCH row 12.
3. **Q-C — the sequencing target moved.** **RECOMMEND: confirm the chair adds EM-R0a's manifest entry
   only after EM-P2's landing flip.** EM-B1d is LANDED; EM-P2 (READY) now holds the path. The family
   builds after train EM-T7 either way, so the wait still costs nothing — but version 2 named the
   wrong packet and a terminal should not discover it.
4. **Q-D — `tests/lint` whole: instrument or sealed `checks`?** **RECOMMEND: as written** — the four
   named files stay the sealed array; the 172-file run is the §10 instrument. Sealing 172 files would
   bake a known interior red into `check:packet`.
5. **Q1 (standing) — `authoredTensions`, the ruling's TEST vs its EXAMPLE LIST.** Unchanged; the
   register applies the test and classes it a READING. **RECOMMEND: ratify the test**, one line either
   way.
6. **Q2 (standing) — the four SAVED-ONLY classes**, and whether `populationHistory` → HISTORY widens
   that class by a word. **RECOMMEND: ratify HISTORY** on THE PROMISE; all four are behaviour-free today.
7. **Q3 (standing) — `crossSettlementConflicts`, a key nothing writes.** **RECOMMEND: the proposed
   fate stands** (RECON-ID's table; CLOSED if the recon shows it dead).
8. **Q4 — ✅ DISCHARGED at this pre-proof**, not a question any more. Recorded rather than deleted so
   the chair can see the owed measurement was paid.

## ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. ⭐ **Packet headers cite `scripts/**` by `path:line` and are OUTSIDE the citation walker's
   declared roots.** This packet carried two such citations off by one (`:889`→`:890`,
   `:891`→`:892`) and nothing caught them. **SLOT: FIX-C2's owner** (the source-citation walker
   landed on its branch this morning, addendum 63) — extend its roots to `docs/implementation/**`,
   or record explicitly that packet headers are ungoverned and that every pre-proof re-finds them by
   symbol.
2. ⭐ **"Seven `SURFACE_ROOTS`" is six, and the wrong figure is in a table three sibling EM-R packets
   inherit** (§5.4's placement table is copied forward). **SLOT: the EM-R0b v3 / EM-R0c / EM-R6 v3.1
   placement tables** — a one-token check at each of their pre-proofs, or one chair sweep of the
   family's §5.4 tables in a single sitting.
3. ⚠ **G8 is the first group whose root also contains ORDER-BEARING collections**
   (`history.eventsTimeline`, `history.historicalEvents`, `history.currentTensions`). EM-R0c's order
   arm (§22.2 item 4) and its group arm now meet at `history`. **SLOT: EM-R0c's compile**, beside its
   existing order-bearing row — one measured trial of an edit that moves the age while the timeline's
   order has settled.
4. ⚠ **`contractTestAntiVacuity`'s Rule 2 is a standing trap for every totality walker this family
   ships** (R0a, R0b, R6, R7 all write exhaustive-claim titles over declared registers). It is
   survivable only while the sets are IMPORTED. **SLOT: the EM-R family's shared compile brief** —
   one line requiring imported sets in any `tests/lint` totality walker, so it is not re-derived per
   packet.
5. ⚠ **The census's `credited +1` is a prediction no compile or pre-proof can execute**, because the
   file does not exist until the build writes it; 26 of 384 parked files park on a re-bound `it`
   alone. **CLOSED — cured in this packet** by §6 construction rules 1 and 2 (the ban, plus the
   required `parkReasonsFor` print). Named here because the cure belongs in the shared brief too.
6. ⛔ **`scripts/mutation-coverage-manifest.json` is a single-holder bottleneck for every packet that
   adds a `tests/lint` file**, and it has now serialised EM-B1d → EM-P2 → EM-R0a. Four more EM-R
   members will each want a row. **OWNER'S DECISION POINT is NOT needed; SLOT: a chair ruling at the
   EM-R family's placement** — either sequence the four behind one another (costly) or rule that the
   family's rows enter in ONE chair act at the train's terminal. Recommend the latter; it is the
   same surgical append either way.
7. ⚠ **A well-formed REGISTER-only packet still forces its `verifiedBase` to the promotion tip**
   (because REGISTER ≠ CREATE puts the path in the substrate diff). Every EM-R member that adds a
   mutation-coverage row inherits this. **CLOSED — not work: it is correct behaviour**, and it is
   documented in this packet's §4 and manifest note so the next member inherits the reasoning rather
   than rediscovering it at its dispatch.
