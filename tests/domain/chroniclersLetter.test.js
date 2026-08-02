/**
 * chroniclersLetter.test.js — VISION V-2 THE CHRONICLER'S LETTER (+ R-16/R-17).
 *
 * The deterministic composer diffs the news since lastReadTick, groups by the
 * house categories, prioritizes by significance, degrades to a quiet-week grace,
 * lights the R-16 "world deepened" section only on a flag delta vs a recorded
 * baseline, and renders portable text (R-17).
 */
import { describe, it, expect } from 'vitest';
import { composeChroniclersLetter, letterToPlainText, enabledFlagsOf } from '../../src/domain/display/chroniclersLetter.js';
import { projectWizardNewsForAudience } from '../../src/domain/region/wizardNews.js';

const feed = {
  currentTick: 10,
  entries: [
    { id: 'w1', tick: 8, significance: 'major', impactKind: 'conflict_pressure', headline: 'The border burns', summary: 'Levies march.' },
    { id: 'a1', tick: 6, significance: 'notable', impactKind: 'authority_instability', headline: 'The council fractures' },
    { id: 't1', tick: 9, significance: 'notable', impactKind: 'import_shortage', headline: 'Grain runs short' },
    { id: 'm1', tick: 7, significance: 'major', impactKind: 'generosity_relief', headline: 'Aid reaches the starving' },
    { id: 'f1', tick: 5, significance: 'notable', impactKind: 'religious_pressure', headline: 'A new rite spreads' },
    { id: 'old', tick: 3, significance: 'major', impactKind: 'conflict_pressure', headline: 'An old war' },
  ],
};

describe('V-2 — the diff, grouping, and priority', () => {
  const letter = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4 });

  it('diffs only beats newer than lastReadTick', () => {
    expect(letter.sinceTick).toBe(4);
    expect(letter.throughTick).toBe(10);
    expect(letter.counts.total).toBe(5); // the tick-3 'old' beat is excluded
    expect(letter.empty).toBe(false);
  });

  it('routes beats to the house sections', () => {
    const byId = Object.fromEntries(letter.sections.map((s) => [s.id, s.lines.map((l) => l.id)]));
    expect(byId.wars).toEqual(['w1']);
    expect(byId.courts).toEqual(['a1']);
    expect(byId.trade).toEqual(['t1']);
    expect(byId.traditions).toEqual(['f1']);
    expect(byId.mercy).toEqual(['m1']);
    expect(letter.sections.map((s) => s.id)).toEqual(['wars', 'courts', 'trade', 'traditions', 'mercy']); // reading order, no sundry
  });

  it('orders MAJOR before NOTABLE within a section', () => {
    const two = { currentTick: 5, entries: [
      { id: 'n', tick: 4, significance: 'notable', impactKind: 'conflict_pressure', headline: 'A skirmish' },
      { id: 'M', tick: 2, significance: 'major', impactKind: 'conflict_pressure', headline: 'A rout' },
    ] };
    const l = composeChroniclersLetter({ wizardNews: two, lastReadTick: 0 });
    expect(l.sections[0].lines.map((x) => x.id)).toEqual(['M', 'n']); // major first despite lower tick
    expect(l.counts).toEqual({ major: 1, notable: 1, total: 2 });
  });

  it('is deterministic — a second compose is byte-identical', () => {
    expect(JSON.stringify(composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4 }))).toBe(JSON.stringify(letter));
  });

  it('projects legacy climb-down analytics before composing or exporting the letter', () => {
    const momentum = {
      currentTick: 7,
      entries: [{
        id: 'momentum', tick: 7, significance: 'major', impactKind: 'conflict_pressure',
        kind: 'momentum_climb_down', headline: 'Aldermoor abandons the war',
        summary: 'Commitment 3.2× its cliff; price 0.62.',
      }],
    };
    const projected = composeChroniclersLetter({ wizardNews: momentum, lastReadTick: 0 });
    const line = projected.sections.flatMap(section => section.lines)[0];
    expect(line.summary).toBe('The court held to the war too long; reversing course carried a real political price.');
    // anchored: the exact projected line above proves the letter included this beat.
    expect(letterToPlainText(projected)).not.toMatch(/3\.2|0\.62|×|\b(?:commitment|cliff)\b/i);
  });
});

