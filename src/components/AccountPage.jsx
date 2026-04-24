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
import React, { useState, useEffect } from 'react';
import {
  User, Shield, Crown, Zap, Save, Mail, Headphones,
  ChevronRight, TrendingDown, Edit3, Check, X, ExternalLink,
} from 'lucide-react';
import { useStore } from '../store/index.js';
import { auth as authService } from '../lib/auth.js';
import { startCheckout, PRODUCTS } from '../lib/stripe.js';
import { isConfigured, supabase } from '../lib/supabase.js';
import { GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, PARCH, sans, serif_, SP, R, FS } from './theme.js';

function Section({ title, icon: Icon, children }) {
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
        {Icon && <Icon size={16} color={GOLD} />}
        <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>
          {title}
        </span>
      </div>
      <div style={{ padding: `${SP.lg}px` }}>
        {children}
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  if (role === 'user') return null;
  const cfg = {
    developer: { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', label: 'Developer' },
    admin:     { color: '#dc2626', bg: 'rgba(220,38,38,0.12)', label: 'Admin' },
  };
  const c = cfg[role] || cfg.admin;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '3px 10px', borderRadius: R.md,
      background: c.bg, color: c.color,
      fontSize: FS.xs, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      <Shield size={11} /> {c.label}
    </span>
  );
}

