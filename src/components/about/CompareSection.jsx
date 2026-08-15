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
 * The copy is byte-identical to the retired tab — the split moved it, never
 * rewrote it.
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
    // scrollMarginTop (theme.js ANCHOR_OFFSET = CHROME.headerDesktop + SP.xxl —
    // the sticky bar plus one gutter, never a spelled number): #how-we-compare is the busiest
    // inbound anchor on this page — every /compare, /compare-chatgpt,
    // /compare-worldographer and /compare-kanka URL in the world redirects onto it —
    // so a landing that parks the heading under the sticky ribbon is exactly the
    // link equity the redirect was built to keep.
    <section id={anchorFor('compare')} style={{ maxWidth: 760, margin: '40px auto 0', scrollMarginTop: ANCHOR_OFFSET }}>
      <h2 style={{ fontFamily:serif_, fontSize:FS['22'], fontWeight:600, color:INK,
        margin:'0 0 14px', lineHeight:1.2 }}>
        How SettlementForge compares
      </h2>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 14px' }}>
        Three honest, side-by-side breakdowns against the tools DMs commonly weigh. Each is
        upfront about what the other tool does well. And where SettlementForge fits alongside
        it rather than against it.
      </p>
      <Insight heading="vs AI prose generators. Simulated, not prompted">
        An AI prose generator writes fluent text on demand, but it improvises each answer: ask
        twice and the guard captain&rsquo;s name, the dominant faction, or the town&rsquo;s economy can quietly
        drift. SettlementForge <strong>simulates</strong> the settlement from interlocking
        constraints, so every institution, NPC secret, and faction tension is mutually consistent
        and reproducible. Best of both: generate the coherent brief here, then hand its Narrative AI
        Prompt to an AI assistant for table-ready prose that stays on-model.
      </Insight>
      <Insight heading="vs map-first tools. Maps + settlements">
        Map-first tools are first-class map and hex editors. Terrain, regions, the shape of the
        world. They don&rsquo;t simulate what lives inside a settlement. The two are complementary:
        draw the map in a map tool, then populate its towns with SettlementForge&rsquo;s simulated
        economies, power structures, and NPCs.
      </Insight>
      <Insight heading="vs campaign wikis. Generate vs. store">
        A campaign wiki is excellent at organizing and cross-linking the lore you already
        have, but it doesn&rsquo;t generate that lore. Use SettlementForge to <strong>create</strong>
        coherent settlements and export the brief, then store and interlink them in your wiki as
        your living campaign bible.
      </Insight>
      <Tip>
        The throughline: SettlementForge owns the <em>generation</em> of mechanically-coherent
        settlements. Prose tools, map editors, and campaign wikis each sit naturally downstream of
        that. Use them together, not instead.
      </Tip>
    </section>
  );
}
