# ARCH-PROTOCOLS — the cross-cutting protocols every §932+ lane brief obeys

Written 2026-09-15 by the cross-cutting architect (the Fable seat), read-only, at the consist `laneCONSIST-932` = `a5876c0ea` (the build slot after §931's CAS) + LT37's eight cars (tip `315080928`, 75 cars over `f73bdbf16`, porcelain 0), against the ledger `a803dee7a` plus the §931 entry read at the ledger HEAD `3b506360f`. Every figure is **CONFIRMED** (I opened the file at the cited line, ran a read-only measurement, or a recon skeptic confirmed it) or **PLAUSIBLE** (reasoning only). Nothing here was executed against vitest, npm or git state; the two measurement scripts I ran (`eff-lines.mjs`, `near-ceiling.mjs`, beside this file) call eslint's Linter through the consist's `node_modules` and write nothing.

The owner's words that shape everything below, verbatim: **"from this moment forward everything that we built is built lit on"** (16:5x EDT) and **"We revert back to built dark after the terminal soak"** (17:0x). So: from this landing until the terminal soak (#24), every car lands LIT in the lit presets in the same car that builds it; every landing is a DECLARED SHIFT; after the soak the dark-landing discipline returns. `FLAGS.scribe` is the owner's exception (key · 201–203 · the price).

Paths used throughout: `$S` = the consist `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneCONSIST-932`; `$SC` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit`; `$MY` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad`; `$P` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f86a239c-ba8e-464d-a904-e4b70a0c4b2e/scratchpad` (the §930 chair's `c930/` scripts, still the canonical `compose.sh` / `run-registers-930.sh` / `run-gate-930.sh`).

---

## 1. THE LIT-LANDING PROTOCOL

### 1.1 Two flag systems, and which one a simulation wave uses (CONFIRMED)

| System | Where | What "lit" means | Reach | Golden consequence |
|---|---|---|---|---|
| **Virtual simulation-rule keys** (`<x>Enabled`) | `src/domain/worldPulse/simulationRules.js` — the register `ENGINE_GATED_VIRTUAL_RULE_KEYS` (:230, 35 members at HEAD), the preset catalog `SIMULATION_RULE_PRESETS` (:736), the derived `ENGINE_GATED_DORMANT_RULE_KEYS` (:1141, `deriveDormantRuleKeys` :1095) | the key is declared `true` in a preset's override spread; it stays ABSENT from `DEFAULT_SIMULATION_RULES` (:61) so it is VIRTUAL: zero persisted bytes on an installed world, not a `RULE_COMPARISON_KEY`, invisible to `presetIdForRules` (:1300) | the engine — every gate reads `rules.<key> === true` by name (the strict idiom the walker measures) | a same-seed shift for worlds BORN into the lit presets; the preset-lighting witness moves (§1.4) |
| **Product flags** (`FLAG_DEFAULTS`) | `src/lib/flagRegistry.js:33-131` | `name: true` in the frozen map (URL > localStorage > env > default resolution) | render-time only: **no module under `src/domain/` or `src/generators/` imports `lib/flags.js` or `lib/flagRegistry.js`** (the `handbookVoice` note at :98-105, measured zero) | none on generation or the pulse: a display-only shift, proven at the L-UI lighting by the 525-row corpus aggregate `92ef697d…` unmoved |

Every #32/#33 wave's flag is a **virtual simulation-rule key**. `simulationRules.js:644-654` (`WAVES`, the nine) and `:664-674` (`ONE_REGEN`, the nine) are the two frozen cohorts the lit presets spread today; `neutralNeighborsEnabled` (:677-735) is the recorded counter-example — a virtual key DELIBERATELY lit in no preset because lighting it reds `tests/perf/tickScanBudget.test.js` (an asymptotic blocker, owner-gated). That block is the template for the one lawful refusal: a lane that measures a red like it records the refusal in the key's comment and reports it; it does not light half the presets.

### 1.2 The lit act, exactly (CONFIRMED at the cited lines)

A car that builds a gated feature and lights it does ALL of the following in ONE commit (CR-WR10-C item 4, `subsystemRowsVirtual.js:73-81`: "The key, its first by-name `=== true` gate read and its row are ONE COMMIT" — and now the lit declaration with them):

1. **The register entry**: append the key to `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`simulationRules.js:230-…`) with the comment block the estate writes for every member (the wave, the date, the module of the ONE by-name gate read, the row's home). Order is authoring order (the file says of `advanceEpochEnabled` "sorts FIRST and that is alphabetical order, not precedence"); append at the tail. ⛔ A lit key is NEVER deleted from this list (the 2026-09-05 re-cut, `:197-210`): two lighting contracts and the fences read BUILD STATE off it.
2. **The lit declaration**: the key declared `true` in the FOUR lit presets and absent from the three dark ones. The rosters at HEAD (`tests/domain/simulationRulesPreset.stability.test.js:379-389`): lit = `dramatic_campaign`, `living_realm`, `full_simulation` (`WORLD_ALIVE_PRESET_IDS`) + `realistic_regional` (the lit DEFAULT since L-DEFAULT hunk 1); dark = `quiet_local`, `static_campaign`, `narrative_campaign`. **The shape**: do NOT add the key to `WAVES` (the stability pin asserts `ENGINE_WAVE_FLAGS` has exactly nine, `:391-399`) nor to `ONE_REGEN`; mint a third frozen cohort beside them, once, and every later car appends to it:
   ```js
   // ── THE SIMULATION BUILD — BUILT LIT (the owner, 2026-09-15 16:5x: "everything that we
   // built is built lit on"; §931.6e; reverts to built-dark after the terminal soak). Every
   // key below is VIRTUAL (absent from DEFAULT_SIMULATION_RULES, never a comparison key), so
   // an installed world gains no byte and keeps its preset id; a world BORN into a lit preset
   // runs the layer from its first tick. One line per key, naming its wave and its car.
   const SIM_LIT = Object.freeze({
     grainRoadEnabled: true,          // TR-4 car 5 (the flag-mint car)
   });
   ```
   spread as `...SIM_LIT` immediately after `...ONE_REGEN` in `realistic_regional` (:~800), `dramatic_campaign`, `living_realm` and `full_simulation`. The first lane to mint a key creates the cohort; every later lane appends one line. (The cohort is the chair's recommendation, PLAUSIBLE as a shape; the four-preset rule is CONFIRMED by the stability test's rosters.)
3. **The conjuncts light together.** A gate that is a conjunction lights nothing until its conjuncts are lit — `espionageGate.js:80-81` returns false unless `errandSpineEnabled === true` (spelled `!== true` at :80 as a LIGHTING-ORDER precondition: "`espionageEnabled` lights only AFTER `errandSpineEnabled`", :61-62); the three SP-B subject families are each a conjunction with `beliefAxesEnabled` (`simulationRules.js` comment at the `believed*` entries); `interventionEnabled`/`peaceEngineEnabled`/`supplyWebWarfareEnabled` are AND-gated with `warLayerEnabled` (:636-640). **The lane reads the gate it lights and lists every conjunct in the car body; a conjunct that is dark today is lit in the same car or the car is not a lit landing.** At HEAD all 35 register members are DORMANT (the derived list equals the register: measured by `node -e` import, 35 = 35) — so ES-7's lane lights `beliefAxesEnabled` + `errandSpineEnabled` + `espionageEnabled` (+ the ES-1..ES-6 keys it depends on) as one act, and the FIRST #32 lane to light a key on a conjunction spine pays for the spine's keys.
4. **The gate read**: exactly one by-name strict read `rules.<key> === true` (or the JSDoc-cast alias form the walker's three arms reach: `engineGatedRuleKeys.walker.test.js:150-260`) in the family's own door module, wrapped as `<x>Active(rules)`. Never a frozen-list `.every()` (a computed member attributes to no key: the walker's own paragraph; four live instances are named at :243-250).
5. **The certification row**: in the family's TAIL leaf under `src/domain/certification/` (`subsystemRowsVirtual.js:56-71` names the leaves: Belief · Compact · Coin · Seat · Memory · Lives (empty home, W-LIVES) · Ops (empty home, W-OPS) · Encounters appended LAST) — a NEW family gets a new leaf file spread at the TAIL of `VIRTUAL_SUBSYSTEM_ROWS` (:105-…; "an append at the tail shifts no existing row's index"). 25–40 effective lines per honest row; THE EVIDENCE LAW (every `eventType` traceable to a `candidateType:` literal, every `stateKey` a v5-census container the subsystem owns — `subsystemRowsWaves.js`). `VIRTUAL_PENDING_RULE_KEYS` is `Object.freeze([])` at `:595` and SHRINK-ONLY: the declared-pending door is STRUCK; a row is AUTHORED at the mint.
6. **The three module-scope edits** in `tests/domain/subsystemRowsVirtual.test.js`: the key const, the `VIRTUAL_RULES` member IN POSITION (`:255-270`, ordered equality against `VIRTUAL_SUBSYSTEM_ROWS.map(r => r.rule)`, `:646`), the `LANE_LEAVES` entry (`:278-…`, the lane's OWN leaves only — "scoping it to the whole module list would measure other subsystems' vocabulary").
7. **The two literals** in `tests/domain/contributionLedgerShape.test.js:118-119` (`toHaveLength(35)` twice at HEAD) → 36, with the one-line "35 → 36 at <wave> (<date>)" note above them in the file's own idiom — READ OFF THE LIVE MODULES before editing (the count-from-HEAD rule, §5.2).
8. **The flag-domain census** in `tests/soak-harness/coveringArrayCoverage.test.js:185-222` (the `union`/`governed`/`ungoverned`/`nonBoolean` figures; `union` +1 per virtual key) — re-measured, never inherited.
9. **The edge bundles**: `simulationRules.js` is a transitive input of `supabase/functions/_shared/aiCharterBundle.js` and `aiOutputSchemaBundle.js` (both carry the register list — `grep -l envoyTaskCatalogEnabled supabase/functions/_shared/*.js` returns exactly those two; `aiOutputSchema.js:103` imports `CATCH_UP_CAP_WEEKS`), so ANY byte in `simulationRules.js` — a mint OR a preset declaration — stales both freshness tests (`tests/edgeFunctions/aiCharterBundle.freshness.test.js`, `aiOutputSchemaBundle.freshness.test.js`: banner hash = meta hash = live recomputation). Rebuild by the §913/§931.5(b) recipe, in the dock: `cp -Rc /Users/cstokes/Desktop/settlement-engine/node_modules/immer node_modules/immer && cp -Rc …/seedrandom node_modules/seedrandom` (the two packages the bundles inline; symlinked docks leak an absolute path otherwise) → `node scripts/build-edge-shared.mjs` → `grep -rl 'Users/cstokes' supabase/functions/_shared/` must be EMPTY → `rm -rf node_modules/immer node_modules/seedrandom && ln -s …` back BEFORE any vite build. Files moved: the two `*.js` + the two `*.meta.json` (four; `aiGrounding` moves only when `simulationSpine.js`/`worldState.js`/`humanizeEngineTokens.js` move — LT41b car 6's case). PRICING §A.1 item 2's "seven edge-shared MODIFY rows" is the packet-manifest row count (`scripts/implementation-packets.mjs:33` has the `MODIFY` kind); the file count is taken from the build's own output, never from a brief.
10. **The family's dormancy fence**, written or re-chartered in the LIT shape (§3.3), as its own test file → the census bills (§4.5).
11. **The preset-lighting witness** re-recorded (§1.4 row 1) and the **GOLDEN_SHIFT_LEDGER entry** (§2.5) — in the same commit as the declaration.
12. **The key's comment in the register says it is LIT**, naming the four presets and the car — so the next reader of `ENGINE_GATED_DORMANT_RULE_KEYS`'s absence knows why.
13. **The VIRTUAL-law surfaces — READ `ARCH-PROTOCOLS-ADDENDUM-1.md` (the chair, 22:2x) BEFORE this step; it is the authority and this step only points at it.** L2 at `docs/DESIGN_FP_ARCHITECTURE.md:92` ("Every FP flag is VIRTUAL: absent from DEFAULT_SIMULATION_RULES and every preset spread") and every walker arm that EXECUTES its second clause — for TRADE, `tests/lint/tradeConvergenceContract.walker.test.js:367` ("every TRADE flag is VIRTUAL — absent from the defaults and from every preset spread"; `PRESET_RULE_KEYS` at `:141-144` is built from `Object.keys(preset.rules)`, so a `...SIM_LIT` spread COUNTS and the arm reds the moment step 2 lands) — contradict step 2 by construction. ADDENDUM 1 R1 AMENDS L2 (the chair amends the ledger copies at the landing; a lane does NOT bracket L2 itself) and D0 CAR A re-cuts the `:367` arm to R1(a)–(c) and mints the EMPTY `SIM_LIT` cohort in the four lit presets — D0 lands FIRST at §932 (ADDENDUM §3), so NO LIT car edits `:367` or mints the cohort (a lane that does collides with the door); each LIT car cites the addendum by path in its OWNER-GATED/RISKS row (ADDENDUM §4) and asserts the re-cut arm GREEN with its key in `SIM_LIT`. The family fences' own "declared in no defaults or preset" arms (§1.4 row 2) remain each LIT car's to re-charter (§3.3). (This step was first drafted by the TR architect before the addendum existed and re-cut to it at 22:3x; the addendum wins wherever they differ.)

Steps 1, 4–9 are the flag mint; steps 2, 3, 10–13 are the lighting. **They are one car — the LAST car of the lane (§5) — because the mint is the mount**: the earlier cars land leaves with zero callers (the WR-10 dark-instrument shape; `espionageDormancyFence.test.js:16-19`), and the car that adds the gate read is the car that lights it. **Where the estate's engine-gated walker forces the gate read EARLIER than the last car** — `tests/lint/engineGatedRuleKeys.walker.test.js:537-540` scans every `src/` file for gate reads regardless of callers, and `auditEngineGatedKeys` (`:522`) reds `unaccountedReads` for a by-name read with no manifest entry — ADDENDUM 1 R3 governs: the DARK MINT (the register entry + the one by-name gate read) MAY land early; and because a register entry without its row reds `manifestWithoutRow` (direction 3, `:512-520`; `VIRTUAL_PENDING_RULE_KEYS` is `[]`), the row, the three `subsystemRowsVirtual.test.js` edits and both `contributionLedgerShape` literals (read off HEAD at that car's base) travel with the dark mint; the LAST car (rebased) pays the lighting (steps 2, 3, 10–13) and RE-READS the literals and census figures off the composed HEAD; the family brief RECORDS the split with both numbers (the mint car's, the LIT car's) and the number expected at the consist (§5.2). The TR briefs carry this reading of law 2; it is vetoable.

### 1.3 What a lit key must NOT be (CONFIRMED)

- Not a member of `DEFAULT_SIMULATION_RULES`: a boolean there is a `RULE_COMPARISON_KEY`, and lighting a comparison key on a legacy preset id re-labels every installed campaign to `custom` at its next `ensureWorldState` with no receipt — the eight war sub-flags' recorded reason for staying dark on `dramatic_campaign` (`simulationRules.js`, the O-12 block: "THE LIT HOME IS NOT THIS ENTRY"). A wave that needs a non-boolean rule (WY-1's `kmScale` data, a band) declares it under the profile/data surface its volume charters, never as a comparison key; that is a design row for the family brief, PLAUSIBLE here.
- Not read through a frozen-list conjunction, a computed member or a `!!` coercion (fence 4 of every four-fence set is the gate-polarity census; the truthy-non-true probe in the lit fences).
- Not lit in a subset of the four presets without a recorded reason in the key's comment (the `neutralNeighborsEnabled` form).

### 1.4 Which suites red when a key lights, and what each needs

| # | Suite | Why it reds | What the car does |
|---|---|---|---|
| 1 | `tests/simulation/presetLightingWitness.test.js` + `tests/fixtures/preset-lighting-witness-golden.json` (CONFIRMED: rows `__birth_default__`, the seven presets; fields `rulesSha256`, `bornWorldSha256`, `worldStateSha256`, `wizardNewsSha256`, `settlementUpdatesSha256`, `regionalGraphSha256`, `litFlagCount`, `darkFlagCount`, …) | a key declared in a preset moves that preset's `rulesSha256` and `litFlagCount` at birth and, if the layer runs, its 52-tick pulse hashes; `realistic_regional` moves `__birth_default__` too | RE-RECORD BY HAND (no capture arm, deliberately — the freeze register is UNFROZEN and the door would poison it): `node --input-type=module -e "import('./tests/simulation/presetLightingWitnessRun.js').then(async (m) => console.log(JSON.stringify(await m.measureWitness(), null, 2)))"` → paste the array into `rows`, refresh `distinctWorldStateHashes`, `birthSuccessorPresetIdWhenRecorded`, `presetRosterWhenRecorded`; name the cause in GOLDEN_SHIFT_LEDGER in the same commit; the row diff (which fields moved per preset) is quoted in the car body — a field that moved on a DARK preset is a STOP (the key leaked past its gate) |
| 2 | the family's dormancy fence — the arms `expect(ENGINE_GATED_DORMANT_RULE_KEYS).toContain(FLAG)` / "the flag is VIRTUAL — manifested, and declared in no defaults or preset" (CONFIRMED present in: `tests/property/advanceEpochDormancyFence.test.js:417`, `casusCommerciiDormancyFence.test.js:239`, `espionageDormancyFence.test.js:451`, `believedWorldAxesDormancyFence.test.js`, `secondOrderBeliefDormancyFence.test.js`; `tests/domain/foreignSeatDormancy.byteIdentity.test.js`, `legitimacyUpheavalDormancy.byteIdentity.test.js`, `treasuryDormancy.byteIdentity.test.js`) | a lit key leaves the derived dormant list on its own (`:1141`); the preset-absence assertion is now false | RE-CHARTER per §3.3: the arm becomes "VIRTUAL (absent from DEFAULT_SIMULATION_RULES) and LIT in exactly the four lit presets, absent from the three dark ones" |
| 3 | `tests/soak-harness/coveringArrayCoverage.test.js` (the flag-domain census literals, :185-222) | `union` +1 per key; the note "absent from all seven preset spreads" no longer describes a lit key (the nine WAVES are the precedent of a preset-declared virtual key, so the census already admits the class) | re-measure all four figures out of band FIRST ("the first assertion in this test blinds the three after it" :214-216), then edit the literals |
| 4 | `tests/domain/contributionLedgerShape.test.js:118-119`, `tests/domain/subsystemRowsVirtual.test.js`, `tests/lint/engineGatedRuleKeys.walker.test.js` (directions 1–3), `tests/lint/subsystemCertificationTotality.walker.test.js` | the mint (not the lighting): the triple bijection register ↔ `VIRTUAL_RULES` ↔ rows | §1.2 steps 5–7; a key leaving the walker's `BACKLOG_RULE_KEYS` (`:193-210`, 17 today — e.g. IN-4's `reputationRaceEnabled` is NOT there; `commonsVoiceEnabled` for POP-2/POP-7 IS) deletes its backlog row and lowers the exact ceiling 17 → 16 in the same commit |
| 5 | `tests/edgeFunctions/aiCharterBundle.freshness.test.js`, `aiOutputSchemaBundle.freshness.test.js` | any byte in `simulationRules.js` | §1.2 step 9 |
| 6 | `tests/lint/sovereigntyLightingContract.walker.test.js` (the LIGHTING CENSUS register `tests/lint/.lighting-census-baseline.json`: `files` 2564 · `parked` 375 · `credited` 2189 · `titles` 24178 · `suiteTitles` 6455 at HEAD, `measuredAtSha 32eefe9cf` = LT37 car 5's dock sha) | any new test file or test title (the fence file, the witness edit adds no title) — NOT the flag itself despite the file's name | the refreeze bill as its OWN commit on a CLEAN tree (§4.5) |
| 7 | `tests/lint/mutationCoverageManifest.test.js` (`scripts/mutation-coverage-manifest.json`, `uncoveredBaseline` 186) | a new invariant test file with no manifest entry reds TOTALITY | an entry `kind:'mutation'` with a planted regression in `scripts/mutation-sweep.sh` (preferred; MUTATED_FILES row in the same edit) or `kind:'rationale'`; never `uncovered` |
| 8 | the preset-driven soak suites (`tests/simulation/centuryLegSoak.test.js`, `emergentArcSoak.test.js`, `cacophonySoak.test.js`, `discourseParity.test.js`, `narrativeParity.test.js`, `tests/property/moverCompositionSmoke.test.js` — all drive `full_simulation`, CONFIRMED by grep) | behavioural, not hash goldens: a lit layer adds work; budgets (LT28 set them at the measured 8.3× contention: 600,000 ms per row, 1,200,000 replay) can time out under load | measure ALONE at load < 8 before calling it a defect (§931.1's law); a real regression is the car's to cure |
| 9 | `tests/lint/testRatchet.test.js` + `scripts/.test-ratchet-baseline.json` (`totalTests` 32,771 · `totalFiles` 2,518 · `entries` 1 = the golden master alone) | new tests/files | the chair's totals car at the landing; the lane predicts `totalFiles` and `entries` in its report |
| 10 | `tests/property/generatorGoldenMaster.test.js` (525/525 RED, the ratchet's one known failure) | untouched by an engine key; moved only by generator-side bytes | NEVER re-recorded; the classified diff (§2.4) is the claim |
| 11 | the per-family dormancy GOLDENS (`tests/fixtures/*-dormancy-golden.json`, capture `UPDATE_GOLDEN=1 npx vitest run <suite>`) and `worldpulseDeityGolden` | they drive LITERAL rules objects (`presetLightingWitnessRun.js:5-6`: "every pulse golden in the estate drives LITERAL rules"), so a preset declaration moves none of them; only a KERNEL change under an existing key does | if one moves, the car changed behaviour under a neighbour's key — find the mover, then re-record with the cause in the shift ledger (the freeze register is UNFROZEN: no door yet, and no measured field may be filled) |
| 12 | the whole-world soak receipts / certification grading (`scripts/audit/soakRules.mjs:98` builds from `full_simulation`) | the lit key's row leaves UNOBSERVED (`subsystemRowsVirtual.js:20-30`) and becomes gradable ALIVE/SILENT | not a gate suite; the lane's report says the row is now observable; the terminal soak grades it (PLAUSIBLE timing) |

---

## 2. THE DECLARED-SHIFT RECEIPT

### 2.1 The espionage fence constant — the ritual as the last two windows performed it (CONFIRMED from the header, `tests/property/espionageDormancyFence.test.js:45-125` and `:263`)

The constant: `PRE_COUPLING_CORPUS_SHA = 'cda5ec877…'` at `:263` — sha256 over the key-sorted structural serialization (`stable()`, `:130`) of 360 settlements (`CORPUS_TIERS` six × `CORPUS_ROUTES` four × `CORPUS_SEEDS` 15, `:126-128`) driven through `generateSettlementPipeline`. It is **generator-side**: an engine key lit in a preset cannot move it; generator text, structure or a reachable data table can (the reach was RE-DERIVED at T13: exactly two of thirty-eight cured leaves reachable — reach is measured per window, never inherited). The register row `espionage-dormancy-fence` in `tests/fixtures/.golden-freeze-register.json` counts `constantSites: 1` and `tests/lint/goldenFreeze.walker.test.js:589-596` convicts a second 64-hex literal — history stays in prose with `…` elision, never as a second constant.

The ritual, step by step:
1. **Run the fence at the tip** (`sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/espionageDormancyFence.test.js`). Green 21/21 → the window "opened and closed with zero movement": write the dated block anyway (the T13 TRANS form, `:53-77`: "a re-record that never happens leaves the same trace as one that does — this block is that trace").
2. **Red → the anti-vacuity arms must have PASSED on the convicting run**: 360 rows, 0 errors, 360 DISTINCT hashes (the ENGINE-HYGIENE block, `:96-98`). A red with fewer than 360 distinct is a broken corpus, not a shift.
3. **Name the mover BEFORE it lands**: a settling experiment on the boarding base plus the suspected car(s) alone reproduces the new sha ("an attribution that cannot be back-fitted", `:86-90`); count the rows that moved (LT41b car 6 moved 37 of 525 golden configs on the chair's dump; the fence's 360 are a different corpus — count them separately).
4. **Residue zero on every other train in the consist**: the fence 21/21 at the boarding base and at every other lane's tip (`:91-94`).
5. **Write the block at the top of the header**, in the file's form: `── <date>, <WINDOW NAME> (\`<old 8>…\` → \`<new 8>…\`) ──`; the mover by name and ruling; the moved-row count; residue; anti-vacuity; then **the scope line re-armed naming ALL remaining chartered windows — "A SEAL MUST NAME ALL CHARTERED WINDOWS, OR NONE"** (`:104-106`). At HEAD the header names ONE remaining window, the LIGHTING WAVE (`:69-77`), which is spent; under §931.6b/§931.6e the chartered scope is now **THE BUILT-LIT WINDOW: one re-record per landing from §932 until the terminal soak, each landing's movers named in its GOLDEN_SHIFT_LEDGER entry; TERMINAL is the soak's close act.** The first car to re-record writes that scope line; every later re-record repeats it.
6. **Replace the constant at `:263`** (one line).
7. **The plain re-run is the proof**: the fence 21/21 at the tip, quoted.

### 2.2 The prose-manifest cells (CONFIRMED: `scripts/prose-manifest-cells.mjs:1-60`, `tests/property/dossierProseManifest.test.js:162-197`)

- The committed roll-up `tests/fixtures/dossier-prose-manifest-golden.json` (1,050 rows = 525 configs × 2 audiences; 73,284 cells at §931) is re-recorded by `sh scripts/gate-mutex.sh --run -- node scripts/prose-manifest-cells.mjs --record`. The suite's DRIFT ARM (`:162`) asserts no row added/removed/moved AND `recorderShas()` (`:197`) — so a byte moved in the recorder's own files (`tests/helpers/dossierManifest.js`, `dossierCorpus.js`, the script) forces a `--record` even with zero rows moved (§931.5(c): LT29 car 8's NUL-byte cure moved ONE provenance line).
- The KIND of movement: `node scripts/prose-manifest-cells.mjs --out $MY/<lane>/cells-base.json` at the base and `--out …/cells-tip.json` at the tip, then `node scripts/prose-manifest-diff.mjs <base> <tip>` — the moved rows listed BY POOL KEY in the car body (lane A's dispatch requires it).
- `MANIFEST_PROVENANCE` (`:43-60`) records the declared shift class (`INSTRUMENT` vs a prose shift) and `recordedOverSha`; the `--record` rewrites it — the car body states which class.
- The DRIFT corpus is generator-side settlements at both audiences: an engine key does not move it; a generator or prose-desk byte does.

### 2.3 "The drift manifest by its recorder" — what that names (CONFIRMED)

There is no separate "drift manifest" file: the DRIFT corpus is the prose manifest's arm (§2.2). The other stamped registers a car can move, each with its recorder:

| Register | Recorder | When it moves |
|---|---|---|
| `docs/content/wiring-census.json` (the composed-prose wiring census stamp) | `node scripts/wiring-census.mjs` (default writes; `--check` gates; `--dry` previews; `--rates <file>` folds a RATE run) | any composer / prose-leaf byte (`--check` reds on a stale stamp) |
| `tests/lint/.lighting-census-baseline.json` | `LIGHTING_CENSUS_REFREEZE='<lane> (<dock>, Opus 5 — Fable-unvalidated)' LIGHTING_CENSUS_NOTE='<why>' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` — fails BY DESIGN; the plain re-run 34/34 is the proof (LT37's bill `62342f910` is the verbatim form) | any new test file / title |
| `scripts/mutation-coverage-manifest.json` | hand-edited (+ `scripts/mutation-sweep.sh` label) | any new invariant test file |
| `tests/lint/.prose-numerics-baseline.json` | the walker (exact path+line+snippet identity, shrink-only; CR-FP-2 was the one ruled upward move) | any prose-surface line that moves an existing debt row's address |
| `scripts/.writer-reach-baseline.json` | `node scripts/check-writer-reach.mjs` (dry) then `--write` (shrink-only; never `--genesis`) | a dark writer gains/loses a reader (the chair re-stamps at the consist tip) |
| `tests/fixtures/*-dormancy-golden.json` and the other `UPDATE_GOLDEN` surfaces (the freeze register lists 50 rows with their env spellings) | `UPDATE_GOLDEN=1 npx vitest run <suite>` | only when the kernel moves under an existing key (§1.4 row 11) |
| `tests/fixtures/preset-lighting-witness-golden.json` | by hand (§1.4 row 1) | every preset lighting |
| `docs/implementation/BASE_STATE.json` (the capsule) | `node scripts/base-state-capsule.mjs --runtime-tests=<totalTests>` — the chair's capsule car | every landing |

### 2.4 The base-vs-tip classified diff (CONFIRMED: `$SC/c931-f6ac0d98/declared/`)

The chair's kit, verbatim usable: `__chair_dump.test.js` (dumps every golden-corpus settlement as `{sha, json}` keyed by `keyOf(config)`, `expect > 500`, 600 s budget), `run-declared.sh` (for each of two shas: `git worktree add --detach`, symlink `node_modules`, copy the probe into `tests/property/`, `CHAIR_DUMP_OUT=<out>/dump-<sha>.json sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/__chair_dump.test.js`, ~100 MB each, remove the worktree; NEVER committed), `classify.py <base.json> <tip.json>` (unified diff per changed config; every `-`/`+` line must match a declared pattern; `sys.exit(1 if undeclared)`). Its §931 receipt: `configs: 525 · unchanged: 488 · changed: 37 · declared lines: RULING 1 0 · RULING 3 74 · UNDECLARED lines: 0`.

**Extending `classify.py` per family**: the pattern table is two lists per ruling (`R<n>_OLD`, `R<n>_NEW`) and a `declared` counter keyed by ruling; a family adds ONE ruling block per declared mover, each regex anchored to the exact sentence or field family it moves (e.g. `r'"grainRoad": '` for a new generator-side field, `r'"stability": "(Unstable|…) \([^)]*\)"'` for a label), and prints the ruling name in the summary. Rules: a pattern may never be a bare `.*`; every `+` line and every `-` line must classify; the exit code is the gate. Lanes commit the extended classifier under their lane dir in `$MY`, never in the tree.

**For an engine key the generator dump is the ZERO-MOVEMENT receipt** (`generateSettlementPipeline` never reads a preset): `configs 525 · unchanged 525 · changed 0`, quoted. The engine-side classified diff is the witness row diff (§1.4 row 1: per preset, which fields moved) plus, where the chair wants the cheap pulse arm, `sh $SC/lprobe/run.sh <dock> <out> --cheap` (GOLDEN_SHIFT_LEDGER:2345 — thirty seconds; PLAUSIBLE that the kit path still resolves; `ls $SC/lprobe` returned nothing at this read, so the lane asks the chair before relying on it).

### 2.5 The `docs/GOLDEN_SHIFT_LEDGER.md` entry shape (CONFIRMED from the §898 and §905 entries, lines 2176-2360)

Append-only, at the end of the file, one entry per landing (the chair collects; a lane drafts its section in its report and, where the dispatch says so, in the dock's copy on the lane's LAST car):

```
---

# GOLDEN SHIFT LEDGER — <THE LANDING NAME> (§<N>, <date>; SEAT: <Fable 5.1 — validated | Opus 5 — Fable-unvalidated>)

## HEADLINE RESULT — <one sentence: what moved, for whom, and what did not>
## Why this is a shift and not a repair of a defect
## <the overlapping paths, resolved> (only when a rebase/replay merged two sides)
## Goldens / driven-corpus constants re-recorded — every one named, with its cause
| file | assertions | before | after | cause |
## Non-golden registers moved at the landing (chair acts, at the composed tip)
## Conditions under which a FUTURE golden will legitimately shift (for the next session)
## The DECLARED-SHIFT sentence owed to LGT-REG-DECL (verbatim)
> "<keys> lit on <presets> at landing <sha>; <which hashes moved>; <what did not move: the other presets, the generation arm N of N bit-identical, the OSR presence, the lighting census, the first-paint closure ±B>; no installed campaign is re-labelled; no tuning value moved."
```

The table row for the fence reads `\`tests/property/espionageDormancyFence.test.js:263\` \`PRE_COUPLING_CORPUS_SHA\` | 1 | \`<old 8>…\` | \`<new 8>…\` | <mover> (anti-vacuity: rows 360, distinct 360, errors 0) — TAKEN as car \`<sha>\` at residue zero`; the witness row names the presets whose `rulesSha256`/`worldStateSha256` moved; the golden master's row says `NOT re-recorded — 525 rows move (0 unmoved) … BANKED owner-gated … until the genesis signing`.

---

## 3. THE FENCE PROTOCOL

### 3.1 The census (CONFIRMED by `grep -rlE 'FENCE|dormancy|unreachable|terminates' tests/` — 478 files mention the words; the 78 below are the instruments; every header line was read)

**A. The FOUR-FENCE dormancy SETS (`tests/property/*Fence.test.js` + kin) — fence 1 driven byte-identity dark, fence 2 differential ABSENT vs explicit FALSE, fence 3 call-path dormancy (a strict pass-through spy, count ZERO), fence 4 gate-polarity census (every read is `=== true`), + the LIT MUTANT and the per-door conjunction pins:**

| Fence file | Family / wave / key | Re-charter at lighting |
|---|---|---|
| `advanceEpochDormancyFence.test.js` (five fences) | EP-1 `advanceEpochEnabled` | EP lane; ⚠ the witness's `advanceEpochLit` row transition: `src/domain/clock.js` THROWS on a lit world with no threaded epoch — the witness run threads a per-row nonce (`presetLightingWitnessRun.js:55-57`) |
| `believedWorldAxesDormancyFence.test.js` (×3 keys) | SP-B `beliefAxesEnabled` + `believedConditions/Devotion/Scarcity` | the first #32 lane that lights the axes (TR-3 believed markets, POP-1 believed road, or ES-7 via its conjunction) |
| `casusCommerciiDormancyFence.test.js` | TR-1 `casusCommerciiEnabled` | TR lane 7 (the mount) |
| `chanceEncountersDormancyFence.test.js` | ENC-3 `chanceEncountersEnabled` | lane B (ENC-5 fold) |
| `conquestDoctrineDormancyFence.test.js` | WR-8 `conquestDoctrineEnabled` (LGT-P13 lit-shape precedent) | already the lit shape; WC lanes verify |
| `errandSpineDormancyFence.test.js` | SP-D `errandSpineEnabled` (both polarities pinned: the espionage gate's `!== true` precondition) | the first lane lighting any errand consumer (TR-8, WF-2, IN-4, ES-7, lane B's W-OPS car B) |
| `espionageDormancyFence.test.js` | ES-0 `espionageEnabled` — fence 1 = (a) the driven corpus constant + (b) THE REACHABILITY CHAIN (`[missionDispatcher.js]` is the espionage set's only src importer and ITS importer set is EMPTY) | ⛔ **lane B's W-OPS wiring car A is the first to add an importer of `missionDispatcher.js`** — the chain arm reds there, and its own instruction applies ("replace it with a driven byte-identity golden in the commit that added the caller"): the chain becomes a NAMED importer roster; the ES lanes (9/11/12) then light the conjunction and re-charter the DORMANT arm (`:451`) |
| `espionageMissionDormancyFence.test.js` (11 constant sites) · `espionageGauntletDormancyFence.test.js` · `espionageProductsDormancyFence.test.js` · `espionageDoctrineDormancyFence.test.js` · `espionageRiderDormancyFence.test.js` (11 sites) · `espionageAbsenceDormancy.test.js` · `espionageCareerDormancy.test.js` · `espionageCareerCreditDormancy.test.js` · `espionageLeakDormancy.test.js` | ES-1 · ES-2 · ES-3 · ES-5 · ES-Da · ES-5b · ES-5c · ES-5d · ES-6a | ES lanes 9–12: one lighting act over the whole conjunction; every `⟨F6⟩ GOLDEN PAIR` and every in-file constant re-recorded in that act (the freeze register's `constantSites` counts stay exact) |
| `faithFieldDormancyFence.test.js` · `faithUnseatingDormancyFence.test.js` (lit shape; site census of four modules; truthy-non-true probe) | W-FAITH F3c · WF-1 `faithUnseatingEnabled` | WF lanes 16–22 |
| `habitNeutralIdentity.test.js` | HB-2 `habitConditioningEnabled` (the §2.4 cold-start fence) | HB lane 46 |
| `oathHolderDormancyFence.test.js` · `pactFormationDormancyFence.test.js` · `treatyLifecycleVoiceDormancyFence.test.js` | GR-1 · GR-2 · GR-0 | GR-CW lanes (GR-4/5/6/7) |
| `secondOrderBeliefDormancyFence.test.js` · `secrecyTradeDormancyFence.test.js` | IN-1a `secondOrderBeliefEnabled` · IN-0d | IN lanes 6/10/36–39 |
| `sovereigntyTradeDormancyFence.test.js` · `sovereigntyWaveMultiYearDormancy.test.js` | WR-10 `sovereigntyTradeEnabled` | TR-5 (the pact lane touches `sovereigntyBundle.js`) |
| `strategicPostureDormancyFence.test.js` | SP-C `strategicPostureEnabled` | INT-1/INT-2 (the books the posture reads) |
| `underwaysOrganicFoundingDormancyFence.test.js` | D6 `underwaysOrganicFoundingEnabled` | none of #32; verify |
| `warCirculationDormancyFence.test.js` | WC-0E `warCirculationEnabled` + `contributionLedgerEnabled` | WC lane 53 (WC-1) |
| `tests/property/demographicsLifecycleGolden.test.js` (P5b "first BOTH-FLAGS fence") | demographics lifecycle | POP lanes |

**B. The fixture DORMANCY GOLDENS (`tests/property/*DormancyGolden.test.js`; capture `UPDATE_GOLDEN=1`; each drives LITERAL rules):** assize (V-22) · beliefAxes (D-1) · commonsVoice (V-23, `commonsVoiceEnabled` — POP-2/POP-7's backlog key) · contestedGoals (D-4) · corruptionWeb (W-DOCTRINE-3b) · dispositionChannels (WR-2) · generosity (E1a) · informationStatecraft (W-DOCTRINE-2) · intelTrade (D-3) · intervention (W-CONVERGENCE) · migrationRumors (D-0) · momentum · naval (W-NAVY) · npcCredibility (D-2) · npcGrowth · npcLadder · npcLedger (W-H1) · peaceCausal (W-PEACE-1) · provenance · reframe (D7) · resourceDynamics (W-DISCOVERY) · roads · seaRoads (D-6) · settlementLifecycle · settlementPolitics (W-DOCTRINE-4) · spatialConsequence · supplyWebWarfare (W-DOCTRINE-1) · thirdPartyRansom (D-5) · townCartography (TC-1) · traditions · upswing · urbanFabric. **Re-charter rule: none at lighting** (literal rules); a moved fixture means a kernel change under a neighbour's key → mover first, then `UPDATE_GOLDEN=1` with the cause in the shift ledger. The WY/LG lanes note `roads`, `seaRoads`, `naval`, `thirdPartyRansom`; POP notes `migrationRumors`, `commonsVoice`; TR notes `intelTrade`, `informationStatecraft`, `corruptionWeb`.

**C. The byte-identity fences under `tests/domain/`:** `irregularForceDormancy.byteIdentity.test.js` (SEAT-7a/SEAT-78 — lane B's SEAT-8 lights it) · `foreignSeatDormancy.byteIdentity.test.js` · `legitimacyUpheavalDormancy.byteIdentity.test.js` · `treasuryDormancy.byteIdentity.test.js` (W-COIN — lane B lights `treasuryEnabled`; the Q10 law `simulationRules.js:393-402` is MET: W-COIN-2's band chip landed) · `routeNetworkDormancy.test.js` (W-J J1, aspatial + spatial) · `emigreErrand.test.js` (INT-3b) · `envoyChanceMeetingLedger/Stage.test.js` (ENC) · `habitCurve.test.js` (HB-0) · `pactKernelMount.test.js` · `warDeployment.test.js` · `successionQuestion.test.js` / `treatySuccessionDossier.test.js` / `treatyRenewalMemory.test.js` (GR-4/GR-5) · `conquestExecutionWr8.test.js` · `demographicsFloor/Kernel.test.js` (POP) · `beliefAxisSubjectsFoldPin.test.js` (SP-B) · `livingContentMaterialization.test.js` · `npcLedgerProjection.test.js` · `amnestyJubileeRegistration.test.js`. Re-charter: the lane that lights the key rewrites the preset-absence arm (where present: the three W-SEAT/COIN files) and keeps the byte-identity arm over an explicit-false / absent-key rules object.

**D. The lint FENCES and WALKERS (source scans; never re-chartered by a lighting, but every car pays them):** `engineGatedRuleKeys.walker.test.js` (three directions; the BACKLOG 17 exact; the EXEMPT list by recorded rationale) · `sovereigntyLightingContract.walker.test.js` (the lighting census register + the WR-9 evidence walker) · `composeStateProseFence.test.js` (`ROUTED_DESKS` exact roster — one desk per car; a seventh importer reds; `Intl`/`toLocale*`/`localeCompare` banned in the composer) · `heraldContaminationFence.test.js` (SP-6's truth law, K3 inverted — every Herald kind a lane mints passes it) · `proseWiringCensus.walker.test.js` · `observedShapeReaders.walker.test.js` (the OSR inventory, rung 18; #20's one trailing mint) · `worldGenerationClockSeam.walker.test.js` · `worldStateHydrationIngress.walker.test.js` · `institutionTable.walker.test.js` · `lawBandTable.walker.test.js` · `strategyMoveVocabulary.walker.test.js` (HB-1's registry) · `clampPrimitiveBaseline.test.js` · `chanceMeetingKindPools.walker.test.js` / `faithKindPools.walker.test.js` (the kind-pool walkers with the `mechanismLitCoverage` AUTO-credit rule: a flag earns lit credit only on a LITERAL `<flag>: true` in a test — `contributionLedgerShape.test.js:11-16`; the rule lives in `tests/lint/testRatchet.test.js` and the two pool walkers, CONFIRMED by grep) · `goldenFreeze.walker.test.js` (arms 1–3 over the UNFROZEN register: no measured field may be filled; every 64-hex constant site accounted; every `UPDATE_*` spelling enrolled or written-excluded).

**E. The reachability / boundary fences:** `espionageDormancyFence` fence 1(b) (the chain terminates — see A) · `composeStateProseFence` (importers of the composer) · `tests/build/generationWorkerLazy.test.js` (the worker's DECLARED LAZY EDGES table: a module split out must be PRESENT in its chunk and ABSENT from the worker; adding a row "is a byte decision") · `tests/build/vendorPdfLazy.test.js` (FP-G17 `engineChunkLazy`: the eager excision list; `detMath` on its own lazy chunk) · `tests/edgeFunctions/contracts.test.js` · `tests/helpers/receiptAnnex.js` (the annex fence for receipt pools) · `tests/store/proposalUndoRing.test.js` / `advanceEpochForkSemantics.test.js` (lifecycle fences: undo · fork).

### 3.2 The law of a fence under the built-lit regime (the chair's ruling, PLAUSIBLE as a synthesis of the fences' own headers)

A dormancy fence's CLAIM does not change when its key lights: "absent ⇒ dormant no-op ⇒ byte-identical; explicit false ≡ absent; the layer runs only through its one strict door; lit ⇒ it moves". What changes is WHICH rules object is the dark world and which is the lit one. The fence keeps every arm and re-homes them:

| Arm | Dark-landing form (today) | Lit-landing form (from §932) |
|---|---|---|
| "VIRTUAL — declared in no defaults or preset" + `ENGINE_GATED_DORMANT_RULE_KEYS` contains FLAG | asserted | → "VIRTUAL (absent from `DEFAULT_SIMULATION_RULES`), REGISTERED (`ENGINE_GATED_VIRTUAL_RULE_KEYS` contains FLAG), LIT in exactly `['realistic_regional','dramatic_campaign','living_realm','full_simulation']` and absent from the other three" — the roster spelled from `SIMULATION_RULE_PRESETS` itself, not as a literal that rots |
| fence 1 (driven dark golden / byte identity) | drives `{}` or a literal dark rules object | unchanged: the dark world is `SIMULATION_RULE_PRESETS.quiet_local.rules` or `{ [FLAG]: false }`; the anti-vacuity twin drives the LIT preset and requires movement |
| fence 2 (absent vs explicit false) | unchanged | unchanged |
| fence 3 (call-path count zero) | zero under dark | zero under dark; **the lit twin requires the count to MOVE** under `full_simulation` |
| fence 4 (gate polarity census) | unchanged | unchanged (+ the truthy-non-true probe from the LGT-P13 lit fences) |
| the lit mutant | satisfies every door by hand | is the lit PRESET; the hand-built mutant stays as the door-by-door conjunction pin |
| the site census (`DECLARED_GATE_SITES`, `faithUnseatingDormancyFence.test.js:58-63`) | — | added: the modules that read the key by name, measured at the tip |

The LGT-P13-FENCES trio (`conquestDoctrine`, `faithUnseating`, `underwaysOrganicFounding`, `warCirculation` — "the lighting wave's L-HOMES car 3") is the executed precedent for a fence over a key that is lit somewhere: copy their shape. ⛔ No 64-hex literal is authored in a NEW fence (`faithUnseatingDormancyFence.test.js:33-37`: a pinned constant under `tests/property/` owes a freeze-register row against an unfrozen register); both sides of every comparison are computed in-file.

### 3.3 Who re-charters, and when

The lane whose car LIGHTS the key re-charters the fence in that car (the owner's rule, §931.6e; the fence's own header says how). Where a foreign lane breaks a REACHABILITY arm first (lane B → `missionDispatcher.js`'s importer set), that lane pays the arm's own replacement instruction and leaves the DORMANT/preset arms to the family lane. A lane that finds a fence red for a reason its car did not cause STOPS and reports the mover (memory: "a moved DRIVEN GOLDEN is a STOP by its own law").

---

## 4. THE BUDGET PROTOCOL

### 4.1 The four budgets (CONFIRMED at the cited lines; measured values as last recorded)

| Budget | Constant | Ceiling | Last MEASURED | Margin | Where measured |
|---|---|---|---|---|---|
| the eager first-paint closure (raw bytes of the static import closure) | `CLOSURE_BUDGET_BYTES` `tests/build/vendorPdfLazy.test.js:565`; asserted `:957-970`; pinned `:1706` | 1,048,000 (owner-ratified 2026-09-01) | **1,047,205** (`:539`, "795 B under") — the lighting wave then took −5,047 B (GOLDEN_SHIFT_LEDGER:2354), so the live figure is PLAUSIBLY lower; the gate at §931 was green with no figure printed | 795 B by the record; re-measure at the first §932 build | gzip 337,000 / Brotli 283,000 ceilings NOT raised (`:552-563`) |
| the lazy `engine` chunk | `vendorPdfLazy.test.js:746-769` `expect(size).toBeLessThan(676_000)` | 676,000 (owner-ratified 2026-08-31) | **675,323** (`:762`); the §931 build log lists `engine-BkijXS8q.js 675.10 kB` (CONFIRMED in `$MY/c931/build-after-drop.log`) | ~677 B | `ls -l dist/assets/engine-*.js` |
| the generation worker bundle | `WORKER_BUNDLE_CEILING_BYTES = 1404493` `tests/build/generationWorkerLazy.test.js:78`, asserted `:387-393`; MONOTONE-DOWN | 1,404,493 | **EXACTLY 1,404,493** at `a5876c0ea` (the bisect `$MY/c931/worker-bisect.txt`: `7047aa157 worker=1404493`, `74d3686fb worker=1404493`; LT17 car 2 = 1,404,698, +205 B, HELD) | **0 B** until lane A0 lands and LOWERS the constant | `stat -f %z dist/assets/generation.worker-*.js` |
| the shared-file line ceilings | `tests/lint/sizeBaseline.test.js` (three properties: EXACT SET · ABOVE FAILS · BELOW RATCHETS DOWN) + eslint `max-lines` per layer (600 components/src-root `.jsx`; 800 everywhere else) + `scripts/.size-baseline.json` (8 frozen entries) | per file | §4.3 | per file | `npx vitest run tests/lint/sizeBaseline.test.js` or `node $MY/arch-932/near-ceiling.mjs <dock>` |

⛔ **The dist-gated skip hazard** (CONFIRMED): `vendorPdfLazy.test.js:68` `requireDistRead = process.env.VERIFY_DIST === '1'`, every dist arm `it.skipIf(!requireDistRead)` under `describe.runIf(distExists)` (`:687`, `:957`); `generationWorkerLazy.test.js:74-78` `DIST_EXISTS` / `REQUIRE_DIST`, `describe.runIf(DIST_EXISTS)` at `:267`. On a box with no `dist/`, both ceilings report green without running; on a STALE dist they under-report. The lanes' briefed gates never built the worker before §931 (memory: the +205 B red was seen only at the landing). So: **every car that touches `src/` runs `sh scripts/gate-mutex.sh --run -- npm run build` then `npm run verify:dist`** (= `check-test-ratchet.mjs --verify-dist`, the STRICT DIST line: `54 discovered/reported file(s), 472 test(s)` at §931) and quotes the worker `stat`, the engine chunk line and the first-paint table verbatim. To read the exact closure figure on a green run, lower `CLOSURE_BUDGET_BYTES` in a THROWAWAY worktree so the failure message prints `first-paint static closure = N bytes` with its member lines (`:969`); never commit that probe.

### 4.2 The eager-slice cost of lighting, and the closure act it owes (PRICING §A.3, CONFIRMED there; the arithmetic PLAUSIBLE)

The preset catalog rides the eager store slice (`normalizeSimulationRules → presetIdForRules`; the nine WAVES cost a measured +252 B, `simulationRules.js:641-644` ≈ 28 B per key per spread site). A key lit in four presets by the `SIM_LIT` cohort costs the cohort's one string plus four spread references — of the order of 30–60 B minified per key (PLAUSIBLE). Twenty keys exhaust the 795 B margin; INT-3's `stressorsCore.js` row alone is 0.6–1.2 KB eager. **A CLOSURE-HEADROOM act is owed before INT-3a (lane 42) and before roughly the twentieth lit key** — chartered here as lane A0b (the chair's to price: move the preset `label` strings and the register's comment-free tail out of the eager slice by the registryProse idiom, `flagRegistry.js:9-17`; or split the catalog's lit cohorts into a lazy sidecar the normalizer awaits — an owner-gated public store-API change was priced and REFUSED at `vendorPdfLazy.test.js:548-563`, so the sidecar must stay synchronous). Every lane reports the closure delta of each src car; the chair sums at the consist.

### 4.3 The shared-file ceilings table (CONFIRMED by execution at the consist tip `315080928`, eslint's own Linter under the enforcer's rule; slack = ceiling − effective lines)

Baselined (`scripts/.size-baseline.json`, every entry at ZERO slack — the baseline freezes each at its current count and the house test ratchets DOWN):

| File | eff/ceiling | Owners on the boarding order | Rule |
|---|---|---|---|
| `src/domain/worldPulse/pulseKernel.js` | **1581/1581** (R-BLD-10, banked permanently) | GR-4 remainder (`expireStaleActorMajors` called bare at `:347`), GR-6 (the war opener), every wave that needs a NEW pulse call site (EP-1 read `:313`, WF-1 `:1637`, treasury `:578` already there) | EXTRACTION CAR FIRST (move a stage body out to its kernel), never a raise; ONE lane at a time on this file |
| `src/domain/worldPulse/roadsKernel.js` | **838/838** | WY-3 (mover bodies; nine F3 writes), WY-5, WY-8a; LG-7 (`legModes` at `:1032`) | WY-3's car 1 is the extraction car (PRICING lane 29) |
| `src/domain/worldPulse/applyWorldPulse.js` | **907/907** | TR-4 car 0 (CR-2: consolidate the two `storageMonths` folds → LOWERS the baseline) | TR-4 car 0 lands FIRST; any other lane touching this file waits for it and inherits the lower number |
| `src/domain/worldPulse/warTermination.js` | 818/818 | WF-1 reads `faithUnseatingEnabled` here; GR-7 endings-mix | extraction first |
| `src/domain/explanation.js` | 827/827 | display | extraction first |
| `src/App.jsx` | 650/650 · `src/store/settlementSlice.js` 824/824 · `src/generators/npcGenerator.js` 1345/1345 | UI / store / generator (W-ARMS, VAR-1b touch the generator side) | extraction first |

Under the layer ceiling but within 20 effective lines of it (the "every file within 20 lines" roster the task asked for — MEASURED, 31 files incl. the 8 above; the 23 unbaselined ones):

| slack | eff/ceiling | File | Who meets it |
|---|---|---|---|
| 0 | 600/600 | `src/components/OutputContainer.jsx` | display trains |
| 0 | 600/600 | `src/components/settlement/EventComposer.jsx` | — |
| 0 | 800/800 | `src/domain/worldPulse/generosityKernel.js` | TR-4 (`generosityUpdates.applyFoodDeltasToUpdates` is the one applicator — the kernel is at the wall: the grain credit is a NEW leaf, never a line here) |
| 1 | 599/600 | `src/components/WorldMap.jsx` | WY-0 (layer manifest), WY-7, WY-9, EP-4 s2 (the volume says ~605/600 — it is 599: two lines of slack, measure first), DESK |
| 1 | 799/800 | `src/generators/generationReceiptJudgments.js` | generator cars |
| 2 | 598/600 | `src/components/ShareToGallery.jsx` | — |
| 2 | 798/800 | `src/domain/worldPulse/armyTransitKernel.js` | WC-6 (block rosters) — extraction car first (PRICING) |
| 2 | 798/800 | `src/domain/worldPulse/institutionLifecycle.js` | POP-5b (a foreign read site) |
| 3 | 797/800 | `src/domain/worldPulse/peaceTerms.js` | TR-5 → WF-6 → GR-5 (the head's three lines; the T9 STOP: one lane in flight on `peaceTerms*.js`) |
| 4 | 596/600 | `src/components/new/tabs/EconomicsTab.jsx` | W-COIN-4 (lane B) |
| 4 | 796/800 | `src/domain/certification/behavioralContract.js` | IN-6, GR-7, CW-3 measurement rows |
| 5 | 795/800 | `src/domain/worldPulse/npcAgency.js` | HB, INT |
| 6 | 594/600 | `src/components/settlements/StructuredCampaignReconciliation.jsx` | — |
| 7 | 593/600 | `src/components/SettlementDetail.jsx` | display |
| 9 | 791/800 | `src/generators/economy/economicState.js` | TR-3/TR-6 (the generator's price side) — worker graph too |
| 10 | 590/600 | `src/components/map/WorldMapToolbar.jsx` | WY-0 |
| 11 | 789/800 | `src/lib/contentPacks.js` | — |
| 14 | 586/600 | `src/components/map/HeraldCommandBody.jsx` | IN-5 (seventh desk), ES-7, W-OPS wiring A |
| 16 | 784/800 | `src/domain/realm/realmItemReadModel.js` | CW-1 (NOT the seam — `buildHeraldFeed` is) |
| 16 | 784/800 | `src/lib/campaigns.js` | — |
| 19 | 781/800 | `src/domain/worldPulse/beliefMap.js` | TR-3 (net-zero), HB-6, HB-7 — serialize |
| 19 | 781/800 | `src/domain/worldPulse/informationStatecraft.js` | IN-2, IN-3, IN-4 |
| 20 | 780/800 | `src/domain/townScene/manifestRecordValidation.js` | — |

Other files the recon names, measured (all under their ceiling with room): `settlementLifecycleKernel.js` 733 (TR-1's mount line) · `warDeployment.js` 684 (WF-7; GR-6's `:1031`) · `settlementStrategy.js` 760 (HB-5, SEAT-2a §H — TE-CEIL landed; the blocker is this number, not an absent extraction) · `supplyKernel.js` 489 (TR-4's mount) · `pactFormation.js` 426 · `envoyErrandVocabulary.js` 367 · `demographicsMigration.js` 380 · `stressorsCore.js` 392 (EAGER) · `commercialReceiptPools.js` 386 · `corruptionWeb.js` 510 · `religiousContest.js` 493 · `subsystemRowsVirtual.js` 284 (the composition; leaves are where rows go) · `simulationRules.js` 352 effective (comments dominate; the 1,444-line file is the register + presets). Paths the recon spells short: `commodityFlow.js` and `migration.js` live under `src/domain/spatial/`; `rulingPower.js` at `src/domain/rulingPower.js`; `WorldMap.jsx` at `src/components/WorldMap.jsx`.

### 4.4 The extraction-first rule (the estate's, CONFIRMED in `sizeBaseline.test.js:28-33`; the chair's ordering PLAUSIBLE)

- A car that would add a line to a file at slack ≤ its delta lands an EXTRACTION CAR FIRST: a pure leaf receives a whole stage body (never a fragment), the caller becomes one line, the leaf gets its own tests, the baseline entry is LOWERED (or DELETED when the file falls under its layer ceiling) in that car. The extraction car is byte-neutral (the composed output identical, proven by the family's own dormancy golden or the witness) — it is never bundled with behaviour.
- A number is never raised. PACKET_STANDARD's "Delta in a shared/hot file ≤ 15" (`docs/implementation/PACKET_TEMPLATE.md:64`) binds every car on the table above.
- `sizeBaseline` property 3 means a car that SHRINKS a baselined file must lower its number in the same car, or the suite reds at the gate ("BELOW DEMANDS RATCHET-DOWN").

### 4.5 The census bills every car pays (CONFIRMED forms)

1. **The lighting census refreeze** — only when a test file or title was added/removed; on a CLEAN tree at the tip of the commit that moved it; its OWN commit (`LT37 census bill` form: the env-driven run that fails BY DESIGN, then the plain 34/34 re-run quoted; `files/parked/credited/titles/suiteTitles` before → after, with the sentence explaining which moved and why).
2. **The mutation manifest** — a new invariant test file: a `kind:'mutation'` entry + a `check_caught*` plant in `scripts/mutation-sweep.sh` + its `MUTATED_FILES` row; or a `kind:'rationale'`.
3. **The wiring census stamp** — any prose/composer byte: `node scripts/wiring-census.mjs` (the `--check` reds at the gate otherwise).
4. **prose-numerics** — reader prose that names a quantity: bands and words, never floats; a moved debt row is re-keyed exactly, never re-recorded wholesale.
5. **The edge bundles** — any byte in a bundled input (§1.2 step 9).
6. **The witness / the fence constant / the prose cells** — §1.4, §2.

---

## 5. THE FLAG-MINT CAR

### 5.1 The exact file list (CONFIRMED from the landed mints: SEAT-78 `bc3002c55` (9 files), LGT-P5-WOPS car 1 `bbb53a83d` (6 files), and the downstream surfaces each was found to owe at the composition — `contributionLedgerShape.test.js:104-116`, `coveringArrayCoverage.test.js:212-216`)

| # | File | Edit |
|---|---|---|
| 1 | `src/domain/worldPulse/simulationRules.js` | the register entry (tail of `ENGINE_GATED_VIRTUAL_RULE_KEYS`, with its comment block) + the `SIM_LIT` line (§1.2 steps 1–2) |
| 2 | the family door module (e.g. `src/domain/worldPulse/<family>/<x>Gate.js` or the kernel's own head) | the ONE by-name strict gate read `<x>Active(rules)`; its conjuncts spelled by name |
| 3 | `src/domain/certification/subsystemRows<Family>.js` (tail leaf; a NEW leaf spread at the tail of `VIRTUAL_SUBSYSTEM_ROWS` in `subsystemRowsVirtual.js` for a new family) | the authored row (evidence law) |
| 4 | `tests/domain/subsystemRowsVirtual.test.js` | the key const · `VIRTUAL_RULES` member IN POSITION · `LANE_LEAVES` entry |
| 5 | `tests/domain/contributionLedgerShape.test.js:118-119` | both literals N → N+1, read off the live modules |
| 6 | `tests/soak-harness/coveringArrayCoverage.test.js:185-222` | the four census figures re-measured |
| 7–10 | `supabase/functions/_shared/aiCharterBundle.js`, `aiCharterBundle.meta.json`, `aiOutputSchemaBundle.js`, `aiOutputSchemaBundle.meta.json` | `npm run build:edge-shared` by the clone → build → verify-no-path-leak → relink recipe |
| 11 | `tests/property/<family>DormancyFence.test.js` (new, LIT shape) | the four fences + lit mutant + conjunction pins + site census + truthy probe; no 64-hex literal |
| 12 | `tests/fixtures/preset-lighting-witness-golden.json` | re-recorded by hand; the row diff in the body |
| 13 | `tests/lint/engineGatedRuleKeys.walker.test.js` | ONLY if the key leaves `BACKLOG_RULE_KEYS` (row deleted, ceiling 17 → 16) or joins `EXEMPT` |
| 14 | a family-specific importer allowlist where the key's reader has one (SEAT-78 met `tests/domain/militaryStrength.test.js`) | measured per family |
| 15 | `tests/lint/.lighting-census-baseline.json` | the refreeze bill — a SEPARATE commit after the mint car |
| 16 | `scripts/mutation-coverage-manifest.json` (+ `scripts/mutation-sweep.sh`) | the fence file's entry |
| 17 | `docs/GOLDEN_SHIFT_LEDGER.md` (the dock's copy) | the landing entry's draft section (the chair folds at collection) |
| 18 | `docs/implementation/packets/<family>/<WAVE>.md` + `docs/implementation/PACKET_MANIFEST.json` | where the family runs packets (`validate:packets` is in `npm run check`); PLAUSIBLE whether every lane needs one — the long-tail lanes landed without |

Handwritten files ≈ 12–14 — at PACKET_STANDARD's cap of 12 (`PACKET_TEMPLATE.md:61`); the bundles and registers are regenerated, not handwritten, and the census bill is its own commit, so the mint car itself stays inside the cap.

### 5.2 The count-from-HEAD rule (PRICING §A.4.4, CONFIRMED by the §876/§893/§900 precedents in `contributionLedgerShape.test.js:83-116`: "THE LANDING RE-MEASURES; it never re-applies these")

- The flag-mint car is the LAST car of its lane, and it is REBASED at landing (the compose cherry-picks it last; a textual conflict on the register tail, the `SIM_LIT` cohort, the two literals and the census figures is EXPECTED when two lanes mint).
- Immediately before editing, the lane runs, at its dock HEAD: `node -e "import('./src/domain/worldPulse/simulationRules.js').then(m => console.log(m.ENGINE_GATED_VIRTUAL_RULE_KEYS.length))"` and the same for `VIRTUAL_SUBSYSTEM_ROWS.length` from `./src/domain/certification/subsystemRowsVirtual.js`; both literals = that + 1 (35 → 36 today for the first lane).
- At the composition the chair re-measures the literals on the composed tree and resolves the conflict by the measurement, never by OURS/THEIRS (§931.3's per-file rule hazard); the lane's report states the number it wrote and the number it expects at the consist ("both sides close arithmetically on their own base, which is exactly the still-closing-lie shape").

---

## 6. THE COMPOSE PROTOCOL (the §932 landing, from the §931 scripts; CONFIRMED by reading `$MY/c931/*.sh`, `$P/c930/*.sh`, `$SC/commit-totals.sh`, `$SC/chair-verify.py`, `$SC/chair-tools/chair-commit.sh`, and §931.3/§931.5)

The consist: `$SC/laneCONSIST-932`, cut at `a5876c0ea` (= `claude/composite-r4`, the build slot), LT37's eight cars already composed (`compose-lt37.log`: 8 ok, one `ok*` on the lighting census, three-way check OK on 8 of 9 with the census `head==theirs: yes`, trailers 8/8, porcelain 0). Docks: `sh $SC/mkdock.sh <name> a5876c0ea` (symlinked `node_modules`, never materialised — a real copy reads a false red against the first-paint budget). The docks cut at `f73bdbf16` (LT38) stay there and are cherry-picked, never rebased.

| Step | Command / act | Guard |
|---|---|---|
| 0. Dock verification (the §931 lesson: the lanes' gates are blind) | in the dock: `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/testRatchet.test.js` (the PLAIN ratchet test) · `tests/property` · `tests/edgeFunctions` · `tests/security` · `check:quick` · `npm run build && npm run verify:dist`; `$SC/chair-verify.py <dock> <base> <log> <cars>` on the lane's gate log | any red → the lane, not the compose |
| 1. HOLD | `touch $SC/HOLD-VITEST` ONLY for the ratchet and gate WINDOWS (LT38's process note); every lane sleeps 60 s and re-checks before any vitest/npm/build | remove right after each window |
| 2. Compose | `sh $MY/c931/c932/compose-and-trail-932.sh <dock-name> <the dock's cut sha>` — runs `$P/c930/compose.sh $C f73bdbf16 <dock>` (cherry-pick in order; skip already-applied by patch-id; on a conflict confined to `tests/lint/.lighting-census-baseline.json` or `scripts/mutation-coverage-manifest.json` take THEIRS and continue — both re-frozen at the register step; any other conflict ABORTS the car), then the Seat/Lane trailer rewrite (`git filter-branch --msg-filter python3 $MY/seat-msg-filter.py` over the new cars: `Seat: Opus 5 — Fable-unvalidated` + `Lane: LT<n>` inserted above `Co-Authored-By`; `SEAT_DEFAULT_LANE` from the dock name), then `%T %ai %ci` listed before and after (`trees+dates identical: YES`), then the three-way byte check | ⚠ `compose.sh`'s BASE argument is `f73bdbf16`; for a dock cut at `a5876c0ea` pass `a5876c0ea` (the script's `git rev-list BASE..TIP` enumerates the cars) — a §932 copy of the script must take the base per dock. The seat census line must read `N 1` (every car exactly one trailer) |
| 3. Three-way byte check | for every file in `git diff --name-only <base> <tip>`: `git merge-file -p <ours=consist-before> <base=the dock's cut point> <theirs=the dock tip>` compared to the committed copy; `OK` or `DIFF … head==theirs: yes/no` | every DIFF is either the two regenerated registers (expected) or a LOST HUNK / half-carried mechanism (§931.3: the OURS rule dropped LT28's test half; the THEIRS take of `testRatchet.test.js` dropped LT41 car 2's `WALKER_ROWS_OWED` and LT29's `budgetSource` pins) → a chair repair car re-derived per file |
| 4. Fast gate + negative control | the touched suites at the composed tip, and the negative control at the pre-fix tip in a throwaway worktree | BEFORE the register step |
| 5. Register pass | `sh $MY/c931/registers-931.sh` (→ `$P/c930/run-registers-930.sh` + the wiring census `--dry` and walker), every door under the mutex, in this order: 1 lighting REFREEZE on the composed tree (`LIGHTING_CENSUS_REFREEZE='§932 … (Fable 5.1 — validated)'`) · 1b OSR read-only (`check-observed-shape-readers.mjs`, predicted exact) · 2 mounts door (`UPDATE_MOUNT_BASELINE=1 … dossierMountRegistry.walker`) · 3 mutation manifest PLAIN · 4 writer-reach dry THEN `--write` (⚠ read the script BODY — the §931 header promised the write and the body ran the dry) · 5 tuning PLAIN · 6 prose-numerics PLAIN · 7 test-ratchet PLAIN · 8 wiring census `--dry` CURRENT | ⛔ every register a lane re-froze in its DOCK carries the dock's sha (`measuredAtSha`/`frozenAtSha`); `chair-verify.py` requires each moved register's stamp to be an ANCESTOR OF THE CONSIST TIP and NOT of the base — so every moved register is RE-STAMPED at the consist tip (lighting refreeze, `check-writer-reach.mjs --write`, the ratchet `--update`) BEFORE the totals car. Commit the register car by hand: `Seat: Fable 5.1 — validated`, NO `Lane:` (a chair act) |
| 6. The ratchet under the quiet law | `PREDICTED='totalFiles <n> entries <m>' nohup sh $MY/c931/run-ratchet-931.sh > $MY/c932/ratchet-932.run.log` (re-pointed at `laneCONSIST-932`): three probes a minute apart with load < 4.0 and zero `[v]itest/dist/workers`, give-up at 5,400 s; then `check-test-ratchet.mjs --update`; the last line is `exit $TRUE_EXIT` | `totalFiles` and `entries` PREDICTED in writing (the nine new test files; `entries` = 1, the golden master); `totalTests` REFUSED as a prediction — the run is its derivation. A REFUSAL (`update REFUSED`, the nine rows at §931 run 1) → every red reproduced ALONE before it is named |
| 7. Totals + capsule + seal | `sh $MY/c931/after-ratchet-931.sh <expected-totalFiles> <expected-entries>` → `commit-totals.sh` (guards: TRUE_EXIT 0 from the LOG; no sentinel/refusal; `RATCHET_HEAD` == HEAD; `measuredAtSha` == HEAD; porcelain exactly the baseline; the predicted figures) → the capsule car (`base-state-capsule.mjs --runtime-tests=<totalTests from the committed baseline>`; porcelain exactly `docs/implementation/BASE_STATE.json`) → `git update-ref refs/preserve/<seal> HEAD` | re-point the script's `D`, `LOG`, `BASE=a5876c0ea…`, `SEAL=…-2026-09-1x` |
| 8. The gate | `EXPECT_CARS=<n> nohup sh $P/c930/run-gate-930.sh > $MY/c932/gate-932.log` (re-pointed: `D=laneCONSIST-932`, `BASE=a5876c0ea`): refuses unless `claude/composite-r4` == BASE and HEAD descends from it; quiet law (give-up 3,600 s); `GATE_HEAD`, `GATE_CARS`, `GATE_START/END`, `npm run check`, `TRUE_EXIT`, porcelain post | a STRICT DIST red on the worker → bisect by build-and-measure (`$MY/c931/worker-measure.sh` as a `git bisect run` script, ~30 s a build) BEFORE touching anything; the mover was not the obvious suspect at §931 |
| 9. Chair-verify | `python3 $SC/chair-verify.py <consist> <base> <gate-log> <cars>` (never through a shell loop — zsh no-split) — TRUE_EXIT from the LOG; no sentinel; porcelain 0; base an ancestor; car count; every car single-parent; exactly one strict Seat trailer per car; a Fable car carries no `Lane:`; each moved register's stamp INSIDE the consist; `totalTests` == the gate line | `CHAIR-VERIFY GREEN` (§931: 13 PASS · 1 SKIP · 0 FAIL) |
| 10. CAS | `sh $MY/c931/after-cas-931.sh <n>` (re-pointed): re-reads the guards, `update-ref refs/heads/claude/composite-r4 <new> <base>` (compare-and-swap on the OLD base), `refs/preserve/landing-<name>-<date>`, writes `cas-<n>.sha` | the product tip moves only here; nothing pushes |
| 11. The ledger act | the docs regenerated from `git show HEAD:docs/<f>` into `$MY/c932/ledger/`, `finish-932.py` fills the placeholders from the gate log and chair-verify output, `collect-932.sh <cas-sha>` proves pure appends (ODQ, FRQ, the sitting), C0 scan 0, no unfilled placeholder, then `SP=$MY sh $SC/chair-tools/chair-commit.sh --require-ref landing-<name> <cas-sha> <ledger-tip> <msg> <maps…>` (the private index; the Seat gate; the enrolment gate; the append-only PREFIX gate; the subject-anchor gate) | `rm $SC/HOLD-VITEST` only AFTER the ledger act |

Two §932-specific notes. (a) LT17 car 2 rides lane A0's headroom car (cherry-picked from `refs/preserve/consist-931-with-lt17car2-2026-09-15`, subject `LT17 car 2 (CH-6b car 1 / J-TECH2-10)`), never composed alone. (b) The declared-shift lane A composes LAST in its landing so its fence re-record and witness re-record see every other lane's bytes (residue zero is measured against the composed tree, `espionageDormancyFence.test.js:91-94`).

---

## 7. THE SERIALIZATION TABLE

### 7.1 Shared surfaces and the lanes that meet them (files CONFIRMED at the consist; lane assignments from PRICING §B/§C and the §932 dispatches)

| Shared surface | Lanes that touch it | Rule |
|---|---|---|
| `simulationRules.js` (register + `SIM_LIT`) · `subsystemRowsVirtual.test.js` · `contributionLedgerShape.test.js` · `coveringArrayCoverage.test.js` · the two edge bundles + metas | EVERY flag-minting lane; lane B (lights `treasuryEnabled`, the three W-SEAT keys, the four W-OPS doors, `characterDriftEnabled`, `markovNamingEnabled`) | parallel-safe ONLY because the mint is the LAST car, rebased at landing, counts re-measured at the consist (§5.2); the chair resolves the conflict by measurement |
| `tests/lint/.lighting-census-baseline.json` · `scripts/mutation-coverage-manifest.json` | every lane | THEIRS at compose, re-frozen at the register step — never a serialization reason |
| `peaceTerms.js` 797/800 · `peaceTermsCatalog.js` · `treatyEnforcement.js` · `pactFormation.js` | TR-5 (two rows + five executors + `tradeDemandTrigger`) → WF-6 (four idle grant readers, `tolerance_guarantee` seam) → POP-5b (`migrationRightFor` reader) → GR-5 (renewal) | SERIAL in that order (A.4.3; the T9 STOP on `peaceTerms*.js`); WF-6 boards when TR-5's catalog car has landed on the consist |
| `applyWorldPulse.js` 907/907 | TR-4 car 0 (CR-2 consolidation) first; anything else after | SERIAL: TR-4 car 0 before any other writer |
| `src/domain/spatial/commodityFlow.js` · `supplyKernel.js` · `foodImportRates.js` / `goodsCatalog.js` / `tradeGoodsData.js` (WORKER-GRAPH tripwires: read, never edit) | TR-4 (grain road) → WY-3 (smuggle carry-through) → TR-6 (writer-family census) → WY-6 (seizure) | SERIAL TR-4 → WY-3 → {TR-6, WY-6} |
| `roadsKernel.js` 838/838 · `distanceRead.js` · `namedPersonTransit.js` | WY-3 (extraction car first) → WY-5 → WY-8a; LG-0/LG-1 (`distanceRead.js:789-822` the circle relay), LG-7 | SERIAL within WY; LG-0/1 may run beside WY-0/1 (surface + `modeSpeeds.js`) but not beside WY-3 |
| `pulseKernel.js` 1581/1581 | GR-4 (mount ruling) · GR-6 · any wave needing a NEW pulse call site | ONE lane at a time; extraction car first |
| `src/domain/spatial/migration.js` (`DEMOGRAPHIC_/MILITARY_/COLUMN_CLASSES`) · `demographicsMigration.js` · `demographicsLadder.js` · `migrationKernel.js` | POP-1 → POP-3 → POP-5a → POP-5b → WY-4 (population cargo) | SERIAL (columnOf composes by order); WY-4 after POP-1 AND WY-3 |
| `beliefMap.js` 781/800 · `beliefAxisSubjects.js` · `beliefAxes.js` | TR-3 (net-zero) · HB-6 · HB-7 · IN-2 (axis fields) | SERIAL TR-3 → HB-6 → HB-7; IN-2 not beside any of them |
| `brokerageServicesPlant.js` · `brokerageServices.js` · `informationStatecraft.js` 781/800 | IN-2 ∥ IN-3 | SERIAL (PRICING lane 37 → 38); IN-4 may run beside IN-2 (different files: `routeNetworkConsumersRace.js`, `covertErrand.js`) |
| `envoyErrandVocabulary.js` (`ERRAND_CONSUMERS` rows; reserved at `:315-355`) · `errandMint.js` · `espionageGate.js` | lane B (W-OPS wiring B, the errand mint site; wiring A, the doors) → IN-4 (`covertErrand.js`) → WF-2 (two rows) → TR-8 (`factorErrand.js`) → ES-6b/ES-7 | SERIAL by that order; each adds one row; lane B first because it re-charters the espionage chain arm |
| `heraldRouting.js` / `heraldFeed.js` / `HeraldCommandBody.jsx` 586/600 (`HERALD_SECTIONS` frozen six) | lane B (W-OPS wiring A desk registration) → IN-5 (the seventh section) → ES-7 / WF-4 / INT-8 (kinds on existing desks; each kind's WALKER FILE is its own file — parallel-safe) | the section list is SERIAL (B → IN-5); kinds may land beside each other |
| `treasury.js` · `treasuryConservation.walker.test.js` · `warCosts.js` | lane B (W-COIN-4, SEAT-8 `civilContests`) → WF-7 (tithe / `templeWealth`) → WC-1 (levy) | SERIAL lane B → WF-7 → WC-1 |
| `religiousContest.js` 493 · `religionState.js` · `deityStance.js` · `faithNews.js` | WF-0 → WF-3 → WF-2 → WF-4 → WF-5 → WF-7 → WF-8 → WF-9 | ONE WF lane at a time (they chain) |
| `settlementStrategy.js` 760/800 · `strategyMoves.js` (HB-1's registry, 42 rows, CHECK-GIT-FIRST) | HB-1 → HB-5; SEAT-2a §H / SEAT-4 (post-programme) | SERIAL; HB-6 (`beliefMap`) may run beside HB-1 |
| `WorldMap.jsx` 599/600 · `mapSlice.js` (`DEFAULT_LAYERS`) · `WarFaithMapOverlay` · `WorldMapToolbar.jsx` 590/600 | WY-0 → WY-7 → WY-9/WY-10; EP-4 s2 (A3+H7); DESK rows | SERIAL on `WorldMap.jsx`; extraction (a layer-manifest leaf) in WY-0 car 1 |
| `stressorsCore.js` (EAGER) · `rulingPower.js` (EAGER) · `rulingPowerCoup.js` (lazy) | INT-3a · INT-7 · lane B (SEAT-8 reads `rulingPowerCoup.js`) | INT-3a waits for the closure-headroom act (§4.2); INT-4 ∥ INT-5 is the only sanctioned INT parallelism |
| the generator graph / the worker bundle (`generationContext.js`, `economicState.js` 791/800, `priorityHelpers.js`, `ornament/pools.js`) | lane A0 first; then LT17 car 2 (A), EP §7a row 3 (H5), VAR-1b/VAR-2 (A's window), W-ARMS cars 1–3, TR-3/TR-6's generator price side | ONE generator lane at a time on the worker budget: two lanes each green alone can be red composed — every generator car reports its worker bytes; the chair sums before the compose |
| the first-paint closure (795 B) | WY-0 (~20 B) · WY-9 · INT-3a (0.6–1.2 KB) · INT-7 · POP-6 (`settlementRumors.js` is eager) · every lit key (~30–60 B, PLAUSIBLE) | a running ledger of the margin kept by the chair per landing; lane A0b (closure headroom) before INT-3a and before the twentieth key |
| `couplingRegistry*.js` (58 rows; `couplingRegistryInterior.js` to be minted by INT-1) · SC-6 `causedBy` walker | POP-1 (three CW-0 rows + SC-6 causedBy) · INT-1 · CW-1 (lane 13) · every FP writer wave adopting `causedBy` | append-only per family leaf; the SC-6 walker (lane 13's first car) may land beside anything |
| `docs/A_PLUS_ROADMAP.md` · `docs/implementation/INDEX.md` · `docs/GOLDEN_SHIFT_LEDGER.md` (dock copies) | every lane | append-only; the chair merges by hand at the compose |
| `supabase/functions/scribe-render` · `src/domain/prose/scribe*.js` · migrations 201–203 (written, never applied) | lane E only | E after A0 (its worker sat at zero headroom); E not beside A (both touch the prose desks) |

### 7.2 Who may run together (four build lanes at a time; research exempt)

| Board | Together | Why safe |
|---|---|---|
| NOW (per PLAN-932 and the owner's 16:5x order) | A0 (worker headroom) · B (#34 remainder) · D (Q10 prefix, one car under `tests/lint`) · E (Scribe re-cut) — LT38 stops at its next clean commit | disjoint files; B and E both add worker bytes only if they touch the generator graph (neither should); every src car of B waits for A0 before adding worker bytes |
| #32 first four (PRICING §C lanes 1–4) | TR-4 · TR-5 · POP-1 · WY-0 → WY-1 | disjoint except the flag-mint surfaces (last car) and the two regenerated registers; the four mint cars are composed in landing order and re-measured |
| as those land | WF-6 (after TR-5's catalog car) · IN-4 (after lane B's wiring cars, on `envoyErrandVocabulary.js`) · TR-1 mount → TR-3 · TR-6 (after TR-3 and after TR-4 on `commodityFlow.js`) | the serial edges above |
| the critical path | ES-6b ∥ IN-5 (cars 1–3) → ES-7 (a+b) after IN-5 and lane B's W-OPS wiring A → ES-7 (c+d) → SC-6 walker → CW-1 → CW-2x → CW-3 | ES-7 never beside lane B or IN-4 (`espionageGate.js`, the errand rows) |
| by family after | WF (one at a time) · POP-3/4 → 5a → 5b → 7 → 2 → 6 · WY-2 ∥ WY-3 → 4/5/6 → 8a → 7 → 8b/9/10/11 · INT-1 → 2 → 3a → (4 ∥ 5) → 6 → 7 → 8 · HB-1/2 ∥ HB-6 → HB-3 → 4 → 5 → 7 → 8 → 9 · GR-4 (mount ruling) → GR-5 → GR-6 → GR-7 · EP-4 s1 → s2 → s3 → §7a · WC-1 … WC-9 → (after WY-8a) WC-10 … 16 · LG-0 → LG-1 → LG-2 (after D) · W-ARMS (after A0; PLAUSIBLE output-moving → A's window) | a family lane may board beside another family's lane whenever §7.1 lists no shared surface between them; the chair checks the table at dispatch |
| the declared window | A (LT41b car 6 + LT17's five + the shift ledger entry) | composes LAST in its landing (§6 note b); never beside E |

### 7.3 Three rules that hold across every row

1. **A lane declares its shared files in its brief's header** (the exact paths, with the slack of each ceilinged file at the dock's cut); the chair refuses to board a second lane on a listed file until the first's car on it is on the consist.
2. **Two lanes that both mint a flag do not both mint in the same week without the chair knowing the composition order** — the second lane's mint car is rebased at the landing and its numbers re-measured; the second lane never inherits the first's count from a brief.
3. **A lane that meets a red it did not cause (a moved driven golden, a foreign fence, a worker byte it did not add) STOPS and reports the mover**; the chair bisects at the consist (`worker-measure.sh` for bytes; a settling experiment for a golden). Nothing is re-recorded outside the landing's declared window, and nothing is ever raised.

---

*Every line number above is a point-in-time reading at the consist tip `315080928` (= `a5876c0ea` + LT37) and rots; a brief re-measures by symbol at charter. The two measurement scripts beside this file (`eff-lines.mjs`, `near-ceiling.mjs`) take a dock path and print the same figures eslint's enforcer would; `odq-3b506360f.md` and `handoff-3b506360f.md` beside it are the ledger HEAD's §931 text and handoff, extracted read-only for the family architects.*
