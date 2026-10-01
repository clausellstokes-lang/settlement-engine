/**
 * THE INSTITUTION REGISTRY WALKER — the urban-band laws (owner-approved 2026-09-30).
 *
 * src/data/institutionalCatalog.js defines each institution ONCE, as a family with one shelf
 * and an entry per tier. This walker holds what that shape exists to guarantee, so the drift
 * the 2026-09-30 survey measured cannot come back one row at a time:
 *
 *   L1  HAMLET → VILLAGE IS CUMULATIVE: a family with a hamlet entry has a village entry.
 *   L2  TOWN → CITY → METROPOLIS IS CUMULATIVE: a town family reaches city and metropolis,
 *       a city family reaches metropolis. (The owner: "i think of towns as simply small
 *       cities"; "make sure this also remains true from hamlet to village".)
 *       A family may stop only by a declared `ceiling: { tier, reason }` at its top tier.
 *   L3  ONE FUNCTION, ONE SHELF: every catalog name sits on exactly one shelf at every tier,
 *       and both ends of every scale-ladder pair share it (Merchant warehouses sat on
 *       Adventuring while Warehouse district sat on Economy).
 *   L4  THE GATE TABLE AGREES: spatialData's GATE_FEATURES may not set a tier floor above
 *       the lowest tier the registry rolls a name at, and a hard `requires` must be
 *       satisfiable at every tier the name rolls at (town Citadel and town Printing house
 *       were rolled and then deleted as unsupported, every time).
 *   L5  THE CHAINS NAME REAL INSTITUTIONS: every supply-chain processor pattern matches a
 *       catalog row, and every chain has a processor at every tier from its minTier up
 *       (in 100 metropolises, none of thirteen core chains was ever active).
 *   L6  THE PICKER IS THE GENERATOR: the in-tier set the institution grid shows is exactly
 *       the tier's catalog block.
 *   L7  NO COUNT LABEL OUTLIVES ITS TIER: a name carried to more than one urban tier may not
 *       print a count parenthetical — the display seam must relabel it.
 *
 * Every arm derives its denominator from the live data; nothing is re-typed.
 */
import { describe, expect, it } from 'vitest';
import {
  INSTITUTION_FAMILIES,
  INSTITUTION_TIERS,
  institutionalCatalog,
  familyNamesByTier,
} from '../../src/data/institutionalCatalog.js';
import { UPGRADE_CHAINS, institutionLadderEvicts } from '../../src/data/institutionLadders.js';
import { GATE_FEATURES } from '../../src/data/spatialData.js';
import { SPATIAL_FEATURES } from '../../src/generators/structuralValidator.js';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';
import { getInstitutionsForTier } from '../../src/data/institutionLookups.js';
import { institutionMatchesProcessor } from '../../src/generators/computeActiveChains.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_DISPLAY_NAMES } from '../../src/domain/display/institutionDisplayName.js';

const T = INSTITUTION_TIERS;
const tierIndex = (tier) => T.indexOf(tier);

/** name → the set of tiers the derived catalog lists it at, and its shelves. */
function catalogIndex() {
  const tiers = new Map();
  const shelves = new Map();
  for (const tier of T) {
    for (const [shelf, rows] of Object.entries(institutionalCatalog[tier])) {
      for (const name of Object.keys(rows)) {
        if (!tiers.has(name)) { tiers.set(name, new Set()); shelves.set(name, new Set()); }
        tiers.get(name).add(tier);
        shelves.get(name).add(shelf);
      }
    }
  }
  return { tiers, shelves };
}

const familyLabel = (fam) => familyNamesByTier(fam).map(e => `${e.tier}:${e.name}`).join(' → ');

