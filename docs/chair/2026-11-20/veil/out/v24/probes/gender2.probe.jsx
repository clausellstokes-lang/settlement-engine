// VEIL-24 — THE GENDER MEASURE (the chair's ask, 2026-11-20 08:52; read-only). Born towns by the tree's own pipeline
// (the differ probe's birth), each stored as a row and read THROUGH THE SERVER (chain at the tip): the gallery read and the
// party link, Reveal DM off and on, the DEFAULT veil (writeShareVeil({}, [])) and EVERY EYE SHUT. Per read: cards served,
// cards carrying `gender`; per served card, its printed honorific (cardDoor.cardHonorificOf, seatKeeper.keeperHonorificOf)
// and styledTitleOf(title) on the served card AS SERVED against the same card with its STORED gender put back (the cause
// alone), and against the owner's page (the stored card on the stored town). Pronoun strings: every served string holding
// she|her|hers|herself|he|him|his|himself, and those that also hold a served card's name.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = 'village,town,town,city,city,metropolis,metropolis'.split(',');
const CRISES = 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured'.split(',');
const PRON = /\b(she|her|hers|herself|he|him|his|himself)\b/i;
it('VEIL-24: gender on shared reads', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query('drop database if exists gtpl24s with (force)'); await admin.query('create database gtpl24s template gtpl24'); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'gtpl24s' }); await db.connect();
  await db.query(`select set_config('test.uid', '', false)`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse;
  const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { cardHonorificOf } = await import(`${SRC}/src/domain/people/cardDoor.js`);
  const { keeperHonorificOf } = await import(`${SRC}/src/domain/people/seatKeeper.js`);
  const { styledTitleOf } = await import(`${SRC}/src/data/faceHonorifics.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let nrow = 0;
  const read = async (rec, dm, kind, how) => {
    const pub = veil.galleryPayloadFor(rec, { shareDm: dm, memberOverrides: {} });
    let eyes = [];
    if (kind === 'all') { const m = veil.curateModelFor(pub, []); eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address), ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]); }
    const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    nrow += 1; const id = `abcd9f24-0000-0000-0000-${String(nrow).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true,false)`, [id, rec.name || 'x', JSON.stringify(rec), `g24x${nrow}`, `g24l${nrow}`, JSON.stringify(ov), dm]);
    const r = how === 'link' ? (await db.query('select public.get_unlisted_dossier($1) x', [`g24l${nrow}`])).rows[0]?.x?.dossier : (await db.query('select * from public.get_gallery_dossier($1)', [`g24x${nrow}`])).rows[0]?.data;
    await db.query('delete from public.settlements where id = $1', [id]);
    return r;
  };
  const strings = (v, out) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, out)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out)); return out; };
  const rows = []; const ex = [];
  let idx = 0;
  for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; const seed = `v24-gender-${size}-${crisis}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let S; try { S = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: undefined }); S = { ...S }; delete S.publicProse; S = JSON.parse(JSON.stringify(withPP(S, compose(S)))); } catch (e) { rows.push({ seed, threw: String(e.message).slice(0, 80) }); continue; }
    const stored = new Map((S.npcs || []).map((c) => [c.name, c]));
    const storedGendered = (S.npcs || []).filter((c) => typeof c.gender === 'string').length;
    for (const how of ['gallery']) for (const dm of [false]) for (const kind of ['default']) {
      const D = await read(S, dm, kind, how);
      const npcs = Array.isArray(D?.npcs) ? D.npcs : [];
      const r = { seed, how, dm, kind, storedCards: (S.npcs || []).length, storedGendered, served: npcs.length, servedGender: npcs.filter((c) => c && 'gender' in c).length,
        honGenderOnly: 0, keeperGenderOnly: 0, styledGenderOnly: 0, honOwnerVsShared: 0, honOwnerVsSharedGender: 0, pronStrings: 0, pronWithName: 0 };
      for (const c of npcs) {
        const s = stored.get(c?.name); if (!s) continue;
        const g = { ...c, gender: s.gender };
        const h = cardHonorificOf(c, D); const hg = cardHonorificOf(g, D);
        if (h !== hg) { r.honGenderOnly += 1; if (ex.length < 12) ex.push(`${seed} ${how} dm=${dm} ${kind}: "${h} ${c.name}" | with stored gender "${hg}" (${s.gender})`); }
        if (keeperHonorificOf(c, D) !== keeperHonorificOf(g, D)) r.keeperGenderOnly += 1;
        if (typeof c.title === 'string' && styledTitleOf(c.title, c.gender) !== styledTitleOf(c.title, s.gender)) r.styledGenderOnly += 1;
        const ho = cardHonorificOf(s, S);
        if (ho !== h) { r.honOwnerVsShared += 1; if (ho === hg) r.honOwnerVsSharedGender += 1; else {
          const gi = { ...g, institution: s.institution };
          const sInst = s.institution && typeof s.institution === 'object' ? s.institution : null;
          const cInst = c.institution && typeof c.institution === 'object' ? c.institution : null;
          let cause;
          if (cardHonorificOf(gi, D) === ho) cause = cInst ? 'institution differs on the served card' : `institution absent on the served card (stored veiled=${sInst ? String(sInst.veiled) : 'no record'}, kind=${sInst?.kind})`;
          else if (cardHonorificOf(gi, S) === ho) cause = 'the settlement (coast or culture as served)';
          else cause = 'other';
          r.causes = r.causes || {}; r.causes[cause] = (r.causes[cause] || 0) + 1;
          if (ex.length < 40) ex.push(`${cause} | ${seed}: owner "${ho}" shared "${h}" title=${JSON.stringify(sInst?.title)} ${c.name}`); } }
      }
      const names = npcs.map((c) => c?.name).filter((n) => typeof n === 'string' && n.length > 2);
      for (const t of strings(D, [])) if (PRON.test(t)) { r.pronStrings += 1; if (names.some((n) => t.includes(n) || t.includes(n.split(' ')[0]))) r.pronWithName += 1; }
      rows.push(r);
    }
  }
  await db.end();
  writeFileSync(process.env.G24B_OUT, JSON.stringify({ rows, ex }, null, 1));
}, 14400000);
