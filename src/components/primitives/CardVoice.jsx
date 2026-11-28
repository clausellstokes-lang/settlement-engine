/**
 * components/primitives/CardVoice.jsx — THE ONE QUOTE SLOT OF A CARD (S-G1; the owner's fifth message: "all quotes are
 * added to cards and not between them or making new cards"; the chair's rulings E28 on VOICES-CARDS' F).
 *
 *   <CardVoice settlement={s} kind="institution" id={cardId} />
 *
 * One italic line in quotation marks and its signature, "— <Name>, <role>", placed and styled by this component alone,
 * the same on every card and every tab. It RENDERS NOTHING when the card is silent (no reserved height: the NPCs tab's
 * collapsed rows do not grow), when the page is not the owner's own, and until the lines have loaded.
 *
 * THE AUDIENCE (ruling 12): `VoicesAudience` (below) is provided ONCE, by the dossier's container, from its own flags:
 * 'owner' on the owner's page; 'reader' on the shared page and in the player view. Its DEFAULT IS 'reader': a card
 * mounted anywhere else speaks to no one (fail-closed).
 *
 * THE LIAR (ruling 11): on the owner's page the liar's quote carries a small DM mark and the DM's "in truth" note, in the
 * dossier's owner-only style (`data-layer="dm"`). A surface that cannot show the mark safely passes `dm={false}` and the
 * liar's card shows nothing.
 *
 * LAZY (the first paint must not carry the lines): the plan and its lines are one dynamic import, made when the first
 * owner's card mounts; `tests/build/voicesLinesLazy.test.js` holds the eager graph clear of them.
 * @enforced-by tests/components/CardVoice.test.jsx
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { FS, MUTED, swatch } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

/** @typedef {{ audience: string, customTraditions?: unknown }} VoicesAudienceValue */
/** THE AUDIENCE OF A PAGE'S VOICES: 'owner' alone hears them. Default: a reader (fail-closed). */
export const VoicesAudienceContext = createContext(/** @type {VoicesAudienceValue} */ ({ audience: 'reader' }));
/** The dossier's provider. @param {{ value: VoicesAudienceValue, children?: import('react').ReactNode }} props */
export function VoicesAudience({ value, children }) {
  return <VoicesAudienceContext.Provider value={value}>{children}</VoicesAudienceContext.Provider>;
}

/** @typedef {typeof import('../../domain/voices/voicePlan.js')} VoicesModule */
/** @type {VoicesModule | null} */ let loaded = null;
/** @type {Promise<VoicesModule> | null} */ let pending = null;
/** @returns {Promise<VoicesModule>} */
export function loadVoices() {
  if (!pending) pending = import('../../domain/voices/voicePlan.js').then((m) => { loaded = m; return m; });
  return pending;
}

/** The plan module, once loaded (null before; loading begins when `active`). @param {boolean} active */
export function useVoicesModule(active) {
  const [mod, setMod] = useState(/** @type {VoicesModule | null} */ (loaded));
  useEffect(() => {
    if (!active || mod) return undefined;
    let live = true;
    loadVoices().then((m) => { if (live) setMod(m); });
    return () => { live = false; };
  }, [active, mod]);
  return mod;
}

/** The DM mark's box (the dossier's owner-only style: `DailyLifeTab.jsx :: DM_BOX`). */
const DM_INK = swatch['#4A1A4A'];
const DM_LINE = Object.freeze({ borderLeft: `3px solid ${DM_INK}`, paddingLeft: 6, marginTop: 2, fontStyle: 'normal' });

/**
 * @param {{ settlement: any, kind: string, id: string | null | undefined, dm?: boolean }} props
 *   `dm`: whether this surface may show the DM's mark (the owner's screen: yes); without it the liar's card is silent
 */
export default function CardVoice({ settlement, kind, id, dm = true }) {
  const { audience, customTraditions } = useContext(VoicesAudienceContext);
  const owner = audience === 'owner' && !!settlement && !!id;
  const mod = useVoicesModule(owner);
  const mobile = useIsMobile();
  if (!owner || !mod) return null;
  const quote = mod.quoteFor(mod.voicePlanOf(settlement, { audience, customTraditions }), kind, id);
  if (!quote || (quote.liar && !dm)) return null;
  const { name, role } = quote.speaker;
  return (
    <div data-testid="card-voice" data-voice-line={quote.lineId} data-voice-kind={kind}
      style={{ marginTop: 4, fontSize: proseFontSize(FS.xs, mobile), color: swatch.inkMag3, lineHeight: 1.4 }}>
      <span style={{ fontStyle: 'italic' }}>{`“${quote.text}”`}</span>
      <span data-testid="card-voice-by" style={{ color: MUTED }}>{` — ${name}${role ? `, ${role}` : ''}`}</span>
      {quote.liar && (
        <div data-testid="card-voice-dm" data-layer="dm" style={{ ...DM_LINE, fontSize: chromeFontSize(FS.xxs, mobile), color: MUTED }}>
          <span style={{ fontWeight: 800, color: DM_INK, letterSpacing: '0.04em' }}>DM</span>{` In truth, ${quote.liar.inTruth}.`}
        </div>
      )}
    </div>
  );
}
