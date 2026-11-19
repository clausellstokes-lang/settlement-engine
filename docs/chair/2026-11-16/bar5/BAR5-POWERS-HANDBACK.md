# BAR5-POWERS · hand-back (LAW 1's rules 1c and 1d: a power's description and a person's standing read the power's final state)

**STATUS: HANDED BACK AT THE BUDGET.** Nothing more is pushed after this commit.

- **Base:** the joined line at `600b7683a`, as named.
- **Branch:** `lane/bar5-powers-2026-11-16`.
- **Merged** with `--no-ff`: audit seat A (`c0ea05497`) and audit seat B (`d40d6ab28`). They add helpers and documents only, no line under `src/`.

**The rulings I worked to:**
- The brief, BRIEF-BAR5 Amendment L. With it: BRIEF-BAR2; BAR3's amendments; BAR4's Amendment K, its measure's own rules and its amendments.
- The chair's **PW1**, vetoable by the owner:
  - `src/generators/power/claimStanding.js` is this seat's file for the two label rungs.
  - The force cure lives in a new leaf, `power/militaryForceLine.js`, reading `src/domain/facts/defence.js`.
- The chair's **PA1**, vetoable: no key this round. The force line stays inert at the power step, and the 1d revert stands.
- The chair's **SO1**, vetoable: the fourth atom of the power family, `seat outranked`, homed in `src/domain/facts/seatOutranked.js`. DS-POW-4 v3 declares `no seat outranked`.

## THE RULES

**How the counts were taken.** Each cell is towns · instances, from the audit's own runner (`run-a.mjs`) over PAGE-COPY renders.
- **Before:** at `600b7683a`, the audit's figures reproduced exactly in all three populations.
- **After, the full renders:** the full renders ran at an intermediate tip (the cures as first committed). Their 1c-npc and 1c-weight results are the final tip's.
- **After, the re-render:** the 18 towns that the three later changes touch were re-rendered at the final tip (`seeds.delta`: every base 1c-force, 1c-norival and 1d town). Those changes are: the force line made inert (R-Q), 1d taken back, and the atom.

| rule | the two readings, and where | the one fact made | sixty: before → after | 720: before → after | fresh 300: before → after | one change / line by line | named exclusions | guard and positive control |
|---|---|---|---|---|---|---|---|---|
| **1c-npc/marginal** | `npcStructure.js` `reg(cat,'stable')` is keyed on the town's calm and the house's rank. The card's "Standing marginal" reads `npc.influence` (`npcInteriorityRead.js` INFLUENCE_WORD). | The position reads the person's standing: a head of `influence:'low'` takes its row's twin (`LOW_STANDING_TWIN`). | 6 · 6 → **0** | 41 · 41 → **0** | 15 · 15 → **0** | **One change.** It also covers the class: the casters' "their place is secure" in 9 towns of the 720 that the detector's words miss. | none | `tests/domain/bar5PowersStanding.test.js`: (a), the class arm, and control (b) in C35627's shape |
| **1c-weight/Suppressed** | The description is drawn from the raw power (`rulingStructure.js`). The standing word is the final label. `claimStanding.js :: settleClaimsToLabel` had no rung for these lines. | Two rungs at the one home (PW1): "meaningful civic influence" takes CLERGY_AT_MARGINS at Minor and Suppressed; the two "Significant military …" lines take the tier's watch line where a watch stands. | 2 · 2 → **0** | 10 · 12 → **0** | 3 · 3 → **0** | **One change.** Traced: no later relabel leaves a claim stale (0 at record level on the 132 affected towns). | none | the same guard: (a) and the control in C33631's shape |
| **1c-norival** | DS-POW-4 › Holding v3 keys on the risk label alone. The page rates a power above the seat, or the town is occupied. | v3 declares `no crisis: occupied` and `no seat outranked` (SO1). | 1 · 1 → **0** | 1 · 1 → **0** | 1 · 1 → **0** | Line by line: one line, two declarations. | none | `tests/domain/facts/seatOutranked.test.js`, with the real row r2s-under_siege-city-1 as control |
| **1c-force/roster** | The military description is keyed on `priorities.military` and the tier, never on the roster. | `militaryForceLine.js :: forceLineOf` reads the SETTLED roster's atoms (`projection.forces`, i.e. `defenceOf(settlement)`), with a twin for each force line. It is **inert until the late key is handed** (R-Q, below). | 2 · 2 → 2 · 2 | 9 · 9 → 9 · 9 | 3 · 3 → 3 · 3 | Measured, with the step's own roster: 9, 3 and 2 → **0**. All 14 twins in the 1,080 agreed with the final roster. Taken back for R-Q. | **AWAITS THE LATE KEY**, named in the guard | the guard's leaf arm and control (C39734, C43925) |
| **1d-up/underfunded** | The stability word "Tense (militarised, chronically underfunded)" reads the forces' funding gate (`governanceNarrative.js`). DS-ECO-8 MODERATE v3 reads `economicState.prosperity`. | Made and taken back: the stability reading the purse silenced PP11's KEEP r2r-town-16, the only town of the 720 it reaches, where the word is true. | 1 · 1 → 1 · 1 | 0 → 0 | 0 → 0 | **Recorded by the chair for the next wave (PA1):** the one false line is DS-ECO-8 MODERATE v3 ("has a little in hand") beside forces funded below 1. | — | (detector control only) |

