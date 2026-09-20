# EM-R0b VERSION 2 — COMPILE REPORT (Opus COMPILE lane, session 7d3418f8, 2026-09-19 ~20:0x–20:3x EDT)

## Verdict

**DRAFT, READY-able, version 2.** Every ruling of design §22.3 and the charter's 18:30 / 19:29 amendments
is applied and measured. No premise was refuted. **Two questions remain, both the owner's, neither
blocking.**

Tree: `$SP/read-tip-e5bdfd031`, `git status --porcelain --untracked-files=all` = **0 lines** at start and
end. Nothing edited, staged or committed anywhere. Version 1 preserved whole as `EM-R0b.v1.*` and its
toolchain as `tools-v1-58fcfe614/`.

**Files** (under `$SP/lane-em-compile-EM-R0b-scratch/`): `EM-R0b.md` · `EM-R0b.manifest.json` ·
`EM-R0b.evidence.md` · `EM-R0b.compile.report.md`, plus `EM-R0b.v1.*` and outputs `out-r0b-v2.txt`,
`out-r0b-v2b.txt`, `out-r0b-v2b-mutants.txt`, `out-r0b-placement-v2.txt`.

## What changed from version 1

| # | change | forced by | measured at |
|---|---|---|---|
| 1 | ⭐ **All four band checks read the producers' own tables by import; every learned envelope DELETED** | §22.3 item 6 + EM-R0d | R-25 |
| 2 | ⭐ **STOP-3b STRUCK; the five evidence checks stay LIVE** — the receipt is split BY PATH, so they relate a READING to held facts | §22.3 item 1 | §1 |
| 3 | The six cross-key checks SHIP; **`V-STRESS-IDENTITY` joins as the thirtieth** | §22.3 item 5 | R-26 |
| 4 | ⭐ **`V-BAND-FOODSEC` is TOLERANT of rounding** (published ± 0.5) | EM-R0d STOP-2 | R-23 |
| 5 | The flag table is taught on **525**, the module's test controls on **63** | §22.3 item 6 | R-27, R-28 |
| 6 | Second leaf renamed `recordInvariantFlags.js` — with the envelopes gone, only the flag table and the pin remain declared | consequence of 1 | §7 |
| 7 | Every check mapped to the group or keys that close it, against EM-R0a v2's six groups | the chair's brief | §5.4 |
| 8 | Brief steps 11–15 answered; `acceptanceCases` are `{id, case}` objects | the brief | R-32, R-33 |
| 9 | Cost **0.060 → 0.044 ms**; the FORBID counterfactual **+1 → +2** on both budgets | re-measurement | R-34, R-14 |

Unchanged from v1: `V-STRESS-NAME` and band pair 4 stay dropped with their controls; the two recon
rejections stand; the two-file split stands (accepted by the chair).

## The final check table — 30 checks

**Control: the shipped v2 instrument over all 525 rows = 1 violating row, and it is the pin** (R-34).
Version 1's twenty-four mutants (R-12) plus version 2's seven (R-29) give **an isolating planted mutant
for all thirty**.

