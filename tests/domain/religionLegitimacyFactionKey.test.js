/**
 * religionLegitimacyFactionKey.test.js — THE FACTION-KEY BUG, religion-lens instance.
 *
 * Sibling of tests/domain/npcLadderFactionKey.test.js (commits 25749ae5 + dc0b6e2b),
 * same defect class, different consumer: rulerLens in worldPulse/religionLegitimacy.js
 * hand-rolled its own faction lookups against `.name`, `.archetype`, and `.id` — three
 * keys that NO generated powerStructure.factions record carries. All three read dead on
 * every real settlement.
 *
 * WHY THIS FILE BUILDS FROM THE REAL GENERATOR AND NOT FIXTURES: this bug survived
 * precisely because tests/domain/religionLegitimacy.test.js builds `.name`/`.archetype`/
 * `.id`-shaped fixtures, which exercise the code paths that only ever fire in tests. A pin
 * written in the fixture shape would have passed against the broken code. Every
 * REVERT-PROOF case below therefore runs the actual generator; only the shape-contract
 * cases hand-build records, and those are built in the REAL shape (`.faction` + `.category`,
 * no `.name`/`.id`/`.archetype`).
 *
 * TWO GENERATOR ENTRANCES, AND THE DIFFERENCE IS LOAD-BEARING. `generatePowerStructure` is
 * the bare power step; `generateSettlementPipeline` is the whole settlement. They do NOT
 * produce the same corpus — the pipeline adds stress factions, capture states, and
 * legitimacy crises, and its power distribution is materially different. Measuring only the
 * bare step understates this defect badly: against the bare step the pre-fix highest-power
 * fallback happened to agree with the true seat 360/360, which reads as "latent"; against
 * the full pipeline it disagrees on 66/180 = 36.7% of FRESH settlements, which is live.
 * Cases that care about prevalence therefore go through the pipeline, and the cheap
 * shape-contract sweep uses the bare step only because it needs breadth, not realism.
 *
 * generatePowerStructure is deterministic for a given (tier, prosperity) with no seeded RNG
 * context, and the pipeline is deterministic for a given seed; both are asserted below
 * rather than assumed, so these are stable cases, not samples.
 */
import { describe, it, expect } from 'vitest';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { governingFactionOf, nameOf, transferRulingPower } from '../../src/domain/rulingPower.js';
import { factionArchetype } from '../../src/domain/factionArchetypes.js';
import { rulerLens } from '../../src/domain/worldPulse/religionLegitimacy.js';

/** A real generated power structure. @param {string} tier @param {string} prosperity */
const realPs = (tier, prosperity) => generatePowerStructure(tier, { prosperity }, null, {}, []);
/** @param {string} tier @param {string} prosperity */
const realSettlement = (tier, prosperity) => ({
  tier, powerStructure: realPs(tier, prosperity), npcs: [], institutions: [], config: {},
  economicState: { prosperity },
});
/** The pre-fix selection rule: highest `.power` wins (both `.name` finds were dead).
 *  @param {{ factions: any[] }} ps */
const highestPower = (ps) => ps.factions.slice()
  .sort((a, b) => (Number(b?.power) || 0) - (Number(a?.power) || 0))[0];

describe('THE FACTION-KEY BUG — the real powerStructure record shape', () => {
  it('is deterministic per (tier, prosperity), so every case below is stable', () => {
    expect(JSON.stringify(realPs('city', 'struggling')))
      .toBe(JSON.stringify(realPs('city', 'struggling')));
  });

  // CONTRACT PIN (passes pre- and post-fix by design — it pins the GENERATOR shape that
  // makes the fix necessary, not the fix). If this ever goes red, the shape moved and the
  // rest of this file needs re-deriving.
  it('carries the display name in .faction and carries NO .name, .id, or .archetype', () => {
    const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    const prosperities = ['struggling', 'poor', 'average', 'prosperous', 'wealthy'];
    let records = 0;
    for (const tier of tiers) {
      for (const prosperity of prosperities) {
        for (const f of realPs(tier, prosperity).factions) {
          records += 1;
          expect(typeof f.faction).toBe('string');
          expect(f.faction).not.toBe('');
          expect(f.category).toBeDefined();       // what factionArchetype actually reads
          expect(f.name).toBeUndefined();         // the key the old lookup matched on
          expect(f.id).toBeUndefined();           // the key the old NPC join matched on
          expect(f.archetype).toBeUndefined();    // the key the old ARCHETYPE_LEAN read
        }
      }
    }
    expect(records).toBeGreaterThan(100);         // 120 at time of writing (30 structures)
  });
});

