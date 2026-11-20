// R4 measure: where a holder's NAME appears inside served strings (containment), and where a holder id is referenced, per cell.
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const db = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: process.argv[2] || 'r4meas' }); await db.connect();
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const rows = (await db.query(`select id, public_slug slug, unlisted_slug ul, gallery_share_dm dm, gallery_member_overrides ? '$veil' marked, data from public.settlements order by id`)).rows;
const out = {}; const bump = (k, n = 1) => { out[k] = (out[k] || 0) + n; };
const ex = {};
for (const r of rows) {
  const s = r.data; const shape = s.schemaVersion === 1 ? 'old' : 'new';
  const hn = new Set((s.institutions || []).filter((h) => isRec(h) && /criminal/i.test(String(h.category))).map((h) => h.name));
  const hk = (p) => (isRec(p.institution) ? p.institution.key : p.institution);
  const H = (s.npcs || []).filter((p) => isRec(p) && (String(p.id).startsWith('npc_veiled_') || hn.has(hk(p))));
  const Hid = new Set(H.map((p) => p.id)); const Hn = H.map((p) => p.name).filter((x) => typeof x === 'string' && x.length > 3);
  await db.query(`select set_config('test.uid', '', false)`);
  const reads = { gallery: (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [r.slug])).rows[0]?.d };
  for (const [read, doc] of Object.entries(reads)) {
    if (!isRec(doc)) continue;
    const cell = `${shape}|${r.marked ? 'marked' : 'unmarked'}|${r.dm ? 'DM' : 'off'}`;
    const walk = (v, p, own) => {
      if (typeof v === 'string') { if (Hid.has(v)) bump(`${cell} ID-REF ${p}`); if (!own) for (const n of Hn) if (v.includes(n)) { bump(`${cell} NAME-IN ${p}`); if (!ex[p]) ex[p] = v.slice(0, 140); break; } return; }
      if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`, own));
      else if (isRec(v)) { const o2 = own || (p === 'npcs[]' && Hid.has(v.id)); for (const k of Object.keys(v)) walk(v[k], p ? `${p}.${k}` : k, o2); }
    };
    walk(doc, '', false);
  }
}
await db.end();
for (const [k, v] of Object.entries(out).sort()) console.log(v, k);
console.log('EX'); for (const [k, v] of Object.entries(ex)) console.log(k, '=>', v);
