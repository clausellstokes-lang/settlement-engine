/**
 * Narrative-quality corpus invariants.
 *
 * These tests deliberately avoid pinning one seed's prose. They scan a stable
 * matrix of seeds and inputs for classes of defects that can hide in otherwise
 * valid output: unresolved template tokens, doubled articles, lower-case
 * sentence joins, number disagreement, scale drift, and ambiguous NPC names.
 *
 * EPISTEMIC PREVENTION (wave EP-2D, 2026-07-27). Two classes were swept here:
 *   • ANCHORED NEGATIVES — every `not.toMatch` / `not.toContain` in this file now
 *     sits next to a positive that can only hold while the prose it scans is live.
 *     A bare negative against prose that drifted away (a renamed branch, an empty
 *     join, a producer that stopped emitting) is vacuously green forever; the
 *     anchor turns that silent pass into a loud red on the POSITIVE.
 *   • A DERIVED DISTRIBUTION BOUND — the relationship-rumor emission floor is no
 *     longer a hand-picked `> 40`. It is derived from the measured emission rate
 *     at the corpus size, and lives in tests/fixtures/distribution-envelopes.manifest.json
 *     so the bound and its provenance cannot drift apart.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { readEnvelope } from '../helpers/distributionEnvelope.js';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { generateHistory } from '../../src/generators/historyGenerator.js';
import { renderHistoryTemplate } from '../../src/generators/historyTemplate.js';
import {
  generateNPCs,
  generateRelationships,
} from '../../src/generators/npcGenerator.js';
import { disambiguateNPCDisplayNames } from '../../src/generators/npcDisplayNames.js';
import { STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import {
  genRelNarrative,
  genSuccessionNarr,
} from '../../src/generators/power/settlementNarrative.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import { generateEconomicState } from '../../src/generators/economicGenerator.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

/** The one canonical home for this file's derived distribution bounds. */
const ENVELOPES = JSON.parse(readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../fixtures/distribution-envelopes.manifest.json'),
  'utf8',
));

const withSeed = (seed, work) => {
  setActiveRng(createPRNG(seed));
  try {
    return work();
  } finally {
    clearActiveRng();
  }
};

const normalize = value => String(value || '').trim().toLowerCase();

describe('history templates are total across the authored corpus', () => {
  const CURRENT_TENSION_TOKENS = [
    '{building_type}',
    '{demands}',
    '{duration}',
    '{location}',
    '{method}',
    '{quarter}',
    '{resource}',
    '{route_type}',
  ];

  test('the current-tension catalog uses exactly the supported token vocabulary', () => {
    const authoredTokens = [
      ...new Set(
        HISTORICAL_EVENTS_DATA.flatMap(event =>
          event.description.match(/\{[a-z_]+\}/g) || []
        ),
      ),
    ].sort();

    expect(authoredTokens).toEqual(CURRENT_TENSION_TOKENS);
  });

  test('the renderer replaces repeated occurrences, not only the first', () => {
    expect(
      renderHistoryTemplate(
        '{resource} left the market; {resource} returned by winter',
        { '{resource}': 'grain' },
      ),
    ).toBe('grain left the market; grain returned by winter');
  });

  test('route × seed sweep resolves every token-bearing tension without grammar residue', () => {
    const tokenBearingTypes = new Set(
      HISTORICAL_EVENTS_DATA
        .filter(event => /\{[a-z_]+\}/.test(event.description))
        .map(event => event.type),
    );
    const seenTokenBearingTypes = new Set();
    const offenders = [];

    for (const route of ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass']) {
      for (let index = 0; index < 80; index++) {
        const seed = `narrative-history-${route}-${index}`;
        const history = withSeed(seed, () =>
          generateHistory(
            'metropolis',
            {
              _seed: seed,
              settlementAgeMode: 'new',
              tradeRouteAccess: route,
              magicExists: true,
            },
            [],
            { issues: [], stability: 'Stable' },
            {
              primaryExports: ['Amber exports'],
              incomeSources: [{ source: route === 'port' ? 'Port fees' : 'Guild trade' }],
            },
            {
              factions: [
                {
                  faction: 'the town council',
                  category: 'government',
                  isGoverning: true,
                },
              ],
            },
          )
        );

        for (const tension of history.currentTensions || []) {
          if (tokenBearingTypes.has(tension.type)) {
            seenTokenBearingTypes.add(tension.type);
          }
          const text = String(tension.description || '');
          if (
            /\{[a-z_]+\}/.test(text) ||
            /\bthe\s+the\b/i.test(text) ||
            /\bthere is a outstanding\b/i.test(text)
          ) {
            offenders.push({ route, seed, type: tension.type, text });
          }
        }
      }
    }

    expect(
      [...seenTokenBearingTypes].sort(),
      'the deterministic corpus must exercise every token-bearing tension type',
    ).toEqual([...tokenBearingTypes].sort());
    expect(
      offenders,
      `history prose defects:\n${JSON.stringify(offenders.slice(0, 8), null, 2)}`,
    ).toHaveLength(0);
  });
});

