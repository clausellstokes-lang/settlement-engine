/**
 * ComparePage.jsx — Tier 8.6 comparison SEO surface.
 *
 * Three sub-pages — SettlementForge vs ChatGPT, vs Worldographer,
 * vs Kanka — each carrying the anti-AI / simulation-first positioning
 * and a comparison table. Plus a landing page that links to all three.
 *
 * Why these comparisons:
 *   - vs ChatGPT       — captures the "DM trying to get a settlement
 *                        from an LLM" search intent. The page argues
 *                        why a simulator beats a transformer for this
 *                        specific job.
 *   - vs Worldographer — captures DMs who already use Worldographer
 *                        for maps. We're not competing on maps; we're
 *                        complementing them with a settlement layer
 *                        Worldographer doesn't have.
 *   - vs Kanka         — captures campaign-management searchers who
 *                        want a campaign wiki. Same complement angle:
 *                        Kanka stores; we generate.
 *
 * Routing:
 *   view='compare'              → landing page with three cards
 *   view='compare-chatgpt'      → vs ChatGPT
 *   view='compare-worldographer'→ vs Worldographer
 *   view='compare-kanka'        → vs Kanka
 *
 * SEO posture:
 *   - We set document.title + meta description on mount so each page
 *     has its own title in search results.
 *   - The page renders real prose + a comparison table client-side.
 *     Modern Google renders JS for static-content pages; the deeper
 *     pre-render pass is a follow-up.
 *   - Internal links point to /generate and /gallery so the
 *     comparison surfaces feed back into the funnel.
 */

import { useEffect } from 'react';
import { ArrowRight, Sparkles, Check, X as XIcon } from 'lucide-react';
import { t } from '../copy/index.js';
import {
  GOLD, INK, BODY, MUTED, BORDER, CARD, sans, serif_, SP, R, FS,
} from './theme.js';

// ── Tiny meta helper ───────────────────────────────────────────────────────
// We don't have react-helmet wired up; for these flat pages a side-effect
// on mount is enough. Tag changes persist while the page is open.
function useDocumentMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    // Meta description — create if missing, update otherwise.
    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    if (description) meta.setAttribute('content', description);

    return () => {
      document.title = prevTitle;
      if (prevDesc !== null && meta) meta.setAttribute('content', prevDesc);
    };
  }, [title, description]);
}

// ── Shared layout ──────────────────────────────────────────────────────────
function ComparePageShell({ children }) {
  return (
    <div style={{
      maxWidth: 960, margin: '0 auto', padding: `${SP.xxl}px ${SP.lg}px`,
      fontFamily: sans, color: INK,
    }}>
      {children}
    </div>
  );
}

function PageTitle({ eyebrow, title, lede }) {
  return (
    <header style={{ marginBottom: SP.xxl }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#8C6F32',
        marginBottom: SP.sm,
      }}>
        {eyebrow}
      </div>
      <h1 style={{
        margin: 0, fontFamily: serif_, fontSize: FS['36'], fontWeight: 600,
        color: INK, lineHeight: 1.15,
      }}>
        {title}
      </h1>
      <p style={{
        margin: `${SP.md}px 0 0`, maxWidth: 720,
        fontFamily: serif_, fontStyle: 'italic',
        fontSize: FS.lg, color: BODY, lineHeight: 1.55,
      }}>
        {lede}
      </p>
    </header>
  );
}

function FeatureRow({ feature, sf, other }) {
  const cellStyle = (positive) => ({
    padding: `${SP.md}px ${SP.md}px`,
    borderBottom: `1px solid ${BORDER}`,
    fontSize: FS.sm, color: BODY,
    background: positive ? 'rgba(74,122,58,0.04)' : 'transparent',
  });
  const iconFor = (mark) =>
    mark === 'yes'    ? <Check size={14} color="#4A7A3A" /> :
    mark === 'no'     ? <XIcon size={14} color="#A23434" /> :
    mark === 'partial'? <span style={{ fontSize: FS.sm, color: '#D08020', fontWeight: 800 }}>~</span> :
    null;
  return (
    <tr>
      <th scope="row" style={{
        padding: `${SP.md}px ${SP.md}px`,
        borderBottom: `1px solid ${BORDER}`,
        textAlign: 'left', fontWeight: 700, fontSize: FS.sm, color: INK,
      }}>{feature}</th>
      <td style={cellStyle(sf.mark === 'yes')}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {iconFor(sf.mark)} {sf.note}
        </span>
      </td>
      <td style={cellStyle(false)}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {iconFor(other.mark)} {other.note}
        </span>
      </td>
    </tr>
  );
}

