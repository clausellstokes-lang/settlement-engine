/**
 * EconomicsGlance.jsx — THE ECONOMICS TAB'S GLANCE SURFACE, and the first four positions
 * the dossier mount registry actually routes.
 *
 * WHY THIS FILE EXISTS AT ALL. Two reasons, and both are structural rather than tidiness.
 *
 * 1. THE POSITION LAYER NEEDED A HOME. `src/domain/display/stateProse/dossierMounts.js`
 *    shipped empty at birth because "no desk has landed, so no component carries a
 *    position". A position is a property of the PAGE, and this leaf is the page furniture
 *    at the top of the economics tab: the prosperity header and the at-a-glance tiles.
 *    Putting the mount ids here puts them where the layout is.
 *
 * 2. THE SIZE RATCHET. EconomicsTab.jsx sat at EXACTLY 600 effective lines against the
 *    600 components/.jsx layer ceiling — measured with eslint's own Linter, and the file
 *    said so in its own comment. One effective line would have reddened the ratchet, so
 *    the seam was unbuildable until room was made. Room is made the sanctioned way (the
 *    WR-7b pattern: the head keeps its role, the leaf carries the moved body verbatim),
 *    never by raising a frozen number. scripts/.size-baseline.json is untouched, because
 *    EconomicsTab has no entry there and a shrink under a LAYER ceiling owes no
 *    ratchet-down.
 *
 * ── THE ROUTER READ, AND WHY IT IS A REAL DRAW ───────────────────────────────────────
 * Every position below asks `drawnAtMount(id, rung)` what it may show. The COMPONENT DOES
 * NOT DECIDE ITS OWN DEPTH — the registry does. Flip a row from `glance` to `sentence` in
 * dossierMounts.js and the position starts speaking with no edit here; that is the
 * difference between a component that routes and a component that merely names a string.
 * The walker's reachability arm can only see that the literal exists, so the honesty of
 * this file is the thing standing between the registry and a table full of citations that
 * cite nothing.
 *
 * ── THE FOUR POSITIONS, AND WHICH OF THEM SPEAKS ─────────────────────────────────────
 * The file carries FOUR positions and ONE of them SPEAKS:
 *
 *   `economics.prosperityHeader`  DS-ECO-1   **sentence** — THE header paragraph on DM views
 *   `economics.economyTile`       DS-ECO-8   glance (read at the header: the prosperity word
 *                                            is the economy glance since the tile was cut)
 *   `economics.foodTile`          DS-ECO-2   glance (read at the Food Security section in
 *                                            EconomicsTab, the food fact's one home)
 *   `economics.seasonTile`        DS-ECO-2   glance (the Season tile, campaign-only)
 *
 * ⭐ UX CONSOLIDATION 2026-10-30 (RULINGS-T2 T2-1, T2-3, T2-8; RUBRIC R2). ONE prosperity
 * home: the header word, with the Output score printed ONCE on the header chip. The Economy
 * tile restated both (1000/1000 identical) and is cut; the Food tile is cut because the Food
 * Security section is the food fact's home and now opens on every town. The header carries
 * ONE paragraph: DS-ECO-1 REPLACES `situationDesc` where the desk speaks (DM and player
 * views), and `situationDesc` stands where it does not (the public dossier, or a silent
 * corpus) — never both, because the two disagreed on 99 of 1000 towns. The Trade chip stays:
 * `tradeAccess` follows the route on the corrected sample (six values, 1000/1000 matched).
 * Only the Season and Treasury tiles remain, and both are campaign-only facts.
 *
 * ⚠ T2-8 (remove the never-rendering glance `drawn.sentence` read) IS HELD, NOT DONE. The
 * three glance rows are registered in dossierMounts.js, the registry walker's reachability
 * arm demands exactly one site per registered position, and the prose manifest's REFUSAL 2
 * pins the registered count; retiring the rows is a manifest shift, not a UI edit. So each
 * glance position is read once where its surface now lives (economy at the header word,
 * food at the Food Security section, season at its tile), and flipping a row to `sentence`
 * still starts that surface speaking with no edit here. Recorded for the chair.
 *
 * ── THE SECOND EXPORT: `DeskLines`, NOW THE SHARED POSITION RENDERER ─────────────────
 * A position whose rungs are PARAGRAPHS rather than tiles. It reads no economy read-model
 * itself: it is handed rungs and a mount id and asks the registry what it may show, exactly
 * as the tiles above do.
 *
 * ⚠ ITS HOME IS HISTORICAL AND ITS USE IS NO LONGER LOCAL (2026-09-05, DESK-ECON2). It was
 * put in this file because EconomicsTab had ~20 effective lines under its 600-line layer
 * ceiling and a new leaf would have owed the economy read-model census a classification row
 * for nothing. Since the economy desk grew positions on `resources` and `services`, THOSE
 * TABS IMPORT IT FROM HERE. That is a deliberate call, and the alternative was a second new
 * `src/` file (a second lighting-census move and a second classification row) for a
 * twelve-line generic renderer. Nothing about the component is economics-specific; if a
 * later car wants it in a neutral leaf, moving it is a rename and three import lines.
 *
 * IT TAKES A LIST because one position may draw several LENSES of one block — the C3 law
 * is one sentence RUNG per block per page-set, and `power.criminalUnderside` already
 * draws three lenses at one position. Every lens goes through `drawnAtMount` separately,
 * so flipping the row to `glance` silences all of them together rather than some.
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js (reachability + the rungs)
 */
