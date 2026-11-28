/**
 * THE BATTERY'S A-11 CHECK LICENSES THE DESIGNED INLAND FISH TRADE (chair ruling 4a/4c,
 * 2026-11-04): preserved, salted, dried, smoked or pickled fish, and the bare "Fish" item of a
 * goods list where the record itself imports fish (resourceAnalysis.imports.critical).
 */
import { describe, expect, it } from 'vitest';
import { seaWordSentence, sentencesOf } from '../../scripts/audit/soak-review/checks.mjs';

const IMPORTS_FISH = { resourceAnalysis: { imports: { critical: ['clay', 'fish'] } } };

describe('A-11 sea words, the instrument', () => {
  it('an inland town with the salted-fish row: 0 findings', () => {
    expect(seaWordSentence(sentencesOf('Preserved fish\nSalted fish\nSmoked, dried, and salt-preserved fish for storage and inland trade.'), {})).toBeUndefined();
  });
  it('an imported "Fish" in a goods list is licensed only where the record imports fish', () => {
    const list = sentencesOf('Animal hides Clay Fish Livestock Metals Mountain timber Salt');
    expect(seaWordSentence(list, IMPORTS_FISH)).toBeUndefined();
    expect(seaWordSentence(list, {})).toBe('Animal hides Clay Fish Livestock Metals Mountain timber Salt');
  });
  it('READER-R1: a house-voice lack line is licensed as the generator\'s was (F5), and nothing else in that shape', () => {
    expect(seaWordSentence(['No fish reaches the fishmonger.'], {})).toBeUndefined();
    expect(seaWordSentence(['Fish: Fishmonger exists but lacks access to fish'], {})).toBeUndefined();
    expect(seaWordSentence(['No fish reaches the harbour.'], {})).toBe('No fish reaches the harbour.'); // the house itself is a sea word
  });
  it('still finds the harbour, the catch and the ships', () => {
    for (const line of ['Built around the agora and the harbour.', 'Racks of drying fish line the way in.', 'Timber → lumber → planks → furniture → ships']) {
      expect(seaWordSentence([line], IMPORTS_FISH)).toBe(line);
    }
  });
});

describe('A-11 and the airship override (chair ruling, round 3, 1)', () => {
  const AIRSHIP = { institutions: [{ name: 'Airship docking (high magic)' }, { name: 'Docks/port facilities' }] };
  it('airship docks inland are not sea words', () => {
    const lines = sentencesOf("Via: docks/port facilities\nDocks/port facilities\nHarbour master's office\nRegulates port and airship traffic, assigns berths, collects anchorage fees.");
    expect(seaWordSentence(lines, AIRSHIP)).toBeUndefined();
  });
  it('a plain inland town with a stray "docks" word: 1 finding', () => {
    expect(seaWordSentence(['Via: docks/port facilities'], { institutions: [{ name: 'Town hall' }] })).toBe('Via: docks/port facilities');
  });
});

describe('soak1k-83, airship docks in a desert on a mountain pass', () => {
  it('gives no sea-word finding from its docks', async () => {
    const { birth, ensureLaws } = await import('../../scripts/audit/soak-review/corpus.mjs');
    await ensureLaws();
    const s = birth(83).settlement;
    const aerial = s.institutions.filter((i) => /Docks|Harbour master|Airship/.test(i.name)).flatMap((i) => [i.name, i.desc || '']);
    expect(aerial.length).toBeGreaterThan(2);
    expect(seaWordSentence(['Via: docks/port facilities', ...aerial], s)).toBeUndefined();
  });
});

describe('A-11, the designed inland fish trade (chair ruling, round 3, 3a and 3c)', () => {
  it('the Fish market\'s own name inland: 0 findings', () => {
    expect(seaWordSentence(['Fish market'], {})).toBeUndefined();
  });
  it('salt-cured fish inland: 0 findings', () => {
    expect(seaWordSentence(['Salt-cured fish.'], {})).toBeUndefined();
  });
  it('a fresh catch still counts', () => {
    expect(seaWordSentence(['Fish sold daily from the morning catch.'], {})).toBe('Fish sold daily from the morning catch.');
  });
});

