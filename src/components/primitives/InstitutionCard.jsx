/**
 * primitives/InstitutionCard — the institution identity popover (Wave E, E2).
 *
 * A modal card that shows an institution's derived profile: its name, an
 * optional one-liner (rendered ONLY when present — Phase 5 authors real copy;
 * we invent none), and the concrete contributions deriveInstitutionProfile
 * pulled from the settlement's real data (economy / defence / power / services).
 *
 * It mirrors the Dialog primitive's a11y postures — role="dialog", aria-modal,
 * an accessible name, focus moved in on open, a Tab focus-trap, Escape + click
 * -outside to dismiss, and focus restored to the trigger on close — but stays a
 * dedicated primitive so its header carries a NEUTRAL institution glyph rather
 * than the Dialog Shell's alert triangle.
 */

import { Landmark, X } from 'lucide-react';
import {
  // ELEV and R are gone with the lift and the rounding — the plate is flat and
  // rule-framed now, so the elevation ramp and the radius scale have no reader here.
  BODY, BORDER, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SP, sans,
} from '../theme.js';
import IconButton from './IconButton.jsx';
import { useIconsOn } from './IconsContext.js';
import { useDialogFocusTrap } from './useDialogFocusTrap.js';
import { deriveInstitutionProfile } from '../../domain/display/institutionProfile.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';

// Per-domain accent for a contribution row's tag chip.
const DOMAIN_STYLE = {
  economy: { fg: '#8a5a10', label: 'Economy' },
  defense: { fg: '#8b1a1a', label: 'Defence' },
  power: { fg: '#5a3a8a', label: 'Power' },
  services: { fg: '#1a5a28', label: 'Services' },
};

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {any} props.institution      The institution object to profile.
 * @param {any} [props.settlement]     The settlement it belongs to (for derivation).
 * @param {() => void} props.onClose
 */
export default function InstitutionCard({ open, institution, settlement, onClose }) {
  // Shared focus trap: focus-in on open, Tab cycling, Escape-to-close, and
  // focus restore on close. The hook is keyed on `open` ALONE and reads onClose
  // through a ref, so a background re-render that mints a new onClose identity
  // does NOT re-run the effect and yank focus out mid-read (the recorded
  // onClose-identity bug class this popover shared with GlossaryCard).
  const mobile = useIsMobile();
  const cardRef = useDialogFocusTrap(open, onClose);
  const iconsOn = useIconsOn();

  if (!open) return null;

  const profile = deriveInstitutionProfile(institution || {}, settlement || {});

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed', inset: 0, zIndex: 300, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: SP.lg,
        background: 'rgba(27,20,8,0.46)',
      }}
      // ⛔ THE DIALOG IS A DOM DESCENDANT OF WHATEVER THE TRIGGER SITS IN, so every
      // event inside it bubbles into that host. InstitutionLink is rendered inside
      // PowerStrata's faction row — a `role="button"` div whose onClick toggles the
      // row — so a reader who opened a profile and pressed Close TOGGLED THE ROW
      // BEHIND THE CARD on the way out, and every click on the card's own body did
      // the same. The trigger already stops its own click (that is why OPENING the
      // card does not toggle); nothing stopped the card's.
      //
      // ⚠ KEYDOWN IS STOPPED FOR ENTER AND SPACE ONLY, AND THE LIMIT IS LOAD-BEARING.
      // `useDialogFocusTrap` listens on WINDOW, and React's synthetic
      // stopPropagation calls the native one — so a blanket keydown stop at this
      // overlay would cut Escape-to-dismiss and Tab-trapping off from the very hook
      // that makes this an aria-modal dialog. Enter and Space are exactly the two
      // keys a `role="button"` host acts on, which is the same pair the trigger
      // already stops.
      //
      // The structural cure is still to portal this card to document.body, and it is
      // still deliberately deferred (see InstitutionLink's docblock): the trap owns
      // focus restoration and three suites query this card inside their render
      // container. Stopping propagation is the minimal cure and it is pinned.
      onMouseDown={(event) => { event.stopPropagation(); if (event.target === event.currentTarget) onClose?.(); }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') event.stopPropagation(); }}
    >
      <section
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${profile.name} (institution profile)`}
        tabIndex={-1}
        // THE INSTRUMENT PLATE, not a lifted card. The dialog adopts the idiom
        // PortablePopup already carries for this exact element class: a square,
        // rule-framed plate on the scrim. The R.lg rounding and the ELEV[3]
        // z-axis lift are both struck (the StaleNarrativeModal cure, C4c-f), and
        // the zero radius stays DECLARED so the flatness is enforced rather than
        // merely absent. (Naming the property longhand here would spend a unit of
        // the kill-list ratchet — its detector is a source match, LANE PW.)
        style={{
          width: 'min(100%, 420px)', maxHeight: 'min(90vh, 620px)', overflow: 'auto',
          border: `1px solid ${BORDER}`, borderRadius: 0, background: CARD,
        }}
      >
        <header style={{
          display: 'flex', alignItems: 'flex-start', gap: SP.md,
          padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`,
          borderBottom: `1px solid ${BORDER}`, background: CARD_ALT,
        }}>
          {/* Icons-off (IconsContext): the decorative Landmark medallion goes,
              and its 32px box goes WITH it — leaving the box would keep an
              empty bordered square eating the header's gap (the lane IC
              dead-slot lesson). Same shape as Dialog/DesktopOnlyGate. */}
          {iconsOn && (
            <div style={{
              width: 32, height: 32, border: `1px solid ${BORDER}`,
              background: CARD, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: GOLD, flexShrink: 0,
            }}>
              <Landmark size={16} aria-hidden="true" />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, lineHeight: 1.25, fontWeight: 900 }}>
              {profile.name}
            </h2>
            {/* oneLiner renders ONLY when authored copy exists (Phase 5). */}
            {profile.oneLiner && (
              <p style={{ margin: `${SP.xs}px 0 0`, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.45 }}>
                {profile.oneLiner}
              </p>
            )}
          </div>
          <IconButton Icon={X} label="Close" tone="ghost" size="sm" onClick={onClose} />
        </header>

        <div style={{ padding: SP.lg }}>
          {profile.contributions.length === 0 ? (
            <p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
              No derived role for this institution yet.
            </p>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: SP.md }}>
              {profile.contributions.map((c, i) => {
                const ds = DOMAIN_STYLE[c.domain] || { fg: MUTED, label: c.domain };
                return (
                  <li key={`${c.domain}-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color: ds.fg, textTransform: 'uppercase',
                        letterSpacing: '0.06em', background: `${ds.fg}12`, border: `1px solid ${ds.fg}33`,
                        borderRadius: 3, padding: '1px 5px', flexShrink: 0,
                      }}>
                        {ds.label}
                      </span>
                      <span style={{ fontSize: FS.sm, fontWeight: 800, color: INK, fontFamily: sans }}>{c.label}</span>
                    </div>
                    <span style={{ fontSize: FS.sm, color: BODY, fontFamily: sans, lineHeight: 1.45 }}>{c.detail}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
