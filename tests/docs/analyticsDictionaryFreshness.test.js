/**
 * analyticsDictionaryFreshness.test.js — the drift contract for the generated
 * Analytics v2 data dictionary (DESIGN_ANALYTICS_V2.md §2; the architectureFreshness
 * idiom applied to docs/analytics-event-dictionary.md).
 *
 * The dictionary is a COMMITTED, GENERATED artifact (scripts/generate-analytics-dictionary.mjs
 * reads src/lib/analyticsEvents.js + runs the enrichment extractors). These pins make
 * it impossible for the committed file to silently diverge from the code:
 *
 *   1. FRESHNESS — the committed .md is byte-identical to a fresh in-memory generation.
 *      A new/renamed event, a class flip, or a changed extractor prop shape makes this
 *      fail until `npm run gen:analytics-dictionary` is re-run.
 *   2. COVERAGE — every EVENTS name appears in the committed doc (no event is undocumented).
 *   3. CLASS PARITY — the doc's research-class rows are EXACTLY RESEARCH_EVENT_KEYS.
 *   4. TAXONOMY PIN — the sibling hand-authored taxonomy doc's "exactly N research"
 *      claim tracks RESEARCH_EVENT_KEYS (catches the narrative doc drifting too).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildDictionary, DICTIONARY_PATH } from '../../scripts/generate-analytics-dictionary.mjs';
import { EVENTS, EVENT_CLASS, RESEARCH_EVENT_KEYS } from '../../src/lib/analyticsEvents.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TAXONOMY_PATH = join(ROOT, 'docs', 'analytics-event-taxonomy.md');

describe('analytics-event-dictionary.md is a committed, fresh, generated artifact', () => {
  it('the dictionary file exists (a moved/deleted artifact must fail loudly)', () => {
    expect(existsSync(DICTIONARY_PATH), `missing: ${DICTIONARY_PATH}`).toBe(true);
  });

  it('is byte-identical to a fresh generation (regenerate: npm run gen:analytics-dictionary)', () => {
    const committed = readFileSync(DICTIONARY_PATH, 'utf8');
    expect(committed, 'Dictionary is stale. Run: npm run gen:analytics-dictionary').toBe(buildDictionary());
  });

  it('documents EVERY event in the registry (coverage — a new event forces a row)', () => {
    const committed = readFileSync(DICTIONARY_PATH, 'utf8');
    for (const name of Object.values(EVENTS)) {
      expect(committed.includes(`\`${name}\``), `event "${name}" is undocumented in the dictionary`).toBe(true);
    }
  });

  it('marks exactly the RESEARCH_EVENT_KEYS as research-class', () => {
    const committed = readFileSync(DICTIONARY_PATH, 'utf8');
    const researchNames = new Set(RESEARCH_EVENT_KEYS.map((k) => EVENTS[k]));
    for (const [name] of Object.entries(EVENTS).map(([k, v]) => [v, k])) {
      const isResearch = researchNames.has(name);
      // The row for this event: `| \`CONSTANT\` | \`name\` | <class> | …`
      const row = committed.split('\n').find((l) => l.includes(`\`${name}\` |`));
      expect(row, `no dictionary row for "${name}"`).toBeTruthy();
      const cls = isResearch ? 'research' : 'essential';
      expect(row.includes(`| ${cls} |`), `"${name}" should be ${cls}-class`).toBe(true);
    }
  });

  it('EVENT_CLASS agrees with RESEARCH_EVENT_KEYS (registry self-consistency)', () => {
    const research = Object.entries(EVENT_CLASS).filter(([, v]) => v === 'research').map(([k]) => k).sort();
    expect(research).toEqual([...RESEARCH_EVENT_KEYS].sort());
  });
});

describe('the hand-authored taxonomy doc tracks the registry (F33 number-drift idiom)', () => {
  it('its "research-class events: exactly N" claim matches RESEARCH_EVENT_KEYS', () => {
    const taxonomy = readFileSync(TAXONOMY_PATH, 'utf8');
    const m = taxonomy.match(/Research-class events:\s*exactly\s+(\d+)/i);
    expect(m, 'taxonomy doc should state the research-class count').toBeTruthy();
    expect(Number(m[1])).toBe(RESEARCH_EVENT_KEYS.length);
  });
});
