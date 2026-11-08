/**
 * goalFamilies.test.js — THE SHAPE LAW of the goal families, executable (WRITE-GOALS, 2026-11-08;
 * `docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md` §6.1 and §6.6; the record
 * `docs/allegiance/WRITE_GOALS_2026-11-08.md`).
 *
 *   - every cell holds exactly its §6.6 count (RANK 36 · POWER 48 · INSTITUTION 48 · SUPPLY 48 ·
 *     TIES 60 · PERSONALITY 96 · ALLEGIANCE 128 = 464);
 *   - every `{slot}` is in its family's `GOAL_SLOTS` and its sub-kind's `GOAL_SUBKIND_SLOTS`, and no
 *     line uses a struck slot;
 *   - no duplicate line; no struck tic (STYLE-RULINGS-2026-11-07 §2 law 3, the list verbatim);
 *   - the slot contract: no line begins with a slot, writes "the {slot}", puts "'s" on a slot that
 *     names a power, a house or a thing, or follows such a slot with a verb that must agree in number;
 *   - `PERSONALITY_CLUSTER_OF` is total over `NPC_PERSONALITY_TRAITS` (imported, never hand-copied),
 *     the 17 corruptible flaws sit in their own vectors, and every cluster key has its cell;
 *   - every declared `needs` is an atom of the fact vocabulary with a reader.
 * The anchored negatives: a planted bad slot and a planted tic each red the checker (controls).
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import {
  GOAL_FAMILIES, GOAL_FAMILY_LINES, GOAL_SLOTS, GOAL_SLOTS_STRUCK, GOAL_SUBKIND_SLOTS,
  PERSONALITY_CLUSTERS, PERSONALITY_CLUSTER_OF,
} from '../../src/data/people/goalFamilies.js';
import { NPC_PERSONALITY_TRAITS } from '../../src/data/npcData.js';
import { CORRUPTIBLE_FLAWS, corruptionVectorForFlaw } from '../../src/domain/corruption.js';
import { assertDeclarable } from '../../src/domain/facts/factVocabulary.js';

/** Design §6.6, cell by cell: sub-kind → { vantage: variants }. */
const SIX = { short: 6, long: 6 };
const FIVE = { short: 5, long: 5 };
const FOUR = { short: 4, long: 4 };
const EXPECTED_CELLS = {
  RANK: { climb: SIX, defend: SIX, enter: SIX },
  POWER: { tense: SIX, competitive: SIX, corrupted: SIX, conflict: SIX },
  INSTITUTION: { solvency: SIX, rebuilding: SIX, charter: SIX, takeover: SIX },
  SUPPLY: { impaired: SIX, dependency: SIX, isolation: SIX, expansion: SIX },
  TIES: { rival_enemy: FIVE, debtor: FIVE, creditor: FIVE, ally: FIVE, family: FIVE, mentor_student: FIVE },
  PERSONALITY: Object.fromEntries(PERSONALITY_CLUSTERS.map((k) => [k, FOUR])),
  ALLEGIANCE: {
    serve_greed: FIVE, serve_hunger_for_status: FIVE, serve_fear: FIVE, serve_forbidden_patron: FIVE,
    escape_greed: { short: 5 }, escape_hunger_for_status: { short: 5 }, escape_fear: { short: 5 }, escape_forbidden_patron: { short: 5 },
    keep_partnership: { short: 5 }, keep_leverage: { short: 5 }, keep_patron: { short: 5 }, keep_cause: { short: 5 },
    front_keep: SIX, front_out: SIX, warrant: SIX, suspicion: SIX,
  },
};
const EXPECTED_TOTALS = { RANK: 36, POWER: 48, INSTITUTION: 48, SUPPLY: 48, TIES: 60, PERSONALITY: 96, ALLEGIANCE: 128 };

