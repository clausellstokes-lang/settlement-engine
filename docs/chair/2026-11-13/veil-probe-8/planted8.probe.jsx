// COHERENCE-VEIL-8 — THE LANE'S PLANTED-MARKER RUN WITH A WIDER EYE (BRIEF-VEIL-8, step 1).
//
// The review's planted.probe.jsx (REVIEW-VEIL-5, `lane/review-veil-3-2026-11-12` at 4700d33eb) with three changes,
// so that what a server sends in ANOTHER SPELLING is seen (REVIEW-VEIL-6's twelfth: the names of houses hidden whole,
// lower-cased in `economicState.compound.inst.names[]`, and as `institution.<snake>` in the trace's `targetId`):
//
//  1. THE MARKER is ` Vh8K<n>Q`: letters and digits only, so a case fold, a slug (any run of other characters made
//     one separator) or a join keeps it. Every string of every response is searched in its FOLDED form (lower case,
//     every run of characters that are not a letter or a digit made one `_`), and each hit is classed: `exact` (the
//     marker in its own spelling: what the review's eye saw) or `folded` (seen only by the wider eye).
//  2. THE NAME of every house the share hid whole, and every processing name a chain gives such a house by the
//     ENGINE's own matcher (computeActiveChains.js :: institutionMatchesProcessor) that no open house answers to,
//     is searched in four forms: `exact` (the card's own spelling), `folded` (the folded name inside the folded
//     string, on `_` boundaries: a case fold, a slug, a snake or kebab key, an id such as `institution.<snake>`),
//     and `joined` (the name with every separator removed, inside the string with every separator removed, for a
//     name of ten characters or more). An open house whose folded name CONTAINS the hidden one is blanked first
//     ("Black market" hidden, "Black market bazaar" open: the open name is not the hidden one).
//  3. THE TEXT hidden by hand (each planted string as it stands at the end of the birth, and each sentence of it of
//     twelve characters and three words or more, marker removed) is searched in its folded form; a hit is listed
//     only where the string does NOT hold it in its own spelling (`folded only`): the exact-spelling class is the
//     review's sentence search (secondhome2.mjs), classed by the sixth seat line by line.
//
// THE READS: the gallery read, the party link, the map page (`get_gallery_map`), the map's party link
// (`get_unlisted_map`), the town's import and the map's import (as a signed-in reader): six. The shares: every eye
// shut by hand, the DM reveal off and on, live and frozen (4 a town), on every chain named. Its limits: a marker
// cannot ride a boolean or a number; a field derived in the step that wrote its source is planted too late (the
// guard's third arm holds that class by hand). A FLAG or a COUNT a hidden house makes is not a string: step 3's
// measure, not this.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';

