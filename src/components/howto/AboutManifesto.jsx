/**
 * howto/AboutManifesto.jsx — the BODY of /about/what-this-is, the trust page.
 *
 * THE ABOUT SPLIT (docs/DESIGN_ABOUT_PAGES.md, 2026-08-03) made this the body of a
 * real page rather than the contents of a collapsible. Two consequences live here:
 *
 *   - NO h1. The hero band's headline was promoted into the page's standard
 *     PageHeader (components/about/AboutWhatThisIs.jsx), so this subtree starts at
 *     h2 and the page has exactly one h1 — the a11y floor the accordion's
 *     card-local heading semantics never allowed (design §3).
 *   - STABLE SECTION IDS. Each band carries the anchor aboutMapping.js assigns it,
 *     so a deep link survives. Ids come from that one mapping writer, never typed
 *     here, or the redirect grammar and the rendered anchors could drift apart.
 *
 * A linear manifesto in six bands (THE DOCUMENTATION WAVE §1): hero + the whole-loop
 * schematic → the philosophy ladder (concrete before abstract) → THE COVENANT (each
 * promise claim → mechanism → inspectable receipt, every receipt verified) → the
 * mechanism in dependency order (the tick diagram BEFORE its text) → the AI section
 * (concession first, then the honest boundary story) → the close (the human, the
 * audit invitation, one quiet pricing link).
 *
 * Voice: plain declarative sentences, concrete nouns (iA register). The staccato-
 * fragment style is retired except as the one deliberate blockquote handle. EVERY
 * number renders from the generated compendium artifact or a config constant — zero
 * hand-typed counts (the registry-render law reaches the marketing surface too).
 *
 * The philosophy-ladder and mechanism prose reuse the best passages of the former DM
 * Philosophy and Under-the-Hood tabs (the latter now reaped); their register is
 * preserved, their mangled punctuation fixed.
 */

import {
  GOLD, GOLD_TXT, INK, SECOND as SEC, MUTED as MUT, BORDER as BOR, CARD,
  serif_, sans, FS, SLATE, SLATE_DEEP, PROSE_MAX, ANCHOR_OFFSET,
} from '../theme.js';
import { COMPENDIUM_DATA as CD } from '../../domain/compendium/generated/compendiumData.generated.js';
import { RETENTION_MONTHS } from '../../config/entitlementLadder.js';
import { WholeLoopSchematic, TickDiagram } from './aboutSchematics.jsx';
import ForgeExactDemo from './ForgeExactDemo.jsx';
import FoundersRoll from './FoundersRoll.jsx';
import HouseColophon from '../organic/HouseColophon.jsx';
import { anchorFor } from '../../lib/aboutMapping.js';

// ── Presentational helpers ───────────────────────────────────────────────────
const PROSE = { fontSize: FS.md, color: SEC, lineHeight: 1.75, fontFamily: sans };

// THE ANCHOR LANDING OFFSET (theme.js ANCHOR_OFFSET = CHROME.headerDesktop +
// SP.xxl — the sticky bar plus one gutter; the derivation, never the sum it
// currently reaches, because the bar has been re-measured once already). Every band carries a
// PUBLISHED `#anchor`: the six manifesto fragments are live URLs, and /how-to?tab=
// and /compare* deep links are translated onto them. The desktop ribbon is sticky at
// top:0, so without a scroll margin each of those landings parks its <h2> UNDERNEATH
// the chrome — the reader arrives at a URL that names the section and a viewport that
// hides its heading. The guide page answered this at the split; this page did not,
// and all seven of its anchors were landing blind until the repair tail.
function Band({ id, eyebrow, title, children, first = false }) {
  return (
    <section id={id} style={{ maxWidth: PROSE_MAX, margin: '0 auto', scrollMarginTop: ANCHOR_OFFSET,
      padding: first ? '4px 0 0' : '40px 0 0' }}>
      {eyebrow && (
        <div style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: GOLD_TXT, marginBottom: 6 }}>{eyebrow}</div>
      )}
      {title && (
        <h2 style={{ fontFamily: serif_, fontSize: FS['22'], fontWeight: 600, color: INK,
          margin: '0 0 14px', lineHeight: 1.2 }}>{title}</h2>
      )}
      {children}
    </section>
  );
}

