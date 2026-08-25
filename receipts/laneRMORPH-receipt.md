# Lane R-MORPH receipt — round-by-round log

Lane: R-MORPH (Fable research seat), started 2026-08-24 (evening session). Read-only on repo; deliverable = $SP/research/draft-R-MORPH.md + this receipt.
Style template read: `refs/preserve/research-dossiers-2026-08-24-r2` (d67e29352d50) `research/draft-R-INST-1-CIVIC-DEFENSE.md` head (labeling discipline, roster/status-map structure, supersession header).
Scope inputs read: $SP/audit-register.json (full, 2 pages), $SP/contest-A.json (full), $SP/contest-B.json (full). Silent set extracted: 13 DOSSIER-SILENT rows (contest-B) + 4 DOSSIER-SILENT rows (contest-A) + the half-silent remainders the contest notes assign to R-MORPH by name (basin/catchment half of river rows; road-to-gate correspondence; extent-growth curve; ring density profile; quarter-label population floor; map-framing rule).

## Round 1 (Section 1 payload — field systems)
Queries run (WebSearch):
1. "open-field system medieval England furlong selion strips Historic England field systems introduction" — digest: selion 1 furlong x 1 chain = 1 acre; 2-3 great fields; Kent/Essex never-open; introduction before 726, run by ~1000.
2. "medieval township land use proportions arable meadow pasture waste common Domesday" — digest: adjacent parishes entirely different proportions; meadow = flooding-liable private-dole grassland; VCH Wilts iv medieval agriculture named.
3. "Lammas meadow floodplain hay meadow medieval England North Meadow Cricklade dole strips" — digest: Lammas system, dole/mowth/lot strips, dole stones, Cricklade oldest documented, grazed in common 12 Aug–12 Feb, cut no earlier than 1 Jul.
4. "toft croft medieval village plan definition deserted medieval village earthworks" — digest: toft = homestead plot 0.25–1 acre; croft = strip behind; planned rows; Wharram Percy/Gainsthorpe named.
5. "Roberts Wrathmell atlas rural settlement England central province nucleated dispersed" — digest: three provinces (N&W / Central / SE), Central = champion swathe Dorset→Northumberland, dispersed either side.
Fetched (CONFIRMED grade):
- https://en.wikipedia.org/wiki/Open-field_system — Elton figures (1,872 a arable; demesne 3 hides + 16 a meadow + 3 a pasture; hide 144 a, virgate 24 a; family ~70 selions ≈ 20 a), 3-field rotation, SE enclosed counterexample, croft ~0.5 a.
- https://floodplainmeadows.org.uk/discover/learn/history — Domesday meadows "most valuable of lands", Lammas cycle, dole strips alternated some years.
Dead end: archaeologydataservice.ac.uk atlas overview → HTTP 403 (ADS blocks fetch; digest-only for the atlas).

## Round 2 (Section 1 remainder + Section 2 typology)
Queries run:
6. "medieval town edge orchards gardens closes paddocks town plan back lane burgage historic town atlas" — digest: burgage rear zoning, orchards "indicated in certain areas within the town and to the south of it" (Wiltshire community history); no strong edge-belt source yet.
7. "medieval field access headland drove way field lane furlong access ridge and furrow" — digest: headlands as turning strips; earthworks include "trackways, furlong boundaries"; access roads cutting across fields.
8. "village plan types green village row village street village polyfocal medieval England classification" — digest: rows single/double along street or green; regular toft rows lowland Yorkshire late 11th–early 12th c; polyfocal = multiple concentrations; HLA/Beresford's-Lost-Villages terminology pages named.
9. "Conzen Alnwick town plan analysis plan units burgage cycle market colonisation fringe belt" — digest: 1960 IBG pub 27; plan elements streets/plots/buildings; plan-units = phases of morphogenesis; burgage cycle; fringe belts.
10. "bastide town plan grid Monpazier founded market square dimensions arcades" — digest: Monpazier 1284 Edward I, 400 x 220 m quadrilateral, central arcaded square ~100 m long side, market hall.
11. "Beresford New Towns of the Middle Ages planted borough Salisbury New Winchelsea grid plan" — digest: Winchelsea 1280s, 1292 rental shows grid occupied; standard-size symmetrical plots; Salisbury 1219-ish new grid by the cathedral.
12. "Zähringer founded towns plan Bern Freiburg market street spine plan type" — digest: Bern three longitudinal streets castle→wall; Zähringerstadt article named.
## Round 3 (Section 2 fetches + Section 3 searches)
Fetched:
- https://en.wikipedia.org/wiki/Z%C3%A4hringerstadt — CONFIRMED: Bern 1191, three longitudinal streets castle→wall; article confirms only Bern, so the Freiburg/Villingen generalization stays PLAUSIBLE.
Dead ends: dmv.wordpress.hull.ac.uk terminology page → getaddrinfo ETIMEOUT (its content used at digest grade from round 2/round 4 searches).
Queries:
13. "medieval organic street network T-junctions analysis planned towns crossroads junction type urban morphology" — digest: grid = internally consistent orientation + primarily 4-way vs T/dead-ends (Boeing arxiv 1808.00600); PLOS pre-industrial Afro-Eurasia paper surfaced.
14. "market place encroachment infill island block middle row medieval town market colonisation" — digest: Atherstone infill block; Saffron Walden 12th/13th-c market gravel then impermanent buildings, halt 14th c, resumed 1525–1620; islands = shops on the market.

