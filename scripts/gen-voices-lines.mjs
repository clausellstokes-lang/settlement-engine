#!/usr/bin/env node
/**
 * scripts/gen-voices-lines.mjs — THE VOICES' LINES, LOADED ONCE FROM THE WRITER'S TWO TSVs (S-G1; the eleventh chair's
 * ruling E28 point 10: "the lines are data … generated ONCE from the two TSVs by a small script you write and commit").
 *
 *   node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv>
 *
 * The two TSVs are VOICES-LINES' (`docs/chair/2026-11-27/eleventh/survey/lines/` on the chair's record branch, at
 * 4116f40b2): 197 said lines in four tempers and 40 liar lines. The script writes `src/data/voices/saidLines.js` and
 * `src/data/voices/liarLines.js` (frozen data, no logic), each line with its id, its four versions, its speaker rule and
 * its `needs`. The TSVs are the source of the FIRST load only: after it, the two data files are the lines' home (a line
 * re-worded there is re-banked by the id guard's own door, `scripts/stable-pick-ids-door.mjs`).
 *
 * THE `needs` WORDS (ruling 10, as the chair's rulings G1-1 and G1-2 shaped it): each word is answered ONE of three ways,
 * per version (a word written with tempers, `(W,T)`, holds for those versions only; a bare word for all four):
 *   an ATOM      a town-level noun, through `NEEDS_ATOM` to one atom of `facts/factVocabulary.js` (asked of the record
 *                through the door; checked declarable by the data test): the version's `needs`;
 *   the CARD     what KIND of house the card is (`domain/voices/cardWords.js :: CARD_WORDS`, answered by the card's own
 *                catalogue id): the version's `card`;
 *   NOWHERE      the version's `ineligible` (kept, banked by the id guard, never spoken; another line is taken).
 * A word naming the tension's TYPE (`TYPE_STATE`) is a STATE, not a need: the line is filed under that state. No atom is
 * invented. The `{good}` slot's "needs: named good" is a slot rule (the leaf refuses a version whose slot has no value).
 *
 * Deterministic: the same two TSVs write the same two files, byte for byte.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { REGISTERED_WORDS, newWordsNamedIn, thingsNamedIn } from '../src/domain/facts/registeredWords.js';
import { CARD_NOT_WORDS, CARD_WORDS, POWER_WORDS } from '../src/domain/voices/cardWords.js';
import { assertDeclarable } from '../src/domain/facts/factVocabulary.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SAID_OUT_REL = 'src/data/voices/saidLines.js';
export const LIAR_OUT_REL = 'src/data/voices/liarLines.js';

/** The four tempers in the TSVs' column order, by the stored disposition each is keyed on. */
export const TEMPERS = Object.freeze(['welcoming', 'transactional', 'cautious', 'dismissive']);
const TEMPER_LETTER = Object.freeze({ W: 'welcoming', T: 'transactional', C: 'cautious', D: 'dismissive' });

/**
 * THE MAP, WHOLE (each a town-level noun the record answers through the one door). PLAUSIBLE readings, listed for the
 * chair: `streets (a village or larger)` → the tier; `guards (a watch, garrison or militia)` → the vocabulary's ONE
 * composite of a standing guard; `collectors (the creditor's agents)` and `preachers (the new faith's teachers)` → the
 * crisis's own body (its comment names "the creditor's agent; a second congregation"); `charms sold (a seller of magic)`
 * → a house offering enchanting; `a hearing` → a court sits on the live roster.
 */
export const NEEDS_ATOM = Object.freeze({
  streets: 'tier: ≥ village',
  guards: 'guardPresence',
  collectors: 'crisis body: indebted',
  preachers: 'crisis body: religious_conversion',
  'charms sold': 'enchanting',
  'a hearing': 'court sits',
  // the chair's ruling G1-1 (2): the vocabulary holds the food source (`foodSources`)
  livestock: 'livestock',
});

/**
 * THE TENSION TYPES THAT ARE STATES OF THEIR OWN (the chair's ruling G1-1 (3)): a line whose `needs` names the tension's
 * TYPE is filed under its own state, keyed on the type by the leaf (`cardsOf.js :: TENSION_GROUP`): a key, not an atom.
 */
export const TYPE_STATE = Object.freeze({
  'type: corruption_scandal': 'graft',
  'type: infiltration_fear or occupation_legacy': 'mistrust',
});

/**
 * THE NOUNS A VERSION NAMES (the design's §4: "a SAID line … declares its NOUNS like any line"): the generator asks the
 * rule book (`facts/registeredWords.js`, the presumed-things walker's) which registered things each version's text and
 * each liar line's DM note name, and declares the answer the rule book gives that thing, by this map alone. A thing the
 * map does not name stops the generator (a new noun is a ruling, never a guess). Each entry is an atom or band of the
 * vocabulary the rule book itself lists for the thing.
 */
export const NOUN_DECLARATION = Object.freeze(/** @type {Record<string, { needs?: string[], excludes?: string[], byWord?: Record<string, string[]> }>} */ ({
  watch: { needs: ['watch'] },
  // a line that names the SOLDIERS declares the soldiers (the rule book's own sufficient atom, and the office class's):
  // the war's lines ("war and occupation both guarantee soldiers"); any other armed force, a standing guard
  armedForce: { needs: ['guardPresence'], byWord: { soldiers: ['soldiers'] } },
  streets: { needs: ['tier: ≥ village'] },
  openTrade: { excludes: ['crisis: under_siege'] },
  market: { needs: ['market'] },
  'house: smuggling': { needs: ['house: smuggling'] },
}));

/**
 * THE CHANGED WORDS (the chair's rulings G1-3 (3) and G1-4 of 2026-11-28, each on the owner's veto list as changed words):
 * a false hit of the presumption-classes walker, or a thing answered nowhere that a plain rewording keeps (the four candle
 * versions: "candles" out, the late light kept, each a different remark, L-4), is cured by the LINE's words, never by the
 * rule book. Keyed `<line id> <temper | inTruth>`. The TSV's own text must be `from` (a TSV that changed stops the
 * generator); `drops` names the writer's needs words the old text alone called for.
 */
