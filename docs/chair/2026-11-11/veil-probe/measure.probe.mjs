/**
 * COHERENCE-VEIL phase 1 (a): what each public response still carries that its page hides.
 * Execution only: the chain 001..210 applied in order (chain.mjs); towns from the generator with a
 * browser's random dials; each row veiled BY HAND through the curate model the UI draws
 * (curateModelFor -> writeShareVeil, the export's own writer); each public function called as the
 * reader it serves; each PAGE built by the real client read (src/lib/gallery.js) over a fake
 * supabase whose rpc runs the real SQL. A path the response carries and the page lacks is "carried";
 * a string of 6+ characters the response carries and the page's text nowhere holds is "readable".
 * Writes its tables to veil-probe/out/measure.json. Run:
 *   npx vitest run --config docs/chair/2026-11-11/veil-probe/vitest.probe.config.mjs
 */
import { it, vi } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const H = vi.hoisted(() => ({ db: null, uid: '' }));
vi.mock('../../../../src/lib/supabase.js', () => {
  const tableFns = new Set(['get_gallery_dossier', 'import_gallery_dossier']);
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!['get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map'].includes(name)) {
        return { data: null, error: { message: `probe: ${name} not served` } };
      }
      try {
        await H.db.exec(`set test.uid = '${H.uid}';`);
        const keys = Object.keys(args);
        const call = `public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')})`;
        const q = tableFns.has(name) ? `select * from ${call}` : `select ${call} as out`;
        const r = await H.db.query(q, keys.map((k) => args[k]));
        H.last = tableFns.has(name) ? r.rows : r.rows[0]?.out;
        return { data: H.last, error: null };
      } catch (e) { return { data: null, error: { message: String(e.message) } }; }
    },
    from: () => { throw new Error('probe: no table reads'); },
  };
  return { supabase, isConfigured: true, default: supabase };
});

const OUT = resolve(process.cwd(), 'docs/chair/2026-11-11/veil-probe/out');
const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = { village: 6, town: 8, city: 6, metropolis: 4 };

// ── trees ────────────────────────────────────────────────────────────────────
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
function keyOf(el, i) {
  if (isRec(el)) for (const k of ['id', 'key', 'faction', 'name', 'title', 'address']) if (typeof el[k] === 'string' && el[k]) return `${k}=${el[k]}`;
  return `#${i}`;
}
function flat(v, p = '', out = new Map()) {
  if (Array.isArray(v)) { if (!v.length) out.set(`${p}[]`, '[]'); v.forEach((e, i) => flat(e, `${p}[${keyOf(e, i)}]`, out)); }
  else if (isRec(v)) { const ks = Object.keys(v); if (!ks.length) out.set(`${p}{}`, '{}'); for (const k of ks) flat(v[k], p ? `${p}.${k}` : k, out); }
  else out.set(p, v);
  return out;
}
const family = (p) => p.replace(/\[[^\]]*\]/g, '[*]').split('.').slice(0, 3).join('.');
function carried(resp, page, base = new Set()) {
  const R = flat(resp); const Pg = flat(page); const text = JSON.stringify(page);
  const paths = []; const readable = [];
  for (const [p, v] of R) {
    if (Pg.has(p) || base.has(p)) continue;
    paths.push(p);
    if (typeof v === 'string' && v.trim().length >= 6 && !text.includes(JSON.stringify(v).slice(1, -1))) readable.push([p, v]);
  }
  return { paths, readable };
}
function tally(rows) {
  const by = {};
  for (const p of rows) by[family(p)] = (by[family(p)] || 0) + 1;
  return Object.fromEntries(Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 14));
}

