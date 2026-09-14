/**
 * scripts/lib/scribe-read-resolution.mjs — WHAT A DESK-LOCAL NAME DENOTES ON A SETTLEMENT
 * (SCRIBE W3c; the chair's brief `brief-scribe-W3c-the-reads-resolve.md`).
 *
 * ── ⛔⛔ THE FINDING THIS MODULE CURES ────────────────────────────────────────────────
 * The wiring census's `reads` column records the DESK'S OWN LOCAL NAMES as the desk-read recipes
 * spell them — `readings.scores`, `axis`, `conflict.intensity`, `link.npcConnections`,
 * `magicWorksAt({ settlement })` — and `scribe-static-card.mjs` carries them verbatim into the
 * static table's `fields`. A settlement has no `readings` key, so `townCard.js`'s `valueAt` walks
 * into nothing: MEASURED on the pinned town over thirteen tabs, 42 of 42 valueless field rows are
 * `unreadable`, and over the whole table 88 of 125 names can never resolve. The card therefore
 * printed UNREADABLE beside about seventy per cent of the corpus's fields while the engine had
 * decided plenty, the writer was told nothing, and arm Q's field licence had no field to license.
 *
 * ── ⭐⭐ WHAT IS RESOLVED, AND WHY IT IS THE RECIPE AND NEVER A HAND TABLE ────────────
 * Five of the six desks are handed a READING BAG built by a recipe: `generalDeskProse`
 * (`src/components/new/generalDeskRead.js`), `economyDeskRead`
 * (`src/components/new/economyDeskRead.js`) and the four bags `scribePage.js` mints for the
 * power, stressor and war/faith desks. The DEFENSE desk is handed the settlement itself and has
 * no bag, which is why its reads already resolve.
 *
 * Every key of every bag is bound to an EXPRESSION, and that expression is the answer to "what
 * settlement path is this name read from". So the bag is read out of the recipe's own syntax tree
 * and each key's expression is resolved through the census's own instruments —
 * `localsOf` + `resolveExpr` + `asEngineField` in `scripts/lib/prose-mark-fields.mjs`, which is
 * what `normaliseRead` already uses for the read column itself. ONE resolver, so the resolution
 * and the reads it resolves cannot disagree about what a name means.
 *
 * ⛔ IT IS STATIC AND NOT A REPLAY OVER A GENERATED TOWN, and the reason is what the static card
 * IS. Its own header says it carries "properties of the CODEBASE and not of any settlement"; a
 * resolution replayed over one generated town would make the committed bytes depend on the
 * generator's determinism and on that town's shape — a town with no `war` key would erase the war
 * resolutions for every town — and `--check` would stop being a repo read. The BINDING is in the
 * source, so the source is what is read. The replay is kept as the VERIFICATION: the suite runs a
 * real settlement through `valueAt` on every `path` row and asserts the reading is reachable.
 *
 * ── THE THREE ANSWERS ────────────────────────────────────────────────────────────────
 *   `path`        a dotted settlement path. `townCard.js` reads the value straight off the blob.
 *   `derived`     a value COMPUTED from named settlement paths. The expression rides with the
 *                 inputs, and the card prints the inputs' values beside it, because a writer that
 *                 is told the inputs has been told what the engine decided even where the reading
 *                 itself is a function of them.
 *   `unresolved`  the resolver could not follow it, WITH THE REASON in `via`. A loop variable over
 *                 a closed vocabulary, a caller's argument the headless page never supplies, and a
 *                 campaign world fact are each different reasons and each is spelled out.
 *
 * Deterministic and read-only: it parses files and returns plain key-sorted data.
 */
import { parse } from 'espree';

import {
  ROOT, parseFile, srcOf, walk, functionsOf, localsOf, resolveExpr, asEngineField, stripWrappers,
} from './prose-mark-fields.mjs';

/** Where the headless renderer mints four of the five bags. */
export const SCRIBE_PAGE = 'src/domain/prose/scribePage.js';

/**
 * ⭐ THE READING-BAG RECIPES, A NAMED TABLE (the estate's `WORLD_ONLY_READINGS` discipline: a
 * list a reader can check against the source, never a scan that guesses).
 *
 * `file`/`fn` is the recipe; `callee`/`argIndex` is the desk call whose argument IS the bag.
 * `optionsFrom` are the CALL SITES that supply the recipe's own `options`, in the order they are
 * consulted: a key bound to `options.x` is resolved a second time against the argument the caller
 * passes at that key, in the CALLER's own locals. That hop is what turns `options.populationTrend`
 * into `populationTrendBand(settlement.populationHistory)`.
 *
 * ⛔ TWO WAR/FAITH RECIPES FOR ONE DESK, because `WarTab` and `FaithTab` hand it different halves
 * of one bag (`scribePage.js` says so in terms at `warFaithOf`). Both are read and the keys are
 * unioned; a key in both must resolve the same way or the union names the disagreement.
 * @type {ReadonlyArray<{desk: string, file: string, fn: string, callee: string, argIndex: number,
 *   optionsFrom: ReadonlyArray<{file: string, callee: string, argIndex: number}>}>}
 */
