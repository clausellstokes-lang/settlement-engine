// R5D-1 (VEIL-34's MEASURE builder V34-R5D1; brief docs/chair/2026-11-20/veil/briefs/R5D-1-BRIEF.md): R5D-0's arm
// (out/v34/r5d0/measure/arm.probe.jsx at e1e5548cf) EXTENDED, everything it measured kept. Added (the `y` fields): per page and
// served card (hidden rows out) its kind, its served base (cut by the table), the R5D-0 Q2 templates it matches (templates.mjs),
// and THE PAGE'S PICKER's base (pick.mjs: late options or none; seeds r5d1-a / r5d1-b where a template card is served, the
// seed-draw test), equal or not; per birth THE PLANTS (M3): a density HOST hidden by hand, a NOBLE power hidden by hand
// (`hidden: true` on its rows, the act's own stamp), read off (unmarked), both engines, against the same place with that power
// NEVER THERE (its rows and its relations deleted), both engines: the picker's base on each, card by card.
// R5D-0 (VEIL-34's MEASURE builder V34-R5D0; brief docs/chair/2026-11-20/veil/briefs/R5D-0-BRIEF.md): R5-DESC-MEASURE's arm
// (out/v34/r5desc/measure/arm.probe.jsx at 606381cb5) EXTENDED, everything it measured kept. Added (the `x` fields): per town
// the record's roster, its descs CUT by standing-table.mjs, the engine's standings on the record roster, the record's relation
// and tension rows; per page the served descs (a code where equal to the record's), the relation rows and their dmNote, the
// tension parties that print the mask, every served string that prints the mask, and every OTHER served string that holds a
// served desc's standing literal; and THE WALKER: every standing the engine writes on a page's roster, cut by the table.
// R5-DESC-MEASURE (VEIL-34's MEASURE builder; brief docs/chair/2026-11-20/veil/briefs/R5-DESC-MEASURE-BRIEF.md). A COPY of the
// tell8b arm (v32/tell8b/measure/arm.probe.jsx): the same page set (tell-common.mjs :: pool, N=2: the R3 gate's 140 births,
// the 92 hidden-house towns and the 48 controls; BOTH ENGINES, the server get_gallery_dossier on RV9_SERVER_TPL and the twin
// projectShareVeil over galleryPayloadFor; every setting tell-common.mjs :: settings computes, 'allShown' and 'unmarked';
// Reveal off and DM). Changes nothing in src, supabase or tests. Per page:
//   W, H     the withheld powers: W = in the record's two power lists (powerStructure.factions[], master's factions[]) and in
//            neither served list, not stamped; H = the record's rows stamped `hidden: true` (counted apart, served or not)
//   m1       M1/M2, over the SERVED document (sv: projectServedVeil(served, served marker); tw: the twin's projection): every
//            string leaf under powerStructure, master's factions[] and top-level pressureSentence, by normalized path:
//            [n, aW, aH, b, bt, c]: a = names a withheld power by THE LANE'S FOLD (gallerySecondHomes.js :: buildNameSearch,
//            imported; the served names open); b = carries the mask 'an unseen interest'; bt = 'the an unseen interest';
//            c = a withheld power's KIND word (KIND_WORDS below, by inferFactionCategory, plus its RULER_KINDS archetype word)
//   wide     M2's wider walk: every OTHER string leaf of the served document, only where a/b hits ([aW, aH, b, bt])
//   m3       M3 over the PAGE (the page's own path: rederiveForPage over the projected document): B = generatePowerStructure
//            over the page (R5C2's reader, out/v33/r5recent/R5C2-measure3.probe.mjs :: rederiveB, by its call); S = the
//            standing part alone (factionStanding.js :: annotateFactionStanding over the served roster, as rosterText.js ::
//            standingsOf does; the base sentence kept); per served power [name, B desc, S desc, B label, cause]
//   m5       M5: derivePowerStrata(page) and coupContenders(page): every string leaf of their output, by path, a/b/c as m1
// Per birth: the record's own replay (projectPowerGenerationIntent with the power step's intent and the late replay's
// options), B over the record, the descs after each pipeline step (onStep), for the miss causes. LOCAL cluster only.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, OPEN } from '../../../v27/tell/measure/tell-common.mjs';
import { expand, cutTail } from '../../r5d0/measure/standing-table.mjs'; // R5D-0
import { makePick } from './pick.mjs'; // R5D-1
import { tplOf } from './templates.mjs'; // R5D-1
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);

