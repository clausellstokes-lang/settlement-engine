# (C) THE TRAITS AS THE ENGINE HOLDS THEM

Tree 682667fe2 (point 120). Script counts CONFIRMED (`c-static.mjs`, `cd/cd.mjs` over C and V, 900 births each); readings marked PLAUSIBLE.

## The three tables, counted

| what the last chair recorded | what the script counts | verdict |
|---|---|---|
| `src/data/npcData.js :: NPC_PERSONALITY_TRAITS`: 105 traits (45 dominant, 30 flaws, 30 modifiers) | 105 entries: `positive` 45, `negative` 30, `neutral` 30. **104 distinct words**: `methodical` stands in both `positive` and `neutral` | CONFIRMED, with the duplicate named |
| `src/data/people/goalFamilies.js :: PERSONALITY_CLUSTER_OF` (the brief says `src/domain/people/`; it lives under `src/data/people/`): 12 clusters covering 104 | 12 clusters (`PERSONALITY_CLUSTERS`): greed 6, hunger_for_status 4, fear 3, forbidden_patron 4, duty 16, kindness 12, mastery 13, caution 13, conviction 8, sway 12, grudge 7, impulse 7. They cover **all 104 distinct words**; no key names a word outside the lists | CONFIRMED. The 104 is the count of distinct words. No trait is left out |
| `NPC_DEALING_BY_TRAIT`: 4 dispositions, read flaw first, then dominant, then modifier (the brief says `src/domain/people/dealingLines.js`; the table is `src/data/npcData.js :: NPC_DEALING_BY_TRAIT`, read by `npcData.js :: dealingLineFor` and re-exported through `src/data/people/dealingLines.js`) | 4 dispositions (welcoming, transactional, cautious, dismissive) **x 12 trait families** (straight, warm, careful, sharp, dutiful, price, lofty, guarded, slippery, hard, shirking, dealmaker) = 48 lines, already written and printed today as the card's "How they deal" | CONFIRMED in count. **The reading is wrong**, see below |

**Traits neither fold covers: none.** The drives cover every one of the 104 distinct words. The dealing families (`npcData.js :: DEALING_TRAIT_FAMILY`) leave 14 words unmapped: eccentric, melancholic, stoic, cynical, iconoclast, fatalistic, idealistic, mercurial, superstitious, brooding, nostalgic, contrarian, restless, obsessive. A card whose three traits all fall in those 14 gets its disposition's plain line (`NPC_PLOT_HOOKS_DATA[disposition]`).

## What the design takes for granted that the engine does not do (it refutes part of the grain)

1. **The four ways of dealing are not read from the traits.** The disposition is a field drawn with the person's role presentation (`npcGenerator.js :: pickTitle`: `NPC_PLOT_HOOKS[role]` gives `{impression, disposition}`) and stored at `npc.presentation.disposition`. The reader that goes "flaw first, then dominant, then modifier" picks one of **12 families** inside that disposition, not one of four. "Four spoken versions by the speaker's way of dealing" is therefore a straight read of a stored field. That is cheaper than the design says, and correct, but the trait reader has nothing to do with it. CONFIRMED (read).
2. **The "main trait" is absent on four people in ten.** `TRAIT_PRESENCE_DISTRIBUTION` keeps the dominant trait only 60% of the time (both 0.40, flaw only 0.30, temperament only 0.20, neither 0.10). On the corpora: C 10,990 of 27,391 people, V 10,511 of 26,218 (40%). A manner tag "from the drive of the speaker's main trait" needs a stated fallback. The engine's own goal reader uses flaw, then dominant, then modifier (`goals.js:634`), and the modifier is always present. It makes almost no difference to the cells (559 against 559 towns on C).
3. **The engine already gives each person a voice of their own: `personality.speech` (SPEECH_PATTERNS, 30) and `personality.tell` (MANNERISMS, 30), drawn without replacement inside a settlement** (`npcGenerator.js:309-310 :: drawUnique`). On C and V no thorp, hamlet or village has two people sharing a speech pattern or a mannerism (0 of 900 small places). Two people share one only once a place holds more than 30 people (towns: 33 of 150 on C, 40 on V; every city and metropolis). The per-speaker separation the manner tags are meant to buy already exists below the town and is stored. The design should use it before it writes 48 new tags.

## The people of a town across the 4 x 12 cells (disposition x drive of the main trait, falling back to flaw, then modifier)

"Legitimate" means a public face that is not a criminal face (`people/allegiance.js :: isCriminalFace`) and not a veiled card. Tags are simulated as a stable pick per person (fnv(seed::name) mod k). "Speakers" are the people (B)'s ranking (loose) actually gives a line. A tab counts as "read alike" when two of its speakers share the cell and the tag.


