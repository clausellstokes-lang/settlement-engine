/**
 * rosterChoiceRegistry.walker.test.js — THE ROSTER-CHOICE REGISTRY'S WALKER (ruling VR7; SUB-BRIEF-VR7 design points
 * 3 to 5, stage R1). One module, two engines, a walker binding them.
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────
 * A house the DM hides whole chooses fields of the town at its birth (a sentence, a flag, a number, a power, a tie).
 * src/domain/veil/rosterChoiceRegistry.js lists every such payload path with the rule the veil applies to it, the
 * chooser that wrote it, and where the rule lives in the server (212) and the client twin. A NEW chooser added next
 * month would not know any of that. This walker makes it know.
 *
 * ── THE ARMS (each red first by a plant, the plant then removed: the hand-back under docs/chair/2026-11-20/veil/r1/)
 *   A  A CALL OF A REGISTERED PREDICATE (REGISTERED_PREDICATES) from a site in src/generators/** or the composer's
 *      reach (src/components/new/publicProseCompose.js and every src module it imports, transitively) that
 *      REGISTRY_SITES does not name reds; so does a registered site that no longer calls or holds anything.
 *   B  A REGEX LITERAL matching CRIME_NAME_PATTERN at a site REGISTRY_SITES does not name reds, and a site's count of
 *      such literals is exact (a new literal at a registered site reds too).
 *   C  A ROW WITH NO `server` OR `twin` SYMBOL reds, and each must be a declared host of its own engine (REGISTRY_HOSTS);
 *      a host declared 'exists' must exist.
 *   D  A BUILT ROW whose server symbol is not a function of 212, or whose twin symbol is not a top-level declaration
 *      of its file, reds; and so does one whose rule does not name its row id in that symbol's body
 *      (`-- registry: <id>` in 212, `// registry: <id>` in the twin). R1 marks no row built.
 *   E  The rows themselves: unique ids, anchored paths that compile, known inputs with no cycle, every site's rows
 *      known; and the committed export (docs/chair/2026-11-19/veil/registry/) is exactly what the module writes.
 * Every source file in the census parses (ZERO parse failures, asserted), so a file that stops parsing reds instead
 * of quietly leaving the denominator; the census itself is proven on a synthetic source first (its own controls).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'espree';
import { describe, expect, test } from 'vitest';
import {
  CRIME_NAME_PATTERN,
  REGISTERED_PREDICATES,
  REGISTRY_HOSTS,
  REGISTRY_ROWS,
  REGISTRY_SITES,
  derivedRule,
} from '../../src/domain/veil/rosterChoiceRegistry.js';
import { driftedFiles } from '../../scripts/veil/rosterChoiceRegistry.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MIGRATION_212 = 'supabase/migrations/212_share_veil_later_cures.sql';
const COMPOSER = 'src/components/new/publicProseCompose.js';
const CRIME_RE = new RegExp(CRIME_NAME_PATTERN.source, CRIME_NAME_PATTERN.flags);
const PREDICATES = new Set(REGISTERED_PREDICATES);

const parseSource = (text) => parse(text, { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true }, range: true });

function walkDir(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkDir(p, out);
    else if (/\.(js|jsx|mjs)$/.test(name) && !/\.test\./.test(name)) out.push(relative(ROOT, p));
  }
  return out;
}

/** The composer's reach: the composer and every src module it imports, transitively (relative specifiers). */
function composerReach() {
  const seen = new Set();
  const queue = [COMPOSER];
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    for (const node of parseSource(readFileSync(join(ROOT, file), 'utf8')).body) {
      const spec = node.source && typeof node.source.value === 'string' ? node.source.value : null;
      if (!spec || !spec.startsWith('.')) continue;
      let target = relative(ROOT, resolve(dirname(join(ROOT, file)), spec));
      if (!existsSync(join(ROOT, target)) && existsSync(join(ROOT, `${target}.js`))) target = `${target}.js`;
      if (target.startsWith('src/') && existsSync(join(ROOT, target)) && statSync(join(ROOT, target)).isFile()) queue.push(target);
    }
  }
  return seen;
}