export const CHANGED_WORDS = Object.freeze(/** @type {Record<string, { from: string, to: string, drops?: string[], fromSha256?: string, toSha256?: string }>} */ ({
  'SAID.inst.workshop-ordinary.4 cautious': { from: 'Prices are hard to judge these days.', to: 'Prices are hard to guess these days.' },
  'SAID.trad.feast.3 welcoming': { from: 'Neighbours lend each other pots and pans for the feast.', to: 'Neighbours lend each other pans and dishes for the feast.' },
  'SAID.person.powerface.1 welcoming': { from: 'People come with favours to ask, and most get a hearing.', to: 'People come with favours to ask, and most are heard.' },
  'LIE.front.trade.1 welcoming': { from: 'Anyone may look at the books, and plenty have.', to: 'Anyone may look at the accounts, and plenty have.' },
  'LIE.front.trade.1 cautious': { from: 'The books here have never had a question asked of them.', to: 'The accounts here have never had a question asked of them.' },
  'LIE.front.trade.1 inTruth': { from: 'the books hide the criminal house\'s money passing through', to: 'the accounts hide the criminal house\'s money passing through' },
  'SAID.inst.hall-ordinary.5 transactional': { from: 'Candles burn here long after dark, and someone pays for them.', to: 'The lights burn here long after dark, and someone pays for them.', drops: ['candles'] },
  'SAID.inst.inn-ordinary.2 transactional': { from: 'Late nights burn a lot of candles.', to: 'Keeping the lamps lit late costs a fair bit.', drops: ['candles'] },
  'SAID.trad.vigil.3 transactional': { from: 'Candles for the vigil cost more each year.', to: 'Lighting the vigil costs more each year.' },
  'SAID.trad.vigil.3 welcoming': { from: 'Families take turns keeping the candles lit.', to: 'Families take turns tending the lights all night.' },
  // THE OLD RE-WORDINGS OF THE SECOND WRITERS (the chair's G1-8 and G1-9, 2026-11-28: every row accepted), where an OLD pool's
  // versions broke a formula cap (one opening a temper's hint, "Some", "Nobody knows" …): A's 18
  // (`survey/lines-2/OLD-REWORD-A.tsv` at a093e4913) and B's 6 (`OLD-REWORD-B.tsv` at 9b172584e). Both texts carry their
  // sha256, checked by the generator, so a copying slip stops it and the id guard re-banks exactly these.
  'SAID.tension.arcane.2 welcoming': { from: 'Some neighbours still stand up for those who work magic.', to: 'Neighbours still stand up for those who work magic.', fromSha256: '404cdb1111e745d39cfcf016dac0f8060055eb70d6e7afca4f527d60b8929671', toSha256: 'dc6429ba00a4f6c01addd1c12cff48b8cd1f6ea7ebddf031bfed1053f0520661' }, // OLD-REWORD-A.tsv
  'SAID.tension.arcane.3 cautious': { from: 'Nobody\'s sure what\'s causing all the bad luck.', to: 'What\'s causing all the bad luck isn\'t clear.', fromSha256: '5ef4ecb74fcf7c01a7c8f2d7743603d636a280f75a2ce86a0e715de35ebf0373', toSha256: 'aef82b01b27377cef99554409f8bea3cf91213bb3ffc09c8032f339b174db233' }, // OLD-REWORD-A.tsv
  'SAID.tension.calamity.1 welcoming': { from: 'Everyone knows what to grab first if it comes.', to: 'Every family knows what to grab first if it comes.', fromSha256: '567301304330d4d6cfbb4921ff32a84f104f5a59ab96a837b7b318a900ce6f64', toSha256: 'f6d3b29a1b847dc0ab45af318404da0cfcb617a5130f9750477265fb91ce1cc1' }, // OLD-REWORD-A.tsv
  'SAID.tension.crime.6 cautious': { from: 'Nobody\'s sure which officials can still be trusted.', to: 'It\'s hard to tell which officials can still be trusted.', fromSha256: 'ca5ca08e4cec77200171bb7adbf53c976f36f476f6f013b42f5ec2c87447e7d0', toSha256: 'e8ceb1fccb3c4a7f5c4f77078e47564027d7dbc031500b162d9a15d14eb65ee6' }, // OLD-REWORD-A.tsv
  'SAID.tension.faith.2 welcoming': { from: 'Some still go to every rite, just to keep the peace.', to: 'Families still go to every rite, just to keep the peace.', fromSha256: 'f64e8d9bed57fd44088e3aa61728b1734dde4962c47952677a2a198b2a836024', toSha256: '23b18935fa10dd93529111a35885d11b5fcf745ebd2b19a721c6dc98a239d62c' }, // OLD-REWORD-A.tsv
  'SAID.tension.neighbours.6 cautious': { from: 'Nobody\'s sure who might be passing on what\'s said.', to: 'Anyone might be passing on what\'s said.', fromSha256: '57112d4872445e0e593326fedcf0742fb0edb4d2fa2aa9892b89f50fde692e5f', toSha256: '400e5ce0d8f7a50e1cd15d61e5f06001670799bbed99fcd4422c9fd196030743' }, // OLD-REWORD-A.tsv
  'SAID.tension.rule.5 cautious': { from: 'Some quiet meetings at night have the older people worried.', to: 'Quiet meetings at night have the older people worried.', fromSha256: 'cd16e2092752085e9d19628895f542c7909cfe1b645e125fd1b6d5bf02bd7b05', toSha256: '2a7548c98e2a41cb9c8cee93229f573415134ec9621e9cd79a8369c32b3cf556' }, // OLD-REWORD-A.tsv
  'SAID.tension.threat.3 cautious': { from: 'Nobody knows how close the danger really is.', to: 'The danger may be closer than it looks.', fromSha256: '7c2ef101ed055098ab964fb1dd2e281636cdaa05b0d135d235c20caa1cbe19b7', toSha256: '16a02c1f98db40d106a19d76b7ae4e534a60ca97bb4025bf336a6f2aa10bed8b' }, // OLD-REWORD-A.tsv
  'SAID.tension.trade.2 welcoming': { from: 'Some sellers still give the old price to old friends.', to: 'Sellers still give the old price to old friends.', fromSha256: '48dd6f2f33a1322ec2a331c5aed1bdbfa540ce490139356379ce9c6fab6fbc7c', toSha256: '79dced5ff0b0235db719782045e5a0d1fd73b81cf1e403c235d2aeba02665087' }, // OLD-REWORD-A.tsv
  'SAID.crisis.faith.2 cautious': { from: 'Some who listen to the preachers go quiet at home.', to: 'Those who listen to the preachers often go quiet at home.', fromSha256: 'ebd096bf0474d18b94465456a5663b91183515a4e7053ba5b40752f4060ff541', toSha256: 'edd97519b2579b8cf468f5f39594b59ca685991a047c2ad6876d21ae2e32c28e' }, // OLD-REWORD-A.tsv
  'SAID.crisis.newcomers.3 welcoming': { from: 'Some families have given the newcomers work, and it\'s working out.', to: 'Families who gave the newcomers work find it\'s working out.', fromSha256: 'b32bf683800680c9c53f514fd4de08215167196a5a16d0f67163ea8799a14f74', toSha256: '4128e7c0cc2571b7ddccb62db9973cc73d79c397fc0fad27508c9c8f6d31149e' }, // OLD-REWORD-A.tsv
  'SAID.crisis.newcomers.1 cautious': { from: 'Nobody knows most of the new faces.', to: 'Most of the new faces are strangers to everyone.', fromSha256: '6c44ffccd4b1b2f671eff06d89ef4a7929f78942c22a9caf15d06b7dc8e6913f', toSha256: '0fbbce9f4b02dcc90f2fd72dea30fdb8761413ed884204084de397c6cf3fcc52' }, // OLD-REWORD-A.tsv
  'SAID.crisis.newcomers.3 cautious': { from: 'Nobody\'s sure how long the newcomers mean to stay.', to: 'How long the newcomers mean to stay hasn\'t been said.', fromSha256: 'c4ff2d11b595284292b6b15aead3dcc9c226e1f002047bbb948e8a6cc61fe906', toSha256: 'dc14605432db9a7c9c8df37ebe2d04bb6bec858fbc90741e878d7b7a0edf57e3' }, // OLD-REWORD-A.tsv
  'SAID.crisis.raids.3 cautious': { from: 'Some tracks near the houses are bigger than anyone likes.', to: 'The tracks near the houses are bigger than anyone likes.', fromSha256: '5c5e4119cc701d37716ed256934d77464b37843298ecb02edd27b4c0ba789a96', toSha256: '60eca693667f92c4ca751f46428ddb0a78c0bf32d7b8dd100bb716fb2c857628' }, // OLD-REWORD-A.tsv
  'SAID.crisis.rising.2 cautious': { from: 'Some doors only open to a known knock.', to: 'Doors only open to a known knock now.', fromSha256: '93e35ed5acf0ddb128006c78a7d35cc72091e2da846bf49acffb9a96afbeb1b4', toSha256: '4d50c3b0b85a17c33ae050adc2301a45a7511142ec2c171adc1d51baafc03b41' }, // OLD-REWORD-A.tsv
  'SAID.crisis.rising.3 cautious': { from: 'Nobody says which side they\'re on, though most can guess.', to: 'Which side people are on goes unsaid, though most can guess.', fromSha256: '9d87b20bb7983b525040047c22f8c37f6b5fda146be54116b10c85053d465077', toSha256: 'e64c9b0c6bd735a0aff1264cd7ac6af1015b05163310bc5ed8233a077b9a0559' }, // OLD-REWORD-A.tsv
  'SAID.crisis.sickness.3 cautious': { from: 'Some houses have gone very quiet.', to: 'Houses have gone very quiet.', fromSha256: 'ec98b2c97ef9922ed949113fe7e48851459b9eb7736b3e2b4bc4c397288d4e0d', toSha256: '143440f1521a7144635d40256f09dc09c2dec99955d67723fb56dc1058da8698' }, // OLD-REWORD-A.tsv
  'SAID.crisis.war.3 cautious': { from: 'Some people are friendlier with the soldiers than they need to be.', to: 'Too many are friendlier with the soldiers than they need to be.', fromSha256: '5b519a8777fffd24593b062f08c301dc5cf62518c250cdcfaf18df07147475ad', toSha256: 'ca563ea0e349d120dc874f16943ac96459ffc1ab1dc21bf13670c5fea211df0c' }, // OLD-REWORD-A.tsv
  'SAID.inst.any-crisisunmarked.3 cautious': { from: 'Nobody knows what the {crisisNoun} will bring next.', to: 'The {crisisNoun} could still get worse.', fromSha256: '388b93d02e97e7ddc8dfbef5d453676321c85ecca8d456669851cbd2d42d3664', toSha256: '221c55ce1abd7573cb7992ff503d53a12e13f2c732be3fc341f26091e125e2fa' }, // OLD-REWORD-B.tsv
  'SAID.inst.any-crisismarked.1 cautious': { from: 'Nobody knows how long the {crisisNoun} will keep things shut.', to: 'The {crisisNoun} could keep things shut for a long while yet.', fromSha256: '374318dcf473ca3f4dd092df197f86d1ae0b8cfe221858c0617ba0d864cab634', toSha256: '698e7ca97d241d60df717f41ef6b8dbf9775041a3797c2475efb32296cb615ff' }, // OLD-REWORD-B.tsv
  'SAID.trad.offering.2 cautious': { from: 'Some give much less than they could, people say.', to: 'A few give much less than they could afford.', fromSha256: '4bcfe62f1da7cd6c6a0e8bb258e4290c18f193353660cbaeb2cdf79a9efbc51e', toSha256: 'c39c74ed022ec606a13b50ea967ed39226767d0e169d965f0c0495aef995f0a0' }, // OLD-REWORD-B.tsv
  'SAID.trad.any-crisis.3 cautious': { from: 'Some may stay away this year, worried about the {crisisNoun}.', to: 'Fear of the {crisisNoun} may keep people away this year.', fromSha256: '0dbfab968244dd0d4ca057dbb93d7589d2b098c5b00577a78f32cc5944b21337', toSha256: '9118d3e5c1dfedf4a33c8701bce0c85dabd4d3c966897ad37a405a25afeb3210' }, // OLD-REWORD-B.tsv
  'SAID.person.powerface.2 cautious': { from: 'Some people talk differently once they know who we answer to.', to: 'People talk differently once they know who we answer to.', fromSha256: 'eb9791d11abb3764c9992d1705ef644589c064b225a7abd728838a10eea87d92', toSha256: 'a88c153ceb8241657362e0e7167888ac3c4ac203c78829516c5644bafc24dab6' }, // OLD-REWORD-B.tsv
  'LIE.office.hall.4 cautious': { from: 'Nobody important has ever had a ruling bent for them here.', to: 'Rulings here have never been bent for anyone important.', fromSha256: '1c895795e7afde580bbb37b1c70e9ef049644d30cb430914082d4f5dc2908aef', toSha256: 'f86c5f85d8ce7ad8bcfcd5e177f81c25f03f12266299da6970fe97cf477792fe' }, // OLD-REWORD-B.tsv
}));

