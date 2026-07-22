/**
 * ruinFilterRoster.walker.test.js — the RUIN-FILTER inventory ratchet
 * (structural-prevention Pattern 2; coherence audit R3, the ruin-filter lane).
 *
 * THE CLASS: a functional consumer that reads a settlement's `.institutions` roster
 * as a set of LIVE providers (martial force, faith backing, plague care, capacity, …)
 * must exclude calamity-ruined / abandoned / closed rows (`_worldPulseInactive` /
 * status ruined|removed|destroyed|remnant), or it credits a flattened building with
 * full function. The canonical filter is src/domain/institutions/institutionRoster.js
 * (`liveInstitutions` / `isLiveInstitution`).
 *
 * THE GUARD: this walker source-scans src/domain for every file that reads `.institutions`
 * and asserts each is EITHER
 *   (a) COMPLIANT — it imports the institutionRoster accessor OR carries a
 *       `_worldPulseInactive` ruin guard (a local standing predicate), OR
 *   (b) EXEMPT — listed in RUIN_AGNOSTIC_EXEMPT below with a reason category (a reader
 *       that touches the raw roster for a NON-crediting purpose: display, mutation,
 *       name-lookup, a boolean existence gate, a delegating call into a filtering
 *       helper, a precomputed facet scalar, a graph/catalog build, a penalty-side
 *       count, an owner-deferred spatial mechanic, or normalization).
 * A NEW file that reads `.institutions`, filters nothing, and is not exempted FAILS
 * here — forcing its author to route through the accessor or classify it consciously.
 *
 * ACCEPTED REGEX-GATE GAPS (hand-audited 2026-07-19; adversarial-verified):
 *   - Compliance is FILE-granular. A file that imports the accessor (or holds a ruin
 *     token) for ONE read passes even if it has a SECOND unfiltered roster read. Known
 *     live instance: capacityModel.js routes its six SUPPLY derivers through the
 *     accessor but its two DEMAND counts (deriveLabor / deriveAdministrative,
 *     `s.institutions.length`) stay raw ON PURPOSE — counting ruins there only
 *     over-states demand (over-pessimism), the opposite of the over-crediting class,
 *     and is deferred as out-of-class. The per-site guarantee rests on the probe tests
 *     (ruinFilter.probe.test.js) + review, not this file-granular walker.
 *   - Fully-routed files DROP OUT of the discovery set (the raw `.institutions` text is
 *     replaced by `liveInstitutions(...)`), so the fixed aggregators do not appear here.
 *   - `\.institutions\b` deliberately excludes `.institutionsById` / `.institutionsLost`
 *     (no word boundary before the trailing token) and matches config-path string
 *     literals like 'headcounts.institutions' (frozen as exempt where they occur).
 *
 * TO COMPLY (new violation): route the roster read through liveInstitutions()/
 * isLiveInstitution() (src/domain/institutions/institutionRoster.js). If the read is
 * genuinely ruin-agnostic (display, mutation, existence, …), add the file to
 * RUIN_AGNOSTIC_EXEMPT with a reason. Never delete this guard to pass.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOMAIN = join(ROOT, 'src', 'domain');

/** A raw settlement-roster read. `\b` excludes `.institutionsById` / `.institutionsLost`. */
const READER_RE = /\.institutions\b/;
/** The filtering signal: the shared accessor, or a local `_worldPulseInactive` standing guard. */
const COMPLIANT_RE = /institutionRoster|_worldPulseInactive/;

