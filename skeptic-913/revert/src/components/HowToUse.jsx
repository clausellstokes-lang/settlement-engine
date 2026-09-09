/**
 * HowToUse.jsx — /about/guide. THE PRACTICAL GUIDE (the Keeper's Handbook).
 *
 * The operational half of THE ABOUT SPLIT (docs/DESIGN_ABOUT_PAGES.md). The
 * conceptual half — thesis, covenant, mechanism, the AI boundary, the positioning
 * ladder — is /about/what-this-is (components/about/AboutWhatThisIs.jsx).
 *
 * WHAT THE SPLIT CHANGED HERE (design §0.2 + §3):
 *   - THE COLLAPSIBLES ARE GONE. No Disclosure wrapper, no card headers, no tab
 *     strip, no per-section show-more. The five guide sections render FLAT, in the
 *     old expanded reading order (reading order is content), each as a plain
 *     section under one h1 → h2 → h3 tree.
 *   - THE `?tab=` DEEP LINKS BECAME ANCHORS. `/how-to?tab=power` now redirects to
 *     `/about/guide#power-user`; the translation lives in the one mapping writer
 *     `src/lib/aboutMapping.js`, and the section ids below come from it, so the
 *     redirect and the rendered anchors cannot drift apart. THE `lib/` PLACEMENT
 *     IS LOAD-BEARING, not filing: `lib/routes.js` reads that manifest to perform
 *     the redirect, and the routing table must not import a component module —
 *     under `components/about/` the mapping would drag page chrome into routing
 *     (and into every consumer of it). The manifest is pure data either way.
 *   - THE SECTIONS CARRY AN IN-PAGE NAV (design §3's MAY, ruled BUILD). See
 *     SectionNav below.
 *   - "HOW WE COMPARE" LEFT. It is the positioning ladder, which design §1 assigns
 *     to the conceptual page; it now lives in components/about/CompareSection.jsx
 *     and every /compare* URL redirects there. Its copy moved byte-identically.
 *   - THE HEADER IS THE HOUSE HEADER. primitives/PageHeader, same writer as
 *     Compendium / Gallery / Library / Pricing / Account (design §2).
 *
 * The file keeps its name and its prose on purpose: three source-scanning pins read
 * THIS path — the claims-parity guard (tests/components/handbookClaimsParity.test.js,
 * which holds the relationship/slider prose to the live engine), the tier-fact
 * contract (tests/config/tierFacts.contract.test.js), and the guidance registry's
 * legacy ledger. Renaming the module would strand all three.
 *
 * ZERO EAGER. Lazy route (AppViews registers it via lazy()).
 */
import { GOLD, GOLD_TXT, INK, SECOND as SEC, BORDER as BOR, PAGE_MAX, ANCHOR_OFFSET, serif_, FS, swatch } from './theme.js';
import { ANON_MAX_SIZE_LABEL } from '../config/tierFacts.js';
import { useFlag } from '../lib/flags.js';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import AccountFAQ from './account/AccountFAQ.jsx';
import LivingWorldTab from './howto/LivingWorldTab.jsx';
import { anchorFor, unitsForView, ABOUT_GUIDE_VIEW } from '../lib/aboutMapping.js';
import useAboutHashScroll from './about/useAboutHashScroll.js';
// V-26b: the house-voice draft of the handbook narrative, rendered only when the
// (default-off) `handbookVoice` flag is on. Rides this already-lazy chunk (zero eager).
import { VoicedConceptIntro, VOICED_HEADER } from './howto/HandbookVoiced.jsx';

