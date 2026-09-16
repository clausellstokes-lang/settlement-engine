<!-- FOLDED FROM SCRATCHPAD BY EP STAGE ONE (EP-0), 2026-08-16, under ODQ §121.2.
     Source: laneEPS-EP-SUBSTRATE.md, lane EP-S. The body below is BYTE-IDENTICAL to the
     scratchpad artifact (cmp exit 0 against the copy this fold was taken from); this comment
     is the only addition, and it is a comment so the fold cannot alter a single graded row.

     §121.2 makes each family annex fold at its first train. The loss mode it records — a purged
     /tmp deliverable recovered only by transcript replay — is what this fold prevents.

     ⚠ ONE ROW OF THIS ANNEX HAS GONE STALE SINCE ITS SWEEP, AND IT IS NAMED HERE RATHER THAN
     EDITED. The HEADER table says the two volume copies "differ by EXACTLY 18 lines … no wave
     spec, table, ruling, count or seam row differs". That was true at the swept ledger blob
     786fdb8f. It is NOT true at the fold: the ledger copy moved to 92cc1de8 when the C-EPF-2
     cures landed ledger-side, so the copies diverged in BOTH directions (ten cure blocks
     ledger-only, the TE3 banner build-only) until this same commit merged them. The annex body
     is left verbatim because editing a graded artifact after its sweep is how a sweep stops
     being evidence; the correction lives here, where a reader meets it first.
-->
# EP — SUBSTRATE PRE-VERIFICATION ANNEX (SPV, DESIGN_PREVERIFICATION.md §1)

**Volume:** `docs/DESIGN_FP_ARCH_EP.md` — THE ADVANCE EPOCH (living futures, immutable pasts).
**Lane:** EP-S, read-only. Committed nothing, edited nothing, ran no gate, no `npm run check*`, no gate-mutex.

---

## HEADER (per §1.3)

| Field | Value |
|---|---|
| **SWEEP SHA** | `6cd18ad3e9b8be768d0e69ce1edc641cb5b626db` (`claude/composite-r4`, worktree `.claude/worktrees/minifold`) — the CODE OF RECORD, recorded at sweep start and re-confirmed unmoved at sweep end |
| **Volume sha swept** | `786fdb8f9178d62478dcd44a94d24a5e064fa2c9` (ledger branch `review-fixes-2026-07-08`, 4,059 lines) |
| **Second copy reconciled** | `d07a9cf6521db0e36306565c01692454f6fb37fa` (build branch `HEAD:docs/DESIGN_FP_ARCH_EP.md`, 4,077 lines). ⭐ **The two copies differ by EXACTLY 18 lines** — the build copy carries lane TE3's `ARCHITECTED, NOT BUILT` banner prepended at line 3 and nothing else. **No wave spec, table, ruling, count or seam row differs.** Both copies are therefore swept as one subject |
| **CLAIM DENOMINATOR** | **131** substrate claims, extracted by enumeration over the volume's text (§1.2 rule 1) |
| **GRADE TALLY** | **MEASURED-TRUE 101 · REFUTED 25 · UNVERIFIABLE-AT-BASE 5** (131 = 101 + 25 + 5). Per §1.2 there is no fourth grade: a claim with a false component is graded REFUTED with its surviving half stated in the evidence column |
| **Focused executions** | 3 single-file vitest runs, exit statuses captured in-shell (never piped) — see EXECUTION LOG |
| **⛔ SINGLE-MEMBER LAW** | **EP CAN NEVER SHARE A CYCLE.** The volume's own header: *"it is the only program that edits `pulseKernel.js`, where PRNG call order IS the stream identity."* CONFIRMED at HEAD — `pulseKernel.js` carries exactly ONE `createPRNG(` call site (line 291) and is banked at `sizeBaseline` **1580** with the `_r_bld_10_pulsekernel_banked_permanently_2026_08_03` rationale key live in `scripts/.size-baseline.json`. Any EP cycle is a ONE-MEMBER cycle |
| **⛔ PARKED ROWS** | §7a's **FOUR** owner-gated rows are treated as PARKED throughout. **No row below grades any of them buildable.** Their substrate premises are graded (all four premises reproduce); their DISPOSITION is not this sweep's to touch |
| **Waves declared** | SIX (EP-0..EP-5; EP-3 in two slices, EP-4 in three). **ZERO code landed** — CONFIRMED, see EP-S121 |

> **CONSUMPTION LAW (mirrored from the base-state capsule, §1.3).** Every row below is
> citable as executed by a compiler whose verified base is the sweep sha
> `6cd18ad3e9b8be768d0e69ce1edc641cb5b626db` or its docs-only descendant. **Any claim whose
> subject files have moved since the sweep is re-verified by the consumer.** A compiler citing
> a stale annex row inherits a STOP, not an excuse.

> **⚠⚠ STALENESS NOTE THAT ALREADY BINDS (§1.4).** This sweep VOIDS for EP the moment any EP
> wave lands. It ALSO voids per-row for cross-family landings that touch a row's subject files.
> **`src/domain/worldPulse/simulationRules.js`, `src/domain/certification/subsystemRowsVirtual.js`,
> `src/domain/worldPulse/pactAmendment.js` and `src/domain/worldPulse/peaceTerms.js` were
> WRITTEN BY THE CONCURRENT gr-5a EXECUTOR DURING THIS SWEEP** (clean at sweep start, dirty at
> sweep end, HEAD unmoved). Rows EP-S030..EP-S034 are graded **at HEAD**, not against the dirty
> tree — see the EXECUTION LOG's false-red note, which is the sharpest operational hazard this
> sweep found.

---

## §1 · KERNEL SEAM AND STREAM IDENTITY — THE DIRECTIVE SUBSTRATE

*The brief's named verification target: the stream-identity term (chair-signed) and the
dark-state byte-identity claim including stream strings.*

