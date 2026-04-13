import React, { useState, useMemo } from 'react';
import {GOLD, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, PARCH, sans, serif_} from './theme.js';
import {Search, Layers, Coins, Shield, Sparkles, AlertTriangle, Link2, Building2} from 'lucide-react';
import {STRESS_TYPE_MAP} from '../data/stressTypes';

import {getInstitutionalCatalog, getFullCatalogWithTierMeta} from '../generators/engine';
import {INSTITUTION_SERVICES} from '../data/institutionServices';

const TABS = [
  { id:'tiers',       label:'Tiers & Routes',    Icon: Layers },
  { id:'economy',     label:'Economy',            Icon: Coins },
  { id:'power',       label:'Power & Factions',   Icon: Shield },
  { id:'arcane',      label:'Magic & Religion',   Icon: Sparkles },
  { id:'stress',      label:'Stress',             Icon: AlertTriangle },
  { id:'neighbour',   label:'Neighbour System',   Icon: Link2 },
  { id:'institutions',label:'Institutions',       Icon: Building2 },
];

const REL_TYPES = [
  { id:'trade_partner',label:'Trade Partner',color:'#1a5a28',effect:'Exports shift toward what the neighbour imports. Supply chains partially share. Complements rather than competes.' },
  { id:'allied',       label:'Allied',       color:'#1a3a7a',effect:'Military and economic cooperation. Elevated garrison institutions and shared defense logic on both sides.' },
  { id:'patron',       label:'Patron',       color:'#4a1a6a',effect:'The generating settlement is client-dependent. Economy shaped by patron demands. Fewer autonomous institutions.' },
  { id:'client',       label:'Client',       color:'#6a3a1a',effect:'Production biased toward what the patron needs. Trade dependency embedded in exports.' },
  { id:'rival',        label:'Rival',        color:'#8a5010',effect:'Competing for the same markets. Overlapping exports suppressed. Criminal presence elevated.' },
  { id:'cold_war',     label:'Cold War',     color:'#8a3010',effect:'Covert conflict. Intelligence infrastructure elevated. Criminal and military institutions higher on both sides.' },
  { id:'hostile',      label:'Hostile',      color:'#8b1a1a',effect:'Open conflict. Military dominates. Exports embargoed. Safety degraded. Criminal infiltration likely.' },
  { id:'neutral',      label:'Neutral',      color:'#6b5340',effect:'No generation influence. Minor economic contact only.' },
];

