# EM-B1f VERSION 3 — COMPILE REPORT (Opus COMPILE lane, 2026-09-20, at `19c4cb853`)

## STATUS: `DRAFT` — READY-able. ⭐ THE VERSION 2 BLOCK IS LIFTED BY EXECUTION.

Version 2 was `BLOCKED` because the participation filter was the tick's write base: adding `jailed`
would have erased a person from the save and dissolved their house. **EM-B1k's cure is in the tree
at `19c4cb853`**, and this lane re-ran both reproductions there **with this packet's own arm
applied**. The answer is unambiguous and is quoted in full in the evidence.

| cell | kernel | arm | subject | persisted roster | house |
|---|---|---|---|---|---|
| 1 | pre-cure | off | DM-shelved | ⛔ **6 of 7**, `npc_target_missing` | ⛔ dissolved |
| **7** | **pre-cure** | ⭐ **ON** | `jailed` | ⛔ **6 of 7**, `npc_target_missing` | ⛔ dissolved |
| 2 | **landed** | off | DM-shelved | ✓ 7 of 7, un-shelve OK | ✓ stands |
| **4/5/6** | **landed** | ⭐ **ON** | `jailed` / `exiled` / `removed` | ⭐ **7 of 7** | ⭐ `jailed` stands |

Cell 7 against cell 4 is the whole answer: the same arm, the same fixture, the same tick — erasure
before EM-B1k, none after. And over eight statuses the sole-member-house table at the cured tree is
**byte-identical with the arm on and off**. The `exiled` / `removed` dissolutions that remain are
the pre-existing `ROSTER_ABSENT_STATUSES = ['dead','exiled','removed']` reading
(`factionLifecycle.js:87`), fire identically with the arm absent, and keep the person in the record.

## THE FOUR PATHS

| file | what it is |
|---|---|
| `$SP/lane-em-compile-EM-B1f-scratch/EM-B1f.md` | the packet, version 3, twelve template sections |
| `$SP/lane-em-compile-EM-B1f-scratch/EM-B1f.manifest.json` | the manifest entry (DRAFT; 12 change rows, 8 requiredSymbols, 7 acceptanceCases as `{id, case}`, 11 `checks`) |
| `$SP/lane-em-compile-EM-B1f-scratch/EM-B1f.evidence.md` | version 3's numbered receipts, §1–§17 |
| `$SP/lane-em-compile-EM-B1f-scratch/EM-B1f.compile.report.md` | this file |

Versions 1 and 2 are preserved unedited beside them: `EM-B1f.v1.{md,manifest.json,evidence.md,compile.report.md}`,
`EM-B1f.v2.md`, `EM-B1f.manifest.v2.json`, `EM-B1f.evidence.v2.md`, `EM-B1f.compile.report.v2.md`,
`RECON-STAGE.report.md`. Probes: `v3-loader.mjs`, `v3-dm-repro.mjs`, `v3-house-repro.mjs`,
`v3-seat-probe.mjs`, `v3-walker-loader.mjs`, `v3-walker-probe.mjs`, `v3-lighting-loader.mjs`,
`v3-lighting-probe.mjs`, `v3-closure.mjs`, `v3-bytes.mjs`, `v3-efflines.mjs`, `v3-corpus-census.mjs`.
Every one takes its tree from an environment variable with **no default**.

⛔ **Nothing outside `$SC` was written.** `git status --short` was EMPTY in `$SP/slot-2` and
`$SP/read-tip-32602dc60` at the start and at the end of the lane. No gate was run.

## THE BUDGET TABLE

