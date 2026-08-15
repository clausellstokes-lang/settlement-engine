/**
 * narrativeParity.test.js — ENFORCER E-G: THE NARRATIVE-PARITY WALKER (bar 20
 * THE STORY capstone + bar 2 COHESION; spec docs/THE_APLUS_EXECUTION_ARCHITECTURE.md §E-G).
 *
 * C5's story census (scripts/audit/story-census.mjs) proves the SAME seed narrates
 * identically across RUNS. This walker proves the complementary axis: the same
 * seeded decade narrates ONE story across every reader SURFACE. It composes one
 * everything-on decade (the emergentArcSoak fixture, provenance recorder lit
 * test-locally) and reads it through the four narrative projections:
 *
 *   LETTER     composeChroniclersLetter        substrate: wizardNews feed (capped 240)
 *   BOOK       collectWorldBook (dm face)      substrate: wizardNews feed
 *   CHRONICLE  chronicleHistory                substrate: worldState.pulseHistory (ring 80)
 *   CAUSE-WALK buildCauseWalk                  substrate: provenance ledger + pulseHistory
 *
 * THE ONE SUBSTRATE, captured honestly: during the drive, every feed entry version
 * ever minted is recorded per-tick into an EVER-SEEN ledger (id → distinct versions)
 * — so containment claims are exact, not window-fudged (the feed's capEntries
 * evicts by recency + major-arc rescue; pulseHistory rings at MAX_HISTORY=80).
 *
 * ── THE THREE PARITY ASSERTIONS ───────────────────────────────────────────────
 * (a) BEAT-SET PARITY — no surface names a beat the others don't, modulo the
 *     documented scope allowlist below: letter↔book exact (multiset, repeats
 *     expanded); every chronicle impact-digest beat ∈ everSeen (0 orphans); the
 *     final feed ⊆ everSeen; feed→digest coverage inside the chronicle window
 *     holds a measured floor (never equality — see E-3).
 * (b) CLAIMS-PARITY applied to NARRATIVE (no embellishment) — every letter line,
 *     book row, chronicle event/thread/headline, and cause-walk hop traces
 *     byte-for-byte to its recorded substrate or to an exported honest-fallback
 *     constant. A surface asserting a beat with no backing recorded event REDS.
 * (c) DIRECTION AGREEMENT — every beat shared by id across the two substrates
 *     (digest↔feed, letter↔digest, hop↔chronicle event) renders byte-identical
 *     headline+summary+significance, so no surface can say "won" where another
 *     says "lost". Prose equality is the strongest form of outcome agreement.
 *
 * ── EXPECTED-DIVERGENCE ALLOWLIST (documented reasons, not silent passes) ─────
 * E-1 LETTER COALESCE: the letter collapses verbatim-duplicate lines within a
 *     section into one line with a `repeats` tally (chroniclersLetter.js
 *     coalesceLines); reconciliation = multiset expansion by repeats. The kept
 *     line carries the first-sorted twin's id/tick; the twins' ticks are folded.
 * E-2 WINDOWS: pulseHistory holds the last MAX_HISTORY=80 advances of the
 *     120-tick decade; the feed holds 240 entries under recency+rescue
 *     (wizardNews.js capEntries). Cross-substrate parity therefore runs through
 *     the everSeen minted ledger (exact), never through window intersection.
 * E-3 DIGEST CAP: impactDigest is the top-18-by-score compaction of the APPLY
 *     step's news (pulseKernel.js `impactDigest: compactImpactDigest(applied.newsEntries)`),
 *     and post-record kernels (realm arcs, infowar, army transit, naval,
 *     pestilence, calamity, generosity, tempo …) mint feed entries AFTER the
 *     record is cut at pulseKernel.js `const pulseRecord = {`. So
 *     feed→digest containment is a measured coverage floor, not equality.
 * E-4 DEPTH: selectedOutcomes ('outcome' chronicle nodes) are the chronicle's
 *     deeper altitude with no per-id feed counterpart by design; they are outside
 *     feed beat-parity but fully inside claims-parity (prose traces to the record).
 * E-5 SECRETS: the cause-walk redacts covert content for non-DM viewers by
 *     design; parity walks run the DM face. The redaction contract is pinned on a
 *     synthetic covert fixture (never invented into the seeded decade).
 * E-6 ARC RE-EMISSION: a long-lived arc entry may re-mint under its id with
 *     evolved prose (appendWizardNewsEntries merges by id); each surface must
 *     match SOME recorded version of that beat — the letter/book render the
 *     LATEST, an old advance's digest legitimately holds the version of its tick.
 *
 * MEASURED on seed 'narrative-parity-seed' @ 10y (120 one_month ticks) × 8
 * settlements (2026-07-21 landing run): everSeen 3,322 minted beats (0
 * multi-version — E-6 never fired on this fixture; the allowance stays because
 * appendWizardNewsEntries merges by id) · final feed 240 (at cap; eviction shed
 * ~3,082 beats over the decade) · letter 129 lines → 240 expanded beats · book
 * 240 rows · digest beats 1,437 (1,437 distinct ids, 0 orphans vs everSeen) ·
 * chronicle 80 advances (the ring cap) / 2,515 events (1,920 outcome-kind) ·
 * cause-walk 2,150 roots, all hop-bearing, 1,150 resolved hops + 1,000 honest
 * not-in-history fallbacks, 0 unbacked, 0 dark · feed→digest window coverage
 * 167/240 (69.6%) · shared digest∩feed ids 167 · letter∩digest ids 93 · realm
 * majors 10, all feed-backed (canonizedAt lit in the fixture, engine-neutral —
 * verified: every other count byte-identical with and without it).
 * Floors below are pinned WELL UNDER measurement (the census floor philosophy):
 * a regression floor, not a brittle exact match.
 *
 * Zero product-code change; the walker only reads shipped read-models.
 */
