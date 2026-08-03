/**
 * AccountProfileSection.jsx — Profile / identity section of the Account page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition. Presentational:
 * the name/model-preference state, handlers and store access stay in AccountPage
 * and arrive via props. The RoleBadge helper moved here with it (it was only
 * used by this section).
 *
 * THE ONE EXCEPTION, and the reason it is one: the profile-image block
 * (AccountIdentitySection) is SELF-CONTAINED rather than prop-driven, following
 * the FounderCreditToggle / FounderChairBio precedent two blocks below. Its
 * column and bucket ship with a dark migration, so it has to feature-detect and
 * hide itself; threading that dormancy up through this component's props and
 * AccountPage's state would spread a temporary schema condition across three
 * files for no gain.
 */
import { User, Shield, Check, X, Edit3, Bot, } from 'lucide-react';
import { AI_MODEL_OPTIONS } from '../../config/pricing.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import FounderBadge from '../primitives/FounderBadge.jsx';
import FounderCreditToggle from './FounderCreditToggle.jsx';
import FounderChairBio from './FounderChairBio.jsx';
import IconButton from '../primitives/IconButton.jsx';
import PublicAvatar from '../primitives/PublicAvatar.jsx';
import AccountIdentitySection from './AccountIdentitySection.jsx';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, serif_, SP, FS, swatch } from '../theme.js';
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
      padding: '3px 10px',
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
        {/* The account's own identity, rendered through THE SAME component every
            public surface uses (§6). Not a lookalike: a second hand-rolled avatar
            here is how the letter-circle's size, hue and fallback rules quietly
            drift apart from the ones the gallery shows, and how a consent bug
            gets to hide behind "well, the account page looked right".
            optedIn is true because this is the user looking at themselves — the
            consent switch governs PUBLIC surfaces, not this preview. */}
        <PublicAvatar
          identity={{
            displayName: auth.displayName || auth.user.email || '',
            imageUrl: auth.avatarUrl || '',
            optedIn: true,
          }}
          rung="standard"
          size={56}
          ring="none"
          eager
        />

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
                    border: `1px solid ${GOLD}`,
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
                  tone="danger"
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
                  size="md"
                />
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
          <div style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, border: '1px solid #e8b0b0', fontSize: FS.sm, color: swatch.danger }}>
            {profileError}
          </div>
        )}
        {/* THE PROFILE IMAGE (DESIGN_PROFILE_IMAGE.md §3/§4).
            This REPLACES the old free-text "Avatar URL" box, deliberately and
            with a behavior change worth naming: pasting a remote URL hotlinked
            an image this product did not host, could not moderate, could not
            sweep, and whose EXIF it never touched. The upload pipeline owns all
            four. It is also now the SINGLE WRITER of profiles.avatar_url — the
            old box wrote the same column from the Save-profile button below, and
            a stale draft string there would have clobbered a freshly uploaded
            image on the next save. */}
        <AccountIdentitySection />
        <label htmlFor="account-model-preference" style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontSize: FS.xs, fontWeight: 700, color: SECOND }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Bot size={14} color={GOLD} /> AI model preference</span>
          <select
            id="account-model-preference"
            value={modelPreference}
            onChange={e => setModelPreference(e.target.value)}
            style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, fontSize: FS.sm, fontFamily: sans, color: INK, background: CARD }}
          >
            {AI_MODEL_OPTIONS.map(option => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
        </label>
        {/* Founder-only: opt in to the public credits roll (170). Self-gates +
            hides itself when the migration is undeployed. */}
        <FounderCreditToggle />
        {/* Chair-holders only: the founder's own line on their plate in the
            Founders' Hall. Same self-gating discipline as the toggle above — it
            EXISTS only for an account that holds a chair (the presence law), and
            hides itself while the chair schema is undeployed. */}
        <FounderChairBio />
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
