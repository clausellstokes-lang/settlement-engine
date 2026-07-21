/**
 * tests/docs/opsScriptsExist.test.js — SB5: the self-keeping machinery exists.
 *
 * The operability layer's alarm/probe/drill scripts have NO importers — nothing
 * in the code graph references them, so a future "remove unused scripts"
 * cleanup could delete the ops layer with every gate green. Sibling surfaces
 * ARE guarded (deployRunbookFreshness, statusPageSelfContained); this census
 * extends the same protection to the scripts themselves: existence plus
 * non-triviality (a stubbed-out husk also reds).
 *
 * Deliberately NOT asserted: that anything SCHEDULES these (cron, an external
 * monitor polling the health endpoint). That wiring lives outside the repo and
 * is the owner's infrastructure call — flagged in the SB5 report, not fakeable
 * by a repo test.
 */
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// The census: the operability scripts the repo's runbooks and bar-15 posture
// lean on. Adding an ops script? Add it here so deletion reds.
const OPS_SCRIPTS = [
  'scripts/ops/uptime-probe.mjs',
  'scripts/ai-spend-alarm.mjs',
  'scripts/backup-restore-drill.mjs',
  'scripts/load-test.mjs',
];

describe('ops scripts census (SB5 — bar 15 self-keeping)', () => {
  for (const rel of OPS_SCRIPTS) {
    test(`${rel} exists and is non-trivial`, () => {
      let stat = null;
      try { stat = statSync(join(ROOT, rel)); } catch { /* fall through to the assert */ }
      expect(stat, `${rel} is missing — the ops layer has no importers, so only this census notices deletion`).not.toBeNull();
      expect(stat.size, `${rel} looks stubbed out (${stat?.size} bytes)`).toBeGreaterThan(400);
    });
  }
});
