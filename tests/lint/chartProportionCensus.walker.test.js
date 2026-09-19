// @vitest-environment node
/**
 * chartProportionCensus.walker.test.js — EVERY DRAWN PROPORTION ON THE DOSSIER AND IN
 * THE PDF, AND THE FIGURE PRINTED BESIDE IT, PINNED TO ONE SOURCE (ODQ §934.20).
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────
 * A chart is two statements of one fact: the run the reader SEES and the number the
 * reader READS. When the two are computed from different fields, both are honest
 * about their own arithmetic and only one can be true of the settlement — and the
 * disagreement is invisible to every test that renders the chart, because each half
 * renders correctly. The owner found it on the Economics tab's food balance bar: a
 * world needing 1,014 lb/day against 773 grown and 169 imported drew production
 * (76 %), imports (17 %) and a beige tail of 7 %, under a sentence stating a 4 %
 * residual. The missing three points were the magical food offset the writer
 * credits, which the bar never drew and no label ever named. §934.15 had already
 * cured the same class one layer down, between the FIGURES; this file is the
 * standing guard one layer up, between the picture and the figures.
 *
 * ── THE WALK ─────────────────────────────────────────────────────────────────
 * ARM 1 (TOTALITY) parses every file under the dossier and PDF section trees and
 * finds every site whose GEOMETRY is computed: a style property in
 * {width,height,left,right,top,bottom,flex,inset,strokeDasharray} whose value is
 * either a template literal carrying an expression, or — for `flex`, the share-bar
 * idiom — anything that is not a literal or a choice between literals. The
 * discovered set must EXACTLY equal the registry below, so a new chart is red on
 * arrival and a deleted one cannot leave a stale row behind.
 *
 * ARM 2 (LIVENESS) pins each row's `figure` — the expression whose value is printed
 * beside the run — as a verbatim substring of its own file. A census that quotes a
 * site which no longer exists is a census of the past, and this is what forces a
 * re-reading when either half of a pair is edited.
 *
 * ARM 3 (AGREEMENT) is the mechanical half, and it is deliberately NOT prose. For
 * each pair it resolves both expressions through the file's own `const` bindings and
 * reduces them to the TERMINAL FIELD NAMES they read — the last property of each
 * member chain, the object behind a `.length`, the receiver behind a method call.
 * The intersection must equal the row's declared `sharedOn`, EXACTLY. Two runs cut
 * from `eco.foodSecurity.resilienceScore` and `eco.foodSecurity.label` share an
 * object and no field, and that is the reading this predicate is built to fail.
 *
 * ARM 4 (DERIVED) covers the honest indirection: a run whose width comes through a
 * derivation leaf rather than straight off the record. The row names the leaf, the
 * symbol and the fields the leaf reads; the walker proves the file imports that
 * symbol, that the leaf really reads every declared field, and that the figure's own
 * field is among them. A ladder that stopped reading the field its label prints reds
 * here.
 *
 * ARM 5 (THE REPORTED SET) is frozen and exact. A pair the lane could not cure
 * without reaching a writer or re-grading a domain is recorded with its arithmetic,
 * never silently reclassified as agreement; the set may shrink, and a NEW
 * disagreement cannot be added without moving it in review.
 *
 * ARM 6 (ANTI-VACUITY) runs the detector and the agreement predicate against
 * synthetic sources: a planted chart is discovered, a planted disagreement is
 * refused, a planted agreement is accepted. A silently-broken walker reds here
 * rather than in production.
 *
 * ⚠ WHAT THIS FILE DOES NOT CLAIM. It reads SOURCE, not pixels. That a run is the
 * right WIDTH for its field is proved where the chart is rendered — for the food bar
 * that is `tests/ui/economicsTabFlow.test.js`, which asserts the three runs and the
 * tail against the owner's own numbers. This walker proves the weaker, broader
 * property no rendered test can: that across the twenty-eight computed-geometry sites
 * this tree carries — twenty-five real charts and three the detector reads as charts and
 * the census names as layout — none is cut from a field its own caption does not name,
 * except the ONE that is, which is named with its arithmetic.
 *
 * THE CENSUS, BY VERDICT, so a reader can check the paragraph above against the rows
 * rather than trusting it: 28 rows = 16 one-source + 8 derived + 3 layout + 1 reported.
 * (The sentence above said "the two that are" and had done since before the §934.29
 * consist cured `overview-power-fill`; REPORTED_DISAGREEMENTS below has held exactly
 * one member since, and ARM 5 pins it. A docstring figure nothing asserts is the
 * cheapest thing in this file to leave wrong — measured at 2026-09-19 against these
 * rows, and the breakdown is here so the next reader can re-measure in one grep.)
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'espree';
import { codeOnly } from '../helpers/codeOnlySource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The trees a dossier reader's charts live in — screen first, then print. */
const CENSUS_TREES = ['src/components/new', 'src/components/dossier', 'src/pdf/sections'];

