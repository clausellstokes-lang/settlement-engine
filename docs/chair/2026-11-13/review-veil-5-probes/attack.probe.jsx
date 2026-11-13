// REVIEW-VEIL-5 — the reviewer's own attack on migration 211 at 333b33973, written before any claim was read.
//
// WHAT IT DOES. Towns are born by one side's own generator (RV5_SIDE=master: the DEPLOYED client, db832c892;
// RV5_SIDE=tip: the lane), shared by that side's own writers (writeShareVeil, galleryPayloadFor), and stored in local
// scratch databases (clones of a migration chain). Every one of the four public reads is then executed, and its
// response is compared, leaf by leaf, with THE REFERENCE: that side's own client veil (resolveVeil + applyVeil with the
// STORED deltas) laid over the chain's own unveiled projection of the same row. So the SQL is judged against the rule
// the sharer's panel used when the eyes were shut.
//   EXTRA   a leaf the response carries that the reference removed  -> a hidden thing was sent (the law's first half)
//   MISSING a leaf the reference keeps that the response lacks      -> something not hidden was taken (the second half)
// Beside the diff, every governed key of every card kind is SALTED with a unique token; a token the reference removed
// that turns up anywhere in a whole response row (every column) is counted on its own: that is a leak with no
// classifier between it and the count.
//
// Run from a worktree of the side under test (see README.md beside this file):
//   RV5_SIDE=master RV5_SRC=<master worktree> RV5_CHAINS=a203:t203,a203p211:t203p211,a211:t211 RV5_OUT=<file> \
//     npx vitest run --config <this folder>/vitest.config.mjs
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';

const SRC = process.env.RV5_SRC;            // the worktree whose client is the reference
const SIDE = process.env.RV5_SIDE || 'master';
const PGMOD = process.env.RV5_PGMOD;        // a folder holding node_modules/pg, outside the repository
const OUT = process.env.RV5_OUT;
const CHAINS = (process.env.RV5_CHAINS || '').split(',').filter(Boolean).map((x) => { const [db, tpl] = x.split(':'); return { db, tpl }; });
const SUBJECTS = (process.env.RV5_SUBJECTS || '').split(',').filter(Boolean); // the chains carrying 211 (compared); others are reference-only
const SHARD = (process.env.RV5_SHARD || '0/1').split('/').map(Number);
const SEEDS = Number(process.env.RV5_SEEDS || 1);
const SIZES = (process.env.RV5_SIZES || 'thorp,hamlet,village,town,city,metropolis').split(',');
const TAG = process.env.RV5_TAG || 'a';
const POWERS = process.env.RV5_POWERS === '1'; // the composition arm: hand hides on every leader and claimant

const H = globalThis.__RV5 = { db: null, uid: '', last: null };
vi.mock(`${process.env.RV5_SRC}/src/lib/supabase.js`, () => {
  const H = globalThis.__RV5;
  const SERVED = new Set(['get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map']);
  const tableFns = new Set(['get_gallery_dossier', 'import_gallery_dossier']);
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!SERVED.has(name)) return { data: name.startsWith('list_') ? [] : null, error: null };
      try {
        await H.db.query(`select set_config('test.uid', $1, false)`, [H.uid]);
        const keys = Object.keys(args);
        const call = `public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')})`;
        const r = await H.db.query(tableFns.has(name) ? `select * from ${call}` : `select ${call} as out`, keys.map((k) => args[k]));
        H.last = tableFns.has(name) ? r.rows : r.rows[0]?.out;
        return { data: H.last, error: null };
      } catch (e) { H.last = { error: String(e.message) }; return { data: null, error: { message: String(e.message) } }; }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});

