/**
 * tests/generators/people/castDerived.test.js — THE CAST RE-DERIVED FROM THE POWERS' PEOPLE (the
 * people car, PEOPLE-2 CAST-DERIVED, 2026-11-07; brief
 * docs/chair/2026-11-07/BRIEF-PEOPLE-2-CAST-DERIVED-2026-11-07.md §1).
 *
 * Over the golden 525 and the soak 1,000's first 300 (825 born settlements):
 *   step 1 — every cast role that names a person names a card on the roster; a person drawn from a
 *            power holds a membership in a power that stands in that relation to the crisis; the
 *            lever's holder is the lever house's face wherever the house has one, and nobody else;
 *            the cast's self-check (crisisCastFindings) finds nothing;
 *   step 2 — the seat row is the governing power's rank-1 face on every settlement (a claimant
 *            vacancy reads its absence once).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../../helpers/goldenMasterCorpus.js';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';
import { CAST_REASONS } from '../../../src/domain/crisis/crisisCast.js';
import { crisisCastFindings } from '../../../src/domain/coherence/crisisCastFindings.js';
import { seatCandidatesOf } from '../../../src/domain/dossier/seatHolder.js';
import { rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { factionArchetype, FACTION_ARCHETYPES as A } from '../../../src/domain/factionArchetypes.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';

/** @type {Array<{ label: string, s: any }>} */
const corpus = [];

beforeAll(async () => {
  await ensureLaws();
  for (const cfg of goldenCorpus()) {
    const { _seed, ...rest } = cfg;
    corpus.push({ label: keyOf(cfg), s: generateSettlementPipeline(rest, null, { seed: _seed, customContent: {} }) });
  }
  for (let i = 0; i < 300; i += 1) corpus.push({ label: `soak1k-${i}`, s: birth(i).settlement });
}, 300_000); // measured: ~49 s for the 825 births on one core

const stressesOf = (s) => (Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : [])).filter((e) => e && e.cast);
const powersOf = (s) => s.powerStructure?.factions || [];
const startsWithAny = (reason, list) => list.some((r) => reason === r || reason.startsWith(`${r}; `));

/**
 * The relation a power-drawn row's person must hold, by the row's reason: a predicate over the
 * power (its name, its record, its stake in the crisis), or null for a row not drawn from a power.
 */
function relationFor(row) {
  const r = row.reason;
  const stake = (want) => (p, f, k) => want.includes(k);
  if (startsWithAny(r, [CAST_REASONS.bruntLeast, ...Object.values(CAST_REASONS.bruntBase)])) return stake(['loses', 'split', undefined]);
  if (startsWithAny(r, [CAST_REASONS.instigatorGains, CAST_REASONS.exploiterTrait, CAST_REASONS.exploiterPower, CAST_REASONS.collaboratorAmbition])) return stake(['gains']);
  if (startsWithAny(r, [CAST_REASONS.waverer])) return stake(['split']);
  if (startsWithAny(r, [CAST_REASONS.defenderMilitary])) return (p, f) => factionArchetype(f) === A.MILITARY;
  if (startsWithAny(r, [CAST_REASONS.treaterMerchant])) return (p, f) => factionArchetype(f) === A.MERCHANT;
  if (startsWithAny(r, [CAST_REASONS.instigatorRival, CAST_REASONS.instigatorLinked, CAST_REASONS.face])) return () => true;
  return null;
}

