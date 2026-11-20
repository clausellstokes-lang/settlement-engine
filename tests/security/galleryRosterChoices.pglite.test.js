/**
 * galleryRosterChoices.pglite.test.js — R3 (VEIL-22's builder; SUB-BRIEF-VR7 point 5; the chairs' VR7, VR11/VR31, VR21,
 * VR29, VR39, VR42 and the power observable of 03:15 UTC, each vetoable by the owner): THE DRAWN CONDITIONAL ROWS, where a
 * house is hidden whole, on every non-owner read.
 *
 * THROUGH THE SERVER (VR15): born towns stored on a pglite chain of every migration on disk, each shared with the three
 * family groupings and the plot-hooks tab OPENED by hand and every hideable house hidden whole (the default veil's houses),
 * Reveal DM off and on; a CONTROL share whose DM SHOWS every hideable house by hand; and the default veil (the groupings
 * shut). Read as a non-owner by the gallery read, the party link, the import and the campaign map's member. Each row of the
 * roster-choice registry whose server is 212 :: _gallery_veil_roster_choices holds there:
 *   VR39: no served crime type that no town of the hidden-free pool has (the counterfactual births with every hideable
 *     house taken out, and the born towns that hold none); a town whose criminal house the DM SHOWS keeps its types;
 *     VR29: crimeTypes stays an array, absent only where block:defense.criminalStructure is shut.
 *   THE POWER OBSERVABLE / VR42: no served criminal power but the governing one; the governing row IS served.
 *   VR11 / VR31: the served shares sum to 100 wherever any power is withheld; no served relation names an unserved power.
 *   (a) economy.complexity: the engine's own ladder over the served rows; the gates tail and the foothold word as the
 *     engine writes them for the served houses. (b) the rest absent where a hidden house could have chosen them.
 * The owner's record keeps every row. The client twin (projectShareVeil over galleryPayloadFor) sends what the server
 * sends at every R3 path. RED at R3's base (d136940c3): docs/chair/2026-11-20/veil/out/v21/r3/red.txt.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { appendFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';

const ARM_TIMEOUT_MS = 600_000; // deadlock guard for the twin arm (it projects every read again), not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
/** The measures the hand-back quotes, to R3_MEASURES where it is set (the config silences the console). */
const note = (...a) => { if (process.env.R3_MEASURES) appendFileSync(process.env.R3_MEASURES, `${a.join(' ')}\n`); };
/** A stable spelling (keys sorted): a jsonb column gives keys back in its own order. */
const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
// the measure's seeds (out/v21/r3/measure.txt): each row's case among them, and four towns with no hideable house
const SEEDS = ['town-infiltrated-0-12', 'city-insurgency-1-104', 'city-infiltrated-0-32', 'city-politically_fractured-0-40', 'city-none-1-113',
  'metropolis-infiltrated-0-62', 'city-infiltrated-1-112', 'metropolis-none-0-61', 'city-insurgency-0-44', 'metropolis-indebted-0-56',
  'town-indebted-0-16', 'city-under_siege-0-48', 'village-insurgency-0-4', 'town-politically_fractured-0-20', 'city-indebted-0-36', 'metropolis-insurgency-0-64'];
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const BENEATH = /smuggling (?:network|operation)|underground (?:network|city)/i;
const RIVAL_TEXTS = ['Wealthy merchant families hold exclusive civic power; political office is effectively purchased.',
  'Wealthy merchant families hold the civic offices; political office is effectively purchased.',
  'Civic power belongs solely to the wealthy merchant families, and office is bought in all but name.',
  'Civic power rests with the wealthy merchant families, and office is bought in all but name.',
  'A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases.',
  'A handful of rich merchant houses hold the seat of power here; a political post is, in practice, something one purchases.'];
const SMUGGLING_HOOK = /smuggl/i;
const crim = (f) => isRec(f) && (String(f.category || '').toLowerCase() === 'criminal' || /thie/i.test(String(f.faction ?? f.name ?? '')));
const spOf = (d) => d?.economicState?.safetyProfile || {};
const R3_PATHS = [/^powerStructure\.factions\[\]\.(faction|power|category|isGoverning)$/, /^powerStructure\.factionRelationships\[\]\.(pair\[\]|type|direction)$/,
  /^economicState\.economicComplexity$/, /^economicState\.safetyProfile\.(economicDragDesc|guardEffectivenessDesc|safetyDesc)$/,
  /^economicState\.safetyProfile\.crimeTypes\[\]\.type$/, /^economicState\.safetyProfile\.plotHooks\[\]$/, /^history\.currentTensions\[\]\.type$/,
  /^history\.(historicalEvents|eventsTimeline)\[\]\.type$/, /^institutions\[\]\.desc$/];

