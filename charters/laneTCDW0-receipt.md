# Lane TC-DW0 receipt — DW-0 THE DWELLINGS CHARTER

MARK: TC-DW0 (ODQ §484) — chair-tier COMPILE lane, SOLO, READ-ONLY on the repo.
STARTED 2026-08-23T19:49:44Z
BASE claude/composite-r4 = 00e7af612d428078634d52ea37054bd00b773ca6
SP = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/6298872d-53af-4c8a-99e5-139bfc5bfc1f/scratchpad
Deliverable: $SP/draft-DWELLINGS-CHARTER.md (assembled ONLY by $SP/DW0-merge/assemble.sh)

## CHAIR AMENDMENT RECEIVED (ledger §496) — the ESTATE wave
Owner's four points (re-draft to institution; merge plots into estates with emergent
courts/yards; derived embellishments; property lines for the MP-1 halo) + chair rulings
R1 causation (frontage gates the parti; depth/height absorb) · R2 refusal over repair
(containment stays a theorem) · R3 merge = dated, ward-local, adjacent wedges only ·
R4 court/yard are definitions not data · R5 embellishments closed+derived+deterministic ·
R6 the ESTATE wave sits between the geometry core and fixtures; MP-1 is its consumer ·
R7 must land BEFORE the ONE REGEN or it forces a second.
Folds into §2 §3 §4 §5 §7 §9. Logged 2026-08-23.

## RESUME POINT 2026-08-23T20:05Z
(a) PROVEN: receipt open; base claude/composite-r4=00e7af61; docs at ledger HEAD 62acaebb
    (design doc on disk == HEAD, cmp IDENTICAL). Read WHOLE: DESIGN_DWELLINGS_PROGRAM.md.
    Read: R6 SS.1/.2/.3/.4/.5 (16 gaps; 28-row verdict 3B/1B+H/13H/11N); R5 SS.1/.2/.3
    (8 defects G1-G8; 14 grammar requests R1-R14; 32-row verdict); R5 SS1.1-1.7 spine;
    R6 SS15.2 controlled-gate convergence; CIRC SS4 vocabulary delta + SS5 convergence +
    SS6 consequences + SSSigma law map.
(b) IN FLIGHT: engine measurement (SS0 of the deliverable).
(c) NEXT: measure src/domain/interior, cohesionWeave, townCartography, fabric, undercity,
    catalog, size-baseline; then the remaining dossier bodies + ledgers; then write.

