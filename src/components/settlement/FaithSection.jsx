/**
 * FaithSection — the dossier's FAITH surface (Phase 4 W-F6, THE PREMIUM GATE).
 *
 * Renders the settlement's LANDED faith outputs (faithPanelModel): the patron +
 * pantheon ranks, the piety arc (a lagged devotion reading vs where it is
 * HEADING), the unaffiliated share, legitimacy + the divine mandate, and THE
 * CAUSE CHAINS AS SENTENCES (conduct drift, secularization / revival, clergy
 * scandal, the opposed-rival dampener, the piety amplifier receipt).
 *
 * TIER GATING (owner 2026-07-10) — three modes, resolved from the settlement's
 * embeds + the viewer's tier:
 *   • ACTIVE — the settlement carries live embeds (a premium account that turned
 *     the key, a lapsed account's owned data, or a SHARED premium pantheon):
 *     the full panel renders READ-ONLY to EVERYONE. A shared pantheon is
 *     premium's best advertisement.
 *   • TEASER — no embeds AND the viewer is not premium: the STATIC GENERIC
 *     true-neutral line (naming NO deity) + a quiet upgrade prompt. This is what
 *     a FREE dossier shows — it can never name a latent deity because the model
 *     never reads config.latentPantheon.
 *   • HIDDEN — premium / elevated with no embeds (faith:'none' / deity-free):
 *     nothing renders.
 *
 * Pure presentational over faithPanelModel; the only store reads are the viewer
 * tier + the upsell seam (setActivePricingMoment / setPurchaseModalOpen).
 */

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { triggerPricingMoment } from '../../lib/pricingMoments.js';
import { faithPanelModel } from './faithPanelModel.js';
import Button from '../primitives/Button.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GREEN, INK, MUTED, RED, SECOND, sans } from '../theme.js';

const TONE_COLOR = { good: GREEN, gold: GOLD, bad: RED };
const TREND = {
  rising: { word: 'rising', color: GREEN },
  falling: { word: 'fading', color: RED },
  steady: { word: 'steady', color: MUTED },
};

/** A slim labelled 0..1 meter (dual-channel: bar width + the % in the label). */
function Meter({ label, value, color = GOLD }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700 }}>
        <span>{label}</span><span>{pct}%</span>
      </div>
      <div
        role="img"
        aria-label={`${label}: ${pct} percent`}
        style={{ height: 4, background: BORDER2, overflow: 'hidden' }}
      >
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
    </div>
  );
}

/** A single plain-prose cause sentence (the legibility law). */
function Cause({ children }) {
  return (
    <div style={{ display: 'flex', gap: 6, color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45 }}>
      <span style={{ color: GOLD, fontWeight: 900, flexShrink: 0 }}>•</span>
      <span>{children}</span>
    </div>
  );
}

