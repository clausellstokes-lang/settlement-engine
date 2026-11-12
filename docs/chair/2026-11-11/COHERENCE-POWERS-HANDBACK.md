# COHERENCE-POWERS — the hand-back (phases 2A and 2B)

The lane is `lane/coherence-powers-2026-11-11`. The base is decc7bf15. PRESUME's hand-back 081928512 is merged INTO
this lane at 84f02ef0e (theirs into ours, the order the chair set: PRESUME, then AGREE, QUARREL, this lane). No source
file is touched by both sides; only the lighting census conflicted, and it was re-taken by its own command.

The companions in this directory:
- `COHERENCE-POWERS-PHASE2B.md`: 2B's full measures, the council's wake town by town, the ladder readers, the
  mobilization floor and its population, and the 21 powers left by stress kind.
- `COHERENCE-POWERS-two-hats.txt`: the two hats in three places, for one town of each government kind.
- `COHERENCE-POWERS-shift-record.DRAFT.json`: the one drafted record.

## 1. What the lane carries

| commit | cause |
|---|---|
| 23a2015d4 | rule A: the ruler of a kind is its kind's first claimant in the doubled-niche deal |
| e0c8bb357 | the dual hat: the leader is the heaviest open house of its kind (a civic ruler: trade or landed), its role the office (the ruled table), its title its house's |
| e3316ac5f, 484f5a1d4 | the mint's forced tie to the rank-1 card; the empty-pool governing seat |
| 04334d6ef, 4509d4add, 528d9886e | cure (i): one person, one face (the seat's house bears no face where a house leads); its readers; the two hats on the seat row and the card line |
| c7bc4702a .. fdc4e7728 | 2A's own ratchet reds cured: typed readers, the label seam, the ruin filter, the guard's park and manifest entry, and the M-1b pins re-keyed exactly |
| 84f02ef0e | the PRESUME merge |
| 78b0e7ae6 | the 2B guard, red first (4 of 6 at 6f1bf56f7) |
| 5915e3af0 | the council of a kind |
| 1df17289f | the fold |
| 902378261 | a power of the roster's own that no house stands behind is not built |
| fd4db104e | cure (a): capture only where a criminal power stands (the chair's ruling) |
| the rest | the measured re-keys and the censuses re-taken by their own writers, each with its cause; the edge bundles re-emitted last, alone |

## 2. (a) How the two hats print, in three places

The full text, for one town of each of 32 government kinds plus a hamlet's stewardship, is in
`COHERENCE-POWERS-two-hats.txt`. The three places are the Power tab's seat row, the person's card, and the seat
house's "Connection:" row. Births go through `birthConfig`, at this tip. Three of them:

```
Rotfeld — a village, ruled by Elected Reeve
  Power tab, seat row: Hans Walter, the innkeeper and Reeve
  The person's card:   Hans Walter · Innkeeper · Reeve, first of Elected Reeve · first of Merchant Guilds
  The seat's house (Village reeve): Connection: Reeve Hans Walter, the innkeeper
Saraikhand — a town, ruled by Military Council   (an Arcane Council with no arcane house at 2A; the council of a kind)
  Power tab, seat row: Nomun Noyakin, the castellan and Captain-Mayor
  The person's card:   Nomun Noyakin · Constable · Captain-Mayor, first of Military Council
  The seat's house (Town hall): Connection: Captain-Mayor Nomun Noyakin, the castellan
Ulfsund — a hamlet, ruled by Feudal Stewardship   (appointed: one hat, by design)
  Power tab, seat row: Kjara Ragnarsson, the steward
  The person's card:   Kjara Ragnarsson · Steward · first of Feudal Stewardship
  The seat's house (Lord's steward): Connection: Steward Kjara Ragnarsson
```

Some towns show one hat by design:
- **Appointed governments** (the stewardships, governorships, Royal Authority, the occupations): the leader is sent
  in, so one hat.
- **Criminal rulers** (Corrupt Council, Corrupt City Council, Shadow Senate): one hat, under the veil.
- **Kamendvor's Elder Council**: its seat is vacant from a stressor, a modifier that predates this lane.

## 3. (b) Cards per town, decc7bf15 → this tip (360, through `birthConfig`)

| size | mean | median | towns with one fewer card |
|---|---|---|---|
| village | 8.75 → 7.75 | 9 → 8 | 60 of 60 |
| town | 25.35 → 24.57 | 25 → 25 | 125 of 160 |
| city | 58.54 → 57.75 | 59 → 59 | 79 of 100 |
| metropolis | 80.10 → 79.53 | 83 → 82 | 23 of 40 |

Each fewer card is the office face, in a town where a house leads. 2B moves no card on this corpus. On the soak
1,000, 11 thorps and hamlets drop to one card under the council of a kind (rosterDuplicateDraws, re-measured with its
cause).

**Every reader of a house's face by key** (`grep` over src for `institution?.key ===`, `facesByHouse(`,
`faceOfHouse(`, `seatHouseFaceOf(`, and `rec(...institution).key`):
- `components/new/tabs/InstitutionsTab.jsx`: `facesByHouse`, then `seatHouseFaceOf`; the row carries `seatFaced`.
- `domain/crisis/crisisCast.js :: faceOfHouse`: the house's own face, then `seatHouseFaceOf`.
- `generators/people/ties.js` :137 and `castPowers.js` :361 and :427: the seat by rank 1 first; `memberOrJoin`.
- `domain/people/allegiance.js` :282, :325, :370: criminal houses only, never the seat's.
- `generators/people/goals.js` :481 and `domain/people/patronage.js` :194: a card's OWN key, not a lookup.

## 4. (c) The goldens that move

In `COHERENCE-POWERS-shift-record.DRAFT.json`, predicted at this tip:
- generator-golden-master: 493 configs;
- dossier-prose-manifest: 648 rows;
- the Herald desk golden and the espionage fence: hash.

The record also names the null-change pins that read the recorded corpus, and every other driven figure the merge
seat keys. No golden door was run on the lane.

## 5. The equal-failing-set statement

Measured by running tests/generators, tests/domain, tests/property, tests/lint, tests/build and tests/architecture
over the lane's final tree: 2a6b0357a plus this hand-back's documents and the re-emitted edge bundles, which are the
two commits that follow it. Base decc7bf15 fails **1** title: the tests/lint/ledgerCitationIntegrity.test.js file. It
still fails at this tip, unchanged. This tip fails **52**: the base's 1, plus **51** that this lane moves. None was
red at base and green here before being re-keyed; every title the lane moves is named below, with its cause.

| class | titles | the cause | whose act |
|---|---|---|---|
| the goldens and the null-change pins that read them: generatorGoldenMaster, espionageDormancyFence (the driven golden), heraldKnowledgeDeskGolden, dossierProseManifest (3), dmLayerGoldenIsolation A7, nameHeldThroughAssembly A1, pipelinePinnedChoosers A1, pipelinePinnedMode A1, A2, A5, powerEconomyFreshness A4, rosterFinalUnderHeldRoster A1, worldFactRederive A7, editWorldFactResources A2, A6 | 17 | the lane moves every birth's cast where a house leads, the roster where a power has no house, and the government where a council of a kind has none | the merge seat, under the drafted record |
| digests and fixtures re-taken by their own writers: x46NpcBand (57 of 60 dark digests), institutionBudgetPromise (57 of 60), intentAtlasSoakDistiller, landingFixtureFreshness (2) | 5 | the same | the merge seat, at the merge point |
| measured figures that move with the cast: hookThemeDraws (2157 → 2105, one hook per card), generationForkCensus A1 (control hash) and A6 (external fnv1a32 callers 15 → 13, the seat mint reached less often), editCorpusRatchet A3, A5, A7, mergeLadderHeldKeys A3 | 7 | the same | the merge seat |
| composed-prose identities: proseFamilyContract A1, A2, A3, A5 | 4 | the corpus's composed prose moves with the cast | the merge seat |
| the worked-example towns: proseComposed A13, proseTasteInterested (2) | 3 | the named town is no longer corrupted: its new leader is no agent | the merge seat (re-key by identity to a town that is) |
| writerReach (9) | 9 | the re-bank | the merge seat (its charter) |
| observedShapeReaders (4) | 4 | the corpus grew (wizard news 2,525 → 2,638); five rows of instrument erosion on the pulse kernels; no field of this lane's, no lost reader shown | the merge seat |
| presumedThings ARM 2 | 1 | npcData.js :1954's counting-house line, drawn by a council of a kind's new Merchant Council in a corpus town with no bank (PRESUME's class) | named, not cured |
| statecraftExposureBand | 1 | the mobilization floor: a driven figure of this wave (the population says NOT SYSTEMATIC); the dark twin reads 12 here | the merge seat, by the test's rule (dark twin − 10) |

Every structural ratchet the lane touched is green at this tip:
- the any-cast baseline, the label seam, the ruin filter, mutation coverage;
- the lighting census, the wiring census, the legacy faction-reader list;
- the line ceiling, the M-1b seat pins, captureBirthScale;
- both COHERENCE-POWERS guards;
- the engine bundle and service rows (bundles re-emitted).

## 6. What was banked

**Nothing.** No row entered any baseline, no pin was loosened, and no test was skipped. The lane's own census and
ratchet moves each used the instrument's own writer, on a clean tree, with the cause named:
- the lighting census, three times;
- the wiring census stamp;
- the ruin filter's reader count, plus one EXEMPT row with its reason;
- two mutation-coverage rationales, each with its executed red-first proof;
- the legacy faction-reader site, re-keyed by identity (the same dead read, 20 lines lower);
- the instant-world twin census, re-recorded in both of its places.

The re-keyed pins are exact identities, each with its cause:
- the M-1b role pins: the office where `dualHatHouseOf` names the house, else the title;
- powerCardOrderReads P50: the religion row's thorp stands its priest's house, and without one it is an Elder
  Council, asserted;
- rosterDuplicateDraws, re-measured twice.

## 7. Found, not mine

- **The counting-house line** (`src/data/npcData.js` :1954, the creditor tie "... approved in X's counting-house"):
  it presumes a bank. A council of a kind's new Merchant Council draws it in a corpus town with none
  (presumedThings ARM 2). This is PRESUME's class (declare `bank`, write its twin), named red here and not cured.
- **The npc ladder's top rung as "the ruler"**: for the second seat (the phase-2B note, section 7). The readers are
  war seat books (`rulingSeatId`, `rulerTraits`, `rulerStanding01`) and gratitude bonds (`rulingSeatNidOf`,
  `seatGratitudeSevToward`). The top rung is not the leader in 44 of 360 at base and 50 at the tip. The one-line
  order is quoted there. The patched run gives exactly the tip's figures.
- **The 21 powers a stress brings with no one on the page**: for the second seat, each read under the chair's (a),
  (b), (c) (the phase-2B note, section 9). The Peerage 8 (a); People's Council 3 (b); War Council 3 (a); Resistance
  Network 3 (b); Quarantine Council 2 (a); Occupation Authority 1 (a); Reform Congregation 1 (a).
- **The five erosion rows** on the pulse kernels (legitimacy on factions, thievesGuildStrength on settlement): the
  walker's corpus grew (wizard news 2,525 → 2,638 accumulated). No field of this lane's, and no lost reader shown.
  That is the limit of what I proved. The merge seat triages them.
- **The player record keeps a veiled face's `institution.title`**: the chair seated a veil check for it; not touched.
- **Phase 1 measured with the density law off.** The probes called the pipeline without `birthConfig`; every 2B
  figure is re-measured through it.

## 8. The two mobilization counts, reconciled

The test counts `war_mobilization` entries in the year captures' raw wizard news (impactKind, else kind), twenty
years, head on. On that metric:
- decc7bf15 reads **306**;
- this tip reads **27**.

The **82** in my first report was the test's own message, "the dark twin: 82". That is the head-DARK figure the floor
of 72 was keyed from on 2026-11-09 (82 − 10), not the base's live figure. The dark twin today reads 71 at decc7bf15
and 12 at this tip.

The population says NOT SYSTEMATIC. The floor is named red at this tip as the merge seat's act, keyed by the test's
own rule (dark twin − 10), never here.

---

# PART 2 — the second seat (COHERENCE-POWERS-2, 2026-11-12)

The second seat took the lane at e071dc60e (the first seat's type fix f650b5abd and its re-emitted bundles on top of
77c5b3e53) and was its only writer from there. Every figure below is on the second seat's corpus (L2): **2,460 births
through `birthConfig`**: on random dials, `critique-<tier>-<i>` for thorp 150, hamlet 150, village 60, town 160,
city 100 and metropolis 40; and every one of the 15 stresses forced (`selectedStresses: [stress],
selectedStressesRandom: false`) × six tiers × 20 (`l2-<stress>-<tier>-<i>`). The probes and their seeds are in
`docs/chair/2026-11-11/probes/COHERENCE-POWERS-2/` (README there); each takes the tree it measures as its first argument.

## 1. The three type and lint gates (L1)

| tree | domain-strict | typecheck:ratchet | eslint (the lane's src files) |
|---|---|---|---|
| decc7bf15 (base) | 0 | 0 | — |
| 77c5b3e53 | **1** (+7 in powerSupport.js) | **1** (+7 over six lane files) | 0 |
| e071dc60e (f650b5abd) | 0 | 0 | 0 |
| every second-seat commit touching `src/` | 0 | 0 | 0 |

## 2. Item 0 — the lane on all six sizes (the STOP, and the chair's rulings)

The first seat's 1,000 births were four tiers on random stresses (village 170, town 440, city 280, metropolis 110).
On the L2 corpus at e071dc60e (base decc7bf15 in brackets):

| class | 4 tiers, random | thorp + hamlet, random | stresses forced |
|---|---|---|---|
| leader is the office, no house of the leader's kinds | 0 | 80 / 300 | 161 |
| leader is office where a house stands; kind not in the three; council of a kind with no house | 0 [217 councils] | 0 [23] | 0 [626] |
| roster power or density rival with no one on the page | 0 [20] | 0 [28] | 0 [~110] |
| Thieves' Guild with no card | 0 | 0 | 7 [7] |
| stress power with no one on the page | 6 | 2 | 82 |
| capture none/equilibrium/corrupted/adversarial/capture | 276/32/32/18/2 | 299/0/1/0/0 | 1445/218/100/35/2 |

New kinds the 1,000 did not show, and the chair's rulings (2026-11-12, vetoable by the owner):
- **The small place with no house but its households**: by design, one hat; the guard exempts exactly a place with no
  open faced house but the government's. Where an open faced house stands, the rule holds (built: §5 below).
- **The stress powers are twelve names, not seven**, keyed by the stress of origin. The first seat's mapping of the
  People's Council was wrong: it comes from insurgency. New: Conversion Enforcement Office and New Faith Community
  (religious_conversion), Grain Holders (famine, the strongest power of l2-famine-village-7), Monster Hunters /
  Adventurers (monster_pressure); The Highborn Circle is succession_void's second pool-drawn claimant, one case with
  The Peerage. The rule gained step (0): a person of the house the power sits in by its nature.
- **The Thieves' Guild with no card** (7 forced births, equal at the base): it stands as a power with no house of its
  own (rulingStructure.js gives a small place's "local protection operation" its own description); no agent is dealt
  to it; in 4 of 7 it does not exist without the stress.

## 3. Item 1 — PRESUME's final tip

`origin/lane/coherence-presume-2026-11-11` at 02c5f8fbd merged theirs into ours at **1981a999d** (15 commits after
081928512). No source file was touched by both sides; the engine bundle and its meta kept ours (re-emitted last), the
lighting census was re-frozen by its own command (dd87d3324). The presumed-things walker on the merged tree, which now
reads denials and time: one red, the counting-house line (item 2), and nothing else in lines this lane draws.

## 4. Item 2 — the presumed bank (fbbaa82e6)

`npcData.js :: STRESS_ECONOMIC_EFFECTS.gov_econ_dependence.desc#6` declares `needs: institution: bank`; the CENSUS-4c
ledger row carries it. **Arm 2: 1 fresh line → 0.** Guard: presumedThings walker 17 of 17; presumeCorpusSeeds' new
case (presume-town-72) red first. The banked "figure" row covering the same line in relationships was stale with it and
left. **No twin row (a call of mine, vetoable):** the tie pool pairs desc and tension by one index, so a ninth desc line
needs a ninth tension line and re-indexes every Financial Dependence tie in every town; a refused index moves to the
admitted ones, and desc#2 already says the same with no bank ("costed, quietly, in X's counting-room").

## 5. Item 3 — the powers a stress brings (2eb44e935 guard, 67278c2c1 cure) and the small places (00823a145)

The table is `src/data/stressPowerFaces.js`, its one reader `src/domain/people/stressPowerFaces.js`; the casting is
`castPowers.js` (two mints in `landMemberships`, `seatStressPowers` after the ranks); the Power tab prints the declared
line (`PowerStrata.jsx :: FactionRow`).

| on 2,460 | before (fbbaa82e6) | after |
|---|---|---|
| powers with neither a person nor a declared line | **89** (82 stress powers, 7 Thieves' Guilds) | **0** |
| Occupation Authority faced by the occupier's man (minted) | 0 of 81 (68 the town's own soldier, 13 no one) | 81 of 81 |
| Thieves' Guild with no house: its master, veiled | 0 of 7 | 7 of 7 |
| a stress power seated from the house of its nature (0) or its cast's houses (a) | — | 7 (War Council 2, The Highborn Circle 2, Quarantine, Reform Congregation, The Peerage) |
| its declared leaderless line (b) | — | War Council 26, The Peerage 9, People's Council 8, Quarantine 8, Reform 8, The Highborn Circle 3, Resistance 3, New Faith 2, Enforcement 2, Grain Holders 1, Monster Hunters 1 |
| leader · ruler · capture · any label · any power figure moved | — | 0 · 0 · 0 · 0 · 0 |

Guard: `tests/generators/people/stressPowersFaced.test.js`, 22 seeds, red 2 of 4 at its commit, 4 of 4 after.
Readings of mine, vetoable: the War Council, the Quarantine Council and the claimants' party fall to (b) where no house
of their nature has a free face (a committee, a claimants' party by their own descriptions), never (c), since the
roster prints their power beside them. Found, not cured: 28 stress powers whose first came by a house's own share is a
face that already leads another power (the miller who leads the Headman's Authority and the Grain Holders); the rule
seats no such face.

**The small places** (00823a145): a civic leader whose town has no trade or landed house comes from its heaviest open
house of another kind. **The leader moves in exactly 5 births** (critique-hamlet-5, critique-hamlet-99,
l2-indebted-hamlet-7, l2-indebted-hamlet-18, l2-mass_migration-hamlet-19); no label. A leader who is the office where an
open faced house stands: 5 → 0. **Exempt by the chair's (i): 236** (thorp 150, hamlet 86; on random dials 45 thorps and
21 hamlets, i.e. 66 of 300; 33 hold only hidden criminal houses, which never lead). Guard: powersDualHat gains two
charter-hall hamlets (red first) and an exempt thorp. One pin re-keyed with the cause: castPowers.test.js's fixture is a
civic Elder Council whose only open houses are military, so its castellan now leads.

## 6. Item 4 — the ladder's top rung (bd4afc382 guard, 9f7aedb99 cure)

The chair ruled the second seat's proposal: the order, not the readers. `npcLadderState.js :: eligibleMembersOf` sorts
by the card's rank in THIS power first. The readers that mean "the ruler": gratitudeBonds.js :: rulingSeatNidOf (the war
seat books' rulingSeatId, rulerTraits, rulerStanding01; seatGratitudeSevToward; applyWorldPulse.js's court gratitude),
warPeaceDecision.js, the ladder's governing seat and designateHeir, powerStrata.js's seat line, powerStateProse.js
DS-POW-3, powerDeskRead.js. They reach a person on the dossier's seat line and the Power tab's ladder rows of any lived
town, in the realm's news (the Herald desk), and in the founding worlds.

| on 2,460 (probe reach.mjs) | before | after |
|---|---|---|
| governing first-lit top rung is not the leader | **279** (62 of 660 random, 217 of 1,800 forced; the four-tier 360: base 44, lane 49) | **0** |
| every power: top rung is not its own rank-1 card | — | 0 |
| other powers' top rungs that change (the chair's condition 3) | — | 105 of 6,130 |
| a saved ladder stepped under the new order keeps its rungs | — | yes (the guard's third check, 15 seeds) |

L3 (the same order in a scratch tree on fbbaa82e6): **no generated record differs in 2,985** (the golden's 525
configurations and the 2,460, whole-record sha256); **no test title moves** in the six directories; it moves figures
only inside rows already the merge seat's (heraldKnowledgeDeskGolden's hash; writerReach's population 1733 → 1731 and its
unrowed dark identities 28 → 41; observedShapeReaders' reads 2186 → 2188; proseFamilyContract A1's rows 38372 → 37712).
**The twenty-year soak: mobilizations 27 = 27 patched and unpatched, scandals inside the band in both** (the first
seat's equality confirmed; 27 also at 74b3b4949). The printed case, the dossier's seat after one step of the ladder:

```
Xiaguan (critique-town-10), Guild Council; the birth's leader: Wu Yang, the senior guild master and Alderman
  before: the seat — Li Liu, first of the governing house (via the ladder)
  after:  the seat — Wu Yang, first of the governing house (via the ladder)
```

**For the lane that regenerates the founding worlds:** their ladders are composed at first light and follow the new
order (the leader on the top rung).

## 7. How both hats and the stress powers print (print.mjs at 00823a145; `five-towns.txt` beside the probes)

```
Breitthal (critique-thorp-0) — a thorp, ruled by Household Council           (exempt: the office's own words)
  Household Council (100): first Irene Weber, the eldest householder
Shangcheng (critique-hamlet-5) — a hamlet, ruled by Headman's Authority      (the charter hall leads)
  Headman's Authority (100): first Noriko Guo, the charter master and Headman
Hutang (l2-famine-village-7) — a village, ruled by Headman's Authority, under famine
  Grain Holders (51): It is no one body: it is every household and dealer with a full bin.
  Headman's Authority (49): first Ying Liang, the miller and Headman · second Yue Hu, the cooper
Albapagus (l2-occupied-village-0) — a village, ruled by Headman's Authority, under occupation
  Occupation Authority (56): first Felicia Gallus, the occupying governor
  Headman's Authority (44): first Vera Rufus, the mine captain and Headman · second Cato Gratus, the quarry master · third Sulpicia Corvinus, the stable keeper
Montenovum (l2-plague_onset-hamlet-1) — a hamlet, ruled by Free Elder Council, under plague
  Free Elder Council (60): first Calvus Silanus, the boat-headman and Elder · second Cornelia Flavius, the head shepherd · third Decius Silanus, the dairy farmer
  Quarantine Council (40): It has no one head: the households of each street keep the quarantine among themselves.
Niederwiese (l2-famine-hamlet-6) — a hamlet, ruled by Feudal Stewardship, under famine
  Thieves' Guild (49): first Guta Richter, the guildmaster (veiled)
```

A second exempt small place prints as the thorp does: Roccaoppidum (critique-thorp-3), Elder Council, first Celer
Cicero, the household elder.

## 8. The equal-failing set (the six directories)

Base decc7bf15: 1 title (ledgerCitationIntegrity: the ledger branch's local ref, absent in a fresh checkout). The first
seat's tip: 52. At c600ab68c the whole-directory run read 65: the set at 74b3b4949 plus two tuningRegister titles from
item 4's named sort key, cured in the next commit (the key inlined; the walker green). So, before the bundles, **the same
set as 74b3b4949, 63 titles**, of which the 9 engine-bundle titles
(engineBundleReplay 4, engineServiceStoreParity 4, engineServiceCore 1) are the merge keeping our bundle and leave with
this lane's last commit. So **54 at the tip**: the first seat's 52, less presumedThings ARM 2 (cured, item 2), plus three
the first seat's statement did not name, each read at e071dc60e already:

| title(s) | whose |
|---|---|
| newsVoiceContract, newsHeadlineContract (file-level: the observed corpus's Wizard News introductions 395 → 412) | the merge seat: the observed-corpus class the first seat named under observedShapeReaders (red at e071dc60e and at PRESUME's 02c5f8fbd, green at decc7bf15) |
| observedShapeReaders, a fifth title | the same class |

Every other title is the first seat's table, unchanged in kind: the goldens and their null-change pins (the generator
golden master 519 configurations, the dossier manifest 782 rows, the Herald desk and the espionage fence), the digests
re-taken at the merge (x46NpcBand 59, institutionBudgetPromise 58, the intent atlas, the landing fixture), the measured
figures (hookThemeDraws 2157 → 2105, generationForkCensus A1 and A6, editCorpusRatchet, mergeLadderHeldKeys), the
composed-prose identities, the worked-example towns, writerReach and the mobilization floor (statecraftExposureBand:
27 mobilizations, the dark twin's rule) — all THE MERGE SEAT'S ACTS, under the drafted record. Cured by the second
seat beside the items: noLegacyFactionReaders (red at e071dc60e: f650b5abd moved a listed line; re-keyed by identity).

**Banked: nothing.** No baseline row was added, no pin loosened, no test skipped. Registers re-taken by their own
writers with the cause: the lighting census (three times), the wiring census, the phone chrome floor, the prose
numerics rows (identity), the legacy faction-reader site (identity), one mutation-coverage rationale with its red-first
run.

---

# PART 3 — the third seat (COHERENCE-POWERS-3, 2026-11-12)

The third seat took the lane at 1a32c200a and cures the thirteen findings of
`REVIEW-POWERS-1a32c200a-2026-11-12.md` (on `lane/chair-2026-11-08`). It works in a scratch git worktree (the main
checkout refused a checkout; it has no node_modules) and COMMITS LOCALLY: its push was refused by its session's
auto-mode classifier ("[Undermining Oversight]"), the chair was told the same minute, and the chair has asked the owner.
This part is kept current at every commit.

**Base for every field diff: the line at f72262c68.** THE TWO CORPORA (L2), every birth through `birthConfig` with
the browser's dials, the golden's 525 as the golden calls them: R, the reviewer's (rvw 100 × 6 tiers; rvf 15 stresses ×
6 tiers × 8; golden 525) = 1,845; S, the second seat's (critique 150/150/60/160/100/40; l2 15 × 6 × 20) = 2,460. The
third seat's probes (`dump.mjs`, `plan.mjs` with a probe tree's density law logging its plan, `sound.mjs`, `f1.mjs`,
`hashdiff.mjs`) live in its scratchpad and are committed under `probes/COHERENCE-POWERS-3/` with the lane's last docs.

## 1. The merge at the start (47a66774a, eedd48a6d, e17edb8ee)

`lane/pool-guard-2026-11-12` at 5b31cdfcc (cut from the line at f72262c68), theirs into ours. No `src/` file touched by
both sides. Taken whole from the line's side: the wiring census, the lighting census, every edge bundle. Re-taken by
their doors: the lighting census (eedd48a6d), the wiring census's stamp (e17edb8ee). Row-keyed, merged without
conflict, each side's rows as its owner wrote them: the mutation-coverage manifest, the presumed-things register.

**The review's sound results at the merged start, on all 4,305 births:** the seat row names someone other than the
leader 0; the seat house's Connection row 0; an office face beside a house head 0; a council of a kind with no house of
its kind 0; the governing top rung at first light not the leader 0 (the line: 428); any power's top rung not its first 0
(the line: 266); two cards sharing a name 0.

**The repetition guard** (`node scripts/census/pool-dominance.mjs`, 2,050 towns, 150 s): 0 over, 0 stale, 0 loose,
**6 with no row**: `ledger:NPC_STRUCTURE.magic__{contested,corruption,economic_stress,governance_fractured,stable}__dominant`
and `ledger:NPC_STRUCTURE.other__corruption__dominant`, pools this lane newly reaches. The chair's ruling: `--tighten` is
not run; the six wait for the narrow door the agreement lane's seat is adding, and are named in the draft record; the
walker's "every drawn pool has a row" is red on this tree for that cause alone.

## 2. Per finding (the reviewer's count, before → after, and the guard)

| finding | commit | before (merged start) | after | guard |
|---|---|---|---|---|
| F12 the packed ceiling | f064cb83c | rulingStructure.js 799 lines, 5 packed lines | 792 lines, 2 (both predate the lane) | powerStructure.test.js "no power/ module packs more statements onto shared lines than its ceiling", red first (5 packed lines) |
| F1 the political mass | 97759b837 (census c02bbb48f, manifest 8f72fbc90) | the pure seat-ceiling cut R 19, S 40 | R 0, S 0 | dualHatPoliticalMass.test.js, red first 8 of 8 (the reviewer's crisis and small-place seeds, literal powers) |
| F2 the final roster's text | 28c93c9da, dd02efe9f (holder re-key d349325ad) | strings naming a power the final roster lacks, both corpora (line → merged start): tension chips 417 → 438, descriptions 168 → 212, rank lines 87 → 104, narratives 200 → 200 | 0 · 0 · 0 · 0 | powerTextFinalRoster.test.js, 120 births born with and without the density law, red first (twice) |
| F7 the empty seat | 859c11ff8 | vacant births where a place prints the office as held 194; doubled Connection titles 7 | 0 · 0 (records 0 of 4,305 move) | seatKeeper.test.js, red first |
| the occupier and the fractured realm (rulings (1), (2)) | 9bcda8ff6 | occupier absent 50 of 168 forced; fractured with one power 42 of 168 | 0 of 178 · 0 of 205 | crisisSeat.test.js, red first |
| the lane's two reds in tests/components | 39086c96b | powerSeatRender: 2 red (green at the line) | re-keyed by identity to thorp 57 | — |
| F5 the veil | 88616babb | unveiled memberships in a clandestine power 47 (R 17, S 30; 22 towns) | 0 (only the veil bit moves, 22 births) | stressPowersFaced pins the review's 7 towns, red first |
| F4 the missing rows | a41c5b4f4 | powers with neither a member nor a line 4 (R 3, S 1) | 0 (1 record moves) | stressPowersFaced pins the review's 3 towns, red first |
| F6 the crisis power's leader | 9b1bcc3fd | crisis powers led by a person who leads another 44 (R 14, S 30) | 0 (44 births: the first, the cast's order; 12 on their declared line) | stressPowersFaced's second check reads every first, 4 pins, red first |
| F13 the crisis guard on a corpus | b1a3934fa | 22 seeds | the pins + 180 births (15 crises × 6 sizes × 2); red at the merged start (3 of 4 checks, 33 rows) | stressPowersFaced.test.js |
| F10 the card's two offices | 01ccf258f | an office's title beside the office held: 189 (R 52, S 137) | 0 (print time; records 0 of 4,305) | dualHatReaders.test.js, red first |

F12's L3: 0 of 4,305 whole-record hashes differ, merged start against the split. The split is SIZED: docs and sealed
packets cite this file's lines up to :787 and the citation walker reds a new past-EOF citation, so the small cohesive
helper moves (normalizeAndAnnotateFactions, re-exported), not the chooser (that would leave 661 lines and fifteen new
past-EOF citations, measured).

F1's proof (both corpora, the resize plan logged in a probe tree): of the reviewer's 19, the 8 crisis powers stand again
and their coup labels read the line's (Contested; rvw-hamlet-66 Holding); the other 11 (Religious Authorities 9, the
Military Party, one more) had no member and no house at the line and now leave by the not-built rule, which the cut
had reached first. Births with fewer powers than the line: the fold 107, the not-built rule 205, the council of a kind
30; any other cause 0. More powers than the line: 0. The mass differs from the line's in 3 births, each a council of a
kind. **THE STOP (F1's measure), sent to the chair with one proposal ("the crisis seat"):** the forced-crisis births
where none of the crisis's own powers is on the page read 1,525 at the line and 1,524 at the cure, of 2,520; the class
predates the lane (the table in the chair's message and in the probes' `crisis.mjs`). Nothing of it is built before
the ruling.

F2: a lane-owned pass (power/rosterText.js) after the roster's last power write re-annotates the standing with
factionStanding.js's own function (imported), prunes or re-points the tensions' parties, and takes the declared sibling of
the merchants' and craftsmen's vote (factionDynamics.js :: MERCHANT_CRAFT_VOTE, the chair's ruling (a)). It moves only
descriptions (1,281 births), tension parties (413) and the 200 narratives; rosters, cards, seat row, coup, capture 0; the
golden's 525: 0. Most of this class is the density law's trim and predates the lane. The remaining hits of the probe
are house names (the criminal institutions, income sources: 90 of 90 a house the town holds) and never-printed fields
(the simulation trace, `factionSource`). The holder table cites assembleSettlement.js by line: F1's and F2's import
lines moved three rows (red at 97759b837), re-keyed by identity at d349325ad. FOUND, the line's: a doubled-niche rival
copies its parent's description and standing sentence at its own rank.

**The chair's rulings of 2026-11-12 on F1's stop and F7's table:** the crisis seat for every crisis is NOT built (a
design question for the owner, with the table above as its measure); built instead: an occupation seats its occupier
at every size; a fractured realm shows two powers if any shows one; for every other crisis no printed line names or
presumes its absent power. F7: "Acting <office>" for every office, the crown's monarch "Regent", the exempt small
place's "Eldest" acting as the government's office word.

**THE CRISIS-POWER MEASURE (F1's stop), as sent to the chair, a design question for the owner:** the forced-crisis births
(the reviewer's rvf 8 and the second seat's l2 20 per crisis per size: 28 per cell) where none of the crisis's own powers
is on the page, the line f72262c68 → F1's tree:

| crisis | its own power | thorp | hamlet | village | town | city | metropolis | all |
|---|---|---|---|---|---|---|---|---|
| famine | Grain Holders | 27 → 27 | 24 → 24 | 18 → 18 | 13 → 13 | 5 → 5 | 2 → 2 | 89 → 89 of 168 |
| indebted | Creditor's Representative / Crown Creditors | 28 → 28 | 23 → 23 | 21 → 21 | 23 → 23 | 15 → 15 | 6 → 6 | 116 → 116 of 168 |
| infiltrated | a hidden pool power | 28 → 28 | 24 → 24 | 17 → 17 | 15 → 15 | 15 → 15 | 11 → 11 | 110 → 110 of 168 |
| insurgency | People's Council / the reform body | 24 → 24 | 23 → 23 | 17 → 17 | 12 → 12 | 13 → 13 | 3 → 3 | 92 → 92 of 168 |
| mass_migration | Newcomers' Settlement / Departure Committee | 28 → 28 | 22 → 22 | 20 → 20 | 22 → 21 | 20 → 20 | 17 → 17 | 129 → 128 of 168 |
| monster_pressure | Monster Hunters / Adventurers | 28 → 28 | 28 → 28 | 25 → 25 | 25 → 25 | 25 → 25 | 22 → 22 | 153 → 153 of 168 |
| occupied | Occupation Authority | 26 → 26 | 20 → 20 | 4 → 4 | 0 → 0 | 0 → 0 | 0 → 0 | 50 → 50 of 168 |
| plague_onset | Quarantine Council | 28 → 28 | 24 → 24 | 19 → 19 | 21 → 21 | 13 → 13 | 12 → 12 | 117 → 117 of 168 |
| politically_fractured | Loyalist Noble Bloc / a pool bloc | 18 → 18 | 21 → 21 | 13 → 13 | 18 → 18 | 8 → 8 | 5 → 5 | 83 → 83 of 168 |
| recently_betrayed | The Inquiry | 28 → 28 | 23 → 23 | 21 → 21 | 21 → 21 | 19 → 19 | 12 → 12 | 124 → 124 of 168 |
| religious_conversion | New Faith Community | 28 → 28 | 18 → 18 | 20 → 20 | 16 → 16 | 14 → 14 | 6 → 6 | 102 → 102 of 168 |
| slave_revolt | Revolt Leadership | 25 → 25 | 21 → 21 | 23 → 23 | 16 → 16 | 11 → 11 | 2 → 2 | 98 → 98 of 168 |
| succession_void | a claimant | 25 → 25 | 22 → 22 | 14 → 14 | 15 → 14 | 9 → 9 | 3 → 3 | 88 → 87 of 168 |
| under_siege | War Council | 27 → 27 | 24 → 24 | 9 → 9 | 6 → 6 | 8 → 8 | 2 → 2 | 76 → 76 of 168 |
| wartime | War Council | 26 → 26 | 24 → 24 | 16 → 16 | 17 → 18 | 11 → 11 | 4 → 4 | 98 → 99 of 168 |
| all | | | | | | | | 1525 → 1524 of 2520 |

The occupation's and the fractured realm's rows are built since (9bcda8ff6): 0. **Ruling (3), measured and classed as the
crisis's actors in prose, not findings:** in the births where the crisis's power is absent, lines naming it — indebted
123 (secrets 106, the pressure sentence 17), slave_revolt 102 (the crime line 98, a conflict's issue 4), occupied 9
(gone with the occupier seated), insurgency 9 (history hooks); 0 say an absent power holds or shares power (the nearest,
the pressure sentence's "every civic decision since has been made with one eye on what they might accept", read as
influence). **F7's descriptive titles:** "Eldest" alone (its acting form is the government's office word: "Acting
Elder", "Acting Household Elder").

## 3. WHERE THE THIRD SEAT STOPPED (context near the brief's 450k), and what remains

The tip is LOCAL and UNPUSHED (the push refusal stands): 9b1bcc3fd plus this docs commit, in the scratch worktree
`<scratchpad>/lane` of session 01FbPLbfdembsPzt7xUbv24Y. The probes are committed under
`docs/chair/2026-11-11/probes/COHERENCE-POWERS-3/` (`corpus.mjs` the two corpora; `run.sh <tree> <label>` the dump;
`instrument.mjs` + `runplan.sh` the probe tree's resize log; `f1.mjs`, `crisis.mjs`, `text.mjs`/`textsum.mjs`,
`f7.mjs`, `f456.mjs`, `hashdiff.mjs`, `sound.mjs`, `crisislines.mjs`).

**Remaining, in order (the chair's order of 2026-11-12):** F9 (the dual-hat guard reds on the review's planted fault,
births through birthConfig; the four pins' expectations as literals); F11 (the draft record's six surfaces measured at
the tip; whoRunsThisTownDm re-keyed by identity to a birth with a hidden boost); F3 (the claimant faced by the
succession's cast, minted as the occupier's governor is; the old families' body on the next free noble rung; STOP if a
mint needs a card a guard refuses); F8 (the capture table, line f72262c68 against the tip, by kind, both corpora, FULL
capture only with a criminal power standing, with l2-politically_fractured-metropolis-13 by name; the named-house check).
THE LONG RUNS ARE A SUCCESSOR'S (the chair, 2026-11-12): the wars (thirty realms, the restated line); the whole-lane
field diff; the ONE draft record current (the six pools waiting for the narrow door; the crisis table as a measure; the
capture table; the mobilization count; the crisis seats' coup moves by crisis and size); L5's whole-suite failing set at
the final tip; the edge bundles re-emitted last, alone.

**The chair's notes of 2026-11-12 recorded:** the two `tests/components/powerSeatRender` reds were THE LANE'S OWN before
the third seat (green at the line f72262c68, red at 1a32c200a: the not-built rule), re-keyed by identity at 39086c96b.
Ruling (3) CLOSES WITH NOTHING BUILT: 234 lines read, 0 say an absent power holds or shares power. The crisis seats'
coup label moves (103 toward danger, 8 toward safety, 9bcda8ff6) are the occupation and the fracture being shown: the
draft record owes them by crisis and size; the one capture move toward danger (l2-politically_fractured-metropolis-13,
equilibrium → corrupted) goes into F8's capture table by name.
