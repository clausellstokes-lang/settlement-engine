// REVIEW-VEIL-13 — TRAD-SHARE attack (1)/(3): THE DEAD'S EVENT AGAINST 212's NAME SWEEP. The leaf (traditionDescription.js ::
// describeTradition, S3 the dead) chooses, for a reader, the most recent graded event among events whose NAME holds no
// house/person/power name of the whole record (heldNamesOf: the FULL names, lower-cased). 212's sweep takes an event whole
// when its name holds a HIDDEN name, folded with its BARE form (no bracketed qualifier). PLANT (born towns whose shared set
// holds a rite of the dead): the first hideable house renamed "<name> (word of mouth)"; a graded great fire, 2 years ago,
// named "The <name> Fire" (the BARE form only). Composed at save by the lane's tree; served by RV10_TPL (212) under the
// default veil (the house hidden whole), Reveal DM off and on. RED: the served rows recall a fire the served history lacks.
// CONTROL: the same event named "The Granary Fire" (no held name): served history keeps it, the rows recall it.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
it('traddead', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query('drop database if exists trdead with (force)'); await admin.query(`create database trdead template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'trdead' }); await db.connect();
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const PP = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { sharedTraditionRowsOf, shownTraditionsOf } = await import(`${SRC}/src/domain/traditions/shownTraditions.js`);
  const CV = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const out = []; let n = 0; let tried = 0; const T = { red: 0, control: 0, n: 0 }; const R = {};
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: false, magicExists: true, contentProfile: 'grounded', priorities: { ...(DEFAULT_CONFIG.priorities || {}), criminal: 85 } };
  for (let k = 0; k < 40 && T.n < 8; k += 1) for (const size of ['town', 'city', 'metropolis']) {
    n += 1; const seed = `rv13-dead-${size}-${k}-${n}`;
    let A; try { A = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size }), null, { seed, customContent: {} })); } catch { continue; }
    const hid = (A.institutions || []).filter((h) => CV.isHideableHouse(h)); if (!hid.length) continue;
    const dead = (shownTraditionsOf(A, []).recs || []).some((r) => r?.coreMotif?.element === 'the-dead' && !(/\.0$/.test(String(r.id)) && r.foundedYear === 1));
    if (!dead) continue; tried += 1; if (T.n >= 8) continue;
    const old = String(hid[0].name); const bare = old.replace(/\s*\([^)]*\)\s*$/, '');
    for (const arm of ['PLANT', 'PLURAL', 'POSSESSIVE', 'THREE', 'CONTROL']) {
      const B = clone(A); const h = (B.institutions || []).find((x) => x.name === old); const hb = arm === 'THREE' ? 'Vex' : bare; h.name = `${hb} (word of mouth)`;
      const evName = { PLANT: `The ${bare} Fire`, PLURAL: `The ${bare}s Fire`, POSSESSIVE: `The ${bare}'s Fire`, THREE: 'The Vex Fire', CONTROL: 'The Granary Fire' }[arm];
      B.history = B.history || {}; B.history.historicalEvents = [...(B.history.historicalEvents || []), { id: `evt_rv13_${n}`, name: evName, templateType: 'great_fire', severity: 'major', yearsAgo: 2, description: 'The fire took a street.' }];
      const rows = sharedTraditionRowsOf(B); const deadRows = (rows || []).filter((r) => /fire/i.test(r.text));
      const saved = PP.withPublicProse(clone(B), composePublicProse(B));
      for (const dm of [false, true]) {
        const id = `abcd9d13-0000-0000-0000-${String(n * 4 + (dm ? 1 : 0) + (arm === 'PLANT' ? 0 : 2)).padStart(12, '0')}`; const sl = `dd${n}${dm ? 'd' : 'p'}${arm[0]}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
          values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,$5,true,false)`, [id, JSON.stringify(saved), sl, JSON.stringify(veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' })), dm]);
        await db.query('set role anon'); const D = (await db.query('select data from public.get_gallery_dossier($1)', [sl])).rows[0]?.data; await db.query('reset role');
        await db.query('delete from public.settlements where id = $1', [id]);
        const servedEv = (D?.history?.historicalEvents || []).some((e) => e?.name === evName || e?.id === `evt_rv13_${n}`);
        const servedRows = (PP.publicProseOf ? PP.publicProseOf(D, 'traditions') : D?.publicProse?.traditions) || [];
        const recalls = servedRows.some((r) => /fire/i.test(String(r?.text || '')) && /2 years ago|two years ago/.test(String(r?.text || '')));
        const houseServed = (D?.institutions || []).some((x) => String(x?.name || '').startsWith(bare));
        out.push(`${seed} ${arm} dm=${dm}: house served=${houseServed}; event "${evName}" served=${servedEv}; served rows recall the fire=${recalls}${recalls ? ' :: ' + JSON.stringify(servedRows.find((r) => /fire/i.test(String(r?.text || '')))?.text).slice(0, 200) : ''}`);
        const r = R[arm] = R[arm] || { reads: 0, recalls: 0, servedEv: 0, recallsWithheld: 0 }; r.reads += 1; if (recalls) r.recalls += 1; if (servedEv) r.servedEv += 1; if (recalls && !servedEv) r.recallsWithheld += 1;
        if (arm === 'PLANT') { T.n += dm ? 1 : 0; if (recalls && !servedEv) T.red += 1; } else if (arm === 'CONTROL' && recalls && servedEv) T.control += 1;
      }
      if (arm === 'PLANT' && !deadRows.length) out.push(`  (the plant's rows do not recall the fire at save: ${JSON.stringify((rows || []).map((r) => r.text)).slice(0, 200)})`);
    }
  }
  out.unshift(...Object.entries(R).map(([a, r]) => `${a}: reads ${r.reads}; rows recall the fire ${r.recalls}; event served ${r.servedEv}; RECALLS A WITHHELD EVENT ${r.recallsWithheld}`));
  out.unshift(`towns with a hideable house and a rite of the dead tried: ${tried}; PLANT reads where the rows recall a fire the served history lacks: ${T.red}; CONTROL reads recalling a served fire: ${T.control}`);
  writeFileSync(process.env.RV10_OUT, out.join('\n') + '\n'); await db.end();
}, 14_400_000);
