// d-smoke.mjs — R4I-SQL's proof (d), THE SMOKE READ (VEIL-35, R4-IDS PART TWO). Run from the worktree root:
//   PGHOST=/var/tmp/rv7 PGUSER=postgres node docs/chair/2026-11-20/veil/out/v35/r4isql/d-smoke.mjs r4i35_a
// against a LOCAL database carrying 001..211 + 212 (never a hosted one). It inserts one hand-written town as settlement rows
// (the columns of tests/security/galleryVeilIds.pglite.test.js's insert), marked and unmarked, Reveal DM off and on, reads
// each through get_gallery_dossier TWICE (and get_unlisted_dossier twice), and asks of every read:
//   (1) the two reads share NO served person id (cards and tie ids);
//   (2) no STORED person id is served anywhere, as a substring of any string or any key, the served marker included
//       (personIdBijection.shared.mjs :: storedIdsServed, tooth (ii));
//   (3) every tie end, a card's own tie's references, the cast's roles and levers, the trace's person targets, a goal's
//       target and every person key of the served marker resolve to a card the read serves;
//   (4) item 6: the plant `npc.bo` (a card whose STORED id is `npc.bo`, marker revealDm true) keeps its entry, re-keyed
//       as its card's id, and the no-id card's name key `npc.nameless_ned` is kept as it is.
// The number id is 90817263 (8 digits): a short one ("42") is found by chance inside a random hex key by the substring tooth.
// It prints one line per read and exits 1 on any finding.
import pg from 'pg';
import { writeShareVeil } from '../../../../../../../src/domain/display/galleryVeil.js';
import { storedIdsServed } from '../../../../../../../tests/security/personIdBijection.shared.mjs';

const db = process.argv[2] || 'r4i35_a';
const OWNER = '11111111-1111-1111-1111-111111111111';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);

const TOWN = {
  name: 'Smokewell', tier: 'town',
  npcs: [
    { id: 'npc_veiled_thieves_guild_1', name: 'Vex Morrow', role: 'Fence', category: 'criminal',
      goal: { short: 'Undercut the nobles', intent: { short: { target: { id: 'npc_power_noble_families_1' } }, long: { target: { id: 'npc.bo' } } } },
      allegiance: { power: null, house: 'Smithy', handler: 90817263 },
      relationships: [{ id: 'tie_npc_veiled_thieves_guild_1__npc_power_noble_families_1', from: 'npc_veiled_thieves_guild_1', to: 'npc_power_noble_families_1', npcId: 'npc_power_noble_families_1', targetId: 'npc.bo', npc1Id: 90817263, npc2Id: 'npc_gone_7' }] },
    { id: 'npc_power_noble_families_1', name: 'Lady Ash', role: 'Noble' },
    { id: 'npc.bo', name: 'Bo', role: 'Smith' },
    { id: 90817263, name: 'Numeral', role: 'Clerk' },
    { name: 'Nameless Ned', role: 'Porter' },
  ],
  relationships: [
    { id: 'tie_vex_ash', from: 'npc_veiled_thieves_guild_1', to: 'npc_power_noble_families_1', npc1Name: 'Vex Morrow', npc2Name: 'Lady Ash', typeName: 'rival', description: 'They loathe each other over the river tolls.' },
    { id: 'tie_num_bo', npc1Id: 90817263, npc2Id: 'npc.bo', npc1Name: 'Numeral', npc2Name: 'Bo', typeName: 'friend' },
  ],
  stress: { type: 'plague', cast: { roles: [{ id: 'npc.bo', kind: 'npc', name: 'Bo', role: 'healer' }], levers: [{ holderId: 90817263, holderName: 'Numeral' }] } },
  simulationTrace: [{ ts: 0, step: 'people', targetType: 'npc', targetId: 'npc_power_noble_families_1', downstreamEffects: [{ target: 'npc.bo', effect: 'owes a favour' }] }],
  factions: [{ name: 'Noble Families', power: 60, members: [{ id: 'npc_power_noble_families_1', name: 'Lady Ash', role: 'Noble' }] }],
  powerStructure: { factions: [{ faction: 'Noble Families', power: 60, members: [{ id: 90817263, name: 'Numeral', role: 'Clerk' }] }, { faction: 'Smiths', power: 40 }] },
  institutions: [{ id: 'inst_smithy', name: 'Smithy', category: 'crafts' }],
};
const PERSON_KEYS = { 'npc.bo': { revealDm: true }, 'npc.nameless_ned': { allowImport: false }, 90817263: { revealDm: false },
  npc_power_noble_families_1: { allowImport: false }, npc_gone_7: { revealDm: true } };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
