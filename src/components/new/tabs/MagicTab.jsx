/**
 * MagicTab — the Magic sub-tab (Phase 5 W4e dossier depth). Renders the 10-facet
 * magic profile via OUR `deriveMagicPosture` read-model, plus the deity⇄magic-
 * legality coupling explainer (a MAJOR patron deity regulates a realm's magic; a
 * warlike/evil major orthodoxy tightens harder).
 *
 * Honest in a dead-magic world (config.magicExists === false → posture.magicExists
 * false): it says so and prices no envelope, rather than fabricating a magic
 * economy that does not exist (OUR magic opt-out / dormancy law). Pure read-model
 * only — no store reads, no worldState, no leak surface.
 */

import { deriveMagicPosture, deriveMagicRelianceView } from '../../../domain/display/dossierViewModel.js';
import { describeDeityEffects } from '../../../domain/display/deityEffects.js';
import { FS, INK, MUTED, BODY, BORDER, CARD, CARD_HDR, SLATE, sans, SP } from '../../theme.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import NameColumns from '../../primitives/NameColumns.jsx';
import { magicDeskRead } from '../magicDeskRead.js';
import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
import { FLUSH } from '../../../design/flush.js';

/**
 * DS-DEF-9's position — the registry's first CROSS-TAB row, now drawn HERE (UX consolidation
 * 2026-10-30, RULINGS-T2 T2-15): "would this town still work if the practitioners left" is
 * the same idea as the role bands it frames, so the dependence reading sits with them. The
 * registry row keeps its id (`viability.magicDependency`); renaming it would re-key the prose
 * manifest, which is a shift of its own. ONE lens at ONE position.
 */
const MAGIC_DEPENDENCY_MOUNT = 'viability.magicDependency';

const FACET_LABEL = {
  availability: 'Availability',
  legality: 'Legality',
  institutionalControl: 'Institutional control',
  cost: 'Service cost',
  risk: 'Risk',
  religiousAcceptance: 'Religious acceptance',
};
const FACET_ORDER = ['availability', 'legality', 'institutionalControl', 'cost', 'risk', 'religiousAcceptance'];

function Facet({ label, value }) {
  return (
    <div data-facet style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: SP.sm, padding: `${SP.xs}px 0`, borderBottom: `1px solid ${BORDER}`,
    }}>
      <span style={{ fontSize: FS.sm, fontWeight: 600, color: INK }}>{label}</span>
      <span style={{ fontSize: FS.sm, fontWeight: 800, color: SLATE, textTransform: 'capitalize' }}>{value}</span>
    </div>
  );
}

/**
 * @param {{ settlement: any, publicDossier?: boolean, playerView?: boolean }} props
 *   `publicDossier` (§885.3): a free, anonymous gallery viewer draws no corpus prose, so the
 *   DS-DEF-9 line is not drawn there; `playerView` is the desk audience, the PowerTab term.
 *   Both are threaded from OutputContainer's magic case.
 */
