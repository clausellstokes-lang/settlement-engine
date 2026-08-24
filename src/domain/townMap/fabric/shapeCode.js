/**
 * domain/townMap/fabric/shapeCode.js — ⭐⭐⭐ THE SHAPE CODE (REG-3, L-REG-8 as amended by A3).
 *
 * A3.1 states the law this file implements: **a shape family is ANATOMY + INVARIANTS + SLOTS,
 * never a fixed outline.** Pinned invariants are only what makes the class read at a glance;
 * every other feature is a SLOT rolled by the building's own seed, and THE WORLD BIASES THE
 * DICE — prosperity buys the tower and the transept, age accretes asymmetric chapels, parcel
 * and orientation differentiate even equal rolls. Variation is biography, never noise.
 *
 * ⛔⛔ THE DEFECT THIS WAVE EXISTS FOR, MEASURED BEFORE A LINE WAS WRITTEN (REG-3 §1(c)).
 * REG-I0 instrument 4 over 18 sealed leaves: the real anchors BEAT their matched decoys on only
 * **10 of 18** leaves and pass the band on **0 of 18** — `BASE-town REAL 0.5738 vs DECOY 1.0349`.
 * `probeAnchors.mjs` named the two causes, and neither is a tone problem:
 *
 *   1. **RANK NEVER REACHED THE DRAWN BODY.** `archetypeSolids` read `lm.rung` for exactly ONE
 *      archetype (`port`'s pier count). MEASURED: a rung-3 great cathedral drew 219 sq units
 *      while a rung-2 barracks drew 500; at village the four masses the eye is offered were an
 *      alehouse, a cooper, a mill and a maltster, and the biggest MONUMENTAL body on the leaf —
 *      the weekly market — drew 50.6 against the alehouse's 110.5.
 *   2. **A NON-MONUMENTAL INSTITUTION IS DRAWN IN FABRIC TONE**, so the decoy — the same outline
 *      slid onto ordinary fabric, picking up street ground — is legitimately louder.
 *
 * ⭐ hf323-spec-church-ladder IS THE CURE AND IT IS A PROJECTION, NOT A DIAL: *complexity of PLAN
 * carries rank* (shrine dot → one cell in a precinct → cell + tower + churchyard → cruciform with
 * transepts and porch → aisles, apse, cloister, chapter octagon, a close of ancillaries), and a
 * monument is drawn as a WALL-PLAN — thick poché, **white interior when roofed, cross-hatched
 * when unroofed** — against the roof-plan fabric around it. That is the DETAIL REGISTER's
 * monument entry verbatim, and the white interior is exactly the quantity i4 measures.
 *
 * ⚠ WHAT THIS FILE MAY NOT DO. It composes geometry ONLY. It draws nothing (§195.0: a lens draws
 * the polygons it is given), and it mints no type it cannot source from a field the fabric
 * already carries — `probeTyping.mjs` measured the coverage of every one, and `TYPE_EVIDENCE`
 * below records it. **There is no guess-typing anywhere in this module.**
 *
 * ⚠ THE §494 SHAPE IS CONSUMED, NOT FORKED. Members are emitted with the CompoundMember role
 * vocabulary the owner set at ODQ §494 — main building, yard, court, detached outbuilding,
 * garden, well, midden — so DW-2/DW-6's parcel-ring projection lands on this data rather than
 * beside it. B18's EMITTED claims are not read: its producer (DW-2b) runs after this arc, and
 * A2.3 struck it from REG-3's dependencies. Only the contract SHAPE is honoured.
 *
 * PURITY: no Date, no Math.random, no runtime trig (the frozen table only), no localeCompare.
 */

import { cosI, sinI, TRIG_N } from './trigTable.js';
import { rectAt, widestAxis, longestEdge, centroid, absArea } from './fabricGeometry.js';
import { hashUnit } from './fabricRng.js';

/* ═══════════════════════════════════════════════════════════════════════════════════════
   §1 · THE TYPE VOCABULARY, AND THE EVIDENCE FOR EVERY MEMBER
   ═══════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐ THE CLOSED TYPE VOCABULARY. Every drawable body resolves to exactly one member — the
 * REG-3 exit's *"every map-visible class resolves to exactly one family"* — and `typeBody`
 * returns the FIELD each answer came from beside it.
 * @type {ReadonlyArray<string>}
 */
export const BODY_TYPES = Object.freeze([
  'church', 'hall', 'inn', 'warehouse', 'farmstead', 'craft',
  'rowHouse', 'cottage', 'works', 'market', 'quay', 'mark',
]);

/**
 * ⭐⭐ WHY EACH TYPE IS DERIVABLE, WITH THE COVERAGE MEASURED AT THE SEALED TIP
 * (`harness/laneREG3/probeTyping.mjs`, 18 leaves — the denominators are populations, per the
 * REG-I0 lane's one rule). A family may key only on a row that appears here.
 *
 * ⚠ `parcel.rung` IS DELIBERATELY ABSENT: it covers **2.7 %** of parcels (452 of 16,761), and a
 * field present on one building in thirty-seven cannot type a population. `character` covers
 * 100 % and is consumed today by a TINT STEP AND NOTHING ELSE.
 */
export const TYPE_EVIDENCE = Object.freeze({
  church:    { from: 'landmark.archetype ∈ {worship, cloister}', coverage: '100 % of 1,196 landmarks; worship 69, cloister present' },
  hall:      { from: 'landmark.archetype ∈ {hall, cloisterQuad, garrison}', coverage: '100 %; hall 51, garrison 52' },
  inn:       { from: 'landmark.archetype = hospitality · faubourgBuilding.kind = inn', coverage: '100 %; hospitality 114 landmarks, 24 faubourg inns of 138' },
  warehouse: { from: 'landmark.archetype ∈ {warehouse, granary}', coverage: '100 %' },
  quay:      { from: 'landmark.archetype = port', coverage: '100 %' },
  farmstead: { from: 'habitation.kind ∈ {farmstead, grange}', coverage: '100 % of 614 habitations; farmstead 491, grange 13' },
  cottage:   { from: 'habitation.kind ∈ {cottage, shelter} · faubourgBuilding.kind = house', coverage: '100 %; cottage 92, shelter 18, house 114' },
  craft:     { from: 'landmark.archetype = craft · parcel.character = craft', coverage: '100 %; craft 346 landmarks, 818 parcels' },
  works:     { from: 'landmark.archetype ∈ {noxious, kiln, mill, extraction}', coverage: '100 %; noxious 104, extraction 84' },
  market:    { from: 'landmark.archetype ∈ {market, fairground, caravan}', coverage: '100 %; market 194' },
  rowHouse:  { from: 'parcel.character (merchant 9,149 · residential 4,290 · civic 1,332 · criminal 1,016 · craft 818 · religious 189 · arcane 19 · other 21)', coverage: '**100 % of 16,834 parcels**' },
  mark:      { from: 'landmark.archetype ∈ {water, wallwork, arcane, playhouse, waystation}', coverage: '100 %' },
});

/** archetype → family, the first level of the totality table. */
const ARCHETYPE_FAMILY = Object.freeze({
  worship: 'church', cloister: 'church',
  hall: 'hall', cloisterQuad: 'hall', garrison: 'hall',
  hospitality: 'inn',
  warehouse: 'warehouse', granary: 'warehouse',
  port: 'quay',
  craft: 'craft',
  noxious: 'works', kiln: 'works', mill: 'works', extraction: 'works',
  market: 'market', fairground: 'market', caravan: 'market',
  water: 'mark', wallwork: 'mark', arcane: 'mark', playhouse: 'mark', waystation: 'mark',
  ordinary: 'rowHouse',
});

/** habitation/faubourg kind → family. Both populations are ALREADY TYPED (see TYPE_EVIDENCE). */
const KIND_FAMILY = Object.freeze({
  farmstead: 'farmstead', grange: 'farmstead',
  cottage: 'cottage', shelter: 'cottage', house: 'cottage', inn: 'inn',
});

/**
 * ⭐⭐ THE TYPING PASS. Honest by construction: every answer names its own evidence field, and a
 * body whose evidence is missing is typed `rowHouse` with `from: 'default'` and COUNTED, never
 * guessed into a class it cannot support.
 *
 * @param {any} body
 * @param {'landmark'|'habitation'|'faubourg'|'parcel'} kind
 * @returns {{ type:string, from:string }}
 */
