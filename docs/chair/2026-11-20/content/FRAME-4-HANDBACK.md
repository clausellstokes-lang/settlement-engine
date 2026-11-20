# FRAME-4 — hand-back (the second half of the session sheet's lane)

Last written 2026-11-20T10:40:44Z (`date -u`) by FRAME-4 on `lane/frame-4-2026-11-20`, cut by fast-forward from FRAME-3's final tip `167d532b5` at the chair's word "THE LANE IS YOURS at 167d532b5" (10:13 UTC). A successor needs this file and the briefs it names. Read with `FRAME-3-HANDBACK.md` (its rulings list stays in force; additions below).

## THE COUNT THE OWNER READS FIRST

**AS BUILT at `2a95ecc4e` (B9 merged), UNDER TODAY'S STANDING: 58 of 330 calm towns take the frame; 272 keep today's sheet byte for byte.**

| | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| framed | 0 | 8 | 15 | 5 | 12 | 18 | **58** |
| today's sheet | 55 | 47 | 40 | 50 | 43 | 37 | **272** |

The same 58 towns, town by town, as FRAME-3's recount (`frame3/FRAME3-CF11-RECOUNT.md`): executed, `comm` empty. Opening trouble by type: crime_wave 12, succession_crisis 10, trade_dispute 10, outside_debt 6, trade_collapse 5, resource_scarcity 5, tyranny 3, legitimacy_crisis 3, corruption_scandal 2, popular_uprising 2; no type over a third; cast/weight disagreements 0.

**"Under today's standing":** the lane FORTUNE-1 (seated 09:49 UTC) will judge a ruler's standing against the place's size as a DARK birth rule; W1 reads legitimacy below 45, so this count moves when that rule is lit. It is re-taken then (how: below, "Instruments").

## RULINGS ADDED SINCE FRAME-3's LIST (each vetoable by the owner)

18. **U0, the crisis page's explicit audience argument** (chair, 09:06 UTC): `composeCrisisPage(s, { audience })` over `TONIGHT_AUDIENCES` (no second set), fail closed, every caller explicit; nothing new drawn.
19. **P1b and P4a are drawn for the owner only**, behind U0, red on both sides (chair, 09:05 UTC). P4a is B7's drafted line at rate 1 (no hash; the ladder waits for P4b); the creditor is the `indebted` entry's `cast.stakes[].factionId` whose power's `desc` opens with an indebted `RAISED_BY_CRISIS` text; its face that power's rank-1 roster member; a record with neither prints today's page.
20. **`frame2NamesRule`'s floor** (chair, 10:21 UTC): it counts trouble-cast sentences, not framed towns; the pool is widened by its fair rule (PER 10 → 12), the floor stays 300, in its own commit after B9's merge; no new framed-town assertion there.
21. **Every count given the owner says "under today's standing"** (chair, 09:50 UTC, FORTUNE-1).

## EACH UNIT: STATE, BRANCH, COMMIT

| unit | state | commit | receipts |
|---|---|---|---|
| cut | DONE, pushed | `167d532b5` (ff) | — |
| briefs U0/P1b/P4a | committed, pushed | `8805dda25` | `frame4/FRAME4-BRIEFS-U0-P1B-P4A.md` |
| **B9 + B9b** | MERGED, pushed | merge `2a95ecc4e` (af4e6f861, 0ed7e47c5) | diff read line by line; 45 files 344 passed, 1 expected fail, 1 red = the names floor (rule 20); `tests/lint` whole 2 failed/3271: the lighting census (cured, next row) and `tuningRegister` (rule 14's two named rows) |
| registers at B9 | DONE, pushed | `f20336c12` | lighting by its door: titles 31246 → 31248, suites 8650 → 8651, files 3711; 34/34. Wiring `--dry`: current, delta 0 |
| N1 the names pool | BUILDER OUT | brief `2a112e863`; branch `frame4-n1` | — |
| phone floor census | DONE | `4cee64757` | floored +1 on /create, /settlements, /gallery: `TonightSheet.jsx`'s side-words eyebrow through `chromeFontSize` (chrome sites 2 → 3 by `censusOfSource`); 9/9 |
| proseNumerics row | DONE by FRAME-3 | `36c640d36` | 404 → 406 |
| B6 the re-seat | BUILDER OUT | brief `frame2/B6-RESEAT.md`; branch `frame4-b6` | — |
| B11 (a person never "it") | FRAME-3's builder; relayed when it returns | `lane/frame-3-2026-11-20-b11` | — |
| U0, P1b, P4a, P1, P2, P3, P4b, the measures, the six sheets, build + dist | NOT STARTED | — | — |

## INSTRUMENTS (one command each; outputs under the scratchpad `count/`, `names/`, `regs/`)

- The calm pool: B2's `pool.mjs` (`frame2/B2-WEIGHT-RESULTS.md`, "The scripts"): `node pool.mjs 55 pool.json <src/>` → tried 484, calm 330.
- The count: `node cf11weight.mjs pool.json <src/>` (same file). The framed list: `count/framedList.mjs pool.json <src/>`. TO BE ADDED: one argument forcing FORTUNE-1's rule on, once its switch exists.
- The names floor: `names/floor.mjs <src/> [PER]` (bornPool copied from the test; prints framed calm towns and troubleCast reads by source).

## EXECUTED OR PLAUSIBLE

Executed: every figure above. Plausible: nothing yet reported by a builder of this seat.
