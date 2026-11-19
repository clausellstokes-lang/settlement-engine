// V8-9 (VEIL-17's builder) MEASURE FIRST: the alternation's compile, server side. Local cluster only (PGHOST unix socket).
// node compile.mjs <pgmod> <db> <spec...>   spec: <script>:<names>:<words>   script latin | greek | cyrillic | long | symbol
//   latin    'Aa guild <i>' + ' of the long name' x words (the reader's cost8.sql names)
//   greek    'Αα συντεχνία <i>' + ' της μακριάς οδού' x words (every letter a bracket of its case class)
//   cyrillic 'Аа гильдия <i>' + ' долгого имени' x words
//   long     ONE name: 'Aa guild' + ' of the long name' x words (names ignored)
//   symbol   '★<i>☆' + '♜♞' x words
//   han      each name <words> distinct Han characters (U+4E00 on, none repeated across names: a colour each)
//   glong    ONE name in Greek: 'Αα συντεχνία' + ' της μακριάς οδού' x words (names ignored)
// Each spec on a FRESH backend: the search built as the read builds it (_gallery_veil_name_search, with no open name,
// so the build compiles nothing), then the pattern compiled by one match ('zz' ~ p). Peak RSS (VmHWM) and peak virtual size (VmPeak) of the backend before and after,
// the pattern's length in code points (L) and octets, its distinct code points (D), L x D, and the times. Errors are printed, never thrown.
import { readFileSync } from 'node:fs';
const [pgmod, db, ...specs] = process.argv.slice(2);
const pg = (await import(`${pgmod}/node_modules/pg/lib/index.js`)).default;
const kb = (pid, k) => { try { return Number((readFileSync(`/proc/${pid}/status`, 'utf8').match(new RegExp(`${k}:\\s+(\\d+)`)) || [])[1]); } catch { return NaN; } };
const gen = {
  latin: (i, w) => `Aa guild ${i}${' of the long name'.repeat(w)}`,
  greek: (i, w) => `Αα συντεχνία ${i}${' της μακριάς οδού'.repeat(w)}`,
  cyrillic: (i, w) => `Аа гильдия ${i}${' долгого имени'.repeat(w)}`,
  long: (_i, w) => `Aa guild${' of the long name'.repeat(w)}`,
  glong: (_i, w) => `Αα συντεχνία${' της μακριάς οδού'.repeat(w)}`,
  han: (i, w) => String.fromCodePoint(...Array.from({ length: w }, (_, j) => 0x4e00 + ((i - 1) * w + j) % 20000)),
  symbol: (i, w) => `★${i}☆${'♜♞'.repeat(w)}`,
};
for (const spec of specs) {
  const [script, n, w] = spec.split(':');
  const names = (script === 'long' || script === 'glong') ? [gen[script](0, Number(w))] : Array.from({ length: Number(n) }, (_, i) => gen[script](i + 1, Number(w)));
  const c = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: db });
  await c.connect();
  const pid = (await c.query('select pg_backend_pid() as p')).rows[0].p;
  const hwm0 = kb(pid, 'VmHWM'); const vp0 = kb(pid, 'VmPeak');
  let line = `${spec} names ${names.length} chars/name ${[...names[0]].length}`;
  try {
    const t0 = performance.now();
    const s = (await c.query('select public._gallery_veil_name_search($1::text[], array[]::text[]) as s', [names])).rows[0].s;
    const t1 = performance.now();
    const p = s?.p ?? '';
    const L = [...p].length; const D = new Set([...p]).size;
    line += ` | p ${L} cp ${Buffer.byteLength(p)} B, ${D} distinct, L x D ${L * D} | build ${(t1 - t0).toFixed(0)} ms`;
    const t2 = performance.now();
    await c.query('select \'zz\' ~ $1 as m', [p]);
    line += ` | compile ${(performance.now() - t2).toFixed(0)} ms`;
  } catch (e) { line += ` | ERROR ${String(e.message).slice(0, 90)}`; }
  line += ` | backend peak RSS ${(hwm0 / 1024).toFixed(0)} -> ${(kb(pid, 'VmHWM') / 1024).toFixed(0)} MB, peak virtual ${(vp0 / 1024).toFixed(0)} -> ${(kb(pid, 'VmPeak') / 1024).toFixed(0)} MB`;
  console.log(line);
  await c.end();
}
