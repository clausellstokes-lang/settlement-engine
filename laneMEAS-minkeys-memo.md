# laneMEAS-MINKEYS — the estate-wide measurement of `SHAPE_FAMILY_FILTER.minKeys` 8 → 7

**Charter:** ODQ §338.1. **Lane:** MEAS-MINKEYS, read-only measurement.
**Wrote nothing in the repository, moved no ref, touched no worktree.** All execution ran
against `git archive` extractions in the session scratchpad.
**Date:** 2026-08-21. **Measurement is instrumented and executed, not estimated.**

**PINNED SUBJECT:** `refs/heads/claude/composite-r4` @ **`3ac279db4232cc65abb57c4fa016578efd0f695d`**.
⭐ The tip moved mid-lane, exactly as the charter warned — it is now `27c250f9`
("feat(MF-T2D): the boundary noder"). **The entire measurement was re-executed at `27c250f9`
and reproduces identically** (§2.3). The instrument, the corpus builder, the byte-frozen
detector and the baseline are byte-identical across the move; the only delta is one new
source file. **No figure below is stale.**

---

## 1. ⛔⛔ HEADLINE — THE CHANGE IS A NO-OP, AND THE PREMISE IS REFUTED

**Dropping `minKeys` from 8 to 7 clears ZERO additional rows, estate-wide.**

| | minKeys = 8 (live) | minKeys = 7 |
|---|---|---|
| M6 clears | 122 reads / 31 identities | **122 reads / 31 identities** |
| Post-chain inventory | 1998 findings / 1412 identities / 387 files | **1998 / 1412 / 387** |
| Inventory addresses gone | — | **0** |
| Inventory addresses lowered | — | **0** |
| class-(a) rows erased | 0 | **0** |
| **eventLog rows cleared** | 0 of 47 | **0 of 47** |

**The `+0` is not a near-miss. `eventLog` does not become admissible at `minKeys=7` at all.**
The charter's premise — that `eventLog` "misses `minKeys: 8` by exactly one" — is
arithmetically true and **causally irrelevant**. `eventLog` fails the *other* half of the
family relation by a factor of **2.8×**, and `minKeys` is not the dial holding it out.

> `eventLog`'s best sibling coverage in the whole 1,300-shape corpus is **2 of 7 = 0.286**.
> `SHAPE_FAMILY_FILTER.theta` is **0.80**.

At `minKeys=7` the guard admits `eventLog` into the relation, the relation looks for a family,
and **finds none**. Its union stays at its own 7 keys. Every one of its 47 reads survives.

**RECOMMENDATION: AGAINST.** Do not ride the 8→7 change on the next governed mint. It buys
nothing, and it costs a governed instrument migration plus a named boundary pin (§6, §7).

---

## 2. METHOD, AND THE CONTROLS THAT MAKE THE FIGURES MEAN SOMETHING

### 2.1 What was executed

`git archive <pinned-sha> | tar -x` into the scratchpad; the repo's `node_modules` symlinked in
read-only. `ROOT` resolves to the extraction, so nothing could write to the repo even by
accident. The probe drives `buildObservedCorpus()` and the byte-frozen
`legacy-reader-shape-scan.mjs` directly, bypassing the gate's git/provenance machinery
(which an extraction cannot satisfy) while using the **instrument's own** filter functions.

Executed corpus: **4 seeds / 4 configs / 16 generations / 12 pulse intervals / 76 simulation
flags lit / 1,300 shapes / 8,607 origins / 14,586 transitions.**
Scan: **2,140 files / 123,219 reads / 9,249 resolved / 2,131 raw findings.**

### 2.2 Three controls, all green

1. **Re-implementation control.** The parameterized union function was run at `minKeys=8`
   and its cleared-identity set compared against the instrument's own
   `applyShapeFamilyFilter`. **Identical — 122 reads / 31 identities, sets equal.** A
   re-implementation that drifted would measure nothing; this one provably does not.
2. **Baseline reproduction control, at ADDRESS level.** The full declared chain
   (M6 → M11 → M12) over my executed corpus reproduces the committed
   `scripts/.observed-shape-readers-baseline.json` **exactly**:
   `frozen addresses=1412, mine=1412, missing=0, extra=0, differing=0` — and
   `1998 findings / 1412 identities / 387 files` matches the committed envelope's own
   `total` / `identities` / file count. Totals agreeing would be weak; **every individual
   `<file> || <key> on <shape>` row agreeing is the strong form.**
