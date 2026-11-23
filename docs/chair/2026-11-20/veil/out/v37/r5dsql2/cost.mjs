#!/usr/bin/env node
// R5D-SQL-2 run (i): THE COST LAW (ruling 12; R5D-SQL's recipe, its hand-back section 1): the largest born metropolis (the probe's
// largest-metropolis.json: its stored text and the default veil record), read as anon, 9 rounds after one warm-up, medians, on
// three local chains: 211 frozen (001..211), the -wip's 212 at eeda6a126, and this tree's 212. The rounds interleave the chains,
// so each round's load is the same for the three. THE LAW: this 212's Reveal-DM gallery read within twice 211's Reveal-off read.
//   PGHOST=... node cost.mjs <largest-metropolis.json> <db 211> <db eeda6a126> <db this> <pg module dir>
import { readFileSync } from 'node:fs';
import { loadavg } from 'node:os';

const [file, d211, dOld, dNew, pgmod] = process.argv.slice(2);
if (!pgmod) { console.error('usage: cost.mjs <largest-metropolis.json> <db 211> <db eeda6a126> <db this> <pg module dir>'); process.exit(2); }
const pg = (await import(`${pgmod}/node_modules/pg/lib/index.js`)).default;
const { seed, length, record, defaultVeil } = JSON.parse(readFileSync(file, 'utf8'));
const chains = [['211', d211], ['eeda6a126 212', dOld], ['this 212', dNew]];
const reads = [['gallery, Reveal DM off', 'off'], ['gallery, Reveal DM', 'dm'], ['link', 'link']];
const clients = {};
for (const [name, database] of chains) {
  const c = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database }); await c.connect();
  await c.query("delete from public.settlements where public_slug like 'r5qcost%'");
  for (const [slug, dm] of [['r5qcostoff', false], ['r5qcostdm', true]]) {
    await c.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
      values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, $2, $3, true, $4, now(), $5, 'unlisted', $6, $7, true)`,
    [String(record.name || 'T'), String(record.tier || 'metropolis'), JSON.stringify(record), slug, `${slug}l`, JSON.stringify(defaultVeil), dm]);
  }
  await c.query("select set_config('test.uid', '', false)");
  clients[name] = c;
}
const SQL = {
  off: ["select md5(to_jsonb(g.data)::text) as h from public.get_gallery_dossier('r5qcostoff') g", null],
  dm: ["select md5(to_jsonb(g.data)::text) as h from public.get_gallery_dossier('r5qcostdm') g", null],
  link: ["select md5(public.get_unlisted_dossier('r5qcostoffl')::text) as h", null],
};
const time = async (c, q) => { await c.query('set role anon'); const t0 = process.hrtime.bigint(); const r = await c.query(q); const ms = Number(process.hrtime.bigint() - t0) / 1e6; await c.query('reset role'); if (!r.rows[0]?.h) throw new Error(`no row: ${q}`); return ms; };
const ms = {};
for (let round = 0; round <= 9; round += 1) {
  for (const [name] of chains) for (const [, k] of reads) {
    const v = await time(clients[name], SQL[k][0]);
    if (round > 0) (ms[`${name}|${k}`] ||= []).push(v);
  }
}
for (const [name] of chains) { await clients[name].query("delete from public.settlements where public_slug like 'r5qcost%'"); await clients[name].end(); }
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const M = (name, k) => med(ms[`${name}|${k}`]);
console.log(`(i) THE COST LAW on ${seed} (${length} characters), the default veil record, as anon, 9 rounds (after one warm-up), medians, ms; load ${loadavg().map((x) => x.toFixed(2)).join(' ')}`);
console.log(`| read | ${chains.map(([n]) => n).join(' | ')} |`);
console.log(`|---|${chains.map(() => '---').join('|')}|`);
for (const [label, k] of reads) console.log(`| ${label} | ${chains.map(([n]) => M(n, k).toFixed(1)).join(' | ')} |`);
const law = M('this 212', 'dm'); const bound = 2 * M('211', 'off');
console.log(`this 212's Reveal-DM read ${law.toFixed(1)} ms against twice 211's Reveal-off read (2 x ${M('211', 'off').toFixed(1)} = ${bound.toFixed(1)}): ${law <= bound ? 'WITHIN' : 'OUTSIDE'}`);
console.log(`this 212 against eeda6a126's: ${reads.map(([, k]) => (M('this 212', k) / M('eeda6a126 212', k)).toFixed(2)).join(', ')}`);
process.exit(law <= bound ? 0 : 1);