| id | kind | record paths related | closed by | control | mutant |
|---|---|---|---|---|---|
| `V-DEPCOUNT` | count | `economicViability.metrics.dependencyCount` · `.dependencies` | **G3** | clean | `dependencyCount += 1` |
| `V-WARNCOUNT` | count | `…metrics.warningCount` · `.warnings` | **G3** | clean | `warningCount += 1` |
| `V-SUMMARY-DEPS` | prose-count | `economicViability.summary` · `.dependencies` | **G3** | ⛔ **1 — THE PIN** | the summary's dependency NUMERAL +1 |
| `V-SUMMARY-HOOKS` | prose-count | `economicViability.summary` · `.plotHooks` | **G3** | clean | the summary's plot-hook NUMERAL +1 |
| `V-FOOD-RAW` | arithmetic | `…foodBalance.{rawDeficit,dailyNeed,dailyProduction}` | **G2** | clean | `foodBalance.dailyProduction += 5` |
| `V-FOOD-DEF` | arithmetic | `…foodBalance.{deficit,rawDeficit,importCoverage,magicFoodOffset}` | **G2** | clean | `foodBalance.importCoverage += 5` |
| `V-FOOD-PCT` | arithmetic | `…foodBalance.{deficitPercent,deficit,dailyNeed}` | **G2** | clean | `foodBalance.deficitPercent += 5` |
| `V-FOODSEC-RAW` | arithmetic | `…foodSecurity.{rawDeficit,dailyNeed,dailyProduction}` | **G1** | clean | `foodSecurity.dailyProduction += 5` |
| `V-FOODSEC-DEF` | arithmetic | `…foodSecurity.{deficit,rawDeficit,importCoverage,magicOffset}` | **G1** | clean | `foodSecurity.importCoverage += 5` |
| `V-FOODSEC-PCT` | arithmetic | `…foodSecurity.{deficitPct,deficit,dailyNeed}` | **G1** | clean | `deficitPct += 5` ⚠ not +1 (its own tolerance) |
| `V-FOODSEC-CHAINS` | count | `…foodSecurity.{activeChainsCount,activeChains,chains}` | **G1** | clean | `activeChainsCount += 1` |
| `V-FOODSEC-FLAGS` | flag-vector | `…foodSecurity.{label,is*}` | **G1** | clean | the label's OWN flag → `false` |
| `V-BAND-FOODSEC` ⭐ | band | `…foodSecurity.{deficitPct,surplusPct,label}` | **G1** | clean, tolerant | label `Secure`→`Deficit` WITH its flags corrected |
| `V-ISOLATION` | arithmetic | `isolationSupport.{deficit,requiredCapacity,capacity}` | **G4** | clean | `deficit += 5` ⚠ not `capacity += 5` (the `max(0,…)` floor) |
| `V-COND-BAND` ⭐ | band, by import | `activeConditions[].{severity,severityBand}` | **G6** (per-entry) | clean, **516 conditions** | `severityBand` → the adjacent band |
| `V-BAND-READINESS` ⭐ | band, by import | `defenseProfile.readiness.{score,label}` | **G7** | clean | `score` → 20, label stays `Fortress` |
| `V-INCOME-100` | arithmetic | `economicState.incomeSources[].percentage` | **ATOMIC** (§22.3 item 3) | clean | `incomeSources[0].percentage += 5` |
| `V-POWER-100` | arithmetic | `powerStructure.factions[].power` | **ATOMIC** + HELD | clean | `factions[0].power += 5` |
| `V-LEGIT-SUM` | arithmetic | `…publicLegitimacy.{score,breakdown}` | **HELD-internal** | clean | one `breakdown` entry `+= 5` |
| `V-LEGIT-FLAGS` | flag-vector | `…publicLegitimacy.{label,is*}` | **HELD-internal** | clean | the label's OWN flag → `false` |
| `V-BAND-LEGITIMACY` ⭐ | band, by import | `…publicLegitimacy.{score,label}` | **HELD-internal** | clean | `score`→50 WITH `breakdown` corrected |
| `V-GOVERNING` | count | `…factions[].isGoverning` · `.governingName` | **HELD-internal** | clean | a SECOND faction gains `isGoverning` |
| `V-FLAGVEC` | flag-vector | `…foodSecurity.*` (**G1**) · `…publicLegitimacy.*` (**HELD**) | both, per arm | clean | ⚠ `isSecure=true` beside **`Import-Dependent`** (R-30) |
| ⛔ `V-EVIDENCE-ROSTER` | prose-count | `…judgments[]` (READING) · `npcs` · `relationships` | **CROSS-KEY** | clean, 525 carriers | the `"N NPCs / M relationships"` NUMERAL +1 |
| ⛔ `V-EVIDENCE-EVENTS` | prose-count | `…judgments[]` · `history.historicalEvents` | **CROSS-KEY** | clean, 525 | the `"N historical events"` NUMERAL +1 |
| ⛔ `V-EVIDENCE-TENSION` | referential | `…judgments[]` · `history.currentTensions` | **CROSS-KEY** | clean, 525 | the cited tension's evidence → an absent name |
| ⛔ `V-EVIDENCE-STRESS` | referential | `…judgments[]` · `stress.label` | **CROSS-KEY** | clean, 516 | the cited `stress[0]` evidence → an absent label |
| ⛔ `V-EVIDENCE-CONFLICT` | referential | `…judgments[]` · `conflicts` | **CROSS-KEY** | clean, 242 | the cited index → one past the end |
| ⛔ `V-DEFENSE-INST` | referential | `defenseProfile.institutions` · `institutions` | **CROSS-KEY** | clean, 309 | a name the roster does not hold |
| ⛔ `V-STRESS-IDENTITY` ⭐NEW | referential | `stress` · `stressors` | **CROSS-KEY** | clean, **525/525 byte-identical** | `stressors` gains one entry |

Every group G1–G7 is exercised; no check names a group EM-R0a does not declare.

## The rounding rule's proof (R-23)

| published | label | EXACT | TOLERANT | what it is |
|---|---|---|---|---|
| `d=15` | `Import-Dependent` | ⛔ **CONVICTS** | ✓ passes | honest: unrounded 15.4 (the ladder is OPEN below) |
| `d=15` | `Pressured` | ✓ | ✓ | honest: unrounded 14.6 |
| `d=15` | `Deficit` | ⛔ | ⛔ **still reds** | genuinely wrong |
| `d=5` | `Pressured` | ⛔ **CONVICTS** | ✓ passes | honest: unrounded 5.3 |
| `d=5` | `Secure` | ✓ | ✓ | honest: unrounded 4.8 |
| `d=5` | `Import-Dependent` | ⛔ | ⛔ **still reds** | genuinely wrong |

