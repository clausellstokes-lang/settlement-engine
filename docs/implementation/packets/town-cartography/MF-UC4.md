# Town cartography / MF-UC4 — the undercity EPOCH layer: `deriveUndercity` derives who grew the undercity and what receded, and the ONE persisted signal a derivation cannot recover — the vertical high-water mark — rides an existing pulse seam behind a NEW virtual flag that is dark by default

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `1b1de759155631b61659d8faff7fe69836687385`
  ⚠⚠ **AS AUTHORED — the row above now names the LANDING SLOT (`1b1de759`, MF-UC1's landing,
  the 44th; see §12 below); the BUILD base was `0f3897a56ba57201ca499651f963eb0d11b65761`.** The
  continuation that follows was written at that BUILD base:
  — HK-A's landing, the 43rd, read with `git rev-parse` at the lane's opening and re-read at every
  proof below. Every figure in this packet was executed at THIS base by the implementing lane
  TE-UC4; nothing is inherited from the charter (`draft-UNDERCITY-PLAN.md`, ruled ODQ §441,
  ratified §445.2) except where a row says so and names the re-derivation.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-UC4**, **`[OPUS-RUN · FABLE-VALIDATION OWED]`** (owner
  directive **ODQ §484**). Train **T-UC2, this member ALONE** — a flag-minting wave is a train
  boundary (§441.4), and no other undercity car is a no-flag slice of this flag.
