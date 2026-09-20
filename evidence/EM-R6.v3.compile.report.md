# EM-R6 — COMPILE REPORT, version 3

**Verdict: DRAFT, READY-able.** Every ruling of ODQ §934.61 and the charter's amendments of
2026-09-19 20:34 EDT is carried; everything the chair ruled for version 2 that §934.61 does not
touch stands. **No premise is refuted and no fact of version 2 about the TREE moved** — the J-T1
window `e5bdfd031..32602dc60` over every declared path is EMPTY. What moved is the
**classification** of four paths, and three of version 2's own figures, each refuted by execution.
Re-measured at **`32602dc60`**; `git status --short` EMPTY at the start and at the end; preamble
SHA-256 **unchanged** (`b90a95b7af…caa5e1`). No vitest, eslint, npm script or build; plain `node`
on scratch scripts, one process at a time.

## Files

| file | |
|---|---|
| `…/EM-R6.md` | the packet, **version 3** (v2 preserved at `EM-R6.v2.md`, v1 at `EM-R6.v1.md`) |
| `…/EM-R6.manifest.json` | 5 changeManifest · **8** requiredSymbols · 8 acceptanceCases as `{id,case}` · 10 `checks` (v2 at `EM-R6.manifest.v2.json`) |
| `…/EM-R6.evidence.md` | §1–§14, version 3's measurements (**v2's and v1's preserved whole** at `EM-R6.evidence.v2.md` / `.v1.md`) |
| `…/EM-R6.compile.report.md` | this file (v2 at `EM-R6.compile.report.v2.md`) |
| `…/candidate-v3/`, `…/tools/proto4.mjs` `efflines3.mjs` `placement3.mjs` | the priced candidate source and the version-3 harness |

⭐ **A METHOD CHANGE WORTH THE CHAIR'S NOTE.** Version 2's harness re-declared the cascade inside
itself, so its figures were figures about the harness. **`proto4.mjs` imports the priced candidate
source**, so every figure below is a figure about the module the packet contracts.

## Budget table

| | rename leaf | removal leaf | total | cap |
|---|---:|---:|---:|---|
| effective lines | **215** (v2: 219) | **73** (v2: 65) | **289** incl. the MODIFY line | 250 / leaf, 400 / packet |
| minified bytes (esbuild 0.28.1) | **10,173** | **2,624** | **12,797** (v2: 9,087) | no budgeted chunk |
| counter control | 6/6 EXACT against `scripts/.size-baseline.json` | | | |

Files 5 · new logic leaves 2 of 2 · existing logic files modified 1 of 3 · acceptance cases 8 of 8.
**Nothing is over. STOP AND SPLIT is not triggered.** The one conditional that would break it is
§3a under an owner "NO" (a third leaf, ≈45 effective — chair question 8); the one optional that
would not is FIX-D5 (+5 effective, +266 B — chair question 4).

## Register moves — as DELTAS, never an absolute

- **Lighting census: `+2 files / +0 parked / +2 credited / +10 titles / +2 suiteTitles`.**
  Confirmed from the walker's own code at this tip (`:602-605`, `:1478`). ⛔ **No absolute tuple is
  quoted anywhere in the packet**; the terminal refreeze is the host train's.
- **Mutation-coverage: NOT OWED** — `tests/domain` ∉ the eight `ENFORCER_DIRS`; `NAME_PATTERN`
  executed against both basenames → `false`, against two controls → `true`.
- **Wiring census: NOT OWED** — 7 `stamp.files`, all `stateProse`; `factionRename.js` not stamped.
- **Line-addressed registers: NOT OWED** — `factionRename.js` in **0 of 14** baselines
  (⚠ version 2 said sixteen), and `git grep "src/domain/factionRename.js:[0-9]"` → 0 hits.
- **Edge-shared: NOT OWED** — 0 of 307 inputs.
- **Bundle budgets: NO BUDGETED CHUNK** (eager 268 / worker 220 static, 228 +dynamic / engine rule).
- **Observed-shape and writer-reach: PLAUSIBLE, and the BUILD LANE's to execute** — §12 says so;
  motion is a STOP, growth is a STOP, a shrink is recorded for the chair, never written.

