# RECEIPT — LGT-P4-READER (L-HOMES CAR 6, the Remembrance reader RR-2) — ✅ COMPLETE

**Lane** L-HOMES-6 / `LGT-P4-READER` · **Seat** Opus 5 — Fable-unvalidated · **Chair** Fable 5.1
**Dock** `$SC/laneLH6`, opened detached at `38474a59eba460f30d6596dcb65efda3a446738a`.
**Arrival verified:** HEAD == `38474a59e` ✅ · `git status --porcelain --untracked-files=all` = **0 lines** ✅ ·
`node_modules` = per-package symlinks, NOT materialised ✅ · detached ✅.
**DOCK TIP AT CLOSE: `35aaeb4bad5759ee476fd43a106c844b25cd8d0e`** · porcelain **0** · `git diff HEAD` **empty**.
No rebase, no push, no ref write, **no register act**, no `git stash`, no `git checkout --`,
no `git show HEAD:<path> > <path>`, no `npm install`, no build.
**PLANT-OUT: vacuous by construction — this lane planted nothing.** The only mutation-shaped act was the
FARMED census probe (§6), which ran in `$SC/laneLH6-farm` on a *copy* of `tests/`; the dock's own
`tests/lint/.lighting-census-baseline.json` was verified byte-identical to `HEAD:` by `cmp` afterwards
(`DOCK CENSUS BASELINE UNTOUCHED (cmp ok)`), the farm was deleted, and porcelain is 0.

---

## 1 · WHAT LANDED (two commits)

| sha | what |
|---|---|
| `be0efaffcaecfa1bf6f02534199564085ce2588a` | the reader, both surfaces, the new test file, two stale claims corrected |
| `35aaeb4bad5759ee476fd43a106c844b25cd8d0e` | every negative in the new test file anchored (the walker convicted 11 sites) |

**Six paths, +976/−9 then +26/−13:**

- **NEW** `src/domain/display/warRemembrance.js` (435 lines) — the read-side adapter. It asks
  `classifyWarEnding` for the ending and re-implements none of its branches; resolves the persisted band
  KEYS back to words through the two existing resolvers (`remainingStrengthPhraseFor`,
  `warExhaustionWordFor`); authors every sentence at READ time. Exports `concludedWarRows`,
  `warRemembranceChapterLines`, `warTurningBandKey`, `WAR_TURNING_BAND_KEYS`, `WAR_ENDING_TELLINGS`.
- **M** `src/domain/display/warAndRoadNames.js` — `pinnedReasonOf` → exported as `pinnedWarReasonOf`
  (the casus pins outlive the deployment; the concluded record copies them verbatim, and a second scoring
  rule would let a war change its cause the day it ended). Stale claim corrected (§3).
- **M** `src/components/map/HeraldRemembrance.jsx` (+110) — the war section on the existing lazy door.
- **M** `src/utils/generateWorldBook.js` (+30) — `book.warsEnded`, `sections.warsEnded`, and a
  "Wars that ended" section in the State of the Realm chapter.
