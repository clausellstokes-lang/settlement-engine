/**
 * harness/laneWORDS/wordsCensus.mjs — ⭐⭐⭐ ⟦CAR-WORDS⟧ THE WORDS CENSUSES (REG-8).
 *
 * ⭐⭐ EVERY ARM HERE ASSERTS **PLACEMENT**, NOT EXISTENCE, AND THAT IS THE WHOLE DESIGN.
 * §710.6 stated the class in the sharpest terms this programme has produced — *"every census W1
 * wrote asked whether the mark EXISTS. Not one asked whether it is ON THE THING IT MEANS"* — and
 * §711 closed it for the §10 state marks. **It was never closed for TEXT.** Measured at the
 * base: `lettering.js` exports thirteen symbols and **not one is imported by any test**; the
 * only arm that reaches the folio at all asserts `startsWith('<svg')`, a non-zero element count,
 * and that no coordinate inside a `d="…"` is NaN — a scan that does not read `<text>` at all.
 * So a ward name written across the wrong quarter, a caption dropped in silence, and a cartouche
 * printing `RELIEF 1.00` all passed every gate this repo has.
 *
 * ⚠⚠ **WHICH ARMS DISCOVER AND WHICH REGRESS (§711.4's law, applied to this lane's own greens).**
 * An arm that shares its producer's predicate cannot discover anything; saying so is the price
 * of the green. Declared per arm in `ARM_KINDS` at the foot of this file and asserted in the
 * test, so the roster cannot drift from the arms.
 *
 * ⛔ THE INK CLOUD IS AN INSTRUMENT AND IT HAS A CONTROL. `inkCloud` samples the leaf's own
 * drawn geometry into points; a box's ink density is then a real measurement rather than a
 * bounding-box guess (a single batched `<path>` has the page for a bounding box, so a bbox test
 * would convict everything). `plantedProbes()` supplies the live control — a box at the densest
 * point of the drawing and a box on bare countryside must read differently, or the instrument
 * is dead and its zeros mean nothing.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { renderFolio } from '../renderFolio.mjs';
import { scanWords, pointInPolygon, emWidth, metricFor } from '../../src/domain/townMap/fabric/lettering.js';

/**
 * ⛔ THE INSTRUMENT MEASURES WITH THE PRODUCER'S OWN METRIC, and the first spelling of this file
 * did not. It reconstructed box widths as `length × (size × 0.72 + tracking)` — a flat per-char
 * guess — and promptly reported 19 cartouche OVERRUNS that were not overruns: the renderer had
 * fitted the lines correctly with `emWidth`, and the census disagreed because it was using a
 * different ruler. ⭐ That is **the very defect this car exists to cure, reproduced inside the
 * instrument built to cure it** — two spellings of one measurement, each internally consistent.
 * One metric, one home, both sides.
 */
const MX = metricFor(true);

/** The full arm set the corpus is measured under, plus the ⟦CAR-WORDS⟧ render arm. */
export const FABRIC_ARMS = Object.freeze({
  partition: true, frontageFusion: true, rampart: true, shapeCode: true, marketRegister: true,
  minFootprint: true, waterfrontExemption: true, quayRegister: true, riverProfile: true,
  deckLaw: true, fordRegister: true,
});

/* ───────────────────────────── SVG reading ───────────────────────────── */

/** The innerHTML of `<g id="X" …>…</g>`, matched by NESTING rather than by the first `</g>`. */
export function groupOf(svg, id) {
  const open = svg.indexOf(`<g id="${id}"`);
  if (open < 0) return null;
  let depth = 0, j = open;
  for (;;) {
    const a = svg.indexOf('<g', j), b = svg.indexOf('</g>', j);
    if (b < 0) return null;
    if (a >= 0 && a < b) { depth++; j = a + 2; } else { depth--; j = b + 4; if (depth === 0) return svg.slice(open, j); }
  }
}

const TEXT_RE = /<text\b([^>]*)>([^<]*)<\/text>/g;
const ATTR = (s, k) => { const m = s.match(new RegExp(`${k}="([^"]*)"`)); return m ? m[1] : null; };

/** Every `<text>` in a fragment, with its anchor point and content. */
export function textsIn(frag) {
  if (!frag) return [];
  const out = [];
  for (const m of frag.matchAll(TEXT_RE)) {
    const a = m[1];
    out.push({
      x: parseFloat(ATTR(a, 'x')), y: parseFloat(ATTR(a, 'y')),
      cite: ATTR(a, 'data-cite'),
      text: m[2].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'),
    });
  }
  return out;
}

