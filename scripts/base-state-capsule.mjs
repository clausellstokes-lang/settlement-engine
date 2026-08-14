/**
 * base-state-capsule.mjs — regenerate docs/implementation/BASE_STATE.json.
 *
 * DESIGN_BUILD_EFFICIENCY.md section 3: the capsule is a derived artifact stamped with the sha it
 * was derived at, so a compiler at exactly that base (or at a docs-only descendant with every
 * measured path byte-identical) may cite its figures as EXECUTED instead of re-running roughly ten
 * base measurements per lane.
 *
 * THE ONE-CANONICAL-TRUTH LAW IS WHY THIS FILE INVENTS NOTHING. Every row below reads a home that
 * already exists — a live ESM import, eslint's own Linter, an existing script's stdout, or an
 * exact-equality constant parsed out of the test that asserts it. Where a figure has no canonical
 * measurer the generator REFUSES rather than spelling a second one; that is the whole difference
 * between a capsule and a fork of the estate's figures.
 *
 * PROVENANCE IS DECLARED PER ROW, AND THE KINDS ARE NOT INTERCHANGEABLE:
 *   MEASURED — computed from the tree here, now.
 *   PINNED   — an exact-equality constant read from its canonical home. It equals the tree IF AND
 *              ONLY IF the gate step asserting it is green. At a landing flip it just was, which is
 *              what makes a pinned read an executed read at that one moment and nowhere else.
 *   ARG      — supplied by the operator from an executed receipt. Exactly one row is ARG.
 *
 * ⛔ NOT ONE FIGURE MAY EVER BE EMITTED AS A DEFAULT. A silently-zeroed row inside an artifact
 * other lanes cite as executed is the worst failure this script could ship, so every arm throws.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Linter } from 'eslint';
import { parse } from 'espree';
import { SCOPE_FLOOR_RATIO } from './check-test-ratchet.mjs';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const CAPSULE_PATH = 'docs/implementation/BASE_STATE.json';
const RATCHET_BASELINE = 'scripts/.test-ratchet-baseline.json';
const LIGHTING_WALKER = 'tests/lint/sovereigntyLightingContract.walker.test.js';
const KIND_POOL_WALKER = 'tests/lint/kindPoolFloors.walker.test.js';
const GUIDANCE_WALKER = 'tests/domain/guidanceRegistry.walker.test.js';
const KILL_LIST = 'tests/design/deepCraftKillList.test.js';
const VOICE_MECHANICS = 'tests/copy/voiceMechanics.test.js';

/** The standing hot-file list and its ceilings (PACKET_STANDARD.md, "Hot files"). */
const HOT_FILES = Object.freeze({
  'src/components/OutputContainer.jsx': 600,
  'src/domain/worldPulse/peaceTerms.js': 800,
  'src/domain/worldPulse/informationStatecraft.js': 800,
});

/** Paths whose dirt would make the stamp a lie. docs/ is excluded except the artifact itself,
 * because a landing legitimately stages its own promotion and ledger prose alongside this run. */
const DIRTY_SCOPES = Object.freeze(['src/', 'scripts/', 'tests/', CAPSULE_PATH]);

/** Frozen verbatim: the law a consumer reads, never re-worded by a generator run. */
const CONSUMPTION_LAW = 'citable as executed ONLY by a compiler whose verified base is exactly'
  + ' stampedAt, OR whose base is a DOCS-ONLY descendant of stampedAt with every measured path'
  + ' byte-identical across that window (the rule the chair adopted as train-plan judgment J-T1);'
  + ' rows a manifest touches are always re-executed';

/** The artifact's frozen figure order. A reorder is a persisted-shape change and is owner-gated. */
export const FIGURE_ORDER = Object.freeze([
  'lightingCensus', 'runtimeTests', 'frozenKnownFailures', 'titleCensus', 'killList', 'osrFindings',
  'typecheckRatchet', 'strictDomainRatchet', 'hotFiles', 'flagManifestRows',
  'grammarKindRegistryRows', 'grammarReceiptsPools', 'grammarHeraldKinds', 'routedTokens',
  'kindPoolFloorsRegisteredKinds', 'kindPoolFloorsRegisteredMinusRouted',
  'kindPoolFloorsUnvoicedTokens', 'kindPoolFloorsRegistries', 'validatePackets',
  'voiceMechanicsBankedArms',
]);

const figure = (kind, home, read) => ({ kind, target: 'figure', home, read });
const stamp = (read) => ({ kind: 'MEASURED', target: 'top', home: 'git', read });

