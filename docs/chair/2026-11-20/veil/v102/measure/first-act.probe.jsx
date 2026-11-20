// VEIL-V102 — THE FIRST ACT (item 1): the reader's V10-2 figures reproduced at this checkout, born towns, the generator
// named by V102_GEN (this checkout: the new stored shape; a git archive of origin/master: master's), Reveal DM off and on.
// (1) every address Show-all writes that no Curate screen offers, by class; (2) per class, is it offered at all, and does
// the data under it exist (the applier's reach by identity vs the screen's test); (3) SERVED(Show-all) against SERVED(every
// family eye a hand can open), the gallery read and the party link, through an in-process pglite chain of every migration.
// The reader's method (docs/chair/2026-11-20/veil/probes/REVIEW-VEIL-10/switch.probe.jsx), the server swapped for pglite.
import { it } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
const GEN = process.env.V102_GEN || process.cwd();
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (typeof v === 'string' ? v : '');
function diff(a, b, p, out) {
  if (Array.isArray(a) && Array.isArray(b)) { const n = Math.max(a.length, b.length); for (let i = 0; i < n; i += 1) diff(a[i], b[i], `${p}[${i}]`, out); return; }
  if (isRec(a) && isRec(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], p ? `${p}.${k}` : k, out); return; }
  if (JSON.stringify(a) !== JSON.stringify(b)) out.push([p, a, b]);
}
async function buildDb() {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(`create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$ select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select '{}'::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz, email_confirmed_at timestamptz, phone text, deleted_at timestamptz, is_anonymous boolean default false);
    do $do$ begin if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if; end $do$;
    create schema if not exists extensions; create schema if not exists cron;
    create table if not exists cron.job (jobid bigserial primary key, jobname text, schedule text, command text);
    create or replace function cron.schedule(n text, s text, c text) returns bigint language sql as $fn$ insert into cron.job (jobname, schedule, command) values (n, s, c) returning jobid $fn$;
    create or replace function cron.unschedule(n text) returns boolean language sql as $fn$ select true $fn$;
    create or replace function cron.unschedule(n bigint) returns boolean language sql as $fn$ select true $fn$;
    create schema if not exists storage;
    create table if not exists storage.buckets (id text primary key, name text, public boolean, owner uuid, file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now(), updated_at timestamptz default now());
    create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid, metadata jsonb, created_at timestamptz default now(), updated_at timestamptz default now());
    create or replace function storage.foldername(name text) returns text[] language sql immutable as $fn$ select string_to_array(name, '/') $fn$;
    create extension if not exists pgcrypto;`);
  const dir = resolve(process.cwd(), 'supabase', 'migrations');
  const files = readdirSync(dir).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort();
  const failed = [];
  for (const f of files) {
    const sql = readFileSync(join(dir, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
    try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 120)}`); }
  }
  await db.exec(`insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111') on conflict do nothing;
    insert into public.profiles (id) values ('11111111-1111-1111-1111-111111111111') on conflict do nothing; set test.uid = '';`);
  return { db, files, failed };
}
it('VEIL-V102 first act', async () => {
  const { db, files, failed } = await buildDb();
  const veil = await import(`${process.cwd()}/src/domain/display/galleryVeil.js`);
  const sw = await import(`${process.cwd()}/src/domain/display/criminalVeilSwitch.js`);
  const { cardHouseOf } = await import(`${process.cwd()}/src/domain/people/cardPowers.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let nrow = 0;
  const serve = async (rec, dm, deltas, read) => {
    const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    nrow += 1; const id = `abcd1000-0000-0000-0000-${String(nrow).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true,false)`, [id, rec.name || 'x', JSON.stringify(rec), `sw${nrow}`, `swl${nrow}`, JSON.stringify(ov), dm]);
    const r = read === 'link' ? (await db.query('select public.get_unlisted_dossier($1) x', [`swl${nrow}`])).rows[0]?.x?.dossier : (await db.query('select * from public.get_gallery_dossier($1)', [`sw${nrow}`])).rows[0]?.data;
    await db.query('delete from public.settlements where id = $1', [id]);
    return r;
  };
  const offered = (pub, deltas) => { const m = veil.curateModelFor(pub, deltas); return m.sections.flatMap((s) => [...s.groupings, ...s.switches, ...s.cards.flatMap((c) => [...(c.whole ? [c.whole] : []), ...c.eyes])]); };
  const handOpen = (pub, defaults, keep) => { let d = []; for (let i = 0; i < 6; i += 1) { let moved = false; for (const e of offered(pub, d)) { if (!keep(e.address) || !e.hidden) continue; d = veil.toggleVeilDelta(d, e.address, defaults); moved = true; } if (!moved) break; } return d; };
  const classOf = (a) => { const p = veil.parseVeilAddress(a); if (!p) return a; return p.type === 'field' ? `field:${p.kind}:<id>:${p.field}` : p.type === 'card' ? `card:${p.kind}:<id>` : a; };
  const SIZES = (process.env.V102_SIZES || 'village,town,city,city,metropolis,metropolis').split(',');
  const CRISES = (process.env.V102_CRISES || 'none,infiltrated,insurgency,occupied,indebted,none').split(',');
  const R = { gen: GEN, chain: { files: files.length, last: files.at(-1), failed }, towns: 0, withParts: 0, written: {}, unreachable: {}, offeredOfWritten: {}, people: { houses: 0, applierReach: 0, screenTest: 0, housesWithPeopleByIdentity: 0, housesWithPeopleByString: 0, npcInstitutionTypes: {} }, services: { written: 0, withRows: 0 }, faction: {}, showVsHand: {}, ex: {} };
  const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
  let idx = 0;
  for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; const seed = `rv10-sw-${size}-${crisis}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
    if (compose) { A = { ...A }; delete A.publicProse; A = withPP(A, compose(A)); }
    A = JSON.parse(JSON.stringify(A)); R.towns += 1;
    for (const n of A.npcs || []) bump(R.people.npcInstitutionTypes, n.institution == null ? 'absent' : typeof n.institution);
    for (const dm of [false, true]) {
      const pub = veil.galleryPayloadFor(A, { shareDm: dm, memberOverrides: {} });
      const defaults = veil.curateModelFor(pub, []).defaults;
      const present = sw.presentCriminalGroupings(pub);
      const parts = sw.criminalPartsOf(defaults, [], present); if (!parts.length) continue;
      R.withParts += 1; const partSet = new Set(parts);
      const show = sw.setCriminalVeil([], defaults, false, present);
      const reach = new Set(); for (let i = 0; i < 6; i += 1) { for (const e of offered(pub, handOpen(pub, defaults, () => true))) reach.add(e.address); for (const e of offered(pub, [])) reach.add(e.address); }
      for (const x of show) { const c = classOf(x.address); bump(R.written, c); if (reach.has(x.address)) bump(R.offeredOfWritten, c); else { bump(R.unreachable, c); R.ex[c] = R.ex[c] || `${seed} dm=${dm} ${x.address}`; } }
      // the data under each class, by the applier's identity (npcHouseOf) and by the screen's test (str)
      const npcs = [...(pub.npcs || []), ...((pub.powerStructure?.factions) || []).flatMap((f) => f.members || []), ...((pub.factions) || []).flatMap((f) => f.members || [])].filter(isRec);
      const rows = Object.values(isRec(pub.availableServices) ? pub.availableServices : {}).flatMap((r) => (Array.isArray(r) ? r : []));
      for (const inst of pub.institutions || []) {
        const id = veil.CARD_KINDS.institution.idOf(inst); if (!partSet.has(`card:institution:${id}`)) continue;
        const name = str(inst.name); R.people.houses += 1;
        const byId = npcs.filter((n) => (cardHouseOf(n) || str(n.institution)) === name).length; const byStr = npcs.filter((n) => str(n.institution) === name).length;
        R.people.applierReach += byId; R.people.screenTest += byStr; if (byId) R.people.housesWithPeopleByIdentity += 1; if (byStr) R.people.housesWithPeopleByString += 1;
        R.services.written += 1; if (rows.some((r) => isRec(r) && str(r.institution) === name)) R.services.withRows += 1;
      }
      for (const a of parts) {
        const p = veil.parseVeilAddress(a); if (!p || p.type !== 'field' || p.kind !== 'faction') continue;
        const keys = veil.CARD_KINDS.faction.fields[p.field] || [];
        const has = (list) => (list || []).filter(isRec).some((f) => veil.CARD_KINDS.faction.idOf(f) === p.id && keys.some((k) => f[k] != null && !(Array.isArray(f[k]) && !f[k].length) && f[k] !== ''));
        const where = `${has(pub.powerStructure?.factions) ? 'ps' : '-'}/${has(pub.factions) ? 'top' : '-'}`;
        bump(R.faction, `${p.field} data in powerStructure.factions/factions: ${where}; offered ${reach.has(a)}`);
      }
      const hand = handOpen(pub, defaults, (a) => partSet.has(a) || a === 'class:npc:corruption');
      for (const read of ['gallery', 'link']) {
        const out = []; diff(await serve(A, dm, show, read), await serve(A, dm, hand, read), '', out);
        for (const [p, a, b] of out) { const k = `${read} dm=${dm} ${p.replace(/\[\d+\]/g, '[]')}`; bump(R.showVsHand, k); R.ex[k] = R.ex[k] || `${seed}: SHOW=${JSON.stringify(a)?.slice(0, 160)} | HAND=${JSON.stringify(b)?.slice(0, 160)}`; }
      }
    }
  }
  await db.close();
  writeFileSync(process.env.V102_OUT, JSON.stringify(R, null, 1));
}, 14_400_000);
