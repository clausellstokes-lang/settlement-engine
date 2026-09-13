/**
 * scripts/lib/prose-mark-fields.mjs — THE MARKER'S MECHANICAL INSTRUMENTS (brief ADDENDUM 18
 * rulings 4, 6 and 11; the Fable chair's card sections (1)–(6)).
 *
 * Shared by `scripts/prose-mark-card.mjs`, `scripts/sibling-string-pack.mjs` and
 * `scripts/frozen-field-census.mjs`. Not a product module: nothing under `src/` imports it.
 *
 * WHAT IT HOLDS.
 *   • an espree parse with `loc`, a generic AST walk, and a LOCAL-BINDING RESOLVER that turns a
 *     desk local (`walls`, `compound`, `dp`) back into the engine expression it was bound to;
 *   • a FIELD NORMALISER that spells an engine expression as a dotted engine field
 *     (`settlement?.defenseProfile?.scores?.economic` -> `defenseProfile.scores.economic`,
 *     `forces.militia.present` -> `institutions[bucket=militia]`);
 *   • the CLOCK of a field (SNAPSHOT / LIVE-ROSTER / PULSE / CONFIG), from its root and from the
 *     writer census;
 *   • the FROZEN-FIELD CENSUS: field-grain write sites under `src/domain/worldPulse/`;
 *   • the PREIMAGE of a pool key: the exported `*PoolKey` function enumerated over its
 *     parameters' domains, so a card can say which parameters the key FIXES and which it leaves
 *     OPEN without parsing the desk's private situation function;
 *   • the catalogue's `required: true` rows per tier and the closed-roster buckets they fix.
 *
 * Deterministic: no RNG, no clock. Read-only on the tree.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { parse } from 'espree';

export const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '../..');

/** The parse every instrument here reads with. `loc` makes a citation openable. */
export const ESPREE_OPTIONS = Object.freeze({ ecmaVersion: 2024, sourceType: 'module', loc: true, range: true });

/** @param {string} rel repo-relative path @returns {{source: string, ast: object, rel: string}} */
export function parseFile(rel) {
  const source = readFileSync(path.join(ROOT, rel), 'utf8');
  return { source, ast: parse(source, ESPREE_OPTIONS), rel };
}

/** Source text of a node. @param {object} node @param {string} source */
export const srcOf = (node, source) => (node && node.range ? source.slice(node.range[0], node.range[1]) : '');

/**
 * A generic pre-order walk with the ancestor stack. `visit(node, ancestors)` may return
 * `false` to skip the subtree.
 * @param {unknown} node @param {(node: object, ancestors: object[]) => (void|false)} visit
 * @param {object[]} [ancestors]
 */
export function walk(node, visit, ancestors = []) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const child of node) walk(child, visit, ancestors); return; }
  if (typeof node.type !== 'string') return;
  if (visit(node, ancestors) === false) return;
  ancestors.push(node);
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'range' || key === 'parent') continue;
    walk(node[key], visit, ancestors);
  }
  ancestors.pop();
}

/** Every `.js` file under a directory, recursively, repo-relative and sorted. @param {string} relDir */
export function jsFilesUnder(relDir) {
  /** @type {string[]} */
  const out = [];
  const rec = (abs) => {
    for (const name of readdirSync(abs).sort()) {
      const child = path.join(abs, name);
      if (statSync(child).isDirectory()) rec(child);
      else if (child.endsWith('.js')) out.push(path.relative(ROOT, child));
    }
  };
  rec(path.join(ROOT, relDir));
  return out;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// LOCAL BINDINGS AND FIELD NORMALISATION
// ═══════════════════════════════════════════════════════════════════════════════════════════

/**
 * The exported function declarations of a module, by name (FunctionDeclaration and
 * `export const f = () => ...`).
 * @param {object} ast @returns {Map<string, object>} name -> function node
 */
export function functionsOf(ast) {
  /** @type {Map<string, object>} */
  const out = new Map();
  walk(ast, (node) => {
    if (node.type === 'FunctionDeclaration' && node.id) out.set(node.id.name, node);
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && node.init
      && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
      out.set(node.id.name, node.init);
    }
  });
  return out;
}

/**
 * ⭐ THE LOCAL-BINDING RESOLVER. Every `const x = <expr>` and destructured binding inside one
 * function, as `name -> the init's source text`, plus the function's own parameter names.
 * @param {object} fn a function node @param {string} source
 * @returns {{locals: Map<string, string>, params: string[]}}
 */
