/**
 * CENSUS-4g (R-AX, the chair's ruling of 2026-11-05 08:3x): the criminal secrets are keyed by their
 * HOLDER's role class; the mechanism lane keyed the draw (CENSUS-1i unit 3, `factionLeaderSecret.js`).
 *
 * Pins: (1) the flat view (the unkeyed reading and the census export; since CENSUS-1i unit 3 the draw
 * reads the keyed view instead — the pin re-keyed by that cause, its bytes unchanged) is byte-identical
 * to the table before R-AX (its sha-256, taken at `8c55289`); (2) the clerical and soldierly rows sit under their role and the
 * rest are role-free; (3) a clergy holder's religious pool and a soldier's military pool are the
 * flat pools themselves (keying moves only a mismatched holder); (4) a row carries only its two
 * printed fields, so the record (`npc.secret = { what, stakes }`) cannot pick up the key.
 */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  CRIMINAL_SECRET_LEGACY_ORDER,
  NPC_CRIMINAL_SECRETS,
  NPC_CRIMINAL_SECRETS_BY_HOLDER,
  criminalSecretsForHolder,
} from '../../src/data/npcData.js';
import { classOfRole } from '../../src/domain/roles/roleClass.js';

// STYLE-2 SW-7 (STYLE-RULINGS-2 B10(b), 2026-11-09): re-keyed by cause — two secrets name no neighbour the
// realm may not hold ("in another settlement" → "elsewhere"; "to a rival settlement" → "to outsiders who pay
// for it"); the table's shape and order unchanged. Was 4b3d62d6455f7f1958caf0807b615479d0b3795a002aaebb0ef68f23f7f845c0.
const BASE_SHA = 'ba46807b06ed2cc08e0f8a40f635e2884366272a552ac616bfb0f11937f9bedd';
const secretsOf = (/** @type {Array<{secret: string}>} */ rows) => rows.map((r) => r.secret);

describe('NPC_CRIMINAL_SECRETS keyed by the holder (R-AX)', () => {
  it('the flat view (no longer the draw\'s reading: CENSUS-1i unit 3) is byte-identical to the table before the key', () => {
    expect(createHash('sha256').update(JSON.stringify(NPC_CRIMINAL_SECRETS)).digest('hex')).toBe(BASE_SHA);
  });

  it('the clerical secrets sit under clergy, the soldierly under military, the rest are role-free', () => {
    expect(Object.keys(NPC_CRIMINAL_SECRETS_BY_HOLDER)).toEqual(['any', 'clergy', 'military']);
    expect(secretsOf(NPC_CRIMINAL_SECRETS_BY_HOLDER.clergy.religious)).toEqual([
      "Lost their faith completely but maintains the role. It's just a job now",
      "Has been covering for a colleague's heretical activities out of personal loyalty",
      'Has been systematically falsifying miracle reports for decades',
      'Knows their religious order was founded on a historical lie',
      "Possesses a relic that was officially declared destroyed, and kept it because they couldn't face destroying something real",
    ]);
    expect(secretsOf(NPC_CRIMINAL_SECRETS_BY_HOLDER.any.religious)).toEqual([
      'Secretly receives what they believe are genuine divine visions, which terrifies them',
    ]);
    expect(secretsOf(NPC_CRIMINAL_SECRETS_BY_HOLDER.military.military)).toEqual([
      'Gave an order during a battle that caused friendly casualties. It was covered up as enemy action',
      'Has been selling patrol routes and schedules to someone outside the settlement',
      'Has been skimming from military supply budgets for years through a trusted subordinate',
      'Was ordered to commit an atrocity and complied, and has since risen in the organisation that ordered it',
    ]);
    expect(secretsOf(NPC_CRIMINAL_SECRETS_BY_HOLDER.any.military)).toEqual([
      'Was captured and released under terms they have never disclosed',
      'Knows that the decisive victory everyone celebrates was won through treachery, not skill',
    ]);
    // Only the two keyed types have role rows; every role key is a role class the reader produces.
    expect(Object.keys(CRIMINAL_SECRET_LEGACY_ORDER).sort()).toEqual(['military', 'religious']);
    expect(classOfRole('High Priestess')).toBe('clergy');
    expect(classOfRole('Watch Captain')).toBe('military');
  });

  it('keying moves only a mismatched holder: the matching holder reads the flat pool itself', () => {
    expect(criminalSecretsForHolder('religious', 'clergy')).toEqual(NPC_CRIMINAL_SECRETS.religious);
    expect(criminalSecretsForHolder('military', 'military')).toEqual(NPC_CRIMINAL_SECRETS.military);
    expect(criminalSecretsForHolder('personal', 'trade')).toEqual(NPC_CRIMINAL_SECRETS.personal);
    expect(secretsOf(criminalSecretsForHolder('religious', 'military'))).toEqual(secretsOf(NPC_CRIMINAL_SECRETS_BY_HOLDER.any.religious));
    expect(secretsOf(criminalSecretsForHolder('military', 'clergy'))).toEqual(secretsOf(NPC_CRIMINAL_SECRETS_BY_HOLDER.any.military));
  });

  it('a row carries only its printed fields (the key never reaches the record)', () => {
    for (const group of Object.values(NPC_CRIMINAL_SECRETS_BY_HOLDER)) {
      for (const rows of Object.values(group)) {
        for (const row of rows) expect(Object.keys(row).sort()).toEqual(['secret', 'stakes']);
      }
    }
  });
});