// (c)'s word list: power/factionCategories.js :: FACTION_CATEGORY_KEYWORDS and MAGIC_CERTAIN_KEYWORDS (not exported:
// COPIED here, byte for byte, at 8bb15b491), matched case-blind at a word's start; plus the archetype's own word where it is
// one of powerSupport.js :: RULER_KINDS (imported).
const KIND_WORDS = {
  military: ['Military', 'Guard', 'War Council', 'Garrison', 'Mercenary', 'Occupation', 'Resistance', 'Monster Hunter', 'Adventurer', 'Charter', 'Watch', 'Knight', 'Soldier', 'Huscarl', 'Huskarl', 'Hird'],
  religious: ['Religious', 'Faith', 'Church', 'Temple', 'Congregation', 'Shrine', 'Clergy', 'Conversion', 'Old Faith', 'Ecclesiastical', 'Diocese', 'Bishop', 'Patriarch', 'Holy', 'Theocrat', 'Priestly', 'Devout', 'Friar', 'Monastery', 'Cathedral'],
  criminal: ['Thiev', 'Criminal', 'Smuggl', 'Underground', 'Cartel', 'Corrupt', 'Bandit', 'Assassin', 'Shadow', 'Hidden Hand', 'Black Circle', 'Underworld'],
  magic: ['Arcane', 'Mage', 'Wizard', 'Sorcerer', 'Alchemist', 'Occult', 'Hedge', 'Enchant', 'Spellcast'],
  economy: ['Merchant', 'Craft', 'Guild', 'Trade', 'Market', 'Banking', 'Grain', 'Farmer', 'Cloth', 'Commerce', 'Factor', 'Artisan', 'Ledger', 'Compact', 'Consortium', 'Oligarch'],
  government: ['Council', 'Authority', 'Administration', 'Governor', 'Steward', 'Assembly', 'Senate', 'Civic', 'Municipal', 'Electoral', 'Democratic', 'Alderman', 'Magistrate', 'Court', 'Chancery'],
  noble: ['Noble', 'Aristocrat', 'Lord', 'Lady', 'Manor', 'Landed', 'Gentry', 'Feudal', 'Ducal', 'Royal', 'House', 'Estate', 'Heritage', 'Claimant', 'Loyalist'],
};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

