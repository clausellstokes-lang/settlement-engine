/**
 * dmScreenView.test.js — V-18 THE DM SCREEN: the player face FAILS CLOSED.
 *
 * The screen's player face reuses the existing player-safe projection, so a
 * covert mark or a DM-private field can never reach the table. The DM face keeps
 * everything. Unknown audience defaults to the safe (player) face.
 */
import { describe, it, expect } from 'vitest';
import { toScreenView, isDmAudience, SCREEN_AUDIENCES } from '../../src/domain/display/dmScreen.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';

function settlementWithSecrets() {
  return {
    name: 'Brackwater', tier: 'town', population: 1500,
    dmNotes: 'the mayor is the BBEG',
    plotHooks: ['the heir is hidden'],
    institutions: [{
      name: 'The Tanners Guild', category: 'Crafts',
      impairments: [
        { type: 'corruption', severity: 'moderate', covert: true, causeEventId: 'evt_capture_9', description: "Aldric's capture quietly compromised The Tanners Guild." },
        { type: 'flood_damage', severity: 'minor', description: 'Spring floods damaged the drying racks.' },
      ],
    }],
    npcs: [{ name: 'Aldric', role: 'Mayor', secret: 'bastard heir', goal: 'seize power' }],
    // A brand-new DM-private field the allowlist has never heard of — must not leak.
    dmScratchpadV99: 'the vault code is 7-7-7',
  };
}

describe('V-18 DM screen audience gate', () => {
  it('SCREEN_AUDIENCES is the closed two-face set', () => {
    expect([...SCREEN_AUDIENCES].sort()).toEqual(['dm', 'player']);
    expect(isDmAudience('dm')).toBe(true);
    expect(isDmAudience('player')).toBe(false);
  });

  it('the player face IS the existing player-safe projection (reuse, not a fork)', () => {
    const s = settlementWithSecrets();
    expect(toScreenView(s, 'player')).toEqual(toPublicSafe(s, { full: false }));
  });

  it('FAILS CLOSED: no secret, covert mark, or unknown DM field reaches the player face', () => {
    const blob = JSON.stringify(toScreenView(settlementWithSecrets(), 'player'));
    for (const leak of ['the mayor is the BBEG', 'the heir is hidden', 'bastard heir', 'seize power',
      'quietly compromised', "Aldric's capture", 'the vault code is 7-7-7']) {
      expect(blob).not.toContain(leak);
    }
  });

  it('an unknown audience defaults to the safe (player) face', () => {
    const s = settlementWithSecrets();
    expect(toScreenView(s, 'spectator')).toEqual(toPublicSafe(s, { full: false }));
    expect(JSON.stringify(toScreenView(s, undefined))).not.toContain('the vault code is 7-7-7');
  });

  it('the DM face keeps everything (the GM may see the secrets)', () => {
    const s = settlementWithSecrets();
    expect(toScreenView(s, 'dm')).toBe(s);
    expect(JSON.stringify(toScreenView(s, 'dm'))).toContain('bastard heir');
  });
});
