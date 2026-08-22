# laneTEWF1E — EXECUTOR RECEIPT for packet WF-1E

- **Lane:** TE-WF1E (executor). Chair CASes; this lane moves no ref.
- **Base:** `claude/composite-r4` @ `f5332cf70520a1cdef6cc326ae000acec118da85` (MF-T2C's landing).
- **Worktree:** `<scratchpad>/tewf1e-tree`, detached at the base, its OWN `node_modules`
  (`npm ci` TRUE_EXIT=0, log `laneTEWF1E-npmci.log`).
- **Work order:** `<scratchpad>/draft-WF-1E.md`, chair-reviewed at ODQ §333.
- **Governing rulings:** §333.1 split ratified · **§333.2 Q4 RULED** (DRAFT gate lifted) ·
  §333.3 name ratified · §333.4 copy ships as compiled, owner-reviewable · §333.5 census
  sequencing · §337 parallel executors + soak.

---

## §1 · PREFLIGHT — THE §11 STEP-8 STOP, EXECUTED AT MY OWN BASE

### 1.0 Preamble citation

`docs/implementation/preambles/WF-PREAMBLE.md` SHA-256 at my base:

```
f4cd39fee756c3a192710ab9aa3fc208e18ef1f08ea9e9073bcdc8bfb55d871c  docs/implementation/preambles/WF-PREAMBLE.md
     780 docs/implementation/preambles/WF-PREAMBLE.md
```

**MATCHES the draft's cited SHA byte for byte.** The preamble is unmoved; every §P law binds
as compiled.

### 1.1 The effective-line instrument

Built at `<scratchpad>/laneTEWF1E-eff.mjs`, MIRRORING `tests/lint/sizeBaseline.test.js`
exactly: eslint's own `Linter` (`configType: 'flat'`), rule
`max-lines {max:1, skipBlankLines:true, skipComments:true}`, languageOptions
`{ecmaVersion:'latest', sourceType:'module', parserOptions:{ecmaFeatures:{jsx:true}}}`.
⚠ It resolves `eslint` from **the worktree's OWN `node_modules`** by absolute path (the
recorded lane hazard: a sibling's modules are not mine).

### 1.2 §10 PREMISE MAP — ALL TWELVE ROWS RE-DERIVED AT `f5332cf7`

| id | draft's figure at the pin | MY measurement at my base | verdict |
|---|---|---|---|
| P-1 | `pulseKernel.js` 1581 eff vs frozen 1581; `:1773` the ONE production call | **1581 eff** (wc-l 2865); `:1773` sole `src` call site | ✅ REPRODUCES |
| P-2 | projector signature five-param, `simulationRules`-free | `projectReligionStateOntoSettlement(settlement, religionStates, saveId, pietyByCid = null, martialByCid = null)` at **`:603`** | ✅ REPRODUCES (address correction below) |
| P-3 | DS-FTH-1 row at `warFaith.generated.js:2113` | title at **`:2113`**, verbatim as compiled | ✅ REPRODUCES |
| P-4 | 12 FaithSection prose-numerics rows ending line 188; baseline 413 rows | **413 rows total; 12 FaithSection rows** at lines 49/53/174/176/179/188; no other member file keyed | ✅ REPRODUCES |
| P-5 | no member path in any edge-bundle meta `inputs` | **5 committed metas, 0 hits** for religionState/faithPanelModel/FaithSection/pulseKernel | ✅ REPRODUCES |
| P-6 | lighting tuple `2490/364/2126/20663/5778` | walker's live constant at **`:5001`**: `files: 2490, parked: 364, credited: 2126, titles: 20663, suiteTitles: 5778` | ✅ REPRODUCES |
| P-7 | `PACKET_MANIFEST.json` 135 rows, zero non-terminal | **135 rows: 134 LANDED + 1 SUPERSEDED, zero non-terminal**; WF-1A/1B/1C/1D all LANDED | ✅ REPRODUCES — no path reserved |
| P-8 | religionState 368 / faithPanelModel 117 / FaithSection 225 eff; none baselined | **368 / 117 / 225** eff; none in `.size-baseline.json` | ✅ REPRODUCES |
| P-9 | `religionState.js` any-cast allowance ZERO | **absent** from `tests/lint/.domain-any-baseline.json` | ✅ REPRODUCES |
| P-10 | Q4 unruled through §332 | ⚠ **CORRECTED — a ruling LANDED**: ODQ §333.2 rules Q4 | ✅ gate LIFTS |
| P-11 | no preset declares `faithUnseatingEnabled`; virtual | `in DEFAULT? false` · `normalized({}) has key? false` · `ENGINE_GATED includes? true` | ✅ REPRODUCES |
| P-12 | both component test files census-credited straight-line | `faithPanelModel.test.js` ONE describe (`:11`) + 6 `it`; `faithSection.test.jsx` TWO describes (`:77`, `:122`) + 8 `it`; **no `.each`, no `runIf`** | ✅ REPRODUCES |

**Zero-headroom four, measured on BOTH instruments at base (the §P1 R-WF-7 table):**

```
797	eff	1264	wc-l	src/domain/worldPulse/peaceTerms.js
818	eff	1045	wc-l	src/domain/worldPulse/warTermination.js
1581	eff	2865	wc-l	src/domain/worldPulse/pulseKernel.js
941	eff	1329	wc-l	src/domain/worldPulse/applyWorldPulse.js
```

All four match the preamble's frozen table exactly (797 / 818 / 1581 / 941).

### 1.3 CORRECTIONS TO THE COMPILE (recorded per §11.0, WF-1D §13 form)

- **C-1 (address, harmless).** The draft's §2.1 says the projector "opens near `:607`" at the
  pin. At my base — the same commit — it opens at **`:603`**. The draft's own symbol anchor
  (`projectReligionStateOntoSettlement`) resolves correctly, so the two-anchor law absorbs it;
  the packet will carry the measured address. This is the §P0 line-rot law biting a
  parenthetical, not a premise.
- **C-2 (P-10, material and favourable).** The draft graded Q4 OPEN through §332 and carried a
  DO-NOT-PROMOTE-PAST-DRAFT gate. **ODQ §333.2 rules it** — the DS-FTH corpus binds as
  reader-side spelling law via the Lane P mechanism with a section-sliced agreement pin.
  Verified as recorded on the ledger branch `review-fixes-2026-07-08` (tip `d236c7c5`),
  §333 heading at ODQ line 14194. The gate lifts; §2.5's corpus amendment is authorized and
  cites §333.2.

### 1.4 §P8 CAPSULE ADMISSIBILITY — DISCHARGED BY EXECUTION, NOT ASSERTION

`docs/implementation/BASE_STATE.json` `stampedAt` = **`b8946403`**; my base is `f5332cf7`.
Not equal, so the capsule is citable only as a DOCS-ONLY descendant. Executed:

```
git diff --name-only b8946403 f5332cf7 | wc -l   →  265
```

The window is **NOT docs-only** — it moves `package.json`, `scripts/.size-baseline.json`,
`scripts/mutation-coverage-manifest.json`, `scripts/audit/**`, `e2e/**`, `public/**` and `src/**`.

⇒ **THE CAPSULE IS NOT CITABLE AT MY BASE.** WF-1A's finding reproduces exactly. Every figure
in this receipt is re-executed rather than cited, which is what §P8's closing sentence requires
regardless.

### 1.5 Baseline instrument states, captured BEFORE the first edit

- Census walker at the **pristine** base: `tests/lint/sovereigntyLightingContract.walker.test.js`
  → `Test Files 1 passed (1) · Tests 33 passed (33)`, **TRUE_EXIT=0**
  (`laneTEWF1E-census-base.log`).
- `scripts/.test-ratchet-baseline.json` carries entries naming `warCost`, `warRuling` and
  `clampPrimitive` — the five estate-baseline banked reds my dispatch names. A bare-vitest red
  on those titles is not mine (the L3 corollary).

---

## §2 · THE IMPLEMENTATION, AND ITS MEASURED DELTAS

Commit **`3ac279db4232cc65abb57c4fa016578efd0f695d`**, a direct child of the base. 12 files,
852 insertions / 12 deletions. Worktree clean afterwards; `git diff HEAD` empty, so the
COMMITTED tree is byte-identical to the tree every proof below ran against.

⚠ The pre-commit hook ran `eslint --fix` over my eight JS files and re-updated the index. That
is an edit after a green run, so the green was VOIDED and re-earned: `git diff HEAD --stat` is
empty and the effective-line instrument was re-run on the committed tree (kernel still 1581).
The hook's own backup stash was cleaned up by the hook; the `stash@{0}` visible in the worktree
is the OWNER'S pre-existing stash from `analytics-intelligence-layer` and is untouched.

| file | eff before | eff after | Δ |
|---|---:|---:|---:|
| `src/domain/worldPulse/religionState.js` | 368 | 369 | +1 |
| `src/domain/worldPulse/pulseKernel.js` | 1581 | **1581** | **0** |
| `src/components/settlement/faithPanelModel.js` | 117 | 124 | +7 |
| `src/components/settlement/FaithSection.jsx` | 225 | 226 | +1 |

**Total new/changed effective production lines: 9 of the 400 budget.**

### 2.1 ⛔ NET-ZERO PROOF FOR THE ZERO-HEADROOM FILE, BOTH INSTRUMENTS, BOTH SIDES

```
BEFORE:  1581  eff   2865  wc-l   src/domain/worldPulse/pulseKernel.js
AFTER :  1581  eff   2865  wc-l   src/domain/worldPulse/pulseKernel.js
git diff --numstat src/domain/worldPulse/pulseKernel.js  →  1	1
```

One line changed IN PLACE; none added, none deleted, none moved. **Stream identity stated
affirmatively:** `rng.fork` sites 22 before / 22 after (matching R-BLD-10's recorded figure),
draw-constructor sites 2 before / 2 after; the sixth argument is `simulationRules`, a value
already computed at `pulseKernel.js:307`, not a new draw.

**The other three zero-headroom files were re-measured for the record and are UNTOUCHED:**
`peaceTerms.js` 797 eff / 1264 wc-l · `warTermination.js` 818 / 1045 · `applyWorldPulse.js`
941 / 1329 — each equal to the preamble's frozen table.

### 2.2 The prose-numerics bill, priced to zero and PROVED

FaithSection hunk headers: `@@ -75 +75 @@`, `@@ -195 +195 @@`, `@@ -197 +197,2 @@`. The first
two are in-place single-line rewrites; only the third adds a line, at **197**. All twelve
hand-keyed baseline rows sit at lines 49/53/174/176/179/188, so **no row can move**, and
`tests/lint/proseNumerics.test.js` is green.

---

## §3 · THE FIXTURE, RUN AND PRINTED BEFORE ANY PIN WAS WRITTEN (§9 headnote)

Probe `laneTEWF1E-fixture-probe.mjs`, run against the PRISTINE `git archive` tree of the base
(`laneTEWF1E-probe-pristine.log`) and then against the wired tree (`laneTEWF1E-probe-wired.log`),
same harness. Deities arrive by the doctrine path; the ring is written by its ONE sanctioned
writer and **asserted present before any arm consumes it**.

| arm | PRISTINE | WIRED |
|---|---|---|
| ring seeded (non-vacuity control) | `[{ref:custom:lu_faded, cause:discredited, atTick:12}]` | same |
| ABSENT `{}` — has `patronFall` key | false | false |
| FALSE `{…:false}` — has key | false | false |
| LIT `{…:true}` — has key | **false** | **true**, value = the ring record verbatim |
| absent ≡ false (bytes) | true | true |
| lit ≡ absent (bytes) | true | **false** |
| lit, NO ring — has key | false | **false** (the flag-AND-ring fence) |
| lit→dark on the SAME state | n/a | **key gone** (the self-heal) |
| all four causes render | all `undefined` | all four exact compiled sentences |

⭐ The pristine column is the pre-wiring golden: the world really projects (patron Aurum, both
creeds, `unaffiliated` present) and yet NO arm carries the key — so the wired lit arm is the
only thing that moved, and the byte-identity claims are not comparisons of two empty objects.

---

## §4 · MUTANTS — EXECUTED (`laneTEWF1E-mutants.log`)

Planted by `cp`, `node --check`ed where the file is JS, convicted, restored and **proved
digest-exact by `md5`**. Never the `git checkout` family. Post-restore: **20/20 green**.

| mutant | predicted | **MEASURED** | restore |
|---|---|---|---|
| (a) unflagged projection (gate on the RING ALONE) | A2 | **A2 + A5** | md5 exact |
| (b) eager key (unconditional `patronFall: null`) | A3 (A2 may) | **A1 + A2 + A3 + A5** | md5 exact |
| (c) unrendered surface | A6 alone | **A6 alone** ✓ | md5 exact |
| (d) widened vocabulary (delete one key) | A1 alone | **A1 + A6** | md5 exact |
| (e) stale corpus (amend doc, skip generator) | A4 alone | **A4 alone** ✓ | md5 exact |

### ⭐ THE §P2.10 ENTANGLEMENT STOP — CHECKED, DOES NOT FIRE

Assertion-level detail captured for (a) and (b):

```
(a)  A2  expected '{"patron":{"name":"Aurum",…' not to be '…'   (the byte differential)
     A5  expected { …(6) } to not have property "patronFall"     (the self-heal)
(b)  A1  expected null to be 'The patron fell — discredited: …'
     A2  expected '{"patron":{"name":"Aurum",…' not to be '…'
     A3  expected { …(6) } to not have property "patronFall"
     A5  expected { …(6) } to not have property "patronFall"
```

The arm sets DIFFER: **(a) leaves A1 and A3 GREEN where (b) reds both.** A3 is the
discriminator — it separates the FLAG fence from the KEY-CONDITIONALITY. Neither guard subsumes
the other, so no re-shape is owed and the STOP does not fire.

---

## §5 · THE CENSUS — RE-DERIVED BY PLACEHOLDER-AND-CONVICT AT MY OWN BASE

The tuple line was set to a deliberate **placeholder of zeroes** and the SEQUENCED walker was
made to convict on each figure in turn. ⛔ No figure was obtained by adding.

| # | figure | conviction message, verbatim |
|---|---|---|
| 1 | `files` | `the estate's file count moved — re-measure, do not re-word: expected 2490 to be +0` |
| 2 | `parked` | `the parked-file count moved from SP-C's measured 358 …: expected 364 to be +0` |
| 3 | `credited` | `the credited-file count moved from SP-C's measured 1,960: expected 2126 to be +0` |
| 4 | `titles` | `the live TEST-title count moved from SP-C's measured 18,471 …: expected 20669 to be +0` |
| 5 | `suiteTitles` | `the live SUITE-title count moved from SP-C's measured 5,260 …: expected 5778 to be +0` |

**`2490/364/2126/20663/5778` → `2490/364/2126/20669/5778` — +6 TITLES ONLY.**

⚠ **Honesty note on figure 4.** The conviction message (the walker's own measurement) is the
evidence for 20669. I had also written 20669 into the same shell command before reading that
message, so the value was independently *predicted* as well as convicted; the conviction stands
on the walker's assertion, not on my arithmetic, and the green run below confirms it.

⭐ **`suiteTitles` PROVED SEPARATELY**, because a sequenced census that stops early never
executes its later figures: the WHOLE member diff over `tests/` was grepped for added
`describe(` lines and the count is **ZERO**; added `it(`/`test(` lines count **6**. Both
independently corroborate the convictions.

Re-record block appended AFTER every existing block — **61 `RE-RECORDED` blocks present**, mine
last in landing order (the merge-destroys-cures shape lives on this file). Authorizing decisions
named in the block and in the packet body: ODQ §333 / §337 (§299.4's binding-forward rule).
Walker green: `Test Files 1 passed · Tests 33 passed`.

---

## §6 · PROOF TABLE — every exit captured IN-SHELL

| step | result | TRUE_EXIT |
|---|---|---|
| `npm ci` (own node_modules) | ok | **0** |
| §31 anchor preflight, BARE, at the PRISTINE base | 9 passed | **0** |
| census walker at the PRISTINE base | 33 passed | **0** |
| behaviour battery, 10 files | **110 passed** | **0** |
| walker battery, 8 files | **116 passed** | **0** |
| `npx eslint` × 4 production + 2 test files | clean | **0** |
| `npm run typecheck:ratchet` | `no type regressions (173 error(s), ceiling 173)` | **0** |
| `npm run typecheck:domain:strict` | `no strict-type regressions (1134 errors, ceiling 1134)` | **0** |
| `npm run gen:dossier-prose` | 58 blocks / 2153 variants; artefact moved 1 line | **0** |
| `validate:packets` @ DRAFT | `valid: 136 packets (0 READY)` | **0** |
| `validate:packets` @ READY | `valid: 136 packets (1 READY)` | **0** |
| `validate:packets` @ LANDED | `valid: 136 packets (0 READY)` | **0** |
| `git commit` | 12 files, 852+/12- | **0** |

⚠ Both typechecks are reported at their exact floors with the config named, per §P5.

---

## §7 · THE ONE PRE-EXISTING RED — EARNED EMPIRICALLY, NOT ASSUMED

`tests/docs/enforcement-claims.test.js` :: *"every completeness claim carries an @enforced-by
tag with ≥1 target"* fails with **six** offenders: `docs/FABLE_VALIDATION_QUEUE.md` ×4,
`docs/GOLDEN_SHIFT_LEDGER.md` ×1, `docs/implementation/packets/foreign-policy/IN-0C.md` ×1.

**Why it is not mine, proved three ways:**
1. The identical test fails identically (`1 failed | 20 passed`) at the **pristine `git archive`
   tree of `f5332cf7`** — a tree containing none of my edits.
2. The title is a **BANKED row** in `scripts/.test-ratchet-baseline.json`, whose recorded cause
   names `docs/FABLE_VALIDATION_QUEUE.md:179` (the R-BLD-10 chair ruling row).
3. My own `CLAIM_RE` scan over all three docs I authored or amended returns **ZERO**, and the
   offender count is **six at pristine and six wired** — I added nothing to the debt.

⚠ **This is a SIXTH banked red beyond the five the dispatch named** (warCost / warRuling walkers
+ clampPrimitive). Recorded here so a later lane does not re-find it. **Not repaired in passing.**

---

## §8 · JUDGMENT CALLS (vetoable)

- **J-TEWF1E-1 — `FALL_SENTENCE` EXPORTED rather than module-local.** The compile said
  module-local. A1's key-set equality against `PATRON_FALL_CAUSES` — the draft's own acceptance
  requirement and mutant (d)'s target — cannot be written over a module-local constant without
  re-declaring the map inside its own fixture, which is the **fixture-mirrors-deriver** vacuity
  class §P2.9 forbids outright. Exporting is the only non-vacuous route. *Veto: drop the
  equality arm, pin totality behaviourally only, and accept that an over-wide map goes unseen.*
- **J-TEWF1E-2 — model key ALWAYS-PRESENT-null; persisted key CONDITIONAL-ABSENT.** Adopted from
  the compile unchanged.
- **J-TEWF1E-3 — the new key is appended LAST in the `faithProfile` literal.** Existing keys keep
  their order, so nothing an existing golden serializes can move. *Veto: place it beside
  `unaffiliated`.*
- **J-TEWF1E-4 — the fall renders FIRST in the cause block.** A6 pins the ordering by comparing
  positions rather than presence. *Veto: render after the piety sentences.*

## §9 · RAISED TO THE CHAIR

- **RAISED-1 — A4's wording was NARROWED to what is true (packet §12 C-3).** The compile required
  the DS-FTH-1 signature list to EQUAL the live model's key list. **Measured: false** — the bound
  list is 9 keys, the model returns 13 (`hasEmbed`/`effects`/`contested`/`patronSecurity` sit
  outside it, exactly as the compile's own P-3 row states). A strict equality pin was unwritable
  without widening the corpus far past the smallest amendment. A4 ships as the section-sliced
  round trip (corpus ≡ generated — the arm that carries the Lane P law and the one mutant (e)
  convicts) PLUS measured containment against a real built model.
- **RAISED-2 — sequencing.** MF-T2D also re-records the lighting tuple. Mine was derived by
  conviction at `f5332cf7`; if the branch moves before the CAS it is re-derived by conviction
  again and never carried (§333.5, §325.2).

---

## §10 · CHAIR RULINGS ON THIS LANE'S RAISED ITEMS (received at the terminal request)

The chair granted the terminal GO and ruled all three items. Recorded here as directed.

- **The sixth banked red — ACKNOWLEDGED and EXPECTED.** The chair reads the pristine-base
  reproduction plus the `scripts/.test-ratchet-baseline.json` row as exactly the §332.1
  discipline (a baseline LOOKUP, never an inference). Six offenders at pristine and six wired
  ⇒ this member's contribution is zero, and the gate's ratchet holds at its frozen set.
- **C-3 / A4's shape — APPROVED AS SHIPPED, and RATIFIED AS A COMPILE CORRECTION.** The strict
  equality pin was refuted by measurement (nine bound keys against thirteen model keys, the four
  outsiders exactly where the compile's own P-3 row puts them). Writing equality anyway would
  have required widening the corpus past the smallest amendment, which violates the spirit of
  the §333.2 Q4 ruling itself. The section-sliced round trip — the arm that actually carries the
  Lane P law and the one mutant (e) convicts — plus measured containment against a real built
  model is the honest pin.
- **J-TEWF1E-1 (exporting `FALL_SENTENCE`) — RATIFIED.** Re-declaring the map inside the fixture
  is precisely the fixture-mirrors-deriver class §P2.9 forbids, and a frozen four-key map on the
  public surface is a trivial widening set against losing mutant (d)'s conviction. The walker
  battery already proves no export census objects. The veto alternative (behavioural totality
  only) is weaker proof and was DECLINED.

⭐ **Standing world-state correction from the chair:** the RS-5 soak **COMPLETED and CLOSED**
while this member was being built (162/162, verdict clean, ODQ §339-§340), so there was no soak
to pause; TE-T2D had not requested a slot, so the terminal ran uncontended. On this member's
green the chair CASes, and T2D rebases onto this tip.

---

## §11 · THE ONE TERMINAL GATE — RUN BARE, GREEN

Run as `npm run check:tail` **BARE**, from a fresh shell, on the chair's explicit GO.
⛔ NOT wrapped in `gate-mutex.sh --run` (its exit 3 is the mutex giving up, not a red); the gate
wraps `test:ratchet` and `verify:dist` in the mutex ITSELF, which is its own internal use.
The exit was captured in-shell into a SELF-NAMED log and is read from **the gate's own tail
line**, never from a pipe or from the harness:

```
[gate-tail] full log: /var/folders/.../gate-tail.15849.log
[gate-tail] exit: 0 (the gate's own status, not a pipe's)
TRUE_EXIT=0
```

| gate step | result |
|---|---|
| `validate:hazard-registry` | OK — 29 classes: MACHINERY 12, PARTIAL 11, DOCUMENT 6, ACCEPTED 0; floor 27 |
| `validate:premortem` | SELF-CHECK OK — 28 predicates, 23/29 registry classes routed |
| **`validate:packets`** | **valid: 136 packets (0 READY)** |
| `validate:data` / `custom-content-manifest` / `migration-head` / `edge` / `map` / `tuning-bands` / `foundry-module` / `mcp-server` | all OK |
| **`typecheck:ratchet`** | **no type regressions (173 errors, ceiling 173)** — exact floor |
| **`typecheck:domain:strict`** | **no strict-type regressions (1134 errors, ceiling 1134)** — exact floor |
| `lint` | **29 problems, 0 errors, 29 warnings** — the estate's standing warning set, unmoved |
| **`test:ratchet`** | **OK — no test regressions (11 known failures of 28,685 tests, ceiling 11)** |
| `build` | built in 22.67s; postbuild wrote 314 static route documents |
| `verify:dist` | STRICT DIST OK — 52 files, 433 tests, zero failed/non-run/uncollected/missing/extra/duplicate |
| **GATE** | **TRUE_EXIT=0** |

⭐ **THE FROZEN 11 HELD EXACTLY.** The banked-red count is 11 of 28,685 against a ceiling of 11 —
the six `enforcement-claims` offenders documented at §7 live inside that frozen set, which is
precisely why the gate is green with them. Nothing was banked, nothing was re-recorded, and
`test:ratchet:update` was never run.

### The separately-owed boot smoke (§P10.2 — the gate does not include it)

```
npm run smoke:boot   →   SMOKEBOOT_TRUE_EXIT=0
boot-smoke: 524 chunks · entry index-B_cUZpC0.js
boot-smoke: stage 2: 524/524 chunks initialised
boot-smoke: stage 3: shell mounted, 31706 B of markup under #root
boot-smoke: PASS — the built bundle boots.
```

---

## §12 · FINAL STATE

- **TIP FOR CAS: `3ac279db4232cc65abb57c4fa016578efd0f695d`** (one commit).
- Parent `f5332cf70520a1cdef6cc326ae000acec118da85`; the branch tip re-read AFTER the gate is
  still `f5332cf7`, so the CAS is a clean fast-forward and **no rebase is owed**.
- Worktree clean. **This lane moved no ref**, ran no `git stash`, and never used the
  `git checkout` family.
