/**
 * scripts/census/page-clash.shared.mjs — THE PAGE CLASH CENSUS'S READING (SURVEY S-C, the eleventh chair's SURVEY-DESIGN §2 (ii)):
 * which printed line STANDS ON which side of a row of the table of exclusions (`src/domain/facts/claimExclusions.js`), and which
 * rows a page prints both sides of. Shared by the census's renderer (`page-clash.render.census.jsx`, run by
 * `scripts/page-clash-census.mjs`) and the walker (`tests/lint/claimExclusions.walker.test.js`). Pure: it reads a page's notes,
 * its printed lines and its final record's facts, and writes nothing.
 *
 * A LINE STANDS ON AN ATOM when (1) the presumption ledger notes it drawn on that atom (its own declaration, or its pool's
 * `poolDeclares`), as written (`X`, `no X`, `crisis: K`, `no crisis: K`, a band atom), or (2) its POOL KEY is that atom's fact
 * (`KEYED_POOLS`: the Economy desk's rung pools stand on their rung of `prosperity`; the Defense desk's Economic Survival Weak and
 * Critical pools stand on `nothing laid by`, its Strong and Adequate pools on `no nothing laid by`). A SIDE A ROW MARKS `recorded` ALSO STANDS wherever its atom holds on the final record
 * (the page prints it from the record: the crisis card, the debt tension, the graded row, the rung).
 * THE PAGE'S NOTES are the owner page's: the birth's, the public prose stamp's, and the owner render's (the measure's method,
 * `survey/measure/E-clashes.md`, source 1).
 * PRINTED: a note whose line's TEXT is known is kept only where a fixed fragment of it is on the page: the kernel's notes by
 * their vid (`kernelTexts`), every other note by the text the renderer reads off the draw that made it (`text`, set on the
 * note by `page-clash.render.census.jsx`'s wrap of `drawDeclared.js`). A note whose text is still unknown is COUNTED AS
 * PRINTED: the census cannot tell whether such a line prints; it says so by row (`unconfirmed`).
 */

/** Pool keys that ARE a fact: the line stands on the atom by its key (the order of hardness: a keyed prose line, rank 5). */
export const KEYED_POOLS = Object.freeze({
  'DS-ECO-8::SUBSISTENCE': 'prosperity: = subsistence', 'DS-ECO-8::STRUGGLING': 'prosperity: = struggling', 'DS-ECO-8::POOR': 'prosperity: = poor',
  'DS-ECO-8::MODERATE': 'prosperity: = moderate', 'DS-ECO-8::COMFORTABLE': 'prosperity: = comfortable', 'DS-ECO-8::PROSPEROUS': 'prosperity: = prosperous',
  'DS-ECO-8::WEALTHY': 'prosperity: = wealthy',
  'DS-DEF-2::Economic Survival: WEAK': 'nothing laid by', 'DS-DEF-2::Economic Survival: CRITICAL': 'nothing laid by',
  'DS-DEF-2::Economic Survival: STRONG': 'no nothing laid by', 'DS-DEF-2::Economic Survival: ADEQUATE': 'no nothing laid by',
});

/**
 * One written atom → its claim: `{ dim, neg, key, range, crisis }`. `null` for a word the vocabulary does not parse.
 * @param {string} word @param {any} V the vocabulary module (`factVocabulary.js`)
 */