export function typeBody(body, kind) {
  if (kind === 'landmark') {
    const a = body && body.archetype;
    const t = ARCHETYPE_FAMILY[a];
    if (t) return { type: t, from: `landmark.archetype=${a}` };
    return { type: 'rowHouse', from: 'default (archetype absent from the table)' };
  }
  if (kind === 'habitation' || kind === 'faubourg') {
    const k = body && body.kind;
    const t = KIND_FAMILY[k];
    if (t) return { type: t, from: `${kind}.kind=${k}` };
    return { type: 'cottage', from: `default (${kind}.kind absent)` };
  }
  // A PARCEL. `character` is 100 %-covered and is the ward's own trade reading.
  const c = body && body.character;
  if (c === 'craft') return { type: 'craft', from: 'parcel.character=craft' };
  if (c) return { type: 'rowHouse', from: `parcel.character=${c}` };
  return { type: 'rowHouse', from: 'default (character absent)' };
}

/* ═══════════════════════════════════════════════════════════════════════════════════════
   §2 · THE SLOT TABLES — ENUMERATED, WITH BANDS AND WORLD-BIAS RULES (REG-3 exit 1)
   ═══════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ THE FAMILY GRAMMAR, AS DATA. This constant IS exit (1): *"every family ships its
 * ENUMERATED SLOT TABLE with bands and world-bias rules, committed as data, not prose."*
 *
 * Each row carries:
 *   `anatomy`     the named parts the family is made of
 *   `invariants`  ⭐ THE PINNED FEATURES — only what makes the class read at a glance (A3.1).
 *                 A convicting mutation strips one of these and the silhouette key must change.
 *   `source`      the R-INST tranche and the corpus plate the anatomy is read off
 *   `slots`       every other feature. `values` is the enumerated band; `bias` is the WORLD
 *                 fact that shifts the roll, stated as the rule not as a number in prose.
 *
 * ⚠ THE BIAS FIELDS NAME REAL FABRIC FACTS AND NOTHING ELSE: `rung` (§161n, 100 % covered),
 * `prosperity` (organism/parcel `wealth`, 100 %), `age` (the settlement's own years),
 * `waterside` (the §161m physical absolute), `tier`. Anything else would be an invented input.
 *
 * ⚠ EVERY WEIGHT BELOW IS A §42/§43 VALUE, UNSOAKED, AND RIDES THE TUNING SIGNATURE (A3.2:
 * *"variation ranges that shape worlds are tuning-signature surfaces"*).
 */