describe('sentence boundaries and relationship rumors remain grammatical', () => {
  const baseContext = {
    name: 'Ashholt',
    tier: 'town',
    prosperity: 'Moderate',
    stability: 'Stable',
    isViable: true,
    viabilityIssues: [],
    govFaction: 'the town council',
    topFaction: 'the merchant league',
    topNPCName: 'the reeve',
    topNPCRole: 'reeve',
    milForce: 'the town watch',
    commodity: 'grain',
  };

  test.each([
    ['religious_tension', {}, /The town council has avoided/],
    ['guild_conflict', {}, /The merchant league has held/],
    ['external_threat', {}, /The reeve knows the intelligence/],
    ['external_threat', { neighbor: 'Stoneford' }, /The town council and the town watch/],
    ['resource_scarcity', {}, /The merchant league knows.*The town council has/s],
    ['resource_scarcity', { commodity: null }, /The town council controls the allocation/],
    ['magical_controversy', {}, /The town council is being pressured/],
    ['disputed_land', {}, /The town council has delayed ruling/],
  ])('%s capitalizes values only when they open a sentence', (topTension, overrides, expected) => {
    const prose = genSuccessionNarr({
      ...baseContext,
      topTension,
      ...overrides,
    }).join(' ');

    expect(prose).toMatch(expected);
    // LIVENESS ANCHOR: the negative below scans SENTENCE JOINS. Prose with no join at
    // all satisfies it vacuously — and so does prose that drifted to empty. Assert the
    // joins exist first (every branch measures 2-3 of them), so "no join opens
    // lower-case" is a statement about real joins.
    expect(prose, 'the branch must produce at least one sentence join to scan').toMatch(/[.!?]\s+/);
    // anchored: the two toMatch assertions above prove the prose is live AND that a sentence join actually occurs.
    expect(prose).not.toMatch(/[.!?]\s+[a-z]/);
  });

  test('relationship-rumor variants never form "a outstanding"', () => {
    // The emission floor is DERIVED, not guessed. Measured 2026-07-27 at 400 draws:
    // 229/400 = 57.25% of seeds emit a phrasing, so a 160-draw corpus expects ~91.6
    // with sigma 6.26. The old `> 40` sat 8.1 sigma below the mean — it could not have
    // reddened on anything short of the producer halving twice over.
    const emission = readEnvelope(ENVELOPES, 'narrativeQuality.relationshipRumor.emitted');
    const relationship = {
      type: 'debtor_creditor',
      typeName: 'Outstanding Debt',
      npc1Name: 'Alda Stone',
      npc2Name: 'Marek Vale',
      description: 'Alda owes Marek — the debt is overdue',
      tension: 'Neither believes the original terms still apply.',
    };
    const phrasings = [];

    for (let index = 0; index < emission.n; index++) {
      const rumor = withSeed(`relationship-grammar-${index}`, () =>
        genRelNarrative({
          relationships: [relationship],
          stress: [{ type: 'indebted' }],
        })
      );
      if (rumor?.phrasing) phrasings.push(rumor.phrasing);
    }

    expect(
      phrasings.length,
      `relationship-rumor emission: ${phrasings.length}/${emission.n} draws produced a phrasing; `
      + `the derived floor is ${emission.bound} (base rate ${emission.baseRate}, `
      + `alpha ${emission.alpha}, ${emission.margin} sigma of power). A red here means the `
      + `emission RATE moved, not that a die rolled badly — the corpus is seeded.`,
    ).toBeGreaterThanOrEqual(emission.bound);
    expect(phrasings.some(text => text.includes('best understood as outstanding debt'))).toBe(true);
    const corpus = phrasings.join(`\n`);
    // The derived-floor count above proves the corpus is populated; this proves the
    // "outstanding debt" phrase family is genuinely produced, so the malformed-article
    // scan below is a statement about a construct that actually occurs.
    expect(corpus, 'the outstanding-debt phrase family must be live to scan its article')
      .toMatch(/\boutstanding debt\b/i);
    // anchored: the derived-floor count and the phrase-family toMatch directly above are the liveness anchors.
    expect(corpus).not.toMatch(/\bthere is a outstanding\b/i);
  });
});

