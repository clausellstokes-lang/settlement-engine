/**
 * migrationDirection.test.js — THE MIGRATION DIRECTION, DECLARED ONCE (lane WIRING-W0, 2026-11-07;
 * the chair's ruling R-W7 (e); src/domain/migrationDirection.js).
 *
 * A mass migration was told three ways: the crisis text and the pressure line always said
 * ARRIVALS, the Power vignette and the faction note said DEPARTURES whenever the institution
 * economy scored under 50 (45 of the soak 1,000's 71 migration places, `coh:migration-direction`).
 * The cure: ONE record fact, `stress[].direction`, written at the draw (arrivals at birth, the
 * §934.101 direction), and every surface reads it. This suite pins (1) the writer, (2) every
 * reader at BOTH values — a departures record is not born today, so without these pins its
 * readers would be unexercised — and (3) the soak check that convicted the defect.
 */
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildStressEntry } from '../../src/generators/stressGenerator.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { MIGRATION_HOOK_BY_DIRECTION, renderStressSummary } from '../../src/generators/stressNarrative.js';
import { HISTORICAL_EVENTS_DATA, tensionDescription } from '../../src/data/historyData.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { buildGovernanceLabels } from '../../src/generators/power/governanceNarrative.js';
import { applyStressEventFactions } from '../../src/generators/power/stressFactions.js';
import { deriveSimulationSpine } from '../../src/domain/simulationSpine.js';
import { STRESSOR_SPINE_PHRASES } from '../../src/data/stressorSpinePhrases.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { DERIVED_CONFIG_KEYS } from '../../src/store/settlementSlice.js';
import {
  MIGRATION_DIRECTION_AT_BIRTH,
  migrationDirectionOfConfig,
  migrationDirectionOfEntry,
  migrationDirectionOfStress,
} from '../../src/domain/migrationDirection.js';
import { migrationDirectionFindings, migrationDirectionOfText } from '../../scripts/audit/soak-review/checks.mjs';

const MIGRATION = STRESS_TYPE_MAP.mass_migration;
const SEEDS = ['w0-migration-a', 'w0-migration-b', 'w0-migration-c', 'w0-migration-d'];

const born = (seed, overrides = {}) => generateSettlementPipeline(
  { settType: 'town', tradeRouteAccess: 'crossroads', stressType: 'mass_migration', ...overrides },
  null,
  { seed, customContent: {} },
);

const governance = (config) => buildGovernanceLabels({
  factions: [{ faction: 'Elected Reeve', isGoverning: true }],
  config: { monsterThreat: 'frontier', ...config },
  stressFlags: {},
  instFlags: { criminalEffective: 20, militaryEffective: 45, economyOutput: 30, religionInfluence: 30 },
  neighbourRelationship: null,
  instNames: [],
  priorities: { military: 50, economy: 50 },
  tier: 'village',
  governingFaction: 'Elected Reeve',
  hasNobleInstitution: false,
  stressTypes: ['mass_migration'],
  fallbackStressType: null,
});

describe('the writer: stress[].direction is written once, at the draw', () => {
  it('a drawn mass migration carries the birth direction, arrivals', () => {
    expect(MIGRATION_DIRECTION_AT_BIRTH).toBe('arrivals');
    const entry = buildStressEntry('Vale', 'mass_migration', MIGRATION);
    expect(entry.direction).toBe('arrivals');
    expect(entry.viabilityNote).toBe(MIGRATION.viabilityNoteByDirection.arrivals);
    expect(entry.summary).toMatch(/receiving more people than its infrastructure was built for/);
  });

  it('no other stressor carries a direction', () => {
    for (const type of Object.keys(STRESS_TYPE_MAP).filter((t) => t !== 'mass_migration' && t !== 'wartime')) {
      expect(Object.hasOwn(buildStressEntry('Vale', type, STRESS_TYPE_MAP[type]), 'direction'), type).toBe(false);
    }
  });

  it('a record without the field (saved before it, or authored) reads arrivals; a non-migration reads null', () => {
    expect(migrationDirectionOfEntry({ type: 'mass_migration' })).toBe('arrivals');
    expect(migrationDirectionOfEntry({ type: 'mass_migration', direction: 'departures' })).toBe('departures');
    expect(migrationDirectionOfEntry({ type: 'famine', direction: 'departures' })).toBeNull();
    expect(migrationDirectionOfStress([{ type: 'famine' }, { type: 'mass_migration', direction: 'departures' }])).toBe('departures');
    expect(migrationDirectionOfStress(null)).toBeNull();
    // a stale projection on a config without a migration is not a migration
    expect(migrationDirectionOfConfig({ stressTypes: ['famine'], migrationDirection: 'departures' })).toBeNull();
    expect(migrationDirectionOfConfig({ stressTypes: ['mass_migration'] })).toBe('arrivals');
  });

  it('the config projection is a derived key, stripped before regeneration', () => {
    expect(DERIVED_CONFIG_KEYS).toContain('migrationDirection');
  });
});

