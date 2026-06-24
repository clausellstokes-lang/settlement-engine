/**
 * AccountPage.jsx — Full-page account management, organized as a left-sidebar
 * ("bracket") settings layout: a rail of sections on the left (AccountNav), the
 * active section's panel on the right. Loads to Profile first.
 *
 * Sections (rail order): Profile · Security · Subscription · Support · Data ·
 * Preferences. AccountPage stays the state owner — every profile/name/billing/
 * purchase useState + handler lives here and is passed to the same section
 * components as before; the rail only switches which panel is mounted. Security
 * groups the sign-in/security panel with the account-recovery questions.
 *
 * The page intentionally has NO standalone bottom sign-out: sign-out lives on
 * the header account chip and in Security ("sign out everywhere"). Delete-account
 * stays inside Data, not a top-level destructive zone.
 */
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/index.js';
import { navigate } from '../hooks/useRoute.js';
import { auth as authService } from '../lib/auth.js';
import { saves as savesService } from '../lib/saves.js';
import { startCheckout, startCustomerPortal } from '../lib/stripe.js';
import { DEFAULT_MODEL_PREFERENCE } from '../config/pricing.js';
import { activeSaveCount, inactiveRetentionCount } from '../lib/saveAccess.js';
import { MUTED, sans, FS, layout } from './theme.js';
import { space } from '../design/tokens.js';
import useIsMobile from '../hooks/useIsMobile.js';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import AccountNav from './account/AccountNav.jsx';
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
  const importAccountData = useStore(s => s.importAccountData);
  const canSave = useStore(s => s.canSave());
  const activeSaves = activeSaveCount(savedSettlements);
  const inactiveSaves = inactiveRetentionCount(savedSettlements);
  const isMobile = useIsMobile();

  // Left-nav section selection. Profile loads first. Panels are mounted on
  // demand — switching away resets a section's in-progress form (a self-
  // contained settings task), which is the expected settings-nav behavior; the
  // section loaders (Security/Recovery/Tickets) are idempotent reads, so a
  // re-entry re-runs them harmlessly. URL-hash deep-linking (#security) is a
  // noted deferral — a refresh always lands on Profile.
  const [section, setSection] = useState('profile');
  const panelRef = useRef(null);
  // Move focus into the panel on section change so keyboard/SR users land in
  // the freshly-revealed content rather than being stranded on the rail.
  const firstPanelPaint = useRef(true);
  useEffect(() => {
    if (firstPanelPaint.current) { firstPanelPaint.current = false; return; }
    panelRef.current?.focus?.();
  }, [section]);

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

  // Accessible name for the content panel, tracking the active section so the
  // <section> landmark announces which settings group is shown.
  const PANEL_LABELS = {
    profile: 'Profile',
    security: 'Security',
    subscription: 'Subscription',
    support: 'Customer Support',
    data: 'Data and privacy',
    preferences: 'Preferences',
  };

  // The active section's panel. Each section renders verbatim with its exact
  // prior props — the reorg only chooses which one is mounted, never re-threads
  // a wire (the highest-risk failure of a settings reorg).
  const panel = (
    <>
      {section === 'profile' && (
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
      )}

      {/* Security groups the sign-in/security panel with the account-recovery
          questions, rendered stacked (recovery below sign-in/security, matching
          the prior order) so both "sign-in methods / account recovery" controls
          live under one nav item. */}
      {section === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: space['space-7'] }}>
          <AccountSecuritySection auth={auth} onSignOut={authSignOut} />
          <AccountRecoveryQuestionsSection />
        </div>
      )}

      {/* Subscription & Credits (Billing) — the one feature/conversion surface;
          keeps its bordered card. */}
      {section === 'subscription' && (
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
      )}

      {/* Customer Support (FAQ-first, then tickets). */}
      {section === 'support' && <AccountSupportSection auth={auth} />}

      {/* Data & Privacy (export, deletion, consent, visibility). */}
      {section === 'data' && (
        <AccountDataPrivacySection
          auth={auth}
          settlementCount={(savedSettlements || []).length}
          campaignCount={(campaigns || []).length}
          onDeleteAllSettlements={handleDeleteAllSettlements}
          onDeleteAllCampaigns={handleDeleteAllCampaigns}
          onSignOut={authSignOut}
          onImport={importAccountData}
          canSave={canSave}
          maxSaves={maxSaves}
        />
      )}

      {/* Product Preferences — durable defaults + email-notifications toggle. */}
      {section === 'preferences' && (
        <AccountPreferencesSection
          emailNotifications={emailNotifications}
          setEmailNotifications={handleEmailNotificationsChange}
        />
      )}
    </>
  );

  return (
    <Page max={layout.page}>
      {/* ── Page header — the page's one dominant focal point ────── */}
      <PageHeader eyebrow="Your account" title="Account" subtitle={auth.user.email} />

      {/* Left-sidebar settings layout: a 220px rail of section rows + the active
          panel. On mobile the rail reflows to a top tab strip (AccountNav
          branches internally), so the layout collapses to a single column with
          the chooser pinned above the panel. */}
      <div style={isMobile
        ? { display: 'flex', flexDirection: 'column', gap: space['space-7'] }
        : { display: 'grid', gridTemplateColumns: '220px 1fr', gap: space['space-7'], alignItems: 'start' }}
      >
        <AccountNav
          section={section}
          setSection={setSection}
          isElevated={isElevated}
          onNavigateAdmin={onNavigateAdmin}
        />
        {/* Content panel. tabIndex={-1} + aria-label make it a focusable,
            named landmark; focus moves here on section change (see effect). */}
        <section
          ref={panelRef}
          tabIndex={-1}
          aria-label={PANEL_LABELS[section] || 'Account'}
          style={{ outline: 'none', minWidth: 0 }}
        >
          {panel}
        </section>
      </div>
    </Page>
  );
}
