/**
 * components/townMap/SettlementMapNotes — SM-5 THE LEGIBILITY DRAWER.
 *
 * A left-edge "Read" drawer that surfaces what the map already knows but never told:
 *   • THE SURVEYOR'S READ (deliverable 1) — the founding response mode, the site
 *     causes, and the LATENT-ADVANTAGE MAP (the advantages the founding mode declined).
 *   • WHAT CHANGED (deliverable 2) — the recent spatial upheavals (scars / rebuilt
 *     blocks / calamities), or a dark-fabric whisper when nothing is recorded yet.
 *   • ROADS OUT (deliverable 3) — the map's exits, labelled to their named neighbours.
 *
 * Every section is derived, honest, and self-gating: a section renders ONLY when it
 * has real content (the InstitutionCard honesty gate, generalised), and the whole
 * drawer's toggle appears ONLY when at least one section does — so a plain v1 map
 * with no fabric and no neighbours shows no drawer at all. Viewing is free at every
 * tier; this is a reading affordance, never an edit.
 *
 * Accessible names via aria-label / aria-expanded, never native title= (the guidance
 * layer's title= census is shrink-only). Theme tokens only; no lucide icons.
 */
import { useState } from 'react';
import Button from '../primitives/Button.jsx';
import SurveyorNote from '../guidance/SurveyorNote.jsx';
import { BODY, BORDER, CARD_ALT, ELEV, FS, INK, MUTED, R, SP, sans } from '../theme.js';

const BAND_LABEL = { strong: 'a strong pull', moderate: 'a fair pull', slight: 'a slight pull' };

/**
 * @typedef {{ hasAny: boolean,
 *   rebuilt: Array<{ label: string, detail: string }>,
 *   scars: Array<{ label: string, detail: string }>,
 *   calamities: Array<{ label: string, detail: string }> }} ChangeViewModel
 * @param {{
 *   settlement?: any,
 *   story?: import('./provenanceModel.js').MapStory | null,
 *   changes?: ChangeViewModel | null,
 *   roads?: Array<{ roadId:string, neighborName:string, relationshipLabel:string, travelLabel:string|null }> | null,
 *   onOpen?: () => void,
 * }} props
 */
export default function SettlementMapNotes({ settlement, story = null, changes = null, roads = null, onOpen }) {
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen((v) => {
    const next = !v;
    if (next && typeof onOpen === 'function') onOpen();
    return next;
  });

  const hasStory = !!story && (!!story.responseLabel || story.site.length > 0 || story.declined.length > 0);
  // The change view opens the drawer only when it has REAL changes; a dark change
  // view is not itself a reason to surface the drawer (it would be noise on a plain
  // map). But once the drawer is open for ANY reason, the change section renders —
  // showing the dark-fabric whisper in place of content.
  const hasRealChanges = !!changes && changes.hasAny;
  const hasRoads = Array.isArray(roads) && roads.length > 0;
  if (!hasStory && !hasRealChanges && !hasRoads) return null;

  return (
    <div data-town-notes style={wrapStyle}>
      {open && (
        <div role="region" aria-label="Map notes" style={panelStyle}>
          {hasStory && <StorySection story={story} />}
          {changes && <ChangeSection changes={changes} settlement={settlement} />}
          {hasRoads && <RoadsSection roads={roads} />}
        </div>
      )}
      <Button
        data-town-notes-toggle
        variant={open ? 'primary' : 'secondary'}
        size="sm"
        aria-expanded={open}
        aria-label={open ? 'Hide the map notes' : 'Read the map — what the map knows and never told'}
        onClick={openDrawer}
        style={{ minHeight: 0, padding: '3px 10px' }}
      >
        {open ? 'Close' : 'Read'}
      </Button>
    </div>
  );
}

