/**
 * AdminPanel.jsx — Developer admin panel for managing users,
 * credits, roles, and system configuration.
 *
 * Only accessible to users with 'developer' or 'admin' role.
 * All writes go through Supabase RPC or direct table access
 * (developer accounts have elevated RLS policies).
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Shield, Zap, Settings, Search, ChevronLeft,
  Edit3, Check, X, AlertCircle, RefreshCw, Crown, User,
} from 'lucide-react';
import { useStore } from '../store/index.js';
import { supabase, isConfigured } from '../lib/supabase.js';
import { GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, PARCH, sans, serif_, SP, R, FS } from './theme.js';

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
      const updates = {};
      if (editing === 'credits') updates.credits = parseInt(editValue, 10) || 0;
      if (editing === 'tier') updates.tier = editValue;
      if (editing === 'role') updates.role = editValue;

      // Update profiles table
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Also update user_metadata if tier or role changed
      if (editing === 'tier' || editing === 'role') {
        // This requires admin API — edge function handles it
        await supabase.functions.invoke('admin-actions', {
          body: {
            action: 'update_user_metadata',
            userId: user.id,
            metadata: { [editing]: editValue },
          },
        });
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
            <button onClick={saveEdit} disabled={saving} style={{ background: 'none', border: 'none', color: '#2a7a2a', cursor: 'pointer', padding: 0 }}>
              <Check size={12} />
            </button>
            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: '#8b1a1a', cursor: 'pointer', padding: 0 }}>
              <X size={12} />
            </button>
          </div>
        ) : (
          <button onClick={() => startEdit('role', user.role)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: FS.xxs, fontWeight: 700, color: user.role === 'developer' ? '#7c3aed' : user.role === 'admin' ? '#dc2626' : MUTED,
              textTransform: 'uppercase', padding: 0,
            }}>
            {user.role || 'user'}
          </button>
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
            <button onClick={saveEdit} disabled={saving} style={{ background: 'none', border: 'none', color: '#2a7a2a', cursor: 'pointer', padding: 0 }}>
              <Check size={12} />
            </button>
            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: '#8b1a1a', cursor: 'pointer', padding: 0 }}>
              <X size={12} />
            </button>
          </div>
        ) : (
          <button onClick={() => startEdit('tier', user.tier || 'free')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: FS.xxs, fontWeight: 600, color: user.tier === 'premium' ? '#2a7a2a' : GOLD,
              textTransform: 'uppercase', padding: 0,
            }}>
            {user.tier || 'free'}
          </button>
        )}
      </div>

      {/* Credits */}
      <div style={{ flex: 1, minWidth: 60, textAlign: 'right' }}>
        {editing === 'credits' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              style={{ width: 60, fontSize: FS.xxs, padding: '2px 4px', borderRadius: R.sm, border: `1px solid ${GOLD}`, textAlign: 'right' }}
              autoFocus />
            <button onClick={saveEdit} disabled={saving} style={{ background: 'none', border: 'none', color: '#2a7a2a', cursor: 'pointer', padding: 0 }}>
              <Check size={12} />
            </button>
            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: '#8b1a1a', cursor: 'pointer', padding: 0 }}>
              <X size={12} />
            </button>
          </div>
        ) : (
          <button onClick={() => startEdit('credits', user.credits)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: FS.sm, fontWeight: 700, color: '#7c3aed', padding: 0,
            }}>
            <Zap size={11} style={{ verticalAlign: 'middle' }} /> {user.credits ?? 0}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel({ onBack }) {
  const auth = useStore(s => s.auth);
  const isElevated = useStore(s => s.isElevated());

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [supportMessages, setSupportMessages] = useState([]);
  const [supportLoading, setSupportLoading] = useState(true);

  // Fetch users from profiles
  const fetchUsers = useCallback(async () => {
    if (!supabase) return;
    setUsersLoading(true);
    try {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100);
      if (searchQuery.trim()) {
        query = query.or(`email.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      setUsers(data || []);

      // Compute stats
      const total = data?.length || 0;
      const premiumCount = data?.filter(u => u.tier === 'premium').length || 0;
      const totalCredits = data?.reduce((sum, u) => sum + (u.credits || 0), 0) || 0;
      setStats({ total, premiumCount, totalCredits });
    } catch (e) {
      console.error('Failed to fetch users:', e);
    } finally {
      setUsersLoading(false);
    }
  }, [searchQuery]);

  // Fetch support messages
  const fetchSupport = useCallback(async () => {
    if (!supabase) return;
    setSupportLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setSupportMessages(data || []);
    } catch (e) {
      console.error('Failed to fetch support:', e);
    } finally {
      setSupportLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchSupport();
  }, [fetchUsers, fetchSupport]);

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
      maxWidth: 800, margin: '0 auto', padding: `${SP.lg}px 0`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.md }}>
        {onBack && (
          <button onClick={onBack} style={{
            display: 'flex', alignItems: 'center', gap: SP.xs,
            padding: `${SP.sm}px ${SP.md}px`,
            background: GOLD_BG, border: `1px solid rgba(160,118,42,0.3)`,
            borderRadius: R.md, cursor: 'pointer',
            color: GOLD, fontSize: FS.sm, fontWeight: 600, fontFamily: sans,
          }}>
            <ChevronLeft size={14} /> Back
          </button>
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
        <button onClick={fetchUsers} style={{
          background: 'none', border: 'none', color: MUTED, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, fontSize: FS.xxs,
        }}>
          <RefreshCw size={12} /> Refresh
        </button>
      }>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: SP.sm,
          padding: `${SP.sm}px ${SP.md}px`, marginBottom: SP.md,
          background: '#fff', border: `1px solid ${BORDER}`, borderRadius: R.md,
        }}>
          <Search size={14} color={MUTED} />
          <input
            type="text" placeholder="Search users by email or name..."
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

      {/* Support Messages */}
      <Section title="Support Messages" icon={AlertCircle} actions={
        <button onClick={fetchSupport} style={{
          background: 'none', border: 'none', color: MUTED, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, fontSize: FS.xxs,
        }}>
          <RefreshCw size={12} /> Refresh
        </button>
      }>
        {supportLoading ? (
          <div style={{ textAlign: 'center', padding: SP.xl, color: MUTED, fontSize: FS.sm }}>Loading...</div>
        ) : supportMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: SP.xl, color: MUTED, fontSize: FS.sm }}>No support messages</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, maxHeight: 400, overflowY: 'auto' }}>
            {supportMessages.map(msg => (
              <div key={msg.id} style={{
                padding: `${SP.sm + 2}px ${SP.md}px`,
                background: msg.status === 'new' ? '#fef9ee' : CARD_HDR,
                border: `1px solid ${msg.status === 'new' ? GOLD : BORDER2}`,
                borderRadius: R.md,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SP.xs }}>
                  <span style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>{msg.subject}</span>
                  <span style={{
                    fontSize: FS.xxs, fontWeight: 600,
                    padding: '1px 6px', borderRadius: R.sm,
                    background: msg.status === 'new' ? GOLD_BG : '#e0e0e0',
                    color: msg.status === 'new' ? GOLD : MUTED,
                    textTransform: 'uppercase',
                  }}>
                    {msg.status}
                  </span>
                </div>
                <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5, marginBottom: SP.xs }}>
                  {msg.message}
                </div>
                <div style={{ fontSize: FS.xxs, color: MUTED }}>
                  From: {msg.email} &middot; {new Date(msg.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
