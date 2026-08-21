import Card from '../primitives/Card.jsx';
import { FS, swatch } from '../theme.js';
import { t } from '../../copy/index.js';
import { noteKeyFor, noteTopicForSurface, noteMomentFor } from '../../domain/display/guidanceNotes.js';

/**
 * components/guidance/SurveyorNote — THE SURVEYOR'S-NOTES VISUAL GRAMMAR (W-GUIDE-2 §4).
 *
 * The in-world register rendered as a margin note: the Card `suggestion` variant
 * (soft amber, documented "for AI/onboarding hooks"), the ✦ glyph + uppercase
 * micro-eyebrow "A NOTE FROM THE SURVEYOR", serif prose at 1.65, and the "— S."
 * signature. A pure whisper of study cloth — it never blocks, dims, or floats
 * (THE IMMERSION LAW): it sits at a rest-point (an empty library, a fresh map)
 * as furniture the world could own.
 *
 * The glyph is a raw unicode text glyph (the DossierNarrativeBanner precedent) —
 * IconsContext stays OFF; text glyphs are not icons and are unaffected by the
 * icon gate. Copy is resolved through t() from the guidance.notes.* register.
 *
 * HONESTY / DISSOCIATION GATE: when the note resolves to nothing (an out-of-scope
 * topic), the component renders null — no empty chrome, no invented voice.
 *
 * @param {Object} props
 * @param {string} [props.topic]    a NoteTopic (library|realm|dossier|simulation).
 * @param {string} [props.moment]   a NoteMoment (empty|first|onward).
 * @param {string} [props.surface]  a guidance surface id (maps to a topic) — an
 *   alternative to `topic`, used at the mount site.
 * @param {{hasAny?: boolean, isFirst?: boolean}} [props.signal] maps to a moment
 *   when `surface` is given.
 * @param {string|number} [props.id] a STABLE id — the FNV variant seed (same id
 *   ⇒ same note, so it does not reshuffle on re-render).
 * @param {boolean} [props.compact]
 *
 * Dismissal is a mount-site concern (the guidance registry's markGuidanceSeen
 * machinery, W-GUIDE-1), not this renderer's — SurveyorNote is purely the note
 * grammar so it stays reusable across surfaces.
 */
export default function SurveyorNote({ topic, moment, surface, signal, id = 'note', compact }) {
  const resolvedTopic = topic || (surface ? noteTopicForSurface(surface) : null);
  const resolvedMoment = moment || noteMomentFor(signal);
  const key = noteKeyFor(resolvedTopic, resolvedMoment, id);
  if (key === null) return null; // honesty gate: no note ⇒ no chrome.
  const line = t(key);

  const ACCENT = swatch['#7A4F0F']; // the Card suggestion titleColor (warm amber).
  const INK = swatch['#2D1F0E'];

  return (
    <Card variant="suggestion" compact={compact}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span aria-hidden="true" style={{ fontSize: FS.md, flexShrink: 0, marginTop: 2, color: ACCENT }}>
          {'✦'}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: FS.micro, fontWeight: 800, color: ACCENT,
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
          }}>
            A Note from the Surveyor
          </div>
          <p style={{ margin: 0, fontSize: FS.md, color: INK, lineHeight: 1.65, fontFamily: 'Georgia, serif' }}>
            {line}
          </p>
          <div style={{ marginTop: 8, fontSize: FS.sm, color: ACCENT, fontFamily: 'Georgia, serif', fontStyle: 'italic', textAlign: 'right' }}>
            {'– S.'}
          </div>
        </div>
      </div>
    </Card>
  );
}
