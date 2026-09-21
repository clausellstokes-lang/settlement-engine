/** @vitest-environment jsdom */
/**
 * factionLockCoupShield.test.jsx — THE LOCK CONTROLS ARE GONE, AND A STORED LOCK ACTS ON NOTHING.
 *
 * OWNER ORDERS 2026-09-17: "Remove the entire section that says what a new roll keeps and
 * any button associated with that", then "remove the other padlocks". The section was
 * LockControls' `world` scope ("Keep the name", "Keep this ground", "Keep them in power",
 * "Clear all locks"); its `npcs` and `history` scopes were "Keep these people" and "Keep
 * this history"; the roster rows carried a padlock. This file used to pin the seat row end
 * to end (a click wrote the governing faction's name, and worldPulse/coup.js turned a
 * fallen seat into a PROPOSAL). It now pins the removal in the places it could quietly
 * come back:
 *
 *   1. THE COMPONENT — LockControls.jsx no longer exists.
 *   2. THE TREE — no component imports it, mounts a lock scope, calls a lock writer or
 *      prints a retired control's words.
 *   3. THE SIMULATION — a seat lock an old save still carries no longer shields the seat:
 *      the fall applies exactly as it does with no lock at all.
 *
 * (The file keeps its name so the registers that enumerate test files do not churn. The
 * rendered half over a stored lock is pinned in tests/components/npcRowLockToggle.test.jsx.)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, test, expect } from 'vitest';

import { coupVerdictOutcomes } from '../../src/domain/worldPulse/coup.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const GOVERNING = 'Town Council';

describe('every lock control is removed (owner orders 2026-09-17)', () => {
  test('the LockControls component is deleted, beside the dossier directory it lived in', () => {
    // THE ANCHOR: a sibling of the deleted file in the same directory, so a moved or
    // renamed directory cannot pass the absence.
    expect(existsSync(join(ROOT, 'src/components/dossier/PendingChangesBar.jsx'))).toBe(true);
    expect(existsSync(join(ROOT, 'src/components/dossier/LockControls.jsx')), 'LockControls.jsx is back').toBe(false);
  });

  test('no component imports a lock control, mounts a lock scope, calls a lock writer or prints the retired words', () => {
    /** @param {string} dir @param {string[]} out */
    const walk = (dir, out = []) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path, out);
        else if (/\.jsx?$/.test(entry)) out.push(path);
      }
      return out;
    };
    const code = walk(join(ROOT, 'src/components')).map((file) => ({
      rel: relative(ROOT, file),
      // Comments may record the removal; only CODE can mount a control.
      text: readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, ''),
    }));
    const RETIRED = /LockControls|scope=["'](?:world|npcs|history)["']|scope:\s*["']world["']|\bsetLock\b|\bclearLocks\b|What a new roll keeps|Keep these people|Keep this history|Allow rerolls|Lock this person|stays through any new roll|The whole roster is locked/;
    const offenders = code.filter(({ text }) => RETIRED.test(text)).map(({ rel }) => rel);
    // THE ANCHOR: the same scan does see the live Reroll wiring these controls used to
    // wrap, so an empty result is a finding rather than a scan over nothing.
    expect(code.filter(({ text }) => /onRerollNPCs/.test(text)).length,
      'the scan found no Reroll wiring at all, so it proves nothing').toBeGreaterThan(0);
    expect(offenders, 'a component carries a retired lock control again').toEqual([]);
  });
});

describe('a stored seat lock ARMS NOTHING in the simulation', () => {
  test('the coup falls identically with and without the stored lock', () => {
    // The coup fixture tests/domain/rulingPower.test.js drives: a seat in a legitimacy
    // crisis that reliably FALLS under this rng, held by the same 'Town Council'.
    const settlement = {
      name: 'Oakmere',
      tier: 'town',
      powerStructure: {
        governingName: GOVERNING,
        publicLegitimacy: { score: 22, label: 'Legitimacy Crisis', govMultiplier: 0.6, crimMultiplier: 1.3 },
        factions: [
          { faction: GOVERNING, power: 24, category: 'government', isGoverning: true },
          { faction: 'The Garrison', power: 30, category: 'military' },
          { faction: 'Merchant Guilds', power: 26, category: 'economy' },
        ],
        factionRelationships: [],
      },
    };
    const run = (locks) => coupVerdictOutcomes({
      resolved: [{
        id: 'world_stressor.coup_detat.oakmere',
        type: 'coup_detat',
        label: "Coup d'état",
        status: 'resolved',
        severity: 0.4,
        peakSeverity: 0.7,
        originSettlementId: 'oakmere',
        affectedSettlementIds: ['oakmere'],
        originContext: { variant: 'barracks_coup' },
      }],
      snapshot: {
        byId: new Map([['oakmere', {
          name: settlement.name,
          settlement,
          save: { campaignState: { locks } },
          causal: { scores: { ruling_authority: 20 } },
        }]]),
      },
      // 0.5 > pHold → the seat falls; 0.0 → the heaviest challenger takes it.
      rng: (() => { const v = [0.5, 0.0]; let i = 0; return { random: () => v[Math.min(i++, v.length - 1)] }; })(),
      tick: 9,
    });

    const stored = run({ factions: [GOVERNING] });
    const bare = run({});
    // THE ANCHOR: both runs produce a real fall, so the comparison is between live results.
    expect(bare.length).toBeGreaterThan(0);
    expect(bare[0].type).toBe('power_transfer');
    expect(stored[0].applyMode, 'a stored seat lock still turned the fall into a proposal').toBe('auto');
    expect(stored).toEqual(bare);
  });
});
