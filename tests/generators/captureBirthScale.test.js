/**
 * tests/generators/captureBirthScale.test.js — Wave 7 #1 pins.
 *
 * Birth-scale reconciliation of computeCriminalCaptureState with the
 * play-time capture ladder (domain/corruption.js CAPTURE_LADDER):
 *
 *   1. Self-comparison artifact is dead — a criminal-flavoured GOVERNMENT
 *      ('Corrupt Council' carries category 'criminal' via the 'Corrupt'
 *      keyword) is no longer matched against itself (ratio exactly 1.0).
 *   2. Deeply criminal births read contested/influenced (equilibrium /
 *      corrupted); ordinary births stay clean; full capture is extraordinary
 *      even at the deliberate extreme of the config space.
 *   3. An equilibrium+ birth stamps the rung onto the governing faction
 *      entry, so ensureFactionStates seeds the play-time ladder where
 *      generation says it already is (otherwise the first pulse's rollup
 *      would silently reset criminalCaptureState to 'none').
 *
 * Sweep thresholds were RECALIBRATED 2026-07-26 (owner-ratified) after the
 * final-economy -> power reconciliation. Power is now projected against the
 * settlement's FINAL economy and its real defense label rather than a
 * provisional one, so computePublicLegitimacy reads actual prosperity/safety/
 * food and legitimacy multipliers redistribute faction power accordingly. That
 * legitimately raised the criminal-capture rate; the new rate is the accepted
 * tuning truth, not drift. Measured in this tree at N=400: ordinary towns read
 * ~2.25% corrupted and 0% capture; 90-criminal-priority fixtures read full
 * capture at ~6.75% (towns) / ~4.0% (cities).
 *
 * N was raised 40 -> 400 because the capture rate is front-loaded across the
 * seed space (much denser over the first 100 seeds than over seeds 200-400), so
 * a 40-seed instrument carries a +/-4% standard error — wider than the margin it
 * was being asked to judge. The full analysis, including the base-vs-tree
 * measurement table and the owner ruling, is in docs/GOLDEN_SHIFT_LEDGER.md
 * under "2026-07-26 — criminal-capture distribution shift".
 * Deterministic: seeds derive from index, same numbers every run.
 *
 * EPISTEMIC PREVENTION (wave EP-2D, 2026-07-27). This file is the instrument that
 * OPENED the program: `capture <= 4` over a 40-seed corpus whose expected count was 2
 * passed with exactly zero margin. The sweep bounds below are now DERIVED from the
 * measured base rate at the corpus size and read from
 * tests/fixtures/distribution-envelopes.manifest.json — one home per bound, provenance
 * attached, re-derived on every run by tests/lint/distributionEnvelopePower.test.js.
 *
 * FOUR bounds here are deliberately NOT derived, and each says why at its assertion:
 * three rest on a measured rate of exactly 0 or exactly 1 (a binomial envelope is
 * degenerate there — 0/400 does NOT license "at most 1 of 400", the rule of three puts
 * the plausible ceiling at 3), and one — the ordinary-town corrupted ceiling — is a
 * genuinely POWERLESS bound that no affordable corpus can rescue. See its comment.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { computeCriminalCaptureState } from '../../src/generators/factionDynamics.js';
import { readEnvelope } from '../helpers/distributionEnvelope.js';

const N = 400;

/** The one canonical home for this file's derived distribution bounds. */
const ENVELOPES = JSON.parse(readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../fixtures/distribution-envelopes.manifest.json'),
  'utf8',
));

/**
 * Read a registered envelope and prove it was measured against THIS corpus size. An
 * entry whose `n` drifted from the sweep it governs is a bound about a different
 * experiment; the derivation would still re-check, but against the wrong n.
 * @param {string} id
 */
function envelope(id) {
  const entry = readEnvelope(ENVELOPES, id);
  expect(entry.n, `${id}: registered for n=${entry.n} but this sweep runs N=${N}`).toBe(N);
  return entry;
}
const LADDER = ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture'];

const CRIMINAL_HEAVY = {
  priorityCriminal: 90,
  priorityMilitary: 20,
  priorityEconomy: 35,
  priorityReligion: 20,
  priorityMagic: 20,
};

function sweep(config, seedPrefix) {
  const out = [];
  for (let i = 0; i < N; i++) {
    out.push(generateSettlementPipeline(config, null, { seed: `${seedPrefix}-${i}`, customContent: {} }));
  }
  return out;
}

const capOf = s => s.powerStructure?.criminalCaptureState || 'none';
const rungOf = s => LADDER.indexOf(capOf(s));
const countAtLeast = (settlements, rung) =>
  settlements.filter(s => rungOf(s) >= LADDER.indexOf(rung)).length;