/**
 * Sample every drawn coordinate in the leaf into an ink point cloud, EXCLUDING the lettering
 * group (a label must not count itself as the ink it collides with) and excluding `<text>`.
 * Long segments are subdivided so a straight run is not invisible to the sampler.
 */
export function inkCloud(svg, step = 6) {
  const lettering = svg.indexOf('<g id="lettering">');
  const body = lettering >= 0 ? svg.slice(0, lettering) : svg;
  const pts = [];
  const push = (x, y) => { if (Number.isFinite(x) && Number.isFinite(y)) pts.push([x, y]); };
  // path data: take every coordinate PAIR, and subdivide between consecutive pairs.
  for (const m of body.matchAll(/\sd="([^"]*)"/g)) {
    const nums = m[1].match(/-?\d+(?:\.\d+)?/g);
    if (!nums || nums.length < 2) continue;
    let px = null, py = null;
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = +nums[i], y = +nums[i + 1];
      if (px !== null) {
        const d = Math.hypot(x - px, y - py);
        if (d > step && d < 400) { const n = Math.min(40, Math.floor(d / step));
          for (let k = 1; k < n; k++) push(px + (x - px) * (k / n), py + (y - py) * (k / n)); }
      }
      push(x, y); px = x; py = y;
    }
  }
  for (const m of body.matchAll(/<rect\b([^>]*)>/g)) {
    const a = m[1]; const x = parseFloat(ATTR(a, 'x')), y = parseFloat(ATTR(a, 'y'));
    const w = parseFloat(ATTR(a, 'width')), h = parseFloat(ATTR(a, 'height'));
    if (![x, y, w, h].every(Number.isFinite)) continue;
    for (let i = 0; i <= Math.min(30, Math.ceil(w / step)); i++)
      for (let j = 0; j <= Math.min(30, Math.ceil(h / step)); j++)
        push(x + (w * i) / Math.max(1, Math.ceil(w / step)), y + (h * j) / Math.max(1, Math.ceil(h / step)));
  }
  for (const m of body.matchAll(/<circle\b([^>]*)>/g)) {
    const a = m[1]; push(parseFloat(ATTR(a, 'cx')), parseFloat(ATTR(a, 'cy')));
  }
  return pts;
}

/** How many cloud points fall inside a box. */
export function inkIn(cloud, box) {
  let n = 0;
  for (const p of cloud) if (p[0] >= box.x && p[0] <= box.x + box.w && p[1] >= box.y && p[1] <= box.y + box.h) n++;
  return n;
}

/* ───────────────────────────── the leaf under test ───────────────────────────── */

const CACHE = new Map();

/** Render one leaf armed (or dormant) and return everything the censuses read. */
export function leafWords(key, { words = true, lens = 'parchment' } = {}) {
  const ck = `${key}|${words}|${lens}`;
  if (CACHE.has(ck)) return CACHE.get(ck);
  const spec = CORPUS.find((s) => s.key === key);
  if (!spec) throw new Error(`NO_SUCH_LEAF ${key}`);
  const { fabric } = buildOne(spec, { ...FABRIC_ARMS });
  const r = renderFolio(fabric, { lens, words });
  const svg = r.svg;
  const out = {
    key, fabric, svg, bytes: svg.length, reason: r.lettering,
    primitives: r.primitiveCount, elements: r.elementCount,
    wards: groupOf(svg, 'wardlabels'), notes: groupOf(svg, 'marginalia'),
    captions: groupOf(svg, 'eventcaptions'), edges: groupOf(svg, 'neighbouredges'),
    legend: groupOf(svg, 'legend'),
    marks: fabric.immersion ? fabric.immersion.eventMarks.marks : [],
  };
  CACHE.set(ck, out);
  return out;
}

/* ───────────────────────────── ARM 1 · L-REG-35 · THE EVENT ADDRESS ───────────────────────────── */