import { describe, expect, test } from 'vitest';
import { createHash } from 'node:crypto';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { composeChroniclersLetter } from '../../src/domain/display/chroniclersLetter.js';
import { chronicleHistory, QUIET_FALLBACK } from '../../src/domain/display/chronicleReadModel.js';
import { nodesFromRecord } from '../../src/domain/display/chronicleGraph.js';
import {
  buildCauseWalk, NO_DEEPER_MEMORY, LEDGER_DARK_LINE, REDACTED_HOP,
} from '../../src/domain/display/causeWalk.js';
import { collectWorldBook } from '../../src/utils/generateWorldBook.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const YEARS = 10;                  // the seeded DECADE the spec names
const TICKS = YEARS * 12;          // one_month ticks
const SEED = 'narrative-parity-seed';

/** causeWalk.js resolveReceipt's honest not-in-history fallback (a literal there,
 *  deliberately unexported — pinned here so an embellished fallback REDS). */
const EARLIER_CAUSE_FALLBACK = 'an earlier cause';
/** nodesFromRecord's absent-headline fallbacks (chronicleGraph.js). */
const NODE_FALLBACKS = Object.freeze(['World pulse outcome', 'World pulse impact']);
/** deputysDiary's absent-headline fallback (chronicleReadModel.js). */
const VERDICT_FALLBACK = 'A ruling in your absence';
/** buildThread's all-quiet title fallback (chronicleReadModel.js). */
const QUIET_THREAD_TITLE = 'A quiet thread';

// The everything-on ceiling, verbatim, plus the RECORDER lit test-locally (the
// provenanceDormancyGolden idiom — no shipped default changes).
const RULES = Object.freeze({
  ...SIMULATION_RULE_PRESETS.full_simulation.rules,
  provenanceLedgerEnabled: true,
});

const deity = (/** @type {string} */ ref, /** @type {string} */ name, /** @type {string} */ align, /** @type {string} */ law, /** @type {string} */ rank) =>
  ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = {
  lg: deity('custom:as_dawn', 'Dawnfather', 'good', 'lawful', 'major'),
  ce: deity('custom:as_maw', 'The Maw', 'evil', 'chaotic', 'major'),
};

