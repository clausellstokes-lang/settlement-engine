// REVIEW-VEIL-9 — one fold for every script: NFKD, every mark taken out, lower case (full Unicode), every run of
// characters that is not a letter or a number made one space. A name with no Latin letter keeps its letters.
export const fold = (s) => String(s ?? '').normalize('NFKD').replace(/\p{M}+/gu, '').toLowerCase().replace(/ß/g, 'ss').replace(/ς/g, 'σ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
export const squeeze = (s) => fold(s).replace(/ /g, '');
// the forms of one hidden house: its name, the name without a bracketed qualifier, its id's tail, its catalogue id,
// its label; each folded; the squeezed form kept where it is long enough to mean something
export function formsOf(house) {
  const out = new Set();
  const add = (x) => { const f = fold(x); if (f.length >= 4) out.add(f); };
  if (typeof house.name === 'string') { add(house.name); add(house.name.replace(/\s*\([^)]*\)\s*$/, '')); }
  for (const k of ['label', 'catalogId', 'birthName', 'originalName']) if (typeof house[k] === 'string') add(house[k]);
  if (typeof house.id === 'string') add(house.id.replace(/^institution[._:-]/, ''));
  return [...out];
}
// a hit: the folded form between word edges of the folded text, or the squeezed form inside the squeezed text
export function hitsIn(text, forms) {
  const f = ` ${fold(text)} `; const q = f.replace(/ /g, ''); const hits = [];
  for (const g of forms) { if (f.includes(` ${g} `) || f.includes(` ${g}s `)) hits.push(g); else { const sq = g.replace(/ /g, ''); if (sq.length >= 9 && q.includes(sq)) hits.push(`${g} (squeezed)`); } }
  return hits;
}
