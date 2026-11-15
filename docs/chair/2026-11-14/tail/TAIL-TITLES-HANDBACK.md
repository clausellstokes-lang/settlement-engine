# TAIL-TITLES · hand-back · class k (a person's title is the house's face, minted with no reading of the drawn sex)

Seat: TAIL-TITLES, builder. Base: the joined line `lane/join-2026-11-14` at **866041da5** (read back from origin). Branch:
`lane/tail-titles-2026-11-15` (own and only; nothing merged). One commit, a DECLARED MOVE.

## The rulings worked to

- **K-C (the chair, 2026-11-15 00:50 UTC; vetoable by the owner), copied:** THE ROLE TAKES THE HOLDER'S FORM WITH THE TITLE
  (M-1b kept: role and title stay one word), and the readers that key on the role's string (the structural ladder's cut,
  already `isMintedLord` in K-B; the goal tables; the plague's brunt) READ THE FACE (`institution.title`) INSTEAD. AN
  OFFICE'S TITLE STAYS THE OFFICE'S (Lord Marshal, Lord Warden, Lord Mayor): as the measuring seat's table has it. PREFER
  THE PLAIN NEUTRAL WORD to a coined pair, as its table does.
- **The chair on my stop (gate F, the presumed-things walker 145 → 148), 2026-11-15:** "(b), NOT (a): the walker's rule book
  is not edited for a new literal, and the register stays shrink-only. THE WORDS: a man who holds the madam's face is
  'the keeper of the house'; a man who holds the district madam's face is 'the keeper of the houses'." Built so: the
  walker reads 145 again, the same fresh set as the base.
- BRIEF-TAIL's laws (a cure that moves the record is a declared move; red first; one census before and after; the gates).

## What was built (one commit)

