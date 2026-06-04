/**
 * domain/compendium/catalogData.js - shared, pure Compendium reference data.
 *
 * These two arrays were previously inlined inside CompendiumPanel.jsx.
 * They're lifted here so two consumers can share one source of truth:
 *
 *   1. CompendiumPanel.jsx          - renders them in the Power & Neighbour tabs.
 *   2. domain/compendium/searchIndex.js - builds the global type-ahead
 *      index (P139 / CP-4) so a search for "theocracy" or "cold war"
 *      lands the reader on the right tab.
 *
 * Pure data only - no React, no side effects - so the domain test suite
 * and the search index can import it without dragging in the component
 * tree. Display-only concerns (CAT_COLORS, icons) stay in the component.
 */

// Neighbour-system relationship types. `effect` is the generation-time
// influence; `color` is the display swatch the Neighbour tab paints.
export const REL_TYPES = [
  { id:'trade_partner',label:'Trade Partner',color:'#1a5a28',effect:'Exports shift toward what the neighbour imports. Supply chains partially share. Complements rather than competes.' },
  { id:'allied',       label:'Allied',       color:'#1a3a7a',effect:'Military and economic cooperation. Elevated garrison institutions and shared defense logic on both sides.' },
  { id:'patron',       label:'Patron',       color:'#4a1a6a',effect:'The generating settlement is client-dependent. Economy shaped by patron demands. Fewer autonomous institutions.' },
  { id:'client',       label:'Client',       color:'#6a3a1a',effect:'Production biased toward what the patron needs. Trade dependency embedded in exports.' },
  { id:'rival',        label:'Rival',        color:'#8a5010',effect:'Competing for the same markets. Overlapping exports suppressed. Criminal presence elevated.' },
  { id:'cold_war',     label:'Cold War',     color:'#8a3010',effect:'Covert conflict. Intelligence infrastructure elevated. Criminal and military institutions higher on both sides.' },
  { id:'hostile',      label:'Hostile',      color:'#8b1a1a',effect:'Open conflict. Military dominates. Exports embargoed. Safety degraded. Criminal infiltration likely.' },
  { id:'neutral',      label:'Neutral',      color:'#6b5340',effect:'No generation influence. Minor economic contact only.' },
];