const SRC = process.env.RV5_SRC; const SIDE = process.env.RV5_SIDE || 'master'; const OUT = process.env.RV5_OUT;
const ORACLE = process.env.RV8_ORACLE_SRC || SRC;
const CHAINS = (process.env.RV5_CHAINS || '').split(',').filter(Boolean).map((x) => { const [db, tpl] = x.split(':'); return { db, tpl }; });
const SEEDS = Number(process.env.RV5_SEEDS || 1); const SHARD = (process.env.RV5_SHARD || '0/1').split('/').map(Number);
const SIZES = (process.env.RV5_SIZES || 'thorp,hamlet,village,town,city,metropolis').split(',');
const PREFIX = process.env.RV8_PREFIX || 'rv5-plant';
vi.mock(`${process.env.RV5_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const MARK = (n) => `Vh8K${n}Q`;
const MARK_FOLD_RE = /vh8k(\d+)q/g;
const marked = (v) => /vh8k\d+q/i.test(JSON.stringify(v ?? null));
const fold = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_');
const foldTrim = (s) => fold(s).replace(/^_+|_+$/g, '');
const join = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');
const stripMarks = (s) => String(s).replace(/\s*Vh8K\d+Q/g, '');
const sentencesOf = (s) => [s, ...String(s).split(/[.!?—]+/)].map((x) => x.trim()).filter((x) => x.length >= 12 && x.split(/\s+/).length >= 3);

it(`second homes by planted marker, the wider eye (${SIDE})`, async () => {
  const pg = (await import(`${SRC}/node_modules/pg/lib/index.js`)).default;
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
  const { institutionMatchesProcessor } = await import(`${ORACLE}/src/generators/computeActiveChains.js`);
  const compose = SIDE === 'tip' ? (await import(`${M}/components/new/publicProseCompose.js`)).composePublicProse : null;
  await loadGenerationLawPayloads();
  const KINDS = veil.CARD_KINDS;
  const GROUPING_DATA = { 'block:services.criminal': [['availableServices', 'criminal']],
    'block:defense.criminalStructure': [['economicState', 'safetyProfile', 'criminalInstitutions'], ['economicState', 'safetyProfile', 'crimeTypes']],
    'block:power.criminalUnderside': [['powerStructure', 'criminalCaptureState'], ['economicState', 'safetyProfile', 'blackMarketCapture']],
    'block:housekeeping.structuralIssues': [['structuralViolations'], ['structuralSuggestions']], 'block:housekeeping.coherenceNotes': [['coherenceNotes']],
    'block:housekeeping.receipt': [['generationCoherenceReceipt']], 'block:housekeeping.decrees': [['decrees'], ['dmLayer']] };

  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbs = {};
  for (const c of CHAINS) { const name = `${c.db}_${SHARD[0]}`; await admin.query(`drop database if exists ${name} with (force)`); await admin.query(`create database ${name} template ${c.tpl}`);
    dbs[c.db] = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: name }); await dbs[c.db].connect(); }
  await admin.end();

  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = { side: SIDE, towns: 0, birthsThatThrew: [], planted: 0, plantedByOrigin: {}, shares: 0, reads: 0, readsBy: {}, handHides: 0,
    hiddenTexts: 0, sent: {}, sentTowns: {}, examples: {}, housesHiddenWhole: 0, aliasesHidden: 0, raised: [], timing: {} };
  const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
  const hit = (kk, read, seed, ex) => { out.sent[kk] = out.sent[kk] || {}; bump(out.sent[kk], read); (out.sentTowns[kk] = out.sentTowns[kk] || {})[seed] = 1; out.examples[kk] = out.examples[kk] || ex; };
  let n = 0; let idx = 0;
  for (let k = 0; k < SEEDS; k += 1) for (const size of SIZES) for (const stress of [null, 'infiltrated']) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `${PREFIX}-${size}-${stress}-${k}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let seq = 0; const origin = new Map(); const sources = [];
    const tok = (kind, key) => { seq += 1; origin.set(String(seq), `${kind}.${key}`); bump(out.plantedByOrigin, `${kind}.${key}`); out.planted += 1; return MARK(seq); };
    const plant = (holder, key, kind) => {
      const v = holder[key];
      if (v == null || typeof v === 'boolean' || typeof v === 'number' || marked(v)) return;
      if (typeof v === 'string') { if (v.trim()) { holder[key] = `${v} ${tok(kind, key)}`; sources.push([holder, key, `${kind}.${key}`]); } }
      else if (Array.isArray(v)) { if (v.length) { v.push(tok(kind, key)); sources.push([holder, key, `${kind}.${key}`]); } }
      else if (isRec(v)) { v.rv8 = tok(kind, key); sources.push([holder, key, `${kind}.${key}`]); }
    };
    const at = (root, path) => path.reduce((c, seg) => (isRec(c) ? c[seg] : undefined), root);
    const plantAll = (root) => {
      if (!isRec(root)) return;
      for (const [kind, def] of Object.entries(KINDS)) for (const path of def.lists) {
        const star = path.indexOf('*');
        const owners = star < 0 ? [root] : (Array.isArray(at(root, path.slice(0, star))) ? at(root, path.slice(0, star)).filter(isRec) : []);
        for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (!Array.isArray(arr)) continue;
          for (const c of arr.filter(isRec)) for (const [eye, keys] of Object.entries(def.fields)) { if (kind === 'faction' && eye === 'members') continue;
            for (const key of [...keys, ...(kind === 'npc' && eye === 'goals' ? ['factionGoal'] : []), ...(kind === 'npc' && eye === 'ties' ? ['linkedFactionIds'] : [])]) {
              if (kind === 'npc' && (key === 'institution' || key === 'linkedInstitutionIds' || key === 'linkedFactionIds')) continue; // join keys: searched as names
              if (kind === 'institution' && (key === 'tags' || key === 'serviceKeys' || key === 'facets')) continue;                     // read by the engine's own predicates
              if (kind === 'npc' && key === 'relationships') continue;
              plant(c, key, kind);
            } } }
      }
      for (const paths of Object.values(GROUPING_DATA)) for (const p of paths) { const holder = at(root, p.slice(0, -1)); const key = p[p.length - 1];
        if (isRec(holder) && Array.isArray(holder[key])) holder[key].filter(isRec).forEach((row) => { for (const f of ['desc', 'description', 'reason', 'note', 'text', 'detail']) plant(row, f, 'grouping'); }); else if (isRec(holder) && typeof holder[key] === 'string') plant(holder, key, 'grouping'); }
    };
    let born;
    try {
      born = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: (name, ctx) => { plantAll(ctx); if (isRec(ctx.settlement)) plantAll(ctx.settlement); } });
    } catch (e) { out.birthsThatThrew.push(`${seed}: ${String(e.message).slice(0, 160)}`); continue; }
    plantAll(born);
    born.decrees = [{ id: 'd1', text: `decree text ${tok('grouping', 'decrees')}` }]; born.dmLayer = { notes: `dm layer notes ${tok('grouping', 'dmLayer')}` };
    const record = compose ? { ...born, publicProse: compose(born) } : born;
    // the hidden TEXT: each planted string's sentences, as the string stands at the end of the birth, marker removed
    const hiddenText = new Map(); // folded sentence -> [origin, the sentence in its own spelling]
    const leaves = (v, f) => { if (typeof v === 'string') f(v); else if (Array.isArray(v)) v.forEach((x) => leaves(x, f)); else if (isRec(v)) Object.values(v).forEach((x) => leaves(x, f)); };
    const cardNames = new Set(); for (const [, def] of Object.entries(KINDS)) for (const path of def.lists) { const star = path.indexOf('*');
      const owners = star < 0 ? [record] : (Array.isArray(at(record, path.slice(0, star))) ? at(record, path.slice(0, star)).filter(isRec) : []);
      for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (Array.isArray(arr)) arr.filter(isRec).forEach((c) => { for (const nk of ['name', 'faction', 'id']) if (typeof c[nk] === 'string') cardNames.add(c[nk]); }); } }
    for (const [holder, key, org] of sources) leaves(holder[key], (s) => { for (const x of sentencesOf(stripMarks(s))) if (!cardNames.has(x)) { const f = foldTrim(x); if (f.length >= 12 && !hiddenText.has(f)) hiddenText.set(f, [org, x]); } });
    out.hiddenTexts += hiddenText.size;
    out.towns += 1;
    for (const dm of [false, true]) {
      const pub = veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: {} });
      const m = veil.curateModelFor(pub, []);
      const eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
        ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
      for (const mode of ['live', 'snapshot']) {
        n += 1; out.shares += 1; out.handHides += eyes.length;
        const id = `abcd88${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(n).padStart(12, '0')}`; const slug = `qp${SHARD[0]}x${n}`; const link = `ql${SHARD[0]}x${n}`; const map = `qm${SHARD[0]}x${n}`; const maplink = `qn${SHARD[0]}x${n}`;
        const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), mode === 'snapshot' ? { mode, at: '2026-11-01T00:00:00.000Z', snapshot: pub } : { mode, at: '2026-11-01T00:00:00.000Z' });
        for (const c of CHAINS) {
          const db = dbs[c.db];
          try {
            await db.query(`select set_config('test.uid', '', false)`);
            await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
              values ($1,$2,$3,$4,$5,true,$6,now(),$7,'unlisted',$8,$9,true)`, [id, OWNER, record.name || seed, size, JSON.stringify(record), slug, link, JSON.stringify(ov), dm]);
            await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,unlisted_slug,visibility,share_kind,gallery_share_campaign,gallery_importable) values (gen_random_uuid(),$1,'m',$2,true,$3,$4,'unlisted','map_with_campaign',true,true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), map, maplink]);
            const T = {}; const time = async (k, q, a) => { const t0 = Date.now(); const r = await db.query(q, a); T[k] = Date.now() - t0; return r; };
            const g = (await time('gallery', 'select * from public.get_gallery_dossier($1)', [slug])).rows[0];
            const resp = { gallery: g, link: (await time('link', 'select public.get_unlisted_dossier($1) x', [link])).rows[0]?.x,
              map: (await time('map', 'select public.get_gallery_map($1) x', [map])).rows[0]?.x, maplink: (await time('maplink', 'select public.get_unlisted_map($1) x', [maplink])).rows[0]?.x };
            await db.query(`select set_config('test.uid', $1, false)`, [READER]);
            resp.import = (await time('import', 'select * from public.import_gallery_dossier($1)', [slug])).rows[0];
            resp.mapimport = (await time('mapimport', 'select public.import_gallery_map($1) x', [map])).rows[0]?.x;
            await db.query(`select set_config('test.uid', '', false)`);
            for (const [rk, ms] of Object.entries(T)) { const tk = `${c.db} ${rk}`; out.timing[tk] = out.timing[tk] || []; out.timing[tk].push(ms); }
            // the houses this share hid whole: the gallery response no longer lists them
            const sentNames = new Set((g?.data?.institutions || []).filter(isRec).map((i) => i.name));
            const goneCards = (record.institutions || []).filter((i) => isRec(i) && typeof i.name === 'string' && !sentNames.has(i.name));
            const openCards = (record.institutions || []).filter((i) => isRec(i) && typeof i.name === 'string' && sentNames.has(i.name));
            const hidden = goneCards.map((i) => ({ name: i.name, how: 'house' })).filter((h) => h.name.length >= 6);
            for (const ch of (isRec(record.economicState) && Array.isArray(record.economicState.activeChains) ? record.economicState.activeChains : []).filter(isRec)) {
              for (const x of Array.isArray(ch.processingInstitutions) ? ch.processingInstitutions : []) {
                if (typeof x === 'string' && x.length >= 6 && !hidden.some((h) => h.name === x) && goneCards.some((h) => institutionMatchesProcessor(h, x)) && !openCards.some((h) => institutionMatchesProcessor(h, x))) hidden.push({ name: x, how: 'alias' });
              }
            }
            if (c === CHAINS[0] && mode === 'live' && !dm) { out.housesHiddenWhole += hidden.filter((h) => h.how === 'house').length; out.aliasesHidden += hidden.filter((h) => h.how === 'alias').length; }
            const openFold = openCards.map((i) => foldTrim(i.name)).filter(Boolean); const openJoin = openCards.map((i) => join(i.name)).filter(Boolean);
            const H = hidden.map((h) => ({ ...h, f: foldTrim(h.name), j: join(h.name), re: new RegExp(`(^|_)${foldTrim(h.name)}(_|$)`) }));
            const label = (p) => p.replace(/^(data|dossier|members\[\]\.settlement|settlements\[\]\.data|settlements\[\])\./, '');
            const cache = new Map();
            for (const [read, body] of Object.entries(resp)) {
              out.reads += 1; bump(out.readsBy, `${c.db} ${read}`);
              if (!body) { out.raised.push(`${c.db} ${seed} dm=${dm} ${mode} ${read}: no row`); continue; }
              const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [k2, x] of Object.entries(v)) { walk(k2, `${p ? `${p}.` : ''}<key>`); walk(x, p ? `${p}.${k2}` : k2); } else if (typeof v === 'string') {
                const pre = `${c.db} | ${dm ? 'DM reveal on' : 'no reveal'} | `; const where = label(p); const ex = `${seed} ${mode} ${read}: `;
                const fv = fold(v);
                for (const mm of fv.matchAll(MARK_FOLD_RE)) { const how = v.includes(MARK(mm[1])) ? 'exact' : 'folded';
                  hit(`${pre}marker [${how}] ${origin.get(mm[1]) || '?'}  ->  ${where}`, read, seed, `${ex}${v.slice(0, 150)}`); }
                for (const h of H) {
                  let how = null;
                  if (v.includes(h.name)) how = 'exact';
                  else { let fb = fv; for (const o of openFold) if (o !== h.f && o.includes(h.f)) fb = fb.split(o).join('#');
                    if (h.re.test(fb)) how = 'folded';
                    else if (h.j.length >= 10) { let jb = join(v); for (const o of openJoin) if (o !== h.j && o.includes(h.j)) jb = jb.split(o).join('#'); if (jb.includes(h.j)) how = 'joined'; } }
                  if (how) hit(`${pre}name [${how}] ${h.how === 'alias' ? "a chain's name for a house hidden whole" : 'a house hidden whole'}  ->  ${where}`, read, seed, `${ex}"${h.name}" in "${v.slice(0, 120)}"`);
                }
                if (fv.length >= 12) { let r = cache.get(fv); if (r === undefined) { r = []; for (const [hs, [org, raw]] of hiddenText) if (fv.includes(hs)) r.push([hs, org, raw]); cache.set(fv, r); }
                  for (const [hs, org, raw] of r) { if (!v.includes(raw) && !/vh8k\d+q/.test(fv)) hit(`${pre}text [folded only] ${org}  ->  ${where}`, read, seed, `${ex}"${hs.slice(0, 60)}" in "${v.slice(0, 120)}"`); } }
              } };
              walk(body, '');
            }
          } catch (e) { out.raised.push(`${c.db} ${seed} dm=${dm} ${mode}: ${String(e.message).slice(0, 160)}`); }
        }
      }
    }
  }
  for (const k of Object.keys(out.sentTowns)) out.sentTowns[k] = Object.keys(out.sentTowns[k]).length;
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  for (const c of CHAINS) await dbs[c.db].end();
}, 14_400_000);
