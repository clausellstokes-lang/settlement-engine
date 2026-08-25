/**
 * distributionEnvelopes.test.js — Wave D, Track I: tuning under version control.
 *
 * The semantic fixtures pin ONE settlement's meaning. These envelopes pin the
 * shape of the DISTRIBUTION across a corpus — the emergent tuning that no single
 * fixture can hold: how often an isolated thorp starves, which prosperity bands a
 * tier lands in, how much a settlement repeats its own plot hooks, whether one
 * stress type has quietly become a monoculture.
 *
 * DETERMINISM: every settlement is generated from a fixed seed (`envelope-${i}`),
 * so these envelopes are EXACT, not statistical. A failure means a real constant
 * moved a real number — never a flaky roll. Each test therefore prints its full
 * measured distribution on failure: the diagnostic IS the deliverable.
 *
 * RATCHET-FLOOR PHILOSOPHY: the bounds below were set by MEASURING first, then
 * widening by a generous margin. They are not aspirations — they are guardrails
 * around today's behaviour. The measured baseline (recorded in each comment) is
 * the "before" number; a change that improves the metric moves comfortably
 * inside the envelope, a change that regresses it trips the guard.
 *
 * BUDGET: ~450 pipeline generations total (300 shared corpus + 150 famine),
 * ~3–4s in isolation. A generous per-test timeout absorbs CI parallel contention.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { gen, stressTypes, PROSPERITY_RANK, collectNpcHooks } from './simHelpers.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 50;                       // settlements per tier in the shared corpus
const TIMEOUT = 60_000;             // generous headroom for parallel CI contention

// The corpus config: hold the tier fixed, let the seed drive every other
// dimension (route/terrain/threat/culture all randomized) so each seed yields a
// genuinely varied settlement — a fair sample of what the tier produces.
const corpusConfig = (tier) => ({
  settType: tier,
  tradeRouteAccess: 'random_trade',
  terrainOverride: 'auto',
  monsterThreat: 'random_threat',
  culture: 'random_culture',
});

// ── Shared corpus, built once ────────────────────────────────────────────────
/** @type {Record<string, any[]>} */
const corpus = {};
beforeAll(() => {
  for (const tier of TIERS) {
    corpus[tier] = [];
    for (let i = 0; i < N; i++) corpus[tier].push(gen(corpusConfig(tier), `envelope-${i}`));
  }
}, TIMEOUT);

// Count settlements whose prosperity label falls in a rank set.
const bandCounts = (settlements) => {
  const counts = {};
  for (const s of settlements) {
    const p = s.economicState?.prosperity || 'unknown';
    counts[p] = (counts[p] || 0) + 1;
  }
  return counts;
};
const shareInRanks = (counts, ranks) =>
  Object.entries(counts).reduce((acc, [label, n]) => acc + (ranks.has(PROSPERITY_RANK[label]) ? n : 0), 0);
const fmtCounts = (counts) =>
  Object.entries(counts)
    .sort((a, b) => (PROSPERITY_RANK[a[0]] ?? 9) - (PROSPERITY_RANK[b[0]] ?? 9))
    .map(([k, v]) => `${k}:${v}`)
    .join(' ');

// ─────────────────────────────────────────────────────────────────────────────
// ENVELOPE 1 — Isolated-thorp famine incidence (the F9 measurement, institutionalized).
//
//   MEASURED: 54/150 = 36.0% of isolated thorps roll a famine.
//   ENVELOPE: [15%, 55%]  (measured 36.0% sits mid-band).
//   A thorp with no trade route is meant to be famine-PRONE but not famine-CERTAIN;
//   this guards both the "famine never fires" and the "everything starves" failures.
// ─────────────────────────────────────────────────────────────────────────────
describe('ENVELOPE 1 — isolated-thorp famine incidence', () => {
  test('famine fires for 15–55% of isolated thorps', () => {
    const NF = 150;
    let famine = 0;
    for (let i = 0; i < NF; i++) {
      const s = gen({ settType: 'thorp', tradeRouteAccess: 'isolated' }, `envelope-${i}`);
      if (stressTypes(s).includes('famine')) famine++;
    }
    const pct = (famine / NF) * 100;
    const diag = `isolated-thorp famine incidence: ${famine}/${NF} = ${pct.toFixed(1)}% (measured baseline 36.0%; envelope [15%, 55%])`;
    expect(pct, diag).toBeGreaterThanOrEqual(15);
    expect(pct, diag).toBeLessThanOrEqual(55);
  }, TIMEOUT);
});

