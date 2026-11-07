/**
 * CENSUS-3e (R-AA, the chair's answer 3 to CENSUS-3d): `historyData.js :: demographic_pressure`
 * printed influx and exodus hooks from one template. The migration direction is a homed fact
 * (`facts/migration.js :: migrationOf`), so the template's hook list is split by direction: the
 * two newcomer hooks declare `migration: influx`, the departed-properties hook `migration: exodus`.
 * A tension's list is kind A (`historyGenerator.js :: buildHistoricalEvent` filters it), so under
 * a live influx the exodus hook leaves the list, and vice versa.
 */
import { describe, expect, it } from 'vitest';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { filterDeclared, lineText } from '../../src/domain/facts/drawDeclared.js';
import { atomsOf, declarationOf } from '../../src/domain/facts/factVocabulary.js';

const TEMPLATE = HISTORICAL_EVENTS_DATA.find((e) => e.type === 'demographic_pressure');
const printed = (stress) => filterDeclared(TEMPLATE.plotHooks, { facts: factsOf({ stress }), poolId: 'test' }).map(lineText);

describe('demographic_pressure split by direction (CENSUS-3e, R-AA)', () => {
  it('each hook declares its direction; the texts are unchanged', () => {
    expect(TEMPLATE.plotHooks.map((h) => [lineText(h), atomsOf(declarationOf(h))])).toEqual([
      ['The relief meant for the newcomers is being skimmed, and the shortfall is being blamed on the newcomers', ['migration: influx']],
      ['An old family is quietly buying the properties the departed left behind, before anyone can return to claim them', ['migration: exodus']],
      ['The newcomers fled something, and that something has followed them here', ['migration: influx']],
    ]);
  });

  it('a live influx prints the newcomer hooks only', () => {
    expect(printed([{ type: 'mass_migration' }])).toEqual([lineText(TEMPLATE.plotHooks[0]), lineText(TEMPLATE.plotHooks[2])]);
  });

  it('a live exodus prints the departed-properties hook only', () => {
    expect(printed([{ type: 'mass_migration', direction: 'exodus' }])).toEqual([lineText(TEMPLATE.plotHooks[1])]);
  });
});