All three things asked for are shown. On today's corpus both forms pass 525/525 — the difference appears
only when a DM's edit lands on a cut, which is exactly when it matters.

⭐ **AND A SECOND, UNNAMED INSTANCE OF THE SAME HAZARD (R-31).** The food card runs TWO ladders on one
number: the LABEL cuts at 15, the FLAGS at 20. Of the 36 rows with published `deficitPct` in `(15,20]`,
**12 published at 19 carry `isPressured` and 24 published at 20 carry `isDeficit`** — the flag ladder read
an unrounded value above 20. **A check that derived the flags from the published number would convict 24
of 525 honest rows.** That is the measured justification for §22.3 item 6's declared data, and it explains
the chair's "12 rows" exactly.

## The readiness-producer measurement (R-22)

**They cannot disagree, and the reason is not the one the name suggests.**
`src/generators/power/rulingStructure.js` contains **ZERO lines naming `readiness`**. Its five labels at
`:733-742` are `_provDefLabel`, a PROVISIONAL defence label consumed only as a fallback INPUT to the
legitimacy score — `const legitimacyDefenseLabel = projection.defenseLabel || _provDefLabel;` (`:744`).
`defenseProfile.readiness.label` comes solely from `computeDefenseReadiness`, and
`readiness.label === readinessBandOf(score)` on **525/525, 0 disagreements**. ⇒ `V-BAND-READINESS` ships
exact. ⚠ `_provDefLabel` is nonetheless a **sixth, undeclared spelling** of the vocabulary and **omits
`Fortress`** — noticed-not-touched row 1, slotted to EM-R0d v2.

## Per-record cost, re-measured (R-34)

| tier | thorp | hamlet | village | town | city | metropolis | ALL |
|---|---:|---:|---:|---:|---:|---:|---:|
| `recordInvariants` | 0.030 | 0.033 | 0.040 | 0.050 | 0.055 | 0.052 | **0.044 ms** |
| generation | 5.56 | 6.42 | 11.87 | 19.21 | 20.76 | 26.17 | 15.17 ms |

⭐ Down from version 1's 0.060 ms: the imported ladders are O(rungs) where the learned envelope scan
allocated a set per pair. 0.17–0.54 % of one generation; the merge pays two re-derivations per edit.

## Budgets and placement (R-14)

| budget | BASE | R0D_ONLY | **with this packet** | FORBID counterfactual |
|---|---:|---:|---:|---:|
| `EAGER_FIRST_PAINT_MODULES` | 283 | 283 | **283 (+0)** | 285 (+2) |
| generation worker closure | 220 | 220 | **220 (+0)** | 222 (+2) |
| `ENGINE_SHARED_DOMAIN` | 68 | 68 | **68 (+0)** | 69 (+1) |

