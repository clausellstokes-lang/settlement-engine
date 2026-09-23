/**
 * tests/domain/bandLadders.test.js — EM-R0d's acceptance home (cases A1-A8).
 *
 * THE CLAIM: the public-legitimacy, defence-readiness and food-security ladders now have ONE
 * home, src/data/bandLadders.js, and the three producers read it — with no cut point, label,
 * colour, multiplier, evaluation order or comparison operator changed. This file is the
 * CONSTRUCTIVE half of that proof. The IDENTITY half is the two golden suites, which A6
 * records and which are RUN, never re-recorded.
 *
 * ⛔ A6 READS AND NEVER WRITES, AND IT NAMES NO GOLDEN DOOR IN EXECUTABLE CODE.
 * tests/lint/goldenFreeze.walker.test.js derives its capture-arm roster from
 * `envSpellingsIn`, which reads every `process.env.UPDATE_*` MEMBER EXPRESSION and enrols
 * the file when that spelling is a registered surface's recordEnv. A read-only identity arm
 * that touched `process.env.UPDATE_GOLDEN` would enrol itself as a capture arm and then owe
 * an import of tests/helpers/goldenRecordDoor.js — a door it must never open. The claim that
 * no golden door is set belongs to that walker and to the lane's gate batch, not here; what
 * belongs here is the register comparison below, which is the identity pin itself.
 *
 * ⛔ SHAPE LAW (tests/lint/sovereigntyLightingContract.walker.test.js): EIGHT straight-line
 * literal `it`s under ONE literal `describe`. `it`, `test` and `describe` are never bound a
 * second time — not as a variable, not as a parameter — there is no `.each`, no nesting, no
 * conditional registration, and every statement in the suite block is a registration call.
 *
 * ⛔ THE PRE-MOVE LADDERS ARE TRANSCRIBED BELOW FROM THE PRODUCERS' OWN SOURCE AT THE VERIFIED
 * BASE, and every equivalence arm compares the leaf against those transcriptions rather than
 * against a paraphrase. That is what makes A2/A3/A4 a MOVE proof instead of a restatement.
 * The readiness ladder's producer entry point, `computeDefenseReadiness`, is module-local and
 * exported nowhere, so its half of A2 is proved against the transcription and anchored to the
 * REAL producer through `generateDefenseProfile`, whose emitted `readiness` object carries the
 * score and the label together (build-lane judgment R0d-1, recorded in the commit message).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  FOOD_FLAG_CUTS,
  FOOD_SECURITY_BANDS,
  FOOD_SECURITY_CUTS,
  LEGITIMACY_BANDS,
  LEGITIMACY_CUTS,
  READINESS_BANDS,
  READINESS_CUTS,
  foodSecurityBandOf,
  foodSecurityFlagsOf,
  legitimacyBandOf,
  readinessBandOf,
} from '../../src/data/bandLadders.js';
import { legitimacyBandFor } from '../../src/generators/factionDynamics.js';
import { generateDefenseProfile } from '../../src/generators/defenseGenerator.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const src = (rel) => readFileSync(resolve(ROOT, rel), 'utf8');
const sha256 = (rel) => createHash('sha256').update(readFileSync(resolve(ROOT, rel))).digest('hex');
/** Comments stripped, so a marker quoted in prose cannot answer an absence question. */
const codeOf = (rel) => src(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');

const LADDER_LEAF = 'src/data/bandLadders.js';
const FACTION_SRC = 'src/generators/factionDynamics.js';
const DEFENSE_SRC = 'src/generators/defenseGenerator.js';
const FOOD_SRC = 'src/generators/foodGenerator.js';

/** The five legitimacy rungs, in the producer's own order. */
const LEGITIMACY_LABELS = ['Endorsed', 'Approved', 'Tolerated', 'Contested', 'Legitimacy Crisis'];
/** The six readiness rungs, in the producer's own order. */
const READINESS_LABELS = ['Fortress', 'Well-Defended', 'Defensible', 'Lightly Defended', 'Vulnerable', 'Undefended'];
/** The six food rungs, in the producer's own chain order. */
const FOOD_LABELS = ['Deficit — Active Famine', 'Deficit', 'Import-Dependent', 'Pressured', 'Surplus', 'Secure'];

/** factionDynamics.js's band chain and both multiplier ternaries, transcribed at the base. */
function preMoveLegitimacy(score) {
  let label, color, bg;
  if (score >= 75) { label = 'Endorsed'; color = '#1a5a28'; bg = '#f0faf4'; }
  else if (score >= 60) { label = 'Approved'; color = '#4a7a2a'; bg = '#f4faf0'; }
  else if (score >= 45) { label = 'Tolerated'; color = '#a0762a'; bg = '#faf8ec'; }
  else if (score >= 30) { label = 'Contested'; color = '#8a4010'; bg = '#fdf6ec'; }
  else { label = 'Legitimacy Crisis'; color = '#8b1a1a'; bg = '#fdf4f4'; }
  const govMultiplier = score >= 75 ? 1.30 : score >= 60 ? 1.15 : score >= 45 ? 1.00 : score >= 30 ? 0.80 : 0.60;
  const crimMultiplier = score >= 75 ? 0.75 : score >= 60 ? 0.90 : score >= 45 ? 1.00 : score >= 30 ? 1.15 : 1.30;
  return { label, color, bg, govMultiplier, crimMultiplier };
}

/** The six flags legitimacyBandFor published before the move, spelled as the producer spelled them. */
function preMoveLegitimacyFlags(score) {
  return {
    isEndorsed: score >= 75,
    isApproved: score >= 60,
    isTolerated: score >= 45 && score < 60,
    isContested: score >= 30 && score < 45,
    isLegitimacyCrisis: score < 30,
    governanceFractured: score < 30,
  };
}

/** defenseGenerator.js's band ternary, transcribed at the base. */
function preMoveReadiness(readiness) {
  return readiness >= 76 ? { label: 'Fortress', color: '#1a4a2a', background: '#f0faf2', border: '#a8d8b0' }
    : readiness >= 55 ? { label: 'Well-Defended', color: '#1a3a6a', background: '#f0f4fa', border: '#a8c0d8' }
      : readiness >= 38 ? { label: 'Defensible', color: '#5a6a1a', background: '#f4f8ec', border: '#b8d0a8' }
        : readiness >= 24 ? { label: 'Lightly Defended', color: '#7a5010', background: '#faf6ec', border: '#e0c880' }
          : readiness >= 12 ? { label: 'Vulnerable', color: '#8a3010', background: '#fdf8ec', border: '#e8c080' }
            : { label: 'Undefended', color: '#8b1a1a', background: '#fdf4f4', border: '#e8c0c0' };
}

/** foodGenerator.js's label chain, transcribed at the base. STRICT `>`, famine first. */
function preMoveFoodLabel(stressFamine, deficitPct, surplusPct) {
  let label, color, bg;
  if (stressFamine) { label = 'Deficit — Active Famine'; color = '#8b1a1a'; bg = '#fdf4f4'; }
  else if (deficitPct > 40) { label = 'Deficit'; color = '#8b1a1a'; bg = '#fdf4f4'; }
  else if (deficitPct > 15) { label = 'Import-Dependent'; color = '#8a3010'; bg = '#fdf0e8'; }
  else if (deficitPct > 5) { label = 'Pressured'; color = '#7a5010'; bg = '#faf8e8'; }
  else if (surplusPct > 40) { label = 'Surplus'; color = '#1a5a28'; bg = '#f0faf4'; }
  else { label = 'Secure'; color = '#2a6a38'; bg = '#f4fbf6'; }
  return { label, color, bg };
}

/** foodGenerator.js's `Stress flags` block, transcribed at the base, in the record's key order. */
function preMoveFoodFlags(stressFamine, deficitPct, surplusPct) {
  return {
    isDeficit: deficitPct > 20 || stressFamine,
    isPressured: deficitPct > 5 && deficitPct <= 20,
    isSecure: deficitPct <= 5 && surplusPct <= 40,
    isSurplus: surplusPct > 40,
  };
}

const EPS = 0.0001;
const SURPLUS_BELOW = FOOD_SECURITY_CUTS.surplus - EPS;
const SURPLUS_ABOVE = FOOD_SECURITY_CUTS.surplus + EPS;

/**
 * A3/A4's shared boundary grid: the three deficit cuts at cut±EPS and exactly at the cut,
 * crossed with a surplus above and below 40 and with famine on and off (36 rows); the surplus
 * cut's own three offsets where it is reachable (3 rows); and the plain floor (1 row) — 40.
 */
function foodBoundaryGrid() {
  const rows = [];
  for (const cut of [FOOD_SECURITY_CUTS.deficit, FOOD_SECURITY_CUTS.importDependent, FOOD_SECURITY_CUTS.pressured]) {
    for (const deficitPct of [cut - EPS, cut, cut + EPS]) {
      for (const surplusPct of [SURPLUS_BELOW, SURPLUS_ABOVE]) {
        for (const stressFamine of [false, true]) rows.push({ stressFamine, deficitPct, surplusPct });
      }
    }
  }
  for (const surplusPct of [FOOD_SECURITY_CUTS.surplus - EPS, FOOD_SECURITY_CUTS.surplus, FOOD_SECURITY_CUTS.surplus + EPS]) {
    rows.push({ stressFamine: false, deficitPct: 0, surplusPct });
  }
  rows.push({ stressFamine: false, deficitPct: 0, surplusPct: 0 });
  return rows;
}

/** A minimal settlement the defence producer accepts, in its own shapes. */
function defensibleSettlement() {
  return {
    name: 'Thornwall',
    _seed: 'seed-r0d-a2',
    config: { monsterThreat: 'frontier' },
    institutions: [],
    defenseProfile: { scores: { economic: 50 } },
    economicState: { compound: { inst: {} } },
  };
}

/** Every `.js`/`.jsx` file under a repo-relative directory, repo-relative and sorted. */
function jsFilesUnder(rel) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) out.push(abs.slice(ROOT.length + 1));
    }
  };
  walk(join(ROOT, rel));
  return out.sort();
}

