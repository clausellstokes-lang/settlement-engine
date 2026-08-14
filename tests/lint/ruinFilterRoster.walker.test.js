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
 * ⛔⛔ THE TWO SCANS ASK DIFFERENT QUESTIONS AND THEREFORE READ DIFFERENT SOURCES.
 * This asymmetry is deliberate, it is the whole subject of OQ §38.3's non-code-token
 * class, and it is declared here so no later reader discovers it by reddening:
 *   - READER_RE asks "does this file EXECUTE a roster read?" — so it scans
 *     `codeOnly(src)`, which blanks comments AND string/template contents while
 *     preserving every byte offset. A `.institutions` spelled only in a comment or
 *     inside a quoted data-table path is not an execution and must not enrol.
 *   - COMPLIANT_RE asks "does this file IMPORT the accessor (or carry a local ruin
 *     guard)?" — so it stays on RAW bytes, and routing it through codeOnly would be a
 *     DEFECT rather than a symmetry. MEASURED at this file's base: for the large
 *     majority of the enrolled readers whose verdict would flip, the ONLY compliance
 *     evidence is the import specifier `from '…/institutionRoster.js'`, which is a
 *     STRING — the same blanker that cures the first misfire erases the second's
 *     evidence. The figures live in the member packet that measured them, never here.
 * ⇒ A mixed scan is the correct shape for a walker that asks both questions.
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
 *     (no word boundary before the trailing token). ⭐ CURED 2026-08-14, and the bullet
 *     is rewritten rather than deleted so the shrink stays legible in the file that owns
 *     it: this scan USED TO match config-path string literals like
 *     'headcounts.institutions', which were then frozen as exempt where they occurred.
 *     Routing discovery through codeOnly() excludes every comment and string-literal
 *     spelling, so those files stop being readers at all. Exactly two rows left the
 *     inventories with that cure — parityContract.js (exempt) and couplingRegistryWar.js
 *     (quarantine) — and both are noted at their former sites below.
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

