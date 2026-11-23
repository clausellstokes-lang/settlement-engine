/** @vitest-environment jsdom */
// V43-PAGES (brief docs/chair/2026-11-20/veil/briefs/V43-PAGES-BRIEF.md): WHAT A SHARED PAGE PRINTS, tab by tab. A MEASURE.
// A COPY of the census's renderer (scripts/census/page-census.render.census.jsx: its mocks, its matchMedia, its birth and
// stamp), rendering THE READ-ONLY VIEW THE GALLERY PAGE USES (PublicDossierView.jsx:118: <OutputContainer settlement readOnly
// playerView={!shareDm} publicChronicle>, so publicDossier = readOnly && !saveId), walked by the census's own walkDossier
// (imported, never copied); the restore loop's narrower walks use `walkOnly` below (walkDossier restricted to named views).
// THE HANDED RECORD: gallery.js :: sanitizeDossier's `settlement` for a served share: veilPublicPayload(rederiveForPage(
// projectServedVeil(<served>, <served marker>))). The twin's served body is projectShareVeil(galleryPayloadFor(...)).
// No JSX and every React-side import by absolute path into RV6_SRC (one React instance: the worktree's).
// Modes (PG_MODE): F (fidelity, censusPlan('r2', 1)) and N (never-there, tell-common.mjs :: pool(2), hiding towns only).
// Out: one JSON per birth in PG_OUT.
import { it, vi, expect } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock(`${process.env.RV6_SRC}/src/store/index.js`, () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: {}, isConfigured: false }));
vi.mock(`${process.env.RV6_SRC}/src/generators/aiLayer`, () => ({ runTemplateNarrative: vi.fn() }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

const SRC = process.env.RV6_SRC;
const MODE = process.env.PG_MODE || 'F';
const SHARD = (process.env.PG_SHARD || '0/1').split('/').map(Number);
const OUT = process.env.PG_OUT;
const PICK = Number(process.env.PG_PICK || 1); // every PICK-th row of the plan (the cost run)
const SS = Number(process.env.PG_SERVER_EVERY || 24); // (F) the server sample: every SS-th birth of the plan
const RESTORE = process.env.PG_RESTORE !== '0';
const RESTORE_EVERY = Number(process.env.PG_RESTORE_EVERY || 1); // (F) the restore loop on every k-th birth of the plan only (the split)
const clone = (v) => JSON.parse(JSON.stringify(v));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

/** The census's walk, restricted to the views named in `only` (the restore loop's re-reads). */
async function walkOnly(container, only, { fireEvent, waitFor }) {
  const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
  const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
  await waitFor(() => expect(groupTabs().length).toBeGreaterThan(0));
  const { linesOf } = globalThis.__pg;
  const views = {};
  for (let g = 0; g < groupTabs().length; g++) {
    const groupName = (groupTabs()[g].textContent || '').trim();
    if (![...only].some((v) => v.startsWith(`${groupName}/`))) continue;
    fireEvent.click(groupTabs()[g]);
    await waitFor(() => expect(subTabs().length).toBeGreaterThan(0));
    for (let i = 0; i < subTabs().length; i++) {
      const tab = subTabs()[i]; const tabName = (tab.textContent || '').trim(); const id = (tab.id || '').replace(/^sf-tab-/, '');
      const name = `${groupName}/${tabName}`;
      if (!only.has(name)) continue;
      fireEvent.click(tab);
      try {
        await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); expect(p).toBeTruthy(); expect((p?.textContent || '').length).toBeGreaterThan(15); }, { timeout: 10000 });
      } catch { /* an empty panel is read as it is */ }
      const panel = container.querySelector(`#sf-panel-${id}`);
      if (!panel) { views[name] = ['[NO PANEL]']; continue; }
      const seen = new Set(); const acc = [];
      const snap = () => { for (const l of linesOf(panel)) if (!seen.has(l)) { seen.add(l); acc.push(l); } };
      const disclosures = () => [...panel.querySelectorAll('[aria-expanded]')].filter((e) => !e.hasAttribute('aria-haspopup'));
      for (let pass = 0; pass < 4; pass++) {
        const closed = disclosures().filter((e) => e.getAttribute('aria-expanded') === 'false');
        if (!closed.length) break;
        for (const e of closed) fireEvent.click(e);
      }
      snap();
      const n = disclosures().length;
      for (let k = 0; k < n; k++) {
        const e = disclosures()[k];
        if (!e || e.getAttribute('aria-expanded') !== 'false') continue;
        fireEvent.click(e);
        if (e.getAttribute('aria-expanded') === 'true') snap();
      }
      views[name] = acc;
    }
  }
  return views;
}