/** Every emitted key declares where it came from and how. Totality is asserted in both directions. */
export const PROVENANCE = Object.freeze({
  stampedAt: stamp('git rev-parse --short=8 HEAD'),
  stampedDate: stamp('git show -s --format=%cs HEAD'),
  lightingCensus: figure('PINNED', LIGHTING_WALKER, 'the CENSUS object literals'),
  runtimeTests: figure('ARG', 'the landing test:ratchet receipt', '--runtime-tests=<N>'),
  frozenKnownFailures: figure('MEASURED', RATCHET_BASELINE, 'Object.keys(entries).length'),
  titleCensus: figure('PINNED', GUIDANCE_WALKER, 'TITLE_BASELINE'),
  killList: figure('PINNED', KILL_LIST, 'the four ceiling literals'),
  osrFindings: figure('MEASURED', 'scripts/check-observed-shape-readers.mjs', 'stdout finding count'),
  typecheckRatchet: figure('MEASURED', 'scripts/check-full-typecheck.mjs', 'stdout errors/ceiling'),
  strictDomainRatchet: figure('MEASURED', 'scripts/check-domain-strict.mjs', 'stdout errors/ceiling'),
  hotFiles: figure('MEASURED', 'eslint Linter max-lines', 'skipBlankLines + skipComments'),
  flagManifestRows: figure('MEASURED', 'src/domain/worldPulse/simulationRules.js', 'ENGINE_GATED_VIRTUAL_RULE_KEYS.length'),
  grammarKindRegistryRows: figure('MEASURED', 'src/domain/worldPulse/grammarNews.js', 'GRAMMAR_KIND_REGISTRY.length'),
  grammarReceiptsPools: figure('MEASURED', 'src/domain/worldPulse/grammarReceiptPools.js', 'GRAMMAR_RECEIPTS.length'),
  grammarHeraldKinds: figure('MEASURED', 'src/domain/worldPulse/grammarNews.js', 'GRAMMAR_HERALD_KINDS.length'),
  routedTokens: figure('MEASURED', 'src/domain/realm/heraldRouting.js', 'Object.keys(EXACT_SECTION).length'),
  kindPoolFloorsRegisteredKinds: figure('PINNED', KIND_POOL_WALKER, 'REGISTERED_KIND_COUNT'),
  kindPoolFloorsRegisteredMinusRouted: figure('PINNED', KIND_POOL_WALKER, 'the routedAndRegistered toBe identity'),
  kindPoolFloorsUnvoicedTokens: figure('PINNED', KIND_POOL_WALKER, 'LEGACY_UNVOICED_TOKENS'),
  kindPoolFloorsRegistries: figure('PINNED', KIND_POOL_WALKER, 'the REGISTRIES toHaveLength identity'),
  validatePackets: figure('MEASURED', 'scripts/implementation-packets.mjs', 'validate stdout'),
  voiceMechanicsBankedArms: figure('MEASURED', RATCHET_BASELINE, 'entries scoped to voiceMechanics'),
});

// ── fail-closed primitives ───────────────────────────────────────────────────────────────────
const fail = (row, why) => { throw new Error(`[base-state-capsule] ${row}: ${why}`); };

function readHome(row, relPath) {
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) fail(row, `canonical home is missing: ${relPath}`);
  return readFileSync(abs, 'utf8');
}

/**
 * The ONE process boundary, injectable as `io.shell`.
 *
 * ⚠ IT IS INJECTABLE FOR A MEASURED REASON, NOT FOR CONVENIENCE. Four of these rows shell out to
 * gate scripts, two of which run `tsc` over the whole repository. Wiring the real ones into the
 * focused battery would put two full type-check subprocesses inside a 28k-test suite run, where
 * they compete for CPU with the very suite measuring them — a flakiness source bought for no extra
 * evidence. The battery therefore injects canned stdout to prove the PARSERS and the fail-closed
 * arms, and the real boundary is proved end to end by the landing's own executed generator run.
 */
