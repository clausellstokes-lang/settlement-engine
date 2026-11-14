# REVIEW-R3-TABS-3 — step 1, COLD: every line the stage 30157258..68e9e97b5 made print, and every silence it made, read where it prints

Written and pushed BEFORE I opened the lane's hand-back or any commit message of the range. I worked from the diff only
(`git diff 30157258..68e9e97b5 -- src/`: `DefenseTab.jsx :: ForceCard` and `defenseStateProse.js :: withinTheBar /
AGAINST_THE_BAR / silentUnderAnOccupation`). The stage has no merge. It moves no record: the 1,536 births (the first
reader's `seeds1536.txt`, `births.mjs`) are byte-identical at base and tip (sorted stream sha256 5fac254a…).

Instruments (probes under `probes/REVIEW-R3-TABS-3/`, run from outside every repository tree):
- the Defense desk (`desk.mjs`, the first reader's) at base and tip over all 1,536;
- the PDF print prose (`printdiff.mjs`, the second reader's), diffed by `pdiff.mjs`;
- the rendered pages (`render.sh`, the first reader's) of the 78 towns the stage moved, at base and at tip. I diffed
  every tab of the whole page with `pagediff2.mjs`. The rest of the 1,536 tip pages were still rendering for step (ii)'s
  sweep when this was written;
- the PDF Defense chapter's leaf text (`pdfprobe.census.jsx`: `DefenseSecurity` executed, as `tests/pdf/defenseCriminalNoteOnce.test.jsx` does) and the Foundry journal (`buildJournalPages`, `surfaces.mjs`).

**What moved, by my run.** The desk: 64 `posture.posture` GONE and 7 `threat.invasion` GONE, and nothing else. The PDF
print prose: 64 `defense.postureHeader` GONE and 7 `defense.threatAssessment` CHANGED (the Invasion sentence and its
supply clause leave the paragraph), and nothing else. The pages of the 78 towns, every tab: on the Defense tab, 14
"Town gates" are NEW and 14 "Gates (if walled)" GONE; 71 lines are GONE (64 posture lines and 7 Invasion lines). No
other tab moves. The Tonight sheet and the Foundry journal do not print the posture or Invasion lines.

## A. The one line that now prints: the force card's house label

| Line | Where (file · function · condition) | Towns (all it prints in) | Verdict |
|---|---|---|---|
| **"Town gates"** (the card title; was "Gates (if walled)") | `DefenseTab.jsx :: ForceCard` → `institutionDisplayName(i)`, for each force in `defenseProfile.institutions` whose key the label seam maps. Of every force name on the 1,536, only `Gates (if walled)` changes | 14 of the 1,536, every one a walled **town**. The smallest is Shattkarez (r2s-famine-town-3, 737, famine) and the largest Dar-al-mandi (rr3-town-occupied-rand-4, 2,465, occupied). Two are wartime (Markazzamin, Fengan), one an insurgency (Ardbridge). Plus a siege town I birthed for it: Nordey (rr3-town-under_siege-rand-9, 2,444; 4 of 40 extra siege births carry the key) | **TRUE in all 15.** I read each card under its own "Town walls" card. The noun "Town" is true, because the key exists only at town tier on these births, and walls stand in every one. The same house prints "Town gates" on the Institutions, Power and Services tabs and in the Crisis "What the players see first" line, so the card now agrees with the roster. |

**Twins the cure did not reach (the ruling it cites says "NO SURFACE"):**
- **The PDF's Defense chapter** (`src/pdf/sections/DefenseSecurity.jsx`, which prints `force.name` raw) prints **"Gates (if walled)"** in all 14 towns. In 9 of the 14 it is followed by a **"FORCED"** badge. That badge is `force.source` 'faction_boost' etc. printed as provenance: the ruling b1 the tab's provenance guard holds. EXECUTED (`out/pdf.gates.txt`). False at the base too: CARRIED.
- **The Foundry journal** (`src/foundry/journalPages.js :: defensePage`) prints "- Gates \(if walled\): Controlled entry points with gatekeepers. \(faction\_boost\)" in all 14. Every force line carries its provenance in brackets ("(generated)", "(required)", "(coherence_repair)", "(cascade)"). EXECUTED (`out/surfaces.gates.txt`). CARRIED.
- **The Crisis tab's "Levers" list** (`src/domain/crisis/crisisPage.js` levers → `l.institution` raw) prints **"Gates (if walled)"** on the screen. Rundfeld (r2s-monster_pressure-town-3) has it under "Town walls", three lines above "Defence: Town walls, Town gates, …" on the same tab. Nordey has it too. EXECUTED (pages). CARRIED.

## B. The silences: the posture row under an occupation (64 towns; `silentUnderAnOccupation`, any `stress[].type === 'occupied'`)

At the base, all 76 occupied towns of the 1,536 had a posture key: 64 printed a line and 12 were already silent (the
strong pool struck). At the tip, 0 of 76 print one. Each of the 64 silenced lines was read on its own base page against
the "Military status · Under occupation" block printed two rows below it. Every one of the 64 pages carries that banner,
and one of three force sentences:
(troops) "The occupiers' troops at X protect it from everyone except the people who sent them."
(arms) "X's defence answers to its occupiers now: the arms in the T are theirs, and whatever the townsfolk could raise themselves would be small beside them."
(order) "As long as the occupation lasts, X cannot defend itself on its own terms; its defence is someone else's to order."

| Silenced line (pool · variant) | n | Beside | Verdict |
|---|---|---|---|
| ADEQUATE ("{S} is covered against what it is likely to face…" 5; "To anyone arriving, {S} looks defended in the ordinary way…" 1; "People at {S} expect to hold against the usual trouble…" 4; "{S} has enough for the usual trouble and nothing spare…" 2) | 12 | troops 3, arms 3, order 6 | **FALSE (MED, c/g)** in all 12. The line says the town holds against trouble on its own. The banner says its defence is the occupiers'. This is R1/C3's class. Example: Muulcoba (rr3-town-occupied-rand-1). |
| WEAK v1 "{S} could deal with a brawl or a thief, but the {T} could not hold off a raid." | 32 | troops 9, arms 15, order 8 | **FALSE (MED, g) in 24**: "could not hold off a raid" beside "the occupiers' troops … protect it from everyone" or "the arms in the {T} are theirs". 3 of these sit beside an **Adequate** Invasion & War bar (r2s-occupied-city-0, rr3-metropolis-occupied-rand-4, rr3-town-occupied-rand-3). **DOUBTFUL (LOW) in 8** beside "(order)": that banner names no occupying force, and the line agrees with the Critical bar beside it in all 8. |
| CRITICAL v1 "{S} is all but undefended. Nothing in the {T} would stop a serious attack for long." | 20 | troops 4, arms 4, order 12 | **FALSE (MED, g) in 8**, beside "troops" or "arms". Example: Terrapolis (r2r-thorp-1): "Terrapolis is all but undefended" two rows above "the arms in the thorp are theirs". **DOUBTFUL (LOW) in 12** beside "(order)", each beside a Critical bar. |

**The posture silence takes NO line I can read as true.** 44 were false at MED and 20 doubtful at LOW: each agrees with
its own Critical bar but presumes the town defends itself while "its defence is someone else's to order". A narrower
condition (strike only where the banner names the occupiers' troops or arms) would keep those 20 doubtful lines and no
certainly false one. I would not narrow it: no certainly true line is lost.

## C. The silences: the Invasion row beside its own Critical band (7 towns; `AGAINST_THE_BAR.CRITICAL`, `scoreBand(scores.military) === 'CRITICAL'`)

At the base, 479 Invasion lines printed beside a Critical bar on the 1,536; 6 carried the hold/deter claim (my regex,
the guard's own CLAIMS). At the tip, 472 print and 0 claim. The 7 silenced rows were read on their base pages. The
Invasion row's supply clause (`rungWith`'s `said`) is silenced with its row.

| Town | Silenced sentence(s) | Facts beside | Verdict |
|---|---|---|---|
| Warmstadt (r2s-occupied-thorp-0, 13), Terrapolis (r2r-thorp-1, 30), Olympnea (r2r-thorp-27, 25), Bhagagiri (rr3-thorp-occupied-rand-5, 14) | "Walls at {S} with townspeople behind them: credible against raiders, and inadequate against anybody who arrives professionally and brought siege gear." | Palisade + Household levy; Invasion & War 3–11 Critical; occupied ("the arms in the thorp are theirs") | FALSE (MED, g) ×4 |
| Makropyrgos (rr3-thorp-occupied-rand-1, 24) | "The walls and townsfolk of Makropyrgos would see off a raid but not a proper army, and nothing now under way will change that." | same; Critical 11; occupied | FALSE (MED, g) |
| Dar-al-mandi (rr3-town-occupied-rand-4, 2,465) | "Approaching Dar-al-mandi, you see the walls and the soldiers who belong on them, and any attacker would think again about the cost." **+** "Dar-al-mandi's defenders are a little worse off every month the trades behind them keep failing." | Critical 18; occupied; "The garrison and town watch exists on paper"; `chainModifiers.military` −5 | first FALSE (MED, g/c; C2's class); **the supply clause TRUE (−5 on the record): a true line lost** |
| Shivamandal (r2s-succession_void-town-0, 1,089) | "You see armed fighters at Shivamandal and no wall for them to stand behind, so any fight would happen wherever the attacker chooses." **+** "The supply book for Shivamandal's defenders runs short: the trades that should feed and equip them are failing, so the defence is weaker than its numbers suggest." | Barracks + Town watch, "Unfortified"; Critical 11; `chainModifiers.military` −5 | **both TRUE: two true lines lost.** Under its own Critical band the town is unwalled with a force, and its supply is short |

**The Invasion silence takes 3 true sentences in 2 towns.** They are Shivamandal's v3 and its supply clause, and
Dar-al-mandi's supply clause. Against them it removes 6 false. A narrower condition would have kept Shivamandal's two
and no false one: strike by variant, since in 'force with NO walls' only v1 ("It answers raiders well") claims a hold,
and v2 and v3 are true beside Critical. Dar-al-mandi's clause is lost with any strike of its row while the clause may
not stand alone. Beside Critical, the two kept-whole pools' lines ("walls with NO force", "militia only", "neither walls
nor force") were not read here: the stage did not change them.

## D. Other checks of step 1

- **A twin without its sibling's condition.** The occupation strike reads `stress[].type === 'occupied'` alone. On the
  78 pages read, the banner "Under occupation" prints on exactly the 64 occupied towns among them and on no other
  (the whole-1,536 sweep is in the review). The Critical arm reads `scoreBand(scores.military)`, the same key the chip prints.
- **A slot that prints a catalogue label:** "Town gates" is the seam's label. The bracket twins are listed in A.
- **A line that says how the model works:** none new.
- **Code (not a sentence):** in `defenseStateProse.js` the L2 docblock ("…are silent there…", `@type
  {ReadonlySet<string>}`) now sits orphaned directly above the new `AGAINST_THE_BAR` docblock. The set it typed is gone.
  LOW, not a page fault.

## Count

Lines read where they print: 1 new line in 15 towns (TRUE); 71 silenced rows in 71 towns. Of those, 50 FALSE (MED) are
removed: 44 posture and 6 Invasion. 20 doubtful (LOW) posture lines are removed. 3 TRUE sentences are lost: one row's
two sentences and one supply clause. **False at high or medium in what the stage now prints: 0.** CARRIED twins at HIGH:
3 surfaces still print the bracket the stage removed from the tab (the PDF and the Foundry journal, each with
provenance tags; the Crisis Levers).