## Collision group

**`NONE`** — 190 registered entries at `32602dc60`, no `changeManifest` or `requiredSymbols` row at
any status names any of the nine paths (the four CREATE targets, `factionRename.js`, `clone.js`,
and the three producers). ⚠ Registered entries only; the kit's DRAFTs are the chair's at placement.
⚠ **New in version 3:** `safetyProfile.js` and `computeActiveChains.js` are `requiredSymbols` rows
here **and** the exact files FIX-D2 and FIX-D3 would edit — if either is chartered into this train
the chair sequences them.

## §7 table ⟷ JSON changeManifest, PROVED SET-EQUAL

```
$ sed -n '30,36p' scripts/implementation-packets.mjs
export const PACKET_ACTIONS = Object.freeze([ 'CREATE', 'DOC', 'MODIFY', 'REGISTER', 'TEST', ]);

JSON changeManifest rows:                        §7 TABLE rows parsed from the packet:
  CREATE src/domain/institutionRemoval.js          CREATE src/domain/institutionRemoval.js
  CREATE src/domain/institutionRename.js           CREATE src/domain/institutionRename.js
  CREATE tests/domain/institutionRemoval.test.js   CREATE tests/domain/institutionRemoval.test.js
  CREATE tests/domain/institutionRename.test.js    CREATE tests/domain/institutionRename.test.js
  MODIFY src/domain/factionRename.js               MODIFY src/domain/factionRename.js
SET-EQUAL: true          every action ∈ PACKET_ACTIONS: true
acceptanceCases: 8, all {id,case} objects, ids A1…A8
checks: 10 | generator among checks: FALSE | last: ["npm","run","typecheck:domain:strict"]
```
⇒ **no generator is among `checks`, so brief step 14a has nothing to order last.**

## `requiredSymbols` (5 → 8) and the post-edit simulation

| path | symbol | `grep -cF` | POST-EDIT |
|---|---|---:|---|
| `src/domain/clone.js` | `export function deepClone` | **1** | PRESENT — not in the change manifest |
| `src/domain/factionRename.js` | `const NPC_HOMES` | **1** | ⭐ PRESENT — R2 makes it `export const NPC_HOMES`; the validator asserts `source.includes(row.symbol)` (`:802`), a plain substring check, so the pinned text survives. **NO `retiredSymbols` row owed** |
| `src/domain/factionRename.js` | `export const FACTION_RENAME_SURFACES` | **1** | PRESENT — R2 touches `:168` only |
| `src/domain/townMap/anchors.js` | `export function anchorForInstitution` | **1** | PRESENT — the row that makes §3a cuttable |
| `src/generators/factionRoles.js` | `linkedInstitutionIds` | **4** | PRESENT |
| ⭐ `src/generators/safetyProfile.js` | `CRIMINAL_INST_LABELS` | **2** | PRESENT — **NEW**: row 25's `label` match kind is lawful only while this producer writes a case-variant |
| ⭐ `src/generators/computeActiveChains.js` | `export function deriveInstitutionalServices` | **1** | PRESENT — **NEW**: row 26's lowercased rewrite is lawful only while this producer lowercases |
| ⭐ `src/generators/priorityHelpers.js` | `export const getInstFlags` | **1** | PRESENT — **NEW**: it is why two paths are NON_CASCADED rather than cascaded |

**No other packet's rows need discharging** — the 190-entry manifest names none of these paths.

## What version 3 measured, at `32602dc60`, over 525 rows / 17,361 institutions (116.1 s)

