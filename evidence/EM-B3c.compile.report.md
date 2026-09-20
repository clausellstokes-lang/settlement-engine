# EM-B3c — COMPILE LANE REPORT, VERSION 2 (under the chair's rulings R1–R5)

**Verdict: DRAFT, READY-able.** Every question version 1 was BLOCKED on has been ruled and the
rulings are carried. Nothing in the packet awaits a further decision. **Two questions remain for
the chair and one line belongs to the owner — all three are recorded, none blocks promotion.**

**Seat:** Opus COMPILE. **Tree:** `$SP/read-tip-58fcfe614`, re-confirmed `58fcfe61458b784b0470b854caf916b7c2961edf`,
`git status --porcelain` empty at the start and end. **Compiled** 2026-09-19 17:3x–17:5x EDT.
**Nothing was edited, staged or committed anywhere. No vitest, no eslint, no npm script, no
build was run, and none is claimed.** Five scratch `node` scripts, one process at a time.

## Files

| file | what it is |
|---|---|
| `…/lane-em-compile-EM-B3c-scratch/EM-B3c.md` | the packet, **version 2, status DRAFT**, twelve sections; `__BASE__` with the chair's revalidation sentence pre-written |
| `…/EM-B3c.manifest.json` | valid; **8 change rows, 21 requiredSymbols, `retiredSymbols []`, 8 acceptance cases, 7 `checks` arrays**, the budget, fifteen priced registration costs, the collision census, the dispatch dry-read |
| `…/EM-B3c.evidence.md` | E0–E12 unchanged from v1, **E13–E20 new** |
| `…/EM-B3c.compile.report.md` | this file |
| `…/EM-B3c.v1.{md,manifest.json,evidence.md,compile.report.md}` | version 1, preserved beside them |
| `m1…m5.mjs` | the read-only scratch measurements (`m4-migration-203.mjs` and `m5-budget.mjs` are new) |

---

## 1 — What changed from v1

| ruling | what v2 does |
|---|---|
| **R1** re-cut ACCEPTED | the subset claim is now settled law in §1, not a question in §12. The packet asserts what nothing asserts — every client `WORLD_SNAPSHOT_HARD_DENY` member is refused by the net-current scanner — plus the reconciliation arm, the numeric-sort arm and the measured `CANNOT-CATCH:` list |
| **R2** gap CLOSED, one landing | a **second CREATE row** — `supabase/migrations/203_gallery_scanner_client_mirror_totality.sql` — and everything a new scanner migration owes (thirteen sites classified). **No exemption list.** §8 writes the walker FIRST, quotes its red on exactly three names, then lands 203 and quotes the green |
| **R3** local copy accepted | §2 non-goals name TOOL-4 as the chair's; the CREATE instruction tells the lane to say in a comment that A4 keeps the third copy honest |
| **R4** `"rationale"` row | the REGISTER instruction spells the reason and cites the executed mutants A3/A4/A5/A6/A8 |
| **R5** floated with priority | every register prediction is a DELTA; `verifiedBase` is `__BASE__`; the collision census is per path with the dispatch window named |
| **budget** | measured: **≤96 of 400 effective production lines, 8 of 12 files.** No split needed, none proposed |

Two things v1 could not know, both measured and both consequential: **203's effective SQL cost
is 58 lines — identical to 202's**; and **the `dmLayer`/`decrees` literal lines in the 202-wave
arm are NOT subsumed by the subset claim and must be kept unchanged.**

---

## 2 — Migration 203, built and proved mechanically

**How the three members are spelled, and why (E14.1).** `202:93` is
`if lower(key) = any (select lower(x) from unnest(hard_deny) as t(x)) then` — **both sides are
lowered at comparison time** while the array literal is written in the client's camelCase. The
three new members therefore read `'factionPairStates','envoyErrands','concludedWars'`, appended
to the existing `'politicsLedgers'` line. That comparison line is now a `requiredSymbols` row, so
the spelling is contractual rather than stylistic.

**THE MECHANICAL-DIFF CONTRACT, EXECUTED (E14.3):**

```
byte-identical outside the array literal? true
residual length (identical both sides): 3582
alternation UNCHANGED? true (34 alternatives both sides)
hard_deny 202 -> 25 members; 203 -> 28 members; ADDED: ["factionpairstates","envoyerrands","concludedwars"] ; REMOVED: []
```

The build lane gets the exact check in §8 step 4 (mask each body's `hard_deny` array literal;
assert the remainders are identical; assert the alternation arrays match element for element;
assert three in and none out). **Any other difference is a STOP.**

