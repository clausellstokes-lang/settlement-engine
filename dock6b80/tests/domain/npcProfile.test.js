/**
 * tests/domain/npcProfile.test.js — Structured NPC profile contract.
 *
 * Pins the Tier 4.5 derivation surface: category → archetype mapping,
 * institution / faction linkage inference, removal-consequence
 * forecasts per archetype × rank, primary-relationship surfacing,
 * idempotence, lossless legacy-field carry-through.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveNpcProfile,
  deriveAllNpcProfiles,
  npcArchetypeBreakdown,
  dominantNpcRemovalImpact,
  normalizeNpcRank,
  institutionsForCategory,
  institutionsForPower,
} from '../../src/domain/npcProfile.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';

// ── Sample NPCs ─────────────────────────────────────────────────────────

function militaryCaptain(over = {}) {
  return {
    id: 'npc_2',
    name: 'Beatrix Becker',
    role: 'Guard Captain',
    category: 'military',
    factionAffiliation: 'Military/Guard',
    structuralPosition: 'Commands enforcement capacity where civilian governance is failing.',
    structuralRank: 'dominant',
    influence: 'high',
    power: 9,
    goal: {
      short: 'Maintain operational cohesion while the chain of command is ambiguous.',
      long: 'Rebuild guard morale after years of under-funding.',
    },
    secret: {
      what: 'Has been delaying vital information from reaching the council.',
      stakes: 'When the consequences emerge, the delay will be traced.',
    },
    plotHooks: [
      'A weapons cache they were responsible for is smaller than it should be.',
      'Someone is paying their soldiers more than their salary.',
    ],
    ...over,
  };
}

function templeHighPriest(over = {}) {
  return {
    id: 'npc_3',
    name: 'Sister Vaela',
    role: 'High Priestess',
    category: 'religious',
    factionAffiliation: 'Religious Authorities',
    structuralRank: 'dominant',
    influence: 'high',
    power: 8,
    goal: { short: 'Expand the relief role.', long: 'Cement temple authority over public welfare.' },
    secret: { what: 'Took a deal with the merchant guild.', stakes: 'Discovery would shatter trust.' },
    plotHooks: ['The relief queues are growing daily.'],
    ...over,
  };
}

function minorTraderNpc(over = {}) {
  return {
    id: 'npc_7',
    name: 'Oren the Quiet',
    role: 'Stall Keeper',
    category: 'economy',
    factionAffiliation: 'Merchant Guilds',
    structuralRank: 'minor',
    influence: 'low',
    power: 3,
    goal: { short: 'Keep his stall', long: 'Buy his brother out of debt.' },
    plotHooks: [],
    ...over,
  };
}

// ── deriveNpcProfile (single NPC) ───────────────────────────────────────

describe('[domain-top-state-4] NPC rank vocabulary — generator → NpcRank palette translation', () => {
  const NPC_RANK_UNION = ['dominant', 'secondary', 'minor']; // the NpcRank union + palette keys
  const GENERATOR_RANKS = ['dominant', 'subordinate'];       // npcStructure.getRank's output set

  it('RATCHET: every generator rank normalizes INTO the NpcRank union', () => {
    for (const r of GENERATOR_RANKS) expect(NPC_RANK_UNION).toContain(normalizeNpcRank(r));
    // absent / unknown / numeric-legacy ranks collapse to 'minor' — never escape the union, never crash
    for (const r of [undefined, null, '', 'bogus', 3, 0]) expect(NPC_RANK_UNION).toContain(normalizeNpcRank(r));
  });

  it("maps the generator's 'subordinate' onto the 'secondary' tier (the previously-dead palette)", () => {
    expect(normalizeNpcRank('subordinate')).toBe('secondary');
    expect(normalizeNpcRank('SUBORDINATE')).toBe('secondary'); // case-insensitive
    expect(normalizeNpcRank('dominant')).toBe('dominant');
    expect(normalizeNpcRank('minor')).toBe('minor');
  });

  it('a numeric legacy structuralRank does not crash toLowerCase and reads as minor', () => {
    expect(() => normalizeNpcRank(3)).not.toThrow();
    expect(normalizeNpcRank(3)).toBe('minor');
  });

  it("a 'subordinate' NPC now surfaces rank 'secondary' and draws the LIVE secondary palette (distinct from minor)", () => {
    const secondary = deriveNpcProfile(militaryCaptain({ structuralRank: 'subordinate' }));
    const minor     = deriveNpcProfile(militaryCaptain({ structuralRank: 'minor' }));
    expect(secondary.rank).toBe('secondary');
    expect(secondary.consequenceIfRemoved.severity).toBe('secondary');
    expect(secondary.consequenceIfRemoved.consequences.length).toBeGreaterThan(0);
    // the secondary tier is DISTINCT from minor — proof the palette is reachable, not a fallback
    expect(secondary.consequenceIfRemoved.consequences).not.toEqual(minor.consequenceIfRemoved.consequences);
  });

  it('a numeric structuralRank through deriveNpcProfile does not throw and reads minor', () => {
    const p = deriveNpcProfile(militaryCaptain({ structuralRank: 3 }));
    expect(p.rank).toBe('minor');
    expect(p.consequenceIfRemoved.severity).toBe('minor');
  });
});

describe('deriveNpcProfile()', () => {
  it('produces all canonical fields on a rich NPC', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    expect(profile.id).toBe('npc_2');
    expect(profile.name).toBe('Beatrix Becker');
    expect(profile.archetype).toBe('military');
    expect(profile.rank).toBe('dominant');
    expect(profile.factionLink).toBe('faction.military_guard');
    expect(profile.leverage.length).toBeGreaterThan(0);
    expect(profile.vulnerabilities.length).toBeGreaterThan(0);
    expect(profile.consequenceIfRemoved).toBeTruthy();
    expect(profile.consequenceIfRemoved.severity).toBe('dominant');
    expect(profile.consequenceIfRemoved.consequences.length).toBeGreaterThan(0);
  });

  it('maps category to canonical faction archetype', () => {
    expect(deriveNpcProfile(militaryCaptain()).archetype).toBe('military');
    expect(deriveNpcProfile(templeHighPriest()).archetype).toBe('religious');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'economy' }).archetype).toBe('merchant');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'craft' }).archetype).toBe('craft');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'criminal' }).archetype).toBe('criminal');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'arcane' }).archetype).toBe('arcane');
    expect(deriveNpcProfile({ id: 'x', name: 'X', category: 'unknown' }).archetype).toBe('other');
  });

  it('factionLink derives a stable id from factionAffiliation', () => {
    expect(deriveNpcProfile(militaryCaptain()).factionLink).toBe('faction.military_guard');
    expect(deriveNpcProfile(templeHighPriest()).factionLink).toBe('faction.religious_authorities');
    expect(deriveNpcProfile({ id: 'x', name: 'X', factionAffiliation: '' }).factionLink).toBeNull();
  });

  it('inferences institutionLink from settlement institutions when available', () => {
    const settlement = {
      institutions: [
        { name: 'Town Watch' },
        { name: 'Royal Mill' },
      ],
    };
    expect(deriveNpcProfile(militaryCaptain(), settlement).institutionLink).toBe('institution.town_watch');
  });

  it('institutionLink is null when no matching institution exists', () => {
    expect(deriveNpcProfile(militaryCaptain(), { institutions: [] }).institutionLink).toBeNull();
  });

  it('resolves institutionLink for the generator-emitted categories via the archetype normalizer', () => {
    const settlement = {
      institutions: [
        { name: 'Blacksmith Forge' },
        { name: 'Arcane College' },
        { name: 'Town Council' },
      ],
    };
    // 'crafts' → craft archetype → forge/smithy hint
    expect(deriveNpcProfile({ id: 'c', name: 'Smith', category: 'crafts' }, settlement).institutionLink)
      .toBe('institution.blacksmith_forge');
    // 'magic' → arcane archetype → college/mage hint
    expect(deriveNpcProfile({ id: 'm', name: 'Archmage', category: 'magic' }, settlement).institutionLink)
      .toBe('institution.arcane_college');
    // 'noble' → government archetype → council/hall hint
    expect(deriveNpcProfile({ id: 'n', name: 'Baron', category: 'noble' }, settlement).institutionLink)
      .toBe('institution.town_council');
  });

  it('vulnerabilities include the secret-driven exposure when a secret is present', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    const hasSecretLine = profile.vulnerabilities.some(v => v.includes('Secret-driven exposure'));
    expect(hasSecretLine).toBe(true);
  });

  it('vulnerabilities omit the secret line when no secret is present', () => {
    const profile = deriveNpcProfile({ ...militaryCaptain(), secret: undefined });
    const hasSecretLine = profile.vulnerabilities.some(v => v.includes('Secret-driven exposure'));
    expect(hasSecretLine).toBe(false);
  });

  it('publicReputation falls through structuralPosition → presentation → role', () => {
    expect(deriveNpcProfile(militaryCaptain()).publicReputation)
      .toContain('Commands enforcement capacity');
    expect(deriveNpcProfile({ id: 'x', name: 'X', role: 'Innkeeper' }).publicReputation)
      .toContain('Innkeeper');
    expect(deriveNpcProfile({ id: 'x', name: 'X' }).publicReputation).toBeNull();
  });

  it('privateAgenda prefers goal.long but falls back to goal.short', () => {
    expect(deriveNpcProfile(militaryCaptain()).privateAgenda).toContain('Rebuild guard morale');
    expect(deriveNpcProfile({ id: 'x', name: 'X', goal: { short: 'just survive' } }).privateAgenda)
      .toBe('just survive');
  });

  it('offerToPlayers takes the first two plot hooks', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    expect(profile.offerToPlayers.length).toBe(2);
    expect(profile.offerToPlayers[0]).toContain('weapons cache');
  });

  it('returns null for nullish input', () => {
    expect(deriveNpcProfile(null)).toBeNull();
    expect(deriveNpcProfile(undefined)).toBeNull();
  });

  it('does not mutate the input', () => {
    const input = militaryCaptain();
    const before = JSON.stringify(input);
    deriveNpcProfile(input, { institutions: [{ name: 'Town Watch' }] });
    expect(JSON.stringify(input)).toBe(before);
  });

  it('leverage / vulnerabilities are fresh clones (mutating return does not pollute template)', () => {
    const a = deriveNpcProfile(militaryCaptain());
    a.leverage.push('mutate me');
    a.vulnerabilities.push('mutate me too');
    const b = deriveNpcProfile(militaryCaptain());
    expect(b.leverage).not.toContain('mutate me');
    expect(b.vulnerabilities).not.toContain('mutate me too');
  });
});

// ── Corruption truth (cohesion wave 6#6) ────────────────────────────────
// The corruption pass + world-pulse mirror write corrupt / corruptionVector /
// timesExposed / ousted onto raw NPCs, and the dossier card renders them raw.
// The structured profile must carry the same four fields — and they must
// never reach the public-safe projection (the npc allowlist excludes them).

describe('corruption truth fields', () => {
  it('carries corrupt / corruptionVector / timesExposed / ousted from the raw NPC', () => {
    const profile = deriveNpcProfile(militaryCaptain({
      corrupt: true, corruptionVector: 'greed', timesExposed: 2, ousted: true,
    }));
    expect(profile.corrupt).toBe(true);
    expect(profile.corruptionVector).toBe('greed');
    expect(profile.timesExposed).toBe(2);
    expect(profile.ousted).toBe(true);
  });

  it('preserves an explicit generation-time corrupt:false verdict', () => {
    const profile = deriveNpcProfile(militaryCaptain({ corrupt: false }));
    expect(profile.corrupt).toBe(false);
    expect(profile.corruptionVector).toBeNull();
    expect(profile.timesExposed).toBe(0);
    expect(profile.ousted).toBe(false);
  });

  it('a legacy save the corruption pass never judged stays tri-state null', () => {
    const profile = deriveNpcProfile(militaryCaptain()); // fixture carries no corruption fields
    expect(profile.corrupt).toBeNull();
    expect(profile.corruptionVector).toBeNull();
    expect(profile.timesExposed).toBe(0);
    expect(profile.ousted).toBe(false);
  });

  it('publicSafe: raw corruption fields never reach the public npc allowlist', () => {
    const out = toPublicSafe({
      npcs: [militaryCaptain({ corrupt: true, corruptionVector: 'greed', timesExposed: 2, ousted: true })],
    });
    expect(out.npcs).toHaveLength(1);
    for (const k of ['corrupt', 'corruptionVector', 'timesExposed', 'ousted']) {
      expect(out.npcs[0][k]).toBeUndefined();
    }
  });
});

// ── Consequence-if-removed forecasts ────────────────────────────────────

describe('consequenceIfRemoved', () => {
  it('a dominant military NPC produces multiple severe consequences', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    expect(profile.consequenceIfRemoved.severity).toBe('dominant');
    expect(profile.consequenceIfRemoved.consequences.length).toBeGreaterThanOrEqual(3);
    // Military removal should reference watch / patrols.
    const text = profile.consequenceIfRemoved.consequences.join(' ');
    expect(text).toMatch(/watch|patrol/i);
  });

  it('a minor NPC produces a single trivial consequence', () => {
    const profile = deriveNpcProfile(minorTraderNpc());
    expect(profile.consequenceIfRemoved.severity).toBe('minor');
    expect(profile.consequenceIfRemoved.consequences.length).toBeGreaterThan(0);
    expect(profile.consequenceIfRemoved.consequences.length).toBeLessThan(3);
  });

  it('a dominant religious NPC consequences mention relief / legitimacy', () => {
    const profile = deriveNpcProfile(templeHighPriest());
    const text = profile.consequenceIfRemoved.consequences.join(' ');
    expect(text).toMatch(/relief|legitimacy|mourning|moral/i);
  });

  it('unknown archetype falls back to "other" consequences', () => {
    const profile = deriveNpcProfile({
      id: 'x', name: 'X', category: 'mystery', structuralRank: 'dominant',
    });
    expect(profile.archetype).toBe('other');
    expect(profile.consequenceIfRemoved.consequences.length).toBeGreaterThan(0);
  });

  it('unknown rank falls back to minor consequences', () => {
    const profile = deriveNpcProfile({
      id: 'x', name: 'X', category: 'military', structuralRank: undefined,
    });
    expect(profile.rank).toBe('minor');
    expect(profile.consequenceIfRemoved.severity).toBe('minor');
  });

  it('a numeric structuralRank does not crash the derivation', () => {
    // The schema unions structuralRank as string|number; a legacy NPC with a
    // numeric rank must not blow up `.toLowerCase()` and take down the whole
    // causal-substrate derivation. It resolves to no keyed tier → the minor
    // consequence set.
    let profile;
    expect(() => {
      profile = deriveNpcProfile({
        id: 'x', name: 'X', category: 'military', structuralRank: 2,
      });
    }).not.toThrow();
    expect(profile.consequenceIfRemoved.consequences.length).toBeGreaterThan(0);
  });

  it("a subordinate-rank NPC reads the mid tier (now keyed 'secondary'), not minor", () => {
    // getRank (npcStructure.js) emits 'dominant' | 'subordinate' — the mid tier.
    // COMPOSITE vocabulary migration (2026-07-18, declared): the tier key follows
    // normalizeNpcRank's palette vocabulary ('secondary'); the tier CONTENT below
    // is asserted unchanged — the rename moved the label, never the consequences.
    const profile = deriveNpcProfile(militaryCaptain({ structuralRank: 'subordinate' }));
    expect(profile.consequenceIfRemoved.severity).toBe('secondary');
    const cons = profile.consequenceIfRemoved.consequences;
    // The subordinate military tier has two lines; the minor tier has one.
    expect(cons.length).toBe(2);
    expect(cons.join(' ')).toMatch(/captain loses their reporting line|subordinate moves up/i);
    // Guard against regressing to the minor tier's single line.
    expect(cons.join(' ')).not.toMatch(/a guard or two notice/i);
  });
});

// ── Primary relationship inference ──────────────────────────────────────

describe('primaryRelationship', () => {
  const sampleRelationships = [
    {
      type: 'ally',
      typeName: 'Pragmatic Alliance',
      description: 'They work together because the alternative is worse.',
      tension: 'A third party is destabilizing the calculation.',
      npc1Id: 'npc_2', npc2Id: 'npc_3',
      npc1N: 'Beatrix Becker', npc2N: 'Sister Vaela',
    },
  ];

  it('surfaces a relationship for an NPC who has one', () => {
    const profile = deriveNpcProfile(militaryCaptain(), { relationships: sampleRelationships });
    expect(profile.primaryRelationship).toBeTruthy();
    expect(profile.primaryRelationship.otherName).toBe('Sister Vaela');
    expect(profile.primaryRelationship.tension).toContain('third party');
  });

  it('returns null when no relationships involve this NPC', () => {
    const profile = deriveNpcProfile({ ...militaryCaptain(), id: 'npc_99' },
                                     { relationships: sampleRelationships });
    expect(profile.primaryRelationship).toBeNull();
  });

  it('returns null when settlement has no relationships', () => {
    const profile = deriveNpcProfile(militaryCaptain());
    expect(profile.primaryRelationship).toBeNull();
  });
});

// ── deriveAllNpcProfiles + diagnostics ─────────────────────────────────

describe('deriveAllNpcProfiles()', () => {
  it('maps every NPC on the settlement to a profile', () => {
    const settlement = {
      npcs: [militaryCaptain(), templeHighPriest(), minorTraderNpc()],
    };
    const profiles = deriveAllNpcProfiles(settlement);
    expect(profiles).toHaveLength(3);
    expect(profiles[0].archetype).toBe('military');
    expect(profiles[1].archetype).toBe('religious');
    expect(profiles[2].archetype).toBe('merchant');
  });

  it('returns [] for a settlement with no NPCs', () => {
    expect(deriveAllNpcProfiles({})).toEqual([]);
    expect(deriveAllNpcProfiles(null)).toEqual([]);
  });

  it('filters out nullish entries gracefully', () => {
    const settlement = { npcs: [militaryCaptain(), null, undefined, templeHighPriest()] };
    expect(deriveAllNpcProfiles(settlement)).toHaveLength(2);
  });
});

describe('npcArchetypeBreakdown()', () => {
  it('counts NPCs by archetype', () => {
    const settlement = {
      npcs: [
        militaryCaptain(),
        templeHighPriest(),
        minorTraderNpc(),
        { id: 'x', name: 'X', category: 'criminal' },
      ],
    };
    const breakdown = npcArchetypeBreakdown(settlement);
    expect(breakdown.military).toBe(1);
    expect(breakdown.religious).toBe(1);
    expect(breakdown.merchant).toBe(1);
    expect(breakdown.criminal).toBe(1);
    expect(breakdown.government).toBe(0);
  });
});

describe('dominantNpcRemovalImpact()', () => {
  it('aggregates consequences across every dominant-rank NPC', () => {
    const settlement = {
      npcs: [militaryCaptain(), templeHighPriest(), minorTraderNpc()],
    };
    const impact = dominantNpcRemovalImpact(settlement);
    // The two dominant NPCs each contribute multiple consequences;
    // the minor trader contributes none to this list.
    expect(impact.length).toBeGreaterThanOrEqual(6);
    const archetypes = new Set(impact.map(i => i.archetype));
    expect(archetypes.has('military')).toBe(true);
    expect(archetypes.has('religious')).toBe(true);
    expect(archetypes.has('merchant')).toBe(false);  // merchant NPC is minor rank
  });

  it('returns [] when no dominant NPCs are present', () => {
    expect(dominantNpcRemovalImpact({ npcs: [minorTraderNpc()] })).toEqual([]);
  });
});

// ── The criminal institution vocabulary is a WORD test, not a substring test ──
//
// TE-CH-7. `criminal: /tavern|den|gang|black\s+market/i` was spelled TWICE in
// src/domain/npcProfile.js: once in the archetype-keyed CATEGORY_INSTITUTION_HINTS that
// decides an NPC's institutionLink, and once in the UI-only POWER_DOMAIN_HINTS that draws
// a power's institutional footprint. The two copies were byte-identical, and the bare
// `den` alternate is a SUBSTRING test. Over the 276 live catalog institution names it
// matched four rows that are not criminal in any reading -- 'Resident smith (part-time)',
// 'Priest (resident)', "Warden's Lodge" and 'Dragon resident' -- so a criminal NPC in an
// ordinary village resolved institutionLink to `institution.priest_resident`, and the Power
// tab listed a parish priest and a dragon as the criminal power's institutional footprint.
//
// The identical four rows were anchored in a DIFFERENT classifier by an earlier car and the
// cure did not travel here, because the vocabulary is duplicated and nothing pinned the
// copies together. This block is that pin. It is driven from the LIVE catalog rather than a
// hand-written fixture, so a name added to the catalog next week is measured by the same
// assertion, and it asserts EXACT sets rather than absence, so it cannot go vacuous.
//
// DO NOT GENERALISE THE ANCHOR TO SIBLING ROWS. Three other alternates in these tables
// match mid-word ON PURPOSE, and word-anchoring any of them would DELETE a true positive:
// `church` reaches the three 'Parish churches (...)' rows, `broker` reaches 'Pawnbroker',
// `bank` reaches 'Banking houses'/'Banking district'. `den` was the only alternate whose
// mid-word matches were ALL false. Measured both ways before the change.
//
// AND THE ALTERNATION IS STILL LIVE. Anchoring a term can delete a whole category when its
// only match was itself the false positive. Here it does not: 'Gambling den' still reaches
// criminal through `\bdens?\b`, and the test below pins exactly that, so a future author
// cannot "simplify" the dead-looking term away.
//
// SIBLING SITES, MEASURED AND DELIBERATELY OUT OF SCOPE (2026-08-24): a bare `den` also
// stands in src/domain/districtProfile.js (the criminal-district rule) and in
// src/domain/customContent.js (user-typed institution names, where 'The Gardens of Sela',
// 'Maidens Rest' and 'Warden of the Wood' all classify criminal today). Neither is this
// file's vocabulary; the source scan below is therefore scoped to npcProfile.js on purpose.

const NPC_PROFILE_SRC = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/npcProfile.js'),
  'utf8',
);

/** Every canonical catalog institution name, as a settlement the classifiers can read. */
function wholeCatalogAsSettlement() {
  /** @type {Set<string>} */
  const names = new Set();
  for (const tier of Object.values(institutionalCatalog)) {
    for (const group of Object.values(tier)) {
      for (const name of Object.keys(group)) names.add(name);
    }
  }
  return {
    count: names.size,
    settlement: { institutions: [...names].map(name => ({ name, catalogId: catalogIdForName(name) })) },
  };
}

