/**
 * domain/prose/presenceMeasure.js — THE PRESENCE MEASURE (Part B §13.2).
 *
 * ── WHAT IT IS, AND WHAT IT IS EMPHATICALLY NOT ────────────────────────────────────
 * Three REPORTED figures, printed beside the absence measures so that honesty and flatness
 * are read together. **It never gates.** The reconstruction wave is CLAIM-PRESERVING and adds
 * no sensory fact, so no rule in Part B acquires a size from these numbers, and a low reading
 * is not a licence to invent a smell. Where a pool is flat for want of ANY sensory fact the
 * lawful cure is an AUTHORING act on a new pool key — the §912.1 wave — never a rewrite that
 * buys a fact.
 *
 * ── THE THREE LINES (§13.2, verbatim in substance) ─────────────────────────────────
 *   1. CONCRETE SENSORY NOUNS PER HUNDRED WORDS, from a closed lexicon PUBLISHED with the
 *      arm — never a detector, never a model.
 *   2. THE SHARE OF PARAGRAPHS CARRYING A LICENSED TEXTURE DEVICE: a paragraph counts once
 *      if it holds an OBJECT move, a named civic thing, or a comparison as a measurement in
 *      words. A paragraph whose only concreteness is a PROPER-NOUN SLOT does not count —
 *      `{settlement}` is a name, not a texture.
 *   3. THE SPREAD ACROSS SENSES, as shares with the entropy printed, so a register concrete
 *      in SIGHT ALONE is visible as such rather than passing as concrete.
 *
 * ⚠ THE LEXICON IS THE MEASURE'S WHOLE HONESTY. It is closed, published, and sense-bucketed
 * below. A noun that is not on it is not counted, and the way to argue with a figure is to
 * argue with the list.
 *
 * PURE, HEADLESS. Nothing here runs at the draw.
 *
 * @enforced-by tests/lint/proseMeasures.walker.test.js
 */
import { log2Det } from '../../kernel/detMath.js';

/**
 * THE PUBLISHED SENSORY LEXICON — concrete nouns naming a thing that can be seen, heard,
 * smelled, touched or tasted, in the estate's own civic register. A noun appears in exactly
 * ONE bucket: the sense it is most directly met through, so the spread figure is a partition
 * rather than a double count.
 *
 * ⚠ THE PARTITION IS ASSERTED OVER THESE ARRAYS, NOT OVER THE RESOLVER, AND THAT COST A
 * CORRECTION. Three nouns — `smoke` (sight + smell), `stone` and `mud` (sight + touch) — were
 * PUBLISHED in two buckets each: 169 entries over 166 distinct nouns. `SENSE_OF_NOUN` already
 * resolved all three to `sight` (the first declared bucket), so no counted figure was ever
 * double-counted — but the published list said one thing and the resolver did another, and the
 * gate's own partition assertion iterated the RESOLVER's values and therefore could not fail.
 * The three duplicates are struck from the later buckets, which is the module's own rule
 * applied ("the sense it is most directly met through": a plume, a wall and a rut are met by
 * eye first). MEASURED, both sides: the strike moves no figure at all (R1 spread 0.791 bits,
 * 1.198 nouns/100w, textured 0.2352 before and after), because the resolver already read them
 * as sight. The OPPOSITE assignment — moving all three to smell/touch — would move R1's
 * spread 0.791 → 0.848 bits, and that sensitivity is recorded rather than taken.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const SENSORY_NOUNS = Object.freeze({
  sight: Object.freeze([
    'wall', 'walls', 'gate', 'gates', 'roof', 'roofs', 'thatch', 'shutter', 'shutters',
    'banner', 'banners', 'smoke', 'lamp', 'lamps', 'torch', 'torches', 'candle', 'candles',
    'stone', 'timber', 'brick', 'slate', 'mud', 'dust', 'rust', 'paint', 'whitewash',
    'ditch', 'palisade', 'tower', 'towers', 'quay', 'wharf', 'bridge', 'mill', 'kiln',
    'forge', 'cart', 'carts', 'wagon', 'boat', 'boats', 'net', 'nets', 'rope', 'sack',
    'sacks', 'barrel', 'barrels', 'cask', 'casks', 'crate', 'chest', 'ledger', 'roll',
    'rolls', 'seal', 'tally', 'coin', 'coins', 'scale', 'scales', 'field', 'fields',
    'furrow', 'hedge', 'orchard', 'wood', 'woods', 'river', 'ford', 'road', 'lane',
    'square', 'market', 'stall', 'stalls', 'well', 'trough', 'byre', 'barn', 'granary',
  ]),
  hearing: Object.freeze([
    'bell', 'bells', 'horn', 'horns', 'drum', 'drums', 'hammer', 'hammering', 'creak',
    'clatter', 'shout', 'shouts', 'cry', 'cries', 'song', 'chant', 'murmur', 'silence',
    'quiet', 'noise', 'din', 'whistle', 'knock', 'tramp', 'hoofbeat', 'hoofbeats',
  ]),
  smell: Object.freeze([
    'tar', 'pitch', 'tallow', 'dung', 'tannery', 'brine', 'rot', 'mould', 'incense',
    'malt', 'yeast', 'sweat', 'stench', 'reek', 'perfume', 'resin',
  ]),
  touch: Object.freeze([
    'frost', 'ice', 'grit', 'splinter', 'damp', 'draught', 'heat', 'cold', 'wet',
    'wool', 'leather', 'hide', 'hides', 'linen', 'cloth', 'iron', 'nail', 'nails', 'chain',
    'chains', 'plank', 'planks', 'straw',
  ]),
  taste: Object.freeze([
    'bread', 'ale', 'beer', 'wine', 'salt', 'grain', 'meal', 'porridge', 'cheese', 'fish',
    'meat', 'honey', 'vinegar', 'water', 'broth', 'loaf', 'loaves', 'cider', 'mead',
  ]),
});

/**
 * A noun's sense bucket. The published arrays are a partition (`SENSORY_NOUNS`' own note), so
 * no noun reaches this map twice today; the FIRST-bucket-wins fold is kept as the fail-safe
 * that made the duplicates harmless when they existed, and `bucketAudit()` is what proves the
 * partition rather than this map, which cannot fail.
 * @type {Readonly<Record<string, string>>}
 */