describe('safety prose agrees in number and respects settlement scale', () => {
  test('city district-market revenue never claims metropolis scale', () => {
    const economy = withSeed('city-market-scale', () => generateEconomicState(
      'city',
      [{ name: 'District market' }],
      'road',
      {},
      {
        tier: 'city',
        priorityEconomy: 80,
        priorityMilitary: 50,
        priorityReligion: 50,
        priorityMagic: 50,
        priorityCriminal: 50,
      },
    ));
    const marketTaxes = economy.incomeSources.find(
      source => source.source === 'Market Taxes',
    );

    expect(marketTaxes).toBeTruthy();
    // The city-scale wording is the liveness anchor: it fails first if the description
    // drifts, empties, or is re-keyed, so "no metropolis wording" can never pass over
    // an absent description.
    expect(marketTaxes.desc).toMatch(/urban districts/i);
    // anchored: the urban-districts toMatch directly above proves this description is live and city-scaled.
    expect(marketTaxes.desc).not.toMatch(/metropolis scale/i);
  });

  test('a town watch is never promoted to a city watch in prose', () => {
    const profile = generateSafetyProfile(
      {
        priorityEconomy: 80,
        priorityMilitary: 90,
        priorityCriminal: 10,
      },
      'town',
      [{ name: 'Town watch' }],
    );
    const prose = `${profile.safetyDesc} ${profile.guardEffectivenessDesc}`;

    // The prose must NAME the town watch before "and never a city watch" means
    // anything; a safetyDesc that stopped mentioning the watch reds on the anchor.
    expect(prose).toMatch(/\btown watch\b/i);
    // anchored: the town-watch toMatch directly above proves the watch is named at all.
    expect(prose).not.toMatch(/\bcity watch\b/i);
  });

  test('a professional city watch keeps city-scale terminology', () => {
    const profile = generateSafetyProfile(
      {
        priorityEconomy: 80,
        priorityMilitary: 90,
        priorityCriminal: 10,
      },
      'city',
      [{ name: 'Professional city watch' }],
    );
    expect(`${profile.safetyDesc} ${profile.guardEffectivenessDesc}`).toMatch(/\bcity watch\b/i);
  });

  test('singular and plural authority branches choose agreeing predicates', () => {
    const occupiedGarrison = generateSafetyProfile(
      { stressTypes: ['occupied'] },
      'town',
      [{ name: 'Garrison' }],
    );
    // The singular subject takes the singular predicate. The anchor is the CORRECT
    // sentence: if the garrison clause drifts away entirely, the anchor reds instead
    // of the plural-form negative passing over prose that no longer exists.
    expectAbsentWithAnchor(
      occupiedGarrison.safetyDesc,
      'garrison, now under occupier command, enforce curfew',
      'The garrison, now under occupier command, enforces curfew',
      'occupied garrison — singular predicate',
    );

    const occupiedOfficials = generateSafetyProfile(
      { stressTypes: ['occupied'] },
      'town',
      [],
    );
    expect(occupiedOfficials.safetyDesc).toContain('Occupation authorities enforce curfew');
  });

  test('state-control and religious-fraud branches retain subject agreement', () => {
    const authoritarian = generateSafetyProfile(
      {
        priorityEconomy: 0,
        priorityMilitary: 70,
        priorityReligion: 0,
        priorityMagic: 20,
        priorityCriminal: 0,
      },
      'town',
      [{ name: 'Garrison' }],
    );
    expect(authoritarian.flags.stateCrime).toBe(true);
    expectAbsentWithAnchor(
      authoritarian.safetyDesc,
      'The garrison are visible',
      'The garrison is visible everywhere',
      'state-control branch — singular predicate',
    );

    const fraud = generateSafetyProfile(
      {
        priorityEconomy: 0,
        priorityMilitary: 0,
        priorityReligion: 60,
        priorityMagic: 20,
        priorityCriminal: 50,
      },
      'town',
      [
        { name: 'Parish church' },
        { name: "Thieves' guild chapter" },
      ],
    );
    const fraudDesc = fraud.crimeTypes.find(type => type.type === 'Religious fraud')?.desc;
    expect(fraud.flags.religiousFraud).toBe(true);
    expectAbsentWithAnchor(
      fraudDesc,
      'authority provide cover',
      "The church's moral authority provides cover",
      'religious-fraud branch — singular predicate',
    );
  });
});

