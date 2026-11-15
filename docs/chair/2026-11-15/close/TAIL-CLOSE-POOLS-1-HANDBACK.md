# TAIL-CLOSE-POOLS-1 — hand-back (current with each push)

Branch `lane/tail-close-pools-2026-11-15`, cut from the joined line at `92fcc4fc5` (it holds the economy corpus's
`7ab28d3ef` and the test close seat's `432b0330c` as ancestors; checked with `git merge-base --is-ancestor`).
Every run went to a file in the seat's scratch tree; nothing below is read from a pipe.

## The reds at the tip, each run alone, before

| red | file | at `92fcc4fc5` |
| --- | --- | --- |
| 1 | `tests/domain/corpusCureGuards.test.js` | 57 failed / 118 |
| 2 | `tests/data/foundingWorldBones.test.js` | 1 failed / 3 |
| 3 | `tests/domain/heraldCausalVoice.test.js` | 1 failed / 59 |
| 4 | `tests/domain/r3c8ReaderLinesTrue.test.js` | 1 failed / 8 |
| 5 | `tests/domain/crisisBlindDossierProse.test.js` | 2 failed / 5 |

## Red 1 — the corpus's cure guards: the measurement refutes the brief for most rows

THE CENSUS. One script over the file's own births (DEFAULT_CONFIG is the 720's DIALS shape; forced crisis,
Random off, priorities randomised; every public prose site drawn through the kernel's `drawVariant`), 1,050
towns: the six sizes x 25 seeds (`w5-<size>-<crisis>-<n>`) under occupied, under_siege, plague_onset, calm, famine,
indebted, monster_pressure, plus the 37 original seeds. For each row it records whether the pool is read, its
eligible set, and the kernel's own `declarationAdmits(...).refused` for every line of the pool. A town qualifies
for a re-key only where the pool draws, the cured line is not eligible, and the line's refusal is its cure alone
(so the line could print but for the cure).

THE FINDING. In 43 of the 57 rows, EVERY line of the pool now carries the row's own disqualifier (or needs a
case the town cannot have), so under that case the pool is mute by declaration and no town can show the row's
control ("another line of the pool draws"). The cure did not come undone; it became the whole pool's silence.
Six more rows are logical contradictions of the pool's own split, and seven are states no town of the 1,050
reaches. Only one row can be re-keyed as briefed.

### Re-keyed

| row | was | now | move |
| --- | --- | --- | --- |
| DS-DEF-11 WALLED-STRAINED v3 (`no soldiers`) | w5-city-under_siege-1 (no longer reads the pool) | w5-town-under_siege-6: the pool draws v4; v3's only refusal is `no soldiers` | the births moved |

Red-first: with `no soldiers` struck from v3's marks in `defense.generated.js` the row reds
("v3 is eligible at w5-town-under_siege-6: expected [3, 4] to not include 3"); restored, green. 57 → 56 failed.

### NAMED, NOT DELETED: the pool is mute under the row's case by declaration (43 rows)

