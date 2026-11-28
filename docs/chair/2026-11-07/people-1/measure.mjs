// PEOPLE-1 CAST measurement (2026-11-07): PEOPLE-0's instrument (../people-0/measure.mjs, untouched)
// adapted to the new card shape — `institution`, `title`, `memberships`. Measure-only: births
// settlements, writes one JSON line each.
//   node docs/chair/2026-11-07/people-1/measure.mjs soak <out.jsonl> [from] [to]
//   node docs/chair/2026-11-07/people-1/measure.mjs golden <out.jsonl>
// Per settlement: the cards (house faces, the minted seat, the `other` mints), per power its
// faces and its ranked three, whether the governing power is faced (a rank-1 member), the mint
// titles that fired and whether the fallback ("the head of …") fired, the pool-map fallbacks.
import { appendFileSync, writeFileSync } from 'node:fs';
import { generateSettlementPipeline } from '../../../../src/generators/generateSettlementPipeline.js';
import { backingArchetypeOf } from '../../../../src/domain/dossier/powerSupport.js';
import { governingFactionOf, nameOf } from '../../../../src/domain/rulingPower.js';
import { familyOfInstitution } from '../../../../src/data/institutionalCatalog.js';
import { seatMintTitleFor, otherMintRowFor } from '../../../../src/generators/people/mintTitles.js';
import { poolFor, seatPoolFor } from '../../../../src/generators/people/poolMap.js';
import { SEAT_CARD_ID } from '../../../../src/generators/people/representatives.js';

export function measure(s, label) {
  const cards = (s.npcs || []).filter((n) => n && n.institution);
  const houseByName = new Map((s.institutions || []).map((i) => [String(i?.name || ''), i]));
  const governing = nameOf(governingFactionOf(s)) || null;
  const powers = (s.powerStructure?.factions || []).map((f) => {
    const name = nameOf(f);
    const members = cards.filter((c) => c.memberships.some((m) => m.power === name));
    return { name, arch: backingArchetypeOf(f), gov: name === governing, faces: members.length,
      ranked: members.filter((c) => c.memberships.some((m) => m.power === name && m.rank)).length,
      first: members.find((c) => c.memberships.some((m) => m.power === name && m.rank === 1))?.title || null };
  });
  const mints = cards.filter((c) => c.institution.kind === 'power').map((c) => {
    const seat = c.id === SEAT_CARD_ID;
    const t = seat ? seatMintTitleFor(c.institution.key) : otherMintRowFor(c.institution.key);
    return { kind: seat ? 'seat' : 'other', power: c.institution.key, title: c.title, fallback: t.fallback };
  });
  const fallbacks = cards.filter((c) => c.institution.kind === 'house').map((c) => {
    const house = houseByName.get(c.institution.key); const fam = familyOfInstitution(house);
    const seatRole = c.role === seatPoolFor(s.tier).role && c.category === 'government';
    const pool = seatRole ? seatPoolFor(s.tier) : poolFor(c.title, fam?.shelf);
    return pool.fallback ? c.title : null;
  }).filter(Boolean);
  const cat = {}; for (const c of cards) cat[c.category] = (cat[c.category] || 0) + 1;
  return { label, tier: s.tier, houses: (s.institutions || []).length, cards: cards.length,
    houseFaces: cards.filter((c) => c.institution.kind === 'house').length,
    mints, powers, govFaced: powers.some((p) => p.gov && p.first !== null), govName: governing,
    fallbacks, cat, multiPower: cards.filter((c) => c.memberships.length > 1).length,
    noPower: cards.filter((c) => c.memberships.length === 0).length,
    npcs: (s.npcs || []).length, rels: (s.relationships || []).length, groups: (s.factions || []).length };
}

const [mode, out, from = '0', to = '1000'] = process.argv.slice(2);
if (mode) {
  writeFileSync(out, '');
  if (mode === 'golden') {
    const { goldenCorpus, keyOf } = await import('../../../../tests/helpers/goldenMasterCorpus.js');
    for (const cfg of goldenCorpus()) {
      const { _seed, ...rest } = cfg;
      appendFileSync(out, JSON.stringify(measure(generateSettlementPipeline(rest, null, { seed: _seed, customContent: {} }), keyOf(cfg))) + '\n');
    }
  } else {
    const { birth, ensureLaws } = await import('../../../../scripts/audit/soak-review/corpus.mjs');
    await ensureLaws();
    for (let i = Number(from); i < Number(to); i += 1) appendFileSync(out, JSON.stringify(measure(birth(i).settlement, `soak1k-${i}`)) + '\n');
  }
}