/**
 * ⭐⭐⭐ **L-REG-35 AS A PLACEMENT ASSERTION.** The law: *"every dated event label sits at its
 * addressable place (road/gate/seat/wall), never open water or empty field"*.
 *
 * ⚠ THE ADDRESS THIS ARM CAN CHECK IS **THE MARK'S OWN COORDINATE**, and the arm says so rather
 * than implying more. `deriveEventMarks` already places the MARK at its address (extramural,
 * on land, outside every built component — `immersion.js:354`); §711's STATE-BRIDGE closed the
 * mark-placement question for the §10 register on the same principle. What was never asked is
 * whether the **LABEL** went where the mark did. So this arm asserts two things and neither is
 * an existence count:
 *   (a) **TOTALITY** — every mark carries a caption, UNLESS its address is under the chrome, in
 *       which case the failure is the mark's and is pinned rather than tolerated. The base
 *       drops four captions in silence and distinguishes none of them.
 *   (b) **PROXIMITY** — the caption's anchor is within `MAX_ADDRESS_U` of its own mark. A label
 *       that exists but sits across the page from its subject satisfies a count and fails a law.
 * ⛔ The pairing is by `data-cite`, not by index — an index pairing would agree with itself
 * whatever order the two lists came out in, which is the vacuity §710.6 convicted.
 */
export const MAX_ADDRESS_U = 30;

/**
 * ⛔⛔ **THE CHROME BOXES, AND WHY L-REG-35 HAS TWO FAILURE MODES RATHER THAN ONE.**
 *
 * MEASURED on `mf-town-01` (and therefore on `town`, `siege`, `plague` and `famine` — four
 * leaves, ONE site): the mark for `event:155|disaster|The Siege` stands at **(298.4, 958.5)**,
 * which is **INSIDE THE CARTOUCHE'S OWN RECTANGLE** (26,858 → 374,974). All eight ring
 * positions are refused, because the address itself is under the chrome.
 * ⭐ AND THE MARK IS NOT MERELY UNLABELLED — IT IS INVISIBLE. Its glyph is emitted at character
 * index 28,308 and the cartouche's OPAQUE rect at 531,870, so the chrome is painted over it:
 * **a mark that is derived, drawn, counted by every census, and cannot be seen.** That is the
 * `<textPath>` lesson at the head of `lettering.js` from the other end, and it is a DRAWING-ORDER
 * defect in `immersion.deriveEventMarks` — whose `outside()` predicate tests the page bounds, the
 * built radius and the components, and knows nothing about the chrome that will land on top.
 *
 * ⛔ IT IS NOT THIS CAR'S TO CURE, AND THE CHARTER SAYS SO IN TERMS: *"if a label cannot be
 * placed because the fit put its subject off-page, that is a FINDING, not a frame to widen."*
 * The two available cures are moving the MARK (a fabric change that also moves the drawn stone)
 * and moving the CARTOUCHE (framing — the owner's docket, three measured costs already on it).
 * ⭐ SO THE CENSUS SPLITS THE FAILURE INSTEAD OF BLURRING IT, and pins the known set so a NEW
 * one reds:
 *   • **UNADDRESSED** — no label, and the address was placeable. A defect in the PLACER. Zero
 *     tolerated; this is the arm that must always be green.
 *   • **UNADDRESSABLE** — the mark's own address is occupied by chrome. A finding about the
 *     MARK. Pinned to `RULED_DARK_BURIED_MARKS`; a fourth site reds, and so does one of these
 *     four quietly becoming placeable without anyone saying why.
 */
export const CHROME_BOXES = Object.freeze([
  { name: 'cartouche', x: 24, y: 856, w: 352, h: 120 },
  { name: 'compass', x: 882, y: 32, w: 72, h: 88 },
]);

/** The sites whose event mark stands under the chrome — measured, parked, instrumented. */
export const RULED_DARK_BURIED_MARKS = Object.freeze({
  'event:155|disaster|The Siege': ['town', 'siege', 'plague', 'famine'],
});

function underChrome(mk) {
  for (const b of CHROME_BOXES) {
    if (mk.x >= b.x - 30 && mk.x <= b.x + b.w + 30 && mk.y >= b.y - 20 && mk.y <= b.y + b.h + 20) return b.name;
  }
  return null;
}