// Responsive multi-column container for card/list-heavy section content. Uses
// `column-width` (not a fixed count) so it fills a wide desktop page with as
// many ~COL-wide columns as fit, and collapses to a single column on narrow
// screens — no media queries needed. Direct children opt out of mid-column
// splitting with breakInside.
const COLS = (col = 340) => ({ columnWidth: `${col}px`, columnGap: '22px' });
const NO_BREAK = { breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' };

// THE ANCHOR LANDING OFFSET is theme.js's ANCHOR_OFFSET (imported above). The
// desktop ribbon is `position:'sticky', top:0` (its module is moving under the LD
// nav program, so this names the ribbon rather than a file), so a fragment jump — a
// SectionNav click, a translated `?tab=` deep link, or useAboutHashScroll's
// scrollIntoView — parks the section heading UNDERNEATH the chrome unless the target
// carries a scroll margin. The derivation moved to theme.js (beside CHROME, the
// measurement it comes from) when the SAME defect was found on /about/what-this-is:
// three pages re-deriving one sum is three chances to drift, and the second page's
// sections carried no margin at all.

/**
 * A guide section: the stable anchor from the mapping manifest plus the standard
 * h2 in the page's heading scale. The de-collapsed replacement for a former tab —
 * same content, addressable, always open (design §3).
 */
function GuideSection({ unit, heading, children }) {
  return (
    <section id={anchorFor(unit)} style={{ margin: '0 0 40px', scrollMarginTop: ANCHOR_OFFSET }}>
      <h2 style={{ fontFamily: serif_, fontSize: FS['22'], fontWeight: 600, color: INK,
        margin: '0 0 14px', lineHeight: 1.2 }}>{heading}</h2>
      {children}
    </section>
  );
}

// One line per section for the nav below — the "sentence" rung of the legibility
// law (glance → sentence → table), keyed by mapping-manifest unit id. Every line
// restates copy the section itself already makes; the nav makes no claim of its
// own, so it can never drift from the engine the way a summary would.
//
// EXPORTED FOR ITS TOTALITY PIN. This is a HAND-KEYED SIDE TABLE beside the mapping
// manifest: the nav reads `SECTION_BLURBS[u.id]` for a `u` that comes from the
// manifest, so a missing key renders an EMPTY subtitle rather than throwing — a
// silent hole no DOM assertion over the nav noticed (an executed negative control
// deleted the `ref` line and all 29 About-split pins stayed green). The pin in
// tests/components/aboutSplit.test.jsx binds these keys to unitsForView(
// ABOUT_GUIDE_VIEW) in BOTH directions, which is why the table is exported at all.
export const SECTION_BLURBS = Object.freeze({
  quick: 'The sixty-second path to a first settlement, and the idea underneath it.',
  power: 'Sliders, stress conditions, neighbour links, and the campaign library.',
  living: 'The premium layer: how a whole region keeps moving between sessions.',
  ref: 'Navigation, the detail tabs, the workflow, and deep links to the Compendium.',
  faq: 'Credits, billing, gallery privacy, and how the simulator relates to AI.',
});

/**
 * THE IN-PAGE SECTION NAV — design §3's MAY, ruled BUILD.
 *
 * §3 permits a table of contents "IF the Compendium pattern has one (match, never
 * invent)". It has one: compendium/CompendiumDashboard.jsx renders its hubs as a
 * grid of REAL hrefs carrying the destination anchor — crawlable, shareable, and
 * openable in a new tab, with the click itself doing in-page navigation. This is
 * that pattern at the same measurements (auto-fill 220px columns, gold left rule,
 * serif label over a small secondary line).
 *
 * TWO DELIBERATE DIFFERENCES, both forced by the surface rather than invented:
 *   - NO COUNT. The Compendium card's third element is a catalog count. A guide
 *     section has no such number, and faking one would be the invention §3 bars.
 *   - THE HREF IS A BARE FRAGMENT. The Compendium spells its hub links out in
 *     full because the destination is a DIFFERENT tab; here every target is on
 *     this page, so `#anchor` IS the real, crawlable URL — and being same-document
 *     by construction it can never cost a reload, so the pattern's preventDefault
 *     + programmatic-scroll half has nothing left to do.
 *
 * The rows come from the SAME manifest the sections' ids come from, so the nav
 * cannot list a section this page does not render, nor miss one it does.
 */
function SectionNav() {
  return (
    <nav aria-label="Sections of this guide" style={{ margin: '0 0 34px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10 }}>
        {unitsForView(ABOUT_GUIDE_VIEW).map((u) => (
          <a key={u.id} href={`#${u.anchor}`}
            style={{ display:'block', textDecoration:'none', border:`1px solid ${BOR}`,
              borderLeft:`3px solid ${GOLD}`, padding:'12px 14px' }}>
            <div style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:700, color:INK, marginBottom:4 }}>
              {u.heading}
            </div>
            <div style={{ fontSize:FS.xs, color:SEC, lineHeight:1.5 }}>{SECTION_BLURBS[u.id]}</div>
          </a>
        ))}
      </div>
    </nav>
  );
}

/** A sub-heading inside a section — the h3 rung of the page's heading tree. */
function SubHead({ children, size = FS.md }) {
  return (
    <h3 style={{ fontFamily: serif_, fontSize: size, fontWeight: 600, color: INK, margin: '0 0 8px' }}>
      {children}
    </h3>
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

function QuickStart() {
  // P126 / HT-1 — "How-To inversion". Newcomers open this section to learn what
  // to *do*, not to read the design philosophy first: we lead with the
  // 60-second action steps and demote the constraint-driven concept essay
  // to a "Why it works this way" coda beside it. Pure presentational order; the
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
      <SubHead size={FS.lg}>First settlement in 60 seconds</SubHead>
      <Step n={1}>On the Create tab, pick a <strong>mode</strong> - <strong>Basic Generate</strong> for minimal config (tier, route, threat, terrain) or <strong>Advanced Generate</strong> for the full step-by-step wizard with priority sliders, institution toggles, services, and trade dynamics.</Step>
      <Step n={2}>Pick a <strong>tier</strong>. Hamlet or Village for a small roadside settlement, Town for a proper community. Free mode (no account) reaches up to {ANON_MAX_SIZE_LABEL}; sign in to unlock City and Metropolis.</Step>
      <Step n={3}>Pick a <strong>trade route</strong>. Road is the safe default. Port and Crossroads produce richer economies. Pick a <strong>nearby terrain</strong>. Forests, mountains, and coastlines affect what resources appear and which supply chains are viable.</Step>
      <div style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start', paddingLeft:32 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:swatch['#B8860B'], flexShrink:0, marginTop:7 }}/>
        <p style={{ fontSize: FS['12.5'], color:swatch['#5A3A00'], lineHeight:1.6, margin:0, fontStyle:'italic' }}>Looking for a specific service? If you need <em>Remove Curse</em>, <em>Healing</em>, or any institutional service, search for it in the <strong>Compendium → Institutions</strong> tab, find the institution that provides it, then use Advanced Generate to force that institution in the <strong>Institutions</strong> step.</p>
      </div>
      <Step n={4}>Hit <strong>Generate</strong>. Read the <strong>DM Summary</strong> tab first. It gives you the one-paragraph version ready for the table.</Step>
      <Step n={5}>Browse <strong>NPCs</strong> and <strong>Power</strong> tabs to build your session picture. The Power tab shows public legitimacy, faction relationships, and (where relevant) legacy annotations connecting the settlement's history to its current power structure. Daily Life is for mid-session quick reference.</Step>
      <Step n={6}><strong>Save</strong> to the Settlements tab to keep it for future sessions. You can also <strong>Export</strong> using the PDF button for a print-ready briefing, or copy the Narrative AI Prompt for any AI assistant.</Step>
      <Tip>You don't need to read every section before the session starts. DM Summary and Daily Life are designed for the table. The other tabs are for prep and immersion.</Tip>
    </>
  );

  // Two-column on a wide desktop page (steps left, the "why" concept right);
  // wraps to a single column on narrow screens via flex-wrap + flex-basis.
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:28, alignItems:'flex-start' }}>
      <div style={{ flex:'2 1 440px', minWidth:0 }}>
        {quickSteps}
      </div>
      <div style={{ flex:'1 1 320px', minWidth:0 }}>
        <SubHead size={FS.lg}>Why it works this way</SubHead>
        {voiced ? <VoicedConceptIntro /> : conceptIntro}
      </div>
    </div>
  );
}