export const FAMILIES = Object.freeze({

  /* ── CHURCH ─────────────────────────────────────────────────────────────────────────
     R-INST-3 family C, `parti: BASILICAN`, rungs CELL_2 → AISLED_1 → AISLED_2 → WOOL →
     METROPOLITAN; family E supplies the churchyard (ENCLOSURE, PREACHING_CROSS, LYCH_WAY,
     GRAVE_MARKERS). hf323 draws the same ladder and states the projection rule. */
  church: Object.freeze({
    anatomy: ['nave', 'chancel', 'tower', 'transept', 'aisle', 'porch', 'chapel', 'churchyard'],
    invariants: Object.freeze([
      'ORIENTED AXIAL NAVE — one long body, its long axis at least 2.2× its width',
      'A PRECINCT VOID — the body stands inside bounded open ground, never in the fabric run',
    ]),
    source: 'R-INST-3 §5(f) BASILICAN · hf323-spec-church-ladder · DETAIL-REGISTER §7',
    slots: Object.freeze({
      towerAt:   { values: ['none', 'west', 'crossing'], bands: 'none below rung 1; west from rung 1; crossing only at rung ≥ 2', bias: 'PROSPERITY BUYS THE TOWER — wealth rank adds up to +0.30 to the roll; rung is the hard gate' },
      transept:  { values: [0, 1, 2], bands: '0 below rung 2; 1–2 at rung ≥ 2', bias: 'PROSPERITY BUYS THE TRANSEPT (A3.1 by name); rung gates it' },
      aisles:    { values: [0, 1, 2], bands: '0 at rung ≤ 1; 0–2 above', bias: 'rung + prosperity; an odd count is the ASYMMETRIC state — one aisle is a site state, R-INST-3 AISLED_1' },
      porch:     { values: ['none', 'south', 'north'], bands: 'any rung ≥ 1', bias: 'seeded; south is the corpus default (hf323 draws the porch south on the parish church)' },
      chapels:   { values: [0, 1, 2, 3], bands: '0 at rung ≤ 1; up to 3 at rung 3', bias: '⭐ AGE ACCRETES ASYMMETRIC CHAPELS (A3.1) — the count rises with foundation age and they are placed on ONE side, which is what accretion looks like' },
      yardForm:  { values: ['none', 'walled', 'hedged'], bands: 'none only where no compound is reserved', bias: 'prosperity picks walled over hedged' },
      graves:    { values: ['none', 'south', 'ring'], bands: 'none at rung 0', bias: 'AGE — an old foundation has a full yard; hf344/hf323 cluster them SOUTH' },
    }),
  }),

  /* ── HALL (civic / collegiate / garrison) ──────────────────────────────────────────
     R-INST-1 family D: *"the civic parti enum needs exactly ONE load-bearing form at town+ —
     STACKED_HALL_OVER_ARCADE — with a tower slot and a vault slot as optional named parts"*,
     an EXTERNAL STAIR required at town, and the prosperity ladder open arcade → closed
     undercroft → courtyard + gatehouse → aisled hall. */
  hall: Object.freeze({
    anatomy: ['hall', 'arcade', 'externalStair', 'tower', 'court', 'wing'],
    invariants: Object.freeze([
      'A BROAD RECTANGULAR HALL — the long axis 1.6–2.4× the short, never a slot',
      'AN ARCADE ALONG ONE LONG SIDE — the open ground floor drawn as the corpus draws it, a row of column dots (hf266, hf323)',
    ]),
    source: 'R-INST-1 §4(d) STACKED_HALL_OVER_ARCADE · hf266-zoom-cathedral-close (column-dot arcades) · hf342',
    slots: Object.freeze({
      arcadeSide: { values: ['front', 'both'], bands: 'front at rung ≤ 1; both at rung ≥ 2', bias: 'rung' },
      bays:       { values: [3, 4, 5, 6, 7], bands: '3–4 at rung 0; 5–7 at rung ≥ 2', bias: 'rung sets the floor, prosperity the top — the bay count IS the plan complexity hf323 makes rank out of' },
      stairAt:    { values: ['none', 'left', 'right'], bands: 'required (never none) at rung ≥ 1 — R-INST-1 makes EXTERNAL_STAIR a required function at town', bias: 'seeded side; the parcel decides which end has room' },
      tower:      { values: ['none', 'end', 'centre'], bands: 'none at rung ≤ 1', bias: 'PROSPERITY BUYS THE TOWER; a garrison reads `centre` (the keep) where a guildhall reads `end` (the belfry)' },
      court:      { values: ['none', 'rear', 'side'], bands: 'none below rung 2', bias: 'rung — the courtyard grade of the prosperity ladder' },
    }),
  }),

  /* ── INN ───────────────────────────────────────────────────────────────────────────
     R-INST-4 §1.2, CONFIRMED: *"the inn is a COURTYARD WITH A WIDE STREET PASSAGE"* — "a cross
     range parallel to the street and a ground-floor passage leading to a narrow court". Parti
     ladder §3(f): HOUSE_WITH_SPARE_CHAMBER → L_PLAN_GATE_AND_BACK_RANGE → COURTYARD_ONE_GALLERY
     → COURTYARD_GALLERY_RING → DOUBLE_COURT. Star Inn measured 60 × 70 ft with a 60 × 22 ft
     street range of four bays, ONE of them the entry (≤ ~15 ft, a quarter of the frontage). */
  inn: Object.freeze({
    anatomy: ['streetRange', 'gatePassage', 'yard', 'backRange', 'sideRange', 'stable'],
    invariants: Object.freeze([
      'A STREET RANGE BROKEN BY A GATE PASSAGE — the passage is a VOID through the range, never a mark on it',
      'AN ENCLOSED YARD BEHIND IT — the court the passage leads to',
    ]),
    source: 'R-INST-4 §1.2/§3(b)(f) (Star, New Inn, King\'s Head; block 60×70 ft, range 60×22 ft, entry ≤ ¼ frontage) · hf341-zoom-inn-yard',
    slots: Object.freeze({
      parti:     { values: ['spareChamber', 'lPlan', 'oneGallery', 'galleryRing', 'doubleCourt'], bands: 'spareChamber at rung 0; lPlan at rung 1; oneGallery/galleryRing at rung ≥ 1 with prosperity; doubleCourt only at rung 2', bias: 'rung gates, prosperity lifts — the measured ladder, not a scale' },
      passageAt: { values: [0, 1, 2, 3], bands: 'the entry BAY index of a 4-bay street range (Star: four bays, one the entry)', bias: 'seeded — this is the slot that makes two inns of the same rung read differently at a glance' },
      yardDepth: { values: ['shallow', 'deep'], bands: 'deep only where the parcel gives the depth', bias: 'PARCEL — the Borough High Street strip is 50 ft of frontage against 120–160 m of yard' },
      stable:    { values: ['none', 'rear', 'side'], bands: 'none at rung 0', bias: 'rung' },
    }),
  }),

  /* ── WAREHOUSE ─────────────────────────────────────────────────────────────────────
     R-INST-2 §18: the Dutch pakhuis, 5–8 m wide × 30 m deep — a LONG DEEP RANGE with its
     narrow gable end to the water, standing in ROWS along the quay. The charter's own words:
     "warehouse = long masses by water". */
  warehouse: Object.freeze({
    anatomy: ['range', 'loft', 'yard', 'crane'],
    invariants: Object.freeze([
      'A LONG DEEP RANGE — depth 3.0–5.0× the width (the pakhuis 5–8 m × 30 m, read as a ratio)',
      'THE NARROW END ADDRESSES THE WATER OR THE STREET — the range runs away from its frontage, never along it',
    ]),
    source: 'R-INST-2 §18 (pakhuis 5–8 × 30 m; Hanse House; the quay arcade) · hf122-quay-basin-zoom · DETAIL-REGISTER §5',
    slots: Object.freeze({
      ranges:  { values: [1, 2, 3], bands: '1 at rung 0; 2–3 above — MORE RANGES, NOT A BIGGER ONE (§161n, applied)', bias: 'rung' },
      ratio:   { values: [3.0, 3.7, 4.4, 5.0], bands: 'the measured pakhuis band', bias: 'seeded within the band; waterside sites take the deeper end' },
      yard:    { values: ['none', 'rear'], bands: 'none at rung 0', bias: 'rung' },
      crane:   { values: [false, true], bands: 'true only where the body is waterside', bias: '⭐ WATERSIDE — the §161m physical absolute; a crane inland would be an invented fact' },
    }),
  }),

  /* ── QUAY ─────────────────────────────────────────────────────────────────────────── */
  quay: Object.freeze({
    anatomy: ['pier', 'shed'],
    invariants: Object.freeze(['A COMB OF PARALLEL PIERS RUNNING INTO THE WATER']),
    source: '§161n (more piers, not bigger ones) · hf322-spec-waterfront-edge · hf133',
    slots: Object.freeze({
      piers: { values: [2, 3, 4, 5], bands: '2 + rung', bias: 'rung — the shipped rule, kept verbatim' },
      shed:  { values: [false, true], bands: 'true at rung ≥ 1', bias: 'rung' },
    }),
  }),

  /* ── FARMSTEAD ─────────────────────────────────────────────────────────────────────
     R-INST-3 §8(f) GLEBE_FARMSTEAD{house 4–12 bays; tithe barn 5–14 bays; outbuildings}; the
     charter's own words: "farmstead = house/barn L + yard". hf206's fold-yard supplies the
     drawn dress (hoofprint marks, troughs). */
  farmstead: Object.freeze({
    anatomy: ['house', 'barn', 'yard', 'outbuilding'],
    invariants: Object.freeze([
      'HOUSE AND BARN AT RIGHT ANGLES — two masses of different proportion meeting at a corner',
      'A YARD IN THE CROOK OF THE L — the open ground the two ranges enclose',
    ]),
    source: 'R-INST-3 §8(f) GLEBE_FARMSTEAD · hf206 fold-yard · hf221-terrain-bocage (dispersed farmsteads in hedged closes)',
    slots: Object.freeze({
      barnLen:   { values: [1.4, 1.8, 2.2, 2.6], bands: 'the barn\'s length as a multiple of the house — 5–14 bays against 4–12', bias: 'seeded; a grange takes the top of the band (it is the estate\'s own barn)' },
      yardSide:  { values: ['left', 'right'], bands: 'which side of the house the barn stands', bias: '⭐ ORIENTATION — the same roll reads differently because the L opens the other way (A3.1\'s "parcel and orientation differentiate equal rolls")' },
      outbuilding: { values: [0, 1, 2], bands: '0–2', bias: 'prosperity; a grange always carries at least one' },
      enclosed:  { values: [false, true], bands: 'true closes the yard with a third short range', bias: 'seeded — the courtyard farm against the open L' },
    }),
  }),

  /* ── CRAFT (the burgage shop-house) ────────────────────────────────────────────────
     R-INST-2 §4: Pantin's typology — the RIGHT-ANGLE range (narrow frontage, long body running
     back) against the PARALLEL hall; shops 6–12 ft wide; the workshop's own yard behind. */
  craft: Object.freeze({
    anatomy: ['frontRange', 'backRange', 'yard', 'kiln'],
    invariants: Object.freeze([
      'A NARROW STREET FRONT WITH A DEEP BODY RUNNING BACK FROM IT (Pantin RIGHT_ANGLE_NARROW)',
    ]),
    source: 'R-INST-2 §4(a)(b)(f) Pantin 1962–3 (shops 6–12 ft; Tackley\'s five shops, hall 33×20 ft behind) · hf120-burgage-frontage-zoom',
    slots: Object.freeze({
      plan:  { values: ['rightAngle', 'parallel', 'doubleRange'], bands: 'rightAngle at any rung; parallel needs ≥ 30 ft of frontage (Pantin\'s own gate); doubleRange at rung ≥ 1', bias: 'the PARCEL\'s frontage decides which are legal; the seed picks among the legal' },
      backRange: { values: [false, true], bands: 'true at rung ≥ 1', bias: 'rung' },
      kiln:  { values: [false, true], bands: 'true only for a works-adjacent trade', bias: 'the archetype — a kiln on a jeweller would be an invented fact' },
    }),
  }),

  /* ── WORKS · MARKET · MARK · COTTAGE · ROWHOUSE ────────────────────────────────────
     These four keep the shipped compositions (they are correct and cheap) and gain only the
     hf208 ROOF PLAN, which is the arm that reaches every ordinary building. Their slot tables
     are recorded so the totality table has no blank row. */
  works: Object.freeze({
    anatomy: ['shed', 'pits'], invariants: Object.freeze(['A SMALL BLOCK WITH ITS WORKING PITS BESIDE IT']),
    source: 'hf264 (tannery discharge, washing slabs) · hf267 (the nuisance belt)',
    slots: Object.freeze({ pits: { values: [2, 3, 4], bands: '2–4', bias: 'rung' } }),
  }),
  market: Object.freeze({
    anatomy: ['stallRows'], invariants: Object.freeze(['ROWS OF SMALL EQUAL RECTANGLES IN A VOID']),
    source: 'hf259-zoom-market-voids · hf342-zoom-civic-knot',
    slots: Object.freeze({ rows: { values: [4, 5, 6], bands: '4 + (variant mod 3) — the shipped rule', bias: 'variant' } }),
  }),
  mark: Object.freeze({
    anatomy: ['glyph'], invariants: Object.freeze(['A SINGLE SMALL FIGURE — the corpus\'s licensed plan glyph']),
    source: 'hf303-legend-masterplate', slots: Object.freeze({}),
  }),
  cottage: Object.freeze({
    anatomy: ['house'], invariants: Object.freeze(['ONE SMALL MASS, FREE IN ITS OWN GROUND']),
    source: 'hf10/hf90 (the thorp house free in its own toft) · hf378 rung 1',
    slots: Object.freeze({ roof: { values: ['gable', 'hip'], bands: 'the hf208 roof plan', bias: 'seeded' } }),
  }),
  rowHouse: Object.freeze({
    anatomy: ['streetRange', 'backHouse', 'toft'],
    invariants: Object.freeze([
      'A CONTINUOUS FRONTAGE SUBDIVIDED BY PARTY LINES — the fused row REG-1 already builds',
    ]),
    source: 'REG-1 frontageFusion (landed) · hf40 (the 2:1 stroke ladder) · hf378 (frontage continuous at village, party-walled at small town)',
    slots: Object.freeze({
      roofForm: { values: ['gable', 'hip', 'catSlide', 'crossGable', 'leanTo'], bands: 'the hf208 ladder; `crossGable` needs a wing, `leanTo` needs a back-house', bias: '⭐ THE BUILDING\'S OWN FACTS: `parcel.gable` (12.0 % of 16,834) forces a gable end, `parcel.wing` (26.6 %) licenses the cross-gable, `parcel.backHouse` (46.7 %) licenses the lean-to. Nothing here is rolled free.' },
      chimney:  { values: [false, true], bands: 'true above the size gate', bias: 'wealth — hf379\'s lived-in stage draws the chimney square; a hovel does not get one' },
    }),
  }),
});

