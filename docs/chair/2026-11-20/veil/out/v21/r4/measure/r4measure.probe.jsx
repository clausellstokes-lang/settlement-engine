// R4 MEASURE FIRST (VEIL-22's builder): the reference census (every string in a served payload equal to, or holding, a
// person id, by normalised path), the id forms served, the holders of hidden houses served (cards, ties, copies), both
// stored shapes, Reveal off and on, marked (default veil) and unmarked; through the server (scratch PG16, RV9_TPL).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const BIRTHS = (process.env.R4_BIRTHS || 'town:none,city:infiltrated,metropolis:none,town:indebted,city:under_siege,metropolis:wartime,village:none,city:politically_fractured').split(',').map((x) => x.split(':'));
it('R4 measure', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { factionIdFromName } = await import(`${SRC}/src/lib/entities.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = process.env.RV9_DB; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
  const setUid = (u) => db.query(`select set_config('test.uid', $1, false)`, [u]);
  const oldPerson = (p) => {
    const { memberships, allegiance, institution, ...rest } = p; const ms = (Array.isArray(memberships) ? memberships : []).filter((m) => isRec(m) && typeof m.power === 'string');
    const out = { ...rest }; if (ms[0]) out.factionAffiliation = ms[0].power; if (ms[1]) out.secondaryAffiliation = ms[1].power; if (ms.length) out.linkedFactionIds = ms.map((m) => factionIdFromName(m.power));
    if (isRec(institution) && institution.kind === 'house' && typeof institution.key === 'string') out.institution = institution.key; if (isRec(allegiance)) { out.corrupt = true; out.corruptionVector = allegiance.vector ?? null; } return out;
  };
  const oldTie = ({ from, to, id: _id, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to });
  const census = {}; const forms = {}; const holders = {}; const keyHits = {}; const examples = {};
  const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
  let n = 0; const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  for (const [size, crisis] of BIRTHS) {
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    const born = JSON.parse(JSON.stringify(generateSettlementPipeline(cfg, null, { seed: `r4-measure-${size}-${crisis}`, customContent: {} })));
    const shapes = { new: JSON.parse(JSON.stringify(withPublicProse(born, composePublicProse(born)))), old: (() => { const s = structuredClone(born); s.npcs = (s.npcs || []).map((p) => (isRec(p) ? oldPerson(p) : p)); s.relationships = (s.relationships || []).map((t) => (isRec(t) && 'from' in t ? oldTie(t) : t)); s.schemaVersion = 1; return s; })() };
    for (const [shape, stored] of Object.entries(shapes)) {
      const ids = new Set((stored.npcs || []).filter(isRec).map((p) => p.id).filter((x) => typeof x === 'string'));
      const longIds = [...ids].filter((x) => x.length >= 8);
      const hiddenHouses = (stored.institutions || []).filter((h) => isRec(h) && isHideableHouse(h));
      const hName = new Set(hiddenHouses.map((h) => h.name).filter(Boolean));
      const houseOf = (p) => (isRec(p.institution) ? p.institution.key || p.institution.name : p.institution);
      const H = (stored.npcs || []).filter((p) => isRec(p) && (String(p.id).startsWith('npc_veiled_') || p.category === 'criminal' || hName.has(houseOf(p))));
      const Hid = new Set(H.map((p) => p.id)); const Hname = new Set(H.map((p) => p.name).filter(Boolean));
      bump(holders, `${shape} stored holders (veiled-id/criminal/house)`, H.length);
      bump(holders, `${shape} stored holders by: veiled id`, H.filter((p) => String(p.id).startsWith('npc_veiled_')).length);
      bump(holders, `${shape} stored holders by: category criminal`, H.filter((p) => p.category === 'criminal').length);
      bump(holders, `${shape} stored holders by: house identity`, H.filter((p) => hName.has(houseOf(p))).length);
      for (const [mark, ovf] of [['marked', () => veil.writeShareVeil({}, [])], ['unmarked', () => ({})]]) for (const dm of [false, true]) {
        n += 1; const id = `abcd4e00-0000-0000-0000-${String(n).padStart(12, '0')}`; const slug = `r4m${n}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values ($1,'11111111-1111-1111-1111-111111111111',$2,$3,$4::jsonb,true,$5,now(),$6,'unlisted',$7::jsonb,$8,true)`, [id, String(stored.name || 'T'), size, JSON.stringify(stored), slug, `${slug}-l`, JSON.stringify(ovf()), dm]);
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'm', $1, true, $2, $3, 'unlisted', 'map_with_campaign', true, true)`, [JSON.stringify({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
        await setUid('');
        const docs = { gallery: (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d,
          map: (await db.query(`select public.get_gallery_map($1) #> '{members,0,settlement}' d`, [`${slug}-map`])).rows[0]?.d };
        if (!dm) docs.link = (await db.query(`select public.get_unlisted_dossier($1) -> 'dossier' d`, [`${slug}-l`])).rows[0]?.d;
        await setUid('22222222-2222-2222-2222-222222222222');
        docs.import = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
        await setUid('');
        for (const [read, raw] of Object.entries(docs)) {
          const doc = read === 'link' && isRec(raw) && isRec(raw.data) ? raw.data : raw;
          const cell = `${shape}|${mark}|${dm ? 'DM' : 'off'}|${read}`;
          if (!isRec(doc)) { bump(census, `${cell} :: <no doc>`); continue; }
          const walk = (v, p) => {
            if (typeof v === 'string') {
              if (ids.has(v)) { bump(census, `${shape}|${dm ? 'DM' : 'off'} == ${p}`); if (!examples[p]) examples[p] = v; }
              else if (v.includes('npc_')) { for (const x of longIds) if (v.includes(x)) { bump(census, `${shape}|${dm ? 'DM' : 'off'} ⊃ ${p}`); if (!examples[`⊃ ${p}`]) examples[`⊃ ${p}`] = v.slice(0, 160); break; } }
              return;
            }
            if (Array.isArray(v)) { v.forEach((x) => walk(x, `${p}[]`)); return; }
            if (isRec(v)) for (const k of Object.keys(v)) { if (ids.has(k)) bump(keyHits, `${shape} key ${p}`); walk(v[k], p ? `${p}.${k}` : k); }
          };
          walk(doc, '');
          const sn = (doc.npcs || []).filter(isRec);
          for (const p of sn) { const f = String(p.id).startsWith('npc_veiled_') ? 'npc_veiled_' : String(p.id).startsWith('npc_power_') ? 'npc_power_' : String(p.id).startsWith('npc_temp_') ? 'npc_temp_' : String(p.id).startsWith('npc_') ? 'npc_<slug>' : 'other'; bump(forms, `${cell} ${f}`); }
          if (mark === 'marked') {
            const hc = sn.filter((p) => Hid.has(p.id));
            bump(holders, `${cell} holder cards served`, hc.length);
            bump(holders, `${cell} holder cards served with category criminal`, hc.filter((p) => p.category === 'criminal').length);
            bump(holders, `${cell} holder cards served with role`, hc.filter((p) => p.role).length);
            bump(holders, `${cell} ties served touching a holder`, (doc.relationships || []).filter((t) => isRec(t) && [t.from, t.to, t.npc1Id, t.npc2Id].some((x) => Hid.has(x))).length);
            bump(holders, `${cell} roster copies served (factions[].members[]) of a holder`, (doc.factions || []).flatMap((f) => (isRec(f) && Array.isArray(f.members) ? f.members : [])).filter((m) => isRec(m) && (Hid.has(m.id) || Hname.has(m.name))).length);
            bump(holders, `${cell} roster copies served (powerStructure.factions[].members[]) of a holder`, ((doc.powerStructure || {}).factions || []).flatMap((f) => (isRec(f) && Array.isArray(f.members) ? f.members : [])).filter((m) => isRec(m) && (Hid.has(m.id) || Hname.has(m.name))).length);
            const pr = doc.prominentRelationship; if (isRec(pr) && (Hname.has(pr.npc1) || Hname.has(pr.npc2))) bump(holders, `${cell} prominentRelationship naming a holder`);
            if (typeof doc.pressureSentence === 'string' && [...Hname].some((x) => doc.pressureSentence.includes(x))) bump(holders, `${cell} pressureSentence naming a holder`);
            for (const k of ['stress', 'stressors']) for (const c of (Array.isArray(doc[k]) ? doc[k] : [doc[k]])) if (isRec(c) && isRec(c.cast)) {
              bump(holders, `${cell} cast roles naming a holder`, (c.cast.roles || []).filter((r) => isRec(r) && (Hid.has(r.id) || Hname.has(r.name))).length);
              bump(holders, `${cell} cast roles kind npc served`, (c.cast.roles || []).filter((r) => isRec(r) && r.kind === 'npc').length);
              bump(holders, `${cell} cast levers holder a holder`, (c.cast.levers || []).filter((r) => isRec(r) && (Hid.has(r.holderId) || Hname.has(r.holderName))).length);
            }
            // a holder's name anywhere else as a whole string value
            const nameHits = {}; const w2 = (v, p) => { if (typeof v === 'string') { if (Hname.has(v)) bump(nameHits, p); return; } if (Array.isArray(v)) v.forEach((x) => w2(x, `${p}[]`)); else if (isRec(v)) for (const k of Object.keys(v)) w2(v[k], p ? `${p}.${k}` : k); };
            w2(doc, ''); for (const [p, c] of Object.entries(nameHits)) bump(holders, `${shape}|${dm ? 'DM' : 'off'} holder NAME == ${p}`, c);
          }
        }
      }
    }
  }
  await db.end();
  const sortObj = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(process.env.RV9_OUT, JSON.stringify({ births: BIRTHS, census: sortObj(census), keyHits: sortObj(keyHits), forms: sortObj(forms), holders: sortObj(holders), examples: sortObj(examples) }, null, 1));
}, 14_400_000);
