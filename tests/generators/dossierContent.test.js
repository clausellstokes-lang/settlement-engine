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
import { HISTORY_DESC_VARIANTS } from '../../src/data/historyDescVariants.js';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { pickVariant } from '../../src/kernel/proseHash.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { generatePressureSentence } from '../../src/generators/narrativeGenerator.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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
  it('is EXHAUSTIVE: every catalog institution bearing a desc has a variants entry (Charge 2 ratchet)', () => {
    // The inverse walker: the catalog is the denominator. A new catalog institution
    // must ship with authored desc variants (or this pin flags the gap deliberately).
    const missing = [];
    for (const [tier, cats] of Object.entries(institutionalCatalog)) {
      for (const [cat, insts] of Object.entries(cats)) {
        for (const [name, entry] of Object.entries(insts)) {
          if (typeof entry?.desc !== 'string' || !entry.desc) continue;
          if (!INSTITUTION_DESC_VARIANTS[`${tier}|${cat}|${name}`]) missing.push(`${tier}|${cat}|${name}`);
        }
      }
    }
    expect(missing, `catalog institutions without desc variants: ${missing.join(', ')}`).toEqual([]);
    expect(entries.length).toBeGreaterThanOrEqual(301);
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
        // anchored: the two assertions above pin `v` as a non-empty trimmed authored string, so this leak scan cannot read an empty or absent variant.
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
  it('every generated institution desc is either a catalog canonical or an authored variant', () => {
    // The assembly post-pass selects from [ARRIVED desc, ...variants[settlementTier|cat|name]].
    // The arrived desc is usually the settlement tier's canonical, but institutions can
    // legitimately arrive carrying ANOTHER tier's catalog desc (e.g. a village with the
    // hamlet 'Dairy farmer' text) — so the acceptance set is {any tier's canonical for this
    // cat|name} ∪ that key's variants.
    const canonsFor = (cat, name) => Object.keys(institutionalCatalog)
      .map((t) => institutionalCatalog[t]?.[cat]?.[name]?.desc)
      .filter((d) => typeof d === 'string');
    const seeds = ['inst-a', 'inst-b', 'inst-c'];
    const cases = seeds.flatMap(
      (seed) => ['village', 'town', 'city'].map((settType) => ({ seed, settType })),
    );
    const failures = collectSeedFailures(cases, ({ seed, settType }) => {
      const s = generateSettlementPipeline({ settType, terrainOverride: 'plains', tradeRouteAccess: 'road' }, null, { seed, customContent: {} });
      expect((s.institutions || []).length, `${settType}/${seed} generated a roster`).toBeGreaterThan(0);
      for (const inst of s.institutions || []) {
        if (inst.isCustom || inst.source === 'custom' || !inst.desc) continue;
        const key = `${settType}|${inst.category}|${inst.name}`;
        const variants = INSTITUTION_DESC_VARIANTS[key];
        if (!variants) continue; // no authored variants → catalog desc unchanged (not asserted here)
        const pool = [...canonsFor(inst.category, inst.name), ...variants];
        expect(pool, `${key} desc from its pool`).toContain(inst.desc);
      }
    });
    expectNoSeedFailures(failures, 'every generated institution desc is a canonical or an authored variant');
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
    // LIVENESS ANCHOR: a failed read or an over-eager comment strip would leave CODE
    // empty, and "the selector is gone" would then be true of nothing at all. The
    // pool this test is about must still be visible as code.
    expect(CODE, 'the stripped source still carries the religious_conversion pool')
      .toMatch(/religious_conversion:\s*\(/);
    // anchored: the assertion above proves CODE is the live non-empty source of narrativeText.js, so this measures removal rather than emptiness.
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
          expect(s.trim().length, `${type} sentence is rendered prose`).toBeGreaterThan(0);
          // anchored: the pool is pinned non-empty above and this sentence is pinned non-empty prose, so the leak scan always has real text to read.
          expect(s, `${type} leak-free`).not.toMatch(/\$\{|\bundefined\b|\[object|\bNaN\b/);
        }
      }
    } finally { clearActiveRng(); }
  });
  it('wartime keeps both compound-branch anchors across every variant', () => {
    const win = PRESSURE_SENTENCES.wartime({ ...detail, compound: { militaryEffective: 62, economyOutput: 55 } });
    const lose = PRESSURE_SENTENCES.wartime({ ...detail, compound: { militaryEffective: 30, economyOutput: 40 } });
    // Both pools must actually have variants, or the two loops below assert nothing.
    expect(win.length, 'the winning-compound wartime pool is non-empty').toBeGreaterThan(0);
    expect(lose.length, 'the losing-compound wartime pool is non-empty').toBeGreaterThan(0);
    for (const s of win) expect(s, 'winning anchor').toMatch(/on the right side of it/);
    // anchored: the positive matcher on the SAME string in this statement pins live losing-branch prose, and the pool's emptiness now reds above.
    for (const s of lose) { expect(s).toMatch(/losing people and resources/); expect(s).not.toMatch(/on the right side of it/); }
  });
});

