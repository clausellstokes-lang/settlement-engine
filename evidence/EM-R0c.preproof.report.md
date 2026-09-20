# EM-R0c — PRE-PROOF REPORT (Opus PRE-PROOF lane, session a9df403c, 2026-09-20 07:21–07:5x EDT)

## STATUS: **DRAFT, ⭐ CONDITIONALLY READY-able at `141a1d775`**

No premise refuted; nothing BLOCKED. Every verified fact was re-found BY SYMBOL at the read tip and
holds to the row. The packet waits on **EM-R0a · EM-R0d · EM-R0b version 3 · EM-R0f**, each of which
owns a symbol this packet IMPORTS and none of which exists in the tree yet — which is the family's
declared build order (addendum 35 ruling 3), not a defect.

**Files** (all under `$SP/lane-preproof-EM-R0c-scratch/`; the kit, the ledger and every worktree
untouched):

- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-R0c-scratch/EM-R0c.md`
- `…/EM-R0c.manifest.json`
- `…/EM-R0c.evidence.md` (E-1…E-13 untouched; **P-1…P-12 appended**)
- `…/EM-R0c.preproof.report.md`
- Harnesses: `tools/` (the compile's, duplicated and re-pointed — **every one now takes `R0C_TREE`
  from the environment with NO default and throws when it is unset**), plus
  `tools/r0c-historytrial.mjs`, `tools/r0c-deepkeys.mjs`, `lightprobe/`, `seedprobe/`, `candidate/`

**Tree:** `$SP/read-tip-141a1d775`, `rev-parse --short HEAD` → `141a1d775`, `status --short` **EMPTY
at 07:21:47 EDT and at the close**. Plain `node` only — no vitest, no eslint CLI, no tsc, no build,
no npm script. **No gate was taken and none is owed.**

---

## 1 · THE J-T1 WINDOW — EMPTY

```
$ git -C $T diff --stat 32602dc607b7423838249cf57d73baf08feb047d 141a1d775 -- \
    <3 change rows> <4 live requiredSymbols paths> <3 pending substrate paths> \
    src/generators/power/economyReconciliation.js