/**
 * THE CLASS ANSWERS (the chair's rulings G1-3 (1) and (2) of 2026-11-28; the table the chair read, the seat's
 * `CLASS-HITS.md`): what a version presumes where the presumption-classes walker reads a THING class in its words (goods,
 * office, outside …), or where a speaker's word states a MATERIAL fact of the town (drink in plenty): an atom of the
 * vocabulary, asked of the record through the one door like any line's, or the card that answers it
 * (`domain/voices/cardWords.js`). Keyed `<line id> <temper | inTruth>`; an `inTruth` answer is the LINE's (its note
 * prints with every version).
 */
export const CLASS_ANSWERS = Object.freeze(/** @type {Record<string, { needs?: string[], excludes?: string[], card?: string[] }>} */ ({
  // drink in plenty, a material fact: the hunger family (famine, under_siege) shut out
  'SAID.trad.feast.2 transactional': { excludes: ['crisis: hunger'] },
  // a healer's herbs and clean cloths: a healer, an apothecary or a hospital (never an almshouse)
  'SAID.inst.care-ordinary.4 transactional': { card: ['medicine'] },
  // the first carts of the day at a mill or a granary: the town grows grain, and no siege shuts the gate
  'SAID.inst.grain-ordinary.4 welcoming': { needs: ['grain'], excludes: ['crisis: under_siege'] },
  // an inn's travellers: a route at all, and no siege
  'SAID.inst.inn-ordinary.3 welcoming': { needs: ['route open'], excludes: ['crisis: under_siege'], card: ['company'] },
  'SAID.inst.inn-ordinary.4 welcoming': { needs: ['route open'], excludes: ['crisis: under_siege'], card: ['company'] },
  'SAID.inst.inn-ordinary.4 cautious': { needs: ['route open'], excludes: ['crisis: under_siege'], card: ['lodging'] },
  // THE OLD INN VERSIONS BY WHAT THE HOUSE SERVES (writer B's `INN-CARD-B.tsv` at 9b172584e, accepted with G1-8): a bed, a
  // meal or a room to sit in, so no inn line prints on a stable or a toll bridge (the three above carry theirs beside
  // their atoms)
  'SAID.inst.inn-ordinary.1 welcoming': { card: ['lodging'] },
  'SAID.inst.inn-ordinary.1 transactional': { card: ['food and drink'] },
  'SAID.inst.inn-ordinary.1 cautious': { card: ['company'] },
  'SAID.inst.inn-ordinary.2 welcoming': { card: ['company'] },
  'SAID.inst.inn-ordinary.2 cautious': { card: ['company'] },
  'SAID.inst.inn-ordinary.2 dismissive': { card: ['company'] },
  'SAID.inst.inn-ordinary.3 transactional': { card: ['food and drink'] },
  'SAID.inst.inn-ordinary.4 transactional': { card: ['lodging'] },
  'SAID.inst.inn-ordinary.5 welcoming': { card: ['company'] },
  // a lie about outside goods still needs goods to come in (G1-3 (2))
  'LIE.smuggling.4 welcoming': { needs: ['imports'] },
  'LIE.front.trade.2 welcoming': { needs: ['route open'] },
  'LIE.smuggling.1 inTruth': { needs: ['house: smuggling'] },
}));