describe('rulerLens reads the canonical governing seat', () => {
  // REVERT-PROOF. The pre-fix fallback (highest .power) agreed with the true seat on every
  // fresh world and after ONE coup — that agreement was an ordering coincidence, not a
  // contract, and it BREAKS when one faction wins twice: each win banks +6 while the seat's
  // own power never moves, so the two-time winner overtakes it. Measured at 120/300
  // settlements. This case is the smallest fully-observable instance: the true seat and the
  // highest-power faction derive DIFFERENT archetypes, so the wrong pick is visible in
  // lens.temper (government 0.5 vs merchant 0.4).
  it('picks the true seat, not the highest-power faction, after a repeat coup', () => {
    let s = realSettlement('city', 'struggling');
    const incumbent = governingFactionOf(s);
    const challenger = nameOf(s.powerStructure.factions
      .filter((f) => f !== incumbent)
      .sort((a, b) => (Number(b.power) || 0) - (Number(a.power) || 0))[0]);

    for (let round = 0; round < 2; round += 1) {
      const result = transferRulingPower(s, challenger, { cause: 'coup', tick: round });
      expect(result.error).toBeNull();
      s = /** @type {any} */ (result.settlement);
    }

    const seat = governingFactionOf(s);
    const wrongPick = highestPower(s.powerStructure);

    // The premise: the two diverge, and they classify differently.
    expect(seat).not.toBe(wrongPick);
    expect(nameOf(seat)).toBe('Grand Merchant Senate');
    expect(nameOf(wrongPick)).toBe('Merchant Guilds');
    expect(Number(wrongPick.power)).toBeGreaterThan(Number(seat.power));
    expect(factionArchetype(seat)).toBe('government');
    expect(factionArchetype(wrongPick)).toBe('merchant');

    const lens = rulerLens(s);

    // THE SELECTION PIN, isolated from the archetype fix. lens.power reads the chosen
    // record's own `.power` (0.45 + 0.55 × power/100 with an empty roster), so it responds
    // ONLY to which faction was picked — no archetype, no lean, no NPC involved. The seat
    // holds 32 and the wrong pick holds 35, so the two are distinguishable to 10 places.
    expect(lens.power).toBeCloseTo(0.45 + 0.55 * (Number(seat.power) / 100), 10);
    expect(lens.power).not.toBeCloseTo(0.45 + 0.55 * (Number(wrongPick.power) / 100), 10);

    // Corroboration through the lean: government align 0.6, merchant align 0.5.
    // NOTE deliberately NOT asserted on temper — 'government' and 'other' BOTH sit at
    // temper 0.5, so a temper assertion here would pass against the pre-fix code and pin
    // nothing. That near-miss is why this case asserts power and align instead.
    expect(lens.align).toBeCloseTo(0.6, 10);
  });

  // REVERT-PROOF, and the case that matters most: this defect is LIVE ON FRESH WORLDS, not
  // merely latent behind a repeat coup. Through the FULL pipeline (not the bare power
  // generator — that distinction is the whole point, see the note at the top of this file)
  // the governing seat is frequently NOT the highest-power faction: rulingStructure sorts
  // the array governing-first regardless of power, which hides it from a casual read, but
  // the pre-fix lens re-sorted by power alone and landed elsewhere. Measured 66/180 = 36.7%
  // of freshly generated settlements. Here a 12-power elected seat is out-powered 39-to-12
  // by the temple, so pre-fix the lens read the settlement's character off the TEMPLE.
  it('reads the weak elected seat, not the faction that out-powers it', () => {
    const cfg = { tier: 'thorp', culture: 'germanic', terrain: 'plains', tradeRoute: 'road' };
    const build = () => generateSettlementPipeline(cfg, null, { seed: 'SHIFT-thorp-4', customContent: {} });
    const s = build();

    // The seed is pinned, so pin its determinism too rather than trusting it.
    expect(JSON.stringify(build().powerStructure.factions))
      .toBe(JSON.stringify(s.powerStructure.factions));

    const seat = governingFactionOf(s);
    const wrongPick = highestPower(s.powerStructure);
    expect(nameOf(seat)).toBe('Elected Reeve');
    expect(nameOf(wrongPick)).toBe('Religious Authorities');
    expect(Number(seat.power)).toBe(12);
    expect(Number(wrongPick.power)).toBe(39);
    expect(factionArchetype(seat)).toBe('government');     // from the name ('reeve')
    expect(factionArchetype(wrongPick)).toBe('religious'); // from the category

    // Selection, isolated: lens.power tracks the chosen record's own power. The roster is
    // non-empty here, so leadPow floors it — assert the seat's 12 does NOT read as 39.
    const lens = rulerLens(s);
    expect(lens.power).toBeLessThan(0.45 + 0.55 * 0.39);
    // And the lean is the seat's (government temper 0.5), not the temple's (religious 0.4).
    expect(lens.temper).toBeCloseTo(0.5, 10);
  });

  // CONTRACT PIN + REVERT-PROOF. The highest-power fallback is deliberately KEPT for the
  // legacy/partial shape (no .isGoverning record, no matching governingName) — deleting it
  // would strand every fixture written that way, including religionLegitimacy.test.js's own.
  // It reddens pre-fix as well, because the fallback record is real-shaped (.category, no
  // .archetype) and only the derived archetype reads it as criminal.
  it('still falls back to the highest-power faction when no seat is identifiable', () => {
    const s = {
      powerStructure: {
        governingName: '',
        factions: [
          { faction: 'Weak Chapel', category: 'religious', power: 10 },
          { faction: 'The Cabal', category: 'criminal', power: 90 },
        ],
      },
      npcs: [],
    };
    expect(governingFactionOf(/** @type {any} */ (s))).toBeNull();
    // criminal lean: temper 0.7, align 0.15 — the highest-power record won.
    expect(rulerLens(/** @type {any} */ (s)).temper).toBeCloseTo(0.7, 10);
  });
});

