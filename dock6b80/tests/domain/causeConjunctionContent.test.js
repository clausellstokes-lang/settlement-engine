/**
 * tests/domain/causeConjunctionContent.test.js — W2 conjunction content ladder.
 *
 * THE COVERAGE-LADDER GATE (W2 brief item 5): enumerate the ENGINE'S reachable
 * conjunction key space — derived from the built vocabularies, never
 * hand-listed — and assert (a) every key resolves to a non-empty line,
 * (b) the tier distribution (the multiplication, quantified) as a pinned
 * snapshot, (c) determinism (same key + seed => same line), (d) variant
 * anti-repetition (distinct npc seeds prefer distinct variants). Plus the
 * content-quality guards (global uniqueness — no template-with-synonyms
 * padding; the canon register) and the ladder's structural pins (Tier-1
 * totality over the role table, high-frequency variant minimums, fallthrough
 * to class and floor rungs, the floor's age-band register preserved).
 */

import { describe, it, expect } from 'vitest';

import {
  conjunctionContent, conjunctionVariantsFor, describeCompromiseConjunction, FULL_CONTENT,
} from '../../src/domain/display/causeConjunctionContent.js';
import { ROLE_CONTENT } from '../../src/domain/display/causeConjunctionRoleContent.js';
import { CLASS_CONTENT } from '../../src/domain/display/causeConjunctionClassContent.js';
import { LIFECYCLE_STAGES, STAGE_BADGE } from '../../src/domain/display/causeLifecycleVocabulary.js';
import { CAUSE_CLASS_IDS, roleCauseAffinity } from '../../src/domain/worldPulse/causeVocabulary.js';
import { NPC_ROLE_ARCHETYPES } from '../../src/domain/worldPulse/npcAgency.js';

// The built conjunction key space (the W2 architect ruling: 12 x 2 x 14 x 6),
// DERIVED from the engine vocabularies. bearerSituation is a closed two-value
// vocabulary (causeLifecycle.js:165).
const ROLES = Object.keys(NPC_ROLE_ARCHETYPES);
const SITUATIONS = ['compromised-covert', 'compromised-revealed'];
const HIGH_FREQUENCY_STAGES = ['attributed', 'exposed-public', 'reformed'];

/** Every affinity-reachable conjunction key (the brief's "minus zero-affinity
 *  pairs" filter — the built affinity has a nonzero family floor, so nothing
 *  is actually excluded; the filter is kept derivational, not assumed). */
function reachableKeys() {
  const keys = [];
  for (const role of ROLES) {
    for (const causeClass of CAUSE_CLASS_IDS) {
      if (roleCauseAffinity(role, causeClass) <= 0) continue;
      for (const situation of SITUATIONS) {
        for (const lifecycleStage of LIFECYCLE_STAGES) {
          keys.push({ role, situation, causeClass, lifecycleStage });
        }
      }
    }
  }
  return keys;
}

/** Flatten every authored line in a nested content table. @param {object} node */
function allLines(node, out = []) {
  if (Array.isArray(node)) { for (const l of node) out.push(l); return out; }
  if (node && typeof node === 'object') for (const v of Object.values(node)) allLines(v, out);
  return out;
}

describe('W2 the reachable key space', () => {
  it('is the built 12 x 2 x 14 x 6 space, and the affinity filter excludes nothing (nonzero family floor)', () => {
    expect(ROLES).toHaveLength(12);
    expect(CAUSE_CLASS_IDS).toHaveLength(14);
    expect(LIFECYCLE_STAGES).toHaveLength(6);
    const zeroAffinity = [];
    for (const role of ROLES) {
      for (const cls of CAUSE_CLASS_IDS) {
        if (roleCauseAffinity(role, cls) <= 0) zeroAffinity.push(`${role}|${cls}`);
      }
    }
    expect(zeroAffinity).toEqual([]);
    expect(reachableKeys()).toHaveLength(12 * 2 * 14 * 6);
  });
});