**LAW 5 for my files** (`law5-inventory.mjs`, static):
- Before: **1** undeclared line, DS-POW › "FLAG: stateCrime, heavy" v2, "Travellers reach {settlement} …".
- After: **0**. That line declares `no crisis: under_siege`.

**SO1's conditions:**
1. **Truth.** `seat outranked` is true in 14 of the sixty, 156 of the 720 and 46 of the fresh 300. It refuses v3 in exactly two towns: one of the 720 (r2s-under_siege-city-1) and one of the sixty (bar0-town-occupied-rand-26, also occupied). It refuses v3 in none of the fresh 300.
2. **Registration.** It went through the vocabulary's door: `factVocabulary.js` (beside `rival power`), `factsOf.js`, `factLayers.js`. The stored figures that may read it are named below.
3. **Guard.** `seatOutranked.test.js`, with the real row as its control.
4. **DS-POW-6's desk-local admission** (`corpusAdmittingCrimeLines`) is another reading (an official in a criminal's pay), so it is left as it is.
5. No other line is keyed on the atom.

## The late key (the one open fact, the chair's to hand)

`src/generators/steps/assembleSettlement.js` l.271, the late `reconcilePowerStructure` options, needs one key: `forces: defenceOf(settlement)`. `economyReconciliation.js :: projectPower` already passes it through, and `rulingStructure.js` already hands it to `forceLineOf`. With the key, only the final replay prints the twin. The power step and its law tests (census5cMilitiaReword, factionDescSiblings (a)) are unchanged. Measured with the step's own roster, the cure takes 1c-force to 0 in all three populations.

## What moved, by file

- `src/generators/npcStructure.js`: `LOW_STANDING_TWIN` and `positionForStanding`. Record: `npcs[].structuralPosition`.
- `src/generators/power/claimStanding.js` (PW1): the two rungs and `militaryRung`. Record: `powerStructure.factions[].desc`.
- `src/generators/power/militaryForceLine.js` (NEW, pure): `forceLineOf`, `NO_PATROL_LINE`, `NO_FORCE_LINE`.
- `src/generators/power/rulingStructure.js`: the military description is wrapped in `forceLineOf(…, projection.forces)`. One import line was added and one blank line removed, so the file stays at 799 lines (ceiling 800, no packed line).
- `src/generators/power/economyReconciliation.js`: `forces` is passed through.
- `src/domain/facts/seatOutranked.js` (NEW), `factVocabulary.js`, `factsOf.js`, `factLayers.js` (SO1).
- The annex, DS-POW only:
  - DS-POW-4 Holding v3: `no crisis: occupied · no seat outranked`;
  - stateCrime heavy v2: `no crisis: under_siege`.
  - The power leaf is regenerated; its diff is the marks only.
  - The wiring census is stale at the base, and the generator refuses while it is. I ran `node scripts/wiring-census.mjs` in my scratch tree only, regenerated, and restored `docs/content/wiring-census.json` to the base's bytes. It is NOT re-taken.
