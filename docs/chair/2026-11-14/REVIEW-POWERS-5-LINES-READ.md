# REVIEW-POWERS-5: step 1. Every new or reworded line of 3909655c3..0ea65f574, read where it prints

An independent reader's list, written from the DIFF of the stage before I opened the lane's hand-back
(`POWERS-FOLLOW-UP-HANDBACK-2.md`), any other file under `docs/chair/` on the lane, or any commit message of the range.
I changed nothing on the lane.

**Subjects seen before this list was pushed.** My first `git log --oneline -3` printed the subjects of 0ea65f574,
8a19c8999 and 535b798c5, and each `git worktree add` banner printed the subject of the tree it checked out (0ea65f574,
3909655c3). I read no other message, and no claim from them shapes a verdict below.

**EXECUTED** throughout unless a row says PLAUSIBLE. Probes: `docs/chair/2026-11-14/probes/REVIEW-POWERS-5/`; outputs in its `results/`.

## The stage, the births and the instrument

**The stage's own change.** 20 first-parent commits after 3909655c3, **no merge** (`git log --merges` over the range is
empty), so the stage's own change is the whole diff 3909655c3..0ea65f574. In `src/` it touches eight files:
`components/new/tabs/PowerTab.jsx`, `domain/display/governingModifierWords.js` (new), `data/people/titleSecretsPresentations.js`,
`generators/people/poolMap.js`, `domain/people/patronage.js`, `generators/power/governanceNarrative.js`,
`generators/power/rulingStructure.js`, `generators/power/economyReconciliation.js`. Registers: `scripts/census/page-census.register.json`
and `tests/lint/.lighting-census-baseline.json`. Six test files. The rest is the lane's docs and probes.

**The births** (CENSUS-2's `births.mjs`; REVIEW-POWERS-4's `seedcfg.mjs` with its `r4` prefix widened to `r[45]`):
- **The census's 720**, born at the base and at the tip; rendered at the tip by CENSUS-2's `census2.sh` (every dossier view
  through the tree's own `OutputContainer`, as its owner sees it).
- **996 more in the app's own shape** (`selectedStresses`, `selectedStressesRandom:false`, `_randomizePriorities:true`), born at
  the base and at the tip: REVIEW-POWERS-4's 648 (`rww-`, `r4-`, `r4g-` under the grim profile) and **348 of my own `r5-`**:
  every size × calm, siege, famine, occupied, wartime, infiltrated, succession void, fractured, indebted and insurgency × 4,
  plus six more sieges, famines and occupations per size. Of these, the **271** towns where a line of the stage moves or
  prints under a crisis (and two to three chip towns per word and size) were rendered at the tip.
- **Total: 1,716 towns born at both trees; 991 rendered at the tip.**

**The surfaces.** Every dossier view from the dumps (the tabs, the NPC cards, the Tonight sheet, the Power tab and its DM
panel). The PDF's Power chapter (`pdf/sections/PowerStructure.jsx`) built for all 720 by `pdf5.test.jsx` (its text leaves,
the walk of `tests/components/legitimacyPlainWords.test.jsx`). The Foundry journal reads no field the stage changed
(`grep` of `src/foundry`: no `modifier`, no hall line); the stability and the conflict line reach it verbatim from the record.

**The reading.** `lines5.mjs` finds every line class below in every town, with the facts the line claims beside it and the
base town's line for the same seed; `fd5.mjs` is the whole-record field diff. Where a script's test is a proxy I read the
examples myself; the verdict is mine. Scale: REVIEW-R2-STAGES `READER-BRIEF.md`.

## The lines

Counts are over the 1,716 births at the tip (the 720 and my 996); "on the page" is read in the 991 rendered towns.
Each row: the line, where it is written and under what condition, where it prints, the towns read, the verdict.

### A. The ruling power's modifier chip, in plain words (`domain/display/governingModifierWords.js :: governingModifierWordsOf`, read by `PowerTab.jsx :: RulingChainBlock`)

Prints at the end of the Power tab's power line ("The power Elder Council (dominant)criminal sway"). Every print found in
the records was found on the page (206 of 206 in the 720; 187 of 187 in my 271). No stored key prints anywhere on the
screen (the 991 dumps: the only matches of the eleven keys are ordinary words, "Lightly defended", "Security compromised").