import { codeOnly } from './engineGatedRuleKeys.walker.test.js';

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
  'src/domain/worldPulse/supplyKernel.js': 'name-lookup + mutation — resolves one consuming institution; stamps impairments',
  // THE DECOMPOSITION WAVE (war tranche, file 4) moved applyFactionPayloadEffect — the one
  // `.institutions` reader the apply pass owned — verbatim out of applyWorldPulse.js into
  // this leaf. Same read, same exemption; only the address changed.
  'src/domain/worldPulse/applyWorldPulseFactionRoster.js': 'name-lookup + mutation — finds one named institution to impair',
  'src/domain/dailyLife.js': 'name-lookup/display — first temple/market/inn for gathering-place flavour',
  'src/domain/npcProfile.js': 'name-lookup/display — NPC→institution links + category/power name lists',
  'src/domain/explanation.js': 'name-lookup/display — single-institution explain + entity catalog',
  'src/domain/dossier/entityLinks.js': 'name-lookup — name→id resolution + link-index build',
  'src/domain/entities/propagate.js': 'name-lookup + mutation — impairment propagation graph',
  'src/domain/regenerationMode.js': 'name-lookup — single institution by id for canon-tag preservation',
  'src/domain/districtProfile.js': 'display/list — name-overlap match to a quarter',
  // ── lock-map id-set: RETIRED 2026-08-11, THE READ ITSELF IS GONE ────────────────
  // locksPreservation.js used to hold the estate's one LOCK-KEY-sense reader of this
  // word — an id-set off the USER LOCK MAP rather than off any settlement roster, and
  // exempted here because a lock must OUTLIVE its subject being ruined. The owner
  // ruled that lock dead (no UI ever offered it, so it had no writer; and nothing
  // consumed the normalized field, so it had no reader either) and it was deleted, so
  // the file no longer matches this walker's scan at all. Its exempt row is deleted
  // with it — the honesty arm below REQUIRES that, and it is the arm that told us so:
  // "no longer reads .institutions (moved/renamed/cleaned) — delete its exempt row".
  // ⚠ Do NOT re-add the row "just in case": an exempt entry for a non-reader is
  // exactly the stale state that arm exists to forbid.
  // ── facet-scalar: reads a precomputed number, not the roster ─────────────────────
  'src/domain/worldPulse/attrition.js': 'facet-scalar — reads precomputed facets.institutions, not the roster',
  'src/domain/worldPulse/warDeployment.js': 'facet-scalar — reads precomputed facets.institutions (commandQuality)',
  // W-K3 THE DISASTER BUFFER, model half. The single `.institutions` the regex finds is
  // `loss?.institutions` inside convertStrike — the StrikeLoss COUNT of how many buildings
  // one calamity strike would fell ("@property {number} institutions"), not a roster. The
  // file's own header states the invariant the exemption rests on: "it never sees a
  // settlement, a roster, a world, or a name." Routing it through liveInstitutions() is not
  // merely unnecessary, it is impossible — there is no row here to filter, only an integer.
  // The rows behind that integer were already chosen by the calamity producer
  // (selectStrikeTargets, spatial/calamity.js) and arrive as a name list through
  // magicBufferApply.resolveDisasterRelief, so target liveness is that producer's question
  // and is asked before this arithmetic ever runs. Credits nothing: the number is divided
  // by a mitigation fraction to decide how much damage CONVERTS, and a strike that felled
  // nothing prices at zero relief either way.
  'src/domain/worldPulse/magicBufferModel.js': 'loss-count scalar — `loss.institutions` is the StrikeLoss COUNT of buildings one calamity would fell (an integer supplied by the calamity producer via magicBufferApply), never a settlement roster; the leaf is pure arithmetic that sees no settlement, roster, world or name, so there is no row to ruin-filter and no provider capacity is credited',
  // ── penalty-side: counts impaired/criminal for a PENALTY, not live crediting ─────
  'src/domain/corruption.js': 'penalty-side — criminal/corruption-impairment classifier (drag, not credit)',
  'src/domain/state/deriveSystemState.js': 'penalty-side — countByStatus impaired/critical risk penalty (status-aware)',
  // ── mutation / write / undo: rewrites the roster ─────────────────────────────────
  'src/domain/factionRename.js': 'mutation — a faction rename rewrites `institutions[].factionSource`, the exact-name marker recording WHICH faction raised an institution. A ruined institution keeps that provenance, so filtering the roster here would strand the ruin under the old faction name and split the join the rename exists to hold together. Credits nothing.',
  'src/domain/worldPulse/blockadeTransport.js': 'mutation — stamps airship impairments across the roster',
  'src/domain/events/mutateEntities.js': 'mutation — entity edit application',
  'src/domain/events/mutateHelpers.js': 'mutation — roster edit helpers',
  'src/domain/events/mutateWorld.js': 'mutation — event-effect application over the roster',
  'src/domain/events/undoEvent.js': 'undo — reverts created institutions',
  'src/domain/events/batch.js': 'name-set — indexes institution ids/names for batch ops',
  'src/domain/events/affordanceManifest.js': 'affordance — enumerates the roster for edit affordances',
  'src/domain/events/targetRosters.js': 'affordance — the Session Ledger half of affordanceManifest\'s target pickers, and deliberately ruin-blind for the SAME reason: these rosters answer "what may a human name for this event", not "what capacity does this settlement have". A ruined institution is a legitimate target (mending one is a real table moment, and RESTORE_INSTITUTION\'s own gate counts destroyed/removed as impairable). Filtering ruins here would also break the composer-parity pins in tests/domain/tableLedger.test.js, which are what stop the two desks from offering different worlds. Credits nothing.',
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
  'src/domain/content/contentSamplePreview.js': 'preview/display — reports which custom institutions materialized in a fresh unsaved sample; it does not credit their functional capacity',
  'src/domain/content/customContentUsage.js': 'provenance/read-model — name evidence must retain ruined historical references instead of treating them as live provider capacity',
  'src/domain/content/settlementContentProvenance.js': 'provenance/audit — stamps immutable identity for every materialized custom institution, including a later-ruined retained row',
  // ── owner-deferred: owner-designed spatial connectivity mechanic ─────────────────
  // spatialDigest feeds buildSeaLanes/buildTeleportEdges (the owner's PORT §4j /
  // TELEPORT §4e/§4f rules). Their explicit siege model is NODE-STARVATION, not
  // edge-severance ("a besieger cannot cut the EDGE, only STARVE the NODE"), so whether
  // a calamity-ruined port/circle should sever connectivity is an OWNER design call,
  // not a mechanical repair. Deferred to owner; NOT fixed in this lane.
  'src/domain/spatial/spatialDigest.js': 'owner-deferred — feeds seaLanes/teleportEdges (owner PORT/TELEPORT rules; siege=node-starvation not edge-severance)',
  // ── status-grader: MUST see non-live rows, and applies its own ruin guard ────────
  // W-K1's institution status system (docs/DESIGN_MAGIC_ECONOMY.md §3c) grades every
  // institution as operational | impaired | shell. A SHELL is an intact-but-unfunded
  // institution, which the estate marks `_worldPulseInactive: true` + status 'remnant'
  // at an economic close, so routing this reader through liveInstitutions() would drop
  // exactly the rows the slow half of the design exists to grade and silently delete
  // the shell verdict. It is not ruin-BLIND either: it carries its own ruin guard
  // (`if (isRuinedInstitution(institution)) continue`), which the file-granular regex
  // cannot see only because the predicate lives in the sibling model leaf
  // institutionStatusModel.js rather than inline. It credits nothing: the verdict it
  // derives reports capacity, never sums it into a provider total.
  'src/domain/worldPulse/institutionStatusLifecycle.js': 'status-grader — grades operational/impaired/shell, so it MUST see the non-live rows liveInstitutions() drops (a shell IS _worldPulseInactive); carries its own isRuinedInstitution guard via institutionStatusModel.js, and credits no provider capacity',
  // ── display: renders the roster (showing a ruin is correct) ──────────────────────
  'src/domain/display/defenseDisplay.js': 'display — defenseProfile.institutions force buckets, not the roster',
  'src/domain/display/institutionProfile.js': 'display — defenseProfile.institutions buckets',
  'src/domain/display/threatAssessment.js': 'display — defenseProfile.institutions buckets',
  'src/domain/display/dossierViewModel.js': 'display — roster count for the dossier overview',
  'src/domain/dossier/powerSupport.js': 'display/list — lists institutions aligned to each power for the Power-tab support web (a relationship/alignment display keyed on category + factionSource, NOT a live-provider capacity aggregate); each row is an InstitutionLink that surfaces the institution\'s actual state, so a ruin is shown, never credited with function',
  // ── canon-path string literal: RETIRED 2026-08-14, THE READ WAS NEVER A READ ────
  // parityContract.js was exempted for `'headcounts.institutions'` at :75 — a
  // canon-path STRING LITERAL inside a data table, never a roster read. Re-pointing
  // discovery through codeOnly() blanks string contents, so the file stops matching
  // this walker's scan at all and its exempt row is deleted with the same cure. The
  // exempt honesty arm below REQUIRES that: "no longer reads .institutions
  // (moved/renamed/cleaned) — delete its exempt row".
  // ⚠ Do NOT re-add the row "just in case" — an exempt entry for a non-reader is
  // exactly the stale state that arm exists to forbid.
  'src/domain/display/visibilityAudit.js': 'display/audit — covert-dossier impairment read',
});