const ARCHETYPES = [
  { cat:'Economic', name:'Merchant Republic',     cond:'Economy ≥65, Military ≤45, Religion ≤45',    desc:'Merchant guilds control governance. Trade law is the law.' },
  { cat:'Economic', name:'Trade Crossroads',      cond:'Economy ≥60, route: crossroads or port',      desc:'Entrêpot economy. Profits from flow, not production. High service density.' },
  { cat:'Economic', name:'Merchant Army',         cond:'Economy ≥68, Military ≤38',                  desc:'Wealthy settlement replaces public guard with private security.' },
  { cat:'Economic', name:'Theocratic Economy',    cond:'Religion ≥70, Economy ≤42',                  desc:'Church dominates economic life. Sacred goods trade ×1.55.' },
  { cat:'Military', name:'Military Fortress',     cond:'Military ≥72, threat: dangerous',            desc:'Defense first. Civilian economy secondary to garrison supply.' },
  { cat:'Military', name:'Frontier Outpost',      cond:'Military ≥60, tier: small, threat: frontier',desc:'Exists to hold a line. Austere, disciplined, expendable.' },
  { cat:'Military', name:'Besieged Holdout',      cond:'Stress: Siege active',                        desc:'Under siege. Supply constrained. Morale is a resource.' },
  { cat:'Military', name:'Secular Brutalism',     cond:'Military ≥70, Religion ≤25',                 desc:'No religious institutions. Military fills moral and legal vacuum.' },
  { cat:'Military', name:'State Crime',           cond:'Military ≥70, Economy ≤32',                  desc:'Military predates on the population. Extractions, disappearances, selective enforcement.' },
  { cat:'Religious',name:'Theocracy',             cond:'Religion ≥72, Military ≤45',                 desc:'Church is the government. Civil and religious law unified.' },
  { cat:'Religious',name:'Holy Sanctuary',        cond:'Religion ≥65, Criminal ≤30, threat: safe',   desc:'Pilgrimage destination. Protected status. Trade in relics and indulgences.' },
  { cat:'Religious',name:'Crusader Synthesis',    cond:'Military ≥68, Religion ≥68',                 desc:'Church and military fused. Sacred war is civic duty.' },
  { cat:'Religious',name:'Heresy Suppression',    cond:'Religion ≥65, Magic ≤38',                    desc:'Church persecutes arcane practitioners. Magic goods suppressed ×0.25.' },
  { cat:'Religious',name:'Religious Fraud',       cond:'Religion ≥60, Criminal ≥55',                 desc:'Church hierarchy is corrupt. Indulgences, false relics, protection rackets.' },
  { cat:'Religious',name:'Crusader Chapter',      cond:'Military ≥68, Religion ≥60, threat: dangerous',desc:'Martial religious order holds the settlement against monster threat.' },
  { cat:'Magic',    name:'Mage City',             cond:'Magic ≥70, Economy ≥55',                     desc:'Arcane institutions dominate. Magic is commerce. High reagent import demand.' },
  { cat:'Magic',    name:'Arcane Academy',        cond:'Magic ≥72, Religion ≤40',                    desc:'Learning institution at center. Magic is scholarship, not faith.' },
  { cat:'Magic',    name:'Magic Fills Void',      cond:'Magic ≥68, Economy ≤35',                     desc:'Arcane supply substitutes for missing material infrastructure.' },
  { cat:'Magic',    name:'Arcane Black Market',   cond:'Magic ≥52, Criminal ≥58',                    desc:'Sophisticated magical criminal ecosystem. Import demand ×1.45.' },
  { cat:'Magic',    name:'Mage Theocracy',        cond:'Magic ≥70, Religion ≥65',                    desc:'Magic and faith unified. Arcane clergy governs.' },
  { cat:'Magic',    name:'Magic Militarized',     cond:'Magic ≥60, Military ≥65',                    desc:'Arcane power weaponized. Military holds mages on retainer.' },
  { cat:'Criminal', name:'Crime Fills Vacuum',    cond:'Criminal ≥62, Military ≤32',                 desc:'Weak enforcement lets criminal organizations become de facto governance.' },
  { cat:'Criminal', name:'Criminal Haven',        cond:'Criminal ≥72, Military ≤42',                 desc:'Settlement actively shelters criminal networks. Law is performative.' },
  { cat:'Criminal', name:'Merchant-Criminal Blur',cond:'Economy ≥65, Criminal ≥58',                  desc:'Legitimate and criminal commerce are indistinguishable. Guilds run protection.' },
  { cat:'Criminal', name:'Lawless Frontier',      cond:'Criminal ≥60, Military ≤30',                 desc:'Beyond the reach of law. Survival is personal.' },
  { cat:'Balanced', name:'Safe Province Capital', cond:'All sliders 40–65, threat: safe',            desc:'Stable, diverse, prosperous. The baseline of successful governance.' },
  { cat:'Balanced', name:'Balanced',              cond:'No slider exceeds 60',                        desc:'No dominant faction. Power distributed. Politics negotiated.' },
  { cat:'Balanced', name:'Merchant Hunters Lodge',cond:'Military ≥60, threat: dangerous',            desc:'Organized monster hunters are a significant institution.' },
  { cat:'Balanced', name:'Mining Colony',         cond:'Resource: ore or stone nearby, isolated',    desc:'Exists to extract a resource. Company-town dynamics.' },
  { cat:'Balanced', name:'Plague of Beasts',      cond:'Stress: Monster Threat active',              desc:'Under active monster pressure. Civilian life constrained to fortified areas.' },
];

const CAT_COLORS = { Economic:'#a0762a', Military:'#8b1a1a', Religious:'#1a4a2a', Magic:'#3a1a7a', Criminal:'#4a1a4a', Balanced:'#1a3a7a' };

function Tag({ label, color=GOLD }) {
  return <span style={{ fontSize:9, fontWeight:800, color, background:`${color}18`, borderRadius:3, padding:'1px 6px', letterSpacing:'0.05em', textTransform:'uppercase', marginRight:4 }}>{label}</span>;
}

function Row({ label, children, lw=130 }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
      <span style={{ fontSize:12, fontWeight:700, color:INK, minWidth:lw, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:12, color:SEC, lineHeight:1.5 }}>{children}</span>
    </div>
  );
}

