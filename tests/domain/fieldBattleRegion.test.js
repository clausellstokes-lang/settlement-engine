/**
 * fieldBattleRegion.test.js — Q-W4: a field battle's PLACE, persisted as an id.
 *
 * ⚠ THE DEFECT CLASS THIS EXISTS FOR, named by two siblings before it. `normalizeEntry`
 * is an ALLOWLIST REBUILDER, not a validator: it constructs a fresh row from a fixed key
 * list, so a field the writer sets and the rebuilder does not name is dropped on the very
 * first append AND again on every load — leaving a live reader branch dead against every
 * persisted feed. That is exactly what happened to the covert marker, and again to the
 * npc/faction address ids. A test that only checked the MINTER would pass while the field
 * never reached a save. So the round trip is asserted here, both doors.
 *
 * The place is an ID, never a terrain class and never a name: two terrain vocabularies
 * exist in this estate, and the place sentence is re-authored from the id at render
 * rather than parsed back out of the prose that consumed it.
 */
import { describe, expect, test } from 'vitest';

import {
  appendWizardNewsEntries,
  ensureWizardNewsFeed,
} from '../../src/domain/region/wizardNews.js';

/**
 * ⛔ THE PINNED INSTANT, AND WHY IT IS NOT `null`.
 *
 * Every call below passed `{ now: PINNED }`, which READS as "pin this to nothing" and
 * BEHAVES as "no pin at all": the writers stamp through
 * `entry.createdAt || options.now || nowIso()`, an `||` chain in which `null` is falsy,
 * so each call took a LIVE WALL CLOCK. The dormancy arm at the bottom of this file
 * compares two feeds byte-for-byte, so it failed whenever its two appends landed either
 * side of a millisecond boundary — measured at 784 mismatches in 200,000 iterations
 * (0.392%), and it was the estate's only declared known-red. A fixed instant is what the
 * `null` was reaching for.
 */
const PINNED = '2026-01-01T00:00:00.000Z';

/** A field-battle row shaped exactly as the transit kernel mints one. */
const battleRow = (over = {}) => ({
  id: 'wizard_news.6.field_battle.ashford.kelby',
  tick: 6,
  scope: 'regional',
  significance: 'notable',
  score: 62,
  headline: "Ashford's army breaks Kelby's in the field",
  summary: 'The marching hosts met between settlements.',
  kind: 'applied',
  impactKind: 'field_battle',
  channelType: null,
  severity: 0.55,
  settlementIds: ['ashford', 'kelby'],
  impactIds: [],
  channelIds: [],
  sourceEventId: 'field_battle.ashford.kelby.6',
  tags: ['world_pulse', 'war', 'field_battle'],
  reasons: ["A crossing-path collision in Morrow's approaches."],
  createdAt: null,
  ...over,
});

/** @param {Record<string, unknown>} feed @returns {Record<string, unknown>} */
const soleEntry = (feed) => {
  const entries = /** @type {Record<string, unknown>[]} */ (
    /** @type {{entries: unknown}} */ (feed).entries
  );
  expect(entries.length).toBe(1);
  return entries[0];
};

describe('the region survives the allowlist rebuilder — both doors', () => {
  test('WRITE door: a region set by the minter reaches the feed', () => {
    const feed = appendWizardNewsEntries({}, [battleRow({ region: 'morrow' })], { now: PINNED });
    expect(soleEntry(feed).region).toBe('morrow');
  });

  test('READ door: a persisted region survives re-normalization on load', () => {
    const written = appendWizardNewsEntries({}, [battleRow({ region: 'morrow' })], { now: PINNED });
    const reloaded = ensureWizardNewsFeed(JSON.parse(JSON.stringify(written)), { now: PINNED });
    expect(soleEntry(reloaded).region).toBe('morrow');
  });

  test('the place is an ID, carried verbatim — not a name and not a terrain class', () => {
    const feed = appendWizardNewsEntries({}, [battleRow({ region: 'morrow_vale' })], { now: PINNED });
    const entry = soleEntry(feed);
    expect(entry.region).toBe('morrow_vale');
    // anchored: the entry really carries a region (asserted on the line above); what is
    // absent is any derived terrain, which resolves through its own single reader.
    expect(Object.prototype.hasOwnProperty.call(entry, 'terrain')).toBe(false);
  });
});

