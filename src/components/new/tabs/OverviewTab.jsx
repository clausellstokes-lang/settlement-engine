import React, { useState, useMemo } from 'react';
import { stressorsStateProse, crisisBannerRung } from '../../../domain/display/stateProse/stressorsStateProse.js';
// THE GENERAL DESK IS REACHED THROUGH ITS ONE CALLER, never imported here: its blocks live
// on seven tabs and the registry's ARM 2 admits exactly one call site per desk. The reader
// owns the §885.3 public gate and the desk's own primary-stress read.
import { generalDeskLines } from '../generalDeskRead.js';
import { populationTrendBand } from '../../../domain/display/trendLens.js'; // DS-POP-3 · the annex's own named reader
import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
import { deriveAllActiveConditions } from '../../../domain/activeConditions.js';
// FREE: `stressorsCore.js` is already in the first-paint closure, so reaching its canonical
// normalizer costs no additional bytes. Its sibling `stressorDynamics.js` is NOT — that one
// drags 29 modules / 602 KB, which is why the synergy and counterforce lenses stay dark.
import { normalizeStressor } from '../../../domain/worldPulse/stressorsCore.js';
import { FS, swatch, MUTED, GOLD_TINT, GOLD_DEEP, EMPTY_VALUE } from '../../theme.js';
import { Ti, serif, Section } from '../Primitives';
import { LITERARY_TITLE, literaryTitle, statusCase, tokenCase } from '../labelLadder.js';
import { formatCount } from '../../../domain/formatNumber.js';
import {PROSPERITY_COLORS} from '../tabConstants';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
// Wave-2 M2: safety severity delegated to the total chokepoint. deriveFoodBalance
// is NOT re-imported — the walk-lane fold removed the Food Deficit line that used it.
import { safetySeverityOf } from '../../../domain/display/safetySeverity.js';
import { safetyBandOf } from '../../../domain/display/labelBands.js';
import { scoreBand, scoreColor } from '../../../domain/display/defenseScoreBands.js';
import { institutionProvenanceOf } from '../../../domain/provenance/rosterProvenance.js';

import {NarrativeNote} from '../NarrativeNote';
import SteadingsSection from './SteadingsSection.jsx';
import Button from '../../primitives/Button.jsx';
// THE ONE PARAGRAPH RENDERER (owner finding 2026-09-18). Every position below used to map
// its drawn sentences to one `<p>` EACH; ProseBlock weaves them into one paragraph and
// stands the repeated opening name down to the tier noun. The DRAW is unchanged — the lines
// handed over are the same strings `drawnAtMount` ruled on above.
import ProseBlock from '../ProseBlock.jsx';
import { institutionDisplayName } from '../../../domain/display/institutionDisplayName.js';
import { edged } from '../../../design/edgedBox.js';

// ── The institution provenance badge (R-5b item #10) ───────────────────
// The pill used to badge only the GENERATION source tag, so a forge the living
// world grew during an advance and one the DM added by event BOTH rendered with
// the fallback tint and no badge at all — indistinguishable from a building
// nobody had ever touched. The badge now reads the ONE derived provenance record
// (domain/provenance/rosterProvenance.js), which joins the composer's
// *ByEventId stamps and the world-pulse's *ByWorldPulseOutcomeId stamps into a
// single answer to "who put this here". Nothing is persisted: the record is
// derived per render from stamps both lanes already write.
//
// The old map also gave 'forced' an EMPTY glyph, which is falsy at the render
// guard — the legend promised a badge that could never appear. 'forced' means
// the player force-added it at generation, so it now wears the same YOU mark as
// a DM event, and the legend row says "Added by you" once for both.
const PROVENANCE_TONE = { you:'#2d7a44', world:'#2a6b6b', required:'#a0762a', auto:'#2a3a7a', none:'#6b5340' };

function institutionBadge(inst) {
  const { created } = institutionProvenanceOf(inst);
  // A DM realm order (SHIFT_TIER) reaches the roster through the world-pulse
  // apply path, but the hand on it is still the player's.
  if (created.origin === 'dm-event' || created.origin === 'dm-realm-order') {
    return { label:'YOU', color:PROVENANCE_TONE.you, title:'Added by you' };
  }
  if (created.origin === 'world-pulse') {
    return {
      label:'WORLD', color:PROVENANCE_TONE.world,
      title: created.reason ? `Grown by the living world. ${created.reason}` : 'Grown by the living world',
    };
  }
  if (created.sourceTag === 'required') return { label:'REQ', color:PROVENANCE_TONE.required, title:'Historically required' };
  if (created.sourceTag === 'forced') return { label:'YOU', color:PROVENANCE_TONE.you, title:'Added by you' };
  if (created.sourceTag === 'auto-resolved') return { label:'→', color:PROVENANCE_TONE.auto, title:'Auto-resolved dependency' };
  // Unstamped legacy rows stay unbadged rather than being guessed at. Custom
  // rows are skinned gold by the caller's own ✦ branch, which is unchanged.
  return { label:null, color:PROVENANCE_TONE.none, title:undefined };
}

// ── Module-scope helper components ─────────────────────────────────────
// React Hooks plugin v7 flags components defined inside render functions
// because each render creates a new component identity, defeating
// memoization and breaking React Compiler's optimization assumptions.
// Extracting these two (ScoreRow, StatusTag) to module scope resolves
// 9 react-hooks/static-components errors. Both are purely presentational
// and have no closure dependency on OverviewTab state beyond their
// props, so the lift is mechanical.

// R-5b item #20 (stat-bars: BANDS over raw numbers). The value beside each bar
// was a bare 0-100 digit; it is now the score's BAND WORD, read from the shared
// defenseScoreBands ladder — the same word DefenseTab's Threat Assessment badge
// and the PDF readiness rows already print for that same score, so one number
// can no longer read as two verdicts. This mirrors the Food Security row below,
// the sanctioned precedent: label left, band right, bar carries the magnitude.
// The colour ladder moves with it (was a local 70/45/25 twin, now the shared
// 65/40/20 the PDF prints) so the word and the colour can never disagree.
/**
 * ⛔ EVERY ROW HERE BANDS ITS OWN BAR, AND THERE IS NO LONGER AN EXCEPTION (review 10).
 * A `status` prop briefly let one row print a PRESENCE word instead — the Defense tab's
 * "is there an arcane institution" read — beside a bar still drawn from `scores.magical`.
 * That made the sentence above false in the worst possible way: 27 of 144 large settlements
 * printed "None" in amber against a half-full bar, which is not the word and the colour
 * disagreeing but the word and the BAR disagreeing. Two facts wearing one name is a naming
 * problem, and it was cured where it was made — the Defense row now says `Arcane Support`,
 * which is what it reads. This row keeps its name and its own grade.
 * @param {{ label: string, score: number }} props
 */
