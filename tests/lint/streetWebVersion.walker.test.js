/**
 * tests/lint/streetWebVersion.walker.test.js — ⭐⭐⭐ MF-W3F · ⟦SW-1b⟧ **THE WALKER THAT MAKES
 * THE STREET WEB'S VERSION DECLARATION EXECUTABLE** (ODQ §303.4 adopts SW-1's five criteria as
 * fresh W3's exit criteria; the law is written at `laneMFD1-receipt.md` §8.4).
 *
 * ⭐⭐⭐ THE RULE, IN ONE SENTENCE: **`streetWebVersions.js` declares which bindings name which
 * version of the street artifact, and this file re-derives every consumer from PARSED SOURCE and
 * refuses a spelling, a consumer or a grade the declaration does not know.**
 *
 * ⛔⛔ WHY A WALKER AND NOT A TYPE. Two versions of one artifact have the SAME SHAPE — that is
 * what makes them versions — so no signature and no `tsc` run can tell a consumer it was handed
 * the wrong one. MEASURED at MF-D1 and re-measured at this lane's base: the published
 * connectivity grade was computed over the PRE-CIRCUIT channel set on **11 of 17 leaves**, and
 * `censusLeaf`'s own parameter was named `fabricWeb` while every caller passed it `facedWeb`.
 * Both are invisible to every check the tree had.
 *
 * SEVEN ARMS, each a refusal, four with planted counterfactuals:
 *   1  every watched property in `buildFabric.js` names a DECLARED binding
 *   2  a property NAMED after a version binding carries THAT version
 *   3  `NON_FINAL_CONSUMERS` is EXACTLY the set of non-final consumers in source
 *   4  ⭐ the GRADE rule: `webConnectivity` takes the FINAL channels and the FINAL squares
 *   5  the declaration's own roster is coherent (unique bindings, contiguous ranks, one FINAL)
 *   6  counterfactual — a new non-final consumer CONVICTS
 *   7  counterfactual — an unknown spelling, a lying property name and a stale grade CONVICT
 *
 * ⚠ LANDING HAZARD, INHERITED VERBATIM FROM `stageManifest.walker.test.js`: this file parses
 * source with `acorn`, present today only as a transitive dependency of vite. THE LANDING
 * EXECUTOR OWES AN EXPLICIT devDependency, and a dependency bump is a MINT TRIGGER. If acorn is
 * absent these tests must FAIL, never skip.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Parser } from 'acorn';
import {
  CHANNEL_VERSIONS, WEB_VERSIONS, VERSION_BINDINGS, FINAL_CHANNELS, FINAL_WEB,
  CLAIM_SET_BINDING, VERSION_NAMED_PROPERTIES, NON_FINAL_CONSUMERS,
} from '../../src/domain/townMap/fabric/streetWebVersions.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, '../../src/domain/townMap/fabric/buildFabric.js');
const parse = (src) => Parser.parse(src, { ecmaVersion: 2024, sourceType: 'module' });

/** The properties that carry a version of the street artifact. */
const WATCHED = new Set(['channels', 'web', 'squares', 'fabricWeb', 'facedWeb', 'streetsWalled']);

/** A member/identifier expression rendered as its source spelling; null for anything else. */
function spell(n) {
  if (!n) return null;
  if (n.type === 'Identifier') return n.name;
  if (n.type === 'MemberExpression' && !n.computed) {
    const o = spell(n.object);
    return o && n.property.type === 'Identifier' ? `${o}.${n.property.name}` : null;
  }
  return null;
}

/** The version a value names: its own spelling, or the spelling of a single spread it extends. */
function versionOf(v) {
  const direct = spell(v);
  if (direct) return direct;
  if (v && v.type === 'ObjectExpression') {
    const spreads = v.properties.filter((p) => p.type === 'SpreadElement');
    if (spreads.length === 1) return spell(spreads[0].argument);
  }
  return null;
}

