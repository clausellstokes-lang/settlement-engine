# CLOSE-9 — HAND-BACK (section 0 is the whole memory; current at every push)

A seat of THE TENTH CHAIR (session_019yED1SUxGVHyjQnoqoFvQ8), successor of CLOSE-8 for POINT 119. Its law:
`docs/chair/2026-11-24/tenth/prompts/START-CLOSE-9.txt` on `lane/chair-2026-11-08`. A successor reads that file, then this
section. I open no pull request; I push only `lane/close-9-2026-11-26` and `lane/close-9-2026-11-26-<unit>-wip`.

## 0. WHERE THE SEAT STANDS

### 0.A Ground
- Base: `lane/close-8-2026-11-25-join` at 3836a832e3 (point 118's joined tree WITHOUT G45's cures). Stay out of
  `economy.generated.js` and its source, `dossierViewModel.js`, `stateProseKernel.js`, `personMention.js`, Daily Life's fare
  lines (G45's cure builder owns them).
- The line (base-born records): `lane/join-2026-11-14` at 09c29806b85a, a detached worktree `/home/user/wt/before`.
- Worktrees (node_modules and `.husky/_` symlinked from the main checkout; package files equal at both trees):
  `/home/user/wt/b1ib` on `lane/close-9-2026-11-26-b1ib-wip`.
- Corpora: plans C and V re-made in the session scratchpad from CLOSE-8's copies of `make-plan.mjs` /
  `make-visitor-plan.mjs plan-lit.json` (`close-8/proof/tools/birth-1/` on `lane/close-8-2026-11-25`); births by its
  `births.mjs` (900 births in under a minute at 4 workers). Scratch tools: `measure-keys.mjs`, `diff-keys.mjs`,
  `measure-record.mjs` (whole record, for base-born proofs), `load-hash.mjs` (normalizeSettlement per tree).
- Gates per unit: `scratchpad/gates/unit-gates.sh <tree> <logdir> <test dirs...>`: both typechecks, the named dirs, build,
  VERIFY_DIST, each line through the gate mutex, exit appended.

### 0.B Units (point 119, in order)
1. B1(i)b: BUILT `lane/close-9-2026-11-26-b1ib-wip` dfebb4e08 (on 3836a832e3). Data only: `livesOn: 'game'` on the
   Furrier's district row of `src/data/institutionalCatalog.js`; the rule as a test over every family in
   `tests/generators/desertWithholdsHouses.test.js` (red 7/17 without the mark, green 17/17). Stored at birth. Every birth:
   C 0->0, V 13->0 (raw-config oracle); records moved C 0, V 13 (exactly those); base-born 300 V cities and metropolises
   load byte-equal on both trees. WHAT ELSE MOVES IN THE 13: the cascade re-deals other houses in 10 (the cascade reads the
   roster; B1(i)'s own reach), and two later generated rows (dp-metropolis-19 Harbour master's office -> Docks/port
   facilities; dp-metropolis-143 Printing house): named for the chair. 6 of 13 import raw hides (imports never give a house
   back under B1(i)). Gates: RUNNING (typechecks, tests/copy, tests/lint, tests/data, build + VERIFY_DIST); tests/generators
   whole owed. Not pushed yet.
2. E13d (G35): not started. Read words-2 HANDBACK 0.8 first.
3. P9b (G37 (ii)): measure + proposal, one message.
4. D13 STABLE-PICKS (G45 (5)): measure + design, one message.
5. B1(ii) REDESIGNED (R24r 1): design in one message before building.

### 0.C Next step
Read B1(i)b's gate logs; run tests/generators whole; push the -wip; hand in to the chair.
