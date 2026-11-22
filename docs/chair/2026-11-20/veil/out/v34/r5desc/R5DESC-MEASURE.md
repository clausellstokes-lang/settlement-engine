# R5-DESC-MEASURE — the measure under R5-DESC (VEIL-34's MEASURE builder V34-R5DM, 2026-11-22)

Brief: `docs/chair/2026-11-20/veil/briefs/R5-DESC-MEASURE-BRIEF.md` (8bb15b491). Nothing cured; nothing in `src/`, `supabase/`,
`tests/` changed. Tree: worktree `/home/user/wt/r5dm`, branch `v34-r5desc`, cut at 8bb15b491 (the seat's tip moved to f3e5459e7
while I worked: one brief file, `src/` identical). Template `v34tpl` (the seat's: v27x211 + the tip's 212). Local cluster only.

**Instrument** (`measure/`): a copy of the tell8b arm (`arm.sh`, `arm.probe.jsx`, `arm-an.mjs`), the same page set: the R3 gate's
140 births (`tell-common.mjs :: pool`, N=2: 92 hidden-house towns, 48 controls), both engines (server `get_gallery_dossier`, twin
`projectShareVeil`), every setting (own, g:000..g:110, allOpen, off, allShown, unmarked), Reveal off and DM: **6,528 pages**. Run
`full4` (18:27..18:34 UTC, 4 shards rc=0, errors 0); table `measure/out/arm-table.txt`; `q-desc-kind.mjs` the census query.
The lane's fold is IMPORTED (`gallerySecondHomes.js :: buildNameSearch`, the served power names open). **ENGINE PARITY: 0
differences** (W, H, masked rows, the whole M1 and M5 tables, server against twin, every page) — CONFIRMED; no STOP.

