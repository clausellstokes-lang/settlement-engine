/**
 * heraldRouting.walker.test.js — THE HERALD ROUTING TOTALITY WALKER.
 *
 * The load-bearing pin for src/domain/realm/heraldRouting.js: it proves the routing
 * table is TOTAL (every event vocabulary the engine mints is filed under exactly one
 * Herald section — no orphan), SINGLE-HOME (a function; `events` is the explicit
 * catch-all, never a silent fall-through for a KNOWN token), and CONSISTENT with the
 * precedent KIND_SECTION (chroniclersLetter.js) modulo the recorded divergences.
 *
 * DISCOVERY IS AUTOMATIC, CLASSIFICATION IS MANUAL (structural-prevention §2). The
 * producer vocabularies are gathered two ways, exceeding the two existing walkers'
 * declared blind spots:
 *   (a) a NODE matchAll source scan of every `candidateType: '…'` / `impactKind: '…'`
 *       literal across src/domain (NOT a shell grep — BSD grep silently dropped a
 *       member, faction_rival_power_contest, in recon); plus
 *   (b) the frozen producer constants, with the template families expanded over their
 *       closed domains (stressor_birth_${type}, npc_${family}, party_${kind},
 *       realm_verb_${verb}, table_${kind}, realm_${type}, condition archetypes,
 *       relationship types, channel types, deity tiers).
 * A NEW minted kind, or a base domain that grows, makes a member unrouted → RED,
 * forcing a human to file it in heraldRouting.js.
 *
 * @enforced-module src/domain/realm/heraldRouting.js
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  HERALD_SECTIONS,
  EXACT_SECTION,
  SECTION_OF,
  isExplicitlyRouted,
  routingKeyOf,
  heraldSectionOfRecord,
  KIND_SECTION_CORRESPONDENCE,
  KIND_SECTION_DIVERGENCES,
} from '../../src/domain/realm/heraldRouting.js';

// The frozen producer vocabularies (test-time imports only — never dragged into the
// lazy inspector chunk; heraldRouting.js itself imports none of these).
import { STRESSOR_CATALOG } from '../../src/domain/worldPulse/stressorsCore.js';
import { NPC_ACTION_FAMILIES } from '../../src/domain/worldPulse/npcAgency.js';
import { PARTY_IMPACT_KINDS } from '../../src/domain/worldPulse/partyImpactKinds.js';
import {
  PRIMARY_RELATIONSHIP_TYPES,
  SECONDARY_RELATIONSHIP_STATUSES,
} from '../../src/domain/worldPulse/relationshipCompatibility.js';
import { CONDITION_ARCHETYPE_TEMPLATES } from '../../src/domain/activeConditions.js';
import { WAR_LAYER_ARCHETYPES } from '../../src/domain/worldPulse/archetypeCatalog.js';
import { REALM_MANIFEST } from '../../src/domain/events/realmManifest.js';
import { TABLE_EVENT_KINDS } from '../../src/domain/tableEvents.js';
import { REGIONAL_CHANNEL_TYPES } from '../../src/domain/region/graph.js';
import { DEITY_TIER_KEYS } from '../../src/domain/customContentSchema.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { KIND_SECTION } from '../../src/domain/display/chroniclersLetter.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOMAIN = join(ROOT, 'src', 'domain');
const SECTION_SET = new Set(HERALD_SECTIONS);

/** Recurse the domain tree (skipping tests) — the exact idiom impactKindWalkers uses. */
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