describe('computeCriminalCaptureState — unit semantics', () => {
  it('a criminal-flavoured government is classified deliberately, not via self-comparison', () => {
    // 'Corrupt Council' is both governing and category criminal — the old
    // finder compared it against ITSELF (crimP === govP → permanent
    // 'corrupted' whenever safety was low). The new finder excludes the
    // governing seat; the purchased-council branch classifies it instead.
    const factions = [{ faction: 'Corrupt Council', category: 'criminal', isGoverning: true, power: 46 }];
    expect(computeCriminalCaptureState(factions, 0.3, {})).toBe('corrupted');
    // ...and with enforcement intact, a criminal-flavoured name alone is not capture-track.
    expect(computeCriminalCaptureState(factions, 0.8, {})).toBe('none');
  });

  it('capture needs a real underworld overtopping a STILL-STANDING government', () => {
    const gov = p => ({ faction: 'Town Council', isGoverning: true, power: p });
    const crim = p => ({ faction: "Thieves' Guild", category: 'criminal', power: p });
    const mil = { faction: 'City Guard', power: 8 };
    // Dominates a standing government with enforcement broken: capture.
    expect(computeCriminalCaptureState([gov(18), crim(28), mil], 0.1, {})).toBe('capture');
    // Same underworld over a COLLAPSED government (power vacuum, nothing left
    // to wear as a front): not capture.
    expect(computeCriminalCaptureState([gov(10), crim(28), mil], 0.1, {})).not.toBe('capture');
    // Ordinary enforcement-winning posture stays adversarial.
    expect(computeCriminalCaptureState([gov(30), crim(6), mil], 1.2, {})).toBe('adversarial');
  });
});

