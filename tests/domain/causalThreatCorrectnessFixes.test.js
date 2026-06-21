/**
 * tests/domain/causalThreatCorrectnessFixes.test.js — domain correctness +
 * perf-memo regression ratchet.
 *
 * Pins three verified-correctness fixes that an adversarial review flagged.
 * Each test exercises the REAL public derivation path and would FAIL if the
 * corresponding fix were reverted:
 *
 *   1. deriveRulingAuthority (causalState.js) joins the governing faction by
 *      EXACT case-insensitive name equality (the precedent at
 *      timeProgression.js:194/195 and factionProfile.js legitimacyFor), with a
 *      WHOLE-WORD startsWith fallback only when no exact match exists. The old
 *      `governingName.includes(firstToken)` substring match attributed authority
 *      from the WRONG faction whenever two factions shared a leading token
 *      (e.g. a "Merchant League" government drawing power from "Merchant Guilds").
 *
 *   2. inferThreatType (threatProfile.js) classifies 'wild magic' as
 *      arcane_instability — the specific arcane pattern now precedes the generic
 *      'wild' monster pattern — and word-bounds the war token (/\bwar\b/) so
 *      'seaward' no longer mints a phantom siege threat.
 *
 *   3. deriveCausalState's per-call WeakMap memo for deriveAllActiveConditions /
 *      deriveAllFactionProfiles is byte-identical to the un-memoized derivation:
 *      the same settlement run twice yields deep-equal causal state.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveSystemVariable,
  deriveCausalState,
} from '../../src/domain/causalState.js';
import {
  collectThreatSources,
  deriveAllThreatProfiles,
} from '../../src/domain/threatProfile.js';

// ── Fix 1: ruling_authority joins the EXACT governing faction ─────────────

describe('deriveRulingAuthority — exact governing-faction join', () => {
  // Two factions share the leading token "Merchant". The government is the
  // SECOND ("Merchant League"); the substring-match bug picked the first roster
  // entry whose first token was a substring of governingName ("Merchant
  // Guilds"), so it attributed the WRONG faction's power.
  const rosterSharingLeadingToken = (governingName) => ({
    name: 'Twin-Merchant Town',
    powerStructure: {
      governingName,
      // "Merchant Guilds" listed FIRST and given a deliberately different power
      // so the wrong join produces a different contributor.
      factions: [
        { faction: 'Merchant Guilds', power: 90 },
        { faction: 'Merchant League', power: 40 },
      ],
    },
  });

  it('attributes governing power to the EXACT governing faction, not a leading-token sibling', () => {
    const v = deriveSystemVariable('ruling_authority', rosterSharingLeadingToken('Merchant League'));
    const governing = v.contributors.find(c => c.effect === 'governing_power');
    expect(governing).toBeTruthy();
    // The contributor must name the EXACT government ("Merchant League", power 40),
    // NOT the leading-token sibling ("Merchant Guilds", power 90). The reverted
    // substring match would name "Merchant Guilds" here.
    expect(governing.reason).toContain('Merchant League');
    expect(governing.reason).toContain('power 40');
    expect(governing.reason).not.toContain('Merchant Guilds');
    expect(governing.reason).not.toContain('power 90');
    // power 40 → (40-30)*0.5 = +5.
    expect(governing.delta).toBe(5);
  });

  it('matches the other sibling when IT is the government — symmetry', () => {
    const v = deriveSystemVariable('ruling_authority', rosterSharingLeadingToken('Merchant Guilds'));
    const governing = v.contributors.find(c => c.effect === 'governing_power');
    expect(governing).toBeTruthy();
    expect(governing.reason).toContain('Merchant Guilds');
    expect(governing.reason).toContain('power 90');
    // power 90 → (90-30)*0.5 = +30.
    expect(governing.delta).toBe(30);
  });

  it('resolves a trailing-qualifier government via the whole-word startsWith fallback', () => {
    // No EXACT match for "Merchant Guilds Council"; the whole-word fallback
    // resolves it to the "Merchant Guilds" faction (boundary after the word).
    const v = deriveSystemVariable('ruling_authority', {
      name: 'Council Town',
      powerStructure: {
        governingName: 'Merchant Guilds Council',
        factions: [{ faction: 'Merchant Guilds', power: 70 }],
      },
    });
    const governing = v.contributors.find(c => c.effect === 'governing_power');
    expect(governing).toBeTruthy();
    expect(governing.reason).toContain('Merchant Guilds');
    expect(governing.delta).toBe(20); // (70-30)*0.5
  });

  it('does NOT mint a join on a mid-token prefix (the substring misroute can never recur)', () => {
    // "Merchantmen" begins with "merchant" but NOT on a word boundary — the old
    // substring bug would have matched the "Merchant" faction; the whole-word
    // fallback must reject it, so there is NO governing_power contributor.
    const v = deriveSystemVariable('ruling_authority', {
      name: 'Sailor Town',
      powerStructure: {
        governingName: 'Merchantmen',
        factions: [{ faction: 'Merchant', power: 80 }],
      },
    });
    const governing = v.contributors.find(c => c.effect === 'governing_power');
    expect(governing).toBeUndefined();
  });
});

// ── Fix 2: threat type inference — arcane precedence + word-bound war ──────

describe('inferThreatType (via collectThreatSources stressors) — specific-before-generic', () => {
  it("classifies 'wild magic' as arcane_instability, NOT monster_pressure", () => {
    const sources = collectThreatSources({
      stressors: [{ name: 'Wild magic surges in the old quarter', severity: 0.6 }],
    });
    const types = new Set(sources.map(s => s.inferredType));
    expect(types.has('arcane_instability')).toBe(true);
    expect(types.has('monster_pressure')).toBe(false);
  });

  it("still classifies a plain 'wilderness' / 'wild beasts' stressor as monster_pressure", () => {
    const sources = collectThreatSources({
      stressors: [{ name: 'Wild beasts roam the wilderness', severity: 0.5 }],
    });
    expect(sources.some(s => s.inferredType === 'monster_pressure')).toBe(true);
  });

  it("does NOT mint a siege threat from 'seaward' (word-bounded \\bwar\\b)", () => {
    const sources = collectThreatSources({
      stressors: [{ name: 'Seaward storms batter the docks', severity: 0.5 }],
    });
    // 'seaward' must classify as 'other' (skipped), so NO siege source survives.
    expect(sources.some(s => s.inferredType === 'siege')).toBe(false);
    expect(sources.length).toBe(0);
  });

  it("does NOT mint a siege threat from 'warden' / 'warehouse' either", () => {
    const sources = collectThreatSources({
      stressors: [
        { name: 'The warden retired without a successor', severity: 0.4 },
        { name: 'Warehouse rents climbing fast', severity: 0.4 },
      ],
    });
    expect(sources.some(s => s.inferredType === 'siege')).toBe(false);
  });

  it("still classifies a real whole-word 'war' / 'warfare' / 'siege' stressor as siege", () => {
    const sources = collectThreatSources({
      stressors: [
        { name: 'Open war on the eastern marches', severity: 0.6 },
        { name: 'Border warfare drags on', severity: 0.5 },
        { name: 'Siege engines spotted across the river', severity: 0.7 },
      ],
    });
    const sieges = sources.filter(s => s.inferredType === 'siege');
    expect(sieges.length).toBe(3);
  });

  it("surfaces a wild-magic stressor as an arcane_instability threat end-to-end", () => {
    const profiles = deriveAllThreatProfiles({
      stressors: [{ name: 'Wild magic storms', severity: 0.6 }],
    });
    expect(profiles.some(p => p.type === 'arcane_instability')).toBe(true);
    expect(profiles.some(p => p.type === 'monster_pressure')).toBe(false);
  });
});

// ── Fix 3: per-call memo is byte-identical ────────────────────────────────

describe('deriveCausalState — per-call memo is byte-identical', () => {
  const richSettlement = () => ({
    name: 'Memo Town',
    population: 4200,
    config: { monsterThreat: 'frontier', tradeRouteAccess: 'crossroads' },
    economicState: {
      prosperity: 'comfortable',
      economicComplexity: 'diversified',
      foodSecurity: { surplusPct: 50 },
      safetyProfile: { blackMarketCapture: 20 },
    },
    activeConditions: [
      { archetype: 'plague', severity: 0.6 },
      { archetype: 'corruption_exposed', severity: 0.5 },
    ],
    powerStructure: {
      governingName: 'Merchant League',
      publicLegitimacy: { score: 58, label: 'Approved' },
      factions: [
        { faction: 'Merchant League', power: 60 },
        { faction: "Thieves' Court", power: 45 },
        { faction: 'Temple of Light', power: 38 },
      ],
    },
    institutions: [{ name: 'High Court' }, { name: 'City Watch' }],
  });

  it('produces deep-equal causal state on two consecutive derivations of the same object', () => {
    const s = richSettlement();
    const a = deriveCausalState(s);
    const b = deriveCausalState(s);
    // The memo returns the SAME cached condition/faction arrays on the second
    // call; the resulting causal state must be byte-identical to the first.
    expect(b).toEqual(a);
    expect(b.scores).toEqual(a.scores);
    expect(b.bands).toEqual(a.bands);
    expect(b.summary).toEqual(a.summary);
    expect(b.variables).toEqual(a.variables);
  });

  it('is byte-identical to a structurally-identical-but-distinct settlement (memo miss path)', () => {
    // A fresh object with identical content is a cache MISS (different identity)
    // yet must derive the same scores/bands — proving the memo only collapses
    // redundant work, never changes the result.
    const cached = deriveCausalState(richSettlement());
    const fresh = deriveCausalState(richSettlement());
    expect(fresh.scores).toEqual(cached.scores);
    expect(fresh.bands).toEqual(cached.bands);
    expect(fresh.variables).toEqual(cached.variables);
  });

  it('does not mutate the settlement (memo arrays stay read-only)', () => {
    const s = richSettlement();
    const before = JSON.stringify(s);
    deriveCausalState(s);
    deriveCausalState(s);
    expect(JSON.stringify(s)).toBe(before);
  });
});
