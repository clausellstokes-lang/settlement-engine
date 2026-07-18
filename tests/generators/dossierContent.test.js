/**
 * tests/generators/dossierContent.test.js — CONTENT-GT-DOSSIER content-volume guards.
 *
 * Non-golden guards for the grown dossier prose (the golden shift itself parks in
 * generatorGoldenMaster until the ONE REGEN). These pin: (1) the institution-desc
 * variant walker + register laws + canonical-at-zero at generation, (2) the fixed
 * religious_conversion selector now yields real re-roll variety (was name.length%3),
 * (3) the wartime compound-branch anchors survive the pool growth, (4) every pressure
 * pool still resolves to a non-empty sentence.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_DESC_VARIANTS } from '../../src/data/institutionDescVariants.js';
import { pickVariant } from '../../src/kernel/proseHash.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { generatePressureSentence } from '../../src/generators/narrativeGenerator.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

const mergeCat = (a, b) => {
  const m = {};
  for (const [c, i] of Object.entries(a || {})) m[c] = { ...i };
  for (const [c, i] of Object.entries(b || {})) m[c] = { ...(m[c] || {}), ...i };
  return m;
};
const resolveTierCatalog = (t) =>
  t === 'metropolis' ? mergeCat(institutionalCatalog.city, institutionalCatalog.metropolis) : institutionalCatalog[t] || {};

describe('INSTITUTION_DESC_VARIANTS — walker + register laws', () => {
  const entries = Object.entries(INSTITUTION_DESC_VARIANTS);
  it('is a non-vacuous representative sample', () => {
    expect(entries.length).toBeGreaterThanOrEqual(30);
  });
  it('every key resolves to a real catalog institution carrying a canonical desc', () => {
    for (const [key] of entries) {
      const [tier, cat, name] = key.split('|');
      const entry = resolveTierCatalog(tier)?.[cat]?.[name];
      expect(entry, `${key} resolves`).toBeTruthy();
      expect(typeof entry.desc, `${key} has a canonical desc string`).toBe('string');
      expect(entry.desc.length).toBeGreaterThan(0);
    }
  });
  it('every variant is non-empty, trimmed, leak-free, and distinct from the canonical', () => {
    for (const [key, variants] of entries) {
      const [tier, cat, name] = key.split('|');
      const canon = resolveTierCatalog(tier)[cat][name].desc;
      expect(variants.length, `${key} has >=1 variant`).toBeGreaterThanOrEqual(1);
      for (const v of variants) {
        expect(v.length, `${key} non-empty`).toBeGreaterThan(0);
        expect(v, `${key} trimmed`).toBe(v.trim());
        expect(v, `${key} no leak`).not.toMatch(/\$\{|\bundefined\b|\[object|\bNaN\b| {2,}/);
        expect(v, `${key} differs from canonical`).not.toBe(canon);
      }
    }
  });
  it('canonical-at-zero: a falsy seed keeps the catalog desc', () => {
    for (const [key, variants] of entries) {
      const [tier, cat, name] = key.split('|');
      const canon = resolveTierCatalog(tier)[cat][name].desc;
      expect(pickVariant([canon, ...variants], null)).toBe(canon);
      expect(pickVariant([canon, ...variants], '')).toBe(canon);
    }
  });
});

describe('institution desc variety at generation (draw-free fnv select)', () => {
  it('every generated institution desc is either its canonical or an authored variant', () => {
    const seeds = ['inst-a', 'inst-b', 'inst-c'];
    for (const seed of seeds) {
      for (const settType of ['village', 'town', 'city']) {
        const s = generateSettlementPipeline({ settType, terrainOverride: 'plains', tradeRouteAccess: 'road' }, null, { seed, customContent: {} });
        for (const inst of s.institutions || []) {
          if (inst.isCustom || inst.source === 'custom' || !inst.desc) continue;
          const key = `${settType}|${inst.category}|${inst.name}`;
          const variants = INSTITUTION_DESC_VARIANTS[key];
          if (!variants) continue; // no authored variants → catalog desc unchanged (not asserted here)
          const canon = resolveTierCatalog(settType)[inst.category][inst.name].desc;
          expect([canon, ...variants], `${key} desc from its pool`).toContain(inst.desc);
        }
      }
    }
  });
  it('the same seed reproduces the same institution descs (determinism)', () => {
    const gen = () => generateSettlementPipeline({ settType: 'town', terrainOverride: 'plains' }, null, { seed: 'det-inst', customContent: {} });
    expect((gen().institutions || []).map((i) => i.desc)).toEqual((gen().institutions || []).map((i) => i.desc));
  });
});

describe('religious_conversion pressure selector is now real re-roll variety (was name.length%3)', () => {
  const RAW = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../src/generators/narrativeText.js'), 'utf8');
  // Strip comments so the pin checks CODE, not the note that explains the removed selector.
  const CODE = RAW.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  it('the name.length % 3 deterministic selector is gone from the code', () => {
    expect(CODE).not.toMatch(/name\.length\s*%\s*3/);
  });
  it('religious_conversion returns a multi-variant pool (>=4)', () => {
    expect(PRESSURE_SENTENCES.religious_conversion({ name: 'Testholt' }).length).toBeGreaterThanOrEqual(4);
  });
  it('across seeds a religious_conversion town shows more than one pressure sentence', () => {
    const base = { name: 'Faithford', tier: 'town', stress: [{ type: 'religious_conversion' }], config: {}, institutions: [], npcs: [], history: {}, powerStructure: { factions: [], stability: 'Stable' }, economicState: { prosperity: 'Moderate' } };
    const seen = new Set();
    for (let i = 0; i < 20; i += 1) {
      setActiveRng(createPRNG(`relconv-${i}`));
      try { seen.add(generatePressureSentence(base)); } finally { clearActiveRng(); }
    }
    expect(seen.size, 'religious_conversion pressure varies across seeds').toBeGreaterThan(1);
  });
});

describe('pressure pools stay well-formed after growth', () => {
  const detail = {
    name: 'Sampleton', govFaction: 'the council', topFaction: 'the merchant guild', topNPCName: 'Aldric',
    topNPCRole: 'reeve', commodity: 'grain', milForce: 'the watch', compound: { militaryEffective: 62, economyOutput: 55, criminalEffective: 20 },
  };
  it('every stress pool resolves to a non-empty, leak-free array of sentences', () => {
    setActiveRng(createPRNG('pools'));
    try {
      for (const [type, fn] of Object.entries(PRESSURE_SENTENCES)) {
        const arr = fn(detail);
        expect(Array.isArray(arr), `${type} returns an array`).toBe(true);
        expect(arr.length, `${type} non-empty`).toBeGreaterThan(0);
        for (const s of arr) {
          expect(typeof s).toBe('string');
          expect(s, `${type} leak-free`).not.toMatch(/\$\{|\bundefined\b|\[object|\bNaN\b/);
        }
      }
    } finally { clearActiveRng(); }
  });
  it('wartime keeps both compound-branch anchors across every variant', () => {
    const win = PRESSURE_SENTENCES.wartime({ ...detail, compound: { militaryEffective: 62, economyOutput: 55 } });
    const lose = PRESSURE_SENTENCES.wartime({ ...detail, compound: { militaryEffective: 30, economyOutput: 40 } });
    for (const s of win) expect(s, 'winning anchor').toMatch(/on the right side of it/);
    for (const s of lose) { expect(s).toMatch(/losing people and resources/); expect(s).not.toMatch(/on the right side of it/); }
  });
});

describe('AMENDMENT B — sentence-start faction interpolations are capitalised (casing pass)', () => {
  const RAW = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../src/generators/narrativeText.js'), 'utf8');
  it('no capitalised-fallback (sentence-start) govFaction/topFaction interpolation is left unwrapped', () => {
    // A capitalised "The …" fallback marks a sentence-start site; every one must go
    // through capFirst so a set lowercase faction value ("the town council") opens the
    // sentence capitalised. Mid-sentence sites (lowercase "the …" fallback) stay raw.
    expect(RAW).not.toMatch(/\$\{r\.govFaction \|\| "The /);
    expect(RAW).not.toMatch(/\$\{r\.topFaction \|\| "The /);
    expect(RAW).toMatch(/capFirst\(r\.govFaction\)/);
  });
  it('a lowercase faction value opens a sentence-start pool entry capitalised', () => {
    const r = { name: 'Ashholt', govFaction: 'the town council', topFaction: 'the merchant guild', commodity: 'grain', compound: { criminalEffective: 70, militaryEffective: 20, economyOutput: 40 } };
    // famine[4] and the insurgency compound[0] both OPEN a sentence on govFaction.
    expect(PRESSURE_SENTENCES.famine(r)[4]).toMatch(/^The town council of Ashholt/);
    expect(PRESSURE_SENTENCES.insurgency(r)[0]).toMatch(/current arrangement\. The town council still holds/);
    // indebted[1] OPENS on topFaction.
    expect(PRESSURE_SENTENCES.indebted(r)[1]).toMatch(/^The merchant guild took the loans/);
  });
  it('capFirst is idempotent — an already-capitalised faction value is unchanged', () => {
    const r = { name: 'Ashholt', govFaction: 'The Governing Council', commodity: 'grain' };
    expect(PRESSURE_SENTENCES.famine(r)[4]).toMatch(/^The Governing Council of Ashholt/);
  });
  it('mid-sentence faction interpolations stay lowercase (not over-capitalised)', () => {
    const r = { name: 'Ashholt', govFaction: 'the town council', commodity: 'grain' };
    // under_siege[1] uses govFaction mid-sentence after "; " — must remain lowercase.
    expect(PRESSURE_SENTENCES.under_siege(r)[1]).toMatch(/second week; the town council controls/);
  });
});