import { FS, swatch, MUTED } from '../../theme.js';
import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
import ProseBlock from '../ProseBlock.jsx'; // the shared one-paragraph renderer (see DeskLines)
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';

/**
 * The prosperity header: the page's one-line answer (the prosperity word) and its chips.
 *
 * ⭐ THE BLOCK LAW SPLIT THE TILE ROW OFF (X-16 rung 6; BUILD-W2-BLOCKLAW U4). The Season and
 * Treasury tiles are campaign-only facts, so they no longer ride under the header: they are
 * `EconomicsCampaignTiles` below, which EconomicsTab mounts last. Both bodies moved verbatim.
 *
 * @param {object} props
 * @param {object} props.eco the economic state (prosperity, economicComplexity, situationDesc)
 * @param {string} props.prosColor
 * @param {string} props.tradeLabel
 * @param {number} props.ecoScore
 * @param {object|null} [props.headerRung] the DS-ECO-1 rung the desk built
 * @param {object|null} [props.economyRung] the DS-ECO-8 rung the desk built
 */
export default function EconomicsGlance({
  eco, prosColor, tradeLabel, ecoScore,
  headerRung = null, economyRung = null,
}) {
  const mobile = useIsMobile();
  const header = drawnAtMount('economics.prosperityHeader', headerRung);
  const economyGlance = drawnAtMount('economics.economyTile', economyRung);
  // ONE paragraph: the desk's sentence where it speaks, the generator's datum where it does not.
  const headerProse = header?.sentence || eco.situationDesc || null;

  return (
    <>
      {/* ── PROSPERITY HEADER ───────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#faf6ec,#f5ede0)',border:'1px solid #d8c090',borderLeft:`4px solid ${prosColor}`,padding:'12px 16px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize: FS['22'],fontWeight:700,color:prosColor,lineHeight:1.1,marginBottom:3}}>{eco.prosperity}</div>
            <div style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch.inkMag3}}>{eco.economicComplexity}</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'flex-start'}}>
            <div style={{textAlign:'center',background:swatch['#FAF8F4'],border:'1px solid #d8c090',padding:'6px 12px'}}>
              <div style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:MUTED,marginBottom:2}}>Trade</div>
              <div style={{fontSize:FS.sm,fontWeight:600,color:swatch.inkMag,textTransform:'capitalize'}}>{tradeLabel}</div>
            </div>
            {ecoScore>0&&<div style={{textAlign:'center',background:swatch['#FAF8F4'],border:'1px solid #d8c090',padding:'6px 12px'}}>
              <div style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:MUTED,marginBottom:2}}>Output</div>
              <div style={{fontSize:FS.md,fontWeight:700,color:ecoScore>=60?'#1a5a28':ecoScore>=35?'#a0762a':'#8b1a1a'}}>{ecoScore}/100</div>
            </div>}
          </div>
        </div>
        {economyGlance?.sentence&&<p style={{fontSize:proseFontSize(FS.sm,mobile),color:swatch.inkMag2,lineHeight:1.5,margin:'6px 0 0',fontStyle:'italic'}}>{economyGlance.sentence}</p>}
        {headerProse&&<p data-testid="economics-header-prose" style={{fontSize:proseFontSize(FS.md,mobile),color:swatch.inkMag2,lineHeight:1.65,margin:'10px 0 0',borderTop:'1px solid #e0c890',paddingTop:8,fontStyle:header?.sentence?'italic':'normal'}}>{headerProse}</p>}
      </div>
    </>
  );
}

/**
 * The at-a-glance tile row: campaign-only facts (Season, Treasury), mounted LAST on the
 * Economics page by the block law (X-16 rung 6). Renders nothing off-campaign.
 *
 * @param {object} props
 * @param {object} props.granary the seasonal granary outlook (`seasonTitle` + `detail` are the tile's two parts)
 * @param {string} props.granaryColor
 * @param {object} props.treasury the coin-band glance
 * @param {object|null} [props.seasonRung] the DS-ECO-2 granary rung
 */
export function EconomicsCampaignTiles({ granary, granaryColor, treasury, seasonRung = null }) {
  const mobile = useIsMobile();
  const season = drawnAtMount('economics.seasonTile', seasonRung);
  const tiles = [
    ...(granary.available ? [{ label: 'Season', value: granary.seasonTitle, sub: granary.detail, color: granaryColor, line: season?.sentence }] : []),
    ...(treasury.available ? [{ label: 'Treasury', value: treasury.band, color: treasury.color }] : []),
  ];

  return (
    <>
      {/* ── AT-A-GLANCE TILES (campaign-only: Season, Treasury) ────────── */}
      {tiles.length>0&&<div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        {tiles.map(({label,value,sub,color,line})=>(
          <div key={label} style={{flex:'1 1 120px',background:swatch['#FAF8F4'],border:`1px solid ${color}30`,borderTop:`3px solid ${color}`,padding:'8px 10px',minWidth:0}}>
            <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color,marginBottom:3}}>{label}</div>
            <div style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag,lineHeight:1.2,marginBottom:sub?2:0}}>{value}</div>
            {sub&&<div style={{fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED,lineHeight:1.3}}>{sub}</div>}
            {line&&<div style={{fontSize:proseFontSize(FS.xxs,mobile),color:swatch.inkMag2,lineHeight:1.4,marginTop:3,fontStyle:'italic'}}>{line}</div>}
          </div>
        ))}
      </div>}
    </>
  );
}

