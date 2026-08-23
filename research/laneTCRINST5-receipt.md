# Lane TC-R-INST-5 receipt — MAGICAL / FANTASY institutions (DW-R tranche 5)

MARK: [OPUS-RUN · FABLE-VALIDATION OWED] (owner directive ODQ §484)
Model: claude-opus-5[1m]
Lane: TC-R-INST-5, SOLO (lane cap TWO, a sub-lane counts — no Agent/Workflow/sub-agent calls issued)

STARTED 2026-08-23T15:32:59Z

## RESUME POINT 2026-08-23T15:39:52Z

**(a) PROVEN.**
- Doctrine read whole: docs/DESIGN_DWELLINGS_PROGRAM.md (all sixteen sections, incl. §2 nine laws, §4 S6 circulation ODQ §452 + storage ODQ §453, §5 contracts, §8 corpus program naming R-INST-5 the fiction-and-lore leg, §13 anti-scope, §15 P1a-P1d, §16 carry-notes); memory files product-scope-boundaries.md, deity-doctrine-no-premade-pool.md, finite-semantics-law.md.
- Shape templates read: RINST4-subagent-brief.md (the (a)-(i) shape and the closed vocabularies) and draft-R-INST-4's head.md, assemble.sh and sec-E.md (the depth model).
- ROSTER ENUMERATED AND VERIFIED: 32 in-tranche entries in 11 families. Magic shelf 21/21 taken, Exotic shelf 7/7 taken, plus 4 Adventuring rows (L1394, L1401, L1408, L2110). Every one of the 32 re-read at its line number in the clean tree's src/data/institutionalCatalog.js (2,526 lines; tier blocks thorp L6 / hamlet L155 / village L435 / town L891 / city L1539 / metropolis L2249).
- Keyword sweep run over all 311 rows with the briefed 31-token list; every non-Magic/Exotic hit dispositioned (false hits: 'ward' in reeve/steward/administration; 'sage' in passage/message; 'mage' in pilgrimage/image).
- Sibling hand-offs greped and honoured: R-INST-1 (L1364 cross-ref, L1349 excluded here), R-INST-2 (Magic/Exotic shelves by charter), R-INST-3 (L812/L826/L1349/L2332 faith-and-learning halves held there, L2340 excluded to here, L2348 Great library HELD THERE - boundary only), R-INST-4 (L1401, L1408, L2110, L2171 handed here).
- ENGINE RECON COMPLETE (read-only, at chair-baseproof-b10ed1a1), five files read in full or in the relevant scope:
  - src/domain/interior/interiorTemplates.js - INTERIOR_KINDS(8), ROOM_KINDS(28), FURNISHING_KINDS(22), the 8 templates, FUNCTION_VARIANT_ROOM(heals/feeds/arms/judges).
  - src/domain/spatial/cohesionWeave.js L258-319 - FACET_INFERENCE and the facetOf chokepoint.
  - src/domain/magicFilter.js + src/domain/arcaneInstitutionVocabulary.js - the BINARY magic-off strip (noMagicWorld fires only at magicExists===false or priorityMagic===0); called ONLY from components/InstitutionalGrid.jsx and store/selectors.js, NOT from the generation path.
  - src/generators/institutionProbability.js - THE GRADED magic license: magicMult = priorityMagic/50 times a tier penalty {thorp .15 hamlet .25 village .40 town .75 city 1.0 metropolis 1.0}; a druid route boost; a HARD ZERO below priorityMagic 66 for eleven high-magic keywords; x1.8 at >=66 / x0.3 at <=25 for the Magic and Exotic shelves; the adventurers'-hall monsterThreat gate x5/x3/x0.3; and the direct magicExists===false gate at L302.
  - src/domain/arcaneInstitutionIdentity.js + arcaneIdentity.js + magicLedger.js - the four-detector landscape and the documented Great-library tag-vs-keyword divergence.
