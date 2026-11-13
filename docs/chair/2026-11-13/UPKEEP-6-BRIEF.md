# COHERENCE-UPKEEP-6: the ready brief for the follow-on seat (written by UPKEEP-5, 2026-11-13)

**The lane:** `lane/coherence-upkeep-2026-11-12`. Build on its tip. The fifth seat's record is the top part of `docs/chair/2026-11-12/UPKEEP-HANDBACK.md`. The measure that every item below stands on is `docs/chair/2026-11-13/UPKEEP-DEFENCE-PARTS.md`, with its two addenda. The probe is `docs/chair/2026-11-13/probes/UPKEEP-5/` (`parts.mjs`, `births.mjs`, README):
- it births the 3,036 measuring births;
- variant `V4` is V3 as built;
- variant `V4C` adds R12's conditions as proposed.

**Why a sixth seat:** the fifth seat built V3 and stage two's F2, F3 and F5 inside its context guard. It said early that these items would not fit (its messages to the chair of 07:5x and 08:1x). Nothing here was started in `src/`.

**The laws are the fifth seat's** (its brief, unchanged):
- red first, one cause per commit;
- at every `src/` commit: the domain-strict check, the type ratchet and eslint;
- every claim made on births you did not tune on;
- a count that falls is not a cure;
- never read a gate through a pipe;
- registers only through their doors; no baseline banked upward; never `--tighten`.

## In this order (the chair's record 323)

### 1. R17: THE KIND OF WALL COUNTS
The walls part is scaled by the wall's kind, read from the roster's defence home `src/domain/institutions/defenseInstitutionBuckets.js` (whether V3 already returns the kind there is said in the hand-back).
- Stone: today's full value (no stone-walled birth moves).
- Palisade: 0.6 (starting weight).
- Earthwork (bank and ditch): 0.4.

**MEASURE FIRST:**
- every roster name that sets "walls", with counts by size;
- what a citadel or a keep is on the roster: a kind of wall, or a house of its own that no term reads;
- the births that change band, by size.

The weights go in the defence weight table (`src/data/defenceWeights.js` or as V3 named it), through the tuning register's door.

### 2. R16: WAR DRAINS
Wartime enters the crisis table as one more row. It takes **15 economic points** from what SUSTAINS (the stores, the purse, the market) and leaves who stands and what is built alone. The 15 is a starting weight, for the owner's veto, in the weight table.
- **Today** wartime touches no part. Its only reach was the capped label, and V3 removed that (the parts doc, finding 4, R4).
- **MEASURE:** its mean cost on unseen births, and the wartime births beside today and beside V3.

### 3. R12: THE NAMED CONDITIONS (the owner's word, record 321, ruled by the chair)
Derivation sets the FLOOR and CEILING of a part. A CONDITION of the body or work decides where it stands between them.
- **Which parts:** garrison, militia, watch, hired company, adventurers' charter, wardens, the walls, and the armed households of small places.
- **The condition:** below, ordinary or above. The fifth seat measured odds of 0.2 / 0.6 / 0.2 and a step of a tenth of the part (second addendum: mean move 0.34 points, p95 1.26, 0.2% over three points, 63 band changes in 3,036). The wall's kind (R17) sets the range its condition moves in.
- **The facts close "above":** walls unmended; a bought body the place cannot pay (bought < 0.6); a paid body below full pay (funded < 0.7); any standing body a crisis in force takes from. A condition never contradicts a line the page already prints about that house, and it names the body or the work, never its leader.
- **The record:** drawn ONCE at birth on ITS OWN REGISTERED FORK, stored on the house's own record, read through ONE leaf.
  - It moves no existing draw: the fork census proves it, its figures re-keyed with the cause.
  - An old save without a condition reads ordinary.
  - An edit or a regeneration of another section never re-rolls it (name the test).
  - The veil treats it as part of the house's row. The exports and the PDF carry it, or the writer-reach register is answered through its door.
- **The proof of "derived"** (strip defence, recompute, equal) still holds: the condition is the house's fact.
- **Words:** one short line per condition per part, written to the SOP. Ordinary prints nothing. Each line prints on the Defense tab's part line and on the house's card. All are listed for the owner's veto.
- **Measure, in the addendum's form:** sameness with and without conditions, the spread, and the bands moved by condition alone.

### 4. STAGE TWO, LEFT: F7 and F4 (the hired company's and the crisis lines; `src/generators/safetyProfile.js :: keptGuardLine`)
Under V3, PAY READS THE STANDING LABEL (`economicState.prosperityStanding`), so a crisis no longer reaches pay through the label.
- **The caller today:** `keptGuardLine` is called from `src/generators/economy/economicState.js` (after prosperity) with the SHOWN label. Read V3's tip to see whether it now passes the standing one.
- **F7:** the hired company's line READS THE LABEL. At least two true readings, paid in full (bought ≥ 0.6, Moderate and up) and paid short (≤ Poor), must be reachable and counted.
  - The mercenary pair ("There is no standing guard; a hired company is paid …" / "… the coin to keep it runs short …") printed on 0 of 660 + 1,288 births (the review's F7): every born mercenary stands beside a watch. Make it reachable by its true condition, or remove it with its reason.
  - The charter-hall line is one line for every label up to Comfortable: give it a twin keyed ≥ moderate against ≤ poor.
  - "Hired swords back the garrison when the purse allows" is keyed ≤ comfortable: re-key it on what the place can pay.
- **F4:** "…paid from what the hunger leaves" prints in sieges with no deficit. Under V3 the crisis lines' premise (the crisis caps the label that sets pay) is gone. Decide:
  - re-word them against the standing label the R3 rule asks the page to show, e.g. "…paid as it was before the famine" / "…before the siege"; or
  - retire them with their reason.

  The chair's ruling of 2026-11-12, point 1 ("never call the place poor when the crisis is why") must still hold. Count lines removed, and how many were true.
- F5 is DONE (2d88c66c4).

### 5. STAGE TWO, LEFT: the census low line
The review's F8: the 95 towns that entered census row 2 at the fourth seat, CLASSED.
- The fifth seat re-took the census, base 69b53decd against its final tip. Its class table is in the hand-back.
- If a row-2 entry class is still unnamed there, name it.

### 6. PROSPERITY (f), with R12(i), LAST
Stage one (f) for prosperity: measure and show, BUILD NOTHING. The census of its terms is done: `docs/chair/2026-11-13/probes/UPKEEP-5/census-prosperity.md` (35 terms: CONTRIBUTION 6, CAP/FLOOR 12, PENALTY 14, SET 3; DERIVED 32, DRAWN 1, WEIGHT 2). Notable points in it:
- the famine acts on prosperity four times;
- the food surplus bonus always adds 0 (`Math.round(0.4)`, `prosperity.js:319`);
- the one draw is the Subsistence branch (`prosperity.js:185`).

What is left:
- the itemised form (prosperity as the sum of its named contributions, a crisis acting once);
- the labels it gives against today's, by size, on the same 3,036 births;
- the eight towns' sums;
- R12(i): class the Subsistence draw (what it decides, its range, whether the page gives it a name).

Put it in `UPKEEP-DEFENCE-PARTS.md` as its own part. One message to the chair when pushed.
