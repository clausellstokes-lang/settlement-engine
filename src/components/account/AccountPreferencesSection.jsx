/**
 * AccountPreferencesSection.jsx — "Product Preferences" section of the Account
 * page.
 *
 * Durable, user-owned generation/export/notification defaults, backed by the
 * productPrefs store bag (setProductPref → persisted). These are DEFAULTS the
 * relevant surfaces read when they have no per-artifact override; changing one
 * here doesn't retroactively alter existing artifacts.
 *
 * Notification preferences reuse the existing profile `emailNotifications`
 * handler (passed from AccountPage) so there's a single source of truth for the
 * email opt-in; the rest live in productPrefs.
 */
import { useStore } from '../../store/index.js';
import {
  INK, SECOND, BODY, BORDER, sans, SP, R, FS, swatch,
} from '../theme.js';
import Section from './AccountSection.jsx';

const PDF_STYLES = [
  { key: 'classic', label: 'Classic' },
  { key: 'compact', label: 'Compact' },
  { key: 'parchment', label: 'Parchment' },
];

function selectStyle() {
  return {
    padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, borderRadius: R.md,
    fontSize: FS.sm, fontFamily: sans, color: INK, background: swatch.white,
  };
}

// PrefRow groups rows by vertical spacing rather than a per-row borderBottom
// (which drew a false floor on every row, including the last). When `htmlFor`
// is supplied the visible label is rendered as a <label> spanning the full row,
// so the click/tap target reaches ~44px and the text is programmatically tied
// to its control (mirrors VisibilityToggle in AccountDataPrivacySection).
function PrefRow({ label, desc, htmlFor, children }) {
  const Wrapper = htmlFor ? 'label' : 'div';
  const wrapperProps = htmlFor
    ? { htmlFor, style: { display: 'flex', gap: SP.md, alignItems: 'flex-start', padding: `${SP.md}px 0`, cursor: 'pointer' } }
    : { style: { display: 'flex', gap: SP.md, alignItems: 'flex-start', padding: `${SP.md}px 0` } };
  return (
    <Wrapper {...wrapperProps}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>
          {label}
        </div>
        {desc && <div style={{ fontSize: FS.xs, color: BODY, marginTop: 2, lineHeight: 1.45 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </Wrapper>
  );
}

export default function AccountPreferencesSection({ emailNotifications, setEmailNotifications }) {
  const prefs = useStore(s => s.productPrefs) || {};
  const setProductPref = useStore(s => s.setProductPref);

  return (
    <Section title="Product Preferences">
      <p style={{ fontSize: FS.xs, color: BODY, margin: `0 0 ${SP.sm}px`, lineHeight: 1.5, fontFamily: sans }}>
        Defaults for new settlements, campaigns, and exports. These do not change anything you have already made.
      </p>

      {/* AI polish default */}
      <PrefRow
        label="Narrate new settlements by default (uses credits)"
        desc="Pre-check the narrated prose pass on the generator."
        htmlFor="pref-ai-polish"
      >
        <input
          id="pref-ai-polish"
          aria-label="Narrate new settlements by default"
          type="checkbox"
          checked={prefs.aiPolishDefault === true}
          onChange={e => setProductPref('aiPolishDefault', e.target.checked)}
        />
      </PrefRow>

      {/* PDF / export style */}
      <PrefRow
        label="Default PDF / export style"
        desc="The look applied to new PDF and print exports."
        htmlFor="pref-pdf-style"
      >
        <select
          id="pref-pdf-style"
          aria-label="Default PDF style"
          value={prefs.pdfStyle || 'classic'}
          onChange={e => setProductPref('pdfStyle', e.target.value)}
          style={selectStyle()}
        >
          {PDF_STYLES.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </PrefRow>

      {/* Campaign / map preferences */}
      <PrefRow
        label="Auto-save map edits in campaigns"
        desc="Persist world-map changes automatically while running a campaign."
        htmlFor="pref-campaign-autosave"
      >
        <input
          id="pref-campaign-autosave"
          aria-label="Auto-save campaign map edits"
          type="checkbox"
          checked={prefs.campaignMapAutosave !== false}
          onChange={e => setProductPref('campaignMapAutosave', e.target.checked)}
        />
      </PrefRow>

      {/* Notification preferences (reuses the profile email flag) */}
      <PrefRow
        label="Email notifications"
        desc="Product news, lifecycle, and account emails."
        htmlFor="pref-email-notifications"
      >
        <input
          id="pref-email-notifications"
          aria-label="Email notifications preference"
          type="checkbox"
          checked={emailNotifications !== false}
          onChange={e => setEmailNotifications?.(e.target.checked)}
        />
      </PrefRow>

      <div style={{ fontSize: FS.xs, color: SECOND, marginTop: SP.md }}>
        Preferences save automatically.
      </div>
    </Section>
  );
}
