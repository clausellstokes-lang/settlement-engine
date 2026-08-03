/**
 * warMagicGate.test.js — MG-3b: LEAK L2 CLOSED; LEAK L3 REPRODUCED AND BLOCKED
 * (docs/DESIGN_REALM_MAGIC_TOGGLE.md §3 leak register, §4 MG-3 slice b).
 *
 * REPRODUCE-FIRST. Both leaks are pre-existing per-settlement defects that the realm
 * magic toggle makes impossible to ignore, and both are asserted here in the shape the
 * register names:
 *
 *   L2 — classifyFeasibility could return `require_magic` ("arcane force could tip an
 *        otherwise-hopeless siege") off a materiel edge built from weapons, armour,
 *        forges and siege trains, with no magic consulted anywhere in the arm.
 *   L3 — warDeployment minted `magicSupport = materiel/100` with no magic gate, and
 *        attrition paid that facet a real mitigation term — a mundane army shielded by
 *        sorcery it does not have, with its materiel counted twice.
 *
 * The byte-identity half of each pin matters as much as the closure: an unstamped or
 * magical envelope must behave EXACTLY as it did before MG-3, or this slice would move
 * war goldens (the §6 MG-3b checkpoint: a golden shift here is a STOP, not a re-record).
 *
 * ⚠️ L3 IS REPRODUCED BUT NOT YET LANDED — STOP REPORTED TO THE CHAIR.
 * The L3 closure is one line at warDeployment.js's magicSupport mint
 * (`facets.magicFunctions === false ? 0 : norm(facets.materiel, 0.5)`), and it was
 * written, wired and PROVEN GREEN in the working tree. It cannot be COMMITTED: at HEAD
 * warDeployment.js already measures 1412 effective lines against a frozen ceiling of
 * 1106 (scripts/.size-baseline.json), so the pre-commit lint-staged gate rejects ANY
 * staged change to that file, from any lane — the same wall that holds WR-7b. The
 * writer half of the law (`stampWarMagicLaw`) ships here fully pinned and ready; the
 * one-line application lands the moment warDeployment is decomposed under its ceiling.
 * See docs/DESIGN_REALM_MAGIC_TOGGLE.md §4 MG-3 for the recorded block.
 */
import { describe, expect, test } from 'vitest';

import { classifyFeasibility, verdictPermitsSiege } from '../../src/domain/worldPulse/feasibilityGate.js';
import { warMagicFunctions, stampWarMagicLaw, pairMagicFunctions } from '../../src/domain/worldPulse/warMagicGate.js';

// ── L2: the feasibility verdict ─────────────────────────────────────────────────

// The register's own matchup: below the plausible floor, rescued ONLY by the magic arm.
const BASE = { attackerCurrent: 28, defenderCurrent: 55 };
const DECISIVE_EDGE = { attackerFacets: { materiel: 90 }, defenderFacets: { materiel: 50 } };

