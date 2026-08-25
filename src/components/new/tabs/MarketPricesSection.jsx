/**
 * MarketPricesSection.jsx — the dossier's MARKET PRICES section (round-21 Wave 7).
 *
 * Extracted as a sibling leaf (the EconomicFlowsSection / dossierLazyTabs idiom)
 * so EconomicsTab.jsx stays under the max-lines ratchet as sections accrue. Pure
 * presentation over the marketPrices read-model: believable in-world coin derived
 * from the live economy (the seeded trade profile + the M6a stock bands + the M6d
 * flow drift) WITHOUT touching it — the raw coppers ride the tooltip, the spoken
 * quote is a market crier's coarse reckoning. Renders ONLY when `prices.present`.
 */
import { FS, swatch, MUTED, GOLD_DEEP } from '../../theme.js';
import { Section } from '../Primitives';

// The crier's coin band → colour: dear = shortage, cheap = surplus, steady =
// adequate. Sourced from the token swatch (exact-value keys) so the section reads
// consistently with the M6d Live Trade Flow band right above it.
const PRICE_TAG_COLOR = {
  dear: swatch['#8B1A1A'],
  steady: swatch['#A0762A'],
  cheap: swatch['#1A5A28'],
};

/** @param {{ id:string,label:string,unit:string,priced:string,tag:'dear'|'steady'|'cheap',raw:string }} q */
function Quote(q) {
  const color = PRICE_TAG_COLOR[q.tag] || GOLD_DEEP;
  return (
    <div key={q.id} title={q.raw} style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap',padding:'3px 0'}}>
      <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag,minWidth:0}}>{q.label}</span>
      <span style={{fontSize:FS.sm,color:swatch.inkMag2}}>{q.priced}</span>
      {q.tag !== 'steady' && (
        <span style={{fontSize:FS.micro,fontWeight:800,color,background:`${color}15`,borderRadius:3,padding:'0 5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{q.tag}</span>
      )}
    </div>
  );
}

/**
 * @param {{ prices: { present:boolean,
 *   exports: Array<{id:string,label:string,unit:string,priced:string,tag:'dear'|'steady'|'cheap',raw:string}>,
 *   imports: Array<{id:string,label:string,unit:string,priced:string,tag:'dear'|'steady'|'cheap',raw:string}>,
 *   highlight: { id:string, label:string, tag:'dear'|'cheap', crierLine:string } | null } }} props
 */
export default function MarketPricesSection({ prices }) {
  return (
    <Section title="Market Prices" collapsible defaultOpen accent={GOLD_DEEP}>
      {prices.highlight && (
        <p style={{fontSize:FS.md,color:swatch.inkMag,lineHeight:1.55,margin:'0 0 10px',fontStyle:'italic',
          borderLeft:`3px solid ${PRICE_TAG_COLOR[prices.highlight.tag] || GOLD_DEEP}`,paddingLeft:10}}>
          &ldquo;{prices.highlight.crierLine}&rdquo;
        </p>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:10}}>
        {prices.exports.length > 0 && (
          <div>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.success,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Sells (exports)</div>
            {prices.exports.map(Quote)}
          </div>
        )}
        {prices.imports.length > 0 && (
          <div>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.danger,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Buys (imports)</div>
            {prices.imports.map(Quote)}
          </div>
        )}
      </div>
      <p style={{fontSize:FS.xxs,color:MUTED,fontStyle:'italic',margin:'8px 0 0',lineHeight:1.4}}>
        Quoted in local coin — a market-crier&rsquo;s coarse reckoning off the founding trade profile and the live scarcity of the roads, not a fixed rate.
      </p>
    </Section>
  );
}