describe('AMENDMENT B — sentence-start faction interpolations are capitalised (casing pass)', () => {
  const RAW = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../src/generators/narrativeText.js'), 'utf8');
  it('no capitalised-fallback (sentence-start) govFaction/topFaction interpolation is left unwrapped', () => {
    // A capitalised "The …" fallback marks a sentence-start site; every one must go
    // through capFirst so a set lowercase faction value ("the town council") opens the
    // sentence capitalised. Mid-sentence sites (lowercase "the …" fallback) stay raw.
    // LIVENESS ANCHOR first: the positive below proves RAW is the live narrativeText
    // source. Ordered before the exclusions so an unreadable/empty file reds here.
    expect(RAW).toMatch(/capFirst\(r\.govFaction\)/);
    // anchored: the capFirst assertion above pins RAW as the live source file, so an empty read cannot make these two exclusions pass vacuously.
    expect(RAW).not.toMatch(/\$\{r\.govFaction \|\| "The /);
    // anchored: same live-RAW anchor as the assertion above.
    expect(RAW).not.toMatch(/\$\{r\.topFaction \|\| "The /);
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

describe('HISTORY_DESC_VARIANTS — Charge 1: banked history-event descriptions', () => {
  const CANON = Object.fromEntries(HISTORICAL_EVENTS_DATA.map((e) => [e.type, e.description]));
  const entries = Object.entries(HISTORY_DESC_VARIANTS);
  // The tokens generateEventNarrative.defaultTokens resolves (parity gate).
  const KNOWN_TOKENS = new Set(['{quarter}', '{building_type}', '{percent}', '{duration}', '{location}', '{dragon_color}', '{authority}', '{method}', '{former_ruler}', '{family_name}', '{new_family}', '{faction}', '{outcome}', '{ally_settlement}', '{route_type}', '{destination}', '{reason}', '{guild_name}', '{demands}', '{frequency}', '{bank_name}', '{resource}', '{deity}', '{heresy_type}', '{saint_name}', '{order_name}', '{doctrinal_dispute}', '{wizard_name}', '{magical_effect}', '{plane_name}', '{founder}']);

  it('covers every catalog event type, 2 variants each', () => {
    expect(entries.length).toBe(HISTORICAL_EVENTS_DATA.length);
    for (const [type, variants] of entries) {
      expect(CANON[type], `${type} is a real catalog type`).toBeTruthy();
      expect(variants.length, `${type} variant count`).toBe(2);
    }
  });

  it('every variant is non-empty, trimmed, distinct from canonical, and token-safe', () => {
    for (const [type, variants] of entries) {
      for (const v of variants) {
        expect(v.length, `${type} non-empty`).toBeGreaterThan(0);
        expect(v, `${type} trimmed`).toBe(v.trim());
        expect(v, `${type} differs from canonical`).not.toBe(CANON[type]);
        // No leaked object/undefined markers; only substitution tokens are {…}.
        // anchored: the assertions above pin `v` as a non-empty trimmed authored string that differs from the canonical, so this scan reads real text.
        expect(v, `${type} no leak`).not.toMatch(/\bundefined\b|\[object|\bNaN\b| {2,}/);
        const toks = v.match(/\{[a-z_]+\}/g) || [];
        for (const t of toks) expect(KNOWN_TOKENS.has(t), `${type}: unknown token ${t}`).toBe(true);
        // Repeated known tokens are valid: renderHistoryTemplate resolves every
        // occurrence. This gate owns vocabulary parity, not template phrasing.
      }
    }
  });

  it('canonical-at-zero: a falsy seed keeps the catalog description', () => {
    for (const [type, variants] of entries) {
      expect(pickVariant([CANON[type], ...variants], null)).toBe(CANON[type]);
      expect(pickVariant([CANON[type], ...variants], '')).toBe(CANON[type]);
    }
  });

  it('generated history descriptions leave no token residue and stay in the authored pool', () => {
    // Token-free types (canonical + both variants carry no {…}) admit an EXACT pool check.
    const tokenFree = new Set(entries
      .filter(([type, vs]) => ![CANON[type], ...vs].some((s) => /\{[a-z_]+\}/.test(s)))
      .map(([type]) => type));
    const cases = ['h-a', 'h-b', 'h-c'].flatMap(
      (seed) => ['town', 'city'].map((settType) => ({ seed, settType })),
    );
    const failures = collectSeedFailures(cases, ({ seed, settType }) => {
      const s = generateSettlementPipeline({ settType, terrainOverride: 'plains', tradeRouteAccess: 'road' }, null, { seed, customContent: {} });
      const events = s.history?.historicalEvents || [];
      // LIVENESS ANCHOR: a settlement with no history events would satisfy the
      // residue exclusion below by having nothing to scan (measured 2026-07-27:
      // these six cases produce 2–10 events each).
      expect(events.length, `${settType}/${seed} produced history events to scan`).toBeGreaterThan(0);
      for (const ev of events) {
        expect(String(ev.description).trim().length, `${settType}/${seed} event description is prose`).toBeGreaterThan(0);
        // anchored: the two assertions above pin a non-empty event roster and non-empty description prose, so the residue scan always reads real text.
        expect(String(ev.description), `${ev.templateType} residue`).not.toMatch(/\{[a-z_]+\}/);
        if (tokenFree.has(ev.templateType)) {
          const pool = [CANON[ev.templateType], ...HISTORY_DESC_VARIANTS[ev.templateType]];
          expect(pool, `${ev.templateType} desc in pool`).toContain(ev.description);
        }
      }
    });
    expectNoSeedFailures(failures, 'generated history descriptions leave no token residue and stay in the authored pool');
  });

  it('same seed reproduces the same history descriptions (determinism)', () => {
    const descs = (seed) => (generateSettlementPipeline({ settType: 'city', terrainOverride: 'plains' }, null, { seed, customContent: {} })
      .history?.historicalEvents || []).map((e) => e.description);
    expect(descs('det-hist')).toEqual(descs('det-hist'));
  });
});