describe('MG-3b — L2: `require_magic` cannot be earned in a world without magic', () => {
  test('the arm still fires for a MAGICAL pair (the pre-MG behaviour, unmoved)', () => {
    expect(verdictPermitsSiege(classifyFeasibility(BASE).verdict)).toBe(false);
    const arcane = classifyFeasibility({ ...BASE, ...DECISIVE_EDGE });
    expect(arcane.verdict).toBe('require_magic');
  });

  test('the SAME decisive materiel edge in a MUNDANE pair yields NO require_magic (the leak, closed)', () => {
    const mundane = classifyFeasibility({
      ...BASE,
      attackerFacets: { materiel: 90, magicFunctions: false },
      defenderFacets: { materiel: 50, magicFunctions: false },
    });
    expect(mundane.verdict !== 'require_magic').toBe(true);
    // The mundane realm gets the ordinary verdict vocabulary instead — the matchup is
    // classified on its own strength, exactly as if the arm did not exist.
    expect(mundane.verdict).toBe(classifyFeasibility(BASE).verdict);
  });

  test('ONE mundane end closes the arm — an arcane edge needs magic at BOTH ends', () => {
    const attackerMundane = classifyFeasibility({
      ...BASE,
      attackerFacets: { materiel: 90, magicFunctions: false },
      defenderFacets: { materiel: 50 },
    });
    const defenderMundane = classifyFeasibility({
      ...BASE,
      attackerFacets: { materiel: 90 },
      defenderFacets: { materiel: 50, magicFunctions: false },
    });
    expect(attackerMundane.verdict !== 'require_magic').toBe(true);
    expect(defenderMundane.verdict !== 'require_magic').toBe(true);
  });

  test('an UNSTAMPED envelope (every pre-MG caller) is byte-identical to the magical one', () => {
    const unstamped = classifyFeasibility({ ...BASE, ...DECISIVE_EDGE });
    const magical = classifyFeasibility({
      ...BASE,
      attackerFacets: { materiel: 90, magicFunctions: true },
      defenderFacets: { materiel: 50, magicFunctions: true },
    });
    expect(magical).toEqual(unstamped);
    expect(pairMagicFunctions({ materiel: 90 }, { materiel: 50 })).toBe(true);
    expect(pairMagicFunctions(null, undefined)).toBe(true);
  });
});

// ── the stamp itself: the present-guard is the whole safety story ───────────────

describe('MG-3b — the magic-law stamp is PRESENT-GUARDED and one-sided', () => {
  test('a settlement with NO magic axis at all is NOT mundane (the neutral-ledger trap)', () => {
    // magicLedger's neutral envelope for an un-generated settlement is itself
    // magicExists:false. An unguarded read would declare every config-less war fixture
    // in the estate mundane and move goldens that have nothing to do with magic.
    expect(warMagicFunctions({ settlement: { config: { priorityEconomy: 25 } } })).toBe(true);
    expect(warMagicFunctions({ settlement: {} })).toBe(true);
    expect(warMagicFunctions(null)).toBe(true);
  });

  test('a settlement that ASSERTS magic absent is mundane; one that asserts it present is not', () => {
    expect(warMagicFunctions({ settlement: { config: { magicExists: false, priorityMagic: 0 } } })).toBe(false);
    expect(warMagicFunctions({ settlement: { config: { magicExists: true, priorityMagic: 40 } } })).toBe(true);
    // A bare settlement (not a snapshot item) reads correctly too.
    expect(warMagicFunctions({ config: { magicExists: false, priorityMagic: 0 } })).toBe(false);
  });

  test('stamping a MAGICAL settlement returns the model object by IDENTITY (no byte moved)', () => {
    const facets = { materiel: 70, will: 40 };
    expect(stampWarMagicLaw(facets, { settlement: { config: { magicExists: true, priorityMagic: 40 } } })).toBe(facets);
    expect(stampWarMagicLaw(facets, { settlement: {} })).toBe(facets);
  });

  test('stamping a MUNDANE settlement COPIES — the capacity model own facets are never mutated', () => {
    const facets = { materiel: 70, will: 40 };
    const stamped = stampWarMagicLaw(facets, { settlement: { config: { magicExists: false, priorityMagic: 0 } } });
    expect(stamped).not.toBe(facets);
    expect(stamped).toEqual({ materiel: 70, will: 40, magicFunctions: false });
    expect(facets.magicFunctions).toBe(undefined); // the model's object is untouched
  });
});

// ── L3: the minted magicSupport facet — REPRODUCED, BLOCKED AT THE COMMIT GATE ──
//
// The L3 integration pins (a mundane realm's deployment record mints magicSupport 0
// while its magical twin mints the materiel reading, and an axis-less realm is
// byte-identical to the magical one) were written and ran GREEN against the wired
// closure. They are withheld from the committed suite because the one-line closure
// they exercise cannot be committed: warDeployment.js is 306 effective lines over its
// frozen size ceiling at HEAD, so lint-staged rejects the file for every lane. Landing
// green pins for an un-landable fix would put a permanent red in the tree; recording
// the block where the next implementer will find it does not. The mechanism those pins
// depend on is fully covered above by the stamp suite.
