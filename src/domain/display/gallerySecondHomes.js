/**
 * domain/display/gallerySecondHomes.js — THE SECOND HOMES OF A HIDDEN FACT (COHERENCE-VEIL-6; the fifth
 * review's V5-1, REVIEW-VEIL-211-333b33973-2026-11-13.md §2; the owner's law, record 331: what a user hides
 * by hand is never sent, by any of the four reads, in either stored shape).
 *
 * The veil (galleryVeil.js :: applyVeil) hides a fact at its one address. The stored town keeps some facts a
 * second time, at a path no card list walks. Each such home goes WITH THE EYE THAT GOVERNS ITS SOURCE, and
 * nothing else goes: a copy loses the hidden key; a composed sentence is withheld WHOLE (never a sentence with
 * a hole in it, no new prose); a list loses the hidden name and nothing else.
 *
 * BY IDENTITY, NEVER BY MATCHING TEXT (COHERENCE-VEIL-10; REVIEW-VEIL-7's V7-2; the chair's record 418). The
 * earlier rules asked whether a home's words still held the hidden sentence, so a source amended after the birth
 * left its born wording in the home. A composed home now follows the eye of the source ITS COMPOSER BUILT IT
 * FROM, found by what the record says of it, whatever either says today:
 *   history.legacyAnnotations[].annotation              its entry's EVENT (the entry carries the event's name, type
 *                                                       and years): that event's lasting-effects eye
 *   history.siegeNarrative                              ANY current tension whose description eye is shut (the
 *                                                       composer tells of the first; the record keeps no mark of it)
 *   prominentRelationship.full / .tension / .phrasing   its TIE (the same two ends and type, or a copy still equal
 *                                                       to its text): the description eye, the tension eye, and for
 *                                                       the phrasing either, unless it IS the open tension
 *   pressureSentence                                    the tie WHOSE TWO ENDS IT NAMES, as the phrasing; and any
 *                                                       tie where nothing accounts for it otherwise (no stress on
 *                                                       the town, not the power structure's recentConflict)
 *   <a person>.presentation.impression                  ITS PERSON: the appearance eye
 * A copy whose source the record does not name (an entry with no such event, a prominentRelationship with no such
 * tie) follows EVERY event's, EVERY tie's eye: closed. WHERE ONLY THE WORDS TIE A COPY TO ITS SOURCE they are
 * matched IN BOTH DIRECTIONS (a piece of the source inside the copy, or a piece of the copy inside the source), on
 * the CURRENT wording and on the STORED one (prominentRelationship keeps its tie's text as born): PART 11 section 9
 * lists those rows. The other homes, from the review's §2:
 *   defenseProfile.institutions.<slot>[]                a house's copy, by name: its description and function;
 *                                                       the whole entry for a house hidden whole
 *   economicState.activeChains[]                        a house hidden whole: each processing name it answers
 *                                                       to and no open house does (its own, or the engine's
 *                                                       processor match: 'Black market' for 'Black market
 *                                                       bazaar') leaves the list, and the dependency on it goes;
 *                                                       a chain that is that house's own (its label is the name,
 *                                                       or no processing house is left) is withheld whole: its
 *                                                       id prints as the name
 *   simulationTrace[]                                   a house hidden whole: each cause or effect that holds
 *                                                       one of those names; an entry that holds one elsewhere,
 *                                                       whole
 *
 * SQL TWIN, rule for rule: migration 212 :: _gallery_veil_pieces, _gallery_veil_embeds, _gallery_veil_sources,
 * _gallery_veil_tie_pieces, _gallery_veil_second_homes, the impression arm of _gallery_veil_card, and THE NAME SEARCH
 * (section 4c: _gallery_veil_name_search and its helpers; below, buildNameSearch and sweepHiddenNames). PINNED BY EXECUTION: tests/security/gallerySecondHomes.pglite.test.js (planted markers,
 * every eye shut, the whole payload of the four reads searched as text, both stored shapes), and the twin's
 * parity by tests/security/galleryServerVeil.pglite.test.js and galleryVeilCures.pglite.test.js.
 *
 * A HOUSE BY EVERY NAME (COHERENCE-VEIL-9; the chair's ruling on PART 9's limits): a house's name in any spelling
 * includes the name it was BORN with. The rename's writer (institutionRename.js) moves `name` only; a stamped house
 * keeps its catalogue identity, `catalogId`, which is the fold of its birth name (institutionalCatalog.js ::
 * catalogIdForName; 519 of 519 catalogue names). So the two derived name lists are sent BY POSITIVE ACCOUNT (an entry
 * stays only where a native house still listed accounts for it, each house for one entry: a stamped house by its
 * catalogue identity, an unstamped one by its name), the five booleans read from the entries that stay, and every
 * birth name of a house removed whole is searched with its current name.
 *
 * A HIDDEN NAME, ANYWHERE, IN ANY SCRIPT (COHERENCE-VEIL-10; REVIEW-VEIL-7's V7-1, V7-4, V7-7, V7-9, V7-10): the name
 * search is rebuilt (THE NAME SEARCH, below): every script's letters kept, case in the needle from one table both engines
 * carry, one search for all hidden names, keys as well as values, the floors, a walk with no call a level and a bound.
 *
 * Pure; works in place on applyVeil's own clone only.
 */

import { isMaterializedCustomContent } from '../content/customContentSemanticAuthority.js';

/** @typedef {Record<string, unknown>} Rec */
/** @typedef {{ card: Rec, desc: boolean, tension: boolean }} TieSource */
/** @typedef {{ name: string, type: string, yearsAgo: unknown, shut: boolean }} EventSource an event and its lasting-effects eye */

