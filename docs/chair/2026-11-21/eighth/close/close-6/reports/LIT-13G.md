# LIT-13G: rule 13g measured over the 900, lit and dark, and its cause read (CLOSE-6 unit (1b); written 2026-11-23 12:51 UTC)

**The headline: DARK IS NOT 0.** On the working line's tip 9b0ffaa97, with both laws dark, 3 of the census's 900 births break rule 13g. They are
dp-city-42, dp-metropolis-111 and dp-metropolis-118, under both (A) and (B). So a 13g rule over every birth of the 900 would already be red on
the dark line: the promise was broken before the flip. Lit, the count is 4: the same three, plus dp-metropolis-83. The control r2r-city-5
counts lit (1) and does not count dark (0). Across the 900, every bought birth on every tree also prints a war line, so bought = (A) = (B)
on every row of the table below. The card's gate never fired on a census birth.

No file was changed under `src/` or `tests/` in any tree, and no commit was made. The flip worktree stayed at 8f882d0f0, read-only and
clean: every run read that HEAD at its start and at its end. The dark worktree `/home/user/wt/line` (detached at 9b0ffaa97) was removed
when the work ended.

## What was run (all four through `scripts/gate-mutex.sh --run`, each exit=0)
- `lit13g/count13g.mjs` runs on one tree, set by `TREE`.
  - **Births.** It births the 900 `dp-<size>-<i>`, with i from 0 to 149, as the product does:
    `generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} })`, after `loadGenerationLawPayloads()`.
  - **Control.** It also births r2r-city-5 the way `bar8Powers.test.js` does: its `configOf` over `DEFAULT_CONFIG`, through `birthConfig`.
  - **The test's rule.** `WAR_OF_ARRESTS`, `tieBought`, `powersOf` and `configOf` are copied verbatim from
    `tests/generators/bar8Powers.test.js`. They are identical at 9b0ffaa97 and 8f882d0f0; the two trees' copies of that file differ only in
    the `13g-` negative's seed.
- **The split.** `birthConfig` clamps an incoming law marker off (`densityCreateBoundary.js :: birthConfig` destructures
  `_seatLawVersion` and `_fortuneLawVersion` away). The force is therefore applied after it, on the config that is passed to the pipeline:
  `{ ...birthConfig(…), _seatLawVersion: 1 }` or `{ …, _fortuneLawVersion: 1 }`. Each record's `config` confirms the laws it was born under.
- **(A)** is `tieBought(town)` together with any card whose `desc` matches `WAR_OF_ARRESTS`.
- **(B)** is narrower. It needs a relation row that reads bought (`captureState !== undefined && type === 'corrupted'`) whose `pair`
  resolves, by name, to one power on the record whose `category === 'criminal'` and one whose `category === 'military'`. It also needs a
  card of one of THOSE two powers to match `WAR_OF_ARRESTS`. The two powers are told apart by the record's own `category` field on
  `powerStructure.factions`, never by display name.
- **Outputs.**
  - The raw per-birth records: `lit13g/{lit,dark,lit-seat1,lit-fortune1}.jsonl`.
  - The table: `lit13g/table13g.md`, written by `table13g.mjs`.
  - Every (A) and (B) birth, with its rows and cards: `lit13g/seeds13g.txt`.
  - Logs: `/tmp/claude-0/-home-user-settlement-engine/237fca18-9a05-575d-8f9a-f8032f4bd46d/scratchpad/flip/LIT-13G/`.

## The table (bought = the tie reads bought; war = a war line on some card; (A), (B) as above)
| tree | thorp | hamlet | village | town | city | metropolis | **the 900** | r2r-city-5 |
|---|---|---|---|---|---|---|---|---|
| LIT 8f882d0f0 (seat 2, fortune 2): bought / war / (A) / (B) | 0/0/0/0 | 0/0/0/0 | 0/0/0/0 | 0/2/0/0 | 1/6/1/1 | 3/26/3/3 | **4/34/4/4** | 1/1/1/1 |
| DARK 9b0ffaa97 (both dark) | 0/0/0/0 | 0/0/0/0 | 0/0/0/0 | 0/2/0/0 | 1/1/1/1 | 2/14/2/2 | **3/17/3/3** | 0/1/0/0 |
| SPLIT seat 2 + fortune 1 (flip) | 0/0/0/0 | 0/0/0/0 | 0/0/0/0 | 0/2/0/0 | 1/1/1/1 | 2/14/2/2 | **3/17/3/3** | 0/1/0/0 |
| SPLIT seat 1 + fortune 2 (flip) | 0/0/0/0 | 0/0/0/0 | 0/0/0/0 | 0/2/0/0 | 1/6/1/1 | 3/26/3/3 | **4/34/4/4** | 1/1/1/1 |

