import { FS, swatch } from '../theme.js';
import ProseParagraph from '../ProseParagraph.jsx';

// ── Banner above tab content ──────────────────────────────────────────────
// Thesis (identity-level prose) / per-tab note (lens) banner. Extracted
// verbatim from the IIFE that lived inside OutputContainer's content column.
// Presentational only: the parent computes nothing here that it didn't before;
// it just threads the same values in as props.
export default function DossierNarrativeBanner({
  showNarrative,
  aiSettlement,
  publicDossier,
  rawSettlement,
  selectedTab,
  aiRegenerating,
}) {
          // Owner views read the narrative overlay (aiSettlement); a public gallery
          // dossier embeds the narrative INTO the published settlement, so read the
          // thesis / per-tab note from the rendered settlement there. Either way
          // this only surfaces already-published narrative prose (the lens never
          // appears on an un-narrated dossier — there's no thesis to show).
          const nsrc = (showNarrative && aiSettlement) ? aiSettlement : (publicDossier ? rawSettlement : null);
          if (!nsrc) return null;
          const THESIS_TABS = ['summary', 'overview'];
          const NOTE_TABS = ['economics', 'services', 'power', 'defense', 'npcs', 'history', 'resources', 'viability'];
          const showThesis = THESIS_TABS.includes(selectedTab) && typeof nsrc.thesis === 'string' && nsrc.thesis.length > 0;
          const note = NOTE_TABS.includes(selectedTab) ? nsrc.narrativeNotes?.[selectedTab] : null;
          const showNote = typeof note === 'string' && note.length > 0;
          if (!showThesis && !showNote) return null;

          return (
            <div
              style={{
                // ONE violet AI-layer treatment, matching the action band: a
                // gradient tint + a single violet LEFT accent, no full or bottom
                // border. Spacing (a bottom margin), not a hairline, separates the
                // banner from tab content — so the narrative layer never paints two
                // stacked violet bands with their own bottom borders (false floor).
                padding: '12px 18px',
                margin: '0 0 12px',
                borderLeft: '3px solid rgba(123,79,207,0.70)',
                background: 'linear-gradient(135deg, rgba(74,26,122,0.06), rgba(106,42,154,0.04))',
                opacity: aiRegenerating ? 0.55 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: FS.md, flexShrink: 0, marginTop: 2, color: swatch['#7B4FCF'] }}>{'\u2726'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* One label vocabulary across every narrative-layer shell (the
                      action strip, this banner, the per-tab note): "Narrative
                      Layer" in one violet treatment. */}
                  <div style={{ fontSize: FS.xs, fontWeight: 800, color: swatch['#7B4FCF'], textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                    Narrative Layer
                  </div>
                  {showThesis
                    ? nsrc.thesis.split(/\n\n+/).map((para, i, arr) => (
                        <p key={i} style={{ margin: 0, marginBottom: i < arr.length - 1 ? 10 : 0, fontSize: FS.md, color: swatch['#2D1F0E'], lineHeight: 1.65, fontFamily: 'Georgia, serif' }}>
                          <ProseParagraph text={para.trim()} />
                        </p>
                      ))
                    : <p style={{ margin: 0, fontSize: FS.md, color: swatch['#2D1F0E'], lineHeight: 1.65, fontFamily: 'Georgia, serif' }}>
                        <ProseParagraph text={note} />
                      </p>}
                </div>
              </div>
            </div>
          );
}