describe('NPC display identity is unique without perturbing RNG', () => {
  test('role qualifiers disambiguate both mixed-role and same-role collisions', () => {
    const roster = disambiguateNPCDisplayNames([
      { name: 'Alda Stone', role: 'Mayor' },
      { name: 'Alda Stone', role: 'Guild Master' },
      { name: 'Marek Vale', role: 'Council Member' },
      { name: 'Marek Vale', role: 'Council Member' },
      { name: 'Tomas Reed', role: 'Guard Captain' },
    ]);

    expect(roster.map(npc => npc.name)).toEqual([
      'Alda Stone (Mayor)',
      'Alda Stone (Guild Master)',
      'Marek Vale (Council Member I)',
      'Marek Vale (Council Member II)',
      'Tomas Reed',
    ]);
  });

  test('tier × seed corpus has unique names and unambiguous relationship endpoints', () => {
    const institutions = [
      { name: 'Town watch', category: 'Defense', tags: ['defense'] },
      { name: 'Parish church', category: 'Religious', tags: ['religious', 'church'] },
      { name: 'Merchant guilds (3-8)', category: 'Economy', tags: ['guild', 'trade'] },
    ];

    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let index = 0; index < 36; index++) {
        const seed = `npc-display-${tier}-${index}`;
        const { npcs, relationships } = withSeed(seed, () => {
          const generatedNPCs = generateNPCs(
            {
              tier,
              institutions,
              powerStructure: {
                factions: [
                  {
                    faction: 'the town council',
                    category: 'government',
                    isGoverning: true,
                  },
                ],
              },
              economicState: {
                primaryExports: ['Grain sales'],
                prosperity: 'Modest',
              },
            },
            'germanic',
            {
              stressTypes: ['politically_fractured'],
              priorityMilitary: 60,
              priorityEconomy: 60,
            },
          );
          return {
            npcs: generatedNPCs,
            relationships: generateRelationships(generatedNPCs, {}, institutions),
          };
        });

        const names = npcs.map(npc => normalize(npc.name));
        expect(
          new Set(names).size,
          `${tier}/${seed} emitted duplicate display names: ${names.join(', ')}`,
        ).toBe(names.length);

        for (const relationship of relationships) {
          if (relationship.npc1Id === relationship.npc2Id) continue;
          expect(
            normalize(relationship.npc1Name),
            `${tier}/${seed} relationship endpoints are visually ambiguous`,
          ).not.toBe(normalize(relationship.npc2Name));
        }
      }
    }
  });
});