/* ═══════════════════════════════════════════════════════════════════════════════════════
   §3 · THE ROLL — seeded per building, biased by the world
   ═══════════════════════════════════════════════════════════════════════════════════════ */

/** Prosperity as a 0..1 rank over the fabric's OWN 5-value `wealth` domain (100 % covered). */
export const WEALTH_RANK = Object.freeze({ poor: 0, modest: 0.25, comfortable: 0.5, wealthy: 0.75, opulent: 1 });

/**
 * ⭐⭐ THE BIASED ROLL, AND IT IS ONE FUNCTION SO THE BIAS CANNOT BE SPELLED TWICE.
 * `u` is the building's own deterministic unit draw; `lift` is the world's thumb on the scale.
 * The result is clamped into [0,1) so a bias can never push a slot past its own band —
 * ⚠ a bias that could select an out-of-band value would be a dial wearing a derivation's coat.
 *
 * @param {string} key   the building's own slot key (seed | instanceKey | slot)
 * @param {number} lift  the world's shift, in units of the roll
 * @returns {number} in [0,1)
 */
export function roll(key, lift = 0) {
  const u = hashUnit(key) + lift;
  return u <= 0 ? 0 : u >= 1 ? 0.999999 : u;
}

/** Pick from an enumerated band by a biased roll. The band IS the slot table's `values`. */
export function pick(values, key, lift = 0) {
  const r = roll(key, lift);
  const i = Math.floor(r * values.length);
  return values[i >= values.length ? values.length - 1 : i];
}

/**
 * ⭐ THE WORLD'S THUMB, DERIVED — never a literal at a call site.
 * @param {{wealth?:string, rung?:number, age?:number, waterside?:boolean}} ctx
 * @returns {{prosperity:number, rungShare:number, ageShare:number}}
 */
export function worldBias(ctx) {
  // TWO SPELLINGS OF ONE FACT, AND BOTH ARE THE FABRIC'S OWN. A settlement-level roll takes
  // `prosperityRank` (buildFabric's own 0..5 `PROSPERITY_RANK` over the dossier's prosperity
  // string); a parcel-level roll takes `wealth` (the 5-value domain measured at 100 % coverage).
  // ⚠ NEITHER IS A NEW INPUT, and a caller that supplies neither gets the MIDPOINT rather than
  // a favourable default — an absent fact must not buy a tower.
  const pr = ctx && Number.isFinite(ctx.prosperityRank) ? ctx.prosperityRank / 5 : null;
  const w = pr != null ? pr : WEALTH_RANK[ctx && ctx.wealth];
  const prosperity = w == null ? 0.5 : w;
  const rung = ctx && Number.isFinite(ctx.rung) ? ctx.rung : 0;
  // §161n's ladder is 0..3; the share is the position on the LADDER, not a raw count.
  const rungShare = Math.max(0, Math.min(1, rung / 3));
  // AGE: the faith-tenure fact. 240 years is the corpus's own upper reach for a foundation age
  // (§42/§43 VALUE, ARGUED from the sub-century forward-scope law: anything older is "old" and
  // the accretion has saturated). ⚠ UNSOAKED; rides the tuning signature.
  const age = ctx && Number.isFinite(ctx.age) ? ctx.age : 0;
  const ageShare = Math.max(0, Math.min(1, age / 240));
  return { prosperity, rungShare, ageShare };
}

/* ═══════════════════════════════════════════════════════════════════════════════════════
   §4 · THE COMPOSITIONS — slots → §494-shaped typed members
   ═══════════════════════════════════════════════════════════════════════════════════════ */

/**
 * The §494 member roles, verbatim from the owner's ruling: *"a compound with a parcel boundary
 * and typed MEMBERS (main building, yard, court, detached outbuilding, garden, well, midden)"*.
 * `precinct` is the bounded open ground hf323 draws round every rung of the church ladder; it is
 * the FORECOURT VOID the REG-3 row asks for and it is a `court` in §494's vocabulary.
 */
export const MEMBER_ROLES = Object.freeze(['main', 'wing', 'yard', 'court', 'outbuilding', 'garden', 'well', 'midden']);

/**
 * ⭐⭐⭐ COMPOSE ONE INSTITUTION'S BODY FROM ITS FAMILY'S SLOTS.
 *
 * @param {any} lm      a seated landmark: { archetype, x, y, size, rot, variant, rung, instanceKey }
 * @param {{seed:string|number, wealth?:string, age?:number, waterside?:boolean}} ctx
 * @returns {{ family:string, slots:Object, solids:Array, voids:Array, marks:Array, members:Array }}
 */
