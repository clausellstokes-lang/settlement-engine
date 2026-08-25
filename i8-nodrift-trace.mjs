/**
 * i8-nodrift-trace.mjs — REG-I0 · INSTRUMENT 8 · THE NO-DRIFT TRACE.
 *
 * L-REG-4 (§574): *"every visual element traces to Watabou, FTG, or the corpus; traceable-to-none
 * is drift needing written justification."* A law with no roster is a slogan, so this instrument
 * does two things:
 *   1. RE-DERIVES the op-class roster from `harness/renderFolio.mjs` at the sealed tip, by
 *      walking its own numbered section headers. The roster is never typed by hand.
 *   2. Checks every class against the COMMITTED TRACE TABLE below. **An untraced class is a
 *      countable miss** — the instrument returns the count, and the count is the exit criterion.
 *
 * ⭐⭐ IT IS A RATCHET, AND THAT IS THE POINT. A later wave that adds a drawing section to
 * renderFolio and does not trace it will see the miss count rise. The failure mode this closes is
 * the one §574 exists for: a novel visual language accumulating one well-meant flourish at a
 * time, with nobody able to name when it stopped looking like its references.
 *
 * ═══ THE ROSTER'S DEFINITION ═══
 *   A section header in renderFolio.mjs matching  `// ── <N> · <TITLE>`  where N is the section
 *   number (`7`, `11a`, `15c`). These are the file's own organisation, authored by the renderer
 *   rather than by this lane, and they partition the draw list exhaustively — every primitive the
 *   folio emits is emitted inside exactly one of them.
 *   ⚠ THE EMITTED `<g id>` GROUPS ARE A DIFFERENT, SMALLER SET AND ARE **NOT** THE ROSTER.
 *   `B.flush(id)` is called with an id exactly TWICE in the whole file (`fields`, `squares`), and
 *   the finished SVG carries ten groups. A trace table built on groups would cover a tenth of the
 *   drawing and read as complete. Both sets are reported; the SECTIONS are the roster.
 *
 * ═══ THE TRACE VALUES ═══
 *   'watabou' | 'ftg' | 'corpus'  — one or more, the references the class descends from
 *   'DRIFT'                       — traceable to NONE. Lawful only with a written justification,
 *                                   which this table carries inline and the report surfaces.
 *
 * Usage: node i8-nodrift-trace.mjs --wt=<worktree> [--json=]
 *        node i8-nodrift-trace.mjs --wt=<worktree> --controls
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';

/**
 * ⭐⭐⭐ THE COMMITTED TRACE TABLE. One row per op class. `why` is the written justification
 * L-REG-4 demands and is REQUIRED on every DRIFT row — a DRIFT row without one is itself a miss.
 * ⚠ THE FOUR DRIFT ROWS ARE THE FINDING OF THIS INSTRUMENT, not an oversight, AND THEY ARE OF
 * TWO KINDS — the distinction is recorded here so the roster does not blur into one bucket:
 *   KIND 1 · THE TRUTH LAYER SURFACING AS INK (4b, 4c, 15b) — exactly the thing no reference can
 *     supply, because the references are fixed pictures of invented places and have no history to
 *     draw. INCURABLE BY LOOKING: no amount of further corpus study produces a plate of a
 *     besieger's camp at *this* town in *this* year.
 *   KIND 2 · UNCITED IN ROLE (14c, the fords) — an ordinary permanent place-fact a period plate
 *     could perfectly well draw, whose marks are all borrowed corpus marks, but for which the
 *     VIEWED register holds no plate. CURABLE BY LOOKING, and dated: §648.1 HELD the glyph and
 *     bound its re-cut to period convention in REG-6, at which point the row flips to a traced
 *     corpus row. A KIND-2 row that outlives its scheduled cure is this instrument's alarm.
 */