Withheld (W) = a name in the record's two power lists and in neither served list, unstamped: **1,240 of 6,528 pages, 31 towns**
(Thieves' Guild; The Black Circle, The Underground, The Hidden Hand, The Shadow Compact), on the gated settings only, both reads.
Stamped (H, `hidden: true`, the infiltrator): 9 towns, 420 pages; the row is served on the 210 DM pages (the DM door), withheld on
the 210 Reveal-off pages. No page in the set serves a masked row. CONFIRMED.

(c)'s word list: `factionCategories.js :: FACTION_CATEGORY_KEYWORDS` + `MAGIC_CERTAIN_KEYWORDS` for the withheld power's category
(COPIED into the probe: not exported), case-blind at a word's start, plus its `powerSupport.js :: RULER_KINDS` archetype word
(imported). For the criminal powers: Thiev, Criminal, Smuggl, Underground, Cartel, Corrupt, Bandit, Assassin, Shadow, Hidden Hand,
Black Circle, Underworld. The infiltrator's category is `other`: no kind list. "(c) strict" sets aside a word a SERVED power's own
name carries (the seat "Corrupt Council") and the idiom "in the shadow of" / "'s shadow". NOT counted: "the guild" (economy's word,
the standing lines' name for the Thieves' Guild: "A slow war with the guild") — PLAUSIBLE further tell, uncounted.

## M1 — THE CENSUS BY REGISTRY ROW (served strings, sv = server, tw = twin; each cell server = twin)

| row / path | read | n served | a(W) names | a(H) | b mask | bt "the an unseen interest" | c kind (strict) | |
|---|---|---|---|---|---|---|---|---|
| `power.desc` `powerStructure.factions[].desc` | off | 8,281 | **20** | 0 | 0 | 0 | 246 (**155**) | CONFIRMED |
| same | dm | 8,410 | **20** | 0 | 0 | 0 | 246 (**155**) | CONFIRMED |
| `power.desc` master's `factions[].desc` | both | 0 (born records carry no top-level `factions`) | – | – | – | – | – | CONFIRMED |
| `power.relation.dmNote` | off | 0 (not served) | – | – | – | – | – | CONFIRMED |
| same | dm | 170 | 0 | 0 | 0 | 0 | 0 | CONFIRMED |
| `power.label` `factions[].powerLabel` | off / dm | 8,389 / 8,518 | 0 | 0 | 0 | 0 | 0 | CONFIRMED |
| `powerStructure.recentConflict` (baseline) | each | 1,632 | 0 | 0 | 0 | 0 | 10 (0) | CONFIRMED |
| top-level `pressureSentence` (baseline) | each | 1,632 | 0 | 0 | 0 | 0 | 50 (0) | CONFIRMED |
| `governingName` / `government` | each | 1,632 / 1,632 | 0 | 0 | 0 | 0 | 90 (0): the served seat "Corrupt Council", "Shadow Senate" | CONFIRMED |
| `governmentType` | both | 0 (never written) | – | – | – | – | – | CONFIRMED |
| `factionRelationships[].narrative` | off / dm | 4,131 / 4,239 | 0 | 0 | 0 | 0 | 130 (0) | CONFIRMED |
| `conflicts[].desc`, `.parties[]` | each | 2,007 / 4,014 | 0 | 0 | 0 | 0 | 50 (0) | CONFIRMED |
| `factions[].faction`, `.name` | dm | 8,518 / 1,299 | 0 | 129 / 24 | 0 | 0 | 90 (0) | CONFIRMED (a(H) = the DM door serving the stamped row itself: not a withheld read) |
| every other string key of `powerStructure` and of a served row (walked: 30 paths, table) | – | – | 0 | 0 (off) | 0 | 0 | category "criminal" 90, modifier "corruption-riddled" 20, captureState 5 (dm) | CONFIRMED |

By setting: a(W) on each gated setting 4 strings (sv, both reads), 0 on allShown and unmarked. CONFIRMED.
- **a(W): 20 strings per side, 2 towns** (r3m-town-none-0-17, r3m-city-none-1-117), every gated setting, both reads: the rank-2
  standing line (`factionStanding.js` rank 2, "Close enough to the two above that their support is worth buying; they play
  **Thieves' Guild** and Arcane Council against each other when they can."). The withheld power by its own name, unmasked (the mask
  covers stamped rows only: `publicSafe.js :: HIDDEN_POWER_MASK`). CONFIRMED.
- **(c) strict: 155 desc strings per side, 111 pages, 12 towns**: "The criminal network is stronger than they are." (80; the
  clergy's line, `factionStanding.js` religious-thieves), "The criminal network reaches further than the merchant guilds right now."
  (78+; merchant-thieves), the 20 rank-2 lines above, and the served seat's OWN base ("council seats are openly traded among
  criminal and commercial interests." 8, Corrupt City Council; "Nominal governance masks a criminal oligarchy" 2, Shadow Senate).
  Every withheld-kind hit but those 10 sits in a STANDING sentence about the withheld power. CONFIRMED (sentences from the kept
  examples; 2 pages had more hits than kept examples).
- **b / bt: 0 on every M1 path** in this set (no stamped row on a hiding read reaches a power card); the grammatical tell "the an
  unseen interest" never printed. CONFIRMED here; the lit probe's two (jp6-village-6, jp6-metropolis-0) are not in this set.

**M2 — a hit at a path the M1 list does not hold.** Power-card paths: only a(H) on DM reads (the served stamped row), no new row.
The wider walk (every other served string, hiding pages): **`history.currentTensions[].factions[]` serves the MASK as a tension's
party, "an unseen interest", on 22 Reveal-off pages** (1 town, r3m-village-infiltrated-0-2, all 11 settings, both engines;
e.g. `history.currentTensions[0].factions[2]` = "an unseen interest"): a NEW REGISTRY ROW for the chair (a tension's party, the
mask as a name; the party list `rosterText.js :: settleTensionsToRoster` writes). Count 22, all one town, so fewer than five
distinct examples. CONFIRMED. The other wide hits (npcs[].institution.key, memberships[].power, stakes[].factionId,
simulationTrace[].targetId) are a(H) on DM reads only (the door): not hides. CONFIRMED.

## M3 — THE OTHER WAY'S FIDELITY (the decisive figure)

Nothing-hidden pages = no W and every stamped row served: **5,118 pages, 25,956 served descs**. B = R5C2's reader
(`R5C2-measure3.probe.mjs :: rederiveB`, by its call: `generatePowerStructure(tier, economicState, adversarial neighbour, config,
institutions, { stressEntries })`, no seed) over the PAGE (`rederiveForPage` over the projected document). S = the standing part
alone: `annotateFactionStanding` over `standingRosterOf(served roster)` with `standingForceOf(served houses)` and the served
legitimacy (`rosterText.js :: standingsOf` by its calls), the base sentence kept.

| reader | descs byte for byte | pages whole | other | |
|---|---|---|---|---|
| **B** | **14,598 / 25,956 (56.2%)** | **670 / 5,118 (13.1%)** | powerLabel 20,484 / 21,924 (93.4%); dmNote 302 / 340 (88.8%, DM) | CONFIRMED |
| **S** | **25,574 / 25,956 (98.5%)**; with a standing to write: 14,094 / 14,476 (97.4%); 11,480 hold none | **4,736 / 5,118 (92.5%)** | S' (the served rows whole): 25,574, the same | CONFIRMED |

Per read and engine the figures split evenly (off/sv 3,469 B and 6,147 S of 6,237; dm/sv 3,830 and 6,640 of 6,741; tw = sv).

**B's 11,358 misses by cause** (CONFIRMED: by the record's own replay `projectPowerGenerationIntent(intent, record economy, late
options)`, B over the record with/without the late options and the seed, and the descs after each pipeline step):
- 5,870 **a step after the power step rewrote it: `assembleSettlement`** (5,374 the standing only, base equal: the density law's
  resize, `applyDensityLaw.js :: resizePoliticalRoster`, then `rosterText.js :: settleStandingToRoster`; 456 base and standing; 40
  base only);
- 4,140 **not in the power step's roster**: the density law's rivals born at `assembleSettlement` ("The Guild Alliance", "The
  Merchant Bloc", "The Garrison Bloc"...); B never writes them;
- 652 **the late replay's options not handed** (`defenseLabel`, `militaryGate`, `forces`, which `assembleSettlement`'s
  `reconcilePowerStructure` passes; e.g. Craft Guilds' `claimStanding.js` rung);
- 540 **the served page differs from the record** (a house the share withholds moves B's figures; B over the record reproduces);
- 156 **the pipeline's tail**: `generateSettlementPipeline.js:203-204`, `claimStanding.js :: settleClergyToFinalRoster /
  settleArcaneToPractitioners` ("Magical practitioners..." becomes "The arcane interest...").
- **No seed draw**: B threw on 0 pages; with the record's seed B reproduces nothing more (434 of 754 stored powers reproduced by B
  over the record either way). CONFIRMED.

**S's 382 misses** (CONFIRMED count; cause PLAUSIBLE): 278 carry the seat-contest line `factionStanding.js ::
SEAT_CONTESTED_STANDING` ("Close enough now to contest the seat, and they know it.", War Council, Military/Guard, Religious
Authorities, The Independent Bloc) where the served roster and legitimacy give a rank line; the line reads `coupContenders` with
the seat's legitimacy, so PLAUSIBLY the legitimacy (or roster) moved after the last standing write; S' (full rows) does not cure
it. 48 The Enlightened: a `claimStanding.js` rung replaced the whole desc ("Magical practitioners outside the seat hold no office
of their own...") and dropped its standing; 48 The Shield Compact: a density rival minted with no standing; 8 The Underground (cause not read).

**THE HIDING PAGES** (a W power, or a stamped row not served): 1,410 pages, 38 towns. CONFIRMED.
- **B re-creates the withheld power in its own roster on 930 pages** (Thieves' Guild; The Independent Bloc): B reads config and
  houses, not the served roster, so it re-derives the power the read withholds. B's descs of the SERVED powers: 0 names, 0 mask,
  but **440 strict kind hits** ("The criminal network..." written against the re-created guild).
- **B cannot be handed "the powers the read serves"**: `generatePowerStructure` takes no roster input (tier, economy, neighbour,
  config, houses, projection); its standing writer runs inside it (`rulingStructure.js :: generatePowerStructure`, the
  `annotateFactionStanding` call after `settleClaimsToLabel`). The only way is to drop the withheld rows from B's output and write
  the standings again over the served roster, which is S. CONFIRMED by the signature; PLAUSIBLE that nothing else is needed.
- **S, the withheld power ABSENT** (the record's base + the served roster's standing): over 7,750 descs **0 names, 0 mask, 0 tell**;
  200 strict kind hits, **all 200 in the base sentence of the served seat itself** (Corrupt City Council, Shadow Senate: E94's
  class), **0 in a re-derived standing**; 5,294 equal the record's desc.
- **S, a masked row KEPT** (the withheld rows named "an unseen interest"): **40 print the mask** ("they play an unseen interest and
  Corrupt City Council against each other when they can.", r3m-city-insurgency-1-114) and 0 "the an unseen interest" here; the
  kept row must not be in the roster S reads.

## M4 — E94 (c): THE GOVERNMENT'S LABEL

Writers of `governingName` / `government` / `governmentType` and the label `power:governance` prints, by search (CONFIRMED):

| writer | its string | |
|---|---|---|
| `src/generators/power/rulingStructure.js :: generatePowerStructure` (lines 766, 771) | the governing row's `faction`, chosen by `chooseGoverning` through `rulerKin.js :: drawCouncilOfAKind` from KIND TABLES: `governanceLabelMap` (lines 124-138, keyed on a house's catalogue name, valued by a literal), the council modifier table (lines 186-209: "Shadow Senate", "Corrupt City Council"), the tier tables (lines 210-299) | table |
| `src/generators/power/economyReconciliation.js :: reconcilePowerStructure` (329-330) | copies the replay's two | table (via the above) |
| `src/domain/rulingPower.js :: transferRulingPower` (550, 671-672) via `resolveGovernmentLabel` (434-460) | `GOVERNMENT_PREFERENCES` (157-174), `ALT_GOVERNMENT_LABELS` (178-188), else `` `${preferred} Ascendant` `` (the table's label, no name) | table |
| `src/domain/factionRename.js` (916-917, `rewriteKey`) | the DM's own new name for the seat (the faction rename ledger) | the DM's hand |
| `src/generators/density/densityAscension.js :: planSeatAscension` (153) | a seat row named `ascendingPower` (a POWER'S OWN NAME); writes no `governingName`; NO CALLER in `src/` (dormant) | PLAUSIBLE risk if wired |
| `governmentType` | written by no generator (0 of 6,528 served); read only (`gallery.js:753`, `pdf/lib/viewModel.js`) | – |
| `power:governance` (`powerDeskRead.js :: governanceAccountRead` → `governanceAccount.js :: governanceAccountOf`) | prints `powerNameInProse(rulingChainOf(...).power.name)`: the governing row's own name; also the seat-holder person and claimant names | reads the row |
| `neighbourGenerator.js :: getMirrorFactionLabel` (319-501, `` `${n} Administrative Prefects` ``) | a NEIGHBOUR power's name composed from the neighbour PLACE's name; a roster row of kind `government`, not a government label | not a writer of the label |

Executed: 34 distinct governing names born, every one a table literal; **22 of 140 births' governing name spells a house of their
own record** ("Merchant oligarchy", "Democratic assembly", "Grand Merchant Oligarchy", "Grand Guild Consortium", "Town Council"):
each is `governanceLabelMap`'s literal for the house's catalogue name (`institutionRename.js:243-250` records the coincidence),
not composed from the house's name (a renamed house leaves it). No served governing name is a withheld power (0 pages). **No
label composed from a house's or power's own name: no STOP.** CONFIRMED (search and the 140 births); in play, PLAUSIBLE beyond
the transfer and the rename.

The pin (proposed, not written):
1. `tests/lint/governmentLabelFromKindTable.walker.test.js`: "every writer of powerStructure.governingName and .government draws from a declared kind table".
2. It walks `src/` for assignments to `governingName` / `government` (the regex this measure used) against a manifest: rulingStructure.js, economyReconciliation.js, rulingPower.js, factionRename.js.
3. On births of every size and crisis and a transfer to every archetype, the label is a member of the union of the tables' literals (or `<literal> Ascendant`).
4. The lane's fold over every house and every other power of the record never finds its name in the label (the `governanceLabelMap` literals allowed by name).
5. A new writer, or `planSeatAscension` gaining a caller, turns it red until the manifest and the chair say so.

## M5 — THE POWER TAB'S STRATA AND CONTENDERS (row 18)

`derivePowerStrata` (read whole) returns names, archetypes and labels of served rows, and `roster[].faction`, THE RAW SERVED ROW
(its `desc` with it); `coupContenders` returns `governing` (the raw row), names, archetypes. Over the PAGE, 6,528 pages, both
engines (CONFIRMED):
- **Reveal off: every name hit is `strata.roster[].faction.desc`: 20 per side, the same 20 descs as M1**; `strata.powers[].name`,
  `coup.challengers[].name`, `.incumbent.name`: 0 names, 0 mask. Strict kind: `strata.roster[].faction.desc` 155 per side (the M1
  descs), and the served seat's own category / archetype "criminal" 90.
- DM: a(H) on `strata.roster[].name` 129, `powers[].name` 46, `coup.challengers[].name` 46: the stamped row the DM door serves.
- Mask: 0. **The strata print no name of their own; each hit is a served description handed back whole: the cure at the
  description is the cure there.** CONFIRMED in this set.

LIT (the probe's surface (b)): the copied litsurf probe (`measure/lit/`, one addition: `strataHits`, the strata's and contenders' own
strings that name the act's hidden power or carry the mask, by path) ran on a detached worktree of
`origin/lane/veil-33-2026-11-22-joinprobe-wip` (df7447e58; `/home/user/wt/r5dm-jp`), births in process, NO POOL; its server on a
local template built as the seat builds one (`r5dm_jptpl` = v27x211 + that ref's 212, applied, not opened). 60 births, 4 shards rc=0;
**its table reproduces the committed `litsurf-table.txt` byte for byte** (diff 0; the analyzer's own exit 1 is its red verdict, as
committed). CONFIRMED. Place by place (`measure/out/lit-strata.txt`):
- **The four places that name the hidden power: jp6-city-2, jp6-city-8, jp6-metropolis-0, jp6-village-6**, acts T and R, Reveal
  off, server and twin alike: **every hit is `strata.roster[].faction.desc`**, the served description inside the raw row the strata
  hand back (16 strings). jp6-city-8: the hidden Noble Families' own masked row's desc ("Noble families with hereditary land rights
  and traditional privileges; ..."); jp6-city-2: a shown power's "They and the religious authorities both keep people in line." (the
  hidden Religious Authorities in lower case, past the case-sensitive mask); jp6-village-6 / jp6-metropolis-0: the rank line's mask tell ("the an unseen interest") in the same desc as the name hit.
- **The mask, 56 strings on 13 places, every one the tell "the an unseen interest"** ("they play the an unseen interest and the
  Elder Council against each other", "They operate in the shadow of the an unseen interest"), again only in
  `strata.roster[].faction.desc`.
- The challengers, `powers[].name`, `coup.*.name`: 0 names, 0 mask. **The strata add nothing of their own on the lit reads either:
  the input is the served desc; the cure at the desc is the cure there.** CONFIRMED (60 births, both engines).

## THE PARAGRAPH (by the figures; the seat and the chair rule)

**`power.desc`: neither the other way by B nor a whole-entry withhold, but THE OTHER WAY BY S for the standing part.** B
reproduces 56.2% of descs and 13.1% of pages, the misses all structural (the density law after the power step, 10,010 of 11,358;
no seed draw), and on a hiding read it re-creates the withheld power in 930 of 1,410 pages: B is refuted for the card. S, the
standing written again over the served roster with the base sentence kept, reproduces 97.4% of the standings that exist (98.5% of
descs, 92.5% of pages) and on every hiding page prints 0 names, 0 mask and 0 withheld-kind words in what it re-derives, where the
served desc printed 20 names and 155 kind lines per side; its only kind hits (200) are the served seat's own base sentence, E94's
class, and the masked row must stay out of its roster (40 masks if kept). Its 382 misses (the seat-contest line) are a fidelity
cost, not a leak. The per-entry withhold would instead drop the whole desc, base sentence and all, for the 155 descs per side (111 pages, 12
towns) whose hit sits in the standing, and leave the reader's card blank where S would print a true sentence. **`power.relation.dmNote`: the per-entry withhold** (served on DM reads only, 170 per side, 0 hits here; B gives
88.8% and re-creates withheld powers). **`power.label`: no composed row** (0 names, 0 kind, 0 mask in 33,814 served labels: a
ladder over the power figure; move it off the composed form with that census). **`recentConflict`, `pressureSentence`**: 0
names, 0 mask, 0 strict kind here (R5-RECENT's figures stand). **New row**: the tension's party served as the mask
(`history.currentTensions[].factions[]`, 22 pages, 1 town). CONFIRMED figures; the choice is the seat's.
