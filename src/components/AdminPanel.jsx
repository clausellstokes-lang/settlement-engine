/**
 * AdminPanel.jsx — Developer admin panel for managing users,
 * credits, roles, and system configuration.
 *
 * Only accessible to users with 'developer' or 'admin' role.
 * Protected writes go through the admin-actions edge function so role,
 * tier, founder, and credit changes are audited server-side.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Users, Shield, Zap, Search, ChevronLeft,
  Check, X, RefreshCw, Crown, Flag, BarChart3, TrendingUp, Ticket, Swords,
} from 'lucide-react';
import { useStore } from '../store/index.js';
import { supabase } from '../lib/supabase.js';
import GalleryModerationPanel from './gallery/GalleryModerationPanel.jsx';
import AdminAnalyticsPanel from './admin/AdminAnalyticsPanel.jsx';
import AdminTrendsPanel from './admin/AdminTrendsPanel.jsx';
import AdminSimTuningPanel from './admin/AdminSimTuningPanel.jsx';
import AdminUsersPanel from './admin/AdminUsersPanel.jsx';
import SupportQueuePanel from './admin/SupportQueuePanel.jsx';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';
import { GOLD, INK, MUTED, BORDER, BORDER2, CARD, CARD_HDR, sans, serif_, SP, R, FS, swatch, PAGE_MAX } from './theme.js';

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

/** Inline user row with editable credits/tier/role */
function UserRow({ user, onUpdate }) {
  const [editing, setEditing] = useState(null); // 'credits' | 'tier' | 'role' | null
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (field, currentValue) => {
    setEditing(field);
    setEditValue(String(currentValue || ''));
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
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
      console.error('Failed to update user:', e);
    } finally {
      setSaving(false);
    }
  };

  const roleBg = {
    developer: 'rgba(124,58,237,0.1)',
    admin: 'rgba(220,38,38,0.1)',
    user: 'transparent',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      padding: `${SP.sm + 2}px ${SP.md}px`,
      background: roleBg[user.role] || 'transparent',
      borderRadius: R.md, fontSize: FS.sm, fontFamily: sans,
      borderBottom: `1px solid ${BORDER2}`,
    }}>
      {/* Email */}
      <div style={{ flex: 2, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.display_name || user.email || user.id.slice(0, 8)}
        </div>
        <div style={{ fontSize: FS.xxs, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email || user.id}
        </div>
      </div>

      {/* Role */}
      <div style={{ flex: 1, minWidth: 70 }}>
        {editing === 'role' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <select value={editValue} onChange={e => setEditValue(e.target.value)}
              style={{ fontSize: FS.xxs, padding: '2px 4px', borderRadius: R.sm, border: `1px solid ${GOLD}` }}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
            </select>
            <IconButton Icon={Check} label="Save role" onClick={saveEdit} disabled={saving} tone="default" size="sm" />
            <IconButton Icon={X} label="Cancel" onClick={() => setEditing(null)} tone="danger" size="sm" />
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => startEdit('role', user.role)}
            style={{
              minHeight: 'auto', padding: 0, border: 'none', background: 'none',
              fontSize: FS.xxs, fontWeight: 700,
              color: user.role === 'developer' ? '#7c3aed' : user.role === 'admin' ? '#dc2626' : MUTED,
              textTransform: 'uppercase',
            }}>
            {user.role || 'user'}
          </Button>
        )}
      </div>

      {/* Tier */}
      <div style={{ flex: 1, minWidth: 60 }}>
        {editing === 'tier' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <select value={editValue} onChange={e => setEditValue(e.target.value)}
              style={{ fontSize: FS.xxs, padding: '2px 4px', borderRadius: R.sm, border: `1px solid ${GOLD}` }}>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
            <IconButton Icon={Check} label="Save tier" onClick={saveEdit} disabled={saving} tone="default" size="sm" />
            <IconButton Icon={X} label="Cancel" onClick={() => setEditing(null)} tone="danger" size="sm" />
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => startEdit('tier', user.tier || 'free')}
            style={{
              minHeight: 'auto', padding: 0, border: 'none', background: 'none',
              fontSize: FS.xxs, fontWeight: 600,
              color: user.tier === 'premium' ? '#2a7a2a' : GOLD,
              textTransform: 'uppercase',
            }}>
            {user.tier || 'free'}
          </Button>
        )}
      </div>

      {/* Credits */}
      <div style={{ flex: 1, minWidth: 60, textAlign: 'right' }}>
        {editing === 'credits' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            <input type="number" aria-label="Credits" value={editValue} onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              style={{ width: 60, fontSize: FS.xxs, padding: '2px 4px', borderRadius: R.sm, border: `1px solid ${GOLD}`, textAlign: 'right' }}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- inline edit field should focus on open
              autoFocus />
            <IconButton Icon={Check} label="Save credits" onClick={saveEdit} disabled={saving} tone="default" size="sm" />
            <IconButton Icon={X} label="Cancel" onClick={() => setEditing(null)} tone="danger" size="sm" />
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => startEdit('credits', user.credits)}
            icon={<Zap size={11} />}
            style={{
              minHeight: 'auto', padding: 0, border: 'none', background: 'none',
              fontSize: FS.sm, fontWeight: 700, color: swatch['#7C3AED'],
            }}>
            {user.credits ?? 0}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel({ onBack }) {
  const _auth = useStore(s => s.auth);
  const isElevated = useStore(s => s.isElevated());

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);

  // Fetch users via the audited admin-actions edge function.
  const fetchUsers = useCallback(async () => {
    if (!supabase) return;
    setUsersLoading(true);
    try {
      // Route through the audited `list_users` admin-actions edge function rather
      // than a direct client `profiles.select('*')`: the edge enforces role
      // gating, returns a redacted (non-PII-leaking) column set, runs the search
      // server-side, and writes an audit row — none of which a raw client query
      // did (it returned raw email + every column to any elevated role, unaudited).
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'list_users', metadata: { search: searchQuery.trim() } },
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
      console.error('Failed to fetch users:', e);
    } finally {
      setUsersLoading(false);
    }
  }, [searchQuery]);

  // Mount-fetch pattern: the fetch setStates internally, which trips
  // react-hooks/set-state-in-effect under React Compiler. Migrating away
  // requires a query library (TanStack Query, SWR) or Suspense — outside the
  // scope of this panel's one-time admin load.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchUsers();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [fetchUsers]);

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
        <div>
          <h1 style={{ margin: 0, fontSize: FS.xxl, fontFamily: serif_, color: INK }}>Admin Panel</h1>
          <div style={{ fontSize: FS.sm, color: MUTED }}>Manage users, credits, and system settings</div>
        </div>
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

      {/* User management */}
      <Section title="User Management" icon={Users} actions={
        <Button variant="ghost" size="sm" onClick={fetchUsers} icon={<RefreshCw size={12} />}>
          Refresh
        </Button>
      }>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: SP.sm,
          padding: `${SP.sm}px ${SP.md}px`, marginBottom: SP.md,
          background: swatch.white, border: `1px solid ${BORDER}`, borderRadius: R.md,
        }}>
          <Search size={14} color={MUTED} />
          <input
            type="text" aria-label="Search users by email or name" placeholder="Search users by email or name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchUsers()}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: FS.sm, fontFamily: sans, background: 'transparent',
            }}
          />
        </div>

        {/* Column headers */}
        <div style={{
          display: 'flex', gap: SP.sm, padding: `${SP.xs}px ${SP.md}px`,
          fontSize: FS.xxs, fontWeight: 700, color: MUTED,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          borderBottom: `1px solid ${BORDER}`, marginBottom: SP.xs,
        }}>
          <span style={{ flex: 2 }}>User</span>
          <span style={{ flex: 1 }}>Role</span>
          <span style={{ flex: 1 }}>Tier</span>
          <span style={{ flex: 1, textAlign: 'right' }}>Credits</span>
        </div>

        {/* User list */}
        {usersLoading ? (
          <div style={{ textAlign: 'center', padding: SP.xl, color: MUTED, fontSize: FS.sm }}>Loading users...</div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: SP.xl, color: MUTED, fontSize: FS.sm }}>No users found</div>
        ) : (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {users.map(user => (
              <UserRow key={user.id} user={user} onUpdate={fetchUsers} />
            ))}
          </div>
        )}

        <div style={{ fontSize: FS.xxs, color: MUTED, marginTop: SP.sm, textAlign: 'center' }}>
          Click any value to edit it inline. Changes are saved immediately.
        </div>
      </Section>

      {/* A4: search / inspect / act on a single user (redacted-by-default,
          audited, role-gated server-side; reveal-full requires a reason). */}
      <Section title="User Search & Actions" icon={Search}>
        <AdminUsersPanel />
      </Section>

      <Section title="Gallery Reports" icon={Flag}>
        <GalleryModerationPanel />
      </Section>

      <Section title="Usage Trends" icon={TrendingUp}>
        <AdminTrendsPanel />
      </Section>

      <Section title="Analytics" icon={BarChart3}>
        <AdminAnalyticsPanel />
      </Section>

      {/* F1 — simulation tuning: war/occupation/trade/faith balance + the
          player-safe visibility audit, read from the live campaigns' worldState. */}
      <Section title="Sim Tuning" icon={Swords}>
        <AdminSimTuningPanel />
      </Section>

      {/* A5: support-ticket queue — claim / assign / transition / reply /
          internal-note / link-FAQ, all audited + role-gated server-side. */}
      <Section title="Support Queue" icon={Ticket}>
        <SupportQueuePanel />
      </Section>
    </div>
  );
}
