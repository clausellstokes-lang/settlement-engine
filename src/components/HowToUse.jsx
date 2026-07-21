import { useState } from 'react';
import { Zap, Star, List, Scale, HelpCircle, Globe } from 'lucide-react';
import { GOLD, GOLD_TXT, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, PARCH, PAGE_MAX, PROSE_MAX, sans, serif_, FS, swatch } from './theme.js';
import { ANON_MAX_SIZE_LABEL } from '../config/tierFacts.js';
import { useFlag } from '../lib/flags.js';
import AccountFAQ from './account/AccountFAQ.jsx';
import LivingWorldTab from './howto/LivingWorldTab.jsx';
import AboutManifesto from './howto/AboutManifesto.jsx';
// V-26b: the house-voice draft of the handbook narrative, rendered only when the
// (default-off) `handbookVoice` flag is on. Rides this already-lazy chunk (zero eager).
import { VoicedConceptIntro, VOICED_HEADER } from './howto/HandbookVoiced.jsx';

// Responsive multi-column container for card/list-heavy tab content. Uses
// `column-width` (not a fixed count) so it fills a wide desktop card with as
// many ~COL-wide columns as fit, and collapses to a single column on narrow
// screens / the embedded (non-standalone) help panel — no media queries
// needed. Direct children opt out of mid-column splitting with breakInside.
const COLS = (col = 340) => ({ columnWidth: `${col}px`, columnGap: '22px' });
const NO_BREAK = { breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' };


// The Keeper's Handbook tabs — the PRACTICAL guide that sits below the About
// manifesto (the trust page). "Under the Hood" (the derivation mechanics) and
// "DM Philosophy" were folded UP into the manifesto (the mechanism + philosophy
// bands) and their tabs retired; the orphaned howto/UnderTheHoodTab.jsx was reaped.
const TABS = [
  { id:'quick',  label:'Quick Start',   Icon: Zap },
  { id:'power',  label:'Power User',    Icon: Star },
  // "The Living World" bridges the static dossier to the premium living simulation.
  { id:'living', label:'The Living World', Icon: Globe },
  { id:'ref',    label:'Reference',     Icon: List },
  { id:'compare',label:'How We Compare',Icon: Scale },
  { id:'faq',    label:'FAQ',           Icon: HelpCircle },
];

function Insight({ title, children }) {
  return (
    <div style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${GOLD}`,
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
      borderLeft:`3px solid ${GOLD}`, marginTop:12 }}>
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

  // V-26b: only the CONCEPT ESSAY (the coda) forks to the house voice; the numbered
  // steps below are clarity-mandated and stay plain in both states.
  const voiced = useFlag('handbookVoice');

  const conceptIntro = (
    <div style={{ padding:'12px 14px', background:'linear-gradient(135deg,#1c1409 0%,#2d1f0e 100%)',
      marginBottom:14 }}>
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
      <Step n={2}>Pick a <strong>tier</strong>. Hamlet or Village for a small roadside settlement, Town for a proper community. Free mode (no account) reaches up to {ANON_MAX_SIZE_LABEL}; sign in to unlock City and Metropolis.</Step>
      <Step n={3}>Pick a <strong>trade route</strong>. Road is the safe default. Port and Crossroads produce richer economies. Pick a <strong>nearby terrain</strong>. Forests, mountains, and coastlines affect what resources appear and which supply chains are viable.</Step>
      <div style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start', paddingLeft:32 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:swatch['#B8860B'], flexShrink:0, marginTop:7 }}/>
        <p style={{ fontSize: FS['12.5'], color:swatch['#5A3A00'], lineHeight:1.6, margin:0, fontStyle:'italic' }}>Looking for a specific service? If you need <em>Remove Curse</em>, <em>Healing</em>, or any institutional service, search for it in the <strong>Compendium → Institutions</strong> tab, find the institution that provides it, then use Advanced Generate to force that institution in the <strong>Institutions</strong> step.</p>
      </div>
      <Step n={4}>Hit <strong>Generate</strong>. Read the <strong>DM Summary</strong> tab first. It gives you the one-paragraph version ready for the table.</Step>
      <Step n={5}>Browse <strong>NPCs</strong> and <strong>Power</strong> tabs to build your session picture. The Power tab shows public legitimacy, faction relationships, and — where relevant — legacy annotations connecting the settlement's history to its current power structure. Daily Life is for mid-session quick reference.</Step>
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
        {voiced ? <VoicedConceptIntro /> : conceptIntro}
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
        <Tip>Relationship types matter mechanically. A Rival crowds into the same export markets, hardens the military posture, and seeds embedded agents and saboteur factions. A Patron creates dependency chains in the client's economy. A Cold War seeds clandestine intelligence factions — deep-cover operatives, commercial fronts — on both sides.</Tip>
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

// GUIDE-2b — the Keeper's Handbook DELEGATES its reference lookups to the
// Compendium (design §6c: "Reference delegating to the Compendium"). Rather
// than re-describing the catalog in prose that drifts from the live registries,
// the Reference tab now DEEP-LINKS into the Compendium — the reference spine
// that renders each catalog from code (its ?tab= deep-links already exist,
// CompendiumPanel honours them on mount). These stay the plain, findable rescue
// lifeline (§0 precedence guard: the lifeline stays boring and findable — plain
// links, never the Surveyor persona costume).
const COMPENDIUM_TABS = [
  ['tiers', 'Tiers & Routes', 'Size tiers, trade routes, and what each unlocks.'],
  ['economy', 'Economy', 'Exports, imports, prosperity, and supply chains.'],
  ['power', 'Power & Factions', 'Government types, faction blocs, and legitimacy.'],
  ['arcane', 'Magic & Religion', 'Arcane institutions, deities, and faith systems.'],
  ['living', 'Living World', 'The simulation verbs, dials, and how a region moves.'],
  ['stress', 'Stress', 'Stressors, severity, and how compound conditions read.'],
  ['neighbour', 'Neighbour System', 'Relationship types and their mechanical effects.'],
  ['institutions', 'Institutions', 'The full institution catalog and what each provides.'],
];

function CompendiumLink({ tab, label, desc }) {
  return (
    <a
      href={`/compendium?tab=${tab}`}
      style={{ display:'block', padding:'6px 0', borderBottom:`1px solid ${BOR}`, textDecoration:'none' }}
    >
      <span style={{ fontSize:FS.sm, fontWeight:700, color:GOLD, textDecoration:'underline', textUnderlineOffset:3 }}>{label}</span>
      <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5, marginLeft:8 }}>{desc}</span>
    </a>
  );
}

function RefTab() {
  const sections = [
    { title: 'Navigation', rows: [
      ['Create','The generation wizard. Two modes: Basic (minimal config) and Advanced (step-by-step with full control).'],
      ['Settlements','Your saved settlement library. Group into campaigns, link as neighbours, edit, rename, and export.'],
      ['World Map','Embedded fantasy map. Drag saved settlements onto it to place them geographically. Toggle relationship and supply-chain overlays.'],
      ['Compendium','The reference spine — every catalog rendered live from the engine. See the deep-links below.'],
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
  ];
  return (
    <div style={COLS(360)}>
      {/* Reference lookups delegate to the Compendium — the live catalog spine. */}
      <section style={{ ...NO_BREAK, marginBottom:16 }}>
        <div style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:600, color:INK, margin:'0 0 4px' }}>Look it up in the Compendium</div>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, margin:'0 0 8px' }}>
          Every catalog — tiers, institutions, stresses, factions, the living-world verbs — is rendered
          live from the engine in the <a href="/compendium" style={{ color:GOLD, textDecoration:'underline', textUnderlineOffset:3 }}>Compendium</a>,
          so the reference can never drift from what the simulator actually does. Jump straight to a section:
        </p>
        {COMPENDIUM_TABS.map(([tab, label, desc]) => <CompendiumLink key={tab} tab={tab} label={label} desc={desc} />)}
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, margin:'8px 0 0' }}>
          Build your own institutions, resources, stressors, and presets under{' '}
          <a href="/compendium?mode=custom" style={{ color:GOLD, textDecoration:'underline', textUnderlineOffset:3 }}>My Custom Content</a> —
          custom items appear in the Settlement Editor catalog and persist to your browser.
        </p>
      </section>
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
  // V-26b: the handbook header narrative forks to the house voice when the flag is on;
  // OFF (default) renders the exact current strings. The Compendium link stays plain and
  // present in both (findability is clarity).
  const voiced = useFlag('handbookVoice');
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
    // The About TRUST PAGE leads (the manifesto), with the practical Keeper's
    // Handbook (the tabbed guide) below it. Centered, shared-width; short tabs let
    // the parchment painting show through to the footer (no dead cream rectangle).
    <div style={{ maxWidth: PAGE_MAX, margin:'0 auto', width:'100%' }}>
      <AboutManifesto />

      {/* THE KEEPER'S HANDBOOK — the practical, day-to-day guide. */}
      <div style={{ maxWidth: PROSE_MAX, margin:'44px auto 14px' }}>
        <div style={{ fontFamily:sans, fontSize:FS.xs, fontWeight:800, letterSpacing:'0.14em',
          textTransform:'uppercase', color:GOLD_TXT, marginBottom:6 }}>{voiced ? VOICED_HEADER.eyebrow : 'The practical guide'}</div>
        <h2 style={{ fontFamily:serif_, fontSize:FS['22'], fontWeight:600, color:INK, margin:0, lineHeight:1.2 }}>
          {voiced ? VOICED_HEADER.title : <>The Keeper&rsquo;s Handbook</>}
        </h2>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'6px 0 0', fontFamily:sans }}>
          {voiced ? VOICED_HEADER.subtitleLead : 'How to drive the generator, day to day. Look any rule or catalog up in the '}
          <a href="/compendium" style={{ color:GOLD_TXT, textDecoration:'underline', textUnderlineOffset:3, fontWeight:600 }}>Compendium</a>{voiced ? VOICED_HEADER.subtitleTail : '.'}
        </p>
      </div>

      <div style={{ background:CARD, border:`1px solid ${BOR}`,
        overflow:'hidden' }}>
        {/* Tab bar */}
        <div className="tab-strip" role="tablist" aria-label="Guide sections"
          style={{ display:'flex', background:PARCH, borderBottom:`1px solid ${BOR}`,
          overflowX:'auto' }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} type="button" role="tab" onClick={() => setActiveTab(id)}
              aria-selected={activeTab===id}
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
          {activeTab==='living' && <LivingWorldTab />}
          {activeTab==='ref'   && <RefTab />}
          {activeTab==='compare' && <CompareTab />}
          {activeTab==='faq' && <FaqTab />}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ overflow:'hidden' }}>
      <>
        {/* Tab bar */}
        <div role="tablist" aria-label="Guide sections"
          style={{ display:'flex', background:PARCH, borderBottom:`1px solid ${BOR}`, overflowX:'auto' }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} type="button" role="tab" onClick={() => setActiveTab(id)}
              aria-selected={activeTab===id}
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
          {activeTab==='living' && <LivingWorldTab />}
          {activeTab==='ref'   && <RefTab />}
          {activeTab==='compare' && <CompareTab />}
          {activeTab==='faq' && <FaqTab />}
        </div>
      </>
    </div>
  );
}
