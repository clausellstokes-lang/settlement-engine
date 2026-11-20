// CENSUS-4 R12 (faction-role-fit): no generated faction seats a member whose role does not fit its kind.
//
// MERGE-CAR (2026-11-07, the chair's SC-1 ruling): the GENERATOR half — `fitFactionRoster`, which re-homed a misfit by
// rewriting `factionAffiliation` — is RETIRED, superseded by construction: one face per face-bearing institution, a
// representative's role is its institution's title (M-1b), its memberships born by rank from the institution's power
// (people/castPowers.js), so there is no affiliation to fit. Its tests left with it. The READER (readerBattery.js ::
// factionRoleFitFindings) is PORTED to the memberships (the card's first-rank power is its affiliation) and stays: it
// judges a held or edited role against its power's kind, which no people suite pins. On the car's births it judges
// almost nothing — a face's role is its house's title, which the role-class map leaves `other` (measured at the merged
// tree: 1 of 1,446 cards over soak1k-0..49 classed) — so the births property below holds at zero findings.
import { describe, it, expect, beforeAll } from 'vitest';
import { factionRoleFitFindings } from '../../src/domain/coherence/readerBattery.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

describe('no birth seats a misfit (reader:faction-role-fit, on the memberships)', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('holds on soak1k-0..11: the ported reader finds no faction seating a first-rank member whose role does not fit', () => {
    const rows = [];
    let cards = 0;
    for (let i = 0; i < 12; i += 1) {
      const { seed, settlement: s } = birth(i);
      cards += (s.npcs || []).length;
      for (const f of factionRoleFitFindings(s, {})) rows.push(`${seed}: ${f.quote} keeps ${f.detail}`);
    }
    expect(cards, 'liveness: the corpus carried cards').toBeGreaterThan(300);
    expect(rows).toEqual([]);
  }, 120000);
});
