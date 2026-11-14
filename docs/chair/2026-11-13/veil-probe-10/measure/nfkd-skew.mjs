// MEASURE: where PostgreSQL's NFKD and this Node's differ, every code point (alone, and after 'a').
import { createRequire } from 'node:module';
const require = createRequire('/var/tmp/v10/pgmod/');
const pg = require('pg');
const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'probe10' }); await db.connect();
const cps = []; for (let cp = 1; cp <= 0x10ffff; cp += 1) if (cp < 0xd800 || cp > 0xdfff) cps.push(cp);
let differ = [];
for (let i = 0; i < cps.length; i += 50000) {
  const part = cps.slice(i, i + 50000);
  const r = await db.query(`select array_agg(normalize(chr(c), NFKD) order by o) as a, array_agg(normalize('a' || chr(c), NFKD) order by o) as b from unnest($1::int[]) with ordinality x(c, o)`, [part]);
  part.forEach((cp, k) => { const c = String.fromCodePoint(cp);
    if (r.rows[0].a[k] !== c.normalize('NFKD') || r.rows[0].b[k] !== ('a' + c).normalize('NFKD')) differ.push(cp); });
}
const hex = (n) => n.toString(16);
console.log('server', (await db.query('show server_version')).rows[0].server_version, 'node unicode', process.versions.unicode);
console.log('code points whose NFKD differs:', differ.length, 'in the basic plane:', differ.filter(c => c <= 0xffff).length);
console.log(differ.slice(0, 80).map(hex).join(' '));
await db.end();
