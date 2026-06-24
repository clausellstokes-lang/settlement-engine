/**
 * AccountProfileSection.jsx — Profile / identity section of the Account page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition. Purely
 * presentational: all state, handlers, and store access stay in AccountPage
 * and arrive via props. The RoleBadge helper moved here with it (it was only
 * used by this section).
 */
import {
  Check, X, Edit3,
} from 'lucide-react';
import { AI_MODEL_OPTIONS, getTierDisplayName } from '../../config/pricing.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import FounderBadge from '../primitives/FounderBadge.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Pill from '../primitives/Pill.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import { RoleBadge } from '../auth/authUI.jsx';
import { GOLD, GOLD_TXT, INK, BODY, SECOND, BORDER, CARD, sans, serif_, SP, R, FS, swatch, TINT_GOLD, DANGER_BORDER } from '../theme.js';
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
  editingExternalName, setEditingExternalName,
  externalNameInput, setExternalNameInput,
  externalNameSaving, handleSaveExternalName,
  externalNameError,
  firstNameInput, setFirstNameInput,
  lastNameInput, setLastNameInput,
  preferredNameInput, setPreferredNameInput,
  namesSaving, namesSaved, namesError,
  handleSaveProfileNames,
  profileError, profileSaving, profileSaved,
  handleSaveProfilePreferences,
}) {
  // Only render a real avatar image for a validated, CSS-escaped http(s) URL;
  // anything else (empty, javascript:, data:, malformed) falls back to the
  // initial-letter gradient.
  const avatarBg = avatarBackground(avatarInput);
  // Rename is one of the two writes allowed on mobile (rename + save), so the
  // inline editor must stay comfortable on a phone. Below 640 the input + the
  // two 44px-floored icon buttons are crammed into a no-wrap row beside the
  // avatar; let that row wrap so the input keeps a usable width and the controls
  // drop to a second line when they can't sit beside it. Desktop stays a single
  // no-wrap row byte-identical.
  const isMobile = useIsMobile();
  return (
    <Section title="Profile">
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
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.xs, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            {editingName ? (
              <>
                <input
                  aria-label="Display name"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  style={{
                    // Mobile: a min-width floor keeps the input legible and lets the
                    // 44px Save/Cancel buttons wrap below it when they can't fit
                    // alongside. Desktop keeps the plain flex:1 single-row layout.
                    flex: isMobile ? '1 1 160px' : 1,
                    minWidth: isMobile ? 160 : undefined,
                    padding: `${SP.xs}px ${SP.sm}px`,
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
            {/* Quiet tier chip so a free user sees their plan in the header,
                not only in the Subscription section. The label is the tier
                display name only ('Wanderer') — the raw lowercase tier key is a
                code identifier and stays out of user copy (voice rule). Calm
                parchment/gold-tint surface, matching the demoted-control house
                style, so it never reads as a loud control. */}
            {getTierDisplayName(auth.tier) && (
              <Pill bg={TINT_GOLD} color={GOLD_TXT}>
                {getTierDisplayName(auth.tier)}
              </Pill>
            )}
            <RoleBadge role={auth.role} />
            <FounderBadge size="md" />
          </div>
        </div>
      </div>

      {/* ── Account identity (migration 075) ─────────────────────────────────
          The public author name (external_name) is owner-editable and shown on
          every settlement and map this account shares. The Account ID
          (account_number) is the immutable, private handle to quote on a support
          ticket — never editable here. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md, marginTop: SP.lg, paddingTop: SP.lg, borderTop: `1px solid ${BORDER}` }}>
        {/* Public author name — inline editor mirroring the display-name row. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          <span style={{ fontSize: FS.xs, fontWeight: 700, color: SECOND }}>
            Author name
          </span>
          <span style={{ fontSize: FS.xs, color: SECOND }}>
            Shown on every settlement and map you share. Letters, numbers, and underscores.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: isMobile ? 'wrap' : 'nowrap', marginTop: SP.xs }}>
            {editingExternalName ? (
              <>
                <input
                  aria-label="Public author name"
                  value={externalNameInput}
                  onChange={e => setExternalNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveExternalName()}
                  maxLength={24}
                  style={{
                    flex: isMobile ? '1 1 160px' : 1,
                    minWidth: isMobile ? 160 : undefined,
                    padding: `${SP.xs}px ${SP.sm}px`,
                    border: `1px solid ${GOLD}`, borderRadius: R.sm,
                    fontSize: FS.md, fontFamily: sans, fontWeight: 600,
                    color: INK, outline: 'none',
                  }}
                  // eslint-disable-next-line jsx-a11y/no-autofocus -- focus the inline author-name editor when it opens
                  autoFocus
                />
                <IconButton
                  Icon={Check}
                  label="Save author name"
                  onClick={handleSaveExternalName}
                  disabled={externalNameSaving}
                  tone="ghost"
                  size="lg"
                />
                <IconButton
                  Icon={X}
                  label="Cancel editing author name"
                  onClick={() => setEditingExternalName(false)}
                  tone="ghost"
                  size="lg"
                />
              </>
            ) : (
              <>
                <span style={{ fontSize: FS.md, fontWeight: 600, color: INK, fontFamily: sans }}>
                  {auth.externalName || 'Not set yet'}
                </span>
                <IconButton
                  Icon={Edit3}
                  label="Edit author name"
                  onClick={() => { setExternalNameInput(auth.externalName || ''); setEditingExternalName(true); }}
                  tone="ghost"
                  size="lg"
                />
              </>
            )}
          </div>
          {externalNameError && (
            <div role="alert" style={{ padding: `${SP.xs}px ${SP.sm}px`, background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.sm, fontSize: FS.xs, color: swatch.danger }}>
              {externalNameError}
            </div>
          )}
        </div>

        {/* Account ID — immutable, private, read-only. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          <span style={{ fontSize: FS.xs, fontWeight: 700, color: SECOND }}>
            Account ID
          </span>
          <span style={{ fontSize: FS.xs, color: SECOND }}>
            Quote this on a support ticket so we know it is you.
          </span>
          {auth.accountNumber ? (
            <span style={{
              alignSelf: 'flex-start', marginTop: SP.xs,
              padding: `${SP.xs}px ${SP.sm}px`,
              background: TINT_GOLD, color: GOLD_TXT,
              border: `1px solid ${BORDER}`, borderRadius: R.sm,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: FS.sm, fontWeight: 700, letterSpacing: '0.04em',
            }}>
              {auth.accountNumber}
            </span>
          ) : (
            <span style={{ marginTop: SP.xs, fontSize: FS.sm, color: SECOND }}>Assigned shortly.</span>
          )}
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
          <span>Narration model</span>
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

      {/* ── Private name (migration 075) ─────────────────────────────────────
          First / last / preferred. Internal-only — never shown publicly; the
          gallery author name above is the public identity. Owner-writable. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md, marginTop: SP.lg, paddingTop: SP.lg, borderTop: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: FS.xs, fontWeight: 700, color: SECOND }}>Your name (private)</span>
        {namesError && (
          <div role="alert" style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.danger }}>
            {namesError}
          </div>
        )}
        <div style={{ display: 'flex', gap: SP.md, flexWrap: 'wrap' }}>
          <label htmlFor="account-first-name" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontSize: FS.xs, fontWeight: 700, color: SECOND, flex: '1 1 160px' }}>
            First name
            <input
              id="account-first-name"
              aria-label="First name"
              value={firstNameInput}
              onChange={e => setFirstNameInput(e.target.value)}
              style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, borderRadius: R.md, fontSize: FS.sm, fontFamily: sans, color: INK }}
            />
          </label>
          <label htmlFor="account-last-name" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontSize: FS.xs, fontWeight: 700, color: SECOND, flex: '1 1 160px' }}>
            Last name
            <input
              id="account-last-name"
              aria-label="Last name"
              value={lastNameInput}
              onChange={e => setLastNameInput(e.target.value)}
              style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, borderRadius: R.md, fontSize: FS.sm, fontFamily: sans, color: INK }}
            />
          </label>
          <label htmlFor="account-preferred-name" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontSize: FS.xs, fontWeight: 700, color: SECOND, flex: '1 1 160px' }}>
            Preferred name
            <input
              id="account-preferred-name"
              aria-label="Preferred name"
              value={preferredNameInput}
              onChange={e => setPreferredNameInput(e.target.value)}
              style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, borderRadius: R.md, fontSize: FS.sm, fontFamily: sans, color: INK }}
            />
          </label>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveProfileNames}
          busy={namesSaving}
          icon={<Check size={14} />}
          aria-label="Save private name"
          style={{ alignSelf: 'flex-start' }}
        >
          {namesSaving ? 'Saving...' : namesSaved ? 'Saved' : 'Save private name'}
        </Button>
      </div>
    </Section>
  );
}
