// gen-name-bound.mjs: THE BLOCKING TABLE AND THE PADDED CHARACTERS OF THE NAME SEARCH, GENERATED ONCE (COHERENCE-VEIL-12;
// REVIEW-VEIL-8's V8-1, the chair's ruling of 2026-11-14 04:42 UTC: THE BOUNDARY IS INVERTED; the seat's call 2: the
// neighbour as written).
// Run: node gen-name-bound.mjs          (run on Node 22.23.4, Unicode 17.0; prints the literals and what they hold)
// The literals are carried, the same text, by supabase/migrations/212_share_veil_later_cures.sql (_gallery_veil_name_bound,
// _gallery_veil_name_pad) and by src/domain/display/gallerySecondHomes.js (NAME_BOUND, NAME_PAD);
// tests/security/galleryVeilHandRows.pglite.test.js holds the two engines' membership equal for every code point.
//   THE TABLE   a neighbour of a hidden name that BLOCKS the match: the letters and the digits (General Category L*, N*)
//               of the scripts that separate their words by spaces, read as Latin, Greek, Cyrillic, Armenian and
//               Georgian (by the Script property, never Script_Extensions: a Common or Inherited character is no
//               member), and the ASCII digits; over the code points the preparation leaves alone (NFKD, then the marks
//               U+0300..U+036F removed: a code point it rewrites or removes is never met in a prepared text, so it is no
//               member; this is why U+212A, the cut-out mark, is out). Every other neighbour is a boundary.
//   THE PADDED  a character the ruling makes a boundary whose compatibility form would block: NOT in the table AS WRITTEN
//               (judged by its own General Category and Script: L*/N* of the five scripts, or an ASCII digit), and its
//               prepared form (NFKD, the marks U+0300..U+036F gone; in this Unicode the skew map's code points decompose
//               natively) begins or ends with a member of the table: the trade-mark sign is TM, a superscript two is 2,
//               a circled one is 1, a mathematical bold A (Common script) is A. The name search writes each between
//               spaces BEFORE the preparation; a full-width or ligature Latin letter (Script Latin) is a Latin letter,
//               not padded, and blocks.
//   THE FORM    each, the body of a bracket expression, as ranges of characters in code point order, each character outside
//               printable ASCII written as a JSON/JavaScript escape (\uXXXX, an astral one as its surrogate pair), so the
//               SQL decodes the same text as JSON and the client reads it as a string literal: one literal, two engines.
const strip = (t) => t.replace(/[̀-ͯ]+/g, '');
const prep = (t) => strip(t.normalize('NFKD'));
const SCRIPTS = ['Latin', 'Greek', 'Cyrillic', 'Armenian', 'Georgian'];
const inScript = SCRIPTS.map((s) => new RegExp(`^\\p{Script=${s}}$`, 'u'));
const LETTER_OR_DIGIT = /^[\p{L}\p{N}]$/u;
const NOT_ALLOWED = /^[\p{P}\p{S}\p{M}\p{Z}\p{C}]$/u;
const COMMON = /^[\p{Script=Common}\p{Script=Inherited}]$/u;
const members = [];
for (let cp = 1; cp <= 0x10ffff; cp += 1) {
  if (cp >= 0xd800 && cp <= 0xdfff) continue;
  const c = String.fromCodePoint(cp);
  if (prep(c) !== c) continue; // the preparation rewrites or removes it: never met in a prepared text
  if ((cp >= 0x30 && cp <= 0x39) || (LETTER_OR_DIGIT.test(c) && inScript.some((r) => r.test(c)))) members.push(cp);
}
const ranges = [];
for (const cp of members) { const last = ranges[ranges.length - 1]; if (last && last[1] === cp - 1) last[1] = cp; else ranges.push([cp, cp]); }
const hex4 = (n) => n.toString(16).padStart(4, '0');
const esc = (cp) => {
  if (cp >= 0x20 && cp < 0x7f) return String.fromCodePoint(cp);
  const c = String.fromCodePoint(cp);
  return c.length === 1 ? `\\u${hex4(cp)}` : `\\u${hex4(c.charCodeAt(0))}\\u${hex4(c.charCodeAt(1))}`;
};
const linesOf = (rs) => {
  const ps = rs.map(([a, b]) => (a === b ? esc(a) : b === a + 1 ? esc(a) + esc(b) : `${esc(a)}-${esc(b)}`));
  const out = []; let cur = '';
  for (const p of ps) { if (cur && (cur + p).length > 120) { out.push(cur); cur = p; } else cur += p; }
  out.push(cur);
  return out;
};
const lines = linesOf(ranges);
const asWritten = (cp) => (cp >= 0x30 && cp <= 0x39) || (LETTER_OR_DIGIT.test(String.fromCodePoint(cp)) && inScript.some((r) => r.test(String.fromCodePoint(cp))));
const memberSet = new Set(members);
const padded = [];
for (let cp = 1; cp <= 0x10ffff; cp += 1) {
  if (cp >= 0xd800 && cp <= 0xdfff || asWritten(cp)) continue;
  const p = [...prep(String.fromCodePoint(cp))];
  if (p.length && (memberSet.has(p[0].codePointAt(0)) || memberSet.has(p[p.length - 1].codePointAt(0)))) padded.push(cp);
}
const padRanges = [];
for (const cp of padded) { const last = padRanges[padRanges.length - 1]; if (last && last[1] === cp - 1) last[1] = cp; else padRanges.push([cp, cp]); }
const padLines = linesOf(padRanges);
// the proofs the ruling asks of the table: nothing but letters and digits; no Common or Inherited character but the
// ASCII digits; the cut-out mark and the modifier apostrophe out
const bad = members.filter((cp) => NOT_ALLOWED.test(String.fromCodePoint(cp)) || (COMMON.test(String.fromCodePoint(cp)) && !(cp >= 0x30 && cp <= 0x39)));
const U = (cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
console.log(`node ${process.version} | unicode ${process.versions.unicode} | members ${members.length} | ranges ${ranges.length} | astral members ${members.filter((cp) => cp > 0xffff).length}`);
console.log(`members that are not a letter or a digit, or are Common or Inherited but an ASCII digit: ${bad.length ? bad.map(U).join(' ') : 'none'}`);
console.log(`out, as the ruling asks: ${[0x212a, 0x02bc, 0x02bb, 0x0589, 0x055d].map((cp) => `${U(cp)} ${members.includes(cp) ? 'IN' : 'out'}`).join(', ')}`);
// THE OLD `bnd` (COHERENCE-VEIL-10's ranges, which asked a boundary as a LISTED separator): what left it, of the code
// points a prepared text can hold, by script and category
const OLD = /^[a-z0-9À-֏Ⴀ-ჿᲀ-ᲿḀ-῿Ⰰ-ⷿꙀ-ꟿ]$/u;
const member = new Set(members);
const gcs = ['Lu', 'Ll', 'Lt', 'Lm', 'Lo', 'Mn', 'Mc', 'Me', 'Nd', 'Nl', 'No', 'Pc', 'Pd', 'Ps', 'Pe', 'Pi', 'Pf', 'Po', 'Sm', 'Sc', 'Sk', 'So', 'Zs', 'Cf', 'Cn', 'Co'];
const gcOf = (c) => gcs.find((g) => new RegExp(`^\\p{gc=${g}}$`, 'u').test(c));
const scOf = (c) => /^\p{Script=Common}$/u.test(c) ? 'Common' : /^\p{Script=Inherited}$/u.test(c) ? 'Inherited'
  : (['Latin', 'Greek', 'Cyrillic', 'Armenian', 'Georgian', 'Coptic', 'Glagolitic', 'Tifinagh', 'Ethiopic', 'Bamum'].find((s) => new RegExp(`^\\p{Script=${s}}$`, 'u').test(c)) || 'other');
const left = new Map(); const came = [];
for (let cp = 1; cp <= 0x10ffff; cp += 1) {
  if (cp >= 0xd800 && cp <= 0xdfff) continue;
  const c = String.fromCodePoint(cp);
  if (prep(c) !== c) continue;
  if (OLD.test(c) && !member.has(cp)) { const k = gcOf(c) === 'Cn' ? 'unassigned' : `${scOf(c)} ${gcOf(c)}`; left.set(k, (left.get(k) || 0) + 1); }
  if (!OLD.test(c) && member.has(cp)) came.push(cp);
}
console.log(`left the old bnd (a prepared text can hold them): ${[...left.values()].reduce((a, b) => a + b, 0)}: ${[...left].map(([k, n]) => `${k} ${n}`).join('; ')}`);
console.log(`came in that the old bnd lacked: ${came.length} (A-Z, which a text made ready never holds, among them)`);
console.log(`NAME_BOUND, ${lines.length} lines:`);
for (const l of lines) console.log(`'${l}'`);
const gcCount = new Map(); for (const cp of padded) { const g = gcOf(String.fromCodePoint(cp)); gcCount.set(g, (gcCount.get(g) || 0) + 1); }
console.log(`PADDED: ${padded.length} code points in ${padRanges.length} ranges (astral ${padded.filter((cp) => cp > 0xffff).length}; ASCII ${padded.filter((cp) => cp < 0x80).length}): ${[...gcCount].map(([k, n]) => `${k} ${n}`).join(', ')}`);
console.log(`padded, as the call asks: ${[0x2122, 0x00b2, 0x2460, 0x2116, 0x2103, 0x1d400].map((cp) => `${U(cp)} ${padded.includes(cp) ? 'padded' : 'NOT'}`).join(', ')}; not padded: ${[0xff21, 0xfb01, 0x212a, 0x00e9, 0x0130].map((cp) => `${U(cp)} ${padded.includes(cp) ? 'PADDED' : 'no'}`).join(', ')}`);
console.log(`NAME_PAD, ${padLines.length} lines:`);
for (const l of padLines) console.log(`'${l}'`);
