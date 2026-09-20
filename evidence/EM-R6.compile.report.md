# EM-R6 — COMPILE REPORT, version 2

**Verdict: DRAFT, READY-able.** Every chair ruling (R1–R7) is carried. **No premise is refuted and
no fact of version 1 moved** — the J-T1 window over every declared path is EMPTY. Re-measured at
**`e5bdfd031`**, `git status --short` EMPTY at the start and at the end; preamble SHA-256
**unchanged** (`b90a95b7af…caa5e1`). No vitest, eslint, npm script or build; plain `node` on scratch
scripts, one process at a time.

## Files (version 1 preserved beside each)

| file | |
|---|---|
| `…/EM-R6.md` | the packet, **version 2** (v1 at `EM-R6.v1.md`) |
| `…/EM-R6.manifest.json` | 5 changeManifest · 5 requiredSymbols · 8 acceptanceCases as `{id,case}` · 10 `checks` (v1 at `EM-R6.manifest.v1.json`) |
| `…/EM-R6.evidence.md` | §1–§2 (the window) + §20–§32 (the new measurements); **v1's 23 sections preserved whole** at `EM-R6.evidence.v1.md` |
| `…/EM-R6.compile.report.md` | this file (v1 at `EM-R6.compile.report.v1.md`) |
| `…/candidate-v2/`, `…/tools/proto2.mjs` `instrument2.mjs` `lib2.mjs` | the re-priced candidates and the version-2 harness |

## What changed from version 1

| # | change | figure |
|---|---|---|
| 1 | **R3: all three open polysemous rows CASCADED** under the exact-match guard | the cascade goes 33 → **37 observed paths / 38 declared rows**; `NON_CASCADED` 9 → **5** |
| 2 | **The budget moved, and v1 UNDER-PRICED it** (v1 predicted "≈214") | **219 + 65 = 284 eff** (was 266); **9,087 B** minified (was 7,936 B). Both leaves under 250, packet under 400 |
| 3 | **A fifth removal rule and a SECOND orphan kind, forced by R3(iii)** | the chain `label` is on **6,676/6,676** chains ⇒ it cannot be deleted; rule `report-only` + `chain-label-names-a-removed-house`, measured **7 over 525 removals, 4 on a chain that kept processors** |
| 4 | **The DISJOINTNESS ARM built and executed** (R3 ii) | **1,828 values: 708 institution-only, 658 faction-only, 462 neither, ZERO both** |
| 5 | **R2 taken** — `NPC_HOMES` exported; the MODIFY row is now ruled, not conditional | +1 eff; post-edit simulation executed; **no `retiredSymbols` anywhere** |
| 6 | **R1 written into §3b as a binding note** to EM-B1c, EM-B1a, EM-R0c | 9,087 B vs the model's 8,574 B when it broke the first-paint ratchet |
| 7 | **The brief's two newest steps answered by measurement** | step 15: `factionRename.js` **not** in the wiring census's 7 `stamp.files` ⇒ no census row. step 14a: **0 generators** among `checks` ⇒ nothing to order last. step 14b: title accounting **confirmed from the walker's own code** |
| 8 | **The arms re-run at the new tip over the FULL corpus** | 525 rows: **4,227 handles, 0 stale on any of 38 rows, 0 new dangles** (rename); **0 new dangles, all five removal kinds firing** (removal) |

## Re-run totals at `e5bdfd031` (CONFIRMED)

```
$ node tools/proto2.mjs 525
tip=e5bdfd031 rows=525 seconds=20.9  declared surfaces=38
RENAME  : handlesBefore 4227 · staleOnCascadeRows 0 · newDangles 0
          residue only on the five NON_CASCADED paths (468 + 48 + 12 = 528)
REMOVAL : newDangles 0 · orphanKinds {chain-lost-its-last-processor:304,
                                      chain-label-names-a-removed-house:7}
          removalKindsSeen [delete-dependency-object, delete-key, drop-entry, drop-item, drop-record]
DISJOINTNESS ARM: {values 1828, instOnly 708, facOnly 658, both 0, neither 462}
```

