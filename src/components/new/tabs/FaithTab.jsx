/**
 * FaithTab — the dossier's WORLD-group FAITH tab (§805: the faith half of the
 * old WarFaithTab, split out; the owner's layout landed in one act, content
 * deepening as the W-FAITH / W-LIVES trains land).
 *
 * The §805 layout, glance → sentence → table:
 *   • THE PATRON SEAT — who holds it and its legitimacy NOW (the seat's
 *     rightful claim banded, the contested marker, the seat security), derived
 *     from faithPanelModel's live ranks — nothing renders for a static embed
 *     or a deity-free town (honest absence, no fabricated seat).
 *   • NICHE OCCUPANCY — who occupies which niche of the pantheon (the
 *     religionState temperament × alignment niches, projected through
 *     faithProfile.deities[].niche). One row per creed; THESE ROWS are where
 *     the per-deity personality TOP-3 (W-LIVES), boon & bane, and the
 *     cumulative-field sentences (W-FAITH) slot in when those trains land —
 *     absent data renders as absent, never stubbed.
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
import { FALL_SENTENCE, faithPanelModel, shareBandLabel } from '../../settlement/faithPanelModel.js';
import { hasPantheon } from '../../map/PantheonPanel.jsx';
// THE WAR & FAITH DESK, drawn through its one gated call site (WarFaithDesk.jsx). This tab
// does NOT call the desk itself — `warFaith` is one corpus leaf spanning this tab and the
// war tab, and the mount walker admits exactly one caller per desk so the public-dossier
// gate lives in one place for both.
import {
  FaithCreedLines, FaithNicheGlance, FaithSeatLines, FaithTeaserLines, warFaithDeskRungs,
} from './WarFaithDesk.jsx';
import { useStore } from '../../../store/index.js';
import { BODY, BORDER, CARD, FS, GOLD, GREEN, INK, MUTED, RED, SECOND, sans } from '../../theme.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
import NameColumns from '../../primitives/NameColumns.jsx';

const PantheonPanel = lazy(() => import('../../map/PantheonPanel.jsx'));

const BAND_TONE = { good: GREEN, gold: GOLD, bad: RED };

/** A `temper:alignment` niche token in plain words ('warlike:good' → 'warlike · good'). */
function nicheWords(niche) {
  return String(niche).split(':').filter(Boolean).join(' · ');
}

/** The patron seat + its legitimacy NOW — the §805 glance. Renders only from
 *  live ranks (a static embed keeps its patron line inside FaithSection). */
function PatronSeatBlock({ patron, contested }) {
  const mobile = useIsMobile();
  return (
    <div data-testid="faith-patron-seat" style={{
      background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`,
      padding: '12px 14px', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.07em' }}>The patron seat</span>
        {contested && (
          <span style={{ marginLeft: 'auto', fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color: RED }}>contested</span>
        )}
      </div>
      <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5, marginTop: 6 }}>
        <strong style={{ color: INK }}>{patron.name}</strong>
        {' holds the seat. Its claim is '}
        <strong style={{ color: BAND_TONE[patron.band.tone] || BODY }}>{patron.band.label}</strong>
        {/* THE PARENTHETICAL PERCENTAGE IS GONE, not relocated. It read
            "(rightful claim 62%)" one space after the band word that already
            says exactly that in the reader's language — an engine scalar
            restating a word, which is the prose-numerics class this estate
            kills. The band carries the meaning; the float carried only
            precision the table cannot use. */}
        {contested && <span style={{ color: RED }}>{', and a rival creed presses the seat'}</span>}.
      </div>
    </div>
  );
}

/** W-FAITH F7c — one creed's deepening rows: the top-3 authored character in
 *  the pinned total order, and the boon/bane picks as the band words they are
 *  authored in. The jealous marker on a boon is the flaw register's typed
 *  cause, muted so it reads as colour rather than alarm. Absent data renders
 *  nothing — the rows exist only where a deity authored something. */
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

/** Who occupies which niche of the pantheon. One row per creed — carrying the
 *  W-FAITH F7c deepening rows (top-3 character, boon & bane) for any deity
 *  that authored them; a creed with nothing authored keeps its one-line row. */
function NicheOccupancyBlock({ ranks, depth, desk }) {
  const mobile = useIsMobile();
  return (
    <div data-testid="faith-niches" style={{ marginBottom: 14 }}>
      <div style={{ fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
        Niche occupancy
      </div>
      {/* ── faith.nicheRow (DS-FTH-3, GLANCE) — the leaf's one glance position. These rows
          ALREADY print the standing word DS-FTH-3's STANDING pools are keyed on, so the
          record appears here and must not speak here: the registry says `glance`, and
          `drawnAtMount` strips the sentence and the provenance. DS-FTH-3 speaks once, at
          `faith.creedStanding` below. ── */}
      <FaithNicheGlance desk={desk} />
      {ranks.map((d) => {
        // TWO WORDS, BOTH NAMED AS WORDS. `standing` is already a finite typed
        // token out of religionState ('ascendant' / 'cult' / …) — it only read
        // as a scalar because `standing` is a FLOAT_TOKEN to the prose-numerics
        // walker. `share` genuinely IS a number, so it is BANDED rather than
        // renamed: this row is a new surface, and a new surface humanizes.
        const standingWord = d.standing;
        const followingWord = shareBandLabel(d.share);
        return (
          <div key={d.name} data-testid="faith-niche-row" style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '8px 10px', marginBottom: 6 }}>
            <span style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, textTransform: 'capitalize' }}>
              {d.niche ? nicheWords(d.niche) : 'niche unrecorded'}
            </span>
            <span style={{ color: BODY, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile) }}>
              {': '}{d.name}{d.isPatron ? ' (patron)' : ''} · {standingWord} · {followingWord}
            </span>
            {depth[d.name] && <DepthRows depth={depth[d.name]} />}
          </div>
        );
      })}
    </div>
  );
}

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

  const patronRank = model.hasEmbed ? (model.ranks || []).find(d => d.isPatron) : null;
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

  return (
    <div data-testid="faith-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      {patronRank && <PatronSeatBlock patron={patronRank} contested={!!model.contested} />}
      {/* ── faith.patronSeat (DS-FTH-1) — rank, cults, devotion, the arc, standings,
          the sink and the mandate, in the town's own voice ── */}
      <FaithSeatLines desk={deskProse} settlement={settlement} />
      {model.hasEmbed && model.ranks.length > 0 && <NicheOccupancyBlock ranks={model.ranks} depth={deepening.byName} desk={deskProse} />}
      {/* ── faith.creedStanding (DS-FTH-3) — standing, legitimacy, the niche contest and
          the patron fall, beside the rows those words already appear in ── */}
      <FaithCreedLines desk={deskProse} settlement={settlement} />
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
          This settlement keeps no named faith. Assign a patron deity to awaken its pantheon.
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

              The call to action above is product furniture rather than a fact about the
              town, so the corpus line sits UNDER it instead of replacing it — unlike the
              war tab's dormant note, whose fallback IS a fact and is therefore replaced. ── */}
          <FaithTeaserLines desk={deskProse} settlement={settlement} />
        </div>
      )}
    </div>
  );
}