| # | Line | Declared under | Prints | Verdict |
|---|---|---|---|---|
| A1 | `mage counsel` (arcane-advised, mage-advised) | magic functions AND an arcane house stands | 73: hamlet to metropolis, calm, famine, occupied, insurgency, fractured | **TRUE** in every print: each town stands a Mages' guild, a Wizard's tower, an Academy, a Scroll scribe or a Teleportation circle |
| A2 | `armed sway` (military-dominated), `armed backing` (defended, arms-backed) | a watch, garrison, militia or hired company stands | 101 + 22: thorp to metropolis, sieges, occupations, wartime | **TRUE** by the record in every print (a force stands). Doubtful, not listed: a thorp whose only force is a citizen militia |
| A3 | `church sway` (theocratic-aligned), `church guidance` (church-guided) | a sacred house stands and the faith's power does not answer to the seat | 102 + 40: thorp to metropolis | **TRUE** in 113. **LOW (a stretch), 29 prints** (10 thorps, 18 hamlets, 1 city): no religious power stands on the roster, only a shrine or chapel, and the chip says the church sways the ruler. E.g. `r2r-hamlet-2`: "The power Headman's Authority (dominant)church sway", roster: no religious power |
| A4 | `merchant sway` (commerce-driven, merchant-led) | a live market or a guild stands | 97: hamlet to metropolis | **TRUE** in every print (a market stands in each) |
| A5 | `criminal sway` (corruption-riddled, compromised) | `factsOf(record).crime !== 'none'`: ANY crime structure, a diffuse presence included | 95: thorp to metropolis, under siege, famine, occupation, infiltration | **FALSE, MEDIUM (g), 48 of 95 prints** (5 thorps, 2 hamlets, 3 villages, 7 towns, 14 cities, 17 metropolises), THE STAGE'S OWN: the hall line on the SAME Power tab clears the ruler of the criminals. TRUE in the other 47 (a corrupted rung, or an agent in the ruling three) |
| A6 | (no chip) a key the record does not bear out | the five families' facts absent | 565 towns: 123 arcane without an arcane house, 97 commerce without a market or guild, 94 crime with none, 74 force without a guard, 37+4 faith | **Cured by silence.** Every silenced print was a stored identifier (kind h); nothing prints in its place |

A5's towns, read on the page (EXECUTED, the dumps):
- `r2r-thorp-8` (Criminal structure: Diffuse criminal presence): "The power Elder Council (dominant)criminal sway" and, on the same tab, "Free of the criminals. Nobody at the head of Elder Council answers to a criminal house, and no criminal power here is strong enough to push it."
- `r2r-hamlet-17` (Semi-organized networks): the same pair.
- `r2r-city-3` (Organized syndicate): "The power City-State Council (strong)criminal sway" beside "Free of the criminals. The head, the second and the third of City-State Council make their own decisions; none of them takes orders from the criminals."
- `r2r-city-29`, `-43`, `-55`, `r2r-metropolis-5`, `-52`: "criminal sway" beside "Thieves' Guild works against Merchant oligarchy, and Merchant oligarchy is winning. Nobody at its head answers to the criminals."
- `r2r-town-31`, `-35`, `r2s-wartime-town-3`: "criminal sway" beside "Guild Council and Thieves' Guild leave each other alone. Nobody at the head of Guild Council answers to Thieves' Guild".
- Rendered in my births: 28 more, e.g. `rww-town-under_siege-301`, `r5-city-occupied-708`, `r5-metropolis-occupied-704`, `r4g-metropolis-under_siege-502`.
- The cause: the crime family's test reads the town's crime structure, where the line's own sibling on the page reads the ruling three's allegiances (the capture rung). The stored key is drawn from the priority sliders, so a diffuse crime presence, an adversarial rung or a "none" rung bears "criminal sway" out under this test.

