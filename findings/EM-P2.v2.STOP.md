# EM-P2 — STOP (Opus build lane, session 7d3418f8, 2026-09-19 14:5x EDT)

**Stopped UNCOMMITTED with ZERO edits.** `git status --short` in `$SP/lane-em-b3b` = 0 lines.
Sealed at branch `fixes-2026-09-18-consist`, HEAD `f31ca0eb8`, verified base `00fab686d`.
Both goldens unmoved (nothing was written). No `src/generators` file read-modified. No instrument touched.

**What fired:** the brief's STOP *"an `outputKey` that does not resolve"* AND
`PACKET_STANDARD.md`'s *"live code refutes state ownership, lifecycle, or ordering"*.
Underneath both: **the packet's §0 measurement (b) — its central premise for the sibling's
idiom set — is REFUTED BY EXECUTION at the sealed base.**

---

## THE SMALLEST MEASURED CONTRADICTION

§6 fixes the PICK signature as `pickRandom(`. The same chooser has a second spelling that
signature cannot match, at 50 call sites inside the scan root:

```
$ sed -n '62,64p' src/generators/helpers.js
export const pickRandom  = (arr) => _pick(arr);
/** Alias for pickRandom — kept for call-site compatibility. */
export const pickRandom2 = (arr) => _pick(arr);

$ git grep -c "pickRandom2(" -- src/generators
src/generators/narrative/historyCoherence.js:3
src/generators/narrativeGenerator.js:5
src/generators/narrativeText.js:35
src/generators/npcGenerator.js:6
src/generators/power/settlementNarrative.js:1
                                    TOTAL LINES = 50
```

`pickRandom` and `pickRandom2` are **byte-identical bodies** (`_pick(arr)` both). Neither of
the five files above is skipped by a `DECLARES_IDIOM` guard, so all 50 sites are inside the
scanned corpus and all 50 are invisible to `/\bpickRandom\s*\(/`.

⇒ A1's *"the declared row set EQUALS the scanned set in both directions"* would run **GREEN
with 50 live chooser call sites unregistered** — the exact failure the model walker's own
header names: *"a totality walker whose roots miss a whole domain directory does not report a
gap, it reports SUCCESS."* A sibling minted on this signature set is born asserting a totality
it does not have.

---

## THE FULL FINDING SET, ordered by severity (all CONFIRMED — executed at `f31ca0eb8`)

### S1 ⛔ The three declared signatures are a PROPER SUBSET of generation's draw vocabulary

§0 (b) and §P2-E1 (b) measured generation as drawing through `rng.fork(` (14), `pickRandom(`
(13), `createPRNG(` (6) and concluded *"Pointed at `src/generators` the scan finds **zero**"*
for the simulation's idioms. That half is true. **The converse — that these three spellings ARE
generation's vocabulary — is false**, on three independent measurements:

**(a) the `pickRandom2` alias — 50 sites** (above).

**(b) `rng.fork(` is RECEIVER-SPELLING-BOUND and misses four live keyed forks.**

```
$ git grep -c "\.fork("     -- src/generators | awk -F: '{s+=$2} END {print s+0}'   20   (17 code, 3 comment)
$ git grep -c "\brng\.fork(" -- src/generators | awk -F: '{s+=$2} END {print s+0}'  14   (13 code, 1 comment)
```
The four code sites `/\brng\s*\.\s*fork\s*\(/` cannot see, every one a genuine keyed stage fork:
```
src/generators/density/applyDensityLaw.js:188   rollFloorLift(lawRng.fork('floor-lift'), …)
src/generators/density/densityRoll.js:558       rungRng.fork(p.key), tier, size, vacancyMult,
src/generators/power/economyReconciliation.js:132   rngSeed: stepRng.fork(POWER_STREAM).seed,
src/generators/steps/assembleSettlement.js:70   const substreamRng = stepRng.fork(label);
```
⚠ `economyReconciliation.js:132` is the **NC-1 mandatory control's own line** — the one
`src/generators` row the entropy census pins. The declared FORK signature is blind to it.

