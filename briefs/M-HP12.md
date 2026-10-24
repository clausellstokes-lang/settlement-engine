# M-HP12 — measure one claim by execution (a measure-only lane)

## The claim
The map program's host prompts (`KIT/refs/HOST-PROMPTS-2026-10-24.md`, Prompt S12: its READ FIRST's last bullet and BUILD 4) say: "the stressor refugee flow (P-5) still teleports beside the columns, so one famine can be served both ways."

In host terms: on a canonized world where the spatial migration lane runs (`src/domain/spatial/migration.js :: migrationActive`), one crisis that sheds people from a source may do BOTH of these:
- dispatch spatial columns (`migration.js :: planMigration`, recorded in `spatialLedgers.migration`);
- yield a `flow_migration` candidate from `src/domain/worldPulse/candidateEvents.js :: deriveFlowCandidates`, under `migrationFlowsEnabled` (see `flows.js`).

The same crisis's people would then move twice, or once by teleport beside the column.

If true, this is a host defect whatever the map module does. The chair needs a verdict: is it TRUE, and is it REACHABLE in shipped play?

## Measure
1. **Read the seams by symbol** in the code of record, `/home/user/master-code-of-record` (READ-ONLY; master's `src/` is unchanged since `81f1cd963`). Read:
   - `deriveFlowCandidates` and its gate;
   - `flows.js`;
   - `migration.js`: its header's reconciliation ("we NEVER apply abs*0.45 under spatial"), `planMigration`, and the conservation invariant;
   - `demographicsMigration.js`.

   Say how each path subtracts population at the source, and whether either path suppresses the other.
2. **Census.** In which shipped presets (`src/domain/worldPulse/simulationRules.js`) are both lanes lit together? That is `migrationFlowsEnabled` together with whatever `migrationActive` requires. If no preset lights both, say so: the double service is then unreachable in shipped play (a latent defect).
3. **Execute.** Use a canonized fixture: reuse a test fixture, or the instant-world-plus-canonize path the tests use.
   - Light both lanes by a rules override.
   - Seed a crisis that sheds people (the stressor the flow reads, for example a famine) at one source.
   - Run the ticks you need.
   - For each source and tick, record:
     - the columns dispatched (count, people);
     - the flow candidates derived (count, people);
     - the source's population change.

   Answer: is one crisis served both ways in one tick? Is the source's population subtracted twice?
4. **Verdict:** CONFIRMED BY EXECUTION, REFUTED BY EXECUTION, or PLAUSIBLE (say why execution could not settle it). Give receipts: the symbol, file:line, and the probe's printed numbers.

## Rules
- The code of record is READ-ONLY. Work in `KIT/hp/M-HP12-probe/`. Copy what you need there; `KIT/findings/R-PA1-probe/` shows how an earlier seat imported the code (its `mcr/` copy and its `.mjs` scripts). `node_modules` lives at `/home/user/settlement-engine/node_modules`: link or point to it, and never write inside `/home/user/settlement-engine`.
- Never touch git beyond reading. Never run the full test suite.
- No model name in your report.

## Paths
KIT = `/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit`

## Report
- Write the file `KIT/findings/M-HP12.md`.
- FINAL MESSAGE (the report diet for a measure-only lane): at most 200 words plus ONE table. Lead with the verdict and its reachability, then the receipts' headline numbers, then one CONFIRMED-vs-PLAUSIBLE sentence.
