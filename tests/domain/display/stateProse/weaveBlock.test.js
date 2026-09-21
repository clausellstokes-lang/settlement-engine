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

  it('a BARE apostrophe takes NEITHER the possessive nor the pronoun — it degrades visibly', () => {
    // ⛔ THE SECOND REVIEW'S RULING (2026-09-18). A bare possessive on a name ending in s
    // cannot be told from a TYPO without parsing the sentence:
    //
    //   "Kilcross' market lives off through-traffic."   is a possessive
    //   "Kilcross' is a town in name only."             is an apostrophe that should not be there
    //
    // and reading the second as a possessive would print "Its is a town in name only" — a
    // wreck, and a SILENT one, since nothing downstream can tell a pronoun replaced a subject.
    // So a bare apostrophe takes the plain form and STAYS WHERE THE LINE PUT IT. The line
    // degrades to a fault a reader can see; the corpus is forbidden to carry one at all
    // (tests/data/dossierStateProseProjection.contract.test.js), which is where it is closed.
    const typo = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross\' is a town in name only.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(typo.sentences[1]).toBe('The village\' is a town in name only.');
    // …and not the pronoun, which is the substitution this arm exists to refuse.
    expect(typo.sentences[1]).not.toBe('Its is a town in name only.'); // anchored: the toBe above pins what it IS, so this cannot pass on an empty or absent line
    const bare = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross\' market lives off through-traffic.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(bare.sentences[1]).toBe('The village\' market lives off through-traffic.');
    const bareTypographic = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross\u2019 market lives off through-traffic.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(bareTypographic.sentences[1]).toBe('The village\u2019 market lives off through-traffic.');
    // A line that NAMES A TIER still takes the plain form when the apostrophe is bare — the
    // bare test runs FIRST, so the pronoun branch cannot reach it.
    // ⭐ THE TAIL MOVED WITH §934.22 item 3, AND SAYING SO IS THE POINT OF THIS NOTE. The
    // fixture line ends "…as bearing on the town", and `tierVoice` now speaks that generic
    // noun in the settlement's own — which is the whole cure, arriving in a fixture that was
    // written before it existed. What this arm asserts is UNCHANGED: a bare apostrophe takes
    // the plain `The <noun>` form and never the pronoun.
    const namesTier = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross\' record still marks each hard season as bearing on the town.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(namesTier.sentences[1]).toBe('The village\' record still marks each hard season as bearing on the village.');
    const atEnd = weaveBlock(['Nothing hems Kilcross in.', 'Kilcross\''], { settlementName: 'Kilcross', tierNoun: VILLAGE });
    expect(atEnd.sentences[1]).toBe('The village\'');
  });

  it('…and the APOSTROPHE-S path is untouched by any of that, pronoun branch included', () => {
    // Every line shipping today is this shape: the corpus carries 165 `{settlement}`-plus-
    // apostrophe-s across its 2,734 state and causal variants and ZERO bare ones.
    const sForm = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross\'s market lives off through-traffic.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(sForm.sentences[1]).toBe('The village\'s market lives off through-traffic.');
    const sFormTypographic = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross\u2019s market lives off through-traffic.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(sFormTypographic.sentences[1]).toBe('The village\u2019s market lives off through-traffic.');
    // …and it still reaches the pronoun branch, which the bare form does not.
    // The tail reads 'the village' since §934.22 item 3 (see the note in the arm above); the
    // branch under test — apostrophe-s reaching the pronoun — is unchanged.
    const pronoun = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross\'s record still marks each hard season as bearing on the town.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(pronoun.sentences[1]).toBe('Its record still marks each hard season as bearing on the village.');
  });

  it('an apostrophe MID-WORD is not a possessive, and the name is still stood down', () => {
    // ⚠ THIS IS THE ARM THE OLD COMMENT CONTRADICTED. It claimed this leaf "must not rename a
    // town on the strength of a contraction"; it does rename one, and always has. `'n` is not
    // a bare possessive (no space follows) and not `'s`, so the line takes the ORDINARY path:
    // the opening name is replaced and the mark is left exactly where it was.
    const contraction = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcross\'n the road are one argument.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(contraction.sentences[1]).toBe('The village\'n the road are one argument.');
    // A LONGER WORD starting with the name is a different matter and is still not the name.
    const longer = weaveBlock(
      ['Nothing hems Kilcross in.', 'Kilcrossshire\' market is elsewhere.'],
      { settlementName: 'Kilcross', tierNoun: VILLAGE },
    );
    expect(longer.sentences[1]).toBe('Kilcrossshire\' market is elsewhere.');
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

  it('THE PRONOUN BRANCH: a line that already names a settlement tier takes "It", never "The <noun>"', () => {
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
    // …and a word that merely CONTAINS a tier is not a tier: "cityward" is not "city".
    const contains = weaveBlock(
      ['Adham holds the ford.', 'Adham sends its wool cityward every spring.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('town') },
    );
    expect(contains.sentences[1]).toBe('The town sends its wool cityward every spring.');
  });

  it('ANY TIER counts, not only this settlement\'s — the village-is-a-town reading', () => {
    // ⭐ THE CHAIR'S SECOND RULING (2026-09-18). The first cut of the branch asked only about
    // the settlement's OWN noun, so a VILLAGE whose line said "town" — which is how the corpus
    // writes about a settlement of any size — still came back as "The village is a town, in
    // the ordinary sense". That is the same defect one tier over, and the pronoun is what it
    // is worth. Measured before the ruling: 69 of 218 stand-downs named another tier's noun.
    const village = weaveBlock(
      ['Weißmoor holds the ford.', 'Weißmoor is a town, in the ordinary sense, and the ordinariness is accurate.'],
      { settlementName: 'Weißmoor', tierNoun: tierNounFor('village') },
    );
    expect(village.sentences[1]).toBe('It is a town, in the ordinary sense, and the ordinariness is accurate.');
    // The CONTRASTIVE readings the ruling was weighed against read correctly with it too.
    const contrastive = weaveBlock(
      ['Adham holds the ford.', 'Adham keeps few institutions because it needs few; what a larger town does with buildings, this one does with acquaintance.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('thorp') },
    );
    expect(contrastive.sentences[1]).toBe('It keeps few institutions because it needs few; what a larger town does with buildings, this one does with acquaintance.');
    // …and a possessive across tiers still takes "Its" — on a tail that §934.22 item 3 now
    // speaks as 'the thorp'. ⭐ AND THE BRANCH IS STILL REACHED FOR THE RIGHT REASON: the
    // remainder names a tier either way, so what this arm proves (any tier counts, not only
    // this settlement's) is the same fact it proved before the noun moved.
    const possessive = weaveBlock(
      ['Nothing hems Adham in.', 'Adham\'s record still marks each hard season as bearing on the town.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('thorp') },
    );
    expect(possessive.sentences[1]).toBe('Its record still marks each hard season as bearing on the thorp.');
    // A line naming NO tier at all keeps "The <noun>", so the arm above is discriminating.
    const none = weaveBlock(
      ['Adham holds the ford.', 'Adham buys its grain from a steading three days out.'],
      { settlementName: 'Adham', tierNoun: tierNounFor('thorp') },
    );
    expect(none.sentences[1]).toBe('The thorp buys its grain from a steading three days out.');
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

/**
 * ── THE TIER NOUN IN THE CORPUS'S OWN SENTENCES (ODQ §934.22 item 3) ──────────────────
 *
 * THE DEFECT (the second browser pass, 2026-09-19). Kolstad is a VILLAGE of 633, and its
 * Defense tab read "The town's plan for an army is to not be interesting to one". The
 * sentence is the corpus's own (DS-DEF-2); the corpus writes 'the town' about a settlement of
 * any size, 1,101 whole-word `town` against 2 `village` across the whole pool document.
 *
 * WHAT THE ARMS BELOW ARE FOR. `tierVoice` is a substitution over reader-facing prose, so
 * every arm is a place it could corrupt a sentence rather than improve it: a COMPARISON to
 * somewhere else being re-pointed at this settlement, a compound noun ('the town watch')
 * losing its meaning, a plural or a longer word being caught by a loose boundary, and a TOWN
 * — where the corpus's word is already right — rendering anything but the identical string.
 */
describe('the settlement speaks in its own tier noun', () => {
  const KOLSTAD = "The town's plan for an army is to not be interesting to one, and everybody here can state the plan.";

  it('stands the corpus\'s generic noun down to the settlement\'s own, possessive and all', () => {
    expect(weaveBlock([KOLSTAD], { settlementName: 'Kolstad', tierNoun: VILLAGE }).paragraph)
      .toBe("The village's plan for an army is to not be interesting to one, and everybody here can state the plan.");
  });

  it('reaches sentence 0 and a lone line — a one-lens position is as entitled to its noun as a three-lens one', () => {
    // ⛔ THE NARROWED ONE-LINE CONTRACT, pinned. Before §934.22 a single line came back
    // character for character; it now comes back in the settlement's noun, and only a TOWN
    // comes back by identity (the arm below).
    const woven = weaveBlock([KOLSTAD, 'Kolstad keeps no market worth the name.'], {
      settlementName: 'Kolstad', tierNoun: VILLAGE,
    });
    expect(woven.sentences[0]).toContain("The village's plan");
  });

  it('a TOWN renders the identical string, which is what keeps every town in the estate unmoved', () => {
    // anchored: the SAME line on a village IS moved by the first arm above, so this is not a
    // substitution that has simply stopped working.
    const town = weaveBlock([KOLSTAD], { settlementName: 'Kolstad', tierNoun: tierNounFor('town') });
    expect(town.paragraph).toBe(KOLSTAD);
  });

  it('an unknown tier substitutes NOTHING rather than guessing a rung', () => {
    expect(weaveBlock([KOLSTAD], { settlementName: 'Kolstad', tierNoun: tierNounFor('village-ish') }).paragraph)
      .toBe(KOLSTAD);
  });

  it('⛔ a COMPARISON to somewhere else is left exactly as the corpus wrote it', () => {
    // 87 `a town` and 3 `every town` stand in the corpus, and every one of them is about
    // somewhere that is NOT this settlement. Re-pointing them would rewrite the comparison
    // into nonsense: "what a larger village does with buildings" on a village.
    const lines = [
      'It keeps few institutions because it needs few; what a larger town does with buildings, this one does with acquaintance.',
      'It is a town, in the ordinary sense, and the ordinariness is accurate.',
      'Every town on this road keeps the same market day.',
    ];
    const woven = weaveBlock(lines, { settlementName: 'Kolstad', tierNoun: VILLAGE });
    expect(woven.sentences).toEqual(lines);
  });

  it('⛔ an ADJECTIVE refuses the substitution; a COMPOUND does NOT, which is why the corpus was grepped', () => {
    // TWO DIFFERENT FACTS, PINNED TOGETHER because they are easy to confuse.
    //  (1) The determiner must sit IMMEDIATELY before the noun, so 'the whole town' (2
    //      occurrences in the corpus) is refused rather than guessed into 'the whole village'.
    //  (2) A COMPOUND is NOT refused: 'the town watch' becomes 'the village watch'. That is
    //      the one substitution this leaf makes that could change a meaning, which is exactly
    //      why 'the town' + watch/walls/gates/guard/council/hall/square/crier/militia/charter/
    //      market was grepped over the WHOLE pool document and found ZERO times. The capital
    //      spelling an institution name would carry ('the Town watch') cannot match at all.
    const lines = [
      'The town watch keeps the gates, and the whole town turns out for the fair.',
      'The Town watch is a proper name and never moves.',
    ];
    expect(weaveBlock(lines, { settlementName: 'Kolstad', tierNoun: VILLAGE }).sentences).toEqual([
      'The village watch keeps the gates, and the whole town turns out for the fair.',
      'The Town watch is a proper name and never moves.',
    ]);
  });

  it('⛔ a plural, a longer word and a name are never caught', () => {
    const line = 'Townsfolk from the townships and from Newtown come to the towns nearby.';
    expect(weaveBlock([line], { settlementName: 'Kolstad', tierNoun: VILLAGE }).paragraph).toBe(line);
  });

  it('two references in ONE line both move — the boundary is re-emitted, not consumed', () => {
    expect(weaveBlock(['The town has walls and this town knows what they cost.'], {
      settlementName: 'Kolstad', tierNoun: tierNounFor('hamlet'),
    }).paragraph).toBe('The hamlet has walls and this hamlet knows what they cost.');
  });

  it('the noun runs BEFORE the stand-down, so a stood-down line takes the pronoun rather than repeating itself', () => {
    // ⭐ THE ORDERING THE WEAVE DEPENDS ON. Line 2 opens on the name AND names the corpus's
    // generic noun in its remainder. With the noun spoken first, `namesAnyTierNoun` reads the
    // text the READER meets and routes the opening to "It" — never "The village keeps the
    // village's granary full".
    const woven = weaveBlock([
      'Kolstad sits in country that offers no argument against it.',
      "Kolstad keeps the town's granary full.",
    ], { settlementName: 'Kolstad', tierNoun: VILLAGE });
    expect(woven.sentences[1]).toBe("It keeps the village's granary full.");
  });

  it('every canonical tier speaks its own noun, and the vocabulary is the engine\'s', () => {
    const spoken = TIER_ORDER.map((tier) => weaveBlock(['The town has walls.'], {
      settlementName: 'Kolstad', tierNoun: tierNounFor(tier),
    }).paragraph);
    expect(spoken).toEqual([
      'The thorp has walls.',
      'The hamlet has walls.',
      'The village has walls.',
      'The town has walls.',
      'The city has walls.',
      'The metropolis has walls.',
    ]);
  });
});
