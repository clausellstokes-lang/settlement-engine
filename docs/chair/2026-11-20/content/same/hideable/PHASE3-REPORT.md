# SAME-2 · BRIEF H · THE HIDEABLE WALKER, PHASE 3: THE REPORT

Builder H, 2026-11-20, branch `lane/same-2-hideable-2026-11-20`. The walker is `tests/lint/samenessHideable.walker.test.js`.

## UNIT 4: DAILY LIFE'S OWNER-ONLY SLOT, DM-ONLY BY CONSTRUCTION

**THE GATE, MEASURED.** The gate is not code yet on any branch. `commoner_resentments_dm` is absent from the src and tests of
`lane/daily-1-2026-11-20` (0eadcb032), `lane/daily-1-2026-11-20-b1` (de69de46a) and `lane/daily-2-2026-11-20` (ae5a7ae88).
It exists only as DAILY-2's brief B3, item E1 (`docs/chair/2026-11-20/content/daily/briefs/B3-THE-OTHER-FIVE-AND-DM.md`, at
ae5a7ae88). That brief writes the gate as `src/domain/dailyLife.js :: deriveDailyLife(record, { audience })`, which derives
the slot ONLY when `audience === 'owner'` and fails closed with no default. Its proof is a new test file (not yet named)
that shows the key absent on a read with no audience and on all 900 `toPublicSafe` documents. Ruling 6 (18:26) is the
same: DAILY-1-HANDBACK.md line 36. **The test SAME-2's message names (absent on every `toPublicSafe` document) does
not exist on `lane/daily-1-2026-11-20`; B3 E1 still owes it.**

**THE ARM (built against a fixture; DAILY's code is not needed).**
- `DM_BY_CONSTRUCTION` declares tables that are dm-only by construction. It is empty today. Its rows are added when the
  Daily Life seat names its data files ("DAILY <commit>").
- A table whose name carries the owner-only mark (`_dm`, `Dm`, `_DM`, in the path or the symbol) qualifies only if its
  row names two things, and each must be found in the file it names:
  - `gatedBy`: the gate, as `path :: symbol`;
  - `provedBy`: the test that proves the slot absent on every `toPublicSafe` document, as `path :: title`.
- Such a table's lines are then quiet: they are neither red nor banked. This is not an exemption row.
- **What reds** (`byConstructionFaults`):
  - a dm-named hand table with no row; it also reads as public, so its lines red like any other;
  - a row that names no dm-named hand table;
  - a row whose gate or proof is not found.
- Every other rule reads the table as usual.
- **At the join** this row is expected:
  `src/data/dailyLife/commonerResentmentsDm.js :: <its symbol>` (the file name comes from brief B3 E2), with
  `gatedBy: src/domain/dailyLife.js :: deriveDailyLife` and `provedBy` set to B3 E1's test and its title.
- Fixture plants pass: no row faults; a wrong gate symbol faults; a row on a table that is not dm-named faults.