- **M** `src/domain/certification/subsystemRowsMemory.js` (1 line) — the W-MEM row said the wave built
  "no Remembrance door"; it names the reader now. **Em-dash count held at exactly 10** so the voice
  register does not move (verified with the walker's own espree counter).
- **NEW** `tests/ui/warRemembranceReader.test.jsx` (386 lines, 8 suites / 21 tests).

---

## 2 · PREMISES RE-DERIVED BEFORE ACTING (a brief figure is the chair's claim, not a fact)

| premise as stated | measured at `38474a59e` | verdict |
|---|---|---|
| **§882.13 rules LIGHTING O-5 BUILD** | verbatim in `docs/OWNER_DECISION_QUEUE.md:32362`, inside THE NINETEEN RULED, "a COMPLETION of the owner's own §881.4 lighting rather than new capability" | ✅ HOLDS |
| `warMemoryEnabled` writes records nobody can read | **0 readers.** The only reads of `worldState.concludedWars` at base are the writer, `residueStripGuard`, `worldState` hygiene, `worldSnapshotPublic`'s allowlist and two certification rows. No display surface, no book | ✅ HOLDS |
| PROSE_RENDER only (CH-9) | `readerRubric.mjs:87` — `LANE_MINTABLE_CAR_CLASSES = ['WIRING','PROSE_RENDER','DISPLAY']`; `PERSISTED_WRITER_PREFIXES` covers `src/domain/worldPulse/` etc., which this car does not write to | ✅ HOLDS |
| LAZY (CH-9) | both consumers already lazy: `HeraldBody.jsx:57` mounts the door through `lazy()`, and `generateWorldBook` is reached only by dynamic import | ✅ HOLDS |
| "the ONE place a new UI test file is justified — it pays **three** censuses" (docket `LIGHTING.json`) | ⚠ **AMENDED.** It pays **ONE exact census (lighting), refreezes TWO totals (test ratchet), and — because this car also adds a src IMPORT EDGE into the World Book — a THIRD register the docket never priced: writer-reach `surfaceReach` + `closureSizes` (§5) | ⚠ AMENDED |
| the census is **6 of 17** (preamble) / the six rows are 4× voiceMechanics + enforcement-claims + clampPrimitiveBaseline (PLAN §8.1) | ⛔ **REFUTED at this tip.** `scripts/.test-ratchet-baseline.json` holds **2** entries: `tests/docs/enforcement-claims.test.js` and `tests/property/generatorGoldenMaster.test.js` (the PROSE golden, banked per CORRECTIONS #7). **The census is 2 of 17** | ⛔ CORRECTED |
| the live register tuple is `2521/371/2150/23184/6214` (PLAN §8.1, measured at `272dbd2da`) | ⛔ **SUPERSEDED.** At `38474a59e` the frozen tuple is **`2523 / 371 / 2152 / 23204 / 6217`** (`measuredAtSha 35b027458`, §899 composed landing) | ⛔ CORRECTED |
| test ratchet `totalTests 31489 · totalFiles 2468` (PLAN §8.1) | ⛔ **SUPERSEDED:** `totalTests 31511 · totalFiles 2470` (`measuredAtSha ec1b5e3e9`) | ⛔ CORRECTED |
| a new `src/domain` leaf owes "four censuses" (PLAN §6 POSITION 2) | ⚠ **NOT REPRODUCED as four.** Measured, this leaf moved exactly two register figures of its own: `writerReach.closureSizes['web-display']` 689 → 690 and (via the World Book edge) `world-book` 81 → 92. Domain-any, prose-numerics, tuning-inventory/register, size-baseline and the golden-freeze register all UNMOVED, each proven by an executed run | ⚠ AMENDED |
| ⛔ the OSR would convict a reader of a ledger the corpus never lights | ⛔ **REFUTED BY EXECUTION — and this was the car's biggest predicted risk.** `warMemoryEnabled` is deliberately spelled so the corpus cannot light it (`concludedWars.js` header), so every key this reader touches is unobserved. **Measured: 1993 findings before, 1993 after, exit 0 both times.** The reads do not bind to an observed shape, so no identity is minted and no governed migration is owed | ⛔ REFUSED-RISK, CLEARED |
| `RR-2` names an existing packet | ⚠ **NAME COLLISION, not a dependency.** `docs/implementation/packets/osr-repair/RR-2.md` is the institutions-prose restoration and is unrelated; this car's RR-2 is `LIGHTING-INVENTORY.md §3.0 row 4`. Nothing to update there | ⚠ NOTED |

---

## 3 · TWO STALE CLAIMS FOUND AND CORRECTED IN THE TREE

1. `warAndRoadNames.js#liveWarNames` carried, in its docstring: *"A durable record of concluded wars does
   not exist in this engine and would be a new persistence shape; it is flagged for the owner's desk, not
   built here."* **W-MEM built it.** The note now points at `worldState.concludedWars` and at this reader.
2. `subsystemRowsMemory.js`'s W-MEM row listed, among what the wave deliberately did not build,
   *"and no Remembrance door — that door binds to T11's register form and is chartered separately."*
   That door is now built; the row names the reader and says what it does and does not write.

---

## 4 · THE DARK-INERT PROOF (the brief's central demand)

**The claim:** the car lands with its door dark and same-seed neutral, and the machinery is proven with the
door FORCED.

**(a) Same-seed neutrality, proven STRUCTURALLY and executed.** This car adds no engine write and no engine
read. The executed proof is the entry static closure: **241 modules from `src/main.jsx`, and every one of
the nine files this car touches or newly pulls is ABSENT from it** —
`warRemembrance.js`, `HeraldRemembrance.jsx`, `generateWorldBook.js`, `warEndingClassifier.js`,
`warConvergenceContract.js`, `warConvergenceForces.js`, `armyStrength.js`, `warAndRoadNames.js`,
`subsystemRowsMemory.js`. Nothing on the tick path changed, so a fixed-seed advance is byte-identical by
construction. Corroborated by execution: `tests/domain/concludedWarsWriter.test.js` and
`concludedWarLedger.test.js` (whose own arms compare serialized bytes across a dark tick) pass unchanged.

**(b) The door renders NOTHING when there is nothing to remember — and this is the load-bearing choice.**
`warMemoryEnabled` is dark, so the ledger key is absent and the roster is empty. The war section is
**ABSENT, not an empty box**: an empty state would have changed a LIVE door for every existing GM on the day
a dormant flag shipped. The test compares the door's `innerHTML` **as a string** across a dark world and a
world with an explicitly empty ledger and asserts they are IDENTICAL, with an anti-vacuity control proving
the same comparator sees the lit render diverge. The World Book's `sections.warsEnded` is `false` and the
painter emits no section.

**(c) The machinery proven with the door FORCED.** Every lit arm is driven through W-MEM's **real writer**
(`recordConcludedWars` with `warMemoryEnabled: true`), never a hand-built record. Proven lit: the addressed
row, the `terms` ending via a written treaty, `conquest` naming the victor, `annihilation` under the
STATE-NEVER-FATE reading, the territorial and engagement lines, the receipts seam both ways, and the
recorded-label name fallback.

---

## 5 · REGISTER DELTAS — PREDICTED IN WRITING, THEN MEASURED

⛔ **No register act was taken. Every figure below is for the CHAIR at the landing.**

### 5.1 Lighting census — the one EXACT census, and it REDS at my tip
Frozen at base: **`files 2523 · parked 371 · credited 2152 · titles 23204 · suiteTitles 6217`**.

**PREDICTED (written before measuring): `+1 / +0 / +1 / +21 / +8`.**
**MEASURED — all five confirmed in one farmed run: `2524 / 371 / 2153 / 23225 / 6225`.** The prediction was
exact on every figure. Method: a farm (`tests/` copied, everything else symlinked — the sanctioned probe
shape, since the walker counts the WORKING TREE), the predicted tuple written into the FARM's baseline only,
and the walker run plainly: **34 tests passed, exit 0**. The dock's baseline was then `cmp`-verified
unchanged and the farm deleted.

### 5.2 Test ratchet — REFREEZE owed, never a breach
`totalTests 31511 → 31532 (+21)` · `totalFiles 2470 → 2471 (+1)`. Both are 90 % COLLAPSE FLOORS
(`SCOPE_FLOOR_RATIO = 0.9`), so they go stale rather than red.
**Known-failure census: 2 of ceiling 17 at base, and this car adds NONE — it lands green.**

### 5.3 Writer-reach — the register the docket never priced for this car
The World Book gained one import edge, so its closure grew and the surface is now evaluated for more
identities. The **script** `check-writer-reach.mjs` is **GREEN (exit 0)**; only the walker's frozen
`surfaceReach` map is stale.

| figure | frozen | live | delta |
|---|---|---|---|
| `surfaceReach` rows | 6520 | 6520 | **0 rows added, 0 removed** |
| `surfaceReach` strings moved | — | — | **31 identities** |
| ⤷ of those, gaining `world-book=N` | — | — | **30** |
| ⤷ gaining `world-book=R` (a real new reach) | — | — | **1** (`tier on config`) |
| `closureSizes.world-book` | 81 | **92** | +11 |
| `closureSizes.web-display` | 689 | **690** | +1 (the new leaf) |
| `population` (judged/lit/litName/dark) | 6520/550/4644/1326 | **identical** | **0 — no verdict flipped** |

⭐ The cohort did not move, so this is a `surfaceReach` + `closureSizes` refresh, not a bank widening. The
walker's own collapse sentinel (`>= frozen * SENTINEL_FLOOR`) passes: these grew.

### 5.4 Registers that did NOT move — each proven by an executed run, not by silence
| register | proof |
|---|---|
| **Voice magnitudes** | `tests/copy/voiceMechanics.test.js` + `proseLeak.test.js` **GREEN in the whole-dir run.** Predicted 0 and measured 0: the Tier-2 walk only records a file with `em > 0 \|\| bang > 0`, and both new/edited files count **em 0 / bang 0** in string literals; the certification row was amended at a held count of exactly 10. |
| **OSR** | 1993 → **1993**, exit 0 (§2). |
| **Domain-strict typecheck** | `1120 errors, ceiling 1120` — the new leaf is strict-clean and **zero `any`**, so `.domain-any-baseline.json` totals are untouched. |
| **Golden-freeze register** | `tests/lint/goldenFreeze.walker.test.js` GREEN. The new test file reads **no** golden-adjacent env spelling, so no enrolment and no written exclusion is owed; `tests/fixtures/.golden-freeze-register.json` is byte-untouched (porcelain 0). |
| **`sizeBaseline`** | GREEN in the dir run. New file 435 effective-lines-ish, well under the 800 `src/domain` ceiling, so it takes no per-file override. `subsystemRowsVirtual.js` was not touched. |
| **Tuning register / inventory, prose-numerics, engine-gated walker** | all GREEN in the whole-`tests/lint/` run. |

### 5.5 Eager bytes — **PREDICTED 0, and here is why**
**0 B.** Executed proof in §4(a): the entry static closure is 241 modules and contains none of this car's
files. Both consumers are behind lazy seams that already existed. The **lazy** chunks do grow, measured at
source-byte level rather than asserted:

| chunk | new modules | new source bytes |
|---|---|---|
| Herald Remembrance door | +5 | +124,228 B |
| World Book | +10 | +211,914 B |

Almost all of it is `warEndingClassifier`'s own closure (`warConvergenceContract` +
`warConvergenceForces`). **That is the price of ONE resolver**, and the record's own design forbids the
alternative: *"the ending is NOT stored: it derives at read, so one resolver owns the question and an
improved classifier improves every recorded war."* The consist's STOP is the first-paint hashed-chunk
listing diff, which this cannot move. ⚠ Chair note: if the lazy-chunk growth is judged too dear, the cure
is a decomposition of `warEndingClassifier`'s `WAR_ENDING_KEYS` import out of `warConvergenceContract` —
a certification-side edit, not this car's.

---

## 6 · INSTRUMENTS RUN, WITH EXITS CAPTURED IN-SHELL

| instrument | command | exit | result |
|---|---|---|---|
| new test file | `gate-mutex --run -- npx vitest run tests/ui/warRemembranceReader.test.jsx` | **0** | 21/21 green on the FIRST run |
| seven neighbours | `… warAndRoadNames · worldBook · heraldRegisterDoors · heraldRegisterDoorsLazy · concludedWarsWriter · concludedWarLedger · warEndingClassifier` | **0** | 167 passed, 6 skipped |
| ⛔ **`tests/lint/` WHOLE** (+ voice + proseLeak) | `gate-mutex --run -- npx vitest run tests/lint/ tests/copy/voiceMechanics.test.js tests/copy/proseLeak.test.js` | **1** | **141 files: 139 passed, 2 failed · 2184 tests: 2182 passed, 2 failed** |
| `typecheck:domain:strict` | `npm run typecheck:domain:strict` | **0** | `✓ no strict-type regressions (1120 errors, ceiling 1120)` |
| eslint | `npx eslint src/ tests/ scripts/` | **0** | 0 errors, 31 warnings, **none in any file this car touched** |
| OSR | `node scripts/check-observed-shape-readers.mjs` (base AND tip) | **0 / 0** | 1993 → 1993 |
| writer-reach script | `node scripts/check-writer-reach.mjs` | **0** | `WRWALKER HOLD — judged 6520 · LIT 550 · LIT-NAME 4644 · DARK 1326` |
| farmed census probe | `gate-mutex --run -- npx vitest run …sovereigntyLightingContract.walker.test.js` in the farm | **0** | 34/34 — the predicted tuple is exact |

### ⛔ THE TWO REDS IN THE `tests/lint/` DIRECTORY RUN, EACH ATTRIBUTED

1. `sovereigntyLightingContract.walker.test.js` — *"the estate's file count moved: expected 2524 to be
   2523"*. **MINE, and expected.** ACTUAL 2524 (vitest prints actual first): the tree measures one more
   test file, which is exactly this car's. **Register act, chair's, at the landing** (§5.1 has the whole
   tuple already measured).
2. `writerReach.walker.test.js` — *"manpower on _timePressure is missing from the frozen surfaceReach"*.
   **MINE, and mechanically attributed:** 30 of the 31 moved strings gain a `world-book=` channel, which
   only the new World Book import edge can produce; the script's own gate is green and the population is
   identical. **Register act, chair's, at the landing** (§5.3).

**A THIRD RED WAS FOUND AND CURED IN-LANE:** `negativeAssertionAnchor.walker.test.js` convicted the new file
on **11 un-anchored negatives across 7 sites** (a new file may not take a frozen row). Cured in
`35aaeb4ba`: five sites now go through `expectAbsentWithAnchor` with an anchor that travels the same code
path, four carry `// anchored:` beside a new positive match on the same string, and one was deleted as
redundant against an exact `toBe('')` one line above. Walker green.

---

## 7 · JUDGMENT CALLS MADE IN SCOPE (each vetoable by name)

1. **The war section lives INSIDE the existing Remembrance door, not in a new Herald door.** A new door
   costs a lazy chunk, a `DOORS` entry, navigation and a fingerprint; the brief asks for "the Herald war
   section". *Veto shape: split it into `HeraldWarRemembrance.jsx` and add it to `HeraldBody`'s door list
   and to `heraldRegisterDoorsLazy.test.js`'s `DOORS`.*
2. **The section is ABSENT rather than empty when the roster is empty.** This is what makes the car
   dark-inert on a LIVE door. *Veto shape: give it the `EmptyGraveyard` treatment.*
3. **⚠ A FORKED VOCABULARY WAS ACCEPTED, DELIBERATELY, AND WRITTEN DOWN — NOT A BUG TO RE-FIND.**
   `heraldRegister.js` carries a private `turningsAgoLabel` over the same turning ladder (floors 0/1/4/13)
   that `warRemembrance.js` now declares. I did **not** unify them, because the unification edits a LIT
   surface and this car lands dark-inert. Both sites name the floors so a drift is visible, and the
   reader's header records the deferral. *Recommended follow-up: one import, by whoever next opens
   `heraldRegister.js`.* **This is the one place I chose against "one vocabulary per quantity", and I am
   flagging it rather than burying it.**
4. **`pinnedReasonOf` was EXPORTED rather than copied.** The concluded record copies `casusReasons`
   verbatim, so a second scoring rule would let a war change its cause the day it ended.
5. **The classifier's whole closure was accepted into two lazy chunks** rather than re-deriving the ending
   locally, because the record's design names one resolver. Cost measured in §5.5.
6. **`sacredAnchors` are NOT rendered.** They are patron references; rendering them would make a
   theological claim, and the casus clause already carries the cause in world words (DEITY DOCTRINE).
7. **The two certification/doc corrections were made in-tree** rather than reported, because a
   certification row that says a door does not exist while the door ships is a false record. The voice
   count was held exactly so no register moved.

---

## 8 · WHAT I DID **NOT** DO

- No register act of any kind; no `--update`, `--write`, `--genesis`, `--rebank`, no `*_REFREEZE` env var.
- No build; every closure figure here is **source bytes**, and the chair's listing diff is the real proof.
- No full-suite run, no `npm run check`.
- No edit to `simulationRules.js` — **this car mints no flag and names none in any comment**, so the
  lit-coverage denominator is untouched.
- No new Herald door, no navigation change, no `subsystemRows*` row added (the W-MEM row already exists;
  only its stale sentence was corrected).
- No prose written into any world: everything this car says is authored at read time.

### 8.1 Hand-frozen rosters — NO ATTRIBUTION IS OWED, and that was checked rather than assumed
The dispatch asks for the attribution the chair must apply to hand-frozen rosters keyed on anything this
car mints. **This car mints no kind pool, no pantheon entry and no `kindPoolFloors` member.** Its two new
frozen tables (`WAR_ENDING_TELLINGS`, `WAR_TURNING_BAND_KEYS`) are display projections over vocabularies
that already exist and are closed by `warEndingClassifier`, and their totality is pinned by enumeration
from the resolver itself rather than by a roster. `git grep` finds **no** file under `tests/` or `scripts/`
naming either export outside this car's own test file, and the whole `tests/lint/` run (which carries every
roster walker) is green but for the two register reds of §6. ⚠ One brief detail did not reproduce:
`tests/helpers/kindRegistryRoster.js` is **PRESENT at `38474a59e`**, not only at the §900 composition
(`git cat-file -e` succeeds) — it simply has nothing to do with this car.

