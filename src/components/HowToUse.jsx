import { useState } from 'react';
import { BookOpen, Zap, Star, Cpu, List, Scale, HelpCircle } from 'lucide-react';
import { GOLD, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, PARCH, R, ELEV, PAGE_MAX, sans, serif_, FS, swatch } from './theme.js';
import AccountFAQ from './account/AccountFAQ.jsx';

// Responsive multi-column container for card/list-heavy tab content. Uses
// `column-width` (not a fixed count) so it fills a wide desktop card with as
// many ~COL-wide columns as fit, and collapses to a single column on narrow
// screens / the embedded (non-standalone) help panel — no media queries
// needed. Direct children opt out of mid-column splitting with breakInside.
const COLS = (col = 340) => ({ columnWidth: `${col}px`, columnGap: '22px' });
const NO_BREAK = { breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' };


const TABS = [
  { id:'quick',  label:'Quick Start',   Icon: Zap },
  { id:'power',  label:'Power User',    Icon: Star },
  { id:'logic',  label:'Under the Hood',Icon: Cpu },
  { id:'phil',   label:'DM Philosophy', Icon: BookOpen },
  { id:'ref',    label:'Reference',     Icon: List },
  { id:'compare',label:'How We Compare',Icon: Scale },
  { id:'faq',    label:'FAQ',           Icon: HelpCircle },
];

function Insight({ title, children }) {
  return (
    <div style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${GOLD}`, borderRadius:7,
      padding:'10px 12px', background:CARD, marginBottom:14, ...NO_BREAK }}>
      <div style={{ fontSize:FS.xs, fontWeight:800, color:GOLD, textTransform:'uppercase',
        letterSpacing:'0.06em', marginBottom:5 }}>{title}</div>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:0 }}>{children}</p>
    </div>
  );
}

function Step({ n, children }) {
  return (
    <div style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start' }}>
      <div style={{ width:22, height:22, borderRadius:'50%', background:GOLD, color:swatch.white,
        fontSize:FS.xs, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
        {n}
      </div>
      <p style={{ fontSize: FS['12.5'], color:INK, lineHeight:1.6, margin:0 }}>{children}</p>
    </div>
  );
}

function Tip({ children }) {
  return (
    <div style={{ padding:'8px 12px', background:`${GOLD}10`, border:`1px solid ${GOLD}40`,
      borderLeft:`3px solid ${GOLD}`, borderRadius:5, marginTop:12 }}>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, margin:0 }}>{children}</p>
    </div>
  );
}

function Row({ label, children, lw=120 }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'5px 0', borderBottom:`1px solid ${BOR}` }}>
      <span style={{ fontSize:FS.sm, fontWeight:700, color:INK, minWidth:lw, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{children}</span>
    </div>
  );
}

function QuickTab() {
  // P126 / HT-1 — "How-To inversion". Newcomers open this tab to learn what
  // to *do*, not to read the design philosophy first: we lead with the
  // 60-second action steps and demote the constraint-driven concept essay
  // to a "Why it works this way" coda below. Pure presentational order; the
  // copy in both fragments is byte-for-byte identical.

  const conceptIntro = (
    <div style={{ padding:'12px 14px', background:'linear-gradient(135deg,#1c1409 0%,#2d1f0e 100%)',
      borderRadius:7, marginBottom:14 }}>
      <div style={{ fontFamily:serif_, fontSize: FS['16'], fontWeight:600, color:GOLD, marginBottom:6 }}>
        A settlement generator that thinks. And stays within your constraints.
      </div>
      <p style={{ fontSize:FS.sm, color:swatch['#C8B098'], lineHeight:1.7, margin:'0 0 8px' }}>
        Most generators roll on a table. This one simulates. Every output. Institutions, NPC secrets,
        faction tensions, export economy. Emerges from interlocking mechanical relationships that governed
        real historical settlements. The outputs aren't random. They're derived.
      </p>
      <p style={{ fontSize:FS.sm, color:swatch['#C8B098'], lineHeight:1.7, margin:'0 0 8px' }}>
        <strong style={{ color:GOLD }}>Constraint-driven</strong> is the core principle. You don't describe
        what you want. You constrain what's possible. Sliders, stress conditions, forced institutions,
        terrain, neighbour relationships: each is a constraint. The settlement that comes out is the only
        coherent settlement that satisfies all your constraints simultaneously. That's meaningfully different
        from rolling tables, natural language prompting, or selecting from a list.
      </p>
      <p style={{ fontSize:FS.sm, color:swatch['#C8B098'], lineHeight:1.7, margin:'0 0 8px' }}>
        <strong style={{ color:GOLD }}>Coherence</strong> follows from constraint. A struggling frontier town
        with high criminal priority will have a corrupt guard, underfunded walls, a black market, and NPCs
        whose secrets reflect exactly that pressure. Because all those outputs are derived from the same
        constraint set, not generated independently.
      </p>
      <p style={{ fontSize:FS.sm, color:swatch['#C8B098'], lineHeight:1.7, margin:'0 0 8px' }}>
        <strong style={{ color:GOLD }}>Narrative Refinement Layer</strong> is built in. The settlement
        itself is simulated, not AI-generated. But you can optionally refine the simulator's output
        into table-ready prose. Hit the purple button in any saved settlement and the layer
        synthesizes the full settlement state into narrative. Faction tensions, economic pressures,
        historical character, and daily texture become a coherent voice grounded in what was
        actually simulated. The refinement augments the outputs rather than replacing them, giving
        you something ready for the table without transcribing anything.
      </p>
      <p style={{ fontSize:FS.sm, color:swatch['#C8B098'], lineHeight:1.7, margin:0 }}>
        <strong style={{ color:GOLD }}>Narrative AI Prompt</strong> is for deeper work. The export
        button packages the full settlement brief. Economy, power structure, NPC goals and secrets,
        stress conditions, history. As a structured prompt for any external AI tool. Because the
        data is coherent, the AI produces consistent fiction across multiple queries. Hand it to
        any AI assistant and ask it anything about the settlement.
      </p>
    </div>
  );

  const quickSteps = (
    <>
      <div style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK, marginBottom:10 }}>
        First settlement in 60 seconds
      </div>
      <Step n={1}>On the Create tab, pick a <strong>mode</strong> - <strong>Basic Generate</strong> for minimal config (tier, route, threat, terrain) or <strong>Advanced Generate</strong> for the full step-by-step wizard with priority sliders, institution toggles, services, and trade dynamics.</Step>
      <Step n={2}>Pick a <strong>tier</strong>. Hamlet or Village for a small roadside settlement, Town for a proper community. Free mode can generate Thorp through Village; sign in for Town, City, and Metropolis.</Step>
      <Step n={3}>Pick a <strong>trade route</strong>. Road is the safe default. Port and Crossroads produce richer economies. Pick a <strong>nearby terrain</strong>. Forests, mountains, and coastlines affect what resources appear and which supply chains are viable.</Step>
      <div style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start', paddingLeft:32 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:swatch['#B8860B'], flexShrink:0, marginTop:7 }}/>
        <p style={{ fontSize: FS['12.5'], color:swatch['#5A3A00'], lineHeight:1.6, margin:0, fontStyle:'italic' }}>Looking for a specific service? If you need <em>Remove Curse</em>, <em>Healing</em>, or any institutional service, search for it in the <strong>Compendium → Institutions</strong> tab, find the institution that provides it, then use Advanced Generate to force that institution in the <strong>Institutions</strong> step.</p>
      </div>
      <Step n={4}>Hit <strong>Generate</strong>. Read the <strong>DM Summary</strong> tab first. It gives you the one-paragraph version ready for the table.</Step>
      <Step n={5}>Browse <strong>NPCs</strong> and <strong>Power</strong> tabs to build your session picture. The Power tab shows public legitimacy, faction relationships, and. Where relevant. Legacy annotations connecting the settlement's history to its current power structure. Daily Life is for mid-session quick reference.</Step>
      <Step n={6}><strong>Save</strong> to the Settlements tab to keep it for future sessions. You can also <strong>Export</strong> using the PDF button for a print-ready briefing, or copy the Narrative AI Prompt for any AI assistant.</Step>
      <Tip>You don't need to read every tab before the session starts. DM Summary and Daily Life are designed for the table. The other tabs are for prep and immersion.</Tip>
    </>
  );

  // Two-column on a wide desktop card (steps left, the "why" concept right);
  // wraps to a single column on narrow screens via flex-wrap + flex-basis.
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:28, alignItems:'flex-start' }}>
      <div style={{ flex:'2 1 440px', minWidth:0 }}>
        {quickSteps}
      </div>
      <div style={{ flex:'1 1 320px', minWidth:0 }}>
        <div style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK, margin:'0 0 10px' }}>
          Why it works this way
        </div>
        {conceptIntro}
      </div>
    </div>
  );
}

function PowerTab() {
  return (
    <div style={COLS(360)}>
      <section style={{ ...NO_BREAK, marginBottom:18 }}>
        <div style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, margin:'0 0 8px' }}>
          Sliders, Stress &amp; Institution Control
        </div>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, marginBottom:10 }}>
          The five sliders compete for institutional probability. Raising Economy doesn't suppress Military,
          it makes economic institutions more likely. High Religion + low Magic triggers heresy suppression.
          High Criminal + low Military enables shadow governance. Think of sliders as describing what the
          settlement <em>cares about</em>.
        </p>
        <Step n={1}>Open <strong>Institution Configuration</strong> to force or exclude specific institutions. A temple-city forces a Cathedral regardless of tier. A hermit kingdom excludes all trade infrastructure.</Step>
        <Step n={2}>Apply <strong>Stress Conditions</strong> (Famine, Plague, Siege, Political Fracture, etc.) to shift the entire output. Stresses are not cosmetic. They modify institution probabilities, NPC goals, faction tensions, and safety profiles.</Step>
        <Step n={3}>Multiple stresses <strong>compound</strong>. Famine + Political Fracture means food distribution is contested by factions, not just scarce. The DM Summary names the compound condition.</Step>
        <Tip>Forces and exclusions persist through regeneration. Configure once, generate many variations.</Tip>
      </section>

      <section style={{ ...NO_BREAK, marginBottom:18 }}>
        <div style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, margin:'0 0 8px' }}>
          Linking Settlements as Neighbours
        </div>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, marginBottom:10 }}>
          Generate settlements that know about each other. The relationship type modifies the economic engine,
          faction weights, and institution probabilities. All linking is done from the <strong>Settlements</strong> tab.
        </p>
        <Step n={1}>Open a saved settlement in the <strong>Settlements tab</strong>. In the detail view, click <strong>Link Neighbour</strong> and choose another saved settlement.</Step>
        <Step n={2}>Pick a relationship type: Trade Partner, Allied, Patron, Client, Rival, Cold War, or Hostile. The relationship is bidirectional and both settlements update immediately.</Step>
        <Step n={3}>To bias a <em>new</em> settlement against an existing neighbour: in the Settlements tab, click <strong>Set as Neighbour</strong> on a saved settlement. The Create tab opens with that neighbour active, and the engine adjusts its economy and faction weights before generation.</Step>
        <Step n={4}>Open either settlement's <strong>Neighbours tab</strong> to see the inter-settlement picture: relationship, NPC contacts, and active engagements.</Step>
        <Step n={5}>Use <strong>Edit Names</strong> in the Settlements tab to rename any NPC or faction. Changes cascade to all linked partner records automatically.</Step>
        <Tip>Relationship types matter mechanically. A Rival suppresses overlapping exports and elevates criminal presence. A Patron creates dependency chains in the client's economy. A Cold War generates intelligence NPCs on both sides.</Tip>
      </section>

      <section style={{ ...NO_BREAK, marginBottom:18 }}>
        <div style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, margin:'0 0 8px' }}>
          Managing Saved Settlements &amp; Campaigns
        </div>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, marginBottom:10 }}>
          The Settlements tab is your campaign library. Saves, campaigns, linking, and map placement all live here.
        </p>
        <Step n={1}><strong>Save</strong> after generating to store a settlement in your library.</Step>
        <Step n={2}><strong>Campaigns</strong>. Group settlements into named campaign folders directly inside the Settlements tab. Use the arrow button on any saved settlement to move it between campaigns. Export a campaign to PDF for a complete campaign dossier.</Step>
        <Step n={3}><strong>Export PDF</strong> from the detail view header for a print-ready settlement brief, or export a full campaign PDF from the campaign folder.</Step>
        <Step n={4}><strong>Narrative AI Prompt</strong> and <strong>Map AI Prompt</strong> exports are also available in the detail view. Use these to feed your settlement into an AI assistant for session fiction or map generation.</Step>
        <Step n={5}><strong>Edit Names</strong> lets you rename any NPC or faction. Changes propagate to all linked neighbour records automatically.</Step>
        <Step n={6}><strong>World Map</strong>. Drag any saved settlement onto the embedded fantasy map to place it geographically. Click a placed burg to see its linked settlement data. Toggle relationships and supply-chain overlays from the map toolbar.</Step>
      </section>
    </div>
  );
}

function LogicTab() {
  return <>
    <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, marginBottom:12 }}>
      Understanding these mechanics lets you use the generator as a world-building tool rather than a
      random oracle. The outputs aren't random. They're derived.
    </p>
    <div style={COLS()}>
    <Insight title="Constraint-Driven, Not Random">
      The distinction matters. A random generator picks from tables. This engine resolves constraints.
      Your slider values, trade route, terrain, stress conditions, forced/excluded institutions, and
      neighbour relationship are all constraints. The engine finds the most internally coherent
      settlement satisfying all of them simultaneously. This is why changing one constraint produces
      a systematically different settlement rather than a random variation. The outputs feel inevitable
      rather than arbitrary because they are: given those constraints, this is what the town is.
    </Insight>
    <Insight title="Sliders as Probability Weights">
      The sliders don't guarantee institutions. They shift their probability. Military ≥80 makes a
      Garrison very likely but not certain. It also raises the probability of walls, fortifications,
      and military-aligned NPCs, and the chance the dominant faction is a military bloc.
      Interaction between sliders creates compound archetypes: Military ≥70 + Religion ≥68 can trigger
      Crusader Synthesis where church and military are fused.
    </Insight>
    <Insight title="Magic as an Economic Buffer">
      High Magic doesn't just add magic institutions. It acts as a buffer against economic and food
      deficits. Arcane institutions can substitute for missing production infrastructure. A settlement
      with no farmland and no road access but high magic will survive because the generator treats
      magical supply as a partial substitute for material supply chains. Lower the Magic slider and
      that same settlement faces a viability warning.
    </Insight>
    <Insight title="Prosperity Cascades from Multiple Inputs">
      Prosperity isn't set by a dial. It's the output of export volume × export value, income source
      count, trade route access, supply chain completeness, safety profile, and stress conditions.
      A comfortable prosperity can mask a fragile foundation. The Viability tab shows exactly which
      factors are propping the number up and which are absent.
    </Insight>
    <Insight title="Stress Compounds, Not Stacks">
      Multiple stresses create compound conditions. Famine + Politically Fractured means food
      distribution is contested by factions, not just scarce. The compound modifies NPC secrets
      (who is hoarding, who is profiteering), faction tensions (which bloc controls the grain), and
      safety profile. The DM Summary names the compound condition explicitly.
    </Insight>
    <Insight title="Faction Power Reflects Institutional Base and Settlement Performance">
      Faction raw power comes from institutional presence and slider priorities. But effective power
      is modified by public legitimacy. The governing authority's performance multiplier ranges from
      ×0.60 (legitimacy crisis) to ×1.30 (endorsed). Criminal factions receive an inverse multiplier:
      when governance fails, criminal power grows. The public legitimacy score derives from prosperity,
      safety, defensibility, and food security. So every economic and military decision affects the
      power structure indirectly. NPC groups are distributed across all power factions using
      power-weighted assignment with a diversity cap, so no single faction monopolises the settlement's
      organised population.
    </Insight>
    <Insight title="Neighbour Relationships Bias the Economy">
      When generating with an active neighbour, the relationship type modifies the economic engine
      before institutions are selected. A trade_partner skews production toward complementary exports.
      A rival suppresses them. A patron introduces dependency: the client's economy is partially shaped
      by what the patron demands. Two identical configurations produce different economies depending
      on who their neighbour is.
    </Insight>
    <Insight title="NPC Structural Positions Derive from the Live Settlement State">
      Each significant NPC carries a structural position, a goal, and a constraint. All derived from
      the settlement's current conditions, not from generic role templates. A Guild Master in a
      legitimacy-crisis city with corrupted criminal capture gets a fundamentally different position
      than one in a prosperous, well-governed settlement. The top NPCs by power relevance also carry
      a rank indicator. Dominant or subordinate within their faction type. Producing different
      templates for the most powerful government NPC versus a secondary civic official. The goal field
      on those NPCs reflects the settlement's specific pressures rather than a generic role description.
    </Insight>
    <Insight title="History and Present Are Structurally Connected">
      Historical events connect to current conditions through a temporal plausibility filter. A famine
      500 years ago does not explain today's food shortage. Only recent events (within roughly 30-80
      years depending on event type) can explain current economic or safety conditions. Political
      crises within the last 80 years can explain current legitimacy deficits. Religious events 60-300
      years ago can explain current institutional prominence or decline. Where a historical event and
      the current state are in meaningful tension. A prior political disruption whose pressure hasn't
      resolved, a recovery the settlement has moved through. A legacy annotation surfaces it using
      the event's own name and lasting effects. The annotation tells the DM the structural relationship;
      the DM supplies the world-specific meaning.
    </Insight>
    <Insight title="Supply Chains Create Fragility">
      Production isn't isolated. It's sequential. A tannery requires hides (hunting economy or
      livestock). A leatherworker requires tanned leather. An armorer requires leather and metal.
      Break any link and the downstream chain fails. A Prosperous settlement may be one institution
      away from struggling: remove the mill and the grain surplus collapses, exports drop, and
      prosperity slides within a generation. The Viability tab shows exactly which chains are
      intact, which are broken, and which are propped up by magic or trade substitutes.
    </Insight>
    <Insight title="The AI Narrative Prompt is a Structured Brief">
      The export isn't a description. It's a structured brief: settlement name, tier, economic profile,
      power structure summary, active NPCs with goals and secrets, stress conditions, history events,
      and faction tensions. When given to an AI assistant, this brief enables consistent fiction across
      multiple queries because everything the AI needs is in the brief, not in its training.
      The coherence of the brief is what makes the AI coherent.
    </Insight>
    </div>
  </>;
}

function PhilosophyTab() {
  return <>
    {/* Opening card */}
    <div style={{ padding:'14px 16px', background:'linear-gradient(135deg,#1c1409 0%,#2d1f0e 100%)',
      borderRadius:7, marginBottom:14 }}>
      <div style={{ fontFamily:serif_, fontSize: FS['16'], fontWeight:600, color:GOLD, marginBottom:8 }}>
        Discover your own world.
      </div>
      <p style={{ fontSize:FS.sm, color:swatch['#C8B098'], lineHeight:1.75, margin:'0 0 10px' }}>
        The settlement that emerges from your constraints isn't one you scripted. It's one you
        uncovered. You set the conditions of your world: the terrain, the trade pressures, the
        regional history you've established. The generator derives what a settlement in those
        conditions would actually look like. What appears is genuinely new to you, even though
        you built the world it lives in.
      </p>
      <p style={{ fontSize:FS.sm, color:swatch['#C8B098'], lineHeight:1.75, margin:'0 0 10px' }}>
        Every explorer of their own world is bounded by three things: <strong style={{color:GOLD}}>discovery</strong>. What
        you find when you arrive<strong style={{color:GOLD}}>disappointment</strong>. What isn't
        there, and <strong style={{color:GOLD}}>ingenuity</strong>. What you make of both. These
        aren't limitations of the tool. They're the texture of world-building done honestly.
      </p>
      <p style={{ fontSize:FS.sm, color:swatch['#C8B098'], lineHeight:1.75, margin:0 }}>
        Every settlement this tool produces is meant to be woven into your world, not dropped into it.
        Rename the NPCs. Adjust the factions to fit your regional politics. Keep what fits; change
        what doesn't. The generator gives you a coherent foundation. What you build on top is yours.
      </p>
    </div>

    <div style={COLS()}>
    <Insight title="Extending Your Reach into the Unmapped Parts">
      Even the most detailed campaign setting has places that haven't been fully developed yet.
      The generator reaches into that unmapped space and gives you a coherent foundation to
      work from. Without the hours of manual derivation. You don't have to build every trade
      economy from scratch. Generate a baseline that makes mechanical sense for the region,
      then layer your world's specific history, culture, and context over it. The foundation
      is consistent. What you add on top is what makes it yours.
    </Insight>

    <Insight title="Discovery and Disappointment as Craft">
      Sometimes the generator produces something unexpected. You imagined a cathedral town,
      the constraints gave you a garrison and a black market. That's not the tool contradicting
      you. It's offering a variation worth considering. Accept it, modify it, or reject it
      entirely. But sit with it for a moment first: why didn't the church reach this far?
      What fills the spiritual vacuum in a military settlement with a criminal undercurrent?
      The unexpected result often deepens the setting more than the expected one would have,
      precisely because you had to earn it. Disappointment, in world-building, is frequently
      the beginning of something more interesting.
    </Insight>

    <Insight title="Integration, Not Isolation">
      These settlements are not self-contained islands. They are nodes in the network of your
      world. Connected to everything around them by trade, politics, history, and conflict.
      The export economy points outward: who buys what this town produces? The import
      dependencies point inward: where does what they need come from? The faction tensions
      connect to regional powers. The NPC histories reach beyond the settlement's borders.
      Use the generator's output as a starting point for those connections, not as a finished
      picture. The settlement becomes real when it has relationships with the rest of your world.
    </Insight>

    <Insight title="What the Players Experience">
      When a settlement has genuine internal logic. When the blacksmith is poor because the
      iron supply chain is broken, not because the DM needed a plot point. Players sense it.
      The town feels like it existed before they arrived, and like it will continue to exist
      after they leave. That quality of world-presence is hard to fake and hard to manufacture
      intentionally. It emerges naturally from coherent generation. The gift to the player is
      a world that pushes back: that has gaps where the DM didn't place gaps, services where
      the conditions warranted them, and tensions that don't resolve neatly because they weren't
      written to resolve neatly.
    </Insight>

    <Insight title="Constraint as an Invitation, Not a Limit">
      When a settlement doesn't have what a player is looking for, that's not a failure of
      preparation. It's the world being honest. The frontier town doesn't have Remove Curse
      because no institution here provides it. Now: who would know someone who does? How far
      would the party have to travel? What would it cost to bring that service here? The
      constraint generates the question, and the question generates the session. A world
      that always provides exactly what players need isn't a world. It's a service. The
      constraint is what makes the world feel real, and the DM's ingenuity is what makes
      the constraint feel fair.
    </Insight>

    <Insight title="Actions Have Downstream Consequences">
      Every supply chain in the settlement is a chain of implications. The mill produces flour;
      the baker needs flour; the tavern buys bread; the garrison relies on the tavern for rations.
      If the party burns the mill. Or hires away the miller, or disrupts the grain supply by
      triggering a siege. Everything downstream degrades in sequence. The bread runs out.
      The garrison goes hungry. Morale fractures. This is mapped out in the Supply Chains and
      Viability panels. Not as flavour, but as a literal dependency graph. Before the party
      does something dramatic, you can see what they're actually touching. After they do it,
      you know exactly what breaks and in what order. The generator gives you the map of
      consequences before the players create them.
    </Insight>

    <Insight title="Using the Generator Mid-Session">
      Players go somewhere you didn't prepare. Generate now, in two minutes, with settings that
      match what the region would produce: terrain, trade route, threat level, rough prosperity.
      Read the DM Summary tab. That's your brief. The institution list tells you what's there.
      The NPCs give you named people with actual motivations. The Daily Life tab tells you what
      the place feels like to arrive in. You're not improvising from nothing. You're revealing
      a place that the conditions of your world would plausibly have produced. Then you adapt it,
      as you always do.
    </Insight>
    </div>
  </>;
}


function RefSection({ title, rows }) {
  // breakInside:avoid keeps a heading glued to its rows when the parent flows
  // these sections into multiple columns on a wide desktop card.
  return (
    <section style={{ ...NO_BREAK, marginBottom:16 }}>
      <div style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, margin:'0 0 8px' }}>{title}</div>
      {rows.map(([label, desc]) => <Row key={label} label={label}>{desc}</Row>)}
    </section>
  );
}

function RefTab() {
  const sections = [
    { title: 'Navigation', rows: [
      ['Create','The generation wizard. Two modes: Basic (minimal config) and Advanced (step-by-step with full control).'],
      ['Settlements','Your saved settlement library. Group into campaigns, link as neighbours, edit, rename, and export.'],
      ['World Map','Embedded fantasy map. Drag saved settlements onto it to place them geographically. Toggle relationship and supply-chain overlays.'],
      ['Compendium','Browse the built-in catalog of institutions, archetypes, stresses, and relationship systems. Switch to My Custom Content to create your own custom items.'],
      ['How to Use','This guide.'],
    ]},
    { title: 'Settlement Detail Tabs', rows: [
      ['DM Summary','One-paragraph brief, arrival scene, and consolidated plot hooks for mid-session quick reference.'],
      ['Overview','Physical layout, key institutions, recent history hook.'],
      ['Daily Life','Wealth level, diet, crime, safety. What it feels like to live here.'],
      ['Economics','Full export/import profile, prosperity analysis, supply chains, trade dependencies.'],
      ['Services','Available services and goods by category, with availability indicators.'],
      ['Power','Government type, dominant faction, NPC power rankings, political dynamics.'],
      ['Defense','Walls, garrison, threat response, fortification profile.'],
      ['NPCs','All named characters with personality, goals, secrets, and plot hooks.'],
      ['History','Generated historical events that explain current conditions.'],
      ['Resources','Nearby natural resources and their economic implications.'],
      ['Viability','Economic stress analysis. What is working, what is fragile, what will break.'],
      ['Neighbours','Cross-settlement view: linked settlements, NPC contacts, active conflicts.'],
    ]},
    { title: 'Settlement Workflow', rows: [
      ['Campaigns','Create named campaign folders in the Settlements tab to group settlements together. Move settlements between campaigns using the arrow button. Export a whole campaign as PDF from its folder header.'],
      ['Link Neighbour','In the Settlements tab, open any saved settlement and use Link Neighbour to bidirectionally link it to another. Pick the relationship type (Trade Partner, Allied, Patron, Client, Rival, Cold War, Hostile).'],
      ['Set as Neighbour','Tell the generator to bias a new settlement against an existing one. Opens the Create tab with the neighbour active.'],
      ['Edit Names','Rename any NPC or faction. Changes cascade bidirectionally to linked partners.'],
      ['Export PDF','Print-ready settlement briefing. Cover page, index, relationship diagram, NPC cards, and economic appendix.'],
    ]},
    { title: 'World Map', rows: [
      ['Drag to Place','Drag a saved settlement from the drawer below the map onto any location on the map. A new burg is created at that point, linked to your settlement.'],
      ['Click for Detail','Click any placed burg to see its linked SettlementForge data and jump to the detail view in the Settlements tab.'],
      ['Relationship Overlay','Toggle "Relations" to draw colored lines between linked settlements. Line color indicates relationship type.'],
      ['Supply Chain Overlay','Toggle "Chains" to draw supply-chain routes between exporters and importers across your saved settlements.'],
    ]},
    { title: 'Compendium', rows: [
      ['Built-in Catalog','Searchable reference for tiers, archetypes, stress types, relationship effects, and the full institution catalog.'],
      ['My Custom Content','Create custom institutions, resources, stressors, trade goods, trade routes, power presets, and defense presets. Custom items appear in the Settlement Editor catalog with a purple badge. All custom content persists to your browser.'],
    ]},
  ];
  return (
    <div style={COLS(360)}>
      {sections.map(s => <RefSection key={s.title} title={s.title} rows={s.rows} />)}
    </div>
  );
}

// How We Compare — the comparison content, folded in from the former
// standalone /compare pages (which now redirect here). Honest, side-by-side
// framing: what each alternative does well, and where SettlementForge fits.
function CompareTab() {
  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK, marginBottom:10 }}>
        How SettlementForge compares
      </div>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 14px' }}>
        Three honest, side-by-side breakdowns against the tools DMs commonly weigh. Each is
        upfront about what the other tool does well. And where SettlementForge fits alongside
        it rather than against it.
      </p>
      <Insight title="vs AI prose generators. Simulated, not prompted">
        An AI prose generator writes fluent text on demand, but it improvises each answer: ask
        twice and the guard captain's name, the dominant faction, or the town's economy can quietly
        drift. SettlementForge <strong>simulates</strong> the settlement from interlocking
        constraints, so every institution, NPC secret, and faction tension is mutually consistent
        and reproducible. Best of both: generate the coherent brief here, then hand its Narrative AI
        Prompt to an AI assistant for table-ready prose that stays on-model.
      </Insight>
      <Insight title="vs map-first tools. Maps + settlements">
        Map-first tools are first-class map and hex editors. Terrain, regions, the shape of the
        world. They don't simulate what lives inside a settlement. The two are complementary:
        draw the map in a map tool, then populate its towns with SettlementForge's simulated
        economies, power structures, and NPCs.
      </Insight>
      <Insight title="vs campaign wikis. Generate vs. store">
        A campaign wiki is excellent at organizing and cross-linking the lore you already
        have, but it doesn't generate that lore. Use SettlementForge to <strong>create</strong>
        coherent settlements and export the brief, then store and interlink them in your wiki as
        your living campaign bible.
      </Insight>
      <Tip>
        The throughline: SettlementForge owns the <em>generation</em> of mechanically-coherent
        settlements. Prose tools, map editors, and campaign wikis each sit naturally downstream of
        that. Use them together, not instead.
      </Tip>
    </div>
  );
}

function FaqTab() {
  return (
    <div>
      <div style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK, marginBottom:10 }}>
        Frequently asked questions
      </div>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 14px' }}>
        Credits, billing, gallery privacy, and how the simulator relates to AI. Account-specific
        controls (your plan, credit balance, billing portal) live on your Account page.
      </p>
      <AccountFAQ />
    </div>
  );
}

export default function HowToUse({ standalone=false }) {
  // Open straight to a requested tab via ?tab= (e.g. /compare links redirect
  // here with ?tab=compare; the Account page links to ?tab=faq). Falls back to
  // Quick Start for any unknown value.
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const tab = new URLSearchParams(window.location.search).get('tab');
      return TABS.some(t => t.id === tab) ? tab : 'quick';
    } catch { return 'quick'; }
  });

  if (standalone) return (
    // Centered, shared-width card sized to its content. No full-height cream
    // fill — short tabs let the parchment painting show through to the footer
    // instead of stretching a dead cream rectangle (the old `flex:1` bug).
    <div style={{ maxWidth: PAGE_MAX, margin:'0 auto', width:'100%' }}>
      <div style={{ background:CARD, border:`1px solid ${BOR}`, borderRadius:R.xl,
        boxShadow:ELEV[1], overflow:'hidden' }}>
        {/* Tab bar */}
        <div className="tab-strip" style={{ display:'flex', background:PARCH, borderBottom:`1px solid ${BOR}`,
          overflowX:'auto' }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ display:'flex', alignItems:'center', gap:5, padding:'12px 18px',
                background: activeTab===id ? CARD : 'transparent',
                border:'none', borderBottom: activeTab===id ? `2px solid ${GOLD}` : '2px solid transparent',
                cursor:'pointer', color: activeTab===id ? INK : MUT, fontFamily:sans,
                fontSize:FS.sm, fontWeight:activeTab===id?700:500, whiteSpace:'nowrap',
                WebkitTapHighlightColor:'transparent', flexShrink:0 }}>
              <Icon size={13} /><span style={{ marginLeft:4 }}>{label}</span>
            </button>
          ))}
        </div>
        {/* Content — the card is PAGE_MAX wide; tab bodies fill it via their
            own responsive multi-column layouts (no inner max-width here). */}
        <div style={{ padding:'24px 28px' }}>
          {activeTab==='quick' && <QuickTab />}
          {activeTab==='power' && <PowerTab />}
          {activeTab==='logic' && <LogicTab />}
          {activeTab==='phil'  && <PhilosophyTab />}
          {activeTab==='ref'   && <RefTab />}
          {activeTab==='compare' && <CompareTab />}
          {activeTab==='faq' && <FaqTab />}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ borderRadius:8, overflow:'hidden' }}>
      <>
        {/* Tab bar */}
        <div style={{ display:'flex', background:PARCH, borderBottom:`1px solid ${BOR}`, overflowX:'auto' }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px',
                background: activeTab===id ? CARD : 'transparent',
                border:'none', borderBottom: activeTab===id ? `2px solid ${GOLD}` : '2px solid transparent',
                cursor:'pointer', color: activeTab===id ? INK : MUT,
                fontSize:FS.xs, fontWeight:activeTab===id?700:500, fontFamily:sans,
                whiteSpace:'nowrap', WebkitTapHighlightColor:'transparent', flexShrink:0 }}>
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
        {/* Tab content */}
        <div style={{ padding:'14px', background:CARD, maxHeight:'60vh', overflowY:'auto' }}>
          {activeTab==='quick' && <QuickTab />}
          {activeTab==='power' && <PowerTab />}
          {activeTab==='logic' && <LogicTab />}
          {activeTab==='phil'  && <PhilosophyTab />}
          {activeTab==='ref'   && <RefTab />}
          {activeTab==='compare' && <CompareTab />}
          {activeTab==='faq' && <FaqTab />}
        </div>
      </>
    </div>
  );
}
