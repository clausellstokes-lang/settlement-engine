#!/usr/bin/env node
// scripts/veil/standingForms.mjs — THE TABLE OF STANDING FORMS' DOOR (VEIL-36 R5D-FORMS; the chair's E115, E121, E126, E129).
//
// R5-DESC cuts the STANDING tail (`annotateFactionStanding`'s appended prose) off every served `powerStructure.factions[].desc`,
// in migration 212 AND in the client's twin, by ONE frozen table: standingForms.data.json. This door derives the forms from an
// engine source text, writes and checks the table, prints the ONE literal both engines carry, and is the JS reference cut.
//
//   node scripts/veil/standingForms.mjs --print            the literal between STANDING_FORMS markers, and its sha256
//   node scripts/veil/standingForms.mjs --derive <path>    the forms a factionStanding.js (or older powerGenerator.js) text appends
//   node scripts/veil/standingForms.mjs --check [--file <path>]
//                                                          red unless every form the tip's file (or <path>) derives is a row,
//                                                          and every row's re matches its own template's sample expansion
//   node scripts/veil/standingForms.mjs --cut <desc>       the JS reference cut: base and standing, or "no match"
//   node scripts/veil/standingForms.mjs --write            re-derive tip, master and master's history (read-only `git show`)
//                                                          and write the table; rows only GROW (stored documents keep old forms)
//
// DERIVATION IS STATIC: the file is parsed (acorn); the standing variable is the one the final append reads
// (`X.desc = X.desc ? X.desc + ' ' + S : S`), and every value assigned to it is evaluated over string and template literals:
// a `${...}` or a `+` operand becomes a SLOT (powerSentenceName(...) -> name; a raw `.faction` -> label; `.body` -> force;
// `.replace(/^Three/, LEVEL_COUNT_WORDS[...])` -> count), a conditional whose branches are single phrases (no sentence end) is a
// CHOICE inside one form, and a conditional between sentences is a UNION of forms. Local helpers (arcaneAheadSaid,
// occupierStanding, ...) are inlined; identifiers resolve by scope. A shape it cannot read throws, naming the line: that branch
// would then be derived by EXECUTION (none needs it at the commits read: see the hand-back).
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';
import { powerSentenceName } from '../../src/data/people/powerSentenceName.js';
import { HIDDEN_POWER_MASK } from '../../src/domain/display/publicSafe.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DATA_PATH = join(ROOT, 'scripts', 'veil', 'standingForms.data.json');
const TIP_PATH = 'src/generators/power/factionStanding.js';
const FORCE_PATH = 'src/domain/defense/defenseFacts.js';
export const CHECK_MESSAGE =
  'a new or changed standing form ships only WITH a migration that adds it to 212\'s STANDING_FORMS; old rows stay: stored documents keep them';

// ── THE SLOTS' PATTERNS (the subset Postgres ARE and JavaScript RegExp run alike: no backslash anywhere) ─────────────────────
// A word of a power's name: a letter, then letters, an apostrophe or a hyphen ("Headman's", "City-State"); the head word capital.
const W1 = "[A-Z][A-Za-z'-]{0,24}";
const W = "[A-Za-z][A-Za-z'-]{0,24}";
const WORDS = `${W1}(?: ${W}){0,5}`;
const META = new Set(['.', '(', ')', '?', '*', '+', '|', '{', '}', '$']);
// R5D-SQL-2 (VEIL-37, the chair's E136 (a)): THE MASK IN THE NAME SLOT. Where an owner hides a power, the projection writes
// HIDDEN_POWER_MASK over the hidden power's label in every other string (publicSafe.js :: maskText, an exact split/join of the
// label), so a name or label slot that named it reads the mask, a fixed lower-case literal, at a sentence head as mid-sentence.
// Each slot takes that ONE literal as a further choice; never a widened charset. (A name that holds a hidden label after its
// own capital words, "Free Elder Council" -> "Free an unseen interest", is already words.)
export const MASK_RE = [...HIDDEN_POWER_MASK].map((c) => (META.has(c) ? `[${c}]` : c)).join('');
/** powerSentenceName's output: words only (the first of a slashed pair, a trailing bracket dropped; PROSE_FORMS are words);
 * or the mask. */
