/**
 * safetySeverity.test.js — cycle-3 Wave 2, M2 pin.
 *
 * THE BUG (M2). DefenseTab and OverviewTab each hand-rolled a substring classifier
 * over the safetyProfile.js label to pick the crisis colour, and BOTH omitted the
 * 'Strained' prefix — the middle stress tier (safetyRatio >= 1) — so common
 * 'Strained — …' labels fell to a quiet neutral colour, reading as calm. The two
 * classifiers also disagreed with each other.
 *
 * THE FIX. One TOTAL chokepoint (src/domain/display/safetySeverity.js): every
 * producer leading token maps to a canonical tier + colour, with a LOUD 'unknown'
 * fallback no producer label may reach. This pin asserts the Strained symptom is
 * closed, the byte-identical preservation of DefenseTab's historical colours, and
 * totality over a representative sweep of the producer's emitted labels.
 */
import { describe, it, expect } from 'vitest';
import { safetySeverityOf } from '../../src/domain/display/safetySeverity.js';

describe('M2 — safety-severity classification', () => {
  it('"Strained" now classifies as unsafe (the exact M2 symptom — was neutral)', () => {
    const s = safetySeverityOf('Strained — Famine Conditions');
    expect(s.key).toBe('unsafe');
    expect(s.color).toBe('#8a4010'); // NOT the old neutral #a0762a
  });

  it('the previously-dropped tokens all classify (Strained/Critical/Quarantined/Restricted)', () => {
    expect(safetySeverityOf('Strained — Wartime').key).toBe('unsafe');
    expect(safetySeverityOf('Critical — Slave Revolt').key).toBe('dangerous');
    expect(safetySeverityOf('Quarantined — Plague Conditions').key).toBe('controlled');
    expect(safetySeverityOf('Restricted — Plague Conditions').key).toBe('controlled');
  });

  it('preserves DefenseTab\'s historical tier colours byte-for-byte', () => {
    expect(safetySeverityOf('Dangerous')).toEqual({ key: 'dangerous', color: '#8b1a1a', bg: '#fdf4f4' });
    expect(safetySeverityOf('Unsafe')).toEqual({ key: 'unsafe', color: '#8a4010', bg: '#fdf0e8' });
    expect(safetySeverityOf('Controlled — Occupation Curfew')).toEqual({ key: 'controlled', color: '#5a2a6b', bg: '#f8f0fc' });
    expect(safetySeverityOf('Moderate')).toEqual({ key: 'stable', color: '#1a5a28', bg: '#f0faf4' });
  });

  it('"Unsafe" resolves to unsafe, NOT stable (the safe/unsafe substring trap)', () => {
    expect(safetySeverityOf('Unsafe').key).toBe('unsafe');
    expect(safetySeverityOf('Unsafe — Famine Conditions').key).toBe('unsafe');
    expect(safetySeverityOf('Very Safe').key).toBe('stable');
  });

  it('TOTALITY: no representative producer label reaches the loud unknown fallback', () => {
    // A representative sweep of every leading token safetyProfile.js emits.
    const producerLabels = [
      'Very Safe', 'Safe', 'Moderate', 'Unsafe', 'Dangerous',
      'Controlled — Occupation Curfew', 'Controlled — Authoritarian', 'Dangerous — Criminal Governance',
      'Tense — Active Siege', 'Strained — Active Siege', 'Desperate — Active Siege',
      'Strained — Famine Conditions', 'Unsafe — Famine Conditions', 'Dangerous — Famine Conditions',
      'Quarantined — Plague Conditions', 'Restricted — Plague Conditions', 'Dangerous — Plague Unrest',
      'Tense — Insurgency', 'Strained — Insurgency', 'Dangerous — Insurgency',
      'Tense — Slave Revolt', 'Dangerous — Slave Revolt', 'Critical — Slave Revolt',
      'Strained — Wartime', 'Tense — Wartime',
      'Tense — Political Fracture', 'Strained — Political Fracture', 'Volatile — Political Fracture',
      'Tense — Succession Crisis', 'Strained — Succession Crisis', 'Volatile — Succession Crisis',
      'Tense — Aftermath of Betrayal', 'Strained — Aftermath of Betrayal', 'Suspicious — Aftermath of Betrayal',
      'Tense — Monster Threat', 'Strained — Monster Threat', 'Dangerous — Monster Threat',
      'Strained — Debt Crisis', 'Tense — Debt Crisis',
      'Strained — Mass Migration', 'Tense — Mass Migration',
      'Tense — Religious Upheaval', 'Strained — Religious Upheaval', 'Suspicious — Religious Upheaval',
    ];
    const unknown = producerLabels.filter((l) => safetySeverityOf(l).key === 'unknown');
    expect(unknown, `producer labels that hit the loud fallback: ${unknown.join(', ')}`).toEqual([]);
  });

  it('a genuinely-unknown string hits the LOUD fallback (not a quiet neutral)', () => {
    const s = safetySeverityOf('Bananas — Nonsense');
    expect(s.key).toBe('unknown');
    expect(s.color).toBe('#a0762a'); // legible, but flagged unknown for the walker
  });

  it('null/undefined is total-safe (unknown, never a throw)', () => {
    expect(safetySeverityOf(undefined).key).toBe('unknown');
    expect(safetySeverityOf(null).key).toBe('unknown');
  });
});
