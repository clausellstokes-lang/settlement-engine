/**
 * generate-analytics-dictionary.mjs — the Analytics v2 DATA DICTIONARY generator
 * (DESIGN_ANALYTICS_V2.md §2, first bullet).
 *
 * WHAT
 *   Emits docs/analytics-event-dictionary.md — a buyer/owner-readable, code-truthful
 *   enumeration of EVERY analytics event: its constant, wire name, consent class
 *   (essential / research), and — for the events an enrichment extractor feeds — the
 *   actual coarse prop keys those extractors emit. The event spine (names, classes,
 *   revision) is derived ENTIRELY from src/lib/analyticsEvents.js, and the prop keys
 *   are derived by RUNNING the extractors (src/lib/spatialUsage.js,
 *   src/lib/constructionUsage.js, src/lib/pulseFingerprint.js, src/lib/spatialCanonizeUsage.js)
 *   on representative fixtures — so the dictionary can never drift from the code.
 *
 * WHY a generated artifact (vs the hand-authored docs/analytics-event-taxonomy.md)
 *   The taxonomy doc is the DESIGN narrative (triggers, questions, instrumentation
 *   map) — human-authored and not machine-derivable. This dictionary is the
 *   machine-truth spine: it exists so a reader (a market buyer, a new engineer, the
 *   owner) can see the complete, current event surface WITHOUT trusting a hand doc to
 *   be up to date. The freshness test (tests/docs/analyticsDictionaryFreshness.test.js)
 *   fails if the committed .md diverges from a fresh generation, if any event lacks a
 *   dictionary row (coverage), or if the research-class set drifts — the
 *   architectureFreshness idiom.
 *
 * HOW to regenerate
 *   npm run gen:analytics-dictionary
 *
 * Dependency-free beyond the source registry + the (pure, dependency-light) extractors.
 * Deterministic: no timestamps, stable sort order = analyticsEvents.js file order.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { EVENTS, EVENT_CLASS, EVENTS_REV, RESEARCH_EVENT_KEYS } from '../src/lib/analyticsEvents.js';
import { extractSpatialUsage } from '../src/lib/spatialUsage.js';
import { realmShape } from '../src/lib/constructionUsage.js';
import {
  extractPulseSummary, extractProposalDecision, extractPartyImpact, extractStressorTransitions,
} from '../src/lib/pulseFingerprint.js';
import { extractCanonizeUsage } from '../src/lib/spatialCanonizeUsage.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EVENTS_SRC = join(ROOT, 'src', 'lib', 'analyticsEvents.js');
export const DICTIONARY_PATH = join(ROOT, 'docs', 'analytics-event-dictionary.md');

/** Sorted top-level keys of an extractor's output object (the coarse prop names). */
const topKeys = (obj) => (obj && typeof obj === 'object' ? Object.keys(obj).slice().sort() : []);
const uniqSort = (arr) => [...new Set(arr)].sort();

/**
 * Prop keys per event, DERIVED BY RUNNING the extractors on representative fixtures
 * that exercise the full key surface (spatial live + mover block present, etc.).
 * Only the enrichment-extractor-backed events appear here; events whose props are
 * built inline at the call site (e.g. the generation_completed fingerprint) are
 * cross-referenced to the taxonomy doc instead of duplicated.
 */
export function extractorPropKeys() {
  const spatial = extractSpatialUsage({
    spatialCanonVersion: 1,
    spatialLedgers: { supplyShipments: { a: {} } },
    simulationRules: { presetId: 'sample', seasonsEnabled: true },
  });
  const pulse = extractPulseSummary({}, 'one_month');
  const canonize = extractCanonizeUsage({ settlementIds: [1], litFeatures: {} }, 1, 1000);
  const realm = realmShape({ nodes: [], edges: [] });
  const proposal = extractProposalDecision({ outcome: {} }, 'applied');
  const party = extractPartyImpact({}, {});
  const transitions = extractStressorTransitions({});

  return {
    // campaignAdvanceSession.js: {...extractPulseSummary, events_applied_count, ...extractSpatialUsage}
    world_pulse_advanced: uniqSort([...topKeys(pulse), 'events_applied_count', ...topKeys(spatial)]),
    // campaignSpatialCanonize.js / campaignWorldPulseSlice.js: {settlement_count, ...canonize, ...realmShape}
    world_canonized: uniqSort(['settlement_count', ...topKeys(canonize), ...topKeys(realm)]),
    world_pulse_proposal_applied: topKeys(proposal),
    world_pulse_proposal_dismissed: topKeys(proposal),
    party_impact_recorded: topKeys(party),
    world_stressor_transitions: topKeys(transitions),
    // settlementSlice.js generation path: configArchetype(config) → the one extractor-derived key
    generation_completed: ['config_archetype'],
  };
}

/**
 * Parse analyticsEvents.js for the ordered (section, constant, name) list. The
 * `// ── <label> ──` dividers become section headers; each `CONSTANT: 'name'` line
 * is attributed to the section it follows. Source-derived so the grouping cannot
 * drift from the registry file.
 * @returns {{ section: string, constant: string, name: string }[]}
 */
