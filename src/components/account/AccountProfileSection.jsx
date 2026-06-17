/**
 * AccountProfileSection.jsx — Profile / identity section of the Account page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition. Purely
 * presentational: all state, handlers, and store access stay in AccountPage
 * and arrive via props. The RoleBadge helper moved here with it (it was only
 * used by this section).
 */
import {
  User, Shield, Check, X, Edit3, Mail, Bot,
} from 'lucide-react';
import { AI_MODEL_OPTIONS } from '../../config/pricing.js';
import { t } from '../../copy/index.js';
import FounderBadge from '../primitives/FounderBadge.jsx';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, serif_, SP, R, FS, swatch } from '../theme.js';
import Section from './AccountSection.jsx';

function RoleBadge({ role }) {
  if (role === 'user') return null;
  const cfg = {
    developer: { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', label: 'Developer' },
    admin:     { color: '#dc2626', bg: 'rgba(220,38,38,0.12)', label: 'Admin' },
  };
  const c = cfg[role] || cfg.admin;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '3px 10px', borderRadius: R.md,
      background: c.bg, color: c.color,
      fontSize: FS.xs, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      <Shield size={11} /> {c.label}
    </span>
  );
}

export default function AccountProfileSection({
  auth,
  avatarInput, setAvatarInput,
  emailNotifications, setEmailNotifications,
  modelPreference, setModelPreference,
  editingName, setEditingName,
  nameInput, setNameInput,
  nameSaving, handleSaveName,
  profileError, profileSaving, profileSaved,
  handleSaveProfilePreferences,
}) {
  return (
    <Section title="Profile" icon={User}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: SP.lg }}>
        {/* Avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: avatarInput
            ? `center / cover no-repeat url("${avatarInput}")`
            : `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: swatch.white, fontWeight: 700, fontSize: FS['22'], fontFamily: serif_,
        }}>
          {!avatarInput && (auth.displayName || auth.user.email || '?')[0].toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          {/* Display name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.xs }}>
            {editingName ? (
              <>
                <input
                  aria-label="Display name"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  style={{
                    flex: 1, padding: `${SP.xs}px ${SP.sm}px`,
                    border: `1px solid ${GOLD}`, borderRadius: R.sm,
                    fontSize: FS.lg, fontFamily: serif_, fontWeight: 600,
                    outline: 'none',
                  }}
                  // eslint-disable-next-line jsx-a11y/no-autofocus -- focus the inline name editor when it opens
                  autoFocus
                />
                <button onClick={handleSaveName} disabled={nameSaving}
                  aria-label="Save name"
                  style={{ background: 'none', border: 'none', color: swatch['#2A7A2A'], cursor: 'pointer' }}>
                  <Check size={18} />
                </button>
                <button onClick={() => setEditingName(false)}
                  aria-label="Cancel editing"
                  style={{ background: 'none', border: 'none', color: swatch.danger, cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <span style={{ fontSize: FS.xl, fontWeight: 700, color: INK, fontFamily: serif_ }}>
                  {auth.displayName || t('account.setDisplayName')}
                </span>
                <button onClick={() => { setNameInput(auth.displayName || ''); setEditingName(true); }}
                  aria-label="Edit name"
                  style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer' }}>
                  <Edit3 size={14} />
                </button>
              </>
            )}
          </div>
          <div style={{ fontSize: FS.sm, color: MUTED }}>{auth.user.email}</div>
          <div style={{ marginTop: SP.sm, display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
            <RoleBadge role={auth.role} />
            <FounderBadge size="md" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md, marginTop: SP.lg }}>
        {profileError && (
          <div style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, border: '1px solid #e8b0b0', borderRadius: R.md, fontSize: FS.sm, color: swatch.danger }}>
            {profileError}
          </div>
        )}
        <label htmlFor="account-avatar-url" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontSize: FS.xs, fontWeight: 700, color: SECOND }}>
          Avatar URL
          <input
            id="account-avatar-url"
            aria-label="Avatar URL"
            value={avatarInput}
            onChange={e => setAvatarInput(e.target.value)}
            placeholder="https://..."
            style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, borderRadius: R.md, fontSize: FS.sm, fontFamily: sans, color: INK }}
          />
        </label>
        <label htmlFor="account-email-notifications" style={{ display: 'flex', alignItems: 'center', gap: SP.sm, fontSize: FS.sm, color: SECOND, fontWeight: 700 }}>
          <input
            id="account-email-notifications"
            aria-label="Email notifications"
            type="checkbox"
            checked={emailNotifications}
            onChange={e => setEmailNotifications(e.target.checked)}
          />
          <Mail size={14} color={GOLD} /> Email notifications
        </label>
        <label htmlFor="account-model-preference" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontSize: FS.xs, fontWeight: 700, color: SECOND }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Bot size={14} color={GOLD} /> AI model preference</span>
          <select
            id="account-model-preference"
            value={modelPreference}
            onChange={e => setModelPreference(e.target.value)}
            style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, borderRadius: R.md, fontSize: FS.sm, fontFamily: sans, color: INK, background: CARD }}
          >
            {AI_MODEL_OPTIONS.map(option => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleSaveProfilePreferences}
          disabled={profileSaving}
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex', alignItems: 'center', gap: SP.xs,
            padding: `${SP.sm}px ${SP.lg}px`,
            background: GOLD, color: swatch.white, border: 'none',
            borderRadius: R.md, cursor: profileSaving ? 'wait' : 'pointer',
            fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
            opacity: profileSaving ? 0.65 : 1,
          }}
        >
          <Check size={14} /> {profileSaving ? 'Saving...' : profileSaved ? 'Saved' : 'Save profile'}
        </button>
      </div>
    </Section>
  );
}
