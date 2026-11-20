// REVIEW-VEIL-12 — VR47's cold read (the honorific seeded by name and title). Born towns stored on chain RV10_TPL, shares
// UNMARKED and the DEFAULT veil, Reveal DM off and on; the gallery read as anon, then the tree's OWN client
// (fetchPublicDossier with the RPC answered by that row) gives the visitor's page model. Per drawn card (npcs):
// (A) INVARIANCE of the printed honorific (seatKeeperDisplay :: shownHonorificOf, the card's draw; connectionOf's name, the
//     Institutions tab's) under: the card's id changed; its institution key changed; `institution.veiled` toggled; every
//     other card removed; every hideable house removed from the page's institutions; every person id re-keyed (VR10);
// (B) a card drawn with an institution record that is NOT stamped public (veiled !== false) on a Reveal-DM-off page, and
//     whether its honorific prints (the title of a house the page does not name); and whether that institution is one the
//     share hides (a hidden house's title on a person's card: tier 1);
// (C) owner against visitor: the owner's card (stored town) and the visitor's card of the same name print the same form
//     (recorded; gender is VR48's).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: globalThis.__rv12row ? [globalThis.__rv12row] : null, error: null }), auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }) } }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
it('hon', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV12_DB || 'hon';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const lib = await import(`${SRC}/src/lib/gallery.js`); const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const SKD = await import(`${SRC}/src/domain/people/seatKeeperDisplay.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const T = {}; const ex = {}; const bump = (k, bad, e) => { const r = T[k] = T[k] || { n: 0, bad: 0 }; r.n += 1; if (bad) { r.bad += 1; (ex[k] = ex[k] || []).length < 4 && ex[k].push(e); } };
  const H = (card, page) => { let a = ''; let b = ''; try { a = SKD.shownHonorificOf(card, page); } catch (e) { a = `threw ${e.message}`; } try { b = SKD.connectionOf(card, page, false).name; } catch (e) { b = `threw ${e.message}`; } return `${a}|${b.replace(card?.name || '\u0000', '<N>')}`; };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'city', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'insurgency', 'indebted', 'succession_void', 'none']) {
    n += 1; const seed = `rv12-hon-${size}-${crisis}-${k}-${n}`;
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; delete A.publicProse; A = withPP(A, compose(A)); A = clone(A);
    const hiddenNames = new Set((A.institutions || []).filter(hideable).map((h) => String(h.name)));
    for (const marked of [false, true]) for (const dm of [false, true]) {
      const ov = marked ? veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }) : {};
      const id = `abcd9c00-0000-0000-0000-${String(n * 4 + (marked ? 2 : 0) + (dm ? 1 : 0)).padStart(12, '0')}`; const slug = `h${n}${marked ? 'm' : 'u'}${dm ? 'd' : 'p'}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,$5,true,false)`, [id, JSON.stringify(A), slug, JSON.stringify(ov), dm]);
      await db.query('set role anon'); const row = (await db.query('select * from public.get_gallery_dossier($1)', [slug])).rows[0]; await db.query('reset role');
      await db.query('delete from public.settlements where id = $1', [id]);
      globalThis.__rv12row = clone(row); const pageR = await lib.fetchPublicDossier(slug); globalThis.__rv12row = null;
      const page = pageR?.settlement || pageR?.data || pageR; const tag = `${marked ? 'marked' : 'unmarked'} dm=${dm}`;
      if (!page?.npcs) { bump(`page has no npcs (${tag})`, true, seed); continue; }
      for (const [i, card] of page.npcs.entries()) {
        const base = H(card, page); if (!card?.institution) { bump(`(A) cards with no institution (${tag})`, false, ''); continue; }
        const variants = {
          id: (p) => { p.npcs[i].id = `npc_zz${i}x`; },
          instKey: (p) => { if (isRec(p.npcs[i].institution)) { p.npcs[i].institution.key = `zz_${i}`; } },
          veiledToggle: (p) => { if (isRec(p.npcs[i].institution)) p.npcs[i].institution.veiled = !(p.npcs[i].institution.veiled === true); },
          othersGone: (p) => { p.npcs = [p.npcs[i]]; },
          hideableGone: (p) => { p.institutions = (p.institutions || []).filter((h) => !hideable(h)); },
          rekeyAll: (p) => { const m = new Map(); p.npcs.forEach((c, j) => { const nid = `npc_${(j * 7919 + 13).toString(16).padStart(16, '0')}`; m.set(c.id, nid); c.id = nid; }); for (const r of p.relationships || []) for (const f of ['from', 'to', 'npc1Id', 'npc2Id']) if (m.has(r[f])) r[f] = m.get(r[f]); },
        };
        for (const [vn, fn] of Object.entries(variants)) { const p = clone(page); fn(p); const j = vn === 'othersGone' ? 0 : i; const h2 = H(p.npcs[j], p);
          bump(`(A) honorific invariant under ${vn} (${tag})`, h2 !== base, `${seed}: ${card.name}: "${base}" -> "${h2}"`); }
        // (B) a drawn institution record not stamped public, with Reveal DM off
        const inst = card.institution; const notPublic = !(isRec(inst) && inst.veiled === false); const hon = base.split('|')[0];
        if (!dm) { bump(`(B) drawn card's institution not stamped public (${tag})`, notPublic && !!hon, `${seed}: ${card.name} inst ${JSON.stringify(inst).slice(0, 120)} prints "${hon}"`);
          const instName = String(isRec(inst) ? (inst.name || inst.key || '') : ''); bump(`(B) drawn card names a HIDDEN house's institution (${tag})`, marked && hiddenNames.has(instName), `${seed}: ${card.name} -> ${instName} "${hon}"`); }
        // (C) owner against visitor, same name
        const own = (A.npcs || []).find((c) => c?.name === card.name); if (own) { const ho = H(own, A); bump(`(C) owner's form equals visitor's [owner ${own.gender === 'female' && card.gender !== 'female' ? 'female, visitor unsexed' : 'other'}] (${tag})`, ho !== base, `${seed}: ${card.name}: owner "${ho}" visitor "${base}" (gender owner ${own.gender} visitor ${card.gender})`); }
      }
    }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify({ T, ex }, null, 1));
}, 14_400_000);
