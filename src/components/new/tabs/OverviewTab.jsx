import React, { useMemo } from 'react';
import { crisisHookFor } from '../../../domain/crisis/crisisHooks.js';
import { stressorsStateProse } from '../../../domain/display/stateProse/stressorsStateProse.js';
// THE GENERAL DESK IS REACHED THROUGH ITS ONE CALLER, never imported here: its blocks live
// on seven tabs and the registry's ARM 2 admits exactly one call site per desk. The reader
// owns the §885.3 public gate and the desk's own primary-stress read.
import { generalDeskLines } from '../generalDeskRead.js';
import { populationTrendBand } from '../../../domain/display/trendLens.js'; // DS-POP-3 · the annex's own named reader
import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
import { tierNounFor } from '../../../domain/display/stateProse/weaveBlock.js';
import { deriveAllActiveConditions } from '../../../domain/activeConditions.js';
// FREE: `stressorsCore.js` is already in the first-paint closure, so reaching its canonical
// normalizer costs no additional bytes. Its sibling `stressorDynamics.js` is NOT — that one
// drags 29 modules / 602 KB, which is why the synergy and counterforce lenses stay dark.
import { normalizeStressor } from '../../../domain/worldPulse/stressorsCore.js';
import { FS, swatch, MUTED, EMPTY_VALUE } from '../../theme.js';
import { Ti, serif, Section } from '../Primitives';
import { LITERARY_TITLE, literaryTitle, statusCase } from '../labelLadder.js';
import { formatCount } from '../../../domain/formatNumber.js';
import {PROSPERITY_COLORS} from '../tabConstants';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
// Wave-2 M2: safety severity delegated to the total chokepoint. deriveFoodBalance
// is NOT re-imported — the walk-lane fold removed the Food Deficit line that used it.
import { safetySeverityOf } from '../../../domain/display/safetySeverity.js';
import { safetyBandOf } from '../../../domain/display/labelBands.js';
import { scoreBand, scoreColor } from '../../../domain/display/defenseScoreBands.js';
import { deriveMagicRelianceView, magicRowsGated } from '../../../domain/display/dossierViewModel.js';

import {NarrativeNote} from '../NarrativeNote';
import SteadingsSection from './SteadingsSection.jsx';
import Button from '../../primitives/Button.jsx';
// THE ONE PARAGRAPH RENDERER (owner finding 2026-09-18). Every position below used to map
// its drawn sentences to one `<p>` EACH; ProseBlock weaves them into one paragraph and
// stands the repeated opening name down to the tier noun. The DRAW is unchanged — the lines
// handed over are the same strings `drawnAtMount` ruled on above.
import ProseBlock from '../ProseBlock.jsx';
// The two glance facts the removed DM Summary tab alone carried (X-5 / T1-1).
import { cultureScopeLine, governsLine } from '../../../domain/summary/settlementQuickGuide.js';
import { TONIGHT_COPY } from '../../../domain/summary/tonightSheet.js'; // the trigger opens the one Tonight sheet (TRIM-2 request 4)
// The pointer's label, inline: the crisis page's composer (crisisPage.js :: CRISIS_PAGE_COPY.pointer) is the tab's chunk.
const CRISIS_POINTER = 'Open the Crisis tab';
import { edged } from '../../../design/edgedBox.js';
import { SECTION_HELP } from '../../../copy/sectionHelp.js';
import { FLUSH, FLUSH_STACK } from '../../../design/flush.js';

// The institution provenance badge and its legend moved to InstitutionsTab.jsx with the
// roster itself (owner addendum T1-15, 2026-10-30): that tab is the roster's one home.

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
/**
 * The Systems Health bars, keyed by the `defenseProfile.scores` field each one bands. A list,
 * so the magic gate (`magicRowsGated`) reads every row; the magic row's key names magic.
 * @type {ReadonlyArray<{ key: string, label: string }>}
 */
const SYSTEMS_HEALTH_ROWS = Object.freeze([
  { key: 'monster', label: 'Monster Defense' },
  { key: 'economic', label: 'Economic Resilience' },
  // ⛔ THIS ROW IS THE WORLD'S MAGIC AS THE ENGINE SCORES IT, AND THAT IS A DIFFERENT FACT
  // FROM THE DEFENSE TAB'S ARCANE SUPPORT ROW. `scores.magical` is driven by the world magic
  // slider over a wide presence read, so a town with no arcane institution can still score 49;
  // the Defense row asks the narrow question "is there a wizard, mage, alchemist or arcane
  // academy here" and answers None. For one landing the two rows shared the name `Magical
  // Capability` and this one borrowed the other's WORD, which put "None" in amber beside a
  // half-full bar on 27 of 144 large settlements. Two facts now carry two names, and this row
  // grades its own bar like every sibling above it.
  { key: 'magical', label: 'Magical Capability' },
]);

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

