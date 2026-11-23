# SAVED AT THE STOP

# COHERENCE-VEIL — hand-back, part 31: the thirtieth seat (VEIL-30). Read with PART 30 (unchanged beside it): PART 30 section 1 (rulings 1-75) stays THE RULINGS IN FORCE; this part adds the state at the stop.

Seat: VEIL-30, branch `lane/veil-30-2026-11-20`. Assignment: `lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-30.txt`
and the chair's 22:19 UTC message (order: re-make the pool; reproduce both gates at the tip; read R3-TELL-3 and R3-TELL-4 whole
with 212 and the registry whole, re-run, merge in that order; then units (ii)-(vi) one builder at a time).

THE STOP (the chair, message queued 02:05 UTC 2026-11-21): "THE OWNER HAS ORDERED A SAVE AND A STOP FOR EVERY LANE ... start
nothing; commit and push what you and your builders hold to your OWN branches; write 'SAVED AT THE STOP' at the top of your
hand-back; send the chair nothing; stop for good." The file it names (`SAVE-AND-STOP.txt`) was NOT on origin/lane/chair-2026-11-08
when fetched (tip 94913687a); the seat followed the message's own short form. The account's weekly limit (429, resets
2026-11-24 15:00 UTC) had already stopped this seat's builder at about 22:3x UTC.

## STATE AT THE STOP
- THE LANE (`lane/veil-30-2026-11-20`): 2437ffea0 (VEIL-29's handed-over tip) + `--no-ff` merge of R3-TELL-3
  (`lane/veil-28-r3tell3-wip-2026-11-20` at 08b2eb957) as cca6656a6 + `--no-ff` merge of R3-TELL-4 unit (i)
  (`lane/veil-29-r3tell4-wip-2026-11-20` at 8c2f1669a) as 147eeb22f + brief R3-TELL-5 (a3eec1e76) + this record.
  212 on the lane NOW `1bfb961b165965f5b92cf7b55be844a12000d54ce954e08abbaf7c4f01b20d10`; rollback `8cbd7d1c…ded5b0`; 211
  `eface6d0…0b01` / `ce8474ff…712f` unchanged (sha256 read at the merge).
- THE MERGE IS NOT YET PROVED BY THE SEAT. Read: the whole diff 8508431da..8c2f1669a line by line (src, SQL, both test files,
  the restated analyzer, tell2.sh, the measure scripts, TELL4-HANDBACK) with 212 WHOLE (the character tables included) and the
  registry WHOLE beside it; no fault found in the SQL/twin parity of `people.allegiance` (`names` = both served lists' faction and
  name; houses = the served institutions' non-empty names; both engines delete the key on null, non-object, unlisted house or
  unserved power; the rule runs only where a house is hidden whole, both engines). RE-RUN: R3-TELL-3's RED at 95f2ddfb8
  reproduced (2 failed, 1 passed, `out/v30/red-t3-95f2ddfb8-tail.txt`); STOPPED BEFORE: R3-TELL-4's red at fff96514a, both arms
  green at the merge, the gates at the merge, the green chain (`out/v30/chain1.sh` is the whole list, one command). A SUCCESSOR
  RUNS chain1.sh FIRST (edit M to its merge checkout) and reads `done.txt` before anything else.
- A NOTE FOR (vi) (in the brief): `galleryVeilTell4`'s unit-1 tooth never asserts `keptServed > 0`, so it would pass with no kept
  allegiance served (the conditional-tooth class of ruling 53).
- THE COUNTS REPRODUCED AT THE TIP 2437ffea0 (212 1c15e3ac), on this container's pool (`/var/tmp/v18/t2/pool-t2sig-2`, re-made
  by `out/v30/chain0.sh`: part A 1,200, part B 608, every shard rc=0): the tip's own analyzer GATE-1 88 of 92 at every gated
  setting (= PART 30); the RESTATED analyzer over the same towns GATE-1 87 of 92 (7 LOWER BY RULE), GATE-2 34 of 40 cells red
  (`out/v30/tell2-table-tip-*.txt`). Instruments every exit 0, acceptance PASS (`out/v30/seated-exits.txt`). THE POOL IS NOT IN
  GIT: a new container re-makes it by PART 30 section 4 (~33 min).
- BUILDER R3-TELL-5 (`briefs/R3-TELL-5-BRIEF.md`, unit (ii) with its step 0 first): cut it from a3eec1e76; it was stopped by the
  weekly limit while reading; it wrote only an UNRUN step-0 probe and a template log. Pushed as `lane/veil-30-r3tell5-wip-2026-11-20`
  (unread by the seat, nothing built). Units (ii)-(vi) are NOT started.
- NEXT, unchanged (rulings 67, 73, 74 and the chair's 22:19 order): chain1.sh at the lane tip; the line to the chair with
  GATE-1 / GATE-2 at the merge; units (ii)-(vi) one builder at a time; then "R3 <commit>" at GATE-1 0 and GATE-2 0, IMPORT-DOOR,
  and PART 30 section 8's list.
