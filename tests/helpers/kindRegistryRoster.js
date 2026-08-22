/**
 * kindRegistryRoster.js — THE ONE ROSTER of every phrased-kind registry in the tree.
 *
 * WHY THIS FILE EXISTS (ODQ §356.2, R-6; the single-source law applied to a test):
 * this roster was transcribed TWICE — once in tests/lint/kindPoolFloors.walker.test.js
 * and once, by hand, inside tests/domain/pantheon.test.js's A5. WF-8a registered the
 * FAITH family, moved the shared denominators, and reddened the hand copy that no
 * packet had named. A hand-copied denominator drifts the moment the original moves.
 * With one roster, drift breaks BOTH consumers identically instead of letting one
 * silently disagree with the other — which is the whole point of the law.
 *
 * Listed rather than globbed, deliberately: a registry that stopped being imported
 * would silently leave the estate-wide claim, and a missing entry here is a review
 * conversation, not a quiet shrink of the denominator.
 *
 * The FIGURES derived from this roster stay literal in each consumer. They are
 * deliberate freezes, and this repair removes the duplicated LIST, never the freezes.
 *
 * CONSUMERS: tests/lint/kindPoolFloors.walker.test.js · tests/domain/pantheon.test.js
 */
import {
  ENVOY_KIND_REGISTRY,
  WAR_COALITION_KIND_REGISTRY,
  WAR_COST_KIND_REGISTRY,
  WAR_DISPOSITION_KIND_REGISTRY,
  WAR_LINEAGE_KIND_REGISTRY,
  WAR_RULING_KIND_REGISTRY,
} from '../../src/domain/worldPulse/eventProse.js';
import { COMMERCIAL_KIND_REGISTRY } from '../../src/domain/worldPulse/commercialReasonsNews.js';
import { GRAMMAR_KIND_REGISTRY } from '../../src/domain/worldPulse/grammarNews.js';
import { FAITH_KIND_REGISTRY } from '../../src/domain/worldPulse/faithNews.js';
import { INFORMATION_KIND_REGISTRY } from '../../src/domain/worldPulse/informationNews.js';
import { SOVEREIGNTY_KIND_REGISTRY } from '../../src/domain/worldPulse/sovereigntyNews.js';

/**
 * EVERY phrased-kind registry in the tree, named by its program.
 * @type {ReadonlyArray<readonly [string, ReadonlyArray<any>]>}
 */
export const KIND_REGISTRIES = Object.freeze([
  ['WAR_DISPOSITION', WAR_DISPOSITION_KIND_REGISTRY],
  ['WAR_LINEAGE', WAR_LINEAGE_KIND_REGISTRY],
  ['WAR_COST', WAR_COST_KIND_REGISTRY],
  ['WAR_RULING', WAR_RULING_KIND_REGISTRY],
  ['WAR_COALITION', WAR_COALITION_KIND_REGISTRY],
  ['ENVOY', ENVOY_KIND_REGISTRY],
  ['COMMERCIAL', COMMERCIAL_KIND_REGISTRY],
  ['GRAMMAR', GRAMMAR_KIND_REGISTRY],
  ['SOVEREIGNTY', SOVEREIGNTY_KIND_REGISTRY],
  // IN-1c-a: the fifth FP registry family, and the estate's first ONE-ROW registry. Its single
  // kind is a DOSSIER LINE with `section: null`, so it registers WITHOUT routing — which is why
  // it moves REGISTERED_KIND_COUNT and the divergence identity while leaving ROUTED_TOKENS
  // exactly where it is.
  ['INFORMATION', INFORMATION_KIND_REGISTRY],
  // WF-8a: the SIXTH FP registry family, and the estate's SECOND deliberately one-row one. Its
  // single kind is the settlement extinction obituary, which DOES carry a Herald desk — so
  // unlike INFORMATION's dossier line it moves ROUTED_TOKENS and REGISTERED_KIND_COUNT
  // together and leaves the registered-minus-routed difference exactly where it was.
  ['FAITH', FAITH_KIND_REGISTRY],
]);
