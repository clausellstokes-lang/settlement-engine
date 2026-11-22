// docs/chair/2026-11-07/people-5-prep/ast-sites.mjs — PEOPLE-5-PREP's syntax-tree pass (measure-only).
// Every site in a set of JS/JSX files that touches the NPC grouping `settlement.factions`
// (its `members[]`, `dominantCategory`), the six per-NPC faction fields, or the three helpers.
// Parsed with espree (the parser `scripts/wiring-census.mjs :: astTokens` uses), JSX on; a file
// that fails to parse is NAMED, never silently skipped. Grep is the cross-check only (census.mjs).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'espree';

export const FIELDS = Object.freeze([
  'factionAffiliation', 'secondaryAffiliation', 'linkedFactionIds', 'factionGoal',
  'densityRungRole', 'structuralRank',
]);
export const GROUP_KEYS = Object.freeze(['dominantCategory']);
export const HELPERS = Object.freeze(['npcInFaction', 'factionRosterOf', 'npcHomeInstitution']);
const PATH_NAMES = Object.freeze([...FIELDS, ...GROUP_KEYS]);
/** A key-path spelled as a string (`'npcs[].factionAffiliation'`, a template's `].structuralRank`):
 *  no whitespace, and the name sits between path separators. Prose that merely mentions a name is not one. */
const isPathString = (text, name) => !/\s/.test(text) && text !== name
  && new RegExp(`(^|[.\\]])${name}($|[.\\[])`).test(text);
const OPTIONS = Object.freeze({ ecmaVersion: 2024, sourceType: 'module', loc: true, range: true, ecmaFeatures: { jsx: true } });

export function filesUnder(root, dir, { tests = false } = {}, out = []) {
  for (const name of readdirSync(join(root, dir))) {
    const rel = join(dir, name);
    const abs = join(root, rel);
    if (statSync(abs).isDirectory()) { if (name === 'node_modules') continue; filesUnder(root, rel, { tests }, out); continue; }
    if (!/\.(m?js|jsx)$/.test(name)) continue;
    const isTest = /__tests__|\.test\.|\.spec\./.test(rel);
    if (isTest !== tests && !tests) continue;
    out.push(rel);
  }
  return out;
}

/** The receiver's source text, whitespace collapsed, optional-chain dots normalized. */
const textOf = (src, node) => src.slice(node.range[0], node.range[1]).replace(/\s+/g, ' ').replace(/\?\./g, '.');
const propName = (node, computed) => {
  if (!node) return '';
  if (!computed && node.type === 'Identifier') return node.name;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  return '';
};

/**
 * @returns {{ parsed: boolean, sites: Array<{name, kind, line, receiver?: string}> }}
 * kind: read (member read) · destructure (pattern read) · write (assign target / literal key) ·
 *       delete · string (the name as a string literal outside a member/property key: a dynamic
 *       key list, e.g. SEAT_FIELDS or a veil list) · import · call · mention (helper identifier) · def
 */
export function sitesIn(src) {
  let root;
  try { root = parse(src, OPTIONS); } catch (e) { return { parsed: false, error: String(e.message), sites: [] }; }
  const sites = [];
  const WATCH = new Set([...FIELDS, ...GROUP_KEYS, 'factions', 'members']);
  const HELP = new Set(HELPERS);
  const walk = (node, parent, parentKey) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { for (const c of node) walk(c, parent, parentKey); return; }
    if (typeof node.type !== 'string') return;
    switch (node.type) {
      case 'MemberExpression': {
        const name = propName(node.property, node.computed);
        if (WATCH.has(name)) {
          let kind = 'read';
          if (parent && parent.type === 'AssignmentExpression' && parentKey === 'left') kind = 'write';
          else if (parent && parent.type === 'UpdateExpression') kind = 'write';
          else if (parent && parent.type === 'UnaryExpression' && parent.operator === 'delete') kind = 'delete';
          sites.push({ name, kind, line: node.property.loc.start.line, receiver: textOf(src, node.object) });
        }
        break;
      }
      case 'Property': {
        const name = propName(node.key, node.computed);
        if (WATCH.has(name) && parent) {
          if (parent.type === 'ObjectPattern') sites.push({ name, kind: 'destructure', line: node.key.loc.start.line, receiver: node.__receiver || '' });
          else if (parent.type === 'ObjectExpression') sites.push({ name, kind: 'write', line: node.key.loc.start.line, receiver: '{literal}' });
        }
        break;
      }
      case 'VariableDeclarator': {
        if (node.id && node.id.type === 'ObjectPattern' && node.init) for (const p of node.id.properties) p.__receiver = textOf(src, node.init);
        break;
      }
      case 'AssignmentExpression': {
        if (node.left && node.left.type === 'ObjectPattern') for (const p of node.left.properties) p.__receiver = textOf(src, node.right);
        break;
      }
      case 'Literal': {
        if (typeof node.value === 'string' && (FIELDS.includes(node.value) || GROUP_KEYS.includes(node.value) || HELP.has(node.value))) {
          const isKey = parent && ((parent.type === 'Property' && parentKey === 'key') || (parent.type === 'MemberExpression' && parentKey === 'property'));
          if (!isKey) sites.push({ name: node.value, kind: 'string', line: node.loc.start.line, receiver: '' });
        } else if (typeof node.value === 'string') {
          for (const name of PATH_NAMES) if (isPathString(node.value, name)) sites.push({ name, kind: 'path-string', line: node.loc.start.line, receiver: '' });
        }
        break;
      }
      case 'TemplateElement': {
        const text = node.value && typeof node.value.cooked === 'string' ? node.value.cooked : '';
        for (const name of PATH_NAMES) if (isPathString(text, name)) sites.push({ name, kind: 'path-string', line: node.loc.start.line, receiver: '' });
        break;
      }
      case 'Identifier': {
        if (HELP.has(node.name)) {
          let kind = 'mention';
          if (parent && parent.type === 'CallExpression' && parentKey === 'callee') kind = 'call';
          else if (parent && (parent.type === 'ImportSpecifier' || parent.type === 'ExportSpecifier')) kind = parent.type === 'ImportSpecifier' ? 'import' : 'export';
          else if (parent && (parent.type === 'FunctionDeclaration' && parentKey === 'id')) kind = 'def';
          else if (parent && parent.type === 'VariableDeclarator' && parentKey === 'id') kind = 'def';
          else if (parent && parent.type === 'MemberExpression' && parentKey === 'property' && !parent.computed) kind = 'member-name';
          else if (parent && parent.type === 'Property' && parentKey === 'key' && !parent.shorthand) kind = 'key-name';
          sites.push({ name: node.name, kind, line: node.loc.start.line });
        }
        break;
      }
      default: break;
    }
    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'range' || key === 'parent' || key === '__receiver') continue;
      const child = node[key];
      if (child && typeof child === 'object') walk(child, node, key);
    }
  };
  walk(root, null, null);
  // de-duplicate: an ImportSpecifier's imported+local are the same Identifier object twice
  const seen = new Set();
  return { parsed: true, sites: sites.filter((s) => { const k = `${s.name}|${s.kind}|${s.line}|${s.receiver}`; if (seen.has(k)) return false; seen.add(k); return true; }) };
}

export function scan(root, files) {
  const out = []; const unparsed = [];
  for (const f of files) {
    const r = sitesIn(readFileSync(join(root, f), 'utf8'));
    if (!r.parsed) { unparsed.push({ file: f, error: r.error }); continue; }
    for (const s of r.sites) out.push({ file: f, ...s });
  }
  return { sites: out, unparsed };
}
