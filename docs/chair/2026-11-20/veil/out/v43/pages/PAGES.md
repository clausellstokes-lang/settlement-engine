# V43-PAGES: what a shared page prints, tab by tab (VEIL-43's second builder; brief 8f9496eca; the chair's N103, N109; paused N116)

## STOPS (each sent to the seat when it fired)
1. GAINED lines, 5 in (F), all on Systems/Power: r2r-metropolis-29 "16", r2r-village-48 "56", r2s-infiltrated-city-2 "10",
   r2s-infiltrated-city-3 "10", r2s-infiltrated-metropolis-0 "11". Each is a bare share figure, kept as GAINED. They belong to
   the class VR31 below, CONFIRMED on all 9 of its births. On metropolis-29 and village-48 the figure has a lost twin on the tab
   that the walk did not pair. On city-2 and city-3 it does not:
   - the predecessor reading ("the old value prints elsewhere") is NOT CONFIRMED. The views show that P0 prints NO bare figure
     for the share VR31 lifts.
   - the views: city-2 P0 [33,17,16,12] against P1 [38,20,18,14,10], the 9 lifted to 10; city-3 P0 [54,15] against P1
     [70,20,10], the 8 lifted to 10.
   - the reading that fits all three dumped births: a bare figure prints only from 10 up (PLAUSIBLE, from 3 births, not read in
     the code). The largest-remainder lift carries a share across that line, so its figure appears.
2. The key-fill's shard 2 was OOM-killed (memcg, 3.4 GB node, 17:26 UTC). 13 of 300 line kinds stay unkeyed, on 10 births:
   r2s-infiltrated-city-3, r2s-insurgency-metropolis-3, r2s-mass_migration-city-1, r2s-mass_migration-metropolis-3,
   r2s-plague_onset-{hamlet-2,metropolis-3,thorp-1,town-1}, r2s-recently_betrayed-city-2, r2s-religious_conversion-metropolis-2.
   NOT re-run: the owner paused the veil (N116). Re-run with `PG_ONLY=<those> sh pages.sh ... F 4`.
3. No other stop fired. dm-slot present 0. No server line beyond ORDER. No moved share without a withheld power.

## THE WALK TAKES THE READ-ONLY VIEW AS IT STANDS
- `walkDossier` is imported unchanged. It walks `<OutputContainer settlement readOnly playerView={!shareDm}
  publicChronicle={null}>`, as PublicDossierView.jsx:118 renders it (publicDossier = readOnly && !saveId). 18 tabs were read.
- The store is an anonymous visitor's (tier anon, owns nothing). No JSX in the probe; React is imported from the joined tree.
- THE HANDED RECORD is gallery.js's mapping for a served share: veilPublicPayload(rederiveForPage(projectServedVeil(body,
  served marker))). On the twin the body is projectShareVeil(galleryPayloadFor(stamped record, marker), marker).
- THE MARKER WITH EVERYTHING SHOWN is tell2.probe.jsx :: showAll's `allShown`, PLUS every address of defaultVeilFor opened. It
  leaves nothing hidden on all 720 births (resolveVeil checked per birth: 0 left).
- P0 = toPublicSafe(stamped record), Reveal off. (F) reads Reveal off: the brief's P0 has no `full`.
- Line classes:
  - CHANGED: a lost and a gained line of one tab, paired in this order: (1) on a common label of 12 or more characters, (2) by
    order within one LCS hunk, (3) in the analyzer, on a label of 6 to 11 characters. "Law & order" is 11; 843 such pairs.
  - MOVED: the same text at another place. ORDER: the same characters in another order.

## THE COST (measured)
- Cost run: 10 births and 5 towns, 158 + 130 s. Estimated about 100 min whole; the chair ruled the about-55 min split.
- The actual run took 14:27 to 17:38 UTC. Every restore birth fell on shard 0 (i mod 4 = 0), my sharding fault; then N, then
  the key-fill (171 births).
- N109's samples took 17:39 to 17:44.

## (F) FIDELITY: the banked 720, P1 (veiled, nothing hidden) against P0 (the owner's public read)
- 753,863 P0 lines; 699 of 720 births differ. The restore loop ran on 329 births: every 4th, plus 149 by the key-fill.
- 300 line kinds (tab + label): 287 keyed, 13 not (STOP 2).

