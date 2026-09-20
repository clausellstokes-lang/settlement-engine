# Settlement editor / EM-R6 — an INSTITUTION gets the rename cascade a faction already has, and a REMOVAL sweeps the same list

- **Status:** `DRAFT`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line.
- **Packet version:** 2
  > **WHAT VERSION 2 CHANGED AND WHY.** Re-compiled under the chair's rulings on version 1
  > (R1–R7) and re-measured whole at the build branch's newer tip `e5bdfd031`, where **EM-B1d
  > version 5 has LANDED**. **Not one verified fact about the tree was refuted:** the J-T1 window
  > over every change-manifest and `requiredSymbols` path is **EMPTY**, and the 525-row rename and
  > removal arms reproduce at the new tip with better numbers than version 1 measured.
  > Four things changed. **(1) THE SURFACE LIST GREW BY FOUR OBSERVED PATHS** — the chair ruled
  > all three of version 1's open polysemous rows CASCADED under the exact-match guard
  > (`spatialLayout.quarters[].landmarks[]`, `secondaryAffiliation` at BOTH homes, and
  > `economicState.activeChains[].label`), taking the cascade from 33 observed paths to **37**,
  > and `NON_CASCADED` from nine rows to **five**. **(2) THE BUDGET MOVED AND VERSION 1
  > UNDER-PRICED IT**: version 1 predicted "≈214" for the rename leaf; re-measured, the two
  > leaves are **219 + 65 = 284 effective** (version 1: 209 + 57 = 266) and **9,087 B minified**
  > (version 1: 7,936 B). Both leaves remain under the 250 cap and the packet under 400, so the
  > two-leaf shape the chair ratified still holds — but the figure is the measured one, not the
  > predicted one. **(3) A FIFTH REMOVAL KIND AND A SECOND ORPHAN KIND WERE FORCED BY THE NEW
  > ROWS**: the chain label is present on 6,676 of 6,676 chains, so removal cannot delete it —
  > it is `report-only`, and the loss is carried by a second declared orphan note
  > (`chain-label-names-a-removed-house`, measured **7 times over 525 removals**, 4 of them on a
  > chain that kept other processors). **(4) THE DISJOINTNESS ARM THE CHAIR ORDERED IS BUILT AND
  > EXECUTED**: over the full corpus, **1,828 `secondaryAffiliation` values — 708 institution-only,
  > 658 faction-only, 462 neither, and ZERO that are both.** Plus the brief's two newest steps
  > (14 and 15) are answered by measurement: no generator is among `checks`, and
  > `src/domain/factionRename.js` is **not** in the wiring census's `stamp.files`.
- **Verified base:** `__BASE__`
  > **THE REVALIDATION SENTENCE THE CHAIR STAMPS.** *Re-measured at `e5bdfd031` by the Opus
  > COMPILE lane (session 7d3418f8, 2026-09-19 ~19:4x–20:3x EDT). `ad7ddf2c9` is an ancestor;
  > the window `ad7ddf2c9..e5bdfd031` carries four commits (EM-B1d version 5's landing
  > `95e494bdb`, its packet flip `1feb5c9ba`, the fifth docs fold `63de6da75`, EM-B3c's placement
  > `e5bdfd031`) and **over every change-manifest and `requiredSymbols` path
  > `git diff --stat ad7ddf2c9 e5bdfd031` printed NOTHING.** Both CREATE targets are absent on
  > disk and unknown to git; all five `requiredSymbols` rows resolve verbatim. The read tree's
  > `git status --short` was EMPTY at the start and at the end. Evidence §1–§27.*
- **Last revalidated:** `__BASE__` — stamped by the chair at promotion, the window re-run in the same command as the stamp.
- **Depends on:** `NONE`.
  ⭐ **THIS PACKET FLOATS.** It CREATEs two leaves nothing imports yet and adds one `export` token
  to a third file. **PLACEMENT (the chair, R7): EM-R6 lands BEFORE EM-B1c, in the group after
  train EM-T6 — `EM-R6 → EM-B1c · EM-B1b · EM-B1g · EM-A3`.**
  ⛔ **EM-B1c CANNOT BE PROMOTED BEFORE THIS LANDS** — design §22.1 ruling 7 says so and the
  measurement says why: today a rename leaves the worst case's handles stale and nothing throws.
- **Collision group:** `NONE` — measured against the live registered manifest at `e5bdfd031`
  (**190 entries**): no entry, at any status, names `src/domain/institutionRename.js`,
  `src/domain/institutionRemoval.js`, `tests/domain/institutionRename.test.js`,
  `tests/domain/institutionRemoval.test.js`, `src/domain/factionRename.js` or `src/domain/clone.js`
  in a `changeManifest` or in `requiredSymbols` (evidence §18).
  ⚠ Registered entries only; the chair runs its own create/modify order check across the kit's
  DRAFTs at placement (R7).
  ⚠ One shared path with whichever train this joins: `tests/lint/.lighting-census-baseline.json`
  (that train's terminal act; deferred, never this packet's — §P2 row 1 as CORRECTED).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured at `e5bdfd031`. Executed: the 525-row identity census; the
  **525-row** rename and removal arms under the ruled 38-row list; the disjointness arm; the
  member-mirror control pair; the placement walk two ways; an effective-line counter with a
  **6/6 exact** control against `scripts/.size-baseline.json`; the minified byte price with
  esbuild 0.28.1. ⛔ **NO CENSUS ABSOLUTE IS QUOTED** — only the DELTA this packet causes (§7).
  No test was run by this lane.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
  > ⓘ **Verified by the compile lane at `e5bdfd031`:**
  > `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1`
  > (`shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md`) — **unchanged from
  > `ad7ddf2c9`.** Left unstamped by design.

---

## 0. The shape: ONE PACKET, TWO LEAVES (the chair's R5)

⛔ **ONE LEAF DOES NOT FIT.** The candidate written whole measures **261 effective lines** against
the standard's **250 per new leaf**, with a counter that reproduces eslint's `max-lines`
arithmetic **6/6 exactly** against `scripts/.size-baseline.json`. **The split is forced by a
measurement, not chosen.** Re-measured under the chair's R3 rulings:

| leaf | effective (v1 → v2) | minified (v1 → v2) | holds |
|---|---:|---:|---|
| `src/domain/institutionRename.js` | 209 → **219** | 6,176 → **6,999 B** | the declared 38-row surface list, the `NON_CASCADED` ledger, the shared primitives (exported), the rename cascade, its immutable form |
| `src/domain/institutionRemoval.js` | 57 → **65** | 1,760 → **2,088 B** | the removal sweep over the SAME list, the two-kind orphan report, its immutable form |
| **total** | 266 → **284** of 400 | 7,936 → **9,087 B** | 2 of the allowed 2 new logic leaves; both under 250 |

The removal leaf imports the vocabulary, the surface list and every primitive from the rename
leaf. **Nothing is declared twice.**

⭐ **THE CONSUMER MAP IS KEPT EXACTLY AS MEASURED, so the chair can still cut the packet in two
if a train needs only one half:**

| consumer | waits on |
|---|---|
| **EM-B1c** — the `rename-*` ops (§12.3) | **RENAME** only |
| **EM-B1a** — `set-institution-state`, the `removed` state | **REMOVAL** |
| **EM-R0c** — THE MERGE (design §22.3 ruling 10) | **REMOVAL** |
| **EM-R0b** — `recordInvariants`' referential checks | neither (it gates the removal; it does not import it) |

---

## 1. Reconciled authority

1. ⭐ **Design §22.1 ruling 7** — *"Renames never go through re-derivation … INSTITUTIONS GET A
   CASCADE: a declared institution rename-surface list, measured from the reference graph, is its
   own packet before any institution rename op is promoted. The 'no new dangling reference' gate
   is a delta against the record's own pre-existing dangles."*