describe('rulerLens derives the archetype instead of reading a key that does not exist', () => {
  // REVERT-PROOF. Pre-fix, `String(ruler?.archetype || 'other')` resolved 'other' on 100%
  // of real settlements, so ARCHETYPE_LEAN was entirely dead weight and every generated
  // world read the neutral 0.5/0.5 lean. Post-fix the real `.category` drives it.
  it('reads a real government seat as government, not other', () => {
    const s = realSettlement('city', 'average');
    const seat = governingFactionOf(s);
    expect(seat.archetype).toBeUndefined();          // nothing to read…
    expect(seat.category).toBe('government');        // …but this is there
    expect(factionArchetype(seat)).toBe('government');
    // government align 0.6, other align 0.5. With no NPCs, npcAlign falls back to
    // lean.align, so lens.align IS lean.align: 0.6 post-fix, 0.5 pre-fix.
    expect(rulerLens(s).align).toBeCloseTo(0.6, 10);
  });

  // REVERT-PROOF. The compromise chain's `factionDark` term keyed on the same absent
  // `.archetype`, so a criminal seat could never rot its own rulership on real data.
  // Built in the REAL record shape (.faction + .category, no .name/.id/.archetype).
  it('lets a criminal seat drive the compromise chain', () => {
    const criminal = {
      powerStructure: {
        governingName: 'Shadow Senate',
        factions: [{ faction: 'Shadow Senate', category: 'criminal', power: 70, isGoverning: true }],
      },
      npcs: [], institutions: [],
    };
    const clean = {
      powerStructure: {
        governingName: 'City Council',
        factions: [{ faction: 'City Council', category: 'government', power: 70, isGoverning: true }],
      },
      npcs: [], institutions: [],
    };
    const dark = rulerLens(/** @type {any} */ (criminal));
    const light = rulerLens(/** @type {any} */ (clean));
    // Both sit in the same ambient crime climate, so the ONLY difference is factionDark.
    expect(dark.corrupt).toBe(light.corrupt);
    // factionDark contributes 0.25 * 0.5 = 0.125. Pre-fix the term could never fire, so
    // this delta was exactly 0. Pinned as a DELTA, not an absolute, so retuning the
    // ambient-crime coefficients does not falsely redden this pin.
    expect(dark.compromise - light.compromise).toBeCloseTo(0.125, 10);
  });

  // CONTRACT PIN. A hand-authored `.archetype` keeps precedence over the derived value, so
  // the legacy unit fixtures still drive the lens they were written for. Without this the
  // fix would silently reclassify them ('Iron Legion' derives 'other', not 'military').
  it('lets an authored .archetype win over the derived one', () => {
    const authored = {
      powerStructure: {
        governingName: 'Iron Legion',
        factions: [{ id: 'f.mil', name: 'Iron Legion', archetype: 'military', power: 85 }],
      },
      npcs: [],
    };
    expect(factionArchetype(authored.powerStructure.factions[0])).toBe('other');  // derived
    expect(rulerLens(/** @type {any} */ (authored)).temper).toBeCloseTo(0.9, 10); // authored wins
  });
});

