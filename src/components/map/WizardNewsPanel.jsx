import { AlertTriangle, CheckCircle2, Clock3, Newspaper, RadioTower, ShieldAlert } from 'lucide-react';
import { useMemo } from 'react';

import { summarizeWizardNews, WIZARD_NEWS_SIGNIFICANCE } from '../../domain/region/index.js';
import { BORDER, BORDER2, BODY, CARD, CARD_ALT, FS, GOLD, GOLD_BG, GREEN, INK, MUTED, RED, SECOND, sans, swatch } from '../theme.js';

function percent(value) {
  return `${Math.round((Number.isFinite(value) ? value : 0) * 100)}%`;
}

function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

function scopeLabel(scope) {
  if (scope === 'realm') return 'Realm';
  if (scope === 'settlement') return 'Settlement';
  return 'Regional';
}

function statusColor(kind, major) {
  if (kind === 'applied' || kind === 'resolved') return GREEN;
  if (kind === 'ignored' || kind === 'expired') return MUTED;
  if (major) return RED;
  return GOLD;
}

function StatusIcon({ kind, major, color }) {
  if (kind === 'applied' || kind === 'resolved') return <CheckCircle2 size={15} color={color} />;
  if (kind === 'expired') return <Clock3 size={15} color={color} />;
  if (major) return <ShieldAlert size={15} color={color} />;
  return <RadioTower size={15} color={color} />;
}

function groupsFor(entries = []) {
  const groups = new Map();
  for (const entry of entries) {
    if (!groups.has(entry.tick)) groups.set(entry.tick, []);
    groups.get(entry.tick).push(entry);
  }
  return [...groups.entries()]
    .map(([tick, tickEntries]) => ({
      tick,
      entries: tickEntries.slice().sort((a, b) => b.score - a.score),
    }))
    .sort((a, b) => b.tick - a.tick);
}

