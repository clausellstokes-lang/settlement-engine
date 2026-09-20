# EM-B1f — PARTIAL RECEIPT (every UNGATED act executed; gated verification not yet run)

Stamped `Sun Sep 20 08:42:41 EDT 2026` (read from `date` in the same call as the tree check).
Lane: Opus sealed build, slot-2. ⛔ **STOPPED** — see `EM-B1f.STOP.md`. Tree UNCOMMITTED.

## Seal, tip, authorities

| fact | value | status |
|---|---|---|
| `implementation:dispatch -- EM-B1f` | **EXIT=0** | CONFIRMED |
| sealDigest | `22c09c9d8278412bc397761f7e1606da675d4e3aab4a20447a3fbea1d8214f39` | CONFIRMED |
| capsuleDigest | `baa70e3b244dbfdaff2fbf331614606dcb45d80263c2592c270c1a8c7c3d0c50` | CONFIRMED |
| branch / HEAD | `fixes-2026-09-18-consist` @ `c33446830` | CONFIRMED |
| verifiedBase → HEAD | `0cea60c7a` is an ancestor; **2 commits**, both docs-only (`f4c395e2d` placement, `c33446830` the fifth lighting refreeze) | CONFIRMED |
| preamble SHA-256, MEASURED | `ce516004a5d8e680f4160b03ce660c66d78261988b78a82239664c596600af4b` = the packet header's stamp | CONFIRMED |
| sealed `checks` | 13, `tests/lint --exclude=…lighting…` at index 10, `validate` 11, `build:edge-shared` LAST | CONFIRMED |

## STOP conditions checked BEFORE the first edit

- **STOP 2 — the defect reproduces.** A jailed ruler through `readWarSeatBooks` at the base:
  `securityBand:'holding'`, `seatWeight01:0.3744`, `rulerId:'a:ruler'`. `exiled`, `removed`,
  `missing`, `retired` identical; `dead` alone reads `unseated / 0 / rulerId absent / realm / 1`.
