import { useState } from 'react';
import { GOLD, GOLD_TXT, INK, BODY, SECOND as SEC, BORDER as BOR, CARD, PARCH, R, ELEV, layout, PROSE_MAX, SP, sans, serif_, FS, swatch } from './theme.js';
import Button from './primitives/Button.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import { t } from '../copy/index.js';
import { navigate } from '../hooks/useRoute.js';
import AccountFAQ from './account/AccountFAQ.jsx';
import LivingWorldTab from './howto/LivingWorldTab.jsx';
import UnderTheHoodTab from './howto/UnderTheHoodTab.jsx';

// Responsive multi-column container for card/list-heavy tab content. Uses
// `column-width` (not a fixed count) so it fills a wide desktop card with as
// many ~COL-wide columns as fit, and collapses to a single column on narrow
// screens — no media queries needed. Direct children opt out of mid-column
// splitting with breakInside.
const COLS = (col = 340) => ({ columnWidth: `${col}px`, columnGap: SP.xl });
const NO_BREAK = { breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' };

// P12 — one inner content cap shared by every tab, centered in the layout.page
// shell card. The multi-column tabs (Quick / Philosophy / Living / Under the
// Hood) fill this width; the prose tabs hold the narrower PROSE_MAX reading
// measure inside it. Capping here once is what stops the column from jumping
// between ~1150 and 820 as the GM tabs across the guide.
const CONTENT_MAX = 1040;

// P5 — top-level section breaks get a clearly looser gap than the within-section
// rhythm (SP.lg/16 between Insights, SP.sm/md within a block). SP.xxl (24) was
// too small a step over 20 to make chunk boundaries pop on a squint; space-7
// (32) is the perceptual jump the scale reserves for major section breaks.
const SECTION_GAP = SP.xxl + SP.sm; // 24 + 8 = 32 (space-7)


const TABS = [
  { id:'quick',  label:'Quick Start' },
  { id:'power',  label:'Power User' },
  // P9 — "The Living World" sits between Power User and Under the Hood: the
  // bridge from the static dossier to the premium living simulation.
  { id:'living', label:'The Living World' },
  { id:'logic',  label:'Under the Hood' },
  { id:'phil',   label:'DM Philosophy' },
  { id:'ref',    label:'Reference' },
  { id:'compare',label:'How We Compare' },
  { id:'faq',    label:'FAQ' },
];

// Flattened to a left-accented prose block (P5 anti-box-soup): grouping rides on
// the gold left rule + generous left padding + between-block spacing, not a full
// nested box inside the already-bordered shell card. `prose` switches the title
// from the gold-uppercase scannable-tip treatment to a serif INK heading for the
// read-heavy essays (P6: the heading should signal read-vs-scan), and `lead`
// promotes one card to a larger dominant focal entry (P4). Title color rides
// GOLD_TXT, not GOLD-as-text, so it clears AA on the light card (P7).
function Insight({ title, children, prose = false, lead = false }) {
  return (
    <div style={{ borderLeft:`3px solid ${GOLD}`, paddingLeft:14, marginBottom:SP.lg, ...NO_BREAK }}>
      {prose
        ? <h3 style={{ fontFamily:serif_, fontSize: lead ? FS.lg : FS.md, fontWeight:600, color:INK,
            margin:'0 0 5px' }}>{title}</h3>
        : <h3 style={{ fontSize: lead ? FS.sm : FS.xs, fontWeight:800, color:GOLD_TXT, textTransform:'uppercase',
            letterSpacing:'0.06em', margin:'0 0 5px' }}>{title}</h3>}
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:0 }}>{children}</p>
    </div>
  );
}

