/**
 * check-pair.mjs — THE PAIR INSTRUMENT: a rewrite's BEFORE against its AFTER, executed rather
 * than eyeballed.
 *
 * ── WHAT IT IS, AND WHERE IT CAME FROM ─────────────────────────────────────────────
 * Written in lane S12A-CHECKPAIR (2026-09-06) as a kit tool and run by hand at the taste
 * sample; landed here by SEAM car 5 because ARCH §8.4 gives it a GATE row (arm A6: parent to
 * face) and a kit tool cannot be a gate. The behaviour is the kit's, arm for arm, with ONE
 * addition: the LONGER arm is switchable, because a FACE is not a rewrite.
 *
 * ⛔ WHY THE LONGER ARM MUST BE SUPPRESSED FOR FACES, AND ONLY FOR FACES. On a REWRITE, an
 * AFTER longer than its BEFORE is the drift the arm was written to catch: the wave's own
 * failure mode is a sentence that grows a clause while claiming to have been tightened. On a
 * WORDING SET, the four faces are SIBLINGS of one claim and differing length is the point of
 * having four; a face refused for being longer than face 0 would make face 0 a ceiling nobody
 * ruled. So `pairArms` takes `longer` and the CLI keeps it ON, exactly as the kit ran it.
 *
 * ── THE CHANNELS ───────────────────────────────────────────────────────────────────
 *   FAIL      a mechanical rule the pair breaks.
 *   WITHHELD  R4-BAND: a contrast was cut in a pool that HAS sibling bands. Whether the
 *             rejected alternative names what a sibling band supplies is semantics, so the
 *             mechanical pass is withheld for the refuter and is never counted as a pass.
 *   NOTE      a property the AFTER inherits (marks) or a pre-existing debt the pair neither
 *             causes nor cures (a shared opener that was already there).
 * A mechanical pass is NOT a claim-preservation verdict; that is the refuter's job, and the
 * summary line says so in those words.
 *
 * ── RUNNING IT ─────────────────────────────────────────────────────────────────────
 *   node scripts/check-pair.mjs <dock> <pairs.json>
 * The leaves are loaded as MODULES (pure data), so marks, angles and slots are read off the
 * objects and never regexed out of source.
 *
 * @enforced-by tests/lint/proseComposed.walker.test.js
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * One pair as the caller states it.
 * @typedef {object} ProsePair
 * @property {string|number} [id]
 * @property {string} before
 * @property {string} after
 * @property {string} [contrastWaived] the refuter's written waiver for the R4-BAND limb
 */
/**
 * One located corpus entry — the BEFORE's home, which is what makes the sibling arms possible.
 * @typedef {object} PairContext
 * @property {string} block
 * @property {string} pool
 * @property {string} poolId
 * @property {number} idx the variant's position in its pool
 * @property {string} angle
 * @property {ReadonlyArray<string>} marks
 * @property {string} file
 * @property {ReadonlyArray<string>} siblings the OTHER pool keys of the same block
 */
/**
 * @typedef {{fails: string[], withheld: string[], notes: string[]}} PairResult
 */

/**
 * §0d's six-band duration vocabulary plus the general time words. Any of these ADDED by a
 * rewrite is a duration claim the pool key may not license (T5).
 */