- **The standing word does not move** anywhere: no `powerLabel` and no `stability` changes.

## THE VETO LIST (every new or newly reached line, with three towns it is read in)

1. **"Heads the leading house in the trade in quiet times, though its word counts for little beyond the trade."**
   - Where: 56 towns of the 720 and the fresh 300.
   - Read in: r2r-village-49 (village), r2r-town-2 (town), r2r-metropolis-1 (metropolis).
   - Calm only: the row is CALM_ONLY, so no crisis town prints it.
2. **"Heads the casters in quiet times; their spells are in demand, though their word counts for little beyond them."**
   - Where: 9 towns.
   - Read in: r2r-city-5 (city), r2r-city-15 (city), r2r-metropolis-13 (metropolis).
   - Calm only.
3. **CLERGY_AT_MARGINS** (an existing line, newly reached by the rung).
   - Where: 30 towns.
   - Read in: r2r-town-41 (town), r2r-city-23 (city), r2r-metropolis-6 (metropolis, a succession void).
4. **The tier's watch line** (an existing line, newly reached by `militaryRung`).
   - Where: 3 towns.
   - Read in: r2s-famine-town-1 (town, a famine), and two others of the 720.
5. **The force twins, new and unreached until the late key:**
   - `NO_PATROL_LINE` ("No watch or patrol stands here; those who would take up arms if trouble came speak for the settlement's defence.");
   - `NO_FORCE_LINE` ("No standing force is kept here, and the question of raising one comes up whenever civic business is discussed.").
   - Measured towns: r2r-hamlet-23 (hamlet), r2r-village-13 (village), bar0-village-famine-rand-26 (village, a famine).
6. **The two annex declarations:** no new words.

## The books my cures move

Every file red at my tip was run at `600b7683a`. The net is 73 files in one single-worker run, each file isolated.
- **Red at both with the same failing tests**, the base's own, not chased:
  - `proseWiringCensus.walker`, `dossierStateProseProjection.contract`, `writerReach.walker`, `observedShapeReaders.walker`;
  - `pipelinePinnedMode`, `generationForkCensus`, `proseCorpusBytes`, `tieProseDeclared`, `dossierProseManifest`;
  - `tuningRegister.walker`, `proseTasteCorruption.walker`, `presumedThings.walker`, `tailHouses1Gaps`.
