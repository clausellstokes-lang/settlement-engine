/**
 * criminalSwitchHandReach.pglite.test.js — A SWITCH SETS ONLY WHAT A HAND CAN SEE AND UNDO ON THAT RECORD (the seventh
 * chair's ruling VR34, 2026-11-20, from the security reader's V10-2, origin/lane/review-veil-10-2026-11-20 ::
 * docs/chair/2026-11-20/veil/REVIEW-VEIL-10.md; vetoable by the owner).
 *
 * THE FAULT IT PINS. "Hide everything criminal" (the chair's VS1, criminalVeilSwitch.js) wrote, for each criminal house,
 * every eye of CARD_KINDS.institution and, for each criminal power, every depth eye, while the Curate screen
 * (galleryVeil.js :: curateModelFor) draws an eye only where the visitor's copy carries something under it, and read two
 * of those somethings by a test the stored shape broke: a house's People by `str(npc.institution)` (an object in the
 * people car's shape, so never drawn), a power's depth on `powerStructure.factions` alone (master's stored shape carries
 * the roster on the top-level `factions[]`). Measured at 81dd06d7e (docs/chair/2026-11-20/veil/v102/out/): "Show all"
 * wrote addresses no screen offers 216 times (`people`), 52 (`services`), 16 each (a power's members, goals,
 * conflicts) over 36 born towns, and SERVED, on the Reveal-DM gallery read, `npcs[].institution` (which people are the
 * house's people) in the new shape and a criminal power's `factions[].members` in master's, which no hand could open or
 * shut again.
 *
 * THE CURE. The screen offers an eye BY IDENTITY with the applier (every copy of a card by id, the house a person
 * belongs to as the applier reads it, in both stored shapes); the switch's list is the criminal family INTERSECTED with
 * the addresses that model draws (criminalVeilSwitch.js :: offeredAddressesOf), so the two cannot drift; a flip also
 * drops a family delta on an address no hand can reach (an earlier Show-all's stale write).
 *
 * HOW, BY EXECUTION ONLY. An in-process pglite chain of every migration on disk; born towns of every tier (a browser's
 * dials), each stored in BOTH stored shapes (the current client's, and master's: ties by `npc1Id`/`npc2Id`, a person's
 * house as a string, the powers' rosters on the top-level `factions[]`), Reveal DM off and on, read by the server's own
 * doors as an anonymous visitor (the gallery read, `get_gallery_dossier`, and the party link, `get_unlisted_dossier`),
 * and the client's twin beside them (galleryVeil.js :: projectShareVeil over galleryPayloadFor).
 *
 * WHAT MUST HOLD, on every town, shape and Reveal-DM setting:
 *   (A) every address "Show all" and "Hide all" write is one the Curate screen offers for that record;
 *   (B) SERVED(Show all) equals SERVED(every offered criminal eye opened by hand), the gallery read, the link, the twin;
 *   (C) SERVED(Hide all) equals SERVED(every offered criminal eye shut by hand), from a draft with every offered eye open;
 *   (D) THE CONTROL: an address of the family the screen does not offer, planted in "Show all"'s list, is named by (A)
 *       (red), and is not served (the gallery read with it equals the read without it: an address no hand can reach
 *       governs nothing on the record);
 *   (E) a house's People eye, opened by hand with the house shown: the visitor's bytes hold, on each of its people, the
 *       house record the projection carried and nothing more; the same eye open with the house HIDDEN WHOLE: no person,
 *       on any list, names the house;
 *   (F) THE CHAIR'S CONDITION (02:41 UTC): an eye the screen newly offers starts at what the server serves TODAY for a
 *       share nobody touched. On the untouched share (marked with no delta, and unmarked), the gallery read and the
 *       link: every People eye and every Members eye the screen draws reads hidden exactly where the served bytes carry
 *       nothing under it (its house's people; the power's roster on either list). The served bytes of each untouched
 *       read are hashed (V102_TALLY) so the base's and the tip's can be compared: the screen learning an eye changes no
 *       served byte.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { bijectionTeeth, canonPeople, notBijective, readsDiffer, unkeyPeople } from './personIdBijection.shared.mjs';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const TOWN_TIMEOUT_MS = 1_800_000;

const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');
const OWNER = '11111111-1111-1111-1111-111111111111';
const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
/**
 * Born towns, one per tier (seeds read 2026-11-20 at 81dd06d7e: docs/chair/2026-11-20/veil/v102/measure/seeds.probe.jsx).
 * Every born town carries the family's three groupings (presentCriminalGroupings: criminal services, Defense's criminal
 * architecture, Power's capture reading; measure/thorp.probe.jsx); the thorp carries nothing else (groupings only), the
 * hamlet up carry criminal houses whose people the Reveal-DM copy names, the city and the metropolis criminal powers.
 */