**A7. THE TWIN THE CURE DID NOT REACH: the PDF's Power chapter prints the stored key raw.** `pdf/sections/PowerStructure.jsx:38`
reads `String(governingFactionOf(settlement)?.modifier || '')` and prints it under GOVERNING (its comment names it "the twin
of the screen's power-line chip"). Built for all 720 at the tip (`pdf5.test.jsx`): **395 of 395** towns whose ruling power
stores a key print it, e.g. `r2r-thorp-21`: GOVERNING "Elder Council" / "mage-advised"; `r2r-thorp-8`: "compromised". **HIGH (h),
an identifier printed; CARRIED** (the file is untouched by the stage, and the record's keys did not move: false at the base too;
written by `src/pdf/sections/PowerStructure.jsx`, last changed in a59796dda). Its no-guard: no test of the stage reads the PDF.

### B. The conflict ladder reads the roster (`generators/power/governanceNarrative.js :: deriveBaselineConflict`, `deriveInstitutionSignals`)

Stored in `powerStructure.recentConflict`; prints in the Power tab's governance paragraph and (as `pressureSentence`) on the
Overview. 22 towns moved (12 of the 720, 10 of mine), all hamlets and villages; 21 printed on the page (in `r4-hamlet-calm-501`
the paragraph prints a faction tension instead: record only).

| # | Line (the stage changed its condition) | Now under | Removed from | Verdict on the removed | What prints in its place, read |
|---|---|---|---|---|---|
| B1 | "Several merchants have been found murdered this season, and people say the guard is doing nothing about it." | a force AND a live market | 2 (hamlets with a militia, no market) | false at the base (kind a): **cured** | "Someone has been stealing from the communal stores…" (2): **TRUE** (subsistence farming hamlets) |
| B2 | "The merchant class is outbuying noble landholdings…" / "A noble family is contesting a merchant's right…" | a noble power, economy > 55, AND a live market | 8 (Feudal Stewardship and council hamlets, no market) | false (a): **cured** | grazing dispute (4), "The household that sells the most beyond the settlement…" (2), "The strongest armed household…" (1), "A monster incursion last season destroyed outlying farms…" (1, a plagued hamlet with a militia): **TRUE** in each (common grazing land; exports; a citizen militia; monster threat `plagued`) |
| B3 | "The military commanders are pushing for expanded authority over civilian courts…" | a force AND a court (`hasCourtSystem`) | 7 (hamlets and villages, a citizen militia, no court) | false (a): **cured** | "The strongest armed household has started making decisions on everyone's behalf without asking." (7): **TRUE** (a citizen militia stands in each) |
| B4 | "The village militia captain is pushing for authority over disputes that the reeve used to handle." | civic AND no force (the stage added `!hasMilitaryInstitution`) | none moved | the condition is now explicit; prints where it printed: **unchanged** | — |
| B5 | "{ruler} has been debating market levies for three months…" | civic or urban commerce AND a live market | 5 (hamlets and villages, no market) | false (a): **cured** | grazing dispute (5): **TRUE** (common grazing land in each) |

At the tip none of the five lines prints where the town lacks what it names (`roster12.mjs`, the court read by the record's own
court fact: 0 in 1,716).

### C. The stability label's defence word reads the readiness label (`governanceNarrative.js :: deriveBaselineStability`; `rulingStructure.js` hands `projection.defenseLabel`; `economyReconciliation.js` keeps the replay's `stability`)

Prints: the Overview's identity line ("Governed by X · <label>"), the Power tab's Stability, the PDF's STABILITY strip, the
quick guide and the AI notes, verbatim. 15 towns moved (11 of the 720, 4 of mine); all 15 read on the page.

| # | Line | Verdict |
|---|---|---|
| C1 | "Vulnerable (prosperous but underdefended)" refused over Defensible, Well-Defended, Fortress | removed from 9 towns and cities (Defensible 6, Well-Defended 1, Fortress 2): false at the base (g, against the Defense verdict): **cured**. In its place "Stable" (9): **TRUE** (prosperous, defended, legitimacy Approved or Endorsed) |
| C2 | "Ordered (strong military presence)" refused over Undefended, Lightly Defended, Vulnerable | removed from 6 hamlets and villages: false at the base (g): **cured**. In its place "Tense — regional monster threat" (4, monster threat `plagued`, Lightly Defended): **TRUE**; "Vulnerable (decisions shaped from outside); monsters on the roads" (2, infiltrated, readiness Vulnerable): **TRUE** |

The NEW1 pattern (a defence word against the readiness label): 11 → 0 on the 720 and 4 → 0 on mine. No stale first-pass
wording survives on the 11 moved pages of the 720 (no "underdefended", no "military presence" anywhere on them).

### D. The hall line under an organized syndicate (`domain/people/patronage.js :: hallOf`, the DM panel of the Power tab)

The none rung now takes its second line where `factsOf(record).crime === 'organized'` and the three ranks stand, else its third.
307 towns moved (128 of the 720, 179 of mine): 17 towns, 128 cities, 162 metropolises. All 254 rendered prints found on the page.

| # | Line | Verdict |
|---|---|---|
| D1 | "The head, the second and the third of {ruler} make their own decisions; none of them takes orders from the criminals." | **TRUE** in calm towns and under most crises (no agent in the three). **FALSE, MEDIUM (c, g), 38 prints, THE STAGE'S OWN**: **under an occupation (28: 3 towns, 10 cities, 15 metropolises)** the ruling three do not make their own decisions: the same page prints "Suppressed (under occupation: resistance simmers)" and "In the occupation, the occupier's orders come through … of Occupation Authority" (`r2s-occupied-town-1`, `r2s-occupied-city-1`, `r4-city-occupied-500`); **under an infiltration whose Stability reads "Vulnerable (decisions shaped from outside)" (10)**, the two homes on the Power tab disagree (`r2s-infiltrated-metropolis-3`, `rww-city-infiltrated-305`, `rww-metropolis-infiltrated-301`, `-302`). The base's line in these towns ("Nobody at the head of X answers to a criminal house, and no criminal power here is strong enough to push it.") claimed nothing of who decides. LOW (9 more): infiltrated towns whose label does not say so |
| D2 | "{ruler} rules in its own name. A criminal house that wants something from it has to ask, pay or wait like anyone else." (the syndicate case without the three ranks) | **NEVER PRINTS** in 1,716 births (every syndicate town at the none rung stands all three ranks) |
| D3 | The none rung's first line where it still prints | **TRUE**: 1,075 prints, every one in a town with no criminal power on its roster (crime none, diffuse or semi-organized) |
| D4 | The rung's label "Free of the criminals" beside the moved line in the 307 syndicate towns ("Criminal structure: Organized syndicate" on the Defense tab) | **LOW (g), CARRIED** (unchanged; written by `data/people/dmPowerLines.js :: CAPTURE_RUNG_LABELS`): the label reads as the town being free of criminals where the hall alone is |

### E. The coaching-inn keeper under a crisis (`data/people/titleSecretsPresentations.js :: TITLE_LINE_DECLARATIONS.presentation`, `generators/people/poolMap.js :: settleTitleLines`)

The presentation's `impression` is dark on every surface (`npcComponents.jsx`: only `behaviour` prints, as "How they deal").
436 keepers; 38 moved (24 under a siege, 14 under a famine; 4 towns, 13 cities, 21 metropolises). No keeper under a siege
keeps the welcoming or the transactional line; none under a famine keeps the welcoming line.

| # | Line | Verdict |
|---|---|---|
| E1 | Under a famine, the transactional line in place of the welcoming: "Sells places on the coach and beds by the night; asks for payment first." | **TRUE** (14): coaches run under a famine; the welcoming line's "Offers food" is gone |
| E2 | Under a siege, the cautious line in place of either: "Pleasant, but asks where you are going and when, and writes it down." | **LOW (c), THE STAGE'S OWN, 24 prints**: under a siege that cuts every road no one is going anywhere (e.g. `r2s-under_siege-town-1`, Critical (under siege)); a doubtful case (the keeper may still ask a guest's business) |
| E3 | **THE TWIN WITHOUT THE CONDITION: the keeper's secrets under a siege.** "Secret: Changes tired horses for fresh ones and sells the good ones on, giving travellers the worst of the stable" and "Secret: Tells a band on the road which coaches carry money and when they leave" | **FALSE, MEDIUM (c), CARRIED**, 16 keepers under a siege (e.g. `r2s-under_siege-town-1`, `r2s-under_siege-metropolis-0`, `r2s-under_siege-metropolis-2`): coaches leaving and travellers changing horses under a siege. Unchanged by the stage (false at the base too); the stage declared the siege for the presentation rows and not for these two secret rows of the same title (`TITLE_LINE_DECLARATIONS.secret`) |

