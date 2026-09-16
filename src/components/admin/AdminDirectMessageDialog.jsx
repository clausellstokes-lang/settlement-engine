/** Direct operator notice composer for the selected redacted user record. */
import { useEffect, useId, useState } from 'react';
import { ConfirmDialog } from '../primitives/Dialog.jsx';
import { INK, MUTED, BODY, BORDER, CARD_HDR, sans, SP, FS, swatch } from '../theme.js';

export const DIRECT_MESSAGE_TEMPLATES = Object.freeze({
  moderation_notice: {
    label: 'Moderation notice',
    messageClass: 'service',
    subject: 'A notice about your SettlementForge account',
    body: 'We are contacting you about activity associated with your SettlementForge account. Please review this notice and use Feedback & support if you need clarification.',
  },
  report_outcome: {
    label: 'Report outcome',
    messageClass: 'service',
    subject: 'Update on a report',
    body: 'We reviewed the report associated with your account. This message records the outcome. Use Feedback & support if you need to reply.',
  },
  avatar_removed: {
    label: 'Avatar removed',
    messageClass: 'service',
    subject: 'Your profile image was removed',
    body: 'Your public profile image was removed after moderation review. Your account now uses its letter-circle fallback. Use Feedback & support if you believe this was a mistake.',
  },
  display_name_reset: {
    label: 'Display name reset',
    messageClass: 'service',
    subject: 'Your display name was reset',
    body: 'Your public display name was reset after moderation review. You may choose a new name that follows the public-content rules. Use Feedback & support if you believe this was a mistake.',
  },
  custom_service: {
    label: 'Custom service notice',
    messageClass: 'service',
    subject: 'A message from SettlementForge',
    body: '',
  },
  custom_announcement: {
    label: 'Custom announcement',
    messageClass: 'announcement',
    subject: 'News from SettlementForge',
    body: '',
  },
});

const fieldStyle = {
  padding: `${SP.sm}px ${SP.md}px`,
  border: `1px solid ${BORDER}`,
  background: swatch.white,
  color: INK,
  fontFamily: sans,
  fontSize: FS.sm,
};

export default function AdminDirectMessageDialog({ open, recipientLabel, onCancel, onSend }) {
  const [template, setTemplate] = useState('moderation_notice');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const templateId = useId();
  const subjectId = useId();
  const bodyId = useId();
  const selectedTemplate = DIRECT_MESSAGE_TEMPLATES[template]
    || DIRECT_MESSAGE_TEMPLATES.moderation_notice;
  const messageClass = selectedTemplate.messageClass;

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- each opening is a fresh composer; reset stale draft state synchronously */
    const initial = DIRECT_MESSAGE_TEMPLATES.moderation_notice;
    setTemplate('moderation_notice');
    setSubject(initial.subject);
    setBody(initial.body);
    setBusy(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open]);

  const selectTemplate = (key) => {
    const registeredKey = Object.prototype.hasOwnProperty.call(DIRECT_MESSAGE_TEMPLATES, key)
      ? key
      : 'custom_service';
    const next = DIRECT_MESSAGE_TEMPLATES[registeredKey];
    setTemplate(registeredKey);
    setSubject(next.subject);
    setBody(next.body);
  };

  const valid = subject.trim().length > 0 && body.trim().length > 0;

  return (
    <ConfirmDialog
      open={open}
      heading={`Send notice to ${recipientLabel || 'user'}`}
      body="The notice is saved to Account Messages first. Email is a best-effort courier after that database commit."
      tone="default"
      confirmLabel="Send notice"
      confirmDisabled={!valid || busy}
      onCancel={() => { if (!busy) onCancel?.(); }}
      onConfirm={async () => {
        if (!valid || busy) return;
        setBusy(true);
        try {
          await onSend?.({
            messageClass,
            subject: subject.trim(),
            messageBody: body.trim(),
            messageTemplate: template,
          });
        } finally {
          setBusy(false);
        }
      }}
      extra={(
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginBottom: SP.md }}>
          {/* eslint-disable-next-line jsx-a11y/label-has-for -- associated via htmlFor/id; nesting would break the composer layout */}
          <label htmlFor={templateId} style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
            Template
          </label>
          <select id={templateId} aria-label="Notice template" value={template} onChange={(event) => selectTemplate(event.target.value)} style={fieldStyle}>
            {Object.entries(DIRECT_MESSAGE_TEMPLATES).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>

          {/* eslint-disable-next-line jsx-a11y/label-has-for -- associated via htmlFor/id; nesting would break the composer layout */}
          <label htmlFor={subjectId} style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
            Subject
          </label>
          <input id={subjectId} aria-label="Notice subject" maxLength={160} value={subject} onChange={(event) => setSubject(event.target.value)} style={fieldStyle} />

          {/* eslint-disable-next-line jsx-a11y/label-has-for -- associated via htmlFor/id; nesting would break the composer layout */}
          <label htmlFor={bodyId} style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
            Message
          </label>
          <textarea id={bodyId} aria-label="Notice message" maxLength={10000} rows={7} value={body} onChange={(event) => setBody(event.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />

          <div aria-label="Account message preview" style={{ padding: SP.md, border: `1px solid ${BORDER}`, background: CARD_HDR }}>
            <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, textTransform: 'uppercase' }}>Account preview · {messageClass}</div>
            <div style={{ marginTop: SP.xs, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 700 }}>{subject || 'Subject'}</div>
            <div style={{ marginTop: SP.xs, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{body || 'Message'}</div>
          </div>
        </div>
      )}
    />
  );
}