**THE WALKER AFTER 203 (E14.4):** `unrefused: []` — **28 of 28 refused, every member
`by='array'`.**

The header comment corrects 136's and 202's stale claim by **naming the rule instead of a
snapshot**: *every member of the client `WORLD_SNAPSHOT_HARD_DENY` except the public-allowlisted
`pantheon`*, with the three dates the old claim went stale written into it.

---

## 3 — The mutants re-run against the post-203 text (R2(d))

```
BASE post-203                                        drift GREEN | subset GREEN | owner pin GREEN
M-a' hard_deny loses 'dmLayer'                       drift GREEN | subset GREEN | owner pin GREEN
M-b' hard_deny loses 'decrees'                       drift GREEN | subset GREEN | owner pin GREEN
M-c' alternation loses '.*decrees.*'                 drift RED   | subset GREEN | owner pin GREEN
M-d' a NEW 204 re-creating 136's body verbatim       drift RED   | subset RED (4 names) | owner pin RED
M-e' a NEW 204 = 203 minus the THREE new members     drift GREEN | ⭐ subset RED (the three) | owner pin RED
M-f' a NEW 204 = 203 minus BOTH editor keys          drift GREEN | subset GREEN | owner pin RED
```

⭐ **The chair's demand is met: M-e′ is caught AT THE SUBSTANCE.** A 204 that drops the three
array members with the alternation intact is GREEN on the drift test and **RED on EM-B3c's
subset claim, naming the three** — independent of the owner pin.

### ⛔ A finding that changes one line of the plan: M-a′/M-b′/M-f′ are GREEN on the subset claim

This is **correct behaviour, not a hole.** After 203, striking `'dmLayer'` from the array leaves
the key refused by the alternation `.*dm.*`; the subset claim asks *is the key refused*, not *by
which mechanism*, so it is rightly green. The consequence:

> **`tests/ops/migrationRehearsal.test.js:383` and `:387–388` assert something STRICTLY STRONGER
> than the subset claim** — the *array* mechanism specifically, 202's deliberate
> belt-and-suspenders. **They are NOT subsumed and must be KEPT.**

**Answer to the chair's question in R2(c):** they **simply keep passing** under 203 — 203 removes
nothing — so they need **no 203 twin and no edit**. Only the `scanner.owner` pin on the line
above them is re-pointed. The packet forbids touching those two lines in §5, §7 and §11.

**The measured division of labour — no guard is redundant (§P6 satisfied):** an alternation
alternative removed → only the drift test; a client hard-deny member unmirrored → only EM-B3c;
a wholesale regression to a pre-202 body → all three; the array mechanism weakened for the two
editor keys while the alternation still covers them → only the 202-wave arm's two literal lines.

---

## 4 — The full list of paths migration 203 obliges (thirteen sites classified, E16.2)

**IN THE MANIFEST (8 files):**

| path | action | what moves |
|---|---|---|
| `tests/security/galleryScannerMirrorTotality.test.js` | CREATE | the walker, ≤190 raw lines, 1 describe + 8 its |
| `supabase/migrations/203_gallery_scanner_client_mirror_totality.sql` | CREATE | **58 effective SQL lines** |
| `scripts/ops/migrationRehearsalCore.mjs` | MODIFY | `MIGRATION_TRAIN_REPO_HEAD` `202`→`203` (+0 eff); one wave row appended (≤34 eff) |
| `tests/ops/migrationRehearsal.test.js` | TEST | **ten** figures (`:108`, `:109`, `:131`, `:138`, `:382`, `:496`, `:499`, `:511`, `:521`, `:522`, `:644`) + one `toMatchObject` **inside an existing `it`**. ⛔ `:383`/`:387–388` untouched. **No new title** |
| `scripts/mutation-coverage-manifest.json` | REGISTER | one `"rationale"` row, +4 |
| `docs/DEPLOY.md` | DOC | `:198` head filename — **FORCED** by `deployRunbookFreshness.test.js:121` |
| `ARCHITECTURE.md` | DOC | `:269` `(202)`→`(203)` — **FORCED** by `docCounts.test.js:30–33` |
| `docs/CURRENT_STATE.md` | DOC | `:5` contiguity, `:79` head + gap `2`→`3`, `:82–83` the purpose clause — **FORCED** by `architectureFreshness.test.js:161–180` |

