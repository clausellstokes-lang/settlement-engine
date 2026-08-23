# Lane TC-R-INST-6 receipt — DW-R tranche 6, CRIMINAL / UNDERGROUND institutions and their FRONTS
[OPUS-RUN . FABLE-VALIDATION OWED] (ODQ 484)

STARTED 2026-08-23T18:10:45Z

Lane: TC-R-INST-6 (the undercity seam). Chair-tier RESEARCH + COMPILE, SOLO (lane cap TWO; no sub-agents).
Deliverable: $S/draft-R-INST-6-CRIMINAL.md via $S/RINST6-merge/assemble.sh
Web budget: <=45 WebSearch, <=60 WebFetch. Log of record: $S/RINST6-calls.tsv

## RESUME POINT 2026-08-23T18:10:45Z
(a) PROVEN: receipt created; scratchpad and merge dir made.
(b) IN FLIGHT: roster enumeration from the clean-tree catalog + flat table.
(c) NEXT: grep-complete roster, print section 0, then doctrine reads.

## RESUME POINT 2026-08-23T18:16:22Z
(a) PROVEN — roster enumerated: 28 Criminal-shelf rows across five tiers (thorp 2, hamlet 3,
village 3, town 5, city 11, metropolis 4); keyword sweep run over all 311 flat rows, six
non-Criminal name/tag hits (four are substring false positives: resident/Warden), nine
desc-only hits. ENGINE PROVENANCE ESTABLISHED (CONFIRMED by git):
  - `src/domain/interior/*` (7 files incl. interiorTemplates.js, interiorModel.js) IS on the
    branch of record `review-fixes-2026-07-08` — INTERIOR_KINDS/ROOM_KINDS/FURNISHING_KINDS
    and the vice template are LIVE code, not a sandbox artifact.
  - `src/domain/undercity/` is NOT on `review-fixes-2026-07-08` and NOT on `master`.
    Five leaves exist at `refs/preserve/holding-uc2` (694965577): jointVocabulary 40,
    strataExistence 281, staticComponents 308, sewerDerivation 515, monotoneComponents 635.
    UC-4's `colonization.js` (542 lines) exists ONLY at 1c96c1e03 on `claude/composite-r4`.
    UC-5's `connectivity.js` DOES NOT EXIST at any ref (git log --all, 0 hits).
  - corruption.js's criminal-share read is at lines 539-541 on the branch of record.
(b) IN FLIGHT: reading the five undercity leaves + interiorModel for the ENGINE CONTRACT leg.
(c) NEXT: FACET_INFERENCE simulation over the 28 roster names; then section 0 authored; then
    web research families A-I.

## RESUME POINT 2026-08-23T18:20:08Z
(a) PROVEN — the ENGINE CONTRACT read from live code at the true tips (CONFIRMED):
  - Build branch of record = `claude/composite-r4`. UC-4 landed at `f1e4d515` (ODQ section 490.1);
    UC-2 holds at `refs/preserve/holding-uc2` = 694965577 (4 over 1b1de759), in the landing seat.
  - UC-4 colonization.js: UNIVERSAL FRONT implemented as `frontFor(seed)` -> INSTITUTION{anchor,name}
    or ANONYMOUS_FABRIC; `smugglers_tunnel` license WALL_OR_TOLL_AND_CRIMINAL_SHARE with the TOLL half
    typed and INERT (no engine accessor; D-UC0-2); joins gate/stair or waterfront/sluice;
    COLONIZED_CEILING_BY_TIER thorp 0 hamlet 0 village 1 town 2 city 4 metropolis 6;
    SEED_PROXIMITY cellar 0 subterranean 1 sanitation 2 crypt 3 mine 4 other 5;
    UNDERCITY_TUNING presenceFloor 0.30, smugglerCriminalFloor 0.35, floodDepth 2.
  - UC-2 monotoneComponents.js: `smuggler_cellar` kind, license CRIMINAL_SHARE_AT_GATE_OR_WATERFRONT,
    zone 'criminal', joins stair/'cellar door' plus sluice/'waterfront sluice' when waterside,
    driver CONTRABAND_SHARE, smugglerShareFloor 0.45, extents niche/chamber/gallery/labyrinth,
    and only the FIRST undercroft of the quarter becomes the smuggler one (i === 0).
  - UC-5 `connectivity.js` DOES NOT EXIST at any ref (git log --all, zero adds).
  - FACET SIMULATION over all 28 roster names EXECUTED ($S/RINST6-facetsim.mjs): 17/28 infer NO
    nature and render the two-cell `generic` box; 6 render the LEGITIMATE `trade` interior
    (hall + counting + strongroom) because /guild|market|bazaar/ fires first; 4 smuggling rows
    render `vice` (a tavern) via /smuggl/; 'Front businesses' -- the tranche's central row --
    renders `generic`. There is NO criminal INTERIOR_KIND. ROOM_KINDS.concealed exists but is
    reachable ONLY through `inst.impairments[].type === 'corruption' && covert === true`, which
    criminal institutions do not carry.
