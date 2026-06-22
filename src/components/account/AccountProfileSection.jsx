/**
 * AccountProfileSection.jsx — Profile / identity section of the Account page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition. Purely
 * presentational: all state, handlers, and store access stay in AccountPage
 * and arrive via props. The RoleBadge helper moved here with it (it was only
 * used by this section).
 */
import {
  User, Check, X, Edit3, Bot,
} from 'lucide-react';
import { AI_MODEL_OPTIONS } from '../../config/pricing.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import FounderBadge from '../primitives/FounderBadge.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { RoleBadge } from '../auth/authUI.jsx';
import { GOLD, INK, BODY, SECOND, BORDER, CARD, sans, serif_, SP, R, FS, swatch, DANGER_BORDER } from '../theme.js';
import Section from './AccountSection.jsx';

/**
 * Build a CSS background-image declaration for an avatar URL, but only for
 * http(s) URLs we can trust — never javascript:/data:/other schemes — and with
 * the value CSS-escaped so it cannot break out of the url() literal into
 * arbitrary CSS. Returns null when the URL is empty or not a safe http(s) URL,
 * so callers fall back to the initial-letter gradient.
 * @param {string} url
 * @returns {string | null}
 */
function avatarBackground(url) {
  if (!url) return null;
  let parsed;
  try {
    // Parse WITHOUT a base so only absolute URLs qualify — a bare string like
    // `");background:red;//` won't be silently resolved to a same-origin URL.
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  const escaped = typeof CSS !== 'undefined' && CSS.escape
    ? CSS.escape(parsed.href)
    // Fallback for environments without CSS.escape: neutralize the only chars
    // that can terminate the url("...") literal.
    : parsed.href.replace(/["\\]/g, '\\$&');
  return `center / cover no-repeat url("${escaped}")`;
}

export default function AccountProfileSection({
  auth,
  avatarInput, setAvatarInput,
  modelPreference, setModelPreference,
  editingName, setEditingName,
  nameInput, setNameInput,
  nameSaving, handleSaveName,
  nameError,
  profileError, profileSaving, profileSaved,
  handleSaveProfilePreferences,
}) {
  // Only render a real avatar image for a validated, CSS-escaped http(s) URL;
  // anything else (empty, javascript:, data:, malformed) falls back to the
  // initial-letter gradient.
  const avatarBg = avatarBackground(avatarInput);
  return (
    <Section title="Profile" icon={User}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: SP.lg }}>
        {/* Avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: avatarBg || `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: swatch.white, fontWeight: 700, fontSize: FS['22'], fontFamily: serif_,
        }}>
          {!avatarBg && (auth.displayName || auth.user.email || '?')[0].toUpperCase()}
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
                <IconButton
                  Icon={Check}
                  label="Save name"
                  onClick={handleSaveName}
                  disabled={nameSaving}
                  tone="ghost"
                  size="lg"
                />
                <IconButton
                  Icon={X}
                  label="Cancel editing"
                  onClick={() => setEditingName(false)}
                  tone="ghost"
                  size="lg"
                />
              </>
            ) : (
              <>
                <span style={{ fontSize: FS.xl, fontWeight: 700, color: INK, fontFamily: serif_ }}>
                  {auth.displayName || t('account.setDisplayName')}
                </span>
                <IconButton
                  Icon={Edit3}
                  label="Edit name"
                  onClick={() => { setNameInput(auth.displayName || ''); setEditingName(true); }}
                  tone="ghost"
                  size="lg"
                />
              </>
            )}
          </div>
          {nameError && (
            <div role="alert" style={{ marginBottom: SP.xs, padding: `${SP.xs}px ${SP.sm}px`, background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.sm, fontSize: FS.xs, color: swatch.danger }}>
              {nameError}
            </div>
          )}
          <div style={{ fontSize: FS.sm, color: BODY }}>{auth.user.email}</div>
          <div style={{ marginTop: SP.sm, display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
            <RoleBadge role={auth.role} />
            <FounderBadge size="md" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md, marginTop: SP.lg }}>
        {profileError && (
          <div style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.danger }}>
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
        {/* Email-notifications toggle is the single source of truth in
            Preferences now; it was duplicated here against the same handler. */}
        <label htmlFor="account-model-preference" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontSize: FS.xs, fontWeight: 700, color: SECOND }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Bot size={14} color={GOLD} /> Narration model</span>
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
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveProfilePreferences}
          busy={profileSaving}
          icon={<Check size={14} />}
          style={{ alignSelf: 'flex-start' }}
        >
          {profileSaving ? 'Saving...' : profileSaved ? 'Saved' : 'Save profile'}
        </Button>
      </div>
    </Section>
  );
}
