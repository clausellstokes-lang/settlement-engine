/**
 * scripts/audit/soak-review/prose.mjs — THE REPETITION INSTRUMENT, PROSE ONLY (lane SOAK-2,
 * 2026-11-04; docs/SOAK_1000_2026-11-03.md §3: "A prose-only filter (the audit's definition)
 * is owed").
 *
 * The first instrument counted every screen sentence, so labels and reference rows (the
 * relationship badge "Outstanding Debt", the Viability footer, the supply rows) made its 97%
 * "seen in another town" incomparable with the audit's 16%
 * (docs/GENERATION_COHERENCE_AUDIT_2026-11-02.md §9: "When a DM opens a second settlement, 16%
 * of its story sentences are ones they have already read word for word").
 *
 *  - THE SURFACE FILTER (`proseOfHtml`): a story block is a PARAGRAPH ELEMENT (`<p>`) set at
 *    BODY SIZE (no inline font-size, or one ≥ 12px). The dossier paints labels and badges as
 *    spans, reference and supply rows as divs led by a bold label, relationship labels as 9px
 *    badges, and catalogue descriptions and footers as 11px paragraphs; the filter reads the
 *    element and its type size, never the words.
 *  - A STORY SENTENCE (`storySentencesOf`): a complete sentence (terminal punctuation) of six
 *    words or more inside a story block, compared word for word after
 *    `phrase-repetition.mjs :: normalizeRenderedSentence`.
 *  - THE AUDIT'S FIGURE (`pairwiseRepeat`): over ordered pairs of settlements (A, B), the share
 *    of B's story sentences that A also has, averaged; the same over same-tier pairs, and the
 *    worst same-tier pair.
 *  - SKELETONS (`skeletonOf`): the place's own names masked as @, numbers as #, for the shared
 *    list; `sourcePoolOf` finds a skeleton's longest literal run in `src/` and names the file
 *    and the top-level symbol around it.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';

import { normalizeRenderedSentence } from '../phrase-repetition.mjs';

/** Body type starts here; the dossier's annotation type is 11px and below. */
export const BODY_MIN_PX = 12;
export const MIN_WORDS = 6;

const decode = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;|&#160;/g, ' ');

/**
 * The story blocks of one rendered surface.
 * @param {string} html @returns {string[]}
 */
export function proseOfHtml(html) {
  const out = [];
  const P = /<p\b([^>]*)>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = P.exec(String(html || '')))) {
    const size = /font-size:\s*([\d.]+)px/.exec(m[1]);
    if (size && Number(size[1]) < BODY_MIN_PX) continue;
    const text = decode(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (text) out.push(text);
  }
  return out;
}