/** Style properties whose value is a GEOMETRY: a length, a position, or a share. */
const GEOMETRY_KEYS = new Set([
  'width', 'height', 'left', 'right', 'top', 'bottom', 'flex', 'inset', 'strokeDasharray',
]);

/**
 * Names that carry no record meaning, so an intersection on one of them would be a
 * false agreement. Math and the estate's own formatters are idiom, not source.
 */
// ⛔ `min` / `max` / `round` ARE NOT HERE, AND THAT IS THE CORRECTION. They were, to strip
// `Math.max(...)`; but `terminalFields` already suppresses a member chain's own property
// identifier, so the method name never reaches this set — while a LOCAL BINDING called
// `max` does. HistoryFounding.jsx declares exactly that (`const max = age;`), so its
// timeline resolved to nothing and a pair that plainly shares its axis measured as sharing
// nothing. A stoplist that silences a real binding is a vacuity generator.
const IDIOM = new Set([
  'Math', 'Number', 'String', 'Object', 'Array', 'Boolean', 'JSON', 'isFinite', 'parseInt',
  'toFixed', 'length',
  'formatCount', 'smart', 'safePct', 'finite', 'statusCase', 'scoreBand', 'tokenCase',
  'humanize', 'causalBandWord', 'dimensionPolarity', 'foodBarSegments', 'chromeFontSize',
  'proseFontSize', 'undefined', 'null', 'true', 'false',
]);

