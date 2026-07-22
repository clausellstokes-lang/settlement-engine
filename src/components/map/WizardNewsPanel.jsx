import { AlertTriangle, BookOpen, CheckCircle2, Clock3, Megaphone, Newspaper, RadioTower, ShieldAlert, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import { newsBodyText, newsReasonPhrases } from '../../domain/display/newsBody.js';
import { newsVoiceLine } from '../../domain/display/newsVoice.js';
import { summarizeWizardNews, WIZARD_NEWS_SIGNIFICANCE } from '../../domain/region/index.js';
import { requestCampaignChronicle } from '../../lib/campaignChronicle.js';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import EmptyState from '../primitives/EmptyState.jsx';
import { AffectedSettlements } from './AddressChain.jsx';
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

// Partition threads into the DM's own settlements vs the rest of the realm.
// Membership is by save id: a thread is "mine" when any settlement it touches
// is in the campaign's settlementIds.
function partitionThreads(threads = [], mineIds = new Set()) {
  const mine = [];
  const elsewhere = [];
  for (const thread of threads) {
    const touchesMine = (thread.settlementIds || []).some(id => mineIds.has(String(id)));
    (touchesMine ? mine : elsewhere).push(thread);
  }
  return { mine, elsewhere };
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
  // The settlements this update touches — now LINKED (THE NEWS ADDRESS LAW's
  // affected-settlements part): each name opens its dossier. The subject itself
  // (the headline actor) is a record-gap here — the wizardNews entry carries no
  // npc/faction id, only the headline prose — so it is not linked (never a prose
  // scan). AddressChain/AffectedSettlements read the realm web from context.
  const hasSettlements = (entry.settlementIds || []).length > 0;
  // The crier's voice: a short, in-world line a herald would proclaim about a
  // war/faith/trade beat. Pure display sidecar (domain/display/newsVoice.js);
  // null for out-of-scope news, so the quote only shows when it has something
  // to say.
  const voiceLine = newsVoiceLine(entry);
  // The card body, re-composed in the house voice from the entry's structured
  // fields (transition/scope/severity) rather than its engine-composed summary
  // ("Applied via trade dependency…"). The raw summary rides a hover tooltip so
  // a curious DM can still read the mechanical detail. (content-immersion-5)
  const bodyText = newsBodyText(entry);
  const reasonPhrases = newsReasonPhrases(entry);

  return (
    <article style={{
      display: 'grid',
      gridTemplateColumns: '28px minmax(0, 1fr)',
      gap: 9,
      padding: compact ? '9px 10px' : '12px 13px',
      border: `1px solid ${major ? GOLD : BORDER}`,
      background: major ? GOLD_BG : CARD,
      boxShadow: major ? '0 8px 22px rgba(108, 75, 24, 0.08)' : 'none',
    }}>
      <div style={{
        width: 28,
        height: 28,
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

        {bodyText && (
          <p title={entry.summary || undefined} style={{
            margin: '5px 0 0',
            color: BODY,
            fontFamily: sans,
            fontSize: FS.xs,
            lineHeight: 1.45,
            overflowWrap: 'anywhere',
          }}>
            {bodyText}
          </p>
        )}

        {voiceLine && (
          <p style={{
            display: 'flex',
            gap: 6,
            alignItems: 'flex-start',
            margin: '6px 0 0',
            color: MUTED,
            fontFamily: sans,
            fontSize: FS.xs,
            fontStyle: 'italic',
            lineHeight: 1.45,
            overflowWrap: 'anywhere',
          }}>
            <Megaphone size={13} color={MUTED} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>&#8220;{voiceLine}&#8221;</span>
          </p>
        )}

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 5,
          marginTop: 8,
          alignItems: 'center',
        }}>
          {hasSettlements && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', minHeight: 22, maxWidth: '100%',
              padding: '2px 7px', border: `1px solid ${BORDER2}`,
            }}>
              <AffectedSettlements
                ids={entry.settlementIds}
                label={(entry.settlementIds || []).length > 1 ? 'Settlements' : 'Settlement'}
                max={3}
              />
            </span>
          )}
          <MetaPill>Tick {entry.tick}</MetaPill>
          <MetaPill>{human(entry.kind)}</MetaPill>
          <MetaPill>Severity {percent(entry.severity)}</MetaPill>
          {reasonPhrases.slice(0, 3).map(reason => (
            <MetaPill key={reason} tone={major ? 'major' : 'neutral'}>{reason}</MetaPill>
          ))}
        </div>
      </div>
    </article>
  );
}