| class | lines | the causing key (narrowest single key that restores the line; restore births only) |
|---|---|---|
| LOST | 1,969 | safety.capture/ratio/crimeTypes 800; legitimacy.multipliers/flags 120; power.factions.niche/rawPower/legitimacyCrisis 120; power.recentConflict 63; other:prominentRelationship 33; history.legacy/siegeNarrative 6; other:powerStructure 2; conditions.severity 2; (unsampled 823) |
| GAINED | 5 | other:powerStructure 4 (all bare share figures: VR31); (unsampled 1) |
| CHANGED | 1,378 | power.stability 267; safety.capture/ratio/crimeTypes 183; history.legacy/siegeNarrative 97; other:powerStructure 75; conditions.severity 48; defence.readiness.score 21; conditions.severity+history.legacy 5; legitimacy.multipliers/flags 2; JOINT 2; (unsampled 678) |
| ORDER | 2 | conditions.severity 2 (Daily Life child_warnings: its two clauses swapped; the meaning does not move) |
| MOVED | 475 | none attributed (an order change only: Foundations 434, Power 41) |
| VR31 | 95 lines on 9 births | other:powerStructure (the share block): lost 2, gained 5, changed 88 |

BY TAB:
- Economics: LOST 1,258 ("Shadow Economy: 16% of trade unrecorded", safetyRatio).
- Power: CHANGED 668 (the stability's cause struck: "Tense — regional monster threat" to "Tense"); LOST 558 ("Governance
  fractured.", "⚠"); MOVED 41; GAINED 5.
- Foundations: CHANGED 465 (the band tiles); MOVED 434.
- Daily Life: CHANGED 217 (the legacy sentence dropped); LOST 9; ORDER 2.
- Overview: LOST 144 (the recentConflict vignette; "Notable connection").
- Defense: CHANGED 27. Magic: CHANGED 1 (other:powerStructure).
- THE "LAW & ORDER" TILES: 60 CHANGED (Critical / Strained / Adequate / Surplus moving bands), all keyed
  safety.capture/ratio/crimeTypes (32 of 60 on restore births). The word moves only where a key is withheld (no STOP).

VR31 (N109; `vr31-table.txt`), on each of the 9 births, CONFIRMED:
- (1) the stored roster holds a power the projection withholds (stamped `hidden`; "The Independent Bloc" on all 9, plus "The Free
  Alliance" / "The Grey Council" on 4);
- (2) P0's shares sum short of 100 by exactly that share (74 to 94);
- (3) P1's sum to 100;
- (4) every P1 share equals P0's by largest remainder (restated from galleryRosterChoices.js :: largestRemainder).
- ON ALL 720: shares move on 9 births, all 9 with a withheld power; 0 with none withheld (no STOP).
- Stored rosters not summing to 100 with nothing withheld: 0 (storedNot100 is 0 at all).
- AT REVEAL DM, the four named births: P1's Power share tiles EQUAL the owner's own page's (19/19, 9/9, 17/17, 12/12). The doc
  shares equal the stored roster; dmMove 0 on all 720.

THE GOVERNANCE PARAGRAPH (governanceAccountRead, publicDossier: the stamped `power:governance` block):
- It prints on 720 of 720, P0 and P1, every one found in the Power view.
- P1 against P0, all 0: differ 0; a cause lost 0; food alone 0; a merit sentence gained / lost 0 / 0; another event named 0;
  the lasting sentence changed 0.

THE SERVER (`get_gallery_dossier` on a v43x database from v28tpl; every 24th birth, 30 places):
- Its page against the twin's page: 22 differing lines on Systems/Institutions, ALL ORDER. CHANGED 0, LOST 0, GAINED 0.
- There are 16 distinct ORDER lines, each an institution card's Services chips in another order (e.g. "Lodging, Meals and
  drink, Message relay" against "Meals and drink, Lodging, Message relay"). None ranks or names a first party: NO STOP.
- The handed documents are never byte-equal (0 of 30); their printed text differs only by that order.
- THE PRINTER IN KEY ORDER: `src/components/new/tabs/InstitutionsTab.jsx :: serviceRows` (`Object.values(availableServices)`,
  the object's key order: jsonb's own key order on the server, the insertion order on the twin; PLAUSIBLE for jsonb).

## (N) NEVER-THERE: the gate's 92 hiding towns, P2 (own, Reveal off and DM) against the house-free twin under the same read
- 75,850 differing lines on 92 of 92 towns, both reads.
- N63: the house-free page's signature appears on no pool page of its size and Reveal for 34 of 92 towns (off) and 84 (DM).
- The twin is born by `birth(cfg, seed, isHideableHouse)`: the generator runs on without the houses, so its cast, ties and
  history are drawn anew. Most lines are a different town, not the veil.

| read | tab: CHANGED / GAINED / LOST, lines [of them on N63 towns] (largest first) |
|---|---|
| off | Relationships 16,777 / 1,343 / 1,337 [5,485 / 387 / 634]; NPCs 5,485 / 1,941 / 984; Power 1,466 / 324 / 575; History 988 / 287 / 413; Services 356 / 430 / 765; Institutions 566 / 40 / 171; Overview 494 / 57 / 169; Economics 335 / 64 / 130; Defense 114 / 4 / 120; Daily Life 110 / 5 / 5; Foundations 68 / 0 / 0; Plot Hooks 18 / 2 / 0; Magic 16; Traditions 10; Outlook 1 |
| dm | Relationships 17,554 / 1,891 / 574 [16,899 / 1,813 / 536]; NPCs 8,153 / 2,512 / 934; Power 1,495 / 383 / 613; History 988 / 287 / 413; Services 356 / 430 / 765; Institutions 566 / 40 / 171; Overview 507 / 57 / 148; Economics 335 / 64 / 130; Defense 114 / 4 / 120; Daily Life 110 / 5 / 5; Foundations 68; Plot Hooks 32 / 9 / 19; Magic 17; Traditions 10; Outlook 1 |

The examples per tab and class are in `PAGES-table.txt`, for instance Services LOST "Educational network" and Economics LOST
"CriminalBlack Market Revenue ...". THE DAILY LIFE TAB:
- 126 reads have a slot that differs, by slot (off = DM): unspoken_topics 40, recent_changes 16, commoner_resentments 14,
  outsider_impressions 10, food_culture 9, child_warnings 5, dawn_work 3, gathering_places 0.
- The office lines L8 to L11 print once: L10, on the same town in both forms and both reads. L12 is NOT BUILT.

## THE OWNER-ONLY SLOT (`commoner_resentments_dm`)
Every page was checked for its printed text, its key in the slots, and its key in the served document.

| pages | checked | printed | in slots | key in document | pages whose owner read has the line |
|---|---|---|---|---|---|
| (F) P1 | 720 | 0 | 0 | 0 | 253 |
| (F) server | 30 | 0 | 0 | 0 | 10 |
| (N) P2 | 184 | 0 | 0 | 0 | 104 |
| (N) house-free | 184 | 0 | 0 | 0 | 74 |

## CONFIRMED vs PLAUSIBLE
CONFIRMED (executed):
- every count above.
- the walk on the read-only view.
- nothing hidden by the marker.
- VR31 (1)-(4) on 9 of 9 births; 0 moved shares without a withheld power.
- the four DM samples equal.
- the server differing by ORDER alone.
- the dm slot 0 with the owner line present on 441 pages.

PLAUSIBLE:
- the 10-and-up print rule for a bare share figure.
- jsonb key order as the server's chip order.
- the pairing heuristics (labels of 6+ characters) as "the same place".
- the 678 + 823 + 1 unsampled lines carrying the key their kind shows.

## FILES
- Probe and runners: `pages.probe.mjs`, `pages.vitest.config.mjs`, `pages.sh`, `pages-cost.sh`, `pages-full.sh`,
  `pages-extra.sh`.
- Tables and analyzers: `pages-an.mjs`, `vr31-an.mjs`, `PAGES-table.txt`, `vr31-table.txt`.
- Rows: `/var/tmp/v18/out/v43/pages/{full,extra}`.
