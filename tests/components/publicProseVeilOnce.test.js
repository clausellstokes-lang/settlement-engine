/**
 * ONE STRIPPED RECORD PER COMPOSE (VEIL-FIX R12, the re-review of 2026-11-10: R2 made the composer draw
 * the stripped record once per audience-gated read — the eight defense lens sites, the governance account
 * and the power desk — so composePublicProse on a large metropolis rose from about 115 ms to 181 ms, on
 * the main thread at every save). The composer builds it ONCE and hands it to the three readers; the
 * readers draw from the record they are handed, and the owner's record is never mutated.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';

const calls = vi.hoisted(() => ({ n: 0 }));
vi.mock('../../src/domain/display/publicSafe.js', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    publicVeiledRecordOf: (...args) => { calls.n += 1; return real.publicVeiledRecordOf(...args); },
  };
});

import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { governanceAccountRead } from '../../src/components/new/powerDeskRead.js';
import { publicVeiledRecordOf } from '../../src/domain/display/publicSafe.js';

beforeAll(async () => { await ensureLaws(); }, 120_000);

describe('R12: the composer strips the record once and the readers draw from what they are handed', () => {
  it('composePublicProse builds the stripped record exactly once per call', () => {
    const owner = birth(15).settlement;
    calls.n = 0;
    composePublicProse(owner);
    expect(calls.n).toBe(1);
  });

  it('the governance reader draws the player view from the stripped record it is handed', () => {
    const owner = birth(15).settlement;
    const handed = publicVeiledRecordOf(owner);
    handed.name = 'Handedtown';
    const text = governanceAccountRead(owner, { playerView: true, veiledRecord: handed }).text;
    expect(text).toContain('Handedtown');
  });

  it("the stripped record leaves the owner's record untouched", () => {
    const owner = birth(15).settlement;
    const before = JSON.stringify(owner);
    const stripped = publicVeiledRecordOf(owner);
    expect(JSON.stringify(owner)).toBe(before);
    expect(stripped.powerStructure).not.toBe(owner.powerStructure);
    expect(owner.powerStructure.criminalCaptureState).toBe('corrupted');
    expect(stripped.powerStructure.criminalCaptureState).toBeUndefined();
  });
});