/** @param {unknown} v @returns {v is Rec} */
function isRec(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** @param {unknown} v @returns {string} */
function str(v) {
  return typeof v === 'string' ? v : '';
}

/** @param {Rec} s @param {string} key @returns {Rec|null} */
function recAt(s, key) {
  const v = s[key];
  return isRec(v) ? v : null;
}

/**
 * Two lengths, one frozen record (not tuning: a twin's exact copy of the SQL's `char_length(t) >= 12` and
 * `left(lower(v), 12)`). `pieceMin`: a piece shorter than this is never searched for (a word or a name is no
 * sentence). `processorPrefix`: the engine's processor match reads this many characters of a pattern
 * (computeActiveChains.js :: fuzzyProcessorMatch).
 */
export const SECOND_HOME_LIMITS = Object.freeze({ pieceMin: 12, processorPrefix: 12 });

/**
 * The engine's five criminal-house booleans and the substrings of a lower-cased house name that raise each
 * (priorityHelpers.js :: getInstitutionNames, word for word; migration 212's table is the same). The chair's
 * ruling (b), COHERENCE-VEIL-8: each reads as the houses the projection still lists would raise it. The guard
 * holds the copy to the engine's own getInstFlags.
 */
export const HOUSE_FLAG_NAMES = Object.freeze({
  hasCriminalInst: Object.freeze(["thieves' guild", 'black market', 'smuggling', 'assassins', 'street gang', 'front business', 'gambling den', 'underground city', 'multiple criminal']),
  hasThievesGuild: Object.freeze(["thieves' guild chapter", "thieves' guild (powerful)"]),
  hasBlackMarket: Object.freeze(['black market', 'black market bazaar']),
  hasSmuggling: Object.freeze(['smuggling network', 'smuggling operation']),
  hasGangInfra: Object.freeze(['street gang', 'multiple criminal factions', 'front business']),
});

/**
 * The searchable pieces of a hidden value: each string leaf, trimmed, and each run of it between
 * sentence stops and dashes (U+2014), of SECOND_HOME_LIMITS.pieceMin code points or more.
 * @param {unknown} v @param {string[]} [out] @returns {string[]}
 */
export function secondHomePieces(v, out = []) {
  if (typeof v === 'string') {
    for (const p of [v, ...v.split(/[.!?—]+/)]) {
      const t = p.replace(/^[ \t\n\r]+|[ \t\n\r]+$/g, '');
      if (Array.from(t).length >= SECOND_HOME_LIMITS.pieceMin) out.push(t);
    }
  } else if (Array.isArray(v)) v.forEach(x => secondHomePieces(x, out));
  else if (isRec(v)) Object.values(v).forEach(x => secondHomePieces(x, out));
  return out;
}

/**
 * THE CATALOGUE IDENTITY'S FOLD (COHERENCE-VEIL-8, -9): lower case, every run of characters that are not an ASCII letter
 * or digit one '_', none at either end. It is the engine's own fold of a house's birth name into its `catalogId`
 * (institutionalCatalog.js :: catalogIdForName), so it is what the rules BY IDENTITY compare with: the two derived lists
 * by positive account, and the processor match of a stamped house. It is NOT the name search's fold (nameFold, below,
 * which keeps the letters of every script). SQL twin: migration 212 :: _gallery_veil_fold, which gives the same string
 * for every input: the only characters outside A-Z whose lower case holds a letter a-z are U+0130 and U+212A (every
 * code point measured), and the SQL spells both out.
 * @param {unknown} t @returns {string}
 */
export const foldName = (t) => String(t ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

/** A custom house (customContentSemanticAuthority.js), read as a plain answer. @param {unknown} v @returns {boolean} */
const isCustomHouse = (v) => isMaterializedCustomContent(v);

/** A-Z to a-z and nothing else, by an explicit map: the same in both engines whatever their locale (SQL: translate). @param {string} t */
const asciiLower = (t) => t.replace(/[A-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + 32));

/**
 * The engine's processor match by a stamped house's catalogue identity, on the fold (computeActiveChains.js ::
 * institutionMatchesProcessor is id-first: the house answers by the name it was born with): the fold of the pattern's
 * first SECOND_HOME_LIMITS.processorPrefix characters inside the identity. SQL twin: _gallery_veil_hidden_name.
 * @param {string} cid @param {string} x @returns {boolean}
 */
function answersByBirth(cid, x) {
  const f = foldName(Array.from(x).slice(0, SECOND_HOME_LIMITS.processorPrefix).join(''));
  return f !== '' && cid.includes(f);
}

// ── THE NAME SEARCH (COHERENCE-VEIL-10; REVIEW-VEIL-7's V7-1, V7-4, V7-7, V7-9, V7-10; PART 11 section 4) ───────────
// A hidden house's name, in any spelling, anywhere. SQL TWIN, rule for rule: migration 212 section 4c
// (_gallery_veil_name_sep, _case, _prep, _fold, _needle, _search, _ready, _hits, _hit, _named, _near, _floor, _taken,
// _sweep), whose header states the rules once. What differs is the engine's economy only: the server asks the whole
// text first and then looks each string up among the strings that hit; this twin asks the pattern of each string.

/** THE SEPARATORS, as the body of a bracket expression (SQL: _gallery_veil_name_sep; the same text). */
const SEP_REST = String.raw`\x3a-\x40\x5b-\x60\x7b-\xbf\xd7\xf7\u2000-\u206f\u2e00-\u2e7f\u3000-\u303f\ufe30-\ufe6f\ufeff\uff00-\uff0f\uff1a-\uff20\uff3b-\uff40\uff5b-\uff65`;
export const NAME_SEP = String.raw`\x01-\x2f` + SEP_REST;
/** The separators but the quotation mark (in a document's text it is where a string ends; a string asked alone holds none by then). */
const NAME_SEPQ = String.raw`\x01-\x21\x23-\x2f` + SEP_REST;
/**
 * THE BLOCKING TABLE (COHERENCE-VEIL-12; REVIEW-VEIL-8's V8-1), as the body of a bracket expression: the letters and the
 * digits (General Category L*, N*) of the scripts that separate their words by spaces, Latin, Greek, Cyrillic, Armenian
 * and Georgian (by the Script property: no Common or Inherited character), and the ASCII digits, over the code points
 * the preparation leaves alone (so not U+212A, the cut-out mark). No punctuation, symbol, mark, separator, control,
 * format character or modifier letter of the Common script (U+02BC) is in it. A neighbour in this table blocks a name;
 * every other neighbour is a boundary. Generated once (docs/chair/2026-11-14/veil-probe-12/gen-name-bound.mjs, Unicode
 * 17.0, Node 22.23): 1,434 code points in 101 ranges, read with the `u` flag (astral ranges). The same literal,
 * character for character, is migration 212 :: _gallery_veil_name_bound; the guard holds the two engines' membership
 * equal for every code point.
 */
export const NAME_BOUND = [
  '0-9A-Za-z\u00c6\u00d0\u00d8\u00de\u00df\u00e6\u00f0\u00f8\u00fe\u0110\u0111\u0126\u0127\u0131\u0138\u0141\u0142',
  '\u014a\u014b\u0152\u0153\u0166\u0167\u0180-\u019f\u01a2-\u01ae\u01b1-\u01c3\u01dd\u01e4\u01e5\u01f6\u01f7\u021c\u021d',
  '\u0220-\u0225\u0234-\u02af\u0370-\u0373\u0376\u0377\u037b-\u037d\u037f\u0391-\u03a1\u03a3-\u03a9\u03b1-\u03c9\u03cf',
  '\u03d7-\u03e1\u03f3\u03f7\u03f8\u03fa-\u03ff\u0402\u0404-\u0406\u0408-\u040b\u040f-\u0418\u041a-\u0438\u043a-\u044f',
  '\u0452\u0454-\u0456\u0458-\u045b\u045f-\u0475\u0478-\u0481\u048a-\u04c0\u04c3-\u04cf\u04d4\u04d5\u04d8\u04d9\u04e0\u04e1',
  '\u04e8\u04e9\u04f6\u04f7\u04fa-\u052f\u0531-\u0556\u0559\u0560-\u0586\u0588\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa',
  '\u10fd-\u10ff\u1c80-\u1c8a\u1c90-\u1cba\u1cbd-\u1cbf\u1d00-\u1d2b\u1d2f\u1d3b\u1d4e\u1d6b-\u1d77\u1d79-\u1d9a',
  '\u1e9c-\u1e9f\u1efa-\u1eff\u2132\u214e\u2180-\u2188\u2c60-\u2c7b\u2c7e\u2c7f\u2d00-\u2d25\u2d27\u2d2d\ua640-\ua66e',
  '\ua67f-\ua69b\ua722-\ua76f\ua771-\ua787\ua78b-\ua7dc\ua7f5-\ua7f7\ua7fa-\ua7ff\uab30-\uab5a\uab60-\uab68',
  '\ud800\udd40-\ud800\udd78\ud800\udd8a\ud800\udd8b\ud801\udf80\ud837\udf00-\ud837\udf1e\ud837\udf25-\ud837\udf2a',
].join('');

/**
 * THE PADDED CHARACTERS (COHERENCE-VEIL-12; the seat's call 2 on V8-1: the neighbour as written), as the body of a
 * bracket expression: every code point that is not itself in the blocking table as written (judged by its own General
 * Category and Script) but whose compatibility form begins or ends with a member (the trade-mark sign is TM, a superscript
 * two is 2, a circled one is 1, a mathematical bold A is A). THE NAME SEARCH writes each between spaces before its
 * preparation (namePad), so it is a boundary; the words' fold (caseFold) does not. A full-width or ligature Latin letter
 * is a Latin letter: not padded, it blocks. None is ASCII. Generated once with the table (gen-name-bound.mjs): 1,486 code
 * points in 70 ranges. The same literal, character for character, is migration 212 :: _gallery_veil_name_pad.
 */
export const NAME_PAD = [
  '\u00b2\u00b3\u00b5\u00b9\u00bc-\u00be\u2070\u2074-\u2079\u2080-\u2089\u20a8\u2100-\u2103\u2105-\u2107\u2109-\u2113',
  '\u2115\u2116\u2119-\u211d\u2120-\u2122\u2124\u2128\u212c\u212d\u212f-\u2131\u2133\u2134\u2139\u213b-\u213f\u2145-\u2149',
  '\u2150-\u215f\u2189\u2460-\u2473\u2488-\u249b\u24b6-\u24ea\u3250-\u325f\u32b1-\u32cf\u3358-\u337a\u3380-\u33ff',
  '\uff10-\uff19\ud833\udcd6-\ud833\udcf9\ud835\udc00-\ud835\udc54\ud835\udc56-\ud835\udc9c\ud835\udc9e\ud835\udc9f',
  '\ud835\udca2\ud835\udca5\ud835\udca6\ud835\udca9-\ud835\udcac\ud835\udcae-\ud835\udcb9\ud835\udcbb',
  '\ud835\udcbd-\ud835\udcc3\ud835\udcc5-\ud835\udd05\ud835\udd07-\ud835\udd0a\ud835\udd0d-\ud835\udd14',
  '\ud835\udd16-\ud835\udd1c\ud835\udd1e-\ud835\udd39\ud835\udd3b-\ud835\udd3e\ud835\udd40-\ud835\udd44\ud835\udd46',
  '\ud835\udd4a-\ud835\udd50\ud835\udd52-\ud835\udea5\ud835\udea8-\ud835\udec0\ud835\udec2-\ud835\udeda',
  '\ud835\udedc-\ud835\udefa\ud835\udefc-\ud835\udf14\ud835\udf16-\ud835\udf34\ud835\udf36-\ud835\udf4e',
  '\ud835\udf50-\ud835\udf6e\ud835\udf70-\ud835\udf88\ud835\udf8a-\ud835\udfa8\ud835\udfaa-\ud835\udfc2',
  '\ud835\udfc4-\ud835\udfcb\ud835\udfce-\ud835\udfff\ud83c\udd00-\ud83c\udd0a\ud83c\udd2b-\ud83c\udd2e',
  '\ud83c\udd30-\ud83c\udd4f\ud83c\udd6a-\ud83c\udd6c\ud83c\udd90\ud83e\udff0-\ud83e\udff9',
].join('');
/** A hidden name at or below this level is not walked to: the container AT this level is withheld whole (the root is level 0). */
export const NAME_WALK_BOUND = 64;

/**
 * THE CASE CLASSES: each a lower-case letter followed by every other code point that is the same letter in another case;
 * classes separated by one space. Generated once (docs/chair/2026-11-13/veil-probe-10/gen-name-tables.mjs, Unicode 17.0).
 * The same literal, character for character, is migration 212 :: _gallery_veil_name_case; the guard holds them equal.
 */
export const NAME_CASE = [
  'aA bB cC dD eE fF gG hH iI\u0131 jJ kK lL mM nN oO pP qQ rR sS tT uU vV wW xX yY zZ \u00df\u1e9e \u00e6\u00c6 \u00f0\u00d0 \u00f8\u00d8 \u00fe\u00de ',
  '\u0111\u0110 \u0127\u0126 \u0142\u0141 \u014b\u014a \u0153\u0152 \u0167\u0166 \u0180\u0243 \u0183\u0182 \u0185\u0184 \u0188\u0187 \u018c\u018b ',
  '\u0192\u0191 \u0195\u01f6 \u0199\u0198 \u019a\u023d \u019b\ua7dc \u019e\u0220 \u01a3\u01a2 \u01a5\u01a4 \u01a8\u01a7 \u01ad\u01ac \u01b4\u01b3 ',
  '\u01b6\u01b5 \u01b9\u01b8 \u01bd\u01bc \u01bf\u01f7 \u01dd\u018e \u01e5\u01e4 \u021d\u021c \u0223\u0222 \u0225\u0224 \u023c\u023b \u023f\u2c7e ',
  '\u0240\u2c7f \u0242\u0241 \u0247\u0246 \u0249\u0248 \u024b\u024a \u024d\u024c \u024f\u024e \u0250\u2c6f \u0251\u2c6d \u0252\u2c70 \u0253\u0181 ',
  '\u0254\u0186 \u0256\u0189 \u0257\u018a \u0259\u018f \u025b\u0190 \u025c\ua7ab \u0260\u0193 \u0261\ua7ac \u0263\u0194 \u0264\ua7cb \u0265\ua78d ',
  '\u0266\ua7aa \u0268\u0197 \u0269\u0196 \u026a\ua7ae \u026b\u2c62 \u026c\ua7ad \u026f\u019c \u0271\u2c6e \u0272\u019d \u0275\u019f \u027d\u2c64 ',
  '\u0280\u01a6 \u0282\ua7c5 \u0283\u01a9 \u0287\ua7b1 \u0288\u01ae \u0289\u0244 \u028a\u01b1 \u028b\u01b2 \u028c\u0245 \u0292\u01b7 \u029d\ua7b2 ',
  '\u029e\ua7b0 \u0371\u0370 \u0373\u0372 \u0377\u0376 \u037b\u03fd \u037c\u03fe \u037d\u03ff \u03b1\u0391 \u03b2\u0392 \u03b3\u0393 \u03b4\u0394 ',
  '\u03b5\u0395 \u03b6\u0396 \u03b7\u0397 \u03b8\u0398 \u03b9\u0399 \u03ba\u039a \u03bb\u039b \u03bc\u039c \u03bd\u039d \u03be\u039e \u03bf\u039f ',
  '\u03c0\u03a0 \u03c1\u03a1 \u03c3\u03a3\u03c2 \u03c4\u03a4 \u03c5\u03a5 \u03c6\u03a6 \u03c7\u03a7 \u03c8\u03a8 \u03c9\u03a9 \u03d7\u03cf \u03d9\u03d8 ',
  '\u03db\u03da \u03dd\u03dc \u03df\u03de \u03e1\u03e0 \u03e3\u03e2 \u03e5\u03e4 \u03e7\u03e6 \u03e9\u03e8 \u03eb\u03ea \u03ed\u03ec \u03ef\u03ee ',
  '\u03f3\u037f \u03f8\u03f7 \u03fb\u03fa \u0430\u0410 \u0431\u0411 \u0432\u0412\u1c80 \u0433\u0413 \u0434\u0414\u1c81 \u0435\u0415 \u0436\u0416 ',
  '\u0437\u0417 \u0438\u0418 \u043a\u041a \u043b\u041b \u043c\u041c \u043d\u041d \u043e\u041e\u1c82 \u043f\u041f \u0440\u0420 \u0441\u0421\u1c83 ',
  '\u0442\u0422\u1c84\u1c85 \u0443\u0423 \u0444\u0424 \u0445\u0425 \u0446\u0426 \u0447\u0427 \u0448\u0428 \u0449\u0429 \u044a\u042a\u1c86 \u044b\u042b ',
  '\u044c\u042c \u044d\u042d \u044e\u042e \u044f\u042f \u0452\u0402 \u0454\u0404 \u0455\u0405 \u0456\u0406 \u0458\u0408 \u0459\u0409 \u045a\u040a ',
  '\u045b\u040b \u045f\u040f \u0461\u0460 \u0463\u0462\u1c87 \u0465\u0464 \u0467\u0466 \u0469\u0468 \u046b\u046a \u046d\u046c \u046f\u046e \u0471\u0470 ',
  '\u0473\u0472 \u0475\u0474 \u0479\u0478 \u047b\u047a \u047d\u047c \u047f\u047e \u0481\u0480 \u048b\u048a \u048d\u048c \u048f\u048e \u0491\u0490 ',
  '\u0493\u0492 \u0495\u0494 \u0497\u0496 \u0499\u0498 \u049b\u049a \u049d\u049c \u049f\u049e \u04a1\u04a0 \u04a3\u04a2 \u04a5\u04a4 \u04a7\u04a6 ',
  '\u04a9\u04a8 \u04ab\u04aa \u04ad\u04ac \u04af\u04ae \u04b1\u04b0 \u04b3\u04b2 \u04b5\u04b4 \u04b7\u04b6 \u04b9\u04b8 \u04bb\u04ba \u04bd\u04bc ',
  '\u04bf\u04be \u04c4\u04c3 \u04c6\u04c5 \u04c8\u04c7 \u04ca\u04c9 \u04cc\u04cb \u04ce\u04cd \u04cf\u04c0 \u04d5\u04d4 \u04d9\u04d8 \u04e1\u04e0 ',
  '\u04e9\u04e8 \u04f7\u04f6 \u04fb\u04fa \u04fd\u04fc \u04ff\u04fe \u0501\u0500 \u0503\u0502 \u0505\u0504 \u0507\u0506 \u0509\u0508 \u050b\u050a ',
  '\u050d\u050c \u050f\u050e \u0511\u0510 \u0513\u0512 \u0515\u0514 \u0517\u0516 \u0519\u0518 \u051b\u051a \u051d\u051c \u051f\u051e \u0521\u0520 ',
  '\u0523\u0522 \u0525\u0524 \u0527\u0526 \u0529\u0528 \u052b\u052a \u052d\u052c \u052f\u052e \u0561\u0531 \u0562\u0532 \u0563\u0533 \u0564\u0534 ',
  '\u0565\u0535 \u0566\u0536 \u0567\u0537 \u0568\u0538 \u0569\u0539 \u056a\u053a \u056b\u053b \u056c\u053c \u056d\u053d \u056e\u053e \u056f\u053f ',
  '\u0570\u0540 \u0571\u0541 \u0572\u0542 \u0573\u0543 \u0574\u0544 \u0575\u0545 \u0576\u0546 \u0577\u0547 \u0578\u0548 \u0579\u0549 \u057a\u054a ',
  '\u057b\u054b \u057c\u054c \u057d\u054d \u057e\u054e \u057f\u054f \u0580\u0550 \u0581\u0551 \u0582\u0552 \u0583\u0553 \u0584\u0554 \u0585\u0555 ',
  '\u0586\u0556 \u10d0\u1c90 \u10d1\u1c91 \u10d2\u1c92 \u10d3\u1c93 \u10d4\u1c94 \u10d5\u1c95 \u10d6\u1c96 \u10d7\u1c97 \u10d8\u1c98 \u10d9\u1c99 ',
  '\u10da\u1c9a \u10db\u1c9b \u10dc\u1c9c \u10dd\u1c9d \u10de\u1c9e \u10df\u1c9f \u10e0\u1ca0 \u10e1\u1ca1 \u10e2\u1ca2 \u10e3\u1ca3 \u10e4\u1ca4 ',
  '\u10e5\u1ca5 \u10e6\u1ca6 \u10e7\u1ca7 \u10e8\u1ca8 \u10e9\u1ca9 \u10ea\u1caa \u10eb\u1cab \u10ec\u1cac \u10ed\u1cad \u10ee\u1cae \u10ef\u1caf ',
  '\u10f0\u1cb0 \u10f1\u1cb1 \u10f2\u1cb2 \u10f3\u1cb3 \u10f4\u1cb4 \u10f5\u1cb5 \u10f6\u1cb6 \u10f7\u1cb7 \u10f8\u1cb8 \u10f9\u1cb9 \u10fa\u1cba ',
  '\u10fd\u1cbd \u10fe\u1cbe \u10ff\u1cbf \u13f8\u13f0 \u13f9\u13f1 \u13fa\u13f2 \u13fb\u13f3 \u13fc\u13f4 \u13fd\u13f5 \u1c88\ua64a\ua64b \u1c8a\u1c89 ',
  '\u1d79\ua77d \u1d7d\u2c63 \u1d8e\ua7c6 \u1efb\u1efa \u1efd\u1efc \u1eff\u1efe \u214e\u2132 \u2184\u2183 \u2c30\u2c00 \u2c31\u2c01 \u2c32\u2c02 ',
  '\u2c33\u2c03 \u2c34\u2c04 \u2c35\u2c05 \u2c36\u2c06 \u2c37\u2c07 \u2c38\u2c08 \u2c39\u2c09 \u2c3a\u2c0a \u2c3b\u2c0b \u2c3c\u2c0c \u2c3d\u2c0d ',
  '\u2c3e\u2c0e \u2c3f\u2c0f \u2c40\u2c10 \u2c41\u2c11 \u2c42\u2c12 \u2c43\u2c13 \u2c44\u2c14 \u2c45\u2c15 \u2c46\u2c16 \u2c47\u2c17 \u2c48\u2c18 ',
  '\u2c49\u2c19 \u2c4a\u2c1a \u2c4b\u2c1b \u2c4c\u2c1c \u2c4d\u2c1d \u2c4e\u2c1e \u2c4f\u2c1f \u2c50\u2c20 \u2c51\u2c21 \u2c52\u2c22 \u2c53\u2c23 ',
  '\u2c54\u2c24 \u2c55\u2c25 \u2c56\u2c26 \u2c57\u2c27 \u2c58\u2c28 \u2c59\u2c29 \u2c5a\u2c2a \u2c5b\u2c2b \u2c5c\u2c2c \u2c5d\u2c2d \u2c5e\u2c2e ',
  '\u2c5f\u2c2f \u2c61\u2c60 \u2c65\u023a \u2c66\u023e \u2c68\u2c67 \u2c6a\u2c69 \u2c6c\u2c6b \u2c73\u2c72 \u2c76\u2c75 \u2c81\u2c80 \u2c83\u2c82 ',
  '\u2c85\u2c84 \u2c87\u2c86 \u2c89\u2c88 \u2c8b\u2c8a \u2c8d\u2c8c \u2c8f\u2c8e \u2c91\u2c90 \u2c93\u2c92 \u2c95\u2c94 \u2c97\u2c96 \u2c99\u2c98 ',
  '\u2c9b\u2c9a \u2c9d\u2c9c \u2c9f\u2c9e \u2ca1\u2ca0 \u2ca3\u2ca2 \u2ca5\u2ca4 \u2ca7\u2ca6 \u2ca9\u2ca8 \u2cab\u2caa \u2cad\u2cac \u2caf\u2cae ',
  '\u2cb1\u2cb0 \u2cb3\u2cb2 \u2cb5\u2cb4 \u2cb7\u2cb6 \u2cb9\u2cb8 \u2cbb\u2cba \u2cbd\u2cbc \u2cbf\u2cbe \u2cc1\u2cc0 \u2cc3\u2cc2 \u2cc5\u2cc4 ',
  '\u2cc7\u2cc6 \u2cc9\u2cc8 \u2ccb\u2cca \u2ccd\u2ccc \u2ccf\u2cce \u2cd1\u2cd0 \u2cd3\u2cd2 \u2cd5\u2cd4 \u2cd7\u2cd6 \u2cd9\u2cd8 \u2cdb\u2cda ',
  '\u2cdd\u2cdc \u2cdf\u2cde \u2ce1\u2ce0 \u2ce3\u2ce2 \u2cec\u2ceb \u2cee\u2ced \u2cf3\u2cf2 \u2d00\u10a0 \u2d01\u10a1 \u2d02\u10a2 \u2d03\u10a3 ',
  '\u2d04\u10a4 \u2d05\u10a5 \u2d06\u10a6 \u2d07\u10a7 \u2d08\u10a8 \u2d09\u10a9 \u2d0a\u10aa \u2d0b\u10ab \u2d0c\u10ac \u2d0d\u10ad \u2d0e\u10ae ',
  '\u2d0f\u10af \u2d10\u10b0 \u2d11\u10b1 \u2d12\u10b2 \u2d13\u10b3 \u2d14\u10b4 \u2d15\u10b5 \u2d16\u10b6 \u2d17\u10b7 \u2d18\u10b8 \u2d19\u10b9 ',
  '\u2d1a\u10ba \u2d1b\u10bb \u2d1c\u10bc \u2d1d\u10bd \u2d1e\u10be \u2d1f\u10bf \u2d20\u10c0 \u2d21\u10c1 \u2d22\u10c2 \u2d23\u10c3 \u2d24\u10c4 ',
  '\u2d25\u10c5 \u2d27\u10c7 \u2d2d\u10cd \ua641\ua640 \ua643\ua642 \ua645\ua644 \ua647\ua646 \ua649\ua648 \ua64d\ua64c \ua64f\ua64e \ua651\ua650 ',
  '\ua653\ua652 \ua655\ua654 \ua657\ua656 \ua659\ua658 \ua65b\ua65a \ua65d\ua65c \ua65f\ua65e \ua661\ua660 \ua663\ua662 \ua665\ua664 \ua667\ua666 ',
  '\ua669\ua668 \ua66b\ua66a \ua66d\ua66c \ua681\ua680 \ua683\ua682 \ua685\ua684 \ua687\ua686 \ua689\ua688 \ua68b\ua68a \ua68d\ua68c \ua68f\ua68e ',
  '\ua691\ua690 \ua693\ua692 \ua695\ua694 \ua697\ua696 \ua699\ua698 \ua69b\ua69a \ua723\ua722 \ua725\ua724 \ua727\ua726 \ua729\ua728 \ua72b\ua72a ',
  '\ua72d\ua72c \ua72f\ua72e \ua733\ua732 \ua735\ua734 \ua737\ua736 \ua739\ua738 \ua73b\ua73a \ua73d\ua73c \ua73f\ua73e \ua741\ua740 \ua743\ua742 ',
  '\ua745\ua744 \ua747\ua746 \ua749\ua748 \ua74b\ua74a \ua74d\ua74c \ua74f\ua74e \ua751\ua750 \ua753\ua752 \ua755\ua754 \ua757\ua756 \ua759\ua758 ',
  '\ua75b\ua75a \ua75d\ua75c \ua75f\ua75e \ua761\ua760 \ua763\ua762 \ua765\ua764 \ua767\ua766 \ua769\ua768 \ua76b\ua76a \ua76d\ua76c \ua76f\ua76e ',
  '\ua77a\ua779 \ua77c\ua77b \ua77f\ua77e \ua781\ua780 \ua783\ua782 \ua785\ua784 \ua787\ua786 \ua78c\ua78b \ua791\ua790 \ua793\ua792 \ua794\ua7c4 ',
  '\ua797\ua796 \ua799\ua798 \ua79b\ua79a \ua79d\ua79c \ua79f\ua79e \ua7a1\ua7a0 \ua7a3\ua7a2 \ua7a5\ua7a4 \ua7a7\ua7a6 \ua7a9\ua7a8 \ua7b5\ua7b4 ',
  '\ua7b7\ua7b6 \ua7b9\ua7b8 \ua7bb\ua7ba \ua7bd\ua7bc \ua7bf\ua7be \ua7c1\ua7c0 \ua7c3\ua7c2 \ua7c8\ua7c7 \ua7ca\ua7c9 \ua7cd\ua7cc \ua7cf\ua7ce ',
  '\ua7d1\ua7d0 \ua7d3\ua7d2 \ua7d5\ua7d4 \ua7d7\ua7d6 \ua7d9\ua7d8 \ua7db\ua7da \ua7f6\ua7f5 \uab53\ua7b3 \uab70\u13a0 \uab71\u13a1 \uab72\u13a2 ',
  '\uab73\u13a3 \uab74\u13a4 \uab75\u13a5 \uab76\u13a6 \uab77\u13a7 \uab78\u13a8 \uab79\u13a9 \uab7a\u13aa \uab7b\u13ab \uab7c\u13ac \uab7d\u13ad ',
  '\uab7e\u13ae \uab7f\u13af \uab80\u13b0 \uab81\u13b1 \uab82\u13b2 \uab83\u13b3 \uab84\u13b4 \uab85\u13b5 \uab86\u13b6 \uab87\u13b7 \uab88\u13b8 ',
  '\uab89\u13b9 \uab8a\u13ba \uab8b\u13bb \uab8c\u13bc \uab8d\u13bd \uab8e\u13be \uab8f\u13bf \uab90\u13c0 \uab91\u13c1 \uab92\u13c2 \uab93\u13c3 ',
  '\uab94\u13c4 \uab95\u13c5 \uab96\u13c6 \uab97\u13c7 \uab98\u13c8 \uab99\u13c9 \uab9a\u13ca \uab9b\u13cb \uab9c\u13cc \uab9d\u13cd \uab9e\u13ce ',
  '\uab9f\u13cf \uaba0\u13d0 \uaba1\u13d1 \uaba2\u13d2 \uaba3\u13d3 \uaba4\u13d4 \uaba5\u13d5 \uaba6\u13d6 \uaba7\u13d7 \uaba8\u13d8 \uaba9\u13d9 ',
  '\uabaa\u13da \uabab\u13db \uabac\u13dc \uabad\u13dd \uabae\u13de \uabaf\u13df \uabb0\u13e0 \uabb1\u13e1 \uabb2\u13e2 \uabb3\u13e3 \uabb4\u13e4 ',
  '\uabb5\u13e5 \uabb6\u13e6 \uabb7\u13e7 \uabb8\u13e8 \uabb9\u13e9 \uabba\u13ea \uabbb\u13eb \uabbc\u13ec \uabbd\u13ed \uabbe\u13ee \uabbf\u13ef ',
  '\ud801\udc28\ud801\udc00 \ud801\udc29\ud801\udc01 \ud801\udc2a\ud801\udc02 \ud801\udc2b\ud801\udc03 \ud801\udc2c\ud801\udc04 \ud801\udc2d\ud801\udc05 ',
  '\ud801\udc2e\ud801\udc06 \ud801\udc2f\ud801\udc07 \ud801\udc30\ud801\udc08 \ud801\udc31\ud801\udc09 \ud801\udc32\ud801\udc0a \ud801\udc33\ud801\udc0b ',
  '\ud801\udc34\ud801\udc0c \ud801\udc35\ud801\udc0d \ud801\udc36\ud801\udc0e \ud801\udc37\ud801\udc0f \ud801\udc38\ud801\udc10 \ud801\udc39\ud801\udc11 ',
  '\ud801\udc3a\ud801\udc12 \ud801\udc3b\ud801\udc13 \ud801\udc3c\ud801\udc14 \ud801\udc3d\ud801\udc15 \ud801\udc3e\ud801\udc16 \ud801\udc3f\ud801\udc17 ',
  '\ud801\udc40\ud801\udc18 \ud801\udc41\ud801\udc19 \ud801\udc42\ud801\udc1a \ud801\udc43\ud801\udc1b \ud801\udc44\ud801\udc1c \ud801\udc45\ud801\udc1d ',
  '\ud801\udc46\ud801\udc1e \ud801\udc47\ud801\udc1f \ud801\udc48\ud801\udc20 \ud801\udc49\ud801\udc21 \ud801\udc4a\ud801\udc22 \ud801\udc4b\ud801\udc23 ',
  '\ud801\udc4c\ud801\udc24 \ud801\udc4d\ud801\udc25 \ud801\udc4e\ud801\udc26 \ud801\udc4f\ud801\udc27 \ud801\udcd8\ud801\udcb0 \ud801\udcd9\ud801\udcb1 ',
  '\ud801\udcda\ud801\udcb2 \ud801\udcdb\ud801\udcb3 \ud801\udcdc\ud801\udcb4 \ud801\udcdd\ud801\udcb5 \ud801\udcde\ud801\udcb6 \ud801\udcdf\ud801\udcb7 ',
  '\ud801\udce0\ud801\udcb8 \ud801\udce1\ud801\udcb9 \ud801\udce2\ud801\udcba \ud801\udce3\ud801\udcbb \ud801\udce4\ud801\udcbc \ud801\udce5\ud801\udcbd ',
  '\ud801\udce6\ud801\udcbe \ud801\udce7\ud801\udcbf \ud801\udce8\ud801\udcc0 \ud801\udce9\ud801\udcc1 \ud801\udcea\ud801\udcc2 \ud801\udceb\ud801\udcc3 ',
  '\ud801\udcec\ud801\udcc4 \ud801\udced\ud801\udcc5 \ud801\udcee\ud801\udcc6 \ud801\udcef\ud801\udcc7 \ud801\udcf0\ud801\udcc8 \ud801\udcf1\ud801\udcc9 ',
  '\ud801\udcf2\ud801\udcca \ud801\udcf3\ud801\udccb \ud801\udcf4\ud801\udccc \ud801\udcf5\ud801\udccd \ud801\udcf6\ud801\udcce \ud801\udcf7\ud801\udccf ',
  '\ud801\udcf8\ud801\udcd0 \ud801\udcf9\ud801\udcd1 \ud801\udcfa\ud801\udcd2 \ud801\udcfb\ud801\udcd3 \ud801\udd97\ud801\udd70 \ud801\udd98\ud801\udd71 ',
  '\ud801\udd99\ud801\udd72 \ud801\udd9a\ud801\udd73 \ud801\udd9b\ud801\udd74 \ud801\udd9c\ud801\udd75 \ud801\udd9d\ud801\udd76 \ud801\udd9e\ud801\udd77 ',
  '\ud801\udd9f\ud801\udd78 \ud801\udda0\ud801\udd79 \ud801\udda1\ud801\udd7a \ud801\udda3\ud801\udd7c \ud801\udda4\ud801\udd7d \ud801\udda5\ud801\udd7e ',
  '\ud801\udda6\ud801\udd7f \ud801\udda7\ud801\udd80 \ud801\udda8\ud801\udd81 \ud801\udda9\ud801\udd82 \ud801\uddaa\ud801\udd83 \ud801\uddab\ud801\udd84 ',
  '\ud801\uddac\ud801\udd85 \ud801\uddad\ud801\udd86 \ud801\uddae\ud801\udd87 \ud801\uddaf\ud801\udd88 \ud801\uddb0\ud801\udd89 \ud801\uddb1\ud801\udd8a ',
  '\ud801\uddb3\ud801\udd8c \ud801\uddb4\ud801\udd8d \ud801\uddb5\ud801\udd8e \ud801\uddb6\ud801\udd8f \ud801\uddb7\ud801\udd90 \ud801\uddb8\ud801\udd91 ',
  '\ud801\uddb9\ud801\udd92 \ud801\uddbb\ud801\udd94 \ud801\uddbc\ud801\udd95 \ud803\udcc0\ud803\udc80 \ud803\udcc1\ud803\udc81 \ud803\udcc2\ud803\udc82 ',
  '\ud803\udcc3\ud803\udc83 \ud803\udcc4\ud803\udc84 \ud803\udcc5\ud803\udc85 \ud803\udcc6\ud803\udc86 \ud803\udcc7\ud803\udc87 \ud803\udcc8\ud803\udc88 ',
  '\ud803\udcc9\ud803\udc89 \ud803\udcca\ud803\udc8a \ud803\udccb\ud803\udc8b \ud803\udccc\ud803\udc8c \ud803\udccd\ud803\udc8d \ud803\udcce\ud803\udc8e ',
  '\ud803\udccf\ud803\udc8f \ud803\udcd0\ud803\udc90 \ud803\udcd1\ud803\udc91 \ud803\udcd2\ud803\udc92 \ud803\udcd3\ud803\udc93 \ud803\udcd4\ud803\udc94 ',
  '\ud803\udcd5\ud803\udc95 \ud803\udcd6\ud803\udc96 \ud803\udcd7\ud803\udc97 \ud803\udcd8\ud803\udc98 \ud803\udcd9\ud803\udc99 \ud803\udcda\ud803\udc9a ',
  '\ud803\udcdb\ud803\udc9b \ud803\udcdc\ud803\udc9c \ud803\udcdd\ud803\udc9d \ud803\udcde\ud803\udc9e \ud803\udcdf\ud803\udc9f \ud803\udce0\ud803\udca0 ',
  '\ud803\udce1\ud803\udca1 \ud803\udce2\ud803\udca2 \ud803\udce3\ud803\udca3 \ud803\udce4\ud803\udca4 \ud803\udce5\ud803\udca5 \ud803\udce6\ud803\udca6 ',
  '\ud803\udce7\ud803\udca7 \ud803\udce8\ud803\udca8 \ud803\udce9\ud803\udca9 \ud803\udcea\ud803\udcaa \ud803\udceb\ud803\udcab \ud803\udcec\ud803\udcac ',
  '\ud803\udced\ud803\udcad \ud803\udcee\ud803\udcae \ud803\udcef\ud803\udcaf \ud803\udcf0\ud803\udcb0 \ud803\udcf1\ud803\udcb1 \ud803\udcf2\ud803\udcb2 ',
  '\ud803\udd70\ud803\udd50 \ud803\udd71\ud803\udd51 \ud803\udd72\ud803\udd52 \ud803\udd73\ud803\udd53 \ud803\udd74\ud803\udd54 \ud803\udd75\ud803\udd55 ',
  '\ud803\udd76\ud803\udd56 \ud803\udd77\ud803\udd57 \ud803\udd78\ud803\udd58 \ud803\udd79\ud803\udd59 \ud803\udd7a\ud803\udd5a \ud803\udd7b\ud803\udd5b ',
  '\ud803\udd7c\ud803\udd5c \ud803\udd7d\ud803\udd5d \ud803\udd7e\ud803\udd5e \ud803\udd7f\ud803\udd5f \ud803\udd80\ud803\udd60 \ud803\udd81\ud803\udd61 ',
  '\ud803\udd82\ud803\udd62 \ud803\udd83\ud803\udd63 \ud803\udd84\ud803\udd64 \ud803\udd85\ud803\udd65 \ud806\udcc0\ud806\udca0 \ud806\udcc1\ud806\udca1 ',
  '\ud806\udcc2\ud806\udca2 \ud806\udcc3\ud806\udca3 \ud806\udcc4\ud806\udca4 \ud806\udcc5\ud806\udca5 \ud806\udcc6\ud806\udca6 \ud806\udcc7\ud806\udca7 ',
  '\ud806\udcc8\ud806\udca8 \ud806\udcc9\ud806\udca9 \ud806\udcca\ud806\udcaa \ud806\udccb\ud806\udcab \ud806\udccc\ud806\udcac \ud806\udccd\ud806\udcad ',
  '\ud806\udcce\ud806\udcae \ud806\udccf\ud806\udcaf \ud806\udcd0\ud806\udcb0 \ud806\udcd1\ud806\udcb1 \ud806\udcd2\ud806\udcb2 \ud806\udcd3\ud806\udcb3 ',
  '\ud806\udcd4\ud806\udcb4 \ud806\udcd5\ud806\udcb5 \ud806\udcd6\ud806\udcb6 \ud806\udcd7\ud806\udcb7 \ud806\udcd8\ud806\udcb8 \ud806\udcd9\ud806\udcb9 ',
  '\ud806\udcda\ud806\udcba \ud806\udcdb\ud806\udcbb \ud806\udcdc\ud806\udcbc \ud806\udcdd\ud806\udcbd \ud806\udcde\ud806\udcbe \ud806\udcdf\ud806\udcbf ',
  '\ud81b\ude60\ud81b\ude40 \ud81b\ude61\ud81b\ude41 \ud81b\ude62\ud81b\ude42 \ud81b\ude63\ud81b\ude43 \ud81b\ude64\ud81b\ude44 \ud81b\ude65\ud81b\ude45 ',
  '\ud81b\ude66\ud81b\ude46 \ud81b\ude67\ud81b\ude47 \ud81b\ude68\ud81b\ude48 \ud81b\ude69\ud81b\ude49 \ud81b\ude6a\ud81b\ude4a \ud81b\ude6b\ud81b\ude4b ',
  '\ud81b\ude6c\ud81b\ude4c \ud81b\ude6d\ud81b\ude4d \ud81b\ude6e\ud81b\ude4e \ud81b\ude6f\ud81b\ude4f \ud81b\ude70\ud81b\ude50 \ud81b\ude71\ud81b\ude51 ',
  '\ud81b\ude72\ud81b\ude52 \ud81b\ude73\ud81b\ude53 \ud81b\ude74\ud81b\ude54 \ud81b\ude75\ud81b\ude55 \ud81b\ude76\ud81b\ude56 \ud81b\ude77\ud81b\ude57 ',
  '\ud81b\ude78\ud81b\ude58 \ud81b\ude79\ud81b\ude59 \ud81b\ude7a\ud81b\ude5a \ud81b\ude7b\ud81b\ude5b \ud81b\ude7c\ud81b\ude5c \ud81b\ude7d\ud81b\ude5d ',
  '\ud81b\ude7e\ud81b\ude5e \ud81b\ude7f\ud81b\ude5f \ud81b\udebb\ud81b\udea0 \ud81b\udebc\ud81b\udea1 \ud81b\udebd\ud81b\udea2 \ud81b\udebe\ud81b\udea3 ',
  '\ud81b\udebf\ud81b\udea4 \ud81b\udec0\ud81b\udea5 \ud81b\udec1\ud81b\udea6 \ud81b\udec2\ud81b\udea7 \ud81b\udec3\ud81b\udea8 \ud81b\udec4\ud81b\udea9 ',
  '\ud81b\udec5\ud81b\udeaa \ud81b\udec6\ud81b\udeab \ud81b\udec7\ud81b\udeac \ud81b\udec8\ud81b\udead \ud81b\udec9\ud81b\udeae \ud81b\udeca\ud81b\udeaf ',
  '\ud81b\udecb\ud81b\udeb0 \ud81b\udecc\ud81b\udeb1 \ud81b\udecd\ud81b\udeb2 \ud81b\udece\ud81b\udeb3 \ud81b\udecf\ud81b\udeb4 \ud81b\uded0\ud81b\udeb5 ',
  '\ud81b\uded1\ud81b\udeb6 \ud81b\uded2\ud81b\udeb7 \ud81b\uded3\ud81b\udeb8 \ud83a\udd22\ud83a\udd00 \ud83a\udd23\ud83a\udd01 \ud83a\udd24\ud83a\udd02 ',
  '\ud83a\udd25\ud83a\udd03 \ud83a\udd26\ud83a\udd04 \ud83a\udd27\ud83a\udd05 \ud83a\udd28\ud83a\udd06 \ud83a\udd29\ud83a\udd07 \ud83a\udd2a\ud83a\udd08 ',
  '\ud83a\udd2b\ud83a\udd09 \ud83a\udd2c\ud83a\udd0a \ud83a\udd2d\ud83a\udd0b \ud83a\udd2e\ud83a\udd0c \ud83a\udd2f\ud83a\udd0d \ud83a\udd30\ud83a\udd0e ',
  '\ud83a\udd31\ud83a\udd0f \ud83a\udd32\ud83a\udd10 \ud83a\udd33\ud83a\udd11 \ud83a\udd34\ud83a\udd12 \ud83a\udd35\ud83a\udd13 \ud83a\udd36\ud83a\udd14 ',
  '\ud83a\udd37\ud83a\udd15 \ud83a\udd38\ud83a\udd16 \ud83a\udd39\ud83a\udd17 \ud83a\udd3a\ud83a\udd18 \ud83a\udd3b\ud83a\udd19 \ud83a\udd3c\ud83a\udd1a ',
  '\ud83a\udd3d\ud83a\udd1b \ud83a\udd3e\ud83a\udd1c \ud83a\udd3f\ud83a\udd1d \ud83a\udd40\ud83a\udd1e \ud83a\udd41\ud83a\udd1f \ud83a\udd42\ud83a\udd20 ',
  '\ud83a\udd43\ud83a\udd21',
].join('');

/**
 * THE SKEW: code points that Unicode 17.0 decomposes and PostgreSQL 16 (Unicode 15.0) does not, each with its
 * decomposition, written out by both engines before they normalise (SQL: _gallery_veil_name_prep, the same JSON text).
 * @type {Readonly<Record<string, string>>}
 */
export const NAME_SKEW = Object.freeze(JSON.parse('{"\ua7f1":"S","\ud801\uddc9":"\ud801\uddd2\u0307","\ud801\udde4":"\ud801\uddda\u0307","\ud804\udf83":"\ud804\udf82\ud804\udfc9","\ud804\udf85":"\ud804\udf84\ud804\udfbb","\ud804\udf8e":"\ud804\udf8b\ud804\udfc2","\ud804\udf91":"\ud804\udf90\ud804\udfc9","\ud804\udfc5":"\ud804\udfc2\ud804\udfc2","\ud804\udfc7":"\ud804\udfc2\ud804\udfb8","\ud804\udfc8":"\ud804\udfc2\ud804\udfc9","\ud818\udd21":"\ud818\udd1e\ud818\udd1e","\ud818\udd22":"\ud818\udd1e\ud818\udd29","\ud818\udd23":"\ud818\udd1e\ud818\udd1f","\ud818\udd24":"\ud818\udd29\ud818\udd1f","\ud818\udd25":"\ud818\udd1e\ud818\udd20","\ud818\udd26":"\ud818\udd1e\ud818\udd1e\ud818\udd1f","\ud818\udd27":"\ud818\udd1e\ud818\udd29\ud818\udd1f","\ud818\udd28":"\ud818\udd1e\ud818\udd1e\ud818\udd20","\ud81b\udd68":"\ud81b\udd67\ud81b\udd67","\ud81b\udd69":"\ud81b\udd63\ud81b\udd67","\ud81b\udd6a":"\ud81b\udd63\ud81b\udd67\ud81b\udd67","\ud833\udcd6":"A","\ud833\udcd7":"B","\ud833\udcd8":"C","\ud833\udcd9":"D","\ud833\udcda":"E","\ud833\udcdb":"F","\ud833\udcdc":"G","\ud833\udcdd":"H","\ud833\udcde":"I","\ud833\udcdf":"J","\ud833\udce0":"K","\ud833\udce1":"L","\ud833\udce2":"M","\ud833\udce3":"N","\ud833\udce4":"O","\ud833\udce5":"P","\ud833\udce6":"Q","\ud833\udce7":"R","\ud833\udce8":"S","\ud833\udce9":"T","\ud833\udcea":"U","\ud833\udceb":"V","\ud833\udcec":"W","\ud833\udced":"X","\ud833\udcee":"Y","\ud833\udcef":"Z","\ud833\udcf0":"0","\ud833\udcf1":"1","\ud833\udcf2":"2","\ud833\udcf3":"3","\ud833\udcf4":"4","\ud833\udcf5":"5","\ud833\udcf6":"6","\ud833\udcf7":"7","\ud833\udcf8":"8","\ud833\udcf9":"9"}'));

const SKEW_ANY = new RegExp(`[${Object.keys(NAME_SKEW).join('')}]`, 'gu');
const NON_ASCII = new RegExp(String.raw`[^\x00-\x7f]`);
const PAD_ANY = new RegExp(`[${NAME_PAD}]`, 'gu');
const SEP_RUN = new RegExp(`[${NAME_SEP}]+`, 'g');
const SEPQ_RUN = new RegExp(`[${NAME_SEPQ}]+`, 'g');
const BOUND_END = new RegExp(`^[${NAME_BOUND}]$`, 'u');
/** A left boundary: the text's start, or a neighbour before that is not in the blocking table (consumes nothing; SQL: `lbd`). */
const LEFT_BOUND = `(?<![${NAME_BOUND}])`;
/** A right boundary: the text's end, or a neighbour after that is not in the blocking table (consumes nothing; SQL: `rbd`). */
const RIGHT_BOUND = `(?![${NAME_BOUND}])`;
/** A quotation mark, a reverse solidus, a control character: what JSON escapes; each one space (SQL: _gallery_veil_name_hit). */
const ESCAPED = new RegExp(String.raw`["\\\x00-\x1f]`, 'g');
/** The bracketed qualifier(s) a name ends with: 'Thieves' guild (powerful)' is 'Thieves' guild'. */
const QUALIFIER = /(?:[ \t]*[([][^()[\]]*[)\]])+[ \t]*$/;
/** In the place of an open name cut out of a text: the Kelvin sign, which no prepared text holds (it is written K) and the blocking table lacks (a boundary). */
const CUT = '\u212a';

/** @type {Map<string, string>} a character -> its needle: the bracket of its case class, A-Z aside (a text made ready has none) */
const CASE_NEEDLE = new Map();
/** @type {Map<string, string>} a character -> the first of its case class */
const CASE_FIRST = new Map();
for (const g of NAME_CASE.split(' ')) {
  const first = Array.from(g)[0];
  const others = g.replace(/[A-Z]/g, '');
  for (const ch of Array.from(g)) { CASE_NEEDLE.set(ch, Array.from(others).length > 1 ? `[${others}]` : others); CASE_FIRST.set(ch, first); }
}
CASE_NEEDLE.set('_', '_?');
CASE_NEEDLE.set('=', '(?:ss|[\u00df\u1e9e])');

/**
 * THE NEIGHBOUR AS WRITTEN: each padded character (NAME_PAD) between two spaces, in a text that holds a character outside
 * ASCII; called by the name search alone, before its preparation (nameFold, madeReady). SQL twin: _gallery_veil_name_pad.
 * @param {string} t @returns {string}
 */
export const namePad = (t) => (NON_ASCII.test(t) ? t.replace(PAD_ANY, ' $& ') : t);

/**
 * THE PREPARATION of a text that holds a character outside ASCII: NFKD, the combining marks U+0300 to U+036F removed.
 * No text is ever case-mapped. SQL twin: _gallery_veil_name_prep.
 * @param {string} t @returns {string}
 */
export function namePrep(t) {
  if (!NON_ASCII.test(t)) return t;
  return t.replace(SKEW_ANY, c => NAME_SKEW[c]).replace(/[\uff02\uff3c\ufe68]/g, ' ').normalize('NFKD').replace(/[\u0300-\u036f]+/g, '');
}

/**
 * THE FOLD OF A NAME: padded, prepared, A-Z lowered by an explicit map, every run of separators one '_', none at either end.
 * SQL twin: _gallery_veil_name_fold (the same string for every input; the guard asks every character of the basic plane).
 * @param {unknown} t @returns {string}
 */
export const nameFold = (t) => asciiLower(namePrep(namePad(String(t ?? '')))).replace(SEP_RUN, '_').replace(/^_+|_+$/g, '');

/**
 * A text made ready for the search (THE FOLD of a text): padded, prepared, A-Z lowered, every run of separators one '_'. The
 * other letters keep their case, which is the needle's. SQL twin: _gallery_veil_name_ready (which also cuts the open
 * names out; here buildNameSearch does).
 * @param {string} t @returns {string}
 */
const madeReady = (t) => asciiLower(namePrep(namePad(t))).replace(SEPQ_RUN, '_');

/** The needle of a folded name, for a text made ready: each letter that has another case outside A-Z the bracket of its class, each '_' one '_' or none. @param {string} f */
const needleOf = (f) => Array.from(f.replace(/[\u00df\u1e9e]/g, 'ss').replace(/ss/g, '=')).map(ch => CASE_NEEDLE.get(ch) ?? ch).join('');
/** The letters of a folded name, in one case and with no separator: two names are one where these are equal. @param {string} f */
const lettersOf = (f) => Array.from(f).map(ch => CASE_FIRST.get(ch) ?? ch).join('').replace(/\u00df/g, 'ss').replace(/_/g, '');
/** Code point order (SQL: collate "C"). @param {string} a @param {string} b @returns {number} */
function byCodePoint(a, b) {
  const x = Array.from(a); const y = Array.from(b);
  for (let i = 0; i < x.length && i < y.length; i += 1) {
    const d = /** @type {number} */ (x[i].codePointAt(0)) - /** @type {number} */ (y[i].codePointAt(0));
    if (d) return d;
  }
  return x.length - y.length;
}

/**
 * @typedef {object} NameSearch
 * @property {string|null} pattern  the pattern a prepared text matches when it holds a hidden name (SQL: `p`, the same string)
 * @property {string[]} raws        the names that are separators only: searched as written
 * @property {string[]} blank       the open names that hold a hidden name and are not one, as patterns, longest first
 * @property {(t: string) => boolean} hit    one string or key holds a hidden name
 * @property {(v: unknown) => boolean} holds some key or string of the value, at any depth, holds one
 */

/**
 * THE SEARCH, built once a projection from every name of the houses removed whole and every open name. A name's forms:
 * itself, and itself without its bracketed qualifier. THE BOUNDARY (COHERENCE-VEIL-12; V8-1): where an end of a name is
 * in the blocking table (NAME_BOUND), the neighbour on that side must not be; asked by a lookbehind and a lookahead,
 * which consume nothing. SQL twin: _gallery_veil_name_search.
 * @param {Iterable<unknown>} names @param {Iterable<unknown>} opens @returns {NameSearch|null}
 */
export function buildNameSearch(names, opens) {
  /** @type {Set<string>} */
  const folds = new Set();
  /** @type {Set<string>} */
  const rawSet = new Set();
  for (const n of names) {
    if (typeof n !== 'string' || n === '') continue;
    const pn = namePrep(namePad(n));
    const f = nameFold(pn);
    if (f === '') rawSet.add(n); else folds.add(f);
    if (/[)\]]/.test(pn)) {
      const bare = nameFold(pn.replace(QUALIFIER, ''));
      if (bare !== '') folds.add(bare);
    }
  }
  if (!folds.size && !rawSet.size) return null;
  /** @param {string} f */
  const ends = (f) => { const cs = Array.from(f); return { lb: BOUND_END.test(cs[0]), rb: BOUND_END.test(cs[cs.length - 1]) }; };
  const forms = [...folds].sort(byCodePoint).map(f => ({ f, ...ends(f), needle: needleOf(f) }));
  const letters = new Set(forms.map(h => lettersOf(h.f)));
  /** @type {string[]} */
  const parts = [];
  for (const [lb, rb] of [[true, true], [true, false], [false, true], [false, false]]) {
    const alt = forms.filter(h => h.lb === lb && h.rb === rb).map(h => h.needle).join('|');
    if (alt === '') continue;
    parts.push(`${lb ? LEFT_BOUND : ''}(?:${alt})${rb ? `(?:e?s)?${RIGHT_BOUND}` : ''}`);
  }
  const pattern = parts.length ? parts.join('|') : null;
  const re = pattern === null ? null : new RegExp(pattern, 'u');
  /** @type {Map<string, string>} the fold of an open name that holds a hidden one and is not one -> its letters */
  const held = new Map();
  if (re) {
    for (const o of opens) {
      if (typeof o !== 'string' || o === '') continue;
      const po = madeReady(o.replace(/"/g, ' '));
      if (!re.test(po)) continue;
      const f = nameFold(po);
      if (f !== '' && !letters.has(lettersOf(f))) held.set(f, lettersOf(f));
    }
  }
  const blank = [...held.entries()]
    .sort(([fa, ka], [fb, kb]) => (Array.from(kb).length - Array.from(ka).length) || byCodePoint(ka, kb) || byCodePoint(fa, fb))
    .map(([f]) => { const e = ends(f); return `${e.lb ? LEFT_BOUND : ''}${needleOf(f)}${e.rb ? `(?:e?s)?${RIGHT_BOUND}` : ''}`; });
  const cuts = blank.map(b => new RegExp(b, 'gu'));
  const raws = [...rawSet].sort(byCodePoint);
  /** @param {string} t @returns {boolean} */
  const hit = (t) => {
    if (raws.some(r => t.includes(r))) return true;
    if (!re) return false;
    let ready = madeReady(t.replace(ESCAPED, ' '));
    for (const c of cuts) ready = ready.replace(c, CUT);
    return re.test(ready);
  };
  /** @param {unknown} v @returns {boolean} without a call a level: a value may be thousands of levels deep */
  const holds = (v) => {
    /** @type {unknown[]} */
    const todo = [v];
    while (todo.length) {
      const x = todo.pop();
      if (typeof x === 'string') { if (hit(x)) return true; } else if (Array.isArray(x)) { for (const y of x) todo.push(y); } else if (isRec(x)) {
        for (const k of Object.keys(x)) { if (hit(k)) return true; todo.push(x[k]); }
      }
    }
    return false;
  };
  return { pattern, raws, blank, hit, holds };
}

const NO_FLOOR = Object.freeze(/** @type {string[]} */ ([]));

/**
 * A HIDDEN NAME, ANYWHERE (in place): every key and every string that holds a hidden name leaves the projection (a
 * record loses the key, a list the entry; an entry whose own `id` or `name` is taken leaves its list whole). FLOORS,
 * never asked: the town's own `name`; the `id` and `name` of a house still listed (its `label` where it has no name); a
 * shown power's `faction` and `name`. Walked without a call a level; a container at NAME_WALK_BOUND is not walked: it
 * is withheld whole if it holds a hit at any depth. SQL twin: _gallery_veil_name_sweep.
 * @param {Rec} s @param {NameSearch} search
 */
function sweepHiddenNames(s, search) {
  const { hit, holds } = search;
  /** @type {Map<object, ReadonlyArray<string>>} */
  const floors = new Map([[s, ['name']]]);
  for (const i of Array.isArray(s.institutions) ? s.institutions : []) if (isRec(i)) floors.set(i, str(i.name) !== '' ? ['id', 'name'] : ['id', 'name', 'label']);
  const ps = recAt(s, 'powerStructure');
  for (const f of ps && Array.isArray(ps.factions) ? ps.factions : []) if (isRec(f) && f.hidden !== true) floors.set(f, ['faction', 'name']);
  /** @param {Rec} x @param {string} k @param {boolean} atBound @returns {boolean} the record's own `id` or `name` is taken */
  const taken = (x, k, atBound) => {
    if (!Object.prototype.hasOwnProperty.call(x, k) || (floors.get(x) || NO_FLOOR).includes(k)) return false;
    if (hit(k)) return true;
    const v = x[k];
    return typeof v === 'string' ? hit(v) : !!v && typeof v === 'object' && atBound && holds(v);
  };
  /** @type {Array<{ node: unknown[]|Rec, level: number }>} */
  const todo = [{ node: s, level: 0 }];
  while (todo.length) {
    const { node, level } = /** @type {{ node: unknown[]|Rec, level: number }} */ (todo.pop());
    const below = level + 1 >= NAME_WALK_BOUND;
    if (Array.isArray(node)) {
      let kept = 0;
      for (let i = 0; i < node.length; i += 1) {
        const x = node[i];
        let gone = false;
        if (typeof x === 'string') gone = hit(x);
        else if (Array.isArray(x) || isRec(x)) {
          if (below) gone = holds(x);
          else if (isRec(x) && (taken(x, 'id', level + 2 >= NAME_WALK_BOUND) || taken(x, 'name', level + 2 >= NAME_WALK_BOUND))) gone = true;
          else todo.push({ node: x, level: level + 1 });
        }
        if (!gone) { node[kept] = x; kept += 1; }
      }
      node.length = kept;
    } else {
      const floor = floors.get(node) || NO_FLOOR;
      for (const k of Object.keys(node)) {
        if (floor.includes(k)) continue;
        const x = node[k];
        if (hit(k)) delete node[k];
        else if (typeof x === 'string') { if (hit(x)) delete node[k]; } else if (Array.isArray(x) || isRec(x)) {
          if (!below) todo.push({ node: x, level: level + 1 });
          else if (holds(x)) delete node[k];
        }
      }
    }
  }
}

/**
 * ONE FOLD FOR THE WORDS, BOTH ENGINES, EVERY SCRIPT (COHERENCE-VEIL-11, the seat's read of 212 section 4b): THE NAME
 * SEARCH's own preparation (namePrep: NFKD, the marks U+0300 to U+036F gone), A-Z lowered by an explicit map, each
 * letter outside A-Z written as the first of its case class (NAME_CASE, the one table), the sharp s as 'ss'. Never an
 * engine's own case map: toLowerCase() and PostgreSQL's lower() disagree outside ASCII (a word-final capital sigma, U+0130).
 * SQL twin: _gallery_veil_case_fold (the same string for every input: the guard asks every code point of the basic plane).
 * @param {string} t @returns {string}
 */
export const caseFold = (t) => (NON_ASCII.test(t) ? Array.from(asciiLower(namePrep(t))).map(ch => CASE_FIRST.get(ch) ?? ch).join('') : asciiLower(t)).replace(/\u00df/g, 'ss');

/**
 * THE WORDS, IN BOTH DIRECTIONS, in any case (COHERENCE-VEIL-8: a composer that lower-cases the first letter of what
 * it embeds, legacyGenerator.js :: annotationBody, still embeds it). The text holds one of the pieces (a piece of the
 * source inside the copy), or (COHERENCE-VEIL-10, V7-2) one of the text's own pieces stands inside one of them (a piece
 * of the copy inside the source: a source amended by appending or by a prefix still holds its born wording). The
 * fallback where the record gives a copy no identity; never the first rule. Compared by caseFold (COHERENCE-VEIL-11); a
 * piece whose fold is empty is no piece. SQL twin: _gallery_veil_embeds.
 * @param {unknown} text @param {string[]} pieces @returns {boolean}
 */
const embedsAny = (text, pieces) => {
  if (typeof text !== 'string' || !pieces.length) return false;
  const t = caseFold(text);
  const fp = pieces.map(caseFold).filter(f => f !== '');
  if (fp.some(f => t.includes(f))) return true;
  const fc = secondHomePieces(text).map(caseFold).filter(f => f !== '');
  return fc.some(c => fp.some(f => f.includes(c)));
};

/**
 * THE IMPRESSION GOES BY ITS PERSON (COHERENCE-VEIL-10, V7-2; the chair's record 418): the impression on a person's
 * face goes with THAT PERSON's appearance eye, whole, whatever the appearance now says (before: only where it held a
 * sentence of the appearance as that now stands). Called on a card whose `physical` eye is shut. SQL twin: the
 * impression arm of _gallery_veil_card.
 * @param {Rec} card
 */
export function withholdImpression(card) {
  const pres = card.presentation;
  if (!isRec(pres)) return;
  const next = { ...pres };
  delete next.impression;
  card.presentation = next;
}

/**
 * Is the lasting-effects eye of an annotation's EVENT shut? Its event: the one of the same name (`eventName`; `event`
 * in an older spelling); none, the one of the same type and years (an event renamed since); none at all, every event
 * (closed). SQL twin: the annotation rule of _gallery_veil_second_homes.
 * @param {Rec} a @param {ReadonlyArray<EventSource>} events @returns {boolean}
 */
function annotationEventShut(a, events) {
  const name = str(a.eventName) !== '' ? str(a.eventName) : str(a.event);
  const type = str(a.eventType) !== '' ? str(a.eventType) : str(a.type);
  const byName = events.filter(e => name !== '' && e.name === name);
  if (byName.length) return byName.some(e => e.shut);
  const years = a.yearsAgo;
  const byType = events.filter(e => type !== '' && e.type === type && typeof years === 'number' && typeof e.yearsAgo === 'number' && e.yearsAgo === years);
  if (byType.length) return byType.some(e => e.shut);
  return events.some(e => e.shut);
}

/**
 * What each second home's source IS and said, read BEFORE the eyes run. COHERENCE-VEIL-10 (V7-2), by identity: EVERY
 * tie with its two eyes (a copy is its tie's whether that tie is shut or open), whether ANY current tension's
 * description eye is shut, every event with its lasting-effects eye; and for the words, the pieces of every shut
 * string of an event. SQL twin: _gallery_veil_sources.
 * @param {Rec} s
 * @param {(kind: string, id: string, eye: string) => boolean} eyeShut
 * @param {(s: Rec, kind: string) => Rec[]} cardsOf
 * @param {(kind: string, card: Rec) => string} idOf the veil's address of a card of a kind
 */
export function secondHomeSources(s, eyeShut, cardsOf, idOf) {
  /** @type {TieSource[]} */
  const ties = cardsOf(s, 'relationship').map((card) => {
    const id = idOf('relationship', card);
    return { card: { npc1Name: card.npc1Name, npc2Name: card.npc2Name, typeName: card.typeName, description: card.description, tension: card.tension },
      desc: eyeShut('relationship', id, 'description'), tension: eyeShut('relationship', id, 'tension') };
  });
  const tensionShut = cardsOf(s, 'tension').some(card => eyeShut('tension', idOf('tension', card), 'description'));
  /** @type {Map<string, { desc: boolean, fn: boolean }>} house name -> its shut eyes */
  const houses = new Map();
  for (const card of cardsOf(s, 'institution')) {
    const name = str(card.name);
    if (!name) continue;
    const id = idOf('institution', card);
    const h = houses.get(name) || { desc: false, fn: false };
    if (eyeShut('institution', id, 'description')) h.desc = true;
    if (eyeShut('institution', id, 'function')) h.fn = true;
    houses.set(name, h);
  }
  // COHERENCE-VEIL-8 (T1): the pieces of every shut string of an event (its description, lasting effects, hooks)
  /** @type {string[]} */
  const eventPieces = [];
  /** @type {EventSource[]} */
  const events = [];
  for (const card of cardsOf(s, 'event')) {
    const id = idOf('event', card);
    events.push({ name: str(card.name), type: str(card.type), yearsAgo: card.yearsAgo, shut: eyeShut('event', id, 'lastingEffects') });
    if (eyeShut('event', id, 'description')) secondHomePieces([card.description, card.desc], eventPieces);
    if (eyeShut('event', id, 'lastingEffects')) secondHomePieces(card.lastingEffects, eventPieces);
    if (eyeShut('event', id, 'hooks')) secondHomePieces(card.plotHooks, eventPieces);
  }
  return { ties, tensionShut, houses, eventPieces, events };
}

/** @param {TieSource} t @param {string[]} out @returns {string[]} */
function tiePieces(t, out) {
  if (t.desc) secondHomePieces(t.card.description, out);
  if (t.tension) secondHomePieces(t.card.tension, out);
  return out;
}

/**
 * Withhold every second home whose source an eye shut (in place, on applyVeil's own clone).
 * @param {Rec} s
 * @param {ReturnType<typeof secondHomeSources>} src
 * @param {Set<string>} gone names of houses removed whole
 * @param {ReadonlyArray<string>} openNames the names of the houses the projection still lists
 * @param {Readonly<Record<string, ReadonlyArray<string>>>} houseFields the house's eyes and the keys each removes
 * @param {Set<string>} [births] the catalogue identities of the houses removed whole (COHERENCE-VEIL-9)
 * @param {Set<string>} [labels] the label of each house removed whole that has no name (COHERENCE-VEIL-10, V7-9)
 */
export function withholdSecondHomes(s, src, gone, openNames, houseFields, births = new Set(), labels = new Set()) {
  // COHERENCE-VEIL-10 (V7-2): THE COMPOSED HOMES, BY IDENTITY (the header states each rule)
  const ties = src.ties;
  if (ties.length) {
    /** @type {string[]} THE STORED WORDING: what the copies that go said (the tie's text as born) */
    const stored = [];
    // prominentRelationship is ONE tie's copy (settlementNarrative.js :: genRelNarrative): its tie is the one with the
    // same two ends and type, or whose text a copy still equals; a copy that names no tie follows every tie's eyes
    const pr = s.prominentRelationship;
    if (isRec(pr)) {
      const named = ties.filter(t => (str(t.card.npc1Name) === str(pr.npc1) && str(t.card.npc2Name) === str(pr.npc2) && str(t.card.typeName) === str(pr.type))
        || (str(pr.full) !== '' && t.card.description === pr.full) || (str(pr.tension) !== '' && t.card.tension === pr.tension));
      const own = named.length ? named : ties;
      const ds = own.some(t => t.desc);
      const ts = own.some(t => t.tension);
      secondHomePieces([ds ? pr.full : null, ts ? pr.tension : null], stored);
      const next = { ...pr };
      // the phrasing goes with either eye, unless it IS the tension as that now stands with its eye open
      if (own.some(t => t.tension || (t.desc && !(typeof pr.phrasing === 'string' && t.card.tension === pr.phrasing)))) delete next.phrasing;
      if (ds) delete next.full;
      if (ts) delete next.tension;
      s.prominentRelationship = next;
    }
    // pressureSentence: (1) BY ITS ENDS, the tie whose two ends it names, as the phrasing; (2) NO OTHER ACCOUNT (it
    // names no tie's two ends, the town is under no stress, it is not recentConflict): any tie's shut eye; (3) THE
    // WORDS, both directions, current and stored (narrativeGenerator.js :: generatePressureSentence)
    const ps = s.pressureSentence;
    if (typeof ps === 'string') {
      const naming = ties.filter(t => str(t.card.npc1Name) !== '' && str(t.card.npc2Name) !== '' && ps.includes(str(t.card.npc1Name)) && ps.includes(str(t.card.npc2Name)));
      const byEnds = naming.some(t => t.tension || (t.desc && t.card.tension !== ps));
      const stress = s.stress;
      const stressed = Array.isArray(stress) ? stress.some(x => isRec(x) && str(x.type) !== '') : (isRec(stress) && str(stress.type) !== '');
      const power = recAt(s, 'powerStructure');
      const recent = !!power && typeof power.recentConflict === 'string' && power.recentConflict === ps;
      if (byEnds || (ties.some(t => t.desc || t.tension) && !naming.length && !stressed && !recent)
        || embedsAny(ps, [...ties.flatMap(t => tiePieces(t, [])), ...stored])) delete s.pressureSentence;
    }
  }
  // history.siegeNarrative tells of a current tension (siegeCapability.js: the first one's description): it goes with
  // ANY current tension whose description eye is shut, whatever that tension now says
  const hist = recAt(s, 'history');
  if (hist && src.tensionShut) delete hist.siegeNarrative;
  // the legacy annotation is built from ITS EVENT's first lasting effect (legacyGenerator.js :: annotationBody): it goes
  // with that event's lasting-effects eye (annotationEventShut); and by the words (T1), both directions: a shut string of
  // any event inside it. The entry's event name, type and years, the event card's floor, stay
  if (hist && Array.isArray(hist.legacyAnnotations) && (src.eventPieces.length || src.events.some(e => e.shut))) {
    hist.legacyAnnotations = hist.legacyAnnotations.map((a) => {
      if (!isRec(a) || !(annotationEventShut(a, src.events) || embedsAny(a.annotation, src.eventPieces))) return a;
      const next = { ...a };
      delete next.annotation;
      return next;
    });
  }

  const def = recAt(recAt(s, 'defenseProfile') || {}, 'institutions');
  if (def) {
    for (const [slot, rows] of Object.entries(def)) {
      if (!Array.isArray(rows)) continue;
      def[slot] = rows.filter(r => !(isRec(r) && gone.has(str(r.name)))).map((r) => {
        const h = isRec(r) ? src.houses.get(str(r.name)) : undefined;
        if (!h || (!h.desc && !h.fn)) return r;
        const next = { ...r };
        if (h.desc) for (const k of houseFields.description) delete next[k];
        if (h.fn) for (const k of houseFields.function) delete next[k];
        return next;
      });
    }
  }
  if (!gone.size && !births.size && !labels.size) return;
  // COHERENCE-VEIL-9: the houses still listed that the engine read (native: priorityHelpers.js :: getInstitutionNames
  // stamps nativeSemanticNames, so a custom house is in neither list nor any flag), each with its identity
  const accountants = (Array.isArray(s.institutions) ? s.institutions : []).filter(isRec).filter(i => !isCustomHouse(i))
    .map(i => ({ cid: typeof i.catalogId === 'string' && i.catalogId !== '' ? i.catalogId : null, low: asciiLower(str(i.name)) }));
  // THE TWO DERIVED NAME LISTS, BY POSITIVE ACCOUNT (REVIEW-VEIL-6's twelfth; the chair's ruling on PART 9's limits):
  // the engine's lower-cased roster, stamped once at birth, keeps an entry only where a native house still listed
  // accounts for it, each house for one entry, in the list's order: a stamped house by its catalogue identity (the fold
  // of the name it was born with), an unstamped one by its name. A hidden house's birth name cannot outlive a rename,
  // and no difference between two engines' case folds can leave a spelling behind. The chair's ruling (b): a flag only a
  // house removed whole raised reads false (never true where it was false)
  const listed = openNames.map(n => n.toLowerCase());
  const econF = recAt(s, 'economicState');
  for (const inst of [recAt(recAt(econF || {}, 'compound') || {}, 'inst'), recAt(recAt(recAt(econF || {}, 'safetyProfile') || {}, 'compound') || {}, 'inst')]) {
    if (!inst) continue;
    if (Array.isArray(inst.names)) {
      const used = accountants.map(() => false);
      inst.names = inst.names.filter((x) => {
        if (typeof x !== 'string') return false;
        const k = accountants.findIndex((a, j) => !used[j] && (a.cid !== null ? a.cid === foldName(x) : a.low === x));
        if (k < 0) return false;
        used[k] = true;
        return true;
      });
    }
    for (const [flag, words] of Object.entries(HOUSE_FLAG_NAMES)) {
      if (inst[flag] === true && !listed.some(l => words.some(w => l.includes(w)))) inst[flag] = false;
    }
  }
  // A chain names a house by the ENGINE's processor match, not only by the card's name (computeActiveChains.js ::
  // fuzzyProcessorMatch: the lower-cased name holds the pattern's first processorPrefix characters), so a house
  // hidden whole as 'Black market bazaar' is processing name 'Black market'. A processing name that a house hidden
  // whole answers to, and no house left open does, is that house's name.
  /** @param {string} name @param {string} x @returns {boolean} */
  const answers = (name, x) => name === x || name.toLowerCase().includes(x.toLowerCase().slice(0, SECOND_HOME_LIMITS.processorPrefix));
  // COHERENCE-VEIL-9: a house answers by its birth name too (a stamped house, by its catalogue identity), and an open
  // house answers as the engine reads it: a stamped one by its identity, an unstamped one by its name
  const openHouses = (Array.isArray(s.institutions) ? s.institutions : []).filter(isRec)
    .map(i => (typeof i.catalogId === 'string' && i.catalogId !== '' ? { cid: i.catalogId, name: null } : { cid: null, name: str(i.name) }));
  /** @param {unknown} x @returns {boolean} */
  const hiddenName = (x) => ([...gone].some(g => answers(g, str(x))) || [...births].some(b => answersByBirth(b, str(x))))
    && !openHouses.some(o => (o.cid !== null ? answersByBirth(o.cid, str(x)) : answers(/** @type {string} */ (o.name), str(x))));
  /** every name of a house removed whole: its own, its label where it has no name, the one it was born with, and each processing name only it answers to */
  const named = new Set([...gone, ...labels, ...births]);
  const econ0 = recAt(s, 'economicState');
  for (const c of (econ0 && Array.isArray(econ0.activeChains) ? econ0.activeChains : []).filter(isRec)) {
    for (const x of Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []) if (typeof x === 'string' && hiddenName(x)) named.add(x);
  }
  // COHERENCE-VEIL-10 (V7-1): THE NAME SEARCH, built once. The open names: every house still listed (its name, its label
  // where it has no name, its catalogue identity) and every power shown (its `faction`, its `name`): one that holds a
  // hidden name is cut out of a text before the search (an open name is not the hidden one)
  const ps = recAt(s, 'powerStructure');
  const search = buildNameSearch(named, [
    ...(Array.isArray(s.institutions) ? s.institutions : []).filter(isRec).map(i => (str(i.name) !== '' ? str(i.name) : str(i.label))),
    ...openHouses.flatMap(o => (o.cid !== null ? [o.cid] : [])),
    ...(ps && Array.isArray(ps.factions) ? ps.factions : []).filter(f => isRec(f) && f.hidden !== true).flatMap(f => [str(f.faction), str(f.name)]),
  ]);
  /** @param {unknown} v @returns {boolean} some key or string of the value names a house removed whole */
  const names = (v) => !!search && search.holds(v);
  const sp0 = recAt(econ0 || {}, 'safetyProfile');
  // N4: the name inside the economy's fixed prose: an income source whose label names it is withheld whole, one
  // whose description names it loses the description, the safety profile's description that names it goes
  if (econ0 && Array.isArray(econ0.incomeSources)) {
    econ0.incomeSources = econ0.incomeSources.filter(r => !(isRec(r) && names(r.source))).map((r) => {
      if (!isRec(r) || !names(r.desc)) return r;
      const next = { ...r };
      delete next.desc;
      return next;
    });
  }
  if (sp0 && names(sp0.safetyDesc)) delete sp0.safetyDesc;
  const econ = recAt(s, 'economicState');
  if (econ && Array.isArray(econ.activeChains)) {
    econ.activeChains = econ.activeChains.flatMap((c) => {
      if (!isRec(c)) return [c];
      if (gone.has(str(c.label))) return [];
      const next = { ...c };
      if (Array.isArray(c.processingInstitutions)) {
        const kept = c.processingInstitutions.filter(x => !hiddenName(x));
        if (c.processingInstitutions.length && !kept.length) return [];
        next.processingInstitutions = kept;
      }
      if (isRec(c.dependency) && hiddenName(c.dependency.institution)) delete next.dependency;
      return [next];
    });
  }
  if (Array.isArray(s.simulationTrace)) {
    s.simulationTrace = s.simulationTrace.flatMap((e) => {
      if (!isRec(e)) return [e];
      if (Object.entries(e).some(([k, v]) => k !== 'causes' && k !== 'downstreamEffects' && names(v))) return [];
      const next = { ...e };
      for (const k of ['causes', 'downstreamEffects']) {
        const list = e[k];
        if (Array.isArray(list)) next[k] = list.filter(x => !names(x));
      }
      return [next];
    });
  }
  // the chair's ruling (a), in COHERENCE-VEIL-10's form: last, every key and every string of the projection that names
  // a house removed whole leaves it, the floors aside. SQL twin: _gallery_veil_name_sweep.
  if (search) sweepHiddenNames(s, search);
}

/** The groupings that hide what the criminal income row is built from (its label's list, its sentence's figure). */
const CRIMINAL_INCOME_SOURCES = Object.freeze(['block:defense.criminalStructure', 'block:power.criminalUnderside']);

/**
 * The chair's ruling (c), COHERENCE-VEIL-8: the criminal income row (economicState.incomeSources[] with
 * `isCriminal`) is built from what two groupings hide: its label from safetyProfile.criminalInstitutions, its
 * sentence from safetyProfile.blackMarketCapture. Where either grouping is shut it is withheld whole (in place, on
 * applyVeil's own clone). SQL twin: migration 212 :: _gallery_veil_apply.
 * @param {Rec} s @param {ReadonlyArray<string>} groupings
 */
export function withholdCriminalIncome(s, groupings) {
  const econ = recAt(s, 'economicState');
  if (!econ || !Array.isArray(econ.incomeSources) || !groupings.some(g => CRIMINAL_INCOME_SOURCES.includes(g))) return;
  econ.incomeSources = econ.incomeSources.filter(r => !(isRec(r) && r.isCriminal === true));
}