describe('step 1 — the crisis cast reads memberships (825 born settlements)', () => {
  it('every person a cast names is on the roster; a power-drawn person holds a membership in a power of that relation', () => {
    const misses = [];
    let people = 0;
    let drawn = 0;
    for (const { label, s } of corpus) {
      const byId = new Map((s.npcs || []).map((n) => [String(n.id || n.name), n]));
      const facs = new Map(powersOf(s).map((f) => [nameOf(f), f]));
      for (const e of stressesOf(s)) {
        const stakeOf = new Map(e.cast.stakes.map((k) => [k.factionId, k.stake]));
        for (const row of e.cast.roles) {
          if (row.kind !== 'npc') continue;
          people += 1;
          const n = byId.get(row.id);
          if (!n) { misses.push(`${label} ${e.type} ${row.role}: ${row.id} not on the roster`); continue; }
          if (!n.temporary && !n.institution) misses.push(`${label} ${e.type} ${row.role}: ${row.id} is no face`);
          const rel = relationFor(row);
          if (!rel) continue;
          drawn += 1;
          const ok = (n.memberships || []).some((m) => facs.has(m.power) && rel(m.power, facs.get(m.power), stakeOf.get(m.power)));
          if (!ok) misses.push(`${label} ${e.type} ${row.role} (${row.reason}): ${row.id} holds no membership of that relation`);
        }
      }
    }
    expect(misses.slice(0, 20)).toEqual([]);
    expect(people, 'the corpus casts people (measured 957)').toBeGreaterThan(900);
    expect(drawn, 'the corpus draws people from powers').toBeGreaterThan(500);
  });

  it('the lever\'s holder is the lever house\'s face wherever the house has one, and no one where it has none', () => {
    const misses = [];
    let faced = 0;
    let bare = 0;
    for (const { label, s } of corpus) {
      const faceOf = (house) => (s.npcs || []).find((n) => n?.institution?.kind === 'house' && n.institution.key === house && !n.temporary && !n.ousted) || null;
      for (const e of stressesOf(s)) {
        for (const l of e.cast.levers) {
          const face = faceOf(l.institution);
          if (face) { faced += 1; if (l.holderId !== face.id) misses.push(`${label} ${e.type} ${l.institution}: held by ${l.holderId}, face ${face.id}`); }
          else { bare += 1; if (l.holderId !== null) misses.push(`${label} ${e.type} ${l.institution}: no face, held by ${l.holderId}`); }
        }
        const lever = e.cast.roles.find((r) => r.role === 'lever' && r.kind === 'npc' && !r.temporary);
        if (lever && !e.cast.levers.some((l) => l.holderId === lever.id)) misses.push(`${label} ${e.type}: lever ${lever.id} holds no lever house`);
      }
    }
    expect(misses.slice(0, 20)).toEqual([]);
    expect(faced, 'lever houses with a face').toBeGreaterThan(100);
    expect(bare, 'lever houses with no face (a market, a fabric row)').toBeGreaterThan(0);
  });

  it('the cast\'s self-check finds nothing', () => {
    const found = corpus.flatMap(({ label, s }) => crisisCastFindings(s).map((f) => `${label} ${f.code} ${f.crisis}: ${f.detail}`));
    expect(found.slice(0, 20)).toEqual([]);
  });
});

describe('step 2 — the seat row is the governing power\'s rank-1 face (825 born settlements)', () => {
  it('every settlement seats its governing power\'s rank-1 face, or reads its claimant vacancy', () => {
    const misses = [];
    let seated = 0;
    for (const { label, s } of corpus) {
      const gov = nameOf(governingFactionOf(s));
      const first = seatCandidatesOf(s)[0] || null;
      const r1 = (s.npcs || []).filter((n) => (n.memberships || []).some((m) => m.power === gov && m.rank === 1));
      if (r1.length !== 1) { misses.push(`${label}: ${r1.length} rank-1 faces of ${gov}`); continue; }
      if (first !== r1[0]) { misses.push(`${label}: the seat row is ${first?.id ?? 'none'}, rank 1 is ${r1[0].id}`); continue; }
      const chain = rulingChainOf(s);
      if (chain.absence?.kind === 'missing_seat') continue;
      if (chain.npc?.name !== r1[0].name) misses.push(`${label}: the chain seats ${chain.npc?.name ?? 'none'}`);
      else seated += 1;
    }
    expect(misses.slice(0, 20)).toEqual([]);
    expect(seated).toBeGreaterThan(780);
  });
});
