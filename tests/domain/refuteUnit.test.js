/**
 * tests/domain/refuteUnit.test.js — THE TIER-0 REFUTER'S PINS (W1 deliverable 1).
 *
 * Four kinds of arm here, and the second and third are the ones that matter.
 *
 * 1. EVERY LIMB WITH A NEGATIVE CONTROL. A unit built to trip it, and the same unit repaired.
 *    An arm that cannot be made to fail is standing over nothing.
 * 2. THE LIFTED LISTS, PINNED SOURCE-FOR-SOURCE. `refuteUnit.js` copies four lists out of files
 *    a domain leaf may not import (two test suites and the kernel). Every copy is re-derived
 *    here from the original's own source text, so a copy cannot drift in silence.
 * 3. ⭐⭐ THE MOVED-CLAIM CATCH TABLE. Fifty lines a strong model actually wrote with a frozen
 *    claim in front of it, from two audits, each with the repaired line beside it. The table
 *    below records WHICH ARM CATCHES EACH and is asserted EXACTLY, so an arm that later reaches
 *    further reds and the row is re-recorded as a win. It is also the honest inventory of what
 *    tier 0 cannot reach: 27 of the 50 are caught by NO ARM, and they are almost entirely the
 *    CERTAINTY, QUANTIFIER and SCOPE classes the module's own header says have no shape.
 * 4. THE CORPUS FLOOR. The landed DS-DEF-2 units are PASS or WITHHELD, with an EXACT exception
 *    set of two measured families that are real corpus debt rather than instrument noise.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AGNOSTIC_TELLS, ELAPSED_COURSE, LEAK_CLASSES, PROVENANCE_CLAUSE, REFUTE_ARMS,
  ROLE_SLOT_WORDS, VOICE_BARS, bodiesOfCard, fieldPathsOfPool, groundOfCard, holdersFromCard,
  poolOfCard, refuteTab, institutionsOfCard, refuteUnit, seatedRolesOf, unitRowOf,
  vocabularyOfPool,
} from '../../src/domain/prose/refuteUnit.js';
import { FIELD_SYNONYM_ROWS } from '../../src/domain/prose/fieldSynonyms.js';
import { OFFICE_NOUN_CANDIDATES } from '../../src/domain/prose/entryLexicons.js';
import { walkComposed, composedVerdictOf } from '../../src/domain/prose/composedWalker.js';
import { ROLE_SLOTS } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { CLAUSE_DETECTORS } from '../../src/domain/prose/moveGrammar.js';
import { townCard } from '../../src/domain/prose/townCard.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus } from '../helpers/goldenMasterCorpus.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const STATIC_CARD = JSON.parse(readFileSync(join(ROOT, 'docs/content/scribe-static-card.json'), 'utf8'));
const MOVED = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/scribe-moved-claims.json'), 'utf8'));
const VOICE_SUITE = readFileSync(join(ROOT, 'tests/copy/voiceMechanics.test.js'), 'utf8');
const LEAK_SUITE = readFileSync(join(ROOT, 'tests/copy/proseLeak.test.js'), 'utf8');

const townOf = (seed, cfg) => generateSettlementPipeline(
  cfg || {
    settType: 'town', culture: 'germanic', terrainOverride: 'river', roadOverride: 'road', civOverride: 'civilized',
  },
  null,
  { seed, customContent: {} },
);
const cardOf = (s, tab = 'defense') => townCard(s, { tab, audience: 'dm', staticCard: STATIC_CARD });

/** The one town every text-only arm is driven against, so a fixture line is judged once. */
const BASE = townOf('refute-unit-pins');
const BASE_CARD = cardOf(BASE);

/** Declared slots read off the text itself, which is what an annex row declares. */
const slotsIn = (text) => [...new Set(
  [...String(text).matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]),
)];

/** One free-text line through the refuter with no pool identity, as the fixtures are. */
function judge(text, corpus) {
  return refuteUnit(
    {
      text, stance: 'spine', blockId: '', poolKey: '', slots: slotsIn(text),
    },
    BASE_CARD,
    corpus ? { corpusUnit: { text: corpus } } : {},
  );
}
const armsOf = (r, channel) => r.findings.filter((f) => f.channel === channel).map((f) => `${f.arm}/${f.subject}`);
/** The catch table's own cell: the FAIL arms, else the WITHHELD arms, else no arm. */
function caughtBy(text, corpus) {
  const r = judge(text, corpus);
  const fails = armsOf(r, 'FAIL');
  if (fails.length) return fails.join(' + ');
  const withheld = armsOf(r, 'WITHHELD');
  if (withheld.length) return `W:${withheld.join(' + ')}`;
  return 'no arm';
}

describe('refuteUnit — the roster is complete and every channel is reachable', () => {
  it('the roster names every arm exactly once and gives each a ground', () => {
    const names = REFUTE_ARMS.map((a) => a.arm);
    expect(new Set(names).size).toBe(names.length);
    expect(REFUTE_ARMS.every((a) => ['text', 'card', 'input'].includes(a.ground))).toBe(true);
  });

  it('a clean unit on a real card reaches PASS, so the instrument is not a blanket refusal', () => {
    const r = judge('The walls are kept and no soldiers of the town stand behind them.');
    expect(armsOf(r, 'FAIL')).toEqual([]);
    expect(['PASS', 'WITHHELD']).toContain(r.verdict);
  });

  it('all four channels are produced by one ordinary call', () => {
    const r = judge('The elders say the walls are kept.');
    const channels = new Set(r.findings.map((f) => f.channel));
    expect([...channels].sort()).toEqual(['FAIL', 'NOT-EXECUTABLE', 'REPORT', 'WITHHELD']);
  });
});