function Step({ n, children }) {
  return (
    <div style={{ display:'flex', gap:SP.md, marginBottom:SP.sm, alignItems:'flex-start' }}>
      {/* P7: INK digit on solid GOLD (matching the primary Button), not white —
          white-on-gold was ~1.9:1, failing AA; this is the house gold-fill rule. */}
      <div style={{ width:22, height:22, borderRadius:'50%', background:GOLD, color:INK,
        fontSize:FS.xs, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
        {n}
      </div>
      <p style={{ fontSize: FS['12.5'], color:INK, lineHeight:1.6, margin:0 }}>{children}</p>
    </div>
  );
}

// One cue, not three (P5): a one-line tip is grouped by the gold tint + the left
// accent; the redundant full 1px border is dropped.
function Tip({ children }) {
  return (
    <div style={{ padding:'8px 12px', background:`${GOLD}10`,
      borderLeft:`3px solid ${GOLD}`, borderRadius:5, marginTop:SP.md }}>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, margin:0 }}>{children}</p>
    </div>
  );
}

// No per-row hairline (P5): vertical padding alone separates rows, so the
// definition list reads as a clean spaced ledger, not a spreadsheet grid.
function Row({ label, children, lw=120 }) {
  return (
    <div style={{ display:'flex', gap:SP.sm, padding:'6px 0' }}>
      <dt style={{ fontSize:FS.sm, fontWeight:700, color:INK, minWidth:lw, flexShrink:0, margin:0 }}>{label}</dt>
      <dd style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5, margin:0 }}>{children}</dd>
    </div>
  );
}

