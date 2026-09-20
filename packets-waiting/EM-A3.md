# EM / EM-A3 — THE FLAVOR CENSUS: both halves, property reads and value joins (train `em-w1`, wave 1)

**Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)

- **Status:** DRAFT
  ⚠ The status value stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs:297`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 4
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19, `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Depends on:** `EM-A1` — this packet MODIFIES `src/domain/edit/fieldDeclarations.js`, which EM-A1 creates. EM-A1 is DRAFT on `EM-P2` and `EM-P3`.
- **Collision group:** `EM-A1` — the two share `src/domain/edit/fieldDeclarations.js`. They must serialize; EM-A1 lands first and EM-A3 re-reads the file at its own I-step.
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured. Measured at this base: both register baselines' real paths, top-level key sets, populations and frozen shas; the writer-reach closure STOP set and display dirs, read from the scanner's own source; the per-surface-class reach of every identity on the three card shapes; the observed-shape inventory's file population and its coverage of those shapes; the rename cascade's four declared surface lists by live import. Every figure carries its command in `EM-A3.evidence.md`.

---

## 1. Reconciled authority

1. ⭐⭐ **SECOND CHAIR AMENDMENT (ODQ §934.44–§934.45; design §14 FINAL and §15; the ARCH and charter at `7aa769830`).** Item 5 reads *"EM-A3's flavor census keeps its half (a `free` field has zero derivation readers) and adds nothing else; the root check is A1's walker."* **That is now a RULING**, so the call this lane had recorded vetoably is withdrawn as a judgment and kept only as its reasoning (§12). Item 6 keeps the base at `d31af2cee` with J-T1 blob identity over the moved window — **EXECUTED: 27 of 27 measured paths byte-identical to `7aa769830`** (`EM-A1.evidence.md` E-40), including both register baselines and both scanner sources this packet reads. Nothing else in the amendment reaches here: the fifth world-fact card, the two new root fields (`npc.status`, `institution.state`) and the chooser-registry predicate are all EM-A1's.
2. **FIRST CHAIR AMENDMENT, ODQ §934.44 — "edit at the source, never at the derivation."** Its first ROOT test (*"whose writer reads no other world fact"*) is SUPERSEDED by §934.45's "root means CHOSEN". ⚠ **This packet's §11 BLOCK-D was written under the superseded test and its arithmetic moves with it**: under "root means chosen", six of EM-A1's nine drops reverse, so the `free` population may NOT be empty after all. BLOCK-D is therefore CONDITIONAL on EM-A1's ruling and is re-stated that way below.
2. `docs/OWNER_DECISION_QUEUE.md` §934.42 (build the editor now) and the §934.36 addendum of 2026-09-19 ~18:3x — *"a field may be typed when nothing downstream reads its value as a fact … the set is a CENSUS with a proof per field from the writer-reach and observed-shape instruments, not a list by taste."*
3. `docs/DESIGN_EDIT_MODE_AND_DECREES.md` **§12.3 and §14 GOVERN** — the census classifies by PROPERTY READS **and** by VALUE JOINS; a join-key field can never be plain `free`. `EM-PREAMBLE.md` §P5 HZ-JOINKEY restates it.
4. `docs/ARCH_EDIT_MODE_AND_DECREES.md` §8 instrument 2 — the reader scopes and the per-row proof string. **Instrument 1's new root arm is EM-A1's** (§12).
5. `docs/implementation/charters/EDIT-MODE-TRAIN.md` row **EM-A3** (unamended by §934.44 — only EM-A1's and EM-F1's rows moved).
6. `docs/implementation/PACKET_STANDARD.md`, `EM-PREAMBLE.md` §P1–§P9.
7. Live code and executed evidence at `d31af2cee` — `EM-A3.evidence.md`.

Resolved contradictions:

- Design §6.2 says the census is measured *"from the writer-reach and observed-shape data"* and ARCH §8.2 adds *"AND by VALUE JOINS"*. → §12.3 governs: **both halves**, not either.
- ⭐ **Where does the §14 ROOT check live — here or in EM-A1's walker?** → **RULED by the chair's second amendment, item 5: EM-A1's walker owns it; this census keeps its half and adds nothing else; the arm is not duplicated.** The reasoning this lane had assembled independently is kept in §12 as a citation, not as a judgment.

Contradictions this packet does **not** resolve: the two named instruments cannot deliver the property-read half as specified. §11 BLOCK-A is the smallest measured contradiction. `PACKET_STANDARD.md`: *"If two higher authorities still disagree, the packet is BLOCKED."*

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** `tests/lint/flavorFields.census.test.js` proves, for every row of `FIELD_DECLARATIONS`, that a `free` field has zero derivation readers by BOTH halves — property reads and value joins — and that any field the rename cascade joins on is declared `free-cascade`, never `free`; each `free` row's `readersProof` string in `fieldDeclarations.js` names the arm that proved it.

