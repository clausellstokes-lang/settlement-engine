/**
 * FaithTab — the dossier's WORLD-group FAITH tab (§805: the faith half of the
 * old WarFaithTab, split out; the owner's layout landed in one act, content
 * deepening as the W-FAITH / W-LIVES trains land).
 *
 * The §805 layout, glance → sentence → table. CONSOLIDATED 2026-10-30 (chair rulings
 * F1, F3 + F6): the patron seat (its legitimacy band and the contested marker) now rides
 * FaithSection's patron line, and the niche rows merged with FaithSection's pantheon
 * standings into ONE ranked creed list (niche · standing · following band · legitimacy
 * band, with each creed's W-LIVES / W-FAITH depth rows beneath). This tab keeps the desk
 * positions, the cumulative field, the gated panel and the realm pantheon:
 *   • FAITHSECTION — the W-F6 CONSTITUTIONAL premium seam, UNCHANGED: free/anon
 *     see the generic true-neutral teaser and NEVER a deity name; an owned or
 *     shared embed renders the read-only panel to everyone. This file never
 *     adopts THEIRS' ungated WarFaithSection / useSettlementLiveWorld.
 *   • THE REALM PANTHEON — the PantheonPanel machinery (§805's named reuse),
 *     mounted for the owning DM alone: the live realm ledger names EVERY deity
 *     in the realm, so it rides the same premium ∧ ¬playerView ∧ ¬publicDossier
 *     wall the map surface's Cartographer gate expresses (P9), lazy like every
 *     other mount of the panel.
 */

import { Suspense, lazy, useMemo } from 'react';
import FaithSection from '../../settlement/FaithSection.jsx';
import { FALL_SENTENCE, faithPanelModel } from '../../settlement/faithPanelModel.js';
import { hasPantheon } from '../../map/PantheonPanel.jsx';
// THE WAR & FAITH DESK, drawn through its one gated call site (WarFaithDesk.jsx). This tab
// does NOT call the desk itself — `warFaith` is one corpus leaf spanning this tab and the
// war tab, and the mount walker admits exactly one caller per desk so the public-dossier
// gate lives in one place for both.
import {
  FaithCreedLines, FaithNicheGlance, FaithSeatLines, FaithTeaserLines, warFaithDeskRungs,
} from './WarFaithDesk.jsx';
import { useStore } from '../../../store/index.js';
import { BORDER, CARD, FS, GREEN, INK, MUTED, RED, SECOND, BODY, sans } from '../../theme.js';
import { chromeFontSize } from '../../../design/proseScale.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
import NameColumns from '../../primitives/NameColumns.jsx';

const PantheonPanel = lazy(() => import('../../map/PantheonPanel.jsx'));

/** W-FAITH F7c — THE CUMULATIVE FIELD IN BAND WORDS. One row per channel the
 *  whole pantheon audibly moves, off the tick-END projection: the direction
 *  and the magnitude band, every threshold derived from the F6c tuning
 *  surface (see faithDeepening.fieldEffectRows). Dark world, no authored
 *  boon/bane, or a magic-dead dial ⇒ no projection ⇒ this block is absent. */
function FieldBlock({ rows }) {
  const mobile = useIsMobile();
  return (
    <div data-testid="faith-field-block" style={{ marginBottom: 14 }}>
      <div style={{ fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
        Divine influence
      </div>
      {/* ⭐ THE CHANNELS RUN IN COLUMNS (owner order 2026-09-19 — "sections like these
          … in two or three columns to conserve space"). A row is a channel word and
          two band words; the pantheon moves up to nine of them, and nine full-width
          lines of three words each is the shape the order names. Below six the
          primitive renders the single column this block rendered before. */}
      <NameColumns count={rows.length}>
        {rows.map((r) => (
          <div key={r.channel} data-testid="faith-field-row" style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '8px 10px', marginBottom: 6 }}>
            <span style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, textTransform: 'capitalize' }}>
              {r.channelWord}
            </span>
            <span style={{ color: BODY, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile) }}>
              {' · '}
              <span style={{ color: r.direction === 'blessed' ? GREEN : RED, fontWeight: 700 }}>{r.direction}</span>
              {' · '}{r.band}
            </span>
          </div>
        ))}
      </NameColumns>
    </div>
  );
}