const clone = (v) => JSON.parse(JSON.stringify(v));

/** The member key the page looks a person up by (publicSafe.js :: galleryMemberKey). */
const memberKey = (c) => (c.id != null && String(c.id) !== '' ? String(c.id) : `npc.${String(c.name || '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`);
const cardsOf = (d) => [...recs(d.npcs), ...recs(d.powerStructure?.factions).flatMap((f) => recs(f.members)), ...recs(d.factions).flatMap((f) => recs(f.members))];
const crises = (d) => ['stress', 'stressors'].flatMap((k) => (Array.isArray(d?.[k]) ? d[k] : [d?.[k]])).filter((c) => isRec(c) && isRec(c.cast));
const personIds = (d) => new Set([...cardsOf(d).map((c) => c.id), ...recs(d.relationships).map((t) => t.id), ...recs(d.npcs).flatMap((n) => recs(n.relationships).map((t) => t.id))].filter((x) => x != null).map(String));

function references(d) {
  const out = [];
  const push = (where, v) => { if (v !== undefined && v !== null) out.push([where, v]); };
  for (const t of recs(d.relationships)) for (const k of ['from', 'to', 'npc1Id', 'npc2Id']) push(`relationships[].${k}`, t[k]);
  for (const n of recs(d.npcs)) {
    for (const t of recs(n.relationships)) for (const k of ['from', 'to', 'npc1Id', 'npc2Id', 'targetId', 'npcId']) push(`npcs[].relationships[].${k}`, t[k]);
    push('npcs[].goal.intent.short.target.id', n.goal?.intent?.short?.target?.id);
    push('npcs[].goal.intent.long.target.id', n.goal?.intent?.long?.target?.id);
    push('npcs[].allegiance.handler', n.allegiance?.handler);
  }
  for (const c of crises(d)) { for (const r of recs(c.cast.roles)) push('cast.roles[].id', r.id); for (const l of recs(c.cast.levers)) push('cast.levers[].holderId', l.holderId); }
  for (const e of recs(d.simulationTrace)) { if (e.targetType === 'npc') push('simulationTrace[].targetId', e.targetId); for (const x of recs(e.downstreamEffects)) push('downstreamEffects[].target', x.target); }
  return out;
}