| | |
|---|---|
| **RENAME** | **4,034 handles before · 0 stale on any of the 36 declared cascade rows · 0 new dangling reference joins** |
| declared residue | `simulationTrace[].downstreamEffects[].target` **550** · `activeChains[].processingInstitutions[]` **175** (the measured price of FIX-D3's deferral) |
| **REMOVAL** | **0 new dangles · all five removal kinds firing** · orphans `chain-lost-its-last-processor` **125**, `chain-label-names-a-removed-house` **28** (20 on a chain that kept a processor) |
| ⛔ **BASELINE DANGLES** | **0 over 525 rows, on 0 paths** — version 2's **7,399** counted catalogue vocabulary, matched patterns and sentinels as references |
| **PARTITION** | `resourceChains[] == full ∪ partial ∪ unexploited` — **525/525 before, 525/525 after a rename, 525/525 after a removal** |
| **THE PIN** | exact arm 42 paths · catalogue arm 17 · normalised arm 10 · **5 paths ≥50 % predominance** · `UNDECLARED_AGAINST_V3: []` · ⭐ **`UNDECLARED_AGAINST_V2`: 5 — the RED CONTROL** |
| **LABEL (verbatim)** | `criminalInstitutions[]` 1,164 values, **0 exact / 1,164 case-variants**; rename lands 273/273, removal drops 273/273 |
| **LABEL (lower)** | `institutionalServices[].institutions[]` 1,764 values, **0 exact / 1,764 lower-variants / 1,764 all-lowercase**; rename lands 260/260 |
| **FACTION PIN** | `"Thieves' Guild"` 488/home, 976 total, 327 rows, **0 as an institution**; renaming the chapter leaves all of them untouched on **156/156** rows |
| **MIRROR** | 4,884 paired people, **0 disagreeing at baseline**; one-home control red **257/525**, two-home **0/525** |
| **IMMUTABLE** | 525/525 same `touched`, 525/525 input unmutated, 525/525 same `orphaned`; **0 records gained a key** |
| **SENTINELS** | 12-spelling vocabulary, **3 live** (421 values, 260 rows) / **9 dark** |

## Three of version 2's own figures, REFUTED by execution

1. **"7,399 pre-existing dangling joins; city median 23."** → **0** over the true reference set.
2. **"`\"Thieves' Guild\"` appears 88 times beside the catalogue institution `\"Thieves' guild\"`."**
   → **488 per home / 976 / 327 rows**, and **no such catalogue institution exists**.
3. **"`factionRename.js` appears in none of the SIXTEEN baselines"** → there are **14** at this tip
   (all still 0), and **"`orphaned:` is absent from `src/` and `tests/` entirely"** → **2
   occurrences, both comment prose**. Neither changes a contract; both are corrected on the record.

## EVERY QUESTION ONLY THE CHAIR CAN ANSWER — numbered, not waited on

| # | question |
|---|---|
| **Q1** | **A SECOND DERIVED DISPLAY LABEL, and the ruling says "ON THAT PATH ONLY".** `economicState.institutionalServices[].institutions[]` — 1,764 values, 0 exact, 1,764 lower-case variants, 100 % all-lowercase, **reader-visible** at `EconomicsTab.jsx:241` under a `Via:` label. Compiled as a cascade row under `label` with a **LOWERCASED rewrite** (a second rewrite form the ruling did not contemplate). **Confirm, or rule it NON_CASCADED and accept a fourth stale surface.** Price of cascading: +6 effective lines, inside budget. |
| **Q2** | **THE FROZEN STAMP, ×2.** `economicState.compound.inst.names[]` and its `safetyProfile` alias hold the whole roster lowercased — 17,361 values each, 100 % normalised. Compiled **NON_CASCADED (`frozen-stamp`)**: the stamp is deliberately frozen and owner-gated (`economicState.js:51`, `ENGINE_DEFECT_DISPOSITIONS §4`), nothing reads `.names`, and rewriting it would leave the names disagreeing with the booleans they produced. **Confirm the ruling and its reason.** |
| **Q3** | **THE AUTHORED SUGGESTION LIST.** `structuralSuggestions[].suggested[]`, 136 of 136 catalogue names, rendered as *"Consider: …"*. Compiled **NON_CASCADED (`catalogue`)**. **Confirm** — it is the catalogue-name arm's only ≥50 % finding, so it is that arm's whole justification. |
| **Q4** | **FIX-D5, PRICED AS ORDERED, NOT FOLDED IN SILENTLY.** Live/dark measured: **3 live** (`(arcane underground)` 246 · `(smuggling)` 173 · `(covert)` 2 = 421 values on 260 of 525 rows), **9 dark**. **Price: +5 effective lines, +266 minified bytes.** It also earns its keep here: the dangle denominator excludes sentinels, and without the declared list that exclusion is a magic `startsWith('(')`. **Ride in EM-R6, or its own lane?** |
| **Q5** | **"NEVER TOUCHED" — written, or also read?** The removal's orphan kind 1 **reads** the NON_CASCADED matched-pattern path to decide whether a chain still names a surviving house (125 over 525); it writes nothing there. If "touched" forbids reading, kind 1 loses its only trigger and `OrphanKind` collapses to one — contradicting R6's "both OrphanKinds accepted". **Compiled as READ-ALLOWED. Confirm.** |
| **Q6** | **THE CHAIN LABEL, where two rulings point opposite ways.** R3(iii) cascaded `activeChains[].label` and R6 accepted the orphan kind that depends on it; **FIX-D1's noticed item 7 recommends re-classing it as catalogue vocabulary** (from `SUPPLY_CHAIN_NEEDS`, colliding on 168 of 6,676). §934.61 names neither. **Compiled the chair's way — CASCADED, `report-only`.** One word flips it. |
| **Q7** | **THE ANTI-VACUITY FLOORS ARE NOW THREE.** 38 declared → 36; 5 NON_CASCADED → 15; declared-but-unobserved rows 1 → 3. A1's floors are written as the measured values (≥40 shapes, ≥1 catalogue path, ≥4 normalised paths, plus the RED CONTROL's ≥1). **Confirm those are the floors the chair wants pinned**, since each is a number a later change must be allowed to raise but never to lower. |
| **Q8** | **THE OWNER'S, STILL OPEN (ODQ §934.59).** §3a is written to be cut. **YES** → the chair deletes §3a whole and nothing else moves. **NO** → the four `anchorKey` stores become a THIRD leaf (≈45 effective) or a follow-on packet and the budget row changes from 2 leaves to 3. Sharpener: all four containers are absent on 525 of 525 generated records. |
| **Q9** | **THE MEASURED PRICE OF FIX-D3'S DEFERRAL.** A rename leaves **175 pattern values over 525 rows** spelling the old catalogue label on the Economics tab's `Via` line. A2 asserts that residue **by count**, so it is declared rather than hidden — but EM-B1c would ship a rename that is total on every reference and **visibly partial on one derived line**. **Accept, or gate EM-B1c on FIX-D3 as well as on this packet?** |