- `src/data/holderTitleForms.js` (NEW): `HOLDER_TITLE_FORMS` (the table below), `titleForHolder(face, gender)`, and
  `faceOfRole(card)`: the readers' key, the card's face (`institution.title`) where its role is that face's holder form,
  else the role as it stands (an office title on a dual-hat leader stays the office's).
- `src/generators/people/representatives.js`: after `drawCardHooks` (every draw the face keys), each card's title takes its
  holder's form and, where the role is the face (M-1b), the role with it. Not the hook facts near line 395.
- `src/generators/people/castPowers.js`: the `other` mint and the claimant: `title = titleForHolder(row.title, gender)`,
  `role = title` (M-1b); a namesake's qualifier reads the title it bears. The hook pool still keys `row.title` (the face).
- `src/data/faceHonorifics.js :: styledTitleOf`: reads the leaf first (one home). Nothing else in that file.
- `src/generators/npcStructure.js :: isMintedLord`: the face (`institution.title`), not the holder's form.
- The role-keyed readers, each in the one place it keys on the role's string: `src/generators/people/goals.js` (the stress
  override's bucket, `stressBucketOf(faceOfRole(card))`); `src/domain/dossier/faithReading.js :: seniorClericOf` (the
  rank's regex reads `faceOfRole(npc)`). **Declared:** the second is the goal table's key, not one the chair named by file:
  its `/abbess/` rank made a woman "the senior abbess" the town's senior cleric, which fills the goal table's `priest` fact
  and moved goals in 16 towns (K-A's 16, measured on the naive K-C). The plague's brunt reads the role in
  `domain/crisis/crisisCast.js` (the systems' regexes); no face/form pair changes its match, and the crisis cast moved in
  no town, so it is not touched.

## The measure (births-only and the census, the 720)

| | base 866041da5 | K-C |
|---|---|---|
| k (RECORD-MEASURE-1's predicate) | 268 | **6** (the six "the lord's appointee": the word names the lord) |
| record families moved | — | `npcs` 360 towns, `relationships` 270, `pressureSentence` 1; nothing else |
| moved string leaves (every one back-substitutes to the face) | — | **1,975 / 1,975**: `npcs[].title` 595, `npcs[].role` 535, ties' `npc2Role` 428 / `npc1Role` 355, `structuralPosition` 57 (the word), 1 name qualifier + its tie's description, tension, npc1Name, 1 `pressureSentence` |
| goals / structural rows' order / crisis cast (the brunt) | — | **0 / 0 / 0** (K-A's 16 / 19 / 4) |
| towns printing the old face beside its holder, as a TITLE (`kreal.mjs`, every surface: tabs, PDF, journal) | 360 | **0** |
| the same, as an HONORIFIC ("Connection: Ferryman …") | 174 | 174 (named below: not this seat's hunk) |

The 27 towns K-B left (the role's surfaces: the journal's Tonight page, the seat line) are at none: no title line prints the
old face. `kprint.mjs` (faces only) still counts 67 towns: 62 are the honorific; the rest are the probe's false hits (the
power's NAME "Headman's Authority", "landlord", a goal naming "the village headman's office").

**Census (BEFORE at the base, AFTER at K-C), the tabs' inventory:** 30,045 → 30,111; 15 gone, 81 new, 69 in fewer towns, 3
in more. **The exports' (`SURFACES=PDF,Journal`):** 35,818 → 36,006; 53 gone, 241 new, 188 in fewer, 0 in more. EVERY
sentence that lost towns holds a face word (`lostcheck.py`: tabs 84/84, exports 241/241). The 3 sentences "in more towns"
on the tabs (the premium "Patron deity" panel, 714 → 718) are the base run's flake: its render lost a worker to the
machine's memory limit and 22 seeds were re-rendered; those 4 towns rendered alone at the base print the panel. The diffs
are beside the instruments (`AFTER.tabs.inventory_diff.txt`, `AFTER.exports.inventory_diff.txt`).

**The inheritors, read in three towns** (each prints the form on every surface: Power seat line, Head row, Institutions
connection, World "Still the … as well", the journal's quick reference and NPC page, the PDF's people table, Tonight):
r2r-thorp-3 (a thorp: "Borchigid Kiyad, the boat-master and Elder, holds the seat of the Elder Council"); r2r-city-2 (a city:
"Chae Wei, the lady, first of The Highborn Circle"; "| Dong Wu | the keeper of the houses | Arcane Council |");
r2s-insurgency-hamlet-0 (a crisis: "Eirenika Comnenus, the chief, knows where the hoarded food can be found…"; Tonight
"Eirenika Comnenus (the chief · bears the brunt)"). True in each: the card names its house, the office words stay.

## The guard (red first)

`tests/generators/people/holderTitleForms.test.js`: twelve MOVE pairs (seed, holder, the face that must not print as the
title, the role or a row end, what prints instead), one per face that moves on a calm seed: **red 12/12 at the base**,
green after. Six KEEP pairs (a man "the lord", "the ferryman"; a woman "the madam", "the alewife"; a man "the midwife",
the owner's veto; a woman's office "Lord Marshal"): green before and after. A plant not committed (the K-B form: the title
only) reds the role pairs. `tests/data/holderTitleForms.test.js`: the leaf's table, `styledTitleOf`'s reading of it, and
`faceOfRole`.

**Re-keyed BY IDENTITY (the reason in each test):** `styledTitleOnRows.test.js` (2 cases), `mintedLordKeepsLines.test.js`
(1 case) and `mintedFaceUnderworld.test.js` (1 case: r2r-metropolis-213's minted lord is a woman) found a woman lord by
`role`/`title === 'the lord'`; under K-C her role and title read "the lady" and the face she
holds is her `institution.title`, so they find her by the face. **M-1b's two tests (`representatives.test.js`) are GREEN
UNCHANGED**; `seatWordsOnce.test.jsx` N6 green unchanged.

## THE VETO LIST: the whole face table as built (the owner's)

| the face | the form for a man | the form for a woman | cards moved (the 720) |
|---|---|---|---|
| the front man | the front man | **the nominal owner** | 96 |
| the senior abbot | the senior abbot | **the senior abbess** | 87 |
| the lord (seat mint: Noble Houses/Families; the claimant) | the lord | **the lady** | 81 |
| the district madam | **the keeper of the houses** (the chair's word) | the district madam | 80 |
| the ferryman | the ferryman | **the ferry keeper** | 61 |
| the boat-headman | the boat-headman | **the boat-master** | 56 |
| the madam | **the keeper of the house** (the chair's word) | the madam | 52 |
| the alewife | **the brewster** | the alewife | 31 |
| the foundling-mother | **the foundling-keeper** | the foundling-mother | 18 |
| the camp foreman | the camp foreman | **the camp overseer** | 17 |
| the abbot | the abbot | **the abbess** | 10 |
| the headman | the headman | **the chief** | 4 |
| the newcomers' spokesman | the newcomers' spokesman | **the newcomers' speaker** | 2 |
| the high priest | the high priest | **the high priestess** | 0 (R2's `styledTitleOf` already) |
| the midwife | KEPT (the word names the work; the honorific reads "Goodman") | the midwife | — |
| the priest, the elder priest | KEPT (the honorific pools hold Father/Mother) | KEPT | — |
| the monarch, the outlaw host, the lord's appointee, the journeymen's warden, every "… master" face | KEPT (no sex in the word) | KEPT | — |
| an OFFICE's title (Lord Marshal, Lord Warden, Lord Mayor, Lord Burgomaster, Lord Protector of the Faith, Alderman, Headman, Elder) | the office's | the office's (the chair, 2026-11-15) | — |

A role moves with the title only where the role is the face (M-1b): a dual-hat leader's role is the office's and stays
(46 women "the boat-master" keep the role "Elder"; 8 "the camp overseer"; 6 men "the brewster").

## What is left

Of class k, for this seat: nothing. K-C is built and pushed (1036bf94b); k stands at its six false hits ("the lord's
appointee"). What remains of the class prints through files not mine (below): the honorific pools (174 towns) and the
golden master (the owner's door). The seat is handed back.

## Named for other seats (not built here)

- **The honorific pools, `src/data/faceHonorifics.js :: FACE_HONORIFICS` (the file's owner):** the Institutions tab's
  connection line prints the face's honorific beside its holder, drawn from the pool keyed by the face: 174 towns at the
  base and after (women "Frontman" 96, "Ferryman" 61, "Foreman" 9, "Headman" 8; men "Mother" 18). K-B's patch holds the
  seven pool hunks ready (`probes/RECORD-MEASURE-2/kb.patch`: `{ male, female }` forms Ferry-Keeper, Boat-Master, Overseer,
  Chief, Proprietor, Speaker; Keeper/Warden for a man's foundling home). Display only; the draw index is unchanged.
- **The golden master moves** (every npc title/role word above): THE OWNER'S DOOR, not re-taken.

## Gates (at the commit's tree)

eslint on the touched files: 0. Strict domain: 1113 / ceiling 1113. Type ratchet: 167 / ceiling 167. The presumed-things
walker `--check`: fresh 145, the base's own set (exit 1 at the base and here alike: carried). The twelve-birth grid: 2 falls
(r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a), the same 2 at the base. The 55 test files that name the touched files
(481 tests): every red but those re-keyed above is CARRIED, red at the base alike (16 tests in 8 files, named, not mine):
`generationForkCensus` 4, `presumedThings.walker` 4 (its registers stale at the base), `pipelinePinnedMode` 3,
`crisisBlindWidened` 1, `r3c9ReaderLinesTrue` 1, `worldFactRederive` 1, `hookThemeDraws` 1, `rosterFinalUnderHeldRoster` 1.

## Registers named stale

None re-taken. The golden master (the owner's door) moves.

## How the instruments are re-made

1. `git archive` out: `lane/census-3-2026-11-14:docs/chair/2026-11-14/probes/CENSUS-3`, `lane/chair-2026-11-08:…/READ-ALL`,
   `lane/record-measure-2026-11-14:…/RECORD-MEASURE-1` (`births-only.sh`, `fielddiff.mjs`, `classes.mjs`, `load.cjs`),
   `lane/record-measure-2-2026-11-14:…/RECORD-MEASURE-2` (`npcdiff.mjs`, `kprint.mjs`), and this branch's
   `docs/chair/2026-11-14/probes/TAIL-TITLES/` into one directory beside `load.cjs`.
2. `census3.sh <base tree> before 4` and `census3.sh <this tree> after 3` (four workers each at once exhausts the
   machine's memory: run one at a time); `inventory.py` on each, and `SURFACES=PDF,Journal inventory.py`; `inventory_diff.py`.
3. `node backsub.mjs <tree> <before corpus> <after corpus>` (every moved string leaf back-substitutes to the face);
   `node kcdiff.mjs <before> <after>` (goals, names, stress notes, ties' texts, structural rows' non-word moves, order);
   `node classes.mjs <tree> <corpus> <out.json>` (k); `node kreal.mjs <before> <after> <dumps>` (title vs honorific
   prints); `python3 -I lostcheck.py <before.json> <after.json>`; `node pairs.mjs <before> <after>` (the guard's pairs).
