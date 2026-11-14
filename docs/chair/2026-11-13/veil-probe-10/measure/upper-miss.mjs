// MEASURE: code points whose JavaScript upper-cased (or lower-cased) copy a fold built on NFKC does not bring back to the
// same letters as the code point itself, against a fold built on NFKD (marks U+0300..U+036F removed in both).
const strip = (t) => t.replace(/[\u0300-\u036f]+/g, '');
const key = (t, form) => { // the fold, then a simple-case key: each code point lowered alone where that is one code point
  let out = '';
  for (const ch of strip(t.normalize(form))) { const l = ch.toLowerCase(); out += [...strip(l.normalize(form))].length === 1 ? strip(l.normalize(form)) : ch; }
  return out.replace(/\u03c2/g, '\u03c3');
};
for (const form of ['NFKC', 'NFKD']) {
  const miss = [];
  for (let cp = 0x80; cp <= 0x10ffff; cp += 1) {
    if (cp >= 0xd800 && cp <= 0xdfff) continue;
    const c = String.fromCodePoint(cp);
    if (!/\p{L}/u.test(c)) continue;
    const k = key(c, form);
    if (key(c.toUpperCase(), form) !== k || key(c.toLowerCase(), form) !== k) miss.push(cp);
  }
  console.log(form, 'letters whose upper- or lower-cased copy folds apart:', miss.length, miss.slice(0, 40).map(n => n.toString(16)).join(' '));
}