/**
 * ⭐⭐ THE DERIVATION. Walk `buildFabric.js` and return every watched property with the consumer
 * that receives it — the callee name when the object literal is a call argument, otherwise the
 * variable the literal is assigned to.
 *
 * ⚠ VERSION-DEFINING SITES ARE NOT CONSUMERS. `const facedWeb = { ...fabricWeb, squares: … }` is
 * the line that MINTS the final web; asking it to name a version it is in the middle of creating
 * is the self-referential pin class.
 */
function consumers(src) {
  const ast = parse(src);
  /** @type {Array<{consumer:string, property:string, binding:string|null, raw:string}>} */
  const out = [];
  const walk = (node, ctx) => {
    if (!node || typeof node.type !== 'string') return;
    let next = ctx;
    if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
      next = { name: node.id.name, defining: VERSION_BINDINGS.includes(node.id.name) };
    }
    if (node.type === 'CallExpression') {
      const callee = spell(node.callee);
      const inner = { name: callee || ctx.name, defining: false };
      walk(node.callee, ctx);
      for (const arg of node.arguments) walk(arg, inner);
      return;
    }
    if (node.type === 'ObjectExpression' && !ctx.defining) {
      for (const p of node.properties) {
        if (p.type !== 'Property' || p.computed || p.key.type !== 'Identifier') continue;
        if (!WATCHED.has(p.key.name)) continue;
        out.push({
          consumer: ctx.name || '(anonymous)',
          property: p.key.name,
          binding: versionOf(p.value),
          raw: src.slice(p.value.start, p.value.end).replace(/\s+/g, ' ').slice(0, 60),
        });
      }
    }
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (Array.isArray(v)) { for (const c of v) walk(c, next); } else if (v && typeof v.type === 'string') walk(v, next);
    }
  };
  walk(ast, { name: null, defining: false });
  return out;
}

/**
 * ⭐ THE BINDING A SPELLING NAMES. A declared binding may itself be dotted (`channels.channels`
 * IS the pre-circuit version's name), so the full spelling is tried FIRST and only an unlisted
 * one falls back to its root — that is how `fabricWeb.squares` resolves to `fabricWeb` while
 * `channels.channels` does not resolve to the undeclared `channels`.
 */
function bindingOf(spelling) {
  if (!spelling) return null;
  if (VERSION_BINDINGS.includes(spelling)) return spelling;
  const root = spelling.split('.')[0];
  return VERSION_BINDINGS.includes(root) ? root : null;
}

/**
 * Is this binding the FINAL version of whichever artifact it belongs to?
 * ⚠ THE CLAIM SET COUNTS AS FINAL BY CONSTRUCTION — it can only be composed from the final
 * channels, so a consumer handed `lawClaims` is not reading a stale street web.
 */
function isFinal(spelling) {
  const b = bindingOf(spelling);
  return b === FINAL_CHANNELS || b === FINAL_WEB || b === CLAIM_SET_BINDING;
}

const SRC = readFileSync(BUILD, 'utf8');
const rows = consumers(SRC);
const key = (r) => `${r.consumer}|${r.property}|${r.binding}`;

