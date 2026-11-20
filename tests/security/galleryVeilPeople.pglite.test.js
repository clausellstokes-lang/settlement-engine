/**
 * galleryVeilPeople.pglite.test.js — R4 (VEIL-22; SUB-BRIEF-VR7 point 5, stage R4; the chair's VR9, VR10 and VR21, each
 * vetoable by the owner): THE PEOPLE.
 *
 * VR9: where a house is hidden whole, the person who holds it (the card whose house identity names it; where the
 * identity cannot be read, a card minted `npc_veiled_` or of category 'criminal') is WITHHELD WHOLE WITH ITS TIES: the
 * card (its `category: 'criminal'` with it), every tie it is an end of, every copy of such a tie (prominentRelationship,
 * pressureSentence), its roster copies, its crisis-cast rows and levers, and another person's goal aimed at it.
 * VR10: on EVERY non-owner read every person's id is re-keyed per read (salted, one salt a read, consistent within the
 * payload) and every in-payload reference follows; no stored id, and no form (`npc_veiled_`, `npc_power_`,
 * `npc_<house slug>`), survives, the served member overrides' person keys included.
 *
 * THROUGH THE SERVER (VR15): born towns on a pglite chain of every migration on disk, both stored shapes (the new; master's
 * person and tie shape), each shared four ways (the default veil and unmarked; Reveal DM off and on), read as a non-owner by
 * the gallery read, the party link, the import and the campaign map's member. THE TWIN beside it: 212 ::
 * _gallery_veil_rekey and galleryVeilPeople.js :: rekeyPeople BYTE-EQUAL under one salt; the twin's projection
 * (projectShareVeil over galleryPayloadFor) equal to the server's gallery read on the people's paths AFTER EACH SIDE'S IDS
 * ARE RELABELLED BY FIRST APPEARANCE (a salted re-key is randomness on a read: two reads are never byte-equal on ids; the
 * relabel compares what the ids are consistent with, never their spelling). The owner's own record keeps every id and card.
 * RED at R4's base (d136940c3): out/v21/r4/red.txt.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { writeFileSync } from 'node:fs';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 600_000;
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const BIRTHS = [['town', null], ['city', 'infiltrated'], ['metropolis', null], ['city', 'under_siege']];
const REKEYED = /^(npc|tie)_[0-9a-f]{16}$/;
const PERSON = /^npc_[0-9a-f]{16}$/;

/** Every string of a document with its normalised path (keys too, marked `{key}`). */
function strings(doc) {
  const out = [];
  const walk = (v, p) => {
    if (typeof v === 'string') { out.push([p, v]); return; }
    if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`));
    else if (isRec(v)) for (const k of Object.keys(v)) { out.push([`${p}{key}`, k]); walk(v[k], p ? `${p}.${k}` : k); }
  };
  walk(doc, '');
  return out;
}

/**
 * VR46 TOOTH (ii), SHARPENED (the seat, R4-CURE): every served string AND every key holding a stored person id AS A
 * SUBSTRING (an id inside a sentence, an id used as a key), by path. `ids`: the stored person ids (strings).
 */
function storedIdHits(doc, ids) {
  const list = [...ids].filter((x) => typeof x === 'string' && x.length >= 3);
  if (!list.length) return [];
  const re = new RegExp(list.sort((a, b) => b.length - a.length).map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'));
  return strings(doc).filter(([, v]) => re.test(v)).map(([p, v]) => `${p} holds ${v.match(re)[0]}`);
}

/** The crises of a document (an object or an array, both copies). */
const crises = (d) => ['stress', 'stressors'].flatMap((k) => (Array.isArray(d?.[k]) ? d[k] : [d?.[k]])).filter((c) => isRec(c) && isRec(c.cast));

/** Each side's re-keyed ids relabelled by first appearance in a sorted-key walk (the payload's own consistency). */
function relabel(v) {
  const map = new Map();
  const lab = (s) => { if (!REKEYED.test(s)) return s; if (!map.has(s)) map.set(s, `${s.slice(0, 3)}#${map.size}`); return map.get(s); };
  const walk = (x) => {
    if (typeof x === 'string') return lab(x);
    if (Array.isArray(x)) return x.map(walk);
    if (isRec(x)) return Object.fromEntries(Object.keys(x).sort().map((k) => [lab(k), walk(x[k])]));
    return x;
  };
  return walk(v);
}

/** A value with every object's keys sorted (the server's jsonb and the client's object order their keys differently). */
const sorted = (x) => (Array.isArray(x) ? x.map(sorted) : isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, sorted(x[k])])) : x);