describe('absence is absence — never an empty or null sentinel', () => {
  test('a battle whose region the transit layer never resolved adds NO key', () => {
    const entry = soleEntry(appendWizardNewsEntries({}, [battleRow()], { now: PINNED }));
    expect(Object.prototype.hasOwnProperty.call(entry, 'region')).toBe(false);
  });

  test("an empty-string region is refused rather than persisted as ''", () => {
    // The one reachable degenerate value: a path-less transit record with an empty
    // destination id. Persisting it would make "" indistinguishable from a real place.
    const entry = soleEntry(appendWizardNewsEntries({}, [battleRow({ region: '' })], { now: PINNED }));
    expect(Object.prototype.hasOwnProperty.call(entry, 'region')).toBe(false);
  });

  test('a whitespace-only region is refused, and a padded one is trimmed', () => {
    const blank = soleEntry(appendWizardNewsEntries({}, [battleRow({ region: '   ' })], { now: PINNED }));
    expect(Object.prototype.hasOwnProperty.call(blank, 'region')).toBe(false);
    const padded = soleEntry(appendWizardNewsEntries({}, [battleRow({ region: ' morrow ' })], { now: PINNED }));
    expect(padded.region).toBe('morrow');
  });

  test('a non-string region is refused', () => {
    for (const junk of [null, 7, {}, ['morrow']]) {
      const entry = soleEntry(appendWizardNewsEntries({}, [battleRow({ region: junk })], { now: PINNED }));
      expect(Object.prototype.hasOwnProperty.call(entry, 'region')).toBe(false);
    }
  });
});

describe('dormancy: the added key moves no byte on any world that fights no field battle', () => {
  test('a row with no region serializes IDENTICALLY to one normalized before the key existed', () => {
    // The bit claim, not the canonical-form claim. Every entry in every existing feed
    // lacks a region, so the conditional spread must add nothing to any of them.
    // ⛔⛔ THE CLOCK IS THREADED, AND ITS ABSENCE WAS A RACE RATHER THAN A STYLE POINT.
    // This arm makes TWO appends and compares their BYTES. With `{ now: null }` the stamp
    // falls through to `wallClockNow()` — `new Date().toISOString()`, millisecond
    // resolution — so the two agreed only while both calls landed inside the same
    // millisecond: MEASURED at 88 mismatches in 20,000 back-to-back repetitions on an idle
    // box, and 100% once a 3 ms gap is forced. The subject here is the REGION key's
    // byte-neutrality, never the wall clock, so the pin removes the second variable and
    // leaves the claim exactly as it was. The file-wide PINNED constant is the spelling
    // `worldGenerationClockSeam.walker` enforces; a local one would evade that guard.
    const withoutKey = appendWizardNewsEntries({}, [battleRow()], { now: PINNED });
    const explicitlyEmpty = appendWizardNewsEntries({}, [battleRow({ region: '' })], { now: PINNED });
    expect(JSON.stringify(explicitlyEmpty)).toBe(JSON.stringify(withoutKey));
    // anchored: the comparison is over two REAL feeds that each carry the threaded stamp
    // and each really lack the key, so a frozen clock cannot make the equality vacuous.
    expect(JSON.stringify(withoutKey)).toContain(PINNED);
    expect(Object.prototype.hasOwnProperty.call(soleEntry(explicitlyEmpty), 'region')).toBe(false);
  });

  test('a non-engagement row is untouched by the field', () => {
    const plain = {
      id: 'wizard_news.3.trade.ashford', tick: 3, scope: 'regional', significance: 'notable',
      score: 10, headline: 'A market day', summary: '', kind: 'applied', impactKind: 'trade',
      channelType: null, severity: 0.1, settlementIds: ['ashford'], impactIds: [], channelIds: [],
      sourceEventId: null, tags: [], reasons: [], createdAt: null,
    };
    const entry = soleEntry(appendWizardNewsEntries({}, [plain], { now: PINNED }));
    expect(Object.prototype.hasOwnProperty.call(entry, 'region')).toBe(false);
  });
});
