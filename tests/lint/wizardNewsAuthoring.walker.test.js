/**
 * wizardNewsAuthoring.walker.test.js — A-3 THE AUTHORING-SIDE PRESENCE WALL.
 *
 * Resolution already rejects id-less Wizard News rows, and heraldRouting's older
 * walkers census impactKind/candidateType vocabularies. Neither answered the source-
 * side question: did every newly-authored news object carry the minimum addressable
 * shape, and did a producer that routes on bare `kind` register that kind at all?
 * Peace terms and the 2026-07-31 ten-kind void both crossed that gap.
 *
 * DENOMINATOR: every src/domain object literal co-locating `kind` + `headline`.
 * REQUIRED: id + settlementIds + severity, plus an explicitly registered static
 * routing token. Dynamic impactKind/candidateType families remain owned by the
 * existing closed-vocabulary routing walkers; dynamic BARE kinds fail here because
 * no companion walker can see them. A local closed choice (`const kind = flag ? …`)
 * is resolved without executing source.
 *
 * Legacy projection/intermediate shapes stay visible in a frozen exact ledger. The
 * ledger binds each exception to path + line/column + source signature + issue set,
 * and has no update mode. Its 19-row ceiling only shrinks: clean the source and delete
 * the now-stale row; a new site may never buy itself an exception.
 *
 * @enforced-module src/domain/region/wizardNews.js
 * @enforced-module src/domain/realm/heraldRouting.js
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { isExplicitlyRouted } from '../../src/domain/realm/heraldRouting.js';
import {
  censusNewsAuthoringSites,
  debtLedgerRows,
  scanNewsAuthoringSource,
} from './newsAuthoringCensus.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests', 'lint', '.wizard-news-authoring-baseline.json');
const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const census = censusNewsAuthoringSites(ROOT, isExplicitlyRouted);
const currentDebt = debtLedgerRows(census.sites);

const COMPLETE_BARE_SITE = `
  const receipt = {
    id: 'wizard_news.1.webwar_raid.a.b',
    settlementIds: ['a', 'b'],
    severity: 0.6,
    kind: 'webwar_raid',
    headline: 'A raids B',
  };
`;

function mutantIssues(source) {
  return scanNewsAuthoringSource(source, 'mutant.js', isExplicitlyRouted)
    .flatMap((site) => site.issues);
}

describe('Wizard News authoring presence — static census wall', () => {
  test('the source census is broad and non-vacuous, including the historical blind spots', () => {
    expect(census.files.length).toBeGreaterThanOrEqual(690);
    expect(census.sites.length).toBeGreaterThanOrEqual(80);
    expect(new Set(census.sites.map((site) => site.path)).size).toBeGreaterThanOrEqual(45);

    const byPath = new Map();
    for (const site of census.sites) {
      if (!byPath.has(site.path)) byPath.set(site.path, []);
      byPath.get(site.path).push(site);
    }
    // The treaty producer that lived without an id/address, and the exact kind-only
    // families fixed on 2026-07-31, must remain inside this walker's denominator.
    expect(byPath.get('src/domain/worldPulse/peaceTerms.js')?.length).toBeGreaterThanOrEqual(1);
    expect(byPath.get('src/domain/worldPulse/informationStatecraft.js')?.length).toBe(3);
    expect(byPath.get('src/domain/worldPulse/supplyWebWarfare.js')?.length).toBe(4);
    expect(byPath.get('src/domain/worldPulse/momentum.js')?.length).toBe(1);
  });

  test('the frozen legacy ledger is exact, location-bound, and shrink-only', () => {
    expect(baseline).toMatchObject({ schemaVersion: 1, frozenAt: '2026-08-01' });
    expect(Array.isArray(baseline.entries)).toBe(true);
    expect(baseline.entries.length).toBeLessThanOrEqual(19);
    expect(new Set(baseline.entries.map((entry) => `${entry.path}:${entry.line}:${entry.column}`)).size)
      .toBe(baseline.entries.length);
    expect(
      currentDebt,
      '\nWizard News authoring debt changed. A NEW row must be fixed, never baselined. '
      + 'A removed/relocated row is a win: delete its stale exact baseline entry. '
      + 'Do not raise the 19-row ceiling.\n',
    ).toEqual(baseline.entries);
  });

  test('positive control: a complete registered bare-kind authoring site is clean', () => {
    const sites = scanNewsAuthoringSource(COMPLETE_BARE_SITE, 'control.js', isExplicitlyRouted);
    expect(sites).toHaveLength(1);
    expect(sites[0].routeField).toBe('kind');
    expect(sites[0].routeTokens).toEqual(['webwar_raid']);
    expect(sites[0].issues).toEqual([]);
  });

  test.each([
    ['id', /\n\s*id:[^\n]+/],
    ['settlementIds', /\n\s*settlementIds:[^\n]+/],
    ['severity', /\n\s*severity:[^\n]+/],
  ])('mutant: removing required %s is caught', (field, remover) => {
    const mutated = COMPLETE_BARE_SITE.replace(remover, '');
    expect(mutantIssues(mutated)).toContain(`missing-field:${field}`);
  });

  test('mutant: an unregistered impactKind is caught at its authoring object', () => {
    const source = COMPLETE_BARE_SITE.replace(
      "kind: 'webwar_raid',",
      "kind: 'applied',\n    impactKind: 'future_unregistered_impact',",
    );
    expect(mutantIssues(source)).toContain(
      'missing-registration:unrouted:future_unregistered_impact',
    );
  });

  test('mutants: unregistered and unresolved bare-kind producers are both visible', () => {
    const unregistered = COMPLETE_BARE_SITE.replace(
      "kind: 'webwar_raid'",
      "kind: 'future_bare_news_kind'",
    );
    expect(mutantIssues(unregistered)).toContain(
      'missing-registration:unrouted:future_bare_news_kind',
    );

    const dynamic = COMPLETE_BARE_SITE.replace("kind: 'webwar_raid'", 'kind: routeKind');
    expect(mutantIssues(dynamic)).toContain('missing-registration:dynamic-bare-kind');
  });

  test('closed local bare-kind choices resolve, so the wall is strict without false opacity', () => {
    const source = `
      export function receipt(flag) {
        const kind = flag ? 'webwar_raid' : 'webwar_wrong_village';
        return {
          id: 'wizard_news.1.webwar.a.b',
          settlementIds: ['a', 'b'],
          severity: 0.6,
          kind,
          headline: 'A raid is reported',
        };
      }
    `;
    const sites = scanNewsAuthoringSource(source, 'closed-choice.js', isExplicitlyRouted);
    expect(sites).toHaveLength(1);
    expect(sites[0].routeTokens).toEqual(['webwar_raid', 'webwar_wrong_village']);
    expect(sites[0].issues).toEqual([]);
  });
});