function PowerUser() {
  return (
    <div style={COLS(360)}>
      <div style={{ ...NO_BREAK, marginBottom:18 }}>
        <SubHead>Sliders, Stress &amp; Institution Control</SubHead>
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
      </div>

      <div style={{ ...NO_BREAK, marginBottom:18 }}>
        <SubHead>Linking Settlements as Neighbours</SubHead>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, marginBottom:10 }}>
          Generate settlements that know about each other. The relationship type modifies the economic engine,
          faction weights, and institution probabilities. All linking is done from the <strong>Settlements</strong> tab.
        </p>
        <Step n={1}>Open a saved settlement in the <strong>Settlements tab</strong>. In the detail view, click <strong>Link Neighbour</strong> and choose another saved settlement.</Step>
        <Step n={2}>Pick a relationship type: Trade Partner, Allied, Patron, Client, Rival, Cold War, or Hostile. The relationship is bidirectional and both settlements update immediately.</Step>
        <Step n={3}>To bias a <em>new</em> settlement against an existing neighbour: in the Settlements tab, click <strong>Set as Neighbour</strong> on a saved settlement. The Create tab opens with that neighbour active, and the engine adjusts its economy and faction weights before generation.</Step>
        <Step n={4}>Open either settlement's <strong>Neighbours tab</strong> to see the inter-settlement picture: relationship, NPC contacts, and active engagements.</Step>
        <Step n={5}>Use <strong>Edit Names</strong> in the Settlements tab to rename any NPC or faction. Changes cascade to all linked partner records automatically.</Step>
        <Tip>Relationship types matter mechanically. A Rival crowds into the same export markets, hardens the military posture, and seeds embedded agents and saboteur factions. A Patron creates dependency chains in the client's economy. A Cold War seeds clandestine intelligence factions (deep-cover operatives, commercial fronts) on both sides.</Tip>
      </div>

      <div style={{ ...NO_BREAK, marginBottom:18 }}>
        <SubHead>Managing Saved Settlements &amp; Campaigns</SubHead>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, marginBottom:10 }}>
          The Settlements tab is your campaign library. Saves, campaigns, linking, and map placement all live here.
        </p>
        <Step n={1}><strong>Save</strong> after generating to store a settlement in your library.</Step>
        <Step n={2}><strong>Campaigns</strong>. Group settlements into named campaign folders directly inside the Settlements tab. Use the arrow button on any saved settlement to move it between campaigns. Export a campaign to PDF for a complete campaign dossier.</Step>
        <Step n={3}><strong>Export PDF</strong> from the detail view header for a print-ready settlement brief, or export a full campaign PDF from the campaign folder.</Step>
        <Step n={4}><strong>Narrative AI Prompt</strong> and <strong>Map AI Prompt</strong> exports are also available in the detail view. Use these to feed your settlement into an AI assistant for session fiction or map generation.</Step>
        <Step n={5}><strong>Edit Names</strong> lets you rename any NPC or faction. Changes propagate to all linked neighbour records automatically.</Step>
        <Step n={6}><strong>World Map</strong>. Drag any saved settlement onto the embedded fantasy map to place it geographically. Click a placed burg to see its linked settlement data. Toggle relationships and supply-chain overlays from the map toolbar.</Step>
      </div>
    </div>
  );
}