The 63-row stride agrees (550 handles, 0 stale, 0 new dangles, 44 + 2 orphan notes), and the member
mirror control pair is unchanged: **one-home 44/63 red, two-home 0/63 green**, over 572 paired
people with **0** disagreeing at baseline.

## THE 38-ROW SURFACE TABLE (37 observed cascade paths)

| # | path | match | rewrite | REMOVAL | corpus |
|---:|---|---|---|---|---:|
| 1 | `institutions[].name` | `trim() === old` | set | **DROP THE RECORD** | 17,361 |
| 2–12 | `availableServices.{equipment,legal,healing,employment,entertainment,food,lodging,magic,information,transport,criminal}[].institution` | `trim() === old` | set | **DROP THE ENTRY** (25,628/25,628 ⇒ absence is not a shape this record carries) | 7101 · 5001 · 2694 · 2221 · 1883 · 1456 · 1318 · 907 · 886 · 879 · 861 |
| 13 | `economicState.activeChains[].processingInstitutions[]` | per item | set item | **DROP THE ITEM** | 7,982 |
| 14 | `economicState.tradeDependencies[].institution` | `trim() === old` | set | **DROP THE ENTRY** (2,444/2,444) | 2,444 |
| 15 | `resourceAnalysis.gaps[].institution` | `trim() === old` | set | **DELETE THE KEY** (absent on 923/2,982) | 2,059 |
| 16 | `economicState.activeChains[].dependency.institution` | `trim() === old` | set | **DELETE THE `dependency` OBJECT** (absent on 5,515/6,676) | 1,161 |
| 17–23 | `defenseProfile.institutions.{garrison,magicDef,walls,watch,charter,mercenary,militia}[].name` | `trim() === old` | set | **DROP THE ENTRY** (the entry IS the institution) | 451 · 370 · 354 · 273 · 171 · 59 · 12 |
| 24 | `resourceAnalysis.resourceChains[].processingInstitutions[]` | per item | set item | **DROP THE ITEM** | 327 |
| 25–26 | `resourceAnalysis.exploitation.{fullyExploited,partiallyExploited}[].processingInstitutions[]` | per item | set item | **DROP THE ITEM** | 171 · 156 |
| 27–28 | `{npcs[], factions[].members[]}.institution` | `trim() === old` | set | **DELETE THE KEY** (absent on 4,874/5,171) | 297 · 297 |
| 29–32 | `{npcs[], factions[].members[]}.corruptTies.{thievesGuild,criminalInstitution}` | `trim() === old` | set | **DELETE THE KEY** (parent absent on 4,817/5,171) | 354 × 4 |
| 33–34 | `{npcs[], factions[].members[]}.linkedInstitutionIds[]` | per item | set item | **DROP THE ITEM** | 25 · **0 — declared, not observed** (R9) |
| ⭐ 35 | **`spatialLayout.quarters[].landmarks[]`** (R3 i) | per item | set item | **DROP THE ITEM** | 1,664 |
| ⭐ 36–37 | **`{npcs[], factions[].members[]}.secondaryAffiliation`** (R3 ii) | `trim() === old` | set | **DELETE THE KEY** (absent on 4,257/5,171) | 354 · 354 |
| ⭐ 38 | **`economicState.activeChains[].label`** (R3 iii) | `trim() === old` | set | ⛔ **REPORT-ONLY — the label STANDS** (6,676/6,676; deleting mints a new shape) and an `orphaned` note carries the loss | 168 |