2. **Design §22.3 item 10** (via §22.2 item 10) — *"A REMOVAL OWES THE SAME CASCADE A RENAME
   DOES … The institution rename-surface list (EM-R6) is also the list a REMOVAL sweeps, and
   `recordInvariants`' referential checks gate it."*
3. **Design §22.2 item 7** — the MIRROR class. ⛔ **A RENAME IS NOT A MERGE** (ruling 7), so no
   mirror recompute runs for a rename and the cascade must write both homes itself. §6 states the
   composition; A3 executes it.
4. **Design §20 ruling 2** — a `free-cascade` field applies ON SAVE even on canon: *"the rename
   runs the existing cascade and moves no world fact."* This packet is that cascade.
5. **Design §22.3 item 1** — the generation receipt is **classed BY PATH**: what it says about the
   ACT of generation is HISTORY, never merged, never recomputed. It governs
   `generationCoherenceReceipt.repairs[].subject`.
6. ⭐ **THE CHAIR'S RULINGS ON VERSION 1 (R1–R7, 2026-09-19).** R5 one packet two leaves; R2 export
   `NPC_HOMES`; R3 cascade all three open polysemous paths under the exact-match guard, with the
   disjointness made a walker ARM; R1 the dynamic-import obligation falls on the consumers; R6 the
   orphan report belongs here and this writer cannot refuse; R4 §3a stays conditional (ODQ §934.59,
   the chair recommends YES, the owner has not answered); R7 placement before EM-B1c.
7. **`EM-PREAMBLE.md`** (SHA-256 verified) §P2 rows 1–4 and 10–12, §P3, §P4, §P5 (HZ-JOINKEY,
   HZ-GOLDEN), §P6, §P7, §P8 — cited by hash, not restated.
8. **`src/domain/factionRename.js`** — THE ARCHITECTURE THIS COPIES, at `e5bdfd031`.
9. Live code and the executed 525-row corpus at `e5bdfd031`.

**Resolved contradictions (all closed by the chair on version 1's measurements):**

- *RECON-ID's "33 strict paths"* → the recon's prose says 33 and its list enumerates 32; the
  missing row is the subject's own `institutions[].name`. **Closed** (§5's reconciliation table).
- *RECON-ID's "mean 2.57 handles / 98.0 % referenced"* → those are **63-row sample** figures; over
  the 525-row corpus they are **2.49** and **96.8 %** (16,805 of 17,361). **Closed.**
- *Version 1's own `null`-writing removal contract* → **REFUTED BY MEASUREMENT** and replaced with
  DELETE-THE-KEY / DROP-THE-ENTRY (§6).
- *Version 1's "≈+5 effective lines" prediction for R3's rows* → **measured +10 and +8**; the
  packet quotes the measurement.

The implementer does not read other documents to reinterpret this packet.

---

## 2. Outcome

**Observable result:** `institutionRenameChanges(settlement, oldName, newName)` and
`institutionRemovalChanges(settlement, name)` exist as pure domain functions over ONE declared
surface list, so renaming or removing an institution rewrites or sweeps **every stored handle to
it**, at both of a character's homes, adding **zero new dangling joins of any kind**.

**Definition of done:** one frozen `INSTITUTION_RENAME_SURFACES` with a `why` and a removal rule
per row; one frozen `NON_CASCADED_SURFACES` with a written reason per row; an in-place and an
immutable form of each operation; a totality walker with its disjointness arm; and the executed
rename and removal arms on real pipeline records after a save→load round trip.

### ⛔ THE DEFECT, REPRODUCED AT THIS TIP BEFORE ANY FIX

```
$ git grep -rn "renameInstitution|applyInstitutionRename|institutionRenameChanges|INSTITUTION_RENAME" -- src tests
(no output)
```

**No institution rename or removal writer exists anywhere.** Executed on real pipeline data over
the full corpus, renaming the worst-case institution of each of 525 settlements leaves
**4,227 handles** pointing at a name that no longer exists. Nothing throws. Nothing is logged.

In scope: (1) the declared surface list and the rename cascade over it; (2) the required
integration — the removal sweep over the SAME list; (3) the prevention guard — the independent
totality walker **with the disjointness arm**.

Explicit non-goals: the ops that call these functions (EM-B1c, EM-B1a) and any store or surface
wiring; the `catalogId` re-stamp and every anchor consequence (§3a, owner-gated); `recordInvariants`
(EM-R0b); the merge (EM-R0c); the NPC and FACTION cascades, measured TOTAL and untouched; any
golden, tuning or migration. Record adjacent discoveries in the receipt; do not investigate them.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` — an institution's name is a join key | 1 |
| New persisted record families | `0` — no key is minted; the module is pure | ≤1 |
| **Named state writers** | ⭐ **`1`** — and the point is that it becomes the ONLY one | ≤1 |
| Feature flags / user-facing surfaces | `0` each (wave 1 is HEADLESS) | ≤1 each |
| Direct production consumers | **`0` at landing** (EM-B1c, EM-B1a, EM-R0c later) | ≤2 |
| **New logic-bearing production leaves** | **`2`** — forced by the 250-line cap (§0) | ≤2 |
| Existing logic-bearing production files modified | **`1`** (R2's one `export` token) | ≤3 |
| Handwritten files total | `5` (+1 deferred census row, the host train's) | ≤12 |
| **New/changed effective production lines** | **`285`** (219 + 65 + 1); cap ≤320 | ≤400 |
| Effective lines per new leaf | **`219` / `65`** | ≤250 |
| Delta in a shared/hot file | **`1`** — `factionRename.js` is **388 effective of 800**, **not** on the standing hot list | ≤15 |
| Acceptance cases | `8` | ≤8 |

Overrides approved before dispatch: `NONE` — the packet fits the default **because it splits**.

### §3.1 · Hot files and `max-lines` — MEASURED, not deferred

```
$ grep -n "factionRename\|institutionRename" docs/implementation/PACKET_STANDARD.md   → no hit
$ <lookup in scripts/.size-baseline.json>                                             → no entry
$ <every max-lines rule in eslint.config.js>  'src/domain/**/*.js' => max 800 (skipBlankLines+skipComments)
$ <counter, CONTROL 6/6 EXACT against scripts/.size-baseline.json>
    src/domain/factionRename.js              raw 960  EFFECTIVE 388   (headroom 412)
    candidate one-leaf (v1 rows)             raw 311  EFFECTIVE 261   ⛔ OVER the 250 leaf cap
    v2 split  institutionRename.js           raw 266  EFFECTIVE 219   ✅
    v2 split  institutionRemoval.js          raw  70  EFFECTIVE  65   ✅
```

⇒ **The split is forced by a measurement.** ⚠ **AND VERSION 1 UNDER-PRICED R3's ROWS**: it
predicted "≈214"; the measured figure is **219**, because the chain-label walk and R2's import
line were not in that estimate. The packet quotes the measurement.

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-R6
```

Expected: capsule emitted; ancestry and substrate proven; **all four CREATE targets ABSENT**;
`src/domain/clone.js` and `src/domain/factionRename.js` present and clean; every `requiredSymbols`
row resolving.

⚠ **THE WORKTREE IS SHARED AND THE BASE MOVES** — it moved twice during this compile. Re-read
`git rev-parse HEAD` in the same command as the dispatch. ⚠ Re-confirm disjointness against the
kit's DRAFTs, which are outside this packet's measured collision check (R7).

---

## 5. Verified tree contract

