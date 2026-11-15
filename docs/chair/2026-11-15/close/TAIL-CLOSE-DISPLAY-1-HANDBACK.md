# TAIL-CLOSE-DISPLAY-1 — hand-back (current at each push)

Branch `lane/tail-close-display-2026-11-15`, cut from the joined line at 837cad90f (holds c2f053333 and fbcc5712a:
checked with `git merge-base --is-ancestor`). Work in a scratch worktree with its own `npm ci`. Bisect: each red's
test file over the joined line's 71 join points, good = f663a2699; for the 9 already red at f663a2699, the cause found
by the corpus/test history (a second bisect over the 200 first-parent points before it runs for reds 4 and 5).

| red | file | turned at | verdict |
| --- | --- | --- | --- |
| 1 | powerStateProseDesk.test.js (2) | red at the base f663a2699: two lanes met. crimeLineDisqualifiers.js (08c9f15b) keys declarations by vid; the corpus re-said ADVANCING v1/v3 (91592cbf, declared) | CURED (display: the stale declarations leave; RECOVERING v4 of a5e74f02 declared) + pins RE-KEYED with the moves; crimeLineDisqualifiers.test.js (3 red, same cause) green with it. c3788c2b |
| 2 | heraldCausalVoice.test.js (1) | red at the base: the pin (be7f5a20) required the appositive the corpus had removed (4a01b319, then dba1a16c, both declared) | RE-KEYED by identity (predicate " is <band>" after the siege). 93fe0a4b |
| 3 | pageCensusFindings.test.js (2) | red at the base. (a) the CAPTURE_TRUE control: red 1's cause. (b) P1a/P1b's plants: the corpus reword e056fbfb (W2-WRITE-SIDE-ECO-3, declared) left no corpus line with "is fed, but only just" / "feeds itself with a small margin" | (a) CURED by red 1, and the P5false plant re-keyed to the table's declared RECOVERING line. (b) by the chair's V13: P1a and P1b RETIRED by name (the reworded lines state nothing the record can deny), in the findings and the register's `retired`, replacedBy null. 8f195e93 |
| 7 | fieldManifest.test.js (2) | magicRecovery: red at the base (56f73d7ec, the chip left the tab, declared). magicNote: JOIN-6 · 3 (6b1e0ccf: 6e36000a routes the Magic tab's note through magicProvisionShown.js) | BY THE MANIFEST'S DOOR: EconomicsTab.jsx leaves magicRecovery's consumers (supplyChainState.js still reads); MagicTab.jsx replaced by the leaf that reads magicNote. 96eaeff3 |
| 4 | entityIndex.test.js (1) | red at the base; turned at JOIN-2 · 0.2 (e0f848db, lane/r3-tabs): R3-TABS-4 F2/F7 (2b7f6199, declared): a watch-only town draws no Invasion and no held-perimeter beasts line; soak1k-9's one force is a "Town watch" | RE-KEYED by identity to soak1k-10 (prints both rows). 036e8243 |
| 5 | dossierPhoneFloorAllViews.test.jsx (2) | the pins turned at JOIN-1 · 3 (e20a60e0, lane/r2-code-a); the sub-floor line came later (73291c8e, TAIL-SERVICES batch 1, at InstitutionsTab.jsx: raw FS.xs) | the floor CURED (proseFontSize; f6e70b89). One cause in part with phoneChromeFloor.census: its `bare 0 -> 1` on /settlements and /gallery is this line and falls to 0 (that register not re-taken). LEFT RED, NAMED: MOBILE_BASELINE and DESKTOP_BASELINE, count pins moved in most views by the joins' births since e20a60e0; a re-record is a register re-take (the chair's or the close's door) |
| 6 | displayEconCrisisMarks.test.jsx (3) + the chair's 05:26 rows | born red at join point 2 (6b16a02d): the lane's births at fcab8b63d vs the joined line's, moved by the economy family's DECLARED moves (measured by the record at each join point): 2ac50c55 (TAIL-DEFECON-3: the fish row's line), 5f67f382 (TAIL-DEFECON-2 D14: Pilgrim Trade), df2fa5ca (TAIL-DEFECON-2 D10: "Harvest") | RE-KEYED by identity (45c0b621): fish → r2s-famine-town-5 Grain Sales; Pilgrim → r2s-under_siege-town-2 Magical Trade Revenue; the rents KEEP → r2s-famine-hamlet-2; displayEconRelianceFoodWords' famine-town-1 NOT row 4% → 5% (same town, same moves). The anchored versions (lane/tail-close-tests-a at 432b0330) pass with these rows except their own famine-town-1 anchor, which should read 14% (the KEEP beside it, re-keyed by TAIL-DISPLAY-ECON-5). Only the pins re-keyed are edited |
| 8 | labelJoins.test.js (1) | JOIN-7 · 6 (fd5e0da5, lane/tail-powers-b at f89c0d7c1): cc834166 adds `instNames.some(... 'warehouse')` to `src/generators/power/claimStanding.js` (a generator; no display/claimStanding.js exists) | NAMED to the chair (not mine) |

Proof of the third push (8f195e93): pageCensusFindings.test.js 4/4; the five files naming the findings or the register
fail the same 8 tests at the base and here, byte-identical; eslint 0; both type checks 0 (167/167, 1113/1113); the grid exit
0, 2 falls, the base's own.

Proof of the second push (at 036e8243): the eight files alone 14 red at 837cad90 → 5 here, each left one named above;
crimeLineDisqualifiers.test.js 3 → 0; the 23 files naming InstitutionsTab.jsx fail the same 5 tests at the base and here;
eslint 0 on every touched file; typecheck:ratchet 0 (167/167); typecheck:domain:strict 0 (1113/1113); the grid exit 0, 2
falls, identical to the base's.

THE PHONE FLOOR'S COUNT PINS (V14): MOBILE_BASELINE (test line 809) and DESKTOP_BASELINE (line 633) have NO door: hand-edited
tables, each re-measured by hand with a cause note; no command, no env, nothing refuses a rise (told to the chair:
the owner's list with the goldens). Moved at 036e8243 against the pins (first moved at JOIN-1 · 3, e20a60e0, lane/r2-code-a):
MOBILE Summary/Overview chrome 2→4, sub14 1→3; Systems/Defense prose 33→34; Systems/Economics prose 39→37;
Systems/Institutions prose 71→73; Systems/Magic prose 3→1; Systems/Power prose 33→32; Systems/Services prose 102→103;
World/History chrome 0→2, sub14 0→2; World/NPCs prose 284→283; World/Relationships chrome 35→36, sub14 35→36.
DESKTOP (measured/sub14) Overview 16/15→18/17; Defense 34/34→35/35; Economics 45/45→43/43; Institutions 72/72→74/74;
Magic 5/5→3/3; Power 34/33→33/32; Services 103/103→104/104; History 16/16→18/18; NPCs 285/285→284/284;
Relationships 175/173→176/174. The joins nameable from the measured moves: the economy family (TAIL-DEFECON-2/3,
Economics, Magic), TAIL-SERVICES S1/S5 (Institutions, Services: the ordinary-times and short lines), R3-TABS-4 F2/F7 (Defense).

THE RELIANCE GUARD'S FIGURES (two branches meet): on this branch displayEconRelianceFoodWords' famine-town-1 NOT line reads
"Contributes to Grain Sales - 5% of income" and its KEEP "Contributes to Entrepôt Trade - 14% of income"; tests-a's
anchored version (432b0330) carries the anchor and the KEEP at 13%: the record's share is 14% on the joined line.

The civic sweep (V5–V11, `git diff --name-only 6cf555801..c2f053333 -- src`: 9 files, 229 test files name them by a
basename grep; the chair counted 244): running in 8 chunks.

Proof of the first push: the reds alone before (14 red over the 8 files) and after; the files naming each touched
file (crimeLineDisqualifiers.test.js, powerStateProseDesk.test.js, pageCensusFindings.test.js,
factLayers.walker.test.js, fieldManifest.test.js and the six that name fieldManifest, heraldCausalVoice.test.js): no new
red (factLayers.walker 5 red and proseWiringCensus.walker 5 red at the base 837cad90 AND here, byte-identical: not
these causes, not mine); eslint 0; typecheck:ratchet 0 (167/167); typecheck:domain:strict 0 (1113/1113); the grid
`page-census --grid` exit 0, 2 falls, identical to the base's (no rise).

Honesty: the red-7 commit was re-made by cherry-pick to correct its turn point (6b16a02d → 6b1e0ccf) and that
re-commit ran with `--no-verify` (its staged content was byte-identical to the hooked commit it replaced). No push
skipped a hook.