const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
function rng(seed) { let a = 0; for (const c of String(seed)) a = (Math.imul(a, 31) + c.charCodeAt(0)) | 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const TOKEN_RE = /RV5~[A-Za-z0-9_.~-]+~Z/g;
const tokensOf = (v) => new Set(JSON.stringify(v ?? null).match(TOKEN_RE) || []);

// ── the deep diff: arrays of records are aligned by id (else name), so a dropped card does not shift its neighbours ──
function keyOf(e) { if (!isRec(e)) return null; const k = e.id ?? e.name ?? e.faction ?? e.title; return (typeof k === 'string' || typeof k === 'number') ? String(k) : null; }
function diff(exp, act, path, out) {
  if (Array.isArray(exp) && Array.isArray(act)) {
    const ke = exp.map(keyOf); const ka = act.map(keyOf);
    const uniq = (ks) => ks.every((k) => k != null) && new Set(ks).size === ks.length;
    if (exp.length !== act.length && uniq(ke) && uniq(ka)) {
      const ma = new Map(act.map((e, i) => [ka[i], e])); const me = new Map(exp.map((e, i) => [ke[i], e]));
      for (const [k, e] of me) { if (ma.has(k)) diff(e, ma.get(k), `${path}[]`, out); else out.push(['MISSING', `${path}[]`, e]); }
      for (const [k, a] of ma) if (!me.has(k)) out.push(['EXTRA', `${path}[]`, a]);
      return;
    }
    const n = Math.max(exp.length, act.length);
    for (let i = 0; i < n; i += 1) {
      if (i >= exp.length) out.push(['EXTRA', `${path}[]`, act[i]]);
      else if (i >= act.length) out.push(['MISSING', `${path}[]`, exp[i]]);
      else diff(exp[i], act[i], `${path}[]`, out);
    }
    return;
  }
  if (isRec(exp) && isRec(act)) {
    for (const k of new Set([...Object.keys(exp), ...Object.keys(act)])) {
      const p = path ? `${path}.${k}` : k;
      if (!(k in act)) { if (exp[k] !== undefined) out.push(['MISSING', p, exp[k]]); } else if (!(k in exp) || exp[k] === undefined) out.push(['EXTRA', p, act[k]]);
      else diff(exp[k], act[k], p, out);
    }
    return;
  }
  if (JSON.stringify(exp) !== JSON.stringify(act)) out.push(['CHANGED', path, [exp, act]]);
}

// ── the salt: one unique token on every key an eye or a grouping governs (both shapes' spellings) ──
const NPC_KEYS = ['personality', 'physical', 'goal', 'goals', 'factionGoal', 'activeConstraint', 'whereabouts', 'location', 'currentLocation', 'secret',
  'relationships', 'linkedFactionIds', 'plotHooks', 'corruptionVector', 'corruptTies', ...(process.env.RV5_SIDE === 'tip' ? ['allegiance'] : [])];
const KEYS = { institution: ['desc', 'description', 'tags', 'facets', 'serviceKeys'], faction: ['desc', 'description', 'crisisNote', 'goals', 'goal', 'agenda', 'conflicts', 'captureState'],
  event: ['description', 'desc', 'lastingEffects', 'plotHooks'], tension: ['description', 'desc', 'lastingEffects', 'plotHooks'],
  conflict: ['stakes', 'desc', 'description', 'plotHooks'], relationship: ['tension', 'description', 'plotHooks'] };
function saltValue(v, tok, addAbsent) {
  if (typeof v === 'string') return `${v} ${tok}`;
  if (Array.isArray(v)) return [...v, tok];
  if (isRec(v)) return { ...v, rv5: tok };
  if (v == null && addAbsent) return tok;
  return v;
}
function salt(record, lists, tag, r) {
  const s = structuredClone(record); let n = 0;
  const tk = (kind, key) => `RV5~${tag}~${kind}~${(n += 1)}~${key}~Z`;
  const at = (root, path) => path.reduce((c, seg) => (isRec(c) ? c[seg] : undefined), root);
  const each = (kind, keys, fn) => {
    for (const path of lists[kind]) {
      const star = path.indexOf('*');
      const owners = star < 0 ? [s] : (Array.isArray(at(s, path.slice(0, star))) ? at(s, path.slice(0, star)).filter(isRec) : []);
      for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (Array.isArray(arr)) arr.filter(isRec).forEach((c) => fn(c, keys)); }
    }
  };
  const put = (kind) => (c, keys) => { for (const k of keys) { const add = r() < 0.5; const nv = saltValue(c[k], tk(kind, k), add); if (nv !== undefined && nv !== c[k]) c[k] = nv; } };
  each('npc', NPC_KEYS, put('npc'));
  for (const kind of Object.keys(KEYS)) each(kind, KEYS[kind], put(kind));
  // the groupings' data and the editor's state
  s.decrees = [{ id: 'd1', text: tk('grp', 'decrees') }];
  s.dmLayer = { notes: tk('grp', 'dmLayer') };
  s.coherenceNotes = saltValue(s.coherenceNotes, tk('grp', 'coherenceNotes'), true);
  s.generationCoherenceReceipt = saltValue(s.generationCoherenceReceipt, tk('grp', 'receipt'), true);
  s.structuralViolations = [...(Array.isArray(s.structuralViolations) ? s.structuralViolations : []), { reason: `garrison wall ${tk('grp', 'vuln')}` }, { reason: `granary ${tk('grp', 'violation')}` }];
  s.structuralSuggestions = saltValue(s.structuralSuggestions, tk('grp', 'suggestions'), true);
  if (isRec(s.availableServices)) s.availableServices.criminal = saltValue(s.availableServices.criminal, tk('grp', 'crimsvc'), true);
  if (isRec(s.economicState)) { s.economicState.safetyProfile = isRec(s.economicState.safetyProfile) ? s.economicState.safetyProfile : {};
    for (const k of ['criminalInstitutions', 'crimeTypes', 'blackMarketCapture']) s.economicState.safetyProfile[k] = saltValue(s.economicState.safetyProfile[k], tk('grp', k), true); }
  if (isRec(s.powerStructure)) { s.powerStructure.criminalCaptureState = saltValue(s.powerStructure.criminalCaptureState, tk('grp', 'criminalCaptureState'), true);
    if (Array.isArray(s.powerStructure.factionRelationships)) s.powerStructure.factionRelationships.filter(isRec).forEach((p) => { p.captureState = saltValue(p.captureState, tk('grp', 'pairCapture'), true); }); }
  return s;
}