**Definition of done:** the census file exists and is green, and every `kind: 'free'` row carries a `readersProof` the census itself verifies.

In scope:

1. **One primary behaviour:** the two-half census with a proof string per row.
2. **One required integration:** the `readersProof` values on the `free` rows of `fieldDeclarations.js`.
3. **One prevention guard:** the census IS the guard.

Explicit non-goals:

- the declarations themselves (`EM-A1`), the pool catalogue (`EM-A2`), ops, the layer, the registry;
- widening, shrinking or re-freezing either register — **this packet writes no baseline and runs no `--write`**;
- any change to `src/domain/factionRename.js`;
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `0` |
| Named state writers | `0` |
| Feature flags | `0` |
| User-facing surfaces | `0` |
| Direct consumers | `0` |
| New logic-bearing production leaves | `0` |
| Existing logic-bearing production files modified | `1` (`src/domain/edit/fieldDeclarations.js` — `readersProof` string values only) |
| Additional registration-only files | `1` (`scripts/mutation-coverage-manifest.json`) |
| Handwritten files total | `3` |
| New/changed effective production lines | `≤ 20` |
| Effective lines per new leaf | `n/a` — no new production leaf |
| Delta in a shared/hot file | `n/a` — **this packet names NO hot file.** None of the five standing rows appears in §7. |
| Acceptance cases | `5` |

Overrides approved before dispatch: `NONE`.

Exceeding any limit is a STOP and split, not an invitation to renegotiate.