/** @param {string} id @param {string} where @param {string} text @returns {string} the text, changed where ruled */
function changedText(id, where, text) {
  const c = Object.hasOwn(CHANGED_WORDS, `${id} ${where}`) ? CHANGED_WORDS[`${id} ${where}`] : null;
  if (!c) return text;
  if (c.from !== text) throw new Error(`gen-voices-lines: ${id} ${where} is no longer "${c.from}" in the TSV: "${text}"`);
  for (const [k, t] of /** @type {const} */ ([['fromSha256', c.from], ['toSha256', c.to]])) {
    if (c[k] && c[k] !== createHash('sha256').update(t, 'utf8').digest('hex')) throw new Error(`gen-voices-lines: ${id} ${where}: ${k} does not hash "${t}"`);
  }
  return c.to;
}
/** @param {string} id @param {string} where @returns {{ needs: string[], excludes: string[], card: string[] }} */
function classAnswerOf(id, where) {
  const a = Object.hasOwn(CLASS_ANSWERS, `${id} ${where}`) ? CLASS_ANSWERS[`${id} ${where}`] : {};
  return { needs: [...(a.needs || [])], excludes: [...(a.excludes || [])], card: [...(a.card || [])] };
}

/**
 * THE SECOND WRITERS' DECLARATIONS, READ (the chair's G1-8 and G1-9, 2026-11-28): every `needs` and `excludes` cell of the
 * accepted second files (A's `C2-said-lines-A.tsv` at a093e4913; B's `C2-said-lines-B.tsv` and `D2-liar-lines-B.tsv` at
 * 9b172584e) is read HERE, by hand, into its terms. The writers' cells carry glosses, reasons and their own temper letters
 * (B writes W, T, G, C for the four tempers: G is the guarded, C the curt), which no one parser can read safely. Each entry
 * holds the cell exactly as the TSV holds it (a changed TSV stops the generator). Each term is a word with the tempers it
 * binds (null: all four), and the word goes the same road as any writer's word (`routeOf`). A second file's cell with no
 * entry here stops the generator.
 * @type {Readonly<Record<string, { from: string, terms: ReadonlyArray<{ word: string, tempers: ReadonlyArray<string> | null }> }>>}
 */
