/**
 * tests/copy/proseLeak.test.js — E1: THE NO-ENGINE-TOKEN-IN-PROSE WALKER
 * (fix wave 3 — the class-kill for engine tokens reaching reader prose).
 *
 * Renders each reader-facing COMPOSER over a deterministic fixture world and
 * scans the OUTPUT prose for engine-token leak classes:
 *   flagKey — a camelCase simulationRules boolean flag key (set built live from
 *             DEFAULT_SIMULATION_RULES + every preset, so new flags auto-join);
 *   tick    — a bare `tick <n>` counter (the reader gets calendar dates;
 *             src/domain/display/humanizeEngineTokens.js is the chokepoint);
 *   week    — a bare `week <n>` NOT in the sanctioned span idiom `week k of N`;
 *   schema  — goal-engine / pulse schema field names in prose;
 *   rawId   — a raw settlement/npc id token (uuid, npc_<n>, generated_<X>,
 *             candidate.* / npc_ladder.* event ids);
 *   emDash  — U+2014 in composer OUTPUT (VOICE_AND_TONE §3; source-side coverage
 *             lives in voiceMechanics.test.js).
 *
 * RATCHET DISCIPLINE (the errorCopyBaseline idiom): EXPECTED_LEAKS is the
 * committed CURRENT violation set — exact equality, so a NEW leak fails loudly
 * and a FIXED leak must be struck (the win is banked). It may only shrink.
 * THE ONE REGEN retired the final letter entries; the empty exact set below now
 * makes every future composer leak a hard regression.
 *
 * E-E EXTENSION (docs/THE_APLUS_EXECUTION_ARCHITECTURE.md §E-E): the above only
 * ever scanned COMPOSER OUTPUT (letter/worldBook/chronicle/decrees) — it never
 * looked at src/**\/*.jsx component source, where a leak could be hardcoded
 * directly into a component's JSX text or attributes instead of composed
 * dynamically. The "component JSX engine-token scan" describe block below
 * closes that gap with the same 4 non-punctuation detectors (flagKey, tick,
 * week, schema, rawId — emDash is intentionally OUT of scope here: it stays
 * voiceMechanics.test.js's Tier 3, so the same violation is never asserted
 * twice under two different budgets) via a real JSX-aware AST walk
 * (tests/helpers/jsxLiteralWalk.js — same parser voiceMechanics Tier 3 uses).
 * SHRINK-ONLY, baselined in tests/copy/.prose-leak-jsx-baseline.json.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { composeChroniclersLetter, letterToPlainText } from '../../src/domain/display/chroniclersLetter.js';
import { collectWorldBook } from '../../src/utils/generateWorldBook.js';
import { advanceEntries } from '../../src/domain/display/chronicleGraph.js';
import { chronicleForAdvance } from '../../src/domain/display/chronicleReadModel.js';
import { decreesForAdvance } from '../../src/domain/display/decreeTracker.js';
import { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { extractJsxProseStrings, scanJsxTree } from '../helpers/jsxLiteralWalk.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const JSX_BASELINE_PATH = join(ROOT, 'tests/copy/.prose-leak-jsx-baseline.json');
const UPDATE = process.env.UPDATE_VOICE_BASELINE === '1';

// ── The flag-key set (live from simulationRules.js — new flags auto-covered) ──
const FLAG_KEYS = (() => {
  const keys = new Set(
    Object.keys(DEFAULT_SIMULATION_RULES).filter(
      (k) => typeof (/** @type {Record<string, unknown>} */ (DEFAULT_SIMULATION_RULES)[k]) === 'boolean',
    ),
  );
  for (const preset of Object.values(SIMULATION_RULE_PRESETS)) {
    for (const [k, v] of Object.entries(preset.rules)) if (typeof v === 'boolean') keys.add(k);
  }
  return keys;
})();

