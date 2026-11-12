/**
 * COHERENCE-VEIL-2: THE CLAIMS THAT MUST STILL HOLD, by comparison on generated towns of all six sizes.
 * Thorp to metropolis, each calm and in crisis (TOWNS_PER pairs per size), every configuration the
 * routine pin sets by hand through the share panel's own model and writer, live and as a frozen copy,
 * Reveal DM on for three of them. Each row is read:
 *   at 210 by today's client (the page before 211: the control);
 *   at the working 211 (WORK_211, else the file on disk) by today's client, response and page;
 *   at the working 211 by the client of decc7bf15 (OLD_SRC: that commit's src/, extracted whole).
 * Counted, each a list of offences (all must be empty):
 *   carried   a path in gallery `data` / link `dossier` the page lacks, or a string of 6+ characters
 *             in the response nowhere in the page's text;
 *   overrides anything in gallery_member_overrides but members' booleans and the served marker;
 *   changed   the 211 page differs from the 210 page of the same share read live (canonical key order);
 *   oldShows  a string of 6+ characters on the OLD client's page over 211 that the 210 page lacks;
 *   importMap the import response and the map member against the listing page (live, no Reveal DM).
 *   PG_MODULE=... PGHOST=... PGPORT=... PGUSER=postgres OLD_SRC=<dir>/src [WORK_211=<file>] [TOWNS_PER=1] \
 *   npx vitest run --config docs/chair/2026-11-12/veil-probe-2/vitest.config.mjs towns
 * Writes veil-probe-2/out/towns.json.
 */
import { it, vi } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { nativeChain, OWNER, READER } from './native.mjs';
import { H, BROWSER } from './client.mjs';

vi.mock('../../../../src/lib/supabase.js', async () => (await import('./client.mjs')).fakeSupabase());
vi.mock(`${process.env.OLD_SRC}/lib/supabase.js`, async () => (await import('./client.mjs')).fakeSupabase());
const OUT = resolve(process.cwd(), 'docs/chair/2026-11-12/veil-probe-2/out');

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
function canon(v) {
  if (Array.isArray(v)) return v.map(canon);
  if (!isRec(v)) return v;
  return Object.fromEntries(Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => [k, canon(v[k])]));
}
function carried(resp, page) {
  page = canon(page);
  const R = flat(resp); const P = flat(page); const text = JSON.stringify(page);
  const paths = []; const readable = [];
  for (const [p, v] of R) {
    if (P.has(p)) continue;
    paths.push(p);
    if (typeof v === 'string' && v.trim().length >= 6 && !text.includes(JSON.stringify(v).slice(1, -1))) readable.push(`${p} = ${v.slice(0, 80)}`);
  }
  return { paths, readable };
}
/** Strings of 6+ characters in `a` that `b`'s text nowhere holds. */
function shows(a, b) {
  const text = JSON.stringify(canon(b));
  return [...flat(a)].filter(([, v]) => typeof v === 'string' && v.trim().length >= 6 && !text.includes(JSON.stringify(v).slice(1, -1))).map(([p, v]) => `${p} = ${v.slice(0, 60)}`);
}
function overridesOffences(ov) {
  const out = [];
  if (!isRec(ov)) return ov == null ? [] : ['not an object'];
  for (const [k, v] of Object.entries(ov)) {
    if (k === '$veil') { if (!isRec(v) || v.v !== 2) out.push('$veil not served'); else for (const kk of Object.keys(v)) if (!['v', 'mode', 'at', 'groupings'].includes(kk)) out.push(`$veil.${kk}`); continue; }
    if (!isRec(v)) { out.push(`member ${k}`); continue; }
    for (const kk of Object.keys(v)) if (!['revealDm', 'allowImport'].includes(kk) || typeof v[kk] !== 'boolean') out.push(`member ${k}.${kk}`);
  }
  return out;
}

