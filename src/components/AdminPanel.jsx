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
import {
  Users, Shield, Zap, ChevronLeft, RefreshCw, Crown, Flag,
  BarChart3, TrendingUp, AlertCircle,
} from 'lucide-react';
import { useStore } from '../store/index.js';
import { supabase } from '../lib/supabase.js';
import GalleryModerationPanel from './gallery/GalleryModerationPanel.jsx';
import AdminAnalyticsPanel from './admin/AdminAnalyticsPanel.jsx';
import AdminTrendsPanel from './admin/AdminTrendsPanel.jsx';
import AdminUsersPanel from './admin/AdminUsersPanel.jsx';
import SupportQueuePanel from './admin/SupportQueuePanel.jsx';
import AiPricingResyncPanel from './admin/AiPricingResyncPanel.jsx';
import AdminSimTuningPanel from './admin/AdminSimTuningPanel.jsx';
import Button from './primitives/Button.jsx';
import { GOLD, INK, MUTED, BORDER, BORDER2, CARD, CARD_HDR, sans, serif_, SP, R, FS, PAGE_MAX } from './theme.js';

function Section({ title, icon: Icon, children, actions }) {
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
        {Icon && <Icon size={16} color="#7c3aed" />}
        <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, flex: 1 }}>
          {title}
        </span>
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
      <div style={{ textAlign: 'center', padding: '60px 20px', color: MUTED, fontFamily: sans }}>
        <Shield size={48} color={BORDER} style={{ marginBottom: SP.lg }} />
        <p style={{ fontSize: FS.lg }}>Access denied. Developer or Admin role required.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: SP.lg,
      maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SP.lg}px 0`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.md }}>
        {onBack && (
          <Button variant="gold" size="md" onClick={onBack} icon={<ChevronLeft size={14} />}>
            Back
          </Button>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: FS.xxl, fontFamily: serif_, color: INK }}>Admin Panel</h1>
          <div style={{ fontSize: FS.sm, color: MUTED }}>Manage users, credits, and system settings</div>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchStats} icon={<RefreshCw size={12} />}>
          Refresh
        </Button>
      </div>

      {/* Stats cards */}
      {stats && (
        <div style={{ display: 'flex', gap: SP.md }}>
          {[
            { label: 'Total Users', value: stats.total, icon: Users, color: GOLD },
            { label: 'Premium', value: stats.premiumCount, icon: Crown, color: '#2a7a2a' },
            { label: 'Credits Pool', value: stats.totalCredits, icon: Zap, color: '#7c3aed' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{
              flex: 1, padding: SP.lg, background: CARD,
              border: `1px solid ${BORDER}`, borderRadius: R.lg,
              textAlign: 'center',
            }}>
              <Icon size={18} color={color} style={{ marginBottom: SP.xs }} />
              <div style={{ fontSize: FS.xxl, fontWeight: 700, color, fontFamily: sans }}>{value}</div>
              <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* User management — audited, redacted search / inspect / act console.
          No raw profiles read: the only user source is the audited list_users /
          get_user_* edge actions. Reveal-full requires a reason and is audited. */}
      <Section title="User Management" icon={Users}>
        <AdminUsersPanel />
      </Section>

      <Section title="Gallery Reports" icon={Flag}>
        <GalleryModerationPanel />
      </Section>

      {/* Support queue — claim / transition / reply / internal-note / link-FAQ,
          all through the audited admin-actions ticket handlers (list_ticket_pool
          / list_ticket_thread / claim_ticket / set_ticket_status /
          post_ticket_reply / link_ticket_faq). Replaces the former read-only
          support_messages client list. */}
      <Section title="Support Queue" icon={AlertCircle}>
        <SupportQueuePanel />
      </Section>

      {/* AI pricing — operator resync cockpit for the shared pricingResync module
          (admin-actions ai_pricing_resync), plus the nightly cron status/toggle.
          Dry-run is the checkbox default, so mounting never risks a stray write. */}
      <Section title="AI Pricing" icon={RefreshCw}>
        <AiPricingResyncPanel />
      </Section>

      <Section title="Usage Trends" icon={TrendingUp}>
        <AdminTrendsPanel />
      </Section>

      <Section title="Analytics" icon={BarChart3}>
        <AdminAnalyticsPanel />
      </Section>

      {/* Simulation tuning — read-only diagnostics over the live campaigns'
          worldState ledgers through the SAME pure display read-models the DM
          surfaces + PDF consume: war activity, deployed-army attrition, latent
          host strength, occupations, pantheon standings, coarse balance
          warnings, dormant-subsystem verification, and the player-safe
          visibility audit (proves no covert/GM state leaks to a player view).
          No engine mutation, no rng, no wall clock. */}
      <Section title="Simulation Tuning" icon={Zap}>
        <AdminSimTuningPanel />
      </Section>
    </div>
  );
}
