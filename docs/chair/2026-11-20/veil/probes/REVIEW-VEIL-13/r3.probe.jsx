// REVIEW-VEIL-13 — R3's cold read, MY OWN SEARCH AND HUSK DETECTOR (the chair's rulings 37 (a), 38 (a)(b), 42 (1)(3)).
// Pool: the gate's recipe (r3m-<size>-<crisis>-<k>-<idx>), the gate's setting (the three criminal groupings and plot hooks
// opened by hand, every hideable house hidden by the default veil). Doors: get_gallery_dossier and get_unlisted_dossier
// (anon), Reveal DM off and on. WITHHELD NAMES: every stored house the read does not serve and every stored power the read
// does not serve, with their ids. THE SEARCH (ruled): case-blind; the name and its bare form (no bracketed qualifier); a
// possessive or plural ending ("'s", "'", "s", "es") counts as a boundary; in every served string AND every key; the ONLY
// exemption: the hit lies wholly inside an occurrence of a SERVED house or power name in the same string (named). Ids: as a
// whole string, a word-bounded substring, or a key. THE HUSK (ruled 42 (1)): a served row of a list that equals a stored row
// of the same path pattern with fields removed or emptied, where a removed/emptied field held a withheld name or id.
// KEY-LEVEL (42 (3)): `contestsNiche` on a served power and `factionAffiliation` on a served person: present in stored,
// absent in served: counted (measured, not judged). RV13_PLANT=1: a qualified plant ("<name> (the Black Hand)") on the
// first hidden house, the possessive/plural plants in a served string are NOT made (the probe only searches).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 2);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v);
const J = (v) => JSON.stringify(canon(v));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const folds = (x) => { const a = String(x || '').toLowerCase().replace(/’/g, "'").trim(); const b = a.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim(); return [...new Set([a, b])].filter((z) => z.length >= 4); };
// every (path, string) leaf and every (path, key)
const leaves = (v, p = '', out = []) => { if (typeof v === 'string') out.push([p, v]); else if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${p}[${i}]`, out)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { out.push([`${p}.{key}`, k]); leaves(x, `${p}.${k}`, out); } return out; };
const pat = (p) => p.replace(/\[\d+\]/g, '[]');
it('r3', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = 'r3read';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
  const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  const T = {}; const ex = {}; const bump = (k, bad, e) => { const r = T[k] = T[k] || { n: 0, bad: 0 }; r.n += 1; if (bad) { r.bad += 1; (ex[k] = ex[k] || []).length < 6 && ex[k].push(e); } };
  const exempted = {}; const keyLevel = {};
  const pname = (f) => String(f?.faction ?? f?.name ?? '');
  let n = 0; let towns = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    n += 1; const tag = `${size}-${crisis}-${k}-${n}`; const seed = `r3m-${tag}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }); } catch { continue; }
    A = clone(A); delete A.publicProse; A = clone(withPublicProse(A, composePublicProse(A)));
    const hid = (A.institutions || []).filter((h) => isHideableHouse(h)); if (!hid.length) continue;
    if (process.env.RV13_PLANT) { const old = hid[0].name; const nu = `${old} (the Black Hand)`; const rn = (v) => (typeof v === 'string' ? v.split(old).join(nu) : Array.isArray(v) ? v.map(rn) : isRec(v) ? Object.fromEntries(Object.entries(v).map(([kk, x]) => [kk, rn(x)])) : v); A = rn(A); }
    towns += 1;
    const stHouses = A.institutions || []; const stPowers = A.powerStructure?.factions || [];
    for (const dm of [false, true]) {
      const id = `abcd9e13-0000-0000-0000-${String(n * 2 + (dm ? 1 : 0)).padStart(12, '0')}`; const slug = `r3${n}${dm ? 'd' : 'p'}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,$6,true,false)`, [id, JSON.stringify(A), slug, `u${slug}`, JSON.stringify(ov), dm]);
      await db.query('set role anon');
      const S = (await db.query('select data from public.get_gallery_dossier($1)', [slug])).rows[0]?.data;
      const L = (await db.query('select public.get_unlisted_dossier($1) as out', [`u${slug}`])).rows[0]?.out?.dossier;
      await db.query('reset role'); await db.query('delete from public.settlements where id = $1', [id]);
      const W = veil.projectShareVeil(veil.galleryPayloadFor(clone(A), { shareDm: dm, memberOverrides: ov }), ov);
      for (const [door, D] of [['gallery', S], ['link', L], ['twin', W]]) {
        const tg = `${door} dm=${dm}`; if (!D) { bump(`served nothing (${tg})`, true, tag); continue; }
        const svHouses = (D.institutions || []).map((h) => String(h?.name || '')).filter(Boolean);
        const svPowers = (D.powerStructure?.factions || []).map(pname).filter(Boolean);
        const svHouseSet = new Set(svHouses); const svPowSet = new Set(svPowers);
        const gone = [...stHouses.filter((h) => h?.name && !svHouseSet.has(h.name)).map((h) => ({ kind: 'house', name: h.name, id: h.id })),
          ...stPowers.filter((f) => pname(f) && !svPowSet.has(pname(f))).map((f) => ({ kind: 'power', name: pname(f), id: f.id }))];
        const servedNames = [...svHouses, ...svPowers].map((x) => x.toLowerCase().replace(/’/g, "'"));
        const L2 = leaves(D);
        // THE SEARCH
        let nameHits = 0;
        for (const g of gone) for (const f of folds(g.name)) {
          const re = new RegExp(`(^|[^a-z0-9])(${esc(f)})(?:'s|'|s|es)?(?=$|[^a-z0-9])`, 'g');
          for (const [p, s] of L2) {
            const low = s.toLowerCase().replace(/’/g, "'"); let m; re.lastIndex = 0;
            while ((m = re.exec(low))) {
              const st = m.index + m[1].length; const en = st + m[2].length;
              const inside = servedNames.find((sn) => { let i = low.indexOf(sn); while (i >= 0) { if (i <= st && i + sn.length >= en && sn !== f) return true; i = low.indexOf(sn, i + 1); } return false; });
              if (inside) { const kx = `"${f}" inside served "${inside}" (${pat(p)})`; exempted[kx] = (exempted[kx] || 0) + 1; continue; }
              nameHits += 1; if ((ex[`SEARCH (${tg})`] || []).length < 6) (ex[`SEARCH (${tg})`] = ex[`SEARCH (${tg})`] || []).push(`${tag} ${g.kind} "${f}" at ${pat(p)}: "${s.slice(Math.max(0, st - 40), en + 40)}"`);
              break;
            }
          }
        }
        T[`SEARCH a withheld name in no served string or key (${tg})`] = T[`SEARCH a withheld name in no served string or key (${tg})`] || { n: 0, bad: 0 }; T[`SEARCH a withheld name in no served string or key (${tg})`].n += 1; if (nameHits) T[`SEARCH a withheld name in no served string or key (${tg})`].bad += 1;
        // ids
        const ids = gone.map((g) => g.id).filter((x) => typeof x === 'string' && x.length >= 4);
        const idHit = ids.find((i) => L2.some(([, s]) => s === i || new RegExp(`(^|[^A-Za-z0-9_])${esc(i)}($|[^A-Za-z0-9_])`).test(s)));
        bump(`SEARCH a withheld id in no served string or key (${tg})`, !!idHit, `${tag}: ${idHit}`);
        // THE HUSK: a served row of a list = a stored row of the same pattern with naming fields removed or emptied
        const goneFold = gone.flatMap((g) => folds(g.name)); const goneIds = new Set(ids);
        const names = (v) => { const s = JSON.stringify(v ?? '').toLowerCase(); return goneFold.some((f) => s.includes(f)) || [...goneIds].some((i) => s.includes(i.toLowerCase())); };
        const stRows = {}; const walk = (v, p, out) => { if (Array.isArray(v)) v.forEach((x, i) => { if (isRec(x)) (out[pat(`${p}[]`)] = out[pat(`${p}[]`)] || []).push(x); walk(x, `${p}[${i}]`, out); }); else if (isRec(v)) for (const [kk, x] of Object.entries(v)) walk(x, `${p}.${kk}`, out); };
        walk(A, '', stRows); const svRows = {}; walk(D, '', svRows);
        let husks = 0;
        for (const [pp, rows] of Object.entries(svRows)) {
          const cands = (stRows[pp] || []).filter(names); if (!cands.length) continue;
          for (const r of rows) {
            if (names(r)) continue;
            const hit = cands.find((c) => { const keys = Object.keys(r); if (!keys.every((kk) => kk in c)) return false; let moved = 0; let same = 0;
              for (const kk of Object.keys(c)) { const a = c[kk]; const b = r[kk]; if (J(a) === J(b)) { same += 1; continue; } if (b === undefined || b === '' || b === null || (Array.isArray(b) && !b.length)) { if (names(a)) moved += 1; else return false; } else return false; }
              return moved > 0 && same > 0; });
            if (hit) { husks += 1; if ((ex[`HUSK (${tg})`] || []).length < 6) (ex[`HUSK (${tg})`] = ex[`HUSK (${tg})`] || []).push(`${tag} ${pp}: stripped ${Object.keys(hit).filter((kk) => J(hit[kk]) !== J(r[kk])).map((kk) => `${kk}=${JSON.stringify(hit[kk]).slice(0, 90)}->${JSON.stringify(r[kk] ?? null)}`).join('; ')} | kept ${Object.keys(r).join(',')}`); }
          }
        }
        T[`HUSK no stripped row of a list (${tg})`] = T[`HUSK no stripped row of a list (${tg})`] || { n: 0, bad: 0 }; T[`HUSK no stripped row of a list (${tg})`].n += 1; if (husks) T[`HUSK no stripped row of a list (${tg})`].bad += 1;
        // KEY-LEVEL (measured): contestsNiche on a served power; factionAffiliation on a served person
        for (const f of D.powerStructure?.factions || []) { const sf = stPowers.find((x) => pname(x) === pname(f)); if (!sf) continue; const kx = `contestsNiche ${'contestsNiche' in sf ? 'stored' : 'not stored'}/${'contestsNiche' in f ? 'served' : 'not served'} (${tg})`; keyLevel[kx] = (keyLevel[kx] || 0) + 1; }
        for (const p of D.npcs || []) { const sp = (A.npcs || []).find((x) => x?.name && x.name === p?.name); if (!sp) continue; const kx = `factionAffiliation ${sp.factionAffiliation ? 'stored' : 'not stored'}/${p.factionAffiliation ? 'served' : 'not served'} (${tg})`; keyLevel[kx] = (keyLevel[kx] || 0) + 1; }
        // power shares sum 100 where any is served
        const sh = (D.powerStructure?.factions || []).map((f) => Number(f?.power)).filter(Number.isFinite); const sum = sh.reduce((a, b) => a + b, 0);
        bump(`power shares sum 100 (${tg})`, sh.length > 0 && sum !== 100, `${tag}: ${sum}`);
        // VR42: the governing power's row is never removed while the government's name stays
        const gov = stPowers.find((f) => f?.isGoverning); if (gov && pname(gov)) { const outside = L2.some(([p, s]) => !/^\.powerStructure\.factions/.test(p) && s.includes(pname(gov))); bump(`VR42 governing row stays where its name is served (${tg})`, outside && !svPowSet.has(pname(gov)), `${tag}: ${pname(gov)} (${gov.category})`); }
      }
    }
  }
  const lines = [`towns with a hideable house: ${towns}`, ...Object.entries(T).map(([k2, v]) => `${v.bad}/${v.n}\t${k2}`), '', 'EXAMPLES', ...Object.entries(ex).flatMap(([k2, v]) => [k2, ...v.map((x) => `   ${x}`)]), '', 'EXEMPTED (a hit wholly inside a served name)', ...Object.entries(exempted).map(([k2, v]) => `${v}\t${k2}`), '', 'KEY-LEVEL (measured)', ...Object.entries(keyLevel).sort().map(([k2, v]) => `${v}\t${k2}`)];
  writeFileSync(process.env.RV10_OUT, lines.join('\n') + '\n');
  await db.end();
}, 14_400_000);
