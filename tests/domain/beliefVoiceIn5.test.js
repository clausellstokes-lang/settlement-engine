/**
 * beliefVoiceIn5.test.js — FP IN-5, THE VOICE (docs/DESIGN_FP_ARCHITECTURE.md §5 block #21;
 * docs/DESIGN_FP_ARCH_IN.md §4 IN-5, normative; docs/DESIGN_FP_INFORMATION.md §5 IN-5, J-INF-6,
 * J-INF-7, J-INF-8, J-INF-16; the FP kit's briefs/BUILD-FP-I5-in5.md).
 *
 * COMMIT 1, THE DESK: the seventh Herald section `knowledge`, the executed census of every reader
 * of the section vocabulary, the information program's routed beats re-routed to the desk, the
 * `belief_misjudgment` refile (its goldens captured first: tests/property/
 * heraldKnowledgeDeskGolden.test.js), and the measurement that section tokens are NOT
 * decree-addressable (the chair's R-31, re-measured here rather than trusted).
 *
 * @enforced-module src/domain/realm/heraldRouting.js
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  EXACT_SECTION,
  HERALD_SECTIONS,
  KIND_SECTION_DIVERGENCES,
  PREFIX_RULES,
  SECTION_OF,
  heraldSectionOfRecord,
  isExplicitlyRouted,
} from '../../src/domain/realm/heraldRouting.js';
import { KIND_SECTION } from '../../src/domain/display/chroniclersLetter.js';
import { HEADLINE_TEMPLATES } from '../../src/components/map/heraldGrammar.js';
import { toHeraldItem } from '../../src/components/map/heraldFeed.js';
import { HERALD_SECTION_CHANNEL } from '../../src/domain/worldPulse/brokerageStamps.js';
import { INFORMATION_KIND_REGISTRY } from '../../src/domain/worldPulse/informationNews.js';
import { beliefMisjudgmentNewsEntries } from '../../src/domain/worldPulse/beliefMap.js';
import { IN0A_PLANT_HANDOFF_COUPLING } from '../../src/domain/certification/couplingRegistryInfo.js';
import { OP_TYPES } from '../../src/domain/edit/operations.js';
import { DIRECTION_OP_TYPES } from '../../src/domain/edit/directions.js';
import { OFF_STAGE_OP_TYPES } from '../../src/domain/edit/operationsOffStage.js';
import { REALM_MANIFEST } from '../../src/domain/events/realmManifest.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
/** @param {string} dir @param {string[]} [out] @returns {string[]} */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, out);
    else if (/\.(js|jsx|mjs)$/.test(entry)) out.push(abs);
  }
  return out;
}
/** Comments stripped, so a census reads code and never a docstring's mention. */
const codeOf = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

/** THE DESK THE DESIGN NAMES at commit 1: the program's routed beats and the refile. */
const DESK_AT_COMMIT_1 = Object.freeze(['belief_misjudgment', 'false_accusation', 'lure_sprung', 'plant_took', 'sweep_launched']);