| # | Claim (volume site) | Grade | Executed evidence |
|---|---|---|---|
| EP-S001 | The live root composition is verbatim `` const rng = createPRNG(`${startingWorldState.rngSeed}::tick:${startingWorldState.tick + 1}::${tickInterval}`); `` (§0.3 R3, §2.3 DARK block) | **MEASURED-TRUE** | `pulseKernel.js:291`, byte-identical to the volume's quoted line |
| EP-S002 | `simulateCampaignWorldPulse` composes exactly ONE root — the only `createPRNG` call in the file (§0.3 R1) | **MEASURED-TRUE** | `git grep -n createPRNG HEAD -- pulseKernel.js` → 2 lines: the import (8) and the one call (291) |
| EP-S003 | The tick term is `tick + 1`, the tick being ENTERED (§0.3 R3) | **MEASURED-TRUE** | line 291 verbatim; `nextWorldStateForPulse` body `const tick = current.tick + 1;` (184–192) |
| EP-S004 | The interval term is `tickInterval = usableTickInterval(interval)`, which silently composes an unknown interval as `'one_month'` (§0.3 R3) | **MEASURED-TRUE** | `pulseHelpers.js:203-205` — `return VALID_INTERVALS.has(interval) ? interval : 'one_month';` |
| EP-S005 | `nextWorldStateForPulse` returns exactly TWO lines in `src`, both in `pulseKernel.js`: the LOCAL unexported definition and its ONE call inside `simulateCampaignWorldPulse` (§0.3 R11) | **MEASURED-TRUE** | `git grep -n nextWorldStateForPulse HEAD -- src/*` → `pulseKernel.js:184` (def) and `:292` (call). Nothing else |
| EP-S006 | `nextWorldStateForPulse`'s body is `calendar: advanceWorldCalendar(current.calendar, interval)` — the calendar moves there (§3b.1a ordering step 4) | **MEASURED-TRUE** | lines 184–192 quoted in full |
| EP-S007 | Seam edit 4's fold target `const simulationRules = normalizeSimulationRules(startingWorldState.simulationRules);` is the FIRST line at which both `startingWorldState` and `simulationRules` are bound (§2.3b / P2) | **MEASURED-TRUE** | `:289` `const startingWorldState = ensureWorldState(...)`; `:290` the fold target; nothing binds `simulationRules` earlier |
| EP-S008 | The `now`-guard line `if (now == null) { assertNowPinnedInTest('simulateCampaignWorldPulse'); now = wallClockNow(); }` exists and is OUT OF SCOPE as a fold target because neither name is bound there (§2.3b) | **MEASURED-TRUE** | `:228`, sixty-one lines above `:289` |
| EP-S009 | The MEASURED ordering (steps 1–9 of §3b.1a) reproduces in execution order at HEAD | **MEASURED-TRUE** | 289 → 290 → 291 → 292 → 439 (`seasonClock`) → 470 (`rngSeed: startingWorldState.rngSeed`) → 1429 (`applyWorldPulseOutcomes`) → 1483 (`memoryState`) → 2766 (`appendPulseHistoryWithProvenance`). Monotone, no inversion |
| EP-S010 | Seam edit 7's host `const seasonClock = seasonsOn ? seasonForTick(worldState.calendar.elapsedWeeks) : null;` is loop-INVARIANT, computed once per tick ABOVE the `for (const item of snapshot.settlements)` loop (§3b.1 edit 7) | **MEASURED-TRUE** | `seasonClock` at `:439`; the settlement loop opens at `:451` |
| EP-S011 | Seam edit 8's host is `rngSeed: startingWorldState.rngSeed,` inside the `seasonalContextFor({…})` argument object, UNCOERCED (§0.3 R9, §3b.3 row 9) | **MEASURED-TRUE** | `:470`, a raw property read with no coercion wrapper |
| EP-S012 | Seam edit 6's host `createdAt: now,` sits inside the `pulseRecord` object literal adjacent to `committed: commit,` (§1.2) | **MEASURED-TRUE** | `:1746` `committed: commit,` / `:1747` `createdAt: now,` |
| EP-S013 | Seam edit 1's host is `import { createPRNG } from '../../kernel/prng.js';` (§3b.1 edit 1) | **MEASURED-TRUE** | `:8` verbatim |
| EP-S014 | Seam edit 2's host is the ALREADY-PRESENT `../clock.js` import, currently `{ wallClockNow, assertNowPinnedInTest }` (§3b.1 edit 2) | **MEASURED-TRUE** | `:118` `import { wallClockNow, assertNowPinnedInTest } from '../clock.js';` |
| EP-S015 | `simulationRules` is ALREADY in scope inside `simulateCampaignWorldPulse` and already read BY NAME for other gates (`simulationRules.warLayerEnabled`), so the kernel flag read costs no new threading (§2.3b step 2) | **MEASURED-TRUE** | by-name reads at 393, 408, 415, 438, 465 (`warLayerEnabled`), 758 (`warLayerEnabled`) |
| EP-S016 | `pulseKernel.js` is BANKED at **1580 effective lines**, tolerance-zero, under R-BLD-10, and the ruling's rationale key lives in `scripts/.size-baseline.json` (§3b.1) | **MEASURED-TRUE** | baseline literal `1580`; key `_r_bld_10_pulsekernel_banked_permanently_2026_08_03` present, text opens *"IS BANKED PERMANENTLY AT ITS MEASURED 1580"* |
| EP-S017 | `assertNowPinnedInTest` is called at exactly TWO sites — `pulseKernel.js#simulateCampaignWorldPulse` and `advanceInterval.js#simulateCampaignWorldInterval` (§3a) | **MEASURED-TRUE** | `clock.js:29` (def), `advanceInterval.js:372`, `pulseKernel.js:228`. No third |
| EP-S018 | `prng.js#fork` is `` fork: (label) => createPRNG(`${seed}::${label}`) `` — the `::` delimiter law (§2.3c) | **MEASURED-TRUE** | `src/kernel/prng.js:84` verbatim |
| EP-S019 | `generateSeed()` is `Date.now().toString(36) + seedSuffix()`, `SEED_SUFFIX_LEN = 6`, `SEED_ALPHABET` base36, `SEED_BYTE_CEILING = 252`, `Math.random` fallback only (§1.1) | **MEASURED-TRUE** | `prng.js` 94/97/104/126–136/154 — every constant and the body reproduce verbatim |
| EP-S020 | The word `epoch` has ZERO existing fork-label uses; `prngForkLabelDelimiter.test.js` freezes the delimiter-embedding families (fidelityNoise, deityStanceLane, religiousContest) (§2.3c) | **MEASURED-TRUE** | test file present; frozen map at 57–59 names exactly those three modules; zero `epoch` hits. **EXECUTED: 3/3 tests pass, exit 0** |
| EP-S021 | ⛔ **DARK-STATE BYTE IDENTITY — "draw counts are identical in BOTH flag states; the seam moves the seed VALUE only, never a control-flow branch, so the number and order of `rng.random()`/`rng.fork()` calls is unchanged"** (§2.3b proof step 2) | **UNVERIFIABLE-AT-BASE** | The claim is about a program that does not exist yet; **no baseline draw-count instrument exists in the estate.** MEASURED at HEAD as the denominator a future parity test must fix: **22** `rng.fork(`/`rng.random(` call sites in `pulseKernel.js`. **What would make it verifiable:** the executed draw-count parity test that `EP_ROUND7_CONFIRM.md` binding condition **C2** already commissions (execute BEFORE EP-1 *lands*; a failure is STOP-AND-REPORT, never a repair in place). This annex CONFIRMS C2 is unsatisfied at the sweep sha |
| EP-S022 | The dark stream string is character-for-character today's, per advance path — the single-tick path, the `advanceMultiTick` composed path, and the paused-resume path (§2.4's per-path definition) | **UNVERIFIABLE-AT-BASE** | The three paths and their literal terms all reproduce (EP-S001, EP-S004, EP-S023), but the byte-identity conclusion depends on `epochSuffix`, which does not exist. **What would make it verifiable:** EP-0's `advanceEpochStreamIdentity.test.js` asserting the two hard-coded literal strings, plus fence 1's six-cell grid |
| EP-S023 | `advanceMultiTick` is a REAL default-ON flag that ALREADY forks the pulse stream identity: `simulateCampaignWorldInterval` builds every composed tick with the LITERAL `interval: 'one_week'` (§2.4, J-EP-7) | **MEASURED-TRUE** | `src/lib/flagRegistry.js:63` `advanceMultiTick: true`; `advanceInterval.js:467` `interval: 'one_week',` |
| EP-S024 | `epochSuffix` does not exist in `src/kernel/prng.js` (the seam is unbuilt) | **MEASURED-TRUE** | zero hits |

---

## §2 · THE FLAG, THE MANIFEST AND THE CERTIFICATION LANE

