/**
 * tests/domain/crisisPage.test.js — the Crisis page composed once
 * (src/domain/crisis/crisisPage.js :: composeCrisisPage; docs/DESIGN_CRISIS_TAB.md, "The Crisis
 * tab"): one section per active crisis, worst first, each with exactly the design's sections, every
 * cast door resolving through the dossier's entity index, and the crisis itself indexed for the tab.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composeCrisisPage, hasActiveCrisis, CRISIS_PAGE_COPY } from '../../src/domain/crisis/crisisPage.js';
import { buildDossierEntityIndex, TYPE_TO_TAB } from '../../src/domain/dossier/entityLinks.js';
import { _resolveEntity } from '../../src/store/settlementSliceHelpers.js';

const gen = (seed, settType, stressTypes) => generateSettlementPipeline({ settType, stressTypes }, null, { seed, customContent: {} });
const entriesOf = (s) => (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean);

describe('the Crisis page, one section per active crisis', () => {
  it('a two-crisis town composes two sections, worst first, each with the design\'s sections', () => {
    const s = gen('crisis-page-pair', 'town', ['famine', 'under_siege']);
    const entries = entriesOf(s);
    expect(entries.length).toBe(2);
    const page = composeCrisisPage(s);
    expect(page.map((x) => x.type)).toEqual([...entries].sort((a, b) => a.cast.rank - b.cast.rank).map((e) => e.type));
    for (const section of page) {
      const entry = entries.find((e) => e.type === section.type);
      expect(section.line.startsWith(entry.label)).toBe(true);
      expect(section.line).toBe(`${entry.label}.`); // W4 second seat, row 21: the kind is the heading, no classification
      expect(section.cast.map((r) => r.name)).toEqual(entry.cast.roles.map((r) => r.name));
      for (const r of section.cast) expect(r.reason.length).toBeGreaterThan(0);
      expect(section.stakes.length).toBe(entry.cast.stakes.length);
      expect(section.levers.map((l) => l.institution)).toEqual(entry.cast.levers.map((l) => l.institution));
      expect(section.seeFirst.map((f) => f.id)).toEqual(['food', 'defence'].filter((id) => section.seeFirst.some((f) => f.id === id)));
      expect(section.seeFirst.some((f) => f.id === 'defence')).toBe(true);
      expect(section.ifNothingIsDone).toBe(entry.viabilityNote);
    }
  });

  it('every cast door, stake door and lever door resolves through the dossier\'s entity index', () => {
    const s = gen('crisis-page-doors', 'city', ['plague_onset', 'politically_fractured']);
    const index = buildDossierEntityIndex(s);
    const page = composeCrisisPage(s);
    expect(page.length).toBeGreaterThan(0);
    let doors = 0;
    for (const section of page) {
      for (const r of section.cast) { doors += 1; expect(index.resolve(r.doorId), `${r.role} ${r.name}`).toBeTruthy(); }
      for (const k of section.stakes) { doors += 1; expect(index.resolve(k.doorId), k.factionId).toBeTruthy(); }
      for (const l of section.levers) { doors += 1; expect(index.resolve(l.doorId), l.institution).toBeTruthy(); }
    }
    expect(doors).toBeGreaterThan(0);
  });

  it('each crisis is indexed for the Crisis tab, and the store addresses its record for an edit', () => {
    const s = gen('crisis-page-index', 'town', ['famine']);
    const [entry] = entriesOf(s);
    const hit = buildDossierEntityIndex(s).resolve(`crisis.${entry.type}`);
    expect(hit).toMatchObject({ type: 'crisis', tab: 'crisis' });
    expect(TYPE_TO_TAB.crisis).toBe('crisis');
    expect(_resolveEntity({ stress: [entry] }, 'crisis', 0)).toBe(entry);
    expect(_resolveEntity({ stress: entry }, 'crisis', 0)).toBe(entry);
    expect(_resolveEntity({ stress: entry }, 'crisis', 1)).toBeNull();
  });

  it('a calm town composes no page and has no crisis', () => {
    const s = generateSettlementPipeline({ settType: 'village', selectedStressesRandom: false, selectedStresses: [] }, null, { seed: 'crisis-page-calm', customContent: {} });
    expect(s.stress).toBeNull();
    expect(hasActiveCrisis(s)).toBe(false);
    expect(composeCrisisPage(s)).toEqual([]); // anchored: s.stress is pinned null above
  });

  it('a crisis the DM\'s own event began says so; a generated one prints no onset', () => {
    const page = composeCrisisPage({ stress: [{ type: 'famine', label: 'Famine', addedByEventId: 'e1' }, { type: 'wartime', label: 'Wartime' }] });
    expect(page.map((x) => x.line)).toEqual([`Famine, ${CRISIS_PAGE_COPY.begunByYou}.`, 'Wartime.']);
  });
});

// SW-6 CRISIS-SURFACES (STYLE-RULINGS-2 B3; STYLE-2-SURFACES A·C4): "Noble Families: split. not touched yet; it
// could side with either camp." contradicted itself on every untouched row (soak1k-4, -5, -9, -10). The page prints
// an untouched power as having no stake yet; the record keeps its split for the waverer's rule.
describe('the Crisis page: an untouched power is never "split"', () => {
  it('an untouched stake prints "no stake yet", and no row says both split and untouched', () => {
    const s = gen('crisis-page-pair', 'town', ['famine', 'under_siege']);
    for (const section of composeCrisisPage(s)) {
      for (const k of section.stakes) {
        const printed = `${k.factionId}: ${CRISIS_PAGE_COPY.stake[k.stake]}. ${k.reason}.`;
        expect(printed).not.toMatch(/split\. not touched/);
        if (/either camp/.test(k.reason)) expect(CRISIS_PAGE_COPY.stake[k.stake]).toBe('no stake yet');
      }
    }
    expect(composeCrisisPage(s).some((x) => x.stakes.some((k) => k.stake === 'untouched'))).toBe(true);
  });
});