// ── Detectors: name → (text) => matched tokens ───────────────────────────────
const UUID_RE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const SCHEMA_RE = /\b(?:shortGoal|longGoal|goalProgress|roleArchetype|candidateType|ruleId|sourceEventId|impactKind|channelType|dramaClass|targetSaveId|settlementIds|pulseHistory|wizardNews|proposalPayload|applyMode)\b/g;

/** @type {Record<string, (text: string) => string[]>} */
const DETECTORS = {
  flagKey: (text) => {
    const out = [];
    for (const m of text.matchAll(/\b[a-z][a-zA-Z0-9]*\b/g)) if (FLAG_KEYS.has(m[0])) out.push(m[0]);
    return out;
  },
  tick: (text) => [...text.matchAll(/\btick\s+\d+/gi)].map((m) => m[0].toLowerCase()),
  // `week k of N` is the sanctioned span idiom (an honest relative label, not an
  // engine counter) — only a bare `week <n>` leaks.
  week: (text) => [...text.matchAll(/\bweek\s+\d+\b(?!\s+of\s+\d)/gi)].map((m) => m[0].toLowerCase()),
  schema: (text) => [...text.matchAll(SCHEMA_RE)].map((m) => m[0]),
  rawId: (text) => [
    ...[...text.matchAll(UUID_RE)].map(() => '<uuid>'),
    ...[...text.matchAll(/\bnpc_\d+\b/g)].map((m) => m[0]),
    ...[...text.matchAll(/\bgenerated_[A-Za-z0-9_]+\b/g)].map((m) => m[0]),
    ...[...text.matchAll(/\b(?:candidate|npc_ladder|realm_verb)\.[A-Za-z0-9_.]+/g)].map((m) => m[0]),
  ],
  emDash: (text) => (text.includes('—') ? ['—'] : []),
};

/** Scan a composer's prose strings; return sorted unique `detector|token` hits. */
function scan(proseStrings) {
  const hits = new Set();
  for (const s of proseStrings) {
    if (typeof s !== 'string' || !s) continue;
    for (const [name, detect] of Object.entries(DETECTORS)) {
      for (const tok of detect(s)) hits.add(`${name}|${tok}`);
    }
  }
  return [...hits].sort();
}

// ── Fixture world (deterministic; no rng, no clock) ──────────────────────────

const LETTER_FIXTURE = {
  wizardNews: {
    currentTick: 14,
    entries: [
      { id: 'w1', tick: 8, significance: 'major', impactKind: 'conflict_pressure', headline: 'The border burns', summary: 'Levies march on the fords.' },
      { id: 't1', tick: 9, significance: 'notable', impactKind: 'import_shortage', headline: 'Grain runs short', summary: 'The granary price doubles.' },
      { id: 'm1', tick: 7, significance: 'major', impactKind: 'generosity_relief', headline: 'Aid reaches the starving' },
    ],
  },
  lastReadTick: 4,
  simulationRules: { warLayerEnabled: true, faithSpreadEnabled: true },
  flagsSeen: ['warLayerEnabled'], // R-16 lit ⇒ the deepened section renders
};

const WORLD_BOOK_CAMPAIGN = {
  name: 'The Salt Road Ledger',
  description: 'A realm held together by grain barges and grudges.',
  settlementIds: ['save_a', 'save_b'],
  wizardNews: {
    entries: [
      { tick: 8, headline: 'The border burns', summary: 'Levies march on the fords.', significance: 'major' },
      { tick: 11, headline: 'The wharves overflow', summary: 'Trade swells past the quay.', significance: 'notable', source: 'table' },
    ],
  },
};
const WORLD_BOOK_SAVES = [
  {
    id: 'save_a', name: 'Midwater',
    settlement: {
      name: 'Midwater', tier: 'town', population: 2400, culture: 'river-trade',
      history: { historicalCharacter: 'A toll town that outlived its toll.' },
      institutions: [{ name: 'The Grain Court' }],
      npcs: [{ name: 'Serra Voss', role: 'harbourmaster', influence: 3 }],
      plotHooks: ['The toll ledger names a dead man as its keeper.'],
      neighbourNetwork: [{ id: 'save_b', relationshipType: 'rival' }],
    },
  },
  {
    id: 'save_b', name: 'Thornfield',
    settlement: { name: 'Thornfield', tier: 'village', population: 600, culture: 'upland-herding', institutions: [], npcs: [] },
  },
];