3. **Independent corroboration of the 122.** The chair's own re-measurement recorded in
   `docs/FABLE_VALIDATION_QUEUE.md` (2026-08-11) states *"θ=0.80 with the ≥8-key guard clears
   **122** findings"*. My fresh executed corpus reproduces **122** at a different SHA. The
   instrument is stable and my harness is measuring the real thing.

### 2.3 The tip-move control

Re-executed in full against a fresh extraction of the new tip `27c250f9`:
corpus 1,300 shapes; raw findings 2,131; instrument@8 = probe@8 = 122/31; probe@7 = 122/31;
**DELTA +0/+0**; chain 1998/1412/387 both ways; gone/lowered/new addresses all 0.
`git diff 3ac279db..27c250f9` over the instrument, the corpus builder, the frozen detector,
the baseline and the sentinel test is **empty**.

### 2.4 Why the change can never *grow* the inventory (the monotonicity, stated)

`shapeFamilyUnionOf` returns own-keys-only below the guard and `own ∪ family` above it.
Lowering `minKeys` can therefore only ever *enlarge* a union, only ever clear *more*, and only
ever *shrink* the inventory. It is structurally incapable of minting a finding. The measured
`new addresses: 0` confirms the arithmetic. **The risk of this change is never "it reds
something new" — it is "it silently erases something real."**

---

## 3. WHAT ACTUALLY MOVES AT `minKeys=7`

**43 shapes** in the corpus carry exactly 7 own keys — the only shapes whose union the change
can touch. Of these, **33 gain a non-empty family** (shapes in the relation: **399 → 432** of
1,300). **None of the 33 clears a single row**, for one of two reasons.

### Verdict table — every newly-admitted family

| Family (7 own keys) | family size | union | bound reads | **rows cleared** | classification | recommended disposition |
|---|---|---|---|---|---|---|
| `issues` | 1 (`dependencies`) | 7 (+0) | 5 | **0** | **No-op.** The sibling is a 6-key *subset*; it contributes no key `issues` lacks. | None. Harmless either way. |
| `supplyShipments` + **28** `osr:<seed>:<building>:<resource>` shapes | 28 each | 7 (+0) | 0 | **0** | **No-op.** These are the same resource record repeated per seed/building; every "sibling" is key-identical, so the union is a fixed point. | None. |
| `resourceConditions` | 2 | **123 (+116)** | 0 | **0** | **LATENT.** Union explodes, but no reader binds to it today. | ⚠ Watch — see §5. |
| `resourceTaxonomy` | 3 | **153 (+146)** | 0 | **0** | **LATENT.** | ⚠ Watch — see §5. |
| `urbanFabric` | 16 | **168 (+161)** | 0 | **0** | **LATENT — the widest.** A 7-key shape acquiring a 168-key acceptance set. | ⚠ Watch — see §5. |

### Verdict table — the 7-key shapes that are NOT admitted even at `minKeys=7`

| Shape | reads / identities | best sibling coverage | θ needed | at θ=0.80 | verdict |
|---|---|---|---|---|---|
| **`eventLog`** ⭐ the motivating shape | **47 / 26** | **2/7 = 0.286** (`pulseHistory`) | **0.286** | **family EMPTY** | **The change does not reach it.** |
| `currentTensions` | 9 / 4 | 5/7 = 0.714 (`historicalEvents`) | 0.714 | family empty | Unaffected. |
| `defenseProfile` | 10 / 5 | 2/7 = 0.286 (`settlement`) | 0.286 | family empty | Unaffected. |

`eventLog`'s four best siblings across the entire corpus: `pulseHistory` 2/7, `entries` 2/7,
`mechanicalRumorSeeds` 2/7, `impactDigest` 2/7. **Nothing is remotely close to 0.80.**

---

## 4. ⛔ THE REFUTATION — brief §6.4(c) is wrong on the mechanism

The laneUICR brief states, and the chair is being asked to rule partly on it:

> "**M6 misses rescuing this by EXACTLY ONE KEY.** … `eventLog` has **7** own keys. **7 < 8.**
> The M6 filter … is disarmed on this shape by a one-key margin."

**MEASURED: the second sentence does not follow from the first.** The one-key margin is real,
but removing it changes nothing, because the `minKeys` guard is not what disarms M6 here —
**θ is**, and θ is missed by 0.286 vs 0.80, not by a margin.