---

## 9 · ⭐ RETROVALIDATION ROW (for the Fable chair)

| # | what was JUDGED by this Opus seat | what the FABLE chair must re-derive | receipts, by path | priority |
|---|---|---|---|---|
| R1 | **The census is 2 of 17 at `38474a59e`, not 6** — both the L-HOMES preamble and PLAN §8.1 say 6 | `scripts/.test-ratchet-baseline.json` `entries` at the product tip; the two rows are `enforcement-claims` and `generatorGoldenMaster` | this receipt §2; the baseline file itself | **HIGH** — a wrong headroom figure changes what a lane believes it may land |
| R2 | **The live lighting tuple is `2523/371/2152/23204/6217`, not PLAN §8.1's `2521/371/2150/23184/6214`** | `tests/lint/.lighting-census-baseline.json` at the product tip (`measuredAtSha 35b027458`) | §2, §5.1 | **HIGH** — every wave car predicts against this |
| R3 | **The predicted census tuple `2524/371/2153/23225/6225` is EXACT** (farmed, executed) | re-run the walker at the composed tip; the delta is `+1/+0/+1/+21/+8` and is additive with the other cars' | `$SC/laneLH6-census-probe.log` (34/34, exit 0) | **HIGH** — it is the chair's refreeze input |
| R4 | **The writer-reach register moves, and the docket never priced it for this car**: 31 `surfaceReach` strings, `closureSizes.world-book` 81→92 and `web-display` 689→690, population IDENTICAL | re-run `node scripts/check-writer-reach.mjs` (green) and the walker's `surfaceReach` arm; confirm the refreeze is a string refresh and not a cohort widening | §5.3; `$SC/laneLH6-wr-tip.log`, `$SC/laneLH6-wr-diff.mjs` | **HIGH** — it is a THIRD register act the L-HOMES landing must budget for |
| R5 | **The OSR does not move** despite a reader over a ledger the corpus can never light | `node scripts/check-observed-shape-readers.mjs` at base and tip | `$SC/laneLH6-osr-base.log`, `$SC/laneLH6-osr-after.log` (both 1993, exit 0) | **HIGH** — the opposite result would have been a STOP needing a governed migration |
| R6 | **Eager bytes = 0**, by a 241-module entry-closure walk that finds none of the nine files | the chair's own build and hashed-chunk listing diff, which is the only true proof | §4(a), §5.5 | **MEDIUM** — a source-level closure walk is a strong proxy, not the listing |
| R7 | **The forked turning ladder was ACCEPTED and recorded** rather than unified | is dark-inertness worth a second vocabulary for one quantity? If not, the cure is one import into `heraldRegister.js` | `src/domain/display/warRemembrance.js` header; §7.3 | **MEDIUM** — a deliberate deferral, vetoable |
| R8 | **The lazy-chunk growth (+124 KB Herald, +212 KB World Book source) was ACCEPTED** as the price of one resolver | whether `warEndingClassifier` should stop importing `WAR_ENDING_KEYS` from `warConvergenceContract` | §5.5 | **MEDIUM** — a certification-side cure, not this car's |
| R9 | **Two stale in-tree claims were CORRECTED**, one of them inside a certification row | that the amended W-MEM row is accurate, and that its em-dash count is still exactly 10 | §3; `src/domain/certification/subsystemRowsMemory.js` | **MEDIUM** — a certification row is a record the walk reads |
| R10 | **The docket's "three censuses" price for this car is wrong** — it is one exact census, two ratchet totals, and a writer-reach act | `refs/preserve/session-kit-893-2026-09-04:pending/LIGHTING.json`, the `LGT-P4-READER` row's `size` field | §2 | **LOW** — a pricing correction, not a blocker |

---

## 10 · LOGS (all under `$SC/`)

`laneLH6-osr-base.log` · `laneLH6-osr-after.log` · `laneLH6-tsdomain.log` · `laneLH6-newtest.log` ·
`laneLH6-neighbours.log` · `laneLH6-lintdir.log` (the first dir run, 3 reds) · `laneLH6-anchor.log` ·
`laneLH6-lintdir2.log` (the final dir run, 2 register reds) · `laneLH6-eslint.log` · `laneLH6-wr-tip.log` ·
`laneLH6-census-probe.log` · probes `laneLH6-wr-diff.mjs`, `laneLH6-wr-closure.mjs`.

**DOCK TIP: `35aaeb4bad5759ee476fd43a106c844b25cd8d0e`**
