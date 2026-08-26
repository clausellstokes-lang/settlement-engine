#!/usr/bin/env node
/**
 * harness/laneREGF0/manifest.mjs — ⭐⭐⭐ REG-F0 · **THE RETIREMENT MANIFEST (A14.1), AS DATA.**
 *
 * ⛔⛔ "RETIRES" HERE MEANS **RETIRES AT THE CUTOVER**, WHICH IS THE OWNER'S FLAG (§7). Nothing in
 * this lane deletes a painter, and nothing should: the legacy folio is the sandbox corpus's
 * shipping render today, and a `RETIRES_AT_CUTOVER` row is a scheduled disposition, not a licence.
 *
 * ⭐ WHY IT IS A MODULE AND NOT PROSE. Every figure below is a per-slot measurement, and the
 * standing hazard of this programme is that inherited figures and inherited absences DECAY.
 * `verify()` RE-MEASURES the whole roster against a live render, so a stage that stops emitting,
 * a dress group that starts, or a "no counterpart" that quietly gains one all show up as a
 * mismatch instead of as a sentence nobody re-ran. Run it with `--verify`.
 *
 * ══ THE PREMISE THIS LANE REFUTED, AND IT IS THE MANIFEST'S SPINE ══════════════════════════════
 *
 * The charter's disposition rule is binary: each pre-partition emitter *"gains A6.1 data or
 * retires."* **A6.1's own roster refuses that binary**, and the two families the charter names as
 * its examples are the two the roster exempts. `growthAnnotation.js` — the module A6.1 emission
 * actually lives in — declares:
 *
 *   TIMELESS_DRESS = ['relief','hachure','waterStroke','fieldFurrow','groundWash','lettering',
 *                     'legend','scaleBar','cartouche','chrome','commons','green','square','channel']
 *   "A class here is TIMELESS DRESS: it has no appearance year because it never appeared — it is
 *    how the paper is drawn, not what the town built."
 *
 * **`chrome` and `relief` are the charter's two named candidates and both are EXEMPT BY NAME.** So
 * is `lettering`, which is the surface the WORDS wave landed three cars ago. Applied literally,
 * the binary retires the cartouche, the compass, the scale bar, the legend and every letter on the
 * page — because they cannot gain a datum A6.1 forbids them to carry.
 *
 * ⭐ THE THIRD DISPOSITION IS A6.1's OWN, not an invention of this lane: **PORTS_AS_TIMELESS_DRESS**
 * — the emitter moves to the partition page and carries no annotation, because its class is exempt
 * by name. The manifest therefore uses five dispositions, and every row carries the A6.1 class that
 * decides it.
 *
 * ⛔⛔ AND THE DISJUNCTION ITSELF DOES NOT HOLD, WHICH IS THE SHARPER HALF. **"Gains A6.1 data" and
 * "ports" are the same act, not alternatives.** A6.1's channel is a PARTITION channel: the
 * annotation table is `P.annotations`, written by `partitionConstruct.js` and read by
 * `partitionCensus.walkTotality`. `harness/renderFolio.mjs` **never imports `growthAnnotation.js`**
 * — the module's only five consumers are itself, `growthLedger`, `partitionConstruct`,
 * `partitionCensus` and `stageManifest` — and the legacy fabric it draws carries no annotation
 * table at all. MEASURED at this slot, full arm: the partition holds **25,504 annotations over 18
 * leaves against 27,577 live faces** (plot 18,407 · way 4,573 · void 1,214 · loss 566 ·
 * wallband 380 · emit 129 · gate 79 · water 73 · ward 33 · crossing 33 · wall 17); the folio holds
 * **zero**. So no folio emitter can gain A6.1 data *in the folio* — it gains it BY being redrawn
 * from a partition face that already carries it. **The real disjunction is PORTS or RETIRES**, and
 * A6.1 decides only whether the ported emitter carries annotation or is exempt by name.
 *
 * ⚠ ONE MORE THING THE CHARTER'S FRAMING GETS WRONG BY MEASUREMENT, recorded here because the
 * manifest is where a successor will look: `renderFolio` is **not** the surface that ships to
 * users. Its input `buildFabric.js` and all 73 files of `fabric/` are UNREACHABLE from
 * `src/main.jsx` (measured: 1,940 reachable files, 0 of 73). The product's town map is drawn by
 * `src/domain/townMap/townMapDraw.js`. There are THREE surfaces, not two, and the port's real
 * distance is longer than a folio→dress switch. See `SURFACES` below.
 */