⚠ **The budget FITS; the packet is not blocked on size.** It is blocked on a refuted measurement premise (§11 BLOCK-A) and on a blocked dependency (§11 BLOCK-B).

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-A3
```

Expected: `tests/lint/flavorFields.census.test.js` ABSENT; `src/domain/edit/fieldDeclarations.js` PRESENT and clean (it arrives with EM-A1); every `requiredSymbols` row resolving verbatim. Any mismatch makes this packet STALE.

⛔ Dispatch is refused at BLOCKED status, and is refused a second time while EM-A1 has not landed.

## 5. Verified tree contract

Every row executed at `d31af2cee`; the command is in `EM-A3.evidence.md` under the cited F-number.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Register A — real path | `scripts/.writer-reach-baseline.json` | `"stopSet"`, `"surfaceReach"`, `"darkUnregistered"` | Exists; `schema 1`; `frozenAtSha 5123689dff88b48a9948ba4160736aa87ba2d3c3`; `surfaceReach` holds **6,537** identities; `darkUnregistered` holds **1,290**; `population` is `{judged 6537, lit 572, litName 4671, dark 1294, thinKeys 9144, thinShapes 962, knownShapes 337}` (F-1, F-2) | The property-read half's declared source |
| ⛔ Register A — the STOP set | `scripts/.writer-reach-baseline.json` | `"stopSet"` | Exactly `["src/generators/","src/store/","src/workers/","src/lib/instantWorld/"]` (F-2) | §11 BLOCK-A |
| ⛔ Register A — no per-file readers | `scripts/.writer-reach-baseline.json` | top-level keys | The 23 top-level keys carry **no `readers` map**; `surfaceReach`'s value is a per-surface-class grade STRING, e.g. `"campaign-pdf=R dossier-pdf=R foundry=R web-display=R web-transitive=R world-book=R"` (F-2, F-4) | §11 BLOCK-A |
| Register A — the scanner's law | `scripts/lib/writer-reach-scan.mjs` | `SURFACE_CLOSURE_STOP` | `Object.freeze(['src/generators/', 'src/store/', 'src/workers/', 'src/lib/instantWorld/'])` at `:115`, with the header *"the engine boundary every closure halts at. Load-bearing at the FILE level … the same read planted at a `src/generators/` path lights nothing"* (F-3) | §11 BLOCK-A |
| Register A — the display split | `scripts/lib/writer-reach-scan.mjs` | `WEB_DISPLAY_DIRS` · `REPORT_ONLY_CLASSES` | `WEB_DISPLAY_DIRS = ['src/components/','src/domain/display/','src/pdf/']` (`:90`); `REPORT_ONLY_CLASSES = ['web-transitive','json-export']`, `web-transitive` documented as *"reachable only through files the web root drags in, never through a component, a display read model or the PDF"* (`:87`) (F-3) | The ONE non-display signal the register does carry |
| Register A — grade grammar | `scripts/lib/writer-reach-scan.mjs` | `parseReach` · `judgeWriters` | Grades are exactly `R` (a grounded receiver), `N` (an ungrounded name), `A` (allowlisted json-export); a class appears in `reach` only if some closure file read it (`:444-484`, `:490-501`) (F-3) | Read the grade, never infer one |
| ⛔ Register B — the population | `scripts/.observed-shape-readers-baseline.json` | `"inventory"` | The READER-WITH-NO-WRITER inventory: `_doc[0]` = *"READER-WITH-NO-WRITER INVENTORY — per-file HEURISTIC-LEAF identities and governed ceilings."* `inventory` covers **387 files** (256 `src/domain`, 50 `src/components`, 26 `src/generators`, 19 `src/lib`, 17 `src/store`, 12 `src/pdf`, …); `identities 1390`; `frozenAtSha 31ab5d18bdd44ba0691c2e16f3ae8f3cfef36eb1` (F-5, F-6) | §11 BLOCK-A |
| ⛔ Register B — coverage of the subject | `scripts/.observed-shape-readers-baseline.json` | `"inventory"` | Over all 387 files, **exactly ONE** row matches `(name\|role\|category\|faction\|power) on (institutions\|npcs\|factions)` — `src/pdf/lib/viewModel.js :: faction on npcs = 3` (F-6) | §11 BLOCK-A |
| Value-join authority | `src/domain/factionRename.js` | `FACTION_RENAME_SURFACES` (32) · `NPC_RENAME_SURFACES` (5) | The two cascade denominators, enumerated by live import (F-7) | The value-join half reads exactly these |
| Value-join ruling ledger | `src/domain/factionRename.js` | `NON_CASCADED_SURFACES` (16) · `NPC_NON_CASCADED_SURFACES` (13) | The written exclusions; each row carries a `why` (F-7) | A path here is a RULING, not a miss |
| ⛔ Measured: no candidate field is display-only | `scripts/.writer-reach-baseline.json` | `"surfaceReach"` | `name on institutions`, `name on npcs`, `name on factions`, `faction on factions`, `category on institutions`, `category on factions`, `role on npcs`, `power on factions` — **every one carries `web-transitive=R`**, i.e. a grounded read outside the three display dirs. None is `DARK` (F-4) | §11 BLOCK-C |
| Test precedent | `tests/domain/factionRename.test.js` | `describe('faction rename — the INDEPENDENT denominator')` › `test('every stored path that carries a faction name is declared, or ruled out in writing')` | The independent-denominator shape: it walks the whole blob and never reads the module's own declarations (F-8) | Copy this proof shape — the census must not be its own answer sheet |
| Test precedent | `tests/lint/habitBandsReconciliation.walker.test.js` | `describe('HB — the Bands line reconciles against the tuning seam, both directions')` › `test('GUARD-THE-GUARD: a Bands line planted on a no-bands wave REDS')` | Literal titles; both-directions reconciliation; one guard-the-guard arm (F-8) | Copy this walker shape |
| Census instrument | `tests/lint/sovereigntyLightingContract.walker.test.js` | `TEST_FILES` · `CENSUS` | Counts TEST files only (`:515-518`, asserted `:7460`); register `tests/lint/.lighting-census-baseline.json` at `files 2645 · parked 383 · credited 2262 · titles 25009 · suiteTitles 6670` (F-9) | §7's predicted delta |
| Registration instrument | `tests/lint/mutationCoverage.shared.mjs` | `ENFORCER_DIRS` | `tests/lint` is the first of eight; the manifest carries 704 `invariants` rows, 171 under `tests/lint/` (F-10) | §7 row 3 |
| Golden posture | `tests/property/generatorGoldenMaster.test.js` · `tests/property/dossierProseManifest.test.js` | — | Neither appears in §7; this packet adds one test file and edits string values in one frozen table | UNCHANGED; motion is a STOP |

Forbidden alternatives:

- no second census, no second reader scanner, no second spelling of either register;
- **no `--write`, `--genesis`, `--rebank` or any other writing door on either register** — a compile or an implementer that re-freezes a baseline to make a census green has inverted the instrument;
- no edit to `src/domain/factionRename.js`, to either baseline JSON, or to `tests/lint/.lighting-census-baseline.json` by hand;
- no files outside the manifest.

## 6. Exact contracts

⛔ **WITHHELD IN PART.** The property-read arm's data source is refuted (§11 BLOCK-A), so its exact predicate cannot be authored without choosing a substitute — an architectural choice. The VALUE-JOIN half is fully settled below, because its source is executable at this base.

### The value-join arm — SETTLED

```js
// Read the four declared lists from the cascade module itself; never re-spell a path.
import {
  FACTION_RENAME_SURFACES, NPC_RENAME_SURFACES,
  NON_CASCADED_SURFACES, NPC_NON_CASCADED_SURFACES,
} from '../../src/domain/factionRename.js';
```

**The predicate, exactly.** For a declaration row `{ card, field, kind }`, its stored path family is `storedPathsOf(card, field)` — the set of declared paths under which that card's records live (`institutions[]`, `npcs[]` **and** `factions[].members[]` for an NPC, `powerStructure.factions[]` **and** `factions[]` for a faction). The row **JOINS** iff any member of that set, suffixed `.${field}`, appears as a `path` with `kind: 'key'` in `FACTION_RENAME_SURFACES` or `NPC_RENAME_SURFACES`.

- A row that JOINS and is declared `'free'` → **RED**, message naming the row and the exact cascade path.
- A row that JOINS and is declared `'free-cascade'` → **PASS**.
- A row that JOINS and is declared `'pool'` → **RED** (a pooled value that is also a join key needs the cascade too; the cascade is the point, not the typeability).
- A row that does NOT join and is declared `'free-cascade'` → **RED**, message naming the row: `free-cascade` asserts a cascade exists; a row without one is the BLOCK-1 class EM-A1 records.
- `kind: 'prose'` surfaces are **excluded from the join predicate** and stated as such: a prose surface is a substitution target, not an exact-key join, and the two carry different risks (`factionRename.js`'s own `kind` docblock).

**Anti-vacuity, mandatory.** The arm asserts in the same test that `FACTION_RENAME_SURFACES.length` and `NPC_RENAME_SURFACES.length` are both `> 0` and that at least one declaration row was classified as JOINING. A census over an empty denominator, or one that finds no join at all, is the vacuous pass this arm exists to refuse.

**Absence and ordering.** Declarations are read in `FIELD_DECLARATIONS` order; the surface lists are read in their authored order; nothing is sorted and no path is normalized beyond the exact `[]` spelling the module uses. A path spelled differently is a RED, never a near-match.

### ⭐ The property-read arm — SETTLED as a LIVE SCAN (chair ruling §934.47, item 6)

⛔ **The two register baselines are NOT read.** The ruling is explicit — *"a LIVE SCAN in the estate's walker idiom … its own reader, like the label-join census does, never a read of the writer-reach or observed-shape baselines"* — and it is what cures BLOCK-A: the baselines cannot see `src/generators/` (the writer-reach `stopSet`, F-2/F-3), but a scan this file owns can walk it directly.

**THE SCAN SCOPE — four roots, frozen, spelled in the census:**

```js
const SCAN_ROOTS = Object.freeze([
  'src/generators',
  'src/domain/worldPulse',
  'src/domain/causalState',
  'src/domain/edit',          // narrowed to guards*: see GUARD_FILE below
]);
const GUARD_FILE = /(^|\/)guard[A-Za-z]*\.js$/;   // guards.js, guardRules.js
```

The walk is `tests/joins/labelJoins.test.js`'s own (`SCAN_DIRS` + `walk()` + comment-stripped source, F-8) — **the idiom the ruling names**, not a new one.

**THE READ-SITE KINDS, NAMED EXACTLY.** For a declared `free` field whose key is `K`, a DERIVATION READ is any of these four, and only these four:

| # | kind | shape matched | why it counts |
|---:|---|---|---|
| 1 | **property access** | `<receiver>.K` where `K` is the declared key and the site is not an assignment target | the ordinary read |
| 2 | **string element access** | `<receiver>['K']` / `<receiver>["K"]`, not an assignment target | the same read, quoted |
| 3 | **object binding pattern** | `const { K } = …` and `const { K: alias } = …` | destructuring is a read the property scan misses |
| 4 | **`in` test** | `'K' in <receiver>` | a presence probe is a read of the fact |

⭐ **These are the writer-reach scanner's own four** (`scanSurfaceReads`, `writer-reach-scan.mjs:356-440` — F-3), named here rather than imported, so the census owns its reader exactly as the ruling requires while using a vocabulary the estate has already proved. **A fifth kind is a STOP, not an edit.**

**WHAT IS NOT A READ, declared so the scan's blind spots are stated rather than discovered** (the `labelJoins` header's own practice): a computed access `obj[k]` where `k` is a variable; a read inside a comment or a string literal (source is comment-stripped first); a read in `tests/`, `src/components/`, `src/domain/display/` or `src/pdf/` (those are DISPLAY, and a display read is exactly what a `free` field is allowed); and a re-export. Each is an accepted cost of a source scan and each is written in the file's header.

**THE VALUE-JOIN HALF is unchanged** (above): the rename cascade's four declared lists, read by live import.

**THE VERDICT, with no discretion:** a `kind: 'free'` row REDS if any of the four kinds matches its key anywhere under `SCAN_ROOTS`; the message names the file, the line and the kind. A row that survives gets a `readersProof` naming the arm, the four kinds and the scan roots — a string the census itself re-verifies (case A5).

⚠ **ANTI-VACUITY IS MANDATORY AND IS CASE A4.** The scan asserts it walked a non-empty file set under EVERY root, and that at least one known-derived key (a positive control — `role` on `npcs`, which `getUpgradeOpportunities` reads) IS found. A scan that finds nothing because it walked nothing is the failure this instrument exists to refuse.

### `readersProof` — SETTLED in shape, WITHHELD in value

```js
/** @type {string} present iff kind === 'free'; non-empty; names the arm that proved it. */
```

The census asserts, for every `kind: 'free'` row: `readersProof` is a non-empty string, and it names an arm this file actually ran. The VALUES are the property-read arm's output and are therefore withheld with it.

### Determinism, flag, lifecycle, receipts

- Hash/fork key: `NONE`. No PRNG, no clock, no locale, no environment read.
- Stable enumeration: declaration order, then surface-list order. No sort.
- Flag: `NONE`. Golden posture: **UNCHANGED**.
- Lifecycle: the census persists nothing and is read by nothing. `n/a` for every column.
- Receipts and privacy: `NONE`; no DM-only field; nothing travels.
- Alignment: `DECLARED EMPTY: a census takes no alignment position.`
- Edit story: `ENGINE-ONLY: the census constrains the declaration table; it exposes no DM verb.`

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `TEST` | `tests/lint/flavorFields.census.test.js` | cases A1–A5 | `n/a` | The two-half census. Literal `test` titles only — no `.each`, no loop-generated registration, no nested `describe` (`EM-PREAMBLE.md` §P3.4); loop INSIDE a named test. Every negative assertion carries `// anchored:` on the line immediately above. |
| `MODIFY` | `src/domain/edit/fieldDeclarations.js` | the `readersProof` string value on each `kind: 'free'` row | `≤ 20` | Fill ONLY the `readersProof` values. ⛔ Touch no `kind`, no `pool`, no `field`, no `group`, no `label` — those are EM-A1's and a change here is a collision-group violation. |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | `invariants['tests/lint/flavorFields.census.test.js']` | `≤ 12` | Add ONE row surgically beside its `tests/lint/` siblings. ⛔ Never re-serialise the manifest whole. |

