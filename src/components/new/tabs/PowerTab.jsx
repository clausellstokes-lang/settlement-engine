import React, { useEffect, useRef, useState } from 'react';
import { FS, MUTED, swatch } from '../../theme.js';
import { serif, Section, TabIntro } from '../Primitives';
import { LITERARY_TITLE } from '../labelLadder.js';
import { NarrativeNote } from '../NarrativeNote';
import { FACTION_COLORS } from '../tabConstants';
import { useStore } from '../../../store/index.js';
import { factionIdFromName } from '../../../lib/entities.js';
import { hasLadder, ladderRungsOf, ladderInstabilityOf, ladderFactionKeyOf } from '../../../domain/townMap/ladderRead.js';
import { PowerStrata } from './power/PowerStrata.jsx';
import { rulingChainOf } from '../../../domain/dossier/powerStrata.js';
import { coupContenders, coupRiskLabel } from '../../../domain/rulingPowerCoup.js';
import { structuralLensOf } from '../../../domain/spatial/cohesionWeave.js';
import { settlementBlocs as politicsBlocsOf } from '../../../domain/display/politicsRead.js';
import { powerStateProse, powerLadderRung } from '../../../domain/display/stateProse/powerStateProse.js';
import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
// THE ONE PARAGRAPH RENDERER (owner finding 2026-09-18). The four positions below mapped
// their drawn sentences to one `<p>` EACH; ProseBlock weaves each position into one
// paragraph. The DRAW is unchanged — these are the same strings `drawnAtMount` ruled on.
import ProseBlock from '../ProseBlock.jsx';

/**
 * The legitimacy banner's mount id, bound once. It is used at TWO draws below and the
 * reachability arm counts string LITERALS under src/components, so the literal lives here
 * and the position stays one position — which is what the C3 law is actually about.
 */
const LEGITIMACY_MOUNT = 'power.legitimacyBanner';

/**
 * The stability header's mount id, bound once for the same reason: two draws (the ladder
 * line and the lens beneath it) at ONE position, and the reachability arm counts literals.
 */
const STABILITY_MOUNT = 'power.stabilityHeader';

/**
 * The criminal underside's mount id. THREE draws at this one position — the legitimacy
 * reading DS-POW-1 has none for, the capture rung, and the operation's economic role.
 * The C3 law is about RUNGS per page-set, not draws, so one position may read several
 * pools of one block; binding the id once also keeps the reachability arm's count at one.
 */
const UNDERSIDE_MOUNT = 'power.criminalUnderside';

/** Rule and succession: the risk ladder, the hold, and the lineage. Three draws, one position. */
const SUCCESSION_MOUNT = 'power.succession';

/**
 * The ladder's mount id. PER FACTION — it renders once per roster row, which is still ONE
 * position on the page-set: the row says where a ladder speaks, not how many a town has.
 * Bound once so the reachability arm counts a single literal.
 */
const LADDER_MOUNT = 'power.factionLadder';

/** Ruling structure: the ruling-power word, the economic base, and the body's own title. */
const STRUCTURE_MOUNT = 'power.rulingStructure';

/** Blocs and the divided court. Three draws at one position. */
const BLOCS_MOUNT = 'power.blocs';

/**
 * The politics ledger is keyed by SETTLEMENT id. A settlement carries `id` in every path
 * that has a ledger (the ledger is written per-settlement during play), so this is a plain
 * read with a defensive fallback rather than a derivation.
 * @param {{id?: unknown, _seed?: unknown}|null|undefined} settlement
 */
function saveIdOfSettlement(settlement) {
  return settlement?.id ?? null;
}

/** §815 — one row of the ruling chain: a small uppercase link label + the answer. */
function ChainRow({ label, children }) {
  return (
    <div style={{display:'flex',alignItems:'baseline',gap:10}}>
      <span style={{fontSize:FS.micro,fontWeight:800,color:swatch.inkMag3,flex:'0 0 72px'}}>{label}</span>
      <span style={{fontSize:FS.sm,color:swatch.inkMag,lineHeight:1.5,minWidth:0}}>{children}</span>
    </div>
  );
}

