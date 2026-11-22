/**
 * visionKCohesionLaw.test.js — V-22/V-23 (Vision lane V-K) THE COHESION LAW, made structural.
 *
 * The owner's demand: neither THE ASSIZE nor THE COMMONS' VOICE invents a new effect vocabulary
 * or a new writer. Both are CONSUMERS + REFRAMERS; every consequence routes through an EXISTING
 * writer. This is the §11 "no new writers" grep, standing as a gate so the law cannot quietly
 * erode: the two kernels must (1) route consequences ONLY through the sanctioned writers, and
 * (2) NEVER drain the shared exposure deposits or write NPC reputation / stressor births directly.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const assize = readFileSync(resolve(ROOT, 'src/domain/worldPulse/assizeKernel.js'), 'utf8');
const commons = readFileSync(resolve(ROOT, 'src/domain/worldPulse/commonsVoiceKernel.js'), 'utf8');
const both = `${assize}\n${commons}`;

// LIVENESS ANCHOR for every `not.toMatch` below: the two kernels are read off disk, so a
// rename or a decomposition would leave `both` empty and every exclusion would pass for
// the wrong reason. Pin a substring each kernel must carry as long as it exists at all.
const KERNEL_LIVENESS = /adjustStressorSeverityById\(/g;

describe('V-K cohesion law (§11 no-new-writers)', () => {
  it('the scanned corpus is live (both kernels read, non-empty, and recognisably themselves)', () => {
    expect(assize.length, 'assizeKernel.js read as empty').toBeGreaterThan(1000);
    expect(commons.length, 'commonsVoiceKernel.js read as empty').toBeGreaterThan(1000);
    // One hit per kernel — the exclusion tests below scan the CONCATENATION, so both
    // halves must be present or an exclusion could be true of only one file.
    expect([...both.matchAll(KERNEL_LIVENESS)]).toHaveLength(2);
  });

  it('the assize routes person/masses consequences ONLY through the sanctioned existing writers', () => {
    // fines ⇒ the generosity ledger's OWN writer; rank ⇒ factionPairLedger's OWN writer;
    // masses unrest ⇒ the stressor machinery's writer; legitimacy ⇒ the applicator idiom.
    expect(assize).toMatch(/foldObligations\(/);
    expect(assize).toMatch(/mintFactionPairIncident\(/);
    expect(assize).toMatch(/adjustStressorSeverityById\(/);
    expect(assize).toMatch(/applyLegitimacySteps\(/);
  });

  it('the commons routes influence ONLY through the legitimacy applicator + the stressor writer', () => {
    expect(commons).toMatch(/applyLegitimacySteps\(/);
    expect(commons).toMatch(/adjustStressorSeverityById\(/);
  });

  it('NEITHER kernel DRAINS a shared exposure deposit (they read them non-destructively)', () => {
    // No write/drop of the exposure ledgers war-reasons + the ladder's stigma + the covert beat
    // all still read — the assize is a freshness-gated NON-destructive consumer.
    for (const key of ['exposedCorruption', 'npcCredibility', 'bluffExposures', 'disinfo']) {
      // anchored: the corpus-liveness test above pins both kernels non-empty and present
      expect(both, `must not setSpatialLedger('${key}', …)`).not.toMatch(new RegExp(`setSpatialLedger\\([^,]+,\\s*['"]${key}['"]`));
      // anchored: same corpus-liveness pin
      expect(both, `must not dropSpatialLedger('${key}', …)`).not.toMatch(new RegExp(`dropSpatialLedger\\([^,]+,\\s*['"]${key}['"]`));
    }
  });

  it('NEITHER kernel writes NPC reputation directly (stigma rides the ladder; no double-charge)', () => {
    // The ladder owns stigma/lieExposure/timesExposed/ousted — the assize never assigns them.
    for (const field of ['stigma', 'lieExposure', 'timesExposed', 'ousted', 'corrupt']) {
      // anchored: the corpus-liveness test above pins both kernels non-empty and present
      expect(both, `must not assign npc.${field}`).not.toMatch(new RegExp(`\\.${field}\\s*=[^=]`));
    }
  });

  it('NEITHER kernel BIRTHS a stressor (they only nudge existing crowd-mood scalars)', () => {
    // No stressor-birth machinery: the commons/assize influence routes into EXISTING stressors.
    // anchored: the corpus-liveness test above pins both kernels non-empty and present
    expect(both).not.toMatch(/STRESSOR_CATALOG|birthStressor|makeStressor|addStressor\(/);
  });

  it('the only NEW spatial-ledger key either kernel writes is commonsVoice (the crowd-action state)', () => {
    // The assize writes obligations (existing, via foldObligations) + reads only; the commons owns
    // exactly one new sidecar. Any setSpatialLedger literal key must be commonsVoice or obligations.
    const writes = [...both.matchAll(/setSpatialLedger\([^,]+,\s*['"]([a-zA-Z]+)['"]/g)].map((m) => m[1]);
    const allowed = new Set(['commonsVoice', 'obligations']);
    expect(writes.filter((k) => !allowed.has(k)), `unexpected ledger writes: ${writes}`).toEqual([]);
    expect(writes).toContain('commonsVoice');
  });
});