**(c) THE AMBIENT CHANNEL — no declared signature can see a draw that names no stream.**
22 files under `src/generators` import `kernel/rngContext.js` (`random`, `pick`, `chance`,
`randInt`, `shuffle`, `weightedPick`), and `npcGenerator.js:51` re-wraps it
(`const pickFromArray = r => ctxPick(r);`). **EM-P0's own evidence §P0-E9 measured 62 of the
population step's 67 derive-half draws travelling on exactly this channel**, ambiently, via
`setActiveRng(stepRng)` at `pipeline.js:187`. The packet's scanned half is structurally blind
to the largest draw channel generation has, and the estate had already measured it.

### S2 ⛔ ONE ROW CANNOT CARRY THE FORK KEY — the scan key and `forkKey` disagree in arity

The scan key is `module#symbol` (copied from `chooserTotality`), and A2 requires a **duplicate
`module#symbol` to THROW**. But §6 defines `forkKey` as *"the exact string passed to
`rng.fork(...)`"*, and measured:

| scanned key | distinct fork strings under it |
|---|---|
| `src/generators/density/densityRoll.js#rollDensityPlan` | **4** — `'sizing'` @489, `'seats'` @530, `'dispersal'` @542, `'rungs'` @547 |
| `src/generators/density/densityRoll.js#chooseSeats` | **2** — `'rival'` @224, `'niches'` @265 |

One row, four fork keys, and no second row permitted. Worse, at four sites the argument is not a
literal at all — `rng.fork(name)` (`pipeline.js:207`), `rng.fork(label)`
(`narrativeGenerator.js:1048`), ``rng.fork(`exclusiveCoexist::${tier}::${category}::${name}`)``
(`assembleInstitutions.js:347`), `rungRng.fork(p.key)` (`densityRoll.js:558`) — so "the exact
string" does not exist to be recorded. Settling this is a change to the register's KEY, which is
architectural and `PACKET_STANDARD.md` forbids a coding agent from adjudicating.

### S3 ⛔ Five scanned choosers have NO truthful `outputKey`, and §6 settles no absence rule

A1 forces a row for every scanned key; A4 requires *"every path resolves … and every one sits
under a ROOT half's output"*. These five write no record path at all — they mint or fork a
STREAM:

```
src/generators/pipeline.js#runPipeline                         rng.fork(name)      — the step fork (§5 names it "the row key's outer scope")
src/generators/generateSettlementPipeline.js#generateSettlementPipeline   createPRNG(seed)  — the root stream
src/generators/generateSettlementPipeline.js#regenNPCsPipeline            createPRNG(seed)
src/generators/generateSettlementPipeline.js#regenHistoryPipeline         createPRNG(seed)
src/generators/narrativeGenerator.js#inCoherenceSubstream                 rng.fork(label)
```
(plus `crossSettlementConflicts.js#generateCrossSettlementConflictsDeterministic`, a
PAIR-scoped mint whose product is not on a settlement record at all).

