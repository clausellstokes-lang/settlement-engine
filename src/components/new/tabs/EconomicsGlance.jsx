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
 * ⚠ CORRECTED 2026-09-05 (DESK-11). This paragraph read "all three positions in this file
 * are GLANCE rungs, so none of them prints a corpus sentence today". It was wrong on both
 * counts and had been since the file landed, which is why it is corrected here rather than
 * quietly reworded: a docblock that undercounts its own draws is the false-report shape,
 * and the next reader would have looked for a fourth position that the docblock said did
 * not exist. The file carries FOUR positions and ONE of them SPEAKS:
 *
 *   `economics.prosperityHeader`  DS-ECO-1   **sentence** — printed at the header, below
 *                                            `situationDesc` (the `header?.sentence` line)
 *   `economics.economyTile`       DS-ECO-8   glance
 *   `economics.foodTile`          DS-ECO-2   glance
 *   `economics.seasonTile`        DS-ECO-2   glance
 *
 * THE THREE TILES ARE GLANCE RUNGS and that is R-DST-A held, not a shortfall: DS-ECO-1
 * already speaks in the header about prosperity, and a second prosperity sentence in a
 * 120px tile would be the page contradicting itself about one fact. A tile is a glance
 * surface by construction — a label, a value, one sub-line — and the sub-line keeps its
 * DATUM (`Output score: n/100`, the lbs/day pair, the season gloss). Lighting a dark door
 * adds; it never displaces a number the reader already had.
 *
 * The tiles nevertheless read `drawn?.sentence` in their map body. That is not dead code
 * and must not be "cleaned up": the depth is the REGISTRY's to decide, so flipping
 * `economics.foodTile` to `sentence` in dossierMounts.js must start that tile speaking
 * with no edit here. Removing the read would put the depth decision back in the component,
 * which is the thing this whole layer exists to take away from it.
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
import { formatCount } from '../../../domain/formatNumber.js';
import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
import ProseBlock from '../ProseBlock.jsx'; // the shared one-paragraph renderer (see DeskLines)
import useIsMobile from '../../../hooks/useIsMobile.js';
import { proseFontSize } from '../../../design/proseScale.js';

/**
 * The prosperity header and the at-a-glance tile row.
 *
 * @param {object} props
 * @param {object} props.eco the economic state (prosperity, economicComplexity, situationDesc)
 * @param {string} props.prosColor
 * @param {string} props.tradeLabel
 * @param {number} props.ecoScore
 * @param {object|null} props.fb the canonical food balance
 * @param {string} props.foodLabel
 * @param {string} props.foodColor
 * @param {object} props.granary the seasonal granary outlook (`seasonTitle` + `detail` are the tile's two parts)
 * @param {string} props.granaryColor
 * @param {object} props.treasury the coin-band glance
 * @param {object|null} [props.headerRung] the DS-ECO-1 rung the desk built
 * @param {object|null} [props.economyRung] the DS-ECO-8 rung the desk built
 * @param {object|null} [props.foodRung] the DS-ECO-2 food rung
 * @param {object|null} [props.seasonRung] the DS-ECO-2 granary rung
 */
export default function EconomicsGlance({
  eco, prosColor, tradeLabel, ecoScore, fb, foodLabel, foodColor,
  granary, granaryColor, treasury,
  headerRung = null, economyRung = null, foodRung = null, seasonRung = null,
}) {
  const mobile = useIsMobile();
  const header = drawnAtMount('economics.prosperityHeader', headerRung);

  return (
    <>
      {/* ── PROSPERITY HEADER ───────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#faf6ec,#f5ede0)',border:'1px solid #d8c090',borderLeft:`4px solid ${prosColor}`,padding:'12px 16px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize: FS['22'],fontWeight:700,color:prosColor,lineHeight:1.1,marginBottom:3}}>{eco.prosperity}</div>
            <div style={{fontSize:FS.sm,color:swatch.inkMag3}}>{eco.economicComplexity}</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'flex-start'}}>
            <div style={{textAlign:'center',background:swatch['#FAF8F4'],border:'1px solid #d8c090',padding:'6px 12px'}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:MUTED,marginBottom:2}}>Trade</div>
              <div style={{fontSize:FS.sm,fontWeight:600,color:swatch.inkMag,textTransform:'capitalize'}}>{tradeLabel}</div>
            </div>
            {ecoScore>0&&<div style={{textAlign:'center',background:swatch['#FAF8F4'],border:'1px solid #d8c090',padding:'6px 12px'}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:MUTED,marginBottom:2}}>Output</div>
              <div style={{fontSize:FS.md,fontWeight:700,color:ecoScore>=60?'#1a5a28':ecoScore>=35?'#a0762a':'#8b1a1a'}}>{ecoScore}/100</div>
            </div>}
          </div>
        </div>
        {eco.situationDesc&&<p style={{fontSize:proseFontSize(FS.md,mobile),color:swatch.inkMag2,lineHeight:1.65,margin:'10px 0 0',borderTop:'1px solid #e0c890',paddingTop:8}}>{eco.situationDesc}</p>}
        {header?.sentence&&<p style={{fontSize:proseFontSize(FS.md,mobile),color:swatch.inkMag2,lineHeight:1.65,margin:'8px 0 0',fontStyle:'italic'}}>{header.sentence}</p>}
      </div>

      {/* ── AT-A-GLANCE TILES ───────────────────────────────────────────── */}
      <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        {[
          {label:'Economy',value:eco.prosperity,sub:ecoScore?`Output score: ${ecoScore}/100`:undefined,color:prosColor,drawn:drawnAtMount('economics.economyTile',economyRung)},
          {label:'Food',value:foodLabel,sub:fb?`${formatCount(fb.dailyProduction)} / ${formatCount(fb.dailyNeed)} lbs/day`:undefined,color:foodColor,drawn:drawnAtMount('economics.foodTile',foodRung)},
          ...(granary.available?[{label:'Season',value:granary.seasonTitle,sub:granary.detail,color:granaryColor,drawn:drawnAtMount('economics.seasonTile',seasonRung)}]:[]), ...(treasury.available?[{label:'Treasury',value:treasury.band,color:treasury.color,drawn:null}]:[]),
        ].map(({label,value,sub,color,drawn})=>(
          <div key={label} style={{flex:'1 1 120px',background:swatch['#FAF8F4'],border:`1px solid ${color}30`,borderTop:`3px solid ${color}`,padding:'8px 10px',minWidth:0}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color,marginBottom:3}}>{label}</div>
            <div style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag,lineHeight:1.2,marginBottom:sub?2:0}}>{value}</div>
            {sub&&<div style={{fontSize:FS.xxs,color:MUTED,lineHeight:1.3}}>{sub}</div>}
            {drawn?.sentence&&<div style={{fontSize:proseFontSize(FS.xxs,mobile),color:swatch.inkMag2,lineHeight:1.4,marginTop:3,fontStyle:'italic'}}>{drawn.sentence}</div>}
          </div>
        ))}
      </div>
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