**MEASURED AND DELIBERATELY EXCLUDED (5 classes):** `supabase/applied-head.json` (the bump is
the owner's; `200 <= 203` still holds); `supabase/rollback/` (200/201/202 carry no `.down.sql` —
the in-file `@rollback:` idiom); `docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md` (names no migration
number); seven scripts and tests that DERIVE from disk or from `MIGRATION_TRAIN_REPO_HEAD`;
`tests/scripts/implementationPackets.test.js` (a synthetic `= 198` fixture, not a tree claim).

⛔ **A TRAP MEASURED AND AVOIDED.** `scripts/implementation-packets.mjs:775–783` (rule HK-5)
**REFUSES** any `requiredSymbols` row pinning a migration-head FIGURE in five named paths — *"the
head is a figure that moves with the next migration, so this row traps every later migration
member against a packet it never touched."* The packet's four rows in those paths were run
through HK-5's own predicate: **all four ACCEPTED** (they name exports and a heading, never a
figure), matching EM-B3b's shape exactly.

**203 is free:** highest on disk is 202; `ls …/203*` → no matches. A contended number at dispatch
is a named STOP and a re-number, never a squeeze (§11).

---

## 5 — Register deltas (all DELTAS; no absolute quoted)

| register | delta |
|---|---|
| **sovereignty-lighting census** | **`files +1 · parked +0 · credited +1 · titles +8 · suiteTitles +1`** — ONE new test file, one `describe`, eight `it`s, statically registered ⇒ credited. ⭐ The `tests/ops/migrationRehearsal.test.js` edits add **no title** (figures move inside an existing `it`). Absolute = the chair's stamp; refreeze = the terminal's |
| **mutation-coverage manifest** | **+1 `"rationale"` row**; `uncoveredBaseline` **unmoved at 186**; `enumerated` 686 → 687 against a `≥ 686` floor; `sweepLabels` unmoved |
| **migration-rehearsal train** | `MIGRATION_TRAIN_REPO_HEAD` `202`→`203`; `MIGRATION_WAVES` **+1 row**; `plan.pendingCount` `81`→`82`; the live-plan pin `repoHead 202→203, pendingCount 2→3` |
| **doc freshness pins** | three docs move because three tests derive the figures from disk — **forced, not stylistic** |
| **`supabase/applied-head.json`** | **0 — not touched.** The owner's hand |
| **anchored-negatives / test ratchet / voiceMechanics / prose-numerics / observed-shape / writer-reach / edge-shared / byte budgets** | **0 each**, each priced with its reason (E6, E7) |

---

## 6 — `requiredSymbols` (21) and the post-edit simulation

All 21 proved at `58fcfe614` with `grep -cF` → **count = 1 each** (E20). Nine are new in v2:
the `lower(key) = any (…)` comparison line, the three `migrationRehearsalCore.mjs` exports, the
rehearsal wave-gap test title, the two doc-freshness titles, `docs/DEPLOY.md :: Current migration
head`, and `supabase/applied-head.json :: "appliedHead"` — the last eight copied from **EM-B3b's
own requiredSymbols list**, the estate's proven set for a scanner migration.

**POST-EDIT SIMULATION: 21 / 21 HOLD. `retiredSymbols` is EMPTY.** The packet creates two files,
modifies one production file, moves figures inside one test file, inserts one JSON object and
changes four doc lines. It **moves, renames and deletes no symbol at any path.** The two rows
that could have been disturbed are not:

- `export const MIGRATION_TRAIN_REPO_HEAD` — the packet changes the **value** `202`→`203`, but the
  row's symbol text is **figure-free** (and a figure-bearing row would have been refused by HK-5),
  so the verbatim assertion is unaffected;
- `docs/DEPLOY.md :: Current migration head` — the **heading** survives; only the filename after
  it changes.

**No other LANDED packet's rows need discharging**, and in particular **EM-B3b's ten rows all
survive** for exactly those reasons (it names the export not the value; `MIGRATION_WAVES` is
appended to, not replaced; the wave-gap title is untouched; `136_…sql`, `snapshotDenylistDrift`'s
test title and `"appliedHead"` are untouched).

Both CREATE targets absent (`ls` → *No such file or directory*; `203*` → *no matches*); tree
Git-clean.

---

## 7 — Budget: no split needed

| row | effective production lines | files |
|---|---:|---|
| `203_…sql` (CREATE, registration-only) | **58** | 1 |
| `migrationRehearsalCore.mjs` (MODIFY) | **≤34** | 1 |
| `mutation-coverage-manifest.json` (REGISTER) | **+4** | 1 |
| the walker (CREATE, TEST) | **0** — ≤190 raw | 1 |
| `migrationRehearsal.test.js` (TEST) | **0** | 1 |
| three DOCs | **0** | 3 |
| **TOTAL** | **≤96 of 400** | **8 of 12** |