§6 settles an absence rule for `forkKey` (*"`''` when the chooser draws on its step's own
stream"*) and refuses `null` anywhere — but settles **nothing** for an `outputKey` that has no
record to name. Choosing `''` plus a declared stream roster is a defensible design; it is also a
**field semantic the packet deliberately left unsettled**, i.e. exactly the non-`NONE` judgment
§12 and `PACKET_STANDARD.md` say invalidates READY. I did not invent it.

### S4 ⛔ The packet's own example `outputKey` DOES NOT RESOLVE

`powerStructure.seats[].holder` is quoted in §6's `outputKey` contract and **twice** in A4's
required observation. Walked against a real settlement generated at this HEAD:

```
$ node measure-record.mjs
powerStructure KEYS = ["conflicts","criminalCaptureState","economyInputFingerprint",
  "factionRelationships","factions","governingName","government","powerProjectionVersion",
  "publicLegitimacy","recentConflict","stability"]

ABSENT    powerStructure.seats[].holder  — no value at "seats[]"
ABSENT    powerStructure.factions[].size
ABSENT    powerStructure.factions[].roster[].role
ABSENT    powerIntent            ← a declared `provides` of the ROOT-WRITING step generatePower
RESOLVES  npcs[].role (n=15) · institutions[].category (n=49) · powerStructure.factions[].faction (n=8)
          · powerStructure.factions[].power (n=8) · factions[].powerFactionName (n=4) · settlementReason (n=1)

$ git grep -n "powerStructure\.seats" -- src tests      (no output — the path exists nowhere)
```
**EM-A1 joins the registry on `(cardShape, outputKey)`.** A design built on
`powerStructure.seats[].holder` is joining on a path the record has never had, and `powerIntent`
— provided by a root-writing step — never reaches the assembled record either. This is a real
finding about the pipeline, which §11 rules *"belongs to EM-P0's family, not to a row here."*

### S5 ⚠ The mandated resolver MIS-ATTRIBUTES 2 of the 16 scanned keys (locally curable)

§6 requires `symbol` resolved *"exactly as chooserTotality's own `enclosingSymbol(code, index)`
already does."* Generation's step choosers live inside `registerStep('<name>', {…}, (ctx, rng) =>
{…})` callbacks — an argument arrow with no binding — so the resolver walks back past the call:

| site | resolver says | what actually holds the chooser |
|---|---|---|
| `steps/resolveConfig.js:170` `rng.fork('cultural-identity')` | `CULTURES` (a frozen string array, `:41`) | the `resolveConfig` step body (`registerStep` @46) |
| `steps/assembleInstitutions.js:347` `rng.fork(\`exclusiveCoexist::…\`)` | `collapseUpgradeChains` (`:189`) | the `assembleInstitutions` step body (`registerStep` @213) |

`collapseUpgradeChains(institutions)` **takes no rng at all**; a row claiming it holds a fork is
a false record a later reader would act on. Curable in the new walker by teaching the resolver
the `registerStep('<name>'` declaration form — but §6 mandates the copy, so the chair rules.

⚠ Also recorded: the model's own `codeOnly` uses `/^\s*(?:import|export)…/gm`; under `/m` the
`\s*` eats the **preceding newlines**, preserving total length but destroying line starts, so
`^`-anchored declaration matching can drift. `[ \t]*` is the offset- and newline-preserving
spelling. Observed, not touched (`chooserTotality.walker.test.js` is NOT EDITED).

---

## WHAT WAS MEASURED GREEN (so the chair can see the stop is the packet's, not the tree's)

- Preflight, all clear: `chooseOrPin` present at `generatePopulation.js:41`; **exactly one**
  `registerStep(` in that file (`:226`); preamble SHA-256
  `95e9a5f4aee51bb5aaa434883a708c5f2a4c71d2a49aa4ec99f9076a98c2afaa` = the packet header.
- Sealed dispatch emitted and valid — see the receipt for the digests.
- The scan, executed: **114** files under `src/generators`, `helpers.js` skipped as the sole
  declarer (and it holds zero `rng.fork(`/`createPRNG(` sites, so the skip loses nothing),
  raw code matches FORK 13 / PICK 13 / PRNG_MINT 5, **scanned-set size 16**.
  Attribution against §P2-E1's raw figures is exact: `rng.fork(` 14→13 (one comment,
  `densityRoll.js:20`), `createPRNG(` 6→5 (one JSDoc, `pipeline.js:160`), `pickRandom(` 13=13.
- `pickFirst` (A2's module-local arm) resolves against source at `npcGenerator.js:240`,
  `const pickFirst = (…)`, never exported — that part of the design is sound.

## THE SHAPE OF A CURE (offered, not taken — the chair rules)

The sibling is still the right answer; §0's reasons (1), (3) and (4) are untouched by this. What
needs re-compiling is the **denominator**:

1. Re-cut `GENERATION_IDIOMS` from a measurement of generation's ACTUAL draw vocabulary —
   at minimum `pickRandom2(`, a receiver-agnostic `\.fork\s*\(`, and a ruling on the ambient
   `rngContext` channel (register it, or declare it out of denominator with an instrument
   beside it, the way `HABIT_FORK_REGISTRY` declares its blind half).
2. Rule the register's KEY: `module#symbol` (then `forkKey` cannot be "the exact string") or
   `module#symbol#forkKey` (then A2's duplicate rule re-cuts).
3. Settle the absence rule for `outputKey` on a stream-minting chooser.
4. Re-cut §6's and A4's example paths against the live record — `powerStructure.seats[].holder`
   and `powerIntent` do not exist — and tell EM-A1 what it actually joins on.
5. Decide S5's resolver question for `registerStep`-hosted choosers.

**No file in the worktree was created, modified, staged or committed.**