function spatialDigest() {
  const pack = makeGridPack({ cols: 10, rows: 8 });
  const placed = placeSettlements(pack, IDS.length);
  const placements = placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

/** @param {string} name @param {{ _deityRef: string }} patron @param {{ exports?: string[], imports?: string[], patch?: Record<string, unknown> }} [opts] */
function st(name, patron, { exports = [], imports = [], patch = {} } = {}) {
  return {
    name, tier: 'town', population: 1800,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
    },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 26, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 68 },
        { faction: 'Temple Wardens', category: 'religious', power: 57 },
        { faction: 'City Guard', category: 'military', power: 50 },
      ],
      conflicts: [],
    },
    npcs: [
      { id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key', category: 'civic', personality: { dominant: 'stern' } },
      { id: `factor_${name}`, name: `Factor ${name}`, importance: 'key', category: 'economy', personality: { dominant: 'bold' } },
      { id: `deacon_${name}`, name: `Deacon ${name}`, importance: 'notable', category: 'religious', personality: { dominant: 'devout' } },
    ],
    activeConditions: [],
    ...patch,
  };
}
const save = (/** @type {string} */ id, /** @type {string} */ name, /** @type {{ _deityRef: string }} */ patron, /** @type {Parameters<typeof st>[2]} */ opts) =>
  ({ id, name, phase: 'canon', settlement: st(name, patron, opts), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const ch = (/** @type {string} */ to) =>
  ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' });

function makeSaves() {
  return IDS.map((id, i) => (i === 0
    ? save(id, 'Ashford', D.lg, { exports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.85 }] } })
    : save(id, `S${id.toUpperCase()}`, i % 2 ? D.ce : D.lg, { imports: [GRAIN], ...(i < 3 ? { patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.78 }] } } : {}) })));
}

/** @param {string} seed */
function makeCampaign(seed) {
  return {
    id: 'narrative-parity', name: 'Narrative Parity', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, calendar: { elapsedWeeks: 4 },
      // canonizedAt lights the book's State-of-the-Realm chapter (collectRealmSummary
      // gates on it); the ENGINE never branches on it (spatial gating keys on
      // spatialCanonVersion — worldState.js) so the drive stays sim-neutral.
      canonizedAt: NOW,
      simulationRules: { ...RULES },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.92, affectedSettlementIds: ['a'], age: 3 },
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 2 },
        { id: 'world_stressor.disease_outbreak.c', type: 'disease_outbreak', severity: 0.74, affectedSettlementIds: ['c'], age: 1 },
      ],
      spatialCanonVersion: 1,
      spatialDigest: spatialDigest(),
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        ...IDS.slice(1).map((to) => ({ id: `e.a.${to}`, from: 'a', to, relationshipType: 'trade_partner' })),
        { id: 'e.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        { id: 'e.c.d', from: 'c', to: 'd', relationshipType: 'hostile' },
        { id: 'e.e.f', from: 'e', to: 'f', relationshipType: 'rival' },
        { id: 'e.a.h', from: 'a', to: 'h', relationshipType: 'ally' },
      ],
      channels: IDS.slice(1).map(ch),
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

/** One recorded version of a feed beat (the fields every surface projects). */
/** @typedef {{ tick: number, headline: string, summary: string, significance: string }} BeatVersion */

/** @param {unknown} e @returns {BeatVersion} */
function versionOf(e) {
  const r = e && typeof e === 'object' ? /** @type {Record<string, unknown>} */ (e) : {};
  return {
    tick: Number.isFinite(r.tick) ? Number(r.tick) : 0,
    headline: String(r.headline ?? ''),
    summary: String(r.summary ?? ''),
    significance: String(r.significance ?? ''),
  };
}
/** @param {BeatVersion} a @param {BeatVersion} b */
const sameVersion = (a, b) => a.tick === b.tick && a.headline === b.headline && a.summary === b.summary && a.significance === b.significance;

/**
 * Drive TICKS one_month pulses (the arc-soak idiom), capturing the EVER-SEEN
 * minted ledger: every feed entry id with every distinct version it ever carried
 * (E-6: appendWizardNewsEntries merges by id, so an arc may evolve its prose).
 * @param {string} seed
 */
