# RULING — before the freeze act, NO registered golden can be re-recorded; a declared text shift that moves one is BANKED, with attribution, until the genesis signing (2026-09-05, Fable 5.1)
## The fact, measured (PROSE landing, lanePROSE2 @ 73a6f0c22)
`UPDATE_GOLDEN=1` no longer writes anything: `tests/helpers/goldenRecordDoor.js` refuses `[NO_SIGNATURE]` unless
`GOLDEN_SHIFT_SIGNED` names a signed shift-record file (ownerWords verbatim, ownerDate, odqRow, cause, seat, surfaces).
WITH a record the door writes the manifest AND the register row (`sha256`, `rows`, `ownerRow`) — and the freeze walker's
arm 1 (`goldenFreeze.walker.test.js:358`, "while the register is UNFROZEN, no row carries a recorded value") REDS on any
recorded value while `frozenAt` is null. So between §895 (the machinery landed) and the freeze act, **the door is closed
by construction**: LIGHT-PLAN §4's conclusion ("the wave cannot use the door") holds for every REGISTERED surface, and the
"ledger-row idiom" it kept applies only to shifts that move no registered golden. The prose car moves
`tests/fixtures/generator-golden-master.json` (525 of 525 rows — cured emitted text; measured by the
chair's `golden-count.mjs`, which runs the suite's own `corpus()`/`hashFor` outside the door).
## RULED
1. **The chair does NOT sign a shift record with the owner's standing words.** The door's own README says the machine
   cannot verify the words and the ledger is the veto surface — but the record is DESIGNED for the owner's sentence on
   THAT shift, and no such sentence exists (the desk item since §890: "the PROSE WINDOW … one word charters it sooner").
   A chair-signed record would be provenance in shape only, the exact defect the door was built to end.
2. **The door is not amended** to write the manifest without the register row: that would spend the machinery's
   protection at the first landing that found it inconvenient.
3. **The golden arm is BANKED by hand** in `scripts/.test-ratchet-baseline.json` with full attribution — subsystem
   `golden-freeze / generator golden master`, class the census's deferred-debt class, cause: "LGT-PROSE, cause (0) of the
   lighting wave's declared shifts, moves 525/525 rows of cured emitted text; the fixture CANNOT be
   re-recorded before the freeze act (door + walker arm 1); it regenerates at the owner-signed GENESIS, which records the
   lit + prose world", introducedAt = this landing's tip, magnitude = the moved-row count as the ceiling. The census
   has seven free slots; `--update` can only remove it, never widen it.
4. **The declaration stands on the ledger** (`docs/GOLDEN_SHIFT_LEDGER.md` entry + the §898 row) with the moved-row
   count, so the shift is recorded where the owner reads, not laundered into debt.
5. **Controls are tree-vs-tree while the fixture is stale:** L-PROBE output (a) (`lprobe/golden-control.sh`) compares
   the post-PROSE tree against the lit tree, never against the committed manifest; the wave's own STOP ("a move on the
   golden master is a STOP") is re-cut to "a move BEYOND the prose delta is a STOP", measured by `golden-count.mjs`
   against a manifest produced at the post-PROSE tip and kept under `$SC/lprobe/out/`.
6. **Owner's desk row (opened at §898):** the freeze act — the genesis signing — is the owner's, as chartered (§881.4:
   "GOLDEN freeze (records the LIT world)"); the prose shift's fixture waits there. If the owner prefers to sign the
   prose window alone sooner ("one word charters it sooner"), the record form is `docs/shift-records/_TEMPLATE.json`
   with their sentence, and the chair executes the door the same day.
## Veto
Owner, by name: "sign the prose window now" (the chair executes the door with the owner's sentence) — or "hold prose
until the freeze" (the chair un-bank nothing; the consist waits sealed at `prose-train-2026-09-05`).