function StatusTag({ label, value, _color, accent, testId }) {
  const mobile = useIsMobile();
  return (
    <div data-testid={testId} style={{ flex: '1 1 130px', background: accent ? `${accent}0d` : '#faf8f4', ...edged(`1px solid ${accent ? `${accent}35` : '#e0d0b0'}`, `3px solid ${accent || '#c8b89a'}`), padding: '7px 10px', minWidth: 0 }}>
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

export function OverviewTab({ settlement:r, narrativeNote, onNavigateTab, onOpenTableView, publicDossier = false, playerView = false, worldState = null}) {
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
  // The Crisis tab is the DM's (OutputContainer registers it off a player or public view): the
  // pointer opens it there, and only there.
  const crisisDoor = !publicDossier && !playerView && typeof onNavigateTab === 'function';

  const eco = r.economicState || {};
  const dp = r.defenseProfile || {};
  const scores = dp.scores || {};
  const magicReliance = deriveMagicRelianceView(r);
  const via = r.economicViability || {};
  const sp = eco.safetyProfile || {};
  const hist = r.history || {};
  const ra = r.resourceAnalysis || {};
  const scopeLine = cultureScopeLine(r);
  const governs = governsLine(r);
  // THE STRESSOR DESK, read ONCE per render and routed by the mount registry. THE PUBLIC
  // GATE (§885.3): a public gallery dossier is a PAID surface and the `overview` tab is not
  // filtered off one, so the desk is NOT DRAWN there and every rung is null ⇒ drawnAtMount
  // answers null at both mounts. The DATUM is untouched either way — the banner's label,
  // summary and hook never read the desk. The audience follows kernel law 2's fail-closed
  // default: an unstated audience reads as the player's, so it is stated.
  const deskAudience = playerView ? 'player' : 'dm';
  // The settlement's own noun, resolved once for both of this tab's desk reads: the corpus
  // writes 'the town' about a settlement of any size, and the desk speaks it (§934.22).
  const deskTierNoun = tierNounFor(r?.tier);
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
      { seed: deskSeed, audience: deskAudience, tierNoun: deskTierNoun },
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
  // ⭐ UNDER A CRISIS THE CONDITION IS THE CRISIS (chair ruling T1-3, rubric R2). Measured on
  // the v2 sample, conditions draw on exactly the 327 crisis towns and the severity lens
  // restates the card's summary, so the card carries ONE condition line: the DIRECTION lens
  // (holding, easing or deteriorating), which is the fact the card lacks. The own block below
  // stays for a played-world condition with no banner beside it (R7).
  const conditionCardLine = drawnAtMount(CONDITIONS_MOUNT, stressorProse.conditionDirection)?.sentence
    || conditionLines[0] || null;
  // THE PRESSURE SENTENCE has one home per page: under a crisis it is the card's last line
  // (who controls the response, T1-3); with no crisis it stands alone in the dark box (T1-7),
  // and it yields when it is the notable connection's phrasing word for word (O-10).
  // X-50 (BOILERPLATE ONCE): it also yields when it tells the same pair's story as the
  // phrasing — the two share a sentence word for word under different openings — so the
  // notable connection, which names the bond, keeps the fact's words.
  const sentenceSet = (text) => new Set(String(text || '').split(/(?<=[.!?])\s+/)
    .map(x => x.trim().replace(/[.!?]+$/, '')).filter(x => x.split(/\s+/).length >= 4));
  const phrasingSentences = sentenceSet(r?.prominentRelationship?.phrasing);
  const pressureShared = [...sentenceSet(r?.pressureSentence)].some(x => phrasingSentences.has(x));
  const pressureLine = r?.pressureSentence && !pressureShared
    && r.pressureSentence !== r?.prominentRelationship?.phrasing
    ? r.pressureSentence : null;

  // THE GENERAL DESK, read ONCE per render THROUGH ITS ONE CALLER. The reader holds the
  // §885.3 public gate and every reading the desk needs, because that leaf's blocks land on
  // seven tabs and the registry admits one call site per desk.
  // `healthLines` is deliberately NOT taken: its position glances (owner order 2026-09-17),
  // so it is always empty, and the Systems Health section renders no sentence list.
  // `conflictLines`, `warningLines` and `connectionLines` are no longer taken (chair rulings
  // T1-6, T1-9, T1-10): their registry rows glance, so the reader draws no sentence there and
  // the rows beside them (conflict rows, warning rows, the phrasing) are the one home.
  // `originLines` and `situationLine` are no longer taken either (T1-8): DS-GEN-6's route
  // line and tier overlay and DS-GEN-5's situation line glance, and "Settlement Origin"
  // (settlementReason, DM-editable) is the one home of why the town is here.
  const {
    siteLines, populationLine,
    // DS-POP-3's band is READ HERE and handed over whole: `populationTrendBand` is the
    // annex's own named reader and it imports out of a worldPulse module, so the cost
    // belongs in this lazy tab chunk rather than in a leaf six tabs share.
  } = overviewDesk;

  // ScoreRow and StatusTag are defined at module scope above. Lifting
  // them out of the render function (was here originally) fixed 9
  // react-hooks/static-components errors and gives React Compiler the
  // identity stability it expects.

  return (
    <div>
      <NarrativeNote note={narrativeNote} />

      {/* ── IDENTITY + KEY FACTS STRIP ───────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#f5ede0,#ede3cc)',border:'1px solid #c8b89a',padding:'12px 16px',...FLUSH}}>
        <div data-testid="overview-identity-row" style={{display:'flex',alignItems:'baseline',gap:10,flexWrap:'wrap',marginBottom:6}}>
          <span style={{...serif,fontSize:FS.xxl,fontWeight:600,color:swatch.inkMag}}>{r.name}</span>
          <span style={{fontSize:FS.md,color:swatch.inkMag3,textTransform:'capitalize'}}>{r.tier}</span>
          {/* THE PHONE FIX (the owner, 2026-11-01, ODQ §934.103): each fact carries its own
              separator inside one unbreakable span, so the row wraps BETWEEN facts and never
              leaves a dangling dot at the end of a line or a fact split across two. */}
          <span data-testid="overview-identity-fact" style={{fontSize:FS.sm,color:swatch.inkMag3,whiteSpace:'nowrap'}}><span style={{color:MUTED}}>· </span>{formatCount(r.population)} pop.</span>
          {r.config?.tradeRouteAccess&&<span data-testid="overview-identity-fact" style={{fontSize:FS.sm,color:swatch.inkMag3,textTransform:'capitalize',whiteSpace:'nowrap'}}><span style={{color:MUTED}}>· </span>{r.config.tradeRouteAccess.replace(/_/g,' ')}</span>}
          {hist.age&&<span data-testid="overview-identity-fact" style={{fontSize:FS.sm,color:swatch.inkMag3,whiteSpace:'nowrap'}}><span style={{color:MUTED}}>· </span>{hist.age} years old</span>}
        </div>
        {/* DS-POP-3 at `overview.populationDirection` — the direction of the roll read
            against the approach, beside the head count and the access word above. Silent
            until the ring carries two readings, which is what the ring honestly is. */}
        {populationLine&&<p style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch.inkMag2,fontStyle:'italic',margin:'0 0 6px',lineHeight:1.5}}>{populationLine}</p>}
        {/* X-5 / T1-1: the culture scope phrase (the strip's one identity sentence) and who
            governs (governing name · stability), the two glance facts the removed DM
            Summary tab alone carried. No historicalCharacter fallback for the first. */}
        {(scopeLine||governs)&&<p data-testid="overview-identity-line" style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch.inkMag2,margin:'0 0 6px',lineHeight:1.5}}>
          {scopeLine}{scopeLine&&governs?' ':''}{governs&&<><span style={{color:MUTED}}>Governed by </span>{governs}</>}
        </p>}
        {/* Row 2: character + terrain. THE SPATIAL LAYOUT IS CUT FROM THIS PAGE (the owner,
            2026-11-01, X-37): the layout line that stood beside the terrain chip, and the
            "Spatial Layout (N quarters)" reference section below, both go. The owner's word:
            it all comes from the plat later and "makes no sense to be there without a visual
            spatial component". `spatialLayout` stays in the record; nothing on this page
            reads it. */}
        <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
          {hist.historicalCharacter&&<p style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch['#5A3A1A'],fontStyle:'italic',margin:0,flex:'2 1 200px',lineHeight:1.5}}>"{hist.historicalCharacter}"</p>}
          <div style={{display:'flex',gap:8,flex:'1 1 160px',alignItems:'flex-start',flexWrap:'wrap'}}>
            {ra.terrain&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch['#1A4A2A'],background:swatch['#E8F0E8'],border:'1px solid #a8d0a8',padding:'2px 8px',fontWeight:600}}>{ra.terrain}</span>}
          </div>
        </div>
        {/* The Table View trigger, moved here from the removed DM Summary tab (X-5): the
            composer it opens stays, so a route to it must too. Router-gated on the flag. */}
        {typeof onOpenTableView==='function'&&<div style={{marginTop:6}}><Button variant="ghost" size="sm" onClick={onOpenTableView} style={{padding:'2px 6px'}}>{TONIGHT_COPY.open}</Button></div>}
      </div>
      {/* THE ROUTING LINE (X-18) IS CUT (the owner, 2026-11-01, X-38): "sentences that are
          meta descriptive such as 'summary holds the glance…' … remove them. We're going to do
          something better." The orientation a reader needs moves to the section headers' own
          marks (the ? pills), never to a sentence about the page. */}
      {/* ── THE PLACE (chair ruling T1-2, 2026-10-30; rubric R5) ──────────
            ONE passage under one title: the arrival scene first (the owner's Voice
            Program scene, §934.88, frozen at generation and printed verbatim), then
            DS-GEN-12 ground, DS-GEN-13 market and DS-GEN-17 roster, each trimmed to
            its first clause by the reader (generalDeskRead.js :: siteClause). This
            block replaces "The ground and the company it keeps" and the arrival
            paragraph of the old dark SITUATION box: two atmospheric passages on one
            page were one too many. The desk lines stay dark on a public dossier
            (§885.3); the arrival scene is the datum and shows for every reader.
            The lead reads at FS.lg, one step above body prose (owner finding
            2026-09-18). Under the block law it is the page's ANSWER, class (1), not
            coupling prose (chair ruling X-25a): it stays directly under the identity strip
            and the routing line, before the crisis card. */}
      {/* THE PLACE ENDS ON THE ARRIVAL SCENE (the owner, 2026-11-09, OWNER-WORDS-DOSSIER item 2: "In
          'the place' the second paragraph seems redundant. The first was amazing."). The woven site
          lines moved below the Systems Health section, under their own heading (TRADE AND THE HOUSES
          below); the ground lens that re-introduced the place glances at its registry row. */}
      {r.arrivalScene&&(
        <div data-testid="overview-place" style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #6b5340',padding:'10px 14px',...FLUSH}}>
          <div style={{...literaryTitle(FS.lg),color:swatch.inkMag,marginBottom:5}}>The place</div>
          <p className="oc-dropcap-prose" data-testid="overview-place-arrival" style={{...serif,fontSize:proseFontSize(FS.lg,mobile),color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}>{r.arrivalScene}</p>
        </div>
      )}

      {/* ── ACTIVE CRISIS: THE ONE-LINE POINTER (docs/DESIGN_CRISIS_TAB.md, ONE HOME) ────────
          The crisis record's page is the Crisis tab; the Overview keeps one line that names the
          crises and opens it. The DM-only tab is absent from a player or public view, so there
          the record's own summary and hook stay here, as before. DS-STR-1's per-banner rung stays
          CUT (T1-3, R2); the condition's direction and the pressure sentence close the block,
          each once. */}
      {stresses.length>0&&<div style={{...FLUSH_STACK,...FLUSH}}>
        <div data-testid="overview-crisis-pointer" style={{background:swatch['#1B1408'],padding:'10px 14px',...FLUSH}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
            <span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color:swatch['#C04040']}}>Active crisis</span>
            <span style={{...serif,fontSize:FS.lg,fontWeight:700,color:swatch['#C04040']}}>{stresses.map(v=>v.label||v.type).filter(Boolean).join(' and ')}</span>
            {crisisDoor&&<Button variant="ghost" size="sm" onClick={()=>onNavigateTab('crisis')} style={{marginLeft:'auto',color:swatch['#C04040'],fontWeight:800}}>{CRISIS_POINTER}</Button>}
          </div>
        </div>
        {/* "Hook:" prints only over a hook (STYLE-RULINGS-2 B10(a)): the public projection strips
            the entry's crisisHook (a hook is DM content), and the label stood over an empty line. */}
        {!crisisDoor&&stresses.map((v,i)=>{ const hook=crisisHookFor(r,v); return (
          <div key={i} style={{border:`2px solid ${v.colour}`,padding:'10px 14px',...FLUSH}}>
            <p style={{fontSize: proseFontSize(FS['12.5'],mobile),color:swatch.inkMag,lineHeight:1.5,margin:hook?'0 0 4px':0}}>{v.summary}</p>
            {hook&&<p style={{fontSize:proseFontSize(FS.xs,mobile),color:swatch['#3A2A10'],fontStyle:'italic',margin:0}}><span style={{fontWeight:700,fontStyle:'normal',color:v.colour}}>Hook: </span>{hook}</p>}
          </div>
        );})}
        {(conditionCardLine||pressureLine)&&<div style={{padding:'0 14px 8px',...FLUSH}}>
          {conditionCardLine&&<p style={{fontSize: proseFontSize(FS['12.5'],mobile),color:swatch.inkMag2,lineHeight:1.55,margin:'6px 0 0',fontStyle:'italic'}}>{conditionCardLine}</p>}
          {pressureLine&&<p data-testid="overview-crisis-pressure" style={{fontSize: proseFontSize(FS['12.5'],mobile),color:swatch.inkMag2,lineHeight:1.55,margin:'6px 0 0'}}>{pressureLine}</p>}
        </div>}
        {crisisSectionLines.length>0&&(
          <div style={{borderTop:'1px solid #e0c890',paddingTop:8}}>
            <ProseBlock lines={crisisSectionLines} settlementName={r.name} tier={r.tier}
              style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
          </div>
        )}
      </div>}

      {/* ── SYSTEMS HEALTH DASHBOARD ─────────────────────────────────────── */}
      {/* THE VINTAGE CAPTION LEFT THIS SECTION (X-38/X-42, the owner, 2026-11-02): the G5
          framing (the five score bars and the Viability + Defense statuses are generation
          verdicts; Food Security is the declared-live exception) is now the second sentence
          of this header's ? pill (copy/sectionHelp.js :: SYSTEMS_HEALTH_VINTAGE), said once
          per page as X-8 asks; the document's Overview chapter prints the same words. */}
      <Section title="Systems Health" collapsible defaultOpen accent="#3d2b1a" help={SECTION_HELP.systemsHealth}>

        {/* Status tags row */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}}>
          <StatusTag label="Prosperity" value={eco.prosperity} accent={PROSPERITY_COLORS[eco.prosperity]}/>
          <StatusTag label="Safety" value={safetyBandOf(sp.safetyLabel) ?? sp.safetyLabel} accent={safetySeverityOf(sp.safetyLabel).color}/>
          <StatusTag label="Viability" value={via.viable===false?'Not Viable':via.viable===true?'Viable':EMPTY_VALUE} accent={via.viable===false?'#8b1a1a':via.viable===true?'#1a5a28':undefined}/>
          <StatusTag label="Defense" value={dp.readiness?.label} accent={dp.readiness?.color}/>
          {/* RELIANCE ON MAGIC — THE ONE READING (lane MAGIC, chair ruling 2, 2026-11-03). A
              "Magic Dependency" badge used to print here on `defenseProfile.magicDependency`, a
              flag the defence generator sets only during a siege, famine or plague, so a city of
              mages read no reliance while its Magic tab read "integral". This tag prints the view
              model's one reading, in the word the Magic tab and Foundations print, and the shared
              magic gate removes it where magic does not work. */}
          {magicRowsGated(r, [{ key: 'magicReliance' }]).map(({ key }) => (
            <StatusTag key={key} testId="overview-magic-reliance" label="Reliance on magic" value={magicReliance.word} accent={swatch.magic}/>
          ))}
        </div>


        {/* Score bars — 2-col grid */}
        <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:'0 24px'}}>
          {/* Military Might and Internal Security are CUT (owner addendum X-13, 2026-10-30;
              X-1, R2): Foundations carries the same reading (Defense readiness r=0.925,
              Law & order r=0.927 against these scores over the v2 sample) and the Defense
              tab's Threat Assessment prints both scores outright. Monster Defense has no
              Foundations row; Economic Resilience (r=0.62 against Economic capacity),
              Magical Capability (r=0.63 against Magical stability) and Food Security
              (r=-0.03) read different facts, so they stay. The four status tags above are
              the page's glance. */}
          {/* ONE PREDICATE, ASKED ONCE (lane MAGIC, chair ruling 1): the bars are a LIST handed
              to the shared magic gate, so the magic row steps aside where magic does not work,
              as the generator's readiness average already does, and a row added here is asked
              too. */}
          {magicRowsGated(r, SYSTEMS_HEALTH_ROWS).map(({ key, label }) => <ScoreRow key={key} label={label} score={scores[key]}/>)}
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
              {/* RUNG 3 AGAIN, at the one status in this section that is NOT a StatusTag
                  (browser pass 3). `foodGenerator` declares 'Import-Dependent' and is right
                  to — the state-prose pools key on the declared spelling — so the case is
                  made here, beside the three tags above that already make it. */}
              <span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:eco.foodSecurity.color||swatch.inkMag2}}>{statusCase(eco.foodSecurity.label)}</span>
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

      {/* ── TRADE AND THE HOUSES (OWNER-WORDS-DOSSIER item 2, 2026-11-09) ──────
            The woven block that followed the arrival scene in THE PLACE, moved here whole: DS-GEN-13
            market, commerce and warehouses, then DS-GEN-17 roster, cathedral and monastery, each
            trimmed to its first clause by the reader (generalDeskRead.js :: siteClause). Its sentences
            have no other home on the page. The heading is proposed for the owner's veto. Dark on a
            public dossier (§885.3), as before. */}
      {siteLines.length>0&&(
        <div data-testid="overview-trade-houses" style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #6b5340',padding:'10px 14px',...FLUSH}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>Trade and the houses</div>
          <ProseBlock lines={siteLines} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── CURRENT TENSIONS & CONFLICTS ─────────────────────────────────── */}
      {(hist.currentTensions?.length>0||(r.conflicts||[]).length>0)&&<Section title="Tensions & Conflicts" collapsible defaultOpen accent="#b8860b" help={SECTION_HELP.tensions}>
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
            </div>
          </div>;
        })}
      </Section>}

      {/* ── PRESSURE (no crisis; T1-7). The arrival scene moved up into THE PLACE (T1-2);
          under a crisis the sentence closes the card (T1-3). DS-GEN-5's situation line is
          CUT (T1-8, R2): it keyed on the same route-to-scene table as the arrival hook and
          contradicted the origin line in 164 of 1000. Its row glances. ── */}
      {stresses.length===0&&pressureLine&&<div style={{background:swatch.inkMag,padding:'12px 16px',border:'1px solid #3a2a10',...FLUSH}}>
        <p style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch['#D4C4A0'],lineHeight:1.55,margin:0,fontStyle:'italic'}}>{pressureLine}</p>
      </div>}

      {/* ── SETTLEMENT ORIGIN ─────────────────────────────────────────────── */}
      {/* WHY IT IS HERE (T1-8): settlementReason is the one home, shown OPEN. DS-GEN-6's
          route line and tier overlay are CUT (R2: the reason already names the route on
          every sampled town, and the overlay restated the strip's tier and population). */}
      {r.settlementReason&&<Section title="Settlement Origin" collapsible defaultOpen accent="#6b5340">
        <div style={{borderLeft:'3px solid #c8b89a',paddingLeft:12}}>
          {Array.isArray(r.settlementReason)
            ?r.settlementReason.map((line,i)=><p key={i} style={{fontSize:proseFontSize(FS.md,mobile),color:swatch.inkMag2,lineHeight:1.6,margin:'0 0 4px',fontStyle:'italic'}}>{line}</p>)
            :<p style={{fontSize:proseFontSize(FS.md,mobile),color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}>{Ti(r.settlementReason?.primary||r.settlementReason)}</p>
          }
        </div>
      </Section>}

      {/* ── NOTABLE CONNECTION ────────────────────────────────────────────── */}
      {r.prominentRelationship?.phrasing&&<div style={{background:swatch['#F7F0E4'],border:'1px solid #d8c090',borderLeft:'3px solid #6b5340',padding:'9px 13px',...FLUSH}}>
        <div style={{...literaryTitle(FS.sm),color:swatch.inkMag,marginBottom:4}}>Notable connection</div>
        {/* DS-REL-2's two lenses are CUT (T1-9, R4/R6): they restated the title. The row
            `overview.notableConnection` glances; the phrasing below is the one home. */}
        <p style={{fontSize: proseFontSize(FS['12.5'],mobile),...serif,color:swatch['#3A2A10'],lineHeight:1.6,margin:0,fontStyle:'italic'}}>{r.prominentRelationship.phrasing}</p>
        {/* Actionable cross-tab jump — restored from the composite's static text
            reference per THE BASE RECONCILIATION MAP SURFACE 1 (master's real
            navigation control). Falls back to nothing when no navigator is wired. */}
        {onNavigateTab&&<div style={{marginTop:5}}><Button variant="ghost" size="sm" onClick={()=>onNavigateTab('relationships')} style={{padding:'2px 6px'}}>Full relationship web →</Button></div>}
      </div>}

      {/* "Geography & Resources" is CUT (T1-10, R2): the strip's chip carries the terrain and
          the Resources tab owns the strengths and the strategic value. */}

      {/* ── WARNINGS & COHERENCE NOTES ────────────────────────────────────── */}
      {/* "Structural Issues" and "Suggestions" are CUT from the DM page (READER-R1, the
          chair's ruling 1): they printed the structural validator's rule text ("X is not
          compatible with port access", "Consider: …") as facts about the place. Both are on
          the Viability tab's staff panel (domain/display/validationOnPage.js ::
          staffValidationRows), elevated viewers only. */}
      {(r.coherenceNotes?.length||0)>0&&<div style={{...FLUSH}}>
        {/* Coherence notes (G5): sole web render site of the generation-frozen
            coherenceNotes record. The survey vintage is said once per page (X-8), by the
            Systems Health label, so this header and its two siblings carry no suffix. */}
        {r.coherenceNotes?.length>0&&<div style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.inkMag3,marginBottom:4}}>Coherence Notes</div>}
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
        {/* DS-GEN-7's lines are CUT (T1-10, R2): the rows above are the record's own words,
            and the row `overview.warnings` glances. */}
      </div>}

      {/* THE SPATIAL LAYOUT SECTION IS CUT (the owner, 2026-11-01, X-37; see Row 2 above):
          "Spatial Layout (N quarters)" and its quarter cards leave the summary page. The plat
          program owns the settlement's space; a text-only quarters list was its shadow. */}

      {/* The Institutions collapsible is CUT (owner addendum T1-15, 2026-10-30; R2): the
          Systems group's Institutions tab lists every house with its services, its
          provenance badge and the legend. */}

      {/* ── W-LIFECYCLE: remnant / ancient-ruin banners + the steadings orbit
            (renders NOTHING for a world without lifecycle state). It reads the active
            campaign's ledger, so it sits with the campaign-only blocks at the foot of the
            page (the block law, X-16 rung 6). ─────────── */}
      {/* DS-GEN-8 draws inside this section, which owns the steadings ledger read.
          The paid-surface flag is threaded to it rather than assumed there. */}
      <SteadingsSection settlement={r} publicDossier={publicDossier} playerView={playerView} />

      {/* ── THE WORLD STRESSOR (DS-STR-2) ────────────────────────────────
          Where a regional stressor sits in its lifecycle, and what put it there.
          Two pools of ONE block at ONE position. Dark until the world is played:
          worldState.stressors is written by the pulse, never by generation; campaign-only,
          so it closes the page with the played-world condition below (X-16 rung 6). */}
      {stressorLines.length>0&&(
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #8b1a1a',padding:'10px 14px',...FLUSH}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>The pressure from outside</div>
          <ProseBlock lines={stressorLines} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

      {/* ── ACTIVE CONDITIONS (DS-CND-1) ──────────────────────────────────
          Five lenses over the settlement's first active condition: how bad, which
          way it is moving, what kind it is, whether an event put it there, and
          whether it is running out. Five pools of ONE block at ONE position. */}
      {stresses.length===0&&conditionLines.length>0&&(
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #7a4a1a',padding:'10px 14px',...FLUSH}}>
          <div style={{...LITERARY_TITLE,color:swatch.inkMag,marginBottom:5}}>What the town is living through</div>
          <ProseBlock lines={conditionLines} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
        </div>
      )}

    </div>
  );
}

export default React.memo(OverviewTab);
