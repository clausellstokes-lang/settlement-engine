/**
 * infoLitDarkDifferential.test.js — FP IN-6 U4, THE LIT/DARK DIFFERENTIAL INSTRUMENT
 * (scripts/audit/info-lit-dark-differential.mjs; DESIGN_FP_INFORMATION.md §5 IN-6; the
 * certification row that asks for the paired run by name, subsystemRowsRegen.js).
 *
 * WHAT IS PINNED.
 *   THE FOLD      the receipts that differ, by kind: identical feeds answer [], a moved kind
 *                 answers both counts, codepoint order; the receipt kind is the impact kind.
 *   THE VERDICTS  all five are reachable, and a part with a holding arm is ARM_TABLE_REFUTED.
 *   THE ARMS      every arm is EXECUTED against a world, never only quoted: the belief gate, the
 *                 statecraft head, the route lifecycle and the missing genesis, the mirror's
 *                 display-only read. The table is closed over the four IN flags.
 *   THE TWINS     composed twice from scratch, they are byte-identical at tick 0 with the key set
 *                 aside (and a different realm is not), so a later part is the key's.
 *   THE ENGINE    one real year: the race is HELD_DARK by its named arms with no receipt moved;
 *                 the positive control (the statecraft head itself as the key) is ALIVE, so the
 *                 instrument can see life and a HELD_DARK reading is not blindness.
 *   THE FILE      the CLI writes its receipt to --out and prints nothing.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  INFO_FLAG_HOLDING_ARMS,
  INFO_FLAG_KEYS,
  INFO_FLAG_LIT2_NOTES,
  INFO_LIT_DARK_INSTRUMENT,
  INFO_LIT_DARK_VERDICTS,
  composeTwin,
  heldDarkBy,
  measureKey,
  newsByKindDiff,
  receiptKindOf,
  tickZeroHash,
  verdictOf,
} from '../../scripts/audit/info-lit-dark-differential.mjs';
import { READER_CORPUS_ROSTER } from '../../scripts/review/readerCorpus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ENGINE_TIMEOUT = 180_000;
const row = READER_CORPUS_ROSTER.find((r) => r.campaignId === 'rr-fresh-dramatic');
/** One dark advance shared by every real-engine arm below (the instrument's own cache idiom). */
const darkCache = new Map();

const year = (entries) => ({ rawWizardNewsEntries: entries });
const entry = (kind, impactKind) => ({ kind, ...(impactKind ? { impactKind } : {}) });

describe('THE FOLD — the receipts that differ, by kind', () => {
  test('identical feeds answer nothing; a moved kind answers both counts in codepoint order', () => {
    const dark = [year([entry('applied', 'war_declared'), entry('queued')]), year([entry('applied', 'lure_sprung')])];
    expect(newsByKindDiff(dark, dark)).toEqual([]);
    const lit = [year([entry('applied', 'war_declared'), entry('queued')]), year([entry('applied', 'lure_sprung'), entry('applied', 'lure_sprung'), entry('applied', 'infowar_lie_exposed')])];
    expect(newsByKindDiff(dark, lit)).toEqual([
      { kind: 'infowar_lie_exposed', dark: 0, lit: 1 },
      { kind: 'lure_sprung', dark: 1, lit: 2 },
    ]);
  });

  test('the receipt kind is the impact kind when present, else the kind', () => {
    expect(receiptKindOf(entry('applied', 'sweep_launched'))).toBe('sweep_launched');
    expect(receiptKindOf(entry('season_marker'))).toBe('season_marker');
    expect(receiptKindOf(null)).toBe('unknown');
  });
});

describe('THE VERDICTS — every one reachable, and a stale arm table is caught', () => {
  test('the five verdicts', () => {
    const arm = [{ arm: 'x' }];
    const reached = [
      verdictOf({ tickZeroIdentical: true, differs: true, heldBy: [] }),
      verdictOf({ tickZeroIdentical: true, differs: true, heldBy: arm }),
      verdictOf({ tickZeroIdentical: true, differs: false, heldBy: arm }),
      verdictOf({ tickZeroIdentical: true, differs: false, heldBy: [] }),
      verdictOf({ tickZeroIdentical: false, differs: false, heldBy: [] }),
    ];
    expect(reached).toEqual(['ALIVE', 'ARM_TABLE_REFUTED', 'HELD_DARK', 'LIT_QUIET', 'TWINS_NOT_IDENTICAL']);
    expect([...reached].sort()).toEqual([...INFO_LIT_DARK_VERDICTS]);
  });
});

