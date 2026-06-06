import { AlertTriangle, BookOpen, CheckCircle2, Clock3, Newspaper, RadioTower, ShieldAlert, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import { summarizeWizardNews, WIZARD_NEWS_SIGNIFICANCE } from '../../domain/region/index.js';
import { requestCampaignChronicle } from '../../lib/campaignChronicle.js';
import { useStore } from '../../store/index.js';
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

function NewsEntry({ entry, compact = false, nameById }) {
  const major = entry.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR;
  const color = statusColor(entry.kind, major);
  // Name the settlements this update touches so a reader knows exactly which
  // places to look into. The ids the feed stores are save ids.
  const settlementNames = (entry.settlementIds || [])
    .map(id => nameById?.get(String(id)))
    .filter(Boolean);

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
          {settlementNames.length > 0 && (
            <MetaPill tone="major">
              {settlementNames.length > 1 ? 'Settlements' : 'Settlement'}: {settlementNames.slice(0, 3).join(', ')}
              {settlementNames.length > 3 ? ` +${settlementNames.length - 3}` : ''}
            </MetaPill>
          )}
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
  const saves = useStore(state => state.savedSettlements);
  const appendCampaignChronicle = useStore(state => state.appendCampaignChronicle);
  const setCreditBalance = useStore(state => state.setCreditBalance);
  const [chronicleBusy, setChronicleBusy] = useState(false);
  const [chronicleError, setChronicleError] = useState('');
  const chronicles = Array.isArray(campaign?.chronicles) ? campaign.chronicles : [];
  // Resolve the feed's settlement save ids to names so each item can say which
  // settlement it concerns.
  const nameById = useMemo(() => {
    const map = new Map();
    for (const save of saves || []) {
      const id = save?.id || save?.settlement?.id;
      const nm = save?.name || save?.settlement?.name;
      if (id && nm) map.set(String(id), nm);
    }
    return map;
  }, [saves]);

  async function generateChronicle() {
    if (chronicleBusy || total === 0) return;
    setChronicleBusy(true);
    setChronicleError('');
    const ids = new Set(campaign?.settlementIds || []);
    const snapshot = {
      settlements: saves
        .filter(save => ids.has(save.id))
        .map(save => ({ id: save.id, name: save.name, settlement: save.settlement })),
    };
    const result = await requestCampaignChronicle({
      campaign,
      snapshot,
      tick: summary.feed.currentTick,
    });
    if (result.error || !result.chronicle) {
      setChronicleError(result.error || 'Chronicle generation failed.');
    } else {
      appendCampaignChronicle(campaign.id, {
        tick: summary.feed.currentTick,
        prose: result.chronicle,
      });
      if (Number.isFinite(result.creditsRemaining)) setCreditBalance(result.creditsRemaining);
    }
    setChronicleBusy(false);
  }

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
        <button
          type="button"
          onClick={generateChronicle}
          disabled={chronicleBusy || total === 0}
          title="Turn this tick's grounded news into a two-credit campaign chronicle"
          style={{
            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 10px', border: `1px solid ${GOLD}`, borderRadius: 6,
            background: GOLD_BG, color: GOLD, fontFamily: sans, fontSize: FS.xs,
            fontWeight: 900, cursor: chronicleBusy || total === 0 ? 'not-allowed' : 'pointer',
            opacity: chronicleBusy || total === 0 ? 0.55 : 1,
          }}
        >
          <Sparkles size={13}/>
          {chronicleBusy ? 'Writing' : 'Chronicle'}
        </button>
      </header>

      {(chronicles.length > 0 || chronicleError) && (
        <div style={{ padding:'12px 16px 0' }}>
          {chronicleError && (
            <div role="alert" style={{ color:RED, fontFamily:sans, fontSize:FS.xs, marginBottom:8 }}>
              {chronicleError}
            </div>
          )}
          {chronicles[0] && (
            <article style={{
              border:`1px solid ${BORDER2}`, borderLeft:`3px solid ${GOLD}`,
              borderRadius:6, background:CARD_ALT, padding:'10px 12px',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:GOLD, fontFamily:sans, fontSize:FS.xs, fontWeight:900 }}>
                <BookOpen size={13}/> Chronicle, tick {chronicles[0].tick}
              </div>
              <p style={{ margin:'6px 0 0', color:BODY, fontFamily:sans, fontSize:FS.sm, lineHeight:1.55 }}>
                {chronicles[0].prose}
              </p>
            </article>
          )}
        </div>
      )}

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
                    {group.entries.map(entry => <NewsEntry key={entry.id} entry={entry} nameById={nameById} />)}
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
                    {group.entries.map(entry => <NewsEntry key={entry.id} entry={entry} compact nameById={nameById} />)}
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
