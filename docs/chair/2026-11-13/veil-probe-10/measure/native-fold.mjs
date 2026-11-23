// MEASURE on the native cluster (PostgreSQL 16, Unicode 15.0): the name search's fold and pattern against the twin's, EVERY code point.
import { createRequire } from 'node:module';
const require = createRequire('/var/tmp/v10/pgmod/');
const pg = require('pg');
const twin = await import('/var/tmp/v10/wt/src/domain/display/gallerySecondHomes.js');
const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'probe11' }); await db.connect();
const cps = []; for (let cp = 1; cp <= 0x10ffff; cp += 1) if (cp < 0xd800 || cp > 0xdfff) cps.push(cp);
let differ = []; let n = 0;
for (let i = 0; i < cps.length; i += 40000) {
  const probes = cps.slice(i, i + 40000).flatMap(cp => [String.fromCodePoint(cp), `Ab${String.fromCodePoint(cp)}Cd q`]);
  const r = await db.query(`select coalesce(jsonb_agg(public._gallery_veil_name_fold(t) order by o), '[]') as f from jsonb_array_elements_text($1::jsonb) with ordinality x(t, o)`, [JSON.stringify(probes)]);
  probes.forEach((t, k) => { n += 1; if (r.rows[0].f[k] !== twin.nameFold(t)) differ.push([...t].map(c => c.codePointAt(0).toString(16)).join(' ')); });
}
console.log('server', (await db.query('show server_version')).rows[0].server_version, '| node unicode', process.versions.unicode, '| probes', n, '| the fold differs on', differ.length, differ.slice(0, 20).join(' ; '));
// the pattern, every code point of the basic plane and of the first supplementary plane as a name
const names = cps.filter(cp => cp <= 0x1ffff).map(cp => String.fromCodePoint(cp));
const j = (await db.query(`select public._gallery_veil_name_search(array(select jsonb_array_elements_text($1::jsonb)), array[]::text[]) as j`, [JSON.stringify(names)])).rows[0].j;
const c = twin.buildNameSearch(names, []);
console.log('names', names.length, '| pattern chars', c.pattern.length, '| the same pattern', j.p === c.pattern, '| the same names as written', JSON.stringify(j.raw) === JSON.stringify(c.raws), c.raws.length);
await db.end();