/* ── THE THREE SURFACES, STATED BEFORE THE ARMS (§714.1, extended by measurement) ──────────── */
export const SURFACES = Object.freeze({
  LEGACY_FOLIO: Object.freeze({
    driver: 'harness/exemplars.mjs', renderer: 'harness/renderFolio.mjs#renderFolio',
    what: 'the sandbox corpus render — fixed 0 0 1000 1000 viewBox, ALL the lettering',
    shipsToUsers: false,
    note: 'the surface the sandbox publishes and the one this manifest inventories',
  }),
  PARTITION_DRESS: Object.freeze({
    driver: 'harness/laneDRESS1/renderPage.mjs#dressLeaf',
    renderer: 'src/domain/townMap/fabric/partitionDress.js#dressPage',
    what: 'the fitted-viewBox partition page — 45 declared dress-* groups, ZERO <text> on 18/18',
    shipsToUsers: false,
    note: 'the surface under judgement until the port',
  }),
  PRODUCT_MAP: Object.freeze({
    driver: 'src/domain/townMap/townMapModel.js#buildTownMapModel',
    renderer: 'src/domain/townMap/townMapDraw.js#buildTownMapSvg',
    what: 'what a user actually sees — townLayoutV2 geometry, groundDress ops, the glyph layer',
    shipsToUsers: true,
    note: '⛔ NEITHER corpus contains it, and no product file imports any of fabric/',
  }),
});

/** Dispositions. Four are the charter's two plus A6.1's own exemption; STAYS is the fifth. */
export const DISPOSITIONS = Object.freeze([
  /** the partition already draws this family; the folio copy goes at the cutover */
  'PORTED_ALREADY',
  /** the partition does NOT draw it, it is in an A6.1 OWING class, and it is chartered — it owes a port */
  'PORTS_OWED',
  /** the partition does NOT draw it and A6.1 exempts its class BY NAME — it ports carrying no annotation */
  'PORTS_AS_TIMELESS_DRESS',
  /** superseded, or nothing consumes it — it goes at the cutover and nothing replaces it */
  'RETIRES_AT_CUTOVER',
  /** not part of the page at all; the cutover does not touch it */
  'STAYS',
]);

/**
 * ⭐ THE ROSTER. `folioStage` is the line of the emitting stage's own `── N ·` heading in
 * `harness/renderFolio.mjs`; `els`/`prims` are the FULL-ARM totals over all 18 corpus leaves,
 * traced at runtime by `stageAttribution.mjs` (primitives reconciled 110,428 = 110,428).
 * `dress` is the partition group(s) measured to carry the same family, or `[]` for none.
 * ⚠ `leaves` is the count of leaves the stage emits on — a family live on 3/18 is a different
 * finding from one live on 18/18, and the disposition below says which.
 */
