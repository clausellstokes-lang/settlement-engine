# DAILY-C: the owner's three, fixed (for the owner, in plain figures)

Written by DAILY-5. BEFORE is DAILY-B (4e7fa5667: the Daily Life page as point 106 would land it); AFTER is this
lane's tip. The page's sentences for six places, before and after: `after.md` (BEFORE) and `after-daily-c.md`
(AFTER). The measures are on 900 places (150 of each size, seeds `hxd-<size>-0..149`).

## The three flaws
1. ONE FACT SAID TWICE ON A PAGE. The visitor's line now gives way. If another line on the page already says that
   thing (beasts in the country, short food, an open threat, a weak watch), the visitor's line leaves that part out.
   In the six places, the city's "The country around is overrun with beasts" no longer sits above "Beasts now roam the
   country around".
2. THE SAME SENTENCE IN MANY PLACES. 34 new lines are written into the pools (the chair's reading of them, F9 reworded),
   and no extra line was needed.
   - A gathering line needs a house of the place. P16 and P20 need the place's dwellings, by the chair's ruling (b).
   - Sentences seen in 15 or more of a size's 150 places: 34 before, 0 after.
   - Line families (one line before names are filled in) seen in 23 or more: 5 before, 0 after.
3. "the Headman's Authority's mark". It now reads "the mark of the Headman's Authority". On the 900 places, the page
   has 0 possessives on a power's name and 0 double possessives.

## The figures, before and after
- THE LARGEST SHARE, ONE SENTENCE IN ONE SIZE (of 150 places):

  | | thorp | hamlet | village | town | city | metropolis |
  |---|---|---|---|---|---|---|
  | before | 16 | 17 | 18 | 15 | 18 | 21 |
  | after | 14 | 13 | 14 | 14 | 14 | 14 |

- THE LARGEST LINE FAMILY BY SIZE:

  | | thorp | hamlet | village | town | city | metropolis |
  |---|---|---|---|---|---|---|
  | before | 25 | 26 | 23 | 22 | 22 | 24 |
  | after | 19 | 21 | 18 | 16 | 17 | 16 |

- THE READER'S FIGURE: how many identical Daily Life sentences two places of one size share, on average:

  | | thorp | hamlet | village | town | city | metropolis | all sizes together | any two places |
  |---|---|---|---|---|---|---|---|---|
  | before | 0.394 | 0.308 | 0.396 | 0.309 | 0.358 | 0.411 | 0.363 | 0.221 |
  | after | 0.321 | 0.259 | 0.320 | 0.270 | 0.292 | 0.331 | 0.299 | 0.189 |

  ("All sizes together" means every same-size pair. "Any two places" means any two of the 900, of any size.) A page
  prints about 9 to 10 sentences, so two places of one size now share less than a third of a sentence on average.

## Families between 10% and 15% of a size (15 to 22 of 150): 35 after (89 before). LISTED, NOT CURED
Count, share, slot, size, line:
- outsider power: thorp P4 19 (12.7%), P0 17, P13 16, P5 16, P6 15; hamlet P8 19 (12.7%), P4 17, P5 17, P1 15; town P13 16.
- child_warnings: thorp economic_collapse E3 17, monster_pressure P10 16, economic_collapse E7 15; hamlet
  economic_collapse E1 18, E2 18; village unrest U8 18, U2 18; town unrest U9 16, U7 15.
- commoner_resentments legitimacy: thorp L3 15; hamlet L3 15, L6 15; village L5 18, L6 16.
- recent_changes beat: hamlet B5 21 (14.0%), B3 18, B6 16; village B4 17, B7 15; town B1 16, B8 15, B7 15, B6 15;
  city B4 17; metropolis B1 16.
Each line's words are in `../measures/D5C/after2.out.txt`, table 2a.

## Five double possessives on the rest of the page. NAMED, CURED BY NOBODY HERE
From the render census (`../measures/D4C/d4c.render.out.txt`, table 3 (c), 30 places): 4 on Relationships and 1 on
NPCs. Each comes from a person's role title that already holds "'s", with a second "'s" added:
- Relationships, "the network's head's": the title comes from `src/data/institutionalCatalog.js` lines 1476 to 1477
  (the smuggling network's `face: 'the network\'s head'`). It meets two template rows:
  - `src/data/people/handlerTieLines.js` line 84 (`${s.name}'s instructions`);
  - `src/data/npcData.js` line 2100 (`${r.name}'s reputation`).
- NPCs, "the lord's steward's office": `src/data/people/goalFamilies.js` line 368 ('Get {house} through the season
  without borrowing.') with `src/generators/people/goals.js` line 165 (`"lord's steward": 'office'`).

## Sizes that moved. NAMED FOR THE OWNER, SIGNED BY NOBODY

| | lane (DAILY-C) | DAILY-B | the line (point 105) |
|---|---|---|---|
| first paint, raw | 1,180,816 | 1,180,816 | 1,184,741 |
| first paint, gzip | 376,067 | 376,063 | 376,987 |
| first paint, Brotli | 315,708 | 315,822 | 316,646 |
| the generation worker | 2,710,153 | 2,710,153 | 2,709,263 |
| the engine chunk | 932,369 | 932,369 | 932,369 |

- Against DAILY-B: gzip +4 and Brotli -114; raw, the worker and the engine chunk are equal.
- Against the line: these are DAILY-B's own moves.

## What did not change
- No generated place changed. The dark proof hashes 900 births on both trees and gets the same sha256, a54e0bb8…888acb,
  at the line and on this lane.
- The 34 lines are chosen when the page is drawn, not when the place is generated. No lit path changed, so there is
  no flip list.