export const SENSE_OF_NOUN = Object.freeze(Object.fromEntries(
  Object.entries(SENSORY_NOUNS)
    .flatMap(([sense, nouns]) => nouns.map((noun) => [noun, sense]))
    .reverse(),
));

/**
 * THE PARTITION, MEASURED OVER THE PUBLISHED ARRAYS — the figure the gate asserts.
 *
 * ⭐ IT COUNTS THE ARRAYS, NEVER `SENSE_OF_NOUN`. A count over the resolver is a tautology: the
 * map has one value per key by construction, so an assertion over it passes on any lexicon,
 * duplicated or not. Counting the published entries against the distinct nouns is the same
 * question asked where it can be answered wrongly — `entries !== distinct` reds, and it read
 * 169 against 166 before the three dual-bucket nouns were struck.
 * @returns {{entries: number, distinct: number, duplicates: Array<{noun: string,
 *   buckets: string[]}>, perBucket: Record<string, number>}}
 */
export function bucketAudit() {
  /** @type {Map<string, string[]>} */
  const where = new Map();
  /** @type {Record<string, number>} */
  const perBucket = {};
  let entries = 0;
  for (const [sense, nouns] of Object.entries(SENSORY_NOUNS)) {
    perBucket[sense] = nouns.length;
    entries += nouns.length;
    for (const noun of nouns) {
      if (!where.has(noun)) where.set(noun, []);
      /** @type {string[]} */ (where.get(noun)).push(sense);
    }
  }
  return {
    entries,
    distinct: where.size,
    duplicates: [...where].filter(([, b]) => b.length > 1).map(([noun, buckets]) => ({ noun, buckets })),
    perBucket,
  };
}

/**
 * A LICENSED TEXTURE DEVICE, for line 2. A paragraph counts once if it holds any of these.
 * `{slot}` markers are stripped BEFORE the test: a proper-noun slot is a name, not a texture,
 * and counting it would make every variant that says `{settlement}` read as concrete.
 * @param {string} paragraph
 * @returns {boolean}
 */
export function hasTextureDevice(paragraph) {
  const bare = String(paragraph || '').replace(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g, ' ');
  const lower = bare.toLowerCase();
  const words = lower.split(/[^a-z']+/).filter(Boolean);
  if (words.some((w) => SENSE_OF_NOUN[w])) return true;
  // A comparison as a MEASUREMENT IN WORDS (R-DA-11) — never a simile, which is a non-move.
  return /\b(as \w+ as|no (wider|deeper|taller|heavier|longer) than|enough to \w+|the width of|the height of|within a \w+'s walk)\b/.test(lower);
}

/**
 * THE THREE LINES, over a unit of prose.
 * @param {ReadonlyArray<string>} paragraphs
 * @returns {{words: number, paragraphs: number, sensoryNounsPerHundredWords: number,
 *   texturedParagraphShare: number, senseShares: Record<string, number>,
 *   senseSpreadEntropy: number, hits: Record<string, number>}}
 */
export function presenceOf(paragraphs) {
  const paras = (paragraphs || []).map((p) => String(p).replace(/\s+/g, ' ').trim()).filter(Boolean);
  /** @type {Record<string, number>} */
  const hits = {};
  for (const sense of Object.keys(SENSORY_NOUNS)) hits[sense] = 0;
  let words = 0;
  let textured = 0;
  for (const paragraph of paras) {
    const bare = paragraph.replace(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g, ' ');
    const tokens = bare.toLowerCase().split(/[^a-z']+/).filter(Boolean);
    words += tokens.length;
    for (const token of tokens) {
      const sense = SENSE_OF_NOUN[token];
      if (sense) hits[sense] += 1;
    }
    if (hasTextureDevice(paragraph)) textured += 1;
  }
  const total = Object.values(hits).reduce((a, b) => a + b, 0);
  /** @type {Record<string, number>} */
  const senseShares = {};
  for (const [sense, n] of Object.entries(hits)) senseShares[sense] = total ? n / total : 0;
  const entropy = -Object.values(senseShares).filter((s) => s > 0)
    .reduce((a, s) => a + s * log2Det(s), 0) + 0;
  return {
    words,
    paragraphs: paras.length,
    sensoryNounsPerHundredWords: words ? Number(((total / words) * 100).toFixed(3)) : 0,
    texturedParagraphShare: paras.length ? Number((textured / paras.length).toFixed(4)) : 0,
    senseShares,
    senseSpreadEntropy: Number(entropy.toFixed(3)),
    hits,
  };
}