export default function MagicTab({ settlement, publicDossier = false, playerView = false }) {
  // THE PHONE PROSE FLOOR — the posture line, the role lines and the deity
  // coupling. Bound above BOTH early returns so the hook order is stable; the
  // facet labels and their values keep their own steps.
  const mobile = useIsMobile();
  if (!settlement) return <div style={{ padding: 32, textAlign: 'center', color: MUTED }}>No settlement.</div>;
  const posture = deriveMagicPosture(settlement);

  if (!posture.available) {
    return <div data-testid="magic-tab" style={{ padding: 24, color: MUTED, fontFamily: sans, fontSize: proseFontSize(FS.sm, mobile) }}>Magic not assessed for this settlement.</div>;
  }

  // ── MAGIC DEPENDENCE: ONE BLOCK, THE ROLES' FRAMING (T2-15 MERGE + MOVE, R2/R3) ──────────
  // The frozen `magicDependency` record (its title and its chain notes) and DS-DEF-9's reading
  // are one idea. DS-DEF-9 REPLACES the static explanation where the desk speaks (on a shared page, where the
  // owner's draw speaks); the static explanation stands where it is silent. The block draws on a FALSE flag too when DS-DEF-9 has its
  // `magicDependency false` reading (a finding, not an absence). Where magic does not function
  // nothing here is true (T2-24), so the desk is not drawn and the block does not render.
  // The block carries the page's only first-survey stamp: `magicDependency` is a G5
  // generation-frozen record (owner-queue #28, one label per page, X-8).
  //
  // ⭐ THE ONE RELIANCE READING DECIDES THE BLOCK (lane MAGIC, chair ruling 2, 2026-11-03).
  // The frozen `defenseProfile.magicDependency` flag is set by the defence generator only
  // during a siege, famine or plague, so a city of mages exporting enchanted goods printed
  // "Nothing structural ... depends on arcane work" six lines under "Economic role: integral".
  // The desk is therefore handed the settlement with that flag READ FROM the view model's one
  // reading (relied-upon or integral ⇒ true), and the block's own fallback reads the same.
  // The siege/famine/plague flag no longer decides anything on this tab.
  const reliance = deriveMagicRelianceView(settlement);
  // THE PUBLIC BRANCH (STYLE-RULINGS-2 B10(a), SW-B7b): a shared page prints the lens the
  // owner's player view drew, shipped at the save (`magic`); unstamped, SILENT (magicDeskRead.js).
  const magicProse = magicDeskRead(settlement, { publicDossier, playerView });
  const magicLine = drawnAtMount(MAGIC_DEPENDENCY_MOUNT, magicProse.arcaneReliance)?.sentence || null;
  const magicFrozen = posture.magicExists && reliance.reliesOnMagic;

  const deity = settlement?.config?.primaryDeitySnapshot || null;
  // The magic-legality coupling line, surfaced only when a MAJOR deity regulates.
  const magicCoupling = deity?.rankAxis === 'major'
    ? describeDeityEffects(deity).filter(e => /magic legality/i.test(e))
    : [];

  return (
    <div data-testid="magic-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      <div style={{
        fontSize: FS.lg, fontWeight: 800, color: INK, marginBottom: 4,
      }}>Magic</div>
      <p style={{ fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.5, margin: '0 0 12px' }}>{posture.display}</p>

      {posture.magicExists ? (
        <>
          {/* The 6 envelope facets. */}
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden', ...FLUSH,
          }}>
            <div style={{
              fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em',
              background: CARD_HDR, padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`,
            }}>Envelope</div>
            {/* ⭐ THE ENVELOPE RUNS IN COLUMNS (owner order 2026-09-19 — "sections like
                these … in two or three columns to conserve space"). Six facets, each a
                label and one typed word, took six full-width lines. At six rows the
                primitive's own floor gives two columns and never three: three columns
                of two is a caption with orphans under it. */}
            <NameColumns count={FACET_ORDER.length} style={{ padding: `0 ${SP.md}px` }}>
              {FACET_ORDER.map(key => (
                <Facet key={key} label={FACET_LABEL[key]} value={posture[key]} />
              ))}
            </NameColumns>
          </div>

          {/* The 4 role lines. */}
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden', ...FLUSH,
          }}>
            <div style={{
              fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em',
              background: CARD_HDR, padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`,
            }}>Roles</div>
            <div style={{ padding: `${SP.xs}px ${SP.md}px` }} data-testid="magic-roles">
              {reliance.shown && (
                <div data-testid="magic-reliance" style={{ fontSize: proseFontSize(FS.sm, mobile), color: INK, fontWeight: 700, padding: `${SP.xs}px 0` }}>
                  Reliance on magic: {reliance.word}
                </div>
              )}
              {posture.roleLines.map((line, i) => (
                <div key={i} data-role-line style={{ fontSize: proseFontSize(FS.sm, mobile), color: BODY, padding: `${SP.xs}px 0` }}>{line}</div>
              ))}
            </div>
          </div>

          {/* The dependence block (T2-15), UNDER the role bands it frames: the block law (X-16)
              puts the facts first and the passage that couples them after. */}
          {(magicFrozen || magicLine) && (
            <div data-testid="magic-dependence" style={{
              background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${SLATE}`,
              padding: `${SP.sm}px ${SP.md}px`, ...FLUSH,
            }}>
              <div style={{ fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color: SLATE, marginBottom: 4 }}>
                Reliance on magic, as judged at the first survey
              </div>
              {magicLine
                ? <p style={{ fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>{magicLine}</p>
                : magicFrozen && <p style={{ fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.5, margin: 0 }}>
                  This place leans on its spellcasters: some of what it eats or makes, or some of the
                  trouble it keeps at bay, depends on their work. Lose them to war, plague or politics
                  and the gap would show at once.
                </p>}
              {magicFrozen && (settlement.economicState?.activeChains || []).filter(c => c.magicNote).map((c, i) => (
                <div key={i} style={{ fontSize: proseFontSize(FS.xs, mobile), color: BODY, marginTop: 6, paddingLeft: 8, borderLeft: `2px solid ${BORDER}`, fontStyle: 'italic' }}>
                  {c.label}: {c.magicNote}
                </div>
              ))}
            </div>
          )}

          {/* Deity ⇄ magic-legality coupling (self-gates to nothing without a major deity). */}
          {magicCoupling.length > 0 && (
            <div data-testid="magic-deity-coupling" style={{
              background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${SLATE}`,
              padding: `${SP.sm}px ${SP.md}px`,
            }}>
              <div style={{ fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Deity &amp; magic
              </div>
              {magicCoupling.map((line, i) => (
                <div key={i} style={{ fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.5 }}>
                  {deity.name}: {line}.
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