export const CELL_READING = Object.freeze({
  'SAID.power.seat-contested.7 needs': { from: 'a body with members and meetings (the power card\'s kind, `factionArchetype`: government, civic, merchant, craft, labor, religious or arcane; never military, occupation, criminal, noble, outsider or other) (D)',
    terms: [{ word: 'a body with members and meetings', tempers: ['dismissive'] }] },
  'SAID.power.lesser-contender.8 needs': { from: 'a body with members and meetings (the power card\'s kind, `factionArchetype`: government, civic, merchant, craft, labor, religious or arcane; never military, occupation, criminal, noble, outsider or other) (W); not an occupier (the power card\'s kind is not `occupation`: an occupier is not shut out of the decisions it makes) (T,D)',
    terms: [{ word: 'a body with members and meetings', tempers: ['welcoming'] }, { word: 'not an occupier', tempers: ['transactional', 'dismissive'] }] },
  'SAID.power.lesser-standing.4 needs': { from: 'a body with members and meetings (the power card\'s kind, `factionArchetype`: government, civic, merchant, craft, labor, religious or arcane; never military, occupation, criminal, noble, outsider or other) (T,D)',
    terms: [{ word: 'a body with members and meetings', tempers: ['transactional', 'dismissive'] }] },
  'SAID.power.lesser-standing.7 needs': { from: 'an old order (the power card\'s kind, `factionArchetype`: noble, religious or civic: elders, an old faith, a noble house)',
    terms: [{ word: 'an old order', tempers: null }] },
  'SAID.power.seat-secure.7 needs': { from: 'a small place (a town or smaller): `tier: ≤ town`',
    terms: [{ word: 'tier: ≤ town', tempers: null }] },
  'SAID.tension.neighbours.9 needs': { from: 'type: infiltration_fear or occupation_legacy',
    terms: [{ word: 'type: infiltration_fear or occupation_legacy', tempers: null }] },
  'SAID.tension.neighbours.10 needs': { from: 'type: infiltration_fear or occupation_legacy',
    terms: [{ word: 'type: infiltration_fear or occupation_legacy', tempers: null }] },
  'SAID.tension.crime.9 needs': { from: 'type: corruption_scandal',
    terms: [{ word: 'type: corruption_scandal', tempers: null }] },
  'SAID.tension.crime.10 needs': { from: 'type: corruption_scandal',
    terms: [{ word: 'type: corruption_scandal', tempers: null }] },
  'SAID.inst.hall-ordinary.7 needs': { from: 'prosperity: ≤ moderate (W,T,G,C): a worn hall is not printed in a comfortable, prosperous or wealthy town, whose own line says its buildings are finished rather than patched',
    terms: [{ word: 'prosperity: ≤ moderate', tempers: ['welcoming', 'transactional', 'cautious', 'dismissive'] }] },
  'SAID.inst.inn-ordinary.6 needs': { from: 'food and drink (a house that serves them: wayside_inn, alehouse, ale_house, travelers_inn, inn_multiple, taverns_5_20, coaching_inn, inns_and_taverns_district, caravanserai, waystation; NEW card word) (W); company (a house where people sit and talk: the food-and-drink ids and public_bathhouse; NEW card word) (T,G,C)',
    terms: [{ word: 'food and drink', tempers: ['welcoming'] }, { word: 'company', tempers: ['transactional', 'cautious', 'dismissive'] }] },
  'SAID.inst.inn-ordinary.7 needs': { from: 'company (a house where people sit and talk: the food-and-drink ids and public_bathhouse; NEW card word) (W,T); lodging (a house that beds travellers: wayside_inn, caravanserai, travelers_inn, waystation, inn_multiple, coaching_inn, post_relay_station, inns_and_taverns_district; NEW card word) (G)',
    terms: [{ word: 'company', tempers: ['welcoming', 'transactional'] }, { word: 'lodging', tempers: ['cautious'] }] },
  'SAID.inst.inn-ordinary.8 needs': { from: 'lodging (a house that beds travellers: wayside_inn, caravanserai, travelers_inn, waystation, inn_multiple, coaching_inn, post_relay_station, inns_and_taverns_district; NEW card word) (W,T,G,C)',
    terms: [{ word: 'lodging', tempers: ['welcoming', 'transactional', 'cautious', 'dismissive'] }] },
  'SAID.inst.any-crisisunmarked.7 needs': { from: 'crisis: under_siege, occupied, monster_pressure, wartime, insurgency, slave_revolt (W,T,G,C: the line\'s subject is the danger after dark; crime is no crisis kind and cannot join this disjunction)',
    terms: [{ word: 'crisis: under_siege, occupied, monster_pressure, wartime, insurgency, slave_revolt', tempers: ['welcoming', 'transactional', 'cautious', 'dismissive'] }] },
  'SAID.inst.any-short.4 needs': { from: 'card: the shortage mark names {good} and guarantees the house is short of it (slot rule needs: named good); a goods or resource class hits only with a slot value, as on the old any-short lines; card-not: digs or grows its own (a house that works its good itself: mine, mine_open_cast, stone_quarry, salt_works, peat_cutter, woodcutter_s_camp, fishing_community, fisher_s_landing, subsistence_farming, farmland, common_grazing_land, shepherd, shepherd_collective, dairy_farmer, hunter_s_lodge, beekeeper, wildfowler; NEW negated card word) (W,T,G)',
    terms: [{ word: 'the shortage mark names {good}', tempers: null }, { word: 'card-not: digs or grows its own', tempers: ['welcoming', 'transactional', 'cautious'] }] },
  'SAID.inst.any-short.5 needs': { from: 'card: the shortage mark names {good} and guarantees the house is short of it (slot rule needs: named good); a goods or resource class hits only with a slot value, as on the old any-short lines',
    terms: [{ word: 'the shortage mark names {good}', tempers: null }] },
  'SAID.inst.any-short.6 needs': { from: 'card: the shortage mark names {good} and guarantees the house is short of it (slot rule needs: named good); a goods or resource class hits only with a slot value, as on the old any-short lines',
    terms: [{ word: 'the shortage mark names {good}', tempers: null }] },
  'SAID.inst.any-short.7 needs': { from: 'card: the shortage mark names {good} and guarantees the house is short of it (slot rule needs: named good); a goods or resource class hits only with a slot value, as on the old any-short lines',
    terms: [{ word: 'the shortage mark names {good}', tempers: null }] },
  'SAID.inst.any-short.8 needs': { from: 'card: the shortage mark names {good} and guarantees the house is short of it (slot rule needs: named good); a goods or resource class hits only with a slot value, as on the old any-short lines; card-not: digs or grows its own (a house that works its good itself: mine, mine_open_cast, stone_quarry, salt_works, peat_cutter, woodcutter_s_camp, fishing_community, fisher_s_landing, subsistence_farming, farmland, common_grazing_land, shepherd, shepherd_collective, dairy_farmer, hunter_s_lodge, beekeeper, wildfowler; NEW negated card word) (W,T,G)',
    terms: [{ word: 'the shortage mark names {good}', tempers: null }, { word: 'card-not: digs or grows its own', tempers: ['welcoming', 'transactional', 'cautious'] }] },
  'SAID.trad.feast.6 excludes': { from: 'crisis: hunger (C) (ruling G1-3 (2): food in plenty)',
    terms: [{ word: 'crisis: hunger', tempers: ['dismissive'] }] },
  'SAID.trad.feast.7 excludes': { from: 'crisis: hunger (C) (ruling G1-3 (2): food in plenty)',
    terms: [{ word: 'crisis: hunger', tempers: ['dismissive'] }] },
  'SAID.trad.fair.8 excludes': { from: 'crisis: hunger (W,T,G,C) (ruling G1-3 (2): food in plenty)',
    terms: [{ word: 'crisis: hunger', tempers: ['welcoming', 'transactional', 'cautious', 'dismissive'] }] },
  'SAID.trad.procession.5 needs': { from: 'tier: ≥ town (W,T,G,C): crowds, windows let for a coin and pickpockets',
    terms: [{ word: 'tier: ≥ town', tempers: ['welcoming', 'transactional', 'cautious', 'dismissive'] }] },
  'SAID.trad.any-crisis.4 needs': { from: 'crisis: under_siege, famine, occupied, plague_onset, monster_pressure, wartime, insurgency, slave_revolt, religious_conversion, mass_migration (G: faces missing; not a debt, a betrayal, an infiltration or a split)',
    terms: [{ word: 'crisis: under_siege, famine, occupied, plague_onset, monster_pressure, wartime, insurgency, slave_revolt, religious_conversion, mass_migration', tempers: ['cautious'] }] },
  'SAID.trad.any-crisis.5 needs': { from: 'crisis: occupied, infiltrated, insurgency, slave_revolt, religious_conversion, politically_fractured, succession_void, wartime (G: notice from those who hold or contest the place; not famine, debt or plague)',
    terms: [{ word: 'crisis: occupied, infiltrated, insurgency, slave_revolt, religious_conversion, politically_fractured, succession_void, wartime', tempers: ['cautious'] }] },
});

/**
 * A word answered by the card's own STATE: the pool it is filed under guarantees it (`institution.any-short`: the
 * shortage mark names the good the `{good}` slot prints and says the house is short of it), so it asks the record nothing.
 */
export const STATE_ANSWERED = Object.freeze({ 'the shortage mark names {good}': 'institution.any-short' });

/**
 * THE ROAD OF ONE WORD: a tension's TYPE (a state), the writers' word for an atom (`NEEDS_ATOM`), a house word
 * (`CARD_WORDS`), a negated house word (`card-not: <word>`, `CARD_NOT_WORDS`), a power-kind word (`POWER_WORDS`), a word the
 * pool's own state answers (`STATE_ANSWERED`), a word that IS an atom of the vocabulary (asked through its own door,
 * `assertDeclarable`), or nowhere (the version is ineligible).
 * @param {string} word
 * @returns {{ road: 'type' | 'atom' | 'card' | 'cardNot' | 'power' | 'state' | 'nowhere', value: string }}
 */
export function routeOf(word) {
  if (Object.hasOwn(TYPE_STATE, word)) return { road: 'type', value: TYPE_STATE[/** @type {keyof typeof TYPE_STATE} */ (word)] };
  if (Object.hasOwn(NEEDS_ATOM, word)) return { road: 'atom', value: NEEDS_ATOM[/** @type {keyof typeof NEEDS_ATOM} */ (word)] };
  if (Object.hasOwn(CARD_WORDS, word)) return { road: 'card', value: word };
  const not = /^card-not:\s*(.+)$/.exec(word);
  if (not && Object.hasOwn(CARD_NOT_WORDS, not[1])) return { road: 'cardNot', value: not[1] };
  if (Object.hasOwn(POWER_WORDS, word)) return { road: 'power', value: word };
  if (Object.hasOwn(STATE_ANSWERED, word)) return { road: 'state', value: STATE_ANSWERED[/** @type {keyof typeof STATE_ANSWERED} */ (word)] };
  try { assertDeclarable(word); return { road: 'atom', value: word }; } catch { return { road: 'nowhere', value: word }; }
}

/**
 * The terms of one cell: the hand reading where the cell has one (a second file's cell MUST), else the first file's parser.
 * @param {string} id @param {'needs' | 'excludes'} col @param {string} cell @param {boolean} mustRead
 * @returns {Array<{ word: string, tempers: string[] | null }>}
 */