describe('W2 coverage ladder — every reachable conjunction resolves', () => {
  it('(a) every key yields a non-empty, slot-free line', () => {
    for (const key of reachableKeys()) {
      const { line, tier } = conjunctionContent(key, 'npc-coverage');
      expect(typeof line, JSON.stringify(key)).toBe('string');
      expect(line.length, JSON.stringify(key)).toBeGreaterThan(0);
      expect(line, JSON.stringify(key)).not.toContain('{');
      expect(['full', 'role', 'class', 'floor']).toContain(tier);
    }
  });

  it('(b) THE TIER DISTRIBUTION SNAPSHOT — the multiplication, quantified', () => {
    const dist = { full: 0, role: 0, class: 0, floor: 0 };
    for (const key of reachableKeys()) dist[conjunctionVariantsFor(key).tier] += 1;
    // 2,016 reachable conjunctions: 12 full-specificity dramatic cells, every
    // other cell resolves at the Tier-1 role rung (the role table is TOTAL over
    // the built key), and the class/floor rungs are pure safety net (reached
    // only for unknown/future roles or classes — asserted below).
    expect(dist).toEqual({ full: 12, role: 2004, class: 0, floor: 0 });
  });

  it('(c) determinism — same key + seed always yields the same line', () => {
    for (const key of reachableKeys().filter((_, i) => i % 97 === 0)) {
      for (const seed of ['npc-1', 'npc-2', 7]) {
        const a = conjunctionContent(key, seed);
        const b = conjunctionContent(key, seed);
        expect(a.line).toBe(b.line);
        expect(a.tier).toBe(b.tier);
      }
    }
  });

  it('(d) anti-repetition — distinct npc seeds reach distinct variants on multi-variant conjunctions', () => {
    const seeds = Array.from({ length: 8 }, (_, i) => `npc-${i}`);
    let multi = 0;
    let separated = 0;
    for (const key of reachableKeys()) {
      const { variants } = conjunctionVariantsFor(key);
      if (!variants || variants.length < 2) continue;
      multi += 1;
      const rendered = new Set(seeds.map((s) => conjunctionContent(key, s).line));
      if (rendered.size >= 2) separated += 1;
    }
    expect(multi).toBeGreaterThan(1000); // the >=2-variant space is real, not token
    // A pure 32-bit hash over 8 seeds collides all-same with p ~= 2^-7 per
    // 2-variant key; demand near-total separation without pinning hash bytes.
    expect(separated / multi).toBeGreaterThan(0.97);
    // And the canonical brief conjunction concretely separates:
    const key = { role: 'military', situation: 'compromised-covert', causeClass: 'underfunded', lifecycleStage: 'attributed' };
    const lines = new Set(Array.from({ length: 16 }, (_, i) => conjunctionContent(key, `npc-${i}`).line));
    expect(lines.size).toBeGreaterThanOrEqual(2);
  });

  it('falls through to the class rung for unknown roles, and to the floor for unknown classes', () => {
    const unknownRole = conjunctionContent({ role: 'harbormaster_of_nowhere', situation: 'compromised-covert', causeClass: 'underfunded', lifecycleStage: 'attributed' }, 'x');
    expect(unknownRole.tier).toBe('class');
    expect(unknownRole.line.length).toBeGreaterThan(0);
    expect(unknownRole.line).not.toContain('{role}');
    const floor = conjunctionContent({ role: 'harbormaster_of_nowhere', situation: 'compromised-covert', causeClass: 'not-a-cause', lifecycleStage: 'attributed' }, 'x');
    expect(floor.tier).toBe('floor');
    expect(floor.line.length).toBeGreaterThan(0);
  });

  it('the floor rung preserves the W-C5 age-band register (years-past historicize voice)', () => {
    const old = conjunctionContent({ role: 'nobody', situation: 'compromised-covert', causeClass: 'not-a-cause', lifecycleStage: 'historicized', ageBand: 'years-past' }, 'x');
    expect(old.tier).toBe('floor');
    expect(old.line.toLowerCase()).toMatch(/lean years|years ago/);
    const fresh = conjunctionContent({ role: 'nobody', situation: 'compromised-covert', causeClass: 'not-a-cause', lifecycleStage: 'historicized', ageBand: 'this-month' }, 'x');
    expect(fresh.line.toLowerCase()).not.toMatch(/lean years|years ago/);
  });
});