Generated artifacts: `NONE`.

No other file may be edited.

**Predicted register moves, priced here rather than discovered at the terminal:**

| Register | Moves? | Predicted delta | Door |
|---|---|---|---|
| Lighting census | **YES — INTERIOR RED at this member's commit** | `files +1` · `credited +1` (every title literal, so parked is UNCHANGED) · `titles +T` · `suiteTitles +1`, where `T` is the new file's literal `test` count. Against EM-A1's own `+2`, the wave's running tuple is EM-A1's base `2645/383/2262/25009/6670` → `2647/383/2264/…` → `2648/383/2265/…` | Re-derived WHOLE at the train terminal (`EM-PREAMBLE.md` §P3.2) |
| | | ⛔ The cause is the ONE new TEST file, not a `src/` file — `EM-PREAMBLE.md` §P2.1's cause is refuted; see `EM-A1.md` §11 BLOCK-5. | |
| Mutation-coverage manifest | **YES** | `invariants` +1; `tests/lint/` rows +1 (from whatever EM-A1 leaves it at) | §7 row 3, in this member's own commit |
| **Writer-reach register** (`scripts/.writer-reach-baseline.json`) | **NO** | zero — **and this is the row `EM-PREAMBLE.md` §P2.4 requires stated, so it is stated with its measurement.** The census READS the baseline as a JSON fixture from a file under `tests/lint/`; the register's own scan is rooted at `SURFACE_ROOTS` (`src/main.jsx`, the PDF/world-book/foundry/export entry points) and never walks `tests/`, so a test file cannot enter any closure or add any reader. And the census dereferences no SETTLEMENT record: it reads declaration rows and two frozen JSON artifacts. **Neither the `--write` shrink nor a mint is owed.** (F-11) | — |
| Observed-shape register (`EXPLAINED_WRITER_EXEMPTIONS`) | **NO** | zero | No save-time key (`dmLayer`, `decrees`) is read; EM-B3 owns that door. |
| Prose-numerics · size-baseline · edge-shared bundles | **NO** | zero | Nothing is rendered, baselined, or inside a bundle closure. |

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch. **Re-read `src/domain/edit/fieldDeclarations.js` at this step** — EM-A1 is the collision-group sibling that wrote it.
1. Capture the baseline evidence: both register JSONs' `frozenAtSha` and populations, recorded in the receipt, so a later drift is visible.
2. Add the failing tests for A1–A5.
3. Implement the value-join arm (§6) — it is the half that is settled.
4. Implement the property-read arm — ⛔ **WITHHELD pending §11 BLOCK-A.**
5. Fill the `readersProof` values.
6. Add the one `scripts/mutation-coverage-manifest.json` row.
7. Run focused verification (§10).
8. Write the completion receipt. The bare full gate and the boot smoke belong to the train terminal.

