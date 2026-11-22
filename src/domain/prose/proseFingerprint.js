/**
 * domain/prose/proseFingerprint.js — THE STYLE FINGERPRINT, in the estate.
 *
 * WHY IT LIVES HERE. Owner law §912.2 reads every soft rule as a BAND measured from the
 * fourteen exemplar records, and §912.3 sets three numbers over those bands — the BUDGET
 * (how many soft rules one entry may exceed), the DEPTH (how far), and the PERFECTION
 * CEILING (a unit inside every band is flagged suspect). None of that is checkable unless
 * the estate's own prose is measured by THE SAME INSTRUMENT the exemplars were. So this is
 * that instrument, in the repo, over any unit of text: a variant, a pool, a tab, a register.
 *
 * ⭐ THE TWENTY-ONE RATE METRICS ARE THE SOFT RULES' PROXIES, NOT THE RULES. The sitting
 * says so in its own declared limits, and this file repeats it because a number that is
 * quoted often enough starts to be believed: `triadRate` is not "the tricolon rule", it is
 * the shape a tricolon usually makes. A rule with no proxy here is not measured by these
 * arms and the walker says NOT-EXECUTABLE rather than scoring it.
 *
 * ⚠ THE FORMULAS ARE A SECOND SPELLING and the drift is real. The exemplar fingerprints were
 * taken by the research kit's own 33-line tool, which lives outside this repo; the bands the
 * three-numbers arms compare against were computed from ITS output. If these formulas drift
 * from that tool's, the estate is measured on one ruler and the exemplars on another and
 * every depth figure is wrong. Three guards: the metric ids below are the fingerprint JSON's
 * own dotted paths, so a band file and a measurement cannot silently mis-align; the walker
 * refuses a band set whose keys do not cover the metrics it is asked to score; and the
 * derivation of each formula is written beside it.
 *
 * ⭐ THE THREE PRESENCE KEYS SIT BESIDE `metrics`, NEVER INSIDE IT (Part B §18; SITTING §L.2
 * item 71). §13.2's presence measure is REPORTED and never gates, and `RATE_METRICS` is the
 * denominator of the owner's BUDGET — a third of the soft rules "measurable on the unit". Move
 * the three into that list and 21 becomes 24, every BUDGET share silently re-bases, and the
 * chair's measured numbers stop meaning what they were measured to mean. So `fingerprint()`
 * returns a `presence` block alongside `metrics`, `scoreAgainstBands` is untouched, and the
 * twenty-one stay twenty-one.
 *
 * PURE, HEADLESS. No I/O, no clock, no RNG. Nothing here runs at the draw.
 */
import { presenceOf } from './presenceMeasure.js';

/**
 * The rate-like metric ids, as DOTTED PATHS into the fingerprint shape. These twenty-one are
 * exactly the leaves the three-numbers measurement used: present in every exemplar, valued
 * in [0, 1] across all of them, and not a count or a length statistic.
 * @type {ReadonlyArray<string>}
 */
export const RATE_METRICS = Object.freeze([
  'wordsPerSentence.shareUnder8',
  'wordsPerSentence.shareOver30',
  'wordsPerSentence.neighbourVariation',
  'punctuation.semicolonRate',
  'punctuation.colonRate',
  'punctuation.emDashRate',
  'punctuation.questionRate',
  'punctuation.exclamationRate',
  'punctuation.parenthesisRate',
  'shapes.antithesisRate',
  'shapes.triadRate',
  'shapes.participialOpenerRate',
  'shapes.whichTailRate',
  'shapes.doubledAdjectiveRate',
  'shapes.adverbsPerSentence',
  'shapes.thereIsOpenerRate',
  'shapes.dialogueShare',
  'closers.abstractNounRate',
  'closers.pronounRate',
  'openers.sameOpenerAsPreviousRate',
  'runsOfThreeSameLengthBand',
]);

/** Words that end in -ly and are not adverbs. Carried verbatim from the kit's tool. */
const NOT_ADVERBS = /^(only|early|family|likely|holy|ally|belly|jolly|folly|rally|tally|bully|fully|reply|apply|supply|July|Italy|lily|melancholy|assembly|monopoly|anomaly)$/i;
/** Participial openers that are not participles. Carried verbatim. */
const NOT_PARTICIPLES = /^(thing|nothing|something|king|spring|during|ring|string|morning|evening|bring|sing)$/;