describe('W2 Tier-1 structural pins', () => {
  it('the role table is TOTAL: every role x causeClass x stage cell is authored', () => {
    for (const role of ROLES) {
      expect(ROLE_CONTENT[role], role).toBeTruthy();
      for (const cls of CAUSE_CLASS_IDS) {
        expect(ROLE_CONTENT[role][cls], `${role}.${cls}`).toBeTruthy();
        for (const stage of LIFECYCLE_STAGES) {
          const v = ROLE_CONTENT[role][cls][stage];
          expect(Array.isArray(v) && v.length >= 1, `${role}.${cls}.${stage}`).toBe(true);
        }
      }
    }
  });

  it('high-frequency stages carry >=2 variants at the role rung; class rung likewise', () => {
    for (const role of ROLES) {
      for (const cls of CAUSE_CLASS_IDS) {
        for (const stage of HIGH_FREQUENCY_STAGES) {
          expect(ROLE_CONTENT[role][cls][stage].length, `${role}.${cls}.${stage}`).toBeGreaterThanOrEqual(2);
        }
      }
    }
    for (const cls of CAUSE_CLASS_IDS) {
      for (const stage of LIFECYCLE_STAGES) {
        const v = CLASS_CONTENT[cls]?.[stage];
        expect(Array.isArray(v) && v.length >= 1, `class.${cls}.${stage}`).toBe(true);
      }
      for (const stage of HIGH_FREQUENCY_STAGES) {
        expect(CLASS_CONTENT[cls][stage].length, `class.${cls}.${stage}`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('the full rung covers exactly the curated dramatic dozen, each with >=2 variants', () => {
    const cells = [];
    for (const [role, bySituation] of Object.entries(FULL_CONTENT)) {
      for (const [situation, byClass] of Object.entries(bySituation)) {
        expect(SITUATIONS).toContain(situation);
        expect(ROLES).toContain(role);
        for (const [cls, byStage] of Object.entries(byClass)) {
          expect(CAUSE_CLASS_IDS).toContain(cls);
          for (const [stage, variants] of Object.entries(byStage)) {
            expect(LIFECYCLE_STAGES).toContain(stage);
            expect(variants.length).toBeGreaterThanOrEqual(2);
            cells.push(`${role}|${situation}|${cls}|${stage}`);
          }
        }
      }
    }
    expect(cells).toHaveLength(12);
  });
});

describe('W2 content-quality guards', () => {
  const authored = [
    ...allLines(FULL_CONTENT),
    ...allLines(ROLE_CONTENT),
    ...allLines(CLASS_CONTENT),
  ];

  it('every authored line is globally unique (no template-with-synonyms padding)', () => {
    const seen = new Map();
    const dupes = [];
    for (const line of authored) {
      if (seen.has(line)) dupes.push(line);
      seen.set(line, true);
    }
    expect(dupes).toEqual([]);
    expect(authored.length).toBeGreaterThanOrEqual(1600); // the multiplication is real
  });

  it('every authored line keeps the canon register: terminal period, no shouting, no em-dash, no age-band claims', () => {
    for (const line of authored) {
      expect(line.trim(), line).toBe(line);
      expect(/[.]$/.test(line), `terminal period: ${line}`).toBe(true);
      expect(line.includes('!'), `no exclamation: ${line}`).toBe(false);
      expect(line.includes('—'), `no em-dash: ${line}`).toBe(false);
      // The temporal register belongs to the FLOOR (which reads the age band);
      // authored lines render at any stamp age and must stay band-neutral.
      expect(/lean years|years ago/i.test(line), `band-neutral: ${line}`).toBe(false);
    }
    // The only template slot allowed anywhere is {role}, and only at the class rung.
    for (const line of [...allLines(FULL_CONTENT), ...allLines(ROLE_CONTENT)]) {
      expect(line.includes('{'), `slot-free: ${line}`).toBe(false);
    }
    for (const line of allLines(CLASS_CONTENT)) {
      expect(line.replace(/\{role\}/g, ''), `only {role} slots: ${line}`).not.toContain('{');
    }
  });
});

describe('W2 consumption seam — describeCompromiseConjunction', () => {
  it('mirrors the floor read-model shape (badge/tone/conjunctionKey) with the ladder phrase + tier', () => {
    const stamp = { stage: 'attributed', causeClass: 'underfunded', role: 'military', situation: 'compromised-covert', ageBand: 'this-week' };
    const desc = describeCompromiseConjunction(stamp, 'npc-7');
    expect(desc.badge).toBe(STAGE_BADGE.attributed.label);
    expect(desc.tone).toBe(STAGE_BADGE.attributed.tone);
    expect(desc.tier).toBe('full'); // the canonical dramatic conjunction
    expect(desc.phrase).toBe(conjunctionContent(stamp && {
      role: stamp.role, situation: stamp.situation, causeClass: stamp.causeClass,
      lifecycleStage: stamp.stage, ageBand: stamp.ageBand,
    }, 'npc-7').line);
    expect(desc.conjunctionKey).toEqual({
      role: 'military', situation: 'compromised-covert', causeClass: 'underfunded', lifecycleStage: 'attributed',
    });
    expect(describeCompromiseConjunction(null, 'npc-7')).toBeNull();
    expect(describeCompromiseConjunction({}, 'npc-7')).toBeNull();
  });

  it('badge tuning survives the ladder (historicized reads Longstanding, exposed reads Exposed)', () => {
    const hist = describeCompromiseConjunction({ stage: 'historicized', causeClass: 'underfunded', role: 'military', situation: 'compromised-covert' }, 'a');
    expect(hist.badge).toBe('Longstanding');
    const exp = describeCompromiseConjunction({ stage: 'exposed-public', causeClass: 'captured', role: 'military', situation: 'compromised-revealed' }, 'a');
    expect(exp.badge).toBe('Exposed');
    expect(exp.tier).toBe('full');
  });
});
