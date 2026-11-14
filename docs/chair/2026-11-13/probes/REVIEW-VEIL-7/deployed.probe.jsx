// REVIEW-VEIL-7 — THE DEPLOYED CLIENT'S PAGE MODEL over a chain WITHOUT 211 and a chain WITH 211 ALONE.
// Run in a worktree of origin/master (the deployed client): for each chain of RV7_CHAINS and each stored share whose
// public_slug matches RV7_LIKE, the gallery read as anon, then the page's settlement exactly as master's
// src/lib/gallery.js builds it: projectShareVeil(toPublicSafe(data, { full: gallery_share_dm, memberOverrides }),
// gallery_member_overrides), with the overrides the READ returned. Writes <RV7_OUT>/<chain>-<slug>-wire.json (what
// the server sent) and <chain>-<slug>-page.json (what the deployed page would draw from).
//   RV6_SRC=<master worktree> RV6_PROBE=../REVIEW-VEIL-7/deployed.probe.jsx RV6_PGMOD=<dir> RV7_CHAINS=t203,p211 RV7_LIKE='rv7%' RV7_OUT=<dir> npx vitest run --config ../REVIEW-VEIL-6/vitest.config.mjs
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('the deployed page model over two chains', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const safe = await import(`${SRC}/src/domain/display/publicSafe.js`);
  for (const chain of process.env.RV7_CHAINS.split(',')) {
    const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: chain }); await db.connect();
    const slugs = (await db.query(`select public_slug from public.settlements where public_slug like $1 order by 1`, [process.env.RV7_LIKE])).rows.map(r => r.public_slug);
    for (const slug of slugs) {
      await db.query(`select set_config('test.uid', '', false)`); await db.query('set role anon');
      const row = (await db.query(`select data, gallery_share_dm, gallery_member_overrides from public.get_gallery_dossier($1)`, [slug])).rows[0]; await db.query('reset role');
      if (!row) continue;
      const overrides = isRec(row.gallery_member_overrides) ? row.gallery_member_overrides : {};
      let page;
      try { page = veil.projectShareVeil(safe.toPublicSafe(row.data, { full: row.gallery_share_dm === true, memberOverrides: overrides }), row.gallery_member_overrides); }
      catch (e) { page = { ERROR: String(e && e.stack || e).slice(0, 400) }; }
      writeFileSync(`${process.env.RV7_OUT}/${chain}-${slug}-wire.json`, JSON.stringify(row.data));
      writeFileSync(`${process.env.RV7_OUT}/${chain}-${slug}-page.json`, JSON.stringify(page));
    }
    await db.end();
  }
}, 14_400_000);
