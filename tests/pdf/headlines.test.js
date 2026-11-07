import { describe, it, expect } from 'vitest';
import { powerHeadline } from '../../src/pdf/lib/headlines.js';

// powerHeadline weaves a ', with …' continuation clause onto a LEAD clause. When the
// governing faction has no name AND no governmentType is set, no lead is pushed — the
// continuation must not become the first element and open the headline on a comma.
describe('powerHeadline — no leading comma when there is no lead clause', () => {
  it('returns no comma-leading headline for a nameless governing faction with no governmentType', () => {
    const power = {
      governmentType: null,
      factions: [
        { isGoverning: true, name: '', power: 50 },   // truthy object, empty name → no lead
        { name: 'Reformers', power: 45 },             // challenger ≥ 0.7×top → would weave a clause
        { name: 'Traditionalists', power: 30 },
      ],
    };
    const h = powerHeadline(power);
    // Either null (no lead → no headline) or a string that does NOT start with a comma.
    expect(h == null || !String(h).trimStart().startsWith(',')).toBe(true);
  });

  it('still names the governing body and weaves the continuation when a lead exists', () => {
    const power = {
      governmentType: 'council',
      factions: [
        { isGoverning: true, name: 'The Assembly', power: 50 },
        { name: 'Reformers', power: 45 },
      ],
    };
    const h = powerHeadline(power);
    expect(h).toMatch(/The Assembly/);
    expect(String(h).startsWith(',')).toBe(false);
    expect(h).toMatch(/Reformers/);   // the continuation still weaves on
  });
});

// ── THE OWNER'S STYLE LAW OF 2026-11-07 (W7 HOOKS, STYLE-RULINGS §1 #1–#4, #6): the label is the
// first word, the machinery is out, the town's own nouns fill the slots. ──────────────────────
import {
  overviewHeadline, economicsHeadline, defenseHeadline, servicesHeadline,
  resourcesHeadline, viabilityHeadline, historyHeadline,
} from '../../src/pdf/lib/headlines.js';

describe('the chrome headlines — plain, label first, no machinery', () => {
  it('#1 overview: the prosperity label first, the crisis by its label, no chip count, no safety label', () => {
    const h = overviewHeadline(
      { prosperity: 'Struggling', safety: 'Tense — Mass Migration', stress: [{ label: 'Mass Migration' }] },
      { name: 'Albamunicipium', tierKey: 'thorp', tier: 'Thorpe', population: 24 },
    );
    expect(h.startsWith('Struggling. ')).toBe(true);
    expect(h).toMatch(/Albamunicipium, a thorp of 24/);
    expect(h).toMatch(/mass migration\.$/);
    expect(h).not.toMatch(/chip|tense|strain/i);
    // the seed chooses: the same town prints the same variant forever
    expect(overviewHeadline({ prosperity: 'Struggling', stress: [{ label: 'Mass Migration' }] }, { name: 'Albamunicipium', tierKey: 'thorp', population: 24 }))
      .toBe(overviewHeadline({ prosperity: 'Struggling', stress: [{ label: 'Mass Migration' }] }, { name: 'Albamunicipium', tierKey: 'thorp', population: 24 }));
  });

  it('#2 economics: never "economy economy", never a per cent', () => {
    const h = economicsHeadline({
      prosperity: 'Struggling', economicComplexity: 'subsistence — survival economy',
      primaryExports: ['raw wool'], foodBalance: { deficit: 4, importCoverage: 9, rawDeficit: 13 },
    });
    expect(h.startsWith('Struggling. ')).toBe(true);
    expect(h).toMatch(/raw wool/);
    expect(h).toMatch(/imports make up most of the gap/);
    expect(h).not.toMatch(/economy economy|%/);
  });

  it('#3 defence: the readiness label first, the enclosure and the force by their roster names', () => {
    const h = defenseHeadline({
      readiness: { label: 'Lightly Defended' }, scoreAvg: 20,
      institutions: { walls: [{ name: 'Palisade' }], garrison: [], watch: [], militia: [], mercenary: [], charter: [] },
    });
    expect(h).toBe('Lightly defended (20 of 100): a palisade, and no one trained to hold it.');
    expect(h).not.toMatch(/avg defense|Defense for a/);
  });

  it('#4 viability: the verdict first, once, with its one reason; no lowercase enum', () => {
    const h = viabilityHeadline({ viable: true, verdict: 'viable', summary: 'VIABLE BUT STRAINED: …',
      metrics: { foodBalance: { deficit: 4, importCoverage: 9, rawDeficit: 13, importChannel: 'port trade' } } });
    expect(h).toBe('Viable, but it cannot feed itself: most of the food it lacks comes in by port trade.');
    expect(viabilityHeadline({ viable: false, verdict: 'notViable',
      criticalIssues: [{ description: 'Famine: the fishing failed, taking 65% of local food production.' }] }))
      .toBe('Not viable. Famine: the fishing failed, taking 65% of local food production.');
  });

  it('#6 institutions: a small place names its houses from the roster; no "on the books"', () => {
    const h = servicesHeadline({ detailed: [{ name: 'Burial ground', category: 'Religious' }, { name: 'Dwellings (5-25)', category: 'Infrastructure' }] });
    expect(h).toBe('Two institutions: burial ground and dwellings.');
  });

  it('resources: the export rows print their goods (the old read printed "Exports , ;")', () => {
    const h = resourcesHeadline({ exportPotential: [{ product: 'bread, beer, animal feed' }], nearbyDepleted: ['stone_quarry'] });
    expect(h).toBe('It sends out bread, beer and animal feed. The nearby stone quarry is used up.');
  });

  it('history: the historical character is not repeated in the headline', () => {
    const h = historyHeadline({ age: 30, historicalCharacter: 'Shaped by events…', events: [{}], tensions: [{}, {}] });
    expect(h).toBe('Founded 30 years ago, with one event on record and two tensions still unresolved.');
  });
});
