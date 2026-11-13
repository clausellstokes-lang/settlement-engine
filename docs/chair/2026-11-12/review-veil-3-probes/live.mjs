import { buildDb, OWNER, READER } from './db.mjs';
const { db, failed } = await buildDb();
if (failed.length) throw new Error(failed.join('\n'));
let n = 0;
async function ins(data, ov, { dm = false, pub = true } = {}) {
  n++; const id = `bbbbbbbb-0000-0000-0000-${String(n).padStart(12, '0')}`;
  await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
    values ($1,$2,'T','town',$3,$4,$5,now(),$6,'unlisted',$7,$8,true)`, [id, OWNER, JSON.stringify(data), pub, `p${n}`, `l${n}`, JSON.stringify(ov), dm]);
  return { id, slug: `p${n}`, link: `l${n}` };
}
const live = { name: 'LIVE', population: 9999, powerStructure: { government: 'LIVE_COUP_JUNTA', stability: 'LIVE_COLLAPSING' }, threatProfile: { level: 'LIVE_DIRE' },
  npcs: [{ id: 'n1', name: 'Alice', role: 'mayor', secret: 'LIVE_SECRET_ALICE' }] };
const frozen = { name: 'FROZEN', population: 100, powerStructure: { government: 'FROZEN_COUNCIL', stability: 'FROZEN_STABLE' }, threatProfile: { level: 'FROZEN_LOW' },
  npcs: [{ id: 'n1', name: 'Alice', role: 'mayor' }] };
const s = await ins(live, { $veil: { v: 1, deltas: [], mode: 'snapshot', at: '2026-01-01T00:00:00Z', snapshot: frozen } });
await db.exec(`set test.uid = '';`);
const g = (await db.query('select * from public.get_gallery_dossier($1)', [s.slug])).rows[0];
console.log('gallery data.population', g.data.population, 'name', g.data.name, '| COLUMNS: population', g.population, 'government', g.government_type, 'stability', g.stability, 'threat', g.threat_level);
console.log('overrides served', JSON.stringify(g.gallery_member_overrides));
const t = (await db.query(`select * from public.list_gallery_dossiers()`)).rows.find(r => r.public_slug === s.slug);
console.log('tile', t.population, t.government_type, t.stability, t.threat_level);
// party link of the same frozen share
const u = (await db.query('select public.get_unlisted_dossier($1) as o', [s.link])).rows[0].o;
console.log('party link dossier.name', u.dossier.name, 'population', u.dossier.population, 'served', JSON.stringify(u.gallery_member_overrides));
// mode snapshot, copy absent (an old client's write, or hand-written)
const s2 = await ins(live, { $veil: { v: 1, deltas: [], mode: 'snapshot', at: '2026-01-01T00:00:00Z' } });
const g2 = (await db.query('select * from public.get_gallery_dossier($1)', [s2.slug])).rows[0];
console.log('snapshot-without-copy: data.name', g2.data.name, 'served', JSON.stringify(g2.gallery_member_overrides));
// snapshot share with is_public=false but on a campaign map
