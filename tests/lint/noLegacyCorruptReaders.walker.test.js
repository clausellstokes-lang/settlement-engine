// tests/lint/noLegacyCorruptReaders.walker.test.js — THE NO-LEGACY-CORRUPT-READERS WALKER (the allegiance train, car 1,
// ALLEGIANCE-CAR1, 2026-11-08; the allegiance design §4 I-15, §7.3; on noLegacyFactionReaders.walker's pattern).
//
// ONE READER (J-1): no file in `src/` outside the dormant list (`legacyCorruptReaders/dormant-list.json`: the simulation's
// readers, M-6, frozen — the owner kept "compromised" for the simulator) reads the retired NPC mark — `corrupt`,
// `corruptTies`, `corruptionVector` — and no file writes or deletes it, except two declared classes: the v2 -> v3 save
// migration (it reads the three once, by design, to move them) and the gallery veil (it drops the three keys from any
// record that still carries them — a save the migration REPORTED keeps them). Every other reader reads the hidden
// allegiance through `domain/people/allegiance.js :: allegianceOf`.
//
// THE PASS is a syntax tree (espree, JSX on; a file that fails to parse is NAMED, never skipped): a member read, write or
// delete of one of the three names (`npc.corrupt`, `n?.corruptTies.x`, `delete c.corruptionVector`), a destructure
// (`{ corrupt } = npc`), the two unambiguous names as a string (`'corruptTies'`, a dynamic key list) and a key-path
// string (`'corruptTies.revealed'`). NOT refused, by measurement (each read where it stands): the bare string and the
// object key `corrupt` — the flaw word (corruption.js's FLAW_VECTOR, npcData's trait lists), the appointment quality
// (ASSIGN_NPC_TO_ROLE's `corrupt`), a keyword list; and a `corruptionVector` object key — the paradigm axis's own field.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'espree';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../..');
const DORMANT = join(HERE, 'legacyCorruptReaders/dormant-list.json');

const NAMES = new Set(['corrupt', 'corruptTies', 'corruptionVector']);
const UNAMBIGUOUS = new Set(['corruptTies', 'corruptionVector']);
const OPTIONS = Object.freeze({ ecmaVersion: 2024, sourceType: 'module', loc: true, range: true, ecmaFeatures: { jsx: true } });

/** The two declared classes, by file, each with its reason (never silent). */
export const DECLARED_CLASSES = Object.freeze({
  'src/domain/settlementMigrations.js': 'v2-to-v3-migration-reads: the migration reads the three retired fields once, by design, to move them onto the allegiance (or to report them)',
  'src/domain/display/galleryVeil.js': 'the veil drops the three retired keys from any record that still carries them (a save the v2 -> v3 migration reported keeps them)',
});

/** @param {string} dir @param {string[]} [out] @returns {string[]} */
function filesUnder(dir, out = []) {
  for (const name of readdirSync(join(ROOT, dir))) {
    const rel = join(dir, name);
    if (statSync(join(ROOT, rel)).isDirectory()) { filesUnder(rel, out); continue; }
    if (/\.(m?js|jsx)$/.test(name) && !/__tests__|\.test\.|\.spec\./.test(rel)) out.push(rel);
  }
  return out;
}