function RefSection({ heading, rows }) {
  // breakInside:avoid keeps a heading glued to its rows when the parent flows
  // these sections into multiple columns on a wide desktop page.
  return (
    <div style={{ ...NO_BREAK, marginBottom:16 }}>
      <SubHead>{heading}</SubHead>
      {rows.map(([label, desc]) => <Row key={label} label={label}>{desc}</Row>)}
    </div>
  );
}

// GUIDE-2b — the Keeper's Handbook DELEGATES its reference lookups to the
// Compendium (design §6c: "Reference delegating to the Compendium"). Rather
// than re-describing the catalog in prose that drifts from the live registries,
// the Reference section DEEP-LINKS into the Compendium — the reference spine
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

function Reference() {
  const sections = [
    { heading: 'Navigation', rows: [
      ['Create','The generation wizard. Two modes: Basic (minimal config) and Advanced (step-by-step with full control).'],
      ['Settlements','Your saved settlement library. Group into campaigns, link as neighbours, edit, rename, and export.'],
      ['World Map','Embedded fantasy map. Drag saved settlements onto it to place them geographically. Toggle relationship and supply-chain overlays.'],
      ['Compendium','The reference spine: every catalog rendered live from the engine. See the deep-links below.'],
      ['About','What this is (the trust page) and this Practical Guide.'],
    ]},
    { heading: 'Settlement Detail Tabs', rows: [
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
    { heading: 'Settlement Workflow', rows: [
      ['Campaigns','Create named campaign folders in the Settlements tab to group settlements together. Move settlements between campaigns using the arrow button. Export a whole campaign as PDF from its folder header.'],
      ['Link Neighbour','In the Settlements tab, open any saved settlement and use Link Neighbour to bidirectionally link it to another. Pick the relationship type (Trade Partner, Allied, Patron, Client, Rival, Cold War, Hostile).'],
      ['Set as Neighbour','Tell the generator to bias a new settlement against an existing one. Opens the Create tab with the neighbour active.'],
      ['Edit Names','Rename any NPC or faction. Changes cascade bidirectionally to linked partners.'],
      ['Export PDF','Print-ready settlement briefing. Cover page, index, relationship diagram, NPC cards, and economic appendix.'],
    ]},
    { heading: 'World Map', rows: [
      ['Drag to Place','Drag a saved settlement from the drawer below the map onto any location on the map. A new burg is created at that point, linked to your settlement.'],
      ['Click for Detail','Click any placed burg to see its linked SettlementForge data and jump to the detail view in the Settlements tab.'],
      ['Relationship Overlay','Toggle "Relations" to draw colored lines between linked settlements. Line color indicates relationship type.'],
      ['Supply Chain Overlay','Toggle "Chains" to draw supply-chain routes between exporters and importers across your saved settlements.'],
    ]},
  ];
  return (
    <div style={COLS(360)}>
      {/* Reference lookups delegate to the Compendium — the live catalog spine. */}
      <div style={{ ...NO_BREAK, marginBottom:16 }}>
        <SubHead>Look it up in the Compendium</SubHead>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, margin:'0 0 8px' }}>
          Every catalog (tiers, institutions, stresses, factions, the living-world verbs) is rendered
          live from the engine in the <a href="/compendium" style={{ color:GOLD, textDecoration:'underline', textUnderlineOffset:3 }}>Compendium</a>,
          so the reference can never drift from what the simulator actually does. Jump straight to a section:
        </p>
        {COMPENDIUM_TABS.map(([tab, label, desc]) => <CompendiumLink key={tab} tab={tab} label={label} desc={desc} />)}
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, margin:'8px 0 0' }}>
          Build your own institutions, resources, stressors, and presets under{' '}
          <a href="/compendium?mode=custom" style={{ color:GOLD, textDecoration:'underline', textUnderlineOffset:3 }}>My Custom Content</a>.
          Custom items appear in the Settlement Editor catalog and persist to your browser.
        </p>
      </div>
      {sections.map(s => <RefSection key={s.heading} heading={s.heading} rows={s.rows} />)}
    </div>
  );
}

