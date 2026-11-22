/**
 * tests/domain/heraldDeeds.test.js — THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02: "Updates
 * like these need to reflect actions not to potential. Like a definitive actions. Such as X is
 * targeting Y. A has captured B.").
 *
 * Pins the deed register (src/domain/worldPulse/heraldDeeds.js) and the producers that read it:
 * every form is clean, an UNDER-WAY form is progressive and a DONE form is not, nothing speaks
 * potential or the simulation's own nouns, every NPC action family has its deed, and the two lines
 * the owner named can no longer be produced in any variation.
 */
import { describe, it, expect } from 'vitest';
import {
  CONDITION_DEEDS, TARGETED_NPC_DEEDS, UNTARGETED_NPC_DEEDS, NPC_AIMS, RELATIONSHIP_TURNS, RELATIONS_MOVE,
} from '../../src/domain/worldPulse/heraldDeeds.js';
import { NPC_ACTION_FAMILIES } from '../../src/domain/worldPulse/npcAgency.js';
import { PRIMARY_RELATIONSHIP_TYPES } from '../../src/domain/worldPulse/relationshipCompatibility.js';
import { NPC_GOALS } from '../../src/domain/npc/npcFacetContract.js';
import { GOAL_BRANCH_RULES } from '../../src/domain/worldPulse/npcGoalBranches.js';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const NAME = 'Ashford';
const POTENTIAL = /\b(may|might|could|can advance)\b/i;
const MECHANIC = /\b(pressure|condition|goal|score|gate|eligibility)\b/i;
const LEAK = /\$\{|\bundefined\b|\[object|\bNaN\b| {2,}/;

const clean = (s, where) => {
  expect(s.length, `${where} empty`).toBeGreaterThan(0);
  expect(s, `${where} untrimmed`).toBe(s.trim());
  // anchored: the length and trim assertions above prove `s` is a live, non-empty rendered line
  expect(s, `${where} leaks`).not.toMatch(LEAK);
  // anchored: the same live line as above
  expect(s, `${where} speaks potential`).not.toMatch(POTENTIAL);
  // anchored: the same live line as above
  expect(s, `${where} names the simulation's machinery`).not.toMatch(MECHANIC);
};

describe('the deed register — every form is a clean deed', () => {
  it('conditions: under way is progressive, done is not, the fact names the place', () => {
    const kinds = Object.keys(CONDITION_DEEDS);
    expect(kinds.sort()).toEqual(['conflict', 'crime', 'disease', 'food', 'legitimacy', 'trade']);
    for (const kind of kinds) {
      const d = CONDITION_DEEDS[kind];
      const [u, done, fact] = [d.underway(NAME), d.done(NAME), d.fact(NAME)];
      for (const [s, f] of [[u, 'underway'], [done, 'done'], [fact, 'fact']]) clean(s, `${kind}.${f}`);
      expect(u, `${kind}.underway is not under way`).toMatch(/\bis \w+ing\b|\bare \w+ing\b|\bare under\b/);
      // anchored: clean(done) above proves the done form is a live, non-empty line
      expect(done, `${kind}.done reads as still under way`).not.toMatch(/\b(is|are) \w+ing\b/);
      for (const s of [u, done, fact]) expect(s, `${kind} lost the place`).toContain(NAME);
    }
  });

  it('NPC moves: every action family has an untargeted deed, and targeted deeds name WHO', () => {
    const families = Object.keys(NPC_ACTION_FAMILIES).sort();
    expect(families.length, 'anti-vacuity').toBeGreaterThan(8);
    expect(Object.keys(UNTARGETED_NPC_DEEDS).sort()).toEqual(families);
    for (const [family, d] of Object.entries(UNTARGETED_NPC_DEEDS)) {
      clean(d.underway, `${family}.underway`);
      clean(d.done, `${family}.done`);
      expect(d.underway, `${family}.underway is not under way`).toMatch(/^is \w+ing\b/);
      // anchored: clean(d.done) above proves the done form is a live, non-empty line
      expect(d.done, `${family}.done reads as still under way`).not.toMatch(/^is \w+ing\b/);
    }
    for (const [family, d] of Object.entries(TARGETED_NPC_DEEDS)) {
      expect(families, `${family} is not an action family`).toContain(family);
      const [u, done] = [d.underway('Corvin'), d.done('Corvin')];
      clean(u, `${family}.targeted.underway`);
      clean(done, `${family}.targeted.done`);
      expect(u).toMatch(/^is \w+ing\b/);
      for (const s of [u, done]) expect(s, `${family} does not name WHO`).toContain('Corvin');
    }
  });

  it('relationships: every primary label has its turn, and every direction its move, both towns plural', () => {
    expect(Object.keys(RELATIONSHIP_TURNS).sort()).toEqual([...PRIMARY_RELATIONSHIP_TYPES].sort());
    for (const [label, d] of Object.entries({ ...RELATIONSHIP_TURNS, ...RELATIONS_MOVE })) {
      clean(d.underway, `${label}.underway`);
      clean(d.done, `${label}.done`);
      expect(d.underway, `${label}.underway is not under way`).toMatch(/^are \w+ing\b/);
      // anchored: clean(d.done) above proves the done form is a live, non-empty line
      expect(d.done, `${label}.done reads as still under way`).not.toMatch(/^are \w+ing\b/);
    }
    expect(Object.keys(RELATIONS_MOVE).sort()).toEqual(['de_escalation', 'escalation', 'neutral']);
  });

  it('aims read as the world would say them, for every goal the planner can hold', () => {
    for (const [key, aim] of Object.entries(NPC_AIMS)) {
      clean(aim, `aim ${key}`);
      // anchored: clean(aim) above proves the aim is a live, non-empty line
      expect(aim, `${key} is the planner's key, not words`).not.toContain('_');
    }
    // Every goal the catalog and the branch rules can hand an NPC: a missing one printed
    // "is out to survive tribute" in the first wave's witness year.
    const held = new Set([...NPC_GOALS, ...GOAL_BRANCH_RULES.flatMap((rule) => [rule.goals.shortGoal, rule.goals.longGoal])]);
    expect(held.size, 'anti-vacuity').toBeGreaterThan(20);
    expect([...held].filter((goal) => !NPC_AIMS[goal]).sort()).toEqual([]);
  });
});

describe('the two lines the owner named are gone from the whole pool, in every variation', () => {
  // Every template literal under src/domain/worldPulse — the generation-time producers of the feed.
  const ROOT = join(process.cwd(), 'src', 'domain', 'worldPulse');
  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith('.js')) files.push(p);
    }
  };
  walk(ROOT);

  it('no producer writes "shows enough … for a new condition to emerge" or "goal can advance through"', () => {
    expect(files.length, 'anti-vacuity').toBeGreaterThan(100);
    const hits = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      if (/shows enough[^`]*for a (new )?condition to emerge/.test(src)) hits.push(`${f}: condition-emergence line`);
      if (/goal can advance through/.test(src.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, ''))) hits.push(`${f}: goal-advance line`);
    }
    expect(hits).toEqual([]);
  });

  it('no headline expression is written as "may …", including a ternary across lines', () => {
    // The WHOLE headline expression: its own line plus up to three continuation lines that do not
    // open the next property — the relationship ternary spread "may become" and "may shift" across
    // two such lines, where a single-literal scan never looked.
    const HEADLINE_EXPR = /\bheadline:\s*([^\n]*(?:\n(?!\s*[A-Za-z_$][\w$]*:\s)[^\n]*){0,3})/g;
    const hits = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(HEADLINE_EXPR)) {
        if (/`[^`]*\bmay\b[^`]*`/.test(m[1])) hits.push(`${f}: ${m[1].trim().slice(0, 120)}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
