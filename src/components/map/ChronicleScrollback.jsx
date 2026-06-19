/**
 * ChronicleScrollback — the Realm Inspector's Chronicle section, scrubbable across
 * the FULL history (UX Phase 5, plan §4.5).
 *
 * REPLACES the chronicles[0]-only view: it merges chronicles[] + pulseHistory[]
 * into a tick-indexed timeline (chronicleTimeline) the DM can scrub. For the
 * selected tick it shows:
 *   - the prose chronicle authored that tick (if any)
 *   - the pulse record's headline outcomes ("what changed & why")
 *   - the per-variable compareCausalState diff WHEN before/after causal snapshots
 *     are captured for the tick (via tickCausalDiff)
 *   - clicking an entry highlights the affected map node(s) (setSelectedSettlementId)
 *
 * SELF-GATES TO EMPTY. A fresh campaign (no chronicles, no pulse history) renders
 * the empty state — byte-identical off-state. Pure read-models + one store write
 * (the node-highlight selection, which is UI state, not worldState).
 */

import { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';

import { useStore } from '../../store/index.js';
import {
  chronicleTimeline,
  hasTimeline,
  tickCausalDiff,
} from '../../domain/display/chronicleTimeline.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GREEN, INK, MUTED, RED, R, SECOND, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';

function human(v) {
  return String(v || '').replace(/_/g, ' ');
}

/**
 * One pulse headline. When it names affected settlements it is a button (click /
 * Enter / Space highlights the first one on the map); otherwise a plain card.
 */
function HeadlineCard({ headline: h, resolveName, onHighlight }) {
  const names = h.settlementIds.map(resolveName).filter(Boolean);
  const canHighlight = h.settlementIds.length > 0;
  const body = (
    <>
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, lineHeight: 1.3 }}>
        {h.headline}
      </div>
      {h.summary && (
        <p style={{ margin: '4px 0 0', color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.4 }}>
          {h.summary}
        </p>
      )}
      {names.length > 0 && (
        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 4, color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 800 }}>
          <MapPin size={10} color={GOLD} /> {names.slice(0, 3).join(', ')}{names.length > 3 ? ` +${names.length - 3}` : ''}
        </div>
      )}
    </>
  );
  const cardStyle = {
    border: `1px solid ${BORDER2}`, borderRadius: R.sm, background: CARD,
    padding: '8px 10px',
  };
  if (!canHighlight) {
    return <div data-testid="chronicle-headline" style={cardStyle}>{body}</div>;
  }
  const highlight = () => onHighlight(h.settlementIds[0]);
  return (
    <div
      data-testid="chronicle-headline"
      role="button"
      tabIndex={0}
      aria-label={`Highlight ${names[0] || 'affected settlement'} on the map`}
      onClick={highlight}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); highlight(); } }}
      style={{ ...cardStyle, cursor: 'pointer' }}
    >
      {body}
    </div>
  );
}

/** A single per-variable causal-diff row. */
function DiffRow({ diff }) {
  const up = diff.change > 0;
  // Polarity: a positive change on a negative-polarity var (e.g. corruption) is bad.
  const good = diff.polarity === 'negative' ? !up : up;
  const color = good ? GREEN : RED;
  return (
    <li style={{ fontSize: FS.xxs, color: BODY, marginBottom: 3, lineHeight: 1.4, listStyle: 'none' }}>
      <span style={{ color, fontWeight: 900 }}>{up ? '▲' : '▼'}</span>{' '}
      <strong style={{ color: INK }}>{human(diff.variable)}</strong>{' '}
      <span style={{ color: MUTED }}>
        {diff.bandBefore} → {diff.bandAfter}
      </span>
      {diff.explanation && <span style={{ color: SECOND }}> — {diff.explanation}</span>}
    </li>
  );
}

/**
 * @param {Object} props
 * @param {any} props.campaign
 * @param {(id: any) => string} [props.nameFor]
 * @param {Map<number, { before?: any, after?: any }>} [props.causalByTick]  optional
 *   per-tick before/after causal snapshots (drives the compareCausalState diff).
 */
