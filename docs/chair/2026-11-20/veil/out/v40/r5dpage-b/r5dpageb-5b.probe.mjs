// R5D-PAGE-B (VEIL-40, chain A), PHASE 1: ITEM 5b's MEASURE (briefs/R5D-PAGE-B-BRIEF.md, "PHASE 1"; ruling 107 (3)). A MEASURE: it
// changes nothing in src, supabase, the twin or a shipped test. Run by run.sh in this directory:
//   RV6_SRC=<worktree> RV9_PROBE=<this file> R5DPB_OUT=<ndjson> R5DPB_POOL=A|C6 R5DPB_SHARD=<i>/<k> [R5DPB_SEEDS=<a,b>] [R5DPB_LIMIT=<n>]
//   npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs --maxWorkers=1      (from the worktree: bootChain reads its migrations)
// THE PLACES (each recipe as its test makes it, byte for byte):
//   A's born pool, `R5DP_POOL=full` (tests/security/galleryVeilDesc.pglite.test.js :: poolOf): 140 births `r3m-<size>-<crisis>-<k>-<idx>`,
//     publicProse deleted (its recipe);
//   R5-RECENT's pool, `R5C6_POOL=full` (tests/security/galleryVeilRecent.pglite.test.js :: poolSeeds/poolOf): 480 births
//     `r5c2-m3{,b}-<size>-<i>`, as born (its recipe keeps whatever the birth carries);
//   act T on jp6-city-8 (galleryVeilDesc :: poolOf's recipe: the first non-governing unveiled power hidden by the DM takes the seat).
//   NOT RUN: the stored today-born pool (phase 2's, item 5c: not yet made).
// PER PLACE (pools):
//   EVERY READ is at the owner's own setting with every criminal grouping open AND every house card and field SHOWN (galleryVeilDesc
//     :: settingsOf's `shown`), so the only hide on a read is the hand's (and the rule's). Births are made FIRST, the whole pool in
//     its recipe's order in one process per pool (A's pool then act T; R5-RECENT's pool alone), the shard's kept.
//   OPEN: the born record read so, Reveal off and DM, both engines (212 on a
//     pglite chain of every migration on disk; the twin, projectShareVeil over galleryPayloadFor), both doors (the gallery page's
//     served document; the import's): each engine-door read that HIDES NOTHING (galleryVeilDesc :: hidesNothing) emits its served
//     roster (each uncut row: name, kind, base = the served desc's standing cut by the JS reference cut, the stored record's
//     contestsNiche and host joined by name). Q2's index.
//   RIVALS: every stored row with `contestsNiche` (resizePoliticalRoster's mint); its host = the other row whose seatKey is the
//     niche (galleryVeilDesc :: handHidesOf's rule, hidden or not); its template: T12.<row> where its stored base is a
//     RIVAL_DESC_OF_HOST row's text (rivalRows.mjs), else T13 (the mint's copy).
//   HAND HIDES: per distinct host, the record with that host hidden BY HAND (`hidden: true`, as A's hand hides plant it); act T's
//     record as it stands (its taker hidden) and, on it, each other host hidden by hand. Each record read Reveal off and DM, both
//     engines, both doors, BESIDE the same place with the withheld powers and houses NEVER THERE (galleryVeilDesc :: neverThere,
//     copied: it DELETES the withheld rows, their relations and tension parties from the record, and on the player view masks a
//     name the owner hid as the projection does; so a rival's copied base is KEPT on the never-there place BY CONSTRUCTION).
//     Q1: the rival's served base (and page desc, base + S) hiding vs never there.
//     Q3: every case form of each withheld power's name in every served string (keys excluded), hiding and never there.
//     The free differential: every served power's base and page desc, hiding vs never there.
import { it, expect } from 'vitest';
import { appendFileSync, writeFileSync } from 'node:fs';

