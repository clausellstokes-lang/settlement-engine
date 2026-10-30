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
import { faithPanelModel, shareBandLabel } from './faithPanelModel.js';
import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { purchasesOpen } from '../../lib/launchGate.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GREEN, INK, MUTED, RED, SECOND, sans } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

const TONE_COLOR = { good: GREEN, gold: GOLD, bad: RED };
const TREND = {
  rising: { word: 'rising', color: GREEN },
  falling: { word: 'fading', color: RED },
  steady: { word: 'steady', color: MUTED },
};

/** A slim labelled 0..1 meter (dual-channel: bar width + the % in the label). */
function Meter({ label, value, color = GOLD }) {
  const mobile = useIsMobile();
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: BODY, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 700 }}>
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
  // THE PHONE PROSE FLOOR — a cause chain IS a sentence (the legibility law).
  const mobile = useIsMobile();
  return (
    <div style={{ display: 'flex', gap: 6, color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.45 }}>
      <span style={{ color: GOLD, fontWeight: 900, flexShrink: 0 }}>•</span>
      <span>{children}</span>
    </div>
  );
}

/** A `temper:alignment` niche token in plain words ('warlike:good' → 'warlike · good'). */
function nicheWords(niche) {
  return String(niche).split(':').filter(Boolean).join(' · ');
}

/** W-FAITH F7c — one creed's deepening rows: the top-3 authored character in
 *  the pinned total order, and the boon/bane picks as the band words they are
 *  authored in. The jealous marker on a boon is the flaw register's typed
 *  cause, muted so it reads as colour rather than alarm. Absent data renders
 *  nothing — the rows exist only where a deity authored something. (Moved here
 *  from FaithTab with the niche rows, 2026-10-30: one creed list, F3 + F6.) */
function DepthRows({ depth }) {
  const mobile = useIsMobile();
  return (
    <>
      {depth.top3.length > 0 && (
        <div data-testid="faith-depth-character" style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.pico, mobile), lineHeight: 1.5, marginTop: 4 }}>
          <span style={{ color: MUTED, fontWeight: 700 }}>Known for </span>
          {depth.top3.map((r, i) => (
            <span key={`${r.axisId}:${r.pole}`}>
              {i > 0 && ' · '}
              <span style={{ textTransform: 'capitalize' }}>{r.word}</span>
              {` (${r.levelWord})`}
            </span>
          ))}
        </div>
      )}
      {depth.gifts.map((g) => (
        <div key={g.kind} data-testid={`faith-depth-${g.kind}`} style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.pico, mobile), lineHeight: 1.5, marginTop: 2 }}>
          <span style={{ color: g.kind === 'boon' ? GREEN : RED, fontWeight: 800, textTransform: 'capitalize' }}>{g.kind}</span>
          {' · '}{g.channelWord}{' · '}{g.strengthWord}
          {g.flaw && <span style={{ color: MUTED, fontStyle: 'italic' }}>{' · '}{g.flaw}</span>}
        </div>
      ))}
    </>
  );
}

