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
| F9 the guard's strength | 5fdb0c023 (tests only) | the planted office-holder left powersDualHat green; four pins computed by the code under test | the plant reds 8 seeds; a wrong leader rule reds all four pins (7 titles) | powersDualHat (birthConfig), tests/helpers/dualHatOracle.js |
| F11 the PDF pin and the six surfaces | db6f17dc5 | whoRunsThisTownDm red (birth 785: no hidden boost); 4 surfaces named | re-keyed by identity to birth(5); 6 surfaces in the draft, 5 MOVED, the preset-lighting witness UNMOVED | — |

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

**F8, THE CAPTURE TABLE (measured, not yet closed):** `powerStructure.criminalCaptureState`, the line f72262c68 against
the tip after F11 (both corpora, 4,305 births; R the reviewer's with the golden's 525, S the second seat's):

| from -> to | direction | R | S | with a criminal power standing (R / S) |
| corrupted -> equilibrium | toward safety | 9 | 22 | 9 / 19 |
| equilibrium -> corrupted | toward danger | 6 | 21 | 5 / 13 |
| none -> corrupted | toward danger | 8 | 11 | 0 / 0 |
| corrupted -> none | toward safety | 6 | 12 | 0 / 0 |
| none -> equilibrium | toward danger | 4 | 6 | 0 / 0 |
| equilibrium -> none | toward safety | 5 | 5 | 0 / 0 |
| adversarial -> equilibrium | toward danger | 5 | 2 | 5 / 2 |
| adversarial -> corrupted | toward danger | 1 | 4 | 1 / 4 |
| equilibrium -> adversarial | toward safety | 1 | 4 | 1 / 4 |
| corrupted -> adversarial | toward safety | 2 | 1 | 2 / 1 |
| capture -> equilibrium | toward safety | 1 | 1 | 1 / 0 |
| equilibrium -> capture | toward danger | 0 | 1 | 0 / 1 |
| corrupted -> capture | toward danger | 1 | 0 | 1 / 0 |
FULL capture at the tip: 5 births; without a criminal power standing: 0

The chair's rule holds in every row: FULL capture never stands without a criminal power (0 of 5). The one move toward
danger the crisis seats made (l2-politically_fractured-metropolis-13, equilibrium -> corrupted) is in the S column of
equilibrium -> corrupted. NOT DONE: the check that wherever the hall's state is not clean the page names the house the
hall answers to (a state with no such name is a STOP with the town).

**THE THIRD SEAT STOPPED HERE (the chair's line, 600k; final).** The tip is local and unpushed (the refusal stands). WHAT
REMAINS, IN ORDER: (1) F8's named-house check, then F8 closed in the draft record with this table; (2) F3, the claimants
(faced by the succession's cast, minted and named as the occupier's governor is; the old families' body on the next free
noble rung; STOP if a mint needs a card a guard refuses); (3) THE LONG RUNS, a successor's: the wars (thirty realms, the
restated line), the whole-lane field diff, the ONE draft record brought final (the crisis seats' coup moves by crisis and
size, the mobilization count, the six pools' draws on both corpora), L5's whole-suite failing set at the final tip (the
ledger ref fetched first), and the edge bundles re-emitted last, alone.


**The chair's notes of 2026-11-12 recorded:** the two `tests/components/powerSeatRender` reds were THE LANE'S OWN before
the third seat (green at the line f72262c68, red at 1a32c200a: the not-built rule), re-keyed by identity at 39086c96b.
Ruling (3) CLOSES WITH NOTHING BUILT: 234 lines read, 0 say an absent power holds or shares power. The crisis seats'
coup label moves (103 toward danger, 8 toward safety, 9bcda8ff6) are the occupation and the fracture being shown: the
draft record owes them by crisis and size; the one capture move toward danger (l2-politically_fractured-metropolis-13,
equilibrium → corrupted) goes into F8's capture table by name.

---

# PART 4 — the fourth seat (COHERENCE-POWERS-4, 2026-11-12)

The fourth seat took the lane at b43eceeca and finishes it. It works in a scratch worktree on the lane branch itself (the
main checkout refused `git checkout` and `git switch`); `npm ci` there installed the hook manager's wrappers, so every
push ran the hook's three fast gates, plain, never `--no-verify`. **Base for every field diff from item 1 on: the line at
3575cf061.** The corpora are PART 3's (R 1,845 with the golden's 525; S 2,460), every probe a copy of PART 3's or new
beside them under `probes/COHERENCE-POWERS-4/`. This part is kept current at every commit.

### Calls taken without the chair (the chair's standing rule: declares or names, taken and listed here)

1. **l2-plague_onset-city-5's coup move toward danger** (the only one of 94 not under occupation or fracture): the
   not-built rule's renormalisation (902378261), a declared cause inside a ruled bound; declared by name here (section 5)
   and in the draft record.
2. **The six pools with no row** (section 6): named with their draws on both corpora; the repetition guard's walker red for
   this cause classed as the merge seat's act. Not banked.
3. **The earlier seats' reds first seen by the whole suite** (section 7): each cured through its own door with its cause,
   by identity or by a re-measure attributed commit by commit, one commit each: the seed-loop collection, the any-cast
   types (types only), the legacy faction-reader rows, the prose-numeric addresses, the held-key census's six rows, the
   generation snapshot, the DM panel's town, the live-corpus count, the three store keepers, the seam seeds, the phone
   floors. No pin loosened, no ceiling raised, no test skipped, nothing banked upward.
4. **The F3 guard's mutation-coverage row**: a rationale with its executed red-first, the third seat's form.
5. **The six surfaces** (section 8) declared at the tip in the record, each MOVED or UNMOVED, no door run.
6. **The merge seat's rows** (section 7): every title the draft record already names, classed to it; the founding worlds'
   row placed beside the landing fixture's two, as the chair ruled.

**Parked for the chair** (a ruled line or a pin would change): two, in section 12, sent together once.

## 1. The line taken (2b635f100, 49f29fe04, 178601d5a)

`origin/lane/integration-2026-11-07` at 3575cf061 (merge point 44, VISIBLE-BUGS, and the merge commits of point 45), theirs
into ours; merge base 5b31cdfcc. **No `src/` file is touched by both sides.** Touched by both: `.husky/pre-push` (the same
commit 7d429f6cb on each side, merged clean) and two generated registers that conflicted, taken whole from the line's
side and re-taken by their own doors: the wiring census (`--dry`: rows 0, the stamp only, producerIndexFiles 1322 -> 1328)
and the lighting census (files 3211 -> 3220, titles 29147 -> 29183; walker green 34 of 34). Gates of L1 at the merge:
domain-strict 0 (1113 of 1113), the type ratchet 0 (167 of 167), eslint on the 18 touched files 0. First push 178601d5a.

**Point 44 moves no generator output:** whole-record sha256, the line at f72262c68 against the line at 3575cf061, on
both corpora: **0 of 4,305 differ** (rvw 0/600, rvf 0/720, golden 0/525, critique 0/660, l2 0/1,800). So every measure
the third seat took against f72262c68 stands against 3575cf061.

## 2. F8 — the capture moves, CLOSED

The capture table is PART 3's (measured against f72262c68, which equals 3575cf061 on every birth; F3 moves no capture
state, 12 births read). The chair's rule holds in every row: FULL capture never stands without a criminal power, 0 of 5.
The one move toward danger the crisis seats made, **l2-politically_fractured-metropolis-13, equilibrium -> corrupted**, is
in the S column of equilibrium -> corrupted.

