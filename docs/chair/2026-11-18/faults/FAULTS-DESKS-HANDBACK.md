# FAULTS-DESKS hand-back

Seat FAULTS-DESKS of the round FAULTS (`BRIEF-FAULTS.md` on the chair's lane, section FAULTS-DESKS; rulings FR6, FR7; the
chair's three notes of 06:51 UTC). Branch `lane/faults-desks-2026-11-18`, cut from the base 4288049ba. Item 2 first, item 1
generated through the armed guard. Merged nothing; no pull request; no stored figure re-taken.

| commit | what |
|---|---|
| eb4d31348 | the hand-back's title |
| f0b59f2ef | item 2 (FR7): the numbering guard, and its test |
| 993d656f0 | item 1 (13d, FR6): the atom `court or gaol`; the seven lines declare it; `defense.generated.js` |
| 7a9c5375e | two older tests re-keyed by identity (R8) |
| 2c40b1553 | three walkers followed (presumedThings' instrument count, proseDrawnAnchors, negativeAssertionAnchor) |

## 1 · Item 2 (FR7): the numbering guard, armed

`scripts/generate-dossier-state-prose.mjs`, beside `sha256` (before the census interlock, so its message is the one a
renumbering meets). THE BASELINE is the six state leaves AS COMMITTED, imported off disk before the run writes: no second
stored list of words (the chair's note (1)). Per pool of the baseline, compared BY TEXT, it refuses:

- **RENUMBERED** a baseline text now under another vid (and no longer under its own);
- **RE-USED** a vid handed another line (its own text stands under another vid, or the text it names stood under another);
- **DROPPED** a baseline vid gone, or a whole pool gone;
- **REWORDED** words changed in place under the same number, UNLESS its row of `WORD_CORRECTIONS` names the pool, the
  vid, the sha256 of the old and of the new text, and the ruling (the chair's note (1): the named allowance, never by
  default). The list ships EMPTY. A row is inert once its correction is projected (the baseline then holds the new text).

A new line at the NEXT number and a new pool pass. A leaf that cannot be read refuses the run (fail-closed). `vidsOf`'s
own checks are untouched.

**PROOF, both ways** (`tests/domain/faultsDesks.test.js`, FR7 block: a COPY of the tree's projector over a planted annex in
a tmp tree, `--check`, so no committed byte is touched; eight cases):

| case | at the base's projector | at the tip |
|---|---|---|
| the annex as committed: no guard message, the whole `--check` exits 0 | green | green |
| two rows of Moderate swapped → RENUMBERED (v3→v4, v4→v3) | **red** (no guard message) | green |
| Moderate v4 given v3's words → RE-USED, nothing RENUMBERED | **red** | green |
| BAR6-DEFDESK's shape (a line inserted at 3, the rows below renumbered) → RENUMBERED and RE-USED | **red** | green |
| Moderate v4 deleted → DROPPED | **red** | green |
| Moderate v3 reworded in place, no row → REWORDED (and none of the other three) | **red** | green |
| the same rewording WITH its row passes; a row for another vid, another text, or no ruling does not | **red** (no allowance) | green |
| a new line at the next number passes the guard (the `--check` then finds the leaf stale) | green | green |

The planted tree's census is the committed one with its STAMP re-hashed against the tree (the committed census is stale at
the base; see section 5); this re-takes nothing.

**The brief's own form**, in a scratch copy of the base tree with a freshly taken census (scratch only): the annex with
Moderate v3 and v4 swapped refuses with "the numbering guard (FR7) refuses 4 move(s) … RENUMBERED … v3 … would take v4 …
RENUMBERED … v4 … would take v3 … RE-USED v3 … RE-USED v4"; with v4 given v3's words, "refuses 1 move(s) … RE-USED: v4 …
the baseline's v3"; restored, the armed projector's output is BYTE-EQUAL to the base's committed leaves for all six state
desks and the four other leaves (`cmp`, ten files).

**The register row `vids`** (`docs/content/prose-shift-register.json`, digest `b4342456…`): my work moves no vid (item 1
changes tags only), so the guard and the digest agree. The pin-recompute arm of `dossierStateProseProjection.contract`
is red at the base and at the tip with the SAME message (section 6). Re-taken: neither.

## 2 · Item 1 (13d, FR6): `court or gaol`

- `factVocabulary.js`: `'court or gaol'` beneath `'court sits'` (presence, home `courtOrGaol`), and the typedef's property.
  **NEW VOCABULARY, on the owner's veto list.**
- `factsOf.js`: `get courtOrGaol()` = `courtHoldersOf(record).length > 0 || defenceOf(record).prison`: the defence home's
  own two readers, no second reading of either. The prison half is the LIVE roster's (`defenseFactsOf.hasPrison`, ruined
  rows filtered), never `compound.inst.hasPrison` (the chair's note (3)).
- `factLayers.js`: `courtOrGaol` at layer 2 (`availableServices`, `institutions`, `economicState`). The four pools stand
  at 3 (Very Safe, Unsafe) and 5 (Safe, Moderate), above it: **the pool table moves no row**.
- The annex (the Defense desk's DS-DEF-3 only): Very Safe v3, v5; Safe v2, v3, v5; Moderate v2; Unsafe v2 declare
  `court or gaol`. Unsafe v2's `[ledger · colour]` becomes `[ledger · court or gaol]`: a colour line "presumes nothing"
  and stands alone (R-AO), and this line presumes a record kept.
- `defense.generated.js`, projected through the armed guard (scratch tree, fresh census): ONLY the seven tag lists move
  (diff: seven lines); no vid, no text; every other leaf byte-equal.
- The two helper rows: `tests/helpers/calmFactsDouble.js` (`courtOrGaol: true`) and the crisis-blind test's
  `PRESENCE_SETTER` (`'court or gaol'`).
- `defence.js`: no line needed (its two readers already export what the atom reads).

**THE GUARD** (`faultsDesks.test.js`, 13d block; red at the base, 4 of 4, green at the tip): the seven lines declare the
atom and no other line of the four pools does (21 lines read); the atom is HELD EQUAL to the Legal Infrastructure row
(anything but "None") on 17 born towns (the 11 of 13d below and 6 that keep a court or a gaol), on the record, its public
projection and the share veil, both answers occurring; the 11 towns of 13d keep neither and none draws a record line into
the public-order slot; each line is refused by the atom where it is false and admitted where it holds (a negative beside
each positive). Every seed loop collects its failures. **Over the stored records** (tip code over the base's corpora):
the atom agrees with the Legal row on 30 of 30, 150 of 150, 720 of 720 (false on 16, 82, 390).

## 3 · The rules, before and after (runK, LAWS 12 to 15; runJ, LAW 11), base 4288049ba → tip

| rule | the thirty | the 150 | the 720 |
|---|---|---|---|
| **13d.record** | **1 → 0** | **4 → 0** | **6 → 0** |
| runK, all rules (towns · instances · distinct) | 8·9·9 → 7·8·8 | 44·75·57 → 40·71·56 | 149·247·148 → 143·241·147 |
| runJ (LAW 11) | 10·14·9, unchanged | 23·26·10, unchanged | 104·127·35, unchanged |

No rule of either runner rises; every other rule's line of runK is byte-identical, and runJ's printout is identical but
for its file names. The 720's six at the base are the chair's six (r2r-town-4 Jayagiri and r2r-town-33 Kilby among them).
**Controls** (the thirty, `controlsK.json`): C16222 (bar0-hamlet-calm-rand-45) FOUND 13d.record → clear (the cure; the
runner's tally reads 23 → 22 "as expected" because a cured STANDS control reads "✗ clear", as every cured control of the
table does); no other control moves.

## 4 · R7: what prints in the slot, and the pools that fall short

**Towns whose page moves** (dump against dump, no probe noise): the thirty 2, the 150 13, the 720 20. In every one the
public-order line "The {tier}'s record of crimes at X …" (the Defense tab, and its PDF copy) gives way to a line of the
same pool that presumes no record kept, and is true there by its own declaration:

| prints instead | its declaration | e.g. |
|---|---|---|
| Moderate v7 "X has people who keep order, and order holds about as well as anyone here expects." | guardPresence · law > collapsed | bar0-hamlet-calm-rand-45, bar0-thorp-calm-rand-33, r2r-thorp-7, r2r-village-19 |
| Moderate v3 "Visitors to X are told which few streets to avoid, …" | tier ≥ village | bar0-village-calm-rand-46, bar0-village-calm-rand-28, r2r-village-23 |
| Safe v1 "Crime at X stays small: …" | no threat, no unrest | bar0-thorp-calm-rand-28, r2r-town-4, r2r-town-33 |
| Safe v4 "Visitors feel safe at X, and it is plain that somebody keeps it that way." | guardPresence | bar0-town-calm-rand-29 |
| Very Safe v2 "You can walk X at any hour …" | no threat, no unrest | bar0-village-calm-rand-36, r2r-village-49 |
| **nothing** (the Public-order paragraph is not printed) | Unsafe: v1, v3 need a watch | bar0-hamlet-calm-rand-27, -29, r2r-thorp-30 |

**POOLS UNDER THREE (named; no twin was given).** Where the atom refuses a line, the pool stood at two or three admitted
lines already at the base: Moderate 2→1 (21 towns), 3→2 (7); Safe 3→2 (17), 2→1 (4); Very Safe 2→1 (10); Unsafe 1→0 (3).
Towns: the thirty bar0-hamlet-calm-rand-45, bar0-village-calm-rand-47; the 150 bar0-thorp-calm-rand-28, -30, -31, -33, -35,
-39, -41, bar0-hamlet-calm-rand-27, -29, -32, -35, -37, bar0-village-calm-rand-27, -31, -33, -34, -36, bar0-town-calm-rand-29;
the 720 r2r-thorp-4, -6, -7, -8, -12, -13, -26, -28, -30, -34, r2r-hamlet-3, -6, -11, -17, -18, -20, -26, -40, -41, -50, -51,
-55, -56, r2r-village-3, -6, -7, -8, -14, -19, -23, -27, -40, -46, -49, -59, r2r-town-4, -20, -33, r2s-infiltrated-thorp-3,
-hamlet-0, -village-2, -village-3 (tables: the seat's scratch, `r7.*.json`).
**Unsafe falls to NO line** in three hamlets and thorps with no watch, no court and no gaol. The words I would propose for
the owner's veto (NOT in the annex): Unsafe `[ledger · no court or gaol · no watch]` "Wrongs at {settlement} are piling up
faster than its people can settle them among themselves, and nobody here holds an offender or hears a case."
**Safe v5 and Very Safe v5** (the no-guard record lines) now print in NO town of the 900: of the 338 towns with nobody under
arms, none keeps a court or a gaol. At the base they printed in 5 (r2r-village-49, r2r-thorp-28, r2s-infiltrated-village-2,
bar0-thorp-calm-rand-28, -30), each beside "no court and no gaol". They stand in their pools (nothing removed).

## 5 · Declared moves (R5) and the stored figures

- **No stored record moves.** The cure is a draw door on display prose: **0 of the 525** reference configurations move
  against the base (hashed by `generatorGoldenMaster.test.js`'s own `hashFor`, base tree and tip tree; that file not
  written). No new field on the saved record; nothing reaches a migration.
- **The page moves** in the towns of section 4 (the field family: the Defense tab's public-order rung, DS-DEF-3).

STORED FIGURES MY WORK MOVES (named, old → new; none re-taken; each already red at the base unless said):

| figure | base → tip |
|---|---|
| `scripts/.prose-byte-baseline.json`, `defense.generated.js` (stored row 281,298 raw / 37,154 gz) | measured 283,040 → 283,221 raw (+181), 37,628 → 37,642 gz-9 (+14) |
| `docs/content/wiring-census.json`'s declared columns (`wiringCensusDeclared` walker: rows differing from a fresh annex reading) | 10 → 14 (the four DS-DEF-3 pools) |
| `presumedThings` ARM 1 fresh hits (a register of source literals) | 38 → 39: the atom's own name `court or gaol`, a tag literal of the leaf, read as naming a prison. The register says "never add a row" and the atom's name is FR6's: the walker reading tag arrays as lines is the walker's to cure (not my file) |
| `sovereigntyLightingContract`'s estate file count (stored 3641) | 3690 → 3691 (my new test file) |
| THE WIRING CENSUS STAMP is stale at the base (`defenseStateProse.js` moved since it was taken), so the projector's interlock refuses every `--check` | unchanged: I projected in a scratch tree with a freshly taken census, after proving at the base that a fresh census projects all ten leaves byte-equal to the committed ones; the census is the close's to re-take |

## 6 · The net, at the base 4288049ba and the tip, each gate alone through `sh scripts/gate-tail.sh`

| gate | base | tip |
|---|---|---|
| `typecheck:domain:strict` | 0 | 0 |
| `typecheck:ratchet` | 0 | 0 |
| `npx eslint` (my ten changed JS files) | — | 0 errors |
| `tests/architecture` | green | green |
| `tests/lint` (JSON, every red by message) | 47 reds | 46 reds: 43 the base's own with the same message (three of them whole-file failures: `ledgerCitationIntegrity` wants the ledger branch as a local ref; the two news walkers); 3 the base's own with a count my files move (section 5: presumedThings 38 → 39, the estate's file count 3690 → 3691, the census's declared rows 10 → 14); `readerShapeResolver`'s pulse arm red at the base (264 > 256), green at the final tip run (it read 263 on the first tip run): not claimed. No new red. (The first tip run also had `negativeAssertionAnchor`, `proseDrawnAnchors` and presumedThings' `factLayers.js` instrument count red on my lines: followed in 2c40b1553, green.) |
| `tests/joins` | green | green |
| `tests/data` + the six named files + `tests/domain/facts` | 7 reds | the same 7, byte-equal messages |
| `npm run build`, then `vendorPdfLazy`, `bootSmoke` | 0, green | 0, green |
| my guard `faultsDesks.test.js` | 12 red (FR7 6 red against the base projector; 13d 4 of 4) | 12 of 12 green |

The 7 data reds (base and tip alike): the projection's `--check` (the stale census), the sha-interlock mutant, the shift
register's pin recompute (5 rows) and its mutant (3042 against 3033), three of `dossierProseManifest`'s DRIFT arms (842
rows). **THE OLDER TESTS**: every test file outside the net that names by import or text what I changed (`factsOf`,
`FACT_DIMENSIONS`/`factVocabulary`, `factLayers`, `courtSits`/`court sits`, the projector, `calmFactsDouble`,
`PRESENCE_SETTER`, the defense leaf, the annex, "record of crimes"): 162 files, each alone, in the base tree and the tip
tree. Base 3 red; tip 5 red: the same 3 with the same messages (`dossierStateProseProjection.contract`, path aside;
`corpusEcoTailGuards`; `composeStateProse`), and **two made untrue by the cure, re-keyed by identity (R8)**:
`tailCorpusDefGuards.test.js` batch 6 (three rows whose "instead" was a record line now refused in their towns: Safe v1,
Safe v1, Very Safe v2 instead) and `defenseStateProseDesk.test.js` (ALIVENESS and THE PIN read DS-DEF-3 over a bare record
where Unsafe now speaks no line: those two reads keep a gaol, the only DS-DEF-3 atom that reads it); both green.

## 7 · Left by name

- The Unsafe twin above (words proposed, not written); Safe v5 and Very Safe v5 reach no town (named above).
- The `presumedThings` hit on the atom's name (section 5): the walker's, not mine.
- The BR35 correction (DS-ECO-12 v4, another branch): it lands with its own regenerated leaf, so the guard sees leaf and
  annex agree. A branch that regenerates with the new words and the OLD leaf meets REWORDED and needs its row:
  `{ pool: 'DS-ECO-12 :: CRITICAL IMPORT: a house needs what the land lacks', vid: 4, from: <sha256 old>, to: <sha256 new>, ruling: 'BR35' }`.
- Not raised (the owner's standing word): the projector now parses the state annex twice (once for the guard); one line.
