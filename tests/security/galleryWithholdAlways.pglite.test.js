/**
 * galleryWithholdAlways.pglite.test.js — R2 (VEIL-21; SUB-BRIEF-VR7 point 5; the sixth chair's VR16 rule 1, the seventh
 * chair's VR28, VR33, VR37, each vetoable by the owner): WHAT NO NON-OWNER READ SENDS, WHATEVER THE VEIL.
 *
 * THROUGH THE SERVER (VR15): born towns stored on a pglite chain of every migration on disk, each shared four ways (the
 * default veil and unmarked; Reveal DM off and on) and read as a non-owner by every read that serves a document: the
 * gallery read, the party link, the import and the campaign map's member. Every row of the roster-choice registry built in
 * 212 :: _gallery_veil_withhold_always as `withhold`/`always` (src/domain/veil/rosterChoiceRegistry.js) is ABSENT from
 * every one of them; the stability keeps its band word alone; a crisis cast's stake or role row stays exactly where it
 * names what is served (VR37 (b)); the owner's own record still carries every row (VR16 (3)). The client twin
 * (galleryVeil.js :: projectShareVeil over galleryPayloadFor) sends the same at every registered path. THE PAGE
 * (pageRederive.js :: rederiveForPage) and THE IMPORT'S SAVE (importRederive.js :: rederiveServed) put back what they draw
 * from the served document alone, equal to the stored value where nothing is hidden. Stored towns carry a planted value at
 * the master-shape-only paths (a person's stressNote, the cast's absences, a stability with its cause), so both stored
 * shapes' paths are read on every town. RED at R2's base (cfd77fdef): every row present (out/v21/r2/red.txt).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 600_000;
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const BIRTHS = [['town', null], ['city', 'infiltrated'], ['metropolis', null], ['town', 'indebted']];

/** Every value whose differ-normalised path the regex matches, keyed by its indexed path. */
function valuesAt(doc, re) {
  const out = new Map();
  const walk = (v, norm, exact) => {
    if (norm && (re.test(norm) || re.test(`${norm} (only in A)`) || re.test(`${norm} (only in B)`))) { out.set(exact, JSON.stringify(v)); return; }
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${norm}[]`, `${exact}[${i}]`));
    else if (isRec(v)) for (const k of Object.keys(v)) walk(v[k], norm ? `${norm}.${k}` : k, exact ? `${exact}.${k}` : k);
  };
  walk(doc, '', '');
  return out;
}

/** Plant the master-shape-only paths so every town carries every row. */
function plant(t) {
  if (Array.isArray(t.npcs) && isRec(t.npcs[0])) t.npcs[0].stressNote = 'Planted stress note';
  for (const k of ['stress', 'stressors']) {
    const list = Array.isArray(t[k]) ? t[k] : [t[k]];
    for (const c of list) if (isRec(c) && isRec(c.cast)) c.cast.absent = [{ role: 'profiteer', reason: 'planted absence' }];
  }
  if (isRec(t.powerStructure) && Array.isArray(t.powerStructure.factions) && isRec(t.powerStructure.factions[0])) t.powerStructure.factions[0].legitimacyCrisis = true;
  if (isRec(t.powerStructure) && typeof t.powerStructure.stability === 'string' && !/[(—;]/.test(t.powerStructure.stability)) {
    t.powerStructure.stability = `${t.powerStructure.stability} (planted cause)`;
  }
  return t;
}

describe('R2: the withhold-always rows leave every non-owner read, both Reveal settings, marked and unmarked (through the server)', () => {
  let db;
  let towns;
  let rows;
  let reads;
  let veil;

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const { isHideableHouse } = await import('../../src/domain/people/cardVeil.js');
    const { REGISTRY_ROWS } = await import('../../src/domain/veil/rosterChoiceRegistry.js');
    veil = await import('../../src/domain/display/galleryVeil.js');
    await loadGenerationLawPayloads();
    rows = REGISTRY_ROWS.filter((r) => r.server === 'public._gallery_veil_withhold_always' && r.rule === 'withhold' && r.when === 'always')
      .map((r) => ({ id: r.id, re: new RegExp(r.path) }));
    towns = BIRTHS.map(([size, crisis], i) => {
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      const born = generateSettlementPipeline(cfg, null, { seed: `r2-withhold-always-${size}-${crisis || 'calm'}-${i}`, customContent: {} });
      const stored = plant(clone(withPublicProse(born, composePublicProse(born))));
      return { seed: `${size}-${crisis || 'calm'}-${i}`, stored, hidden: (stored.institutions || []).filter((h) => isHideableHouse(h)).length };
    });
    reads = [];
    let n = 0;
    for (const t of towns) {
      for (const [mark, ov] of [['marked', veil.writeShareVeil({}, [])], ['unmarked', {}]]) for (const dm of [false, true]) {
        n += 1;
        const id = `7e570000-0000-0000-0000-${String(n).padStart(12, '0')}`;
        const slug = `wa${n}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(t.stored.name || 'T'), String(t.stored.tier || 'town'), JSON.stringify(t.stored), slug, `${slug}-link`, JSON.stringify(ov), dm]);
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
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
        reads.push({ t, mark, dm, ov, docs, own });
      }
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('every withhold-always row is registered here and present on the stored towns (the plant reaches every path)', () => {
    expect(rows.length).toBeGreaterThan(50);
    const missing = rows.filter((r) => !towns.some((t) => valuesAt(t.stored, r.re).size > 0)).map((r) => r.id);
    expect(missing).toEqual([]);
    expect(towns.filter((t) => t.hidden > 0).length).toBeGreaterThan(0);
  });

  it('MAIN: no withhold-always row reaches the gallery read, the link, the import or the map member (marked and unmarked, Reveal DM off and on)', () => {
    const sent = [];
    for (const r of reads) {
      for (const [read, d] of Object.entries(r.docs)) {
        expect(isRec(d), `${r.t.seed} ${r.mark} dm=${r.dm} ${read}: a document`).toBe(true);
        for (const row of rows) if (valuesAt(d, row.re).size) sent.push(`${row.id} @ ${r.t.seed} ${r.mark} ${r.dm ? 'dm' : 'pub'} ${read}`);
      }
    }
    expect(sent).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('the stability keeps its band word alone (power.stability, VR19 (a)); a cast row stays exactly where it names what is served (VR37 (b))', () => {
    const bad = [];
    for (const r of reads) for (const [read, d] of Object.entries(r.docs)) {
      const want = String(r.t.stored.powerStructure?.stability || '').replace(/[ ]*[(—;][\s\S]*$/, '');
      if (d.powerStructure?.stability !== want) bad.push(`${r.t.seed} ${read}: stability ${JSON.stringify(d.powerStructure?.stability)}`);
      const powers = new Set([...(d.powerStructure?.factions || []), ...(d.factions || [])].flatMap((f) => [f?.name, f?.faction]).filter((x) => typeof x === 'string'));
      for (const k of ['stress', 'stressors']) {
        const cast = d[k]?.cast; const scast = r.t.stored[k]?.cast;
        if (!isRec(scast)) continue;
        const kept = (scast.stakes || []).filter((e) => powers.has(e.factionId)).map((e) => e.factionId);
        if (JSON.stringify((cast?.stakes || []).map((e) => e.factionId)) !== JSON.stringify(kept)) bad.push(`${r.t.seed} ${read} ${k}: stakes`);
        if ((cast?.roles || []).some((e) => !isRec(e))) bad.push(`${r.t.seed} ${read} ${k}: a role row that is not an object`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('the owner\'s own record still carries every row (VR16 (3))', () => {
    const lost = [];
    for (const r of reads) for (const row of rows) if (valuesAt(r.t.stored, row.re).size && !valuesAt(r.own, row.re).size) lost.push(`${row.id} @ ${r.t.seed}`);
    expect(lost).toEqual([]);
  });

  it('the twin (projectShareVeil over galleryPayloadFor) sends what the server sends at every registered path of the gallery read', () => {
    const differ = [];
    // the cast rows by the keys R2's rule decides on (a stake's power, a role row's kind and id): their wording differs between
    // the engines at R2's base already (red.txt: the twin arm), a twin-laxer class of R7's (VR15 (b)), not this rule's
    const paths = [...rows.map((r) => r.re), /^powerStructure\.stability$/, /^(stress|stressors)\.cast\.stakes\[\]\.factionId$/, /^(stress|stressors)\.cast\.roles\[\]\.(kind|id)$/];
    for (const r of reads) {
      const twin = veil.projectShareVeil(veil.galleryPayloadFor(r.t.stored, { shareDm: r.dm, memberOverrides: r.ov }), r.ov);
      for (const re of paths) {
        const a = [...valuesAt(r.docs.gallery, re)].sort(); const b = [...valuesAt(twin, re)].sort();
        if (JSON.stringify(a) !== JSON.stringify(b)) differ.push(`${re} @ ${r.t.seed} ${r.mark} dm=${r.dm}`);
      }
    }
    expect(differ).toEqual([]);
  });

  it('THE PAGE re-derives what it draws from the served document alone, equal to the stored value where nothing is hidden', async () => {
    const { rederiveForPage, PAGE_DRAWN_SCORES } = await import('../../src/domain/veil/pageRederive.js');
    const { defaultSeverityForBand } = await import('../../src/domain/activeConditions.js');
    const bad = [];
    for (const r of reads.filter((x) => !x.dm)) {
      const page = rederiveForPage(clone(r.docs.gallery));
      const s = r.t.stored;
      for (const k of PAGE_DRAWN_SCORES) {
        const v = page.defenseProfile?.scores?.[k];
        if (!Number.isFinite(v) || (!r.t.hidden && v !== s.defenseProfile.scores[k])) bad.push(`${r.t.seed} ${r.mark}: scores.${k} ${v} (stored ${s.defenseProfile.scores[k]})`);
      }
      const rs = page.defenseProfile?.readiness?.score;
      if (!Number.isFinite(rs) || (!r.t.hidden && rs !== s.defenseProfile.readiness.score)) bad.push(`${r.t.seed} ${r.mark}: readiness ${rs}`);
      const g = page.defenseProfile?.economicGates;
      if (!g || (!r.t.hidden && JSON.stringify(g) !== JSON.stringify(s.defenseProfile.economicGates))) bad.push(`${r.t.seed} ${r.mark}: gates`);
      const eo = page.economicState?.compound?.economyOutput;
      if (!Number.isFinite(eo) || (!r.t.hidden && eo !== s.economicState.compound.economyOutput)) bad.push(`${r.t.seed} ${r.mark}: economyOutput ${eo}`);
      for (const c of page.activeConditions || []) if (typeof c.severityBand === 'string' && c.severity !== defaultSeverityForBand(c.severityBand)) bad.push(`${r.t.seed}: severity from band`);
    }
    expect(bad).toEqual([]);
  });

  it('THE IMPORT\'S SAVE re-derives the defence scores and gates (VR33, VR16 (2)), equal to the stored value where nothing is hidden', async () => {
    const { rederiveServed, REDERIVED_DEFENCE_SCORES } = await import('../../src/domain/veil/importRederive.js');
    const bad = [];
    for (const r of reads) {
      const saved = rederiveServed(r.docs.import);
      const s = r.t.stored;
      for (const k of REDERIVED_DEFENCE_SCORES) {
        const v = saved.defenseProfile?.scores?.[k];
        if (v !== undefined && !Number.isFinite(v)) bad.push(`${r.t.seed}: scores.${k} not a number`);
        if (!r.t.hidden && v !== undefined && v !== s.defenseProfile.scores[k]) bad.push(`${r.t.seed} ${r.mark} dm=${r.dm}: scores.${k} ${v} (stored ${s.defenseProfile.scores[k]})`);
      }
      if (!r.t.hidden && saved.defenseProfile?.economicGates && JSON.stringify(saved.defenseProfile.economicGates) !== JSON.stringify(s.defenseProfile.economicGates)) bad.push(`${r.t.seed}: gates`);
    }
    expect(bad).toEqual([]);
  });
});
