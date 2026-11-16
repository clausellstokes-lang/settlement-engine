# BAR5-POWERS · hand-back (LAW 1's rules 1c and 1d: a power's description and a person's standing read the power's final state)

**STATUS: IN PROGRESS (the cures are committed; the after-run over the three populations and the closing net are running).** Base: the joined line at `600b7683a`, as named. Branch: `lane/bar5-powers-2026-11-16`. Audit seat A (`c0ea05497`) and seat B (`d40d6ab28`) are merged with `--no-ff`; they add helpers and documents only, and no line under `src/`.

**The rulings worked to:**
- The brief (BRIEF-BAR5 Amendment L, with BAR2, BAR3's amendments and BAR4's K, "the measure's own rules" and amendments).
- The chair's **PW1** (2026-11-16, vetoable by the owner):
  - `src/generators/power/claimStanding.js` is this seat's file for the round, as `rulingStructure.js`'s own leaf, for the two label rungs.
  - The force cure lives in a new leaf, `src/generators/power/militaryForceLine.js`, which reads the defence roster through `src/domain/facts/defence.js`.
- (d) the outranked seat: a ruling is asked of the chair (a fourth atom `seat outranked`, or a desk-local admission).

## THE RULES

Counts are towns · instances, from the audit's own runner (`docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs`) over PAGE-COPY renders of the same three populations. At the base each count reproduced the audit's exactly.

| rule | the two readings, and where | the one fact made | sixty: before → after | 720: before → after | fresh 300: before → after | cured by the one change / line by line | named exclusions | guard and positive control |
|---|---|---|---|---|---|---|---|---|
| **1c-npc/marginal** | The card's position is keyed on the town's calm and the house's rank (`npcStructure.js`, `reg(cat,'stable')`, CALM_ONLY). The card's "Standing marginal" reads `npc.influence` (`npcInteriorityRead.js`, INFLUENCE_WORD). | The position reads the person's standing: a head of `influence: 'low'` takes the row's twin (`LOW_STANDING_TWIN`, `positionForStanding`). | 6 · 6 → (pending the after-run) | 41 · 41 → (pending the after-run) | 15 · 15 → (pending the after-run) | **One change.** It also covers the class: the casters' head row "their place is secure", which the detector's words do not reach (9 towns of the 720, 0 of the 300). | none | `tests/domain/bar5PowersStanding.test.js` (a), the class arm, and the control (b) (C35627's shape) |
| **1c-force/roster** | The military description is keyed on `priorities.military` and the tier (`rulingStructure.js`), never on the roster. The defence record holds no militia, watch or garrison. | The description reads the roster's defence atoms (`defence.js :: defenceOf` over the step's roster; `militaryForceLine.js :: forceLineOf`). Each force line has a twin true where the roster holds none of its force. | 2 · 2 → (pending the after-run) | 9 · 9 → (pending the after-run) | 3 · 3 → (pending the after-run) | **One change.** Every force line left prints beside its force: record-level, on the 132 affected towns of the 720. | none | the guard's (a), the leaf arm, and the control (C39734, C43925) |
| **1c-weight/Suppressed** | The description is drawn from the RAW power at generation. The standing word is the final label (`factionDynamics.js` l.744, `economyReconciliation.js` l.321). `claimStanding.js :: settleClaimsToLabel` had no rung for these lines. | Two rungs at the one home of "no claim the label denies" (`CLAIM_RUNGS`): "meaningful civic influence" takes CLERGY_AT_MARGINS at Minor and Suppressed; the two "Significant military …" lines take the watch's line for the tier where a watch stands. | 2 · 2 → (pending the after-run) | 10 · 12 → (pending the after-run) | 3 · 3 → (pending the after-run) | **One change.** Settled at the power step. I traced whether a later relabel leaves a claim stale: neither the neighbour relabel nor the resize moved one (0 at record level on the 132 affected towns). | none | the guard's (a) and the control (C33631) |
| **1c-norival** | DS-POW-4 › Holding v3 ("no rival yet outweighs") keys on the risk label alone. The occupation, and the labels of the powers above the seat, read otherwise. | v3 declares `no crisis: occupied` (the annex's own form). (pending the after-run) | 1 · 1 → (pending the after-run) | 1 · 1 → (pending the after-run) | 1 · 1 → (pending the after-run) | Line by line: one declaration. | (pending the after-run) | the guard's leaf arm and the control (C38889) |
| **1d-up/underfunded** | The stability word "Tense (militarised, chronically underfunded)" reads the forces' funding gate (`governanceNarrative.js`). The prosperity line (DS-ECO-8) reads `economicState.prosperity`. | The stability reads the purse the prosperity line reads (`militaryForceLine.js :: stabilityReadsPurse`, at `rulingStructure.js`'s return). From Moderate up, it keeps "militarised" and claims no underfunding. | 1 · 1 → (pending the after-run) | 0 → (pending the after-run) | 0 → (pending the after-run) | **One change.** It reaches 1 town of the 720 at record level. | none | the guard's stability arm, the C32519 row, and the control |