- FACET SIMULATION EXECUTED over the 32 roster NAMES (RINST5-facetsim.cjs, node): 21 of 32 fall to 'generic'; three substring MIS-INFERENCES found (Warden's Lodge and Dragon resident both match /den/ inside 'Warden'/'resident' and infer 'vice'; Charlatan fortune tellers matches /fort/ inside 'fortune' and infers 'security'); one function facet fires (Healer -> heals); 28 of 32 are stripped at magic=0; nine are hard-zeroed below priorityMagic 66.

**(b) IN FLIGHT.** Writing RINST5-merge/head.md (the banner, sections 0, 0.1, 0.1b, 0.2, 0.3) before any web act, per the brief's print-the-roster-first rule.

**(c) NEXT.** head.md, then the assembler, then family research A-K in rounds (analogue -> genre convention -> engine contract), then 15, sigma, ledger, method, appendix.

Web acts so far: 0 WebSearch, 0 WebFetch (budget 45 / 60).

## RESUME POINT 2026-08-23T15:49:37Z

**(a) PROVEN.** head.md written and assembled (28,227 B; the dossier stub is 29,630 B). Research round 1 complete for eight of the eleven families. The anchor findings now in hand, each with its source:
- Uraniborg's basement laboratory: SIXTEEN ovens itemised by Brahe himself (3 bath-heaters, 1 digesting furnace with ashes, 4 large athanors, 2 small, 2 sand/ash distillation, 1 with a two-pipe bellows, 1 lamp furnace, 2 reverberatory - the count checks), each oven in its OWN NICHE, a circular working table round the vaulted room's central column, a spiral stair straight down from the family's Winter Room, five MORE ovens later set up in the Winter Room itself, condensers led out through the windows into the cold air and back, the laboratory next to the wine cellar, and a separate vaulted waste cellar outside the palace. Source: the npj Heritage Science 2024 paper, curl-fetched after nature.com 303'd.
- The observatory NEGATION landed: before Tycho the observatory was a ROOM - Oxford's first Professor of Astronomy used the top room of the Schools Quadrangle gate tower rather than a purpose-built observatory.
- The druid NEGATION landed hard: classical authors place druids in WOODED GROVES only and never at stone monuments; the druid-stone-circle link is Aubrey's and Stukeley's 17th-18th century invention over a gap of more than two thousand years.
- Cardington airship shed No. 1 (1917): 213.4 m long, 55.3 m clear width, 37.2 m clear centre height, later extended to 247 m with the roof raised 10.7 m; the 1926 mooring mast 61 m high, 21 m diameter at ground tapering to 8.1 m at a passenger platform 52 m up.
- Fondaco dei Tedeschi: 56 rooms plus storage, over a hundred merchants and as many servants, a five-bay canal loggia, one central courtyard with one medieval well, and a ceremonial surrender of weapons to the Fontegher who assigned the rooms.
- Rothwell charnel chapel: 9 x 4 x 2.5 m, tamped clay floor, two central bone stacks, crania on shelves along both long walls, c. 2,500 individuals; one of only two in-situ medieval English ossuaries.
- Higham Great Lodge: a moat 10 m wide and 2 m deep round a 130 x 90 m enclosure; Bradgate Park's lodge a three-bay base-cruck hall with service bay and chamber; lodges sited on an EMINENCE to survey the park and moated against poaching gangs.
- Avebury: ditch originally 9 m deep (EH) and 20-21 m wide, bank 22-30 m wide at base, four causewayed entrances each about 20 m, enclosure 11.5 ha / c. 350 m across, avenue stones about 11 m apart. A number audit is owed on the bank height (EH's 17 m against the digest's 6 m).
- Boerhaave's portable furnace 24 x 24 x 37 cm, 16 kg, invented because his room HAD ONLY ONE CHIMNEY - the chimney count caps the furnace count.
- The elephant house of 1255 at the Tower: 40 x 20 ft.

**(b) IN FLIGHT.** Writing sec-1.md (the spine) and the family sections A, B, E, F, G, I, J, K, which are at depth. C, D and H still owe one round each.

**(c) NEXT.** The remaining round for C/D/H and the per-family negation searches not yet run, then 15, sigma, ledger, method, appendix.

Web acts: 20 WebSearch (of 45), 12 WebFetch + 2 curl = 14 fetch acts (of 60). GATED so far: historicengland.org.uk list entry (5,582 B Cloudflare interstitial - NOT a fetch); 403: hrp.org.uk, britishlistedbuildings.co.uk, fulcrum.org; 303 auth redirects not followed: nature.com (recovered by curl), link.springer.com; ENOTFOUND: cabinet.ox.ac.uk.

## RESUME POINT 2026-08-23T16:02:20Z

**(a) PROVEN.** Four family sections written and C0-clean: sec-A (32,994 B), sec-B (28,822 B), sec-C (19,668 B), sec-D (20,379 B). New CONFIRMED material since the last point:
- Collegiate circulation: rooms 'arranged in sets on either side of central wooden staircases', a staircase IS a group of rooms entered from the quad, 'sets of rooms with no internal corridors'. This CONTRADICTS the charter's §4 S6 aside that colleges license the corridor early, and is written up as a correction-candidate for CT-0.
- The trade street: Paris's rue Neuve Notre-Dame book quarter from c.1200 (booksellers, parchment-sellers, illuminators, scribes, binders living and working together) and London's Goldsmiths' Row (Stow: ten houses, fourteen shops; three to five storeys; shopfronts open to the light). The DISTRICT entries are zonings of shop-houses, and a shop is a sub-building unit.
- The ergastulum: an underground private prison on a Roman estate, narrow high windows, chained overnight, an ergastularius overseer; Villa of Rufio (Giano dell'Umbria) excavated 2003-06, a pars rustica basement read as a confinement facility, Augustan, site c. 9,000 m2.
- Palazzo Loredan dell'Ambasciatore: NOT purpose-built; offered by Doge Francesco Loredan in 1752 in exchange for 29 years of restorations. The embassy is a re-used palace.
- LOCAL PROOF (awk over the flat table, executed): three of the eleven keywords in institutionProbability's hard-zero list -- 'magical banking', 'magic item consignment', 'enchanting quarter' -- match NO catalog institution name at any tier; 'magic item consignment' is in fact a member of magicFilter's ARCANE_GOODS list. The gate mixes a goods vocabulary into an institution gate.

**(b) IN FLIGHT.** sec-E (circle and grove), sec-F (high-magic infrastructure), sec-G (constructed and undead workforce).

**(c) NEXT.** sec-H, sec-I, sec-J, sec-K; then sec-1 the spine, sec-15, sec-sigma, sec-ledger, sec-method, sec-appendix; then the 0.3 status map is filled and the assembler is run.

Web acts: 29 WebSearch (of 45), 13 WebFetch + 2 curl = 15 fetch acts (of 60).

## RESUME POINT 2026-08-23T16:19:43Z

**(a) PROVEN.** ALL ELEVEN FAMILY SECTIONS WRITTEN AND C0-CLEAN. Assembler run: draft-R-INST-5-MAGICAL.md is 282,584 B. Section sizes: A 32,994 / B 28,822 / C 19,668 / D 20,379 / E 21,236 / F 24,254 / G 22,693 / H 17,426 / I 21,421 / J 23,443 / K 21,641; head 28,227.
- Families at FULL depth (analogue + measured + negation): A, B, E, F, G(analogue), I, J, K(analogue).
- Families marked PARTIAL for MEASUREMENT with the owed item named: C (no measured collegiate figure), D (no measured shop plan), G (no ergastulum cell size), H (no booth or parlour dimension), K (one measured cell only).
- Five engine gaps identified and each proved by reading the file: G1 three unanchored-substring mis-inferences in FACET_INFERENCE; G2 the four (high magic)/Dragon rows carrying minTier metropolis while sitting in the CITY block; G3 a mundane chemical trade struck by a dead-magic world; G4 the Adventurers' charter hall shelf artefact (Magic at hamlet/village, Adventuring at town) producing two different live behaviours; G5 the Great library's shelf-versus-tag divergence reaching the generation multiplier; G6 the Dragon resident generation-vs-UI gate divergence.
- Non-European anchors now in hand for section 15: Ulugh Beg's observatory (circular block 46 m diameter, three storeys c. 30 m, a Fakhri sextant of 40.04 m radius in a meridian trench, 70.2 cm per degree - the arc arithmetic checks to three levels), the Jantar Mantar (19 instruments 1728-34; Samrat Yantra 27.4 m, gnomon 22.6 m), and waidan's two settings (imperial workshop at Chang'an versus remote mountain hermitage).

**(b) IN FLIGHT.** sec-15, then sec-1 (the spine), sec-sigma, sec-ledger, sec-method, sec-appendix, then the 0.3 status map.

**(c) NEXT.** Fill 0.3, re-run the assembler, run the final C0 sweep and the label tally, write the FINAL block.

Web acts: 36 WebSearch (of 45), 13 WebFetch + 2 curl = 15 fetch acts (of 60). No further searching is planned; the remaining budget is the reserve.

## FINAL 2026-08-23T16:32:39Z

**LANE TC-R-INST-5 — MAGICAL / FANTASY INSTITUTIONS (DW-R tranche 5, the fiction-and-lore leg). COMPLETE.**
MARK: **[OPUS-RUN · FABLE-VALIDATION OWED]** (owner directive ODQ §484). Model `claude-opus-5[1m]`.
Lane SOLO end to end: **no Agent, Workflow or sub-agent call of any kind was issued** (lane cap TWO, a sub-lane counts).
Read-only on the repo and on the clean tree throughout: no git command, no test, no build, no edit.

### Sizes
- `draft-R-INST-5-MAGICAL.md` — **361,337 bytes, 4,408 lines**, assembled ONLY by `RINST5-merge/assemble.sh`; never hand-edited.
- `laneTCRINST5-receipt.md` — this file, 21,324 bytes at the time of writing.
- Section files (exact bytes): head 32,922 · §1 9,765 · A 33,344 · B 28,822 · C 19,668 · D 20,379 · E 21,236 · F 24,254 · G 22,693 · H 17,426 · I 21,421 · J 23,443 · K 21,641 · §15 10,295 · §Σ 21,994 · §L 12,850 · §M 10,282 · APPENDIX 8,486.

### Status map summary
**32 catalog entries in 11 families; all eleven written.** Six families at FULL depth (A, B, E, F, I, J); five AT DEPTH FOR ANALOGUE and **PARTIAL FOR MEASUREMENT** with the owed item named in their own (b) and in §L (C, D, G, H, K). Roster is grep-complete: the whole Magic shelf (21/21), the whole Exotic shelf (7/7) and 4 Adventuring rows handed here by siblings; 21+7+4 = 32, every one re-verified at its line in `src/data/institutionalCatalog.js`. 14 rows excluded with reason. Every family carries the full (a)-(i) shape, with (i) carrying BOTH the genre CONVENTION and the ENGINE CONTRACT read from live code. §1 (7 anchor findings), §15 (continental + non-European), §Σ (all nine laws + 8 engine gaps + 14 grammar requests + the 32-entry verdict table), §L (54 items), §M and the APPENDIX are all complete.

### Label tally (grep counts over head + §1 + the 11 families + §15 + §Σ; ledger/method/appendix excluded)
CONFIRMED (bare) **71** · CONFIRMED-digest **73** · PLAUSIBLE **19** · CONVENTION **26** · GATED **3** · `HOME:` tags **53** · `NO TYPED HOME` **14**.
Read honestly: a 71:73 bare-to-digest ratio means about half the load-bearing claims rest on digests of pages never opened. **Eight pages were opened all session.** §M.5 states this and §L.3 lists the digest-only figures by name.

### Web-act totals (from RINST5-merge/calls.tsv, 48 rows)
**31 WebSearch** of 45 · **14 WebFetch** of 60 (8× 200, 3× 403, 2× 303 auth-redirect, 1× ENOTFOUND) · **2 curl** (1 recovered nature.com's 303 and produced the dossier's best source; 1 hit the Historic England Cloudflare interstitial at 5,582 B, labelled GATED and NOT a fetch). Total fetch acts 16 of 60. 14 searches and 44 fetches unspent.
A CORRECTION recorded in §M.1: two earlier RESUME POINTs said 36 searches; the call log's tally is 31, and the log is the receipt of record.

### C0 scan
A `LC_ALL=C grep -c` over the C0 control range (hex 01-08, 0b, 0c, 0e-1f) was run at every RESUME POINT and at close over **23 authored files** (receipt, dossier, all 18 section/head files, calls.tsv, assemble.sh, facetsim.cjs): **0 in every file.** A separate unicode pass over the assembled dossier confirms **no emoji**; the non-ASCII inventory is section marks, diacritics, dashes, arrows and Sigma only.

### Ledger
**54 numbered items in 8 buckets**, built by a python pass over the 15 authored section files that extracted **69 marker sentences** to `RINST5-merge/ledger-extract.txt` — complete by construction, not by recollection.

### THE FIVE FINDINGS THE CHAIR MUST CARRY INTO docs/DESIGN_DWELLINGS_PROGRAM.md

**1. DW needs an OCCUPATION relation, distinct from construction — four families demanded it independently.** A druid circle occupies a ring it did not build (the druid-stone-circle link is Aubrey's and Stukeley's invention over a two-thousand-year gap, and the classical sources put druids in GROVES); an undead-labour institution should point at an existing charnel; a planar embassy is a lent palace (the Palazzo Loredan, 1752, in exchange for 29 years of restorations); and a resident dragon — for which no enclosing structure has ever been built at any scale — takes a ruin, a cistern, an amphitheatre or an undercity void. An institution's plan is sometimes ANOTHER building's plan plus a few added cells, a changed control, and dated modifications that are law-5 fossils running forward. This is the tranche's largest structural request and it also forecloses the druid error permanently: no institution should ever GENERATE a landscape fossil.

**2. The infrastructure of a new practice starts in somebody else's room, and the ladder's bottom rung is always HOSTED.** Three independent negation searches returned one answer: the observatory before Tycho was a top room (Oxford's first Professor of Astronomy used the Schools Quadrangle gate tower); Europe's first long-distance signalling network ran out of "one of the chambers of ladite maison" with a clock and a telescope; the resident embassy from its invention in 1455 occupied a lent house. A generator that gives every arcane institution its own building has skipped the rung the evidence is most confident about.

**3. DW law 6 (frontage from the parcel) INVERTS for a precinct, and the single controlled entrance is the tranche's most repeated finding — five instances by five routes.** The collegiate court faces its quadrangle and shows the street one gatehouse; the moated lodge is entered by one causeway; the fondaco shows the street a wall and one gate where arrivals surrendered their weapons to the Fontegher who assigned their rooms; the teleport chamber's whole plan is holding space + controlled threshold + officer's cell; the Tower's menagerie is built INTO the barbican. The frontage reader must accept an internal court, a causeway or a transport edge as the frontage surface, with the street reduced to one typed joint — and `compound.entrances: 1` deserves to be a first-class parti attribute.

**4. Most of what sits on the catalog's Magic shelf is not magic, and the shelf is currently a semantic gate in three live code paths.** This dossier assigns `magicLicense: NONE` to **11 of 32 rows** (nine distinct institutions): the alchemist shop and quarter (a real chemical trade), the charlatan ("non-magical" by the catalog's own words), the Warden's Lodge and the three charter halls plus the guilds (a park lodge and a doelen), the beast trainers ("common animals only"), the dragon resident (which the engine already exempts as "geographical, not magical") and the Great library (authored `education`). Only family F genuinely fails the setting-agnostic test. **The estate's own `arcaneInstitutionIdentity.js` already ruled that the tag is the semantics and the bucket is a shelf; three paths still read the shelf.** The recommendation is a declared per-entry `magicLicense: NONE | LOW | MEDIUM | HIGH` in the four tokens `getMagicLevel` already emits, with `clearSpan: EXTREME` as its structural consequence — so a high-magic world differs in SPANS, not in a magical room vocabulary.

**5. Six engine defects, each proved by reading the live code, none fixed (all owner-gated).** G1: three unanchored-substring mis-inferences in `FACET_INFERENCE` — `Warden's Lodge` and `Dragon resident` both match `/den/` and draw the TAVERN template, `Charlatan fortune tellers` matches `/fort/` and draws the BARRACKS template; the estate anchored the sibling detector's keywords at a word boundary for exactly this reason and never carried it across. G2: four "(high magic)" and `Dragon resident` rows carry `minTier: 'metropolis'` while authored in the CITY block. G3: a mundane chemical trade is deleted by a dead-magic world. G4: the `Adventurers' charter hall` sits on the Magic shelf at hamlet and village and the Adventuring shelf at town, so the two small-tier rows VANISH at magic=0 and are magic-multiplied while the town row is neither — a shelf, not a design. G5: the Great library's shelf reaches `institutionProbability`'s multiplier, a path the documented UI strip does not cover. G6: `Dragon resident` diverges between the generation gate (survives) and the UI gate (hidden). Plus G7: three of the eleven hard-zero keywords match no catalog row at all, and one of them is a member of `magicFilter`'s ARCANE_GOODS — a goods vocabulary has leaked into an institution gate.

**Owed, and named rather than glossed:** the five PARTIAL families' measurements (§L.1-2, items 1-5); Libavius's `domus chymici` room list, the tranche's most valuable blocked document (fulcrum.org 403, cabinet.ox.ac.uk unresolvable); a live verification of the G1 mis-inferences against a generated settlement (§L item 53 names the experiment); three families (C, F, H) had no DEDICATED negation query and each says so in its own (c); and the catalog's `Airship docking` description says "Eberron-style", which is a named proprietary setting in shipped prose and is reported as a scope defect under owner boundary 6.

### C0 postscript — the hazard fired on this lane's own prose, and the scan caught it

The first write of this FINAL block introduced **7 C0 bytes into the receipt** — six from the
literal C0 range spelled out inside a shell-expanded description of the C0 scan itself, and one
0x08 from a backslash-b written while describing a word-boundary anchor. Both were produced by
writing ABOUT control characters, which is the exact shape the estate's authoring-hazard memory
records ("U+001F enters YOUR OWN prose while writing ABOUT it — scan authored files, not just
ported ones"). The close scan caught them, both were rewritten in plain words, and the final
sweep over **24 authored files** returns **0**. Recorded because a successor writing a method
section about C0 scanning will hit it again.

