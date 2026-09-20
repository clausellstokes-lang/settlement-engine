# The two door acts for the 2026-09-18 content-coherence window

Both are the chair's. Run from a **clean consist worktree**, at the tip that carries every car.
`odqRow` in the record is **blank**; fill it first or both acts refuse with `BLANK_PROVENANCE`.

```sh
CONSIST=<the clean consist worktree>
REC=docs/shift-records/2026-09-18-content-coherence.json
cd "$CONSIST"
git status --porcelain     # must print NOTHING but the paths the act may touch
```

---

## 1. generator-golden-master — driven by the suite's own capture arm

The door lives inside the test (`UPDATE_GOLDEN` selects the capture block, which calls
`recordGolden`). No runner is needed or wanted.

```sh
GOLDEN_SHIFT_SIGNED=$REC UPDATE_GOLDEN=1 \
  npx vitest run tests/property/generatorGoldenMaster.test.js
```

* Writes `tests/fixtures/generator-golden-master.json` and the fence row's siblings in
  `tests/fixtures/.golden-freeze-register.json` (`sha256`, `rows`, `ownerRow`).
* **Fails by design** on success, printing `sha256 old -> new; rows old -> new`.
* `predictedRows` in the record is **525** and is checked against the produced manifest's KEY
  COUNT, not against the movement. The movement is **525 of 525** and lives in `cause`.
* Expect the drift list the plain run prints beforehand: 525 rows, thorp 84 · hamlet 84 ·
  village 84 · town 105 · city 84 · metropolis 84.

## 2. espionage-dormancy-fence — the one-off runner

No runner exists in the tree (the 2026-09-17 one-off was never committed; `9c443ace2` is the
shape). Use the prepared one, which is deliberately **outside** the repo:

```sh
GOLDEN_SHIFT_SIGNED=$REC \
  node /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/fence-door-2026-09-18.mjs \
    --expected <the 64-hex the consist measurement printed> \
    --moved <n of 360>            # or: --base <pristine fe021a487 worktree> to measure it
```

* `--expected` is **required** and the runner re-measures and refuses unless its own measurement
  equals it, so the chair's figure and the tree's are proved equal before a byte moves.
* `--moved` is **required** (or derived via `--base`) because the docblock paragraph states it,
  and the runner will not write an unmeasured claim.
* Writes `tests/property/espionageDormancyFence.test.js` (the constant **and** a dated paragraph
  at the top of the header's chartered-windows enumeration, in the 2026-09-17 register) and the
  register row (`sha256` of the new test-file bytes, `rows`, `ownerRow`), both through
  `recordGolden`.
* Exit codes: **2** = refused, nothing written. **3** = wrote (the door's success throw).

⚠ At my last measurement the fence read `a0c145b25758fff12b86e1573ea1a9f9695b17780c9d61bbe6f321bdfd05064e`
against the frozen `f13df68e…`. It read `4f764737…` at the D1–D4 tip, before D1b moved 441 further
rows of the same corpus — so **take `--expected` from the consist's own run**, not from this note.

---

## After both acts

```sh
npx vitest run tests/property/generatorGoldenMaster.test.js \
               tests/property/espionageDormancyFence.test.js \
               tests/lint/goldenFreeze.walker.test.js
```

Green here is the receipt — the re-record run itself never is. Then commit the two fixtures, the
test file and the register **together**, with an `Owner-Signed: §NNN` trailer.

---

## Addendum (19:2x): the header repair and the runner's two repair modes

The second act wrote the first act's paragraph over its own movement (the runner hardcoded
the record path and the paragraph). Lane 5 rewrote the runner so every field of the paragraph
comes from the record `GOLDEN_SHIFT_SIGNED` names, and added `--docblock-only` (replaces the
TOPMOST door-act paragraph; dry run until `--confirm-replace`). That mode could not repair the
consist's header — the topmost paragraph there was the correct act-1 one, and the mode's
movement line reads "the constant does NOT move" — so the chair wrote the pressure paragraph
by hand and the runner grew `--restamp-only`:

```sh
GOLDEN_SHIFT_SIGNED=docs/shift-records/<record>.json \
  node <runner> --restamp-only --moved <n-of-360>
```

* re-measures, refuses unless the measurement equals the constant ALREADY in the file, then
  re-records the register row (sha256 of the test-file bytes) through `recordGolden` over the
  bytes as they stand. Exit 3 = wrote; the receipt is the plain re-run.
* Committed on the consist with `Owner-Signed: §934` (the earlier two door commits lack the
  trailer; the walker enforces the closure in-tree and passed both).
