// VEIL-14 item 0 (iii): does any public read CARRY or CHANGE a role of a person whose eye is shut? (a tie's npc1Role/npc2Role)
// The 240 born towns of PART 12 section 5 (seed 'v11-ties', six sizes, calm and infiltrated, twenty each), both stored
// shapes (r5-born.probe.jsx's), shares: {none, default veil, faces shut, npc fields shut, every eye shut} x Reveal DM {off,on},
// reads gallery, link, import (server) and the client's twin (galleryPayloadFor then projectShareVeil). LOCAL cluster only.
// Per tie end of each read, against the stored tie and the read's own card of that person:
//   CARRY: the read's tie holds a role copy and the read's card of that person holds no role (or no card is sent)
//   CHANGE: the read's tie holds a role copy that differs from the stored tie's copy
//   DROPVIS: the stored copy is gone but the read's card shows the person's role (withheld beyond the card: law 2)
//   DROPHID: the stored copy is gone and the card holds no role (withheld with the card)
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('item 0 (iii): tie role copies on born towns', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.V14_DB }); await db.connect();
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { factionIdFromName } = await import(`${SRC}/src/lib/entities.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.V14_N || 20); const PFX = 'v11-ties';
  const oldPerson = (p) => {
    const { memberships, allegiance, institution, ...rest } = p;
    const ms = (Array.isArray(memberships) ? memberships : []).filter((m) => isRec(m) && typeof m.power === 'string');
    const out = { ...rest };
    if (ms[0]) out.factionAffiliation = ms[0].power;
    if (ms[1]) out.secondaryAffiliation = ms[1].power;
    if (ms.length) out.linkedFactionIds = ms.map((m) => factionIdFromName(m.power));
    if (isRec(institution) && institution.kind === 'house' && typeof institution.key === 'string') out.institution = institution.key;
    if (isRec(allegiance)) { out.corrupt = true; out.corruptionVector = allegiance.vector ?? null; }
    return out;
  };
  const oldTie = ({ from, to, id: _id, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to });
  const shapes = (born) => ({
    new: { ...born, publicProse: compose(born) },
    old: (() => { const s = structuredClone(born); s.npcs = (s.npcs || []).map((p) => (isRec(p) ? oldPerson(p) : p));
      s.relationships = (s.relationships || []).map((t) => (isRec(t) && 'from' in t ? oldTie(t) : t)); s.schemaVersion = 1; return s; })(),
  });
  const configsFor = (pub) => {
    const m = veil.curateModelFor(pub, []);
    const A = { all: [], npcFields: [] };
    for (const sec of m.sections) {
      for (const g of sec.groupings) A.all.push(g.address);
      for (const s of sec.switches) A.all.push(s.address);
      for (const c of sec.cards) { if (c.whole) A.all.push(c.whole.address); for (const e of c.eyes) { A.all.push(e.address); if (c.kind === 'npc') A.npcFields.push(e.address); } }
    }
    const faces = (pub.npcs || []).map((n) => `card:npc:${veil.CARD_KINDS.npc.idOf(n)}`);
    const hide = (xs) => xs.map((address) => ({ address, hidden: true }));
    return { default: [], faces: hide(faces), npcFields: hide(A.npcFields), all: hide([...A.all, ...faces]) };
  };
  const read = async (uid, role, q, args) => {
    await db.query("select set_config('test.uid', $1, false)", [uid]); await db.query(`set role ${role}`);
    try { return (await db.query(q, args)).rows[0]?.d ?? null; } catch (e) { return { ERROR: String(e.message).slice(0, 120) }; } finally { await db.query('reset role'); await db.query("select set_config('test.uid', '', false)"); }
  };
  const tally = {}; const ex = {}; let n = 0; let towns = 0; let reads = 0; let errors = 0;
  const bump = (k, e) => { tally[k] = (tally[k] || 0) + 1; if (!ex[k]) ex[k] = []; if (ex[k].length < 5) ex[k].push(e); };
  const tieKey = (t) => (typeof t.id === 'string' ? t.id : `${t.npc1Id ?? t.from}|${t.npc2Id ?? t.to}|${t.type ?? t.typeName}`);
  const keyed = (arr) => { const seen = new Map(); return arr.map((t) => { if (!isRec(t)) return null; const k = tieKey(t); const o = (seen.get(k) || 0) + 1; seen.set(k, o); return `${k}#${o}`; }); };
  await db.query("delete from public.settlements where public_slug like 'v14r' || $1 || '%'", [process.env.V14_TAG]); void ("");
  for (const settType of (process.env.V14_TYPES || 'thorp,hamlet,village,town,city,metropolis').split(',')) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed: `${PFX}-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    towns += 1;
    const town = `${settType}/${stress || 'calm'}/${i}`;
    for (const [shape, record] of Object.entries(shapes(born)).filter(([k]) => (process.env.V14_SHAPES || 'new,old').split(',').includes(k))) {
      const text = JSON.stringify(record);
      const storedTies = (Array.isArray(record.relationships) ? record.relationships : []);
      const sk = keyed(storedTies); const storedById = new Map(storedTies.map((t, i2) => [sk[i2], t]));
      const cfgs = configsFor(veil.galleryPayloadFor(record, {}));
      for (const [share, deltas, mode] of [['none', null, 'live'], ...Object.entries(cfgs).map(([k, d]) => [k, d, 'live']), ['all', cfgs.all, 'snapshot'], ['all', cfgs.all, 'old-copy']]) for (const dm of [false, true]) {
        n += 1;
        const ov = deltas === null ? {} : veil.writeShareVeil({}, deltas, { mode: mode === 'live' ? 'live' : 'snapshot', at: '2026-11-01T00:00:00.000Z', snapshot: mode === 'snapshot' ? veil.galleryPayloadFor(record, { shareDm: dm }) : mode === 'old-copy' ? record : null });
        const slug = `v14r${process.env.V14_TAG}${n}`;
        await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
          values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, $2, $3, true, $4, now(), $5, 'unlisted', $6, $7, true)`,
        [String(record.name || 'T'), String(record.tier || 'town'), text, slug, `${slug}l`, JSON.stringify(ov), dm]);
        const R = {
          gallery: await read('', 'anon', 'select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d', [slug]),
          link: await read('', 'anon', "select public.get_unlisted_dossier($1) -> 'dossier' as d", [`${slug}l`]),
          import: await read('22222222-2222-2222-2222-222222222222', 'authenticated', 'select (select to_jsonb(g.data) from public.import_gallery_dossier($1) g) as d', [slug]),
          twin: mode === 'live' ? veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(text), { shareDm: dm, memberOverrides: ov }), ov) : null,
        };
        await db.query('delete from public.settlements where public_slug = $1', [slug]);
        for (const [rd, doc] of Object.entries(R)) {
          if (!isRec(doc)) continue; if (doc.ERROR) { errors += 1; continue; } reads += 1;
          const cards = new Map((Array.isArray(doc.npcs) ? doc.npcs : []).filter((c) => isRec(c) && typeof c.id === 'string').map((c) => [c.id, c]));
          const ties = Array.isArray(doc.relationships) ? doc.relationships : [];
          const rk = keyed(ties);
          ties.forEach((t, i2) => {
            if (!isRec(t)) return;
            for (const [k, endKey, alt] of [['npc1Role', 'from', 'npc1Id'], ['npc2Role', 'to', 'npc2Id']]) {
              const c0 = cards.get(String(t[endKey] ?? t[alt])); if (typeof t[k] === 'string' && !(isRec(c0) && typeof c0.role === 'string')) bump(`CARRY0|${shape}|${share}/${mode}|dm=${dm}|${rd}`, `${town} ${rk[i2]}.${k} "${t[k]}"`);
            }
            const st = storedById.get(rk[i2]); if (!isRec(st)) { bump(`UNMATCHED-TIE|${rd}`, `${town}/${shape}/${share}/${dm} ${rk[i2]}`); return; }
            for (const [k, endKey, alt] of [['npc1Role', 'from', 'npc1Id'], ['npc2Role', 'to', 'npc2Id']]) {
              const end = String(t[endKey] ?? t[alt] ?? st[endKey] ?? st[alt]);
              const c = cards.get(end); const cardRole = isRec(c) && typeof c.role === 'string';
              const has = typeof t[k] === 'string'; const stHas = typeof st[k] === 'string';
              const tag = `${shape}|${share}/${mode}|dm=${dm}|${rd}`;
              const e = `${town} ${rk[i2]}.${k}: stored "${String(st[k]).slice(0, 40)}" read "${String(t[k]).slice(0, 40)}" card ${c ? (cardRole ? `role "${c.role}"` : 'no role') : 'absent'}`;
              if (has && !cardRole) bump(`CARRY|${tag}`, e);
              if (has && stHas && t[k] !== st[k]) bump(`CHANGE|${tag}`, e);
              if (!has && stHas && cardRole) bump(`DROPVIS|${tag}`, e);
              if (!has && stHas && !cardRole) bump(`DROPHID|${tag}`, e);
              if (has) bump(`KEPT|${tag}`, '');
            }
          });
        }
        // server against twin on the tie role copies, gallery read
        const sig = (doc) => JSON.stringify((Array.isArray(doc?.relationships) ? doc.relationships : []).map((t) => (isRec(t) ? [t.npc1Role ?? null, t.npc2Role ?? null] : null)));
        if (R.twin && isRec(R.gallery) && !R.gallery.ERROR && sig(R.gallery) !== sig(R.twin)) bump(`TWIN-DIFFERS|${shape}|${share}/${mode}|dm=${dm}`, `${town}`);
      }
    }
  }
  await db.end();
  writeFileSync(process.env.V14_OUT, JSON.stringify({ towns, reads, errors, tally, ex }, null, 1));
  console.log(`v14roles: ${towns} towns, ${reads} reads, ${errors} errors`);
}, 14_400_000);
