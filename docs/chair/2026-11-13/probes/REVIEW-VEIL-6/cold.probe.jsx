// REVIEW-VEIL-6 — THE COLD PASS: my own markers, every field a user can hide by hand, every read a non-owner can make.
//
// Built on the last reader's planted-marker method (review-veil-5-probes/planted.probe.jsx) so the counts compare,
// with these differences, all mine:
//   1. MY OWN MARKERS: ` vq6n<seq>z` (lower-case alphanumerics only, so a slug, a case fold or a join keeps it).
//   2. PROPAGATION AT THE END OF THE BIRTH: the last reader's limit was a field derived inside the SAME step that
//      wrote its source (planted too late). Here every planted string's text as it stood before the marker is kept;
//      at the end of the birth every other string of the record that still holds that text, or a sentence of it of
//      twenty characters or more, is given the same marker beside it. A verbatim copy or an embedding made in any
//      step so carries the marker of its source.
//   3. THE ORIGINAL TEXT IS SEARCHED TOO: a marker lost to a truncation would hide a leak, so each hidden string's own
//      sentences (twenty characters or more) are looked for in every response as well.
//   4. MORE HOMES PLANTED: the notes (dossierNotes, dmNotes, notes, narrativeNotes, tabNotes, a note on a person, a
//      house and a power), the custom-content records (customContentRoster, customContentProvenance), the staged
//      decrees and the DM layer, a narration (ai_data) whose text is the marked town.
//   5. MORE READS: the party link's map (get_unlisted_map), the import of a shared map (import_gallery_map), the
//      public card and its lists (list_gallery_dossiers, list_featured_dossiers, list_curated_dossiers,
//      list_gallery_more_by_creator, _gallery_public_tile_rows, list_gallery_maps, list_featured_maps), beside the four.
//   6. THE PER-PERSON SWITCH ALONE: a share with Reveal DM on, no veil mark, and every person switched off by hand
//      (the shape the last review's V5-4 named), and the same with the mark.
// Every eye is shut BY HAND; nothing is looked for by key. Local scratch chains only.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';

const SRC = process.env.RV6_SRC; const SIDE = process.env.RV6_SIDE || 'master'; const OUT = process.env.RV6_OUT;
const CHAINS = (process.env.RV6_CHAINS || '').split(',').filter(Boolean).map((x) => { const [db, tpl] = x.split(':'); return { db, tpl }; });
const SEEDS = Number(process.env.RV6_SEEDS || 1); const SHARD = (process.env.RV6_SHARD || '0/1').split('/').map(Number);
const SIZES = (process.env.RV6_SIZES || 'thorp,hamlet,village,town,city,metropolis').split(',');
const PREFIX = process.env.RV6_PREFIX || 'c';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const TOKEN_RE = /vq6n[0-9]+z/gi;
const marked = (v) => /vq6n[0-9]+z/i.test(JSON.stringify(v ?? null));
const sentencesOf = (s) => String(s).split(/(?<=[.!?;])\s+/).map((x) => x.trim()).filter((x) => x.length >= 20);