- **STOP 3 —** `export const NPC_UNAVAILABLE_STATUSES = Object.freeze(['dead', 'exiled', 'jailed', 'removed']);`
- **STOP 12 —** `pulseKernel.js:178` `function buildSettlementMap`, `:184` prefers
  `item.save?.settlement`, `:579` compares `item.settlement?.npcs` (CURE-F's spelling);
  `factionDensityKernel.js:671` `advanceFactionDensity`, `:719`
  `asObject(asObject(item.save).settlement || item.settlement)` (EM-B1k2's). All unmoved.
- **STOP 14 — CLEAR.** Route B was done: **no packet in the register requires the figure text**;
  EM-B1k2's row now reads the figure-free `const UNDISPOSITIONED_CEILING`.
- **STOP 1 / §7.1 — placement free.** 194 entries, **EM-B1f the ONLY non-terminal packet**
  (EM-P2 has since landed). No other packet reserves any of the thirteen.

## Measurements — every packet figure reproduced exactly

| § | figure | packet | measured | verdict |
|---|---|---|---|---|
| §3.1 | `state.js` effective lines | 288 → 293 (+5) | **288 → 293 (+5)** | ✓ exact |
| §3.1 | raw lines | 596 → 607 (+11) | **596 → 607 (+11)** | ✓ exact |
| §3.1 | ceiling / headroom | 800, no `.size-baseline` row | `max-lines 800` for `src/domain/**`; `grep -c` → **0** | ✓ |
| §3.2 | base minified | 7,727 B | **7,727 B** (esbuild **0.28.1**, `--minify --format=esm --target=es2022`) | ✓ exact |
| §3.2 | FORM B minified | 7,911 B = **+184 B** | **7,911 B = +184 B**, bound ≤370 B | ✓ exact |
| §3.2 | module edges added | zero | edges **7 → 7**, delta **0**, edge sets identical | ✓ CONFIRMED |
| §3.2 | `entities/npcs.js` own closure | 2 modules, no cycle | **2** (itself + `src/kernel/slugify.js`); does **not** reach `roads/state.js` | ✓ exact |
| §3.2 | `advanceInterval.worker` closure | 544, `state.js` a MEMBER | **544**, MEMBER **true** | ✓ exact |
| §5 | base `state.js` sha-256 | `23ffc63b…6481` | `23ffc63bb6f39944defe147241f7f9ddbc75966509efb1bcaa4176b789676481` | ✓ exact |

**Goldens — byte-identical before the first edit and after the last:**
`7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` (generator-golden-master) and
`921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41` (dossier-prose-manifest).
`UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED` never set. **STOP 4 clear** on the fixtures.

**P2.4 writer-reach — NO GROWTH.** Identical before and after, EXIT 0 both times:
`WRWALKER HOLD — judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294 (reviewable 495)`.
**P2.3 observed-shape — NO MOTION.** `observed-shape readers: 1964 finding(s), exactly matching
the frozen inventory.` EXIT 0 both times. **STOP 5 clear.**

## §13 — THE PROMOTION MEASUREMENT, re-executed at THIS tip, BOTH ARMS

Driven against the REAL TREE (no overlay, no in-memory override): the control ran before the
production edit, the arm run after it, through the shipped
`simulateCampaignWorldPulse({ commit: true })`. The harness prints the tree it read from argv.
**Liveness anchor printed in both runs:** `isOffStage({status:'jailed'})` = `false` (control) /
`true` (arm); `isOffStage({status:'active'})` = `false` in both.

| sole Weaver | houses after the tick | roster | lifecycle reader | `faction_dissolved` |
|---|---|---|---|---|
| `active` (CONTROL) | `[The Crown, The Weavers]` | 2 of 2 | crewed | no |
| **`jailed`** | `[The Crown, The Weavers]` | 2 of 2 | crewed | no |
| `exiled` | `[The Crown]` | 2 of 2 | dissolved | **yes** |
| `removed` | `[The Crown]` | 2 of 2 | dissolved | **yes** |
| shelved (stasis) | `[The Crown, The Weavers]` | 2 of 2 | crewed | no |

⭐⭐ **ARM ON AND ARM OFF ARE IDENTICAL, ROW FOR ROW.** The `diff` of the two runs shows ONLY the
anchor lines and A1's seat rows. **STOP 11 CLEAR.** Nobody is erased in any cell (2 of 2
everywhere), and `jailed` — the member this packet adds — changes nothing at all.

**A1, arm ON:** `jailed` / `exiled` / `removed` → `unseated`, `0`, `rulerId` absent,
`interestKind:'realm'`, `settlementWeight01:1` — identical to the landed `dead` case.
`active` / `missing` / `retired` → `holding`, `0.3744`, `a:ruler`. Q1 pinned in both directions.

## ⛔ THREE REFUTATIONS MEASURED AT THIS TIP

1. ⛔⛔ **§13.0's BASE TABLE IS REFUTED for `exiled` and `removed`.** The packet states
   *"no house leaves `powerStructure.factions` in any cell"*, *"no dissolution beat fires in any
   cell"*, and *"the `exiled`/`removed` dissolved reading … is NOT a sweep"*. **Measured, arm OFF,
   at `c33446830`: the house IS swept (`[The Crown]`) and a `faction_dissolved` beat DOES fire.**
   Seed-stable across two seeds (`em-b1f-s13`, `em-b1k-a3`). The §13 premise files are UNMOVED
   between `141a1d775` and HEAD, so this is not tree drift. ⭐ **It does not block promotion** —
   it is arm-INDEPENDENT (identical in both columns) and the person is kept in every cell, which
   is the claim the packet actually needs; v3's §13.2a reading (*"dissolved, person kept"*) is
   what reproduces, and v4's *"stronger result"* paragraph is the sentence that does not.
   **The chair should re-cut §13.0's prose; the ruling is not a lane's.**
2. ⛔ **§7.3's citation is both STALE and of a BANNED FORM.** `applyOrganicNpcVerdicts` is called
   at `pulseKernel.js:660`, not `:662`. More importantly
   `tests/lint/pulseKernelLineAddress.walker.test.js` **RULE 1 freezes `pulseKernel.js:<digits>`
   at ZERO across `src/` and `tests/`, no allowlist** — writing §7.3's text verbatim would have
   reddened `tests/lint` whole. **Re-spelled as the sanctioned content anchor**
   ``pulseKernel.js `const verdicts = applyOrganicNpcVerdicts({` `` (RULE 2: the token is literally
   contained in the kernel), matching what the neighbouring `successorNpc.js` row already does.
   Verified: `pulseKernel.js:<digits>` under `src`+`tests` is still **zero**.
3. ⛔⛔ **THE STOP — §7.4's trap has a third shape.** Full working in `EM-B1f.STOP.md`.

## Edits made (all six handwritten §7 rows; `git status --short` is exactly these)

1. `src/domain/roads/state.js` — §6 VERBATIM. Import gains one specifier; `OFF_STAGE_STATUSES`
   derived and frozen; the arm added. ⛔ **The declaration line
   `export function isOffStage(npc) {` is byte-identical** (no `+`/`-` on it in the diff).
2. `tests/lint/statusUnionTotality.walker.test.js` — the FOUR edits in §8's order:
   `FLAGGABLE_SPELLINGS = Object.freeze(['literals', 'derived'])` + `LITERAL_ROWS` renamed
   `FLAGGABLE_ROWS` and widened to it; the **six-line** `derived` branch in `offencesOf` ABOVE the
   `union-read` branch; three planted sources inside the EXISTING A2/A4 `test` (honest FORM B
   passes; a hand-spelled source is convicted by name; a retired foreign spelling is convicted
   with its `file:line`); the **ninth row APPENDED at the end** with `spelling: 'derived'`,
   `enumerator: false`, `omits: ALL_BUT_DEAD` and §7's `why` verbatim.
   ⓘ The roster docblock's *"eight rows"* was updated to nine — falsified by the appended row.
3. `tests/domain/roadsState.test.js` — A2, one new `it`, all of §9's cells.
4. `tests/domain/warSeatBooks.test.js` — A1, one new `it`, the dead-holder shape with `'jailed'`,
   anchored by an `active` ruler reading `holding / 0.3744 / a:ruler`.
5. `tests/domain/roadsParticipation.test.js` — A4 and A7 as two new `it`; **the census banking**
   (`npcVerdictPulse.js` moved into `EXPECTED` in sorted position with §7.3's written disposition,
   `UNDISPOSITIONED_CEILING` **7 → 6**, quarantine now six rows). ⓘ The quarantine docblock's
   *"these seven"* / *"an EIGHTH new reader"* updated to six / a SEVENTH — falsified by the burn.
6. `tests/property/npcs.property.test.js` — the arbitrary draws `status` from the SEVEN-member
   union; the shape assertion widened to the same seven. No new title.

**Titles added: 4 `it`, 0 `describe`** — predicted lighting delta
`+0 files / +0 parked / +0 credited / +4 titles / +0 suiteTitles` against the frozen
`2656 · 383 · 2273 · 25074 · 6684`. ⚠ **NOT YET MEASURED — the walker run is gated.**

## ⛔ NOTICED, NOT TOUCHED — each specific enough to slot

1. **`isOffStage`'s own docblock now under-describes the predicate by one arm.** It still reads
   *"a DM-shelved NPC (isInStasis) OR a roads hostage"*; the status arm is absent. §6's verbatim
   diff does not amend it and a lane does not improvise past a sealed contract. **Slot: a
   comment-only cut by the chair at the flip, or a CITATION row in EM-B1a's compile** (it is next
   in this file's neighbourhood). ⓘ The new `OFF_STAGE_STATUSES` docblock sits directly above it,
   so the arm is documented — just not in the predicate's own summary sentence.
2. **`statusUnionTotality.walker.test.js:402`'s message says *"all eight flagged files"*, which
   was ALREADY wrong at the base** — it conflates the roster's eight ROWS with `FLAGGED`, which is
   six files. Pre-existing, not created here, and left untouched. **PLAUSIBLE** (derived by
   reading; the gated walker run settles it). **Slot: the TOOL lane that owns the walker's prose.**
3. **A THIRD figure-in-a-symbol is already loaded.** EM-B1k2's `requiredSymbols` carries
   `"uncoveredBaseline": 186` at `scripts/mutation-coverage-manifest.json`. The next packet that
   moves that baseline hits the §7.4 wall again. **Slot: TOOL-15**, which should be widened from
   `requiredSymbols` to `retiredSymbols` on the strength of this lane's STOP.
4. **EM-B1k2's three `_note` addresses for `roadsParticipation.test.js`** (`:409`, `:422`, `:425`)
   were already stale at `141a1d775` (live `:480`, `:493`, `:511`) and this packet's edits move
   them again. Symbol-pinned, so nothing reds. **Slot: the same TOOL lane as item 3.**
5. **`tests/lint/.tuning-inventory.json:967`'s `line: 222` for `ROADS_TUNING` goes stale** (the
   insertion sits above it). Keyed on `spanDigest`, so not asserted — re-takes on that file's next
   regeneration. Already recorded as §12.1 item 5; no action owed.