function ScoreRow({ label, score }) {
  const mobile = useIsMobile();
  const n = Math.min(100, Math.max(0, score || 0));
  const c = scoreColor(n);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
        <span style={{ fontSize: chromeFontSize(FS.xs, mobile), color: swatch.inkMag2, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700, color: c }}>{statusCase(scoreBand(n))}</span>
      </div>
      <div style={{ height: 6, background: swatch['#E8DCC8'], overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${n}%`, background: c, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

function StatusTag({ label, value, _color, accent }) {
  const mobile = useIsMobile();
  return (
    <div style={{ flex: '1 1 130px', background: accent ? `${accent}0d` : '#faf8f4', ...edged(`1px solid ${accent ? `${accent}35` : '#e0d0b0'}`, `3px solid ${accent || '#c8b89a'}`), padding: '7px 10px', minWidth: 0 }}>
      <div style={{ fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 700, color: accent || '#6b5340', marginBottom: 3 }}>{label}</div>
      {/* RUNG 3 CASES ITS OWN VALUE (ODQ §934.22 item 4). The ladder descended the rung-3
        * PILL and left the frozen VOCABULARIES in the case their producers declare them —
        * `safetyProfile.js` writes 'Very Safe', `defenseGenerator.js` writes
        * 'Well-Defended' — so a Title-Case multiword status kept shouting in a quieter
        * register than capitals and neither walker could see it. Cased HERE rather than at
        * the four call sites, so the next StatusTag cannot repeat it. */}
      <div style={{ fontSize: FS.sm, fontWeight: 700, color: swatch.inkMag, lineHeight: 1.3 }}>{statusCase(value) || EMPTY_VALUE}</div>
    </div>
  );
}

/**
 * The two Overview positions the mount registry routes. Bound once each: the reachability
 * arm counts string LITERALS under src/components, and the banner id is drawn once PER
 * CRISIS inside the loop below — still one position on the page-set.
 */
const CRISIS_MOUNT = 'overview.crisisBanners';
const CONDITIONS_MOUNT = 'overview.activeConditions';
const STRESSOR_MOUNT = 'overview.stressorLifecycle';

/**
 * The world stressor this settlement is inside, normalized — or null in a world that has
 * not been played. A world stressor names its settlements in `affectedSettlementIds`, so
 * this is a membership SELECTION, not a derivation; the FIRST match is the one the block's
 * two lenses describe, because the corpus writes one sentence per lens and not a list.
 * @param {{stressors?: unknown}|null|undefined} worldState
 * @param {unknown} settlementId
 */
function worldStressorFor(worldState, settlementId) {
  if (settlementId == null) return null;
  const all = Array.isArray(worldState?.stressors) ? worldState.stressors : [];
  const mine = all.find((s) => {
    const ids = Array.isArray(s?.affectedSettlementIds) ? s.affectedSettlementIds : [];
    return ids.some((id) => String(id) === String(settlementId));
  });
  return mine ? normalizeStressor(mine) : null;
}

export function OverviewTab({ settlement:r, narrativeNote, onNavigateTab, publicDossier = false, playerView = false, worldState = null}) {
  const [instOpen, setInstOpen] = useState(false);
  const mobile = useIsMobile(); // hook must precede the early return (rules-of-hooks)
  // THE STRESS LIST AND THE GENERAL DESK, BOTH LIFTED ABOVE THE EARLY RETURN (rules-of-hooks,
  // the note on `mobile` above). ⭐ WHY THE DESK IS MEMOISED (ARCH §4.1, X-F9, SEAM car 3g):
  // this call composes eleven of the desk's blocks, and from car 3 it composes them THROUGH
  // `composeStateProse` rather than through a single kernel read. The browser-side cost of
  // that is unmeasured and the composed-prose manifest cannot measure it, so the memo is
  // insurance taken before the cost exists rather than after a page feels slow.
  const stresses = (Array.isArray(r?.stress) ? r.stress : r?.stress ? [r.stress] : []).filter(Boolean);
  // ⛔ `stresses` IS DELIBERATELY NOT A DEPENDENCY, AND DELIBERATELY NOT ITSELF A `useMemo`.
  // It is a pure function of `r`, so `r` already covers it and the memo can never be stale.
  // Memoising it instead was tried and MEASURED: `tests/lint/writerReach.walker.test.js`
  // moved — `colour on stress` gained a `web-display=R` the frozen surfaceReach does not
  // carry — because that register attributes a read differently once the expression sits
  // inside a hook callback. Moving a frozen register is not this car's act, and the register
  // is right to notice: the plain const keeps the reach exactly where it was.
  const overviewDesk = useMemo(() => generalDeskLines(r, {
    publicDossier, playerView, stresses, populationTrend: populationTrendBand(r?.populationHistory),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }).overview, [r, publicDossier, playerView]);
  if (!r) return null;

  const eco = r.economicState || {};
  const dp = r.defenseProfile || {};
  const scores = dp.scores || {};
  const via = r.economicViability || {};
  const sp = eco.safetyProfile || {};
  const hist = r.history || {};
  const ra = r.resourceAnalysis || {};
  // THE STRESSOR DESK, read ONCE per render and routed by the mount registry. THE PUBLIC
  // GATE (§885.3): a public gallery dossier is a PAID surface and the `overview` tab is not
  // filtered off one, so the desk is NOT DRAWN there and every rung is null ⇒ drawnAtMount
  // answers null at both mounts. The DATUM is untouched either way — the banner's label,
  // summary and hook never read the desk. The audience follows kernel law 2's fail-closed
  // default: an unstated audience reads as the player's, so it is stated.
  const deskAudience = playerView ? 'player' : 'dm';
  const deskSeed = String(r?._seed ?? r?.id ?? '');
  const stressorProse = publicDossier
    ? Object.freeze({
      crisisArity: null, crisisFraming: null, conditionSeverity: null,
      conditionDirection: null, conditionArchetype: null, conditionProvenance: null,
      conditionDuration: null, worldStressorLifecycle: null, worldStressorOrigin: null,
    })
    : stressorsStateProse(
      r,
      {
        banners: stresses,
        conditions: deriveAllActiveConditions(r),
        // DS-STR-2. The CALLER selects — a world stressor is keyed to the settlement by
        // `affectedSettlementIds`, which is selection rather than classification — and
        // normalizes through the kernel's own `normalizeStressor` so the desk sees the
        // shape the simulation writes. Dark at birth: no generator writes worldState.
        worldStressor: worldStressorFor(worldState, r?.id),
      },
      { seed: deskSeed, audience: deskAudience },
    );
  // ⛔ THE DESK'S `crisisFraming` RUNG IS NOT DRAWN HERE, and it must never be. It is the
  // annex's "ARITY — no banner" line ("There is no crisis on the books…"), which speaks only
  // when `stresses` is EMPTY, and this list renders only inside the ACTIVE CRISIS block below,
  // which exists only when `stresses` is NOT empty. Drawing it here printed "no crisis" under
  // a crisis card on every crisis town (owner order 2026-09-17, "Fix the contradiction").
  const crisisSectionLines = [
    drawnAtMount(CRISIS_MOUNT, stressorProse.crisisArity),
  ].map((d) => d?.sentence).filter(Boolean);
  const stressorLines = [
    drawnAtMount(STRESSOR_MOUNT, stressorProse.worldStressorLifecycle),
    drawnAtMount(STRESSOR_MOUNT, stressorProse.worldStressorOrigin),
  ].map((d) => d?.sentence).filter(Boolean);
  const conditionLines = [
    drawnAtMount(CONDITIONS_MOUNT, stressorProse.conditionSeverity),
    drawnAtMount(CONDITIONS_MOUNT, stressorProse.conditionDirection),
    drawnAtMount(CONDITIONS_MOUNT, stressorProse.conditionArchetype),
    drawnAtMount(CONDITIONS_MOUNT, stressorProse.conditionProvenance),
    drawnAtMount(CONDITIONS_MOUNT, stressorProse.conditionDuration),
  ].map((d) => d?.sentence).filter(Boolean);

  // THE GENERAL DESK, read ONCE per render THROUGH ITS ONE CALLER. The reader holds the
  // §885.3 public gate and every reading the desk needs, because that leaf's blocks land on
  // seven tabs and the registry admits one call site per desk.
  // `healthLines` is deliberately NOT taken: its position glances (owner order 2026-09-17),
  // so it is always empty, and the Systems Health section renders no sentence list.
  const {
    conflictLines, warningLines, originLines, siteLines, situationLine,
    connectionLines, populationLine,
    // DS-POP-3's band is READ HERE and handed over whole: `populationTrendBand` is the
    // annex's own named reader and it imports out of a worldPulse module, so the cost
    // belongs in this lazy tab chunk rather than in a leaf six tabs share.
  } = overviewDesk;

  // Institution layout — guard `r.institutions` because sparse saves
  // (mid-migration, partial gen) can land here without an institutions
  // array. The smoke test in tests/ui/tabs.smoke.test.js caught this.
  const byCategory = (r.institutions || []).reduce((acc,m)=>((acc[m.category]=acc[m.category]||[]).push(m),acc),{});
  const _catOrder = ['government','military','economy','religious','magic','criminal','other'];
  const catColors2 = {government:'#2a3a7a',military:'#8b1a1a',economy:'#a0762a',religious:'#1a5a28',magic:'#5a2a8a',criminal:'#4a1a4a',other:'#5a4a2a',Essential:'#6b5340',Crafts:'#7a4a1a',Infrastructure:'#1a4a5a',Defense:'#8b1a1a',Entertainment:'#7a1a5a',Adventuring:'#1a5a3a'};
  const getCatColor = c => catColors2[c] || '#6b5340';

  // ScoreRow and StatusTag are defined at module scope above. Lifting
  // them out of the render function (was here originally) fixed 9
  // react-hooks/static-components errors and gives React Compiler the
  // identity stability it expects.

  return (
    <div>
      <NarrativeNote note={narrativeNote} />

      {/* ── W-LIFECYCLE: remnant / ancient-ruin banners + the steadings orbit
            (renders NOTHING for a world without lifecycle state). ─────────── */}
      {/* DS-GEN-8 draws inside this section, which owns the steadings ledger read.
          The paid-surface flag is threaded to it rather than assumed there. */}
      <SteadingsSection settlement={r} publicDossier={publicDossier} playerView={playerView} />

      {/* ── IDENTITY + KEY FACTS STRIP ───────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#f5ede0,#ede3cc)',border:'1px solid #c8b89a',padding:'12px 16px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'baseline',gap:10,flexWrap:'wrap',marginBottom:6}}>
          <span style={{...serif,fontSize:FS.xxl,fontWeight:600,color:swatch.inkMag}}>{r.name}</span>
          <span style={{fontSize:FS.md,color:swatch.inkMag3,textTransform:'capitalize'}}>{r.tier}</span>
          <span style={{fontSize:FS.sm,color:MUTED}}>·</span>
          <span style={{fontSize:FS.sm,color:swatch.inkMag3}}>{formatCount(r.population)} pop.</span>
          {r.config?.tradeRouteAccess&&<><span style={{fontSize:FS.sm,color:MUTED}}>·</span><span style={{fontSize:FS.sm,color:swatch.inkMag3,textTransform:'capitalize'}}>{r.config.tradeRouteAccess.replace(/_/g,' ')}</span></>}
          {hist.age&&<><span style={{fontSize:FS.sm,color:MUTED}}>·</span><span style={{fontSize:FS.sm,color:swatch.inkMag3}}>{hist.age} years old</span></>}
        </div>
        {/* DS-POP-3 at `overview.populationDirection` — the direction of the roll read
            against the approach, beside the head count and the access word above. Silent
            until the ring carries two readings, which is what the ring honestly is. */}
        {populationLine&&<p style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch.inkMag2,fontStyle:'italic',margin:'0 0 6px',lineHeight:1.5}}>{populationLine}</p>}
        {/* Row 2: character + spatial */}
        <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
          {hist.historicalCharacter&&<p style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch['#5A3A1A'],fontStyle:'italic',margin:0,flex:'2 1 200px',lineHeight:1.5}}>"{hist.historicalCharacter}"</p>}
          <div style={{display:'flex',gap:8,flex:'1 1 160px',alignItems:'flex-start',flexWrap:'wrap'}}>
            {ra.terrain&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch['#1A4A2A'],background:swatch['#E8F0E8'],border:'1px solid #a8d0a8',padding:'2px 8px',fontWeight:600}}>{ra.terrain}</span>}
            {r.spatialLayout?.layout&&<span style={{fontSize:proseFontSize(FS.xs,mobile),color:swatch.inkMag2,background:swatch['#F0EAD8'],border:'1px solid #d0c090',padding:'2px 8px'}}>{r.spatialLayout.layout}</span>}
          </div>
        </div>
      </div>

      {/* ── THE SITE, THE EXCHANGE AND THE ROSTER ─────────────────────────
            DS-GEN-12 (how the ground disposes the town), DS-GEN-13 (why the
            town's exchange has the shape it has) and DS-GEN-17 (what keeping a
            court, a garrison or nothing at all says about the place). Three
            blocks, three positions, one paragraph: they answer the same
            question — what kind of place is this — at three scales, and the
            page reads them as one thought.
            ⭐ AND IT IS NOW LITERALLY ONE PARAGRAPH (owner finding 2026-09-18). The comment
            above has said "one paragraph" since the position landed while the code rendered
            three, each opening on the town's name. It keeps its place directly under the
            identity strip; only the arrangement changed. */}
      {siteLines.length>0&&(
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #6b5340',padding:'10px 14px',marginBottom:14}}>
          <div style={{...literaryTitle(FS.lg),color:swatch.inkMag,marginBottom:5}}>The ground and the company it keeps</div>
          {/* THE LEAD PARAGRAPH reads one step above the dossier's body prose (FS.lg over
              FS.md), on the phone as well as the desktop. It is the first thing a DM reads —
              it sits second, directly under the identity strip — and at FS.md it was the same
              size as the eleven paragraphs below it, so nothing said "start here". The step
              is passed as the CALL SITE'S style, which is the seam ProseBlock documents:
              the site owns the skin, the renderer owns the weave and the phone floor. That
              floor is a max, so FS.lg survives it and the phone reads 15 where its siblings
              read 14. */}
          <ProseBlock lines={siteLines} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.lg,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── ACTIVE CRISIS (compact if present) ───────────────────────────── */}
      {stresses.length>0&&<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:14}}>
        {stresses.map((v,i)=>(
          <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',background:`${v.colour}0e`,border:`2px solid ${v.colour}`,padding:'10px 14px'}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <span style={{...serif,fontSize:FS.lg,fontWeight:700,color:v.colour}}>{v.label}</span>
                <span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color:swatch.white,background:v.colour,padding:'1px 6px'}}>Active crisis</span>
              </div>
              <p style={{fontSize: proseFontSize(FS['12.5'],mobile),color:swatch.inkMag,lineHeight:1.5,margin:'0 0 4px'}}>{v.summary}</p>
              <p style={{fontSize:proseFontSize(FS.xs,mobile),color:swatch['#3A2A10'],fontStyle:'italic',margin:0}}><span style={{fontWeight:700,fontStyle:'normal',color:v.colour}}>Hook: </span>{v.crisisHook}</p>
              {(() => {
                // DS-STR-1, per banner. The desk keys on v.type — the stable machine
                // identity — never on the label, because two of the fifteen labels differ
                // from their pool key and a label route would darken them silently.
                //
                // ⛔ AN EMPTY DESK SEED MUST STAY EMPTY THROUGH THE JOIN (the promise's own
                // degenerate case). `deskSeed` is written `String(r?._seed ?? r?.id ?? '')`,
                // so it ADMITS the empty string; a bare `${deskSeed}::${v.type}` then hands
                // the kernel `"::famine"`, which is TRUTHY, so `drawVariant`'s seedless line
                // (`if (!seed) return eligible[0]`, kernel law 4 — canonical-at-zero) never
                // runs and the banner is drawn by a hash of a literal. Measured on the shipped
                // corpus: 26 of the 30 type x audience cells draw a vid other than the
                // canonical 1 that way. The guard is the estate's own spelling of this —
                // `marketPrices.js` crierLineFor and `settlementRumors.js` both write
                // `seed ? hash(`${seed}::${tag}`) : pool[0]` for exactly this reason.
                // ⚠ NO READ MOVES TODAY, and that is measured rather than assumed: every
                // production path stamps an id (`normalizeSettlement` mints one from `_seed`
                // or from content), so `deskSeed` is non-empty even on a gallery import, whose
                // `_seed` IS nulled. This closes the trap, it does not move the page.
                const drawn = publicDossier ? null : drawnAtMount(CRISIS_MOUNT, crisisBannerRung(
                  r, v, { seed: deskSeed ? `${deskSeed}::${v.type}` : '', audience: deskAudience },
                ));
                return drawn?.sentence ? (
                  <p style={{fontSize: proseFontSize(FS['12.5'],mobile),color:swatch.inkMag2,lineHeight:1.55,margin:'6px 0 0',fontStyle:'italic'}}>{drawn.sentence}</p>
                ) : null;
              })()}
            </div>
          </div>
        ))}
        {crisisSectionLines.length>0&&(
          <div style={{borderTop:'1px solid #e0c890',paddingTop:8}}>
            <ProseBlock lines={crisisSectionLines} settlementName={r.name} tier={r.tier}
              style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
          </div>
        )}
      </div>}

      {/* ── THE WORLD STRESSOR (DS-STR-2) ────────────────────────────────
          Where a regional stressor sits in its lifecycle, and what put it there.
          Two pools of ONE block at ONE position. Dark until the world is played:
          worldState.stressors is written by the pulse, never by generation. */}
      {stressorLines.length>0&&(
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #8b1a1a',padding:'10px 14px',marginBottom:14}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>The pressure from outside</div>
          <ProseBlock lines={stressorLines} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── ACTIVE CONDITIONS (DS-CND-1) ──────────────────────────────────
          Five lenses over the settlement's first active condition: how bad, which
          way it is moving, what kind it is, whether an event put it there, and
          whether it is running out. Five pools of ONE block at ONE position. */}
      {conditionLines.length>0&&(
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #7a4a1a',padding:'10px 14px',marginBottom:14}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>What the town is living through</div>
          <ProseBlock lines={conditionLines} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── SYSTEMS HEALTH DASHBOARD ─────────────────────────────────────── */}
      <Section title="Systems Health" collapsible defaultOpen accent="#3d2b1a">

        {/* First-survey framing (G5 / FROZEN_VS_LIVE): the five score bars and
            the Viability + Defense statuses are generation verdicts with no
            pulse writeback; Food Security is the declared-live exception,
            re-graded every tick — same carve-out grammar as DefenseTab's
            Threat Assessment caption (Wave R-0). */}
        <div style={{fontSize:proseFontSize(FS.xxs,mobile),color:MUTED,marginBottom:8,fontStyle:'italic'}}>Score bars and the Viability and Defense statuses are as judged at the first survey; Food Security is re-judged as the campaign advances.</div>

        {/* Status tags row */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}}>
          <StatusTag label="Prosperity" value={eco.prosperity} accent={PROSPERITY_COLORS[eco.prosperity]}/>
          <StatusTag label="Safety" value={safetyBandOf(sp.safetyLabel) ?? sp.safetyLabel} accent={safetySeverityOf(sp.safetyLabel).color}/>
          <StatusTag label="Viability" value={via.viable===false?'Not Viable':via.viable===true?'Viable':EMPTY_VALUE} accent={via.viable===false?'#8b1a1a':via.viable===true?'#1a5a28':undefined}/>
          <StatusTag label="Defense" value={dp.readiness?.label} accent={dp.readiness?.color}/>
        </div>

        {/* Magic dependency badge */}
        {dp.magicDependency&&<div style={{display:'flex',alignItems:'center',gap:6,
          background:swatch['#F8F0FF'],border:'1px solid #c0a0e0',
          padding:'5px 10px',marginTop:6}}>
          <span style={{fontSize:FS.sm,color:swatch.magic}}>✦</span>
          <span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:600,color:swatch.magic}}>Magic Dependency</span>
          <span style={{fontSize:proseFontSize(FS.xxs,mobile),color:swatch['#7A4AAA'],flex:1}}>Resilience relies on magical infrastructure. See Viability tab.</span>
        </div>}

        {/* Score bars — 2-col grid */}
        <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:'0 24px'}}>
          <ScoreRow label="Military Might" score={scores.military}/>
          <ScoreRow label="Monster Defense" score={scores.monster}/>
          <ScoreRow label="Internal Security" score={scores.internal}/>
          <ScoreRow label="Economic Resilience" score={scores.economic}/>
          {/* ⛔ THIS ROW IS THE WORLD'S MAGIC AS THE ENGINE SCORES IT, AND THAT IS A
              DIFFERENT FACT FROM THE DEFENSE TAB'S ARCANE SUPPORT ROW. `scores.magical`
              is driven by the world magic slider over a wide presence read, so a town with
              no arcane institution can still score 49; the Defense row asks the narrow
              question "is there a wizard, mage, alchemist or arcane academy here" and
              answers None. For one landing the two rows shared the name `Magical
              Capability` and this one borrowed the other's WORD, which put "None" in amber
              beside a half-full bar on 27 of 144 large settlements. Two facts now carry two
              names, and this row grades its own bar like every sibling above it. */}
          <ScoreRow label="Magical Capability" score={scores.magical}/>
          {/* Owner order (2026-07-22): the Enforcement Ratio (a raw safetyRatio
              float) is replaced by Food Security — a typed band from the food
              generator (economicState.foodSecurity.label / .color), the same
              banded-label grammar the sibling Safety / Defense StatusTags use. The
              bar tracks the derived 0-100 resilienceScore; the VALUE shown is the
              band label, never a bare number (FINITE-SEMANTICS). safetyRatio stays
              a live derivation — it is only its display here that is retired. */}
          {eco.foodSecurity?.label&&<div style={{marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:3}}>
              <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.inkMag2,fontWeight:600}}>Food Security</span>
              <span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:eco.foodSecurity.color||swatch.inkMag2}}>{eco.foodSecurity.label}</span>
            </div>
            <div style={{height:6,background:swatch['#E8DCC8'],overflow:'hidden'}}>
              <div style={{height:'100%',width:`${Math.min(100,Math.max(0,eco.foodSecurity.resilienceScore||0))}%`,background:eco.foodSecurity.color||swatch.inkMag2}}/>
            </div>
          </div>}
        </div>

        {/* Owner order (2026-07-22): the standalone Food Deficit callout is
            removed — Food Security (above) now carries that signal, so the deficit
            line was a duplicate. */}

        {/* ⛔ NO SENTENCE LIST UNDER THE BARS (owner order 2026-09-17). DS-GEN-3's ten
            lenses used to stack here, one sentence per tag and bar. The owner ruled the
            stack out; the chair ruled removal over picking one. The registry row
            `overview.systemsHealth` now GLANCES, so the reader draws no sentence, and this
            section renders its tags, bars and band words only. The sentences are to be
            re-homed later, one by one, through the mount registry. Pinned in the DOM by
            tests/ui/generalDeskTabFlow.test.js. */}
      </Section>

      {/* ── CURRENT TENSIONS & CONFLICTS ─────────────────────────────────── */}
      {(hist.currentTensions?.length>0||(r.conflicts||[]).length>0)&&<Section title="Tensions & Conflicts" collapsible defaultOpen accent="#b8860b">
        {hist.currentTensions?.map((t,i)=>(
          <div key={i} style={{display:'flex',gap:8,marginBottom:6,paddingBottom:6,borderBottom:i<(hist.currentTensions?.length||0)-1||(r.conflicts||[]).length>0?'1px solid #e8d080':'none'}}>
            <span style={{fontSize:FS.sm,flexShrink:0,marginTop:1,color:swatch['#B8860B']}}>▸</span>
            <div>
              <p style={{fontSize:proseFontSize(FS.md,mobile),color:swatch.inkMag2,lineHeight:1.45,margin:0}}>{typeof t==='object'?t.description:t}</p>
              {t.factions?.length>0&&<div style={{display:'flex',gap:4,marginTop:3,flexWrap:'wrap'}}>
                {t.factions.map((f,j)=><span key={j} style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:600,color:swatch['#7A5010'],background:swatch['#F5E8C0'],padding:'0 5px'}}>{f}</span>)}
              </div>}
            </div>
          </div>
        ))}
        {(r.conflicts||[]).map((c,i)=>{
          const iHigh=c.intensity==='high';
          return <div key={i} style={{display:'flex',gap:8,marginBottom:6}}>
            <div>
              <div style={{display:'flex',gap:6,alignItems:'baseline',flexWrap:'wrap'}}>
                <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{c.parties?.[0]} vs {c.parties?.[1]}</span>
                <span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color:iHigh?'#8b1a1a':'#a0762a',background:iHigh?'#fdf0f0':'#faf0dc',border:`1px solid ${iHigh?'#e8c0c0':'#d8c080'}`,padding:'0 4px'}}>{iHigh?'High':'Moderate'}</span>
              </div>
              {c.issue&&<p style={{fontSize:proseFontSize(FS.xs,mobile),color:swatch.inkMag3,margin:'2px 0 0',lineHeight:1.3}}>{c.issue}</p>}
              {/* DS-GEN-2, one line per conflict. The DATUM above is untouched — parties,
                  badge and issue all still carry their own words; this bands the same
                  quarrel in the town's voice beside them. */}
              {conflictLines[i]&&<p style={{fontSize: proseFontSize(FS['12.5'],mobile),color:swatch.inkMag2,lineHeight:1.5,margin:'4px 0 0',fontStyle:'italic'}}>{conflictLines[i]}</p>}
            </div>
          </div>;
        })}
      </Section>}

      {/* ── SITUATION (arrival + pressure — more compact here) ───────────── */}
      {(r.arrivalScene||r.pressureSentence)&&<div style={{background:swatch.inkMag,padding:'12px 16px',marginBottom:14,border:'1px solid #3a2a10'}}>
        {r.arrivalScene&&<p className="oc-dropcap-prose" style={{...serif,fontSize:proseFontSize(FS.md,mobile),color:swatch['#F0E8D8'],lineHeight:1.7,margin:0,fontStyle:'italic','--oc-dropcap-ink':'var(--oc-field-entry)'}}>{r.arrivalScene}</p>}
        {r.arrivalScene&&r.pressureSentence&&<hr style={{border:'none',borderTop:'1px solid #3a2a10',margin:'8px 0'}}/>}
        {r.pressureSentence&&<p style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch['#D4C4A0'],lineHeight:1.55,margin:0,fontStyle:'italic'}}>{r.pressureSentence}</p>}
        {/* ── DS-GEN-5, the LIVE COMPANION to the frozen scene above ─────────
            R-DST-W4-g: `arrivalScene` is a first-impression artifact composed
            once at generation and never touched here; this is what the approach
            looks like given current standing state, sitting beneath it exactly
            as Food Security sits beneath the frozen bars. Two sentences, two
            lifetimes — overwriting one with the other breaks THE PROMISE. It
            SUPPRESSES itself where a primary stress resolves, because the crisis
            banner's own visitor line is the right companion there. */}
        {situationLine ? (
          <>
            <hr style={{border:'none',borderTop:'1px solid #3a2a10',margin:'8px 0'}}/>
            {/* ONE LENS, so the weave is a no-op here BY CONSTRUCTION (`lines.length <= 1`
                returns the line unchanged) and the position renders character for character
                what it rendered before. It routes anyway so the phone floor reaches it with
                its siblings — one renderer, one rule about a paragraph's smallest size. */}
            <ProseBlock lines={[situationLine]} settlementName={r.name} tier={r.tier}
              style={{fontSize:FS.sm,color:swatch['#D4C4A0'],lineHeight:1.55,margin:0,fontStyle:'italic'}}/>
          </>
        ) : null}
      </div>}

      {/* ── DS-GEN-6 at overview.origin, the route line and the tier overlay ──
          TWO POOLS of one block at ONE position, which is the registry's one written
          exception to the one-fact-one-sentence law: the overlay is composed AFTER the
          route line and never instead of it.
          ⛔ IT SITS ABOVE THE FOLD, AND THAT PLACEMENT IS THE POINT. It was drawn INSIDE
          the Settlement Origin section, which is `collapsible defaultOpen={false}`, and
          `Primitives.jsx:114` renders `{open && children}` — so this position produced NO
          BYTES for any reader on any world, while the reachability arm, the public-dossier
          guard and the registry law were all green over it. The line now FRAMES the fold
          (the DS-HK-1 arrangement) and no longer waits on `r.settlementReason`, so a town
          the generator gave no origin paragraph still hears how it came to be there. The
          visibility arm in dossierMountRegistry.walker.test.js is what keeps it out here. */}
      {originLines.length>0&&(
        <div data-testid="overview-origin-lines" style={{borderLeft:'3px solid #c8b89a',paddingLeft:12,marginBottom:14}}>
          <ProseBlock lines={originLines} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── SETTLEMENT ORIGIN ─────────────────────────────────────────────── */}
      {r.settlementReason&&<Section title="Settlement Origin" collapsible defaultOpen={false} accent="#6b5340">
        <div style={{borderLeft:'3px solid #c8b89a',paddingLeft:12}}>
          {Array.isArray(r.settlementReason)
            ?r.settlementReason.map((line,i)=><p key={i} style={{fontSize:proseFontSize(FS.md,mobile),color:swatch.inkMag2,lineHeight:1.6,margin:'0 0 4px',fontStyle:'italic'}}>{line}</p>)
            :<p style={{fontSize:proseFontSize(FS.md,mobile),color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}>{Ti(r.settlementReason?.primary||r.settlementReason)}</p>
          }
        </div>
      </Section>}

      {/* ── NOTABLE CONNECTION ────────────────────────────────────────────── */}
      {r.prominentRelationship?.phrasing&&<div style={{background:swatch['#F7F0E4'],border:'1px solid #d8c090',borderLeft:'3px solid #6b5340',padding:'9px 13px',marginBottom:14}}>
        <div style={{...literaryTitle(FS.sm),color:swatch.inkMag,marginBottom:4}}>Notable connection</div>
        {/* ── DS-REL-2 (overview.notableConnection) ───────────────────────────
            TWO LENSES AT ONE POSITION: the tie the town names first, and how
            much of its roll this town's own conditions made. The phrasing below
            is the DATUM and keeps its own words; these band what having it
            means. See notableConnectionPoolKey / flagDrivenPoolKey. */}
        <ProseBlock lines={connectionLines} settlementName={r.name} tier={r.tier}
          style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.6,margin:'0 0 5px',fontStyle:'italic'}}/>
        <p style={{fontSize: proseFontSize(FS['12.5'],mobile),...serif,color:swatch['#3A2A10'],lineHeight:1.6,margin:0,fontStyle:'italic'}}>{r.prominentRelationship.phrasing}</p>
        {/* Actionable cross-tab jump — restored from the composite's static text
            reference per THE BASE RECONCILIATION MAP SURFACE 1 (master's real
            navigation control). Falls back to nothing when no navigator is wired. */}
        {onNavigateTab&&<div style={{marginTop:5}}><Button variant="ghost" size="sm" onClick={()=>onNavigateTab('relationships')} style={{padding:'2px 6px'}}>Full relationship web →</Button></div>}
      </div>}

      {/* ── RESOURCE CONTEXT (terrain strengths) ─────────────────────────── */}
      {(ra.terrain||ra.economicStrengths?.length>0||ra.strategicValue)&&<Section title="Geography & Resources" collapsible defaultOpen={false} accent="#1a5a28">
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          {ra.terrain&&<div style={{flex:'1 1 100px'}}>
            <div style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:swatch.success,marginBottom:3}}>Terrain</div>
            <div style={{fontSize:FS.sm,fontWeight:600,color:swatch.inkMag}}>{ra.terrain}</div>
          </div>}
          {ra.economicStrengths?.length>0&&<div style={{flex:'2 1 160px'}}>
            <div style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:swatch.success,marginBottom:3}}>Strengths</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
              {ra.economicStrengths.slice(0,4).map((s,i)=><span key={i} style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.success,background:swatch['#E0F0E0'],padding:'1px 6px'}}>{s}</span>)}
            </div>
          </div>}
          {ra.strategicValue&&<div style={{flex:'2 1 160px'}}>
            <div style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:swatch.success,marginBottom:3}}>Strategic value</div>
            <div style={{fontSize:proseFontSize(FS.xs,mobile),color:swatch.inkMag2,lineHeight:1.4}}>{ra.strategicValue}</div>
          </div>}
        </div>
      </Section>}

      {/* ── SPATIAL LAYOUT ──────────────────────────────────────────────────
          Routed through the shared Section primitive so its header reads at the
          same serif altitude as Systems Health / Tensions / Geography and the
          layer-cake scan has one consistent top-level collapsible level (P6) —
          restored from the composite's bespoke green sub-collapsible per THE
          BASE RECONCILIATION MAP SURFACE 1 (own top-level Section, not folded
          in with Geography). Inner quarter cards keep the composite's craft. */}
      {r.spatialLayout?.quarters?.length>0&&<Section title={`Spatial Layout (${r.spatialLayout.quarters.length} ${r.spatialLayout.quarters.length===1?'quarter':'quarters'})`} collapsible defaultOpen={false} accent="#1a5a28">
        {r.spatialLayout.layout&&<p style={{fontSize:proseFontSize(FS.sm,mobile),fontWeight:600,color:swatch.inkMag2,margin:'0 0 10px'}}>{r.spatialLayout.layout}</p>}
        <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'repeat(auto-fill,minmax(180px,1fr))',gap:8}}>
          {r.spatialLayout.quarters.map((q,i)=>(
            <div key={i} style={{background:swatch['#FAF8F4'],border:'1px solid #d8c8a0',padding:'8px 10px'}}>
              <div style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag,marginBottom:3}}>{q.name}</div>
              <p style={{fontSize:proseFontSize(FS.xs,mobile),color:swatch.inkMag3,lineHeight:1.4,margin:0}}>{q.desc}</p>
              {/* A QUARTER'S LANDMARK IS A RAW CATALOGUE KEY. spatialGenerator fills `landmarks`
                * by filtering `instNames`, so the Religious Quarter's bullet printed 'Parish
                * churches (2-5)' — the very word §934.13's seam exists to keep off a reader's
                * page — while the roster pill eighty lines below already read 'Houses of worship
                * (2-5)'. One settlement, two spellings of one institution, on the same tab. */}
              {q.landmarks?.slice(0,1).map((lm,j)=><p key={j} style={{fontSize:proseFontSize(FS.xxs, mobile),color:MUTED,margin:'3px 0 0'}}>• {institutionDisplayName(lm)}</p>)}
            </div>
          ))}
        </div>
      </Section>}

      {/* ── WARNINGS & COHERENCE NOTES ────────────────────────────────────── */}
      {((r.structuralViolations?.length||0)+(r.coherenceNotes?.length||0)+(r.structuralSuggestions?.length||0)>0)&&<div style={{marginBottom:14}}>
        {r.structuralViolations?.length>0&&<div style={{background:swatch['#FAF8F4'],border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',padding:'10px 14px',marginBottom:8}}>
          <div style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.danger,marginBottom:4}}>Structural Issues · First Survey</div>
          {r.structuralViolations.map((v,i)=><div key={i} style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch['#5A1A1A'],marginBottom:3}}><span style={{fontWeight:700}}>{v.institution||v.group}: </span>{v.reason}</div>)}
        </div>}
        {/* Coherence notes (G5): sole web render site of the generation-frozen
            coherenceNotes record — the header carries the survey vintage. */}
        {r.coherenceNotes?.length>0&&<div style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.inkMag3,marginBottom:4}}>Coherence Notes · First Survey</div>}
        {r.coherenceNotes?.filter(n=>n.severity==='contradiction').map((note,i)=>(
          <div key={i} style={{background:swatch['#FDF4F0'],border:'1px solid #d4a090',borderLeft:'3px solid #8b3a1a',padding:'8px 13px',marginBottom:6,display:'flex',gap:8}}>
            <span style={{fontSize: proseFontSize(FS['12.5'],mobile),color:swatch.inkMag2,lineHeight:1.5}}>{note.note||Ti(note)}</span>
          </div>
        ))}
        {r.coherenceNotes?.filter(n=>n.severity!=='contradiction').map((note,i)=>(
          <div key={i} style={{background:swatch['#F0F4FD'],border:'1px solid #a0b4d4',borderLeft:'3px solid #1a3a8b',padding:'8px 13px',marginBottom:6,display:'flex',gap:8}}>
            <span style={{color:swatch['#1A3A8B'],flexShrink:0}}>ℹ</span>
            <span style={{fontSize: proseFontSize(FS['12.5'],mobile),color:swatch.inkMag2,lineHeight:1.5}}>{note.note||Ti(note)}</span>
          </div>
        ))}
        {/* ── DS-GEN-7, the record disagreeing with itself, in the town's voice ──
            One position, several pools: the violation list, the suggestion list,
            and one line per coherence note. The rows above and below keep their
            own words; this bands what having them MEANS. */}
        {warningLines.length>0&&(
          <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'3px solid #6b5340',padding:'10px 14px',marginBottom:8}}>
            <ProseBlock lines={warningLines} settlementName={r.name} tier={r.tier}
              style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
          </div>
        )}
        {r.structuralSuggestions?.length>0&&<div style={{background:swatch['#F4F6FD'],border:'1px solid #c0cce8',borderLeft:'3px solid #2a3a7a',padding:'10px 14px'}}>
          <div style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.info,marginBottom:4}}>Suggestions · First Survey</div>
          {/* The suggestion reads as two sentences: the reason (period-normalized —
              producers are inconsistent about trailing stops), then the same
              " Consider: …" form the PDF's format.js renders, so the two surfaces
              can never disagree on this copy's shape. The joined-words defect
              ("…incursions.. ConsiderPalisade") lived here — §767.3(b). */}
          {r.structuralSuggestions.map((v,i)=><div key={i} style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch['#1A2A5A'],marginBottom:3}}>{String(v.reason||'').trim().replace(/\.+$/,'')}.{v.suggested?.length>0&&<span style={{color:swatch.inkMag3,fontStyle:'italic'}}>{' '}Consider: {v.suggested.join(', ')}.</span>}</div>)}
        </div>}
      </div>}

      {/* ── INSTITUTIONS ──────────────────────────────────────────────────── */}
      <div style={{border:'1px solid #e0d0b0',overflow:'hidden'}}>
        <button type="button" onClick={()=>setInstOpen(v=>!v)} aria-label={instOpen?'Collapse institutions':'Expand institutions'} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:instOpen?'#f0e8d8':'#f7f0e4',border:'none',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em'}}>Institutions</span>
            <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:MUTED}}>{(r.institutions||[]).length} total</span>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end'}}>
            {/* Top-5 category chips + an honest remainder: the visible chip counts
                must SUM to the "N total" beside them — a bare slice(0,5) shipped a
                page whose own arithmetic disagreed (§767.3(d), the 39-vs-40 gap). */}
            {Object.entries(byCategory).sort((a,b)=>b[1].length-a[1].length).slice(0,5).map(([cat,insts])=>(
              <span key={cat} style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:600,color:getCatColor(cat),background:`${getCatColor(cat)}15`,padding:'1px 5px'}}>{cat} {insts.length}</span>
            ))}
            {(()=>{const rest=Object.entries(byCategory).sort((a,b)=>b[1].length-a[1].length).slice(5).reduce((n,[,insts])=>n+insts.length,0);
              return rest>0?<span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:600,color:MUTED,background:`${MUTED}15`,padding:'1px 5px'}}>+{rest} more</span>:null;})()}
            <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:MUTED,marginLeft:4}}>{instOpen?'▲':'▼'}</span>
          </div>
        </button>
        {instOpen&&<div style={{padding:'10px 14px',borderTop:'1px solid #e0d0b0'}}>
          {/* Visual category distribution bar */}
          <div style={{display:'flex',height:8,overflow:'hidden',gap:1,marginBottom:12}}>
            {Object.entries(byCategory).sort((a,b)=>b[1].length-a[1].length).map(([cat,insts])=>(
              <div key={cat} title={`${cat}: ${insts.length}`} style={{flex:insts.length,background:getCatColor(cat),minWidth:insts.length>0?4:0}}/>
            ))}
          </div>
          {/* Categories with pills */}
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {Object.entries(byCategory).sort((a,b)=>a[0].localeCompare(b[0])).map(([cat,insts])=>{
              const cc=getCatColor(cat);
              return <div key={cat}>
                <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:cc,marginBottom:4}}>{tokenCase(cat)} ({insts.length})</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {/* Sorted by the DISPLAYED label (§934.13): sorting by the raw key would
                      file 'House of worship' under P and the reader would see an
                      alphabetical list that is not alphabetical. Copied before sorting —
                      `byCategory` holds the arrays this render derives from. */}
                  {[...insts].sort((a,b)=>institutionDisplayName(a).localeCompare(institutionDisplayName(b))).map((inst,i)=>{
                    const isCustom = inst.source==='custom' || inst.isCustom===true;
                    const badge = institutionBadge(inst);
                    const base = {fontSize:chromeFontSize(FS.xs, mobile),padding:'2px 8px',color:swatch.inkMag,fontWeight:500,display:'inline-flex',alignItems:'center',gap:4};
                    const skin = isCustom
                      ? {...GOLD_TINT, borderWidth:1, borderStyle:'solid'}   // sparkling-gold custom row
                      : {background:`${badge.color}10`,border:`1px solid ${badge.color}30`};
                    return <span key={i} title={isCustom?'Your custom content':badge.title} style={{...base,...skin}}>
                      {institutionDisplayName(inst)}
                      {isCustom
                        ? <span style={{fontSize:chromeFontSize(FS.nano, mobile),fontWeight:800,color:GOLD_DEEP,letterSpacing:'0.04em'}}>✦</span>
                        : (badge.label&&<span style={{fontSize:chromeFontSize(FS.nano, mobile),fontWeight:800,color:badge.color,letterSpacing:'0.04em'}}>{badge.label}</span>)}
                    </span>;
                  })}
                </div>
              </div>;
            })}
          </div>
          {/* Legend */}
          <div style={{display:'flex',gap:14,marginTop:10,paddingTop:8,borderTop:'1px solid #f0e8d8',fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED,flexWrap:'wrap'}}>
            {[['REQ',PROVENANCE_TONE.required,'Historically required'],['YOU',PROVENANCE_TONE.you,'Added by you'],['→',PROVENANCE_TONE.auto,'Auto-resolved dependency'],['WORLD',PROVENANCE_TONE.world,'Grown by the living world'],['✦',GOLD_DEEP,'custom']].map(([lbl,c,desc])=>(
              <span key={lbl}><span style={{color:c,fontWeight:800}}>{lbl}</span> = {desc}</span>
            ))}
          </div>
        </div>}
      </div>

    </div>
  );
}

export default React.memo(OverviewTab);