function shellOut(row, argv) {
  try {
    return execFileSync(argv[0], argv.slice(1), { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    fail(row, `shell-out exited non-zero: ${argv.join(' ')} — ${error.message}`);
    return '';
  }
}

function parseOut(row, text, re, shape) {
  const m = text.match(re);
  if (!m) fail(row, `stdout did not match the declared parse (${shape})`);
  return m;
}

// ── PINNED reads: espree over the test that asserts the constant ─────────────────────────────
const PARSE_OPTIONS = { ecmaVersion: 'latest', sourceType: 'module', range: true, ecmaFeatures: { jsx: true } };

function astOf(row, relPath) {
  try {
    return parse(readHome(row, relPath), PARSE_OPTIONS);
  } catch (error) {
    return fail(row, `canonical home did not parse: ${relPath} — ${error.message}`);
  }
}

function walkAst(node, visit) {
  if (!node || typeof node.type !== 'string') return;
  visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((child) => walkAst(child, visit));
    else if (value && typeof value === 'object' && typeof value.type === 'string') walkAst(value, visit);
  }
}

/** The single `const <name> = …` initialiser, unwrapping one `Object.freeze(...)` hop. */
function declaratorInit(row, ast, name) {
  let init = null;
  walkAst(ast, (node) => {
    if (node.type !== 'VariableDeclarator' || node.id?.name !== name) return;
    init = node.init?.type === 'CallExpression' ? node.init.arguments?.[0] ?? node.init : node.init;
  });
  if (!init) fail(row, `${name} has no single declarator in its canonical home`);
  return init;
}

/** `const <name> = <number>` — refused unless the initialiser really is a numeric literal. */
function constNumber(row, ast, name) {
  const init = declaratorInit(row, ast, name);
  if (init.type !== 'Literal' || typeof init.value !== 'number') fail(row, `${name} is not a numeric literal`);
  return init.value;
}

/** Numeric properties of `const <name> = Object.freeze({...})`, in the order asked for. */
function frozenNumbers(row, ast, name, keys) {
  const object = declaratorInit(row, ast, name);
  if (object.type !== 'ObjectExpression') fail(row, `${name} is not a literal object in its canonical home`);
  return keys.map((key) => {
    const prop = object.properties.find((p) => p.type === 'Property' && p.key?.name === key);
    if (prop?.value?.type !== 'Literal' || typeof prop.value.value !== 'number') {
      fail(row, `${name}.${key} is absent or not a numeric literal`);
    }
    return prop.value.value;
  });
}

/** The numeric argument of `expect(<subject...>).<matcher>(<number>)`, refused unless unique. */
function assertionNumber(row, ast, source, matcher, subject) {
  const hits = [];
  walkAst(ast, (node) => {
    const callee = node.type === 'CallExpression' ? node.callee : null;
    if (callee?.type !== 'MemberExpression' || callee.property?.name !== matcher) return;
    const inner = callee.object;
    if (inner?.type !== 'CallExpression' || inner.callee?.name !== 'expect' || !inner.arguments?.length) return;
    const [from, to] = inner.arguments[0].range;
    const arg = node.arguments?.[0];
    if (source.slice(from, to).includes(subject) && arg?.type === 'Literal' && typeof arg.value === 'number') {
      hits.push(arg.value);
    }
  });
  const distinct = [...new Set(hits)];
  if (distinct.length !== 1) fail(row, `expect(${subject}).${matcher}(n) is not unique (found ${distinct.length})`);
  return distinct[0];
}

/**
 * Count an exported registry, whether it is an array or a keyed object.
 *
 * ⚠⚠ THIS EXISTS BECAUSE `.length` SILENTLY RETURNED `undefined` AND THE FIGURE VANISHED. Three of
 * these registries are arrays and two are keyed objects; a bare `.length` on an object yields
 * `undefined`, JSON.stringify then DROPS the key entirely, and a battery comparing `undefined`
 * against `undefined` agrees. Refusing anything that is neither shape is what makes that class
 * impossible rather than merely fixed once.
 */
function countOf(row, value) {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === 'object') return Object.keys(value).length;
  return fail(row, 'the canonical export is neither an array nor a keyed object');
}

// ── MEASURED reads ───────────────────────────────────────────────────────────────────────────
const linter = new Linter({ configType: 'flat' });
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };

/** Effective lines under eslint's own max-lines(skipBlankLines, skipComments) — never wc -l. */
function effectiveLines(row, relPath) {
  const messages = linter.verify(readHome(row, relPath), {
    languageOptions: LANG,
    rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] },
  });
  const fatal = messages.find((m) => m.fatal);
  if (fatal) fail(row, `${relPath} did not parse: ${fatal.message}`);
  const hit = messages.find((m) => m.ruleId === 'max-lines');
  return hit ? Number(String(hit.message).match(/\((\d+)\)/)[1]) : 1;
}

function ratchetBaseline(row) {
  const parsed = JSON.parse(readHome(row, RATCHET_BASELINE));
  if (!parsed?.entries || typeof parsed.totalTests !== 'number') fail(row, 'baseline lacks entries or totalTests');
  return parsed;
}