export default function AccountPage({ onNavigateAdmin }) {
  const auth = useStore(s => s.auth);
  const creditBalance = useStore(s => s.creditBalance);
  const isElevated = useStore(s => s.isElevated());
  const isDeveloper = useStore(s => s.isDeveloper());
  const savedSettlements = useStore(s => s.savedSettlements);
  const maxSaves = useStore(s => s.maxSaves());
  const authSignOut = useStore(s => s.authSignOut);

  // Display name editing
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(auth.displayName || '');
  const [nameSaving, setNameSaving] = useState(false);

  // Support form
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSending, setSupportSending] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [supportError, setSupportError] = useState(null);

  // Purchase state
  const [purchasing, setPurchasing] = useState(null);
  const [purchaseError, setPurchaseError] = useState(null);

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setNameSaving(true);
    try {
      await authService.updateDisplayName(nameInput.trim());
      setEditingName(false);
      // Force refresh auth state
      const result = await authService.getSession();
      if (result) {
        useStore.getState().setAuth(result.user, result.session, result.tier, result.role, nameInput.trim());
      }
    } catch (e) {
      console.error('Failed to update name:', e);
    } finally {
      setNameSaving(false);
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
      <Section title="Profile" icon={User}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: SP.lg }}>
          {/* Avatar */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 22, fontFamily: serif_,
          }}>
            {(auth.displayName || auth.user.email || '?')[0].toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            {/* Display name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.xs }}>
              {editingName ? (
                <>
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    style={{
                      flex: 1, padding: `${SP.xs}px ${SP.sm}px`,
                      border: `1px solid ${GOLD}`, borderRadius: R.sm,
                      fontSize: FS.lg, fontFamily: serif_, fontWeight: 600,
                      outline: 'none',
                    }}
                    autoFocus
                  />
                  <button onClick={handleSaveName} disabled={nameSaving}
                    style={{ background: 'none', border: 'none', color: '#2a7a2a', cursor: 'pointer' }}>
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingName(false)}
                    style={{ background: 'none', border: 'none', color: '#8b1a1a', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: FS.xl, fontWeight: 700, color: INK, fontFamily: serif_ }}>
                    {auth.displayName || 'Set Display Name'}
                  </span>
                  <button onClick={() => { setNameInput(auth.displayName || ''); setEditingName(true); }}
                    style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer' }}>
                    <Edit3 size={14} />
                  </button>
                </>
              )}
            </div>
            <div style={{ fontSize: FS.sm, color: MUTED }}>{auth.user.email}</div>
            <div style={{ marginTop: SP.sm }}>
              <RoleBadge role={auth.role} />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Subscription & Credits ──────────────────────────────── */}
      <Section title="Subscription & Credits" icon={Crown}>
        <div style={{ display: 'flex', gap: SP.lg, flexWrap: 'wrap' }}>
          {/* Tier card */}
          <div style={{
            flex: '1 1 180px', padding: SP.lg,
            background: GOLD_BG, borderRadius: R.lg,
            border: `1px solid rgba(160,118,42,0.2)`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>
              Current Tier
            </div>
            <div style={{
              fontSize: FS.xxl, fontWeight: 700, fontFamily: serif_,
              color: isElevated ? '#7c3aed' : auth.tier === 'premium' ? '#2a7a2a' : GOLD,
              textTransform: 'uppercase',
            }}>
              {isElevated ? 'Full Access' : auth.tier}
            </div>
          </div>

          {/* Credits card */}
          <div style={{
            flex: '1 1 180px', padding: SP.lg,
            background: 'rgba(124,58,237,0.06)', borderRadius: R.lg,
            border: '1px solid rgba(124,58,237,0.15)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>
              AI Credits
            </div>
            <div style={{ fontSize: FS.xxl, fontWeight: 700, color: '#7c3aed' }}>
              {isElevated ? '\u221E' : creditBalance}
            </div>
          </div>

          {/* Saves card */}
          <div style={{
            flex: '1 1 180px', padding: SP.lg,
            background: 'rgba(42,122,42,0.06)', borderRadius: R.lg,
            border: '1px solid rgba(42,122,42,0.15)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs }}>
              Saved Settlements
            </div>
            <div style={{ fontSize: FS.xxl, fontWeight: 700, color: '#2a7a2a' }}>
              {savedSettlements.length} / {maxSaves === Infinity ? '\u221E' : maxSaves}
            </div>
          </div>
        </div>

        {/* Purchase credits (inline) */}
        {!isElevated && (
          <div style={{ marginTop: SP.lg }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.md,
              fontSize: FS.xs, fontWeight: 700, color: SECOND,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              <TrendingDown size={14} /> Purchase Credits &mdash; Volume Discounts
            </div>

            {purchaseError && (
              <div style={{
                padding: `${SP.sm}px ${SP.md}px`, marginBottom: SP.md,
                background: '#fdf4f4', border: '1px solid #e8b0b0', borderRadius: R.md,
                fontSize: FS.sm, color: '#8b1a1a',
              }}>
                {purchaseError}
              </div>
            )}

            <div style={{ display: 'flex', gap: SP.sm }}>
              {['credits_5', 'credits_15', 'credits_40'].map(key => {
                const p = PRODUCTS[key];
                const isBest = key === 'credits_40';
                const accent = isBest ? '#2a7a2a' : key === 'credits_15' ? GOLD : SECOND;
                return (
                  <button key={key} onClick={() => handlePurchase(key)}
                    disabled={purchasing || !isConfigured}
                    style={{
                      flex: 1, padding: `${SP.md}px ${SP.sm}px`,
                      background: CARD, border: `2px solid ${accent}20`,
                      borderRadius: R.lg, cursor: 'pointer', fontFamily: sans,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs,
                      opacity: purchasing ? 0.6 : 1, position: 'relative',
                    }}>
                    {p.discount && (
                      <span style={{
                        position: 'absolute', top: -8, right: -4,
                        padding: '2px 6px', borderRadius: R.sm, background: accent,
                        color: '#fff', fontSize: 9, fontWeight: 800,
                      }}>{p.discount}</span>
                    )}
                    <span style={{ fontSize: FS.lg, fontWeight: 700, color: INK }}>{p.credits}</span>
                    <span style={{ fontSize: FS.xxs, color: MUTED }}>credits</span>
                    <span style={{ fontSize: FS.md, fontWeight: 700, color: accent }}>{p.price}</span>
                    <span style={{ fontSize: FS.xxs, color: MUTED }}>{purchasing === key ? 'Redirecting...' : p.perCredit + '/ea'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Section>

      {/* ── Customer Support ────────────────────────────────────── */}
      <Section title="Customer Support" icon={Headphones}>
        {supportSent ? (
          <div style={{
            textAlign: 'center', padding: SP.lg,
            background: '#f0faf2', borderRadius: R.lg,
          }}>
            <Check size={32} color="#2a7a2a" style={{ marginBottom: SP.sm }} />
            <div style={{ fontSize: FS.md, fontWeight: 600, color: '#1a5a28' }}>
              Message sent successfully!
            </div>
            <div style={{ fontSize: FS.sm, color: '#4a8a60', marginTop: SP.xs }}>
              We'll get back to you at {auth.user.email}
            </div>
            <button onClick={() => setSupportSent(false)}
              style={{
                marginTop: SP.md, padding: `${SP.sm}px ${SP.lg}px`,
                background: GOLD, color: '#fff', border: 'none',
                borderRadius: R.md, cursor: 'pointer', fontSize: FS.sm, fontWeight: 600,
              }}>
              Send Another Message
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
            <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5 }}>
              Have a question or issue? Send us a message and we'll get back to you.
              You can also email us directly at{' '}
              <a href="mailto:clausellstokes@aol.com" style={{ color: GOLD, fontWeight: 600 }}>
                clausellstokes@aol.com
              </a>
            </div>

            {supportError && (
              <div style={{ padding: `${SP.sm}px ${SP.md}px`, background: '#fdf4f4', border: '1px solid #e8b0b0', borderRadius: R.md, fontSize: FS.sm, color: '#8b1a1a' }}>
                {supportError}
              </div>
            )}

            <input
              type="text" placeholder="Subject"
              value={supportSubject} onChange={e => setSupportSubject(e.target.value)}
              style={{
                width: '100%', padding: `${SP.sm + 2}px ${SP.md}px`,
                border: `1px solid ${BORDER}`, borderRadius: R.md,
                fontSize: FS.md, fontFamily: sans, outline: 'none', boxSizing: 'border-box',
              }}
            />
            <textarea
              placeholder="Describe your issue or question..."
              value={supportMessage} onChange={e => setSupportMessage(e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: `${SP.sm + 2}px ${SP.md}px`,
                border: `1px solid ${BORDER}`, borderRadius: R.md,
                fontSize: FS.md, fontFamily: sans, outline: 'none',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleSendSupport}
              disabled={supportSending || !supportSubject.trim() || !supportMessage.trim()}
              style={{
                padding: `${SP.md}px 0`, background: GOLD, color: '#fff',
                border: 'none', borderRadius: R.lg, cursor: 'pointer',
                fontSize: FS.md, fontWeight: 700, fontFamily: sans,
                opacity: supportSending ? 0.6 : 1,
              }}
            >
              {supportSending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        )}
      </Section>

      {/* ── Developer / Admin Panel link ────────────────────────── */}
      {isElevated && onNavigateAdmin && (
        <button
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

      {/* Sign out */}
      <button
        onClick={authSignOut}
        style={{
          padding: `${SP.md}px 0`,
          background: 'transparent', color: '#8b1a1a',
          border: '1px solid rgba(139,26,26,0.3)',
          borderRadius: R.lg, cursor: 'pointer',
          fontSize: FS.md, fontWeight: 700, fontFamily: sans,
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