function drive(seed) {
  let campaign = makeCampaign(seed);
  let saves = makeSaves();
  /** @type {Map<string, BeatVersion[]>} */
  const everSeen = new Map();
  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews || campaign.wizardNews };
    for (const e of campaign.wizardNews?.entries || []) {
      const id = String(/** @type {{ id?: unknown }} */ (e)?.id ?? '');
      if (!id) continue;
      const v = versionOf(e);
      const versions = everSeen.get(id);
      if (!versions) everSeen.set(id, [v]);
      else if (!versions.some((known) => sameVersion(known, v))) versions.push(v);
    }
  }
  return { campaign, saves, everSeen };
}

/** @param {unknown} value @returns {string} */
const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
/** Codepoint-stable compare. */
const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);
/** A multiset as a sorted key → count record. @param {string[]} keys */
function multiset(keys) {
  /** @type {Record<string, number>} */
  const m = {};
  for (const k of [...keys].sort(byStr)) m[k] = (m[k] || 0) + 1;
  return m;
}
const SEP = '␟';

/**
 * Compose every reader surface off one drive and measure all parity facts.
 * Pure over the drive result; the determinism test hashes this whole projection.
 * @param {ReturnType<typeof drive>} run
 */
function composeAndMeasure(run) {
  const { campaign, saves, everSeen } = run;
  const worldState = campaign.worldState;
  const feedEntries = (campaign.wizardNews?.entries || []).filter((e) => e && typeof e === 'object');
  /** @type {Map<string, BeatVersion>} */
  const feedById = new Map(feedEntries.map((e) => [String(/** @type {{ id?: unknown }} */ (e).id ?? ''), versionOf(e)]));

  // ── the four surfaces ──────────────────────────────────────────────────────
  const letter = composeChroniclersLetter({ wizardNews: campaign.wizardNews, lastReadTick: 0 });
  const book = collectWorldBook(campaign, saves, { mode: 'dm' });
  const chronicles = chronicleHistory(worldState).filter((c) => c != null);

  // ── substrate atoms ────────────────────────────────────────────────────────
  const history = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  /** Every persisted pulseHistory node's prose (the cause-walk / chronicle truth set). */
  const pulseProse = new Set();
  const pulseHeadlines = new Set();
  /** @type {Map<string, string>} nodeId → headline (first occurrence, the receipt-index rule) */
  const nodeHeadlineById = new Map();
  /** @type {Array<{ id: string, recordTick: number, v: BeatVersion }>} */
  const digestBeats = [];
  let outcomeNodeCount = 0;
  for (const record of history) {
    const recordTick = Number.isFinite(/** @type {{ tick?: unknown }} */ (record)?.tick) ? Number(/** @type {{ tick?: unknown }} */ (record).tick) : 0;
    for (const node of nodesFromRecord(/** @type {import('../../src/domain/display/chronicleGraph.js').PulseRecord} */ (record))) {
      pulseProse.add(`${node.headline}${SEP}${node.summary}`);
      pulseHeadlines.add(node.headline);
      if (!nodeHeadlineById.has(node.nodeId)) nodeHeadlineById.set(node.nodeId, node.headline);
      if (node.kind === 'outcome') outcomeNodeCount += 1;
    }
    const digest = Array.isArray(/** @type {{ impactDigest?: unknown }} */ (record)?.impactDigest) ? /** @type {{ impactDigest: unknown[] }} */ (record).impactDigest : [];
    for (const e of digest) {
      const id = String(/** @type {{ id?: unknown }} */ (e)?.id ?? '');
      if (id) digestBeats.push({ id, recordTick, v: versionOf(e) });
    }
  }

  // ── cause-walks (DM face) over every recorded root ─────────────────────────
  const ledger = worldState?.spatialLedgers?.provenance && typeof worldState.spatialLedgers.provenance === 'object'
    ? worldState.spatialLedgers.provenance : {};
  const roots = Object.keys(ledger).sort(byStr);
  let walksWithHops = 0;
  let resolvedHops = 0;
  let fallbackHops = 0;
  let darkWalks = 0;
  /** @type {string[]} hop claims-parity violations (headline backed by nothing) */
  const unbackedHops = [];
  /** @type {string[]} hop↔chronicle direction disagreements */
  const hopContradictions = [];
  /** @type {string[]} the determinism projection of every walk */
  const walkProjection = [];
  for (const rootId of roots) {
    const walk = buildCauseWalk({ worldState, rootId, seesSecrets: true });
    if (walk.ledgerDark) darkWalks += 1;
    if (walk.chain.length > 0) walksWithHops += 1;
    for (const hop of walk.chain) {
      walkProjection.push(`${rootId}${SEP}${hop.depth}${SEP}${hop.id}${SEP}${hop.headline}`);
      if (hop.headline === EARLIER_CAUSE_FALLBACK || hop.headline === REDACTED_HOP) { fallbackHops += 1; continue; }
      resolvedHops += 1;
      // (b) claims-parity: a resolved hop's prose must exist in the durable record.
      if (!pulseHeadlines.has(hop.headline)) unbackedHops.push(`${rootId} <- ${hop.id}: ${hop.headline}`);
      // (c) direction agreement: the hop and the chronicle resolve the same
      // receipt id to the same headline (one truth, two projections).
      const chronHeadline = nodeHeadlineById.get(hop.id);
      if (chronHeadline != null && chronHeadline !== hop.headline) {
        hopContradictions.push(`${hop.id}: walk "${hop.headline}" vs chronicle "${chronHeadline}"`);
      }
    }
    // Grace lines come only from the exported honest constants.
    if (walk.graceLine !== '' && walk.graceLine !== NO_DEEPER_MEMORY && walk.graceLine !== LEDGER_DARK_LINE) {
      unbackedHops.push(`${rootId}: invented grace line "${walk.graceLine}"`);
    }
  }

  // ── (a) beat sets ──────────────────────────────────────────────────────────
  /** Letter beats, expanded by repeats (E-1), keyed on headline+summary. */
  const letterLines = letter.sections.flatMap((s) => s.lines);
  /** @type {string[]} */
  const letterBeatKeys = [];
  for (const l of letterLines) {
    for (let i = 0; i < (l.repeats || 1); i++) letterBeatKeys.push(`${l.headline}${SEP}${l.summary}`);
  }
  const bookRows = Array.isArray(book.chronicle) ? book.chronicle : [];
  const bookBeatKeys = bookRows.map((r) => `${r.headline}${SEP}${r.summary}`);

  // Chronicle digest beats vs the everSeen minted ledger (E-2/E-6): every digest
  // beat must be a version the feed was actually told, matched at its own tick.
  /** @type {string[]} */
  const digestOrphans = [];
  const sharedIdAgreements = { checked: 0, mismatched: /** @type {string[]} */ ([]) };
  for (const beat of digestBeats) {
    const versions = everSeen.get(beat.id);
    if (!versions || !versions.some((v) => v.headline === beat.v.headline && v.summary === beat.v.summary && v.significance === beat.v.significance)) {
      digestOrphans.push(`${beat.id} @advance ${beat.recordTick}: ${beat.v.headline}`);
    }
    // (c) digest↔feed direction agreement on beats surviving in the final feed.
    const live = feedById.get(beat.id);
    if (live) {
      sharedIdAgreements.checked += 1;
      const agreed = everSeen.get(beat.id) != null
        && (live.headline === beat.v.headline ? true : (versions || []).some((v) => v.headline === live.headline))
        && (live.summary === beat.v.summary ? true : (versions || []).some((v) => v.summary === live.summary));
      if (!agreed) sharedIdAgreements.mismatched.push(beat.id);
    }
  }

  // Final feed ⊆ everSeen (eviction only removes; it never rewrites).
  /** @type {string[]} */
  const feedOrphans = [];
  for (const [id, v] of feedById) {
    const versions = everSeen.get(id);
    if (!versions || !versions.some((known) => sameVersion(known, v))) feedOrphans.push(id);
  }

  // Feed→digest coverage inside the chronicle window (E-3: floor, not equality).
  const advanceTicks = new Set(history.map((r) => Number(/** @type {{ tick?: unknown }} */ (r)?.tick) || 0));
  const digestIds = new Set(digestBeats.map((b) => b.id));
  let windowFeedBeats = 0;
  let windowFeedBeatsInDigest = 0;
  for (const [id, v] of feedById) {
    if (!advanceTicks.has(v.tick)) continue;
    windowFeedBeats += 1;
    if (digestIds.has(id)) windowFeedBeatsInDigest += 1;
  }

  // ── (b) claims-parity per surface ──────────────────────────────────────────
  /** @type {string[]} */
  const letterViolations = [];
  for (const l of letterLines) {
    const src = feedById.get(l.id);
    if (!src) { letterViolations.push(`line ${l.id} has no feed entry`); continue; }
    if (src.headline !== l.headline || src.summary !== l.summary || src.tick !== l.tick || src.significance !== l.significance) {
      letterViolations.push(`line ${l.id} embellishes: "${l.headline}" vs feed "${src.headline}"`);
    }
    if (l.recalls && ![...feedById.values()].some((v) => v.headline === l.recalls?.headline)) {
      letterViolations.push(`line ${l.id} recalls an unrecorded beat: "${l.recalls.headline}"`);
    }
  }

  /** @type {string[]} */
  const bookViolations = [];
  const feedRowKeys = multiset([...feedById.values()].map((v) => `${v.tick}${SEP}${v.headline}${SEP}${v.summary}${SEP}${v.significance}`));
  const bookRowKeys = multiset(bookRows.map((r) => `${r.tick}${SEP}${r.headline}${SEP}${r.summary}${SEP}${r.significance}`));
  if (hashOf(bookRowKeys) !== hashOf(feedRowKeys)) bookViolations.push('book chronicle rows are not the feed verbatim');
  const feedHeadlineSet = new Set([...feedById.values()].map((v) => v.headline));
  const realmMajors = Array.isArray(book.realm?.majors) ? book.realm.majors : [];
  for (const m of realmMajors) {
    if (!feedHeadlineSet.has(String(m))) bookViolations.push(`realm major unbacked: "${String(m)}"`);
  }

  /** @type {string[]} */
  const chronicleViolations = [];
  const quietPool = new Set(Object.values(QUIET_FALLBACK).flat());
  for (const c of chronicles) {
    const eventProse = new Set(c.events.map((e) => `${e.headline}${SEP}${e.summary}`));
    for (const key of eventProse) {
      if (!pulseProse.has(key)) chronicleViolations.push(`advance ${c.tick} event embellishes: ${key.split(SEP)[0]}`);
    }
    const eventHeadlines = new Set(c.events.map((e) => e.headline));
    for (const t of c.threads) {
      const beatHeadlines = new Set(t.beats.map((b) => b.headline));
      if (t.title !== QUIET_THREAD_TITLE && !beatHeadlines.has(t.title)) {
        chronicleViolations.push(`advance ${c.tick} thread title embellishes: "${t.title}"`);
      }
      for (const arcLine of [t.arc.began, t.arc.turned, t.arc.stands]) {
        if (arcLine !== '' && !beatHeadlines.has(arcLine)) {
          chronicleViolations.push(`advance ${c.tick} thread arc embellishes: "${arcLine}"`);
        }
      }
    }
    for (const v of c.deputyDiary.verdicts) {
      if (v.headline !== VERDICT_FALLBACK && !eventHeadlines.has(v.headline)) {
        chronicleViolations.push(`advance ${c.tick} verdict embellishes: "${v.headline}"`);
      }
    }
    const framed = ['week', 'month', 'season', 'year'].some((span) => {
      const frame = `The ${span}: `;
      return c.headline.startsWith(frame) && c.threads.some((t) => t.title === c.headline.slice(frame.length));
    });
    if (!framed && !quietPool.has(c.headline)) {
      chronicleViolations.push(`advance ${c.tick} headline embellishes: "${c.headline}"`);
    }
    for (const e of c.events) {
      if (NODE_FALLBACKS.includes(e.headline) && e.receipt?.headline) {
        chronicleViolations.push(`advance ${c.tick} dropped a persisted headline for the fallback`);
      }
    }
  }

  // (c) letter↔digest direct: a letter line whose id the chronicle substrate also
  // holds must read the same story (some recorded version matches byte-for-byte).
  /** @type {string[]} */
  const letterDigestContradictions = [];
  /** @type {Map<string, Array<BeatVersion>>} */
  const digestById = new Map();
  for (const b of digestBeats) {
    const arr = digestById.get(b.id) || [];
    arr.push(b.v);
    digestById.set(b.id, arr);
  }
  let letterDigestShared = 0;
  for (const l of letterLines) {
    const dv = digestById.get(l.id);
    if (!dv) continue;
    letterDigestShared += 1;
    const agreed = dv.some((v) => v.headline === l.headline && v.summary === l.summary)
      || (everSeen.get(l.id) || []).some((v) => v.headline === l.headline && v.summary === l.summary);
    if (!agreed) letterDigestContradictions.push(`${l.id}: letter "${l.headline}"`);
  }

  return {
    counts: {
      everSeenIds: everSeen.size,
      everSeenVersions: [...everSeen.values()].reduce((n, v) => n + v.length, 0),
      multiVersionIds: [...everSeen.values()].filter((v) => v.length > 1).length,
      feed: feedById.size,
      letterLines: letterLines.length,
      letterBeats: letterBeatKeys.length,
      letterTotal: letter.counts.total,
      bookRows: bookRows.length,
      realmMajors: realmMajors.length,
      advances: chronicles.length,
      chronicleEvents: chronicles.reduce((n, c) => n + c.eventCount, 0),
      outcomeNodes: outcomeNodeCount,
      digestBeats: digestBeats.length,
      digestIds: digestIds.size,
      roots: roots.length,
      walksWithHops,
      resolvedHops,
      fallbackHops,
      darkWalks,
      windowFeedBeats,
      windowFeedBeatsInDigest,
      sharedDigestFeedIds: sharedIdAgreements.checked,
      letterDigestShared,
    },
    violations: {
      digestOrphans, feedOrphans, letterViolations, bookViolations,
      chronicleViolations, unbackedHops, hopContradictions,
      sharedIdMismatches: sharedIdAgreements.mismatched,
      letterDigestContradictions,
    },
    beatSets: { letter: multiset(letterBeatKeys), book: multiset(bookBeatKeys) },
    determinismProjection: {
      letterHash: hashOf(letterBeatKeys.sort(byStr)),
      bookHash: hashOf(bookBeatKeys.sort(byStr)),
      digestHash: hashOf(digestBeats.map((b) => `${b.id}${SEP}${b.recordTick}${SEP}${b.v.headline}`).sort(byStr)),
      walkHash: hashOf(walkProjection.sort(byStr)),
      everSeenHash: hashOf([...everSeen.keys()].sort(byStr)),
    },
  };
}