Every row re-found **by symbol** at `e5bdfd031`; the J-T1 window over every path is **EMPTY**, so
every line number below is unchanged from version 1 (evidence §1–§27).

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| ⭐ **THE ARCHITECTURE THIS COPIES** | `src/domain/factionRename.js` | `FACTION_RENAME_SURFACES` (`:241`), `NON_CASCADED_SURFACES` (`:281`), `NPC_HOMES` (`:168`) | one frozen list with a `why` per row; a frozen ledger of written rulings; the two homes declared ONCE and spread across both | **Copy the architecture exactly.** The only edit is R2's one `export` token |
| ⭐ **R2 — THE TWO HOMES, DECLARED ONCE FOR THE ESTATE** | `src/domain/factionRename.js` | `:168` `const NPC_HOMES = Object.freeze(['npcs[]', 'factions[].members[]'])` | not exported today; its own header states the law this packet also lives under — *"a field added for one home can never be forgotten at the other"* | **Add `export`.** The new leaf imports it as `INSTITUTION_HOMES`; the estate then has ONE declaration |
| ⭐ **THE SUBJECT HAS ONE NAME SPELLING** | the generated record | `institutions[].name` | **17,361 of 17,361** carry `name`; **0** carry `id`; **0** carry `localUid`; no alias | ⇒ **NO dual-write and NO accessor.** `factionRename.js`'s `nameOf` / FACTION-ACCESS LAW has **no counterpart here** and must not be invented |
| ⭐ **NO PROSE SURFACE EXISTS** | the whole-blob walk | all 37 cascade paths | every one is an **exact-name key join**; not one is prose, including the three rows R3 added | ⇒ ⛔ **`substituteWholeWord` is NOT imported.** The word-boundary hazard class the faction cascade carries **does not exist here** |
| **The only runtime import beside R2's** | `src/domain/clone.js` | `export function deepClone` (`:47`) | present, `grep -c` → 1 | Reuse; no second clone |
| ⛔ **A ZERO-SLACK NEIGHBOUR — IMPORT, NEVER MODIFY** | `src/domain/clone.js` | — | **IS in the generation worker's closure** (`WORKER_BUNDLE_CEILING_BYTES = 1401208`, EXACT/zero slack) **and in 3 of the 5 edge-shared metas** | ⛔ Modifying it would owe the worker re-mint AND seven generated `_shared` paths. Importing adds no byte to it |
| ⛔ **NOT IMPORTED, AND THAT IS MEASURED** | `src/lib/narrativeMutations.js` | `substituteWholeWord` | **IS in the generation worker's closure** | ⛔ Naming it would drag this packet into the zero-slack budget for a surface class that does not exist |
| **The member mirror** | the generated record | `factions[].members[]` | at generation the member **IS the same object** as the `npcs[]` record (**63/63**); on a reloaded save they are separate (**572 paired people, 0 disagreeing before any edit**) | Both homes walked with ONE declared field list |
| ⭐ **R3(ii)'s SAFETY, MEASURED OVER THE CORPUS** | the generated record | `{npcs[], factions[].members[]}.secondaryAffiliation` | **1,828 values: 708 institution-only, 658 faction-only, 462 neither, and ZERO that are BOTH.** This path is ALREADY a FACTION cascade row (`NPC_FACTION_FIELDS`, kind `key`) | Cascaded under the exact-match guard; **the disjointness is an ARM of the walker (A1)** so the day one value is both, it reds |
| ⭐ **R3(i)'s READER** | `src/domain/districtProfile.js` | `inferInstitutions` (`:392`) | joins an institution to a quarter when a >4-char stem of its name appears in the quarter's name/landmark haystack | A stale landmark silently un-homes the renamed house; the row is cascaded |
| ⭐ **R3(i)'s AMBIGUITY, PRICED** | `src/generators/spatialGenerator.js` | `:67, :85, :95, :167, :179, :191` vs `:105, :137, :147, :204, :214, :220` | the landmark list is built from **`instNames`** for six quarter kinds and from **fixed literal tables** for the rest | Measured corpus-wide: **1,604 of 1,664 (96.4 %) matches are roster copies; 60 (3.6 %) are fixed-table.** Declared in the module header as the row's known residue |
| ⭐ **R3(iii)'s SHAPE CONSTRAINT** | the generated record | `economicState.activeChains[].label` | **present on 6,676 of 6,676 chains** — absence is NOT a shape this record carries | ⇒ the rename rewrites it; the **removal CANNOT delete it** — rule `report-only` (§6) |
| ⭐ **THE `linkedInstitutionIds` ROW** | `src/generators/factionRoles.js` | `:245` `linkedInst.id \|\| linkedInst.name` | its own comment (`:228-234`) calls the name branch **"rename-sensitive"**; a generated institution has no `id`, so the value is **always the name** | A cascade row, rewritten as a **name LIST** so a mixed id/name list heals only its name half |
| **The consumer the join keeps alive** | `src/domain/entities/propagate.js` | `instId` (`:330`) | the estate's institution join is `i?.id \|\| i?.name` | Named so the cascade's purpose is provable from the manifest |
| **The anchor, and what a rename moves** | `src/domain/townMap/anchors.js` | `export function anchorForInstitution` (`:50`) | `cat:` → `uid:` → `name:`; **15,278 `cat:` / 2,083 `name:` / 0 duplicates** over 17,361 | ⛔ **NOT edited.** §3a states what a rename does to the 12 %, under both owner answers |
| **Test precedent — the denominator pin** | `tests/domain/factionRename.test.js` | `describe('faction rename — the INDEPENDENT denominator')` (`:189`) + its first `test` (`:190`) | walks the WHOLE blob on **RELOADED saves**; requires every shape found to be in one of the two lists; anti-vacuity floor `toBeGreaterThanOrEqual(14)` | **Copy this proof shape** |
| **Test precedent — the reload discipline** | `tests/domain/factionRename.test.js` | `reloaded()` (`:172`) | *"SAVES, NOT SETTLEMENTS … Testing the live object would reproduce the exact blindness that let the bug ship"* | Every fixture is JSON round-tripped |
| **Corpus precedent** | `tests/helpers/goldenMasterCorpus.js` | `goldenCorpus` (`:76`), `keyOf` (`:60`) | the 525-row master; **no structured-sample helper exists in `tests/`** | The stride is built in the test file (A1) |
| ⛔ **NOT a golden for this claim** | `tests/domain/factionRename.test.js` | the whole file | it pins the FACTION cascade only; **nothing in `tests/` pins an institution cascade** | Named so it is not counted as protection |

### ⭐ THE PATH-COUNT RECONCILIATION — three different numbers, each correct

| number | what it counts |
|---:|---|
| **42** | distinct paths the whole-blob walk finds holding an institution name, over 525 rows |
| **33** | of those, the CASCADE set at version 1 — 1 subject + 32 reference paths |
| **37** | the CASCADE set now: 33 + R3's four observed paths (landmarks, `secondaryAffiliation` ×2 homes, chain label). ⚠ The chair's "three paths" counts `secondaryAffiliation` once; the walk sees it at **both homes**, so the observed total rises by four |
| **38** | the rows the module DECLARES. The extra is `factions[].members[].linkedInstitutionIds[]`, declared for symmetry under the `NPC_HOMES` law though the corpus has not yet produced it — exactly as `factionRename.js` declares `${ROSTER}.name`, which **never exists on generated data** (0 of 3,378) |
| **5** | the `NON_CASCADED` ledger, down from nine |

**Forbidden alternatives:** ⛔ no second writer of an institution rename or removal; ⛔ no edit to
`src/domain/clone.js` or `src/lib/narrativeMutations.js` (both in the zero-slack worker closure);
⛔ no `substituteWholeWord` import and no prose surface; ⛔ no edit to `anchors.js` and no
`catalogId` re-stamp (§3a); ⛔ no new persisted key; ⛔ no `null`-writing removal (§6); ⛔ no
deletion of a chain `label` (present on 6,676/6,676); ⛔ no REFUSAL inside the writer (§P8);
⛔ no static import of either leaf from an eager or store module (§3b); no files outside the manifest.

