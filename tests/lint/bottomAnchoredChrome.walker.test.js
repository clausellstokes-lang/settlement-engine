/**
 * bottomAnchoredChrome.walker.test.js: THE PINNED FOOTER'S COLLISION CLASS, closed
 * at the source.
 *
 * ── THE CLASS ───────────────────────────────────────────────────────────────────
 * The owner's orders of 2026-09-16 pin the global footer at the viewport bottom on
 * desktop ("the footer should be the same way on every page", the way the header
 * is), with only its links row (THE BAND) floating there until the page is scrolled
 * all the way down. Every fixed layer anchored to the viewport bottom was written for a free
 * bottom edge: at `bottom: 16` or `bottom: 24` it lands ON the footer's links. The
 * owner's own screenshot showed one (the square scroll-to-bottom arrow). The cure
 * is to compose the band's measured height (the inset) into the offset, through
 * `aboveFooter(...)` or `FOOTER_INSET` (src/lib/chromeInsets.js, re-exported by
 * components/theme.js). The inset is 0px on phones, so the mobile offsets are
 * unchanged by construction.
 *
 * A layer added next month would not know any of that. This walker makes it know.
 *
 * ── THE WALK ───────────────────────────────────────────────────────────────────
 * Every `.js`/`.jsx` under src/ is parsed with espree (ZERO parse failures, asserted,
 * so a file that stops parsing reds instead of quietly leaving the denominator).
 * A SITE is an object literal whose `position` is the literal 'fixed' and which
 * names a `bottom` key. Each site is LIFTED when its bottom value's source text
 * composes `aboveFooter(` or `FOOTER_INSET`, and UNLIFTED otherwise.
 *
 * ── THE THREE FROZEN SETS, EXACT IN BOTH DIRECTIONS ────────────────────────────
 *   LIFTED   file -> count of lifted sites.
 *   EXEMPT   file -> count of unlifted sites, each file with a written reason.
 *   OPAQUE   fixed literals whose bottom may arrive through a spread (no top,
 *            bottom or inset key, but a `...spread`), which the walk cannot read.
 * A new bottom-anchored layer anywhere reds until it is lifted or exempted by name;
 * a removed or cured one also reds, so a stale row cannot linger as spare budget.
 *
 * ── KNOWN EDGES (accepted, stated) ─────────────────────────────────────────────
 *   - CSS-declared fixed layers are not walked (src/index.css and src/styles/*.css).
 *     Today the only bottom-anchored one is the Surveyor door's MOBILE sheet
 *     (.sf-door-panel--sheet, bottom: 0), where the inset is 0px anyway.
 *   - A `bottom` supplied only through a spread is invisible; that is what OPAQUE
 *     freezes, and the one entry is the unused Toast primitive.
 *   - A non-literal position that can evaluate to 'fixed' is asserted absent.
 *
 * ── THE BOTTOM BAR FROM 640 TO 1023 PX (owner orders 2026-09-16, the painted arrow) ─
 * The header became the owner's arrow painting, whose painted words only show from
 * 1024 px, so the fixed bottom bar now also holds the viewport's bottom edge from 640 to
 * 1023 px, where the footer lies in the flow (its inset is 0px). Every LIFTED site's
 * desktop branch therefore also clears the bar through aboveBottomNav() or BOTTOM_NAV_H
 * (0px from 1024 up), and phones keep their own bottomClearance() offsets. A lifted site
 * that composes neither reds as the same collision, one breakpoint down.
 *
 * ── ALSO PINNED ────────────────────────────────────────────────────────────────
 * The viewport-sized boxes that would otherwise run under the footer subtract
 * FOOTER_INSET (and the bar): the desktop Realm shell, the desktop Entity Inspector, and
 * the two lifted Surveyor panels whose maxHeight keeps their top where it was.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'espree';
import { describe, expect, test } from 'vitest';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

const LIFT_RE = /\baboveFooter\(|\bFOOTER_INSET\b/;
/** The bottom bar's lift (640 to 1023 px) in a lifted site's desktop branch. */
const BAR_RE = /\baboveBottomNav\(|\bBOTTOM_NAV_H\b/;

/** Lifted sites per file (they compose aboveFooter or FOOTER_INSET). */
const LIFTED = Object.freeze({
  // the scroll-button stack (the owner's square arrow), the dossier-claim toast, the onboarding nudge
  'src/App.jsx': 3,
  'src/components/AiAnalystPanel.jsx': 1,
  'src/components/FeedbackWidget.jsx': 1,
  'src/components/InterviewPanel.jsx': 1,
  // ⛔ src/components/PostGenCoach.jsx IS DELIBERATELY ABSENT (REVIEW-P F5, ODQ §934.63).
  // It held one lifted site until the post-generate coach stopped being viewport chrome:
  // the card now docks in the page's own flow at every width, because a fixed bottom-right
  // box covered 244 px of the dossier's reading column at 1440x900 and its whole 340 px
  // width at 1024. The row is struck rather than left as spare budget, so re-introducing a
  // fixed bottom-anchored site in that file reds here, which is the point of the register.
  'src/components/map/WorldMapOverlays.jsx': 1,
  'src/components/pricing/PricingMomentCard.jsx': 1,
  'src/components/surveyor/SurveyorWorkshop.jsx': 1,
});

/** Unlifted sites per file, each deliberately left where it is. */
const EXEMPT = Object.freeze({
  'src/App.jsx': {
    count: 1,
    reason: 'the bottom nav (rendered below 1024px, where the painted arrow is compact), which is the pinned bottom bar there; the footer is not pinned below 1024px',
  },
  'src/components/StaleDeployNotice.jsx': {
    count: 1,
    reason: 'an interrupting alert (z 1000) that must win the bottom edge over the footer while a stale deploy needs a reload',
  },
  'src/components/dossier/SimulationDrawer.jsx': {
    count: 1,
    reason: 'a full-height drawer (top 0 to bottom 0) over its own scrim (z 90/100); a modal layer covers the footer by design',
  },
  'src/components/founders/ChairDrawer.jsx': {
    count: 1,
    reason: 'a full-height drawer (top 0 to bottom 0, z 1000) over its own scrim; a modal layer covers the footer by design',
  },
  'src/components/dev/DevFlagPanel.jsx': {
    count: 1,
    reason: 'DEV-build only (App.jsx gates it on import.meta.env.DEV); never ships to production',
  },
  'src/components/dev/DevEmailBanner.jsx': {
    count: 1,
    reason: 'DEV-build only (App.jsx gates it on import.meta.env.DEV); never ships to production',
  },
});

/** Fixed literals whose bottom may arrive through a spread the walk cannot read. */
const OPAQUE = Object.freeze({
  'src/components/primitives/Toast.jsx': {
    count: 1,
    reason: 'the Toast primitive takes { top | bottom } through its `vertical` spread and no production surface mounts it; compose aboveFooter when one adopts it',
  },
});

function* walkSources(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkSources(p);
    else if (/\.(js|jsx)$/.test(name)) yield p;
  }
}