describe('⟦SW-1b⟧ the street web names the version every consumer reads', () => {
  it('1 · every watched property names a DECLARED binding — a new version cannot arrive unnamed', () => {
    // ⚠ NON-VACUITY FIRST. An arm over an empty roster passes for the wrong reason, and this
    // file's whole subject is a set derived from source that could silently become empty.
    expect(rows.length).toBeGreaterThan(10);
    const unknown = rows.filter((r) => bindingOf(r.binding) === null);
    expect(unknown.map((r) => `${r.consumer}.${r.property} = ${r.raw}`)).toEqual([]);
  });

  it('2 · a property NAMED after a version carries THAT version — `fabricWeb: facedWeb` is a lie', () => {
    const lying = rows.filter((r) => VERSION_NAMED_PROPERTIES.includes(r.property)
      && r.binding && bindingOf(r.binding) !== r.property);
    expect(lying.map((r) => `${r.consumer}.${r.property} = ${r.binding}`)).toEqual([]);
  });

  it('3 · NON_FINAL_CONSUMERS is EXACTLY the non-final set in source, each with a written reason', () => {
    const found = rows.filter((r) => !isFinal(r.binding)).map(key).sort();
    const declared = NON_FINAL_CONSUMERS.map((c) => `${c.consumer}|${c.property}|${c.binding}`).sort();
    expect(found).toEqual(declared);
    for (const c of NON_FINAL_CONSUMERS) {
      // A reason that is not a sentence is not a reason. The rows name a STAGE, because the
      // only lawful reason to read a stale version is that the fresh one does not exist yet.
      expect(c.reason.length).toBeGreaterThan(40);
      expect(c.reason).toMatch(/STAGE/);
    }
  });

  it('4 · ⭐ THE GRADE RULE — webConnectivity takes the FINAL channels and the FINAL squares', () => {
    const grade = rows.filter((r) => r.consumer === 'webConnectivity');
    // The call exists and hands over both halves of its denominator.
    expect(grade.map((r) => r.property).sort()).toEqual(['channels', 'squares']);
    for (const r of grade) expect(isFinal(r.binding)).toBe(true);
  });

  it('5 · the declaration itself is coherent — unique bindings, contiguous ranks, one FINAL each', () => {
    for (const list of [CHANNEL_VERSIONS, WEB_VERSIONS]) {
      expect(list.map((v) => v.rank)).toEqual(list.map((_, i) => i + 1));
      expect(new Set(list.map((v) => v.binding)).size).toBe(list.length);
      expect(list.filter((v) => v.name === 'FINAL')).toHaveLength(1);
      for (const v of list) expect(v.what.length).toBeGreaterThan(40);
    }
    expect(CHANNEL_VERSIONS[CHANNEL_VERSIONS.length - 1].binding).toBe(FINAL_CHANNELS);
    expect(WEB_VERSIONS[WEB_VERSIONS.length - 1].binding).toBe(FINAL_WEB);
  });

  it('6 · COUNTERFACTUAL — a new consumer handed a stale version CONVICTS', () => {
    const planted = SRC.replace(
      'const bridges2 = deriveBridges({',
      'const bridges2 = deriveBridges({\n    channels: channels.channels,',
    );
    expect(planted).not.toBe(SRC);
    const found = consumers(planted).filter((r) => !isFinal(r.binding)).map(key).sort();
    const declared = NON_FINAL_CONSUMERS.map((c) => `${c.consumer}|${c.property}|${c.binding}`).sort();
    expect(found).not.toEqual(declared);
    expect(found).toContain('deriveBridges|channels|channels.channels');
  });

  it('7 · COUNTERFACTUAL — an unknown spelling, a lying name and a stale grade all CONVICT', () => {
    // (a) an unknown binding
    const a = consumers(SRC.replace('const bridges2 = deriveBridges({',
      'const bridges2 = deriveBridges({\n    channels: someOtherWeb,'));
    expect(a.some((r) => r.binding === 'someOtherWeb' && bindingOf(r.binding) === null)).toBe(true);
    // (b) a property named after a version but carrying another
    const b = consumers(SRC.replace('const bridges2 = deriveBridges({',
      'const bridges2 = deriveBridges({\n    fabricWeb: facedWeb,'));
    expect(b.some((r) => VERSION_NAMED_PROPERTIES.includes(r.property)
      && r.binding && bindingOf(r.binding) !== r.property)).toBe(true);
    // (c) the grade taken over the pre-circuit set — the exact defect SW-1c cured
    const c = consumers(SRC.replace('channels: streetsWalled, squares: facedWeb.squares, umbrella: umbrellaFaced',
      'channels: channels.channels, squares: fabricWeb.squares, umbrella: builtUmbrella'));
    const grade = c.filter((r) => r.consumer === 'webConnectivity');
    expect(grade.length).toBe(2);
    expect(grade.every((r) => isFinal(r.binding))).toBe(false);
  });
});
