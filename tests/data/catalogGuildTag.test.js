// CENSUS-4d (the chair's answer 2 to CENSUS-4c, R-X): the catalogue's `guild` TAG on a village
// scribe, a town crier, the official mint and a veterans' lodge is a mislabel (none is a trade
// guild), so the one guild reader (`domain/institutions/institutionCategory.js ::
// isCommerceGuild`) — right by its definition — read a guild where none stands, crewed a Guild
// Master there, and (CENSUS-4c unit 1) admitted Mayor#0's "two powerful guilds" goal in three
// villages of the 1,000. The catalogue is retagged by its owner; the reader is not bent.
import { describe, it, expect, beforeAll } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { isCommerceGuild } from '../../src/domain/institutions/institutionCategory.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const RETAGGED = ['Village scribe', 'Town crier', 'Mint (official)', "Veteran's lodge"];

/** every catalogue row of a name, every tier: [tier, group, def] */
const rowsOf = (name) => Object.entries(institutionalCatalog).flatMap(([tier, groups]) =>
  Object.entries(groups).flatMap(([group, defs]) => (defs[name] ? [[tier, group, defs[name]]] : [])));

describe('the four mislabelled rows carry no guild tag', () => {
  it.each(RETAGGED)('%s: present in the catalogue, no row tagged guild, not a commerce guild', (name) => {
    const rows = rowsOf(name);
    expect(rows.length).toBeGreaterThan(0);
    for (const [tier, group, def] of rows) {
      expect(def.tags || [], `${tier}/${group}`).not.toContain('guild'); // anchored: the row is proven present in the catalogue (rows.length > 0 above); its tags are its own
      expect(isCommerceGuild({ ...def, name, category: group }), `${tier}/${group}`).toBe(false);
    }
  });
});

// CENSUS-4e (the chair's answer 2 to CENSUS-4d, R-X): five more rows carry `guild` and are not
// trade guilds by their own text — two hired swords (Contract killer is criminal, which
// `isCommerceGuild` already refuses by group; its tag still read as a guild to the history and
// upgrade readers), and three offices "run by royal or municipal officials" or a sale venue.
const RETAGGED_4E = ['Hired blades', 'Contract killer', 'Customs house', 'Auction house', 'Assay office'];

describe('the five further mislabelled rows carry no guild tag (CENSUS-4e)', () => {
  it.each(RETAGGED_4E)('%s: present in the catalogue, no row tagged guild, not a commerce guild', (name) => {
    const rows = rowsOf(name);
    expect(rows.length).toBeGreaterThan(0);
    for (const [tier, group, def] of rows) {
      expect(def.tags || [], `${tier}/${group}`).not.toContain('guild'); // anchored: the row is proven present in the catalogue (rows.length > 0 above); its tags are its own
      expect(isCommerceGuild({ ...def, name, category: group }), `${tier}/${group}`).toBe(false);
    }
  });
  it('each keeps its other tags (the retag removes only the one word)', () => {
    const tagsOf = (name) => rowsOf(name)[0][2].tags;
    expect(tagsOf('Hired blades')).toEqual(['military']);
    expect(tagsOf('Contract killer')).toEqual(['military']);
    expect(tagsOf('Customs house')).toEqual(['law_enforcement']);
    expect(tagsOf('Auction house')).toEqual(['market']);
    expect(tagsOf('Assay office')).toEqual(['banking']);
  });
});

describe('the three villages of CENSUS-4c unit 1', () => {
  beforeAll(async () => { await ensureLaws(); });
  it.each([236, 320])('soak1k-%i: the guild atom is false and no Guild Master is crewed', (i) => {
    const { settlement: s } = birth(i);
    expect(s.tier).toBe('village');
    expect(factsOf(s).guild).toBe(false);
    expect((s.npcs || []).length, 'the village is crewed').toBeGreaterThan(0);
    expect((s.npcs || []).map((n) => n.role)).not.toContain('Guild Master'); // anchored: the line above proves the roster is crewed
  }, 120000);
  // the third holds a guild POWER ("Merchant Guilds", guild.js's power branch), so the atom stays
  // true by the record; only the false Guild Master of its village scribe goes
  it('soak1k-452: no Guild Master of the scribe; the guild atom holds by its guild faction', () => {
    const { settlement: s } = birth(452);
    expect((s.npcs || []).length, 'the village is crewed').toBeGreaterThan(0);
    expect((s.npcs || []).map((n) => n.role)).not.toContain('Guild Master'); // anchored: the line above proves the roster is crewed
    expect((s.powerStructure?.factions || []).map((f) => f.faction)).toContain('Merchant Guilds');
    expect(factsOf(s).guild).toBe(true);
  }, 120000);
});