const DURATION = /\b(this season|within the year|years on|years old|a decade|a generation|older than its bearers|year|years|season|seasons|winter|winters|generation|generations|lifetime|decade|decades|month|months|week|weeks|day|days|ago|since|every|always|never|long|recent|lately|now|yet|still|already)\b/gi;
/** §0d's QUANTITY_BANDS plus the authored magnitudes and the count NOUNS: a moved noun moves the band. */
const COUNT = /\b(nobody|no one|a few souls|a few|a dozen or so|a dozen|dozens|a hundred or so|a hundred|several hundred|many hundreds|hundreds|thousands|a handful|a score|scores|most|all but|half|all|none|many|several|some|souls|people|households|families|hands|mouths|heads)\b/gi;
/** The antithesis SHAPE, counted rather than the phrase, so a moved column still reads. */
const CONTRAST = /\brather than\b|\bnot [^.,;]{1,40}, but\b|\bnot [^.,;]{1,40} but\b|, not [a-z][^.,;]{0,40}[.;]|\bnot [^.,;]{1,30}, (it|this|that) is\b|\bless [^.,;]{1,30} than\b/g;
/** The per-variant NET ration: a word whose count RISES at the point of edit is a finding. */
const RATION = Object.freeze([
  /\brather than\b/g, /\bwhich (is|means)\b/g, /\b(nobody|no one|nothing)\b/g, /\bits own\b/g,
  /\bwhatever\b/g, /\benough (to|that)\b/g, /\b(kind|sort) of\b/g, /\bquiet(ly)?\b/g,
  /\b(still|yet|already)\b/g,
]);
/** Words too common to identify a rejected alternative. */
const ALT_STOP = new Set(['that', 'this', 'with', 'from', 'have', 'been', 'being', 'than', 'then', 'they', 'them', 'their', 'there', 'here', 'what', 'when', 'which', 'would', 'could', 'should', 'about', 'into', 'over', 'rather', 'anything', 'something', 'nothing', 'everything', 'more', 'most', 'much', 'only', 'also', 'just', 'such', 'other', 'same', 'town', 'settlement', 'place', 'thing', 'things']);

/** @param {string} text @returns {Set<string>} */
const slotsOf = (text) => new Set([...String(text).matchAll(/\{([a-z_0-9]+)\}/g)].map((hit) => hit[1]));
/** @param {string} text @returns {number} */
const wordsIn = (text) => String(text).trim().split(/\s+/).filter(Boolean).length;
/** @param {string} text @returns {string} */
const lower = (text) => String(text).toLowerCase();
/** @param {string} text @param {RegExp} re @returns {Set<string>} */
const setOf = (text, re) => new Set((lower(text).match(re) || []).map((hit) => hit.toLowerCase()));
/** U2's ceiling and A11's spread read the same counter. @param {string} text @returns {number} */
const sentencesIn = (text) => String(text).replace(/\{[a-z_0-9]+\}/g, 'X')
  .split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter(Boolean).length;
/** A11's opener: the first two words, slots normalised to one token. @param {string} text @returns {string} */
const openerOf = (text) => String(text).replace(/\{[a-z_0-9]+\}/g, '{}').trim().split(/\s+/).slice(0, 2)
  .map((word) => word.toLowerCase().replace(/^[^a-z{]+|[^a-z}]+$/g, '')).filter(Boolean).join(' ');

/**
 * A8's band half: the AXIS of a pool key, derived from the MEASURED key grammar. 708 keys over
 * 68 blocks fall in three shapes: the colon form `<AXIS>: <band>` (346), the axis run
 * `<lowercase axis words> <BAND tokens>` (209), and a bare band label with no axis at all
 * (153) — and a bare-label block IS one band ladder, so every sibling of it is a band.
 * @param {string} key
 * @returns {string}
 */