Each size has 150 births. The (A) and (B) seeds:
- **LIT:** dp-city-42, dp-metropolis-83, dp-metropolis-111, dp-metropolis-118, and the control r2r-city-5.
- **DARK:** dp-city-42, dp-metropolis-111, dp-metropolis-118.

**The split is exact, per birth** (CONFIRMED, run). Over all 901 births I compared bought, war, (A), (B), the war cards, the capture rows
and the governing power:
- LIT and seat 1 + fortune 2 differ on 0 births.
- DARK and seat 2 + fortune 1 differ on 0 births.
- LIT and DARK differ on 22.

**THE FORTUNE LAW alone moves 13g. The seat law moves none of it.**

## The cause, by `file :: symbol`
1. **The card's war-family lines.** `src/generators/power/factionStanding.js :: annotateFactionStanding`, in its
   `hasThieves && hasMilitary` branch.
   - **What it reads.** The names of the two powers (`'thieves'`, `'military'`/`'guard'`), their `power` gap (±10), and one gate:
     `seatBought = seatBoughtOf(factions)`. That gate is true only when **the governing power is itself criminal** (`isCriminalPower` on
     the governing row, by `inferFactionCategory`).
   - **What it does not read.** The relation row's type, its `captureState`, `criminalCaptureState`, or the hall's agents.
   - Read; CONFIRMED by the log, which gives `seatBought:false` at every call on r2r-city-5.
   - **Where it is called from.**
     - The power step: `rulingStructure.js` line 738, reached through `economyReconciliation.js :: …:201` in `generatePower` and again in
       `powerEconomyReconcilePass`.
     - At assembly: `power/rosterText.js :: settleStandingToRoster` (lines 85 and 86, through `standingsOf`).
     - Under the fortune law only: `power/rosterText.js :: settleStandingToLegitimacy` (lines 213 and 214), from
       `steps/assembleSettlement.js :: settleMeritsTail` → `domain/fortune/fortuneMerits.js :: settleMeritsOfRule`.
   - Every one of these re-annotations runs the same `seatBoughtOf` gate (CONFIRMED, log).
2. **The relation row's `type: 'corrupted'` with a `captureState`.**
   - **Its builders.** `src/generators/factionDynamics.js :: govCriminalRelation` and `criminalMilitaryRelation`. In the power step they
     are called with the strengths classifier (`computeCriminalCaptureState`); r2r-city-5 reads adversarial at that point.
   - **The rewrite.** At the coherence seam, `src/generators/narrativeGenerator.js :: withHallCapture` (called from
     `enrichNpcCoherence`, inside `generateCoherence`, in the `assembleSettlement` step) rebuilds the rows through
     `factionDynamics.js :: withCaptureRelations`. It uses the state derived by `src/domain/people/hallCapture.js :: hallCaptureOf`.
   - **How that state is reached.** `corrupted` comes from the agent rung: a rank-1 agent, an agent score of 3 or more, or a criminal
     ruler. The climate rung is capped at `equilibrium`, so strengths alone never reach `corrupted`.