describe('IN-5/1 — the seventh desk', () => {
  test('the section vocabulary grows by exactly one member, after trade and before the catch-all', () => {
    expect(HERALD_SECTIONS).toHaveLength(7);
    expect(HERALD_SECTIONS.indexOf('knowledge')).toBe(HERALD_SECTIONS.indexOf('trade') + 1);
    expect(HERALD_SECTIONS.indexOf('events')).toBe(HERALD_SECTIONS.indexOf('knowledge') + 1);
    expect(Object.isFrozen(HERALD_SECTIONS)).toBe(true);
  });

  test('the desk routes EXACTLY the kinds the design names, each by its own exact row', () => {
    const desk = Object.keys(EXACT_SECTION).filter((kind) => EXACT_SECTION[kind] === 'knowledge').sort();
    expect(desk.filter((kind) => DESK_AT_COMMIT_1.includes(kind))).toEqual([...DESK_AT_COMMIT_1]);
    // No family prefix routes to the desk: a kind files here by its exact row or not at all.
    expect(PREFIX_RULES.filter(([, section]) => section === 'knowledge')).toEqual([]);
    for (const kind of desk) expect(isExplicitlyRouted(kind), kind).toBe(true);
    // The recorded judgments stand: intel_transfer stays under trade (J-INF-7), and the built
    // war-doctrine beats keep their war desk.
    expect(SECTION_OF('intel_transfer')).toBe('trade');
    expect(SECTION_OF('infowar_lie_exposed')).toBe('war');
    expect(SECTION_OF('infowar_spy_exposed')).toBe('war');
  });

  test('A KIND ROUTED TWICE IS REFUSED: every desk kind is one key in the table and one desk everywhere', () => {
    // An object literal with a duplicated key keeps the LAST silently, so the source is read.
    const src = read('src/domain/realm/heraldRouting.js');
    const table = src.slice(src.indexOf('export const EXACT_SECTION'), src.indexOf('export const PREFIX_RULES'));
    const keyCount = (kind) => (codeOf(table).match(new RegExp(`(^|[\\s,{])${kind}:\\s*'`, 'g')) || []).length;
    for (const kind of DESK_AT_COMMIT_1) expect(keyCount(kind), kind).toBe(1);
    // PLANT: a duplicated row is caught by the same reader.
    expect((codeOf(`${table}\n  plant_took: 'war',`).match(/(^|[\s,{])plant_took:\s*'/g) || []).length).toBe(2);
    // Every family registry row of a desk kind declares the same desk the table files it at.
    for (const row of INFORMATION_KIND_REGISTRY) {
      if (row.section !== null) expect(row.section, row.kind).toBe(SECTION_OF(row.kind));
    }
    // The coupling registry's desk moved with the kind in this commit (seam SC-2).
    expect(IN0A_PLANT_HANDOFF_COUPLING.intendedDesk).toBe(SECTION_OF('plant_took'));
  });

  test('THE REFILE (J-INF-6): the real misjudgment beat files at the knowledge desk, recorded as a divergence', () => {
    const [beat] = beliefMisjudgmentNewsEntries([{ id: 'o1', metadata: { misjudgment: {
      observerId: 'a', subjectId: 'b', kinds: ['strength'], confidence01: 0.7,
      believedStrengthBand: 0, trueStrengthBand: 3,
    } } }], (id) => `${id}-town`, 9);
    expect(beat.impactKind).toBe('belief_misjudgment');
    expect(heraldSectionOfRecord(beat)).toBe('knowledge');
    expect(toHeraldItem(beat).section).toBe('knowledge');
    // The letter still files it under `traditions`; the Herald's divergence is recorded, not silent.
    expect(KIND_SECTION.belief_misjudgment).toBe('traditions');
    expect(KIND_SECTION_DIVERGENCES.belief_misjudgment).toBe('knowledge');
  });

  test('the audited consumers carry the new member: a fallback headline, a reason label, a channel', () => {
    for (const section of HERALD_SECTIONS) {
      expect(HEADLINE_TEMPLATES[section], section).toBeTruthy();
      expect(HERALD_SECTION_CHANNEL[section], section).toBeTruthy();
    }
    expect(HEADLINE_TEMPLATES.knowledge.reasonLabel).toBe('Grounds');
    expect(HERALD_SECTION_CHANNEL.knowledge).toBe('politics');
    expect(toHeraldItem({ id: 'x', impactKind: 'plant_took' }).headline).toBe('A matter of what the realm believes');
  });

  test('THE EXECUTED CONSUMER CENSUS: every src reader of the section vocabulary, dispositioned', () => {
    // A file is a reader when its CODE names HERALD_SECTIONS or hand-spells the section list
    // (both structural desks by name among its members). ELEVEN at FP IN-5, measured.
    const readers = walk(join(ROOT, 'src')).filter((abs) => {
      const code = codeOf(readFileSync(abs, 'utf8'));
      return /\bHERALD_SECTIONS\b/.test(code)
        || (['war', 'faith', 'trade', 'events', 'divination', 'adjudication']
          .every((token) => new RegExp(`['"\`]?\\b${token}\\b['"\`]?\\s*[:,\\]}|]`).test(code)));
    }).map((abs) => relative(ROOT, abs).replace(/\\/g, '/')).sort();
    const COVERED = [
      'src/components/map/HeraldBody.jsx', 'src/components/map/RealmInspector.jsx',
      'src/components/map/heraldFeed.js', 'src/components/map/heraldGrammar.js',
      'src/domain/realm/heraldRouting.js', 'src/domain/region/wizardNews.js',
      'src/domain/worldPulse/brokerageStamps.js',
    ];
    // The flag-gated command view (G-4a): its topic table is in a hot file (593 of 600
    // effective, SR-3), so its knowledge topic is slotted, not built; knowledge items read in
    // its all-topics list meanwhile.
    const SLOTTED = [
      'src/components/map/HeraldCommandBody.jsx', 'src/components/map/heraldCommandNavigation.js',
      'src/components/map/heraldCommandSourceParity.js',
    ];
    // A family registry spelling its own two desks, not the section list.
    const NOT_AFFECTED = ['src/domain/worldPulse/eventProse.js'];
    expect(readers).toEqual([...COVERED, ...SLOTTED, ...NOT_AFFECTED].sort());
    expect(readers).toHaveLength(11);
    for (const rel of COVERED) expect(/\bknowledge\b/.test(codeOf(read(rel))), rel).toBe(true);
  });

  test('SECTION TOKENS ARE NOT DECREE-ADDRESSABLE (R-31, measured): no decree vocabulary can name a desk', () => {
    const enumValues = [];
    for (const catalogue of [OP_TYPES, DIRECTION_OP_TYPES, OFF_STAGE_OP_TYPES]) {
      for (const row of Object.values(catalogue)) {
        for (const spec of Object.values(row.payload || {})) {
          if (Array.isArray(spec?.values)) enumValues.push(...spec.values.map(String));
        }
      }
    }
    for (const row of Object.values(REALM_MANIFEST)) {
      for (const dial of row.dials || []) {
        if (Array.isArray(dial.options)) enumValues.push(...dial.options.map((o) => String(o?.value ?? o)));
      }
    }
    // Non-vacuous: the census reached the decree vocabularies (17 enum payloads and 3 option dials).
    expect(enumValues.length).toBeGreaterThan(40);
    expect(enumValues.filter((value) => HERALD_SECTIONS.includes(value))).toEqual([]);
    // CONTROL: the same filter convicts a payload that did enumerate a desk.
    expect([...enumValues, 'knowledge'].filter((value) => HERALD_SECTIONS.includes(value))).toEqual(['knowledge']);
    // And no decree module imports the vocabulary's owner, which is how a payload would name it.
    const decreeModules = [...walk(join(ROOT, 'src/domain/edit')), join(ROOT, 'src/domain/events/realmManifest.js')];
    const importers = decreeModules.filter((abs) => /heraldRouting/.test(codeOf(readFileSync(abs, 'utf8'))));
    expect(importers).toEqual([]);
  });
});