## Summary

- **Lines read:** 27 line classes (A1–A7, B1–B5, C1–C2, D1–D4, E1–E3 and the silenced chip), in every town of 1,716 where they print; 991 rendered.
- **FALSE, the stage's own:** A5 "criminal sway" against the hall line (MEDIUM, 48 prints); D1 "make their own decisions" under an occupation or an announced infiltration (MEDIUM, 38 prints); A3 "church sway/guidance" with no religious power (LOW, 29); E2 the cautious behaviour under a siege (LOW, 24); D1 under the other infiltrations (LOW, 9).
- **FALSE, carried:** A7 the PDF prints the raw key (HIGH, 395 of 395 key towns of the 720; `pdf/sections/PowerStructure.jsx`); E3 the keeper's siege secrets (MEDIUM, 16; `data/people/titleSecretsPresentations.js`); D4 "Free of the criminals" beside a syndicate (LOW).
- **Cured and true:** B1–B3, B5 (22 removed lines, all false at the base; every replacement read true), C1–C2 (15 removed, all false; replacements true), A6 (565 identifiers silenced), E1.
- **NEVER PRINTS:** D2 (1,716 births).
- **Whole-record field diff, base → tip:** 720: 26 towns move, only `powerStructure.recentConflict` (12), `powerStructure.stability` (11), `npcs[].presentation.*` (6) and `pressureSentence` (3, the conflict line's copy). Mine: 45 towns, the same four families (10, 4, 32, 4). No key added or removed, no other field.
