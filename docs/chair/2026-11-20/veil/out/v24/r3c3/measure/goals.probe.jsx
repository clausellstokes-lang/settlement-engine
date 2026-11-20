// R3-CURE-3 MEASURE (unit 1): THE TWO REVEAL-DM GOALS, ATTRIBUTED. The towns "server-veil-city-infiltrated-0" and
// "server-veil-metropolis-3" built EXACTLY as tests/security/galleryServerVeil.pglite.test.js builds them (its BROWSER dials,
// its cfg, compose, galleryPayloadFor, configsFor, writeShareVeil), each Reveal-DM case (default/all/opened x live/snapshot),
// read by the SERVER (pglite, every migration of RV6_SRC, get_gallery_dossier and get_unlisted_dossier, raw response) and
// by the TWIN (projectShareVeil over galleryPayloadFor, shareDm). Per read: the two people's goal (short, long, intent),
// served or not; every withheld power (stored, not served on that read: name, id); every served power's name; the tokens
// the first cure (06e9e64b3) matched as a case-folded substring; what the lane's search (buildNameSearch) hits; whether the
// {family,key,kind} target resolves to a withheld power. Out: RV9_OUT (JSON).
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const SRC = process.env.RV6_SRC;
const H = vi.hoisted(() => ({ db: null }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
const ALL_TOWNS = [
  [4, { seed: 'server-veil-city-2', settType: 'city' }],
  [7, { seed: 'server-veil-metropolis-7', settType: 'metropolis' }],
  [5, { seed: 'server-veil-city-infiltrated-0', settType: 'city', crisis: 'infiltrated', selectedStresses: ['infiltrated'], selectedStressesRandom: false }],
  [6, { seed: 'server-veil-metropolis-3', settType: 'metropolis' }],
];
const TOWNS = ALL_TOWNS.filter(([, t]) => (process.env.RV9_TOWNS || 'server-veil-city-infiltrated-0,server-veil-metropolis-3').split(',').includes(t.seed));
const PEOPLE = ['npc_mages_guild', 'npc_smelter'];
const clone = (v) => JSON.parse(JSON.stringify(v));
it('R3-CURE-3 unit 1: the two Reveal-DM goals', async () => {
  const { PGlite } = await import(`${SRC}/node_modules/@electric-sql/pglite/dist/index.js`);
  const { pgcrypto } = await import(`${SRC}/node_modules/@electric-sql/pglite/dist/contrib/pgcrypto.js`);
  const db = new PGlite({ extensions: { pgcrypto } });
  const OWNER = '11111111-1111-1111-1111-111111111111';
  const t = readFileSync(`${SRC}/tests/security/galleryServerVeil.pglite.test.js`, 'utf-8');
  const boot = t.slice(t.indexOf('await db.exec(`') + 'await db.exec(`'.length, t.indexOf('`);', t.indexOf('await db.exec(`')));
  await db.exec(boot);
  const MIG = `${SRC}/supabase/migrations`; const failed = [];
  for (const f of readdirSync(MIG).filter((x) => /^\d{3}_.*\.sql$/.test(x)).sort()) {
    const sql = readFileSync(join(MIG, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
    try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 120)}`); }
  }
  await db.exec(`insert into auth.users (id) values ('${OWNER}') on conflict do nothing; insert into public.profiles (id) values ('${OWNER}') on conflict do nothing;
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$; set test.uid = '';`);
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const sh = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const configsFor = (pub) => {
    const m = veil.curateModelFor(pub, []);
    const A = { groupings: [], switches: [], houses: [], npcFields: [], powerFields: [], otherFields: [] };
    for (const sec of m.sections) {
      for (const g of sec.groupings) A.groupings.push(g.address);
      for (const s of sec.switches) A.switches.push(s.address);
      for (const c of sec.cards) { if (c.whole) A.houses.push(c.whole.address); for (const e of c.eyes) (c.kind === 'npc' ? A.npcFields : c.kind === 'faction' ? A.powerFields : A.otherFields).push(e.address); }
    }
    const faces = (pub.npcs || []).map((n) => `card:npc:${veil.CARD_KINDS.npc.idOf(n)}`);
    const hide = (xs, hidden = true) => xs.map((address) => ({ address, hidden }));
    const every = [...A.groupings, ...A.switches, ...A.houses, ...A.npcFields, ...A.powerFields, ...A.otherFields];
    const defaults = veil.defaultVeilFor(pub).map((d) => d.address);
    return { default: [], all: hide([...every, ...faces]), opened: [...hide(defaults, false), ...hide(A.switches), ...hide([...A.npcFields, ...A.otherFields], false)] };
  };
  const powersOf = (d) => [...(Array.isArray(d?.powerStructure?.factions) ? d.powerStructure.factions : []), ...(Array.isArray(d?.factions) ? d.factions : [])].filter(isRec);
  const out = { failed, towns: [] };
  for (const [n, town] of TOWNS) {
    const { seed, crisis, ...cfg } = town;
    const raw = gen({ ...BROWSER, ...cfg }, null, { seed, customContent: {} });
    const record = { ...raw, publicProse: compose(raw) };
    const pub = veil.galleryPayloadFor(record, {});
    const id = `aaaaaaaa-0000-0000-0000-${String(n + 1).padStart(12, '0')}`; const slug = `pub-${n}`; const link = `lnk-${n}`;
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_importable)
      values ($1, $2, $3, $4, $5, true, $6, now(), $7, 'unlisted', true)`, [id, OWNER, record.name || seed, cfg.settType, JSON.stringify(record), slug, link]);
    const T = { seed, stored: { powers: powersOf(record).map((f) => ({ id: f.id, faction: f.faction, name: f.name, category: f.category, hidden: f.hidden, isGoverning: f.isGoverning, src: (record.powerStructure?.factions || []).includes(f) ? 'powerStructure' : 'top' })),
      houses: (record.institutions || []).map((h) => h?.name), people: {} }, reads: [] };
    for (const pid of PEOPLE) { const p = (record.npcs || []).find((x) => x?.id === pid); T.stored.people[pid] = p ? { name: p.name, role: p.role, factionAffiliation: p.factionAffiliation, goal: p.goal } : null; }
    const configs = configsFor(pub);
    for (const name of ['default', 'all', 'opened']) for (const mode of ['live', 'snapshot']) {
      const at = '2026-11-11T00:00:00.000Z';
      const snapshot = mode === 'snapshot' ? veil.galleryPayloadFor(record, { shareDm: true }) : null;
      const ov = veil.writeShareVeil({}, configs[name], { mode, at, snapshot });
      await db.query('update public.settlements set gallery_member_overrides = $2, gallery_share_dm = true where id = $1', [id, JSON.stringify(ov)]);
      const g = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
      const l = (await db.query('select public.get_unlisted_dossier($1) o', [link])).rows[0]?.o?.dossier;
      const tw = veil.projectShareVeil(veil.galleryPayloadFor(clone(record), { shareDm: true, memberOverrides: ov }), ov);
      for (const [reader, doc] of [['server gallery', g], ['server link', l], ['twin', tw]]) {
        const servedNames = new Set(powersOf(doc).flatMap((f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v)));
        const servedIds = new Set(powersOf(doc).map((f) => f.id).filter((v) => v != null).map(String));
        const gone = powersOf(record).filter((f) => ![f.faction, f.name].some((x) => typeof x === 'string' && servedNames.has(x)));
        const wnBase = [...new Set(gone.flatMap((f) => [f.faction, f.name, f.id].filter((v) => typeof v === 'string' && v !== '')))];
        const search = sh.buildNameSearch(gone.flatMap((f) => [f.faction, f.name]).filter((v) => typeof v === 'string' && v), [...servedNames]);
        const hiddenWhole = (record.institutions || []).filter((h) => isRec(h)).map((h) => h.name).filter((nm) => !(doc?.institutions || []).some((x) => x?.name === nm));
        const people = {};
        for (const pid of PEOPLE) {
          const sp = T.stored.people[pid]; if (!sp?.goal) { people[pid] = 'no stored goal'; continue; }
          const p = (doc?.npcs || []).find((x) => x?.id === pid);
          const said = [String(sp.goal.short ?? ''), String(sp.goal.long ?? '')];
          const base = wnBase.filter((w) => said.some((s) => s.toLowerCase().includes(w.toLowerCase())));
          const tgt = ['short', 'long'].map((k) => sp.goal.intent?.[k]?.target).filter(isRec);
          people[pid] = { present: !!p, goalServed: !!p?.goal, goalByteEqual: !!p?.goal && JSON.stringify(p.goal) === JSON.stringify(sp.goal),
            baseSubstringTokens: base, laneSearchHits: search ? said.map((s) => search.hit(s)) : null,
            targets: tgt, targetKeyMatches: tgt.map((x) => ({ key: x.key, withheldIds: gone.filter((f) => String(f.id) === String(x.key) || String(f.faction).toLowerCase() === String(x.key).toLowerCase()).map((f) => f.faction), servedIds: servedIds.has(String(x.key)) })) };
        }
        const aimedServed = (doc?.npcs || []).filter((p) => isRec(p?.goal)).flatMap((p) => ['short', 'long'].map((k) => [p, k, p.goal.intent?.[k]?.target]))
          .filter(([, , t]) => isRec(t) && t.kind !== 'npc' && typeof t.id === 'string' && gone.some((f) => f.faction === t.id || f.name === t.id || String(f.id) === t.id))
          .map(([p, k, t]) => ({ id: p.id, k, target: t, short: p.goal.short, long: p.goal.long }));
        T.reads.push({ aimedServed, read: `${name}+dm/${mode}`, reader, withheld: gone.map((f) => ({ faction: f.faction, name: f.name, id: f.id })), served: [...servedNames], hiddenWhole, people });
      }
    }
    out.towns.push(T);
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
}, 3600000);