// ─────────────────────────────────────────────────────────────────────────────
// ENVELOPE 2 — Prosperity band distribution per tier.
//
//   MEASURED (N=50 per tier):
//     thorp       Struggling:5 Poor:25 Moderate:16 Comfortable:4       (struggling 10%, wealthy 0%, prosperous+ 0%)
//     hamlet      Struggling:3 Poor:13 Moderate:11 Comfortable:20 Pros:3 (struggling 6%,  wealthy 0%, prosperous+ 6%)
//     village     Struggling:1 Poor:4  Moderate:14 Comfortable:23 Pros:8 (struggling 2%,  wealthy 0%, prosperous+ 16%)
//     town        Poor:3 Comfortable:17 Prosperous:30                   (struggling 0%,  wealthy 0%, prosperous+ 60%)
//     city        Struggling:1 Poor:2 Moderate:5 Comfortable:19 Pros:23 (struggling 2%,  wealthy 0%, prosperous+ 46%)
//     metropolis  Poor:3 Moderate:2 Comfortable:20 Prosperous:25        (struggling 0%,  wealthy 0%, prosperous+ 50%)
//
//   ENVELOPES (generous margins around the above):
//     - a metropolis is never majority-struggling  → struggling ≤ 25% (measured 0%)
//     - a thorp is never majority-wealthy           → prosperous+wealthy ≤ 25% (measured 0%)
//     - NO tier is majority-struggling              → struggling ≤ 40% every tier (measured max 10%, thorp)
//     - scale still buys prosperity                 → metropolis "Comfortable+" share > thorp's (measured 90% vs 8%)
// ─────────────────────────────────────────────────────────────────────────────
describe('ENVELOPE 2 — prosperity band distribution per tier', () => {
  const STRUGGLING = new Set([0]);            // Struggling / Subsistence
  const PROSPEROUS_PLUS = new Set([4, 5]);    // Prosperous / Wealthy
  const COMFORTABLE_PLUS = new Set([3, 4, 5]); // Comfortable / Prosperous / Wealthy

  const fullTable = () =>
    TIERS.map((t) => `    ${t.padEnd(11)} ${fmtCounts(bandCounts(corpus[t]))}`).join('\n');

  test('a metropolis is never majority-struggling (struggling share ≤ 25%)', () => {
    const counts = bandCounts(corpus.metropolis);
    const share = (shareInRanks(counts, STRUGGLING) / N) * 100;
    const diag = `metropolis struggling share = ${share.toFixed(0)}% (measured 0%; envelope ≤ 25%)\n  bands: ${fmtCounts(counts)}`;
    expect(share, diag).toBeLessThanOrEqual(25);
  });

  test('a thorp is never majority-wealthy (prosperous+wealthy share ≤ 25%)', () => {
    const counts = bandCounts(corpus.thorp);
    const share = (shareInRanks(counts, PROSPEROUS_PLUS) / N) * 100;
    const diag = `thorp prosperous+ share = ${share.toFixed(0)}% (measured 0%; envelope ≤ 25%)\n  bands: ${fmtCounts(counts)}`;
    expect(share, diag).toBeLessThanOrEqual(25);
  });

  test('no tier is majority-struggling (struggling share ≤ 40% for every tier)', () => {
    const rows = TIERS.map((t) => {
      const counts = bandCounts(corpus[t]);
      return { tier: t, share: (shareInRanks(counts, STRUGGLING) / N) * 100, counts };
    });
    const diag = 'per-tier struggling share (measured max 10%, thorp; envelope ≤ 40%):\n' +
      rows.map((r) => `    ${r.tier.padEnd(11)} ${r.share.toFixed(0)}%  [${fmtCounts(r.counts)}]`).join('\n');
    for (const r of rows) expect(r.share, diag).toBeLessThanOrEqual(40);
  });

  test('scale still buys prosperity (metropolis Comfortable+ share exceeds thorp)', () => {
    const metroShare = (shareInRanks(bandCounts(corpus.metropolis), COMFORTABLE_PLUS) / N) * 100;
    const thorpShare = (shareInRanks(bandCounts(corpus.thorp), COMFORTABLE_PLUS) / N) * 100;
    const diag = `Comfortable+ share — metropolis ${metroShare.toFixed(0)}% vs thorp ${thorpShare.toFixed(0)}% (measured 90% vs 8%)\n${fullTable()}`;
    expect(metroShare, diag).toBeGreaterThan(thorpShare);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ENVELOPE 3 — Intra-settlement hook repeat-rate (the anti-repetition RATCHET).
//
//   BEFORE (Wave D baseline, naive per-NPC pool picks) across 100 towns+cities:
//     total hooks 1490, duplicates 122
//     ► corpus duplicate rate = 8.19% ◄   worst single settlement = 35.0% (city/envelope-33)
//
//   AFTER (Wave E / batch E2 — the settlement-scoped draw registry in npcGenerator:
//   every NPC draws its loyalty hook through drawUnique(pool, usedTitles) so no two
//   NPCs emit the same family; see src/generators/hookVariety.js):
//     total hooks 1532, duplicates 3   (the 3 residuals are pool-EXHAUSTION on the
//     largest cities — a category's ~11-string pool ran out before its NPCs did)
//     ► corpus duplicate rate = 0.20% ◄   worst single settlement = 6.3% (city/envelope-27)
//
//   ENVELOPE (RATCHETED to the new measured floor + small margin):
//     corpus rate ≤ 2% (measured 0.20%; the machinery alone removed every AVOIDABLE
//     repeat), worst single ≤ 15% (measured 6.3%; absorbs pool exhaustion on scale).
//   The guard now trips if the registry regresses (a naive pick re-appears, jumping
//   the corpus rate back toward 8%). Phase 5 content multiplication — more authored
//   variants per pool — will retire even the pool-exhaustion residuals and let this
//   ratchet move further down.
// ─────────────────────────────────────────────────────────────────────────────
describe('ENVELOPE 3 — hook repeat-rate (anti-repetition ratchet)', () => {
  test('a settlement rarely repeats its own plot hooks (corpus ≤ 2%, worst ≤ 15%)', () => {
    let totalHooks = 0;
    let totalDup = 0;
    let worstRate = 0;
    let worstWhere = '(none)';
    let sampled = 0;
    for (const tier of ['town', 'city']) {
      corpus[tier].forEach((s, i) => {
        const hooks = collectNpcHooks(s);
        if (hooks.length === 0) return;
        const dup = hooks.length - new Set(hooks).size;
        totalHooks += hooks.length;
        totalDup += dup;
        sampled++;
        const rate = dup / hooks.length;
        if (rate > worstRate) { worstRate = rate; worstWhere = `${tier}/envelope-${i}`; }
      });
    }
    const corpusRate = (totalDup / totalHooks) * 100;
    const worstPct = worstRate * 100;
    const diag =
      `hook repeat-rate — corpus ${corpusRate.toFixed(2)}% (${totalDup}/${totalHooks} dup across ${sampled} settlements), ` +
      `worst ${worstPct.toFixed(1)}% @ ${worstWhere} (before: corpus 8.19%, worst 35.0%; after: corpus 0.20%, worst 6.3%)`;
    expect(corpusRate, diag).toBeLessThanOrEqual(2);
    expect(worstPct, diag).toBeLessThanOrEqual(15);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ENVELOPE 4 — Stress incidence sanity + anti-monoculture.
//
//   MEASURED (N=50 per tier, 300 settlements, 63 stress entries):
//     incidence — thorp 24%, hamlet 24%, village 22%, town 18%, city 20%, metropolis 18%
//     type share — succession_void 23.8%, indebted 19.0%, occupied 14.3%, plague_onset 11.1%,
//                  religious_conversion 9.5%, mass_migration 9.5%, politically_fractured 4.8%,
//                  monster_pressure 4.8%, famine 3.2%   (9 distinct types)
//
//   ENVELOPES:
//     - every tier's stress incidence ∈ [5%, 60%]  (measured 18–24%)
//     - no single stress TYPE > 45% of all stress entries (measured max 23.8%) — anti-monoculture
// ─────────────────────────────────────────────────────────────────────────────
describe('ENVELOPE 4 — stress incidence sanity + anti-monoculture', () => {
  test('every tier stresses 5–60% of settlements', () => {
    const rows = TIERS.map((t) => {
      const stressed = corpus[t].filter((s) => stressTypes(s).length > 0).length;
      return { tier: t, pct: (stressed / N) * 100, stressed };
    });
    const diag = 'per-tier stress incidence (measured 18–24%; envelope [5%, 60%]):\n' +
      rows.map((r) => `    ${r.tier.padEnd(11)} ${r.stressed}/${N} = ${r.pct.toFixed(0)}%`).join('\n');
    for (const r of rows) {
      expect(r.pct, diag).toBeGreaterThanOrEqual(5);
      expect(r.pct, diag).toBeLessThanOrEqual(60);
    }
  });

  test('no single stress type is a monoculture (> 45% of all entries)', () => {
    const typeCounts = {};
    let total = 0;
    for (const tier of TIERS) {
      for (const s of corpus[tier]) {
        for (const t of stressTypes(s)) { typeCounts[t] = (typeCounts[t] || 0) + 1; total += 1; }
      }
    }
    const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    const [topType, topCount] = sorted[0] || ['(none)', 0];
    const topShare = total ? (topCount / total) * 100 : 0;
    const diag =
      `stress-type shares across ${total} entries (${sorted.length} distinct types; measured max 23.8%; envelope ≤ 45%):\n` +
      sorted.map(([t, c]) => `    ${t.padEnd(22)} ${c} (${((c / total) * 100).toFixed(1)}%)`).join('\n');
    expect(total, diag).toBeGreaterThan(0);
    expect(topShare, `dominant type "${topType}" — ${diag}`).toBeLessThanOrEqual(45);
  });
});