/** The four catalog names the bare `den` swept in, verbatim. */
const DEN_FALSE_POSITIVES = Object.freeze([
  'Resident smith (part-time)',
  'Priest (resident)',
  "Warden's Lodge",
  'Dragon resident',
]);

describe('the criminal institution vocabulary (TE-CH-7)', () => {
  it('the catalog the pin is measured over is the live one, not a fixture', () => {
    // 276 → 280 (2026-08-30, lane TE-RESIDUE-1, ODQ §708.5). RE-MEASURED, not re-worded: the
    // burial-ladder content car added four distinct names (`Burial ground` serves two tiers,
    // plus `Parish burial grounds`, `Burial grounds and charnel house`, `Cemetery network`).
    // None is criminal, so the vocabulary arms below are unmoved — this figure is the
    // non-vacuity anchor that proves they walk the LIVE catalog rather than a fixture, which
    // is exactly why it had to move with it.
    expect(wholeCatalogAsSettlement().count).toBe(280);
  });

  it('criminal name hints reach the criminal catalog institutions and nothing else', () => {
    const { settlement } = wholeCatalogAsSettlement();
    expect(institutionsForCategory('criminal', settlement).sort()).toEqual([
      'Black market',
      'Black market bazaar',
      'Gambling den',
      'Inns and taverns (district)',
      'Street gang',
      'Taverns (5-20)',
    ]);
  });

  it('the den alternate is still LIVE after the anchor, so the anchor did not delete its own category', () => {
    const settlement = { institutions: [{ name: 'Gambling den', catalogId: catalogIdForName('Gambling den') }] };
    expect(institutionsForCategory('criminal', settlement)).toEqual(['Gambling den']);
    expect(deriveNpcProfile({ id: 'v', name: 'Vessa', category: 'criminal' }, settlement).institutionLink)
      .toBe('institution.gambling_den');
  });

  it('a criminal NPC does not take a parish priest, a smith, a lodge or a dragon as a workplace', () => {
    for (const name of DEN_FALSE_POSITIVES) {
      const settlement = { institutions: [{ name, catalogId: catalogIdForName(name) }] };
      expect(
        deriveNpcProfile({ id: 'v', name: 'Vessa', category: 'criminal' }, settlement).institutionLink,
        name + ' is not a criminal institution',
      ).toBeNull();
    }
  });

  it('a real criminal institution wins over an earlier den-shaped false positive', () => {
    // Catalog order puts Religious before Criminal, which is exactly how the defect shipped:
    // inferInstitutionLink takes the FIRST match, so the priest was reached first.
    const settlement = {
      institutions: [
        { name: 'Priest (resident)', catalogId: catalogIdForName('Priest (resident)') },
        { name: 'Gambling den', catalogId: catalogIdForName('Gambling den') },
      ],
    };
    expect(deriveNpcProfile({ id: 'v', name: 'Vessa', category: 'criminal' }, settlement).institutionLink)
      .toBe('institution.gambling_den');
  });

  it('the power tab criminal footprint no longer carries the den-shaped false positives', () => {
    const { settlement } = wholeCatalogAsSettlement();
    const byName = institutionsForPower({ faction: 'The Shadow Hand', category: 'criminal' }, settlement);
    // institutionsForPower unions TAGS with names, so it legitimately holds more rows than
    // the name-only footprint. Every extra row must be TAGGED criminal, never merely
    // den-shaped: the four false positives carry no criminal tag and no criminal name.
    expect(byName.filter(n => DEN_FALSE_POSITIVES.includes(n))).toEqual([]);
    expect(byName).toContain('Gambling den');
  });

  it('the two copies of the criminal vocabulary have not diverged, and both are anchored', () => {
    const rows = NPC_PROFILE_SRC.split('\n').filter(l => /^\s*criminal:\s*\//.test(l));
    expect(rows.length, 'npcProfile.js spells the criminal name vocabulary exactly twice').toBe(2);
    expect(rows[0], 'the two copies must stay byte-identical, which is how a cure travels').toBe(rows[1]);
    const anchored = /\/\\btaverns\?\\b\|\\bdens\?\\b\|\\bgangs\?\\b\|\\bblack\\s\+markets\?\\b\/i/;
    expect(
      rows[0],
      'every alternate must be word-anchored: a bare den is a substring test and reads Resident/Warden as criminal',
    ).toMatch(anchored);
  });
});