**`NON_CASCADED`, five rows:** `simulationTrace[].downstreamEffects[].target` (the receipt ruling
`causes[].reason` carries) · `generationCoherenceReceipt.repairs[].subject` (**design §22.3 item 1
— HISTORY by path**) · `availableServices.legal[].name` (`name === institution` on **0 of 703**) ·
`resourceAnalysis.resourceConditions[].label` (the same literal occurs matching and non-matching) ·
`economicState.activeChains[].resource` (keyed by `resourceKey`).

## ⭐ THE FIVE DANGLE PATHS FOR FIX-D1 — that lane starts from this census

Measured over 525 rows at `e5bdfd031`, **before any edit**. Total pre-existing dangling institution
joins: **7,399**. Per-settlement medians: thorp 11 · hamlet 11 · village 8 · town 15 · city 23 ·
metropolis 18.

| count | path | match rate | what it is |
|---:|---|---:|---|
| **2,885** | `resourceAnalysis.resourceChains[].processingInstitutions[]` | 10.2 % | a processor list naming houses that are on no roster |
| **2,525** | `economicState.activeChains[].processingInstitutions[]` | 76.0 % | the same shape on the economy's chains |
| **869** | `resourceAnalysis.exploitation.fullyExploited[].processingInstitutions[]` | 16.4 % | the fully-exploited arm |
| **699** | `resourceAnalysis.exploitation.partiallyExploited[].processingInstitutions[]` | 18.2 % | the partially-exploited arm |
| **421** | `availableServices.criminal[].institution` | 67.2 % | ⭐ **the different one** — a SCALAR reference to a house on no roster, not a structurally loose list |

⭐ **And the case near-miss FIX-D1 also owns:** `"Thieves' Guild"` appears **88 times** at
`secondaryAffiliation` beside the catalogue institution `"Thieves' guild"` — one character of case.
`isSameName` is deliberately not case-folded (two institutions may differ only in case), so those
88 stay stale after a rename **by design**. A cure that folds case, or that renames the catalogue
entry, moves generated text and goes through the owner's signed door.

## `requiredSymbols` AND THE POST-EDIT SIMULATION

| path | symbol | present at `e5bdfd031` | POST-EDIT |
|---|---|---|---|
| `src/domain/clone.js` | `export function deepClone` | ✓ (1) | **PRESENT** — not in the change manifest |
| `src/domain/factionRename.js` | `const NPC_HOMES` | ✓ (1) | ⭐ **PRESENT** — R2 makes it `export const NPC_HOMES`; the validator asserts `source.includes(row.symbol)` (`implementation-packets.mjs:802`), a plain substring check, so the pinned text survives. **NO `retiredSymbols` row is owed** |
| `src/domain/factionRename.js` | `export const FACTION_RENAME_SURFACES` | ✓ (1) | **PRESENT** — R2 touches `:168` only |
| `src/domain/townMap/anchors.js` | `export function anchorForInstitution` | ✓ (1) | **PRESENT** — not in the change manifest; it is the row that makes §3a cuttable |
| `src/generators/factionRoles.js` | `linkedInstitutionIds` | ✓ (4) | **PRESENT** — not in the change manifest |

**No other packet's rows need discharging:** the **190-entry** manifest at `e5bdfd031` names
`src/domain/factionRename.js` in **no** `changeManifest` and **no** `requiredSymbols`, at any
status. §7 table ⟷ manifest **SET-EQUAL: true**; every action ∈ `PACKET_ACTIONS`; **8
acceptanceCases, all `{id, case}` objects**; **0 generators** among `checks`.

## Register deltas

**Lighting `+2 files / +0 parked / +2 credited / +10 titles / +2 suiteTitles`** — now CONFIRMED
from the walker's own code (`titles = liveTitlesIn`, `suiteTitles = liveSuiteTitlesIn`, both over
CREDITED files only; *"A CREDITED SUITE'S TITLE IS NOT EVIDENCE"*), with both files NEW and
straight-line so they land credited. **Mutation-coverage NOT OWED** (executed at the new tip).
**Wiring census NOT OWED** (7 `stamp.files`, all `stateProse`). **Prose-numerics and every
line-addressed register NOT OWED** (`factionRename.js` in 0 of 16 baselines). **Edge-shared NOT
OWED** (0 of 307). **No budgeted chunk.** **Observed-shape and writer-reach remain PLAUSIBLE and
are the BUILD LANE's to execute — §12 says so explicitly**, with motion a STOP, growth a STOP, and
a shrink recorded for the chair rather than written.