// ── THE CENSUS ────────────────────────────────────────────────────────────────
// One row per drawn proportion. `drawn` is the geometry expression EXACTLY as the
// detector normalises it (whitespace collapsed); `figure` is the expression whose
// value is printed beside the run, verbatim from the same file.
//
// verdict:
//   'one-source'  — the run and the figure read the same record field(s) (`sharedOn`).
//   'derived'     — the run comes through a derivation leaf that reads the figure's
//                   own field (`via`).
//   'reported'    — a real disagreement this lane did not cure; `why` carries the
//                   arithmetic and the reason the cure is not display-side.
//   'layout'      — the detector's own false positive: geometry that draws no record.
const CHART_CENSUS = Object.freeze([
  // ── ECONOMICS · THE FOOD BALANCE BAR (the owner's finding, cured in this consist)
  {
    id: 'economics-food-production-run',
    path: 'src/components/new/tabs/EconomicsTab.jsx', dim: 'width',
    drawn: '`${foodBar.production}%`',
    figure: 'formatCount(fb.dailyProduction)',
    verdict: 'derived',
    via: { module: 'src/domain/display/foodBalanceBar.js', symbol: 'foodBarSegments', field: 'dailyProduction' },
  },
  {
    id: 'economics-food-import-run',
    path: 'src/components/new/tabs/EconomicsTab.jsx', dim: 'width',
    drawn: '`${foodBar.imports}%`',
    figure: 'formatCount(fb.importCoverage)',
    verdict: 'derived',
    via: { module: 'src/domain/display/foodBalanceBar.js', symbol: 'foodBarSegments', field: 'importCoverage' },
  },
  {
    id: 'economics-food-magic-run',
    path: 'src/components/new/tabs/EconomicsTab.jsx', dim: 'width',
    drawn: '`${foodBar.magic}%`',
    figure: 'formatCount(fb.magicFoodOffset)',
    verdict: 'derived',
    via: { module: 'src/domain/display/foodBalanceBar.js', symbol: 'foodBarSegments', field: 'magicFoodOffset' },
  },
  {
    id: 'economics-food-import-offset',
    path: 'src/components/new/tabs/EconomicsTab.jsx', dim: 'left',
    drawn: '`${foodBar.production}%`',
    figure: 'formatCount(fb.dailyProduction)',
    verdict: 'derived',
    via: { module: 'src/domain/display/foodBalanceBar.js', symbol: 'foodBarSegments', field: 'dailyProduction' },
  },
  {
    id: 'economics-food-magic-offset',
    path: 'src/components/new/tabs/EconomicsTab.jsx', dim: 'left',
    drawn: '`${foodBar.production+foodBar.imports}%`',
    figure: 'formatCount(fb.importCoverage)',
    verdict: 'derived',
    via: { module: 'src/domain/display/foodBalanceBar.js', symbol: 'foodBarSegments', field: 'importCoverage' },
  },
  // ── ECONOMICS · THE INCOME-SOURCE BARS
  {
    id: 'economics-income-source-run',
    path: 'src/components/new/tabs/EconomicsTab.jsx', dim: 'right',
    drawn: '`${100-Math.min(src.percentage,100)}%`',
    figure: 'src.percentage',
    verdict: 'one-source', sharedOn: ['percentage'],
  },
  {
    id: 'economics-income-source-small-label',
    path: 'src/components/new/tabs/EconomicsTab.jsx', dim: 'left',
    drawn: '`${src.percentage+1}%`',
    figure: 'src.percentage',
    verdict: 'one-source', sharedOn: ['percentage'],
  },
  // ── OVERVIEW · SYSTEMS HEALTH
  {
    id: 'overview-score-row',
    path: 'src/components/new/tabs/OverviewTab.jsx', dim: 'width',
    drawn: '`${n}%`',
    figure: 'statusCase(scoreBand(n))',
    verdict: 'one-source', sharedOn: ['score'],
  },
  {
    id: 'overview-food-security-bar',
    path: 'src/components/new/tabs/OverviewTab.jsx', dim: 'width',
    drawn: '`${Math.min(100,Math.max(0,eco.foodSecurity.resilienceScore||0))}%`',
    figure: 'eco.foodSecurity.label',
    verdict: 'reported',
    why: 'THE BAR AND THE WORD ARE TWO DIFFERENT FACTS. The run is `resilienceScore`'
      + ' (foodGenerator.js: storage/12 × 35 + diversity × 30 + a low-dependency bonus + an'
      + ' adequacy bonus); the label beside it is the food BAND, cut from `deficitPct` and'
      + ' `surplusPct` alone. A town at deficitPct 0 with no granary and one food chain reads'
      + ' "Secure" over a bar near a third full. NOT CURABLE FROM DISPLAY: re-cutting the label'
      + ' off resilienceScore is a domain re-grade (owner-gated), and re-drawing the run off the'
      + ' deficit contradicts the owner order of 2026-07-22 recorded at OverviewTab.jsx:436 —'
      + ' "the bar tracks the derived 0-100 resilienceScore; the VALUE shown is the band label".'
      + ' Reported with the arithmetic; the door is the chair’s.',
  },
  {
    id: 'overview-institution-distribution',
    path: 'src/components/new/tabs/OverviewTab.jsx', dim: 'flex',
    drawn: 'insts.length',
    figure: 'insts.length',
    verdict: 'one-source', sharedOn: ['insts'],
  },
  // ── POWER
  {
    id: 'power-standing-rung',
    path: 'src/components/new/tabs/PowerTab.jsx', dim: 'width',
    drawn: '`${Math.round(rung.standing*100)}%`',
    figure: 'Math.round(rung.standing*100)',
    verdict: 'one-source', sharedOn: ['standing'],
  },
  {
    id: 'power-strata-distribution',
    path: 'src/components/new/tabs/power/PowerStrata.jsx', dim: 'flex',
    drawn: 'Math.max(pct, 1)',
    figure: 'r.power',
    verdict: 'one-source', sharedOn: ['power'],
  },
  {
    id: 'summary-faction-bar',
    path: 'src/components/new/SummaryTab.jsx', dim: 'flex',
    drawn: 'pct',
    figure: 'f.power',
    verdict: 'one-source', sharedOn: ['power'],
  },
  // ── DEFENCE
  {
    id: 'defense-threat-row',
    path: 'src/components/new/tabs/DefenseTab.jsx', dim: 'width',
    drawn: '`${sc}%`',
    figure: 'statusCase(scoreBand(sc))',
    // The bar's `sc` and the badge's band are the SAME lookup into the same score map, so
    // the resolved field sets are identical rather than merely overlapping — every term of
    // `threatScores` reaches both. Declared in full: an edit to that map is exactly the
    // event that should force this pair to be re-read.
    verdict: 'one-source',
    sharedOn: ['disaster', 'economic', 'hasChurch', 'hasGranary', 'hasHospital', 'internal',
      'label', 'military', 'monster', 'resilienceScore'],
  },
  {
    id: 'defense-capability-row',
    path: 'src/components/new/tabs/DefenseTab.jsx', dim: 'width',
    drawn: '`${Math.min(100,cap.score)}%`',
    figure: 'statusCase(scoreBand(cap.score))',
    verdict: 'one-source', sharedOn: ['score'],
  },
  // ── HISTORY
  {
    id: 'history-timeline-dot',
    path: 'src/components/new/tabs/HistoryTab.jsx', dim: 'left',
    drawn: '`${te.pct}%`',
    figure: 'te.yearsAgo',
    // `pct` is minted inside the `positioned` map's OBJECT LITERAL rather than a const, so
    // the binding resolver cannot follow it; the derivation is named instead. The position
    // and the printed year are one arithmetic — (age − yearsAgo) / age — clamped to [3,97]
    // so a founding-year dot stays on the track.
    verdict: 'derived',
    via: { module: 'src/components/new/tabs/HistoryTab.jsx', symbol: 'positioned', field: 'age - te.yearsAgo' },
  },
  {
    id: 'history-timeline-year-label',
    path: 'src/components/new/tabs/HistoryTab.jsx', dim: 'left',
    drawn: '`${te.pct}%`',
    figure: 'te.yearsAgo',
    verdict: 'derived',
    via: { module: 'src/components/new/tabs/HistoryTab.jsx', symbol: 'positioned', field: 'age - te.yearsAgo' },
  },
  // ── THE GRANARY GAUGE (engine sections)
  {
    id: 'granary-gauge',
    path: 'src/components/dossier/EngineSections.jsx', dim: 'width',
    drawn: '`${pct}%`',
    figure: 'model.storageMonths.toFixed(1)',
    verdict: 'one-source', sharedOn: ['storageMonths'],
  },
  // ── PRINT
  {
    id: 'pdf-overview-produced',
    path: 'src/pdf/sections/Overview.jsx', dim: 'width',
    drawn: '`${prodPct}%`', figure: 'smart(prod)',
    verdict: 'one-source', sharedOn: ['production'],
  },
  {
    id: 'pdf-overview-needed',
    path: 'src/pdf/sections/Overview.jsx', dim: 'width',
    drawn: '`${needPct}%`', figure: 'smart(need)',
    verdict: 'one-source', sharedOn: ['need'],
  },
  {
    id: 'pdf-economics-produced',
    path: 'src/pdf/sections/EconomicsTrade.jsx', dim: 'width',
    drawn: '`${prodPct}%`', figure: 'smart(prod)',
    verdict: 'one-source', sharedOn: ['production'],
  },
  {
    id: 'pdf-economics-needed',
    path: 'src/pdf/sections/EconomicsTrade.jsx', dim: 'width',
    drawn: '`${needPct}%`', figure: 'smart(need)',
    verdict: 'one-source', sharedOn: ['need'],
  },
  {
    id: 'pdf-defense-threat-row',
    path: 'src/pdf/sections/DefenseSecurity.jsx', dim: 'width',
    drawn: '`${Math.max(0, Math.min(100, row.score))}%`',
    figure: 'statusCase(row.status)',
    // The chapter reads a VIEW-MODEL row, so the link is two hops: the body slice binds
    // `threatReadiness` to the shared display reader, and that reader mints `status` from
    // the very `score` this bar is drawn from. `through` pins the middle hop, so neither
    // end can be re-wired without this row being re-read.
    verdict: 'derived',
    via: {
      module: 'src/domain/display/defenseDisplay.js',
      symbol: 'threatReadiness',
      field: 'status: scoreBand(score)',
      through: { module: 'src/pdf/lib/viewModelBodySlices.js', link: 'threatReadiness = deriveDefenseReadiness(' },
    },
  },
  {
    id: 'pdf-history-timeline-dot',
    path: 'src/pdf/sections/HistoryFounding.jsx', dim: 'left',
    drawn: '`${pct}%`',
    figure: 'Math.round(min + span * p)',
    // The dot's position and the axis ticks it is read against are both cut from the
    // settlement's `age`: the dot through (age − yearsAgo) / span, the tick through
    // min + span × p, with span = age − 0.
    verdict: 'one-source', sharedOn: ['age'],
  },
  // ── CURED 2026-09-19 (the §934.29 consist). This row was REPORTED: `fillPct` was
  //    `dimensionPolarity(key) === 'lower_is_better' ? 100 - dim.value : dim.value` while
  //    the figure printed in the same row was the RAW `dim.value`, so a card reading
  //    "Volatility · Critical · 88" drew a bar 12 % full and nothing said so. The chair
  //    ruled that THE BAR DRAWS THE NUMBER IT PRINTS and the row states the scale where the
  //    dimension runs the other way. The run is now `dim.value` itself — the same expression
  //    as the figure, which is why this grades one-source rather than derived — and the
  //    always-visible caption carries `dimensionScaleNote(dimKey)` ("lower is better") from
  //    domain/state/bands.js, beside the polarity it reads. The SCREEN TWIN
  //    (src/components/settlement/SystemStateBar.jsx) took the identical cure off the same
  //    leaf in the same commit: it is outside CENSUS_TREES, so this census never saw it, but
  //    both files' headers pin the two surfaces to agree and curing one alone would have
  //    manufactured the disagreement they forbid.
  {
    id: 'pdf-system-state-dimension',
    path: 'src/pdf/sections/SystemStateSnapshot.jsx', dim: 'width',
    drawn: '`${dim.value}%`',
    figure: 'dim.value',
    verdict: 'one-source', sharedOn: ['value'],
  },
  // ── NOT CHARTS (the detector's own false positives, kept rather than filtered)
  {
    id: 'faithwar-stat-flex-default',
    path: 'src/pdf/sections/FaithWar.jsx', dim: 'flex', drawn: 'flex = 1', figure: null,
    verdict: 'layout',
    why: 'A component PROP DEFAULT (`function Stat({ …, flex = 1 })`), not a drawn share. The'
      + ' detector reads the assignment pattern as a dynamic flex value; it is kept in the census'
      + ' rather than filtered out, because a filter that hides a shape also hides the day that'
      + ' shape starts carrying a record.',
  },
  {
    id: 'faithwar-stat-flex-passthrough',
    path: 'src/pdf/sections/FaithWar.jsx', dim: 'flex', drawn: 'flex', figure: null,
    verdict: 'layout',
    why: 'The same prop, passed through to the View that draws the tile. No record is read on'
      + ' either side of it: `flex` arrives from the call site as a layout weight and leaves as'
      + ' one, so there is no figure for it to disagree with.',
  },
  {
    id: 'workbench-arrow-clearance',
    path: 'src/components/dossier/SettlementWorkbench.jsx', dim: 'top',
    drawn: '`calc(${ARROW_BARB_CLEAR} + 24px)`', figure: null,
    verdict: 'layout',
    why: 'Chrome clearance under the painted arrow header: a `calc()` over a design constant'
      + ' plus a fixed pixel gap. No settlement field reaches it and there is no figure beside'
      + ' it, so there is nothing for it to agree or disagree with.',
  },
]);