/** The people's paths of a document. */
const peopleOf = (d) => ({ npcs: d?.npcs, relationships: d?.relationships, prominentRelationship: d?.prominentRelationship, pressureSentence: d?.pressureSentence,
  cast: crises(d).map((c) => ({ roles: c.cast.roles, levers: c.cast.levers })), factions: (d?.factions || []).map((f) => f?.members), powers: (d?.powerStructure?.factions || []).map((f) => f?.members) });

describe('R4: the people — the holder withheld whole with its ties (VR9), every id re-keyed per read (VR10), through the server', () => {
  let db;
  let reads;
  let veil;
  let homes;

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
    const { factionIdFromName } = await import('../../src/lib/entities.js');
    veil = await import('../../src/domain/display/galleryVeil.js');
    homes = await import('../../src/domain/display/galleryVeilPeople.js');
    await loadGenerationLawPayloads();
    /** A person as master's client stored it, and a tie (the form of gallerySecondHomes.pglite.test.js). */
    const oldPerson = (p) => {
      const { memberships, allegiance, institution, ...rest } = p;
      const ms = (Array.isArray(memberships) ? memberships : []).filter((m) => isRec(m) && typeof m.power === 'string');
      const out = { ...rest };
      if (ms[0]) out.factionAffiliation = ms[0].power;
      if (ms[1]) out.secondaryAffiliation = ms[1].power;
      if (ms.length) out.linkedFactionIds = ms.map((m) => factionIdFromName(m.power));
      if (isRec(institution) && institution.kind === 'house' && typeof institution.key === 'string') out.institution = institution.key;
      if (isRec(allegiance)) { out.corrupt = true; out.corruptionVector = allegiance.vector ?? null; }
      return out;
    };
    const oldTie = ({ from, to, id: _id, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to });
    reads = [];
    let n = 0;
    for (const [i, [size, crisis]] of BIRTHS.entries()) {
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      const born = clone(generateSettlementPipeline(cfg, null, { seed: `r4-people-${size}-${crisis || 'calm'}-${i}`, customContent: {} }));
      const shapes = {
        new: clone(withPublicProse(born, composePublicProse(born))),
        old: (() => { const s = clone(born); s.npcs = (s.npcs || []).map((p) => (isRec(p) ? oldPerson(p) : p)); s.relationships = (s.relationships || []).map((t) => (isRec(t) && 'from' in t ? oldTie(t) : t)); s.schemaVersion = 1; return s; })(),
      };
      for (const [shape, stored] of Object.entries(shapes)) {
        const hidden = new Set((stored.institutions || []).filter((h) => isRec(h) && isHideableHouse(h)).map((h) => h.name));
        const houseOf = (p) => (isRec(p.institution) ? p.institution.key : p.institution);
        // THE ORACLE: a holder is a person whose house is one the default veil hides whole, or a face minted for one
        const holders = (stored.npcs || []).filter((p) => isRec(p) && (String(p.id).startsWith('npc_veiled_') || hidden.has(houseOf(p))));
        const ids = new Set((stored.npcs || []).map((p) => p?.id).filter((x) => typeof x === 'string'));
        // one person's own member override (revealDm), so the served marker carries a person key on every read
        const first = (stored.npcs || []).find((p) => isRec(p) && !holders.includes(p) && typeof p.id === 'string');
        const t = { seed: `${size}-${crisis || 'calm'}-${i}`, shape, stored, holders, holderNames: holders.map((p) => p.name).filter((x) => typeof x === 'string' && x), ids, first };
        for (const [mark, ov] of [['marked', veil.writeShareVeil({ [first.id]: { revealDm: true } }, [])], ['unmarked', { [first.id]: { revealDm: true } }]]) for (const dm of [false, true]) {
          n += 1;
          const id = `7e540000-0000-0000-0000-${String(n).padStart(12, '0')}`;
          const slug = `pp${n}`;
          await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
            values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name || 'T'), String(stored.tier || 'town'), JSON.stringify(stored), slug, `${slug}-link`, JSON.stringify(ov), dm]);
          await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
            values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
          await db.exec(`set test.uid = '';`);
          const g = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', [slug])).rows[0]?.r;
          const g2 = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
          const docs = { gallery: g?.data, map: (await db.query('select public.get_gallery_map($1) #> \'{members,0,settlement}\' d', [`${slug}-map`])).rows[0]?.d };
          const served = { gallery: g?.gallery_member_overrides };
          if (!dm) {
            const l = (await db.query('select public.get_unlisted_dossier($1) r', [`${slug}-link`])).rows[0]?.r;
            docs.link = l?.dossier;
            served.link = l?.gallery_member_overrides;
          }
          await db.exec(`set test.uid = '${READER}';`);
          docs.import = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
          await db.exec(`set test.uid = '${OWNER}';`);
          const own = (await db.query('select data from public.settlements where id = $1', [id])).rows[0]?.data;
          await db.exec(`set test.uid = '';`);
          reads.push({ t, mark, dm, ov, docs, served, again: g2, own, row: g });
        }
      }
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the corpus is live: holders of a hidden house on every town, a crisis cast role of kind npc served, both shapes', () => {
    const towns = [...new Set(reads.map((r) => r.t))];
    expect(towns.length).toBe(BIRTHS.length * 2);
    expect(towns.filter((t) => t.holders.length > 0).length).toBeGreaterThanOrEqual(towns.length - 2);
    expect(reads.filter((r) => crises(r.own).some((c) => (c.cast.roles || []).some((x) => x?.kind === 'npc'))).length).toBeGreaterThan(0);
  }, ARM_TIMEOUT_MS);

  it('VR9: on a share hiding a house whole, its holder\'s card, ties and every copy leave every read (both shapes, Reveal DM off and on)', () => {
    const sent = [];
    for (const r of reads.filter((x) => x.mark === 'marked' && x.t.holderNames.length)) {
      for (const [read, d] of Object.entries(r.docs)) {
        if (!isRec(d)) { sent.push(`${r.t.seed} ${r.t.shape}${r.dm ? ' +DM' : ''} ${read}: no document`); continue; }
        const names = r.t.holderNames;
        for (const [p, v] of strings(d)) {
          const hit = names.find((nm) => v.includes(nm));
          if (hit) sent.push(`${r.t.seed} ${r.t.shape}${r.dm ? ' +DM' : ''} ${read}: ${p} names the holder ${hit}`);
        }
        const crim = (d.npcs || []).filter((p) => isRec(p) && names.includes(p.name));
        if (crim.length) sent.push(`${r.t.seed} ${r.t.shape} ${read}: ${crim.length} holder cards`);
      }
    }
    expect(sent.slice(0, 40)).toEqual([]);
    expect(sent.length).toBe(0);
  }, ARM_TIMEOUT_MS);

  it('VR9 (the chair, 04:50 UTC): a crisis cast role of kind npc whose person is served survives the re-key and R2\'s step', () => {
    const lost = [];
    let kept = 0;
    for (const r of reads) {
      for (const [read, d] of Object.entries(r.docs)) {
        if (!isRec(d)) continue;
        const served = new Set((d.npcs || []).map((p) => p?.id));
        const servedNames = new Set((d.npcs || []).map((p) => p?.name));
        const want = crises(r.own).flatMap((c) => (c.cast.roles || []).filter((x) => isRec(x) && x.kind === 'npc' && servedNames.has(x.name) && !r.t.holderNames.includes(x.name)));
        const got = crises(d).flatMap((c) => (c.cast.roles || []).filter((x) => isRec(x) && x.kind === 'npc'));
        for (const x of got) if (!served.has(x.id)) lost.push(`${r.t.seed} ${r.t.shape} ${r.mark}${r.dm ? ' +DM' : ''} ${read}: role ${x.role} names no served person`);
        if (got.length < want.length) lost.push(`${r.t.seed} ${r.t.shape} ${r.mark}${r.dm ? ' +DM' : ''} ${read}: ${want.length - got.length} npc roles of a served person withheld`);
        kept += got.length;
      }
    }
    expect(lost.slice(0, 20)).toEqual([]);
    expect(kept).toBeGreaterThan(0);
  }, ARM_TIMEOUT_MS);

  it('VR10: on every non-owner read no stored person id, and no id form, survives; every id is re-keyed; every reference resolves within the payload', () => {
    const bad = [];
    for (const r of reads) {
      for (const [read, d] of Object.entries(r.docs)) {
        if (!isRec(d)) { bad.push(`${r.t.seed} ${read}: no document`); continue; }
        const at = `${r.t.seed} ${r.t.shape} ${r.mark}${r.dm ? ' +DM' : ''} ${read}`;
        // VR46 tooth (ii), sharpened: a stored id anywhere, as a substring of a string or of a key
        for (const h of storedIdHits(d, r.t.ids)) bad.push(`${at}: ${h} (a stored person id)`);
        for (const [p, v] of strings(d)) if (/npc_veiled_|npc_power_/.test(v)) bad.push(`${at}: ${p} holds an id form`);
        const ids = new Set();
        for (const p of (d.npcs || []).filter(isRec)) { if (!PERSON.test(String(p.id))) bad.push(`${at}: npcs[].id ${p.id} not re-keyed`); ids.add(p.id); }
        const ref = (p, v) => { if (v !== undefined && v !== null && !ids.has(v)) bad.push(`${at}: ${p} ${v} resolves to no served person`); };
        for (const t of (d.relationships || []).filter(isRec)) { ref('relationships[].from', t.from); ref('relationships[].to', t.to); ref('relationships[].npc1Id', t.npc1Id); ref('relationships[].npc2Id', t.npc2Id); if (t.id !== undefined && !REKEYED.test(String(t.id))) bad.push(`${at}: relationships[].id ${t.id} not re-keyed`); }
        for (const c of crises(d)) {
          for (const x of (c.cast.roles || []).filter((e) => isRec(e) && e.kind === 'npc')) ref('cast.roles[].id', x.id);
          for (const x of (c.cast.levers || []).filter(isRec)) if (x.holderId !== undefined) ref('cast.levers[].holderId', x.holderId);
        }
        for (const p of (d.npcs || []).filter(isRec)) {
          for (const side of ['short', 'long']) { const tg = p.goal?.intent?.[side]?.target; if (isRec(tg) && tg.kind === 'npc') ref(`npcs[].goal.intent.${side}.target.id`, tg.id); }
          if (isRec(p.allegiance) && p.allegiance.handler !== undefined) ref('npcs[].allegiance.handler', p.allegiance.handler);
        }
      }
      // the served member overrides: a person's key is the re-keyed id of a served person
      for (const [read, sv] of Object.entries(r.served)) {
        for (const h of storedIdHits(sv, r.t.ids)) bad.push(`${r.t.seed} ${r.t.shape} ${r.mark} ${read} served marker: ${h} (a stored person id)`);
        const d = r.docs[read];
        const ids = new Set((d?.npcs || []).map((p) => p?.id));
        for (const k of Object.keys(isRec(sv) ? sv : {}).filter((x) => x !== '$veil')) {
          if (!ids.has(k)) bad.push(`${r.t.seed} ${r.t.shape} ${r.mark} ${read}: served member key ${k} names no served person`);
        }
        if (!Object.keys(isRec(sv) ? sv : {}).some((x) => x !== '$veil')) bad.push(`${r.t.seed} ${r.t.shape} ${r.mark}${r.dm ? ' +DM' : ''} ${read}: the person's own override did not travel`);
      }
    }
    expect(bad.slice(0, 40)).toEqual([]);
    expect(bad.length).toBe(0);
  }, ARM_TIMEOUT_MS);

  it('VR46 tooth (ii), sharpened, has teeth: a stored id planted inside a sentence, and as a key, is each caught', () => {
    const r = reads.find((x) => x.mark === 'marked' && isRec(x.docs.gallery) && (x.docs.gallery.npcs || []).length);
    const id = [...r.t.ids][0];
    expect(storedIdHits(r.docs.gallery, r.t.ids)).toEqual([]);
    const inSentence = clone(r.docs.gallery); inSentence.npcs[0].role = `Keeps the ledger of ${id} by night`;
    expect(storedIdHits(inSentence, r.t.ids)).toEqual([`npcs[].role holds ${id}`]);
    const asKey = clone(r.docs.gallery); asKey.npcs[0].extra = { [id]: true };
    expect(storedIdHits(asKey, r.t.ids)).toEqual([`npcs[].extra{key} holds ${id}`]);
    const marker = { ...(isRec(r.served.gallery) ? r.served.gallery : {}), [id]: { revealDm: true } };
    expect(storedIdHits(marker, r.t.ids)).toEqual([`{key} holds ${id}`]);
  }, ARM_TIMEOUT_MS);

  it('VR9 (the seat, R4-CURE 3): a withheld holder\'s NAME, searched in every served string of the whole gallery row (every column) and the served marker: no hit outside the rows R5 (_gallery_veil_composed) or the doors (the tile and chronicle columns) own', () => {
    const hits = [];
    const outside = [];
    const DOORS = /^(chronicle|tile_[a-z_]*|aliveness|comment_count)\b/;
    for (const r of reads.filter((x) => x.mark === 'marked' && x.t.holderNames.length)) {
      const surfaces = { 'gallery row': r.row, 'gallery marker': r.served.gallery, 'link marker': r.served.link };
      for (const [where, d] of Object.entries(surfaces)) {
        if (d === undefined || d === null) continue;
        for (const [p, v] of strings(d)) {
          const nm = r.t.holderNames.find((x) => v.includes(x));
          if (!nm) continue;
          const at = `${r.t.seed} ${r.t.shape}${r.dm ? ' +DM' : ''} ${where}: ${p}`;
          hits.push(at);
          if (!(where === 'gallery row' && DOORS.test(p))) outside.push(`${at} names the holder ${nm}`);
        }
      }
    }
    if (process.env.R4_NAMES_OUT) writeFileSync(process.env.R4_NAMES_OUT, JSON.stringify({ hits, outside }, null, 1));
    expect(outside.slice(0, 40)).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('VR10: one salt a read: two reads of one share spell every id differently, each consistent', () => {
    const same = [];
    for (const r of reads) {
      const a = (r.docs.gallery?.npcs || []).map((p) => p?.id);
      const b = (r.again?.npcs || []).map((p) => p?.id);
      expect(a.length).toBe(b.length);
      if (a.some((x, i) => x === b[i])) same.push(`${r.t.seed} ${r.t.shape} ${r.mark}${r.dm ? ' +DM' : ''}`);
      expect(relabel(peopleOf(r.docs.gallery))).toEqual(relabel(peopleOf(r.again)));
    }
    expect(same).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('THE TWIN: 212 :: _gallery_veil_rekey and rekeyPeople byte-equal under one salt; the twin\'s projection equals the gallery read on the people\'s paths once each side\'s ids are relabelled', async () => {
    const differ = [];
    const salt = '0123456789abcdef-r4-born';
    for (const r of reads) {
      const pub = veil.galleryPayloadFor(r.t.stored, { shareDm: r.dm, memberOverrides: r.ov });
      const server = (await db.query('select public._gallery_veil_rekey($1::jsonb, $2) d', [JSON.stringify(pub), salt])).rows[0]?.d;
      const twin = homes.rekeyPeople(clone(pub), salt);
      if (JSON.stringify(sorted(server)) !== JSON.stringify(sorted(twin))) differ.push(`${r.t.seed} ${r.t.shape} ${r.mark}${r.dm ? ' +DM' : ''}: the re-key differs`);
      const proj = veil.projectShareVeil(pub, r.ov);
      if (JSON.stringify(relabel(peopleOf(proj))) !== JSON.stringify(relabel(peopleOf(r.docs.gallery)))) differ.push(`${r.t.seed} ${r.t.shape} ${r.mark}${r.dm ? ' +DM' : ''}: the projection differs on the people`);
    }
    expect(differ).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('the owner\'s own record keeps every stored id and every holder\'s card (VR16 (3))', () => {
    const lost = [];
    for (const r of reads) {
      const own = new Set((r.own?.npcs || []).map((p) => p?.id));
      for (const id of r.t.ids) if (!own.has(id)) lost.push(`${r.t.seed} ${r.t.shape}: ${id}`);
    }
    expect(lost).toEqual([]);
  }, ARM_TIMEOUT_MS);
});

/**
 * R4-CURE (VEIL-22, the seat's cures 1 and 2): ONE SALT A READ, under a cached plan and in the twin.
 * 1. THE SALT'S VOLATILITY: 212 :: _gallery_veil draws the read's salt (gen_random_uuid()). Declared IMMUTABLE, a call with
 *    constant arguments is folded to a constant at planning, and a prepared (or any parameter-less, so generic) plan keeps
 *    the constant: every execution, and every row of one statement, would serve ONE salt (VR10 broken silently). A
 *    prepared statement of _gallery_veil with constant arguments, and of each read function as the page calls it,
 *    executed EIGHT times (a generic plan is chosen after five custom ones) and once more under
 *    `plan_cache_mode = force_generic_plan`, must serve a different person key on EVERY execution; so must two reads in
 *    one statement (the chair's word; tooth (v) of VR46 on the server). Every function that draws or carries the salt,
 *    and every one that reaches it through a call, is VOLATILE.
 * 2. THE TWIN'S SALT: galleryVeil.js draws one salt per PROJECTION call (projectShareVeil, applyVeil, the unmarked path),
 *    consistent within that payload; two projections of one share in one module load spell every id differently.
 * RED at R4's dfa031f3e: out/v22/r4cure/red-*.txt.
 */
describe('R4-CURE: one salt a read, under a cached plan (212 :: _gallery_veil VOLATILE) and per projection in the twin', () => {
  const TOWN = Object.freeze({ name: 'Saltby', tier: 'village',
    npcs: [{ id: 'npc_salt_a', name: 'Ada', role: 'Smith' }, { id: 'npc_salt_b', name: 'Bo', role: 'Miller' }],
    relationships: [{ id: 'tie_npc_salt_a_npc_salt_b', from: 'npc_salt_a', to: 'npc_salt_b', type: 'friend' }] });
  const STORED = new Set(['npc_salt_a', 'npc_salt_b']);
  let db;
  let veil;

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    veil = await import('../../src/domain/display/galleryVeil.js');
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    let n = 0;
    for (const [mark, ov] of [['marked', veil.writeShareVeil({}, [])], ['unmarked', {}]]) {
      n += 1;
      const id = `5a170000-0000-0000-0000-${String(n).padStart(12, '0')}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,'Saltby','village',$3::jsonb,true,$4,now(),$5,'unlisted',$6::jsonb,false,true)`, [id, OWNER, JSON.stringify(TOWN), `salt-${mark}`, `salt-${mark}-link`, JSON.stringify(ov)]);
      await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
        values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `salt-${mark}-map`, `salt-${mark}-mapl`]);
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  /** The first person's key of each execution; every one must be re-keyed and all must differ. */
  const pair = async (sql, uid = '') => {
    await db.exec(`set test.uid = '${uid}';`);
    const res = await db.exec(sql);
    await db.exec(`set test.uid = '';`);
    return res.filter((r) => r.rows?.length).map((r) => r.rows[0]?.k);
  };

  it('1. a prepared statement of _gallery_veil (constant arguments), and of each read function as it is called, executed twice, serves different person keys; so do two reads in one statement', async () => {
    const doc = JSON.stringify(TOWN).replace(/'/g, "''");
    const same = [];
    const check = (label, keys, n = 2) => {
      if (keys.length !== n || keys.some((k) => !PERSON.test(String(k)) || STORED.has(k))) same.push(`${label}: not ${n} re-keyed keys (${keys.join(', ')})`);
      else if (new Set(keys).size !== n) same.push(`${label}: a salt served twice (${keys.join(', ')})`);
    };
    let q = 0;
    const EXECUTIONS = 8;
    const prepared = async (label, body, uid) => {
      q += 1;
      const runs = Array.from({ length: EXECUTIONS }, () => `execute rc${q};`).join(' ');
      check(label, await pair(`prepare rc${q} as ${body}; ${runs} set plan_cache_mode = force_generic_plan; execute rc${q}; reset plan_cache_mode; deallocate rc${q};`, uid), EXECUTIONS + 1);
    };
    for (const [mark, ov] of [['unmarked', '{}'], ['marked', JSON.stringify(veil.writeShareVeil({}, []))]]) {
      await prepared(`_gallery_veil ${mark}`, `select public._gallery_veil('${doc}'::jsonb, '${ov}'::jsonb, false) #>> '{body,npcs,0,id}' as k`);
      check(`two calls in one statement, ${mark}`, Object.values((await db.query(`select public._gallery_veil('${doc}'::jsonb, '${ov}'::jsonb, false) #>> '{body,npcs,0,id}' as a,
        public._gallery_veil('${doc}'::jsonb, '${ov}'::jsonb, false) #>> '{body,npcs,0,id}' as b`)).rows[0]));
      check(`one constant call over two rows, ${mark}`, (await db.query(`select public._gallery_veil('${doc}'::jsonb, '${ov}'::jsonb, false) #>> '{body,npcs,0,id}' as k
        from generate_series(1, 2) g`)).rows.map((r) => r.k));
      await prepared(`get_gallery_dossier ${mark}`, `select g.data #>> '{npcs,0,id}' as k from public.get_gallery_dossier('salt-${mark}') g`);
      await prepared(`get_unlisted_dossier ${mark}`, `select public.get_unlisted_dossier('salt-${mark}-link') #>> '{dossier,npcs,0,id}' as k`);
      await prepared(`import_gallery_dossier ${mark}`, `select g.data #>> '{npcs,0,id}' as k from public.import_gallery_dossier('salt-${mark}') g`, READER);
      await prepared(`get_gallery_map ${mark}`, `select public.get_gallery_map('salt-${mark}-map') #>> '{members,0,settlement,npcs,0,id}' as k`);
    }
    expect(same).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('1. every function that draws the salt, carries it, or reaches it through a call is declared VOLATILE', async () => {
    const rows = (await db.query(`with recursive f as (
        select p.proname, p.provolatile, p.prosrc, coalesce(p.proargnames, '{}') as args from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'),
      e as (select a.proname as caller, b.proname as callee from f a join f b on a.proname <> b.proname and a.prosrc ~ ('(^|[^a-z0-9_])' || b.proname || '\\s*\\(')),
      r(proname) as (select proname from f where prosrc ilike '%gen_random_uuid%' and proname like '%gallery%' union select e.caller from e join r on e.callee = r.proname)
      select distinct proname, provolatile from f where proname in (select proname from r) or 'salt' = any(args) order by 1`)).rows;
    expect(rows.map((r) => r.proname)).toEqual(expect.arrayContaining(['_gallery_veil', '_gallery_veil_rekey', 'get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map']));
    expect(rows.filter((r) => r.provolatile !== 'v').map((r) => r.proname)).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('NUMERIC IDS (the seat, R4-CURE): a card whose id is a NUMBER is re-keyed like any other, its tie follows, its served-marker key follows it (server); the twin the same', async () => {
    const NUM = { name: 'Numby', tier: 'village', npcs: [{ id: 7, name: 'Ada', role: 'Smith' }, { id: 'npc_num_b', name: 'Bo', role: 'Miller' }],
      relationships: [{ id: 70, from: 7, to: 'npc_num_b', type: 'friend' }] };
    const ov = veil.writeShareVeil({ 7: { revealDm: true } }, []);
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ('5a170000-0000-0000-0000-0000000000f7',$1,'Numby','village',$2::jsonb,true,'salt-num',now(),'salt-num-link','unlisted',$3::jsonb,false,true)`, [OWNER, JSON.stringify(NUM), JSON.stringify(ov)]);
    await db.exec(`set test.uid = '';`);
    const g = (await db.query('select to_jsonb(g) r from public.get_gallery_dossier($1) g', ['salt-num'])).rows[0]?.r;
    const bad = [];
    const look = (where, d, served) => {
      const ada = (d?.npcs || []).find((p) => p?.name === 'Ada');
      if (!ada || !PERSON.test(String(ada.id))) { bad.push(`${where}: the numeric id is served as ${JSON.stringify(ada?.id)}`); return; }
      const tie = (d.relationships || [])[0];
      if (!tie || tie.from !== ada.id || !/^tie_[0-9a-f]{16}$/.test(String(tie.id))) bad.push(`${where}: the tie does not follow (${JSON.stringify(tie)})`);
      if (served !== undefined && !Object.prototype.hasOwnProperty.call(served || {}, ada.id)) bad.push(`${where}: the served-marker key of the numeric id does not follow its card (${Object.keys(served || {}).join(', ')})`);
    };
    look('server gallery read', g?.data, g?.gallery_member_overrides);
    look('twin projection', veil.projectShareVeil(veil.galleryPayloadFor(clone(NUM), { shareDm: false, memberOverrides: ov }), ov));
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('2. the twin: two projections of one town in one page load (one module load) spell every id differently, each consistent within its payload (VR46 tooth (v))', () => {
    const same = [];
    const pub = veil.galleryPayloadFor(clone(TOWN), { shareDm: false, memberOverrides: {} });
    const marked = veil.writeShareVeil({}, []);
    const runs = {
      'projectShareVeil unmarked': () => veil.projectShareVeil(pub, {}),
      'projectShareVeil marked': () => veil.projectShareVeil(pub, marked),
      'applyVeil': () => veil.applyVeil(pub, veil.resolveVeil(veil.defaultVeilFor(pub), [])),
      'projectServedVeil unmarked': () => veil.projectServedVeil(pub, {}),
    };
    for (const [label, run] of Object.entries(runs)) {
      const [a, b] = [run(), run()];
      const ka = (a.npcs || []).map((p) => p?.id);
      const kb = (b.npcs || []).map((p) => p?.id);
      if (!ka.length || ka.some((k) => !PERSON.test(String(k)))) same.push(`${label}: not re-keyed (${ka.join(', ')})`);
      else if (ka.some((k, i) => k === kb[i])) same.push(`${label}: ONE salt for both projections (${ka.join(', ')})`);
      if (JSON.stringify(relabel(a)) !== JSON.stringify(relabel(b))) same.push(`${label}: the two projections differ beyond the ids`);
      const tie = (a.relationships || [])[0];
      if (!tie || tie.from !== ka[0] || tie.to !== ka[1]) same.push(`${label}: the tie does not follow its cards within the payload`);
    }
    expect(same).toEqual([]);
  });
});