describe('V-2 — the empty-diff grace', () => {
  it('reads quiet (empty, a quiet greeting, no sections) when nothing is new', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 10 });
    expect(l.empty).toBe(true);
    expect(l.sections).toEqual([]);
    expect(l.counts.total).toBe(0);
    expect(l.greeting.toLowerCase()).toMatch(/quiet|still|without event/);
  });
});

describe('WR-2 — Wizard News audience projection', () => {
  const privacyFeed = {
    schemaVersion: 1,
    currentTick: 12,
    updatedAt: '2026-08-02T00:00:00.000Z',
    entries: [
      {
        id: 'public-crossing', tick: 10, significance: 'notable',
        impactKind: 'disposition_martial_crossed', headline: 'Ashford takes a harder line',
      },
      {
        id: 'suppressed-reading', tick: 11, significance: 'routine',
        kind: 'war_culture_suppressed', impactKind: 'war_culture_suppressed',
        headline: "Ashford's books refuse a warlike reading", covert: true,
      },
      {
        id: 'explicit-dm-only', tick: 12, significance: 'routine',
        impactKind: 'war_culture_suppressed', headline: 'A second private reading',
        audience: 'dm-only',
      },
    ],
  };

  it('keeps the exact shared feed for the DM, including war_culture_suppressed', () => {
    const projected = projectWizardNewsForAudience(privacyFeed, 'dm');
    expect(projected).toBe(privacyFeed);
    expect(projected.entries.map((entry) => entry.kind || entry.impactKind))
      .toContain('war_culture_suppressed');

    const letter = composeChroniclersLetter({ wizardNews: privacyFeed, audience: 'dm' });
    expect(letter.sections.flatMap((section) => section.lines).map((line) => line.id))
      .toEqual(expect.arrayContaining(['suppressed-reading', 'explicit-dm-only']));
  });

  it.each(['player', 'public'])('removes covert and explicit DM-only beats for %s readers', (audience) => {
    const projected = projectWizardNewsForAudience(privacyFeed, audience);
    expect(projected).toMatchObject({
      schemaVersion: privacyFeed.schemaVersion,
      currentTick: privacyFeed.currentTick,
      updatedAt: privacyFeed.updatedAt,
    });
    expect(projected.entries.map((entry) => entry.id)).toEqual(['public-crossing']);

    const letter = composeChroniclersLetter({ wizardNews: privacyFeed, audience });
    const ids = letter.sections.flatMap((section) => section.lines).map((line) => line.id);
    expect(ids).toEqual(['public-crossing']);
    expect(letterToPlainText(letter)).not.toMatch(/books refuse|private reading/i);
  });
});

describe('V-2 R-16 — the "world deepened" section', () => {
  const rules = { warLayerEnabled: true, faithSpreadEnabled: true, seasonsEnabled: false };

  it('is DARK when no flags-seen baseline is recorded (flagsSeen null)', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4, simulationRules: rules, flagsSeen: null });
    expect(l.deepened).toBeNull();
  });

  it('lights only the newly-enabled flags vs the recorded baseline', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4, simulationRules: rules, flagsSeen: ['warLayerEnabled'] });
    expect(l.deepened).not.toBeNull();
    expect(l.deepened.flags).toEqual(['faithSpreadEnabled']); // warLayerEnabled already seen; seasons is off
  });

  it('stays dark when the baseline already covers every enabled flag', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4, simulationRules: rules, flagsSeen: ['warLayerEnabled', 'faithSpreadEnabled'] });
    expect(l.deepened).toBeNull();
  });

  it('enabledFlagsOf returns the sorted enabled boolean keys', () => {
    expect(enabledFlagsOf({ b: true, a: true, c: false })).toEqual(['a', 'b']);
    expect(enabledFlagsOf(null)).toEqual([]);
  });
});

