# laneTCDWSKEP receipt

LANE: TC-DW-SKEPTIC (adversarial panel, ODQ 484)
STARTED Sun Aug 23 20:33:09 UTC 2026

MANDATE: attack the DWELLINGS charter + architecture by EXECUTION. Commit nothing, edit nothing under src/docs/tests. Revert every experimental patch cmp-clean.

## RESUME POINT Sun Aug 23 20:33:09 UTC 2026
Act 0: receipt created. Next: verify targets exist + sizes, re-derive tip, disk check.

## RESUME POINT Sun Aug 23 20:36:53 UTC 2026
Worktree $SP/laneTCDWSKEP-tree @ 00e7af612, npm ci exit 0, 468 modules, clean, disk 18.4G.
Charter fully read (0,1,3,4,5,6,7,8.8,9,Sigma). Next: read architecture arch-6, then execute probes A-I.
EARLY OBSERVATIONS (unproven): (1) cuts are Math.round-ed -> exact collinearity claim suspect; (2) parcels retained = ordered.slice(0,perWard) with dispersed_orderly sorting by SEGMENT first -> intra-edge adjacency may be rare; (3) B3 buckets are in FEET, engine coords are plan units - no scale declared; (4) 4.6 and 6.2 cite B12 for acquisition/partition but that is B9; (5) signing sheet counts disagree 16+2 vs "Eighteen rows" vs 19 table rows.

## RESUME POINT Sun Aug 23 20:40:42 UTC 2026
PROOF 1 LANDED (geometry theorem a): REFUTED by execution.
  20 rows / 132 wards / 528 ward edges / 1056 adjacent same-edge candidate pairs.
  cuts EXACTLY collinear: 410. NOT collinear: 646 (61.2%).
  Cause: cartographyParcels.js:100-104 Math.round()s the interpolated cuts; only cuts[0] and cuts[3] are exact ward vertices.
  323/2112 cut points lie strictly OUTSIDE their own ward polygon (KNOWN + TOLERATED: tests/domain/townCartographyParcels.test.js:155-172 withinWard() allows 1 sq plan unit, comment cites sqrt(0.5)).
  max |area(chord triangle) - area(union)| = 44.5 plan units.
  Consequence: arch-6 R-2 EST-2 acceptance arm 1 ("the union ... is EXACTLY [C,cuts[s],cuts[s+2]]") is UNPASSABLE as written; J5 justification false.
  Retained-parcel adjacency: 577 adjacent pairs over 1098 retained parcels, 113/132 wards -- my own hypothesis that the merge could rarely fire is REFUTED.
Next: theorem (b) quad, six refutations with positive controls.