function QuickTab() {
  // How-To inversion: newcomers open this tab to learn what
  // to *do*, not to read the design philosophy first: we lead with the
  // 60-second action steps and demote the constraint-driven concept essay
  // to a "Why it works this way" coda below. Pure presentational order; the
  // copy in both fragments is byte-for-byte identical.

  // The 60-second action path is the hero (P1/P4/P6). This "why" coda is the
  // demoted secondary: it no longer carries the page's brightest dark gradient
  // surface for theory (P4 — that inverted the hierarchy so the eye landed on
  // the essay, not the steps). It is flattened to a left-accented light block
  // (P5), capped at PROSE_MAX (P12), and its gold accents ride GOLD_TXT for AA
  // (P7). All copy is preserved verbatim.
  const conceptIntro = (
    // P5: flattened to the same left-accent prose block the rest of the guide
    // uses (Insight pattern) — the old full 1px border + CARD fill drew a box
    // with no contrast across it (same fill as the shell). The gold left rule +
    // left padding + between-block spacing carry the grouping.
    <div style={{ borderLeft:`3px solid ${GOLD}`, paddingLeft:14, marginBottom:SP.lg, maxWidth:PROSE_MAX }}>
      <div style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, marginBottom:6 }}>
        Both halves of that promise come from one idea: the town is solved, not rolled.
      </div>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.7, margin:'0 0 8px' }}>
        Most generators roll on a table. This one simulates. Every output (institutions, NPC secrets, faction tensions,
        and the export economy) falls out of the same interlocking relationships that held real historical
        settlements together. The outputs aren't random. They're derived. And the static dossier is only the
        start: advance time and the whole region runs as a living simulation. See
        <strong style={{ color:GOLD_TXT }}> The Living World</strong> tab.
      </p>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.7, margin:'0 0 8px' }}>
        <strong style={{ color:GOLD_TXT }}>Constraint-driven</strong> is the core principle. You don't describe
        what you want. You constrain what's possible. Sliders, stress conditions, forced institutions,
        terrain, neighbour relationships: each is a constraint. The settlement that comes out is the only
        coherent settlement that satisfies all your constraints simultaneously. That's meaningfully different
        from rolling tables, natural language prompting, or selecting from a list.
      </p>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.7, margin:'0 0 8px' }}>
        <strong style={{ color:GOLD_TXT }}>Coherence</strong> follows from constraint. A struggling frontier town
        with high criminal priority will have a corrupt guard, underfunded walls, a black market, and NPCs
        whose secrets reflect exactly that pressure. Because all those outputs are derived from the same
        constraint set, not generated independently.
      </p>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.7, margin:'0 0 8px' }}>
        <strong style={{ color:GOLD_TXT }}>Narrative Refinement Layer</strong> is built in. The settlement
        itself is simulated, not AI-generated, but you can refine the simulator's output into
        table-ready prose. Press the purple button in any saved settlement and the layer draws the
        full settlement state into narrative. Faction tensions, economic pressures, historical
        character, and daily texture become a single coherent voice, grounded in what the engine
        actually simulated. The refinement augments the outputs rather than replacing them, so you
        get something ready for the table without transcribing a word.
      </p>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.7, margin:0 }}>
        <strong style={{ color:GOLD_TXT }}>Narrative AI Prompt</strong> is for deeper work. The export
        button packages the full settlement brief, economy, power structure, NPC goals and secrets,
        stress conditions, and history, into a structured prompt for any external AI tool. Because
        the data is coherent, the AI holds consistent fiction across many queries. Hand it to any
        AI assistant and ask it anything about the settlement.
      </p>
    </div>
  );

  const quickSteps = (
    <>
      <h2 style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK, margin:'0 0 10px' }}>
        First settlement in 60 seconds
      </h2>
      <Step n={1}>On the Create tab, pick a <strong>mode</strong>: <strong>Basic Generate</strong> for minimal config (tier, route, threat, terrain) or <strong>Advanced Generate</strong> for the full step-by-step wizard with priority sliders, institution toggles, services, and trade dynamics.</Step>
      <Step n={2}>Pick a <strong>tier</strong>. Hamlet or Village for a small roadside settlement, Town for a proper community. Anonymous generation reaches town size. A free account reaches any size, from hamlet to metropolis.</Step>
      <Step n={3}>Pick a <strong>trade route</strong>. Road is the safe default. Port and Crossroads produce richer economies. Pick a <strong>nearby terrain</strong>. Forests, mountains, and coastlines affect what resources appear and which supply chains are viable.</Step>
      <div style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start', paddingLeft:32 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:swatch['#B8860B'], flexShrink:0, marginTop:7 }}/>
        <p style={{ fontSize: FS['12.5'], color:swatch['#5A3A00'], lineHeight:1.6, margin:0, fontStyle:'italic' }}>If you need a specific service like <em>Remove Curse</em> or <em>Healing</em>, find the institution that provides it in the <strong>Compendium</strong>, then use Advanced Generate to force it onto your settlement.</p>
      </div>
      <Step n={4}>Hit <strong>Generate</strong>. Read the <strong>DM Summary</strong> tab first. It gives you the one-paragraph version ready for the table.</Step>
      <Step n={5}>Browse <strong>NPCs</strong> and <strong>Power</strong> tabs to build your session picture. The Power tab shows public legitimacy, faction relationships, and legacy annotations that connect the settlement's history to its current power structure. Daily Life is for mid-session quick reference.</Step>
      <Step n={6}><strong>Save</strong> to the Settlements tab to keep it for future sessions. You can also <strong>Export</strong> using the PDF button for a print-ready briefing, or copy the Narrative AI Prompt for any AI assistant.</Step>
      <Tip>You don't need to read every tab before the session starts. DM Summary and Daily Life are designed for the table. The other tabs are for prep and immersion.</Tip>
      {/* P8/P9: the guide's primary task is generating — close the Quick Start
          region on the runnable next step rather than only documenting it. */}
      <div style={{ marginTop:SP.xl }}>
        <Button variant="primary" size="lg" onClick={() => navigate('generate')}>
          Generate your first settlement
        </Button>
      </div>
    </>
  );

  // Two-column on a wide desktop card (steps left, the "why" concept right);
  // wraps to a single column on narrow screens via flex-wrap + flex-basis.
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:SP.xxl, alignItems:'flex-start' }}>
      <div style={{ flex:'2 1 440px', minWidth:0 }}>
        {quickSteps}
      </div>
      {/* Demoted secondary column (P4): the steps heading is the single loudest
          heading on the tab; this one shrinks to FS.sm and drops to BODY so the
          eye lands on the 60-second action path, not the theory. (MUT failed AA
          as a heading — BODY clears it, P7.) */}
      <div style={{ flex:'1 1 320px', minWidth:0 }}>
        <h2 style={{ fontFamily:serif_, fontSize:FS.sm, fontWeight:600, color:BODY,
          textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 10px' }}>
          Why it works this way
        </h2>
        {conceptIntro}
      </div>
    </div>
  );
}