export function composeInstitution(lm, ctx) {
  const { type: family } = typeBody(lm, 'landmark');
  const s = lm.size, x = lm.x, y = lm.y, a = lm.rot;
  const seed = String((ctx && ctx.seed) || '');
  const k = (slot) => `${seed}|shape|${lm.instanceKey}|${slot}`;
  const bias = worldBias({ wealth: ctx && ctx.wealth, rung: lm.rung, age: ctx && ctx.age });
  const rect = (cx, cy, w, h) => rectAt(cx, cy, w, h, a);
  const off = (dx, dy) => [x + dx * cosI(a) - dy * sinI(a), y + dx * sinI(a) + dy * cosI(a)];
  const put = (arr, role, poly) => { arr.push({ role, polygon: poly }); return poly; };

  const solids = [], voids = [], marks = [], members = [];
  const slots = {};
  // ⛔⛔ THE RUNG A BODY MAY SPEND IS BOUNDED BY THE GROUND IT ACTUALLY RESERVED, AND THE FIRST
  // SPELLING IGNORED THAT. §15.3's law: *"large institutional compounds reserve land BEFORE
  // parcel-cutting; ordinary institutions seat INTO already-cut compatible parcels."* An
  // institution in the second class holds one burgage plot — so a rung-2 cruciform composed for
  // it is not drawn small, it is CLIPPED TO SLIVERS by `enforceGround`, and MEASURED that is
  // exactly what happened: the town's parish church came back as five fragments about five units
  // across, its pale interior entirely swallowed by its own outline, and i4 read the anchor at
  // massMean 119 against a fabric mean of 115 — the wave's own cure reading as no cure at all.
  // ⭐ THE RULE: a compounded institution spends its true rung; an uncompounded one is composed at
  // RUNG 0 — the family's floor form, which is what fits a plot — and takes no precinct at all.
  // The CLASS still reads (a nave and a chancel is still a church); only the ACCRETION waits for
  // ground to stand on.
  // ⚠ `size >= compoundFloor` IS NOT THE TEST, and was the first one tried: the floor decides who
  // may ASK for a compound, and `compoundPass.seated` records who GOT one.
  const compounded = !!(ctx && ctx.compounded && ctx.compounded.has(lm.instanceKey));
  const rung = compounded ? (Number.isFinite(lm.rung) ? lm.rung : 0) : 0;
  slots.compounded = compounded;

  switch (family) {
    case 'church': {
      // INVARIANT 1 · the oriented axial nave. Its 2.2 ratio is the pinned floor.
      // ⭐ THE NAVE LENGTHENS WITH THE RUNG, WHICH IS hf323's LADDER READ OFF THE PLATE: its FIELD
      // CHAPEL is a stubby cell about 2.2 : 1, and the length grows through chapel-of-ease and
      // parish church to the cathedral's long aisled nave. A fixed 2.9 : 1 at every rung drew the
      // floor of the ladder as a strip — and a strip is mostly edge, which the salience
      // instrument reads as pale: town-2's two rung-0 naves came back at massMean 84 and 90
      // against a body fill near 45, the difference being their own antialiased border.
      const naveW = s * 0.70, naveL = s * (1.55 + 0.75 * bias.rungShare);
      const nave = rect(x, y, naveW, naveL);
      solids.push(nave); put(members, 'main', nave);

      // SLOT · towerAt — rung gates, PROSPERITY BUYS IT (A3.1).
      slots.towerAt = rung < 1 ? 'none'
        : pick(rung >= 2 ? ['west', 'west', 'crossing'] : ['none', 'west', 'west'], k('tower'), bias.prosperity * 0.30);
      if (slots.towerAt === 'west') {
        const [tx, ty] = off(0, -naveL * 0.5 - s * 0.28);
        const t = rect(tx, ty, s * 0.60, s * 0.56); solids.push(t); put(members, 'wing', t);
      } else if (slots.towerAt === 'crossing') {
        const t = rect(x, y, s * 0.86, s * 0.86); solids.push(t); put(members, 'wing', t);
      }

      // SLOT · transept — the cruciform arm. Rung ≥ 2 only; prosperity lifts.
      slots.transept = rung < 2 ? 0 : pick([1, 1, 2], k('transept'), bias.prosperity * 0.30);
      for (let i = 0; i < slots.transept; i++) {
        const side = i === 0 ? 1 : -1;
        const [px, py] = off(side * s * 0.62, naveL * 0.10);
        const t = rect(px, py, s * 0.78, s * 0.62); solids.push(t); put(members, 'wing', t);
      }

      // SLOT · aisles — an ODD count is the ASYMMETRIC site state (R-INST-3's AISLED_1).
      slots.aisles = rung < 1 ? 0 : pick(rung >= 2 ? [1, 2, 2] : [0, 1, 1], k('aisle'), bias.prosperity * 0.22);
      for (let i = 0; i < slots.aisles; i++) {
        const side = i === 0 ? 1 : -1;
        const [px, py] = off(side * (naveW * 0.5 + s * 0.15), 0);
        const t = rect(px, py, s * 0.28, naveL * 0.72); solids.push(t); put(members, 'wing', t);
      }

      // SLOT · porch — hf323 draws it SOUTH on the parish church.
      slots.porch = rung < 1 ? 'none' : pick(['none', 'south', 'south', 'north'], k('porch'));
      if (slots.porch !== 'none') {
        const side = slots.porch === 'south' ? 1 : -1;
        const [px, py] = off(side * (naveW * 0.5 + s * 0.16), naveL * 0.22);
        const t = rect(px, py, s * 0.30, s * 0.34); solids.push(t); put(members, 'outbuilding', t);
      }

      // SLOT · chapels — ⭐ AGE ACCRETES THEM, AND ON ONE SIDE. That one-sidedness is the whole
      // point: a chapel bought in 1340 and another in 1390 were bought by families with plots on
      // the same side of the churchyard, so accretion is asymmetric by construction (A3.1).
      slots.chapels = rung < 2 ? 0 : pick([0, 1, 1, 2, 3], k('chapel'), bias.ageShare * 0.35);
      const chapelSide = hashUnit(k('chapelSide')) < 0.5 ? 1 : -1;
      for (let i = 0; i < slots.chapels; i++) {
        const [px, py] = off(chapelSide * (naveW * 0.5 + s * 0.30), -naveL * 0.18 + i * s * 0.44);
        const t = rect(px, py, s * 0.34, s * 0.36); solids.push(t); put(members, 'wing', t);
      }

      // SLOT · chancel — the east end. Always present; its LENGTH carries the rung.
      const [cx2, cy2] = off(0, naveL * 0.5 + s * (0.22 + 0.16 * bias.rungShare));
      const chancel = rect(cx2, cy2, naveW * 0.82, s * (0.44 + 0.32 * bias.rungShare));
      solids.push(chancel); put(members, 'main', chancel);

      // INVARIANT 2 · THE PRECINCT VOID — hf323 draws one at every rung above the shrine.
      //
      // ⛔⛔ AND IT IS BOUNDED BY THE GROUND THE INSTITUTION ACTUALLY RESERVED, WHICH THE FIRST
      // SPELLING WAS NOT. A precinct sized as a free multiple of `size` is geometry no census has
      // ever seen — institutionShapes.js's own header names that class as this family's cardinal
      // defect — and the town crop showed it immediately: pale precincts crossing each other and
      // lying over ordinary fabric that had never been told they were coming.
      // ⭐ THE FABRIC ALREADY HOLDS THE ANSWER: `compoundDiscs` reserves a disc of
      // `COMPOUND_R × size` before the parcels are cut, and nothing is packed inside it. The
      // precinct is therefore the largest box INSCRIBED IN THAT DISC, oriented with the building —
      // exactly the ground a precinct wall would have enclosed, and ground the packer has already
      // agreed to. An institution BELOW the compound floor reserved nothing, so it gets no
      // precinct: a chapel with no ground of its own does not acquire a churchyard by being drawn.
      const hasCompound = compounded;
      slots.yardForm = hasCompound ? pick(['hedged', 'walled', 'walled'], k('yard'), bias.prosperity * 0.25) : 'none';
      let yard = null;
      if (hasCompound) {
        const R = s * (Number.isFinite(ctx.compoundR) ? ctx.compoundR : 1.35);
        // half-diagonal ≤ R, with the long side taking the nave and its chancel.
        const halfL = Math.min(R * 0.92, naveL * 0.5 + s * 0.55);
        const halfW = Math.sqrt(Math.max(0.04, R * R - halfL * halfL));
        yard = rect(x, y, halfW * 2, halfL * 2);
        voids.push(yard); put(members, 'court', yard);
      }

      // SLOT · graves — AGE fills the yard; hf344/hf323 cluster them SOUTH.
      slots.graves = (!yard || rung < 1) ? 'none' : pick(['none', 'south', 'south', 'ring'], k('graves'), bias.ageShare * 0.40);
      if (slots.graves !== 'none') {
        marks.push({ kind: 'graves', poly: yard, side: slots.graves, n: 4 + Math.round(bias.ageShare * 4) });
      }
      marks.push({ kind: 'ridge', solid: solids.indexOf(nave) });
      marks.push({ kind: 'bays', solid: solids.indexOf(nave), n: 4 + Math.round(bias.rungShare * 4) });
      break;
    }

    case 'hall': {
      // INVARIANT 1 · the broad hall.
      slots.bays = pick(rung >= 2 ? [5, 6, 7] : [3, 3, 4], k('bays'), bias.prosperity * 0.25);
      const hallW = s * (1.05 + 0.06 * slots.bays), hallL = s * 1.15;
      const hall = rect(x, y, hallW, hallL);
      solids.push(hall); put(members, 'main', hall);

      // INVARIANT 2 · the arcade along one long side — the OPEN GROUND FLOOR, drawn as the
      // corpus draws an arcade: a row of column dots (hf266, hf323's cathedral nave).
      slots.arcadeSide = rung >= 2 ? pick(['front', 'both'], k('arcade')) : 'front';
      marks.push({ kind: 'arcade', solid: solids.indexOf(hall), n: slots.bays, both: slots.arcadeSide === 'both' });

      // SLOT · the EXTERNAL STAIR — R-INST-1 makes it a REQUIRED function at town.
      slots.stairAt = rung < 1 ? 'none' : pick(['left', 'right'], k('stair'));
      if (slots.stairAt !== 'none') {
        const side = slots.stairAt === 'left' ? -1 : 1;
        const [px, py] = off(side * hallW * 0.42, hallL * 0.5 + s * 0.16);
        const t = rect(px, py, s * 0.34, s * 0.26); solids.push(t); put(members, 'outbuilding', t);
      }

      // SLOT · tower — prosperity buys it; garrison reads `centre` (the keep).
      slots.tower = rung < 2 ? 'none'
        : pick(lm.archetype === 'garrison' ? ['centre', 'centre', 'end'] : ['none', 'end', 'end'], k('tower'), bias.prosperity * 0.28);
      if (slots.tower === 'end') {
        const [px, py] = off(-hallW * 0.5 - s * 0.24, 0);
        const t = rect(px, py, s * 0.50, s * 0.50); solids.push(t); put(members, 'wing', t);
      } else if (slots.tower === 'centre') {
        const t = rect(x, y, s * 0.62, s * 0.62); solids.push(t); put(members, 'wing', t);
      }

      // SLOT · court — the courtyard grade of R-INST-1's prosperity ladder.
      // ⚠ SAME BOUND AS THE CHURCH'S PRECINCT, AND FOR THE SAME REASON: a court is reserved
      // ground or it is an overlay. Below the compound floor the hall has no court.
      const hasCompoundH = compounded;
      slots.court = (rung < 2 || !hasCompoundH) ? 'none' : pick(['none', 'rear', 'side'], k('court'), bias.prosperity * 0.20);
      if (slots.court !== 'none') {
        const [px, py] = slots.court === 'rear' ? off(0, hallL * 0.5 + s * 0.55) : off(hallW * 0.5 + s * 0.55, 0);
        const c = rect(px, py, s * 0.95, s * 0.95);
        voids.push(c); put(members, 'court', c);
      }
      marks.push({ kind: 'ridge', solid: solids.indexOf(hall) });
      break;
    }

    case 'inn': {
      // INVARIANT 1 · THE STREET RANGE BROKEN BY A GATE PASSAGE, and the passage is a VOID.
      // Star Inn measured: block 60 × 70 ft, street range 60 × 22 ft in four bays, ONE the entry.
      slots.parti = rung < 1 ? 'spareChamber'
        : pick(rung >= 2 ? ['oneGallery', 'galleryRing', 'doubleCourt'] : ['lPlan', 'lPlan', 'oneGallery'], k('parti'), bias.prosperity * 0.25);
      const rangeW = s * 1.45, rangeD = s * 0.53;          // 60:22 ft ≈ 2.73:1, held
      if (slots.parti === 'spareChamber') {
        const b = rect(x, y, s * 1.05, s * 0.80); solids.push(b); put(members, 'main', b);
        const [yx, yy] = off(0, s * 0.72);
        const yd = rect(yx, yy, s * 0.95, s * 0.50); voids.push(yd); put(members, 'yard', yd);
        marks.push({ kind: 'ridge', solid: solids.indexOf(b) });
        slots.passageAt = null; slots.stable = 'none'; slots.yardDepth = 'shallow';
        break;
      }
      // The four-bay street range with ONE bay cut out for the passage.
      slots.passageAt = pick([0, 1, 2, 3], k('passage'));
      const bayW = rangeW / 4;
      for (let i = 0; i < 4; i++) {
        if (i === slots.passageAt) continue;               // ⭐ THE PASSAGE IS A GAP, NOT A MARK
        const [px, py] = off((i - 1.5) * bayW, -s * 0.55);
        const b = rect(px, py, bayW * 0.98, rangeD); solids.push(b); put(members, 'main', b);
      }
      {
        const [gx, gy] = off((slots.passageAt - 1.5) * bayW, -s * 0.55);
        marks.push({ kind: 'passage', poly: rect(gx, gy, bayW * 0.98, rangeD) });
      }
      // INVARIANT 2 · the enclosed yard behind.
      slots.yardDepth = pick(['shallow', 'deep'], k('yardDepth'));
      const yardD = s * (slots.yardDepth === 'deep' ? 1.15 : 0.80);
      const [yx, yy] = off(0, -s * 0.55 + rangeD * 0.5 + yardD * 0.5);
      const yd = rect(yx, yy, rangeW * 0.86, yardD);
      voids.push(yd); put(members, 'court', yd);
      // The back range closes the court; the gallery ring adds the sides.
      const [bx, by] = off(0, -s * 0.55 + rangeD * 0.5 + yardD + s * 0.24);
      const back = rect(bx, by, rangeW * 0.86, s * 0.44); solids.push(back); put(members, 'main', back);
      if (slots.parti === 'galleryRing' || slots.parti === 'doubleCourt') {
        for (const side of [-1, 1]) {
          const [sx, sy] = off(side * rangeW * 0.44, -s * 0.55 + rangeD * 0.5 + yardD * 0.5);
          const r2s = rect(sx, sy, s * 0.26, yardD * 0.92); solids.push(r2s); put(members, 'wing', r2s);
        }
      }
      // SLOT · stable — the second court of the DOUBLE_COURT parti.
      slots.stable = rung < 1 ? 'none' : pick(['rear', 'rear', 'side'], k('stable'));
      if (slots.parti === 'doubleCourt') {
        const [sx, sy] = off(0, -s * 0.55 + rangeD * 0.5 + yardD + s * 0.90);
        const c2 = rect(sx, sy, rangeW * 0.70, s * 0.60); voids.push(c2); put(members, 'yard', c2);
      }
      // ⚠ ONE RIDGE PER SURVIVING STREET-RANGE BAY, keyed to the BAY'S OWN SOLID — never one
      // ridge across the whole range, because the range has a gap through it and a mark that
      // spans the gap draws a roof over the passage.
      for (let i = 0; i < solids.length; i++) marks.push({ kind: 'ridge', solid: i });
      break;
    }

    case 'warehouse': {
      // INVARIANT · the long deep range, pakhuis ratio, NARROW END to the frontage.
      slots.ranges = rung < 1 ? 1 : pick([2, 2, 3], k('ranges'), bias.rungShare * 0.25);
      slots.ratio = pick([3.0, 3.7, 4.4, 5.0], k('ratio'), (ctx && ctx.waterside) ? 0.25 : 0);
      const w = s * 0.52, d = w * slots.ratio;
      for (let i = 0; i < slots.ranges; i++) {
        const [px, py] = off((i - (slots.ranges - 1) / 2) * w * 1.30, 0);
        const b = rect(px, py, w, d); solids.push(b); put(members, 'main', b);
        marks.push({ kind: 'ridge', solid: solids.indexOf(b) });
      }
      slots.yard = rung < 1 ? 'none' : 'rear';
      if (slots.yard === 'rear') {
        const [yx, yy] = off(0, d * 0.5 + s * 0.34);
        const yd = rect(yx, yy, w * slots.ranges * 1.3, s * 0.56); voids.push(yd); put(members, 'yard', yd);
      }
      slots.crane = Boolean(ctx && ctx.waterside);
      if (slots.crane) {
        const [wx, wy] = off(w * slots.ranges * 0.72, -d * 0.36);
        marks.push({ kind: 'wheel', x: wx, y: wy, r: s * 0.22 });
      }
      break;
    }

    case 'quay': {
      slots.piers = 2 + rung;
      for (let i = 0; i < slots.piers; i++) {
        const [px, py] = off((i - (slots.piers - 1) / 2) * s * 0.62, 0);
        const b = rect(px, py, s * 0.24, s * 2.2); solids.push(b); put(members, 'main', b);
      }
      slots.shed = rung >= 1;
      if (slots.shed) {
        const [sx, sy] = off(0, -s * 1.35);
        const b = rect(sx, sy, s * 0.9, s * 0.45); solids.push(b); put(members, 'outbuilding', b);
        marks.push({ kind: 'ridge', solid: solids.indexOf(b) });
      }
      break;
    }

    case 'craft': {
      // INVARIANT · a narrow street front with a deep body running back (Pantin RIGHT_ANGLE).
      slots.plan = pick(rung >= 1 ? ['rightAngle', 'rightAngle', 'doubleRange'] : ['rightAngle', 'parallel'], k('plan'));
      const frontW = s * (slots.plan === 'parallel' ? 1.25 : 0.66);
      const frontD = s * (slots.plan === 'parallel' ? 0.62 : 0.55);
      const f = rect(x, y, frontW, frontD); solids.push(f); put(members, 'main', f);
      marks.push({ kind: 'ridge', solid: solids.indexOf(f) });
      slots.backRange = rung >= 1;
      if (slots.backRange) {
        const [px, py] = off(0, frontD * 0.5 + s * 0.52);
        const b = rect(px, py, frontW * 0.80, s * 0.94); solids.push(b); put(members, 'main', b);
        marks.push({ kind: 'ridge', solid: solids.indexOf(b) });
        const [yx, yy] = off(frontW * 0.62, frontD * 0.5 + s * 0.40);
        const yd = rect(yx, yy, s * 0.44, s * 0.72); voids.push(yd); put(members, 'yard', yd);
      }
      slots.kiln = false;
      break;
    }

    case 'works': {
      slots.pits = 2 + Math.min(2, rung);
      const b = rect(x, y, s * 0.95, s * 0.90); solids.push(b); put(members, 'main', b);
      for (let i = 0; i < slots.pits; i++) {
        const [px, py] = off(i % 2 ? s * 0.62 : -s * 0.62, i < 2 ? -s * 0.5 : s * 0.62);
        marks.push({ kind: 'pit', x: px, y: py, r: s * 0.20 });
      }
      if (lm.archetype === 'mill') {
        const [wx, wy] = off(s * 0.78, 0);
        marks.push({ kind: 'wheel', x: wx, y: wy, r: s * 0.42 });
      }
      marks.push({ kind: 'ridge', solid: solids.indexOf(b) });
      break;
    }

    case 'market': {
      slots.rows = 4 + ((lm.variant || 0) % 3);
      for (let i = 0; i < slots.rows; i++) {
        const [px, py] = off((i - (slots.rows - 1) / 2) * s * 0.46, (i % 2 ? s * 0.22 : -s * 0.22));
        const b = rect(px, py, s * 0.32, s * 0.72); solids.push(b); put(members, 'main', b);
      }
      break;
    }

    default: {   // 'mark' and any unmapped archetype: the shipped small figure, unchanged.
      const b = rect(x, y, s * 0.85, s * 0.85); solids.push(b); put(members, 'main', b);
      if (lm.archetype === 'water') { solids.length = 0; members.length = 0; marks.push({ kind: 'well', x, y, r: s * 0.42 }); }
      else if (lm.archetype === 'arcane') marks.push({ kind: 'wheel', x, y, r: s * 0.5 });
      break;
    }
  }
  return { family, slots, solids, voids, marks, members };
}