it(`REVIEW-VEIL-6 cold pass (${SIDE})`, async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
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
  const out = { side: SIDE, towns: 0, birthsThatThrew: [], planted: 0, plantedByOrigin: {}, propagated: 0, propagatedTo: {}, shares: 0, reads: 0, handHides: 0, clamped: 0,
    sent: {}, sentTowns: {}, text: {}, textTowns: {}, examples: {}, houseNames: {}, houseNameTowns: {}, housesHiddenWhole: 0, raised: [], listReads: {}, readsByName: {} };
  const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
  const normPath = (p) => p.replace(/^(data|dossier|members\[\]\.settlement|settlements\[\]\.data|settlements\[\]|x)\./, '');
  let n = 0; let idx = 0;
  for (let k = 0; k < SEEDS; k += 1) for (const size of SIZES) for (const stress of [null, 'infiltrated']) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `rv6-cold-${size}-${stress}-${k}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let seq = 0; const origin = new Map(); const originalOf = new Map();
    const tok = (kind, key, original) => { seq += 1; const t = `vq6n${seq}z`; origin.set(t, `${kind}.${key}`); if (original) originalOf.set(t, original); bump(out.plantedByOrigin, `${kind}.${key}`); out.planted += 1; return t; };
    const plant = (holder, key, kind) => {
      const v = holder[key];
      if (v == null || typeof v === 'boolean' || typeof v === 'number' || marked(v)) return;
      if (typeof v === 'string') { if (v.trim()) holder[key] = `${v} ${tok(kind, key, v)}`; } else if (Array.isArray(v)) { if (v.length) { v.filter((x) => typeof x === 'string' && x.length >= 20).forEach((x) => originalOf.set(`arr:${seq}:${x}`, x)); v.push(tok(kind, key, null)); } } else if (isRec(v)) v.vq6 = tok(kind, key, null);
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
    const joinKeys = new Set(); for (const list of [born.institutions, born.npcs, born.factions, born.powerStructure?.factions]) for (const c of (Array.isArray(list) ? list : []).filter(isRec)) for (const k2 of ['name', 'id', 'faction', 'refId', 'label']) if (typeof c[k2] === 'string') joinKeys.add(c[k2]);
    const isProse = (x) => x.length >= 12 && (x.match(/ /g) || []).length >= 2 && !joinKeys.has(x); // three words or more, never an id or the name of a card
    // (2a) THE DEEP PASS, at the end of the birth only (so the engine's own reads of an inner value are not disturbed):
    // a governed value that is a record or a list was given one marker of its own above; here every string of twelve
    // characters or more INSIDE it gets a marker too, and its text is kept for the propagation and the text search.
    const deep = (v, kind, key) => {
      const each = (holder, k2) => { const x = holder[k2];
        if (typeof x === 'string') { if (isProse(x) && !marked(x)) { try { holder[k2] = `${x} ${tok(kind, `${key}(inner)`, x)}`; } catch { /* frozen */ } } } else if (x && typeof x === 'object') deep(x, kind, key); };
      if (Array.isArray(v)) for (let i = 0; i < v.length; i += 1) each(v, i); else if (isRec(v)) for (const k2 of Object.keys(v)) each(v, k2);
    };
    for (const [kind, def] of Object.entries(KINDS)) for (const path of def.lists) {
      const star = path.indexOf('*');
      const owners = star < 0 ? [born] : (Array.isArray(at(born, path.slice(0, star))) ? at(born, path.slice(0, star)).filter(isRec) : []);
      for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (!Array.isArray(arr)) continue;
        for (const c of arr.filter(isRec)) for (const [eye, keys] of Object.entries(def.fields)) { if (kind === 'faction' && eye === 'members') continue;
          for (const key of keys) { if (kind === 'npc' && (key === 'institution' || key === 'linkedInstitutionIds' || key === 'relationships')) continue; if (kind === 'institution' && (key === 'tags' || key === 'serviceKeys' || key === 'facets')) continue;
            if (c[key] && typeof c[key] === 'object') deep(c[key], kind, key); } } }
    }
    for (const paths of Object.values(GROUPING_DATA)) for (const p of paths) { const v = at(born, p); if (v && typeof v === 'object') deep(v, 'grouping', p.join('.')); }
    // (2) propagation: a copy or an embedding of a hidden string made before its marker was planted gets the marker now.
    const pieces = [];
    for (const [t, original] of originalOf) { if (t.startsWith('arr:')) continue; const full = String(original).trim();
      if (full.length >= 12 && (full.match(/ /g) || []).length >= 2 && !joinKeys.has(full)) pieces.push({ t, piece: full }); for (const s of sentencesOf(full)) if (s !== full && s.includes(' ')) pieces.push({ t, piece: s }); }
    pieces.sort((a, b) => b.piece.length - a.piece.length);
    const seenObj = new WeakSet(); let frozenSkips = 0;
    const propagate = (v, p) => {
      if (v && typeof v === 'object') { if (seenObj.has(v)) return; seenObj.add(v); }
      if (Array.isArray(v)) { for (let i = 0; i < v.length; i += 1) { if (typeof v[i] === 'string') { const nv = prop1(v[i], `${p}[]`); if (nv !== v[i]) { try { v[i] = nv; } catch { frozenSkips += 1; } } } else propagate(v[i], `${p}[]`); } return; }
      if (!isRec(v)) return;
      for (const k2 of Object.keys(v)) { if (typeof v[k2] === 'string') { const nv = prop1(v[k2], p ? `${p}.${k2}` : k2); if (nv !== v[k2]) { try { v[k2] = nv; } catch { frozenSkips += 1; } } } else propagate(v[k2], p ? `${p}.${k2}` : k2); }
    };
    const prop1 = (s, p) => {
      if (s.length < 12) return s; let o = s;
      for (const { t, piece } of pieces) { if (o.includes(t)) continue; const i = o.indexOf(piece); if (i < 0) continue;
        o = `${o.slice(0, i + piece.length)} ${t}${o.slice(i + piece.length)}`; out.propagated += 1; bump(out.propagatedTo, `${origin.get(t)}  =>  ${p}`); }
      return o;
    };
    propagate(born, ''); out.frozenSkips = (out.frozenSkips || 0) + frozenSkips;
    // (4) more homes a user fills by hand
    const note = (key) => tok('note', key, null);
    born.dossierNotes = `Dossier note ${note('dossierNotes')}`; born.dmNotes = `DM note ${note('dmNotes')}`; born.notes = `A note ${note('notes')}`;
    born.narrativeNotes = `Narrative note ${note('narrativeNotes')}`; born.tabNotes = { power: `Tab note ${note('tabNotes')}`, overview: `Tab note ${note('tabNotes')}` };
    for (const c of (born.npcs || []).filter(isRec).slice(0, 3)) { c.notes = `npc note ${note('npc.notes')}`; c.dmNotes = `npc dm note ${note('npc.dmNotes')}`; }
    for (const c of (born.institutions || []).filter(isRec).slice(0, 3)) { c.notes = `house note ${note('institution.notes')}`; c.dmNotes = `house dm note ${note('institution.dmNotes')}`; }
    for (const c of (born.powerStructure?.factions || []).filter(isRec).slice(0, 3)) { c.notes = `power note ${note('faction.notes')}`; c.dmNotes = `power dm note ${note('faction.dmNotes')}`; }
    born.decrees = [{ id: 'd1', text: `Decree ${tok('grouping', 'decrees', null)}` }]; born.dmLayer = { notes: `Layer ${tok('grouping', 'dmLayer', null)}` };
    born.customContentRoster = [{ id: `custom_${tok('custom', 'customContentRoster.id', null)}`, kind: 'institution', name: `Homebrew house ${tok('custom', 'customContentRoster.name', null)}`, description: `Homebrew text ${tok('custom', 'customContentRoster.description', null)}`, adopted: true }];
    born.customContentProvenance = [{ contentId: `custom_${tok('custom', 'customContentProvenance.id', null)}`, ownerKey: `acct_${tok('custom', 'customContentProvenance.ownerKey', null)}`, name: `Homebrew ${tok('custom', 'customContentProvenance.name', null)}` }];
    const record = compose ? { ...born, publicProse: compose(born) } : born;
    const aiData = { aiSettlement: record, narrative: `Narration ${tok('ai', 'ai_data.narrative', null)}`, summary: `Summary ${tok('ai', 'ai_data.summary', null)}`, grounding: { facts: [`Grounding ${tok('ai', 'ai_data.grounding', null)}`] } };
    // only a string whose source is still in the STORED record is a hidden string of this town (a marker planted on a
    // step's working value that the birth later dropped has no home to hide)
    const storedText = JSON.stringify(record); const originOfPiece = new Map();
    for (const x of pieces) if (storedText.includes(x.t) && !originOfPiece.has(x.piece)) originOfPiece.set(x.piece, origin.get(x.t));
    const hiddenText = [...originOfPiece.keys()];
    out.towns += 1;
    const shareKinds = [];
    for (const dm of [false, true]) for (const mode of ['live', 'snapshot']) shareKinds.push({ dm, mode, kind: 'every eye shut' });
    shareKinds.push({ dm: false, mode: 'live', kind: 'every eye shut, narrated', narrated: true });
    shareKinds.push({ dm: true, mode: 'live', kind: 'every eye shut, narrated', narrated: true });
    shareKinds.push({ dm: true, mode: null, kind: 'unmarked, every person switched off', personsOnly: true, unmarked: true });
    shareKinds.push({ dm: true, mode: 'live', kind: 'marked, every person switched off, no other eye', personsOnly: true });
    for (const sk of shareKinds) {
      const { dm, mode } = sk;
      const pub = veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: {} });
      const m = veil.curateModelFor(pub, []);
      const personEyes = m.sections.flatMap((s) => s.cards.filter((c) => c.kind === 'npc').map((c) => `card:npc:${c.id}`));
      const allEyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
        ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
      const eyes = sk.personsOnly ? personEyes : allEyes;
      n += 1; out.shares += 1; out.handHides += eyes.length;
      const id = `abcd66${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(n).padStart(12, '0')}`; const slug = `${PREFIX}p${SHARD[0]}x${n}`; const link = `${PREFIX}l${SHARD[0]}x${n}`; const map = `${PREFIX}m${SHARD[0]}x${n}`; const mapLink = `${PREFIX}u${SHARD[0]}x${n}`;
      let ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), mode === 'snapshot' ? { mode, at: '2026-11-01T00:00:00.000Z', snapshot: pub } : { mode: mode || 'live', at: '2026-11-01T00:00:00.000Z' });
      if (sk.unmarked) { ov = { ...ov }; delete ov[veil.VEIL_OVERRIDE_KEY]; }
      const stored = (ov[veil.VEIL_OVERRIDE_KEY]?.deltas || []).length + Object.keys(ov).filter((x) => x !== veil.VEIL_OVERRIDE_KEY).length;
      if (!sk.unmarked && stored < new Set(eyes).size) out.clamped += 1;
      const label = `${dm ? 'DM reveal on' : 'no reveal'} | ${sk.kind}${mode === 'snapshot' ? ' | frozen' : ''}`;
      for (const c of CHAINS) {
        const db = dbs[c.db];
        try {
          await db.query(`select set_config('test.uid', '', false)`);
          await db.query(`insert into public.settlements (id,user_id,name,tier,data,ai_data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
            values ($1,$2,$3,$4,$5,$6,true,$7,now(),$8,'unlisted',$9,$10,true,$11)`, [id, OWNER, record.name || seed, size, JSON.stringify(record), sk.narrated ? JSON.stringify(aiData) : null, slug, link, JSON.stringify(ov), dm, !!sk.narrated]);
          await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign,unlisted_slug,gallery_importable,visibility,published_at) values (gen_random_uuid(),$1,'m',$2,true,$3,'map_with_campaign',true,$4,true,'unlisted',now())`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), map, mapLink])
            .catch(async () => { await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign) values (gen_random_uuid(),$1,'m',$2,true,$3,'map_with_campaign',true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), map]); });
          const resp = {}; const q = async (name, sql, args) => { try { const r = await db.query(sql, args); resp[name] = r.rows.length ? r.rows : null; } catch (e) { resp[name] = undefined; bump(out.readsByName, `${c.db} ${name} RAISED: ${String(e.message).slice(0, 90)}`); } };
          await q('gallery', 'select * from public.get_gallery_dossier($1)', [slug]);
          await q('link', 'select public.get_unlisted_dossier($1) x', [link]);
          await q('map', 'select public.get_gallery_map($1) x', [map]);
          await q('mapLink', 'select public.get_unlisted_map($1) x', [mapLink]);
          await q('card', `select * from public.list_gallery_dossiers(0, 60, 'newest', $1, '{}'::jsonb, false)`, [record.name || seed]);
          await q('moreByCreator', 'select * from public.list_gallery_more_by_creator($1, 12)', [slug]);
          await db.query(`select set_config('test.uid', $1, false)`, [READER]);
          await q('import', 'select * from public.import_gallery_dossier($1)', [slug]);
          await q('importMap', 'select * from public.import_gallery_map($1)', [map]);
          await db.query(`select set_config('test.uid', '', false)`);
          const sentNames = new Set((resp.gallery?.[0]?.data?.institutions || []).filter(isRec).map((i) => i.name));
          const gone = sk.personsOnly ? [] : (record.institutions || []).filter(isRec).map((i) => i.name).filter((x) => typeof x === 'string' && x.length >= 6 && !sentNames.has(x));
          if (c === CHAINS[0] && mode === 'live' && !dm && !sk.narrated) out.housesHiddenWhole += gone.length;
          for (const [read, body] of Object.entries(resp)) {
            if (body === undefined) continue; out.reads += 1; bump(out.readsByName, `${c.db} ${read} ${body ? 'row' : 'NO ROW'}`); if (!body) continue;
            const seenText = new Set();
            const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [k2, x] of Object.entries(v)) { if (TOKEN_RE.test(k2)) walk(k2, `${p}.<key>`); TOKEN_RE.lastIndex = 0; walk(x, p ? `${p}.${k2}` : k2); } else if (typeof v === 'string') {
              const path = normPath(p.replace(/^\[\]\./, ''));
              for (const t of v.match(TOKEN_RE) || []) { const key = `${origin.get(t.toLowerCase()) || '?'}  ->  ${path}`; const kk = `${c.db} | ${label} | ${key}`;
                out.sent[kk] = out.sent[kk] || {}; bump(out.sent[kk], read); (out.sentTowns[kk] = out.sentTowns[kk] || {})[seed] = 1; out.examples[kk] = out.examples[kk] || `${seed} ${read}: ${v.slice(0, 170)}`; }
              if (!sk.personsOnly && v.length >= 12) for (const h of hiddenText) if (v.includes(h) && !seenText.has(`${path}|${h}`)) { seenText.add(`${path}|${h}`); const kk = `${c.db} | ${label} | text of ${originOfPiece.get(h)}  ->  ${path}`;
                out.text[kk] = out.text[kk] || {}; bump(out.text[kk], read); (out.textTowns[kk] = out.textTowns[kk] || {})[seed] = 1; out.examples[kk] = out.examples[kk] || `${seed} ${read}: ${v.slice(0, 170)}`; }
              for (const nm of gone) if (v.includes(nm)) { const kk = `${c.db} | ${label} | a house hidden whole  ->  ${path}`;
                out.houseNames[kk] = out.houseNames[kk] || {}; bump(out.houseNames[kk], read); (out.houseNameTowns[kk] = out.houseNameTowns[kk] || {})[seed] = 1; out.examples[kk] = out.examples[kk] || `${seed} ${read}: "${nm}" in "${v.slice(0, 110)}"`; } } };
            walk(body, '');
          }
        } catch (e) { out.raised.push(`${c.db} ${seed} ${label}: ${String(e.message).slice(0, 200)}`); }
      }
    }
  }
  // the lists that take no slug, once, at the end: every share of this shard is in them or not
  for (const c of CHAINS) for (const [name, sql] of [['list_featured_dossiers', 'select * from public.list_featured_dossiers()'], ['list_curated_dossiers', 'select * from public.list_curated_dossiers()'],
    ['_gallery_public_tile_rows', 'select * from public._gallery_public_tile_rows()'], ['list_gallery_maps', `select * from public.list_gallery_maps(0, 60, 'newest', null, '{}'::jsonb)`], ['list_featured_maps', 'select * from public.list_featured_maps()'],
    ['list_gallery_dossiers(all)', `select * from public.list_gallery_dossiers(0, 60, 'newest', null, '{}'::jsonb, false)`]]) {
    try { const r = await dbs[c.db].query(sql); const text = JSON.stringify(r.rows); out.listReads[`${c.db} ${name}`] = { rows: r.rows.length, markers: (text.match(TOKEN_RE) || []).length }; } catch (e) { out.listReads[`${c.db} ${name}`] = `RAISED ${String(e.message).slice(0, 120)}`; }
  }
  for (const o of [out.sentTowns, out.textTowns, out.houseNameTowns]) for (const k of Object.keys(o)) o[k] = Object.keys(o[k]).length;
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  for (const c of CHAINS) await dbs[c.db].end();
}, 14_400_000);