export const READ_RECIPES = Object.freeze([
  Object.freeze({
    desk: 'general',
    file: 'src/components/new/generalDeskRead.js',
    fn: 'generalDeskProse',
    callee: 'generalStateProse',
    argIndex: 1,
    optionsFrom: Object.freeze([
      // `generalOf` in the renderer, which mints the bag every tab shares …
      Object.freeze({ file: SCRIBE_PAGE, callee: 'generalDeskProse', argIndex: 1 }),
      // … and the per-tab `extra` each renderer adds on top of it.
      Object.freeze({ file: SCRIBE_PAGE, callee: 'generalOf', argIndex: 2 }),
    ]),
  }),
  Object.freeze({
    desk: 'economy',
    file: 'src/components/new/economyDeskRead.js',
    fn: 'economyDeskRead',
    callee: 'economyStateProse',
    argIndex: 1,
    optionsFrom: Object.freeze([
      Object.freeze({ file: SCRIBE_PAGE, callee: 'economyDeskRead', argIndex: 1 }),
    ]),
  }),
  Object.freeze({
    desk: 'power',
    file: SCRIBE_PAGE,
    fn: 'powerOf',
    callee: 'power.powerStateProse',
    argIndex: 1,
    optionsFrom: Object.freeze([]),
  }),
  Object.freeze({
    desk: 'stressors',
    file: SCRIBE_PAGE,
    fn: 'stressorsOf',
    callee: 'stressors.stressorsStateProse',
    argIndex: 1,
    optionsFrom: Object.freeze([]),
  }),
  Object.freeze({
    desk: 'warFaith',
    file: SCRIBE_PAGE,
    fn: 'renderWar',
    callee: 'warFaithOf',
    argIndex: 2,
    optionsFrom: Object.freeze([]),
  }),
  Object.freeze({
    desk: 'warFaith',
    file: SCRIBE_PAGE,
    fn: 'renderFaith',
    callee: 'warFaithOf',
    argIndex: 2,
    optionsFrom: Object.freeze([]),
  }),
]);

/**
 * ⭐ THE NAMES THE RESOLVER CANNOT REACH FROM A BAG, EACH WITH THE REASON — a named table for the
 * same cause as `READ_RECIPES`. These are DESK LOCALS bound by the desk's own body (a loop
 * variable, a caller's argument), not keys of any reading bag, so no recipe holds them. Saying
 * WHY is the whole value: "the card cannot read this" and "this is one of five closed axis words"
 * are different facts, and only the second lets a writer write.
 * @type {ReadonlyArray<{name: string, why: string}>}
 */
export const DESK_LOCAL_NOTES = Object.freeze([
  Object.freeze({
    name: 'axis',
    why: 'the loop variable of `SCORE_AXES.map((axis) => …)` in generalStateProse.js: a closed'
      + ' vocabulary of score axes, not a settlement field. THIS POOL\'S OWN KEY NAMES THE AXIS,'
      + ' and every axis\'s score is in `readings.scores` above',
  }),
  Object.freeze({
    name: 'conflict',
    why: 'the loop variable over the conflict rows the desk is handed; the rows themselves are'
      + ' `conflicts`, and this reading is one row of that list',
  }),
  Object.freeze({
    name: 'link',
    why: 'the loop variable over the neighbour links the RELATIONSHIPS tab assembles and passes'
      + ' in; the headless page builds that list from `neighbourNetwork` and'
      + ' `neighborRelationship`, and a link is one row of it',
  }),
  Object.freeze({
    name: 'row',
    why: 'the loop variable over the steading or engagement rows the tab passes in; on a town'
      + ' with no campaign the list is empty and the pool does not fire',
  }),
  Object.freeze({
    name: 'structureKey',
    why: 'a CALLER\'S ARGUMENT and not a settlement field — `defenseCriminalProse(settlement,'
      + ' structureKey, options)` takes it from `deriveCriminalStructure(settlement).key`, which'
      + ' the page prints beside the pool as the criminal-structure badge',
  }),
  Object.freeze({
    name: 'score',
    why: 'the score at the axis this pool names, read from `readings.scores`',
  }),
]);

/** A field spelling that is a plain dotted chain and nothing else. */
const PLAIN_CHAIN = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/;

/**
 * The array methods a desk chains onto a reading. The census records the chain whole
 * (`readings.notableAbsences.map`), and the READING is the collection: a card that printed the
 * method would hand the model a function where the engine holds a list. The list is the answer
 * and `via` says the method was chained.
 * ⛔ `length` IS NOT HERE. It is a value, `valueAt` walks it, and `relationships.length` is a
 * number a writer can use — which is exactly the difference this list is drawing.
 * @type {ReadonlyArray<string>}
 */
