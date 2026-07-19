/**
 * ChronicleTab.jsx — the settlement's living-history Chronicle (spec §8 M3c).
 *
 * Relocated under Notes (third sub-tab). One chronological feed of every event
 * affecting the settlement — manual changes, party-caused actions, and
 * world-pulse effects — newest first, each entry timed relative to campaign
 * canonization ("Day N", starting at zero) and tagged by source so it's clear
 * who drove it and which events are recent vs. earlier.
 *
 * The merge/normalize/classify/sort/relative-timing all live in the pure,
 * tested domain/dossier/chronicleFeed helper; this is presentation only.
 */
import { Section, Empty } from '../Primitives';
import { FS } from '../../theme.js';
import { INK as OINK } from '../../../design/organic/ink.js';
import { RUBRIC } from '../../../design/organic/rubrication.js';
import { entityAnchor } from '../../../domain/dossier/entityLinks.js';

// The Chronicle reads as ANNALS (Deep Craft — the dossier's register voice): a
// ruled chronological column on parchment, not cool rounded cards. Each entry's
// SOURCE is a left margin rule + a small-caps stamp in its own tone — the party's
// hand in the apparatus oxblood, a change you authored in the gold entry mark, the
// wider world in the neutral sepia ink. All three are the organic ramp's
// contrast-pinned steps (tests/design/contrast.test.js), so the register is AA on
// every parchment ground with no new tint to prove.
const PARTY = RUBRIC.rubric;    // the party's hand — apparatus oxblood
const SRC_EDIT = RUBRIC.entry;  // a change you authored — the gold entry mark
const WORLD = OINK.secondary;   // the wider world — neutral sepia ink
const RULE = OINK.hairline;     // the feint annal ruling (decorative)

// A source stamp: small-caps in the source's tone inside a square hairline tag —
// no rounded card chrome. Colour is never the sole channel; the stamp text
// (Party / Edit / World) and the row title both carry the source.
function stamp(color) {
  return { fontSize: FS.micro, color, border: `1px solid ${color}`, padding: '0 5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' };
}

/**
 * The DOM anchor a chronicle row exposes as a link TARGET, matching the dossier
 * entity index's event anchors (entityAnchor('event', { id })). Returns null
 * when the entry has no id, so a row without a stable id simply isn't a target
 * (no orphan/dead anchor) rather than minting an index-derived one.
 *
 * Event TITLES in the feed stay plain text — an event linking to itself is
 * meaningless, and the chronicle's normalized rows carry no structured actor
 * (npc/faction) references to render as link sources.
 *
 * @param {{ id?: string }} event  A chronicle feed entry.
 * @returns {string|null}
 */
function chronicleAnchor(event) {
  return event?.id ? entityAnchor('event', { id: event.id }) : undefined;
}

export default function ChronicleTab({ entries = [] }) {
  if (!entries.length) {
    return (
      <Empty message="No chronicle yet. Your changes, the party's actions, and the world's own turns will gather here as the settlement's living history, timed from canonization." />
    );
  }
  return (
    <div style={{ padding: '16px 18px' }}>
      <Section title={`Chronicle (${entries.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.map((event, i) => {
            const accent = event.source === 'party' ? PARTY : event.source === 'manual' ? SRC_EDIT : WORLD;
            return (
              <div key={event.id || i} id={chronicleAnchor(event)} style={{ borderLeft: `3px solid ${accent}`, borderBottom: `1px solid ${RULE}`, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: event.summary ? 4 : 0 }}>
                  {event.relativeLabel && (
                    <span style={{ fontSize: FS.micro, fontWeight: 800, color: WORLD, fontVariantNumeric: 'tabular-nums' }}>{event.relativeLabel}</span>
                  )}
                  <span style={{ fontSize: FS.xs, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {String(event.title || 'Event').replace(/_/g, ' ')}
                  </span>
                  {event.partyCaused
                    ? <span title="Caused by the party" style={stamp(PARTY)}>Party</span>
                    : event.source === 'manual'
                      ? <span title="A change you authored" style={stamp(SRC_EDIT)}>Edit</span>
                      : <span title="Driven by the wider world" style={stamp(WORLD)}>World</span>}
                </div>
                {event.summary && <p style={{ fontSize: FS.sm, color: OINK.body, lineHeight: 1.5, margin: 0 }}>{event.summary}</p>}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
