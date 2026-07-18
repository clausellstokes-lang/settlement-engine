/**
 * stressTypeRegistration.test.js — [generators-domain-1 + data-tables-3].
 *
 * THE STRESS-TYPE REGISTRATION MANIFEST WALKER (structural prevention).
 *
 * A stress type registered in STRESS_TYPE_MAP must be WIRED into every consuming
 * table — arrival vignettes, institution secrets, tension mapping, and the NPC/
 * history/severity/flavor weight tables — or carry an explicit, documented
 * exemption. Before this, the 5 newer types (insurgency, mass_migration, wartime,
 * religious_conversion, slave_revolt) were registered but half-integrated: they
 * had no vignette, no institutional secrets, no probability coupling, and their
 * tension targets (legitimacy_crisis/demographic_pressure/trade_dispute) had no
 * template, so the tension was silently dropped.
 *
 * This walker makes "a new stress type cannot ship half-wired" a test, not a hope.
 * Exported tables are checked by import; function-local tables by source-scan
 * (brace-matched block, then a per-key presence check).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { STRESS_TYPE_META } from '../../src/data/stressTypesMeta.js';
import { STRESS_DESCS } from '../../src/generators/narrativeGenerator.js';
import { STRESS_SEVERITY_WEIGHT } from '../../src/generators/stressGenerator.js';
import { STRESS_FLAVOR } from '../../src/generators/power/settlementNarrative.js';
import { STRESS_TO_TENSION } from '../../src/generators/historyGenerator.js';
import { HISTORICAL_EVENTS_DATA, EVENT_TYPE_NAMES } from '../../src/data/historyData.js';

const TYPES = Object.keys(STRESS_TYPE_MAP);

// EXEMPTIONS — tables that intentionally do NOT cover every registered type.
// Any new stress type is auto-covered by these exemptions; the point is to keep
// the decision explicit and reviewable, not to silence the walker.
const EXEMPTIONS = {
  // Trace-only: names the institutions that SUPPRESS a stress. Only types with an
  // institution-based suppressor appear; types suppressed by priorities/route/threat
  // (and the 5 new types, whose institution couplings are BOOSTS not suppressors)
  // legitimately have no entry. (src/generators/steps/stressConfirmPass.js)
  SUPPRESSOR_KEYWORDS: 'institution-suppressed types only',
  // UI display posture table with a graceful fallback; partial by design and outside
  // the generation surface. pdf-4 (main) extracted it from DefenseTab into the shared
  // display module as DEFENSE_STRESS_STATUS (DefenseTab now aliases it), so print and
  // screen can't drift. (src/domain/display/defenseDisplay.js)
  DEFENSE_STRESS_STATUS: 'UI display, partial by design',
  // Deliberately the 5 newer types only (an override layer). (npcGenerator.js)
  STRESS_GOAL_OVERRIDES: 'new-types override layer by design',
};

function read(rel) {
  return readFileSync(resolve(process.cwd(), rel), 'utf-8');
}

// Extract a `NAME = { ... }` object literal block via brace matching (robust to
// nested objects/arrays), so a per-key scan cannot leak past the table.
function tableBlock(src, tableName) {
  const start = src.indexOf(`${tableName} = {`);
  if (start === -1) return null;
  const open = src.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  return null;
}

// Missing keys for a table given a way to test membership.
const missingIn = (has) => TYPES.filter((t) => !has(t));

describe('stress-type registration manifest (structural prevention)', () => {
  it('exemptions reference no unknown table (keeps the exemption list honest)', () => {
    // Every exemption must name a table that actually exists in the source, so a
    // renamed/deleted table cannot leave a stale silent exemption behind.
    const srcAll =
      read('src/generators/steps/stressConfirmPass.js') +
      read('src/components/new/tabs/DefenseTab.jsx') +
      read('src/domain/display/defenseDisplay.js') +
      read('src/generators/npcGenerator.js');
    for (const name of Object.keys(EXEMPTIONS)) {
      // Accept both a plain object literal and an Object.freeze()-wrapped table
      // (DEFENSE_STRESS_STATUS is frozen in the shared display module).
      const exists = srcAll.includes(`${name} = {`) || srcAll.includes(`${name} = Object.freeze({`);
      expect(exists, `exemption '${name}' names a table that no longer exists`).toBe(true);
    }
  });

  // ── Imported (exported) tables — exact key coverage ──────────────────────────
  const importedTables = {
    STRESS_TYPE_META,
    STRESS_INSTITUTION_EFFECTS,
    STRESS_DESCS,
    STRESS_SEVERITY_WEIGHT,
    STRESS_FLAVOR,
    STRESS_TO_TENSION,
  };
  for (const [name, table] of Object.entries(importedTables)) {
    it(`${name} covers every registered stress type`, () => {
      const missing = missingIn((t) => Object.prototype.hasOwnProperty.call(table, t));
      expect(missing, `${name} is missing: ${missing.join(', ')}`).toEqual([]);
    });
  }

  // ── Source-scanned (function-local) tables — per-key presence ────────────────
  const scanned = [
    // STRESS_NOTES moved to the data leaf (CONTENT-GT-FINAL Charge 4: variant pools +
    // the max-lines leaf rule); the walker follows the table to its home.
    ['src/data/narrativeData.js', 'STRESS_NOTES'],
    ['src/generators/npcGenerator.js', 'STRESS_BOOSTS'],
    ['src/generators/npcGenerator.js', 'STRESS_SECRET_BOOSTS'],
    ['src/generators/npcGenerator.js', 'STRESS_TO_CATEGORY'],
    ['src/generators/npcGenerator.js', 'STRESS_MANDATORY_ROLES'],
    ['src/generators/npcGenerator.js', 'STRESS_GOALS'],
    ['src/generators/historyGenerator.js', 'STRESS_BOOSTS'],
  ];
  for (const [file, name] of scanned) {
    it(`${name} (${file.split('/').pop()}) covers every registered stress type`, () => {
      const block = tableBlock(read(file), name);
      expect(block, `could not locate table ${name} in ${file}`).toBeTruthy();
      const missing = missingIn((t) => new RegExp(`\\b${t}:`).test(block));
      expect(missing, `${name} is missing: ${missing.join(', ')}`).toEqual([]);
    });
  }

  // ── buildStressContext probability coupling — presence per registered type ───
  it('buildStressContext references every registered stress type (probability coupling)', () => {
    const src = read('src/generators/stressGenerator.js');
    const fnStart = src.indexOf('buildStressContext =');
    const fnEnd = src.indexOf('STRESS_SEVERITY_WEIGHT'); // the export that follows the function
    const body = src.slice(fnStart, fnEnd);
    const missing = TYPES.filter((t) => !body.includes(`'${t}'`));
    expect(missing, `buildStressContext has no coupling reference for: ${missing.join(', ')}`).toEqual([]);
  });

  // ── Tension resolution — the exact bug class this wave fixed ─────────────────
  it('every STRESS_TO_TENSION target resolves to a real template with a chapter title', () => {
    const templateTypes = new Set(HISTORICAL_EVENTS_DATA.map((e) => e.type));
    const unresolved = [];
    for (const [stress, tension] of Object.entries(STRESS_TO_TENSION)) {
      if (!templateTypes.has(tension)) unresolved.push(`${stress}→${tension} (no template)`);
      else if (!EVENT_TYPE_NAMES[tension]) unresolved.push(`${stress}→${tension} (no title)`);
    }
    expect(unresolved, `unresolved tension mappings: ${unresolved.join(', ')}`).toEqual([]);
  });

  // ── [generators-domain-1] numeric-consumer coupling (defense / food / prosperity) ────
  // The inline stress-CONSUMER blocks (defense penalties, food production, prosperity
  // index) are SELECTIVE by design — each type couples to the dimensions its viabilityNote
  // implies, so a "covers every type" walker does not fit them. These targeted scans pin the
  // couplings the round-2 fix added, so they cannot silently regress to half-integrated.
  it('the second-wave types couple to DEFENSE via the priorityHelpers multipliers (NOT the inline penalty block — that would double-count)', () => {
    const ph = read('src/generators/priorityHelpers.js');
    for (const t of ['insurgency', 'mass_migration', 'wartime', 'religious_conversion', 'slave_revolt']) {
      expect(ph.includes(`'${t}'`), `priorityHelpers missing defense-input coupling for ${t}`).toBe(true);
    }
  });

  it('the food-impacting second-wave types are coupled in BOTH food generators (production/consumption)', () => {
    const foodGen = read('src/generators/foodGenerator.js');
    const foodBal = read('src/generators/economy/foodBalance.js');
    for (const t of ['wartime', 'slave_revolt', 'mass_migration']) {
      expect(foodGen.includes(`'${t}'`), `foodGenerator.js has no food coupling for ${t}`).toBe(true);
      expect(foodBal.includes(`'${t}'`), `foodBalance.js has no food coupling for ${t}`).toBe(true);
    }
  });

  it('slave_revolt has a direct prosperity-index penalty row (the one second-wave type that lacked one)', () => {
    const prosperity = read('src/generators/economy/prosperity.js');
    expect(prosperity.includes(`'slave_revolt'`), 'prosperity.js has no slave_revolt penalty row').toBe(true);
  });
});