(exit 0 — NO OUTPUT)
$ git -C $T rev-list --count 32602dc60..141a1d775
24
```

24 commits moved under the packet and **not one touched a path it names**. Every compiled figure is
byte-identical here, which is why nothing in §3's budget table or §7's manifest re-opened.

## 2 · VERDICT PER VERIFIED-FACT ROW

| row | verdict | the command |
|---|---|---|
| V1 `src/domain/edit/` absent | ✅ holds | `git ls-files -- 'src/domain/edit/*'` → 0 |
| V2 no `src/` importer | ✅ holds | the import-graph walk: `"domain/edit/"` imported by 0 src files |
| V3 eager closure 268, 0 edit files | ✅ holds | ⭐ **`EAGER_FIRST_PAINT_MODULES` IMPORTED from `vite.config.js`** (§P2 row 11's amended method); the replica fallback did not fire |
| V4 worker closure 220, 0 edit files | ✅ holds | static walk from `src/workers/generation.worker.js` |
| V5 fingerprint exported today at `:100` | ✅ holds | `grep -nF` → `100:export function fingerprintPowerEconomyInput` |
| **V5′ NEW** the symbol the packet IMPORTS | ⚠ **CONDITIONAL** | `src/data/economyFingerprint.js` → **file absent**; it is EM-R0f's CREATE |
| V6 ratchet 4 files / 5 edges | ✅ holds | the walker's own static+dynamic regex over **1,057** `src/domain` files → 4 / 5, identical to `BASELINE_EDGES` at `:60` |
| V7 three members private to one file | ✅ holds | `:37`, `:85`, `:100` unchanged |
| **V8 STOP-4** | ⛔ **SUPERSEDED — DISCHARGED** | ODQ §934.47 addendum 38 + `EM-R0b.md:334/:453`: v3 re-exports `CHECK_META` "so EM-R0c's compiled import is satisfied verbatim" |
| V9 not an enforcer dir, no NAME_PATTERN token | ✅ holds | `ENFORCER_DIRS` (8 trees, no `tests/domain`); the 16-token pattern matches neither `recordMerge` nor `recordMerge.test` |
| V10 census counts TEST files | ✅ holds | §P2.1 |
| V11 domain-strict shrink-only | ✅ holds | the script's own header; baseline written only under `--update` |
| V12 EP-0's row below the moved region | ✅ holds, **line refreshed** | `:132` (the compile wrote "118+") |
| V13 emitted ≡ measured, 567 trials | ✅ **carried forward** | not re-executed; the J-T1 window is empty over every path either module reads. Re-proving is EM-R7's |
| **V14 NEW** the history-order trial | ✅ **VERIFIED FACT** | §3 below |
| **V15 NEW** six `tests/` -whole walkers, one convicts | ⛔ **A GAP FOUND** | §4 below |
| **V16 NEW** lighting delta executed | ✅ **EXECUTED** | `parkReasonsFor → []`, titles 8, suiteTitles 1 |

**requiredSymbols delta:** the four live rows hold (`grep -cF` → 1 at lines 77 · 76 · 60 · 60).
**One symbol ADDED** to the pending block, taking it from seven to eight:
`export { CHECK_META, CHECK_IDS, CROSS_KEY_CHECKS } from './recordInvariantMeta.js';` at
`src/domain/edit/recordInvariants.js` (EM-R0b v3). The row quotes the **re-export line**, not the
bare token, so `grep -cF` is verbatim-safe. **None removed. `retiredSymbols` stays `[]`,** proved:
the packet's three edits touch no file any `requiredSymbols` row of any packet names.

## 3 · ⭐⭐ THE HISTORY-ORDER TRIAL (the chair's instruction, addendum 70 noticed item 3)

**Result: a VERIFIED FACT — the group arm and the order arm meet at `history` and do not interfere;
and the paired negative proves EM-R0a's member list is load-bearing for a second, measured reason.**

The population had to be built, and that is itself the first finding: **`history.age` moves 0 times
in 504** under the corpus's eight edits. Its only producer is `resolveSettlementAge(tier, config)`
(`src/generators/historyGenerator.js:42–52`; `founding.age = age` at `:843` is the file's only
`.age =` assignment), so the only edit that moves it is a world-fact edit to
`settlementAgeMode`/`settlementAgeYears` — the same shape as the corpus's terrain and culture edits.
Three were added and run through the same prototype seam: **63 rows × 11 edits = 693 trials, 0
errors**, under three register shapes in three processes.

```
  age moved (R0 vs R1) 189/693 · founding.age with it 189/693 (together 693/693) · G8 taken 189/693

  G8 two-member list (EM-R0a)   trials naming a history collection 106/693 | orderMoved entries 259 | history 203
  G8 members:null (negative)    trials naming a history collection   0/693 | orderMoved entries  56 | history   0
  G8 absent (the v2 register)   trials naming a history collection 106/693 | orderMoved entries 259 | history 203

  merged history IDENTICAL member-list vs G8-absent 693/693 · vs members:null 674/693
  history key order preserved 692/693 · age === founding.age 693/693 · founding present 693/693
  reordered: history.historicalEvents ×97 · history.eventsTimeline ×97 · history.legacyAnnotations ×9