function termsOfCell(id, col, cell, mustRead) {
  const c = String(cell || '').trim();
  const key = `${id} ${col}`;
  if (Object.hasOwn(CELL_READING, key)) {
    const r = CELL_READING[key];
    if (r.from !== c) throw new Error(`gen-voices-lines: ${key} is no longer the cell read in CELL_READING: "${c}"`);
    return r.terms.map((t) => ({ word: t.word, tempers: t.tempers ? [...t.tempers] : null }));
  }
  if (!c || c === 'none' || c === '-') return [];
  if (mustRead) throw new Error(`gen-voices-lines: ${key} is a second writer's cell with no CELL_READING entry: "${c}"`);
  if (col === 'excludes') throw new Error(`gen-voices-lines: ${key}: an excludes cell is read only through CELL_READING`);
  return needsTermsOf(c);
}

/**
 * THE SPEAKER RULES AS KEYS (the writer's words for a mouth, each to the one key the plan reads). A mouth the map does not
 * name stops the generator.
 */
export const SPEAKER_KEY = Object.freeze(/** @type {Record<string, string>} */ ({
  anyone: 'anyone', keeper: 'keeper', 'one who works there': 'works-there', 'an officer of the watch': 'watch-officer',
  'a member of the power': 'member', 'anyone not of the power': 'not-member', 'anyone not of the power (the aggrieved)': 'not-member',
  "anyone not of the seat's power": 'not-seat', "anyone (never a member of the seat's power)": 'not-seat',
  'one it has wronged': 'wronged', 'one it has wronged (never an officer of the watch or of the seat)': 'wronged-not-officer',
  'one who works at the market': 'market-worker', 'the keeper of the rites': 'rite-keeper',
  "the card's own person (a power's own face)": 'own-person', 'one who depends on it': 'depends',
}));

/**
 * The declaration the nouns of one text call for, through `NOUN_DECLARATION`.
 * @param {string} text @param {string} where @returns {{ needs: string[], excludes: string[] }}
 */
export function nounDeclarationOf(text, where) {
  /** @type {string[]} */ const needs = []; /** @type {string[]} */ const excludes = [];
  for (const id of [...thingsNamedIn(text), ...newWordsNamedIn(text)]) {
    if (!Object.hasOwn(REGISTERED_WORDS, id)) continue;
    const d = Object.hasOwn(NOUN_DECLARATION, id) ? NOUN_DECLARATION[id] : null;
    if (!d) throw new Error(`gen-voices-lines: ${where} names the registered thing '${id}', which NOUN_DECLARATION does not answer: "${text}"`);
    const word = Object.keys(d.byWord || {}).find((w) => new RegExp(`\\b${w}\\b`, 'i').test(text));
    for (const a of word ? /** @type {Record<string, string[]>} */ (d.byWord)[word] : d.needs || []) if (!needs.includes(a)) needs.push(a);
    for (const a of d.excludes || []) if (!excludes.includes(a)) excludes.push(a);
  }
  return { needs, excludes };
}

/** @param {string} text @param {string[]} needs @param {string[]} excludes @returns {{ text: string, needs?: string[], excludes?: string[] }} */
const versionOf = (text, needs, excludes) => ({ text, ...(needs.length ? { needs } : {}), ...(excludes.length ? { excludes } : {}) });

/** @param {string} path @returns {string[][]} the rows under the header */
function readTsv(path) {
  const lines = readFileSync(path, 'utf8').split('\n').filter((l) => l.trim() !== '');
  return lines.slice(1).map((l) => l.split('\t'));
}

/**
 * One TSV, read as a said or a liar file by its header (a said file's second column is `card kind`, a liar file's
 * `touches`). A file with a `needs`, `excludes` or `classes` column the FIRST files lack is a SECOND writer's: every
 * declaration cell of it must be read in CELL_READING.
 * @param {string} path
 * @returns {{ kind: 'said' | 'liar', rows: string[][], needsAt: number, excludesAt: number, mustRead: boolean }}
 */
function readLinesFile(path) {
  const head = readFileSync(path, 'utf8').split('\n')[0].split('\t').map((x) => x.trim());
  const kind = head[1] === 'card kind' ? 'said' : head[1] === 'touches' ? 'liar' : null;
  if (!kind) throw new Error(`gen-voices-lines: ${path} is neither a said nor a liar file (its second column is "${head[1]}")`);
  return { kind, rows: readTsv(path), needsAt: head.indexOf('needs'), excludesAt: head.indexOf('excludes'), mustRead: head.includes('classes') };
}

/**
 * One `needs` cell, parsed: `word (gloss) (W,T); other (gloss)` → its terms. A trailing `(…)` of temper letters names the
 * versions; any other parenthesis is a gloss. A bare parenthetical term (a note) is dropped.
 * @param {string} cell
 * @returns {Array<{ word: string, tempers: string[] | null }>}
 */
export function needsTermsOf(cell) {
  /** @type {Array<{ word: string, tempers: string[] | null }>} */ const out = [];
  for (const raw of splitTop(String(cell || ''))) {
    let t = raw.trim();
    if (!t || t.startsWith('(')) continue;
    /** @type {string[] | null} */ let tempers = null;
    const m = /\(([WTCD](?:\s*,\s*[WTCD])*)\)\s*$/.exec(t);
    if (m) { tempers = m[1].split(',').map((x) => TEMPER_LETTER[/** @type {'W'} */ (x.trim())]); t = t.slice(0, m.index).trim(); }
    const word = t.replace(/\s*\(.*\)\s*$/, '').trim();
    if (word) out.push({ word, tempers });
  }
  return out;
}

/** @param {string} s @returns {string[]} the cell split on the semicolons outside every parenthesis */
function splitTop(s) {
  /** @type {string[]} */ const out = []; let depth = 0; let at = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth += 1;
    else if (s[i] === ')') depth = Math.max(0, depth - 1);
    else if (s[i] === ';' && depth === 0) { out.push(s.slice(at, i)); at = i + 1; }
  }
  out.push(s.slice(at));
  return out;
}