/**
 * GS-1 (ODQ §934.101): a tie's description and tension are drawn WITHOUT REPLACEMENT per
 * settlement. Before the cure each line was hashed per directed name pair WITH replacement,
 * so two ties of one archetype in the same town shared a line one time in three (measured on
 * gen1000v2: 24.2% verbatim tension repeats on one page). Now the Nth tie of an archetype in a
 * town takes the next unused variant, the index is stored on the tie (`proseVariant`), and a
 * town with more ties of one archetype than the pool holds spends the WHOLE pool before any
 * line comes round again; past that it cycles through the lines that name both parties, so an
 * overflow tie may share a template but never prints the same sentence twice.
 */
describe('relationship tie prose is drawn without replacement per settlement (GS-1)', () => {
  const longestFirst = names => names.filter(Boolean).sort((a, b) => b.length - a.length);
  /** The line with both names masked: two ties sharing it share a template. */
  const templateOf = (text, nameA, nameB) =>
    longestFirst([nameA, nameB]).reduce((out, name) => out.split(name).join('X'), String(text));
  /** How many distinct templates a field's pool renders, read index by index (the pool's own `size`). */
  const poolSize = (key, field) => {
    const pool = STRESS_ECONOMIC_EFFECTS[key][field];
    const a = { name: 'Ravel Probe' };
    const b = { name: 'Sorn Probe' };
    return new Set(Array.from({ length: pool.size }, (_, index) => templateOf(pool(a, b, index), a.name, b.name))).size;
  };
  const institutions = [
    { name: 'Town watch', category: 'Defense', tags: ['defense'] },
    { name: 'Parish church', category: 'Religious', tags: ['religious', 'church'] },
    { name: 'Merchant guilds (3-8)', category: 'Economy', tags: ['guild', 'trade'] },
  ];
  const corpus = [];
  for (const tier of ['city', 'metropolis']) {
    for (let index = 0; index < 12; index++) {
      const seed = `tie-prose-draw-${tier}-${index}`;
      corpus.push(withSeed(seed, () => {
        const npcs = generateNPCs(
          {
            tier,
            institutions,
            powerStructure: { factions: [{ faction: 'the town council', category: 'government', isGoverning: true }] },
            economicState: { primaryExports: ['Grain sales'], prosperity: 'Modest' },
          },
          'germanic',
          { stressTypes: ['politically_fractured'], priorityMilitary: 60, priorityEconomy: 60 },
        );
        return { seed, npcs, relationships: generateRelationships(npcs, {}, institutions) };
      }));
    }
  }

  test('every tie stores the variant it drew, and that index renders its own lines', () => {
    let checked = 0;
    for (const { seed, npcs, relationships } of corpus) {
      const byId = new Map(npcs.map(npc => [npc.id, npc]));
      for (const rel of relationships) {
        const archetype = STRESS_ECONOMIC_EFFECTS[rel.archetypeKey];
        expect(archetype, `${seed}: ${rel.archetypeKey} is a real archetype`).toBeDefined();
        expect(Number.isInteger(rel.proseVariant), `${seed}: tie carries an integer proseVariant`).toBe(true);
        const first = byId.get(rel.npc1Id);
        const second = byId.get(rel.npc2Id);
        expect(rel.tension).toBe(archetype.tension(first, second, rel.proseVariant));
        expect(rel.description).toBe(archetype.desc(first, second, rel.proseVariant));
        checked++;
      }
    }
    expect(checked, 'the corpus renders ties to check').toBeGreaterThan(200);
  });

  /** Does this archetype's tension pool hold a line that names both parties? */
  const hasBothNamedTension = key => {
    const pool = STRESS_ECONOMIC_EFFECTS[key].tension;
    const a = { name: 'Ravel Probe' };
    const b = { name: 'Sorn Probe' };
    return Array.from({ length: pool.size }, (_, index) => pool(a, b, index))
      .some(line => line.includes(a.name) && line.includes(b.name));
  };

  test('ties of one archetype never share a line until the pool is exhausted, then cycle', () => {
    let overflowing = 0;
    const offenders = [];
    for (const { seed, relationships } of corpus) {
      const byKey = new Map();
      for (const rel of relationships) {
        if (!byKey.has(rel.archetypeKey)) byKey.set(rel.archetypeKey, []);
        byKey.get(rel.archetypeKey).push(rel);
      }
      for (const [key, ties] of byKey) {
        for (const field of ['tension', 'description']) {
          const size = poolSize(key, field === 'tension' ? 'tension' : 'desc');
          const lines = ties.map(rel => templateOf(rel[field], rel.npc1Name, rel.npc2Name));
          const head = lines.slice(0, size);
          if (new Set(head).size !== head.length) offenders.push({ seed, key, field, size, head });
        }
        // THE CYCLE ARM: a tie past the pool's end reuses a template, never a sentence.
        const size = poolSize(key, 'tension');
        if (ties.length <= size || !hasBothNamedTension(key)) continue;
        overflowing++;
        ties.forEach((rel, index) => {
          const earlier = ties.slice(0, index).map(prior => prior.tension);
          if (earlier.includes(rel.tension)) offenders.push({ seed, key, size, verbatim: rel.tension });
          if (index >= size && !(rel.tension.includes(rel.npc1Name) && rel.tension.includes(rel.npc2Name))) {
            offenders.push({ seed, key, size, overflowNamesOne: rel.tension });
          }
        });
      }
    }
    expect(offenders, `same-page repeats:\n${JSON.stringify(offenders.slice(0, 4), null, 2)}`).toEqual([]);
    // LIVENESS: the cycle arm must actually fire, or "cycles rather than repeats" is untested.
    expect(overflowing, 'the corpus holds a town with more ties of one archetype than variants').toBeGreaterThan(0);
  });
});