function Card({ title, sub, children, accent=GOLD }) {
  return (
    <div style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${accent}`, borderRadius:7,
      padding:'10px 12px', background:'rgba(255,251,245,0.95)', marginBottom:8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:sub?2:6 }}>
        <span style={{ fontFamily:serif_, fontSize:14, fontWeight:700, color:INK, flex:1 }}>{title}</span>
        {sub && <span style={{ fontSize:10, fontWeight:700, color:accent, background:`${accent}14`,
          borderRadius:8, padding:'1px 8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{sub}</span>}
      </div>
      <div style={{ fontSize:12, color:SEC, lineHeight:1.55 }}>{children}</div>
    </div>
  );
}

// ── Tab content components ───────────────────────────────────────────────────

function TiersTab({ search='' }) {
  return <>
    <p style={{ fontSize:12, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>
      Tier determines the maximum institution count, population band, and available institution categories.
      Higher tiers unlock more complex economic, political, and criminal structures.
    </p>
    {[
      ['Thorp','20–80','#8b1a1a','Single institution. Subsistence only. Almost no economy.'],
      ['Hamlet','80–400','#a05010','2–3 institutions. Local subsistence. Minimal trade.'],
      ['Village','400–900','#a0762a','4–6 institutions. Surplus production begins. Weekly market.'],
      ['Town','900–4,000','#1a5a28','7–10 institutions. Specialization appears. Guilds form.'],
      ['City','4,000–25,000','#1a3a7a','11–14 institutions. Full institutional diversity. Factional politics.'],
      ['Metropolis','25,000+','#4a1a6a','15+ institutions. All systems active. Complex faction dynamics.'],
    ].map(([name, pop, color, desc]) => (
      <div key={name} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:`1px solid ${BOR}`, alignItems:'flex-start' }}>
        <div style={{ minWidth:90, flexShrink:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color }}>{name}</div>
          <div style={{ fontSize:10, color:MUT }}>{pop} pop.</div>
        </div>
        <div style={{ fontSize:12, color:SEC, lineHeight:1.5 }}>{desc}</div>
      </div>
    ))}
    <div style={{ fontFamily:serif_, fontSize:14, fontWeight:600, color:INK, margin:'16px 0 8px' }}>Trade Route Access</div>
    {[
      ['Road','Standard land access. Moderate trade volume. Most common.','#6b5340'],
      ['Crossroads','Multiple road intersections. Higher institution diversity. Often entrêpots.','#a0762a'],
      ['Port','Sea or river access. Maritime exports, fishing, naval institutions possible.','#1a3a7a'],
      ['River','Inland waterway. Cheaper bulk movement. Mill and granary more likely.','#1a5a28'],
      ['Mountain Pass','Strategic chokepoint. Toll and garrison institutions likely.','#8b1a1a'],
      ['Isolated','No trade route. Subsistence by necessity. Magic or religion may compensate.','#4a1a4a'],
    ].map(([name, desc, color]) => (
      <div key={name} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
        <span style={{ fontSize:11, fontWeight:700, color, minWidth:110, flexShrink:0 }}>{name}</span>
        <span style={{ fontSize:12, color:SEC, lineHeight:1.5 }}>{desc}</span>
      </div>
    ))}
    <div style={{ fontFamily:serif_, fontSize:14, fontWeight:600, color:INK, margin:'16px 0 8px' }}>Monster Threat</div>
    {[
      ['Safe','Civilian institutions dominate. Military is law enforcement only.','#1a5a28'],
      ['Frontier','Active but managed threat. Walls and garrison elevated. NPCs carry scars.','#a0762a'],
      ['Dangerous','Constant threat. Military dominates. Civilian life constrained. Walls near-certain.','#8a5010'],
      ['Plagued','Active monster plague. Crisis conditions. Siege-like dynamics.','#8b1a1a'],
    ].map(([name, desc, color]) => (
      <div key={name} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
        <span style={{ fontSize:11, fontWeight:700, color, minWidth:110, flexShrink:0 }}>{name}</span>
        <span style={{ fontSize:12, color:SEC, lineHeight:1.5 }}>{desc}</span>
      </div>
    ))}

    {(!search || 'terrain'.includes(search) || 'coastal riverside mountain forest plains hills desert'.includes(search)) && <>
      <div style={{ fontFamily:serif_, fontSize:14, fontWeight:600, color:INK, margin:'16px 0 8px' }}>Terrain</div>
      <p style={{ fontSize:12, color:SEC, lineHeight:1.6, marginBottom:8 }}>
        Terrain determines which nearby resources are compatible, influences trade route likelihood,
        and shapes architecture and institution availability. Select manually or let the trade route
        auto-assign a sensible default.
      </p>
      {[
        ['Coastal',   '#1a3a7a', 'Fish, salt, shellfish, coral, sand. Implies port access. Strong naval and fishing institutions.'],
        ['Riverside', '#1a5a28', 'Freshwater fish, clay, reeds, grain, timber. River trade. Mill and granary institutions likely.'],
        ['Mountain',  '#4a2a1a', 'Iron, stone, precious metals, gemstones, coal. Mining colony dynamics. Garrison likely for pass control.'],
        ['Forest',    '#1a4a20', 'Timber, hardwood, game, furs, medicinal herbs, honey. Hunting and forestry economies. Lower agriculture.'],
        ['Plains',    '#6a5010', 'Grain, livestock, wool, dairy, vegetables. High agricultural output. Strong granary and market institutions.'],
        ['Hills',     '#5a3a1a', 'Stone, clay, iron, copper, livestock, slate. Mixed extraction and herding economy.'],
        ['Desert',    '#8a5010', 'Oasis water, date palms, glass sand, salt, camel herds. Caravan trade hub. Water access is critical.'],
        ['Auto (from route)', '#6b5340', 'Terrain is inferred from the trade route. Road → plains, Port → coastal, River → riverside, etc.'],
      ].filter(([name]) => !search || name.toLowerCase().includes(search) || 'terrain'.includes(search))
       .map(([name, color, desc]) => (
        <div key={name} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
          <span style={{ fontSize:11, fontWeight:700, color, minWidth:140, flexShrink:0 }}>{name}</span>
          <span style={{ fontSize:12, color:SEC, lineHeight:1.5 }}>{desc}</span>
        </div>
      ))}
    </>}

    {(!search || 'magic'.includes(search) || 'arcane'.includes(search)) && <>
      <div style={{ fontFamily:serif_, fontSize:14, fontWeight:600, color:INK, margin:'16px 0 8px' }}>Magic in the World</div>
      <p style={{ fontSize:12, color:SEC, lineHeight:1.6, marginBottom:8 }}>
        Whether magic exists in your world affects institution availability, economic buffers, and
        the viability of settlements that would otherwise fail on material supply chains alone.
      </p>
      {[
        ['✦ Yes — magic exists',   '#3a1a7a', 'All arcane institutions are available. Magic acts as an economic buffer against food and material deficits. Mage towers, alchemists, enchanters, and planar traders can appear. High Magic slider unlocks archetypes like Mage City and Arcane Academy.'],
        ['✗ No — magic is absent', '#6b5340', 'All institutions tagged arcane are suppressed regardless of the Magic slider. Settlements must survive on material supply chains alone. Viability warnings appear for configurations that would normally rely on arcane substitution.'],
      ].map(([name, color, desc]) => (
        <div key={name} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:`1px solid ${BOR}` }}>
          <span style={{ fontSize:11, fontWeight:700, color, minWidth:160, flexShrink:0 }}>{name}</span>
          <span style={{ fontSize:12, color:SEC, lineHeight:1.5 }}>{desc}</span>
        </div>
      ))}
    </>}
  </>;
}

function EconomyTab({ search='' }) {
  return <>
    <Card title="Prosperity Tiers" accent={GOLD}>
      Subsistence → Poor → Struggling → Modest → Moderate → Comfortable → Prosperous → Wealthy → Affluent.
      Food security feeds directly into prosperity: active famine caps at Struggling; structural deficit caps
      at Poor. Food surplus with 3+ active supply chains and a granary adds a bonus step.
      Derived from export volume, income source count, supply chain completeness, trade route access, and safety profile.
      Not a dial — an output. The same slider configuration can produce different prosperity depending on which institutions appear.
    </Card>
    <Card title="Priority Sliders" accent='#a0762a'>
      Sliders shift institutional probability, not guarantee it. Economy slider ≥60 makes guilds and markets
      more likely; it doesn't ensure them. Sliders interact: high Religion + low Magic triggers heresy
      suppression mechanics. High Criminal + low Military enables shadow governance. Think of sliders as
      describing what the settlement <em>cares about</em>, not what it has.
    </Card>
    <Card title="Exports & Imports" accent='#1a5a28'>
      Exports are what the settlement produces beyond local need, determined by nearby resources, institutions,
      and trade route. Imports are goods the settlement cannot produce internally. Heavy import dependency
      creates trade vulnerability visible in the Viability tab.
    </Card>
    <Card title="Supply Chains" accent='#1a3a7a'>
      Linked production sequences where a broken input degrades the output. A tannery requires hides;
      without a hunting economy or nearby livestock, the chain breaks. Broken chains show as warnings
      in the Supply Chains panel. Magic can substitute for some missing material inputs.
    </Card>
    <Card title="Entrêpot Economics" accent='#6b5340'>
      Crossroads and port settlements often profit from trade flow rather than production. High service
      density, lower raw output. Prosperity can be high despite weak local production — but it's vulnerable
      to route disruption.
    </Card>
    <Card title="Viability Score" accent='#8b1a1a'>
      Economic stress analysis showing which factors are supporting prosperity and which are fragile or
      absent. A comfortable prosperity masking a broken supply chain will surface here. Use it for
      generating crisis scenarios.
    </Card>
  </>;
}

function PowerTab_({ search='' }) {
  const cats = ['All','Economic','Military','Religious','Criminal','Magic','Balanced'];
  const [cat, setCat] = useState('All');
  const filtered = ARCHETYPES.filter(a => (cat==='All' || a.cat===cat) && (!search || a.name.toLowerCase().includes(search) || a.desc.toLowerCase().includes(search) || a.cond.toLowerCase().includes(search)));
  return <>
    <p style={{ fontSize:12, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>
      Archetypes emerge when slider combinations or institutional patterns cross thresholds — detected after
      generation. Faction effective power is the product of institutional base and public legitimacy: the
      governing authority's multiplier ranges from ×0.60 (legitimacy crisis) to ×1.30 (endorsed). Criminal
      factions receive an inverse multiplier. The public legitimacy score derives from prosperity, safety,
      defensibility, and food security — making every economic and military condition affect the power
      structure. The Power tab surfaces legacy annotations where historical events connect structurally to
      current conditions, filtered by temporal plausibility.
    </p>
    <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:12 }}>
      {cats.map(c => (
        <button key={c} onClick={() => setCat(c)}
          style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, cursor:'pointer',
            border:'1px solid', background:cat===c?INK:'transparent',
            color:cat===c?'#f5ede0':SEC, borderColor:cat===c?INK:BOR }}>
          {c}
        </button>
      ))}
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:8 }}>
      {filtered.map(a => (
        <div key={a.name} style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${CAT_COLORS[a.cat]||GOLD}`,
          borderRadius:7, padding:'10px 12px', background:'rgba(255,251,245,0.95)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{ fontFamily:serif_, fontSize:13, fontWeight:700, color:INK, flex:1 }}>{a.name}</span>
            <Tag label={a.cat} color={CAT_COLORS[a.cat]||GOLD} />
          </div>
          <div style={{ fontSize:10, color:MUT, fontStyle:'italic', marginBottom:4 }}>{a.cond}</div>
          <div style={{ fontSize:11.5, color:SEC, lineHeight:1.5 }}>{a.desc}</div>
        </div>
      ))}
    </div>
    <div style={{ fontFamily:serif_, fontSize:14, fontWeight:600, color:INK, margin:'16px 0 8px' }}>NPC Categories and Structural Positions</div>
    <p style={{ fontSize:11.5, color:SEC, lineHeight:1.55, marginBottom:10 }}>
      Top NPCs by power relevance carry a structural position, goal, and constraint derived from the live
      settlement state. A dominant government NPC in a legitimacy-crisis city gets a different position than
      a subordinate government NPC — and both differ from the same roles in a stable settlement. The goal
      field on these NPCs reflects the settlement's specific pressures.
    </p>
    {[
      ['Economy','#a0762a','Merchants, guild masters, factors, market overseers. Drive trade and production plot hooks.'],
      ['Military','#8b1a1a','Guard captains, commanders, mercenaries. Drive defense and conflict plot hooks.'],
      ['Religious','#1a4a2a','Priests, abbots, inquisitors. Drive faith, corruption, and moral-authority plot hooks.'],
      ['Government','#1a3a7a','Officials, judges, scribes. Drive political and administrative plot hooks.'],
      ['Criminal','#4a1a4a','Bandit contacts, smugglers, informants. Drive underground economy and leverage.'],
      ['Other','#6b5340','Farmers, peddlers, scholars, bards. Social texture, witnesses, information brokers.'],
    ].map(([label, color, desc]) => (
      <div key={label} style={{ display:'flex', gap:8, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
        <span style={{ fontSize:11, fontWeight:700, color, minWidth:90, flexShrink:0 }}>{label}</span>
        <span style={{ fontSize:12, color:SEC, lineHeight:1.5 }}>{desc}</span>
      </div>
    ))}
  </>;
}

function ArcaneTab({ search='' }) {
  return <>
    <Card title="Magic as Economic Buffer" accent='#3a1a7a'>
      High Magic (slider ≥50) acts as a buffer against economic and food deficits. Arcane institutions
      can substitute for missing production infrastructure. A settlement with no farmland and no road
      access but high magic survives where others would face a viability warning. Lower the slider and
      the same settlement collapses.
    </Card>
    <Card title="Magic Suppression" accent='#5a2a8a'>
      Religion ≥65 with Magic ≤38 triggers Heresy Suppression. Magic goods are suppressed ×0.25.
      Arcane institutions are excluded. Magic NPCs become targets rather than residents.
    </Card>
    <Card title="Arcane-Criminal Ecosystem" accent='#4a1a4a'>
      Magic ≥52 + Criminal ≥58 creates an Arcane Black Market archetype. Magic import demand ×1.45.
      Criminal institutions trafficking in restricted arcane goods become a major economic driver.
    </Card>
    <Card title="Religion & Governance" accent='#1a4a2a'>
      Religion ≥72 with low Military produces a Theocracy — church is government. Religion ≥65 with
      strong Crime produces Religious Fraud — the church hierarchy is corrupt but powerful. Religion ≥68
      with Military ≥68 fuses both into Crusader Synthesis.
    </Card>
    <Card title="Magic & Faith Unified" accent='#2a1a6a'>
      Magic ≥70 + Religion ≥65 produces a Mage Theocracy. Arcane clergy governs. Magic is treated as
      divine revelation. The schism between arcane and religious institutions disappears.
    </Card>
    <div style={{ marginTop:12 }}>
      <Row label="Arcane tags" lw={110}>Institutions tagged 'arcane' are suppressed when Magic = 0. Checked per-institution against keyword lists, not just slider value.</Row>
      <Row label="Magic ≥70" lw={110}>Enables Mage City, Arcane Academy, Mage Theocracy archetypes. Magic Fills Void archetype allows survival without material supply chains.</Row>
    </div>
  </>;
}

function StressTab({ search='' }) {
  const stresses = Object.values(STRESS_TYPE_MAP || {});
  const fallback = [
    { label:'Famine', description:'Food supply failure. Grain exports collapse. NPC secrets skew toward hoarding and profiteering. Safety degrades. Compound with Political Fracture: food distribution is contested by factions.' },
    { label:'Plague', description:'Disease active. Population loss. Healthcare institutions elevated. Social trust collapsed. NPCs carry loss.' },
    { label:'Siege', description:'Military encirclement. Imports cut. All resources redirected to defense. Civilian NPCs under extreme pressure. Every NPC has a survival calculus.' },
    { label:'Political Fracture', description:'Governance contested. Multiple factions claim legitimacy. Law unreliable. Violence imminent. NPC allegiances are the plot.' },
    { label:'Monster Surge', description:'Unusual monster activity overwhelming normal defenses. Civilian movement restricted. Military is over-committed.' },
    { label:'Drought', description:'Water and food scarcity. Agriculture fails. Economic output suppressed. Migration pressure on settlement boundaries.' },
    { label:'Occupation', description:'Foreign military present. Collaboration and resistance both visible in NPC goals. Economy operating under extraction.' },
    { label:'Religious Schism', description:'Church split. Competing orthodoxies. Inquisition mechanics active. Social division maps onto existing faction lines.' },
  ];
  const list = stresses.length > 0 ? stresses : fallback;
  return <>
    <div style={{ padding:'10px 12px', background:`${GOLD}10`, border:`1px solid ${GOLD}40`,
      borderLeft:`3px solid ${GOLD}`, borderRadius:7, marginBottom:12 }}>
      <div style={{ fontSize:11, fontWeight:800, color:GOLD, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>
        Stresses Compound
      </div>
      <p style={{ fontSize:12, color:SEC, lineHeight:1.55, margin:0 }}>
        Multiple stresses don't stack additively — they compound. Famine + Political Fracture means food
        distribution is contested by factions, not just scarce. The DM Summary names the compound condition.
        NPC goals and secrets shift to reflect the combined pressure, not each stress independently.
      </p>
    </div>
    {list.filter(s=>!search||(s.label||'').toLowerCase().includes(search)||(s.description||s.desc||'').toLowerCase().includes(search)).map(s => (
      <div key={s.label||s.id} style={{ padding:'8px 0', borderBottom:`1px solid ${BOR}` }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#8b1a1a', marginBottom:3 }}>{s.label}</div>
        <div style={{ fontSize:12, color:SEC, lineHeight:1.55 }}>{s.description||s.desc||s.summary||'—'}</div>
      </div>
    ))}
  </>;
}

function NeighbourTab({ search='' }) {
  return <>
    <p style={{ fontSize:12, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>
      Relationship types modify the economic engine, faction weights, and institution probabilities
      before generation begins. The generating settlement's outputs are shaped by who its neighbour is
      and what they mean to each other.
    </p>
    {REL_TYPES.filter(r=>!search||r.label.toLowerCase().includes(search)||r.effect.toLowerCase().includes(search)).map(r => (
      <div key={r.id} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:`1px solid ${BOR}`, alignItems:'flex-start' }}>
        <span style={{ fontSize:11, fontWeight:700, color:r.color, minWidth:105, flexShrink:0,
          background:`${r.color}14`, borderRadius:4, padding:'2px 7px', textAlign:'center', marginTop:1 }}>
          {r.label}
        </span>
        <span style={{ fontSize:12, color:SEC, lineHeight:1.5 }}>{r.effect}</span>
      </div>
    ))}
    <div style={{ fontFamily:serif_, fontSize:14, fontWeight:600, color:INK, margin:'16px 0 8px' }}>Cross-Settlement Systems</div>
    {[
      ['NPC Contacts','Named NPCs from both settlements paired by category and relationship type. Economy NPCs pair for trade partnerships; military NPCs for alliances and hostilities.'],
      ['Cross-Settlement Conflicts','Mechanically-derived disputes: market domination contests, border incursions, intelligence operations, faction engagements. Relationship type determines the nature and vocabulary.'],
      ['Bidirectional Cascade','Renaming an NPC or faction in one settlement propagates to all linked partner records. Links store a linkId enabling clean cascade.'],
      ['Delink Cleanup','Removing a neighbour link removes all cross-settlement contacts and conflict records from both settlements simultaneously.'],
    ].map(([label, desc]) => <Row key={label} label={label} lw={160}>{desc}</Row>)}
  </>;
}

function InstitutionsTab({ config, search }) {
  const catalog = useMemo(() => { try { return getFullCatalogWithTierMeta(); } catch { try { return getInstitutionalCatalog('all'); } catch { return {}; } } }, []);
  const all = useMemo(() => {
    // Catalog structure: { Category: { "InstName": {...props} } }
    const seen = new Set();
    return Object.entries(catalog).flatMap(([cat, catData]) =>
      Object.entries(catData||{}).map(([name, props]) => ({ name, category:cat, ...props }))
    ).filter(i => { if(!i.name||seen.has(i.name)) return false; seen.add(i.name); return true; });
  }, [catalog]);
  const catColors = { Economy:'#a0762a', Military:'#8b1a1a', Magic:'#3a1a7a', Religion:'#1a4a2a', Criminal:'#4a1a4a', 'Government/Admin':'#1a3a7a' };
  const filtered = useMemo(() => {
    if (!search) return all.slice(0, 48);
    const q = search.toLowerCase();
    return all.filter(i => {
      if ((i.name||'').toLowerCase().includes(q)) return true;
      if ((i.desc||'').toLowerCase().includes(q)) return true;
      if ((i.category||'').toLowerCase().includes(q)) return true;
      if ((i.tags||[]).some(t=>(t||'').toLowerCase().includes(q))) return true;
      const svcs = INSTITUTION_SERVICES[i.name];
      if (svcs && Object.keys(svcs).some(s=>s.toLowerCase().includes(q))) return true;
      if (svcs && Object.values(svcs).some(s=>(s.desc||'').toLowerCase().includes(q))) return true;
      return false;
    }).slice(0,80);
  }, [all, search]);
  return <>
    <p style={{ fontSize:12, color:MUT, lineHeight:1.5, margin:'0 0 10px', fontStyle:'italic' }}>
      {search ? `${filtered.length} results` : `Showing first 48 of ${all.length} institutions. Use search to filter.`}
    </p>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:6 }}>
      {filtered.map(inst => (
        <div key={inst.name} style={{ border:`1px solid ${BOR}`, borderRadius:6, padding:'8px 10px', background:'rgba(255,251,245,0.95)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:5, marginBottom:3 }}>
            <span style={{ fontFamily:serif_, fontSize:12.5, fontWeight:700, color:INK, flex:1, lineHeight:1.3 }}>{inst.name}</span>
            {inst.required && <Tag label="Core" color='#1a3a7a' />}
          </div>
          {inst.category && <Tag label={inst.category} color={catColors[inst.category]||GOLD} />}
          {inst.desc && <div style={{ fontSize:11, color:SEC, lineHeight:1.4, marginTop:4 }}>{inst.desc}</div>}
          {search && INSTITUTION_SERVICES[inst.name] && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:3, marginTop:4 }}>
              {Object.keys(INSTITUTION_SERVICES[inst.name])
                .filter(s => s.toLowerCase().includes(search.toLowerCase()))
                .slice(0,4)
                .map(s => (
                  <span key={s} style={{ fontSize:9, fontWeight:700, color:'#1a5a28',
                    background:'rgba(26,90,40,0.1)', border:'1px solid rgba(26,90,40,0.3)',
                    borderRadius:3, padding:'1px 5px' }}>{s}</span>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </>;
}

// ── Main component ───────────────────────────────────────────────────────────
export default function CompendiumPanel({ config, standalone=false }) {
  const [activeTab, setActiveTab] = useState('tiers');
  const [search, setSearch] = useState('');

  const renderTab = () => {
    const q = search.toLowerCase();
    switch(activeTab) {
      case 'tiers':        return <TiersTab search={q} />;
      case 'economy':      return <EconomyTab search={q} />;
      case 'power':        return <PowerTab_ search={q} />;
      case 'arcane':       return <ArcaneTab search={q} />;
      case 'stress':       return <StressTab search={q} />;
      case 'neighbour':    return <NeighbourTab search={q} />;
      case 'institutions': return <InstitutionsTab config={config} search={search} />;
      default:             return null;
    }
  };

  return (
    <div style={{ borderRadius: standalone?0:8, overflow:'hidden', background: standalone?'transparent':undefined }}>
      <>
        {/* Tab bar + search */}
        <div style={{ background:PARCH, borderBottom:`1px solid ${BOR}` }}>
          <div style={{ display:'flex', overflowX:'auto', gap:0 }}>
            {TABS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 13px',
                  background: activeTab===id ? CARD : 'transparent',
                  border:'none', borderBottom: activeTab===id ? `2px solid ${GOLD}` : '2px solid transparent',
                  cursor:'pointer', color: activeTab===id ? INK : MUT, fontFamily:sans,
                  fontSize:11, fontWeight:activeTab===id?700:500, whiteSpace:'nowrap',
                  WebkitTapHighlightColor:'transparent', flexShrink:0 }}>
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', borderTop:`1px solid ${BOR}` }}>
            <Search size={12} style={{ color:MUT, flexShrink:0 }} />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={activeTab==='institutions'?'Search institutions…':'Search all content…'}
              style={{ flex:1, border:'none', background:'transparent', fontFamily:sans, fontSize:12, color:INK, outline:'none' }} />
            {search && <button onClick={()=>setSearch('')} style={{ border:'none', background:'none', cursor:'pointer', color:MUT, fontSize:13, padding:0 }}>×</button>}
          </div>
        </div>
        {/* Tab content */}
        <div style={{ padding:'14px', background:'rgba(255,251,245,0.95)', maxHeight:'60vh', overflowY:'auto' }}>
          {renderTab()}
        </div>
      </>
    </div>
  );
}
