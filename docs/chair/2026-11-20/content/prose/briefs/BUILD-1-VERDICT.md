# BUILD-1's VERDICT — the chair's rulings on PROSE-LINES-1 and -2 (17:28, 17:38 UTC), written for BUILD-1's builder by PROSE-1 (2026-11-20T17:45Z)

BUILD-1 builds ONLY `lines/PROSE-LINES-1.md` and `lines/PROSE-LINES-2.md` (NOT 3 and 4), with every change below applied. FIRST apply the changes TO THE TWO LINE FILES THEMSELVES (so they hold the final text, each change marked `*(CHAIR 17:28: …)*`), commit that alone, THEN build from them.

## THE SIX CHANGES (17:28)
1. **THE NOUN.** No NEW line says "the town", "a town", "town's" or any form of "town": say "the place", "it", or `{settlement}`, whichever reads best; keep the sentence otherwise. Change NO existing line. (The corpus's `speakTierNoun` would turn "town" into the size noun, but the chair rules it out of new lines.)
2. **DM-ONLY** on every NEW line of these pools (add `· dm-only` after the angle): file 1 pool 7 (lines 6–11 and its two SPARES, already done); file 2 pool 4 (3–6, done); pool 17 (4–7, done); **pool 20, DS-DEF-4 structure null (lines 4–7): ADD.**
3. **File 1 pool 8 (DS-POW-2 recentConflict present), lines 4–8 become, word for word:**
   - 4 `[visitor]` A stranger at {settlement} does not have to ask long before someone mentions the quarrel.
   - 5 `[unfolding]` The quarrel at {settlement} belongs to the place's present rather than to its history, and people speak of it that way.
   - 6 `[counterforce]` Nobody at {settlement} treats the quarrel as somebody else's business; it is the place's own, whoever is at the heart of it.
   - 7 `[ledger]` Whoever decides things at {settlement} decides them with the quarrel in view.
   - 8 `[street]` Most people at {settlement} have something to say about the quarrel, whatever their own part in it.
4. **Rewordings, word for word (angle and marks unchanged):**
   - File 1: 1.11 → "Nobody at {settlement} speaks of going to market here, for there is none to go to." · 9.7 → "{settlement}'s safety is set down here as first found, and what later days bring is not part of it." · 10.7 → "A stranger at {settlement} hears the {seat} named long before meeting anyone who speaks for it." · 12.10 → "Food reaches {settlement}'s tables as fast as it is eaten, and nobody has to think about the pace."
   - File 2: 5.4 → "No court sits at {settlement} to decide a quarrel, and the place gets along without one." · 5.6 → "A quarrel at {settlement} is settled without a court, by the people in it or by whoever they both heed." · 8.8 → "In {settlement}'s reckoning one source stands far above the rest." (KEEP the draft's "and the rest together come to less than it" ONLY if the pool's state key in the source document proves more than half of earnings from the one source: DS-ECO-12's "INCOME MIX: one source carries the town" threshold; say which in the commit) · 12.10 → "The wall around {settlement} brings every road in through its gates." · 12.12 → "The upkeep of {settlement}'s wall is a standing charge on the place." · 12.13 → "Coming up to {settlement}, a traveller sees the wall before anything behind it."
5. **CHECK file 2's 7.5** (DS-ECO-12 INCOME WEIGHT: the practice of magic): read the block's STATE-KEY. If the state is that magic EARNS a weighty share, 7.5 becomes "Magic's weight at {settlement} shows in its dealings, which would look different without it."; else it stands. Say which in the commit.
6. **SPARES stay unused** unless a pool misses the bar on the built measure (report it; do not add them yourself).

## THE FAITH TEASER (17:38)
- `tests/lint/faithTeaserLicence.test.js`: the LICENSED set gains EXACTLY four words, `'are', 'marks', 'turn', 'gather'`, in ONE changed line, with a comment naming the chair's ruling of 2026-11-20 17:38 UTC. Nothing else in that file.
- DS-FTH-2 `PRIVATE DOSSIER` (file 1 pool 2) gets these NEW rows after its #4, in this order, `{colour}` pool so no marks: `[ledger]` {settlement} holds to its rites {observance}. · `[visitor]` The rites are kept at {settlement} {observance}. · `[threshold]` {settlement} marks its rites {observance}. · `[counterforce]` Folk at {settlement} turn to their rites {observance}. · `[street]` The people here gather for their rites {observance}. · `[unfolding]` {settlement} keeps its observances {observance}.
- READ EACH with every distinct `{observance}` fill (`src/domain/dossier/faithReading.js :: observancePhraseOf`, five bands) and DROP any that does not read as English with some fill; list the five fills and the drops in the commit.

## ONE EXISTING LINE REWORDED (17:38; truth outranks canonical-at-zero)
DS-POW-2 `recentConflict present` #1 becomes: "{settlement} is still living with its recent quarrel, and the hall is run with it in mind." The projector refuses a reworded row unless `scripts/generate-dossier-state-prose.mjs :: WORD_CORRECTIONS` carries its row `{ pool, vid, from, to, ruling }` (the refusal prints the row to add); add exactly that row with `ruling: 'CHAIR-2026-11-20-17:38'`. Nothing else in that script. A saved town keeps its stored sentence.

## THE MEASURE AFTER (17:28)
Over ALL places of a size on **150 places a size** (seeds `hxd-<size>-0..149`): `map/run-map.sh` takes a count; if it does not, run its census file with N=150 by its own variable. Top share = places printing the line / places of the size. Report the head before (the base, same 150) and after.
