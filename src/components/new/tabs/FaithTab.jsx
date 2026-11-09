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
import { faithPanelModel, trimFaithDeskToPanel } from '../../settlement/faithPanelModel.js';
import { hasPantheon } from '../../map/PantheonPanel.jsx';
// THE WAR & FAITH DESK, drawn through its one gated call site (WarFaithDesk.jsx). This tab
// does NOT call the desk itself — `warFaith` is one corpus leaf spanning this tab and the
// war tab, and the mount walker admits exactly one caller per desk so the public-dossier
// gate lives in one place for both.
import {
  FaithCreedLines, FaithGroundLines, FaithNicheGlance, FaithSeatLines, FaithTeaserLines, faithDeskReadings, warFaithDeskRungs,
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
    // THE PUBLIC BRANCH (SW-B7b): a shared page prints the desk the owner's player view drew here.
    publicSite: 'warFaith:faith',
    // The readings (WarFaithDesk.jsx :: faithDeskReadings): the panel model, the patron, the
    // fall's typed cause and the birth-time stress flags — one derivation, shared with the
    // public prose composer.
    readings: faithDeskReadings(settlement, model),
  });

  // THE DESK SPEAKS ONLY WHERE THE PANEL IS SILENT (chair rulings F2 and F4, 2026-10-30).
  // FaithSection's ACTIVE panel states the patron's rank, the cults, the devotion band and
  // its arc, the creed standings, the sink sentence, the mandate and the patron's fall as
  // datum rows; a DS-FTH-1 / DS-FTH-3 lens that restates one of those rows is not drawn.
  // Each lens returns when its datum row is absent (no embed, or a record that lacks it).
  const active = !!model.hasEmbed;
  const panelDesk = trimFaithDeskToPanel(deskProse, model);

  return (
    <div data-testid="faith-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      {/* THE BLOCK LAW (X-16; BUILD-W2-BLOCKLAW U5): the panel's datum rows (the patron line
          is the page's answer), the glance row and the field rows first; the desk passages
          that couple them after. Every block moved verbatim. */}
      {/* The gated faith surface — the constitutional seam, unchanged. */}
      <FaithSection settlement={settlement} publicDossier={publicDossier} />
      {/* ── faith.nicheRow (DS-FTH-3, GLANCE) — the leaf's one glance position. The creed
          rows themselves are FaithSection's one ranked list now (F3 + F6). ── */}
      {active && model.ranks.length > 0 && <FaithNicheGlance desk={deskProse} />}
      {/* W-FAITH F7c — the cumulative field, band words only; absent when the
          projection is (dark world, nothing authored, or a dead-magic dial). */}
      {model.hasEmbed && deepening.fieldRows.length > 0 && <FieldBlock rows={deepening.fieldRows} />}
      {/* ── faith.patronSeat (DS-FTH-1) — the lenses the panel above does not state ── */}
      <FaithSeatLines desk={panelDesk} settlement={settlement} />
      {/* ── faith.creedStanding (DS-FTH-3) — standing, legitimacy and the niche contest;
          the fall lens is cut where the panel prints the fall sentence (F4) ── */}
      <FaithCreedLines desk={panelDesk} settlement={settlement} />
      {/* ── faith.templeGround (DS-FTH-4) — the church beside the town's other powers, from the
          birth-time stress flags; it speaks with or without a patron (W4 PEOPLE, 2026-11-07) ── */}
      <FaithGroundLines desk={panelDesk} settlement={settlement} />
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
          {/* ── faith.teaser (DS-FTH-2) — THE FAITH LINE OPENS THE POSITION (lane FAITH,
              2026-11-03): what the place's faith IS, read off the ONE FAITH READING the model
              carries (domain/dossier/faithReading.js): the church beside a church, the walk to
              the neighbour's church where there is only access, the quiet observances where
              there is nothing; the god's and the church's names are the DM's, said once. It
              replaced the old standing message, which denied the church that generation wrote
              on every settlement (root-cause failure 2). The print desk puts the same line at
              the same position. DS-FTH-2's PRIVATE DOSSIER lens reads the same reading (lane
              FAITH-POOLS) and so restates a fact the line prints, so `trimFaithDeskToPanel`
              stands it down here (F2/F4; X-50, every fact once). ── */}
          <FaithTeaserLines desk={panelDesk} settlement={settlement} lead={[(model.line || []).join(' ')]} />
        </div>
      )}
    </div>
  );
}