/**
 * The frozen disagreement set: shrink-only, exact. A NEW one cannot land quietly.
 *
 * ⭐ SHRUNK 2 → 1 on 2026-09-19: `pdf-system-state-dimension` was cured (see its row above)
 * and comes out of the set in the same commit that cured it, so the win is banked rather
 * than becoming spare budget. What remains is `overview-food-security-bar`, which is NOT
 * curable from display — re-cutting its label off `resilienceScore` is a domain re-grade
 * and re-drawing its run off the deficit contradicts the owner order of 2026-07-22 recorded
 * at OverviewTab.jsx. Its door is the owner's.
 */
const REPORTED_DISAGREEMENTS = Object.freeze([
  'overview-food-security-bar',
]);

// ── THE DETECTOR (shared by the live walk and the anti-vacuity plants) ────────

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkFiles(p, out);
    else if (/\.jsx?$/.test(p) && !/\.test\./.test(p)) out.push(p);
  }
  return out;
}

/** @param {any} node @param {(n:any)=>void} fn */
function visit(node, fn) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const n of node) visit(n, fn); return; }
  if (typeof node.type === 'string') fn(node);
  for (const key of Object.keys(node)) {
    if (key === 'range' || key === 'loc') continue;
    visit(node[key], fn);
  }
}

