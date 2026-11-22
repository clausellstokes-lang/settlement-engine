/**
 * galleryVeilIds.pglite.test.js — R4-IDS PART ONE, THE RED-FIRST INSTRUMENT (V34-R4I, VEIL-34's builder; brief
 * docs/chair/2026-11-20/veil/briefs/R4-IDS-BRIEF.md; the chair's E87, E89, E94 (a); PART 30 rulings 15, 16, 17, 53; VR10, VR46;
 * vetoable by the owner). RED AT THE SEAT'S TIP BY DESIGN: VR10's re-key (every person id re-keyed under ONE salt per non-owner
 * read, every in-payload reference following) is PART TWO's cure; this file is the instrument it must turn green. The red
 * counts at the tip: docs/chair/2026-11-20/veil/out/v34/r4ids/R4IDS-MEASURE.md.
 *
 * THROUGH THE SERVER (a pglite chain of every migration on disk) AND THE TWIN (projectShareVeil over galleryPayloadFor), on
 * PLANTS (born towns lack some cases) and two born towns: both stored shapes (the new; master's, the powers ALSO in the
 * top-level factions[] with their roster copies `members[]`), Reveal DM off and on, marked (the hooks tab and the three
 * criminal groupings opened, every hideable house at its default: hidden whole) and unmarked, the gallery read and the
 * party link. THE PLANTS: (a) a criminal power the veil withholds BY RULE whose representative carries `npc_power_<slug>`;
 * (b) a house hidden whole whose representative carries `npc_<house slug>`; (c) a card with a NUMBER id (90001) and a card
 * whose own `relationships[]` tie points to it (STOP 1); (d) the served marker's person keys (each plant's id, the number,
 * and `npc.<name>`).
 * THE ARMS:
 *   (1) no served id, key or slug (an id site: a string or key spelled `npc.`/`npc_`/`tie_npc`, or a stored card id, and
 *       every served marker key) SPELLS a withheld power or a house hidden whole, by search (ruling 28; the lane's search,
 *       gallerySecondHomes.js :: buildNameSearch, and the name's words joined by '_' or by nothing, case-blind, the bare form);
 *   (2) VR46's five teeth (personIdBijection.shared.mjs): a reference that does not follow its card reds; a STORED person id
 *       served as a substring of any string or as any key (the marker included) reds; a changed non-id byte reds; the
 *       re-key is a bijection within a read; two reads of one town differ;
 *   (3) STOP 1: every person reference inside a card's own ties follows the re-key;
 *   (4) THE CATALOGUE (ruling 16): every function 211 and 212 create or restate, by `pg_proc.provolatile`: on the transitive
 *       closure of its callers, a function that draws randomness makes every member VOLATILE; an IMMUTABLE or STABLE member
 *       reds (a plant on a scratch transaction shows it can fail).
 *   TEETH THAT PASS TODAY: a read that hides nothing serves the same people (modulo the bijection); a served person's every
 *   non-id byte is the twin's.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';
import { canonPeople, storedIdsServed, notBijective, readsDiffer, bijectionTeeth } from './personIdBijection.shared.mjs';
import { buildNameSearch } from '../../src/domain/display/gallerySecondHomes.js';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
/** A stable spelling (keys sorted): a jsonb column gives keys back in its own order. */
const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
const SEEDS = ['town-infiltrated-0-12', 'city-none-1-113'];

