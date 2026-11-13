# REVIEW-UPKEEP-2, third read — the cures, `lane/coherence-upkeep-2026-11-12` at 65cb03ef1 (base 9fccbd8ed)

> Read cold: every finding below was EXECUTED on my births before any commit message, hand-back or note
> of the builder's was opened. Nothing here is TOLD by the builder. The births: the same 1,200 seeds as the
> first read (`rv2-<crisis>-<size>-<i>`), rendered on every surface at 9fccbd8ed and at 65cb03ef1, plus
> 210 fresh births in the app's own shape (`fresh.seeds`: every one of the fifteen crises × village, town,
> city, metropolis × 3, and five pairs of crises × town, city × 3), plus the ten towns born on master
> (db832c892) and stored as JSON.

## VERDICTS

| Cure | Verdict | Worst finding |
|---|---|---|
| **1(b)** the money line and the guard lines read the standing label | **NOT CLEAR** | HIGH: the PDF's money line and the Defense tab's Economic Survival line now say opposite things on 83 of 1,200 births (0 at 9fccbd8ed), calm towns included |
| **1(a)** the page says both labels | **NOT CLEAR** | MEDIUM: the player-facing realm register reads "A poor town, at peace. Moderate before the war; Poor while it lasts." |
| **Ruling 2** the parts computed, never stored | **CLEAR** | — |
| **Ruling 3** a crisis's crime is a row of the crisis table | **CLEAR** | — (one LOW observation) |

Findings by rank: HIGH 1 · MEDIUM 3 · LOW 6.

## HIGH

**1b-H1 — two homes for "what can it pay in a crisis", and they disagree (EXECUTED).** The PDF's money
line now reads the standing label (`threatAssessment.js :: moneyRungOf`, keep rungs), while the Defense
tab's Economic Survival line still reads the economic score's band. On 83 of my 1,200 births the two say
opposite things; at 9fccbd8ed, 0.
- 34 births: the tab says the money is deep, the PDF says it is short. `rv2-calm-town-20` (calm,
  Comfortable): tab *"The town could go through a bad season with its arrangements intact"* (Strong); PDF
  *"Money enough for a short crisis; a long siege would start eating the reserves within months."*
  Also `rv2-calm-town-10`, `-16` (Moderate). 13 calm, 10 succession void, 9 wartime, 1 famine, 1 siege.
- 49 births: the tab says the money is short, the PDF says it is deep. `rv2-calm-town-0` (calm,
  Prosperous): tab *"Shripura can pay for a crisis of the ordinary length; a few months into a longer one,
  the money would run out."* The PDF row reads **"Economic Survival — Adequate — Money enough to ride out a
  long crisis: emergency measures can be paid for, and the defenders kept paid while it lasts."** On the PDF
  itself the band word (Adequate) and its sentence now disagree. 21 sieges, 14 famines, 7 voids, 4 calm,
  3 wartime.
- The cure also changed the PDF money line on 70 of 240 calm births, which no crisis touches.

## MEDIUM

**1a-M1 — the realm register says "at peace" and "before the war" in one line (EXECUTED).**
`heraldRegister.js :: gazetteerRows`, player view, a wartime town in a campaign with no war on the map:
`rv3-wartime-town-0` → *"A poor town, at peace. Moderate before the war; Poor while it lasts."* The
register's war word reads the campaign's map. The new sentence reads the town's own crisis. On this
player-facing row the new sentence also names the crisis (the betrayal, the split between the powers,
the debt crisis, the conversion), which the row did not name before. The Overview's public and player
views already show "Active crisis …", so nothing hidden is revealed there.

**1b-M2 — "hired swords" where none are hired: the ruling's own clause is not met (EXECUTED).** Ruling (1)
says *hired swords only where a company is on the roster*. The 7 births of the first read still print it
at 65cb03ef1, each with a charter hall and no contracted force. `rv2-under_siege-town-1`: *"Hired swords
back the garrison."* `rv2-wartime-town-9`, `-10`, `rv2-under_siege-town-4`, `-15`,
`rv2-succession_void-town-2`: *"Hired swords back the garrison when the purse allows."*
`rv2-famine-town-8` too.

**1b-M3 — the town's purse beside its people's hunger (EXECUTED; the ruled design's residue, for the
chair).** 202 births print *"No one can earn a normal living while the famine lasts, and every coin goes
on food."* or *"The war takes most of the money"* beside *"Money enough to ride out a long crisis"* /
*"can pay its way through it"* (181 at 9fccbd8ed). The two-label line now stands on the same page
(*"Prosperous before the famine; Struggling while it lasts."*). It explains the label. It does not
reconcile "every coin goes on food" with "money enough to ride out a long crisis". Example:
`rv2-famine-city-0`.

## LOW

- **1b-L1 (EXECUTED):** 3 births print *"Hired swords back the garrison when the purse allows."* (standing
  ≤ Comfortable) beside the tab's *"accounts have money in hand"* (the score's Strong band):
  `rv2-under_siege-city-2`, `rv2-wartime-city-26`, `rv2-succession_void-town-2`. The guard's threshold and
  the bar's band differ at Comfortable.
- **1a-L2 (EXECUTED):** an event read as a spell of time. *"Poor before the betrayal; Struggling while it
  lasts."* and *"Poor before the conversion; Struggling while it lasts."* (`rv3-recently_betrayed-village-0`,
  `rv3-religious_conversion-village-0`). A betrayal does not last. *"before the migration … while it lasts"*
  reads acceptably.
