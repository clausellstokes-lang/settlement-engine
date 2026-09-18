/**
 * weaveBlock.test.js — the block weave, and the three things it must never do.
 *
 * THE DEFECT (owner finding, 2026-09-18). A dossier position that draws several lenses
 * rendered one `<p>` per sentence with no joiner, and a quarter of the corpus's variants
 * OPEN on `{settlement}` — so a three-lens position introduced the town three times in three
 * paragraphs. `weaveBlock` arranges them as one paragraph and stands the REPEATED opening
 * name down to the tier noun.
 *
 * WHAT THE ARMS BELOW ARE ACTUALLY FOR. The weave is a substitution over reader-facing prose,
 * so every arm here is a place it could quietly corrupt a sentence instead of improving it:
 * the FIRST sentence losing its subject, a name mid-sentence being renamed where the corpus
 * meant it, a longer word that merely starts with the name being decapitated, a possessive
 * being dropped or re-spelled, and a one-line position rendering differently than it did
 * before this landed. The owner's own Vallepagus triple is pinned verbatim at the end,
 * because that is the reading this exists to repair.
 */
import { describe, it, expect } from 'vitest';

import { TIER_ORDER } from '../../../../src/data/constants.js';
import { tierNounFor, weaveBlock } from '../../../../src/domain/display/stateProse/weaveBlock.js';

/** The village's noun, resolved the way every call site resolves it. */
const VILLAGE = tierNounFor('village');