export const NAME_RE = `${WORDS}|${MASK_RE}`;
/** A raw roster label (master's and older engines named the power so): words, one optional slashed pair, one trailing bracket;
 * or the mask. N2b (RULING V27 (5), class (iii)): the bracket's words may open in LOWER case, as master's labels carry them
 * ("Merchant Guilds (dominant)": 10 master-born names); the head word of the label itself stays capital. */
const BRACKET_WORDS = `${W}(?: ${W}){0,5}`;
export const LABEL_RE = `${WORDS}(?: ?/ ?${WORDS})?(?: [(]${BRACKET_WORDS}[)])?|${MASK_RE}`;
const FORBIDDEN = /[\\^[\]`]|\$\{/; // no literal may hold these (they cannot be bracket-escaped alike, or break the carriers)

/** A literal, every metacharacter escaped as a one-character bracket ([.]): no backslash, so JSON, a JS template literal and a
 * SQL string carry it unchanged. */
export function escapeLit(s) {
  if (FORBIDDEN.test(s)) throw new Error(`standing forms: a literal holds a character the subset cannot carry: ${JSON.stringify(s)}`);
  return [...s].map((c) => (META.has(c) ? `[${c}]` : c)).join('');
}

// ── TOKENS ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const lit = (v) => ({ t: 'lit', v });
const slot = (k, values) => (values ? { t: 'slot', k, values } : { t: 'slot', k });
const ENDS = /[.!?]/;
function norm(tpl) {
  const out = [];
  for (const tok of tpl) {
    if (tok.t === 'lit' && !tok.v) continue;
    const last = out.at(-1);
    if (tok.t === 'lit' && last && last.t === 'lit') out[out.length - 1] = lit(last.v + tok.v);
    else out.push(tok);
  }
  return out;
}
const concat = (A, B) => A.flatMap((a) => B.map((b) => norm([...a, ...b])));
const SLOT_TEXT = { name: 'NAME', label: 'LABEL', force: 'BODY', count: 'N' };
const tokText = (tok) => (tok.t === 'lit' ? tok.v : tok.t === 'slot' ? SLOT_TEXT[tok.k] : `{${tok.alts.map(tokText).sort().join('|')}}`);
/** The human sentence: {NAME}, {LABEL}, {BODY}, {N}, and a choice as {a|b} (its parts sorted). */
export const templateOf = (tpl) => tpl.map((tok) => (tok.t === 'slot' ? `{${SLOT_TEXT[tok.k]}}` : tokText(tok))).join('');

/** A choice of single phrases; a shared leading or trailing space is factored out ("{have|has}", not "{ have| has}"). */
function choiceOf(alts) {
  const lits = alts.every((a) => a.t === 'lit');
  if (lits) {
    const pre = alts.every((a) => a.v.startsWith(' ')) ? ' ' : '';
    const post = alts.every((a) => a.v.endsWith(' ')) ? ' ' : '';
    const inner = alts.map((a) => lit(a.v.slice(pre.length, a.v.length - post.length)));
    return norm([lit(pre), { t: 'choice', alts: dedupTok(inner) }, lit(post)]);
  }
  return [{ t: 'choice', alts: dedupTok(alts) }];
}
function dedupTok(alts) {
  const seen = new Map();
  for (const a of alts) seen.set(JSON.stringify(a), a);
  return [...seen.values()].sort((x, y) => (tokText(x) < tokText(y) ? -1 : tokText(x) > tokText(y) ? 1 : 0));
}

// ── THE STATIC DERIVER ───────────────────────────────────────────────────────────────────────────────────────────────────────
class DeriveError extends Error {}
function walk(node, visit, stack = []) {
  if (!node || typeof node.type !== 'string') return;
  visit(node, stack);
  stack.push(node);
  for (const key of Object.keys(node)) {
    const v = node[key];
    if (Array.isArray(v)) for (const c of v) walk(c, visit, stack);
    else if (v && typeof v.type === 'string') walk(v, visit, stack);
  }
  stack.pop();
}
const isFn = (n) => /Function/.test(n.type);

/** The forms a source text appends: [{ template, tokens, line }] (sorted, deduplicated by template). */
export function deriveForms(source) {
  const ast = parse(source, { ecmaVersion: 'latest', sourceType: 'module', locations: true, allowHashBang: true });
  const decls = [];
  let append = null;
  walk(ast, (node, stack) => {
    if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
      const parentDecl = stack.at(-1);
      const scope = parentDecl && parentDecl.kind === 'var' ? [...stack].reverse().find(isFn) || ast : [...stack].reverse().find((s) => s.type === 'BlockStatement' || s.type === 'Program' || isFn(s)) || ast;
      decls.push({ name: node.id.name, init: node.init, scope });
    }
    if (node.type === 'FunctionDeclaration' && node.id) decls.push({ name: node.id.name, init: node, scope: [...stack].reverse().find((s) => s.type === 'BlockStatement' || s.type === 'Program' || isFn(s)) || ast });
    if (
      node.type === 'AssignmentExpression' && node.left.type === 'MemberExpression' && node.left.property.name === 'desc' &&
      node.right.type === 'ConditionalExpression' && node.right.alternate.type === 'Identifier' &&
      node.right.consequent.type === 'BinaryExpression' && node.right.consequent.right.type === 'Identifier' &&
      node.right.consequent.right.name === node.right.alternate.name
    ) append = { node, fn: [...stack].reverse().find(isFn), standing: node.right.alternate.name };
  });
  if (!append || !append.fn) throw new DeriveError('no final append `X.desc = X.desc ? X.desc + \' \' + S : S` inside a function');
  const S = append.standing;
  const resolveId = (name, at) => {
    const hits = decls.filter((d) => d.name === name && d.scope.start <= at.start && at.end <= d.scope.end);
    hits.sort((a, b) => (a.scope.end - a.scope.start) - (b.scope.end - b.scope.start));
    return hits[0] || null;
  };
  const fail = (node, why) => { throw new DeriveError(`line ${node.loc.start.line}: ${why} (${node.type})`); };
  const arrayValues = (node) => {
    let n = node;
    if (n.type === 'Identifier') n = resolveId(n.name, n)?.init || fail(node, `unresolved array ${node.name}`);
    if (n.type === 'CallExpression' && n.arguments.length === 1) n = n.arguments[0]; // Object.freeze([...])
    if (n.type !== 'ArrayExpression') fail(node, 'not an array of words');
    return n.elements.map((e) => (e.type === 'Literal' && typeof e.value === 'string' ? e.value : fail(e, 'not a word'))).filter(Boolean);
  };
  const returnsOf = (fnNode) => {
    if (fnNode.body.type !== 'BlockStatement') return [fnNode.body];
    const out = [];
    walk(fnNode.body, (n, stack) => { if (n.type === 'ReturnStatement' && !stack.some((s) => s !== fnNode && isFn(s))) out.push(n.argument); });
    return out;
  };
  const ev = (node, depth = 0) => {
    if (depth > 40) fail(node, 'too deep');
    switch (node.type) {
      case 'Literal':
        if (typeof node.value === 'string') return [norm([lit(node.value)])];
        if (node.value === null) return [];
        return fail(node, 'a non-string literal in a sentence');
      case 'TemplateLiteral': {
        let acc = [[]];
        node.quasis.forEach((q, i) => {
          acc = concat(acc, [[lit(q.value.cooked)]]);
          if (i < node.expressions.length) acc = concat(acc, ev(node.expressions[i], depth + 1));
        });
        return acc;
      }
      case 'BinaryExpression':
        if (node.operator !== '+') return fail(node, `operator ${node.operator}`);
        return concat(ev(node.left, depth + 1), ev(node.right, depth + 1));
      case 'ConditionalExpression': {
        const branches = node.test.type === 'Identifier' && node.test.name === S ? [node.alternate] : [node.consequent, node.alternate];
        const alts = branches.flatMap((b) => ev(b, depth + 1)).filter((tpl) => tpl.length);
        if (alts.length > 1 && alts.every((tpl) => tpl.length === 1 && !(tpl[0].t === 'lit' && ENDS.test(tpl[0].v)) && tpl[0].t !== 'choice'))
          return [choiceOf(alts.map((tpl) => tpl[0]))];
        return alts;
      }
      case 'ChainExpression': return ev(node.expression, depth + 1);
      case 'Identifier': {
        if (node.name === S) return fail(node, 'the standing read inside its own value');
        const d = resolveId(node.name, node);
        if (!d || !d.init) return fail(node, `unresolved ${node.name}`);
        return ev(d.init, depth + 1);
      }
      case 'MemberExpression':
        if (!node.computed && node.property.name === 'faction') return [[slot('label')]];
        if (!node.computed && node.property.name === 'body') return [[slot('force')]];
        return fail(node, 'a member that is no name, label or force');
      case 'CallExpression': {
        const c = node.callee;
        if (c.type === 'Identifier' && c.name === 'powerSentenceName') return [[slot('name')]];
        if (c.type === 'MemberExpression' && !c.computed && c.property.name === 'replace') {
          const [re, by] = node.arguments;
          const m = re && re.regex && /^\^([A-Za-z]+)$/.exec(re.regex.pattern);
          if (!m || !by || by.type !== 'MemberExpression' || !by.computed) return fail(node, 'a replace that is no count');
          const values = arrayValues(by.object);
          return ev(c.object, depth + 1).map((tpl) => {
            if (!tpl[0] || tpl[0].t !== 'lit' || !tpl[0].v.startsWith(m[1])) return fail(node, 'the count word is not the sentence head');
            return norm([slot('count', values), lit(tpl[0].v.slice(m[1].length)), ...tpl.slice(1)]);
          });
        }
        if (c.type === 'Identifier') {
          const d = resolveId(c.name, c);
          const fnNode = d && d.init && isFn(d.init) ? d.init : null;
          if (!fnNode) return fail(node, `a call to ${c.name}, no local helper`);
          return returnsOf(fnNode).flatMap((r) => ev(r, depth + 1));
        }
        return fail(node, 'a call the deriver cannot read');
      }
      default:
        return fail(node, 'a shape the deriver cannot read');
    }
  };
  const forms = new Map();
  walk(append.fn, (node) => {
    if (node.type !== 'AssignmentExpression' || node.operator !== '=' || node.left.type !== 'Identifier' || node.left.name !== S) return;
    let v = node.right;
    if (v.type === 'Identifier' && v.name === S) return;
    if (v.type === 'ConditionalExpression' && v.test.type === 'Identifier' && v.test.name === S) v = v.alternate;
    for (const tokens of ev(v)) if (tokens.length) forms.set(templateOf(tokens), { template: templateOf(tokens), tokens, line: node.loc.start.line });
  });
  return [...forms.values()].sort((a, b) => (a.template < b.template ? -1 : 1));
}