function parseSource(source) {
  return parse(source, {
    ecmaVersion: 'latest', sourceType: 'module', loc: true, range: true,
    ecmaFeatures: { jsx: true },
  });
}

const oneLine = (s) => s.replace(/\s+/g, ' ').trim();
const isLiteral = (n) => !!n && n.type === 'Literal';
const isLiteralChoice = (n) => !!n && n.type === 'ConditionalExpression'
  && isLiteral(n.consequent) && isLiteral(n.alternate);

/**
 * Every computed-geometry site in one source.
 * @param {string} source @param {string} path
 * @returns {{path:string, dim:string, drawn:string, line:number}[]}
 */
// ⚠ NOT EXPORTED: a test file's exports re-register its suites in every importer
// (tests/helpers/dormancyOracle.js's incident). The guard-the-guard arms below live in
// this file, so the detector and the predicate need no export to be proven.
function scanChartSites(source, path) {
  const ast = parseSource(source);
  const found = [];
  visit(ast, (node) => {
    if (node.type !== 'Property' || node.computed) return;
    const dim = node.key?.name ?? node.key?.value;
    if (!GEOMETRY_KEYS.has(dim)) return;
    const value = node.value;
    const dynamicTemplate = value?.type === 'TemplateLiteral' && value.expressions.length > 0;
    const dynamicFlex = dim === 'flex' && !isLiteral(value) && !isLiteralChoice(value);
    if (!dynamicTemplate && !dynamicFlex) return;
    found.push({ path, dim, drawn: oneLine(source.slice(value.range[0], value.range[1])), line: value.loc.start.line });
  });
  return found;
}