/**
 * ⭐ THE FARMSTEAD, composed from the habitation record rather than a landmark.
 * @param {{x:number,y:number,size:number,rot:number,kind:string,key:string}} h
 * @param {{seed:string|number, wealth?:string}} ctx
 */
export function composeFarmstead(h, ctx) {
  const s = h.size, x = h.x, y = h.y, a = h.rot;
  const seed = String((ctx && ctx.seed) || '');
  const k = (slot) => `${seed}|shape|${h.key}|${slot}`;
  const bias = worldBias({ wealth: ctx && ctx.wealth });
  const rect = (cx, cy, w, hh) => rectAt(cx, cy, w, hh, a);
  const off = (dx, dy) => [x + dx * cosI(a) - dy * sinI(a), y + dx * sinI(a) + dy * cosI(a)];
  const solids = [], voids = [], marks = [], members = [], slots = {};
  const grange = h.kind === 'grange';

  // INVARIANT 1 · HOUSE AND BARN AT RIGHT ANGLES.
  const houseW = s * 1.55, houseD = s * 0.70;
  const house = rect(x, y, houseW, houseD);
  solids.push(house); members.push({ role: 'main', polygon: house });
  marks.push({ kind: 'ridge', solid: solids.indexOf(house) });

  slots.barnLen = pick(grange ? [2.2, 2.6, 2.6] : [1.4, 1.8, 2.2, 2.6], k('barn'));
  slots.yardSide = pick(['left', 'right'], k('side'));      // ⭐ ORIENTATION differentiates equal rolls
  const side = slots.yardSide === 'left' ? -1 : 1;
  const barnD = s * 0.62 * slots.barnLen, barnW = s * 0.62;
  const [bx, by] = off(side * (houseW * 0.5 - barnW * 0.5), houseD * 0.5 + barnD * 0.5);
  const barn = rect(bx, by, barnW, barnD);
  solids.push(barn); members.push({ role: 'outbuilding', polygon: barn });
  marks.push({ kind: 'ridge', solid: solids.indexOf(barn) });

  // INVARIANT 2 · THE YARD IN THE CROOK OF THE L.
  const [yx, yy] = off(-side * (barnW * 0.5), houseD * 0.5 + barnD * 0.5);
  const yard = rect(yx, yy, houseW - barnW, barnD * 0.92);
  voids.push(yard); members.push({ role: 'yard', polygon: yard });

  slots.outbuilding = grange ? Math.max(1, pick([1, 2], k('out'))) : pick([0, 0, 1, 2], k('out'), bias.prosperity * 0.30);
  for (let i = 0; i < slots.outbuilding; i++) {
    const [px, py] = off(-side * (houseW * 0.5 + s * 0.30), houseD * 0.5 + barnD * (0.28 + 0.45 * i));
    const o = rect(px, py, s * 0.44, s * 0.40);
    solids.push(o); members.push({ role: 'outbuilding', polygon: o });
  }
  slots.enclosed = pick([false, false, true], k('enclosed'), bias.prosperity * 0.25);
  if (slots.enclosed) {
    const [px, py] = off(-side * (barnW * 0.5), houseD * 0.5 + barnD + s * 0.24);
    const c = rect(px, py, houseW - barnW, s * 0.40);
    solids.push(c); members.push({ role: 'outbuilding', polygon: c });
  }
  return { family: 'farmstead', slots, solids, voids, marks, members };
}

