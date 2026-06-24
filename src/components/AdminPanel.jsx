/**
 * AdminPanel.jsx — Developer admin panel for managing users,
 * credits, roles, and system configuration.
 *
 * Only accessible to users with 'developer' or 'admin' role.
 * Protected writes go through the admin-actions edge function so role,
 * tier, founder, and credit changes are audited server-side.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store/index.js';
import { supabase } from '../lib/supabase.js';
import useIsMobile from '../hooks/useIsMobile.js';
import GalleryModerationPanel from './gallery/GalleryModerationPanel.jsx';
import AdminAnalyticsPanel from './admin/AdminAnalyticsPanel.jsx';
import AdminTrendsPanel from './admin/AdminTrendsPanel.jsx';
import AdminSimTuningPanel from './admin/AdminSimTuningPanel.jsx';
import AdminUsersPanel from './admin/AdminUsersPanel.jsx';
import SupportQueuePanel from './admin/SupportQueuePanel.jsx';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';
import DesktopOnlyGate from './primitives/DesktopOnlyGate.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import Stat from './primitives/Stat.jsx';
import { GOLD_TXT, INK, BODY, MUTED, BORDER, BORDER2, BORDER_STRONG, CARD, CARD_HDR, sans, serif_, SP, R, FS, swatch, VIOLET_DEEP, RED, GREEN, VIOLET_BG, RED_BG } from './theme.js';

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

/** Inline user row with editable credits/tier/role */
function UserRow({ user, onUpdate }) {
  const [editing, setEditing] = useState(null); // 'credits' | 'tier' | 'role' | null
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const startEdit = (field, currentValue) => {
    setEditing(field);
    setEditValue(String(currentValue || ''));
    setSaveError(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setSaveError(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    setSaveError(null);
    try {
      const body = editing === 'credits'
        ? {
            action: 'update_user_credits',
            userId: user.id,
            credits: parseInt(editValue, 10) || 0,
          }
        : {
            action: 'update_user_metadata',
            userId: user.id,
            metadata: { [editing]: editValue },
          };

      const { data, error } = await supabase.functions.invoke('admin-actions', { body });
      if (error) throw error;
      if (data?.error) {
        throw new Error(data.error);
      }

      onUpdate();
      setEditing(null);
    } catch (e) {
      // P10/P2: surface the failure inline and KEEP edit mode open so the
      // value can be retried — never close-as-if-saved on a silent throw.
      console.error('Failed to update user:', e);
      setSaveError(e?.message || 'Save failed. Try again.');
    } finally {
      setSaving(false);
    }
  };

  // Role-row tint routed through the semantic surface tokens (P11): the raw
  // violet/red rgba literals are the same hues the VIOLET_BG / RED_BG tokens
  // already own, so the row tint now shares one source of truth with the
  // RoleBadge it sits beside.
  const roleBg = {
    developer: VIOLET_BG,
    admin: RED_BG,
    user: 'transparent',
  };

  // Shared style for the inline-edit trigger buttons: a 44px hit area meeting
  // the usability target (these triggers commit consequential, server-audited
  // role/tier/credit mutations, so a mis-tap is high-stakes; Fitts / WCAG
  // 2.5.8) without padding that would shift the text.
  const editTriggerStyle = {
    minHeight: 44, padding: '2px 0', border: 'none', background: 'none',
    display: 'inline-flex', alignItems: 'center',
  };

  return (
    // Ledger row, not a card (P5): a single hairline divider carries the
    // grouping — no rounded corners + flush divider box-soup.
    <div role="row" style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      padding: `${SP.sm + 2}px ${SP.md}px`,
      background: roleBg[user.role] || 'transparent',
      fontSize: FS.sm, fontFamily: sans,
      borderBottom: `1px solid ${BORDER2}`,
    }}>
      {/* Identity (row focal point) */}
      <div role="cell" style={{ flex: 2, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.display_name || user.email || user.id.slice(0, 8)}
        </div>
        <div style={{ fontSize: FS.xxs, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email || user.id}
        </div>
        {saveError && (
          <div role="alert" style={{ fontSize: FS.xs, color: RED, marginTop: 2 }}>
            {saveError}
          </div>
        )}
      </div>

      {/* Role */}
      <div role="cell" style={{ flex: 1, minWidth: 70 }}>
        {editing === 'role' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <select aria-label="Role" value={editValue} onChange={e => setEditValue(e.target.value)}
              style={{ fontSize: FS.xs, padding: '4px 4px', borderRadius: R.sm, border: `1px solid ${BORDER_STRONG}` }}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
            </select>
            <IconButton glyph="✓" label="Save role" onClick={saveEdit} disabled={saving} tone="default" size="xl" />
            <IconButton glyph="×" label="Cancel" onClick={cancelEdit} tone="ghost" size="xl" />
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => startEdit('role', user.role)}
            title="Access level. Developer sees this panel and all tooling. Admin moderates and edits users. User has none of these powers."
            style={{
              ...editTriggerStyle,
              fontSize: FS.xs, fontWeight: 700,
              color: user.role === 'developer' ? VIOLET_DEEP : user.role === 'admin' ? RED : MUTED,
              textTransform: 'uppercase',
            }}>
            {user.role || 'user'}
          </Button>
        )}
      </div>

      {/* Tier */}
      <div role="cell" style={{ flex: 1, minWidth: 60 }}>
        {editing === 'tier' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <select aria-label="Tier" value={editValue} onChange={e => setEditValue(e.target.value)}
              style={{ fontSize: FS.xs, padding: '4px 4px', borderRadius: R.sm, border: `1px solid ${BORDER_STRONG}` }}>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
            <IconButton glyph="✓" label="Save tier" onClick={saveEdit} disabled={saving} tone="default" size="xl" />
            <IconButton glyph="×" label="Cancel" onClick={cancelEdit} tone="ghost" size="xl" />
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => startEdit('tier', user.tier || 'free')}
            title="Billing plan. Premium reaches metropolis size and the larger feature set. Free is the starter plan."
            style={{
              ...editTriggerStyle,
              fontSize: FS.xs, fontWeight: 600,
              color: user.tier === 'premium' ? GREEN : GOLD_TXT,
              textTransform: 'uppercase',
            }}>
            {user.tier || 'free'}
          </Button>
        )}
      </div>

      {/* Credits */}
      <div role="cell" style={{ flex: 1, minWidth: 60, textAlign: 'right' }}>
        {editing === 'credits' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            <input type="number" aria-label="Credits" value={editValue} onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              style={{ width: 60, fontSize: FS.xs, padding: '4px 4px', borderRadius: R.sm, border: `1px solid ${BORDER_STRONG}`, textAlign: 'right' }}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- inline edit field should focus on open
              autoFocus />
            <IconButton glyph="✓" label="Save credits" onClick={saveEdit} disabled={saving} tone="default" size="xl" />
            <IconButton glyph="×" label="Cancel" onClick={cancelEdit} tone="ghost" size="xl" />
          </div>
        ) : (
          // De-emphasized vs the identity column (P4): credits is an editable
          // attribute, not the row's hero — quieter than the name, and routed
          // to the AA violet token rather than violet-as-text.
          <Button variant="ghost" size="sm" onClick={() => startEdit('credits', user.credits)}
            title="Generation credits remaining. Each run spends one. Zero means this user cannot generate until granted more."
            style={{
              ...editTriggerStyle, justifyContent: 'flex-end',
              fontSize: FS.xs, fontWeight: 600, color: VIOLET_DEEP,
            }}>
            {user.credits ?? 0}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel({ onBack }) {
  const isElevated = useStore(s => s.isElevated());
  // Admin is desktop-only per the read-mostly matrix: a dense, multi-column
  // operator console (inline-edit ledger, 23-metric chart toggles, wide data
  // tables) that cannot meaningfully reflow to a 375px viewport, and whose
  // every action is a consequential server-audited mutation. On mobile we keep
  // the read-only 3-KPI orientation strip and gate the whole toolset behind an
  // honest "best on desktop" panel rather than reflow seven panels. Reactive so
  // a rotate/resize from a tablet width settles to the right surface.
  const isMobile = useIsMobile();

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  // `searchQuery` is the live, per-keystroke input value (controlled). The
  // search REQUEST is keyed off `debouncedQuery`, which lags behind by
  // SEARCH_DEBOUNCE_MS — so the audited list_users edge call (one edge
  // invocation + one audit-log row) fires once the user pauses, not on every
  // character. Manual triggers (Enter, Refresh) flush immediately by syncing
  // debouncedQuery to the live value, bypassing the timer.
  const SEARCH_DEBOUNCE_MS = 350;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [stats, setStats] = useState(null);

  // Fetch users via the audited admin-actions edge function. The search term is
  // passed explicitly (defaulting to the debounced value) so manual triggers can
  // fetch the live query without waiting for the debounce window.
  const fetchUsers = useCallback(async (searchTerm = debouncedQuery) => {
    if (!supabase) return;
    setUsersLoading(true);
    setUsersError(null);
    try {
      // Route through the audited `list_users` admin-actions edge function rather
      // than a direct client `profiles.select('*')`: the edge enforces role
      // gating, returns a redacted (non-PII-leaking) column set, runs the search
      // server-side, and writes an audit row — none of which a raw client query
      // did (it returned raw email + every column to any elevated role, unaudited).
      // Debouncing the trigger (below) keeps that audited path intact while
      // collapsing a burst of keystrokes into a single invocation + audit row.
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'list_users', metadata: { search: String(searchTerm || '').trim() } },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const list = Array.isArray(data?.users) ? data.users : [];
      setUsers(list);

      // Compute stats
      const total = list.length;
      const premiumCount = list.filter(u => u.tier === 'premium').length;
      const totalCredits = list.reduce((sum, u) => sum + (u.credits || 0), 0);
      setStats({ total, premiumCount, totalCredits });
    } catch (e) {
      // P10: a failed load must read as an error with a path forward, not get
      // mislabelled as an empty result ('No users found').
      console.error('Failed to fetch users:', e);
      setUsersError(e?.message || 'Failed to load users.');
    } finally {
      setUsersLoading(false);
    }
  }, [debouncedQuery]);

  // Debounce layer: when the user types, schedule a single sync of the live
  // `searchQuery` into `debouncedQuery` after a quiet period. Each keystroke
  // clears the prior timer, so only the final pause commits — one edge call,
  // one audit row. Skipped on the mount-equal pass (both empty) and re-skips
  // when a manual flush already advanced debouncedQuery to match.
  const searchTimerRef = useRef(null);
  useEffect(() => {
    if (searchQuery === debouncedQuery) return undefined;
    // The setState is deferred inside setTimeout (not a synchronous effect
    // body setState), so it doesn't trip react-hooks/set-state-in-effect.
    searchTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(searchTimerRef.current);
    // debouncedQuery is intentionally excluded: including it would reset the
    // timer the instant the debounced value catches up, never settling. The
    // guard above reads the latest value on each keystroke-driven run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Mount-fetch + debounced-search fetch. Fires on mount (debouncedQuery '') and
  // whenever the debounced search term settles. The fetch setStates internally,
  // which trips react-hooks/set-state-in-effect under React Compiler. Migrating
  // away requires a query library (TanStack Query, SWR) or Suspense — outside
  // the scope of this panel's admin load.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchUsers();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [fetchUsers]);

  // Manual flush for Enter / Refresh: cancel any pending debounce and fetch the
  // live query immediately, exactly once. Two cases:
  //   • the live query differs from the debounced value → advance debouncedQuery;
  //     that re-keys fetchUsers and the fetch effect runs the search for us. We
  //     must NOT also call fetchUsers here or it would double-fire.
  //   • the live query already equals the debounced value (e.g. Refresh with an
  //     unchanged box) → the effect won't re-run, so fetch directly.
  const flushSearch = useCallback(() => {
    clearTimeout(searchTimerRef.current);
    if (searchQuery !== debouncedQuery) setDebouncedQuery(searchQuery);
    else fetchUsers(searchQuery);
  }, [searchQuery, debouncedQuery, fetchUsers]);

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
          eyebrow over a serif title with the Back action in the corner slot. */}
      <PageHeader
        eyebrow="Operator console"
        title="Admin"
        subtitle="Manage users, credits, and system settings."
        actions={onBack && (
          <Button variant="gold" size="md" onClick={onBack}>
            Back
          </Button>
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
          editors and dashboards, not readable prose. */}
      {isMobile ? (
        <div style={{ marginTop: SP.sm }}>
          <DesktopOnlyGate
            title="Admin works best on desktop"
            message="The operator console covers user management, gallery reports, the support queue, and the usage dashboards. It is dense and needs the room a larger screen gives it. The figures above are a read-only snapshot. Open Admin on desktop to manage users or work the queue."
          />
        </div>
      ) : (
      /* Management Sections — held off from the header/KPI cluster (P5
          differential spacing) and spaced wider from one another than the
          page-identity group above. */
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl, marginTop: SP.sm }}>
      {/* User management */}
      <Section title="User Management" actions={
        <Button variant="ghost" size="sm" onClick={flushSearch}>
          Refresh
        </Button>
      }>
        {/* Search — flattened tinted input row (no border-in-border with the
            Section frame, P5), paired with a visible submit so the search
            action isn't a hidden Enter-only affordance (P8/P9). */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: SP.sm, marginBottom: SP.md }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: SP.sm,
            padding: `${SP.sm}px ${SP.md}px`,
            background: swatch.white, borderRadius: R.md,
          }}>
            <input
              type="text" aria-label="Search users by email or name" placeholder="Search users by email or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && flushSearch()}
              style={{
                flex: 1, border: 'none',
                fontSize: FS.sm, fontFamily: sans, background: 'transparent',
              }}
            />
          </div>
          <Button variant="secondary" size="sm" onClick={flushSearch}>
            Search
          </Button>
        </div>

        {/* Affordance instruction front-loaded above the rows it governs
            (P1/P6): the eye meets "you can edit these" before the editable
            values, not in a trailing footer slot. BODY (ink-600), not MUTED —
            this is instructional content, and MUTED (chrome-only) fails AA 4.5:1
            as body copy on the light surface. */}
        <div style={{ fontSize: FS.xs, color: BODY, marginBottom: SP.sm }}>
          Click any value to edit it inline. Changes are saved immediately.
        </div>

        {/* User table — a flex-div grid given table semantics so a screen
            reader announces it as a table with column headers and cells. */}
        <div role="table" aria-label="User management table">
        {/* Column headers */}
        <div role="row" style={{
          display: 'flex', gap: SP.sm, padding: `${SP.xs}px ${SP.md}px`,
          fontSize: FS.xs, fontWeight: 700, color: MUTED,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          borderBottom: `1px solid ${BORDER}`, marginBottom: SP.xs,
        }}>
          <span role="columnheader" style={{ flex: 2 }}>User</span>
          <span role="columnheader" style={{ flex: 1 }}>Role</span>
          <span role="columnheader" style={{ flex: 1 }}>Tier</span>
          <span role="columnheader" style={{ flex: 1, textAlign: 'right' }}>Credits</span>
        </div>

        {/* User list */}
        {usersLoading ? (
          <div style={{ textAlign: 'center', padding: SP.xl, color: MUTED, fontSize: FS.sm }}>Loading users...</div>
        ) : usersError ? (
          <div style={{ textAlign: 'center', padding: SP.xl, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.sm }}>
            <p role="alert" style={{ margin: 0, color: RED, fontSize: FS.sm }}>{usersError}</p>
            <Button variant="secondary" size="sm" onClick={flushSearch}>
              Retry
            </Button>
          </div>
        ) : users.length === 0 ? (
          // Instructional empty-state copy → BODY (AA 4.5:1), not MUTED chrome.
          <div style={{ textAlign: 'center', padding: SP.xl, color: BODY, fontSize: FS.sm }}>No users found</div>
        ) : (
          <div role="rowgroup" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {users.map(user => (
              <UserRow key={user.id} user={user} onUpdate={fetchUsers} />
            ))}
          </div>
        )}
        </div>
      </Section>

      {/* A4: search / inspect / act on a single user (redacted-by-default,
          audited, role-gated server-side; reveal-full requires a reason). */}
      <Section title="User Search and Actions">
        <AdminUsersPanel />
      </Section>

      <Section title="Gallery Reports">
        <GalleryModerationPanel />
      </Section>

      {/* A5: support-ticket queue — claim / assign / transition / reply /
          internal-note / link-FAQ, all audited + role-gated server-side. The
          second high-frequency action surface, so it sits with the action tools
          above the read-only Insights cluster (P4 3-tier hierarchy). */}
      <Section title="Support Queue">
        <SupportQueuePanel />
      </Section>

      {/* Insights — the read-only dashboards demoted into one cluster set
          farther out (SP.xxl) from the action tools above, with muted header
          glyphs (P4/P5): a squint now separates "tools I act in" from
          "dashboards I read", so the page reads as a hierarchy instead of seven
          co-equal cards. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, marginTop: SP.lg }}>
        <Section title="Usage Trends">
          <AdminTrendsPanel />
        </Section>

        <Section title="Analytics">
          <AdminAnalyticsPanel />
        </Section>

        {/* F1 — simulation tuning: war/occupation/trade/faith balance and the
            player-safe visibility audit, read from the live campaigns' worldState. */}
        <Section title="Sim Tuning">
          <AdminSimTuningPanel />
        </Section>
      </div>
      </div>
      )}
    </Page>
  );
}
