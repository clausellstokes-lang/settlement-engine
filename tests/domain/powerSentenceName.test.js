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
    // POWERS-16 (the chair's ruling (r2), re-keyed by identity): the catalogue label's prose form is a name a sentence holds,
    // "The Guard" (display/powerSentenceName.js :: PROSE_FORMS); a slashed label NOT in the table keeps the first-name rule
    expect(powerSentenceName('Military/Guard')).toBe('The Guard');
    expect(powerSentenceName('Monster Hunters / Adventurers')).toBe('Monster Hunters');
    expect(powerSentenceName('Weavers/Textile workers')).toBe('Weavers');
    expect(powerSentenceName('Town Council')).toBe('Town Council');
    expect(powerPossessive('Religious Authorities')).toBe("Religious Authorities'");
    expect(powerPossessive('Merchant Guilds')).toBe("Merchant Guilds'");
    expect(powerPossessive('Monster Hunters / Adventurers')).toBe("Monster Hunters'");
    expect(powerPossessive('Military/Guard')).toBe("The Guard's");
    expect(powerPossessive('Elder Council')).toBe("Elder Council's");
    expect(powerPossessive("Headman's Authority")).toBe("Headman's Authority's");
    expect(powerPossessive('The Peerage')).toBe("The Peerage's");
    expect(powerPossessive('its rival')).toBe("its rival's");
    // COHERENCE-POWERS-6 (item 8): a plural ending in a VOWEL + s is a plural too (the old rule missed it)
    expect(powerPossessive('Noble Houses')).toBe("Noble Houses'");
    expect(powerPossessive('craft guilds')).toBe("craft guilds'");
    expect(powerPossessive('Multiple market squares')).toBe("Multiple market squares'");
    expect(powerPossessive('Banking houses')).toBe("Banking houses'");
    expect(powerPossessive('Front businesses')).toBe("Front businesses'");
    // the singular -us / -ss / -is endings keep "'s"
    expect(powerPossessive('Head-of-household consensus')).toBe("Head-of-household consensus's");
    expect(powerPossessive('duchess')).toBe("duchess's");
    expect(powerPossessive('crisis')).toBe("crisis's");
  });
});

describe('on a real run, no power-move line prints a slashed label or a plural "\'s"', () => {
  // lf-001/-009/-010 carried a plural "'s" at the base, lf-004/-006 a slashed label; lf-003/-007/-014 carry a
  // plural-named SUPPRESSED INSTITUTION in a body ("market squares", "merchant guilds", "mills") — the item-8 target.
  const SEEDS = ['lf-001', 'lf-003', 'lf-004', 'lf-006', 'lf-007', 'lf-009', 'lf-010', 'lf-014'];
  it('every power-move headline and body, on every seed', async () => {
    const { analyze } = await import('../../scripts/generate-landing-fixture.mjs');
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const faction = analyze(seed).news.filter((e) => /^candidate\.faction\.faction_/.test(String(e.sourceEventId || '')));
      const lines = faction.filter((e) => e?.kind === 'applied');
      expect(lines.length, `${seed}: anti-vacuity`).toBeGreaterThan(0);
      const bad = [];
      for (const e of lines) {
        const did = Object.values(FACTION_VERB_PHRASES).map((v) => ` ${v.did}`).find((v) => String(e.headline).endsWith(v));
        const name = did ? String(e.headline).slice(0, -did.length) : String(e.headline);
        const text = `${e.headline} | ${e.summary}`;
        if (/\//.test(text) || /(?:ies|[bcdfghjklmnpqrtvwxyz]s)$/i.test(name) && text.includes(`${name}'s`)) bad.push(text);
      }
      // COHERENCE-POWERS-6 (item 8): the suppression line's possessive TARGET — "break the <target> standing" — read
      // through the leaf, not a literal "'s". The suppression "doing" line is a QUEUED proposal (not applied), so it is
      // scanned over every faction entry. A plural target given a literal "'s" prints "...s's standing" ("craft guilds's",
      // "market squares's"); a correctly-formed plural bares it ("...s' standing"). A singular town's "'s" is never a target.
      for (const e of faction) {
        const sup = String(e.summary || '').match(/break the (.+?) standing/);
        if (sup && /s's$/.test(sup[1])) bad.push(`${e.summary}  [plural target "${sup[1]}"]`);
      }
      expect(bad).toEqual([]);
    });
    expectNoSeedFailures(failures, 'power-move lines print names, and plural possessives');
  }, 300_000);
});