## The noticed items the chair fated — all closed in the packet

Sample-vs-corpus figures and "33 enumerates 32" → **corrected in §5's reconciliation table**
(42 observed / 33 v1 cascade / 37 v2 cascade / 38 declared / 5 non-cascaded). `convergence.js`'s
hot-list row → the chair's next sitting. The case near-miss and the 421 criminal dangles → **FIX-D1,
with the five-path table above**. No structured-sample helper → **TOOL-4**, and the packet says the
stride is built inline meanwhile. `src/domain/edit/` absent and `powerStructure.factions[].name`
unreachable → closed as facts (the second now does load-bearing work as R9's precedent).

## EVERY QUESTION THAT REMAINS

| # | question |
|---|---|
| **R4** | ⚠ **THE OWNER'S, STILL OPEN (ODQ §934.59).** §3a is written to be cut. Under **YES** the chair deletes §3a **whole and nothing else moves** — no manifest row, no `requiredSymbols` row, no budget row. Under **NO** the four `anchorKey` stores become a **THIRD leaf** (`institutionAnchorCascade.js`, ≈45 eff) or a follow-on packet and the budget row changes from 2 leaves to 3. Sharpener: all four containers are **absent on 525 of 525 generated records**, so the exposure is only a save a DM has already edited. |
| **R6′** | ⚠ **ONE THING THE CHAIR MUST STILL ACCEPT.** R3(iii) forced a **SECOND orphan kind**: the chain label is on 6,676/6,676 chains, so a removal cannot delete it — `{ kind: 'chain-label-names-a-removed-house' }` carries the loss (**7 over 525 removals; 4 on a chain that kept other processors**). Neither literal collides at the tip. ⛔ **`OrphanKind` is now a CLOSED VOCABULARY OF TWO that EM-C2 branches on — confirm both spellings, or rule the second kind out and accept a chain label naming a house the DM just removed.** |
| **R9** | ⚠ **NEW AND SMALL.** `factions[].members[].linkedInstitutionIds[]` is **declared but never observed** (0 of 525; only the `npcs[]` home is produced, 25 occurrences). It is declared under the `NPC_HOMES` symmetry law, and the precedent is exact — `factionRename.js` declares `${ROSTER}.name`, observed **0 of 3,378**. **Confirm the symmetry declaration is wanted**, or the row comes out and the two homes stop being symmetric for that one field. |
| **R3′** | ⓘ **A CORRECTION, NOT A QUESTION.** The chair's "three paths" is **four observed paths** — `secondaryAffiliation` is stored at both homes. And version 1's "+5 effective lines" was an under-estimate: measured **+10 / +8**. Both recorded in the packet; neither changes a ruling. |
| **R7′** | ⓘ The collision check covers the **190 registered** entries; the create/modify order check across the kit's DRAFTs is the chair's at placement, as ruled. |

## WHAT WAS NOT DONE, AND WHY

- `scripts/check-observed-shape-readers.mjs` and `scripts/check-writer-reach.mjs` were **read, not
  run** — tree scripts (the first ~145 s by its own header), outside this lane's permission. Both
  verdicts are **PLAUSIBLE**, both commands are in `checks`, and **§12 makes executing them the
  build lane's named job.**
- No eslint, no vitest, no npm script, no build. The `max-lines` figures come from a counter with a
  **6/6 exact** control, stated as such.
- `candidate-v2/` holds the re-priced modules **as pricing artefacts**. They are not the
  deliverable; §6 of the packet is.