export function claimOf(word, V) {
  const w = String(word).trim();
  const m = /^no\s+(.+)$/i.exec(w);
  const atom = V.parseAtom(m ? m[1] : w);
  if (!atom) return null;
  const d = V.FACT_DIMENSIONS[atom.dimension];
  if (d.shape === 'crisis') {
    const kinds = (atom.values || []).filter((/** @type {string} */ v) => V.CRISIS_KIND_WORDS.includes(v));
    return { dim: 'crisis', neg: !!m, key: null, kinds: atom.values ? kinds : null, raw: w };
  }
  if (d.shape === 'presence') return { dim: atom.dimension, neg: !!m, key: atom.key, raw: w };
  // band: the ranges of rungs (indices) or numbers the atom admits; `no <band atom>` (an excludes column's band atom, as the
  // ledger writes it) admits the complement, which may be two ranges
  const order = d.order || null;
  const at = order ? order.indexOf(atom.value) : Number(atom.value);
  const bottom = order ? 0 : -Infinity; const top = order ? order.length - 1 : Infinity; const step = order ? 1 : 1e-9;
  const ranges = { '=': [at, at], '≥': [at, top], '>': [at + step, top], '≤': [bottom, at], '<': [bottom, at - step] };
  const r = ranges[atom.op];
  const out = !m ? [r] : [[bottom, r[0] - step], [r[1] + step, top]].filter(([lo, hi]) => lo <= hi);
  return { dim: atom.dimension, neg: false, band: true, ranges: out, raw: w };
}

/** Do two sets of ranges share a value? @param {ReadonlyArray<[number, number]>} a @param {ReadonlyArray<[number, number]>} b */
const meets = (a, b) => a.some((x) => b.some((y) => x[0] <= y[1] && y[0] <= x[1]));
/** Does every range of `inner` lie inside one of `outer`? @param {ReadonlyArray<[number, number]>} inner @param {ReadonlyArray<[number, number]>} outer */
const within = (inner, outer) => inner.every((x) => outer.some((y) => x[0] >= y[0] && x[1] <= y[1]));

/**
 * Does a claim stand on a row's side atom? A presence claim on its own atom and polarity; a band claim whose range lies inside
 * the side's; a crisis claim on one kind (`crisis: K` stands on `crisis: K` only when K is its one value; `no crisis: K` on
 * `no crisis: K`).
 * @param {any} c a claim (`claimOf`) @param {any} side a claim (`claimOf`) of the row's side
 */
export function standsOn(c, side) {
  if (!c || !side || c.dim !== side.dim) return false;
  if (side.band) return !!c.band && within(c.ranges, side.ranges);
  if (side.dim === 'crisis') {
    if (!side.kinds || side.kinds.length !== 1) return false;
    if (c.neg !== side.neg || !c.kinds) return false;
    return side.neg ? c.kinds.includes(side.kinds[0]) : c.kinds.length === 1 && c.kinds[0] === side.kinds[0];
  }
  return c.neg === side.neg && c.key === side.key;
}

/**
 * The template's fixed fragments of fifteen characters or more (cut at its slots and at the tier nouns a line is spoken
 * with); a line is printed when ANY is on the page (a generous reading: it can only over-count).
 * @param {string} text
 */
export function fragmentsOf(text) {
  return String(text).split(/\{[^}]*\}|\b(?:thorp|hamlet|village|town|city|metropolis|settlement)s?\b/i).map((p) => p.trim()).filter((p) => p.length >= 15);
}

/**
 * Index the state-prose corpora: `DS-X::KEY` + vid → template text.
 * @param {ReadonlyArray<Record<string, any>>} corpora
 */
export function kernelTexts(corpora) {
  /** @type {Map<string, string>} */ const out = new Map();
  for (const corpus of corpora) for (const [block, entry] of Object.entries(corpus)) {
    for (const [key, lines] of Object.entries(entry?.pools || {})) {
      for (const l of Array.isArray(lines) ? lines : []) if (l && typeof l.text === 'string' && typeof l.vid === 'number') out.set(`${block}::${key}#${l.vid}`, l.text);
    }
  }
  return out;
}

/**
 * The notes of a page, each with the claims it stands on and whether it is confirmed printed.
 * @param {ReadonlyArray<any>} notes ledger entries @param {string} pageText every printed line, joined
 * @param {Map<string, string>} texts `kernelTexts` @param {any} V the vocabulary module
 */