// Settlement archetypes - emergent labels keyed to slider + threat
// conditions. `cat` groups them; `cond` is the trigger; `desc` is the play.
export const ARCHETYPES = [
  { cat:'Economic', name:'Merchant Republic',     cond:'Economy ≥65, Military ≤45, Religion ≤45',    desc:'Merchant guilds control governance. Trade law is the law.' },
  { cat:'Economic', name:'Trade Crossroads',      cond:'Economy ≥60, route: crossroads or port',      desc:'Entreport economy. Profits from flow, not production. High service density.' },
  { cat:'Economic', name:'Merchant Army',         cond:'Economy ≥68, Military ≤38',                  desc:'Wealthy settlement replaces public guard with private security.' },
  { cat:'Economic', name:'Theocratic Economy',    cond:'Religion ≥70, Economy ≤42',                  desc:'Church dominates economic life. Sacred goods trade x1.55.' },
  { cat:'Military', name:'Military Fortress',     cond:'Military ≥72, threat: dangerous',            desc:'Defense first. Civilian economy secondary to garrison supply.' },
  { cat:'Military', name:'Frontier Outpost',      cond:'Military ≥60, tier: small, threat: frontier',desc:'Exists to hold a line. Austere, disciplined, expendable.' },
  { cat:'Military', name:'Besieged Holdout',      cond:'Stress: Siege active',                        desc:'Under siege. Supply constrained. Morale is a resource.' },
  { cat:'Military', name:'Secular Brutalism',     cond:'Military ≥70, Religion ≤25',                 desc:'No religious institutions. Military fills moral and legal vacuum.' },
  { cat:'Military', name:'State Crime',           cond:'Military ≥70, Economy ≤32',                  desc:'Military predates on the population. Extractions, disappearances, selective enforcement.' },
  { cat:'Religious',name:'Theocracy',             cond:'Religion ≥72, Military ≤45',                 desc:'Church is the government. Civil and religious law unified.' },
  { cat:'Religious',name:'Holy Sanctuary',        cond:'Religion ≥65, Criminal ≤30, threat: safe',   desc:'Pilgrimage destination. Protected status. Trade in relics and indulgences.' },
  { cat:'Religious',name:'Crusader Synthesis',    cond:'Military ≥68, Religion ≥68',                 desc:'Church and military fused. Sacred war is civic duty.' },
  { cat:'Religious',name:'Heresy Suppression',    cond:'Religion ≥65, Magic ≤38',                    desc:'Church persecutes arcane practitioners. Magic goods suppressed x0.25.' },
  { cat:'Religious',name:'Religious Fraud',       cond:'Religion ≥60, Criminal ≥55',                 desc:'Church hierarchy is corrupt. Indulgences, false relics, protection rackets.' },
  { cat:'Religious',name:'Crusader Chapter',      cond:'Military ≥68, Religion ≥60, threat: dangerous',desc:'Martial religious order holds the settlement against monster threat.' },
  { cat:'Magic',    name:'Mage City',             cond:'Magic ≥70, Economy ≥55',                     desc:'Arcane institutions dominate. Magic is commerce. High reagent import demand.' },
  { cat:'Magic',    name:'Arcane Academy',        cond:'Magic ≥72, Religion ≤40',                    desc:'Learning institution at center. Magic is scholarship, not faith.' },
  { cat:'Magic',    name:'Magic Fills Void',      cond:'Magic ≥68, Economy ≤35',                     desc:'Arcane supply substitutes for missing material infrastructure.' },
  { cat:'Magic',    name:'Arcane Black Market',   cond:'Magic ≥52, Criminal ≥58',                    desc:'Sophisticated magical criminal ecosystem. Import demand x1.45.' },
  { cat:'Magic',    name:'Mage Theocracy',        cond:'Magic ≥70, Religion ≥65',                    desc:'Magic and faith unified. Arcane clergy governs.' },
  { cat:'Magic',    name:'Magic Militarized',     cond:'Magic ≥60, Military ≥65',                    desc:'Arcane power weaponized. Military holds mages on retainer.' },
  { cat:'Criminal', name:'Crime Fills Vacuum',    cond:'Criminal ≥62, Military ≤32',                 desc:'Weak enforcement lets criminal organizations become de facto governance.' },
  { cat:'Criminal', name:'Criminal Haven',        cond:'Criminal ≥72, Military ≤42',                 desc:'Settlement actively shelters criminal networks. Law is performative.' },
  { cat:'Criminal', name:'Merchant-Criminal Blur',cond:'Economy ≥65, Criminal ≥58',                  desc:'Legitimate and criminal commerce are indistinguishable. Guilds run protection.' },
  { cat:'Criminal', name:'Lawless Frontier',      cond:'Criminal ≥60, Military ≤30',                 desc:'Beyond the reach of law. Survival is personal.' },
  { cat:'Balanced', name:'Safe Province Capital', cond:'All sliders 40-65, threat: safe',            desc:'Stable, diverse, prosperous. The baseline of successful governance.' },
  { cat:'Balanced', name:'Balanced',              cond:'No slider exceeds 60',                        desc:'No dominant faction. Power distributed. Politics negotiated.' },
  { cat:'Balanced', name:'Merchant Hunters Lodge',cond:'Military ≥60, threat: dangerous',            desc:'Organized monster hunters are a significant institution.' },
  { cat:'Balanced', name:'Mining Colony',         cond:'Resource: ore or stone nearby, isolated',    desc:'Exists to extract a resource. Company-town dynamics.' },
  { cat:'Balanced', name:'Plague of Beasts',      cond:'Stress: Monster Threat active',              desc:'Under active monster pressure. Civilian life constrained to fortified areas.' },
];