Bounded algorithm (the value-join arm):

```text
1. Import the four declared lists from src/domain/factionRename.js. Assert both
   cascade lists are non-empty, or STOP: an empty denominator is a vacuous pass.
2. For each declaration row, build storedPathsOf(card, field) from the DECLARED
   homes, never from a hand-written probe map.
3. JOINS := any built path appears as a `kind: 'key'` path in either cascade list.
4. Apply §6's four-way verdict. On any RED, name the row AND the exact cascade path.
5. Assert at least one row was classified JOINING, or STOP (anti-vacuity).
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behaviour — the value-join half | the live `FIELD_DECLARATIONS` and the four live surface lists | every joining row is `free-cascade`; no joining row is `free` or `pool`; no `free-cascade` row is join-less | `tests/lint/flavorFields.census.test.js` |
| A2 | Absent/dormant | a card type with no `free` row | the property-read arm runs, asserts its denominator is non-empty, and reports zero `free` rows without passing vacuously | `tests/lint/flavorFields.census.test.js` |
| A3 | Counterforce — GUARD-THE-GUARD | a planted `kind: 'free'` on a row whose path IS in `FACTION_RENAME_SURFACES` (e.g. `npcs[].name` via `NPC_RENAME_SURFACES`) | A1 REDS, and the message names both the row and the exact cascade path | `tests/lint/flavorFields.census.test.js` |
| A4 | Boundary — the anti-vacuity fence | the live lists | both cascade lists are non-empty; at least one declaration row classified JOINING; the property-read arm's denominator is non-empty | `tests/lint/flavorFields.census.test.js` |
| A5 | Real integration — every `free` row carries a live proof | the live table | `readersProof` on every `kind: 'free'` row is a non-empty string naming an arm this file actually ran, and no `pool` or `free-cascade` row carries one | `tests/lint/flavorFields.census.test.js` |

Rows for idempotency, lifecycle round trip and privacy are **omitted, not replaced**: nothing is written, persisted or projected.

## 10. Verification commands

```sh
npx eslint tests/lint/flavorFields.census.test.js src/domain/edit/fieldDeclarations.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/flavorFields.census.test.js \
  tests/lint/mutationCoverageManifest.test.js tests/lint/negativeAssertionAnchor.walker.test.js --maxWorkers=2
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/factionRename.test.js \
  tests/domain/editDeclarations.test.js --maxWorkers=2

