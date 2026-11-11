import InfoPill from '../../primitives/InfoPill.jsx';
import { SECTION_HELP } from '../../../copy/sectionHelp.js';
import React, { useEffect, useRef, useState } from 'react';
import { FS, MUTED, swatch } from '../../theme.js';
import { Section } from '../Primitives';
import { LITERARY_TITLE, literaryTitle, tokenCase } from '../labelLadder.js';
import { NarrativeNote } from '../NarrativeNote';
import { FACTION_COLORS } from '../tabConstants';
import { useStore } from '../../../store/index.js';
import { factionIdFromName } from '../../../lib/entities.js';
import { hasLadder } from '../../../domain/townMap/ladderRead.js';
import { PowerStrata } from './power/PowerStrata.jsx'; // X-50: one line, so no cited line moves
import { rulingChainOf } from '../../../domain/dossier/powerStrata.js';
import { governingFactionOf } from '../../../domain/rulingPower.js';
// THE POWER DESK IS REACHED THROUGH ITS ONE CALLER (ARM 2), shared with the public prose
// composer (SW-B7b): the reader owns the desk, the ladder rung and the governance paragraph.
import { powerDeskRead, powerDeskReadings, powerLadderRead, powerLadderRowsOf, governanceAccountRead } from '../powerDeskRead.js';
import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
// THE ONE PARAGRAPH RENDERER (owner finding 2026-09-18). The four positions below mapped
// their drawn sentences to one `<p>` EACH; ProseBlock weaves each position into one
// paragraph. The DRAW is unchanged — these are the same strings `drawnAtMount` ruled on.
import ProseBlock from '../ProseBlock.jsx';
import WhoRunsThisTownPanel from './WhoRunsThisTownPanel.jsx';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import { edged } from '../../../design/edgedBox.js';
import { FLUSH } from '../../../design/flush.js';
import { cardHatsOf } from '../../../domain/people/cardPowers.js'; // COHERENCE-POWERS: the seat row names both hats

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
  // THE PHONE PROSE FLOOR — the answer half of the row, which is a sentence. The
  // link label beside it is an eyebrow and keeps its own step.
  const mobile = useIsMobile();
  return (
    <div style={{display:'flex',alignItems:'baseline',gap:10}}>
      <span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color:swatch.inkMag3,flex:'0 0 72px'}}>{label}</span>
      <span style={{fontSize:proseFontSize(FS.sm, mobile),color:swatch.inkMag,lineHeight:1.5,minWidth:0}}>{children}</span>
    </div>
  );
}

/** §815 — the full RULING CHAIN: power → faction → named NPC, three legible
 *  rows of one answer ("Who runs this place?"), honest absence at each link. */
