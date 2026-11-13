// REVIEW-VEIL-6 — V5-4 IS CURED ON THE SERVER ONLY: does a client ever hold, or store, the hidden person first?
// (1) THE FROZEN COPY. The owner's client builds a snapshot share's frozen copy itself
//     (useGalleryShareControls :: modeRecord -> galleryPayloadFor(settlement, { shareDm, memberOverrides })) and
//     stores it in the row; the server serves that copy. With no client twin of the roster cure, the copy a client
//     builds keeps the whole card of a switched-off person inside a power's roster. So: for every stored share with
//     Reveal DM on and every person switched off, the frozen copy is built by THIS tree's client, stored beside the
//     row as a snapshot share, and the gallery read and the import are searched for my markers inside any roster.
// (2) THE PLAYER'S WORLD EXPORT (lib/worldExport.js :: buildWorldExport, variant 'player'): built by the owner's
//     client from the owner's record with no share and so no hand hide. Which of my markers does it carry?
//   RV6_SRC=<tree> RV6_PROBE=v54frozen.probe.jsx RV6_DB=<a database with 212 applied and a cold run's shares> RV6_OUT=…
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const OUT = process.env.RV6_OUT;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const READER = '22222222-2222-2222-2222-222222222222';
const paths = (v, re, p = '', out = {}) => { if (Array.isArray(v)) v.forEach((x) => paths(x, re, `${p}[]`, out)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) paths(x, re, p ? `${p}.${k}` : k, out); else if (typeof v === 'string' && re.test(v)) out[p] = (out[p] || 0) + 1; return out; };
it('the frozen copy and the player export', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  let buildWorldExport = null; try { buildWorldExport = (await import(`${SRC}/src/lib/worldExport.js`)).buildWorldExport; } catch { /* not in this tree */ }
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.RV6_DB }); await db.connect();
  const rows = (await db.query(`select id, name, tier, data, gallery_member_overrides ov from public.settlements where gallery_share_dm and public_slug is not null and gallery_member_overrides ? '$veil'
     and jsonb_array_length(gallery_member_overrides->'$veil'->'deltas') = 0 and not gallery_share_narrated order by public_slug`)).rows;
  const t = { shares: 0, copyHeldRoster: 0, copyRosterPaths: {}, sentRoster: 0, sentPaths: {}, raised: [], exportPaths: {}, exportTowns: 0 };
  const RE = /vq6n[0-9]+z/i; const inRoster = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => /members\[\]\./.test(k) && !/\.(personality|physical)\b/.test(k)));
  let n = 0;
  for (const r of rows) {
    n += 1; t.shares += 1; const ovPeople = Object.fromEntries(Object.entries(r.ov).filter(([k]) => k !== veil.VEIL_OVERRIDE_KEY));
    const copy = veil.galleryPayloadFor(r.data, { shareDm: true, memberOverrides: ovPeople });
    const held = inRoster(paths(copy, RE)); if (Object.keys(held).length) t.copyHeldRoster += 1; for (const [k, c] of Object.entries(held)) t.copyRosterPaths[k] = (t.copyRosterPaths[k] || 0) + c;
    const ov = veil.writeShareVeil(ovPeople, [], { mode: 'snapshot', at: '2026-11-13T00:00:00.000Z', snapshot: copy });
    const slug = `fz${n}`; const id = `abcd6699-0000-0000-0000-${String(n).padStart(12, '0')}`;
    try {
      await db.query(`delete from public.settlements where id = $1`, [id]);
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,'11111111-1111-1111-1111-111111111111',$2,$3,$4,true,$5,now(),$6,'unlisted',$7,true,true)`, [id, r.name, r.tier, JSON.stringify(r.data), slug, `${slug}l`, JSON.stringify(ov)]);
      await db.query(`select set_config('test.uid', '', false)`);
      const g = (await db.query('select * from public.get_gallery_dossier($1)', [slug])).rows[0];
      await db.query(`select set_config('test.uid', $1, false)`, [READER]);
      const im = (await db.query('select * from public.import_gallery_dossier($1)', [slug])).rows[0];
      await db.query(`select set_config('test.uid', '', false)`);
      const sent = { ...inRoster(paths(g?.data, RE)), ...Object.fromEntries(Object.entries(inRoster(paths(im?.data, RE))).map(([k, c]) => [`(import) ${k}`, c])) };
      if (Object.keys(sent).length) t.sentRoster += 1; for (const [k, c] of Object.entries(sent)) t.sentPaths[k] = (t.sentPaths[k] || 0) + c;
      await db.query(`delete from public.settlements where id = $1`, [id]);
    } catch (e) { t.raised.push(String(e.message).slice(0, 140)); }
    if (buildWorldExport) { const ex = buildWorldExport({ name: 'w', settlements: [{ id: r.id, name: r.name, settlement: r.data }] }, {}); t.exportTowns += 1; for (const [k, c] of Object.entries(paths(ex, RE))) { const kk = k.replace(/^settlements\[\]\.dossier\./, ''); t.exportPaths[kk] = (t.exportPaths[kk] || 0) + 1; } }
  }
  await db.end();
  const fmt = (o) => Object.keys(o).sort().map((k) => `      ${k}: ${o[k]}`).join('\n') || '      (none)';
  writeFileSync(OUT, `client of ${SRC.split('/').pop()} on ${process.env.RV6_DB}: ${t.shares} shares (Reveal DM on, marked, every person switched off, no other eye)\n`
    + `(1) frozen copies this client built that hold a marker inside a roster (outside personality and appearance): ${t.copyHeldRoster} of ${t.shares}\n${fmt(t.copyRosterPaths)}\n`
    + `    … and after the server read that copy back: shares that SENT such a marker in a roster: ${t.sentRoster} of ${t.shares}; raised ${t.raised.length} ${t.raised[0] || ''}\n${fmt(t.sentPaths)}\n`
    + (buildWorldExport ? `(2) the player's world export of the same ${t.exportTowns} towns: paths carrying one of my markers, by number of towns\n${fmt(t.exportPaths)}\n` : '(2) this tree has no world export\n'));
}, 14_400_000);