const ADVANCE_WORLD_STATE = {
  pulseHistory: [{
    tick: 52,
    selectedOutcomes: [
      { id: 'o_war', candidateType: 'stressor_birth_siege', severity: 0.8, headline: 'The siege of Midwater', summary: 'The walls hold through the frost.', stressor: { id: 's1', type: 'siege', affectedSettlementIds: ['save_a'] }, targetSaveId: 'save_a', settlementIds: ['save_a'], populationDeltas: { save_a: -120 } },
      { id: 'realm_verb.embargo.save_a.30.h1', applyMode: 'proposal', proposalPayload: { kind: 'trade_embargo' }, headline: 'The embargo of Thornfield', summary: 'No wagon crosses the ford.', targetSaveId: 'save_a', settlementIds: ['save_a'] },
    ],
    impactDigest: [],
  }],
};

// ── Compose each surface once ────────────────────────────────────────────────

function letterProse() {
  const letter = composeChroniclersLetter(LETTER_FIXTURE);
  return [letterToPlainText(letter)];
}

function worldBookProse() {
  const book = collectWorldBook(WORLD_BOOK_CAMPAIGN, WORLD_BOOK_SAVES, { mode: 'dm' });
  const out = [book.title, book.description];
  for (const e of book.chronicle) out.push(e.headline, e.summary);
  for (const d of book.dossiers) {
    out.push(d.overview, ...d.hooks);
    for (const n of d.npcs) out.push(n.role);
  }
  for (const r of book.receipts) for (const src of r.sources) out.push(src.effect, src.detail);
  return out;
}

function advanceEntry() {
  const entries = advanceEntries(ADVANCE_WORLD_STATE);
  if (!entries.length) throw new Error('fixture produced no advance entries');
  return entries[0];
}

function chronicleProse() {
  const c = chronicleForAdvance(advanceEntry(), undefined);
  const out = [c.headline];
  for (const ch of c.chapters || []) out.push(ch.label);
  for (const t of c.threads || []) {
    out.push(t.title, t.arc?.began, t.arc?.turned, t.arc?.stands);
    for (const b of t.beats || []) out.push(b.headline, b.summary);
  }
  for (const v of c.deputyDiary?.verdicts || []) out.push(v.headline);
  for (const e of c.events || []) out.push(e.headline, e.summary);
  return out;
}

function decreeProse() {
  const d = decreesForAdvance(advanceEntry(), undefined);
  const out = [];
  const one = (dec) => out.push(dec.kind, dec.finding, dec.landing?.label, dec.receipt?.headline);
  for (const c of d.clusters) { out.push(c.jointStory, c.conflictText); c.decrees.forEach(one); }
  d.singletons.forEach(one);
  d.nulls.forEach(one);
  return out;
}

// ── THE BASELINE — current, known, owner-gated debt. SHRINK-ONLY. ────────────
// The One-Regen letter-humanizer pass retired the final three leak classes:
// calendar labels replace raw ticks, flag names cross the shared presentation
// boundary, and the house-punctuation rewrite removes U+2014.
const EXPECTED_LEAKS = {
  letter: [],
  worldBook: [],
  chronicle: [],
  decrees: [],
};

