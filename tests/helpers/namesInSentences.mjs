/**
 * namesInSentences.mjs — the detectors of tests/lint/namesInSentences.walker.test.js (NAMES-1, CN1-CN3), written once;
 * a helper, never a suite. Pure.
 */

/** the record's machinery, never read aloud */
const SKIP_KEYS = new Set(['simulationTrace', 'generationCoherenceReceipt', '_config', 'config', '_seed', 'id']);

/** @param {string} s */
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A string a DM reads as prose: four words or more, a lower-case letter, a sentence's end. @param {string} s */
export const isProse = (s) => s.split(/\s+/).length >= 4 && /[a-z]/.test(s) && (/[.!?…]["”')]?$/.test(s.trim()) || /[.!?] [A-Z]/.test(s));

/** @param {string} s @returns {string[]} the sentences of a string */
export const sentencesOf = (s) => s.split(/(?<=[.!?…]["”')]?)\s+(?=["“'(]?\p{Lu})/u).map((x) => x.trim()).filter((x) => x.split(/\s+/).length >= 4);

/**
 * Every prose string of a record, with its path (array indices as `[]`).
 * @param {unknown} record @returns {Array<{ path: string, text: string }>}
 */
export function proseStringsOf(record) {
  /** @type {Array<{ path: string, text: string }>} */ const out = [];
  /** @param {unknown} v @param {string[]} path */
  const walk = (v, path) => {
    if (typeof v === 'string') { if (isProse(v)) out.push({ path: path.join('.'), text: v }); return; }
    if (Array.isArray(v)) { for (const x of v) walk(x, [...path, '[]']); return; }
    if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (!SKIP_KEYS.has(k)) walk(x, [...path, k]);
  };
  walk(record, []);
  return out;
}

/**
 * Each place a sentence names a power by a bare label: a spelling of the power that does not open on "The", not after
 * "the"/"The", in a sentence that is more than the label (a lone label line, or a label opening a "Label: …" row, is a
 * label). Longest spellings first, so "Merchant Guild Council" is not read as "Merchant Guild".
 * @param {string} sentence @param {string[]} forms @returns {string[]}
 */
export function bareLabelsIn(sentence, forms) {
  /** @type {string[]} */ const out = [];
  /** @type {Array<[number, number]>} */ const taken = [];
  for (const f of [...new Set(forms)].filter((x) => x && !/^the\s/i.test(x)).sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`(?<![\\w'’])${esc(f)}(?![\\w])`, 'g');
    for (let m = re.exec(sentence); m; m = re.exec(sentence)) {
      const i = m.index; const e = i + f.length;
      if (taken.some(([a, b]) => i < b && e > a)) continue;
      taken.push([i, e]);
      const before = sentence.slice(0, i);
      if (/(?:^|\s)(?:the|The)\s+$/.test(before)) continue;
      if (before.trim() === '' && (sentence.slice(e).trim() === '' || /^\s*[:(]/.test(sentence.slice(e)))) continue;
      out.push(f);
    }
  }
  return out;
}

/**
 * Each place a prose form that opens on "The" stands with its capital in the middle of a sentence ("from The Guard").
 * @param {string} sentence @param {string[]} forms @returns {string[]}
 */
export function midSentenceTheIn(sentence, forms) {
  /** @type {string[]} */ const out = [];
  for (const f of new Set(forms.filter((x) => /^The\s/.test(x)))) {
    for (let k = sentence.indexOf(f); k >= 0; k = sentence.indexOf(f, k + 1)) {
      if (k > 0 && !/[.!?:;"“(]\s*$/.test(sentence.slice(0, k))) out.push(f);
    }
  }
  return out;
}

/**
 * Each person whose full name stands twice or more in one sentence.
 * @param {string} sentence @param {Array<{ name: string }>} people @returns {string[]}
 */
export const repeatedNamesIn = (sentence, people) => people.filter((p) => sentence.split(p.name).length - 1 >= 2).map((p) => p.name);

const PRONOUNS = Object.freeze({ female: ['she', 'her', 'hers', 'herself'], male: ['he', 'him', 'his', 'himself'] });

/**
 * Each gendered pronoun of a string that names a person of the town and names no person of that gender (by full name).
 * A pronoun is read lower-case, or with its capital at a sentence's head (so a surname "He" is not read as one). A string
 * that names no person speaks of no one by pronoun in the sense the veil judges (its "he" is "a merchant", "the man who
 * made the promise", someone the string itself brings on); the arm reads the strings that name the town's people.
 * @param {string} text @param {Array<{ name: string, gender: unknown }>} people @returns {string[]}
 */
export function unnamedPronounIn(text, people) {
  /** @type {string[]} */ const out = [];
  if (!people.some((p) => text.includes(p.name))) return out;
  for (const [gender, words] of Object.entries(PRONOUNS)) {
    const used = words.filter((w) => new RegExp(`(?<![\\w'’])${w}(?![\\w'’])|(?:^|[.!?]["”']?\\s+)${w[0].toUpperCase()}${w.slice(1)}(?![\\w'’])`).test(text));
    if (!used.length) continue;
    if (people.some((p) => p.gender === gender && text.includes(p.name))) continue;
    out.push(...used);
  }
  return out;
}

/**
 * Each part of a person's name (a surname, a given name) a string carries as a word where no person whose name holds
 * that word is named in full in the string: a person spoken of by half a name the veil's search (which reads the full
 * name) does not find. Read with its capital, not at a sentence's head.
 * @param {string} text @param {Array<{ name: string }>} people @returns {string[]}
 */
export function partialNameIn(text, people) {
  /** @type {Set<string>} */ const out = new Set();
  const full = people.filter((p) => text.includes(p.name));
  for (const p of people) {
    for (const part of p.name.split(/\s+/)) {
      if (part.length < 3 || !/^[A-Z\u00c0-\u024f]/.test(part)) continue;
      if (full.some((q) => q.name.split(/\s+/).includes(part))) continue;
      const re = new RegExp(`(?<![.!?]["”']?\\s|^|[\\w'’-])${esc(part)}(?![\\w'’-])`);
      const masked = full.reduce((t, q) => t.split(q.name).join(' '), text);
      if (re.test(masked)) out.add(part);
    }
  }
  return [...out];
}

/** The share veil's fold of a name, as `gallerySecondHomes.js :: nameFold` reads an ASCII name. @param {string} t */
const fold = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

/**
 * Whether a prose form holds the name as the veil's search finds it: the fold of the name (or of the name with its
 * trailing qualifier struck, which the search also adds) stands in the fold of the form on word bounds.
 * @param {string} form @param {string} name @returns {boolean}
 */
export function foldHolds(form, name) {
  const text = `_${fold(form)}_`;
  const names = [fold(name), fold(String(name).replace(/\s*[([][^)\]]*[)\]]\s*$/, ''))].filter(Boolean);
  return names.some((n) => new RegExp(`_${esc(n)}(?:e?s)?_`).test(text));
}
