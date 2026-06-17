/**
 * AccountSupportSection.jsx — Customer Support contact form for the Account
 * page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition. Purely
 * presentational: all state, handlers, and store access stay in AccountPage
 * and arrive via props.
 */
import { Headphones, Check } from 'lucide-react';
import { GOLD, SECOND, BORDER, sans, SP, R, FS, swatch } from '../theme.js';
import Section from './AccountSection.jsx';
import Button from '../primitives/Button.jsx';

export default function AccountSupportSection({
  auth,
  supportSent, setSupportSent,
  supportError,
  supportSubject, setSupportSubject,
  supportMessage, setSupportMessage,
  supportSending, handleSendSupport,
}) {
  return (
    <Section title="Customer Support" icon={Headphones}>
      {supportSent ? (
        <div style={{
          textAlign: 'center', padding: SP.lg,
          background: swatch.successBg, borderRadius: R.lg,
        }}>
          <Check size={32} color="#2a7a2a" style={{ marginBottom: SP.sm }} />
          <div style={{ fontSize: FS.md, fontWeight: 600, color: swatch.success }}>
            Message sent successfully!
          </div>
          <div style={{ fontSize: FS.sm, color: swatch['#4A8A60'], marginTop: SP.xs }}>
            We'll get back to you at {auth.user.email}
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setSupportSent(false)}
            style={{ marginTop: SP.md }}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
          <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5 }}>
            Have a question or issue? Send us a message and we'll get back to you.
            You can also email us directly at{' '}
            <a href="mailto:clausellstokes@aol.com" style={{ color: GOLD, fontWeight: 600 }}>
              clausellstokes@aol.com
            </a>
          </div>

          {supportError && (
            <div style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, border: '1px solid #e8b0b0', borderRadius: R.md, fontSize: FS.sm, color: swatch.danger }}>
              {supportError}
            </div>
          )}

          <input
            aria-label="Subject"
            type="text" placeholder="Subject"
            value={supportSubject} onChange={e => setSupportSubject(e.target.value)}
            style={{
              width: '100%', padding: `${SP.sm + 2}px ${SP.md}px`,
              border: `1px solid ${BORDER}`, borderRadius: R.md,
              fontSize: FS.md, fontFamily: sans, outline: 'none', boxSizing: 'border-box',
            }}
          />
          <textarea
            aria-label="Describe your issue or question"
            placeholder="Describe your issue or question..."
            value={supportMessage} onChange={e => setSupportMessage(e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: `${SP.sm + 2}px ${SP.md}px`,
              border: `1px solid ${BORDER}`, borderRadius: R.md,
              fontSize: FS.md, fontFamily: sans, outline: 'none',
              resize: 'vertical', boxSizing: 'border-box',
            }}
          />
          <Button
            variant="primary"
            size="lg"
            fullWidth
            busy={supportSending}
            onClick={handleSendSupport}
            disabled={supportSending || !supportSubject.trim() || !supportMessage.trim()}
          >
            {supportSending ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      )}
    </Section>
  );
}