// THE PLANT TOWN. "Thieves' guild chapter" (hideable: hidden whole by default) raises the criminal power "Thieves' Guild",
// which the veil withholds BY RULE on the marked read; "Smugglers' den" (hideable) is hidden whole.
const TG = "Thieves' Guild";
const TG_REP = 'npc_power_thieves_guild'; // (a) mintTitles.js :: OTHER_CARD_PREFIX + the power's slug
const DEN = "Smugglers' den";
const DEN_REP = 'npc_smugglers_den'; // (b) representatives.js :: cardIdFor's unveiled form, npc_<house slug>
const NUM = 90001; // (c)
const PLANT = Object.freeze({
  name: 'Saltmarrow', tier: 'town',
  institutions: [{ id: 'inst-tgc', name: "Thieves' guild chapter", category: 'Criminal', desc: 'A chapter of the guild.' },
    { id: 'inst-den', name: DEN, category: 'Criminal', desc: 'Contraband moves through the cellars.' },
    { id: 'inst-fish', name: 'Fish market', category: 'Economy', desc: 'Fish, salted and fresh.' }],
  powerStructure: {
    factions: [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true, desc: 'The council sits weekly.' },
      { faction: TG, category: 'criminal', power: 30, desc: 'The guild takes its cut.' },
      { faction: 'Fishers', category: 'economic', power: 20, desc: 'The fishers keep the quay.' }],
  },
  npcs: [
    { id: TG_REP, name: 'Vex Morrow', role: 'Guildmaster', title: 'the guildmaster', institution: { kind: 'power', key: TG, title: 'the guildmaster' },
      memberships: [{ power: TG, role: 'leader' }], goal: { short: 'Keep the cut.', long: 'Own the quay.' } },
    { id: DEN_REP, name: 'Rook Hale', role: 'Smuggler', title: 'the smuggler', institution: { kind: 'house', key: 'inst-den', title: 'the smuggler' },
      memberships: [], goal: { short: 'Move the cargo.', long: 'Retire rich.' } },
    { id: NUM, name: 'Ada Vell', role: 'Fishwife', memberships: [{ power: 'Fishers', role: 'member' }], goal: { short: 'Sell the catch.', long: 'Own a boat.' } },
    { id: 'npc.bo', name: 'Bo Tarn', role: 'Councillor', memberships: [{ power: 'Town Council', role: 'member' }],
      relationships: [{ id: 'tie_bo_ada', from: 'npc.bo', to: NUM, type: 'ally', description: 'Old friends from the quay.' }],
      goal: { short: 'Keep the tolls.', long: 'Hold the chair.', intent: { short: { target: { id: NUM, kind: 'npc' } } } } },
  ],
  relationships: [{ id: `tie_${TG_REP}__npc.bo`, from: TG_REP, to: 'npc.bo', type: 'rival', description: 'They do not speak.' },
    { id: 'tie_ada_bo', npc1Id: NUM, npc2Id: 'npc.bo', type: 'ally', description: 'Neighbours.' },
    { id: `tie_${DEN_REP}__ada`, from: DEN_REP, to: NUM, type: 'patron', description: 'He buys her silence.' }],
});
/** (d) the person keys the owner's marker holds for the plant's people. */
const PERSON_KEYS = Object.freeze({ [TG_REP]: { revealDm: false }, [DEN_REP]: { allowImport: false }, [String(NUM)]: { revealDm: true }, 'npc.vex_morrow': { revealDm: false } });
/** master's stored shape: the powers also in the top-level factions[], each with its roster copy members[]. */
const masterOf = (t) => ({ ...t, factions: clone(t.powerStructure?.factions || []).map((f) => ({ ...f,
  members: recs(t.npcs).filter((n) => recs(n.memberships).some((m) => m.power === f.faction)).map((n) => ({ id: n.id, name: n.name })) })) });

const ID_RE = /npc[._]|tie_npc/i;
const nameOf = (f) => (typeof f?.faction === 'string' ? f.faction : typeof f?.name === 'string' ? f.name : null);
/** The explicit fold: the name's words (its bracketed qualifier dropped) joined by '_' and by nothing, case-blind. */
const formsOf = (n) => { const w = String(n).replace(/\s*[([].*?[)\]]\s*/g, ' ').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); return w.length ? [w.join('_'), w.join('')] : []; };

