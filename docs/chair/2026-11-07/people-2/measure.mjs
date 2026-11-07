// PEOPLE-2 CAST-DERIVED measurement (2026-11-07): the crisis cast, the levers, the seat row and
// the Tonight sheet, per settlement, one JSON line each. Measure-only (births settlements).
//   node docs/chair/2026-11-07/people-2/measure.mjs soak <out.jsonl> [from] [to]
//   node docs/chair/2026-11-07/people-2/measure.mjs golden <out.jsonl>
// Run at the lane's base and at its tip; aggregate.mjs compares the two (cast roles filled,
// lever holders that are faces, Tonight lines moved by name / title / other).
import { appendFileSync, writeFileSync } from 'node:fs';
import { generateSettlementPipeline } from '../../../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet } from '../../../../src/domain/summary/tonightSheet.js';
import { seatCandidatesOf } from '../../../../src/domain/dossier/seatHolder.js';

/** Flatten a value into `path = leaf` lines (the sheet's bytes, line by line). */
function lines(v, path = '', out = []) {
  if (v === null || v === undefined || typeof v !== 'object') { out.push(`${path} = ${JSON.stringify(v ?? null)}`); return out; }
  if (Array.isArray(v)) { out.push(`${path}.length = ${v.length}`); v.forEach((x, i) => lines(x, `${path}[${i}]`, out)); return out; }
  for (const k of Object.keys(v).sort()) lines(v[k], path ? `${path}.${k}` : k, out);
  return out;
}

export function measure(s, label) {
  const npcs = Array.isArray(s.npcs) ? s.npcs : [];
  const byId = new Map(npcs.map((n) => [String(n.id || n.name), n]));
  const stresses = (Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : [])).filter((e) => e && e.cast);
  const casts = stresses.map((e) => ({
    kind: e.type,
    nature: e.cast.nature,
    roles: e.cast.roles.map((r) => {
      const n = r.kind === 'npc' ? byId.get(r.id) : null;
      return { role: r.role, kind: r.kind, id: r.id, name: r.name, onRoster: r.kind === 'npc' ? !!n : null,
        face: !!(n && n.institution), temporary: !!r.temporary, reason: r.reason };
    }),
    absent: e.cast.absent.map((a) => a.role),
    levers: e.cast.levers.map((l) => {
      const holder = l.holderId ? byId.get(l.holderId) : null;
      const face = npcs.find((n) => n?.institution?.kind === 'house' && n.institution.key === l.institution) || null;
      return { institution: l.institution, holderId: l.holderId, holderIsFace: !!(holder && face && holder === face), houseHasFace: !!face };
    }),
  }));
  const seat = seatCandidatesOf(s)[0] || null;
  return {
    label, tier: s.tier, npcs: npcs.length,
    names: npcs.map((n) => String(n.name || '')).filter(Boolean),
    titles: [...new Set(npcs.flatMap((n) => [n.title, n.role]).filter(Boolean).map(String))],
    powers: (s.powerStructure?.factions || []).map((f) => String(f?.faction || f?.name || '')).filter(Boolean),
    casts,
    seat: seat ? { id: seat.id || seat.name, name: seat.name, rank1: (seat.memberships || []).some((m) => m.rank === 1) } : null,
    tonight: lines(composeTonightSheet(s)),
  };
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
