/**
 * AccountPage.jsx — Full-page account management.
 *
 * Sections:
 *   - Profile (display name, email, role badge)
 *   - Subscription tier & credits
 *   - Saved maps / campaigns
 *   - Purchase credits (inline, replaces PurchaseModal for this view)
 *   - Customer support contact form
 *   - Developer admin link (if role is developer/admin)
 */
import { useState } from 'react';
import {
  User, Shield, Headphones, ChevronRight,
} from 'lucide-react';
import { useStore } from '../store/index.js';
import { auth as authService } from '../lib/auth.js';
import { startCheckout, startCustomerPortal } from '../lib/stripe.js';
import { supabase } from '../lib/supabase.js';
import { DEFAULT_MODEL_PREFERENCE } from '../config/pricing.js';
import { activeSaveCount, inactiveRetentionCount } from '../lib/saveAccess.js';
import PrivacySettings from './PrivacySettings.jsx';
import { GOLD, INK, MUTED, SECOND, BORDER, sans, FS, SP, R } from './theme.js';
import Section from './account/AccountSection.jsx';
import Button from './primitives/Button.jsx';
import AccountProfileSection from './account/AccountProfileSection.jsx';
import AccountSubscriptionSection from './account/AccountSubscriptionSection.jsx';
import AccountSupportSection from './account/AccountSupportSection.jsx';
// FAQ relocated to the About page (spec §13); the full accordion (AccountFAQ)
// is rendered there now, with a slim pointer left on this page.