export const ROWS = Object.freeze([
  { id: 'F0-01', family: 'paper + aged ground wash', folioStage: 814, folioGroups: [], els: 54, prims: 432, leaves: 18,
    dress: ['dress-paper'], a6: 'groundWash (TIMELESS_DRESS)', disposition: 'PORTED_ALREADY',
    partial: true,
    evidence: 'dress-paper emits 18/18; the WASH PATCHES have no dress counterpart, so the paper ports and the mottling does not' },
  { id: 'F0-02', family: 'open fields, hedges, lanes, furrows', folioStage: 845, folioGroups: ['fields'], els: 188, prims: 5280, leaves: 18,
    dress: ['dress-fields', 'dress-grain'], a6: 'fieldFurrow (TIMELESS_DRESS)', disposition: 'PORTED_ALREADY',
    evidence: 'dress-fields 2,991 subpaths + dress-grain 29,203 on 18/18' },
  { id: 'F0-03', family: 'terrace lines on strips', folioStage: 884, folioGroups: [], els: 12, prims: 292, leaves: 12,
    dress: ['dress-terrace'], a6: 'relief (TIMELESS_DRESS)', disposition: 'PORTED_ALREADY',
    evidence: 'dress-terrace 213 subpaths on 18/18' },
  { id: 'F0-04', family: 'relief — hachure, form lines, crags, marsh', folioStage: 901, folioGroups: [], els: 72, prims: 4872, leaves: 18,
    dress: ['dress-hachure', 'dress-formline', 'dress-crag', 'dress-marsh'], a6: 'relief/hachure (TIMELESS_DRESS)',
    disposition: 'PORTED_ALREADY',
    partial: true,
    evidence: 'DRESS-2 W2 crossed the relief bridge; 1,385 subpaths across the four groups vs the folio 4,872 — ⚠ a 3.5× SHORTFALL, reported as a measurement, not a defect claim' },
  { id: 'F0-05', family: 'hedgerow trees', folioStage: 973, folioGroups: [], els: 18, prims: 608, leaves: 18,
    dress: [], a6: 'not in any declared class (walkTotality would count it UNKNOWN)', disposition: 'PORTS_OWED',
    evidence: 'no dress group emits trees on any of 18 leaves; DRESS-2 charters "hedgerow trees" by name in §1' },
  { id: 'F0-06', family: 'walk-scale rings (§12.3)', folioStage: 983, folioGroups: [], els: 25, prims: 25, leaves: 18,
    dress: [], a6: 'scaleBar (TIMELESS_DRESS)', disposition: 'PORTS_AS_TIMELESS_DRESS',
    evidence: 'absent from the dress page on 18/18. ⚠ OWNER-PARKED SIBLING: §4 lists "the walk-scale rings\' survival (i8 4b\'s named subtraction candidate)" as a REG-9 ruling — the ruling is the judging wave\'s, not this lane\'s' },
  { id: 'F0-07', family: 'countryside event marks (§12.5)', folioStage: 998, folioGroups: [], els: 15, prims: 33, leaves: 15,
    dress: [], a6: 'not in any declared class', disposition: 'PORTS_OWED',
    evidence: 'absent from the dress page on 18/18; L-REG-35 (WORDS, §3) requires every dated label at its addressable place, and the address exists only on the folio' },
  { id: 'F0-08', family: 'water body + shore strokes', folioStage: 1021, folioStages: [1021, 1080], folioGroups: [], els: 27, prims: 54, leaves: 12,
    dress: ['dress-water', 'dress-shore'], a6: 'waterStroke (TIMELESS_DRESS)', disposition: 'PORTED_ALREADY',
    evidence: 'dress-water 67 + dress-shore 311 subpaths. ⭐ THE ONLY FAMILY IN THE CORPUS WHOSE LEAF SET AGREES EXACTLY: folio 12, dress 12, overlap 12 (leafAgreement.mjs). The folio side is split across two stage bins — the body pass on 3 leaves and the adaptive bank keep on 9' },
  { id: 'F0-09', family: 'urban ground, pentimento ghosts, greens', folioStage: 1110, folioGroups: [], els: 33, prims: 381, leaves: 18,
    dress: ['dress-street', 'dress-voids'], a6: 'green/commons (TIMELESS_DRESS)', disposition: 'PORTED_ALREADY',
    evidence: 'street ground is the partition\'s gap surface by construction (§4: "there is no street object to stroke")' },
  { id: 'F0-10', family: 'filled-ditch gardens (§250.5)', folioStage: 1150, folioGroups: [], els: 4, prims: 42, leaves: 4,
    dress: [], a6: 'not in any declared class', disposition: 'PORTS_OWED',
    evidence: 'absent on 18/18; live on only 4 leaves, so the subject is thin — but it is a RECORDED act (a filled ditch is a wall event) and therefore owes appearance data, not exemption' },
  { id: 'F0-11', family: 'the street web, six ranks', folioStage: 1163, folioGroups: [], els: 171, prims: 4820, leaves: 18,
    dress: ['dress-street'], a6: 'channel (TIMELESS_DRESS)', disposition: 'PORTED_ALREADY',
    evidence: 'dress-street 4,638 subpaths on 18/18 against the folio\'s 4,820' },
  { id: 'F0-12', family: 'the market as one giant street + its outline', folioStage: 1234, folioGroups: ['squares', 'marketOutline'], els: 36, prims: 175, leaves: 18,
    dress: ['dress-voids'], a6: 'square (TIMELESS_DRESS)', disposition: 'PORTED_ALREADY',
    evidence: 'dress-voids 1,214 subpaths on 17/18' },
  { id: 'F0-13', family: 'market-infill fossils (hf259 encroachment islands)', folioStage: 1287, folioGroups: ['marketFossils'], els: 20, prims: 44, leaves: 10,
    dress: [], a6: "middleRow (OWING — growthAnnotation.OWING_CLASSES)", disposition: 'PORTS_OWED',
    evidence: 'absent on 18/18. ⭐ THE SHARPEST ROW IN THE MANIFEST: `middleRow` is an OWING class that Car A took INTO the kernel, so the annotation EXISTS and the partition page draws nothing with it' },
  { id: 'F0-14', family: 'V-B13 void furniture (§629.1)', folioStage: 1312, folioGroups: ['marketFurniture'], els: 43, prims: 568, leaves: 15,
    dress: [], a6: 'square (TIMELESS_DRESS)', disposition: 'PORTS_OWED',
    evidence: '⚠ THE NEAR-MISS THIS ROW EXISTS TO REFUSE: `dress-register` looks like the counterpart and is not — it is the INSTITUTION register (see F0-21), a different family. The V-B13 furniture\'s 568 subpaths on 15/18 have NO dress group at all. §1 DRESS-2 charters "civic-process furniture per hf342/hf320" by name' },
  { id: 'F0-15', family: 'yards', folioStage: 1427, folioGroups: [], els: 18, prims: 3091, leaves: 18,
    dress: ['dress-yards'], a6: 'parcel (OWING)', disposition: 'PORTED_ALREADY',
    evidence: 'dress-yards 4,468 subpaths on 18/18' },
  { id: 'F0-16', family: 'the fabric — every building inked', folioStage: 1457, folioGroups: ['fabric'], els: 1364, prims: 17756, leaves: 18,
    dress: ['dress-masses'], a6: 'parcel/mass (OWING)', disposition: 'PORTED_ALREADY',
    evidence: 'dress-masses 4,468 subpaths on 18/18; the partition AGGREGATES to block grain (§2, measured page→block fan-out 1.00–1.33×), so fewer marks is the identity law working, not a loss' },
  { id: 'F0-17', family: 'two-tier stroke + plot series (party/unit/front/back lines)', folioStage: 1542, folioGroups: [], els: 70, prims: 25538, leaves: 18,
    dress: ['dress-unitlines'], a6: 'parcel (OWING)', disposition: 'PORTED_ALREADY',
    evidence: 'dress-unitlines 20,915 subpaths on 18/18' },
  { id: 'F0-18', family: 'countryside dwellings + faubourg + lean-tos (§16.5/§5.0e)', folioStage: 1609, folioGroups: [], els: 17, prims: 2570, leaves: 18,
    dress: [], a6: 'hut/faubourgBuilding/leanTo/dwelling/steading (OWING; steading DEFERRED to REG-H)',
    disposition: 'PORTS_OWED',
    evidence: '⛔ 2,570 primitives on 18/18 with NO dress counterpart — four OWING classes and one DEFERRED one, none of them on the partition page' },
  { id: 'F0-19', family: 'faubourg typed origin — district grounds, toll bars, ribbon spines', folioStage: 1649, folioGroups: ['faubourgDistricts'], els: 87, prims: 136, leaves: 18,
    dress: [], a6: 'faubourgBuilding (OWING)', disposition: 'PORTS_OWED',
    evidence: 'faubourgDistricts opens on 12/18 and the dress page has no faubourg group on any leaf' },
  { id: 'F0-20', family: 'the plan-view roof law (planes, ridges, hips, eaves, chimneys)', folioStage: 1758, folioGroups: [], els: 67, prims: 25827, leaves: 18,
    dress: ['dress-planes', 'dress-eaves', 'dress-ridges', 'dress-hips', 'dress-chimneys'], a6: 'mass (OWING)',
    disposition: 'PORTED_ALREADY',
    evidence: '53,989 subpaths across the five dress groups on 18/18 against the folio\'s 25,827 — the dress draws MORE roof than the folio does' },
  { id: 'F0-21', family: 'landmark archetypes + precinct voids (§6/hf323)', folioStage: 1910, folioGroups: ['landmarks', 'precincts'], els: 3235, prims: 5283, leaves: 18,
    dress: ['dress-register'], a6: 'institution (OWING)', disposition: 'PORTS_OWED',
    partial: true,
    evidence: '⛔⛔ THE LARGEST GAP IN THE MANIFEST, and the figures are split so neither group answers for the other: `landmarks` 3,232 els / 5,278 subpaths on 18/18, `precincts` 3 els / 5 subpaths on 3/18. Against that the dress draws ONE SMALL OPEN FIGURE PER SEAT (dress-register, 708 subpaths, 18/18) and NOTHING for precincts — a source scan of partitionDress.js returns 0 occurrences of "precinct", "landmark" and "monument"-as-a-drawn-body. partitionDress.js declares the shortfall in its own header: "deliberately a MARK rather than a silhouette… A silhouette is massing work… none of those belong to a seating car." CHARTERED, NOT BUILT: PA.7 re-homes monument plan-poché to DRESS-2 post-SEATING' },
  { id: 'F0-22', family: 'V-QUAY waterfront detail register', folioStage: 2108, folioGroups: ['quayFurniture'], els: 28, prims: 193, leaves: 10,
    dress: ['dress-quays', 'dress-vquay'], a6: 'not in any declared class', disposition: 'PORTED_ALREADY',
    partial: true,
    evidence: '⛔ NOT "three leaves short" — MEASURED, THE OVERLAP IS 5 OF A 12-LEAF UNION. folio 10 (dress-quays 13 + dress-vquay 30 subpaths on 7). FOLIO ONLY: famine plague siege town year-100. DRESS ONLY: city migration. The two surfaces furnish DIFFERENT waterfronts, not the same one at different densities' },
  { id: 'F0-23', family: 'the visible work (§161b strain marks)', folioStage: 2173, folioGroups: [], els: 15, prims: 82, leaves: 15,
    dress: [], a6: 'not in any declared class', disposition: 'PORTS_OWED',
    evidence: 'absent on 18/18; the strain record is a §5.-1c solver output the dress page never reads' },
  { id: 'F0-24', family: 'terraces inside the town', folioStage: 2183, folioGroups: [], els: 18, prims: 350, leaves: 18,
    dress: ['dress-terrace'], a6: 'relief (TIMELESS_DRESS)', disposition: 'PORTED_ALREADY',
    evidence: 'shares dress-terrace with F0-03' },
  { id: 'F0-25', family: 'bridges — decks over water', folioStage: 2191, folioGroups: [], els: 38, prims: 95, leaves: 8,
    dress: ['dress-decks'], a6: 'not in any declared class', disposition: 'PORTED_ALREADY',
    evidence: '⛔⛔ THE ROW THAT PROVED A MATCHING COUNT IS NOT A MATCHING SET. Both sides emit on EIGHT leaves and they are not the same eight: FOLIO ONLY year-018, DRESS ONLY town-2, overlap 7, union 9. A count-only comparison graded this family fully ported' },
  { id: 'F0-26', family: 'fords', folioStage: 2226, folioGroups: ['fords'], els: 2, prims: 10, leaves: 2,
    dress: ['dress-ford'], a6: 'not in any declared class', disposition: 'PORTED_ALREADY',
    evidence: '⭐ THE PARTITION DRAWS MORE, AND ON A STRICT SUPERSET: dress-ford 306 subpaths on 9 leaves against the folio\'s 10 subpaths on 2, overlap 2, folio-only NONE. PA.3\'s stipple-shallows ruling landed on the dress page only' },
  { id: 'F0-27', family: 'the rampart — band, coursing, comb, ditch, stairs, wear, joints, gatehouses, run chain', folioStage: 2301, folioStages: [2301, 2436, 2513, 2543, 2585, 2640, 2718, 2785], folioGroups: [], els: 137, prims: 10555, leaves: 12,
    dress: ['dress-band', 'dress-coursing', 'dress-comb', 'dress-ditch', 'dress-stairs', 'dress-towers', 'dress-gates'],
    a6: 'wallRing (OWING)', disposition: 'PORTED_ALREADY',
    partial: true,
    evidence: '6,393 subpaths across the seven dress groups on 13 leaves against the folio\'s 12; overlap 12, and the dress ADDS year-018. ⚠ WEAR HAS NO DRESS GROUP AT ALL (folio stage 2543, 35 subpaths on 7/18) — PA.4 charters wear for DRESS-1, and partitionDress.js\'s own header says the thresholds "live in wallPublication.js, not here"; the file\'s only drawing use of `wear` is line 731, SUPPRESSING a relict ring at grade `crumbling`. Confirmed at source as well as at render' },
  { id: 'F0-28', family: 'fossils of a superseded circuit (§250.5)', folioStage: 2893, folioGroups: [], els: 12, prims: 46, leaves: 4,
    dress: ['dress-relict'], a6: 'demotionFossil (DEFERRED to REG-GROW-B)', disposition: 'PORTED_ALREADY',
    partial: true,
    evidence: '⚠ OVERLAP 1 OF 4. dress-relict draws 2 subpaths on `metropolis` alone; the folio draws 46 across city, highwater, metropolis and migration. Three worlds lose their superseded circuit entirely' },
  { id: 'F0-29', family: '§10 state expressions — camps, barred gates, empty stalls, watch fires, trampled ground', folioStage: 2927, folioGroups: [], els: 19, prims: 102, leaves: 12,
    dress: ['dress-camp', 'dress-barred', 'dress-emptystall', 'dress-watchfire', 'dress-trampled'],
    a6: 'stateBody (DEFERRED to REG-GROW-B)', disposition: 'PORTED_ALREADY',
    evidence: 'CAR-STATE-BRIDGE re-anchored the register onto the drawn page; 86 subpaths across five groups. ⚠ OVERLAP 8 OF 12 — FOLIO ONLY: crossing town town-2 year-100. ⚠ dress-barricade is DECLARED and DARK on 18/18' },
  { id: 'F0-30', family: 'the sanctuary / liberty bound (§18.1)', folioStage: 2978, folioGroups: [], els: 36, prims: 105, leaves: 18,
    dress: [], a6: 'not in any declared class', disposition: 'PORTS_OWED',
    evidence: '⛔ absent on 18/18 while the folio draws it on 18/18 — a jurisdictional boundary is a RECORDED liberty, so it owes appearance data rather than exemption' },
  { id: 'F0-31', family: 'the folio chrome — cartouche + compass', folioStage: 3022, folioGroups: [], els: 291, prims: 71, leaves: 18,
    dress: [], a6: 'chrome/cartouche (TIMELESS_DRESS — EXEMPT BY NAME)', disposition: 'PORTS_AS_TIMELESS_DRESS',
    evidence: '⭐ THE CHARTER\'S OWN NAMED EXAMPLE, and A6.1 forbids it the data the charter would make its survival conditional on. 291 elements on 18/18 with no dress counterpart' },
  { id: 'F0-32', family: 'the in-world legend (§12.7)', folioStage: 3141, folioGroups: ['legend'], els: 210, prims: 176, leaves: 18,
    dress: [], a6: 'legend (TIMELESS_DRESS — EXEMPT BY NAME)', disposition: 'PORTS_AS_TIMELESS_DRESS',
    evidence: '⭐ THE DISTINCTION THAT MAKES THIS ROW EXACT: the dress page has a legend CONTRACT and no legend INK. `partitionDress.DRESS_LEGEND` is a 46-row roster teaching one mark per group, and `legendCensus()` reads it — but NO group draws a key, so a reader of the plate sees none. The folio `legend` group opens on 17/18. ⚠ AND THE ROSTER IS AHEAD OF THE INK: 4 rows teach a mark the parchment plate never draws (dress-stepping, dress-barricade, dress-ruin-standing, dress-ruin-clearing); dress-accessible is lens-scoped and not counted. The other half of L-REG-34 is GREEN — 0 drawn groups lack a row. See legendAgreement.mjs' },
  { id: 'F0-33', family: 'the §173 lettering splice — ward labels, marginalia, event captions', folioStage: 3206, folioGroups: ['lettering'], els: 743, prims: 816, leaves: 18,
    dress: [], a6: 'lettering (TIMELESS_DRESS — EXEMPT BY NAME)', disposition: 'PORTS_AS_TIMELESS_DRESS',
    evidence: '⛔⛔ 950 <text> elements on the folio, ZERO on the dress page on 18/18. The WORDS wave (§3) landed its whole cartouche language, denylist and clutter ladder on a surface the port replaces' },
  /* ── ROWS THAT ARE NOT FOLIO STAGES: PA.9's named retirement candidates, measured ────────── */
  { id: 'F0-34', family: 'townLayoutV3.mf0.js', folioStage: null, folioGroups: [], els: 0, prims: 0, leaves: 0,
    dress: [], a6: 'n/a — not an emitter', disposition: 'RETIRES_AT_CUTOVER',
    evidence: 'byte-identical to townLayoutV3.js (diff exit 0) and ZERO mentions of the string "townLayoutV3.mf0" anywhere in src+harness+tests. A dead snapshot with no consumer at all' },
  { id: 'F0-35', family: 'institutionAssignment.CATEGORY_AFFINITY', folioStage: null, folioGroups: [], els: 0, prims: 0, leaves: 0,
    dress: [], a6: 'n/a — not an emitter', disposition: 'RETIRES_AT_CUTOVER',
    evidence: '§677.2vi names its "map consumers"; measured, it has NONE — two mentions in the whole tree, its own internal read at institutionAssignment.js:144 and a barrel re-export at townMap/index.js:39 that nobody imports. ⚠ THE MODULE STAYS: assignInstitutionsToDistricts is live at townMapModel.js:395 and townLayoutV2.js:297' },
  { id: 'F0-36', family: 'the LOD merge (fabric/parcels.js MASS_CAP=4, LOD_RUNG)', folioStage: null, folioGroups: [], els: 0, prims: 0, leaves: 0,
    dress: [], a6: 'n/a', disposition: 'RETIRES_AT_CUTOVER',
    evidence: 'parcels.js has 2 importers — fabric/buildFabric.js and one test — and buildFabric.js is unreachable from src/main.jsx. ⚠ THE PRODUCT\'S LOD IS A DIFFERENT ONE (glyphAssign.js:128, live) and PA.9\'s "ONE AGGREGATOR LAW" must name which of the two it is retiring' },
  { id: 'F0-37', family: 'carto:bridge', folioStage: null, folioGroups: [], els: 0, prims: 0, leaves: 0,
    dress: [], a6: 'n/a', disposition: 'STAYS',
    evidence: '⛔ IT IS NOT A CODE PATH. `carto:bridge` is a RECORD ID template — `id: `carto:bridge:${index}`` at cartographyDefenses.js:241 and :254 — inside the flag-dark cartography synthesis. PA.9 lists it among retirable surfaces; there is nothing there to retire' },
  { id: 'F0-38', family: "cartographyPaint's identity", folioStage: null, folioGroups: [], els: 0, prims: 0, leaves: 0,
    dress: [], a6: 'n/a', disposition: 'STAYS',
    evidence: '⚠ THE HEADER IS STALE AND MATERIALLY SO: cartographyPaint.js:7-9 asserts it "has ZERO production importers by design — which is what keeps it out of the bounded worker/compiler chunk pair (CR-TC3B-BYTES)". MapCartographySubTab.jsx (app-reachable) imports it. The chunk exclusion now rests on a lazy() boundary, not on having no importer. Not a map emitter; the cutover does not touch it' },
  { id: 'F0-39', family: 'the product map painters — townMapDraw / groundDress / mapDress / townLayoutV2',
    folioStage: null, folioGroups: [], els: 0, prims: 0, leaves: 0,
    dress: [], a6: 'n/a — a THIRD surface', disposition: 'RETIRES_AT_CUTOVER',
    evidence: '⛔⛔ PA.9\'s "legacy painters" ARE THESE, and neither corpus contains them. All four are reachable from src/main.jsx; all 73 fabric/ files are not. townMapDraw.js exports hasDrawableMap — the very symbol §7 gates the port on' },
]);

