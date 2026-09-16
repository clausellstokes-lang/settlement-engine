/**
 * realmJourneyAsset.test.js — the PRESENT-state half of the socket contract.
 *
 * When the owner-supplied master is at the contract path (it landed 2026-07-22),
 * prove it is a real, parseable mp4 with a sane duration. Guarded by runIf so the
 * socket stays DORMANT-SAFE: if the asset is ever absent, this skips green rather
 * than reddening — dormancy is the whole point (the overlay falls back to the
 * current presentation when the file is missing).
 *
 * Runtime condensation fits ANY duration, so this asserts a sane band, not an exact
 * pin (the owner may re-cut). Measured at landing: 15.042 s, ~20 MB, mvhd v0.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const ASSET = resolve(process.cwd(), 'public/videos/realm-journey.mp4');

function mp4DurationSeconds(buf) {
  const idx = buf.indexOf(Buffer.from('mvhd'));
  if (idx < 0) return null;
  const version = buf[idx + 4];
  let timescale;
  let duration;
  if (version === 1) {
    timescale = buf.readUInt32BE(idx + 4 + 1 + 3 + 8 + 8);
    duration = Number(buf.readBigUInt64BE(idx + 4 + 1 + 3 + 8 + 8 + 4));
  } else {
    timescale = buf.readUInt32BE(idx + 4 + 1 + 3 + 4 + 4);
    duration = buf.readUInt32BE(idx + 4 + 1 + 3 + 4 + 4 + 4);
  }
  return timescale > 0 ? duration / timescale : null;
}

describe.runIf(existsSync(ASSET))('realm journey asset — the socket contract (present)', () => {
  it('is a non-trivial mp4 with a parseable, sane duration', () => {
    expect(statSync(ASSET).size).toBeGreaterThan(1_000_000);
    const secs = mp4DurationSeconds(readFileSync(ASSET));
    expect(secs, 'mvhd duration must parse').not.toBeNull();
    expect(secs).toBeGreaterThan(1);
    expect(secs).toBeLessThan(120);
  });
});