- **Red at my tip only, all LAWS, each cured before this hand-back.** All fifteen files of the batch's final run are green:
  - `powerStructure` (the 800-line ceiling);
  - `defenceFactReaders.walker` (a counted line in `claimStanding.js`);
  - `census5cMilitiaReword` and `factionDescSiblings` (R-Q: the force line made inert at the step);
  - `bar2People3Funding` (PP11's KEEP: 1d taken back).
- **Stored figures my cures move**, named, NOT re-taken:
  - the golden-derived files and the reference (below);
  - the wiring census (it reads the power leaf, whose two marks moved; stale at the base already);
  - `dossierStateProseProjection`'s pins on the power leaf;
  - `writerReach`'s frozen rows, if the new readers of `powerStructure.factions` / `npcs[].influence` are read as new reach (WR1).

## The reference (525 configurations) against 600b7683a

Each record was hashed at the base and at the final tip, and the hashes compared by field family. **1 of the 525 moves**, in ONE family: `npcs[].structuralPosition` (the card twin). No configuration's `powerStructure` moves: the rungs' lines do not occur there, and the force line is inert without the late key.

## Registrations owed

- **Mutation manifest:** none owed. Both new test files are under `tests/domain`.
- **Goods roster:** no row owed. No goods module is imported by a new module.
- **Lazy edge:** `engineCoreLazyEdge` was green in the net. That run was before `seatOutranked.js` existed, which imports nothing.

## What is left, in order

1. **THE FORCE CURE'S MISSING HALF** (the chair's ruling PA1: nobody adds the key this round; `assembleSettlement.js` stays closed, as L6 says). The next wave takes it with the pipeline's owner.
   - **The key:** `forces: defenceOf(settlement)`, the settled defence atoms from `src/domain/facts/defence.js`.
   - **Where it goes:** `assembleSettlement.js`, the late replay's call to `reconcilePowerStructure(settlement.powerStructure, settlement.economicState, ctx.powerIntent, { defenseLabel, militaryGate, pins })`, which runs once `settlement.defenseProfile.readiness.label` exists. The key joins that options object.
   - **Its two readers, already in place:**
     - `economyReconciliation.js :: projectPower` takes `forces` from the options and hands it to `generatePowerStructure` in the `projection`;
     - `rulingStructure.js` reads `projection.forces` into `militaryForceLine.js :: forceLineOf`.
   - **Why the power step cannot read it:** the roster can change after the power step. A militia joins the roster after it in 33 of 1,000 births (CENSUS-5c's measure; R-Q / R-U, held by `census5cMilitiaReword.test.js` and `factionDescSiblings.test.js` (a)). Only the late replay holds the settled roster.
   - **The count that remains:** 1c-force reads 9 towns of the 720, 3 of the fresh 300 and 2 of the sixty, as it printed at the base: no twin, no regression. With the key it measured 0 in all three, and all 14 twins agreed with the final roster.
   - **The stored family the twin would move:** `powerStructure.factions[].desc` (the military power's row). It is a declared move of the reference, to be counted then. The standing word does not move.
   - **When the key is handed:** re-render `seeds.delta`, and lift the guard's named exclusion `AWAITS_THE_LATE_KEY` in `tests/domain/bar5PowersStanding.test.js`.
2. **Recorded by the chair for the next wave, not this seat's:** DS-ECO-8 MODERATE v3 ("has a little in hand") beside forces funded below 1 (C32519, bar0-town-calm-rand-24). The 1d revert stands: PP11 keeps "underfunded" where it is true.
3. **The close re-takes:** the golden-derived files and the reference, the wiring census, and the projection's pins.

## How the instruments are re-made

1. A scratch worktree on this branch, with `npm ci`. A second tree at `600b7683a` symlinks its `node_modules`.
2. Render with PAGE-COPY: `HOLDERS=<pc>/holders.tipA.json sh <pc>/census3.sh <tree> <out> 4 --seeds <seeds> --count-only`.
   - The sixty: `READ-ALL/packets10/seeds.bar4.txt` + `packets12/seeds.bar5.txt`.
   - The 720: PAGE-COPY's `seeds.txt`.
   - The fresh 300: `READ-ALL/packets11/seeds.fresh300.txt`.
3. Count: `node docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs <out> <result.json>`, reading the `1c-*` and `1d-*` rows.
4. LAW 5: `node docs/chair/2026-11-16/bar5/AUDIT/law5-inventory.mjs <tree> <out.json>`.

## FOR THE OWNER, IN PLAIN WORDS

**Fixed:**
- A trade house's head marked "marginal" is no longer told their hold is secure and their say is real. They are told that they lead the trade but count for little beyond it. The same goes for a casters' head.
- A church or an army rated Suppressed no longer has its description claim "meaningful civic influence" or "disproportionate" political weight.
- A ruler no longer "holds because no rival outweighs it" in a town where the page rates another power above the ruler, or where the town is occupied.

**Ready, waiting on one switch:** a village with no militia or watch will no longer be described as patrolled by armed residents. That waits on one line in the assembly that the chair holds.

**Recorded by the chair for the next wave:** one rare line, a town "with a little in hand" beside forces called chronically underfunded.

**Nothing moved:** no figure, no standing word and no draw.