/**
 * One mounted position drawn as prose: every lens the desk built for it, in order, each
 * routed through the registry. Renders NOTHING when the registry says glance, when the
 * corpus was silent, or when the desk was not called at all — which is R-DST-K, and is
 * why there is no empty-state branch here.
 *
 * @param {object} props
 * @param {string} props.mount the position id, as the registry spells it
 * @param {ReadonlyArray<object|null>} props.rungs the lenses, in reading order
 * @param {unknown} [props.settlementName] the town's own name — `settlement.name`. Absent, the
 *   sentences still join into one paragraph and no opening name is stood down.
 * @param {unknown} [props.tier] the town's tier token — `settlement.tier`.
 */
export function DeskLines({ mount, rungs, settlementName, tier }) {
  const lines = (rungs || []).map((rung) => drawnAtMount(mount, rung)?.sentence).filter(Boolean);
  if (lines.length === 0) return null;
  // ⭐ ONE PARAGRAPH, THROUGH THE SHARED RENDERER (owner finding 2026-09-18). Every lens of a
  // position used to be its own `<p>`, keyed on mount + position because two lenses may
  // legitimately draw the SAME line and `key={line}` then collided (ARCH §4.1, SEAM car 3c).
  // That whole class is gone with the list: one paragraph needs no keys, and two identical
  // sentences now simply both appear in it. The `<p>`'s look is unchanged.
  //
  // ⭐ THE TWO NAME PROPS ARE OPTIONAL AND ADDITIVE, which is what let this land after the
  // renderers. They were deferred at the weave's first landing because all four call sites
  // (EconomicsTab, ServicesTab, ResourcesTab, DailyLifeTab) belonged to other lanes; they are
  // threaded now. A caller that omits them still gets the JOIN — one paragraph instead of a
  // column of one-sentence ones — and simply no stand-down, so nothing here can break on a
  // call site that has not caught up.
  return (
    <div style={{margin:'0 0 12px'}}>
      <ProseBlock lines={lines} settlementName={settlementName} tier={tier}
        style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.65,margin:'0 0 6px',fontStyle:'italic'}}/>
    </div>
  );
}