function PowerTab({ onNavigate }) {
  // P12/P6: one readable column. The newspaper COLS() flow could fragment a
  // numbered procedure across columns, breaking the goal-gradient reading order;
  // sequential steps must read top-to-bottom. PROSE_MAX holds the measure.
  return (
    <div style={{ maxWidth:PROSE_MAX, margin:'0 auto' }}>
      <section style={{ ...NO_BREAK, marginBottom:SECTION_GAP }}>
        <h2 style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, margin:'0 0 8px' }}>
          Sliders, Stress &amp; Institution Control
        </h2>
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

      <section style={{ ...NO_BREAK, marginBottom:SECTION_GAP }}>
        <h2 style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, margin:'0 0 8px' }}>
          Linking Settlements as Neighbours
        </h2>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, marginBottom:10 }}>
          Generate settlements that know about each other. The relationship type modifies the economic engine,
          faction weights, and institution probabilities. All linking is done from the <strong>Settlements</strong> tab.
        </p>
        <Step n={1}>Open a saved settlement from the <strong>Settlements tab</strong>, then click <strong>Link Neighbour</strong> in the detail view to choose another.</Step>
        <Step n={2}>Pick a relationship type: Trade Partner, Allied, Patron, Client, Rival, Cold War, or Hostile, and the relationship is bidirectional: both settlements update at once.</Step>
        <Step n={3}>To bias a <em>new</em> settlement against an existing neighbour: in the Settlements tab, click <strong>Set as Neighbour</strong> on a saved settlement. The Create tab opens with that neighbour active, and the engine adjusts its economy and faction weights before generation.</Step>
        <Step n={4}>Open either settlement's <strong>Neighbours tab</strong> to see the inter-settlement picture: relationship, NPC contacts, and active engagements.</Step>
        <Step n={5}>Use <strong>Edit Names</strong> in the Settlements tab to rename any NPC or faction. Changes cascade to all linked partner records automatically.</Step>
        <Tip>Relationship types matter mechanically. A Rival suppresses overlapping exports and elevates criminal presence. A Patron creates dependency chains in the client's economy. A Cold War generates intelligence NPCs on both sides.</Tip>
      </section>

      <section style={{ ...NO_BREAK, marginBottom:SP.xl }}>
        <h2 style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, margin:'0 0 8px' }}>
          Managing Saved Settlements &amp; Campaigns
        </h2>
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

      {/* P9: this tab is entirely Settlements-tab workflow, yet it dead-ended.
          Close it on the destination it documents. Kept secondary so QuickTab's
          "Generate" stays the guide's single dominant primary (P8). */}
      <div style={{ marginTop:SECTION_GAP }}>
        <Button variant="secondary" size="lg" onClick={() => onNavigate?.('settlements')}>
          Open your Library
        </Button>
      </div>
    </div>
  );
}

