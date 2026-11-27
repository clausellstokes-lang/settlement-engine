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

  it('PRONOUN (CLOSE-2 unit 3c): a later mention that is the subject of a clause with no opener takes the subject pronoun, by its follower', () => {
    // npcData.js :: STRESS_ECONOMIC_EFFECTS.wary_alliance.tension (the chair's found sentence, E117)
    expect(secondMentions('Haruto Chen has asked Akemi Yang to back a candidate Akemi Yang distrusts. Refusing would cost the alliance its majority.', [M('Haruto Chen'), F('Akemi Yang')]))
      .toBe('Haruto Chen has asked Akemi Yang to back a candidate she distrusts. Refusing would cost the alliance its majority.');
    // goalFamilies.js :: GOAL_FAMILY_LINES.ALLEGIANCE.keep_leverage.short (a want, goals.js :: cellCandidates)
    expect(secondMentions('Keep what is held over Ivo Berger safe, and somewhere Ivo Berger cannot find it.', [M('Ivo Berger')]))
      .toBe('Keep what is held over Ivo Berger safe, and somewhere he cannot find it.');
    expect(secondMentions('Paul Schulz has put money into Thecla Schulz\'s affairs for years and takes a share of everything Thecla Schulz earns.', [M('Paul Schulz'), F('Thecla Schulz')]))
      .toBe('Paul Schulz has put money into Thecla Schulz\'s affairs for years and takes a share of everything she earns.');
  });

  it('PRONOUN-THEY (CLOSE-4, ruling (A)): a later mention before a they-form bound to its own person skips the pronoun and takes the next rung; one bound to another keeps the pronoun', () => {
    const roles = [F('Rhona Ashby', 'the reeve'), M('Silas Brent', 'the factor')];
    // npcData.js :: STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension[12] and .desc[8] (the measure's two bound mentions): the role
    expect(secondMentions('Rhona Ashby has asked Silas Brent for an introduction Silas Brent would rather keep to themselves.', roles))
      .toBe('Rhona Ashby has asked Silas Brent for an introduction the factor would rather keep to themselves.');
    expect(secondMentions('Rhona Ashby cannot finish what they have started without Silas Brent\'s help, and Silas Brent cannot finish theirs without Rhona Ashby\'s. Neither lets the other forget it.', roles))
      .toBe('Rhona Ashby cannot finish what they have started without Silas Brent\'s help, and the factor cannot finish theirs without her. Neither lets the other forget it.');
    // the role shared, the surname distinct: the surname
    const shared = [F('Rhona Ashby'), M('Silas Brent')];
    expect(secondMentions('Rhona Ashby has asked Silas Brent for an introduction Silas Brent would rather keep to themselves.', shared))
      .toBe('Rhona Ashby has asked Silas Brent for an introduction Brent would rather keep to themselves.');
    // .genuine_respect.desc[3] (THEY_OTHER: "them" is the cases): the pronoun stands
    expect(secondMentions('Rhona Ashby sends difficult cases to Silas Brent, and Silas Brent sends them back solved.', roles))
      .toBe('Rhona Ashby sends difficult cases to Silas Brent, and he sends them back solved.');
  });

  it('PRONOUN: an object context stays the object, the verb after it belonging to another subject', () => {
    expect(secondMentions('Thecla Schulz owes everything to Paul Schulz, and nobody who knows Thecla Schulz would believe it.', [F('Thecla Schulz'), M('Paul Schulz')]))
      .toBe('Thecla Schulz owes everything to Paul Schulz, and nobody who knows her would believe it.');
    expect(secondMentions('Paul Schulz has been offered Thecla Schulz\'s post by people who want Thecla Schulz gone.', [M('Paul Schulz'), F('Thecla Schulz')]))
      .toBe('Paul Schulz has been offered Thecla Schulz\'s post by people who want her gone.');
    expect(secondMentions('The family expects Paul Schulz to keep the peace, and Thecla Schulz expects Paul Schulz to break it.', [M('Paul Schulz'), F('Thecla Schulz')]))
      .toBe('The family expects Paul Schulz to keep the peace, and Thecla Schulz expects him to break it.');
  });

  it('the role where the gender is shared (the chair\'s order); the surname where the role is too; the given name last', () => {
    expect(secondMentions('Sigvald Ljotsson wants Eilif Dagsson\'s position, and Eilif Dagsson wants Sigvald Ljotsson\'s reputation.', [M('Sigvald Ljotsson', 'the reeve'), M('Eilif Dagsson', 'the priest')]))
      .toBe('Sigvald Ljotsson wants Eilif Dagsson\'s position, and the priest wants the reeve\'s reputation.');
    expect(secondMentions('Sigvald Ljotsson wants Eilif Dagsson\'s position, and Eilif Dagsson wants Sigvald Ljotsson\'s reputation.', [M('Sigvald Ljotsson'), M('Eilif Dagsson')]))
      .toBe('Sigvald Ljotsson wants Eilif Dagsson\'s position, and Dagsson wants Ljotsson\'s reputation.');
    expect(secondMentions('Ana Ruiz needs Bea Ruiz\'s seal, and Bea Ruiz needs Ana Ruiz\'s silence.', [F('Ana Ruiz'), F('Bea Ruiz')]))
      .toBe('Ana Ruiz needs Bea Ruiz\'s seal, and Bea needs Ana\'s silence.');
  });

  it('R13 (RULING-R, the eleventh chair, 2026-11-27): a bare title with no article is no description; the later mention takes the next rung', () => {
    // the measure's worked example (C dp-thorp-87): npcData.js's "has a hold on ... too" line, two men, one card titled bare
    const held = [M('Eirik Ragnarsson', 'Elder'), M('Brynjar Eriksson', 'the occupying governor')];
    expect(secondMentions('Someone else has learned what favour Eirik Ragnarsson owes Brynjar Eriksson, and now has a hold on Eirik Ragnarsson too.', held))
      .toBe('Someone else has learned what favour Eirik Ragnarsson owes Brynjar Eriksson, and now has a hold on Ragnarsson too.');
    // the role with its article still stands for its card
    expect(secondMentions('Eirik Ragnarsson wants Brynjar Eriksson\'s position, and Brynjar Eriksson wants Eirik Ragnarsson\'s reputation.', held))
      .toBe('Eirik Ragnarsson wants Brynjar Eriksson\'s position, and the occupying governor wants Ragnarsson\'s reputation.');
    // a bound they-form skips the pronoun; a bare title there takes the surname, then the given name where the surname is shared
    expect(secondMentions('Rhona Ashby has asked Silas Brent for an introduction Silas Brent would rather keep to themselves.', [F('Rhona Ashby'), M('Silas Brent', 'Mayor')]))
      .toBe('Rhona Ashby has asked Silas Brent for an introduction Brent would rather keep to themselves.');
    expect(secondMentions('Ana Ruiz needs Bea Ruiz\'s seal, and Bea Ruiz needs Ana Ruiz\'s silence.', [F('Ana Ruiz', 'Alderman'), F('Bea Ruiz', 'Lord Mayor')]))
      .toBe('Ana Ruiz needs Bea Ruiz\'s seal, and Bea needs Ana\'s silence.');
    // a name qualified by its bracket (npcDisplayNames.js) gives its surname from the bare name, never "master)" (V dp-city-78)
    const koh = 'Chac Chel Koh (the senior guild master)';
    expect(secondMentions(`${koh} once spoke up for Ahulane Ek when it cost ${koh} something to do it.`, [M(koh, 'Master of the Guilds'), M('Ahulane Ek', 'the wizard')]))
      .toBe(`${koh} once spoke up for Ahulane Ek when it cost Koh something to do it.`);
  });

  it('R13: a name that is itself a role word is never changed (a place, a person, a power)', () => {
    const cards = [M('John Miller', 'Elder'), M('Erik Holt', 'Reeve')];
    expect(secondMentions('John Miller owes Erik Holt a favour from the Elder Creek flood, and Erik Holt has not let John Miller forget it.', cards))
      .toBe('John Miller owes Erik Holt a favour from the Elder Creek flood, and Holt has not let Miller forget it.');
    expect(secondMentions('Erik Holt sits on the Elder Council beside John Miller, and the Elder Council hears John Miller first.', cards))
      .toBe('Erik Holt sits on the Elder Council beside John Miller, and the Elder Council hears Miller first.');
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