/** @param {any} prop */
function keyName(prop) {
  if (prop.type !== 'Property' || prop.computed) return null;
  if (prop.key.type === 'Identifier') return prop.key.name;
  if (prop.key.type === 'Literal') return String(prop.key.value);
  return null;
}

/** Depth-first over every node (comments are not nodes). */
function visit(node, cb) {
  if (!node || typeof node.type !== 'string') return;
  cb(node);
  for (const key of Object.keys(node)) {
    const value = node[key];
    if (Array.isArray(value)) {
      for (const child of value) if (child && typeof child.type === 'string') visit(child, cb);
    } else if (value && typeof value.type === 'string') {
      visit(value, cb);
    }
  }
}

/**
 * Census one source text.
 * @returns {{ sites: { line: number, bottom: string, lifted: boolean }[], opaque: number[], dynamicFixed: number[] }}
 */
function censusSource(source) {
  const ast = parse(source, {
    ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true }, range: true, loc: true,
  });
  const sites = [];
  const opaque = [];
  const dynamicFixed = [];
  visit(ast, (node) => {
    if (node.type !== 'ObjectExpression') return;
    const props = node.properties;
    const position = props.find((p) => keyName(p) === 'position');
    if (!position) return;
    const value = position.value;
    if (value.type !== 'Literal') {
      if (/['"`]fixed['"`]/.test(source.slice(value.range[0], value.range[1]))) dynamicFixed.push(node.loc.start.line);
      return;
    }
    if (value.value !== 'fixed') return;
    const bottom = props.find((p) => keyName(p) === 'bottom');
    if (bottom) {
      const text = source.slice(bottom.value.range[0], bottom.value.range[1]);
      sites.push({ line: node.loc.start.line, bottom: text, lifted: LIFT_RE.test(text), clearsBar: BAR_RE.test(text) });
      return;
    }
    const namesAnEdge = props.some((p) => ['top', 'inset'].includes(keyName(p)));
    if (!namesAnEdge && props.some((p) => p.type === 'SpreadElement')) opaque.push(node.loc.start.line);
  });
  return { sites, opaque, dynamicFixed };
}

function censusTree() {
  const lifted = {};
  const unlifted = {};
  const opaque = {};
  const dynamicFixed = [];
  const parseFailures = [];
  const unliftedDetail = [];
  const barless = [];
  let files = 0;
  for (const file of walkSources(SRC)) {
    files += 1;
    const rel = relative(ROOT, file).split('\\').join('/');
    let result;
    try {
      result = censusSource(readFileSync(file, 'utf8'));
    } catch (err) {
      parseFailures.push(`${rel}: ${err.message}`);
      continue;
    }
    for (const site of result.sites) {
      const bucket = site.lifted ? lifted : unlifted;
      bucket[rel] = (bucket[rel] || 0) + 1;
      if (!site.lifted) unliftedDetail.push(`${rel}:${site.line} bottom=${site.bottom}`);
      if (site.lifted && !site.clearsBar) barless.push(`${rel}:${site.line} bottom=${site.bottom}`);
    }
    if (result.opaque.length) opaque[rel] = result.opaque.length;
    for (const line of result.dynamicFixed) dynamicFixed.push(`${rel}:${line}`);
  }
  return { files, lifted, unlifted, opaque, dynamicFixed, parseFailures, unliftedDetail, barless };
}

const counts = (table) => Object.fromEntries(Object.entries(table).map(([k, v]) => [k, typeof v === 'number' ? v : v.count]));
const sorted = (obj) => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

describe('the detector sees what it claims to (mutant arms)', () => {
  test('an un-lifted fixed bottom layer is a site, and not lifted', () => {
    const { sites } = censusSource("const s = { position: 'fixed', bottom: 16, zIndex: 900 };");
    expect(sites).toEqual([{ line: 1, bottom: '16', lifted: false, clearsBar: false }]);
  });

  test('aboveFooter and FOOTER_INSET both lift, including inside JSX style props', () => {
    const src = [
      "export const A = () => <div style={{ position: 'fixed', bottom: aboveFooter(isMobile ? 92 : SP.xxl) }} />;",
      'const b = { position: \'fixed\', bottom: `calc(20px + ${FOOTER_INSET})` };',
    ].join('\n');
    const { sites } = censusSource(src);
    expect(sites.map((s) => s.lifted)).toEqual([true, true]);
  });

  test('the bar lift is seen through aboveBottomNav or BOTTOM_NAV_H, and a footer-only lift is not a bar lift', () => {
    const src = [
      "const a = { position: 'fixed', bottom: aboveFooter(isMobile ? bottomClearance(70) : aboveBottomNav(24)) };",
      'const b = { position: \'fixed\', bottom: `calc(20px + ${BOTTOM_NAV_H} + ${FOOTER_INSET})` };',
      "const c = { position: 'fixed', bottom: aboveFooter(24) };",
    ].join('\n');
    expect(censusSource(src).sites.map((s) => [s.lifted, s.clearsBar])).toEqual([[true, true], [true, true], [true, false]]);
  });

  test('non-fixed positions and top-anchored fixed layers are not sites', () => {
    const src = "const a = { position: 'absolute', bottom: 0 }; const b = { position: 'fixed', top: 24 };";
    const { sites, opaque } = censusSource(src);
    expect(sites).toEqual([]);
    expect(opaque).toEqual([]);
  });

  test('a spread-borne edge is OPAQUE, and a computed fixed position is caught', () => {
    const src = "const a = { position: 'fixed', ...vertical }; const b = { position: on ? 'fixed' : 'static', bottom: 0 };";
    const { opaque, dynamicFixed } = censusSource(src);
    expect(opaque).toEqual([1]);
    expect(dynamicFixed).toEqual([1]);
  });
});

describe('every bottom-anchored fixed layer clears the pinned footer, or is exempt by name', () => {
  const tree = censusTree();

  test('the walk is not vacuous: the whole src tree parsed and sites were found', () => {
    expect(tree.parseFailures).toEqual([]);
    expect(tree.files).toBeGreaterThan(1000);
    expect(Object.keys(tree.lifted).length).toBeGreaterThan(0);
  });

  test('LIFTED is exact: a new lifted layer or a lost lift both red', () => {
    expect(sorted(tree.lifted)).toEqual(sorted(counts(LIFTED)));
  });

  test('EXEMPT is exact: an un-lifted layer not named here is the collision the order forbids', () => {
    expect(sorted(tree.unlifted), `un-lifted sites found:\n${tree.unliftedDetail.join('\n')}`).toEqual(sorted(counts(EXEMPT)));
    for (const [file, row] of Object.entries(EXEMPT)) {
      expect(row.reason.length, `${file} carries a written reason`).toBeGreaterThan(20);
    }
  });

  test('every lifted site also clears the bottom bar that shows from 640 to 1023 px', () => {
    expect(Object.keys(tree.lifted).length, 'presence control: lifted sites exist').toBeGreaterThan(0);
    expect(tree.barless, 'lifted sites whose desktop branch lands on the 640-1023 bottom bar').toEqual([]);
  });

  test('OPAQUE is exact, and no fixed position is computed', () => {
    expect(sorted(tree.opaque)).toEqual(sorted(counts(OPAQUE)));
    expect(tree.dynamicFixed).toEqual([]);
  });
});

describe('viewport-sized boxes leave room for the pinned footer', () => {
  const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

  test('the desktop Realm shell subtracts FOOTER_INSET and the bottom bar under the painted arrow', () => {
    expect(read('src/components/WorldMap.jsx'))
      .toMatch(/height:\s*`calc\(100vh - \$\{ARROW_CLEAR\} - 66px - \$\{BOTTOM_NAV_H\} - \$\{FOOTER_INSET\}\)`/);
  });

  test('the desktop Entity Inspector subtracts FOOTER_INSET and the bottom bar below the arrow\'s barb', () => {
    expect(read('src/components/dossier/SettlementWorkbench.jsx'))
      .toMatch(/maxHeight:\s*`calc\(100dvh - \$\{ARROW_BARB_CLEAR\} - 48px - \$\{BOTTOM_NAV_H\} - \$\{FOOTER_INSET\}\)`/);
  });

  test('the lifted Surveyor panels keep their top edge by subtracting the same lifts', () => {
    expect(read('src/components/InterviewPanel.jsx'))
      .toMatch(/maxHeight:\s*`calc\(100vh - 32px - \$\{FOOTER_INSET\}\$\{isMobile \? '' : ` - \$\{BOTTOM_NAV_H\}`\}\)`/);
    expect(read('src/components/surveyor/SurveyorWorkshop.jsx'))
      .toMatch(/maxHeight:\s*`calc\(100vh - 160px - \$\{FOOTER_INSET\}\$\{isMobile \? '' : ` - \$\{BOTTOM_NAV_H\}`\}\)`/);
  });
});
