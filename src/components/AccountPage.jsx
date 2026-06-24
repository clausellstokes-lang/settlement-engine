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
  Shield, ChevronRight,
} from 'lucide-react';
import { useStore } from '../store/index.js';
import { navigate } from '../hooks/useRoute.js';
import { auth as authService } from '../lib/auth.js';
import { saves as savesService } from '../lib/saves.js';
import { startCheckout, startCustomerPortal } from '../lib/stripe.js';
import { DEFAULT_MODEL_PREFERENCE } from '../config/pricing.js';
import { activeSaveCount, inactiveRetentionCount } from '../lib/saveAccess.js';
import { INK, MUTED, SECOND, sans, FS, layout } from './theme.js';
import { space } from '../design/tokens.js';
import Button from './primitives/Button.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import AccountProfileSection from './account/AccountProfileSection.jsx';
import AccountSecuritySection from './account/AccountSecuritySection.jsx';
import AccountRecoveryQuestionsSection from './account/AccountRecoveryQuestionsSection.jsx';
import AccountSubscriptionSection from './account/AccountSubscriptionSection.jsx';
import AccountDataPrivacySection from './account/AccountDataPrivacySection.jsx';
import AccountPreferencesSection from './account/AccountPreferencesSection.jsx';
import AccountSupportSection from './account/AccountSupportSection.jsx';
// FAQ relocated to the About page (spec §13); the full accordion (AccountFAQ)
// is rendered there now, with a slim pointer left on this page.