/** THE SURVEYOR'S READ — response mode + site cause + the declined-advantage map. */
function StorySection({ story }) {
  return (
    <section style={sectionStyle}>
      <SectionHead>The surveyor’s read</SectionHead>
      {story.responseLabel && (
        <p style={proseStyle}>{story.responseLabel}.</p>
      )}
      {story.site.length > 0 && (
        <ul style={listStyle}>
          {story.site.map((c, i) => (
            <li key={`site-${i}`} style={rowStyle}>
              <span style={rowLead}>{c.ref}</span>
              <span style={rowSub}>{`${c.familyLabel} · ${c.effectLabel}`}</span>
            </li>
          ))}
        </ul>
      )}
      {story.declined.length > 0 && (
        <>
          <div style={subHeadStyle}>Advantages it left on the table</div>
          <ul style={listStyle}>
            {story.declined.map((d, i) => (
              <li key={`decl-${i}`} style={rowStyle}>
                <span style={rowLead}>{d.ref}</span>
                <span style={rowSub}>{BAND_LABEL[d.band] || 'a pull'}, declined at its founding</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/** WHAT CHANGED — recent spatial upheavals, or a dark-fabric whisper. */
function ChangeSection({ changes, settlement }) {
  return (
    <section style={sectionStyle}>
      <SectionHead>What changed</SectionHead>
      {changes.hasAny ? (
        <>
          {changes.rebuilt.length > 0 && (
            <div style={{ marginBottom: SP.xs }}>
              <div style={subHeadStyle}>Rebuilt</div>
              <ul style={listStyle}>
                {changes.rebuilt.map((r, i) => (
                  <li key={`rb-${i}`} style={rowStyle}>
                    <span style={rowLead}>{r.label}</span>
                    <span style={rowSub}>{r.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {changes.scars.length > 0 && (
            <div style={{ marginBottom: SP.xs }}>
              <div style={subHeadStyle}>Scars</div>
              <ul style={listStyle}>
                {changes.scars.map((s, i) => (
                  <li key={`sc-${i}`} style={rowStyle}>
                    <span style={rowLead}>{s.label}</span>
                    <span style={rowSub}>{s.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {changes.calamities.length > 0 && (
            <div>
              <div style={subHeadStyle}>Recent calamities</div>
              <ul style={listStyle}>
                {changes.calamities.map((c, i) => (
                  <li key={`cal-${i}`} style={rowStyle}>
                    <span style={rowLead}>{c.label}</span>
                    <span style={rowSub}>{c.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        // The dark-fabric empty state — a single Surveyor's-note whisper (the map
        // surface → realm topic, the validated 'note' register). One at a time by
        // construction; renders null itself if the register resolves nothing.
        <SurveyorNote surface="map" signal={{ hasAny: false }} id={`${settlement?.id ?? 'map'}:change`} compact />
      )}
    </section>
  );
}

/** ROADS OUT — the map's exits, labelled to their named neighbours. */
function RoadsSection({ roads }) {
  return (
    <section style={sectionStyle}>
      <SectionHead>Roads out</SectionHead>
      <ul style={listStyle}>
        {roads.map((r, i) => (
          <li key={`road-${i}`} style={rowStyle}>
            <span style={rowLead}>{`→ ${r.neighborName}`}</span>
            <span style={rowSub}>{[r.relationshipLabel, r.travelLabel].filter(Boolean).join(' · ')}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** @param {{ children: import('react').ReactNode }} props */
function SectionHead({ children }) {
  return (
    <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, marginBottom: SP.xs }}>
      {children}
    </div>
  );
}

const wrapStyle = {
  position: 'absolute', top: '50%', left: SP.sm, transform: 'translateY(-50%)', zIndex: 5,
  display: 'flex', alignItems: 'center', gap: SP.xs, fontFamily: sans,
};
const panelStyle = {
  maxWidth: 'min(78vw, 300px)', maxHeight: 'min(70vh, 460px)', overflow: 'auto',
  display: 'flex', flexDirection: 'column', gap: SP.md,
  padding: SP.md, background: CARD_ALT, border: `1px solid ${BORDER}`,
  borderRadius: R.lg, boxShadow: ELEV[3],
};
const sectionStyle = { display: 'flex', flexDirection: 'column' };
const listStyle = { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 };
const rowStyle = { display: 'flex', flexDirection: 'column', gap: 1 };
const rowLead = { fontSize: FS.xs, fontWeight: 700, color: INK, fontFamily: sans };
const rowSub = { fontSize: FS.xxs, color: MUTED, fontFamily: sans };
const proseStyle = { margin: `0 0 ${SP.xs}px`, fontSize: FS.sm, color: BODY, fontFamily: sans, lineHeight: 1.45 };
const subHeadStyle = {
  color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800,
  textTransform: 'uppercase', letterSpacing: '0.06em', margin: `${SP.xs}px 0 2px`,
};