describe('V-2 R-17 — the shareable text export', () => {
  it('renders the letter to deterministic house-voiced text', () => {
    const letter = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4 });
    const text = letterToPlainText(letter);
    expect(text).toContain('THE CHRONICLER’S LETTER');
    expect(text).toContain('The border burns');
    expect(text).toContain('OF MERCY GIVEN');
    expect(text).toContain(letter.closing);
    expect(letterToPlainText(letter)).toBe(text); // deterministic
  });
});

// ── C2 (bar 18/20/97) — sections beyond the crier, dedupe, recall, cap honesty ──

describe('C2 — the letter-local kind → section fallback (the sundry monoculture)', () => {
  const mk = (id, impactKind, headline, tick = 6) => ({ id, tick, significance: 'notable', impactKind, headline });

  it('routes promoted candidateType kinds to their house sections (crier untouched)', () => {
    const l = composeChroniclersLetter({ wizardNews: { currentTick: 9, entries: [
      mk('n1', 'npc_ladder', 'The steward rises'),
      mk('o1', 'treaty_breached', 'The old pact is torn up'),
      mk('b1', 'field_battle', 'Battle at the ford'),
      mk('h1', 'harvest', 'The harvest comes in'),
      mk('t1', 'tradition_change', 'An old custom bends'),
      mk('r1', 'generosity_refusal', 'The gates stay shut'),
    ] }, lastReadTick: 0 });
    const byId = Object.fromEntries(l.sections.map((s) => [s.id, s.lines.map((x) => x.id)]));
    expect(byId.courts).toEqual(['n1', 'o1']);
    expect(byId.wars).toEqual(['b1']);
    expect(byId.trade).toEqual(['h1']);
    expect(byId.traditions).toEqual(['t1']);
    expect(byId.mercy).toEqual(['r1']);
    expect(byId.sundry).toBeUndefined();
  });

  it('a truly unknown kind still falls to sundry (never dropped)', () => {
    const l = composeChroniclersLetter({ wizardNews: { currentTick: 9, entries: [
      mk('x1', 'utterly_unmapped_kind', 'A matter of the realm'),
    ] }, lastReadTick: 0 });
    expect(l.sections.map((s) => s.id)).toEqual(['sundry']);
  });

  it('classified kinds keep their crier route (precedence unchanged — the golden holds this too)', () => {
    const l = composeChroniclersLetter({ wizardNews: { currentTick: 9, entries: [
      mk('w1', 'conflict_pressure', 'The border burns'),
    ] }, lastReadTick: 0 });
    expect(l.sections.map((s) => s.id)).toEqual(['wars']);
  });
});

describe('C2 — verbatim duplicate lines coalesce within a section', () => {
  it('the same headline+summary collapses to one line carrying its tally', () => {
    const entries = [1, 2, 3, 4].map((i) => ({
      id: `d${i}`, tick: 4 + i, significance: 'notable', impactKind: 'conflict_pressure',
      headline: 'The Archmagister may reform', summary: 'The court holds its breath.',
    }));
    const l = composeChroniclersLetter({ wizardNews: { currentTick: 9, entries }, lastReadTick: 0 });
    expect(l.sections).toHaveLength(1);
    expect(l.sections[0].lines).toHaveLength(1);
    expect(l.sections[0].lines[0].repeats).toBe(4);
    const text = letterToPlainText(l);
    expect(text).toContain('(so noted 4 times)');
    expect(text.match(/The Archmagister may reform/g)).toHaveLength(1);
    // counts stay honest to the FEED (4 beats happened), only the rendering coalesces
    expect(l.counts.total).toBe(4);
  });

  it('lines differing in summary do NOT coalesce', () => {
    const l = composeChroniclersLetter({ wizardNews: { currentTick: 9, entries: [
      { id: 'a', tick: 5, significance: 'notable', impactKind: 'conflict_pressure', headline: 'H', summary: 'one' },
      { id: 'b', tick: 6, significance: 'notable', impactKind: 'conflict_pressure', headline: 'H', summary: 'two' },
    ] }, lastReadTick: 0 });
    expect(l.sections[0].lines).toHaveLength(2);
  });
});