(b) IN FLIGHT: nothing; about to open the web research phase.
(c) NEXT: families A-I web research, three directions each, negation search per family.

## RESUME POINT 2026-08-23T18:25:41Z
(a) PROVEN — research round 1 complete for families A, B(part), C, D, E(part), plus two of the
    section-15 continental analogues. Measured primaries banked: Harvington Hall's swinging-beam
    hide 8 ft x 3 ft x 5 ft with a barely-one-foot entrance and its bread-oven hide 5 ft deep by
    2 ft 7 in by 3 ft 9 in; Beames 1850 chapter 3 (rooms 6 ft x 5 ft holding eight, 8 ft x 12 ft
    holding twelve, 175 cubic feet of air per person average, 605 max, 52 min, the rookery
    "like an honeycomb ... culs de sac, without any outlet other than the entrance"); Mayhew's
    Farm House in the Mint (40 rooms, 200 beds, three kitchens, the largest holding 400,
    yard 1.5 acres); the 1863 Bethnal Green survey (a cellar dwelling under 6 ft high, its window
    3 ft by 3 ft reduced to a chink 3 ft by 4.5 in, 2s a week); VCH Middlesex XI (Nichol plots
    16-20 ft frontage by 60 ft deep, 237 houses on 5 acres by 1827). NEGATION GOLD: the Kent
    Underground Research Group on smugglers' tunnels, and the Hawkhurst finding that large armed
    gangs used barns and cellars openly so tunnels were not needed.
    CATALOG CORRECTION FOUND: the catalog's `Rookery` row is a LOFT OF MESSAGE BIRDS (an
    information brokerage), NOT the Victorian slum rookery the brief's family D assumed. Both
    readings are now researched; the dossier states the correction.
(b) IN FLIGHT: families B (bastle house), F (guild hall analogue), G (the clothes exchange),
    H (the crimping house) -- research round 2.
(c) NEXT: finish rounds 2-3, then author section 0 and the merge parts.
Web acts so far: 20 WebSearch, 13 WebFetch (2 failed: one cert + 403 GATED, one binary cured by
curl), 2 curl, 1 GATED (Historic England).

## RESUME POINT 2026-08-23T18:39:12Z
(a) PROVEN: research phase closed at convergence. Authoring underway; written and C0-clean:
    RINST6-merge/head.md (18,347 B - banner, section 0 roster of 28 rows re-verified line by
    line, the keyword sweep with every exclusion, two catalog defects D6-1 and D6-2, the nine
    families and the section 0.3 status map with a roster-coverage audit that closes at 28),
    sec-1.md (25,137 B - the seven-anchor spine), sec-A.md (21,591 B - the fence),
    sec-B.md (19,564 B - the outlaw shelter and the bandit affiliate).