- **Charter and rulings:** `draft-UNDERCITY-PLAN.md` §4 UC-4 (this member), §1 (the binding law
  quoted), §2 (the fabric-vs-engine split), §3 (the live estate and the license-home audit), §7 F5
  (the CT-4 fact contract this member produces), §8 R-5 (the owner docket item this member does
  NOT discharge), §9–§11. Doctrine citation: **ODQ §311** — specifically **§311.3** (the epoch law:
  "the mundane network is epoch zero; the inertia law holds; and the HIGH-WATER LAW runs
  underground — dug is forever"), **§311.4** (the two-level reading and proportional fill),
  **§311.8.1** (the general form), **§311.8.2(d)** (the DEMAND_DRIVEN temperament and the
  wall-or-toll licence), **§311.8.3** (flood and seal), **§311.8.4** (colonization order and the
  UNIVERSAL FRONT), **§175.1** (the truth roster). Also **§359.5** (the persisted-signal doctrine
  this member is the FIRST builder of), **§441.3** (one truth for the criminal share), **§441.4**
  (this member alone, the four-surface flag bill, dark by default), **§443** (pulse-written keys
  route through `buildCalamityLedger`), **§423** (the domain door: no new verb), **CR-WR10-C item
  4** (manifest entry + first gate read + certification row in ONE commit).
- **Preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed`, re-hashed at this base —
  unchanged, as §441.7 predicted.
- **Depends on:** **T2R LANDED** — `src/domain/highWater.js` exists at this base (`deriveHighWater`
  at `:183`), which is the charter's stated gate for this car. **UC-0 (`MF-UC0`) and UC-3
  (`MF-UC3`) LANDED** — `src/domain/undercity/{strataExistence,staticComponents,jointVocabulary}.js`
  all exist at this base. **UC-1 (`MF-UC1`) is NOT landed at this base** and this member does not
  need it: the seeds arrive from UC-0's `deriveStrataExistence`, whose optional
  `context.sanitationRung` argument is UC-1's seam and is not used here. Everything else this
  member reads is LANDED: `src/domain/corruption.js`, `src/domain/causalState.js`,
  `src/domain/factionArchetypes.js`, `src/domain/display/calamityLedger.js`,
  `src/domain/resolveTerrain.js`, `src/domain/deterministicSort.js`,
  `src/domain/worldPulse/stablePart.js`, `src/kernel/math.js`, `src/kernel/proseHash.js`.
- **Binds forward:** **CT-4** (ODQ §361.1) consumes this member as charter **§7 F5** —
  `undercity: { present, colonizationShare, drivers { economy, criminalShare, syndicates[],
  highWater }, components[], fossils[] }` — licensing the sentence class "who grew it, and what
  receded". ⛔ **On the DARK path (every live world today) `drivers.highWater` is `null` and
  `fossils` is EMPTY, and CT-4 is FORBIDDEN to ground a sentence in either** (§7 term 3). **UC-5**
  (`MF-UC5`) consumes each component row's `surfaceJoins[]` as the portal truth and registers the
  CONSEQUENCE of this member's G-43 arm (the tunnel's link loses its motive) — never a second
  cause. **The map program's D5 strata wave** consumes the same facts through §287.4's
  StrataExistencePlan seam.

---

## §1 · S0 — THE HOME TABLE, RE-WALKED FIELD-LEVEL AT `0f3897a5` (executed in this lane's worktree)

Every input the charter names, CONFIRMED by file:line at THIS base or corrected. A charter's
CONFIRMED is a hypothesis until a second instrument walks it (§441 J7), and two rows below are
corrections.

| # | input | home at `0f3897a5` (executed) | verdict |
|---|---|---|---|
| 1 | criminal share | `src/domain/corruption.js:527` `readCorruptionClimate(settlement)`; the read itself at **`:539-542`** — `crimEff = Number(sp?.compound?.criminalEffective)`, then `Number.isFinite(crimEff) ? n01(crimEff/100) : Number.isFinite(sp.blackMarketCapture) ? n01(sp.blackMarketCapture/80) : 0.3`, returned as `crime` at `:551`. ⚠ The charter and the brief say `:539-541`; the expression's fourth line (`: 0.3;`) is at `:542`. CONSUMED by importing `readCorruptionClimate` — never a parallel weighting (§441.3, J-10 struck) | CONFIRMED (span corrected) |
| 2 | economy | the SAME call's `prosperity` (`prosperityScore(eco.prosperity)`, table `PROSPERITY_SCORE` at `:495-499`, unknown → 0.4). One call, two drivers, no second reading | CONFIRMED |
| 3 | syndicate standings | `src/domain/factionArchetypes.js:103` `factionArchetype(faction)` and `:40` `CRIMINAL: 'criminal'`, over `settlement.powerStructure.factions` — the roster the faction-competition layer's own header (`factionCompetition.js:531-533`) names as the LIVE power source: *"factionStates carry no power scalar — the roster IS the live power source"* | CONFIRMED |
| 4 | seeds (UC-0) | `src/domain/undercity/strataExistence.js:246` `deriveStrataExistence(settlement, context)` → `{ exists, seeds[], refused[] }`; the canonical anchor key at `:168` `institutionAnchorKey` | CONFIRMED |
| 5 | the WALL fact | `src/domain/causalState.js:306` `defenseProfileHasWalls(def)` — the accessor MF-UC0's packet NAMED for this member (its §1 row 17, D-UC0-2's other half). The same fact the map draws (`mapProfile.js:180`, `townMap/townLayoutV2.js:262`). ⛔ Importing `causalState.js` costs this leaf NOTHING new: measured, its whole transitive closure is 28 files, contains ZERO `townMap/**` files, is already inside the first-paint static closure, and is already inside `factionCompetition.js`'s closure — the marginal new-file count is 0 | CONFIRMED |
| 6 | the TOLL fact | **NO TYPED HOME.** No engine accessor exists; the catalog's toll rows ('Toll bridge', 'Customs house', 'Gates (if walled)', "Harbour master's office") carry no facet a `facetOf` chokepoint read could resolve, and `FACET_INFERENCE` (`cohesionWeave.js:258-292`) declares only `institutionNature`, `institutionFunction` and UC-0's `institutionSubstructure`. A name-list match is REFUSED BY NAME everywhere in this train. §311.8.2(d)'s licence is "a wall OR toll", so the wall alone resolves it | **NO TYPED HOME** — the slot is typed and inert, `NO_TYPED_HOME_LICENCE = 'TOLL'`; D-UC0-2 re-deferred with the measurement (D-UC4-1). NOT a STOP |
| 7 | `deriveHighWater` | `src/domain/highWater.js:183` → `{ population, tier, window, demoted, deficit, evidence[], channels[], gaps[], understated, derivation }`. Read ONCE; its `tier` keys the colonization CEILING (the constitutional high-water law: built extent derives from the historical maximum) | CONFIRMED |
| 8 | `buildCalamityLedger` | `src/domain/display/calamityLedger.js:62` → `{ entries[], count, lastYear, totalDeaths, totalExodus }`. §443 satisfied: this leaf never names `calamityHistory` as a read; the flood/seal and fossil-date reads go through the banked projection | CONFIRMED |
| 9 | the dormancy-idiom flag read | **`src/domain/worldPulse/institutionLifecycle.js:672`** — `(context.simulationRules \|\| worldState?.simulationRules \|\| {}).underwaysOrganicFoundingEnabled === true`. ⚠⚠ The charter §3 and the dispatch brief both name `src/domain/institutionLifecycle.js:661`; **that path DOES NOT EXIST at this base** (`find src -name 'institutionLifecycle*'` returns only the `worldPulse/` file). The home resolves — only the path and the line were wrong | CONFIRMED (home CORRECTED, §441 J7) |
| 10 | the flag manifest | `src/domain/worldPulse/simulationRules.js:185` `ENGINE_GATED_VIRTUAL_RULE_KEYS`, array closing at `:366`, 24 keys at this base | CONFIRMED |
| 11 | the certification precedent | `src/domain/certification/subsystemRowsVirtual.js:54` `VIRTUAL_SUBSYSTEM_ROWS`; the `underwaysOrganicFoundingEnabled` row at `subsystemRowsCompact.js:396` and — the closer precedent for THIS member — the GR-5A **MONOTONE MEMORY** row `treatyRenewalEnabled` at `subsystemRowsCompact.js:449` (both re-addressed 2026-09-20: the rows moved lane to the COMPACT file; the old bare addresses, lines 988-1036 and 1041, were past the end of `subsystemRowsVirtual.js`) | CONFIRMED |
| 12 | the monotone-write precedent | `src/domain/worldPulse/pactAmendment.js:136` `treatyRenewalActive` (gate), `:160` `worstObservedEverOf` (the absence-resolving read), `:188` `worstObservedEverAfter` (the fold); the write site is ONE line at `peaceTerms.js:759` | CONFIRMED |
| 13 | the pulse seam this member uses | `src/domain/worldPulse/factionCompetition.js:221` `ensureFactionStates(worldState, snapshot, rng)` — called from `pulseKernel.js:347`, every advance, over every settlement's roster — and `:543` `projectFactionStatesOntoSettlement`, called from `pulseKernel.js:1765` per settlement per advance | CONFIRMED |
| 14 | the ruin roster | `tests/lint/ruinFilterRoster.walker.test.js:355` reads **90** at this base. This member's leaf reads `powerStructure.factions`, NEVER `.institutions`, so **no exempt-or-route disposition and no count raise is owed** — proved by execution, the walker GREEN at 90 with this member's files in the tree | CONFIRMED |
| 15 | the edge-bundle rosters | five `supabase/functions/_shared/*.meta.json`. **`src/domain/worldPulse/simulationRules.js` is an input of `aiCharterBundle` and `aiOutputSchemaBundle`** ⇒ `npm run build:edge-shared` runs in this member's commit and `tests/edgeFunctions` joins the sweep. `pulseKernel.js`, `institutionLifecycle.js`, `factionCompetition.js`, `subsystemRowsVirtual.js`, `urbanFabricKernel.js` are in NONE. (`corruption.js` and `causalState.js` are rostered but are only IMPORTED here, never modified) | CONFIRMED |
| 16 | the observed-shape S0, part 1 | `node scripts/check-observed-shape-readers.mjs` → TRUE_EXIT **1**, output **159 B**, SHA-256 `c5b67844abe51226f4c6862ae485dc5d9fa1e51148c70b4bd021e661f1ae0854`. The SAME command at the chair baseproof `chair-baseproof-b10ed1a1` (HEAD `b10ed1a1f5a0…`, its own `node_modules`, its own short TMPDIR): TRUE_EXIT **1**, **159 B**, the SAME digest, **`cmp` exit 0** — byte-identical and non-vacuous. The baseproof's porcelain read 0 before AND after and its HEAD did not move | PRE-EXISTING BY LOOKUP (mint-class, not this car's) |
| 17 | the generator golden | `tests/fixtures/generator-golden-master.json` SHA-256 `29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8` before the first edit and after the last | UNMOVED |
| 18 | the census tuple | `tests/lint/sovereigntyLightingContract.walker.test.js:5894` — `files: 2512, parked: 366, credited: 2146, titles: 20830, suiteTitles: 5804` | CONFIRMED (see §4) |
| 19 | the reader-walker literals | `tests/lint/observedShapeReaders.walker.test.js:737` — `{ reads: 1995, identities: 1409, files: 387, bankedReads: 60, taggedRows: 40 }`, and GREEN by EXECUTION at this member's tip (§4) | CONFIRMED |
| 20 | `validate:packets` at base | `[implementation-packets] valid: 165 packets (0 READY)`, TRUE_EXIT 0 | CONFIRMED |

**NO ROW READS STOP.** The toll slot is not one, for the same reason §441.2 ruled the founding-kind
slot is not one: the licence is a disjunction and its other half has a live home.

---

## §2 · C-2 — THE PERSISTED SIGNAL'S CONCRETE SHAPE (for the chair's §359.5 mechanical review)

The charter opens C-2 at this packet: *"UC-4 IS the first builder of the §359.5 persisted-signal
shape … the packet carries the concrete shape (field name, the ring-independent monotone write, its
reader) to the chair for the mechanical review before its GO."* Here it is, whole.

**WHY ANYTHING PERSISTS AT ALL.** Every other fact this train produces is derivable from the
settlement as it stands. The vertical high-water is not. §311.3 says *dug is forever* — the
undercity a syndicate excavated at its peak does not shrink when the syndicate is broken — but the
only live measure of syndicate strength is the roster's own `power`, which the pulse RENORMALIZES
every advance. A derivation cannot reconstruct a maximum from a present value, and nothing in the
estate retains a faction's historical maximum. That gap is exactly MF-D5's finding, accepted in
principle at §359.5.

| | the shape |
|---|---|
| **FIELD NAME** | `powerHighWater` — a number in `[0,1]`, on the FACTION record. Written on `worldState.factionStates[<factionId>]` and projected onto the matching `settlement.powerStructure.factions[i]`. The constant is exported as `POWER_HIGH_WATER_KEY` so no consumer spells it twice |
| **WHY THE FACTION RECORD AND NOT THE SETTLEMENT** | the quantity is a FACTION's peak, and the estate already keys faction state per faction. Hanging a settlement-level scalar off it would silently pick a winner among syndicates at write time; the deriver picks the maximum at READ time instead, where the rule is visible. This is also the GR-5A shape exactly — `worstObservedEver` lives inside a treaty record, not on a settlement |
| **RING-INDEPENDENCE** | the field is its own key on a per-faction record with no eviction and no window. It is NOT in `populationHistory` (12) or `calamityHistory` (8) or any other ring, which is the whole point: the rings are what forgot |
| **THE GATE** | `undercityHighWaterActive(worldState)` in `src/domain/undercity/colonization.js` — `rules.undercityHighWaterEnabled === true`, read ONCE, BY NAME, in the `urbanFabricActive` / `treatyRenewalActive` spelling. The key is ABSENT from `DEFAULT_SIMULATION_RULES` and from every preset spread, so ABSENT and FALSE are identical at the decision site and a campaign that never lights it pays no persisted byte |
| **THE WRITE** | ONE line in `factionCompetition.ensureFactionStates` (`pulseKernel.js:347`, every advance, every settlement, unconditional): `if (highWaterLit && factionStates[id]) factionStates[id] = withPowerHighWater(factionStates[id], factionPower(faction, index));` — placed immediately before the existing `if (factionStates[id]) return;` mint guard, so DARK the control flow is byte-for-byte what it was |
| **THE FOLD** | `withPowerHighWater(record, observed)` — pure, returns the NEXT record and lets the seam assign it; moves UP only; an IDENTITY NO-OP (the same object back) when the mark does not rise, so the seam's quiet-state discipline is untouched; no code path anywhere clears it |
| **THE PROJECTION** | four lines in `projectFactionStatesOntoSettlement` (`pulseKernel.js:1765`, per settlement per advance), in the same present-or-already-carried shape as the four projections beside it. Absent ⇒ nothing materialized |
| **THE READER** | `powerHighWaterOf(record)` — resolves an absent mark to **`null`**, never to `0`. Zero would assert that the syndicate was always powerless; null says the instrument has no observation. That distinction is what makes the dark-path fossil list an honest empty rather than a vacuous fence |
| **WHAT READS IT** | only `deriveUndercity`, through `syndicateStandingOf`, as `drivers.highWater` and as the recession that produces `fossils[]` |
| **HISTORY SINCE LIGHTING** | declared, not implied: a faction state minted in a pass takes no mark that pass (the fold runs only on EXISTING states), and a record written before this wave carries no key and is never backfilled. The acceptance's A3 drives THREE advances for exactly this reason |
| **THE OBSERVED-SHAPE COST** | zero rows. The roster-side read is `powerHighWaterOf(faction)`, a CALL receiver, never `faction.powerHighWater` — measured, not assumed (§4) |
| **§423 COMPLIANCE** | no operation verb, no payload grammar, no store surface. This is a payload enrichment at an existing registered seam — the T2Q pattern |
| **WHAT IT IS NOT** | not a migration (no DB table; this train mints none), not a schema change to a persisted document shape the store validates, not a default (R-5 is the owner's), not a user-visible surface |

**REVERSAL.** Delete the manifest row, the certification row, the two seam hunks and the leaf; the
key stops being written and every already-written mark becomes an inert field no reader consults.

---

## §3 · THE FLAG BILL — FIVE SURFACES, ONE COMMIT, WITH RECEIPTS

CR-WR10-C item 4 binds the manifest entry, the first real gate read and the certification row into
one commit; §441.4 adds the test-side list and the acceptance literal, and §475 adds the bundle.

| # | surface | what landed | receipt |
|---|---|---|---|
| 1 | `src/domain/worldPulse/simulationRules.js` | one row, `'undercityHighWaterEnabled'`, at its ALPHABETICAL position (`undercity` before `underways`), with the joined-by note the neighbours carry. 310 → **311** effective lines, inside the ≤15 shared-file cap | `engineGatedRuleKeys.walker` green |
| 1b | `npm run build:edge-shared` | run in the SAME commit. 7 files moved: `aiCharterBundle.js`, `aiOutputSchemaBundle.js` and ALL FIVE `.meta.json` (three by `generatedAt` alone). The bundle diff is EXACTLY this member's rows plus the `Source hash` header — added lines outside the member's hunk: **0**, counted | `git diff -U0` over both bundles |
| 2 | `src/domain/certification/subsystemRowsVirtual.js` | the AUTHORED row, `undercityHighWaterEnabled`, in the GR-5A monotone-memory row's shape: three empty channels each with its written reason, a long `other` narrative, `expectedTempo: 'per_tick'` (the GATE's cadence, not the value's), three invariants, `soakEvidence: 'unobserved'`. 723 → **753** effective, under the 800 layer ceiling. **EXEMPT from the ≤15 shared-file delta as AUTHORED DATA** in a module that grows by exactly one row per flag (§441.4 J4; vetoable — reversal in §8) | `subsystemRowsVirtual.test.js` green |
| 3 | `tests/domain/subsystemRowsVirtual.test.js` | the THREE module-scope edits the file's own header prices (`:141-151`): the const, the `VIRTUAL_RULES` member at its authoring-order position, and the `LANE_LEAVES` entry. **ZERO new test titles**, so no census figure moves for them; the lane leaf is the PURE leaf alone (`colonization.js`), never `factionCompetition.js`, which mints seven candidate literals of its own | `subsystemRowsVirtual.test.js` + `engineGatedRuleKeys.walker` green |
| 4 | `tests/domain/undercityColonization.test.js` | the flag driven LITERALLY — `undercityHighWaterEnabled: true` appears as a literal in three arms (A3, A6) and is fed to the REAL `ensureFactionStates` | `mechanismLitCoverage` green |
| **5** | `tests/domain/contributionLedgerShape.test.js` | ⚠ **A FIFTH SURFACE THE CHARTER DID NOT PRICE, AND THE FILE ITSELF PREDICTED THAT.** Its own comment reads: *"THIS FILE IS A NAMED PATH ON EVERY FLAG-MINTING PACKET … these two literals are the FOURTH obligation of the flag-mint bill, they live in a WAR-circulation suite no epoch battery would think to name, and a wave that pays the other three finds them at the terminal gate instead."* This wave paid the four the charter priced and met these two at the widened sweep, exactly as written. `ENGINE_GATED_VIRTUAL_RULE_KEYS` and `VIRTUAL_SUBSYSTEM_ROWS` both `toHaveLength(24)` → **25**, and the test TITLE is RENAMED (`at 24` → `at 25`) rather than a new one added, which is the EP-1 / WF-1a precedent and is why no census figure moves for it | `contributionLedgerShape` green |

**Budget.** Three modified production files — `simulationRules.js`, `subsystemRowsVirtual.js` and
the pulse-seam file `factionCompetition.js` — plus the leaf. Exactly the charter's cap. The fifth
surface and the two dormancy cures in §4.5 are TEST-side and cost no production file.

### §3.1 · WHY `factionCompetition.js` IS THE SEAM — a measurement, not a preference

The charter names "an existing registered pulse seam" without naming the file. Four candidates were
measured at this base with the repo's own instrument (eslint `max-lines`, `skipBlankLines` +
`skipComments`) and with a static import-closure walk from `src/main.jsx`:

| candidate | effective / ceiling | first-paint closure | verdict |
|---|---|---|---|
| `worldPulse/pulseKernel.js` (the per-settlement projection lane at `:1764`) | **1581 / 1581** — its EXACT frozen `scripts/.size-baseline.json` entry, and `tests/lint/sizeBaseline.test.js` asserts NO DRIFT under a SHRINK-ONLY law | out | **REFUSED** — one added line reds twice and the cure is forbidden |
| `worldPulse/institutionLifecycle.js` (the sibling flag's own home) | 798 / 800 | out | **REFUSED** — two lines of headroom, and its writer runs per OUTCOME, not per advance |
| `worldPulse/urbanFabricKernel.js` (the charter's named epoch substrate) | — | out | **REFUSED** — itself gated behind `urbanFabricEnabled`, so R-5 would light nothing |
| **`worldPulse/factionCompetition.js`** | **759 / 800**, no baseline row | out | **CHOSEN** — 41 lines of headroom, in NO edge bundle, and it OWNS both seams: the per-advance roster walk and the per-settlement projection. Its own header names the roster as the live power source, so the standing that recedes already lives here |

Post-edit the seam file measures **767** effective, still under its layer ceiling and still correctly
absent from the size baseline. Its transitive closure gains six files
(`undercity/colonization.js`, `undercity/strataExistence.js`, `undercity/jointVocabulary.js`,
`highWater.js`, `display/calamityLedger.js`, `spatial/calamity.js`), none of them in the first-paint
static closure and none of them `townMap/**`.

---

## §4 · CENSUS, INSTRUMENTS AND THE INTERIOR RED

### §4.1 · `censusAuthorization` (PROSE — the validator has no such key; MF-PREAMBLE law)

This member's five-figure census delta is authorized by **ODQ §311** (the doctrine), **§359.3** (the
OB-6 fold), **§431** (the train's dispatch), **§441** (the ruling, ratified §445.2) and **§484**
(this member's dispatch). The cause is ONE new test file and nothing else:
`tests/domain/undercityColonization.test.js`, ONE literal `describe`, EIGHT straight-line `test`
calls with string-literal titles, and `grep -cE '\.each|runIf|\.skip|\.todo|\.concurrent'` over the
file = **0**, so nothing is loop-registered and nothing is parked.

### §4.2 · THE WALK, AND THE DELTA LAW

**⛔ THE DELTA IS WHAT THIS PACKET CARRIES. THE TUPLE IS NOT.** The census walker is in NO car's
`changeManifest`; the row's exact text is deferred VERBATIM to the chair's landing act (§417, the
T2J/T2Q shape). The branch moves under a holding lane, and a carried tuple would silently revert a
sibling's park — the trap WEB-3 set for MF-UC1 (`parked` 365 → 366). **Re-derive the whole tuple by
EXECUTION at the landing slot and apply only this delta.**

**DELTA: `+1 files / +0 parked / +1 credited / +8 titles / +1 suiteTitles`.**

⚠⚠ **THE BRANCH MOVED UNDER THIS LANE AND THE TUPLE MOVED WITH IT — MEASURED, NOT PREDICTED.**
`claude/composite-r4` now reads **`1b1de759155631b61659d8faff7fe69836687385`** (MF-UC1's landing,
which happened while this member built). At that slot the walker's live tuple reads
`files: 2513, parked: 366, credited: 2147, titles: 20838, suiteTitles: 5805` — UC-1's own identical
delta already applied — so a tuple carried from this packet's base would silently revert it. The
landing act applies THIS DELTA to the SLOT's tuple and re-derives the whole thing by execution.
The collision was characterized at blob level: **no code-path collision at all.** Every `src/**` and
`tests/**` path this member touches is UNMOVED between this base and the slot; the only overlaps are
the two standing meta files (`INDEX.md`, `PACKET_MANIFEST.json`), governed by the standing rebase
laws. `ruinFilterRoster.walker` moved at the slot to **91** (UC-1's raise) and this member owes it
nothing — its leaf never spells `.institutions` — so 91 still holds, to be re-proved from the arm's
own message at the slot. `validate:packets` at the slot reads 166 packets, so this member makes
**167** there rather than the 166 measured here.

Walked at this base, each figure taken from the arm's OWN failure message and substituted
mechanically by the driver — never computed by the lane:

| iter | tuple in the file | exit | message read |
|---:|---|---:|---|
| 1 | 2512 / 366 / 2146 / 20830 / 5804 (the base's) | 1 | `expected 2513 to be 2512` → `files` |
| 2 | 2513 / 366 / 2146 / 20830 / 5804 | 1 | `expected 2147 to be 2146` → `credited` |
| 3 | 2513 / 366 / 2147 / 20830 / 5804 | 1 | `expected 20838 to be 20830` → `titles` |
| 4 | 2513 / 366 / 2147 / 20838 / 5804 | 1 | `expected 5805 to be 5804` → `suiteTitles` |
| 5 | **2513 / 366 / 2147 / 20838 / 5805** | **0** | — `Tests 33 passed (33)` |

⭐ **`parked` NEVER REDDED** — it passed at 366 on every iteration, which is the RECEIPT that the new
file is CREDITED rather than parked, not an inference from its shape.
⭐ The walker was then **REVERTED DIGEST-EXACT** to SHA-256
`2b58ec3cf7bd1d6dad689184f6b57cd67d7495d1f86c836f73eae710074eb90f`, and `git status` shows it
unmodified. The interior red this member leaves is exactly this one walker, by design.

### §4.3 · THE INSTRUMENT TABLE (predicted before the first edit; every row then executed)

| # | instrument | predicted | measured |
|---|---|---|---|
| I1 | `generatorGoldenMaster` fixture | UNMOVED (no generation importer) | UNMOVED, `29c6cc8f…` before and after |
| I2 | `observedShapeReaders.walker` | UNMOVED at `1995 / 1409 / 387 / 60 / 40` | **RED FIRST, THEN CURED — see §4.4.** Green at the shipped bytes |
| I3 | `sovereigntyLightingContract.walker` | INTERIOR RED by design, `+1/+0/+1/+8/+1` | exactly that |
| I4 | `negativeAssertionAnchor.walker` | UNMOVED | **RED FIRST, THEN CURED — see §4.4** |
| I5 | `domainAnyCastBaseline` | UNMOVED — no `any` token added | green |
| I6 | `typecheck:ratchet` / `typecheck:domain:strict` | both AT CEILING, exit 0 | `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` · `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` |
| I7 | `sizeBaseline` | UNMOVED — no touched file crosses its layer ceiling and none is in the baseline | green; the seam file 767 < 800, the rows module 753 < 800 |
| I8 | `entropyRootCensus.walker` | UNMOVED — `fnv1a32` REUSED from `kernel/proseHash.js`, no local hash root | green |
| I9 | `ruinFilterRoster.walker` | UNMOVED at 90 — the leaf reads `powerStructure.factions`, never `.institutions` | green at 90 |
| I10 | `mechanismLitCoverage` | UNMOVED — the flag gains LITERAL credit; the leaf is not under `worldPulse/` so it is no new mechanism module | green |
| I11 | `engineGatedRuleKeys.walker` | green only with all three of manifest + gate read + authored row | green |
| I12 | `clampPrimitiveBaseline` | UNMOVED — the kernel `clamp` is imported, never a local one | green |
| I13 | `tests/edgeFunctions` | freshness + reproducibility green ONLY with the regen in the commit | green (§6) |
| I14 | `validate:packets` | 165 → 166, green at DRAFT and at READY | as predicted |

### §4.4 · TWO WALKER REDS THE FIRST BATTERY FOUND, BOTH CURED IN-MEMBER (neither a STOP)

1. **`negativeAssertionAnchor.walker`** — one un-anchored negative. ROOT CAUSE: the walker accepts
   `// anchored:` only on the line IMMEDIATELY preceding (`:112`), and the marker sat on the FIRST
   line of a two-line comment. Cured by moving the marker to the LAST line. This is the identical
   bite MF-UC1 recorded; it is re-recorded here because it is a property of the walker, not of a
   lane.
2. **`observedShapeReaders.walker`** — `violations: 2`, and the frozen literals moved
   `1995 / 1409 / 387` → `2001 / 1414 / 388`. The governed `--write` re-freeze is UNAVAILABLE (S0
   part 1's schema-10 red), so a cure had to be a code change, and it was. Diagnosed by an in-tree
   probe reproducing the walker's own scan:
   - `src/domain/undercity/colonization.js` minted FOUR ceiling-0 rows — `influence`, `score`,
     `weight` and `label` on `factions`. The syndicate reader had MIRRORED
     `factionCompetition.factionPower`'s key chain, and the observed generation corpus never carries
     any of those four on a faction: four arms dead on every world. **Cured by reading only keys the
     producer writes** (`row.power`; `row.faction ?? row.name`), which is also the better code. The
     competition layer's own chain is frozen debt it already carries; a new reader does not inherit it.
   - `src/domain/worldPulse/factionCompetition.js` minted ONE ceiling-0 row —
     `powerHighWater on factions` — because the projection read it as a bare member chain.
     **Cured by the landed CALL-receiver idiom** `powerHighWaterOf(faction)`: the detector grounds a
     finding by its receiver ROOT and a CallExpression grounds to nothing
     (`pactAmendment.js:150-153` states the law verbatim).
   Re-probed at the shipped bytes: `violations: 0`, `stale: 0`, and the leaf contributes NO findings
   at all, so `1995 / 1409 / 387` stands unmoved — confirmed by the walker running GREEN.

### §4.5 · THREE MORE MEMBER-CAUSED REDS THE WIDENED SWEEP FOUND, ALL CURED IN-MEMBER

None is a STOP; each is a guard this member is the first car to reach.

3. **`tests/lint/pulseKernelLineAddress.walker.test.js` RULE 1** — the leaf's header cited the seam
   as a hand-keyed kernel line address. The walker's inventory is FROZEN AT ZERO and takes no
   allowlist, and its reason is right: *"a line number is text ABOUT source that no test compares TO
   source"*. Cured by citing the seam by NAME (`ensureFactionStates`) with no basename and no
   number, so neither RULE 1 nor RULE 2's content-anchor obligation applies. Verified: `grep -rn
   'pulseKernel\.js:[0-9]' src tests` returns nothing outside the walker itself.
4. **`tests/domain/contributionLedgerShape.test.js`** — the fifth flag-bill surface, §3 row 5.
5. **`tests/domain/undercityStrataExistence.test.js` A6** — UC-0's dormancy arm asserted that
   NOTHING outside `src/domain/undercity/` reaches the leaves. This member is the first car with a
   pulse seam, so that claim had to move — and the charter is the authority for moving it: §4's
   first-paint law reads *"Every UC deriver is reached from dormant or lazy consumers (CT-4 prose,
   D5 fabric, THE PULSE SEAM)"*. Cured by an EXACT admission map with a written reason per member
   (the `EXEMPT_RULE_KEYS` discipline), so a NEW importer still reds and the admission cannot grow
   silently.
   ⭐⭐ **AND THE CURE EXPOSED THAT THE ARM WAS BLIND IN THE DIRECTION THAT MATTERS.** The scan was
   `src.includes('domain/undercity/')` — a MENTION scan. `factionCompetition.js` imports the leaf as
   `'../undercity/colonization.js'`, which contains no such substring, so **the first real
   production importer of an undercity leaf was invisible to the arm that exists to find one**,
   while the certification row that merely NAMES the path in a `module:` data string enrolled. The
   scan is now the UNION of the mention and the RESOLVED RELATIVE IMPORT EDGE. Non-vacuity proved by
   execution: the old scan's importer list is missing exactly
   `src/domain/worldPulse/factionCompetition.js`, and the widened one contains it. Both admissions
   say which kind they are — a data mention or a real edge.

   ⛔ **THE CENSUS DELTA WAS RE-WALKED AFTER ALL FIVE CURES AND IS UNCHANGED** at
   `+1 / +0 / +1 / +8 / +1` — measured by a second full walk from the arm's own failure messages,
   not inferred from "a rename moves nothing". Both touched test files still carry one `describe`
   and eight `it`/`test` calls.

---

## §5 · ACCEPTANCE — EIGHT ARMS, the charter's own closed list

`tests/domain/undercityColonization.test.js`, one literal `describe`, eight straight-line `test`
calls. Every arm pins INTENT over a shared namespace — a positive control plus an exclusion, never
a `toEqual` over a list a later car of this train must grow (§474). Result: **8/8, TRUE_EXIT 0.**

| id | the case |
|---|---|
| A1 | THE TWO-LEVEL READING. UC-0's SHEET stands on BOTH fixtures, so the undercity's absence is an absence of the second level and not of a settlement with nothing under it; then a present-then-absent transition over the component kinds proves the criminal drivers are what grew it. |
| A2 | MONOTONE IN SYNDICATE POWER, AND ONE TRUTH FOR THE SHARE. The standing is swept 0..100 through the real deriver and the share never falls; the colonized count really MOVES across the sweep (asserted, so "monotone" is measured on a curve and not on a flat line). Then `drivers.criminalShare` is pinned EQUAL to `readCorruptionClimate(...).crime` on five profiles — both precedence branches, both fallbacks, and the unset default. |
| A3 | RECESSION LEAVES FOSSILS ON THE LIT PATH; THE DARK PATH SAYS SO HONESTLY. THREE advances through the REAL `ensureFactionStates` — mint, peak, fall — each one's own output world fed into the next, because the fold records history SINCE LIGHTING and a two-advance drive would record only the fall. The mark projects onto the settlement, the deriver reads it, the fossils carry the recession cause. The IDENTICAL fixture with no flag yields `drivers.highWater === null` and an EMPTY fossil list. |
| A4 | INERTIA — new digging never re-rolls an earlier epoch's monotone components. UC-2 is not built, so the arm pins against its CONTRACT SHAPE as a frozen input (charter §7 F3): the rows are byte-identical across a colonization that demonstrably GREW (both fixtures asserted PRESENT, so it is growth and not arrival), and the two cars are DISJOINT BY TEMPERAMENT — every row this car produces is DEMAND_DRIVEN, so no monotone row can ever be its output. The LIVE composition is deferral D-UC4-2. |
| A5 | FLOOD AND SEAL SEVER WITHOUT DELETING. Waterside ground floods the deepest working and dry ground does not (a present-then-absent transition over the STATES, so 'flooded' measures the water table); the drowned row keeps its licence, its front and its anchor and loses only its joins, while the open rows still carry theirs. A DATED calamity — reached through `buildCalamityLedger`, never the raw key — seals a working on the dry fixture with the row count unchanged. |
| A6 | DARK-FLAG BYTE IDENTITY. Flag ABSENT and flag FALSE produce byte-identical `factionStates`, and the projection materializes nothing onto a roster entry that never carried the field. ANTI-VACUITY: the identical harness LIT does write the key. Then the fold's own laws — a lower observation never lowers the mark, a higher one raises it, and an unmarked record answers `null`, never `0`. |
| A7 | THE UNIVERSAL FRONT. On a real generated metropolis at least one piece is fronted by a REAL institution (asserted FIRST, so the law's honest half cannot stand in for its whole), every INSTITUTION front's key is one the settlement's own strata seeds carry, every ANONYMOUS_FABRIC front names nothing, every row declares DEMAND_DRIVEN, and every join kind is in the closed vocabulary. The anonymous branch is driven on a supplied anchorless seed because the generated corpus produces only anchored ones — measured (0 of 420), not assumed. |
| A8 | G-43 — REMOVE THE WALL AND THE SMUGGLERS' TUNNEL LOSES ITS LICENCE. One stored fact removed, one row gone as a present-then-absent transition, and the colonization itself UNMOVED (a licence loss, not a collapsed derivation). The other half of the conjunction is driven too: a walled town below the criminal-share floor digs no bypass either. |

### §5.1 · MUTANT DRIVES — 8 planted, 8 convicted, clean controls GREEN at both ends

Every mutant is a single exact substitution in a production file; every restore was re-proved
DIGEST-EXACT by SHA-256, and both production files were re-proved pristine after the run.

| # | mutant | arm convicted |
|---|---|---|
| m1 | the presence FLOOR removed — a seeded sheet always grows an undercity | **A1** |
| m2 | the syndicate driver INVERTED (`0.40` → `-0.40`) | **A2** (+ A4, A5, A7, A8) |
| m3 | the fold made NON-MONOTONE (`>=` → `===`) — the mark tracks the level | **A3** (+ A6) |
| m4 | the colonization frozen at ONE working — pressure no longer digs | **A4** (+ A2, A5, A7) |
| m5 | a flooded working DELETED instead of severed | **A5** |
| m6 | the GATE removed from the seam — a dark world gains the key | **A6** (+ A3) |
| m7 | the UNIVERSAL FRONT collapsed — every piece reads as anonymous fabric | **A7** (+ A5) |
| m8 | the WALL licence removed — the bypass is dug with nothing to bypass | **A8** |

⭐⭐ **THE FIRST DRIVE FOUND THREE REAL ARM WEAKNESSES AND THEY WERE CURED, NOT PAPERED.** m3
convicted only A6, m4 convicted A2/A5/A7 but not A4, and m7 convicted only A5 — three arms that were
passing for the wrong reason. A3 advanced twice at the SAME syndicate power, so a level-tracking
fold was indistinguishable from a memory; A4's quiet fixture was not PRESENT at all, so its growth
claim read as an arrival; A7's two-branch loop was satisfied by a world where every front had
collapsed to anonymous fabric. All three arms were rewritten (§5's A3, A4, A7 descriptions are the
rewritten ones) and the drive re-run.

⚠ **AND THE SECOND DRIVE CAUGHT THE LANE'S OWN FIX.** The intermediate two-advance A3 rewrite was
RED at the PRISTINE tree, so `M0_CONTROL` exited 1 and every mutant appeared to convict A3 — an
all-red sweep whose convictions were the broken control, not measurements. That is the mutation-
sweep vacuity class, and the clean control is what caught it. The third drive is the receipt above.

---

## §6 · THE GATES, EXECUTED

| battery | result |
|---|---|
| the acceptance, mutexed | `Test Files 1 passed (1)`, `Tests 8 passed (8)`, TRUE_EXIT 0 |
| `subsystemRowsVirtual` + `engineGatedRuleKeys.walker`, mutexed | `Test Files 2 passed (2)`, `Tests 21 passed (21)`, TRUE_EXIT 0 |
| acceptance + `negativeAssertionAnchor` + `ruinFilterRoster` + `observedShapeReaders` + `mechanismLitCoverage` + `engineGatedRuleKeys` + `subsystemRowsVirtual`, mutexed | `Test Files 7 passed (7)`, `Tests 89 passed (89)`, TRUE_EXIT 0 |
| `npm run typecheck:ratchet` | TRUE_EXIT 0 · `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` |
| `npm run typecheck:domain:strict` | TRUE_EXIT 0 · `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` |
| `eslint` on every touched JS path | TRUE_EXIT 0, empty report; `--fix --dry-run` changes nothing |
| generator golden | `29c6cc8f…` before the first edit and after the last |

The widened sweep and its classification are §11.

---

## §7 · THE SEED SWEEP — the tuning provenance (executed, 420 real settlements at THIS base)

Corpus: 6 tiers × 2 cultures × 7 terrains × 5 seeds = **420**, generated by
`generateSettlementPipeline(cfg, null, { seed, customContent: {} })` at this base, each terrain
paired with its honest route (the golden corpus's `TERRAIN_ROUTE`). What the estate actually gives:

- settlements with at least one strata seed: **350**; with at least one CRIMINAL faction: **129**;
  walled (`defenseProfileHasWalls`): **234**.
- every finite faction power on the corpus is in the **0..100** spelling (2,533 entries; none in
  0..1), which is why the reader normalizes `>1 ⇒ /100` and why the acceptance drives both spellings.
- `criminalShare` min 0.275 / max 0.625 / mean 0.392 · `economy` 0.200 / 0.800 / 0.420 ·
  **syndicate standing 0.000 / 0.090 / 0.019**.

⚠ **THE SYNDICATE DRIVER SITS LOW ON A FRESHLY GENERATED WORLD AND THAT IS THE POINT, NOT A DEFECT.**
Criminal faction power at generation maxes at 9 of 100. Faction power is what the PULSE grows, so
the epoch layer's own driver is small at year zero and rises with play — which is precisely why the
recession this car measures needs a persisted peak rather than a snapshot. The LIVENESS figures
below are measured by moving each driver between its own extremes, so they measure the WEIGHT, not
the corpus's starting position.

| candidate | criminal / syndicate / economy | present | rate | LIVENESS crime/synd/econ (of 420) | no-drivers ⇒ no undercity | monotone in standing |
|---|---|---:|---:|---|---|---|
| A | .45 / .35 / .20 | 152 | 36.2% | 280 / 228 / 266 | true | true |
| **B (CHOSEN)** | **.40 / .40 / .20** | **150** | **35.7%** | **280 / 263 / 280** | **true** | **true** |
| C | .50 / .30 / .20 | 167 | 39.8% | 280 / 228 / 266 | true | true |
| D | .34 / .33 / .33 | 141 | 33.6% | 280 / 252 / 280 | true | true |

**B chosen because it strictly dominates every other candidate on LIVENESS** — it is the only set
where all three drivers move the colonized count on the largest slice of the corpus, so no weight is
decorative — while holding both ruled invariants. A is dominated by B on two of three drivers; C
trades syndicate and economy liveness for a higher present rate the doctrine does not ask for; D
spreads the weights evenly and loses syndicate liveness. The three weights sum to exactly 1.

**The shipped leaf, driven end to end over the same 420** (it reproduces B's row exactly):
present **150** · deterministic **420/420** · `criminalShare` equal to corruption.js's read
**420/420** · colonized rows **230** · smugglers' tunnels **150** · severed (flooded) rows **28** ·
fossil rows **0** and worlds carrying a recorded mark **0** (the dark path, as designed).
By tier: thorp/hamlet/village 0 present; town 50 present / 50 workings; city 50 / 80; metropolis
50 / 100 — the undercity proper needs a town at least, which is the doctrine's own "excavation
needs labor".

⚠ **TWO SHAPES THE CORPUS NEVER PRODUCES, STATED RATHER THAN LEFT TO LOOK CLEAN.**
(i) **ANONYMOUS_FABRIC fronts: 0 of 230** — every generated seed carries an anchor, and the
anchorless seed is UC-1's derived-rung shape, which this base does not have. A7 drives that branch
on a supplied seed instead. (ii) **present ∩ unwalled: 0 of 150** — every settlement that grows an
undercity on this corpus also happens to be walled, so the smugglers' tunnel row appears on all 150
and the wall's discriminating power is pinned by A8's FIXTURE directional rather than by corpus
variation. Both are recorded so a later reader does not mistake a clean count for a proven branch.

**PROVISIONAL until the §362.4 tuning signature, and EXPOSABLE-PROVISIONAL in the interim** (§7 term
5, §8 R-3). `UNDERCITY_TUNING` is a registered TUNING-PASS INPUT. The owner may veto to "dark until
signed" by a word.

---

## §8 · JUDGMENTS (vetoable by a word)

| # | call | the crux |
|---|---|---|
| J-TEUC4-1 | **The seam is `factionCompetition.js`, not `pulseKernel.js`.** | The charter's own "payload enrichment at an existing seam" points at pulseKernel's per-settlement projection lane, and that file measures EXACTLY its frozen 1581-line ceiling under a shrink-only law — one added line reds `sizeBaseline` and eslint `max-lines`, and raising the number is forbidden. `factionCompetition.js` owns both the per-advance roster walk and the projection, has 41 lines of headroom, and its own header names the roster as the live power source. Reversal: move both hunks to any seam with headroom that carries `worldState` and walks the roster. |
| J-TEUC4-2 | **The persisted field lives on the FACTION record, not the settlement.** | The quantity is a faction's peak. A settlement-level scalar would have to pick a winner among syndicates at WRITE time; picking the maximum at READ time keeps the rule visible and reversible. It is also the GR-5A shape (`worstObservedEver` inside a treaty record). Reversal: hang one scalar off the settlement and drop the projection. |
| J-TEUC4-3 | **The absent mark reads `null`, never `0`.** | Zero asserts that the syndicate was always powerless — a claim the instrument never made. Null is what makes the dark-path fossil list an honest empty rather than a fence over a fabricated recession. Reversal: default to 0 in `powerHighWaterOf` and delete A6's null arm. |
| J-TEUC4-4 | **The key-fallback chain is NOT mirrored from `factionCompetition.factionPower`.** | `influence`, `score`, `weight` and `label` are keys no generation writer produces on a faction; the reader-with-no-writer walker reports each as a ceiling-0 row. Mirroring them would ship four dead arms. The VALUE normalization (`>1 ⇒ /100`) IS mirrored and is pinned on both spellings. Reversal: restore the chain and bank four ceiling-0 rows. |
| J-TEUC4-5 | **The index fallback `0.72 - index * 0.16` is refused.** | It is a contest-weight PRIOR for ranking, not a standing. A faction with no power number has no measured strength and contributes nothing to a dug extent. Reversal: mirror it and re-sweep the weights. |
| J-TEUC4-6 | **The TOLL half of §311.8.2(d) is a typed inert slot, not a name-list read.** | No facet resolves a toll and no engine accessor exists; a name-list match is refused by name everywhere in this train. The licence is a disjunction whose other half has a live home, so the row is derivable and the G-43 arm stays clean. §441.2's founding-kind precedent exactly. Reversal: R-7-class work minting a toll facet. |
| J-TEUC4-7 | **Flood and seal each land on ONE working, addressed by index, not on a band.** | A band would sever a whole colonization at once; the doctrine's consequence is that the DEEPEST cut meets the water table and a DATED collapse seals the newest one still in use. Reversal: replace the two indices with a fraction. |
| J-TEUC4-8 | **The certification row takes the ≤15 shared-file exemption as AUTHORED DATA** (§441.4 J4, restated here because this member is the one that spends it). | `subsystemRowsVirtual.js` is a rows module that grows by exactly one row per flag; the row is prose data, not logic. Reversal: the row lands as its own rows file admitted by the module, and the cap applies to the admitting edit. |
| J-TEUC4-9 | **`expectedTempo: 'per_tick'`.** | The GATE is reached every advance on every settlement; the VALUE moves rarely and only upward. The GR-5A row makes the same call in the same words. Reversal: `rare`, at the cost of a soak floor that measures the value rather than the gate. |
| J-TEUC4-10 | **UC-0's dormancy arm is WIDENED to resolve relative import edges, not merely narrowed to admit this seam.** | Admitting the seam alone would have left the arm green for the wrong reason: measured, its mention scan could not see `'../undercity/colonization.js'` at all, so the first real importer of an undercity leaf was invisible to the guard written to find one. A guard that reads green while blind is worse than a red. The widening is nine lines inside the existing arm, adds no test title, and is proved non-vacuous by exhibiting the file the old scan missed. Reversal: restore the `includes`-only scan and delete the admission map — and inherit the blindness. |
| J-TEUC4-11 | **`tests/domain/contributionLedgerShape.test.js` and `tests/domain/undercityStrataExistence.test.js` are edited by THIS member although both belong to LANDED packets.** | Both are guards this member is the first car to reach, both cures are the ones those files' own comments prescribe, and neither path is reserved by any non-terminal packet (measured: the manifest carries 164 LANDED + 1 SUPERSEDED and no other status). Both ride as `TEST` rows in this member's `changeManifest`. Reversal: revert either file and the corresponding red returns. |

---

## §9 · DEFERRED ROWS (deliberately deferred — documented, not bugs to re-find)

| # | row | wakes when |
|---|---|---|
| D-UC4-1 | **The TOLL accessor** (UC-0's D-UC0-2, re-deferred here with the measurement in §1 row 6). No facet resolves a toll today; the wall alone carries the licence | a facet or accessor mints a typed toll fact |
| D-UC4-2 | **The LIVE composition with UC-2's monotone components.** A4 pins against the §7 F3 CONTRACT SHAPE because UC-2 is not built at this base | UC-2 lands; UC-5 is the natural place to assert the joined graph |
| D-UC4-3 | **R-5 — lighting `undercityHighWaterEnabled` in `DEFAULT_SIMULATION_RULES`.** Same-seed pulse motion; the owner's call, with the soak and the declared-shift bill (§72.3/§110.3). Until then `fossils[]` and `drivers.highWater` are structurally dark on every live world | the owner's word, chair recommendation: the tuning pass with the map leg (§341) |
| D-UC4-4 | **`UNDERCITY_TUNING` is a registered TUNING-PASS INPUT** (§8 R-3), PROVISIONAL until the §362.4 signature | the tuning pass |
| D-UC4-5 | **The syndicate driver is small on a freshly generated world** (max 0.090 of 1.0) because faction power is pulse-grown. Not a defect and not tuned around; recorded so a later reader does not mistake a low present-rate contribution for a dead weight | a soak measures the driver over played time |
| D-UC4-6 | **Two branches the generated corpus never produces** — ANONYMOUS_FABRIC fronts (0 of 230) and an unwalled present settlement (0 of 150). Both are driven by fixture in A7 and A8 | UC-1's derived-rung seam lands (the first), or a corpus with unwalled towns rich enough to colonize (the second) |
| D-UC4-7 | **The schema-10 observed-shape red** (S0 part 1) is inherited mint-class debt; the governed `--write` re-freeze is unavailable to an ordinary member. This member needed no re-freeze because it mints no row | the trailing OSR mint (§384.2) |

---

## §10 · WHAT THIS MEMBER DELIBERATELY DOES NOT DO

No catalog row and no new institution (OB-6 stays declined). No generation-path write of any kind —
the generator golden is bytewise unmoved. No migration; this train mints none. No store operation
verb and no payload grammar (§423). No user-visible surface. No geometry — the −1 leaf, galleries,
drawn joints and the registration ghost are the map program's D5 wave. No default lighting (R-5). No
edit to either census walker beyond the walk-and-revert above. No dependency bump. No second
derivation of any fact another car owns.

---

## §11 · THE WIDENED SWEEP AND ITS CLASSIFICATION — 7/7 BANKED, 1 DEFERRED, 0 STRAYS

Nine trees, mutexed, run ONCE at the holding tip: `tests/lint tests/build tests/docs tests/ops
tests/domain tests/property tests/edgeFunctions tests/scripts tests/data`. The box was verified
quiet before launch (no foreign vitest, gate-tail or check process by `ps`; the lock directory
absent) and the lock was acquired after 0 polls.

**`Test Files 6 failed | 1304 passed | 7 skipped (1317)` · `Tests 8 failed | 18459 passed | 114
skipped (18581)` · TRUE_EXIT 1 · 4m50s · head unchanged and porcelain 0 before AND after, so the
tree did not move under the run. No stray, no re-run owed.**

⭐ THE THREE CURES ARE ATTRIBUTED BY ARITHMETIC AGAINST THE SAME CORPUS, not by inspection. The
FIRST sweep, at the pre-cure tip, read `9 failed | 1301 passed (1317)` and `11 failed | 18459…`
— precisely `18456 passed`; the second reads `6 failed | 1304 passed (1317)` and `8 failed | 18459
passed`. Identical totals, three files and three tests moved from failed to passed.

**BASELINE LOOKUP EXECUTED** at the chair baseproof `chair-baseproof-b10ed1a1` (HEAD re-read
`b10ed1a1f5a0…`; its porcelain **0 before AND after**; its own short TMPDIR; **`package-lock.json`
`cmp` exit 0 against this tree**, so the two runs share an install), over the five failing files
only: `Test Files 5 failed (5)`, `Tests 7 failed | 99 passed (106)`.

**§469 SATISFIED PROPERLY — not title identity, the ASSERTION BLOCKS were machine-compared** (ANSI
stripped, timings and tree roots normalized, per-block SHA-256). **7 of 7 byte-identical, 0
differing, 0 unmatched at the baseproof.**

| # | red at the tip | block sha | verdict |
|---|---|---|---|
| 1 | `enforcement-claims` :: every completeness claim carries an @enforced-by tag | `5d6c29c5ef495ee2` | BANKED |
| 2 | `clampPrimitiveBaseline` :: baseline exactly matches … | `4907e1ee9a498dd6` | BANKED |
| 3–5 | `warCostKindPools.walker` ×3 (`war_trajectory_winning`, `war_trajectory_losing`, `trajectory_misread`) | `a8b37345…` `29d8c753…` `d580f9f4…` | BANKED |
| 6 | `warRulingKindPools.walker` :: `'succession_demand_inherited'` … | `bbd6a1396003e0e1` | BANKED |
| 7 | `metronomeCooldownLint` :: the non-cooldown emitter set may only SHRINK | `60d0af8a9f33448a` | BANKED |
| 8 | `sovereigntyLightingContract.walker` :: THE CENSUS IS AN ASSERTION, NOT A SENTENCE | tip-only | **MINE — THE ONE NAMED INTERIOR RED, DEFERRED BY §417.** Its own message is this member's delta: *"the estate's file count moved — re-measure, do not re-word: expected 2513 to be 2512"* |

A grep of all eight FAIL lines for `MF-UC4 \| undercityColonization \| colonization \|
factionCompetition \| contributionLedgerShape \| undercityStrataExistence \| pulseKernelLineAddress`
returns **0**. **Classification: 7/7 banked, 1 deferred by design, 0 strays, no STOP.**

---

## §12 · THE LANDING SLOT (TE-UC4-LANDING, 2026-08-23 — slot `1b1de759`, MF-UC1's landing, the 44th)

Landed by lane **TE-UC4-LANDING**, **`[OPUS-RUN · FABLE-VALIDATION OWED]`** (ODQ §484), on the
chair's **C-2 ratification (ODQ §487.2)**. The lane moved no ref; the chair executes the CAS.

- **Carry-proof at blob level FIRST** (braced `${sha}:path`, with non-vacuity controls; ⚠ a bare
  `git rev-parse sha:path` ECHOES ITS ARGUMENT on failure, so an abbreviated slice prints the
  COMMIT sha as if it were a blob — `--verify --quiet` is what makes the reading real). Of the
  **18** member paths, **three are created by this member** (the packet, `src/domain/undercity/
  colonization.js`, `tests/domain/undercityColonization.test.js`), **two moved** at the slot —
  `docs/implementation/INDEX.md` (`eb0bc0776b` → `509d51b48d`) and
  `docs/implementation/PACKET_MANIFEST.json` (`11a37fe4c5` → `5c0c41a555`) — and the other
  **thirteen are the SAME blob at base and slot**, so no code path collided. Controls:
  `package.json` `2b5ec2014c` and `package-lock.json` `1a8a80b12b` identical at base, slot and
  holding (no mint trigger crossed), and a nonexistent packet path resolved ABSENT at all three.
  `tests/lint/sovereigntyLightingContract.walker.test.js` moved at the slot (`ce7f4b94f6` →
  `53f2aae16f`) and is base-identical in the holding (the §417 revert), so the member never
  touched it in the rebase.
- **§475, and this member DOES owe the regen.** `src/domain/worldPulse/simulationRules.js` is an
  input of the `aiCharter` and `aiOutputSchema` rosters (control `cohesionWeave.js` hits 3 of the
  five). All **133 tracked bundle inputs are UNMOVED base → slot**, so the Source-hash header was
  predicted stable and then PROVED: `npm run build:edge-shared` re-run at the rebased tree exits 0,
  both bundle `.js` artifacts come back **byte-identical**, and the five `.meta.json` differ in
  **ten content lines, all ten of them `generatedAt` wall-clock stamps** — every `sourceHash`
  unchanged (`a8ae453f07314002`, `5ccae1a97b7a9c45`, `313a31ab0e5a9aec`, `9416e4995620b37a`,
  `9860939aa2829e62`). No drift, so no STOP; the five metas were restored to the committed bytes
  rather than re-stamped with a fresh clock (J-UC4L-2).
- **The rebase stopped exactly once**, at 4/7 (`0b3247b7`, the packet/manifest/index commit), on
  exactly the two expected paths, one conflict hunk each. Commits 1–3 and 5–7 applied clean —
  including the leaf, the seam, the flag bill and the four other test files, as their unmoved
  blobs predicted.
- **Surgery, keep-both, by text only.** INDEX: this row placed FIRST at the "Current packet set"
  head, above MF-UC1 — the table is newest-first, so **no slot row moved**; `diff SLOT resolved`
  is **+1 / −0** and that one line `cmp`s 0 (3,767 B) against the member's own authored line.
  MANIFEST: the slot's bytes kept verbatim, the predecessor row's closing brace gaining the one
  comma JSON requires, and this member's block appended unchanged — deep-compare **166 → 167,
  ADDED=["MF-UC4"], REMOVED=[], DRIFTED=[]**, non-packet keys identical, and the appended block
  byte-identical to the holding's (sha256 `52e2cfc5fc7b58c2…`, 248 lines, 21,276 B). Of the 18
  paths, **sixteen are blob-identical to the holding** at the rebased tip; the two that differ are
  exactly the two that moved.
- **The status walk — THREE places, not one** (§486.2, the lesson UC-1's validator taught):
  the manifest row (`status` READY → LANDED, `verifiedBase` → the slot sha, `requiredSymbols`
  **16 → 21**), this packet's own Markdown header, and the **INDEX STATUS column**, which the
  validator reaches through the manifest's `indexPath` rather than a literal path in its source.
  The five added rows are the gate predicate `undercityHighWaterActive`, the call-receiver read
  `powerHighWaterOf`, the monotone fold `withPowerHighWater`, UC-0's widened admission map
  (`ALLOWED_PRODUCTION_IMPORTERS`) and the fifth flag surface's MARKER in
  `tests/domain/contributionLedgerShape.test.js`. ⛔ Every one is a symbol or a marker and **not a
  count**: the two `toHaveLength` figures, the roster count and the census tuple all move when a
  sibling lands, and a re-recorded FIGURE in `requiredSymbols` is refused by the estate's own law
  (ODQ TE-26). `deriveUndercity`, the certification row, the corruption read and
  `ensureFactionStates` were already pinned at READY and were not duplicated.
- **The census row, written ONCE here and re-derived by execution (§420/§457/§469/§480.2):** the
  slot read `2513/366/2147/20838/5805`; the DELTA `+1/+0/+1/+8/+1` that crossed re-derives to
  **`2514/366/2148/20846/5806`**, each moved figure read from the arm's own failure message in
  assertion order and never computed (`expected 2514 to be 2513` → `expected 2148 to be 2147` →
  `expected 20846 to be 20838` → `expected 5806 to be 5805`), the whole arm green at the end
  (33/33). ⭐ `parked` PASSED unmoved at **366** on every iteration. The walked figures equal the
  carried delta exactly, so nothing was swallowed by a parked file. Two negative controls (the
  slot tuple back; `suiteTitles` alone back) both red as predicted and the file restored `cmp` 0
  each time. ⭐ The slot's tuple happened to be NUMERICALLY EQUAL to this member's own build
  after-figure, because MF-UC1's delta had the same shape — the exact coincidence that makes a
  carried tuple look right while discarding a sibling's move.
- **The other three test files this member edits move NO census figure, counted at both ends:**
  `contributionLedgerShape` 1 describe / 8 tests at the slot and at the tip (its title is RENAMED,
  the EP-1 / WF-1a precedent), `undercityStrataExistence` 1 / 8, `subsystemRowsVirtual` 3 / 14.
- **The roster count re-read at the slot:** `ruinFilterRoster.walker` passes at **91** (12/12) and
  its control at 90 convicts `expected 91 to be 90` — so UC-1's raise still holds and this member
  owes it nothing, its leaf spelling `.institutions` **zero** times against a control file that
  spells it twice.
- **`validate:packets` → `[implementation-packets] valid: 167 packets (0 READY)`, exit 0.**
- **S0, the gates and the terminal:** the two-part S0 reading, the mutexed re-proofs, the widened
  sweep classification and the full bare `npm run check:tail` verdict lines are recorded in the
  lane receipt (`laneTEUC4-receipt.md`, "THE LANDING SLOT").
- **§489: sixth flag-bill surface paid at the landing act** — `tests/soak-harness/coveringArrayCoverage.test.js` literals 24→25 / 81→82 / 56→57 (the covering-array flag domain); lockstep closure governed 25 / ungoverned 32 / overlap [] unchanged; the file is outside the packet's `changeManifest` by the §479.2 in-train precedent. Found by the terminal gate's `test:ratchet`, green at the slot and red at the tip with the file's blob identical at both, so the cause is this member's mint and nothing else. The chair ratified the cure at ODQ §489; the census was RE-WALKED afterwards and held at `2514/366/2148/20846/5806` (33/33) rather than being predicted to. ⭐ The arm's two LIVE summary prose figures were moved with the literals, and its EP-1 / WF-1a ancestry rows were not — the lockstep shape `git blame` shows WF-1a itself using (J-UC4L-8).
- **Landing judgments (vetoable):** J-UC4L-1 one landing-act commit rather than three;
  J-UC4L-2 the five bundle metas restored to their committed `generatedAt` stamps rather than
  re-stamped, since the regen proved every `sourceHash` and both `.js` artifacts identical;
  J-UC4L-3 the census walker is NOT pinned in `requiredSymbols`, because §4.2 defers that row's
  text verbatim to the landing act and a pin would turn it into an obligation the packet
  disclaims; J-UC4L-4 the INDEX status cell flipped READY → LANDED, which the validator
  cross-checks and is therefore required rather than cosmetic.

---