export const TRACE = Object.freeze({
  '0': { name: 'PAPER + the aged ground', trace: ['corpus'], why: 'the plate ground itself — the corpus\'s aged paper tone and low-value wash patches' },
  '1': { name: 'THE OPEN FIELDS — strips that tile', trace: ['ftg', 'corpus'], why: 'FTG draws cultivated parcels around a settlement; the corpus supplies the strip-furrow dress' },
  '2': { name: 'TERRACE LINES on the strips', trace: ['corpus'], why: 'terraced hillside plates' },
  '3': { name: 'THE RELIEF PASS', trace: ['watabou', 'corpus'], why: 'Watabou draws relief as marks rather than shading; the corpus supplies hachure grammar' },
  '4': { name: 'TREES', trace: ['watabou', 'ftg'], why: 'both references draw canopy as small repeated marks' },
  '4b': { name: 'THE WALK-SCALE RINGS (§12.3)', trace: ['DRIFT'], why: 'NO reference draws a walking-time ring. It is an immersion device of ours; §12.3 owns it. Lawful under L-REG-4 only with this justification on the record, and it is a NAMED CANDIDATE for the register\'s first subtraction if the judging round finds it reads as an overlay rather than as plate furniture.' },
  '4c': { name: 'THE COUNTRYSIDE EVENT MARKS (§12.5)', trace: ['DRIFT'], why: 'a dated stone or camp ground marking a real event has no analogue in a fixed picture — this is the truth layer becoming ink, and it is the engine\'s differentiator rather than a borrowing. Register-side it must READ as period map furniture; that is the judging question, not whether it traces.' },
  '5': { name: 'THE WATER BODY', trace: ['watabou', 'ftg', 'corpus'], why: 'all three; the corpus supplies bank and current-stroke dress' },
  '6': { name: 'THE URBAN GROUND', trace: ['corpus'], why: '§2.2\'s warm ground the town sits on — a corpus plate convention' },
  '6c': { name: 'THE FILLED-DITCH GARDENS (§250.5)', trace: ['corpus'], why: 'ribbon plots over a filled ditch are a real plate fossil the corpus shows' },
  '7': { name: 'THE STREET WEB — six ranks', trace: ['watabou', 'ftg'], why: 'Watabou\'s street-as-negative-space is the structure; rank hierarchy is FTG\'s legibility grammar' },
  '8': { name: 'SQUARES — holes in the fabric', trace: ['watabou', 'corpus'], why: 'Watabou\'s market hole; corpus plates draw the place as an inked void' },
  // ── REG-4 (wave four · markets) — rows copied VERBATIM from the lane receipt §7.
  '8r': { name: 'THE MARKET AS ONE GIANT STREET — a shared void surface whose outline BREAKS at every street mouth',
    trace: ['watabou', 'ftg', 'corpus'],
    why: 'Watabou and FTG both draw a market as a WIDENING OF THE STREET SURFACE — the same '
      + 'pale ground, no border between the two — so the STRUCTURE (a junction, not a room) '
      + 'is the leads\' own reading grammar. hf259-zoom-market-voids supplies the DRESS: its '
      + 'three named shapes (cigar-widened street, triangular three-road green, carved square '
      + 'with ENTRY GAPS) and, in the third of them, the broken outline itself. §0\'s '
      + 'precedence clause exactly: structure from the leads, dress from the corpus.' },
  '8x': { name: 'THE MARKET-INFILL FOSSILS — hf259\'s encroachment islands, consumed from §18.4',
    trace: ['corpus'],
    why: 'hf259 draws the carved square with ENCROACHMENT ISLANDS EATING IT BACK, and it is '
      + 'the one market element neither lead draws at all — Watabou and FTG have no notion of '
      + 'a square that used to be bigger. The geometry is NOT invented: §18.4 '
      + 'marketColonization already publishes the hardened middle rows on an age × order '
      + 'gate, and this pass re-reads the fabric\'s own dated record with the plate\'s '
      + 'anatomy plus a dashed RETREAT GHOST of the outline the place had before them.' },
  '8f': { name: 'THE V-B13 MARKET FURNITURE — plan glyphs at the ODQ §629.1 band',
    trace: ['corpus'],
    why: 'hf342-zoom-civic-knot is the anchor and states its own projection on its face '
      + '("STRICT TOP-DOWN ORTHOGRAPHIC"): weigh-house great beam in plan, conduit, '
      + 'pillory/stocks, the market cross as a RINGED STEP-CIRCLE. hf320-spec-street-hierarchy '
      + 'supplies the market street\'s stall dashes and the drove road\'s OCTAGONAL pound; '
      + 'hf259 the green\'s pond; hf344 the yew as a specimen crown. ⚠ THE LEADS BOUND THE '
      + 'RESTRAINT rather than the vocabulary — Watabou and FTG draw nearly bare squares, '
      + 'which is why §629.1\'s LOW band edges exist (village 1, town 3) and why the count is '
      + 'rationed at all. hf342\'s own law is the upper bound: "a square without its '
      + 'furniture fails the exit."' },
  '9': { name: 'THE BLOCK GROUND\'S ABSENCE', trace: ['watabou'], why: 'the negative-space law itself — the block is not a filled shape' },
  '10': { name: 'YARDS', trace: ['corpus'], why: 'burgage-plot back ground on town plates' },
  '11': { name: 'THE FABRIC — every building inked', trace: ['watabou', 'ftg', 'corpus'], why: 'all three draw buildings as inked footprints' },
  '11a': { name: 'THE TWO-TIER STROKE + PLOT SERIES', trace: ['corpus'], why: 'measured off corpus plate hf40 at exactly 2:1 — the INK_SCALE ladder\'s origin' },
  '11b': { name: 'COUNTRYSIDE DWELLINGS + THE FAUBOURG', trace: ['ftg', 'corpus'], why: 'FTG\'s outlying steadings; the corpus\'s extramural suburbs' },
  '11r': { name: 'THE FAUBOURG\'S TYPED ORIGIN — gate knot / road ribbon / bridge-head, drawn as district ground',
    trace: ['corpus', 'ftg'],
    why: 'hf311-spec-gate-suburb is the REQUIRED-DETAIL ANCHOR for before-the-gate anatomy and '
      + 'draws the knot as a knot — toll bar, cart queue, courtyard great inns, smithy rank — '
      + 'while hf32-city-growth-rings draws the other case, "ribbon suburbs breaking out along '
      + 'every radial beyond the newest ring". FTG draws extramural building as loose '
      + 'structures on the approach roads and so supplies the STRUCTURE (suburbs belong to '
      + 'roads); the corpus supplies the DISTINCTION between a knot and a ribbon, which is '
      + 'what L-REG-3 asks to be visible. Watabou draws no extramural growth at all — named '
      + 'rather than passed over.' },
  '11c': { name: 'THE ACCESSIBLE LENS\'S HATCH GEOMETRY', trace: ['corpus'], why: 'hand-coloured plates distinguished washes by ruled hatch for a printer with no colour' },
  // ── REG-3 (wave three · the shape code) — rows copied VERBATIM from the lane receipt §7.
  '12r': { name: 'THE PLAN-VIEW ROOF LAW — ridge/hip/cat-slide/cross-gable/lean-to, the SE plane, chimneys',
    trace: ['corpus'],
    why: 'hf208-spec-roof-ticks is the REQUIRED-DETAIL ANCHOR and states the law on its face, '
      + 'including its own "without the hand" (flat silhouettes) vs "with the hand" verdict row; '
      + 'hf34 proves it scales to metropolis; hf378 that roofs never drop out down the density '
      + 'ladder; hf379/hf90/hf3 supply the chimney square. Watabou and FTG both draw buildings as '
      + 'inked footprints with interior marks, so the STRUCTURE (a filled body with a detail line '
      + 'that makes it read as a roof) is the leads\' own reading grammar and the corpus wins only '
      + 'the DRESS — §0\'s precedence clause. ⚠ NO DORMER: the DETAIL REGISTER records that no '
      + 'plan-view dormer convention exists on any viewed anchor, so none is invented.' },
  '12': { name: 'ROOF-RIDGE TICKS', trace: ['corpus'], why: 'the interior detail line that turns a filled quad into a roof on a plate' },
  '13': { name: 'LANDMARKS — §6 archetypes', trace: ['watabou', 'ftg', 'corpus'], why: 'all three give civic buildings a distinct larger form' },
  '13p': { name: 'THE PRECINCT VOIDS — hf323\'s bounded open ground round a monument',
    trace: ['corpus'],
    why: 'hf323-spec-church-ladder draws every rung above the wayside shrine standing inside a '
      + 'bounded precinct, and hf266-zoom-cathedral-close draws the close wall with tan town '
      + 'fabric beyond it. FTG and Watabou give civic buildings a distinct larger form but no '
      + 'forecourt void, so the void is the corpus\'s own addition to their grammar — which is '
      + 'exactly what §571.4\'s third cure asks for (importance from compound footprint + '
      + 'forecourt void, not tone).' },
  // ── REG-5 (wave five · the waterfront) — row authored by CAR-INSTRUMENTS (ODQ §657.2, review
  //    B9) from §636.2's mint and from the citations the shipped §12x block carries at its own
  //    use sites. It was a DROPPED OBLIGATION, not a recorded deferral: neither the REG-5 nor the
  //    REG-BRIDGE receipt mentions this table, which is how two classes reached a seal untraced.
  '12x': { name: 'V-QUAY · THE WATERFRONT DETAIL REGISTER — bollard row / hoist / pier-deck edge / goods stack, drawn in plan on the working apron',
    trace: ['corpus'],
    why: 'THE CLASS EXISTS BECAUSE A MEASUREMENT SAID THE SILHOUETTE COULD NOT CARRY IT. §636.2\'s '
      + 'blind re-round scored 33.3% and the reader\'s own notes name the cause: the one correct '
      + 'call was carried by SITE FURNITURE ("bollard/barrel circles ranged along the shed\'s road '
      + 'face," a hoist blob, a loading way with a turning head), while the two misses read as '
      + 'FARMSTEADS — "a riverside L-range with outbuildings and a track is a farm unless the '
      + 'water\'s edge says QUAY." Footprint-plus-yard-plus-context carried every correct-feeling '
      + 'call; bare silhouette carried none. EVERY MEMBER OF THE CLOSED VOCABULARY IS CITED AT ITS '
      + 'OWN USE SITE, which is what L-REG-4 asks: hf322\'s shore ladder supplies the timber '
      + 'jetty\'s deck edge on its PILE DOTS and the ranged bollards, hf133 the mooring circles, '
      + 'hf122 the treadwheel crane AS A PLAN (wheel, jib, and the dashed swing arc) and the '
      + 'countable cargo (barrels with their stave line). The projection discipline is hf342-class '
      + 'and inherited from row 8f: hf342-zoom-civic-knot states "STRICT TOP-DOWN ORTHOGRAPHIC" on '
      + 'its own face, so the crane is a plan and never an elevation. ⚠ THE LEADS ARE NAMED RATHER '
      + 'THAN PASSED OVER, AND THE DIFFERENCE FROM 8f IS THE POINT: at the market square the leads '
      + 'draw nearly bare squares and so BOUND THE RESTRAINT, but neither Watabou nor FTG draws '
      + 'quay working gear at all — they draw the water\'s edge and the buildings beside it — so '
      + 'the restraint here is NOT a borrowing. It is the chair\'s own §636.2 band, 2–5 fixtures '
      + 'per drawn quay at page register, and it is recorded as a chair mint rather than claimed '
      + 'as a lead\'s grammar. ⚠ SCOPE OF THIS ROW: it traces the VOCABULARY, not the ink\'s '
      + 'distance from the plate. §636.2 required binding to the register\'s waterfront anchors '
      + 'where they exist and reporting THIN where they do not; the §654 review\'s corpus-distance '
      + 'lens measured "ZERO of hf322\'s eleven shore-ladder steps" — but that read the SHARED '
      + '8-ARM EXHIBIT, which per review I1 carried neither --quay nor --vquay, so it is not a '
      + 'verdict on this class and is not offered as one. The reaching-the-plate question is i6\'s '
      + 'and REG-6\'s; this table answers only which reference the marks descend from.' },
  '13b': { name: 'THE VISIBLE WORK (§161b)', trace: ['corpus'], why: 'retaining walls and cuttings are drawn works on terraced plates' },
  '14': { name: 'TERRACES inside the town', trace: ['corpus'], why: 'as 13b, intramural' },
  '14b': { name: 'THE BRIDGES', trace: ['watabou', 'ftg', 'corpus'], why: 'all three; the street continues across the water' },
  // ── REG-BRIDGE (wave six · the crossings) — row authored by CAR-INSTRUMENTS (ODQ §657.2,
  //    review B9) from §637.2's mirror law and §648.1's seal ruling on the glyph.
  '14c': { name: 'REG-BRIDGE · THE FORDS — two dashed margins and a barred bed where a way crosses a broad reach unbuilt',
    trace: ['DRIFT'],
    why: 'THE MARKS TRACE AND THE SUBJECT DOES NOT, AND THIS ROW RECORDS THE SPLIT RATHER THAN '
      + 'RESOLVING IT IN THE CLASS\'S FAVOUR. Every stroke is a borrowed corpus stroke: the dashed '
      + 'margin is the plate idiom this same file already uses for a bound that is CROSSED RATHER '
      + 'THAN BUILT (15c\'s sanctuary/liberty bound, the wall ditch, 8x\'s dashed RETREAT GHOST), '
      + 'and the transverse bed bars are 12x\'s pierDeckEdge pile row (hf322) turned across the '
      + 'way. But NO VIEWED PLATE DRAWS A FORD. That is not taken on the section\'s own word: '
      + 'docs/DESIGN_REGISTER_PROGRAM.md carries ford only in LAW rows (L-REG-31 "fords exempt", '
      + 'L-REG-32 "Fords mirror: wide shallow reaches") and holds no hf-anchor for one. So not one '
      + 'mark here is cited IN ITS ROLE — this is a COMPOSITION of corpus marks onto a subject the '
      + 'register never showed, and at the level L-REG-4 actually asks about (which reference does '
      + 'THIS MARK, IN THIS ROLE, descend from) that is traceable-to-none. Calling it \'corpus\' '
      + 'because its strokes are corpus strokes is exactly how a novel visual language would '
      + 'launder itself past this instrument, one well-meant flourish at a time. WHY IT IS '
      + 'NONETHELESS LAWFUL RATHER THAN A MISS: §648.1 is the chair\'s ruling already on record — '
      + '"FORD GLYPH HELD — the lane\'s own THIN flag confirmed by eye (an unanchored blob-chain); '
      + 'the ARM seals dormant-provable, the GLYPH re-cuts once in REG-6\'s dress pass bound to '
      + 'period convention (road narrows through the water + transverse ripple dashes; no ring, no '
      + 'dot-chain)." The drift is known, dated, convicted by the chair\'s own eye and already '
      + 'scheduled for cure; it is not an accumulation. ⭐ THE ROW IS SELF-RETIRING AND THAT IS THE '
      + 'POINT: when REG-6\'s re-cut lands bound to period convention the row flips to a traced '
      + 'corpus row, and if the re-cut does NOT land the row keeps printing its ⚠ DRIFT line on '
      + 'every run — the ratchet doing the job §574 built it for. ⚠ IT IS A KIND-2 DRIFT, NOT A '
      + 'KIND-1: 4b/4c/15b are the truth layer becoming ink and are INCURABLE BY LOOKING, whereas a '
      + 'ford is an ordinary permanent place-fact a period plate could perfectly well draw — the '
      + 'gap is in OUR VIEWED REGISTER, not in the reference class. The STRUCTURE is not a '
      + 'borrowing either and is named rather than passed over: §637.2\'s mirror law (a bridge '
      + 'takes the narrows, a ford the wide shallow reach) is the engine\'s own siting law and its '
      + 'legibility gift — a reader who sees a solid at a pinch reads BRIDGE, dashes at a broad '
      + 'reach read FORD, with no legend needed. §648.1 banked the identity that makes the class '
      + 'small: all 17 ford records sit at distance 0.00 on the bridges\' own channels, 15 are '
      + 'lawfully exempt as already decked, and 2 actually draw.' },
  '15': { name: 'WALLS — towers, gate breaks, piers', trace: ['watabou', 'corpus'], why: 'Watabou\'s circuit is the loudest stroke; §214 iconography is corpus-sourced' },
  // ── REG-2 (wave two · the wall program) — row authored here from the lane receipt (§1, §3, §5)
  //    and from the citations the shipped §15r block carries at its own use sites.
  '15r': { name: 'THE RAMPART — the circuit drawn as a BAND (outer face · toned walk · inner parapet), its joints, gatehouse anatomy and §614.2 wear',
    trace: ['watabou', 'corpus'],
    why: 'THE STRUCTURE IS ROW 15\'s AND UNCHANGED: Watabou\'s circuit is the loudest stroke on '
      + 'the page and the thing the eye finds first, and the rampart does not move that claim — it '
      + 'answers the narrower question of WHAT that stroke is made of, which Watabou draws as a '
      + 'line and the corpus draws as a work. Every element of the anatomy is corpus-sourced at '
      + 'its own use site: hf261\'s RUNG LADDER (bank and palisade paler than coursed masonry — '
      + 'the `RT.bank`/`RT.walk` tones), hf314\'s BOLD FIGHTING FACE (why the outer edge keeps the '
      + 'heavier weight and the inner parapet the lighter), hf103\'s combed `MURUS SECUNDUS` (the '
      + 'per-tooth merlon comb and its grain), hf313\'s GATEHOUSE PLAN VIGNETTES (portcullis '
      + 'teeth, the drawbridge pit, the passage between the piers), hf315\'s ten genuinely '
      + 'different towers with hf110\'s internal spiral wedge, and — for the §614.2 wear — '
      + 'hf323\'s rule that an unroofed ruin is HATCHED, NOT FILLED, with hf379\'s later ruin '
      + 'rungs and hf123\'s quarried rubble line for the collapsed stretch. ⚠ THE WEAR IS NOT A '
      + 'DRIFT ROW AND THE DISTINCTION IS THE POINT: 15b is DRIFT because a fixed picture cannot '
      + 'express a settlement\'s CURRENT CONDITION at all, whereas every wear MARK here is a '
      + 'ruin-grammar mark the corpus already draws — the truth layer chooses WHICH wall wears '
      + 'them, the corpus supplies the marks themselves, and that is a lawful trace rather than a '
      + 'justified drift. ⭐ The owner\'s "Yes! I like that rampart" (ODQ §598, A3.3) is the '
      + 'RATIFICATION of this dress and the REG-0b specimen is its precedent BESIDE hf261/hf313; '
      + 'an approval is recorded here but is deliberately NOT offered as the trace, because '
      + 'L-REG-4 asks which reference a mark descends from and an approval answers a different '
      + 'question. FTG is passed over rather than claimed: it draws no wall anatomy this row '
      + 'borrows.' },
  '15a': { name: 'THE FOSSILS OF A SUPERSEDED CIRCUIT', trace: ['corpus'], why: 'old wall lines survive as street curves on real historic plates' },
  '15b': { name: 'THE STATE EXPRESSIONS (§10)', trace: ['DRIFT'], why: 'a besieger\'s camp, a barred gate, a lazar house beyond the last of them: these draw a settlement\'s CURRENT CONDITION, which a fixed picture has no way to express. The truth layer again. Justification: it is the §10 catalogue rendered in calm ink at plate weight, deliberately NOT a game overlay — the register test is whether a reader takes it for a surveyor\'s note.' },
  '15c': { name: 'THE SANCTUARY / LIBERTY BOUND (§18.1)', trace: ['corpus'], why: 'precinct and liberty bounds are drawn as dashed lines on period town plates' },
  '16': { name: 'WARD LABELS (now spliced at §173)', trace: ['ftg', 'corpus'], why: 'FTG names its quarters; the corpus supplies curved plate lettering' },
  '17': { name: 'THE FOLIO CHROME — cartouche + compass', trace: ['corpus'], why: 'plate chrome is a corpus convention outright' },
  '18': { name: 'THE IN-WORLD LEGEND (§12.7)', trace: ['corpus'], why: 'period plates carry a legend box teaching their own conventions' },
  '19': { name: 'THE LETTERING SPLICE (§173)', trace: ['corpus', 'ftg'], why: 'plate typography from the corpus; label placement discipline from FTG' },
});

