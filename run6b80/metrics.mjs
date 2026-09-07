// METRICS — the chair's probe.mjs measures (words-per-sentence spread, tell words, shapes,
// house tics, pool-level uniformity) plus the fingerprint.mjs style measures, computed PER
// REGISTER over the admitted corpus. Exported so bible.mjs scores the voice bible the same way.
//
// UNIT SAFETY: a register whose own unit is a sub-sentence PHRASE (R4, R17) is never scored on
// "sentences"; every rhythm figure is per SEGMENT, and an unpunctuated row is exactly one
// segment, so the same column is legible for both kinds of register. `segmentsPerVariant` and
// `terminalStopShare` say which kind a column is.

export const words = (s) => s.trim().split(/\s+/).filter(Boolean);
export const segments = (s) => s.replace(/\{[a-z_0-9]+\}/gi, 'X')
  .split(/(?<=[.?!]["'”’)\]]?)\s+(?=["“'(]?[A-Z])/).map((x) => x.trim()).filter(Boolean);

// The chair's TELLS list (probe.mjs) …
export const TELLS = ['delve', 'tapestry', 'testament', 'intricate', 'pivotal', 'underscore', 'showcase', 'realm', 'beacon', 'echo', 'whisper', 'dance', 'symphony', 'nestled', 'bustling', 'vibrant', 'meticulous', 'crucial', 'notable', 'journey', 'unwavering', 'palpable', 'a reminder', 'speaks to', 'serves as', 'stands as', 'stark', 'weight of', 'the very', 'in the end', 'at its core', 'a sense of', 'steadfast', 'resilien', 'landscape', 'navigate', 'foster', 'ever-', 'timeless', 'profound', 'remnant', 'linger', 'haunting', 'shadow of', 'heart of', 'fabric of', 'tension', 'narrative'];
// … and Juzek & Ward's 21 INFLECTED focal forms (dossier §2), which the rubric (§5) names.
export const JUZEK = ['delves', 'delved', 'delving', 'delve', 'showcasing', 'boasts', 'underscores', 'comprehending', 'intricacies', 'surpassing', 'intricate', 'underscoring', 'garnered', 'showcases', 'emphasizing', 'underscore', 'realm', 'surpasses', 'groundbreaking', 'advancements', 'aligns'];
// The rubric's rationed pet words (R11) plus the tics probe.mjs already counts.
export const PET = {
  'rather than': /\brather than\b/g,
  'which is / which means': /,\s*which (is|means|was)\b/g,
  'nobody / no one / nothing': /\b(nobody|no one|nothing)\b/g,
  'its own': /\bits own\b/g,
  whatever: /\bwhatever\b/g,
  'enough to / enough that': /\benough (to|that)\b/g,
  'kind of / sort of': /\b(kind|sort) of\b/g,
  'quiet / quietly': /\bquiet(ly)?\b/g,
  still: /\bstill\b/g,
  yet: /\byet\b/g,
  already: /\balready\b/g,
  'no small / not a trivial': /\bno small\b|\bnot a (trivial|small)\b/g,
  'the sort of X that': /\bthe (sort|kind) of \w+ that\b/g,
  'own kind of': /\bown kind of\b/g,
};

const pct = (arr, p) => arr[Math.floor(p * (arr.length - 1))];
const r3 = (x) => +x.toFixed(3);
const r1 = (x) => +x.toFixed(1);

export function measure(rows) {
  const n = rows.length;
  if (!n) return null;
  const lens = [];
  const segCounts = [];
  let terminalStop = 0, capOpen = 0;
  const tells = {};
  const juzek = {};
  const pet = {};
  const shp = { antithesisShape: 0, ratherThan: 0, triadList: 0, doubledAdj: 0, participialOpener: 0, secondSentSummary: 0, glossTail: 0, semicolon: 0, emDash: 0, exclamation: 0, colon: 0, question: 0, parenthesis: 0, thereIsOpener: 0, digitsInProse: 0, emphasisCaps: 0, contraction: 0, thePCs: 0, slotBearing: 0 };
  const openers = {}, closers = {};
  let abstractCloser = 0, pronounCloser = 0, adverbs = 0;
  const byPool = {};

  for (const row of rows) {
    const text = row.text;
    const t = text.toLowerCase();
    const ss = segments(text);
    segCounts.push(ss.length);
    (byPool[row.pool || row.file] ||= []).push(row);
    if (/[.?!]["’')\]]?$/.test(text.trim())) terminalStop++;
    if (/^[A-Z{“"']/.test(text.trim())) capOpen++;
    if (/\{[a-z_][a-z_0-9]*\}/i.test(text)) shp.slotBearing++;
    for (const s of ss) {
      const w = words(s);
      lens.push(w.length);
      const f = (w[0] || '').replace(/[^A-Za-z'’]/g, '').toLowerCase();
      openers[f] = (openers[f] || 0) + 1;
      if (/ing$/.test(f) && !/^(thing|nothing|something|king|spring|during|wing|ring|string|building|ceiling|evening|morning|bring|sing)$/.test(f)) shp.participialOpener++;
      const l = (w[w.length - 1] || '').replace(/[^A-Za-z'’]/g, '').toLowerCase();
      closers[l] = (closers[l] || 0) + 1;
      if (/(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/.test(l)) abstractCloser++;
      if (/^(it|them|him|her|us|me|you|this|that|there|here)$/.test(l)) pronounCloser++;
      if (/^(There|It) (is|was|were|are)\b/.test(s)) shp.thereIsOpener++;
    }
    adverbs += (text.match(/\b\w+ly\b/g) || []).filter((w) => !/^(only|early|family|likely|holy|ally|belly|jolly|folly|rally|tally|bully|fully|reply|apply|supply|july|italy|lily|melancholy|assembly|monopoly|anomaly)$/i.test(w)).length;
    for (const k of TELLS) { const c = (t.match(new RegExp('\\b' + k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length; if (c) tells[k] = (tells[k] || 0) + c; }
    for (const k of JUZEK) { const c = (t.match(new RegExp('\\b' + k + '\\b', 'g')) || []).length; if (c) juzek[k] = (juzek[k] || 0) + c; }
    for (const [k, re] of Object.entries(PET)) { const c = (t.match(re) || []).length; if (c) pet[k] = (pet[k] || 0) + c; }
    // U4: count the antithesis SHAPE, not the phrase — bare "X, not Y" included.
    if (/\bnot (only )?[^.,;]{2,40}[,;]? but\b/.test(t) || /\brather than\b/.test(t) || /,\s*not [a-z]/.test(t) || /\bless [^.,;]{2,30} than\b/.test(t) || /\bnot [^.,;]{1,30}, not [^.,;]{1,30}/.test(t)) shp.antithesisShape++;
    if (/\brather than\b/.test(t)) shp.ratherThan++;
    if (/,[^,.]+,[^,.]+,? and [^,.]+[.;]/.test(text)) shp.triadList++;
    if (/\b\w+(ed|ing|ous|ful|less|ive|al|ant|ent) and \w+(ed|ing|ous|ful|less|ive|al|ant|ent)\b/.test(t)) shp.doubledAdj++;
    if (ss.length >= 2 && /^(That|This|It|Which)\b/.test(ss[1])) shp.secondSentSummary++;
    if (/,\s*which\b/.test(text)) shp.glossTail++;
    if (text.includes(';')) shp.semicolon++;
    if (/—|&mdash;/.test(text)) shp.emDash++;
    if (text.includes('!')) shp.exclamation++;
    if (/:\s/.test(text)) shp.colon++;
    if (text.includes('?')) shp.question++;
    if (text.includes('(')) shp.parenthesis++;
    if (/\d/.test(text.replace(/\{[^}]*\}/g, ''))) shp.digitsInProse++;
    if (/\b[A-Z]{3,}\b/.test(text.replace(/\{[^}]*\}/g, '').replace(/\b(DM|PDF|NPC|PC|AI|UI|GM|TTRPG)\b/g, ''))) shp.emphasisCaps++;
    if (/\b\w+['’](s|t|re|ve|ll|d|m)\b/.test(text) && /\b(don|doesn|isn|aren|can|won|couldn|wouldn|shouldn|hasn|haven|it|that|there|they|you|we|he|she|what|who|here)['’](s|t|re|ve|ll|d|m)\b/i.test(text)) shp.contraction++;
    if (/\bthe PCs\b/.test(text)) shp.thePCs++;
  }

  const sorted = [...lens].sort((a, b) => a - b);
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
  const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);

  // ── pool-level uniformity ──────────────────────────────────────────────────
  let pools2 = 0, sameShape = 0, sameOpener = 0, poolSizeSum = 0;
  const poolSds = [];
  for (const vs of Object.values(byPool)) {
    if (vs.length < 2) continue;
    pools2++; poolSizeSum += vs.length;
    if (new Set(vs.map((v) => segments(v.text).length)).size === 1) sameShape++;
    const op = new Set(vs.map((v) => words(v.text).slice(0, 2).join(' ').toLowerCase()));
    if (op.size < vs.length) sameOpener++;
    const wl = vs.map((v) => words(v.text).length);
    const m = wl.reduce((a, b) => a + b, 0) / wl.length;
    poolSds.push(Math.sqrt(wl.reduce((a, b) => a + (b - m) ** 2, 0) / wl.length));
  }

  const rate = (x) => r3(x / n);
  const srate = (x) => r3(x / lens.length);
  return {
    variants: n,
    files: new Set(rows.map((r) => r.file)).size,
    segments: lens.length,
    segmentsPerVariant: r3(lens.length / n),
    terminalStopShare: rate(terminalStop),
    capitalOpenShare: rate(capOpen),
    slotBearingShare: rate(shp.slotBearing),
    oneSegment: rate(segCounts.filter((x) => x === 1).length),
    twoSegments: rate(segCounts.filter((x) => x === 2).length),
    threePlusSegments: rate(segCounts.filter((x) => x >= 3).length),
    wps: { mean: r1(mean), sd: r1(sd), p10: pct(sorted, 0.1), p50: pct(sorted, 0.5), p90: pct(sorted, 0.9), under8: srate(lens.filter((x) => x < 8).length), over30: srate(lens.filter((x) => x > 30).length) },
    shapesRate: {
      antithesisShape: rate(shp.antithesisShape), ratherThan: rate(shp.ratherThan), triadList: rate(shp.triadList),
      doubledAdj: rate(shp.doubledAdj), participialOpener: srate(shp.participialOpener),
      secondSentSummary: rate(shp.secondSentSummary), glossTail: rate(shp.glossTail),
      semicolon: rate(shp.semicolon), colon: rate(shp.colon), question: rate(shp.question),
      parenthesis: rate(shp.parenthesis), thereIsOpener: srate(shp.thereIsOpener),
      abstractCloser: srate(abstractCloser), pronounCloser: srate(pronounCloser),
      adverbsPerSegment: r3(adverbs / lens.length),
    },
    bibleHardRules: {
      emDash: shp.emDash, emDashRate: rate(shp.emDash),
      exclamation: shp.exclamation, exclamationRate: rate(shp.exclamation),
      emphasisCaps: shp.emphasisCaps, emphasisCapsRate: rate(shp.emphasisCaps),
      digitsInProse: shp.digitsInProse, digitsRate: rate(shp.digitsInProse),
      contractionRate: rate(shp.contraction),
      thePCs: shp.thePCs,
    },
    tellsTotal: Object.values(tells).reduce((a, b) => a + b, 0),
    tellsRate: rate(Object.values(tells).reduce((a, b) => a + b, 0)),
    // MEASURED CORRECTION: "realm" and "narrative" are the product's OWN Living Lexicon nouns
    // (VOICE_AND_TONE §3: Realm, Narrative Layer), not AI tells. Counting them inflates every
    // chrome register. The exogenous figure is the one that means anything.
    tellsExogenous: Object.entries(tells).filter(([k]) => k !== 'realm' && k !== 'narrative').reduce((a, [, v]) => a + v, 0),
    tellsExogenousRate: rate(Object.entries(tells).filter(([k]) => k !== 'realm' && k !== 'narrative').reduce((a, [, v]) => a + v, 0)),
    tells,
    juzekTotal: Object.values(juzek).reduce((a, b) => a + b, 0),
    juzekExogenous: Object.entries(juzek).filter(([k]) => k !== 'realm').reduce((a, [, v]) => a + v, 0),
    juzek,
    petTotal: Object.values(pet).reduce((a, b) => a + b, 0),
    petRate: rate(Object.values(pet).reduce((a, b) => a + b, 0)),
    pet,
    pools: {
      poolsWith2Plus: pools2,
      meanPoolSize: pools2 ? r1(poolSizeSum / pools2) : 0,
      sameSegmentCountShare: pools2 ? r3(sameShape / pools2) : null,
      repeatedTwoWordOpenerShare: pools2 ? r3(sameOpener / pools2) : null,
      meanWithinPoolWordSd: poolSds.length ? r1(poolSds.reduce((a, b) => a + b, 0) / poolSds.length) : null,
    },
    topOpeners: Object.entries(openers).sort((a, b) => b[1] - a[1]).slice(0, 10),
    topClosers: Object.entries(closers).sort((a, b) => b[1] - a[1]).slice(0, 10),
  };
}

// ── empirical tic mining: n-grams over-represented in a register vs the rest of the corpus,
// restricted to habits that recur across at least MINPOOLS distinct pools (a phrase that lives
// in one pool is that pool's subject, not the register's tic).
export function mineTics(rows, allRows, { minCount = 4, minPools = 3, top = 10 } = {}) {
  const grams = (text) => {
    const w = text.toLowerCase().replace(/\{[a-z_0-9]+\}/gi, '{}').replace(/[^a-z0-9{}'\s]/g, ' ').split(/\s+/).filter(Boolean);
    const out = [];
    for (let k = 2; k <= 4; k++) for (let i = 0; i + k <= w.length; i++) out.push(w.slice(i, i + k).join(' '));
    return out;
  };
  const inReg = new Map();
  const poolsOf = new Map();
  const ex = new Map();
  for (const r of rows) {
    const seen = new Set(grams(r.text));
    for (const g of seen) {
      inReg.set(g, (inReg.get(g) || 0) + 1);
      if (!poolsOf.has(g)) poolsOf.set(g, new Set());
      poolsOf.get(g).add(r.pool || r.file);
      if (!ex.has(g)) ex.set(g, r);
    }
  }
  const rest = new Map();
  let restN = 0;
  for (const r of allRows) {
    if (rows.includes(r)) continue;
    restN++;
    for (const g of new Set(grams(r.text))) rest.set(g, (rest.get(g) || 0) + 1);
  }
  const n = rows.length;
  const scored = [];
  for (const [g, c] of inReg) {
    if (c < minCount) continue;
    if (poolsOf.get(g).size < minPools) continue;
    const p = (c + 0.5) / (n + 1);
    const q = ((rest.get(g) || 0) + 0.5) / (restN + 1);
    scored.push({ gram: g, count: c, pools: poolsOf.get(g).size, rate: r3(c / n), lift: r1(p / q), example: ex.get(g).text });
  }
  scored.sort((a, b) => (b.lift * Math.log(1 + b.count)) - (a.lift * Math.log(1 + a.count)));
  // One tic per phrase family: drop any gram that OVERLAPS an already-kept gram in either
  // direction ("it is public" / "public that the" are one habit, not five).
  const out = [];
  for (const s of scored) {
    if (out.some((o) => o.gram.includes(s.gram) || s.gram.includes(o.gram))) continue;
    out.push(s);
    if (out.length >= top) break;
  }
  return out;
}