## ⛔ EVERYTHING NOTICED AND NOT TOUCHED — each specific enough to slot

1. ⛔ **`economicState.compound.inst` IS A DOCUMENTED, OWNER-GATED FALSEHOOD AND THE EDITOR WILL MAKE IT WORSE.** The flags are stamped from the raw roster at generation and never recomputed, so `hasCourtSystem` stays true for a courthouse that was ruined (`economicState.js:51-62`, `ENGINE_DEFECT_DISPOSITIONS §4`). **Edit Mode adds a second way to falsify it: a DM who REMOVES the courthouse leaves `hasCourtSystem` true forever**, and DS-DEF-2 row 3 keys on exactly that pair. EM-R6 correctly does not touch it. **SLOT: a row on EM-B1a's or EM-C2's pre-proof — "what does a removal owe a stamped derivation?" — or an addendum to the §708.7 disposition naming the editor as a second writer.**
2. ⛔ **THE 12-CHAR-PREFIX PROCESSOR MATCHER IS THE ENGINE OF THREE READER-VISIBLE FALSEHOODS AND FIX-D3 CURES THE SYMPTOM, NOT THE MATCHER.** `computeActiveChains.js:39` `lowerName.includes(pattern.slice(0,12))` accepts `Thieves' guild chapter` for `"Thieves' guild (powerful)"` (312), `Access to parish church` for `"Parish church"` (96), `Great cathedral` for `"Cathedral"` (60). FIX-D3 stores the matched house's name; the matcher still mis-matches. **SLOT: a row inside FIX-D3's own packet, or EM-P1b's class.**
3. **`resourceAnalysis.resourceChains[].processingInstitutions[]` HAS NO UI READER** — 3,212 stored values (1,132 of them catalogue names) that no component or PDF slice reads; it exists as the exploitation partition's parent. **SLOT: a line in `docs/DEAD_CODE_DISPOSITION.md`, or one sentence on EM-R6's row 7 `why` recording that the NON_CASCADED ruling costs no reader anything.** (Already recorded on the row; the disposition doc is the un-done half.)
4. **`defenseProfile.institutions.garrison[].catalogId` NORMALISES ONTO A ROSTER NAME 40.3 % OF THE TIME** (170 of 422) and `institutions[].catalogId` 12.6 % (1,921 of 15,278) — below A1's 50 % predominance threshold, so the arm correctly does not sweep them in. But a future catalogue whose ids drift closer to its names would cross the line and red A1 for a non-defect. **SLOT: one sentence in A1's failure message telling a future reader that a `catalogId` path crossing the threshold is a catalogue-shape change, not a missing cascade row.**
5. **THE ORPHAN REPORT IS THE ONLY PLACE THE PACKET READS A `NON_CASCADED` PATH**, and nothing in the estate's vocabulary distinguishes "declared not to be written" from "declared not to be read". The distinction is now load-bearing for two of EM-C2's branches. **SLOT: a `kind` or a `readable` flag on `NON_CASCADED_SURFACES` rows, in whichever packet first needs the second reader — or Q5's answer written into `factionRename.js`'s ledger header as the estate's rule.**
6. **`availableServices.legal[].name` HOLDS A CATALOGUE NAME 105 TIMES AND IS RULED NON_CASCADED ON A 0-OF-703 MEASUREMENT** that was taken in version 1 and not re-run in version 3 (the row is unchanged, so nothing forced a re-run). It remains the one `NON_CASCADED` row whose reason rests on a figure older than this tip. **SLOT: a one-command re-measurement at the pre-proof, or an A6 arm that asserts the 0-of-703 property directly instead of trusting the ledger's prose.**
7. **NINE OF THE TWELVE SENTINEL SPELLINGS ARE DARK OVER THE WHOLE GOLDEN CORPUS** and `servicesGenerator.js:124-152` contains a block whose own comment says its conditions can never hold. FIX-D5 would pin the split; nothing else does. **SLOT: FIX-D5 (chair question 4), or a ratchet pinning the 3-live/9-dark split so a future generator edit cannot silently light one.**
8. **THE CORPUS EMITS 231 DISTINCT INSTITUTION NAMES AGAINST A 280-NAME CATALOGUE** — 49 catalogue institutions are never produced by any golden row, so every "total over the corpus" claim in this packet is total over 231 names, not 280. Both collision scans (231 emitted, 280 catalogue) were empty, so the cover is total for the collision claim specifically. **SLOT: one line wherever corpus coverage is asserted — the charter's EM-R6 row is the natural home.**
9. **318 ORPHAN `"Thieves' Guild"` AFFILIATIONS** (159 per home) sit in towns with no such faction and no thieves institution — `npcGenerator.js:1337`'s fallback. On no cascade's reach, naming nothing, and invisible to all three of A1's arms because the string is neither a roster name nor a catalogue name. **SLOT: FIX-D4, already chartered (measure-first, next composition train).**
10. **VERSION 2's PACKET IS IN THE KIT WITH THREE REFUTED FIGURES IN IT.** If the chair promotes from `packets-waiting/` rather than from this scratch, the 7,399 baseline, the "88", and the "sixteen baselines" travel with it. **SLOT: the chair's placement step — supersede `EM-R6.v2.*` explicitly, or delete it from the waiting set the same turn version 3 is accepted.**
11. **A1's STRIDE HAS NO HELPER AND VERSION 3 IS THE SECOND PACKET TO BUILD IT INLINE.** `tests/helpers/` has `goldenCorpus()` but no structured-sample helper; the 63-row stride is re-derived in the test file. **SLOT: TOOL-4, already chartered — but it now has two customers, which is worth recording on its row.**
12. **THE TWO `compound.inst` PATHS ARE ONE OBJECT AND THE WALKER ADDRESSES BY PATH**, so the ledger declares the same array twice and a future third stamp of the same object would red A1 for no new fact. **SLOT: either an `alias` field on a `NON_CASCADED` row, or a one-line note in the walker's failure message that aliased stamps declare once per path by design.**