/** The full, read-only faith panel (ACTIVE mode). */
function ActiveFaith({ model }) {
  const [faithOpen, setFaithOpen] = useState(false);
  // THE PHONE PROSE FLOOR — the coupling bullets and the newly-founded note. The
  // patron line, the standings rows and the band words keep their own steps.
  const mobile = useIsMobile();
  const { patron, cults, effects, live, ranks, piety, unaffiliated, mandate, sinkSentence, patronFallSentence } = model;
  // THE PATRON SEAT LIVES ON THE PATRON LINE (chair ruling F1, 2026-10-30): the seat's
  // legitimacy band and the contested marker were a block of their own above this panel,
  // naming the patron a second time. Live ranks only; a static embed has no band yet.
  const patronRank = (ranks || []).find((d) => d.isPatron) || null;
  const byName = model.deepening?.byName || {};

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
          <span style={{ color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800 }}>· newly founded</span>
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
          {patronRank && (
            <span data-testid="faith-patron-claim">
              {' Its claim is '}
              <span style={{ color: TONE_COLOR[patronRank.band.tone], fontWeight: 700 }}>{patronRank.band.label}</span>
              {model.contested && <span style={{ color: RED }}>{', and a rival creed presses the seat'}</span>}.
            </span>
          )}
        </div>

        {/* Faith-effects disclosure (the static couplings) */}
        {effects.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFaithOpen((v) => !v)}
              aria-expanded={faithOpen}
              style={{ background: 'none', border: 'none', padding: 0, minHeight: 32, color: GOLD, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, justifyContent: 'flex-start' }}
            >
              {faithOpen ? '▾' : '▸'} How this faith couples ({effects.length})
            </Button>
            {faithOpen && (
              <ul style={{ margin: '4px 0 0', padding: '0 0 0 12px', listStyle: 'none' }}>
                {effects.map((eff, i) => (
                  <li key={i} style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), marginBottom: 3, lineHeight: 1.4 }}>
                    <span style={{ color: GOLD, fontWeight: 900 }}>•</span> {eff}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Cults */}
        {cults.length > 0 && (
          <div style={{ color: INK, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5 }}>
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
            <div style={{ color: INK, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5 }}>
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
                {piety.amplifier.source && (
                  <span style={{ color: MUTED }}> {piety.amplifier.source}</span>
                )}
              </Cause>
            )}
          </div>
        )}

        {/* THE CREEDS, ONE RANKED LIST (chair ruling F3 + F6, 2026-10-30). The tab's "Niche
            occupancy" rows and these standings iterated the same ranks; they are one row per
            creed now: niche · standing · following band · legitimacy band, with the creed's
            depth rows beneath. The share reads as its band and the legitimacy as its band; the
            parenthetical "(rightful claim N%)" restated the band word and is gone. */}
        {ranks.length > 0 && (
          <div data-testid="pantheon-standings" style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid ${BORDER2}`, paddingTop: 10 }}>
            <div style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 900 }}>Pantheon standings</div>
            {ranks.map((d) => (
              <div key={d.name} data-testid="faith-niche-row" style={{ fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), color: BODY, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 800, color: INK }}>{d.name}</span>
                {d.isPatron ? ' (patron)' : ''}{': '}
                {d.niche && <span style={{ textTransform: 'capitalize' }}>{nicheWords(d.niche)}{' · '}</span>}
                {d.standing}{' · '}{shareBandLabel(d.share)}{' · '}
                <span style={{ color: TONE_COLOR[d.band.tone], fontWeight: 700 }}>{d.band.label}</span>
                <div
                  role="img"
                  aria-label={`${d.name} adherent share ${d.share} percent`}
                  style={{ height: 5, background: BORDER2, overflow: 'hidden', marginTop: 2 }}
                >
                  <div style={{ width: `${Math.max(0, Math.min(100, d.share))}%`, height: '100%', background: d.isPatron ? GOLD : SECOND }} />
                </div>
                {byName[d.name] && <DepthRows depth={byName[d.name]} />}
              </div>
            ))}
            {unaffiliated != null && unaffiliated > 0 && (
              <div style={{ fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), color: MUTED, lineHeight: 1.4 }}>
                Unaffiliated: {unaffiliated}% keep no god.
              </div>
            )}
          </div>
        )}

        {/* Cause chains as sentences — the legibility law */}
        {(patronFallSentence || sinkSentence || (piety && piety.sentences.length > 0)) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, borderTop: `1px solid ${BORDER2}`, paddingTop: 10 }}>
            {patronFallSentence && <Cause>{patronFallSentence}</Cause>}
            {piety && piety.sentences.map((s, i) => <Cause key={`s-${i}`}>{s}</Cause>)}
            {sinkSentence && <Cause>{sinkSentence}</Cause>}
          </div>
        )}

        {/* Divine mandate — faith → governance legitimacy */}
        {mandate && (
          <div style={{ color: INK, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5, borderTop: `1px solid ${BORDER2}`, paddingTop: 10 }}>
            <strong>Divine mandate:</strong>{' '}
            <span style={{ color: mandate.propping ? GREEN : RED, fontWeight: 700 }}>{mandate.phrase}</span>
          </div>
        )}

        {!live && (
          <div style={{ color: MUTED, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.45 }}>
            The faith has only just taken root. Adherent shares, legitimacy, and the tides of devotion emerge as the world turns.
          </div>
        )}
      </div>
    </section>
  );
}

/** The generic true-neutral line + a quiet upgrade prompt (TEASER mode). Names NO deity. */
function FaithTeaser({ publicDossier }) {
  // THE PHONE PROSE FLOOR — the true-neutral line and the upgrade prompt, the
  // two passages this teaser exists to carry.
  const mobile = useIsMobile();
  const tier = useStore((s) => s.auth?.tier);
  const setPurchaseModalOpen = useStore((s) => s.setPurchaseModalOpen);
  const setActivePricingMoment = useStore((s) => s.setActivePricingMoment);
  // Purchases stay closed until launch (lib/launchGate.js): the upsell CTA is
  // disabled and wears the Available at launch pill.
  const purchasesAreOpen = purchasesOpen();

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
      <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5 }}>
        The people keep their own quiet observances. No single creed holds sway, and the shrines answer to no named god.
      </div>
      {!publicDossier && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ color: MUTED, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.45 }}>
            Awaken a living pantheon (a patron god, rival cults, and the rising and ebbing of devotion) with a premium campaign.
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={!purchasesAreOpen}
            onClick={onUpsell}
            style={{ background: 'none', border: 'none', padding: 0, minHeight: 32, color: GOLD, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 900, justifyContent: 'flex-start', ...(purchasesAreOpen ? null : { flexWrap: 'wrap' }) }}
          >
            Awaken the pantheon →
            {!purchasesAreOpen && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
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