/** @param {string} cell @returns {string[]} the slot names a line's `slots` cell holds */
function slotsOf(cell) {
  return [...String(cell || '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}

/** @param {string} cell @param {string} where @returns {string[]} a speaker rule's mouths, in the writer's order, as keys */
export function speakerTokensOf(cell, where = '') {
  return String(cell || '').split(';').map((x) => x.trim()).filter(Boolean).map((m) => {
    if (!Object.hasOwn(SPEAKER_KEY, m)) throw new Error(`gen-voices-lines: ${where} names a mouth SPEAKER_KEY does not know: '${m}'`);
    return SPEAKER_KEY[m];
  });
}

/** @param {string} kind @param {string} state @returns {string} the pool key a line is filed under */
const poolKeyOf = (kind, state) => `${kind}.${state}`;

/**
 * @param {string[]} r @param {{ excludesAt: number, mustRead: boolean }} file the file's own columns
 * @returns {object} one said line, as data
 */
function saidLineOf(r, file) {
  const [id, kind, stateCell, speaker, , w, t, c, d, slots, , , needsCell] = r;
  const excludesCell = file.excludesAt >= 0 ? r[file.excludesAt] || '' : '';
  let state = stateCell;
  // the needs of every version, then of one version alone, by kind: an atom of the vocabulary (asked through the door),
  // a word the CARD answers (`domain/voices/cardWords.js`), or a word answered nowhere (that version is ineligible)
  /** @type {Record<string, { atoms: string[], crisis: string[], excludes: string[], card: string[], cardNot: string[], power: string[], nowhere: string[] }>} */
  const per = Object.fromEntries(TEMPERS.map((tp) => [tp, { atoms: [], crisis: [], excludes: [], card: [], cardNot: [], power: [], nowhere: [] }]));
  const add = (/** @type {string[]} */ list, /** @type {string} */ x) => { if (!list.includes(x)) list.push(x); };
  for (const term of termsOfCell(id, 'needs', needsCell, file.mustRead)) {
    const road = routeOf(term.word);
    if (road.road === 'type') { state = road.value; continue; }
    if (road.road === 'state') {
      if (`${kind}.${stateCell}` !== road.value) throw new Error(`gen-voices-lines: ${id} names "${term.word}", answered only by ${road.value}`);
      continue;
    }
    for (const tp of term.tempers || TEMPERS) {
      if (CHANGED_WORDS[`${id} ${tp}`]?.drops?.includes(term.word)) continue; // the changed words no longer name it
      // a LIST of crisis kinds is the vocabulary's own crisis channel (`declarationOf`'s `crisis`: the kinds, a disjunction),
      // never one long atom string, which the presumed-things walker would read as prose naming the war and the revolt
      if (road.road === 'atom' && /^crisis:\s*[^,]+,/.test(road.value)) for (const k of road.value.replace(/^crisis:\s*/, '').split(',')) add(per[tp].crisis, k.trim());
      else if (road.road === 'atom') add(per[tp].atoms, road.value);
      else if (road.road === 'card') add(per[tp].card, road.value);
      else if (road.road === 'cardNot') add(per[tp].cardNot, road.value);
      else if (road.road === 'power') add(per[tp].power, road.value);
      else add(per[tp].nowhere, term.word);
    }
  }
  for (const term of termsOfCell(id, 'excludes', excludesCell, file.mustRead)) {
    assertDeclarable(term.word); // an excluded word is an atom of the vocabulary, or the cell is misread
    for (const tp of term.tempers || TEMPERS) add(per[tp].excludes, term.word);
  }
  const texts = { welcoming: changedText(id, 'welcoming', w.trim()), transactional: changedText(id, 'transactional', t.trim()),
    cautious: changedText(id, 'cautious', c.trim()), dismissive: changedText(id, 'dismissive', d.trim()) };
  /** @type {Record<string, object>} */ const versions = {};
  for (const tp of TEMPERS) {
    const own = nounDeclarationOf(texts[/** @type {'welcoming'} */ (tp)], `${id} ${tp}`);
    const ans = classAnswerOf(id, tp);
    const vn = [...per[tp].atoms];
    for (const a of [...own.needs, ...ans.needs]) if (!vn.includes(a)) vn.push(a);
    const ve = [...own.excludes]; for (const a of [...per[tp].excludes, ...ans.excludes]) if (!ve.includes(a)) ve.push(a);
    for (const x of ans.card) add(per[tp].card, x);
    versions[tp] = { ...versionOf(texts[/** @type {'welcoming'} */ (tp)], vn, ve), ...(per[tp].crisis.length ? { crisis: per[tp].crisis } : {}),
      ...(per[tp].card.length ? { card: per[tp].card } : {}), ...(per[tp].cardNot.length ? { cardNot: per[tp].cardNot } : {}),
      ...(per[tp].power.length ? { power: per[tp].power } : {}), ...(per[tp].nowhere.length ? { ineligible: per[tp].nowhere } : {}) };
  }
  const sl = slotsOf(slots);
  return { id, kind, state, speaker: speakerTokensOf(speaker, id), ...(sl.length ? { slots: sl } : {}), versions };
}

/** @param {string} id @returns {string} the liar line's group: `office.hall`, `front.trade`, `retainer`, `theft` … */
export function liarGroupOf(id) {
  const parts = id.split('.');
  return parts.slice(1, -1).join('.');
}

/**
 * @param {string[]} r @param {{ needsAt: number, excludesAt: number, mustRead: boolean }} file the file's own columns
 * @returns {object} one liar line, as data (the writer's notes, `touches`, `fits` and the false claim, stay in the TSV)
 */
function liarLineOf(r, file) {
  const [id, , , , , w, t, c, d, , inTruth] = r;
  // a liar line's own declaration cells (the second files carry the columns): every term must be read, and none is
  // declared on a liar line today, so any term stops the generator until the engine is taught where it binds
  for (const [col, at] of /** @type {const} */ ([['needs', file.needsAt], ['excludes', file.excludesAt]])) {
    if (at >= 0 && termsOfCell(id, col, r[at] || '', file.mustRead).length) throw new Error(`gen-voices-lines: ${id} declares ${col} on a liar line; no road reads it yet`);
  }
  const truth = changedText(id, 'inTruth', inTruth.trim());
  const note = nounDeclarationOf(truth, `${id} inTruth`);
  { const ans = classAnswerOf(id, 'inTruth'); for (const a of ans.needs) if (!note.needs.includes(a)) note.needs.push(a); for (const a of ans.excludes) if (!note.excludes.includes(a)) note.excludes.push(a); }
  const texts = { welcoming: changedText(id, 'welcoming', w.trim()), transactional: changedText(id, 'transactional', t.trim()),
    cautious: changedText(id, 'cautious', c.trim()), dismissive: changedText(id, 'dismissive', d.trim()) };
  /** @type {Record<string, object>} */ const versions = {};
  for (const tp of TEMPERS) {
    const own = nounDeclarationOf(texts[/** @type {'welcoming'} */ (tp)], `${id} ${tp}`);
    const ans = classAnswerOf(id, tp);
    const vn = [...own.needs]; for (const a of ans.needs) if (!vn.includes(a)) vn.push(a);
    const ve = [...own.excludes]; for (const a of ans.excludes) if (!ve.includes(a)) ve.push(a);
    versions[tp] = versionOf(texts[/** @type {'welcoming'} */ (tp)], vn, ve);
  }
  return { id, group: liarGroupOf(id), inTruth: truth, ...(note.needs.length ? { needs: note.needs } : {}), ...(note.excludes.length ? { excludes: note.excludes } : {}), versions };
}

/** @param {unknown} v @returns {string} a JS literal of a plain value (frozen whole by the file's own \`deepFreeze\`) */
function lit(v) {
  if (v === null) return 'null';
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(v)) return `[${v.map(lit).join(', ')}]`;
  if (typeof v === 'object') {
    const key = (/** @type {string} */ k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`);
    const ents = Object.entries(/** @type {object} */ (v));
    return ents.length ? `{ ${ents.map(([k, x]) => `${key(k)}: ${lit(x)}`).join(', ')} }` : '{}';
  }
  return String(v);
}

/** @param {object} row @returns {string} one line of a pool, its versions on a line each */
function rowOf(row) {
  const { versions } = /** @type {{ versions: Record<string, object> }} */ (row);
  // the pool's key carries the kind, the state and the group: a row does not repeat them
  const rest = Object.fromEntries(Object.entries(row).filter(([k]) => !['versions', 'kind', 'state', 'group'].includes(k)));
  const head = lit(rest).replace(/ }$/, '');
  return `    ${head},\n      versions: {\n${TEMPERS.map((t) => `        ${t}: ${lit(versions[t])},`).join('\n')}\n      } },`;
}

const FREEZE = `/** @template T @param {T} v @returns {T} */
function deepFreeze(v) {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) { Object.freeze(v); for (const x of Object.values(v)) deepFreeze(x); }
  return v;
}
`;

/** @param {Map<string, object[]>} groups @param {string} name @returns {string} */
function recordOf(groups, name) {
  const body = [...groups].map(([k, rows]) => `  '${k}': [\n${rows.map(rowOf).join('\n')}\n  ],`).join('\n');
  return `${FREEZE}\nexport const ${name} = deepFreeze({\n${body}\n});\n`;
}

const SAID_HEAD = `/**
 * data/voices/saidLines.js — THE SAID LINES (S-G1; VOICES-LINES' \`C-said-lines.tsv\` at 4116f40b2, accepted by the chair as
 * ruling L-5; and the second writers' \`C2-said-lines-A.tsv\` at a093e4913 and \`C2-said-lines-B.tsv\` at 9b172584e, accepted as
 * G1-8, appended after the first lines in each pool). ⛔ GENERATED by
 * \`node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv> <C2-said-lines-A.tsv> <C2-said-lines-B.tsv> <D2-liar-lines-B.tsv>\`; after that
 * load this file is the lines' home, and every version of every line is fingerprinted by the id guard
 * (\`tests/lint/stablePickIds.shared.mjs :: IMPORTED_POOLS\`, words \`versions\`) and banked by its own door.
 *
 * Filed by pool, \`<card kind>.<state>\` (the keys of \`survey/lines/A-keys.md\` as ruled L-1 to L-4). Each line: its \`id\`; its
 * speaker rule (\`speaker\`: its mouths in the writer's order, as the generator's \`SPEAKER_KEY\` keys them); its \`slots\`
 * where it has any; and its four \`versions\`, keyed on the speaker's stored disposition (\`npc.presentation.disposition\`),
 * each \`{ text, needs, excludes, crisis, card, cardNot, power, ineligible }\`: the atoms that version presumes (\`crisis\`: the
 * crisis kinds it is said under, one of them, the vocabulary's own channel), asked of the record
 * through the one door (the writer's needs words through \`NEEDS_ATOM\` and \`CELL_READING\`, the nouns the text names through
 * \`NOUN_DECLARATION\`); the card-level words its card must answer, the negated ones and the power-kind ones
 * (\`domain/voices/cardWords.js\`); the words answered nowhere (that version is never spoken). An absent field is empty.
 *
 * Pure data, no logic. Read by \`domain/voices/voicePlan.js\` alone (lazily, with the tab: never on the first paint).
 */
`;

const LIAR_HEAD = `/**
 * data/voices/liarLines.js — THE LIAR'S LINES (S-G1; VOICES-LINES' \`D-liar-lines.tsv\` at 4116f40b2, and writer B's
 * \`D2-liar-lines-B.tsv\` at 9b172584e, accepted as G1-8). ⛔ GENERATED by
 * \`node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv> <C2-said-lines-A.tsv> <C2-said-lines-B.tsv> <D2-liar-lines-B.tsv>\`; after that load this file is the lines' home,
 * fingerprinted and banked as the said lines are.
 *
 * Each line: its \`id\`; \`inTruth\`; the \`needs\` and \`excludes\` its DM note presumes; and its four versions, each
 * \`{ text, needs, excludes }\` as the said lines'. Filed by group: the tie's way through the holder's own house and its family (\`office.hall\`, \`office.faith\`,
 * \`front.trade\`, \`front.other\`, \`retainer\`) and the criminal house's kind (\`smuggling\`, \`blackmarket\`, \`theft\`,
 * \`secrets\`, \`killing\`, \`extortion\`, \`tunnels\`). \`inTruth\` is THE DM'S NOTE, shown only on the owner's own page,
 * never to a reader. What each line touches and what tie it fits are the writer's notes, kept in the TSV.
 *
 * Pure data, no logic. Read by \`domain/voices/voicePlan.js\` alone.
 */
`;

/** @param {string} saidTsv @param {string} liarTsv @returns {{ said: string, liar: string, counts: object }} */
export function generate(...paths) {
  const files = paths.flat().map(readLinesFile);
  const ids = new Set();
  for (const f of files) for (const r of f.rows) { if (ids.has(r[0])) throw new Error(`gen-voices-lines: the id ${r[0]} is written twice`); ids.add(r[0]); }
  /** @type {Map<string, object[]>} */ const said = new Map();
  let ineligible = 0;
  // ids append-only: the first files first, each later file's lines after them in its pool, in the file's order
  for (const f of files.filter((x) => x.kind === 'said')) for (const r of f.rows) {
    const line = /** @type {{ kind: string, state: string, versions: Record<string, { ineligible?: string[] }> }} */ (saidLineOf(r, f));
    if (Object.values(line.versions).some((v) => v.ineligible)) ineligible += 1;
    const k = poolKeyOf(line.kind, line.state);
    if (!said.has(k)) said.set(k, []);
    /** @type {object[]} */ (said.get(k)).push(line);
  }
  /** @type {Map<string, object[]>} */ const liar = new Map();
  for (const f of files.filter((x) => x.kind === 'liar')) for (const r of f.rows) {
    const line = /** @type {{ group: string }} */ (liarLineOf(r, f));
    if (!liar.has(line.group)) liar.set(line.group, []);
    /** @type {object[]} */ (liar.get(line.group)).push(line);
  }
  // every changed word and every class answer names a line and a place that exist (a key misspelled stops the generator)
  const places = new Set([...said.values(), ...liar.values()].flat().flatMap((/** @type {any} */ l) => [...TEMPERS, ...(l.inTruth ? ['inTruth'] : [])].map((w) => `${l.id} ${w}`)));
  for (const k of [...Object.keys(CHANGED_WORDS), ...Object.keys(CLASS_ANSWERS)]) if (!places.has(k)) throw new Error(`gen-voices-lines: '${k}' names no line's version or note`);
  for (const k of Object.keys(CELL_READING)) if (!ids.has(k.replace(/ (needs|excludes)$/, ''))) throw new Error(`gen-voices-lines: CELL_READING '${k}' names no line`);
  const n = (/** @type {Map<string, object[]>} */ m) => [...m.values()].reduce((a, v) => a + v.length, 0);
  return {
    said: `${SAID_HEAD}\n${recordOf(said, 'SAID_LINES')}`,
    liar: `${LIAR_HEAD}\n${recordOf(liar, 'LIAR_LINES')}`,
    counts: { said: n(said), saidPools: said.size, ineligible, liar: n(liar), liarGroups: liar.size },
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const paths = process.argv.slice(2);
  if (paths.length < 2) { console.error('usage: node scripts/gen-voices-lines.mjs <lines.tsv> ... (said and liar files, the first files first)'); process.exit(2); }
  const out = generate(paths);
  mkdirSync(join(ROOT, 'src/data/voices'), { recursive: true });
  writeFileSync(join(ROOT, SAID_OUT_REL), out.said);
  writeFileSync(join(ROOT, LIAR_OUT_REL), out.liar);
  console.log(JSON.stringify(out.counts));
}