**C** | thorp | hamlet | village | town | city | metropolis | all
|---|---|---|---|---|---|---|---|
| towns | 150 | 150 | 150 | 150 | 150 | 150 | 900 |
| named people | 192 | 535 | 1198 | 3739 | 9138 | 12589 | 27391 |
| people with no main (dominant) trait | 81 | 194 | 487 | 1486 | 3747 | 4995 | 10990 |
| mean cells used (of 48), legitimate people | 1.2 | 3.2 | 6.9 | 16.6 | 27.9 | 31.7 | 14.6 |
| towns where two legitimate people share a disposition x drive cell | 1 | 26 | 86 | 146 | 150 | 150 | 559 |
| ... reading the drive flaw-first (the engine own order) | 1 | 27 | 83 | 148 | 150 | 150 | 559 |
| towns where two still read alike with 4 tags a drive | 1 | 9 | 38 | 129 | 150 | 150 | 477 |
| ... with 6 tags a drive | 1 | 6 | 26 | 120 | 149 | 150 | 452 |
| towns where two SPEAKERS (B, loose) share a cell | 1 | 26 | 86 | 144 | 150 | 150 | 557 |
| ... still alike with 4 tags | 1 | 9 | 35 | 104 | 135 | 140 | 424 |
| tabs with a speaker (B, loose) | 1083 | 1177 | 1181 | 1306 | 1501 | 1624 | 7872 |
| tabs with two or more speakers | 99 | 625 | 630 | 758 | 918 | 986 | 4016 |
| tabs where two speakers share a cell | 3 | 45 | 84 | 153 | 195 | 197 | 677 |
| tabs where two speakers still read alike with 4 tags | 3 | 13 | 26 | 47 | 58 | 49 | 196 |
| towns with at least one such tab | 1 | 9 | 21 | 39 | 50 | 41 | 161 |
| towns where two people share a speech pattern | 0 | 0 | 0 | 33 | 144 | 150 | 327 |
| towns where two share a mannerism | 0 | 0 | 0 | 32 | 144 | 150 | 326 |

**V** | thorp | hamlet | village | town | city | metropolis | all
|---|---|---|---|---|---|---|---|
| towns | 150 | 150 | 150 | 150 | 150 | 150 | 900 |
| named people | 193 | 507 | 1214 | 3678 | 8636 | 11990 | 26218 |
| people with no main (dominant) trait | 82 | 186 | 517 | 1485 | 3505 | 4736 | 10511 |
| mean cells used (of 48), legitimate people | 1.2 | 3.1 | 6.9 | 16.5 | 26.9 | 31.4 | 14.4 |
| towns where two legitimate people share a disposition x drive cell | 1 | 19 | 86 | 149 | 150 | 150 | 555 |
| ... reading the drive flaw-first (the engine own order) | 1 | 19 | 90 | 149 | 150 | 150 | 559 |
| towns where two still read alike with 4 tags a drive | 0 | 6 | 39 | 130 | 149 | 150 | 474 |
| ... with 6 tags a drive | 0 | 3 | 22 | 104 | 150 | 150 | 429 |
| towns where two SPEAKERS (B, loose) share a cell | 1 | 19 | 83 | 146 | 150 | 150 | 549 |
| ... still alike with 4 tags | 0 | 6 | 34 | 108 | 130 | 145 | 423 |
| tabs with a speaker (B, loose) | 1093 | 1222 | 1228 | 1326 | 1454 | 1491 | 7814 |
| tabs with two or more speakers | 104 | 588 | 695 | 763 | 924 | 965 | 4039 |
| tabs where two speakers share a cell | 3 | 31 | 97 | 140 | 211 | 228 | 710 |
| tabs where two speakers still read alike with 4 tags | 0 | 10 | 25 | 36 | 54 | 65 | 190 |
| towns with at least one such tab | 0 | 5 | 21 | 34 | 45 | 48 | 153 |
| towns where two people share a speech pattern | 0 | 0 | 0 | 40 | 142 | 150 | 332 |
| towns where two share a mannerism | 0 | 0 | 0 | 40 | 142 | 150 | 332 |

## Is four tags a drive enough?

- **Over a whole town, no tag count is enough above a village, and none is needed below one.** From the town size up, two legitimate people share a cell in 146–150 of 150 places, and 4 tags leave a same-sounding pair in 129–150 of 150 (C, all legitimate people). That is arithmetic: a town holds about 25 people and 17 cells are in use. In thorps and hamlets the cells almost never collide (1 and 26 of 150 on C).
- **On a tab, which is where a reader hears two people side by side, 4 tags are nearly enough.** Of the tabs that carry two or more speakers, 677 of 4,016 (C) have two of them in one cell, and 196 (4.9%) still read alike with 4 tags. On V the figures are 710, and 190 of 4,039 (4.7%). The share of towns with at least one such tab is C 161 of 900 (18%) and V 153 of 900 (17%), most of them towns, cities and metropolises. 6 tags lower the whole-town share only a little (C 477 to 452).
- **The cure is not more tags, and not more sentence versions.** The stored `speech` line is unique in every place up to 30 people, and (B) shows the larger fault is one person saying too much in a small place, not two people sounding alike in a big one. CONFIRMED (the counts); the judgment is PLAUSIBLE.