export const CHAINED_METHODS = Object.freeze([
  'map', 'filter', 'find', 'reduce', 'some', 'every', 'includes', 'slice', 'join', 'trim', 'sort',
  'flatMap', 'concat', 'indexOf',
]);

/**
 * ⭐ THE CENSUS'S DECORATIONS, STRIPPED — a named table, one row per SHAPE, each naming a field
 * of the committed static table it fixes.
 *
 * ⛔⛔ WHY THEY EXIST AT ALL AND WHY THEY ARE NOT CURED UPSTREAM. `normaliseRead` resolves an
 * expression to its text and `pulseKeyOf` then cuts it at the first `[`, so a defensive idiom the
 * census's own `stripWrappers` does not know survives into the field name — truncated, and
 * sometimes with a property chained onto the wrong half (`readings.politics ?? null.blocs`). The
 * cure is NOT to widen `stripWrappers`: that function is what builds the committed static table's
 * 125 names, and widening it would re-spell the table, move `townCard.js`'s golden on every tab
 * and move the card's join key for every consumer — a re-take of the measurement this car is
 * measured against. So the decorations are peeled HERE, where only the resolution reads them.
 * @type {ReadonlyArray<{name: string, re: RegExp, to: string, fixes: string}>}
 */
export const CENSUS_DECORATIONS = Object.freeze([
  Object.freeze({
    name: 'a truncated array guard',
    re: /^Array\.isArray\((.+?)\)\s*\?\s*\1\s*:\s*$/,
    to: '$1',
    fixes: 'Array.isArray(readings.conditions) ? readings.conditions : ',
  }),
  Object.freeze({
    name: 'a truncated object guard',
    re: /^(.+?)\s*&&\s*typeof\s+\1\s*===\s*'object'\s*\n?\s*\?\s*\1\s*\n?\s*:\s*(?:null|undefined|\{\})(\.[\w$.]+)?$/,
    to: '$1$2',
    fixes: "readings.ancientRuin && typeof readings.ancientRuin === 'object'\n    ? readings.ancientRuin : null.name",
  }),
  Object.freeze({
    name: 'a typeof object guard with a cast comment',
    re: /^typeof\s+(.+?)\s*===\s*'object'\s*&&\s*\1\s*!==\s*null\s*\n?\s*\?\s*\1\s*\n?\s*:\s*\/\*\*[\s\S]*?\*\/\s*\(\{\}\)(\.[\w$.]+)?$/,
    to: '$1$2',
    fixes: "typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null\n"
      + "    ? power.publicLegitimacy\n    : /** @type {PublicLegitimacyView} */ ({}).govMultiplier",
  }),
  Object.freeze({
    name: 'a nullish default with a property chained onto the default',
    re: /^(.+?)\s*\?\?\s*null(\.[\w$.]+)?$/,
    to: '$1$2',
    fixes: 'readings.politics ?? null.blocs',
  }),
  Object.freeze({
    name: 'a truthiness test read as a field',
    re: /^(.+?)\s*===\s*(?:true|false)$/,
    to: '$1',
    fixes: 'readings.hasPatron === true',
  }),
  Object.freeze({
    name: 'a negation read as a field',
    re: /^!+([A-Za-z_$][\w$.]*)$/,
    to: '$1',
    fixes: '!hasPatron',
  }),
]);

/**
 * Peel the census's decorations off one field spelling, and say which chained method (if any)
 * was taken off the tail.
 * @param {string} name a static-table field spelling
 * @returns {{name: string, method: string, peeled: string[]}}
 */
export function peelDecorations(name) {
  let out = String(name ?? '').trim();
  /** @type {string[]} */
  const peeled = [];
  for (let pass = 0; pass < 4; pass += 1) {
    const before = out;
    for (const row of CENSUS_DECORATIONS) {
      const next = out.replace(row.re, row.to).trim();
      if (next !== out) { out = next; if (!peeled.includes(row.name)) peeled.push(row.name); }
    }
    // A defensive idiom the census's own stripper knows, re-applied to what is left.
    out = stripWrappers(out);
    if (out === before) break;
  }
  let method = '';
  const tail = /^(.+)\.([A-Za-z_$][\w$]*)$/.exec(out);
  if (tail && CHAINED_METHODS.includes(tail[2])) { method = tail[2]; out = tail[1]; }
  return { name: out, method, peeled };
}

/**
 * The (key, value-node) pairs of a reading bag, however the recipe spells it: an object literal,
 * `Object.fromEntries([[k, v], …])` (the spelling every module under `src/domain/**` is forced
 * into by the census's producer walk), `Object.assign(a, b)` and a `cond ? bag : {}` guard.
 * ⛔ IT RETURNS THE BINDING'S SOURCE TEXT AND NOT ITS NODE, and that is a defect this car
 * produced and caught. A bag bound to a LOCAL is re-parsed out of the local's initialiser, so its
 * nodes carry ranges into a DIFFERENT string; a caller slicing them against the file's source read
 * the file's own header comment as an expression, and the power desk's four keys came back as
 * `TEXT IN P` and `A\n * BROWSER (W0 deliver`. Text is the honest return: one string, one origin.
 * @param {object|null} node @param {string} source
 * @param {Map<string, string>} [locals]
 * @returns {Array<[string, string]>} key -> the binding's source text
 */
