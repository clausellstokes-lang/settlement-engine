# THE PAPER FLIP LIST, ONE ENTRY: what the flip moves because of "VACANT" (CLOSE-3 unit (1) (h); written 2026-11-22 22:02 UTC, read from `date -u`)

**The unit:** `lane/close-3-2026-11-22-vacant-wip` at fc0ec46a0 (the cure) and 003a1723b (the lighting census by its door), on the line's tip 244fa84ef.

**Dark: nothing moves.** 900 dark births (`dp-<size>-<i>`, 150 a size, through `birthConfig`): sha `242edc8e…` on the line and on the wip, EQUAL (`births-sha.mjs` beside this file). The vacant lines are read only under the seat law.

**Lit: 9 of 900 births move (1 in 100).** The births are `lm-<size>-<i>`, 150 a size. The lit ref c1128c8f6 has sha `fb3f0172…` and the wip's lit twin `lane/close-3-lit-scratch-2026-11-22` (1637eb736) has `f7e08e98…`.

| size | births that move |
|---|---|
| thorp | 1 |
| hamlet | 0 |
| village | 0 |
| town | 3 |
| city | 2 |
| metropolis | 3 |

All nine are under `succession_void` with a holder apart from the form. In each, ONLY the holder's description moves (its W3 becomes a W3v), and in six of them the form↔holder relation row too (its W1 becomes a W1v). Nothing else moves: 1 or 2 paths a birth (`VACANT-LIT-MOVES.txt` beside this file).

The nine seeds are lm-city-108, lm-city-47, lm-metropolis-119, lm-metropolis-51, lm-metropolis-89, lm-thorp-78, lm-town-125, lm-town-29 and lm-town-31.

**What a flip census row may show:** a test that births a lit place under `succession_void` with a holder apart and pins that holder's W3 standing or its form↔holder W1 row on a named seed. The chair's read of CLOSE-2's parts 1 and 2 found no such red ("No red pins a W1 or W3 holder line on a missing seat"). **So VACANT is expected to move no census row.** If one shows, it is this entry's (class (a), a born anchor).

**The tests VACANT adds:** they plant their dials, so they stay green flipped.
- arms (10) to (15) of `tests/generators/seat/seatHolderLines.test.js` ((14) and (15) added by cure one and by CLOSE-4's VACANT-15)
- `seatHolderFindings`'s two new codes, `seat_vacant_held_line` and `seat_held_vacant_line`. These are never raised on 135 lit births (arm 11).

**CORRECTED BY CLOSE-4 (2026-11-23): the unit's tip is now 4ef6d6c32 on `lane/close-4-2026-11-23-vacant-wip`** (fc0ec46a0, 003a1723b, then 2b8cc2946 cure one, d4ea9a9f2 arm (15), ac8121863 its census and 4ef6d6c32 the voice cure). Everything above still holds at that tip, re-measured: dark `242edc8e…` EQUAL (900 births); the lit base c1128c8f6 `fb3f0172…` re-made, and the tip's lit twin `lane/close-4-2026-11-23-lit-scratch` (1a2ee47e3) `f7e08e98…`, the same sha as CLOSE-3's twin at fc0ec46a0, so the same 9 births move by name. Cure one, arm (15) and the voice cure move no birth.
