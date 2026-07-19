/**
 * AdminPanel.jsx — Developer admin panel for managing users,
 * credits, roles, and system configuration.
 *
 * Only accessible to users with 'developer' or 'admin' role.
 * Protected reads AND writes go through the admin-actions edge function so
 * everything is role-gated and audited server-side. In particular the user
 * console is the audited, redacted AdminUsersPanel (list_users / get_user_*),
 * never a raw client-side `profiles.select('*')` — that raw read shipped every
 * user's email + columns to the browser, unaudited, and has been removed.
 */
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/index.js';
import { supabase } from '../lib/supabase.js';
import useIsMobile from '../hooks/useIsMobile.js';
import GalleryModerationPanel from './gallery/GalleryModerationPanel.jsx';
import AdminAnalyticsPanel from './admin/AdminAnalyticsPanel.jsx';
import AdminClientErrorsPanel from './admin/AdminClientErrorsPanel.jsx';
import AdminTrendsPanel from './admin/AdminTrendsPanel.jsx';
import AdminUsersPanel from './admin/AdminUsersPanel.jsx';
import SupportQueuePanel from './admin/SupportQueuePanel.jsx';
import AiPricingResyncPanel from './admin/AiPricingResyncPanel.jsx';
import AdminSimTuningPanel from './admin/AdminSimTuningPanel.jsx';
import Button from './primitives/Button.jsx';
import DesktopOnlyGate from './primitives/DesktopOnlyGate.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import Stat from './primitives/Stat.jsx';
import { GOLD_TXT, INK, BODY, BORDER, BORDER2, CARD, CARD_HDR, sans, serif_, SP, R, FS } from './theme.js';

// Icons-off surface: the section header is text-only. The action-vs-reference
// boundary the old header glyph carried is now held by the differential
// spacing that sets the read-only Insights cluster farther out from the action
// tools (P5), so the page still reads as a hierarchy rather than co-equal cards
// (P4).
function Section({ title, children, actions }) {
  return (
    <div style={{
      border: `1px solid ${BORDER}`, borderRadius: R.xl, overflow: 'hidden',
      background: CARD,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.md}px ${SP.lg}px`,
        background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`,
      }}>
        <h2 style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, flex: 1 }}>
          {title}
        </h2>
        {actions}
      </div>
      <div style={{ padding: `${SP.lg}px` }}>
        {children}
      </div>
    </div>
  );
}