describe('refuteUnit — the lifted lists are pinned to their originals', () => {
  it('the setting-agnostic tell ban is byte-identical to voiceMechanics AGNOSTIC_TELLS', () => {
    const block = VOICE_SUITE.slice(
      VOICE_SUITE.indexOf('const AGNOSTIC_TELLS = Object.freeze(['),
      VOICE_SUITE.indexOf('const AGNOSTIC_TELLS_DEFERRED'),
    );
    expect(block.length).toBeGreaterThan(100);
    const missing = AGNOSTIC_TELLS.filter((t) => !block.includes(t.re.source));
    expect(missing.map((t) => t.name)).toEqual([]);
    // AND THE OTHER DIRECTION: every row of the original is carried here, so the copy cannot
    // silently drop an arm. The suite's rows are `{ name: '…', re: /…/ }` one per line.
    const originals = [...block.matchAll(/\{ name: '([^']+)', re: (\/.*\/[a-z]*) \}/g)];
    expect(originals.length).toBe(AGNOSTIC_TELLS.length);
    for (const [, name, source] of originals) {
      const held = AGNOSTIC_TELLS.find((t) => t.name === name);
      expect(held, `the copy is missing the row "${name}"`).toBeTruthy();
      expect(String(held.re)).toBe(source);
    }
  });

  it('the leak classes are byte-identical to proseLeak DETECTORS, and emDash is deliberately absent', () => {
    // ⛔ THE ALTERNATIVES ARE PINNED APART, because the suite spells `rawId` as four separate
    // matchAll calls and this module folds them into one alternation for one pass over the text.
    // Pinning the folded source would pin a spelling the original never had.
    for (const leak of LEAK_CLASSES) {
      for (const branch of leak.re.source.split('|')) {
        if (branch.length < 6) continue;
        expect(
          LEAK_SUITE.includes(branch),
          `proseLeak no longer spells this branch of ${leak.name}: ${branch}`,
        ).toBe(true);
      }
    }
    expect(LEAK_CLASSES.map((l) => l.name)).not.toContain('emDash');
    expect(VOICE_BARS.map((b) => b.arm)).toContain('BAR-emdash');
  });

  it('the PROVENANCE clause is the classifier\'s own detector, source-for-source', () => {
    const own = CLAUSE_DETECTORS.find((d) => d.move === 'PROVENANCE');
    expect(PROVENANCE_CLAUSE.source).toBe(own.re.source);
  });

  it('the role-slot words are the kernel\'s own ROLE_SLOTS', () => {
    expect([...ROLE_SLOT_WORDS].sort()).toEqual([...ROLE_SLOTS].sort());
  });
});

describe('refuteUnit — every arm with its negative control', () => {
  /** @type {Array<[string, string, string, string]>} arm, subject fragment, tripping text, repaired text */
  const CONTROLS = [
    ['BAR-emdash', 'mechanical', 'The walls are kept — and nobody stands behind them.', 'The walls are kept and nobody stands behind them.'],
    ['BAR-bang', 'mechanical', 'The walls are kept!', 'The walls are kept.'],
    ['BAR-digit', 'mechanical', 'The walls are kept by 40 men.', 'The walls are kept by a handful of men.'],
    ['BAR-semicolon', 'mechanical', 'The walls are kept; nobody stands behind them.', 'The walls are kept and nobody stands behind them.'],
    ['BAR-contraction', 'mechanical', 'The walls are kept and the town doesn’t man them.', 'The walls are kept and the town does not man them.'],
    ['BAR-first-person', 'mechanical', 'The walls are kept, we are told.', 'The walls are kept, the hall says.'],
    ['BAR-future', 'mechanical', 'The walls will be kept.', 'The walls are kept.'],
    ['TELL', 'currency GP', 'A station runs 250 to 10,000 GP.', 'A station runs from cheap to dear.'],
    ['LEAK', 'tick', 'The walls were mended at tick 40.', 'The walls were mended last season.'],
    ['NON-MOVE', 'MEANING', 'The walls are kept, which means the town is safe.', 'The walls are kept.'],
    ['NON-MOVE', 'VERDICT', 'The walls are kept, wisely.', 'The walls are kept.'],
    ['NON-MOVE', 'FIGURE', 'The walls stand like a drawn blade.', 'The walls stand.'],
    ['NON-MOVE', 'SAYING', 'As the saying goes, the walls are kept.', 'The walls are kept.'],
    ['WALL-6', 'which-tail', 'The walls are kept, which the hall pays for.', 'The walls are kept and the hall pays for them.'],
  ];

  for (const [arm, fragment, bad, good] of CONTROLS) {
    it(`${arm} (${fragment}) convicts the tripping unit and clears the repaired one`, () => {
      const hit = judge(bad).findings.filter((f) => f.arm === arm && f.channel === 'FAIL');
      expect(hit.length, `${arm} did not fire on: ${bad}`).toBeGreaterThan(0);
      expect(hit.some((f) => `${f.subject} ${f.value}`.toLowerCase().includes(fragment.toLowerCase())
        || f.subject.toLowerCase().includes(fragment.toLowerCase()))).toBe(true);
      const clear = judge(good).findings.filter((f) => f.arm === arm && f.channel === 'FAIL');
      expect(clear.map((f) => f.subject), `${arm} still fires on the repaired line: ${good}`).toEqual([]);
    });
  }

  it('REFERENT-role convicts an office the card does not seat and clears one it does', () => {
    const seated = seatedRolesOf(BASE_CARD);
    expect(seated.length).toBeGreaterThan(0);
    // ⛔ THE NOUN IS CHOSEN AGAINST THIS CARD AND NOT FROM MEMORY. The first draft used
    // `bailiff` because it heads the office-noun list, and this town SEATS `a bailiff` — so the
    // arm was right and the control was wrong. The control now asks the card which office it
    // does not seat, which is the only way a per-town arm can be controlled at all.
    const unseated = OFFICE_NOUN_CANDIDATES.find(
      (noun) => !seated.some((r) => r.includes(noun))
        && !institutionsOfCard(BASE_CARD).some((n) => n.toLowerCase().includes(noun)),
    );
    expect(unseated, 'this town seats every office noun the list holds').toBeTruthy();
    const bad = judge(`The ${unseated} keeps the walls.`).findings
      .filter((f) => f.arm === 'REFERENT-role' && f.channel === 'FAIL');
    expect(bad.map((f) => f.value)).toContain(unseated);
    const good = judge('The walls are kept.').findings.filter((f) => f.arm === 'REFERENT-role' && f.channel === 'FAIL');
    expect(good).toEqual([]);
  });

  it('REFERENT-body convicts a cited record no institution on this card keeps', () => {
    const bad = judge('The elders say the walls are kept.').findings
      .filter((f) => f.arm === 'REFERENT-body' && f.channel === 'FAIL');
    expect(bad.map((f) => f.value)).toEqual(['elders']);
    // MEASURED, and it is the finding: NO institution in the shipped roster offers
    // `Record of custom`, so no town the product can generate keeps the elders' record.
    expect(holdersFromCard('elders', BASE_CARD)).toEqual([]);
    const good = judge('The walls are kept.').findings.filter((f) => f.arm === 'REFERENT-body');
    expect(good).toEqual([]);
  });

  it('EPOCH convicts an elapsed course on a world that has not advanced, and clears without one', () => {
    expect(BASE_CARD.epoch.advanced).toBe(false);
    const bad = judge('The walls are kept, though they have fallen since the last survey.').findings
      .filter((f) => f.arm === 'EPOCH' && f.channel === 'FAIL');
    expect(bad.length).toBeGreaterThan(0);
    expect(ELAPSED_COURSE.test('since the last survey')).toBe(true);
    const good = judge('The walls are kept.').findings.filter((f) => f.arm === 'EPOCH' && f.channel === 'FAIL');
    expect(good).toEqual([]);
  });

  it('CORPUS-DIFF convicts an added PROVENANCE move and reports an inherited fault', () => {
    const r = judge('The elders say the walls are kept.', 'The walls are kept.');
    const added = r.findings.filter((f) => f.arm === 'CORPUS-DIFF' && f.channel === 'FAIL');
    expect(added.some((f) => f.value === 'PROVENANCE')).toBe(true);
    const same = judge('The walls are kept.', 'The walls are kept.');
    expect(same.findings.filter((f) => f.arm === 'CORPUS-DIFF' && f.channel === 'FAIL')).toEqual([]);
  });

  it('A5 reports a synonym swap across two faces and stays quiet on two different ones', () => {
    const swap = refuteUnit({
      text: 'The walls are kept.',
      stance: 'spine',
      blockId: '',
      poolKey: '',
      faces: ['The walls are kept.', 'The walls are kept.'],
    }, BASE_CARD, {});
    expect(swap.findings.some((f) => f.arm === 'A5' && f.channel === 'REPORT')).toBe(true);
    const varied = refuteUnit({
      text: 'The walls are kept.',
      stance: 'spine',
      blockId: '',
      poolKey: '',
      faces: ['The walls are kept.', 'Masons draw wages against the stonework every season.'],
    }, BASE_CARD, {});
    expect(varied.findings.filter((f) => f.arm === 'A5' && f.channel === 'REPORT')).toEqual([]);
  });

  it('A6 convicts a face naming a foreign FILL slot and never a face naming a ROLE slot', () => {
    const foreign = refuteUnit({
      text: 'The walls at {settlement} are kept.',
      spine: 'The walls at {settlement} are kept.',
      stance: 'spine',
      blockId: '',
      poolKey: '',
      faces: ['The walls at {faction} are kept.'],
    }, BASE_CARD, {});
    expect(foreign.findings.filter((f) => f.arm === 'A6' && f.channel === 'FAIL').map((f) => f.subject))
      .toEqual(['slot set']);
    // ⭐ THE GAP THIS ARM RECORDS. A role slot is filled by the face's own SOURCE tag and not
    // out of the spine's bag, so a face may lawfully name one its spine never does.
    const role = refuteUnit({
      text: 'The walls at {settlement} are kept.',
      spine: 'The walls at {settlement} are kept.',
      stance: 'spine',
      blockId: '',
      poolKey: '',
      faces: ['The {elders} say the walls are kept.'],
    }, BASE_CARD, {});
    expect(role.findings.filter((f) => f.arm === 'A6' && f.channel === 'FAIL')).toEqual([]);
  });

  it('ORDER reports a level-1 order and WITHHOLDS a sequence outside the closed set', () => {
    const inside = judge('The walls are kept and nothing else is.').findings.filter((f) => f.arm === 'ORDER');
    expect(inside.every((f) => f.channel === 'REPORT' || f.channel === 'WITHHELD')).toBe(true);
    const notASpine = refuteUnit({ text: 'The walls are kept.', stance: 'face', blockId: '', poolKey: '' }, BASE_CARD, {});
    expect(notASpine.findings.filter((f) => f.arm === 'ORDER').map((f) => f.channel)).toEqual(['NOT-EXECUTABLE']);
  });

  it('an arm whose input is absent says NOT-EXECUTABLE and never PASS', () => {
    const noCorpus = judge('The walls are kept.');
    expect(noCorpus.findings.some((f) => f.arm === 'CORPUS-DIFF' && f.channel === 'NOT-EXECUTABLE')).toBe(true);
    expect(noCorpus.findings.some((f) => f.arm === 'LEAK' && f.channel === 'NOT-EXECUTABLE')).toBe(true);
    const withFlags = refuteUnit(
      { text: 'The walls are kept.', stance: 'spine', blockId: '', poolKey: '' },
      BASE_CARD,
      { options: { flagKeys: new Set(['warLayerEnabled']) } },
    );
    expect(withFlags.findings.some((f) => f.arm === 'LEAK' && f.channel === 'NOT-EXECUTABLE')).toBe(false);
    const leaked = refuteUnit(
      { text: 'The walls are kept while warLayerEnabled holds.', stance: 'spine', blockId: '', poolKey: '' },
      BASE_CARD,
      { options: { flagKeys: new Set(['warLayerEnabled']) } },
    );
    expect(leaked.findings.some((f) => f.arm === 'LEAK' && f.value === 'warLayerEnabled' && f.channel === 'FAIL')).toBe(true);
  });
});

describe('refuteUnit — the roster seats the bodies the page names (W3d car 2)', () => {
  /** The same card with a different `town.bodies`, so both controls run on ONE real ground. */
  const withBodies = (bodies) => ({ ...BASE_CARD, town: { ...BASE_CARD.town, bodies } });
  const body = (name) => ({ name, kind: 'faction', source: 'factions[].name' });
  const judgeOn = (text, card) => refuteUnit(
    {
      text, stance: 'spine', blockId: '', poolKey: '', slots: slotsIn(text),
    },
    card,
    {},
  );

  it('the card carries the engine\'s own named bodies, and the reader is the card\'s', () => {
    // ⛔ RUN 3 MEASURED 8 ROSTER REFUSALS and most were the engine's own rows: "The Governing
    // Council and The Order of the Watch" on the pinned town, handed to the WRITER as that pool's
    // own `{faction}` fills while the card's roster listed neither.
    expect(bodiesOfCard(BASE_CARD).length).toBeGreaterThan(0);
    expect(bodiesOfCard(BASE_CARD)).toEqual([...bodiesOfCard(BASE_CARD)].sort());
    // A CARD OLDER THAN SCHEMA /5 ANSWERS THE EMPTY LIST rather than throwing, which leaves both
    // arms exactly where they stood before this car.
    expect(bodiesOfCard({ town: {} })).toEqual([]);
    expect(bodiesOfCard(null)).toEqual([]);
  });

  it('⭐ REFERENT-role licenses an office noun a NAMED BODY carries, and refuses it without one', () => {
    const seated = seatedRolesOf(BASE_CARD);
    const unseated = OFFICE_NOUN_CANDIDATES.find(
      (noun) => !seated.some((r) => r.includes(noun))
        && !institutionsOfCard(BASE_CARD).some((n) => n.toLowerCase().includes(noun))
        && !bodiesOfCard(BASE_CARD).some((n) => n.toLowerCase().includes(noun)),
    );
    expect(unseated, 'this town seats every office noun the list holds').toBeTruthy();
    const text = `The ${unseated} keeps the walls.`;
    // NEGATIVE CONTROL — with no body carrying the noun the arm still convicts, exactly as before.
    const refused = judgeOn(text, withBodies([])).findings
      .filter((f) => f.arm === 'REFERENT-role' && f.channel === 'FAIL');
    expect(refused.map((f) => f.value)).toContain(unseated);
    // POSITIVE CONTROL — a body the ENGINE named that carries the noun seats it.
    const licensed = judgeOn(text, withBodies([body(`The ${unseated} Council`)])).findings
      .filter((f) => f.arm === 'REFERENT-role' && f.channel === 'FAIL');
    expect(licensed.map((f) => f.value)).not.toContain(unseated);
  });

  it('⭐ REFERENT-body REPORTS a record a named body keeps, and still FAILS one nothing keeps', () => {
    const cited = 'The elders say the walls are kept.';
    // MEASURED and unchanged: no institution in the shipped roster offers `Record of custom`.
    expect(holdersFromCard('elders', BASE_CARD)).toEqual([]);
    // NEGATIVE CONTROL — with no body by that name the citation is refused, as it always was.
    const refused = judgeOn(cited, withBodies([])).findings.filter((f) => f.arm === 'REFERENT-body');
    expect(refused.map((f) => `${f.channel}/${f.value}`)).toEqual(['FAIL/elders']);
    // POSITIVE CONTROL — a body the engine named keeps it, and the arm REPORTS rather than refuses:
    // a body the engine seated is a seat, and floor 1 is satisfied by the body.
    const seated = judgeOn(cited, withBodies([body('The Council of Elders')])).findings
      .filter((f) => f.arm === 'REFERENT-body');
    expect(seated.map((f) => f.channel)).toEqual(['REPORT']);
    expect(seated[0].value).toBe('elders: The Council of Elders');
    // ⛔ AND A BODY THAT DOES NOT NAME THE KIND LICENSES NOTHING, so the limb is a lookup and not a
    // blanket: any body at all would otherwise turn floor 1 off.
    const unrelated = judgeOn(cited, withBodies([body('The Merchant Bloc')])).findings
      .filter((f) => f.arm === 'REFERENT-body');
    expect(unrelated.map((f) => `${f.channel}/${f.value}`)).toEqual(['FAIL/elders']);
  });
});

describe('refuteUnit — the card is the ground', () => {
  it('the ground keeps the estate\'s two laws and narrows the rest to this town', () => {
    const g = groundOfCard(BASE_CARD);
    expect(g.scope).toBe('settlement');
    expect(g.columns.whoIsCounted.closed).toBe(false);
    expect(g.columns.whoIsExempt.nullEverywhere).toBe(true);
    expect(g.columns.institution.closed).toBe(true);
    expect(g.columns.institution.values.length).toBeGreaterThan(0);
    expect(g.columns.office.closed).toBe(false);
    expect(g.joins).toBeUndefined();
  });

  it('the ground reads THIS pool\'s row when one is named', () => {
    const pool = BASE_CARD.pools[0];
    expect(pool).toBeTruthy();
    const g = groundOfCard(BASE_CARD, { blockId: pool.blockId, poolKey: pool.poolKey });
    expect(poolOfCard(BASE_CARD, pool.blockId, pool.poolKey)).toBe(pool);
    expect(Array.isArray(g.siblings)).toBe(true);
    expect(typeof g.eventProvenance === 'boolean' || g.eventProvenance === undefined).toBe(true);
  });

  it('a bare unit is seated as its own spine, and a unit with pieces keeps them', () => {
    expect(unitRowOf({ text: 'x', blockId: 'B', poolKey: 'P' }).pieces.map((p) => p.role)).toEqual(['spine']);
    expect(unitRowOf({
      text: 'x', blockId: 'B', poolKey: 'P', pieces: [{ role: 'spine', key: 'P', text: 'a' }, { role: 'modifier', key: 'Q', text: 'b' }],
    }).pieces.map((p) => p.role)).toEqual(['spine', 'modifier']);
  });
});

describe('refuteUnit — arm Q reads the pool\'s field paths (W3a car 3, chair ruling 28)', () => {
  /** A unit judged AT a real pool, so the arm gets that pool's own columns. */
  const judgeAt = (text, pool) => refuteUnit(
    { text, stance: 'spine', blockId: pool.blockId, poolKey: pool.poolKey },
    BASE_CARD,
    {},
  );
  const qRows = (r) => r.findings.filter((f) => f.arm === 'Q');

  const security = BASE_CARD.pools.find((p) => p.poolKey.startsWith('Internal Security'));
  const gated = BASE_CARD.pools.find(
    (p) => fieldPathsOfPool(p).includes('defenseProfile.economicGates.military'),
  );

  it('the card carries field paths, and they are what the arm is handed', () => {
    expect(security, 'the pinned town fires no Internal Security pool').toBeTruthy();
    expect(fieldPathsOfPool(security)).toEqual([
      'economicState.compound.inst.hasCourtSystem',
      'economicState.compound.inst.hasPrison',
    ]);
    // ⛔ AND THE WIRING STRINGS ARE NOT THE FIELD PATHS. This is the whole of ruling 28: the arm
    // was being handed a column `claimsField` can never match to a word of prose, or nothing.
    expect(security.static.reads).not.toEqual(fieldPathsOfPool(security));
  });

  it('⭐ NEGATIVE CONTROL — a second sentence naming nothing is withheld, and says which fields it read', () => {
    const rows = qRows(judgeAt('The walls are kept. Nothing else about it is settled.', security));
    expect(rows.length, 'arm Q did not fire on an unlicensed second sentence').toBe(1);
    expect(rows[0].channel).toBe('WITHHELD');
    expect(rows[0].description).toContain(
      'reads [economicState.compound.inst.hasCourtSystem, economicState.compound.inst.hasPrison]; none claimed',
    );
  });

  it('⭐ POSITIVE CONTROL — a second sentence naming the field in its own word is licensed', () => {
    // `economicState.compound.inst.hasCourtSystem` yields the claim token `court` through
    // `claimTokensOf`'s camel split, so this second sentence names a SECOND TYPED FIELD and
    // R-DA-03 licenses it. Before this car the same sentence was withheld with the others.
    expect(qRows(judgeAt('The walls are kept. The court sits where it has always sat.', security)))
      .toEqual([]);
  });

  it('⭐ THE RATIFIED SYNONYMS ARE READ, and the `settlement.` spelling no longer hides them', () => {
    // ⛔ THE MEASURED MISS. `FIELD_SYNONYM_ROWS` is keyed on the CENSUS spelling
    // (`settlement.defenseProfile.economicGates.military`) and the card strips that root, so a
    // lookup on the card's spelling matched no ratified row at all. The estate has exactly one
    // such row today and it sits on this town's own walls pool.
    expect(FIELD_SYNONYM_ROWS.map((r) => r.field))
      .toContain('settlement.defenseProfile.economicGates.military');
    expect(gated, 'the pinned town fires no pool reading the military economic gate').toBeTruthy();
    expect(vocabularyOfPool(gated)['defenseProfile.economicGates.military'])
      .toEqual(['pay', 'purse', 'wage', 'wages']);
    // And the arm actually uses them: `wages` is not a word of the field's own path.
    expect(qRows(judgeAt('The walls are kept. The wages come out of one purse.', gated))).toEqual([]);
    // NEGATIVE CONTROL — a second sentence naming neither the path nor a synonym still withholds,
    // so the vocabulary widened what the arm can SEE and did not switch the arm off.
    const still = qRows(judgeAt('The walls are kept. The reason for it goes unsaid.', gated));
    expect(still.length).toBe(1);
    expect(still[0].description).toContain('defenseProfile.economicGates.military');
  });

  it('a pool the card does not carry leaves the arm where it was: no reads, and it says so', () => {
    // The fixture-driven arms above call `judge`, which carries no pool identity at all. That
    // caller must keep the arm it had, or the catch table would be measuring a different arm.
    const bare = judge('The walls are kept. Nothing else about it is settled.');
    const row = bare.findings.filter((f) => f.arm === 'Q');
    expect(row.length).toBe(1);
    expect(row[0].description).not.toContain('none claimed');
  });
});

describe('refuteUnit — the walker equality pin', () => {
  it('every finding walkComposed makes on the same unit and ground is carried through', () => {
    const text = 'The elders say the walls are kept, which the hall pays for.';
    const row = unitRowOf({ text, blockId: '', poolKey: '' }, BASE_CARD);
    const ground = groundOfCard(BASE_CARD, { blockId: '', poolKey: '' });
    const walk = walkComposed(row, ground, {});
    const mine = judge(text);
    const carried = new Set(mine.findings.map((f) => `${f.arm}|${f.channel}`));
    for (const f of walk.composed.fails) expect(carried.has(`${f.arm}|FAIL`)).toBe(true);
    for (const f of walk.entry.fails) expect(carried.has(`${f.klass}|FAIL`)).toBe(true);
    for (const f of walk.entry.withheld) expect(carried.has(`${f.klass}|WITHHELD`)).toBe(true);
    // AND THE VERDICT THE WALKER WOULD GIVE IS NEVER SOFTER THAN THIS ONE: the refuter runs
    // strictly more arms, so it may only move a verdict the same way or further.
    const order = { PASS: 0, WITHHELD: 1, FAIL: 2 };
    expect(order[mine.verdict]).toBeGreaterThanOrEqual(order[composedVerdictOf(walk)]);
  });
});

/**
 * ⭐⭐ THE CATCH TABLE, MEASURED 2026-09-14 and asserted EXACTLY.
 *
 * The cell is the FAIL arms, else `W:` and the WITHHELD arms, else `no arm`. Reading it:
 *   9 rows are FAILED outright. Every one is a MECHANICAL or a GRAMMAR fault: the four
 *     `will`/`shall` rows (BAR-future, NON-MOVE FORECAST and C4 together), the one PROVENANCE
 *     row (REFERENT-body, the `The elders say` the brief names), the two level-1 orders lost on
 *     a spine, and two corpus-diff rows.
 *   14 are WITHHELD, which is the channel for a question the refuter owes an answer on.
 *   27 are caught by NO ARM, and they are the CERTAINTY, QUANTIFIER and SCOPE classes. The
 *     module's header says in terms that no tier-0 arm can reach them, and this is the receipt.
 * TWO ROWS ALSO CONVICT THEIR REPAIRED FORM and are therefore caught by nothing: B4-14
 * (`armC2`'s exemption lemma fires on "counted going and not counted coming back") and POW-16
 * (`NON_MOVES.FEELING` fires on the NOUN "fear"). Both are pre-existing over-reach in arms this
 * module calls rather than owns, and both are reported to the chair rather than patched here.
 */
const CATCH = Object.freeze({
  'B4-01': 'W:ORDER/a move sequence outside the closed set + C3/is this clause historical?',
  'B4-02': 'W:ORDER/a move sequence outside the closed set + C3/is this clause historical?',
  'B4-03': 'W:C3/is this clause historical?',
  'B4-04': 'no arm',
  'B4-05': 'no arm',
  'B4-06': 'no arm',
  'B4-07': 'W:Q/a second sentence naming no second field',
  'B4-08': 'no arm',
  'B4-09': 'W:C3/is this clause historical?',
  'B4-10': 'W:ORDER/a move sequence outside the closed set + X/exhaustivity over an open column',
  'B4-11': 'CORPUS-DIFF/a level-1 order lost on a spine',
  'B4-12': 'no arm',
  'B4-13': 'CORPUS-DIFF/a level-1 order lost on a spine',
  'B4-14': 'W:ORDER/a move sequence outside the closed set',
  'B4-15': 'no arm',
  'B4-16': 'W:Q/a second sentence naming no second field',
  'B4-17': 'W:Q/a second sentence naming no second field',
  'B4-18': 'W:Q/a second sentence naming no second field',
  'B4-19': 'REFERENT-body/a record no body in this town keeps + CORPUS-DIFF/a move the corpus unit does not make + CORPUS-DIFF/a level-1 order lost on a spine',
  'B4-20': 'BAR-future/a mechanical bar + NON-MOVE/FORECAST + C4/a bare future indicative + CORPUS-DIFF/an added C4 fault (a bare future indicative)',
  'B4-21': 'W:Q/a second sentence naming no second field',
  'POW-01': 'no arm',
  'POW-02': 'W:Q/a second sentence naming no second field',
  'POW-03': 'no arm',
  'POW-04': 'W:F25/a cited record\'s content',
  'POW-05': 'no arm',
  'POW-06': 'no arm',
  'POW-07': 'no arm',
  'POW-08': 'no arm',
  'POW-09': 'no arm',
  'POW-10': 'no arm',
  'POW-11': 'CORPUS-DIFF/a level-1 order lost on a spine',
  'POW-12': 'no arm',
  'POW-13': 'no arm',
  'POW-14': 'no arm',
  'POW-15': 'no arm',
  'POW-16': 'NON-MOVE/FEELING',
  'POW-17': 'no arm',
  'POW-18': 'no arm',
  'POW-19': 'no arm',
  'POW-20': 'no arm',
  'POW-21': 'W:Q/a second sentence naming no second field',
  'POW-22': 'no arm',
  'POW-23': 'no arm',
  'POW-24': 'no arm',
  'POW-25': 'no arm',
  'POW-26': 'no arm',
  'POW-27': 'BAR-future/a mechanical bar + NON-MOVE/FORECAST + C4/a bare future indicative + CORPUS-DIFF/an added C4 fault (a bare future indicative)',
  'POW-28': 'BAR-future/a mechanical bar + NON-MOVE/FORECAST + C4/a bare future indicative + CORPUS-DIFF/an added C4 fault (a bare future indicative)',
  'POW-29': 'BAR-future/a mechanical bar + NON-MOVE/FORECAST + C4/a bare future indicative + CORPUS-DIFF/an added C4 fault (a bare future indicative)',
});

/** The two rows whose REPAIRED form is also convicted, so they are caught by nothing. */
const FALSE_POSITIVES = Object.freeze(['B4-14', 'POW-16']);

describe('refuteUnit — the moved-claim catch table', () => {
  const rows = [...MOVED.batch4, ...MOVED.power];

  it('the fixture carries both audits whole', () => {
    expect(MOVED.batch4.length).toBe(21);
    expect(MOVED.power.length).toBe(29);
    expect(rows.every((r) => r.moved && r.repaired && r.moved !== r.repaired)).toBe(true);
  });

  it('every fixture row is judged exactly as the table records', () => {
    /** @type {string[]} */
    const drift = [];
    for (const r of rows) {
      const now = caughtBy(r.moved, r.repaired);
      if (now !== CATCH[r.id]) drift.push(`${r.id} (${r.klass})\n    was: ${CATCH[r.id]}\n    now: ${now}`);
    }
    expect(drift, `\nAn arm moved. Re-record the row and say why in the commit body:\n${drift.join('\n')}\n`).toEqual([]);
  });

  it('the repaired line clears every arm that convicted the moved one, but for the two named', () => {
    /** @type {string[]} */
    const dirty = [];
    for (const r of rows) {
      const fails = armsOf(judge(r.repaired, r.repaired), 'FAIL');
      if (fails.length) dirty.push(r.id);
    }
    expect(dirty.sort()).toEqual([...FALSE_POSITIVES].sort());
  });

  it('the four will-not rows are FAILED by a named mechanical arm, which is the brief\'s own bar', () => {
    const willNot = rows.filter((r) => /\b(?:will|shall)\b/i.test(r.moved));
    expect(willNot.map((r) => r.id)).toEqual(['B4-20', 'POW-27', 'POW-28', 'POW-29']);
    for (const r of willNot) {
      expect(armsOf(judge(r.moved, r.repaired), 'FAIL')).toContain('BAR-future/a mechanical bar');
      expect(armsOf(judge(r.repaired, r.repaired), 'FAIL')).toEqual([]);
    }
  });

  it('the elders PROVENANCE row is FAILED by the referent scan, and its repair clears', () => {
    const row = MOVED.batch4.find((r) => r.id === 'B4-19');
    expect(armsOf(judge(row.moved, row.repaired), 'FAIL'))
      .toContain('REFERENT-body/a record no body in this town keeps');
    expect(armsOf(judge(row.repaired, row.repaired), 'FAIL')).toEqual([]);
  });

  it('⛔ THE HONEST INVENTORY: the certainty, quantifier and scope classes are caught by NO ARM', () => {
    const unreached = rows.filter((r) => CATCH[r.id] === 'no arm');
    expect(unreached.length).toBe(27);
    // Not one of the twenty-seven is a mechanical or a grammar fault; every one of them is a
    // proposition about the town that only a reader of the card can settle.
    const classes = new Set(unreached.map((r) => r.klass));
    expect([...classes].some((k) => /certainty|quantifier|scope|quantity|tense|fact/i.test(k))).toBe(true);
    expect([...classes].some((k) => /will-not|forecast|PROVENANCE/i.test(k))).toBe(false);
  });
});

describe('refuteUnit — the corpus is the floor', () => {
  /**
   * THE TWO EXCEPTIONS, MEASURED and EXACT. Each is a landed DS-DEF-2 line that the instrument
   * convicts, and each has been checked to be REAL corpus debt rather than instrument noise:
   *   the elders citation — CONFIRMED: no institution in the shipped roster offers
   *     `Record of custom`, so no town keeps the record the line cites. The batch-4 audit filed
   *     the same three WEAK faces as D1 work and left them uncut.
   *   the C2 exemption — CONFIRMED pre-existing by running `walkEntry` against the ESTATE
   *     ground, where the same clause fails identically. The entry walker's gate samples, so
   *     this line has never been walked.
   * SHRINK-ONLY: when the corpus programme cures either, the row must be struck here.
   */
  const CORPUS_DEBT = Object.freeze([
    'C2/exemption on a null column',
    'REFERENT-body/a record no body in this town keeps',
  ]);

  it('every landed DS-DEF-2 unit is PASS or WITHHELD but for the two declared debts', () => {
    const rows = goldenCorpus();
    const stride = Math.max(1, Math.floor(rows.length / 40));
    /** @type {Set<string>} */
    const unexpected = new Set();
    let units = 0;
    for (let i = 0; i < rows.length; i += stride) {
      const { _seed, ...cfg } = rows[i];
      let s;
      try { s = townOf(_seed, cfg); } catch { continue; }
      const card = cardOf(s);
      for (const p of card.pools) {
        if (p.blockId !== 'DS-DEF-2') continue;
        units += 1;
        const r = refuteUnit({
          text: p.unit.rendered,
          spine: p.unit.spine,
          stance: 'spine',
          blockId: p.blockId,
          poolKey: p.poolKey,
          faces: p.unit.faces,
        }, card, { corpusUnit: { text: p.unit.rendered } });
        for (const f of r.findings) {
          if (f.channel !== 'FAIL') continue;
          const key = `${f.arm}/${f.subject}`;
          if (!CORPUS_DEBT.includes(key)) unexpected.add(`${key} :: ${p.poolKey} :: ${p.unit.rendered.slice(0, 80)}`);
        }
      }
    }
    expect(units).toBeGreaterThan(100);
    expect([...unexpected].sort()).toEqual([]);
  }, 600_000);

  it('the declared debts are still LIVE, so a cured one must be struck', () => {
    const live = new Set();
    const rows = goldenCorpus();
    const stride = Math.max(1, Math.floor(rows.length / 40));
    for (let i = 0; i < rows.length; i += stride) {
      const { _seed, ...cfg } = rows[i];
      let s;
      try { s = townOf(_seed, cfg); } catch { continue; }
      const card = cardOf(s);
      for (const p of card.pools) {
        if (p.blockId !== 'DS-DEF-2') continue;
        const r = refuteUnit({
          text: p.unit.rendered, spine: p.unit.spine, stance: 'spine', blockId: p.blockId, poolKey: p.poolKey, faces: p.unit.faces,
        }, card, { corpusUnit: { text: p.unit.rendered } });
        for (const f of r.findings) if (f.channel === 'FAIL') live.add(`${f.arm}/${f.subject}`);
      }
    }
    expect([...live].sort()).toEqual([...CORPUS_DEBT].sort());
  }, 600_000);
});

describe('refuteTab — the page-level arms', () => {
  it('runs C7 over a page-set and reports a repeated opener trigram', () => {
    const r = refuteTab([
      { text: 'The walls are kept and nobody stands behind them.', blockId: 'DS-DEF-2', poolKey: 'a' },
      { text: 'The walls are kept though the purse is thin.', blockId: 'DS-DEF-11', poolKey: 'b' },
    ], BASE_CARD);
    expect(r.report.units).toBe(2);
    expect(r.findings.some((f) => f.arm === 'C7-opener' && f.value.startsWith('the walls are: 2'))).toBe(true);
  });

  it('C7 declares itself NOT-EXECUTABLE on a single-block page-set', () => {
    const r = refuteTab([{ text: 'The walls are kept.', blockId: 'DS-DEF-2', poolKey: 'a' }], BASE_CARD);
    expect(r.findings.some((f) => f.arm === 'C7' && f.channel === 'NOT-EXECUTABLE')).toBe(true);
  });
});

describe('refuteUnit — the module is headless and deterministic', () => {
  it('two calls on one unit return identical findings', () => {
    const a = JSON.stringify(judge('The elders say the walls are kept.', 'The walls are kept.'));
    const b = JSON.stringify(judge('The elders say the walls are kept.', 'The walls are kept.'));
    expect(a).toBe(b);
  });

  it('it imports nothing from src/components and nothing from a test file', () => {
    const source = readFileSync(join(ROOT, 'src/domain/prose/refuteUnit.js'), 'utf8');
    const imports = [...source.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
    expect(imports.filter((p) => p.includes('components'))).toEqual([]);
    expect(imports.filter((p) => p.includes('tests/'))).toEqual([]);
    expect(imports.filter((p) => p.includes('.test.'))).toEqual([]);
  });

  it('no string it EMITS carries an em dash or an exclamation mark', () => {
    // ⛔ WHAT IT EMITS, NOT WHAT ITS SOURCE SPELLS. The first cut scanned quote pairs in the
    // source and convicted the CONTRACTION BAR's own regex body of the bang it is written to
    // hunt: a naive quote matcher reads a regex literal as a string. The property the E2 law
    // protects is the text that reaches a reader, so the arm reads every string this module can
    // actually put on a finding, which is also what the E2 ratchet's AST walk measures.
    const spoken = [
      ...VOICE_BARS.map((b) => b.why),
      ...REFUTE_ARMS.map((a) => a.note),
    ];
    const battery = [
      'The walls are kept.',
      'The elders say the walls are kept, which the hall pays for.',
      'The walls will be kept and the town has fallen since the last survey.',
      'A station runs 250 to 10,000 GP at tick 40.',
      'The bailiff feels the walls are like a drawn blade, which means the town is safe.',
    ];
    for (const text of battery) {
      for (const f of judge(text, 'The walls are kept.').findings) {
        spoken.push(f.arm, f.subject, f.description);
      }
    }
    expect(spoken.length).toBeGreaterThan(60);
    expect(spoken.filter((s) => String(s).includes('—'))).toEqual([]);
    expect(spoken.filter((s) => String(s).includes('!'))).toEqual([]);
  });
});