function ratchetPair(row, script, re, shell) {
  const m = parseOut(row, shell(row, ['node', script]), re, 'errors + ceiling');
  return `${m[1]}/${m[2]}`;
}

/** Every impure read, each fail-closed. Split from capsuleFrom so the pure assembler is testable. */
export async function readAll(runtimeTests, io = {}) {
  const shell = io.shell ?? shellOut;
  const lighting = frozenNumbers('lightingCensus', astOf('lightingCensus', LIGHTING_WALKER), 'CENSUS',
    ['files', 'parked', 'credited', 'titles', 'suiteTitles']);
  const kill = frozenNumbers('killList', astOf('killList', KILL_LIST), 'CEILINGS',
    ['borderRadius', 'boxShadow', 'rgbaLiterals', 'tintedCallouts']);
  const poolAst = astOf('kindPoolFloorsRegisteredKinds', KIND_POOL_WALKER);
  const poolSrc = readHome('kindPoolFloorsRegisteredKinds', KIND_POOL_WALKER);
  const baseline = ratchetBaseline('frozenKnownFailures');
  const rules = await import('../src/domain/worldPulse/simulationRules.js');
  const news = await import('../src/domain/worldPulse/grammarNews.js');
  const pools = await import('../src/domain/worldPulse/grammarReceiptPools.js');
  const routing = await import('../src/domain/realm/heraldRouting.js');
  const packets = parseOut('validatePackets',
    shell('validatePackets', ['node', 'scripts/implementation-packets.mjs', 'validate']),
    /valid: (\d+) packets \((\d+) READY\)/, 'N packets (M READY)');
  return {
    stampedAt: shell('stampedAt', ['git', 'rev-parse', '--short=8', 'HEAD']).trim(),
    stampedDate: shell('stampedDate', ['git', 'show', '-s', '--format=%cs', 'HEAD']).trim(),
    lightingCensus: lighting.join('/'),
    runtimeTests,
    frozenKnownFailures: Object.keys(baseline.entries).length,
    titleCensus: constNumber('titleCensus', astOf('titleCensus', GUIDANCE_WALKER), 'TITLE_BASELINE'),
    killList: kill.join('/'),
    osrFindings: Number(parseOut('osrFindings',
      shell('osrFindings', ['node', 'scripts/check-observed-shape-readers.mjs']),
      /observed-shape readers: (\d+) finding/, 'N finding(s)')[1]),
    typecheckRatchet: ratchetPair('typecheckRatchet', 'scripts/check-full-typecheck.mjs',
      /\((\d+) error\(s\), ceiling (\d+)\)/, shell),
    strictDomainRatchet: ratchetPair('strictDomainRatchet', 'scripts/check-domain-strict.mjs',
      /\((\d+) errors, ceiling (\d+)\)/, shell),
    hotFiles: Object.fromEntries(Object.entries(HOT_FILES)
      .map(([path, ceiling]) => [path, `${effectiveLines('hotFiles', path)}/${ceiling}`])),
    flagManifestRows: countOf('flagManifestRows', rules.ENGINE_GATED_VIRTUAL_RULE_KEYS),
    grammarKindRegistryRows: countOf('grammarKindRegistryRows', news.GRAMMAR_KIND_REGISTRY),
    grammarReceiptsPools: countOf('grammarReceiptsPools', pools.GRAMMAR_RECEIPTS),
    grammarHeraldKinds: countOf('grammarHeraldKinds', news.GRAMMAR_HERALD_KINDS),
    routedTokens: countOf('routedTokens', routing.EXACT_SECTION),
    kindPoolFloorsRegisteredKinds: constNumber('kindPoolFloorsRegisteredKinds', poolAst, 'REGISTERED_KIND_COUNT'),
    kindPoolFloorsRegisteredMinusRouted: assertionNumber('kindPoolFloorsRegisteredMinusRouted',
      poolAst, poolSrc, 'toBe', 'routedAndRegistered'),
    kindPoolFloorsUnvoicedTokens: constNumber('kindPoolFloorsUnvoicedTokens', poolAst, 'LEGACY_UNVOICED_TOKENS'),
    kindPoolFloorsRegistries: assertionNumber('kindPoolFloorsRegistries', poolAst, poolSrc,
      'toHaveLength', 'REGISTRIES'),
    validatePackets: `${packets[1]} packets / ${packets[2]} READY`,
    voiceMechanicsBankedArms: Object.keys(baseline.entries)
      .filter((id) => id.startsWith(`${VOICE_MECHANICS} ::`)).length,
  };
}