describe('THE ARMS — executed against a world, closed over the four IN flags', () => {
  const world = (rules, extra = {}) => ({ spatialCanonVersion: 1, simulationRules: rules, ...extra });

  test('the table and the LIT-2 notes cover exactly the four IN flags', () => {
    expect(Object.keys(INFO_FLAG_HOLDING_ARMS).sort()).toEqual([...INFO_FLAG_KEYS]);
    expect(Object.keys(INFO_FLAG_LIT2_NOTES).sort()).toEqual([...INFO_FLAG_KEYS]);
    for (const key of INFO_FLAG_KEYS) expect(INFO_FLAG_HOLDING_ARMS[key].length, key).toBeGreaterThan(0);
  });

  test('the lure and the counter-game are held by the statecraft head until it is lit, and by the belief gate under omniscience', () => {
    for (const key of ['infoLureEnabled', 'counterIntelEnabled']) {
      const lit = { [key]: true, infoMode: 'perfect_delayed' };
      expect(heldDarkBy(key, world(lit)).map((a) => a.arm)).toEqual([INFO_FLAG_HOLDING_ARMS[key][1].arm]);
      expect(heldDarkBy(key, world({ ...lit, infoStatecraftEnabled: true }))).toEqual([]);
      expect(heldDarkBy(key, world({ ...lit, infoMode: 'omniscient', infoStatecraftEnabled: true })).map((a) => a.arm))
        .toEqual([INFO_FLAG_HOLDING_ARMS[key][0].arm, INFO_FLAG_HOLDING_ARMS[key][1].arm]);
    }
  });

  test('the race is held by the route lifecycle, then by the missing genesis; the mirror is display-only always', () => {
    const [lifecycle, genesis] = INFO_FLAG_HOLDING_ARMS.reputationRaceEnabled;
    expect(heldDarkBy('reputationRaceEnabled', world({ reputationRaceEnabled: true })).map((a) => a.arm)).toEqual([lifecycle.arm, genesis.arm]);
    expect(heldDarkBy('reputationRaceEnabled', world({ reputationRaceEnabled: true, routeLifecycleEnabled: true })).map((a) => a.arm)).toEqual([genesis.arm]);
    expect(heldDarkBy('secondOrderBeliefEnabled', world({ secondOrderBeliefEnabled: true })))
      .toHaveLength(1);
    // anchored: a key with no table row is graded on its receipts alone
    expect(heldDarkBy('infoStatecraftEnabled', world({}))).toEqual([]);
  });
});

describe('THE TWINS — byte-identical at tick 0 with the key set aside', () => {
  test('two independent compositions agree, the lit rules carry the key strictly, and the pin can fail', () => {
    const dark = composeTwin({ row, key: 'infoLureEnabled', lit: false });
    const lit = composeTwin({ row, key: 'infoLureEnabled', lit: true });
    expect(lit.campaign.worldState.simulationRules.infoLureEnabled).toBe(true);
    expect('infoLureEnabled' in dark.campaign.worldState.simulationRules).toBe(false);
    expect(tickZeroHash(dark, 'infoLureEnabled')).toBe(tickZeroHash(lit, 'infoLureEnabled'));
    // guard-the-guard: another realm hashes differently, so equality above is a measurement
    const other = composeTwin({ row: READER_CORPUS_ROSTER.find((r) => r.campaignId === 'rr-fresh-full'), key: 'infoLureEnabled', lit: false });
    expect(tickZeroHash(other, 'infoLureEnabled')).not.toBe(tickZeroHash(dark, 'infoLureEnabled'));
  });

  test('a released key is lit in both twins', () => {
    const dark = composeTwin({ row, key: 'infoLureEnabled', lit: false, release: ['infoStatecraftEnabled'] });
    const lit = composeTwin({ row, key: 'infoLureEnabled', lit: true, release: ['infoStatecraftEnabled'] });
    expect(dark.campaign.worldState.simulationRules.infoStatecraftEnabled).toBe(true);
    expect(lit.campaign.worldState.simulationRules.infoStatecraftEnabled).toBe(true);
  });
});

describe('THE ENGINE — one real year through the reader corpus loop', () => {
  test('the race is HELD_DARK by its named arms, and not one receipt moves', async () => {
    const r = await measureKey({ row, key: 'reputationRaceEnabled', years: 1, darkCache });
    expect(r.tickZero.identical).toBe(true);
    expect(r.verdict).toBe('HELD_DARK');
    expect(r.heldDarkBy.map((a) => a.arm)).toEqual(INFO_FLAG_HOLDING_ARMS.reputationRaceEnabled.map((a) => a.arm));
    expect(r.newsByKind).toEqual([]);
    expect(r.yearsParted).toBe(0);
    expect(r.newsTotals.lit).toBe(r.newsTotals.dark);
    expect(r.divergenceSeries).toHaveLength(1);
  }, ENGINE_TIMEOUT);

  test('THE POSITIVE CONTROL: the statecraft head as the key is ALIVE, so HELD_DARK is not blindness', async () => {
    const r = await measureKey({ row, key: 'infoStatecraftEnabled', years: 1, darkCache });
    expect(r.tickZero.identical).toBe(true);
    expect(r.verdict).toBe('ALIVE');
    expect(r.yearsParted).toBe(1);
    expect(r.newsByKind.length).toBeGreaterThan(0);
    for (const row2 of r.newsByKind) expect(row2.dark).not.toBe(row2.lit);
  }, ENGINE_TIMEOUT);
});

describe('THE FILE — the instrument writes its receipt and never the console', () => {
  test('the CLI writes --out and prints nothing', () => {
    const dir = mkdtempSync(join(tmpdir(), 'info-lit-dark-'));
    try {
      const out = join(dir, 'receipt.json');
      const stdout = execFileSync('node', [
        join(ROOT, 'scripts/audit/info-lit-dark-differential.mjs'),
        '--out', out, '--years', '1', '--keys', 'secondOrderBeliefEnabled',
      ], { cwd: ROOT, encoding: 'utf8' });
      expect(stdout).toBe('');
      const receipt = JSON.parse(readFileSync(out, 'utf8'));
      expect(receipt.instrument).toBe(INFO_LIT_DARK_INSTRUMENT);
      expect(receipt.row).toBe('rr-fresh-dramatic');
      expect(receipt.keys.map((k) => k.key)).toEqual(['secondOrderBeliefEnabled']);
      expect(receipt.keys[0].verdict).toBe('HELD_DARK');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, ENGINE_TIMEOUT);
});