it('the six sizes: nothing carried, no page changed, the old client never shows more', async () => {
  const F = '211_server_side_share_veil.sql';
  const at210 = await nativeChain('cw210', 210, {});
  const at211 = await nativeChain('cw211', 999, process.env.WORK_211 ? { [F]: process.env.WORK_211 } : {});
  const out = { failed: { at210: at210.failed, at211: at211.failed }, towns: [], totals: {}, examples: {} };
  const gallery = await import('../../../../src/lib/gallery.js');
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  const oldGallery = await import(`${process.env.OLD_SRC}/lib/gallery.js`);
  const { generateSettlementPipeline: gen } = await import('../../../../src/generators/generateSettlementPipeline.js');
  const { composePublicProse: compose } = await import('../../../../src/components/new/publicProseCompose.js');
  const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const CRISIS = { thorp: 'infiltrated', hamlet: 'insurgency', village: 'infiltrated', town: 'occupied', city: 'slave_revolt', metropolis: 'infiltrated' };
  const per = Number(process.env.TOWNS_PER || 1);
  const towns = [];
  for (const size of SIZES) for (let k = 0; k < per; k += 1) {
    towns.push({ seed: `cv2-${size}-calm-${k}`, settType: size, stressTypes: [], selectedStressesRandom: false });
    towns.push({ seed: `cv2-${size}-crisis-${k}`, settType: size, stressTypes: [CRISIS[size]], selectedStressesRandom: false });
  }
  const tally = { rows: 0, reads: 0 };
  const off = {};
  const fault = (kind, tag, list) => {
    off[kind] = (off[kind] || 0) + list.length;
    if (list.length) { out.examples[kind] = out.examples[kind] || []; if (out.examples[kind].length < 12) out.examples[kind].push(`${tag}: ${list.slice(0, 2).join(' | ')}`); }
  };
  let n = 0;
  for (const town of towns) {
    const { seed, ...cfg } = town;
    const raw = gen({ ...BROWSER, ...cfg }, null, { seed, customContent: {} });
    const record = { ...raw, publicProse: compose(raw) };
    const pub = veil.galleryPayloadFor(record, {});
    n += 1;
    const id = `cccccccc-0000-0000-0000-${String(n).padStart(12, '0')}`;
    for (const { db } of [at210, at211]) {
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_importable)
        values ($1,$2,$3,$4,$5,true,$6,now(),$7,'unlisted',true)`, [id, OWNER, record.name || seed, cfg.settType, JSON.stringify(record), `p${n}`, `l${n}`]);
    }
    await at211.db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign)
      values (gen_random_uuid(),$1,'m',$2,true,$3,'map_with_campaign',true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `m${n}`]);
    // the configurations, as the routine pin draws them from the panel's own model
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
    const faces = (pub.npcs || []).map((x) => `card:npc:${veil.CARD_KINDS.npc.idOf(x)}`);
    const hide = (xs, hidden = true) => xs.map((address) => ({ address, hidden }));
    const every = [...A.groupings, ...A.switches, ...A.houses, ...A.npcFields, ...A.powerFields, ...A.otherFields];
    const defaults = veil.defaultVeilFor(pub).map((d) => d.address);
    const configs = { default: [], groupings: hide(A.groupings), switches: hide(A.switches), houses: hide(A.houses), faces: hide(faces),
      npcFields: hide(A.npcFields), powerFields: hide(A.powerFields), otherFields: hide(A.otherFields), all: hide([...every, ...faces]),
      opened: [...hide(defaults, false), ...hide(A.switches), ...hide([...A.npcFields, ...A.otherFields], false)],
      mixed: every.map((address, i) => ({ address, hidden: i % 3 !== 1 })) };
    const cases = [['unmarked', null, 'live', false]];
    for (const [name, deltas] of Object.entries(configs)) {
      cases.push([name, deltas, 'live', false], [name, deltas, 'snapshot', false]);
      if (['all', 'opened', 'default'].includes(name)) cases.push([name, deltas, 'live', true], [name, deltas, 'snapshot', true]);
    }
    const ref = new Map();
    for (const [name, deltas, mode, dm] of cases) {
      const tag = `${seed} ${name}${dm ? '+dm' : ''}/${mode}`;
      const at = '2026-11-12T00:00:00.000Z';
      const snapshot = mode === 'snapshot' ? veil.galleryPayloadFor(record, { shareDm: dm }) : null;
      const ov = deltas === null ? {} : veil.writeShareVeil({}, deltas, { mode, at, snapshot });
      for (const { db } of [at210, at211]) await db.query('update public.settlements set gallery_member_overrides = $2, gallery_share_dm = $3 where id = $1', [id, JSON.stringify(ov), dm]);
      const read = async (db, client) => {
        H.db = db; H.uid = '';
        const g = await client.fetchPublicDossier(`p${n}`); const gRow = Array.isArray(H.last) ? H.last[0] : null;
        const l = await client.fetchPublicDossier(`l${n}`); const lResp = H.last;
        return { g, gRow, l, lResp };
      };
      const before = await read(at210.db, gallery);
      const now = await read(at211.db, gallery);
      const old = await read(at211.db, oldGallery);
      tally.rows += 1; tally.reads += 6;
      if (!now.g || !now.l || !old.g || !old.l) { fault('noPage', tag, ['a read returned no page']); continue; }
      const g = carried(now.gRow.data, now.g.settlement); const l = carried(now.lResp.dossier, now.l.settlement);
      fault('carried', tag, [...g.paths, ...g.readable, ...l.paths.map((x) => `link ${x}`), ...l.readable.map((x) => `link ${x}`)]);
      fault('overrides', tag, [...overridesOffences(now.gRow.gallery_member_overrides), ...overridesOffences(now.lResp.gallery_member_overrides)]);
      const key = `${name}|${dm}`;
      if (mode === 'live') ref.set(key, before);
      const r = ref.get(key);
      if (r) {
        const ch = [];
        if (JSON.stringify(canon(now.g.settlement)) !== JSON.stringify(canon(r.g.settlement))) ch.push(`gallery ${carried(r.g.settlement, now.g.settlement).paths.slice(0, 2)} +${carried(now.g.settlement, r.g.settlement).paths.slice(0, 2)}`);
        if (JSON.stringify(canon(now.l.settlement)) !== JSON.stringify(canon(r.l.settlement))) ch.push(`link ${carried(r.l.settlement, now.l.settlement).paths.slice(0, 2)} +${carried(now.l.settlement, r.l.settlement).paths.slice(0, 2)}`);
        if (JSON.stringify(veil.veilGroupingsOf(now.g.settlement)) !== JSON.stringify(veil.veilGroupingsOf(r.g.settlement))) ch.push('gallery groupings');
        fault('changed', tag, ch);
        fault('oldShows', tag, [...shows(old.g.settlement, r.g.settlement), ...shows(old.l.settlement, r.l.settlement).map((x) => `link ${x}`)]);
      }
      if (mode !== 'live' && (now.g.galleryMode !== 'snapshot' || now.g.snapshotAt !== at)) fault('mode', tag, [`${now.g.galleryMode} ${now.g.snapshotAt}`]);
      if (!dm && ['all', 'opened', 'mixed', 'default', 'unmarked'].includes(name)) {
        H.db = at211.db; H.uid = READER;
        const imp = await gallery.fetchDossierForImport(`p${n}`);
        const iResp = H.last?.[0]?.data;
        H.uid = '';
        const map = await gallery.fetchGalleryMap(`m${n}`);
        const member = map?.members?.find((x) => x.settlement)?.settlement;
        const im = [];
        if (mode === 'live') {
          im.push(...carried(iResp, now.g.settlement).readable.map((x) => `import resp ${x}`), ...carried(imp.settlement, now.g.settlement).paths.map((x) => `import page ${x}`));
        }
        if (!member) im.push('map: no member');
        else im.push(...carried(member, now.g.settlement).readable.map((x) => `map shows ${x}`), ...carried(now.g.settlement, member).paths.map((x) => `map lacks ${x}`));
        fault('importMap', tag, im);
        tally.reads += 2;
      }
    }
    out.towns.push({ seed, size: cfg.settType, npcs: (record.npcs || []).length, institutions: (record.institutions || []).length, bytes: JSON.stringify(record).length });
  }
  out.totals = { ...tally, offences: off };
  mkdirSync(OUT, { recursive: true });
  writeFileSync(resolve(OUT, 'towns.json'), JSON.stringify(out, null, 1));
  await at210.db.end(); await at211.db.end();
});