**The page check (owed), on both corpora at the tip:** wherever the hall's state is not clean, does the game master's
page name the house the hall answers to? Read from `patronage.js :: dmPowerViewOf(s).hall.line` (the Power tab's DM
panel and the PDF's DM chapter); a name counts when it is a power on the roster or an institution of the town and the
line carries it; the fallback words "the criminal houses" name none (`probes/COHERENCE-POWERS-4/f8page.mjs`).

| state | R (with the golden's 525): births / named | S: births / named |
|---|---|---|
| none (clean) | 1,430 / — | 2,023 / — |
| adversarial | 203 / 203 | 53 / 53 |
| equilibrium | 128 / 128 | 247 / 247 |
| corrupted | 83 / 83 | 133 / 133 |
| capture | 1 / 1 | 4 / 4 |
| **not clean, no house named** | **0** | **0** |

The rung the page prints equals the stored state in 4,305 of 4,305. No state stands with no name: no STOP.

## 3. F3 — a claimant is the succession crisis's own cast (c67c8319e; the census a083286b4)

Red first: `tests/generators/people/successionClaimants.test.js`, 4 of 4 (the review's two towns, the three metropolises
whose claimants a mine captain or a college master faced, seven bodies, a 36-birth succession corpus at every size).

THE RULE BUILT: the royal vacancy's two claimant powers ("Noble Claimant (Senior Line)", "(Reform Line)") have rows of
their own in `data/stressPowerFaces.js` (`claimant: true`, no leaderless line). The crisis's cast is derived after the
powers' people (`steps/resolveCrisisCast.js` reads the dossier's people), so it never holds a claimant at the mint; the
claimant is MINTED as the occupier's governor is (`castPowers.js :: mintsBySent`), on `CLAIMANT_FACE`: the title "the
lord", one faces already bear (the Noble Houses seat mint, so no honorific, hook or secret register gains a row), the
monarch's pool row. FLOOR 1 makes the mint the power's first; a house face dealt to it stands second. The old families'
body (a pool-named noble power: The Peerage, The Highborn Circle) takes a free noble house's face as before, else the next
member of the landed powers (Noble Families, Noble Houses, Landed Gentry, Manor Household) who leads no power
(`freeRungOf`), else keeps its line. The seat row names the persons: "Stands empty; 2 claimants circle: Dubravka Semyonov
for Noble Claimant (Senior Line), Galina Grbić for Noble Claimant (Reform Line). Regent Biljana Nikolić keeps the seat
meanwhile." No mint was refused by a people's or a veil's guard: no STOP.

| F3's class, both corpora (`f3count.mjs`, `f3sum.mjs`) | before (178601d5a) | after (c67c8319e) |
|---|---|---|
| claimant powers with no one on the page (the line printed) | 4 (R; rvf-succession_void-city-4, -city-6) | 0 |
| claimant powers faced by an unrelated house's face | 8 (R 4, S 4; metropolises) | 0 (that face now second) |
| the old families' body printing its line while a free landed rung stands | 9 (R 1, S 8) | 0 |
| seat rows naming a claimant power with no person | 2 | 0 |

WHAT MOVES (L3, whole-record sha256, 178601d5a against c67c8319e, both corpora): **12 births (R 4, S 8, the golden's 525:
0), every one under a succession crisis;** 10 cards added (the claimants), 0 removed, 0 re-dealt outside a succession
crisis; rosters 0; seat rows 5; coup, capture, stability, legitimacy and every power label 0 (the 12 read). The cards'
`importance` follows rank: the 10 claimants minor -> pillar; 6 displaced house faces pillar -> key; 8 persons taking a
rung key or notable -> pillar (of the 9 bodies, l2-succession_void-town-17's two shared one free rung: The Highborn Circle
took it, The Peerage keeps its line with none left). `seatKeeper.test.js`'s Grudino pin re-keyed by identity to the new seat row.

FOUND, NOT MINE: `tests/data/foundingWorldBones.test.js` "every promise holds in at least 19 of 20 forks" is red BEFORE
F3 (at 178601d5a; green at the line): "Mossgate: the religious authorities hold power · tag Religious authority — 15/20".
Bisected to the first seat's 1df17289f (the fold; green at 5915e3af0). In all five failing forks Church Council rules and
the houseless Religious Authorities folded into it (`mossgate.mjs`). Sent to the chair as a STOP; **THE CHAIR'S RULING:** the
founding worlds' row, under a class of its own, "the founding worlds' cards, re-matched when the worlds are made again"; the
promise is to be read by KIND (a religious power stands, or rules), a re-key by identity, never a loosening; the lane
touches neither the card nor its test and does not undo the fold. Named so in the draft record.

## 4. The wars — thirty realms against the line (the chair's restated line)

THE RECIPE: statecraftExposureBand's seeded run (composeReaderRegion, the deity case seated, head on, twenty years), only
the seed changes: the first seat's twenty (`pop-1` … `pop-20`; its `pop.mjs` was never committed, so `wars.mjs` rebuilds
it from the test's own code) and the reviewer's ten (`rvr-1` … `rvr-10`). Mobilizations counted the test's own way
(`war_mobilization` raw wizard news, impactKind else kind). The line at 3575cf061 against the tip (src at c67c8319e).
rvr-1 at the line reads 18, the reviewer's own base figure; every rvr realm at the tip reads the reviewer's tip figure.

**THE COUNT: realms that lose half their mobilized weeks: 4 of 30** (pop-6 146 -> 32, pop-13 36 -> 17, pop-16 209 -> 51,
rvr-7 1,054 -> 143). The line is a third, 10: **NOT CROSSED.**

| | the line | the tip | change |
|---|---|---|---|
| realms that ever mobilize | 30 of 30 | 30 of 30 | 0 |
| total mobilizations | 2,148 | 1,017 | −52.7% |
| the same without rvr-7 | 1,094 | 874 | −20.1% |
| realms that rise / stay / fall | | | 8 / 15 / 7 |
| the four NPC acts (sabotage, bargain, reform, suppress), summed | 20,090 | 19,171 | −4.6% |

Per realm, line/tip: pop-1 6/4, 2 125/117, 3 21/21, 4 40/40, 5 59/59, **6 146/32**, 7 26/26, 8 10/10, 9 10/10, 10 6/41,
11 64/66, 12 11/11, **13 36/17**, 14 6/6, 15 29/44, **16 209/51**, 17 15/15, 18 23/20, 19 14/14, 20 3/4; rvr-1 18/38,
2 63/65, 3 25/25, 4 7/7, 5 27/27, 6 3/5, **7 1,054/143**, 8 64/71, 9 14/14, 10 14/14. The total's fall is rvr-7's
twenty-year war ending by conquest in its third year (per year 66, 52, 52 … against 70, 52, 21, 0 …; conquest 0 -> 1),
pop-16's four-year war ending after one (conquest 2 -> 0) and pop-6's later wars not starting. Files: `wars/*.json`
beside the probe in the scratchpad; the table above is the whole of them.

## 5. The whole-lane field diff — the line at 3575cf061 against the tip (`whole.mjs`, `wholediff.mjs`)

Whole records of both corpora, line by line. **Births that differ: 3,674 of 4,305** (rvw 507/600, rvf 631/720, the
golden's 525: 376, critique 573/660, l2 1,587/1,800).

THE MOVED LEAVES BY FAMILY (count; numbers up/down; other values changed; added; removed):

| family | leaves | up | down | changed | added | removed |
|---|---|---|---|---|---|---|
| npcs[] (the cast) | 2,975,397 | 41,485 | 42,293 | 2,505,468 | 125,808 | 260,343 |
| relationships[] | 1,171,867 | 40,209 | 39,625 | 1,029,759 | 7,241 | 55,033 |
| simulationTrace[] | 15,468 | 0 | 0 | 10,909 | 1,267 | 3,292 |
| powerStructure.conflicts / conflicts[] | 12,552 / 12,216 | 0 | 0 | 8,245 | ~2,100 | ~2,000 |
| powerStructure.factions | 10,370 | 1,187 | 681 | 3,971 | 1,393 | 3,138 |
| stress.cast / stressors.cast | 8,707 each | 0 | 0 | 5,544 | 1,548 | 1,615 |
| generationCoherenceReceipt.judgments | 5,364 | 0 | 0 | 3,553 | 979 | 832 |
| powerStructure.factionRelationships | 3,173 | 108 | 32 | 931 | 546 | 1,556 |
| prominentRelationship.* | 10,881 (six leaves) | 0 | 0 | | 22 per leaf | 206 per leaf |
| history.currentTensions | 849 | 0 | 0 | 414 | 4 | 431 |
| pressureSentence | 657 | | | 657 | | |
| stress[] / stressors[] (the crisis's own rows) | 294 each | | | 127 | 104 | 63 |
| powerStructure.government / governingName | 159 each | | | 159 | | |
| powerStructure.criminalCaptureState | 139 | | | 139 | | |
| history.legacyAnnotations | 128 | 11 | 12 | 85 | 15 | 5 |
| powerStructure.recentConflict | 51 | | | 51 | | |
| availableServices.* | 496 | | | 382 | 80 | 44 |
| economicState.* (imports, food security, chains, safety, compound) | 153 | 15 | 23 | 90 | 14 | 11 |
| institutions[] | 52 | 1 | 0 | 4 | 45 | 2 |
| economicViability.* | 27 | 4 | 12 | 4 | 4 | 3 |
| history.historicalEvents | 9 | | | 7 | 2 | |
| powerStructure.publicLegitimacy | 3 | 3 | | | | |
| settlementReason[] | 1 | | | 1 | | |

THE FAMILIES OUTSIDE THE CAST AND ITS READERS (`famcheck.mjs`): every birth that moves `economicState` (46),
`history.historicalEvents` (8), `institutions` (5), `availableServices` (5), `economicViability` (5), `settlementReason` (1)
or `publicLegitimacy` (1) is a birth whose government moved (the council of a kind, declared): **0 such births without
it.** stability and legitimacy: 0 births move.

THE LABELS BY CRISIS AND SIZE (thorp, hamlet, village, town, city, metropolis; "none" = the random-dial births, whose
own stresses are drawn):

**The coup label: 94 toward danger, 185 toward safety.** Toward danger: occupied 26, 20, —, —, —, —; politically_fractured
17, 17, —, —, —, —; none 4, 9, —, —, —, — (each of these 13 carries an occupation or a fracture among its drawn stresses:
`coupdanger.mjs`, 48 occupied and 45 fractured of the 94); plague_onset —, —, —, —, 1, —. So 93 of 94 are the crisis seats
showing the occupier and the fractured realm (the chair's "103 toward danger" was 9bcda8ff6's own diff;
the whole lane against the line reads 93). **THE ONE OTHER: l2-plague_onset-city-5, Contested -> Critical**,
moved at the first seat's 902378261 (the not-built rule; green at 1df17289f, `onecoup.mjs`): The Landed Bloc (5), a power
of the roster's own that no house stands behind, is not built; the roster renormalises (Military/Guard 9 -> 10, weight
11.25 -> 12.5) and the incumbent's amplified 11.4 no longer reaches the third challenger, so the coup reader's gate opens.
A declared cause; its effect on the label is named here and in the draft record. Toward safety, by crisis (thorp …
metropolis): famine 3, 3, 1, 5, 3, —; indebted 2, 1, 1, 2, —, —; infiltrated —, —, 1, —, —, —; insurgency 2, 2, 3, 2, 2, —;
mass_migration 1, 2, —, 3, —, —; monster_pressure 1, 2, 2, 1, —, —; none 6, 39, 19, 7, 1, —; occupied —, —, —, 1, —, —;
plague_onset 1, 3, 3, —, —, —; politically_fractured —, —, 1, 2, 7, 1; recently_betrayed 2, 2, —, 3, 1, —;
religious_conversion —, 1, 3, —, 1, —; slave_revolt 4, 3, 2, 1, —, —; succession_void 4, 4, 4, 2, —, —; under_siege —, 2,
1, 1, 1, —; wartime 3, 1, 1, 2, —, — (the fold and the not-built rule, the safety the record declares).

**The capture state: 139 move (70 toward danger, 69 toward safety)**, equal to F8's table row for row (R 25 / S 45 toward
danger; R 24 / S 45 toward safety).

**The government: 159 move** (the council of a kind): thorps 60, hamlets 41, towns 57, cities 1 (an occupation), 0 in
villages and metropolises. **powerLabel by power name: 40 move**, towns 38, metropolises 2 (the roster's renormalisation).

## 6. The six pools with no row (the repetition guard)

`ledger:NPC_STRUCTURE.<pool>`, draws the presumption ledger notes (refused draws not counted), at the tip on R / S (the
line beside, on the same corpora; `pools6.mjs`). Every one prints a single line (top1 1.00):

| pool | tip R | tip S | line R / S |
|---|---|---|---|
| magic__contested__dominant | 4 (4 towns) | 8 (8) | 1 / 2 |
| magic__corruption__dominant | 0 | 3 (3) | 0 / 2 |
| magic__economic_stress__dominant | 3 (3) | 7 (7) | 1 / 1 |
| magic__governance_fractured__dominant | 8 (8) | 21 (21) | 2 / 0 |
| magic__stable__dominant | 5 (5) | 11 (11) | 0 / 0 |
| other__corruption__dominant | 1 (1) | 0 | 1 / 0 |

They are not banked here by any means; the walker's red for this cause is classed as the merge seat's act at this
lane's point (the narrow door `--bank-new` is on the agreement lane).

## 7. L5 — the whole suite at the tip, every failing title classed

THE RUN: `npx vitest run tests --maxWorkers=2` at 72c90a594 with the re-emitted bundles in the tree, after
`git fetch origin review-fixes-2026-07-08:review-fixes-2026-07-08`: 3,221 files, 38,945 tests, **76 failed in 47 files**
(147 skipped, the suite's own). Every failing file was then run again on the line (3575cf061) and on the tree before F3
(178601d5a), the same command, to class each title by where it is first red. **No run before this one included
`tests/components`, `tests/store` or the root `tests/generation.test.js`** (the earlier seats' failing set covered eight
directories, L4), so the lane's reds there were first seen here.

**The line's known set (red at 3575cf061 as at the tip): 8 titles.** landingFixtureFreshness 2; newsHeadlineContract and
newsVoiceContract (file-level, "Wizard News homes drifted"); proseFamilyContract A1, A3, A5 (the line's own 3 of the 4);
dossierProseManifest's drift arm (856 rows at the line). Unchanged in kind by this lane.

**F3's own: 1 title, cured.** mutationCoverageManifest TOTALITY: the F3 guard had no manifest row (fa2ba36ff). 75 of the 76
are red at 178601d5a already; this was the 76th.

**YOURS TO CURE, the lane's earlier seats', each cured by its door with its cause (one commit each):**

| titles | the cause | the cure |
|---|---|---|
| seedLoopTotality (1) | dualHatReaders.test.js asserted inline in a seed loop (the third seat's F10) | collected into its misses, the same literal (2d877b752) |
| domainAnyCastBaseline (4) | the third seat's new seatKeeper.js (11) and seatKeeperDisplay.js (4) any-holes | typed, never widened; types only (9415a106e) |
| noLegacyFactionReaders (2) | viewModel.js's three tension reads moved one line (F7's import); rosterText.js's new tension read (F2); applyDensityLaw.js's listed dead read moved 512 -> 516 | re-keyed by identity, the new read named 'a tension' (238ce16ef) |
| proseNumerics (1) | npcComponents.jsx's two banked rows moved two lines (04334d6ef, 859c11ff8) | re-addressed, 155 -> 157, 161 -> 163 (6f2d0bbdd) |
| heldKeyWriterCensus A3 (1) | six assembly calls of the third seat's F1 and F2 | two writers rowed (mutators), four exempt with reasons (0354477d0) |
| generation.test.js snapshot (1) | village_riverside_river npcCount 12 -> 11: cure (i) 04334d6ef drops the reeve's office face (measured at 04334d6ef^ and 04334d6ef) | re-measured in place (3154ecb5e) |
| whoRunsThisTownPanel (2) | soak1k-785's ruling three re-dealt by the dual hat (the sibling Dm pin's own cause, F11) | re-keyed by identity to birth(5), the sibling's town (895e9a4f0) |
| rosterDuplicateDraws (1) | 823 -> 826 at 97759b837 (F1), 826 -> 853 at 9bcda8ff6 (the crisis seats), each commit measured | re-measured with the commits (d36fbd25e) |
| locksEngine (1), npcStateRegenRebind (2), pinnedNpcRegenRemap (1) | the same keeper on the same seed moved index under the lane's deal: crier 14 -> 17 (23a2015d4), innkeeper 9 -> 2 -> 3 (23a2015d4, 04334d6ef) | re-keyed by identity, still the first move of -0..-60 under each mint (d3e089be9) |
| tonightSeatSecret (1) | five of twelve seam seeds are no longer seams under the dual hat (31, 80, 62, 43, 127, each measured) | re-keyed by identity, seven kept, five next seams (ee1608329) |
| dossierPhoneFloorAllViews (2) | the fixture city's lines move with the cast, bisected per view by the file's own walk at every lane commit touching src: rule A 23a2015d4, the dual hat e0c8bb357, cure (i) 04334d6ef, the seat row's two hats 4509d4add; F3 nothing; no token moved, zero violations (@enforced-by tests/components/dossierPhoneFloorAllViews.test.jsx) | both pins re-measured with those causes (2fd6cf8a2) |

**PARKED (a ruled design or a pin would change; the chair's, with my recommendation): 2 titles.** See section 12.
tabSentencesOnce (x50-trim-21) and tonightSheetOnce (x51-tonight-51).

**THE FOUNDING WORLDS' ROW (the chair's ruling): 1 title.** foundingWorldBones "every promise holds in at least 19 of 20
forks", beside the landing fixture's two rows.

**THE MERGE SEAT'S, named by the draft record: the rest.** The goldens and their null-change pins (generatorGoldenMaster;
espionageDormancyFence; heraldKnowledgeDeskGolden; dossierProseManifest's tally and audience arms, the drift arm the line's
too; pdf goldenViewModel; dmLayerGoldenIsolation A7, worldFactRederive A7, editWorldFactResources A2 and A6,
nameHeldThroughAssembly A1, pipelinePinnedChoosers A1, pipelinePinnedMode A1, A2, A5, rosterFinalUnderHeldRoster A1,
powerEconomyFreshness A4); the digests re-taken by their writers (x46NpcBand, institutionBudgetPromise,
intentAtlasSoakDistiller); the measured figures (hookThemeDraws, generationForkCensus A1 and A6, editCorpusRatchet A3, A5,
A7, mergeLadderHeldKeys A3); proseFamilyContract A2 (the fourth of its arms, the lane's beside the line's three);
the worked-example towns (proseComposed A13, proseTasteInterested 2); writerReach 9; observedShapeReaders 4;
statecraftExposureBand's floor; poolDominance (the six pools, section 6).

THE FINAL TIP: the same command at 2fd6cf8a2 (the last commit touching code or tests; the edge bundles re-emitted in the tree, engine hash 50f424eb244a7487), the ledger fetched first (review-fixes-2026-07-08 at 235efce1a): 3,221 files, 38,945 tests, **55 failed plus the two file-level news walkers, 57 titles in 33 files** (147 skipped, the suite's own). Every title cured above is green. The 57 are exactly the classed set and nothing else: the line's 8, the founding worlds' 1, the parked 2, the merge seat's 46. **No title is YOURS TO CURE.** The six surfaces read as in section 8 (golden 376 of 525; fence 1 of 21; manifest 3 of 17, the drift list capped at 1,000, the audience arm 204 against 203; pdf.6 1 of 4; Herald 1 of 3; witness 7 of 7 green).

## 8. The six surfaces, at the tip

Read from L5 (no golden door run; the fourth seat's commits after it move no generator output: tests, registers and one
types-only change). The record's `surfaces` carries the same.

| surface | state | at the tip |
|---|---|---|
| generator golden master | MOVED | 376 of 525 configurations differ (the line's f72262c68 = 3575cf061 against the tip; F3 and the line moved 0 of the golden's 525) |
| espionage dormancy fence | MOVED | 1 of 21 red, the driven golden's hash |
| dossier prose manifest | MOVED | 3 of 17 red: the drift arm 1,000 or more rows (its list is capped; 856 at the line already), the tally, the audience arm 203 -> 204 |
| PDF golden (pdf.6) | MOVED | 1 of 4 red, the canon town's cast and ruling three |
| Herald knowledge desk golden | MOVED | 1 of 3 red, its hash |
| preset-lighting witness | UNMOVED | 7 of 7 green |

## 9. The gates

At every commit touching `src/` (L1): domain-strict exit 0 (1,113, ceiling 1,113); typecheck:ratchet exit 0 (167, ceiling
167); eslint on the touched files exit 0. At the push, the hook's three gates: run at the docs commit's parent 2fd6cf8a2 with `sh scripts/gate-tail.sh` as the hook runs them for a lane-only push: typecheck:ratchet exit 0 (167, ceiling 167), typecheck:domain:strict exit 0 (1,113, ceiling 1,113), lint exit 0; the push itself ran the same three through the hook, plain. The repetition guard
(poolDominance) is red for the six pools alone (section 6), classed, not banked.

## 10. New words for the owner's veto list

- The seat row names each claimant in person: "Stands empty; 2 claimants circle: Dubravka Semyonov for Noble Claimant
  (Senior Line), Galina Grbić for Noble Claimant (Reform Line)." (the words "<person> for <power>").
- The claimant's mint title "the lord" (an existing title, the Noble Houses seat mint's; no honorific, hook or secret
  register gains a row).
No other printed word is new in this part.

## 11. Seen, not chased

- "Criminal money is reaching the officials" is a state-prose candidate (`src/data/dossierStateProse/power.generated.js`);
  not counted (NOT YOURS: the Power tab's "hall free of criminals" beside it).
- x51-tonight-51's seat-holder is both the insurgency's target and the keeper of the insurgency's own secret (a gate
  opened to it): the secret is dealt to the house face that the dual hat made the seat-holder.

## 12. PARKED for the chair (sent once, together)

1. tabSentencesOnce, x50-trim-21 (a town under succession): The Highborn Circle and The Peerage, both old families'
   bodies with no free landed rung, print "No one claimant has stepped forward yet: the old families press the claim
   together." twice on one Power tab. Red before F3 (178601d5a) as at the tip; F3's ruled "else keeps its line" stands.
   RECOMMENDATION: the line prints once per tab, under the stronger body (its own words say "together"); a change to the
   Power tab's leaderless line, so the chair's.
2. tonightSheetOnce, x51-tonight-51: the seat-holder (the craft-guild master under the dual hat) is the insurgency's
   target and keeps its own secret, so RUNG2-F13 withholds it and R11's ruled step (d) voices the temperament
   ("Warm-hearted."). The composer is as ruled; the test's oracle has no arm for (d). RECOMMENDATION: the oracle accepts
   the temperament where `says` is 'temperament' and it is the record's own `personality.dominant` (a widening of a pin,
   so the chair's), or rule that a target who keeps the crisis's own secret is voiced with it.

## 13. The chair's two rulings on section 12, done (after the hand-back at e86d069be)

The chair read the hand-back at e86d069be, let the six calls stand and ruled both parked titles. Each is one commit;
the edge bundles are re-emitted after them, last and alone.

1. **THE LEADERLESS LINE, ONCE (0ffbf39b8).** `data/stressPowerFaces.js`: the old families' body row gains a declared
   `pointer`, "Presses the claim with {power}.", in the same register as its line. `people/stressPowerFaces.js ::
   leaderlessLineOf`, the line's one reader: where two or more powers of one row with a pointer have no one on the page,
   the line prints once, under the stronger body (its power, then the roster's order), and each other body reads the
   pointer, `{power}` filled with the stronger body's roster name. Its card is never bare. Red first:
   `successionClaimants.test.js`'s new arm on x50-trim-21 (The Highborn Circle 11, The Peerage 10: The Peerage read the
   line, not "Presses the claim with The Highborn Circle."), and the F3 guard's corpus arm now checks the once rule on
   every succession birth. Green: the guard 5 of 5, stressPowersFaced, and X-50 tabSentencesOnce 2 of 2.
   **The count on both corpora (`f3count.mjs` at the cure):** R 1,845 has 6 faceless bodies and S 2,460 has 11, each
   alone in its birth, so each keeps its full line. Births with two or more faceless bodies: 0 on R, 0 on S, so 0 lines
   printed twice before the cure and 0 after. The class lives on the X-50 corpus (x50-trim-21), where it is cured.
   **No generator output moves:** every record hash on both corpora (4,305 births, whole-record sha256) equals the F3
   cure's dump at c67c8319e, and the reader is called only by the Power tab's roster row.
2. **THE ORACLE GAINS ITS ARM (d) (69949c00e).** `tonightSheetOnce.test.jsx`: the per-person oracle has one home
   (`personMissOf`) and R11's ruled step (d): the temperament is accepted ONLY where the sheet's `says` is
   'temperament' AND the line is the record's own `personality.dominant`. This re-keys the test to the ruled design by
   identity; it does not loosen it. The composer is untouched. Planted (an executed arm of the test): a wrong
   temperament on x51-tonight-51's seat-holder is red, and the true temperament said as a want is red. Before: red at L5
   on x51-tonight-51. After: 4 of 4.

**New words for the owner's veto list:** "Presses the claim with <the stronger body>." (the chair's draft, taken as
written, `{power}` from the roster).

**The lighting census** moved by its own door: titles 29,187 -> 29,189, one title each (e6fc88690, re-frozen at the clean
tip, the plain re-run 34 of 34). **The check after the two commits:** `tests/lint`, `tests/data`, `tests/generators/people`,
`tests/pdf` and the Power tab's component tests at two workers: every red is a title L5 already classed, and nothing new
but the census, cured as above. L1 at 0ffbf39b8: domain-strict 1,113 (ceiling 1,113), typecheck:ratchet 167 (ceiling
167), eslint 0. **L5's classing at the tip changes by these two only:** the parked 2 are green, so the line's 8, the
founding worlds' 1 and the merge seat's 46 remain.