/** @param {string} s @returns {string[]} */
const wordsOf = (s) => s.split(/\s+/).filter(Boolean);

/**
 * Split a text unit into sentences, by the kit tool's own rule.
 * @param {ReadonlyArray<string>} paragraphs
 * @returns {string[]}
 */
export function sentencesIn(paragraphs) {
  return paragraphs
    .flatMap((p) => p.split(/(?<=[.?!]["'”’)]?)\s+(?=["'“‘(]?[A-Z])/))
    .map((s) => s.trim())
    .filter((s) => wordsOf(s).length >= 2);
}

/**
 * The fingerprint of one unit of prose. Paragraphs in, derived numbers out — no passage is
 * stored, exactly as the kit's tool declares of itself.
 * @param {ReadonlyArray<string>} paragraphs each already whitespace-normalised
 * @returns {{sentences: number, paragraphs: number, metrics: Record<string, number>,
 *   presence: ReturnType<typeof presenceOf>}} `presence` sits BESIDE `metrics` and is never
 *   scored — see the header: it is Part B §13.2's reported measure, not a soft rule, and
 *   moving it into `metrics` would re-base the owner's BUDGET denominator from 21 to 24
 */
export function fingerprint(paragraphs) {
  const paras = (paragraphs || []).map((p) => String(p).replace(/\s+/g, ' ').trim()).filter((p) => p.length > 20);
  const sentences = sentencesIn(paras);
  if (sentences.length === 0) {
    return {
      sentences: 0, paragraphs: paras.length, metrics: {}, presence: presenceOf(paras),
    };
  }
  const lens = sentences.map((s) => wordsOf(s).length);
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
  const burst = lens.slice(1).reduce((a, l, i) => a + Math.abs(l - lens[i]), 0)
    / Math.max(1, lens.length - 1) / (mean || 1);
  /** @param {RegExp} re */
  const count = (re) => sentences.filter((s) => re.test(s)).length;
  /** @param {number} n */
  const rate = (n) => Number((n / sentences.length).toFixed(4));
  const first = sentences.map((s) => wordsOf(s)[0].replace(/[^A-Za-z'’]/g, '').toLowerCase());
  const last = sentences.map((s) => wordsOf(s).slice(-1)[0].replace(/[^A-Za-z'’]/g, '').toLowerCase());
  const adverbs = sentences.reduce(
    (a, s) => a + (s.match(/\b\w+ly\b/g) || []).filter((w) => !NOT_ADVERBS.test(w)).length,
    0,
  );
  const adjPairs = count(/\b\w+(ed|ing|ous|ful|less|ive|al|ant|ent|y) and \w+(ed|ing|ous|ful|less|ive|al|ant|ent|y)\b/);
  /** @param {number} l */
  const band = (l) => (l < 8 ? 's' : (l > 22 ? 'l' : 'm'));
  let runs = 0;
  for (let i = 2; i < lens.length; i++) {
    if (band(lens[i]) === band(lens[i - 1]) && band(lens[i]) === band(lens[i - 2])) runs += 1;
  }
  return {
    sentences: sentences.length,
    paragraphs: paras.length,
    metrics: {
      'wordsPerSentence.shareUnder8': rate(lens.filter((x) => x < 8).length),
      'wordsPerSentence.shareOver30': rate(lens.filter((x) => x > 30).length),
      'wordsPerSentence.neighbourVariation': Number(burst.toFixed(3)),
      'punctuation.semicolonRate': rate(count(/;/)),
      'punctuation.colonRate': rate(count(/:\s/)),
      'punctuation.emDashRate': rate(count(/—|--/)),
      'punctuation.questionRate': rate(count(/\?/)),
      'punctuation.exclamationRate': rate(count(/!/)),
      'punctuation.parenthesisRate': rate(count(/\(/)),
      'shapes.antithesisRate': rate(count(/\bnot [^.,;]{1,40},? but\b|\brather than\b|, not [a-z]|\bless [^.,;]{1,30} than\b/i)),
      'shapes.triadRate': rate(count(/,[^,.]+,[^,.]+,? and [^,.]+[.;]/)),
      'shapes.participialOpenerRate': rate(first.filter((w) => /ing$/.test(w) && !NOT_PARTICIPLES.test(w)).length),
      'shapes.whichTailRate': rate(count(/, which\b/)),
      'shapes.doubledAdjectiveRate': rate(adjPairs),
      'shapes.adverbsPerSentence': Number((adverbs / sentences.length).toFixed(3)),
      'shapes.thereIsOpenerRate': rate(sentences.filter((s) => /^(There|It) (is|was|were|are)\b/.test(s)).length),
      'shapes.dialogueShare': rate(count(/["“]/)),
      'closers.abstractNounRate': rate(last.filter((w) => /(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/.test(w)).length),
      'closers.pronounRate': rate(last.filter((w) => /^(it|them|him|her|us|me|you|this|that|there|here)$/.test(w)).length),
      'openers.sameOpenerAsPreviousRate': rate(first.slice(1).filter((w, i) => w === first[i]).length),
      runsOfThreeSameLengthBand: rate(runs),
    },
    // ── THE PRESENCE BLOCK (Part B §13.2's three lines) — REPORTED, never scored ──────
    // 1. concrete sensory nouns per hundred words, from the published closed lexicon;
    // 2. the share of paragraphs carrying a licensed texture device;
    // 3. the spread across senses, with the entropy printed.
    // Deliberately OUTSIDE `metrics`: see the header. A band file that does not carry these
    // keys is not missing anything, because nothing scores them.
    presence: presenceOf(paras),
  };
}

/**
 * @typedef {object} MetricBand
 * @property {number} lo the exemplars' minimum
 * @property {number} hi the exemplars' maximum
 */

/**
 * Score one unit against the exemplar bands: which metrics fall outside, and how far, in
 * BAND-WIDTHS (owner law §912.2: "distance is counted in band-widths outside the band").
 *
 * A band of zero width is SKIPPED, not scored as an infinite depth — every exemplar agreeing
 * exactly on a metric makes that metric a constant, and a constant measures nothing.
 * @param {Record<string, number>} metrics
 * @param {Record<string, MetricBand>} bands
 * @returns {{scored: string[], exceeded: Array<{metric: string, value: number, depth: number,
 *   side: 'under'|'over'}>, unscorable: string[]}}
 */
export function scoreAgainstBands(metrics, bands) {
  /** @type {string[]} */
  const scored = [];
  /** @type {string[]} */
  const unscorable = [];
  /** @type {Array<{metric: string, value: number, depth: number, side: 'under'|'over'}>} */
  const exceeded = [];
  for (const metric of RATE_METRICS) {
    const band = bands?.[metric];
    const value = metrics?.[metric];
    if (!band || typeof value !== 'number') { unscorable.push(metric); continue; }
    const width = band.hi - band.lo;
    if (!(width > 0)) { unscorable.push(metric); continue; }
    scored.push(metric);
    if (value < band.lo) exceeded.push({ metric, value, depth: (band.lo - value) / width, side: 'under' });
    else if (value > band.hi) exceeded.push({ metric, value, depth: (value - band.hi) / width, side: 'over' });
  }
  return { scored, exceeded, unscorable };
}

/**
 * Build the bands from a set of exemplar fingerprints — the min…max of the OTHERS, so a
 * record is never scored against a band it helped define. That leave-one-out shape is how
 * the three numbers were measured and is the only honest way to ask "how far outside its
 * peers does a human record sit?".
 * @param {Record<string, Record<string, number>>} exemplars label → metrics
 * @param {string} [excluding] a label to leave out
 * @returns {Record<string, MetricBand>}
 */
export function bandsFrom(exemplars, excluding) {
  /** @type {Record<string, MetricBand>} */
  const bands = {};
  const labels = Object.keys(exemplars || {}).filter((l) => l !== excluding);
  if (labels.length < 2) {
    throw new Error(`proseFingerprint.bandsFrom: ${labels.length} exemplar(s) after exclusion; a band needs at least two`);
  }
  for (const metric of RATE_METRICS) {
    const values = labels.map((l) => exemplars[l]?.[metric]).filter((v) => typeof v === 'number');
    if (values.length !== labels.length) continue;
    bands[metric] = { lo: Math.min(...values), hi: Math.max(...values) };
  }
  return bands;
}
