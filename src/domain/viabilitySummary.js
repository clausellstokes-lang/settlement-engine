/**
 * src/domain/viabilitySummary.js — THE VIABILITY VERDICT SENTENCE, ONE WRITER.
 *
 * MOVED HERE from src/generators/economy/viability.js at the rung-1 landing (LANDING-6,
 * 2026-11-05; signed record 28, the V-SUMMARY-HOOKS cure) with no change to its body, so the
 * generator that first writes the summary and the hook filter that re-derives it after the
 * draw (src/domain/coherence/hookTruthRecord.js :: withoutFalseHooks) call the same function;
 * a domain module may not import a generator (tests/build/domainGeneratorsBoundary.test.js).
 * Before the move the filter dropped a false viability hook and left the sentence's
 * "N plot hooks available" at the pre-filter count (18 of the 63 stride towns; TRUTH 7eb0bf0ba).
 */
import { SEVERITY } from '../data/constants.js';

// buildViabilitySummary
//
// ⛔ THE SENTENCE COUNTS THE LIST THE RECORD PUBLISHES, AND IT IS HANDED THAT LIST
// RATHER THAN A POPULATION TO RE-DERIVE (ODQ §934.57, FIX-G1). It used to count
// DEPENDENCY-severity rows across `[...issues, ...warnings]` while the record
// published `dependencies` from `warnings` ALONE, so every DEPENDENCY a deriver
// filed under `issues` was counted by the headline and absent from the list beneath
// it. `foodBalance.js` has two such arms (Heavy / Severe Food Import Dependency, on
// the deficitPercent > 40 branch of a connected non-road route), and on
// `town|germanic|mountain|mountain_pass|civilized` the sentence said SIX beside a
// list of FIVE. Measured over the 525-row golden corpus: 370 rows state the count,
// exactly 1 disagreed, and the LIST was right on all 525 (the record's own second
// counter, `metrics.dependencyCount`, agreed with it everywhere).
//
// The parameter is now the published list itself, not the warnings bucket, so the
// two can no longer be spelled differently: the caller computes `dependencies` ONCE
// and the publication, the metric and this sentence all read that one array. The
// 571-574 note below still binds and is honoured — the summary must see dependency
// warnings so a food-import dependency is never contradicted by a "self-sufficient"
// headline. It was the `...issues` term that was wrong, never the warnings term.
/**
 * @param {boolean} isViable
 * @param {ReadonlyArray<{ severity?: string }>} issues
 * @param {ReadonlyArray<unknown>} dependencies the published dependency list
 * @param {ReadonlyArray<unknown>} plotHooks the stored viability hooks
 * @param {{ dailyNeed?: unknown, deficit?: unknown, rawDeficit?: unknown, deficitPercent?: unknown } | null | undefined} foodBalance
 * @returns {string}
 */
export const buildViabilitySummary = (isViable, issues, dependencies, plotHooks, foodBalance) => {
  const criticalCount = issues.filter((i) => i.severity === SEVERITY.CRITICAL).length;
  const implausibleCount = issues.filter((i) => i.severity === SEVERITY.IMPLAUSIBLE).length;
  const dependencyCount = dependencies.length;
  const dailyNeed = Number(foodBalance?.dailyNeed) || 0;
  const uncoveredDeficit = Math.max(0, Number(foodBalance?.deficit) || 0);
  const rawDeficit = Math.max(uncoveredDeficit, Number(foodBalance?.rawDeficit) || 0);
  const deficitPercent = dailyNeed > 0
    ? Math.round((uncoveredDeficit / dailyNeed) * 100)
    : Math.max(0, Math.round(Number(foodBalance?.deficitPercent) || 0));
  const rawDeficitPercent = dailyNeed > 0
    ? Math.round((rawDeficit / dailyNeed) * 100)
    : deficitPercent;
  if (criticalCount > 0) {
    const issueLabel = criticalCount === 1 ? 'issue' : 'issues';
    const verb = criticalCount === 1 ? 'prevents' : 'prevent';
    return `✗ NOT VIABLE: ${criticalCount} critical ${issueLabel} ${verb} settlement survival.`;
  }
  if (implausibleCount > 3) return ` IMPLAUSIBLE: ${implausibleCount} historical inconsistencies break believability.`;
  if (dependencyCount > 0)
    return `✓ VIABLE: Settlement can survive but has ${dependencyCount} operational dependenc${dependencyCount > 1 ? 'ies' : 'y'} that require active management. ${plotHooks.length} plot hooks available.`;
  if (uncoveredDeficit > 0)
    return `△ VIABLE WITH PROVISIONING STRAIN: ${deficitPercent}% of daily food need remains uncovered.`;
  if (rawDeficit > 0)
    return `✓ VIABLE WITH PROVISIONING SUPPORT: imports, reserves, or extraordinary supply cover ${rawDeficitPercent}% of daily food need.`;
  return '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.';
};