describe('the pipeline: every surface of a born migration agrees with the record', () => {
  for (const seed of SEEDS) {
    for (const priorityEconomy of [10, 90]) {
      it(`${seed}, economy priority ${priorityEconomy}: one direction on every surface`, () => {
        const s = born(seed, { priorityEconomy });
        const rows = [].concat(s.stress || []);
        const migration = rows.find((r) => r?.type === 'mass_migration');
        expect(migration, 'the forced migration survived').toBeTruthy();
        expect(migration.direction).toBe('arrivals');
        expect(s.config.migrationDirection).toBe('arrivals');
        expect(migrationDirectionFindings(s, null)).toEqual([]);
        // the stability label names the one direction wherever the migration sets it (a stronger crisis may set it first)
        if (/people/.test(s.powerStructure.stability)) expect(s.powerStructure.stability).toMatch(/^Strained \(people arriving\)/);
        // the Power vignette, when it is the migration's, tells the arrival
        const vignette = migrationDirectionOfText(s.powerStructure.recentConflict);
        expect([null, 'arrivals']).toContain(vignette);
        // the faction note follows the record: the newcomers organise, no departure committee forms
        const names = (s.powerStructure.factions || []).map((f) => f.faction);
        expect(names.filter((n) => n === "Newcomers' Settlement" || n === 'Departure Committee')).toEqual(["Newcomers' Settlement"]);
      });
    }
  }
});