3. **What the lit law changes: the fortune law, through prosperity, into the allegiance deal.**
   - **Prosperity.** Under `isSizeRelativeFortune`, the economy step reads a place's prosperity against its own size
     (`src/generators/economy/prosperity.js :: computeBaseProsperity`, with `FORTUNE_LAW_TUNING`). r2r-city-5's
     `economicState.prosperity` is **Moderate** lit, and **Comfortable** both dark and under fortune 1 (CONFIRMED, log). The exact line
     inside `computeBaseProsperity` that moves it was read, not logged (PLAUSIBLE).
   - **The deal's chance.** `src/domain/people/allegiance.js :: dealAllegiances` (called at `narrativeGenerator.js` line 977, before
     `withHallCapture` at line 983) draws each card's turn against `p = spawnCorruptionChance(readCorruptionClimate(…))`, and lower
     prosperity raises `p`. Only `prosperity` changes the climate here (0.65 → 0.5); crime and security are equal on both trees. So `p` is
     **0.2647** dark and under fortune 1, and **0.2872** lit.
   - **The roll.** The City Council's rank 1, Arif al-Basri (flaw `manipulative`), makes the same keyed fork draw on every tree. That draw
     lands under 0.2872 and not under 0.2647: `hit:true` lit, `hit:false` dark and under fortune 1 (CONFIRMED, log).
   - **The result.** Lit, `hallCaptureOf` reads `agents:["1:Arif al-Basri->Thieves' Guild"]`, `agentScore 3` and `agentRung corrupted`.
     State and rows become `corrupted/corrupted`. Dark: no agents, `none`, then `adversarial`, and the rows stay `competitive/adversarial`.
     `rulerCriminal:false` on every tree (CONFIRMED, log).
   - **The other bought births.** All seven (A) births on the census (four lit, three dark) have a governing row of category
     `government`. By the rule in `hallCaptureOf`, their `corrupted` must therefore come from agents, the same route. That is PLAUSIBLE:
     read from the rule and the records, but logged only on r2r-city-5.
4. **ORDER in `generateSettlementPipeline`** (CONFIRMED on r2r-city-5 by the pipeline's own `onStep` marks, from log lines in a scratch
   copy):
   1. `generatePower`: the card's war lines are written (`seatBought:false`). The rows are then built adversarial.
   2. `powerEconomyReconcilePass`: the same again, still adversarial.
   3. `assembleSettlement`: `generateCoherence` → `enrichNpcCoherence` → `dealAllegiances` (the rank-1 agent, lit) → `withHallCapture`
      (state `corrupted`, both rows rewritten `corrupted/corrupted`).
   4. `settleStandingToRoster`: the cards re-annotated, war lines kept.
   5. Under the fortune law, `settleMeritsTail` → `settleMeritsOfRule`: `recapture` keeps `corrupted`, and `restand` re-annotates again,
      with the war lines kept.
   6. Post-pipeline: `settleSeatHolderToRecord` and `withConflictRelations`, which touch neither.

   **The card is written before the row reads bought, and every rewrite of the card after that reads only `seatBoughtOf`, never the row.**

**In two sentences.** The war-of-arrests lines are gated on "the governing power is criminal" (`factionStanding.js :: seatBoughtOf`). The
row's `corrupted` comes later and more broadly, from hidden agents in the ruling three (`hallCapture.js :: hallCaptureOf`, at the
coherence seam), so any hall bought through its people rather than its charter keeps the war lines on both cards. The fortune law adds
births to that class by lowering size-relative prosperity, which raises the allegiance deal's chance. The seat law adds none (exact
per-birth split).

## Instrumentation (never in a worktree)
- **Where.** Scratch copies made with `git archive` of both trees' `src/`:
  `/tmp/claude-0/-home-user-settlement-engine/237fca18-9a05-575d-8f9a-f8032f4bd46d/scratchpad/lit13g-instr/{flip,line}`.
- **The lines.** Log lines only, in `factionStanding.js`, `narrativeGenerator.js`, `factionDynamics.js` and `allegiance.js`. The patch is
  `lit13g/instrumentation-flip.patch`, and it applies to both trees: the four files are identical at 9b0ffaa97 and 8f882d0f0.
- **The driver.** `lit13g/probeOrder13g.mjs`.
- **The logs.** `lit13g/probe-logs/`. The `probe2-*` logs carry the deal's `p` and the rank-1 roll.

## For the ruling (not done here: no cure in this unit)
- **Is the dark miss pre-existing?** Yes. Rule 13g, as written ("where the guild has bought the seat", read by `tieBought`), is already
  broken dark on 3 of the 900 and on 4 lit. The test holds it only on three seeds, and on those the governing power is itself criminal:
  the one case the gate covers.
- **Would a rule over every birth of the 900 be red?** Red dark (3) and red lit (4).