it('R5-DESC-MEASURE: the arm', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const { HIDDEN_POWER_MASK } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const { inferFactionCategory } = await import(`${SRC}/src/generators/power/factionCategories.js`);
  const { RULER_KINDS, backingArchetypeOf } = await import(`${SRC}/src/domain/dossier/powerSupport.js`);
  const { generatePowerStructure } = await import(`${SRC}/src/generators/power/rulingStructure.js`);
  const { annotateFactionStanding } = await import(`${SRC}/src/generators/power/factionStanding.js`);
  const { standingRosterOf, standingForceOf } = await import(`${SRC}/src/generators/power/rosterText.js`);
  const { projectPowerGenerationIntent } = await import(`${SRC}/src/generators/power/economyReconciliation.js`);
  const { createPRNG } = await import(`${SRC}/src/kernel/prng.js`);
  const { setActiveRng, clearActiveRng } = await import(`${SRC}/src/kernel/rngContext.js`);
  const { factsOf } = await import(`${SRC}/src/domain/facts/factsOf.js`);
  const { isAdversarialRelationship } = await import(`${SRC}/src/domain/relationships/canonicalRelationship.js`);
  const { derivePowerStrata } = await import(`${SRC}/src/domain/dossier/powerStrata.js`);
  const { coupContenders } = await import(`${SRC}/src/domain/rulingPowerCoup.js`);
  const { rederiveForPage } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const { powerSentenceName } = await import(`${SRC}/src/domain/display/powerSentenceName.js`); // R5D-0
  const { pluralPowerName } = await import(`${SRC}/src/domain/display/governanceAccount.js`); // R5D-0
  const walk = { n: 0, cut: 0, fail: [] }; // R5D-0: THE WALKER (every engine standing on a page's roster, cut by the table)
  const walkCut = (stMap, table) => { if (!stMap) return; for (const [n, st] of stMap) { if (!st) continue; walk.n += 1; const c = cutTail(st, table); if (c.base === '') walk.cut += 1; else if (walk.fail.length < 20) walk.fail.push([n, st.slice(0, 300), c.base.slice(0, 200)]); } };
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  /** The server's gallery read: { data, ov } (the served marker the page projects with). */
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd5d${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `s5d${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov == null ? {} : ov), dm]);
    const r = (await db.query('select to_jsonb(g.data) d, g.gallery_member_overrides o from public.get_gallery_dossier($1) g', [sl])).rows[0];
    await db.query('delete from public.settlements where id = $1', [id]);
    return { data: r?.d, ov: r?.o };
  };
  const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
  const nameOf = (f) => String(f?.faction ?? f?.name ?? '');
  const norm = (p) => p.replace(/\[\d+\]/g, '[]');
  const strings = (v, p, out) => {
    if (typeof v === 'string') out.push([p, v]);
    else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${p}[${i}]`, out));
    else if (isRec(v)) for (const k of Object.keys(v)) strings(v[k], p ? `${p}.${k}` : k, out);
    return out;
  };
  const rowsOf = (d) => [...recs(d?.powerStructure?.factions), ...recs(d?.factions)];
  const stackSym = (err) => {
    const fr = String(err?.stack || '').split('\n').slice(1).map((l) => l.trim()).filter((l) => !/rngContext\.js|node:|vitest|arm\.probe/.test(l));
    return fr.slice(0, 3).map((l) => l.replace(/^at /, '').replace(SRC, '').replace(/\?[^:)]*/, '').slice(0, 120)).join(' < ');
  };
  /** generatePowerStructure over a document (R5C2's rederiveB), with the late replay's options or not, a seed or none. */
  const runB = (s, { opts = null, seed = null } = {}) => {
    const config = s.config;
    if (!isRec(config) || !isRec(s.powerStructure)) return { why: 'no config or powers' };
    const entries = recs(s.stressors).length ? recs(s.stressors) : isRec(s.stress) ? [s.stress] : recs(s.stress);
    const nb = s.neighborRelationship ?? config.neighborRelationship;
    const neighbourRelationship = isRec(nb) && isAdversarialRelationship(nb.relationshipType) ? nb : null;
    const prev = seed ? setActiveRng(createPRNG(seed)) : undefined;
    try {
      return { v: generatePowerStructure(s.tier, s.economicState || {}, neighbourRelationship, config, recs(s.institutions), { ...(opts || {}), stressEntries: entries }) };
    } catch (err) { return { why: `threw ${stackSym(err)}` }; } finally { if (seed) clearActiveRng(prev); }
  };
  const lateOpts = (s) => {
    const dp = s.defenseProfile;
    let forces = null; try { forces = factsOf(s).defence; } catch { forces = null; }
    return { ...(dp?.readiness?.label ? { defenseLabel: dp.readiness.label } : {}), ...(dp?.economicGates?.military != null ? { militaryGate: dp.economicGates.military } : {}), ...(forces ? { forces } : {}) };
  };
  const descMap = (ps) => new Map(recs(ps?.factions).map((f) => [nameOf(f), f]));
  const relKey = (r) => (Array.isArray(r?.pair) ? r.pair.map(String).join('|') : '#');
  /** rosterText.js :: standingsOf, by its calls (it is not exported): each power's standing sentence on a roster. */
  const standings = (factions, institutions, leg) => {
    const seats = standingRosterOf(factions).map((f) => ({ ...f, desc: '' }));
    annotateFactionStanding(seats, standingForceOf(institutions), { publicLegitimacy: leg });
    return new Map(seats.map((f) => [f.faction, String(f.desc || '')]));
  };
  /** S' (a variant): the same sentence over the served rows whole (category, rawPower and all), sorted as standingRosterOf sorts. */
  const standingsFull = (factions, institutions, leg) => {
    const seats = recs(factions).filter((f) => nameOf(f)).map((f) => ({ ...f, faction: nameOf(f), power: Number(f.power) || 0, desc: '' })).sort((a, b) => b.power - a.power);
    annotateFactionStanding(seats, standingForceOf(institutions), { publicLegitimacy: leg });
    return new Map(seats.map((f) => [f.faction, String(f.desc || '')]));
  };
  const baseOf = (desc, st) => (!st ? desc : desc === st ? '' : desc.endsWith(` ${st}`) ? desc.slice(0, -st.length - 1) : null);
  const join = (base, st) => (base && st ? `${base} ${st}` : (base || st));
  /** The searches a page reads: the withheld names (W, H), the mask, the withheld powers' kind words. */
  const searchesFor = (W, H, open, catOf) => {
    const sw = W.length ? buildNameSearch(W, open) : null; const sh = H.length ? buildNameSearch(H, open) : null;
    const words = new Set();
    for (const n of [...W, ...H]) {
      const cat = catOf(n); for (const w of KIND_WORDS[cat] || []) words.add(w);
      const arch = backingArchetypeOf({ faction: n, category: cat }); if (RULER_KINDS.includes(arch)) words.add(arch);
    }
    const kre = words.size ? new RegExp(`(?<![A-Za-z])(${[...words].sort().map(esc).join('|')})`, 'gi') : null;
    const tellRe = new RegExp(`\\bthe ${esc(HIDDEN_POWER_MASK)}`, 'i');
    const servedLow = open.map((n) => String(n).toLowerCase());
    return (t) => {
      const kw = kre ? [...new Set([...t.matchAll(kre)].map((m) => m[1].toLowerCase()))] : [];
      const idiom = t.replace(/\b(in|operate in) the shadow of\b|'s shadow\b/gi, ' ');
      const strict = kw.filter((w) => !servedLow.some((n) => n.includes(w)) && new RegExp(`(?<![A-Za-z])${esc(w)}`, 'i').test(idiom));
      return { aW: sw ? (sw.hit(t) ? 1 : 0) : 0, aH: sh ? (sh.hit(t) ? 1 : 0) : 0, b: t.includes(HIDDEN_POWER_MASK) ? 1 : 0, bt: tellRe.test(t) ? 1 : 0, c: kw.length ? 1 : 0, kw, cs: strict.length ? 1 : 0, strict };
    };
  };
  const tally = (pairs, test, into, kwInto, ex, exTag, csInto = null) => {
    for (const [p, t] of pairs) {
      const k = norm(p); const h = test(t); const row = into[k] || (into[k] = [0, 0, 0, 0, 0, 0]);
      row[0] += 1; row[1] += h.aW; row[2] += h.aH; row[3] += h.b; row[4] += h.bt; row[5] += h.c;
      if (h.c && kwInto) { const m = kwInto[k] || (kwInto[k] = {}); for (const w of h.kw) m[w] = (m[w] || 0) + 1; }
      if (h.cs && csInto) { const m = csInto[k] || (csInto[k] = { n: 0, ex: [] }); m.n += 1; if (m.ex.length < 2) m.ex.push(t.slice(0, 300)); }
      if ((h.aW || h.aH || h.b || h.c) && ex.length < 6) ex.push([exTag, p, `${h.aW}${h.aH}${h.b}${h.bt}${h.c}`, h.kw.join(','), t.slice(0, 320)]);
    }
  };

  const PK = await makePick(SRC, HIDDEN_POWER_MASK); // R5D-1
  const cardsY = (page, recNamesY, seeds) => { // R5D-1: per served card (hidden rows out): [n, kind, tpl, L, N0, SA, SB, how, diff]
    const served = PK.servedOf(page); const tb = PK.table([...new Set([...recNamesY, ...served.map(nameOf)])]);
    const sb = new Map(served.map((f) => [nameOf(f), typeof f.desc === 'string' ? PK.cutTail(f.desc, tb).base : null]));
    const anyT = [...sb.values()].some((b) => tplOf(b).length);
    const L = PK.pick(page, { late: true, extraNames: recNamesY }); const N0 = PK.pick(page, { late: false, extraNames: recNamesY });
    const SA = seeds && anyT ? PK.pick(page, { seed: 'r5d1-a', extraNames: recNamesY }) : null; const SB = seeds && anyT ? PK.pick(page, { seed: 'r5d1-b', extraNames: recNamesY }) : null;
    const code = (P, n) => { if (!P) return -2; const r = P.rows.get(n); return !r || r.base === null ? -1 : r.base === sb.get(n) ? 1 : 0; };
    return { seat: [L.seatS, L.seatB ?? null, L.why ?? null], c: served.map((f) => { const n = nameOf(f); const t = tplOf(sb.get(n)); const lc = code(L, n);
      return [n, f.category || inferFactionCategory(n), t, lc, code(N0, n), code(SA, n), code(SB, n), L.rows.get(n)?.how ?? null, (t.length && lc !== 1) || lc === 0 ? [String(sb.get(n)).slice(0, 220), String(L.rows.get(n)?.base ?? null).slice(0, 220)] : null, f.contestsNiche ?? null]; }) };
  };
  const out = { meta: { src: SRC, shard: SHARD, started: new Date().toISOString(), mask: HIDDEN_POWER_MASK, kindWords: KIND_WORDS, rulerKinds: RULER_KINDS }, towns: [] };
  const ONLY = process.env.RV9_ONLY ? new Set(process.env.RV9_ONLY.split(',')) : null;
  for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
    if (ONLY && !ONLY.has(b.seed)) continue;
    // THE BIRTH, as tell-common.mjs :: birth (drop null) does it, with the descs after each step and the power step's intent
    const snaps = []; let intent = null;
    let t0 = generateSettlementPipeline(birthConfig(b.cfg), null, { seed: b.seed, customContent: {}, onStep: (name, ctx) => {
      const ps = (isRec(ctx?.settlement) && isRec(ctx.settlement.powerStructure)) ? ctx.settlement.powerStructure : ctx?.powerStructure;
      if (isRec(ps) && Array.isArray(ps.factions)) snaps.push([name, Object.fromEntries(recs(ps.factions).map((f) => [nameOf(f), String(f.desc ?? '')]))]);
      if (!intent && ctx?.powerIntent) intent = clone(ctx.powerIntent);
    } });
    t0 = { ...t0 }; delete t0.publicProse; t0 = withPublicProse(t0, composePublicProse(t0));
    const A = clone(t0);
    const hideable = recs(A.institutions).filter((h) => E.isHideableHouse(h));
    const recRows = rowsOf(A); const recNames = [...new Set(recRows.map(nameOf).filter(Boolean))];
    const recH = [...new Set(recRows.filter((f) => f.hidden === true).map(nameOf).filter(Boolean))];
    const catOf = (n) => { const r = recRows.find((f) => nameOf(f) === n); return r?.category || inferFactionCategory(n); };
    // THE CAUSES, per power of the record (once a birth)
    const stored = descMap(A.powerStructure);
    let Rrec = null; try { Rrec = intent ? descMap(projectPowerGenerationIntent(intent, A.economicState, lateOpts(A))) : null; } catch (e) { Rrec = `#threw ${stackSym(e)}`; }
    const BA = runB(A); const BAo = runB(A, { opts: lateOpts(A) }); const BAs = intent ? runB(A, { opts: lateOpts(A), seed: intent.rngSeed }) : { why: 'no intent' };
    const BI = intent ? (() => { const prev = setActiveRng(createPRNG(intent.rngSeed)); try { return { v: generatePowerStructure(intent.tier, A.economicState || {}, intent.neighbourRelationship, intent.config, intent.institutions, { ...lateOpts(A), ...(Array.isArray(intent.stressEntries) ? { stressEntries: intent.stressEntries } : {}) }) }; } catch (e) { return { why: `threw ${stackSym(e)}` }; } finally { clearActiveRng(prev); } })() : { why: 'no intent' };
    const dOf = (r, n) => (r?.v ? descMap(r.v).get(n)?.desc : undefined);
    const causes = {};
    for (const [n, f] of stored) {
      const want = String(f.desc ?? '');
      const iStep = snaps.findIndex(([s]) => s === 'generatePower');
      const after = []; for (let i = Math.max(iStep, 0) + 1; i < snaps.length; i += 1) if (snaps[i][1][n] !== snaps[i - 1][1][n]) after.push(snaps[i][0]);
      const lastSnap = snaps.length ? snaps[snaps.length - 1][1][n] : undefined;
      if (lastSnap !== want) after.push('#tail (generateSettlementPipeline.js:203-204, claimStanding.js :: settleClergyToFinalRoster / settleArcaneToPractitioners, after the last step)');
      causes[n] = {
        rrec: typeof Rrec === 'string' ? Rrec : Rrec?.get(n) ? (String(Rrec.get(n).desc) === want ? 1 : 0) : -1,
        ba: BA.v ? (dOf(BA, n) === undefined ? -1 : dOf(BA, n) === want ? 1 : 0) : BA.why,
        bao: BAo.v ? (dOf(BAo, n) === undefined ? -1 : dOf(BAo, n) === want ? 1 : 0) : BAo.why,
        bas: BAs.v ? (dOf(BAs, n) === undefined ? -1 : dOf(BAs, n) === want ? 1 : 0) : BAs.why,
        bi: BI.v ? (dOf(BI, n) === undefined ? -1 : dOf(BI, n) === want ? 1 : 0) : BI.why,
        steps: after, born: iStep >= 0 && snaps[iStep][1][n] !== undefined ? 1 : 0,
        instN: [recs(intent?.institutions).length, recs(A.institutions).length],
      };
    }
    // M4 executed: does the governing name or the government spell a house of the record?
    const houseSearch = buildNameSearch(recs(A.institutions).map((h) => String(h.name || '')).filter(Boolean), []);
    const gov = [A.powerStructure?.governingName ?? null, A.powerStructure?.government ?? null, A.powerStructure?.governmentType ?? null];
    const govHouse = gov.map((g) => (typeof g === 'string' && houseSearch ? (houseSearch.hit(g) ? 1 : 0) : 0));
    const rec = { seed: b.seed, size: b.size, crisis: b.crisis, hidden: hideable.map((h) => h.name), recNames, recH, gov, govHouse, causes, pages: {} };
    // R5D-0: the record's roster, its descs cut by the table, the engine's standing on that roster
    const tableRec = expand(recNames, powerSentenceName, pluralPowerName);
    let engRec = null; try { engRec = standings(recs(A.powerStructure?.factions), A.institutions, A.powerStructure?.publicLegitimacy); } catch { engRec = null; }
    walkCut(engRec, tableRec);
    rec.x = {
      rd: recs(A.powerStructure?.factions).map((f) => { const d = String(f.desc ?? ''); const c = cutTail(d, tableRec); const eng = engRec ? engRec.get(nameOf(f)) ?? null : null;
        return { n: nameOf(f), d, gov: f.isGoverning === true ? 1 : 0, hid: f.hidden === true ? 1 : 0, cat: f.category ?? null, pw: f.power ?? null, base: c.base, ids: c.ids, named: c.named, mid: c.mid, eng, engEq: eng === null ? -1 : eng === '' ? (c.ids.length === 0 ? 1 : 0) : (c.base === baseOf(d, eng) ? 1 : 0), engTail: eng ? (d === eng || d.endsWith(` ${eng}`) ? 1 : 0) : -1 };
      }),
      rel: (() => { const r = recs(A.powerStructure?.factionRelationships); return [r.length, r.filter((x) => typeof x.dmNote === 'string' && x.dmNote.trim()).length]; })(),
      tens: recs(A.history?.currentTensions).map((t) => ({ type: t.type ?? null, f: Array.isArray(t.factions) ? t.factions.map(String) : null })),
    };
    const recDesc = new Map(rec.x.rd.map((r) => [r.n, r.d]));
    for (const dm of [false, true]) {
      const { sc, deltas } = V.settings(A, dm);
      const cards = hideable.map((h) => ({ address: `card:institution:${V.veil.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
      const sets = Object.fromEntries(Object.entries(deltas).filter(([k]) => k !== 'g:111'));
      if (hideable.length) sets.allShown = [...V.sw.setCriminalVeil(V.opened(OPEN), sc.defaults, false, sc.present, sc.model), ...cards];
      const entries = [...Object.entries(sets).map(([k, d]) => [k, V.write(d)]), ['unmarked', {}]];
      for (const [k, ov] of entries) {
        const sv = await server(clone(A), dm, ov);
        const twinDoc = V.twin(A, dm, ov);
        const unmarked = !V.veil.readShareVeil(ov).marked;
        const projOf = { sv: () => V.veil.projectServedVeil(clone(sv.data), sv.ov), tw: () => clone(twinDoc) };
        const pageOf = { sv: (p) => rederiveForPage(clone(p), { unveiled: !V.veil.isServedVeil(sv.ov) && unmarked }), tw: (p) => rederiveForPage(clone(p), { unveiled: unmarked }) };
        for (const eng of ['tw', 'sv']) {
          const P = { m1: {}, kw: {}, cs: {}, ex: [], wide: {}, m3: null, m5: {}, m5kw: {}, m5cs: {}, m5ex: [] };
          let proj; try { proj = projOf[eng](); } catch (e) { proj = null; P.err = `proj threw ${String(e?.message).slice(0, 80)}`; }
          const d = isRec(proj) ? proj : {};
          const servedRows = rowsOf(d); const servedNames = [...new Set(servedRows.map(nameOf).filter(Boolean))];
          const W = recNames.filter((n) => !servedNames.includes(n) && !recH.includes(n));
          P.W = W; P.H = recH; P.hide = W.length > 0 || recH.some((n) => !servedNames.includes(n)) ? 1 : 0; P.Hserved = recH.filter((n) => servedNames.includes(n)); P.masked = servedRows.filter((f) => nameOf(f).includes(HIDDEN_POWER_MASK)).length;
          P.gov = [d.powerStructure?.governingName ?? null, d.powerStructure?.government ?? null];
          const test = searchesFor(W, recH, servedNames, catOf);
          // R5D-0 per page: Q1 relations; Q3 the served descs and their standings elsewhere; Q4 the mask
          {
            const rel = recs(d.powerStructure?.factionRelationships);
            P.xrel = [rel.length, rel.filter((x) => typeof x.dmNote === 'string' && x.dmNote.trim()).length, rel.filter((x) => 'dmNote' in x).length];
            const tablePage = expand([...new Set([...recNames, ...servedNames])], powerSentenceName, pluralPowerName);
            const sdRows = recs(d.powerStructure?.factions);
            const lits = new Set();
            P.xsd = sdRows.map((f) => { const n = nameOf(f); const ds = typeof f.desc === 'string' ? f.desc : null; const c = ds === null ? null : cutTail(ds, tablePage);
              if (c && c.ids.length) { let r = ds; for (let i = c.ids.length - 1; i >= 0; i -= 1) { const row = tablePage.filter((t) => t[0] === c.ids[i] && (r === t[2] || r.endsWith(` ${t[2]}`))).sort((a, b2) => b2[2].length - a[2].length)[0]; if (!row) break; lits.add(row[2]); r = r === row[2] ? '' : r.slice(0, -row[2].length - 1); } }
              return ds === null ? [n, -1] : ds === recDesc.get(n) ? [n, 1] : [n, 0, ds.slice(0, 600), c.base.slice(0, 400), c.ids, c.named, c.mid];
            });
            const els = {}; const elsEx = [];
            const maskP = {}; let tm = 0;
            for (const [p, t] of strings(d, '', [])) {
              const k = norm(p);
              if (t.includes(HIDDEN_POWER_MASK)) { maskP[k] = (maskP[k] || 0) + 1; if (/^history\.currentTensions\[\]\.factions\[\]$/.test(k)) tm += 1; }
              if (/^(powerStructure\.factions|factions)\[\]\.desc$/.test(k)) continue;
              for (const l of lits) if (t.includes(l)) { els[k] = (els[k] || 0) + 1; if (elsEx.length < 4) elsEx.push([p, l.slice(0, 80), t.slice(0, 200)]); break; }
            }
            P.xels = els; P.xelsEx = elsEx; P.xmask = maskP; P.xtm = tm; P.xlits = lits.size;
            P.xtens = recs(d.history?.currentTensions).map((t) => (Array.isArray(t.factions) ? t.factions.map(String) : null));
          }
          // M1 + M2 (the power card's paths, walked)
          tally([...strings(d.powerStructure, 'powerStructure', []), ...strings(d.factions, 'factions', []), ...(typeof d.pressureSentence === 'string' ? [['pressureSentence', d.pressureSentence]] : [])], test, P.m1, P.kw, P.ex, 'm1', P.cs);
          if (W.length || recH.length) {
            const wide = {}; const wex = [];
            for (const [p, t] of strings(d, '', [])) {
              if (/^(powerStructure|factions)[.[]/.test(p) || p === 'pressureSentence') continue;
              const h = test(t); if (!(h.aW || h.aH || h.b)) continue;
              const k = norm(p); const row = wide[k] || (wide[k] = [0, 0, 0, 0]); row[0] += h.aW; row[1] += h.aH; row[2] += h.b; row[3] += h.bt;
              if (wex.length < 6) wex.push([p, `${h.aW}${h.aH}${h.b}${h.bt}`, t.slice(0, 320)]);
            }
            P.wide = wide; P.wex = wex;
          }
          // M3 + M5 over the PAGE
          let page = null; try { page = proj ? pageOf[eng](proj) : null; } catch (e) { P.err = `page threw ${String(e?.message).slice(0, 80)}`; }
          if (isRec(page)) {
            const B = runB(page);
            const Bm = B.v ? descMap(B.v) : null;
            const served = recs(page.powerStructure?.factions);
            let stS = null; try { stS = standings(served, page.institutions, page.powerStructure?.publicLegitimacy); } catch (e) { stS = null; P.sErr = String(e?.message).slice(0, 80); }
            walkCut(stS, expand(served.map(nameOf).filter(Boolean), powerSentenceName, pluralPowerName)); // R5D-0: THE WALKER
            let stF = null; try { stF = standingsFull(served, page.institutions, page.powerStructure?.publicLegitimacy); } catch { stF = null; }
            let stB = null; try { stB = B.v ? standings(recs(B.v.factions), page.institutions, B.v.publicLegitimacy) : null; } catch { stB = null; }
            const rows = served.map((f) => {
              const n = nameOf(f); const has = typeof f.desc === 'string'; const desc = has ? f.desc : null;
              const bd = Bm ? Bm.get(n)?.desc : undefined;
              const bCode = !B.v ? -2 : bd === undefined ? -1 : bd === desc ? 1 : 0;
              const st = stS ? stS.get(n) : undefined;
              const sCode = !has || st === undefined ? -1 : baseOf(desc, st) === null ? 0 : st === '' ? 2 : 1;
              const lbl = Bm && Bm.get(n) ? (Bm.get(n).powerLabel === f.powerLabel ? 1 : 0) : -1;
              const bTest = bd !== undefined ? test(String(bd)) : null;
              // a B miss split: the base sentence (the desc less its standing on its own roster) equal or not, the standing equal or not
              const stf = stF ? stF.get(n) : undefined;
              const sfCode = !has || stf === undefined ? -1 : baseOf(desc, stf) === null ? 0 : stf === '' ? 2 : 1;
              const sDiag = sCode === 0 ? [desc.slice(-240), String(st).slice(0, 240)] : null;
              const split = bCode === 0 && has && stB && st !== undefined ? (() => { const bs = stB.get(n) ?? ''; const bb = baseOf(String(bd), bs); const sb = baseOf(desc, st); return `${bb !== null && bb === sb ? 1 : 0}${bs === st ? 1 : 0}`; })() : '';
              return [n, has ? 1 : 0, bCode, sCode, lbl, bTest ? `${bTest.aW}${bTest.aH}${bTest.b}${bTest.bt}${bTest.c}` : '', bCode === 0 && desc !== null ? [desc.slice(0, 260), String(bd).slice(0, 260)] : null, split, sDiag, sfCode];
            });
            const sRel = recs(page.powerStructure?.factionRelationships); const bRel = B.v ? new Map(recs(B.v.factionRelationships).map((r) => [relKey(r), r])) : null;
            const relDm = sRel.filter((r) => typeof r.dmNote === 'string').map((r) => [relKey(r), bRel ? (bRel.get(relKey(r))?.dmNote === r.dmNote ? 1 : 0) : -2]);
            const m3 = { why: B.why || null, rows, relDm, Bnames: B.v ? recs(B.v.factions).map(nameOf) : [] };
            if (P.hide) {
              // THE HIDING PAGE: B and S with every withheld power absent (the served roster) against S with a masked row kept
              const withheld = [...W, ...recH];
              m3.Brecreates = m3.Bnames.filter((n) => withheld.includes(n));
              const hitStr = (s) => { const h = test(s); return `${h.aW}${h.aH}${h.b}${h.bt}${h.c}${h.cs}:${h.strict.join(',')}`; };
              m3.Bhits = B.v ? recs(B.v.factions).filter((f) => servedNames.includes(nameOf(f))).map((f) => [nameOf(f), hitStr(String(f.desc ?? ''))]) : [];
              let stRec = null; try { stRec = standings(recs(A.powerStructure?.factions), A.institutions, A.powerStructure?.publicLegitimacy); } catch { stRec = null; }
              const keptRows = [...served, ...recRows.filter((f) => withheld.includes(nameOf(f))).map((f) => ({ ...f, faction: HIDDEN_POWER_MASK, name: undefined }))];
              let stKept = null; try { stKept = standings(keptRows, page.institutions, page.powerStructure?.publicLegitimacy); } catch { stKept = null; }
              m3.S = served.map((f) => {
                const n = nameOf(f); const rd = stored.get(n)?.desc; const base = stRec && typeof rd === 'string' ? baseOf(rd, stRec.get(n) || '') : null;
                if (base === null || !stS) return [n, 'nobase'];
                const sAbs = join(base, stS.get(n) || ''); const sKept = stKept ? join(base, stKept.get(n) || '') : null;
                const hA = test(sAbs);
                return [n, hitStr(sAbs), sKept === null ? '' : hitStr(sKept), sAbs === rd ? 1 : 0, sKept !== null && /an unseen interest/.test(sKept) ? sKept.slice(0, 300) : null, hA.cs ? sAbs.slice(0, 300) : null, base.length < sAbs.length && hA.cs ? (test(base).cs ? 'base' : 'standing') : hA.cs ? 'base' : null];
              });
            }
            P.m3 = m3;
            try { P.y = cardsY(page, recNames, eng === 'sv'); } catch (e) { P.yErr = String(e?.message).slice(0, 120); } // R5D-1
            try {
              const st = derivePowerStrata(page); const cc = coupContenders(page);
              tally([...strings(st, 'strata', []), ...strings(cc, 'coup', [])], test, P.m5, P.m5kw, P.m5ex, 'm5', P.m5cs);
            } catch (e) { P.m5err = String(e?.message).slice(0, 80); }
          }
          rec.pages[`${dm ? 'dm' : 'off'}|${k}|${eng}`] = P;
        }
      }
    }
    // R5D-1 THE PLANTS (M3): a density host hidden by hand, a noble power hidden by hand; against the place with it never there
    rec.y = { plants: [], hosts: recs(A.powerStructure?.factions).filter((f) => f.contestsNiche).map((f) => [nameOf(f), f.contestsNiche]) };
    {
      const fs = recs(A.powerStructure?.factions); const gov = fs.find((f) => f.isGoverning === true);
      const { seatKey } = await import(`${SRC}/src/domain/density/seatKey.js`);
      const hostRow = fs.find((f) => f !== gov && fs.some((r) => r.contestsNiche && r !== f && r.contestsNiche === seatKey(f)));
      const nobleRow = fs.find((f) => f !== gov && (f.category || inferFactionCategory(nameOf(f))) === 'noble');
      const savedOf = (r) => { const x = { ...r }; delete x.publicProse; return clone(withPublicProse(x, composePublicProse(x))); };
      for (const [kind, row] of [['host', hostRow], ['noble', nobleRow]]) {
        if (!row) { rec.y.plants.push({ kind, none: 1 }); continue; }
        const n = nameOf(row);
        const hid = clone(A); for (const L of [hid.powerStructure?.factions, hid.factions]) if (Array.isArray(L)) L.forEach((f, i) => { if (isRec(f) && nameOf(f) === n) L[i] = { ...f, hidden: true }; });
        const nev = clone(A); for (const k of ['powerStructure', '']) { const o = k ? nev[k] : nev; if (o && Array.isArray(o.factions)) o.factions = o.factions.filter((f) => !(isRec(f) && nameOf(f) === n)); }
        if (Array.isArray(nev.powerStructure?.factionRelationships)) nev.powerStructure.factionRelationships = nev.powerStructure.factionRelationships.filter((r) => !(Array.isArray(r?.pair) && r.pair.map(String).includes(n)));
        const docsY = {};
        for (const [tag, doc0] of [['hide', savedOf(hid)], ['never', savedOf(nev)]]) {
          const svY = await server(clone(doc0), false, {}); const twY = V.twin(doc0, false, {});
          docsY[tag] = { sv: (() => { try { const p = V.veil.projectServedVeil(clone(svY.data), svY.ov); return rederiveForPage(clone(p), { unveiled: !V.veil.isServedVeil(svY.ov) }); } catch (e) { return { err: String(e?.message).slice(0, 80) }; } })(),
            tw: (() => { try { return rederiveForPage(clone(twY), { unveiled: true }); } catch (e) { return { err: String(e?.message).slice(0, 80) }; } })() };
        }
        const pl = { kind, n, cat: row.category ?? null, power: row.power ?? null, eng: {} };
        for (const eng of ['sv', 'tw']) {
          const ph = docsY.hide[eng]; const pn = docsY.never[eng];
          if (!isRec(ph?.powerStructure) || !isRec(pn?.powerStructure)) { pl.eng[eng] = { err: ph?.err || pn?.err || 'no powers' }; continue; }
          const servedRaw = recs(ph.powerStructure.factions);
          const H = PK.pick(ph, { extraNames: recNames }); const Nv = PK.pick(pn, { extraNames: recNames });
          const tb = PK.table([...new Set([...recNames, ...servedRaw.map(nameOf)])]);
          const stN = new Map(PK.servedOf(pn).map((f) => [nameOf(f), PK.cutTail(String(f.desc ?? ''), tb).base]));
          pl.eng[eng] = { servedRow: servedRaw.some((f) => nameOf(f) === n) ? 1 : 0, masked: servedRaw.filter((f) => nameOf(f).includes(HIDDEN_POWER_MASK)).length,
            seat: [H.seatS, H.seatB ?? null, Nv.seatS, Nv.seatB ?? null],
            cards: PK.servedOf(ph).map((f) => { const m = nameOf(f); const sbase = PK.cutTail(String(f.desc ?? ''), tb).base; const hb = H.rows.get(m)?.base ?? null; const nb = Nv.rows.get(m)?.base ?? null;
              return [m, f.category || inferFactionCategory(m), tplOf(sbase), hb === null || nb === null ? -1 : hb === nb ? 1 : 0, stN.has(m) ? (stN.get(m) === sbase ? 1 : 0) : -1, hb === null ? -1 : hb === sbase ? 1 : 0, H.rows.get(m)?.how ?? null, hb !== nb ? [String(hb).slice(0, 200), String(nb).slice(0, 200)] : null, tplOf(hb), hb !== null && hb !== sbase ? [sbase.slice(0, 220), String(hb).slice(0, 220), String(stN.get(m) ?? null).slice(0, 220)] : null]; }) };
        }
        rec.y.plants.push(pl);
      }
    }
    out.towns.push(rec);
  }
  await db.end();
  out.meta.ended = new Date().toISOString(); out.meta.walk = walk; // R5D-0
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
