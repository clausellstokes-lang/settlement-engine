# FOR THE OWNER: WHAT THE FLIP ASKS OF YOU (the flip: `lane/close-6-2026-11-23-flip` at d447ee31e; landed on the working line `lane/join-2026-11-14` as point 113, its tip f03e9a868; prepared by CLOSE-6, finished by CLOSE-7; 2026-11-24)

Written for someone who does not read code. NOTHING HERE IS SIGNED BY ANY SEAT: every item waits for your word. The flip is
the branch `lane/close-6-2026-11-23-flip`; its last commit is d447ee31e (d447ee31e5b2836736d22778a91ce66721a6d00e), and nobody
adds to it. **The working line now carries point 113: both laws are switched on** (merge 67fcf51de; the line's tip
f03e9a868427e6b656d299c5cce8d33c74758588, pushed 2026-11-24 17:20 UTC). Its first whole run of the test suite with the laws on
(3,782 files, 43,315 tests) found no failure caused by the flip: every failing test is a known one, your signings below, or an
artefact of the landing machine. **Landing is not a release** (section 0 below).

## 0. FIRST: THE DEPLOY'S ORDER, AND WHY THIS LANDING IS NOT A RELEASE
- You paused the share veil on 2026-11-23 at 16:12 UTC. Landing the flip on the working line is NOT a release. **The working line
  is not to be released to users before the share veil's hiding is in it.**
- The database changes of this landing are **migrations 204 to 210** (master ends at 203; the working line and the flip add exactly
  seven files; 211 and 212 exist only on the paused veil lane). They are applied by your hand BEFORE the pull request's merge and
  the deploy.
- **An open item for your decision, nothing built:** in 10 of 180 new towns the chair read on the working line (60 each of town,
  city and metropolis: about one in eighteen), the page's "prominent relationship" is a SECRET tie (a handler's), and the public
  copy serves it with both names, its type and its text, while the tie itself is dropped from the served list. Production today
  holds none (0 of 140 places born on master). Its cure belongs to the paused share veil.