describe('tierNounFor — the vocabulary is the engine\'s own tier list', () => {
  it('answers every canonical tier with its own token', () => {
    expect(TIER_ORDER.map((tier) => tierNounFor(tier)))
      .toEqual(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
  });

  it('answers NOTHING for a tier this build does not know — it never guesses a word', () => {
    for (const unknown of ['Village', 'borough', 'hamlets', '', null, undefined, 3, {}]) {
      expect(tierNounFor(unknown), `tierNounFor(${JSON.stringify(unknown)})`).toBeNull();
    }
  });
});

describe('weaveBlock — the join', () => {
  it('joins the sentences with ONE space into one paragraph', () => {
    const woven = weaveBlock(
      ['Adham holds the ford.', 'The road pays for it.', 'The tolls are counted twice.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    expect(woven.paragraph).toBe('Adham holds the ford. The road pays for it. The tolls are counted twice.');
    expect(woven.sentences).toHaveLength(3);
  });

  it('drops blank and absent lines BEFORE weaving, so a silent lens costs nothing', () => {
    const woven = weaveBlock(
      [null, 'Adham holds the ford.', '', undefined, '   ', 'Adham pays for the road.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    // The SURVIVING first line is the one that keeps its name — not the index the desk gave it.
    expect(woven.paragraph).toBe('Adham holds the ford. The town pays for the road.');
  });

  it('a single line is returned UNCHANGED — a one-lens position renders exactly as before', () => {
    const only = 'Adham pays for its own defense in wages.';
    expect(weaveBlock([only], { settlementName: 'Adham', tierNoun: tierNounFor('town') }))
      .toEqual({ paragraph: only, sentences: [only] });
    // …including when the desk handed over nulls around it.
    expect(weaveBlock([null, only, ''], { settlementName: 'Adham', tierNoun: tierNounFor('town') }).paragraph)
      .toBe(only);
  });

  it('empty input weaves to an empty paragraph and no sentences', () => {
    for (const empty of [[], [null, '', '  '], null, undefined]) {
      const woven = weaveBlock(empty, { settlementName: 'Adham', tierNoun: tierNounFor('town') });
      expect(woven.paragraph, `weaveBlock(${JSON.stringify(empty)})`).toBe('');
      expect(woven.sentences).toEqual([]);
    }
  });

  it('is DETERMINISTIC — the same lines and town weave byte-identically, every call', () => {
    const lines = ['Kilcross keeps the road.', 'Kilcross\'s market lives off it.', 'Kilcross pays.'];
    const once = weaveBlock(lines, { settlementName: 'Kilcross', tierNoun: VILLAGE }).paragraph;
    for (let i = 0; i < 5; i += 1) {
      expect(weaveBlock(lines, { settlementName: 'Kilcross', tierNoun: VILLAGE }).paragraph).toBe(once);
    }
  });
});

describe('weaveBlock — the stand-down, and the three places it must not reach', () => {
  it('stands the OPENING name down to the tier noun from the second sentence on', () => {
    const woven = weaveBlock(
      ['Fionnshaw sits in easy country.', 'Fionnshaw keeps no market worth the name.', 'Fionnshaw pays for its defense.'],
      { settlementName: 'Fionnshaw', tierNoun: VILLAGE },
    );
    expect(woven.sentences).toEqual([
      'Fionnshaw sits in easy country.',
      'The village keeps no market worth the name.',
      'The village pays for its defense.',
    ]);
  });

  it('NEVER touches sentence 0 — the paragraph must still say who it is about', () => {
    const woven = weaveBlock(
      ['Fionnshaw sits in easy country.', 'Fionnshaw keeps no market.'],
      { settlementName: 'Fionnshaw', tierNoun: VILLAGE },
    );
    expect(woven.sentences[0]).toBe('Fionnshaw sits in easy country.');
  });

  it('NEVER touches a name that is not at index 0, at any index', () => {
    const woven = weaveBlock(
      [
        'The fields begin where Tighglen loses interest.',
        'Market day is Tighglen at its truest: the roads bring the custom.',
        'A stranger finds Tighglen\'s market without directions.',
      ],
      { settlementName: 'Tighglen', tierNoun: VILLAGE },
    );
    expect(woven.sentences).toEqual([
      'The fields begin where Tighglen loses interest.',
      'Market day is Tighglen at its truest: the roads bring the custom.',
      'A stranger finds Tighglen\'s market without directions.',
    ]);
  });

  it('NEVER decapitates a longer word that merely starts with the name', () => {
    const woven = weaveBlock(
      ['Ford holds the crossing.', 'Fordwich answers to it.', 'Fordé answers too.', 'Ford3 is a mint, not a town.'],
      { settlementName: 'Ford', tierNoun: tierNounFor('thorp') },
    );
    // `Fordé` is the ASCII-\w trap: a diacritic is a letter, so it is a longer word.
    expect(woven.sentences.slice(1)).toEqual(['Fordwich answers to it.', 'Fordé answers too.', 'Ford3 is a mint, not a town.']);
  });

  it('carries a POSSESSIVE across, in the apostrophe the corpus actually wrote', () => {
    const straight = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross\'s market lives off through-traffic.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(straight.sentences[1]).toBe('The village\'s market lives off through-traffic.');
    const typographic = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross’s market lives off through-traffic.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(typographic.sentences[1]).toBe('The village’s market lives off through-traffic.');
  });

  it('handles the estate\'s real name shapes — diacritics, apostrophes, spaces', () => {
    const diacritic = weaveBlock(
      ['Edznaxóchitl keeps the terraces.', 'Edznaxóchitl\'s market lives off the road.'],
      { settlementName: 'Edznaxóchitl', tierNoun: tierNounFor('city') },
    );
    expect(diacritic.sentences[1]).toBe('The city\'s market lives off the road.');
    const apostrophed = weaveBlock(
      ['Qutlugh Olqunu\'ud keeps the wells.', 'Qutlugh Olqunu\'ud pays for its own defense.'],
      { settlementName: 'Qutlugh Olqunu\'ud', tierNoun: tierNounFor('town') },
    );
    expect(apostrophed.sentences[1]).toBe('The town pays for its own defense.');
    // …and the apostrophe in the NAME is not read as the start of a possessive.
    const possessed = weaveBlock(
      ['Qutlugh Olqunu\'ud keeps the wells.', 'Qutlugh Olqunu\'ud\'s market is a yard.'],
      { settlementName: 'Qutlugh Olqunu\'ud', tierNoun: tierNounFor('town') },
    );
    expect(possessed.sentences[1]).toBe('The town\'s market is a yard.');
  });

  it('a name carrying REGEX SYNTAX is matched literally, never compiled', () => {
    const woven = weaveBlock(
      ['A.D. (Old) keeps the ford.', 'A.D. (Old) pays for the road.', 'AxDy (Old) is a different place.'],
      { settlementName: 'A.D. (Old)', tierNoun: tierNounFor('hamlet') },
    );
    expect(woven.sentences[1]).toBe('The hamlet pays for the road.');
    expect(woven.sentences[2]).toBe('AxDy (Old) is a different place.');
  });

  it('THE PRONOUN BRANCH: a line that already names its own tier noun takes "It", never "The <noun>"', () => {
    // ⭐ THE WORST READING MEASURED before the chair's ruling (2026-09-18) — the weave printed
    // "The town is a town, in the ordinary sense", which is a sentence telling a reader that a
    // town is a town. The pronoun is what that case is worth.
    const worst = weaveBlock(
      ['Adham holds the ford.', 'Adham is a town, in the ordinary sense, and the ordinariness is accurate.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    expect(worst.sentences[1]).toBe('It is a town, in the ordinary sense, and the ordinariness is accurate.');
    // A POSSESSIVE takes "Its", with no apostrophe — the possessive of a pronoun, not of a noun.
    const possessive = weaveBlock(
      ['Nothing hems Adham in.', 'Adham\'s record still marks each hard season as bearing on the town.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    expect(possessive.sentences[1]).toBe('Its record still marks each hard season as bearing on the town.');
    // CASE-INSENSITIVE: the noun counts wherever the line capitalises it.
    const capitalised = weaveBlock(
      ['Nothing hems Adham in.', 'Adham keeps a court. Town business is settled in it.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    expect(capitalised.sentences[1]).toBe('It keeps a court. Town business is settled in it.');
  });

  it('…and the branch is WHOLE-WORD: a longer word carrying the noun is not the noun', () => {
    // "townsfolk" and "towns" are different words, so these keep "The town" rather than taking
    // the pronoun. The split-on-non-letters identity is what makes that true by construction.
    const plural = weaveBlock(
      ['Adham holds the ford.', 'Adham supports work that only towns of a certain seriousness support.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    expect(plural.sentences[1]).toBe('The town supports work that only towns of a certain seriousness support.');
    const folk = weaveBlock(
      ['Adham holds the ford.', 'Adham keeps its townsfolk fed through a hard season.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    expect(folk.sentences[1]).toBe('The town keeps its townsfolk fed through a hard season.');
    // …and a line naming a DIFFERENT tier's noun is not naming its own.
    const other = weaveBlock(
      ['Adham holds the ford.', 'Adham buys its grain from a village three days out.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    expect(other.sentences[1]).toBe('The town buys its grain from a village three days out.');
  });

  it('SENTENCE 0 is untouched by the pronoun branch too', () => {
    const woven = weaveBlock(
      ['Adham is a town, in the ordinary sense.', 'Adham is a town, in the ordinary sense.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    expect(woven.sentences[0]).toBe('Adham is a town, in the ordinary sense.');
    expect(woven.sentences[1]).toBe('It is a town, in the ordinary sense.');
  });

  it('JOINS ALONE when there is no name or no known tier — it renames nothing on a guess', () => {
    const lines = ['Fionnshaw sits in easy country.', 'Fionnshaw keeps no market.'];
    const joined = 'Fionnshaw sits in easy country. Fionnshaw keeps no market.';
    expect(weaveBlock(lines, { settlementName: 'Fionnshaw', tierNoun: tierNounFor('borough') }).paragraph).toBe(joined);
    expect(weaveBlock(lines, { settlementName: '', tierNoun: VILLAGE }).paragraph).toBe(joined);
    expect(weaveBlock(lines, {}).paragraph).toBe(joined);
    expect(weaveBlock(lines).paragraph).toBe(joined);
  });
});

describe('THE OWNER\'S VALLEPAGUS TRIPLE (2026-09-18) — the reading this exists to repair', () => {
  const TRIPLE = Object.freeze([
    'In Vallepagus the way to anywhere important runs along the water or down to it.',
    'Market day is Vallepagus at its truest: the roads bring the custom, and the custom is the argument for the stalls.',
    'Vallepagus pays for its own defense in wages, not only in stone, and the paying is a standing decision renewed every season.',
  ]);

  it('weaves to ONE paragraph: sentence 2 untouched (the name is not at index 0), sentence 3 stood down', () => {
    const woven = weaveBlock(TRIPLE, { settlementName: 'Vallepagus', tierNoun: VILLAGE });
    expect(woven.sentences).toEqual([
      'In Vallepagus the way to anywhere important runs along the water or down to it.',
      'Market day is Vallepagus at its truest: the roads bring the custom, and the custom is the argument for the stalls.',
      'The village pays for its own defense in wages, not only in stone, and the paying is a standing decision renewed every season.',
    ]);
    expect(woven.paragraph).toBe(woven.sentences.join(' '));
  });

  it('changes NO other character — the woven text is the source text with two edits and two spaces', () => {
    const woven = weaveBlock(TRIPLE, { settlementName: 'Vallepagus', tierNoun: VILLAGE });
    // Everything after each sentence's opening survives verbatim.
    for (const [i, source] of TRIPLE.entries()) {
      const tail = source.slice(source.indexOf(' '));
      expect(woven.sentences[i].endsWith(tail), `sentence ${i + 1} lost its body`).toBe(true);
    }
  });
});