// ── PATTERNS AND SAMPLES ─────────────────────────────────────────────────────────────────────────────────────────────────────
/** The force's body words, read from their one writer (defenseFacts.js :: *_WORDS). */
export function forceWords(root = ROOT) {
  const src = readFileSync(join(root, FORCE_PATH), 'utf8');
  return [...src.matchAll(/_WORDS = Object\.freeze\(\{ body: '([^']+)'/g)].map((m) => m[1]).sort();
}
const altRe = (values) => `(?:${[...values].sort().map(escapeLit).join('|')})`;
function tokRe(tok, force) {
  if (tok.t === 'lit') return escapeLit(tok.v);
  if (tok.t === 'choice') return `(?:${tok.alts.map((a) => tokRe(a, force)).sort().join('|')})`;
  if (tok.k === 'name') return `(?:${NAME_RE})`;
  if (tok.k === 'label') return `(?:${LABEL_RE})`;
  if (tok.k === 'force') return altRe(force);
  if (tok.k === 'count') return altRe(tok.values);
  throw new Error(`standing forms: unknown slot ${tok.k}`);
}
/** A form's pattern, anchored at the tail. */
export const reOf = (tokens, force) => `${tokens.map((t) => tokRe(t, force)).join('')}$`;
const slotsOf = (tokens) => {
  const out = new Set();
  const see = (t) => { if (t.t === 'slot') out.add(t.k); if (t.t === 'choice') { out.add('choice'); t.alts.forEach(see); } };
  tokens.forEach(see);
  return [...out].sort();
};

/** Every value a token takes over the samples. */
function tokValues(tok, samples) {
  if (tok.t === 'lit') return [tok.v];
  if (tok.t === 'choice') return tok.alts.flatMap((a) => tokValues(a, samples));
  if (tok.k === 'name') return samples.names;
  if (tok.k === 'label') return samples.labels;
  if (tok.k === 'force') return samples.force;
  return tok.values;
}
/** A covering expansion: every value of every slot appears (sample i takes value i mod n, the slots offset), not the product. */
export function expandTokens(tokens, samples) {
  const vals = tokens.map((t) => tokValues(t, samples));
  const n = Math.max(1, ...vals.map((v) => v.length));
  const out = new Set();
  for (let i = 0; i < n; i += 1) out.add(vals.map((v, k) => v[(i + k * 7) % v.length]).join(''));
  return [...out];
}

// ── THE CUT (one for both engines: the header's `cut`) ───────────────────────────────────────────────────────────────────────
/** Compile the table's rows once: [{ id, re: RegExp }]; the cut's regex is `(?:^| )(` + re + `)`. */
export const compileRows = (rows) => rows.map((r) => ({ id: r.id, re: new RegExp(`(?:^| )(${r.re})`) }));
/** The JS reference cut: strip, from the tail, the LONGEST tail that is one row (the earliest match start), and its joining
 * space; again, while a row matches (the engine joins its notes with one space: rank line + rivalry notes). */
export function cutDesc(desc, compiled) {
  let rest = String(desc ?? '');
  const ids = [];
  for (;;) {
    let best = null;
    for (const r of compiled) {
      const m = r.re.exec(rest);
      if (m && (!best || m.index < best.at || (m.index === best.at && r.id < best.id))) best = { id: r.id, at: m.index };
    }
    if (!best) break;
    ids.unshift(best.id);
    rest = rest.slice(0, best.at);
  }
  const desc0 = String(desc ?? '');
  return ids.length ? { base: rest, standing: desc0.slice(rest.length ? rest.length + 1 : 0), ids } : null;
}

// ── THE TABLE ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const readTable = (path = DATA_PATH) => JSON.parse(readFileSync(path, 'utf8'));
/** THE ONE LITERAL both engines carry: an object keyed by id, sorted, one row per line, {kind, re}; no timestamps. */
export function literalOf(table) {
  const rows = [...table.forms].sort((a, b) => (a.id < b.id ? -1 : 1));
  const text = `{\n${rows.map((r) => `  ${JSON.stringify(r.id)}: {"kind": ${JSON.stringify(r.kind)}, "re": ${JSON.stringify(r.re)}}`).join(',\n')}\n}`;
  if (/\\|`|\$\{/.test(text)) throw new Error('standing forms: the literal holds a backslash, a backtick or ${: it would not survive its carriers');
  return text;
}
export const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

/** Does row R's language hold every sentence of form F? (a closed F: R's re matches it whole; else token by token, a NAME
 * inside a LABEL, a choice inside a wider choice). */
export function subsumes(R, F, force) {
  if (F.every((t) => t.t === 'lit')) return new RegExp(`^(?:${reOf(R, force)})`).test(F.map((t) => t.v).join(''));
  return R.length === F.length && R.every((r, i) => tokSub(r, F[i]));
}
function tokSub(r, f) {
  if (r.t === 'lit') return f.t === 'lit' && f.v === r.v;
  if (r.t === 'slot') return f.t === 'slot' && (f.k === r.k ? r.k !== 'count' || f.values.every((v) => r.values.includes(v)) : r.k === 'label' && f.k === 'name');
  return (f.t === 'choice' ? f.alts : [f]).every((a) => r.alts.some((ra) => tokSub(ra, a)));
}

function check({ file } = {}) {
  const table = readTable();
  const force = forceWords();
  const errors = [];
  if (JSON.stringify(force) !== JSON.stringify(table.header.samples.force)) errors.push(`the force's body words moved: ${force.join(', ')}`);
  const byTemplate = new Map(table.forms.map((r) => [r.template, r]));
  const src = readFileSync(file ? resolve(file) : join(ROOT, TIP_PATH), 'utf8');
  for (const f of deriveForms(src)) {
    const row = byTemplate.get(f.template) || table.forms.find((r) => subsumes(r.tokens, f.tokens, force));
    if (!row) errors.push(`line ${f.line}: no row holds the form "${f.template}"`);
    else if (row.re !== reOf(row.tokens, force)) errors.push(`${row.id}: its re is not its own template's pattern`);
  }
  const compiled = compileRows(table.forms);
  for (const row of table.forms) {
    const re = new RegExp(`^(?:${row.re})`);
    for (const s of expandTokens(row.tokens, table.header.samples)) {
      if (!re.test(s)) errors.push(`${row.id}: its re does not match its own template's sample "${s}"`);
      const cut = cutDesc(s, compiled);
      if (!cut || cut.base !== '') errors.push(`${row.id}: its sample does not cut whole: "${s}"`);
    }
  }
  if (errors.length) {
    console.error(`standing forms --check: RED (${errors.length})\n  ${errors.slice(0, 40).join('\n  ')}\n${CHECK_MESSAGE}`);
    return 1;
  }
  console.log(`standing forms --check: green (${table.forms.length} rows; ${file ? file : TIP_PATH} derives none outside them)`);
  return 0;
}

// ── --write: the table from tip, master and master's history (read-only git) ─────────────────────────────────────────────────
const REPO_VARS = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY', 'GIT_PREFIX', 'GIT_NAMESPACE'];
const gitEnv = () => Object.fromEntries(Object.entries(process.env).filter(([k]) => !REPO_VARS.includes(k)));
const git = (...args) => execFileSync('git', args, { cwd: ROOT, env: gitEnv(), encoding: 'utf8', maxBuffer: 64 << 20 });
const OLD_PATH = 'src/generators/powerGenerator.js';
/** Master's versions of the writer, oldest first: [{ origin, path, sha }] (the file, then its body inside powerGenerator.js). */
function masterVersions(master) {
  const own = git('log', '--format=%h', master, '--', TIP_PATH).trim().split('\n').filter(Boolean);
  const birth = own.at(-1);
  const old = git('log', '--format=%h', `${birth}^`, '--', OLD_PATH).trim().split('\n').filter(Boolean);
  return [...old.reverse().map((sha) => ({ sha, path: OLD_PATH })), ...own.reverse().map((sha) => ({ sha, path: TIP_PATH }))];
}
export const ID_FILE = join(ROOT, 'scripts', 'veil', 'standingForms.ids.json');
function write() {
  const ids = JSON.parse(readFileSync(ID_FILE, 'utf8'));
  const prior = (() => { try { return readTable(); } catch { return null; } })();
  const force = forceWords();
  const rows = (prior?.forms || []).map((r) => ({ ...r, origins: [...r.origins] }));
  // DEDUPLICATED: a form is one row with the row that already holds its every sentence (or that it widens: the row keeps its
  // id, tip's before master's before history's, and takes the wider template), so a sentence two engines write is ONE row.
  const add = (forms, origin) => {
    for (const f of forms) {
      let row = rows.find((r) => r.template === f.template) || rows.find((r) => subsumes(r.tokens, f.tokens, force));
      if (!row) {
        row = rows.find((r) => subsumes(f.tokens, r.tokens, force));
        if (row) Object.assign(row, { template: f.template, tokens: f.tokens });
      }
      if (!row) {
        const id = ids[f.template];
        if (!id) throw new Error(`standing forms --write: no id for "${f.template}" (add it to standingForms.ids.json)`);
        row = { id, origins: [], template: f.template, tokens: f.tokens };
        rows.push(row);
      }
      Object.assign(row, { slots: slotsOf(row.tokens), kind: slotsOf(row.tokens).length ? 'pattern' : 'closed', re: reOf(row.tokens, force) });
      if (!row.origins.includes(origin)) row.origins.push(origin);
    }
  };
  add(deriveForms(readFileSync(join(ROOT, TIP_PATH), 'utf8')), 'tip');
  const master = 'origin/master';
  const versions = masterVersions(master);
  const head = versions.at(-1);
  if (git('rev-parse', `${master}:${TIP_PATH}`).trim() !== git('rev-parse', `${head.sha}:${TIP_PATH}`).trim()) throw new Error('origin/master\'s file is not its last commit\'s');
  add(deriveForms(git('show', `${head.sha}:${TIP_PATH}`)), `master@${head.sha}:${TIP_PATH}`);
  let before = new Set();
  for (const v of versions) {
    const forms = deriveForms(git('show', `${v.sha}:${v.path}`));
    const now = new Set(forms.map((f) => f.template));
    add(forms.filter((f) => !before.has(f.template)), `history@${v.sha}:${v.path}`); // where `git log -S` finds it born
    before = now;
  }
  const forms = rows.map((r) => ({ ...r, origins: [...r.origins].sort() })).sort((a, b) => (a.id < b.id ? -1 : 1));
  const dup = forms.map((r) => r.id).filter((id, i, all) => all.indexOf(id) !== i);
  if (dup.length) throw new Error(`standing forms --write: one id on two forms: ${dup.join(', ')}`);
  const labels = [...SAMPLE_LABELS, HIDDEN_POWER_MASK].sort(); // E136 (a): the mask, a slot's further value
  const names = [...new Set(labels.map(powerSentenceName))].sort();
  const header = { ...HEADER, samples: { names, labels, force }, slotPatterns: { name: NAME_RE, label: LABEL_RE }, master: `${master}@${git('rev-parse', '--short', master).trim()}` };
  const ordered = forms.map((r) => ({ id: r.id, kind: r.kind, slots: r.slots, origins: r.origins, template: r.template, re: r.re, tokens: r.tokens }));
  const text = `{\n"header": ${JSON.stringify(header, null, 2)},\n"forms": [\n${ordered.map((r) => JSON.stringify(r)).join(',\n')}\n]\n}\n`;
  writeFileSync(DATA_PATH, text);
  console.log(`standing forms --write: ${forms.length} rows -> ${DATA_PATH}`);
  return 0;
}

/** Real power labels (the engine's, 1,800 births of the tip at r5dforms-0..899, every size; and stressPowerFaces.js's). */
const SAMPLE_LABELS = [
  'Arcane Orders', 'City Council', 'City-State Council', 'Craft Guilds', "Creditor's Representative", 'Crown Creditors (Noble Coalition)',
  'Democratic assembly', 'Ducal Governorship', 'Elder Council', 'Elected Reeve', 'Feudal Appointee', 'Feudal Stewardship',
  'Free Elder Council', 'Grain Holders', 'Grand Council', 'Grand Guild Consortium', 'Grand Merchant Oligarchy', 'Guild Council',
  "Headman's Authority", 'Household Council', "Journeymen's League", 'Landed Gentry', 'Loyalist Noble Bloc', 'Manor Household',
  'Merchant Guild Council', 'Merchant Guilds', 'Merchant oligarchy', 'Military Party', 'Military/Guard', 'Monster Hunters / Adventurers',
  'New Faith Community', "Newcomers' Settlement", 'Noble Families', 'Noble Governorship', 'Noble Houses', 'Occupation Authority',
  'Peace Movement', "People's Council", 'Quarantine Council', 'Reform Congregation', 'Reform Movement', 'Reform Noble Bloc',
  'Religious Authorities', 'Resistance Network', 'Royal Authority', 'The Free Alliance', 'The Highborn Circle', 'The Independent Bloc',
  'The Inquiry', 'The Peerage', "Thieves' Guild", 'Third Bloc (Neutrals)', 'Town Council', 'Town Mayor', 'War Council',
  'Loyalist Noble Opposition', 'Underground Old Faith', 'Conversion Enforcement Office', 'Noble Claimant (Senior Line)',
  'Noble Claimant (Reform Line)', 'Shadow Senate', 'Corrupt City Council', 'High Theocratic Council', 'Grand Military Council',
  'Merchant Guilds (dominant)', // N2b: a real master label, its bracket in lower case, so --check exercises the widened slot
];
const HEADER = {
  name: 'STANDING_FORMS',
  cut:
    'A stored desc is <base> or <base> <standing>; the standing is always the TAIL (R5D-0 Q3), written by annotateFactionStanding as ' +
    'one or more forms joined by one space (a rank line, then rivalry notes). THE CUT: find, over every row, the match of ' +
    '"(?:^| )(" + re + ")" in the remaining text (re ends in $, so a match is a tail; its span is fixed by its EARLIEST start and ' +
    'the $ anchor, so the two engines\' alternation preferences cannot move it); remove the LONGEST (earliest-starting; a tie by ' +
    'the smaller id) with its joining space; repeat while a row matches. No row matches: the desc is served as it is (a base, ' +
    'E121 (b)). Patterns: Postgres ARE and JavaScript RegExp alike, case-sensitive, no flags, no \\b, no named groups, no ' +
    'backslash at all (a metacharacter is a one-character bracket, [.]), only (?:...), [...], bounded {m,n}; the name slot is ' +
    'bounded by powerSentenceName (words of letters, apostrophes and hyphens, at most six, no sentence end), never .* or .+.',
  slots: {
    name: 'powerSentenceName(<a power>) (data/people/powerSentenceName.js), the tip\'s; in a choice with the engine\'s literals',
    label: 'a raw roster label (master and older engines printed f.faction): NAME words, one slashed pair, one trailing bracket',
    mask: 'E136 (a): a name or label slot also takes the projection\'s mask, the one literal "an unseen interest" (publicSafe.js :: ' +
      'HIDDEN_POWER_MASK, which maskText writes over a hidden power\'s label), in its own lower case wherever the slot stands',
    force: 'force.body (defense/defenseFacts.js :: forceWordsOf); older engines wrote the literal garrison (a closed form)',
    count: 'LEVEL_COUNT_WORDS[n] at the sentence head (Three..Many)',
    choice: 'a conditional between single phrases inside one sentence ({have|has}, {council vote|decision}, {NAME|the second power})',
  },
  grows: 'Rows only GROW: a stored document keeps the form its engine wrote. A changed form ships WITH a migration adding it to 212.',
};

function main(argv) {
  const [mode, arg] = argv;
  if (mode === '--print') {
    const text = literalOf(readTable());
    process.stdout.write(`// STANDING_FORMS begin\n${text}\n// STANDING_FORMS end\nsha256 ${sha256(text)} length ${text.length}\n`);
    return 0;
  }
  if (mode === '--derive' && arg) {
    for (const f of deriveForms(readFileSync(resolve(arg), 'utf8'))) console.log(`${String(f.line).padStart(5)}  ${f.template}`);
    return 0;
  }
  if (mode === '--check') return check({ file: argv[1] === '--file' ? argv[2] : undefined });
  if (mode === '--cut' && arg !== undefined) {
    const cut = cutDesc(arg, compileRows(readTable().forms));
    console.log(cut ? JSON.stringify(cut, null, 1) : 'no match');
    return 0;
  }
  if (mode === '--write') return write();
  console.error('standing forms: --print | --derive <path> | --check [--file <path>] | --cut <desc> | --write');
  return 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