/**
 * GS-1 U2: THE POOLS. Every one of the 18 archetypes carries EIGHT description and EIGHT tension
 * variants (index 0-2 are the pre-existing lines, verbatim; 3-7 are the GS-1 lines). Every new
 * line names both parties, and no line on either pool shares a template with another.
 */
describe('relationship archetype pools hold eight variants each (GS-1)', () => {
  const A = { name: 'Aldo Pyrewright' };
  const B = { name: 'Bessa Morrow' };
  const masked = line => line.split(A.name).join('X').split(B.name).join('Y');
  const keys = Object.keys(STRESS_ECONOMIC_EFFECTS);

  test('all 18 archetypes, both fields, eight distinct variants', () => {
    expect(keys).toHaveLength(18);
    for (const key of keys) {
      for (const field of ['desc', 'tension']) {
        const pool = STRESS_ECONOMIC_EFFECTS[key][field];
        expect(pool.size, `${key}.${field} pool size`).toBe(8);
        const lines = Array.from({ length: 8 }, (_, index) => masked(pool(A, B, index)));
        expect(new Set(lines).size, `${key}.${field} has a duplicated variant`).toBe(8);
      }
    }
  });

  test('every GS-1 line names both parties, and no line carries a dash where a sentence should break', () => {
    let scanned = 0;
    for (const key of keys) {
      for (const field of ['desc', 'tension']) {
        const pool = STRESS_ECONOMIC_EFFECTS[key][field];
        for (let index = 0; index < 8; index++) {
          const line = pool(A, B, index);
          expect(line, `${key}.${field}[${index}] carries an em or en dash`).not.toMatch(/[–—]/);
          if (index >= 3) {
            expect(line, `${key}.${field}[${index}] names the first party`).toContain(A.name);
            expect(line, `${key}.${field}[${index}] names the second party`).toContain(B.name);
          }
          scanned++;
        }
      }
    }
    expect(scanned).toBe(18 * 2 * 8);
  });
});