// Readers that touch the raw roster for a NON-crediting purpose. Frozen 2026-07-19 from a
// 3-batch consumer census (every read-site read in full). Each value is the reason category.
const RUIN_AGNOSTIC_EXEMPT = Object.freeze({
  // ── delegates: routes the roster through a helper that already filters ──────────
  'src/domain/worldPulse/navalStrength.js': 'delegates — navalLayer.isStanding filters _worldPulseInactive/status',
  'src/domain/worldPulse/tradeWar.js': 'delegates — institutionTolerance.institutionConscience skips !isStandingInstitution',
  'src/domain/worldPulse/pestilenceKernel.js': 'delegates — classifyCareRoster (now ruin-filtered)',
  'src/domain/display/settlementPestilence.js': 'delegates/display — carePosture → classifyCareRoster (ruin-filtered)',
  'src/domain/worldPulse/corruptionWeb.js': 'delegates — hasClandestineFacet(.some); this lane fixed foreignEndpointLive→occupations',
  // ── guarded inline: filters `status !== active` before counting ─────────────────
  'src/domain/worldPulse/upswingKernel.js': 'guarded — inline `status !== active` before builder/culture counts',
  'src/domain/worldPulse/urbanFabricKernel.js': 'guarded — inline `status !== active` (a ruined deposit yields nothing)',
  // ── existence-gate (DEFERRED): ruin-blind boolean .some(); owner glance ──────────
  'src/domain/worldPulse/clandestineFacet.js': 'existence-gate (deferred) — .some() clandestine-facet presence',
  'src/domain/worldPulse/generosityKernel.js': 'existence-gate (deferred) — .some() charity presence',
  'src/domain/worldPulse/stressorGates.js': 'existence-gate — .some() magic-dependence → narrative strings',
  'src/domain/tableLedger.js': 'name/existence-lookup — exposureTargets offers corruption-marked NPCs/institutions/factions as DM exposure-picker options (selection list, not live-provider aggregation)',
  'src/domain/mapProfile.js': 'existence-gate (deferred) — .some() walls → hasWalls; a ruined citadel still reads walled (owner glance)',
  'src/domain/contradictions.js': 'existence-gate — narrative QA detectors (.some presence)',
  'src/domain/traditions/politics.js': 'existence/candidate — tradition-owner candidate membership (deferred; owner glance)',
  // ── name-lookup / target-selection: resolves ONE institution, not a provider sum ─
  'src/domain/worldPulse/entrepotKernel.js': 'name-lookup + write — founds/looks up one institution',
  'src/domain/worldPulse/factionCompetition.js': 'target-selection — picks one institution to suppress/capture',
  'src/domain/worldPulse/supplyKernel.js': 'name-lookup + mutation — resolves one consuming institution; stamps impairments',
  'src/domain/worldPulse/applyWorldPulse.js': 'name-lookup + mutation — finds one named institution to impair',
  'src/domain/dailyLife.js': 'name-lookup/display — first temple/market/inn for gathering-place flavour',
  'src/domain/npcProfile.js': 'name-lookup/display — NPC→institution links + category/power name lists',
  'src/domain/explanation.js': 'name-lookup/display — single-institution explain + entity catalog',
  'src/domain/dossier/entityLinks.js': 'name-lookup — name→id resolution + link-index build',
  'src/domain/entities/propagate.js': 'name-lookup + mutation — impairment propagation graph',
  'src/domain/regenerationMode.js': 'name-lookup — single institution by id for canon-tag preservation',
  'src/domain/districtProfile.js': 'display/list — name-overlap match to a quarter',
  // ── facet-scalar: reads a precomputed number, not the roster ─────────────────────
  'src/domain/worldPulse/attrition.js': 'facet-scalar — reads precomputed facets.institutions, not the roster',
  'src/domain/worldPulse/warDeployment.js': 'facet-scalar — reads precomputed facets.institutions (commandQuality)',
  // ── penalty-side: counts impaired/criminal for a PENALTY, not live crediting ─────
  'src/domain/corruption.js': 'penalty-side — criminal/corruption-impairment classifier (drag, not credit)',
  'src/domain/state/deriveSystemState.js': 'penalty-side — countByStatus impaired/critical risk penalty (status-aware)',
  // ── mutation / write / undo: rewrites the roster ─────────────────────────────────
  'src/domain/worldPulse/blockadeTransport.js': 'mutation — stamps airship impairments across the roster',
  'src/domain/events/mutateEntities.js': 'mutation — entity edit application',
  'src/domain/events/mutateHelpers.js': 'mutation — roster edit helpers',
  'src/domain/events/mutateWorld.js': 'mutation — event-effect application over the roster',
  'src/domain/events/undoEvent.js': 'undo — reverts created institutions',
  'src/domain/events/batch.js': 'name-set — indexes institution ids/names for batch ops',
  'src/domain/events/affordanceManifest.js': 'affordance — enumerates the roster for edit affordances',
  'src/domain/normalizeSettlement.js': 'normalization — structural fingerprint reads the roster length',
  // ── graph/catalog build: builds an index/graph, not a live-provider sum ──────────
  'src/domain/inferSupplyChains.js': 'graph-build — supply-chain graph over a custom-content authoring bundle',
  'src/domain/canonStatus.js': 'graph/tally — canon-provenance tally by source/status',
  'src/domain/counterfactual.js': 'catalog — UI counterfactual target enumeration',
  'src/domain/intent/opVocabulary.js': 'catalog — protected-id enumeration for the consent barrier',
  'src/domain/coherence/checkDraftEdit.js': 'validation — structural-validity check for a draft edit',
  'src/domain/aiGrounding.js': 'ai-grounding — locked-entity enumeration',
  'src/domain/aiOverlayVerifier.js': 'ai-verify — before/after entity-array diff',
  'src/domain/townMap/townLayoutV2.js': 'display — town-map district placement',
  'src/domain/townMap/townMapModel.js': 'display — town-map district placement',
  // ── owner-deferred: owner-designed spatial connectivity mechanic ─────────────────
  // spatialDigest feeds buildSeaLanes/buildTeleportEdges (the owner's PORT §4j /
  // TELEPORT §4e/§4f rules). Their explicit siege model is NODE-STARVATION, not
  // edge-severance ("a besieger cannot cut the EDGE, only STARVE the NODE"), so whether
  // a calamity-ruined port/circle should sever connectivity is an OWNER design call,
  // not a mechanical repair. Deferred to owner; NOT fixed in this lane.
  'src/domain/spatial/spatialDigest.js': 'owner-deferred — feeds seaLanes/teleportEdges (owner PORT/TELEPORT rules; siege=node-starvation not edge-severance)',
  // ── display: renders the roster (showing a ruin is correct) ──────────────────────
  'src/domain/display/defenseDisplay.js': 'display — defenseProfile.institutions force buckets, not the roster',
  'src/domain/display/institutionProfile.js': 'display — defenseProfile.institutions buckets',
  'src/domain/display/threatAssessment.js': 'display — defenseProfile.institutions buckets',
  'src/domain/display/dossierViewModel.js': 'display — roster count for the dossier overview',
  'src/domain/dossier/powerSupport.js': 'display/list — lists institutions aligned to each power for the Power-tab support web (a relationship/alignment display keyed on category + factionSource, NOT a live-provider capacity aggregate); each row is an InstitutionLink that surfaces the institution\'s actual state, so a ruin is shown, never credited with function',
  'src/domain/display/parityContract.js': 'display/contract — a canon-path string literal, not a roster read',
  'src/domain/display/visibilityAudit.js': 'display/audit — covert-dossier impairment read',
});

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

