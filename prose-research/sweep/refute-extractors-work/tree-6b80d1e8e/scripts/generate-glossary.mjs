/**
 * generate-glossary.mjs — THE GUIDANCE-LAYER GLOSSARY generator (DESIGN_GUIDANCE_LAYER.md §6).
 *
 * WHAT
 *   Emits docs/glossary.md — a code-truthful "how to interpret everything" reference
 *   for the engine's read-out vocabulary: the DM event verbs (and the dials they
 *   expose), the stability bands, the strain bands, the capture rungs, and the
 *   severity / magnitude dial words. Every TERM is derived from the code registries
 *   (src/domain/display/glossary.js :: buildGlossaryEntries), so the reference can
 *   never drift from what the engine actually does.
 *
 * WHY a generated artifact
 *   The same derivation feeds the runtime "what am I reading?" affordance, so the
 *   human reference and the in-app lookup are one source of truth. The freshness
 *   test (tests/docs/glossaryFreshness.test.js) fails if the committed .md diverges
 *   from a fresh generation, or if a registry term lacks a row (coverage) — the
 *   architectureFreshness / analytics-dictionary idiom.
 *
 * HOW to regenerate
 *   npm run gen:glossary
 *
 * Dependency-free beyond the source registries. Deterministic: no timestamps,
 * stable order = buildGlossaryEntries() registry order.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { buildGlossaryEntries } from '../src/domain/display/glossary.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const GLOSSARY_PATH = join(ROOT, 'docs', 'glossary.md');

/** Human-facing section titles, in emit order. */
const SECTIONS = [
  ['verb', 'Event verbs', 'The actions a DM can apply to a settlement, and the dials each exposes.'],
  ['stability-band', 'Stability bands', 'How a settlement’s overall health reads at a glance.'],
  ['strain-band', 'Strain bands', 'How a single capacity (food, defense, healing, …) reads against its demand.'],
  ['capture-rung', 'Capture rungs', 'How far a criminal interest has taken a seat of power.'],
  ['severity', 'Severity', 'The weight of a stressor a DM applies.'],
  ['magnitude', 'Magnitude', 'The size of a generosity decree, as a share of the giver’s surplus.'],
];

/** Escape a cell for a markdown table. */
function cell(s) {
  return String(s).replace(/\|/g, '\\|');
}

/**
 * Build the glossary markdown. Pure + deterministic — the freshness test diffs
 * the committed file against this.
 * @returns {string}
 */
export function buildGlossary() {
  const entries = buildGlossaryEntries();
  const byCat = new Map();
  for (const e of entries) {
    if (!byCat.has(e.category)) byCat.set(e.category, []);
    byCat.get(e.category).push(e);
  }

  const lines = [];
  lines.push('<!-- GENERATED FILE — DO NOT EDIT BY HAND.');
  lines.push('     Source of truth: src/domain/display/glossary.js (buildGlossaryEntries),');
  lines.push('     itself derived from the event affordance manifest, state/bands, capacityModel,');
  lines.push('     and corruption. Regenerate: npm run gen:glossary');
  lines.push('     Pinned by tests/docs/glossaryFreshness.test.js (byte-identity + coverage). -->');
  lines.push('');
  lines.push('# The Guidance-Layer Glossary');
  lines.push('');
  lines.push(`_${entries.length} terms, generated from the code registries — "how to interpret everything."_`);
  lines.push('');
  lines.push('> Scope note: institution **facets** and the continuous **credibility** stock are');
  lines.push('> intentionally absent — the facet vocabulary is un-exported in the spatial engine,');
  lines.push('> and credibility is a weight, not a labelled ladder. Both are documented deferrals.');
  lines.push('');

  for (const [cat, title, blurb] of SECTIONS) {
    const rows = byCat.get(cat) || [];
    if (rows.length === 0) continue;
    lines.push(`## ${title}`);
    lines.push('');
    lines.push(`_${blurb}_`);
    lines.push('');
    const hasFamily = cat === 'verb';
    if (hasFamily) {
      lines.push('| Term | Family | Definition | Dials |');
      lines.push('| --- | --- | --- | --- |');
      for (const e of rows) {
        const dials = (e.dials && e.dials.length) ? e.dials.map((d) => `\`${d}\``).join(' · ') : '—';
        lines.push(`| ${cell(e.term)} | ${cell(e.family)} | ${cell(e.definition)} | ${dials} |`);
      }
    } else {
      lines.push('| Term | Definition |');
      lines.push('| --- | --- |');
      for (const e of rows) {
        lines.push(`| ${cell(e.term)} | ${cell(e.definition)} |`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const md = buildGlossary();
  writeFileSync(GLOSSARY_PATH, md);
  process.stdout.write(`[generate-glossary] wrote ${GLOSSARY_PATH} (${buildGlossaryEntries().length} terms)\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