### §3a · THE ANCHOR — CONDITIONAL, and correct under BOTH owner answers (R4)

The owner has been asked (**ODQ §934.59; the chair recommends YES**) and **has not answered**.

| fact | measurement |
|---|---|
| institutions anchored `cat:` | **15,278 of 17,361 (88.0 %)** — rename-STABLE |
| institutions anchored `name:` | **2,083 of 17,361 (12.0 %)** — a rename MOVES the anchor |
| duplicate anchors | **0** over all 525 rows |
| renames that moved the anchor (worst case per row) | **5 of 63 — every one of the `name:` class** |

**UNDER "YES" (re-stamp `catalogId`) — WHAT THE CHAIR DELETES:** this entire §3a, and nothing
else. No row of §6, §7, §9 or §10 mentions an anchor; no `requiredSymbols` row is removed
(`anchorForInstitution` stays pinned as the fact that makes §3a cuttable); the budget row does not
move. **One section, deleted whole.**

**UNDER "NO" — WHAT THE THIRD LEAF CONTAINS:** the cascade must carry the `anchorKey`-keyed edits
from the old anchor to the new one, for exactly four stores — ⭐ **all INSIDE the settlement
record**, so a cascade reaches them without touching the save row:

| store | shape | present on a GENERATED record? |
|---|---|---|
| `settlement.mapEdits.pins[].anchor` | `{ anchor, dx, dy }` | **no** |
| `settlement.mapEdits.sceneOverrides[].anchor` | `{ anchor, variantId?, skinId?, … }` | **no** |
| `settlement.interiorEdits` | **the OBJECT KEY is the institution anchor** | **no** |
| `settlement.fogSessions[].buildings[]` | a list of `anchorKey` strings | **no** — ⚰ writer RETIRED (`operationRegistry.js:340-346`); legacy saves only |