export function axisOf(key) {
  const at = String(key).indexOf(':');
  if (at > 0) return String(key).slice(0, at).trim().toLowerCase();
  const words = String(key).split(/\s+/);
  if (!words.length) return '';
  if (words.every((word) => /^[a-z][a-z0-9_'’-]*$/.test(word))) return words[0].toLowerCase();
  /** @type {string[]} */
  const run = [];
  for (const word of words) {
    if (!/^[a-z][a-z0-9_'’-]*$/.test(word)) break;
    run.push(word);
  }
  return run.join(' ').toLowerCase();
}

/**
 * The sibling pool keys that are BANDS of the same axis, or — where the key grammar gives no
 * axis — A8's letter: every band of the same block.
 * @param {PairContext} context
 * @returns {string[]}
 */
export function bandSiblingsOf(context) {
  if (!context.siblings.length) return [];
  const axis = axisOf(context.pool);
  const same = axis ? context.siblings.filter((key) => axisOf(key) === axis) : [];
  return same.length ? same : [...context.siblings];
}

/**
 * ⭐ THE ARMS, FOR ONE PAIR. Pure: the corpus reaches it as `context` and as `pool`, never as a
 * module read, so a caller with a fixture drives every arm without a dock.
 * @param {ProsePair} pair
 * @param {{context?: PairContext|null, pool?: {key: string, block: string,
 *   texts: ReadonlyArray<string>, angles: ReadonlyArray<string>}|null,
 *   siblingTexts?: ReadonlyArray<{pool: string, angle: string, text: string}>}} located
 * @param {{longer?: boolean}} [options] `longer` defaults to TRUE, the kit's behaviour; arm A6
 *   passes FALSE, because a face is a sibling of its parent and not a rewrite of it.
 * @returns {PairResult}
 */
export function pairArms(pair, located, options = {}) {
  const longerArm = options.longer !== false;
  const context = located.context || null;
  /** @type {string[]} */
  const fails = [];
  /** @type {string[]} */
  const withheld = [];
  /** @type {string[]} */
  const notes = [];
  if (!context) fails.push('NOT LOCATED in the dossier corpus (state+causal)');
  if (context && context.marks.length) {
    notes.push(`MARKS ${JSON.stringify(context.marks)}${context.marks.includes('dm-only') ? ' — dm-only: the AFTER inherits the mark and the audience law' : ''}`);
  }
  const before = slotsOf(pair.before);
  const after = slotsOf(pair.after);
  if ([...before].some((slot) => !after.has(slot)) || [...after].some((slot) => !before.has(slot))) {
    fails.push(`SLOTS differ: before {${[...before]}} after {${[...after]}}`);
  }
  if (/\d/.test(pair.after)) fails.push('DIGIT in AFTER');
  if (/\d+\s*%|percent/i.test(pair.after)) fails.push('PERCENT in AFTER (§0d: proportions in words)');
  if (/—/.test(pair.after)) fails.push('EM DASH in AFTER');
  if (/!/.test(pair.after)) fails.push('EXCLAMATION in AFTER');
  if (longerArm && wordsIn(pair.after) > wordsIn(pair.before)) {
    fails.push(`LONGER: ${wordsIn(pair.before)} → ${wordsIn(pair.after)} words`);
  }
  const durationBefore = setOf(pair.before, DURATION);
  const addedDuration = [...setOf(pair.after, DURATION)].filter((word) => !durationBefore.has(word));
  if (addedDuration.length) fails.push(`DURATION/TIME words ADDED: ${addedDuration.join(', ')}`);
  const countBefore = setOf(pair.before, COUNT);
  const countAfter = setOf(pair.after, COUNT);
  const addedCount = [...countAfter].filter((word) => !countBefore.has(word));
  const lostCount = [...countBefore].filter((word) => !countAfter.has(word));
  if (addedCount.length) fails.push(`COUNT words ADDED: ${addedCount.join(', ')}`);
  if (lostCount.length) fails.push(`COUNT words LOST (band noun moved?): ${lostCount.join(', ')}`);
  if (context && context.siblings.length) {
    const siblingWords = new Set(context.siblings
      .flatMap((key) => lower(key).replace(/[^a-z ]/g, ' ').split(/\s+/))
      .filter((word) => word.length > 3 && !['quantity', 'candidate', 'kind'].includes(word)));
    const cut = [...new Set(lower(pair.before).replace(/[^a-z ]/g, ' ').split(/\s+/))]
      .filter((word) => siblingWords.has(word) && !lower(pair.after).includes(word));
    if (cut.length) {
      fails.push(`R4: CUT a word that names a SIBLING pool key: ${cut.join(', ')}  (siblings: ${context.siblings.slice(0, 6).join(' | ')})`);
    }
  }
  if (sentencesIn(pair.after) > 2) {
    fails.push(`THREE+ SENTENCES (${sentencesIn(pair.after)}) — the register is one flowing sentence or two short ones`);
  }
  for (const re of RATION) {
    const had = (lower(pair.before).match(re) || []).length;
    const now = (lower(pair.after).match(re) || []).length;
    if (now > had) fails.push(`RATIONED WORD ADDED: ${re.source} ${had} → ${now}`);
  }
  const shapeOf = (text) => (lower(text).match(CONTRAST) || []).length;
  const shapeBefore = shapeOf(pair.before);
  const shapeAfter = shapeOf(pair.after);
  if (shapeAfter > shapeBefore) fails.push(`ANTITHESIS SHAPE ADDED: ${shapeBefore} → ${shapeAfter}`);
  const shapeNote = shapeBefore > 0 && shapeAfter === shapeBefore
    && /rather than/.test(lower(pair.before)) && !/rather than/.test(lower(pair.after));
  if (shapeNote) fails.push('NOTE: "rather than" removed but the antithesis SHAPE survives (a column moved, not the failure mode)');
  if (context && (shapeBefore > shapeAfter || shapeNote)) {
    const bands = bandSiblingsOf(context);
    if (!bands.length) notes.push('R4-BAND n/a: the located pool has NO sibling bands — a contrast may be cut here (A8)');
    else if (pair.contrastWaived) notes.push(`CONTRAST WAIVED by the refuter: ${pair.contrastWaived}  (sibling bands: ${bands.slice(0, 4).join(' | ')})`);
    else {
      withheld.push(`R4-BAND: a contrast was cut in a pool with sibling bands ${bands.map((key) => `"${key}"`).join(' | ')}; the band half is the refuter's — mechanical PASS withheld`);
      /** @type {string[]} */
      const alternatives = [];
      const source = lower(pair.before);
      for (const hit of source.matchAll(CONTRAST)) {
        const tail = source.slice(hit.index, hit.index + hit[0].length + 60);
        const stop = tail.search(/[.;,](?!\d)/);
        alternatives.push(stop > hit[0].length ? tail.slice(0, stop) : tail);
      }
      const altWords = [...new Set(alternatives.join(' ').replace(/[^a-z ]/g, ' ').split(/\s+/))]
        .filter((word) => word.length >= 4 && !ALT_STOP.has(word) && !lower(pair.after).includes(word));
      /** @type {string[]} */
      const touch = [];
      for (const sibling of located.siblingTexts || []) {
        const hits = altWords.filter((word) => new RegExp(`\\b${word}\\b`).test(lower(sibling.text)));
        if (hits.length) touch.push(`"${sibling.pool}" [${sibling.angle}] shares ${hits.join(', ')}`);
      }
      if (touch.length) withheld.push(`  R4-BAND-TEXT: the cut alternative names a word of a sibling band's own TEXT — ${touch.slice(0, 3).join(' ; ')}`);
    }
  }
  const pool = located.pool || null;
  if (context && pool) {
    const afterTexts = pool.texts.map((text, at) => (at === context.idx ? pair.after : text));
    const spreadBefore = pool.texts.map(sentencesIn);
    const spreadAfter = afterTexts.map(sentencesIn);
    const uniform = (list) => list.every((value) => value === list[0]);
    notes.push(`A11 SPREAD (sentences, pool "${pool.key}" ${pool.block}, angles ${pool.angles.map((angle) => angle || '-').join('/')}): ${spreadBefore.join('/')} → ${spreadAfter.join('/')}`);
    if (pool.texts.length > 1 && !uniform(spreadBefore) && uniform(spreadAfter)) {
      fails.push(`A11 POOL SPREAD FLATTENED: ${spreadBefore.join('/')} → ${spreadAfter.join('/')} — every variant of the pool now has the same sentence count where they differed`);
    }
    const openersBefore = pool.texts.map(openerOf);
    const openersAfter = afterTexts.map(openerOf);
    /** @param {string[]} list @returns {Array<[string, number[]]>} */
    const duplicates = (list) => {
      /** @type {Map<string, number[]>} */
      const seen = new Map();
      list.forEach((value, at) => {
        const rows = seen.get(value) || [];
        rows.push(at);
        seen.set(value, rows);
      });
      return [...seen.entries()].filter(([, rows]) => rows.length > 1);
    };
    const dupBefore = duplicates(openersBefore);
    const dupAfter = duplicates(openersAfter);
    const preexisting = dupBefore.map(([opener, rows]) => `"${opener}" (${rows.map((at) => pool.angles[at] || `#${at}`).join(' + ')})`);
    if (preexisting.length) notes.push(`A11 PRE-EXISTING shared opener in this pool (a debt this pair neither causes nor cures): ${preexisting.join(' ; ')}`);
    for (const [opener, rows] of dupAfter) {
      if (!rows.includes(context.idx)) continue;
      if (dupBefore.some(([had, was]) => had === opener && was.includes(context.idx))) continue;
      fails.push(`A11 SHARED OPENER CREATED: the AFTER now opens "${opener}", matching ${rows.filter((at) => at !== context.idx).map((at) => pool.angles[at] || `#${at}`).join(' + ')} in the same pool (the BEFORE opened "${openersBefore[context.idx]}")`);
    }
  }
  if (/\b(will|shall)\b/.test(lower(pair.after)) && !/\b(will|shall)\b/.test(lower(pair.before))) {
    fails.push('FUTURE INDICATIVE ADDED (STATE never FATE)');
  }
  if (/\bwould\b/.test(lower(pair.before)) && !/\bwould\b/.test(lower(pair.after))) {
    fails.push('SUBJUNCTIVE "would" REMOVED — a [threshold] edge may have become a forecast');
  }
  const existentials = (text) => (String(text).match(/(^|[.?!]\s+)(There|It) (is|was|are|were)\b/g) || []).length;
  if (existentials(pair.after) > existentials(pair.before)) fails.push('EXISTENTIAL OPENER ADDED ("There is / It is")');
  const lastWord = (text) => (String(text).trim().replace(/[.?!]+$/, '').split(/\s+/).pop() || '').toLowerCase();
  if (/^(it|them|there|this|that|one)$/.test(lastWord(pair.after))
    && !/^(it|them|there|this|that|one)$/.test(lastWord(pair.before))) {
    fails.push('PRONOUN CLOSER ADDED (land on the civic noun)');
  }
  return { fails, withheld, notes };
}

/**
 * The verdict word for one pair. A WITHHELD verdict is a question the refuter owes an answer
 * on and is never counted as a pass.
 * @param {PairResult} result
 * @returns {string}
 */
export function pairVerdictOf(result) {
  if (result.fails.length) return 'FAIL';
  return result.withheld.length ? 'WITHHELD(R4-BAND)' : 'PASS(mechanical)';
}

/**
 * The dossier corpus, loaded as MODULES so marks, angles and slots come off the objects.
 * @param {string} dock the repo root to read
 * @returns {Promise<{corpus: PairContext[], pools: Map<string, {key: string, block: string,
 *   file: string, texts: string[], angles: string[]}>,
 *   blockIndex: Map<string, Array<{pool: string, angle: string, text: string}>>,
 *   textOf: Map<string, PairContext[]>}>}
 */
export async function loadPairCorpus(dock) {
  /** @type {PairContext[]} */
  const corpus = [];
  /** @type {Map<string, {key: string, block: string, file: string, texts: string[], angles: string[]}>} */
  const pools = new Map();
  /** @type {Map<string, Array<{pool: string, angle: string, text: string}>>} */
  const blockIndex = new Map();
  /** @type {Map<string, PairContext[]>} */
  const textOf = new Map();
  const addPool = (poolId, key, block, file) => {
    if (!pools.has(poolId)) {
      pools.set(poolId, {
        key, block, file, texts: [], angles: [],
      });
    }
    return pools.get(poolId);
  };
  const record = (entry, text) => {
    corpus.push(entry);
    const bucket = blockIndex.get(`${entry.file}::${entry.block}`) || [];
    bucket.push({ pool: entry.pool, angle: entry.angle, text });
    blockIndex.set(`${entry.file}::${entry.block}`, bucket);
    const hits = textOf.get(text) || [];
    hits.push(entry);
    textOf.set(text, hits);
  };
  const stateDir = path.join(dock, 'src/data/dossierStateProse');
  for (const name of readdirSync(stateDir).filter((file) => file.endsWith('.generated.js'))) {
    const table = Object.values(await import(pathToFileURL(path.join(stateDir, name)).href))[0];
    for (const [block, body] of Object.entries(table)) {
      for (const [pool, variants] of Object.entries(body.pools || {})) {
        const poolId = `${name}::${block}::${pool}`;
        const held = addPool(poolId, pool, block, name);
        for (const variant of variants) {
          const idx = held.texts.length;
          held.texts.push(variant.text);
          held.angles.push(variant.angle || '');
          record({
            block,
            pool,
            poolId,
            idx,
            angle: variant.angle || '',
            marks: variant.marks || [],
            file: name,
            siblings: Object.keys(body.pools).filter((key) => key !== pool),
          }, variant.text);
        }
      }
    }
  }
  const causal = Object.values(await import(pathToFileURL(path.join(dock, 'src/data/dossierCausalProse.generated.js')).href))[0];
  let causalPool = 0;
  const walk = (node, key) => {
    if (Array.isArray(node)) {
      const poolId = `causal::${key}::${causalPool}`;
      causalPool += 1;
      const held = addPool(poolId, key, 'CAUSAL', 'causal');
      for (const variant of node) {
        if (!variant || typeof variant.text !== 'string') continue;
        const idx = held.texts.length;
        held.texts.push(variant.text);
        held.angles.push(variant.angle || '');
        record({
          block: 'CAUSAL',
          pool: key,
          poolId,
          idx,
          angle: variant.angle || '',
          marks: variant.marks || [],
          file: 'causal',
          siblings: [],
        }, variant.text);
      }
      return;
    }
    if (node && typeof node === 'object') for (const [name, value] of Object.entries(node)) walk(value, name);
  };
  walk(causal, 'CAUSAL');
  return {
    corpus, pools, blockIndex, textOf,
  };
}

/**
 * Locate one pair's BEFORE in the corpus and hand `pairArms` everything the sibling limbs need.
 * @param {ProsePair} pair
 * @param {Awaited<ReturnType<typeof loadPairCorpus>>} loaded
 * @returns {{context: PairContext|null, pool: {key: string, block: string,
 *   texts: string[], angles: string[]}|null,
 *   siblingTexts: Array<{pool: string, angle: string, text: string}>}}
 */
export function locatePair(pair, loaded) {
  const context = (loaded.textOf.get(pair.before) || [])[0] || null;
  if (!context) return { context: null, pool: null, siblingTexts: [] };
  const pool = loaded.pools.get(context.poolId) || null;
  const siblingTexts = (loaded.blockIndex.get(`${context.file}::${context.block}`) || [])
    .filter((entry) => context.siblings.includes(entry.pool));
  return { context, pool, siblingTexts };
}

/**
 * The CLI, which keeps the kit's behaviour exactly: the LONGER arm ON.
 * @param {string} dock
 * @param {string} pairsPath
 * @returns {Promise<number>} the fail count, which is the exit code
 */
export async function runCheckPair(dock, pairsPath) {
  const loaded = await loadPairCorpus(dock);
  const pairs = JSON.parse(readFileSync(pairsPath, 'utf8'));
  let fails = 0;
  let withheldCount = 0;
  for (const pair of pairs) {
    const located = locatePair(pair, loaded);
    const result = pairArms(pair, located, { longer: true });
    const verdict = pairVerdictOf(result);
    if (result.fails.length) fails += 1;
    else if (result.withheld.length) withheldCount += 1;
    const where = located.context
      ? `${located.context.block} :: ${located.context.pool}${located.context.angle ? ` [${located.context.angle}]` : ''}`
      : '';
    console.log(`#${pair.id} ${verdict} ${where}`);
    for (const line of result.fails) console.log(`    - ${line}`);
    for (const line of result.withheld) console.log(`    ! ${line}`);
    for (const line of result.notes) console.log(`    · ${line}`);
  }
  const passes = pairs.length - fails - withheldCount;
  console.log(`\ncorpus loaded: ${loaded.corpus.length} variants in ${loaded.pools.size} pools; ${passes} pass mechanically, ${withheldCount} WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), ${fails} fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)`);
  return fails;
}

// ⛔ THE SIDE EFFECT IS GUARDED, so the gate can import the arms without loading 884 KB of
// leaves and printing a report nobody asked for. Car 4's judgment call 1 in one line.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [, , dock, pairsPath] = process.argv;
  process.exitCode = await runCheckPair(dock, pairsPath) > 0 ? 1 : 0;
}