function CompareTable({ otherName, rows }) {
  return (
    <table style={{
      width: '100%', borderCollapse: 'collapse',
      background: CARD, borderRadius: R.xl, overflow: 'hidden',
      border: `1px solid ${BORDER}`,
      marginBottom: SP.xxl,
    }}>
      <thead>
        <tr>
          <th style={{
            padding: `${SP.md}px ${SP.md}px`, textAlign: 'left',
            fontSize: FS.xs, fontWeight: 800, color: MUTED,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            borderBottom: `2px solid ${BORDER}`,
            background: '#FAF4E8',
          }}>Feature</th>
          <th style={{
            padding: `${SP.md}px ${SP.md}px`, textAlign: 'left',
            fontSize: FS.xs, fontWeight: 800, color: '#7a5a1a',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            borderBottom: `2px solid ${GOLD}`,
            background: 'rgba(201,162,76,0.10)',
          }}>SettlementForge</th>
          <th style={{
            padding: `${SP.md}px ${SP.md}px`, textAlign: 'left',
            fontSize: FS.xs, fontWeight: 800, color: MUTED,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            borderBottom: `2px solid ${BORDER}`,
            background: '#FAF4E8',
          }}>{otherName}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <FeatureRow key={i} {...row} />
        ))}
      </tbody>
    </table>
  );
}

function ForgeCTA({ onNavigate }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap',
      padding: SP.xl,
      background: 'rgba(201,162,76,0.06)',
      border: `1px solid ${GOLD}`,
      borderLeft: `4px solid ${GOLD}`,
      borderRadius: R.lg,
      marginBottom: SP.xxl,
    }}>
      <div style={{ flex: '1 1 320px' }}>
        <div style={{ fontFamily: serif_, fontSize: FS.xl, fontWeight: 600, color: INK }}>
          Forge a settlement worth running a campaign in.
        </div>
        <div style={{ fontSize: FS.sm, color: BODY, marginTop: SP.xs }}>
          Free anonymous generation. No account needed for the first dossier.
        </div>
      </div>
      <button
        type="button"
        onClick={() => onNavigate?.('generate')}
        style={{
          padding: `${SP.md}px ${SP.xl}px`,
          background: GOLD, color: '#fff', border: 'none',
          borderRadius: R.button,
          fontFamily: sans, fontSize: FS.md, fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}
      >
        <Sparkles size={14} /> Begin a settlement <ArrowRight size={14} />
      </button>
    </div>
  );
}

function GalleryNudge({ onNavigate }) {
  return (
    <div style={{
      padding: SP.lg,
      borderTop: `1px solid ${BORDER}`,
      borderBottom: `1px solid ${BORDER}`,
      marginBottom: SP.xxl,
      fontSize: FS.sm, color: BODY,
      fontFamily: sans, lineHeight: 1.55,
    }}>
      <strong style={{ color: INK }}>Want to see what comes out?</strong>{' '}
      Every dossier in the <button
        type="button"
        onClick={() => onNavigate?.('gallery')}
        style={{
          background: 'none', border: 'none', padding: 0,
          color: GOLD, fontFamily: 'inherit', fontSize: 'inherit',
          cursor: 'pointer', textDecoration: 'underline',
        }}
      >public gallery</button> was simulated by the same engine —
      hand-curated exemplars at the top, community submissions below.
      Click any tile to read the full dossier.
    </div>
  );
}