const client = new pg.Client({ host: process.env.PGHOST || '/var/tmp/rv7', user: process.env.PGUSER || 'postgres', database: db });
await client.connect();
await client.query("delete from public.settlements where public_slug like 'r4isql-smoke-%'");
const variants = [];
for (const [kind, ov] of [['marked', writeShareVeil(clone(PERSON_KEYS), OPEN.map((a) => ({ address: a, hidden: false })), AT)], ['unmarked', clone(PERSON_KEYS)]]) {
  for (const dm of [false, true]) variants.push({ kind, ov, dm });
}
let n = 0;
let bad = 0;
const lines = [];
for (const v of variants) {
  n += 1;
  const id = `4e1d5000-0000-0000-0000-${String(n).padStart(12, '0')}`;
  const slug = `r4isql-smoke-${n}`;
  await client.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
    values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, TOWN.name, TOWN.tier, JSON.stringify(TOWN), slug, `${slug}-link`, JSON.stringify(v.ov), v.dm]);
  const g = async () => (await client.query('select to_jsonb(g.data) d, g.gallery_member_overrides o from public.get_gallery_dossier($1) g', [slug])).rows[0];
  const l = async () => { const x = (await client.query('select public.get_unlisted_dossier($1) x', [`${slug}-link`])).rows[0]?.x; return x ? { d: x.dossier, o: x.gallery_member_overrides } : undefined; };
  for (const [read, fn] of [['gallery', g], ['link', l]]) {
    const r1 = await fn();
    const r2 = await fn();
    const f = [];
    if (!r1 || !isRec(r1.d)) { f.push('no document served'); }
    else {
      const ids1 = personIds(r1.d);
      const ids2 = personIds(r2.d);
      const shared = [...ids1].filter((x) => ids2.has(x));
      if (shared.length) f.push(`(1) the two reads share ${shared.length} person id(s): ${shared.join(', ')}`);
      if (ids1.size === 0) f.push('(1) no person id served at all');
      const leaks = storedIdsServed([r1.d, r1.o], TOWN);
      if (leaks.length) f.push(`(2) stored id served: ${leaks.join('; ')}`);
      const cardIds = new Set(cardsOf(r1.d).map((c) => c.id).filter((x) => x != null).map(String));
      const dangling = references(r1.d).filter(([, val]) => !cardIds.has(String(val)));
      // a dangling reference to a person NOT served is re-keyed (no form survives) and resolves to no card: counted apart
      const unresolved = dangling.filter(([, val]) => !(typeof val === 'string' && /^npc_[0-9a-f]{16}$/.test(val)));
      if (unresolved.length) f.push(`(3) reference not re-keyed and not a served card: ${unresolved.map(([w, x]) => `${w}=${x}`).join('; ')}`);
      const servedKeys = new Set(cardsOf(r1.d).map(memberKey));
      const markerKeys = Object.keys(isRec(r1.o) ? r1.o : {}).filter((k) => k !== '$veil');
      const loose = markerKeys.filter((k) => !servedKeys.has(k));
      if (loose.length) f.push(`(3) marker key names no served card: ${loose.join(', ')}`);
      // (4) item 6
      const bo = recs(r1.d.npcs).find((c) => c.name === 'Bo');
      if (!bo || !/^npc_[0-9a-f]{16}$/.test(String(bo.id))) f.push(`(4) Bo's card id not re-keyed: ${bo?.id}`);
      else if (!isRec(r1.o?.[bo.id]) || r1.o[bo.id].revealDm !== true) f.push(`(4) Bo's marker entry lost (key ${bo.id}): ${JSON.stringify(r1.o)}`);
      if (!isRec(r1.o?.['npc.nameless_ned']) || r1.o['npc.nameless_ned'].allowImport !== false) f.push('(4) the no-id card\'s name key npc.nameless_ned lost');
      if (isRec(r1.o) && Object.keys(r1.o).some((k) => k.startsWith('npc_gone'))) f.push('(4) a key naming no served person kept');
      lines.push(`${v.kind} dm=${v.dm} ${read}: cards ${cardIds.size}, person+tie ids ${ids1.size}, shared with the second read ${shared.length}, stored ids served ${leaks.length}, references ${references(r1.d).length} (dangling re-keyed ${dangling.length - unresolved.length}, unresolved ${unresolved.length}), marker person keys ${markerKeys.length} (unresolved ${loose.length}) ${f.length ? `RED: ${f.join(' | ')}` : 'GREEN'}`);
    }
    if (f.length) bad += 1;
    if (!r1) lines.push(`${v.kind} dm=${v.dm} ${read}: RED ${f.join(' | ')}`);
    if (n === 1 && read === 'gallery' && r1) lines.push(`  sample (marked dm=false gallery): npcs ids ${JSON.stringify(recs(r1.d.npcs).map((c) => c.id))}; marker ${JSON.stringify(r1.o)}; relationships ${JSON.stringify(recs(r1.d.relationships).map((t) => [t.id, t.from, t.to, t.npc1Id, t.npc2Id]))}`);
  }
}
await client.query("delete from public.settlements where public_slug like 'r4isql-smoke-%'");
await client.end();
console.log(lines.join('\n'));
console.log(bad ? `RED: ${bad} read(s) with findings` : `GREEN: ${variants.length * 2} reads, every check`);
process.exit(bad ? 1 : 0);
