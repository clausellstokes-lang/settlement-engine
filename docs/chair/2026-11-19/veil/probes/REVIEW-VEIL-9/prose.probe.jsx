// REVIEW-VEIL-9 — THE STORED PUBLIC PROSE, BY COUNTERFACTUAL. The public prose is composed on the OWNER's record at
// the save (publicProseCompose.js) and stored; the share veil hides houses whole later. For every share a cold run
// stored with its eyes shut (RV9_DBS): H = the houses the stored town lists and the served gallery read does not;
// the tree's own composePublicProse over the stored town, and over the same town with H taken out of `institutions`
// (and out of every list of ids that names them). A sentence the SERVER SENDS in `publicProse` that the full town's
// composition writes and the composition without H does not is a sentence that exists because H exists.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const OUT = process.env.RV9_OUT; const DBS = (process.env.RV9_DBS || '').split(',').filter(Boolean);
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const strings = (v, acc = []) => { if (typeof v === 'string') acc.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, acc)); else if (isRec(v)) Object.values(v).forEach((x) => strings(x, acc)); return acc; };
const sentences = (v) => new Set(strings(v).flatMap((s) => s.replace(/\s*vq6n[0-9]+z/gi, '').split(/(?<=[.!?;:])\s+/)).map((s) => s.trim()).filter((s) => s.length >= 8));
it('REVIEW-VEIL-9: the stored public prose by counterfactual', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await loadGenerationLawPayloads();
  const rows = {}; const lines = [];
  const bump = (k, ex) => { rows[k] = rows[k] || { n: 0, towns: new Set(), ex }; rows[k].n += 1; rows[k].towns.add(ex.split(':')[0]); };
  for (const dbname of DBS) {
    const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
    await db.query(`select set_config('test.uid', '', false)`);
    const shares = (await db.query(`select public_slug, unlisted_slug, name, data, gallery_share_dm dm, gallery_member_overrides->'$veil'->>'mode' mode from public.settlements
      where public_slug is not null and coalesce(jsonb_array_length(gallery_member_overrides->'$veil'->'deltas'),0) > 0 and not gallery_share_narrated order by public_slug`)).rows;
    let n = 0; let withProse = 0; let withH = 0;
    for (const sh of shares) {
      const g = (await db.query('select * from public.get_gallery_dossier($1)', [sh.public_slug])).rows[0]?.data;
      const l = (await db.query('select public.get_unlisted_dossier($1) x', [sh.unlisted_slug])).rows[0]?.x?.dossier;
      if (!isRec(g)) continue; n += 1;
      const openIds = new Set((g.institutions || []).filter(isRec).map((i) => i.id)); const openNames = new Set((g.institutions || []).filter(isRec).map((i) => i.name));
      const H = (sh.data.institutions || []).filter(isRec).filter((h) => !(h.id && openIds.has(h.id)) && !openNames.has(h.name));
      if (!H.length) continue; withH += 1;
      const hid = new Set(H.map((h) => h.id).filter(Boolean)); const hname = new Set(H.map((h) => h.name));
      const without = structuredClone(sh.data);
      without.institutions = (without.institutions || []).filter((h) => !(isRec(h) && (hid.has(h.id) || hname.has(h.name))));
      const scrub = (v) => { if (Array.isArray(v)) { for (let i = v.length - 1; i >= 0; i -= 1) { if (typeof v[i] === 'string' && (hid.has(v[i]) || hname.has(v[i]))) v.splice(i, 1); else scrub(v[i]); } } else if (isRec(v)) for (const k of Object.keys(v)) scrub(v[k]); };
      scrub(without); delete without.publicProse;
      let A; let B; try { const full = structuredClone(sh.data); delete full.publicProse; A = composePublicProse(full); B = composePublicProse(without); } catch (e) { bump(`${dbname} | compose threw`, `${sh.name}: ${String(e.message).slice(0, 120)}`); continue; }
      for (const [read, body] of [['gallery', g], ['link', l]]) {
        const served = body?.publicProse?.blocks; if (!isRec(served)) { bump(`${dbname} | ${read} | NO publicProse served`, `${sh.name}: ${Object.keys(body || {}).length} keys`); continue; } withProse += 1;
        for (const site of Object.keys(served)) {
          const s = sentences(served[site]); const a = sentences(A?.blocks?.[site]); const b = sentences(B?.blocks?.[site]);
          for (const x of s) if (a.has(x) && !b.has(x)) bump(`${dbname.replace(/_\d+$/, '')} | ${read} | ${sh.dm ? 'DM reveal on' : 'no reveal'} | ${site}`, `${sh.name}: "${x.slice(0, 200)}" [hidden: ${[...hname].join('; ').slice(0, 120)}]`);
        }
      }
    }
    lines.push(`${dbname}: ${n} shares with eyes shut, ${withH} with a house hidden whole, ${withProse} served reads carrying publicProse`);
    await db.end();
  }
  for (const k of Object.keys(rows).sort()) lines.push(`${k} | sentences ${rows[k].n} | towns ${rows[k].towns.size}\n      e.g. ${rows[k].ex}`);
  writeFileSync(OUT, lines.join('\n') + '\n');
}, 14_400_000);
