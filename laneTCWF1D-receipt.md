# lane TC-WF1D — VERIFICATION RECEIPT (compile lane; the chair lands)

**OUTCOME, FIRST.** The WF-1d join **FITS AT NET ZERO in `warTermination.js` and the §258.2
substitution doctrine does NOT need to fire for it** — measured, not reasoned: the file goes
**818 → 818 EXACT** with **zero lines added and zero lines removed**, `npx eslint` clean, and the
four landed war suites **50/50 green**. The chartered `pin:dissolution-names-the-fall` fixture was
RUN and its four arms PRINTED before any pin was written. **The `pulseKernel.js` STOP-and-RAISE the
dispatch anticipated DOES NOT FIRE** — the chosen shape does not touch that file at all.

⛔ **BUT WF-1d AS CHARTERED IS REFUSED IN PART, ON THE SAME ARITHMETIC THAT REFUSED WF-1**, and
one of its three deliverables is measured **DEAD — its producer was re-filed out from under it by
two later chair rulings**. Both findings are RAISED below with numbers.

- **Compile base:** `claude/composite-r4` @ `2cdb87fac566b3d6803a0dce9d59df13f07c1c9e` (the dispatch
  tip; re-read at compile — `git rev-parse claude/composite-r4` → `2cdb87fa…`). CONFIRMED.
- **Preamble SHA-256:** `git show claude/composite-r4:docs/implementation/preambles/WF-PREAMBLE.md | shasum -a 256`
  → `ca02c8a165ddbc18ab3f254bebce8cca5dd945e71e074b526227164e9b0cabfd` — **matches the dispatch
  literal exactly.** CONFIRMED.
- **Method:** every figure re-executed at this base against a `git archive 2cdb87fa` tree
  (`…/scratchpad/wf1d-tree`), never against the working tree, which matches no branch. Effective
  lines by **eslint's own `Linter`** under `max-lines {skipBlankLines:true, skipComments:true}` —
  the same engine `tests/lint/sizeBaseline.test.js` uses, verified by reading that file's own
  `effectiveLines()`. Never `wc -l`, never an inherited figure.
- **Seat:** ODQ §291.5 — this lane compiles and prices; **no git write, no gate run, no repo edit.**
  Every patch in this receipt was applied to a throwaway `git archive` copy outside the repo.

---

## §1 · THE TWO ZERO-HEADROOM HAZARDS, RE-MEASURED AT MY OWN BASE (ODQ §316.2A)

`node laneTCWF1D-measure.mjs` (eslint `Linter`), against `scripts/.size-baseline.json` at `2cdb87fa`:

| file | effective | frozen literal | verdict |
|---|---:|---:|---|
| `src/domain/worldPulse/warTermination.js` | **818** | **818** | ⛔ **EXACT — ZERO HEADROOM, shrink-only** |
| `src/domain/worldPulse/pulseKernel.js` | **1581** | **1581** | ⛔ **EXACT — ZERO HEADROOM, both directions** |
| `src/domain/worldPulse/applyWorldPulse.js` | **941** | **941** | ⛔ **EXACT — A FOURTH ZERO-HEADROOM FILE (see RAISED-2)** |
| `src/domain/worldPulse/peaceTerms.js` | 797 | — | 3 under the 800 layer ceiling |
| `src/domain/worldPulse/warTerminationCauseTables.js` | **71** | — | 729 headroom — the extraction home |
| `src/domain/worldPulse/religionState.js` | 368 | — | 432 headroom |
| `src/domain/worldPulse/religiousContest.js` | 470 | — | 330 headroom |
| `src/domain/worldPulse/patronFall.js` | 28 | — | the landed WF-1a leaf |
| `src/components/settlement/FaithSection.jsx` | 225 | — | 375 under the 600 component ceiling |
| `src/components/settlement/faithPanelModel.js` | 117 | — | 683 headroom |
| `src/domain/display/chroniclersLetter.js` | 220 | — | 580 headroom (**WF-1C reserves it**) |
| `src/domain/display/chronicleReadModel.js` | 272 | — | 528 headroom |
| `src/domain/certification/couplingRegistry.js` | 109 | — | 691 headroom |
| `src/domain/worldPulse/realmEvents.js` / `pantheon.js` | 283 / 160 | — | WF-1C's, untouched here |

Both dispatch-named hazards **reproduce exactly** at `2cdb87fa`. CONFIRMED.

⭐ **AND A FOURTH ONE IS MEASURED THAT NO FAMILY DOCUMENT NAMES.** `applyWorldPulse.js` is
**941/941 EXACT** against its own frozen literal. Preamble §P7.8 names only `peaceTerms.js` and
`warTermination.js`; WF-1C's RAISED-A adds `pulseKernel.js`. `applyWorldPulse.js` is the **fourth**,
and it is named in `WF-1A` §3's non-goals as a file WF waves avoid — which is why nobody has
measured it. **RAISED-2** carries it. It matters to WF-1d directly: it was the natural second home
for the join's injection seam, and it is as frozen as the first.

---

## §2 · ⭐⭐ THE JOIN FITS AT NET ZERO — EXECUTED, NOT REASONED