function PhilosophyTab() {
  return <>
    {/* P6: front-load the one table-runnable fact (generate-in-2-minutes
        mid-session) as the single dominant focal entry — a time-pressured GM
        hits utility before mood. The "Discover your own world" manifesto is the
        tab's end-note, moved to the close below.
        P4/P9: the dark-gradient hero is no longer duplicated here; it lives once,
        on the LivingWorld upsell, so the guide has one consistent opener grammar
        (serif lead, not a dark hero on two tabs and none on six) and one peak
        surface. */}
    <Insight title="Using the Generator Mid-Session" prose lead>
      Players go somewhere you didn't prepare. Generate now, in two minutes, with settings that
      match what the region would produce: terrain, trade route, threat level, rough prosperity.
      Read the DM Summary tab. That's your brief. The institution list tells you what's there.
      The NPCs give you named people with actual motivations. The Daily Life tab tells you what
      the place feels like to arrive in. You're not improvising from nothing. You're revealing
      a place that the conditions of your world would plausibly have produced. Then you adapt it,
      as you always do.
    </Insight>

    <div style={COLS()}>
    <Insight title="Extending Your Reach into the Unmapped Parts" prose>
      Even the most detailed campaign setting has places that haven't been fully developed yet.
      The generator reaches into that unmapped space and gives you a coherent foundation to
      work from. Without the hours of manual derivation. You don't have to build every trade
      economy from scratch. Generate a baseline that makes mechanical sense for the region,
      then layer your world's specific history, culture, and context over it. The foundation
      is consistent. What you add on top is what makes it yours.
    </Insight>

    <Insight title="Discovery and Disappointment as Craft" prose>
      Sometimes the generator produces something unexpected. You imagined a cathedral town; the
      constraints gave you a garrison and a black market. That's not the tool contradicting you.
      It's offering a variation worth considering. Accept it, modify it, or reject it entirely.
      But sit with it for a moment first: why didn't the church reach this far?
      What fills the spiritual vacuum in a military settlement with a criminal undercurrent?
      The unexpected result often deepens the setting more than the expected one would have,
      precisely because you had to earn it. Disappointment, in world-building, is frequently
      the beginning of something more interesting.
    </Insight>

    <Insight title="Integration, Not Isolation" prose>
      These settlements are not self-contained islands. They are nodes in the network of your
      world. Connected to everything around them by trade, politics, history, and conflict.
      The export economy points outward: who buys what this town produces? The import
      dependencies point inward: where does what they need come from? The faction tensions
      connect to regional powers. The NPC histories reach beyond the settlement's borders.
      Use the generator's output as a starting point for those connections, not as a finished
      picture. The settlement becomes real when it has relationships with the rest of your world.
    </Insight>

    <Insight title="What the Players Experience" prose>
      When a settlement has genuine internal logic, when the blacksmith is poor because the iron
      supply chain is broken and not because the DM needed a plot point, players sense it. The town
      feels like it existed before they arrived, and like it will go on existing after they leave.
      That quality of world-presence is hard to fake and hard to manufacture
      intentionally. It emerges naturally from coherent generation. The gift to the player is
      a world that pushes back: that has gaps where the DM didn't place gaps, services where
      the conditions warranted them, and tensions that don't resolve neatly because they weren't
      written to resolve neatly.
    </Insight>

    <Insight title="Constraint as an Invitation, Not a Limit" prose>
      When a settlement doesn't have what a player is looking for, that's not a failure of
      preparation. It's the world being honest. The frontier town doesn't have Remove Curse
      because no institution here provides it. Now: who would know someone who does? How far
      would the party have to travel? What would it cost to bring that service here? The
      constraint generates the question, and the question generates the session. A world
      that always provides exactly what players need isn't a world. It's a service. The
      constraint is what makes the world feel real, and the DM's ingenuity is what makes
      the constraint feel fair.
    </Insight>

    <Insight title="Actions Have Downstream Consequences" prose>
      Every supply chain in the settlement is a chain of implications. The mill produces flour;
      the baker needs flour; the tavern buys bread; the garrison relies on the tavern for rations.
      Let the party burn the mill, hire away the miller, or choke the grain supply with a siege,
      and everything downstream degrades in sequence. The bread runs out. The garrison goes hungry.
      Morale fractures. This is mapped out in the Supply Chains and
      Viability panels. Not as flavour, but as a literal dependency graph. Before the party
      does something dramatic, you can see what they're actually touching. After they do it,
      you know exactly what breaks and in what order. The generator gives you the map of
      consequences before the players create them.
    </Insight>

    </div>

    {/* P6/P9 end-note: the "Discover your own world" manifesto is the tab's
        tone/peak close, demoted from the former dark-gradient opener to the same
        left-accent prose register as the essays above it (P4 — one opener
        grammar; the dark hero lives once on LivingWorld). Inline gold emphasis
        rides GOLD_TXT, not GOLD-as-text, to clear AA on the light card (P7). */}
    <div style={{ borderLeft:`3px solid ${GOLD}`, paddingLeft:14, marginTop:SECTION_GAP, maxWidth:PROSE_MAX, ...NO_BREAK }}>
      <h3 style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK, margin:'0 0 5px' }}>
        Discover your own world.
      </h3>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.75, margin:'0 0 10px' }}>
        The settlement that emerges from your constraints isn't one you scripted. It's one you
        uncovered. You set the conditions of your world: the terrain, the trade pressures, the
        regional history you've established. The generator derives what a settlement in those
        conditions would actually look like. What appears is genuinely new to you, even though
        you built the world it lives in.
      </p>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.75, margin:'0 0 10px' }}>
        Every explorer of their own world is bounded by three things: <strong style={{color:GOLD_TXT}}>discovery</strong>, what
        you find when you arrive; <strong style={{color:GOLD_TXT}}>disappointment</strong>, what isn't
        there; and <strong style={{color:GOLD_TXT}}>ingenuity</strong>, what you make of both. These
        aren't limitations of the tool. They're the texture of world-building done honestly.
      </p>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.75, margin:0 }}>
        Every settlement this tool produces is meant to be woven into your world, not dropped into it.
        Rename the NPCs. Adjust the factions to fit your regional politics. Keep what fits; change
        what doesn't. The generator gives you a coherent foundation. What you build on top is yours.
      </p>
    </div>
  </>;
}