6. ⛔ **A FOREIGN STASH EXISTS IN THE SHARED TREE AND WAS PRESERVED:**
   `stash@{0}: On analytics-intelligence-layer: generation-tuning fixes`. Not this lane's, not
   this branch's. Never popped, dropped, applied or cleared. Flagged because the resume note's
   first draft told a resumed lane the stash list should be empty — corrected.
7. ⛔ **A NAMED PRE-EXISTING RED SITS ON SEALED CHECK 7 — the chair's, reported 08:4x, NOT
   EXECUTED BY THIS LANE.** Run 21 (the chair's full check at this exact tip `c33446830`, before
   any byte of this lane) is red on exactly ONE title, by another hand:
   `tests/property/dossierProseManifest.test.js :: ⭐ THE PROVENANCE REFUSES A FIXTURE ITS
   RECORDER DID NOT WRITE` — *"a fixture whose recorder has moved since it was written is
   REFUSED: re-record with `node scripts/prose-manifest-cells.mjs --record`"*. The chair ruled it
   pre-existing, forbade this lane to re-record, and owns the cure (**CURE-J**).
   ⭐ **This lane's own evidence separates it cleanly from STOP 4:** both golden FIXTURE files are
   **byte-identical before the first edit and after the last**
   (`7177cd6e…8f1e`, `921c51cf…db41`), so nothing this packet did moved a golden — the refusal is
   a RECORDER-PROVENANCE refusal that predates this lane's first byte. `UPDATE_GOLDEN` and
   `GOLDEN_SHIFT_SIGNED` were never set. **Labelled REPORTED (the chair's execution), not
   CONFIRMED by this lane.**
8. **The dist-read byte arm was NOT run by this lane.** `tests/build/vendorPdfLazy.test.js` is not
   in this packet's `checks`, and the chair's dispatch assigned `npm run build` + `verify:dist` to
   the landing. A skipped byte arm is not a pass — the chair's landing run is what proves the
   `< 679_000` engine literal. This lane's byte evidence is the esbuild delta (+184 B) only, which
   is **CONFIRMED as a minified-source delta and PLAUSIBLE as a rendered-chunk delta**.
