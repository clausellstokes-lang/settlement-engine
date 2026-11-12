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
