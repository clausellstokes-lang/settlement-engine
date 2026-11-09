/** @vitest-environment jsdom */
/**
 * faithTabChurch.test.jsx — LANE FAITH (2026-11-03): the Faith tab describes the church that
 * exists instead of denying it (root-cause failure 2, "Faith denies its own church").
 *
 * THE CORPUS: nine generated settlements per tier, fixed seeds, each carrying church evidence
 * by this file's OWN predicate (a church-kind institution, a religious faction, a clergy NPC or
 * a Church Tithes income row). The predicate is deliberately independent of the reading under
 * test, so the reading cannot grade its own homework.
 *
 * THE RENDER: the real FaithTab, three ways: a free viewer on their own save, a free viewer on
 * a shared dossier, and a premium viewer on their own save.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, {
      auth: { tier: 'anon' },
      isElevated: () => false,
      setPurchaseModalOpen: () => {},
      setActivePricingMoment: () => {},
      campaigns: [],
      savedSettlements: [],
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import FaithTab from '../../src/components/new/tabs/FaithTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { FAITH_YOURS_LINE, faithReadingOf } from '../../src/domain/dossier/faithReading.js';
import { faithDenialFindings } from '../../src/domain/coherence/faithDenialFindings.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { faithPanelModel } from '../../src/components/settlement/faithPanelModel.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const DIALS = [10, 30, 50, 70, 90];
const PER_TIER = 9;

/** The two denials the audit found beside a church. */
const DENIALS = [/keeps no named faith/i, /No single creed holds sway/i];

/** @param {any} s @returns {boolean} this file's own church-evidence predicate */
function hasChurchEvidence(s) {
  const inst = (s?.institutions || []).some((i) => /church|cathedral|monaster|friary|temple|chapel|abbey/i.test(String(i?.name || '')));
  const faction = (s?.powerStructure?.factions || []).some((f) => String(f?.category || '') === 'religious');
  const clergy = (s?.npcs || []).some((n) => /priest|bishop|patriarch|abbot|abbess|inquisitor/i.test(String(n?.role || '')));
  const tithe = (s?.economicState?.incomeSources || []).some((r) => /tithe/i.test(String(r?.source || '')));
  return inst || faction || clergy || tithe;
}

/** @returns {Array<{tier: string, seed: string, s: any}>} */
function churchCorpus() {
  const out = [];
  for (const tier of TIERS) {
    let found = 0;
    for (let n = 0; found < PER_TIER && n < 60; n++) {
      const seed = `faith-church-${tier}-${n}`;
      const s = generateSettlementPipeline({ settType: tier, priorityReligion: DIALS[n % DIALS.length] }, null, { seed, customContent: {} });
      if (!hasChurchEvidence(s)) continue;
      out.push({ tier, seed, s });
      found++;
    }
  }
  return out;
}

const CORPUS = churchCorpus();

/** @param {any} s @param {{premium?: boolean, publicDossier?: boolean}} view @returns {string} */
function faithText(s, { premium = false, publicDossier = false } = {}) {
  useStore.__reset();
  if (premium) useStore.__set({ auth: { tier: 'premium' } });
  const { container } = render(<FaithTab settlement={s} saveId={publicDossier ? null : 'save-1'} publicDossier={publicDossier} />);
  const text = container.textContent || '';
  cleanup();
  return text;
}

const VIEWS = [
  { label: 'free, own save', premium: false, publicDossier: false },
  { label: 'free, shared dossier', premium: false, publicDossier: true },
  { label: 'premium, own save', premium: true, publicDossier: false },
];

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('the Faith tab beside a church (acceptance 1)', () => {
  it('the corpus is 54 settlements with church evidence, nine per tier', () => {
    expect(CORPUS.length).toBe(TIERS.length * PER_TIER);
  });

  it('no view of the 54 renders "keeps no named faith" or "No single creed holds sway"', () => {
    /** @type {string[]} */
    const hits = [];
    let rendered = 0;
    for (const { seed, s } of CORPUS) {
      for (const view of VIEWS) {
        const text = faithText(s, view);
        if (text.length > 0) rendered++;
        for (const re of DENIALS) if (re.test(text)) hits.push(`${seed} · ${view.label} · ${re.source}`);
      }
    }
    // The liveness anchor: every render printed something, so the zero below is a measurement.
    expect(rendered).toBe(CORPUS.length * VIEWS.length);
    expect(hits, `denials beside a church (${new Set(hits.map((h) => h.split(' · ')[0])).size} settlements):\n${hits.slice(0, 12).join('\n')}`).toEqual([]);
  });
});

/** @param {string} hay @param {string} needle @returns {number} */
const countOf = (hay, needle) => hay.split(needle).length - 1;