/** STYLE-RULINGS-2026-11-07 §2 law 3, verbatim, plus WIRING-RULINGS §7's named tic. */
const STRUCK_TICS = [
  'a stranger', 'rather than', 'arithmetic', 'the record', 'two different things', 'a separate question',
  'nothing has broken yet', 'which is the kind of', 'which makes it worse',
];

/** Slots that name a person: the only slots that may take "'s". */
const PERSON_SLOTS = new Set(['above', 'below', 'other', 'handler', 'agent', 'target']);
/** Present-tense verbs that must agree in number; never after a power, house or thing slot. */
const AGREEING_VERBS = ['is', 'has', 'was', 'does', 'needs', 'wants', 'makes', 'keeps', 'gets', 'pays', 'sends', 'brings',
  'owes', 'spends', 'takes', 'turns', 'decides', 'raises', 'gives', 'runs', 'holds', 'earns', 'asks'];

const textOf = (entry) => (typeof entry === 'string' ? entry : entry?.line);
const slotsOf = (text) => [...String(text).matchAll(/\{([^}]*)\}/g)].map((m) => m[1]);

/** Every violation of the shape law in a table, as strings naming the line; [] when lawful. */
function shapeViolations(table) {
  const out = [];
  const seen = new Map();
  for (const [family, subs] of Object.entries(table)) {
    const famSlots = GOAL_SLOTS[family];
    if (!famSlots) { out.push(`family: ${family} has no GOAL_SLOTS`); continue; }
    const struck = Object.keys(GOAL_SLOTS_STRUCK[family] || {});
    for (const [sub, vantages] of Object.entries(subs)) {
      const subSlots = GOAL_SUBKIND_SLOTS[family]?.[sub];
      if (!subSlots) out.push(`sub-kind: ${family}.${sub} has no GOAL_SUBKIND_SLOTS`);
      for (const [vantage, lines] of Object.entries(vantages)) {
        if (vantage !== 'short' && vantage !== 'long') out.push(`vantage: ${family}.${sub}.${vantage}`);
        for (const entry of lines) {
          const text = textOf(entry);
          const where = `${family}.${sub}.${vantage}: ${text}`;
          if (typeof text !== 'string' || !text) { out.push(`shape: ${family}.${sub}.${vantage} holds a non-line`); continue; }
          if (typeof entry !== 'string') {
            const keys = Object.keys(entry).sort().join(',');
            if (keys !== 'line,needs') out.push(`shape: ${where} carries keys ${keys}`);
            for (const atom of entry.needs || []) {
              try { assertDeclarable(atom); } catch { out.push(`needs: '${atom}' is not a declarable atom — ${where}`); }
            }
          }
          for (const slot of slotsOf(text)) {
            if (struck.includes(slot)) out.push(`slot: {${slot}} is struck in ${family} — ${where}`);
            else if (!famSlots.includes(slot)) out.push(`slot: {${slot}} is not in GOAL_SLOTS.${family} — ${where}`);
            else if (subSlots && !subSlots.includes(slot)) out.push(`slot: {${slot}} is not in GOAL_SUBKIND_SLOTS.${family}.${sub} — ${where}`);
          }
          const lower = text.toLowerCase();
          for (const tic of STRUCK_TICS) if (lower.includes(tic)) out.push(`tic: "${tic}" — ${where}`);
          if (/^\{/.test(text)) out.push(`contract: begins with a slot — ${where}`);
          if (!/^[A-Z]/.test(text) || !/[.]$/.test(text)) out.push(`form: not a capitalised sentence ending in a full stop — ${where}`);
          if (/\bthe \{/i.test(text)) out.push(`contract: an article before a slot — ${where}`);
          for (const m of text.matchAll(/\{([^}]*)\}'s\b/g)) if (!PERSON_SLOTS.has(m[1])) out.push(`contract: "{${m[1]}}'s" — ${where}`);
          for (const m of text.matchAll(/\{([^}]*)\} ([a-z]+)\b/g)) {
            if (!PERSON_SLOTS.has(m[1]) && AGREEING_VERBS.includes(m[2])) out.push(`contract: "{${m[1]}} ${m[2]}" must agree in number — ${where}`);
          }
          const key = lower.trim();
          if (seen.has(key)) out.push(`duplicate: ${where} (also ${seen.get(key)})`);
          else seen.set(key, `${family}.${sub}.${vantage}`);
        }
      }
    }
  }
  return out;
}

const count = (subs) => Object.values(subs).reduce((n, v) => n + Object.values(v).reduce((m, lines) => m + lines.length, 0), 0);
const plant = (family, sub, vantage, line) => {
  const copy = JSON.parse(JSON.stringify(GOAL_FAMILY_LINES));
  copy[family][sub][vantage].push(line);
  return copy;
};

describe('goal families — the cells of design §6.6', () => {
  test('the families are §6.6\'s seven, in its order', () => {
    expect(GOAL_FAMILIES).toEqual(['RANK', 'POWER', 'INSTITUTION', 'SUPPLY', 'TIES', 'PERSONALITY', 'ALLEGIANCE']);
    expect(Object.keys(GOAL_FAMILY_LINES)).toEqual([...GOAL_FAMILIES]);
  });

  test('every cell holds exactly its §6.6 count', () => {
    const actual = Object.fromEntries(Object.entries(GOAL_FAMILY_LINES).map(([f, subs]) => [f,
      Object.fromEntries(Object.entries(subs).map(([s, v]) => [s, Object.fromEntries(Object.entries(v).map(([k, lines]) => [k, lines.length]))]))]));
    expect(actual).toEqual(EXPECTED_CELLS);
  });

  test('the family totals are §6.6\'s, 464 in all', () => {
    const totals = Object.fromEntries(Object.entries(GOAL_FAMILY_LINES).map(([f, subs]) => [f, count(subs)]));
    expect(totals).toEqual(EXPECTED_TOTALS);
    expect(Object.values(totals).reduce((a, b) => a + b, 0)).toBe(464);
  });

  test('the table is frozen to its lines', () => {
    expect(Object.isFrozen(GOAL_FAMILY_LINES)).toBe(true);
    for (const subs of Object.values(GOAL_FAMILY_LINES)) {
      expect(Object.isFrozen(subs)).toBe(true);
      for (const v of Object.values(subs)) { expect(Object.isFrozen(v)).toBe(true); for (const lines of Object.values(v)) expect(Object.isFrozen(lines)).toBe(true); }
    }
  });

  test('the data file is plain data: it imports nothing', () => {
    const src = readFileSync(new URL('../../src/data/people/goalFamilies.js', import.meta.url), 'utf8');
    expect(src).not.toMatch(/^\s*import\b/m);
    expect(src).not.toMatch(/\brequire\(/);
  });
});

describe('goal families — the slots', () => {
  test('every sub-kind\'s slot set is a subset of its family\'s, over exactly the table\'s sub-kinds', () => {
    for (const [family, subs] of Object.entries(GOAL_FAMILY_LINES)) {
      expect(Object.keys(GOAL_SUBKIND_SLOTS[family]).sort()).toEqual(Object.keys(subs).sort());
      for (const slots of Object.values(GOAL_SUBKIND_SLOTS[family])) for (const s of slots) expect(GOAL_SLOTS[family]).toContain(s);
    }
  });

  test('no struck slot is also an allowed slot', () => {
    for (const [family, struck] of Object.entries(GOAL_SLOTS_STRUCK)) {
      for (const s of Object.keys(struck)) expect(GOAL_SLOTS[family]).not.toContain(s);
    }
  });
});

describe('goal families — the shape law', () => {
  test('the table is lawful: no violation', () => {
    expect(shapeViolations(GOAL_FAMILY_LINES)).toEqual([]);
  });

  test('CONTROL: a planted bad slot reds the checker', () => {
    const v = shapeViolations(plant('ALLEGIANCE', 'warrant', 'short', 'Bring {target} in before the {season} assize.'));
    expect(v.some((x) => x.startsWith('slot: {season} is struck in ALLEGIANCE'))).toBe(true);
    const w = shapeViolations(plant('TIES', 'ally', 'short', 'Stand by {other} against {rival} this season.'));
    expect(w.some((x) => x.startsWith('slot: {rival} is not in GOAL_SLOTS.TIES'))).toBe(true);
  });

  test('CONTROL: a planted tic reds the checker', () => {
    const v = shapeViolations(plant('PERSONALITY', 'greed', 'short', 'Save coin this season rather than spend it on the household.'));
    expect(v.some((x) => x.startsWith('tic: "rather than"'))).toBe(true);
  });

  test('CONTROL: a planted duplicate, article, possessive and agreement each red the checker', () => {
    const dup = textOf(GOAL_FAMILY_LINES.RANK.climb.short[0]);
    expect(shapeViolations(plant('RANK', 'enter', 'short', dup)).some((x) => x.startsWith('duplicate:'))).toBe(true);
    expect(shapeViolations(plant('INSTITUTION', 'solvency', 'short', 'Keep the {house} out of debt this season.')).some((x) => x.startsWith('contract: an article'))).toBe(true);
    expect(shapeViolations(plant('POWER', 'tense', 'short', "Undo {rival}'s last gain this season.")).some((x) => x.startsWith('contract: "{rival}\'s"'))).toBe(true);
    expect(shapeViolations(plant('POWER', 'tense', 'long', 'See that {rival} needs {power} more than ever.')).some((x) => x.startsWith('contract: "{rival} needs"'))).toBe(true);
    expect(shapeViolations(plant('TIES', 'ally', 'long', { line: 'Stand with {other} at the market.', needs: ['bazaar'] })).some((x) => x.startsWith("needs: 'bazaar'"))).toBe(true);
  });
});

describe('goal families — the personality clusters', () => {
  const words = [...new Set([...NPC_PERSONALITY_TRAITS.positive, ...NPC_PERSONALITY_TRAITS.negative, ...NPC_PERSONALITY_TRAITS.neutral])];

  test('there are twelve clusters, each with its cell', () => {
    expect(PERSONALITY_CLUSTERS).toHaveLength(12);
    expect(Object.keys(GOAL_FAMILY_LINES.PERSONALITY)).toEqual([...PERSONALITY_CLUSTERS]);
  });

  test('PERSONALITY_CLUSTER_OF is total over the trait lists, and names nothing else', () => {
    expect(words.filter((w) => !(w in PERSONALITY_CLUSTER_OF))).toEqual([]);
    expect(Object.keys(PERSONALITY_CLUSTER_OF).filter((w) => !words.includes(w))).toEqual([]);
    for (const c of Object.values(PERSONALITY_CLUSTER_OF)) expect(PERSONALITY_CLUSTERS).toContain(c);
  });

  test('every cluster holds at least one trait word', () => {
    const used = new Set(Object.values(PERSONALITY_CLUSTER_OF));
    expect(PERSONALITY_CLUSTERS.filter((c) => !used.has(c))).toEqual([]);
  });

  test('the 17 corruptible flaws sit in their own vectors, and only they do', () => {
    expect(CORRUPTIBLE_FLAWS).toHaveLength(17);
    for (const f of CORRUPTIBLE_FLAWS) expect(PERSONALITY_CLUSTER_OF[f]).toBe(corruptionVectorForFlaw(f));
    const vectors = new Set(CORRUPTIBLE_FLAWS.map((f) => corruptionVectorForFlaw(f)));
    expect(vectors.size).toBe(4);
    const others = words.filter((w) => !CORRUPTIBLE_FLAWS.includes(w));
    for (const w of others) expect(vectors.has(PERSONALITY_CLUSTER_OF[w])).toBe(false);
  });
});