const SENTENCE_SPLIT = /(?<=[.!?])\s+(?=[A-Z"“‘'(])|\n+/;
const ENDS = /[.!?]["”’)]?$/;

/** @param {string[]} blocks @returns {string[]} normalized, de-duplicated story sentences */
export function storySentencesOf(blocks) {
  const out = new Set();
  for (const block of blocks) {
    for (const raw of String(block).split(SENTENCE_SPLIT)) {
      const s = raw.trim();
      if (s.split(/\s+/).length < MIN_WORDS || !ENDS.test(s)) continue;
      out.add(normalizeRenderedSentence(s));
    }
  }
  return [...out];
}

/** @param {string} sentence normalized @param {string[]} names @returns {string} */
export function skeletonOf(sentence, names) {
  let skel = String(sentence);
  for (const n of [...names].filter((x) => typeof x === 'string' && x.length > 2).map((x) => x.toLowerCase()).sort((a, z) => z.length - a.length)) skel = skel.split(n).join('@');
  return skel.replace(/\d[\d,.]*/g, '#');
}

/**
 * The audit's repetition figure.
 * @param {Array<{ tier: string, sentences: string[] }>} towns (sentence keys; any hashable string)
 * @returns {{ towns: number, all: number, sameTier: number, maxSameTier: number, maxPair: string[] | null, byTier: Record<string, number> }}
 */
export function pairwiseRepeat(towns) {
  const list = towns.filter((t) => t.sentences.length);
  const N = list.length;
  const all = new Map(); const perTier = new Map();
  for (const t of list) {
    for (const h of t.sentences) all.set(h, (all.get(h) || 0) + 1);
    const m = perTier.get(t.tier) ?? new Map(); for (const h of t.sentences) m.set(h, (m.get(h) || 0) + 1); perTier.set(t.tier, m);
  }
  const tierN = new Map(); for (const t of list) tierN.set(t.tier, (tierN.get(t.tier) || 0) + 1);
  let sumAll = 0; let sumSame = 0; const sumByTier = new Map();
  for (const t of list) {
    const m = perTier.get(t.tier);
    let a = 0; let s = 0; for (const h of t.sentences) { a += all.get(h) - 1; s += m.get(h) - 1; }
    sumAll += a / t.sentences.length; sumSame += s / t.sentences.length;
    sumByTier.set(t.tier, (sumByTier.get(t.tier) || 0) + s / t.sentences.length);
  }
  let samePairs = 0; const byTier = {};
  for (const [tier, n] of tierN) { samePairs += n * (n - 1); if (n > 1) byTier[tier] = sumByTier.get(tier) / (n * (n - 1)); }
  // The worst same-tier pair, through an inverted index per tier.
  let maxSameTier = 0; let maxPair = null;
  for (const tier of tierN.keys()) {
    const members = list.filter((t) => t.tier === tier);
    const postings = new Map();
    members.forEach((t, k) => { for (const h of t.sentences) { const p = postings.get(h) ?? []; p.push(k); postings.set(h, p); } });
    members.forEach((b, kb) => {
      const shared = new Map();
      for (const h of b.sentences) for (const ka of postings.get(h)) if (ka !== kb) shared.set(ka, (shared.get(ka) || 0) + 1);
      for (const [ka, c] of shared) { const r = c / b.sentences.length; if (r > maxSameTier) { maxSameTier = r; maxPair = [members[ka].seed ?? String(ka), b.seed ?? String(kb)]; } }
    });
  }
  return { towns: N, all: N > 1 ? sumAll / (N * (N - 1)) : 0, sameTier: samePairs ? sumSame / samePairs : 0, maxSameTier, maxPair, byTier };
}

/**
 * Where a skeleton's words live in `src/`: its longest literal run, grepped.
 * @param {string} skeleton @param {string} repoRoot @returns {{ file: string, symbol: string, fragment: string } | null}
 */
export function sourcePoolOf(skeleton, repoRoot) {
  const runs = String(skeleton).split(/[@#]/).map((x) => x.replace(/^[\s,.;:'’"-]+|[\s,.;:'’"-]+$/g, '')).filter((x) => x.length >= 16).sort((a, z) => z.length - a.length);
  for (const fragment of runs.slice(0, 3)) {
    let files;
    try { files = execFileSync('grep', ['-rliF', '--include=*.js', '--include=*.jsx', '--exclude-dir=node_modules', fragment, resolve(repoRoot, 'src')], { encoding: 'utf-8' }).trim().split('\n').filter(Boolean); } catch { files = []; }
    if (!files.length) continue;
    const file = files.sort((a, z) => Number(/\.generated\./.test(a)) - Number(/\.generated\./.test(z)))[0];
    const lines = readFileSync(file, 'utf-8').split('\n');
    const at = lines.findIndex((l) => l.toLowerCase().includes(fragment.toLowerCase()));
    let symbol = '(module)';
    for (let k = at; k >= 0; k -= 1) { const d = /^(?:export\s+)?(?:const|let|function\*?|class)\s+([A-Za-z_$][\w$]*)/.exec(lines[k]); if (d) { symbol = d[1]; break; } }
    return { file: relative(repoRoot, file), symbol, fragment, alsoIn: files.length - 1 };
  }
  return null;
}