export function bagPairs(node, source, locals = new Map()) {
  if (!node) return [];
  // ⛔ A BAG BOUND TO A LOCAL FIRST. `powerOf` and `renderWar` build the bag into `const readings`
  // and hand the NAME over, so the argument node is an Identifier and the literal is the local's
  // own initialiser. Measured: without this hop the power desk resolved ZERO keys and every
  // `readings.war.*` row stayed unresolved, which is two of the five bags.
  if (node.type === 'Identifier' && locals.has(node.name)) {
    const init = `(${locals.get(node.name)})`;
    /** @type {object} */
    let ast;
    try { ast = parse(init, { ecmaVersion: 2024, sourceType: 'module', range: true }); } catch { return []; }
    return bagPairs(ast.body[0].expression, init, new Map());
  }
  if (node.type === 'ObjectExpression') {
    return node.properties
      .filter((p) => p.type === 'Property' && !p.computed)
      .map((p) => [String(p.key.name ?? p.key.value ?? ''), srcOf(p.value, source)]);
  }
  if (node.type === 'ConditionalExpression') {
    return [...bagPairs(node.consequent, source, locals), ...bagPairs(node.alternate, source, locals)];
  }
  if (node.type !== 'CallExpression' || node.callee.type !== 'MemberExpression') return [];
  const owner = node.callee.object;
  const method = node.callee.property?.name;
  if (owner.type !== 'Identifier' || owner.name !== 'Object') return [];
  if (method === 'assign') return node.arguments.flatMap((a) => bagPairs(a, source, locals));
  if (method !== 'fromEntries') return [];
  const list = node.arguments[0];
  if (!list || list.type !== 'ArrayExpression') return [];
  /** @type {Array<[string, string]>} */
  const out = [];
  for (const entry of list.elements) {
    if (!entry || entry.type !== 'ArrayExpression' || entry.elements.length < 2) continue;
    const key = entry.elements[0];
    if (!key || key.type !== 'Literal') continue;
    out.push([String(key.value), srcOf(entry.elements[1], source)]);
  }
  return out;
}

/**
 * ⭐ THE LOCALS OF A FUNCTION, WITH THE ONE SHAPE `localsOf` CANNOT SEE.
 *
 * ⛔ MEASURED IN `powerOf`: `let contenders = null; try { contenders = coupContenders(s); } catch`.
 * `localsOf` records DECLARATORS, so the binding it holds is the literal `null` and the power
 * desk's `contenders` and `riskLabel` resolved to `null` and `coupRiskLabel(null)` — two rows that
 * SAY the engine decided nothing where it decides a contender list. A later assignment to a name
 * whose declaration is `null` or `undefined` is the real binding, and it is taken; an assignment
 * over a real initialiser is NOT, because that is a reassignment and which one a reader sees
 * depends on control flow the resolver does not follow.
 * @param {object} fn @param {string} source
 * @returns {{locals: Map<string, string>, params: string[]}}
 */
function localsWithAssignments(fn, source) {
  const { locals, params } = localsOf(fn, source);
  walk(fn.body, (node) => {
    if (node.type !== 'AssignmentExpression' || node.operator !== '=') return undefined;
    if (node.left.type !== 'Identifier') return undefined;
    const held = locals.get(node.left.name);
    if (held !== undefined && !/^(null|undefined)$/.test(String(held).trim())) return undefined;
    locals.set(node.left.name, srcOf(node.right, source));
    return undefined;
  });
  return { locals, params };
}

/** The first call to `callee` (dotted names allowed) inside a function body. */
function callTo(fnBody, callee) {
  /** @type {object|null} */
  let found = null;
  walk(fnBody, (node) => {
    if (found) return false;
    if (node.type === 'CallExpression' && srcOfCallee(node) === callee) { found = node; return false; }
    return undefined;
  });
  return found;
}

/** A call's callee spelled as a dotted name, or '' where it is not a plain name. */
function srcOfCallee(node) {
  const c = node.callee;
  if (c.type === 'Identifier') return c.name;
  if (c.type === 'MemberExpression' && !c.computed
    && c.object.type === 'Identifier' && c.property.type === 'Identifier') {
    return `${c.object.name}.${c.property.name}`;
  }
  return '';
}

/**
 * ⭐ THE SETTLEMENT PATHS AN EXPRESSION READS — the longest member chain at every position that
 * resolves to the recipe's own settlement root. `producerReads`' walk, run over ONE expression
 * rather than a whole function, so a derived reading names its inputs rather than hiding them.
 * @param {string} text @param {Map<string, string>} locals @param {Record<string, string>} aliases
 * @returns {string[]} sorted engine fields
 */