## RESUME POINT 2026-08-23T20:35Z
(a) PROVEN — ENGINE MEASURED at claude/composite-r4=00e7af61, all quoted:
  * interiorFootprint.js:10 "THE MAP'S FOOTPRINT IS A POINT" — no parcel polygon is read;
    footprintSizeFor (L80-86) = kind x tier x prosperity, clamp MIN_CELLS 4 / MAX_CELLS 30;
    entranceSide = cardinalSide(centroid - position) L122. => law 6 REFUTED in the live path.
  * interiorModel.js:353 ONE rot from ONE entranceSide; ONE entrance door L276. E2 CONFIRMED.
    No storeys anywhere in InteriorModel (L181-186) — law 9 has NO home. CONFIRMED.
    Concealed room L333-349 nests at half host dims but does NOT debit host area (CORRECTION).
  * interiorTemplates.js: 8 INTERIOR_KINDS L29-31, 28 ROOM_KINDS L35-46, 22 FURNISHING_KINDS
    L50-54, 8 TEMPLATES L86-152, 4 FUNCTION_VARIANT_ROOM L162-167. 'stall' is a DEAD member
    (zero producers, grep over src at base).
  * cohesionWeave.js:258-292 FACET_INFERENCE; institutionNature L260-268 (trade L263 BEFORE
    vice L266; bare /den/ L266, bare /fort/ L262, only /\bhall\b/ L267 anchored);
    institutionSubstructure L285-291 IS LANDED here (R-INST-6 read it at holding-uc2) CORRECTED.
  * cartographyParcels.js:69-71 CartographyParcelRow HAS polygon (SS495 CONFIRMED);
    L11-20 the no-repair header (chair R2 CONFIRMED verbatim);
    L108 polygon = [centroid, cuts[s], cuts[s+1]] => the OUTER edge IS a third of a ward
    boundary edge — a derivable frontage edge exists TODAY.
  * cartographyBuildings.js:12-24 medial subdivision => BUILDINGS_PER_PARCEL <= 4;
    L118-141 fixed 3-rung shrink ladder; L73-76 CartographyBuildingRow HAS parcelId +
    heightPermille (the only vertical fact); L151-162 conditionOf wear ladder.
  * cartographyTuning.js:205-297 the numbers (PARCEL_EDGE_DIVISIONS 3 L217,
    PARCELS_PER_WARD L221, BUILDINGS_PER_PARCEL L275, FOOTPRINT_SHRINK_* L287-289,
    CONDITION_THRESHOLDS L293-297).
  * UC-2 monotoneComponents.js IS LANDED at base (42d3e4b1) — CORRECTION to R6 SSSigma.5.
    UC-5 connectivity.js ABSENT at every ref (git log --all --diff-filter=A returns nothing).
  * jointVocabulary.js:27 five JOINT_KINDS; L30 four TEMPERAMENTS. colonization.js:365-370
    frontFor. eslint.config.js:556-558 src/domain/**/*.js max-lines 800 eff; src/data/** none.
  * Effective-line table computed by $SP/DW0-eff.mjs for 25 files.
(b) IN FLIGHT: remaining dossier bodies (R1 stack, R2 Sigma, R3 partis, R4 ring, DWR1A) + ledgers.
(c) NEXT: those reads, then write sec-*.md and assemble.

## CHAIR CORRECTION RECEIVED (ledger §497) — R2 SUPERSEDED BY R2-PRIME
Owner: existence is decided UPSTREAM; a one-room inn makes the map CONTRADICT the
roster (the quiet-lie class). R2-prime: (a) programMinimum is DATA per institution
per tier, cells+adjacencies+open ground, cited row by row; (b) it drives WHICH
parcel and whether parcels MERGE, BEFORE geometry — allocation is choice among
candidates, never repair, so containment survives; (c) "varied configuration" is
the design — a program admits many partis; NEVER a bare-area test; (d) a tier's
smaller true form is a DIFFERENT minimum, not a degradation — hostedIn/NO_BUILDING
are selected by the tier's truth, never reached as a geometry fallback; (e) the only
lawful refusal is a REPORTED CONTRADICTION with a DM-readable receipt.
Folds into SS3 SS4 SS5 SS7 SS9. Logged 2026-08-23. sec-0 H18 wording corrected.

## CHAIR AMENDMENT 3 RECEIVED (ledger §498) — ESTATE = OWNERSHIP SET
R8: split PARCEL (contiguous, merge rule = R3, MP-1's halo) from ESTATE
{ownerRef, members: parcelId[], since, cause} — an ownership relation over one or
more parcels, contiguous or NOT. ownerRef = institution canonical key or a
HOUSEHOLD/family key, NEVER a named individual (product scope). owns vs occupies
on the member row types R-INST-5's OCCUPATION. Halo gains two tiers.
R9: initial draft = assemble ground THEN draft ONCE; time advance = ACCRETE, never
redraw (THE PROMISE); the visible seam is a FEATURE; every amalgamation is a dated
event with a cause obeying the NEWS ADDRESS LAW; ONE mechanism for both phases.
R3 amended not superseded. Folds into SS2 SS3 SS4 SS5 SS6 SS7 SS9. Logged 2026-08-23.

## CHAIR AMENDMENT 4 RECEIVED (ledger §499) — SECOND DELIVERABLE
$SP/draft-DWELLINGS-ARCHITECTURE.md, assembled by $SP/DW0-arch-merge/assemble.sh
from arch-0..arch-6. Charter finishes FIRST (the owner's sitting depends on it),
then the architecture incrementally with a RESUME POINT per part.

## RESUME POINT 2026-08-23T20:08:00Z
(a) PROVEN: sec-0 (28-row home table: 13 CONFIRMED / 8 CORRECTED / 6 REFUTED /
    1 PARTIAL; three parcel worlds named, (B) cartography synthesis chosen with
    4 measured grounds; headroom table 25 files; flag bill SIX; CH dependency).
    sec-1 (nine laws vs research). sec-2 (vocabularies: 48 partis after the
    GATED_COURT_RING merge of 15; 83 cell kinds; 81 fixtures; 9 circulation
    classes / ~55 sub-forms / 5 width buckets; storage + 6 adjacency polarities;
    CompoundMember/Parcel/Estate; yard fixtures + wear ladder; joints).
    sec-3 (contracts + programMinimum with a 16-row cited per-tier table + the
    three relations + Parcel/Estate + the MEASURED household gap: householdId
    grep returns ZERO rows; dwellings anonymous at cartographyBuildings.js:9-10).
    NEW MEASUREMENT: the intra-edge merge of two same-fan wedges is EXACTLY a
    triangle of the same family (cuts are collinear), so the medial-subdivision
    theorem survives; the vertex-crossing merge is a QUAD and does not inherit it.
(b) IN FLIGHT: charter sec-4..sec-9 + sec-sigma.
(c) NEXT: assemble the charter, then arch-0..arch-6 with a RESUME POINT each.

## RESUME POINT 2026-08-23T20:20:29Z
(a) PROVEN: ⭐ THE CHARTER IS COMPLETE AND ASSEMBLED —
    $SP/draft-DWELLINGS-CHARTER.md, 164,362 bytes / 2,348 lines, all 11 sections
    present (SS0..SS9 + SSSigma), assembled ONLY by DW0-merge/assemble.sh, C0=0.
    NEW MEASUREMENTS since the last point: PACKET_MANIFEST.json scan = 167 LANDED,
    1 SUPERSEDED, ZERO non-terminal => NO change path reserved against any DW file.
    institutionLifecycle.js:1006-1024 close branch => status 'remnant' (row KEPT,
    identity survives) + closureFateForInstitution L651-656 (shuttered/bankrupt/
    closed_for_want_of_custom) — the dissolution hand-off seam, CONFIRMED clean.
    cartographySynthesis.js stage order L371/L385/L400/L413 with the insertion
    point BETWEEN L385 and L400. cartographyContract.js:225,581 heightPermille is
    the ONLY vertical fact; scene3d does not read it directly (ABSENT storey).
    demographics: householdId grep ZERO; advanceDemographics is the single export.
    ARCHITECTURE: arch-head.md + arch-0.md written (12 measured seam rows).
(b) IN FLIGHT: arch-1 (module tree).
(c) NEXT: arch-1, arch-2, arch-3, arch-4, arch-5, arch-6, then assemble.

## RESUME POINT 2026-08-23T20:23:20Z
(a) PROVEN: charter complete + assembled (164,362 B). ARCHITECTURE: arch-head,
    arch-0 (12 seam rows measured), arch-1 (33 new files / 8 modified, per-file
    eff + headroom; programMinimumTable SPLIT BY SHELF so every file stays a leaf;
    12 single-writer assignments), arch-2 (every contract as a JSDoc shape with
    DECLARED/DERIVED/STORED per field + refusals; exactly TWO stored artefacts).
(b) IN FLIGHT: arch-3 (data flow end to end).
(c) NEXT: arch-3, arch-4 (cars as packet stubs), arch-5 (tests), arch-6 (risk),
    then DW0-arch-merge/assemble.sh and the FINAL.

# ============ FINAL — lane TC-DW0 ============
FINISHED 2026-08-23T20:30:48Z
BASE (engine, all src/** readings) claude/composite-r4 = 00e7af612d428078634d52ea37054bd00b773ca6
BASE (docs/ledger) 62acaebb2334df205ee2459c8b03be947f42782c
RESEARCH refs/preserve/research-dossiers-2026-08-23 = 07fbed7b
REPO: READ-ONLY. Zero bytes written under src/, docs/ or tests/. Nothing committed.
      No worktree was created (every probe ran via 'git show' against the base blob).

## SIZES
  draft-DWELLINGS-CHARTER.md       164,539 bytes / 2,354 lines / 11 sections (SS0..SS9 + SSSigma)
  draft-DWELLINGS-ARCHITECTURE.md  103,566 bytes / 1,717 lines / 7 parts (arch-0..arch-6)
  laneTCDW0-receipt.md             this file
  Both deliverables assembled ONLY by their assemble.sh (head + sec-*/arch-*),
  never hand-edited after assembly (the R-INST-4/5/6 method).

