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

## Red 1 — the corpus's cure guards: GREEN, 118/118 (rulings C26 and C27, vetoable by the owner)

THE CENSUS. One script over the file's own births (DEFAULT_CONFIG is the 720's DIALS shape; forced crisis,
Random off, priorities randomised; every public prose site drawn through the kernel's `drawVariant`), 1,050
towns: the six sizes x 25 seeds (`w5-<size>-<crisis>-<n>`) under occupied, under_siege, plague_onset, calm, famine,
indebted, monster_pressure, plus the 37 original seeds. It recorded, per row, whether the pool is read, its eligible
set, and the kernel's `declarationAdmits(...).refused` for every line of the pool.

THE FINDING (batch 1, `b46b83871`). Of the 57 red rows, 43 guard pools EVERY line of which now carries the row's own
disqualifier (the cure widened into the pool's silence under the case); 7 more are mute at their town by the pool's
own split (the claim's sub-pool is off the case); 6 are states no town of the 1,050 draws the pool in; 1 re-keyed as
briefed (DS-DEF-11 v3 → `w5-town-under_siege-6`, the births moved). Nothing deleted.

### C26: the declared-mute shape (50 rows)

A `mute` row names the declaring commits; the row asserts that the town READS the pool and that the pool's eligible
set there is EMPTY; it reds if the pool speaks there again. The 43 and the 7 split rows (whose split leaves the claim's
own sub-pool mute at the town, so the shape is the split's form):

| pool (rows) | case | declared mute by |
| --- | --- | --- |
| DS-GEN-17 GARRISONED v1, v2 | occupied | `bc81c24f8` |
| DS-POW-5 FLAG: merchantArmy v1, v2 | occupied | `a9a457f7a` |
| DS-GEN-13 ENTREPOT v1 | under_siege | `32ab37da` |
| DS-POW-6 operation role duty evasion v1, v2, v3 | under_siege | `f8e7326ce` |
| DS-ECO-10 POSTURE: vulnerable v1, v3 | under_siege | `c21abdd5` |
| DS-DEF-2 Beasts: settled, nothing organized v6 (x2) | under_siege; occupied | `35acb7794` |
| DS-ECO-1 C4 v1, v2, v3 (city), v6 (thorp) | plague_onset | `7959b65eb`, `fc06bdd35` |
| DS-ECO-9 much of it brought in v1, v2, v3 | plague_onset | `c20c37b1d` |
| DS-DEF-2 walls AND professional garrison v1, v2, v3 | occupied | `1dfa83d89` |
| DS-DEF-5 NO organized force at all v1, v2, v3 | occupied | `7f8640a48` |
| DS-DEF-1 readiness ADEQUATE v1-v4 (4 rows, `unread`) | occupied | `9b0af88f7`, and `1ad5ca6e7` (the posture row silent) |
| DS-DEF-2 frontier, credible deterrence v4 | occupied | `1796fe3ae` |
| DS-DEF-12 CAPACITY: enough (5 rows) | food ≥ pressured | `6cf44c66d`, `dbe696025` |
| DS-DEF-11 WALLED-STRAINED v1, v2, v5, v6, v7 (5 rows) | occupied | `440f40cfc`, `8c63fd2ed` |
| DS-DEF-2 neither walls nor force v4 | occupied | `4fb84c1cf` |
| DS-DEF-2 walls with NO force v1; v4 (re-keyed `rww-town-occupied-1` → `w5-thorp-occupied-8`, the births moved) | occupied | `ad5a8c846` |
| SPLIT: DS-ECO-12 INCOME WEIGHT religious v3, v4 (thorp, siege) | under_siege | `3ae4b5ab1` (v1, v2 off thorps and hamlets), `13c6618e0` (v3, v4 off a siege) |
| SPLIT: DS-ECO-12 INCOME WEIGHT religious v1, v2 (hamlets) | tier | `3ae4b5ab1`; v3, v4 speak only with no sacred house |
| SPLIT: DS-ECO-12 CRITICAL IMPORT v3 | under_siege, deep stores | `6bca79928` |
| SPLIT: DS-ECO-6 TIER: minor v0 (x2) | famine; under_siege | `c20c37b1d`, `0aa8326fe` (v1-v3 dm-only, v4, v5 organised crime) |

THIS SEAT'S CALL (vetoable): DS-DEF-1's readiness pools are not READ under an occupation at all (the site is silent,
`1ad5ca6e7`), so C26's "reads the pool" cannot hold; those four rows (`unread: true`) anchor on the town's reading of
another DS-DEF-1 pool (each reads `terrain EXPOSED` or `strategic value HIGH`) and assert the pool does not speak.

### C27 (ii): the states no town reaches (6 rows), none retired

- DS-ECO-11 EXPLOITATION: fullyExploited v2, v3, v4 (siege), DS-DEF-2 walls with NO force v6 (`no watch`), DS-DEF-2
  Beasts: settled, nothing organized v6 (`no guardPresence`): a MADE RECORD, built by the file's own `by: 'record'`
  form at the rows' own seeds: each town's real record read through the kernel's one rule, where the cure is the
  line's ONLY refusal and a sibling of the pool is admitted (v5, v7, v1-v3 respectively).
- DS-DEF-1 readiness CRITICAL v3 (walls): `walls` is a dimension word (read by the live draw, not by the record), so
  the row stays a live draw, re-keyed `w5-town-famine-6` (walled, no longer reads the pool) → `w5-town-famine-4`
  (walled, the pool draws v2, v4; v3's marks admit it, the walls dimension keeps it out): the births moved.

### Proof

- Alone: 57 failed → 56 (batch 1) → 0 of 118.
- Red-first, with a cure struck from the corpus (restored after): `GARRISONED v1` without `no crisis: occupied` reds both
  GARRISONED mute rows ("speaks at w5-metropolis-occupied-101 ... expected [1]"); `fullyExploited v3` without its siege
  mark reds its record row; `readiness CRITICAL v3` without `no walls` reds its row and the hamlet row beside it;
  `WALLED-STRAINED v3` without `no soldiers` reds batch 1's row.
- eslint clean; `typecheck:ratchet` OK (167 ≤ 167); no other test names the file; the anchor and seed-loop walkers are
  red with other seats' files only (none of this file). What a town prints: unchanged (0 of the 720).

## Red 4 — `r3c8ReaderLinesTrue`: GREEN (the chair's word: red 4 is this seat's)

Green on the economy corpus's branch at `7ab28d3ef` (8/8); red on the joined line from the join's own merge of that
tip (`744edb899`, JOIN-9 point 7): L14 `expected 1 to be ≥ 3`. The test file is byte-identical at both ends; a probe
of the four towns at both ends finds the line printed in the same three true towns, worded in number agreement on
the joined side (`factionDynamics.js:603`, `verb(noble, 'has', 'have')`: "Landed Gentry still has its titles, but"),
which the desk's literal `'still have their titles, but'` reads only in the plural. The pin is brought to the line
as it now stands, both agreements (`/still (?:has its|have their) titles, but/`), the same line; the creditor
exclusion and the `≥ 3` count are unchanged. 1 failed → 8/8. eslint clean; no other test names the file; the
anchors walker's set unchanged. What a town prints: unchanged.

## Red 2 — `foundingWorldBones`: RE-KEYED BY IDENTITY, the move named

The bisect: `f663a2699` is red too (15/20), so no good point lies on the joined line's own stretch. Earlier
first-parent points: `c4a581007` red, `303396f74` (the test's last change) green; `git bisect --first-parent`
gives `6aeaa4154` (STYLE-2-MERGE point 46, the merge of COHERENCE-POWERS); a bisect inside that branch gives
**`1df17289f`** (COHERENCE-POWERS 2B, the fold: a power of the ruler's own kind that no house stands behind folds
into the ruler; declared and measured in its message, Religious Authorities folded in 41 of 1,000 births). A DECLARED
MOVE of the powers, not a regression. The chair had already ruled on this very row (2026-11-12, `ad60d76d8`, in
`COHERENCE-POWERS-shift-record.DRAFT.json`): the promise is read by KIND ("a religious power stands, or rules"), a
re-key by identity, never a loosening, the card and the fold untouched.

The cure: the clause's predicate reads the backing kind (`powerSupport.js :: backingArchetypeOf`, the reader the
fold itself uses) of every power on the roster, the governing row included, against the kind of "Religious
Authorities". Before 2 passed / 1 failed (15/20); after 3/3. Not loosened: keyed to "Arcane Orders" instead the same
clause reads 0/20. The card (`src/data/sampleSettlements.js`) is untouched. eslint clean; `typecheck:ratchet` OK
(167 ≤ 167). `tests/lint/proseDrawnAnchors.walker.test.js` (it names the file) is red before and after with the
identical set of six other files (not this one, not this seat's). What a town prints: unchanged (0 of the 720).

## Red 5 — `crisisBlindDossierProse`, the set-aside table: GREEN (ruling K31, vetoable by the owner)

Opened when the joined line held the crisis branch's `573c92b6d` (merged here at `0b1248dbf`, after the chair's SWEPT
`f714fb6a5`). At that tip 1 failed / 5: the mute arm, five cells, each a pool's `threat` family (read under a siege):
DS-POW-6 duty evasion, DS-GEN-13 ENTREPOT, DS-ECO-10 POSTURE: vulnerable, DS-DEF-2 Beasts: settled, nothing organized,
DS-ECO-12 INCOME WEIGHT: the religious houses. The approved shape: `SET_ASIDE_CELLS`, keyed by POOL AND FAMILY, each
with its declaring commit; a listed cell must be mute (the arm reds if it speaks); every other family of that pool is
still held to the law (it must speak); a listed cell the walk no longer reaches reds as stale. DS-STR-1's whole-pool
exemption (ratified by construction) stays in `SET_ASIDE`. The declarations: `f8e7326ce`, `32ab37da`, `c21abdd5`,
`35acb7794` (the four in ba4cc210b); the fifth, DS-ECO-12, is CITED, not accidental: `13c6618e0` declares the no-house
lines v3, v4 off a siege, and the house lines v1, v2 read the compound `sacredHouse` the synthesised place cannot
hold, while they still draw under a real siege where a house stands (`w5-village-under_siege-3` draws v1, v2, this
seat's census of red 1). After: 5/5. Red-first: with `no crisis: under_siege` struck from DS-POW-6 v1 the arm reds
("DS-POW-6 :: operation role duty evasion :: threat (declared mute by f8e7326ce …)"); restored. eslint clean;
`typecheck:ratchet` OK. What a town prints: unchanged.

## The seventh — WITHDRAWN by the chair (the crisis seat's, `b75ca93c7`, on the line)

This seat's change to `tests/domain/coherence/crisisBlindProse.test.js` (`0711a6a39`) is DROPPED: at the merge of the
line at `4e58ed8ba` the file is taken whole from the line (`git checkout 4e58ed8ba -- …`), byte-identical to it; 8/8.

## Red 3 — `heraldCausalVoice`: GREEN as the lines stand

Run alone at `34f7adbeb` (this branch with the line at `4e58ed8ba`, which holds the display's close branch): 59/59.
Nothing changed.

## The sixth (DS-GEN-13 "a market, no guild", `tests/lint/factLayers.walker.test.js`): RE-LAYERED by C30 (named first)

The walker's POOLS arm reds on `DS-GEN-13::COMMERCE: a market, no guild` → "declares guild (layer 3)": the pool's
table row is layer 3 (`factLayers.poolTable.json`), and the economy corpus's batch 7 (`4467cd7d6`, ruling C19) gave
v1, v3, v4 `no guild` and added the twin v5 `guild`, because the lines are false beside a guild POWER (the pool's key
reads the houses; the `guild` atom reads the powers too). The facts' law: a pool reads only facts below its own
layer. The leaves below 3 (`src/domain/facts/factLayers.js`): commander, culture, guardPresence, hasInstitution,
magic, market, migration, populationBand, route, sacredHouse, soldiers, terrain, tier, water (1); exports, famine,
foodSources, imports, prosperity, storesMonths (2), with warState, crisis, defence (1). None says "a guild power stands"
(the powers are homed at 3: guild, rivalPower, rulerKind, rulingBody), and a house test (`hasInstitution`) says
something else (the key already holds "no guild house"). So no allowed fact says the same thing, and no forbidden read
is declared. THE COUNT over the 720 (the census's own plan and births, every public site drawn): the pool is read
and prints in 42 towns: v1 4, v2 5, v3 3, v4 6 (none beside a guild power), v5 24 (every one beside a guild power).
C30 (the chair, vetoable by the owner): the declaration stays and the row's layer follows its reads. The pool
table's own form for a hand placement (`"src": "placed: <reason>; was N by map:…"`, as the capture-climate rows) moves
`DS-GEN-13::COMMERCE: a market, no guild` from 3 to 4 (`tests/lint/factLayers.poolTable.json`): it reads the guild power
(layer 3), and nothing at or below the powers reads this state prose (the page reads it). The walker's POOLS arm: red →
green, no DS-GEN-13 row left; the 720 births byte-identical (a test table, no source touched); no other test reads the
table. The other four reds of that walker (the `keep` getter, the `crime` leaf's `npcs`, the LEAVES and READERS arms) are
not this pool's and not this seat's.

## Pushes

`b46b83871` red 1 batch 1 · `6a3871de1` red 2 · `7105cf317` red 4 · `9d19441bf` red 1 to green (C26, C27) · `ef48b5e48` the sixth named · `85770b123` red 5 · `0711a6a39` the seventh (dropped) · `34f7adbeb` the line at 4e58ed8ba · this push: the sixth re-layered (C30).
Each red's own proof is in its section. No golden, register or census re-taken; no source file touched.