/* ═══════════════════════════════════════════════════════════════════════════════════════
   §5 · THE PLAN-VIEW ROOF LAW — hf208-spec-roof-ticks, the REQUIRED-DETAIL ANCHOR
   ═══════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ THE ROOF FORMS, read off hf208 directly (the plate was viewed, not paraphrased):
 *   GABLE       one ridge line down the long axis, OVERSHOOTING the eaves at both ends
 *   HIP         the ridge stops short, with angled hip lines crossing at each corner
 *   CAT_SLIDE   an off-centre ridge over a stepped eaves line
 *   CROSS_GABLE two ridges meeting in a T or a cross
 *   JETTY       a second, lighter DASHED outline outside the ground-floor line
 *   LEAN_TO     a half-width attachment with ONE eaves tick against the parent wall
 * ⚠ NO DORMER. The DETAIL REGISTER's clause 10 is explicit: *"no plan-view dormer convention was
 * observed on any viewed anchor — treat as not-established rather than inventing one"*, and this
 * enum therefore has no member for one. That absence is the law, not an omission.
 */
export const ROOF_FORMS = Object.freeze(['gable', 'hip', 'catSlide', 'crossGable', 'jetty', 'leanTo']);

/**
 * ⭐ THE FORM IS READ OFF THE BUILDING'S OWN FACTS, NOT ROLLED FREE (the A3.1 line: the world
 * biases the dice, and here the building's own record IS the world).
 *   `parcel.gable`  (12.0 % of 16,834) — the plot presents its GABLE END to the street, so the
 *                   ridge runs back from the frontage: that is hf208's gable, forced.
 *   `parcel.wing`   (26.6 %) — a wing is a second range, which is exactly hf208's CROSS-GABLE.
 *   `backHouse`     (46.7 %) — a lower range against the parent wall: the LEAN-TO.
 * The remainder rolls between gable and hip on the building's own key.
 *
 * @param {any} p a parcel-shaped record
 * @param {string} seed
 * @returns {string} a ROOF_FORMS member
 */
export function roofFormFor(p, seed, aspect = 1) {
  if (p.wing) return 'crossGable';
  if (p.gable) return 'gable';
  const u = hashUnit(`${seed}|roof|${p.key}`);
  if (p.backHouse && u < 0.34) return 'leanTo';
  // ⭐ THE ASPECT DECIDES WHETHER A HIP IS EVEN AVAILABLE, AND hf208 SHOWS WHY. Every HIP panel
  // on the plate is a near-square block; every GABLE panel is elongated. A hipped roof on a long
  // narrow range would put four corner crossings on a body whose short axis has no room for
  // them — the plate never draws it, so neither does this. ⚠ §42/§43 VALUE: 2.0 is the ratio at
  // which hf208's own panels change register from square to strip. UNSOAKED.
  if (aspect >= 2.0) return u < 0.80 ? 'gable' : 'catSlide';
  return u < 0.55 ? 'gable' : 'hip';
}

/**
 * ⭐⭐ THE PLAN GEOMETRY OF ONE ROOF. Returns the MARKS a lens draws and the SE PLANE it tints —
 * hf208's clause 4, *"the plane facing SE takes the darker tint, the NW-facing plane the
 * lighter — one value step, not a gradient"* — which is the one NW light the whole plate shares.
 *
 * ⚠ THE OVERSHOOT IS PART OF THE MARK. On hf208 every ridge and hip line runs PAST the eaves
 * outline; a ridge stopped exactly at the edge reads as a fold, not as a roof. `OVERSHOOT` is
 * measured off the plate as roughly a twelfth of the mark's own length.
 *
 * @param {Array<[number,number]>} poly the footprint (the eaves line)
 * @param {string} form a ROOF_FORMS member
 * @param {number} detail 0..2 — how many marks the DRAWN SIZE earns (see `roofDetailFor`)
 * @returns {{ marks:Array<{a:[number,number],b:[number,number]}>, planes:Array<{poly:Array,lit:boolean}> }}
 */
