/**
 * tests/domain/powerSentenceName.test.js — A POWER'S NAME IN A PULSE LINE IS A NAME, AND ITS
 * POSSESSIVE IS FORMED FOR WHAT IT IS.
 *
 * The pulse's power-move lines (worldPulse/factionCompetition.js) printed a power's label raw
 * and formed its possessive by rule: "Military/Guard captures an institution", "Religious
 * Authorities's people are moving in on the docks" (VISIBLE-BUGS item 5, 2026-11-12; the landing
 * region's seeds lf-001..040: 16 slashed headlines and 16 bodies, 23 plural "'s" lines, of 147).
 * Two arms: the leaf on every slashed label the estate's data names and on singular and plural
 * names; and a real run, every power-move line on seeds that carried each shape at the base.
 */
import { describe, it, expect } from 'vitest';
import { powerPossessive, powerSentenceName } from '../../src/domain/display/powerSentenceName.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { FACTION_VERB_PHRASES } from '../../src/domain/worldPulse/factionCompetition.js';

describe('powerSentenceName / powerPossessive', () => {
  it('a slashed label reads as its first name, and a bloc\'s plural takes a bare apostrophe', () => {
    expect(powerSentenceName('Military/Guard')).toBe('Military');
    expect(powerSentenceName('Monster Hunters / Adventurers')).toBe('Monster Hunters');
    expect(powerSentenceName('Weavers/Textile workers')).toBe('Weavers');
    expect(powerSentenceName('Town Council')).toBe('Town Council');
    expect(powerPossessive('Religious Authorities')).toBe("Religious Authorities'");
    expect(powerPossessive('Merchant Guilds')).toBe("Merchant Guilds'");
    expect(powerPossessive('Monster Hunters / Adventurers')).toBe("Monster Hunters'");
    expect(powerPossessive('Military/Guard')).toBe("Military's");
    expect(powerPossessive('Elder Council')).toBe("Elder Council's");
    expect(powerPossessive("Headman's Authority")).toBe("Headman's Authority's");
    expect(powerPossessive('The Peerage')).toBe("The Peerage's");
    expect(powerPossessive('its rival')).toBe("its rival's");
  });
});

describe('on a real run, no power-move line prints a slashed label or a plural "\'s"', () => {
  // lf-001/-009/-010 carried a plural "'s" at the base, lf-004/-006 a slashed label.
  const SEEDS = ['lf-001', 'lf-004', 'lf-006', 'lf-009', 'lf-010'];
  it('every power-move headline and body, on every seed', async () => {
    const { analyze } = await import('../../scripts/generate-landing-fixture.mjs');
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const lines = analyze(seed).news.filter((e) => e?.kind === 'applied'
        && /^candidate\.faction\.faction_/.test(String(e.sourceEventId || '')));
      expect(lines.length, `${seed}: anti-vacuity`).toBeGreaterThan(0);
      const bad = [];
      for (const e of lines) {
        const did = Object.values(FACTION_VERB_PHRASES).map((v) => ` ${v.did}`).find((v) => String(e.headline).endsWith(v));
        const name = did ? String(e.headline).slice(0, -did.length) : String(e.headline);
        const text = `${e.headline} | ${e.summary}`;
        if (/\//.test(text) || /(?:ies|[bcdfghjklmnpqrtvwxyz]s)$/i.test(name) && text.includes(`${name}'s`)) bad.push(text);
      }
      expect(bad).toEqual([]);
    });
    expectNoSeedFailures(failures, 'power-move lines print names, and plural possessives');
  }, 300_000);
});
