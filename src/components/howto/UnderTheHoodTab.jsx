/**
 * howto/UnderTheHoodTab.jsx — the About page's "Under the Hood" tab,
 * split into the engine's two layers. Extracted from HowToUse.jsx
 * (which sits at its line budget).
 *
 *   - GENERATION — the existing 12 Insights (the static dossier the free tier
 *     produces): how one coherent settlement is DERIVED from constraints.
 *   - SIMULATION — the premium living-world substrate (16 causal vars, 9
 *     pressures, settlementStrength, the contributor "why" trace) that advancing
 *     time runs: how the REGION moves.
 *
 * Pure presentational. Self-contained Insight + SectionHead helpers (mirroring
 * the HowToUse originals) so this tab has no cross-import on the parent.
 */

import { GOLD, GOLD_TXT, INK, BODY, SECOND as SEC, BORDER as BOR, PARCH, SP, serif_, FS } from '../theme.js';
import { displayLabelsFor } from '../../domain/qualitativeBands.js';
import Button from '../primitives/Button.jsx';

const COLS = (col = 340) => ({ columnWidth: `${col}px`, columnGap: SP.xl });
const NO_BREAK = { breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' };
const SECTION_GAP = SP.xxl + SP.sm; // 32 (space-7) — major section breaks (P5)

// P11: the band names the guide prints are sourced from the SAME module that
// labels the live BandPill (domain/qualitativeBands), so the guide can never
// drift from the dossier. The hand-typed list said "strong / strained /
// critical / collapsed" — two of those (strong, critical) are never shown to a
// GM and it leaked the engine-internal canonical strings. These are the
// user-facing substrate display labels in band order.
const SUBSTRATE_BANDS = (() => {
  const m = displayLabelsFor('substrate') || {};
  return ['surplus', 'adequate', 'strained', 'critical', 'collapsed']
    .map(k => m[k]).filter(Boolean);
})();

// Flattened to a left-accented prose block (P5 anti-box-soup): grouping rides on
// the gold left rule + left padding + between-block spacing, not a full nested
// box inside the already-bordered shell card. Title color rides GOLD_TXT, not
// GOLD-as-text, so it clears AA on the light card (P7). `lead` promotes the one
// load-bearing mechanic to a larger serif INK focal entry above the scan flow (P4).
function Insight({ title, children, lead = false }) {
  return (
    <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 14, marginBottom: SP.lg, ...NO_BREAK }}>
      {lead
        ? <h3 style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 600, color: INK, margin: '0 0 5px' }}>{title}</h3>
        : <h3 style={{ fontSize: FS.xs, fontWeight: 800, color: GOLD_TXT, textTransform: 'uppercase',
            letterSpacing: '0.06em', margin: '0 0 5px' }}>{title}</h3>}
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: 0 }}>{children}</p>
    </div>
  );
}

// Lightweight sub-head subordinate to the SectionHead — chunks a long card flow
// into ~7-item scan clusters (P6) while staying clearly below the SectionHead's
// level (P4 <=3 levels): smaller, BODY weight, no serif display treatment.
function ClusterHead({ children }) {
  return (
    <h3 style={{ ...NO_BREAK, fontSize: FS.xs, fontWeight: 700, color: BODY, textTransform: 'uppercase',
      letterSpacing: '0.08em', margin: `0 0 ${SP.sm}px` }}>{children}</h3>
  );
}