export function inputsOf(text, locals, aliases) {
  /** @type {Set<string>} */
  const out = new Set();
  for (const { chain } of plainChains(text)) {
    const resolved = resolveExpr(chain, locals, aliases);
    if (!/^settlement\./.test(resolved)) continue;
    const field = asEngineField(resolved);
    if (PLAIN_CHAIN.test(field)) out.add(field);
  }
  return [...out].sort();
}

/**
 * ⭐ EVERY MAXIMAL PLAIN CHAIN INSIDE AN EXPRESSION, with its span.
 *
 * ⛔ "THE LONGEST CHAIN ONLY" IS NOT "SKIP ANY CHAIN WITH A MEMBER PARENT", and the difference is
 * a measured miss. `(r.powerStructure.factions).find(…).faction` has a MemberExpression at the top
 * whose object is a CALL, so every inner chain had a member parent and the walk took none of them:
 * the general desk's `govFaction` came back with no inputs and with the desk's own letter `r` in
 * the expression the model reads. A chain is maximal when its PARENT is not itself a plain chain.
 * @param {string} text
 * @returns {Array<{from: number, to: number, chain: string}>} spans into `(${text})`
 */
export function plainChains(text) {
  const wrapped = `(${String(text)})`;
  /** @type {object} */
  let ast;
  try { ast = parse(wrapped, { ecmaVersion: 2024, sourceType: 'module', range: true }); } catch { return []; }
  const isChain = (node) => node && (node.type === 'Identifier' || node.type === 'MemberExpression'
    || node.type === 'ChainExpression')
    && /^[A-Za-z_$][\w$?.]*$/.test(wrapped.slice(node.range[0], node.range[1]));
  /** @type {Array<{from: number, to: number, chain: string}>} */
  const out = [];
  walk(ast, (node, ancestors) => {
    if (!isChain(node)) return undefined;
    const parent = ancestors[ancestors.length - 1];
    if (parent && parent.type === 'Property' && parent.key === node) return false;
    if (isChain(parent)) return false;
    out.push({ from: node.range[0], to: node.range[1], chain: wrapped.slice(node.range[0], node.range[1]) });
    return false;
  });
  return out;
}

/** rec() with sorted computed keys, the estate's one record builder in this file. */
const rec = (pairs) => Object.fromEntries(
  pairs.filter(([, v]) => v !== undefined).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)),
);

/**
 * Resolve one bound expression against a function's locals and settlement root.
 * @param {string} text @param {Map<string, string>} locals @param {Record<string, string>} aliases
 * @param {string} via a sentence naming where the binding was read
 * @returns {{kind: string, path: string, expr: string, inputs: string[], via: string}}
 */
export function resolveBinding(text, locals, aliases, via) {
  // ⛔ THE HEAD-RESOLVED TEXT FIRST, AND EVERYTHING AFTER IT IS COMPUTED FROM THAT. A binding is
  // very often a bare local name (`readings`, `war`, `banners`, `neighbours`), and rendering the
  // NAME rather than what the name is bound to produced a measured false answer: the general
  // desk's `neighbours` came back as the settlement path `neighbours`, which no settlement has,
  // because the identifier survived to the plain-chain test unresolved.
  const raw = resolveExpr(text, locals, aliases);
  const resolved = asEngineField(raw);
  if (PLAIN_CHAIN.test(resolved) && !resolved.startsWith('options.')
    && !/^(Math|Number|Object|Array|String|JSON|null|undefined|true|false)\b/.test(resolved)) {
    return rec([['kind', 'path'], ['path', resolved], ['expr', ''], ['inputs', []], ['via', via]]);
  }
  if (/^options\./.test(resolved)) {
    return rec([['kind', 'option'], ['path', ''], ['expr', resolved], ['inputs', []], ['via', via]]);
  }
  return rec([
    ['kind', 'derived'], ['path', ''], ['expr', renderExpr(raw, locals, aliases) || oneLine(raw)],
    ['inputs', inputsOf(raw, locals, aliases)], ['via', via],
  ]);
}

/**
 * ⭐ THE EXPRESSION AS THE MODEL SHOULD SEE IT — every chain inside it rewritten to the settlement
 * path it denotes, so `(r.powerStructure.factions).find(…)` reads
 * `(settlement.powerStructure.factions).find(…)` and a reader of the card is never shown a desk's
 * private letter as if it were a field. Falls back to the head-only resolution on a parse failure.
 * @param {string} text @param {Map<string, string>} locals @param {Record<string, string>} aliases
 * @returns {string}
 */
export function renderExpr(text, locals, aliases) {
  const wrapped = `(${String(text)})`;
  const spans = plainChains(text);
  if (!spans.length) return '';
  let out = wrapped;
  for (const { from, to, chain } of [...spans].sort((a, b) => b.from - a.from)) {
    const resolved = resolveExpr(chain, locals, aliases);
    if (resolved !== chain && /^settlement\b/.test(resolved)) out = out.slice(0, from) + resolved + out.slice(to);
  }
  return oneLine(out.slice(1, -1));
}