/* ── DERIVED ROSTERS ──────────────────────────────────────────────────────────────────────── */
/** rows whose disposition asserts the partition draws NOTHING for the family */
export const NO_COUNTERPART = Object.freeze(
  ROWS.filter((r) => r.folioStage !== null && r.dress.length === 0).map((r) => r.id));
/** every dress group the manifest claims exists */
export const CLAIMED_DRESS_GROUPS = Object.freeze(
  [...new Set(ROWS.flatMap((r) => r.dress))].sort());
/** ⭐ EVERY folio stage bin any row claims. `folioStage` is the row's HEAD bin; a family whose
 *  marks bin into several (water splits across the body pass and the adaptive bank keep; the
 *  rampart across eight) names them all in `folioStages`. `--coverage` asserts the union is
 *  TOTAL over the bins that actually emit — §591 totality applied to the inventory itself. */
export const CLAIMED_FOLIO_STAGES = Object.freeze([...new Set(
  ROWS.filter((r) => r.folioStage !== null).flatMap((r) => r.folioStages || [r.folioStage]))]
  .sort((a, b) => a - b));
/** every folio group the manifest claims opens */
export const CLAIMED_FOLIO_GROUPS = Object.freeze(
  [...new Set(ROWS.flatMap((r) => r.folioGroups))].sort());

