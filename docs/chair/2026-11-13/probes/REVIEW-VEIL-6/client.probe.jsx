// REVIEW-VEIL-6 — THE CLIENT'S OWN VEIL over the rows a cold run stored (both shapes), with no server veil in between.
// For every share: the client's projection of the STORED row exactly as its page computes it when the read is not
// served by 211 (`galleryPayloadFor` = toPublicSafe with the DM door and the member overrides, then
// `projectShareVeil` with the stored deltas; the frozen copy where the share is frozen). The result is walked as
// text for my markers, and for the name of every house it no longer lists, in any letter case or key form.
// A marker carries no origin here (the run that planted it is over): the PATH it is found at names the home.
//   RV6_SRC=<tree whose client is under test> RV6_PROBE=client.probe.jsx RV6_DBS=ct211_0,ct211_1 RV6_OUT=… vitest
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const OUT = process.env.RV6_OUT; const DBS = (process.env.RV6_DBS || '').split(',').filter(Boolean);
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const TOKEN_RE = /vq6n[0-9]+z/gi;
const fold = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
it('the client veil over stored rows', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const out = { src: SRC, shares: 0, threw: [], rows: {}, towns: new Set() };
  for (const dbname of DBS) {
    const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
    const shares = (await db.query(`select name, public_slug, data, ai_data, gallery_member_overrides ov, gallery_share_dm dm, gallery_share_narrated narr from public.settlements where public_slug is not null order by public_slug`)).rows;
    for (const sh of shares) {
      const ov = sh.ov || {}; const v = ov[veil.VEIL_OVERRIDE_KEY]; const marked = isRec(v); const deltas = marked && Array.isArray(v.deltas) ? v.deltas.length : 0;
      const kind = `${sh.dm ? 'DM reveal on' : 'no reveal'} | ${!marked ? 'unmarked' : deltas > 0 ? 'every eye shut' : 'marked, persons only'}${sh.narr ? ', narrated' : ''}${marked && v.mode === 'snapshot' ? ' | frozen' : ''}`;
      let page;
      try {
        const source = sh.narr && isRec(sh.ai_data?.aiSettlement) ? sh.ai_data.aiSettlement : sh.data;
        const pub = marked && v.mode === 'snapshot' && isRec(v.snapshot) ? v.snapshot : veil.galleryPayloadFor(source, { shareDm: sh.dm, memberOverrides: ov });
        page = veil.projectShareVeil(pub, ov);
      } catch (e) { out.threw.push(`${dbname} ${sh.public_slug}: ${String(e.message).slice(0, 120)}`); continue; }
      out.shares += 1; out.towns.add(sh.name);
      const open = new Set((page.institutions || []).filter(isRec).map((i) => fold(i.name)));
      const gone = (sh.data.institutions || []).filter(isRec).map((i) => i.name).filter((x) => typeof x === 'string' && fold(x).length >= 6 && !open.has(fold(x)));
      const hit = (key, ex) => { const r = out.rows[key] = out.rows[key] || { towns: {}, ex }; (r.towns[kind] = r.towns[kind] || new Set()).add(sh.name); };
      const walk = (x, p) => { if (Array.isArray(x)) x.forEach((y) => walk(y, `${p}[]`)); else if (isRec(x)) for (const [k, y] of Object.entries(x)) walk(y, p ? `${p}.${k}` : k); else if (typeof x === 'string') {
        if (TOKEN_RE.test(x)) hit(`marker | ${p}`, `${sh.name}: ${x.slice(0, 120)}`); TOKEN_RE.lastIndex = 0;
        if (x.length >= 5) { const f = fold(x); for (const nm of gone) if (f.includes(fold(nm))) hit(`house hidden whole (${x.includes(nm) ? 'as the card spells it' : 'another form'}) | ${p}`, `${sh.name}: "${nm}" in "${x.slice(0, 90)}"`); } } };
      walk(page, '');
    }
    await db.end();
  }
  const lines = [`client of ${SRC.split('/').pop()} over ${DBS.join(',')}: ${out.towns.size} towns, ${out.shares} shares, threw ${out.threw.length}`, ...out.threw.slice(0, 5)];
  for (const k of Object.keys(out.rows).sort()) { const r = out.rows[k];
    const sel = (pre, must) => Math.max(0, ...Object.entries(r.towns).filter(([kk]) => kk.startsWith(pre) && kk.includes(must)).map(([, s]) => s.size));
    lines.push(`${k} | every eye shut: no reveal ${sel('no reveal', 'every eye shut')}, DM ${sel('DM', 'every eye shut')} | persons only (DM): unmarked ${sel('DM', 'unmarked')}, marked ${sel('DM', 'persons only')}\n      e.g. ${r.ex}`); }
  writeFileSync(OUT, lines.join('\n') + '\n');
}, 14_400_000);