export function roofPlan(poly, form, detail) {
  // ⛔⛔ THE AXIS IS THE LONGEST **EDGE**, NOT `widestAxis`, AND THAT IS THIS FUNCTION'S MOST
  // LOAD-BEARING LINE. `widestAxis` returns the polygon's DIAMETER — for a rectangle, its
  // DIAGONAL — so a ridge drawn along it runs CORNER TO CORNER, which hf208 draws on no panel.
  // ⚠ THE DEFECT IS OLDER THAN THIS WAVE: §12's shipped ridge tick has used `widestAxis` since
  // it landed, and its hard ration is the only reason nobody saw it — a centred segment of 0.30 ×
  // the diameter reads as "a mark" rather than as a ridge at the wrong angle. Drawn at full
  // length the error is unmissable, and the first town crop showed it at once.
  // ⭐ THE CLASS: **a defect can hide inside a ration, and removing the ration is what reveals
  // it.** The legacy §12 path is left byte-for-byte as it was — it is the UNARMED drawing and
  // changing it would void the dormancy proof — so the correction is reported, not back-applied.
  const c = centroid(poly), e = longestEdge(poly);
  const ax = e.dx, ay = e.dy, px = -ay, py = ax;
  const w = { dx: ax, dy: ay };
  // Both half-extents measured ON the polygon, along that edge and across it.
  let half = 0, cross = 0;
  for (const q of poly) {
    const u = Math.abs((q[0] - c[0]) * ax + (q[1] - c[1]) * ay);
    const d = Math.abs((q[0] - c[0]) * px + (q[1] - c[1]) * py);
    if (u > half) half = u;
    if (d > cross) cross = d;
  }
  const OVERSHOOT = 1 / 12;
  const marks = [], planes = [];
  const seg = (ax, ay, bx, by) => marks.push({ a: [ax, ay], b: [bx, by] });
  const ridgeLen = (form === 'hip' ? 0.62 : 1 + OVERSHOOT) * half;

  // THE RIDGE — every form has one, and it is the mark that says "roof".
  const offAxis = form === 'catSlide' ? cross * 0.28 : 0;
  const r0x = c[0] - w.dx * ridgeLen + px * offAxis, r0y = c[1] - w.dy * ridgeLen + py * offAxis;
  const r1x = c[0] + w.dx * ridgeLen + px * offAxis, r1y = c[1] + w.dy * ridgeLen + py * offAxis;
  seg(r0x, r0y, r1x, r1y);

  if (detail >= 1) {
    if (form === 'hip') {
      // four hip lines, ridge-end to corner, each overshooting into hf208's corner cross.
      const k = 1 + OVERSHOOT * 2;
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const ex = c[0] + w.dx * half * k * sx + px * cross * k * sy;
        const ey = c[1] + w.dy * half * k * sx + py * cross * k * sy;
        const bx = sx < 0 ? r0x : r1x, by = sx < 0 ? r0y : r1y;
        seg(bx, by, ex, ey);
      }
    } else if (form === 'crossGable') {
      // the second ridge, across — hf208's T or cross.
      seg(c[0] - px * cross * (1 + OVERSHOOT), c[1] - py * cross * (1 + OVERSHOOT),
        c[0] + px * cross * (1 + OVERSHOOT), c[1] + py * cross * (1 + OVERSHOOT));
    } else if (form === 'leanTo') {
      // ONE eaves tick against the parent wall (hf208's own words for the monopitch).
      seg(c[0] + px * cross, c[1] + py * cross, c[0] + px * cross * 0.55, c[1] + py * cross * 0.55);
    } else if (form === 'catSlide') {
      // the stepped eaves: one tick marking the step in the long plane.
      seg(c[0] + px * cross, c[1] + py * cross, c[0] + px * cross * 0.62 + w.dx * half * 0.3,
        c[1] + py * cross * 0.62 + w.dy * half * 0.3);
    }
  }

  if (detail >= 2) {
    // ⭐ THE SE PLANE. One value step, not a gradient. The plane on the +SE side of the ridge is
    // the darker one; `lit:false` is the lens's instruction to step it down.
    // SE in view space is (+x, +y); the plane whose outward normal points that way is the dark one.
    const seSign = (px + py) >= 0 ? 1 : -1;
    const a1 = [r0x, r0y], a2 = [r1x, r1y];
    const b1 = [c[0] + w.dx * half + px * cross * seSign, c[1] + w.dy * half + py * cross * seSign];
    const b2 = [c[0] - w.dx * half + px * cross * seSign, c[1] - w.dy * half + py * cross * seSign];
    planes.push({ poly: [a1, a2, b1, b2], lit: false });
  }
  return { marks, planes };
}

/**
 * ⭐⭐ HOW MANY MARKS A ROOF EARNS, AND IT IS A FUNCTION OF DRAWN SIZE — never of leftover budget.
 *
 * ⛔ THE LESSON THIS OBEYS IS REG-2's, BY NAME (J-REG2-8): *"a drawing that changes with the
 * budget left over from the rest of the page is not a drawing of a wall."* The same holds for a
 * roof. hf378's density ladder is the plate-sourced rule instead: roofs NEVER drop out, but a
 * building drawn three units wide at city density cannot carry a four-line hip set legibly, and
 * the corpus draws it with its ridge alone. So the grain follows the BUILDING, and the leaf's
 * budget is reported rather than consulted.
 *
 * ⛔⛔ THE FIRST SPELLING GATED ON THE **LONG** AXIS AND THAT WAS THE WHOLE OF ITS FAILURE.
 * MEASURED (`probeRoofBill.mjs`, before any lever was chosen): at town-2 the gate refused **0 of
 * 942** parcels and promoted **752** to full detail, pricing the roof law at 3,390 ops against a
 * 5,400 ceiling already carrying 4,526. The cause is not the budget: **the long axis of a burgage
 * plot is its DEPTH.** A range one frontage wide and two and a half deep measured 2.5 and was
 * handed a four-line hip set, which is precisely the body hf208 draws as a plain GABLE.
 * ⭐ THE CLASS, and it is instrument 6's own R2 lesson wearing a different coat: **a threshold
 * applied to the wrong axis of a shape is not a threshold at all** — the tell is that it refuses
 * nothing on the leaf it exists to ration.
 *
 * ⭐⭐ AND THE SECOND SPELLING WAS A BUDGET IN A DERIVATION'S COAT, SO IT WENT TOO. A gate of
 * "1.15 frontages of breadth" had no authority behind it but the number it produced. The gate now
 * asks the one question the plate can answer: **can the marks be told apart at this leaf's own
 * line weight?** A hipped roof puts eaves · hip · ridge · hip · eaves across the short axis — five
 * separations — so the body must be at least 6 × the detail stroke broad for them to read as marks
 * rather than as a blot. `INK.detail` is the lens's own clamped weight, so the floor moves with the
 * DRAWING instead of with the budget.
 *
 * ⚠⚠ AND THE MEASURED ANSWER IS THAT ALMOST NOTHING IS REFUSED — at town **970 of 1,016** bodies
 * clear a 2.22-unit floor against a median breadth of 6.4 units, and city and metropolis are
 * tighter still. **That is the honest finding and it is reported rather than tuned away: hf208's
 * grain IS legible at every tier in this corpus, so there is no legibility argument for drawing
 * less, and the pass costs what the plate costs.** The §217 consequence is measured and handed to
 * the chair; it is not smuggled into this threshold.
 *
 * ⚠ §42/§43 VALUES: 0.75 frontages of LENGTH is §12's own floor, kept VERBATIM so the superseding
 * pass refuses exactly what the superseded one refused; 6 is the separation count above.
 * ⚠ UNSOAKED; both ride the tuning signature.
 * @param {number} lengthInFrontages the long axis, in plot frontages
 * @param {number} breadthInViewUnits the short axis, in VIEW UNITS
 * @param {number} inkDetail this leaf's detail stroke width, in view units
 * @returns {0|1|2} 0 = no mark · 1 = ridge only · 2 = ridge + form marks + the SE plane
 */
export function roofDetailFor(lengthInFrontages, breadthInViewUnits, inkDetail) {
  if (lengthInFrontages < 0.75) return 0;
  return breadthInViewUnits >= 6 * inkDetail ? 2 : 1;
}

/** The LONG:SHORT ratio of a polygon — the aspect `roofFormFor` gates the hip on. */
export function aspectOf(poly) {
  const c = centroid(poly), e = longestEdge(poly);
  let half = 0;
  for (const q of poly) {
    const u = Math.abs((q[0] - c[0]) * e.dx + (q[1] - c[1]) * e.dy);
    if (u > half) half = u;
  }
  const b = breadthOf(poly);
  return b > 0 ? (half * 2) / b : 1;
}

/** The short axis of a polygon, measured across its longest EDGE.
 *  ⚠ THE SAME AXIS `roofPlan` DRAWS ON, deliberately: a gate measured on one axis and a drawing
 *  made on another are two functions disagreeing about the same body. */
export function breadthOf(poly) {
  const c = centroid(poly), w = longestEdge(poly);
  const px = -w.dy, py = w.dx;
  let cross = 0;
  for (const q of poly) {
    const d = Math.abs((q[0] - c[0]) * px + (q[1] - c[1]) * py);
    if (d > cross) cross = d;
  }
  return cross * 2;
}