// ── vs ChatGPT ─────────────────────────────────────────────────────────────
function CompareChatGPT({ onNavigate }) {
  useDocumentMeta(
    'SettlementForge vs ChatGPT — Simulated settlements for DMs',
    'A side-by-side comparison: SettlementForge simulates settlements from constraints; ChatGPT generates prose from prompts. Different tools, different jobs.'
  );

  return (
    <ComparePageShell>
      <PageTitle
        eyebrow="Comparison"
        title="SettlementForge vs ChatGPT"
        lede="Both produce text about a fictional town. Only one of them does it by simulating the town. Here's the difference, and when each tool is the right one."
      />

      <section style={{ marginBottom: SP.xxl, fontSize: FS.md, color: BODY, lineHeight: 1.65 }}>
        <p>
          ChatGPT is a transformer that predicts plausible next tokens. Ask it for a settlement
          and it writes prose that <em>sounds</em> like a settlement. The output is fluent. It is
          also untethered: the bandit threat the prose introduces in paragraph 3 does not affect
          the militia roster in paragraph 7, because there is no underlying state to affect.
        </p>
        <p>
          SettlementForge is a simulator. The settlement is the only coherent town that satisfies
          the constraints you set — sliders, terrain, trade route, stress conditions, custom
          institutions. Every output — factions, NPC secrets, supply chains, food security — is
          <strong> derived from the same simulation state</strong>. The bandit threat in the
          dossier <em>does</em> drive the militia roster, because both read from the same source.
        </p>
        <p style={{ color: INK, fontStyle: 'italic' }}>
          Simulated, not AI-generated. AI is optional, lives in the Narrative Refinement layer,
          and is grounded in the simulator's output rather than free to invent.
        </p>
      </section>

      <CompareTable otherName="ChatGPT" rows={[
        { feature: 'Settlement state is internally consistent',
          sf:    { mark: 'yes', note: 'Every output derives from one simulation state.' },
          other: { mark: 'no',  note: 'Prose-level only; no state to be consistent against.' } },
        { feature: 'Same prompt twice → same dossier',
          sf:    { mark: 'yes', note: 'Seed-deterministic. Save & reproduce.' },
          other: { mark: 'no',  note: 'Stochastic each generation.' } },
        { feature: 'Apply an event ("plague hits") and rebalance',
          sf:    { mark: 'yes', note: 'Event preview + apply pipeline rebalances factions, food, services.' },
          other: { mark: 'partial', note: 'Can rewrite prose; no system to rebalance.' } },
        { feature: 'Settlement vs settlement linking (neighbour relationships)',
          sf:    { mark: 'yes', note: 'Neighbourhood System modifies both towns when linked.' },
          other: { mark: 'no',  note: 'Treat each as a separate prompt.' } },
        { feature: 'Inspect why each institution exists',
          sf:    { mark: 'yes', note: '"How this was simulated" rail with per-step traces.' },
          other: { mark: 'no',  note: 'Output, no audit trail.' } },
        { feature: 'Export PDF dossier ready for the table',
          sf:    { mark: 'yes', note: 'One-click; preserves canon + narrative layer.' },
          other: { mark: 'partial', note: 'Copy-paste into a doc.' } },
        { feature: 'Pricing',
          sf:    { mark: 'yes', note: 'Free anonymous. Free saved tier. $6/mo Cartographer. $99 Founder.' },
          other: { mark: 'partial', note: 'ChatGPT subscription; usage rolled into general AI use.' } },
        { feature: 'AI involvement',
          sf:    { mark: 'partial', note: 'Optional Narrative Refinement only; grounded in simulation.' },
          other: { mark: 'yes', note: 'AI is the engine. No simulation underneath.' } },
      ]} />

      <ForgeCTA onNavigate={onNavigate} />
      <GalleryNudge onNavigate={onNavigate} />

      <section style={{ marginBottom: SP.xxl, fontSize: FS.md, color: BODY, lineHeight: 1.65 }}>
        <h2 style={{ fontFamily: serif_, fontSize: FS.xxl, color: INK, marginBottom: SP.md }}>
          When ChatGPT is the right tool
        </h2>
        <p>
          ChatGPT is great when you need <em>prose</em> about a thing whose facts you already
          have. Hand it a SettlementForge dossier and ask for read-aloud descriptions, NPC voice
          samples, faction propaganda — it'll do that well, because the facts are already
          coherent and it just needs to write.
        </p>
        <p>
          ChatGPT is the wrong tool when you need <em>the facts themselves</em>: who controls the
          town, why this institution exists and not that one, what happens to faction power when
          you kill the abbot. Those are simulation questions, not prose questions.
        </p>
      </section>
    </ComparePageShell>
  );
}