⭐ **203 costs exactly what 202 cost — 58 effective lines** — because the three members ride the
existing `'politicsLedgers'` line and the seven lines of new explanation are `--` comment (E18).
Existing logic-bearing production files modified: **1** of ≤3. Registration-only files: **2** of
≤3. Acceptance cases: **8** of ≤8. **24% of the line budget and 67% of the file budget: the
red-first proof and its cure stay in ONE landing, as ruled, and no cut is proposed.**

---

## 8 — Collisions and the dispatch window (R5)

Measured over the live manifest (188 packets; `LANDED 185 · SUPERSEDED 2 · READY 1`):

- ⭐ **`EM-B1d` (READY) is the ONLY non-terminal reserver of any of the eight change paths**, and
  it reserves exactly one: `scripts/mutation-coverage-manifest.json`.
- `supabase/migrations/**`, `scripts/ops/migrationRehearsalCore.mjs`,
  `tests/ops/migrationRehearsal.test.js` and the three DOCs are reserved by **nobody**
  non-terminal (WEB-1/2/3, EM-B3b, DOM-1, DOM-2, IA-1, WEB-8 all LANDED).
- ⚠ **On the chair's list of three: `EM-P1` and `EM-P2` are ABSENT from the live manifest**
  (`EM-P1 present? false | EM-P2 present? false`; exactly one non-terminal packet exists). They
  reserve **nothing today**; the reservation is **prospective**, beginning when the chair
  re-admits them — EM-P2 v3 at EM-T3.5, EM-P1 at EM-T4 per the charter.

**THE WINDOW: dispatch immediately AFTER train EM-T3's terminal.** EM-B1d *closes* EM-T3, so the
single contention ends there by construction and **no re-ordering is required**. Dispatching
*into* EM-T3 alongside EM-B1d would fail the sealed dispatch's "non-CREATE target must be
Git-clean" check on that one path.

---

## 9 — Questions for the chair, and the owner's line

**Neither question blocks promotion.**

**Q1 (chair) — the structural replacement for the `scanner.owner` pin, as asked, not built.**
`migrationRehearsal.test.js:382` conflates *the extraction works* with *this migration is
newest*; the second rots on every scanner migration and this packet re-points it as every
previous one has. The non-rotting form is an EXISTENCE claim plus EM-B3c's arm A5:

```js
expect(scanner.declarers).toContain('<this wave's migration file>');      // never rots
expect(scanner.owner).toBe(highestNumberedDeclarer(scanner.declarers));   // EM-B3c arm A5
// …the wave's SUBSTANCE claims (hardDenyMembers ⊇ {…}, denies(…)) stay exactly as they are
```

It would edit a LANDED packet's `checks` member, so it belongs in the tooling window beside
TOOL-4, not inside a security landing. **Does the chair want it chartered as TOOL-5?**

**Q2 (chair) — the migration's name.** The packet uses
`203_gallery_scanner_client_mirror_totality.sql` and the wave id
`gallery-scanner-client-mirror-totality`, matching the walker's name. Both appear in the wave
row, the `scanner.owner` pin, DEPLOY.md and CURRENT_STATE.md, so a rename at promotion is cheap
but touches six sites. **Ratify or rename now.**

**⛔ THE OWNER'S LINE, carried in the packet's header and its §12 receipt, verbatim:**

> **"APPLYING migrations 201–203 (`supabase db push` + the applied-head bump) is the OWNER's
> hand; until then production's scanner is the pre-202 definition and the gap this packet closes
> is OPEN IN PRODUCTION."**

---

## 10 — Labelling

Everything in §§1–8 and in `EM-B3c.evidence.md` E13–E20 is **CONFIRMED** — a quoted command with
its output, executed at `58fcfe614`. Four claims are **PLAUSIBLE** and marked as such in the
packet:

1. **the walker's ≤190-line estimate** — reasoning from three helpers and eight cases; no file
   exists to measure;
2. **"≤34 effective lines for the wave row"** — EM-B3b's own measured figure for the identical
   shape, carried forward, not re-measured on a row that does not exist yet;
3. **"the walker is GREEN after 203"** — the *predicate* was executed against the constructed
   203 body and returned `unrefused: []` with all 28 `by='array'`, but the walker file itself has
   not been written or run (no lane may run vitest here);
4. **"a `DO`-block re-creation has zero occurrences at this tip"** — grep-measured over the
   eleven files mentioning the symbol, which is precisely why it is a `CANNOT-CATCH:` row rather
   than an assertion.