/** Line diff of one tab (LCS): unpaired deletions LOST, unpaired insertions GAINED, a hunk's i-th deletion and i-th insertion CHANGED. */
function diffLines(A, B) {
  const n = A.length; const m = B.length; const W = m + 1;
  const dp = new Uint32Array((n + 1) * W);
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i * W + j] = A[i] === B[j] ? dp[(i + 1) * W + j + 1] + 1 : Math.max(dp[(i + 1) * W + j], dp[i * W + j + 1]);
  // the hunks (a run of deletions and insertions between two equal lines), unpaired
  const hunks = []; let dels = []; let ins = [];
  const flush = () => { if (dels.length || ins.length) hunks.push({ dels, ins }); dels = []; ins = []; };
  let i = 0; let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) { flush(); i++; j++; }
    else if (j < m && (i === n || dp[i * W + j + 1] >= dp[(i + 1) * W + j])) ins.push(B[j++]);
    else dels.push(A[i++]);
  }
  flush();
  const out = { lost: [], gained: [], changed: [], moved: [] };
  const L = hunks.flatMap((h, x) => h.dels.map((t) => ({ t, x, used: false }))); const G = hunks.flatMap((h, x) => h.ins.map((t) => ({ t, x, used: false })));
  // 1. MOVED: the same text on both sides at another place (an order change, not a text change)
  for (const l of L) { const g = G.find((y) => !y.used && y.t === l.t); if (g) { l.used = true; g.used = true; out.moved.push(l.t); } }
  // 2. THE SAME BLOCK: a lost and a gained line that open on the same label (a common prefix of at least 12 characters,
  //    the longest first, anywhere in the tab: a disclosure's order can part them) are one line whose text moved: CHANGED
  const pre = (x, y) => { let k = 0; while (k < x.length && k < y.length && x[k] === y[k]) k++; return k; };
  for (;;) {
    let best = null;
    for (const l of L) if (!l.used) for (const g of G) if (!g.used) { const k = pre(l.t, g.t); if (k >= 12 && (!best || k > best[2])) best = [l, g, k]; }
    if (!best) break;
    best[0].used = true; best[1].used = true; out.changed.push([best[0].t, best[1].t]);
  }
  // 3. THE SAME PLACE: what is left of one hunk pairs by order (CHANGED); the rest is LOST or GAINED
  hunks.forEach((_h, x) => {
    const ls = L.filter((l) => l.x === x && !l.used); const gs = G.filter((g) => g.x === x && !g.used); const k = Math.min(ls.length, gs.length);
    for (let y = 0; y < k; y++) out.changed.push([ls[y].t, gs[y].t]);
    out.lost.push(...ls.slice(k).map((l) => l.t)); out.gained.push(...gs.slice(k).map((g) => g.t));
  });
  return out;
}
/** Every tab's diff (views of `a` against `b`); `only` limits the tabs read. A tab one side lacks reads as all lost / gained. */
function diffViews(a, b, only = null) {
  const out = {};
  for (const t of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (only && !only.has(t)) continue;
    const d = diffLines(a[t] || [], b[t] || []);
    if (!(t in a)) d.tabGained = true; if (!(t in b)) d.tabLost = true;
    if (d.lost.length || d.gained.length || d.changed.length || d.moved.length) out[t] = d;
  }
  return out;
}
const itemsOf = (dv) => Object.entries(dv).flatMap(([t, d]) => [...d.lost.map((l) => `${t}\u0001L\u0001${l}`), ...d.gained.map((l) => `${t}\u0001G\u0001${l}`), ...d.changed.map(([x, y]) => `${t}\u0001C\u0001${x}\u0001${y}`)]);