/**
 * ⭐⭐ EVERY READING BAG, RESOLVED — one record per desk, `key -> resolution`.
 * @returns {{desks: Record<string, Record<string, object>>, conflicts: string[]}}
 */
export function resolveReadingBags() {
  /** @type {Record<string, Record<string, object>>} */
  const desks = {};
  /** @type {string[]} */
  const conflicts = [];
  for (const spec of READ_RECIPES) {
    const file = parseFile(spec.file);
    const fn = functionsOf(file.ast).get(spec.fn);
    if (!fn) throw new Error(`scribe-read-resolution: no function ${spec.fn} in ${spec.file}`);
    const { locals, params } = localsWithAssignments(fn, file.source);
    const aliases = Object.fromEntries([[params[0] || 'settlement', 'settlement']]);
    const call = callTo(fn.body, spec.callee);
    if (!call) throw new Error(`scribe-read-resolution: ${spec.fn} does not call ${spec.callee}`);
    const options = optionTable(spec);
    const held = desks[spec.desk] || (desks[spec.desk] = {});
    for (const [key, raw] of bagPairs(call.arguments[spec.argIndex], file.source, locals)) {
      // ⭐ THE CALLER'S ARGUMENT SUBSTITUTED BEFORE THE RESOLVE, so a key bound to a LOCAL that
      // reads an option (`stresses`, whose init is `(Array.isArray(options.stresses) ? … )`)
      // resolves with the caller's own expression in it and names its settlement inputs.
      const text = substituteOptions(raw, options);
      const via = `the ${spec.desk} desk's reading bag, key \`${key}\` = \`${oneLine(raw)}\` in ${spec.fn}`;
      let row = resolveBinding(text, substituteLocals(locals, options), aliases, via);
      if (row.kind === 'option') {
        const optionKey = (/^options\.([A-Za-z_$][\w$]*)/.exec(row.expr) || [])[1] || '';
        const supplied = options.get(optionKey) || null;
        row = supplied ? rec([
          ['kind', supplied.kind], ['path', supplied.path], ['expr', supplied.expr],
          ['inputs', supplied.inputs], ['via', `${via}, ${supplied.via}`],
        ]) : rec([
          ['kind', 'unresolved'], ['path', ''], ['expr', row.expr], ['inputs', []],
          ['via', `${via}, which no call site of ${spec.fn} supplies`],
        ]);
      }
      const prior = held[key];
      // ⛔ THE READING IS COMPARED AND NOT THE SENTENCE. `hasPatron` is bound by BOTH war/faith
      // recipes to the same expression and read `via renderWar` / `via renderFaith`; comparing the
      // whole row called that a disagreement and unresolved two live rows.
      if (prior && sameReading(prior) !== sameReading(row)) {
        conflicts.push(`${spec.desk}::${key}`);
        continue;
      }
      held[key] = row;
    }
  }
  return { desks, conflicts: [...new Set(conflicts)].sort() };
}

/** One line of source, for a `via` sentence. */
const oneLine = (text) => String(text).replace(/\s*\n\s*/g, ' ').trim();

/** What a resolution SAYS, without the sentence saying where it was read. @see resolveReadingBags */
const sameReading = (row) => JSON.stringify([row.kind, row.path, row.expr, row.inputs]);

/**
 * The text a supplied option denotes, spelled with the settlement root back on so the callee's
 * own resolver can walk it: a `path` row is `settlement.<path>`, everything else is its expression.
 * @param {{kind: string, path: string, expr: string}} row
 */
const optionText = (row) => (row.kind === 'path' ? `settlement.${row.path}` : row.expr);

/**
 * Replace every `options.<key>` the caller supplies with what the caller passes there.
 * @param {string} text @param {Map<string, object>} options
 */
export function substituteOptions(text, options) {
  let out = String(text);
  for (const [key, row] of options) {
    out = out.replace(new RegExp(`(?<![\\w$.])options\\.${key}(?![\\w$])`, 'g'), `(${optionText(row)})`);
  }
  return out;
}

/** The same substitution applied to every local binding, so a local that reads an option resolves. */
function substituteLocals(locals, options) {
  if (options.size === 0) return locals;
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const [name, init] of locals) out.set(name, substituteOptions(init, options));
  return out;
}

/**
 * The options a recipe's call sites supply, resolved in the CALLER's own locals — the second hop
 * that turns `options.populationTrend` into `populationTrendBand(settlement.populationHistory)`.
 * @param {{optionsFrom: ReadonlyArray<{file: string, callee: string, argIndex: number}>}} spec
 * @returns {Map<string, object>}
 */