/** @returns {Array<{ rel: string, compliant: boolean }>} every src/domain file that reads `.institutions`. */
function discoverReaders() {
  const readers = [];
  for (const abs of walk(DOMAIN)) {
    const rel = relative(ROOT, abs).split(/[\\/]/).join('/');
    const src = readFileSync(abs, 'utf8');
    if (READER_RE.test(src)) readers.push({ rel, compliant: COMPLIANT_RE.test(src) });
  }
  return readers;
}

describe('ruin-filter roster ratchet (structural-prevention Pattern 2)', () => {
  const readers = discoverReaders();

  test('the scan finds roster readers (non-vacuous)', () => {
    expect(readers.length).toBeGreaterThan(40);
  });

  test('every `.institutions` reader is COMPLIANT or EXEMPT', () => {
    const violations = [];
    for (const { rel, compliant } of readers) {
      if (compliant) continue;
      if (rel in RUIN_AGNOSTIC_EXEMPT) continue;
      violations.push(
        `${rel}: reads the raw .institutions roster but neither routes through the ruin filter `
        + `nor is exempted.\n  If it aggregates institutions as LIVE providers, route it through `
        + `liveInstitutions()/isLiveInstitution() (src/domain/institutions/institutionRoster.js).\n`
        + `  If it is ruin-agnostic (display/mutation/name-lookup/existence/…), add it to `
        + `RUIN_AGNOSTIC_EXEMPT in this file with a reason. Never delete the guard to pass.`,
      );
    }
    expect(violations).toEqual([]);
  });

  test('exempt honesty: every exempt entry still reads .institutions and is not already compliant', () => {
    const readerByRel = new Map(readers.map((r) => [r.rel, r]));
    const stale = [];
    for (const rel of Object.keys(RUIN_AGNOSTIC_EXEMPT)) {
      const r = readerByRel.get(rel);
      if (!r) stale.push(`${rel}: no longer reads .institutions (moved/renamed/cleaned) — delete its exempt row`);
      else if (r.compliant) stale.push(`${rel}: now routes through the ruin filter — delete its exempt row (the win is banked)`);
    }
    expect(stale).toEqual([]);
  });
});