| pool (rows) | case | declared mute by |
| --- | --- | --- |
| DS-GEN-17 GARRISONED v1, v2 | occupied | `bc81c24f8` (v1 and v2 off an occupation) |
| DS-POW-5 FLAG: merchantArmy v1, v2 | occupied | `a9a457f7a` |
| DS-GEN-13 ENTREPOT v1 | under_siege | `32ab37da` (one of red 5's four) |
| DS-POW-6 operation role duty evasion v1, v2, v3 | under_siege | `f8e7326ce` (red 5's four) |
| DS-ECO-10 POSTURE: vulnerable v1, v3 | under_siege | `c21abdd5` (red 5's four) |
| DS-DEF-2 Beasts: settled, nothing organized v6 (x2) | under_siege; occupied | `35acb7794` (red 5's four) |
| DS-ECO-1 C4 v1, v2, v3 (city), v6 (thorp) | plague_onset | `7959b65eb`, `fc06bdd35` (v4, v5, v7 need a siege) |
| DS-ECO-9 much of it brought in v1, v2, v3 | plague_onset | the economy desk's `c20c37b1d` family |
| DS-DEF-2 walls AND professional garrison v1, v2, v3 | occupied | `1dfa83d89` (v4 needs a siege) |
| DS-DEF-5 NO organized force at all v1, v2, v3 | occupied | `7f8640a48` (v4-v6 need a siege or war) |
| DS-DEF-1 readiness ADEQUATE v1-v4 (4 rows) | occupied | `9b0af88f7` (the pool is not read under an occupation at all) |
| DS-DEF-2 frontier, credible deterrence v4 | occupied | `1796fe3ae` (v1-v3 off a threat at hand) |
| DS-DEF-12 CAPACITY: enough v1, v2, v3 (5 rows) | food ≥ pressured | `6cf44c66d`, `dbe696025` (v3 takes its siblings' food condition) |
| DS-DEF-11 WALLED-STRAINED v1, v2, v5, v6, v7 (5 rows) | occupied | `440f40cfc` and W2-WRITE-7 B (v3, v4 need a siege) |
| DS-DEF-2 neither walls nor force v4 | occupied | `4fb84c1cf` (every no-force or watch-only line) |
| DS-DEF-2 walls with NO force v1, v4 | occupied | `ad5a8c846` (v6, v7 need a siege) |

### NAMED: the pool's own split contradicts the control (6 rows)

- DS-ECO-12 INCOME WEIGHT: the religious houses v3, v4 (thorp, siege) and v1, v2 (hamlets, `tier: ≥ village`):
  v1/v2 need a sacred house and a village or larger (`3ae4b5ab1`), v3/v4 need no house and no siege. Wherever the
  cured line could print, every sibling is refused, so the pool is empty there.
- DS-ECO-12 CRITICAL IMPORT v3 (`stores: < 6`, siege): v1, v2 are off a siege, v3 is the siege line
  (`6bca79928`); under a siege with deep stores the pool is empty.
- DS-ECO-6 TIER: minor v0 (famine; siege): without organised crime only v0 is public (v1-v3 are `dm-only`, v4, v5
  need organised crime). A `by: 'record'` form would show the claim (v1-v3 admitted by the record); that is a shape
  change, asked of the chair, not made.

### NAMED: the state is gone from the 1,050 (7 rows)

- DS-ECO-11 EXPLOITATION: fullyExploited v2, v3, v4 (siege): the pool is not read in any of the 1,050 towns.
- DS-DEF-1 readiness CRITICAL v3 (walls): read in 184 towns, none walled.
- DS-DEF-2 walls with NO force v6 (`no watch`, siege): read in 21 towns, none with a watch.
- DS-DEF-2 Beasts: settled, nothing organized v6 (`no guardPresence`, monster_pressure): read in 154, none guarded.

A QUESTION TO THE CHAIR: for the 43 rows the corpus has made mute by declaration, the shape that guards what is
true now is red 5's approved one: the row's town reads the pool, its eligible set is empty, and the declaring commit
is named. No row is converted to that shape without the word.

## Red 4 — `r3c8ReaderLinesTrue`: NAMED

Green on the economy corpus's branch at `7ab28d3ef` (8/8). Red on the joined line from the join's own merge of
that tip (`744edb899`, JOIN-9 point 7) and at every point after it: "L14 ... r2r-metropolis-33 and the reader's three
true towns: the line prints only where the stability gives the body no say", `expected 1 to be ≥ 3`. So the cure
holds on the branch and is undone in the merge, by something already on the line before point 7. Not cured here.

## Red 2, red 3, red 5

Not yet reached at this push (red 3 waits for the chair's word; red 5's test file is MOVING on
`lane/tail-crisis-2026-11-14`, as the rule expects until `325de515` is on the line).

## Proof at this push

- `tests/domain/corpusCureGuards.test.js` alone: 57 failed before, 56 after; the re-keyed row reds with its cure undone.
- No other test file names it. eslint on it: clean. `typecheck:ratchet`: OK, 167 ≤ 167.
- No golden, register or census re-taken; no source file touched; what a town prints does not change (0 of the 720).