function optionTable(spec) {
  /** @type {Map<string, object>} */
  const out = new Map();
  for (const site of spec.optionsFrom) {
    const file = parseFile(site.file);
    for (const [name, fn] of functionsOf(file.ast)) {
      const call = callTo(fn.body, site.callee);
      if (!call) continue;
      const { locals, params } = localsWithAssignments(fn, file.source);
      const aliases = Object.fromEntries([[params[0] || 'settlement', 'settlement']]);
      for (const [key, text] of bagPairs(call.arguments[site.argIndex], file.source, locals)) {
        if (out.has(key)) continue;
        out.set(key, resolveBinding(text, locals, aliases,
          `supplied by \`${name}\` in ${site.file} as \`${key}: ${oneLine(text)}\``));
      }
    }
  }
  return out;
}

/**
 * ⭐⭐ THE RESOLUTION COLUMN — one row per static-table field name.
 *
 * A name is peeled of the census's decorations, split into its bag key and the tail chained onto
 * it, and answered from the reading bags. A name that is already a settlement path answers itself
 * (it always resolved, and saying so is what makes the column total rather than partial).
 * @param {ReadonlyArray<string>} names the static table's own field spellings
 * @returns {Record<string, {kind: string, path: string, expr: string, inputs: string[], via: string}>}
 */
export function readResolution(names, deskFiles = []) {
  const { desks, conflicts } = resolveReadingBags();
  const notes = new Map(DESK_LOCAL_NOTES.map((row) => [row.name, row.why]));
  const deskLocals = deskLocalTable(deskFiles, desks, notes, conflicts);
  /** @type {Array<[string, object]>} */
  const rows = [];
  for (const name of names) {
    rows.push([name, resolveOne(name, desks, deskLocals, notes, conflicts)]);
  }
  rows.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return Object.fromEntries(rows);
}

/**
 * ⭐⭐ THE DESK'S OWN LOCALS, RESOLVED — the second half of the census's spelling.
 *
 * ⛔ MEASURED. Six of the 125 names are rooted at a name the DESK BODY binds rather than at a
 * reading or a settlement key: `power` (`const power = settlement?.powerStructure || {}` in
 * powerStateProse.js:882) carries five of them and `hist` (generalStateProse.js:1868) the sixth.
 * Without this sweep they passed the plain-chain test and were published as the settlement paths
 * `power.publicLegitimacy.*` and `hist.historicalEvents` — paths NO SETTLEMENT HAS, which is a
 * false fact on the card and exactly what this whole boundary exists to prevent. The replay arm in
 * `tests/domain/townCard.test.js` is what convicted them.
 *
 * ⛔ A NAME TWO DESKS BIND DIFFERENTLY IS DROPPED rather than decided: the field spelling does not
 * say which desk read it, so the honest answer is to leave it to the branches below.
 * @param {ReadonlyArray<string>} deskFiles repo-relative desk sources
 * @param {Record<string, Record<string, object>>} desks @param {Map<string, string>} notes
 * @param {ReadonlyArray<string>} conflicts
 * @returns {Map<string, object>}
 */
export function deskLocalTable(deskFiles, desks, notes, conflicts) {
  /** @type {Map<string, object>} */
  const out = new Map();
  /** @type {Set<string>} */
  const dropped = new Set();
  for (const rel of [...new Set(deskFiles)]) {
    const file = parseFile(rel);
    for (const [fnName, fn] of functionsOf(file.ast)) {
      const { locals, params } = localsWithAssignments(fn, file.source);
      const aliases = Object.fromEntries([[params[0] || 'settlement', 'settlement']]);
      for (const [local, init] of locals) {
        if (desks.general?.[local] || notes.has(local) || dropped.has(local)) continue;
        const bound = resolveBinding(init, locals, aliases, '');
        const text = bound.kind === 'path' ? bound.path : bound.expr;
        const row = resolveOne(text, desks, new Map(), notes, conflicts);
        if (row.kind === 'unresolved') continue;
        const via = `the desk binds \`${local} = ${oneLine(init)}\` in ${fnName} (${rel}), ${row.via}`;
        const held = rec([
          ['kind', row.kind], ['path', row.path], ['expr', row.expr], ['inputs', row.inputs],
          ['via', via],
        ]);
        const prior = out.get(local);
        if (prior && sameReading(prior) !== sameReading(held)) { out.delete(local); dropped.add(local); continue; }
        if (!prior) out.set(local, held);
      }
    }
  }
  return out;
}

/** The `unresolved` row, with its reason. */
const unresolved = (expr, why) => rec([
  ['kind', 'unresolved'], ['path', ''], ['expr', expr], ['inputs', []], ['via', why],
]);

/**
 * One name's resolution. Split out so the classes read as the list they are.
 * @param {string} name @param {Record<string, Record<string, object>>} desks
 * @param {Map<string, string>} notes @param {ReadonlyArray<string>} conflicts
 */