// ── the mutation fuzz: a born town with the identity of a third of its cards disturbed, in the ways a hand edit, an
// old save or an import can leave them (no id, a numeric id, an id with colons and capitals, no name, an empty name, a
// name shared with a neighbour; a tie by names only, a tie in both spellings, an event with nothing to name it) ──
function mutate(record, lists, r) {
  const s = structuredClone(record);
  const at = (root, path) => path.reduce((c, seg) => (isRec(c) ? c[seg] : undefined), root);
  const pick = (a) => a[Math.floor(r() * a.length)];
  for (const [kind, paths] of Object.entries(lists)) for (const path of paths) {
    const star = path.indexOf('*');
    const owners = star < 0 ? [s] : (Array.isArray(at(s, path.slice(0, star))) ? at(s, path.slice(0, star)).filter(isRec) : []);
    for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (!Array.isArray(arr)) continue;
      arr.filter(isRec).forEach((c, i) => {
        if (r() > 0.35) return;
        const ops = ['noid', 'numid', 'weirdid', 'noname', 'emptyname', 'dupname'];
        if (kind === 'relationship') ops.push('namesOnly', 'namesOnly', 'both', 'numericEnd', 'oldSpelling');
        if (kind === 'event') ops.push('anonymous', 'anonymous');
        if (kind === 'faction') ops.push('nameKey');
        if (kind === 'institution') ops.push('refId', 'label');
        const op = pick(ops);
        if (op === 'noid') delete c.id;
        else if (op === 'numid') c.id = 7 + i;
        else if (op === 'weirdid') c.id = `\u00dcn\u00ef:Co-De_${i}:X`;
        else if (op === 'noname') { delete c.name; }
        else if (op === 'emptyname') c.name = '';
        else if (op === 'dupname') { const other = pick(arr.filter(isRec)); if (other && typeof other.name === 'string') c.name = other.name; }
        else if (op === 'namesOnly') { delete c.id; delete c.npc1Id; delete c.npc2Id; delete c.from; delete c.to; }
        else if (op === 'both') { delete c.id; if (c.npc1Id !== undefined) { c.from = c.npc1Id; c.to = c.npc2Id; } else { c.npc1Id = c.from; c.npc2Id = c.to; } }
        else if (op === 'oldSpelling') { delete c.id; if (c.from !== undefined) { c.npc1Id = c.from; c.npc2Id = c.to; delete c.from; delete c.to; } }
        else if (op === 'numericEnd') { delete c.id; if (c.npc1Id !== undefined) c.npc1Id = 3; else c.from = 3; }
        else if (op === 'anonymous') { delete c.id; delete c.name; delete c.title; delete c.label; }
        else if (op === 'nameKey') { if (c.faction !== undefined) { c.name = c.faction; delete c.faction; } }
        else if (op === 'refId') { c.refId = `ref-${i}`; delete c.id; }
        else if (op === 'label') { c.label = c.name; delete c.name; delete c.id; }
      }); }
  }
  return s;
}

