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
  npcsHeadline, hooksHeadline, relationshipsHeadline,
} from '../../src/pdf/lib/headlines.js';
import { stripViabilityToken } from '../../src/domain/display/viabilityFilter.js';

describe('the chrome headlines — plain, label first, no machinery', () => {
  it('#1 overview: the prosperity label first, the crisis as a thing seen (never its label), no chip count, no safety label', () => {
    const h = overviewHeadline(
      { prosperity: 'Struggling', safety: 'Tense — Mass Migration', stress: [{ label: 'Mass Migration' }] },
      { name: 'Albamunicipium', tierKey: 'thorp', tier: 'Thorpe', population: 24 },
    );
    expect(h.startsWith('Struggling. ')).toBe(true);
    expect(h).toMatch(/Albamunicipium, a thorpe of 24/);
    // STYLE-2 FIRST-IMPRESSIONS (D·P5): the label is not dropped in as a noun; the clause of what is seen is.
    expect(h).not.toMatch(/mass migration/i);
    expect(h).toMatch(/carts piled with bundles crowd the roads\.$/);
    expect(h).not.toMatch(/chip|tense|strain/i); // anchored: h is the one headline string, asserted to begin "Struggling. " and to carry the town two lines above
    // the seed chooses: the same town prints the same variant forever
    expect(overviewHeadline({ prosperity: 'Struggling', stress: [{ label: 'Mass Migration' }] }, { name: 'Albamunicipium', tierKey: 'thorp', population: 24 }))
      .toBe(overviewHeadline({ prosperity: 'Struggling', stress: [{ label: 'Mass Migration' }] }, { name: 'Albamunicipium', tierKey: 'thorp', population: 24 }));
  });

  it('#1b overview (STYLE-2 D·P5/D·F1): no crisis label as a noun, no "hard season" under a good label, the clauses agree', () => {
    const labels = ['Under Siege', 'Famine', 'Under Occupation', 'Politically Fractured', 'Indebted to Outside Power',
      'Recently Betrayed', 'Infiltrated', 'Disease Outbreak', 'Succession Void', 'Beast & Raider Threat', 'Insurgency',
      'Religious Conversion', 'Slave Revolt', 'Wartime', 'Mass Migration'];
    const towns = ['Shangjin', 'Suryanagar', 'Copanucan', 'Becanchihua', 'Haifeng', 'Lundey', 'Achileia', 'Olympambelos'];
    for (const label of labels) {
      for (const name of towns) {
        const h = overviewHeadline({ prosperity: 'Comfortable', stress: [{ label }] }, { name, tierKey: 'town', population: 1867 });
        expect(h.toLowerCase()).not.toContain(`: ${label.toLowerCase()}`);
        expect(h).not.toMatch(/hard season/i);
        expect(h).toMatch(/^Comfortable\. .+[a-z]\.$/);
      }
    }
    // the record Shangjin's lead claimed: one crisis, recently betrayed — now a thing heard, not the key
    const shangjin = overviewHeadline({ prosperity: 'Struggling', stress: [{ label: 'Recently Betrayed' }] }, { name: 'Shangjin', tierKey: 'town', population: 1867 });
    expect(shangjin).not.toMatch(/recently betrayed/i);
    expect(shangjin).toMatch(/sold them out/);
    // two crises: both named plainly, the first one's clause its own sentence
    const two = overviewHeadline({ prosperity: 'Poor', stress: [{ label: 'Beast & Raider Threat' }, { label: 'Mass Migration' }] }, { name: 'Portaminus', tierKey: 'city', population: 3597 });
    expect(two).toMatch(/the beasts and raiders and the families on the move/);
    expect(two).toMatch(/\. No one travels the roads alone or after dark\.$/);
    // an authored crisis the table does not know is "the crisis", never its key
    const custom = overviewHeadline({ prosperity: 'Poor', stress: [{ label: 'Dragon Tithe' }] }, { name: 'Lundey', tierKey: 'hamlet', population: 78 });
    expect(custom).not.toMatch(/dragon tithe/i);
    expect(custom).toMatch(/the crisis/);
  });

  it('#2 economics: never "economy economy", never a per cent', () => {
    const h = economicsHeadline({
      prosperity: 'Struggling', economicComplexity: 'subsistence — survival economy',
      primaryExports: ['raw wool'], foodBalance: { deficit: 4, importCoverage: 9, rawDeficit: 13 },
    });
    expect(h.startsWith('Struggling. ')).toBe(true);
    expect(h).toMatch(/raw wool/);
    expect(h).toMatch(/imports make up most of the gap/);
    expect(h).not.toMatch(/economy economy|%/); // anchored: h is the one headline string, asserted to carry "raw wool" and the import words above
  });

  it('#3 defence: the readiness label first, the enclosure and the force by their roster names', () => {
    const h = defenseHeadline({
      readiness: { label: 'Lightly Defended' }, scoreAvg: 20,
      institutions: { walls: [{ name: 'Palisade' }], garrison: [], watch: [], militia: [], mercenary: [], charter: [] },
    });
    expect(h).toBe('Lightly defended: a palisade, and no one trained to hold it.');
    expect(h).not.toMatch(/avg defense|Defense for a/); // anchored: h is asserted byte-equal one line above, so it cannot be empty or drifted
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

  it('the car rows: #7 people by name, title and first rank; #5 hooks by the group the chapter prints; ties in words', () => {
    const npc = npcsHeadline({ all: [{ name: 'A' }, { name: 'B' }], sorted: [
      { name: 'Walpurga Corvinus', title: 'the agent', powerLine: 'first of Elder Council · member of Grain Holders', power: 2 }, { name: 'B' }] });
    expect(npc).toMatch(/Walpurga Corvinus, the agent, first of Elder Council,/);
    expect(npc).not.toMatch(/power \d|Grain Holders|fisherman/); // anchored: npc is asserted to carry the name and title one line above
    expect(hooksHeadline({ all: [{ category: 'npc' }, { category: 'npc' }, { category: 'tension' }] }))
      .toBe('Three hooks to pull; most of them belong to the people (2).');
    expect(relationshipsHeadline({ all: [{}, {}] })).toBe('Ties to two neighbouring places.');
    expect(stripViabilityToken('✗ NOT VIABLE: 1 critical issue prevents settlement survival.')).toBe('1 critical issue prevents settlement survival.');
    expect(stripViabilityToken('VIABLE BUT STRAINED: historically plausible')).toBe('Historically plausible');
  });
});
