// MEASURE with the twin as built: for every letter of Unicode, a hidden name that is that letter between two ASCII letters
// ("a<letter>b"); is its upper-cased copy, and its lower-cased copy, found? (JavaScript's own toUpperCase / toLowerCase make the copies.)
const twin = await import('/var/tmp/v10/wt/src/domain/display/gallerySecondHomes.js');
const miss = []; let n = 0;
for (let cp = 0x80; cp <= 0x10ffff; cp += 1) {
  if (cp >= 0xd800 && cp <= 0xdfff) continue;
  const c = String.fromCodePoint(cp);
  if (!/\p{L}/u.test(c)) continue;
  n += 1;
  const name = `a${c}b`;
  const s = twin.buildNameSearch([name], []);
  if (!s.hit(name) || !s.hit(name.toUpperCase()) || !s.hit(name.toLowerCase())) miss.push(cp);
}
const hex = (x) => x.toString(16);
console.log(`letters ${n} | a copy in another case not found: ${miss.length}`);
const ranges = []; for (const cp of miss) { const l = ranges[ranges.length - 1]; if (l && l[1] === cp - 1) l[1] = cp; else ranges.push([cp, cp]); }
console.log(ranges.map(([a, b]) => (a === b ? hex(a) : `${hex(a)}-${hex(b)}`)).join(' '));
