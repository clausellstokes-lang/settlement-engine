#!/usr/bin/env node
/**
 * scripts/sibling-string-pack.mjs — THE SIBLING MACHINE SENTENCES OF THE DEFENSE TAB, PACKED
 * (brief ADDENDUM 18 ruling 4: the marker's card lists "the sibling machine sentences that fire
 * on the same key"; ruling 6: the refuter reads the rendered page).
 *
 *   node scripts/sibling-string-pack.mjs [--out docs/content/sibling-string-pack.json] [--print]
 *
 * An espree walk of the three non-corpus producers on the Defense tab —
 * `src/domain/display/threatAssessment.js`, `src/domain/display/defenseDisplay.js`,
 * `src/generators/safetyProfile.js` — recording every string literal, template and
 * concatenation that reaches the page, with:
 *   • the PRODUCER (enclosing function) and the SINK (the variable, property or call the text
 *     lands in: `assess`, `note`, `safetyDesc`, `guardEffectivenessDesc`, `fundingNote`, ...);
 *   • file:line;
 *   • the PREDICATE CHAIN, outermost first: every enclosing IfStatement test (negated where the
 *     text sits in the alternate, and the negations of every earlier arm of an else-if ladder)
 *     and every enclosing ConditionalExpression test, as SOURCE TEXT and as ENGINE FIELDS;
 *   • the CLOCK of each field in the predicate (from the writer census, parsed once).
 * For safetyProfile's template literals the template is kept with its `${...}` slots and each
 * slot's TERNARY TABLE is listed (the branches, never the expansion).
 *
 * Deterministic; read-only except the --out file. Default --out is
 * docs/content/sibling-string-pack.json.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import {
  ROOT, parseFile, walk, srcOf, functionsOf, localsOf, resolveExpr, asEngineField, memberChain,
  parsePulseTree, frozenFieldCensus, clockOf, stripWrappers,
} from './lib/prose-mark-fields.mjs';

/**
 * THE THREE PRODUCERS and how their parameter roots spell as engine fields.
 *   threatAssessment / defenseDisplay take the settlement; their locals resolve to
 *   `defenseProfile.*`, `economicState.*`, `config.*`, `institutions`.
 *   safetyProfile is GENERATION-TIME: `(config, tier, institutions)`, with `inst.has*` from
 *   `getInstFlags(config, institutions)` — its OUTPUT strings are stored on
 *   `economicState.safetyProfile.*` and never rewritten (the census says FROZEN).
 */
export const PRODUCER_FILES = Object.freeze([
  Object.freeze({ rel: 'src/domain/display/threatAssessment.js', roots: null, stored: null }),
  Object.freeze({ rel: 'src/domain/display/defenseDisplay.js', roots: null, stored: null }),
  Object.freeze({
    rel: 'src/generators/safetyProfile.js',
    roots: { config: 'config', tier: 'config.settType(tier)', institutions: 'institutions@generation' },
    stored: 'economicState.safetyProfile',
  }),
]);

/** Sinks whose text reaches the Defense page (the tab prints these; the rest are kept but flagged). */
export const PAGE_SINKS = Object.freeze([
  'assess', 'mon', 'mil', 'intA', 'econA', 'disA', 'fundingNote', 'note', 'status', 'label',
  'safetyLabel', 'safetyDesc', 'guardEffectivenessDesc', 'safetyDescs', 'safetyStrains',
  'curfewAuthority', 'milRef', 'foodRef', 'quarRef', 'lawRef', 'wallNote', 'charNote', 'threatNote',
  'courtNote', 'prisonNote', 'militiaNote', 'secRef', 'guildRef', 'visibleAuthority', 'crimeRef', 'garNote',
  'strainLabel', 'watchLabel', 'posture',
]);

/** @param {object} node @returns {boolean} */
const isStringy = (node) => (node.type === 'Literal' && typeof node.value === 'string')
  || node.type === 'TemplateLiteral'
  || (node.type === 'BinaryExpression' && node.operator === '+');

/**
 * Flatten a string expression into TEXT with `${slot}` markers. A ConditionalExpression inside
 * a concatenation becomes an inline slot `${?N}` whose table is listed.
 * @param {object} node @param {string} source @param {Array<{slot: string, table: Array<{when: string, text: string}>}>} tables
 * @returns {string}
 */