export function parseRegistrySections(src = readFileSync(EVENTS_SRC, 'utf8')) {
  const out = [];
  let section = 'Uncategorised';
  let inEvents = false;
  for (const raw of src.split('\n')) {
    const line = raw.replace(/\r$/, '');
    if (/export const EVENTS\s*=/.test(line)) { inEvents = true; continue; }
    if (inEvents && /^\}\)/.test(line.trim())) break; // end of the EVENTS object
    if (!inEvents) continue;
    const div = line.match(/^\s*\/\/\s*──\s*(.+?)\s*─+\s*$/);
    if (div) { section = div[1].trim(); continue; }
    const kv = line.match(/^\s*([A-Z0-9_]+):\s*'([a-z][a-z0-9_]*)'/);
    if (kv && kv[1] in EVENTS) out.push({ section, constant: kv[1], name: kv[2] });
  }
  return out;
}

const esc = (s) => String(s).replace(/\|/g, '\\|');

/** Build the full dictionary markdown (pure; deterministic; no timestamps). */
export function buildDictionary() {
  const rows = parseRegistrySections();
  // Coverage safety net: any EVENTS key the parser missed still gets a row (so the
  // generated doc is ALWAYS complete even if a divider format changes).
  const seen = new Set(rows.map((r) => r.constant));
  for (const [constant, name] of Object.entries(EVENTS)) {
    if (!seen.has(constant)) rows.push({ section: 'Uncategorised', constant, name });
  }
  const props = extractorPropKeys();
  const total = Object.keys(EVENTS).length;
  const research = RESEARCH_EVENT_KEYS.length;
  const essential = total - research;

  const lines = [];
  lines.push('# Analytics Event Dictionary (generated)');
  lines.push('');
  lines.push('<!-- GENERATED FILE — DO NOT EDIT BY HAND.');
  lines.push('     Source of truth: src/lib/analyticsEvents.js (event spine) + the enrichment');
  lines.push('     extractors (spatialUsage / constructionUsage / pulseFingerprint / spatialCanonizeUsage,');
  lines.push('     run on fixtures for the prop keys). Regenerate: npm run gen:analytics-dictionary.');
  lines.push('     Drift-guarded by tests/docs/analyticsDictionaryFreshness.test.js. -->');
  lines.push('');
  lines.push('The machine-truth companion to the design narrative in');
  lines.push('[analytics-event-taxonomy.md](./analytics-event-taxonomy.md) (triggers, questions,');
  lines.push('instrumentation map live there — this file is the complete, current event surface).');
  lines.push('');
  lines.push('**Contract:** every event name satisfies `^[a-z][a-z0-9_]{2,63}$`, is a frozen constant');
  lines.push('in `src/lib/analyticsEvents.js`, and carries a class in the parallel `EVENT_CLASS` map.');
  lines.push('Props are coarse by construction — enums, bands, counts, booleans, hashes; never names,');
  lines.push('prose, seeds, or free text (the inverse-sanitizer discipline + server-side clamps).');
  lines.push('');
  lines.push(`- **EVENTS_REV:** ${EVENTS_REV}`);
  lines.push(`- **Events:** ${total} total — ${essential} essential, ${research} research`);
  lines.push('- **Research class** requires explicit opt-in (built + mirrored only under `research` consent, re-clamped server-side).');
  lines.push('- **Enriched props** below are the actual top-level keys the bound extractor emits (code-derived); events built inline at the call site show `—` and are documented in the taxonomy.');
  lines.push('');

  // Group in file order.
  const order = [];
  const bySection = new Map();
  for (const r of rows) {
    if (!bySection.has(r.section)) { bySection.set(r.section, []); order.push(r.section); }
    bySection.get(r.section).push(r);
  }
  for (const section of order) {
    lines.push(`## ${esc(section)}`);
    lines.push('');
    lines.push('| Constant | Event | Class | Enriched props (code-derived) |');
    lines.push('|---|---|---|---|');
    for (const r of bySection.get(section)) {
      const cls = EVENT_CLASS[r.constant] || 'essential';
      const pk = props[r.name];
      const propCell = pk && pk.length ? '`' + pk.join('` · `') + '`' : '—';
      lines.push(`| \`${esc(r.constant)}\` | \`${esc(r.name)}\` | ${cls} | ${propCell} |`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('_Generated from the registry + enrichment extractors. If this file is stale the');
  lines.push('freshness test fails — run `npm run gen:analytics-dictionary` to update._');
  lines.push('');
  return lines.join('\n');
}

/** Every EVENTS name, for the coverage assertion in the freshness test. */
export function allEventNames() { return uniqSort(Object.values(EVENTS)); }

function main() {
  const md = buildDictionary();
  writeFileSync(DICTIONARY_PATH, md);
  process.stdout.write(`[generate-analytics-dictionary] wrote ${DICTIONARY_PATH} (${Object.keys(EVENTS).length} events)\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