## C0 SCAN
  0 on all 23 authored files (receipt, both assembled deliverables, 11 sec-*, 8 arch-*).
  Emoji scan: none. The only non-ASCII marks are the estate's own ledger notation
  (warning, stop, star) plus typographic dashes and the section sign.

## MEASURED-HOME TALLY (SS0.2, every row read at file:line by this lane)
  28 rows: 16 CONFIRMED (one of them, H10, confirming the finding while CORRECTING
  its line citation) / 5 CORRECTED / 6 REFUTED / 1 PARTIAL.  16+5+6+1 = 28. Closes.
  The 6 REFUTED are the program's justification: the interior reads a POINT not a
  polygon; the entrance is guessed from a district centroid; there is no exterior to
  clamp; THERE ARE NO STOREYS AT ALL; prosperity arrives as 3 buckets against the
  map's 7; and ROOM_KINDS.stall has zero producers.
  The 5 CORRECTED are stale research claims: UC-2 is LANDED not holding;
  institutionSubstructure is LANDED at base; the concealed cell is NESTED not
  SUBTRACTED; evidence/concealed are model-level not template-level; the painter's
  op count is an IDENTITY that a new op MOVES (SS495.4(a) understated it).

## VOCABULARY COUNTS (SS2)
  partis 48  (after merging FIFTEEN separately-proposed partis into ONE
              GATED_COURT_RING with four attributes - the largest de-duplication)
  cell kinds 83  (28 today, retire 1 dead, add 56)
  fixture kinds 81  (22 today + 59), plus RECESS and SUBDIVISION as separate constructs
  circulation 9 classes / ~55 sub-forms / 5 width buckets / 4 length buckets / 6 licence grades
  storage    ~35 sub-forms / 6 adjacency polarities (3 of them PROHIBITIONS)
  joints     5 kinds IMPORTED unchanged from the undercity + 7 new ATTRIBUTES
  estate     4 reverse motions + 3 typed shared conditions (PARTY_WALL, ENCROACHMENT, CHIEF_RENT)

