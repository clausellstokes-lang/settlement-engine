/**
 * HomeHero.jsx — Anonymous-first landing hero with one-shot generator.
 *
 * The funnel's gateway. A first-time anonymous visitor lands on this:
 *   1. Reads the eyebrow / title / subtitle (parchment serif).
 *   2. Picks a settlement size (Hamlet / Village / Town — the three
 *      sizes anonymous accounts can generate, per TIER_GATE.anon).
 *   3. Clicks Begin. We seed the store config with the chosen tier,
 *      bump the anon counter, and call the same generate() the wizard
 *      uses. The dossier renders below; the hero hides on its own
 *      because the parent only mounts it when !settlement.
 *
 * Soft cap:
 *   The hero respects `anonGenCounter.getAnonGenCount()`. After
 *   DEFAULT_DAILY_CAP free generations, the Begin button locks and a
 *   gentle "sign in to keep going" affordance replaces it. The cap is
 *   localStorage-based — not security, just polite friction so the
 *   homepage doesn't become a free dossier-mining tool.
 *
 * Flag:
 *   `homepageAnonGen` (default on). When off, the hero never mounts
 *   and the existing wizard mode-picker is the first thing anonymous
 *   visitors see — the legacy flow.
 */

import React, { useState } from 'react';
import { Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import {
  anonAtCap, anonGensRemaining, incrementAnonGen, DEFAULT_DAILY_CAP,
} from '../lib/anonGenCounter.js';
import {
  GOLD, INK, INK_DEEP, BORDER, CARD, sans, serif_, SP, R, FS,
} from './theme.js';

// Sizes a Wanderer (anonymous) account can generate, in display order.
// Sourced from the spec ceiling — anon's TIER_GATE max is 'town'.
const ANON_SIZES = ['hamlet', 'village', 'town'];

function SizeButton({ value, label, hint, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      aria-pressed={active}
      style={{
        flex: '1 1 0', minWidth: 120,
        padding: `${SP.md}px ${SP.md}px`,
        textAlign: 'left',
        background: active ? 'rgba(201,162,76,0.10)' : '#fff',
        border: `1.5px solid ${active ? GOLD : BORDER}`,
        borderRadius: R.lg,
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        fontFamily: sans,
      }}
    >
      <div style={{
        fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK,
        marginBottom: 2,
      }}>
        {label}
      </div>
      <div style={{ fontSize: FS.xs, color: '#4A3B22', lineHeight: 1.4 }}>
        {hint}
      </div>
    </button>
  );
}

export default function HomeHero({ onSignIn }) {
  const generate = useStore(s => s.generateSettlement);
  const updateConfig = useStore(s => s.updateConfig);
  const setWizardMode = useStore(s => s.setWizardMode);

  const [pickedSize, setPickedSize] = useState('village');
  const [generating, setGenerating] = useState(false);
  const atCap = anonAtCap();
  const remaining = anonGensRemaining();

  const handleBegin = async () => {
    if (atCap || generating) return;
    setGenerating(true);
    try {
      // Anchor the wizard to a mode so subsequent navigation makes sense.
      // 'quick' matches the "one-click" feel of the hero CTA.
      setWizardMode('quick');
      // Seed the size choice. Other config defaults (terrain, culture,
      // trade access) stay random — that's what makes the hero a true
      // one-shot rather than a hidden wizard.
      updateConfig({ settType: pickedSize });
      // The generator runs synchronously in the worker; the store
      // commits the new settlement before this resolves.
      generate();
      incrementAnonGen();
    } catch (e) {
      console.error('[HomeHero] generate failed:', e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section
      aria-label="Anonymous settlement generator"
      style={{
        maxWidth: 720, margin: `${SP.xl}px auto ${SP.xxl}px`,
        padding: `${SP.xxl}px ${SP.xl}px`,
        background: `linear-gradient(180deg, #FBF5E6 0%, #F4EAD0 100%)`,
        border: `1px solid ${BORDER}`,
        borderRadius: R.xl + 2,
        boxShadow: '0 6px 24px rgba(27,20,8,0.10)',
        fontFamily: sans,
        textAlign: 'center',
      }}
    >
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#8C6F32',
        marginBottom: SP.sm,
      }}>
        {t('hero.eyebrow')}
      </div>
      <h1 style={{
        margin: 0,
        fontFamily: serif_, fontWeight: 600,
        fontSize: 32,
        color: INK,
        lineHeight: 1.15,
      }}>
        {t('hero.title')}
      </h1>
      <p style={{
        margin: `${SP.md}px auto 0`, maxWidth: 520,
        fontFamily: serif_, fontStyle: 'italic',
        fontSize: FS.lg, color: '#4A3B22',
        lineHeight: 1.55,
      }}>
        {t('hero.subtitle')}
      </p>

      {/* ── Size picker ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: SP.sm, marginTop: SP.xl,
        justifyContent: 'center', flexWrap: 'wrap',
      }}>
        {ANON_SIZES.map(size => (
          <SizeButton
            key={size}
            value={size}
            label={t(`generate.sizes.${size}`)}
            hint={t(`generate.sizeHint.${size}`)}
            active={pickedSize === size}
            onClick={setPickedSize}
          />
        ))}
      </div>

      {/* ── Primary CTA ──────────────────────────────────────────────── */}
      <div style={{ marginTop: SP.xl }}>
        {atCap ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.sm,
          }}>
            <p style={{
              margin: 0, fontSize: FS.sm, color: '#4A3B22', maxWidth: 380,
            }}>
              You’ve used your {DEFAULT_DAILY_CAP} free generations today.
              Sign in to keep going — accounts unlock all sizes, saves, and exports.
            </p>
            <button
              type="button"
              onClick={onSignIn}
              style={{
                padding: `${SP.md}px ${SP.xl}px`,
                background: GOLD, color: '#fff',
                border: 'none', borderRadius: R.button,
                fontFamily: sans, fontSize: FS.md, fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              <LogIn size={16} /> Sign in to continue
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleBegin}
              disabled={generating}
              style={{
                padding: `${SP.md + 2}px ${SP.xxl}px`,
                background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
                color: '#fff', border: 'none',
                borderRadius: R.button,
                fontFamily: serif_, fontWeight: 600,
                fontSize: 20, letterSpacing: '0.02em',
                cursor: generating ? 'wait' : 'pointer',
                opacity: generating ? 0.7 : 1,
                boxShadow: '0 4px 18px rgba(201,162,76,0.45)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'transform 0.1s',
              }}
            >
              <Sparkles size={18} />
              {generating ? 'Forging…' : t('hero.cta')}
              {!generating && <ArrowRight size={16} />}
            </button>
            <p style={{
              margin: `${SP.sm}px auto 0`, fontSize: FS.xs, color: '#6b5340',
              fontStyle: 'italic',
            }}>
              {t('hero.ctaSubline')}
              {' '}
              <span style={{ opacity: 0.7 }}>
                ({remaining} of {DEFAULT_DAILY_CAP} free today)
              </span>
            </p>
          </>
        )}
      </div>

      {/* ── Footnote ─────────────────────────────────────────────────── */}
      <p style={{
        margin: `${SP.lg}px auto 0`, maxWidth: 480,
        fontSize: FS.xs, color: '#6b5340', lineHeight: 1.5,
      }}>
        {t('hero.note')}
        {onSignIn && (
          <>
            {' '}
            <button
              type="button"
              onClick={onSignIn}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: GOLD, fontFamily: 'inherit', fontSize: 'inherit',
                cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              Sign in
            </button>
            .
          </>
        )}
      </p>

      {/* Bottom-edge ornament — subtle ink seal */}
      <div aria-hidden="true" style={{
        marginTop: SP.xl,
        height: 1,
        background: `linear-gradient(to right, transparent, ${BORDER}, transparent)`,
      }} />
    </section>
  );
}