export function localsOf(fn, source) {
  /** @type {Map<string, string>} */
  const locals = new Map();
  const params = (fn.params || []).map((p) => (p.type === 'Identifier' ? p.name
    : p.type === 'AssignmentPattern' && p.left.type === 'Identifier' ? p.left.name : srcOf(p, source)));
  walk(fn.body, (node) => {
    if (node.type === 'VariableDeclarator' && node.init) {
      if (node.id.type === 'Identifier') locals.set(node.id.name, srcOf(node.init, source));
      else if (node.id.type === 'ObjectPattern') {
        for (const prop of node.id.properties) {
          if (prop.type === 'Property' && prop.value.type === 'Identifier') {
            locals.set(prop.value.name, `${srcOf(node.init, source)}.${srcOf(prop.key, source)}`);
          }
        }
      }
    }
    // Do not descend into nested functions: their locals are theirs.
    if (node !== fn && (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression'
      || node.type === 'ArrowFunctionExpression')) return false;
    return undefined;
  });
  return { locals, params };
}

/** The idioms that wrap a read without changing what it reads. */
const WRAPPERS = [
  [/\?\./g, '.'],
  [/\s*\|\|\s*(\{\}|\[\]|'[^']*'|"[^"]*"|\d+|null|false|true)\s*$/g, ''],
  [/\s*\|\|\s*\{\}/g, ''],
  [/\s*\|\|\s*\[\]/g, ''],
];

/**
 * Is the whole text one parenthesised group `( ... )`? A call `f(a)` is not.
 * @param {string} text @returns {boolean}
 */
function outerParens(text) {
  if (!text.startsWith('(') || !text.endsWith(')')) return false;
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') depth += 1;
    else if (text[i] === ')') { depth -= 1; if (depth === 0 && i < text.length - 1) return false; }
  }
  return depth === 0;
}

/**
 * Strip the defensive idioms off an expression so `settlement?.defenseProfile || {}` reads as
 * `settlement.defenseProfile`. Idempotent.
 * @param {string} text @returns {string}
 */
export function stripWrappers(text) {
  let out = String(text).trim();
  for (let i = 0; i < 4; i++) {
    for (const [re, rep] of WRAPPERS) out = out.replace(re, rep).trim();
    while (outerParens(out)) out = out.slice(1, -1).trim();
  }
  // `(x.walls || []).length > 0` -> `x.walls`
  out = out.replace(/^\((.+?)\s*\|\|\s*\[\]\)\.length\s*>\s*0$/, '$1');
  out = out.replace(/^(.+?)\.length\s*>\s*0$/, '$1');
  // `civicFlag(x)`, `Boolean(x)`, `!!x`, `text(x)`, `String(x)`, `Math.round(x)` -> x
  out = out.replace(/^(civicFlag|Boolean|text|String|Number|Math\.round)\((.+)\)$/, '$2');
  out = out.replace(/^!!/, '');
  // `k ? a[k] : undefined` reads `a[k]`; a guard on the key is not a second reading.
  out = out.replace(/^[A-Za-z_$][\w$]*\s*\?\s*(.+?)\s*:\s*(undefined|null)$/, '$1');
  return out.trim();
}

/**
 * ⭐ RESOLVE ONE EXPRESSION TO THE ENGINE, through the function's locals, transitively, then
 * spell it as a dotted field where it is one.
 *
 * @param {string} expr source text
 * @param {Map<string, string>} locals from `localsOf`
 * @param {Record<string, string>} [rootAliases] e.g. `{ r: 'settlement', s: 'settlement' }`
 * @param {number} [depth]
 * @returns {string} the resolved expression text (dotted where the chain is a plain read)
 */