describe('A-11, a route disjunction is no harbour (chair ruling, round 4, 2)', () => {
  it('the Customs house\'s "by road or harbour" inland: 0 findings', () => {
    expect(seaWordSentence(['Levies charged on all trade in and out by road or harbour, collected by officials of crown or town.'], {})).toBeUndefined();
  });
  it('a harbour claimed outright still counts', () => {
    expect(seaWordSentence(['Duties are taken at the harbour.'], {})).toBe('Duties are taken at the harbour.');
  });
});

describe('A-11, the Fishmonger\'s name inland (chair ruling, round 4, 3)', () => {
  it('"Fishmonger" inland: 0 findings', () => {
    expect(seaWordSentence(['Fishmonger'], {})).toBeUndefined();
  });
});

describe('A-11, the airship docks\' own services (chair ruling, round 4, 4)', () => {
  const AIRSHIP = { institutions: [{ name: 'Airship docking (high magic)' }] };
  const lines = ['Longshoremen and crane equipment for shifting goods between ship and shore.', 'Pilot to guide through harbour approaches.'];
  it('in an airship city: 0 findings', () => {
    expect(seaWordSentence(lines, AIRSHIP)).toBeUndefined();
  });
  it('in a plain inland town: still a finding', () => {
    expect(seaWordSentence(lines, {})).toBe(lines[0]);
  });
});

describe('I6 — the cooper\'s reference line is licensed (the chair, 2026-11-04)', () => {
  it('an inland cooper\'s barrels "for … fish" give no sea-word sentence', () => {
    expect(seaWordSentence(['Watertight barrels for ale, wine, salted meat, and fish.'], {})).toBeUndefined();
  });
  it('a harbour sentence inland still counts', () => {
    expect(seaWordSentence(['Ships unload in the harbour at dawn.'], {})).toBe('Ships unload in the harbour at dawn.');
  });
});

describe('F5 unit 1 — A-11 reads prose, not ledgers of lacks', () => {
  it('an A-05 "lacks access" ledger line is no sea claim (soak1k-992)', () => {
    expect(seaWordSentence(['Fish: Fishmonger exists but lacks access to fish'], {})).toBeUndefined();
  });
  it('a lacks-access line still reads the house it names: a Shipwright inland is flagged', () => {
    const line = 'Timber: Shipwright exists but lacks access to timber';
    expect(seaWordSentence([line], {})).toBe(line);
  });
  it('the needs ledger row\'s own need and its "covers" list are no sea claim (soak1k-353, the token "harbour" in "Trade access + harbour")', () => {
    const row = 'Needs Stone + iron No trade access: running on existing stockpiles only. · covers Stone + iron, Metal ore + fuel, Timber, Trade access + harbour';
    expect(seaWordSentence([row], {})).toBeUndefined();
  });
  it('the "covers" list after an impact split into two sentences is still the ledger (soak1k-605)', () => {
    const tail = 'Operating at minimal capacity or shut down. · covers Stone + iron + grain, Iron + grain, Timber, Trade access + harbour';
    expect(seaWordSentence([tail], {})).toBeUndefined();
  });
  it('a needs row whose impact sentence claims a harbour is still flagged', () => {
    const row = 'Needs Stone + iron Ships idle at the quay until the stone comes. · covers Stone + iron, Timber';
    expect(seaWordSentence([row], {})).toBe(row);
  });
});

describe('F5 ruling (1) — an airship city has shipwrights (the chair, 2026-11-04, on soak1k-377 and -755)', () => {
  const AIRSHIP = { institutions: [{ name: 'Airship docking (high magic)' }, { name: 'Docks/port facilities' }] };
  it('an airship metropolis with a Master Shipwright: 0 findings', () => {
    expect(seaWordSentence(['Master Shipwright'], AIRSHIP)).toBeUndefined();
  });
  it('a landlocked place with no airship and a Master Shipwright: still a finding', () => {
    expect(seaWordSentence(['Master Shipwright'], { institutions: [{ name: 'Town hall' }] })).toBe('Master Shipwright');
  });
  it('an airship city\'s harbour claimed outright: still a finding', () => {
    expect(seaWordSentence(['Fishing boats crowd the harbour.'], AIRSHIP)).toBe('Fishing boats crowd the harbour.');
  });
});