function RulingChainBlock({ settlement }) {
  const mobile = useIsMobile();
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
  // STOP-1 (R7): the governing faction's character word (corruption-riddled, theocratic-aligned,
  // military-dominated ...), which the migration kernel reads. Its one screen home since T2-17
  // cut the "Governing authority" box is this chip on the power line.
  const governingModifier = chain.power ? String(governingFactionOf(settlement)?.modifier || '') : '';
  return (
    <div data-testid="ruling-chain" style={{
      background: swatch['#FAF8F4'], border: `1px solid ${swatch['#E0D0B0']}`,
      borderLeft: `4px solid ${missingSeat ? swatch['#8B1A1A'] : swatch['#A0762A']}`,
      padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6, ...FLUSH,
    }}>
      {/* the title and its ? pill are separate elements, so the pill's sentence never
          joins the title's line (the phone floor reads a line by its element) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{...literaryTitle(FS.sm),color:swatch.inkMag}}>Who runs this place?</span>
        <InfoPill text={SECTION_HELP.rulers} />
      </div>
      {chain.power && (
        <ChainRow label="The power">
          <strong>{chain.power.name}</strong>
          {chain.power.powerLabel ? ` (${chain.power.powerLabel.toLowerCase()})` : ''}
          {governingModifier && (
            <span data-testid="ruling-chain-modifier" style={{marginLeft:6,fontSize:chromeFontSize(FS.micro, mobile),fontWeight:600,color:swatch['#5A6A1A'],background:swatch['#F0F4E0'],border:`1px solid ${swatch['#5A6A1A']}40`,padding:'0 5px'}}>{governingModifier}</span>
          )}
          {governmentWord && governmentWord !== chain.power.name
            ? <span style={{color:MUTED}}>{` · rule is carried by ${governmentWord}`}</span> : ''}
        </ChainRow>
      )}
      {/* T2-17 (R2): the faction row restated the power's own name on 1000/1000 towns; it renders only when
          another faction holds the seat. A vacancy is said ONCE, by the seat row's "Stands empty" (lane RULERS,
          chair ruling b, X-50: every fact said once); its ", but the seat itself stands vacant" clause is gone. */}
      {chain.faction && chain.faction.name !== chain.power?.name && (
        <ChainRow label="Seat held by">
          <strong>{chain.faction.name}</strong>
          {` holds the governing seat`}.
        </ChainRow>
      )}
      {chain.npc && (
        <ChainRow label="The seat">
          <strong data-testid="ruling-chain-npc">{chain.npc.name}</strong>
          <span style={{color:MUTED}}>{`, ${cardHatsOf(chain.npc)}`}</span>
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
  // THE PHONE PROSE FLOOR — the fracture note, the recent-conflict line, the
  // ladder caption and its per-faction sentence, and every tension, issue, stake
  // and hook below. Bound above the `!r` early return so the hook order is
  // stable; the score, the labels, the badges and the faction names keep their
  // own steps.
  const mobile = useIsMobile();

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
    publicLegitimacy:leg,
    criminalCaptureState:crimCapture,
  } = r;


  const isStable   = (m||'').toLowerCase().includes('stable') && !(m||'').toLowerCase().includes('unstable');
  const isCritical = (m||'').toLowerCase().includes('critical') || m?.includes('siege') || m?.includes('Desperate');
  const stabilityColor = isCritical ? '#8b1a1a' : isStable ? '#1a5a28' : '#a0762a';

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
  // free/anon visitor's view. Since B10(a) (SW-B7b) the shared page prints the desk the owner's
  // player view drew, shipped at the save; an unstamped record is SILENT at every mount. The DATUM is
  // untouched either way: the score, the label, the breakdown chips and the fracture note
  // never read the desk.
  // ⚠ THE AUDIENCE IS LOAD-BEARING, AND OMITTING IT SILENTLY DARKENS AUTHORED CONTENT.
  // All FOUR of DS-POW-6's capture pools are 100% `dm-only` (measured: 3/3 covert variants
  // each). The kernel's law 2 is fail-closed — an unstated audience reads as the PLAYER's —
  // so a desk called without one can never draw them, and the block would ship mounted with
  // four pools no world could reach. The corpus authored them FOR the DM; the DM's own
  // dossier is where they belong, and the player view truncates them to silence rather than
  // to a hint. The reader states it (powerDeskRead.js); a shared page reads the shipped desk.
  // Both derivations are the CALLER'S (powerDeskRead.js :: powerDeskReadings, one derivation
  // shared with the public prose composer), handed over rather than reached for by the desk.
  // DS-POW-7's politics is the DISPLAY projection, never the 61.9 KB kernel module:
  // `includeCovert` honours the projection's own secrets filter, `includeGroundTruth` hands over
  // the raw end/glue tokens the desk needs to ROUTE, and the corpus's own dm-only marks then
  // gate the SENTENCE under kernel law 2. Skipped on a shared page, which reads the shipped desk.
  const deskReadings = publicDossier ? {} : powerDeskReadings(s, {
    playerView, worldState, settlementId: s?.id ?? saveIdOfSettlement(s),
  });
  // THE PUBLIC BRANCH (STYLE-RULINGS-2 B10(a), SW-B7b): a shared page prints the desk the
  // owner's player view drew, shipped at the save (`power:desk`); unstamped, SILENT.
  const deskProse = powerDeskRead(s, { publicDossier, playerView, readings: deskReadings });
  // OWNER-WORDS-DOSSIER item 3 (the owner, 2026-11-09: "The governance description itself seemed
  // disconnected and not to our standard"): the DS-POW-1 reading, the DS-POW-2 hall line and the
  // standalone vignette became ONE paragraph read off the record (governanceAccount.js). Both mounts
  // GLANCE at their registry rows, so these draws hand back no sentence; they stay routed (the rows are
  // still mounted, the reachability arm still counts one literal each) and restoring them is that word.
  const drawnBanner = drawnAtMount(LEGITIMACY_MOUNT, deskProse.legitimacyBanner);
  const drawnLens   = drawnAtMount(LEGITIMACY_MOUNT, deskProse.legitimacyLens);
  const drawnStab   = drawnAtMount(STABILITY_MOUNT, deskProse.stabilityHeader);
  const governanceAccount = governanceAccountRead(s, { publicDossier, playerView }); // `power:governance` on a shared page; the player view reads the stripped record (VEIL-FIX R2)
  const drawnReading  = drawnAtMount(UNDERSIDE_MOUNT, deskProse.legitimacyReading);
  const drawnCapture  = drawnAtMount(UNDERSIDE_MOUNT, deskProse.captureReading);
  const drawnOperation = drawnAtMount(UNDERSIDE_MOUNT, deskProse.operationReading);
  // WIRING W3: the GM advisory (DS-POW-6, every variant dm-only) speaks last at the underside.
  const drawnAdvisory = drawnAtMount(UNDERSIDE_MOUNT, deskProse.gmAdvisory);
  const undersideLines = [drawnReading, drawnCapture, drawnOperation, drawnAdvisory]
    .map((d) => d?.sentence).filter(Boolean);
  // T2-18: the DORMANT presence line ("the hall is not organized into sides") is true of every
  // unplayed world and plays nothing, so off-campaign the bloc position is silent (R4).
  const blocsDormant = String(deskProse.blocPresence?.provenance?.poolKey || '').startsWith('layer DORMANT');
  const blocLines = blocsDormant ? [] : [
    drawnAtMount(BLOCS_MOUNT, deskProse.blocPresence),
    drawnAtMount(BLOCS_MOUNT, deskProse.blocGlue),
    drawnAtMount(BLOCS_MOUNT, deskProse.blocEnd),
  ].map((d) => d?.sentence).filter(Boolean);
  const structureLines = [
    drawnAtMount(STRUCTURE_MOUNT, deskProse.rulingStructure),
    // WIRING W3: the structure flag (who actually holds the force), under the ruling power.
    drawnAtMount(STRUCTURE_MOUNT, deskProse.structureFlag),
    // T2-17: the governing-title lens (the hall's NAME, which the ruling chain prints) is cut.
  ].map((d) => d?.sentence).filter(Boolean);
  const successionLines = [
    drawnAtMount(SUCCESSION_MOUNT, deskProse.successionRisk),
    // T2-18: the legitimacy-hold lens is cut; the legitimacy banner owns legitimacy (R2).
  ].map((d) => d?.sentence).filter(Boolean);
  // T2-18: where the coup-risk sentence speaks (DM/player), the ruler's coup-risk chip yields
  // to it; the chip stands on public. The same for the capture chip against DS-POW-6's capture
  // reading: Power owns capture, said once.
  const coupRiskSpoken = !!drawnAtMount(SUCCESSION_MOUNT, deskProse.successionRisk)?.sentence;
  const captureSpoken = !!drawnCapture?.sentence;

  return (
    <div style={{paddingBottom:16}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── §815 — THE RULING CHAIN (the one answer, first) ──────────────── */}
      <RulingChainBlock settlement={s} />

      {/* ── PUBLIC LEGITIMACY BANNER ──────────────────────────────────────── */}
      {leg && (
        <div style={{
          background: leg.bg || '#faf8ec',
          border: `1px solid ${leg.color}40`,
          borderLeft: `4px solid ${leg.color}`,
          padding: '12px 16px', ...FLUSH,
        }}>
          <div style={{display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap'}}>
            {/* Score + label */}
            <div style={{flexShrink:0}}>
              <div style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:leg.color,marginBottom:2}}>
                Public legitimacy
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:8}}>
                <span style={{fontSize: FS['28'],fontWeight:800,color:leg.color,lineHeight:1}}>{leg.score}</span>
                <span style={{fontSize: FS['14'],fontWeight:700,color:leg.color}}>{leg.label}</span>
              </div>
            </div>
            {/* Breakdown chips — THE TRIM (the owner, 2026-11-01, ODQ §934.103; rubric R4): a
                modifier of 0 says nothing, so only the modifiers that moved the score are
                shown, and the heading goes with them when none did. The fracture note below
                keeps its place either way. */}
            <div style={{flex:1,minWidth:180}}>
              {(() => {
                const moved = Object.entries(leg.breakdown || {}).filter(([, v]) => Number(v) !== 0);
                return moved.length > 0 && (<>
              <div style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:swatch.inkMag3,marginBottom:5}}>
                Breakdown
              </div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {moved.map(([k,v]) => (
                  <div key={k} style={{
                    fontSize:chromeFontSize(FS.xxs, mobile), fontWeight:700, padding:'2px 8px',
                    background: v > 0 ? '#f0faf4' : v < 0 ? '#fdf4f4' : '#f5f0e8',
                    color:      v > 0 ? '#1a5a28' : v < 0 ? '#8b1a1a' : '#9c8068',
                    border: `1px solid ${v > 0 ? '#a8d8b0' : v < 0 ? '#e8c0c0' : '#e0d0b0'}`,
                  }}>
                    {tokenCase(k)} {v > 0 ? `+${v}` : v}
                  </div>
                ))}
              </div>
                </>);
              })()}
              {leg.governanceFractured && (
                <div style={{marginTop:8,background:swatch['#FAF8F4'],border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',padding:'6px 10px',fontSize: proseFontSize(FS['11.5'], mobile),color:swatch['#5A1A1A'],lineHeight:1.4}}>
                  <strong>Governance fractured.</strong>
                </div>
              )}
            </div>

          </div>
          {/* THE CORPUS READING. The ladder line, then the lens line underneath it — two
              pools of DS-POW-1 at ONE position, which is the C3 law rather than an
              exception to it (see dossierMounts.js). Both are routed through the same
              mount, so flipping that row to `glance` silences the pair together instead
              of leaving half a reading on the page. Neither displaces a datum above.
              The row GLANCES since OWNER-WORDS-DOSSIER item 3 (2026-11-09): silent here. */}
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
        ...edged(`1px solid ${isCritical?'#e8c0c0':isStable?'#a8d8b0':'#e0c860'}`, `4px solid ${stabilityColor}`),
        padding:'12px 16px', ...FLUSH,
      }}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch.inkMag3,marginBottom:3}}>Stability</div>
            <div style={{fontSize:FS.lg,fontWeight:700,color:stabilityColor,lineHeight:1.3}}>{m}</div>
          </div>
          {/* T2-17: "Governing authority" left this box; the ruling chain above is the one
              answer to who governs and how strongly. */}
          {/* Criminal capture state badge */}
          {crimCapture && crimCapture !== 'none' && !captureSpoken && (
            <div style={{flexShrink:0}}>
              <div style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:swatch.inkMag3,marginBottom:3}}>Criminal capture</div>
              <span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:captureStyle.color,background:captureStyle.bg,border:`1px solid ${captureStyle.color}40`,padding:'2px 8px'}}>
                {captureStyle.label}
              </span>
            </div>
          )}
        </div>
        {/* The standalone vignette (`recentConflict`) left this box at OWNER-WORDS-DOSSIER item 3: it is
            the governance paragraph's fallback below, where the record names no estranged power. */}
        {/* DS-POW-2: the stability ladder line, then its lens — two pools of one block at
            ONE position, routed through one mount, exactly as the legitimacy banner above.
            The row GLANCES since OWNER-WORDS-DOSSIER item 3 (2026-11-09): silent here. */}
        {drawnStab?.sentence && (
          <div style={{marginTop:10,borderTop:`1px solid ${stabilityColor}30`,paddingTop:8}}>
            {/* The ladder line alone: the DS-POW-2 lens was one boilerplate sentence on 991 of
                1000 towns that said only that there had been trouble (T2-18, R4). */}
            <ProseBlock lines={[drawnStab.sentence]}
              settlementName={s?.name} tier={s?.tier}
              style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.65,margin:0,fontStyle:'italic'}}/>
          </div>
        )}
      </div>

      {/* ── GOVERNANCE, IN ONE PARAGRAPH (OWNER-WORDS-DOSSIER item 3, 2026-11-09) ──────────
            The seat by name and title, the legitimacy band with the causes its breakdown names,
            the powers that have broken with the ruler NAMED from the record's relationships, the
            consequence in plain words, and the generator's vignette only where no estranged power is
            named (domain/display/governanceAccount.js). After the figure tiles above, which stay as
            data: the facts before the prose that couples them (X-16). Dark on a public dossier
            (§885.3), as the readings it replaces were. */}
      {governanceAccount?.text && (
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:`4px solid ${stabilityColor}`,padding:'10px 14px',...FLUSH}}>
          <p data-testid="power-governance-account" style={{fontSize:proseFontSize(FS.md, mobile),color:swatch.inkMag2,lineHeight:1.65,margin:0}}>{governanceAccount.text}</p>
        </div>
      )}

      {/* ── THE THREE STRATA (owner order 2026-07-22) ─────────────────────────
          The flat "Power Distribution" list is replaced by three semantically
          distinct strata: THE POWERS (the seat + its contenders, dominant),
          THE FACTIONS (the full roster, lighter), THE WEB (the typed ties
          between them). Derived read-only from the settlement's own data.
          PowerTab keeps the roster expand/focus state so the NPC-faction-link
          focus affordance keeps landing on the right row. The facts come before the prose that
          couples them (the block law, X-16), so the strata precede the desk passages. */}
      <PowerStrata
        settlement={s}
        powerStructure={r}
        expandedFaction={expandedFaction}
        setExpandedFaction={setExpandedFaction}
        focusIndex={focusIndex}
        focusedRowRef={focusedRowRef}
        showCoupChip={!coupRiskSpoken} shownOnTab={[]}
      />

      {/* ── RULING STRUCTURE (DS-POW-5) ──────────────────────────────────────
          What KIND of power governs, what the town lives on, and what the hall
          calls itself. Three pools of ONE block at ONE position. */}
      {structureLines.length > 0 && (
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #5A6A1A',padding:'10px 14px',...FLUSH}}>
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
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #a0762a',padding:'10px 14px',...FLUSH}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>Rule and succession</div>
          <ProseBlock lines={successionLines} settlementName={s?.name} tier={s?.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── THE CRIMINAL UNDERSIDE (DS-POW-6) ────────────────────────────────
          The ladder cells the surfaces above do not reach: whether there is a
          legitimacy reading at all, how far criminal capture has gone, and what
          the operation actually does for a living. Three pools of ONE block at
          ONE position, so the registry silences them together. Its capture pools are all
          dm-only, so it follows the coupling prose (the block law, X-16 rung 4). */}
      {undersideLines.length > 0 && (
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #e0c890',borderLeft:'4px solid #4a1a4a',padding:'10px 14px',...FLUSH}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>Crime and the hall</div>
          <ProseBlock lines={undersideLines} settlementName={s?.name} tier={s?.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── WHO REALLY RUNS THIS TOWN (allegiance design §9, car 3) ─────────────
          The DM's view beneath the criminal underside: the ruling three, who answers to whom,
          the fronts, the hall and the boosts. DM LAYER ONLY — never on a player view or a
          public dossier (the W7 receipt ruling); it names hidden allegiances. */}
      {!publicDossier && !playerView && <WhoRunsThisTownPanel settlement={s} />}

      {/* ── BLOCS AND THE DIVIDED COURT (DS-POW-7) ───────────────────────────
          Whether the hall is organized into sides at all, what binds the first
          bloc, and what it is for. Three pools of ONE block at ONE position. The
          politics layer is written during play, so a world that has not been
          played reads the DORMANT line — which is true, not a fallback. Off-campaign it is
          silent (T2-18), so it sits with the campaign-only blocks at the foot (X-16 rung 6). */}
      {blocLines.length > 0 && (
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #4a4a7a',padding:'10px 14px',...FLUSH}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>Sides and combinations</div>
          <ProseBlock lines={blocLines} settlementName={s?.name} tier={s?.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── THE LADDER (intra-faction standings; hidden when the ladder is dark) ──
          Wires the secrets-safe DM read-model (ladderRead / mirrorOf) into its declared
          host. Renders ONLY rung name + normalized standing (0..1) — never nids, covert
          marks, goals, or contest internals (the mirror already withholds those; the
          §13 secrets seam). Absent mirror ⇒ hasLadder false ⇒ section hidden ⇒ a dark
          world renders byte-identically. Lazy chunk (PowerTab is lazy). [game-feel-1] */}
      {hasLadder(s) && (() => {
        const rows = powerLadderRowsOf(s, pf);
        if (!rows.length) return null;
        return (
          <Section title="The Ladder" collapsible defaultOpen>
            <div style={{fontSize:proseFontSize(FS.xxs, mobile),color:MUTED,marginBottom:8,lineHeight:1.4}}>
              Who is rising within each power: standing on the internal ladder, top rung first.
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
                          style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:swatch.danger,background:`${swatch.danger}12`,border:`1px solid ${swatch.danger}40`,padding:'0 5px'}}>
                          unstable {Math.round(instab*100)}%
                        </span>
                      )}
                    </div>
                    {(() => {
                      // DS-POW-3, per faction. The desk takes the canonical readers' OUTPUTS
                      // (this loop already computed them) so it reads no npcLadder shape of
                      // its own.
                      // ⛔ The empty-seed join guard lives in the reader (powerLadderRead), with
                      // the public branch: a shared page prints the owner's drawn line (`power:ladder`).
                      const drawn = drawnAtMount(LADDER_MOUNT, powerLadderRead(s, {
                        publicDossier, playerView, factionName: f.faction, rungs, instability: instab,
                      }));
                      return drawn?.sentence ? (
                        <p style={{fontSize:proseFontSize(FS.xs, mobile),color:swatch.inkMag3,lineHeight:1.55,margin:'0 0 5px 15px',fontStyle:'italic'}}>{drawn.sentence}</p>
                      ) : null;
                    })()}
                    <div style={{display:'flex',flexDirection:'column',gap:2}}>
                      {rungs.map((rung, j) => (
                        <div key={rung.npcId} style={{display:'flex',alignItems:'center',gap:8,padding:'1px 0 1px 15px'}}>
                          <span style={{fontSize:chromeFontSize(FS.micro, mobile),color:MUTED,width:14,flexShrink:0,textAlign:'right'}}>{j+1}</span>
                          {/* ODQ §934.23 — no clamp on dossier text: an NPC name is generated and has no provable width, so the 42% column wraps it rather than cutting a person's name mid-word. */}
                          <span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:j===0?700:600,color:swatch.inkMag2,flex:'0 0 42%',minWidth:0}}>{rung.name}</span>
                          <div style={{flex:1,height:6,background:`${c}20`,overflow:'hidden'}}>
                            <div style={{width:`${Math.round(rung.standing*100)}%`,height:'100%',background:c}}/>
                          </div>
                          <span style={{fontSize:chromeFontSize(FS.micro, mobile),color:MUTED,width:28,flexShrink:0,textAlign:'right'}}>{Math.round(rung.standing*100)}</span>
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

      {/* Current Tensions and Active Conflicts left this page (T2-19, RULINGS-CROSS X-4):
          History owns tensions, Relationships owns conflicts, the Overview glances at both. */}

    </div>
  );
}

export default React.memo(PowerTab);
