// MC (VEIL-56): the MAP READ's candidate cures timed, untracked, on LOCAL TRIAL COPIES applied one on top of the other.
//   node trialmap.mjs <db (a copy of a template holding 212)> <stored dir> <out json> <fixed-salt.sql> <trial.sql ...>
// b-steps.mjs's two maps (the 140 stored documents UNMARKED {} and under the owner's hand marker, one public
// map_with_campaign each). Each phase: each map read twice, untracked (the lower kept), and the md5 of its whole members
// array (the fixed salt applied first, so the bytes compare across phases). Phase "as built", then each trial file applied
// on top of the last. A timing recipe and a byte comparison: it judges nothing a read serves.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const [DB, DIR, OUT, SALT, ...TRIALS] = process.argv.slice(2);
const OWNER = '11111111-1111-1111-1111-111111111111';
const HAND = { $veil: { v: 1, deltas: ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'].map((address) => ({ address, hidden: false })), mode: 'live', at: '2026-11-01T00:00:00.000Z' } };
const files = readdirSync(DIR).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
const db = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: DB }); await db.connect();
for (const [name, ov] of [['unmarked', {}], ['marked', HAND]]) {
  const ids = [];
  for (const [i, f] of files.entries()) {
    const id = `abcd6${name === 'unmarked' ? '0' : '1'}00-0000-0000-0000-${String(i + 1).padStart(12, '0')}`; ids.push(id);
    const raw = readFileSync(`${DIR}/${f}`, 'utf8');
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,'town',$4,true,$5,now(),$6,false,true)`, [id, OWNER, JSON.parse(raw).name || 'x', raw, `mc${name}${i}`, JSON.stringify(ov)]);
  }
  await db.query(`insert into public.saved_maps (user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable)
    values ($1, 'm', $2, true, $3, 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: ids } }), `mc-${name}`]);
}
await db.query(readFileSync(SALT, 'utf8'));
await db.query('analyze');
const md5 = (s) => createHash('md5').update(s).digest('hex');
const phase = async (label) => {
  const r = { label };
  for (const name of ['unmarked', 'marked']) {
    let best = Infinity; let m = null; let n = null;
    for (let k = 0; k < 2; k += 1) {
      const t0 = process.hrtime.bigint();
      const q = await db.query("select (public.get_gallery_map($1) -> 'members') m", [`mc-${name}`]);
      best = Math.min(best, Number(process.hrtime.bigint() - t0) / 1e6);
      const txt = JSON.stringify(q.rows[0].m); m = md5(txt); n = q.rows[0].m.length;
    }
    r[name] = { wallMs: Math.round(best), perMemberMs: +(best / n).toFixed(1), members: n, md5: m };
  }
  console.log(JSON.stringify(r)); return r;
};
const out = { db: DB, phases: [await phase('as built')] };
for (const t of TRIALS) {
  await db.query(readFileSync(t, 'utf8'));
  const r = await phase(t.split('/').pop());
  r.sameAsBuilt = { unmarked: r.unmarked.md5 === out.phases[0].unmarked.md5, marked: r.marked.md5 === out.phases[0].marked.md5 };
  out.phases.push(r);
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
await db.end();