describe('the line names the church the reading found (acceptance 2)', () => {
  it('every view of the 54 names the church, the faction and the cleric, and gives the names to the DM once', () => {
    /** @type {string[]} */
    const misses = [];
    for (const { seed, s } of CORPUS) {
      const r = faithReadingOf(s);
      for (const view of VIEWS) {
        const text = faithText(s, view);
        const where = `${seed} · ${view.label}`;
        if (r.hasChurch && !text.toLowerCase().includes(r.churchWords.toLowerCase())) misses.push(`${where}: church "${r.churchWords}"`);
        if (r.accessOnly && !/walk to the next village’s parish church/.test(text)) misses.push(`${where}: access`);
        if (r.religiousFaction && !text.includes(r.religiousFaction.name)) misses.push(`${where}: faction ${r.religiousFaction.name}`);
        if (r.seniorCleric && !text.includes(r.seniorCleric.role)) misses.push(`${where}: cleric ${r.seniorCleric.role}`);
        if (countOf(text, FAITH_YOURS_LINE) !== 1) misses.push(`${where}: the DM line ${countOf(text, FAITH_YOURS_LINE)} times`);
      }
    }
    expect(misses).toEqual([]);
  });

  it('the print chapter carries the same line and no denial', () => {
    /** @type {string[]} */
    const bad = [];
    for (const { seed, s } of CORPUS) {
      const printedFaith = buildPrintProse(s)?.faith?.['faith.teaser'] || '';
      // re-keyed by identity (SW-6 R5): the DM's line is the print position `faith.hint`, under the teaser
      if (buildPrintProse(s)?.faith?.['faith.hint'] !== FAITH_YOURS_LINE) bad.push(`${seed}: no line`);
      for (const re of DENIALS) if (re.test(printedFaith)) bad.push(`${seed}: ${re.source}`);
    }
    expect(bad).toEqual([]);
  });
});

/** @param {any} s @param {{premium?: boolean, publicDossier?: boolean}} view @returns {{line: string, hint: string|null}} */
function faithParts(s, { premium = false, publicDossier = false } = {}) {
  useStore.__reset();
  if (premium) useStore.__set({ auth: { tier: 'premium' } });
  const { container } = render(<FaithTab settlement={s} saveId={publicDossier ? null : 'save-1'} publicDossier={publicDossier} />);
  const hintEl = container.querySelector('[data-testid="faith-hint"]');
  const hint = hintEl ? hintEl.textContent : null;
  hintEl?.remove();
  const line = container.textContent || '';
  cleanup();
  return { line, hint };
}

