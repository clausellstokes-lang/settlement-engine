// V8-9 (VEIL-17's builder): THE BOUND IS ONE. The search (pattern, cut-outs, closed or not) as 212's
// _gallery_veil_name_search builds it on a chain, against the twin's buildNameSearch, for names on both sides of each
// of the three bounds and in several scripts; then each search's whole-text answer, server against twin.
// node parity.mjs <pgmod> <db> <tree>    (local cluster only, PGHOST unix socket)
const [pgmod, db, tree] = process.argv.slice(2);
const pg = (await import(`${pgmod}/node_modules/pg/lib/index.js`)).default;
const { buildNameSearch } = await import(`${tree}/src/domain/display/gallerySecondHomes.js`);
const c = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: db });
await c.connect();
const latin = (n, w) => Array.from({ length: n }, (_, i) => `Aa guild ${i + 1}${' of the long name'.repeat(w)}`);
const han = (n, w) => Array.from({ length: n }, (_, i) => String.fromCodePoint(...Array.from({ length: w }, (_, j) => 0x4e00 + (i * w + j) % 20000)));
const cases = {
  'latin 85x8 (under the size)': [latin(85, 8), ['Fish market']],
  'latin 86x8 (over the size)': [latin(86, 8), ['Fish market']],
  'han 50x40 (under the weight)': [han(50, 40), ['Fish market']],
  'han 51x40 (over the weight)': [han(51, 40), ['Fish market']],
  '16 cut-outs': [['Red hand'], Array.from({ length: 16 }, (_, i) => `Red hand annex ${i + 1}`)],
  '17 cut-outs': [['Red hand'], Array.from({ length: 17 }, (_, i) => `Red hand annex ${i + 1}`)],
  'one open name of 100,000 characters holding a hidden one': [['Red hand'], [`Red hand ${'x'.repeat(100000)}`]],
  'greek, a dotted capital I, a sharp s': [['Συντεχνία İsland Straße'], ['Fish market']],
  'symbols only': [['★☆♜'], []],
};
for (const [label, [names, opens]] of Object.entries(cases)) {
  const s = (await c.query('select public._gallery_veil_name_search($1::text[], $2::text[]) as s', [names, opens])).rows[0].s;
  const t = buildNameSearch(names, opens);
  const tj = t && { p: t.pattern, raw: t.raws, blank: t.blank, ...(t.closed ? { closed: true } : {}) };
  const same = JSON.stringify(s) === JSON.stringify(tj);
  console.log(`${label}: server ${s?.closed ? 'CLOSED' : `p ${[...(s?.p ?? '')].length} cp, ${s?.blank?.length ?? 0} cut-outs`} | twin ${t?.closed ? 'CLOSED' : `p ${[...(t?.pattern ?? '')].length} cp, ${t?.blank?.length ?? 0} cut-outs`} | ${same ? 'EQUAL' : 'DIFFER'}`);
}
await c.end();