## WAVES AND CARS
  10 waves (DW-R, DW-1..DW-7, ESTATE, DW-S) = 41 CARS as planned;
  44 DISPATCHABLE COMMITS after EST-1 splits into four (11 shelf files > the 3-file packet law).
  DARK: DW-1..DW-6 + ESTATE.  LIGHT: DW-7a only.
  FLAGS: exactly ONE, at DW-7a, priced at the SIX-surface bill (SS489).
  DECLARED SAME-SEED SHIFT: exactly ONE, EST-2 + EST-3 (one re-record across the pair).

## OWNER'S SITTING (SS7)
  18 bands (B1..B18) + 1 sequencing decision stated FIRST, each with a recommendation;
  16 rows on the signing sheet + the sequencing row + 2 rulings.
  B16 (free-tier depth) is flagged as the owner's ALONE (paid surface).

## LEDGER (SS9)
  334 inherited items, each header verified this lane:
    R-INST-1 18 / R-INST-2 106 / R-INST-3 27 / R-INST-4 46 / R-INST-5 54 /
    R-INST-6 45 / R-INST-CIRC 24 / DWR1A 14.  They do not overlap; they ARE P1c's work order.
  + 3 OPEN WIDTHS and 6 digest-only figure families the grammar may not consume until P1c
  + 8 DEFERRALS with rationale (D-1..D-8)
  + 10 JUDGMENT CALLS (J1..J10), each with its rejected alternative and its reversal
  + 11 chair rulings recorded, ONE of them (R2) recorded as SUPERSEDED with the owner's reasoning
  + 5 open questions this charter could not close (Q-A..Q-E)

## THE FIVE DECISIONS THE CHAIR MUST RULE BEFORE DW-1 CAN BUILD
  C1  Confirm DW builds on the CARTOGRAPHY SYNTHESIS parcel world, not the fabric
      first slice (judgment J1). RECOMMEND: confirm.
  C2  Confirm the DW arc - specifically the ESTATE wave - lands BEFORE the ONE REGEN.
      RECOMMEND: confirm; landing after forces a second regeneration.
  C3  Rule Q-C: the merge lives in a NEW LEAF consuming cartographyParcels.js, not
      inside it. RECOMMEND: new leaf (single writer; the theorem's file untouched).
  C4  Ratify J4: ownerRef is an institution anchor or ANONYMOUS_FABRIC; DW does NOT
      mint a household. RECOMMEND: ratify (measured: householdId grep returns ZERO).
  C5  Order a measurement lane for Q-D (the per-settlement compute of re-deriving
      every plan) BEFORE DW-2 lands. RECOMMEND: order it.
  Plus one act that is the OWNER'S, not the chair's: the SS7 band sitting.

## WHAT I DID NOT DO / COULD NOT CHECK, stated affirmatively
  - No wall-clock performance probe was run. arch-6 R-5 gives the analytic bounds
    from constants I read and says plainly that the TIME is unmeasured (Q-D / C5).
  - No worktree, no npm ci, no vitest run. Nothing in either deliverable claims a
    test result; every engine claim is a READ at file:line.
  - The full ProgramMinimum table is NOT written: SS3.2 gives 16 cited worked rows
    and DW-R2 is chartered to fill the rest.