This matters to the ruling in a concrete way: **option C5 as written cannot deliver its stated
benefit.** The chair should not weigh C5 as "smallest possible code delta that targets the
actual mechanism" — measured, it is a code delta that targets *nothing*.

### The counterfactual, since the natural next question is "then what would reach it?"

Only a θ drop reaches `eventLog`, and it would have to fall **0.80 → 0.286**. Measured at that
θ, `eventLog` gains a 120-key union and clears **13 of 47 reads / 7 of 26 identities** —
`createdAt`, `kind`, `name`, `severity`, `summary`, `targetId`, `type`. That is a **failure on
both sides**:

- It **misses the objective.** 19 of the 26 identities — the bulk of the ~22 the ruling wanted
  cleared — survive untouched.
- It **erases something real.** `targetId on eventLog` is a genuine read in
  `src/domain/events/mutate.js:206,210` of the inner `Event` object, not a normalizer artifact.
  A θ of 0.286 would delete it silently.
- And θ=0.286 is an estate-wide solvent that would clear rows on hundreds of shapes.

**There is no setting of the M6 dials that cleanly clears the eventLog cohort.** M6 is the
wrong instrument for this cohort, and that is the finding.

---

## 5. COLLATERAL — the honest risk of the change is LATENT, not present

The charter asks whether newly-admitted rows land as defects, exemption candidates, or clean.
**No row lands at all**, so there is no present collateral. The real collateral is forward:

`urbanFabric` (7 own keys → **168**-key union), `resourceTaxonomy` (→ 153) and
`resourceConditions` (→ 123) would each acquire an enormous acceptance set **that nothing
exercises today**. The moment any future reader binds to one of them, M6 would silently clear
reads of keys those records never carry — the exact reader-with-no-writer defect this
instrument exists to catch, admitted by a guard nobody would think to re-examine.

That is a poor trade for a change whose measured present benefit is **zero**, and it is the
substantive argument against 8→7 independent of cost.

⚠ **Near-miss worth recording:** `currentTensions` needs θ=0.714 for a family, and
`title on currentTensions` is a **class-(a) protected identity**. It is not currently live
(consistent with "only 8 of the 21 still live"), so nothing fires today — but a future θ
retune in the 0.71–0.80 band would come within one repair-regression of tripping
`assertShapeFamilyDebtPreserved` and refusing every scan estate-wide.

---

## 6. THE COST SURFACE — executed, not reasoned

### 6.1 A named boundary pin reds. CONFIRMED, with a paired control.

`tests/lint/observedShapeSentinel.test.js:629` pins the guard **deliberately, on both sides**:

```js
// THE SIZE GUARD IS A BOUNDARY, PINNED ON BOTH SIDES: the same perfect
// superset contributes nothing to a 7-key shape and everything to an 8-key
// one, so the guard cannot be quietly dropped or quietly widened.
expect([...shapeFamilyUnionOf('thin', guardShapes(7))].sort()).toEqual(keysOf(7).sort());
```

Executed in the extraction:

| run | result | true exit |
|---|---|---|
| control, `minKeys: 8` | `Test Files 1 passed · Tests 1 passed` | **0** |
| mutant, `minKeys: 7` | `× CR-OSR-FREEZE-6: the shape family unions containing siblings, above a size guard`<br>`AssertionError: expected [ 'fromFat', 'k1', … ] to deeply equal [ 'k1', … ]` at `:629:68` | **1** |

**Full OSR suite, all five files** — control **240 passed / 1 failed**, mutant **239 passed /
2 failed**. The delta is **exactly one test**. (The failure common to both runs is
`authoredInputHistoryCommits`, which shells `git log --all`; my extraction has no `.git`. A
pure extraction artifact, present identically in both arms.)

The pin's own comment says the guard "cannot be quietly dropped" — **the instrument is working
as designed.** This red is not an obstacle to route around; it is the machinery reporting that
`minKeys` is a governed constant.

### 6.2 It is a governed instrument migration, not ordinary maintenance. CONFIRMED.

`scripts/check-observed-shape-readers.mjs` is itself in `scannerToolFiles()`, so editing
`minKeys` moves `detectorTree.digest`. Measured over the extraction:

| tree | detectorTree digest |
|---|---|
| `minKeys: 7` (mutant) | `ff25c082ece42c1466209ca4de0f81857af5f409519a4d0c3888e7c08dda215c` |
| `minKeys: 8` (pinned tip) | `d3de8977f13f875875b225f488467f3bda3d4604143b80e5c806021e4059eef7` |
| frozen in the baseline | `e00387407d19d87b89c3e3abcd09216346684c05f18c0a2a6cacf254736172b1` |

