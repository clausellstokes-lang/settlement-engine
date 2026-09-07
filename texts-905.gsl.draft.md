# GOLDEN SHIFT LEDGER — LIGHTING POSITION 5 "L-PROBE-2 AND THE ELEVEN DECLARATIONS" (§905, 2026-09-06; SEAT: Fable 5.1 — validated)

## HEADLINE RESULT — the whole lighting wave moved the same-seed world of ONE preset, at ONE landing, and nothing else engine-side

The lit-arm battery (`lprobe/run.sh`, the L-PROBE kit, sealed `refs/preserve/lprobe-kit-2026-09-05` + the L-OVERLAY rewiring) was run by
the chair at EVERY landing tip from the §899 control to the §904 tip — `38474a59e` (§899, the control) → `04bb92d19` (§900, the desk
consist) → `b0cbc67a1` (§901, the 25 dark lighting cars) → `fd36f0298` (§902, OSR rung 18) → `dd5f13218` (§903, the lit default) →
`6582958ce` (§904, L-UI-MAT) — with zero bytes written into any tree (porcelain 0 before and after every run; every child exit captured
in `TRUE_EXITS*.txt`). Across the six tips the ONLY engine-side same-seed movement is at `fd36f0298 → dd5f13218`, the lit default
(LGT-C2-DEFAULT hunk 1, car `432ff6441`), on `realistic_regional` alone:

| instrument | before (fd36f0298) | after (dd5f13218) | reading |
|---|---|---|---|
| (f) REAL-birth fixture hash | `46919e4d4c53331b…` | `5cf7363c659cfad0…` | = the witness's `rulesSha256` pair recorded by the L-DEFAULT lane — two instruments agree byte-for-byte |
| (f) resolved rule keys | 37 | 58 | +21, exactly the lit keys; no shared key changed value; 13 dark booleans unmoved |
| (f) lit / dark booleans | 12 / 13 | 33 / 13 | +21 lit, nothing darkened |
| (g) `resultHash` (52 ticks × 4 settlements) | `9fc2188ffca6d399…` | `5b68e28d366de391…` | moved |
| (g) `worldStateHash` | `2e13f2d95ad187b2…` | `13876c49db2ea2bd…` | moved |
| (g) `regionalGraphHash` | `d520836e5473224d…` | `45634ad38ab7dc52…` | moved (the probe's graph is built through `ensureRegionalGraph` over the four generated settlements and their pulse; the witness's hand-built realm did not move — different fixture, not a contradiction) |
| (g) `wizardNewsHash` | `e9852ae86b5ddfd7…` | `97bee8e6f52ed5e1…` | moved |
| (g) `observedTicks` / `epochLit` | 52 / false | 52 / false | unmoved — the epoch key is NOT lit |
| (e) `WAVE_DARK_PRESET_IDS` | quiet_local, realistic_regional, static_campaign, narrative_campaign | quiet_local, static_campaign, narrative_campaign | `realistic_regional` leaves the dark roster; every other roster unmoved |

The six other presets — `dramatic_campaign`, `full_simulation`, `living_realm`, `narrative_campaign`, `quiet_local`, `static_campaign` —
are byte-identical in (f) and (g) at all six tips (every `resultHash` constant across the wave). `defaultRuleKeyCount` is 36 at every tip:
`DEFAULT_SIMULATION_RULES` did not move and identity held, as the lane proved three ways at §903.

## The control, and why it was re-measured rather than quoted

The §899 dark-arm outputs (`lprobe-out-899/`, `lprobe-out-899-full/`) died with the 2026-09-05 19:12 reboot of the old scratchpad; no
`refs/preserve/*` tree ever carried them (verified over every preserve ref). The battery is deterministic on a committed sha: the §904 tip
measured twice (the cheap pass at 21:22 and the full pass at 21:24) produced IDENTICAL digests for all six cheap instruments. The control
was therefore re-derived at `38474a59e` in a fresh symlink-dock (`laneLPROBEBASE`), and — because it costs thirty seconds a tip — at every
landing tip between, so each landing's movement is attributed to the landing that caused it instead of lumped into "the wave".

## The per-landing attribution (the cheap arm: STOP-eager, (c) (d) (e) (f) (g))

