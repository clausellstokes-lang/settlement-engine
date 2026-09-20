/**
 * FoundingWorlds.jsx — CURATED FIRST SAMPLES: the create-landing surface.
 *
 * A small strip of hand-curated example settlements offered on the create flow so
 * a new DM witnesses depth in their first ten minutes. The trio is the SAME
 * Mossgate / Black Crag / Cnocby samples the Library's saves empty-state shows
 * (imported from src/data/sampleSettlements.js — single source, zero string
 * duplication); 'Fork this sample' drives the SAME fork wiring as the Library
 * (SettlementsPanel.forkSample): load the sample's config with a user-suffixed
 * seed, generate, and open the dossier. (Walk W1, owner order 2026-07-21, ledger
 * 13da1e95.)
 *
 * The older editorial FOUNDING_SEEDS registry (src/data/foundingSeeds.js) is no
 * longer rendered here; the data and its claims-parity probe
 * (tests/data/foundingSeeds.probe.test.js) remain in the repo, unrendered.
 *
 * Rule-framed plate idiom (no radius, no tint fills) so the deep-craft kill-list
 * stays tolerance-0.
 *
 * ⛔ A FORK IS A CURATED SEED, NOT A FREE GENERATION (owner ruling, ODQ §934.24(b)).
 * It passes `intent: 'sampleFork'`, which the generation lane reads to skip the
 * anonymous daily cap AND to leave the day's allowance unspent. The TIER gate still
 * applies — a City sample is still beyond an account-less visit — and every real
 * generation still spends and is still bound by the cap.
 *
 * ⛔ AND NO REFUSAL IS SILENT (ODQ §934.24(c)). This action had THREE silent exits and
 * the 2026-09-19 walk found all of them at once: the cap check called
 * `onNavigate('generate')`, which on /create — where this strip renders — is a
 * navigation to the page the reader is already looking at; the null return from a
 * tier-gated generation was DISCARDED and it navigated anyway, with nothing forged;
 * and a throw had no catch at all, escaping as an unhandled rejection while `finally`
 * cleared the spinner as if the work had finished. Every one of them now raises the
 * lane's registered reason through primitives/RefusalNotice.jsx, above the cards,
 * and a refusal NEVER navigates.
 */
import { useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';
import { INK, BODY, MUTED, BORDER, CARD, CARD_ALT, sans, serif_, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { useStore } from '../../store/index.js';
import RefusalNotice from '../primitives/RefusalNotice.jsx';
import { GENERATION_INTENT_SAMPLE_FORK } from '../../lib/generationIntent.js';
import { raisedHere, REFUSAL_SURFACES } from '../../lib/refusalReasons.js';
import { SAMPLE_SETTLEMENTS, forkConfigFor, forkSeedFor } from '../../data/sampleSettlements.js';
import { tierStockImage } from '../../domain/display/tierStockImage.js';

/**
 * ⛔ THE CURATED CARDS HAD NO PICTURE AT ALL (owner order ODQ §934.32: the stock
 * tier images "should be the default image ... until an owner replaces that
 * image"). Three text plates were the first thing a visitor was offered on
 * /create and in the landing's commons fallback, on a page whose claim is depth.
 *
 * FIXED HEIGHT, DELIBERATELY. This strip's footprint is RESERVED by
 * home/LandingBelowFold.jsx (SAMPLE_PLATE_H) while its lazy chunk is in flight,
 * and a plate whose height depends on an image's aspect ratio would make that
 * reserve unknowable and reintroduce the layout jump the reserve exists to stop.
 * 120px + the card's SP.sm gap is exactly what the reserve there was raised by.
 */
const SAMPLE_PLATE_IMAGE_H = 120;

// MG-3f (leak L8): this file used to INLINE the Library's migrateConfig verbatim, for a
// real reason it recorded — importing settlements/helpers.js dragged the whole saves-panel
// helper set into this lazy create-surface chunk and pushed bytes toward the first-paint
// closure (the recorded shared-chunk hazard). The rule now lives in a dependency-free leaf
// that carries NOTHING else, so the import costs two statements instead of a helper set
// and the fork's justification is dissolved rather than tolerated.
import { migrateSettlementConfig as normalizeConfig } from '../../lib/settlementConfigMigration.js';

export default function FoundingWorlds({ onNavigate }) {
  const mobile = useIsMobile();
  const generate = useStore((s) => s.generateSettlement);
  const updateConfig = useStore((s) => s.updateConfig);
  const authUserId = useStore((s) => s.auth.user?.id);
  // The lane records WHY it refused; this surface only renders it.
  const lastRefusal = useStore((s) => s.lastRefusal);
  const clearRefusal = useStore((s) => s.clearRefusal);
  const [busyId, setBusyId] = useState(null);

  // 'Fork this sample' — identical wiring to the Library's SettlementsPanel.forkSample:
  // load the sample's config minus its seed (forkConfigFor), run the engine with a
  // user-suffixed seed (so two users forking the same sample get mechanically-different
  // towns), and reveal the dossier.
  // The auto-save-to-Library and purchase-modal branches are Library-dashboard concerns
  // and do not apply on the create-landing strip; a tier-gated null result still routes
  // to the wizard where the existing upgrade path lives.
  const forkSample = (sample) => async () => {
    if (busyId) return;
    clearRefusal?.();
    setBusyId(sample.id);
    try {
      const seed = forkSeedFor(sample, authUserId);
      // The seed is the generation argument, never a config key (forkConfigFor); the
      // INTENT is an argument for the same reason — the config is persisted, so an
      // exemption stamped there would outlive the fork that earned it.
      updateConfig({ ...normalizeConfig(forkConfigFor(sample)), _forkedFromSample: sample.id });
      // `at` names WHERE the reader clicked (REVIEW-P F12): this strip renders beside
      // the hero on /create and beside the hero AND §02 on /home, and all three used to
      // paint the same record. The gate stamps it; only this surface says it.
      const forged = await generate(seed, { intent: GENERATION_INTENT_SAMPLE_FORK, at: REFUSAL_SURFACES.FOUNDING_WORLDS });
      // A refusal is already recorded by the gate that made it; rendering it is all
      // that is left, and NAVIGATING AWAY FROM IT is what left the reader with nothing.
      if (!forged) return;
      onNavigate?.('generate');
    } catch {
      // The lane records the reason before it re-throws; the notice below renders it.
    } finally {
      setBusyId(null);
    }
  };

  if (!SAMPLE_SETTLEMENTS.length) return null;

  return (
    <section aria-label="Founding worlds"
      style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: `${SP.lg}px ${SP.md}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.xs }}>
        <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.lg, fontWeight: 900 }}>Founding Worlds</h2>
      </div>
      <p style={{ margin: `0 0 ${SP.md}px`, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
        Start somewhere already alive. Fork one of these curated settlements into your own draft: no two the same, all deterministic from their seed.
      </p>
      {/* The refusal sits directly under the lead-in, above the cards the reader
          clicked, announced as well as shown (role=alert inside the notice). */}
      <RefusalNotice refusal={raisedHere(lastRefusal, REFUSAL_SURFACES.FOUNDING_WORLDS) ? lastRefusal : null} style={{ marginBottom: SP.md }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: SP.md }}>
        {SAMPLE_SETTLEMENTS.map((sample) => (
          <article key={sample.id}
            style={{ border: `1px solid ${BORDER}`, background: CARD_ALT, padding: SP.md, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
            {tierStockImage(sample.tier) && (
              <img
                src={tierStockImage(sample.tier)}
                /* The painting stands for the TIER, and says so: it is not a
                   picture of this settlement, and the alt text must not pretend
                   it is (the same rule the gallery card follows). */
                alt={`A ${sample.tier} of the kind ${sample.name} is`}
                loading="lazy"
                style={{ width: '100%', height: SAMPLE_PLATE_IMAGE_H, objectFit: 'cover', display: 'block' }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.md, fontWeight: 900 }}>{sample.name}</h3>
              <span style={{ color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), textTransform: 'capitalize' }}>{sample.tier} · {sample.terrain}</span>
            </div>
            <p style={{ margin: 0, color: BODY, fontFamily: serif_, fontStyle: 'italic', fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5 }}>{sample.teaser}</p>
            <ul style={{
              margin: 0, padding: `0 0 0 ${SP.md}px`, color: MUTED, fontFamily: sans,
              // phone-floor: the tags are two- and three-word CHIPS glanced at beside the teaser, not a passage — chrome, though the 1.5 line-height reads as prose to the census's shape heuristic.
              fontSize: chromeFontSize(FS.xxs, mobile), lineHeight: 1.5,
            }}>
              {sample.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            <div style={{ flex: 1 }} />
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm, background: CARD }}>
              <Button variant="primary" size="sm" busy={busyId === sample.id} onClick={forkSample(sample)}>
                {busyId === sample.id ? 'Forking…' : 'Fork this sample'}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
