// CENSUS-4 phase B: the stress secrets (STRESS_INSTITUTION_EFFECTS) declare what they presume, the
// secret draw goes through drawDeclared (one roll over the full pool, resolved after), and no
// drawn secret's declaration is false on the final record (cert:false-presumption).
import { describe, it, expect, beforeAll } from 'vitest';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { declarationOf, declares, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { presumptionFindings } from '../../src/domain/facts/presumptionCheck.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const POOL = 'stressInstitutionEffects:STRESS_INSTITUTION_EFFECTS';

describe('the stress secrets declare', () => {
  // MERGE-R2 (2026-11-07, the chair's ruling 1, re-keyed with its cause): 33 -> 34 — the mass-migration
  // slot F13 retold as the arrival is a DIRECTION PAIR at the integration merge: F13's arrivals line
  // (`migration: influx`) and WIRING-W0's departures line (`migration: exodus`, R-W7 e), both declared.
  // R2-CODE-A-2 (the cold list REVIEW-W2A-3, MEDIUM #723; re-keyed with its cause): 34 -> 35 — the wartime war-contracts
  // secret ("…the war contracts that made the settlement rich") declares `prosperity: ≥ comfortable`.
  // R2-CODE-A-7 (step 1 item 5; re-keyed with its cause): 35 -> 36 — the plague quarantine secret ("…shipments from a specific
  // merchant…") declares `market`.
  // BAR3-CLOSE-SWEEP-B (2026-11-16, letter g; re-keyed with its cause, BAR3-PLACES H1, b7bf413a7): 36 -> 38 — the famine
  // secret's covert route ("…{food} shipments through a covert route…") declares `excludes: crisis: under_siege`, and its
  // siege twin ("Laid in a cellar of {food} before the siege closed the roads…", `twinOf`) declares `crisis: under_siege`.
  // BAR5-THINGS (2026-11-16, LAW 4 "the weeks"; re-keyed with its cause): 38 -> 39 — the siege secret "… to someone in the besieging
  // camp in the first days of the siege" (no count of weeks) declares `crisis: under_siege`, the camp it names.
  it('39 entries declare (32 + the exodus twin, answer 5, + the direction pair\'s departures line, MERGE-R2, + the war-contracts secret, R2-CODE-A-2, + the quarantine merchant, R2-CODE-A-7, + the covert route and its siege twin, BAR3-PLACES H1), every atom in the vocabulary', () => {
    const entries = Object.values(STRESS_INSTITUTION_EFFECTS).flat();
    const declaring = entries.filter((e) => declares(declarationOf(e)));
    expect(declaring).toHaveLength(39);
    expect(declaring.find((e) => /besieging camp in the first days of the siege/.test(e.secret))?.needs).toEqual(['crisis: under_siege']);
    expect(declaring.find((e) => /shipments from a specific merchant/.test(e.secret))?.needs).toEqual(['market']);
    expect(declaring.some((e) => /war contracts that made the settlement rich/.test(e.secret))).toBe(true);
    expect(declaring.find((e) => /^Laid in a cellar of \{food\} before the siege/.test(e.secret))?.needs).toEqual(['crisis: under_siege']);
    expect(declaring.find((e) => /through a covert route/.test(e.secret))?.excludes).toEqual(['crisis: under_siege']);
    for (const e of declaring) for (const a of [...(e.needs || []), ...(e.excludes || [])]) expect(parseAtom(a), a).not.toBeNull();
  });
  it('a {npc} slot declares the other NPC', () => {
    for (const e of Object.values(STRESS_INSTITUTION_EFFECTS).flat()) {
      if (/\{npc\}/.test(`${e.secret} ${e.stakes}`)) expect(e.needs || [], e.secret).toContain('other npc');
    }
  });
});

describe('the secret draw is declared and its presumptions hold at birth', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('soak1k-0..23: the pool is drawn through the ledger, and nothing drawn is false on the final record', () => {
    let drawn = 0; const fails = [];
    for (let i = 0; i < 24; i += 1) {
      const ledger = [];
      const { result } = withPresumptionLedger(() => birth(i), ledger);
      const mine = ledger.filter((e) => e.pool === POOL);
      drawn += mine.length;
      for (const f of presumptionFindings(result.settlement, mine)) fails.push(`soak1k-${i}: ${f.lineId} ${f.atom}`);
    }
    expect(drawn).toBeGreaterThan(0);
    expect(fails).toEqual([]);
  }, 180000);
});
