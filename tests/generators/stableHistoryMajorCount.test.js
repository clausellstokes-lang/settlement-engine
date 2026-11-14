/**
 * tests/generators/stableHistoryMajorCount.test.js — R2-CODE-A-2, the cold list REVIEW-W2A-3 MEDIUM #817:
 * "The Migration aside, the history here is long and steady" printed over a village whose History tab lists the
 * Migration, the Occupation and the Succession Crisis, all major. #9 (W5 HIS) taught three `stable` lines to name
 * a major event; each named the FIRST and denied the rest ("aside", "Apart from", "the one event … the rest is
 * quieter"). They now read the count of major events: one, as before; two or more, a line true of several, which
 * names the first two. Draw-free: a branch inside the drawn closure.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { POLITICAL_FLAVOR } from '../../src/generators/narrativeText.js';
import { textOf } from '../../src/domain/facts/textOf.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const ONE = [{ name: 'Crash', severity: 'major', type: 'economic' }, { name: 'Fair', severity: 'minor', type: 'economic' }];
const TWO = [{ name: 'Crash', severity: 'major', type: 'economic' }, { name: 'Siege', severity: 'catastrophic', type: 'military' }];
const THREE = [...TWO, { name: 'Purge', severity: 'major', type: 'political' }];
/** the three lines that name a major event, by their place in the pool */
const LINES = [0, 2, 4].map((i) => textOf(POLITICAL_FLAVOR.stable[i]));
const DENIES = /aside, the history here is long and steady|^Apart from the [^,]+, its history is steady|is the one event people here still date things by/;

describe('the stable lines that name a major event read how many there are', () => {
  it('one major event: each line names it, as before', () => {
    expect(LINES[0](ONE)).toBe('Apart from the Crash, its history is steady: it simply continued, and that took more work than it looks');
    expect(LINES[1](ONE)).toBe('The Crash aside, the history here is long and steady, and travellers remember the place kindly');
    expect(LINES[2](ONE)).toBe('The Crash is the one event people here still date things by; the rest of its history is quieter');
  });
  it('major events: no line names one and denies the rest; each names the first two (every row)', () => {
    for (const [_n, events] of [['two', TWO], ['three', THREE]]) {
      for (const line of LINES.slice(0, 2)) {
        const t = line(events);
        expect(t, `${_n} major events: no line names one and denies the rest`).not.toMatch(DENIES);
        expect(t, `${_n} major events: names the Crash`).toMatch(/Crash/);
        expect(t, `${_n} major events: names the Siege`).toMatch(/Siege/);
      }
    }
  });
  it('two major events and nothing else: the dating line names both and claims no quieter rest', () => {
    const t = LINES[2](TWO);
    expect(t).not.toMatch(DENIES);
    expect(t).not.toMatch(/quieter/);
    expect(t).toMatch(/Crash/);
    expect(t).toMatch(/Siege/);
  });
});

describe('the cold list\'s town, born as the app births it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rw3-village-insurgency-1 (#817): its history character names no single major event as the only one', () => {
    const seed = 'rw3-village-insurgency-1';
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'village', selectedStressesRandom: false, selectedStresses: ['insurgency'], _randomizePriorities: true }), null, { seed, customContent: {} }));
    const majors = (s.history.historicalEvents || []).filter((/** @type {any} */ e) => e.severity === 'major' || e.severity === 'catastrophic');
    expect(majors.length).toBeGreaterThan(1);
    expect(s.history.historicalCharacter).not.toMatch(DENIES);
  });
});