⭐ **All four are absent on 525 of 525 generated records** (the DORMANCY law: *"absent ⇒
byte-identical … nothing in this module or the pipeline creates a container; only a real user
edit does"*). ⇒ the exposure is only a save a DM has **already** edited.
⛔ **IT DOES NOT FIT HERE:** the rename leaf is at **219 of 250**, so under NO the four rows are a
**THIRD leaf** (`institutionAnchorCascade.js`, ≈45 effective by the same four-walk shape) **or a
follow-on packet**, and the budget row changes from 2 leaves to 3. **RAISED R4.**

⛔ **NOT IN THIS PACKET EITHER WAY.** A rename also re-seeds the glyph
(`townMap/glyphAssign.js:125`, `createPRNG('glyph:<name>')`) — design §21.5 ruling 7 routes that
site, `assembleInstitutions.js:745` and `npcData.js:1334` to **EM-P1b's class**, and the charter
already forbids promoting EM-B1c before they land.

### §3b · PLACEMENT — ⛔ A BINDING NOTE TO EM-B1c, EM-B1a AND EM-R0c (the chair's R1)

Measured at `e5bdfd031`, two ways (evidence §14):

| budget | rule / instrument | `factionRename.js` | this packet's two leaves |
|---|---|---|---|
| first-paint eager closure | the repo's OWN `EAGER_FIRST_PAINT_MODULES` (268 modules; control `settlementSlice.js` = eager ✓) | **NOT eager** | **not eager** — nothing imports them |
| generation worker (**zero slack**) | static 220 / static+dynamic 228 modules from `src/workers/generation.worker.js` | **absent** | **absent** |
| lazy engine (`< 679_000`) | `id.includes('/src/generators/')` (`vite.config.js:862`) | **not in `engine`** | **not in `engine`** |
| edge-shared (5 metas, **307 inputs**) | INPUT membership | **0 of 307** | **0 of 307** |

⇒ **THIS PACKET IMPORTS NOTHING AT RUNTIME AND IS IN NO CHUNK UNTIL A CONSUMER LANDS.**

⛔ **THE BINDING NOTE.** `factionRename.js`'s own door test records the history
(`tests/build/factionRenameDoorLazy.test.js`): *"`src/domain/factionRename.js` did ride the
first-paint closure … Measurement overruled the reasoning: the 'dependency-light pure leaf' was
**8,574 B minified**, and the first-paint ratchet went over budget."* The cure was
`await import('../domain/factionRename.js')` at the call seam
(`settlementRenameHelpers.js:326`, `:430`). **These two leaves are 9,087 B minified together —
larger than the module that broke that ratchet.** ⇒ **EM-B1c, EM-B1a and EM-R0c each price, at
their own pre-proof, how they import these leaves without entering first paint**, and each owes a
door test in `factionRenameDoorLazy.test.js`'s shape. **It must not be discovered at their build.**

---

## 6. Exact contracts

### Inputs and outputs

```js
/** @typedef {{ [key: string]: unknown }} StoredRecord */
/** @typedef {{ kind: OrphanKind, path: string, chainId: string|null }} OrphanNote */
/** @typedef {'chain-lost-its-last-processor'|'chain-label-names-a-removed-house'} OrphanKind */

/** PURE. Mutates the settlement it is HANDED (the caller owns the draft), never reaches outside it. */
export function applyInstitutionRenameToSettlement(settlement, oldName, newName)
  // → { changed: boolean, touched: string[] }

export function applyInstitutionRemovalToSettlement(settlement, name)
  // → { changed: boolean, touched: string[], orphaned: OrphanNote[] }

/** The IMMUTABLE forms: only the touched top-level buckets, deep-cloned, ready to spread. */
export function institutionRenameChanges(settlement, oldName, newName)
  // → { changed: boolean, touched: string[], changes: StoredRecord, orphaned: [] }

export function institutionRemovalChanges(settlement, name)
  // → { changed: boolean, touched: string[], changes: StoredRecord, orphaned: OrphanNote[] }
```

**Absence rules.** `changed: false` with `touched: []`, `changes: {}` and `orphaned: []` for: a
non-record settlement, an empty name, `oldName === newName`, and a name no record holds. ⛔ **A
no-op is never a throw and never a partial write.** `touched` names only surfaces that ACTUALLY
moved, so it is a receipt, not a plan.

⛔ **`OrphanKind` IS A CLOSED VOCABULARY OF TWO** — the op's guard engine (EM-C2) branches on it.
Measured at the tip: **neither literal occurs anywhere in `src` or `tests`**, and no `orphaned:`
key exists, so neither collides (evidence §20).

### ⛔ THE MATCH RULE, ONE RULE FOR ALL 38 ROWS

`value.trim() === oldName` — trimmed both sides so an incidentally-padded value still joins,
**NOT case-folded**, copied verbatim from `factionRename.js`'s `isSameName` (`:388`) and for the
same reason: two institutions may legitimately differ only in case and folding would rename the
wrong one.
⚠ **THE COST, MEASURED AND ACCEPTED ON RECORD:** the free-vocabulary string **`"Thieves' Guild"`**
appears 88 times at `secondaryAffiliation` beside the catalogue institution **`"Thieves' guild"`**
— one character of case. Those do not move and **must not**. The chair has slotted it to **FIX-D1**.

### THE SURFACE TABLE — 38 declared rows (37 observed cascade paths)

| # | path | match | rewrite | REMOVAL | corpus count |
|---:|---|---|---|---|---:|
| 1 | `institutions[].name` | exact | set | **DROP THE RECORD** | 17,361 |
| 2–12 | `availableServices.{equipment,legal,healing,employment,entertainment,food,lodging,magic,information,transport,criminal}[].institution` | exact | set | **DROP THE ENTRY** (`institution` on 25,628/25,628 ⇒ absence is not a shape this record carries) | 7101 · 5001 · 2694 · 2221 · 1883 · 1456 · 1318 · 907 · 886 · 879 · 861 |
| 13 | `economicState.activeChains[].processingInstitutions[]` | exact, per item | set item | **DROP THE ITEM** | 7,982 |
| 14 | `economicState.tradeDependencies[].institution` | exact | set | **DROP THE ENTRY** (2,444/2,444) | 2,444 |
| 15 | `resourceAnalysis.gaps[].institution` | exact | set | **DELETE THE KEY** (already absent on 923/2,982) | 2,059 |
| 16 | `economicState.activeChains[].dependency.institution` | exact | set | **DELETE THE `dependency` OBJECT** (already absent on 5,515/6,676) | 1,161 |
| 17–23 | `defenseProfile.institutions.{garrison,magicDef,walls,watch,charter,mercenary,militia}[].name` | exact | set | **DROP THE ENTRY** (the entry IS the institution) | 451 · 370 · 354 · 273 · 171 · 59 · 12 |
| 24 | `resourceAnalysis.resourceChains[].processingInstitutions[]` | exact, per item | set item | **DROP THE ITEM** | 327 |
| 25–26 | `resourceAnalysis.exploitation.{fullyExploited,partiallyExploited}[].processingInstitutions[]` | exact, per item | set item | **DROP THE ITEM** | 171 · 156 |
| 27–28 | `{npcs[], factions[].members[]}.institution` | exact | set | **DELETE THE KEY** (already absent on 4,874/5,171) | 297 · 297 |
| 29–32 | `{npcs[], factions[].members[]}.corruptTies.{thievesGuild,criminalInstitution}` | exact | set | **DELETE THE KEY** (parent already absent on 4,817/5,171) | 354 × 4 |
| 33–34 | `{npcs[], factions[].members[]}.linkedInstitutionIds[]` | exact, per item | set item | **DROP THE ITEM** | 25 · **0 — declared, not yet observed** (the `NPC_HOMES` symmetry law) |
| ⭐ 35 | **`spatialLayout.quarters[].landmarks[]`** (R3 i) | exact, per item | set item | **DROP THE ITEM** | 1,664 |
| ⭐ 36–37 | **`{npcs[], factions[].members[]}.secondaryAffiliation`** (R3 ii) | exact | set | **DELETE THE KEY** (already absent on 4,257/5,171) | 354 · 354 |
| ⭐ 38 | **`economicState.activeChains[].label`** (R3 iii) | exact | set | ⛔ **REPORT-ONLY — the label STANDS** (present on 6,676/6,676; deleting would mint a new shape) and the loss is carried by an `orphaned` note | 168 |

⭐ **THE REMOVAL RULE IS THE RECORD'S OWN MEASURED ABSENCE SHAPE — NEVER A NULL.** Version 1's
first draft wrote `null` into rows 14–16 and 27–32; the census refuted it (the generator already
omits those keys on most records, so deleting returns the record to a shape it carries while
`null` mints a new one for every tolerant reader to meet for the first time).

**FIVE removal kinds, all five observed firing** over 525 removals: `drop-record`, `drop-entry`,
`drop-item`, `delete-key`, `delete-dependency-object` — plus `report-only`, which by definition
changes nothing and emits a note.

### THE `NON_CASCADED` LEDGER — five rows, down from nine

| path | holds an institution name | total | rate | ruling |
|---|---:|---:|---:|---|
| `simulationTrace[].downstreamEffects[].target` | 708 | 39,338 | 1.8 % | **the generation RECEIPT.** The identical ruling `simulationTrace[].causes[].reason` carries in `factionRename.js:288`. Corroborated: the non-matching values are record KEYS (`defenseProfile`, `history`, `conflicts`, `factions`, `relationships`) |
| `generationCoherenceReceipt.repairs[].subject` | 283 | 408 | 69.4 % | **design §22.3 item 1 — HISTORY BY PATH.** *"What it says about the ACT of generation — `repairs[]` … — is HISTORY, never merged, never recomputed."* THE PROMISE: lived history is immutable |
| `availableServices.legal[].name` | 105 | 5,001 | 2.1 % | ⭐ `name === institution` on **0 of 703** entries — when the service's name matches a roster house it is a **DIFFERENT** house (28 of 28). The entry's handle is its sibling `institution`, which is row 3 |
| `resourceAnalysis.resourceConditions[].label` | 108 | 2,816 | 3.8 % | ⭐ the SAME literal (`"Stone quarry"`) appears both matching and non-matching ⇒ a fixed condition word, not a reference. Exactly the ruling `economicState.safetyProfile.criminalInstitutions[]` carries in `factionRename.js:289` |
| `economicState.activeChains[].resource` | 60 | 2,834 | 2.1 % | the resource's display label, keyed by its own `resourceKey` (every match is `"Stone quarry"` with `resourceKey: "stone_quarry"`). The key is the identity |

### ⭐ HOW THE CASCADE AND THE MIRROR COMPOSE (design §22.2 item 7)

The design classes `factions[].members[]` as a **MIRROR** — "a pure function of held facts, so it
is RECOMPUTED after the merge, never merged". **That recompute does not run for a rename**:
§22.1 ruling 7 rules that renames never go through re-derivation, and §20 ruling 2 applies a
`free-cascade` field ON SAVE. ⇒ **the cascade itself is the only thing that can heal the member
chip**, so it writes both homes with ONE declared field list, and any later mirror recompute is
then a no-op rather than a second answer.

Measured on RELOADED saves, joined **per person by the NPC's own `id`** (evidence §12):

```
aliasedAtGeneration       63/63   the member IS the npc object in memory
pairedPeople              572     of whom 0 disagree before any edit          ← clean baseline
memberOnlyPeople          0       members[] is a strict SUBSET of npcs[] (39 npc-only)
ONE-HOME walk (npcs[] only)   44 of 63 rows carry a disagreeing person   ← the defect, reproduced
TWO-HOME walk (the cascade)    0 of 63                                   ← the cure, executed
```

### Determinism, lifecycle, flags

- Hash/fork key: **NONE.** No draw, no clock, no locale, no `Math.random`. Pure and total.
- Stable enumeration: the declared list's own order; the removal walks arrays **backwards** so a
  splice cannot skip a neighbour.
- Flag: **NONE** (wave 1 is headless; the tier gate is the op's).
- Lifecycle: **create** — nothing; **read** — only keys the generator demonstrably writes;
  **persist** — no new key, ever; **reload** — the whole point; **regenerate** — untouched;
  **undo** — the store's snapshot, never an inverse sweep; **import/migrate** — nothing owed;
  **public veil** — nothing new crosses.
- **Golden posture: ⛔ UNCHANGED, and free by construction** — two pure functions nobody calls.
  A8 executes the digests anyway (§P3.1 makes motion a STOP).

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/institutionRename.js` | `INSTITUTION_RENAME_SURFACES`, `NON_CASCADED_SURFACES`, `applyInstitutionRenameToSettlement`, `institutionRenameChanges`, and the primitives the removal leaf imports | **≤250 eff; measured 219** | Copy `factionRename.js`'s architecture exactly: the frozen 38-row list with a `why` AND a `removal` per row; the frozen 5-row ledger; the minimal-clone immutable form. ⛔ Import `deepClone` and `NPC_HOMES` ONLY. ⛔ No `substituteWholeWord`, no `nameOf`, no prose surface, no `null` write |
| `CREATE` | `src/domain/institutionRemoval.js` | `applyInstitutionRemovalToSettlement`, `institutionRemovalChanges` | **≤90 eff; measured 65** | Import the vocabulary, the surface list and every primitive from the rename leaf — **declare nothing twice.** The five removal rules plus `report-only`, and the TWO-KIND `orphaned[]` report |
| `CREATE` | `tests/domain/institutionRename.test.js` | A1, A2, A3, A6, A7, A8 | `n/a` | ONE literal `describe`, **six straight-line `it`**, no `.each`/`runIf`/nesting (§P3.4 and brief step 14b, so the file lands CREDITED). Every fixture JSON round-tripped through a `reloaded()` copy of `tests/domain/factionRename.test.js:172`. Negatives carry `// anchored:` on the line immediately above |
| `CREATE` | `tests/domain/institutionRemoval.test.js` | A4, A5, and the removal halves of A6, A7 | `n/a` | ONE literal `describe`, **four straight-line `it`**, same discipline |
| `MODIFY` | `src/domain/factionRename.js` | `:168` `const NPC_HOMES` → `export const NPC_HOMES` | **≤1 eff** | ⭐ **R2, RULED: take it.** The estate then has ONE declaration of the two homes for both cascades. ⛔ Nothing else in this file is touched |

Generated artifacts: `NONE`. ⭐ **And that is a MEASUREMENT** — the edge-shared row below.

⛔ **THE TEST FILE BASENAMES ARE PART OF THE CONTRACT.** `institutionRename.test.js` and
`institutionRemoval.test.js` match **none** of `NAME_PATTERN`'s sixteen tokens (executed against
`tests/lint/mutationCoverage.shared.mjs`: both `false`; `institutionRenameContract.test.js` and
`institutionRenameCensus.test.js` both `true`). Renaming either to carry `contract`, `census`,
`walker` or `pin` would **silently create a mutation-coverage obligation** this manifest does not
carry.

### The registration ledger — every row priced against `e5bdfd031`

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — `+2 files`, INTERIOR RED** | ⛔ No absolute is quoted (§P2 row 1 as CORRECTED). The DELTA, derived from this packet's own CREATE rows: **`+2 files / +0 parked / +2 credited / +10 titles / +2 suiteTitles`**. ⭐ **THE ACCOUNTING IS CONFIRMED FROM THE WALKER ITSELF** (brief step 14b): `titles` sums `liveTitlesIn(src)` and `suiteTitles` sums `liveSuiteTitlesIn(src)`, both over CREDITED files only, and its own comment reads *"A CREDITED SUITE'S TITLE IS NOT EVIDENCE — it goes to `suiteTitles`"* ⇒ the ten `it`s are titles and the two `describe`s are suiteTitles. Both files are NEW and register straight-line literal `it`s under ONE literal `describe`, so they land CREDITED rather than parked. Corroborated against EM-B1e's `+1/+0/+1/+7/+1` for one file with seven `it` |
| P2.2 | mutation-coverage row | **NOT OWED — EXECUTED** | `tests/domain` ∉ the eight `ENFORCER_DIRS`; **neither basename matches `NAME_PATTERN`** |
| P2.3 | observed-shape exemption | **NOT OWED — no save-time key is read** | No `dmLayer`, no `decrees`. ⚠ The register is a per-file, per-finding-IDENTITY ceiling and **a NEW FILE has ceiling 0**. Every key read is measured PRESENT in the corpus under the instrument's own UNION rule (`dependency` 1,161/6,676, `corruptTies` 354/5,171, `secondaryAffiliation` 914/5,171, `linkedInstitutionIds` 287/5,171 — situational, therefore written). In `checks`; **motion is a STOP.** ⚠ **PLAUSIBLE, not CONFIRMED — the build lane executes it** (§12) |
| P2.4 | writer-reach | ⚠ **MEASURE AND RECORD — never write** | No new key is written ⇒ no new DARK identity. Adding readers can only SHRINK. A shrink is banked by the CHAIR through the instrument's own `--write` door; **GROWTH is a STOP.** ⚠ **PLAUSIBLE — the build lane executes it** (§12) |
| P2.5 | decision-fork / mechanism-coverage | **NOT OWED** | No seeded chooser, no pool, no `rollFrom`, no draw |
| P2.7 | prose-numerics, and every line-addressed register | **NOT OWED — SWEPT** | No figure is rendered. ⭐ **Brief step 13, executed:** `src/domain/factionRename.js` — the packet's only MODIFY — appears in **NONE of the sixteen `tests/lint/.*-baseline.json` files** (all `grep -c` → 0), so no register addresses it by line and the exact-identity hazard cannot fire |
| ⭐ | **STAMPED FILES (brief step 15)** | ⭐ **NOT OWED — MEASURED** | `docs/content/wiring-census.json`'s `stamp.files` holds **7 entries, all under `src/domain/display/stateProse/`**. `src/domain/factionRename.js` is **not stamped**, so `tests/lint/proseWiringCensus.walker.test.js` cannot red on `stale-bytes` and the census JSON is **not** a change-manifest row |
| ⭐ | **edge-shared closure (§P2 row 10)** | ⭐ **NOT OWED — MEASURED** | Both CREATE paths are new files nothing imports, and the model `factionRename.js` appears in **0 of 307** inputs across the five committed metas. ⇒ no rebuild, and none of the seven generated `_shared` paths is in this manifest |
| ⭐ | **bundle budgets (§P2 row 11)** | ⭐ **NO BUDGETED CHUNK — no TEST row, no build step** | §3b, measured two ways. Bytes priced anyway: **6,999 + 2,088 = 9,087 B minified** (esbuild 0.28.1). ⛔ **THE CURE IS THE PLACEMENT** and R1 makes it the consumers' |
| ⭐ | **declared-command write set + `checks` ORDER (§P2 row 12; brief step 14a)** | **CLEAN — AND NO GENERATOR IS AMONG `checks`** | Every command in `checks` was read for what it WRITES. `check-observed-shape-readers.mjs` and `check-writer-reach.mjs` are invoked as **readers** (no `--write`, no `--genesis`, no `--rebank`); `implementation-packets.mjs validate` writes nothing. ⇒ **no generator runs, so step 14a's "a generator goes LAST" has nothing to order** — recorded as a measurement, not an omission |
| ⭐ | **`tests/` sweep (§P2 row 12, second half)** | **NO TEST PATH OWED** | Swept by LITERAL: `institutionRename`, `institutionRemoval`, `INSTITUTION_RENAME_SURFACES`, `applyInstitutionRename`, `chain-lost-its-last-processor`, `chain-label-names-a-removed-house` and the key `orphaned:` are **absent from `src/` and `tests/` entirely**. `NPC_HOMES` occurs only inside `factionRename.js`; no test pins its declaration form, so R2's `export` retires nothing. **And the set-consequence question:** this packet adds no member to an existing named set; it CREATES two lists and one two-value `OrphanKind` vocabulary whose only consumers are its own leaves, its own tests, and (later) EM-C2's guard engine |

> ⛔ **THE CENSUS ROW IS DEFERRED** — no edit; the manifest omits the path. Predicted interior
> red, SHAPE ONLY: `the estate's file count moved — re-measure, do not re-word: expected <N> to be <N-2>`.

---

## 8. Ordered coding sequence

0. Dispatch and seal; re-read `git rev-parse HEAD` in the same command; re-confirm disjointness
   against the kit's DRAFTs (R7).
1. **Capture the baselines.** (a) `sha256` of `tests/fixtures/generator-golden-master.json` and of
   the prose-manifest fixture; (b) `node scripts/check-writer-reach.mjs` and
   `node scripts/check-observed-shape-readers.mjs`, **recorded, never written** — ⭐ **their
   verdicts are this lane's PLAUSIBLE predictions and the build lane's to CONFIRM** (§12);
   (c) ⭐ **the pre-fix defect, captured**: over A1's stride, the worst-case institution per row
   and its handle count — expect **4,227 handles over 525 rows / 550 over the 63-row stride**.
   This is A2's oracle and it must exist BEFORE the fix.
2. Add both test files with A1–A8 **failing**.
3. Implement `src/domain/institutionRename.js`.
4. Implement `src/domain/institutionRemoval.js`, importing everything shared.
5. Apply R2's one `export` token to `src/domain/factionRename.js`.
6. Registrations: none owed (§7). The prevention guard is A1's totality walker **and its
   disjointness arm**.
7. Run focused verification (§10), including the writer-reach and observed-shape comparison
   against step 1.
8. Run the wave-end gate per the host train's plan; write the completion receipt.

**Bounded algorithm (the cascade):**

```text
1. Guard: not a record, empty name, or oldName === newName ⇒ { changed: false, touched: [] }.
2. For each declared surface, in the list's own order, visit its stored container and
   compare `String(value).trim() === oldName`.
3. On a match: set (scalar) or set-the-item (string list). Mark the surface touched.
4. Both NPC homes are walked with ONE declared field list; a nested parent record must
   ALREADY exist and is never minted.
5. Return { changed: touched.length > 0, touched }.
```

**Bounded algorithm (the removal sweep):** the identical walk; at step 3 apply the row's declared
removal rule (DROP THE RECORD · DROP THE ENTRY · DROP THE ITEM · DELETE THE KEY · DELETE THE
`dependency` OBJECT · REPORT-ONLY), walking arrays BACKWARDS; and append an `orphaned` note when
a `processingInstitutions` list is emptied by the drop, or when a chain's `label` names the
removed house — **and continue.**

---

## 9. Acceptance matrix

| ID | Case | Required observation |
|---|---|---|
| **A1** | ⭐ **THE INDEPENDENT DENOMINATOR (the prevention guard) — WITH ITS DISJOINTNESS ARM** | **(i)** A walk of the WHOLE settlement blob over the **63-row structured sample** (measured wall-clock **1,223 ms**, 2,428 institutions, all six tiers) reports the path shape of every string exactly equal to a roster institution name, and **every shape must appear in `INSTITUTION_RENAME_SURFACES` or in `NON_CASCADED_SURFACES`.** It copies `tests/domain/factionRename.test.js:190` and **never reads the module's declarations for its denominator**. ⭐ Anti-vacuity FIRST: **≥40** distinct shapes (measured **42**) and **≥2,000** institutions. **(ii) ⭐ THE DISJOINTNESS ARM (the chair's R3 ii):** no `secondaryAffiliation` value may be BOTH a roster institution name and a roster faction name — measured over the full corpus, **1,828 values: 708 institution-only, 658 faction-only, 462 neither, ZERO both.** A field shared by two cascades is lawful only while their match sets are disjoint, **so the day one value is both, this reds.** Its own anti-vacuity floor: the arm must see **≥1,000** values and **≥1** of each single-class kind |
| **A2** | ⭐ **THE RENAME IS TOTAL ON REAL PIPELINE DATA — the packet's central claim** | For each row of the stride, on a **RELOADED save**, rename the institution carrying the most cascade-row handles. **Measured over 525 rows: 4,227 handles before; ZERO still spelling the old name on ANY of the 38 declared rows; ZERO new dangling joins.** The only residue is on the five declared `NON_CASCADED` paths (528 occurrences: `downstreamEffects[].target` 468, `resourceConditions[].label` 48, `activeChains[].resource` 12). ⭐ Guard-the-guard: assert `handlesBefore > 0` and `changed === true` **before** the staleness assertion |
| **A3** | ⭐ **THE MEMBER MIRROR — proved by a CONTROL PAIR, not asserted** | Joined **per person by the NPC's own `id`**, on a reloaded save: (i) baseline — **572 paired people, 0 disagreeing before any edit**; (ii) ⛔ the NEGATIVE CONTROL — a one-home walk (`npcs[]` only) leaves a disagreeing person in **44 of 63 rows**; (iii) the cascade's two-home walk leaves **0 of 63**. The control is required: without it "both homes agree" is true of a fixture where neither moved. ⓘ `factions[].members[]` is a strict SUBSET of `npcs[]` (39 npc-only, 0 member-only), so the comparison must be per person — comparing the lists wholesale reports a false 30/63 |
| **A4** | ⭐ **THE REMOVAL SWEEPS THE SAME LIST — the DELTA-BY-KIND gate** | Removing the same institution adds **ZERO new dangling joins of any kind**, measured **against the record's own pre-existing baseline, never an absolute** (design §22.1 correction 6). ⛔ The baseline is real and large: over 525 rows the pre-existing strict dangles run **thorp median 11 · hamlet 11 · village 8 · town 15 · city 23 · metropolis 18**, concentrated in five paths. **An absolute gate reds on arrival.** ⭐ All **five** removal kinds must be observed firing (measured: all five, over 525 removals), or the arm is vacuous on a fixture whose institution carries only one kind of handle |
| **A5** | ⭐ **THE ORPHAN REPORT IS A REPORT, NOT A REFUSAL — AND IT HAS TWO KINDS** | **(i)** A chain whose LAST processor is the removed house is reported as `{ kind: 'chain-lost-its-last-processor', … }` — measured **304 over 525 removals**. **(ii)** A chain whose `label` names the removed house is reported as `{ kind: 'chain-label-names-a-removed-house', … }` and **the label is NOT deleted** (present on 6,676/6,676 — deleting would mint a new shape) — measured **7 over 525 removals, 4 of them on a chain that kept other processors.** ⛔ The sweep COMPLETES in both cases: `EM-PREAMBLE` §P8 makes "a guard would refuse rather than offer `proceed`" a STOP and design §2.7 makes guards suggestive, so **this writer cannot refuse**; whether the DM is warned, offered a fulfilment or allowed to proceed is **EM-C2's** judgment (the chair's R6). Asserted with its negative: `changed` is still true and no path is left half-swept |
| **A6** | **WHAT IT MUST NOT TOUCH** | A sibling institution keeps its name. Every declared `NON_CASCADED` path is **byte-identical** before and after, asserted by name — the two receipts especially. **No record GAINS a key it did not carry** (deep key-set equality). ⭐ **And the chain `label` survives a REMOVAL** (row 38's `report-only` rule), asserted directly. A no-op rename reports `changed: false`, `touched: []` and mutates nothing. Every negative carries `// anchored:` on the line above |
| **A7** | **THE IMMUTABLE FORMS** | `institutionRenameChanges` and `institutionRemovalChanges` return **only the touched top-level buckets**, never mutate their input (deep-equal against a pre-call clone, plus `not.toBe` on every returned bucket), carry the **same `touched` set** as the in-place forms, and the removal form carries the **same `orphaned` notes** |
| **A8** | **GOLDEN POSTURE UNCHANGED** | `generatorGoldenMaster` and `dossierProseManifest` bytewise unchanged, asserted as the fixture digests before and at the tip. Free by construction — two pure functions nobody calls — and executed anyway, because §P3.1 makes motion a STOP |

**8 of ≤8.**

---

## 10. Verification commands

```sh
npx eslint src/domain/institutionRename.js src/domain/institutionRemoval.js \
  src/domain/factionRename.js \
  tests/domain/institutionRename.test.js tests/domain/institutionRemoval.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/institutionRename.test.js tests/domain/institutionRemoval.test.js \
  tests/domain/factionRename.test.js tests/domain/npcRename.test.js

# The goldens §P3.1 makes a STOP.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

# R2 touches a file two store suites pin.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/factionRenameConvergence.test.js tests/store/settlementSlice.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js

node scripts/check-observed-shape-readers.mjs   # compare against step 1; MOTION IS A STOP
node scripts/check-writer-reach.mjs             # compare against step 1; RECORD, never --write
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-R6
npm run implementation:resume -- EM-R6
npm run check:tail
```

⭐ **No generator is among these commands** (brief step 14a), so nothing re-stamps a declared path
mid-chain and no step is ordered last for that reason.
Expected: every command exits `0`, **except** the named census interior red until the host train's
terminal. ⛔ Never read a gate through a shell pipe (§P7). ⛔ Never wrap `npm run check` in the
mutex. ⛔ `gate-mutex.sh` gives up after its poll budget and **exits 0** — a gate line with no
printed test count DID NOT RUN.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: the seal is missing or foreign; HEAD is not
the stamped base or a descendant proved non-interfering; **a golden or the prose manifest moves**;
`check-observed-shape-readers` moves; `check-writer-reach` shows **growth**; either leaf exceeds
**250 effective lines** (measured 219 / 65); a **third** leaf appears necessary (that is §3a's
anchor walk — it **returns to the chair**, R4); a `null` would have to be written where §6 says
DELETE; a chain `label` would have to be deleted (6,676/6,676 — absence is not a shape this record
carries); the removal would have to **REFUSE** rather than report (§P8 forbids it); a THIRD
`OrphanKind` appears necessary (the vocabulary is closed at two and EM-C2 branches on it);
`substituteWholeWord`, `nameOf` or any prose surface appears necessary; `src/domain/clone.js` or
`src/lib/narrativeMutations.js` appears to need editing (**both are in the zero-slack
generation-worker closure**); anything in `factionRename.js` beyond `:168`'s one token appears to
need editing; `anchors.js`, `catalogId` or any map/interior/fog container appears to need editing
(§3a is owner-gated); a persisted key would be minted; **A1's disjointness arm reds** (a
`secondaryAffiliation` value that is both an institution and a faction name is a NEW measurement
and the chair's, not the build lane's); or A1's walk finds a path in **neither** list.