// ── vs Worldographer ───────────────────────────────────────────────────────
function CompareWorldographer({ onNavigate }) {
  useDocumentMeta(
    'SettlementForge vs Worldographer — Maps + simulated settlements',
    'SettlementForge complements Worldographer. Worldographer draws your world; SettlementForge simulates the towns inside it.'
  );

  return (
    <ComparePageShell>
      <PageTitle
        eyebrow="Comparison"
        title="SettlementForge vs Worldographer"
        lede="Worldographer is a map editor. SettlementForge is a settlement simulator. They solve different problems — and they're better together than apart."
      />

      <section style={{ marginBottom: SP.xxl, fontSize: FS.md, color: BODY, lineHeight: 1.65 }}>
        <p>
          Worldographer (formerly Hexographer) is one of the strongest map-drawing tools in the
          TTRPG space. Hex grids, terrain layers, kingdom borders, dungeon maps — all the spatial
          layout work a DM needs is well-served there.
        </p>
        <p>
          What Worldographer doesn't do is tell you what's inside the city your campaign actually
          happens in. That's what SettlementForge is for. The hex labeled "Bramblefen" on your
          map becomes a 14-tab dossier with factions, NPCs, supply chains, stress conditions,
          plot hooks, and an embedded "how it was simulated" rail.
        </p>
        <p style={{ color: INK, fontStyle: 'italic' }}>
          One workflow that works: draw your kingdom in Worldographer, pick a hex, simulate that
          settlement in SettlementForge, export the PDF, and you've prep'd the session.
        </p>
      </section>

      <CompareTable otherName="Worldographer" rows={[
        { feature: 'Draw / edit hex maps',
          sf:    { mark: 'partial', note: 'World map embed (Azgaar bridge), not a hex editor.' },
          other: { mark: 'yes', note: 'Best-in-class hex + dungeon editing.' } },
        { feature: 'Simulate settlement internals (factions, supply chains)',
          sf:    { mark: 'yes', note: '14 tabs of simulated detail per town.' },
          other: { mark: 'no',  note: 'Map metadata only.' } },
        { feature: 'NPC roster with private agendas + relationships',
          sf:    { mark: 'yes', note: 'Generated per settlement, linked to institutions.' },
          other: { mark: 'no',  note: 'NPCs are a map annotation, not a system.' } },
        { feature: 'Event progression ("plague hits Bramblefen")',
          sf:    { mark: 'yes', note: 'Apply event → faction/economy/threat state rebalances.' },
          other: { mark: 'no',  note: 'Manual map edit.' } },
        { feature: 'Neighbourhood System (linked settlements)',
          sf:    { mark: 'yes', note: 'Trade / rival / patron links modify both towns.' },
          other: { mark: 'partial', note: 'Spatial neighbours, not relational.' } },
        { feature: 'PDF export for the table',
          sf:    { mark: 'yes', note: 'Print-ready dossier; one click.' },
          other: { mark: 'yes', note: 'Map exports as PNG/PDF.' } },
        { feature: 'Pricing',
          sf:    { mark: 'yes', note: 'Free tier; $6/mo Cartographer; $99 Founder Lifetime.' },
          other: { mark: 'yes', note: 'One-time license.' } },
      ]} />

      <ForgeCTA onNavigate={onNavigate} />
      <GalleryNudge onNavigate={onNavigate} />
    </ComparePageShell>
  );
}

// ── vs Kanka ───────────────────────────────────────────────────────────────
function CompareKanka({ onNavigate }) {
  useDocumentMeta(
    'SettlementForge vs Kanka — Generate the wiki, then store it',
    'Kanka is a campaign wiki. SettlementForge generates the content that goes in it. Different jobs, same DM.'
  );

  return (
    <ComparePageShell>
      <PageTitle
        eyebrow="Comparison"
        title="SettlementForge vs Kanka"
        lede="Kanka stores your campaign. SettlementForge generates the towns that fill it. Use both."
      />

      <section style={{ marginBottom: SP.xxl, fontSize: FS.md, color: BODY, lineHeight: 1.65 }}>
        <p>
          Kanka is a campaign-management wiki. It's where you write down everything your players
          have learned about the world, organize NPCs and quests, and keep notes between sessions.
          Excellent for the campaign you're already running.
        </p>
        <p>
          What Kanka isn't is a generator. The blank entity page expects you to bring the content.
          For a small recurring location, you might write it yourself. For a settlement that needs
          factions, institutions, supply chains, and 30+ NPCs — that's where SettlementForge fits.
          Generate the dossier, export the PDF, paste the bits you want into Kanka.
        </p>
        <p style={{ color: INK, fontStyle: 'italic' }}>
          Simulator outputs are JSON-exportable; future versions will offer a direct Kanka import
          path.
        </p>
      </section>

      <CompareTable otherName="Kanka" rows={[
        { feature: 'Campaign wiki / persistent notes',
          sf:    { mark: 'partial', note: 'Saved settlements + canon. No general wiki.' },
          other: { mark: 'yes', note: 'Best-in-class wiki for TTRPG campaigns.' } },
        { feature: 'Generate a settlement from scratch',
          sf:    { mark: 'yes', note: 'Simulator engine; outputs full dossier in 10–20s.' },
          other: { mark: 'no',  note: 'Manual entry. Templates exist; no generation.' } },
        { feature: 'Multi-user campaign collaboration',
          sf:    { mark: 'no',  note: 'Single-DM focus; share via gallery / PDF.' },
          other: { mark: 'yes', note: 'Multi-user campaigns, permissions, players.' } },
        { feature: 'Settlement evolves with events',
          sf:    { mark: 'yes', note: 'Apply event → state rebalances.' },
          other: { mark: 'partial', note: 'Update entries manually.' } },
        { feature: 'PDF export',
          sf:    { mark: 'yes', note: 'Per-settlement and per-campaign PDFs.' },
          other: { mark: 'yes', note: 'Exports available on paid plans.' } },
        { feature: 'Pricing',
          sf:    { mark: 'yes', note: 'Free tier; $6/mo; $99 Founder.' },
          other: { mark: 'yes', note: 'Free tier; $5–$25/mo tiers.' } },
      ]} />

      <ForgeCTA onNavigate={onNavigate} />
      <GalleryNudge onNavigate={onNavigate} />
    </ComparePageShell>
  );
}

