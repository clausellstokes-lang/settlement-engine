/**
 * envoyK3BeliefSeam.test.js — the K3 structural pin set (WR-7b, extended WR-7c).
 *
 * Amendment K3 (NOBODY IS EVER CURRENT) says no negotiation path — terms, vote,
 * interceptor judgment, close-vote comparison, feasibility — may read true world
 * state; every read routes through belief machinery. The architecture volume
 * (§1b, §3 THE SEAM MECHANICS) requires that as STRUCTURAL ENFORCEMENT rather
 * than convention, in the P4 no-hidden-governor idiom:
 *
 *   IMPORT LISTS      each negotiation module's reachable set is a closed,
 *                     reviewed list, so a truth hop cannot appear by refactor.
 *   TOKEN SCAN        no true-state read token appears in the negotiation set.
 *   THE PURE SEAM     negotiationPictures reaches peaceTerms ONLY through
 *                     input-shaped leaves — never through a worldState reader —
 *                     which is what keeps the LIT path belief-sourced while
 *                     peaceTerms itself stays the single terms writer.
 *   GUARD-THE-GUARD   the same scan FINDS those tokens in a module that
 *                     legitimately reads truth, so a scan that silently stopped
 *                     matching cannot pass as compliance.
 *
 * peaceTerms.js sits OUTSIDE the pin set by ruling: its dark-path transport
 * legitimately builds truth internally, and it may never sit on both sides of
 * its own guard — so warDeployment.js is the positive control.
 *
 * EXTENDED AGAIN (lane WF, F7): the two WR-7c/7d PULSE STAGES are now pinned
 * members with closed import lists, and every `envoy*Stage.js` on disk must be
 * pinned or explicitly exempt. They had been outside this file's reach purely
 * because the errand discovery regex does not match their names — an accident of
 * spelling, not a decision — so K3 staying green neither vindicated nor indicted
 * them. Membership is now a ruling on the record either way.
 *
 * @enforced-by this file
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Source with every comment stripped. A source-scan claim about what a module
 * CANNOT reach must read the code, never the prose: these modules' own headers
 * describe the truth they refuse to import, and a raw scan would count that
 * refusal as the offence.
 */