function Caption({ children }) {
  return (
    <p style={{ fontSize: FS.sm, color: MUT, fontStyle: 'italic', textAlign: 'center',
      margin: '8px auto 0', maxWidth: 560, lineHeight: 1.55, fontFamily: sans }}>{children}</p>
  );
}

// A covenant promise: what CANNOT happen, the mechanism that forbids it, and the
// receipt a skeptic can open. The receipt is the load-bearing element.
function Covenant({ claim, mechanism, receipt }) {
  return (
    <div style={{ border: `1px solid ${BOR}`, borderLeft: `3px solid ${GOLD}`,
      padding: '14px 16px', background: CARD, marginBottom: 12, breakInside: 'avoid' }}>
      <div style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK, marginBottom: 6 }}>{claim}</div>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '0 0 8px', fontFamily: sans }}>{mechanism}</p>
      <div style={{ fontSize: FS.xs, color: GOLD_TXT, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.06em', marginBottom: 3 }}>The receipt</div>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.55, margin: 0, fontFamily: sans }}>{receipt}</p>
    </div>
  );
}

function Mechanism({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, margin: '0 0 6px' }}>{title}</h3>
      <p style={{ ...PROSE, fontSize: FS.sm, margin: 0 }}>{children}</p>
    </div>
  );
}

const A = ({ href, children }) => (
  <a href={href} style={{ color: GOLD_TXT, textDecoration: 'underline', textUnderlineOffset: 3, fontWeight: 600 }}>{children}</a>
);

