// fingerprint.mjs <label> <textfile...> — a STYLE FINGERPRINT over plain prose (derived numbers only; stores no passage).
// The same measures the corpus probe takes over our own prose, so exemplar and estate sit in one table.
import { readFileSync, writeFileSync } from 'node:fs';
const [,, label, ...files] = process.argv;
const text = files.map(f => readFileSync(f, 'utf8')).join('\n');
const paras = text.split(/\n\s*\n/).map(p => p.replace(/\s+/g, ' ').trim()).filter(p => p.length > 20);
const sentences = paras.flatMap(p => p.split(/(?<=[.?!]["'”’)]?)\s+(?=["'“‘(]?[A-Z])/)).map(s => s.trim()).filter(s => s.split(/\s+/).length >= 2);
const words = s => s.split(/\s+/).filter(Boolean);
const lens = sentences.map(s => words(s).length);
const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);
const sorted = [...lens].sort((a, b) => a - b); const pct = p => sorted[Math.floor(p * (sorted.length - 1))];
// consecutive-sentence length variation (burstiness proxy): mean absolute difference between neighbours / mean
const burst = lens.slice(1).reduce((a, l, i) => a + Math.abs(l - lens[i]), 0) / Math.max(1, lens.length - 1) / mean;
const count = re => sentences.filter(s => re.test(s)).length;
const rate = n => +(n / sentences.length).toFixed(4);
const first = sentences.map(s => words(s)[0].replace(/[^A-Za-z'’]/g, '').toLowerCase());
const last = sentences.map(s => words(s).slice(-1)[0].replace(/[^A-Za-z'’]/g, '').toLowerCase());
const top = arr => { const m = {}; for (const w of arr) m[w] = (m[w] || 0) + 1; return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 12); };
const adverbs = sentences.reduce((a, s) => a + (s.match(/\b\w+ly\b/g) || []).filter(w => !/^(only|early|family|likely|holy|ally|belly|jolly|folly|rally|tally|bully|fully|reply|apply|supply|July|Italy|lily|melancholy|assembly|monopoly|anomaly)$/i.test(w)).length, 0);
const adjPairs = count(/\b\w+(ed|ing|ous|ful|less|ive|al|ant|ent|y) and \w+(ed|ing|ous|ful|less|ive|al|ant|ent|y)\b/);
const out = {
  label, files, paragraphs: paras.length, sentences: sentences.length,
  wordsPerSentence: { mean: +mean.toFixed(1), sd: +sd.toFixed(1), p10: pct(.1), p50: pct(.5), p90: pct(.9), shareUnder8: rate(lens.filter(x => x < 8).length), shareOver30: rate(lens.filter(x => x > 30).length), neighbourVariation: +burst.toFixed(3) },
  sentencesPerParagraph: +(sentences.length / paras.length).toFixed(2),
  punctuation: { semicolonRate: rate(count(/;/)), colonRate: rate(count(/:\s/)), emDashRate: rate(count(/—|--/)), questionRate: rate(count(/\?/)), exclamationRate: rate(count(/!/)), parenthesisRate: rate(count(/\(/)) },
  shapes: { antithesisRate: rate(count(/\bnot [^.,;]{1,40},? but\b|\brather than\b|, not [a-z]|\bless [^.,;]{1,30} than\b/i)), triadRate: rate(count(/,[^,.]+,[^,.]+,? and [^,.]+[.;]/)), participialOpenerRate: rate(first.filter(w => /ing$/.test(w) && !/^(thing|nothing|something|king|spring|during|ring|string|morning|evening|bring|sing)$/.test(w)).length), whichTailRate: rate(count(/, which\b/)), doubledAdjectiveRate: rate(adjPairs), adverbsPerSentence: +(adverbs / sentences.length).toFixed(3), thereIsOpenerRate: rate(sentences.filter(s => /^(There|It) (is|was|were|are)\b/.test(s)).length), dialogueShare: rate(count(/["“]/)) },
  closers: { abstractNounRate: rate(last.filter(w => /(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/.test(w)).length), pronounRate: rate(last.filter(w => /^(it|them|him|her|us|me|you|this|that|there|here)$/.test(w)).length), topClosers: top(last) },
  openers: { topOpeners: top(first), sameOpenerAsPreviousRate: rate(first.slice(1).filter((w, i) => w === first[i]).length) },
  runsOfThreeSameLengthBand: (() => { const band = l => l < 8 ? 's' : l > 22 ? 'l' : 'm'; let runs = 0; for (let i = 2; i < lens.length; i++) if (band(lens[i]) === band(lens[i - 1]) && band(lens[i]) === band(lens[i - 2])) runs++; return rate(runs); })(),
};
const outFile = process.env.FP_OUT || `${label}.fingerprint.json`; writeFileSync(outFile, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