describe('birth-scale distribution sweep', () => {
  const ordinaryTowns = sweep({ settType: 'town', culture: 'germanic' }, 'cap-ord-town');
  const ordinaryCities = sweep({ settType: 'city', culture: 'germanic' }, 'cap-ord-city');
  const ordinaryVillages = sweep({ settType: 'village', culture: 'germanic' }, 'cap-ord-village');
  const criminalTowns = sweep({ settType: 'town', culture: 'germanic', ...CRIMINAL_HEAVY }, 'cap-crim-town');
  const criminalCities = sweep({ settType: 'city', culture: 'germanic', ...CRIMINAL_HEAVY }, 'cap-crim-city');

  it('ordinary settlements essentially never read influenced (corrupted) at birth', () => {
    // ── TOWNS: a POWERLESS bound, kept in force, queued for the owner ──────────
    // Re-measured 2026-07-27 at N=400: 9/400 = 2.25% corrupted, sigma 2.97. The 2.5%
    // bound is 10 — ONE count above the measurement, which is 0.34 sigma of power. It
    // is the capture defect in a second costume: it cannot distinguish tuning drift
    // from ordinary corpus variation, and it reds on a single extra corrupted town.
    // Making it a 2-sigma instrument at this rate needs N >= ~14,000 (the sweep is
    // ~75 ms per settlement — over four hours), so raising N is not available. The
    // honest alternatives are BOTH the owner's: accept a powerless bound, or loosen it
    // to the derived 20 (5.0%, alpha 1e-3, 3.71 sigma). Program law forbids an agent
    // loosening a bound, so 10 STAYS and the loosening is filed, not taken.
    // Deliberately NOT registered in the envelope manifest: the registry refuses a
    // sub-2-sigma bound, and papering over that with a registration would be the lie.
    expect(countAtLeast(ordinaryTowns, 'corrupted')).toBeLessThanOrEqual(Math.round(N * 0.025));
    // ── CITIES: derived ───────────────────────────────────────────────────────
    const cityCorrupted = envelope('capture.ordinaryCity.corrupted');
    expect(
      countAtLeast(ordinaryCities, 'corrupted'),
      `ordinary cities corrupted: bound ${cityCorrupted.bound} derived from a measured `
      + `${cityCorrupted.baseRate} at N=${cityCorrupted.baseMeasurementN} `
      + `(${cityCorrupted.margin} sigma). A red means the city rate moved.`,
    ).toBeLessThanOrEqual(cityCorrupted.bound);
    // ── VILLAGES: degenerate, not derivable ───────────────────────────────────
    // 0/400 villages read corrupted. A binomial envelope at baseRate 0 derives a bound
    // of 1, which would assert far more certainty than 400 samples can buy: with zero
    // observed events the rule of three puts the plausible ceiling at 3 per 400. The
    // authored 2.5% ceiling stays, un-derived and labelled.
    expect(countAtLeast(ordinaryVillages, 'corrupted')).toBeLessThanOrEqual(Math.round(N * 0.025));
  });

  it('ordinary settlements never read full capture at birth', () => {
    expect(countAtLeast(ordinaryTowns, 'capture')).toBe(0);
    expect(countAtLeast(ordinaryCities, 'capture')).toBe(0);
    expect(countAtLeast(ordinaryVillages, 'capture')).toBe(0);
  });

  it('ordinary villages are overwhelmingly clean', () => {
    // Degenerate, not derivable: 400/400 ordinary villages read 'none'. baseRate 1.0
    // gives sigma 0 and an envelope of 399 — a certainty the sample cannot license.
    // The authored "at most two dirty villages" floor stays, un-derived and labelled.
    expect(ordinaryVillages.filter(s => capOf(s) === 'none').length).toBeGreaterThanOrEqual(N - 2);
  });

  it('overwhelming criminal presence reads contested/influenced at birth', () => {
    // Contested (equilibrium) or worse is the NORM for a 90-criminal-priority
    // settlement — the dossier must not call it clean.
    // TOWNS: degenerate, not derivable — 400/400 read equilibrium+. The authored 50%
    // floor stays (baseRate 1.0 has no envelope; see the villages note above).
    expect(countAtLeast(criminalTowns, 'equilibrium')).toBeGreaterThanOrEqual(Math.round(N * 0.5));
    // CITIES: derived. 397/400 read equilibrium+, so the authored 50% floor sat 114
    // sigma below the mean — it could not have reddened on anything short of the
    // mechanism being deleted.
    const cityEquilibrium = envelope('capture.criminalCity.equilibrium');
    expect(
      countAtLeast(criminalCities, 'equilibrium'),
      `criminal cities at equilibrium+: floor ${cityEquilibrium.bound} derived from a `
      + `measured ${cityEquilibrium.baseRate} (${cityEquilibrium.margin} sigma).`,
    ).toBeGreaterThanOrEqual(cityEquilibrium.bound);
    // Influenced (corrupted) is reachable at birth. These stay bare existence checks
    // on purpose: an anti-vacuity floor is not a distribution envelope.
    expect(countAtLeast(criminalTowns, 'corrupted')).toBeGreaterThanOrEqual(1);
    expect(countAtLeast(criminalCities, 'corrupted')).toBeGreaterThanOrEqual(1);
  });

  it('full capture stays extraordinary even at the criminal extreme', () => {
    // THE TRIGGER BOUND. Measured at N=400 under final-economy legitimacy: towns
    // 27/400 (6.75%), cities 15/400 (3.75%). The authored ceiling was one expression —
    // Math.round(N * 0.1) = 40 — used for BOTH tiers, which is how the city bound came
    // to sit 6.6 sigma out while the town bound sat at 2.59. They are separate
    // instruments now because they measure separate rates.
    const townCapture = envelope('capture.criminalTown.capture');
    expect(
      countAtLeast(criminalTowns, 'capture'),
      `criminal towns at full capture: ceiling ${townCapture.bound} against a measured `
      + `${townCapture.baseRate} (${townCapture.margin} sigma). This bound is KEPT, not `
      + `derived: the alpha-1e-3 envelope is looser (45) and program law forbids `
      + `loosening — see loosenPending in the manifest entry.`,
    ).toBeLessThanOrEqual(townCapture.bound);
    const cityCapture = envelope('capture.criminalCity.capture');
    expect(
      countAtLeast(criminalCities, 'capture'),
      `criminal cities at full capture: ceiling ${cityCapture.bound} derived from a `
      + `measured ${cityCapture.baseRate} (${cityCapture.margin} sigma).`,
    ).toBeLessThanOrEqual(cityCapture.bound);
  });

  it('an equilibrium+ birth stamps the rung onto the governing faction (the play-time seed)', () => {
    const all = [...ordinaryTowns, ...ordinaryCities, ...ordinaryVillages, ...criminalTowns, ...criminalCities];
    let stamped = 0;
    for (const s of all) {
      const govEntry = (s.powerStructure?.factions || []).find(f => f.isGoverning);
      if (rungOf(s) >= LADDER.indexOf('equilibrium')) {
        expect(govEntry?.captureState).toBe(capOf(s));
        stamped += 1;
      } else {
        // none/adversarial births do NOT seed a capture arc.
        expect(govEntry?.captureState).toBeUndefined();
      }
    }
    // Anti-vacuity: the criminal-heavy sweeps guarantee stamped births exist.
    expect(stamped).toBeGreaterThan(0);
  });
});