export default function AccountPage({ onNavigateAdmin }) {
  const auth = useStore(s => s.auth);
  const creditBalance = useStore(s => s.creditBalance);
  const isElevated = useStore(s => s.isElevated());
  const _isDeveloper = useStore(s => s.isDeveloper());
  const savedSettlements = useStore(s => s.savedSettlements);
  const maxSaves = useStore(s => s.maxSaves());
  const authSignOut = useStore(s => s.authSignOut);
  const activeSaves = activeSaveCount(savedSettlements);
  const inactiveSaves = inactiveRetentionCount(savedSettlements);

  // Display name editing
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(auth.displayName || '');
  const [nameSaving, setNameSaving] = useState(false);
  const profileSourceKey = [
    auth.avatarUrl || '',
    auth.emailNotifications !== false ? 'email:on' : 'email:off',
    auth.modelPreference || DEFAULT_MODEL_PREFERENCE,
  ].join('\u0000');
  const [profileDraft, setProfileDraft] = useState(() => ({
    sourceKey: profileSourceKey,
    avatarInput: auth.avatarUrl || '',
    emailNotifications: auth.emailNotifications !== false,
    modelPreference: auth.modelPreference || DEFAULT_MODEL_PREFERENCE,
  }));
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Support form
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSending, setSupportSending] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [supportError, setSupportError] = useState(null);

  // Purchase state
  const [purchasing, setPurchasing] = useState(null);
  const [purchaseError, setPurchaseError] = useState(null);
  const [portalBusy, setPortalBusy] = useState(false);

  if (!profileSaving && profileDraft.sourceKey !== profileSourceKey) {
    setProfileDraft({
      sourceKey: profileSourceKey,
      avatarInput: auth.avatarUrl || '',
      emailNotifications: auth.emailNotifications !== false,
      modelPreference: auth.modelPreference || DEFAULT_MODEL_PREFERENCE,
    });
  }

  const avatarInput = profileDraft.avatarInput;
  const emailNotifications = profileDraft.emailNotifications;
  const modelPreference = profileDraft.modelPreference;
  const setAvatarInput = (avatarInput) => setProfileDraft(draft => ({ ...draft, avatarInput }));
  const setEmailNotifications = (emailNotifications) => setProfileDraft(draft => ({ ...draft, emailNotifications }));
  const setModelPreference = (modelPreference) => setProfileDraft(draft => ({ ...draft, modelPreference }));

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setNameSaving(true);
    try {
      await authService.updateDisplayName(nameInput.trim());
      setEditingName(false);
      // Force refresh auth state
      const result = await authService.getSession();
      if (result) {
        useStore.getState().setAuth(
          result.user,
          result.session,
          result.tier,
          result.role,
          nameInput.trim(),
          result.isFounder,
          result.avatarUrl,
          result.emailNotifications,
          result.modelPreference,
        );
      }
    } catch (e) {
      console.error('Failed to update name:', e);
    } finally {
      setNameSaving(false);
    }
  };

  const handleSaveProfilePreferences = async () => {
    setProfileSaving(true);
    setProfileSaved(false);
    setProfileError(null);
    try {
      const profile = await authService.updateProfilePreferences({
        avatarUrl: avatarInput,
        emailNotifications,
        modelPreference,
      });
      const result = await authService.getSession();
      const next = result || { ...auth, ...profile };
      useStore.getState().setAuth(
        next.user || auth.user,
        next.session || auth.session,
        next.tier || auth.tier,
        next.role || auth.role,
        next.displayName || auth.displayName,
        next.isFounder ?? auth.isFounder,
        profile?.avatarUrl ?? next.avatarUrl ?? avatarInput,
        profile?.emailNotifications ?? next.emailNotifications ?? emailNotifications,
        profile?.modelPreference ?? next.modelPreference ?? modelPreference,
      );
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 1800);
    } catch (e) {
      setProfileError(e.message || 'Profile update failed');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleManageBilling = async () => {
    setPurchaseError(null);
    setPortalBusy(true);
    try {
      await startCustomerPortal();
    } catch (e) {
      setPurchaseError(e.message || 'Billing portal failed');
      setPortalBusy(false);
    }
  };

  const handleSendSupport = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) return;
    setSupportSending(true);
    setSupportError(null);
    try {
      if (supabase) {
        const { error } = await supabase.from('support_messages').insert({
          user_id: auth.user?.id,
          email: auth.user?.email || 'unknown',
          subject: supportSubject.trim(),
          message: supportMessage.trim(),
        });
        if (error) throw error;
      }
      setSupportSent(true);
      setSupportSubject('');
      setSupportMessage('');
    } catch (e) {
      setSupportError(e.message || 'Failed to send message');
    } finally {
      setSupportSending(false);
    }
  };

  const handlePurchase = async (product) => {
    setPurchaseError(null);
    setPurchasing(product);
    try {
      await startCheckout(product);
    } catch (e) {
      setPurchaseError(e.message);
      setPurchasing(null);
    }
  };

  if (!auth.user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: MUTED, fontFamily: sans }}>
        <User size={48} color={BORDER} style={{ marginBottom: SP.lg }} />
        <p style={{ fontSize: FS.lg }}>Sign in to access your account settings.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: SP.lg,
      maxWidth: 680, margin: '0 auto', padding: `${SP.lg}px 0`,
    }}>
      {/* ── Profile section ────────────────────────────────────── */}
      <AccountProfileSection
        auth={auth}
        avatarInput={avatarInput} setAvatarInput={setAvatarInput}
        emailNotifications={emailNotifications} setEmailNotifications={setEmailNotifications}
        modelPreference={modelPreference} setModelPreference={setModelPreference}
        editingName={editingName} setEditingName={setEditingName}
        nameInput={nameInput} setNameInput={setNameInput}
        nameSaving={nameSaving} handleSaveName={handleSaveName}
        profileError={profileError} profileSaving={profileSaving} profileSaved={profileSaved}
        handleSaveProfilePreferences={handleSaveProfilePreferences}
      />

      {/* ── Subscription & Credits ──────────────────────────────── */}
      <AccountSubscriptionSection
        auth={auth}
        isElevated={isElevated}
        creditBalance={creditBalance}
        activeSaves={activeSaves}
        inactiveSaves={inactiveSaves}
        maxSaves={maxSaves}
        portalBusy={portalBusy}
        handleManageBilling={handleManageBilling}
        purchaseError={purchaseError}
        purchasing={purchasing}
        handlePurchase={handlePurchase}
      />

      {/* ── FAQ (relocated to the About page, spec §13) ───────────────
          The Account page is no longer the primary FAQ location; keep a slim
          pointer to the full FAQ that now lives on the About page. */}
      <Section title="Frequently asked" icon={Headphones}>
        <p style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.55, margin: 0, fontFamily: sans }}>
          Questions about credits, billing, gallery privacy, or how the simulator relates to AI
          now live in the{' '}
          <a href="/how-to?tab=faq" style={{ color: GOLD, fontWeight: 700, textDecoration: 'underline' }}>
            FAQ on the About page
          </a>. Account-specific controls — your plan, credit balance, and billing portal — stay here.
        </p>
      </Section>

      {/* ── Customer Support ────────────────────────────────────── */}
      <AccountSupportSection
        auth={auth}
        supportSent={supportSent} setSupportSent={setSupportSent}
        supportError={supportError}
        supportSubject={supportSubject} setSupportSubject={setSupportSubject}
        supportMessage={supportMessage} setSupportMessage={setSupportMessage}
        supportSending={supportSending} handleSendSupport={handleSendSupport}
      />

      {/* ── Developer / Admin Panel link ────────────────────────── */}
      {isElevated && onNavigateAdmin && (
        <button
          type="button"
          onClick={onNavigateAdmin}
          style={{
            display: 'flex', alignItems: 'center', gap: SP.md,
            padding: `${SP.lg}px ${SP.xl}px`,
            background: 'rgba(124,58,237,0.06)',
            border: '2px solid rgba(124,58,237,0.2)',
            borderRadius: R.xl, cursor: 'pointer',
            fontFamily: sans, textAlign: 'left',
          }}
        >
          <Shield size={24} color="#7c3aed" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: FS.lg, fontWeight: 700, color: INK }}>Developer Admin Panel</div>
            <div style={{ fontSize: FS.sm, color: SECOND }}>Manage users, credits, roles, and system configuration</div>
          </div>
          <ChevronRight size={20} color={MUTED} />
        </button>
      )}

      {/* Privacy & data consent (P/§3) */}
      <PrivacySettings />

      {/* Sign out */}
      <Button variant="danger" size="lg" fullWidth onClick={authSignOut}>
        Sign Out
      </Button>
    </div>
  );
}