The forbidden import now costs **+2** because it drags EM-R0d's ladder leaf in behind this one. No ceiling
row is owed and none is taken (`WORKER_BUNDLE_CEILING_BYTES = 1401208` is READ only; EM-R0d carries the
ladder leaf's price).

Scope: 3 handwritten files (cap 12) · 1 logic leaf (cap 2) · **0 existing files modified** (cap 3) ·
≤ 300 lines (cap 400) · ≤ 215 / ≤ 40 per leaf (cap 250) · 8 acceptance cases (cap 8).

## Register deltas

| register | delta | door |
|---|---|---|
| Lighting census | `files +1` · `credited +1` · `parked +0` · `titles +8` · `suiteTitles +1`. ⚠ `credited +1` is **conditional** on the registration pin (step 14b) — a bound `it`/`test`/`describe` makes it `parked +1` and the titles count nowhere. ⛔ No absolute quoted (R-15) | interior red; re-derived at the terminal by the chair |
| Mutation-coverage | **zero** — `tests/domain` is not an `ENFORCER_DIR` and the basename matches no `NAME_PATTERN` token (R-16) | none |
| Observed-shape readers | **PRICED, RED-FIRST AT THE BUILD** — a new file has ceiling 0; the inventory's 9 same-key findings are all on the wrong receiver while this module reads each at its correct home (R-16b): evidence, not proof | §8 step 7; STOP for the chair on any identity |
| ⭐ Prose-numerics (line-addressed, step 13) | **zero, structurally** — this packet MODIFIES no `src/` file, so no baselined row can shift (R-32) | — |
| ⭐ Wiring census (stamped, step 15) | **zero, structurally** — `stamp.files` holds 7 entries, none a path this packet writes, and no stamped file is modified (R-32) | — |
| Writer-reach · edge-shared · decision-fork · bundle ceilings | **zero** | — |

## requiredSymbols, with the post-edit simulation (R-18, R-19)

Five rows, all resolving VERBATIM at `e5bdfd031`; the packet is two CREATEs and one TEST, so it moves,
renames and deletes **no symbol** — `retiredSymbols` is EMPTY and no LANDED packet's rows need
discharging.

| path | symbol | now | written by this packet? | after its own edits |
|---|---|---|---|---|
| `src/domain/activeConditions.js` | `export function severityBand` | ✓ 2× | NO | ✓ |
| `tests/helpers/goldenMasterCorpus.js` | `export function goldenCorpus` | ✓ | NO | ✓ |
| `tests/helpers/goldenMasterCorpus.js` | `export const keyOf` | ✓ | NO | ✓ |
| `src/generators/generateSettlementPipeline.js` | `export function generateSettlementPipeline` | ✓ | NO | ✓ |
| `tests/build/domainGeneratorsBoundary.test.js` | `const BASELINE_EDGES` | ✓ | NO | ✓ |

⭐ **EM-R0d's four ladder symbols are deliberately NOT rows.** `src/data/bandLadders.js` is **ABSENT** at
this tip (measured), and the standard forbids naming a symbol that does not exist. EM-R0d is a
`Depends on` row; the manifest carries a `_pending` note naming exactly the four symbols the chair adds at
promotion, once the base is at or after EM-R0d's landing.

## The brief's new steps (R-32, R-33)

- **11** — neither `checks` command is a generator; both are `npx vitest run` on files the manifest names.
  No path is written mid-chain. Established by reading the commands.
- **12** — the packet **changes no symbol and retires no literal**; it adds no member to any named set, so
  the consequence-at-the-consumers question has no subject. Stated, not assumed.
- **13 / 15** — both **zero, structurally**, because the packet modifies no `src/` file at all.
- **14a** — no generator, so `checks` order is unconstrained and every step is reachable.
- **14b** — pinned in §5.2 and §7 as a forbidden alternative: straight-line literal `it`s under ONE
  literal `describe`, and never a variable or parameter named `it`, `test` or `describe`.
- `acceptanceCases` are `{id, case}` objects; the equality arm confirms it.

## Noticed, not touched — each slotted, nothing deferred

1. ⭐ `rulingStructure.js:733-742` `_provDefLabel` is a **sixth, undeclared spelling of the readiness
   vocabulary**, feeding the legitimacy score, and it **omits `Fortress`** so the fallback can never say
   it. → **EM-R0d's second version** (it reads the leaf; the leaf's header names the fallback consumer).
2. `V-FOODSEC-FLAGS` covers **four of the six** food labels and silently ABSTAINS on `Import-Dependent`
   and `Deficit — Active Famine`, where `V-FLAGVEC` is the sole check (R-30). Correct as it stands, but
   undocumented in the recon's instrument. → **written down in this packet's own §6**; no separate slot.
3. `V-EVIDENCE-*` carrier counts range **242 to 525 of 525**; `V-EVIDENCE-CONFLICT` is exercised by fewer
   than half the corpus. → **EM-R7's corpus ratchet** records the carrier count beside each check, so a
   check that stops being exercised becomes visible.
4. `judgments[id=confidence_and_provenance].evidence[path=simulationTrace]` carries an `evidence` value of
   **`undefined` on 525 of 525 rows** — the visible symptom of EM-R0a's receipt-ordering finding. No
   shipped check reads it (R-24). → **EM-R0c's compile**, which already owns that finding.

## Questions that remain — both the owner's, neither blocking

1. **The food card's two ladders** (label cuts 15, flags cut 20 — ODQ §934.57, already before the owner).
   This packet is correct under either answer: it declares what the generator does. **If the owner unifies
   them, `FLAGS_EVER_TRUE`'s `Import-Dependent` row loses its second vector** and the module's A6 arm reds
   until the table is re-taught — a one-line change, and it is the right red.
2. **FIX-G1.** The pin is asserted STILL PRESENT, so the cure REDS A2 by design and FIX-G1's landing must
   remove it. Already sequenced; noted so the cure lane is not surprised.

Nothing else is open. Version 1's five questions are all answered by §22.3 and the charter's amendments,
and version 1's own STOP-3b is struck with its reason recorded in §1.

## Coordinator hazard, re-checked at the new tree

`instrument.mjs` does `process.chdir(TREE)` at import. **Nothing of this lane's is in the read tree**:
`git status --porcelain --untracked-files=all` = 0 lines, HEAD still `e5bdfd031`. Every output is written
by the SHELL with its cwd inside this lane's own `tools/`; no script here writes a file from node.
