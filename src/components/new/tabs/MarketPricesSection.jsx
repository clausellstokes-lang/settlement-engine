/**
 * MarketPricesSection.jsx — the dossier's MARKET PRICES section (round-21 Wave 7,
 * rebuilt under the PRICE-HEURISTICS LAW, ODQ §776).
 *
 * Extracted as a sibling leaf (the EconomicFlowsSection / dossierLazyTabs idiom)
 * so EconomicsTab.jsx stays under the max-lines ratchet as sections accrue. Pure
 * presentation over the market-movement read-model: how each traded good has
 * MOVED against the settlement's own usual price (the seeded trade profile + the
 * M6a stock bands + the M6d flow drift) — never a coin figure. The coin itself
 * is the DM's to set at the table (§776.1); this section hands them the honest
 * movement to price against. Renders ONLY when `prices.present`.
 *
 * READING ORDER (the legibility law): the crier's one-line glance, then the
 * moved goods each with their spoken movement, then the steady goods folded
 * into a single quiet line — a column of identical "its usual price" rows would
 * bury the movements the section exists to surface.
 */
import { tokenCase } from '../labelLadder.js';
import { FS, swatch, MUTED, GOLD_DEEP } from '../../theme.js';
import { Section } from '../Primitives';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';

// The crier's band → colour: dear = shortage, cheap = surplus, steady =
// adequate. Sourced from the token swatch (exact-value keys) so the section
// reads consistently with the M6d Live Trade Flow band right above it.
const PRICE_TAG_COLOR = {
  dear: swatch['#8B1A1A'],
  steady: swatch['#A0762A'],
  cheap: swatch['#1A5A28'],
};

/** @param {{ id:string,label:string,phrase:string,tag:'dear'|'steady'|'cheap' }} q */
// NOT a component — `TradeColumn` calls it through `.map`, so it may hold no
// hook of its own and takes the width its caller already bound.
function Movement(q, mobile) {
  const color = PRICE_TAG_COLOR[q.tag] || GOLD_DEEP;
  return (
    <div key={q.id} style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap',padding:'3px 0'}}>
      <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag,minWidth:0}}>{q.label}</span>
      <span style={{fontSize:FS.sm,color:swatch.inkMag2}}>{q.phrase}</span>
      {/* The chip names the M6a stock band; a road-shade (band adequate) speaks
          through its phrase alone — a STEADY chip beside "a shade above" would
          contradict itself. */}
      {q.tag !== 'steady' && (
        <span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color,background:`${color}15`,padding:'0 5px'}}>{tokenCase(q.tag)}</span>
      )}
    </div>
  );
}

/** One trade column (Sells / Buys): moved goods as rows, steady goods folded
 *  into a single quiet line so the movements keep the stage.
 *  @param {{ heading:string, color:string, quotes:Array<{id:string,label:string,phrase:string,movement:string,tag:'dear'|'steady'|'cheap'}> }} props */
function TradeColumn({ heading, color, quotes }) {
  // THE PHONE PROSE FLOOR — the steady fold, which is the column's one running
  // line. The heading and each movement's label keep their own steps.
  const mobile = useIsMobile();
  const moved = quotes.filter(q => q.movement !== 'usual');
  const steady = quotes.filter(q => q.movement === 'usual');
  return (
    <div>
      <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color,marginBottom:4}}>{heading}</div>
      {moved.map(q => Movement(q, mobile))}
      {steady.length > 0 && (
        <div style={{fontSize:proseFontSize(FS.sm, mobile),color:swatch.inkMag2,padding:'3px 0'}}>
          <span style={{color:MUTED}}>At their usual prices: </span>
          {steady.map(q => q.label).join(', ')}
        </div>
      )}
    </div>
  );
}

/**
 * @param {{ prices: { present:boolean,
 *   exports: Array<{id:string,label:string,phrase:string,movement:string,tag:'dear'|'steady'|'cheap'}>,
 *   imports: Array<{id:string,label:string,phrase:string,movement:string,tag:'dear'|'steady'|'cheap'}>,
 *   highlight: { id:string, label:string, tag:'dear'|'cheap', crierLine:string } | null } }} props
 */
export default function MarketPricesSection({ prices }) {
  // THE PHONE PROSE FLOOR — the crier's line and the reckoning note beneath the
  // columns. The band chips keep their own step.
  const mobile = useIsMobile();
  return (
    <Section title="Market Prices" collapsible defaultOpen accent={GOLD_DEEP}>
      {prices.highlight && (
        <p style={{fontSize:proseFontSize(FS.md, mobile),color:swatch.inkMag,lineHeight:1.55,margin:'0 0 10px',fontStyle:'italic',
          borderLeft:`3px solid ${PRICE_TAG_COLOR[prices.highlight.tag] || GOLD_DEEP}`,paddingLeft:10}}>
          &ldquo;{prices.highlight.crierLine}&rdquo;
        </p>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:10}}>
        {prices.exports.length > 0 && (
          <TradeColumn heading="Sells (exports)" color={swatch.success} quotes={prices.exports} />
        )}
        {prices.imports.length > 0 && (
          <TradeColumn heading="Buys (imports)" color={swatch.danger} quotes={prices.imports} />
        )}
      </div>
      <p style={{fontSize:proseFontSize(FS.xxs, mobile),color:MUTED,fontStyle:'italic',margin:'8px 0 0',lineHeight:1.4}}>
        Reckoned against this settlement&rsquo;s own usual prices, off the founding trade profile and the live scarcity of the roads. The coin itself is yours to set at the table.
      </p>
    </Section>
  );
}