function flatten(node, source, tables) {
  if (node.type === 'Literal') return typeof node.value === 'string' ? node.value : srcOf(node, source);
  if (node.type === 'TemplateLiteral') {
    let out = '';
    node.quasis.forEach((q, i) => {
      out += q.value.cooked ?? q.value.raw;
      if (node.expressions[i]) {
        const e = node.expressions[i];
        if (e.type === 'ConditionalExpression') {
          const slot = `?${tables.length + 1}`;
          tables.push({ slot, table: ternaryTable(e, source, tables) });
          out += `\${${slot}}`;
        } else out += `\${${srcOf(e, source)}}`;
      }
    });
    return out;
  }
  if (node.type === 'BinaryExpression' && node.operator === '+') return flatten(node.left, source, tables) + flatten(node.right, source, tables);
  if (node.type === 'ConditionalExpression') {
    const slot = `?${tables.length + 1}`;
    tables.push({ slot, table: ternaryTable(node, source, tables) });
    return `\${${slot}}`;
  }
  if (node.type === 'ParenthesizedExpression') return flatten(node.expression, source, tables);
  return `\${${srcOf(node, source)}}`;
}

/**
 * The branches of a (nested) conditional, as `(when -> text)` rows.
 * @param {object} node @param {string} source @param {Array<object>} tables
 * @returns {Array<{when: string, text: string}>}
 */
function ternaryTable(node, source, tables) {
  /** @type {Array<{when: string, text: string}>} */
  const rows = [];
  const rec = (n, guards) => {
    if (n.type === 'ConditionalExpression') {
      rec(n.consequent, [...guards, srcOf(n.test, source)]);
      rec(n.alternate, [...guards, `!(${srcOf(n.test, source)})`]);
      return;
    }
    rows.push({ when: guards.join(' && ') || 'always', text: isStringy(n) ? flatten(n, source, tables) : `\${${srcOf(n, source)}}` });
  };
  rec(node, []);
  return rows;
}

/**
 * THE PREDICATE CHAIN of a node: outermost first. For an else-if ladder every earlier arm's
 * test is negated, so the chain is a conjunction a reader can evaluate.
 * @param {object[]} ancestors @param {object} node @param {string} source
 * @returns {string[]}
 */
function predicateChain(ancestors, node, source) {
  /** @type {string[]} */
  const chain = [];
  let child = node;
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const a = ancestors[i];
    if (a.type === 'IfStatement') {
      const test = srcOf(a.test, source).replace(/\s+/g, ' ');
      chain.unshift(child === a.alternate ? `!(${test})` : test);
    } else if (a.type === 'ConditionalExpression' && child !== a.test) {
      const test = srcOf(a.test, source).replace(/\s+/g, ' ');
      chain.unshift(child === a.alternate ? `!(${test})` : test);
    } else if (a.type === 'FunctionDeclaration' || a.type === 'FunctionExpression' || a.type === 'ArrowFunctionExpression') break;
    child = a;
  }
  return chain;
}

/** The nearest sink a string lands in. @param {object[]} ancestors @param {object} node @param {string} source */
function sinkOf(ancestors, node, source) {
  let child = node;
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const a = ancestors[i];
    if (a.type === 'BinaryExpression' || a.type === 'TemplateLiteral' || a.type === 'ConditionalExpression' || a.type === 'LogicalExpression' || a.type === 'ParenthesizedExpression') { child = a; continue; }
    if (a.type === 'AssignmentExpression') return a.left.type === 'Identifier' ? a.left.name : srcOf(a.left, source);
    if (a.type === 'VariableDeclarator') return a.id.type === 'Identifier' ? a.id.name : srcOf(a.id, source);
    if (a.type === 'Property') return a.key.type === 'Identifier' ? a.key.name : String(a.key.value);
    if (a.type === 'CallExpression') {
      const callee = srcOf(a.callee, source);
      return /\.push$/.test(callee) ? `${callee.replace(/\.push$/, '')}[]` : `call:${callee}`;
    }
    if (a.type === 'ReturnStatement') return 'return';
    if (a.type === 'ArrayExpression') { child = a; continue; }
    child = a;
  }
  return '(unknown)';
}

/**
 * THE LEXICALLY NEAREST DECLARATOR of a name: the last `const/let name = ...` that PRECEDES the
 * node in the innermost enclosing block, else the next block out. `lawRef` is declared in every
 * arm of safetyProfile's ladder; the first declarator in the file is the wrong one.
 * @param {string} name @param {object[]} ancestors @param {object} node
 * @returns {object|null} the VariableDeclarator
 */
function lexicalDeclarator(name, ancestors, node) {
  const at = node.range[0];
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const a = ancestors[i];
    if (a.type !== 'BlockStatement' && a.type !== 'Program' && a.type !== 'SwitchCase') continue;
    const body = a.type === 'SwitchCase' ? a.consequent : a.body;
    let found = null;
    for (const stmt of body) {
      if (stmt.range[0] >= at) break;
      if (stmt.type !== 'VariableDeclaration') continue;
      for (const d of stmt.declarations) if (d.id.type === 'Identifier' && d.id.name === name) found = d;
    }
    if (found) return found;
  }
  return null;
}