// ── the pure assembler ───────────────────────────────────────────────────────────────────────
function methodOf(readings) {
  return `generated by scripts/base-state-capsule.mjs at ${readings.stampedAt}: every MEASURED row`
    + ' computed from the tree by the measurer its PROVENANCE row names, every PINNED row parsed'
    + ' out of the test that asserts it, and runtimeTests transcribed from the landing\'s own'
    + ' executed test:ratchet receipt through --runtime-tests (the ratchet publishes no total of'
    + ' its own; teaching it to is filed as deferral INFRA-M4)';
}

/** Assemble the artifact. Throws unless PROVENANCE and the emitted key set agree BOTH ways. */
export function capsuleFrom(readings) {
  const declared = Object.keys(PROVENANCE);
  const declaredFigures = declared.filter((row) => PROVENANCE[row].target === 'figure');
  for (const [what, left, right] of [
    ['PROVENANCE and the readings', declared, Object.keys(readings)],
    ['PROVENANCE and FIGURE_ORDER', declaredFigures, [...FIGURE_ORDER]],
  ]) {
    const missing = left.filter((row) => !right.includes(row));
    const undeclared = right.filter((row) => !left.includes(row));
    if (missing.length || undeclared.length) {
      throw new Error(`[base-state-capsule] ${what} disagree`
        + ` — missing [${missing.join(', ')}], undeclared [${undeclared.join(', ')}]`);
    }
  }
  // ⛔ A FIGURE THAT IS undefined DOES NOT LAND AS null — JSON.stringify DELETES THE KEY, so the
  // artifact silently loses a row while every totality check above still agrees. Refuse here.
  const vanishing = FIGURE_ORDER.filter((key) => readings[key] === undefined || readings[key] === null
    || (typeof readings[key] === 'number' && !Number.isFinite(readings[key])));
  if (vanishing.length) {
    throw new Error('[base-state-capsule] these figures would vanish from the artifact rather than'
      + ` land: ${vanishing.join(', ')}`);
  }
  const figures = {};
  for (const key of FIGURE_ORDER) figures[key] = readings[key];
  return {
    schemaVersion: 1,
    stampedAt: readings.stampedAt,
    stampedDate: readings.stampedDate,
    method: methodOf(readings),
    consumptionLaw: CONSUMPTION_LAW,
    figures,
  };
}

// ── the command line ─────────────────────────────────────────────────────────────────────────
function dirtyMeasuredPaths() {
  const porcelain = shellOut('dirty-tree', ['git', 'status', '--porcelain']);
  return porcelain.split('\n').map((line) => line.slice(3).trim()).filter(Boolean)
    .filter((path) => DIRTY_SCOPES.some((scope) => path === scope || path.startsWith(scope)));
}

export async function main(argv, options = {}) {
  const raw = (argv.find((arg) => arg.startsWith('--runtime-tests=')) ?? '').split('=')[1];
  if (!/^\d+$/.test(raw ?? '')) {
    throw new Error('[base-state-capsule] --runtime-tests=<N> is REQUIRED and must be a whole number.'
      + ' Transcribe it from the landing\'s own executed test:ratchet line; this script will not'
      + ' guess it and will not run the suite to find it (deferral INFRA-M4).');
  }
  const runtimeTests = Number(raw);
  const floor = Math.floor(ratchetBaseline('runtimeTests').totalTests * SCOPE_FLOOR_RATIO);
  if (runtimeTests < floor) {
    throw new Error(`[base-state-capsule] --runtime-tests=${runtimeTests} is below the ratchet's own`
      + ` scope floor of ${floor} (baseline totalTests * SCOPE_FLOOR_RATIO ${SCOPE_FLOOR_RATIO}).`);
  }
  const dirty = (options.dirtyMeasuredPaths ?? dirtyMeasuredPaths)();
  if (dirty.length) {
    throw new Error('[base-state-capsule] measured paths are dirty, so a stamp at HEAD would name a'
      + ` tree this run did not measure: ${dirty.join(', ')}`);
  }
  const capsule = capsuleFrom(await (options.readAll ?? readAll)(runtimeTests, options.io));
  writeFileSync(join(ROOT, CAPSULE_PATH), `${JSON.stringify(capsule, null, 2)}\n`, 'utf8');
  return capsule;
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const capsule = await main(process.argv.slice(2));
  console.log(`[base-state-capsule] wrote ${CAPSULE_PATH} stamped at ${capsule.stampedAt}`
    + ` (${Object.keys(capsule.figures).length} figures).`);
}