| step | (g) pulse hashes | (f) birth fixtures | (e) rosters | (d) lighting census, live tuple | (c) OSR per-parent presence | eager |
|---|---|---|---|---|---|---|
| §899 → §900 (the desk consist, 111 cars) | — | — | — | 2523/371/2152/23204/6217 → 2537/373/2164/23555/6302 | parents 8558 → 8560; `simulationFlagsLit` 80 → 81; key-sets grew on 9 shapes (`_config` +stressTypes · `factions` +captureState,modifiers · `incomeSources` +isCriminal · `issues` +message,priorityNote · `members`/`npcs` +stressNote · `simulationRules` +irregularForceEnabled · `stress`/`stressors` +forcedByConfig,source); 0 shapes crossed MIN_ROWS — the desk's, registered at rung 18 (§902), NOT lighting | LAZY (closure 237 → 235 modules) |
| §900 → §901 (25 lighting cars, all dark) | — | — | — | → 2543/373/2170/23653/6333 (the register car of §901) | — | LAZY |
| §901 → §902 (OSR rung 18, 8 cars) | — | — | — | — | — | LAZY |
| §902 → §903 (the lit default, 9 cars) | `realistic_regional`: all four fields | `realistic_regional`: +21 keys, hash moved | `WAVE_DARK_PRESET_IDS` 4 → 3 | — | — | LAZY |
| §903 → §904 (L-UI-MAT, 6 cars) | — | — | — | — | — | LAZY |

"—" is a measured byte-identity (same digest / same hashes on both sides), not an absence of measurement. **The dark-inert claim of the
§901 consist is CONFIRMED by measurement, not by argument: twenty-five cars, five engine instruments, zero movement.** The display flips of
§904 (`warEconomySurfacing`, `handbookVoice`) and the `mobileSingleChrome` retirement moved nothing engine-side.

## The full arm at the §904 tip, against the §899 control

- **(a) `generatorGoldenMaster`:** 2 passed / 1 failed. The failing arm is "every config produces byte-identical output to the golden
  master" — `expected [ …(525) ] to deeply equal []`: 525 of 525 rows, i.e. the BANKED §898 row (the prose consist's declared text shift;
  the fixture has not been re-recorded since — the freeze register is unfrozen and the door is the only lawful re-recorder). NOT a lighting
  movement: the L-DEFAULT lane measured 525 at `fd36f0298` and 525 with its hunk, and this battery measures 525 at `6582958ce`.
- **(a) the bit-level dormancy arm** (`scripts/dormancy-bit-compare.mjs --arm generation`, the DORMANT default configuration through the
  real generation pipeline): tip 600/600 rows, `distinctStable` 600/600; base `38474a59e` 600/600; `diff base.tsv tip.tsv` EMPTY — **the
  generation arm is bit-identical across the entire wave.** UNFLOORED: no `generation-corpus-golden` row exists in the (unfrozen) freeze
  register, so 600/600 is measured, not asserted.
