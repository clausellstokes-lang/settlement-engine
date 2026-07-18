/**
 * slugify.parity.test.js — proves the id-join safety of code-quality-5.
 *
 * Each of the 8 historical slugify variants mints or matches PERSISTED ids, so a
 * migration to the kernel primitive (src/kernel/slugify.js) is only safe if it is
 * BYTE-IDENTICAL to the old local implementation over every input — not just the
 * happy path. This test inlines each old implementation verbatim and asserts the
 * kernel primitive with that site's params returns an identical string across a
 * battery that stresses the edges where slugs actually differ (empty, whitespace,
 * leading/trailing symbols, all-symbol, unicode, over-cap length, falsy inputs).
 *
 * A green run here is the proof that migrating the site changes no id and breaks no
 * join. It also documents the deliberate per-namespace params (dash vs underscore,
 * caps, fallbacks) that must NOT be unified.
 */
import { describe, test, expect } from 'vitest';
import { slugify } from '../../src/kernel/slugify.js';

const BATTERY = [
  '', ' ', '   ', 'Simple', 'Two Words', 'UPPER CASE', 'Trailing- ', ' -Leading',
  '___weird___', '---dashes---', 'punct!@#$%^&*()uation', 'a.b.c', 'a_b-c d',
  'café Ünïcodë', '日本語 mixed 123', '123 456', '!!!', '   !!!   ', '_', '-',
  'x'.repeat(200), 'word_'.repeat(30), 'a-'.repeat(50),
  null, undefined, 0, 1, false, true, 42.5, NaN,
];

/** @param {(v:unknown)=>string} oldImpl @param {object} params */
function proveParity(oldImpl, params) {
  for (const input of BATTERY) {
    expect(slugify(input, params), `input=${JSON.stringify(input)}`).toBe(oldImpl(input));
  }
}

describe('slugify primitive — every migrated site is byte-identical (id-join safe)', () => {
  test('events/batch.js + events/mutateHelpers.js (the byte-identical pair) — sep "_"', () => {
    const old = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    proveParity(old, { sep: '_' });
  });

  test('entities/npcs.js slugify — sep "_", cap 32, fallback "npc"', () => {
    const old = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 32) || 'npc';
    proveParity(old, { sep: '_', max: 32, fallback: 'npc' });
  });

  test('dossier/entityLinks.js slugifyEntity — sep "-", cap 80, fallback "unknown", empty "unknown"', () => {
    const old = (v) => String(v || 'unknown').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'unknown';
    proveParity(old, { sep: '-', max: 80, fallback: 'unknown', empty: 'unknown' });
  });

  test('region/goodsCatalog.js slugifyGood — sep "_", cap 64, fallback "unknown", empty "unknown"', () => {
    const old = (v) => String(v || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 64) || 'unknown';
    proveParity(old, { sep: '_', max: 64, fallback: 'unknown', empty: 'unknown' });
  });

  test('data/institutionalCatalog.js slugifyInstitutionName — sep "_", raw String(name)', () => {
    const old = (n) => String(n).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    proveParity(old, { sep: '_', raw: true });
  });

  test('foundry/moduleBuilder.js slugify — sep "-", cap 40, fallback "settlement", empty "settlement"', () => {
    const old = (n) => String(n || 'settlement').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'settlement';
    proveParity(old, { sep: '-', max: 40, fallback: 'settlement', empty: 'settlement' });
  });

  test('lib/customRegistry.js slugify — sep "_" (with .trim(), a no-op for output)', () => {
    const old = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    proveParity(old, { sep: '_' });
  });
});

describe('fold-triage migrations (2026-07-18): the three post-review inliners', () => {
  const EXOTIC = ['', null, undefined, 0, false, 'unknown', 'The Free—Alliance', 'Łódź Þing 42', '  --x--  ', 'a'.repeat(200), '™©'];
  test('compendium registrySlug.slug parity (dash, null-coalesce-not-falsy)', () => {
    const inline = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    for (const v of EXOTIC) expect(slugify(v == null ? '' : v, { raw: true })).toBe(inline(v));
  });
  test('ladder faction token parity (underscore, cap 80, unknown fallback) — ladderRead + npcLadderState', () => {
    const inline = (v) => String(v || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80) || 'unknown';
    for (const v of EXOTIC) expect(slugify(v, { sep: '_', max: 80, fallback: 'unknown', empty: 'unknown' })).toBe(inline(v));
  });
});