it(`V43-PAGES (${MODE}) shard ${SHARD.join('/')}`, async () => {
  mkdirSync(OUT, { recursive: true });
  const viewport = { matches: false, listeners: new Set() };
  window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });
  const React = await import(`${SRC}/node_modules/react/index.js`);
  const { render, fireEvent, waitFor, cleanup } = await import(`${SRC}/node_modules/@testing-library/react/dist/index.js`);
  const W = await import(`${SRC}/tests/components/pageCensusWalk.shared.mjs`);
  globalThis.__pg = { linesOf: W.linesOf };
  const { default: OutputContainer } = await import(`${SRC}/src/components/OutputContainer.jsx`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { toPublicSafe, veilPublicPayload } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const GV = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { rederiveForPage } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const { withholdAlways, restampServedMemberships } = await import(`${SRC}/src/domain/display/galleryWithholdAlways.js`);
  const { governanceAccountRead } = await import(`${SRC}/src/components/new/powerDeskRead.js`);
  const { deriveDailyLife, DAILY_LIFE_SLOTS } = await import(`${SRC}/src/domain/dailyLife.js`);
  const { loadEngine, loadVeil, OPEN, AT } = await import(`${SRC}/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs`);
  const { signatureOf } = await import(`${SRC}/docs/chair/2026-11-20/veil/out/v27/tell2/measure/tell2-signature.mjs`);
  const { hasMarketInstitution } = await import(`${SRC}/src/domain/facts/market.js`);
  await loadGenerationLawPayloads();
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);

  // ── the page: the gallery visitor's store (anonymous, owns nothing), the read-only container
  const renderViews = async (doc, playerView, only = null) => {
    mocks.store = { ...W.storeFor(doc, vi.fn), savedSettlements: [], auth: { tier: 'anon' } };
    const { container, unmount } = render(React.createElement(OutputContainer, { settlement: doc, readOnly: true, playerView, publicChronicle: null }));
    try { return only ? await walkOnly(container, only, { fireEvent, waitFor }) : await W.walkDossier(container, { fireEvent, waitFor, expect }); }
    finally { unmount(); cleanup(); }
  };
  /** gallery.js :: sanitizeDossier's settlement for a served share (served marker: the body's own groupings). */
  const markerOf = (body) => ({ [GV.VEIL_OVERRIDE_KEY]: { v: GV.VEIL_LIMITS.servedVersion, mode: 'live', at: AT.at, groupings: Array.isArray(body?.galleryVeil?.hidden) ? body.galleryVeil.hidden : [] } });
  const preOf = (body) => GV.projectServedVeil(body, markerOf(body));
  const pageOf = (pre) => veilPublicPayload(rederiveForPage(clone(pre), { unveiled: false }));
  /** The server read as gallery.js maps it (partyLink false). */
  const pageOfRow = (row) => {
    const served = GV.isServedVeil(row.ov);
    const doc = served ? row.data : toPublicSafe(restampServedMemberships(row.data), { full: false, memberOverrides: row.ov });
    return veilPublicPayload(rederiveForPage(GV.projectServedVeil(doc, row.ov), { unveiled: !served && !GV.readShareVeil(row.ov).marked }));
  };
  // ── THE HAND MARKER WITH EVERYTHING SHOWN: tell2.probe.jsx :: showAll's 'allShown' (the switch's "Show everything criminal"
  // and every hideable house's card shown) PLUS every address of the one default veil (defaultVeilFor) opened
  const allShown = (doc, dm) => {
    const sc = V.screen(doc, dm);
    const cards = (doc.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => ({ address: `card:institution:${V.veil.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
    const crim = V.sw.setCriminalVeil(V.opened(OPEN), sc.defaults, false, sc.present, sc.model);
    const defs = sc.defaults.map((d) => ({ address: typeof d === 'string' ? d : d.address, hidden: false }));
    return [...crim, ...defs, ...cards];
  };
  // ── THE ALWAYS-PASS'S KEYS (galleryWithholdAlways.js :: withholdAlways, one key per minusAt / eachMinusAt call), publicProse,
  // and 'other:<top-level key>' for any other difference (the re-key and the veil's other passes)
  const KEYS = [
    ['conditions.severity', { each: ['activeConditions'], keys: ['severity'] }],
    ['defence.readiness.score', { obj: ['defenseProfile', 'readiness'], keys: ['score'] }],
    ['defence.scores', { obj: ['defenseProfile', 'scores'], keys: ['disaster', 'economic', 'internal', 'magical', 'military', 'monster'] }],
    ['defence.economicGates', { obj: ['defenseProfile'], keys: ['economicGates'] }],
    ['compound', { obj: ['economicState', 'compound'], keys: ['criminalEffective', 'criminalPreStress', 'economyOutput', 'magicInfluence', 'militaryEffective', 'religionInfluence'] }],
    ['safety.compound', { obj: ['economicState', 'safetyProfile', 'compound'], keys: ['criminalEffective', 'criminalPreStress', 'economyOutput', 'magicInfluence', 'militaryEffective', 'religionInfluence'] }],
    ['food.storage', { obj: ['economicState', 'foodSecurity'], keys: ['storageMonths', 'storageNote'] }],
    ['income.weight', { each: ['economicState', 'incomeSources'], keys: ['weight'] }],
    ['economy.situationDesc', { obj: ['economicState'], keys: ['situationDesc'] }],
    ['safety.capture/ratio/crimeTypes', { obj: ['economicState', 'safetyProfile'], keys: ['blackMarketCapture', 'safetyRatio', 'crimeTypes'] }],
    ['safety.flags', { obj: ['economicState', 'safetyProfile', 'flags'], keys: ['anyActive', 'arcaneBlackMarket', 'merchantArmy', 'religiousFraud', 'merchantCriminalBlur'] }],
    ['history.timeline.anchored/year', { each: ['history', 'eventsTimeline'], keys: ['anchored', 'year'] }],
    ['history.event.anchored', { each: ['history', 'historicalEvents'], keys: ['anchored'] }],
    ['history.legacy/siegeNarrative', { obj: ['history'], keys: ['legacyAnnotations', 'siegeNarrative'] }],
    ['npcs.stressNote', { each: ['npcs'], keys: ['stressNote'] }],
    ['npcs.memberships.veiled', { custom: 'memberships' }],
    ['power.fingerprint', { obj: ['powerStructure'], keys: ['economyInputFingerprint'] }],
    ['power.recentConflict', { custom: 'recentConflict' }],
    ['power.factions.niche/rawPower/legitimacyCrisis', { each: ['powerStructure', 'factions'], keys: ['contestsNiche', 'rawPower', 'legitimacyCrisis'] }],
    ['power.relation.ratio', { each: ['powerStructure', 'factionRelationships'], keys: ['ratio'] }],
    ['legitimacy.breakdown', { obj: ['powerStructure', 'publicLegitimacy', 'breakdown'], keys: ['prosperity', 'safety', 'defense'] }],
    ['legitimacy.multipliers/flags', { obj: ['powerStructure', 'publicLegitimacy'], keys: ['crimMultiplier', 'govMultiplier', 'isApproved', 'isContested', 'isEndorsed', 'isTolerated', 'governanceFractured', 'isLegitimacyCrisis'] }],
    ['power.stability', { obj: ['powerStructure'], keys: ['stability'] }],
    ['prose.economy.aliases', { custom: 'proseAliases' }],
    ['prose.glance', { custom: 'proseGlance' }],
    ['spatial.quarters', { obj: ['spatialLayout'], keys: ['quarters'] }],
    ['cast', { custom: 'cast' }],
  ];
  const at = (d, path) => { let v = d; for (const k of path) { if (!isRec(v)) return undefined; v = v[k]; } return v; };
  const idOfEl = (e) => (isRec(e) ? String(e.id ?? e.name ?? e.faction ?? e.title ?? e.type ?? '') : '');
  const pairEach = (src, dst) => { // dst element -> its src counterpart (same identity, else the same index where the lists match in length)
    const byId = new Map(); for (const e of src) if (isRec(e) && idOfEl(e)) byId.set(idOfEl(e), e);
    return dst.map((e, i) => (isRec(e) && byId.has(idOfEl(e)) ? byId.get(idOfEl(e)) : (src.length === dst.length ? src[i] : undefined)));
  };
  const setKeys = (dst, src, keys) => { if (!isRec(dst)) return; for (const k of keys) { if (isRec(src) && k in src) dst[k] = clone(src[k]); else delete dst[k]; } };
  /** Restore one key into `d` (in place) from `src`. */
  const restore = (d, src, key) => {
    if (key === 'publicProse') { if ('publicProse' in src) d.publicProse = clone(src.publicProse); else delete d.publicProse; return d; }
    if (key.startsWith('other:')) {
      const top = key.slice(6); const keep = clone(d);
      if (top in src) d[top] = clone(src[top]); else delete d[top];
      for (const [k, spec] of KEYS) if (topsOf(spec).includes(top)) restore(d, keep, k); // the always-pass's own keys stay as served
      return d;
    }
    const spec = Object.fromEntries(KEYS)[key];
    if (spec.obj) { const dst = at(d, spec.obj); if (isRec(dst)) setKeys(dst, at(src, spec.obj), spec.keys); return d; }
    if (spec.each) { const dl = at(d, spec.each); const sl = at(src, spec.each); if (Array.isArray(dl) && Array.isArray(sl)) pairEach(sl, dl).forEach((s, i) => setKeys(dl[i], s, spec.keys)); return d; }
    if (spec.custom === 'memberships') { if (Array.isArray(d.npcs) && Array.isArray(src.npcs)) pairEach(src.npcs, d.npcs).forEach((s, i) => { const dm = d.npcs[i]?.memberships; const sm = s?.memberships; if (Array.isArray(dm) && Array.isArray(sm)) pairEach(sm, dm).forEach((x, j) => setKeys(dm[j], x, ['veiled'])); }); return d; }
    if (spec.custom === 'recentConflict') { setKeys(d.powerStructure, src.powerStructure, ['recentConflict']); setKeys(d, src, ['pressureSentence']); return d; }
    if (spec.custom === 'proseAliases') { for (const b of ['economy:daily_life', 'economy:resources', 'economy:services']) setKeys(at(d, ['publicProse', 'blocks', b]), at(src, ['publicProse', 'blocks', b]), ['incomeWeight', 'shadowEconomy']); return d; }
    if (spec.custom === 'proseGlance') { for (const p of [['economy:economics', 'prosperityHeader'], ['economy:economics', 'prosperityRung'], ['stressors:overview', 'conditionSeverity']]) setKeys(at(d, ['publicProse', 'blocks', ...p]), at(src, ['publicProse', 'blocks', ...p]), ['glance']); return d; }
    if (spec.custom === 'cast') { for (const k of ['stress', 'stressors']) { const dv = d[k]; const sv = src[k]; if (isRec(dv) && isRec(sv)) setKeys(dv, sv, ['cast']); else if (Array.isArray(dv) && Array.isArray(sv)) pairEach(sv, dv).forEach((s, i) => setKeys(dv[i], s, ['cast'])); } return d; }
    return d;
  };
  function topsOf(spec) { if (spec.obj) return [spec.obj[0]]; if (spec.each) return [spec.each[0]]; return { memberships: ['npcs'], recentConflict: ['powerStructure', 'pressureSentence'], proseAliases: ['publicProse'], proseGlance: ['publicProse'], cast: ['stress', 'stressors'] }[spec.custom]; }
  /** The keys whose values differ between `a` (P0) and `b` (P1). */
  const candidates = (a, b) => {
    const out = [];
    for (const [k] of KEYS) { const ra = restore(clone(b), a, k); if (JSON.stringify(ra) !== JSON.stringify(b)) out.push(k); }
    if (JSON.stringify(a.publicProse) !== JSON.stringify(b.publicProse)) out.push('publicProse');
    const sa = withholdAlways(clone(a)); const sb = withholdAlways(clone(b));
    for (const t of new Set([...Object.keys(sa), ...Object.keys(sb)])) if (t !== 'publicProse' && JSON.stringify(sa[t]) !== JSON.stringify(sb[t])) out.push(`other:${t}`);
    return out;
  };
  // ── the owner-only Daily Life slot: its text (the owner's derivation of the raw record) printed? its key served?
  const dmSlotOf = (raw, page, views) => {
    const dmText = String(deriveDailyLife(raw, { audience: 'owner' }).slots?.commoner_resentments_dm?.text ?? '').trim();
    const pub = deriveDailyLife(page, null).slots;
    const publicTexts = DAILY_LIFE_SLOTS.map((k) => String(pub?.[k]?.text ?? '').trim());
    const printed = dmText.length > 3 && !publicTexts.includes(dmText) && Object.values(views).some((ls) => ls.some((l) => l.includes(dmText)));
    return { dmText: dmText || null, printed, slotKey: 'commoner_resentments_dm' in (pub || {}), docKey: JSON.stringify(page).includes('commoner_resentments_dm') };
  };
  const govOf = (page, views) => {
    const text = String(governanceAccountRead(page, { publicDossier: true, playerView: true })?.text ?? '');
    const power = Object.entries(views).filter(([k]) => /\/Power$/.test(k)).flatMap(([, ls]) => ls);
    return { text, inPage: !!text && power.some((l) => l.includes(text)) };
  };
  const dailyOf = (page) => { const s = deriveDailyLife(page, null).slots; return Object.fromEntries(DAILY_LIFE_SLOTS.map((k) => [k, String(s?.[k]?.text ?? '')])); };

  // ── the server (local cluster only), one database per shard, prefix v43x
  let db = null; let nrow = 0;
  const openDb = async () => {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const dbn = `${process.env.PG_DB}_${SHARD[0]}`; if (!/^v43x/.test(dbn)) throw new Error(`database prefix must be v43x: ${dbn}`);
    if (process.env.PGHOST !== '/var/tmp/rv7') throw new Error(`local cluster only: ${process.env.PGHOST}`);
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.PG_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
    return { pg, dbn };
  };
  const server = async (rec, dm, ov) => { // tell2.probe.jsx :: server, returning the row's overrides beside its data
    nrow += 1; const id = `abcd7f6${SHARD[0]}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `pg${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const r = (await db.query('select to_jsonb(g.data) d, g.gallery_member_overrides o, g.chronicle c from public.get_gallery_dossier($1) g', [sl])).rows[0];
    await db.query('delete from public.settlements where id = $1', [id]);
    return r ? { data: r.d, ov: r.o, chronicle: r.c } : null;
  };

  if (MODE === 'F') {
    // PG_ONLY=<seed,...>: those births alone, the restore loop on each (the chair's N103: a kind the sampled births do not key)
    const ONLY = process.env.PG_ONLY ? new Set(process.env.PG_ONLY.split(',').filter(Boolean)) : null;
    const plan = W.censusPlan(W.BANKED_PREFIX, 1).map((r, i) => ({ ...r, i })).filter((r) => (ONLY ? ONLY.has(r.seed) : r.i % PICK === 0)).filter((_, k) => k % SHARD[1] === SHARD[0]);
    let dbInfo = null;
    for (const row of plan) {
      const t = { start: Date.now() }; const rec0 = { seed: row.seed, size: row.size, crisis: row.crisis, i: row.i };
      try {
        let town = generateSettlementPipeline(W.configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
        town = withPublicProse(town, composePublicProse(town));
        const rec = clone(town); t.birth = Date.now() - t.start;
        const P0 = toPublicSafe(clone(rec));
        const deltas = allShown(rec, false); const ov = V.write(deltas);
        const hiddenLeft = [...GV.resolveVeil(GV.defaultVeilFor(GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: ov })), deltas)].filter((a) => !String(a).startsWith(GV.VEIL_EXCEPTION_PREFIX));
        const twin = V.twin(rec, false, ov); const pre = preOf(twin); const P1 = pageOf(pre);
        let s0 = Date.now(); const v0 = await renderViews(P0, true); t.r0 = Date.now() - s0;
        s0 = Date.now(); const v1 = await renderViews(P1, true); t.r1 = Date.now() - s0;
        const dv = diffViews(v0, v1); const items = itemsOf(dv);
        const out = { ...rec0, hiddenLeft, lines: { P0: Object.values(v0).reduce((a, l) => a + l.length, 0), P1: Object.values(v1).reduce((a, l) => a + l.length, 0) }, tabs: { P0: Object.keys(v0), P1: Object.keys(v1) }, diff: dv,
          gov: { P0: govOf(P0, v0), P1: govOf(P1, v1) }, dm: dmSlotOf(rec, P1, v1), restoredBy: {}, cands: [], renders: 2, restored: false };
        if (RESTORE && items.length && (ONLY || row.i % RESTORE_EVERY === 0)) {
          const cands = candidates(P0, P1); out.cands = cands; out.restored = true;
          const only = new Set(Object.keys(dv)); s0 = Date.now();
          for (const k of cands) {
            const Pk = pageOf(restore(clone(pre), P0, k));
            const vk = await renderViews(Pk, true, only); out.renders += 1;
            const still = new Set(itemsOf(diffViews(v0, vk, only)));
            for (const it of items) if (!still.has(it)) (out.restoredBy[it] ||= []).push(k);
          }
          t.restore = Date.now() - s0;
        }
        if (SS && row.i % SS === 0) {
          if (!db) dbInfo = await openDb();
          s0 = Date.now(); const r = await server(rec, false, ov);
          if (!r) out.server = { error: 'no row' };
          else {
            const Ps = pageOfRow(r); const vs = await renderViews(Ps, true); const ds = diffViews(v1, vs); out.renders += 1;
            out.server = { served: GV.isServedVeil(r.ov), chronicle: Array.isArray(r.chronicle) ? r.chronicle.length : r.chronicle, differ: itemsOf(ds).length, diff: ds, sameDoc: JSON.stringify(Ps) === JSON.stringify(P1), dm: dmSlotOf(rec, Ps, vs) };
          }
          t.server = Date.now() - s0;
        }
        out.ms = { ...t, total: Date.now() - t.start }; delete out.ms.start;
        writeFileSync(`${OUT}/F-${row.seed}.json`, JSON.stringify(out));
      } catch (e) { writeFileSync(`${OUT}/F-${row.seed}.json`, JSON.stringify({ ...rec0, error: String(e?.stack || e) })); }
    }
    if (db) { await db.end(); const ad = new dbInfo.pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await ad.connect(); await ad.query(`drop database if exists ${dbInfo.dbn} with (force)`); await ad.end(); }
  } else if (MODE === 'N') {
    const hiding = []; for (const b of E.pool(2, [0, 1])) hiding.push(b);
    let k = 0;
    for (const b of hiding) {
      const t0 = Date.now(); const A = E.birth(b.cfg, b.seed, null);
      const held = (A.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => h.name);
      if (!held.length) continue;
      k += 1; if ((k - 1) % PICK !== 0 || ((k - 1) / PICK) % SHARD[1] !== SHARD[0]) continue;
      const rec0 = { seed: b.seed, size: b.size, crisis: b.crisis, held };
      try {
        const Bt = E.birth(b.cfg, b.seed, (h) => E.isHideableHouse(h));
        const out = { ...rec0, reads: {} };
        for (const dm of [false, true]) {
          const pages = {};
          for (const [form, doc] of [['A', A], ['B', Bt]]) {
            const ov = V.write(V.settings(doc, dm).deltas.own); const twin = V.twin(doc, dm, ov); const P = pageOf(preOf(twin));
            const views = await renderViews(P, !dm);
            pages[form] = { views, P, sig: form === 'B' ? signatureOf(twin, E.isHideableHouse, hasMarketInstitution).sig : undefined, daily: dailyOf(P), dmSlot: dmSlotOf(doc, P, views),
              dailyView: Object.entries(views).find(([v]) => /\/Daily Life$/.test(v))?.[1] ?? null };
          }
          out.reads[dm ? 'dm' : 'off'] = { diff: diffViews(pages.B.views, pages.A.views), sigB: pages.B.sig, daily: { A: pages.A.daily, B: pages.B.daily, viewA: pages.A.dailyView, viewB: pages.B.dailyView },
            dmSlot: { A: pages.A.dmSlot, B: pages.B.dmSlot }, lines: { A: Object.values(pages.A.views).reduce((a, l) => a + l.length, 0), B: Object.values(pages.B.views).reduce((a, l) => a + l.length, 0) } };
        }
        out.ms = Date.now() - t0;
        writeFileSync(`${OUT}/N-${b.seed}.json`, JSON.stringify(out));
      } catch (e) { writeFileSync(`${OUT}/N-${b.seed}.json`, JSON.stringify({ ...rec0, error: String(e?.stack || e) })); }
    }
  }
}, 14_400_000);