export function noteClaims(notes, pageText, texts, V) {
  /** @type {Array<{ note: string, claims: any[], printed: boolean, confirmed: boolean }>} */ const out = [];
  for (const e of notes) {
    if (!e || e.resolvedBy === 'none') continue;
    const words = [...(e.poolDeclares || []), ...(e.atoms || [])];
    if (KEYED_POOLS[e.pool]) words.push(KEYED_POOLS[e.pool]);
    const claims = words.map((w) => claimOf(w, V)).filter(Boolean);
    if (!claims.length) continue;
    const text = e.drawKind === 'K' ? texts.get(`${e.pool}#${e.lineId}`) : typeof e.text === 'string' ? e.text : undefined;
    const frags = text ? fragmentsOf(text) : [];
    const printed = frags.length ? frags.some((f) => pageText.includes(f)) : true;
    if (!printed) continue;
    out.push({ note: `${e.pool}#${e.lineId}`, claims, printed, confirmed: frags.length > 0 });
  }
  return out;
}

/**
 * The rows of the table a page prints both sides of. A specific row counts its own pair; a generic row counts every other pair of
 * its shape (one not named by a specific row), so no clash is counted twice.
 * @param {ReadonlyArray<any>} table `CLAIM_EXCLUSIONS` @param {ReturnType<typeof noteClaims>} noted
 * @param {(atom: string) => boolean|undefined} holds the atom on the final record (the desks' facts)
 * @param {any} V the vocabulary module
 * @returns {Record<string, { a: string, b: string, confirmed: boolean }>} row id → the first pair found
 */
export function pageClashes(table, noted, holds, V) {
  /** @type {Record<string, { a: string, b: string, confirmed: boolean }>} */ const out = {};
  const specific = table.filter((r) => !r.generic);
  const named = specific.flatMap((r) => [claimOf(r.a, V), claimOf(r.b, V)]).filter(Boolean);
  /** @param {any} c */
  const isNamed = (c) => named.some((n) => standsOn(c, n));
  /** @param {any} row @param {'a'|'b'} side @param {any} want */
  const standing = (row, side, want) => {
    /** @type {Array<{ what: string, confirmed: boolean }>} */ const got = [];
    if ((row.recorded || []).includes(side) && holds(row[side]) === true) got.push({ what: `the record: ${row[side]}`, confirmed: true });
    for (const n of noted) for (const c of n.claims) if (standsOn(c, want)) got.push({ what: `${n.note} (${c.raw})`, confirmed: n.confirmed });
    return got;
  };
  for (const row of specific) {
    const A = standing(row, 'a', claimOf(row.a, V)); const B = standing(row, 'b', claimOf(row.b, V));
    if (A.length && B.length) out[row.id] = { a: A[0].what, b: B[0].what, confirmed: A.some((x) => x.confirmed) && B.some((x) => x.confirmed) };
  }
  const all = noted.flatMap((n) => n.claims.map((c) => ({ n, c })));
  for (const row of table.filter((r) => r.generic)) {
    for (const x of all) {
      if (out[row.id]) break;
      if (isNamed(x.c)) continue;
      for (const y of all) {
        if (isNamed(y.c)) continue;
        const clash = row.generic === 'presence' ? (!x.c.band && x.c.dim !== 'crisis' && x.c.dim === y.c.dim && x.c.key === y.c.key && !x.c.neg && y.c.neg)
          : row.generic === 'band' ? (x.c.band && y.c.band && x.c.dim === y.c.dim && !meets(x.c.ranges, y.c.ranges))
            : (x.c.dim === 'crisis' && y.c.dim === 'crisis' && !x.c.neg && y.c.neg && x.c.kinds?.length === 1 && y.c.kinds?.includes(x.c.kinds[0]));
        if (clash) { out[row.id] = { a: `${x.n.note} (${x.c.raw})`, b: `${y.n.note} (${y.c.raw})`, confirmed: x.n.confirmed && y.n.confirmed }; break; }
      }
    }
  }
  return out;
}
