/**
 * tests/docs/glossaryFreshness.test.js — THE GLOSSARY DRIFT GUARD (W-GUIDE-2 §6).
 *
 * The analytics-dictionary / architectureFreshness idiom applied to the
 * guidance-layer glossary: the committed docs/glossary.md and the runtime
 * lookup both derive from ONE source (buildGlossaryEntries over the code
 * registries), so the reference cannot drift from what the engine does.
 *
 * The load-bearing assertion is byte-identity (docs/glossary.md === a fresh
 * generation); the coverage/parity checks give a specific, readable failure
 * pointing at the exact drifted term rather than a wall of diff.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildGlossary, GLOSSARY_PATH } from '../../scripts/generate-glossary.mjs';
import { buildGlossaryEntries, glossaryEntryFor } from '../../src/domain/display/glossary.js';
import { authorableVerbs, STRESSOR_SEVERITY_VALUES, RELIEF_MAGNITUDE_VALUES } from '../../src/domain/events/affordanceManifest.js';
import { BAND_HINT } from '../../src/domain/state/bands.js';
import { CAPACITY_BANDS } from '../../src/domain/capacityModel.js';
import { CAPTURE_LADDER } from '../../src/domain/corruption.js';

describe('glossary freshness — the committed doc cannot drift from code', () => {
  it('docs/glossary.md is byte-identical to a fresh generation (regenerate: npm run gen:glossary)', () => {
    const committed = readFileSync(GLOSSARY_PATH, 'utf8');
    expect(committed, 'Glossary is stale. Run: npm run gen:glossary').toBe(buildGlossary());
  });
});

describe('glossary coverage — every registry term produces exactly one entry', () => {
  const entries = buildGlossaryEntries();
  const ids = entries.map((e) => e.id);

  it('every entry id is unique and resolves', () => {
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of entries) expect(glossaryEntryFor(e.id)).toEqual(e);
  });

  it('every entry has a non-empty definition (never blank, never invented-away)', () => {
    for (const e of entries) {
      expect(typeof e.definition, `${e.id} definition`).toBe('string');
      expect(e.definition.trim().length, `${e.id} definition is empty`).toBeGreaterThan(0);
    }
  });

  it('every authorable verb has an entry (coverage — a new verb forces a row)', () => {
    for (const v of authorableVerbs()) {
      const e = entries.find((x) => x.category === 'verb' && x.term === v.label);
      expect(e, `verb "${v.label}" is undocumented in the glossary`).toBeTruthy();
      expect(e.family).toBe(v.family);
    }
  });

  it('every stability band has an entry whose definition IS the code BAND_HINT (zero drift)', () => {
    for (const [band, hint] of Object.entries(BAND_HINT)) {
      const e = entries.find((x) => x.category === 'stability-band' && x.term === band);
      expect(e, `stability band "${band}" undocumented`).toBeTruthy();
      expect(e.definition, `stability band "${band}" definition drifted from BAND_HINT`).toBe(hint);
    }
  });

  it('every strain band, capture rung, severity, and magnitude term has an entry (coverage)', () => {
    for (const band of CAPACITY_BANDS) {
      expect(entries.some((x) => x.category === 'strain-band' && x.id === `strain-${band}`), `strain band "${band}" undocumented`).toBe(true);
    }
    for (const rung of CAPTURE_LADDER) {
      expect(entries.some((x) => x.category === 'capture-rung' && x.id === `capture-${rung}`), `capture rung "${rung}" undocumented`).toBe(true);
    }
    for (const level of Object.keys(STRESSOR_SEVERITY_VALUES)) {
      expect(entries.some((x) => x.category === 'severity' && x.id === `severity-${level}`), `severity "${level}" undocumented`).toBe(true);
    }
    for (const level of Object.keys(RELIEF_MAGNITUDE_VALUES)) {
      expect(entries.some((x) => x.category === 'magnitude' && x.id === `magnitude-${level}`), `magnitude "${level}" undocumented`).toBe(true);
    }
  });

  it('the counts match the registries exactly (no orphan entry for a dropped term)', () => {
    const byCat = (c) => entries.filter((e) => e.category === c).length;
    expect(byCat('verb')).toBe(authorableVerbs().length);
    expect(byCat('stability-band')).toBe(Object.keys(BAND_HINT).length);
    expect(byCat('strain-band')).toBe(CAPACITY_BANDS.length);
    expect(byCat('capture-rung')).toBe(CAPTURE_LADDER.length);
    expect(byCat('severity')).toBe(Object.keys(STRESSOR_SEVERITY_VALUES).length);
    expect(byCat('magnitude')).toBe(Object.keys(RELIEF_MAGNITUDE_VALUES).length);
  });

  it('every entry deep-links to a compendium tab + anchor', () => {
    for (const e of entries) {
      expect(typeof e.tab, `${e.id} tab`).toBe('string');
      expect(typeof e.anchor, `${e.id} anchor`).toBe('string');
      expect(e.tab.length).toBeGreaterThan(0);
    }
  });

  // THE whatPhrase NEVER-LEAK-A-SLUG LAW (§6): the glossary NAMES engine tokens
  // (verb types, band enums), so its displayed TERM must always be the human
  // reading — never the raw ENGINE_SNAKE / kebab-slug it derives from. (The raw
  // token stays confined to the entry `id`, never the `term`.)
  it('never leaks a raw engine slug as a displayed term', () => {
    for (const e of entries) {
      expect(/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(e.term), `${e.id} term "${e.term}" is a raw ENGINE_SNAKE token`).toBe(false);
      expect(e.term.includes('_'), `${e.id} term "${e.term}" leaks an underscore slug`).toBe(false);
      expect(/^[a-z0-9]+(-[a-z0-9]+)+$/.test(e.term), `${e.id} term "${e.term}" reads as a kebab slug`).toBe(false);
      expect(/[A-Za-z]/.test(e.term), `${e.id} term "${e.term}" has no letters`).toBe(true);
    }
    // A verb's term is the human LABEL, never its raw event type.
    for (const v of authorableVerbs()) {
      const e = entries.find((x) => x.category === 'verb' && x.id === `verb-${v.type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
      expect(e, `verb ${v.type} missing`).toBeTruthy();
      expect(e.term, `verb ${v.type} term leaked the raw type`).not.toBe(v.type);
    }
  });
});