// ── The walk (one drive shared by the assertions; a second for determinism) ────
const run = drive(SEED);
const parity = composeAndMeasure(run);

describe(`THE NARRATIVE-PARITY WALKER — one ${YEARS}y decade, one story, every reader surface`, () => {
  test('diagnostics (printed so the architect can re-check the measured band)', () => {
    console.log('[narrative-parity] %o', parity.counts);
    for (const [k, list] of Object.entries(parity.violations)) {
      if (list.length) console.log('[narrative-parity] %s (%d): %o', k, list.length, list.slice(0, 5));
    }
    expect(true).toBe(true);
  }, 240_000);

  test('anti-vacuity: the decade produced a rich story on every surface (measured: feed 240, letter 240 beats, 80 advances, 2150 hop-bearing walks)', () => {
    expect(parity.counts.feed).toBeGreaterThanOrEqual(150);
    expect(parity.counts.letterBeats).toBeGreaterThanOrEqual(150);
    expect(parity.counts.bookRows).toBeGreaterThanOrEqual(150);
    expect(parity.counts.advances).toBeGreaterThanOrEqual(60);
    expect(parity.counts.chronicleEvents).toBeGreaterThanOrEqual(800);
    expect(parity.counts.digestBeats).toBeGreaterThanOrEqual(500);
    expect(parity.counts.walksWithHops).toBeGreaterThanOrEqual(700);
    expect(parity.counts.resolvedHops).toBeGreaterThanOrEqual(400);
    expect(parity.counts.darkWalks).toBe(0);
  }, 240_000);

  test('(a) BEAT-SET PARITY: letter and book narrate the same beat multiset (E-1 repeats expanded), and the letter accounts for every book row', () => {
    expect(parity.beatSets.letter).toEqual(parity.beatSets.book);
    expect(parity.counts.letterTotal).toBe(parity.counts.bookRows);
  }, 240_000);

  test('(a) BEAT-SET PARITY: the chronicle names no beat the feed was never told (0 digest orphans vs the everSeen minted ledger), and the surviving feed is minted truth (0 feed orphans)', () => {
    expect(parity.violations.digestOrphans).toEqual([]);
    expect(parity.violations.feedOrphans).toEqual([]);
  }, 240_000);

  test('(a) BEAT-SET PARITY: feed→digest coverage inside the chronicle window holds its floor (E-3: top-18 digest + post-record kernels ⇒ floor, not equality; measured 167/240 = 69.6%)', () => {
    expect(parity.counts.windowFeedBeats).toBeGreaterThanOrEqual(100);
    expect(parity.counts.windowFeedBeatsInDigest / Math.max(1, parity.counts.windowFeedBeats)).toBeGreaterThanOrEqual(0.45);
  }, 240_000);

  test('(b) CLAIMS-PARITY: no surface embellishes beyond the ledgers — letter, book, chronicle, cause-walk all trace to recorded events or exported honest fallbacks', () => {
    expect(parity.violations.letterViolations).toEqual([]);
    expect(parity.violations.bookViolations).toEqual([]);
    expect(parity.violations.chronicleViolations).toEqual([]);
    expect(parity.violations.unbackedHops).toEqual([]);
  }, 240_000);

  test('(c) DIRECTION AGREEMENT: shared beats read byte-identically across substrates (digest↔feed, letter↔digest, hop↔chronicle) — no surface says "won" where another says "lost"', () => {
    // Anti-vacuity: the agreement checks actually covered a real shared corpus
    // (measured 167 digest∩feed ids, 93 letter∩digest ids).
    expect(parity.counts.sharedDigestFeedIds).toBeGreaterThanOrEqual(60);
    expect(parity.counts.letterDigestShared).toBeGreaterThanOrEqual(30);
    expect(parity.violations.sharedIdMismatches).toEqual([]);
    expect(parity.violations.letterDigestContradictions).toEqual([]);
    expect(parity.violations.hopContradictions).toEqual([]);
  }, 240_000);

  test('(E-5) SECRETS: the cause-walk redacts covert content for a non-DM viewer — synthetic covert fixture, never invented into the decade', () => {
    const covertReceipt = { id: 'covert.cause.1', headline: 'The vizier bought the assize', summary: 'Covert coin moved.', covert: true };
    const openReceipt = { id: 'open.effect.1', headline: 'The assize ruled strangely', summary: '' };
    const syntheticWorld = {
      pulseHistory: [{ tick: 4, selectedOutcomes: [covertReceipt, openReceipt], impactDigest: [] }],
      spatialLedgers: { provenance: { 'open.effect.1': { parents: ['covert.cause.1'], type: 'assize_verdict', tick: 4 } } },
    };
    const dmWalk = buildCauseWalk({ worldState: syntheticWorld, rootId: 'open.effect.1', seesSecrets: true });
    expect(dmWalk.chain.map((h) => h.headline)).toEqual(['The vizier bought the assize']);
    const playerWalk = buildCauseWalk({ worldState: syntheticWorld, rootId: 'open.effect.1', seesSecrets: false });
    expect(playerWalk.chain.map((h) => h.headline)).toEqual([REDACTED_HOP]);
    expect(playerWalk.chain[0].settlementIds).toEqual([]);
    const gatedWalk = buildCauseWalk({ worldState: syntheticWorld, rootId: 'covert.cause.1', seesSecrets: false });
    expect(gatedWalk.gated).toBe(true);
    expect(gatedWalk.root?.headline).toBe(REDACTED_HOP);
  });

  test('DETERMINISM: an identical seeded decade yields the identical cross-surface parity result', () => {
    const again = composeAndMeasure(drive(SEED));
    expect(hashOf(again.determinismProjection)).toBe(hashOf(parity.determinismProjection));
    expect(again.counts).toEqual(parity.counts);
  }, 240_000);
});