// ── The page ─────────────────────────────────────────────────────────────────
export default function AboutManifesto() {
  return (
    <div style={{ padding: '8px 0 8px' }}>
      {/* ── BAND 1 · HERO ──────────────────────────────────────────────────────
          The headline that used to live here is now the PAGE header's title
          (AboutWhatThisIs.jsx) — one h1 per page, per design §3. What remains is
          the seal and the lead paragraph. */}
      <Band id={anchorFor('hero')} first>
        {/* The seal moment — the large house device + the motto caption in type
            (owner placement: the About page opens under the maker's seal). */}
        <div style={{ marginBottom: 18 }}><HouseColophon size={56} /></div>
        <p style={{ ...PROSE, margin: '0 0 24px' }}>
          SettlementForge is a deterministic world simulator. You set the conditions (terrain,
          trade, the pressures a region is under) and the engine derives the only coherent
          settlement those conditions would produce: its institutions, its economy, its power
          structure, the secrets its people carry. Then it holds still. The same seed yields the
          same world, every time, so the town you prepped last week is byte-for-byte the town at
          the table tonight.
        </p>
      </Band>
      <div style={{ maxWidth: 780, margin: '8px auto 0', padding: '0 8px' }}>
        <WholeLoopSchematic />
        <Caption>
          One loop. The engine derives the dossier; the dossier draws the maps; the AI narrates
          from that state and never writes to it; play sets the constraints for the next turn.
        </Caption>
      </div>

      {/* ── BAND 2 · THE PHILOSOPHY LADDER ─────────────────────────────────── */}
      <Band id={anchorFor('premise')} eyebrow="The premise" title="What if the town remembered?">
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Ask a table what happened after they burned the granary. In most worlds, nothing:
          the fire was a scene, and the scene is over. Here, the mill has no grain to turn, so
          flour is scarce, so bread prices climb next season, so the garrison that ate on credit
          starts to grumble. Nobody scripted that chain. It fell out of the same supply web that
          built the town in the first place.
        </p>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          That is <strong style={{ color: INK }}>constraint-driven worldbuilding</strong>. You
          don&rsquo;t describe what you want; you constrain what is possible, and the settlement that
          comes out is the only one that satisfies every constraint at once. It is meaningfully
          different from rolling on a table, prompting a language model, or picking from a list,
          and it is why the coherence holds up when players push on it.
        </p>
        <blockquote style={{ margin: '18px 0', padding: '4px 0 4px 20px', borderLeft: `3px solid ${GOLD}`,
          fontFamily: serif_, fontSize: FS.lg, fontStyle: 'italic', color: INK, lineHeight: 1.5 }}>
          The settlement that emerges from your constraints isn&rsquo;t one you scripted. It&rsquo;s one
          you uncovered.
        </blockquote>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          You set the conditions of your world (the terrain, the trade pressures, the regional
          history you&rsquo;ve established) and the generator derives what a settlement in those
          conditions would actually look like. What appears is genuinely new to you, even though
          you built the world it lives in. When a settlement has that internal logic (when the
          blacksmith is poor because the iron supply chain is broken, not because the DM needed a
          plot point) players feel it. The town seems to have existed before they arrived, and
          like it will keep existing after they leave.
        </p>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          When a settlement doesn&rsquo;t have what a player is looking for, that isn&rsquo;t a hole in
          your prep. It is the world being honest. The frontier town has no one to lift a curse
          because no institution here provides one. Now the question writes itself: who would know
          someone who does, how far would the party have to travel, what would it cost to bring that
          help here? The constraint generates the question, and the question generates the session. A
          world that always has exactly what players need isn&rsquo;t a world; it is a service.
        </p>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          And no settlement here is an island. Each one is a node in your world, tied to everything
          around it by trade, politics, and old grievances. Its exports point outward to whoever buys
          them; its imports point inward to wherever the need is met; its factions reach to the
          regional powers you already run. The town becomes real when it has relationships with the
          rest of your world, and the engine hands you those threads to pull rather than a finished
          picture to drop in.
        </p>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Sometimes what comes out is not what you pictured. You imagined a cathedral town; the
          constraints gave you a garrison and a black market. That is not the tool arguing with you.
          It is a variation worth sitting with. Why didn&rsquo;t the church reach this far, and what
          fills the space where it didn&rsquo;t? In worldbuilding the unexpected result usually deepens
          the setting more than the expected one would have, precisely because you had to earn it.
        </p>
      </Band>

      {/* ── BAND 3 · THE COVENANT ──────────────────────────────────────────── */}
      <Band id={anchorFor('covenant')} eyebrow="Structural promises" title="The covenant">
        <p style={{ ...PROSE, margin: '0 0 18px' }}>
          These are not intentions. They are things the architecture cannot do, each with the
          mechanism that forbids it and a receipt you can open. Where a promise is structural, no
          policy can quietly reverse it.
        </p>
        <Covenant
          claim="The same seed can never yield a different world."
          mechanism="Every change flows through one deterministic tick. There is no wall-clock input and no hidden re-roll, so a world cannot drift behind your back between sessions."
          receipt={<>The landing page forges the exact same town ({CD.meta.demoWorld.name}, seed {CD.meta.demoWorld.seed}) every time, and a drift-gated replay test fails the build if that town ever changes. You can run it yourself at the bottom of this page.</>}
        />
        <Covenant
          claim="The AI can never write to your world&rsquo;s canon."
          mechanism="Canon changes are made only by the deterministic engine, through a registry of named operations. The AI reads that state and proposes prose; it has no operation that commits to canon. This is structural, not a policy we promise to keep."
          receipt={<>Every one of the {CD.operations.count} registered operations is published with its class and scope in the <A href="/compendium?tab=operations">operation registry</A>. Not one is AI-authored.</>}
        />
        <Covenant
          claim="No change can happen without leaving a receipt."
          mechanism="Each operation carries a receipt reference and, where it is reversible, an undo token. The chronicle that writes itself is derived from those receipts, so it can only ever say what the simulation actually did."
          receipt={<>The <A href="/compendium?tab=operations">operation registry</A> lists all {CD.operations.count} operations ({CD.operations.byKlass.canon} of them canon-class), each with the receipt it leaves and whether it can be undone.</>}
        />
        <Covenant
          claim="Your world can never be locked inside this tool."
          mechanism="Worlds export as print-ready PDFs, virtual-tabletop maps, and structured data. Exports you download are yours permanently. If you cancel, your saved settlements are not deleted out from under you."
          receipt={<>Downgrade retention is pinned to the database itself: saved settlements stay retrievable for {RETENTION_MONTHS} months after a downgrade (source: migration 023), and downloaded exports survive anything that happens to the service.</>}
        />
        <Covenant
          claim="The engine can never resolve a named character&rsquo;s fate."
          mechanism="The simulation moves world-level state: economies, institutions, factions, power. It deliberately stops at the threshold of a named person&rsquo;s story, which is yours to tell. State, never fate."
          receipt="Even when a settlement dies, the engine records that its last residents disperse with their fates unresolved. It kills no named character, ever, a rule enforced in the lifecycle kernel, not a stylistic choice."
        />
        <Covenant
          claim="The maps can never show a world the engine doesn&rsquo;t hold."
          mechanism="Every map renders from the same simulated state as the dossier. The engraved plates are drawn from the town&rsquo;s real geometry: no invented distances, no decorative places that don&rsquo;t exist in the data."
          receipt={<>The landing&rsquo;s frozen map plates are drift-gated replays of the fixture town&rsquo;s own geometry; the plate test fails the build if a plate stops matching the town it claims to show. Browse the live data in the <A href="/compendium">Compendium</A>.</>}
        />
        <p style={{ ...PROSE, fontSize: FS.sm, margin: '4px 0 0', color: MUT }}>
          Built and run by one person. The economics that keep that promise keepable are laid out
          plainly on the <A href="/founders">Founders</A> page and in <A href="/pricing">pricing</A>.
        </p>
      </Band>

      {/* ── BAND 4 · THE MECHANISM (tick diagram BEFORE the text) ──────────── */}
      <Band id={anchorFor('mechanism')} eyebrow="How it works" title="One tick, in dependency order">
        <div style={{ margin: '4px auto 6px', maxWidth: 780 }}>
          <TickDiagram />
          <Caption>
            Your seed, your constraints, and the prior state feed one deterministic tick. Every
            change it makes lands in the ledger with its receipt. Nothing else touches the world.
          </Caption>
        </div>
        <p style={{ ...PROSE, fontSize: FS.sm, margin: '14px 0 18px' }}>
          You can skip the terms below and lose nothing. The town at your table works either way.
          But if you want to know why it holds together, it is worth two minutes.
        </p>
        <Mechanism title="Constraints, not a die roll">
          A random generator picks from tables. This engine resolves constraints. Your slider
          values, trade route, terrain, stress conditions, forced or excluded institutions, and
          neighbour relationships are all constraints, and the engine finds the most internally
          coherent settlement that satisfies all of them at once. Change one constraint and you get
          a systematically different settlement, not a random variation.
        </Mechanism>
        <Mechanism title="Sliders shift probability; supply chains create fragility">
          The five priority sliders don&rsquo;t guarantee institutions. They shift their probability
          and interact, so a high-Religion, low-Magic town tips toward heresy suppression. Production
          is sequential: a tannery needs hides, a leatherworker needs tanned leather, an armorer needs
          both leather and metal. Break one link and the downstream chain fails, which is why a
          prosperous settlement can be one burned mill away from decline.
        </Mechanism>
        <Mechanism title="Magic can stand in for a broken supply chain">
          A high-magic town doesn&rsquo;t only gain arcane institutions; magic also buffers against
          material shortfall. Arcane supply can substitute for missing infrastructure, so a town with
          no farmland and no road access can still hold together on magic alone. Lower the magic and
          that same town tips into a viability warning. The dossier&rsquo;s viability view shows which
          supply chains are real and which are being propped up by magic or trade.
        </Mechanism>
        <Mechanism title="Prosperity is an output, not a dial">
          You don&rsquo;t set how prosperous a town is. It falls out of export volume and value, the
          number of income sources, trade access, how complete the supply chains are, the safety
          profile, and the stresses in play. A comfortable-looking settlement can rest on a fragile
          base, and the viability view names exactly which of those factors are holding the number up
          and which are absent, so the decline is one you can see coming.
        </Mechanism>
        <Mechanism title="Stresses compound into new conditions">
          Two stresses together make a third, named thing. Famine in a politically fractured town
          isn&rsquo;t only scarcity. It is food distribution contested by factions, which changes who
          is hoarding, which bloc controls the grain, and where the danger sits. The dossier names the
          compound condition, not just its parts, so you always know what you are actually running.
        </Mechanism>
        <Mechanism title="Who your neighbour is changes the economy">
          A settlement is shaped by its neighbour before its own institutions are even chosen. A trade
          partner skews production toward complementary exports; a rival suppresses them; a patron
          leaves the town partly dependent on what the patron demands. Two identical configurations
          become two different economies depending on who sits next door.
        </Mechanism>
        <Mechanism title="Legitimacy bends the power structure">
          Raw faction power comes from institutions and priorities, but effective power bends to how
          legitimate the governing authority is. When governance falters, the ruling faction weakens
          and criminal power grows to fill the gap. So every economic and military swing quietly
          reshapes who really holds the town: through legitimacy, never by decree.
        </Mechanism>
        <Mechanism title="Beneath it all: the causal substrate">
          Once a campaign advances, {CD.causal.variableCount} live causal variables sit under every
          settlement (food security, public legitimacy, defense readiness, criminal opportunity,
          and the rest) each with a score, a band ({CD.causal.bands.join(' / ')}), and named
          contributors. Above them ride {CD.pressures.count} pressures: the directional strain on
          the settlement, each carrying its own reasons, so &ldquo;high external threat&rdquo; always names
          the deployment or the famine driving it. Advance time and they shift together: a war drains
          economic capacity, which lowers the settlement&rsquo;s strength, which feeds the drive back
          toward peace. That loop is why the war layer ends its own wars; peace is the equilibrium it
          returns to, not a script.
        </Mechanism>
        <Mechanism title="Every change carries a why-trace">
          The simulation never just changes a number. Each tick produces a before-and-after diff over
          the causal variables, and every delta carries the same human-readable reasons the dossier
          shows. The chronicle that writes itself is derived from those traces, so it can only ever
          report what the simulation actually did. That is the difference between a living world and a
          random event table.
        </Mechanism>
      </Band>

      {/* ── BAND 5 · THE AI SECTION ────────────────────────────────────────── */}
      <Band id={anchorFor('ai')} eyebrow="Where the AI fits" title="Caged by mechanism, not by promise">
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          This hobby&rsquo;s distrust of generative AI is earned. Players have watched policies about AI
          get written and then quietly reversed, and the objection was never really about capability.
          It was about provenance and consent. So we don&rsquo;t ask you to trust a policy. We show you
          the architecture.
        </p>
        <div style={{ border: `1px solid ${BOR}`, borderLeft: `3px solid ${SLATE}`,
          padding: '14px 16px', background: `${SLATE}0A`, marginBottom: 16 }}>
          <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.7, margin: 0, fontFamily: sans }}>
            The AI works in three stages, and each stage has exactly one job. An analyst
            <strong style={{ color: SLATE_DEEP }}> reads </strong>
            the simulated state: the facts the engine already derived. A compiler
            <strong style={{ color: SLATE_DEEP }}> proposes </strong>
            table-ready prose or a plan, grounded in those facts. And only the deterministic engine
            <strong style={{ color: SLATE_DEEP }}> writes </strong>
            to canon, through the same named operations everything else uses. There is no fourth
            stage where the model edits your world. The model narrates; it never decides.
          </p>
        </div>
        <p style={{ ...PROSE, fontSize: FS.sm, margin: '0 0 14px' }}>
          Because the brief the AI works from is coherent, the fiction it produces stays consistent
          across many queries. Everything it needs is in the brief, not in its training. And the
          negative space is stated plainly: no AI-generated art is passed off as the product&rsquo;s own,
          and the maps and settlements are simulated, not painted by a model. You can verify the
          boundary rather than take it on faith: every operation the engine can perform, with its
          class and its receipt, is public in the{' '}
          <A href="/compendium?tab=operations">operation registry</A>.
        </p>
      </Band>

      {/* ── BAND 6 · THE CLOSE ─────────────────────────────────────────────── */}
      <Band id={anchorFor('close')} eyebrow="The invitation" title="Examine it thoroughly">
        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          This is a tool built by one person for people who take their worlds seriously, and it is
          built to be inspected. Open the <A href="/compendium">Compendium</A> and read the catalogs
          the engine renders from its own registries. Read the{' '}
          <A href="/compendium?tab=operations">operation registry</A> and see exactly what the engine
          can and cannot do. When you are ready, <A href="/pricing">pricing</A> is plain-spoken and
          the ownership terms are on the page: you never need a subscription to keep what you made,
          and you are never charged for a task that produced nothing.
        </p>
        <ForgeExactDemo />
        {/* The promised credits roll — dormant until a founder opts in (170). */}
        <FoundersRoll />
      </Band>
    </div>
  );
}