/** §815 — the full RULING CHAIN: power → faction → named NPC, three legible
 *  rows of one answer ("Who runs this place?"), honest absence at each link. */
function RulingChainBlock({ settlement }) {
  const chain = rulingChainOf(settlement);
  if (!chain.power && !chain.faction) return null;
  const missingSeat = chain.absence?.kind === 'missing_seat';
  // A WORD, and named as one. `chain.power.government` is a finite government
  // token ('council', 'monarchy') — but `power` is a FLOAT_TOKEN to the prose-
  // numerics walker, so reading it through the path made a plain word look like
  // an engine scalar reaching reader prose. The walker's own convention for
  // "this is a word" is the suffix; the sibling reads on this row already pass
  // by it (`powerLabel`, `.name`). This one just lacked the declaration.
  const governmentWord = chain.power?.government || '';
  return (
    <div data-testid="ruling-chain" style={{
      background: swatch['#FAF8F4'], border: `1px solid ${swatch['#E0D0B0']}`,
      borderLeft: `4px solid ${missingSeat ? swatch['#8B1A1A'] : swatch['#A0762A']}`,
      padding: '12px 16px', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{...LITERARY_TITLE,color:swatch.inkMag}}>
        Who runs this place?
      </div>
      {chain.power && (
        <ChainRow label="The power">
          <strong>{chain.power.name}</strong>
          {chain.power.powerLabel ? ` (${chain.power.powerLabel.toLowerCase()})` : ''}
          {governmentWord && governmentWord !== chain.power.name
            ? <span style={{color:MUTED}}>{` · rule is carried by ${governmentWord}`}</span> : ''}
        </ChainRow>
      )}
      {chain.faction && (
        <ChainRow label="The faction">
          <strong>{chain.faction.name}</strong>
          {` holds the governing seat`}
          {chain.faction.vacant && <span style={{color:swatch['#8B1A1A'],fontWeight:700}}>{', but the seat itself stands vacant'}</span>}.
        </ChainRow>
      )}
      {chain.npc && (
        <ChainRow label="The seat">
          <strong data-testid="ruling-chain-npc">{chain.npc.name}</strong>
          <span style={{color:MUTED}}>{`, ${chain.npc.role}`}</span>
        </ChainRow>
      )}
      {chain.absence && (
        <ChainRow label="The seat">
          <span data-testid="ruling-chain-absence" style={{color: missingSeat ? swatch['#8B1A1A'] : MUTED, fontStyle:'italic'}}>
            {chain.absence.line}
          </span>
        </ChainRow>
      )}
    </div>
  );
}

export function PowerTab({ powerStructure:r, settlement:s, narrativeNote, publicDossier = false, playerView = false, worldState = null }) {
  const [expandedFaction, setExpandedFaction] = useState(null);

  // Dossier hyperlink focus. When a link navigates to a faction (e.g. from an
  // NPC's affiliation), expand that faction's roster row and scroll it into view.
  // The focused row's ref scrolls itself once mounted, so it lands even on a
  // freshly mounted lazy tab. Keyed on focus `ts` so a repeat click re-fires.
  // Computed from `r` directly (not the destructured `pf` below) so it runs
  // BEFORE the early return and keeps hooks order stable.
  const focusedEntity = useStore(state => state.focusedEntity);
  const focusedRowRef = useRef(null);
  const focusFactionList = r?.factions || [];
  const focusIndex = focusedEntity?.id
    ? focusFactionList.findIndex(f => factionIdFromName(f.faction) === focusedEntity.id)
    : -1;
  useEffect(() => {
    if (focusIndex < 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- expand-on-hyperlink-focus is the intended additive affordance; keyed on `ts` to re-fire on repeat clicks
    setExpandedFaction(focusIndex);
    focusedRowRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, [focusedEntity?.ts, focusIndex]);

  if (!r) return <div style={{padding:32,textAlign:'center',color:MUTED}}>No power structure data.</div>;

  const {
    factions:pf = [],
    stability:m,
    recentConflict:h,
    publicLegitimacy:leg,
    criminalCaptureState:crimCapture,
  } = r;

  const conflicts     = s?.conflicts || [];
  const tensions      = s?.history?.currentTensions || [];

  const isStable   = (m||'').toLowerCase().includes('stable') && !(m||'').toLowerCase().includes('unstable');
  const isCritical = (m||'').toLowerCase().includes('critical') || m?.includes('siege') || m?.includes('Desperate');
  const stabilityColor = isCritical ? '#8b1a1a' : isStable ? '#1a5a28' : '#a0762a';
  const governing  = pf.find(f => f.isGoverning) || pf[0];

  // ── Criminal capture state display ─────────────────────────────────────────
  const CAPTURE = {
    none:        { color:'#1a5a28', bg:'#f0faf4', label:'No organised crime' },
    adversarial: { color:'#4a6a1a', bg:'#f4f8ec', label:'Criminal: Adversarial' },
    equilibrium: { color:'#8a4010', bg:'#fdf6ec', label:'Criminal: Tolerated' },
    corrupted:   { color:'#8b1a1a', bg:'#fdf4f4', label:'Criminal: Corrupted Officials' },
    capture:     { color:'#4a1a4a', bg:'#fdf0fc', label:'Criminal: Governance Captured' },
  };
  const captureStyle = CAPTURE[crimCapture] || CAPTURE.none;

  // THE POWER DESK, read ONCE per render and routed by the mount registry. The seed is the
  // settlement's own stable identity, so THE PROMISE holds: same seed + same state ⇒ same
  // sentence, forever. THE PUBLIC GATE (§885.3, the carve-out the economy desk already
  // holds): a public gallery dossier is a PAID SURFACE, and the `power` tab is NOT filtered
  // off one — only dm_notes/ai_notes are — so without this line the corpus would light on a
  // free/anon visitor's view. The desk is not drawn there and both rungs are null ⇒
  // drawnAtMount answers null at the mount ⇒ no corpus sentence renders. The DATUM is
  // untouched either way: the score, the label, the breakdown chips and the fracture note
  // never read the desk.
  // ⚠ THE AUDIENCE IS LOAD-BEARING, AND OMITTING IT SILENTLY DARKENS AUTHORED CONTENT.
  // All FOUR of DS-POW-6's capture pools are 100% `dm-only` (measured: 3/3 covert variants
  // each). The kernel's law 2 is fail-closed — an unstated audience reads as the PLAYER's —
  // so a desk called without one can never draw them, and the block would ship mounted with
  // four pools no world could reach. The corpus authored them FOR the DM; the DM's own
  // dossier is where they belong, and the player view truncates them to silence rather than
  // to a hint. `publicDossier` still nulls everything before this ever matters.
  const audience = playerView ? 'player' : 'dm';
  // THE CALLER'S OWN DERIVATION, handed to the desk rather than reached for by it: the desk
  // stays a pure display leaf and rulingPowerCoup's 13.9 KB stays out of its import graph.
  // Skipped entirely on a public dossier, where the desk is not drawn at all.
  const contenders = publicDossier ? null : coupContenders(s);
  // Both derivations are the CALLER'S, handed over rather than reached for by the desk.
  const deskReadings = publicDossier ? {} : {
    ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}),
    structuralLens: structuralLensOf(s),
    // DS-POW-7. The DISPLAY projection, never the 61.9 KB kernel module. `includeCovert`
    // honours the projection's own secrets filter — a conspiracy does not enter a player's
    // projection at all — while `includeGroundTruth` hands over the raw end/glue tokens the
    // desk needs to ROUTE. The corpus's own dm-only marks then gate the SENTENCE under
    // kernel law 2, so a player routed to a covert pool gets silence rather than a secret.
    politics: politicsBlocsOf({
      worldState,
      settlementId: s?.id ?? saveIdOfSettlement(s),
      includeGroundTruth: !playerView,
      includeCovert: !playerView,
    }),
  };
  const deskProse = publicDossier
    ? Object.freeze({
      legitimacyBanner: null, legitimacyLens: null, stabilityHeader: null, stabilityLens: null,
      legitimacyReading: null, captureReading: null, operationReading: null,
      successionRisk: null, successionHold: null,
      rulingStructure: null, governingTitle: null,
      blocPresence: null, blocGlue: null, blocEnd: null,
    })
    : powerStateProse(s, deskReadings, { seed: String(s?._seed ?? s?.id ?? ''), audience });
  const drawnBanner = drawnAtMount(LEGITIMACY_MOUNT, deskProse.legitimacyBanner);
  const drawnLens   = drawnAtMount(LEGITIMACY_MOUNT, deskProse.legitimacyLens);
  const drawnStab   = drawnAtMount(STABILITY_MOUNT, deskProse.stabilityHeader);
  const drawnStabLens = drawnAtMount(STABILITY_MOUNT, deskProse.stabilityLens);
  const drawnReading  = drawnAtMount(UNDERSIDE_MOUNT, deskProse.legitimacyReading);
  const drawnCapture  = drawnAtMount(UNDERSIDE_MOUNT, deskProse.captureReading);
  const drawnOperation = drawnAtMount(UNDERSIDE_MOUNT, deskProse.operationReading);
  const undersideLines = [drawnReading, drawnCapture, drawnOperation]
    .map((d) => d?.sentence).filter(Boolean);
  const blocLines = [
    drawnAtMount(BLOCS_MOUNT, deskProse.blocPresence),
    drawnAtMount(BLOCS_MOUNT, deskProse.blocGlue),
    drawnAtMount(BLOCS_MOUNT, deskProse.blocEnd),
  ].map((d) => d?.sentence).filter(Boolean);
  const structureLines = [
    drawnAtMount(STRUCTURE_MOUNT, deskProse.rulingStructure),
    drawnAtMount(STRUCTURE_MOUNT, deskProse.governingTitle),
  ].map((d) => d?.sentence).filter(Boolean);
  const successionLines = [
    drawnAtMount(SUCCESSION_MOUNT, deskProse.successionRisk),
    drawnAtMount(SUCCESSION_MOUNT, deskProse.successionHold),
  ].map((d) => d?.sentence).filter(Boolean);

  return (
    <div style={{paddingBottom:16}}>
      <TabIntro tabKey="power" />
      <NarrativeNote note={narrativeNote} />

      {/* ── §815 — THE RULING CHAIN (the one answer, first) ──────────────── */}
      <RulingChainBlock settlement={s} />

      {/* ── PUBLIC LEGITIMACY BANNER ──────────────────────────────────────── */}
      {leg && (
        <div style={{
          background: leg.bg || '#faf8ec',
          border: `1px solid ${leg.color}40`,
          borderLeft: `4px solid ${leg.color}`,
          padding: '12px 16px', marginBottom: 14,
        }}>
          <div style={{display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap'}}>
            {/* Score + label */}
            <div style={{flexShrink:0}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:leg.color,marginBottom:2}}>
                Public legitimacy
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:8}}>
                <span style={{fontSize: FS['28'],fontWeight:800,color:leg.color,lineHeight:1}}>{leg.score}</span>
                <span style={{fontSize: FS['14'],fontWeight:700,color:leg.color}}>{leg.label}</span>
              </div>
            </div>
            {/* Breakdown chips */}
            <div style={{flex:1,minWidth:180}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:swatch.inkMag3,marginBottom:5}}>
                Score breakdown (base 50)
              </div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {Object.entries(leg.breakdown || {}).map(([k,v]) => (
                  <div key={k} style={{
                    fontSize:FS.xxs, fontWeight:700, padding:'2px 8px',
                    background: v > 0 ? '#f0faf4' : v < 0 ? '#fdf4f4' : '#f5f0e8',
                    color:      v > 0 ? '#1a5a28' : v < 0 ? '#8b1a1a' : '#9c8068',
                    border: `1px solid ${v > 0 ? '#a8d8b0' : v < 0 ? '#e8c0c0' : '#e0d0b0'}`,
                  }}>
                    {k} {v > 0 ? `+${v}` : v}
                  </div>
                ))}
              </div>
              {leg.governanceFractured && (
                <div style={{marginTop:8,background:swatch['#FAF8F4'],border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',padding:'6px 10px',fontSize: FS['11.5'],color:swatch['#5A1A1A'],lineHeight:1.4}}>
                  <strong>Governance fractured.</strong> Real decisions are being made informally. The faction that appears to govern is not the faction that governs.
                </div>
              )}
            </div>

          </div>
          {/* THE CORPUS READING. The ladder line, then the lens line underneath it — two
              pools of DS-POW-1 at ONE position, which is the C3 law rather than an
              exception to it (see dossierMounts.js). Both are routed through the same
              mount, so flipping that row to `glance` silences the pair together instead
              of leaving half a reading on the page. Neither displaces a datum above. */}
          {(drawnBanner?.sentence || drawnLens?.sentence) && (
            <div style={{marginTop:10,borderTop:`1px solid ${leg.color}30`,paddingTop:8}}>
              {/* ⭐ ONE PARAGRAPH, not a ladder line and a lens line stacked (owner finding
                  2026-09-18). This pair was written out by hand rather than mapped, so it
                  reads differently in the source and identically on the page: two `<p>`, two
                  openings on the town's name. It is the same position and the same two rungs;
                  only the arrangement changed. */}
              <ProseBlock lines={[drawnBanner?.sentence, drawnLens?.sentence]}
                settlementName={s?.name} tier={s?.tier}
                style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.65,margin:0,fontStyle:'italic'}}/>
            </div>
          )}
        </div>
      )}

      {/* ── STABILITY + GOVERNING AUTHORITY HEADER ───────────────────────── */}
      <div style={{
        background: isCritical?'#fdf4f4': isStable?'#f0faf4':'#fdf8e8',
        border: `1px solid ${isCritical?'#e8c0c0':isStable?'#a8d8b0':'#e0c860'}`,
        borderLeft: `4px solid ${stabilityColor}`,
        padding:'12px 16px', marginBottom:14,
      }}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,marginBottom:3}}>Stability</div>
            <div style={{fontSize:FS.lg,fontWeight:700,color:stabilityColor,lineHeight:1.3}}>{m}</div>
          </div>
          {governing && <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,marginBottom:3}}>Governing authority</div>
            <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
              <span style={{fontSize: FS['14'],fontWeight:700,color:swatch.inkMag}}>{governing.faction}</span>
              <span style={{fontSize:FS.xs,fontWeight:700,color:stabilityColor}}>
                {governing.powerLabel || ''} ({governing.power})
              </span>
              {governing.modifier && (
                <span style={{fontSize:FS.micro,fontWeight:600,color:swatch['#5A6A1A'],background:swatch['#F0F4E0'],border:'1px solid #c8d890',padding:'0 5px'}}>
                  {governing.modifier}
                </span>
              )}
            </div>
          </div>}
          {/* Criminal capture state badge */}
          {crimCapture && crimCapture !== 'none' && (
            <div style={{flexShrink:0}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:swatch.inkMag3,marginBottom:3}}>Criminal capture</div>
              <span style={{fontSize:FS.xxs,fontWeight:700,color:captureStyle.color,background:captureStyle.bg,border:`1px solid ${captureStyle.color}40`,padding:'2px 8px'}}>
                {captureStyle.label}
              </span>
            </div>
          )}
        </div>
        {h && <p style={{fontSize:FS.sm,color:swatch['#5A3A10'],lineHeight:1.5,margin:'8px 0 0',borderTop:`1px solid ${isCritical?'#e8c0c0':isStable?'#c8e8c8':'#e0c860'}`,paddingTop:8,fontStyle:'italic'}}>{h}</p>}
        {/* DS-POW-2: the stability ladder line, then its lens — two pools of one block at
            ONE position, routed through one mount, exactly as the legitimacy banner above. */}
        {(drawnStab?.sentence || drawnStabLens?.sentence) && (
          <div style={{marginTop:10,borderTop:`1px solid ${stabilityColor}30`,paddingTop:8}}>
            {/* The ladder line and its lens, as one paragraph — the banner above's twin. */}
            <ProseBlock lines={[drawnStab?.sentence, drawnStabLens?.sentence]}
              settlementName={s?.name} tier={s?.tier}
              style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.65,margin:0,fontStyle:'italic'}}/>
          </div>
        )}
      </div>

      {/* ── THE CRIMINAL UNDERSIDE (DS-POW-6) ────────────────────────────────
          The ladder cells the surfaces above do not reach: whether there is a
          legitimacy reading at all, how far criminal capture has gone, and what
          the operation actually does for a living. Three pools of ONE block at
          ONE position, so the registry silences them together. */}
      {undersideLines.length > 0 && (
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #e0c890',borderLeft:'4px solid #4a1a4a',padding:'10px 14px',marginBottom:14}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>The quieter arithmetic</div>
          <ProseBlock lines={undersideLines} settlementName={s?.name} tier={s?.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── BLOCS AND THE DIVIDED COURT (DS-POW-7) ───────────────────────────
          Whether the hall is organized into sides at all, what binds the first
          bloc, and what it is for. Three pools of ONE block at ONE position. The
          politics layer is written during play, so a world that has not been
          played reads the DORMANT line — which is true, not a fallback. */}
      {blocLines.length > 0 && (
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #4a4a7a',padding:'10px 14px',marginBottom:14}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>Sides and combinations</div>
          <ProseBlock lines={blocLines} settlementName={s?.name} tier={s?.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── RULING STRUCTURE (DS-POW-5) ──────────────────────────────────────
          What KIND of power governs, what the town lives on, and what the hall
          calls itself. Three pools of ONE block at ONE position. */}
      {structureLines.length > 0 && (
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #5A6A1A',padding:'10px 14px',marginBottom:14}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>The shape of authority</div>
          <ProseBlock lines={structureLines} settlementName={s?.name} tier={s?.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── RULE AND SUCCESSION (DS-POW-4) ───────────────────────────────────
          The coup-risk ladder, what public legitimacy is doing to the hold, and
          whether the seat has a recorded lineage. Three pools of ONE block at ONE
          position; the registry silences them together. */}
      {successionLines.length > 0 && (
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #a0762a',padding:'10px 14px',marginBottom:14}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>Rule and succession</div>
          <ProseBlock lines={successionLines} settlementName={s?.name} tier={s?.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── THE THREE STRATA (owner order 2026-07-22) ─────────────────────────
          The flat "Power Distribution" list is replaced by three semantically
          distinct strata: THE POWERS (the seat + its contenders, dominant),
          THE FACTIONS (the full roster, lighter), THE WEB (the typed ties
          between them). Derived read-only from the settlement's own data.
          PowerTab keeps the roster expand/focus state so the NPC-faction-link
          focus affordance keeps landing on the right row. */}
      <PowerStrata
        settlement={s}
        powerStructure={r}
        expandedFaction={expandedFaction}
        setExpandedFaction={setExpandedFaction}
        focusIndex={focusIndex}
        focusedRowRef={focusedRowRef}
      />

      {/* ── THE LADDER (intra-faction standings; hidden when the ladder is dark) ──
          Wires the secrets-safe DM read-model (ladderRead / mirrorOf) into its declared
          host. Renders ONLY rung name + normalized standing (0..1) — never nids, covert
          marks, goals, or contest internals (the mirror already withholds those; the
          §13 secrets seam). Absent mirror ⇒ hasLadder false ⇒ section hidden ⇒ a dark
          world renders byte-identically. Lazy chunk (PowerTab is lazy). [game-feel-1] */}
      {hasLadder(s) && (() => {
        const rows = pf
          .map((f, i) => {
            const key = ladderFactionKeyOf(f);
            return { f, i, rungs: ladderRungsOf(s, key), instab: ladderInstabilityOf(s, key) };
          })
          .filter((row) => row.rungs.length > 0);
        if (!rows.length) return null;
        return (
          <Section title="The Ladder" collapsible defaultOpen>
            <div style={{fontSize:FS.xxs,color:MUTED,marginBottom:8,lineHeight:1.4}}>
              Who is rising within each faction: standing on the internal ladder, top rung first.
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {rows.map(({ f, i, rungs, instab }) => {
                const c = FACTION_COLORS[i % FACTION_COLORS.length];
                return (
                  <div key={i}>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                      <div style={{width:9,height:9,background:c,flexShrink:0}}/>
                      <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{f.faction}</span>
                      {instab > 0.05 && (
                        // Churn badge: the explainer rides aria-label (screen-reader-complete,
                        // touch-safe) — never a native title (the shrink-only title= census).
                        <span aria-label="Leadership churn: recent turnover at the top erodes effective power"
                          style={{fontSize:FS.micro,fontWeight:700,color:swatch.danger,background:`${swatch.danger}12`,border:`1px solid ${swatch.danger}40`,padding:'0 5px'}}>
                          unstable {Math.round(instab*100)}%
                        </span>
                      )}
                    </div>
                    {(() => {
                      // DS-POW-3, per faction. The desk takes the canonical readers' OUTPUTS
                      // (this loop already computed them) so it reads no npcLadder shape of
                      // its own. Skipped on a public dossier with the rest of the desk.
                      //
                      // ⛔ AN EMPTY DESK SEED MUST STAY EMPTY THROUGH THE JOIN — the same
                      // guard OverviewTab's crisis banner carries, and for the same reason.
                      // The seed expression admits `''`, and `${''}::${f.faction}` is TRUTHY,
                      // so the kernel's seedless line (`if (!seed) return eligible[0]`, law 4
                      // — canonical-at-zero) would be skipped and the ladder line drawn by a
                      // hash of a bare faction name. Measured on the shipped DS-POW-3 corpus:
                      // 26 of 40 pool x faction-name cells draw a vid other than the canonical
                      // 1 that way. No read moves today — every production path stamps an id,
                      // so the seed is non-empty — so this closes the trap, it does not move
                      // the page.
                      const deskSeed = String(s?._seed ?? s?.id ?? '');
                      const drawn = publicDossier ? null : drawnAtMount(LADDER_MOUNT, powerLadderRung(
                        s,
                        { factionName: f.faction, rungs, instability: instab },
                        { seed: deskSeed ? `${deskSeed}::${f.faction}` : '', audience },
                      ));
                      return drawn?.sentence ? (
                        <p style={{fontSize:FS.xs,color:swatch.inkMag3,lineHeight:1.55,margin:'0 0 5px 15px',fontStyle:'italic'}}>{drawn.sentence}</p>
                      ) : null;
                    })()}
                    <div style={{display:'flex',flexDirection:'column',gap:2}}>
                      {rungs.map((rung, j) => (
                        <div key={rung.npcId} style={{display:'flex',alignItems:'center',gap:8,padding:'1px 0 1px 15px'}}>
                          <span style={{fontSize:FS.micro,color:MUTED,width:14,flexShrink:0,textAlign:'right'}}>{j+1}</span>
                          <span style={{fontSize:FS.xs,fontWeight:j===0?700:600,color:swatch.inkMag2,flex:'0 0 42%',minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{rung.name}</span>
                          <div style={{flex:1,height:6,background:`${c}20`,overflow:'hidden'}}>
                            <div style={{width:`${Math.round(rung.standing*100)}%`,height:'100%',background:c}}/>
                          </div>
                          <span style={{fontSize:FS.micro,color:MUTED,width:28,flexShrink:0,textAlign:'right'}}>{Math.round(rung.standing*100)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        );
      })()}

      {/* ── CURRENT TENSIONS ─────────────────────────────────────────────── */}
      {tensions.length > 0 && (
        <Section title={`Current Tensions (${tensions.length})`} collapsible defaultOpen accent="#b8860b">
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {tensions.map((t,i) => (
              <div key={i} style={{background:swatch['#FDF8E8'],border:'1px solid #e0c860',borderLeft:'3px solid #b8860b',padding:'9px 13px'}}>
                <p style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.5,margin:'0 0 4px'}}>{typeof t==='object'?t.description:t}</p>
                {t.factions?.length > 0 && (
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    {t.factions.map((f,j) => (
                      <span key={j} style={{fontSize:FS.xxs,fontWeight:600,color:swatch['#7A5010'],background:swatch['#F5E8C0'],padding:'0 6px'}}>{f}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── ACTIVE CONFLICTS ─────────────────────────────────────────────── */}
      {conflicts.length > 0 && (
        <Section title={`Active Conflicts (${conflicts.length})`} collapsible defaultOpen accent="#8b1a1a">
          {conflicts.map((c,i) => {
            const iHigh = c.intensity==='high', iLow = c.intensity==='low';
            const intColor = iHigh?'#8b1a1a':iLow?'#1a5a28':'#a0762a';
            const intLabel = iHigh?'High tension':iLow?'Low tension':'Moderate';
            return (
              <div key={i} style={{background:swatch['#FAF8F4'],border:`1px solid ${intColor}40`,borderLeft:`3px solid ${intColor}`,padding:'12px 14px',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                  <span style={{...serif,fontSize: FS['14'],fontWeight:700,color:swatch.inkMag,flex:1}}>{c.parties?.[0]} vs {c.parties?.[1]}</span>
                  <span style={{fontSize:FS.micro,fontWeight:800,color:intColor,background:`${intColor}15`,padding:'2px 6px',letterSpacing:'0.05em',flexShrink:0}}>{intLabel}</span>
                </div>
                {c.issue  && <p style={{fontSize:FS.sm,color:swatch.inkMag3,margin:'0 0 4px'}}><strong>At issue:</strong> {c.issue}</p>}
                {c.stakes && <p style={{fontSize:FS.sm,color:swatch.inkMag3,margin:'0 0 8px'}}><strong>Stakes:</strong> {c.stakes}</p>}
                {c.plotHooks?.length > 0 && (
                  <div style={{borderTop:`1px solid ${intColor}30`,paddingTop:8}}>
                    <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.magic,marginBottom:4}}>Plot hooks</div>
                    {c.plotHooks.map((hook,j) => (
                      <div key={j} style={{display:'flex',gap:6,marginBottom:4}}>
                        <span style={{color:swatch.magic,flexShrink:0,fontSize:FS.sm}}>✦</span>
                        <p style={{fontSize:FS.sm,color:swatch.inkMag,lineHeight:1.45,margin:0}}>{typeof hook==='string'?hook:hook.hook||''}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </Section>
      )}

    </div>
  );
}

export default React.memo(PowerTab);