/**
 * ⛔ THE UNDISPOSITIONED QUARANTINE — SHRINK-ONLY, EXACT IDENTITY BOTH DIRECTIONS.
 *
 * These are NOT exemptions and they must never be moved into RUIN_AGNOSTIC_EXEMPT: an
 * exemption asserts "this reader is ruin-agnostic on purpose, here is the reason", and
 * nobody has made that judgement about these five. They are `.institutions` readers that
 * landed WITHOUT being dispositioned at all, and they are named here so the walker can
 * tell the debt it already knows about from a NEW undispositioned reader.
 *
 * WHY THEY ARE HERE RATHER THAN IN THE TEST CENSUS. Until 2026-08-07 the row
 * `tests/lint/ruinFilterRoster.walker.test.js :: every `.institutions` reader is
 * COMPLIANT or EXEMPT` sat in scripts/.test-ratchet-baseline.json. That row is a single
 * assertion over an OPEN, tree-derived population, so tolerating it tolerated the whole
 * population: a SEVENTH undispositioned reader would have produced the byte-identical
 * failing verdict and reddened nothing. A failing TEST is debt; a failing WALKER is a
 * DISABLED GUARD (CONTRIBUTING.md, "The gate"). The census row is gone; the debt is
 * INVENTORIED here, where a new violation reds again.
 *
 * MEASURED, NEVER TRANSCRIBED: this walker's own discoverReaders() run inside an
 * integrity-counted `git archive` of committed af8815e9 (6,196 tracked paths in, 6,196
 * out, `git status` clean) — never over the live shared tree, which holds an owner
 * session's uncommitted work (THE ARCHIVE-CENSUS LAW).
 *
 * TO SHRINK IT (the only permitted direction): route the file through
 * liveInstitutions()/isLiveInstitution(), or decide it is genuinely ruin-agnostic and
 * move it to RUIN_AGNOSTIC_EXEMPT WITH ITS REASON — then delete its row here. The
 * honesty arm below reds if you fix one without banking the win, so a silent shrink is
 * not available either.
 */