/** @param {object[]} ancestors @returns {string} */
function producerOf(ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const a = ancestors[i];
    if (a.type === 'FunctionDeclaration' && a.id) return a.id.name;
    if ((a.type === 'ArrowFunctionExpression' || a.type === 'FunctionExpression') && ancestors[i - 1]?.type === 'VariableDeclarator') return ancestors[i - 1].id.name;
  }
  return '(module)';
}

/** The identifier and member chains a predicate text mentions. @param {string} text */
function namesIn(text) {
  const out = new Set();
  // Quoted strings are VALUES, a JSDoc cast is a comment: neither names a field.
  const code = String(text).replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/'[^']*'|"[^"]*"/g, "''");
  for (const m of code.matchAll(/\b([A-Za-z_$][\w$]*(?:\??\.[A-Za-z_$][\w$]*)*)(?:\(([^()]*)\))?/g)) {
    let name = m[1].replace(/\?\./g, '.');
    // A method tail is a call on the reading, never a field of it.
    name = name.replace(/\.(includes|some|every|length|map|filter|startsWith|endsWith|trim)$/, '');
    if (/^(true|false|null|undefined|length|includes|some|every|Math|Number|String|Array|Object|Boolean|typeof)$/.test(name.split('.')[0])) continue;
    if (m[2] !== undefined && /^(hasStress|tierAtLeast)$/.test(name)) {
      // A call: hasStress('famine') -> stressTypes has 'famine'; tierAtLeast(tier,'city') -> tier.
      // The argument is read from the ORIGINAL text (the quoted value was blanked above).
      const arg = /'([^']*)'/.exec(String(text).slice(m.index))?.[1] || m[2];
      out.add(name === 'hasStress' ? `hasStress('${arg}')` : 'tier');
    } else out.add(name);
  }
  return [...out];
}

/**
 * Resolve a predicate name to an ENGINE FIELD for one producer file.
 * @param {string} name @param {Map<string, string>} locals @param {Record<string, string>} roots
 * @returns {string}
 */