describe('C2 — the cross-time recall (narrate, not log)', () => {
  it('a section lead recalls the older record it echoes (same place, same section, pre-floor)', () => {
    const l = composeChroniclersLetter({ wizardNews: { currentTick: 60, entries: [
      { id: 'old1', tick: 3, significance: 'major', impactKind: 'generosity_relief', headline: 'Grain reaches the starving of Ormsund', settlementIds: ['s1', 's2'] },
      { id: 'new1', tick: 55, significance: 'major', impactKind: 'generosity_relief', headline: 'Ormsund repays its mercy', settlementIds: ['s2'] },
    ] }, lastReadTick: 10 });
    const mercy = l.sections.find((s) => s.id === 'mercy');
    expect(mercy.lines[0].recalls).toEqual({ headline: 'Grain reaches the starving of Ormsund', when: 'the spring of year 1' });
    expect(letterToPlainText(l)).toContain('In this my earlier record returns, from the spring of year 1: Grain reaches the starving of Ormsund.');
  });

  it('no shared place or no pre-floor twin ⇒ no recall field at all (byte-inert)', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4 });
    for (const s of l.sections) for (const line of s.lines) expect('recalls' in line).toBe(false);
  });
});

describe('C2 — cap honesty (the letter must not claim completeness it cannot keep)', () => {
  const bigFeed = (oldest) => ({
    currentTick: 500,
    entries: Array.from({ length: 240 }, (_, i) => ({
      id: `e${i}`, tick: oldest + i, significance: 'notable', impactKind: 'conflict_pressure', headline: `Beat ${i}`,
    })),
  });

  it('a full feed whose oldest survivor post-dates the floor is marked truncated', () => {
    const l = composeChroniclersLetter({ wizardNews: bigFeed(200), lastReadTick: 10 });
    expect(l.truncated).toBe(true);
    expect(l.truncationNote).toMatch(/outran my pages/);
    expect(l.closing).not.toContain('the whole of it');
    expect(letterToPlainText(l)).toContain(l.truncationNote);
  });

  it('an un-truncated letter carries neither field (byte-inert; the golden holds this too)', () => {
    const l = composeChroniclersLetter({ wizardNews: feed, lastReadTick: 4 });
    expect('truncated' in l).toBe(false);
    expect('truncationNote' in l).toBe(false);
  });

  it('FEED_CAP mirrors wizardNews MAX_ENTRIES (the sidecar pin)', async () => {
    const { readFileSync } = await import('node:fs');
    const src = readFileSync('src/domain/region/wizardNews.js', 'utf8');
    expect(src).toMatch(/const MAX_ENTRIES = 240;/);
    const letterSrc = readFileSync('src/domain/display/chroniclersLetter.js', 'utf8');
    expect(letterSrc).toMatch(/const FEED_CAP = 240;/);
  });
});

describe('C2 — KIND_SECTION drift walker (every key is a genuinely minted kind)', () => {
  it('every mapped kind exists as a minted candidateType or a literal impactKind', async () => {
    const { KIND_SECTION } = await import('../../src/domain/display/chroniclersLetter.js');
    const { readFileSync, readdirSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');
    const walk = (dir, out = []) => {
      for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
      }
      return out;
    };
    const minted = new Set();
    for (const f of walk('src/domain')) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/candidateType:\s*['"]([a-z][a-z0-9_]*)['"]/g)) minted.add(m[1]);
      for (const m of src.matchAll(/impactKind:\s*['"]([a-z][a-z0-9_]*)['"]/g)) minted.add(m[1]);
    }
    expect(minted.size).toBeGreaterThan(50); // non-vacuous scan
    const dead = Object.keys(KIND_SECTION).filter((k) => !minted.has(k));
    expect(dead).toEqual([]); // a struck/renamed mint must be struck here too
    const valid = new Set(['wars', 'courts', 'trade', 'traditions', 'mercy', 'sundry']);
    for (const v of Object.values(KIND_SECTION)) expect(valid.has(v)).toBe(true);
  });
});
