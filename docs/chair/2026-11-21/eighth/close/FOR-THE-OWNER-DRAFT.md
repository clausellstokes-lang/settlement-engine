# WHAT YOU WILL BE ASKED TO SIGN AT THE CLOSE (a DRAFT by CLOSE-1, from the rehearsal; the chair finishes it; 2026-11-22 15:06 UTC)

This is written for someone who does not read code. Each item says what changed, why, and where you can see it.
Nothing here is signed by any seat: every item waits for your word.

## 1. Two new rules for how a new place is born are switched on
- **Who rules.** Until now, a new place's government, the house holding its seat and the person sitting in it were
  one thing. Under the new rule they are read apart, so a guild, a temple or an army can hold the seat in the right
  circumstances (your words: "Every power group should be able to compete for leadership or the seat given the right
  circumstances").
- **Fortune.** Until now, a place's wealth and its ruler's standing were judged against every place of every size.
  Under the new rule a village is judged against villages and a city against cities. A ruler who has weathered a
  disaster gains standing ("the merit"). A second merit (a place's long history, "LASTING") is being built now.
- **What you will see.** Places born after the close read differently: some small places stand richer, some cities
  poorer, and some rulers are more or less trusted. **Places already saved do not change.** They keep the rules they
  were born under; this is tested.

## 2. The home page's sample town changes
The village shown on the home page (Cnocby, seed lf-033) is made by the real engine, so it changes with the rules.
Under the new rules (measured on the rehearsal tree): its ruler's public standing goes from 14 ("a crisis of
legitimacy") to 33. Its people's trust in each other reads "adequate, turning strained" instead of "strained, turning
critical". The temple's power reads 24 instead of 30. The first news line becomes "Cnocby turns to the faith of
Vael". **For your eye:** the chair re-makes the sample at the close and shows you its narration before it ships.
(A fault found by this rehearsal, that the sample was made differently from the "Forge this exact town" button, is
already cured and waiting to land.)

## 3. Numbers you set (the tuning tables), left as drafts
- **The contest for the seat** (SEAT_CIRCUMSTANCE_TUNING): how much a circumstance helps a group take the seat (a craft
  town helps the craft guilds, hunger helps the labourers). **Every factor is 1 today**, so the contest weighs nothing
  extra until you sign figures. The proposed figures (1.15 to 1.5) are written beside the table.
- **Fortune's numbers** (FORTUNE_LAW_TUNING): how many points each level of wealth is worth, the defence a place of each
  size usually has, and the merit's 10 points.
- **The second merit's ages** (coming with LASTING): how old a place must be, by size, to count as long-standing. Note:
  the hamlet's figure (108 years) is lower than the thorp's (269).

## 4. The goldens: the stored "this is what the engine makes" records — TWO SIGNINGS (CLOSE-2, measured 2026-11-22 by 18:12 UTC, written 18:17 UTC)
The engine keeps a fixed set of 525 sample places, each stored as a fingerprint, to prove nothing changes by accident.
Only you can re-sign one: the tool that writes them refuses unless your signed "shift record" (a short file under
`docs/shift-records/` naming the set and how many rows move) exists. No seat writes one. Both sets below show red, by
name, until you sign: never a silent pass.

**Signing 1: the OLD set (`generator-golden-master`), re-signed.** It births places the old way (without the new rules),
so switching the rules on does not move it; it stays as the proof that saved places come out the same.
- What moved: born today, NONE of its 525 places matches the fingerprints recorded on 2026-11-19, on the working line as
  it stands, before any switch. The line's own work since that day moved them (it is the one golden row already red on
  the line). The stored file keeps only fingerprints, so what changed inside each place cannot be read from it; the
  chair can have a seat birth the same places at the 2026-11-19 record's commit and today, and read three out for you,
  before you sign.
- Its row in `tests/fixtures/.golden-freeze-register.json` exists already; your act re-writes its fingerprint and names
  your word.
- The command, after your shift record exists (about a minute here):
  `GOLDEN_SHIFT_SIGNED=docs/shift-records/<your record>.json UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js`

**Signing 2: the NEW set, the "lit twin" (`generator-golden-master-lit`), signed for the first time.** The same 525
places, born the way the product births a NEW place under the switched-on rules.
- What moved, against the old way, born on the same tree: **all 525** (thorp 84, hamlet 84, village 84, town 105, city
  84, metropolis 84). Inside them: the powers and their strength in all 525; the crisis's powers in 516; a place's
  wealth in 330; who holds the seat in 74. Three read out:
  - a forest metropolis far from the roads (Suryaganj): wealth Comfortable becomes **Poor** (a great city judged against
    cities); the City-State Council's seat passes from the Craft Guilds to **the Merchant Guilds**; nine powers become
    seven.
  - a riverside hamlet (Schwarzwalde): wealth Poor becomes **Comfortable**; the ruler's standing 38 (Contested) becomes
    **58 (Tolerated)**; the Feudal Stewardship becomes the hamlet's only power.
  - a plains town on a river route (Schwarzwalde): wealth Moderate becomes **Comfortable**; standing 48 becomes **68
    (Approved)**; seven powers become four.
  (The metropolis is re-read by CLOSE-2's own run; the hamlet and the town are the builder's reading.)
- **One step comes first, and it is part of your act:** a NEW row for `generator-golden-master-lit` in
  `tests/fixtures/.golden-freeze-register.json` (its file `tests/fixtures/generator-golden-master-lit.json`, its test
  `tests/property/generatorGoldenMasterLit.test.js`, 525 rows, your word as its owner line), written by whoever you have
  carry the act out; the tool refuses the set without it.
- The command, after your shift record and that row exist (about a minute here; the run then fails ON PURPOSE, which is
  the tool saying "written"; the same command without the two settings, run again, shows green):
  `GOLDEN_SHIFT_SIGNED=docs/shift-records/<your record>.json UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMasterLit.test.js`
- Where to see it: `close/OWNER-GOLDEN-LIT.md`.

## 5. Sizes (how much the app downloads)
The first screen's download stays as it is on the working line today (already above its budget before this close;
those rows wait for your size sign-off). The background generator grows by about 2,300 bytes under the new rules
(PLAUSIBLY the switched-on code itself; to be measured exactly). The figures, beside their budgets, are in
`FLIP-CENSUS.md` part 3.

## 6. What the seats re-record without you (listed for you to see, not to sign)
About 200 test values are pinned to what the old rules produced: a sentence on a named town, a count, a seed chosen
because it once showed a case. Switching the rules moves them. They are re-recorded by their own tools with the
reason written down. None of them is a golden or one of your numbers.

## 7. Faults found by the rehearsal
- **One fault, fixed inside the switch itself**: under the seat rule, a list of the town's powers read facts the
  engine's ordering rules did not allow for that list; one line of that bookkeeping is changed in the same step as the
  switch, so nothing on a page moves because of it.
- **One worry that turned out not to be a fault, and a proposal for you to decide after the first deploy**: three small
  places born under fortune had a crisis (a slave revolt, a war) with no group of that crisis among their powers. Measured
  on 900 places, this happens just as often under the OLD rules (509 places old, 508 new): it is how the existing rule
  for the number of powers a place keeps has always worked (a rule you signed); the new rule only changes which places.
  The fortune seat has a built change that would always seat a crisis's own group; it alters that signed rule, so it is
  **yours to decide, after the first deploy**, not part of the switch.