describe('R4-IDS: VR10\'s person ids on every non-owner read (through the server; the twin beside it) — RED BY DESIGN at the seat\'s tip', () => {
  let reads;
  let db;
  let catalogue;

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const { isHideableHouse } = await import('../../src/domain/people/cardVeil.js');
    const veil = await import('../../src/domain/display/galleryVeil.js');
    await loadGenerationLawPayloads();
    const birth = (size, crisis, seed) => {
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      let t = generateSettlementPipeline(cfg, null, { seed, customContent: {}, onStep: undefined });
      t = { ...t }; delete t.publicProse;
      return clone(withPublicProse(t, composePublicProse(t)));
    };
    const towns = [{ seed: 'plant', stored: clone(PLANT) },
      ...SEEDS.map((k) => { const [size, crisis] = k.split('-'); return { seed: k, stored: birth(size, crisis, `r3m-${k}`) }; })];
    const idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
    reads = [];
    let n = 0;
    for (const t of towns) {
      const hideable = recs(t.stored.institutions).filter((h) => isHideableHouse(h));
      const shows = hideable.map((h) => `card:institution:${idOf(h)}`);
      const keys = t.seed === 'plant' ? PERSON_KEYS : {};
      const veils = [['marked', veil.writeShareVeil(clone(keys), OPEN.map((a) => ({ address: a, hidden: false })), AT)],
        ['unmarked', clone(keys)],
        ['shown', veil.writeShareVeil(clone(keys), [...OPEN, ...shows].map((a) => ({ address: a, hidden: false })), AT)]];
      for (const [shape, stored] of [['new', t.stored], ['master', masterOf(t.stored)]]) for (const [kind, ov] of veils) for (const dm of [false, true]) {
        n += 1;
        const id = `4e1d0000-0000-0000-0000-${String(n).padStart(12, '0')}`;
        const slug = `r4i${n}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name || 'T'), String(stored.tier || 'town'), J(stored), slug, `${slug}-link`, J(ov), dm]);
        await db.exec(`set test.uid = '';`);
        const g = async () => (await db.query('select to_jsonb(g.data) d, g.gallery_member_overrides o from public.get_gallery_dossier($1) g', [slug])).rows[0];
        const g1 = await g();
        const g2 = await g();
        const l = async () => (await db.query('select public.get_unlisted_dossier($1) x', [`${slug}-link`])).rows[0]?.x;
        const lx = await l();
        const lx2 = await l();
        const twin = veil.projectShareVeil(veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: ov }), ov);
        reads.push({ seed: t.seed, shape, kind, dm, stored, ov, twin,
          docs: { gallery: { doc: g1?.d, marker: g1?.o, again: g2?.d }, link: { doc: lx?.dossier, marker: lx?.gallery_member_overrides ?? null, again: lx2?.dossier } } });
      }
    }
    // THE CATALOGUE: every function 211 and 212 create or restate (the files read as text; their names only)
    const dir = resolve(process.cwd(), 'supabase', 'migrations');
    const names = new Set();
    for (const f of readdirSync(dir).filter((x) => /^21[12]_.*\.sql$/.test(x))) {
      for (const m of readFileSync(join(dir, f), 'utf-8').matchAll(/^create\s+(?:or\s+replace\s+)?function\s+(?:public\.)?"?([a-z_][a-z0-9_]*)"?\s*\(/gim)) names.add(m[1].toLowerCase());
    }
    catalogue = [...names].sort();
  }, PGLITE_BOOT_TIMEOUT_MS);

  /**
   * What a served read is held to, modulo the bijection: the gallery read, to its twin (projectShareVeil over
   * galleryPayloadFor); the party link, which no client twin projects (it serves a narrower card than the gallery's
   * twin at either DM: this file's second run, out/v34/r4ids/ids-test-tip-second.txt), to its OWN second read of the
   * same row (VR46: two reads of one town are equal modulo their bijections, and share no person id).
   */
  const refOf = (r, read) => (read === 'link' ? r.docs.link.again : r.twin);
  const label = (r, read) => `${r.seed} ${r.shape} ${r.kind} dm=${r.dm} ${read}`;
  /** Every served (non-owner) document of a read, with its marker. */
  const served = (r) => Object.entries(r.docs).filter(([, x]) => isRec(x.doc));
  /** What a read withholds: the stored powers and houses it does not serve by name. */
  const withheldOf = (stored, d) => {
    const sp = new Set(recs(d.powerStructure?.factions).map(nameOf).filter(Boolean));
    const sh = new Set(recs(d.institutions).map((h) => h.name).filter(Boolean));
    return { W: [...new Set([...recs(stored.powerStructure?.factions).map(nameOf).filter((x) => x && !sp.has(x)), ...recs(stored.institutions).map((h) => h.name).filter((x) => x && !sh.has(x))])], opens: [...sp, ...sh] };
  };
  /** Every id site of a served document and its marker: [path, value]. */
  const idSites = (doc, marker, stored) => {
    const storedIds = new Set(recs(stored.npcs).map((x) => x.id).filter((x) => x != null).map(String));
    const out = [];
    const walk = (v, p) => {
      if (typeof v === 'string') { if (ID_RE.test(v) || storedIds.has(v)) out.push([p, v]); return; }
      if (typeof v === 'number') { if (storedIds.has(String(v))) out.push([p, String(v)]); return; }
      if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${p}[${i}]`)); return; }
      if (isRec(v)) for (const k of Object.keys(v)) { if (ID_RE.test(k) || storedIds.has(k)) out.push([`${p}{key}`, k]); walk(v[k], p ? `${p}.${k}` : k); }
    };
    walk(doc, '');
    if (isRec(marker)) for (const k of Object.keys(marker)) if (k !== '$veil') out.push(['$marker{key}', k]);
    return out;
  };
  /** The person-bearing parts of a document, canonical (modulo the read's bijection). */
  const peopleParts = (d) => { const c = canonPeople(d).doc; return canon({ npcs: c.npcs, relationships: c.relationships, stress: c.stress, stressors: c.stressors, simulationTrace: c.simulationTrace,
    members: recs(c.factions).map((f) => f.members), psMembers: recs(c.powerStructure?.factions).map((f) => f.members) }); };

  it('the plant serves each case it plants (the instrument judges something): the withheld power, the hidden house, the number id and its card tie', () => {
    const p = reads.filter((r) => r.seed === 'plant' && r.kind === 'marked' && !r.dm && r.shape === 'new');
    expect(p.length).toBe(1);
    const g = p[0].docs.gallery.doc;
    const { W } = withheldOf(p[0].stored, g);
    expect(W).toContain(TG);
    expect(W).toContain(DEN);
    expect(recs(g.npcs).length).toBeGreaterThan(0);
  });

  it('(1) RED BY DESIGN: no served id, key or slug spells a withheld power or a house hidden whole, by search (ruling 28), on any read', () => {
    const bad = [];
    for (const r of reads) for (const [read, x] of [...served(r), ['twin', { doc: r.twin, marker: null }]]) {
      const { W, opens } = withheldOf(r.stored, x.doc);
      if (!W.length) continue;
      const search = buildNameSearch(W, opens);
      const forms = W.flatMap(formsOf);
      for (const [p, v] of idSites(x.doc, x.marker, r.stored)) {
        const low = v.toLowerCase();
        const fold = forms.some((f) => low.replace(/[^a-z0-9]+/g, '_').includes(f) || low.replace(/[^a-z0-9]+/g, '').includes(f));
        if ((search && search.hit(v)) || fold) bad.push(`${label(r, read)}: ${p} = ${v}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('(2) RED BY DESIGN: VR46\'s five teeth over every served read, the served payload against its reference (the gallery\'s twin; the link\'s second read) modulo the read\'s bijection (personIdBijection.shared.mjs)', () => {
    const bad = [];
    for (const r of reads) for (const [read, x] of served(r)) {
      const storedId = recs(r.stored.npcs).map((nn) => nn.id).find((v) => v != null);
      const holds = (c) => storedIdsServed([c, x.marker], r.stored).length === 0 && notBijective(c).length === 0 && peopleParts(c) === peopleParts(refOf(r, read));
      const { missed } = bijectionTeeth(x.doc, holds, { storedId, again: x.again ?? undefined });
      const leak = storedIdsServed([x.doc, x.marker], r.stored);
      if (missed.length) bad.push(`${label(r, read)}: ${missed.join(' | ').slice(0, 300)}${leak.length ? ` || stored ids served ${leak.length}: ${leak.slice(0, 2).join('; ')}` : ''}`);
      if (x.again) { const shared = readsDiffer(x.doc, x.again); if (shared.length) bad.push(`${label(r, read)}: (v) two reads share ${shared.length} person ids`); }
    }
    expect(bad).toEqual([]);
  });

  it('(3) RED BY DESIGN, STOP 1: every person reference inside a card\'s own ties follows the re-key (no stored id; the twin\'s person by the bijection)', () => {
    const bad = [];
    let judged = 0;
    for (const r of reads.filter((y) => y.seed === 'plant')) for (const [read, x] of served(r)) {
      const storedIds = new Set(recs(r.stored.npcs).map((nn) => nn.id).filter((v) => v != null).map(String));
      const sv = canonPeople(x.doc).doc; const tw = canonPeople(refOf(r, read)).doc;
      recs(x.doc.npcs).forEach((card, i) => recs(card.relationships).forEach((t, j) => {
        for (const k of ['from', 'to', 'npc1Id', 'npc2Id', 'targetId', 'npcId']) {
          if (t[k] == null) continue;
          judged += 1;
          if (storedIds.has(String(t[k]))) bad.push(`${label(r, read)}: npcs[${i}].relationships[${j}].${k} = ${J(t[k])} (a stored id)`);
          const twinRef = recs(tw.npcs)[i]?.relationships?.[j]?.[k];
          if (sv.npcs?.[i]?.relationships?.[j]?.[k] !== twinRef) bad.push(`${label(r, read)}: npcs[${i}].relationships[${j}].${k} follows no card (${J(sv.npcs?.[i]?.relationships?.[j]?.[k])} against the twin's ${J(twinRef)})`);
        }
      }));
    }
    expect(judged, 'a card\'s own tie is served somewhere (else STOP 1 judges nothing)').toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  /** The catalogue's finding: each member of the randomness closure (drawers and their transitive callers) not VOLATILE. */
  const catalogueReds = async (names) => {
    const rows = (await db.query(`select p.proname n, p.provolatile v, p.prosrc s from pg_proc p join pg_namespace s on s.oid = p.pronamespace where s.nspname = 'public'`)).rows;
    const byName = new Map();
    for (const row of rows) (byName.get(row.n) || byName.set(row.n, []).get(row.n)).push(row);
    const all = [...byName.keys()];
    const calls = (src) => all.filter((fn) => new RegExp(`\\b${fn}\\s*\\(`, 'i').test(src || ''));
    const draws = (src) => /\b(random|gen_random_uuid|gen_random_bytes|uuid_generate_v4|setseed)\s*\(/i.test(src || '');
    const closure = new Set(all.filter((fn) => byName.get(fn).some((row) => draws(row.s))));
    for (let grew = true; grew;) {
      grew = false;
      for (const fn of all) if (!closure.has(fn) && byName.get(fn).some((row) => calls(row.s).some((c) => closure.has(c) && c !== fn))) { closure.add(fn); grew = true; }
    }
    const members = names.filter((fn) => closure.has(fn));
    const reds = members.flatMap((fn) => byName.get(fn).filter((row) => row.v !== 'v').map((row) => `${fn}: provolatile ${row.v === 'i' ? 'IMMUTABLE' : 'STABLE'}${draws(row.s) ? ' (draws)' : ' (calls a drawer)'}`));
    return { reds, members, missing: names.filter((fn) => !byName.has(fn)) };
  };

  it('(4) THE CATALOGUE (ruling 16): every function 211 and 212 create or restate that draws randomness, or calls one that does (the transitive closure), is VOLATILE', async () => {
    expect(catalogue.length).toBeGreaterThan(0);
    const { reds, missing } = await catalogueReds(catalogue);
    expect(missing).toEqual([]);
    expect(reds).toEqual([]);
  });

  it('(4) THE CATALOGUE CAN FAIL: a closure member declared STABLE on a scratch transaction reds', async () => {
    await db.exec('begin');
    try {
      await db.exec(`create function public.r4i_scratch_draw() returns text language sql volatile as $f$ select md5(random()::text) $f$;
        create function public.r4i_scratch_caller() returns text language sql stable as $f$ select public.r4i_scratch_draw() $f$;
        create function public.r4i_scratch_top() returns text language sql volatile as $f$ select public.r4i_scratch_caller() $f$;`);
      const { reds, members } = await catalogueReds([...catalogue, 'r4i_scratch_draw', 'r4i_scratch_caller', 'r4i_scratch_top']);
      expect(members).toEqual(expect.arrayContaining(['r4i_scratch_draw', 'r4i_scratch_caller', 'r4i_scratch_top']));
      expect(reds).toContain('r4i_scratch_caller: provolatile STABLE (calls a drawer)');
    } finally { await db.exec('rollback'); }
  });

  it('TOOTH THAT PASSES TODAY: a read that hides nothing (every hideable house shown, Reveal DM on) serves the same people as its reference (the gallery\'s twin; the link\'s second read), modulo the bijection', () => {
    const bad = [];
    let judged = 0;
    for (const r of reads.filter((y) => y.kind === 'shown' && y.dm)) for (const [read, x] of served(r)) {
      judged += 1;
      const a = canonPeople(x.doc).doc; const b = canonPeople(refOf(r, read)).doc;
      if (canon(recs(a.npcs).map((c) => c.id)) !== canon(recs(b.npcs).map((c) => c.id))) bad.push(`${label(r, read)}: served ${recs(a.npcs).length} people, the twin ${recs(b.npcs).length}`);
    }
    expect(judged).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('TOOTH THAT PASSES TODAY: arm (2)\'s equality, ids aside: every person-bearing part (cards, ties, casts, trace, roster copies) is its reference\'s (the gallery\'s twin; the link\'s second read) modulo the bijection, on every read', () => {
    const bad = [];
    for (const r of reads) for (const [read, x] of served(r)) {
      if (peopleParts(x.doc) !== peopleParts(refOf(r, read))) bad.push(`${label(r, read)}: ${peopleParts(x.doc).length} bytes against the twin's ${peopleParts(refOf(r, read)).length}`);
      if (x.again && peopleParts(x.again) !== peopleParts(refOf(r, read))) bad.push(`${label(r, read)}: the second read`);
    }
    expect(bad).toEqual([]);
  });

  it('TOOTH THAT PASSES TODAY: a served person\'s every non-id byte is its reference\'s person\'s of the same canonical name (the gallery\'s twin; the link\'s second read), on every read', () => {
    const bad = [];
    let judged = 0;
    for (const r of reads) for (const [read, x] of served(r)) {
      const tw = new Map(recs(canonPeople(refOf(r, read)).doc.npcs).map((c) => [c.id, c]));
      for (const c of recs(canonPeople(x.doc).doc.npcs)) {
        judged += 1;
        if (canon(c) !== canon(tw.get(c.id))) bad.push(`${label(r, read)}: ${c.id} ${canon(c).slice(0, 120)} | twin ${canon(tw.get(c.id)).slice(0, 120)}`);
      }
    }
    expect(judged).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });
});
