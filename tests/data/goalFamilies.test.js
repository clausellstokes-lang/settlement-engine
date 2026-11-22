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
 *   - every declared `needs` is an atom of the fact vocabulary with a reader;
 *   - THE RESERVE (GOALS-1, builder 4; the chair's approval of 2026-11-20 10:48 UTC): `GOAL_RESERVE_LINES` is apart from the
 *     cells and their totals; every reserve cell names an existing family, sub-kind and vantage, holds its approved count,
 *     uses only its family's and sub-kind's slots, and repeats no line of the cells nor of the reserve; the harsh-tie map
 *     (`GOAL_LINE_NOT_ON_TIES`) names only reserve TIES lines, real tie types and their real strengths. GOALS-3 (builder 7; the
 *     chair's approval of 13:32 UTC): PERSONALITY 16 reserve lines in 13 cells, keyed like the PERSONALITY cells, 41 in all.
 * The anchored negatives: a planted bad slot and a planted tic each red the checker (controls).
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import {
  GOAL_FAMILIES, GOAL_FAMILY_LINES, GOAL_LINE_NOT_ON_TIES, GOAL_RESERVE_LINES, GOAL_SLOTS, GOAL_SLOTS_STRUCK, GOAL_SUBKIND_SLOTS,
  PERSONALITY_CLUSTERS, PERSONALITY_CLUSTER_OF, TIE_TYPE_TO_GOAL_SUBKIND,
} from '../../src/data/people/goalFamilies.js';
import { NPC_PERSONALITY_TRAITS } from '../../src/data/npcData.js';
import { CORRUPTIBLE_FLAWS, corruptionVectorForFlaw } from '../../src/domain/corruption.js';
import { assertDeclarable } from '../../src/domain/facts/factVocabulary.js';
import { RELATIONSHIP_STRENGTHS } from '../../src/generators/people/ties.js';

/** Design §6.6, cell by cell: sub-kind → { vantage: variants }. */
const SIX = { short: 6, long: 6 };
const FIVE = { short: 5, long: 5 };
const FOUR = { short: 4, long: 4 };
const EXPECTED_CELLS = {
  RANK: { climb: SIX, defend: SIX, enter: SIX },
  POWER: { tense: SIX, competitive: SIX, corrupted: SIX, conflict: SIX },
  INSTITUTION: { solvency: SIX, rebuilding: SIX, charter: SIX, takeover: SIX },
  // LAST-VARIETY (item 2, 2026-11-18; the chair's ruling LR2): `want`, two a vantage, dealt only where a dependency's good is needed and not brought in
  SUPPLY: { impaired: SIX, dependency: SIX, isolation: SIX, expansion: SIX, want: { short: 2, long: 2 } },
  TIES: { rival_enemy: FIVE, debtor: FIVE, creditor: FIVE, ally: FIVE, family: FIVE, mentor_student: FIVE },
  PERSONALITY: Object.fromEntries(PERSONALITY_CLUSTERS.map((k) => [k, FOUR])),
  ALLEGIANCE: {
    serve_greed: FIVE, serve_hunger_for_status: FIVE, serve_fear: FIVE, serve_forbidden_patron: FIVE,
    escape_greed: { short: 5 }, escape_hunger_for_status: { short: 5 }, escape_fear: { short: 5 }, escape_forbidden_patron: { short: 5 },
    keep_partnership: { short: 5 }, keep_leverage: { short: 5 }, keep_patron: { short: 5 }, keep_cause: { short: 5 },
    front_keep: SIX, front_out: SIX, warrant: SIX, suspicion: SIX,
  },
  UNCANNY: { haunting: SIX, components: SIX, commission: SIX, omen: SIX, bargain: SIX },
};
const EXPECTED_TOTALS = { RANK: 36, POWER: 48, INSTITUTION: 48, SUPPLY: 52, TIES: 60, PERSONALITY: 96, ALLEGIANCE: 128, UNCANNY: 60 };
/** The reserve (GOALS-1, the chair's approval of 10:48 UTC; GOALS-3's PERSONALITY, its approval of 13:32 UTC), cell by cell: 41 lines, outside the totals above. */
const EXPECTED_RESERVE = {
  RANK: { enter: { short: 4, long: 3 } },
  POWER: { tense: { short: 2, long: 3 } },
  INSTITUTION: { solvency: { short: 2, long: 4 }, charter: { long: 1 } },
  TIES: { rival_enemy: { short: 2, long: 4 } },
  PERSONALITY: {
    greed: { short: 1, long: 1 }, hunger_for_status: { long: 1 }, fear: { long: 1 }, forbidden_patron: { long: 2 }, kindness: { short: 1, long: 1 },
    sway: { short: 1, long: 2 }, grudge: { short: 1, long: 2 }, impulse: { short: 1, long: 1 },
  },
};

/** STYLE-RULINGS-2026-11-07 §2 law 3, verbatim, plus WIRING-RULINGS §7's named tic. */
const STRUCK_TICS = [
  'a stranger', 'rather than', 'arithmetic', 'the record', 'two different things', 'a separate question',
  'nothing has broken yet', 'which is the kind of', 'which makes it worse',
];

/** Slots that name a person: the only slots that may take "'s". */
const PERSON_SLOTS = new Set(['above', 'below', 'other', 'handler', 'agent', 'target', 'priest']);
/** Present-tense verbs that must agree in number; never after a power, house or thing slot. */
const AGREEING_VERBS = ['is', 'has', 'was', 'does', 'needs', 'wants', 'makes', 'keeps', 'gets', 'pays', 'sends', 'brings',
  'owes', 'spends', 'takes', 'turns', 'decides', 'raises', 'gives', 'runs', 'holds', 'earns', 'asks'];

const textOf = (entry) => (typeof entry === 'string' ? entry : entry?.line);
const slotsOf = (text) => [...String(text).matchAll(/\{([^}]*)\}/g)].map((m) => m[1].split('|')[0]); // NAMES-3: an agreement form `{power|it|them}` names its power slot
/** NAMES-3 (CV7): the power slots a word may agree with, through the agreement form `{slot|one|many}`. */
const AGREEING_SLOTS = new Set(['power', 'rival', 'guild']);

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
            // POWERS-9 (the shape widened by one declared side, with its own check): a line whose words fail under a crisis
            // in force declares it on its `excludes` side (the chair's siege ruling), each an atom of the vocabulary
            if (keys !== 'line,needs' && keys !== 'excludes,line,needs') out.push(`shape: ${where} carries keys ${keys}`);
            for (const atom of [...(entry.needs || []), ...(entry.excludes || [])]) {
              try { assertDeclarable(atom); } catch { out.push(`needs: '${atom}' is not a declarable atom — ${where}`); }
            }
          }
          for (const slot of slotsOf(text)) {
            if (struck.includes(slot)) out.push(`slot: {${slot}} is struck in ${family} — ${where}`);
            else if (!famSlots.includes(slot)) out.push(`slot: {${slot}} is not in GOAL_SLOTS.${family} — ${where}`);
            else if (subSlots && !subSlots.includes(slot)) out.push(`slot: {${slot}} is not in GOAL_SUBKIND_SLOTS.${family}.${sub} — ${where}`);
          }
          // NAMES-3 (CV7): an agreement form agrees with a power slot the line itself prints, in two non-empty numbers
          for (const m of text.matchAll(/\{([^}|]*)\|([^}]*)\}/g)) {
            const [one, many, ...rest] = m[2].split('|');
            if (!AGREEING_SLOTS.has(m[1]) || !text.includes(`{${m[1]}}`) || !one || !many || rest.length) out.push(`agreement: "{${m[1]}|${m[2]}}" — ${where}`);
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
  test('the families are §6.6\'s seven, in its order, then UNCANNY (the owner, 2026-11-08)', () => {
    expect(GOAL_FAMILIES).toEqual(['RANK', 'POWER', 'INSTITUTION', 'SUPPLY', 'TIES', 'PERSONALITY', 'ALLEGIANCE', 'UNCANNY']);
    expect(Object.keys(GOAL_FAMILY_LINES)).toEqual([...GOAL_FAMILIES]);
  });

  test('every cell holds exactly its §6.6 count', () => {
    const actual = Object.fromEntries(Object.entries(GOAL_FAMILY_LINES).map(([f, subs]) => [f,
      Object.fromEntries(Object.entries(subs).map(([s, v]) => [s, Object.fromEntries(Object.entries(v).map(([k, lines]) => [k, lines.length]))]))]));
    expect(actual).toEqual(EXPECTED_CELLS);
  });

  test('the family totals are §6.6\'s 464 plus UNCANNY\'s 60 plus LAST-VARIETY\'s 4, 528 in all', () => {
    const totals = Object.fromEntries(Object.entries(GOAL_FAMILY_LINES).map(([f, subs]) => [f, count(subs)]));
    expect(totals).toEqual(EXPECTED_TOTALS);
    expect(Object.values(totals).reduce((a, b) => a + b, 0)).toBe(528);
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
    expect(src).not.toMatch(/^\s*import\b/m); // anchored: src is the data file's own text, read on the line above; every other arm here asserts its exports live
    expect(src).not.toMatch(/\brequire\(/); // anchored: src is the data file's own text, read two lines above; every other arm here asserts its exports live
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
      for (const s of Object.keys(struck)) expect(GOAL_SLOTS[family]).not.toContain(s); // anchored: GOAL_SLOTS[family] is asserted non-empty for every family by the slot arms above
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
    // NAMES-3 (CV7): an agreement form agrees with a power slot its line prints, in both numbers
    expect(shapeViolations(plant('POWER', 'tense', 'long', 'See {power} last until {rival|it is|they are} gone.')).some((x) => x.startsWith('agreement:'))).toBe(true);
    expect(shapeViolations(plant('RANK', 'climb', 'long', 'Lead {power} until {above|she|they} steps down.')).some((x) => x.startsWith('agreement:'))).toBe(true);
    expect(shapeViolations(plant('RANK', 'enter', 'long', 'Serve {power} until {power|it is} strong.')).some((x) => x.startsWith('agreement:'))).toBe(true);
    expect(shapeViolations(plant('TIES', 'ally', 'long', { line: 'Stand with {other} at the market.', needs: ['bazaar'] })).some((x) => x.startsWith("needs: 'bazaar'"))).toBe(true);
    // POWERS-9: the excludes side is checked as the needs side is
    expect(shapeViolations(plant('SUPPLY', 'impaired', 'short', { line: 'Waste nothing at {house}.', needs: [], excludes: ['crisis: bazaar'] })).some((x) => x.startsWith("needs: 'crisis: bazaar'"))).toBe(true);
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

/** Every violation of the tie table against the tie types and the TIES cells; [] when lawful. */
function tieTableViolations(table, types, tiesCells) {
  const out = [];
  for (const t of types) if (!(t in table)) out.push(`missing: tie type '${t}' has no entry`);
  for (const [t, ends] of Object.entries(table)) {
    if (!types.includes(t)) out.push(`unknown: '${t}' is not a tie type the record can produce`);
    if (!ends || Object.keys(ends).sort().join(',') !== 'from,to') { out.push(`shape: '${t}' must name exactly from and to`); continue; }
    for (const end of ['from', 'to']) if (!tiesCells.includes(ends[end])) out.push(`target: '${t}'.${end} -> '${ends[end]}' is not a TIES sub-kind`);
  }
  const reached = new Set(Object.values(table).flatMap((e) => [e?.from, e?.to]));
  for (const c of tiesCells) if (!reached.has(c)) out.push(`orphan: TIES cell '${c}' is reached by no tie type`);
  return out;
}

describe('goal families — the tie types onto the TIES sub-kinds', () => {
  const types = Object.keys(RELATIONSHIP_STRENGTHS);
  const cells = Object.keys(GOAL_FAMILY_LINES.TIES);

  test('TIE_TYPE_TO_GOAL_SUBKIND is total over the imported tie types, every target a real TIES sub-kind, no cell orphaned', () => {
    expect(types.length).toBeGreaterThan(0);
    expect(tieTableViolations(TIE_TYPE_TO_GOAL_SUBKIND, types, cells)).toEqual([]);
    expect(Object.isFrozen(TIE_TYPE_TO_GOAL_SUBKIND)).toBe(true);
  });

  test('CONTROL: a planted unknown tie type reds the checker', () => {
    const planted = { ...TIE_TYPE_TO_GOAL_SUBKIND, courtship: { from: 'family', to: 'family' } };
    expect(tieTableViolations(planted, types, cells).some((x) => x.startsWith("unknown: 'courtship'"))).toBe(true);
  });

  test('CONTROL: a dropped type and a bad target each red the checker', () => {
    const { political: _dropped, ...missing } = TIE_TYPE_TO_GOAL_SUBKIND;
    expect(tieTableViolations(missing, types, cells).some((x) => x.startsWith("missing: tie type 'political'"))).toBe(true);
    const bad = { ...TIE_TYPE_TO_GOAL_SUBKIND, respect: { from: 'friend', to: 'ally' } };
    expect(tieTableViolations(bad, types, cells).some((x) => x.startsWith("target: 'respect'.from -> 'friend'"))).toBe(true);
  });
});

/** The UNCANNY gate: every line needs magic ON; a slot or a noun the town holds is declared. */
const UNCANNY_DECLARES = [
  [/\{shrine\}/, 'sacredHouse'], [/\{priest\}/, 'priest'], [/\briver\b/i, 'river'], [/\b(wood|forest)\b/i, 'terrain: forest'],
];
function uncannyViolations(cells) {
  const out = [];
  for (const [sub, vantages] of Object.entries(cells)) for (const [v, lines] of Object.entries(vantages)) for (const e of lines) {
    const text = textOf(e); const needs = typeof e === 'string' ? [] : e.needs;
    if (!needs.includes('magic')) out.push(`gate: UNCANNY.${sub}.${v} does not need magic — ${text}`);
    for (const [re, atom] of UNCANNY_DECLARES) if (re.test(text) && !needs.includes(atom)) out.push(`declare: '${atom}' undeclared — ${text}`);
  }
  return out;
}

describe('goal families — UNCANNY, the magic gate', () => {
  test('every UNCANNY line needs magic ON, and declares the town nouns it names', () => {
    expect(uncannyViolations(GOAL_FAMILY_LINES.UNCANNY)).toEqual([]);
  });

  test('the gate atom is the vocabulary\'s own magic atom, with a reader', () => {
    expect(() => assertDeclarable('magic')).not.toThrow();
  });

  test('CONTROL: a planted ungated line and a planted undeclared river each red the checker', () => {
    const plantedA = plant('UNCANNY', 'haunting', 'short', 'Find a witch to lift the curse this season.');
    expect(uncannyViolations(plantedA.UNCANNY).some((x) => x.startsWith('gate: UNCANNY.haunting.short'))).toBe(true);
    const plantedB = plant('UNCANNY', 'bargain', 'long', { line: 'Drown the bargain in the river for good.', needs: ['magic'] });
    expect(uncannyViolations(plantedB.UNCANNY).some((x) => x.startsWith("declare: 'river'"))).toBe(true);
  });
});

/** The cells with the reserve's lines appended to each named cell (a reserve cell the cells lack is kept as its own). */
const withReserve = (reserve) => {
  const copy = JSON.parse(JSON.stringify(GOAL_FAMILY_LINES));
  for (const [f, subs] of Object.entries(reserve)) for (const [k, vs] of Object.entries(subs)) for (const [v, lines] of Object.entries(vs)) {
    ((copy[f] ??= {})[k] ??= {})[v] = [...(copy[f][k][v] || []), ...lines];
  }
  return copy;
};
/** Every reserve cell the cells do not hold, as `family.kind.vantage`. */
const orphanReserveCells = (reserve) => Object.entries(reserve).flatMap(([f, subs]) => Object.entries(subs).flatMap(([k, vs]) => Object.keys(vs)
  .filter((v) => !Array.isArray(GOAL_FAMILY_LINES[f]?.[k]?.[v])).map((v) => `${f}.${k}.${v}`)));

describe('goal families — the reserve lines (GOALS-1, apart from the cells)', () => {
  test('the reserve holds its approved count, cell by cell, 41 in all, and none of it is in the cells\' totals', () => {
    const actual = Object.fromEntries(Object.entries(GOAL_RESERVE_LINES).map(([f, subs]) => [f,
      Object.fromEntries(Object.entries(subs).map(([s, v]) => [s, Object.fromEntries(Object.entries(v).map(([k, lines]) => [k, lines.length]))]))]));
    expect(actual).toEqual(EXPECTED_RESERVE);
    expect(Object.values(GOAL_RESERVE_LINES).reduce((n, subs) => n + count(subs), 0)).toBe(41);
    const totals = Object.fromEntries(Object.entries(GOAL_FAMILY_LINES).map(([f, subs]) => [f, count(subs)]));
    expect(totals).toEqual(EXPECTED_TOTALS);
  });

  test('every reserve cell names an existing family, sub-kind and vantage of the cells', () => {
    expect(Object.keys(GOAL_RESERVE_LINES).length).toBeGreaterThan(0);
    expect(orphanReserveCells(GOAL_RESERVE_LINES)).toEqual([]);
  });

  test('the reserve is lawful alone, and with the cells: its family\'s slots only, no line twice anywhere', () => {
    expect(shapeViolations(GOAL_RESERVE_LINES)).toEqual([]);
    expect(shapeViolations(withReserve(GOAL_RESERVE_LINES))).toEqual([]);
  });

  test('the reserve is frozen to its lines', () => {
    expect(Object.isFrozen(GOAL_RESERVE_LINES)).toBe(true);
    for (const subs of Object.values(GOAL_RESERVE_LINES)) for (const v of Object.values(subs)) for (const lines of Object.values(v)) expect(Object.isFrozen(lines)).toBe(true);
  });

  test('CONTROL: a reserve line repeating a cell line, a reserve line, a foreign slot, or a cell the cells lack, each red the checker', () => {
    const dupCell = { TIES: { rival_enemy: { long: [textOf(GOAL_FAMILY_LINES.TIES.rival_enemy.long[0])] } } };
    expect(shapeViolations(withReserve(dupCell)).some((x) => x.startsWith('duplicate:'))).toBe(true);
    const first = textOf(GOAL_RESERVE_LINES.TIES.rival_enemy.long[0]);
    const dupReserve = { TIES: { rival_enemy: { short: [first], long: [first] } } };
    expect(shapeViolations(dupReserve).some((x) => x.startsWith('duplicate:'))).toBe(true);
    expect(shapeViolations({ TIES: { rival_enemy: { long: ['Stand against {rival} with {other} this season.'] } } }).some((x) => x.startsWith('slot: {rival} is not in GOAL_SLOTS.TIES'))).toBe(true);
    expect(orphanReserveCells({ TIES: { rival_enemy: { middle: ['Wait on {other}.'] } }, POWER: { allied: { long: ['Help {rival}.'] } } })).toEqual(['TIES.rival_enemy.middle', 'POWER.allied.long']);
  });

  test('the harsh-tie map names only reserve TIES lines, real tie types and their real strengths', () => {
    const reserveTies = Object.values(GOAL_RESERVE_LINES.TIES || {}).flatMap((vs) => Object.values(vs).flat().map(textOf));
    const entries = Object.entries(GOAL_LINE_NOT_ON_TIES);
    expect(entries.length).toBeGreaterThan(0);
    for (const [line, refused] of entries) {
      expect(reserveTies, line).toContain(line);
      for (const [type, strengths] of Object.entries(refused)) {
        expect(Object.keys(RELATIONSHIP_STRENGTHS), `${line}: ${type}`).toContain(type);
        for (const s of strengths) expect(RELATIONSHIP_STRENGTHS[type], `${line}: ${type} ${s}`).toContain(s);
      }
    }
    expect(Object.isFrozen(GOAL_LINE_NOT_ON_TIES)).toBe(true);
  });
});
