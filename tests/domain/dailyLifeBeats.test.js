/**
 * tests/domain/dailyLifeBeats.test.js — ONE GENERATOR FOR THE OFFLINE PROSE, THE CLAIM AND THE
 * FALLBACK (design §5c rule 4; W4 car 3).
 *
 * ⛔ THE ARM THAT MATTERS MOST IS THE ORACLE. The five beats were cut out of the Daily Life tab's
 * own `buildLocalDailyLifeNarrative`, and the whole point of moving it rather than re-writing it is
 * that the tab's offline output does not change by one byte. So the function AS IT STOOD BEFORE
 * THE MOVE is transcribed here, character for character, and the moved one is measured against it
 * over the golden corpus. A test that only asserted "five strings come back" would have let a
 * re-worded paragraph through, and a re-worded paragraph is a re-worded CLAIM: it is the line the
 * Scribe must keep and the line that ships when a beat is refused.
 */
import { describe, it, expect } from 'vitest';

import {
  DAILY_LIFE_BEATS, DAILY_LIFE_BLOCK, DAILY_LIFE_LABELS, dailyLifeBeats, dailyLifeNarrative,
} from '../../src/domain/prose/dailyLifeBeats.js';
import { extractSettlementContext } from '../../src/components/new/dailyLifeLogic.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus } from '../helpers/goldenMasterCorpus.js';

/** ⛔ THE ORACLE: `DailyLifeTab.jsx`'s generator as it stood at f350d7ed5, transcribed verbatim. */
function humanizeBefore(value) {
  if (!value) return '';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}
function listTextBefore(items, fallback) {
  const clean = (items || []).filter(Boolean);
  if (!clean.length) return fallback;
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(', ')} and ${clean.at(-1)}`;
}
function buildLocalDailyLifeNarrativeBefore(ctx) {
  const terrain = humanizeBefore(ctx.terrain) || 'mixed terrain';
  const trade = humanizeBefore(ctx.tradeRoute) || 'road access';
  const culture = humanizeBefore(ctx.culture) || 'local custom';
  const food = ctx.foodDeficit > 20
    ? 'bread is dear and the poorest households plan every meal carefully'
    : ctx.foodDeficit > 0
      ? 'food is adequate for most families, though prices are watched closely'
      : ctx.foodSurplus > 10
        ? 'granaries and kitchen gardens give the town a little breathing room'
        : 'the food supply is ordinary, practical, and never taken for granted';

  const order = ctx.safetyScore >= 70
    ? 'people move after dusk with confidence'
    : ctx.safetyScore >= 45
      ? 'doors are barred early and strangers are studied before they are welcomed'
      : 'ordinary errands carry a careful awareness of who controls the street';

  const institutions = Object.values(ctx.keyInsts || {}).flat().slice(0, 5);
  const anchors = listTextBefore(institutions, 'the market, shrine, workshop, and watch post');
  const stress = ctx.stressTypes.length
    ? `The talk of the day keeps returning to ${listTextBefore(ctx.stressTypes.map(humanizeBefore), 'the current strain')}.`
    : 'The place is not peaceful so much as practiced: people know its routines and work around its frictions.';

  return [
    `Morning starts around ${anchors}. ${terrain} and ${trade} shape the pace: carts, tools, and gossip move where the ground and roads allow, while ${culture} gives even routine bargains a recognizable local rhythm.`,
    `${food}. Work is divided by habit more than proclamation. Farmers, haulers, priests, guards, and tradespeople all know which shortages can be endured and which ones will turn into arguments before sundown.`,
    `Power is felt through ${ctx.govFaction || 'whoever can make orders stick this week'}. ${ctx.stability < 45 ? "Promises are weighed carefully because yesterday's bargain may not survive tomorrow." : 'Most residents know where authority lives and how to petition it without making themselves memorable.'} ${order}.`,
    `${stress} By evening, daily life narrows to lamplight, shared meals, debts remembered, and news carried from door to door. The settlement feels less like a map marker than a set of bargains people keep renewing because leaving would cost more than staying.`,
  ].join('\n\n');
}

/** A deterministic slice of the golden corpus, by stride, so the sample spans the grid. */
function sample(n) {
  const rows = goldenCorpus();
  const stride = Math.max(1, Math.floor(rows.length / n));
  const out = [];
  for (let i = 0; i < rows.length && out.length < n; i += stride) out.push(rows[i]);
  return out;
}
const townOf = (row) => {
  const { _seed, ...cfg } = row;
  return generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
};

describe('THE SHAPE', () => {
  it('five beats, in the order a day happens in, with a label each', () => {
    expect(DAILY_LIFE_BEATS).toEqual(['dawn', 'market', 'midday', 'tavern', 'night']);
    expect(DAILY_LIFE_LABELS).toHaveLength(DAILY_LIFE_BEATS.length);
    expect(DAILY_LIFE_BLOCK).toBe('DS-DAILY');
  });

  it('every beat is a non-empty paragraph on a real town, and the list is deterministic', () => {
    const s = townOf(goldenCorpus()[0]);
    const beats = dailyLifeBeats(s);
    expect(beats).toHaveLength(5);
    expect(beats.every((b) => typeof b === 'string' && b.trim().length > 0)).toBe(true);
    expect(dailyLifeBeats(s)).toEqual(beats);
  });

  it('a settlement that is nothing at all still answers five strings rather than throwing', () => {
    expect(dailyLifeBeats(null)).toHaveLength(5);
    expect(dailyLifeBeats({})).toHaveLength(5);
  });
});

describe('⛔ THE OFFLINE PROSE IS BYTE-IDENTICAL TO WHAT THE TAB RENDERED BEFORE THE MOVE', () => {
  it('matches the transcribed pre-move generator over a slice of the golden corpus', () => {
    const drift = [];
    for (const row of sample(24)) {
      let s;
      try { s = townOf(row); } catch { continue; }
      const before = buildLocalDailyLifeNarrativeBefore(extractSettlementContext(s));
      if (dailyLifeNarrative(s) !== before) drift.push(String(row._seed));
    }
    expect(drift, `\nthe offline prose moved on: ${drift.join(', ')}\n`).toEqual([]);
  }, 300_000);

  it('and the join is the seam the fourth paragraph already had: one space, not a paragraph break', () => {
    const s = townOf(goldenCorpus()[0]);
    const beats = dailyLifeBeats(s);
    expect(dailyLifeNarrative(s).split('\n\n')).toHaveLength(4);
    expect(dailyLifeNarrative(s).split('\n\n')[3]).toBe(`${beats[3]} ${beats[4]}`);
  });

  // NEGATIVE CONTROL — the oracle can fail. A beat re-worded by one character is caught.
  it('the oracle convicts a re-worded beat', () => {
    const s = townOf(goldenCorpus()[0]);
    const beats = dailyLifeBeats(s);
    const tampered = [beats[0], beats[1], beats[2], `${beats[3]} ${beats[4]}!`].join('\n\n');
    expect(tampered).not.toBe(buildLocalDailyLifeNarrativeBefore(extractSettlementContext(s)));
  });
});