// ── THE AGREEMENT PREDICATE ───────────────────────────────────────────────────

/** Every `const x = …` in a source, by name → the initializer's source text. */
function constBindings(source) {
  const ast = parseSource(source);
  /** @type {Map<string, string>} */
  const out = new Map();
  visit(ast, (node) => {
    if (node.type !== 'VariableDeclarator' || node.id?.type !== 'Identifier' || !node.init) return;
    if (!out.has(node.id.name)) out.set(node.id.name, oneLine(source.slice(node.init.range[0], node.init.range[1])));
  });
  return out;
}

/**
 * The TERMINAL FIELD NAMES one expression reads.
 *
 * A member chain contributes its LAST property (`eco.foodSecurity.label` → `label`);
 * `.length` contributes its receiver instead (`insts.length` → `insts`); a method
 * call contributes its receiver's chain rather than the method (`x.y.toFixed(1)` →
 * `y`); a bare identifier contributes itself. Idiom is dropped.
 */
function terminalFields(exprSource) {
  const ast = parseSource(`(${exprSource})`);
  /** @type {Set<string>} */
  const fields = new Set();
  /** @type {Set<any>} */
  const suppressed = new Set(); // nodes consumed by an enclosing chain or call

  visit(ast, (node) => {
    if (node.type === 'MemberExpression' && !node.computed) {
      suppressed.add(node.object);
      // The PROPERTY identifier too: the chain contributes its name through the branch
      // below, and letting the bare identifier through as well is how `Math.max` used to
      // put `max` into the field set.
      suppressed.add(node.property);
    }
    if (node.type === 'CallExpression' && node.callee?.type === 'MemberExpression') suppressed.add(node.callee);
    if (node.type === 'CallExpression' && node.callee?.type === 'Identifier') suppressed.add(node.callee);
    if (node.type === 'Property' && !node.computed) suppressed.add(node.key);
  });
  visit(ast, (node) => {
    if (suppressed.has(node)) return;
    if (node.type === 'MemberExpression' && !node.computed) {
      const name = node.property?.name;
      if (name === 'length') {
        let receiver = node.object;
        while (receiver?.type === 'MemberExpression') receiver = receiver.object;
        if (receiver?.type === 'Identifier') fields.add(receiver.name);
      } else if (name) fields.add(name);
      return;
    }
    if (node.type === 'MemberExpression' && node.computed) {
      let receiver = node.object;
      while (receiver?.type === 'MemberExpression') receiver = receiver.object;
      if (receiver?.type === 'Identifier') fields.add(receiver.name);
      return;
    }
    if (node.type === 'Identifier') fields.add(node.name);
  });
  // A method call's receiver chain is walked above through `callee.object`; the
  // callee itself is suppressed, so `model.storageMonths.toFixed(1)` lands on
  // `storageMonths` rather than on `toFixed`.
  visit(ast, (node) => {
    if (node.type !== 'CallExpression' || node.callee?.type !== 'MemberExpression') return;
    const receiver = node.callee.object;
    if (receiver?.type === 'MemberExpression' && !receiver.computed && receiver.property?.name) {
      fields.add(receiver.property.name);
    } else if (receiver?.type === 'Identifier') fields.add(receiver.name);
  });
  for (const name of [...fields]) if (IDIOM.has(name)) fields.delete(name);
  return fields;
}

/**
 * Terminal fields, resolved through the file's own `const` bindings.
 *
 * ⚠ THE CYCLE GUARD IS PER BRANCH, NOT PER WALK, and that distinction is load-bearing.
 * A guard shared across sibling branches refuses to resolve a name the second time it is
 * reached by a DIFFERENT route — so `span` (which reads `max`) stopped resolving because
 * `max` had already been followed through `yearFromFounding`, and a pair that plainly
 * shares a source measured as sharing nothing. Each branch carries its own chain.
 */