describe('E1 — no engine token reaches reader prose (shrink-only ratchet)', () => {
  const surfaces = {
    letter: letterProse,
    worldBook: worldBookProse,
    chronicle: chronicleProse,
    decrees: decreeProse,
  };

  for (const [name, compose] of Object.entries(surfaces)) {
    it(`${name}: leak set exactly equals the committed baseline`, () => {
      const found = scan(compose());
      // Mismatch directions: a NEW token leaked (humanize it at the composer
      // boundary — humanizeEngineTokens.js), or a FIXED leak still listed
      // (strike it from EXPECTED_LEAKS to bank the win).
      expect(found).toEqual([...EXPECTED_LEAKS[name]].sort());
    });
  }

  it('the surfaces actually composed prose (fixtures did not silently go empty)', () => {
    expect(letterProse()[0].length).toBeGreaterThan(100);
    expect(worldBookProse().filter(Boolean).length).toBeGreaterThanOrEqual(8);
    expect(chronicleProse().filter(Boolean).length).toBeGreaterThanOrEqual(3);
    expect(decreeProse().filter(Boolean).length).toBeGreaterThanOrEqual(2);
  });

  // Detector self-tests: green means something only if the scanners catch a
  // seeded leak (negative results need positive controls).
  describe('detectors discriminate (positive controls)', () => {
    it('catches every leak class in a seeded string', () => {
      const seeded = scan([
        'The warLayerEnabled flag lit at tick 12 in week 3 for npc_4 ' +
        '(candidate.npc.goal_culmination.x.9, 123e4567-e89b-42d3-a456-426614174000) — goalProgress rose.',
      ]);
      expect(seeded).toContain('flagKey|warLayerEnabled');
      expect(seeded).toContain('tick|tick 12');
      expect(seeded).toContain('week|week 3');
      expect(seeded).toContain('rawId|npc_4');
      expect(seeded).toContain('rawId|<uuid>');
      expect(seeded).toContain('schema|goalProgress');
      expect(seeded).toContain('emDash|—');
    });
    it('does NOT flag the sanctioned `week k of N` span idiom or calendar dates', () => {
      expect(scan(['landed in week 3 of 13, in the winter of year 2'])).toEqual([]);
    });
  });
});

// ── E-E: the JSX extension — engine-token leaks hardcoded into components ────
// The 4 non-punctuation detector classes (flagKey/tick/week/schema/rawId) run
// against the SAME string surfaces voiceMechanics Tier 3 extracts (JSXText,
// string Literal, template-cooked-segment) across every src/**/*.jsx file.
// emDash is deliberately excluded — voiceMechanics.test.js Tier 3 already
// owns that ban for JSX so it is never double-counted under two budgets.
const JSX_TOKEN_DETECTORS = { flagKey: DETECTORS.flagKey, tick: DETECTORS.tick, week: DETECTORS.week, schema: DETECTORS.schema, rawId: DETECTORS.rawId };

/** @param {string[]} strings @returns {{flagKey:number,tick:number,week:number,schema:number,rawId:number}} */
function countJsxTokenLeaks(strings) {
  const counts = { flagKey: 0, tick: 0, week: 0, schema: 0, rawId: 0 };
  for (const s of strings) {
    for (const [name, detect] of Object.entries(JSX_TOKEN_DETECTORS)) {
      counts[name] += detect(s).length;
    }
  }
  return counts;
}

const JSX_SCAN = scanJsxTree(join(ROOT, 'src'), ROOT);

/** @type {Record<string, {flagKey:number,tick:number,week:number,schema:number,rawId:number}>} */
const currentJsxLeaks = {};
for (const { rel, strings } of JSX_SCAN) {
  const c = countJsxTokenLeaks(strings);
  if (Object.values(c).some((n) => n > 0)) currentJsxLeaks[rel] = c;
}

if (UPDATE) {
  writeFileSync(JSX_BASELINE_PATH, JSON.stringify(currentJsxLeaks, null, 1) + '\n');
}

const ZERO_LEAKS = { flagKey: 0, tick: 0, week: 0, schema: 0, rawId: 0 };

