# TAIL-TITLES · hand-back · class k (a person's title is the house's face, minted with no reading of the drawn sex)

> **TAIL-TITLES-2 (the successor seat) holds this file from 2026-11-15.** Its one job, KT1 (the honorific pools), is the
> first section below; everything after it is TAIL-TITLES's K-C record, unchanged but for "What is left" and "Named for
> other seats", brought current.

## TAIL-TITLES-2 · KT1 · the honorific pools (one commit, a DECLARED MOVE of display text only)

Seat: TAIL-TITLES-2, builder, successor of TAIL-TITLES. Base: this branch's tip **b30c1b7aa** (read back from origin; K-C at
1036bf94b). Own and only branch; nothing merged. `src/data/faceHonorifics.js :: FACE_HONORIFICS` LENT to this seat (the
powers group's file; no other seat writes it).

**The ruling, copied (KT1, the chair, 2026-11-15 02:12 UTC; vetoable by the owner):** THE HONORIFIC POOLS, ONE COMMIT, A
DECLARED MOVE OF DISPLAY TEXT ONLY. The Institutions tab's connection line prints a face's honorific beside its holder; 174
towns print one against the holder's sex (women "Frontman" 96, "Ferryman" 61, "Foreman" 9, "Headman" 8; men "Mother" 18).
THE LAW IS K-C'S: THE PLAIN NEUTRAL WORD a reader would not notice; a pair only where both words are ordinary; ONE FACE,
ONE WORD across its title, its role and its honorific (where K-C gave a face a word, the honorific takes the same).
kb.patch's seven hunks are a CANDIDATE, not a ruling: take a form only if it meets the law (a hyphenated coinage does not),
and run the tests the measuring seat did not. M-1b STAYS GREEN AND UNCHANGED. THE DRAW DOES NOT MOVE (display only): show
it by the field diff. MEASURE: 174 towns to none on the tabs, the PDF and the journal; every sentence that loses towns
holds an honorific word; the veto table. ALSO, ONE PARAGRAPH: the six false hits left of class k.

**What was built.** Seven pools of `FACE_HONORIFICS`, each entry replaced IN PLACE (no pool grows or shrinks, so
`pickVariant`'s pick over the card id and the house lands on the same slot; the walker's count of forms stays 373). The
sexed plain string becomes a `{ male, female }` form whose other-sex word is K-C's word for that holder. Nothing else in
the file; `styledTitleOf` is unchanged and reads the same for every one of these faces (K-C's leaf answers first for
the other sex, and for the face's own sex the fallback's last-word test does not match), which the field diff confirms.

**THE VETO TABLE (the owner's): every form, old to new, with the towns it prints in (the tabs' connection line and the
World/NPCs card's honorific row).**

| the face | the holder | old honorific | new honorific | the title K-C gave (one word) | towns (cards, the 720) | kb.patch's candidate |
|---|---|---|---|---|---|---|
| the front man | a woman | Frontman | **Nominal Owner** | the nominal owner | 96 | Proprietor (not K-C's word) |
| the ferryman | a woman | Ferryman | **Ferry Keeper** | the ferry keeper | 61 | Ferry-Keeper (a hyphenated coinage) |
| the boat-headman | a woman | Headman | **Boat-Master** | the boat-master | 23 (the card's row; 2 of them print the office's "Headman" on the connection line: below) | Boat-Master (taken) |
| the foundling-mother | a man | Mother; Matron | **Keeper** (both slots) | the foundling-keeper | 18 | Keeper / Warden (Warden is a second word) |
| the camp foreman | a woman | Foreman | **Overseer** | the camp overseer | 17 (9 on the connection line) | Overseer (taken) |
| the newcomers' spokesman | a woman | Spokesman | **Speaker** | the newcomers' speaker | 2 | Speaker (taken) |
| the headman | a woman | Headman | **Chief** | the chief | 1 | Chief (taken) |

A holder of the face's own sex, and every unsexed slot of these pools ("Ferry-Master", "Skipper", "Camp Master", "Chief",
the culture pools: "Mukhiya", "Chieftain" …), print exactly what they did.

**The measure (one census before, at b30c1b7aa, and one after, at this tree; the 720, one run at a time).**

| | base b30c1b7aa | KT1 |
|---|---|---|
| record families moved (`fielddiff.mjs`) | — | **0 towns of 720, 0 families**: the draw does not move |
| towns where a card's pool honorific is a word of the other sex (`honfaces.mjs`, every card of the corpus) | 227 (182 of the seven pools + 45 "Lord Chancellor", below) | 45 ("Lord Chancellor" only) |
| towns PRINTING the seven pools' old word before a moved card's name (`honprint.mjs`, every surface) | **170** | **0** |
| towns printing "Headman" before a woman's name, any card | 28 | 27: every one the OFFICE's word (below) |
| tabs' inventory (`inventory.py`) | 30,111 | 30,118: 1 gone, 8 new, 11 in fewer towns, 4 in more |
| exports' inventory (`SURFACES=PDF,Journal`) | 36,006 | 36,006: **nothing moved** (the PDF and the journal print no pool honorific) |

EVERY sentence that lost towns holds an old honorific word (`honlost.py`: 12 sentences, 11 of them "Frontman",
"Ferryman", "Mother", "Foreman", "Spokesman", "Headman" with or without "Connection:"); the twelfth is the World/NPCs card's
row "Boat-master" (23 → 0), which inherits "Boat-Master": the card's row printed the house's TITLE where the honorific was an
office word ("Headman", `seatKeeperDisplay.js :: shownHonorificOf`, F10), and prints the honorific now that it is not one:
the same word, its case. Every sentence that gained towns holds a new word. **The inheritors, read:** "Connection: Nominal
Owner <N>" (96: r2r-city-0 "Nominal Owner" under Zoya Gusev, Front businesses), "Connection: Ferry Keeper <N>" (61:
r2r-village-2 "Ferry Keeper Cveta Klimov"), "Connection: Keeper <N>" (18: r2r-city-3 "Keeper Emmanuel Chrysoberges"),
"Overseer" (r2r-thorp-35 "Overseer Messalina Maximus"), "Boat-Master" (r2r-thorp-3, the Elder Council's first, "Boat-Master"
under "Fishing community · Elder"), "Speaker" (r2s-mass_migration-city-1), "Connection: Chief <N>" (r2s-insurgency-hamlet-0,
"Chief Eirenika Comnenus", a crisis town). True in each: the card names its house in the holder's word, the title and the
honorific one word. The diffs are beside the instruments (`probes/TAIL-TITLES-2/AFTER.*`).

**Of the ruling's 174, what is left (7 towns), and why it is not this file's:** the female "Headman" the ruling counts 8
of (as TAIL-TITLES's `kreal.mjs` measured it, moved cards only) is, but for the one pool hit cured above, a DUAL-HAT
LEADER'S OFFICE: a woman who holds the house AND the council's office "Headman" (her `role`), whose connection row names
the office she holds ("Connection: Headman Thecla Schulz, the boat-master", r2r-thorp-30; `seatKeeperDisplay.js`, the seat's
house's row). Across every card it is 27 towns, each a role "Headman" (the head shepherd 3, the boat-headman 6, the miller
3, the innkeeper 3, …, one "Acting Headman" keeper). K-C's ruling keeps an OFFICE's title the office's ("Lord Marshal …
Alderman, Headman, Elder: the office's"), and the word is read in `seatKeeperDisplay.js`/the office table, not in the file
lent here: NAMED, not built. If the chair wants the office "Headman" to take a holder's form, it is an office-title ruling
and a file of the powers group.

**Named, not built (found by the measure, outside the ruling):** "the chancellor"'s pool `["Chancellor", "Lord
Chancellor"]` styles 45 women "Lord Chancellor": an office's title, kept by K-C's office ruling (a woman holder of that
office is "Lord Chancellor" in standard use); one line in this file if the chair rules otherwise. The madam's and the
district madam's man reads "Master" while his title reads "the keeper of the house(s)": not a word against his sex, so not
in the ruling's 174, but two words for one face under the law; the cure, if the chair wants it, is `{ male: "Keeper",
female: "Madam" }` in this file (moves the man's honorific in the towns K-C's table lists, 80 + 52 cards).

**The six false hits left of class k ("the lord's appointee").** Six women hold the face "the lord's appointee"
(r2r-town-27 Thuraya al-Zahir, r2r-town-37 Nada ibn Zuhr, r2r-town-59 Aoife Ward, r2s-plague_onset-town-2 Urangua Suldus,
r2s-succession_void-town-0 Renuka Ahuja, r2s-insurgency-town-2 Bebinn Doherty; `appointee.mjs`). RECORD-MEASURE-1's predicate
flags the word "lord" beside a woman, but here "lord" names THE APPOINTER (the lord who named her), not the holder: "the
lord's appointee" is true of a woman. Their honorific is "Bailiff" (the pool `["Bailiff", "Lord's Bailiff"]`: the second
also names the lord, not her). Nothing false prints, so nothing in this file is cured; the six are the predicate's, and
leave when the predicate reads the possessive.

**The guard (red first).** `tests/data/faceHonorificsHolder.test.js`, on births (the census's r2r and r2s configurations):
seven MOVE pairs, one per pool (seed, holder, face, the old word that must not open the connection line, the line that
prints instead, e.g. "Nominal Owner Shahd al-Kindi"): **red 7/7 at b30c1b7aa**, green after. Six KEEP pairs (a man
"Frontman", "Ferryman", "Headman", "Foreman"; a woman "Mother"; a woman's culture word "Mukhiya"): green before and after.
A plant not committed (the ferryman's pool made the plain "Ferry Keeper" for all) reds the man's KEEP pair.

**Gates (at this commit's tree).** eslint on the touched files: 0. Strict domain: 1113 / ceiling 1113. Type ratchet:
167 / ceiling 167. The presumed-things walker `--check`: output identical to the base's (exit 1 at both: CARRIED). The
twelve-birth grid: 2 falls (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a), the same 2 at the base. The 8 test files that
name `faceHonorifics` (47 tests): green at the base and here. The 14 files that name the honorific's readers (`cardDoor`,
`seatKeeper`, `honorificOfTitle`, the old words), M-1b's `representatives.test.js` among them (5/5, GREEN UNCHANGED): 102 of
109 green at both trees; the 7 reds are the same names at both, the base's own, CARRIED (`seatKeeperContender` 3, `successionClaimants` 4: red at b30c1b7aa alike, not this seat's).
Registers: none re-taken; no golden byte moves (display only).

**How the instruments are re-made.** As TAIL-TITLES's (below, step 1), plus this branch's
`docs/chair/2026-11-14/probes/TAIL-TITLES-2/` into the same directory beside `load.cjs`. One census before (the base tree)
and one after (this tree), four workers, ONE AT A TIME. Then: `node fielddiff.mjs <before corpus> <after corpus>`;
`node honfaces.mjs <base tree> <this tree> <before corpus> moved.json` (every card's connection honorific at both trees, from
one corpus); `node honprint.mjs moved.json <dumps> <corpus>` on each run's dumps; `inventory.py` on each (and
`SURFACES=PDF,Journal`), `inventory_diff.py`; `python3 -I honlost.py <before.json> <after.json>`; `node headman.mjs <dumps>
<corpus>` (the office's "Headman"); `node appointee.mjs <tree> <corpus>` (the six).

---

# TAIL-TITLES's record (K-C)

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

Of class k: nothing. K-C is built (1036bf94b); the honorific pools are built by TAIL-TITLES-2 (KT1, above): the pools'
prints against the sex 170 towns → 0. k stands at its six false hits ("the lord's appointee": true of a woman, above).
Left, and not this branch's: the office's "Headman" on a woman dual-hat leader (27 towns; the office ruling keeps it) and
the golden master (the owner's door). The seat is handed back.

## Named for other seats (not built here)

- **BUILT by TAIL-TITLES-2 (KT1, above). The honorific pools, `src/data/faceHonorifics.js :: FACE_HONORIFICS` (the file's owner):** the Institutions tab's
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