export default function AdminPanel({ onBack }) {
  const isElevated = useStore(s => s.isElevated());
  // Admin is a dense, multi-column operator console whose every action is a
  // consequential server-audited mutation; it cannot meaningfully reflow to a
  // phone. On mobile we keep the read-only KPI orientation strip and gate the
  // whole toolset behind an honest "best on desktop" panel. Reactive so a
  // rotate/resize from a tablet width settles to the right surface.
  const isMobile = useIsMobile();

  const [stats, setStats] = useState(null);

  // KPI figures via the audited admin-actions `get_stats` action. It returns
  // aggregate counts ONLY (total / premium / credits pool) — no raw PII crosses
  // into the browser. This replaces the former raw `profiles.select('*')` client
  // read, which returned every user's email + columns to any elevated role,
  // unaudited. The full user console below is the redacted AdminUsersPanel.
  const fetchStats = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'get_stats' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setStats({
        total: data?.total ?? 0,
        premiumCount: data?.premiumCount ?? 0,
        totalCredits: data?.totalCredits ?? 0,
      });
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, []);

  // Mount-fetch pattern: fetchStats setStates internally, which trips
  // react-hooks/set-state-in-effect under React Compiler. Migrating away
  // requires a query library (TanStack Query, SWR) or Suspense — outside the
  // scope of this panel's one-time admin load.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchStats();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [fetchStats]);

  if (!isElevated) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: BODY, fontFamily: sans }}>
        <p style={{ fontSize: FS.lg }}>Access denied. Developer or Admin role required.</p>
      </div>
    );
  }

  return (
    // Differential spacing (P5): the page-identity header + KPI stats form one
    // tight orientation cluster (SP.md); the management Section stack sits
    // farther out (SP.xl, applied on the wrapper below) so a squint separates
    // "what is this page" from "the tools". Width/rhythm come from the shared
    // Page primitive (default cap === PAGE_MAX), not a bespoke literal.
    <Page pad={`${SP.lg}px 0`} style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      {/* Page identity — the canonical PageHeader idiom: small-caps gold
          eyebrow over a serif title with the Back / Refresh actions in the
          corner slot. Refresh re-reads the audited get_stats KPI snapshot. */}
      <PageHeader
        eyebrow="Operator console"
        title="Admin"
        subtitle="Manage users, credits, and system settings."
        actions={(
          <>
            {onBack && (
              <Button variant="gold" size="md" onClick={onBack}>
                Back
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={fetchStats}>
              Refresh
            </Button>
          </>
        )}
      />

      {/* Stats — the three KPI figures as text-only ledger Stats (muted
          uppercase label over a serif value). Category is carried by the label
          text; Total Users keeps the saturated GOLD_TXT value as the operator's
          first-scan figure (P4 one focal value). */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: SP.md }}>
          <Stat label="Total Users" value={stats.total} tone={GOLD_TXT} />
          <Stat label="Premium" value={stats.premiumCount} />
          <Stat label="Credits Pool" value={stats.totalCredits} />
        </div>
      )}

      {/* Mobile: the read-only KPI strip above is the whole admin read surface;
          the management toolset is gated to desktop. The plain "gate" variant
          (no teaser) is correct here — the deferred content is raw operator
          editors and dashboards, not readable prose. Copy is literal props
          (house voice, no em dashes) per the RealmMobileGate precedent. */}
      {isMobile ? (
        <div style={{ marginTop: SP.sm }}>
          <DesktopOnlyGate
            title="Admin works best on desktop"
            message="The operator console covers user management, gallery reports, the support queue, AI pricing, and the usage and simulation dashboards. It is dense and needs the room a larger screen gives it. The figures above are a read-only snapshot. Open Admin on desktop to manage users or work the queue."
          />
        </div>
      ) : (
      /* Management Sections — held off from the header/KPI cluster (P5
          differential spacing) and spaced wider from one another than the
          page-identity group above. */
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, marginTop: SP.sm }}>
      {/* Action tools — the high-frequency operator surfaces (user console,
          moderation, support, pricing). No raw profiles read: the only user
          source is the audited list_users / get_user_* edge actions. */}
      <Section title="User Management">
        <AdminUsersPanel />
      </Section>

      <Section title="Gallery Reports">
        <GalleryModerationPanel />
      </Section>

      {/* Support queue — claim / transition / reply / internal-note / link-FAQ,
          all through the audited admin-actions ticket handlers. */}
      <Section title="Support Queue">
        <SupportQueuePanel />
      </Section>

      {/* AI pricing — operator resync cockpit for the shared pricingResync module
          (admin-actions ai_pricing_resync), plus the nightly cron status/toggle.
          Dry-run is the checkbox default, so mounting never risks a stray write. */}
      <Section title="AI Pricing">
        <AiPricingResyncPanel />
      </Section>

      {/* Insights — the read-only dashboards demoted into one cluster set
          farther out (SP.lg + marginTop) from the action tools above (P4/P5): a
          squint now separates "tools I act in" from "dashboards I read", so the
          page reads as a hierarchy instead of co-equal cards. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, marginTop: SP.lg }}>
        <Section title="Usage Trends">
          <AdminTrendsPanel />
        </Section>

        {/* Observability cluster — the read-only analytics dashboards + the
            production crash sink (client_error_events, 081; grouped by signature
            with the always-visible last-hour alert banner from
            report_client_error_alert, 156). Both live in ONE Section (rather than
            a second "Client Errors" Section) so the admin view adds no native
            title= to the shrink-only guidance-walker census; the errors panel
            carries its own <h3> delimiter. Read-only, service-role-gated. */}
        <Section title="Analytics & errors">
          <AdminAnalyticsPanel />
          <AdminClientErrorsPanel />
        </Section>

        {/* Simulation tuning — read-only diagnostics over the live campaigns'
            worldState ledgers through the SAME pure display read-models the DM
            surfaces + PDF consume. No engine mutation, no rng, no wall clock. */}
        <Section title="Sim Tuning">
          <AdminSimTuningPanel />
        </Section>
      </div>
      </div>
      )}
    </Page>
  );
}