- **1a-L3 (EXECUTED):** the line names every active crisis, including one that lowered nothing. Succession
  void alone never lowers the label (0 of 12 fresh births), yet it is named: *"Moderate before the debt
  crisis and the succession crisis; Poor while they last."* (`rv3-indebted+succession_void-town-0`);
  *"Poor before the succession crisis and the famine"* (`rv2-succession_void-thorp-26`). The fallback noun
  reads *"Comfortable before the famine and the crisis; Struggling while they last."* (a record with
  `famine` and an unknown type, called directly).
- **1a-L4 (PLAUSIBLE, from the PDF's text order, not from a rendered image):** on the PDF cover the
  sentence follows *"SAFETY / Desperate — Active Siege / Defense: Fortress"*; in the Overview it follows
  *"Stability / Critical (under siege)"*. It may sit away from the word "Struggling" that it qualifies.
- **R3-L5 (EXECUTED, as ruled):** famine and siege now act on order through two entries of one row (their
  `int` points and their `crime` factor). That is within the ruling's "a row of the one table", but it is
  two effects on one score.
- **R3-L6 (EXECUTED):** `provisioned`/`unprovisioned` are SUSTAINS parts that carry military points, so a
  supply-only crisis moves the military score by a hair through limit 1 (mean −0.03 under wartime).

## What holds (EXECUTED)

**1(b)**
- The first read's H2 class (a short-purse guard line beside a can-pay line) falls from 129 at 9fccbd8ed to 3.
- H1 as first defined (a can-pay line beside a printed Struggling/Poor label) is 207. Every one now carries
  the two-label line: 0 without it, against 168 at 9fccbd8ed.
- "Hunger" prints only in a famine: 0 exceptions on 1,200.

**1(a)**
- On the 714 births where the labels differ, the line prints on the Overview, the Economics glance, the PDF
  and the Foundry journal: 714/714 on each.
- On the 486 where the labels are equal, it prints 0 times.
- No other surface prints the prosperity word (the hits on the Magic, Relationships and Services tabs are
  other words: "Moderate" availability, "Moderate tension", "Poor relief").
- The Tonight sheet prints no prosperity word. The Summary tab and the realm register print the line (samples).
- The TableView header was not rendered by me.
- Fourteen of the fifteen crisis nouns appear on my fresh births: siege, famine, occupation, split between
  the powers, debt crisis, betrayal, outbreak, raids ("while they last"), insurgency, conversion, revolt,
  war, migration, succession crisis. Infiltration never lowers the label. Plurals agree in all five pairs.
- A record in master's shape (no standing label) prints no line. The ten master-stored towns render
  identically on every surface at 65cb03ef1 and at 9fccbd8ed.
- A label a crisis RAISED prints nothing.
- Public and player Overview: identical line, and the crisis is already named there ("Active crisis …").

**Ruling 2**
- 510 births (the claims seeds and the fresh ones): the stored profile carries no `parts` (510/510).
- `defencePartsOf(stored)` sums exactly to the stored score (510/510).
- The stripped record recomputes equal (510/510).
- No part word or label in the stored record (510/510).
- Every one of the 1,200 tip dumps, export and grounding included, carries no part, source or point
  (0 of 1,200; at 9fccbd8ed the export carried `"parts"` on 1,200).
- The walker at 65cb03ef1 is green clean (13/13). Each of my plants reds it, on the planted line:
  - (i) a stored read;
  - (ii) `getActiveRng()`, which now reds where it stayed green before;
  - (ii′) `createPRNG(seed)()`, also now red;
  - (iii) a name test;
  - (iv) 0.37;
  - (v) `defenseProfile.parts` in the tab;
  - (v′) `JSON.stringify(s.defenseProfile)` in `worldExport.js`, also now red.

**Ruling 3**
- The crisis-once probe at 65cb03ef1: with the stress removed from the criminal reading alone, 0 of 40
  famine, 0/40 siege, 0/40 wartime and 0/40 succession-void births move. At 73b1304de it was 40/40 for the
  first three.
- Against 9fccbd8ed, only wartime births move: 121 of 240 rise by one whole point, the order score rises in
  236, and 7 change band (4 Undefended → Vulnerable, one each up to Defensible, Well-Defended, Fortress).
  No calm, famine, siege or succession-void birth moves.
- **Is the rise what the decided wartime means (the chair's record of 08:15, "war drains")?** Yes:
  - The same 236 single-crisis wartime records, with and without the war, at 65cb03ef1: the war never raises
    a town (0 rises; median −3, min −3, max 0), and it takes only supply (mean economic −10.5, order 0,
    monsters 0).
  - At 9fccbd8ed it also took order (−2.79) through the crime reading.
  - The rise is that second road closing. What remains is the drain the record decided: from what sustains
    the town, leaving who stands and what is built alone.

**New sentences 9fccbd8ed → 65cb03ef1**
- Every line no page at 9fccbd8ed, 73b1304de or 69b53decd printed (masked for names and numbers): 25
  distinct.
- They are the two-label line in its forms, and guard-assessment recombinations of existing clauses.
- None is machine-sounding. No points, sums, shares, weights, limits or slider names.

## Not measured
The TableView header (not in my harness); the PDF as an image; the earthwork row and rulings 4 to 8 (not
yet built); the builder's thirty-town read (not mine).

## Probes
In `docs/chair/2026-11-13/probes/REVIEW-UPKEEP-2/`:
- `render3.mjs` (any stress list, `rv3-<a>+<b>-<size>-<i>`)
- `classes3.py` (the classes plus the two-label checks)
- `cls3.{base,tip}.json`
- `scan.D.ndjson`
- `labels.mjs` + `labels.fresh.ndjson`
- `register.mjs`, `player.mjs`, `fallback.mjs`, `claims3.mjs`, `warnet.mjs`, `crime4b.mjs`
- `plant3.sh` + `plant3.*.log`, `walker3.clean.log`
- `fresh.seeds`, `newstrings3.txt`
