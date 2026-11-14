// REVIEW-VEIL-7 — THE CLIENT'S TWIN as a reader of its own, over hand-written or born rows stored on a local chain.
// For every stored share whose public_slug matches RV7_LIKE: the client's projection of the STORED row, as its page
// computes it when no server veil stands in between (galleryPayloadFor, then projectShareVeil with the stored
// deltas; the frozen copy where frozen), written to <RV7_OUT>/<public_slug>-client.json. A throw is written as
// {"ERROR": ...}. Run through REVIEW-VEIL-6's vitest.config.mjs:
//   RV6_SRC=<lane worktree> RV6_PROBE=../REVIEW-VEIL-7/twin.probe.jsx RV6_PGMOD=<dir> RV7_DB=c212 RV7_LIKE='rv7a-%' RV7_OUT=<dir> npx vitest run --config …
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('the client twin over stored rows', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.RV7_DB }); await db.connect();
  const shares = (await db.query(`select public_slug, data, ai_data, gallery_member_overrides ov, gallery_share_dm dm, gallery_share_narrated narr from public.settlements where public_slug like $1 order by public_slug`, [process.env.RV7_LIKE])).rows;
  let n = 0;
  for (const sh of shares) {
    const ov = sh.ov || {}; const v = ov[veil.VEIL_OVERRIDE_KEY]; const marked = isRec(v);
    let page;
    try {
      const source = sh.narr && isRec(sh.ai_data?.aiSettlement) ? sh.ai_data.aiSettlement : sh.data;
      const pub = marked && v.mode === 'snapshot' && isRec(v.snapshot) ? v.snapshot : veil.galleryPayloadFor(source, { shareDm: sh.dm, memberOverrides: ov });
      page = veil.projectShareVeil(pub, ov);
    } catch (e) { page = { ERROR: String(e && e.stack || e).slice(0, 400) }; }
    writeFileSync(`${process.env.RV7_OUT}/${sh.public_slug}-client.json`, JSON.stringify(page)); n += 1;
  }
  await db.end();
  console.log(`twin: ${n} shares written`);
}, 14_400_000);
