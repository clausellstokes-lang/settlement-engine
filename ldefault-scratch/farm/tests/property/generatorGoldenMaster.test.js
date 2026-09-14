/**
 * generatorGoldenMaster.test.js — characterization (golden-master) guard.
 *
 * The deep-determinism test proves same-seed reproducibility WITHIN a build.
 * This proves something different and complementary: that the generator output
 * does not change ACROSS builds for a fixed corpus of configs+seeds. It exists
 * to make behavior-preserving refactors (de-minifying the big generators,
 * decomposing slices) provably safe — a pure syntactic rewrite must keep every
 * hash identical; any logic drift flips a hash and fails CI.
 *
 * The committed manifest (tests/fixtures/generator-golden-master.json) maps
 * "tier|culture|terrainOverride|trade|threat|seed" → sha256(JSON.stringify(settlement)).
 * To regenerate after an INTENTIONAL output change, run:
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js
 * and review the diff before committing.
 *
 * ── SHIFT RECORD ────────────────────────────────────────────────────────────
 * A hash manifest cannot show WHY it moved, so every re-record is written down
 * here. Re-recording without adding a row is a deleted alarm.
 *
 * 2026-09-02 — T13 TRANS: THE CROSS-ENGINE TRANSCENDENTAL RETIREMENT (ODQ §883; the §879.11
 *   REC's declared-shift window). ZERO ROWS OF 525 MOVED IN THIS MANIFEST — it is NOT
 *   re-recorded, and this block is the trace that a re-record which never happened must
 *   leave. Sixteen cars landed on the TAIL-F tip `9a0584f0f`; thirty engine-approximated
 *   `Math` sites in generation code were retired onto the estate's own deterministic
 *   kernels, so a stored seed makes the same world on every JS engine. Measured at the
 *   COMPOSED landing tip, both arms, with the base arm reproducing C′'s recorded figures
 *   first: probe C `87e8b25c…f695` base AND tip; probe A′ `abe0a847…c4b7` base AND tip,
 *   600/600 rows byte-identical; this suite 3/3 at both arms; the independent 525-row
 *   census DRIFT_COUNT=0 with its poisoned-key negative control convicting exactly 1.
 *   ⛔ THE COMPARATORS WERE PROVEN ABLE TO SEE FIRST, and deterministically, per §882's D-4:
 *   ONE enumerable field planted on the object the pipeline returns moved probe C's sha to
 *   `78b3cbb7…` and EVERY ONE of probe A′'s 600 rows; the blob-verified restore returned
 *   both exactly. A threshold constant would have been the weak control D-4 forbids.
 *
 *   ROW (ii) — exp/logistic → detExp (`c17345595`, seven sites): 0 of 525. Worst-case
 *   kernel error 2.21e-16. Totality control: the 525 key set identical; poisoned-key
 *   negative control drifted exactly 1. DISCRETE FLIPS IN THIS MANIFEST: none.
 *
 *   ROW (iii) — log/log10 → detLn/detLog10 (`da8cd72fb`, seven sites): 0 of 525 here.
 *   detLn 4.32e-16, detLog10 2.22e-16. ⭐ THE NAMED WEAKNESS THIS ROW CARRIED IS NOW
 *   DISCHARGED, AND NOT IN THE DIRECTION ANYONE EXPECTED. The pre-board wrote: "measured
 *   together with (ii), no single-variable revert control was run because there was no
 *   movement to attribute — if movement ever appears here, attribution is UNPROVEN and
 *   revert controls are owed FIRST." Movement DID appear at the composed tip, in the
 *   momentum dormancy golden (see the row below), the revert controls WERE owed and WERE
 *   run, and they landed on THIS family: `attrition.js`'s `relativeStrengthTilt()`, whose
 *   log-ratio `Math.log(a / d)` became `detLn(a / d)`. The weakness was real, the debt was
 *   paid at the moment it came due, and the family that carried it is the family that moved.
 *
 *   ROW (iv)+(v)+(vi) — tanh, fractional pow, integer pow (`83a806a38` · `821be1e01` ·
 *   `5eb02872d`): 0 of 525 on eight golden instruments plus the independent 525-row probe
 *   and the negative control. (vi) is exact by construction (integer exponents become
 *   multiplies); (v)'s fractional powers carry 3.6e-14. The same measured-together
 *   weakness applied and the same revert ladder answered it: neither family returns the
 *   moved row. ⚠ NAMED, NOT COVERED OVER: `martialReadiness:239` and
 *   `populationDynamics:140` are declared-shift sites with NO consumer suite of their own
 *   and are covered only indirectly (CR-9); they are handed to the GOLDEN freeze.
 *
 *   ROW (i) — half-life → halfLifeKeep (`f95305812`, the ONE site the whole routed family
 *   flows through): 0 of 525, with the negative control convicting. The declared shift is
 *   measured in ULPs at the COMPOSED tip rather than cited from the dock: 686 of 8,988
 *   real-domain pairs differ by exactly ONE ULP (7.632 %); the largest relative difference
 *   is a single denormal, `5e-324 → 0` at age 3976 / halfLife 3.7, which is zero at every
 *   consumer; whole-period exactness k=0..40 is 41/41 for kernel AND platform; the seven
 *   edge cases are identical; the comparator can distinguish two different doubles. The
 *   shift is REAL in the kernel and does not reach this corpus.
 *
 *   BASELINE — Car 2a (`779592644`), proven identical, not merely unmoved: `stressors:297`
 *   literal fold (the frozen decimal's provenance recorded), `siteGenesis:376` x*x twice,
 *   `generosityEV:299` halving ladder — three BIT claims proven base-vs-tip on the real
 *   comparator, with the comparator's own control included.
 *
 *   BASELINE — Car 2b (`845fcfe38`): the four TRIG sites retired by CODE MOTION into
 *   `src/components/map/` — no kernel, no shift, and the no-move receipt to show it. The
 *   town map did not shift.
 *
 *   BASELINE — Car 3 (`bef11b0bd`): twelve hand-spelled half-life copies collapse onto one
 *   bare factor — 8,988 pairs, 0 bit mismatches, negative control can fail, re-measured at
 *   the composed tip. ⚠ THE MUTATION CONTROL CONVICTS 8 OF 13 SITES: the five module-private
 *   decay functions `dispositionLedger:468` · `npcGrowthKernel:260` · `npcLadderKernel:1038`
 *   · `npcLadderState:241` · `urbanFabricKernel:635` are an ESTATE coverage gap, named here
 *   rather than claimed away (CR-9).
 *
 *   BASELINE — Car P′ (`822c4f93a`): `strongerFirst` as the lexicographic
 *   (tier, min(pop, CAP)) ordering with the MEASURED crossing double
 *   2511886.43150957906619 (the `10^6.4` literal sits 7 ULPs above it). At the composed tip:
 *   15,071,406 integer comparisons, 3,000,000 random quadruples, cross-rank, above-cap and
 *   NaN arms → 0 divergences; the differential probe 2,449,965 cases → 0. ⚠ THE RESIDUAL,
 *   per §881.19's restatement: identical on every integer and reachable input, strictly
 *   finer on non-integer doubles within one part in 7e13 — 0 reversals, 0 coarser, 56,948
 *   old-tie→new-strict on adjacent doubles, and 0 integer-tie collapses of 2,511,885. A
 *   named comparator gap for the GOLDEN handover, not a STOP.
 *
 *   ⭐ THE ONE FLIPPED ROW IN THE WHOLE WINDOW, AND IT IS NOT IN THIS MANIFEST.
 *   `tests/property/momentumDormancyGolden.test.js` key `mo-b|8|one_month` — the
 *   marching-war world driven eight one-month ticks — moved under this consist:
 *   `76a3f0c3…` → `3ef86c32…`. Its siblings `mo-a` (4 ticks) and `mo-c` (6 weekly ticks)
 *   are byte-identical. GREEN at C′ and RED at the composed tip, so it is a MOVE and not a
 *   banked red; the base arm's 6/6 was taken as the totality control BEFORE anything was
 *   re-recorded. ATTRIBUTED BY SINGLE-VARIABLE REVERT in a throwaway copy of the tip:
 *   reverting `momentum.js` alone leaves it RED (so the suite's NAME is not its cause);
 *   reverting every T13 src edit turns it GREEN; re-applying only `src/domain/worldPulse/*`
 *   turns it RED; the family as of pick 7 is GREEN and as of pick 8 is RED; and advancing
 *   one file at a time from the pick-7 green convicts `attrition.js` alone, with
 *   `militaryStrength.js`, `occupation.js`, `relationshipMemory.js` and
 *   `relationshipRuleHelpers.js` each green. THE MOVER IS
 *   `src/domain/worldPulse/attrition.js` at `da8cd72fb` (Car 4 family (iii)), one line in
 *   `relativeStrengthTilt()`. Re-recorded ONCE inside this window by the suite's own capture
 *   path. This is the enumeration the REC signed for — "every flipped row is individually
 *   named" — and it is one row, named, not an empty list.
 *
 *   THE WINDOW'S CLOSING LINE. T13 TRANS opened and closed with ZERO of 525 CORPUS rows
 *   moved on every instrument at the composed landing tip: probe C and probe A′ identical
 *   at base and tip with deterministic controls that saw and returned; this suite 3/3 at
 *   both arms; the eight-golden battery green at both arms; `goldenViewModel` 4/4 (the paid
 *   surface unmoved); the espionage, mission, rider and faith fences unmoved; and the WHOLE
 *   `tests/property` golden/fence/dormancy family — 70 files enumerated by command, not
 *   curated — 535 tests green at BOTH arms. Exactly ONE dormancy-golden row was
 *   re-recorded, attributed above, and nothing else. THIS MANIFEST
 *   (`tests/fixtures/generator-golden-master.json`) is byte-identical, blob
 *   `b99a14d1aa949a60df93e3f74865947bdd0c87e1`, the same blob it carries at C′. The only
 *   cured sites the generator reaches at all are `corruption.js` and
 *   `canonicalRelationship.js` — re-derived at the composed tip, not assumed — and both
 *   proved bit-identical on integer inputs. The declared ~1e-14 shift is REAL in the
 *   kernels, measured per family, and invisible to this corpus, which is the result the
 *   kernel grade was chosen to buy.
 *
 * 2026-09-01 — THE ENGINE STOPS QUOTING A RULEBOOK (305 rows of 525 moved; 0 rows added,
 *   0 removed, 0 templates added or removed, 0 array-length moves). Lane TE-AGNOSTIC-1,
 *   cars `f2c1ad181` (car 3) and `97d119c9b` (car 4), landed at the ENGINE-HYGIENE consist.
 *   RULED: ODQ §857 chartered the setting-agnostic cure and both cars carry their own SHIFT
 *   RECORDS — in their commit messages and in docs/DESIGN_SETTING_AGNOSTIC.md (§ SHIFT RECORD
 *   1 and 2), which is WHY this row exists: the records were never in this header, so a
 *   re-record without adding here would have been the deleted alarm the law above names.
 *   ⚠ THIS IS A RE-RECORD ONTO A WORLD THE CARS NEVER SAW. T8 re-recorded the manifest twice
 *   after these cars were cut (§858, §860), so their carried fixtures (`e06025d9…`,
 *   `a68fa0de…`) were re-records of a dead context and were DROPPED at the pick; the landing
 *   regenerated ONCE at the coupled tip instead of merging two re-records.
 *   THE BASE-SIDE TOTALITY, AND IT IS THE LOAD-BEARING HALF: the boarding base `3f9201e39`
 *   was regenerated as OBJECTS from committed bytes in its own detached worktree and
 *   reproduced the committed manifest on ALL 525 ROWS — 0 mismatches, key set identical — so
 *   this consist is the ONLY source of the drift and nothing else had crept in. The
 *   re-recorded manifest then matched an INDEPENDENT census of the tip on all 525 rows, so
 *   the number below is corroborated by a second instrument rather than by itself.
 *   BY TIER, which reproduces car 3's own table to the digit: town 105/105 · city 84/84 ·
 *   metropolis 80/84 · village 36/84 · hamlet 0/84 · thorp 0/84. The two tiers that hold are
 *   the control: a thorp and a hamlet draw none of the cured institutions.
 *   THE COMPLETE PATH-TEMPLATE CENSUS IS TWELVE TEMPLATES, measured over whole settlements
 *   base-vs-tip with array indices collapsed:
 *     $.institutions[].desc                                407 changes / 220 rows
 *     $.economicState.activeChains[].outputs[]             312 changes / 156 rows
 *     $.economicViability.metrics.foodBalance.magicFoodNote 167 changes / 167 rows
 *     $.economicState.primaryExports[]                     118 changes / 118 rows
 *     $.defenseProfile.institutions.magicDef[].desc        113 changes / 113 rows
 *     $.economicState.activeChains[].magicNote              36 changes / 36 rows
 *     $.economicState.localProduction[]                     26 changes / 26 rows
 *     $.availableServices.magic[].desc                      12 changes / 12 rows
 *     $.relationships[].npc1Role · npc2Role · $.factions[].members[].role · $.npcs[].role
 *                                                            7 changes / 1 row
 *   ZERO templates added, ZERO removed, ZERO array-length moves.
 *   ⭐ AND THE RESIDUE IS ZERO AT THE STRING LEVEL, WHICH IS STRONGER THAN THE TEMPLATE
 *   COUNT: every changed leaf was enumerated as an old→new pair and there are exactly
 *   EIGHTEEN distinct substitutions, all of them cured rulebook tells — the level scale
 *   ("Spellcasting (1st-3rd level)" → "(minor)", 301 ×; "(1st-8th level)" → "(greater)",
 *   155 ×), the currency unit ("50 GP" → "50 in gold" and six siblings), the named spells
 *   ("Arcane Plant Growth" → "Arcane quickening of growth", "Zone of Truth enforcement" →
 *   "Play kept honest by compelled truth", "Conjure Animals" → "Conjured game"), the item
 *   plus ("+1 weapons" → "Warded weapons") and ONE role token
 *   ("Warlock/Pact-Bound" → "Warlock/Bargain-Sworn", car 5's loop-until-dry find, 7 ×).
 *   No third class exists, which is what the pre-board's acceptance test asked for: a
 *   substitution outside this list would have been a STOP.
 *   THE PROMISE. A stored settlement is never re-derived; only newly generated worlds get
 *   the un-quoted prose. Two worlds from one seed — one saved before this lands, one after —
 *   differ in exactly these eighteen strings and nothing else.
 *
 * 2026-08-31 — THE TRADES THAT WERE FILED AS GOVERNMENT (322 rows of 525 moved; 0 rows
 *   added, 0 removed, 0 templates added or removed, 0 array-length moves, 0 key-order moves).
 *   Lane T8. RULED: ODQ §759.5 docketed the defect and §773.1 moved the relabel OUT of the
 *   hygiene train and INTO this window precisely because it moves goldens; the chair approved
 *   the corrected denominator at §858.
 *   THE DEFECT WAS A LABEL, AND THE CHARTER'S COUNT OF IT WAS WRONG. §759.5 said "~26 craft
 *   trades filed `priorityCategory 'government'`". Enumerated at this base it is THIRTY, and
 *   the four-row gap matters because it proves the rows were never listed — so this lane
 *   listed them and dispositioned each one instead of relabelling a number.
 *   THE BOUNDARY IS THE CATALOG'S OWN, NOT THIS LANE'S INVENTION, which is what makes 27 of
 *   30 defensible and 3 of 30 refusals. `tests/data/priorityCategoryPlausibility.test.js`
 *   already ratified the three-way split when an earlier run was spot-fixed: Midwife → crafts
 *   (a maker), Village scribe → government (civic, DELIBERATELY), Wildfowler → economy
 *   (harvest). Applying that same rule:
 *     19 → `crafts`   makers working a material: Maltster · Sawmill · Tannery · Fuller · Dyer
 *                     · Potter · Brickmaker · Brewer · Cobbler · Tailor · Smelter · Sawmill
 *                     (commercial) · Brewery · Tanner (established) · Cobbler's guild ·
 *                     Tailor's guild · Chandler · Glassblower · Ropemaker
 *      8 → `economy`  extraction, husbandry, carriage and retail, matching the shelf's own
 *                     Stone quarry / Mine / Charcoal burner / Dairy farmer rows: Peat cutter ·
 *                     Mine (open cast) · Shepherd · Pack animal trader · Stable yard ·
 *                     Beekeeper · Fishmonger · Stable master
 *      3 KEPT         Mint (striking coin is sovereign) · Town crier (the settlement's own
 *                     voice) · Village scribe (keeper of record and custom). The divergence
 *                     is DATA, as `categoryGovernance`'s header says, and the existing pin on
 *                     Village scribe therefore passes unchanged rather than being edited.
 *   ⛔ `infrastructure` WAS FORBIDDEN AND THAT IS A FINDING, NOT A STYLE CHOICE: it is absent
 *   from `institutionProfile`'s INST_CATEGORY_TO_FACTION, so filing a stable yard there would
 *   have deleted it from the support web entirely — a silent capability loss dressed as a
 *   tidier taxonomy.
 *   THE COMPLETE PATH-TEMPLATE CENSUS IS ONE TEMPLATE, measured over whole settlements
 *   base-vs-tip:
 *     $.institutions[].priorityCategory            1643 changes / 322 rows
 *   ZERO other templates. No institution appears or disappears, no roster reorders, no
 *   faction, name, economy figure, trace row or rng draw moves anywhere — the relabel is a
 *   pure re-facing of an existing field, which is why 1643 changes touch exactly one path.
 *   ⭐ THE CONSEQUENCE IS REAL AND IT IS NOT IN THIS MANIFEST, so it is measured here rather
 *   than asserted from §759.5's wording. The label's live consumer is render-time
 *   (`display/institutionProfile.js`, `dossier/powerSupport.js`), and `crafts` and `economy`
 *   both map to the ECONOMY faction while `government` maps to the government one. Executed
 *   over all 17,361 institutions in the corpus, the backing faction moves on exactly 1,643 —
 *   the same count as the label changes, so the correspondence is 1:1 — across 322 of 525
 *   settlements. The largest single class is the one §759.5 was pointing at:
 *     493  null → Guild Council        240  null → Merchant Guilds       (no backer at all)
 *     251  Town Council → Merchant Guilds   109  City Council → Merchant Guilds
 *   ⭐ ROUGHLY EIGHT HUNDRED OF THE MOVES ARE `null` → A REAL FACTION: a village tannery filed
 *   as 'government' in a settlement whose power structure has no government faction showed NO
 *   backer whatsoever. The relabel does not merely re-point those rows, it gives them one.
 *   TOTALITY CONTROL: the parent commit (`918df1dc4`) reproduces all 525 committed hashes with
 *   0 mismatches, so 203 byte-identical is a count and 322 is not a floor.
 *   THE PROMISE. A stored settlement is never re-derived; only newly generated worlds get the
 *   corrected labels. A world saved before this lands keeps its trades filed as government.
 *
 * 2026-08-31 — THE LAST PRIVATE PROSPERITY LADDER (91 rows of 525 moved; 0 rows added,
 *   0 removed, 0 templates added or removed, 0 array-length moves, 0 key-order moves).
 *   Lane T8, the shift window's first car. RULED: J-T7-C at ODQ §809, scheduled into this
 *   window by §773.1's coupling law — T7 measured the flip, could not take it inside a
 *   behavior-preserving train, and REGISTERED it instead of parking it.
 *   THE CAUSE IS ONE FIELD READ ON TWO LADDERS. `economicState.prosperity` is a six-label
 *   categorical with no declared unit (the §711.6 family), and four consumers had privately
 *   re-quantified it to 0..1 on three different scales. T7 moved three of them onto
 *   `domain/prosperityRank.js`. The fourth, `corruption.js`'s climate adapter, feeds
 *   `corruptionPass` — a GENERATION step — so its flip was same-seed load-bearing and had to
 *   wait for this window. It now reads `prosperityRank01` like its three siblings, and the
 *   registered holdout export, its single-importer walker and its disagreement pin are gone.
 *   THE LADDER MOVED ON FIVE OF SIX LABELS (was → is): Struggling 0.2 → 0.1 · Poor 0.2 → 0.25 ·
 *   Moderate 0.4 → 0.5 · Comfortable 0.6 → 0.65 · Wealthy 1.0 → 0.95. `Prosperous` reads 0.8 on
 *   BOTH, and that coincidence is this record's control (below). The unknown default moved
 *   0.4 → 0.5, the leaf's declared neutral.
 *   THE COMPLETE PATH-TEMPLATE CENSUS IS ONE TEMPLATE, measured over WHOLE SETTLEMENTS
 *   base-vs-tip and never inferred from a hash:
 *     $.simulationTrace[].causes[].effect            114 changes / 91 rows
 *   Old → new is one receipt line per corrupted NPC — `onset chance 0.165` → `onset chance
 *   0.158` — the string `corruptionPass` writes to say WHY that NPC was generated corrupt.
 *   ⭐ NO NPC CHANGED CORRUPTION STATE ON ANY ROW, AND THAT IS A MEASUREMENT, NOT A HOPE.
 *   `rng.chance(p)` consumes its draw whatever `p` is, so the stream never moves; only the
 *   comparison could flip, and on these 525 rows none did — a flip would have moved
 *   `$.npcs[].corrupt`, a `causes[]` length, or a `secondaryAffiliation`, and the census shows
 *   zero of all three. It CAN flip elsewhere: this is a real behavioral shift on the corrupted
 *   cohort, and the corpus happens not to contain a row near enough to a threshold.
 *   ⭐ THE DRIFT SET IS THE EDIT'S OWN FINGERPRINT, AND ITS CONTROL FIRES. Of 525 rows, 270
 *   reach `corruptionPass` at all (it returns before any trace when no criminal institution is
 *   present, so thorp/hamlet/village never reach it — 0 of 252, and 0 of those moved). Of the
 *   270 that DO reach it, the split is exact:
 *     Comfortable  55 reached / 55 moved      Moderate    12 reached / 12 moved
 *     Poor         24 reached / 24 moved      Prosperous 179 reached /  0 moved
 *   55 + 12 + 24 = 91. Every row carrying a label the two ladders DISAGREE on moved; every row
 *   carrying the ONE label they agree on did not. `Prosperous` is therefore a live negative
 *   control INSIDE the same mechanism — 179 rows that run the changed code and are byte-
 *   identical — so the 91 is a count of a cause, not a sample of a cascade. No roster,
 *   institution, settlement name, economy figure, faction or rng draw moves anywhere.
 *   TOTALITY CONTROL: this lane's base (`6770f878f`) reproduces all 525 committed hashes with
 *   0 mismatches, proved twice by different instruments — the suite's own run, and a standalone
 *   harness that rebuilds every row from the manifest's own keys. So 434 byte-identical is a
 *   count, and 91 is not a floor.
 *   CONTAINMENT BEYOND THIS MANIFEST: the whole of `tests/property/` was run at the tip —
 *   83 files, and the 82 that are not this one all pass. The climate's `prosperity` field has
 *   readers outside generation (`worldPulse/npcAgency`, `factionCapture`, `undercity/
 *   colonization`, `undercity/sewerDerivation`), and NO dormancy or world-pulse golden moved.
 *   THE PROMISE. A stored settlement is never re-derived; only newly generated worlds get the
 *   one ladder. Two worlds from one seed — one saved before this lands, one generated after —
 *   differ in the onset-chance receipt on their corrupted NPCs and in nothing else.
 *
 * 2026-08-30 — THE HEDGES THAT NAMED NOTHING (25 rows of 525 moved; 0 rows added, 0
 *   removed, 0 ROSTERS changed). Lane T10 landing, re-recording car UX-2's §767.3(e)
 *   hedge kill. RULED at ODQ §830 — the drift is the train's OWN DECLARED SHIFT, so the
 *   governed ritual re-records it rather than the landing curing it away.
 *   THE CAUSE IS TWO AUTHORED TEMPLATE ROWS in `spatialGenerator.js`, each printing an
 *   unresolved AUTHORING ALTERNATION straight to the user:
 *     village × desert — 'a central well and mosque or chapel' → the sacred noun is now
 *       DERIVED from the roster the generator was handed: church family → ' and its
 *       church', shrine → ' and a wayside shrine', neither → the clause drops. The old
 *       string named 'mosque', a building NO institution in the catalog ever mints
 *       (re-verified at this tip: 0 occurrences anywhere in src/ but the new comment).
 *     town × hills — 'the castle or keep visible…' → 'the keep visible…'. The car's
 *       stated reason re-verified here: `institutionalCatalog.js` holds 0 castle rows,
 *       so the sentence commits to the one word the tier can honestly carry.
 *   ⛔ THE COVERAGE CLAIM THAT SHIPPED WITH THIS SHIFT WAS WRONG, AND IT IS CORRECTED
 *   HERE RATHER THAN RIDDEN SILENTLY. Car UX-2 declared the shift honestly and then said
 *   "No golden or fixture covers these strings (measured)". THIS MANIFEST COVERS THEM,
 *   across all 12 cultures, and reds on them — which is how the landing gate found it.
 *   The shift was real and declared; only the claim that nothing pinned it was false.
 *   THE COMPLETE PATH-TEMPLATE CENSUS IS ONE TEMPLATE, and that is the whole finding:
 *     $.spatialLayout.layout changed                        25 changes / 25 rows
 *   ZERO templates ADDED, ZERO REMOVED, zero array-length moves, zero key-order moves. No
 *   roster, institution count, settlement name, economy figure, trace row or rng draw
 *   moves anywhere — measured over WHOLE SETTLEMENTS base-vs-tip, never inferred from the
 *   hash. Old → new is one sentence per row, 13 rows carrying the keep and 12 the church.
 *   TOTALITY CONTROL: the landing BASE (`19a8c9197`) reproduces all 525 committed hashes
 *   with 0 mismatches, so 25 is A COUNT AND NOT A SAMPLE — and the same run proves no
 *   drift was inherited from the 50 commits this landing rebased onto. The tip then
 *   reproduces 500 of 525, and the re-recorded manifest agrees ROW FOR ROW (525 of 525)
 *   with an independently computed one, so two instruments fixed this file's contents.
 *   ⭐ THE DRIFT SET IS THE EDIT'S OWN FINGERPRINT, AND ITS CONTROL COULD HAVE FIRED.
 *   It is exactly {all 12 `village|*|desert`} ∪ {all 12 `town|*|hills`} ∪ {ONE of the
 *   four `town|germanic|auto|random_trade` seeds}. That last row is the informative one:
 *   its weighted terrain roll resolves to HILLS at seed golden-master-v3, so it lands ON
 *   an edited row, while its three siblings roll riverside, riverside and plains and land
 *   on untouched ones. ⭐ THE ROLL ITSELF DID NOT MOVE — `$.config.terrainType` is absent
 *   from the census above on all four, so what changed is the row landed on, not the
 *   landing. An rng cascade would have moved all four and moved more than one template;
 *   `spatialGenerator.js` contains no rng at all (0 hits for rng|random|Math.random) and
 *   the derivation is a pure string scan over the roster handed in, so it can consume no
 *   draw. CROSS-CONTROLS that stayed byte-identical and would have convicted a tier-wide
 *   or terrain-wide cause: `village|germanic|HILLS`, `town|germanic|DESERT`, village
 *   plains, town coastal. The change is row-specific, not tier- or terrain-wide.
 *   ⚠ A CORPUS GAP, NAMED RATHER THAN CLOSED: all 12 desert villages resolve to the
 *   CHURCH branch, so this manifest pins neither the shrine branch nor the dropped
 *   clause. Both are pinned by unit test instead — tests/generators/spatialGenerator.test.js
 *   asserts all three branches plus a 6 tiers × 7 terrains × 2 rosters sweep convicting any
 *   layout row that carries an either/or. Adding a golden row is an ADDITION and therefore
 *   owner-signed (precedent aa33eba5), so the gap is left named, not quietly filled.
 *   ⚠ THE LANDING'S OTHER GENERATOR-PATH EDIT MOVES NOTHING HERE, stated so nobody
 *   re-prices it later: `steps/stepMetadata.js` re-worded two step summaries (§767.3(d)),
 *   and NO `$.simulationTrace` template appears in the census — those receipts are not in
 *   the hashed output.
 *   THE PROMISE. A stored settlement is never re-derived; only newly generated worlds get
 *   the honest sentence. Two worlds from one seed — one saved before this lands, one
 *   generated after — differ in exactly this line and nothing else.
 *
 * 2026-08-30 — THE BURIAL LADDER (441 rows of 525 moved; 0 rows added, 0 removed). Lane
 *   TE-RESIDUE-1, the content car ODQ §763.1 granted, curing §708.5. THE DEFECT WAS AN
 *   ABSENCE: the catalog held exactly ONE burial row in 311 — `Graveyard`, village-only —
 *   so a thorp, a hamlet, a town, a city and a metropolis of any size had nowhere to bury
 *   anyone. Five rows were authored, one per missing tier: `Burial ground` (thorp and
 *   hamlet), `Parish burial grounds` (town), `Burial grounds and charnel house` (city),
 *   `Cemetery network` (metropolis). Catalog entries 311 → 316, distinct names 276 → 280.
 *   ⭐ THE VILLAGE IS THE CONTROL, AND IT IS PERFECT: village 0 of 84 rows moved, because
 *   the village is the one tier that already had its graveyard. Every tier that gained a row
 *   moved 100% of its rows — thorp 84/84 · hamlet 84/84 · town 105/105 · city 84/84 ·
 *   metropolis 84/84 — which is what a required row is supposed to do and is a far stronger
 *   attribution than the count alone.
 *   ⛔ THE ROWS ARE `required: true`, AND THAT CHOICE IS THE WHOLE SHAPE OF THE SHIFT.
 *   `assembleInstitutions.js` pushes a required row WITHOUT reaching `rng.chance`, so this
 *   car consumes ZERO new draws: no settlement name, no seed sequence and no probabilistic
 *   roster decision moves anywhere. Measured over the 525-row grid × five magic dials
 *   (2,625 settlements): 2,205 hashes move — 441 in every case, identically — with
 *   `rosterCount` +1 exactly and settlement NAMES unmoved on 2,625 of 2,625. A probabilistic
 *   row would have re-rolled every later draw in each settlement, which is the collateral
 *   MF-CH3 measured at 97 of 420 rosters for a change of comparable size.
 *   THE COMPLETE PATH-TEMPLATE CENSUS — 68 CHANGED, 12 ADDED, 3 REMOVED templates, all
 *   downstream of one added institution and its service menu:
 *     $.institutions.length / [*].{name,category,desc,tags,tags.length,required,baseChance,
 *       priorityCategory,source,catalogId}                                441 rows each
 *     $.simulationTrace.length / [*].{targetType,targetId,step,result,ts,
 *       causes.length,causes[*].{source,effect,reason},
 *       downstreamEffects.length,downstreamEffects[*].{target,effect}}    441 rows each
 *     $.economicState.compound.inst.names(.length)                        441 rows
 *     $.economicState.safetyProfile.compound.inst.names(.length)          441 rows
 *     $.availableServices.healing.length                                  434 rows
 *     $.availableServices.healing[*].{name,desc,institution}              369 rows
 *     …and the remaining service categories at lower counts, plus 12 ADDED templates (72
 *     rows gained a healing menu where they had none, 20 information, 4 entertainment, 1
 *     transport) and 3 REMOVED (1 row's information menu emptied).
 *   ⚠ THE SERVICE RESHUFFLE IS DECLARED, NOT INCIDENTAL. `availableServices` selection
 *   consumes its own draws while walking the institution list, so a settlement carrying one
 *   more institution re-rolls its probabilistic services: the visible instance is
 *   `Message relay` appearing on 20 town rows and leaving 1. That is a re-roll, not a loss.
 *   ⚠ AND FOUR REGISTRATIONS RODE WITH THE ROWS, three of them caught by the estate's own
 *   guards rather than by the author: `INSTITUTION_IDENTITY` + themes
 *   (`institutionVocabulary.js`), desc variants for all five (`institutionDescVariants.js`,
 *   the Charge-2 exhaustiveness ratchet), `INSTITUTION_DEFAULT_CATEGORY` and eight
 *   `SERVICE_CATEGORY_MAP` rows (`serviceCategoryTables.js`), and the service-key + compendium
 *   regenerations. ⛔ WITHOUT the default-category row the fallback filed burial services
 *   under `equipment` on 72 rows and emptied 3 rows' information menus — measured, then cured.
 *   THE PROMISE. A stored settlement is never re-derived: only newly generated worlds carry a
 *   burial ground. THE DEITY DOCTRINE: every one of the five rows and their sixteen service
 *   lines describes PRACTICE and custom — who digs, who keeps the register, who is lifted to
 *   make room — and asserts nothing about a god. The leak trawl over the whole corpus reports
 *   the identical 22 hits before and after, so this prose adds no supernatural claim.
 *
 * 2026-08-30 — DEITY-LIVE-CHECK, THE SUPERNATURAL CLAIM IS NOT ALWAYS ARCANE.
 *   ⛔⛔ **NO RE-RECORD. THIS ROW EXISTS TO SAY WHY NOT, AND TO WARN THE NEXT LANE THAT
 *   THIS MANIFEST IS BLIND TO THE THING THAT CHANGED.** Lane TE-RESIDUE-1, ODQ §708.6 /
 *   §765.2. THE CHANGE: `MAGIC_ASSERTION_PATTERN` (`src/domain/magicAssertionText.js`) was
 *   arcane-only, so a magic-free world shipped §708.6's own quoted sentence — *"More
 *   advanced divine healing from senior clerics."* Eight PHRASE tokens were added, every
 *   one receipted against a live shipped string.
 *     THE MANIFEST DID NOT MOVE: 0 rows of 525, and the parent reproduces all 525 committed
 *     hashes with 0 mismatches, so that is a count and not a sample.
 *   ⚠⚠ **AND 0 OF 525 IS A VACUOUS GREEN HERE — MEASURED, NOT SUSPECTED.** A POSITIVE
 *   CONTROL was planted: `blessings?|consecrated|holy|sacred|relics?` added to the same
 *   pattern — a deliberately blunt widening that convicts a dozen faith-CULTURE strings.
 *   THIS MANIFEST STILL REPORTED 0 OF 525. The reason is structural: every config in
 *   `corpus()` leaves magic ON, so `allowsInstitution`/`allowsService`/`allowsGeneratedContent`
 *   /`allowsSecret` all short-circuit at `if (magicEnabled) return true;` and the pattern is
 *   never consulted. ⛔ A FUTURE CAR THAT PRICES A WORLD-LAW CHANGE OFF THIS MANIFEST ALONE
 *   WILL SHIP A WRONG "ZERO SHIFT" CLAIM.
 *   THE INSTRUMENT THAT CAN ACTUALLY DISCOVER IT is this corpus × five magic dials —
 *   `magicExists:false` · `priorityMagic` 0 / 20 / 50 / 80 — the same 2,625-settlement grid
 *   MF-CH2A and MF-CH6 used. Executed parent-vs-tip, whole-record sha256:
 *       dead 0/525 · pm0 0/525 · pm20 0/525 · pm50 0/525 · pm80 0/525 — **0 of 2,625**,
 *       with rosters, roster counts and settlement names unmoved in every case.
 *     AND THAT GRID'S OWN POSITIVE CONTROL FIRES, which is what makes its zero mean
 *     something: the same planted blunt widening moves **730 of 2,625** — 365 in `dead` and
 *     365 in `pm0`, 0 in the three lit cases. ⭐ That number is also the measured cost of the
 *     token set this car REFUSED: bare `bless`/`holy`/`sacred`/`relic` would have stripped
 *     faith-culture content from 365 of 525 magic-free worlds, which is the deity-doctrine
 *     violation in the opposite direction from the one §708.6 found.
 *   WHY THE REAL WIDENING MOVES NOTHING: the eight tokens reach service and catalog texts
 *   whose PROVIDERS are already struck in a magic-free world (`Healer (divine, 1st level)`
 *   is licensed `low`; `Dream Parlor` and `Spellcasting Services` are arcane by name), so
 *   the gate they newly answer had already been answered upstream for every row in this
 *   corpus. What the widening buys is the row a future author writes on a Religious shelf,
 *   and the free text a player types — neither of which any corpus can pre-measure.
 *   ⛔ NO ROSTER, no institution instance count, no settlement name and no rng draw moves
 *   anywhere in the 2,625. THE PROMISE is untouched: no stored settlement is re-derived.
 *
 * 2026-08-24 — MF-CH6, FAITH IS NOT MAGIC (30 rows of 525 moved; 0 rows added, 0 removed,
 *   0 ROSTERS changed in ANY magic case). Lane TE-CH-6, the deity-doctrine car of the
 *   catalog-hygiene train. Ruled at ODQ §541.8/§541.9; a REPAIR, chair-ruled.
 *   THE CAUSE IS ONE TAG STRING AND TWO LICENCE VALUES. `ARCANE_INST_KW` — the magic-DEPENDENCE
 *   vocabulary read from the NAME — carried six words that name FAITH ('druid circle',
 *   'elder grove council', 'elder grove', 'healer (divine', 'divine healer', 'wandering
 *   healer'), so the engine asserted that divine healing is a species of magic. THE DEITY
 *   DOCTRINE is constitutional: faith is culture, never theology. The six left the list
 *   (39 members → 33), and `Druid Circle` and `Elder Grove Council` dropped the redundant
 *   `arcane` tag beside their `religious` one and re-licensed `low` → `none`, so tag and
 *   licence AGREE in the data rather than being ordered by a rule — the TE-CH-5 shape.
 *     ⚠ `Healer (divine, 1st level)` IS HELD AT `low` AND §541.8's PREMISE IS REFUTED FOR IT.
 *     `textAssertsFunctionalMagic('Basic healing spells. A closed wound costs 10 in gold.')` is TRUE, so
 *     the entry as authored is a first-level SPELLCASTER filed under faith. The doctrine gap
 *     it exposes is a CONTENT gap — the catalog holds no cultural divine healer — not a
 *     licence value, and it is recorded rather than papered over.
 *     TOTALITY CONTROL: the measuring harness reproduces all 525 committed hashes at the
 *     parent with 0 mismatches, so "30" is a count and not a sample.
 *     THE COMPLETE PATH-TEMPLATE CENSUS IS SIX TEMPLATES OVER ALL 30 ROWS, with zero key-order
 *     moves and zero rows added or removed:
 *       $.institutions[*].tags[*] changed / removed / .tags.length     30 rows each
 *       $.institutions[*].magicLicense changed                         30 rows
 *       $.simulationTrace[*].downstreamEffects[*] removed / .length    30 rows
 *     The first family is the tag string leaving; the second is the licence value; the third
 *     is the ONE effect the tag drove — `{ target: 'magicCapacity', effect: 'reinforced' }`
 *     from `tagsToDownstream`, which feeds nothing but the trace. The 30 rows are 18 town and
 *     12 village — exactly the tiers `Elder Grove Council` and `Druid Circle` are authored in.
 *     NO capacity, economy, magic-profile, count, name, id or rng draw moves anywhere.
 *     WHERE IT LANDS, AND WHERE IT DOES NOT. Over 2,625 same-seed settlements (the 525-row
 *     grid × five magic cases) ZERO ROSTERS move in every case, and no institution's instance
 *     count moves by one in any case: magicExists:false 0 hashes · priorityMagic:0 0 · :20 0 ·
 *     :50 30 · :80 139. A magic-free world is BYTE-IDENTICAL to before — which is the finding
 *     this car exists to record as much as the cure. The world law strikes the two druid rows
 *     by the `Magic` display SHELF, not by the keyword list, so removing the words changed
 *     what the vocabulary CLAIMS without changing what a dead-magic world CONTAINS. Freeing
 *     them needs the shelf-reading gates, and doing that alone reds the shipped
 *     `world_law_magic` coherence receipt on 264 of 504 magic-free settlements (0 today),
 *     because the receipt reads the record's own `category: 'Magic'` as a magic claim. That
 *     is a train, and it is scoped in the packet rather than half-shipped here.
 *   THE PROMISE. Institution tags are stamped at generation and persisted; no store,
 *   migration or rehydration path re-reads `institutionalCatalog`. A saved world keeps its
 *   stored tags and is untouched; only newly generated worlds differ.
 * 2026-08-24 — MF-CH5, ALCHEMY IS A TRADE (187 rows of 525 moved; 0 rows added, 0
 *   removed, 0 ROSTERS changed). Lane TE-CH-5, the vocabulary car of the
 *   catalog-hygiene train. Ruled at ODQ §541 as SHAPE F; a REPAIR, chair-ruled.
 *   THE CAUSE IS ONE TAG STRING LEAVING THREE CATALOG ROWS. `ARCANE_INST_TAGS` was
 *   answering "does this institution need magic to exist?" while carrying `alchemy`,
 *   which names a chemical trade — so it deleted alchemists from magic-free worlds.
 *   `alchemy` (and only `alchemy`) moved to a sibling `TRADE_INST_TAGS`, and the three
 *   `magicLicense: 'none'` rows that carried a now-redundant `arcane` tag dropped it:
 *   `Alchemist shop` → ['alchemy'], `Alchemist quarter` → ['alchemy'],
 *   `Warden's Lodge` → ['military']. Tag and licence now AGREE in the data instead of
 *   being ordered by a precedence rule. Four independent estate authorities converge on
 *   `alchemy` alone — `textAssertsFunctionalMagic('alchemy')` is false where `arcane`,
 *   `planar` and `enchanting` are true; the tag-backfill regex carries an `enchant` stem
 *   and no `alchem` stem; the two alchemy rows are licensed `none` where the planar and
 *   enchanting rows are `high`; and `entityTags.js` files ALCHEMY beside METALWORK and
 *   LEATHER. `planar` and `enchanting` stay put.
 *     THE SPLIT ITSELF IS FREE, MEASURED SEPARATELY. Moving `alchemy` between the two
 *     lists with the catalog untouched moves 0 of 525 golden hashes and 0 of 2,555 sweep
 *     hashes — because both alchemy-carrying rows also carried `arcane`. Every hash below
 *     is bought by the three-row DATA edit, not by the vocabulary edit.
 *     TOTALITY CONTROL: the measuring harness reproduces all 525 committed hashes at the
 *     parent with 0 mismatches, so "187" is a count and not a sample.
 *     THE COMPLETE PATH-TEMPLATE CENSUS IS TEN TEMPLATES IN TWO FAMILIES, with ZERO
 *     key-order moves and zero rows added or removed. Taken over the 511-row grid at
 *     `priorityMagic: 80`, where 235 rows move:
 *       $.institutions[*].tags[*] / .tags.length                 192 moves / 163 rows
 *       $.defenseProfile.institutions.magicDef[*].tags[*|.length] 150 moves / 150 rows
 *       $.simulationTrace[*].downstreamEffects[*].{target,effect} 264 removed / 235 rows
 *       $.simulationTrace[*].downstreamEffects[*].target changed   10 changes /  10 rows
 *     Family one is the tag string leaving. Family two is the ONE effect it drove —
 *     `{ target: 'magicCapacity', effect: 'reinforced' }`, emitted by `tagsToDownstream`
 *     (`assembleInstitutions.js`), whose own docstring calls it a light heuristic and
 *     which feeds nothing but the trace; the 10 changes are `Warden's Lodge`, whose
 *     surviving tag re-points the effect `tag.arcane` → `tag.military`. NO capacity,
 *     economy, magic-profile, count, name, id or rng draw moves anywhere.
 *     WHERE IT LANDS, AND WHERE IT DOES NOT. Over 2,555 same-seed settlements (the
 *     511-row grid × five magic cases) 409 hashes move and ZERO rosters:
 *       magicExists:false 0 · priorityMagic:0 0 · :20 0 · :50 174 · :80 235.
 *     A magic-free world and a low-magic world are byte-identical to before, which is
 *     exactly the region MF-CH2B is about — the two cars do not interfere.
 *     THE ONE BEHAVIOURAL DELTA THAT IS NOT A TAG STRING, stated because it is real even
 *     though it ships nothing: the magic-forms ladder reads the `arcane` tag through
 *     `institutionHasTag`, so over the ladder's own 144-settlement corpus the high-magic
 *     half holding at least one form goes 77 → 69 of 120. `magicForms.js` has no `src/`
 *     importer at this base (its only importers are `magicFormsPractitioner.js` and
 *     `magicRegimeLifecycle.js`, themselves unimported), so no shipped byte moves — which
 *     is why that delta appears in no hash above. Whoever wires K2 re-prices it then.
 *   THE PROMISE. Institution tags are stamped at generation and persisted; no store,
 *   migration or rehydration path re-reads `institutionalCatalog`. A saved world keeps
 *   its stored tags and is untouched. Only NEWLY generated worlds differ — so two worlds
 *   generated either side of this row will disagree about the same institution, which is
 *   what THE PROMISE requires rather than a defect.
 * 2026-08-24 — MF-CH3, THE DATA SLIPS (272 rows of 525 moved; 0 rows added, 0
 *   removed). Lane TE-CH-3, catalog-hygiene car 3. Source: the packet
 *   docs/implementation/packets/catalog-hygiene/MF-CH3.md.
 *   TWO CAUSES, DELIBERATELY KEPT SEPARABLE, and they are of DIFFERENT KINDS. The
 *   car's five data/prose commits were ordered so that everything with a zero
 *   roster shift lands before the one item with a real one, and the census below
 *   is taken at that seam as well as end to end.
 *     (A) THE ZERO-ROSTER HALF (base → c4d71b4ea): 272 of 525 rows move and the
 *         complete census of differing path-templates is SEVEN, with ZERO array
 *         length moves and ZERO key-order moves:
 *           $.institutions[*].minTier                          1,410 removals / 168 rows
 *           $.defenseProfile.institutions.charter[*].minTier      168 removals / 168 rows
 *           $.defenseProfile.institutions.magicDef[*].minTier     138 removals /  82 rows
 *           $.defenseProfile.institutions.garrison[*].minTier      84 removals /  84 rows
 *           $.institutions[*].priorityCategory                   181 changes  / 109 rows
 *           $.institutions[*].desc                               104 changes  / 104 rows
 *           $.institutions[*].facets                              84 additions /  84 rows
 *         Those are EXACTLY the car's four declared classes and nothing else: the
 *         26 no-op `minTier` deletions, the five `priorityCategory` corrections,
 *         the eleven-string prose sweep, and R-INST-6-1's two `facets`
 *         declarations. No name, count, id or rng draw moves in this half — the
 *         corpus measurement agrees, at ROSTER_CHANGED 0 of 420.
 *     (B) THE COEXISTENCE, which is J-CH-3-2 and is a real behaviour change,
 *         chair-ruled explicitly against THE PROMISE: at city, a cathedral and
 *         monasteries may now stand together, as the metropolis block already
 *         allowed. **22 rows move, across 65 path templates**, and all 22 are
 *         inside the 272 half A already moved.
 *         ⚠ THE CHAIR REVISED THIS ITEM MID-BUILD (§538.5 revised), and the
 *         revision is the whole point of these figures. The first form simply
 *         DELETED `exclusiveGroup: 'religiousCenter'` from the two city rows and
 *         cost 144 golden rows / 314 templates / 81 of 420 rosters — because the
 *         exclusivity early return precedes the `rng.chance` draw, so
 *         un-suppressing a row makes it start consuming a draw and re-rolls the
 *         whole settlement. That reshuffle was an ARTIFACT of where the check
 *         sits, not the intent. The shipped form keeps the row IN its group and
 *         draws its chance from `rng.fork('exclusiveCoexist::…')`, so the main
 *         sequence stands where it stood and only the rosters that actually gain
 *         the row move.
 *         ⚠ ONE READER HAD TO LEARN THE DIFFERENCE between "in an exclusive group"
 *         and "blocked by it", and the gate is what found it: with the rows kept in
 *         their group, `structuralValidator` began reporting the pair as an
 *         `exclusivity_conflict` — telling a player that a cathedral city holding
 *         monasteries is "a deliberate override, expect political tension", which is
 *         the exact opposite of the ruling. It skips rows declaring
 *         `exclusiveGroupCoexists` now. That repair also returned the
 *         observed-shape corpus to baseline EXACTLY (1300/8607/14586, zero shapes
 *         added or removed), where the un-repaired form had added the
 *         `structuralViolations` and `authoredTensions` shapes.
 *   THE PROMISE, as the chair ruled it: THE PROMISE protects LIVED HISTORY. A seed
 *   already generated and played is a starting world forever and its stored
 *   institutions are untouched. It does not freeze the generator's future output;
 *   if it did, no defect in generation could ever be repaired. Only newly
 *   generated worlds differ — and under the revised form far fewer of them do.
 *   Over the 420-settlement corpus: **30 of 420 rosters** change (was 81), 123
 *   distinct new institution-name strings (was 376), and SETTLEMENT NAMES ZERO.
 *   Per tier, before → after:
 *     Cathedral (10,000+ only)   city 26 → 26   metropolis 29 → 29   (unmoved)
 *     Multiple monasteries       city  0 → 12   metropolis 32 → 50
 *     Monastery or friary        city  0 →  0   metropolis  0 →  0
 *     Great cathedral            city  0 →  0   metropolis 45 → 45   (unmoved)
 *   THE INJECTION THE FIRST FORM CAUSED IS GONE. Deleting the group also freed a
 *   `coherenceRepairPass` refusal, dragging the TOWN-tier `Monastery or friary`
 *   into 21 cities and 5 metropolises — content nobody asked for. Keeping the row
 *   in its group keeps that refusal, and the injection measures back at ZERO.
 *   AND THE LIVE-RECONSTRUCTED WIZARD NEWS CORPUS NO LONGER MOVES AT ALL. Under
 *   the first form it went introductions 272 → 270, cascading into two frozen
 *   baseline JSONs, a 106-row address digest and `activeRules` 15 → 14 — which
 *   would have required an AUTHORED written reason for a headline rewrite rule
 *   going permanently inert, prose in a protected substrate with no UPDATE path by
 *   design. Executed under the shipped form: both news walkers are 2 files / 16
 *   tests / EXIT 0, and nothing in that substrate moves.
 *   TOTALITY. The base-side regeneration reproduced the OLD manifest on all 525
 *   rows (0 mismatches, key set identical), which proves this car is the ONLY
 *   source of the drift and that nothing else had crept in. Both sides were
 *   regenerated as OBJECTS from COMMITTED BYTES — a separate detached worktree
 *   with its OWN `npm ci` node_modules — and deep-diffed field by field with array
 *   indices collapsed to [*].
 *   ⚠️ THE DEPENDENCY TREE. Every figure here was re-measured after `npm ci` in
 *   both trees. An earlier pass symlinked the MAIN worktree's node_modules, which
 *   declares 36 dependencies against the slot's 40; all five of the car's corpus
 *   digests reproduce byte-identically before and after the reinstall, but they
 *   are quoted from the post-reinstall run.
 *
 * 2026-08-24 — MF-CH2A, THE MAGIC LICENCE DECLARED (297 rows of 525 moved; 0 keys
 *   added, 0 removed). Lane TE-CH-2, catalog-hygiene car 2a. Source: the packet
 *   docs/implementation/packets/catalog-hygiene/MF-CH2A.md.
 *     THE CAUSE, IN ONE SENTENCE. A declared `magicLicense` was added to the 28
 *     Magic/Exotic rows of src/data/institutionalCatalog.js, and
 *     `assembleInstitutions` SPREADS a catalog row onto the settlement record
 *     (`institutions.push({ category, name, ...inst })`), so a new row key becomes
 *     a new record key wherever that institution is selected. This is the second
 *     law of ODQ §503.2, and the move was PRICED BEFORE THE FIRST EDIT rather than
 *     met at a battery.
 *   PROVEN TO BE A KEY ADDITION AND NOTHING ELSE BEFORE RE-RECORDING. All 504
 *   settlements of the tier × culture × terrain grid were regenerated as OBJECTS
 *   from the working trees on both sides — a separate detached worktree at the
 *   clean base b2852ccc3 with its own node_modules and TMPDIR, and this member —
 *   and deep-diffed field by field with array indices collapsed to [*]. The
 *   complete census of differing path-templates is TWO, and both are ADDITIONS:
 *     $.institutions[*].magicLicense                          573 added / 276 rows
 *     $.defenseProfile.institutions.magicDef[*].magicLicense   350 added / 252 rows
 *   Zero changed, zero removed, zero array-length moves, zero key-order moves. No
 *   name, count, id or rng draw moved.
 *   AND THE ROSTERS DO NOT MOVE AT ALL: over 2,520 settlements (the 504 grid × the
 *   five magic cases magicExists:false / priorityMagic 0, 20, 50, 80) the set of
 *   institutions in every single settlement is unchanged. 657 record hashes move;
 *   0 rosters do. The 297 golden keys are the 276 grid rows above plus 21 of the
 *   corpus's one-dimension sweep rows.
 *   ⚠️ THE COMPANION CAR MOVES THIS FIXTURE AGAIN, AND FOR A DIFFERENT REASON.
 *   MF-CH2B makes the five gates READ the licence, which is a real roster shift
 *   (measured 1,025 of the same 2,520, concentrated in magic-free and low-magic
 *   worlds; 3 of 504 at the default dial). That is a second, separately declared
 *   re-record with its own row here — not this one, and not to be conflated with it.
 *
 * 2026-08-03 — LANE MD, A ONE-BODY AMENDMENT INSIDE LANE RR'S WINDOW (1 row of
 *   525 moved). Chair-ruled as an amendment to the still-open RR window rather
 *   than a new disclosure event, and executed under that window's own recipe.
 *   Source commit 5dcad538; this is the re-record, its own commit as RR's was.
 *     THE CAUSE. `isolated.deficit` variant #1 continued past the `{channels}`
 *     splice with a bare COMMA, and `{channels}` is a LIST, so the continuation
 *     was swallowed by it: "…seasonal access, or patronage, at a price the
 *     settlement feels." reads as a fifth channel called "at a price". Closed
 *     with an em-dash. Variant #4's "…or patronage, and the arrangement is
 *     renegotiated…" was deliberately LEFT ALONE — a clause cannot be misread as
 *     a list item, only a phrase can, and touching it would have been a second
 *     unauthorised row. The rule is now `pin:channels-close` in
 *     tests/generators/settlementOriginProse.test.js, with a negative control
 *     asserting the exact shipped sentence fails it.
 *   PROVEN TO BE EXACTLY THAT ONE BODY BEFORE RE-RECORDING. All 525 settlements
 *   were regenerated as OBJECTS from COMMITTED BYTES on both sides — detached
 *   worktrees at 5ebc7b11 (the parent) and 5dcad538 — and deep-diffed field by
 *   field with array indices collapsed to [*]. The complete census of differing
 *   path-templates is ONE:
 *     $.settlementReason[*]                            1 change / 1 row
 *   Zero removed, zero added, zero array-length moves, zero key-order moves.
 *   The single row is town|germanic|plains|isolated|civilized|golden-master-v3,
 *   PREDICTED BEFORE THE EDIT by classifying all 525 rows' origin bodies by arm
 *   and variant index (isolated.deficit#1: 1 row; #2: 72 rows; the arm's other
 *   six variants: 0 rows), then confirmed by the golden reddening on that key
 *   and no other. TOTALITY: the parent-side regeneration reproduced the OLD
 *   manifest on all 525 rows (0 mismatches), which licenses the word "only" and
 *   additionally proves that nothing committed between c4de968a and 5ebc7b11 —
 *   lane MD's own pieces 1-3 included — moved generator output. The re-recorded
 *   fixture was produced in a clean detached worktree, never from the shared
 *   dirty tree, and cross-checks against an independently computed manifest with
 *   0 mismatches. Key set unchanged: 0 rows added, 0 deleted.
 *   ⚠️ CANONICAL-AT-ZERO IS UNTOUCHED: the amendment edits index 1, so every
 *   seedless caller stays byte-identical and pin:index-0 / pin:seedless are
 *   green without modification. This is a copy repair, not a widening — the pool
 *   is still eight arms of five.
 * 2026-08-03 — LANE RR, THE COMBINED RE-RECORD (all 525 rows moved). TWO causes
 *   ride one disclosed window under the chair's lane-RR ruling, so the estate
 *   takes ONE re-record instead of two. Source commit 21bf1041.
 *     (A) THE ORIGIN-RUNG WIDENING. `generateSettlementReason` held ONE sentence
 *         per arm (PT2-5: nine bodies over the whole config space, the DEFAULT
 *         road arm carrying exactly one). Each of the eight arms now holds five
 *         authored variants — 8 x 5 = 40 bodies (arithmetic corrected
 *         2026-08-03; the lane wrote 45, and commit 21bf1041's own subject line
 *         says "forty-five", which is immutable and stands uncorrected) —
 *         selected DRAW-FREE via
 *         kernel/proseHash.pickVariant from a key folding route, resolved
 *         terrain, the food-deficit flag, the special-resource endowment and the
 *         pipeline seed. Zero PRNG draws are consumed, which is why this is
 *         prose selection and not a stream fork. Pools live in
 *         src/generators/narrative/settlementOriginProse.js.
 *     (B) THE resourceIcon CAMELCASE CLOSURE. The second icon re-record this
 *         docstring predicted below. 56 dead `resourceIcon: ''` fields removed
 *         from src/data/supplyChainData.js; copyCorruption SIG 1 widened from
 *         `\bicon` (which is case-sensitive and could never see the camelCase
 *         compounds) to `[A-Za-z]*[Ii]con`.
 *   PROVEN TO BE EXACTLY THOSE TWO CLASSES BEFORE RE-RECORDING. All 525
 *   settlements were regenerated as OBJECTS from COMMITTED BYTES on both sides —
 *   detached worktrees at 32e25808 (the parent) and 21bf1041 — and deep-diffed
 *   field by field with array indices collapsed to [*]. The complete census of
 *   differing path-templates is TWO:
 *     $.economicState.activeChains[*].resourceIcon   4,462 removals / 477 rows
 *     $.settlementReason[*]                            412 changes  / 412 rows
 *   Zero `added`, zero array-length moves, zero key-order moves: no name, count,
 *   id, or rng draw moved. The 412 changes are ONE element per row — index 0,
 *   the origin body; the tier sentence at index 1 never moved, and the array
 *   lengths are unchanged (336 rows of 2, 189 rows of 1). No row ships a raw
 *   `{channels}` splice token. TOTALITY: the parent-side regeneration reproduced
 *   the OLD manifest on all 525 rows (0 mismatches), which proves these two are
 *   the ONLY sources of drift and that the four lanes that landed between
 *   0ab5e03e and 32e25808 moved no generator output. The re-recorded fixture was
 *   produced in a clean detached worktree at 21bf1041, never from the shared
 *   dirty tree, and cross-checks against an independently computed manifest with
 *   0 mismatches. Key set unchanged: 0 rows added, 0 deleted.
 *   ⚠️ THE PROMISE. This is a one-time, owner-disclosed break of the origin line
 *   every existing seed used to print. Going forward the choice is seed-stable.
 *   ⚠️ A GAP THIS CORPUS HAS, deliberately recorded rather than closed here:
 *   there is NO port × riverside row. The riverside rows take the `river` route
 *   and the port rows take coastal terrain, so the inland-river-port arm is
 *   invisible to this golden — and a world-law violation in that arm's authored
 *   prose passed this test and was caught only by generationWorldLaw.test.js.
 *   Adding a row is a golden ADDITION and therefore owner-signed (precedent
 *   aa33eba5); tests/generators/settlementOriginProse.test.js covers the arm in
 *   the meantime.
 * 2026-08-03 — THE ICON SWEEP (all 525 rows moved). Cause: d9a1ea5a, the owner's
 *   icon-sweep directive of 2026-08-03 ("remove ALL icons of any kind that are
 *   not logos"), which deleted 94 dead `icon: ""` slots from the src/data files
 *   that feed generation (resourceData.js, stressTypes.js, supplyChainData.js)
 *   and the `icon` fields of computeActiveChains.js's INSTITUTIONAL_SERVICE_MAP.
 *   PROVEN SHAPE-ONLY BEFORE RE-RECORDING: all 525 settlements were regenerated
 *   at HEAD and at HEAD-with-d9a1ea5a-reverted and deep-diffed field by field.
 *   The complete census of differing path-templates is FIVE, every one a key
 *   REMOVAL of a dead icon slot, none of them a value change:
 *     $.economicState.activeChains[*].needIcon            6,676 removals / 477 rows
 *     $.economicState.activeChains[*].resourceIcon        2,214 removals / 453 rows
 *     $.economicState.institutionalServices[*].icon       1,409 removals / 260 rows
 *     $.stress.icon                                         516 removals / 516 rows
 *     $.stressors.icon                                      516 removals / 516 rows
 *   Zero `changed`, zero `added`, zero array-length moves, zero key-order moves:
 *   no name, count, id, or rng draw moved. TOTALITY: the pre-sweep regeneration
 *   reproduced the OLD manifest on all 525 rows (0 mismatches), which proves the
 *   sweep is the ONLY cause of the drift and that nothing else had crept in.
 *   Old values removed were "" and the orphan U+FE0F variation selector — dead
 *   strings an earlier emoji strip had left behind, rendering nothing.
 *   EXPECT A SECOND ICON RE-RECORD — ⭐ TAKEN, by lane RR above, 2026-08-03.
 *   (Left as written so the prediction and its discharge sit together.) One
 *   correction the lane had to make to this paragraph's claim: of the residual
 *   slots it names, the TWO in src/domain/inferSupplyChains.js are NOT dead.
 *   They are required keys of the reviewed supply-chain persistence shape —
 *   admitReviewedSupplyChain rejects a chain missing either — so they were kept
 *   under a narrow, machine-checked allowlist in copyCorruption.test.js rather
 *   than swept. The 56 in src/data/supplyChainData.js were genuinely dead and
 *   are gone. Original text follows:
 *   the sweep removed only the slots whose value was the orphan
 *   U+FE0F, so 4,462 `activeChains[*].resourceIcon: ""` slots STILL ship in
 *   generated output, sourced from 56 residual `resourceIcon: ''` fields in
 *   src/data/supplyChainData.js (plus 2 `needIcon: ''` in
 *   src/domain/inferSupplyChains.js). tests/lint/copyCorruption.test.js SIG 1
 *   cannot see them: its regex is /\bicon\s*[:=]\s*(?:""|'')/, and `\bicon`
 *   is case-sensitive, so camelCase `resourceIcon`/`needIcon` never match.
 *   Closing that remainder will move these hashes again; that is expected.
 * 2026-08-03 — HK-3 (46255ad5), theme-aware hook draws. Owner-ruled; do not redo.
 * 2026-08-01 — I1 (99974c4a), four houses that trade in what is true. Owner-signed.
 * 2026-07-30 — mountain_pass seasonal tier (aa33eba5), a golden ADDITION. Owner-signed.
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { recordGolden } from '../helpers/goldenRecordDoor.js';
import { resolve, dirname } from 'node:path';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { CULTURE_PROFILE_KEYS } from '../../src/domain/cultureProfiles.js';

const TIERS    = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
// Every selectable tradition is now mechanically meaningful, so stability
// coverage must include the complete canonical vocabulary. Keep the legacy
// mediterranean alias as an explicit compatibility row rather than allowing it
// to dominate a corpus that omitted most current choices.
const CULTURES = [...CULTURE_PROFILE_KEYS, 'mediterranean'];
// The pipeline's REAL terrain vocabulary. terrainOverride is the live key the
// pipeline reads (terrainHelpers.getTerrainType, resolveConfig, resolveResources);
// a bare `terrain` key is dead. These seven tokens are the ones getTerrainType
// returns and resolveConfig weights, so each value genuinely changes the terrain
// type, the terrain-specific resource pool, and the terrain institution modifiers.
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
// Each terrain is swept with the trade route that HONESTLY reaches its resources:
// water terrains (riverside/coastal) need river/port access to unlock their
// water-terrain resources, and a forest hamlet is reached by an isolated track.
// Pairing terrain with its natural route is what makes riverside/coastal exercise
// their full resource unlock rather than degrading to the road-access subset.
const TERRAIN_ROUTE = {
  plains: 'road', hills: 'road', forest: 'isolated',
  riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road',
};
// 'mountain_pass' is the panel's seventh option. No route pool rolls it, so only an
// explicit config reaches it, and it was therefore the one selectable route with no
// golden row at all — the blind spot that let it score a neutral tier unnoticed.
const TRADE    = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass', 'none'];
const THREAT   = ['safe', 'civilized', 'frontier', 'plagued'];

/** The fixed corpus. One-dimension-at-a-time sweeps from a base config plus a
 *  full tier×culture×terrain grid — broad categorical-branch coverage without a
 *  combinatorial explosion. Each grid row pins terrainOverride (the live terrain
 *  key) paired with a terrain-honest trade route, so the seven terrains each drive
 *  a genuinely distinct output (distinct terrainType, terrain-specific resources,
 *  and terrain institution modifiers) rather than an inert echoed config string.
 *  Deterministic order; the seed is folded into each key so the manifest is
 *  stable. */