function fieldOfName(name, locals, roots) {
  if (/^hasStress\(/.test(name)) return `config.stressTypes ∋ ${name.slice(10, -1)}`;
  const resolved = resolveExpr(name, locals, roots);
  let field = asEngineField(resolved);
  // safetyProfile: flags from getInstFlags(config, institutions) at generation.
  field = field.replace(/^getInstFlags\(config, institutions\)\.inst\.(has\w+)$/, 'institutions@generation[flag=$1]')
    .replace(/^getInstFlags\(config, institutions\)\.(\w+)$/, 'getInstFlags@generation.$1')
    .replace(/^getStressFlags\(config, institutions\)\.(\w+)$/, 'getStressFlags@generation.$1')
    .replace(/^getPriorities\(config\)\.(\w+)$/, 'config.priorities.$1');
  // threatAssessment / defenseDisplay: `(inst.walls || []).length > 0` style already stripped.
  field = field.replace(/^Math\.max\(.*$/, 'derived@generation');
  // A local array or object literal (`safetyStrains = []`) is the producer's own scratch.
  if (/^[[{]/.test(field)) field = `local@producer (${name})`;
  return field;
}

/**
 * ⭐ THE PACK.
 * @returns {{producers: Array<{file: string, functions: string[]}>, rows: Array<object>, fields: Record<string, {writers: number, clock: string}>}}
 */
export function buildSiblingPack() {
  const tree = parsePulseTree();
  /** @type {Record<string, {writers: number, clock: string}>} */
  const fieldClocks = {};
  const clockFor = (field) => {
    const key = field.replace(/\[.*$/, '').replace(/ ∋ .*$/, '');
    if (!fieldClocks[field]) {
      if (/@generation|^derived/.test(field)) fieldClocks[field] = { writers: 0, clock: 'SNAPSHOT (generation-time input; the output string is stored and FROZEN)' };
      else if (/^config\b/.test(field)) fieldClocks[field] = { writers: 0, clock: 'CONFIG' };
      else if (/^institutions\b/.test(field)) fieldClocks[field] = { writers: frozenFieldCensus('institutions', undefined, tree).count, clock: 'LIVE-ROSTER' };
      else {
        const c = frozenFieldCensus(key, undefined, tree);
        fieldClocks[field] = { writers: c.count, clock: clockOf(key, c.count) };
      }
    }
    return fieldClocks[field].clock;
  };
  /** @type {Array<object>} */
  const rows = [];
  const producers = [];
  for (const spec of PRODUCER_FILES) {
    const file = parseFile(spec.rel);
    const fns = functionsOf(file.ast);
    producers.push({ file: spec.rel, functions: [...fns.keys()] });
    /** @type {Map<object, {locals: Map<string, string>, roots: Record<string, string>}>} */
    const scopes = new Map();
    // The locals of EVERY enclosing function, outer to inner (an inner binding shadows an
    // outer one), and the roots from the OUTERMOST: a `.map((row) => ...)` arrow inside
    // `deriveDefenseReadiness` reads `gates` from the function around it.
    const scopeOf = (ancestors) => {
      const fns = ancestors.filter((a) => a.type === 'FunctionDeclaration' || a.type === 'ArrowFunctionExpression' || a.type === 'FunctionExpression');
      if (fns.length === 0) return { locals: new Map(), roots: {} };
      const key = fns[fns.length - 1];
      if (!scopes.has(key)) {
        const locals = new Map();
        let roots = {};
        fns.forEach((fn, i) => {
          const scope = localsOf(fn, file.source);
          for (const [k, v] of scope.locals) locals.set(k, v);
          if (i === 0) roots = spec.roots ? { ...spec.roots } : { [scope.params[0] || 'settlement']: 'settlement' };
        });
        scopes.set(key, { locals, roots });
      }
      return scopes.get(key);
    };
    walk(file.ast, (node, ancestors) => {
      if (!isStringy(node)) return undefined;
      // Only the OUTERMOST string expression: a literal inside a concatenation is part of it.
      const parent = ancestors[ancestors.length - 1];
      if (parent && (parent.type === 'BinaryExpression' && parent.operator === '+' || parent.type === 'TemplateLiteral')) return undefined;
      if (parent && parent.type === 'ImportDeclaration') return false;
      const tables = [];
      const text = flatten(node, file.source, tables);
      if (text.replace(/\$\{[^}]*\}/g, '').trim().length < 12 && tables.length === 0) return false;
      if (/^#[0-9a-f]{6}$/i.test(text.trim())) return false;
      const sink = sinkOf(ancestors, node, file.source);
      const chain = predicateChain(ancestors, node, file.source);
      const scope = scopeOf(ancestors);
      const fields = {};
      for (const pred of chain) {
        for (const name of namesIn(pred)) {
          const f = fieldOfName(name, scope.locals, scope.roots);
          if (/^'|^"|^\d/.test(f)) continue;
          fields[name] = { field: f, clock: clockFor(f) };
        }
      }
      // Slot tables: a `${name}` slot bound to a local conditional or string.
      const slots = {};
      for (const m of text.matchAll(/\$\{([A-Za-z_$][\w$]*)\}/g)) {
        const decl = lexicalDeclarator(m[1], ancestors, node);
        if (!decl || !decl.init) continue;
        const t = [];
        const table = decl.init.type === 'ConditionalExpression' ? ternaryTable(decl.init, file.source, t)
          : isStringy(decl.init) ? [{ when: 'always', text: flatten(decl.init, file.source, t) }] : null;
        if (table) slots[m[1]] = table;
      }
      rows.push({
        file: spec.rel, line: node.loc.start.line, producer: producerOf(ancestors), sink,
        onPage: PAGE_SINKS.includes(sink.replace(/\[\]$/, '')),
        stored: spec.stored ? `${spec.stored}.${sink}` : null,
        text, tables, slots, predicate: chain, fields,
      });
      return false;
    });
  }
  return { producers, rows, fields: fieldClocks };
}

/** One row as the marker reads it. @param {object} row */
export function packRowLines(row) {
  const lines = [];
  lines.push(`• [${row.producer} -> ${row.sink}${row.onPage ? '' : ' (not a page sink)'}] ${row.file}:${row.line}`);
  lines.push(`    "${row.text}"`);
  if (row.predicate.length) lines.push(`    when: ${row.predicate.join('  AND  ')}`);
  const fields = Object.entries(row.fields);
  if (fields.length) lines.push(`    fields: ${fields.map(([n, f]) => `${n} = ${f.field} [${f.clock}]`).join(' · ')}`);
  for (const t of row.tables) for (const r of t.table) lines.push(`    \${${t.slot}} when ${r.when}: "${r.text}"`);
  for (const [slot, table] of Object.entries(row.slots)) for (const r of table) lines.push(`    \${${slot}} when ${r.when}: "${r.text}"`);
  return lines;
}

async function main() {
  const argv = process.argv.slice(2);
  const outAt = argv.indexOf('--out');
  const out = outAt >= 0 ? argv[outAt + 1] : 'docs/content/sibling-string-pack.json';
  const pack = buildSiblingPack();
  const abs = path.isAbsolute(out) ? out : path.join(ROOT, out);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(pack, null, 1)}\n`);
  console.log(`sibling-string-pack: ${pack.rows.length} strings from ${pack.producers.length} files -> ${path.relative(ROOT, abs)}`);
  console.log(`  on-page sinks: ${pack.rows.filter((r) => r.onPage).length} · fields with clocks: ${Object.keys(pack.fields).length}`);
  if (argv.includes('--print')) for (const row of pack.rows) console.log(packRowLines(row).join('\n'));
}

if (process.argv[1] && process.argv[1].endsWith('sibling-string-pack.mjs')) await main();