- **A second open item for the paused share veil, nothing built (the chair's ruling R24-C1, 2026-11-24):** where a place's
  ruling hall has been bought by the underworld, its government is stored under a name that says so: "Corrupt Council" (a town),
  "Corrupt City Council" (a city), "Shadow Senate" (a metropolis): 39 of 900 places born as a visitor gets them (18 towns, 14
  cities, 7 metropolises). Before the first deploy the NAME is cured: those forms print as "Town Council", "City Council" and
  "Senate", and that the hall is bought is said only in the game master's own block. What the copy shared with players still
  carries that says the hall is bought (the form's description, "The governing body is systematically compromised; offices are
  sold and justice is purchasable.", and any composed sentence built on it) belongs to the paused share veil.

## 1. Two new rules for how a new place is born are switched on
- **Who rules.** A place's government, the house holding its seat and the person in it are read apart, so a guild, a temple or an
  army can hold the seat in the right circumstances (your words: "Every power group should be able to compete for leadership or
  the seat given the right circumstances").
- **Fortune.** A place's wealth and its ruler's standing are judged against places of its own size; a ruler who has weathered a
  disaster gains standing (the merit), and a long history counts (LASTING).
- **Places already saved do not change**: they keep the rules they were born under (tested).
- **What the switched-on world no longer produces** (each was a test case; each guard is kept, born under the old rules, because
  saved places still show it):
  - no religious-conversion city with an approved seat (0 of 500); no Struggling village with an economy output of 50 or more
    (0 of 800); no hamlet with a charter hall alone and a short purse (0 of 1,000: all 56 such hamlets stand Comfortable or
    Prosperous) (these three cases were moved to the next size that still holds them);
  - no seat accepted when the history is written and unapproved at the end (0 of 2,280);
  - no town whose guards are stored as "well paid" while one of its own armed men says their pay is being cut (0 of 2,700);
  - no town without a thieves' guild where a newly made lord secretly informs for one (outside two named test towns, 0 of 2,080);
  - no church-run economy under a seat that is not the church's: with the laws on, the church council always holds that seat
    (0 of 1,740).

## 2. One fault cured inside the flip, which also moves today's places ("13G")
Where the thieves' guild has bought the hall, the guild's card said "the garrison can arrest their people, and the guild can make
every investigation costly" and the guard's card "A slow war with the guild": two lines that contradict the page. They are now
left out wherever the record says the hall is bought. Of the 900 test towns: 3 today (dp-city-42, dp-metropolis-111,
dp-metropolis-118) and 4 with the laws on (the same and dp-metropolis-83). Nothing is added; no golden and no frozen surface moves.

## 3. The home page's sample village (Cnocby, seed lf-033): what a visitor will read differently (YOUR TWO VETO POINTS)
The village is made by the real engine, so it changes with the rules. It was re-made on the switched-on tree.
- **The story paragraph** (`landing.realm.body2`), re-written by the chair to say only what the new record holds:
  - BEFORE: "Then advance time. In Cnocby’s first twelve weeks the split between the faiths ended, leaving its sectarian memory
    behind, and the village went onto a war footing; by week nine control of the village’s water was passing to the Elder Council;
    then Uathach O'Neill set out to shield their people as crime took hold of its streets; and by week twelve its trade routes had
    broken down, its traders with little to sell. Every one of those is a record the engine wrote, and every one carries its cause."
  - AFTER: "Then advance time. In its first week Cnocby turned to the faith of Vael, its patron creed after a long contest of
    devotion; by week three the village had gone onto a war footing, and soon the split between the faiths ended, leaving its
    sectarian memory behind; then Uathach O'Neill set out to shield their people as crime took hold of its streets; and by week
    twelve its trade routes had broken down, its traders with little to sell. Every one of those is a record the engine wrote, and
    every one carries its cause."
  - The new record's six events: week 1 Cnocby turns to the faith of Vael; week 3 a war footing; week 4 the faiths' split is over;
    week 10 Uathach O'Neill shields their people; week 10 crime takes hold; week 12 the trade routes break down. (Before: weeks 4,
    5, 9 the Elder Council takes the water, 10, 10, 12.)
  - Three readings that moved: the temple's power 30 to 24; the people's trust "strained, turning critical" to "adequate, turning
    strained"; the ruler's public standing 14 ("a crisis of legitimacy") to 33.
- **The arrival line**: BEFORE "The first person you meet on the road into Cnocby wants to know your business, and the second
  already knows it." AFTER "Cnocby has no one thing to look at as you come in, only a great many small ones: a mended fence, a
  painted door, a bench beside a house." (Its second sentence is unchanged.)
- **The hand-written narration** of the voice card is unchanged, word for word.
- **The region band** beside the map, under "Beside it, the region: what the neighbours did while Cnocby was busy.", now holds two
  cards of Cnocby's own and one neighbour's (before: one and two): week 4 "Skáloy, a town of Korl, has broken its faith pact with
  Keshigordu." gave way to week 3 "Cnocby is mustering its levies and doubling its watch." NOT changed in the flip: the line is
  yours to re-word or keep.

## 4. Numbers you set (the tuning tables), left as drafts
- **The contest for the seat** (SEAT_CIRCUMSTANCE_TUNING): every factor is 1 today, so the contest weighs nothing extra until you
  sign figures (the proposed 1.15 to 1.5 are written beside the table).
- **Fortune's numbers** (FORTUNE_LAW_TUNING): points per level of wealth, the usual defence of each size, the merit's 10 points.
- **LASTING's ages**: how old a place must be, by size, to count as long-standing (note: the hamlet's 108 years is below the
  thorp's 269).

## 5. The goldens: the stored "this is what the engine makes" records (TWO SIGNINGS, plus one budget)
Only you can re-sign one: the tool refuses unless your signed shift record (a short file under `docs/shift-records/`) exists.
Each set stays red, by name, until you sign: never a silent pass.
- **Signing 1, the OLD set (`generator-golden-master`)**, re-signed. It births places the old way, so switching the rules on does
  not move it; what moved is ONLY WORDS (the full table: `close/close-2/oldmaster/OLD-MASTER-DIFF.md`): the work of points 77 to
  112 (articles, pronouns, goals, ties, defence and safety lines, history hooks). The "her distrusts" fault CLOSE-2 found is CURED
  (point 109). 13G's two cut lines may also show in it where a place's guild bought its hall (not counted). Command, after your
  record exists: `GOLDEN_SHIFT_SIGNED=docs/shift-records/<your record>.json UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js`
- **Signing 2, the NEW "lit twin" (`generator-golden-master-lit`)**, signed for the first time: the same 525 places born as a NEW
  place is born. Measured on the rehearsal tree (before PRONOUN, VACANT and 13G; the counts may differ by a few now): all 525 move
  against the old way; the powers in all 525, a place's wealth in 330, who holds the seat in 74. One step is part of your act: a
  NEW row for it in `tests/fixtures/.golden-freeze-register.json`. Then: `GOLDEN_SHIFT_SIGNED=docs/shift-records/<your record>.json UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMasterLit.test.js`
  (it fails ON PURPOSE when it writes; the same command without the two settings shows green). Where to read: `close/OWNER-GOLDEN-LIT.md` on the branch `lane/close-1-2026-11-22-golden-wip`.
- **One time budget held for your signing**: `tests/property/espionageDormancyFence.test.js` FENCE 1 (120 s; 62.9 s alone here,
  about 116 s on a CI runner). Its file is frozen whole, so the raise to 240 s waits for you; the test is red in any case by its
  listed fingerprint row until your golden signing.

## 6. Sizes (how much the app downloads)
The app's download is measured at three places, each with a budget it must stay under. ALL FIVE WERE ALREADY OVER THEIR
BUDGETS ON THE WORKING LINE BEFORE THE FLIP (point 112); the flip itself moves them by a few hundred to a few thousand bytes.
Raising a budget is yours alone: no seat has raised one. Measured by the landing's own build (2026-11-24, the flip merged onto
the line at 67fcf51de):

| what | with the flip | the line before it (point 112) | the flip's change | the budget | over the budget by |
|---|---|---|---|---|---|
| first paint, raw | 1,180,816 | 1,180,816 | 0 | 1,175,492 | 5,324 |
| first paint, gzip | 376,057 | 376,065 | -8 | 373,999 | 2,058 |
| first paint, Brotli | 315,858 | 315,768 | +90 | 313,994 | 1,864 |
| the generation worker | 2,716,002 | 2,713,402 | +2,600 | 2,579,708 | 136,294 |
| the engine chunk | 932,846 | 932,583 | +263 | 909,928 | 22,918 |

- **First paint** is what a visitor downloads before the page shows (gzip and Brotli are the two compressed forms browsers
  receive). The flip adds nothing to it that matters: raw is unchanged, gzip 8 bytes smaller, Brotli 90 larger.
- **The generation worker** is the part that makes a place, downloaded when one is made; **the engine chunk** is the engine's
  shared code. The flip's +2,600 and +263 come from its own changes to the engine,
  chiefly the two laws' switch-on (read from what the flip changed, not measured change by change).
- What the line already owed before the flip was added point by point, each named for your size signing in the chair's record
  (`ci/LINE-NOW.md`: among them who rules' 3,818 and 670 bytes of first paint, fortune's 167, the Daily Life vocabulary 714).
- **The state sentences' size counts** (three rows that stay red by name in the checks until you sign): the written-prose
  corpus measures 302,506 bytes raw and 40,020 compressed in its defence part (302,541 and 40,039 on the line before), and one
  composed sentence family (A0b) measures 2,327 bytes against its ceiling of 2,103 (2,328 before).
- YOUR CHOICE: sign the rises (each budget re-set to its measure), or ask for bytes to be bought back first. Nothing here
  blocks landing the flip on the working line; it bears on the release.

## 7. What the seats re-recorded without you (listed, not to sign)
About 200 test values pinned to what the old rules produced were re-recorded by their own tools with the reason written beside
each: a sentence on a named town, a count, a seed chosen because it once showed a case (re-picked by the case's own test, never
by the answer). None is a golden or one of your numbers. Two registers were re-taken by their own doors (the lighting census;
the mutation manifest).

## 8. The red list after the flip (for the landing)
Added: `tests/generators/defenceParts.test.js` "R13: where something is built or standing, the will counts no more than the armed
bodies that carry it" (lit; the defence lane re-cuts its bound after the first deploy); the lit twin's three rows (until signing 2).
Leaving: `tests/build/landingFixtureFreshness.test.js`'s two rows (the sample village re-made). Staying: FENCE 1 (its row 30).
