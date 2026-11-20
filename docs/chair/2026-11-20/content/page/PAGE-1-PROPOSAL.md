# PAGE-1's proposal: cure by cause (2026-11-20, written 11:16 UTC by `date -u`)

The measure is EXECUTED on the chair's 300 untouched towns (`hxd-<size>-<i>`) at `0c9069489`. Its scripts and outputs
are in `measures/A`, `measures/B` and `measures/C` beside this file. The rendered page was walked for 60 and 30 towns, and
every record string checked prints word for word. Figures are from the out files; causes are INFERRED from the code at
the cited lines. A "SMALL" unit claims that no stored field of a born town moves, or only prose strings. Each SMALL
unit proves that claim with NAMES-3's two-tree tool (`trees.mjs <before> <after> <workdir>`), which must report 0
non-string differences. The owner's rule shapes every cure: say what is already there, never a new tension or fact.

## What the measure found (corrections to the leads marked)

- **F1.** 515 tensions in 300 towns carry 86 texts. The five commonest texts reach 50.3% of towns. A visitor's three
  forges in a row share a tension text verbatim 32.1% of the time (city 82%, metropolis 80%). The arrival paragraph
  repeats a sentence 22.9% of the time.
  - Cause: the tension text is never drawn (`historyGenerator.js:586`). The 2 variants a kind
    (`HISTORY_DESC_VARIANTS`) are used only to keep a kind from repeating its own past event (:1135).
  - The variants are PAST tense. The commonest texts are the present-tense unanchored forms, which have no variants
    (crime_wave: one text in all 77 towns).
  - Kind shares corrected: crime_wave 25.7%, guild 22.0%, scarcity 11.0%, corruption 6.0%, threat 8.7%.
  - A dead branch at :499 never fires: 'overwhelms' against 'overwhelmed'.
- **F2.** Sides presuming a house the town lacks:
  - "Legal class" lacks a court in 5 of the 14 towns that drew it.
  - "Merchants…cheap labour" lacks a market in 5 of 11.
  - "Price regulators" lacks a market in 5 of 5.
  - "the merchant class" lacks a market in 3 of 3.
  - "the criminal network" has no criminal power in 22 of 22.
  - "Local enforcement" has no watch in 6 of 6.
  - "Wealthy merchants" is named after ANY first non-governing power (`historyGenerator.js:391`), including Military
    and Religious.
  - 64% of the sides printed generically could be named from the town's own record.
- **F3.**
  - Safety and Law & order sit two or more steps apart in 18% of towns (city 42%, metropolis 52%). They are two
    measures:
    - Safety is guards over criminals, and is set by a floor in 75% of calm towns: the size floor in 49%
      (`safetyProfile.js:81-87`) and the court floor in 26% (:102-106).
    - Law & order adds legitimacy and the law houses (`causalState.js:875`).
  - The hall is in criminal hands with Safety at Moderate or better in only 3 of 300 towns.
  - SAFETY PRINTS ON PLAYER AND PUBLIC PAGES (`OverviewTab.jsx:396`, no audience gate; the veil keeps
    `safetyLabel`).
  - Output and prosperity sit two or more steps apart in 36% of towns. Output is the dial after its drags and never
    exceeds 50 (`priorityHelpers.js:416-434`). Its largest drag is the lack of a market (126 towns) or crime (99).
  - "Relied upon" sits beside a Weak capability in 26 towns. This too is two measures: reliance counts divine healing
    (`magicReliance.js:80`), while capability is ARCANE presence (`defenseGenerator.js:279`).
  - The Magic headline reads "Medium" in 300 of 300 towns. It is the world dial (`magicProvisionShown.js:325`).
  - Criminal opportunity sits on a knife edge at 50: 128 towns read Contained and 160 read Elevated
    (`causalState.js:1103`).
- **F4.** 88.6% of cards read "marginal", and 33.6% of firsts of a power (lead: 39.0%); every thorp elder does.
  - Cause: a keyword match on the POOL role (`npcGenerator.js:66,71`, written with underscores). It reads no size and
    no power.
  - Correcting it moves 273 cards in 151 towns. Through an extra `_rng()` (`relationshipArchetypes.js:13,42`), the
    correction also moves ties in 148 towns and goals in 97. It is NOT a display fix.
