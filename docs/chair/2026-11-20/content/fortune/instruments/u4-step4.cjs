// U4 (FS7 step 4): node <this> <births.json from u4-births.mjs>
// Step 4: the standing sentence's reason clause (governanceAccount.js :: legitimacyCausesOf), read against 20 towns a size, both laws.
const a = require(process.argv[2]);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const ADVERSE = new Set(['Legitimacy Crisis', 'Contested', 'Tolerated']);
const FIELDS = ['prosperity', 'safety', 'defense', 'food'];
const WORD = { prosperity: ['poverty', 'prosperity'], safety: ['crime|insecurity|the curfew', 'safety'], defense: ['weak defences', 'strong defences'], food: ['hunger', 'full stores'] };
for (const law of [1, 2]) {
  console.log(`\n== LAW ${law}: towns of 20 a size whose standing sentence names each clause (by its trigger term)`);
  const rows = {};
  const notes = { firstNotLargestAbs: 0, zeroNamed: 0, captureTowns: 0, captureNamingDefence: 0, largestNegSafety: 0, largestNegSafetyNamed: 0 };
  for (const r of a.filter((x) => x.law === law)) {
    const adverse = ADVERSE.has(r.legLabel);
    const named = adverse ? r.causesAdverse : r.causesFav;
    for (const [i, w] of named.entries()) {
      const field = FIELDS.find((f) => WORD[f][adverse ? 0 : 1].split('|').includes(w));
      const k = `${adverse ? 'adverse' : 'favourable'} ${i === 0 ? 'first' : 'second'} :: ${w} (term: ${field})`;
      rows[k] ??= Object.fromEntries(SIZES.map((s) => [s, 0])); rows[k][r.size]++;
      if (r.breakdown[field] === 0) notes.zeroNamed++;
    }
    if (!named.length) { const k = `${r.legLabel} bare (no clause)`; rows[k] ??= Object.fromEntries(SIZES.map((s) => [s, 0])); rows[k][r.size]++; }
    const absMax = FIELDS.reduce((m, f) => Math.abs(r.breakdown[f]) > Math.abs(r.breakdown[m]) ? f : m, 'prosperity');
    if (named.length && r.breakdown[absMax] !== 0) { const firstField = FIELDS.find((f) => WORD[f][adverse ? 0 : 1].split('|').includes(named[0])); if (firstField !== absMax && Math.abs(r.breakdown[firstField]) !== Math.abs(r.breakdown[absMax])) notes.firstNotLargestAbs++; }
    if (['corrupted', 'capture'].includes(r.capture)) { notes.captureTowns++; if (named.includes('weak defences')) notes.captureNamingDefence++; }
    const neg = FIELDS.filter((f) => r.breakdown[f] < 0).sort((x, y) => r.breakdown[x] - r.breakdown[y])[0];
    if (neg === 'safety') { notes.largestNegSafety++; if (adverse && named[0] && !['poverty', 'weak defences', 'hunger'].includes(named[0])) notes.largestNegSafetyNamed++; }
  }
  for (const [k, v] of Object.entries(rows).sort()) console.log(k.padEnd(62), SIZES.map((s) => `${s} ${v[s]}`).join(', '));
  console.log('notes', JSON.stringify(notes));
}