function RefSection({ title, rows, onNavigate }) {
  // breakInside:avoid keeps a heading glued to its rows when the parent flows
  // these sections into multiple columns on a wide desktop card.
  return (
    <section style={{ ...NO_BREAK, marginBottom:SECTION_GAP }}>
      <h2 style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, margin:'0 0 8px' }}>{title}</h2>
      <dl style={{ margin:0 }}>
        {rows.map(([label, desc, to]) =>
          // P8/P2: rows that name a live nav destination (Create / Library / Realm
          // / Compendium) carry a `to` view-id and render as a ghost-link control
          // so the Reference tab — the densest index of in-product destinations —
          // actually routes the GM into the engine; the first click lands instead
          // of dead-ending in text. Rows without a route (sub-tabs, workflow)
          // stay plain. About is intentionally inert (it is the current page).
          to
            ? <NavRow key={label} label={label} to={to} onNavigate={onNavigate}>{desc}</NavRow>
            : <Row key={label} label={label}>{desc}</Row>)}
      </dl>
    </section>
  );
}

// A reference row whose label is a real navigation control (P8 first-click).
// The label becomes a ghost Button so it inherits the system's focus ring and
// ~32px target and stays low-emphasis — the reference is still a scan list, not
// a second primary competing with the global nav (the tab's one high-emphasis
// action is the foot CTA).
function NavRow({ label, children, to, onNavigate }) {
  return (
    <div style={{ display:'flex', gap:SP.sm, padding:'6px 0', alignItems:'baseline' }}>
      <dt style={{ minWidth:120, flexShrink:0, margin:0 }}>
        <Button variant="ghost" size="sm" onClick={() => onNavigate?.(to)}>{label}</Button>
      </dt>
      <dd style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5, margin:0 }}>{children}</dd>
    </div>
  );
}