- **(b) certification, seven presets through `--preset` (5 years × 4 settlements, `--seed lprobe-<id>`):** seam HOLDS 7/7 (composed
  `fullRules` == the real birth's resolved rules, keys + values + order, and the normalizer is a fixed point on every table); every soak,
  read-back and certify exit 0; wall 7–47 s. At the tip, `realistic_regional`: ALIVE 19 / DORMANT_BY_CONFIG 13 / SILENT 7 / UNOBSERVED 52 of
  91 rows. Bracketing the lit default: ALIVE 8 / DORMANT_BY_CONFIG 13 / SILENT 3 / UNOBSERVED 67 of 91 at `fd36f0298` → ALIVE 19 / DORMANT_BY_CONFIG 13 / SILENT 7 / UNOBSERVED 52 of 91 — the twenty-one lit rules move from `ruleState: unknown` to `on`: eleven ALIVE (`commodityFlow`, `constructiveFlows`, `npcGrowth`, `npcLadder`, `provenanceLedger`, `resourceDynamics`, `roads`, `settlementLifecycle`, `traditions`, `upswingArcs`, `urbanFabric`), four SILENT (`momentum`, `naval`, `peaceEngine`, `supplyWebWarfare` — lit, instrumented, no channel fired in five years), six still UNOBSERVED though on (`allyIntelSharing`, `disasters`, `distancePricedNews`, `intervention`, `reframe`, `spatialConsequence` — no instrumented channel in the five-year soak); DORMANT_BY_CONFIG unchanged at 13; the six other presets byte-identical in every verdict at all three tips; and `dd5f13218 → 6582958ce` moves NO verdict on any preset at `dd5f13218`. (The L-OVERLAY receipt's 09-05
  figure at the §899 tip was 8 / 13 / 3 / 62 of 86 rows; the roster grew 86 → 91 between §899 and §904 — measured by importing `SUBSYSTEM_CERTIFICATION_REGISTRY` at each tip: 86 at `38474a59e` → 87 at `04bb92d19` (+`irregularForceEnabled`, the desk consist) → 91 at `b0cbc67a1` (+`envoyTaskCatalogEnabled`, `infiltrationDepthEnabled`, `missionDispatcherEnabled`, `operationsVoiceEnabled` — the four W-OPS rows of L-HOMES car P5-WOPS, dark) → 91 unchanged through `6582958ce`; nothing removed.)
- **(h) the class-C hashed-chunk listing diff, `38474a59e` → `6582958ce`** (both built in scratch from `git archive`, never in a dock;
  `CLOSURE_BUDGET_BYTES` 1,048,000 read from `tests/build/vendorPdfLazy.test.js:565` at run time): entry static closure 1,047,133 B
  (margin 867) → 1,042,086 B (margin 5,914); **delta −5,047 B against an allowance of 767 B — verdict CLEAR, no STOP.** The eight-chunk
  closure is the same eight chunks; `index` 576,190 → 570,269 (−5,921), `engine-core` 125,400 → 126,452 (+1,052), `kernel` 10,675 → 10,457,
  `data` 114,825 → 114,865; `content-identity`, `vendor-icons`, `vendor-react`, `vendor-state` byte-identical. Outside the closure the
  bundle gained 20 LAZY chunks (`WarFaithDesk`, `anonGenCounter`, `beliefAxes`, `custom-charset`, `defenseStateProse`,
  `densityCreateBoundary`, `economyDeskRead`, `faithPanelModel`, `generalDeskRead`, `generation.worker`, `generationRequest`,
  `heraldCausalGrammar`, `labelBands`, `magicWorksAt`, `settlementGenerateAction`, `treatyOrientation`, `trendLens`,
  `warConvergenceContract`, `warEndingClassifier`, `warRemembrance`), lost none, +1,724,339 B of lazy asset bytes across the wave — none of
  it in first paint.
- **STOP arm 1 (eager):** the preset catalog is LAZY at every tip (`simulationRules.js` absent from the entry's static closure).

## THE ELEVEN DECLARATIONS — RECONSTRUCTED, AND SAID SO

⚠ LABEL: the docket's enumeration behind `LGT-REG-DECL (11 declarations)` died with `LIGHTING-INVENTORY.md` (LIGHT-PLAN §0) and no
survivor reproduces it; the plan names cause (0) for prose and causes (i)–(vi) and (xi) for the preset table and leaves (vii)–(x) unnamed.
This record therefore declares by MEASURED CAUSE, carries the plan's labels where they exist, and says NOT DUE where the hunk that would
cause the shift was refused or is owner-gated. Nothing below is written from expectation; every figure is quoted from `lprobe-out-905/`
(sealed in the kit ref) and the tables above.

| # | cause (plan label) | landing | declaration |
|---|---|---|---|
| 1 | (0) PROSE — the src/ prose car | §898 | Declared in this ledger at §898 ("1,001 reader sentences … no rules value, no preset and no flag moved"). The control was taken AFTER prose, so none of its text movement is attributed to lighting. |
| 2 | (i) THE WORLD-ALIVE STACK — class C, the nine `ENGINE_WAVE_FLAGS` (`momentum`, `naval`, `intervention`, `settlementLifecycle`, `peaceEngine`, `supplyWebWarfare`, `upswingArcs`, `resourceDynamics`, `constructiveFlows`) | §903 | **DECLARED.** Lit on `realistic_regional` (absent → true): the birth hash and all four 52-tick pulse hashes moved; the six other presets did not. |
| 3 | the ONE-REGEN nine — class D (`distancePricedNews`, `reframe`, `provenanceLedger`, `urbanFabric`, `npcGrowth`, `spatialConsequence`, `npcLadder`, `traditions`, `roads`); the plan folds C and D into hunk 1 | §903 | **DECLARED**, the same measurement (the two classes ride one hunk and one hash; they cannot be separated after the fact — a per-class hash would need a per-class car). |
| 4 | the three opt-ins — `disastersEnabled`, `commodityFlowEnabled`, `allyIntelSharingEnabled` | §903 | **DECLARED**, the same measurement. |
| 5 | (ii) war / faith / seasons — class B into the lit SUCCESSORS (hunk 3) | — | **NOT DUE**: refused with measurement at §903, gated on the owner's successor id (hunk 2). `WAR_DEPTH_FLAGS` lit counts unmoved at every tip. |
| 6 | (iii) the belief stack wakes — `infoMode: 'perfect_delayed'` (hunk 4) | — | **NOT DUE**: an owner row since §903. `infoMode` unchanged on every fixture at every tip. |
| 7 | (iv) "the ceiling's eleven" | — | **CARRIED, NOT MEASURABLE HERE**: the plan's label survives without its text; no battery instrument names it, and no unattributed movement remains for it to explain. Left as a label for the owner's walk, not silently dropped. |
| 8 | (v) the 29 → 30 manifest keys + the manifest split (P2-MANIFEST) | §901 | **DECLARED DARK**: a register act, not a same-seed surface; §900 → §901 moved no engine instrument. |
| 9 | (vi) the backlog seventeen (the engine-gated walker's bank) | §901 | **DECLARED DARK**: a walker bank, not a same-seed surface; no engine movement at §901. |
| 10 | (xi) the shipped default mints epochs — EP-1 half (b) | — | **NOT DUE**: `advanceEpochEnabled` is NOT lit; `epochLit` is false for every preset at every tip (measured in (g)); the 25-key re-key (half (a)) belongs to rung 20 with hunks 6–7, refused. |
| 11 | L-UI — `warEconomySurfacing`, `handbookVoice` | §904 | **DECLARED at §904 as display-only** (the dossier snapshots re-recorded by the lane, proven two ways); this battery adds the engine-side half: nothing moved `dd5f13218 → 6582958ce`. |
| + | the §901 consist itself (25 cars behind their doors) | §901 | **DECLARED DARK-INERT BY MEASUREMENT** — the claim every L-HOMES receipt made is now a measured fact, five instruments, zero movement. |

## Registers at POSITION 5 — every one derived, none moved

- **lighting census:** LIVE == FROZEN at every one of the six tips, including `6582958ce` (2543 / 373 / 2170 / 23653 / 6333) — no refreeze owed.
- **the OSR migration (rung 20):** belongs to L-DEFAULT hunks 6–7 (refused) — nothing owed; the OSR plain read is 1972 exact at §904.
- **the treasury `VIRTUAL_DORMANT_WRITERS` shrink (`--write`):** NOT owed. The fourth door's rows name `treasuryEnabled` (treasury on
  economicState) and `chanceEncountersEnabled` (fromSid / toSid / incidentType on grievance) — neither is among the twenty-one lit keys,
  and `assertVirtualDormantWriterEvidence` CONVICTS the whole scan if a named flag stops being virtual; the scan was green at §903 and §904.
- **test ratchet / totals:** no product car in this act — nothing moved (31970 / 2489 / 3).
- **the golden-freeze register:** still UNFROZEN (`frozenAt` null); per LIGHT-PLAN §4 (decay 14) this record + the §905 ledger row is the
  declaration form; no `GOLDEN_SHIFT_SIGNED` record is minted here because no fixture byte moved in this act.

## Conditions under which a FUTURE golden will legitimately shift (for the next session)

- Hunk 2 (the owner's lit successor preset id + label): the witness's `__birth_default__` row moves, and the plain `buildNewCampaign`
  birth path lights for the first time — a declaration of its own, with a new pulse hash for the successor.
- Hunks 3–7 (class B into the successors, `infoMode`, class E, F/G, the rung-20 re-key): each moves the successors' 52-tick hashes; each
  owes its own row here, quoted from a re-run of this battery at its tip (`sh $SC/lprobe/run.sh <dock> <out> --cheap` is thirty seconds).
- The golden master's 525 stays banked until the §898 re-record is signed through the door.
- A `generation-corpus-golden` row in the freeze register would turn the dormancy arm's 600/600 from measured into asserted.

## The DECLARED-SHIFT sentence owed to LGT-REG-DECL (the wave's one engine-side shift, verbatim)

> "The lighting wave's forty-eight cars — twenty-five dark at §901, eight at §902, nine at §903, six at §904 — moved the same-seed world of
> exactly one preset, `realistic_regional`, at exactly one landing, `dd5f13218`, by lighting twenty-one virtual keys (the nine WAVES, the
> nine ONE_REGEN, `disasters`, `commodityFlow`, `allyIntelSharing`): its birth hash and all four 52-tick pulse hashes moved; the six other
> presets, the generation arm (600 of 600 rows bit-identical from `38474a59e` to `6582958ce`), the OSR presence, the lighting census and
> the first-paint closure (−5,047 B, no STOP) did not move for lighting; no installed campaign is re-labelled; no tuning value moved."
