/**
 * momentumCrack.test.js — W-MOMENTUM Stage 4 (partial) PIN BATTERY (design §4/§6).
 *
 * The priced-crack primitives (pure, dormant): the climb-down consequence (credibility +
 * legitimacy spent, once), the face-saving off-ramps that reduce the price WITH a receipt,
 * and the FORCE_RECONSIDERATION verb in registrable shape (force ≡ organic).
 */
import { describe, it, expect } from 'vitest';
import {
  climbDownConsequence,
  faceSavingReliefOf,
  forceReconsiderationVerbFactory,
  FACE_SAVING_EXITS,
  CRACK_TUNING,
} from '../../src/domain/worldPulse/momentum.js';
import { advanceCredibility, CREDIBILITY_TUNING } from '../../src/domain/worldPulse/informationStatecraft.js';

describe('W-MOMENTUM Stage 4 — the priced climb-down', () => {
  it('a plain (unrelieved) climb-down spends credibility AND legitimacy', () => {
    const c = climbDownConsequence({ actorId: 'A', lawfulness01: 0.5, exitKind: '' });
    expect(c.credibilityDelta.kind).toBe('climb_down');
    expect(c.credibilityDelta.id).toBe('A');
    expect(c.credibilityDelta.magnitude01).toBeGreaterThan(0);
    expect(c.legitimacyHit).toBeGreaterThan(0);
    expect(c.price01).toBeGreaterThan(0);
  });

  it('FACE-SAVING reduces the price WITH the receipt (declared_resolution is the loudest save)', () => {
    const plain = climbDownConsequence({ actorId: 'A', exitKind: '' }).price01;
    const declared = climbDownConsequence({ actorId: 'A', exitKind: 'declared_resolution' }).price01;
    const mediated = climbDownConsequence({ actorId: 'A', exitKind: 'mediation' }).price01;
    expect(declared).toBeLessThan(plain);            // "declared victory and went home" is cheap
    expect(mediated).toBeLessThan(plain);
    expect(declared).toBeLessThan(mediated);         // the loudest face-save is the cheapest
    expect(faceSavingReliefOf('declared_resolution')).toBeGreaterThan(faceSavingReliefOf('mediation'));
    expect(faceSavingReliefOf('not_a_real_exit')).toBe(0); // a non-face-save exit ⇒ full price
  });

  it('a LAWFUL court gets the procedural crack (cheaper climb-down than a chaotic one)', () => {
    const lawful = climbDownConsequence({ actorId: 'A', lawfulness01: 1 }).price01;
    const chaotic = climbDownConsequence({ actorId: 'A', lawfulness01: 0 }).price01;
    expect(lawful).toBeLessThan(chaotic);
  });

  it('the price NEVER falls to zero — a reversal is always felt (consequences never censored)', () => {
    // Maximally relieved: lawful + the loudest face-save.
    const c = climbDownConsequence({ actorId: 'A', lawfulness01: 1, exitKind: 'declared_resolution' });
    expect(c.price01).toBeGreaterThan(0);
    expect(c.credibilityDelta.magnitude01).toBeGreaterThan(0);
    expect(c.legitimacyHit).toBeGreaterThan(0);
    expect(Object.keys(FACE_SAVING_EXITS).length).toBeGreaterThan(0);
    expect(CRACK_TUNING.CLIMB_DOWN_MAGNITUDE).toBeGreaterThan(0);
  });
});

describe('W-MOMENTUM Stage 4 — the climb_down credibility delta kind (union extension)', () => {
  const LIT = { spatialCanonVersion: 1, simulationRules: { infoMode: 'unreliable', infoStatecraftEnabled: true }, spatialLedgers: {} };

  it('a climb_down delta folds as a credibility COST (priced ONCE), less sharply than an exposed lie', () => {
    const climb = advanceCredibility({ worldState: LIT, tick: 0, deltas: [{ id: 'A', kind: 'climb_down', magnitude01: 1 }] });
    const lie = advanceCredibility({ worldState: LIT, tick: 0, deltas: [{ id: 'A', kind: 'deception', magnitude01: 1 }] });
    const climbScore = /** @type {any} */ (climb.worldState).spatialLedgers.credibility.A.score;
    const lieScore = /** @type {any} */ (lie.worldState).spatialLedgers.credibility.A.score;
    expect(climbScore).toBeLessThan(0);                 // a cost
    expect(climbScore).toBe(-CREDIBILITY_TUNING.CLIMB_DOWN_FALL); // priced at the climb-down scale, once
    expect(climbScore).toBeGreaterThan(lieScore);       // less sharp than an exposed lie
  });

  it('the union stays CLOSED: an unknown kind is still filtered out (byte-neutral)', () => {
    const r = advanceCredibility({ worldState: LIT, tick: 0, deltas: [{ id: 'A', kind: /** @type {any} */ ('nonsense'), magnitude01: 1 }] });
    expect(r.changed).toBe(false);
  });
});

describe('W-MOMENTUM Stage 4 — FORCE_RECONSIDERATION (registrable shape, force ≡ organic)', () => {
  it('ships REGISTERED (the W-COMPOSER-2 lift landed), with its realm-manifest entry', async () => {
    const v = forceReconsiderationVerbFactory();
    expect(v.verb).toBe('FORCE_RECONSIDERATION');
    expect(v.registered).toBe(true);
    expect(v.dials).toHaveProperty('pressure'); // the dial is the pressure magnitude
    expect(Object.isFrozen(v)).toBe(true);
    const { realmVerbFor } = await import('../../src/domain/events/realmManifest.js');
    expect(realmVerbFor('FORCE_RECONSIDERATION')?.candidateType).toBe(v.candidateType);
  });
});
