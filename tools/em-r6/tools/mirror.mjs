/**
 * mirror.mjs — EM-R6: the MEMBER MIRROR, measured correctly.
 * `factions[].members[]` is a SUBSET of `npcs[]` (only faction members), so the
 * comparison must be PER PERSON, joined by the NPC's own id, over the people who
 * appear at BOTH homes — and on a RELOADED record, where the alias is broken.
 */
import { writeFileSync } from 'node:fs';
import { runHeadless, instrumentedRoot } from './instrument.mjs';
import { keyOf, sample63 } from './lib.mjs';

const OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R6-scratch';
const NEW_NAME = 'ZZ Verdant Circle QQ';
const MIRRORED_KEYS = ['institution', 'corruptTies.thievesGuild', 'corruptTies.criminalInstitution', 'linkedInstitutionIds'];
const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const reload = (v) => JSON.parse(JSON.stringify(v));
const isSame = (v, o) => typeof v === 'string' && v.trim() === o;

/** the cascade's two-home walk, and a one-home walk for the control */
function renameNpcRecordOneHome(npc, old, nu) {
  if (!npc || typeof npc !== 'object') return;
  if (isSame(npc.institution, old)) npc.institution = nu;
  const ct = npc.corruptTies;
  if (ct && typeof ct === 'object') {
    if (isSame(ct.thievesGuild, old)) ct.thievesGuild = nu;
    if (isSame(ct.criminalInstitution, old)) ct.criminalInstitution = nu;
  }
  if (Array.isArray(npc.linkedInstitutionIds)) {
    for (let i = 0; i < npc.linkedInstitutionIds.length; i += 1) {
      if (isSame(npc.linkedInstitutionIds[i], old)) npc.linkedInstitutionIds[i] = nu;
    }
  }
}

const agg = {
  rows: 0, aliasedAtGeneration: 0, notAliased: 0,
  pairedPeople: 0, disagreeBeforeEdit: 0,
  memberOnlyPeople: 0, npcOnlyPeople: 0,
  oneHome: { rowsWithDisagreement: 0, disagreeingPeople: 0, disagreeingFields: new Map() },
  twoHome: { rowsWithDisagreement: 0, disagreeingPeople: 0 },
  memberHasInstitutionKey: 0, npcHasInstitutionKey: 0,
};
const bump = (m, k, n = 1) => m.set(k, (m.get(k) || 0) + n);

for (const row of sample63()) {
  const seed = row._seed ?? keyOf(row);
  const { root } = instrumentedRoot(seed);
  let out; try { out = await runHeadless(row, root); } catch { continue; }
  const live = out?.settlement ?? out; if (!live) continue;
  agg.rows += 1;

  // Is the member the SAME OBJECT as the npc, in memory, at generation?
  const liveMembers = (live.factions || []).flatMap(g => g?.members || []);
  const liveNpcs = live.npcs || [];
  let aliased = false;
  for (const m of liveMembers) { if (liveNpcs.includes(m)) { aliased = true; break; } }
  if (aliased) agg.aliasedAtGeneration += 1; else agg.notAliased += 1;

  const saved = reload(live);
  const npcById = new Map((saved.npcs || []).filter(n => n?.id).map(n => [n.id, n]));
  const members = (saved.factions || []).flatMap(g => g?.members || []).filter(m => m?.id);
  const memberIds = new Set(members.map(m => m.id));
  agg.memberOnlyPeople += members.filter(m => !npcById.has(m.id)).length;
  agg.npcOnlyPeople += [...npcById.keys()].filter(id => !memberIds.has(id)).length;

  // baseline agreement, per person, per mirrored key
  for (const m of members) {
    const n = npcById.get(m.id); if (!n) continue;
    agg.pairedPeople += 1;
    if ('institution' in m) agg.memberHasInstitutionKey += 1;
    if ('institution' in n) agg.npcHasInstitutionKey += 1;
    for (const k of MIRRORED_KEYS) {
      if (JSON.stringify(get(m, k)) !== JSON.stringify(get(n, k))) { agg.disagreeBeforeEdit += 1; break; }
    }
  }

  // pick an institution that is actually posted on someone
  const posted = [...new Set((saved.npcs || []).map(n => n?.institution).filter(v => typeof v === 'string' && v))];
  if (!posted.length) continue;
  const target = posted[0];

  // CONTROL — one-home walk only
  {
    const s = reload(saved);
    for (const n of s.npcs || []) renameNpcRecordOneHome(n, target, NEW_NAME);
    const byId = new Map((s.npcs || []).filter(n => n?.id).map(n => [n.id, n]));
    let bad = 0;
    for (const g of s.factions || []) for (const m of g?.members || []) {
      const n = m?.id ? byId.get(m.id) : null; if (!n) continue;
      for (const k of MIRRORED_KEYS) {
        if (JSON.stringify(get(m, k)) !== JSON.stringify(get(n, k))) { bad += 1; bump(agg.oneHome.disagreeingFields, k); break; }
      }
    }
    if (bad) { agg.oneHome.rowsWithDisagreement += 1; agg.oneHome.disagreeingPeople += bad; }
  }
  // THE CASCADE — both homes
  {
    const s = reload(saved);
    for (const n of s.npcs || []) renameNpcRecordOneHome(n, target, NEW_NAME);
    for (const g of s.factions || []) for (const m of g?.members || []) renameNpcRecordOneHome(m, target, NEW_NAME);
    const byId = new Map((s.npcs || []).filter(n => n?.id).map(n => [n.id, n]));
    let bad = 0;
    for (const g of s.factions || []) for (const m of g?.members || []) {
      const n = m?.id ? byId.get(m.id) : null; if (!n) continue;
      for (const k of MIRRORED_KEYS) {
        if (JSON.stringify(get(m, k)) !== JSON.stringify(get(n, k))) { bad += 1; break; }
      }
    }
    if (bad) { agg.twoHome.rowsWithDisagreement += 1; agg.twoHome.disagreeingPeople += bad; }
  }
}

const result = { ...agg, oneHome: { ...agg.oneHome, disagreeingFields: Object.fromEntries(agg.oneHome.disagreeingFields) } };
writeFileSync(`${OUT}/mirror-63.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
