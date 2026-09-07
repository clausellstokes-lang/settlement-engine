/**
 * receiptAnnex.test.js — the guard on the guard.
 *
 * `tests/helpers/receiptAnnex.js` is the single reader four kind-pool walkers now trust for
 * their corpus comparison. Its whole value is that it FAILS LOUD where the hand-rolled
 * `indexOf` extractors failed silent, so the two failure modes it exists to close are pinned
 * here against synthetic sources (where a duplicate heading can be constructed) and against
 * the REAL corpus (where the prefix trap has a live victim: `home_front_hand` is a strict
 * prefix of the authored `home_front_hands`).
 *
 * These are not walker rows and they are not corpus depth pins — they are the receipts that
 * the reader cannot go vacuous. Deleting one to make a corpus edit pass is the defect.
 */
import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import { anchoredOnce, receiptAnnexPool, sectionSlice, WAR_ANNEX_URL } from './receiptAnnex.js';

const WR4 = { source: readFileSync(WAR_ANNEX_URL, 'utf8'), section: '# WR-4', until: '# WR-5' };
const INTERP = Object.freeze({
  settlement: 'Ashford',
  counterpart: 'Eastvale',
  band: 'noticeably',
  route: 'The Eastvale road',
});

describe('receiptAnnex — the exactly-once anchors', () => {
  test('a single line-anchored match is returned; zero and two both throw', () => {
    const source = '# WR-6 — heading\nbody\n# WR-7 — heading\n';
    expect(anchoredOnce(source, /^# WR-7(?=[ \n])/gm, 'terminator')[0]).toBe('# WR-7');
    expect(() => anchoredOnce(source, /^# WR-9(?=[ \n])/gm, 'absent'))
      .toThrow(/expected exactly 1 match .* found 0/);
    expect(() => anchoredOnce(`${source}# WR-7 — a second, stale heading\n`, /^# WR-7(?=[ \n])/gm, 'doubled'))
      .toThrow(/expected exactly 1 match .* found 2/);
  });

  test('a pattern without the g flag is refused rather than silently reading one match', () => {
    expect(() => anchoredOnce('# WR-7 x', /^# WR-7/m, 'ungreedy')).toThrow(/needs the g flag/);
  });

  test('the substring hazard the indexOf slice carried is closed at the anchor', () => {
    // `'# WR-7'` is a SUBSTRING of `'## WR-7a'`. Where the subsection is spelled first, the
    // old `source.indexOf('# WR-7')` terminator lands INSIDE the subsection heading and the
    // section slice silently stops early; the anchored read finds the real heading.
    const volume = '# WR-6 — coalition\nrow\n## WR-7a — errand\nrow\n# WR-7 — envoys\n';
    expect(volume.slice(volume.indexOf('# WR-7'), volume.indexOf('# WR-7') + 9)).toBe('# WR-7a —');
    const slice = sectionSlice(volume, '# WR-6', '# WR-7');
    expect(slice).toBe('# WR-6 — coalition\nrow\n## WR-7a — errand\nrow\n');
  });

  test('a terminator that precedes its section is refused, not read backwards', () => {
    expect(() => sectionSlice('# WR-5 — later\n# WR-4 — earlier\n', '# WR-4', '# WR-5'))
      .toThrow(/precedes/);
  });
});

describe('receiptAnnex — reading the live corpus', () => {
  test('a relocated pool follows the forward and yields only the wired five', () => {
    const pool = receiptAnnexPool('home_front_roads', { ...WR4, interp: INTERP });
    expect(pool.from).toBe('legacy');
    expect(pool.lines).toHaveLength(5);
    expect(pool.lines[0])
      .toBe('The Eastvale road has gone to ruts while the levies were away, and the tolls have gone with it.');
    expect(pool.requiredSlots).toEqual([
      ['route', 'tollLoss'],
      ['causewayNeglect'],
      [],
      ['bridgeDamage'],
      ['settlement', 'band'],
    ]);
    for (const line of pool.lines) {
      expect(line).toBe(line.trim());
      expect(line.includes('`')).toBe(false);   // every annex metadata tag was stripped
      expect(line.includes('{')).toBe(false);   // every named slot resolved
    }
  });

  test('a pool still resident in the war volume reads there and declares no slots', () => {
    const pool = receiptAnnexPool('winning_abroad_losing_at_home', { ...WR4, interp: INTERP });
    expect(pool.from).toBe('war');
    expect(pool.requiredSlots).toBeNull();
    expect(pool.lines).toHaveLength(5);
    expect(pool.lines[0])
      .toBe("Ashford's banners stand on Eastvale's walls and its own granaries hold noticeably.");
  });

  test('a kind name that is only a PREFIX of an authored one throws instead of matching it', () => {
    // The live victim: `### home_front_hands ` is authored, `home_front_hand` is not. An
    // unanchored `indexOf('### home_front_hand ')` would miss (trailing space) but
    // `indexOf('### home_front_hand')` — the shape one refactor away — would land inside it.
    expect(() => receiptAnnexPool('home_front_hand', { ...WR4, interp: INTERP }))
      .toThrow(/home_front_hand: heading in # WR-4 .* found 0/);
    expect(receiptAnnexPool('home_front_hands', { ...WR4, interp: INTERP }).lines).toHaveLength(5);
  });

  test('a kind asked for in the wrong wave section throws rather than reading an empty block', () => {
    expect(() => receiptAnnexPool('home_front_roads', {
      source: WR4.source, section: '# WR-5', until: '# WR-6', interp: INTERP,
    })).toThrow(/heading in # WR-5 .* found 0/);
  });
});