/** The full, read-only faith panel (ACTIVE mode). */
function ActiveFaith({ model }) {
  const [faithOpen, setFaithOpen] = useState(false);
  const { patron, cults, effects, live, ranks, piety, unaffiliated, mandate, sinkSentence } = model;

  return (
    <section
      data-testid="faith-section"
      style={{
        marginTop: 16, background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`,
        overflow: 'hidden', fontFamily: sans,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px', borderBottom: `1px solid ${BORDER}`, background: CARD_ALT }}>
        <Sparkles size={16} color={GOLD} />
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>Faith</span>
        {!live && (
          <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>· newly founded</span>
        )}
      </header>

      <div style={{ padding: 13, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Patron line */}
        <div data-testid="faith-patron" style={{ color: INK, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
          <strong>Patron:</strong>{' '}
          <span style={{ fontWeight: 800 }}>{patron.name}</span>
          {patron.rankAxis ? ` (${patron.rankAxis})` : ''}
          {patron.lawAxis ? ` · ${patron.lawAxis}` : ''}
          {patron.domain ? ` · ${patron.domain}` : ''}.
        </div>

        {/* Faith-effects disclosure (the static couplings) */}
        {effects.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFaithOpen((v) => !v)}
              aria-expanded={faithOpen}
              style={{ background: 'none', border: 'none', padding: 0, minHeight: 32, color: GOLD, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, justifyContent: 'flex-start' }}
            >
              {faithOpen ? '▾' : '▸'} How this faith couples ({effects.length})
            </Button>
            {faithOpen && (
              <ul style={{ margin: '4px 0 0', padding: '0 0 0 12px', listStyle: 'none' }}>
                {effects.map((eff, i) => (
                  <li key={i} style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, marginBottom: 3, lineHeight: 1.4 }}>
                    <span style={{ color: GOLD, fontWeight: 900 }}>•</span> {eff}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Cults */}
        {cults.length > 0 && (
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
            <strong>Cults:</strong>{' '}
            {cults.map((c, i) => (
              <span key={`${c.name}-${i}`}>
                {i > 0 ? ', ' : ''}
                <span style={{ fontWeight: 700 }}>{c.name}</span>
                {c.domain ? ` · ${c.domain}` : ''}
              </span>
            ))}
            {' beneath the patron.'}
          </div>
        )}

        {/* Piety arc — the devotion reading + where it's headed + the drivers */}
        {piety && (
          <div data-testid="faith-piety" style={{ display: 'flex', flexDirection: 'column', gap: 7, borderTop: `1px solid ${BORDER2}`, paddingTop: 10 }}>
            <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
              <strong>Devotion:</strong>{' '}
              <span style={{ fontWeight: 800, textTransform: 'capitalize' }}>{piety.band}</span>
              {' · '}
              <span style={{ color: TREND[piety.trend].color, fontWeight: 700 }}>{TREND[piety.trend].word}</span>
            </div>
            {piety.bars.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: 8 }}>
                {piety.bars.map((b) => <Meter key={b.source} label={b.label} value={b.value} />)}
              </div>
            )}
            {piety.amplifier && (
              <Cause>
                <span style={{ color: piety.amplifier.dir === 'up' ? GREEN : MUTED, fontWeight: 700 }}>{piety.amplifier.sentence}</span>
                {piety.realmActive && (
                  <span style={{ color: MUTED }}> (local ×{piety.localMult.toFixed(2)}, realm ×{piety.realmMult.toFixed(2)})</span>
                )}
              </Cause>
            )}
          </div>
        )}

        {/* Pantheon standings — each creed's share + legitimacy band */}
        {ranks.length > 0 && (
          <div data-testid="pantheon-standings" style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid ${BORDER2}`, paddingTop: 10 }}>
            <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>Pantheon standings</div>
            {ranks.map((d) => (
              <div key={d.name} style={{ fontFamily: sans, fontSize: FS.xxs, color: BODY, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 800, color: INK }}>{d.name}</span>
                {d.isPatron ? ' (patron)' : ''}: {d.share}% · {d.standing} ·{' '}
                <span style={{ color: TONE_COLOR[d.band.tone], fontWeight: 700 }}>{d.band.label}</span>{' '}
                <span style={{ color: MUTED }}>(legitimacy {Math.round(d.legitimacy * 100)}%)</span>
                <div
                  role="img"
                  aria-label={`${d.name} adherent share ${d.share} percent`}
                  style={{ height: 5, background: BORDER2, overflow: 'hidden', marginTop: 2 }}
                >
                  <div style={{ width: `${Math.max(0, Math.min(100, d.share))}%`, height: '100%', background: d.isPatron ? GOLD : SECOND }} />
                </div>
              </div>
            ))}
            {unaffiliated != null && unaffiliated > 0 && (
              <div style={{ fontFamily: sans, fontSize: FS.xxs, color: MUTED, lineHeight: 1.4 }}>
                Unaffiliated: {unaffiliated}% keep no god.
              </div>
            )}
          </div>
        )}

        {/* Cause chains as sentences — the legibility law */}
        {piety && (piety.sentences.length > 0 || sinkSentence) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, borderTop: `1px solid ${BORDER2}`, paddingTop: 10 }}>
            {piety.sentences.map((s, i) => <Cause key={`s-${i}`}>{s}</Cause>)}
            {sinkSentence && <Cause>{sinkSentence}</Cause>}
          </div>
        )}

        {/* Divine mandate — faith → governance legitimacy */}
        {mandate && (
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5, borderTop: `1px solid ${BORDER2}`, paddingTop: 10 }}>
            <strong>Divine mandate:</strong>{' '}
            <span style={{ color: mandate.propping ? GREEN : RED, fontWeight: 700 }}>{mandate.phrase}</span>
          </div>
        )}

        {!live && (
          <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
            The faith has only just taken root. Adherent shares, legitimacy, and the tides of devotion emerge as the world turns.
          </div>
        )}
      </div>
    </section>
  );
}

/** The generic true-neutral line + a quiet upgrade prompt (TEASER mode). Names NO deity. */
function FaithTeaser({ publicDossier }) {
  const tier = useStore((s) => s.auth?.tier);
  const setPurchaseModalOpen = useStore((s) => s.setPurchaseModalOpen);
  const setActivePricingMoment = useStore((s) => s.setActivePricingMoment);

  const onUpsell = () => {
    triggerPricingMoment('pantheon_preview', setActivePricingMoment, { tier });
    setPurchaseModalOpen?.(true);
  };

  return (
    <section
      data-testid="faith-teaser"
      style={{
        marginTop: 16, background: CARD_ALT, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${BORDER2}`,
        padding: '11px 13px', fontFamily: sans, display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Sparkles size={15} color={MUTED} />
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>Faith</span>
      </div>
      <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
        The people keep their own quiet observances. No single creed holds sway, and the shrines answer to no named god.
      </div>
      {!publicDossier && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
            Awaken a living pantheon (a patron god, rival cults, and the rising and ebbing of devotion) with a premium campaign.
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onUpsell}
            style={{ background: 'none', border: 'none', padding: 0, minHeight: 32, color: GOLD, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, justifyContent: 'flex-start' }}
          >
            Awaken the pantheon →
          </Button>
        </div>
      )}
    </section>
  );
}

/**
 * @param {{ settlement: any, publicDossier?: boolean }} props
 */
export default function FaithSection({ settlement, publicDossier = false }) {
  const tier = useStore((s) => s.auth?.tier);
  const elevated = useStore((s) => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const isPremium = tier === 'premium' || elevated;

  const model = useMemo(() => faithPanelModel(settlement), [settlement]);

  // ACTIVE — the settlement owns live embeds: show the full panel to everyone.
  if (model.hasEmbed) return <ActiveFaith model={model} />;
  // HIDDEN — premium/elevated, deity-free (faith:'none'): render nothing.
  if (isPremium) return null;
  // TEASER — free/anon, no embeds: the generic true-neutral line (names NO deity).
  return <FaithTeaser publicDossier={publicDossier} />;
}