| Limit | Budget | This packet |
|---|---:|---:|
| Behavior families | 1 | **1** |
| New record families · writers · flags · surfaces | 0 or 1 | **0 · 0 · 0 · 0** |
| New logic leaves | ≤2 | **0** |
| Existing logic files modified | ≤3 | **1** (`src/domain/roads/state.js`, 288/800 eff, 512 headroom) |
| Registration-only files | ≤3 | **1** (the walker) |
| Handwritten files | ≤12 | **5** |
| New/changed effective production lines | ≤400 | **≤6** |
| Acceptance cases | ≤8 | **7** |
| Hot files touched | — | **0** (measured against the chair's re-measured six-row list) |

## THE DELTAS (never an absolute)

| register | DELTA | basis |
|---|---|---|
| sovereignty lighting census | **`+0 files / +0 parked / +0 credited / +4 titles / +0 suiteTitles`** | executed: `parkReasonsFor` returns `[]` for all four homes; the packet adds four straight-line `it` and no `describe` |
| lazy `engine` chunk (`< 679_000`) | **+184 B measured, bound ≤370 B** | esbuild 0.28.1 over the real file; base 7,727 → 7,911 |
| `advanceInterval.worker` | **a +184 B DELTA against TOOL-3's 4 KB per-TRAIN headroom** | no per-packet re-mint (the chair's Q3) |
| generation worker (`1401208`, zero slack) | **0 B** | `roads/state.js` absent from its 220-module closure |
| eager first paint | **0 B** | `roads/state.js` absent from the closure; FORM B adds zero module edges |
| module closures, all four | **+0 modules** | the `../entities/npcs.js` import statement already exists at `:36`; `npcs.js`'s own closure is 2 modules and does not reach back (no cycle) |
| `_shared` generated paths | **7** | generator (five `ENTRIES`, one `generatedAt` window) AND precedent (`95e494bdb` = exactly these seven) |
| mutation-coverage · observed-shape · writer-reach · prose-numerics · fork · wiring-census · tuning register · line citations | **0 / NOT OWED** | each measured; the negatives live in §7.2, never in the §7 table |

## THE COLLISION GROUP — ⭐ FREE AT THE TIP (the branch moved under the lane, in this packet's favour)

Measured twice, because the branch advanced while version 3 was being compiled.

- **At the compile base `19c4cb853`:** 191 entries — 187 `LANDED`, 2 `SUPERSEDED`, 2 `READY`.
  ⛔ EM-B1k was **still `READY`** although its code landed in that very commit, so it reserved
  `tests/domain/roadsParticipation.test.js` and `validate` would have refused EM-B1f with
  *"duplicate change path across packets: tests/domain/roadsParticipation.test.js (EM-B1k,
  EM-B1f)"*.
- ⭐ **At `96036427f`, the tip as this lane closed:** the chair flipped **EM-B1k → `LANDED` at
  `63e40fe57`**, with CURE-E (`9f3455b84`) and CURE-F (`96036427f`) behind it. The register reads
  **188 `LANDED` / 2 `SUPERSEDED` / 1 `READY`**; the only non-terminal packet is **EM-B3c**, which
  shares none of the twelve. **PLACEMENT IS FREE.** `19c4cb853` is an ancestor of `96036427f`, and
  `git diff --stat` over all twelve change paths, all seven `requiredSymbols` paths and
  `supabase/functions/_shared/` across that window is **EMPTY** — every figure in the packet stands
  at the new tip, and all eight `requiredSymbols` re-confirmed `grep -cF` = 1 there.
  **Recommend the chair stamp `96036427f`.**
- ⚠ **EM-B1k2** (DRAFT, kit `packets-waiting/`, not yet in the register) declares the same test
  path. Two non-terminal packets cannot both hold it, so the order is the chair's (Q3).
- **No packet in the register declares `src/domain/roads/state.js`.** ✓
- Discharge sweep: three other rows name this packet's (path, symbol) pairs — EM-B1d on
  `rosterNpcById`, EM-B1k on `buildWorldSnapshot` and `factionRosterOf`, all now LANDED — every one
  a PRESERVE row over a symbol this packet does not touch. `retiredSymbols` is empty; nothing owed.
- ⓘ **In-flight working-tree state in the slot, another lane's and untouched:** a rename
  `tests/store/participationWriteBase.test.js → …contract.test.js` plus
  `scripts/mutation-coverage-manifest.json` and `tests/scripts/baseStateCapsule.test.js` edits.
  It touches none of this packet's paths, but it renames a **LANDED** packet's declared CREATE
  target — the chair may want to know.

## THE PROOFS, IN ONE LIST

1. **The promotion measurement** — seven DM cells + four house cells × eight statuses, driven
   through `simulateCampaignWorldPulse({commit:true})` and the real `applyWorldPulseResultToState`.
   Evidence §2–§3.
2. **A1 executed both ways at the landed tree** — a jailed/exiled/removed ruler reads
   `holding · 0.3744 · a:ruler` before the arm and `unseated · 0 · (absent) · realm · 1` after;
   `missing`, `retired`, `'sabbatical'`, a non-string and an absent key all stay seated. Evidence §6.
3. **The ninth roster row through the walker's own `offencesOf`** — the lawful row returns `[]`;
   `union-read` is convicted (`spells dead at 158:dead`); a short `why` is convicted; ⛔ **and the
   charter's own ruling text is convicted twice**. `spelling:'literals'` and `enumerator:false` are
   both FORCED by the walker's set-equality arms, and the row must be **APPENDED** because A3
   drives three synthetic probes off `CONSUMER_ROSTER[3]`. Evidence §7.