it(`REVIEW-VEIL-5 attack (${SIDE})`, async () => {
  const pg = (await import(`${PGMOD}/node_modules/pg/lib/index.js`)).default;
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
  const gallery = await import(`${M}/lib/gallery.js`);
  await loadGenerationLawPayloads();
  const compose = SIDE === 'tip' ? (await import(`${M}/components/new/publicProseCompose.js`)).composePublicProse : null;
  const safe = await import(`${M}/domain/display/publicSafe.js`);
  const stamp = (rec) => (compose ? { ...rec, publicProse: compose(rec) } : rec);
  const LISTS = Object.fromEntries(Object.entries(veil.CARD_KINDS).map(([k, v]) => [k, v.lists]));

  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbs = {};
  for (const c of CHAINS) {
    if (SHARD[0] === 0 || !process.env.RV5_KEEP) { /* each shard owns its own clone */ }
    const name = `${c.db}_${SHARD[0]}`;
    await admin.query(`drop database if exists ${name} with (force)`); await admin.query(`create database ${name} template ${c.tpl}`);
    dbs[c.db] = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: name }); await dbs[c.db].connect();
  }
  await admin.end();

  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const towns = [];
  for (let k = 0; k < SEEDS; k += 1) for (const size of SIZES) {
    towns.push({ seed: `rv5-${TAG}-${size}-calm-${k}`, cfg: { ...DEFAULT_CONFIG, ...dials, settType: size } });
    towns.push({ seed: `rv5-${TAG}-${size}-infiltrated-${k}`, cfg: { ...DEFAULT_CONFIG, ...dials, settType: size, selectedStresses: ['infiltrated'], selectedStressesRandom: false } });
  }
  const only = process.env.RV5_ONLY; // e.g. 'infiltrated': keep only the seeds that name it
  const mine = towns.filter((t) => !only || t.seed.includes(only)).filter((_, i) => i % SHARD[1] === SHARD[0]);

  const T = {}; const tm = async (k, f) => { const t0 = Date.now(); try { return await f(); } finally { T[k] = (T[k] || 0) + Date.now() - t0; } };
  const out = { side: SIDE, timers: T, shard: SHARD, towns: mine.map((t) => t.seed), shares: 0, reads: 0, raised: [], noRow: {}, diff: {}, examples: {}, tokenLeaks: [], postFreeze: {}, served: {},
    pageShowMore: {}, handHides: 0, hiddenTokens: 0, hidden: {}, secondHome: {}, secondHomeEx: [], hiddenPowerName: {}, covertTies: {}, hiddenPowerTowns: 0 };
  const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
  const ex = (k, v) => { out.examples[k] = out.examples[k] || []; if (out.examples[k].length < 4) out.examples[k].push(v); };
  let n = 0;

  for (const t of mine) {
    const born = await tm('birth', async () => generateSettlementPipeline(birthConfig(t.cfg), null, { seed: t.seed, customContent: {} }));
    const r = rng(t.seed);
    for (const variant of [...(process.env.RV5_ONLY_MUTANTS ? [] : ['natural', 'salted']), ...Array.from({ length: Number(process.env.RV5_MUTANTS || 0) }, (_, k) => `mutant${k}`)]) {
      const record = stamp(variant === 'salted' ? salt(born, LISTS, `${t.seed}`.replace(/[^a-z0-9]/gi, ''), r)
        : variant.startsWith('mutant') ? salt(mutate(born, LISTS, r), LISTS, `${t.seed}${variant}`.replace(/[^a-z0-9]/gi, ''), r) : born);
      // the powers the public strip removes whole (the tip's hidden powers): their names must ride nothing a reader gets
      const strippedRec = safe.publicVeiledRecordOf ? safe.publicVeiledRecordOf(record) : null;
      const hiddenPowers = strippedRec ? (record.powerStructure?.factions || []).filter((f) => !(strippedRec.powerStructure?.factions || []).some((g) => (g.faction || g.name) === (f.faction || f.name))).map((f) => String(f.faction || f.name)).filter((x) => x.length >= 6) : [];
      const nameForms = hiddenPowers.flatMap((x) => [x.toLowerCase(), x.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''), x.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')]);
      if (hiddenPowers.length && variant === 'natural') out.hiddenPowerTowns += 1;
      const edited = structuredClone(record);
      edited.npcs = [...(edited.npcs || []), { id: 'npc_rv5_post', name: 'Arvee Postfreeze', role: 'spy', secret: 'RV5POST_SECRET', personality: 'RV5POST_PERSONA' }];
      if ((edited.institutions || [])[0]) edited.institutions[0].desc = `RV5POST_DESC ${edited.institutions[0].desc || ''}`;
      if (edited.relationships?.[0]) edited.relationships[0].description = `RV5POST_REL ${edited.relationships[0].description || ''}`;
      const tModel = Date.now();
      const model = (dm, mo) => {
        const pub = veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: mo });
        const m = veil.curateModelFor(pub, []);
        const eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
          ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)])]);
        const cards = m.sections.flatMap((s) => s.cards.map((c) => ({ kind: c.kind, id: c.id, eyes: c.eyes.map((e) => e.address) })));
        const defaults = [...veil.defaultVeilFor(pub)].map((x) => (typeof x === 'string' ? x : x.address)).filter(Boolean);
        return { pub, eyes, cards, defaults };
      };
      const shares = [];
      for (const dm of [false, true]) {
        const m0 = model(dm, {});
        const shut = (list) => list.map((a) => ({ address: a, hidden: true }));
        const people = m0.cards.filter((c) => c.kind === 'npc');
        // a third of the people revealed by hand (the per-member DM reveal), their goals/ties/secret/personality shut by hand; a third hidden whole
        const mo = {}; const memberDeltas = [];
        people.forEach((c, i) => {
          if (i % 3 === 0) { mo[c.id] = { revealDm: true }; for (const f of ['goals', 'ties', 'secret', 'personality', 'corruption', 'whereabouts', 'hooks']) memberDeltas.push({ address: `field:npc:${c.id}:${f}`, hidden: true }); }
          else if (i % 3 === 1) memberDeltas.push({ address: `card:npc:${c.id}`, hidden: true });
        });
        const powersDeltas = []; const powersCards = [];
        if (POWERS) {
          // every named leader or claimant of a power (the powers lane's minted people among them): hidden whole, or field by field
          for (const c of people) { const card = (record.npcs || []).find((x) => veil.CARD_KINDS.npc.idOf(x) === c.id);
            const ranked = card && (Array.isArray(card.memberships) ? card.memberships.some((m) => isRec(m) && (m.rank === 1 || m.rank === 2)) : !!card.structuralRank);
            if (!ranked) continue;
            powersCards.push({ address: `card:npc:${c.id}`, hidden: true }); powersDeltas.push(...c.eyes.map((a) => ({ address: a, hidden: true }))); }
        }
        for (const mode of ['live', 'snapshot']) {
          const base = [['default', []], ['allShut', shut(m0.eyes)], ['opened', m0.defaults.map((a) => ({ address: a, hidden: false }))]];
          if (variant.startsWith('mutant')) base.splice(2, 1, [`rand0`, [...shut(m0.eyes.filter(() => r() < 0.5)), ...m0.defaults.filter(() => r() < 0.3).map((a) => ({ address: a, hidden: false }))]]);
          if (variant.startsWith('mutant') && mode === 'snapshot') base.length = 2;
          if (process.env.RV5_LEAN) base.length = 2; // the default veil and every eye shut (the powers arm and the members share follow)
          if (variant === 'salted' && !process.env.RV5_LEAN) {
            for (let k = 0; k < 2; k += 1) base.push([`rand${k}`, [...shut(m0.eyes.filter(() => r() < 0.4)), ...m0.defaults.filter(() => r() < 0.3).map((a) => ({ address: a, hidden: false }))]]);
            if (mode === 'live') for (const kind of Object.keys(veil.CARD_KINDS)) base.push([`only-${kind}`, shut(m0.cards.filter((c) => c.kind === kind).flatMap((c) => c.eyes))]);
          }
          if (POWERS) { base.push(['powers-fields', powersDeltas]); base.push(['powers-cards', powersCards]); out.powersCards = (out.powersCards || 0) + powersCards.length; }
          for (const [name, deltas] of base) shares.push({ name: `${name}/${dm ? 'dm' : 'pub'}/${mode}`, dm, mode, deltas, mo: {} });
          shares.push({ name: `members/${dm ? 'dm' : 'pub'}/${mode}`, dm, mode, deltas: memberDeltas, mo });
        }
        shares.push({ name: `unmarked/${dm ? 'dm' : 'pub'}/live`, dm, mode: null, deltas: [], mo: {} });
        if (variant === 'salted' && !process.env.RV5_LEAN) shares.push({ name: `narrated-allShut/${dm ? 'dm' : 'pub'}/live`, dm, mode: 'live', deltas: shut(m0.eyes), mo: {}, narrated: true });
      }

      T.model = (T.model || 0) + Date.now() - tModel;
      for (const sh of shares) {
        n += 1; out.shares += 1;
        const id = `abcd${String(SHARD[0]).padStart(4, '0')}-0000-0000-0000-${String(n).padStart(12, '0')}`;
        const slug = `p${TAG}${SHARD[0]}x${n}`; const link = `l${TAG}${SHARD[0]}x${n}`; const mapSlug = `m${TAG}${SHARD[0]}x${n}`;
        const ov = sh.mode === null ? { ...sh.mo } : veil.writeShareVeil(sh.mo, sh.deltas, sh.mode === 'snapshot'
          ? { mode: sh.mode, at: '2026-11-01T00:00:00.000Z', snapshot: veil.galleryPayloadFor(record, { shareDm: sh.dm, memberOverrides: sh.mo }) }
          : { mode: sh.mode, at: '2026-11-01T00:00:00.000Z' });
        const liveRow = sh.mode === 'snapshot' ? edited : record;
        const handHides = sh.deltas.filter((d) => d.hidden).length; out.handHides += handHides;
        const label = `${t.seed} ${variant} ${sh.name}`;
        const pages = {};
        for (const c of CHAINS) {
          const db = dbs[c.db];
          await db.query(`select set_config('test.uid', '', false)`);
          const tIns = Date.now();
          await db.query(`insert into public.settlements (id,user_id,name,tier,data,ai_data,gallery_share_narrated,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
            values ($1,$2,$3,$4,$5,$6,$7,true,$8,now(),$9,'unlisted',$10,$11,true)`, [id, OWNER, record.name || t.seed, t.cfg.settType,
            JSON.stringify(sh.narrated ? born : liveRow), sh.narrated ? JSON.stringify({ aiSettlement: liveRow }) : null, !!sh.narrated, slug, link, JSON.stringify(ov), sh.dm]);
          await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign) values (gen_random_uuid(),$1,'m',$2,true,$3,'map_with_campaign',true)`,
            [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), mapSlug]);
          T.insert = (T.insert || 0) + Date.now() - tIns;
          if (!SUBJECTS.includes(c.db)) {
            // a reference-only chain (203, production today): the deployed client's own gallery page, for the page-level differential
            H.db = db; H.uid = '';
            try { const d = await tm('page203', () => gallery.fetchPublicDossier(slug)); pages[c.db] = d ? tokensAndStrings(d.settlement) : null; } catch (e) { out.raised.push(`${c.db} ${label} page: ${String(e.message).slice(0, 160)}`); }
            continue;
          }
          // the chain's own unveiled projection of each read (its sanitiser, its DM-full strip, its member splice)
          const SRCX = `case when s.gallery_share_narrated and s.ai_data is not null and jsonb_typeof(s.ai_data -> 'aiSettlement') = 'object' then s.ai_data -> 'aiSettlement' else s.data end`;
          const src = `(select ${SRCX} from public.settlements s where s.id = $1)`;
          const copy = `(select case when s.gallery_member_overrides #>> '{$veil,mode}' = 'snapshot' and jsonb_typeof(s.gallery_member_overrides #> '{$veil,snapshot}') = 'object'
            then s.gallery_member_overrides #> '{$veil,snapshot}' else ${SRCX} end from public.settlements s where s.id = $1)`;
          const proj = async (srcSql, dm, forImport) => (await db.query(`select public._gallery_apply_member_overrides(
              case when $2 then public._gallery_dm_full_json(j) else public._gallery_sanitize_public_json(j) end, public._gallery_dm_full_json(j),
              (select gallery_member_overrides from public.settlements where id = $1), $2, true, $3) as d from (select ${srcSql} as j) x`, [id, dm, forImport])).rows[0].d;
          const refs = {}; const acts = {}; const rows = {};
          try {
            refs.gallery = await tm('ref', () => proj(copy, sh.dm, false));
            refs.import = await proj(copy, sh.dm, true);
            refs.link = (await db.query(`select public._gallery_apply_member_overrides(p, p, (select gallery_member_overrides from public.settlements where id = $1), false, true, false) as d
              from (select public._gallery_sanitize_public_json(${src}) as p) x`, [id])).rows[0].d;
            refs.map = (await db.query(`select public._gallery_sanitize_public_json(${copy}) as d`, [id])).rows[0].d;
          } catch (e) { out.raised.push(`${c.db} ${label} reference: ${String(e.message).slice(0, 200)}`); continue; }
          const call = async (key, sql, args, uid, pick) => {
            out.reads += 1;
            try { await db.query(`select set_config('test.uid', $1, false)`, [uid]); const rr = await db.query(sql, args); rows[key] = rr.rows[0] ?? null; acts[key] = rows[key] ? pick(rows[key]) : null;
              if (acts[key] == null) bump(out.noRow, `${c.db}:${key}`); } catch (e) { out.raised.push(`${c.db} ${label} ${key}: ${String(e.message).slice(0, 200)}`); }
          };
          await tm('reads', async () => { await call('gallery', 'select * from public.get_gallery_dossier($1)', [slug], '', (x) => x.data);
          await call('link', 'select public.get_unlisted_dossier($1) as x', [link], '', (x) => x.x?.dossier);
          await call('map', 'select public.get_gallery_map($1) as x', [mapSlug], '', (x) => x.x?.members?.[0]?.settlement);
          await call('import', 'select * from public.import_gallery_dossier($1)', [slug], READER, (x) => x.data); });
          const stored = veil.readShareVeil(ov);
          const tCmp = Date.now();
          for (const key of ['gallery', 'link', 'map', 'import']) {
            if (acts[key] == null || refs[key] == null) continue;
            const marked = stored.marked || key === 'link';
            const expd = marked ? veil.applyVeil(refs[key], veil.resolveVeil(veil.defaultVeilFor(refs[key]), stored.deltas)) : refs[key];
            const d = []; diff(JSON.parse(JSON.stringify(expd)), acts[key], '', d);
            for (const [kind, path, val] of d) {
              const k = `${c.db}:${key}:${kind}:${path}`; bump(out.diff, k);
              ex(k, `${label} :: ${JSON.stringify(val).slice(0, 220)}`);
            }
            // the tokens the reference removed, looked for in the WHOLE response row (every column)
            const hid = [...tokensOf(refs[key])].filter((x) => !tokensOf(expd).has(x));
            out.hiddenTokens += hid.length; bump(out.hidden, `${c.db}:${key}`, hid.length);
            const got = tokensOf(rows[key]);
            const cnt = (v) => { const m = new Map(); for (const x of JSON.stringify(v ?? null).match(TOKEN_RE) || []) m.set(x, (m.get(x) || 0) + 1); return m; };
            const cr = cnt(refs[key]); const ce = cnt(expd);
            for (const [tok, n0] of cr) { const n1 = ce.get(tok) || 0; if (n1 > 0 && n1 < n0 && got.has(tok)) { bump(out.secondHome, `${c.db}:${key}:${tok.split('~').slice(2, 3)}:${tok.split('~').slice(4, 5)}`);
              if ((out.secondHomeEx.length) < 12) { const at = []; const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [k2, v2] of Object.entries(v)) walk(v2, p ? `${p}.${k2}` : k2); else if (typeof v === 'string' && v.includes(tok)) at.push(p); }; walk(acts[key], ''); out.secondHomeEx.push({ share: label, read: key, tok, at: [...new Set(at)].slice(0, 4) }); } } }
            // a hidden power's name (plain, snake or slug) anywhere in a read that reveals nothing; a covert tie in one
            if (!(sh.dm && (key === 'gallery' || key === 'import')) && !Object.values(sh.mo).some((m) => m.revealDm === true)) {
              const text = JSON.stringify(rows[key]).toLowerCase();
              const hit = nameForms.filter((f) => text.includes(f));
              if (hit.length) { bump(out.hiddenPowerName, `${c.db}:${key}`); ex(`hiddenPowerName ${c.db}:${key}`, `${label} :: ${hit.slice(0, 3).join(' | ')}`); }
              const cov = (acts[key]?.relationships || []).filter((x) => isRec(x) && (x.covert === true || x.handler === true)).length;
              if (cov) { bump(out.covertTies, `${c.db}:${key}`, cov); ex(`covertTies ${c.db}:${key}`, label); }
            }
            const leaked = hid.filter((x) => got.has(x));
            if (leaked.length) out.tokenLeaks.push({ chain: c.db, read: key, share: label, n: leaked.length, tokens: leaked.slice(0, 6) });
            if (sh.mode === 'snapshot' && /RV5POST/.test(JSON.stringify(rows[key]))) bump(out.postFreeze, `${c.db}:${key}`);
            // what of the share travels beside the body
            const sv = key === 'gallery' ? rows.gallery.gallery_member_overrides : key === 'link' ? rows.link.x?.gallery_member_overrides : null;
            if (sv) {
              const bad = Object.entries(sv).filter(([k2, v2]) => (k2 === '$veil' ? Object.keys(v2).some((q) => !['v', 'mode', 'at', 'groupings'].includes(q)) || v2.v !== 2
                : !isRec(v2) || Object.keys(v2).some((q) => !['revealDm', 'allowImport'].includes(q)) || Object.values(v2).some((q) => typeof q !== 'boolean')));
              if (bad.length) { bump(out.served, `${c.db}:${key}:unexpected`); ex(`served ${c.db}:${key}`, `${label} :: ${JSON.stringify(bad).slice(0, 200)}`); }
            }
          }
          T.compare = (T.compare || 0) + Date.now() - tCmp;
          // the side's own page over this chain (its real read path), against the reference's strings
          H.db = db; H.uid = '';
          try {
            const d = await tm('page', () => gallery.fetchPublicDossier(slug));
            pages[c.db] = d ? tokensAndStrings(d.settlement) : null;
            if (d && refs.gallery) {
              const marked = stored.marked;
              const expd = marked ? veil.applyVeil(refs.gallery, veil.resolveVeil(veil.defaultVeilFor(refs.gallery), stored.deltas)) : refs.gallery;
              const hid = [...tokensOf(refs.gallery)].filter((x) => !tokensOf(expd).has(x));
              const onPage = hid.filter((x) => pages[c.db].tokens.has(x));
              if (onPage.length) out.tokenLeaks.push({ chain: c.db, read: 'gallery PAGE', share: label, n: onPage.length, tokens: onPage.slice(0, 6) });
            }
          } catch (e) { out.raised.push(`${c.db} ${label} page: ${String(e.message).slice(0, 160)}`); }
        }
        // the page-level differential: this side's page over each 211 chain against its page over the reference-only chain
        const refChain = CHAINS.find((c) => !SUBJECTS.includes(c.db));
        if (refChain && pages[refChain.db]) for (const c of CHAINS) {
          if (c === refChain || !pages[c.db]) continue;
          const more = [...pages[c.db].strings].filter((x) => !pages[refChain.db].strings.has(x));
          if (more.length) { bump(out.pageShowMore, `${c.db}`); bump(out.pageShowMore, `${c.db}:strings`, more.length); ex(`pageShowMore ${c.db}`, `${label} :: ${more.slice(0, 3).join(' | ').slice(0, 240)}`); }
        }
      }
    }
  }
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  for (const c of CHAINS) await dbs[c.db].end();
}, 14_400_000);

function tokensAndStrings(v) {
  const strings = new Set();
  const walk = (x) => { if (Array.isArray(x)) x.forEach(walk); else if (isRec(x)) Object.values(x).forEach(walk); else if (typeof x === 'string' && x.trim().length >= 6) strings.add(x); };
  walk(v);
  return { strings, tokens: tokensOf(v) };
}
