/**
 * about/CompareSection.jsx — "How SettlementForge compares", the positioning ladder.
 *
 * Extracted verbatim from the Keeper's Handbook's former `compare` TAB when the
 * About page split (docs/DESIGN_ABOUT_PAGES.md §1). It moved across the split
 * because the mapping rule assigns the POSITIONING LADDER to the conceptual page:
 * this is an argument about what the simulator is, not an instruction for driving
 * it. It is the one cross-half assignment, and aboutMapping.js records it as such.
 *
 * Every /compare* URL still in the world redirects here (App's redirect effect →
 * /about/what-this-is#how-we-compare), so the honest side-by-side framing keeps
 * its inbound links.
 *
 * ⛔ THE RUNGS NAME THE TOOLS THE ROUTES NAME (2026-09-18). The split moved this
 * copy byte-identically, and the copy named NO competitor: /compare/kanka,
 * /compare/worldographer and /compare/chatgpt all landed on "vs AI prose
 * generators", "vs map-first tools" and "vs campaign wikis", under a lead-in
 * promising "three honest, side-by-side breakdowns". A reader who followed a link
 * naming a tool arrived at a page that would not say the name, and a promised
 * side-by-side breakdown was three paragraphs. The rungs now name the tool each
 * route names, and the lead-in promises what the section delivers: three honest
 * comparisons.
 *
 * VERIFIED 2026-09-18, and the claims are held to what is checkable: Kanka has no
 * native settlement generation and no time simulation; Worldographer generates
 * maps and populates cities with NPCs and shops, and does not advance time or
 * explain its outputs; ChatGPT's prose is freeform, non-deterministic and not
 * persisted between asks. Nothing here disparages a tool and nothing here claims
 * anything about anyone's price.
 */
import { GOLD, INK, SECOND as SEC, BORDER as BOR, CARD, serif_, FS, ANCHOR_OFFSET } from '../theme.js';
import { anchorFor } from '../../lib/aboutMapping.js';

function Insight({ heading, children }) {
  return (
    <div style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${GOLD}`,
      padding:'10px 12px', background:CARD, marginBottom:14, breakInside:'avoid' }}>
      <div style={{ fontSize:FS.xs, fontWeight:800, color:GOLD, textTransform:'uppercase',
        letterSpacing:'0.06em', marginBottom:5 }}>{heading}</div>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:0 }}>{children}</p>
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

export default function CompareSection() {
  return (
    // scrollMarginTop (theme.js ANCHOR_OFFSET: the painted arrow's header and hang plus
    // one gutter, never a spelled number): #how-we-compare is the busiest
    // inbound anchor on this page — every /compare, /compare-chatgpt,
    // /compare-worldographer and /compare-kanka URL in the world redirects onto it —
    // so a landing that parks the heading under the sticky arrow is exactly the
    // link equity the redirect was built to keep.
    <section id={anchorFor('compare')} style={{ maxWidth: 760, margin: '40px auto 0', scrollMarginTop: ANCHOR_OFFSET }}>
      <h2 style={{ fontFamily:serif_, fontSize:FS['22'], fontWeight:600, color:INK,
        margin:'0 0 14px', lineHeight:1.2 }}>
        How SettlementForge compares
      </h2>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 14px' }}>
        Three honest comparisons against the tools DMs commonly weigh. Each is
        upfront about what the other tool does well. And where SettlementForge fits alongside
        it rather than against it.
      </p>
      <Insight heading="vs ChatGPT and AI prose generators. Simulated, not prompted">
        ChatGPT and the prose generators built on it write fluent text on demand, and they are
        good at it. They also improvise each answer: ask twice and the guard captain&rsquo;s name, the
        dominant faction, or the town&rsquo;s economy can quietly drift, and nothing is kept between
        asks. SettlementForge <strong>simulates</strong> the settlement from interlocking
        constraints, so every institution, NPC secret, and faction tension is mutually consistent,
        reproducible from its seed, and saved. Best of both: generate the coherent brief here, then
        hand its Narrative AI Prompt to an AI assistant for table-ready prose that stays on-model.
      </Insight>
      <Insight heading="vs Worldographer and map-first tools. Maps + settlements">
        Worldographer is a first-class map and hex editor, and it will populate a city with NPCs
        and shops as it draws. What it does not do is move time forward or tell you why the place
        is the way it is. The two are complementary: draw the world there, then let SettlementForge
        simulate the economies, power structures, and history inside its towns, with every fact
        carrying the cause it came from.
      </Insight>
      <Insight heading="vs Kanka and campaign wikis. Generate vs. store">
        Kanka is excellent at organizing and cross-linking the lore you already have: entities,
        relations, a campaign bible that holds together. It does not generate settlements, and it
        does not run time forward. Use SettlementForge to <strong>create</strong> coherent
        settlements and export the brief, then store and interlink them in Kanka as your living
        campaign bible.
      </Insight>
      <Tip>
        The throughline: SettlementForge owns the <em>generation</em> of mechanically-coherent
        settlements. Prose tools, map editors, and campaign wikis each sit naturally downstream of
        that. Use them together, not instead.
      </Tip>
    </section>
  );
}