// Splits the engine into its two layers: GENERATION (the static dossier) and
// SIMULATION (what advancing time runs).
// P4/P11: the Generation/Simulation split is this tab's TOP hierarchy level. It
// needs one more rank than the flatter tabs (Section > Card > Cluster), but it
// earns that rank from an uppercase gold eyebrow + the serif display weight —
// NOT from a bespoke FS['18'] that made these the single loudest headings in the
// whole guide and broke the reader's size→rank mapping when tabbing across
// (every other tab's primary heading is FS.lg). So this heading now matches
// FS.lg and out-ranks the cards via the eyebrow channel instead of size alone.
function SectionHead({ eyebrow, children, sub }) {
  return (
    <div style={{ ...NO_BREAK, margin: `2px 0 ${SP.md}px` }}>
      {eyebrow && (
        <div style={{ fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: GOLD_TXT, margin: '0 0 3px' }}>{eyebrow}</div>
      )}
      <h2 style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, margin: 0 }}>{children}</h2>
      {sub && <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

export default function UnderTheHoodTab({ onNavigate }) {
  return <>
    <SectionHead eyebrow="Layer 1 · The static dossier"
      sub="The static dossier the generator produces is derived, not rolled. These twelve mechanics explain how one coherent settlement falls out of your constraints.">
      Generation: how one town is derived
    </SectionHead>

    {/* P4: the load-bearing mechanic leads as a single dominant focal entry,
        full width above the cluster flow, before the scan list begins. */}
    <Insight title="Constraint-Driven, Not Random" lead>
      The distinction matters. A random generator picks from tables. This engine resolves constraints.
      Your slider values, trade route, terrain, stress conditions, forced/excluded institutions, and
      neighbour relationship are all constraints. The engine finds the most internally coherent
      settlement satisfying all of them simultaneously. This is why changing one constraint produces
      a systematically different settlement rather than a random variation. The outputs feel inevitable
      rather than arbitrary because they are: given those constraints, this is what the town is.
    </Insight>

    {/* P6: the 11 remaining mechanics chunked into ~3-4-item scan clusters. */}
    <ClusterHead>Constraints → derivation</ClusterHead>
    <div style={COLS()}>
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
    </div>

    <ClusterHead>Power, factions &amp; neighbours</ClusterHead>
    <div style={COLS()}>
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
      a rank indicator, dominant or subordinate within their faction type, which produces different
      templates for the most powerful government NPC than for a secondary civic official. The goal field
      on those NPCs reflects the settlement's specific pressures rather than a generic role description.
    </Insight>
    </div>

    <ClusterHead>History, supply chains &amp; the AI brief</ClusterHead>
    <div style={COLS()}>
    <Insight title="History and Present Are Structurally Connected">
      Historical events connect to current conditions through a temporal plausibility filter. A famine
      500 years ago does not explain today's food shortage. Only recent events (within roughly 30-80
      years depending on event type) can explain current economic or safety conditions. Political
      crises within the last 80 years can explain current legitimacy deficits. Religious events 60-300
      years ago can explain current institutional prominence or decline. Where a historical event and
      the current state stand in meaningful tension, a prior political disruption whose pressure hasn't
      resolved or a recovery the settlement has moved through, a legacy annotation surfaces it using
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

    {/* ── SIMULATION — the premium living-world substrate ──────────────────────
        P5: the Generation→Simulation layer break reads from a clearly looser gap
        (space-7 top margin), not a full-width 1px rule that reads as page-end. */}
    <div style={{ marginTop: SECTION_GAP }}>
      <SectionHead eyebrow="Layer 2 · The living region"
        sub="When you advance time, the dossier stops being a snapshot. These are the live systems the simulation runs. They are the depth worldbuilders pay for, surfaced at the Engine altitude in the dossier.">
        Simulation: how the region moves
      </SectionHead>
    </div>
    <div style={COLS()}>
    <Insight title="Sixteen Causal Variables: the Substrate">
      Beneath every settlement sit sixteen live causal variables (economic capacity, defense readiness,
      religious authority, criminal opportunity, and the rest), each with a score, a band
      ({SUBSTRATE_BANDS.join(' / ')}), and a list of named <em>contributors</em>. They are the
      shared substrate every other system reads from. Advance time and they shift together: a war drains
      economic capacity, which lowers settlement strength, which feeds the drive back to peace. You can
      open the full grid at the Engine altitude in any dossier.
    </Insight>
    <Insight title="Nine Pressure Axes">
      Above the variables sit nine pressure axes (0..1): the directional strain on the settlement,
      where it is being squeezed and why. Each axis carries its own <em>reasons</em>, so "high external
      threat" is never a bare number; it names the deployment, the rival, or the famine driving it.
      Pressures are how the engine turns a static state into a settlement that is about to <em>do</em> something.
    </Insight>
    <Insight title="Settlement Strength &amp; War Homeostasis">
      Settlement strength is the single dial that decides whether a settlement can keep fighting. War
      drains it (war_drain), sustained war scars it (war_exhaustion), and a drained, war-weary settlement
      sues for peace. That loop (war → economic drain → exhaustion → peace) is why the war layer ends
      its own wars. There is no "and then peace breaks out" script; peace is the equilibrium the
      homeostasis returns to.
    </Insight>
    {/* P3: the surface's whole thesis is causal CHANGE over time, yet it showed
        zero deltas — it only described them in prose. This card's claim ("every
        change carries a why-trace") is made recallable by SHOWING one: a static,
        clearly-labelled example before→after row reusing the dossier's own band
        vocabulary + a two-channel down-arrow, placed as the focal entry of the
        card. Hard-coded illustrative data, framed "Example", so it never implies
        live state or goes stale. */}
    <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 14, marginBottom: SP.lg, ...NO_BREAK }}>
      <h3 style={{ fontSize: FS.xs, fontWeight: 800, color: GOLD_TXT, textTransform: 'uppercase',
        letterSpacing: '0.06em', margin: '0 0 8px' }}>Every Change Carries a Why-Trace</h3>
      <WhyTraceExemplar />
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '10px 0 0' }}>
        The simulation never just changes a number. Each tick produces a before→after diff over the causal
        variables, and every delta carries the same human-readable contributor reasons the dossier shows.
        The chronicle that writes itself is derived from these traces, so it can only ever say what
        the simulation actually did. That is the difference between a living world and a random event table.
      </p>
    </div>
    </div>

    {/* P9: the Simulation section sells advancing time, but the tab dead-ended.
        Close it on the one place that runs — secondary so QuickTab's Generate
        stays the guide's single dominant primary (P8). */}
    <div style={{ marginTop: SECTION_GAP }}>
      <Button variant="secondary" size="lg" onClick={() => onNavigate?.('realm')}>
        See it in the Realm
      </Button>
    </div>
  </>;
}

// P3/P7: a static, illustrative before→after delta for one substrate variable —
// the band vocabulary is the dossier's own display labels, the change is carried
// in two channels (color + a down arrow + the word order), and it is explicitly
// framed as an example so it never reads as live data.
function WhyTraceExemplar() {
  const [before, after] = ['Steady', 'Contested'];
  return (
    <div style={{ background: PARCH, border: `1px solid ${BOR}`, borderRadius: 6, padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: FS.xs, fontWeight: 800, color: BODY, textTransform: 'uppercase',
          letterSpacing: '0.06em' }}>Example ·</span>
        <span style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>Economic capacity</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: FS.sm }}>
          <span style={{ color: BODY }}>{before}</span>
          {/* arrow is the non-color channel for "fell" */}
          <span aria-hidden="true" style={{ color: BODY }}>↓</span>
          <span style={{ fontWeight: 700, color: INK }}>{after}</span>
        </span>
      </div>
      <div style={{ fontSize: FS['12.5'], color: SEC, lineHeight: 1.5, marginTop: 4 }}>
        Blockade at the salt road. Garrison deployed abroad.
      </div>
    </div>
  );
}