- **F5.** Another trade's wrong appears on clergy cards 7.9%, justice cards 14.5% and watch cards 2.7%, against 1.5%
  elsewhere.
  - Cause: the dean, bishop, priest, abbot, chief magistrate, watch captain and garrison commander have no
    `TITLE_SECRETS` row. Dean 138 of 150 and chief magistrate 99 of 100 fall to the `any` catch-all.
  - A principled temperament sits beside a venal secret on 1,014 of 5,452 cards. The guard (`npcData.js:2548`)
    covers 169 and lacks "principled".
  - Want against secret: 170 of 9,012 cards (count only: the goals seat's).
- **F6.**
  - Daily Life prints about 33 words at every size. `deriveDailyLife`'s 8 slots (filled 300 of 300) are printed by no
    page. Some slots are themselves fixed: `unspoken_topics` has 1 text in 300 towns.
  - Outlook drops the warnings (144 towns) and dependencies (167) by its filter.
  - Magic prints the same 15 labels in every town. `contributors[].reason` is never printed.

## SMALL AND CONFINED (each one builder, one commit, red first)

| # | Cure (cause) | Files (lane) | Lines | Moves |
|---|---|---|---|---|
| S1 | The card stops printing "Standing marginal" and its dot from the misread band. Where the card is first of a power, it prints that fact and the power's own weight in this town (already on the record) (F4) | `npcComponents.jsx`, `npcInteriorityRead.js` (mine) | ~40 | render only |
| S2 | The tie header "Called by <name> · <kind>" says who asked in a sentence's words. **ROUTE**: the ties' prose is another seat's. If that covers the header, S2 is theirs. | `npcComponents.jsx:539` | ~10 | render only |
| S3 | Output: no grade out of 100. In words, the share of its own dial the town makes and the drag that holds it back (F3b) | `EconomicsTab.jsx`, a display reader in `src/domain/display/` | ~50 | render only |
| S4 | Safety: on the DM's page only, where Law & order stands two steps away, the Safety tag carries it ("Moderate on the streets; the law is weak"). Fails closed on any shared or public audience. A guard reds on two such labels two steps apart with no line between. Public Safety left as it is (F3a) | `OverviewTab.jsx`, a display reader | ~60 | render only |
| S5 | "Magical Capability" is named for what it measures ("Arcane strength"). The Magic headline says it is the world's measure, not the town's (F3c) | `OverviewTab.jsx:97`, `magicProvisionShown.js` | ~15 | render only |
| S6 | Anchored tensions rotate base plus the 2 existing variants on a keyed hash (`pickVariant`, seed `${seed}::tension::${type}`, no draw). The dead 'overwhelms' branch is mended (F1) | `historyGenerator.js:583-588,499` | ~20 | prose |
| S7 | A side the town lacks is re-worded with no house ("those who profit from the muddle", not "Legal class"). "Wealthy merchants" is named only after an economic power. "the criminal network" with no criminal power reads as an unnamed actor. Array length is kept (F2) | `historyGenerator.js:391,410,564-574`, `historyData.js` | ~40 | prose |
| S8 | Sides named from the town's own powers and houses where the record holds a match: guild 73 of 76, ruler 91 of 91 (F1/F2) | `historyGenerator.js` | ~40 | prose |
| S9 | Catch-all secrets that presume an office are tagged with the holders they fit. A misfit card walks to the next admitted line, draw-free (`settleTitleLines`, `poolMap.js:389`), with a card-level `admits` (F5) | `npcData.js`, `npc/factionLeaderSecret.js` | ~60 | prose (secret, stakes), proven by the tool |

## LARGER (each the chair's to route)

| # | Cure | Files (lane) | Lines |
|---|---|---|---|
| L1 | Present-tense wordings for the unanchored forms: 2 each for the 8 commonest kinds, then the rest. A's simulation: odds 32%→15% (an upper bound: it mixed tenses), then about 9.5% with 3 a kind | `historyData.js` | ~50-150 |
| L2 | Arrival pools of 4-5 lines deepened (ordinary 7 lines for 100 towns; Germanic people 4 for 32) | `arrivalProse.js`, `narrativeData.js` | ~80 |
| L3 | THE BAND FAULT (F4 keyword): a stored field and 2 fingerprints move (`influence_dist`). The extra `_rng()` in `relationshipArchetypes.js` should go on its own fork first, so the band correction moves only the band. The owner's door: born towns change | `npcGenerator.js:66,71`, `relationshipArchetypes.js` | ~30, plus re-pinned goldens |
| L4 | `TITLE_SECRETS` rows for dean, bishop, priest, abbot, chief magistrate, watch captain and garrison commander. "principled" added to the guard (moves draws) | `titleSecretsPresentations.js`, `npcData.js:2548` | ~120 |
| L5 | The thin pages given what the record holds: Daily Life's 8 slots (after their own pools are deepened; `unspoken_topics` has 1 text), Outlook's dropped warnings and dependencies, Magic's contributors' reasons | `DailyLife`/`Viability`/`Magic` tabs, `dailyLife.js` | ~150-250 |
| L6 | Criminal opportunity's knife edge at 50: a band re-derived. Also the Safety floors (size 49%, court 26%), which make Safety a floor more than a measure | `causalState.js:1103`, `safetyProfile.js` | ~20 each, stored |
| L7 | Want against secret: the goals seat's (170 of 9,012) | `goals.js` (not mine) | |
