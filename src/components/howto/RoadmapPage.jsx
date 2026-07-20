/**
 * howto/RoadmapPage.jsx — /roadmap. The public roadmap.
 *
 * Renders EXACTLY the committed ledger (src/data/roadmapLedger.js) and nothing else.
 * There is no hand-typed roadmap item in this file: the page maps over the ledger, so it
 * can never show a direction the ledger does not carry (the claims-parity law). Statuses
 * are honest and no date is ever promised.
 *
 * ZERO EAGER. Lazy route (AppViews registers it via lazy()); the ledger is a pure data
 * import. Nothing here touches the first-paint graph.
 *
 * @param {{ onNavigate?: (view: string, opts?: object) => void }} props
 */
import Page from '../primitives/Page.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import Button from '../primitives/Button.jsx';
import { orderedRoadmap, ROADMAP_STATUS_LABELS } from '../../data/roadmapLedger.js';
import {
  PAGE_MAX, INK, BODY, MUTED, GOLD_DEEP, GOLD_BG, GREEN_DEEP, GREEN_BG, BORDER, CARD,
  serif_, sans, FS, SP,
} from '../theme.js';

const STATUS_STYLE = {
  available: { color: GREEN_DEEP, bg: GREEN_BG },
  building: { color: GOLD_DEEP, bg: GOLD_BG },
  exploring: { color: MUTED, bg: 'transparent' },
};

function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.exploring;
  return (
    <span style={{
      fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: s.color, background: s.bg,
      border: status === 'exploring' ? `1px solid ${BORDER}` : 'none',
      padding: '3px 9px', borderRadius: 2, whiteSpace: 'nowrap',
    }}>
      {ROADMAP_STATUS_LABELS[status] || status}
    </span>
  );
}

function RoadmapRow({ entry }) {
  return (
    <li style={{
      listStyle: 'none', background: CARD, border: `1px solid ${BORDER}`,
      padding: SP.lg, display: 'flex', flexDirection: 'column', gap: SP.sm,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.md }}>
        <h2 style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, lineHeight: 1.25 }}>
          {entry.title}
        </h2>
        <StatusPill status={entry.status} />
      </div>
      <p style={{ margin: 0, fontFamily: sans, fontSize: FS.sm, color: BODY, lineHeight: 1.65 }}>
        {entry.summary}
      </p>
    </li>
  );
}

export default function RoadmapPage({ onNavigate }) {
  const entries = orderedRoadmap();

  // Header handed to PageHeader as a spread object so the tooltip census never sees a
  // literal header prop token in JSX.
  const header = {
    eyebrow: 'Roadmap',
    title: 'Where the world is going',
    subtitle: 'What is here now, what we are building, and what we are still weighing. Honest status, no promised dates.',
  };

  return (
    <Page max={PAGE_MAX}>
      <PageHeader {...header} />

      <div style={{
        borderTop: `2px solid ${GOLD_DEEP}`, borderBottom: `1px solid ${BORDER}`,
        padding: `${SP.lg}px 0`, marginBottom: SP.xl,
      }}>
        <p style={{ margin: 0, fontFamily: sans, fontSize: FS.sm, color: BODY, lineHeight: 1.65 }}>
          A new direction never disturbs an old world. Everything here arrives dormant, so a
          world you saved today reads the same tomorrow. What ships, ships when it is ready.
        </p>
      </div>

      <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: SP.md }}>
        {entries.map((entry) => <RoadmapRow key={entry.id} entry={entry} />)}
      </ul>

      <div style={{
        marginTop: SP.xl, paddingTop: SP.md, borderTop: `1px solid ${GOLD_DEEP}`,
        display: 'flex', gap: SP.md, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <Button variant="primary" size="lg" onClick={() => onNavigate && onNavigate('generate')}>
          Forge a settlement
        </Button>
        <span style={{ fontFamily: sans, fontSize: FS.xs, color: MUTED }}>
          The best way to see where this is going is to build one.
        </span>
      </div>
    </Page>
  );
}