// ── Compare landing ────────────────────────────────────────────────────────
function CompareLanding({ onNavigate }) {
  useDocumentMeta(
    'How SettlementForge compares — vs ChatGPT, Worldographer, Kanka',
    'Side-by-side comparisons of SettlementForge against the tools DMs commonly consider: ChatGPT, Worldographer, and Kanka.'
  );

  const cards = [
    {
      view: 'compare-chatgpt',
      title: 'vs ChatGPT',
      lede: 'Why simulated beats prompted for the settlement itself.',
    },
    {
      view: 'compare-worldographer',
      title: 'vs Worldographer',
      lede: 'Maps + simulated settlements — better together.',
    },
    {
      view: 'compare-kanka',
      title: 'vs Kanka',
      lede: 'Generate the content; let Kanka store it.',
    },
  ];

  return (
    <ComparePageShell>
      <PageTitle
        eyebrow="Comparisons"
        title="How SettlementForge compares"
        lede="Three side-by-side breakdowns. Each one is honest about what the other tool does well and where SettlementForge fits."
      />

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: SP.lg, marginBottom: SP.xxl,
      }}>
        {cards.map(card => (
          <button
            key={card.view}
            type="button"
            onClick={() => onNavigate?.(card.view)}
            style={{
              textAlign: 'left', cursor: 'pointer',
              background: CARD, border: `1px solid ${BORDER}`,
              borderRadius: R.xl, padding: SP.lg,
              fontFamily: sans,
              boxShadow: '0 2px 10px rgba(27,20,8,0.06)',
              transition: 'box-shadow 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(27,20,8,0.12)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(27,20,8,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h2 style={{
              margin: 0, fontFamily: serif_, fontSize: FS.xl, fontWeight: 600,
              color: INK, lineHeight: 1.2,
            }}>
              SettlementForge {card.title}
            </h2>
            <p style={{
              margin: `${SP.sm}px 0 0`, fontSize: FS.sm, color: BODY,
              fontFamily: serif_, fontStyle: 'italic', lineHeight: 1.5,
            }}>
              {card.lede}
            </p>
            <div style={{
              marginTop: SP.md, fontSize: FS.xs, color: GOLD,
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              Read <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      <ForgeCTA onNavigate={onNavigate} />
    </ComparePageShell>
  );
}

// ── Public entry point ─────────────────────────────────────────────────────
/** Dispatches to the right sub-page based on the active route view. */
export default function ComparePage({ view, onNavigate }) {
  if (view === 'compare-chatgpt')      return <CompareChatGPT      onNavigate={onNavigate} />;
  if (view === 'compare-worldographer')return <CompareWorldographer onNavigate={onNavigate} />;
  if (view === 'compare-kanka')        return <CompareKanka        onNavigate={onNavigate} />;
  return <CompareLanding onNavigate={onNavigate} />;
}

// Re-export so App.jsx can detect compare-related views uniformly.
export const COMPARE_VIEWS = Object.freeze([
  'compare', 'compare-chatgpt', 'compare-worldographer', 'compare-kanka',
]);

// Silence unused-import in case t() isn't used inline.
void t;