const TOWNS = Object.freeze([
  { seed: 'v102-thorp-0', settType: 'thorp' },
  { seed: 'v102-hamlet-6', settType: 'hamlet' },
  { seed: 'v102-village-3', settType: 'village' },
  { seed: 'v102-town-1', settType: 'town' },
  { seed: 'v102-city-0', settType: 'city' },
  { seed: 'v102-metropolis-1', settType: 'metropolis' },
]);
const AT = '2026-11-20T00:00:00.000Z';

async function buildDb() {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select '{}'::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}',
      raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz,
      email_confirmed_at timestamptz, phone text, deleted_at timestamptz, is_anonymous boolean default false);
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create schema if not exists extensions;
    create schema if not exists cron;
    create table if not exists cron.job (jobid bigserial primary key, jobname text, schedule text, command text);
    create or replace function cron.schedule(n text, s text, c text) returns bigint language sql as $fn$
      insert into cron.job (jobname, schedule, command) values (n, s, c) returning jobid $fn$;
    create or replace function cron.unschedule(n text) returns boolean language sql as $fn$ select true $fn$;
    create or replace function cron.unschedule(n bigint) returns boolean language sql as $fn$ select true $fn$;
    create schema if not exists storage;
    create table if not exists storage.buckets (id text primary key, name text, public boolean, owner uuid,
      file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now(), updated_at timestamptz default now());
    create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text,
      owner uuid, metadata jsonb, created_at timestamptz default now(), updated_at timestamptz default now());
    create or replace function storage.foldername(name text) returns text[] language sql immutable as $fn$
      select string_to_array(name, '/') $fn$;
    create extension if not exists pgcrypto;
  `);
  const files = readdirSync(MIGRATIONS).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort();
  const failed = [];
  for (const f of files) {
    // pg_cron / pg_net are not in pglite: their install statements become no-ops (cron.* is stubbed above).
    const sql = readFileSync(join(MIGRATIONS, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
    try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 160)}`); }
  }
  await db.exec(`insert into auth.users (id) values ('${OWNER}') on conflict do nothing;
    insert into public.profiles (id) values ('${OWNER}') on conflict do nothing;
    set test.uid = '';`);
  return { db, files, failed };
}

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** A JSON spelling with every object's keys sorted (a jsonb document comes back key-sorted). */
const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
const str = (v) => (typeof v === 'string' ? v : '');