export function resolveExpr(expr, locals, rootAliases = {}, depth = 0) {
  let text = stripWrappers(expr);
  if (depth > 8) return text;
  const head = /^([A-Za-z_$][\w$]*)(.*)$/.exec(text);
  if (!head) return text;
  const [, name, rest] = head;
  // Locals INSIDE the rest (`x ? stockpile.blockaded === true : false`) are substituted where
  // their binding is a plain chain, so a guard's second mention resolves with its first.
  let tail = rest;
  for (const [local, init] of locals) {
    const plain = stripWrappers(init);
    if (!/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(plain) || local === name) continue;
    tail = tail.replace(new RegExp(`(?<![\\w$.])${local}(?![\\w$])(?!\\s*:)`, 'g'), plain);
  }
  // `A ? A.b === true : false` is the read `A.b`.
  const guarded = /^(.+?)\s*\?\s*\1\.([\w$]+)\s*===\s*true\s*:\s*false$/.exec(`${name}${tail}`);
  if (guarded) return resolveExpr(`${guarded[1]}.${guarded[2]}`, locals, rootAliases, depth + 1);
  if (locals.has(name)) return resolveExpr(`${stripWrappers(locals.get(name))}${tail}`, locals, rootAliases, depth + 1);
  if (rootAliases[name]) text = `${rootAliases[name]}${tail}`;
  else text = `${name}${tail}`;
  return text;
}

/**
 * The engine-field spelling of a resolved expression. `settlement.` is dropped (the census's
 * own convention), and the typed force projection is spelled as a roster bucket.
 * @param {string} resolved @returns {string}
 */