# The named interior red, run so its figure is RECORDED
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js --maxWorkers=2

node scripts/implementation-packets.mjs validate
```

⛔ **`node scripts/check-writer-reach.mjs` and `node scripts/check-observed-shape-readers.mjs` are NOT in this list, deliberately.** This packet moves neither register (§7) and re-running a ratchet it does not touch invites a stale-artifact red that belongs to another lane. If the chair wants a control, the read-only `--report` form is the one, never `--write`.

Expected: every command exits `0` except `sovereigntyLightingContract.walker.test.js`, the ONE named interior red at §7's figures. A gate line with no printed test count DID NOT RUN.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if: either register baseline's `frozenAtSha` differs from the value recorded at step 1; any arm would pass over an empty denominator; the cure for a red would be a baseline re-freeze; or a `free` row would be admitted with a `readersProof` no arm produced.

---

### ⛔ THE BLOCKS — why this packet is BLOCKED, smallest measured contradiction each

**BLOCK-A — ⭐ CURED BY THE CHAIR'S RULING §934.47 ITEM 6, and the measurement that forced it is kept.**

The ruling replaces the baseline read with a LIVE SCAN this census owns (§6), which is exactly option (b) of the three this lane named. **The block is lifted and the packet is DRAFT.** The measurement stays on the record because it is why the cure was needed, and because a later lane that "simplifies" the census back to a baseline read would reintroduce the hole:

**Why the two named instruments could not do it —**

ARCH §8 instrument 2, restated by design §6.2 and the ODQ §934.36 addendum:

> every `free` field has zero readers under **`src/generators`**, `src/domain/worldPulse`, `src/domain/causalState`, `src/domain/edit/guards*`, and the registers, **measured by PROPERTY READS (the writer-reach and observed-shape data)**

Measured at `d31af2cee`:

1. **`src/generators/` is the writer-reach register's closure STOP set** — the first and most load-bearing of the five named scopes is the one directory the instrument halts at by construction.
   ```
   $ node -e '…' scripts/.writer-reach-baseline.json
   writer-reach stopSet: ["src/generators/","src/store/","src/workers/","src/lib/instantWorld/"]
   ```
   and the scanner's own header (`writer-reach-scan.mjs:107-118`): *"THE STOP SET — the engine boundary every closure halts at. Load-bearing at the FILE level (Car 0 control 3: **the same read planted at a `src/generators/` path lights nothing**)."* **No read under `src/generators/` can ever appear in this baseline**, so "zero readers under `src/generators`" is not a claim the baseline can support in either direction. (F-2, F-3)
2. **The baseline carries no per-file reader map at all.** Its 23 top-level keys hold `surfaceReach` — a per-surface-CLASS grade string per identity — and `darkUnregistered`. `judgeWriters` computes a `readers: {R, N}` file set per identity in memory (`writer-reach-scan.mjs:479`), and **it is not persisted**. A census reading the artifact can ask "which surface classes reach this key", never "which files read it". (F-2, F-4)
3. **The observed-shape baseline is the wrong population by construction.** `_doc[0]`: *"READER-WITH-NO-WRITER INVENTORY."* A declared editable field is, by definition, WRITTEN by the generator — so it cannot appear. Measured: across all 387 inventoried files, **exactly one** row touches the three card shapes at all (`src/pdf/lib/viewModel.js :: faction on npcs = 3`). (F-5, F-6)

So the premise *"measured by property reads (the writer-reach and observed-shape data)"* is refuted by those two artifacts' own scope and shape. **The cure is a ruling, not a lane's pick**, and the options are visible:

- (a) respell the reader scope in the grammar the register does carry — `web-transitive` is documented as *"reachable only through files the web root drags in, never through a component, a display read model or the PDF"* and is the register's one non-display signal — accepting that `src/generators/` and `src/store/` fall outside every closure and are therefore **unmeasured, not proven clean**; or
- (b) authorize the census to take a LIVE measurement by calling the scanner library directly — `scanSurfaceReads({ index, corpus, files, … })` (`writer-reach-scan.mjs:356`) returns a per-file `{R, N}` map and accepts an arbitrary `files` list, so a declared scope of `src/generators/**` + `src/domain/worldPulse/**` + `src/domain/causalState/**` + `src/domain/edit/guards*` **is** answerable — at the cost of building the observed corpus inside a lint test, which is a new mechanism and a new runtime cost neither the charter nor the preamble priced; or
- (c) narrow instrument 2 to the VALUE-JOIN half, which is fully executable today (§6), and re-aim the property-read half to a member that owns the scanner.

**Judgment calls: NONE.** The chair adjudicates.

**BLOCK-B — the dependency is blocked and the subject does not exist.**

`EM-A3` MODIFIES `src/domain/edit/fieldDeclarations.js`, which `EM-A1` CREATEs. That file is ABSENT at the base, and **EM-A1 is itself BLOCKED** (`EM-A1.md` §11 BLOCK-0). A census has no rows to classify until the declarations are ruled. The charter records EM-A3's collision as `A1`; the dependency is the same fact and is recorded in this header as well, because a collision that is also an ordering dependency is two claims, not one.

**BLOCK-D (CONDITIONAL, and its condition is EM-A1's ruling) — under the FIRST amendment's root test this census's `free` population was EMPTY; under §934.45's it may not be.**

⚠ **Read this block's condition before its arithmetic.** It was computed under §934.44's *"writer reads no other world fact"*, which §934.45 replaced with *"root means CHOSEN, not computed"*. Under the new test six of EM-A1's nine drops reverse, so a larger catalogue — possibly including `note`-style annotation fields, which design §14 FINAL now names as a kind of their own (*"**Annotation** — the free notes; the DM's layer only; the flavor census proves nothing reads them"*) — may carry real `free` rows. **§14 FINAL in fact hands this census a subject it did not have before: the annotation kind is defined by this instrument's own proof.** Whether that subject exists at wave 1 depends on EM-A1's §11 BLOCK-0, not on anything here. The arithmetic below is retained because it is still the correct reading of the case where EM-A1 lands a cascade-only catalogue.

**The arithmetic, under the superseded test:**

`EM-A1.md` §5.1 measures the writer of every field the amendment names. **Nine of ten drop as DERIVED or as no-such-field; one survives:**

```
npc.name — kind: 'free-cascade', provenance: 'root',
           writer: 'src/generators/npcGenerator.js#pickFirst'
```

`npcs[].name` is `NPC_RENAME_SURFACES[0]` (F-7), so §12.3 makes it `free-cascade`, never `free`. A one-field table therefore holds **zero `kind: 'free'` rows**, and this packet's whole subject — *"every `free` field has zero derivation readers"* — is vacuously true over an empty set. Case **A4**, the anti-vacuity fence, exists precisely to refuse that, and it would red on its own contract.

⭐ **That is not a reason to weaken A4.** It is the signal that EM-A3's scheduling follows EM-A1's ruling: if the chair rules §14's ROOT test as the packet measured it, there is nothing for a flavor census to classify in wave 1 and this packet should be re-aimed to the first wave that declares a `free` field. If the chair instead reads §14 as "the VALUE is authored, not computed" (`EM-A1.md` §11 BLOCK-0.2), the catalogue survives, `note`-style free fields may return, and BLOCK-A's measurement question becomes live again. **The two packets are one ruling, not two.**

⚠ Note what does NOT rescue it: the value-join half (§6) stays fully executable and non-vacuous even with one row — it would classify `npc.name` as JOINING and assert it is `free-cascade`. A packet could be cut on that half alone. Whether a one-arm census is still instrument 2 is the chair's call; this lane does not narrow an instrument by itself.

**BLOCK-C — a corollary the chair should see before ruling: on the register's own evidence, NONE of the candidate fields is display-only.**

Measured from `surfaceReach` (F-4) — `R` means a grounded read by a file in that closure:

| identity | reach | display-only? |
|---|---|---|
| `name on institutions` | `campaign-pdf=R dossier-pdf=R foundry=R json-export=N news=N web-display=R web-transitive=R world-book=R` | **NO** — `web-transitive=R` |
| `name on npcs` | `campaign-pdf=R dossier-pdf=R foundry=R json-export=A news=R web-display=R web-transitive=R world-book=R` | **NO** |
| `name on factions` | `campaign-pdf=R dossier-pdf=R foundry=R json-export=N news=R web-display=R web-transitive=R world-book=R` | **NO** |
| `faction on factions` | `campaign-pdf=R dossier-pdf=R foundry=R news=R web-display=R web-transitive=R world-book=R` | **NO** |
| `category on institutions` | `campaign-pdf=R dossier-pdf=R foundry=R json-export=N web-display=R web-transitive=R world-book=R` | **NO** |
| `category on factions` | `campaign-pdf=R dossier-pdf=R foundry=R json-export=N web-display=R web-transitive=R world-book=R` | **NO** |
| `role on npcs` | `campaign-pdf=R dossier-pdf=R foundry=R json-export=A news=N web-display=R web-transitive=R world-book=R` | **NO** |
| `power on factions` | `campaign-pdf=R dossier-pdf=R foundry=R web-display=R web-transitive=R world-book=R` | **NO** |

None of the eight is in `darkUnregistered` either. **This is consistent with the design** — names are join keys, so `free-cascade` is their kind — but it also means **the wave declares no plain-`free` field that the register could prove clean.** The only fields ARCH §9 declares `free` are the two `note` fields, and those **do not exist on any record** (`EM-A1.md` §11 BLOCK-2), so they carry no `surfaceReach` row at all. A census that reads "no row in the register" as "zero readers" is asserting absence of evidence as evidence of absence — precisely the self-referential-pin class `EM-PREAMBLE.md` §P6 forbids and that `factionRename.test.js`'s own header records as the R-5 defect. **How a NEW, generator-unwritten field earns a `readersProof` is unruled**, and it is the third thing the chair must settle before this packet can be READY.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the next wave.

## 12. Completion receipt

- Base SHA: `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- Dispatch bundle and seal identity: **NOT DISPATCHED** — status BLOCKED.
- Final commit or working-tree state: **no edit made.** This lane wrote only under `$SP/lane-em-a-scratch/`.
- Exact changed files and effective-line deltas: `NONE`.
- Acceptance cases: `0 of 5 executed`.
- Focused commands, exits, and counts: **no vitest, eslint, `npm run check`, or register script was run.** Every measurement command and its output is in `EM-A3.evidence.md`.
- Sealed per-step receipt and exact-state resume status: `n/a`.
- Both typecheck configurations: `n/a`.
- Wave-end gate stages actually executed: `NONE`.
- Base-versus-wave failure identity diff: `n/a`.
- Dormancy/golden result: `n/a`. Golden posture DECLARED UNCHANGED for the eventual build.
- Generated artifacts: `NONE`
- Deviations: **STOP** — §11 BLOCK-A (refuted measurement premise), BLOCK-B (blocked dependency), BLOCK-C (no provable `free` row at this wave), BLOCK-D (after §14's root test the `free` population is empty).
- Out-of-scope observations, without investigation:
  1. Both register baselines are frozen at shas that are NOT the packet base: writer-reach `5123689dff88b48a9948ba4160736aa87ba2d3c3`, observed-shape `31ab5d18bdd44ba0691c2e16f3ae8f3cfef36eb1`. A census citing a baseline inherits that freeze; whether the census must assert the freeze sha is unaddressed by the charter.
  2. `powerStructure.factions[].category` is derived from the faction's display NAME by `inferFactionCategory` (`src/generators/power/factionCategories.js:149`), and `src/generators/factionRoles.js` infers a faction's archetype by name pattern (`:179`). These are **name-valued derivations inside `src/generators/`** — the exact family BLOCK-A says neither register can see. Named, not investigated.
  3. `src/domain/factionRename.js`'s `NPC_HANDLE_KEYS_NOT_CASCADED` records `faction` as an *"open question"* — a name-shaped affiliation key the membership predicate accepts and the cascade deliberately does not rewrite. A later census widening would meet that recorded latency.
- Judgment calls: **NONE.** This lane had recorded one vetoably — which file owns the §14 ROOT arm — and the chair's SECOND amendment ruled it the same way (item 5: *"the root check is A1's walker"*). It is therefore withdrawn as a judgment and kept as a citation. Every other open question is handed up in §11 with its measurement attached: BLOCK-A (the two named baselines cannot measure reader scope under `src/generators/`, with the three options named and none chosen), BLOCK-B (the dependency), BLOCK-C (no candidate field is display-only), BLOCK-D (after §14 the `free` population may be empty — which depends on EM-A1's ruling, not on this packet).