(b) IN FLIGHT: sec-C.md (the smuggling ladder, eight rows - the tranche's largest family).
(c) NEXT: sec-C, D, E, F, G, H, I, then sec-15, sec-sigma, sec-ledger, sec-method,
    sec-appendix, then assemble.sh and the FINAL block.

## RESUME POINT 2026-08-23T18:56:04Z
(a) PROVEN: all nine family sections written and C0-clean. Sizes: head 18,347 · sec-1 25,137 ·
    sec-A 21,591 · sec-B 19,564 · sec-C 29,552 · sec-D 26,742 · sec-E 24,556 · sec-F 25,176 ·
    sec-G 30,123 · sec-H 21,720 · sec-I 9,841. Running total 252,349 B.
    Boundary correction found and recorded in sec-I: the Slave market rows are R-INST-2's
    (family R, exchanges/auction/brokerage), NOT R-INST-4's as the brief stated -- verified by
    grep (9 hits in draft-R-INST-2, 0 in draft-R-INST-4). Also: there is NO gallows row in the
    catalog, and no counterfeiting/forgery or spy/informant row on any shelf.
(b) IN FLIGHT: sec-15 (continental and non-European register).
(c) NEXT: sec-15, sec-sigma (nine-law map + engine gaps + verdict table + the UC SEAM TABLE),
    sec-ledger (by script over markers), sec-method, sec-appendix, assemble.sh, FINAL.

---

## FINAL 2026-08-23T19:10:28Z

### Deliverable and sizes
- `draft-R-INST-6-CRIMINAL.md` = **344382 bytes**, 20 top-level sections, assembled ONLY by
  `RINST6-merge/assemble.sh` over 16 part files; never hand-edited after assembly.
- Part sizes: head 18,347 · sec-1 25,137 · sec-A 21,591 · sec-B 19,564 · sec-C 29,552 ·
  sec-D 26,742 · sec-E 24,556 · sec-F 25,176 · sec-G 30,123 · sec-H 21,720 · sec-I 9,841 ·
  sec-15 13,271 · sec-sigma 32,282 · sec-ledger 17,096 · sec-method 15,643 · sec-appendix 13,240 (16 parts total 343,881 B; the assembler's separators and the contents line bring the deliverable to 344,382 B).
- Receipt `laneTCRINST6-receipt.md` = 7,582 bytes of STARTED-plus-RESUME-POINT log before this
  FINAL block was appended; about 16 KB complete.

### Status map (honest, from section 0.3)
28 roster entries over 9 families. **FULL: A, B, C, D, E, F (six).** **PARTIAL: G** (owed L.7 --
no measured message-loft of any period; the dovecote is the analogue) and **H** (owed L.9 -- the
holding cell is measured only through its licit twin, the recruiting rendezvous strong-room).
**BOUNDARY ONLY by charter: I** (the enforcement counterpart; cross-references only).
Roster-coverage audit closes at 28: 3+2+8+2+2+3+5+3 = 28, every row carried by exactly one family.

### Label tally (grep over head + sec-1 + sec-A..I + sec-15 + sec-sigma + sec-ledger)
CONFIRMED tokens 214, of which **CONFIRMED-digest 100**, therefore **CONFIRMED (opened) 114**.
PLAUSIBLE 11, of which **PLAUSIBLE-by-simulation 6**, therefore plain PLAUSIBLE 5.
CONVENTION 8 · GATED 14 · NOT FOUND 14 · DERIVED bucket statements 30 ·
HOME: ROOM_KINDS.x 30 · **NO TYPED HOME 40** · inline "fetched 2026-08-23" citations 45 ·
number audits 16.

### Web acts (exact, from RINST6-calls.tsv)
**39 WebSearch** (cap 45; 6 unspent) · **23 WebFetch** (cap 60; 37 unspent) · **4 curl**.
Total 66 web acts. WebFetch outcomes: 16 x 200 read; 4 GATED 403
(historicengland.org.uk, britishlistedbuildings.co.uk, roguish.wordpress.com, and
rictornorton.co.uk on its curl retry); 1 x 404 (covecollective); 2 host failures CURED by curl
(smuggling.co.uk TLS -> 49,097 B; radar.brookes.ac.uk binary PDF -> pypdf 82,937 B). A third
PDF (cambridge.org, the 1794 crimp riots) was curl-fetched directly, 19 pages -> 54,020 B.

### C0 scan
`LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]'` over **25 authored files**
(the dossier, this receipt, both simulation scripts, the call log, all 14 merge parts, the
assembler, the extractor, the extract): **0 files with any C0 byte.** Non-ASCII survey of the
deliverable: 14 distinct characters, all typographic (em dash, section sign, middle dot, arrows,
Sigma, multiplication sign) or accented Latin in proper names. **No emoji.**

### Ledger
**45 numbered items**, 1..45 contiguous (verified by grep), in seven buckets, built by
`RINST6-merge/ledger-extract.py` over 82 marker sentences. All **17 inline L.n pointers**
(L.1..L.17) present and none orphaned.

### Table integrity (verified by grep on the assembled file)
Roster table 28 rows · verdict table 28 rows · UC seam table 28 rows · facet-simulation table
28 rows · engine-gap table 16 rows.

### The five findings for docs/DESIGN_DWELLINGS_PROGRAM.md
1. **`NO_BUILDING` must become a first-class, reasoned, projectable verdict** (engine gap E1,
   asked by 7 of 9 families). On this shelf only 3 of 28 rows get a building of their own and
   11 get no cell anywhere; the engine today resolves every institution to a template and draws
   a box. Six tranches have accumulated this ask; it is the cheapest correction with the widest
   effect.
2. **A building must be able to have a SECOND, subordinate entrance with different reach**
   (E2). `interiorModel.js` derives one `entranceSide` and rotates the plan to it. Without a
   second entrance the two-plan front, the receiver's side door and the external cellar stair
   are all inexpressible. Requested independently by families A, C, E and G.
3. **`compound.entrances: 1` as a first-class parti attribute -- a TWO-TRANCHE joint
   recommendation.** R-INST-5's finding (3) reached it from five magical precincts; this tranche
   reaches it from the rookery court, the fondaco, the han, the bastle and the triad lodge. When
   a parti declares it, law 6 reads the COURT as the frontage surface for every cell but the gate.
4. **THE COMPLEMENT LAW: the illicit building is the complement of the licit one.** Where a
   pawnbroker exists the fence needs no premises; where a bonded warehouse exists the smuggler's
   problem is arbitrage; where a legal slave market exists the trafficking row does not fire at
   all (the catalog's own `exclusionConditions` say so). The engine can COMPUTE this because it
   knows the roster, and it needs no stored byte.
5. **The UC seam is ONE joint kind at ONE anchor.** `stair` at "cellar door" carries eleven of
   the 28 seam rows; `colonization.js`'s `frontFor(seed)` already implements the UNIVERSAL
   FRONT and returns the canonical institution key, so DW law 7's per-building query is a lookup,
   not a subsystem, and charter section 16's carry-note 1 is already satisfied. Two caveats:
   UC-5 `connectivity.js` does not exist at any ref, so routes between components cannot yet be
   drawn; and the criminal shelf seeds the sheet only 3 times in 28, so a criminal basement is
   nearly always a licit institution's seed.
   **Sub-item, recommendation R-INST-6-1 (for the catalog train, not DW):** `Underground city`
   (L2383) and `Black market bazaar` (L2375) are explicitly subterranean in their own text and
   seed NOTHING, because neither declares `facets: { subterranean }`. Adding it is
   golden-shifting and carries the declared-shift bill.

### RESEARCH-COMPLETE statement (this is the LAST tranche)
All six DW-R tranches plus the section 452/453 circulation-and-storage addendum are delivered,
and DW-0 can start from the seven documents rather than from the charter alone.
**`draft-R-INST-1-CIVIC-DEFENSE.md`** 139,063 B, civic/administrative + defense/military,
14 families A-N -- delivered BEFORE ODQ section 452/453 and therefore OWES the circulation and
storage addendum pass (charter section 8 says so).
**`draft-R-INST-2-TRADE-CRAFTS.md`** 581,595 B, trade/commerce/crafts, 124 entries in 20
families -- its banner retains PARTIAL for six residual measured-figure gaps (rows B-prime, F, J,
O, P, S); all 20 families otherwise at depth.
**`draft-R-INST-3-FAITH-LEARNING.md`** 370,440 B, faith + learning, 16 families -- banner
retains PARTIAL for four residual gaps and for an EXHAUSTED session search cap; all 16 families
at depth on reachable evidence.
**`draft-R-INST-4-HOSPITALITY-POVERTY-UTILITY.md`** 398,855 B, hospitality/entertainment/
poverty/utility -- 13 of 13 families at depth, 46-item ledger, the search cap never hit
(ODQ section 485.1).
**`draft-R-INST-5-MAGICAL.md`** 361,337 B, magical/fantasy (the fiction-and-lore leg) --
32 entries in 11 families, 6 FULL and 5 PARTIAL for measurement, 54-item ledger, seven engine
defects read from live code (ODQ section 488.1).
**`draft-R-INST-6-CRIMINAL.md`** 344382 B, criminal/underground and their fronts (the undercity
seam) -- 28 entries in 9 families, 6 FULL / 2 PARTIAL / 1 BOUNDARY-ONLY, 45-item ledger, two
executed engine simulations, and the UC SEAM TABLE binding every entry to the undercity component
beneath it.
**`draft-R-INST-CIRC-ADDENDUM.md`** 281,141 B, the ODQ section 452 circulation and section 453
storage closed classes, 17 families plus six dwelling types -- banner retains PARTIAL for two
DWR1A residuals.
Corpus total 2,132,431 B for the five siblings plus the addendum, plus this dossier.
**Read first, in order:** this dossier's section Sigma.2 (the sixteen engine gaps, of which the
first two block most families in all six tranches); R-INST-5's section 488.2 findings beside this
dossier's sections 1.4 and 15.2 (the two-tranche `entrances: 1` recommendation); this dossier's
section Sigma.5 (the UC seam table -- law 7 is the only founding law already half-built in landed
code); then each dossier's own ledger, since the seven ledgers are the P1c work order and they do
not overlap.
**One closing judgement, offered for veto:** across six tranches the research keeps returning the
same structural answer from unrelated literatures -- MOST CATALOG ENTRIES ARE NOT BUILDINGS. If
DW-0 signs bands assuming an institution is a building, the grammar will be wrong for the
majority of the roster in every settlement it draws.