export default function AccountPage({ onNavigateAdmin }) {
  const auth = useStore(s => s.auth);
  const creditBalance = useStore(s => s.creditBalance);
  const isElevated = useStore(s => s.isElevated());
  const savedSettlements = useStore(s => s.savedSettlements);
  const campaigns = useStore(s => s.campaigns);
  const maxSaves = useStore(s => s.maxSaves());
  const authSignOut = useStore(s => s.authSignOut);
  const removeSavedSettlement = useStore(s => s.removeSavedSettlement);
  const clearSavedSettlements = useStore(s => s.clearSavedSettlements);
  const deleteCampaign = useStore(s => s.deleteCampaign);
  const activeSaves = activeSaveCount(savedSettlements);
  const inactiveSaves = inactiveRetentionCount(savedSettlements);

  // Display name editing
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(auth.displayName || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState(null);

  // Public author name (external_name) editing — mirrors the display-name editor
  // but writes through the validating update_external_name RPC (migration 075).
  const [editingExternalName, setEditingExternalName] = useState(false);
  const [externalNameInput, setExternalNameInput] = useState(auth.externalName || '');
  const [externalNameSaving, setExternalNameSaving] = useState(false);
  const [externalNameError, setExternalNameError] = useState(null);

  // Private name parts (first/last/preferred). Saved together via the
  // update_profile_names RPC; these are owner-writable (not RLS-pinned).
  const [firstNameInput, setFirstNameInput] = useState(auth.firstName || '');
  const [lastNameInput, setLastNameInput] = useState(auth.lastName || '');
  const [preferredNameInput, setPreferredNameInput] = useState(auth.preferredName || '');
  const [namesSaving, setNamesSaving] = useState(false);
  const [namesSaved, setNamesSaved] = useState(false);
  const [namesError, setNamesError] = useState(null);
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

  // Support form moved into AccountSupportSection (A5 ticket workflow).

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
    setNameError(null);
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
      // Surface the failure in the editor instead of swallowing to console —
      // every sibling mutation on this page reports its errors, so a silent
      // rename would let the user believe a save succeeded when it did not.
      setNameError(e?.message || 'Could not update your display name. Please try again.');
    } finally {
      setNameSaving(false);
    }
  };

  /**
   * Save the public gallery author name (external_name). Routes through the
   * validating update_external_name RPC (uniqueness + reserved-word + charset
   * are enforced server-side); the friendly error is surfaced inline, mirroring
   * handleSaveName. On success the session is refetched so the new name flows
   * back into auth state (and thus every gallery surface that resolves it).
   */
  const handleSaveExternalName = async () => {
    const trimmed = externalNameInput.trim();
    if (!trimmed) return;
    setExternalNameSaving(true);
    setExternalNameError(null);
    try {
      const saved = await authService.updateExternalName(trimmed);
      setEditingExternalName(false);
      const result = await authService.getSession();
      if (result) {
        useStore.getState().setAuth(
          result.user, result.session, result.tier, result.role,
          result.displayName, result.isFounder, result.avatarUrl,
          result.emailNotifications, result.modelPreference,
          { ...result, externalName: saved ?? result.externalName },
        );
      }
    } catch (e) {
      setExternalNameError(e?.message || 'Could not update your author name. Please try again.');
    } finally {
      setExternalNameSaving(false);
    }
  };

  /**
   * Save the private name parts (first/last/preferred) via update_profile_names.
   * These are owner-writable and surfaced only on the account page.
   */
  const handleSaveProfileNames = async () => {
    setNamesSaving(true);
    setNamesSaved(false);
    setNamesError(null);
    try {
      await authService.updateProfileNames({
        firstName: firstNameInput.trim(),
        lastName: lastNameInput.trim(),
        preferredName: preferredNameInput.trim(),
      });
      const result = await authService.getSession();
      if (result) {
        useStore.getState().setAuth(
          result.user, result.session, result.tier, result.role,
          result.displayName, result.isFounder, result.avatarUrl,
          result.emailNotifications, result.modelPreference,
          result,
        );
      }
      setNamesSaved(true);
      setTimeout(() => setNamesSaved(false), 1800);
    } catch (e) {
      setNamesError(e?.message || 'Could not update your profile names. Please try again.');
    } finally {
      setNamesSaving(false);
    }
  };

  // Email notifications persist immediately, mirroring every other Preferences
  // row (setProductPref). Wiring it to the profile-save handler instead would
  // make the section's "Preferences save automatically" note false for this one
  // toggle — the change would be silently discarded on navigation.
  const handleEmailNotificationsChange = async (next) => {
    setEmailNotifications(next);
    try {
      const profile = await authService.updateProfilePreferences({ emailNotifications: next });
      const result = await authService.getSession();
      const merged = result || { ...auth, ...profile };
      useStore.getState().setAuth(
        merged.user || auth.user,
        merged.session || auth.session,
        merged.tier || auth.tier,
        merged.role || auth.role,
        merged.displayName || auth.displayName,
        merged.isFounder ?? auth.isFounder,
        profile?.avatarUrl ?? merged.avatarUrl ?? auth.avatarUrl,
        profile?.emailNotifications ?? merged.emailNotifications ?? next,
        profile?.modelPreference ?? merged.modelPreference ?? auth.modelPreference,
      );
    } catch {
      // Roll the toggle back so the control never lies about persisted state.
      setEmailNotifications(!next);
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

  // Bulk content deletion (Data & Privacy). Delete each saved settlement
  // through the saves service so the server copy goes too, then clear local
  // state. Failures on individual rows are swallowed so one bad row can't wedge
  // the whole wipe — local state is cleared regardless.
  const handleDeleteAllSettlements = async () => {
    const ids = (savedSettlements || []).map(s => s.id);
    await Promise.allSettled(ids.map(id => savesService.delete?.(id)));
    if (typeof clearSavedSettlements === 'function') clearSavedSettlements();
    else ids.forEach(id => removeSavedSettlement?.(id));
  };

  const handleDeleteAllCampaigns = async () => {
    const ids = (campaigns || []).map(c => c.id);
    // deleteCampaign persists each removal (deletePersistedCampaignState).
    ids.forEach(id => deleteCampaign?.(id));
  };

  if (!auth.user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: MUTED, fontFamily: sans }}>
        <p style={{ fontSize: FS.lg }}>Sign in to access your account settings.</p>
      </div>
    );
  }

  return (
    <Page max={layout.page}>
      {/* ── Page header — the page's one dominant focal point ────── */}
      <PageHeader eyebrow="Your account" title="Account" subtitle={auth.user.email} />

      <div style={{
        // space-7 (32) between sections — a clear step above the intra-section
        // SP.xl/SP.lg (20/16) gaps, so SPACING carries the page-level grouping
        // and the section chrome can recede to a hairline rule (P5). At SP.xxl
        // (24) the between/within differential was too small to read as grouping.
        display: 'flex', flexDirection: 'column', gap: space['space-7'],
      }}>
      {/* ── Profile section ────────────────────────────────────── */}
      <AccountProfileSection
        auth={auth}
        avatarInput={avatarInput} setAvatarInput={setAvatarInput}
        modelPreference={modelPreference} setModelPreference={setModelPreference}
        editingName={editingName} setEditingName={setEditingName}
        nameInput={nameInput} setNameInput={setNameInput}
        nameSaving={nameSaving} handleSaveName={handleSaveName}
        nameError={nameError}
        editingExternalName={editingExternalName} setEditingExternalName={setEditingExternalName}
        externalNameInput={externalNameInput} setExternalNameInput={setExternalNameInput}
        externalNameSaving={externalNameSaving} handleSaveExternalName={handleSaveExternalName}
        externalNameError={externalNameError}
        firstNameInput={firstNameInput} setFirstNameInput={setFirstNameInput}
        lastNameInput={lastNameInput} setLastNameInput={setLastNameInput}
        preferredNameInput={preferredNameInput} setPreferredNameInput={setPreferredNameInput}
        namesSaving={namesSaving} namesSaved={namesSaved} namesError={namesError}
        handleSaveProfileNames={handleSaveProfileNames}
        profileError={profileError} profileSaving={profileSaving} profileSaved={profileSaved}
        handleSaveProfilePreferences={handleSaveProfilePreferences}
      />

      {/* ── Subscription & Credits (Billing) — the headline state ─
          leads the stack directly under identity as the one feature
          section, so the at-a-glance tier/credits/saves aren't buried. */}
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
        onNavigatePricing={() => navigate('pricing')}
      />

      {/* ── Login & Security ────────────────────────────────────── */}
      <AccountSecuritySection auth={auth} onSignOut={authSignOut} />

      {/* ── Account recovery questions ──────────────────────────────
          The durable home for security-question enrollment: sign-up's
          deferred capture is best-effort, so this is where any account
          (OAuth, confirmed elsewhere, closed-window) sets or replaces its
          two questions and the forgot-password path it unlocks. */}
      <AccountRecoveryQuestionsSection />

      {/* ── Data & Privacy (export, deletion, consent, visibility) ── */}
      <AccountDataPrivacySection
        auth={auth}
        settlementCount={(savedSettlements || []).length}
        campaignCount={(campaigns || []).length}
        onDeleteAllSettlements={handleDeleteAllSettlements}
        onDeleteAllCampaigns={handleDeleteAllCampaigns}
        onSignOut={authSignOut}
      />

      {/* ── Product Preferences ─────────────────────────────────── */}
      <AccountPreferencesSection
        emailNotifications={emailNotifications}
        setEmailNotifications={handleEmailNotificationsChange}
      />

      {/* ── Customer Support (FAQ-first, then tickets) ──────────── */}
      <AccountSupportSection auth={auth} />

      {/* ── Developer / Admin Panel link ──────────────────────────
          A subordinate utility-nav affordance: a quiet ghost row, not a
          loud bordered tile — it must not out-shout the account content
          or the Subscription primary CTA. */}
      {isElevated && onNavigateAdmin && (
        <Button
          variant="ghost"
          size="md"
          fullWidth
          onClick={onNavigateAdmin}
          icon={<Shield size={16} color={SECOND} />}
          trailingIcon={<ChevronRight size={16} color={MUTED} style={{ marginLeft: 'auto' }} />}
          style={{ justifyContent: 'flex-start', fontFamily: sans, textAlign: 'left' }}
        >
          <span style={{ flex: 1, textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: FS.sm, fontWeight: 700, color: INK }}>Developer Admin Panel</span>
            <span style={{ display: 'block', fontSize: FS.xs, fontWeight: 400, color: SECOND }}>Manage users, credits, roles, and system configuration</span>
          </span>
        </Button>
      )}
      {/* Sign-out lives on the header account chip and in Login & Security
          ("sign out everywhere"); a redundant page-bottom button here sat one
          mis-click below Support, so it was removed to keep a single, clearly
          placed sign-out affordance. */}
      </div>
    </Page>
  );
}