function resolveOne(name, desks, deskLocals, notes, conflicts) {
  const { name: peeled, method } = peelDecorations(name);
  const withMethod = (row) => (method === '' ? row : rec([
    ['kind', row.kind], ['path', row.path], ['expr', row.expr], ['inputs', row.inputs],
    ['via', `${row.via}; the desk chains \`.${method}\` onto it and the reading is the collection`],
  ]));

  // (1) THE WHOLE BAG. `readings` alone is not a reading: it is every reading the desk was handed,
  // and a card that answered it with one value would be answering a question nobody asked.
  if (peeled === 'readings') {
    return withMethod(unresolved('readings',
      'the desk\'s whole reading bag rather than one reading; the pool\'s other rows name the'
      + ' readings its key actually turns on'));
  }
  // `readings.` is the name every desk but DEFENSE gives the bag it is handed.
  const bare = peeled.startsWith('readings.') ? peeled.slice('readings.'.length) : peeled;
  const head = bare.split('.')[0];
  const tail = bare.slice(head.length);

  // (2) A READING-BAG KEY, resolved through the recipe that binds it. Asked BEFORE the plain-path
  // test because a bag key and a settlement root can share a word (`institutions`, `tier`,
  // `history`), and on every one of them the recipe binds the key TO that path, so the two
  // answers agree and the recipe is the one with the receipt.
  const found = [];
  for (const [desk, bag] of Object.entries(desks)) if (bag[head]) found.push([desk, bag[head]]);
  if (found.length) {
    const [desk, row] = found[0];
    if (conflicts.includes(`${desk}::${head}`)) {
      return withMethod(unresolved(peeled,
        `the key \`${head}\` is bound differently by two recipes of the ${desk} desk`));
    }
    const suffix = found.length > 1 ? ` (and by ${found.length - 1} other desk to the same reading)` : '';
    if (row.kind === 'path') {
      return withMethod(rec([
        ['kind', 'path'], ['path', `${row.path}${tail}`], ['expr', ''], ['inputs', []],
        ['via', `${row.via}${suffix}`],
      ]));
    }
    if (row.kind === 'derived') {
      return withMethod(rec([
        ['kind', 'derived'], ['path', ''], ['expr', `${row.expr}${tail}`],
        ['inputs', row.inputs], ['via', `${row.via}${suffix}`],
      ]));
    }
    return withMethod(unresolved(`${row.expr}${tail}`, `${row.via}${suffix}`));
  }

  // (3) A LOCAL THE DESK BODY BINDS — `power`, `hist`. See `deskLocalTable` for the six names
  // this takes and for the false settlement paths it was added to stop publishing.
  const bound = deskLocals.get(head);
  if (bound) {
    if (bound.kind === 'path') {
      return withMethod(rec([
        ['kind', 'path'], ['path', `${bound.path}${tail}`], ['expr', ''], ['inputs', []],
        ['via', bound.via],
      ]));
    }
    return withMethod(rec([
      ['kind', 'derived'], ['path', ''], ['expr', `${bound.expr}${tail}`],
      ['inputs', bound.inputs], ['via', bound.via],
    ]));
  }

  // (4) A DESK LOCAL no recipe binds, with the reason it cannot be one.
  if (notes.has(head)) return withMethod(unresolved(peeled, notes.get(head)));

  // (5) A NAME THE CENSUS RECORDED ROOTED AT THE SETTLEMENT ALREADY. These are the rows that
  // resolved before this car; the column says so rather than leaving them blank, because a column
  // with holes in it cannot be told from a column that was never built.
  if (PLAIN_CHAIN.test(peeled) && !peeled.startsWith('readings.')) {
    return withMethod(rec([
      ['kind', 'path'], ['path', peeled], ['expr', ''], ['inputs', []],
      ['via', 'the census recorded a settlement path and the card reads it as one'],
    ]));
  }

  // (6) AN EXPRESSION the census recorded whole — a reader the desk calls on the settlement.
  return withMethod(resolveExpression(peeled));
}

/**
 * An expression the census recorded as a field — `magicWorksAt({ settlement })`,
 * `prosperityRank(settlement.economicState.prosperity)`, `standingDefenseForces(settlement)`.
 * It is a DERIVED reading whose inputs are the settlement paths inside the call.
 * @param {string} text
 */
function resolveExpression(text) {
  if (!/[(]/.test(text)) {
    return unresolved(text, 'the census recorded a name this card cannot root at a settlement');
  }
  /** @type {string[]} */
  const inputs = [];
  for (const m of String(text).matchAll(/settlement\.([A-Za-z_$][\w$.]*)/g)) {
    const field = m[1].replace(/\.$/, '');
    if (!inputs.includes(field)) inputs.push(field);
  }
  return rec([
    ['kind', 'derived'], ['path', ''], ['expr', text], ['inputs', inputs.sort()],
    ['via', 'a reader the desk calls on the settlement; the engine computes this reading rather'
      + ' than storing it, so the inputs are what the card can state'],
  ]);
}

export { ROOT };
