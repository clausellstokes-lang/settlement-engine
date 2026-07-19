/**
 * AccountPage.jsx — Full-page account management, organized as a left-sidebar
 * ("bracket") settings layout: a rail of sections on the left (AccountNav), the
 * active section's panel on the right. Loads to Profile first.
 *
 * Sections (rail order): Profile · Security · Subscription · Support · Data ·
 * Preferences. AccountPage stays the state owner — every profile/name/billing/
 * purchase useState + handler lives here and is passed to the same section
 * components; the rail only switches which panel is mounted. Security groups the
 * sign-in/security panel with the account-recovery questions. Preferences hosts
 * OUR per-category email opt-out (migration 126). A single normal Sign Out stays
 * at the page foot (OUR header chip has no sign-out row).
 */
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/index.js';
import { navigate } from '../hooks/useRoute.js';
import { auth as authService } from '../lib/auth.js';
import { saves as savesService } from '../lib/saves.js';
import { startCheckout, startCustomerPortal } from '../lib/stripe.js';
import { getPendingRedeemCode, clearPendingRedeemCode } from '../lib/referralRedeem.js';
import { DEFAULT_MODEL_PREFERENCE } from '../config/pricing.js';
import { activeSaveCount, inactiveRetentionCount } from '../lib/saveAccess.js';
import { MUTED, sans, FS } from './theme.js';
import { layout, space } from '../design/tokens.js';
import useIsMobile from '../hooks/useIsMobile.js';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import Button from './primitives/Button.jsx';
import AccountNav from './account/AccountNav.jsx';
import AccountProfileSection from './account/AccountProfileSection.jsx';
import AccountSecuritySection from './account/AccountSecuritySection.jsx';
import AccountRecoveryQuestionsSection from './account/AccountRecoveryQuestionsSection.jsx';
import AccountSubscriptionSection from './account/AccountSubscriptionSection.jsx';
import { ReferralCard, RedeemBlock } from './account/ReferralRedeemBlocks.jsx';
import AccountSupportSection from './account/AccountSupportSection.jsx';
import AccountDataPrivacySection from './account/AccountDataPrivacySection.jsx';
import AccountEmailPreferencesSection from './account/AccountEmailPreferencesSection.jsx';
import AccountAiKeysSection from './account/AccountAiKeysSection.jsx';

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
  // re-entry re-runs them harmlessly.
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
  const profileSourceKey = [
    auth.avatarUrl || '',
    auth.emailNotifications !== false ? 'email:on' : 'email:off',
    auth.modelPreference || DEFAULT_MODEL_PREFERENCE,
  ].join('|');
  const [profileDraft, setProfileDraft] = useState(() => ({
    sourceKey: profileSourceKey,
    avatarInput: auth.avatarUrl || '',
    emailNotifications: auth.emailNotifications !== false,
    modelPreference: auth.modelPreference || DEFAULT_MODEL_PREFERENCE,
  }));
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState(null);

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

  const handlePurchase = async (product) => {
    setPurchaseError(null);
    setPurchasing(product);
    try {
      // The Redeem block sits directly below these pack buttons, so an accepted
      // code must ride along here too, not only via Pricing. The server decides
      // whether it fits; a mismatch just proceeds at the regular price.
      await startCheckout(product, { redeemCode: getPendingRedeemCode() });
      // Consumed (reserved or declined server-side) — drop the stash so it
      // cannot resurface on a later, unrelated purchase.
      clearPendingRedeemCode();
    } catch (e) {
      setPurchaseError(e.message);
      setPurchasing(null);
    }
  };

  // Bulk content deletion (Data & Privacy). Delete each saved settlement through
  // the saves service so the server copy goes too. allSettled keeps one bad row
  // from wedging the whole wipe, but the results are INSPECTED: only rows the
  // server actually deleted leave local state. Rows whose server delete failed
  // stay visible (they'd resurrect at next sign-in anyway), and the aggregated
  // failure is thrown so the confirm UI doesn't report a clean wipe that didn't
  // happen — this is a privacy surface; false success is the worst outcome.
  const handleDeleteAllSettlements = async () => {
    const ids = (savedSettlements || []).map(s => s.id);
    const results = await Promise.allSettled(ids.map(id => savesService.delete?.(id)));
    const failedIds = ids.filter((_, i) => results[i].status === 'rejected');
    if (failedIds.length === 0) {
      if (typeof clearSavedSettlements === 'function') clearSavedSettlements();
      else ids.forEach(id => removeSavedSettlement?.(id));
      return;
    }
    const failed = new Set(failedIds);
    ids.filter(id => !failed.has(id)).forEach(id => removeSavedSettlement?.(id));
    throw new Error(
      `${failedIds.length} of ${ids.length} settlements could not be deleted from the server. `
      + 'They remain in your library. Try again.'
    );
  };

  // Campaign wipe reuses OUR canonical deleteCampaign action (the same seam the
  // per-campaign delete uses): it removes the campaign locally and fires the
  // cloud delete + tombstone via deletePersistedCampaignState. deleteCampaign is
  // synchronous/fire-and-forget for the cloud leg, so — unlike settlements — a
  // failed cloud delete is not surfaced here (it matches OUR single-campaign
  // delete behavior).
  const handleDeleteAllCampaigns = async () => {
    const ids = (campaigns || []).map(c => c.id);
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
    ai: 'AI provider and keys',
  };

  // The active section's panel. Each OUR section renders with its exact prior
  // props — the reorg only chooses which one is mounted, never re-threads a wire.
  const panel = (
    <>
      {section === 'profile' && (
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
      )}

      {/* Security groups the sign-in/security panel with the account-recovery
          questions (recovery below sign-in/security). */}
      {section === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: space['space-7'] }}>
          <AccountSecuritySection auth={auth} onSignOut={authSignOut} />
          <AccountRecoveryQuestionsSection />
        </div>
      )}

      {/* Subscription & Credits (Billing) + the referral card and redeem block. */}
      {section === 'subscription' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: space['space-7'] }}>
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
          <div>
            <ReferralCard auth={auth} />
            <RedeemBlock onNavigatePricing={() => navigate('pricing')} />
          </div>
        </div>
      )}

      {/* Customer Support (FAQ-first, then tickets). */}
      {section === 'support' && <AccountSupportSection auth={auth} />}

      {/* Data & Privacy (import, export, bulk delete, deletion request, consent). */}
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

      {/* Preferences — OUR per-category email opt-out (migration 126). */}
      {section === 'preferences' && <AccountEmailPreferencesSection />}

      {/* AI provider & keys — the BYOK MANAGEMENT SURFACE (#29): provider/key/verify,
          per-task model choice, key-health, usage caps + pause, and the lazy meter. */}
      {section === 'ai' && <AccountAiKeysSection />}
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
        {/* Content panel. tabIndex={-1} + aria-label make it a focusable, named
            landmark; focus moves here on section change (see effect). */}
        <section
          ref={panelRef}
          tabIndex={-1}
          aria-label={PANEL_LABELS[section] || 'Account'}
          style={{ outline: 'none', minWidth: 0 }}
        >
          {panel}
        </section>
      </div>

      {/* Normal single-device sign-out. THEIRS relies on a header chip sign-out
          row; OURS chip has none, so the page keeps a reachable Sign Out.
          "Sign out everywhere" (global) lives in the Security panel. */}
      <div style={{ marginTop: space['space-7'] }}>
        <Button variant="danger" size="lg" fullWidth onClick={authSignOut}>
          Sign Out
        </Button>
      </div>
    </Page>
  );
}