⛔ **AND THE ESCAPE HATCH THAT IS NOT AVAILABLE:** "put it all in `factionRename.js`" — that file
is **388 effective of 800** and would take the 284, but it is the estate's **faction and person**
rename writer and its header, its tests and `tests/lint/ruinFilterRoster.walker.test.js:159` all
describe it as such. Merging a third entity's cascade into it is an architecture change, not a
budget cure. **If it is wanted, the packet RETURNS TO THE CHAIR.**

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · **the effective-line count of each new leaf, measured
with a counter proved against `scripts/.size-baseline.json` (expect 219 / 65 of 250)** · exact
changed files and effective-line deltas · ⭐ **the pre-fix defect captured at step 1, quoted:
handles before and stale after, per row** · ⭐ **A2's zero-stale and zero-new-dangle figures, with
the per-row dangle BASELINE beside them** · ⭐ **A3's control pair quoted: one-home 44/63 red,
two-home 0/63 green** · ⭐ **A4's five removal kinds each observed, and A5's two orphan kinds with
their counts** · ⭐ **A1's full shape list quoted whole, its anti-vacuity floor's actual value, and
THE DISJOINTNESS ARM's four counts** · the mutants planted, convicted and restored digest-exact
(§P6) · focused commands, exits and counts · ⭐ **`node scripts/check-observed-shape-readers.mjs`
and `node scripts/check-writer-reach.mjs` EXECUTED, with their before/after output quoted — the
compile lane's verdicts for both are PLAUSIBLE predictions (it is forbidden to run tree scripts)
and CONFIRMING them is this build's job; motion in the first is a STOP, growth in the second is a
STOP, and a shrink is recorded for the chair, never written** · sealed per-step receipt and resume
status · both typecheck configurations · gate stages actually executed · base-versus-wave failure
identity diff · dormancy/golden result · census tuple before and at the tip with the interior red
quoted verbatim · ⭐ **the measured minified byte total of the two new leaves (predicted 9,087 B),
for the consumers' placement obligation (R1)** · edge-shared verdict: **NOT OWED, and no
`supabase/functions/_shared/**` path written** · deviations `NONE | STOP` · out-of-scope
observations, without investigation · **judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | ✅ **RULED AND CARRIED.** The dynamic-import obligation falls on EM-B1c, EM-B1a and EM-R0c; §3b states it as a binding note with the measurement (9,087 B against the model's 8,574 B when it broke the ratchet). **No chair action beyond docketing the row onto those three pre-proofs.** |
| **R2** | ✅ **RULED AND CARRIED.** `NPC_HOMES` is exported; the post-edit simulation is executed against the validator's own `source.includes(row.symbol)` (`implementation-packets.mjs:802`) and the pinned text survives ⇒ **no `retiredSymbols` row anywhere.** §10 adds the two store suites that pin that file. |
| **R3** | ✅ **RULED AND CARRIED — with one correction the chair should see.** All three are cascaded. ⚠ **The chair's "three paths" is FOUR observed paths**: `secondaryAffiliation` is stored at BOTH homes, so the walk counts it twice. The cascade therefore goes 33 → **37 observed paths / 38 declared rows**, and `NON_CASCADED` 9 → **5**. ⚠ **And version 1's "+5 effective lines" was an UNDER-ESTIMATE: measured +10 (rename leaf) and +8 (removal leaf).** Both leaves still fit. |
| **R4** | ⚠ **STILL OPEN — the owner's, and §3a is written to be cut.** Under **YES** the chair deletes §3a **whole and nothing else moves** (no manifest row, no `requiredSymbols` row, no budget row). Under **NO** the four `anchorKey` stores become a **THIRD leaf** (`institutionAnchorCascade.js`, ≈45 effective) or a follow-on packet, and the budget row changes from 2 leaves to 3. ⭐ Sharpening the choice: all four containers are **absent on 525 of 525 generated records**, so the exposure is only a save a DM has already edited. |
| **R5** | ✅ **RULED AND CARRIED.** One packet, two leaves (219 + 65). The consumer map is kept verbatim in §0 so the chair can still cut it in two. |
| **R6** | ✅ **RULED AND CARRIED — with ONE THING THE CHAIR MUST STILL ACCEPT.** The writer reports and never refuses. ⭐ **A SECOND ORPHAN KIND WAS FORCED BY R3(iii)**: a chain `label` is present on **6,676 of 6,676** chains, so the removal cannot delete it — the label stands and `{ kind: 'chain-label-names-a-removed-house' }` carries the loss (**7 over 525 removals; 4 on a chain that kept other processors**). Neither literal collides at the tip. ⛔ **`OrphanKind` is now a CLOSED VOCABULARY OF TWO that EM-C2 branches on — confirm both spellings, or rule the second kind out and accept a chain label that names a house the DM just removed.** |
| **R7** | ✅ **RULED AND CARRIED.** Placement: `EM-R6 → EM-B1c · EM-B1b · EM-B1g · EM-A3`, after train EM-T6. `__BASE__` left for the chair. ⚠ The collision check covers the **190 registered** entries; the create/modify order check across the kit's DRAFTs is the chair's at placement, as ruled. |
| **R9** | ⚠ **NEW, SMALL, AND THE CHAIR'S:** `factions[].members[].linkedInstitutionIds[]` is **declared but never observed** (0 of 525 rows; only `npcs[].linkedInstitutionIds[]` is produced, 25 occurrences). It is declared anyway under the `NPC_HOMES` symmetry law, and the precedent is exact — `factionRename.js` declares `${ROSTER}.name`, which **never exists on generated data** (0 of 3,378) and whose header RECON-ID already flagged for one clarifying word. **Confirm the symmetry declaration is wanted here**, or the row comes out and the two homes stop being symmetric for that one field. |
