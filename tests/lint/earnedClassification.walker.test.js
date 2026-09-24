/**
 * earnedClassification.walker.test.js — THE EARNED-CLASSIFICATION WALKER (FP IN-6 U2; the
 * guard-the-guard shape of DESIGN_FP_INFORMATION.md §1c's mint-time rule, DESIGN_FP_ARCH_IN.md
 * §IN-6, the compiled block #22).
 *
 * THE CLASS IT REMOVES. The soak classifier (scripts/audit/behavioral-observation.mjs,
 * moverFamilyOf) used to carry the bare word `news` in the knowledge family's token list. Every
 * wizard-news receipt id is `wizard_news.<tick>.<kind>...`, so any receipt that matched no earlier
 * family fell into `knowledge` on its id alone: at 85c170e8e that was 33 impactKinds and 145
 * routed kinds (IN-6 U1's re-measure), and a knowledge count proved nothing about the belief lane.
 * The charter spells the site "BEHAVIORAL_MOVER_FAMILIES.knowledge"; the tree carries the token
 * list as FAMILY_TOKENS.knowledge in that script (the drift is recorded, SR-4).
 *
 * THREE ARMS, each executed through the production classifier, never by reading a token list:
 *   SCAFFOLD    a record whose only vocabulary is the wizard-news id classifies into NO family,
 *               and the live residual census (tests/helpers/knowledgeResidualCensus.js) is empty.
 *               Restoring `news` to any family reds this arm: that is the mutant.
 *   EARNED      every REGISTERED knowledge kind classifies `knowledge` on its own vocabulary, and
 *               its wizard-news id changes nothing. The census is derived from registration: the
 *               knowledge desk's exact rows, the INFORMATION registry's desk-bearing rows, and the
 *               named IN beats other desks file by recorded rulings (each asserted at its desk).
 *   PRECEDENCE  a registered COMPOUND (a kind's own full name) outranks a bare word inside it, so
 *               race_person is knowledge though `person` is a people word, while an ordinary
 *               people kind stays people.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';
import { EXACT_SECTION } from '../../src/domain/realm/heraldRouting.js';
import { INFORMATION_KIND_REGISTRY } from '../../src/domain/worldPulse/informationNews.js';
import {
  KNOWLEDGE_FAMILY_RESIDUAL_IMPACT_KINDS,
  KNOWLEDGE_FAMILY_RESIDUAL_KINDS,
} from '../../src/domain/certification/knowledgeLaneEvidence.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { measuredResidual, wizardNewsIdOf } from '../helpers/knowledgeResidualCensus.js';

/** The id every wizard-news receipt carries, around a kind no family registers. */
const SCAFFOLD_ID = wizardNewsIdOf('zzz_unregistered_kind');

/**
 * IN beats filed at a desk other than knowledge, each by a recorded ruling. Listed because routing
 * cannot derive them; each row is asserted AT its desk below, so the list cannot rot silently.
 */
const EARNED_BEYOND_THE_DESK = Object.freeze([
  // infowar_*: the statecraft exposure beats, on the war desk by the war-doctrine judgment (IN-5 §C).
  ['infowar_lie_exposed', 'war'],
  ['infowar_spy_exposed', 'war'],
  // intel_transfer: the trade desk by heraldRouting's authoring ruling (IN-5 kept it there).
  ['intel_transfer', 'trade'],
  // treaty_disclosure_opened: IN-0c's disclosure article, filed with the treaty's trade terms.
  ['treaty_disclosure_opened', 'trade'],
]);

const knowledgeDeskKinds = Object.keys(EXACT_SECTION).filter((kind) => EXACT_SECTION[kind] === 'knowledge');
const informationDeskKinds = INFORMATION_KIND_REGISTRY
  .filter((row) => row.section != null)
  .map((row) => row.kind);
const REGISTERED = [...new Set([
  ...knowledgeDeskKinds,
  ...informationDeskKinds,
  ...EARNED_BEYOND_THE_DESK.map(([kind]) => kind),
])].sort(compareCodepoint);

describe('SCAFFOLD — no family is earned by the wizard-news id', () => {
  test('a record whose only vocabulary is the id scaffold classifies into NO family', () => {
    expect(moverFamilyOf({ id: SCAFFOLD_ID })).toBeNull();
    // The same scaffold around a registered kind earns exactly that kind's family.
    expect(moverFamilyOf({ id: wizardNewsIdOf('lure_sprung') })).toBe('knowledge');
  });

  test('the live census finds no kind that reaches knowledge through its id alone', () => {
    expect(measuredResidual()).toEqual({ impactKinds: [], kinds: [] });
  });

  test('the residual catalog banks the cure: both lists are empty', () => {
    expect(KNOWLEDGE_FAMILY_RESIDUAL_IMPACT_KINDS).toEqual([]);
    expect(KNOWLEDGE_FAMILY_RESIDUAL_KINDS).toEqual([]);
  });
});

describe('EARNED — every registered knowledge kind classifies on its own vocabulary', () => {
  test('guard-the-guard: the registered census is derived and not vacuous', () => {
    expect(knowledgeDeskKinds.length, 'the knowledge desk routes kinds by exact row').toBeGreaterThanOrEqual(5);
    expect(informationDeskKinds.length, 'the INFORMATION registry carries desk-bearing rows').toBeGreaterThanOrEqual(7);
    expect(REGISTERED).toContain('race_person');
    expect(REGISTERED).toContain('word_came_too_late');
  });

  test('every beat filed beyond the knowledge desk is still routed where its ruling files it', () => {
    for (const [kind, desk] of EARNED_BEYOND_THE_DESK) expect(EXACT_SECTION[kind], kind).toBe(desk);
  });

  test('each registered kind is knowledge alone, as an impactKind, and with its wizard-news id', () => {
    for (const kind of REGISTERED) {
      expect(moverFamilyOf({ kind }), `${kind} on its own`).toBe('knowledge');
      expect(moverFamilyOf({ impactKind: kind }), `${kind} as an impactKind`).toBe('knowledge');
      expect(moverFamilyOf({ kind, id: wizardNewsIdOf(kind) }), `${kind} with its id`).toBe('knowledge');
    }
  });
});

describe('PRECEDENCE — a registered compound outranks a bare word inside it', () => {
  test('race_person is knowledge though `person` is a people word', () => {
    expect(moverFamilyOf({ kind: 'race_person' })).toBe('knowledge');
    // CONTROL: a kind whose only vocabulary is the people word still classifies people.
    expect(moverFamilyOf({ kind: 'person_arrived' })).toBe('people');
    expect(moverFamilyOf({ kind: 'npc_ladder' })).toBe('people');
  });
});