/** A top-level statement's symbol: its declared name(s), or `registerStep(<step>)` for a top-level call. */
function symbolOf(node) {
  const d = node.declaration || node;
  if (d.type === 'FunctionDeclaration' || d.type === 'ClassDeclaration') return d.id ? d.id.name : 'default';
  if (d.type === 'VariableDeclaration') return d.declarations.map((x) => (x.id && x.id.name) || '?').join(',');
  if (d.type === 'ExpressionStatement' && d.expression.type === 'CallExpression') {
    const call = d.expression;
    const first = call.arguments[0];
    return `${call.callee.name || '?'}(${first && first.type === 'Literal' ? first.value : ''})`;
  }
  return d.type === 'Identifier' ? d.name : `<${d.type}>`;
}

/** The census of one source text: site symbol -> { calls: Set of registered predicates called, rx: crime literals }. */
function censusOf(text, file) {
  const sites = new Map();
  const at = (key) => {
    if (!sites.has(key)) sites.set(key, { calls: new Set(), rx: 0 });
    return sites.get(key);
  };
  for (const top of parseSource(text).body) {
    const key = `${file} :: ${symbolOf(top)}`;
    const visit = (node) => {
      if (!node || typeof node.type !== 'string') return;
      if (node.type === 'CallExpression') {
        const c = node.callee;
        const name = c.type === 'Identifier' ? c.name : c.type === 'MemberExpression' && !c.computed ? c.property.name : null;
        if (name && PREDICATES.has(name)) at(key).calls.add(name);
      }
      if (node.type === 'Literal' && node.regex && CRIME_RE.test(node.regex.pattern)) at(key).rx += 1;
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (Array.isArray(v)) v.forEach(visit);
        else if (v && typeof v === 'object' && typeof v.type === 'string') visit(v);
      }
    };
    visit(top);
  }
  return sites;
}

function liveCensus() {
  const files = [...new Set([...walkDir(join(ROOT, 'src', 'generators')), ...composerReach()])].sort();
  const sites = new Map();
  const failures = [];
  for (const file of files) {
    let found;
    try { found = censusOf(readFileSync(join(ROOT, file), 'utf8'), file); } catch (e) { failures.push(`${file}: ${e.message}`); continue; }
    for (const [k, v] of found) sites.set(k, v);
  }
  return { files, sites, failures };
}

/** The body of `create or replace function <name>(` in 212, to the next function or the end. */
function sqlFunctionBody(sql, name) {
  const head = new RegExp(`^create\\s+or\\s+replace\\s+function\\s+${name.replace(/[.$]/g, '\\$&')}\\(`, 'im');
  const m = head.exec(sql);
  if (!m) return null;
  const rest = sql.slice(m.index + m[0].length);
  const next = rest.search(/^create\s+or\s+replace\s+function\s/im);
  return next < 0 ? rest : rest.slice(0, next);
}

/** The source text of a top-level declaration named `name` in `file`, or null. */
function twinDeclaration(file, name) {
  const text = readFileSync(join(ROOT, file), 'utf8');
  for (const node of parseSource(text).body) {
    if (symbolOf(node).split(',').includes(name)) return text.slice(node.range[0], node.range[1]);
  }
  return null;
}

const splitTwin = (twin) => {
  const [file, name] = String(twin).split(' :: ');
  return { file, name };
};

describe('the census proves itself on a synthetic source (its own controls)', () => {
  test('a planted predicate call, a planted crime-name regex and a registerStep site are each found', () => {
    const text = [
      "import { isCriminalInstitution } from './x.js';",
      'export function chooser(h) { return isCriminalInstitution(h) || /black market/i.test(h.name); }',
      'const QUIET = /harbour/;',
      "registerStep('plantStep', { run: (c) => c.getInstFlags(c, []) });",
    ].join('\n');
    const found = censusOf(text, 'src/generators/plant.js');
    expect([...found.keys()].sort()).toEqual(['src/generators/plant.js :: chooser', 'src/generators/plant.js :: registerStep(plantStep)']);
    expect([...found.get('src/generators/plant.js :: chooser').calls]).toEqual(['isCriminalInstitution']);
    expect(found.get('src/generators/plant.js :: chooser').rx).toBe(1);
    expect([...found.get('src/generators/plant.js :: registerStep(plantStep)').calls]).toEqual(['getInstFlags']);
  });
});

