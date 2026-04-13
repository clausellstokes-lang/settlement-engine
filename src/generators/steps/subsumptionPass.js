/**
 * Step 6: subsumptionPass
 *
 * Removes lesser institutions when greater ones are present.
 * 70+ rules (e.g. "banking district" subsumes "money changer").
 *
 * Extracted from generateSettlement.js lines 639–740.
 */

import { registerStep } from '../pipeline.js';

const SUBSUMPTION_RULES = [
  { greater: 'banking district',            lesser: ['banking house', 'money changer', 'money changers'] },
  { greater: 'banking houses',              lesser: ['money changers', 'money changer'] },
  { greater: 'mages\' guild',               lesser: ['wizard\'s tower', 'alchemist shop'] },
  { greater: 'mages district',              lesser: ['wizard\'s tower', 'mages\' guild', 'alchemist shop', 'alchemist quarter'] },
  { greater: 'academy of magic',            lesser: ['wizard\'s tower', 'mages\' guild'] },
  { greater: 'multiple adventurers\' guild', lesser: ['adventurers\' charter hall', 'hireling hall', 'adventurers\' guild chapter'] },
  { greater: 'adventurers\' guild',          lesser: ['adventurers\' charter hall', 'hireling hall'] },
  { greater: 'cathedral',                   lesser: ['parish church', 'priest (resident)', 'wayside shrine'] },
  { greater: 'major hospital',              lesser: ['small hospital'] },
  { greater: 'professional city watch',     lesser: ['town watch', 'citizen militia'] },
  { greater: 'multiple courthouses',        lesser: ['courthouse'] },
  { greater: 'major port',                  lesser: ['docks/port facilities', 'river boatyard', 'river ferry'] },
  { greater: 'university',                  lesser: ['academy of magic'] },
  { greater: 'craft guilds (30-80)',         lesser: ['craft guilds (5-15)'] },
  { greater: 'craft guilds (100-150+)',      lesser: ['craft guilds (30-80)', 'craft guilds (5-15)'] },
  { greater: 'merchant guilds (15-40)',      lesser: ['merchant guilds (3-8)'] },
  { greater: 'merchant guilds (50-100+)',    lesser: ['merchant guilds (15-40)', 'merchant guilds (3-8)'] },
  { greater: 'thieves\' guild chapter',      lesser: ['fence (word of mouth)', 'local fence', 'bandit affiliate'] },
  { greater: 'black market',                lesser: ['fence (word of mouth)', 'local fence'] },
  { greater: 'brewery',                     lesser: ['brewer'] },
  { greater: 'tanner (established)',        lesser: ['tannery'] },
  { greater: "cobbler's guild",             lesser: ['cobbler'] },
  { greater: "tailor's guild",              lesser: ['tailor'] },
  { greater: 'mint (official)',             lesser: ['mint', 'assay office'] },
  { greater: 'smelter',                     lesser: ['charcoal burner'] },
  { greater: 'stable district',             lesser: ['stable master', 'stable yard'] },
  { greater: 'fish market',                 lesser: ['fishmonger'] },
  { greater: "furrier's district",          lesser: ['tannery'] },
  { greater: "assassins' guild",            lesser: ['contract killer', 'hired blades'] },
  { greater: "thieves' guild (powerful)",   lesser: ["thieves' guild chapter", 'black market bazaar', 'contract killer'] },
  { greater: 'auction house',              lesser: ['slave market'] },
  { greater: "harbour master's office",    lesser: ['docks/port facilities'] },
  { greater: 'gladiatorial school',        lesser: ['pit fights'] },
  { greater: 'printing house',             lesser: ['village scribe'] },
  { greater: 'great library',              lesser: ['village scribe', 'printing house'] },
  { greater: 'banking houses',             lesser: ['pawnbroker'] },
  { greater: 'banking district',           lesser: ['pawnbroker', 'banking houses'] },
  { greater: 'major hospital',              lesser: ['almshouse'] },
  { greater: 'hospital network',             lesser: ['almshouse', 'foundling home'] },
  { greater: "caravan masters' exchange",    lesser: ["caravaneer's post", 'waystation', 'pack animal trader'] },
  { greater: "caravaneer's post",            lesser: ['waystation', 'pack animal trader'] },
  { greater: 'international trade center',  lesser: ["caravan masters' exchange", "caravaneer's post"] },
  { greater: 'stone quarry',                lesser: ['stone quarry (hamlet)'] },
  { greater: 'smelter',                     lesser: ['mine (open cast)'] },
  { greater: 'luxury goods quarter',        lesser: ['jeweller'] },
  { greater: 'specialized metalworkers',    lesser: ['jeweller'] },
  { greater: "butchers (3-8)",              lesser: ['dairy farmer', 'shepherd'] },
  { greater: 'craft guilds (5-15)',         lesser: ['dairy farmer'] },
  { greater: 'merchant guilds (3-8)',       lesser: ['salt works'] },
  { greater: 'brewery',                     lesser: ['vintner'] },
  { greater: 'merchant guilds (3-8)',       lesser: ['vintner'] },
];

// Exported for re-use in cascadePass
export { SUBSUMPTION_RULES };

function applySubsumption(institutions) {
  const names = institutions.map(i => i.name.toLowerCase());
  const toRemove = new Set();
  SUBSUMPTION_RULES.forEach(({ greater, lesser }) => {
    const hasGreater = names.some(n => n.includes(greater.toLowerCase()));
    if (!hasGreater) return;
    lesser.forEach(l => {
      institutions.forEach((inst, idx) => {
        if (inst.name.toLowerCase().includes(l.toLowerCase())) toRemove.add(idx);
      });
    });
  });
  [...toRemove].sort((a, b) => b - a).forEach(idx => institutions.splice(idx, 1));
}

registerStep('subsumptionPass', {
  deps: ['assembleInstitutions'],
  provides: [], // mutates institutions in place
  phase: 'institutions',
}, (ctx) => {
  applySubsumption(ctx.institutions);
  return {};
});

export { applySubsumption };