const W = process.env.RV6_SRC;
const OUT = process.env.R5DPB_OUT;
const SH = /^(\d+)\/(\d+)$/.exec(process.env.R5DPB_SHARD || '0/1');
const LIMIT = Number(process.env.R5DPB_LIMIT || 0);
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
const emit = (o) => appendFileSync(OUT, `${J(o)}\n`);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const AT = '2026-11-01T00:00:00.000Z';
const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
const P_SIZES = Object.freeze(['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']);
const P_CRISES = Object.freeze(['none', 'infiltrated', 'none', 'insurgency', 'occupied', 'indebted', 'none', 'under_siege', 'wartime', 'politically_fractured']);
const C6_SIZES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/** Every case form of a name (Q3): the stems (the name; its bare form, a bracketed qualifier dropped; without a leading "The";
 * its singular, where the name is a plural), searched WITHOUT REGARD TO CASE with an optional leading "the " and an optional
 * plural or possessive ending; each hit classed by its EXACT form. */
function formSearch(N) {
  const stems = [['name', N]];
  const bare = N.replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (bare && bare !== N) stems.push(['bare', bare]);
  for (const [, s] of [...stems]) if (/^the\s+/i.test(s)) stems.push(['no-article', s.replace(/^the\s+/i, '')]);
  for (const [, s] of [...stems]) {
    const sing = /ies$/i.test(s) ? s.replace(/ies$/i, 'y') : /(ss|x|ch|sh)es$/i.test(s) ? s.replace(/es$/i, '') : /[^s]s$/i.test(s) ? s.slice(0, -1) : null;
    if (sing && sing.length > 2) stems.push(['singular', sing]);
  }
  const uniq = [...new Map(stems.filter(([, s]) => s.length > 2).map(([k, s]) => [s.toLowerCase(), [k, s]])).values()].sort((a, b) => b[1].length - a[1].length);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(the\\s+)?(${uniq.map(([, s]) => esc(s)).join('|')})('s|’s|'|’|es|s)?(?![\\p{L}\\p{N}])`, 'giu');
  const sentence = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return (text) => {
    const out = [];
    for (const m of String(text).matchAll(re)) {
      const core = m[2];
      const st = uniq.find(([, s]) => s.toLowerCase() === core.toLowerCase().replace(/\s+/g, ' ')) || ['?', core];
      const s = st[1];
      const cs = core === s ? 'exact' : core === s.toLowerCase() ? 'lower' : core === sentence(s) ? 'sentence' : core === s.toUpperCase() ? 'upper' : 'mixed';
      const suf = m[3] || '';
      const morph = !suf ? '' : /^(es|s)$/i.test(suf) ? 'plural' : 'possessive';
      const art = m[1] ? 'the' : '';
      out.push({ form: [st[0], cs, morph, art].filter(Boolean).join('+'), text: m[0], at: m.index });
    }
    return out;
  };
}

it('R5D-PAGE-B phase 1: item 5b measure (Q1, Q2, Q3) over the full pools and act T, both engines, both doors, Reveal off and DM', async () => {
  expect(OUT, 'R5DPB_OUT').toBeTruthy();
  writeFileSync(OUT, '');
  const t0 = Date.now();
  const { PGlite } = await import('@electric-sql/pglite');
  const { pgcrypto } = await import('@electric-sql/pglite/contrib/pgcrypto');
  const { bootChain, BIRTH_DIALS, OWNER } = await import(`${W}/tests/security/veilChain.shared.mjs`);
  const { HIDDEN_POWER_MASK } = await import(`${W}/src/domain/display/publicSafe.js`);
  const { isHideableHouse, isVeiledPower } = await import(`${W}/src/domain/people/cardVeil.js`);
  const { seatKey } = await import(`${W}/src/domain/density/seatKey.js`);
  const { compileRows, cutDesc, readTable } = await import(`${W}/scripts/veil/standingForms.mjs`);
  const { t12RowOfText, t12RowOfHost } = await import(`${W}/docs/chair/2026-11-20/veil/out/v40/r5dpage-b/rivalRows.mjs`);
  const veil = await import(`${W}/src/domain/display/galleryVeil.js`);
  const page = await import(`${W}/src/domain/veil/pageRederive.js`);
  const imp = await import(`${W}/src/domain/veil/importRederive.js`);
  const rd = { page: page.rederiveForPage, served: imp.rederiveServed };
  const { generateSettlementPipeline } = await import(`${W}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${W}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${W}/src/store/configSlice.js`);
  const { transferRulingPower } = await import(`${W}/src/domain/rulingPower.js`);
  await loadGenerationLawPayloads();

  const ROWS = compileRows(readTable().forms);
  const baseOf = (desc) => (typeof desc === 'string' ? (cutDesc(desc, ROWS)?.base ?? desc) : null);
  const nameOf = (f) => (isRec(f) ? String(f.faction ?? f.name ?? '') : '');
  const isMasked = (f) => isRec(f) && (f.faction === HIDDEN_POWER_MASK || f.name === HIDDEN_POWER_MASK);
  const isCut = (f) => isRec(f) && (f.hidden === true || isMasked(f));
  const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);
  const withheldOf = (stored, d) => {
    const served = new Set(listsOf(d).filter((f) => !isCut(f)).map(nameOf).filter(Boolean));
    const out = new Set();
    for (const f of listsOf(stored)) { const n = nameOf(f); if (n && !served.has(n)) out.add(n); }
    return [...out];
  };
  const hidesNothing = (stored, d) => !withheldOf(stored, d).length && !listsOf(d).some(isCut)
    && arr(stored.institutions).every((h) => arr(d?.institutions).some((x) => isRec(x) && x.name === h.name));
  const withheldAllOf = (stored, d) => {
    const sh = new Set(arr(d?.institutions).filter(isRec).map((h) => h.name));
    return [...new Set([...withheldOf(stored, d), ...arr(stored.institutions).filter((h) => isRec(h) && typeof h.name === 'string' && h.name && !sh.has(h.name)).map((h) => h.name)])];
  };
  const stampedOf = (t) => arr(t.powerStructure?.factions).filter((f) => isRec(f) && f.hidden === true).map(nameOf).filter(Boolean);
  const maskAll = (v, names, isRoot = true) => {
    if (typeof v === 'string') return names.reduce((x, n) => x.split(n).join(HIDDEN_POWER_MASK), v);
    if (Array.isArray(v)) return v.map((x) => maskAll(x, names, false));
    if (isRec(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, (isRoot && k === 'name') || (k === 'id' && typeof x === 'string') ? x : maskAll(x, names, false)]));
    return v;
  };
  // galleryVeilDesc.pglite.test.js :: neverThere, copied whole (A's): the rows DELETED from the record
  const neverThere = (t, wh, dm = true) => {
    let x = clone(t);
    const stamped = stampedOf(t).filter((n) => wh.includes(n));
    x.institutions = arr(x.institutions).filter((h) => !(isRec(h) && wh.includes(h.name)));
    const keep = (f) => !(isRec(f) && wh.includes(nameOf(f)));
    if (isRec(x.powerStructure)) {
      x.powerStructure.factions = arr(x.powerStructure.factions).filter(keep);
      x.powerStructure.factionRelationships = arr(x.powerStructure.factionRelationships).filter((r) => !(isRec(r) && arr(r.pair).some((n) => wh.includes(String(n)))));
    }
    if (Array.isArray(x.factions)) x.factions = x.factions.filter(keep);
    if (isRec(x.history)) x.history.currentTensions = arr(x.history.currentTensions).map((c) => (isRec(c) && Array.isArray(c.factions) ? { ...c, factions: c.factions.filter((n) => !wh.includes(String(n))) } : c));
    if (!dm && stamped.length) x = maskAll(x, stamped);
    return x;
  };
  const strings = (v, p = '', out = []) => {
    if (typeof v === 'string') out.push([p, v]);
    else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${p}[${i}]`, out));
    else if (isRec(v)) for (const [k, x] of Object.entries(v)) strings(x, p ? `${p}.${k}` : k, out);
    return out;
  };
  const rowOwner = (d, path) => {
    const m = /^(powerStructure\.factions|factions)\[(\d+)\]/.exec(path);
    if (!m) return null;
    const rows = m[1] === 'factions' ? arr(d?.factions) : arr(d?.powerStructure?.factions);
    const f = rows[Number(m[2])];
    return isRec(f) ? `${nameOf(f)}${f.hidden === true ? ' [stamped]' : ''}` : null;
  };

  // ── THE CHAIN ──
  const db = new PGlite({ extensions: { pgcrypto } });
  expect(await bootChain(db)).toEqual([]);
  await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
  let m = 0;
  const store = async (stored, ov, dm) => {
    m += 1;
    const id = `7e5db000-0000-0000-0000-${String(m).padStart(12, '0')}`;
    const slug = `r5dpb${SH[1]}x${m}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name), String(stored.tier), J(stored), slug, `${slug}-link`, J(ov), dm]);
    await db.exec(`set test.uid = '';`);
    return { id, slug };
  };
  const gallery = async (slug) => (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
  const imported = async (slug) => {
    await db.exec(`set test.uid = '${READER}';`);
    const d = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
    await db.exec(`set test.uid = '';`);
    return d;
  };
  const twinOf = (stored, dm, ov) => veil.projectShareVeil(veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: ov }), ov);
  /** The owner's own setting with every house card and field SHOWN (galleryVeilDesc :: settingsOf's `shown`): the only hide on
   * a read is then the hand's (and the rule's, power.entry). */
  const shownOf = (stored) => {
    const idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
    const shows = arr(stored.institutions).filter((h) => isHideableHouse(h))
      .flatMap((h) => [`card:institution:${idOf(h)}`, ...['description', 'function', 'services', 'people'].map((f) => `field:institution:${idOf(h)}:${f}`)]);
    return opened([...OPEN, ...shows]);
  };
  const readOne = async (stored, dm) => {
    const ov = veil.writeShareVeil({}, shownOf(stored), { mode: 'live', at: AT });
    const { slug } = await store(stored, ov, dm);
    const g = await gallery(slug); const i = await imported(slug);
    const twin = twinOf(stored, dm, ov);
    return { server: { page: isRec(g) ? g : null, import: isRec(i) ? i : null }, twin: { page: twin, import: twin } };
  };
  const VARIANTS = [['server', 'page'], ['server', 'import'], ['twin', 'page'], ['twin', 'import']];
  const derived = (door, d) => (door === 'page' ? rd.page(clone(d)) : rd.served(d));
  const pageDescOf = (door, d, name) => {
    const p = derived(door, d);
    const f = arr(p?.powerStructure?.factions).find((x) => isRec(x) && !isCut(x) && nameOf(x) === name);
    return f ? (typeof f.desc === 'string' ? f.desc : null) : undefined;
  };

  // ── THE PLACES ──
  const POOL = process.env.R5DPB_POOL || 'A';
  const places = [];
  let idx = 0;
  if (POOL === 'A') for (let k = 0; k < 2; k += 1) for (const size of P_SIZES) for (const crisis of P_CRISES) {
    idx += 1;
    places.push({ pool: 'A', seed: `r3m-${size}-${crisis}-${k}-${idx}`, size, make: () => {
      const cfg = { ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
      const t = clone(generateSettlementPipeline(birthConfig(cfg), null, { seed: `r3m-${size}-${crisis}-${k}-${idx}`, customContent: {} }));
      delete t.publicProse;
      return t;
    } });
  }
  if (POOL === 'C6') for (const prefix of ['r5c2-m3', 'r5c2-m3b']) for (const size of C6_SIZES) for (let i = 0; i < 40; i += 1) {
    const seed = `${prefix}-${size}-${i}`;
    places.push({ pool: 'C6', seed, size, make: () => clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size }), null, { seed, customContent: {} })) });
  }
  // act T after A's pool, in A's process (galleryVeilDesc :: poolOf's order)
  if (POOL === 'A') places.push({ pool: 'T', seed: 'jp6-city-8', size: 'city', make: () => {
    const born = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: 'jp6-city-8', customContent: {} }));
    delete born.publicProse;
    return born;
  } });
  const SEEDS = (process.env.R5DPB_SEEDS || '').split(',').filter(Boolean); // the smoke run's places, by seed
  const mine = places.filter((p, i) => (SEEDS.length ? SEEDS.includes(p.seed) : i % Number(SH[2]) === Number(SH[1]))).slice(0, LIMIT || undefined);
  emit({ k: 'start', shard: `${POOL} ${SH[0]}`, places: mine.length, of: places.length, at: new Date().toISOString() });
  // THE BIRTHS FIRST, EVERY ONE OF THE POOL IN ITS RECIPE'S ORDER (as its test's poolOf makes them, before any read), the shard's
  // kept: a birth may read state an earlier birth of the same process left (the smoke's r3m-city-none-0-37, born alone, is not
  // the roster A's hand-back names); its fingerprint is emitted so the two can be compared
  const { createHash } = await import('node:crypto');
  const keep = new Set(mine);
  for (const pl of places) {
    if (SEEDS.length && !keep.has(pl)) continue; // the smoke: its places alone, born fresh
    const t = pl.make();
    if (keep.has(pl)) { pl.t = t; pl.fp = createHash('sha256').update(J(t)).digest('hex').slice(0, 16); pl.roster = arr(t.powerStructure?.factions).map(nameOf); }
  }
  emit({ k: 'born', ms: Date.now() - t0, n: places.length });

  for (const pl of mine) {
    const t = pl.t;
    emit({ k: 'fp', seed: pl.seed, fp: pl.fp, roster: pl.roster });
    const fs = arr(t.powerStructure?.factions).filter(isRec);
    // ── RIVALS ──
    const rivals = fs.filter((f) => typeof f.contestsNiche === 'string').map((r) => {
      const host = fs.find((f) => f !== r && seatKey(f) === r.contestsNiche) || null;
      const base = baseOf(r.desc); const hostBase = host ? baseOf(host.desc) : null;
      const row = t12RowOfText(base); const hostRow = host ? t12RowOfHost(hostBase) : -1;
      return { name: nameOf(r), cat: r.category ?? null, niche: r.contestsNiche, host: host ? nameOf(host) : null, hostGov: !!host?.isGoverning,
        hostHidden: host?.hidden === true, hostVeiled: host ? !!isVeiledPower(host) : null, base, hostBase,
        tpl: row >= 0 ? `T12.${row}` : 'T13', copyEq: base === hostBase, hostRow, t12Drift: (row >= 0) !== (hostRow >= 0) || (row >= 0 && row !== hostRow) };
    });
    emit({ k: 'place', pool: pl.seed === 'jp6-city-8' ? 'T-born' : pl.pool, seed: pl.seed, size: pl.size, tier: t.tier, powers: fs.length,
      hideableHouses: arr(t.institutions).filter((h) => isRec(h) && isHideableHouse(h)).length, publicProse: 'publicProse' in t, rivals });

    // ── OPEN (Q2's index): the born record, nothing hidden by hand ──
    if (pl.pool !== 'T') {
      for (const dm of [false, true]) {
        const got = await readOne(t, dm);
        for (const [eng, door] of VARIANTS) {
          const d = got[eng][door];
          if (!isRec(d)) { emit({ k: 'err', what: 'open no document', seed: pl.seed, eng, door, dm }); continue; }
          if (!hidesNothing(t, d)) { emit({ k: 'open', pool: pl.pool, seed: pl.seed, size: pl.size, dm, eng, door, hn: false, wh: withheldAllOf(t, d) }); continue; }
          const storedBy = new Map(fs.map((f) => [nameOf(f), f]));
          const roster = arr(d.powerStructure?.factions).filter((f) => isRec(f) && !isCut(f)).map((f) => {
            const s = storedBy.get(nameOf(f));
            const host = s && typeof s.contestsNiche === 'string' ? (fs.find((x) => x !== s && seatKey(x) === s.contestsNiche) || null) : null;
            return { name: nameOf(f), cat: f.category ?? null, base: baseOf(f.desc), rival: !!(s && typeof s.contestsNiche === 'string'), host: host ? nameOf(host) : null };
          });
          emit({ k: 'open', pool: pl.pool, seed: pl.seed, size: pl.size, dm, eng, door, hn: true, roster });
        }
      }
    }

    // ── HAND HIDES ──
    const recs = [];
    if (pl.pool === 'T') {
      const gov = fs.find((f) => f?.isGoverning);
      const A = nameOf(fs.find((f) => isRec(f) && f !== gov && !isVeiledPower(f)));
      const hid = clone(t); hid.powerStructure.factions = hid.powerStructure.factions.map((f) => (nameOf(f) === A ? { ...f, hidden: true } : f));
      const tr = transferRulingPower(hid, A, { cause: 'coup' });
      if (tr.error) { emit({ k: 'err', what: `act T: ${tr.error}`, seed: pl.seed }); continue; }
      const at = clone(tr.settlement);
      const afs = arr(at.powerStructure?.factions).filter(isRec);
      const aRivals = afs.filter((f) => typeof f.contestsNiche === 'string').map((r) => {
        const host = afs.find((f) => f !== r && seatKey(f) === r.contestsNiche) || null;
        const base = baseOf(r.desc); const hostBase = host ? baseOf(host.desc) : null; const row = t12RowOfText(base);
        return { name: nameOf(r), cat: r.category ?? null, niche: r.contestsNiche, host: host ? nameOf(host) : null, hostGov: !!host?.isGoverning, hostHidden: host?.hidden === true,
          base, hostBase, tpl: row >= 0 ? `T12.${row}` : 'T13', copyEq: base === hostBase, hostRow: host ? t12RowOfHost(hostBase) : -1 };
      });
      emit({ k: 'place', pool: 'T', seed: 'jp6-city-8 act T', size: 'city', tier: at.tier, powers: afs.length, taker: A, rivals: aRivals });
      recs.push({ rec: `jp6-city-8 act T (${A} hidden, the taker)`, place: 'jp6-city-8 act T', pool: 'T', size: 'city', t: at, hidden: [A], rivals: aRivals.filter((r) => r.host === A) });
      for (const h of [...new Set(aRivals.map((r) => r.host).filter((n) => n && n !== A))]) {
        const x = clone(at); x.powerStructure.factions = x.powerStructure.factions.map((f) => (nameOf(f) === h ? { ...f, hidden: true } : f));
        recs.push({ rec: `jp6-city-8 act T + hand hide ${h}`, place: 'jp6-city-8 act T', pool: 'T', size: 'city', t: x, hidden: [A, h], rivals: aRivals.filter((r) => r.host === h) });
      }
    } else {
      for (const h of [...new Set(rivals.map((r) => r.host).filter(Boolean))]) {
        const x = clone(t); x.powerStructure.factions = x.powerStructure.factions.map((f) => (nameOf(f) === h ? { ...f, hidden: true } : f));
        recs.push({ rec: `${pl.seed} hand hide ${h}`, place: pl.seed, pool: pl.pool, size: pl.size, t: x, hidden: [h], rivals: rivals.filter((r) => r.host === h) });
      }
    }
    for (const r of recs) {
      for (const dm of [false, true]) {
        const got = await readOne(r.t, dm);
        const wh = isRec(got.twin.page) ? withheldAllOf(r.t, got.twin.page) : [];
        const whS = isRec(got.server.page) ? withheldAllOf(r.t, got.server.page) : null;
        const ng = await readOne(neverThere(r.t, wh, dm), dm);
        const storedPowers = new Set(listsOf(r.t).map(nameOf));
        const whPowers = wh.filter((n) => storedPowers.has(n));
        const searches = whPowers.map((n) => [n, formSearch(n)]);
        emit({ k: 'rec', rec: r.rec, place: r.place, pool: r.pool, size: r.size, dm, hidden: r.hidden, wh, whS, whPowers, agree: J([...wh].sort()) === J([...(whS || [])].sort()), rivals: r.rivals.map((x) => x.name) });
        for (const [eng, door] of VARIANTS) {
          const d = got[eng][door]; const n = ng[eng][door];
          if (!isRec(d) || !isRec(n)) { emit({ k: 'err', what: 'hide no document', rec: r.rec, eng, door, dm }); continue; }
          const rowsH = new Map(arr(d.powerStructure?.factions).filter((f) => isRec(f) && !isCut(f)).map((f) => [nameOf(f), f]));
          const rowsN = new Map(arr(n.powerStructure?.factions).filter((f) => isRec(f) && !isCut(f)).map((f) => [nameOf(f), f]));
          // Q1
          for (const rv of r.rivals) {
            const fh = rowsH.get(rv.name); const fn = rowsN.get(rv.name);
            const bh = fh ? baseOf(fh.desc) : undefined; const bn = fn ? baseOf(fn.desc) : undefined;
            const ph = pageDescOf(door, d, rv.name); const pn = pageDescOf(door, n, rv.name);
            const hostRow = arr(d.powerStructure?.factions).find((f) => isRec(f) && nameOf(f) === rv.host);
            emit({ k: 'q1', rec: r.rec, place: r.place, pool: r.pool, size: r.size, dm, eng, door, rival: rv.name, cat: rv.cat, tpl: rv.tpl, host: rv.host, hostGov: rv.hostGov,
              servedH: !!fh, servedN: !!fn, baseH: bh ?? null, baseN: bn ?? null, eqBase: bh === bn, pageH: ph ?? null, pageN: pn ?? null, eqPage: ph === pn,
              storedBase: rv.base, eqStored: bh === rv.base, masked: typeof bh === 'string' && bh.includes(HIDDEN_POWER_MASK),
              hostServed: hostRow ? (hostRow.hidden === true ? 'stamped' : isMasked(hostRow) ? 'masked' : 'open') : 'absent' });
          }
          // the free differential: every served power, hiding vs never there
          const names = [...new Set([...rowsH.keys(), ...rowsN.keys()])];
          const baseDiff = []; const pageDiff = [];
          for (const nm of names) {
            const bh = rowsH.has(nm) ? baseOf(rowsH.get(nm).desc) : '(absent)'; const bn = rowsN.has(nm) ? baseOf(rowsN.get(nm).desc) : '(absent)';
            if (bh !== bn) baseDiff.push(nm);
            if (pageDescOf(door, d, nm) !== pageDescOf(door, n, nm)) pageDiff.push(nm);
          }
          emit({ k: 'diff', rec: r.rec, place: r.place, pool: r.pool, dm, eng, door, powers: names.length, baseDiff, pageDiff });
          // Q3
          for (const [N, search] of searches) {
            const agg = new Map();
            for (const [side, doc] of [['h', d], ['n', n]]) {
              for (const [path, s] of strings(doc)) {
                for (const hit of search(s)) {
                  const np = path.replace(/\[\d+\]/g, '[]');
                  const key = `${side}\u0001${hit.form}\u0001${np}\u0001${hit.text}`;
                  const e = agg.get(key) || { side, form: hit.form, path: np, text: hit.text, count: 0, owners: [], ctx: null };
                  e.count += 1;
                  const ow = rowOwner(doc, path);
                  if (ow && e.owners.length < 4 && !e.owners.includes(ow)) e.owners.push(ow);
                  if (!e.ctx) e.ctx = s.slice(Math.max(0, hit.at - 40), hit.at + hit.text.length + 60);
                  agg.set(key, e);
                }
              }
            }
            emit({ k: 'q3', rec: r.rec, place: r.place, pool: r.pool, size: r.size, dm, eng, door, name: N, handHidden: r.hidden.includes(N), hits: [...agg.values()] });
          }
        }
      }
    }
    emit({ k: 'done', seed: pl.seed, ms: Date.now() - t0 });
  }
  emit({ k: 'end', shard: SH[0], ms: Date.now() - t0, at: new Date().toISOString() });
  await db.close();
}, 14_400_000);