describe('ARMS A and B: every chooser site in src/generators/** and the composer\'s reach is registered', () => {
  const { files, sites, failures } = liveCensus();

  test('the census reads every file in scope (zero parse failures) and reaches past the generators', () => {
    expect(failures).toEqual([]);
    expect(files.some((f) => f.startsWith('src/generators/'))).toBe(true);
    expect(files).toContain(COMPOSER);
  });

  test('ARM A: a site that calls a registered predicate, or holds a crime-name regex, is in REGISTRY_SITES; a registered site still does', () => {
    const live = [...sites.keys()].sort();
    const registered = Object.keys(REGISTRY_SITES).sort();
    expect(live.filter((k) => !REGISTRY_SITES[k]), 'an UNREGISTERED chooser site: register it in REGISTRY_SITES with its rows').toEqual([]);
    expect(registered.filter((k) => !sites.has(k)), 'a registered site that no longer chooses: strike it').toEqual([]);
  });

  test('ARM B: each site\'s count of crime-name regex literals is exact (a new literal at a registered site reds)', () => {
    const wrong = [...sites.entries()]
      .filter(([k, v]) => REGISTRY_SITES[k] && (REGISTRY_SITES[k].rx ?? 0) !== v.rx)
      .map(([k, v]) => `${k}: registered ${REGISTRY_SITES[k].rx ?? 0}, found ${v.rx}`);
    expect(wrong).toEqual([]);
  });

  test('every registered site names the rows it chooses (known ids) or why it chooses no served path', () => {
    const ids = new Set(REGISTRY_ROWS.map((r) => r.id));
    const bad = Object.entries(REGISTRY_SITES).flatMap(([k, s]) => {
      const rows = s.rows ?? [];
      if (!rows.length && !(typeof s.why === 'string' && s.why.length >= 20)) return [`${k}: neither rows nor a reason`];
      return rows.filter((id) => !ids.has(id)).map((id) => `${k}: unknown row ${id}`);
    });
    expect(bad).toEqual([]);
  });
});

describe('ARMS C and D: every row is bound to the server and the twin', () => {
  const sql = readFileSync(join(ROOT, MIGRATION_212), 'utf8');

  test('ARM C: every row names a server and a twin symbol, each a declared host of its own engine', () => {
    const bad = REGISTRY_ROWS.flatMap((r) => {
      const out = [];
      if (!r.server) out.push(`${r.id}: no server symbol`);
      else if (REGISTRY_HOSTS[r.server]?.engine !== 'server') out.push(`${r.id}: server ${r.server} is not a declared server host`);
      if (!r.twin) out.push(`${r.id}: no twin symbol`);
      else if (REGISTRY_HOSTS[r.twin]?.engine !== 'twin') out.push(`${r.id}: twin ${r.twin} is not a declared twin host`);
      return out;
    });
    expect(bad).toEqual([]);
  });

  test('ARM C: a host declared as existing exists (a 212 function; a top-level declaration of its file)', () => {
    const bad = Object.entries(REGISTRY_HOSTS).filter(([, h]) => h.state === 'exists').flatMap(([sym, h]) => {
      if (h.engine === 'server') return sqlFunctionBody(sql, sym) === null ? [sym] : [];
      const { file, name } = splitTwin(sym);
      return existsSync(join(ROOT, file)) && twinDeclaration(file, name) !== null ? [] : [sym];
    });
    expect(bad).toEqual([]);
  });

  test('ARM D: a BUILT row\'s symbols exist and each rule names its row id', () => {
    // a built rng (VR13) or diffuse (VR8) row is a ruling: the server sends it as stored, so no rule names it
    const bad = REGISTRY_ROWS.filter((r) => r.built && (r.rule === 'withhold' || r.rule === 'recompose')).flatMap((r) => {
      const out = [];
      const body = sqlFunctionBody(sql, r.server);
      if (body === null) out.push(`${r.id}: server ${r.server} is not a function of 212`);
      else if (!body.includes(`-- registry: ${r.id}`)) out.push(`${r.id}: ${r.server} does not name it (-- registry: ${r.id})`);
      const { file, name } = splitTwin(r.twin);
      const decl = file && existsSync(join(ROOT, file)) ? twinDeclaration(file, name) : null;
      if (decl === null) out.push(`${r.id}: twin ${r.twin} is not a top-level declaration`);
      else if (!decl.includes(`// registry: ${r.id}`)) out.push(`${r.id}: ${r.twin} does not name it (// registry: ${r.id})`);
      return out;
    });
    expect(bad).toEqual([]);
  });
});