## Round 4 (quantitative anchors + sections 4–6)
Fetched:
- https://www.burgageplots.info/glossary-of-terms — CONFIRMED: burgage def (Conzen 1969) 28–32 ft; back lane def; perch 16'6"; plot series def; market colonisation.
Dead end: pmc.ncbi.nlm.nih.gov PMC8585513 → reCAPTCHA wall.
Queries:
15. "pre-industrial street networks PLOS ONE structure centrality scale medieval cities T-junctions proportion" — located journals.plos.org original (fetched round 5).
16. "Rackham ancient countryside planned countryside distinction hedges Essex champion Midlands enclosure" — digest: Maitland 1897 coinage, Rackham 1986; ancient = hamlets/holloways/thick hedges/never-open; planned = open-field then enclosed.
17. "siege camp circumvallation distance walls out of gunshot leaguer siege lines trebuchet range meters" — digest: fort-to-circumvallation ~1,800 m (syler.com, hobbyist — flagged); Leucate 2,400 m / Metz 12,200 m are line LENGTHS; trebuchet 100–300 m typical.
18. "packhorse road zigzag hollow way steep hillside medieval road gradient switchback England" — digest: holloways from descending tracks; Dales packhorse-only gradients; Brookes trackway typology "single zig-zag ditches… worn trackways in steep locations".

## Round 5 (fetch batch: PLOS, longbow, Cricklade; siege castle + Durham searches)
Fetched:
- https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0259680 — CONFIRMED: 89 sites; degree Gini 0.47 orthogonal vs 0.71 organic/hybrid; node density sub-linear decline; organic centrality diminishes faster. No T/X percentage table in the fetched text (→ §Σ open question 1).
- https://en.wikipedia.org/wiki/English_longbow — CONFIRMED: 1542 statute min 220 yd; Finsbury 345 yd; Mary Rose replica 328 m; Edward III flight ~400 yd suggestion.
- https://en.wikipedia.org/wiki/North_Meadow,_Cricklade — CONFIRMED: 24.6 ha Thames/Churn; common grazing 12 Aug–12 Feb; hay ≥1 Jul; Hay Lot stones; court leet preservation.
Queries:
19. ""siege castle" counter castle earthwork distance besieged castle England "The Rings" Corfe siegework" — digest: The Rings 300 m SSW of Butavant Tower (NT HBSMR) / "400m south west" (HE scheduling 1011479); Stephen 1139; commands town+castle+approach; Civil War battery reuse.
20. "County Durham green villages regular two-row plan Roberts classification" — digest: up to 80% of NE settlements show planning evidence; regular two-row facing format; post-Conquest re-plans; Walworth.

## Round 6 (last strengtheners)
Fetched:
- https://ruralhistoria.com/2023/07/17/what-is-ancient-planned-countryside/ — CONFIRMED (secondary summarizing Rackham 1986): planned belt East Riding→south coast; characteristics of each package.
Dead ends: ourwarwickshire.org.uk HER record → 403; historicengland.org.uk list-entry 1019951 → 403 (both used at digest grade — their search digests carried the substance, incl. lynchet dims 70–360 m × 3–28 m × 2–4.5 m).
Also earlier this session (round for sections 4–5): searches 21–25 — "stepped street stairs medieval hill town" (Steep Hill 16.12°, Gold Hill 16.09°; flag: internally inconsistent 16.12° vs "1-in-7"), "strip lynchets medieval cultivation terraces" (dims above), "seatown fishertown Scottish burgh" (Cullen split, 'Seatown of' naming, Lossiemouth 52 houses), "bridgehead suburb medieval town across river" (Bedford St Johns, Southwark, Huntingdon, Maidenhead 1280), "market gardens suburbs outside walls early modern London" (1345 petition; 16th-c plots outside walls), "medieval settlement siting gravel terrace floodplain" (Axe valley crossings just above floodplain; Staines gravel islands; Sturry terrace orientation), "von Thünen rings" (model rings), "village plan types green row street polyfocal" (HLA defs), "Conzen Alnwick" (plan-units, burgage cycle, fringe belts), "bastide Monpazier" (1284, 400×220 m), "Beresford new towns Winchelsea" (1292 rental), "medieval township land use proportions" (adjacent parishes differ), "open-field system" (selion 1 furlong × 1 chain), "Lammas meadow" (dole stones, Cricklade oldest documented), "toft croft" (0.25–1 acre; planned rows), "Roberts Wrathmell atlas" (three provinces).

## Completion
Dossier written: $SP/research/draft-R-MORPH.md (first pass; supersession header; 6 sections + §0 roster + §Σ open-questions ledger, 7 entries).
Sources fetched and opened this lane: 8 pages (Open-field system, floodplainmeadows history, Zähringerstadt, burgageplots glossary, PLOS ONE 0259680, English longbow, North Meadow Cricklade, ruralhistoria Rackham). Digest-only sources: ~40 distinct pages across 25 queries. Fetch failures: 6 (ADS overview 403, heritagecalling 403, dmv.hull ETIMEOUT, PMC reCAPTCHA, ourwarwickshire 403, HE list-entry 403) — all bridged at digest grade and labeled so.