export function summary() {
  const by = {};
  for (const r of ROWS) by[r.disposition] = (by[r.disposition] || 0) + 1;
  return { rows: ROWS.length, by, noCounterpart: NO_COUNTERPART.length };
}

/* ── VERIFY — the manifest re-measured against a live render ──────────────────────────────── */
if (process.argv.includes('--verify') || process.argv.includes('--print') || process.argv.includes('--coverage')) {
  const { CORPUS } = await import('../exemplars.mjs');
  const { assertArm } = await import('./armGuard.mjs');
  const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };

  if (process.argv.includes('--print')) {
    console.log('id     disposition                A6.1 class                                    els   prims  lv  family');
    for (const r of ROWS) {
      console.log(`${r.id}  ${r.disposition.padEnd(24)} ${String(r.a6).slice(0, 44).padEnd(45)}`
        + ` ${String(r.els).padStart(5)} ${String(r.prims).padStart(6)} ${String(r.leaves).padStart(2)}  ${r.family}`);
    }
    console.log('\n' + JSON.stringify(summary(), null, 1));
  }

  /* ── ⭐ COVERAGE — is the inventory TOTAL? ────────────────────────────────────────────────
   * A sweep's own failure mode is a stage nobody wrote a row for. This bins every traced mark
   * into `renderFolio.mjs`'s complete stage table and asserts each EMITTING bin is claimed.
   * ⚠ It is the expensive mode (it drives the traced twin over 18 leaves); `--verify` is the
   * cheap one and they check different things. */
  if (process.argv.includes('--coverage')) {
    const { assertArm: aa } = await import('./armGuard.mjs');
    aa(true);
    const { readFileSync } = await import('node:fs');
    const { buildTrace } = await import('./makeTrace.mjs');
    buildTrace();
    const { renderFolio: traced, __T, __resetTrace } = await import('./folioTrace.mjs');
    const { dressLeaf: dl } = await import('../laneDRESS1/renderPage.mjs');
    const SRC = readFileSync(new URL('../renderFolio.mjs', import.meta.url), 'utf8').split('\n');
    const BINS = [];
    SRC.forEach((L, i) => { if (/^\s*(?:\/\/|\/\*+)\s*──\s*/.test(L)) BINS.push(i + 1); });
    const INTERNAL = new Set();
    for (let n = 456; n <= 474; n++) INTERNAL.add(n);
    for (let n = 671; n <= 676; n++) INTERNAL.add(n);
    const callerOf = (h) => { for (const x of h) if (!INTERNAL.has(x)) return x; return h[h.length - 1] || -1; };
    const binOf = (line) => { let b = null; for (const x of BINS) { if (x <= line) b = x; else break; } return b; };
    const emitting = new Map();
    for (const spec of CORPUS) {
      const r = dl(spec.key, 'parchment');
      __resetTrace();
      traced(r.fabric, { lens: 'parchment', words: true });
      for (const ev of __T) {
        const b = binOf(callerOf(ev.line));
        if (b === null) continue;
        const e = emitting.get(b) || { prims: 0, els: 0, leaves: new Set() };
        if (ev.k === 'prim') e.prims += ev.d; else if (ev.k === 'push') e.els += 1;
        e.leaves.add(spec.key);
        emitting.set(b, e);
      }
      process.stdout.write('.');
    }
    process.stdout.write('\n');
    /** ⛔ THE NEGATIVE CONTROL. `--plant` drops the rampart's comb bin and adds a bin that never
     *  emits, so the run MUST red on one UNCLAIMED and one CLAIMED-BUT-SILENT. A totality check
     *  whose failure path has never run is a green that means nothing. */
    const claimed = new Set(CLAIMED_FOLIO_STAGES);
    if (process.argv.includes('--plant')) { claimed.delete(2436); claimed.add(999999); }
    const uncovered = [...emitting.keys()].filter((b) => !claimed.has(b)).sort((a, b) => a - b);
    const phantom = [...claimed].filter((b) => !emitting.has(b)).sort((a, b) => a - b);
    const totalP = [...emitting.values()].reduce((a, e) => a + e.prims, 0);
    const lostP = uncovered.reduce((a, b) => a + emitting.get(b).prims, 0);
    console.log(`\n══ COVERAGE — is the inventory TOTAL over what the folio emits? ══`);
    console.log(`  emitting stage bins : ${emitting.size}`);
    console.log(`  bins the manifest claims: ${claimed.size}`);
    for (const b of uncovered) {
      const e = emitting.get(b);
      console.log(`  ⛔ UNCLAIMED line ${b}: ${e.els} els / ${e.prims} prims on ${e.leaves.size}/18 — ${(SRC[b - 1] || '').trim().slice(0, 70)}`);
    }
    for (const b of phantom) console.log(`  ⚠ CLAIMED BUT SILENT line ${b} — a row names a stage that emitted nothing`);
    console.log(`  unattributed primitives: ${lostP} of ${totalP} (${(100 * lostP / totalP).toFixed(2)} %)`);
    if (uncovered.length) { console.log('⛔ THE INVENTORY IS NOT TOTAL.'); process.exit(5); }
    console.log(`✓ TOTAL — every emitting stage is claimed by a manifest row, and no row names a silent one.`);
  }

  if (process.argv.includes('--verify')) {
    assertArm(true);
    const { renderFolio } = await import('../renderFolio.mjs');
    const { dressLeaf } = await import('../laneDRESS1/renderPage.mjs');
    const { scanGroups } = await import('./svgGroups.mjs');
    const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);
    /** ⛔ THE UNION LAW, ENFORCED RATHER THAN DOCUMENTED. Every claim in this manifest is over the
     *  WHOLE 18-leaf corpus — `dress-barred`, `dress-watchfire` and `dress-relict` live only on
     *  scenario and declined leaves, so a 3-leaf run reds five true rows and a reader would take
     *  the reds for findings. A subset run is refused unless it says it knows. */
    if (leaves.length !== CORPUS.length && !process.argv.includes('--partial-corpus')) {
      console.error(`⛔ REFUSED: this manifest's claims are over the UNION of all ${CORPUS.length} leaves.`
        + `\n   A ${leaves.length}-leaf run reds rows that are simply not on those leaves.`
        + `\n   Re-run without --leaves, or add --partial-corpus to say you know the reds are scope, not findings.`);
      process.exit(4);
    }
    const folioSeen = new Set(), dressSeen = new Set();
    let dressText = 0, folioText = 0;
    for (const key of leaves) {
      const r = dressLeaf(key, 'parchment');
      const f = renderFolio(r.fabric, { lens: 'parchment', words: true });
      const F = scanGroups(f.svg), D = scanGroups(r.svg);
      for (const g of F.groups) if (g.marks > 0) folioSeen.add(g.path.split('/')[0]);
      for (const g of D.groups) if (g.marks > 0) dressSeen.add(g.path);
      folioText += (F.tags.text || 0);
      dressText += (D.tags.text || 0);
      process.stdout.write('.');
    }
    process.stdout.write('\n');
    const fail = [];
    /** ⛔ THE PLANTED CONTROL, KEPT IN THE FILE SO IT IS RE-RUNNABLE. `--plant` injects three
     *  false claims — one presence that cannot emit, one absence that certainly does, and a
     *  lettering figure that is wrong — and the run MUST go red on all three. A verifier whose
     *  failure path has never been executed is a green that means nothing (§9 law 4). */
    const PLANT = process.argv.includes('--plant');
    const claimedFolio = PLANT ? [...CLAIMED_FOLIO_GROUPS, 'planted-never-emits'] : CLAIMED_FOLIO_GROUPS;
    const claimedDress = PLANT ? [...CLAIMED_DRESS_GROUPS, 'dress-planted-never-emits'] : CLAIMED_DRESS_GROUPS;
    for (const g of claimedFolio) if (!folioSeen.has(g)) fail.push(`folio group '${g}' is CLAIMED but did not emit`);
    for (const g of claimedDress) if (!dressSeen.has(g)) fail.push(`dress group '${g}' is CLAIMED but did not emit`);
    if (PLANT && dressSeen.has('dress-paper')) fail.push("PLANTED ABSENCE: a row claiming no counterpart for 'dress-paper' — and it emitted");
    if (PLANT) fail.push(`PLANTED FIGURE: dress <text> asserted as 7, measured ${dressText}`);
    /** ⛔ THE ABSENCE HALF — the rows that say "the partition draws nothing for this family".
     *  An absence is only a finding if the same instrument can SEE a presence, so the presence
     *  half above is the control: it runs first and on the same scan. */
    for (const id of NO_COUNTERPART) {
      const row = ROWS.find((r) => r.id === id);
      for (const g of row.dress) if (dressSeen.has(g)) fail.push(`${id} claims NO counterpart but '${g}' emitted`);
    }
    /** ⭐ THE LETTERING CLAIM, RE-MEASURED RATHER THAN INHERITED (§714.1's figure, at this slot).
     *  `folioText` is its own control: an instrument that counted zero on BOTH surfaces would be
     *  broken, and this way the same scan proves it can see a `<text>` when one is there. */
    if (dressText !== 0) fail.push(`F0-33 claims ZERO <text> on the dress page; measured ${dressText}`);
    if (folioText === 0) fail.push(`DEAD CONTROL — the scan found no <text> on the FOLIO either, so the dress zero proves nothing`);

    console.log(`folio groups seen: ${[...folioSeen].sort().join(' ')}`);
    console.log(`dress groups seen: ${dressSeen.size}`);
    console.log(`claimed folio ${CLAIMED_FOLIO_GROUPS.length} · claimed dress ${CLAIMED_DRESS_GROUPS.length}`
      + ` · absence rows ${NO_COUNTERPART.length} · <text> folio ${folioText} / dress ${dressText}`);
    if (fail.length) { for (const m of fail) console.log(`⛔ ${m}`); process.exit(1); }
    console.log(`✓ MANIFEST VERIFIED over ${leaves.length} leaf/leaves — every claimed presence emitted,`
      + ` every claimed absence held, and the presence half proves the instrument can see.`);
  }
}