| # | Claim | Grade | Evidence |
|---|---|---|---|
| EP-S025 | Zero hits in `src`/`tests` for `advanceEpochEnabled\|epochEnabled\|advanceEpoch\|epochSuffix\|livingFutures` (§2.1, Q4) | **MEASURED-TRUE** | `git grep -nE … HEAD -- src/* tests/*` → **0** |
| EP-S026 | The chair rulings' Q4 row: *"five greps across the entire build tree including `docs/` return zero hits each"* | **REFUTED** | **124** hits tree-wide at HEAD, in exactly two files: `docs/DESIGN_FP_ARCHITECTURE.md` and `docs/DESIGN_FP_ARCH_EP.md`. The ruling's CONCLUSION survives intact (zero *code* collisions); the whole-tree phrasing did not survive EP's own fold into the build branch |
| EP-S027 | `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`simulationRules.js`) is a SORTED frozen array and `advanceEpochEnabled` sorts FIRST, before `beliefAxesEnabled` (§2.2) | **MEASURED-TRUE** | array opens `'beliefAxesEnabled'` at `:186`; `'a…' < 'b…'` |
| EP-S028 | `tests/lint/engineGatedRuleKeys.walker.test.js` anchors on `` /\b(?:rules\|simulationRules)\s*\)?\s*\??\.\s*([A-Za-z_$][\w$]*)\s*===\s*true/g `` over ALL of `src` (§2.2's load-bearing gate-read spelling) | **MEASURED-TRUE** | `:296` `GATE_RE` verbatim; a second `GATE_EXPR_RE` at `:307` widens it further |
| EP-S029 | `codeOnly` is importable from that walker (fence 4 reuses it, never a second blanker regex) (§2.5 fence 4) | **MEASURED-TRUE** | `export function codeOnly(src)` at `:243`; in-file note says ten other test files consume it |
| EP-S030 | ⭐⭐ **THE FROZEN-EIGHT TRAP — `tests/domain/subsystemRowsVirtual.test.js` hard-codes `const VIRTUAL_RULES = Object.freeze([AXES, CONQUEST, STATECRAFT, RUMORS, OATH, SOVEREIGNTY, LIFECYCLE_VOICE, CASUS]);`, so a NINTH VIRTUAL-lane member forces an edit to that file** (§2.2, the premise of J-EP-1) | ⛔ **REFUTED** | At HEAD the frozen list has **NINETEEN** members (`:143-147`): AXES, ESPIONAGE, SCARCITY, CONDITIONS, DEVOTION, MIRROR, POSTURE, SPINE, CONQUEST, HABIT, STATECRAFT, RUMORS, OATH, PACTS, SOVEREIGNTY, LIFECYCLE_VOICE, CASUS, POLITICS, UNDERWAYS. **Eleven programs have joined it since the volume measured eight, each editing the file.** Joining is the ESTABLISHED house act, not the trap |
| EP-S031 | That test asserts three exact bijections plus `expect(VIRTUAL_PENDING_RULE_KEYS).toEqual([])` (§2.2) | **MEASURED-TRUE** | `:385` verbatim; the bijection assertion is `:389` `expect([...ENGINE_GATED_VIRTUAL_RULE_KEYS].sort()).toEqual([...VIRTUAL_RULES…])` |
| EP-S032 | **J-EP-1's veto cost — "editing that test in EP-1's commit, legal but coupling this program to a file three other programs also want"** | **REFUTED as stated** | Not three programs — **eleven** have already taken that cost. The judgment block may still stand on other grounds (a nineteenth-to-twentieth edit is a shared-file collision), but **its stated premise is dead and J-EP-1 must be re-argued or re-ruled before EP-1 builds** |
| EP-S033 | `ENGINE_GATED_VIRTUAL_RULE_KEYS` and `VIRTUAL_RULES` are in exact bijection at HEAD (the state EP-1's "exact one-key delta" assertion measures against) | **MEASURED-TRUE** | both **19** at HEAD; the walker test passes at HEAD (see false-red note) |
| EP-S034 | The chair rulings' Q4 caveat that `simulationRules.js` "is actively growing under another lane, so EP-1's exact one-key delta must be re-measured against whatever has landed by then" | **MEASURED-TRUE, AND FIRED DURING THIS SWEEP** | the gr-5a lane appended `'treatyRenewalEnabled'` to the array in the working tree mid-sweep. The caveat is not theoretical |
| EP-S035 | The determinism eslint ban is scoped to exactly six blocks — `src/generators/**/*.js`, `src/pdf/**/*.{js,jsx}`, `src/domain/**/*.js`, `src/workers/**/*.js`, `src/kernel/**/*.js`, `src/kernel/prng.js` — and does NOT cover `src/store` or `src/components` (§0.3 R6, §3a) | **MEASURED-TRUE** | `eslint.config.js` `files:` blocks at 185/246/288/367/410/450 are exactly those six; `src/store` and `src/components` carry **21** live `Math.random` sites (EP-S104) that lint tolerates |
| EP-S036 | `tests/lint/determinismBanCoverage.test.js` pins those layers | **MEASURED-TRUE** | file present |
| EP-S037 | The flag has no upstream conjunction; the one ordering constraint is that EP-3 may not light before EP-1 (§2.2 degraded arms) | **UNVERIFIABLE-AT-BASE** | a design statement about an unbuilt flag; nothing in the tree can confirm or refute it |

---

## §3 · THE ENTROPY-ROOT CENSUS — COMPOSITIONS, READ SITES, COERCIONS

| # | Claim | Grade | Evidence |
|---|---|---|---|
| EP-S038 | **68 textual `rngSeed` occurrences in `src`, across 30 files** (§3b.2a, closure record) | **MEASURED-TRUE** | `git grep -n rngSeed HEAD -- src/*.js src/*.jsx \| wc -l` → **68**; `-l \| wc -l` → **30**. BOTH reproduce exactly |
| EP-S039 | Every one of the 68 falls into the closed bucket set {read site · bare receiver · comment/JSDoc · allowlist key literal · writer · out-of-denominator} (§3b.2a closure) | **MEASURED-TRUE** | Independently re-bucketed all 30 files. The seven files the volume never names by symbol — `auspice.js`, `autonomy/autonomousRun.js`, `townCartography/cartographySynthesis.js`, `townScene/manifestContract.js`, `data/foundingSeeds.js`, `townMap/SettlementMapPane.jsx`, `display/worldSnapshotPublic.js` — are **all comments, JSDoc, allowlist key literals or a `COVERT_KEY_RE` regex.** ZERO are runtime reads. **No twenty-third read site exists at HEAD** |
| EP-S040 | **TWENTY-TWO runtime read sites** (RS-1..RS-22), frozen denominator (§3b.2a) | **MEASURED-TRUE** | derived from EP-S039; the 22-row table's symbol homes all resolve at HEAD |
| EP-S041 | **TWENTY-FIVE stream compositions across SIXTEEN modules in THREE idioms** (§0.3 R1+R7, §3b.2) | **MEASURED-TRUE** | no new `worldState.rngSeed`-rooted composition at HEAD; the three ES-era `hash01` consumers that landed since (EP-S043) key on errand ids, never on the world seed — OUT-OF-DENOMINATOR by the volume's own rule |
| EP-S042 | `createPRNG(` sites in `src/domain` = **37** (§3b.2 closure table, "corrected from 38 by chair ruling P7") | ⛔ **REFUTED** | **38** at HEAD. The figure has drifted back to the number P7 corrected away from. A shrink-only baseline frozen at 37 **REDS on day one** |
| EP-S043 | `hash01` CONSUMER MODULES in `src` = **TEN** (§3b.2 closure table, chair ruling T5's corrected command) | ⛔ **REFUTED** | **13** at HEAD, by T5's own command. Three ES-era modules joined: `espionage/espionageDoctrineStage.js`, `espionage/espionageGauntlet.js`, `espionage/espionageRider.js`. **A walker frozen at TEN reds on day one** |
| EP-S044 | `createPRNG(` sites in `src` (whole tree) = **47** (§3b.2 closure table) | ⛔ **REFUTED** | **48** at HEAD |
| EP-S045 | hash-helper definitions in `src` = **32** (§3b.2 closure table, corrected from 31) | **MEASURED-TRUE** | **32**, by the recorded command |
| EP-S046 | `generateSeed()` = **8 TEXTUAL HITS, 5 REAL CALL SITES** — `generateSettlementPipeline.js` ×3, `settlementSlice.js` via `eng.generateSeed()`, `instantWorldBody.js`; the excluded three are two prose comments plus the `export function` definition (§3b.2 closure, §3e sweep C; chair ruling T3) | **MEASURED-TRUE** | 8 hits enumerated verbatim; the excluded three are `generateSettlementPipeline.js:78`, `:101` (comments) and `prng.js:153` (the definition). **The most-corrected figure in the volume is the one that survived** |
| EP-S047 | R1 CONSEQUENCE: 25 compositions across 16 modules build their draw key from `worldState.rngSeed` DIRECTLY and are never handed the root `rng` (§0.3 R1) | **MEASURED-TRUE** | re-derived from the 22 read sites; the root `rng` at `:291` is never threaded to any of them |
| EP-S048 | R1 row 14/15/16: `realmVerbExecution.js` composes THREE seeds in TWO idioms, of which row 16 (FORCE_RESETTLE) carries NO tick term (§0.3 R1, J-EP-10, §7a row 4) | **MEASURED-TRUE** | `grep -n 'const seed = '` → exactly three: `:676` and `:742` both `…:realm_verb:${nowTick}`, `:809` `…:realm_verb` with no tick. Verbatim |
| EP-S049 | R9 read site 1: `pulseKernel.js` → `seasonalContextFor` argument, NO COERCION, so absent interpolates the literal `"undefined"` (§0.3 R9, §3b.3 row 9) | **MEASURED-TRUE** | `:470` `rngSeed: startingWorldState.rngSeed,` — raw property read |
| EP-S050 | R9 read site 2: `generosityKernel.js` → `intelEligible`, `String(…?.rngSeed ?? '')`, and it is the SOLE production caller of row 13 (§0.3 R9) | **MEASURED-TRUE** | `intelEligible` returns exactly three lines in `src`: the definition (`intelActs.js:114`), the import (`generosityKernel.js:131`) and the call (`:1032`). Caller census CLOSED |
| EP-S051 | R9 read site 3: `traditionsKernel.js` → `seasonalSeverityFor(String(asObject(worldState).rngSeed \|\| ''), year, sid)` (§0.3 R9) | **MEASURED-TRUE** | `traditionsKernel.js:258` verbatim |
| EP-S052 | `seasonalSeverityFor` has exactly THREE production callers — `seasons.js#seasonalContextFor` (fed by `pulseKernel.js`, RS-2), `traditionsKernel.js` (RS-4), `townMap/mapDress.js` (RS-16) (§3b.2, chair ruling F4's independent confirmation) | **MEASURED-TRUE** | `seasons.js:168`, `traditionsKernel.js:258`, `mapDress.js:137`. No fourth |
| EP-S053 | R12: three year derivations in TWO BASES — `seasonForTick(weeks).year = floor(w/52)+1`; `intelYearOf(weeks) = floor(w/52)`; `npcLadderContest#yearOf(weeks) = floor(w/52)` (§0.3 R12, J-EP-13) | **MEASURED-TRUE** | `worldState.js:648` `year: Math.floor(weeks / WEEKS_PER_YEAR) + 1,`; `intelActs.js:104-106` no `+1`; `npcLadderContest.js:482` `function yearOf(weeks) { return Math.floor(num(weeks, 0) / 52); }`. **All three verbatim; the one-lower divergence is real** |
| EP-S054 | RS-16's coercion is `typeof … === 'string' ? … : null` and the call is SUPPRESSED by `(season && rngSeed && year != null && settlementId != null) ? … : null` — the tenth behaviour, not a coercion (§3b.3) | **MEASURED-TRUE** | `mapDress.js:133,136-138` verbatim. **The suppression is real: an accessor returning a fallback string here would CREATE a draw HEAD does not make** |
| EP-S055 | NC-1 negative control: `economyReconciliation.js`'s `rngSeed: stepRng.fork(POWER_STREAM).seed` is LIVE with THREE production importers, the same argument-object shape as RS-2 (§3b.2a, chair ruling T6) | **MEASURED-TRUE** | 2 `rngSeed` occurrences in that file; the module is on the settlement-generation path |
| EP-S056 | NC-2: `personaSlicer.js` has ZERO importers in `src` — dead by production reach (§3b.2a, §7b row B1) | **MEASURED-TRUE** | `git grep personaSlicer HEAD -- src tests scripts`, excluding the file itself → only three test importers, two `negativeAssertionAnchor` manifest rows, three `factionNamePrecedenceScan` comment mentions. **No `src` importer** |
| EP-S057 | §7b B1's sub-figure: `factionNamePrecedenceScan.test.js` carries "two comment mentions" | **REFUTED** | **THREE** (lines 40, 49, 177). Independently reproduces the chair rulings' X5 correction |
| EP-S058 | B1's census is complete as the chair extended it (by filename, by all three exported symbols, via the `ai/index.js` barrel, via dynamic import) | **MEASURED-TRUE, with one addition** | all four spellings reproduce. ⚠ **NEW at HEAD and named in neither document:** `scripts/.observed-shape-readers-baseline.json` carries **four** `personaSlicer.js` rows. A deletion decision now moves a fifth artifact |
| EP-S059 | R2's superseded denominator of FOURTEEN, retained as the record of the first-order miss (§0.3 R2) | **MEASURED-TRUE** (as a historical record; R7 supersedes the number, and the volume says so) | no live figure depends on it |
| EP-S060 | R4: `createDefaultWorldState` sets `` rngSeed: `world-pulse:${seedPart}` `` — the pulse root derives from CAMPAIGN IDENTITY, not the user-facing generation seed (§0.3 R4) | **MEASURED-TRUE** | `worldState.js:286` verbatim; `ensureWorldState` at `:529` `rngSeed: raw?.rngSeed \|\| base.rngSeed` |
| EP-S061 | The OUT-OF-DENOMINATOR class reads no `worldState.rngSeed` (§3b.2, §8.1 row 6) | **MEASURED-TRUE** | the 68-occurrence token census names every file that does, and none of the enumerated entity-addressed families appears in it |

---

## §4 · THE LEDGER, THE WRITER, THE COVERAGE MANIFEST

| # | Claim | Grade | Evidence |
|---|---|---|---|
| EP-S062 | The coverage walker lives at `tests/lib/spatialLedgerCoverage.walker.test.js`, NOT `tests/lint/` (§3b.1a, chair ruling F3) | **MEASURED-TRUE** | exactly one path; F3's correction holds |
| EP-S063 | `ls tests/lint \| grep -i ledger` returns ONLY `envoyErrandLedgerSingleWriter.walker.test.js` and `satellitesLedgerWriters.walker.test.js` (§3b.1a, F3's supporting measurement) | **REFUTED** | **THREE** at HEAD — `habitLedgerSingleWriter.walker.test.js` joined via the HB program. F3's RULING is unaffected; its supporting enumeration is stale |
| EP-S064 | `describe('spatialUsage ledger-coverage walker (lib-infra-copy-1)')` (§3b.1a, §8.1 row 10) | **MEASURED-TRUE** | `:90` verbatim |
| EP-S065 | The walker resolves BOTH write spellings via `WRITE_LITERAL_RE` (quoted key) and `WRITE_CONST_RE` (UPPER_SNAKE resolved through `ledgerKeyConstants()`) (§3b.1a) | **MEASURED-TRUE** | `:70`, `:71`, `:54` verbatim |
| EP-S066 | The test asserts `expect(classified).toEqual(written)` — EXACT SET EQUALITY IN BOTH DIRECTIONS (§3b.1a, §8.1 row 10) | **MEASURED-TRUE** | `:116`. **EXECUTED: 4/4 tests pass, exit 0** — so the "unclassified `advanceEpoch` REDS EP-3 slice A on day one" claim rests on a live, currently-green gate |
| EP-S067 | The walker excludes only the accessor DEFINITION at `src/domain/spatial/distanceRead.js` (`ACCESSOR_DEF`) (§3b.1a) | ⛔ **REFUTED** | `ACCESSOR_DEF = 'src/domain/spatial/spatialLedgerAccess.js'` (`:35`). **The volume cites the wrong file.** `spatialLedgerAccess.js` is where `setSpatialLedger` is actually defined — which is also the file the volume quotes verbatim two paragraphs later, so the citation contradicts its own quotation |
| EP-S068 | `EXEMPT_LEDGER_KEYS` is an `Object.freeze({ key: 'reason' })` map, so the volume's "ONE row with its written reason" is exactly the right shape (§3b.1a) | **MEASURED-TRUE** | `spatialUsage.js:334` verbatim, with long written reasons per row |
| EP-S069 | `setSpatialLedger` is `{ ...worldState, spatialLedgers: { ...(ns \|\| {}), [key]: value } }` — it CREATES the namespace when absent and preserves every sibling (§2.3c M3, §3b.1a G2) | **MEASURED-TRUE** | `spatialLedgerAccess.js:92-95` verbatim |
| EP-S070 | `spatialLedgers` is a `CONDITIONAL_LEDGER_KEYS` member and `pausedAdvance` is listed verbatim in the same array, whose own header says the ORDER IS THE SERIALIZED KEY ORDER (§1.2, §2.3b, §2.3c M3) | **MEASURED-TRUE** | `worldState.js:411-415` — `'pausedAdvance'` and `'spatialLedgers'` both present; the in-file comment says append-at-the-end-only |
| EP-S071 | `src/lib/spatialUsage.js` names and refuses the store-layer escape: *"DOOR 1's `spatialSubstrate` sidecar is deliberately NOT listed here…"* (§3b.1a) | **MEASURED-TRUE** | `:374` verbatim |
| EP-S072 | `src/lib/spatialUsage.js` is **284 raw lines, unbaselined, far under its 800 layer ceiling** (§3b.1a slice cost table) | **REFUTED (line count)** | **379** raw lines at HEAD. UNBASELINED reproduces (absent from `scripts/.size-baseline.json`); still far under 800. The budget conclusion survives, the figure does not |
| EP-S073 | `collapseIntervalHistory` does `const removed = intervalRecords.slice(0, -1);` and returns `reconcileProvenanceAfterHistoryCollapse({ ...worldState, pulseHistory: composed }, removed)` — composed by SPREAD, so `spatialLedgers` is CARRIED THROUGH (§1.5, §3b.1a G2, §8.4) | **MEASURED-TRUE** | `advanceInterval.js:159` and `:203-206` verbatim (formatted across three lines). **G2's respelled premise reproduces where revision 5's did not** |
| EP-S074 | `reconcileProvenanceAfterHistoryCollapse` touches only the `provenance` sub-key, which is itself an `EXEMPT_LEDGER_KEYS` entry (§3b.1a G2) | **MEASURED-TRUE** | `provenance` is a live `EXEMPT_LEDGER_KEYS` row; the reconcile is imported at `advanceInterval.js:9` |
| EP-S075 | `src/domain/advanceEpochLedger.js` does not exist; `tickStreamSeedOf` / `yearStreamSeedOf` / `stampAdvanceEpochYear` return zero hits (the clean-slate assumption) | **MEASURED-TRUE** | zero hits for all three symbols |
| EP-S076 | `ls src/domain/*.js \| wc -l` returns **91** (J-EP-6 reason 3) | **REFUTED** | **93** at HEAD. J-EP-6's conclusion (the top level is the conventional home for substrate leaves) is strengthened, not weakened |
| EP-S077 | `couplingInclusion.walker.test.js` freezes `CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse\|spatial)\//` (§5 item 7, J-EP-6) | **MEASURED-TRUE** | `:559` verbatim |
| EP-S078 | `pulseKernel.js` and `worldState.js` are both `ARGUED_UNLAYERED` in that walker (§5 item 7) | **MEASURED-TRUE** | `:262` and `:270` |

---

## §5 · THE F1 REBIND SPANS (declared VOLATILE by the volume)

| # | Claim | Grade | Evidence (the volume's own commands, re-run) |
|---|---|---|---|
| EP-S079 | span 1 (seam edit 9's host → seam edit 7's host) = **14** `worldState` rebinds | **MEASURED-TRUE** | 14 |
| EP-S080 | span 2 (seam edit 7's host → `applyWorldPulseOutcomes`) = **19** further rebinds | **MEASURED-TRUE** | 19 |
| EP-S081 | span 3 (`applyWorldPulse.js` `state` rebinds) = **23** | **REFUTED** | **24** at HEAD |
| EP-S082 | span 4 = **22** statement-initial `memoryState` writes **+ 5** destructuring rebinds | **MEASURED-TRUE** | 22 and 5 |
| EP-S083 | THE ARITHMETIC: 19 + 23 + 27 = **SIXTY-NINE** rebind sites across two files; **FIFTY of the sixty-nine** sit at or past the `applyWorldPulse.js` boundary (§3b.1a F1) | **REFUTED** | **70** and **51** at HEAD. ⭐ The volume declares these figures VOLATILE BY DESIGN and deliberately unfrozen, so this is drift the volume PREDICTED — but the sentences state them as measured facts and a compiler quoting "sixty-nine" quotes a stale number |
| EP-S084 | `applyWorldPulse.js` is **1291 lines** and binds `let state = worldState;` returning `worldState: state` (§3b.1a F1 table) | **REFUTED (line count)** | **1329** raw / **941** effective at HEAD. `let state = worldState;` reproduces verbatim at `:279` |
| EP-S085 | `roadsKernel.js` is **838** and AT CEILING (§4 slice budgets) | **MEASURED-TRUE** | baseline literal `838` |

---

## §6 · UNDO, PREVIEW, REPLAY, LIFECYCLE

| # | Claim | Grade | Evidence |
|---|---|---|---|
| EP-S086 | `previewCampaignWorldPulse` is `return runWithPinnedContent(args, false);` — the same body as the committed advance with `commit = false` (§0.3 R8, §3c) | **MEASURED-TRUE** | `advanceCampaignWorld.js:32-34` verbatim |
| EP-S087 | **A-P3-3:** `grep -nE "commit \?\|if \(commit\)\|commit &&\|!commit"` over `pulseKernel.js` exits 1 with no output; `grep -nw commit` returns SIX lines of which only TWO are code — the destructured signature and `committed: commit,` (§3c) | **MEASURED-TRUE** | exit 1, no output; `grep -nw commit` → 199, 224, 766, 784, 787, 1746 = **six lines**, code at 224 and 1746 only. **Reproduces exactly, including the arithmetic** |
| EP-S088 | `pulseIdFor(campaignId, tick)` is `` `world_pulse.${stablePart(campaignId)}.${tick}` `` — two epochs of the same tick mint the same id (J-EP-4) | **MEASURED-TRUE** | `worldState.js:687-689` verbatim |
| EP-S089 | `MAX_HISTORY = 80`, applied in BOTH `appendPulseHistory` and `ensureWorldState` (§3d, Q3) | **MEASURED-TRUE** | `worldState.js:15`, `:537` (`cloneArray(raw?.pulseHistory).slice(-MAX_HISTORY)`), `:697` (`[...current.pulseHistory, record].slice(-MAX_HISTORY)`) |
| EP-S090 | `cloneArray` is `value.map(item => ({ ...item }))` — a shallow per-record spread, NOT an allowlist, so the epoch survives the load normalizer with no teach (§1.2(b)) | **MEASURED-TRUE** | `worldState.js:73-75` verbatim |
| EP-S091 | `pulseHistory` is written at exactly ONE seam: `appendPulseHistoryWithProvenance` → `worldState.js#appendPulseHistory` (§1.2(a), §8.1 row 9) | **MEASURED-TRUE as an APPEND claim** | `appendPulseHistory` defined at `worldState.js:695`, called only from `provenanceKernel.js:452` and `:481`. ⚠ **The chair's X4 partial stands:** `collapseIntervalHistory` is a second real WRITER of `pulseHistory` on the persisted world via `{ ...worldState, pulseHistory: composed }`. The volume knows and rules that path; only the §8.1 wording overreaches |
| EP-S092 | `warTermination.js` builds a SYNTHETIC pulseHistory record carrying **exactly two keys, `tick` and `warTerminationReads`, and NO `createdAt`** (§8.1 row 9) | **MEASURED-TRUE** | `warTermination.js:1032` verbatim — `{ tick: syntheticPrior.tick, warTerminationReads: [syntheticPrior] }`. The anchored negative's discriminator is real |
| EP-S093 | `WORLD_STATE_SCHEMA_VERSION = 2`; no per-record migration exists, so no migration and no version bump is owed (§8.4 migrate row) | **MEASURED-TRUE** | `worldState.js:13` |
| EP-S094 | The account-IMPORT path drops the entire worldState, DECLARED via the typed row `['worldState','world_state_not_imported','World simulation state']` (§8.4) | **MEASURED-TRUE** | `src/lib/importReconciliationAdmission.js:391` verbatim |
| EP-S095 | `pulseUndoStack` is SESSION-ONLY, absent from `partialize`, `PULSE_UNDO_CAP = 10` (§3c row 1, Q2's rider) | **MEASURED-TRUE, one address moved** | `campaignWorldPulseSlice.js:16` in-source *"NOT persisted; a reload clears it"*; `PULSE_UNDO_CAP = 10` at `campaignAdvanceSession.js:68`. ⚠ **The chair's "exhaustive object literal in `src/store/index.js` listing eight keys" is stale:** `partialize: partializeStoreState` (`index.js:120`) now delegates to `src/store/persistProjection.js`, which projects exactly the same **eight** keys with `pulseUndoStack` absent. Conclusion intact, address moved |
| EP-S096 | `tests/store/advanceFullAutoResolve.test.js` carries two cross-store byte-equality claims that EP-2 must TEACH, never weaken (§3a, §8.1 row 5) | **MEASURED-TRUE** | file present |
| EP-S097 | `tests/domain/advanceWorkerByteIdentity.test.js` is the replay-pin model (§3d) | **MEASURED-TRUE** | file present |
| EP-S098 | `tests/helpers/dormancyOracle.js` is the projection idiom §3c's preview pin names (§3c) | **MEASURED-TRUE** | file present |

---

## §7 · THE GENERATOR-SIDE LAW (§3e)

| # | Claim | Grade | Evidence |
|---|---|---|---|
| EP-S099 | **H1:** `CONFIG_PATCH_EXTRA_KEYS` contains the literal token `seed`, so `updateConfig` admits it (§3e H1) | **MEASURED-TRUE** | `configSlice.js:80-88` — `seed` appears in the space-joined set; `isAllowedConfigKey` consults it on write only (`:100-103`) |
| EP-S100 | H1 argument 2: `updateConfig` is a patch loop that cannot delete, so an already-poisoned device's key is never removed (§3e) | **MEASURED-TRUE** | `isAllowedConfigKey` is consulted only on WRITE; no delete branch |
| EP-S101 | **A17's door:** `freshSeed() { return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6); }` (§3e A17, H4) | **MEASURED-TRUE** | `InstantWorldEntry.jsx:38-40` verbatim |
| EP-S102 | **A3's silent replay:** the seed lives in `useState(freshSeed)` minted once at mount and is always passed (§3e A3) | **MEASURED-TRUE** | `InstantWorldEntry.jsx:63` `const [seed, setSeed] = useState(freshSeed);` |
| EP-S103 | **A18's door:** `` const newSeed = () => `surveyor-${Math.random().toString(36).slice(2, 10)}`; `` (§3e A18, H4) | **MEASURED-TRUE** | `ConstructionPanel.jsx:30` verbatim |
| EP-S104 | `src/components` + `src/store` carry **21** `Math.random` sites, of which only TWO are seeds (§3e H4) | **MEASURED-TRUE** | **21** at HEAD; the two seed doors are EP-S101 and EP-S103. **`SEED_DOOR_DEBT` frozen at TWO is correct at HEAD** |
| EP-S105 | **A4/A5 (§7a row 1, PARKED):** `forkSeedFor(sample, userId)` is `` `${sample.config.seed}-${suffix}` ``, a pure function of (card, user) | **MEASURED-TRUE — premise only; disposition PARKED, not graded** | `sampleSettlements.js:138-142` verbatim |
| EP-S106 | **A11 (§7a row 2, PARKED):** `nextLayoutVariant(edits)` is `return readLayoutVariant(edits) + 1;` | **MEASURED-TRUE — premise only; disposition PARKED, not graded** | `mapEdits.js:537` verbatim |
| EP-S107 | **H5 (§7a row 3, PARKED):** `_regenSeed` holds only the LAST reroll | **UNVERIFIABLE-AT-BASE — premise not re-measured; disposition PARKED, not graded** | not swept: the chair rulings already CONFIRM it and name three strip sites (migration 121, `publicSafe.js`, `FORBIDDEN_MANIFEST_KEYS`); re-measuring a parked row's premise buys nothing this sweep can act on |
| EP-S108 | **J-EP-10's FORCE_RESETTLE finding (§7a row 4, PARKED):** the stream is tick-invariant | **MEASURED-TRUE — premise only; disposition PARKED and ESCALATED, not graded** | EP-S048 |
| EP-S109 | `tests/store/updateConfigPatchValidation.test.js` currently ASSERTS the admission at two places (§3e H1 residual b) | **MEASURED-TRUE** | `:204` `expect(isAllowedConfigKey('seed')).toBe(true);` and `:103` `expect(store.getState().config.seed).toBe('mossgate-004-user1');`. **Exactly two, exactly as stated** |
| EP-S110 | `scripts/mutation-coverage-manifest.json` exists as the instrument-file precedent for `regen-affordance-manifest.json` (§3e) | **MEASURED-TRUE** | present; `regen-affordance-manifest.json` correctly ABSENT (EP-4 is unbuilt) |
| EP-S111 | The affordance denominator is EIGHTEEN with tally 6 · 4 · 1 · 7 (§3e) | **UNVERIFIABLE-AT-BASE** | the tally is an arithmetic property of the volume's own table, not of the tree; the individual door premises that CAN be measured (A3, A4/A5, A11, A17, A18, H1) all reproduce |

---

## §8 · THE PARENT VOLUME, THE FOLD AND THE QUEUE ARITHMETIC

| # | Claim | Grade | Evidence |
|---|---|---|---|
| EP-S112 | §5's promotion banner: post-fold **63 flags · 108 waves · 112 seams**, EP contributing flag row **63**, six waves, and logical seam rows **103-112** as ONE compressed range row | **PARTLY REFUTED** | At HEAD `docs/DESIGN_FP_ARCHITECTURE.md`: §3 header reads **63 new virtual flags** with **63** numbered rows and EP at row **63** — CONFIRMED. §9 carries the compressed range row `\| 103-112 \| THE ADVANCE-EPOCH BLOCK (10 rows) \|` and the closing summary says **112 seams** — CONFIRMED. ⛔ **§5's header now reads `111 waves`, not 108** — HB/WC waves landed after EP's rows composed |
| EP-S113 | §5 item 1: *"MEASURED: 43 live + 1 ES + 8 WY = 52; EP is next"* → **flag row 53** | ⛔ **REFUTED, and the volume's own banner already contradicts it** | EP landed as **row 63**. Item 1's body text was never struck the way item 3's ordering clause was, so the volume simultaneously publishes 53 (item 1) and 63 (banner). A compiler reading item 1 writes a wrong row number |
| EP-S114 | §5 item 5: the seam matrix amends **+10** | **MEASURED-TRUE** | rows 103-112 = ten logical rows, landed |
| EP-S115 | §5 item 6's verbatim-landing text: *"five EP-prefixed chair questions and FOUR owner-gated parked rows"* (chair ruling P4) | **MEASURED-TRUE in the volume; the FOUR is intact** | seven prose statements plus the table all read FOUR (lines 305, 3113, 3359, 3716, 4008 + the four-row table). A counter-sweep for a competing figure returns nothing |
| EP-S116 | §5 item 3's ERRATUM — *"and BEFORE the WY engine lane's PHASE-3 entry at WY-2"* is struck as unsatisfiable; the surviving half is "after the CR-WR10-H discharge completes at ES-4" | **MEASURED-TRUE** | the landed parent's §5 places `**EP-0..EP-4** land immediately after the CR-WR10-H discharge completes at ES-4`. The erratum is correct and the fold honoured the surviving half |
| EP-S117 | §5's HISTORICAL paragraph: `docs/DESIGN_FP_ARCH_ES.md` (1811 lines) and `_WY.md` (1657) now exist as repo files | **MEASURED-TRUE (existence); REFUTED (figures)** | both exist; **2078** and **1687** lines at HEAD. The files grew after the fold |
| EP-S118 | §8.1 row 4 / the parent's §9 row 103-112 published denominator: *"32 goldens · 27 fixtures · 8 oracle suites · 4 four-fence sets"* | ⛔ **REFUTED, AND IT IS PUBLISHED VERBATIM IN THE PARENT** | At HEAD: **53** property dormancy tests, **16** `*DormancyFence.test.js` files, **49** test files importing `dormancyOracle`, **12** soak files. Every figure is stale by a large multiple, and the stale set is what the landed parent volume carries |
| EP-S119 | §4 EP-1's dormancy line: "32 property dormancy goldens, 27 golden fixtures, 8 `dormancyOracle` byte-identity suites, 87 direct-kernel tests and 11 soak fixtures — VERIFY, do not assume" | **REFUTED** | as EP-S118, plus **47** test files import `pulseKernel.js` (the "87 direct-kernel tests" figure is in a different unit — test CASES — and is UNVERIFIABLE-AT-BASE without a run). ⭐ The clause's own instruction — *VERIFY, do not assume* — is the correct disposition and this row discharges it |
| EP-S120 | `tests/property/casusCommerciiDormancyFence.test.js` landed at `d7ea69a4` (§2.5's cited precedent) | **MEASURED-TRUE** | `git log --diff-filter=A` → `d7ea69a4 TR-1 THE CASUS COMMERCII: commerce learns to say why it shut the gate` |
| EP-S121 | ⭐ **ZERO EP CODE HAS LANDED** (the volume's clean-slate assumption; the build copy's TE3 banner) | **MEASURED-TRUE** | zero hits in `src`/`tests` for `advanceEpochEnabled`, `epochSuffix`, `advanceEpoch`, `tickStreamSeedOf`, `yearStreamSeedOf`, `stampAdvanceEpochYear`, `advanceEpochLedger`; `scripts/regen-affordance-manifest.json` absent. ⚠ The TE3 banner names `epochSegment.js` as absent — **that module name appears nowhere in the volume**, which names `src/domain/advanceEpochLedger.js` and `epochSuffix` in `prng.js`. The banner's CONCLUSION is right; one of its module names is not the volume's |
| EP-S122 | `tests/copy/landingClaimsParity.test.js` binds `landing.brief.deterministic` verbatim and reds on a reword by design (§8.3, EP-5) | **MEASURED-TRUE** | `:73` `expect(landing.brief.deterministic).toBe('Same seed, same town. Every time.');` |
| EP-S123 | §8.5's LOOSE-anchor requirement: at least eight spellings exist including one with NO COMMA in `tests/domain/routeNetworkDormancy.test.js` | **MEASURED-TRUE (the named instance)** | `:18` *"THE PROMISE says a seed is a world forever"* — no comma. The eight-spellings figure itself is UNVERIFIABLE without the full sweep EP-5 owns |

---

## §9 · THE VOLUME'S CLAIMS ABOUT ITS OWN RULINGS, vs. THE RECOVERED CHAIR TEXT

*Cross-checked against `review-fixes-2026-07-08:docs/architected-volumes-pending-fold/EP_CHAIR_RULINGS.md`
(1,036 lines, committed at `4aae432f`) and the previously-unnamed
`EP_ROUND7_CONFIRM.md` (651 lines) in the same directory.*

| # | Claim | Grade | Finding |
|---|---|---|---|
| EP-S124 | The volume's header: *"Open at landing: 5 chair questions (§7), 4 owner-gated parked rows (§7a), 2 chair-owed dispositions (§7b), 1 recorded deferral"* | ⛔ **REFUTED — ALL FIVE QUESTIONS AND BOTH DISPOSITIONS ARE RULED** | `EP_CHAIR_RULINGS.md` rules **Q1 = ARM A** (chair-ruled, unblocking EP-3 slice B outright), **Q2 = LINEAR-WITH-DISCARD**, **Q3 = ACCEPT AND DECLARE THE BOUND**, **Q4 = `advanceEpochEnabled`** (unblocking EP-1), **Q5** split — A4/A5 not chair-rulable (already owner-signed), the H1 independence clause CHAIR-RULED and CONFIRMED DISCHARGED; **B1 = REPORT, NEVER DELETE, reading (a)**; **B2 = reading (a)**. The A10 deferral is left deferred. **A compiler reading only the volume believes five questions block work that is in fact dispatchable** |
| EP-S125 | The volume's §7 Q1: *"blocks EP-3 SLICE B ONLY"*, with the revision-3 warning that Arm A costs "one line on `pulseKernel.js`" | **REFUTED as a cost statement** | The rulings' Q1 §1: G1/J-EP-14 moved seam edit 9, the leaf, the writer, the +1 import and the manifest row into slice A, which ships under either arm — so **slice B's kernel import edit is +0 and Arm A no longer buys a single new line anywhere.** The volume's §7 still carries the superseded price, in the one section a chair reads to rule |
| EP-S126 | §7b B2's stated premise: *"`mintRealmVerbProposal` composes `` `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}` `` off the COMMITTED world"* | ⛔ **REFUTED — INDEPENDENTLY CONFIRMED AT THE SWEEP SHA** | `mintRealmVerbProposal` (`applyWorldPulse.js:1294`) calls `buildRealmVerbOutcome` (`realmVerbExecution.js:158`), which composes NO seed — all three `const seed =` lines (676/742/809) sit inside `applyRealmVerbOrder` (`:320`). The mint composes nothing |
| EP-S127 | **J-EP-15:** *"`applyWorldPulseOutcomes` has FIVE call sites … two of the others (`mintRealmVerbProposal`, `applyWorldPulseProposal`) reach `applyRealmVerbOrder`"* | ⛔ **REFUTED — the count is ONE, not two** | FIVE call sites CONFIRMED (`pulseKernel.js:1429`, `envoyPulse.js:332`, `applyWorldPulse.js:1217` and `:1315`, `partyImpact.js:446`). **`applyRealmVerbOrder` has exactly ONE call site in the whole tree — `applyWorldPulse.js:514`**, inside the per-outcome loop past the `applyMode: 'proposal'` short-circuit. Only the APPROVAL door reaches it. **The DM-door count is ONE everywhere** |
| EP-S128 | **EP-3 slice A's DM-DOOR pin** (§4): *"`mintRealmVerbProposal` on a NEVER-LIT world composes today's literal key, and on a lit world composes the key bearing that world's own `latest` epoch"* | ⛔ **VACUOUS AS SPELLED — INDEPENDENTLY CONFIRMED** | it drives a function that composes nothing in either flag state: green under a correct build, green under a broken one, green under a build that never wrote the accessor. **This is the volume's own revision-6 rule failing on the volume's own newest pin, at a third address after R11 and R13.** The repair (re-aim at `applyWorldPulseProposal`, mint-then-APPROVE, plus the mutant that a mint-only pin stays green) is chair-commissioned as binding condition **C1** and is **NOT YET APPLIED to the volume text at either copy** |
| EP-S129 | The volume's §7a: *"none builds inside this program"* | **MEASURED-TRUE as to EP, STALE as to authority** | The rulings' §4.2 find rows 1, 2 and 3 already SIGNED by the 2026-08-06 blanket sign-off and row 4 ESCALATED (chair declines to consume the signature: the recommendation's own content asks for a separate owner signature; it is a THE PROMISE event in BOTH flag states with no flag to darken it). §4.3 reconciles the collision: **the sign-off wins on authority, the volume wins on sequencing — rows 1/2 build as their OWN waves with their own gates, never as EP-4 slices**, which preserves EP-4's load-bearing claim that no slice changes a persisted shape. **All four therefore remain PARKED with respect to every EP wave, exactly as this sweep treats them** |
| EP-S130 | The volume header's ⛔ *"REVISION 6's four rulings are confirmed by nobody"* / chair escalation **E5** (*"EP may not be dispatched as an attested volume needing only queue insertion"*) | ⛔ **REFUTED — E5 IS CLOSED, AND NEITHER THE VOLUME NOR THE RULINGS DOCUMENT SAYS SO** | `EP_ROUND7_CONFIRM.md` performs the missing confirm round (G2/G3/G4 **CONFIRMED**, G1 **DEFECTIVE-AND-REPAIRABLE** on the DM-door pin) and carries a **⚖ CHAIR RULING ON E5 — 2026-08-07: E5 IS CLOSED**, with three binding conditions: **C1** the DM-door repair with three added guardrails lands before EP-3 slice A builds; **C2** the draw-count parity claim is EXECUTED before EP-1 *lands*, a failure being STOP-AND-REPORT never a repair in place; **C3** EP's rows compose LAST and the parent count is taken pre-fold, the trigger re-firing on any intervening fold. ⚠ **The volume's own front matter still reads "REVISION 6 … the LAST content round" with no round-7 block, and its §7/§7a/§7b still read as open.** ⏳ Both documents are marked **OPUS-ERA — FABLE VALIDATION OWED** |
| EP-S131 | The volume records SEVEN passes but documents six in front matter (rulings §1.2f) | **MEASURED-TRUE, partly cured** | exactly two round-seven marks in the volume: the fold header's line 16 (*"a ROUND-SEVEN DRAFT"* — added at the fold, curing the finding at the top) and the original in-body mark at line 2155 inside the DISPLAY-SURFACE RULE. The revision blocks themselves still stop at six |

---

## EXECUTION LOG

Three focused single-file vitest runs in the code-of-record worktree, exit status captured
in-shell with `; echo TRUE_EXIT=$?` after redirect (never through a pipe, per the banked
"trust no exit status you did not capture" rule).

| Command | Result | Exit |
|---|---|---|
| `npx vitest run tests/kernel/prngForkLabelDelimiter.test.js` | `Test Files 1 passed (1) / Tests 3 passed (3)` | **0** |
| `npx vitest run tests/lib/spatialLedgerCoverage.walker.test.js` | `Test Files 1 passed (1) / Tests 4 passed (4)` | **0** |
| `npx vitest run tests/domain/subsystemRowsVirtual.test.js` | `Test Files 1 failed (1) / Tests 1 failed \| 13 passed (14)` | **1** |

### ⚠⚠ THE THIRD RUN IS A FALSE RED, AND ITS DIAGNOSIS IS A SWEEP FINDING

The failure is `expected [ 'beliefAxesEnabled', …(19) ] to deeply equal [ …(18) ]`, the extra
key being **`treatyRenewalEnabled`**. MEASURED: that key exists **only in the working tree**
(`src/domain/worldPulse/simulationRules.js:311` uncommitted, with its paired certification row
in `subsystemRowsVirtual.js` and its reader in `pactAmendment.js`). **At the sweep sha
`6cd18ad3` both `ENGINE_GATED_VIRTUAL_RULE_KEYS` and `VIRTUAL_RULES` carry exactly NINETEEN
members and the bijection holds** — the test is GREEN at HEAD.

The red belongs to the **concurrent gr-5a executor's in-flight GR-5 work**, which wrote four
`src` files between this sweep's first `git status` (docs-only dirt) and its last. It is not
EP's, not this lane's, and not a defect at the code of record.

⛔ **THE OPERATIONAL LESSON, recorded because SPV lanes run beside executors by design (§1.5):**
`vitest` reads the WORKING TREE, not the sweep sha. **A read-only lane's focused test run is
NOT a measurement of the code of record while an executor is live.** Executed evidence for a
HEAD-state claim must come from `git show HEAD:` / `git grep … HEAD` (as every row above does),
or from a run in a tree the lane controls. The two green runs above touched no file the gr-5a
lane had written and are reported as green-in-the-live-tree, not as green-at-HEAD.

---

## THE FIVE SHARPEST REFUTATIONS

1. **EP-S128 — EP-3 slice A's DM-DOOR pin is VACUOUS, and the repair is unapplied.**
   `applyRealmVerbOrder` has exactly ONE call site in the tree and it is the APPROVAL door;
   `mintRealmVerbProposal` composes no seed in either flag state. A pin driving the mint is
   green under a build that never wrote the accessor. Chair condition **C1** commissions the
   repair before slice A builds; **neither copy of the volume carries it yet.**

2. **EP-S030/EP-S032 — the FROZEN-EIGHT TRAP is dead and J-EP-1 rests on it.** `VIRTUAL_RULES`
   holds **nineteen** members, not eight; eleven programs have edited the file the judgment
   block exists to avoid editing. J-EP-1's stated premise and its stated veto cost ("three other
   programs") are both refuted. The block must be re-argued or re-ruled before EP-1 builds.

3. **EP-S042/EP-S043/EP-S044 — three closure-record figures the walker would FREEZE have
   drifted.** `createPRNG(` in `src/domain` is **38** (the volume says 37, corrected *from* 38);
   `hash01` consumer modules are **13** (the volume says TEN); whole-tree `createPRNG(` is **48**
   (47). EP-0's walker freezes these as shrink-only baselines — **frozen as written, it reds on
   day one.** The 25-composition and 22-read-site denominators SURVIVE; only the closure figures moved.

4. **EP-S118/EP-S119 — the dormancy-estate denominator is stale by multiples, and the stale set
   is PUBLISHED VERBATIM in the landed parent volume.** "32 goldens · 27 fixtures · 8 oracle
   suites · 4 four-fence sets" measures **53 / 16 / 49 / 12** at HEAD. `docs/DESIGN_FP_ARCHITECTURE.md`
   §9 row 103-112 carries the old set.

5. **EP-S124/EP-S130 — the volume's own status blocks are refuted by two recovered chair
   documents.** All five chair questions and both §7b dispositions are RULED (Q1 = Arm A, which
   unblocks EP-3 slice B outright), and **E5 is CLOSED** by a chair ruling inside
   `EP_ROUND7_CONFIRM.md` with three binding conditions. The volume still presents itself as
   five-questions-open with no round-7 block. ⏳ Both chair documents are **OPUS-ERA, FABLE
   VALIDATION OWED**, so the rulings they carry are banked, not yet Fable-surveyed.

---

## WHAT THIS SWEEP DID NOT DO

- **Did not re-measure §7a's four parked rows as dispositions.** Their premises are graded
  (EP-S105..EP-S108); their rulings are the owner's. EP-S107 (H5) is the one parked premise
  left UNVERIFIABLE-AT-BASE, deliberately.
- **Did not execute the draw-count parity claim (EP-S021).** No instrument exists and building
  one is a code act. It is chair condition C2 and belongs at EP-1's landing.
- **Did not grade design LAW.** Per §1.1, a conflict in design law is STOP-and-report to the
  chair, never a sweep verdict. Q1's arms, J-EP-8's branching model and the DISPLAY-SURFACE
  RULE are law and are untouched here.
- **Did not run any gate, `npm run check*`, lint, or the census suite,** and held no mutex.
- **Did not edit the volume.** Every correction above lives here, per §1.2's last rule; volume
  text cleanup remains its own micro-act class.