function resolvedFields(exprSource, bindings, depth = 4, chain = new Set()) {
  const out = new Set(terminalFields(exprSource));
  if (depth <= 0) return out;
  for (const name of [...out]) {
    if (chain.has(name) || !bindings.has(name)) continue;
    const next = new Set(chain).add(name);
    const inner = resolvedFields(/** @type {string} */ (bindings.get(name)), bindings, depth - 1, next);
    out.delete(name);
    for (const f of inner) out.add(f);
  }
  return out;
}

const sorted = (set) => [...set].sort();
const intersect = (a, b) => sorted(new Set([...a].filter((x) => b.has(x))));

// ── THE LIVE WALK ─────────────────────────────────────────────────────────────

const LIVE_SITES = CENSUS_TREES
  .flatMap((tree) => walkFiles(join(ROOT, tree)))
  .sort()
  .flatMap((abs) => scanChartSites(readFileSync(abs, 'utf8'), relative(ROOT, abs).replace(/\\/g, '/')));

const SOURCE_CACHE = new Map();
function sourceOf(path) {
  if (!SOURCE_CACHE.has(path)) SOURCE_CACHE.set(path, readFileSync(join(ROOT, path), 'utf8'));
  return SOURCE_CACHE.get(path);
}

// ⛔ A USE CLAIM MUST READ CODE. Every `includes` below asks whether a file really READS a
// field, and this census's own rationale blocks name those fields repeatedly in prose — so a
// substring test over the raw source would have been satisfied by the comment explaining the
// cure, and a leaf that stopped reading `magicFoodOffset` would still have passed while its
// header said it did. `codeOnly` blanks comments and string CONTENTS at fixed offsets (the
// estate's shared strip, tests/helpers/codeOnlySource.js), which is exactly the class it was
// extracted for.
const CODE_CACHE = new Map();
function codeOf(path) {
  if (!CODE_CACHE.has(path)) CODE_CACHE.set(path, codeOnly(sourceOf(path)));
  return CODE_CACHE.get(path);
}
const BINDING_CACHE = new Map();
function bindingsOf(path) {
  if (!BINDING_CACHE.has(path)) BINDING_CACHE.set(path, constBindings(sourceOf(path)));
  return BINDING_CACHE.get(path);
}

const siteKey = (row) => `${row.path}|${row.dim}|${row.drawn}`;

describe('chart proportion census (ODQ §934.20) — every drawn run and the figure beside it', () => {
  it('ARM 1 — the discovered chart sites are EXACTLY the censused ones', () => {
    const discovered = LIVE_SITES.map(siteKey).sort();
    const censused = CHART_CENSUS.map(siteKey).sort();
    expect(
      discovered,
      'A drawn proportion appeared, moved or vanished. Census it: name the field its width is'
      + ' cut from and the field the figure beside it is read from, and cure the pair if they differ.',
    ).toEqual(censused);
  });

  it('ARM 1b — the census is non-trivial and every row is well-formed', () => {
    expect(CHART_CENSUS.length).toBeGreaterThanOrEqual(20);
    expect(new Set(CHART_CENSUS.map((r) => r.id)).size).toBe(CHART_CENSUS.length);
    for (const row of CHART_CENSUS) {
      expect(typeof row.id, JSON.stringify(row)).toBe('string');
      expect(['one-source', 'derived', 'reported', 'layout']).toContain(row.verdict);
      if (row.verdict === 'one-source') expect(Array.isArray(row.sharedOn), row.id).toBe(true);
      if (row.verdict === 'derived') expect(typeof row.via?.module, row.id).toBe('string');
      if (row.verdict === 'reported' || row.verdict === 'layout') {
        expect(String(row.why || '').length, row.id).toBeGreaterThan(80);
      }
    }
  });

  it('ARM 2 — every censused figure is still a verbatim expression in its own file', () => {
    for (const row of CHART_CENSUS) {
      if (row.figure == null) continue;
      expect(
        oneLine(codeOf(row.path)).includes(oneLine(row.figure)),
        `${row.id}: the figure \`${row.figure}\` is no longer in ${row.path} — the pair moved, so re-read it`,
      ).toBe(true);
    }
  });

  it('ARM 3 — a one-source pair really reads one field, and exactly the declared one', () => {
    const graded = CHART_CENSUS.filter((r) => r.verdict === 'one-source');
    expect(graded.length).toBeGreaterThanOrEqual(12);
    for (const row of graded) {
      const bindings = bindingsOf(row.path);
      const drawn = resolvedFields(row.drawn, bindings);
      const figure = resolvedFields(/** @type {string} */ (row.figure), bindings);
      expect(
        intersect(drawn, figure),
        `${row.id}: the run reads {${sorted(drawn)}} and the figure beside it reads {${sorted(figure)}}`,
      ).toEqual([...row.sharedOn].sort());
    }
  });

  it('ARM 4 — a derived run comes through a leaf that reads the figure’s own field', () => {
    const derived = CHART_CENSUS.filter((r) => r.verdict === 'derived');
    expect(derived.length).toBeGreaterThanOrEqual(5);
    for (const row of derived) {
      const consumer = codeOf(row.path);
      expect(consumer.includes(row.via.symbol), `${row.id}: ${row.path} no longer reads ${row.via.symbol}`).toBe(true);
      if (row.via.through) {
        expect(
          codeOf(row.via.through.module).includes(row.via.through.link),
          `${row.id}: ${row.via.through.module} no longer binds \`${row.via.through.link}\``,
        ).toBe(true);
      }
      const leaf = codeOf(row.via.module);
      expect(
        leaf.includes(row.via.field),
        `${row.id}: ${row.via.module} no longer reads \`${row.via.field}\` — the run and its label have parted`,
      ).toBe(true);
      // The figure's own field is the one the leaf must read, so the two cannot drift.
      const figureFields = resolvedFields(/** @type {string} */ (row.figure), bindingsOf(row.path));
      // WORD-BOUNDARY, never substring: a one-letter field name matches almost any
      // expression by accident, and an accidental match is a vacuous green.
      expect(
        [...figureFields].some((f) => new RegExp(`\\b${f}\\b`).test(row.via.field)),
        `${row.id}: the leaf reads \`${row.via.field}\` but the label prints {${sorted(figureFields)}}`,
      ).toBe(true);
    }
  });

  it('ARM 5 — the reported disagreements are exactly the frozen set (shrink-only)', () => {
    expect(
      CHART_CENSUS.filter((r) => r.verdict === 'reported').map((r) => r.id).sort(),
      'A pair now disagrees that did not before, or a cure landed without banking it here.'
      + ' A new disagreement is cured or carried into review — never absorbed.',
    ).toEqual([...REPORTED_DISAGREEMENTS].sort());
  });
});