`run()` at `:2161-2168` then fires: gate `return 1`; ordinary `--write` **throws**
*"an ordinary gate/write cannot migrate the instrument."* Because `BASELINE_SCHEMA` is already
8, `--migrate-schema=8` is refused too (`:2128`) — so the path requires **bumping the schema to
9 and running the full governed migration bundle**. The chair's own validated ruling already
states this outcome for this exact object:

> "`SHAPE_FAMILY_FILTER` … already inside `detectorTreeDigest` … **retuning θ or adding an
> exemption reds the gate and needs a new mint**." — `docs/FABLE_VALIDATION_QUEUE.md`, 2026-08-11

**Total cost: a schema-9 mint + migration bundle + full re-freeze + one pin re-record.
Total measured benefit: zero rows.**

### 6.3 No other consumer

`minKeys` appears in exactly four places, all inside the instrument (one declaration, one use,
two notice strings). It is **not** in `SCAN_CONFIG`, so it does not enter the sentinel or any
frozen anti-vacuity figure. No census, capsule, or packet references it.
`check:observed-shape-readers` is a **standalone** npm script — not in `npm run check`, CI, or
husky — so the OSR gate itself is on-demand; the enforcement that bites the standing gate is
the vitest pin in §6.1.

---

## 7. RECOMMENDATION — **AGAINST**, and the cohort wants a different instrument

**Do not ride `minKeys` 8→7 on the next governed mint.** It clears zero rows, does not reach
`eventLog`, costs a schema mint plus a deliberate boundary-pin re-record, and leaves three
latent wide-union shapes as a forward hazard. Recommend the chair **strike option C5 from the
Ruling C menu** on the measured ground that its stated mechanism is refuted (§4).

**And the measurement points at the right instrument.** Reading the 33 rows' actual sites, the
cohort splits cleanly — and **the instrument's own machine-checked gate 0 draws the same line
by itself.** Running the instrument's `writeShapesIn` probe against
`src/domain/events/applyEvent.js`:

| key | gate 0 (write-shape probe) |
|---|---|
| `event` | **WRITTEN** [shorthand] |
| `deltas` | **WRITTEN** [property] |
| `narrativeSummary` | **WRITTEN** [property] |
| `appliedAt` | **WRITTEN** [shorthand] |
| `type`, `targetId`, `id`, and all 19 chronicleFeed-only keys (`label`, `kind`, `detail`, `note`, `text`, `when`, `date`, `scale`, `weight`, `cause`, `partyCaused`, `created_at`, `timestamp`, `eventId`, `summary`, `description`, `name`, `title`, `severity`) | **not found → gate 0 REFUSES** |

**This independently and mechanically corroborates brief §6.6's split disposition.** The four
identities the brief proposed banking under M9 are exactly the four the instrument's own
evidence gate admits; every identity the brief said would be *dishonest* to bank is
mechanically refused. The chair does not have to take that split on argument — the machinery
enforces it.

The reader sites confirm the reading:

| file | rows / reads | what it reads | class |
|---|---|---|---|
| `src/domain/events/mutate.js` | 5 / 11 | `receiptFromEventLogEntry` — JSDoc'd `{event, deltas, narrativeSummary}`; `type`/`targetId` are read off the **inner Event**, a different (correct) home | **M9 candidate** (`event`, `deltas`, `narrativeSummary`); `type`/`targetId` need a different named writer |
| `src/components/settlement/NarrativeArchivePanel.jsx` | 3 / 4 | `hit.narrativeSummary`, `hit.event?.type` — same campaign record | **M9 candidate** |
| `src/store/campaignCanonRelationshipSession.js` | 1 / 1 | `e?.event?.id` on `state.eventLog` — same record | **M9 candidate** |
| `src/domain/dossier/chronicleFeed.js` | **24 / 31** | `normalizeEntry`, JSDoc'd *"Normalize one heterogeneous raw event"*, fed by **four different sources**; six defensive OR-chains | **NOT M9** — cross-source compatibility arms; a distinct class |