**LAW 5 for my files** (the audit's static inventory, `law5-inventory.mjs`):
- Before: **1** line. That was DS-POW › "FLAG: stateCrime, heavy" v2, "Travellers reach {settlement} …", with no crisis declared.
- After: **(pending the after-run)**. The line now declares `no crisis: under_siege`, in the annex's own form.

## What moved, by file

- `src/generators/npcStructure.js`: `LOW_STANDING_TWIN` and `positionForStanding`. The card's structural position, for a head of low standing. Record field: `npcs[].structuralPosition`.
- `src/generators/power/militaryForceLine.js` (NEW):
  - `forceLineOf`, `NO_PATROL_LINE`, `NO_FORCE_LINE`;
  - `stabilityReadsPurse`.
  - It is pure and imports `domain/facts/defence.js` only.
- `src/generators/power/rulingStructure.js`: three lines changed, one import line added (799 → 800, the F31 ceiling is 800, no packed line). The military description is wrapped in `forceLineOf`, and the stability in `stabilityReadsPurse`.
- `src/generators/power/claimStanding.js` (PW1): the two rungs and `militaryRung`.
- `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, DS-POW blocks only:
  - DS-POW-4 Holding v3 declares `no crisis: occupied`;
  - DS-POW "FLAG: stateCrime, heavy" v2 declares `no crisis: under_siege`.
  - The leaf `src/data/dossierStateProse/power.generated.js` is regenerated. Its diff is the two `marks` only, and the other desks are unchanged.

**How the leaf was regenerated.** The wiring census is STALE at the base (one of the brief's stored figures), and `gen:dossier-prose` refuses while it is. I ran `node scripts/wiring-census.mjs` in my scratch tree only, regenerated, then restored `docs/content/wiring-census.json` to the base's bytes. The census is NOT re-taken; it is named under the books below.

## THE VETO LIST (every new or changed line, with three towns it is read in)

(pending the after-run)

## The books my cures move

(pending the after-run)

## The reference (525 configurations) against 600b7683a

(pending the after-run)

## Registrations owed

- `tests/domain/bar5PowersStanding.test.js` is under `tests/domain`, so no mutation-manifest entry is owed.
- The new module `src/generators/power/militaryForceLine.js` imports no goods module, so no roster row is owed. The lazy edge was run: (pending the after-run).

## Named for other seats

- **BAR5-MAGIC / nobody:** none.
- **1d's other end.** "Tense (militarised, chronically underfunded)" is written in `governanceNarrative.js`, which is no seat's. It is cured at the record's one reader of the step (the return of `generatePowerStructure`) and not in that file, whose own choice still reads the gate alone. A successor holding that file may move the reading there.

## What is left, in order

(pending the after-run)

## How the instruments are re-made

1. A scratch worktree on this branch, with `npm ci`. A second detached tree at `600b7683a` symlinks its `node_modules`.
2. Render with PAGE-COPY (`git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-16/probes/PAGE-COPY`) for each population:
   - `HOLDERS=<pc>/holders.tipA.json sh <pc>/census3.sh <tree> <out> 4 --seeds <seeds> --count-only`;
   - the sixty is `READ-ALL/packets10/seeds.bar4.txt` + `packets12/seeds.bar5.txt`;
   - the 720 is PAGE-COPY's `seeds.txt`;
   - the fresh 300 is `READ-ALL/packets11/seeds.fresh300.txt`.
3. Count: `node docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs <out> <result.json>`, read under `counts` for `1c-*` and `1d-*`.
4. LAW 5: `node docs/chair/2026-11-16/bar5/AUDIT/law5-inventory.mjs <tree> <out.json>`, filtered to the files above.

## FOR THE OWNER, IN PLAIN WORDS

(pending the after-run)