```

1. **No interference.** With G8 as declared, the order arm is *exactly* what it is with no `history`
   group at all — trial for trial — and the merged `history` is byte-identical in 693/693. A group
   with a MEMBER LIST rebuilds its root's other keys by the node rule and writes the members over
   it, so the collections still reach the keyed merge and still report to `delta.orderMoved`.
2. ⭐ **`members: null` would SILENCE the order arm: 203 delta entries → 0**, swallowing 9,668
   leaves the node rule would have merged. §22.2 item 4 requires the second arm to be *counted in
   the delta*; under `members: null` the DM is never told the timeline re-ordered. EM-R0a argued the
   member list from key order — this is an independent second reason, and it is executed.
3. **Honestly:** G8 changes no merged VALUE in this corpus. `history` re-derives faithfully (the
   record's order never settles away from `R0`, 0 of 693), so nothing splits under any shape. **G8
   is PREVENTIVE with a zero value-population here** — recorded as the packet's CANNOT-CATCH row 9,
   and the corpus that would open the seam is EM-R7's.

§6's group row and §8's K-gate now carry the construction this depends on: *never `members: null` at
a root holding order-bearing collections; write the member overwrite AFTER the node-rule rebuild.*

## 4 · ⛔ THE GAP THIS PRE-PROOF FOUND (and cured in the packet)

**A new `tests/domain/*.test.js` opts into six `tests/lint` walkers that walk `tests/` WHOLE**, and
the packet carried §10 instruments for none of them — exactly the family the chair named after runs
17/18/19 (*"a lane's new or renamed test file was read by a walker the lane never ran"*).

- `seedLoopTotality` · `negativeAssertionAnchor` · `sovereigntyLightingContract` · `goldenFreeze` ·
  `controlBytes` · `worldGenerationClockSeam`.
- ⭐ `contractTestAntiVacuity` does **not** govern it (`inScope` = `tests/security/**`,
  `tests/**/*.contract.test.*`, `tests/lint/*.test.js`) — so A8's enumerated export list is safe.
  But `recordMerge.contract.test.js` **would** opt in; §7 now forbids that spelling too.

**And one of the six convicts the idiom §7 prescribed.** Executed RED-FIRST through
`seedLoopTotality.walker.test.js`'s own `scanBareSeedLoops` (source copied verbatim, vitest import
stubbed, scanner exported):

```
A  for (const { _seed, ...cfg } of rows) { … expect(…) }   ⛔ CONVICTED  (count 1, line 4)
B  for (const c of rows) { const { _seed, ...cfg } = c; }     clean  ← generatorGoldenMaster.test.js:837's own shape
C  // seed-loop: collected — …                                 clean
```

`tests/domain` is not one of its four generation-facing trees, so it falls in the **SHRINK-ONLY**
`FROZEN_BARE_SEED_LOOPS` habitat (13 `tests/domain` rows), whose header says *"never raise a number;
never add a file"* — and that baseline is **outside this packet's manifest**, so a conviction cannot
be absorbed and reds at the landing.

**Cured in the packet:** §7's TEST row gains the construction rule with the precedent's own shape
and the two lawful alternatives; §10 gains `tests/lint` WHOLE as an INSTRUMENT (never a sealed
check — addendum 70 Q-D); §11 gains STOP-9; §12 gains the receipt line, expecting **exactly one
red, the lighting census's interior tuple**.

## 5 · THE OTHER FACT THAT CHANGED — §6's write-base absolute

The compile's §6 says *"⛔ A key present in `record` is present in the result, whatever the two
re-derivations carry."* Measured at depth over 693 trials: **0 top-level keys lost** (the compile's
A1 arm, re-measured), but **245 pure-object paths lost at depth** — and **0 of the 245** sits under a
node where `R0 ≡ R1`.

So the merge is right and the sentence is not: every deep loss is `R1` governing a reading the edit
touched and `R1` does not carry (`resourceAnalysis.imports.reasons.*` ×231,
`economicState.foodSecurity.prosperityMod` ×12, `history.legacyAnnotations` ×1, …). The chair's own
contract already says it exactly — *"present in the record **and untouched by the edit**"* (ODQ
§934.60) — and §6 now says it that way, with an explicit ⛔ against "fixing" it by padding absent
keys back in. A1 is scoped to the top level (safe at any depth, since `R0 ≡ R1` there makes every
node short-circuit).

**Measurement limit, stated:** the remaining ~12,000 losses are array-indexed paths, where an index
does not identify the same entry across two re-derivations and the merge never visits those indices
as nodes. Nothing is asserted about them; they are EM-R7's.

## 6 · BUDGET, PLACEMENT, REGISTERS

| limit | measured at `141a1d775` | verdict |
|---|---:|---|
| new logic leaves ≤ 2 | 2 | in |
| total effective production lines ≤ 400 | **294** | in |
| `recordMergeTree.js` ≤ 250 | **166** (204 raw, 8,277 B) | in |
| `mergeConsequence.js` ≤ 250 | **128** (199 raw, 8,748 B) | in |
| existing logic files modified ≤ 3 | 0 | in |
| handwritten files ≤ 12 | 3 | in |
| acceptance cases ≤ 8 | 8 | in |
| hot files named | 0 | in |

eslint's own `Linter` (`max-lines`, `{skipBlankLines, skipComments}`) imported from the read tip,
run in process. **Nothing moved, so §7 did not re-open.**

**Chunk measurement (brief step 5): ZERO BYTES in all three budgets, and the cure is the
PLACEMENT.** `src/domain/edit/**` is in neither the eager first-paint closure (268 modules, read by
IMPORT) nor the generation worker's static closure (220), and nothing in `src/` imports it — it is
reachable from no entry, so it is in no emitted chunk. **Nothing was added to the change manifest
because of step 5.** The bytes become real at EM-B2a's first import; its pre-proof owes the dynamic
import and the price (the merge's own leaves are 17,025 B of source).

**Registers, all deltas:** lighting `+1/+0/+1/+8/+1` (executed, V16) · mutation-coverage **no row**
(V9) · observed-shape **no mint** · writer-reach **no movement predicted** · prose-numerics,
`wiring-census.json` `stamp.files`, `path:line` citations **all nil** (they key on a MODIFIED `src/`
file and this packet modifies none) · `build:edge-shared` **no** (all five metas' `inputs` re-read;
no path of this packet appears) · goldens **UNCHANGED**.

## 7 · NINE QUESTIONS FOR THE CHAIR, each with a recommendation

**Q1 — §6's write-base sentence: adopt the chair's own wording?**
The absolute is false at depth (245 measured counterexamples, all lawful). **Recommend: ADOPT as
written in §6 now** — *"nothing present in the record and untouched by the edit"*, with "untouched"
defined as `R0 ≡ R1` at the node, plus the ⛔ against padding absent keys back. *Reversal:* one
paragraph. *Alternative rejected:* leaving the absolute and letting a build lane implement a deep
guard, which would red on a correct merge.

**Q2 — `tests/lint` WHOLE as an INSTRUMENT, not a sealed check?**
**Recommend: INSTRUMENT** (as written), on addendum 70's Q-D reasoning — sealing a 172-file run
bakes the lighting INTERIOR RED into `check:packet`. The sealed array stays the five it has.

**Q3 — is STOP-9 (the seed-loop walker) the right shape, or should the test file simply adopt
`collectSeedFailures`?**
**Recommend: the CONSTRUCTION RULE as written** — it copies the precedent the packet already names
(`generatorGoldenMaster.test.js:837`) and costs nothing. `collectSeedFailures` is the stronger,
truthful idiom (it reports a true count instead of a floor) and is worth taking if the chair wants
the eight arms to report per-row failures; that is a §7 wording change, not a re-compile.

**Q4 — the trial says G8 changes NO merged value in the 63-row corpus. Does EM-R0a's G8 still
stand?**
**Recommend: YES, unchanged.** The trial strengthens it — `members: null` would silence 203 delta
order entries, which §22.2 item 4 requires — and its value-population being zero here is exactly
what a PREVENTIVE group looks like. Recorded as CANNOT-CATCH row 9 so nobody later reads the zero as
evidence the group is dead. **⛔ The one thing I would NOT do is add an acceptance arm for it here:**
an arm over a zero population is the vacuity EM-R0b's A6 was re-cut to escape.

**Q5 — should the three AGE-MOVING world-fact edits join the family's standing edit corpus?**
They are the only edits that move `history.age`, they exercise G8's `taken=true` branch (189 of 693)
and they are the only trials in which the order arm's second arm fires on `eventsTimeline` and
`historicalEvents` at scale (97 each). **Recommend: YES — EM-R7's corpus takes them as edits 9–11**,
so the family's terminal proof exercises the group it declares. *Alternative:* leave the corpus at
eight and let G8 ship with no executed value-population at all.

**Q6 — EM-R0f has not produced a packet. Does EM-R0c stay CONDITIONAL, or wait?**
**Recommend: stay CONDITIONAL and promote now.** The dependency is structural and already in §4's
substrate check and §8's K-gate; the chair stamps `__BASE__` after the four landings regardless, and
the family's order (R0a · R0d · R0b v3 · R0f · R0c) already sequences it. Nothing in this packet's
facts depends on R0f's SHAPE beyond the import path, which addendum 35 ruling 1 fixed.

**Q7 — `CHECK_META`'s `requiredSymbols` row quotes the whole re-export line. Is that the form the
chair wants?**
`export { CHECK_META, CHECK_IDS, CROSS_KEY_CHECKS } from './recordInvariantMeta.js';` is what
`grep -cF` will find at `recordInvariants.js`; a row naming the bare token would match a comment.
**Recommend: the line as written.** ⚠ It is brittle in one way worth naming: if EM-R0b v3's build
re-orders that export list, the verbatim text moves. If the chair prefers, `export { CHECK_META,` is
a shorter prefix that survives a re-order of the *later* names only.

**Q8 — the four MIXED objects: is anything still open for EM-R0c?**
No. Addendum 35 ruling 4 CLOSED `availableServices` ×7 and `economicState` ×2 as measured
non-groups; addendum 38 ruled `defenseProfile.scores` and `history.founding` LAWFUL MIXED objects,
no group owed. **Recommend: close the compile's question 4 against EM-R0c** — it is fully
discharged and the packet now cites both rulings in §1.

**Q9 — addendum 70's noticed item 2 (`SURFACE_ROOTS` is six, "the chair's one-token check at each
sibling's placement — R0b v3, R0c, R6 v3.1").**
`grep -c SURFACE_ROOTS` over `EM-R0c.md` and its manifest → **0 and 0**; this packet carries no §5.4
table. **Recommend: CLOSE the item against EM-R0c** (it remains live for R0b v3 and R6 v3.1).

---

## 8 · ⛔ EVERYTHING NOTICED AND NOT TOUCHED — each specific enough to slot

1. ⛔ **The `seedLoopTotality` habitat is a standing trap for EVERY EM-R member that creates a
   `tests/domain` test file.** R0a, R0b v3, R0d and R6 all create test files, and the family's whole
   idiom is "derive a stride from `goldenCorpus()` and loop". **SLOT: one sentence in
   `LANE-EM-PREPROOF.md` beside step 14 —** *a CREATE under `tests/<dir>` outside the four
   generation-facing trees must keep `seed`/`seeds`/`SEED` off every `for (` line whose body holds a
   bare `expect(`, or adopt `collectSeedFailures`; the baseline is shrink-only and outside every
   packet's manifest.* Cheap, and it removes the habitat for the four members still to be built.
2. ⛔ **`LANE-EM-COMPILE-2.md`'s preamble hash is stale AGAIN** — it was cured to `b90a95b7…` at
   02:30, and the live preamble is now `16dfb96f…` (its second amendment). This is the second
   re-stamp in five hours. **SLOT: the brief should stop quoting the hash at all** and say instead
   *"measure it yourself at your tip with `shasum -a 256` and STOP if the header's stamp differs"* —
   a value that moves with every amendment cannot live in a brief.
3. ⛔ **The compile's own harness carried the label `at 32602dc60` hardcoded into two `console.log`
   lines** of `tools/r0c-place.mjs` while its TREE came from a constant. A successor re-pointing the
   TREE would have printed correct figures under a wrong sha. Fixed in this lane's copy (the label
   now reads `git rev-parse --short HEAD` of the tree it measured). **SLOT: the kit's harness note
   should say a harness prints the sha it MEASURED, derived from the tree, never a literal** — the
   same class as the TREE-from-env rule the chair already added.
4. **`parkReasonsFor` cannot be imported by a lane** (a module-internal const at
   `sovereigntyLightingContract.walker.test.js:1670`), so every lane that needs it either predicts
   (EM-B1k2's evidence says in terms *"⚠ PLAUSIBLE … the pre-proof should execute it"*) or rebuilds
   the copy-and-stub probe from scratch, as this lane did. **SLOT: export `parkReasonsFor` and
   `classifySource` from the walker** (an export adds no arm and changes no figure), or land a
   `tests/helpers/lightingClassify.js` the walker imports. It would save every future member lane
   the same 20 minutes.
5. **`history.age` is frozen by design and the freeze is owner-gated.**
   `src/generators/historyGenerator.js:806–827` documents it at length: the age is a
   generation-time constant, the campaign calendar runs while `history.age` holds, and curing it is
   owner-gated under §764.3 (`docs/ENGINE_DEFECT_DISPOSITIONS.md` §5). **This matters to the EDITOR
   specifically** — the age edits V14 runs are the only edits that move it, and a DM who edits the
   age will move `eventsTimeline` and `historicalEvents` wholesale. **SLOT: EM-A1's root-field
   surface decides whether the age is an editable field at all**; if it is, the delta card owes the
   DM the timeline's re-order, which V14 shows the merge does report.
6. **`delta.readings` can still reach ~21,000 rows** (the compile's item 7). The three age edits add
   nothing to that count but confirm the shape: a world-fact edit re-reads the world. **Already
   slotted** to the EM-D family's compile (addendum 35's fates).
7. **The `simulationTrace` deep-loss population is large and unmeasured** (~12,000 array-indexed
   paths over 693 trials, dominated by `simulationTrace[].causes[]` and
   `[].downstreamEffects[]` shrinking). Nothing here says it is wrong — the ATOMIC rule takes those
   arrays as one value by design — but nothing here says it is right either. **SLOT: EM-R7's corpus
   ratchet gains one arm** — *for every collection the record carries longer than `R1`, assert the
   collection is ATOMIC or key-broken by the register, never keyed-and-truncated.* That converts a
   measurement limit into a guard.
8. **`tests/build/domainGeneratorsBoundary.test.js`'s header prose is still stale** — it lists a
   six-entry baseline "captured at HEAD 8e10816" naming `display/defenseDisplay.js`,
   `events/mutateEntities.js` and `worldPulse/pulseKernel.js`, none of which is a live edge. The
   compile slotted this to EM-R0f; **it is still true at `141a1d775`** and EM-R0f is still the
   natural carrier (it is the packet that re-reads the ratchet).
9. ⚠ **This lane touched a forbidden path once, by a wildcard, and stopped.** A
   `grep -rln … $SP/lane-preproof-*/` looking for an existing `parkReasonsFor` harness listed file
   NAMES under `lane-preproof-EM-B1f-scratch`, which my launch does not name as readable. **No
   content from it was read and nothing from it was used** — the lightprobe was rebuilt from the
   read tip's own source. Recorded so the chair has it rather than not. **SLOT: none owed;** if the
   chair wants the rule tightened, a lane brief could say *search sibling scratch dirs by explicit
   path, never by `lane-*` glob.*
10. **`node_modules` in the read tree is a symlink into `slot-2`** (the compile's item 10) — still
    true, and `lightprobe`/`seedprobe` symlink through it too. No work owed; recorded as a standing
    property, already TOOL-5's.

---

## 9 · CLOSING STATE

```
$ date; git -C $T status --short; git -C $T rev-parse --short HEAD
Sun Sep 20 07:4x EDT 2026
(no output)
141a1d775
```

Nothing edited, staged or committed in any worktree, the kit or the ledger. No gate taken, none
owed. Every claim above is **CONFIRMED** (a quoted command in `EM-R0c.evidence.md` P-1…P-12) except
V13, which is explicitly **carried forward** from the compile under an empty J-T1 window, and the
array-indexed deep-loss population, which is explicitly stated as a measurement limit.
