// VEIL-52, SNAP-CHRONICLE (the chair, 00:16 UTC 2026-11-25; A9): a RUN RECIPE through the CLIENT's own publish path, judging nothing
// served. RV6_SRC = the tree (master db832c892 or the tip b58abc48b); its own gallery.js :: shareMap (publishMapParams -> the
// publish_map RPC) and worldSnapshotPublic.js :: serializeWorldSnapshotPublic, the opts built as MapShareEditor.jsx ::
// buildShareOpts builds them (sectionOpts from the ticked sections; worldSections = the ticked keys; shareWorld when any is on).
// The supabase client is mocked ONLY to carry each rpc to the LOCAL cluster (SC_DB, test.uid = the owner). One campaign of SC_G
// stored documents (SC_DIR), SC_TICKS monthly ticks of advanceCampaignWorld (a chronicle exists), then: (1) every section ticked
// (the editor's default: ALL_SECTION_KEYS); (2) the same with `chronicle` unticked. Per case: published or refused; the message the
// editor shows (MapShareEditor :: setError(e.message || 'Map share failed')), verbatim. Out: SC_OUT (json).
import { it, vi } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
const env = vi.hoisted(() => ({ db: null }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => {
  const JSONB = new Set(['p_world_sections', 'p_world_snapshot', 'p_facets']);
  const supabase = {
    auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
    rpc: async (name, params = {}) => {
      const keys = Object.keys(params); const vals = keys.map((k) => (JSONB.has(k) && params[k] != null ? JSON.stringify(params[k]) : params[k]));
      const args = keys.map((k, i) => `${k} => $${i + 1}${JSONB.has(k) ? '::jsonb' : k === 'target_id' ? '::uuid' : k === 'p_tags' ? '::text[]' : ''}`).join(', ');
      try { const r = await env.db.query(`select public.${name}(${args}) d`, vals); return { data: r.rows[0]?.d ?? null, error: null }; } catch (e) { return { data: null, error: { message: e.message } }; }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});

it('VEIL-52 SNAP-CHRONICLE through the client', async () => {
  const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
  const OWNER = '11111111-1111-1111-1111-111111111111';
  const admin = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `v52sc_${process.env.SC_TAG}`;
  await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.SC_TPL}`); await admin.end();
  env.db = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: dbn }); await env.db.connect();
  await env.db.query(`select set_config('test.uid', $1, false)`, [OWNER]);
  const gallery = await import(`${SRC}/src/lib/gallery.js`);
  const WS = await import(`${SRC}/src/domain/display/worldSnapshotPublic.js`);
  const W = await import(`${SRC}/src/domain/worldPulse/advanceCampaignWorld.js`);
  const RULES = await import(`${SRC}/src/domain/worldPulse/simulationRules.js`);
  const RG = await import(`${SRC}/src/domain/region/graph.js`);
  const files = readdirSync(process.env.SC_DIR).filter((f) => /^r3m-.*\.json$/.test(f)).sort().slice(0, Number(process.env.SC_G || 4));
  const ids = files.map((_, k) => `abcd5c00-0000-0000-0000-${String(k + 1).padStart(12, '0')}`);
  const saves = files.map((f, k) => { const d = JSON.parse(readFileSync(`${process.env.SC_DIR}/${f}`, 'utf8')); return { id: ids[k], name: d.name, phase: 'canon', settlement: d, campaignState: { phase: 'canon', eventLog: [], locks: {} } }; });
  for (const s of saves) await env.db.query(`insert into public.settlements (id,user_id,name,tier,data) values ($1,$2,$3,'town',$4)`, [s.id, OWNER, s.name || 'x', JSON.stringify(s.settlement)]);
  const RULESON = Object.fromEntries(Object.entries(RULES.DEFAULT_SIMULATION_RULES).map(([k, v]) => [k, /Enabled$/.test(k) && typeof v === 'boolean' ? true : v]));
  let campaign = { id: 'sc', name: 'SC', settlementIds: ids, worldState: { rngSeed: 'sc', tick: 0, simulationRules: RULESON, stressors: [] },
    regionalGraph: RG.ensureRegionalGraph({ edges: ids.slice(1).map((id, k) => ({ id: `e${k}`, from: ids[k], to: id, relationshipType: 'trade_partner' })) }), wizardNews: { currentTick: 0, entries: [] } };
  for (let t = 0; t < Number(process.env.SC_TICKS || 12); t += 1) { const r = W.advanceCampaignWorld({ campaign, saves, interval: 'one_month', now: '2026-11-01T00:00:00.000Z' }); campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph }; }
  const ALL = ['worldClock', 'chronicle', 'pantheon', 'warNetwork', 'dashboard'];
  const out = { tree: SRC, tpl: process.env.SC_TPL, cases: [] };
  for (const [name, keys] of [['every section ticked (the editor default)', ALL], ['chronicle unticked', ALL.filter((k) => k !== 'chronicle')]]) {
    const mapId = `abcd5c01-0000-0000-0000-${String(out.cases.length + 1).padStart(12, '0')}`;
    await env.db.query(`insert into public.saved_maps (id, user_id, name, map_data) values ($1, $2, 'm', $3)`, [mapId, OWNER, JSON.stringify({ campaign: { settlementIds: ids } })]);
    const sectionOpts = Object.fromEntries(ALL.map((k) => [k, keys.includes(k)]));
    const snapshot = WS.serializeWorldSnapshotPublic(campaign.worldState, campaign.regionalGraph, saves, sectionOpts);
    const opts = { kind: 'map_with_campaign', description: 'd', tags: [], importable: false, shareWorld: keys.length > 0, worldSections: keys, worldSnapshot: snapshot };
    let slug = null; let shown = null;
    try { slug = await gallery.shareMap(mapId, opts); } catch (e) { shown = e.message || 'Map share failed'; }
    const chron = snapshot.chronicle; const chronSize = Array.isArray(chron) ? chron.length : chron && typeof chron === 'object' ? Object.keys(chron).length : null;
    out.cases.push({ name, sections: keys, snapshotKeys: Object.keys(snapshot), chronicleEntries: chronSize, published: !!slug, refused: !slug, shown });
  }
  await env.db.end();
  const ad = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: 'postgres' }); await ad.connect(); await ad.query(`drop database if exists ${dbn} with (force)`); await ad.end();
  writeFileSync(process.env.SC_OUT, JSON.stringify(out, null, 1));
}, 3_600_000);