The root cause is visible in the shapes themselves: the corpus's `eventLog` is the
**world-state** log — `{changes, id, impactIds, recordedAt, sourceEvent, sourceSettlementId,
sourceSettlementName}` — while every flagged read is of the **campaign** log,
`{event, deltas, narrativeSummary}`. Two unrelated records sharing a leaf name. That is
leaf-name cross-home substitution, exactly as Lane I ruled — and it is why no family relation
can bridge them: **they share almost no keys, which is the same fact as the 2/7 coverage.**

---

## 8. ⚠ RAISED

1. **⛔ THE OSR INSTRUMENT IS ALREADY OUT OF FREEZE AT THE BUILD TIP — a mint is pending
   independently of this question.** Measured: the committed tree's detectorTree digest
   (`d3de8977…`) does not equal the digest the committed baseline records (`e0038740…`).
   **Method validated:** recomputing over an extraction of the freeze SHA `3df85a3a` yields
   exactly `e00387407d19d87b89c3e3abcd09216346684c05f18c0a2a6cacf254736172b1` — the recorded
   value — so the drift at the tip is real, not a harness artifact. Two causes, both landed
   since the 08-13 freeze:
   - `scripts/lib/observed-shape-corpus.mjs` **+23 lines** — the **EP-1 (2026-08-16)**
     declared decision holding `advanceEpochEnabled` dark;
   - `package.json` **+2 lines** — two new npm scripts (`soak:rolling`, `soak:restore`).
     Not a dependency bump, but `package.json` is a governed `scannerToolFiles()` input.

   Per `run()` `:2161-2168`, `npm run check:observed-shape-readers` returns **1** at the tip
   before any `minKeys` consideration. ⭐ **Mitigating:** that script is *not* wired into
   `npm run check`, CI, or husky, so nothing is currently blocked — but the instrument is
   dark, and **the chair should know a governed re-freeze is already owed.** If a mint is
   being cut for EP-1 anyway, the marginal *cost* of riding `minKeys` along would drop —
   **the recommendation is still AGAINST, because the marginal benefit is zero.**

2. **The `~22` framing in the ODQ §338.1 charter should be retired.** Measured, the cohort is
   **33 file-rows / 26 distinct identities / 47 reads / 4 files** (chronicleFeed 24 + mutate 5
   + NarrativeArchivePanel 3 + campaignCanon 1 = 33). The honest split is **4 M9-admissible
   identities** vs **22 non-admissible** — so "~22" is the *refused* remainder, not a count of
   rows needing exemption. Both the brief and the charter use the figure loosely.

3. **`stresses on institutions` (brief §3 residue) is still live at the pinned tip** —
   `src/pdf/lib/viewModelBodySlices.js`, `inst?.pressures || inst?.stresses`. The brief flagged
   it as "unverified whether it survives, cheap to check." Checked: it survives, untagged. Not
   covered by Ruling A (different shape). Still wants its own triage.

4. **`test on test` remains deliberately deferred** and is documented as such in the
   instrument. Not a bug to re-find.

---

## 9. RECEIPTS

| artifact | path (session scratchpad) |
|---|---|
| Probe 1 — delta, per-family detail, eventLog sites | `MEAS-minkeys-probe.mjs` (in `MEAS-tree/scripts/`), result `MEAS-minkeys-result.json`, log `MEAS-minkeys-run.log` |
| Probe 2 — proximity, fragility, address-level baseline reproduction | `MEAS-minkeys-probe2.mjs`, result `MEAS-minkeys-result2.json` |
| Re-run at the new tip `27c250f9` | `MEAS-minkeys-result-newtip.json` |
| Pin control / mutant | `MEAS-test-control.log` (exit 0) / `MEAS-test-mutant.log` (exit 1) |
| Full OSR suite control / mutant | `MEAS-osr-control.log` (240 pass) / `MEAS-osr-mutant.log` (239 pass) |
| Extractions | `MEAS-tree/` (3ac279db), `MEAS-tree-freeze/` (3df85a3a), `MEAS-tree-new/` (27c250f9) |

All extractions were restored to pristine `minKeys: 8` after the mutant runs and verified by
`grep`. The repository working tree was never written to.

**Labelling:** every figure in §1, §3, §4, §5, §6 is **CONFIRMED** — executed, with quoted
output and paired controls. §8.1's *consequence* ("the gate returns 1") is **CONFIRMED at the
digest-inequality level** and follows directly from the quoted `run()` source; the gate CLI
itself was not run, because it requires a clean committed tree with git provenance and the
shared worktree is dirty with other lanes' work.

*The chair rules. This lane measured only.*