4. **The lighting delta through the walker's own `parkReasonsFor`**, with the classifier proved
   live on two planted parks. Evidence §8.
5. **Bytes, closures and effective lines re-measured**; the base file is byte-identical to version
   2's (same SHA-256), so every figure reproduces. Evidence §9–§10.
6. **Seven `_shared` paths, both ways.** Evidence §11.
7. **Golden neutrality over the FULL 525-row corpus** — 5,171 NPCs, zero of the three. Evidence §12.
8. **Every `.status` writer in `src/`.** Evidence §13.
9. **Four line/stamp registers proved inert by reading their own discovery regexes and asserted
   keys.** Evidence §14.
10. **The preamble re-measured**: `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1`
    — identical to the brief's stamp. Evidence §5.

## ⛔ TWO VERSION 2 CLAIMS CORRECTED (both found by re-measuring, both harmless to the price)

1. **"eager first paint — both importers absent" is REFUTED.** `src/domain/entities/npcs.js` **is**
   in the eager first-paint closure (`main.jsx → store/index.js → settlementSlice.js →
   events/mutateEntities.js → entities/npcs.js`). `roads/state.js` is still absent and FORM B adds
   no module edge, so the budget is untouched — but the sentence was wrong and is struck.
2. **"no writer in `src/` can assign `exiled` or `removed` to `.status`" needed a qualifier.** Two
   writers DO write `status: 'removed'` — `settlementLifecycleFirstClass.js:601` and
   `tierOutcomeApply.js:143` — and **both write an INSTITUTION** (`demotionFateForInstitution`;
   `EntityStatus` carries `removed` as a homonym). The claim now reads *no writer assigns any of
   the three to an **NPC's** `.status`*.

## NUMBERED CHAIR QUESTIONS (not waited on)

1. ⛔ **The charter's ruling (3) text for the ninth roster row is REFUTED BY THE WALKER.** The
   amendment of 2026-09-19 17:36 says the reasoned omission names `active`, `dead`, `missing`,
   `retired`. Executed, that row is convicted twice: *"omits a word that is not a member of the
   live union: active"* (the stale check tests `NON_ACTIVE`, which excludes `active` by
   construction) and *"enumerates the union without exiled, jailed, removed"*. The only lawful
   `omits` is `ALL_BUT_DEAD` = `['exiled','jailed','missing','removed','retired']`, which is the
   shape the three existing chokepoint rows already use. **The packet carries the lawful row; the
   chair amends the ledger or overrules the walker.**
2. ✓ **ANSWERED WHILE THE LANE RAN — no question remains.** EM-B1k's row was flipped to `LANDED`
   at `63e40fe57`. Placement is free; **stamp `96036427f`** rather than `19c4cb853`, since only at
   the former does `validate` pass, and nothing this packet measures moved between them.
3. ⚠ **The placement order on `tests/domain/roadsParticipation.test.js`,** now a two-way question:
   EM-B1f and EM-B1k2 (DRAFT, not yet in the register) both declare it, and the validator permits
   ONE non-terminal owner. The cheapest order measured — and the charter's own — is EM-B1f first
   (it is FIRST in train EM-T6 because it blocks EM-B1a): place, build and flip it, then place
   EM-B1k2 and re-run its pre-proof at that tip. The reverse works at the cost of one re-base.
4. ⚠ **Does EM-B1f need EM-B1k2's defence in depth before it lands?** §13 says no — cells 4–6 are
   executed end-to-end through the shipped entry point. But EM-B1k2's own finding stands: `fresh`
   falls back to `tickStart` when an update entry carries no `.settlement`
   (`factionDensityKernel.js:721-723`), so EM-B1k's refusal rests on an invariant nothing pins.
   The chair may prefer B1k2 first for that reason alone; the packet does not adjudicate.