/** The names directly under a repo-relative directory. */
const namesIn = (rel) => readdirSync(join(ROOT, rel)).sort();

describe('EM-R0d — the band ladders have one home, and the producers read it', () => {
  it('A1 — the five tables are frozen, reference their own cuts, and spell each cut exactly once', () => {
    expect(Object.isFrozen(LEGITIMACY_CUTS) && Object.isFrozen(LEGITIMACY_BANDS), 'the legitimacy containers are frozen').toBe(true);
    expect(Object.isFrozen(READINESS_CUTS) && Object.isFrozen(READINESS_BANDS), 'the readiness containers are frozen').toBe(true);
    expect(Object.isFrozen(FOOD_SECURITY_CUTS) && Object.isFrozen(FOOD_SECURITY_BANDS), 'the food containers are frozen').toBe(true);
    expect(Object.isFrozen(FOOD_FLAG_CUTS), 'the flag cuts are frozen').toBe(true);
    expect(LEGITIMACY_BANDS.map((b) => b.min)).toEqual([
      LEGITIMACY_CUTS.endorsed, LEGITIMACY_CUTS.approved, LEGITIMACY_CUTS.tolerated, LEGITIMACY_CUTS.contested, -Infinity,
    ]);
    expect(READINESS_BANDS.map((b) => b.min)).toEqual([
      READINESS_CUTS.fortress, READINESS_CUTS.wellDefended, READINESS_CUTS.defensible,
      READINESS_CUTS.lightlyDefended, READINESS_CUTS.vulnerable, -Infinity,
    ]);
    expect(FOOD_FLAG_CUTS.pressured, 'the two ladders SHARE the pressured cut by reference').toBe(FOOD_SECURITY_CUTS.pressured);
    expect(FOOD_FLAG_CUTS.surplus, 'and the surplus cut, by reference').toBe(FOOD_SECURITY_CUTS.surplus);
    expect(FOOD_FLAG_CUTS.deficit, 'while the deficit cut is the flag ladder\'s OWN 20').toBe(20);
    expect(LEGITIMACY_BANDS.map((b) => b.label)).toEqual(LEGITIMACY_LABELS);
    expect(READINESS_BANDS.map((b) => b.label)).toEqual(READINESS_LABELS);
    expect(Object.values(FOOD_SECURITY_BANDS).map((b) => b.label)).toEqual(FOOD_LABELS);
    const leafCode = codeOf(LADDER_LEAF);
    const spelledTwice = [75, 60, 45, 30, 76, 55, 38, 24, 12, 15, 5, 20]
      .map((cut) => ({ cut, n: [...leafCode.matchAll(new RegExp(`(?<![\\w.])${cut}(?![\\w.])`, 'g'))].length }))
      .filter((row) => row.n !== 1);
    expect(spelledTwice, 'every cut point is spelled ONCE in the leaf; a *_BANDS entry references its *_CUTS field').toEqual([]);
    const fortyCount = [...leafCode.matchAll(/(?<![\w.])40(?![\w.])/g)].length;
    expect(fortyCount, 'the label ladder\'s deficit and surplus cuts are two DIFFERENT 40s, so 40 is spelled twice and no more').toBe(2);
  });

  it('A2 — over every integer 0..100 the leaf returns exactly what the producers returned before the move', () => {
    const legitimacyDisagreements = [];
    const readinessDisagreements = [];
    for (let score = 0; score <= 100; score += 1) {
      const leaf = legitimacyBandOf(score);
      const was = preMoveLegitimacy(score);
      const live = legitimacyBandFor(score);
      const wasFlags = preMoveLegitimacyFlags(score);
      if (leaf.label !== was.label || leaf.color !== was.color || leaf.bg !== was.bg
        || leaf.govMultiplier !== was.govMultiplier || leaf.crimMultiplier !== was.crimMultiplier
        || live.label !== was.label || live.color !== was.color || live.bg !== was.bg
        || live.govMultiplier !== was.govMultiplier || live.crimMultiplier !== was.crimMultiplier
        || Object.keys(wasFlags).some((flag) => live[flag] !== wasFlags[flag])) {
        legitimacyDisagreements.push({ score, leaf, live, was, wasFlags });
      }
      const readinessLeaf = readinessBandOf(score);
      const readinessWas = preMoveReadiness(score);
      if (readinessLeaf.label !== readinessWas.label || readinessLeaf.color !== readinessWas.color
        || readinessLeaf.background !== readinessWas.background || readinessLeaf.border !== readinessWas.border) {
        readinessDisagreements.push({ score, readinessLeaf, readinessWas });
      }
    }
    expect(legitimacyDisagreements, '101 legitimacy scores, collected then asserted once').toEqual([]);
    expect(readinessDisagreements, '101 readiness scores, collected then asserted once').toEqual([]);
    expect(Object.keys(legitimacyBandFor(80))).toEqual([
      'label', 'color', 'bg', 'govMultiplier', 'crimMultiplier',
      'isEndorsed', 'isApproved', 'isTolerated', 'isContested', 'isLegitimacyCrisis', 'governanceFractured',
    ]);
    const built = generateDefenseProfile(defensibleSettlement());
    expect(typeof built.readiness.score, 'the REAL producer still writes a numeric readiness').toBe('number');
    expect(built.readiness.label, 'and the label it emits IS the leaf\'s band for that score').toBe(readinessBandOf(built.readiness.score).label);
    expect(Object.keys(built.readiness), 'in the golden-bearing key order the record carries').toEqual(['score', 'label', 'color', 'background', 'border']);
  });

  it('A3 — the food LABEL ladder is the producer\'s chain at every boundary, and the `>` is strict', () => {
    const grid = foodBoundaryGrid();
    expect(grid.length, 'the declared boundary grid').toBe(40);
    const disagreements = grid.filter((row) => {
      const leaf = foodSecurityBandOf(row.stressFamine, row.deficitPct, row.surplusPct);
      const was = preMoveFoodLabel(row.stressFamine, row.deficitPct, row.surplusPct);
      return leaf.label !== was.label || leaf.color !== was.color || leaf.bg !== was.bg;
    });
    expect(disagreements, '40 boundary rows through the food label ladder').toEqual([]);
    expect(foodSecurityBandOf(false, FOOD_SECURITY_CUTS.deficit, 0).label, 'exactly at 40 is NOT Deficit — the operator is strict').toBe('Import-Dependent');
    expect(foodSecurityBandOf(false, FOOD_SECURITY_CUTS.importDependent, 0).label, 'exactly at 15 is NOT Import-Dependent').toBe('Pressured');
    expect(foodSecurityBandOf(false, FOOD_SECURITY_CUTS.pressured, 0).label, 'exactly at 5 is NOT Pressured').toBe('Secure');
    expect(foodSecurityBandOf(false, 0, FOOD_SECURITY_CUTS.surplus).label, 'exactly at a surplus of 40 is NOT Surplus').toBe('Secure');
    expect(foodSecurityBandOf(true, 0, 0).label, 'famine is read FIRST, before any number').toBe('Deficit — Active Famine');
  });

  it('A4 — the food FLAG ladder is a SECOND ladder, and its disagreement with the label is PINNED', () => {
    const grid = foodBoundaryGrid();
    const disagreements = grid.filter((row) => {
      const leaf = foodSecurityFlagsOf(row.stressFamine, row.deficitPct, row.surplusPct);
      const was = preMoveFoodFlags(row.stressFamine, row.deficitPct, row.surplusPct);
      return Object.keys(was).some((flag) => leaf[flag] !== was[flag]);
    });
    expect(disagreements, '40 boundary rows through the food flag ladder').toEqual([]);
    expect(Object.keys(foodSecurityFlagsOf(false, 0, 0)), 'the record\'s own key order is golden-bearing').toEqual(['isDeficit', 'isPressured', 'isSecure', 'isSurplus']);
    for (const deficitPct of [15 + EPS, 16, 20]) {
      expect(foodSecurityBandOf(false, deficitPct, 0).label, `deficitPct ${deficitPct} labels Import-Dependent`).toBe('Import-Dependent');
      expect(foodSecurityFlagsOf(false, deficitPct, 0).isPressured, `and carries isPressured (ODQ 934.57)`).toBe(true);
      expect(foodSecurityFlagsOf(false, deficitPct, 0).isDeficit, `and NOT isDeficit — the two ladders cut at 15 and at 20`).toBe(false);
    }
    expect(FOOD_SECURITY_CUTS.importDependent, 'the measured disagreement is a 5-wide window, not a rounding artefact').toBe(15);
    expect(FOOD_FLAG_CUTS.deficit, 'and this packet RECONCILES NOTHING: folding them would move the golden').toBe(20);
  });

  it('A5 — every band function is total: a member of its own table, never null, undefined or a throw', () => {
    const inputs = [NaN, undefined, null, -1, Infinity, '75'];
    const problems = [];
    for (const input of inputs) {
      const legit = legitimacyBandOf(input);
      const ready = readinessBandOf(input);
      const flags = foodSecurityFlagsOf(false, input, 0);
      if (!LEGITIMACY_BANDS.includes(legit)) problems.push({ input: String(input), where: 'legitimacyBandOf' });
      if (!READINESS_BANDS.includes(ready)) problems.push({ input: String(input), where: 'readinessBandOf' });
      if (!Object.values(FOOD_SECURITY_BANDS).includes(foodSecurityBandOf(false, input, 0))) problems.push({ input: String(input), where: 'foodSecurityBandOf' });
      if (Object.keys(flags).length !== 4) problems.push({ input: String(input), where: 'foodSecurityFlagsOf' });
      if (legit.label !== preMoveLegitimacy(input).label) problems.push({ input: String(input), where: 'legitimacy identity' });
      if (ready.label !== preMoveReadiness(input).label) problems.push({ input: String(input), where: 'readiness identity' });
    }
    expect(problems, 'six absent or malformed inputs, each resolving exactly as the producers\' own chains resolved them').toEqual([]);
    expect(legitimacyBandOf(NaN).label, 'NaN falls to the floor, because `>=` is false for it').toBe('Legitimacy Crisis');
    expect(readinessBandOf(undefined).label, 'and so does undefined').toBe('Undefended');
    expect(legitimacyBandOf(null).label, 'null coerces to 0, which is below every cut but above -Infinity').toBe('Legitimacy Crisis');
    // ⚠ NOT the floor, and this is the PRE-MOVE behaviour preserved exactly: `>=` coerces, so
    // Infinity and the numeric string both clear the top cut, as the producers' chains did.
    expect(legitimacyBandOf(Infinity).label, 'Infinity clears every cut, as it did before the move').toBe('Endorsed');
    expect(legitimacyBandOf('75').label, 'and a numeric string coerces through `>=`, as it did before the move').toBe('Endorsed');
  });

  it('A6 — the two goldens are byte-unmoved against their freeze register, and the run is recorded', () => {
    const register = JSON.parse(src('tests/fixtures/.golden-freeze-register.json'));
    const rows = register.surfaces
      .filter((row) => /generator-golden-master\.json$|dossier-prose-manifest-golden\.json$/.test(row.path || ''))
      .sort((a, b) => a.path.localeCompare(b.path));
    expect(rows.map((row) => row.path), 'both golden surfaces are registered').toEqual([
      'tests/fixtures/dossier-prose-manifest-golden.json', 'tests/fixtures/generator-golden-master.json',
    ]);
    const moved = rows.filter((row) => sha256(row.path) !== row.sha256);
    expect(moved, 'a golden that moved is a STOP, never a re-record').toEqual([]);
    const counts = rows.map((row) => `${row.path}=${row.rows}rows/${row.sha256.slice(0, 12)}`).join(' ');
    process.stdout.write(`A6 identity: ${counts}; the PROOF is ${rows.map((r) => r.suite).join(' + ')}, run and never edited\n`);
    expect(rows.map((row) => row.rows), 'the corpus is the 2-row prose manifest and the 525-row golden master').toEqual([2, 525]);
  });

  it('A7 — the three producers spell no ladder cut of their own, and prosperityMod is untouched', () => {
    const faction = codeOf(FACTION_SRC);
    const defense = codeOf(DEFENSE_SRC);
    const food = codeOf(FOOD_SRC);
    // anchored: each producer's own import of the leaf is asserted in the same arm below, so an
    // empty or renamed source cannot make these absences vacuous.
    expect([...faction.matchAll(/score >= (?:75|60|45|30)\b/g)].length, 'the legitimacy chain left factionDynamics.js').toBe(0);
    // anchored: as above — the import assertions below prove the file is live and re-pointed.
    expect([...defense.matchAll(/readiness >= (?:76|55|38|24|12)\b/g)].length, 'the readiness ternary left defenseGenerator.js').toBe(0);
    // anchored: as above — foodGenerator.js's own import of the leaf is asserted below.
    expect([...food.matchAll(/^\s*label = '[^']+';$/gm)].length, 'the food label chain left foodGenerator.js').toBe(0);
    const flagPredicates = [/isDeficit:\s*deficitPct/, /isPressured:\s*deficitPct/, /isSecure:\s*deficitPct/, /isSurplus:\s*surplusPct/];
    expect(flagPredicates.filter((re) => re.test(food)), 'the four inline stress flags became one spread').toEqual([]);
    expect(faction.includes("from '../data/bandLadders.js'"), 'factionDynamics.js reads the leaf').toBe(true);
    expect(defense.includes("from '../data/bandLadders.js'"), 'defenseGenerator.js reads the leaf').toBe(true);
    expect(food.includes("from '../data/bandLadders.js'"), 'foodGenerator.js reads the leaf').toBe(true);
    // ⚠ PER PRODUCER, never across them. `DEFENSE_CONTRIB` in factionDynamics.js is the
    // CROSS-LADDER JOIN and is keyed by the six READINESS labels on purpose (§5.2 marks it READ
    // ONLY), and the same file defaults a missing food label to 'Secure' off the record. A
    // whole-tree absence check would convict both. Each producer must lose ITS OWN ladder.
    expect(LEGITIMACY_LABELS.filter((label) => faction.includes(`'${label}'`)), 'the legitimacy rungs left their producer').toEqual([]);
    expect(READINESS_LABELS.filter((label) => defense.includes(`'${label}'`)), 'the readiness rungs left their producer').toEqual([]);
    expect(FOOD_LABELS.filter((label) => food.includes(`'${label}'`)), 'the food rungs left their producer').toEqual([]);
    const join = (faction.match(/export const DEFENSE_CONTRIB = \{[\s\S]*?\};/) || [''])[0];
    expect([...join.matchAll(/'([^']+)':/g)].map((m) => m[1]), 'and the cross-ladder join still speaks the leaf\'s readiness vocabulary, lowest rung first')
      .toEqual([...READINESS_BANDS].reverse().map((band) => band.label));
    expect(food.includes('deficitPct > 8'), 'prosperityMod\'s own 40/20/8 chain is STILL PRESENT').toBe(true);
    expect([...food.matchAll(/prosperityMod = \{/g)].length, 'and every rung of it is untouched: eight assignments, none moved — it is a chooser, not a ladder').toBe(8);
  });

  it('A8 — there is ONE address, the homonym is a different file, and no layering edge is added', () => {
    expect(namesIn('src/data').includes('bandLadders.js'), 'the one address exists').toBe(true);
    const domainRoot = namesIn('src/domain');
    // anchored: the same readdir is asserted to contain `compendium` below, so an empty or
    // moved src/domain cannot make this absence vacuous.
    expect(domainRoot.includes('bandLadders.js'), 'the EXACT path src/domain/bandLadders.js does not exist; a glob here would match the Compendium\'s homonym and false-red').toBe(false);
    expect(domainRoot.includes('compendium'), 'and src/domain is live, with its compendium subtree present').toBe(true);
    const homonym = 'src/domain/compendium/bandLadders.js';
    expect(namesIn('src/domain/compendium').includes('bandLadders.js'), 'the homonym IS present — same basename, different subject').toBe(true);
    expect(src(homonym).includes('buildBandLadders'), 'and it is the Compendium\'s ladder PROSE, not a cut table').toBe(true);
    const generators = jsFilesUnder('src/generators');
    expect(generators.length, 'the generator tree is live and was really walked').toBeGreaterThan(20);
    const domainBandImporters = generators.filter((rel) => /from\s+['"][^'"]*domain\/[^'"]*bandLadders[^'"]*['"]/.test(src(rel)));
    expect(domainBandImporters, 'no file under src/generators imports a src/domain band address; one would take the eager first-paint set 283 -> 285').toEqual([]);
    const leafImporters = generators.filter((rel) => src(rel).includes('bandLadders.js'));
    expect(leafImporters.sort(), 'and every generator that reads a ladder reads THIS leaf').toEqual([FACTION_SRC, DEFENSE_SRC, FOOD_SRC].sort());
    const specifiers = leafImporters.map((rel) => (src(rel).match(/from '([^']*bandLadders\.js)'/) || [])[1]);
    expect([...new Set(specifiers)], 'by one specifier, into src/data').toEqual(['../data/bandLadders.js']);
  });
});