describe('the readers at a DEPARTURES record', () => {
  it('the crisis text', () => {
    const text = renderStressSummary('mass_migration', 'Vale', null, 'departures');
    expect(migrationDirectionOfText(text)).toBe('departures');
    expect(text.startsWith('Vale is losing people')).toBe(true);
    expect(migrationDirectionOfText(renderStressSummary('mass_migration', 'Vale', null, 'arrivals'))).toBe('arrivals');
  });

  it('the pressure line reads the record, not the economy', () => {
    const lines = PRESSURE_SENTENCES.mass_migration({ name: 'Vale', tier: 'town', migrationDirection: 'departures', compound: { economyOutput: 90 } });
    expect(lines).toHaveLength(3);
    for (const line of lines) expect(migrationDirectionOfText(line), line).toBe('departures');
    for (const economyOutput of [10, 90]) {
      for (const line of PRESSURE_SENTENCES.mass_migration({ name: 'Vale', tier: 'town', compound: { economyOutput } })) {
        expect(migrationDirectionOfText(line), line).not.toBe('departures');
      }
    }
  });

  it('the Power vignette and the stability label read the record, not the economy score', () => {
    const arrivals = governance({ stressTypes: ['mass_migration'] });
    expect(arrivals.stability).toBe('Strained (people arriving)');
    expect(migrationDirectionOfText(arrivals.recentConflict)).toBe('arrivals');
    const departures = governance({ stressTypes: ['mass_migration'], migrationDirection: 'departures' });
    expect(departures.stability).toBe('Strained (people leaving)');
    expect(migrationDirectionOfText(departures.recentConflict)).toBe('departures');
  });

  it('the faction note reads the record', () => {
    const factionsFor = (config) => {
      const factions = [{ faction: 'Elected Reeve', isGoverning: true, power: 40 }];
      applyStressEventFactions(factions, (t) => t === 'mass_migration', 'Elected Reeve', null, config, []);
      return factions.map((f) => f.faction);
    };
    expect(factionsFor({ stressTypes: ['mass_migration'], priorityEconomy: 5 })).toContain("Newcomers' Settlement");
    expect(factionsFor({ stressTypes: ['mass_migration'], migrationDirection: 'departures' })).toContain('Departure Committee');
  });

  it('the spine strain and fear phrases', () => {
    const spine = (direction) => deriveSimulationSpine({ name: 'Vale', stressors: [{ type: 'mass_migration', label: 'Mass Migration', ...(direction ? { direction } : {}) }] });
    expect(spine('departures').strainedBy).toContain(STRESSOR_SPINE_PHRASES.mass_migration.departures.strain);
    expect(spine('departures').peopleFear).toContain(STRESSOR_SPINE_PHRASES.mass_migration.departures.fear);
    expect(spine(null).strainedBy).toContain(STRESSOR_SPINE_PHRASES.mass_migration.strain);
  });

  it('the secret pool tags its one departures secret, so an arrivals record never draws it', () => {
    const tagged = STRESS_INSTITUTION_EFFECTS.mass_migration.filter((e) => e.direction === 'departures');
    expect(tagged).toHaveLength(1);
    expect(tagged[0].secret).toMatch(/those who fled/);
    for (const e of STRESS_INSTITUTION_EFFECTS.mass_migration.filter((x) => !x.direction)) {
      expect(migrationDirectionOfText(`${e.secret} ${e.stakes}`), e.secret).not.toBe('departures');
    }
  });

  it('the crisis hook is the one its own direction names (#8, W4 PEOPLE second seat 2026-11-07)', () => {
    const departing = buildStressEntry('Vale', 'mass_migration', { ...MIGRATION });
    expect(departing.crisisHook).toBe(MIGRATION_HOOK_BY_DIRECTION.arrivals); // born: arrivals, the one rule
    expect(migrationDirectionOfText(MIGRATION_HOOK_BY_DIRECTION.departures)).not.toBe('arrivals');
    expect(MIGRATION_HOOK_BY_DIRECTION.departures).toMatch(/leave/);
    expect(MIGRATION_HOOK_BY_DIRECTION.arrivals).toMatch(/newcomers/);
    expect(MIGRATION_HOOK_BY_DIRECTION.arrivals).not.toBe(MIGRATION_HOOK_BY_DIRECTION.departures);
  });

  it('the live tension describes the direction the record declares (#20, W4 PEOPLE second seat 2026-11-07)', () => {
    const template = HISTORICAL_EVENTS_DATA.find((e) => e.type === 'demographic_pressure');
    const away = tensionDescription(template, { stressTypes: ['mass_migration'], migrationDirection: 'departures' });
    const toward = tensionDescription(template, { stressTypes: ['mass_migration'] });
    expect(away).toBe(template.descriptionByDirection.departures);
    expect(toward).toBe(template.descriptionByDirection.arrivals);
    expect(`${away} ${toward}`).not.toMatch(/or both|arrived and left|gained and lost/);
  });

  it('the viability note prints the one half the record names', () => {
    // W4 PEOPLE second seat 2026-11-07 (#30, the owner's style law): the halves are re-worded in plain
    // words and cut after their catalogue labels ("If people arrive:" / "If people leave:"), so the pin
    // re-keys from the old "Immigration:" / "Emigration:" prefixes to the halves' own place in the note:
    // each half is its label's clause, and neither carries the other direction's.
    const note = MIGRATION.viabilityNote;
    const { arrivals, departures } = MIGRATION.viabilityNoteByDirection;
    expect(note.indexOf('If people arrive: ')).toBe(0);
    expect(note).toContain(`If people arrive: ${arrivals.charAt(0).toLowerCase()}${arrivals.slice(1)} If people leave: `);
    expect(note.endsWith(`If people leave: ${departures.charAt(0).toLowerCase()}${departures.slice(1)}`)).toBe(true);
    expect(departures).toMatch(/^Taxes will fall short/);
    expect(arrivals).toMatch(/^Food will run short/);
    expect(departures).not.toMatch(/newcomers|arrive/i);
    expect(arrivals).not.toMatch(/leave|empty/i);
  });
});

describe('the soak check that convicted the defect', () => {
  it('convicts two directions on one settlement and is silent on one', () => {
    const contradiction = {
      stress: [{ type: 'mass_migration', summary: 'Vale is receiving more people than its infrastructure was built for.' }],
      powerStructure: { recentConflict: 'Three families left this week. Two more last week.', stability: 'Strained (people arriving or leaving)' },
    };
    const found = migrationDirectionFindings(contradiction, null);
    expect(found).toHaveLength(1);
    expect(found[0].surface).toBe('record:powerStructure.recentConflict');
    const agreed = { ...contradiction, powerStructure: { recentConflict: 'The settlement is receiving more people than its infrastructure was built for.' } };
    expect(migrationDirectionFindings(agreed, null)).toEqual([]);
    // the record's own direction is read first
    const declared = { ...agreed, stress: [{ ...agreed.stress[0], direction: 'departures' }] };
    expect(migrationDirectionFindings(declared, null).map((f) => f.surface)).toContain('record:stress.summary');
  });
});