function RefTab({ onNavigate }) {
  const sections = [
    // The third tuple element is the live view-id this label routes to; rows
    // with one render as navigable ghost controls (see RefSection / NavRow).
    // About is omitted on purpose — it is the current page, so a self-link would
    // be a decoy.
    { title: 'Navigation', rows: [
      ['Create','The generation wizard. Two modes: Basic (minimal config) and Advanced (step-by-step with full control).','generate'],
      ['Library','Your saved settlement library. Group into campaigns, link as neighbours, edit, rename, and export.','settlements'],
      ['Realm','The simulation’s home: the World Map plus the World Pulse, Chronicle, and Pantheon. Advance time and watch the region run. Reachable for everyone; the live controls are Cartographer.','realm'],
      ['Compendium','Browse the built-in catalog of institutions, archetypes, stresses, and the Living-World systems. Switch to My Custom Content to author your own.','compendium'],
      ['About','This guide covers landing, how-to, and the Living-World walkthrough.'],
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
      ['Built-in Catalog','Searchable reference for tiers, archetypes, stress types, relationship effects, the full institution catalog, and the Living-World systems (substrate, pressures, world pulse, war layer, pantheon).'],
      ['My Custom Content','Author custom institutions, resources, stressors, trade goods, plus deities and factions for the simulation. Custom items appear in the editor catalog with a purple badge. Authoring is a Cartographer feature.'],
    ]},
    { title: 'The Living World (Realm)', rows: [
      ['Advance Time','Push the campaign forward a month at a time. The whole region responds at once: wars, faiths, trade, population all shift; each change carries a why-trace, so you always know what moved and why. Off by default, opt-in, reversible.'],
      ['War Layer','Sieges, coalitions, conquest, and trade wars. War drains the economy and burns war-exhaustion, which drives the realm back to peace without needing a script. Toggle it on in the simulation rules.'],
      ['Pantheon','Assign a primary deity and the living pantheon awakens: deities contest converts, win seats, and rise from cult to major. Faith couples back into corruption, aggression, and magic legality.'],
      ['Chronicle','A scrubbable history of every advance, derived from the pulse record. Click a headline to highlight the settlements it touched.'],
    ]},
  ];
  // P12/P5: one readable column. Newspaper COLS() scattered each label→desc Row
  // and split the 12-row "Settlement Detail Tabs" list across columns, breaking
  // the lookup. Single PROSE_MAX column keeps every key→value pair intact; SP.xl
  // between sections (set on RefSection) carries the grouping.
  return (
    <div style={{ maxWidth:PROSE_MAX, margin:'0 auto' }}>
      {sections.map(s => <RefSection key={s.title} title={s.title} rows={s.rows} onNavigate={onNavigate} />)}
    </div>
  );
}

// How We Compare — the comparison content, folded in from the former
// standalone /compare pages (which now redirect here). Honest, side-by-side
// framing: what each alternative does well, and where SettlementForge fits.
function CompareTab() {
  return (
    <div style={{ maxWidth: PROSE_MAX, margin:'0 auto' }}>
      <h2 style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK, margin:'0 0 10px' }}>
        How SettlementForge compares
      </h2>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 14px' }}>
        Three side-by-side breakdowns against the tools DMs commonly weigh. Each is upfront about
        what the other tool does well, and where SettlementForge sits alongside it rather than
        against it.
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
        Map-first tools are first-class map and hex editors: terrain, regions, the shape of the
        world. They don't simulate what lives inside a settlement. The two are complementary.
        Draw the map in a map tool, then populate its towns with SettlementForge's simulated
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
      {/* P8/P9: a comparison surface exists to convert the comparer. Folding the
          old /compare pages here dropped their only conversion exit — restore one
          region-primary so the tab closes on a runnable next step. */}
      <div style={{ marginTop:SP.xl }}>
        <Button variant="primary" size="lg" onClick={() => navigate('generate')}>
          Forge a settlement
        </Button>
      </div>
    </div>
  );
}

function FaqTab() {
  return (
    <div style={{ maxWidth: PROSE_MAX, margin:'0 auto' }}>
      <h2 style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:600, color:INK, margin:'0 0 10px' }}>
        Frequently asked questions
      </h2>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 14px' }}>
        Credits, billing, gallery privacy, and how the simulator relates to AI. Account-specific
        controls (your plan, credit balance, billing portal) live on your Account page.
      </p>
      <AccountFAQ />
    </div>
  );
}

// Single source of truth for the active tab body, so the shell never holds two
// divergent copies of the dispatch (the old non-standalone branch did, and it
// drifted). Keyed by tab id.
function TabPanel({ id, onNavigate }) {
  switch (id) {
    case 'quick':   return <QuickTab />;
    case 'power':   return <PowerTab onNavigate={onNavigate} />;
    case 'living':  return <LivingWorldTab />;
    case 'logic':   return <UnderTheHoodTab onNavigate={onNavigate} />;
    case 'phil':    return <PhilosophyTab />;
    case 'ref':     return <RefTab onNavigate={onNavigate} />;
    case 'compare': return <CompareTab />;
    case 'faq':     return <FaqTab />;
    default:        return <QuickTab />;
  }
}