function corpus() {
  const rows = [];
  const base = { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
  const seed = 'golden-master-v3';
  // Full tier × culture × terrain grid (terrain paired with its honest route).
  for (const settType of TIERS) {
    for (const culture of CULTURES) {
      for (const terrainOverride of TERRAINS) {
        rows.push({ ...base, settType, culture, terrainOverride, tradeRouteAccess: TERRAIN_ROUTE[terrainOverride], _seed: seed });
      }
    }
  }
  // Sweep trade and threat independently from the base (plains baseline).
  for (const tradeRouteAccess of TRADE) rows.push({ ...base, tradeRouteAccess, _seed: seed });
  // The plains sweep row above holds the mountain_pass hash but exercises little of
  // it: a plains town runs a food surplus, so the seasonal import rung never bites.
  // This row puts the pass on the terrain it belongs to, where the structural
  // deficit makes the rung load-bearing.
  rows.push({ ...base, tradeRouteAccess: 'mountain_pass', terrainOverride: 'mountain', _seed: seed });
  for (const monsterThreat of THREAT) rows.push({ ...base, monsterThreat, _seed: seed });
  // Pin the random_trade machinery: the weighted terrain roll (TERRAIN_WEIGHTS)
  // and the terrain-constrained route pools (TERRAIN_ROUTE_POOLS) in
  // resolveConfig are reachable ONLY via tradeRouteAccess:'random_trade' with an
  // 'auto' (unpinned) terrain, so every fixed-route/fixed-terrain row above
  // bypasses them. terrainOverride 'auto' is required here: the base pins
  // 'plains', which suppresses the roll (doRandomTerrain needs an unset/auto
  // override). Seeded → deterministic. The 'mountain' variant pins the
  // override+random_trade interaction: the explicit override wins the terrain, so
  // doRandomTerrain stays false and the route rolls from the GENERIC pool, not
  // the terrain pool.
  for (const s of [seed, 'gm-seed-a', 'gm-seed-b', 'gm-seed-c']) {
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'auto', _seed: s });
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'mountain', _seed: s });
  }
  // A few extra seeds on the base config (seed sensitivity is also locked).
  for (const s of ['gm-seed-a', 'gm-seed-b', 'gm-seed-c']) rows.push({ ...base, _seed: s });
  // The trade/threat sweeps re-include the base values; dedupe by key so each
  // config appears once.
  const seen = new Set();
  return rows.filter((c) => {
    const k = keyOf(c);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const keyOf = (c) => [c.settType, c.culture, c.terrainOverride, c.tradeRouteAccess, c.monsterThreat, c._seed].join('|');

function hashFor(config) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
}

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');

describe('generator golden master (cross-build output stability)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    // 525 full-pipeline generations overrun the root 20s testTimeout on
    // slow/parallel runners — a wall-clock false positive, not drift. Precedent:
    // worldMapMobileGate + pglite override blocks.
    // (recount 2026-08-03 — 523 was the PRE-HK-3 corpus size. This comment is
    // the one a re-recorder reads AT THE MOMENT OF RE-RECORDING, so a stale
    // figure here is the figure that ends up in the next shift record.)
    it('captures the golden manifest', () => {
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      recordGolden({ surface: 'generator-golden-master', path: MANIFEST, produce: () => JSON.stringify(out, Object.keys(out).sort(), 2) + '\n' });
      expect(Object.keys(out).length).toBe(rows.length);
    }, 120_000);
    return;
  }

  it('manifest exists (run UPDATE_GOLDEN=1 to create it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  // Same wall-clock allowance as the capture block above.
  it('every config produces byte-identical output to the golden master', () => {
    const drift = [];
    for (const c of rows) {
      const k = keyOf(c);
      const got = hashFor(c);
      if (manifest[k] !== got) drift.push(k);
    }
    expect(drift).toEqual([]);
  }, 120_000);
});