export function eventAddressCensus(leaf) {
  const caps = textsIn(leaf.captions);
  const byCite = new Map(caps.map((c) => [c.cite, c]));
  const rows = [];
  for (const mk of leaf.marks) {
    const c = byCite.get(mk.cite) || null;
    const d = c ? Math.hypot(c.x - mk.x, c.y - mk.y) : null;
    const chrome = underChrome(mk);
    rows.push({
      cite: mk.cite, kind: mk.kind, mark: [+mk.x.toFixed(1), +mk.y.toFixed(1)],
      placed: !!c, at: c ? [c.x, c.y] : null, distance: d, chrome,
      // ⚠ the two modes are DIFFERENT ROWS, never one blurred fail
      unaddressed: !c && !chrome,
      unaddressable: !c && !!chrome,
      fail: (!c && !chrome) ? 'UNADDRESSED — the address was clear and the placer found no room'
        : (c && d > MAX_ADDRESS_U) ? `OFF-ADDRESS — label ${d.toFixed(1)}u from its mark (max ${MAX_ADDRESS_U})` : null,
      finding: (!c && chrome) ? `UNADDRESSABLE — the mark stands under the ${chrome}, which is also painted over it` : null,
    });
  }
  const orphans = caps.filter((c) => !leaf.marks.some((m) => m.cite === c.cite))
    .map((c) => ({ cite: c.cite, fail: 'ORPHAN — a dated label with no mark to address' }));
  return { leaf: leaf.key, marks: leaf.marks.length, captions: caps.length, rows, orphans,
    unaddressable: rows.filter((r) => r.unaddressable).map((r) => r.cite),
    findings: rows.filter((r) => r.finding).map((r) => `${r.cite}: ${r.finding}`),
    fails: rows.filter((r) => r.fail).map((r) => `${r.cite}: ${r.fail}`).concat(orphans.map((o) => `${o.cite}: ${o.fail}`)) };
}

/* ───────────────────────────── ARM 2 · LABEL OVER FABRIC ───────────────────────────── */

/**
 * ⭐⭐ **THE LABEL-OVER-FABRIC COLLISION CENSUS** — review C3's second clause, *"accessible-lens
 * event labels pile over dense fabric and each other"*.
 *
 * ⛔ THE DEFECT IS STRUCTURAL AND `lettering.js` SAYS SO IN ITS OWN HEADER: *"THE OCCUPANCY
 * MODEL IS A LIST OF RESERVED BOXES, NOT A RASTER. The chrome the draw pass has already placed
 * (cartouche, legend, compass) hands its boxes over."* **The chrome does. THE DRAWING DOES NOT.**
 * Nothing in `reserved` describes the town, so a marginal note pinned at `x = 30` in the left
 * margin knows about the cartouche and knows nothing about the settlement it may be sitting on.
 *
 * ⚠ THIS ARM MEASURES AND RANKS; IT DOES NOT SET A PASS BAR ON DENSITY, and that restraint is
 * deliberate. What counts as "too much ink under a label" is a TASTE call at page scale, and
 * §9's law 1 gives that to the gestalt round and to the owner's glance, not to a lane's
 * threshold. What it DOES assert is the pair of things a census can honestly settle: that
 * **no two placed labels overlap each other** (exact, from the boxes themselves), and that
 * **the instrument is alive** (the planted controls separate). The density figures are
 * REPORTED per leaf for the judging wave that owns the threshold.
 */
export function boxesOf(leaf) {
  const b = [];
  const put = (t, fam, size, tracking, anchor) => {
    // the emitted box, reconstructed at the same metric the splice used
    const w = size * emWidth(t.text, MX) + t.text.length * tracking;
    b.push({ fam, text: t.text, x: anchor === 'middle' ? t.x - w / 2 : anchor === 'end' ? t.x - w : t.x, y: t.y - size, w, h: size + 2 });
  };
  for (const t of textsIn(leaf.notes)) put(t, 'note', 7.6, 0.4, 'start');
  for (const t of textsIn(leaf.captions)) put(t, 'caption', 6.4, 0.3, 'middle');
  for (const t of textsIn(leaf.edges)) put(t, 'edge', 7.2, 0.5, 'middle');
  return b;
}

export function collisionCensus(leaf) {
  const cloud = inkCloud(leaf.svg);
  const boxes = boxesOf(leaf);
  const rows = boxes.map((bx) => ({ fam: bx.fam, text: bx.text.slice(0, 34), ink: inkIn(cloud, bx),
    density: +(inkIn(cloud, bx) / Math.max(1, bx.w * bx.h) * 1000).toFixed(2) }));
  const overlaps = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], c = boxes[j];
      if (!(a.x + a.w <= c.x || c.x + c.w <= a.x || a.y + a.h <= c.y || c.y + c.h <= a.y)) {
        overlaps.push(`${a.fam}"${a.text.slice(0, 20)}" over ${c.fam}"${c.text.slice(0, 20)}"`);
      }
    }
  }
  return { leaf: leaf.key, cloud: cloud.length, boxes: boxes.length, rows, overlaps };
}