const IMPACT_RE = /impactKind:\s*['"]([a-z][a-z0-9_]*)['"]/g;
const CANDIDATE_RE = /candidateType:\s*['"]([a-z][a-z0-9_]*)['"]/g;

/** Every quoted candidateType / impactKind literal minted anywhere in src/domain. */
function scannedLiterals() {
  const kinds = new Set();
  for (const abs of walk(DOMAIN)) {
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(IMPACT_RE)) kinds.add(m[1]);
    for (const m of src.matchAll(CANDIDATE_RE)) kinds.add(m[1]);
  }
  return [...kinds].sort();
}

/** The 14 proposalPayload.kind values (curated from the recon census — the consumer
 *  switch handles only 7 + fallback, so a raw scan of `kind:` would be noise). */
const PROPOSAL_KINDS = Object.freeze([
  'tier_change', 'relationship_label_change', 'npc_action', 'government_change',
  'institution_suppression', 'institution_capture', 'faction_power_shift',
  'settlement_terminal_death', 'settlement_resettled', 'siege_initiation',
  'realm_verb_order', 'institution_closure', 'institution_founding', 'institution_build',
]);

/** Expand a template family over a closed base domain. */
function expand(prefix, bases) { return bases.map((b) => `${prefix}${b}`); }

describe('Herald routing table — totality + single-home + consistency', () => {
  test('the six sections are exactly the frozen set', () => {
    expect(HERALD_SECTIONS).toEqual(['war', 'faith', 'trade', 'events', 'divination', 'adjudication']);
  });

  test('the mint scan is non-vacuous (the source scan actually reached the producers)', () => {
    const scanned = scannedLiterals();
    expect(scanned.length).toBeGreaterThan(60);
    // the recon canary BSD grep dropped — proves the matchAll scan sees it.
    expect(scanned).toContain('faction_rival_power_contest');
  });

  test('SECTION_OF is total — every EXACT_SECTION value is a real section, never adjudication', () => {
    const bad = Object.entries(EXACT_SECTION).filter(([, v]) => !SECTION_SET.has(v) || v === 'adjudication');
    expect(bad).toEqual([]);
    // an unknown string lands in the explicit catch-all (totality floor).
    expect(SECTION_OF('a_kind_that_will_never_exist_zzz')).toBe('events');
    // SECTION_OF never emits adjudication for any token (adjudication is structural).
    const emits = new Set(Object.keys(EXACT_SECTION).map(SECTION_OF));
    expect(emits.has('adjudication')).toBe(false);
  });

  test('every scanned candidateType/impactKind literal is EXPLICITLY routed (no orphan)', () => {
    const unrouted = scannedLiterals().filter((k) => !isExplicitlyRouted(k));
    // To comply: file the token in src/domain/realm/heraldRouting.js (an exact entry
    // or a family prefix), never leave it to the silent catch-all.
    expect(unrouted).toEqual([]);
  });

  test('every WHAT_PHRASES impactKind (the broad importable superset) is explicitly routed', () => {
    const unrouted = Object.keys(WHAT_PHRASES).filter((k) => !isExplicitlyRouted(k));
    expect(unrouted).toEqual([]);
  });

  test('every stressor type + its lifecycle expansions are explicitly routed', () => {
    const types = Object.keys(STRESSOR_CATALOG).concat(['regional_pressure']);
    const tokens = [
      ...types,
      ...expand('stressor_birth_', types),
      ...expand('stressor_escalate_', types),
      ...expand('stressor_spread_', types),
      ...expand('realm_', types),
    ];
    const unrouted = tokens.filter((k) => !isExplicitlyRouted(k));
    expect(unrouted).toEqual([]);
  });

  test('every condition archetype + war-layer archetype is explicitly routed', () => {
    const archetypes = [...Object.keys(CONDITION_ARCHETYPE_TEMPLATES), ...WAR_LAYER_ARCHETYPES];
    const unrouted = archetypes.filter((k) => !isExplicitlyRouted(k));
    expect(unrouted).toEqual([]);
  });

  test('every template family expansion (npc / party / realm-verb / table) is explicitly routed', () => {
    const tokens = [
      ...expand('npc_', Object.keys(NPC_ACTION_FAMILIES)),
      ...expand('party_', Object.keys(PARTY_IMPACT_KINDS)),
      ...expand('realm_verb_', Object.keys(REALM_MANIFEST).map((v) => v.toLowerCase())),
      ...expand('table_', TABLE_EVENT_KINDS.map((k) => k.replace(/-/g, '_'))),
    ];
    const unrouted = tokens.filter((k) => !isExplicitlyRouted(k));
    expect(unrouted).toEqual([]);
  });

  test('every relationship type, channel type, deity tier, and proposal kind is explicitly routed', () => {
    const tokens = [
      ...PRIMARY_RELATIONSHIP_TYPES,
      ...Object.keys(SECONDARY_RELATIONSHIP_STATUSES),
      ...REGIONAL_CHANNEL_TYPES,
      ...DEITY_TIER_KEYS,
      ...PROPOSAL_KINDS,
    ];
    const unrouted = tokens.filter((k) => !isExplicitlyRouted(k));
    expect(unrouted).toEqual([]);
  });

  test('consistent with the KIND_SECTION precedent, modulo the recorded divergences', () => {
    // wars → war, courts → events, trade → trade, mercy → events; traditions SPLITS
    // (faith | events, both acceptable). A silent disagreement outside
    // KIND_SECTION_DIVERGENCES is a bug.
    const drift = [];
    for (const [kind, letterSection] of Object.entries(KIND_SECTION)) {
      const successor = KIND_SECTION_CORRESPONDENCE[letterSection];
      const got = SECTION_OF(kind);
      if (kind in KIND_SECTION_DIVERGENCES) {
        if (got !== KIND_SECTION_DIVERGENCES[kind]) drift.push(`${kind}: divergence says ${KIND_SECTION_DIVERGENCES[kind]}, got ${got}`);
        continue;
      }
      if (successor === 'split') {
        if (got !== 'faith' && got !== 'events') drift.push(`${kind}: traditions must split to faith|events, got ${got}`);
        continue;
      }
      if (got !== successor) drift.push(`${kind}: expected ${successor} (from letter '${letterSection}'), got ${got} — add to KIND_SECTION_DIVERGENCES if intended`);
    }
    expect(drift).toEqual([]);
  });

  test('every KIND_SECTION key is itself explicitly routed (drift coverage)', () => {
    const unrouted = Object.keys(KIND_SECTION).filter((k) => !isExplicitlyRouted(k));
    expect(unrouted).toEqual([]);
  });

  test('every recorded divergence names a real KIND_SECTION key (no stale divergence)', () => {
    const stale = Object.keys(KIND_SECTION_DIVERGENCES).filter((k) => !(k in KIND_SECTION));
    expect(stale).toEqual([]);
  });

  describe('heraldSectionOfRecord — structural precedence', () => {
    test('a pending proposal files under adjudication regardless of inner kind', () => {
      expect(heraldSectionOfRecord({ status: 'pending', outcome: { impactKind: 'war_mobilization' } })).toBe('adjudication');
    });
    test('a resolved ruling files under adjudication (the decisions log)', () => {
      expect(heraldSectionOfRecord({ status: 'resolved', outcome: { candidateType: 'coup_succeeded' } })).toBe('adjudication');
    });
    test('an emerging-stage stressor files under divination (forecast)', () => {
      expect(heraldSectionOfRecord({ stressor: { type: 'siege', lifecycleStage: 'emerging' } })).toBe('divination');
    });
    test('an ordinary realized outcome files by content via SECTION_OF', () => {
      expect(heraldSectionOfRecord({ outcome: { impactKind: 'pantheon_ascendancy' } })).toBe('faith');
      expect(heraldSectionOfRecord({ impactKind: 'harvest' })).toBe('trade');
      expect(heraldSectionOfRecord({ candidateType: 'war_levy' })).toBe('war');
    });
    test('routingKeyOf prefers structured nature fields, never the prose headline', () => {
      expect(routingKeyOf({ headline: 'A great siege', impactKind: 'roads' })).toBe('roads');
      expect(routingKeyOf({ outcome: { candidateType: 'conquest' } })).toBe('conquest');
      expect(routingKeyOf({ stressor: { type: 'famine' } })).toBe('famine');
    });
  });
});