## RESUME POINT Sun Aug 23 20:49:17 UTC 2026
PROOFS LANDED SO FAR (executed):
 P1 geometry theorem (a): REFUTED - 646/1056 pairs non-collinear.
 P2 six refutations: all six CONFIRMED by execution + positive controls. NEW: room kind "dais" ALSO has zero room-producers (room('dais' -> 0; control room('hall' -> 2) - charter named only stall.
 P3 flag bill: all SIX surfaces present and live; contributionLedgerShape has 2x toHaveLength(25) + title "at 25". CONFIRMED six.
 P4 painter identity: 3 test files / 4 sites pin it (townCartographyPaint.test.js:72-73+202, townCartographyBlock.test.js:165-170, mapCartographySubTab.test.jsx:181-187) + the source header 13-17. Charter never enumerates them.
 P5 size baseline: 10 entries, none a DW file - CONFIRMED. All 24 eff/raw figures in charter 0.4 CONFIRMED EXACTLY by eslint Linter.
 P6 packet manifest: 167 LANDED + 1 SUPERSEDED, ZERO non-terminal - CONFIRMED.
 P7 householdId: 0 rows; positive controls parcelId=27, anchorKey=153. CONFIRMED.
 P8 PERFORMANCE MEASURED: full generation metropolis med 29.9ms; cartography manifest metropolis med 139.7ms; interior derivation 1.3ms/building at metropolis; eager 240 buildings = 309ms.
 P9  NEW MAJOR: over 48 REAL generateSettlementPipeline settlements with cartography LIT, 27/48 (56
## RESUME POINT Sun Aug 23 20:49:28 UTC 2026
PROOFS LANDED SO FAR (executed):
 P1 geometry theorem (a): REFUTED - 646/1056 adjacent same-edge pairs have NON-collinear cuts.
 P2 six refutations: all six CONFIRMED by execution + positive controls. NEW: room kind 'dais' ALSO has zero room-producers (room('dais' -> 0 hits; control room('hall' -> 2) - the charter named only stall.
 P3 flag bill: all SIX surfaces present and live; contributionLedgerShape has two toHaveLength(25) + title "at 25". CONFIRMED six.
 P4 painter identity: 3 test files / 4 sites pin it (townCartographyPaint.test.js:72-73 and :202; townCartographyBlock.test.js:165-170; mapCartographySubTab.test.jsx:181-187) plus the source header 13-17. The charter never enumerates them.
 P5 size baseline: 10 entries, none a DW file - CONFIRMED. All 24 eff/raw figures in charter 0.4 CONFIRMED EXACTLY by eslint Linter.
 P6 packet manifest: 167 LANDED + 1 SUPERSEDED, ZERO non-terminal - CONFIRMED.
 P7 householdId: 0 rows; positive controls parcelId=27, anchorKey=153. CONFIRMED.
 P8 PERFORMANCE MEASURED: full generation metropolis median 29.9 ms; cartography manifest metropolis median 139.7 ms; interior derivation 1.3 ms/building at metropolis; eager 240 buildings = 309 ms.
 P9 NEW MAJOR: over 48 REAL generateSettlementPipeline settlements with cartography LIT, 27/48 (56 percent) THREW premise errors (ALL village 8/8, ALL town 8/8). The 20-row corpus the stage is proved against is makeTownFixture output, NOT pipeline output.
Next: buildings-per-parcel vs H21; is the cartography block lit anywhere; band audit; write the report.

## RESUME POINT Sun Aug 23 20:56:11 UTC 2026
P10 H21 REFUTED: 156/426 parcel-occupancy checks exceed BUILDINGS_PER_PARCEL (max 16 at metropolis vs cap 4; 9 at thorp vs cap 1). Cause: the FLAGSHIP EXEMPTION at cartographyBuildings.js:216 and :299-301 (subcell = arrived % 4). 218/1497 building rows (14.6 pct) share an IDENTICAL footprint with another building. All 5961 footprint vertices ARE contained in their parcel - containment holds, the <=4 CAP does not. The existing pin (townCartographyBuildings.test.js:455-457) scopes the cap check to role==='dwelling' only.
P11 theorem (b) CONFIRMED: 528/528 vertex-crossing unions are genuine CONVEX quadrilaterals; packFootprint destructures [v0,v1,v2] only.
P12 frontage: every parcel yields EXACTLY ONE outer edge (CONFIRMED). BUT only 163/1098 (14.8 pct) of outer-edge midpoints lie within 8 plan units of any street polyline; median distance 41.1 plan units. H19's clause "the side the street runs along" is REFUTED.
P13 NO plan-unit-to-feet scale exists in src/ (2 hits, both worldUnitsPerMapUnit:1 in the fabric ABI). B3's buckets are in FEET. Under 1:1, SHOP and NARROW get ZERO of 1098 parcels; WIDE 758, GRAND 318, STANDARD 22.
P14 ARITHMETIC: charter 2.2's own table lists 57 new cell kinds not 56 => 84 not 83. Charter 2.3's own list has 60 fixture names not 59 => 82 not 81. Partis 47+1=48 CORRECT.
P15 B12/B9 cross-reference error at charter lines 1403 and 1682 (both should be B9). Line 2066 gets it right.
P16 "purity argument" appears ONCE in the charter - in the citation to it (line 233). Section 6 has none. Dangling citation.
P17 ESTATE wave is marked "dark" in the 5.0 table AND "changes the drawn map of every settlement". Contradiction.
P18 the five corrections all CONFIRMED (monotoneComponents landed 42d3e4b1; institutionSubstructure 285-291; concealed nested 335-340; roomCount excludes covert L402; painter identity).
P19 preserve ref advanced 07fbed7b -> 3449e748 adding ONLY the five charters/ files; no research file changed. 19 research files CONFIRMED.
P20 ledger 334 = 18+106+27+46+54+45+24+14, each traceable to its dossier header. CONFIRMED as row count.
Next: arch new-file count, then write draft-DW-SKEPTIC-REPORT.md.

## RESUME POINT Sun Aug 23 20:57:07 UTC 2026
P21 arch-1.1 layout tree lists 30 new .js files; arch-1.5 asserts 33; with the 11-shelf split it would be 40. programMinimumTable.js is priced at ~700 eff against a 250 leaf cap and still appears as ONE file in the 1.1 tree.
P22 BASE GREEN PROVED: gate-mutex battery over townCartographyParcels + townCartographyBuildings + townCartographyPaint + interiorModel + testRatchet = 5 files / 180 tests PASSED, TRUE_EXIT=0. Every measurement above is against a green tree.
Next: write draft-DW-SKEPTIC-REPORT.md, then clean the worktree and prove it.

## FINAL Sun Aug 23 21:02:23 UTC 2026

DELIVERABLES
  $SP/draft-DW-SKEPTIC-REPORT.md  (verdict table, MUST-FIX list, band audit, measured performance, ratification verdict)
  $SP/laneTCDWSKEP-receipt.md     (this file)

COUNTS
  Executed probes: 25 (10 node probes over real generated corpora; 1 mutexed vitest battery; 2 python recounts of the charter's own tables; 12 targeted source/grep probes). Every absence claim carries a positive control.
  Corpora driven: 20-row V2 golden map corpus (132 wards / 528 ward edges / 1,056 adjacent wedge pairs / 1,098 shipped parcels / 1,764 streets); 48 fresh generateSettlementPipeline settlements; 288 generated interiors; 1,497 cartography building rows; 5,961 footprint vertices.
  Claims adjudicated: 61.  CONFIRMED 41 · REFUTED 9 · OVERSTATED 4 · UNDERSTATED 2 · PREFERENCE-NOT-MEASUREMENT 5 (bands).
  MUST-FIX items raised: 10.
  Bands audited: 19 signing rows. 16 safe to sit. 3 not (B3, B8, B9).

BASE STATE
  Worktree $SP/laneTCDWSKEP-tree detached at 00e7af612d428078634d52ea37054bd00b773ca6 (= claude/composite-r4, UNCHANGED since the compile; no advance to re-check).
  npm ci exit 0; node_modules 468; disk 18,446,928 KB free at start.
  BASE GREEN PROVED: gate-mutex --run -- npx vitest run over townCartographyParcels + townCartographyBuildings + townCartographyPaint + interiorModel + testRatchet = 5 files / 180 tests PASSED, TRUE_EXIT=0.
  Research corpus: refs/preserve/research-dossiers-2026-08-23 advanced 07fbed7b -> 3449e748 adding ONLY the five charters/ files; no research file changed; 19 files at 07fbed7b as the charter states.

CLEANLINESS
  Zero repo bytes written under src/, docs/ or tests/. Ten probe scripts written to the worktree ROOT, executed, deleted.
  git status --porcelain = 0 lines. git diff HEAD exit 0. Non-node_modules untracked = 0. HEAD unmoved at 00e7af612.
  Nothing committed, staged or pushed.

THE THREE THINGS THE CHAIR MUST CHANGE BEFORE RATIFYING
  1. H21 and the allocation capacity model (MUST-FIX 1). "At most four buildings fit a parcel - CONFIRMED, and it is a theorem" is REFUTED: 156/426 parcel-occupancy checks exceed the band, up to 16 on one metropolis parcel against a cap of 4, and 218/1,497 building rows (14.6 percent) share an IDENTICAL footprint with another building. The cause is the FLAGSHIP EXEMPTION stated in the engine's own words at cartographyBuildings.js:216 and implemented at :299-301 - twenty lines from the code the charter quoted. Section 4.2 step 4 makes that false bound EST-2's capacity predicate, so the union trigger and the programSatisfied receipt are both computed from a number nothing enforces.
  2. The intra-edge merge theorem and EST-2's acceptance arm 1 (MUST-FIX 2). 646 of 1,056 adjacent same-edge cut triples (61.2 percent) are NOT collinear, because cartographyParcels.js:100-104 Math.rounds the interior cuts onto the integer lattice - the suite already knows this and allows a one-square-unit tolerance at townCartographyParcels.test.js:155-172. arch-6 R-2's arm 1 ("the union ... is EXACTLY [C, cuts[s], cuts[s+2]]") cannot pass on real geometry, and J5's recorded rationale is false. Theorem (b), the vertex-crossing quad, is CONFIRMED 528/528 - the charter got the one it refused right and the one it depends on wrong.
  3. The DARK/LIGHT contradiction and the dangling purity citation under the flag bill (MUST-FIX 3). Section 5.0 marks the ESTATE wave "dark" in the same row that declares it changes the drawn map of every settlement, and section 0.5 justifies the one-flag bill by citing "section 6's purity argument" - the word purity appears exactly ONCE in the whole charter, inside that citation. That premise carries J3 and the program's entire landing posture, and it must be written out or the posture re-decided.

AND ONE FOR THE OWNER, NOT THE CHAIR
  Band B3 must not be signed as written: three of its five boundaries are interpolations between two sourced anchors, and all five are denominated in FEET while the engine has no plan-unit-to-physical scale anywhere in src/ (two grep hits, both worldUnitsPerMapUnit:1 in the fabric ABI). Under the natural 1:1 reading, of 1,098 real parcels SHOP gets 0 and NARROW gets 0, and Pantin's 30-50 ft gate - which chair ruling R1 makes the hard filter on parti eligibility - would admit 98 percent of all parcels. R1 is vacuous until a scale is signed.

THE ONE NUMBER THE CHARTER COULD NOT PRODUCE
  A metropolis costs ~30 ms to generate and ~140 ms to compile its map: about 170 ms against a 2,000 ms budget. Lazy per-building plan derivation adds 1.3 ms on click. Even the eager worst case the architecture excludes - all 240 drawn buildings - is ~309 ms. arch-6 R-5 is UNDERSTATED; two seconds survives with roughly an order of magnitude of headroom. CHAIR DECISION C5 (order a measurement lane before DW-2) should be ruled DISCHARGED.

## POST-FINAL NOTE Sun Aug 23 21:10:03 UTC 2026
Transparency on my own process: an over-broad regex used to strip decorative symbols from the report collapsed its markdown tables onto single lines. Detected by a table-integrity check, the damaged file was DELETED and the report rewritten in full from the same measurements — no finding was changed, added or lost. Pipes inside inline-code spans on table rows are now escaped; a re-check reports zero rows with more than 8 unescaped pipes, 13 separator rows, zero characters above U+2500 and zero control characters. Final report: 44,281 B / 526 lines.
Worktree re-verified after all writes: git status --porcelain = 0 lines, HEAD 00e7af612d428078634d52ea37054bd00b773ca6.
