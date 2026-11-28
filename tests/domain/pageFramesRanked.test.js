/**
 * tests/domain/pageFramesRanked.test.js — THE PAGE FRAMES BY THE RENDEZVOUS (point 121, TAIL-PICKS; the chair's ruling
 * 121-1, U4): the organised ring's vantage (`ORGANIZED_RING_NOTES`, RING-1 to RING-4), the culture scope line's frames
 * (`SCOPE_LINE_FRAMES`) and the PDF chapter heads (`OVERVIEW_HEADLINES`, `ECONOMICS_HEADLINES`, `NPCS_HEADLINES`) are
 * exported rows with ids, and each prints the highest-ranked row (key unchanged) that the place can print.
 *
 * @enforced-by npx vitest run tests/domain/pageFramesRanked.test.js
 */
import { describe, expect, it } from 'vitest';
import { ORGANIZED_RING_NOTES, deriveCriminalStructure } from '../../src/domain/display/defenseDisplay.js';
import { SCOPE_LINE_FRAMES, cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';
import { ECONOMICS_HEADLINES, NPCS_HEADLINES, OVERVIEW_HEADLINES, economicsHeadline, npcsHeadline, overviewHeadline } from '../../src/pdf/lib/headlines.js';
import { lineText } from '../../src/domain/facts/drawDeclared.js';
import { rankRendezvous } from '../../src/kernel/proseHash.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SEEDS = Array.from({ length: 80 }, (_, i) => `frames-${i}`);
const idOf = (/** @type {{ id: string }} */ l) => l.id;
const ring = { faction: "Thieves' Guild", category: 'criminal' };
/** @param {string} seed @param {string} tier */
const organised = (seed, tier) => ({
  _seed: seed, tier, powerStructure: { factions: [ring] }, institutions: [],
  economicState: { safetyProfile: { safetyLabel: 'Safe', safetyDesc: 'Quiet.', crimeTypes: [], criminalInstitutions: [] } },
});

describe('the ring note: RING-1 to RING-4, the first printable in rank', () => {
  it('the rows carry the four ids', () => {
    expect(ORGANIZED_RING_NOTES.map(idOf)).toEqual(['RING-1', 'RING-2', 'RING-3', 'RING-4']);
  });
  it('a town prints the head of the rank; a thorp whose head is the streets vantage (RING-2) prints the next', () => {
    const heads = SEEDS.map((seed) => rankRendezvous(ORGANIZED_RING_NOTES, `${seed}::defenseDisplay:organizedRing`, idOf));
    expect(heads.filter((order) => order[0].id === 'RING-2').length).toBeGreaterThan(0);
    const failures = collectSeedFailures(SEEDS, (seed, i) => {
      const order = heads[i];
      expect(deriveCriminalStructure(organised(seed, 'town'))?.note).toBe(lineText(order[0]));
      expect(deriveCriminalStructure(organised(seed, 'thorp'))?.note).toBe(lineText(order[0].id === 'RING-2' ? order[1] : order[0]));
    });
    expectNoSeedFailures(failures, 'a place printed another vantage than the first of its rank it can print');
  });
});

describe('the culture scope line: the frame of the highest rank', () => {
  it('the rows are { id, say }, five of them', () => {
    expect(SCOPE_LINE_FRAMES.map(idOf)).toEqual(['plain', 'traveller', 'local', 'newcomer', 'official']);
    for (const f of SCOPE_LINE_FRAMES) expect(typeof f.say).toBe('function');
  });
  it('a seeded place prints its head frame; an unseeded one the first', () => {
    const src = (/** @type {string|undefined} */ seed) => ({ _seed: seed, culturalIdentity: { key: 'germanic', label: 'Germanic-inspired' }, tier: 'town' });
    const bare = cultureScopeLine(src(undefined));
    expect(bare.startsWith('Germanic-inspired, ')).toBe(true);
    const phrase = bare.slice('Germanic-inspired, '.length).replace(/\.$/, '');
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const top = rankRendezvous(SCOPE_LINE_FRAMES, `${seed}::culture-scope-line`, idOf)[0];
      expect(cultureScopeLine(src(seed)).replace(/\.$/, '')).toBe(top.say('Germanic-inspired', phrase).replace(/\.$/, ''));
    });
    expectNoSeedFailures(failures, 'a seeded place printed another frame than the head of its rank');
  });
});

describe('the PDF chapter heads: rows { id, say }, the head of the rank on the key as before', () => {
  it('economics: keyed on the top export and the prosperity (no town in the key: named for RENAME-REDEALS)', () => {
    for (const good of ['grain', 'timber', 'wool', 'salt', 'iron ore', 'fish']) {
      const top = rankRendezvous(ECONOMICS_HEADLINES, `${good}|Moderate`, idOf)[0];
      expect(economicsHeadline({ prosperity: 'Moderate', primaryExports: [good] })).toContain(top.say({ topExport: good }));
    }
  });
  it('npcs: keyed on the top person\'s name', () => {
    for (const name of ['Ada', 'Bram', 'Cora', 'Dov', 'Esme', 'Fitz']) {
      const all = [{ name, power: 9 }, { name: 'Zed', power: 1 }];
      const top = rankRendezvous(NPCS_HEADLINES, name, idOf)[0];
      expect(npcsHeadline({ all })).toBe(top.say({ count: 'Two', total: 2, named: name }));
    }
  });
  it('overview: keyed on the town\'s name (an empty key takes the first row)', () => {
    expect(OVERVIEW_HEADLINES.map(idOf)).toEqual(['traveller', 'local', 'official', 'newcomer']);
    for (const name of ['Ashby', 'Brill', 'Corfe', 'Dent']) {
      const o = { prosperity: 'Moderate', stress: [{ label: 'Famine' }] };
      const head = overviewHeadline(o, { name, tier: 'town', population: 900 });
      const top = rankRendezvous(OVERVIEW_HEADLINES, name, idOf)[0];
      expect(head?.split(' ').slice(1, 4).join(' ')).toBe(String(top.say({ where: `${name}, a town of 900,`, what: 'x', after: '', seen: null, single: false })).split(' ').slice(0, 3).join(' '));
    }
  });
});

describe('the scope line and the chapter heads pass no door: every row is exactly { id, say } (ruling 121-4, F5, held by name)', () => {
  it('no row of SCOPE_LINE_FRAMES, OVERVIEW_HEADLINES, ECONOMICS_HEADLINES or NPCS_HEADLINES claims anything', () => {
    const TABLES = { SCOPE_LINE_FRAMES, OVERVIEW_HEADLINES, ECONOMICS_HEADLINES, NPCS_HEADLINES };
    /** @type {string[]} */ const bad = [];
    for (const [name, rows] of Object.entries(TABLES)) {
      for (const row of /** @type {ReadonlyArray<Record<string, unknown>>} */ (rows)) {
        const keys = Object.keys(row).sort();
        if (keys.join(',') !== 'id,say' || typeof row.id !== 'string' || typeof row.say !== 'function') bad.push(`${name} '${String(row.id)}': keys ${keys.join(', ')}`);
      }
    }
    expect(bad, 'these tables print by rank WITHOUT the door (drawDeclared): a row that declares `needs`, `excludes`, a '
      + 'tag or a twin would print where the record refuses it (a `needs: [\'coast\']` frame prints inland). Route the '
      + 'table through drawDeclared first; ORGANIZED_RING_NOTES is not one of these (it passes the door)').toEqual([]);
  });
});