export default function ChronicleScrollback({ campaign, nameFor, causalByTick }) {
  const setSelectedSettlementId = useStore(s => s.setSelectedSettlementId);

  const timeline = useMemo(() => chronicleTimeline({
    chronicles: campaign?.chronicles,
    pulseHistory: campaign?.worldState?.pulseHistory,
  }), [campaign?.chronicles, campaign?.worldState?.pulseHistory]);

  const populated = hasTimeline({
    chronicles: campaign?.chronicles,
    pulseHistory: campaign?.worldState?.pulseHistory,
  });

  // The scrubber index into the (newest-first) timeline. Clamp on changes.
  const [index, setIndex] = useState(0);
  const safeIndex = Math.min(index, Math.max(0, timeline.length - 1));
  const selected = timeline[safeIndex] || null;

  const resolveName = nameFor || ((id) => String(id));

  const causalDiff = useMemo(() => {
    if (!selected) return [];
    const snap = causalByTick instanceof Map ? causalByTick.get(selected.tick) : null;
    if (!snap?.before || !snap?.after) return [];
    return tickCausalDiff(snap.before, snap.after);
  }, [selected, causalByTick]);

  if (!campaign) return null;

  if (!populated) {
    return (
      <div data-testid="chronicle-scrollback-empty" style={{
        padding: SP.md, border: `1px dashed ${BORDER2}`, borderRadius: R.md,
        color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 750, lineHeight: 1.5,
      }}>
        No chronicle yet. Advance the realm to record its history; the timeline will
        fill tick by tick.
      </div>
    );
  }

  return (
    <div data-testid="chronicle-scrollback" style={{ display: 'grid', gap: SP.sm }}>
      {/* ── Tick scrubber ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `6px ${SP.sm}px`, border: `1px solid ${BORDER}`, borderRadius: R.md,
        background: CARD_ALT,
      }}>
        <Button
          variant="ghost" size="sm"
          aria-label="Newer tick"
          disabled={safeIndex <= 0}
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          style={{ minHeight: undefined, padding: 2 }}
        >
          <ChevronLeft size={15} />
        </Button>
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>
            Tick {selected.tick}
          </div>
          <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro }}>
            {safeIndex + 1} of {timeline.length}
          </div>
        </div>
        <Button
          variant="ghost" size="sm"
          aria-label="Older tick"
          disabled={safeIndex >= timeline.length - 1}
          onClick={() => setIndex(i => Math.min(timeline.length - 1, i + 1))}
          style={{ minHeight: undefined, padding: 2 }}
        >
          <ChevronRight size={15} />
        </Button>
      </div>

      {/* A compact tick rail so a DM can jump across the whole history. */}
      {timeline.length > 1 && (
        <div role="tablist" aria-label="Timeline ticks" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {timeline.map((t, i) => (
            <Button
              key={t.tick}
              variant="ghost"
              size="sm"
              role="tab"
              aria-selected={i === safeIndex}
              aria-label={`Tick ${t.tick}`}
              onClick={() => setIndex(i)}
              style={{
                minWidth: 24, minHeight: undefined, padding: '2px 6px',
                border: `1px solid ${i === safeIndex ? GOLD : BORDER2}`,
                borderRadius: R.sm,
                background: i === safeIndex ? GOLD : CARD,
                color: i === safeIndex ? '#fffbf5' : SECOND,
                fontSize: FS.micro, fontWeight: 850,
              }}
            >
              {t.tick}
            </Button>
          ))}
        </div>
      )}

      {/* ── Prose chronicle(s) at this tick ───────────────────────────────── */}
      {selected.chronicles.map((c, i) => (
        <article key={c.id || i} style={{
          border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${GOLD}`,
          borderRadius: R.sm, background: CARD_ALT, padding: '10px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
            <BookOpen size={13} /> Chronicle, tick {c.tick}
          </div>
          <p style={{ margin: '6px 0 0', color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.55 }}>
            {c.prose}
          </p>
        </article>
      ))}

      {/* ── What changed & why (pulse headlines) ──────────────────────────── */}
      {selected.headlines.length > 0 && (
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={12} color={GOLD} /> What changed &amp; why
          </div>
          {selected.headlines.map((h, i) => (
            <HeadlineCard
              key={h.id || i}
              headline={h}
              resolveName={resolveName}
              onHighlight={setSelectedSettlementId}
            />
          ))}
        </div>
      )}

      {/* ── Per-tick causal diff (compareCausalState) ─────────────────────── */}
      {causalDiff.length > 0 && (
        <div data-testid="chronicle-causal-diff" style={{
          border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD_ALT, padding: '8px 10px',
        }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, marginBottom: 5 }}>
            Causal shift this tick
          </div>
          <ul style={{ margin: 0, padding: 0 }}>
            {causalDiff.slice(0, 8).map((d, i) => <DiffRow key={d.variable || i} diff={d} />)}
          </ul>
        </div>
      )}

      {selected.headlines.length === 0 && selected.chronicles.length === 0 && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, padding: SP.sm }}>
          A quiet tick — no material changes were recorded.
        </div>
      )}
    </div>
  );
}