export const REFERENCES = ['watabou', 'ftg', 'corpus'];

/** re-derive the roster from the renderer's own numbered section headers */
export function roster(renderFolioPath) {
  const s = readFileSync(renderFolioPath, 'utf8');
  const secs = [];
  for (const m of s.matchAll(/\/\/ ──+ *(?:⭐*)? *([0-9]+[a-z0-9]*) *· *([^\n]{0,120})/g)) {
    secs.push({ id: m[1], title: m[2].trim(), line: s.slice(0, m.index).split('\n').length });
  }
  const groups = [...new Set([...s.matchAll(/<g id="([a-z0-9]+)"/g)].map((m) => m[1]))];
  const flushes = [...new Set([...s.matchAll(/B\.flush\((["'])([^"']+)\1\)/g)].map((m) => m[2]))];
  return { sections: secs, groups, flushes, bytes: s.length, lines: s.split('\n').length };
}

export function audit(renderFolioPath) {
  const R = roster(renderFolioPath);
  const rows = [];
  for (const sec of R.sections) {
    const t = TRACE[sec.id];
    if (!t) { rows.push({ ...sec, status: 'UNTRACED', trace: null, why: null }); continue; }
    const drift = t.trace.includes('DRIFT');
    const bad = t.trace.filter((x) => x !== 'DRIFT' && !REFERENCES.includes(x));
    rows.push({
      ...sec, tableName: t.name, trace: t.trace, why: t.why,
      status: bad.length ? 'BAD_REFERENCE'
        : (drift ? (t.why && t.why.length > 40 ? 'DRIFT_JUSTIFIED' : 'DRIFT_UNJUSTIFIED') : 'TRACED'),
    });
  }
  const stale = Object.keys(TRACE).filter((k) => !R.sections.some((s) => s.id === k));
  const misses = rows.filter((r) => r.status === 'UNTRACED' || r.status === 'DRIFT_UNJUSTIFIED' || r.status === 'BAD_REFERENCE');
  const byRef = {};
  for (const ref of [...REFERENCES, 'DRIFT']) byRef[ref] = rows.filter((r) => r.trace && r.trace.includes(ref)).length;
  return {
    renderFolio: renderFolioPath, rendererLines: R.lines,
    opClasses: R.sections.length, tableRows: Object.keys(TRACE).length,
    emittedGroups: R.groups, flushIdsInSource: R.flushes,
    traced: rows.filter((r) => r.status === 'TRACED').length,
    driftJustified: rows.filter((r) => r.status === 'DRIFT_JUSTIFIED').length,
    untracedMisses: misses.length, misses: misses.map((m) => ({ id: m.id, title: m.title, status: m.status })),
    staleTableRows: stale,
    byReference: byRef,
    rows,
    pass: misses.length === 0 && stale.length === 0,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const wt = arg('wt', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0/w3f-tree');
  const rf = join(wt, 'harness/renderFolio.mjs');
  const res = audit(rf);
  const json = arg('json', null);

  if (process.argv.includes('--controls')) {
    // ⛔ THE RATCHET CONTROL: plant a section header the table has never seen and confirm the
    // miss count rises by exactly one. A roster walker that cannot see a new class is a walker
    // that will silently bless every future drift.
    const src = readFileSync(rf, 'utf8');
    const planted = `${HERE}/out/.renderFolio-PLANTED.mjs`;
    writeFileSync(planted, `${src}\n  // ── 99z · ⭐ A PLANTED OP CLASS THAT NOBODY TRACED\n`);
    const P = audit(planted);
    // and a STALE control: a table row whose section no longer exists
    const trimmed = `${HERE}/out/.renderFolio-TRIMMED.mjs`;
    writeFileSync(trimmed, src.replace(/\/\/ ──+ *(?:⭐*)? *15c *· /, '// -- removed 15c -- '));
    const S = audit(trimmed);

    process.stdout.write(`BASE      opClasses=${res.opClasses} traced=${res.traced} driftJustified=${res.driftJustified} misses=${res.untracedMisses} stale=${res.staleTableRows.length}\n`);
    process.stdout.write(`PLANTED   opClasses=${P.opClasses} misses=${P.untracedMisses}  ${JSON.stringify(P.misses)}\n`);
    process.stdout.write(`TRIMMED   opClasses=${S.opClasses} stale=${JSON.stringify(S.staleTableRows)}\n`);
    const live = [
      ['the base roster is fully traced', res.untracedMisses === 0],
      ['no stale table rows on the base', res.staleTableRows.length === 0],
      ['a planted op class raises the miss count by exactly one', P.untracedMisses === res.untracedMisses + 1],
      ['a removed section is reported as a STALE table row', S.staleTableRows.length === 1],
      ['every DRIFT row carries a written justification', res.rows.filter((r) => r.trace && r.trace.includes('DRIFT')).every((r) => r.status === 'DRIFT_JUSTIFIED')],
      ['the roster is bigger than the emitted group set (groups are NOT the roster)', res.opClasses > res.emittedGroups.length * 3],
    ];
    process.stdout.write('\n── LIVENESS\n');
    for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    writeFileSync(`${HERE}/out/i8-controls.json`, JSON.stringify({ base: res, planted: P, trimmed: S, liveness: live }, null, 2));
    const controlsLive = live.every((l) => l[1]);
    process.stdout.write(`\nI8_CONTROLS ${controlsLive ? 'LIVE' : 'BROKEN'}\n`);
    // ⛔ C4 (§654 review): the verdict was STDOUT-ONLY and the process exited 0 even on BROKEN,
    // so any `&&`-chained caller read red as green. The exit status is now part of the verdict.
    if (!controlsLive) process.exitCode = 1;
  } else {
    process.stdout.write(`── THE NO-DRIFT TRACE TABLE · ${res.opClasses} op classes over ${res.rendererLines} lines of renderFolio.mjs\n\n`);
    process.stdout.write(`  ${'#'.padEnd(5)} ${'trace'.padEnd(26)} class\n`);
    for (const r of res.rows) {
      process.stdout.write(`  ${r.id.padEnd(5)} ${(r.trace || ['—']).join('+').padEnd(26)} ${r.title.slice(0, 74)}\n`);
      if (r.trace && r.trace.includes('DRIFT')) process.stdout.write(`        ⚠ DRIFT · ${r.why}\n`);
    }
    process.stdout.write(`\n  traced=${res.traced}  driftJustified=${res.driftJustified}  UNTRACED MISSES=${res.untracedMisses}  staleRows=${res.staleTableRows.length}\n`);
    process.stdout.write(`  by reference: ${Object.entries(res.byReference).map(([k, v]) => `${k}=${v}`).join('  ')}\n`);
    process.stdout.write(`  emitted <g id> groups (NOT the roster): ${res.emittedGroups.join(', ')}\n`);
    process.stdout.write(`  B.flush ids in source: ${res.flushIdsInSource.join(', ')}\n`);
    if (json) writeFileSync(json, JSON.stringify(res, null, 2));
    process.stdout.write(`I8_${res.pass ? 'PASS' : 'FAIL'}\n`);
    // ⛔ C4 (§654 review): I8_FAIL used to exit 0. A ratchet whose red is invisible to `&&` is a
    // ratchet that will be chained into a gate and silently believed.
    if (!res.pass) process.exitCode = 1;
  }
}