/**
 * ⛔ THE LIVE CONTROL. A box on the densest part of the drawing and a box on the emptiest must
 * read differently, or `inkIn` is measuring nothing and every zero above is a dead instrument's
 * zero. Returns `{ dense, bare }` ink counts for the same-sized box.
 */
export function plantedProbes(leaf, size = 60) {
  const cloud = inkCloud(leaf.svg);
  let best = null, bestN = -1, worst = null, worstN = Infinity;
  for (let x = 20; x <= 940 - size; x += 40) {
    for (let y = 20; y <= 940 - size; y += 40) {
      const n = inkIn(cloud, { x, y, w: size, h: size });
      if (n > bestN) { bestN = n; best = { x, y }; }
      if (n < worstN) { worstN = n; worst = { x, y }; }
    }
  }
  return { dense: bestN, denseAt: best, bare: worstN, bareAt: worst, cloud: cloud.length };
}

/* ───────────────────────────── ARM 3 · THE FOLIO LEGEND ───────────────────────────── */

/**
 * ⭐⭐ **THE FOLIO LEGEND CENSUS — AND WHAT IT CANNOT CHECK, STATED PLAINLY.**
 *
 * §692.9 convicted L-REG-34's legend census for *"passing on a BIJECTION, not on legibility — a
 * census whose predicate is weaker than its name"*, and §694.3 made it a standing test: *"a
 * gate's name is a claim, and the claim must be measured against the predicate, not against the
 * intention."* That census lives over the DRESS page's group names. **The FOLIO legend — the
 * box `renderFolio` §18 draws, with its seven conventions and its own drawn swatches — has no
 * census at all.** This is it, and it is deliberately stronger than a bijection in one respect
 * and honestly weaker in another:
 *
 * STRONGER — **every taught row is LOCATABLE**: the convention it names must have a real
 * instance in the fabric's own truth (a ditch row needs a ditched wall; a bridge row needs a
 * bridge), and the legend box must be **inside the page** and **not overlap the cartouche**.
 * That last pair is a PLACEMENT assertion, which the dress census has none of.
 *
 * ⛔ WEAKER, AND SAYING SO IS THE POINT — **IT STILL CANNOT CHECK THAT A READER CAN READ IT.**
 * Legibility at page scale is a rendered-pixel question about stroke weight, contrast and size
 * against a 1000-unit sheet; no census over markup can answer it, and one that claimed to would
 * be the §692.9 defect wearing a new name. §692.9's own example — *"gates drawn but unreadable
 * at page scale"* — is exactly the class that survives this arm. **It belongs to the gestalt
 * round (§4's crops), and it is recorded here as an EXPLICIT non-claim rather than left as an
 * implication of the word "census".**
 */
export function folioLegendCensus(leaf) {
  const f = leaf.fabric;
  const rows = textsIn(leaf.legend).map((t) => t.text);
  const TRUTH = {
    'DITCH AND BANK BEFORE THE WALL': () => f.walls.some((w) => w.ditch),
    'GATEHOUSE — THE ROAD PASSES THROUGH': () => f.walls.some((w) => (w.gates || []).length),
    'WATER GATE, BARRED': () => f.walls.some((w) => (w.waterGates || []).length),
    BRIDGE: () => (f.bridges || []).length > 0,
    'ROOFLESS SHELL — STANDING WALLS, NO ROOF': () => f.parcels.some((p) => p.derelict),
    'HALL, CHURCH OR OTHER GREAT BUILDING': () => f.landmarks.some((l) => l.monumental),
    'COMMON GROUND — GRAZED, NEVER BUILT': () => f.umbrella.greens.length > 0,
  };
  const unlocatable = rows.filter((r) => !TRUTH[r] || !TRUTH[r]());
  const untaught = Object.keys(TRUTH).filter((k) => TRUTH[k]() && !rows.includes(k));
  const box = leaf.legend ? (() => {
    const xs = [...leaf.legend.matchAll(/<text x="([-\d.]+)" y="([-\d.]+)"/g)].map((m) => [+m[1], +m[2]]);
    if (!xs.length) return null;
    return { x0: Math.min(...xs.map((p) => p[0])), y0: Math.min(...xs.map((p) => p[1])),
      x1: Math.max(...xs.map((p) => p[0])), y1: Math.max(...xs.map((p) => p[1])) };
  })() : null;
  // the cartouche's own rectangle, from renderFolio §17: cw 348 × ch 116 at (26, 858)
  const CART = { x: 26, y: 858, w: 348, h: 116 };
  const offPage = box ? (box.x0 < 6 || box.y0 < 6 || box.x1 > 994 || box.y1 > 994) : false;
  const overCartouche = box ? !(box.x1 <= CART.x || CART.x + CART.w <= box.x0
    || box.y1 <= CART.y || CART.y + CART.h <= box.y0) : false;
  return {
    leaf: leaf.key, rows: rows.length, unlocatable, untaught, box, offPage, overCartouche,
    // ⛔ the non-claim, carried in the result so a reader of the JSON meets it too
    cannotCheck: 'legibility at page scale — stroke weight, contrast and size against the sheet; that is the gestalt round\'s (§4), not this arm\'s',
    fails: [
      ...unlocatable.map((r) => `UNLOCATABLE: the legend teaches "${r}" and the fabric has no instance of it`),
      ...(offPage ? ['THE LEGEND BOX LEAVES THE PAGE'] : []),
      ...(overCartouche ? ['THE LEGEND BOX OVERLAPS THE CARTOUCHE'] : []),
    ],
  };
}

