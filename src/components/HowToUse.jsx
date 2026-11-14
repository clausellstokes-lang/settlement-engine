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
import { NAV } from '../lib/routes.js';
import { t } from '../copy/index.js';
import useAboutHashScroll from './about/useAboutHashScroll.js';
// V-26b: the house-voice draft of the handbook narrative, rendered only when the
// (default-off) `handbookVoice` flag is on. Rides this already-lazy chunk (zero eager).
import { VoicedConceptIntro, VOICED_HEADER } from './howto/HandbookVoiced.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../design/proseScale.js';

// ABOUT-CURRENT A2 (2026-11-10): the saved-settlement seat's label, read from the route
// table so the Guide names it the way the header does (it was "Settlements" until the
// header relabelled it; the Guide kept the old name ten times).
const LIBRARY = NAV.find((n) => n.id === 'settlements')?.label;

// Responsive multi-column container for card/list-heavy section content. Uses
// `column-width` (not a fixed count) so it fills a wide desktop page with as
// many ~COL-wide columns as fit, and collapses to a single column on narrow
// screens — no media queries needed. Direct children opt out of mid-column
// splitting with breakInside.
const COLS = (col = 340) => ({ columnWidth: `${col}px`, columnGap: '22px' });
const NO_BREAK = { breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' };

// THE ANCHOR LANDING OFFSET is theme.js's ANCHOR_OFFSET (imported above). The
// painted arrow header is `position:'sticky', top:0` with the feather hanging below
// it, so a fragment jump (a SectionNav click, a translated `?tab=` deep link, or
// useAboutHashScroll's scrollIntoView) parks the section heading UNDERNEATH the
// painting unless the target carries a scroll margin. The derivation moved to
// theme.js (beside CHROME) when the SAME defect was found on /about/what-this-is:
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
  const mobile = useIsMobile();
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
            <div style={{ fontSize:proseFontSize(FS.xs, mobile), color:SEC, lineHeight:1.5 }}>{SECTION_BLURBS[u.id]}</div>
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
  const mobile = useIsMobile();
  return (
    <div style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start' }}>
      <div style={{ width:22, height:22, borderRadius:'50%', background:GOLD, color:swatch.white,
        fontSize:chromeFontSize(FS.xs, mobile), fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
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
        power tensions, export economy. Emerges from interlocking mechanical relationships that governed
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
        synthesizes the full settlement state into narrative. Power tensions, economic pressures,
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
      <Step n={1}>Signed in, pick a <strong>mode</strong> on the Create tab - <strong>Basic Generate</strong> for minimal config (tier, route, threat, terrain) or <strong>Advanced Generate</strong> for the full step-by-step wizard with priority sliders, institution toggles, services, and trade dynamics.</Step>
      <Step n={2}>Pick a <strong>tier</strong>. Hamlet or Village for a small roadside settlement, Town for a proper community. Without an account you forge a {ANON_MAX_SIZE_LABEL} only; sign in free for every size.</Step>
      <Step n={3}>Pick a <strong>trade route</strong>. Road is the safe default. Port and Crossroads produce richer economies. Pick a <strong>nearby terrain</strong>. Forests, mountains, and coastlines affect what resources appear and which supply chains are viable.</Step>
      <div style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start', paddingLeft:32 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:swatch['#B8860B'], flexShrink:0, marginTop:7 }}/>
        <p style={{ fontSize: FS['12.5'], color:swatch['#5A3A00'], lineHeight:1.6, margin:0, fontStyle:'italic' }}>Looking for a specific service? If you need <em>Remove Curse</em>, <em>Healing</em>, or any institutional service, search for it in the <strong>Compendium → Institutions</strong> tab, find the institution that provides it, then use Advanced Generate to force that institution in the <strong>Institutions</strong> step.</p>
      </div>
      <Step n={4}>Hit <strong>Generate</strong>. Read the <strong>Overview</strong> tab first. It gives you the town at a glance, ready for the table.</Step>
      <Step n={5}>Browse <strong>NPCs</strong> and <strong>Power</strong> tabs to build your session picture. The Power tab shows public legitimacy, relationships between the powers, and (where relevant) legacy annotations connecting the settlement's history to its current power structure. Daily Life is for mid-session quick reference.</Step>
      <Step n={6}><strong>Save</strong> to the {LIBRARY} tab to keep it for future sessions. You can also <strong>Export</strong> a print-ready PDF briefing (unlimited with Cartographer; on a free account, $2.99 keeps a saved settlement's PDF), or copy the Narrative AI Prompt for any AI assistant.</Step>
      <Tip>You don't need to read every section before the session starts. The Overview and Daily Life are designed for the table. The other tabs are for prep and immersion.</Tip>
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
        <Step n={2}>Apply <strong>Stress Conditions</strong> (Famine, Plague, Siege, Political Fracture, etc.) to shift the entire output. Stresses are not cosmetic. They modify institution probabilities, NPC goals, power tensions, and safety profiles.</Step>
        <Step n={3}>Multiple stresses <strong>compound</strong>. Famine + Political Fracture means food distribution is contested by powers, not just scarce. The Overview's crisis card carries each active stress.</Step>
        <Tip>Forces and exclusions persist through regeneration. Configure once, generate many variations.</Tip>
      </div>

      <div style={{ ...NO_BREAK, marginBottom:18 }}>
        <SubHead>Linking Settlements as Neighbours</SubHead>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, marginBottom:10 }}>
          Generate settlements that know about each other. The relationship type modifies the economic engine,
          power weights, and institution probabilities. All linking is done from the <strong>{LIBRARY}</strong> tab.
        </p>
        <Step n={1}>Open a saved settlement in the <strong>{LIBRARY} tab</strong>. In the detail view, click <strong>Link Neighbour</strong> and choose another saved settlement.</Step>
        <Step n={2}>Pick a relationship type: Trade Partner, Allied, Patron, Client, Rival, Cold War, or Hostile. The relationship is bidirectional and both settlements update immediately.</Step>
        <Step n={3}>To bias a <em>new</em> settlement against an existing neighbour: in the {LIBRARY} tab, click <strong>Set as Neighbour</strong> on a saved settlement. The Create tab opens with that neighbour active, and the engine adjusts its economy and power weights before generation.</Step>
        <Step n={4}>Open either settlement's <strong>Relationships</strong> tab to see the inter-settlement picture: relationship, NPC contacts, and active engagements.</Step>
        <Step n={5}>With Cartographer, use <strong>Edit Names</strong> in the {LIBRARY} tab to rename any NPC or power. Changes cascade to all linked partner records automatically.</Step>
        <Tip>Relationship types matter mechanically. A Rival crowds into the same export markets, hardens the military posture, and seeds embedded agents and saboteur powers. A Patron creates dependency chains in the client's economy. A Cold War seeds clandestine intelligence powers (deep-cover operatives, commercial fronts) on both sides.</Tip>
      </div>

      <div style={{ ...NO_BREAK, marginBottom:18 }}>
        <SubHead>Managing Saved Settlements &amp; Campaigns</SubHead>
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, marginBottom:10 }}>
          The {LIBRARY} tab is your campaign library. Your saves live here; campaigns, linking, and map placement come with Cartographer.
        </p>
        <Step n={1}><strong>Save</strong> after generating to store a settlement in your library.</Step>
        <Step n={2}><strong>Campaigns</strong> (Cartographer). Group settlements into named campaign folders directly inside the {LIBRARY} tab. Use the arrow button on any saved settlement to move it between campaigns. Export a campaign to PDF for a complete campaign dossier.</Step>
        <Step n={3}><strong>Export PDF</strong> from the detail view header for a print-ready settlement brief, or export a full campaign PDF from the campaign folder.</Step>
        <Step n={4}><strong>Narrative AI Prompt</strong> and <strong>Map AI Prompt</strong> exports are also available in the detail view. Use these to feed your settlement into an AI assistant for session fiction or map generation.</Step>
        <Step n={5}><strong>Edit Names</strong> (Cartographer) lets you rename any NPC or power. Changes propagate to all linked neighbour records automatically.</Step>
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
  ['power', 'Powers', 'Government types, blocs of powers, and legitimacy.'],
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

// The Navigation rows' descriptions, keyed by the route table's view id (NAV is the
// label and the order). Each line is the Guide's own pre-existing description of that
// seat, except Gallery, which is the Gallery page's own subtitle (gallery.pageSubtitle),
// and Realm, in the chair's words (ruling S4).
// EXPORTED FOR ITS TOTALITY PIN (tests/components/aboutCurrent.test.jsx): every NAV
// seat has a line and no line names a seat the header does not have.
export const NAV_DESCRIPTIONS = Object.freeze({
  generate: 'The generation wizard. Two modes: Basic (minimal config) and Advanced (step-by-step with full control).',
  settlements: 'Your saved settlement library. With Cartographer, group into campaigns, link as neighbours, edit, rename, and export without limit.',
  // The chair's ruling S4 (2026-11-10): each clause held by routes.js (the Realm hub: World
  // Map + Pulse + Chronicle + Pantheon) and the Guide's former World Map line.
  realm: 'The world map, with the region\'s Pulse, Chronicle and Pantheon beside it. With Cartographer, drag saved settlements onto the map to place them and toggle the relationship and supply-chain overlays.',
  compendium: 'The reference spine: every catalog rendered live from the engine. See the deep-links below.',
  gallery: t('gallery.pageSubtitle'),
  'about-what-this-is': 'What this is (the trust page) and this Practical Guide.',
});

// THE DOSSIER'S TABS, as the dossier groups them (ABOUT-CURRENT A2, 2026-11-10).
// The order and grouping are OutputContainer.jsx :: TAB_GROUPS (Summary / Systems /
// World / Notes); each label is the tab's own label there. The list is NOT imported
// from that module (it would drag the whole dossier into this lazy page's chunk), so
// tests/components/aboutCurrent.test.jsx pins both directions against TAB_GROUPS and
// the labels against the dossier's source. Every description is the Guide's own
// pre-existing line for that tab; a tab the Guide never described carries its label
// alone until a line is ruled (the record's STOP list names each one).
export const DOSSIER_TAB_GROUPS = Object.freeze([
  { group: 'summary', label: 'Summary', tabs: [
    ['overview', 'Overview', 'The town at a glance: identity, status tags, any active crisis, and who governs.'],
    ['crisis', 'Crisis', null],
    ['substrate', 'Foundations', 'What is holding and what is strained, reading by reading.'],
    ['plot_hooks', 'Plot Hooks', 'Every plot hook in the dossier, grouped by the page it comes from.'],
    ['dm_compass', 'Guidance', null],
  ]},
  { group: 'systems', label: 'Systems', tabs: [
    ['institutions', 'Institutions', 'Every institution, house by house, with the services each provides.'],
    ['services', 'Services', 'Available services and goods by category, with availability indicators.'],
    ['economics', 'Economics', 'Full export/import profile, prosperity analysis, supply chains, trade dependencies.'],
    ['resources', 'Resources', 'Nearby natural resources and their economic implications.'],
    ['power', 'Power', 'Government type, the leading power, the people\'s standing, political dynamics.'],
    ['defense', 'Defense', 'Walls, garrison, threat response, fortification profile.'],
    ['magic', 'Magic', null],
    ['viability', 'Outlook', 'Economic stress analysis. What is working, what is fragile, what will break.'],
  ]},
  { group: 'world', label: 'World', tabs: [
    ['npcs', 'NPCs', 'All named characters with personality, goals, secrets, and plot hooks.'],
    ['relationships', 'Relationships', 'Ties between people, active conflicts, and linked settlements with their contacts.'],
    ['daily_life', 'Daily Life', 'Wealth level, diet, crime, safety. What it feels like to live here.'],
    ['traditions', 'Traditions', null],
    ['history', 'History', 'Generated historical events that explain current conditions.'],
    ['rumors', 'Rumors & News', null],
    ['war', 'War', null],
    ['faith', 'Faith', null],
  ]},
  { group: 'notes', label: 'Notes', tabs: [
    ['dm_notes', 'DM Notes', null],
    ['ai_notes', 'AI Notes', null],
    ['chronicle', 'Chronicle', null],
    ['versions', 'Versions', null],
  ]},
]);

// The sharing entry's sentences, each verbatim from the share panel (ShareToGallery.jsx).
export const SHARE_ENTRY_SENTENCES = Object.freeze([
  'Public dossiers appear in the gallery.',
  'Your name and email stay private.',
  `${t('canon.startWorldClock')} before sharing the dossier publicly.`,
  'An unlisted link is for your players.',
  'It stays the same for as long as this settlement exists, and it always shows your latest changes.',
  'A town can be listed in the gallery and have an unlisted link at the same time.',
]);
const SHARE_ENTRY = SHARE_ENTRY_SENTENCES.join(' ');

const DOSSIER_TAB_SECTIONS = DOSSIER_TAB_GROUPS.map((g) => ({
  heading: `Settlement Detail Tabs: ${g.label}`,
  rows: g.tabs.map(([, label, desc]) => [label, desc]),
}));

function Reference() {
  const sections = [
    // ABOUT-CURRENT A2 (2026-11-10): the seats RENDER from the route table's NAV (the
    // header's own labels, in its own order), so this list cannot drift from the header.
    // Each description is keyed by the seat's view id; DM Screen is not a seat and
    // follows them (it has no other inbound link, V-18 below).
    { heading: 'Navigation', rows: [
      ...NAV.map((n) => [n.label, NAV_DESCRIPTIONS[n.id]]),
      // V-18 the DM Screen is a REAL DM-facing surface (letter, dossier, session
      // ledger, auspice, and a player-safe face you can turn to the table), and it
      // had no inbound link anywhere outside lib/routes.js. It stays noindex, which
      // is a crawler posture, not a verdict on who it is for: it reads whatever
      // settlement is open, so there is nothing stable for an index to point at.
      ['DM Screen', <>At-the-table view of whatever you have open: the Chronicler&rsquo;s Letter, the dossier at a glance, the session ledger, and the auspice, with a player-safe face you can turn around. <a href="/screen" style={{ color:GOLD, textDecoration:'underline', textUnderlineOffset:3 }}>Open the DM Screen</a>.</>],
    ]},
    ...DOSSIER_TAB_SECTIONS,
    { heading: 'Settlement Workflow', rows: [
      ['Campaigns',`With Cartographer, create named campaign folders in the ${LIBRARY} tab to group settlements together. Move settlements between campaigns using the arrow button. Export a whole campaign as PDF from its folder header.`],
      ['Link Neighbour',`With Cartographer: in the ${LIBRARY} tab, open any saved settlement and use Link Neighbour to bidirectionally link it to another. Pick the relationship type (Trade Partner, Allied, Patron, Client, Rival, Cold War, Hostile).`],
      ['Set as Neighbour','Tell the generator to bias a new settlement against an existing one. Opens the Create tab with the neighbour active.'],
      ['Edit Names','With Cartographer, rename any NPC or power. Changes cascade bidirectionally to linked partners.'],
      // ABOUT-CURRENT A2 (2026-11-10): sharing with the table, in the share panel's own
      // sentences (ShareToGallery.jsx, its private-state note; the button label is
      // SettlementDetailActions.jsx's). tests/components/aboutCurrent.test.jsx pins each
      // sentence to that source, so the Guide claims nothing the panel does not.
      ['Share to Gallery', SHARE_ENTRY],
      ['Export PDF','Print-ready settlement briefing. Cover page, index, relationship diagram, NPC cards, and economic appendix.'],
    ]},
    { heading: 'World Map', rows: [
      ['Drag to Place','Drag a saved settlement from the drawer below the map onto any location on the map. A new burg is created at that point, linked to your settlement.'],
      ['Click for Detail',`Click any placed burg to see its linked SettlementForge data and jump to the detail view in the ${LIBRARY} tab.`],
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
          Every catalog (tiers, institutions, stresses, powers, the living-world verbs) is rendered
          live from the engine in the <a href="/compendium" style={{ color:GOLD, textDecoration:'underline', textUnderlineOffset:3 }}>Compendium</a>,
          so the reference can never drift from what the simulator actually does. Jump straight to a section:
        </p>
        {COMPENDIUM_TABS.map(([tab, label, desc]) => <CompendiumLink key={tab} tab={tab} label={label} desc={desc} />)}
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, margin:'8px 0 0' }}>
          With Cartographer, build your own institutions, resources, stressors, and presets under{' '}
          <a href="/compendium?mode=custom" style={{ color:GOLD, textDecoration:'underline', textUnderlineOffset:3 }}>My Custom Content</a>.
          Custom items appear in the Settlement Editor catalog and sync to your account.
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
      <GuideSection unit="living" heading="The Living World">
        {/* THE WORD THE GUIDE NEVER SAID (2026-09-18). Everything downstream of
            here — the Realm, the chronicle, advancing time — acts on CANON
            settlements, and the guide described all of it without once naming the
            act that puts a settlement there. One sentence, at the top of the
            section the act unlocks. */}
        <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>
          A settlement you forge is a draft until you mark it canon from your{' '}
          <a href="/settlements" style={{ color:GOLD, textDecoration:'underline', textUnderlineOffset:3 }}>Library</a>;
          canon is what joins the Realm, takes events, and keeps a chronicle.
        </p>
        <LivingWorldTab />
      </GuideSection>
      <GuideSection unit="ref" heading="Reference"><Reference /></GuideSection>
      <GuideSection unit="faq" heading="Frequently asked questions"><Faq /></GuideSection>
    </Page>
  );
}