function MetaPill({ children, tone = 'neutral' }) {
  const bg = tone === 'major' ? GOLD_BG : tone === 'good' ? swatch.successBg : CARD_ALT;
  const color = tone === 'major' ? GOLD : tone === 'good' ? GREEN : SECOND;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 22,
      padding: '2px 7px',
      border: `1px solid ${BORDER2}`,
      borderRadius: 6,
      background: bg,
      color,
      fontFamily: sans,
      fontSize: FS.xxs,
      fontWeight: 800,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function NewsEntry({ entry, compact = false }) {
  const major = entry.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR;
  const color = statusColor(entry.kind, major);

  return (
    <article style={{
      display: 'grid',
      gridTemplateColumns: '28px minmax(0, 1fr)',
      gap: 9,
      padding: compact ? '9px 10px' : '12px 13px',
      border: `1px solid ${major ? GOLD : BORDER}`,
      borderRadius: 8,
      background: major ? GOLD_BG : CARD,
      boxShadow: major ? '0 8px 22px rgba(108, 75, 24, 0.08)' : 'none',
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 7,
        background: CARD,
        border: `1px solid ${BORDER2}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <StatusIcon kind={entry.kind} major={major} color={color} />
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{
          display: 'flex',
          gap: 7,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
          <h4 style={{
            margin: 0,
            color: INK,
            fontFamily: sans,
            fontSize: compact ? FS.xs : FS.sm,
            lineHeight: 1.25,
            fontWeight: 900,
            overflowWrap: 'anywhere',
          }}>
            {entry.headline}
          </h4>
          <MetaPill tone={major ? 'major' : 'neutral'}>{scopeLabel(entry.scope)}</MetaPill>
        </div>

        {entry.summary && (
          <p style={{
            margin: '5px 0 0',
            color: BODY,
            fontFamily: sans,
            fontSize: FS.xs,
            lineHeight: 1.45,
            overflowWrap: 'anywhere',
          }}>
            {entry.summary}
          </p>
        )}

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 5,
          marginTop: 8,
          alignItems: 'center',
        }}>
          <MetaPill>Tick {entry.tick}</MetaPill>
          <MetaPill>{human(entry.kind)}</MetaPill>
          <MetaPill>Severity {percent(entry.severity)}</MetaPill>
          {entry.reasons.slice(0, 3).map(reason => (
            <MetaPill key={reason} tone={major ? 'major' : 'neutral'}>{reason}</MetaPill>
          ))}
        </div>
      </div>
    </article>
  );
}

function SectionHeader({ icon: Icon, title, count }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    }}>
      <Icon size={15} color={GOLD} />
      <h3 style={{
        margin: 0,
        color: INK,
        fontFamily: sans,
        fontSize: FS.sm,
        fontWeight: 900,
      }}>
        {title}
      </h3>
      <span style={{
        marginLeft: 'auto',
        color: MUTED,
        fontFamily: sans,
        fontSize: FS.xs,
        fontWeight: 800,
      }}>
        {count}
      </span>
    </div>
  );
}

export default function WizardNewsPanel({ campaign }) {
  const summary = useMemo(() => summarizeWizardNews(campaign?.wizardNews), [campaign?.wizardNews]);
  const majorGroups = useMemo(() => groupsFor(summary.major), [summary.major]);
  const notableGroups = useMemo(() => groupsFor(summary.notables), [summary.notables]);
  const total = summary.feed.entries.length;

  if (!campaign) return null;

  return (
    <section style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '13px 16px',
        borderBottom: `1px solid ${BORDER}`,
        background: CARD_ALT,
      }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          border: `1px solid ${BORDER2}`,
          background: CARD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Newspaper size={18} color={GOLD} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 style={{
            margin: 0,
            color: INK,
            fontFamily: sans,
            fontSize: FS.lg,
            lineHeight: 1.2,
            fontWeight: 900,
            overflowWrap: 'anywhere',
          }}>
            Wizard News
          </h2>
          <div style={{
            display: 'flex',
            gap: 7,
            flexWrap: 'wrap',
            marginTop: 4,
            color: SECOND,
            fontFamily: sans,
            fontSize: FS.xs,
            fontWeight: 700,
          }}>
            <span>{campaign.name}</span>
            <span>Tick {summary.feed.currentTick}</span>
            <span>{total} update{total === 1 ? '' : 's'}</span>
          </div>
        </div>
      </header>

      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 16,
        alignItems: 'start',
      }}>
        <div style={{ minWidth: 0 }}>
          <SectionHeader
            icon={AlertTriangle}
            title="Most Significant News"
            count={summary.major.length}
          />
          {majorGroups.length === 0 ? (
            <div style={{
              border: `1px dashed ${BORDER}`,
              borderRadius: 8,
              padding: 16,
              color: MUTED,
              fontFamily: sans,
              fontSize: FS.sm,
              background: CARD_ALT,
            }}>
              No significant news yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {majorGroups.map(group => (
                <details key={group.tick} open style={{
                  border: `1px solid ${BORDER2}`,
                  borderRadius: 8,
                  background: CARD,
                  overflow: 'hidden',
                }}>
                  <summary style={{
                    cursor: 'pointer',
                    padding: '8px 10px',
                    color: SECOND,
                    fontFamily: sans,
                    fontSize: FS.xs,
                    fontWeight: 900,
                    background: CARD_ALT,
                  }}>
                    Tick {group.tick} · {group.entries.length} major update{group.entries.length === 1 ? '' : 's'}
                  </summary>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
                    {group.entries.map(entry => <NewsEntry key={entry.id} entry={entry} />)}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <SectionHeader
            icon={RadioTower}
            title="Realm Notables"
            count={summary.notables.length}
          />
          {notableGroups.length === 0 ? (
            <div style={{
              border: `1px dashed ${BORDER}`,
              borderRadius: 8,
              padding: 16,
              color: MUTED,
              fontFamily: sans,
              fontSize: FS.sm,
              background: CARD_ALT,
            }}>
              No realm notables yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notableGroups.map((group, index) => (
                <details key={group.tick} open={index === 0} style={{
                  border: `1px solid ${BORDER2}`,
                  borderRadius: 8,
                  background: CARD,
                  overflow: 'hidden',
                }}>
                  <summary style={{
                    cursor: 'pointer',
                    padding: '8px 10px',
                    color: SECOND,
                    fontFamily: sans,
                    fontSize: FS.xs,
                    fontWeight: 900,
                    background: CARD_ALT,
                  }}>
                    Tick {group.tick} · {group.entries.length} notable update{group.entries.length === 1 ? '' : 's'}
                  </summary>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
                    {group.entries.map(entry => <NewsEntry key={entry.id} entry={entry} compact />)}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