// A threaded arc, rendered collapsed-with-progression: the latest stage is
// always shown; a multi-stage arc gets a disclosure that reveals the earlier
// stages (oldest → newest) so a slow-burning story reads as ONE entry instead
// of a wall of near-duplicates.
function ThreadCard({ thread, compact = false, nameById }) {
  const head = thread.head;
  if (!head) return null;
  if (thread.size <= 1) {
    return <NewsEntry entry={head} compact={compact} nameById={nameById} />;
  }
  const priorStages = thread.entries.slice(0, -1); // everything before the head, oldest → newest
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <NewsEntry entry={head} compact={compact} nameById={nameById} />
      <details style={{
        border: `1px solid ${BORDER2}`,
        background: CARD_ALT,
        overflow: 'hidden',
      }}>
        <summary style={{
          cursor: 'pointer',
          padding: '6px 10px',
          color: SECOND,
          fontFamily: sans,
          fontSize: FS.xxs,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <RadioTower size={12} color={GOLD} />
          {thread.size}-stage arc · show earlier {priorStages.length === 1 ? 'update' : 'updates'}
        </summary>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8 }}>
          {priorStages.map(entry => (
            <NewsEntry key={entry.id} entry={entry} compact nameById={nameById} />
          ))}
        </div>
      </details>
    </div>
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

// One partition column ("Your settlements" / "Elsewhere in the realm"). Threads
// arrive pre-ordered (major-first, then recency); each renders collapsed-with-
// progression via ThreadCard.
function ThreadColumn({ icon, title, threads, majorCount, emptyText, nameById }) {
  return (
    <div style={{ minWidth: 0 }}>
      <SectionHeader icon={icon} title={title} count={threads.length} />
      {majorCount > 0 && (
        <div style={{ marginTop: -4, marginBottom: 10, color: RED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>
          {majorCount} significant {majorCount === 1 ? 'arc' : 'arcs'}
        </div>
      )}
      {threads.length === 0 ? (
        <EmptyState heading={emptyText} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {threads.map(thread => (
            <ThreadCard key={thread.arcId} thread={thread} nameById={nameById} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WizardNewsPanel({ campaign }) {
  const summary = useMemo(() => summarizeWizardNews(campaign?.wizardNews), [campaign?.wizardNews]);
  // Arc-threaded, then partitioned into the DM's own settlements vs the wider
  // realm. deriveNewsThreads already orders threads major-first then by recency
  // (deterministic codepoint tiebreak), so both columns lead with what matters.
  const mineIds = useMemo(() => new Set((campaign?.settlementIds || []).map(String)), [campaign?.settlementIds]);
  const { mine: mineThreads, elsewhere: elsewhereThreads } = useMemo(
    () => partitionThreads(summary.threads, mineIds),
    [summary.threads, mineIds],
  );
  const mineMajorCount = useMemo(
    () => mineThreads.filter(t => t.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR).length,
    [mineThreads],
  );
  const elsewhereMajorCount = useMemo(
    () => elsewhereThreads.filter(t => t.significance === WIZARD_NEWS_SIGNIFICANCE.MAJOR).length,
    [elsewhereThreads],
  );
  const total = summary.feed.entries.length;
  const saves = useStore(state => state.savedSettlements);
  const appendCampaignChronicle = useStore(state => state.appendCampaignChronicle);
  const setCreditBalance = useStore(state => state.setCreditBalance);
  const [chronicleBusy, setChronicleBusy] = useState(false);
  const [chronicleError, setChronicleError] = useState('');
  const chronicles = Array.isArray(campaign?.chronicles) ? campaign.chronicles : [];
  // Ground the chronicle on the latest tick that HAS entries: the feed clock
  // (currentTick) can sit ahead of the newest entry after manual impact
  // advances, and a paid generation must never run on an empty window.
  const latestEntryTick = useMemo(
    () => summary.feed.entries.reduce((max, entry) => Math.max(max, entry.tick || 0), 0),
    [summary.feed.entries],
  );
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
    setChronicleError(null);
    // try/catch/finally so the busy flag ALWAYS clears — a throw (from the
    // request helper, appendCampaignChronicle, or setCreditBalance) must never
    // leave the paid Chronicle button stuck spinning forever (correctness-2).
    try {
      const ids = new Set(campaign?.settlementIds || []);
      const snapshot = {
        settlements: saves
          .filter(save => ids.has(save.id))
          .map(save => ({ id: save.id, name: save.name, settlement: save.settlement })),
      };
      const result = await requestCampaignChronicle({
        campaign,
        snapshot,
        tick: latestEntryTick,
      });
      if (result.error || !result.chronicle) {
        setChronicleError(result.error || t('errors.chronicleFail'));
      } else {
        appendCampaignChronicle(campaign.id, {
          tick: latestEntryTick,
          prose: result.chronicle,
        });
        if (Number.isFinite(result.creditsRemaining)) setCreditBalance(result.creditsRemaining);
      }
    } catch (e) {
      setChronicleError(t('errors.chronicleFail'));
    } finally {
      setChronicleBusy(false);
    }
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
        <Button
          variant="gold"
          size="sm"
          icon={<Sparkles size={13} />}
          busy={chronicleBusy}
          onClick={generateChronicle}
          disabled={chronicleBusy || total === 0}
          title="Turn this tick's grounded news into a two-credit campaign chronicle"
          style={{ marginLeft: 'auto' }}
        >
          {chronicleBusy ? 'Writing' : 'Chronicle'}
        </Button>
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
              background:CARD_ALT, padding:'10px 12px',
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
        <ThreadColumn
          icon={AlertTriangle}
          title="Your Settlements"
          threads={mineThreads}
          majorCount={mineMajorCount}
          emptyText="No news about your settlements yet."
          nameById={nameById}
        />

        <ThreadColumn
          icon={RadioTower}
          title="Elsewhere in the Realm"
          threads={elsewhereThreads}
          majorCount={elsewhereMajorCount}
          emptyText="No news elsewhere in the realm yet."
          nameById={nameById}
        />
      </div>
    </section>
  );
}