5. ⚠ **Should the walker gain a `spelling: 'derived'`?** Under FORM B the `omits` field lists
   `exiled, jailed, removed` — exactly what the arm ACTS ON, merely not spelled — so the row reads
   backwards though it is lawful. A tooling question (TOOL-7's family), not this packet's.
6. ⓘ **`checks` gained `tests/property/roadsDormancyGolden.test.js`**, copying EM-B1k's own landed
   row, because A5's dormancy claim is precisely what it pins. Confirm or strike.

## ⛔ EVERYTHING NOTICED AND NOT TOUCHED — each specific enough to slot (the owner's law)

1. ⛔ **The charter's ninth-row ruling text is wrong** — Q1 above. **SLOT: the chair corrects the
   amendment of 2026-09-19 17:36 ruling (3) in the sitting that promotes this packet.**
2. ✓ **CLOSED during the lane:** EM-B1k's `LANDED` flip landed at `63e40fe57`. Recorded so the
   chair does not re-derive it.
3. ⚠ **EM-B1f and EM-B1k2 both want `tests/domain/roadsParticipation.test.js`** — Q3. **SLOT: the
   chair fixes the order before the second of the two is placed.**
3b. ⚠ **A rename of a LANDED packet's declared path is in flight in the slot's working tree**
   (`tests/store/participationWriteBase.test.js → …contract.test.js`, EM-B1k's CREATE target,
   alongside a `scripts/mutation-coverage-manifest.json` registration — TOOL-6's family).
   **SLOT: whoever owns that lane says whether EM-B1k's LANDED change-manifest row is re-addressed
   with it**; a LANDED packet's path is normally frozen, and `check:packet` reads the manifest.
4. ⚠ **`src/domain/worldPulse/tierOutcomeApply.js:137-149` (`demotionFateForInstitution`) writes
   `status: 'remnant'` to institutions in SIX of its seven branches, and `'remnant'` is NOT a
   member of the `EntityStatus` typedef** (`src/domain/entities/status.js:23` =
   `active|impaired|removed|destroyed|vacant`), which `statusUnionTotality.walker.test.js` A1 pins
   at exactly five and calls "PINNED UNCHANGED". A live totality hole in the sibling union. **SLOT:
   EM-B1h's family (the `worldPulseFate` / entity-status vocabularies) — measure first whether any
   reader tests `status === 'remnant'`, then rule whether the typedef or the writer is wrong.**
5. ⚠ **`tests/lint/.tuning-inventory.json`'s `line: 222` for `ROADS_TUNING` goes stale** with this
   edit. Not asserted (`tuningRegister.walker.test.js:406` keys on `spanDigest`, and `:428` pins
   exactly this case), so it re-takes with that file's next regeneration. **CLOSED — no action
   owed; recorded so it is not re-found.**
6. ⚠ **Nine `docs/**` prose citations address `src/domain/roads/state.js` by line**
   (`DESIGN_FP_ARCHITECTURE.md:335`, `DESIGN_FP_ARCH_GR.md:145`, `DESIGN_FP_ARCH_SP.md:144`,
   `DESIGN_FP_ARCH_WF.md:173` and `:770`, `SETTLEMENT_CAPABILITY_ATLAS.md:7374`, `ES-5B.md:97` and
   `:366`, `ES-5C.md:435`, `WF-SUBSTRATE.md:344`). Two (`:319` `riskToleranceOf`, `:145-149`
   `isOffStage`) go stale by ~+9; `:122` sits above the insertion. **No walker reads them. SLOT:
   whoever next edits those volumes re-addresses; recorded so it is not re-found.**
7. ✓ **CLOSED, owned elsewhere:** the participation ratchet's scan roots are still only
   `src/domain/worldPulse` and `src/domain/spatial` (`roadsParticipation.test.js:428`) —
   **EM-B1k2 owns the widening to `src/domain/density`, and `src/generators/density` at its
   pre-proof** (charter, 2026-09-20 02:53). Version 2's §12.1 items 3 and 6 are discharged.
8. ⚠ **`tests/property/npcs.property.test.js:40`** asserts an NPC's status is one of five, omitting
   `removed` and `jailed`; it cannot red because its arbitrary never generates a `status`. **SLOT:
   one line, whoever is next in that file.**
9. ⓘ **The closure probe's console label is hard-coded to `roads/state.js`** even when `TARGET_REL`
   names another file (`$SC/v3-closure.mjs`, inherited from version 1). Harmless here because the
   evidence states the target per run, but it is the shape of a silent-failure idiom.
   **SLOT: TOOL-7's family, with the marker-slice arm of ODQ addendum 41 — a label that cannot
   disagree with its subject.**
10. ⓘ **`PACKET_STANDARD.md`'s hot-file list moved under this lane's feet** in the window
    (`c740ded8b`: `convergence.js` 798 → 764, `institutionLifecycle.js` joined at 798). Nothing
    owed — recorded because version 2 quoted the five-row list and version 3 quotes six.