it('measures every public read on hand-veiled rows', async () => {
  const { bootChain } = await import('./chain.mjs');
  const { db, failed } = await bootChain();
  H.db = db;
  const { generateSettlementPipeline } = await import('../../../../src/generators/generateSettlementPipeline.js');
  const { composePublicProse } = await import('../../../../src/components/new/publicProseCompose.js');
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  const gallery = await import('../../../../src/lib/gallery.js');

  await db.exec(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '${OWNER}';
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);

  // the configurations a DM can set by hand, drawn from the curate model the share panel renders
  function configsFor(pub) {
    const m = veil.curateModelFor(pub, []);
    const A = { groupings: [], switches: [], houses: [], npcFields: [], powerFields: [], otherFields: [] };
    for (const sec of m.sections) {
      for (const g of sec.groupings) A.groupings.push(g.address);
      for (const s of sec.switches) A.switches.push(s.address);
      for (const c of sec.cards) {
        if (c.whole) A.houses.push(c.whole.address);
        for (const e of c.eyes) (c.kind === 'npc' ? A.npcFields : c.kind === 'faction' ? A.powerFields : A.otherFields).push(e.address);
      }
    }
    const faces = (pub.npcs || []).map((n) => `card:npc:${veil.CARD_KINDS.npc.idOf(n)}`).filter((a) => !a.endsWith(':'));
    const hide = (xs) => xs.map((address) => ({ address, hidden: true }));
    return {
      default: [], groupings: hide(A.groupings), switches: hide(A.switches), houses: hide(A.houses),
      faces: hide(faces), npcFields: hide(A.npcFields), powerFields: hide(A.powerFields), otherFields: hide(A.otherFields),
      all: hide([...A.groupings, ...A.switches, ...A.houses, ...faces, ...A.npcFields, ...A.powerFields, ...A.otherFields]),
    };
  }

  const seeds = []; const results = []; const flags = { veiledFaces: 0, resp: {}, page: {} };
  let n = 0;
  for (const [settType, count] of Object.entries(TIERS)) {
    for (let k = 0; k < count; k += 1) {
      const seed = `coherence-veil-${settType}-${k}`; seeds.push(seed);
      const raw = generateSettlementPipeline({ settType, ...BROWSER }, null, { seed, customContent: {} });
      const record = { ...raw, publicProse: composePublicProse(raw) };
      const pub = veil.galleryPayloadFor(record, {});
      const cfgs = configsFor(pub);
      const id = `aaaaaaaa-0000-0000-0000-${String(++n).padStart(12, '0')}`;
      const slug = `pub-${n}`; const link = `lnk-${n}`;
      await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_importable)
        values ($1, $2, $3, $4, $5, true, $6, now(), $7, 'unlisted', true)`, [id, OWNER, record.name || seed, settType, JSON.stringify(record), slug, link]);
      const setRow = (ov, shareDm) => db.query('update public.settlements set gallery_member_overrides = $2, gallery_share_dm = $3 where id = $1', [id, JSON.stringify(ov), shareDm]);

      // baseline: an unmarked listing — the client's projection alone (the sanitiser twin's gap)
      await setRow({}, false);
      H.uid = '';
      const basePage = (await gallery.fetchPublicDossier(slug)).settlement;
      const baseResp = H.last[0];
      const base = carried(baseResp.data, basePage);
      const baseSet = new Set(base.paths);
      results.push({ seed, cfg: 'unmarked', proj: 'gallery', paths: base.paths.length, readable: base.readable.length, fam: tally(base.paths), sample: base.readable.slice(0, 3) });

      for (const [cfg, deltas] of Object.entries(cfgs)) {
        for (const mode of ['live', 'snapshot']) {
          for (const shareDm of (cfg === 'all' ? [false, true] : [false])) {
            const ov0 = veil.writeShareVeil({}, deltas, { mode, at: '2026-11-11T00:00:00Z',
              snapshot: mode === 'snapshot' ? veil.galleryPayloadFor(record, { shareDm }) : null });
            await setRow(ov0, shareDm);
            const tag = `${cfg}${shareDm ? '+dm' : ''}/${mode}`;
            // gallery page, anon
            H.uid = '';
            const gPage = (await gallery.fetchPublicDossier(slug)).settlement;
            const gRow = H.last[0];
            const g = carried(gRow.data, gPage, baseSet);
            results.push({ seed, cfg: tag, proj: 'gallery.data', paths: g.paths.length, readable: g.readable.length, fam: tally(g.paths), sample: g.readable.slice(0, 2) });
            const snap = gRow.gallery_member_overrides?.$veil?.snapshot;
            if (snap) {
              const s = carried(snap, gPage, baseSet);
              results.push({ seed, cfg: tag, proj: 'gallery.snapshot', paths: s.paths.length, readable: s.readable.length, fam: tally(s.paths), sample: s.readable.slice(0, 2) });
            }
            const deltaText = JSON.stringify(gRow.gallery_member_overrides?.$veil?.deltas || []);
            results.push({ seed, cfg: tag, proj: 'gallery.deltas', paths: (gRow.gallery_member_overrides?.$veil?.deltas || []).length, readable: 0, bytes: deltaText.length });
            // party link, anon (gallery misses the link slug, so the client takes the link branch)
            const lPage = (await gallery.fetchPublicDossier(link)).settlement;
            const lResp = H.last;
            const l = carried(lResp.dossier, lPage, baseSet);
            results.push({ seed, cfg: tag, proj: 'link.dossier', paths: l.paths.length, readable: l.readable.length, fam: tally(l.paths), sample: l.readable.slice(0, 2) });
            results.push({ seed, cfg: tag, proj: 'link.overrides', paths: Object.keys(lResp.gallery_member_overrides?.$veil || {}).length, readable: 0, hasSnapshot: !!lResp.gallery_member_overrides?.$veil?.snapshot });
            // import, another premium DM: the response against the GALLERY page's hidden set
            if (cfg === 'all' && mode === 'live') {
              H.uid = READER;
              const imp = await gallery.fetchDossierForImport(slug);
              const iResp = H.last[0].data;
              const hidden = new Map(g.readable);
              const iText = JSON.stringify(iResp); const iPage = JSON.stringify(imp.settlement);
              let inResp = 0; let onPage = 0;
              for (const [, v] of hidden) { const t = JSON.stringify(v).slice(1, -1); if (iText.includes(t)) inResp += 1; if (iPage.includes(t)) onPage += 1; }
              results.push({ seed, cfg: tag, proj: 'import', hiddenOnGallery: hidden.size, inResponse: inResp, onImporterPage: onPage });
              // a public map holding this town: its member dossier, as the map page renders it
              const mapId = `cccccccc-0000-0000-0000-${String(n).padStart(12, '0')}`;
              await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign) values ($1, $2, 'probe map', $3, true, $4, 'map_with_campaign', true) on conflict do nothing`,
                [mapId, OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `map-${n}`]).catch((e) => { results.push({ seed, proj: 'map', error: String(e.message) }); });
              H.uid = '';
              const map = await gallery.fetchGalleryMap(`map-${n}`).catch((e) => ({ error: String(e.message) }));
              const member = map?.members?.find((mm) => mm.settlement)?.settlement;
              if (member) {
                const mText = JSON.stringify(member); let shown = 0;
                for (const [, v] of hidden) if (mText.includes(JSON.stringify(v).slice(1, -1))) shown += 1;
                results.push({ seed, cfg: tag, proj: 'map.member (rendered as sent)', hiddenOnGallery: hidden.size, onMapPage: shown });
              } else results.push({ seed, cfg: tag, proj: 'map', note: map?.error || 'no member settlement' });
              H.uid = '';
            }
            // COHERENCE-POWERS's flag: a face the generator stamped veiled — what of its house travels
            if (cfg === 'default' && mode === 'live') {
              const veiled = (record.npcs || []).filter((p) => isRec(p.institution) && p.institution.veiled === true);
              flags.veiledFaces += veiled.length;
              const rawText = JSON.stringify(record);
              flags.controlTitleInRecord = (flags.controlTitleInRecord || 0) + veiled.filter((p) => p.institution.title && rawText.includes(`"${p.institution.title}"`)).length;
              flags.controlMembershipsInRecord = (flags.controlMembershipsInRecord || 0) + veiled.filter((p) => Array.isArray(p.memberships) && p.memberships.length).length;
              for (const [where, tree] of [['gallery.response', gRow.data], ['gallery.page', gPage], ['link.response', lResp.dossier], ['link.page', lPage]]) {
                const bucket = where.endsWith('page') ? flags.page : flags.resp;
                const cards = [];
                const walk = (v) => { if (Array.isArray(v)) v.forEach(walk); else if (isRec(v)) { if (typeof v.id === 'string' && veiled.some((p) => p.id === v.id)) cards.push(v); Object.values(v).forEach(walk); } };
                walk(tree);
                bucket[`${where}.cardsMatched`] = (bucket[`${where}.cardsMatched`] || 0) + cards.length;
                for (const c of cards) for (const key of ['institution', 'memberships', 'title', 'role']) if (c[key] !== undefined) {
                  const kk = `${where}.${key}`; bucket[kk] = (bucket[kk] || 0) + 1;
                }
                const txt = JSON.stringify(tree);
                for (const p of veiled) if (p.institution.title && txt.includes(`"${p.institution.title}"`)) { const kk = `${where}.houseTitleText`; bucket[kk] = (bucket[kk] || 0) + 1; }
              }
            }
          }
        }
      }
    }
  }
  // roll up
  const roll = {};
  for (const r of results) {
    const k = `${r.proj} | ${r.cfg ?? ''}`.replace(/ \| $/, '');
    const a = (roll[k] ||= { rows: 0, paths: 0, readable: 0, fam: {}, extra: {} });
    a.rows += 1; a.paths += r.paths || 0; a.readable += r.readable || 0;
    for (const [f, c] of Object.entries(r.fam || {})) a.fam[f] = (a.fam[f] || 0) + c;
    for (const x of ['hiddenOnGallery', 'inResponse', 'onImporterPage', 'onMapPage', 'bytes']) if (r[x] !== undefined) a.extra[x] = (a.extra[x] || 0) + r[x];
    if (r.hasSnapshot) a.extra.linkSnapshot = (a.extra.linkSnapshot || 0) + 1;
    if (r.note || r.error) a.extra.note = r.note || r.error;
  }
  for (const a of Object.values(roll)) a.fam = Object.fromEntries(Object.entries(a.fam).sort((x, y) => y[1] - x[1]).slice(0, 10));
  mkdirSync(OUT, { recursive: true });
  writeFileSync(resolve(OUT, 'measure.json'), JSON.stringify({ chainFailed: failed, seeds, flags, roll,
    samples: results.filter((r) => r.sample?.length).slice(0, 60).map((r) => ({ seed: r.seed, cfg: r.cfg, proj: r.proj, sample: r.sample })) }, null, 1));
});
