import { lazy, Suspense } from 'react';
import { FS, SP, swatch } from '../theme.js';
import { flag } from '../../lib/flags.js';
import ShareToGallery from '../ShareToGallery.jsx';
import BuyThisDossier from '../BuyThisDossier.jsx';

// Simulation drawer trigger — lazy so its chunk only loads when opened.
const SimulationDrawer = lazy(() => import('./SimulationDrawer.jsx'));

// Single chrome band below the header — collapses what used to be TWO stacked
// full-width bands (the violet narrative-layer strip + the owner/visitor actions
// strip) into one row. Left: the narrative-layer primary action with its label
// (when the strip flag is on AND narrative can fire here); right: the owner
// action cluster (Buy / Share / "How this was simulated"), each child self-gating
// on auth/save state. One calm action row instead of two stacked bands reclaims
// the fold. Caller renders this only when NOT readOnly. Presentational; the
// narrative buttons arrive as a node so all AI state stays in OutputContainer.
export default function DossierActionBand({
  narrativeEnabled,
  narrativeButtons,
  settlement,
  saveId,
  liveSaveEntry,
  // When the first-save WelcomeCreditCard is showing it owns the single violet
  // Narrate pitch in this region; the band then collapses to its plain
  // owner-actions utility row so only one pitch competes for the focal point.
  suppressNarrativePitch = false,
  // Wizard generate-flow: Buy + "How this was simulated" are hoisted into the
  // wizard toolbar / Save row, so this band suppresses them here.
  embedded = false,
}) {
  // The narrative-layer pitch (violet tint + eyebrow + copy + Narrate buttons) is
  // earned only when the strip flag is on, narrative can fire here, AND no other
  // surface is already carrying the pitch (the welcome card).
  const showNarrativePitch = flag('narrativeLayerStrip') && narrativeEnabled && !suppressNarrativePitch;
  // In the embedded flow the only possible content is the narrative pitch — no
  // saveId means ShareToGallery self-gates to null, and Buy/How moved out — so
  // the band collapses to nothing when the pitch isn't live.
  if (embedded && !showNarrativePitch) return null;
  return (
    <div
      // Grouping is carried by DIFFERENTIAL SPACING, not a 4-sided box. The violet
      // AI-layer chrome is earned ONLY when the narrative can actually fire here
      // (narrativeEnabled): on an unsaved live generation the buttons return null,
      // so the strip would otherwise shout a dead 'Narrative Layer' header + a
      // denial sentence with no actionable control, out-shouting the freshly
      // generated content at its peak. When the strip flag is on but narrative is
      // disabled, the band collapses to the plain owner-actions utility row
      // (spacing only, no violet tint/accent), letting the dossier be the hero.
      // (P1 / P9.)
      style={showNarrativePitch
        ? {
            margin: `${SP.md}px ${SP.lg}px ${SP.sm}px`,
            padding: `${SP.sm}px ${SP.md}px`,
            background: 'linear-gradient(135deg, rgba(123,79,207,0.05), rgba(123,79,207,0.02))',
            borderLeft: '3px solid rgba(123,79,207,0.70)',
            display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap',
          }
        : {
            margin: `${SP.md}px ${SP.lg}px ${SP.sm}px`,
            padding: `0 ${SP.xs}px`,
            display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap',
          }}
    >
      {showNarrativePitch && (
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: swatch['#7B4FCF'] }}>Narrative Layer</div>
          <div style={{ fontSize: FS.xs, color: swatch['#4A3B22'], marginTop: 2, lineHeight: 1.4 }}>Turns the simulated dossier into prose your players will hear at the table.</div>
        </div>
      )}
      {showNarrativePitch && narrativeButtons}
      {/* Secondary owner actions: a trailing utility cluster, tighter gap than the
          primary's lead so it reads as subordinate. On narrow widths it reflows
          BELOW the narrative primary (last flex item with marginLeft:auto). */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', marginLeft: 'auto' }}>
        {!embedded && <BuyThisDossier settlement={settlement} />}
        <ShareToGallery
          saveId={saveId}
          isPublic={liveSaveEntry?.is_public}
          publicSlug={liveSaveEntry?.public_slug}
          settlement={settlement}
          galleryDescription={liveSaveEntry?.gallery_description}
          galleryImageUrl={liveSaveEntry?.gallery_image_url}
          galleryImageAlt={liveSaveEntry?.gallery_image_alt}
          galleryTags={liveSaveEntry?.gallery_tags}
          campaignState={liveSaveEntry?.campaignState}
          galleryShareNarrated={liveSaveEntry?.gallery_share_narrated}
          galleryShareDm={liveSaveEntry?.gallery_share_dm}
          galleryImportable={liveSaveEntry?.gallery_importable}
          galleryMemberOverrides={liveSaveEntry?.gallery_member_overrides}
        />
        {/* "How this was simulated" trigger — a "more info" affordance. In the
            embedded generate flow it lives in the wizard toolbar instead. */}
        {!embedded && (
          <Suspense fallback={null}>
            <SimulationDrawer />
          </Suspense>
        )}
      </div>
    </div>
  );
}
