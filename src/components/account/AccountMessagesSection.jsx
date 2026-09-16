/**
 * AccountMessagesSection.jsx — the signed-in user's operator-message reader.
 * Plain company voice on parchment, with no fictional-news chrome and no raw
 * HTML. Opening a detail, not merely visiting this section, marks it read.
 */
import { useEffect, useMemo, useState } from 'react';
import { BODY, BORDER, CARD_HDR, GOLD_SOFT, GOLD_TXT, INK, SECOND, SP, FS, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import Pill from '../primitives/Pill.jsx';
import Section from './AccountSection.jsx';
import { useOperatorMessages } from './OperatorMessagesProvider.jsx';

function formatMessageDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function classLabel(messageClass) {
  return messageClass === 'announcement' ? 'Announcement' : 'Service';
}

function senderRoleLabel(senderRole) {
  if (senderRole === 'developer') return 'Developer team';
  if (senderRole === 'admin') return 'Administration';
  return 'System notice';
}

export default function AccountMessagesSection({ onReply }) {
  const { messages, loading, loadingMore, hasMore, error, refresh, loadMore, markRead } = useOperatorMessages();
  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(
    () => messages.find(message => message.id === selectedId) || null,
    [messages, selectedId],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openMessage = (message) => {
    setSelectedId(message.id);
    if (!message.readAt) markRead(message.id).catch(() => {});
  };

  return (
    <Section title="Messages">
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
        {error && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', color: BODY, fontSize: FS.sm }}>
            <span style={{ flex: 1 }}>{error}</span>
            <Button variant="secondary" size="sm" onClick={refresh}>Retry</Button>
          </div>
        )}

        {selected ? (
          <article aria-labelledby={`operator-message-${selected.id}`} style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
            <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)} style={{ alignSelf: 'flex-start' }}>
              Back to messages
            </Button>
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: SP.md }}>
              <div style={{ display: 'flex', gap: SP.sm, alignItems: 'center', flexWrap: 'wrap', marginBottom: SP.sm }}>
                <Pill bg={selected.messageClass === 'announcement' ? GOLD_SOFT : CARD_HDR} color={selected.messageClass === 'announcement' ? GOLD_TXT : BODY}>
                  {classLabel(selected.messageClass)}
                </Pill>
                <span style={{ color: BODY, fontSize: FS.xs }}>{formatMessageDate(selected.createdAt || selected.deliveredAt)}</span>
              </div>
              <div style={{ color: SECOND, fontSize: FS.xs, marginBottom: SP.xs }}>
                SettlementForge · {senderRoleLabel(selected.senderRole)}
              </div>
              <h3 id={`operator-message-${selected.id}`} style={{ color: INK, fontSize: FS.xl, margin: `0 0 ${SP.md}px` }}>
                {selected.subject}
              </h3>
              <div style={{ color: INK, fontSize: FS.md, lineHeight: 1.65, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                {selected.body}
              </div>
            </div>
            {selected.kind === 'direct' && (
              <Button variant="primary" size="md" onClick={() => onReply?.(selected)} style={{ alignSelf: 'flex-start' }}>
                Reply via Feedback &amp; support
              </Button>
            )}
          </article>
        ) : loading && messages.length === 0 ? (
          <div role="status" style={{ color: BODY, fontSize: FS.sm, padding: `${SP.md}px 0` }}>Opening your messages…</div>
        ) : messages.length === 0 && !error ? (
          <div style={{ color: SECOND, fontSize: FS.sm, lineHeight: 1.5 }}>
            You have no messages from SettlementForge.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
            <div aria-label="Messages from SettlementForge" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
              {messages.map(message => {
              const unread = !message.readAt;
              return (
                <Button
                  key={message.id}
                  variant="ghost"
                  size="md"
                  fullWidth
                  aria-label={`${message.subject}${unread ? ', unread' : ''}`}
                  onClick={() => openMessage(message)}
                  style={{
                    justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal',
                    border: `1px solid ${BORDER}`, background: unread ? GOLD_SOFT : swatch.white,
                    padding: `${SP.md}px`,
                  }}
                >
                  <span style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column', gap: SP.xs }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
                      <Pill bg={message.messageClass === 'announcement' ? GOLD_SOFT : CARD_HDR} color={message.messageClass === 'announcement' ? GOLD_TXT : BODY}>
                        {classLabel(message.messageClass)}
                      </Pill>
                      <span style={{ color: BODY, fontSize: FS.xs }}>{formatMessageDate(message.createdAt || message.deliveredAt)}</span>
                      {unread && <span style={{ color: SECOND, fontSize: FS.xs, fontWeight: 800 }}>Unread</span>}
                    </span>
                    <span style={{ color: INK, fontSize: FS.md, fontWeight: unread ? 800 : 600, overflowWrap: 'anywhere' }}>
                      {message.subject}
                    </span>
                  </span>
                </Button>
              );
              })}
            </div>
            {hasMore && (
              <Button variant="secondary" size="sm" disabled={loading || loadingMore} onClick={loadMore} style={{ alignSelf: 'center' }}>
                {loadingMore ? 'Bringing in earlier messages…' : 'Load more messages'}
              </Button>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