describe('L1/L2 — the cumulative laws', () => {
  it('has families to walk (anti-vacuity)', () => {
    expect(INSTITUTION_FAMILIES.length).toBeGreaterThan(150);
    expect(INSTITUTION_FAMILIES.filter(f => f.at.hamlet).length).toBeGreaterThan(20);
    expect(INSTITUTION_FAMILIES.filter(f => f.at.town).length).toBeGreaterThan(80);
  });

  it('every family with a hamlet entry has a village entry, unless it declares a hamlet ceiling', () => {
    const broken = INSTITUTION_FAMILIES
      .filter(f => f.at.hamlet && !f.at.village && f.ceiling?.tier !== 'hamlet')
      .map(familyLabel);
    expect(broken, 'hamlet families that stop before village with no declared ceiling').toEqual([]);
  });

  it('every town family reaches city and metropolis, and every city family reaches metropolis, unless it declares a ceiling', () => {
    const broken = [];
    for (const f of INSTITUTION_FAMILIES) {
      const top = familyNamesByTier(f).at(-1)?.tier;
      if (tierIndex(top) < tierIndex('town')) continue; // rural families end where they end
      if (top === 'metropolis') {
        // a family that reaches the top must not skip an urban tier on the way
        const first = familyNamesByTier(f)[0].tier;
        for (let i = Math.max(tierIndex(first), tierIndex('town')); i <= tierIndex('metropolis'); i++) {
          if (!f.at[T[i]]) broken.push(`${familyLabel(f)} skips ${T[i]}`);
        }
        continue;
      }
      if (f.ceiling?.tier !== top) broken.push(`${familyLabel(f)} stops at ${top} without a ceiling`);
    }
    expect(broken).toEqual([]);
  });

  it('a ceiling sits at the family\'s top tier and carries a reason', () => {
    const broken = [];
    for (const f of INSTITUTION_FAMILIES) {
      if (!f.ceiling) continue;
      const top = familyNamesByTier(f).at(-1)?.tier;
      if (f.ceiling.tier !== top) broken.push(`${familyLabel(f)}: ceiling ${f.ceiling.tier} ≠ top ${top}`);
      if (typeof f.ceiling.reason !== 'string' || f.ceiling.reason.trim().length < 20) {
        broken.push(`${familyLabel(f)}: ceiling without a real reason`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('a declared successor is a real catalog row at a higher tier than the family ends', () => {
    const { tiers } = catalogIndex();
    const broken = [];
    for (const f of INSTITUTION_FAMILIES) {
      if (!f.successor) continue;
      const top = familyNamesByTier(f).at(-1).tier;
      const at = tiers.get(f.successor);
      if (!at) { broken.push(`${familyLabel(f)}: successor "${f.successor}" is not a catalog row`); continue; }
      if (![...at].some(t => tierIndex(t) > tierIndex(top))) broken.push(`${familyLabel(f)}: successor "${f.successor}" never exists above ${top}`);
    }
    expect(broken).toEqual([]);
  });
});

describe('L3 — one function, one shelf', () => {
  it('every catalog name sits on exactly one shelf at every tier it exists', () => {
    const { shelves } = catalogIndex();
    const split = [...shelves].filter(([, s]) => s.size > 1).map(([n, s]) => `${n}: ${[...s].join(' + ')}`);
    expect(shelves.size, 'anti-vacuity').toBeGreaterThan(250);
    expect(split).toEqual([]);
  });

  it('both ends of every scale-ladder pair share a shelf', () => {
    const { shelves } = catalogIndex();
    const broken = [];
    let walked = 0;
    for (const [lesser, greater] of UPGRADE_CHAINS) {
      const a = shelves.get(lesser); const b = shelves.get(greater);
      if (!a || !b) continue; // a ladder may name a non-catalog greater (custom/derived)
      walked++;
      if ([...a][0] !== [...b][0]) broken.push(`${lesser} (${[...a][0]}) → ${greater} (${[...b][0]})`);
    }
    expect(walked, 'anti-vacuity').toBeGreaterThan(80);
    expect(broken).toEqual([]);
  });
});

describe('L4 — the gate table agrees with the registry', () => {
  const { tiers } = catalogIndex();
  const lowestTier = (name) => [...tiers.get(name)].sort((a, b) => tierIndex(a) - tierIndex(b))[0];
  // The validator's own rule (structuralValidator.js `requirementIsSatisfied`): a requirement
  // is met by a row seated beside it, by a seated row SPATIAL_FEATURES says implies it (a
  // banking district implies banking houses), or by the row itself when it is the greater rung
  // the ladder says evicts the required one ('Parish churches (10-30)' requires the (2-5) it
  // grew from). Every tier block is complete, so "beside it" means listed at the SAME tier, and,
  // as in the validator, the subject never implies evidence for its own gate.
  const listedAt = new Map(T.map((tier) => [tier, Object.values(institutionalCatalog[tier]).flatMap((rows) => Object.keys(rows))]));
  const satisfiableAt = (name, req, tier) => {
    if (!tiers.has(req)) return true; // not a catalog row: derived evidence stated elsewhere
    const others = listedAt.get(tier).filter((n) => n !== name);
    return others.includes(req)
      || others.some((n) => (SPATIAL_FEATURES[n] || []).includes(req))
      || institutionLadderEvicts(name, req);
  };

  it('no gate sets a tier floor above the lowest tier the registry rolls the name at', () => {
    const broken = [];
    for (const [name, gate] of Object.entries(GATE_FEATURES)) {
      if (!tiers.has(name) || !gate.minTier) continue;
      if (tierIndex(gate.minTier) > tierIndex(lowestTier(name))) {
        broken.push(`${name}: gate floor ${gate.minTier}, registry rolls it from ${lowestTier(name)}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('a hard `requires` is satisfiable at every tier the registry rolls the name at', () => {
    const broken = [];
    let walked = 0;
    for (const [name, gate] of Object.entries(GATE_FEATURES)) {
      if (!tiers.has(name) || !gate.requires?.length || gate.suggestionOnly) continue;
      for (const tier of tiers.get(name)) {
        walked++;
        const ok = gate.requires.some(req => satisfiableAt(name, req, tier));
        if (!ok) broken.push(`${name}@${tier}: none of [${gate.requires.join(', ')}] is listed at ${tier}`);
      }
    }
    expect(walked, 'anti-vacuity').toBeGreaterThan(50);
    expect(broken).toEqual([]);
  });
});

describe('L5 — the supply chains name real institutions', () => {
  const allNames = [...catalogIndex().tiers.keys()];
  const matches = (name, pattern) => institutionMatchesProcessor({ name, catalogId: catalogIdForName(name) }, pattern);
  const chains = Object.values(SUPPLY_CHAIN_NEEDS).flatMap(need => need.chains);

  it('every processor pattern matches at least one catalog institution', () => {
    const dead = [];
    for (const chain of chains) {
      for (const pattern of chain.processingInstitutions || []) {
        if (!allNames.some(name => matches(name, pattern))) dead.push(`${chain.id}: "${pattern}"`);
      }
    }
    expect(chains.length, 'anti-vacuity').toBeGreaterThan(40);
    expect(dead).toEqual([]);
  });

  it('every chain has a processor at every tier from its minTier up', () => {
    const gaps = [];
    for (const chain of chains) {
      const procs = chain.processingInstitutions || [];
      if (procs.length === 0) continue;
      for (const tier of T.slice(tierIndex(chain.minTier || 'thorp'))) {
        const names = Object.values(institutionalCatalog[tier]).flatMap(rows => Object.keys(rows));
        if (!procs.some(pattern => names.some(name => matches(name, pattern)))) gaps.push(`${chain.id}@${tier}`);
      }
    }
    expect(gaps).toEqual([]);
  });
});

describe('L6 — the picker is the generator', () => {
  it('the in-tier set the institution grid shows is exactly the tier\'s catalog block', () => {
    for (const tier of T) {
      const block = new Set(Object.values(institutionalCatalog[tier]).flatMap(rows => Object.keys(rows)));
      expect([...getInstitutionsForTier(tier)].sort(), tier).toEqual([...block].sort());
    }
  });
});

describe('L7 — no count label outlives its tier', () => {
  it('a name carried to more than one urban tier prints no count parenthetical', () => {
    const { tiers } = catalogIndex();
    const urban = new Set(['town', 'city', 'metropolis']);
    const broken = [];
    let walked = 0;
    for (const [name, at] of tiers) {
      const urbanTiers = [...at].filter(t => urban.has(t));
      if (urbanTiers.length < 2 || !/\(\d[\d,]*-\d/.test(name)) continue;
      walked++;
      const label = INSTITUTION_DISPLAY_NAMES[name];
      if (!label || /\(\d/.test(label)) broken.push(`${name} at ${urbanTiers.join('+')} prints "${label ?? name}"`);
    }
    expect(walked, 'anti-vacuity').toBeGreaterThanOrEqual(5);
    expect(broken).toEqual([]);
  });
});