/**
 * @param {{ settlement: any, saveId?: string|null, playerView?: boolean, publicDossier?: boolean }} props
 */
export default function FaithTab({ settlement, saveId = null, playerView = false, publicDossier = false }) {
  const mobile = useIsMobile();
  const sid = saveId != null ? String(saveId)
    : (settlement?.id != null ? String(settlement.id) : null);

  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const isPremium = tier === 'premium' || elevated;
  const campaigns = useStore(s => s.campaigns);

  const model = useMemo(() => faithPanelModel(settlement), [settlement]);

  // W-FAITH F7c — the deepening rows ride the model (computed inside
  // faithPanelModel from the records it already reads, so this component
  // reads NO config key of its own — the observed-shape inventory is
  // untouched). Absent on the no-embed model; defaulted so the gate below
  // stays the only decision point.
  const deepening = model.deepening || { byName: {}, fieldRows: [] };

  // The realm pantheon is DM-realm data (it names EVERY deity in the realm), so
  // it rides the map surface's own wall — premium/elevated (the P9 Cartographer
  // gate's spelling), never a player view or a public dossier.
  const dmRealmView = isPremium && !playerView && !publicDossier;
  const pantheonCampaign = useMemo(() => {
    if (!dmRealmView || !sid || !Array.isArray(campaigns)) return null;
    const campaign = campaigns.find(c => (c.settlementIds || []).map(String).includes(sid));
    return campaign && hasPantheon(campaign) ? campaign : null;
  }, [dmRealmView, sid, campaigns]);

  // Honest-absence note: FaithSection renders SOMETHING unless the viewer is
  // premium/elevated AND the settlement carries no embed (its HIDDEN mode).
  const faithWillRender = !!model.hasEmbed || !isPremium;

  // THE DESK, read ONCE per render through its single gated call site and routed by the
  // mount registry below. The model is the ONLY reading handed over — this tab holds no
  // worldState by §805's constitution, so the war half of the leaf is simply absent and
  // every war rung comes back null, which is R-DST-K rather than a gap.
  const deskProse = warFaithDeskRungs({
    settlement,
    publicDossier,
    playerView,
    readings: {
      faith: model,
      // The panel model's own answer for "does this town keep a named faith at all".
      hasPatron: !!model.hasEmbed,
      // The TYPED CAUSE of a seat that changed hands. The model exposes the finished
      // SENTENCE and not the token, and a desk must key on the token — so the token is
      // recovered by inverting the producer's OWN exported map, whose keys are exactly
      // `PATRON_FALL_CAUSES` (faithPanelModel's acceptance battery asserts that equality,
      // so a fifth cause reds there rather than going silently unmapped here).
      //
      // ⚠ WHY NOT READ `config.faithProfile.patronFall.cause` DIRECTLY, which is shorter:
      // the reader-with-no-writer walker convicts that read as "a key no writer produces".
      // The verdict is false about the code — `projectReligionStateOntoSettlement` writes
      // it — and true about the walker's OBSERVATION CORPUS, which is deity-free, so no
      // observed settlement carries the key. Inverting an exported map adds no observed
      // read at all, and it keeps the token's vocabulary owned by the producer.
      patronFallCause: model.patronFallSentence
        ? Object.keys(FALL_SENTENCE).find((c) => FALL_SENTENCE[c] === model.patronFallSentence)
        : undefined,
    },
  });

  // THE DESK SPEAKS ONLY WHERE THE PANEL IS SILENT (chair rulings F2 and F4, 2026-10-30).
  // FaithSection's ACTIVE panel states the patron's rank, the cults, the devotion band and
  // its arc, the creed standings, the sink sentence, the mandate and the patron's fall as
  // datum rows; a DS-FTH-1 / DS-FTH-3 lens that restates one of those rows is not drawn.
  // Each lens returns when its datum row is absent (no embed, or a record that lacks it).
  const active = !!model.hasEmbed;
  const panelDesk = {
    ...deskProse,
    patronRank: active && model.patron?.rankAxis ? null : deskProse.patronRank,
    patronCults: active && model.cults?.length > 0 ? null : deskProse.patronCults,
    devotion: active && model.piety ? null : deskProse.devotion,
    pietyArc: active && model.piety ? null : deskProse.pietyArc,
    standings: active && model.ranks?.length > 0 ? null : deskProse.standings,
    sink: active && model.sinkSentence ? null : deskProse.sink,
    mandate: active && model.mandate ? null : deskProse.mandate,
    creedFall: active && model.patronFallSentence ? null : deskProse.creedFall,
  };

  return (
    <div data-testid="faith-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      {/* ── faith.patronSeat (DS-FTH-1) — the lenses the panel below does not state ── */}
      <FaithSeatLines desk={panelDesk} settlement={settlement} />
      {/* ── faith.nicheRow (DS-FTH-3, GLANCE) — the leaf's one glance position. The creed
          rows themselves are FaithSection's one ranked list now (F3 + F6). ── */}
      {active && model.ranks.length > 0 && <FaithNicheGlance desk={deskProse} />}
      {/* ── faith.creedStanding (DS-FTH-3) — standing, legitimacy and the niche contest;
          the fall lens is cut where the panel prints the fall sentence (F4) ── */}
      <FaithCreedLines desk={panelDesk} settlement={settlement} />
      {/* W-FAITH F7c — the cumulative field, band words only; absent when the
          projection is (dark world, nothing authored, or a dead-magic dial). */}
      {model.hasEmbed && deepening.fieldRows.length > 0 && <FieldBlock rows={deepening.fieldRows} />}
      {/* The gated faith surface — the constitutional seam, unchanged. */}
      <FaithSection settlement={settlement} publicDossier={publicDossier} />
      {pantheonCampaign && (
        <div data-testid="faith-realm-pantheon" style={{ marginTop: 16 }}>
          {/* The wait is WITNESSED, not confessed (the witnessed-wait ratchet's
              own instruction: narrate it in the world's voice). "Opening the …"
              is this estate's landed idiom for a door being opened for you. */}
          <Suspense fallback={<div role="status" style={{ padding: 12, color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile) }}>Opening the realm pantheon…</div>}>
            <PantheonPanel campaign={pantheonCampaign} />
          </Suspense>
        </div>
      )}
      {!faithWillRender && (
        <div style={{ padding: 24, textAlign: 'center', color: MUTED, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.6 }}>
          This settlement keeps no named faith.
          {/* ── faith.teaser (DS-FTH-2) — ⭐ THE PATRON-LESS TOWN'S OWN VOICE, and the
              position that matters most on the corpus this product actually ships against:
              a settlement with no `primaryDeitySnapshot` is the COMMON case, not the edge
              (the whole review corpus is deity-free today). The four authored variants name
              no creed and no god, because the block was written for exactly this town.

              ⚠ IT SITS HERE, INSIDE THE HONEST-ABSENCE BRANCH, AND THAT PLACEMENT IS THE
              FINDING RATHER THAN THE LAYOUT. DS-FTH-2's `[street]` variant is a
              BYTE-IDENTICAL copy of FaithSection's own teaser body ("The people keep their
              own quiet observances. No single creed holds sway, and the shrines answer to
              no named god.") — the same `canonical`-angle hazard the economy desk records
              for `shadowEconomy` and `tradeFlow`, where a corpus line and its live twin an
              inch apart is the page saying one thing twice. This branch is exactly where
              FaithSection renders NOTHING (its HIDDEN mode: a premium viewer, no embed), so
              the two can never appear together. Every other viewer keeps the live teaser,
              which carries the same sentence — so nothing is lost, and nothing is doubled.

              The deity-assignment call to action that stood above is gone (chair ruling F8,
              2026-10-30); the standing line is the fact, and the corpus line sits under it. ── */}
          <FaithTeaserLines desk={deskProse} settlement={settlement} />
        </div>
      )}
    </div>
  );
}