/** @param {any} node @param {boolean} computed */
const propName = (node, computed) => {
  if (!node) return '';
  if (!computed && node.type === 'Identifier') return node.name;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  return '';
};
const isKeyPath = (text) => !/\s/.test(text) && /(^|[.\]])(corruptTies|corruptionVector)[.[]/.test(text);

/**
 * Every refused site in one file's source. Pure: the walk and the positive control both call it.
 * @param {string} source
 * @returns {{ parsed: boolean, sites: Array<{ name: string, kind: string, line: number }> }}
 */
export function legacyCorruptSites(source) {
  let root;
  try { root = parse(source, OPTIONS); } catch { return { parsed: false, sites: [] }; }
  /** @type {Array<{ name: string, kind: string, line: number }>} */
  const sites = [];
  /** @param {any} node @param {any} parent @param {string | null} key */
  const walk = (node, parent, key) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { for (const c of node) walk(c, parent, key); return; }
    if (typeof node.type !== 'string') return;
    if (node.type === 'MemberExpression') {
      const name = propName(node.property, node.computed);
      if (NAMES.has(name)) {
        let kind = 'read';
        if (parent?.type === 'AssignmentExpression' && key === 'left') kind = 'write';
        else if (parent?.type === 'UnaryExpression' && parent.operator === 'delete') kind = 'delete';
        sites.push({ name, kind, line: node.property.loc.start.line });
      }
    } else if (node.type === 'Property' && parent?.type === 'ObjectPattern') {
      const name = propName(node.key, node.computed);
      if (NAMES.has(name)) sites.push({ name, kind: 'destructure', line: node.key.loc.start.line });
    } else if (node.type === 'Literal' && typeof node.value === 'string') {
      const isKey = parent && ((parent.type === 'Property' && key === 'key') || (parent.type === 'MemberExpression' && key === 'property'));
      if (!isKey && UNAMBIGUOUS.has(node.value)) sites.push({ name: node.value, kind: 'string', line: node.loc.start.line });
      else if (isKeyPath(node.value)) sites.push({ name: node.value, kind: 'path-string', line: node.loc.start.line });
    } else if (node.type === 'TemplateElement') {
      const text = node.value?.cooked || '';
      if (isKeyPath(text)) sites.push({ name: text, kind: 'path-string', line: node.loc.start.line });
    }
    for (const k of Object.keys(node)) {
      if (k === 'loc' || k === 'range') continue;
      const child = node[k];
      if (child && typeof child === 'object') walk(child, node, k);
    }
  };
  walk(root, null, null);
  return { parsed: true, sites };
}

/** Walk `src/` minus the dormant list and the declared classes. */
function walkSrc() {
  const dormant = JSON.parse(readFileSync(DORMANT, 'utf8')).files.map((f) => f.file);
  const skip = new Set([...dormant, ...Object.keys(DECLARED_CLASSES)]);
  const files = filesUnder('src');
  /** @type {string[]} */ const violations = [];
  /** @type {string[]} */ const unparsed = [];
  /** @type {Set<string>} */ const dormantReading = new Set();
  for (const f of files) {
    const r = legacyCorruptSites(readFileSync(join(ROOT, f), 'utf8'));
    if (!r.parsed) { unparsed.push(f); continue; }
    if (skip.has(f)) { if (r.sites.length) dormantReading.add(f); continue; }
    for (const s of r.sites) violations.push(`${f}:${s.line} ${s.name} (${s.kind})`);
  }
  return { violations, unparsed, scanned: files.length, dormant, dormantReading };
}

describe('no legacy corrupt readers outside the dormant list (I-15, ALLEGIANCE-CAR1)', () => {
  it('POSITIVE CONTROL: a planted read of every refused shape is caught; the other meanings are not', () => {
    const planted = [
      'export const a = (npc) => npc.corrupt;',                         // the field, read
      'export const b = (npc) => npc?.corruptTies?.criminalInstitution;', // optional chain
      'export const c = ({ corruptionVector }) => corruptionVector;',     // a destructure
      "export const d = ['corruptTies'];",                                // a dynamic key list
      "export const e = 'corruptTies.revealed';",                         // a key-path string
      'export const f = (npc) => { npc.corrupt = true; };',               // a write
      'export const g = (npc) => { delete npc.corruptionVector; };',      // a delete
    ].join('\n');
    const { parsed, sites } = legacyCorruptSites(planted);
    expect(parsed).toBe(true);
    expect(sites.map((s) => `${s.name}:${s.kind}`)).toEqual([
      'corrupt:read', 'corruptTies:read', 'corruptionVector:destructure', 'corruptTies:string', 'corruptTies.revealed:path-string',
      'corrupt:write', 'corruptionVector:delete',
    ]);
    // anchored: the negative half — the flaw word, the appointment quality, the paradigm axis's key and the allegiance are clean
    const clean = "export const h = ['greedy', 'corrupt'];\nexport const q = { corrupt: { capacityFactor: 0.5 } };\nexport const v = { corruptionVector: 'x' };\nexport const w = (npc) => npc.allegiance;";
    expect(legacyCorruptSites(clean).sites).toEqual([]);
  });

  it('every read, write or delete outside the dormant list and the two declared classes is red; zero at the car', () => {
    const { violations, unparsed, scanned, dormant, dormantReading } = walkSrc();
    expect(unparsed).toEqual([]);
    expect(scanned).toBeGreaterThan(2000); // liveness: the walk reached src/
    expect(dormant.length).toBe(16); // measured at the car (the dormant list's own note)
    expect(violations).toEqual([]);
    // the list is exact: every dormant file still reads the mark (a re-pointed file leaves the list in the same commit)
    expect(dormant.filter((f) => !dormantReading.has(f))).toEqual([]);
  });
});