export function asEngineField(resolved) {
  let f = stripWrappers(resolved);
  f = f.replace(/^standingDefenseForces\(settlement\)\.([A-Za-z]+)\.present$/, 'institutions[bucket=$1]');
  f = f.replace(/^standingDefenseForces\(settlement\)\.([A-Za-z]+)(\.\w+)?$/, 'institutions[bucket=$1]');
  f = f.replace(/^settlement\./, '');
  return f;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// CLOCKS
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const CLOCKS = Object.freeze(['SNAPSHOT', 'LIVE-ROSTER', 'PULSE', 'CONFIG']);

/**
 * THE CLOCK OF A FIELD.
 *   CONFIG       the effective config (`config.*`): fixed at generation, never pulsed.
 *   LIVE-ROSTER  `institutions` (the roster the pulse rewrites on ruin/build) and any read
 *                through the canonical live filter (`standingDefenseForces`, `liveInstitutions`).
 *   PULSE        a persisted field with at least one field-grain writer under worldPulse.
 *   SNAPSHOT     a persisted field with zero writers after generation (FROZEN).
 * @param {string} field engine field @param {number|null} writers field-grain writer count, or null
 * @returns {string}
 */
export function clockOf(field, writers) {
  const f = String(field);
  if (/^config\b/.test(f)) return 'CONFIG';
  if (/^institutions\b/.test(f) || /^institutions\[/.test(f) || /liveInstitutions|standingDefenseForces/.test(f)) return 'LIVE-ROSTER';
  if (typeof writers === 'number' && writers > 0) return 'PULSE';
  return 'SNAPSHOT';
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// THE FROZEN-FIELD CENSUS (field grain, never root grain)
// ═══════════════════════════════════════════════════════════════════════════════════════════

/** Where the pulse lives. */
export const PULSE_DIR = 'src/domain/worldPulse';

/**
 * Parse every `.js` file under a directory ONCE, so a census of many fields does not re-parse
 * 443 files per field. Fail-closed per file: an unparseable file is absent from `parsed` and the
 * census names it.
 * @param {string} [relDir]
 * @returns {{files: string[], parsed: Map<string, {source: string, ast: object, rel: string}>}}
 */
export function parsePulseTree(relDir = PULSE_DIR) {
  const files = jsFilesUnder(relDir);
  /** @type {Map<string, {source: string, ast: object, rel: string}>} */
  const parsed = new Map();
  for (const rel of files) {
    try { parsed.set(rel, parseFile(rel)); } catch { /* named as unparsed by the census */ }
  }
  return { files, parsed };
}

/**
 * The dotted path a member-expression chain spells, or null where it is not a plain chain.
 * @param {object} node @returns {string[]|null} segments, root first
 */
export function memberChain(node) {
  /** @type {string[]} */
  const segs = [];
  let cur = node;
  while (cur) {
    if (cur.type === 'MemberExpression') {
      if (cur.computed) {
        if (cur.property.type === 'Literal' && typeof cur.property.value === 'string') segs.unshift(cur.property.value);
        else segs.unshift('[*]');
      } else segs.unshift(cur.property.name);
      cur = cur.object;
    } else if (cur.type === 'ChainExpression') cur = cur.expression;
    else if (cur.type === 'Identifier') { segs.unshift(cur.name); return segs; }
    else if (cur.type === 'ThisExpression') { segs.unshift('this'); return segs; }
    else return null;
  }
  return null;
}

/** @param {object} node @returns {string} */
const propKeyName = (node) => (node.key.type === 'Identifier' ? node.key.name
  : node.key.type === 'Literal' ? String(node.key.value) : '');

/**
 * The PROPERTY-KEY ANCESTRY of a node: the object-literal keys it sits under, outermost first,
 * plus the chain of the assignment/declarator/return the outermost literal feeds, where one
 * can be read. `{ settlement: { ...s, defenseProfile: { scores: { disaster: x } } } }` gives
 * `['settlement', 'defenseProfile', 'scores']` for the `disaster` property.
 * @param {object[]} ancestors @returns {{keys: string[], sink: string|null}}
 */
function propertyAncestry(ancestors) {
  /** @type {string[]} */
  const keys = [];
  let sink = null;
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const a = ancestors[i];
    if (a.type === 'Property' && !a.computed) { keys.unshift(propKeyName(a)); continue; }
    if (a.type === 'ObjectExpression' || a.type === 'SpreadElement') continue;
    if (a.type === 'ConditionalExpression' || a.type === 'LogicalExpression' || a.type === 'ParenthesizedExpression') continue;
    if (a.type === 'AssignmentExpression' && a.left.type === 'MemberExpression') {
      const chain = memberChain(a.left);
      if (chain) { keys.unshift(...chain.slice(1)); sink = chain.join('.'); }
      break;
    }
    if (a.type === 'VariableDeclarator' && a.id.type === 'Identifier') { sink = `const ${a.id.name}`; break; }
    if (a.type === 'ReturnStatement') { sink = 'return'; break; }
    if (a.type === 'CallExpression') { sink = 'call-arg'; break; }
    break;
  }
  return { keys, sink };
}

/**
 * Does `haystack` (outer -> inner) END with `needle`? An empty needle matches.
 * @param {string[]} haystack @param {string[]} needle
 */
const endsWithSegs = (haystack, needle) => needle.length <= haystack.length
  && needle.every((seg, i) => haystack[haystack.length - needle.length + i] === seg);

/**
 * ⭐ THE FIELD-GRAIN WRITE SITES OF ONE FIELD under a directory.
 *
 * A WRITE is (a) an assignment whose target member chain ends with the field's segments
 * (`x.defenseProfile.scores.disaster = v`), or (b) an object-literal property (shorthand
 * included) keyed on the leaf whose property-key ancestry ends with the field's parent
 * segments (`{ defenseProfile: { scores: { disaster: v } } }`), or (c) for a one-segment
 * field, either shape on that one name. A SPREAD of a chain ending in the field is a CARRY
 * and is listed apart. A property keyed on the leaf with an ancestry that does NOT match is a
 * ROOT-GRAIN CANDIDATE, listed apart and never counted — that is the "root-grain" defect
 * this instrument exists to refuse.
 *
 * @param {string} field engine field, dotted (`settlement.` is stripped; `[bucket=x]` is not a
 *   field and is reported as the roster `institutions`)
 * @param {string} [relDir]
 * @returns {{field: string, target: string, writes: Array<{file: string, line: number, shape: string, text: string}>,
 *   carries: Array<{file: string, line: number, text: string}>,
 *   rootGrainCandidates: Array<{file: string, line: number, ancestry: string}>,
 *   count: number, status: 'FROZEN'|'LIVE', files: number, unparsed: string[]}}
 */
export function frozenFieldCensus(field, relDir = PULSE_DIR, parsedTree = null) {
  const target = String(field).replace(/^settlement\./, '').replace(/\[bucket=.*$/, '').replace(/\[.*$/, '');
  const segs = target.split('.').filter(Boolean);
  const leaf = segs[segs.length - 1];
  const parents = segs.slice(0, -1);
  const writes = [];
  const carries = [];
  const rootGrainCandidates = [];
  const unparsed = [];
  const tree = parsedTree || parsePulseTree(relDir);
  const files = tree.files;
  for (const rel of files) {
    const parsed = tree.parsed.get(rel);
    if (!parsed) { unparsed.push(rel); continue; }
    const { ast, source } = parsed;
    walk(ast, (node, ancestors) => {
      if (node.type === 'AssignmentExpression' && node.left.type === 'MemberExpression') {
        const chain = memberChain(node.left);
        if (chain && chain[chain.length - 1] === leaf && endsWithSegs(chain.slice(1, -1), parents)) {
          writes.push({ file: rel, line: node.loc.start.line, shape: 'assignment', text: srcOf(node, source).split('\n')[0].slice(0, 140) });
        }
      }
      if (node.type === 'Property' && !node.computed && propKeyName(node) === leaf) {
        const { keys, sink } = propertyAncestry(ancestors);
        if (endsWithSegs(keys, parents)) {
          writes.push({ file: rel, line: node.loc.start.line, shape: node.shorthand ? 'shorthand-property' : 'property', text: `${[...keys, leaf].join('.')} <- ${srcOf(node.value, source).split('\n')[0].slice(0, 100)}${sink ? `   [sink: ${sink}]` : ''}` });
        } else if (parents.length > 0) {
          rootGrainCandidates.push({ file: rel, line: node.loc.start.line, ancestry: `${keys.join('.') || '(none)'}.${leaf}${sink ? ` [sink: ${sink}]` : ''}` });
        }
      }
      if (node.type === 'SpreadElement') {
        const chain = memberChain(node.argument);
        if (chain && endsWithSegs(chain.slice(1), segs)) carries.push({ file: rel, line: node.loc.start.line, text: srcOf(node, source).slice(0, 120) });
      }
      return undefined;
    });
  }
  return {
    field: String(field), target, writes, carries, rootGrainCandidates,
    count: writes.length, status: writes.length === 0 ? 'FROZEN' : 'LIVE', files: files.length, unparsed,
    // A one-segment field has no parent chain to match, so every property or assignment of that
    // name counts: the reading is ROOT-GRAIN by necessity and says so.
    grain: parents.length > 0 ? 'field' : 'root (one segment: every property or assignment of this name under the pulse counts)',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// THE PREIMAGE OF A POOL KEY — the exported key function enumerated over its domains
// ═══════════════════════════════════════════════════════════════════════════════════════════

/** The domains a key-function parameter is enumerated over, by its NAME. */
export function domainFor(param, extra = {}) {
  const p = String(param);
  if (extra[p]) return extra[p];
  if (/^(walls|garrison|militia|perimeter|force|court|prison|granary|hospital|church|navy|port|blockaded|viable|magicWorks|namedChain)$/.test(p)) return [true, false];
  if (/monsterThreat/i.test(p)) return ['heartland', 'frontier', 'plagued', null];
  if (/score/i.test(p)) return Array.from({ length: 101 }, (_, i) => i);
  if (/^(tier)$/.test(p)) return ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  if (/gate/i.test(p)) return [0, 0.25, 0.5, 0.75, 0.9, 1, 1.25];
  return null;
}

/** @param {Function} fn @returns {string[]} parameter names, from the source */
export function paramNamesOf(fn) {
  const m = /^(?:async\s+)?(?:function\s*[\w$]*\s*)?\(([^)]*)\)/.exec(Function.prototype.toString.call(fn));
  if (!m) return [];
  return m[1].split(',').map((s) => s.trim().split('=')[0].trim()).filter(Boolean);
}

/**
 * ⭐ THE PREIMAGE. Every exported `*PoolKey` function of the desk module is enumerated over its
 * parameters' domains; the combinations returning `poolKey` are the preimage, and a parameter
 * is FIXED when it takes one value across that preimage.
 * @param {Record<string, unknown>} deskModule the imported desk (e.g. defenseStateProse.js)
 * @param {string} poolKey
 * @param {Record<string, unknown[]>} [extraDomains]
 * @returns {{fn: string, params: string[], combos: Array<Record<string, unknown>>, fixed: Record<string, unknown>, open: string[]}|null}
 */
export function preimageOfPoolKey(deskModule, poolKey, extraDomains = {}) {
  for (const [name, fn] of Object.entries(deskModule)) {
    if (typeof fn !== 'function' || !/PoolKey$/.test(name)) continue;
    const params = paramNamesOf(fn);
    const domains = params.map((p) => domainFor(p, extraDomains));
    if (params.length === 0 || domains.some((d) => d === null)) continue;
    /** @type {Array<Record<string, unknown>>} */
    const combos = [];
    const total = domains.reduce((n, d) => n * d.length, 1);
    if (total > 200000) continue;
    for (let i = 0; i < total; i++) {
      let k = i;
      const args = domains.map((d) => { const v = d[k % d.length]; k = Math.floor(k / d.length); return v; });
      let out;
      try { out = fn(...args); } catch { continue; }
      if (out === poolKey) combos.push(Object.fromEntries(params.map((p, j) => [p, args[j]])));
    }
    if (combos.length === 0) continue;
    /** @type {Record<string, unknown>} */
    const fixed = {};
    /** @type {string[]} */
    const open = [];
    for (const p of params) {
      const values = [...new Set(combos.map((c) => JSON.stringify(c[p])))];
      if (values.length === 1) fixed[p] = JSON.parse(values[0]);
      else open.push(p);
    }
    // A numeric parameter: report its band as a range rather than a list of 101 combos.
    for (const p of open) {
      if (typeof combos[0][p] === 'number') {
        const nums = combos.map((c) => Number(c[p]));
        fixed[`${p}:range`] = [Math.min(...nums), Math.max(...nums)];
      }
    }
    return { fn: name, params, combos, fixed, open };
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// THE CATALOGUE'S REQUIRED ROWS AND THE CLOSED ROSTERS THEY FIX
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/**
 * THE FOURTEEN ROSTER BUCKETS the card reports on, each with the name keywords that seat it.
 * The force buckets are `DEFENSE_BUCKET_KEYWORDS`'s own lists (the desk's live partition); the
 * civic buckets are `getInstFlags`'s lists (`src/generators/priorityHelpers.js:45-76`), which
 * are what `economicState.compound.inst.has*` and `safetyProfile`'s `inst.has*` are built on.
 * ⚠ `court` is `hasCourtSystem` and its list INCLUDES 'town hall' and 'city hall' — a Town hall
 * seats a court in the engine's own model, which the card prints so a writer sees the trap.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const ROSTER_BUCKETS = Object.freeze({
  watch: ['town watch', 'city watch', 'professional city watch'],
  garrison: ['garrison', 'barracks', 'professional guard', 'professional city watch', 'multiple garrison'],
  militia: ['citizen militia', 'militia'],
  mercenary: ['mercenary company', 'mercenary quarter', 'hired muscle'],
  charter: ["adventurers' charter hall", "adventurers' guild hall", "multiple adventurers'"],
  walls: ['wall', 'citadel', 'palisade', 'earthwork', 'inner citadel', 'massive walls'],
  gates: ['gates', 'town walls', 'city walls', 'massive walls', 'palisade'],
  granary: ['granar'],
  hospital: ['hospital', 'monastery', 'healer', 'friary'],
  market: ['market', 'bazaar', 'fair', 'trade center', 'exchange'],
  hall: ['town hall', 'city hall'],
  court: ['courthouse', 'court buildings', 'democratic assembly', 'city hall', 'town hall'],
  prison: ['prison', 'stocks', 'large prison', 'massive prison'],
  church: ['church', 'cathedral', 'temple', 'monastery', 'friary', 'shrine', 'priest', 'abbey'],
});

/** Which key-function PARAMETER fixes which bucket. */
export const BUCKET_OF_PARAM = Object.freeze({
  walls: 'walls', garrison: 'garrison', militia: 'militia', court: 'court', prison: 'prison',
  granary: 'granary', hospital: 'hospital', church: 'church',
});

/**
 * `institutionalCatalog[tier][section][name].required === true`, per tier.
 * @returns {Promise<Record<string, Array<{section: string, name: string}>>>}
 */
export async function requiredRowsByTier() {
  const mod = await import(url.pathToFileURL(path.join(ROOT, 'src/data/institutionalCatalog.js')).href);
  const catalog = mod.institutionalCatalog;
  /** @type {Record<string, Array<{section: string, name: string}>>} */
  const out = {};
  for (const tier of TIERS) {
    out[tier] = [];
    for (const [section, rows] of Object.entries(catalog[tier] || {})) {
      for (const [name, row] of Object.entries(rows)) {
        if (row && row.required === true) out[tier].push({ section, name });
      }
    }
  }
  return out;
}

/**
 * Which roster buckets a tier's required rows seat (by keyword match on the row NAME, the same
 * test the engine's own flag builders apply).
 * @param {Array<{section: string, name: string}>} rows
 * @returns {Record<string, string[]>} bucket -> the required rows that seat it
 */
export function bucketsSeatedByRequired(rows) {
  /** @type {Record<string, string[]>} */
  const out = {};
  for (const [bucket, keywords] of Object.entries(ROSTER_BUCKETS)) {
    const hits = rows.filter((r) => keywords.some((kw) => r.name.toLowerCase().includes(kw))).map((r) => r.name);
    if (hits.length) out[bucket] = hits;
  }
  return out;
}

/**
 * Parse a census TABLE-RUNG read (`reader(args) (via TABLE in file)`) — the census's own shape
 * (see `scripts/lib/prose-licence-card.mjs:parseTableRungRead`, re-spelled here so this lib
 * stays free of the licence card).
 * @param {string} read
 * @returns {{reader: string, callee: string|null, args: string[]|null, table: string, file: string}|null}
 */
export function parseTableRead(read) {
  const whole = /^(.+) \(via ([A-Za-z0-9_$]+) in ([A-Za-z0-9_./-]+)\)$/.exec(String(read ?? ''));
  if (!whole) return null;
  const call = /^([A-Za-z0-9_$.?]+)\((.*)\)$/.exec(whole[1]);
  return {
    reader: whole[1], callee: call ? call[1] : null,
    args: call ? call[2].split(',').map((s) => s.trim()).filter(Boolean) : null,
    table: whole[2], file: whole[3],
  };
}

/**
 * ⭐ NORMALISE A CENSUS READ TO ENGINE FIELDS, through the desk module's own source: for a
 * table-rung read the reader's ARGUMENTS are desk locals of the entry point that calls the key
 * function, so they are resolved through that function's local bindings; a dotted read is
 * itself.
 * @param {string} read
 * @param {{source: string, ast: object}} desk the parsed desk file
 * @returns {Array<{arg: string, resolved: string, field: string, how: string}>}
 */
export function normaliseRead(read, desk, keyFunction = '') {
  const rung = parseTableRead(read);
  const literal = String(read);
  // A dotted engine path is itself. A BARE local (`court`, `stress`, `forces.walls.present`) is
  // a key-function parameter or an entry-point local and is resolved below.
  if (!rung && /^(settlement|readings|config|economicState|defenseProfile)\b/.test(literal)) {
    const field = asEngineField(literal);
    return [{ arg: literal, resolved: field, field, how: 'literal' }];
  }
  const names = rung ? (rung.args || []) : [literal];
  const callee = rung ? rung.callee : null;
  if (rung && (!callee || !rung.args)) return [{ arg: rung.reader, resolved: rung.reader, field: rung.reader, how: 'UNRESOLVED (bare key expression; a caller\'s argument, not a settlement field)' }];
  const fns = functionsOf(desk.ast);
  // THE KEY FUNCTION: the census's own `keyFunction` where it names a function, else the reader's
  // callee or its *PoolKey wrapper. Its PARAMETER NAMES are the names the census spelled.
  const candidates = [keyFunction, callee, callee && callee.replace(/Situation$/, 'PoolKey'), callee && callee.replace(/Family$/, 'PoolKey')]
    .filter(Boolean);
  let keyName = candidates.find((n) => fns.has(n)) || null;
  // A HELPER READER (`scoreBand(readinessScore)`): the census names the table, not a function.
  // The key function is then the *PoolKey whose body calls the helper and whose parameters
  // carry the census's names.
  if (!keyName && callee) {
    const head = (names[0] || '').split('.')[0];
    for (const [name, fn] of fns) {
      if (!/PoolKey$/.test(name)) continue;
      const params = localsOf(fn, desk.source).params;
      if (!params.includes(head)) continue;
      let calls = false;
      walk(fn.body, (node) => { if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === callee) calls = true; return undefined; });
      if (calls) { keyName = name; break; }
    }
  }
  const keyFn = keyName ? fns.get(keyName) : null;
  const keyParams = keyFn ? localsOf(keyFn, desk.source).params : [];
  // THE ENTRY POINT: the exported *Prose function whose body calls the key function (or, for a
  // helper reader such as scoreBand, the *PoolKey function that wraps it).
  const wanted = new Set([keyName, callee, callee && callee.replace(/Situation$/, 'PoolKey')].filter(Boolean));
  /** @type {{fn: object, args: object[], called: string}|null} */
  let site = null;
  for (const [name, fn] of fns) {
    if (!/Prose$/.test(name)) continue;
    walk(fn.body, (node) => {
      if (site) return false;
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && wanted.has(node.callee.name)) {
        site = { fn, args: node.arguments, called: node.callee.name };
        return false;
      }
      return undefined;
    });
    if (site) break;
  }
  if (!site) {
    return names.map((arg) => ({ arg, resolved: arg, field: arg, how: `UNRESOLVED (no *Prose entry point calls ${[...wanted].join('/')})` }));
  }
  const { locals, params } = localsOf(site.fn, desk.source);
  const root = params[0] || 'settlement';
  const aliases = { [root]: 'settlement' };
  // The called function's parameters, so a census name that is a PARAMETER maps to the argument
  // expression at its index (`court` -> `civicFlag(compound.hasCourtSystem)`).
  const calledParams = site.called === keyName ? keyParams : (fns.has(site.called) ? localsOf(fns.get(site.called), desk.source).params : []);
  return names.map((arg, i) => {
    const head = arg.split('.')[0];
    const at = calledParams.indexOf(head);
    const idx = at >= 0 ? at : (rung ? i : -1);
    let argText = idx >= 0 && site.args[idx] ? srcOf(site.args[idx], desk.source) + arg.slice(head.length) : arg;
    if (idx < 0 || !site.args[idx]) argText = arg;
    // A `||` of two locals (`garrison || militia`) resolves each side.
    const sides = argText.split(/\s*\|\|\s*/);
    const resolvedSides = sides.map((s) => resolveExpr(s, locals, aliases));
    const fields = resolvedSides.map(asEngineField);
    const stillLocal = fields.some((f) => !/^(institutions|config|economicState|defenseProfile|readings|name|tier|history|stress|powerStructure|resourceAnalysis|economicViability)\b/.test(f) && !/settlement/.test(f) && /^[a-z]/.test(f));
    return {
      arg, resolved: resolvedSides.join(' || '), field: fields.join(' || '),
      how: stillLocal ? `PARTLY RESOLVED through ${site.called}'s call site (a local the resolver could not follow)` : `resolved through ${site.called}'s call site in the entry point`,
    };
  });
}

/**
 * ⭐ THE FIELDS A MACHINE PRODUCER READS off the settlement it is handed: every member chain
 * rooted at the function's first parameter (or at a local bound to one), resolved and spelled
 * as engine fields. For a producer whose signature is `(config, tier, institutions)` the roots
 * are those three names, spelled as `config.*` / `tier` / `institutions`.
 * @param {string} rel repo-relative file
 * @param {string} fnName the exported producer
 * @param {Record<string, string>} [rootMap] param name -> engine root (default: first param -> 'settlement')
 * @returns {{fields: string[], unresolved: string[]}}
 */
export function producerReads(rel, fnName, rootMap = null) {
  const desk = parseFile(rel);
  const fn = functionsOf(desk.ast).get(fnName);
  if (!fn) throw new Error(`no function ${fnName} in ${rel}`);
  const { locals, params } = localsOf(fn, desk.source);
  const aliases = rootMap || { [params[0]]: 'settlement' };
  for (const p of params) if (!aliases[p]) aliases[p] = p;
  /** @type {Set<string>} */
  const fields = new Set();
  /** @type {Set<string>} */
  const unresolved = new Set();
  walk(fn.body, (node, ancestors) => {
    if (node.type !== 'MemberExpression') return undefined;
    const parent = ancestors[ancestors.length - 1];
    if (parent && parent.type === 'MemberExpression' && parent.object === node) return undefined; // take the longest chain only
    const chain = memberChain(node);
    if (!chain) return undefined;
    const text = chain.join('.');
    const resolved = resolveExpr(text, locals, aliases);
    const head = resolved.split(/[.(\[]/)[0];
    if (head === 'settlement' || Object.values(aliases).includes(head)) {
      const field = asEngineField(resolved).replace(/\.(length|includes|some|map|filter|slice|join|trim)\b.*$/, '');
      if (field && !/^(Math|Number|Object|Array|String)\b/.test(field)) fields.add(field);
    } else if (!/^(Math|Number|Object|Array|String|JSON|console)\b/.test(resolved)) {
      unresolved.add(resolved);
    }
    return false;
  });
  return { fields: [...fields].sort(), unresolved: [...unresolved].sort() };
}