const UNDISPOSITIONED_RUIN_READERS = Object.freeze([
  // ── receiptField string: RETIRED 2026-08-14, THE READ WAS NEVER A READ ──────────
  // couplingRegistryWar.js entered this quarantine on ONE line — a `receiptField:`
  // canon path quoted inside a data table at :111. It never read a roster. Re-pointing
  // discovery through codeOnly() blanks string contents, so it stops matching the scan
  // and its quarantine row is deleted with the same cure, exactly as the honesty arm
  // below demands. ⚠ Do NOT re-add it "just in case".
  'src/domain/worldPulse/dispositionNews.js',
  'src/domain/worldPulse/envoyNegotiationPictureBuilder.js',
  'src/domain/worldPulse/razingExecution.js',
  'src/domain/worldPulse/warArmyRecord.js',
  'src/domain/worldPulse/warCosts.js',
]);

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
    // READER_RE reads CODE; COMPLIANT_RE reads RAW. The asymmetry is deliberate and its
    // reason is stated in the header block — do not "fix" it into a symmetry.
    const code = codeOnly(src);
    if (READER_RE.test(code)) readers.push({ rel, compliant: COMPLIANT_RE.test(src) });
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
      if (UNDISPOSITIONED_RUIN_READERS.includes(rel)) continue;
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

  test('⛔ quarantine honesty: the undispositioned list is EXACT — an un-banked shrink reds too', () => {
    // The quarantine is audited in BOTH directions, which is what stops it becoming a
    // second, softer allowlist:
    //   • a row that no longer reads .institutions, or now routes through the ruin
    //     filter, or has since been given a real exemption, is a WIN — and it reds here
    //     until it is banked, because a quarantine that silently keeps stale rows drifts
    //     upward in effect (its ceiling stops meaning anything) exactly like the census
    //     row this list replaced;
    //   • a NEW undispositioned reader never reaches this list at all — it reds in the
    //     COMPLIANT-or-EXEMPT arm above, which is the whole point of moving the debt here.
    const readerByRel = new Map(readers.map((r) => [r.rel, r]));
    const stale = [];
    for (const rel of UNDISPOSITIONED_RUIN_READERS) {
      const r = readerByRel.get(rel);
      if (!r) stale.push(`${rel}: no longer reads .institutions (moved/renamed/cleaned) — delete its quarantine row`);
      else if (r.compliant) stale.push(`${rel}: now routes through the ruin filter — delete its quarantine row (bank the win)`);
      else if (rel in RUIN_AGNOSTIC_EXEMPT) {
        stale.push(`${rel}: now carries a real exemption — delete its quarantine row (a file is one or the other, never both)`);
      }
    }
    expect(stale).toEqual([]);
    // anchored: the exactness assertion above proves the list was walked against the
    // live scan, so the non-emptiness pin below is a floor on a REAL population.
    expect(
      UNDISPOSITIONED_RUIN_READERS.length,
      'the quarantine emptied — if that is real, delete it and this arm together; if it is not, the walker stopped discovering readers',
    ).toBeGreaterThan(0);
  });

  test('the scan reads CODE — a `.institutions` in a comment or a quoted string never enrols', () => {
    // Synthetic half: the blanker's contract, stated on bytes this file owns. Without
    // this half the live half below could pass over a scan that simply broke.
    const prose = codeOnly('// settlement.institutions is discussed here\nconst x = 1;\n');
    const quoted = codeOnly("const t = { receiptField: 'a.institutions.b' };\n");
    expect(READER_RE.test(prose)).toBe(false);
    expect(READER_RE.test(quoted)).toBe(false);
    // Live half: the two real files this cure removed, proved absent from the live scan.
    const rels = readers.map((r) => r.rel);
    // The synthetic half above proves the blanker is what excludes these two, and the exact
    // population leg below proves the scan still discovered the whole corpus, so neither
    // absence can be the vacuous kind where the scan simply found nothing.
    // anchored: paired with the synthetic blanker proof above and the exact count below
    expect(rels).not.toContain('src/domain/certification/couplingRegistryWar.js');
    // anchored: same pairing — blanker proved live above, population proved exact below
    expect(rels).not.toContain('src/domain/display/parityContract.js');
    // …and the scan is still measuring the whole real population. This third leg is not
    // decorative: without it a scan that broke entirely would satisfy both absences above,
    // and a scan reverted to RAW bytes would satisfy neither but for the wrong reason.
    // ⛔ EXACT, and shrink-or-grow both mean re-measure: a new `.institutions` reader in
    // src/domain moves this figure, and the cure is to route it through the accessor or
    // disposition it — never to nudge this number.
    expect(readers.length).toBe(89);
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
