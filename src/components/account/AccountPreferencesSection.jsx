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
import { Sliders, Bot, FileText, Map as MapIcon, Bell, Check } from 'lucide-react';
import { DETAIL_LEVELS } from '../../store/uiSlice.js';
import { useStore } from '../../store/index.js';
import {
  GOLD, INK, SECOND, BODY, BORDER, sans, SP, R, FS, swatch,
} from '../theme.js';
import Section from './AccountSection.jsx';

const DETAIL_LABELS = { guided: 'Overview (guided)', standard: 'Detail (standard)', expert: 'Engine (expert)' };
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

function PrefRow({ icon: Icon, label, desc, children }) {
  return (
    <div style={{ display: 'flex', gap: SP.md, alignItems: 'flex-start', padding: `${SP.sm}px 0`, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.sm, fontWeight: 700, color: INK }}>
          {Icon && <Icon size={14} color={GOLD} />} {label}
        </div>
        {desc && <div style={{ fontSize: FS.xs, color: BODY, marginTop: 2, lineHeight: 1.45 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

export default function AccountPreferencesSection({ emailNotifications, setEmailNotifications }) {
  const prefs = useStore(s => s.productPrefs) || {};
  const setProductPref = useStore(s => s.setProductPref);

  return (
    <Section title="Product Preferences" icon={Sliders}>
      <p style={{ fontSize: FS.xs, color: BODY, margin: `0 0 ${SP.sm}px`, lineHeight: 1.5, fontFamily: sans }}>
        Defaults for new settlements, campaigns, and exports. These don't change anything you've already made.
      </p>

      {/* Default detail level */}
      <PrefRow
        icon={Sliders}
        label="Default detail level"
        desc="The altitude a fresh dossier opens at."
      >
        <select
          aria-label="Default detail level"
          value={prefs.defaultDetailLevel || 'guided'}
          onChange={e => setProductPref('defaultDetailLevel', e.target.value)}
          style={selectStyle()}
        >
          {DETAIL_LEVELS.map(lvl => (
            <option key={lvl} value={lvl}>{DETAIL_LABELS[lvl] || lvl}</option>
          ))}
        </select>
      </PrefRow>

      {/* AI polish default */}
      <PrefRow
        icon={Bot}
        label="AI-polish new generations by default"
        desc="Pre-check the AI prose-polish option on the generator (uses credits)."
      >
        <input
          aria-label="AI-polish by default"
          type="checkbox"
          checked={prefs.aiPolishDefault === true}
          onChange={e => setProductPref('aiPolishDefault', e.target.checked)}
        />
      </PrefRow>

      {/* PDF / export style */}
      <PrefRow
        icon={FileText}
        label="Default PDF / export style"
        desc="The look applied to new PDF and print exports."
      >
        <select
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
        icon={MapIcon}
        label="Auto-save map edits in campaigns"
        desc="Persist world-map changes automatically while running a campaign."
      >
        <input
          aria-label="Auto-save campaign map edits"
          type="checkbox"
          checked={prefs.campaignMapAutosave !== false}
          onChange={e => setProductPref('campaignMapAutosave', e.target.checked)}
        />
      </PrefRow>

      {/* Notification preferences (reuses the profile email flag) */}
      <PrefRow
        icon={Bell}
        label="Email notifications"
        desc="Product news, lifecycle, and account emails."
      >
        <input
          aria-label="Email notifications preference"
          type="checkbox"
          checked={emailNotifications !== false}
          onChange={e => setEmailNotifications?.(e.target.checked)}
        />
      </PrefRow>

      <div style={{ fontSize: FS.xs, color: SECOND, marginTop: SP.md, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Check size={13} color={swatch.success} /> Preferences save automatically.
      </div>
    </Section>
  );
}