/* ───────────────────────────── ARM 4 · THE WORDS THEMSELVES ───────────────────────────── */

/** Every rendered `<text>` on the leaf, with the group it belongs to. */
export function allTexts(leaf) {
  const out = [];
  for (const m of leaf.svg.matchAll(TEXT_RE)) out.push(m[2]);
  return out;
}

/**
 * ⭐⭐⭐ **THE ENUMERATED DENYLIST + THE FORMULA-PATTERN ARM**, over every rendered string.
 * A2.2 chartered both; five waves later neither existed. `scanWords` holds the vocabulary and
 * the three patterns; this walks the page.
 * ⚠ THE SCALE BAR IS EXEMPT BY NAME AND FOR A REASON: §11.12a requires it to print a TRUE count
 * of units, and PENDING-OB-4 puts its unit NAME on the owner's signature. Convicting it would be
 * a lane overruling an owner gate through a census.
 */
export function vocabularyCensus(leaf) {
  const hits = [];
  for (const t of allTexts(leaf)) {
    if (/\bPACES\b/.test(t)) continue;                       // the scale bar — §11.12a / PENDING-OB-4
    if (/^[A-Z' -]+ · \d+$/.test(t)) continue;               // an event caption: NAME · YEAR, a date
    if (/ · \d+ SOULS · /.test(t)) continue;                 // the tier line: a count of people
    if (/IN THE YEAR \d+ OF THIS PLACE/.test(t)) continue;   // a marginal note: a date
    for (const f of scanWords(t)) hits.push({ text: t, ...f });
  }
  return { leaf: leaf.key, hits, fails: hits.map((h) => `"${h.text}" — ${h.kind} ${h.hit}: ${h.why}`) };
}

/**
 * ⭐ **L-REG-29 INTACT.** *"NO generated street/bridge/gate names — the DM's shipped annotation
 * machinery is the naming path, owner-ruled"* (§616.2). The census is the negative: no rendered
 * string may be a TOPONYM for a street, bridge or gate.
 * ⚠ THE PREDICATE IS "A PROPER NAME BOUND TO A WAY", not "the word BRIDGE". The legend teaches
 * `BRIDGE` as a CONVENTION and must go on doing so — a convention name is a type, not a name.
 * What would convict is a possessive or proper-noun form attached to one: `TANNERS ROW`,
 * `THE OLD BRIDGE`, `WATER GATE` used as a place rather than as a class.
 */
export const TOPONYM_SHAPES = Object.freeze([
  /\b[A-Z][A-Za-z]+(?:'S)?\s+(ROW|LANE|STREET|WAY|WYND|GATE|BRIDGE|CROSS|STAIRS|STEPS)\b/,
  /\bTHE\s+(OLD|NEW|GREAT|LITTLE|HIGH|LOW)\s+(BRIDGE|GATE|ROAD|WAY|STREET)\b/,
]);
export function namingVetoCensus(leaf) {
  const LEGEND_CONVENTIONS = new Set(textsIn(leaf.legend).map((t) => t.text));
  const hits = [];
  for (const t of allTexts(leaf)) {
    if (LEGEND_CONVENTIONS.has(t)) continue;               // a taught convention is a class name
    for (const re of TOPONYM_SHAPES) if (re.test(t)) hits.push(t);
  }
  return { leaf: leaf.key, hits, fails: hits.map((t) => `L-REG-29: "${t}" reads as a generated toponym for a way`) };
}

/* ───────────────────────────── ARM 5 · THE WARD LABELS ───────────────────────────── */

/**
 * ⭐⭐ **D5's CONTAINMENT, AS A PLACEMENT ASSERTION** — every glyph of a quarter's name is
 * inside the quarter it names. And **D2's clutter rung**: no name is printed twice on one sheet.
 */
export function wardCensus(leaf) {
  const frag = leaf.wards;
  const groups = frag ? frag.split('<g data-along=').slice(1) : [];
  const cells = leaf.fabric.umbrella.partition
    .map((p) => ({ p, org: leaf.fabric.organisms.find((o) => o.key === p.organismKey) }))
    .filter((r) => r.org && r.org.name);
  const rows = [];
  const seen = new Map();
  for (const g of groups) {
    const gl = [...g.matchAll(/<text x="([-\d.]+)" y="([-\d.]+)"[^>]*>(.)<\/text>/g)]
      .map((m) => ({ x: +m[1], y: +m[2], c: m[3] }));
    if (!gl.length) continue;
    const word = gl.map((q) => q.c).join('');
    // which cell does this label belong to? the one holding the most of its glyphs.
    let owner = null, ownerIn = -1;
    for (const c of cells) {
      const poly = c.p.polygon || [];
      const n = gl.filter((q) => pointInPolygon([q.x, q.y], poly)).length;
      if (n > ownerIn) { ownerIn = n; owner = c; }
    }
    const name = owner ? String(owner.org.name).toUpperCase().replace(/[^A-Z']/g, '') : '?';
    seen.set(word, (seen.get(word) || 0) + 1);
    rows.push({ word, glyphs: gl.length, inside: ownerIn, pct: +(100 * ownerIn / gl.length).toFixed(1),
      owner: name, fail: ownerIn < gl.length ? `${gl.length - ownerIn} of ${gl.length} glyphs of "${word}" fall outside the quarter they name` : null });
  }
  const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([w, n]) => `"${w}" printed ${n}× on one sheet`);
  return { leaf: leaf.key, labels: rows.length, rows, dupes,
    fails: rows.filter((r) => r.fail).map((r) => r.fail).concat(dupes) };
}

/* ───────────────────────────── ARM 6 · THE CARTOUCHE ───────────────────────────── */

/**
 * ⭐⭐⭐ **THE CARTOUCHE CENSUS — AGREEMENT AND PLACEMENT.**
 *
 * (a) **PLACEMENT**: every metadata line's baseline must clear the scale bar's rule, and every
 *     line's MEASURED width — at the renderer's own metric, never a second ruler — must fit
 *     inside the cartouche's own inner rule. §17's cure comment
 *     claims a declared leading already guarantees the first of these; it does not, because a
 *     constant is not a derivation, and ⟦CAR-WORDS⟧'s fourth line walked straight into it.
 * (b) **AGREEMENT**: the reconciliation is never silently dropped. A translated cartouche that
 *     deleted `(RECONCILED)` would read as an observation of a fact that was in truth solved for.
 */
/** The armed arm's reconciliation sentence — one spelling, shared by the writer and the census. */
export const RECONCILED_SENTENCE = 'NO OTHER GROUND FITS THE FACTS OF THIS PLACE';

export const CARTOUCHE = Object.freeze({ x: 26, y: 858, w: 348, h: 116, innerW: 348 - 32, barRule: 858 + 116 - 13 });

/**
 * ⛔⛔ **THE RULED-DARK PIN (§711.8's idiom, and it is not this car's defect to cure).**
 * `substrate.js`'s reconciliation solver returns landform `fjord` at relief **1.00** for three
 * leaves that are not mountain leaves: `town-2` is a DECLARED RIVERSIDE town, `city` and
 * `migration` are DECLARED COASTAL. `CONVENTION_AUDIT_2026-08-25.md:33` recorded the STRING
 * — *"Kitaqiao's legend declares 'FJORD (RECONCILED) · RELIEF 1.00'"* — and nobody asked whether
 * it was TRUE. It is a DERIVATION defect: curing it moves the landform, the relief field and
 * therefore the geometry of three leaves, which is a substrate act and an owner-declared shift.
 * ⭐ SO IT IS PARKED THE WAY AN UNFIXABLE SHOULD BE — named, measured, and instrumented against
 * recurrence: the set is pinned EXACTLY, so a FOURTH leaf reconciling to a fjord reds here, and
 * so does one of these three quietly ceasing to.
 */
export const RULED_DARK_FJORDS = Object.freeze(['town-2', 'city', 'migration']);

export function cartoucheCensus(leaf) {
  const m = leaf.fabric.meta;
  const meta = [...leaf.svg.matchAll(/<text x="(\d+)" y="([\d.]+)" font-family="[^"]*" font-size="([\d.]+)" fill="[^"]*" letter-spacing="0.9" opacity="0.84">([^<]*)<\/text>/g)]
    .map((x) => ({ x: +x[1], y: +x[2], size: +x[3], text: x[4] }));
  const fails = [];
  for (const l of meta) {
    if (l.y > CARTOUCHE.barRule - 8) fails.push(`OVERPRINT: metadata baseline ${l.y} runs into the scale bar's rule at ${CARTOUCHE.barRule} — "${l.text}"`);
    const w = l.size * emWidth(l.text, MX) + l.text.length * 0.9;   // the renderer's own metric
    if (w > CARTOUCHE.innerW * 1.02) fails.push(`OVERRUN: "${l.text}" measures ~${w.toFixed(0)}u inside a ${CARTOUCHE.innerW}u rule`);
  }
  // ⚠ THE TWO SPELLINGS ARE BOTH ACCEPTED ON PURPOSE — the dormant arm says it with an ALL-CAPS
  // parenthetical and the armed arm says it in a sentence. What the census asserts is that the
  // fact is SAID, not which words say it, so this arm is meaningful on BOTH arms.
  const said = leaf.svg.includes(RECONCILED_SENTENCE) || leaf.svg.includes('(RECONCILED)');
  if (m.forcedReconciliation && !said) fails.push('SILENT RECONCILIATION: the landform was solved for and the cartouche does not say so');
  return { leaf: leaf.key, lines: meta.length, meta, reconciled: !!m.forcedReconciliation,
    landform: m.landform, declared: m.declaredTerrain, relief: +m.relief.toFixed(3), fails };
}

/* ───────────────────────────── the roster ───────────────────────────── */

/**
 * ⚠⚠ §711.4's LAW, DISCHARGED IN THE FILE. Two of this lane's arms cannot discover anything
 * because they share a predicate with the code that produces the thing they measure; three can,
 * because their predicate is independent of the producer's.
 */
export const ARM_KINDS = Object.freeze({
  eventAddress: { kind: 'DISCOVERY', why: 'pairs by data-cite against `immersion.eventMarks`, which the splice never consults for placement — it can and did convict the base' },
  collision: { kind: 'DISCOVERY', why: 'the ink cloud is read off the DRAWN page; nothing in the placer knows the cloud exists' },
  folioLegend: { kind: 'DISCOVERY', why: 'the locatability predicate reads `fabric.walls/parcels/landmarks` directly, not the row list the renderer built from them' },
  vocabulary: { kind: 'REGRESSION', why: '⚠ the denylist and `cartoucheLines` were written in the same act by the same hand; the arm pins the translation against re-leak, it does not discover a leak' },
  namingVeto: { kind: 'REGRESSION', why: '⚠ L-REG-29 was already intact — the fabric mints no toponyms at all — so this arm can only hold a door that is already shut' },
  ward: { kind: 'DISCOVERY', why: 'containment is measured against the cell POLYGON; `wardLabelPath` derives from the centroid and the radius and never tests the polygon on the dormant arm' },
  // ⚠ THE HONEST SPLIT, and the roster says it rather than claiming the whole arm discovers.
  // The cartouche arm has three clauses and they are not the same kind:
  //   · the OVERPRINT clause convicted an INTERMEDIATE STATE OF THIS LANE (the fourth metadata
  //     line landing on the scale bar) and is green on both arms at the tip — so at the tip it
  //     is REGRESSION, and calling it discovery would be claiming credit for a green it earns
  //     against nothing;
  //   · the SILENT-RECONCILIATION clause shares `cartoucheLines`' own predicate — REGRESSION;
  //   · only the RULED-DARK FJORD PIN is DISCOVERY, and it discovered a real one.
  cartouche: { kind: 'MIXED', why: 'overprint + silent-reconciliation clauses are REGRESSION (one convicted this lane\'s own intermediate state, the other shares the writer\'s predicate); the RULED_DARK fjord pin is DISCOVERY — it reads `meta.landform` against `meta.declaredTerrain`, which no writer consults, and it convicted three shipped leaves' },
});

export const LEAVES = CORPUS.map((s) => s.key);