The charter (`DESIGN_FP_ARCH_WF.md` §4-WF-1): *"the dissolution-names-the-fall join lands as a PURE
READ (the receipt site calls the WF-1 leaf's `fallCauseFor(...)`) at NET-ZERO effective lines in
warTermination.js, or the wave STOPS and proposes the extraction recipe (L8)."*

**IT LANDS. The measurement:**

```
--- BEFORE ---
src/domain/worldPulse/warTermination.js          eff=818   baseline=818   EXACT
src/domain/worldPulse/warTerminationCauseTables.js eff=71   baseline=—     no-baseline
--- AFTER (variant B, the recommended shape) ---
src/domain/worldPulse/warTermination.js          eff=818   baseline=818   EXACT
src/domain/worldPulse/warTerminationCauseTables.js eff=83   baseline=—     no-baseline
--- ESLINT ---
ESLINT_TRUE_EXIT=0
--- WAR SUITES ---
 Test Files  4 passed (4)
      Tests  50 passed (50)
```

(`tests/domain/{warTermination,warTerminationPulse,warCostsIntegration,warCoalitionWr6}.test.js`.)

### 2.1 Why it fits — the mechanism, in one sentence

**The prose selector pays for the faith import.** `warTermination.js` reads
`DISSOLVED_CAUSE_PROSE` at exactly ONE site (`:431`, verified by grep — one hit, and the table is
not re-exported). Replacing that raw-table read with a `dissolvedClauseFor(type, fallCause)`
selector that lives in the **already-established extraction home**
`warTerminationCauseTables.js` collapses a four-line import block to two, which buys the
`patronFall.js` import line outright and leaves one line of change budget for the lookup itself.
Everything else is a key or parameter appended to a line that already exists.

⭐ **THE EXTRACTION HOME IS NOT AN INVENTION.** `warTerminationCauseTables.js`'s own header states
why it exists: *"`warTermination.js` … is FROZEN there by `scripts/.size-baseline.json` — zero
headroom … Rather than raise a frozen number — which the baseline's own instructions forbid — the
tables move DOWN into a leaf that has nothing but them."* WF-1d takes the door the WR family
already built for exactly this pressure, which is why this is a **seam**, not a squeeze.

### 2.2 The exact edit, line by line (variant B — RECOMMENDED)

| # | site (symbol-first, two anchors) | edit | Δ eff |
|---|---|---|---:|
| 1 | the cause-table import block, `:90-93` (`DISSOLVED_CAUSE_PROSE` / `TERMINATION_PEACE_PROSE`) | **4 lines become 2** — the collapsed cause-table import **plus** `import { fallCauseFor } from './patronFall.js';`. The faith import IS one of the two | **−2** |
| 2 | `readWarTerminations`, above `const deployments = asObject(state.deployments)` (`:508`) | `const unseating = rules.faithUnseatingEnabled === true;` — the BY-NAME strict gate | **+1** |
| 3 | `terminationReason` params (`:424` `dissolvedCauseTypes,`) | append `fallCause = null,` to the existing line | 0 |
| 4 | `terminationReason` `dissolvedCase` (`:431`) | `DISSOLVED_CAUSE_PROSE[type]` → `dissolvedClauseFor(type, fallCause)` | 0 |
| 5 | above `const attackerName = settlementName(...)` (`:824`) | the per-deployment lookup, one line | **+1** |
| 6 | the `terminationReason({…})` argument line `dissolvedCauseTypes: effectiveCause.dissolvedCauseTypes,` | append `fallCause,` | 0 |
| 7 | the receipt's `decidingTerm,` line (`:892`) | append `...(fallCause ? { patronFallCause: fallCause } : {}),` | 0 |
| | | **TOTAL** | **0** |

⭐ **AND IT IS VERIFIED BY TWO INDEPENDENT MEASURES.** Beyond eslint's `Linter` (818 → 818), a plain
`wc -l` reports **1045 → 1045**. The executed `diff -u` is exactly `-4 / +2` in the import block and
`+2` statement lines elsewhere:

```
-import {
-  DISSOLVED_CAUSE_PROSE,
-  TERMINATION_PEACE_PROSE,
-} from './warTerminationCauseTables.js';
+import { dissolvedClauseFor, TERMINATION_PEACE_PROSE } from './warTerminationCauseTables.js';
+import { fallCauseFor } from './patronFall.js';
...
-  dissolvedCauseTypes,
+  dissolvedCauseTypes, fallCause = null,
-  const dissolvedCase = …map((type) => DISSOLVED_CAUSE_PROSE[type])…
+  const dissolvedCase = …map((type) => dissolvedClauseFor(type, fallCause))…
+  const unseating = rules.faithUnseatingEnabled === true;
+  const fallCause = unseating && effectiveCause.dissolvedCauseTypes.includes('sacred_claim') ? … : null;
-      dissolvedCauseTypes: effectiveCause.dissolvedCauseTypes,
+      dissolvedCauseTypes: effectiveCause.dissolvedCauseTypes, fallCause,
```

⛔ **NOTE THE DISCIPLINE THAT MAKES THIS NOT A SQUEEZE.** Only ONE edit (#1) reformats existing
code, and it reformats an import block whose specifier list genuinely shrinks by one member because
that member is no longer read. Edits #2 and #5 are ordinary one-statement lines with their own
line — **no two-statement cramming anywhere.** #3/#6/#7 append a key or a parameter to a line that
already exists, which is verbatim the idiom WF-1C prices for `pulseKernel.js` M5.

### 2.3 The variant this lane did NOT take, priced

| | **B — direct import + declared coupling row** (RECOMMENDED) | **A — injected reader, no import** |
|---|---|---|
| `warTermination.js` after | **818 EXACT** (executed) | **818 EXACT** (executed) |
| `warTerminationCauseTables.js` | 71 → 83 | 71 → 83 |
| eslint | TRUE_EXIT=0 | TRUE_EXIT=0 |
| war suites | 50/50 | 50/50 |
| `pulseKernel.js` touched | ⭐ **NO** | ⛔ **YES** — one packed import specifier + one packed call key |
| `religiousContest.js` touched | ⭐ **NO** | ⛔ **YES** — a `fallCauseFor` re-export to keep the kernel at +0 |
| shared change path with **WF-1C** | ⭐ **NONE** | ⛔ `pulseKernel.js` (WF-1C M5) |
| new cross-layer pair | 1 (`FAITH→WAR`) | 0 |
| `COUPLING_REGISTRY` row owed | **1** | 0 |
| existing logic files touched | **2** | **4** ⛔ over the cap of 3 |
| two-statement packs | **0** | 1 |

**B is taken (J-TCWF1D-1).** A costs two extra production files — one of them the frozen kernel —
to save one registry row, and it puts WF-1d back onto WF-1C's reserved path for no behavioural
gain. The registry row it avoids is not incidental surface: it is **the coupling the faith volume
already declares** — *"**Couplings (declared in DESIGN_FP_COUPLINGS.md):** FAITH×WAR — the
dissolution receipt prints the fall cause (this wave's export)"*. B makes the chartered coupling
VISIBLE in the registry; A hides it behind an injection seam.

### 2.4 ⭐ THE REGISTRATION BILL IS EXECUTED, NOT PREDICTED

Running the coupling walker against the patched tree returns exactly the predicted obligation, in
the walker's own words:

```
--- COUPLING WALKER ---
AssertionError: expected [ Array(1) ] to deeply equal []
+   "src/domain/worldPulse/warTermination.js imports src/domain/worldPulse/patronFall.js (FAITH→WAR)
     — add its couplingRegistry row in THIS commit (the same-commit obligation,
     DESIGN_FP_COUPLINGS.md §0.3), naming the importer as the row's read address.",
 Test Files  1 failed (1)
      Tests  1 failed | 15 passed (16)
```

**BOTH halves of the instrument measured (§P2.8 — a packet naming one half is defective):**

- **(a) PAIR half — INCURRED, exactly one pair.** `licensingRows(pair)` matches on
  `direction` **and** importer module. Executed:
  `COUPLING_REGISTRY` holds **49** rows, of which **ZERO** are `FAITH→WAR` and **ZERO** name
  `warTermination.js` as `read` or `counterforce`. ⇒ nothing licenses the pair today and the row
  is genuinely owed. ⚠ The four `FAITH→WAR` rows that already exist live in
  `tests/lint/.coupling-inclusion-baseline.json` (152 entries) as grandfathers — including
  `warTermination.js → sacredClaim.js` — and grandfathers never reach the licensing filter.
  ⭐ **The row this wave lands is therefore the estate's FIRST `FAITH→WAR` registry row.**
- **(b) UNLAYERED-MODULE half — NOT INCURRED.** No module is created, so `LIVE_UNLAYERED` does not
  move and `UNLAYERED_BASELINE_CEILING` (**179**, `couplingInclusion.walker.test.js:646`, `.toBe`,
  exact in BOTH directions) stands still. `ARGUED_ROSTER_CEILING` (**20**, `:612`) likewise —
  no `ARGUED_UNLAYERED` entry is added or removed.
- ⚠ **No exact-count pin blocks the row.** Executed over the registry's own suites:
  `couplingRegistry.test.js` asserts `COUPLING_REGISTRY_SCHEMA_VERSION` `.toBe(4)` and otherwise
  only `toBeGreaterThan(0)` / `toBeGreaterThanOrEqual(5)` / derived identities;
  `couplingDesk.walker.test.js` uses `DECLARING_ROW_FLOOR` / `DECLARED_KIND_FLOOR` /
  `AUTHORED_ROW_FLOOR` floors and a `DISPUTED` `toHaveLength(4)` this row does not join.
  ⚠ `couplingReceiptSample.test.js:116` asserts `addresses > COUPLING_REGISTRY.length` — a row
  carrying both a `read` and a `counterforce` address adds 2 to the left and 1 to the right, so the
  inequality widens rather than narrows. **Eleven test files import the registry; the packet names
  all of them in its battery.**

### 2.5 ⛔⛔ THE LEAF'S OWN HEADER SAYS THIS WAVE BREAKS ITS STATED INVARIANT — DECLARED, NOT DISCOVERED

`patronFall.js:21-25`, verbatim: *"⛔ THE FILE NAME IS LOAD-BEARING. It sits under
`src/domain/worldPulse/` beside its ONLY importer (`religiousContest.js`) precisely so
`scanCrossLayerPairs` yields zero pairs and both coupling-registry ceilings stand still."*

WF-1d gives the leaf its **second** importer, and that importer is in another layer. **The ceilings
still stand still** — measured above, both `.toBe` figures unmoved — because the cure is a
*licensing row*, not a baseline bump. But the leaf's header now describes a tree that no longer
exists, and a WF compiler reading it would price this wave wrong. **The packet re-words that
paragraph in the same commit** (M-row), on the WF-1C M2 precedent of correcting a production
comment whose claim the wave falsifies.

---

## §3 · ⚠⚠ RUN THE FIXTURE AND PRINT WHAT THE ENGINE DID — EXECUTED (§P6, standing chair law)

The chartered `pin:dissolution-names-the-fall` fixture, driven against the patched tree at
`2cdb87fa`. Four arms, all printed BEFORE any pin was written:

```
recorded ring on the attacker settlement = {"patronFalls":[{"ref":"sun-old","cause":"discredited","atTick":7}]}
fallCauseFor(ring, "sun-old") = "discredited"

[A · DARK — faith flag off]
  causeState = dissolved   dissolvedCauseTypes = ["sacred_claim"]   patronFallCause = undefined
  reason = "The war has outlived its reason: a god named when the banners rose is no longer
            worshipped from the same throne. Still, Aster's council holds because peace would
            exact the heavier price."

[B · LIT — the ring carries a discredited fall]
  causeState = dissolved   dissolvedCauseTypes = ["sacred_claim"]   patronFallCause = "discredited"
  reason = "The war has outlived its reason: a god named when the banners rose is no longer
            worshipped from the same throne — the creed lost its rightful claim in the town it
            was named from. Still, …"

[C · LIT — ring EMPTY for the pinned ref]
  causeState = dissolved   dissolvedCauseTypes = ["sacred_claim"]   patronFallCause = undefined
  reason = <byte-identical to A>

[D · LEGACY — no anchors on the deployment]
  causeState = anchor_unavailable   dissolvedCauseTypes = []   patronFallCause = undefined
  reason = "Aster's council can still name a living quarrel, though the war's opening anchors are
            lost to the record."

[E · BYTE FENCE]
  dark === empty-ring   : true
  dark === lit-with-fall: false
  landed toContain pin survives, dark: true      lit: true
```

**What each arm buys, and two of them refute a pin that reading alone would have written:**

1. **A vs B is the whole feature** — and B is the LIT-MUTANT CONTROL that proves the fences can see
   (§P6). The absent-vs-false differential alone is blind by design.
2. ⛔⛔ **C IS THE HAZARD, AND IT IS A NEW MEASURED INSTANCE OF THE FAMILY'S CANONICAL ONE.** A LIT
   world whose ring carries **no fall for the pinned ref** is **byte-identical to dark**. So a
   dormancy fixture that lights the flag but never actually records a fall produces **base == cure**
   and a silently vacuous pin — the `PATRON_FLIP_TICKS` 3 / `SHARE_STEP_MAX` 6 hazard and WF-1B's
   `nicheOf` computed-niche hazard, in a third dress. ⭐ **The fixture must write the ring through
   the landed `recordPatronFall` writer, never by poking the object**, and it must use a ref that
   the deployment actually pinned. Stated as a preflight STOP in the packet.
3. ⭐ **D IS THE CHARTERED LEGACY ARM AND IT HOLDS WITHOUT A GUARD.** *"the legacy arm —
   an `anchor_unavailable` war record gets NO invented cause (missing history is not evidence)."*
   Executed: a deployment with no pinned anchors reaches `causeState: 'anchor_unavailable'` with
   `dissolvedCauseTypes: []`, so the lookup's `includes('sacred_claim')` guard is false and no cause
   is invented. **The honesty law is satisfied by the existing control flow, not by a new arm** —
   which means a mutant that deletes the guard must still red, and the packet's MUTANT (c) is
   shaped to prove exactly that rather than to prove an unreachable branch (§P2.9's first vacuity).
4. ⭐ **THE LANDED PIN SURVIVES BOTH WAYS, BY CONSTRUCTION.**
   `warTermination.test.js:262` asserts
   `expect(unseated?.receipt.reason).toContain('a god named when the banners rose is no longer worshipped from the same throne')`.
   `dissolvedClauseFor` returns the base clause **unchanged** dark and **`base + ' — ' + named`**
   lit, so `toContain(base)` holds on both arms. That is why the 50/50 green above is a real
   receipt and not a coincidence. ⚠ The same file's
   `expect(unseated?.receipt.reason).not.toContain('sacred_claim')` also holds: the new clause is
   reader prose and spells no engine token.

---

---

## §4 · ⛔ THE OTHER TWO DELIVERABLES, MEASURED — ONE DEFERRED, ONE DEAD

### 4.1 The Chronicle obituary row has no producer left, and nothing would have caught it

`WF-1A` §5 files *"the FaithSection cause-chain line, the Chronicle obituary row"* under WF-1d. That
pointer was written at `0cf18bed`. Executed at `2cdb87fa`:

| measured | command / address | result |
|---|---|---|
| the Chronicle's row mechanism | `chroniclersLetter.js:80` | `KIND_SECTION`, keyed on **`impactKind`** |
| its faith rows today | `:120` | `pantheon_ascendancy` and `pantheon_twilight`, both `'traditions'` |
| producer (a) — the SETTLEMENT obituary | `WF-1B` §4, quoted | ⛔ **RE-FILED TO WF-8 at ODQ §309** |
| producer (b) — the REALM last-seat beat | WF-1C M4; `laneTEWF1C-receipt.md` §1 | ⛔ **WF-1C's OWN ROW** (`chroniclersLetter.js` md5 `471441b4…`) |
| what WF-1d itself produces | `warTermination.js:841` | a **receipt**, `kind: 'war_termination_read'` — **not an `impactKind`** |

⇒ a WF-1d `KIND_SECTION` row would be a registration row for a kind nothing mints — the
consumerless-row shape the estate forbids (ODQ §73.3 F-1; the same law that CUT `abandoned`).

⛔⛔ **AND IT WOULD HAVE LANDED SILENTLY.** Read in full:
`tests/lint/heraldRouting.walker.test.js` carries *"every `KIND_SECTION` key is itself explicitly
routed"* (`:224`) and *"every recorded divergence names a real `KIND_SECTION` key"* (`:229`) — but
**no arm requires a `KIND_SECTION` key to have a minter**, and a key spelled `faith_*`/`pantheon_*`
routes for free through `heraldRouting.js:357-358`. A dead row would have sat in a frozen table with
every walker green. **That is why the packet refuses it at compile and asserts its ABSENCE (A6)
rather than leaving the refusal as prose.** RAISED-1.

### 4.2 The FaithSection cause-chain line is real, deferrable, and expensive in a way the join is not

Executed, and it is the whole reason the two cannot ride one member:

| measured | result |
|---|---|
| what the panel model reads | `faithPanelModel.js:144` — **only** `settlement.config` + `powerStructure`; its header states the invariant: *"no worldState, no store"* |
| how live faith data reaches it | `config.faithProfile`, sole writer `projectReligionStateOntoSettlement` (`religionState.js:603`) |
| does that writer hold the ring? | ⭐ **YES** — its `state` local IS `religionStates[saveId]` |
| does it hold the flag? | ⛔ **NO** — signature `(settlement, religionStates, saveId, pietyByCid = null, martialByCid = null)` |
| its one production caller | `pulseKernel.js:1773`, a single line |
| ⛔ **DS-FTH-1 binds the model's RETURN SIGNATURE** | `warFaith.generated.js:2113` — *"`faithPanelModel(settlement) → {patron, cults, ranks, piety, unaffiliated, mandate, sinkSentence, live}`"*. A new key **AMENDS** the row ⇒ the corpus source is edited and **`npm run gen:dossier-prose`** runs in the SAME commit (§P2.7; Lane P). ⚠ **Volume Q4 is OPEN at the chair** |
| ⛔ hand-keyed address rot | `FaithSection.jsx` carries **TWELVE** `.prose-numerics-baseline.json` rows, at lines **49, 53, 174, 176, 179, 188** (of 413 total). ⭐ The `<Cause>` block at `:195-198` sits below all of them and the destructure at `:75` takes a name on an existing line ⇒ **add no line above `:174` and the bill is zero** |
| the kernel gate, MEASURED | packing `simulationRules.faithUnseatingEnabled === true` as a sixth argument onto `:1773` leaves `pulseKernel.js` at **1581/1581 EXACT**, `eslint` TRUE_EXIT=0; `simulationRules` (`:307`) is in scope — executed top-level brace scan shows `simulateCampaignWorldPulse` (opening `:241`) still open at `:1773` |
| IMPORT, traced | `scrubImportedConfig` (`importScrub.js:36`) **drops `faithProfile` outright** ⇒ no import-validation arm is owed |
| ⚠ the dark fence | **NOT the ring's presence.** Gating on `state.patronFalls` alone renders the line in a world lit once and then darkened, because the ring is immutable history. The flag read is what makes the fence honest — which is why the kernel touch is OWED, not optional |

**The full seed is `laneTCWF1D-WF-1E-seed.md`**, so the deferred member's compiler re-executes rather
than re-discovers.

---

## §5 · THE SPLIT, PRICED WITH NUMBERS (the dispatch asked for one-member vs split)

| limit (`PACKET_STANDARD` default) | **Shape 1** — ONE member | **Shape 2** — TWO members |
|---|---:|---:|
| behavior families 1 | 2 ⛔ | 1 / 1 ✓ |
| user-facing surfaces ≤1 | 1 ✓ | 0 / 1 ✓ |
| direct production consumers ≤2 | 3 ⛔ | 1 / 2 ✓ |
| **existing logic files modified ≤3** | **6 ⛔ +3** | **3 / 3** (both AT CAP) ✓ |
| registration-only ≤3 | 1 ✓ | 1 / 0 ✓ |
| **handwritten files ≤12** | **14 ⛔ +2** | **7 ✓ / 9 ✓** |
| new/changed effective production lines ≤400 | ~75 ✓ | ~35 / ~40 ✓ |
| **acceptance cases ≤8** | **≥10 ⛔ +2** | **6 ✓ / 6 ✓** |
| **overrides needed** | **THREE** | **NONE** |

**Shape 1 is REFUSED by arithmetic on three hard caps simultaneously** — the same refusal-in-part
shape chartered WF-1 took on five (`WF-1A` §0; preamble R-WF-8). ⭐ **And the split line is not
arbitrary: the two halves share NO production path, no data structure, no flag-read site and no
obligation.** D1 is a WAR-file seam owing a coupling row; D2 is a display projection owing a DS-FTH-1
corpus amendment and a generator run. Neither reaches the other's files.

⚠ **THE ONE FILE THEY SHARE IS THE CENSUS WALKER**, so in a two-member train only the LAST
tests-moving member names it (`DESIGN_BUILD_EFFICIENCY.md` §2.3), and the other member's titles land
against a stale tuple — **a PLANNED INTERIOR RED that §P7.15 requires be named in the train plan
before it exists.** Recorded in the seed.

---

## §6 · EVERY OTHER FIGURE, RE-EXECUTED AT THIS BASE

| register / instrument | measured at `2cdb87fa` | WF-1D |
|---|---|---|
| lighting census tuple | `2485/364/2121/20611/5768` (`sovereigntyLightingContract.walker.test.js:4870`) | ⛔ **the packet's starting figure is POST-WF-1C — `2485/364/2121/20618/5768` — and §11 step 8 makes re-reading it a STOP.** Predicted delta `+0/+0/+0/+6/+0` |
| `PACKET_MANIFEST.json` | **131** rows: 130 LANDED + 1 SUPERSEDED, **ZERO non-terminal** | 132 after WF-1C; no path collision either way |
| `COUPLING_REGISTRY` | **49** rows; **ZERO** `FAITH→WAR`; **ZERO** naming `warTermination.js`; `COUPLING_REGISTRY_SCHEMA_VERSION` **4** | ⛔ **INCURRED — M3 is the estate's first `FAITH→WAR` row** |
| `.coupling-inclusion-baseline.json` | **152** entries, four of them `FAITH→WAR` grandfathers (incl. `warTermination.js → sacredClaim.js`) | grandfathers never reach the licensing filter |
| `ARGUED_ROSTER_CEILING` / `UNLAYERED_BASELINE_CEILING` | **20** (`:612`) / **179** (`:646`), `.toBe`, exact both directions | both stand still |
| registry count pins | none: `couplingRegistry.test.js` → `toBeGreaterThan(0)` / `toBeGreaterThanOrEqual(5)`; `couplingDesk.walker.test.js` → three FLOORs + `DISPUTED` `toHaveLength(4)` | ⭐ no census literal moves. ⚠ `couplingReceiptSample.test.js:116` needs `addresses > COUPLING_REGISTRY.length` ⇒ **M3 must carry BOTH a `read` and a `counterforce` address** |
| suites importing the registry | **eleven**, enumerated by execution | all named in the packet's §12 battery |
| edge-shared closures | `aiCharter` **110** · `aiOutputSchema` **111** · `aiGrounding` **66** · `analyticsEvents` **2** · `intentAtlas` **2** inputs | ⭐ **zero hits on all four production paths** ⇒ §104.4 NOT INCURRED, derived rather than waved through (M4 is comment-only, the trigger shape) |
| `.prose-numerics-baseline.json` | **413** rows | ⭐ **ZERO** key any WF-1D file. **TWELVE** key `FaithSection.jsx` — recorded for the deferred member |
| `negativeAssertionAnchor` preflight | **9 passed, TRUE_EXIT=0** (bare, in-shell, self-named log) | ceiling zero; no new file; three arms owe anchors |
| `scripts/.test-ratchet-baseline.json` | `measuredAtSha` `4deb4f02`; **11** banked entries against `CEILING = 17`; `totalTests` **28274**, `totalFiles` **2387** | floors, transcribed from the terminal's own receipt, never predicted |
| `kindPoolFloors` six figures | REGISTRIES **10** · small-family `['INFORMATION']` · `REGISTERED_KIND_COUNT` **112** · `ROUTED_TOKENS` **378** · `LEGACY_UNVOICED_TOKENS` **274** · divergence **8** | all unmoved — WF-1D mints no kind (§4.1) |
| `fallCauseFor` production callers | **ZERO.** One definition (`patronFall.js:146`) and one PROSE MENTION inside a certification string (`subsystemRowsVirtual.js:1268`) — not a call | ⭐ §P2.11's prohibition held through WF-1b and WF-1c; **WF-1D is the chartered second caller** |

### ⛔ A PRE-EXISTING RED, IDENTIFIED — AND THE WRAPPER LIED ABOUT IT ON THE FIRST TRY

`tests/docs/enforcement-claims.test.js` at this base, run bare with the exit captured in-shell:
`1 failed | 20 passed (21)`, **TRUE_EXIT=1**, on *"every completeness claim carries an @enforced-by
tag with ≥1 target"*. Executed against `scripts/.test-ratchet-baseline.json`: that is **banked entry
5 of 11**, so `test:ratchet` does not red on it. ⭐ **The SECOND arm WF-1B found UNBANKED is now
GREEN** — this lane's independent confirmation that the ODQ §313 paraphrase cure landed and held.

⚠⚠ **AND THIS LANE REPRODUCED THE ESTATE'S OWN WRAPPER HAZARD ON ITSELF.** The first run of that
suite was piped through `tail`; the harness reported **TRUE_EXIT=0 over a RED suite**. Re-run bare
with `; echo TRUE_EXIT=$?` it reported 1. **Trust no exit status you did not capture** is not a
proverb in this estate — it fires on the first careless command of every lane, including this one.
The packet's §12 item 2 carries it with the reproduction.

---

### ⭐ THE VALIDATOR HEADER PARSE, SIMULATED AT COMPILE (§P10.4; DESIGN_PREVERIFICATION TTS §2.2)

*"A plan asserting an unexecuted validator sequence is DEFECTIVE at promotion."* So it was executed:
`parsePacketHeader`'s own regexes (`scripts/implementation-packets.mjs`, read at this base and
replicated verbatim) run against `draft-WF-1D.md`:

```
heading        = WF / WF-1D — the war-dissolution join that names the fall (stage 4 of the `wf-1` split promotion)
statusRows     = 1  [ 'DRAFT' ]
baseRows       = 1  "`claude/composite-r4` at `2cdb87fac566b3d6803a0dce9d59df13f07c1c9e`"
verifiedBase   = 2cdb87fac566b3d6803a0dce9d59df13f07c1c9e
verifiedBranch = claude/composite-r4
```

**Exactly one status row and exactly one base row, both parsed.** The status value stands alone on
its line — J-TEWF1B-1's bill, paid in advance rather than at a terminal, where trailing prose left a
landed packet's status `null` and made the manifest disagree with the Markdown. ⚠ The base row is
re-written to WF-1C's landed sha at promotion (§11 step 0); the SHAPE is what this simulation proves.

---

## §7 · CLAIM_RE PRE-SCAN — ALL THREE AUTHORED FILES, CLEAN

⛔ **The pattern was READ FROM the live test file, never re-typed** — transcribing the vocabulary IS
an occurrence (ODQ §313.2; J-TEWF1B-3), and a hand copy would also silently drift.
`laneTCWF1D-claimscan.mjs` extracts `const CLAIM_RE = …` from
`tests/docs/enforcement-claims.test.js` at the compile base and scans line by line:

```
pattern sourced from tests/docs/enforcement-claims.test.js — 10 alternatives, not transcribed here
draft-WF-1D.md                hits=0
laneTCWF1D-receipt.md         hits=0
laneTCWF1D-WF-1E-seed.md      hits=0
CLAIM_RE PRE-SCAN: CLEAN on every target
TRUE_EXIT=0
```

⭐ **The exit is captured IN-SHELL, not read through a pipe** — the same discipline whose absence
this lane tripped over in §6.

⚠ Re-run at the implementing tip: the corpus is *every* root-level `*.md` and `docs/**/*.md` minus a
frozen EXEMPT list, so `docs/implementation/packets/fp/WF-1D.md` is in-corpus the moment it lands.
⚠ The scan is per LINE and the debt is frozen per `<file> :: <matched vocabulary>` key, so a single
new phrase mints a NEW key at count 1 against a frozen 0 and reds a test that passes today.

---

## §8 · JUDGMENT CALLS THIS LANE MADE (all vetoable; all in the packet §13)

- **J-TCWF1D-1 — direct import + coupling row over an injected reader.** BOTH shapes were BUILT and
  MEASURED; both hold 818 EXACT, `eslint` clean, 50/50. Chose the direct import because the injected
  variant costs `pulseKernel.js` (1581/1581) and `religiousContest.js`, taking the member to four
  existing logic files (cap 3) and onto WF-1C's reserved path — to avoid one registry row that is
  itself the coupling `DESIGN_FP_COUPLINGS.md` declares.
- **J-TCWF1D-2 — the prose selector moves to `warTerminationCauseTables.js`.** It is what makes the
  join net-zero at all, and the leaf's own header says it exists to absorb this pressure.
- **J-TCWF1D-3 — attacker's ring before defender's** when both anchors moved, because the receipt is
  attacker-centric by the file's own statement at `:618`.
- **J-TCWF1D-4 — the receipt carries the TOKEN and the sentence carries the PROSE, both.**
- **J-TCWF1D-5 — the battery extends `tests/domain/warTermination.test.js`.**
- **J-TCWF1D-6 (this receipt) — the split is RECOMMENDED, not taken.** §308.3 pre-authorized a split
  for WF-1B at that compile's pricing; **no equivalent pre-authorization exists for WF-1d**, and the
  dispatch asked for a priced comparison rather than a decision. The packet is written as the join
  member alone with the deferred half fully seeded, so the chair can land either shape without a
  second compile — WF-1B's `draft-WF-1B-II.md` precedent.

---

## §9 · RAISED FOR THE CHAIR

1. ⛔⛔ **RAISED-1 — WF-1d's THIRD CHARTERED DELIVERABLE HAS NO PRODUCER LEFT.** §4.1. Both candidate
   producers were re-filed out from under it (ODQ §309 → WF-8; WF-1C's own M4), WF-1d's output is a
   receipt rather than an `impactKind`, and **no instrument in the estate would have reddened on the
   dead row.** The packet refuses it and asserts its absence; **re-scoping a chartered deliverable
   across waves is a chair act and this lane did not take it.**
2. ⛔⛔ **RAISED-2 — `applyWorldPulse.js` IS A FOURTH ZERO-HEADROOM-CLASS FILE, 941/941, AND NO
   FAMILY DOCUMENT SAYS SO.** §P7.8 names two; WF-1C's RAISED-A adds `pulseKernel.js`; this is the
   fourth. ⭐ **RAISED-A and this row should land as ONE preamble edit** rather than two.
3. ⚠ **RAISED-3 — THE DEFERRED MEMBER'S NAME AND PLACEMENT** (`WF-1D-II` / a new `WF-1E` / re-filed).
   ⛔ **This packet's own path carries no suffix either way** — J-TEWF1B-2's recorded lesson. ⚠ The
   deferred half also carries a **DS-FTH-1 corpus amendment**, so it touches volume **Q4, OPEN at the
   chair**, and may need that ruling before it can promote. **The join half does not.**
4. ⚠ **RAISED-4 — A LANDED CERTIFICATION ROW MAKES A PREDICTION ODQ §309 FALSIFIED.**
   `subsystemRowsVirtual.js:1268` says *"WF-1d lands the war-dissolution join that consumes
   `fallCauseFor`, and WF-1b the obituary beat."* The first clause is what this packet makes true;
   the second is wrong since §309. ⛔ Out of this packet's closed manifest; offered with its
   measurement, not made. The row would still grade UNOBSERVED after this landing.

### Inherited dispositions re-verified rather than assumed

- **`deityNameForRef` (WF-1C RAISED-B): REFUSED IN-MEMBER, STILL OPEN, AND WF-1D IS UNAFFECTED.**
  `laneTEWF1C-receipt.md` §6.2 records the §316 refuse-arm firing — a live, unflagged surface shares
  the helper. Its executed census shows **exactly ONE caller in `src`, `realmEvents.js:273`**. ⛔ No
  file WF-1D names reads it, and **this member prints no deity name at all** — the clause names the
  act, not the god. ⇒ if the chair takes RAISED-B, **WF-1D re-records nothing.**
- **WF-1C's anchor-marker lesson is folded into the packet's §11 step 1 and §6** — three negatives in
  its battery carried `// anchored:` as the FIRST line of a multi-line comment and the walker read
  the last.
- **WF-1C's fixture-refutation lesson is folded into §11 step 10** — the analogue here is that the
  wrong RING, not the wrong snapshot, makes this battery vacuous.

---

## §10 · WHAT THIS LANE DID NOT DO, STATED AFFIRMATIVELY

- **No git write, no gate run, no repo edit — and it is PROVED rather than asserted.** Every patch
  was applied to throwaway `git archive` copies (`wf1d-probe`, `wf1d-probe2`, `wf1d-probe3`) outside
  the repo; no `git add`, commit, stash or checkout was issued.
  ⚠⚠ **THE MAIN WORKTREE'S `git status` IS NOT A SAFETY CHECK HERE AND THE RECORDED HAZARD FIRED
  EXACTLY AS WRITTEN.** It sits on the LEDGER branch `review-fixes-2026-07-08`, so build-branch paths
  show as `D` and `src/domain/worldPulse/pulseKernel.js` shows as `M` with 203 insertions / 541
  deletions. **None of it is this lane's.** The decisive proof is content, not status:
  `grep -c` for this lane's probe packing string in the live `pulseKernel.js` returns **0**, and the
  file's mtime is **2026-07-22**, a month before this session. The `M` is the ledger branch's own
  divergence.
  ⛔ **Foreign WIP elsewhere in that tree is the owner's and was preserved untouched.**
- **The full gate was NOT run** — it is the terminal executor's, per the seat model, and the
  gate-mutex law forbids this lane wrapping it.
- **`typecheck:ratchet` / `typecheck:domain:strict` were NOT run.** The packet names both with the
  WF-1B nine-error precedent as the reason M2's new export must be typed explicitly; the floors are
  the executor's to report at its own window.
- **The mutants were NOT planted.** They are specified with predicted convictions and the
  redundant-guard STOP; the executor plants and convicts them.
- **The deferred member was NOT compiled as a packet** — only seeded (`laneTCWF1D-WF-1E-seed.md`),
  because its name and placement are RAISED-3 and its DS-FTH-1 amendment touches an OPEN chair
  question.
- **`WF-1A` §5's Chronicle deliverable was NOT quietly dropped.** It is refused with a measurement
  and an assertion (A6), and RAISED-1 puts the disposition in front of the chair.
- **The variant-A patch was built and measured but is NOT recommended** — it is priced in §2.3 so a
  veto has numbers behind it rather than a re-compile.

## Helper inventory (this lane's own, all under `laneTCWF1D-*`)

`laneTCWF1D-measure.mjs` (eslint `Linter` effective-line measurement) · `laneTCWF1D-patch.mjs`
(variant A) · `laneTCWF1D-patch2.mjs` (variant B, recommended) · `laneTCWF1D-fixture.mjs` /
`laneTCWF1D-fixture2.mjs` + their `.log`s (the two-flag dissolution fixture) ·
`laneTCWF1D-claimscan.mjs` + `.log` · `laneTCWF1D-measure-base.log` · `laneTCWF1D-anchor-base.log` ·
`laneTCWF1D-claims-base.log` · `laneTCWF1D-src-*.md` (the binding documents extracted at the base) ·
`laneTCWF1D-WF-1E-seed.md` (the deferred member's compile seed) · the throwaway trees `wf1d-tree`
(pristine base), `wf1d-probe` (variant A), `wf1d-probe2` (variant B), `wf1d-probe3` (the D2 kernel
packing measurement) — **left in place for chair verification**, each with a `node_modules` symlink
into the main checkout.
