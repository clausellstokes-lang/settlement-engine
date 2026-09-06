// @vitest-environment node
/**
 * pdfFieldManifest.walker.test.js — Cycle-3 Wave 6 structural guard (M21).
 *
 * The third layer of the Wave-6 determinism model (the first two live in
 * eslint.config.js + pdfEntropyGuard.test.js). It closes the M21 SYMPTOM class at the
 * output: it renders the REAL SettlementPDF viewmodel tree, walks it (NO PDF bytes —
 * react-pdf renderToBuffer is non-deterministic at the byte level; we execute the plain
 * hook-free section functions and read the element tree, the recorded "walk the tree,
 * never bytes" law), and collects every react-pdf TextInput field name the document
 * actually ships. It then asserts:
 *
 *   1. REGISTRATION — the discovered field set EXACTLY equals scripts/.pdf-field-manifest.json
 *      (a new writable field, or a removed one, must be registered/de-registered in review).
 *   2. NO SYMPTOM — no shipped field name matches `^f_` (the M21 `f_${Math.random()}`
 *      random-suffix class). The cure emits deterministic `fld_<fnv>` names for a falsy
 *      caller name, which are NOT the banned class.
 *
 * GUARD-THE-GUARD (E-A self-proving-meta): the field collector + symptom detector are
 * exercised on synthetic trees below — a planted `f_<rand>` field is FOUND and FLAGGED,
 * a nested field inside a function component is discovered — so a silently-broken walker
 * reds here, not in production.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import React from 'react';
import { TextInput, Text, View } from '@react-pdf/renderer';

import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { EditableText, EditableProse } from '../../src/pdf/primitives/Editable.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST = JSON.parse(readFileSync(join(ROOT, 'scripts/.pdf-field-manifest.json'), 'utf8'));
const SYMPTOM_RE = new RegExp(MANIFEST.randomNameSymptom);

// ── The tree walker (pure; exercised in guard-the-guard) ──────────────────────
// react-pdf primitives are STRING type tags (TextInput === 'TEXT_INPUT'); section
// components are plain functions we execute. Collect every TextInput's `name`.
function collectFieldNames(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') return out;
  if (Array.isArray(node)) { for (const n of node) collectFieldNames(n, out); return out; }
  if (typeof node === 'object') {
    if (node.type === TextInput) { out.push(node.props?.name); return out; } // leaf field
    if (typeof node.type === 'function') return collectFieldNames(node.type(node.props), out);
    return collectFieldNames(node.props?.children, out); // host tag / Fragment
  }
  return out;
}

// ── guard-the-guard: the walker + symptom detector are not vacuous ────────────
describe('guard-the-guard: field walker + symptom detector fire', () => {
  it('discovers a TextInput name nested inside a function component', () => {
    const Inner = (p) => React.createElement(TextInput, { name: p.fieldName });
    const Outer = () => React.createElement(View, null,
      React.createElement(Text, null, 'label'),
      React.createElement(Inner, { fieldName: 'deep.field' }));
    expect(collectFieldNames(React.createElement(Outer, {}))).toEqual(['deep.field']);
  });

  it('flags a planted /^f_/ random-suffix field (the M21 symptom) and spares a clean name', () => {
    const planted = collectFieldNames(React.createElement(TextInput, { name: 'f_a1b2c3d' }));
    expect(planted).toEqual(['f_a1b2c3d']);
    expect(planted.some((n) => SYMPTOM_RE.test(n))).toBe(true);
    // The deterministic cure prefix must NOT read as the symptom.
    expect(SYMPTOM_RE.test('fld_x9k2')).toBe(false);
    expect(SYMPTOM_RE.test('cover.campaign')).toBe(false);
  });

  it('walks arrays, booleans (gated chapters), and Fragments without tripping', () => {
    const gatedOut = false; // a chapter gated out of the doc (`inc(x) && <El/>` ⇒ false)
    const tree = [false, null, React.createElement(React.Fragment, null,
      React.createElement(TextInput, { name: 'x.one' }),
      gatedOut && React.createElement(TextInput, { name: 'never' }))];
    expect(collectFieldNames(tree)).toEqual(['x.one']);
  });
});

// ── The real document ─────────────────────────────────────────────────────────
describe('PDF field manifest — every shipped field is registered, none is /^f_/', () => {
  let discovered;

  beforeAll(() => {
    const settlement = normalizeSettlement(
      generateSettlementPipeline(
        { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' },
        null,
        { seed: 'pdf-fieldmanifest-2026', customContent: {} },
      ),
    );
    const systemState = deriveSystemState(settlement);
    const eventLog = [{
      narrativeSummary: 'A bandit warband tested the eastern palisade.',
      appliedAt: Date.UTC(2026, 3, 12, 9, 30),
      event: { type: 'raid', description: 'Outriders probed the approaches at dawn.' },
      deltas: [{ explanation: 'Resilience fell', before: 62, after: 51 }],
    }];
    // The full canon dossier — every chapter that could carry a field renders.
    const doc = SettlementPDF({ settlement, systemState, eventLog, phase: 'canon', variant: 'canon_dossier' });
    discovered = [...new Set(collectFieldNames(doc))].sort();
  });

  it('the manifest itself is well-formed (non-empty, distinct, no /^f_/ entry)', () => {
    expect(Array.isArray(MANIFEST.fields)).toBe(true);
    expect(MANIFEST.fields.length).toBeGreaterThan(0);
    expect(new Set(MANIFEST.fields).size).toBe(MANIFEST.fields.length);
    expect(MANIFEST.fields.filter((f) => SYMPTOM_RE.test(f))).toEqual([]);
  });

  it('every shipped field name is registered in PDF_FIELD_MANIFEST (exact set)', () => {
    const registered = [...MANIFEST.fields].sort();
    expect(
      discovered,
      `PDF form-field set drifted from scripts/.pdf-field-manifest.json.\n` +
        `  discovered: ${JSON.stringify(discovered)}\n  registered: ${JSON.stringify(registered)}\n` +
        `  Register a new writable field (or de-register a removed one) in review.`,
    ).toEqual(registered);
  });

  it('every field name is defined (no undefined leaked from safeName)', () => {
    expect(discovered.every((n) => typeof n === 'string' && n.length > 0)).toBe(true);
  });

  it('NO shipped field name is the /^f_/ random-suffix symptom (M21 cured)', () => {
    const symptomatic = discovered.filter((n) => SYMPTOM_RE.test(n));
    expect(
      symptomatic,
      `field name(s) match the M21 random-suffix symptom /^f_/ — a falsy caller name ` +
        `fell through to a non-deterministic id:\n  ${symptomatic.join('\n  ')}`,
    ).toEqual([]);
  });

  it('same viewmodel rendered twice ⇒ identical field-name set (tree-walked)', () => {
    const build = () => SettlementPDF({
      settlement: normalizeSettlement(generateSettlementPipeline(
        { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' },
        null, { seed: 'pdf-fieldmanifest-2026', customContent: {} },
      )),
      phase: 'canon', variant: 'canon_dossier',
    });
    const a = [...new Set(collectFieldNames(build()))].sort();
    const b = [...new Set(collectFieldNames(build()))].sort();
    expect(a).toEqual(b);
  });
});

// ── M21 pin — the safeName falsy-name fallback is DETERMINISTIC (not Math.random) ─
describe('M21 pin: a falsy field name yields a deterministic, content-derived id', () => {
  const fieldNameOf = (el) => collectFieldNames(el)[0];

  it('the SAME content with a falsy name renders the SAME field name every render', () => {
    const render = () => EditableText({
      name: '', defaultValue: 'The Gilded Anchor', showField: true, hideIfEmpty: false,
    });
    const first = fieldNameOf(render());
    const second = fieldNameOf(render());
    expect(first).toBe(second);              // deterministic — was Math.random before
    expect(first).toMatch(/^fld_/);          // the cured prefix
    expect(SYMPTOM_RE.test(first)).toBe(false); // NOT the /^f_/ symptom
  });

  it('DIFFERENT content yields a DIFFERENT id (content-derived, not a constant)', () => {
    const a = fieldNameOf(EditableText({ name: '', defaultValue: 'Alpha', showField: true, hideIfEmpty: false }));
    const b = fieldNameOf(EditableText({ name: '', defaultValue: 'Bravo', showField: true, hideIfEmpty: false }));
    expect(a).not.toBe(b);
  });

  it('EditableProse falsy-name fallback is likewise deterministic and kind-separated', () => {
    const p1 = fieldNameOf(EditableProse({ name: '', defaultValue: 'same text', showField: true, hideIfEmpty: false }));
    const p2 = fieldNameOf(EditableProse({ name: '', defaultValue: 'same text', showField: true, hideIfEmpty: false }));
    const t = fieldNameOf(EditableText({ name: '', defaultValue: 'same text', showField: true, hideIfEmpty: false }));
    expect(p1).toBe(p2);            // prose fallback deterministic
    expect(p1).toMatch(/^fld_/);
    expect(p1).not.toBe(t);         // prose vs text: the `p:`/`t:` kind tag decorrelates
  });

  it('a PROVIDED name still wins (fallback only fires on a falsy name)', () => {
    const name = fieldNameOf(EditableText({ name: 'explicit.field', defaultValue: 'x', showField: true, hideIfEmpty: false }));
    expect(name).toBe('explicit.field');
  });
});