describe('the DM\'s hint sits UNDER the faith paragraph, never joined into it (SW-6, STYLE-RULINGS-2 A1 R5)', () => {
  it('every view of the 54: the hint is its own row, and the paragraph does not carry it', () => {
    /** @type {string[]} */
    const bad = [];
    for (const { seed, s } of CORPUS) {
      for (const view of VIEWS) {
        const { line, hint } = faithParts(s, view);
        if (hint !== FAITH_YOURS_LINE) bad.push(`${seed} · ${view.label}: hint ${JSON.stringify(hint)}`);
        if (line.includes(FAITH_YOURS_LINE)) bad.push(`${seed} · ${view.label}: joined into the paragraph`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('print: the teaser paragraph does not carry it; `faith.hint` follows the teaser', () => {
    for (const { s } of CORPUS.slice(0, 6)) {
      const faith = buildPrintProse(s)?.faith || {};
      expect(faith['faith.hint']).toBe(FAITH_YOURS_LINE);
      // the parity the rule exists for, kept for the hint by its own pin: print emits the model's own `hint`
      expect(faith['faith.hint']).toBe(faithPanelModel(s).hint);
      // anchored: the hint is asserted positively one line above, so the absence is a measurement
      expect(faith['faith.teaser'] || '').not.toContain(FAITH_YOURS_LINE);
      const keys = Object.keys(faith);
      expect(keys.indexOf('faith.hint')).toBe(keys.indexOf('faith.teaser') + 1);
    }
  });
});

/** A generated thorp whose only church is "Access to parish church". */
function accessThorp() {
  for (let n = 0; n < 80; n++) {
    const s = generateSettlementPipeline({ settType: 'thorp', priorityReligion: 50 }, null, { seed: `faith-access-${n}`, customContent: {} });
    const r = faithReadingOf(s);
    if (r.accessOnly && !r.hasChurch) return s;
  }
  throw new Error('no access-only thorp in eighty seeds');
}

describe('a thorp with access only (acceptance 3)', () => {
  it('says the people walk to the next village’s church, with no denial and no invented church', () => {
    const s = accessThorp();
    for (const view of VIEWS) {
      const text = faithText(s, view);
      expect(text).toMatch(/has no church of its own; its people walk to the next village’s parish church/);
      for (const re of DENIALS) expect(text, view.label).not.toMatch(re); // anchored: the walk line above is asserted in the same text
      expect(text).not.toMatch(/keeps? the faith in the thorp/); // anchored: the walk line above is asserted in the same text
    }
  });
});

/** @param {any} s @returns {any} the same settlement with every trace of a church removed */
function plantNoChurch(s) {
  return {
    ...s,
    institutions: (s.institutions || []).filter((i) => String(i?.category) !== 'Religious'),
    powerStructure: { ...s.powerStructure, factions: (s.powerStructure?.factions || []).filter((f) => f?.category !== 'religious') },
    npcs: (s.npcs || []).filter((n) => !/priest|bishop|patriarch|abbot|abbess|chaplain|head of the faithful/i.test(String(n?.role || ''))),
    economicState: { ...s.economicState, incomeSources: (s.economicState?.incomeSources || []).filter((r) => !/tithe/i.test(String(r?.source || ''))) },
  };
}

describe('a settlement with no church at all (acceptance 4)', () => {
  it('keeps the quiet-observances line, and the DM line does not appear', () => {
    const s = plantNoChurch(CORPUS.find((c) => c.tier === 'village').s);
    for (const view of VIEWS) {
      const text = faithText(s, view);
      expect(text, view.label).toMatch(/The people keep their own quiet observances/);
      expect(countOf(text, FAITH_YOURS_LINE), view.label).toBe(0);
    }
    expect(faithDenialFindings(s, faithText(s, VIEWS[0]))).toEqual([]);
  });
});

describe('the religion dial is read (acceptance 5)', () => {
  it('dial 0 and dial 100 on the same seed read differently, beside a church and beside nothing', () => {
    const base = CORPUS.find((c) => c.tier === 'town').s;
    const at = (/** @type {any} */ s, /** @type {number} */ d) => ({ ...s, config: { ...s.config, priorityReligion: d } });
    const low = faithText(at(base, 0), VIEWS[2]);
    const high = faithText(at(base, 100), VIEWS[2]);
    expect(low).not.toBe(high);
    const bare = plantNoChurch(base);
    expect(faithText(at(bare, 0), VIEWS[0])).not.toBe(faithText(at(bare, 100), VIEWS[0]));
    // And through generation itself: the same seed, born at either end of the dial.
    const born = (/** @type {number} */ d) => generateSettlementPipeline({ settType: 'town', priorityReligion: d }, null, { seed: 'faith-dial', customContent: {} });
    expect(faithText(born(0), VIEWS[0])).not.toBe(faithText(born(100), VIEWS[0]));
  });
});

describe('a DM deity embed (acceptance 6)', () => {
  it('the embed panel speaks and the line stands down', () => {
    const s = CORPUS.find((c) => c.tier === 'city').s;
    const embedded = { ...s, config: { ...s.config, primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun', alignmentAxis: 'good' } } };
    for (const view of VIEWS) {
      const text = faithText(embedded, view);
      expect(text, view.label).toContain('Sunlord Aurelian');
      expect(countOf(text, FAITH_YOURS_LINE), view.label).toBe(0);
    }
  });
});

describe('the faith-denial check (acceptance 7)', () => {
  it('finds nothing over the 54, in any view', () => {
    /** @type {string[]} */
    const found = [];
    for (const { seed, s } of CORPUS) {
      for (const view of VIEWS) {
        for (const f of faithDenialFindings(s, faithText(s, view))) found.push(`${seed} · ${view.label} · ${f.denial}`);
      }
    }
    expect(found).toEqual([]);
  });

  it('finds the denial planted beside a church', () => {
    const { s } = CORPUS.find((c) => c.tier === 'metropolis');
    const planted = `${faithText(s, VIEWS[0])} This settlement keeps no named faith.`;
    const findings = faithDenialFindings(s, planted);
    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(findings[0].evidence).toContain('church');
  });
});

describe('the one faith reading, by hand', () => {
  it('speaks the houses in plain words, the greatest first, and a population note is not a count', () => {
    const r = faithReadingOf({ institutions: [
      { name: 'Wayside shrine' }, { name: 'Multiple monasteries' }, { name: 'Parish churches (10-30)' }, { name: 'Cathedral (10,000+ only)' },
    ] });
    expect(r.churchWords).toBe('a cathedral, parish churches and monasteries');
    expect(r.hasChurch).toBe(true);
    expect(r.shrine).toBe(true);
  });

  it('a wayside shrine alone is not a church, and access alone is the walk', () => {
    expect(faithReadingOf({ institutions: [{ name: 'Wayside shrine' }] })).toMatchObject({ hasChurch: false, accessOnly: false, shrine: true });
    expect(faithReadingOf({ institutions: [{ name: 'Access to parish church' }] })).toMatchObject({ hasChurch: false, accessOnly: true });
  });

  it('the senior cleric is the highest priestly role, and a role in the name slot prints no name', () => {
    expect(faithReadingOf({ npcs: [{ name: 'Ming Li', role: 'Priest' }, { name: 'Ann Vey', role: 'Archbishop/Patriarch' }] }).seniorCleric)
      .toEqual({ name: 'Ann Vey', role: 'Archbishop' });
    expect(faithReadingOf({ npcs: [{ name: 'The High Priestess', role: 'High Priestess' }] }).seniorCleric)
      .toEqual({ name: null, role: 'High Priestess' });
  });

  it('carries the DM deity embed only when handed one', () => {
    expect(faithReadingOf({}).deity).toBeNull();
    expect(faithReadingOf({}, { deity: { name: 'Sunlord Aurelian' } }).deity).toEqual({ name: 'Sunlord Aurelian' });
  });
});