/** The first paths at which two served documents differ. */
function diffPaths(a, b, p = '', out = []) {
  if (out.length >= 4) return out;
  if (Array.isArray(a) && Array.isArray(b)) { for (let i = 0; i < Math.max(a.length, b.length); i += 1) diffPaths(a[i], b[i], `${p}[${i}]`, out); return out; }
  if (isRec(a) && isRec(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffPaths(a[k], b[k], p ? `${p}.${k}` : k, out); return out; }
  if (JSON.stringify(a) !== JSON.stringify(b)) out.push(`${p}: ${JSON.stringify(a)?.slice(0, 90)} | ${JSON.stringify(b)?.slice(0, 90)}`);
  return out;
}
/**
 * VR46 (R4I-PAGE-4, VEIL-38 G3; the form of galleryVeilHandRows.pglite.test.js :: differServed): every non-owner read
 * re-keys every person id under a salt of its own (VR10), so two served documents are compared MODULO EACH READ'S
 * PERSON-ID BIJECTION AND NOTHING ELSE (`canonPeople` on both sides, every other byte by `diffPaths` as before), with the
 * teeth the pair can carry: (ii) every served person or tie id is one the re-key made (`npc_`/`tie_` and 16 hex: a stored
 * id served un-re-keyed reds); (iv) no two cards of one read under one id; (v) the two reads share no person id. Tooth (i)
 * and (iii) bite through the canonical comparison itself; `teethOf` executes all five on the guard's own reads.
 */
const FRESH_ID = /^(npc|tie)_[0-9a-f]{16}$/;
function diffServed(a, b) {
  if (!isRec(a) || !isRec(b)) return diffPaths(a, b);
  const ca = canonPeople(a); const cb = canonPeople(b);
  const out = diffPaths(ca.doc, cb.doc);
  for (const [side, c] of [['first', ca], ['second', cb]]) for (const v of c.names.keys()) if (!FRESH_ID.test(String(v))) out.push(`VR46 (ii): the ${side} read serves a person id the re-key did not make: ${String(v).slice(0, 60)}`);
  for (const [side, d] of [['first', a], ['second', b]]) out.push(...notBijective(d).map((x) => `VR46 (iv): the ${side} read: ${x}`));
  const shared = readsDiffer(a, b);
  if (shared.length && shared[0] !== '(the first read serves no person id)') out.push(`VR46 (v): the two reads share ${shared.length} person ids`);
  return out;
}

describe('a switch sets only what a hand can see and undo on that record (VR34)', () => {
  /** @type {any} */ let LIVE;
  /** @type {any} */ let lib;
  const tally = { cases: 0, groupingsOnly: 0, written: 0, served: 0, planted: 0, peopleOpen: 0, peopleWhole: 0, masterMembers: 0,
    untouchedEyes: 0, untouchedShown: 0, untouched: {}, teeth: 0, teethAbsent: {} };
  /**
   * VR46's FIVE TEETH (R4I-PAGE-4), executed on a re-stated guard's own reads: `x` the read the guard judges, `y` the read
   * it is judged against, `again` a second read of `x`'s town and veil (tooth (v)), `storedId` a stored person id of the
   * record (tooth (ii)). Each mutation of `x` must make `diffServed(x, y)` red. A tooth the payload cannot carry is
   * tallied by name (`teethAbsent`), never counted as bitten.
   */
  function teethOf(faults, at, x, y, again, storedId) {
    const { missed, absent } = bijectionTeeth(x, (c) => diffServed(c, y).length === 0, { storedId, again });
    for (const m of missed) faults.push(`${at} VR46 teeth: ${m}`);
    for (const a of absent) tally.teethAbsent[a] = (tally.teethAbsent[a] || 0) + 1;
    tally.teeth += 1;
  }

  beforeAll(async () => {
    LIVE = await buildDb();
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const density = await import('../../src/domain/density/densityCreateBoundary.js');
    await density.loadGenerationLawPayloads();
    lib = {
      gen: generateSettlementPipeline, birthConfig: density.birthConfig,
      DEFAULT_CONFIG: (await import('../../src/store/configSlice.js')).DEFAULT_CONFIG,
      compose: (await import('../../src/components/new/publicProseCompose.js')).composePublicProse,
      veil: await import('../../src/domain/display/galleryVeil.js'),
      sw: await import('../../src/domain/display/criminalVeilSwitch.js'),
      membershipsOf: (await import('../../src/domain/people/membership.js')).membershipsOf,
      cardHouseOf: (await import('../../src/domain/people/cardPowers.js')).cardHouseOf,
    };
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the chain applies whole: every migration on disk', () => {
    expect(LIVE.failed).toEqual([]);
    expect(LIVE.files.at(-1)).toMatch(/^212_/);
  });

  /**
   * Master's stored shape (read from origin/master db832c892's own generator, docs/chair/2026-11-20/veil/v102/out/
   * shape-master.json): a tie's ends `npc1Id`/`npc2Id`; a person's house, where it has one, as the house's name; the
   * powers listed again at the top level as `{ name, dominantCategory, members }` with each member's whole record, and
   * no roster on `powerStructure.factions`.
   */
  function toMasterShape(record) {
    const out = structuredClone(record);
    if (Array.isArray(out.relationships)) out.relationships = out.relationships.map(({ from, to, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to }));
    for (const n of recs(out.npcs)) if (isRec(n.institution)) n.institution = str(n.institution.key) || str(n.institution.name);
    const powers = recs(out.powerStructure?.factions);
    for (const f of powers) delete f.members;
    out.factions = powers.map((f) => {
      const name = str(f.faction) || str(f.name);
      return { name, dominantCategory: f.category, members: recs(out.npcs).filter((n) => lib.membershipsOf(n).some((m) => m.power === name)) };
    });
    return out;
  }
  /** The house a person belongs to, as the applier reads it (the people car's record, else the name). */
  const houseOf = (n) => lib.cardHouseOf(n) || str(n.institution);
  /** Every copy of a person a document carries (the people, and each power's roster on either list). */
  const peopleOf = (s) => [...recs(s?.npcs), ...recs(s?.powerStructure?.factions).flatMap((f) => recs(f.members)), ...recs(s?.factions).flatMap((f) => recs(f.members))];

  /** Every address the Curate screen draws for a payload, read off the model as CurateMode draws it (independent of the switch). */
  const offeredBy = (model) => new Set(model.sections.flatMap((sec) => [...sec.groupings, ...sec.switches,
    ...sec.cards.flatMap((c) => [...(c.whole ? [c.whole] : []), ...c.eyes])]).map((e) => e.address));
  /** The criminal family, from the defaults' classes, independently of the switch (a family grouping only where present). */
  function familyOf(defaults, present) {
    const FAMILY = new Set(lib.sw.CRIMINAL_VEIL_CLASSES);
    const fam = defaults.filter((d) => FAMILY.has(d.cls));
    const own = new Set(fam.map((d) => d.address));
    const houses = new Set(fam.filter((d) => d.address.startsWith('card:institution:')).map((d) => d.address.slice('card:institution:'.length)));
    const factions = new Set(fam.map((d) => lib.veil.parseVeilAddress(d.address)).filter((p) => p?.type === 'field' && p.kind === 'faction').map((p) => p.id));
    const pred = (a) => {
      const p = lib.veil.parseVeilAddress(a);
      if (!p) return false;
      if (p.type === 'tab' || p.type === 'block') return own.has(a) && present.has(a);
      if (own.has(a)) return true;
      if (p.type !== 'field') return false;
      return (p.kind === 'institution' && houses.has(p.id)) || (p.kind === 'faction' && factions.has(p.id) && p.field !== 'capture')
        || (p.kind === 'npc' && p.field === 'corruption');
    };
    return { pred, houses, factions };
  }
  /** A hand toggling every drawn eye the predicate keeps into the wanted state, to a fixed point (an eye under a house hidden whole is drawn once the house opens). */
  function byHand(payload, defaults, start, keep, hidden) {
    let d = [...start];
    for (let i = 0; i < 8; i += 1) {
      let moved = false;
      for (const sec of lib.veil.curateModelFor(payload, d).sections) {
        for (const e of [...sec.groupings, ...sec.switches, ...sec.cards.flatMap((c) => [...(c.whole ? [c.whole] : []), ...c.eyes])]) {
          if (!keep(e.address) || e.hidden === hidden) continue;
          d = lib.veil.toggleVeilDelta(d, e.address, defaults); moved = true;
        }
      }
      if (!moved) break;
    }
    return d;
  }

  let nrow = 0;
  /** Store the record with a share veil and read it as an anonymous visitor through the server's door. */
  async function serve(record, dm, deltas, read) {
    const ov = deltas === null ? {} : lib.veil.writeShareVeil({}, deltas, { mode: 'live', at: AT });
    nrow += 1;
    const id = `bbbb1020-0000-0000-0000-${String(nrow).padStart(12, '0')}`;
    await LIVE.db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility,
      gallery_member_overrides, gallery_share_dm, gallery_importable, gallery_share_narrated)
      values ($1, $2, $3, $4, $5, true, $6, now(), $7, 'unlisted', $8, $9, true, false)`,
    [id, OWNER, record.name || 'x', record.tier || 'town', JSON.stringify(record), `v102p${nrow}`, `v102l${nrow}`, JSON.stringify(ov), dm]);
    try {
      if (read === 'link') return (await LIVE.db.query('select public.get_unlisted_dossier($1) as x', [`v102l${nrow}`])).rows[0]?.x?.dossier;
      return (await LIVE.db.query('select * from public.get_gallery_dossier($1)', [`v102p${nrow}`])).rows[0]?.data;
    } finally { await LIVE.db.query('delete from public.settlements where id = $1', [id]); }
  }
  /** The client's twin of the gallery read: the same projection, the stored veil applied. */
  function twin(record, dm, deltas) {
    const ov = lib.veil.writeShareVeil({}, deltas, { mode: 'live', at: AT });
    return JSON.parse(JSON.stringify(lib.veil.projectShareVeil(lib.veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: ov }), ov)));
  }

  for (const town of TOWNS) {
    for (const shape of ['current', 'master']) {
      it(`${town.seed} (${shape}'s stored shape), Reveal DM off and on: the switch writes only what the screen offers, and serves what the hand serves`, async () => {
        const { veil, sw } = lib;
        const { seed, settType } = town;
        const raw = lib.gen(lib.birthConfig({ ...lib.DEFAULT_CONFIG, ...BROWSER, settType }), null, { seed, customContent: {} });
        const born = JSON.parse(JSON.stringify({ ...raw, publicProse: lib.compose(raw) }));
        const record = shape === 'master' ? toMasterShape(born) : born;
        const faults = [];
        for (const dm of [false, true]) {
          const at = `${seed} ${shape} dm=${dm}`;
          const pub = veil.galleryPayloadFor(record, { shareDm: dm });
          const model = veil.curateModelFor(pub, []);
          const defaults = model.defaults;
          const present = sw.presentCriminalGroupings(pub);
          const offered = offeredBy(model);
          const { pred: family, houses } = familyOf(defaults, present);
          tally.cases += 1;

          // (F) the untouched share: what the server serves today, and the screen's state of each newly learnable eye
          for (const [kind, deltas] of [['marked', []], ['unmarked', null]]) {
            for (const read of ['gallery', 'link']) {
              const doc = await serve(record, dm, deltas, read);
              tally.untouched[`${seed} ${shape} dm=${dm} ${kind} ${read}`] = createHash('sha256').update(canon(doc)).digest('hex');
              if (kind !== 'marked' || read !== 'gallery') continue;
              for (const card of model.sections.flatMap((sec) => sec.cards)) {
                for (const e of card.eyes) {
                  if (!(card.kind === 'institution' && e.field === 'people') && !(card.kind === 'faction' && e.field === 'members')) continue;
                  const shut = e.hidden || !!card.whole?.hidden;
                  const house = card.kind === 'institution' ? str(recs(pub.institutions).find((h) => veil.CARD_KINDS.institution.idOf(h) === card.id)?.name) : '';
                  const carried = card.kind === 'institution'
                    ? peopleOf(doc).some((n) => houseOf(n) === house)
                    : [...recs(doc?.powerStructure?.factions), ...recs(doc?.factions)].some((f) => veil.CARD_KINDS.faction.idOf(f) === card.id && recs(f.members).length > 0);
                  tally.untouchedEyes += 1;
                  if (!shut) tally.untouchedShown += 1;
                  if (shut === carried) faults.push(`${at} (F): the screen reads ${e.address} ${shut ? 'hidden' : 'shown'}, the untouched share's bytes ${carried ? 'carry' : 'carry nothing under'} it`);
                }
              }
            }
          }
          if (shape === 'master' && dm) tally.masterMembers += [...offered].filter((a) => /^field:faction:.*:members$/.test(a)).length;
          const unreachable = (list) => list.filter((d) => !offered.has(d.address)).map((d) => d.address);

          const show = sw.setCriminalVeil([], defaults, false, present, model);
          const allOpen = byHand(pub, defaults, [], () => true, false);
          const hide = sw.setCriminalVeil(allOpen, defaults, true, present, model);
          const parts = sw.criminalPartsOf(defaults, [], present, model);
          if (!parts.length) faults.push(`${at}: no criminal part, yet every born town carries the family's groupings`);
          if (parts.every((a) => /^(tab|block):/.test(a))) tally.groupingsOnly += 1;
          // (A) every written address is drawn for this record
          const wrote = [...new Set([...unreachable(show), ...unreachable(hide.filter((d) => !allOpen.some((x) => x.address === d.address && x.hidden === d.hidden)))])];
          tally.written += show.length + hide.length;
          for (const a of wrote.slice(0, 4)) faults.push(`${at} (A): the switch wrote ${a}, which no screen offers`);

          // (B) and (C): served equal to the hand's, on the gallery read, the link and the twin
          const handOpen = byHand(pub, defaults, [], family, false);
          const handShut = byHand(pub, defaults, allOpen, family, true);
          // VR46 (R4I-PAGE-4): each pair of reads compared modulo each read's person-id bijection, the teeth on each
          const storedId = String(recs(record.npcs)[0]?.id ?? '');
          for (const [label, x, y] of [['(B) Show all', show, handOpen], ['(C) Hide all', hide, handShut]]) {
            for (const read of ['gallery', 'link']) {
              const sx = await serve(record, dm, x, read);
              const sy = await serve(record, dm, y, read);
              const d = diffServed(sx, sy);
              tally.served += 1;
              for (const p of d) faults.push(`${at} ${label} vs the hand, ${read}: ${p}`);
              teethOf(faults, `${at} ${label} vs the hand, ${read}`, sx, sy, await serve(record, dm, x, read), storedId);
            }
            const [tx, ty] = [twin(record, dm, x), twin(record, dm, y)];
            for (const p of diffServed(tx, ty)) faults.push(`${at} ${label} vs the hand, the twin: ${p}`);
            teethOf(faults, `${at} ${label} vs the hand, the twin`, tx, ty, twin(record, dm, x), storedId);
          }

          // (D) the control: a planted family address no screen offers is named by (A), and is not served
          const plant = [...houses].flatMap((id) => Object.keys(veil.CARD_KINDS.institution.fields).map((f) => `field:institution:${id}:${f}`))
            .concat(defaults.map((d) => veil.parseVeilAddress(d.address)).filter((p) => p?.type === 'field' && p.kind === 'faction')
              .flatMap((p) => Object.keys(veil.CARD_KINDS.faction.fields).filter((f) => f !== 'capture').map((f) => `field:faction:${p.id}:${f}`)))
            .find((a) => family(a) && !offered.has(a));
          if (plant) {
            const planted = [...show, { address: plant, hidden: false }];
            if (!unreachable(planted).includes(plant)) faults.push(`${at} (D): the planted ${plant} was not named`);
            const [sp, ss] = [await serve(record, dm, planted, 'gallery'), await serve(record, dm, show, 'gallery')];
            const d = diffServed(sp, ss);
            for (const p of d) faults.push(`${at} (D): the planted ${plant} is served: ${p}`);
            teethOf(faults, `${at} (D)`, sp, ss, await serve(record, dm, planted, 'gallery'), storedId);
            tally.planted += 1;
          }

          // (E) a house's People eye by hand: shown with the house, nothing with the house hidden whole
          const house = recs(pub.institutions).find((h) => offered.has(`field:institution:${veil.CARD_KINDS.institution.idOf(h)}:people`)
            && houses.has(veil.CARD_KINDS.institution.idOf(h)));
          if (house) {
            const id = veil.CARD_KINDS.institution.idOf(house);
            const name = str(house.name);
            const open = [{ address: `card:institution:${id}`, hidden: false }, { address: `field:institution:${id}:people`, hidden: false }];
            const served = await serve(record, dm, open, 'gallery');
            // VR46 (R4I-PAGE-4): each served person read back to the projection's person by the read's bijection
            // (`unkeyPeople` against the projection, which throws on a stored id served or two cards under one id); a
            // person the bijection lines up with a card of another name reds, so a shifted canonical order cannot pass
            const doc = unkeyPeople(served, pub);
            const byId = new Map(peopleOf(pub).map((n) => [veil.CARD_KINDS.npc.idOf(n), n]));
            for (const n of peopleOf(doc)) {
              const p = byId.get(veil.CARD_KINDS.npc.idOf(n));
              if (p && str(p.name) !== str(n.name)) faults.push(`${at} (E) VR46: the bijection reads ${n.name} as ${p.name}`);
            }
            const mine = peopleOf(doc).filter((n) => houseOf(n) === name);
            const projected = new Map(peopleOf(pub).filter((n) => houseOf(n) === name).map((n) => [veil.CARD_KINDS.npc.idOf(n), n.institution]));
            if (!mine.length) faults.push(`${at} (E): the house ${name} shown with its People open sends none of its people`);
            for (const n of mine) {
              if (canon(n.institution) !== canon(projected.get(veil.CARD_KINDS.npc.idOf(n)))) faults.push(`${at} (E): ${n.name} carries ${JSON.stringify(n.institution)} where the projection carried ${JSON.stringify(projected.get(veil.CARD_KINDS.npc.idOf(n)))}`);
            }
            tally.peopleOpen += mine.length;
            const whole = await serve(record, dm, [{ address: `field:institution:${id}:people`, hidden: false }], 'gallery');
            const named = peopleOf(whole).filter((n) => houseOf(n) === name
              || (Array.isArray(n.linkedInstitutionIds) && n.linkedInstitutionIds.some((v) => v === id || v === name))
              || Object.entries(n).some(([k, v]) => k !== 'id' && k !== 'name' && v === name));
            for (const n of named.slice(0, 3)) faults.push(`${at} (E): the house ${name} hidden whole, yet ${n.name} names it`);
            if (recs(whole?.institutions).some((h) => veil.CARD_KINDS.institution.idOf(h) === id)) faults.push(`${at} (E): the house ${name} hidden whole is sent`);
            tally.peopleWhole += 1;
          }
        }
        expect(faults, faults.slice(0, 24).join('\n')).toEqual([]);
      }, TOWN_TIMEOUT_MS);
    }
  }

  it('the arms were live: every class of case was met', () => {
    if (process.env.V102_TALLY) writeFileSync(process.env.V102_TALLY, JSON.stringify(tally));
    expect(tally.cases).toBe(TOWNS.length * 4);
    expect(tally.groupingsOnly, 'the thorp: the family\'s groupings and nothing else, both shapes, both settings').toBeGreaterThanOrEqual(4);
    expect(tally.served, 'served comparisons (B) and (C)').toBeGreaterThanOrEqual(40);
    expect(tally.planted, 'the control (D) planted somewhere').toBeGreaterThan(0);
    expect(tally.peopleOpen, "(E) a house's people sent with its People eye open").toBeGreaterThan(0);
    expect(tally.peopleWhole, '(E) a house hidden whole with its People eye open').toBeGreaterThan(0);
    expect(tally.masterMembers, "master's shape: a power's Members eye drawn from the top-level roster").toBeGreaterThan(0);
    expect(tally.untouchedEyes, '(F) People and Members eyes read against the untouched share').toBeGreaterThan(0);
    expect(tally.untouchedShown, '(F) some of them open by default (a power\'s roster that is not criminal)').toBeGreaterThan(0);
    expect(Object.keys(tally.untouched)).toHaveLength(TOWNS.length * 2 * 2 * 4);
    expect(tally.teeth, 'VR46 (R4I-PAGE-4): the five teeth executed on the re-stated guards').toBeGreaterThanOrEqual(tally.served);
  });
});