describe('ARM E: the rows and the export', () => {
  test('ids are unique, every path is an anchored regex that compiles, every input is known, and no composition cycles', () => {
    const ids = REGISTRY_ROWS.map((r) => r.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    const byId = new Map(REGISTRY_ROWS.map((r) => [r.id, r]));
    const bad = REGISTRY_ROWS.flatMap((r) => {
      const out = [];
      if (!r.path.startsWith('^')) out.push(`${r.id}: path not anchored`);
      try { new RegExp(r.path); } catch { out.push(`${r.id}: path does not compile`); }
      for (const id of r.inputs) if (!byId.has(id)) out.push(`${r.id}: unknown input ${id}`);
      if (r.inputs.length && r.compose === null) out.push(`${r.id}: a composed row without its compose answer`);
      try {
        const d = derivedRule(r, byId);
        if (d.rule !== r.rule || d.when !== r.when) out.push(`${r.id}: rule not derived (VR12)`);
      } catch (e) { out.push(`${r.id}: ${e.message}`); }
      if (!['withhold', 'recompose', 'diffuse', 'rng'].includes(r.rule)) out.push(`${r.id}: unknown rule`);
      if (!['always', 'house-hidden'].includes(r.when)) out.push(`${r.id}: unknown when`);
      if (!r.writer.includes(' :: ')) out.push(`${r.id}: writer is not path :: symbol`);
      return out;
    });
    expect(bad).toEqual([]);
  });

  test('VR19, VR13, VR8, V10-1: a page answer only on a value withheld on every read; every rng row built; a diffuse row built exactly when its condition is; a copy takes its source\'s rule', () => {
    const byId = new Map(REGISTRY_ROWS.map((r) => [r.id, r]));
    const bad = REGISTRY_ROWS.flatMap((r) => {
      const out = [];
      if (r.page !== null && !(r.when === 'always' && (r.rule === 'withhold' || r.rule === 'recompose'))) out.push(`${r.id}: a page answer on a row not withheld on every read`);
      if (r.rule === 'rng' && !r.built) out.push(`${r.id}: an rng row not built (VR13 is a ruling)`);
      if (r.rule === 'diffuse') {
        if (!r.condition.length) out.push(`${r.id}: a diffuse row with no condition`);
        for (const id of r.condition) if (!byId.has(id)) out.push(`${r.id}: unknown condition row ${id}`);
        if (r.built !== (r.condition.length > 0 && r.condition.every((id) => byId.get(id)?.built))) out.push(`${r.id}: built is not its condition's`);
      }
      if (r.copyOf) {
        const src = byId.get(r.copyOf);
        if (!src) out.push(`${r.id}: copies an unknown row`);
        else if (src.rule !== r.rule || src.when !== r.when) out.push(`${r.id}: not its source's rule`);
      }
      return out;
    });
    expect(bad).toEqual([]);
  });

  test('the committed registry.json and rulings.json are exactly what the module writes (--check)', () => {
    expect(driftedFiles()).toEqual([]);
  });
});