describe('E-E proseLeak JSX extension — component engine-token ratchet (shrink-only)', () => {
  it('the committed JSX baseline exists', () => {
    expect(
      existsSync(JSX_BASELINE_PATH),
      'baseline missing — for an APPROVED sweep run: UPDATE_VOICE_BASELINE=1 npx vitest run tests/copy/proseLeak.test.js',
    ).toBe(true);
  });

  it('per-file JSX engine-token debt exactly matches the baseline (grew ⇒ humanize it; fell ⇒ bank the win)', () => {
    /** @type {Record<string, {flagKey:number,tick:number,week:number,schema:number,rawId:number}>} */
    const baseline = JSON.parse(readFileSync(JSX_BASELINE_PATH, 'utf8'));
    /** @type {string[]} */
    const diffs = [];
    const keys = new Set([...Object.keys(baseline), ...Object.keys(currentJsxLeaks)]);
    for (const k of [...keys].sort()) {
      const b = baseline[k] || ZERO_LEAKS;
      const c = currentJsxLeaks[k] || ZERO_LEAKS;
      const changed = Object.keys(ZERO_LEAKS).some((d) => b[d] !== c[d]);
      if (changed) {
        diffs.push(`${k}: baseline ${JSON.stringify(b)} → current ${JSON.stringify(c)}`);
      }
    }
    expect(diffs, `\n${diffs.join('\n')}\n`).toEqual([]);
  });

  it('total JSX engine-token debt never grows past its committed budget', () => {
    // FINDING (E-E build, 2026-07-21): the measured floor is 29 flagKey hits
    // across exactly 3 files (src/components/map/SimulationRulesAxes.jsx,
    // SimulationRulesDialog.jsx, src/components/settlements/LivingWorldGates.jsx)
    // and ZERO tick/week/schema/rawId leaks anywhere in components. Read all 3
    // before assuming these are leaks: every one is SETTINGS/GATING UI — a
    // flag-key -> human-label toggle table (e.g. `['momentumEnabled',
    // 'Momentum', '...']`) or a gates array (`key: 'warLayerEnabled'`) — where
    // displaying the real flag key is the CORRECT behavior (it is a config
    // editor, not narrative prose). E1's own ban is scoped to READER PROSE
    // reached through a composer; a settings panel is a different surface with
    // a different contract. Kept as real, uninspected debt rather than
    // special-cased by directory (that would be a judgment call outside this
    // enforcer's mandate) — but recorded here so nobody re-discovers it as a
    // mystery. NEVER raise.
    const BUDGET = { flagKey: 29, tick: 0, week: 0, schema: 0, rawId: 0 };
    const totals = Object.values(currentJsxLeaks).reduce((t, c) => {
      for (const k of Object.keys(ZERO_LEAKS)) t[k] += c[k];
      return t;
    }, { ...ZERO_LEAKS });
    for (const k of Object.keys(ZERO_LEAKS)) {
      expect(totals[k], `${k}: ${totals[k]} > budget ${BUDGET[k]}`).toBeLessThanOrEqual(BUDGET[k]);
    }
  });

  it('the JSX detectors discriminate (positive control): catches a seeded leak in JSX text and stays quiet on clean JSX', () => {
    const seeded = [
      "import React from 'react';",
      'export function Seed() {',
      '  return (',
      '    <p>',
      '      The warLayerEnabled flag lit at tick 12 in week 3 for npc_4',
      '      (candidate.npc.goal_culmination.x.9) — goalProgress rose.',
      '    </p>',
      '  );',
      '}',
    ].join('\n');
    const strings = extractJsxProseStrings(seeded);
    expect(strings).not.toBeNull();
    const counts = countJsxTokenLeaks(/** @type {string[]} */ (strings));
    expect(counts.flagKey).toBeGreaterThanOrEqual(1);
    expect(counts.tick).toBeGreaterThanOrEqual(1);
    expect(counts.week).toBeGreaterThanOrEqual(1);
    expect(counts.schema).toBeGreaterThanOrEqual(1);
    expect(counts.rawId).toBeGreaterThanOrEqual(1);
  });

  it('does NOT flag clean JSX with no engine tokens', () => {
    const clean = 'export const Seed = () => <p>plain, clean, no tells</p>;';
    const strings = extractJsxProseStrings(clean);
    expect(strings).not.toBeNull();
    const counts = countJsxTokenLeaks(/** @type {string[]} */ (strings));
    expect(counts).toEqual(ZERO_LEAKS);
  });
});
