/**
 * personMention.test.js — a person's second mention in one sentence (NAMES-1, the seventh chair's ruling CN2 of
 * 2026-11-20): src/data/people/personMention.js :: secondMentions, on the census's own sentences (85fccf898).
 */
import { describe, expect, it } from 'vitest';
import { secondMentions } from '../../src/data/people/personMention.js';

const F = (/** @type {string} */ name, role = 'the clerk') => ({ name, gender: 'female', role });
const M = (/** @type {string} */ name, role = 'the clerk') => ({ name, gender: 'male', role });

describe('secondMentions: the first mention keeps the full name; a later one in the same sentence changes', () => {
  it('a pronoun from the person\'s own gender, where no one else named shares it: subject, object and possessive by place', () => {
    expect(secondMentions('Thecla Schulz knows enough to ruin Paul Schulz, and Paul Schulz holds enough to finish Thecla Schulz, so the two of them work together very carefully.', [F('Thecla Schulz'), M('Paul Schulz')]))
      .toBe('Thecla Schulz knows enough to ruin Paul Schulz, and he holds enough to finish her, so the two of them work together very carefully.');
    expect(secondMentions('Cuauhtli Ahau has asked Cosij Chan for a second favour before repaying the first, which would put Cuauhtli Ahau two favours ahead.', [M('Cuauhtli Ahau'), F('Cosij Chan')]))
      .toBe('Cuauhtli Ahau has asked Cosij Chan for a second favour before repaying the first, which would put him two favours ahead.');
    expect(secondMentions('Drusilla Cato has begun teaching Laevinus Scipio\'s methods as Drusilla Cato\'s own.', [F('Drusilla Cato'), M('Laevinus Scipio')]))
      .toBe('Drusilla Cato has begun teaching Laevinus Scipio\'s methods as her own.');
    expect(secondMentions('Take Hans Klein\'s place in the Thieves\' Guild, and keep it longer than Hans Klein did.', [M('Hans Klein')]))
      .toBe('Take Hans Klein\'s place in the Thieves\' Guild, and keep it longer than he did.');
    expect(secondMentions('Isidora Serranus has taken a precaution against Salinator Silanus that Salinator Silanus was not meant to discover.', [F('Isidora Serranus'), M('Salinator Silanus')]))
      .toBe('Isidora Serranus has taken a precaution against Salinator Silanus that he was not meant to discover.');
  });

  it('the role where the gender is shared (the chair\'s order); the surname where the role is too; the given name last', () => {
    expect(secondMentions('Sigvald Ljotsson wants Eilif Dagsson\'s position, and Eilif Dagsson wants Sigvald Ljotsson\'s reputation.', [M('Sigvald Ljotsson', 'the reeve'), M('Eilif Dagsson', 'the priest')]))
      .toBe('Sigvald Ljotsson wants Eilif Dagsson\'s position, and the priest wants the reeve\'s reputation.');
    expect(secondMentions('Sigvald Ljotsson wants Eilif Dagsson\'s position, and Eilif Dagsson wants Sigvald Ljotsson\'s reputation.', [M('Sigvald Ljotsson'), M('Eilif Dagsson')]))
      .toBe('Sigvald Ljotsson wants Eilif Dagsson\'s position, and Dagsson wants Ljotsson\'s reputation.');
    expect(secondMentions('Ana Ruiz needs Bea Ruiz\'s seal, and Bea Ruiz needs Ana Ruiz\'s silence.', [F('Ana Ruiz'), F('Bea Ruiz')]))
      .toBe('Ana Ruiz needs Bea Ruiz\'s seal, and Bea needs Ana\'s silence.');
  });

  it('a card with no gender (an older stored town\'s) takes the surname', () => {
    expect(secondMentions('Mord Bjarnarson pays, and Dag Magnusson takes Mord Bjarnarson\'s orders.', [{ name: 'Mord Bjarnarson' }, { name: 'Dag Magnusson' }]))
      .toBe('Mord Bjarnarson pays, and Dag Magnusson takes Bjarnarson\'s orders.');
  });

  it('works sentence by sentence: a name once in each of two sentences stays', () => {
    const text = 'Suhad al-Yamani has asked Noor ibn Battuta for a favour. It is the first payment Suhad al-Yamani has asked for.';
    expect(secondMentions(text, [F('Suhad al-Yamani'), M('Noor ibn Battuta')])).toBe(text);
  });

  it('leaves the sentence where two cards share one printed name, or nothing shorter tells them apart', () => {
    expect(secondMentions('Sujin Sasaki owes Sujin Sasaki a debt.', [F('Sujin Sasaki'), F('Sujin Sasaki')])).toBe('Sujin Sasaki owes Sujin Sasaki a debt.');
    expect(secondMentions('Ana Ruiz needs Ana Rubio, and Ana Rubio needs Ana Ruiz.', [F('Ana Ruiz'), F('Ana Rubio')]))
      .toBe('Ana Ruiz needs Ana Rubio, and Rubio needs Ruiz.');
  });

  it('⛔ CN3 (ii): every person the text speaks of is still named in full in it', () => {
    const cards = [F('Thecla Schulz'), M('Paul Schulz')];
    const out = secondMentions('Thecla Schulz knows enough to ruin Paul Schulz, and Paul Schulz holds enough to finish Thecla Schulz.', cards);
    for (const c of cards) expect(out).toContain(c.name);
  });

  it('is total: no text, no cards, a card with no name', () => {
    expect(secondMentions('', [F('Ana Ruiz')])).toBe('');
    expect(secondMentions('Ana Ruiz waits for Ana Ruiz.', [])).toBe('Ana Ruiz waits for Ana Ruiz.');
    expect(secondMentions('Ana Ruiz waits.', [null, undefined, {}])).toBe('Ana Ruiz waits.');
  });
});
