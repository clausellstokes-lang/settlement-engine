/**
 * P4.b — the member MIRROR under ruling 1. A role edit moves `npcs[i].role`; does
 * `factions[].members[].role` follow? Ruling 1 makes `factions` a held key, so
 * `relinkFactionMembers` (one of its writers) is skipped. Measured both ways, on three tiers,
 * for the role edit AND for a status-shaped edit (`npcs[i].title`).
 *
 * usage: node --import ./hook3.mjs p4b-mirror.mjs
 */
import { h, clone, keyOf, sample63 } from './lib.mjs';
import { tryRederive, generate, heldOf } from './seam.mjs';

const ROWS = ['village', 'town', 'city'].map(t => sample63().find(r => r.settType === t));
const mirrorOf = (rec, id, field) => (rec.factions || []).flatMap(f => (f.members || []).filter(m => m.id === id).map(m => m[field]));

for (const row of ROWS) {
  const rec = generate(row);
  const held0 = heldOf(rec);
  // pick an npc that IS a faction member, so the mirror exists
  const memberIds = new Set((rec.factions || []).flatMap(f => (f.members || []).map(m => m.id)));
  const idx = (rec.npcs || []).findIndex(n => memberIds.has(n.id));
  if (idx < 0) { console.log(`${keyOf(row)}: no npc is a faction member — skipped`); continue; }
  const id = rec.npcs[idx].id;
  console.log(`\n=== ${keyOf(row)} — npcs[${idx}] "${rec.npcs[idx].name}" (id=${id}) is a member of ${(rec.factions || []).filter(f => (f.members || []).some(m => m.id === id)).length} faction group(s) ===`);
  for (const [field, value] of [['role', 'Harbourmaster'], ['title', 'The Drowned Hand']]) {
    console.log(`  edit npcs[${idx}].${field} = "${value}"   (record says ${field}="${rec.npcs[idx][field]}", mirror says ${JSON.stringify(mirrorOf(rec, id, field))})`);
    for (const [label, opts] of [['relink=false (ruling 1 literal: factions is FINAL)', { nameMode: 'consume', relink: false }],
      ['relink=true  (the mirror follows the held roster)', { nameMode: 'consume', relink: true }]]) {
      const H = clone(held0);
      H.npcs[idx][field] = value;
      const rr = tryRederive(row, H, opts);
      if (rr.err) { console.log(`      ${label}: THREW ${rr.err.slice(0, 70)}`); continue; }
      const out = rr.out;
      console.log(`      ${label}: npcs[${idx}].${field}="${out.npcs?.[idx]?.[field]}"  mirror=${JSON.stringify(mirrorOf(out, id, field))}  ${JSON.stringify(mirrorOf(out, id, field)) === JSON.stringify([value]) ? 'MIRROR FOLLOWS' : '⛔ MIRROR STALE'}`);
    }
  }
  // and: does relink=true change anything when NOTHING is edited? (the no-edit control)
  const a = tryRederive(row, held0, { nameMode: 'consume', relink: false });
  const b = tryRederive(row, held0, { nameMode: 'consume', relink: true });
  console.log(`  no-edit control: relink=false ≡ relink=true ? ${!a.err && !b.err && h(a.out) === h(b.out)}`);
}