describe('guard-the-guard: the detector and the agreement predicate are not vacuous', () => {
  const PLANTED = [
    "const pct = Math.round((r.carried / r.needed) * 100);",
    "export const Bar = () => <div style={{ width: `${pct}%` }}>{r.needed}</div>;",
  ].join('\n');

  it('a planted chart is discovered by the same detector the live walk uses', () => {
    const sites = scanChartSites(PLANTED, 'src/planted.jsx');
    expect(sites.map((s) => `${s.dim}|${s.drawn}`)).toEqual(['width|`${pct}%`']);
  });

  it('static geometry is NOT a chart (the detector does not flood the census)', () => {
    const inert = [
      "export const A = () => <div style={{ width: '100%', flex: 1, top: 0 }} />;",
      "export const B = () => <div style={{ flex: mobile ? '0 0 auto' : 1.2 }} />;",
    ].join('\n');
    // anchored: the SAME detector returns exactly one site for PLANTED in the arm above,
    // so an empty result here measures the predicate rather than a broken walk.
    expect(scanChartSites(inert, 'src/inert.jsx')).toEqual([]);
  });

  it('a planted DISAGREEMENT is refused and a planted agreement is accepted', () => {
    const bindings = constBindings(PLANTED);
    // The run is cut from `carried`/`needed`; the figure prints `needed` — they share one.
    expect(intersect(resolvedFields('`${pct}%`', bindings), resolvedFields('r.needed', bindings)))
      .toEqual(['needed']);
    // The same run beside a figure read off a DIFFERENT field shares nothing, which is the
    // owner's class: two honest numbers, one settlement, no agreement.
    expect(intersect(resolvedFields('`${pct}%`', bindings), resolvedFields('r.bandLabel', bindings)))
      .toEqual([]);
  });

  it('a member chain reduces to its terminal field, not to its container', () => {
    // `eco.foodSecurity.resilienceScore` vs `eco.foodSecurity.label` share an OBJECT and no
    // field — reducing to the container would have graded that pair as agreement.
    expect(sorted(terminalFields('eco.foodSecurity.resilienceScore'))).toEqual(['resilienceScore']);
    expect(sorted(terminalFields('eco.foodSecurity.label'))).toEqual(['label']);
    expect(sorted(terminalFields('model.storageMonths.toFixed(1)'))).toEqual(['storageMonths']);
    expect(sorted(terminalFields('insts.length'))).toEqual(['insts']);
  });
});