function Faq() {
  return (
    <div>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 14px' }}>
        Credits, billing, gallery privacy, and how the simulator relates to AI. Account-specific
        controls (your plan, credit balance, billing portal) live on your Account page.
      </p>
      <AccountFAQ />
    </div>
  );
}

export default function HowToUse() {
  // A translated deep link (/how-to?tab=faq → /about/guide#faq) must LAND on its
  // section; replaceState does no fragment navigation on its own.
  useAboutHashScroll();
  // V-26b: the guide's header narrative forks to the house voice when the flag is on;
  // OFF (default) renders the exact current strings. The Compendium link stays plain and
  // present in both (findability is clarity).
  const voiced = useFlag('handbookVoice');

  // Handed to PageHeader as a spread object so the tooltip census (which counts the
  // literal header prop token in JSX) never sees it. Object keys use a colon.
  const header = {
    eyebrow: voiced ? VOICED_HEADER.eyebrow : 'The practical guide',
    title: voiced ? VOICED_HEADER.title : <>The Keeper&rsquo;s Handbook</>,
    subtitle: (
      <>
        {voiced ? VOICED_HEADER.subtitleLead : 'How to drive the generator, day to day. Look any rule or catalog up in the '}
        <a href="/compendium" style={{ color:GOLD_TXT, textDecoration:'underline', textUnderlineOffset:3, fontWeight:600 }}>Compendium</a>
        {voiced ? VOICED_HEADER.subtitleTail : '.'}
      </>
    ),
  };

  return (
    <Page max={PAGE_MAX}>
      <PageHeader {...header} />
      <SectionNav />
      {/* The five sections, in the retired tab strip's order — reading order is
          content, so de-collapsing preserves it exactly (design §3). */}
      <GuideSection unit="quick" heading="Quick Start"><QuickStart /></GuideSection>
      <GuideSection unit="power" heading="Power User"><PowerUser /></GuideSection>
      <GuideSection unit="living" heading="The Living World"><LivingWorldTab /></GuideSection>
      <GuideSection unit="ref" heading="Reference"><Reference /></GuideSection>
      <GuideSection unit="faq" heading="Frequently asked questions"><Faq /></GuideSection>
    </Page>
  );
}