/** Every value whose normalised path the regex matches, keyed by its indexed path. */
function valuesAt(doc, re) {
  const out = new Map();
  const walk = (v, norm, exact) => {
    if (norm && re.test(norm)) { out.set(exact, J(v)); return; }
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${norm}[]`, `${exact}[${i}]`));
    else if (isRec(v)) for (const k of Object.keys(v)) walk(v[k], norm ? `${norm}.${k}` : k, exact ? `${exact}.${k}` : k);
  };
  walk(doc, '', '');
  return out;
}

describe('R3: the drawn conditional rows where a house is hidden whole (through the server; the twin beside it)', () => {
  let towns;
  let reads;
  let veil;
  let pool;
  let derive;

  beforeAll(async () => {
    const db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const { isHideableHouse } = await import('../../src/domain/people/cardVeil.js');
    const { deriveEconomicComplexity } = await import('../../src/generators/economy/prosperity.js');
    const { criminalStructureKeyOf } = await import('../../src/domain/facts/criminalStructureKey.js');
    derive = { deriveEconomicComplexity, criminalStructureKeyOf };
    veil = await import('../../src/domain/display/galleryVeil.js');
    await loadGenerationLawPayloads();
    const birth = (size, crisis, seed, drop) => {
      const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      let t = generateSettlementPipeline(cfg, null, { seed, customContent: {}, onStep: drop ? (_n, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
      if (drop) cut(t.institutions);
      t = { ...t }; delete t.publicProse;
      return clone(withPublicProse(t, composePublicProse(t)));
    };
    towns = SEEDS.map((k) => {
      const [size, crisis] = k.split('-');
      const seed = `r3m-${k}`;
      const stored = birth(size, crisis, seed, null);
      const hideable = (stored.institutions || []).filter((h) => isHideableHouse(h));
      return { seed: k, stored, hideable, B: hideable.length ? birth(size, crisis, seed, (h) => isHideableHouse(h)) : null };
    });
    // THE HIDDEN-FREE POOL (VR39): the crime types of every town that holds no hideable house (the counterfactual births
    // and the born towns with none)
    pool = new Set(towns.flatMap((t) => [t.B, t.hideable.length ? null : t.stored]).filter(Boolean)
      .flatMap((d) => (Array.isArray(spOf(d).crimeTypes) ? spOf(d).crimeTypes.map((c) => c?.type) : [])));
    const at = '2026-11-01T00:00:00.000Z';
    const idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
    reads = [];
    let n = 0;
    for (const t of towns) {
      const shows = t.hideable.flatMap((h) => [`card:institution:${idOf(h)}`, ...['description', 'function', 'services', 'people'].map((f) => `field:institution:${idOf(h)}:${f}`)]);
      const veils = [['open', [...OPEN].map((a) => ({ address: a, hidden: false })), [false, true]],
        ['shown', [...OPEN, ...shows].map((a) => ({ address: a, hidden: false })), [false]],
        ['default', [], [false]], ['unmarked', null, [false]]];
      for (const [kind, deltas, dms] of veils) for (const dm of dms) {
        n += 1;
        const ov = deltas === null ? {} : veil.writeShareVeil({}, deltas, { mode: 'live', at });
        const id = `7e530000-0000-0000-0000-${String(n).padStart(12, '0')}`;
        const slug = `rc${n}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(t.stored.name || 'T'), String(t.stored.tier || 'town'), J(t.stored), slug, `${slug}-link`, J(ov), dm]);
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, J({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
        await db.exec(`set test.uid = '';`);
        const docs = {
          gallery: (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d,
          map: (await db.query('select public.get_gallery_map($1) #> \'{members,0,settlement}\' d', [`${slug}-map`])).rows[0]?.d,
        };
        if (!dm) docs.link = (await db.query('select public.get_unlisted_dossier($1) -> \'dossier\' d', [`${slug}-link`])).rows[0]?.d;
        await db.exec(`set test.uid = '${READER}';`);
        docs.import = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
        await db.exec(`set test.uid = '${OWNER}';`);
        const own = (await db.query('select data from public.settlements where id = $1', [id])).rows[0]?.data;
        await db.exec(`set test.uid = '';`);
        reads.push({ t, kind, dm, ov, docs, own });
      }
    }
    await db.close();
  }, PGLITE_BOOT_TIMEOUT_MS);

  const hiddenReads = () => reads.filter((r) => r.kind === 'open' && r.t.hideable.length);
  /** Every non-owner document of a read that serves one. */
  const docsOf = (r) => Object.entries(r.docs).filter(([, d]) => isRec(d));

  it('the births cover each row (the measure\'s cases are reached)', () => {
    const H = towns.filter((t) => t.hideable.length);
    expect(H.length).toBeGreaterThanOrEqual(10);
    expect(towns.filter((t) => !t.hideable.length).length).toBeGreaterThanOrEqual(3);
    expect(H.some((t) => (t.stored.powerStructure?.factions || []).some((f) => crim(f) && f.isGoverning === true))).toBe(true);
    expect(H.some((t) => (t.stored.powerStructure?.factions || []).some((f) => crim(f) && f.isGoverning !== true))).toBe(true);
    expect(H.some((t) => /beneath the walls/.test(spOf(t.stored).guardEffectivenessDesc || ''))).toBe(true);
    expect(H.some((t) => /limited foothold/.test(spOf(t.stored).safetyDesc || ''))).toBe(true);
    expect(H.some((t) => (spOf(t.stored).crimeTypes || []).some((c) => c?.type === 'Smuggling'))).toBe(true);
    expect(H.some((t) => (t.stored.history?.currentTensions || []).some((x) => x?.type === 'crime_wave'))).toBe(true);
    expect(H.some((t) => (t.stored.institutions || []).some((h) => RIVAL_TEXTS.includes(h?.desc)))).toBe(true);
  });

  it('VR39: no served crime type that no town of the hidden-free pool has; VR29: the key stays an array, absent only where its grouping is shut', () => {
    const bad = [];
    for (const r of hiddenReads()) for (const [read, d] of docsOf(r)) {
      const ct = spOf(d).crimeTypes;
      if (!Array.isArray(ct)) { bad.push(`${r.t.seed} dm=${r.dm} ${read}: crimeTypes ${J(ct)}`); continue; }
      for (const c of ct) if (!pool.has(c?.type)) bad.push(`${r.t.seed} dm=${r.dm} ${read}: ${J(c?.type ?? c)}`);
    }
    for (const r of reads.filter((x) => x.kind === 'default')) for (const [read, d] of docsOf(r)) if ('crimeTypes' in spOf(d)) bad.push(`${r.t.seed} default ${read}: the shut grouping sent crimeTypes`);
    expect(bad).toEqual([]);
  });

  it('VR39 CONTROL: a town whose criminal houses the DM SHOWS keeps its crime types, as stored', () => {
    const bad = [];
    for (const r of reads.filter((x) => x.kind === 'shown' && x.t.hideable.length)) {
      const want = (spOf(r.t.stored).crimeTypes || []).map((c) => c?.type);
      const got = (spOf(r.docs.gallery).crimeTypes || []).map((c) => c?.type);
      if (J(got) !== J(want)) bad.push(`${r.t.seed}: ${J(got)} != ${J(want)}`);
    }
    expect(bad).toEqual([]);
  });

  it('THE POWER OBSERVABLE / VR42: no served criminal power but the governing one, which IS served; the shares sum to 100 where any power is withheld (VR11/VR31); no relation names an unserved power', () => {
    const bad = [];
    for (const r of hiddenReads()) for (const [read, d] of docsOf(r)) {
      const fs = d.powerStructure?.factions || [];
      for (const f of fs) if (crim(f) && f.isGoverning !== true) bad.push(`${r.t.seed} dm=${r.dm} ${read}: criminal power ${f.faction ?? f.name}`);
      const gov = (r.t.stored.powerStructure?.factions || []).find((f) => f?.isGoverning === true);
      if (gov && !fs.some((f) => f?.isGoverning === true && f.faction === gov.faction)) bad.push(`${r.t.seed} ${read}: the governing row ${gov.faction} not served`);
      if (fs.length < (r.t.stored.powerStructure?.factions || []).length) {
        const sum = fs.reduce((a, f) => a + Number(f.power), 0);
        if (sum !== 100 || fs.some((f) => !Number.isInteger(f.power))) bad.push(`${r.t.seed} dm=${r.dm} ${read}: shares ${J(fs.map((f) => f.power))}`);
      }
      const names = new Set(fs.map((f) => f.faction ?? f.name));
      for (const x of d.powerStructure?.factionRelationships || []) if (!Array.isArray(x?.pair) || x.pair.some((p) => !names.has(p))) bad.push(`${r.t.seed} dm=${r.dm} ${read}: relation ${J(x?.pair)}`);
    }
    expect(bad).toEqual([]);
  });

  it('VR31 on EVERY read (marked and unmarked, towns with no hidden house too): wherever a power is withheld, whatever withheld it, the served shares sum to 100', () => {
    const bad = [];
    let judged = 0;
    for (const r of reads) for (const [read, d] of docsOf(r)) {
      const fs = d.powerStructure?.factions || [];
      if (fs.length >= (r.t.stored.powerStructure?.factions || []).length) continue;
      judged += 1;
      const sum = fs.reduce((a, f) => a + Number(f.power), 0);
      if (sum !== 100) bad.push(`${r.t.seed} ${r.kind} dm=${r.dm} ${read}: ${J(fs.map((f) => f.power))}`);
    }
    note('R3 VR31: reads with a power withheld, judged:', judged);
    expect(judged).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('THE POWER OBSERVABLE: the Defense key a visitor derives from the served document is "organized" only by the governing power (VR42)', () => {
    const tally = {};
    const bad = [];
    for (const r of hiddenReads().filter((x) => !x.dm)) {
      const key = derive.criminalStructureKeyOf(r.docs.gallery);
      tally[String(key)] = (tally[String(key)] || 0) + 1;
      if (key === 'organized' && !(r.docs.gallery.powerStructure?.factions || []).some((f) => crim(f) && f.isGoverning === true)) bad.push(`${r.t.seed}: organized`);
    }
    const control = {};
    for (const r of reads.filter((x) => x.kind === 'open' && !x.dm && !x.t.hideable.length)) { const k = String(derive.criminalStructureKeyOf(r.docs.gallery)); control[k] = (control[k] || 0) + 1; }
    note('R3 derived Defense keys, groupings open: hidden towns', J(tally), '| control (no hideable house)', J(control));
    expect(bad).toEqual([]);
  });

  it('(a) economy.complexity is the engine\'s own ladder over the served rows; the gates tail and the foothold word as the engine writes them for the served houses', () => {
    const bad = [];
    for (const r of hiddenReads()) for (const [read, d] of docsOf(r)) {
      const es = d.economicState || {};
      if ('economicComplexity' in es) {
        const want = derive.deriveEconomicComplexity(es.tier, (es.incomeSources || []).length, (es.primaryExports || []).length,
          (d.institutions || []).some((h) => ['market', 'trading', 'merchant', 'guild'].some((w) => String(h?.name || '').toLowerCase().includes(w))),
          es.foodSecurity?.foodRecord ?? null, es.incomeSources || []);
        if (es.economicComplexity !== want) bad.push(`${r.t.seed} ${read}: complexity ${es.economicComplexity} != ${want}`);
      }
      const beneath = (d.institutions || []).some((h) => BENEATH.test(String(h?.name || '')));
      const sp = spOf(d);
      if (!beneath && /beneath the walls/.test(String(sp.guardEffectivenessDesc || ''))) bad.push(`${r.t.seed} ${read}: gates tail`);
      if (!beneath && /beneath the walls/.test(String(sp.safetyDesc || ''))) bad.push(`${r.t.seed} ${read}: Very Safe gates line`);
      const org = (d.institutions || []).some((h) => /thieves|criminal|gang|smuggler|fence|gambl/i.test(`${h?.name || ''} ${h?.catalogId || ''}`));
      if (!org && /limited foothold/.test(String(sp.safetyDesc || ''))) bad.push(`${r.t.seed} ${read}: foothold word`);
    }
    expect(bad).toEqual([]);
  });

  it('(b) a smuggling hook, a crime-wave tension or event, a rival-power description and the criminal desk leave where no served house or power accounts for them', () => {
    const bad = [];
    for (const r of hiddenReads()) for (const [read, d] of docsOf(r)) {
      const houses = d.institutions || [];
      const smug = houses.some((h) => /smuggling network|smuggling operation/i.test(String(h?.name || '')));
      for (const h of spOf(d).plotHooks || []) if (SMUGGLING_HOOK.test(String(h)) && !smug) bad.push(`${r.t.seed} ${read}: hook ${String(h).slice(0, 40)}`);
      const signal = (d.powerStructure?.factions || []).some((f) => String(f?.category || '').toLowerCase() === 'criminal')
        || houses.some((h) => String(h?.category || '').toLowerCase() === 'criminal' || String(h?.priorityCategory || '').toLowerCase() === 'criminal');
      if (!signal && (d.history?.currentTensions || []).some((x) => x?.type === 'crime_wave')) bad.push(`${r.t.seed} ${read}: crime-wave tension`);
      for (const h of houses) if (RIVAL_TEXTS.includes(h?.desc)) bad.push(`${r.t.seed} ${read}: rival-power desc ${h.name}`);
      if (d.publicProse?.blocks && 'defense:criminal' in d.publicProse.blocks) bad.push(`${r.t.seed} ${read}: defense:criminal`);
    }
    expect(bad).toEqual([]);
  });

  it('safety.economicDragDesc leaves where a hidden house raised it (the criminal-house flag or the organised name it raised); VR42: where only the governing body stands it stays', () => {
    const bad = [];
    const vr42 = [];
    for (const r of hiddenReads().filter((x) => !x.dm)) {
      const inst = (d) => d?.economicState?.safetyProfile?.compound?.inst || {};
      const flipped = inst(r.t.stored).hasCriminalInst === true && !(r.t.hideable.length === 0)
        && !(r.t.stored.institutions || []).some((h) => !r.t.hideable.includes(h) && /thieves' guild|black market|smuggling|assassins|street gang|front business|gambling den|underground city|multiple criminal/i.test(String(h?.name || '')));
      const served = spOf(r.docs.gallery).economicDragDesc;
      if (flipped && served != null) bad.push(`${r.t.seed}: drag served`);
      if ((r.t.stored.powerStructure?.factions || []).some((f) => crim(f) && f.isGoverning === true)) vr42.push(`${r.t.seed}: ${served == null ? 'withheld' : 'served'} (B: ${spOf(r.t.B).economicDragDesc == null ? 'none' : 'drawn'})`);
    }
    note('R3 VR42 towns, economicDragDesc:', J(vr42));
    expect(bad).toEqual([]);
  });

  it('the owner\'s own record keeps every row', () => {
    const bad = [];
    for (const r of reads) if (canon(r.own) !== canon(r.t.stored)) bad.push(r.t.seed);
    expect(bad).toEqual([]);
  });

  it('the twin (projectShareVeil over galleryPayloadFor) sends what the server sends at every R3 path of the gallery read', () => {
    const differ = [];
    for (const r of reads) {
      const twin = veil.projectShareVeil(veil.galleryPayloadFor(r.t.stored, { shareDm: r.dm, memberOverrides: r.ov }), r.ov);
      for (const re of R3_PATHS) {
        const a = [...valuesAt(r.docs.gallery, re)].sort(); const b = [...valuesAt(twin, re)].sort();
        if (J(a) !== J(b)) differ.push(`${re} @ ${r.t.seed} ${r.kind} dm=${r.dm}`);
      }
      // the criminal desk by its presence: its wording differs between the engines at R3's base on every read (red.txt: a
      // twin-laxer class of R7's, VR15 (b)); R3's rule decides whether it is sent
      const has = (d) => !!d?.publicProse?.blocks && 'defense:criminal' in d.publicProse.blocks;
      if (has(r.docs.gallery) !== has(twin)) differ.push(`defense:criminal presence @ ${r.t.seed} ${r.kind} dm=${r.dm}`);
    }
    expect(differ).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