export default function HowToUse({ onNavigate = navigate } = {}) {
  // `onNavigate` is threaded from App (onNavigate={setView}, which is the
  // module-level navigate); it defaults to that same navigate so a direct
  // render (tests, Storybook) still routes. The Reference tab's nav rows and
  // the per-tab closers route through it.
  // Open straight to a requested tab via ?tab= (e.g. /compare links redirect
  // here with ?tab=compare; the Account page links to ?tab=faq). Falls back to
  // Quick Start for any unknown value.
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const tab = new URLSearchParams(window.location.search).get('tab');
      return TABS.some(t => t.id === tab) ? tab : 'quick';
    } catch { return 'quick'; }
  });

  // Roving arrow-key navigation across the tablist (POUR keyboard operability).
  const onTabKeyDown = (e) => {
    const i = TABS.findIndex(t => t.id === activeTab);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = e.key === 'ArrowRight' ? (i + 1) % TABS.length : (i - 1 + TABS.length) % TABS.length;
      setActiveTab(TABS[next].id);
    } else if (e.key === 'Home') {
      e.preventDefault(); setActiveTab(TABS[0].id);
    } else if (e.key === 'End') {
      e.preventDefault(); setActiveTab(TABS[TABS.length - 1].id);
    }
  };

  return (
    // P12: the shared Page primitive supplies the centered, capped width frame
    // (layout.page) every standalone surface uses, so this file no longer rolls
    // its own `maxWidth/margin/width` shell. The PageHeader gives the About
    // surface a focal eyebrow + serif title + italic subtitle (the simulation
    // thesis), matching the template's clean-parchment reference. Below it sits
    // the bordered tab card. No full-height cream fill — short tabs let the
    // parchment painting show through to the footer.
    <Page max={layout.page}>
      <PageHeader
        id="howto-page-title"
        eyebrow={t('aboutLiving.headerEyebrow')}
        title={t('aboutLiving.headerTitle')}
        subtitle={t('aboutLiving.thesis')}
      />
      <div style={{ background:CARD, border:`1px solid ${BOR}`, borderRadius:R.xl,
        boxShadow:ELEV[1], overflow:'hidden' }}>
        {/* Tab bar */}
        <div className="tab-strip" role="tablist" aria-label="Guide sections"
          style={{ display:'flex', background:PARCH, borderBottom:`1px solid ${BOR}`,
          overflowX:'auto' }}>
          {TABS.map(({ id, label }) => {
            const selected = activeTab === id;
            return (
              <button key={id} type="button" role="tab" id={`howto-tab-${id}`}
                aria-selected={selected} aria-controls={`howto-panel-${id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(id)} onKeyDown={onTabKeyDown}
                style={{ display:'flex', alignItems:'center', padding:'12px 18px',
                  // P7/Fitts: lift to the ~44px at-the-table tap target (the 12px
                  // vertical padding nearly got there; minHeight does the rest
                  // without changing the visual rhythm). Buttons stay raw for the
                  // roving-tabindex tablist semantics.
                  minHeight:44,
                  background: selected ? CARD : 'transparent',
                  border:'none', borderBottom: selected ? `2px solid ${GOLD}` : '2px solid transparent',
                  // P7: inactive labels ride BODY (MUT failed AA on parchment); the
                  // active tab still wins via >=2 channels — weight 700 + underline + INK.
                  cursor:'pointer', color: selected ? INK : BODY, fontFamily:sans,
                  fontSize:FS.sm, fontWeight:selected?700:500, whiteSpace:'nowrap',
                  WebkitTapHighlightColor:'transparent', flexShrink:0 }}>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        {/* Content — the card is layout.page wide. P12: a single centered inner
            frame caps every tab at one width and centers it, so switching tabs
            no longer jumps the column from 820 to ~1150 and back. Prose tabs
            hold the narrower PROSE_MAX reading measure inside this frame; the
            multi-column tabs fill it. The cap + `margin:0 auto` lives here once
            instead of being re-derived (or omitted) per tab. */}
        <div role="tabpanel" id={`howto-panel-${activeTab}`} aria-labelledby={`howto-tab-${activeTab}`}
          style={{ padding:`${SP.xxl}px ${SP.xxl + SP.xs}px` }}>
          <div style={{ maxWidth:CONTENT_MAX, margin:'0 auto' }}>
            <TabPanel id={activeTab} onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </Page>
  );
}