describe('rulerLens NPC join — the roster reach is deliberate, not accidental', () => {
  // CONTRACT PIN for a DOCUMENTED DELIBERATE CHOICE, not for the bug.
  //
  // The old join filtered on `String(ruler?.id || '')`, always '' on real data, so it never
  // fired and the scan silently covered the whole roster. The fix narrows to the seat's own
  // members — and that narrowing DOES fire on real data (the seat has ≥1 affiliated NPC in
  // 180/180 pipeline settlements), which is most of why this change moves the lens.
  //
  // The whole-roster fallback is kept only for the shape where the seat has NO members:
  // hand-authored fixtures and sparse worlds, where an empty set would null `lead` and zero
  // `rulerFlaw` and read blanker than the bug did. This case pins that fallback so a future
  // cleanup cannot delete it; the case below pins that it does NOT engage when members exist.
  it('falls back to the whole roster when the seat has no linked members', () => {
    const s = realSettlement('city', 'average');
    s.npcs = /** @type {any} */ ([
      { name: 'Unaffiliated Magnate', importance: 'pillar', factionAffiliation: 'Merchant Guilds' },
    ]);
    const seat = governingFactionOf(s);
    // Premise: that NPC belongs to a DIFFERENT faction than the seat.
    expect(nameOf(seat)).not.toBe('Merchant Guilds');
    // lens.power reads max(seat.power/100, leadPow). leadPow = 1 (pillar) only if the
    // roster was scanned at all; the seat's own power is well under 100.
    expect(rulerLens(s).power).toBeCloseTo(1, 10);
  });

  it('prefers the seat\'s own members when the records carry a real join', () => {
    const s = {
      powerStructure: {
        governingName: 'Temple Conclave',
        factions: [
          { faction: 'Temple Conclave', category: 'religious', power: 40, isGoverning: true },
          { faction: 'Merchant Guilds', category: 'economy', power: 60 },
        ],
      },
      npcs: [
        { name: 'Rich Outsider', importance: 'pillar', factionAffiliation: 'Merchant Guilds' },
        { name: 'The Hierarch', importance: 'notable', factionAffiliation: 'Temple Conclave' },
      ],
      institutions: [],
    };
    // The seat HAS a member, so the roster fallback must NOT engage: leadPow is the
    // Hierarch's 0.4, not the outsider pillar's 1.0 ⇒ power = 0.45 + 0.55*max(0.40, 0.40).
    expect(rulerLens(/** @type {any} */ (s)).power).toBeCloseTo(0.45 + 0.55 * 0.4, 10);
  });
});