const code = (rel) => readFileSync(join(ROOT, rel), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

/**
 * The module's REACHABLE SET, deduplicated. A family head both imports a leaf's values
 * and re-exports its public names, so the same specifier legitimately appears twice in
 * one file. What this pin claims — and what §1b requires — is that the set of modules a
 * negotiation can REACH is closed and reviewed; a specifier's multiplicity is a spelling
 * detail that cannot widen that reach. Deduping states the claim the docstring makes.
 */
const importsOf = (source) => [
  ...new Set([...source.matchAll(/from '([^']+)'/g)].map((m) => m[1])),
].sort();

/**
 * The spellings by which real settlement state enters a scorer in this engine.
 * Each is present in the positive control below, so the list cannot rot into a
 * set of strings that no longer matches anything.
 */
const TRUE_STATE_TOKENS = Object.freeze([
  'militaryStrength',
  'deriveMilitaryCapacity',
  'deriveSettlementPressures',
  'pressureModel',
  'economicState',
  'foodSecurity',
]);

/**
 * The negotiation set: every module a negotiation is let read through.
 *
 * WR-7c extends it by three, and the extension is the point of the amendment's
 * own list — "terms, VOTE, interceptor judgment, CLOSE-VOTE COMPARISON,
 * feasibility". The ratification vote and the compromise round are negotiation
 * paths as surely as the parlay is, so they are pinned the same way.
 *
 * `envoyTestimony.js` and `compromiseRound.js` are pinned to the EMPTY import
 * list: they consume closed bands their callers already read through belief
 * machinery, and there is no module they may reach for. `envoyTestimony`
 * deliberately re-declares the reliability ladder rather than importing
 * brokerageStamps (which reads institutions); a pin in
 * envoyTestimonyWr7c.test.js asserts the two spellings are equal, so refusing
 * the import costs no drift.
 *
 * REVIEWED ADDITION (WR-7c repair slice): `coalitionRatification.js` reaches
 * `envoyTestimony.js` for ONE thing — the closed court-desire vocabulary a
 * ballot and a seat must share, because two spellings of peace would break
 * unanimity (the finite-semantics law). The reach is K3-safe by construction
 * and the guard is the pin directly below it: `envoyTestimony` is pinned to
 * ZERO imports, so a module that reaches nothing cannot pass truth along. The
 * empty-list pin is therefore now load-bearing for two modules, not one.
 */
const NEGOTIATION_MODULES = Object.freeze({
  // THE DECOMPOSITION WAVE (war tranche, ruling R-BLD-4). `envoyErrand.js` became a WRITER
  // FAMILY: a head plus nine leaves. That is a reviewed event for this pin precisely
  // because a family could smuggle truth in through a leaf the head never names — so
  // EVERY member is pinned here, not just the head, and the reach is closed TRANSITIVELY.
  // Read the rows below as a DAG that bottoms out at the vocabulary's empty list: the only
  // non-family specifiers any member may name are `negotiationPictures.js` (the picture
  // machinery this seam is built on) and `namedPersonTransit.js` (leg physics, reachable
  // from exactly ONE leaf). Neither can return a settlement's strength, stock or pressure,
  // which the token scan below proves for every row independently.
  'src/domain/worldPulse/envoyErrand.js': [
    './envoyErrandEncounterWriter.js',
    './envoyErrandEvidence.js',
    './envoyErrandLedger.js',
    './envoyErrandOffer.js',
    './envoyErrandParlay.js',
    './envoyErrandProjection.js',
    './envoyErrandRecords.js',
    './envoyErrandTransit.js',
    './envoyErrandVocabulary.js',
    './negotiationPictures.js',
  ],
  // The family floor: zero imports. A module that reaches nothing cannot pass truth along,
  // and every other member sits above this one, so the whole family inherits the guard.
  'src/domain/worldPulse/envoyErrandVocabulary.js': [],
  // The ONE leaf that may reach leg physics (WR-7a law M). Isolating it here is what lets
  // the head be a declared INJECTED-PLAN validator in the movement-site manifest.
  'src/domain/worldPulse/envoyErrandTransit.js': [
    './envoyErrandVocabulary.js',
    './namedPersonTransit.js',
  ],
  'src/domain/worldPulse/envoyErrandOffer.js': [
    './envoyErrandVocabulary.js',
  ],
  'src/domain/worldPulse/envoyErrandRecords.js': [
    './envoyErrandOffer.js',
    './envoyErrandTransit.js',
    './envoyErrandVocabulary.js',
    './negotiationPictures.js',
  ],
  'src/domain/worldPulse/envoyErrandLedger.js': [
    './envoyErrandOffer.js',
    './envoyErrandRecords.js',
    './envoyErrandVocabulary.js',
  ],
  'src/domain/worldPulse/envoyErrandEvidence.js': [
    './envoyErrandRecords.js',
    './envoyErrandTransit.js',
    './envoyErrandVocabulary.js',
  ],
  'src/domain/worldPulse/envoyErrandProjection.js': [
    './envoyErrandLedger.js',
    './envoyErrandOffer.js',
    './envoyErrandRecords.js',
    './envoyErrandTransit.js',
    './envoyErrandVocabulary.js',
  ],
  'src/domain/worldPulse/envoyErrandParlay.js': [
    './envoyErrandOffer.js',
    './envoyErrandRecords.js',
    './envoyErrandTransit.js',
    './envoyErrandVocabulary.js',
    './negotiationPictures.js',
  ],
  'src/domain/worldPulse/envoyErrandEncounterWriter.js': [
    './envoyErrandEvidence.js',
    './envoyErrandLedger.js',
    './envoyErrandOffer.js',
    './envoyErrandParlay.js',
    './envoyErrandProjection.js',
    './envoyErrandRecords.js',
    './envoyErrandVocabulary.js',
    './negotiationPictures.js',
  ],
  'src/domain/worldPulse/negotiationPictures.js': [
    './peaceTerms.js',
  ],
  'src/domain/worldPulse/envoyEncounter.js': [
    './warCoalitionLedger.js',
  ],
  'src/domain/worldPulse/foreignGuestHold.js': [
    '../spatial/distanceRead.js',
  ],
  'src/domain/worldPulse/coalitionRatification.js': [
    './envoyTestimony.js',
    './negotiationPictures.js',
  ],
  'src/domain/worldPulse/envoyTestimony.js': [],
  'src/domain/worldPulse/compromiseRound.js': [],
  // WR-7d. The ransom leaves are negotiation paths too: a price on a person is
  // a demand a court believes, and it must be believed on the same terms as
  // every other. `ransomClaim` reaches ONLY the shared transit kernel — the
  // same reach WR-7a's errand writer already has — and re-declares the I2 claim
  // kind rather than importing `warCoalitionExpenditure`, which reads truth.
  // `sendTwoDivergence` reaches the ladder leaf, which reaches nothing.
  'src/domain/worldPulse/ransomClaim.js': [
    './namedPersonTransit.js',
  ],
  'src/domain/worldPulse/ransomChoices.js': [],
  'src/domain/worldPulse/sendTwoDivergence.js': [
    './envoyTestimony.js',
  ],
  // THE TWO PULSE STAGES (WR-7c/7d), pinned by explicit ruling rather than by a
  // filename accident. The cycle-16 verifier's F7 is the reason this block
  // exists: `envoyRatificationStage.js` and `envoyRansomStage.js` sat OUTSIDE
  // this file's reach because the discovery regex below is scoped to
  // `envoyErrand*`, so K3 staying green said nothing about them in either
  // direction — it neither vindicated nor indicted the new leaves. It says
  // something now. Both are pure reads that compose already-pinned modules:
  // the vote reaches the terms math only through `coalitionRatification`, and
  // the price reaches the claim shape only through `ransomClaim`, both of which
  // are pinned above and both of which bottom out at the empty list.
  'src/domain/worldPulse/envoyRatificationStage.js': [
    './coalitionRatification.js',
    './compromiseRound.js',
    './envoyErrand.js',
    './envoyTestimony.js',
  ],
  'src/domain/worldPulse/envoyRansomStage.js': [
    './envoyErrand.js',
    './foreignGuestHold.js',
    './ransomClaim.js',
  ],
  // WR-8 (N2). The amendment's own list of paths that may never read true world
  // state names FEASIBILITY explicitly, and the architecture volume names "WR-8's
  // feasibility composite" as a member of this pin set module by module. It is
  // pinned at the strongest available setting — ZERO IMPORTS — for the same
  // reason `envoyTestimony` and `compromiseRound` are: a module that reaches
  // nothing cannot reach truth, and the first import is a reviewed event rather
  // than a refactor detail. Everything it eats is a closed banded word that some
  // belief machinery already produced; assembling those words is
  // `conquestDoctrineStage.js`'s job, and that stage is declared exempt below.
  'src/domain/worldPulse/conquestFeasibility.js': [],
  // WR-8 (N3). The intent read is a belief path for the same reason the
  // feasibility read is — its moral discriminator turns on the ENEMY'S BELIEVED
  // NATURE, which is precisely the field an I4 plant moves — so it is pinned at
  // ZERO IMPORTS too. It is worth naming what the empty list buys here
  // specifically: this module decides whether a realm goes to war over what it
  // thinks its neighbour is, and a single import of a truth reader would turn
  // that from a belief into a fact and quietly delete the deception road.
  'src/domain/worldPulse/conquestIntent.js': [],
});

const TRUTH_READER = 'src/domain/worldPulse/warDeployment.js';

/**
 * THE DISCOVERY GUARD (cycle-8 verifier, Finding C).
 *
 * Every row above is hand-written, so the manifest closes the reach of the files
 * it NAMES and says nothing at all about a file it does not. That was tolerable
 * while `envoyErrand.js` was one module; THE DECOMPOSITION WAVE made it a family
 * of ten, and the family is still being worked. An eleventh leaf — split out of
 * the head next week, importing a truth reader for one "small" lookup — would
 * simply not appear in `Object.entries(NEGOTIATION_MODULES)`, so both the import
 * pin and the token scan would iterate straight past it and the suite would stay
 * green. The pin would have been quietly narrowed by an edit that never touched
 * this file, which is the exact shape of failure the K3 amendment exists to make
 * impossible.
 *
 * So membership is DISCOVERED from the filesystem, not declared: every
 * `src/domain/worldPulse/envoyErrand*.js` must be a pinned row. A new leaf reds
 * here until it is reviewed and given a closed import list.
 *
 * SCOPED TO THE ERRAND FAMILY ON PURPOSE. The wider `envoy*.js` glob is NOT the
 * discovery signature and must not become one: `envoyDiplomacy.js`,
 * `envoyPulse.js`, `envoyNews.js` and `envoyInterceptionStage.js` are the
 * orchestration and reader layers that legitimately read true settlement state,
 * and sweeping them in would either red permanently or force the token list to be
 * weakened until it proved nothing. The errand family is the belief-sourced
 * writer set, and it is the set whose filenames share a prefix by construction.
 */
const ERRAND_FAMILY_DIR = 'src/domain/worldPulse';
const ERRAND_FAMILY_RE = /^envoyErrand.*\.js$/;

function discoverErrandFamily() {
  return readdirSync(join(ROOT, ERRAND_FAMILY_DIR))
    .filter((name) => ERRAND_FAMILY_RE.test(name) && !/\.test\./.test(name))
    .map((name) => `${ERRAND_FAMILY_DIR}/${name}`)
    .sort();
}

/**
 * THE SECOND DISCOVERY, over the PULSE STAGES (cycle-16 verifier, F7).
 *
 * Adding two explicit rows above closes those two files and nothing else — the
 * same hand-written gap the errand discovery was built to close, one shelf over.
 * A third stage, split out next week and importing a truth reader for one small
 * lookup, would again be invisible to both the import pin and the token scan.
 *
 * So every `envoy*Stage.js` on disk must be either PINNED or EXPLICITLY EXEMPT.
 * The exemption is a declaration with a reason, not a silence: a new stage reds
 * here until someone decides which it is.
 *
 * WIDENED FOR WR-8 (lane W8-A): the pattern now covers `conquest*Stage.js` too.
 * Scoping it to `envoy*` would have made the new conquest stage invisible here by
 * the identical filename accident F7 was raised about — the discovery would have
 * iterated straight past it and this file would have stayed green while saying
 * nothing about it in either direction. A stage is a stage.
 */
const STAGE_FAMILY_RE = /^(?:envoy|conquest).*Stage\.js$/;

/**
 * `envoyInterceptionStage.js` is the ORCHESTRATION stage and legitimately reads
 * true world state: it reaches `relationshipState.js`, `warSeatBooks.js`,
 * `npcLedger.js` and the army transit ledger, none of which is a belief module.
 * It is exempt for the same reason `envoyPulse.js` and `envoyDiplomacy.js` are
 * outside this file — sweeping them in would either red permanently or force the
 * token list to be weakened until it proved nothing.
 */
const REVIEWED_STAGE_EXEMPTIONS = Object.freeze([
  'src/domain/worldPulse/envoyInterceptionStage.js',
  // WR-8's stage, exempt for the identical reason and with the identical
  // consequence. `conquestDoctrineStage.js` is the ASSEMBLY layer: it reads the
  // court's belief map for everything about the rival and takes the §IV.4
  // self-read carve-out for the court's own granary, which means it legitimately
  // touches `economicState.foodSecurity` and would red the token scan forever.
  // What keeps the seam real is that the module it feeds — `conquestFeasibility.js`,
  // pinned above at ZERO imports — cannot reach any of it. The belief composite
  // is closed; the stage that fills its plate is declared, not silent.
  'src/domain/worldPulse/conquestDoctrineStage.js',
]);

function discoverStageFamily() {
  return readdirSync(join(ROOT, ERRAND_FAMILY_DIR))
    .filter((name) => STAGE_FAMILY_RE.test(name) && !/\.test\./.test(name))
    .map((name) => `${ERRAND_FAMILY_DIR}/${name}`)
    .sort();
}

describe('WR-7b K3 — nobody is ever current', () => {
  test('DISCOVERY: every errand-family leaf on disk is a pinned negotiation module', () => {
    const family = discoverErrandFamily();
    // Anti-vacuity: a broken readdir or a rotted pattern would pass the exact-set
    // assertion below over an empty list. The wave landed a head plus nine leaves.
    expect(family.length, 'the errand family read empty — the discovery pattern rotted').toBeGreaterThanOrEqual(10);
    expect(family).toContain('src/domain/worldPulse/envoyErrand.js');

    const pinned = new Set(Object.keys(NEGOTIATION_MODULES));
    expect(
      family.filter((rel) => !pinned.has(rel)),
      '\nAn envoyErrand family leaf exists on disk with NO row in NEGOTIATION_MODULES. Every '
      + 'member is pinned, not just the head, because a family can smuggle truth in through a '
      + 'leaf the head never names — and an unpinned leaf is invisible to BOTH the import pin '
      + 'and the true-state token scan, so the suite stays green while the seam is gone. Give '
      + 'it a reviewed closed import list above.\n',
    ).toEqual([]);
  });

  test('MUTANT: dropping a family leaf from the manifest reds the discovery guard', () => {
    // The guard is only worth having if it fires. Withdraw one real leaf from the
    // pinned set and the discovery must name exactly that file.
    const dropped = 'src/domain/worldPulse/envoyErrandParlay.js';
    expect(Object.keys(NEGOTIATION_MODULES)).toContain(dropped);
    const mutantPinned = new Set(Object.keys(NEGOTIATION_MODULES).filter((rel) => rel !== dropped));
    expect(discoverErrandFamily().filter((rel) => !mutantPinned.has(rel))).toEqual([dropped]);
  });

  test('DISCOVERY: every pulse stage on disk is pinned or explicitly exempt', () => {
    const stages = discoverStageFamily();
    // Anti-vacuity: a rotted pattern would pass the exact-set assertion below over
    // an empty list. Three stages exist — interception, ratification, ransom.
    expect(stages.length, 'the stage family read empty — the pattern rotted').toBeGreaterThanOrEqual(3);
    expect(stages).toContain('src/domain/worldPulse/envoyRatificationStage.js');
    expect(stages).toContain('src/domain/worldPulse/envoyRansomStage.js');

    const accounted = new Set([
      ...Object.keys(NEGOTIATION_MODULES),
      ...REVIEWED_STAGE_EXEMPTIONS,
    ]);
    expect(
      stages.filter((rel) => !accounted.has(rel)),
      '\nA pulse stage exists on disk that is neither pinned in NEGOTIATION_MODULES nor '
      + 'listed in REVIEWED_STAGE_EXEMPTIONS. K3 says nothing about a file it does not name, '
      + 'so a stage that is merely absent is a stage nobody checked. Decide which it is and '
      + 'say so here: a closed import list if it is belief-sourced, an exemption WITH A '
      + 'REASON if it legitimately reads truth.\n',
    ).toEqual([]);
    // And the exemption list may not rot into a name that no longer exists.
    for (const rel of REVIEWED_STAGE_EXEMPTIONS) {
      expect(stages, `${rel} is exempted but not on disk`).toContain(rel);
    }
  });

  test('MUTANT: dropping a pinned stage from the manifest reds the stage discovery', () => {
    const dropped = 'src/domain/worldPulse/envoyRatificationStage.js';
    expect(Object.keys(NEGOTIATION_MODULES)).toContain(dropped);
    const accounted = new Set([
      ...Object.keys(NEGOTIATION_MODULES).filter((rel) => rel !== dropped),
      ...REVIEWED_STAGE_EXEMPTIONS,
    ]);
    expect(discoverStageFamily().filter((rel) => !accounted.has(rel))).toEqual([dropped]);
  });

  test('every negotiation module reaches only its reviewed closed import set', () => {
    for (const [rel, expected] of Object.entries(NEGOTIATION_MODULES)) {
      const source = code(rel);
      expect(source.length, `${rel} read empty`).toBeGreaterThan(1000);
      // A new import here is a reviewed event, not a refactor detail: it is the
      // one edit that could put true state within reach of a negotiation.
      expect(importsOf(source), `${rel} import list`).toEqual([...expected].sort());
    }
  });

  test('no true-state read token appears anywhere in the negotiation set', () => {
    for (const rel of Object.keys(NEGOTIATION_MODULES)) {
      const source = code(rel);
      // anchored: the file is asserted non-empty above and again here, so these
      // absences are real rather than an empty read passing as compliance.
      expect(source.length, `${rel} read empty`).toBeGreaterThan(1000);
      for (const token of TRUE_STATE_TOKENS) {
        // The file is asserted non-empty immediately above, and guard-the-guard
        // below proves this exact token list still matches a module that DOES
        // read truth — so an absence here is neither an empty read nor a rotted
        // string.
        expect(source, `${rel} must not reach ${token}`).not.toContain(token); // anchored: see above
      }
    }
  });

  test('the two-picture wrapper reaches peaceTerms only through input-shaped leaves', () => {
    const source = code('src/domain/worldPulse/negotiationPictures.js');
    const imported = [...source.matchAll(/import\s*\{([\s\S]*?)\}\s*from\s*'\.\/peaceTerms\.js'/g)]
      .flatMap((match) => match[1].split(','))
      .map((name) => name.trim())
      .filter(Boolean)
      .sort();
    // Each of these takes already-banded inputs, never a worldState. Importing a
    // world-reading export instead (advanceTreaties and its kin) is exactly how
    // truth would re-enter the lit path.
    expect(imported).toEqual([
      'alignmentPressFromInput',
      'appraiseLoserPortfolioFromInputs',
      'believedAdvantageFromInputs',
      'carriedClauseFromDraft',
      'draftTerms',
      'normalizeCarriedTermSheet',
      'termBudgetFor',
    ]);
    // The exact imported-symbol list is asserted above, so this file demonstrably
    // reads peaceTerms: the two absences below are a live selection within a
    // proven-present import, not a collection that drifted away.
    expect(source).not.toContain('advanceTreaties'); // anchored: import list asserted above
    expect(source).not.toContain('worldState'); // anchored: import list asserted above
  });

  test('WR-7c: the vote reaches the terms math only through the two-picture wrapper', () => {
    const source = code('src/domain/worldPulse/coalitionRatification.js');
    expect(source.length, 'the ratification module read empty').toBeGreaterThan(1000);
    // The ballot is drawn under one member's own frozen picture, through the
    // same wrapper the parlay uses. A direct peaceTerms import here would be a
    // second terms evaluator — the design defect the seam ruling names.
    // The second entry is the reviewed vocabulary reach documented above; the
    // test below proves the module it reaches for reaches nothing itself.
    expect(importsOf(source)).toEqual(['./envoyTestimony.js', './negotiationPictures.js']);
    expect(source).not.toContain('peaceTerms'); // anchored: import list asserted above
    expect(source).not.toContain('worldState'); // anchored: import list asserted above
  });

  test('WR-7c: the two band-only leaves reach nothing at all', () => {
    for (const rel of [
      'src/domain/worldPulse/envoyTestimony.js',
      'src/domain/worldPulse/compromiseRound.js',
    ]) {
      const source = code(rel);
      expect(source.length, `${rel} read empty`).toBeGreaterThan(1000);
      // Zero imports is the strongest form of this pin: a module that reaches
      // nothing cannot reach truth, and adding the first import is a reviewed
      // event rather than a refactor detail.
      expect(importsOf(source), `${rel} import list`).toEqual([]);
      expect(source, `${rel} must not name worldState`).not.toContain('worldState'); // anchored: see above
    }
  });

  test('GUARD-THE-GUARD: the same scan finds those tokens where truth is read', () => {
    const source = code(TRUTH_READER);
    expect(source.length, 'the positive control read empty').toBeGreaterThan(1000);
    // If this stops matching, the token list has rotted and the absences above
    // are proving nothing — the guard fails loudly instead of silently passing.
    for (const token of TRUE_STATE_TOKENS) {
      expect(source, `${TRUTH_READER} should read ${token}`).toContain(token);
    }
  });
});
