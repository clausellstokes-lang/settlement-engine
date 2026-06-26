/**
 * CampaignStatePanel.jsx — the READ-ONLY shared-world panel on a map+campaign
 * gallery detail page.
 *
 * Given the pre-sanitized public world `snapshot` (the stored
 * gallery_world_snapshot artifact, NEVER a live worldState read) and the owner's
 * enabled `sections` array, this renders ONLY the enabled sections in the Realm
 * Inspector display idiom, but stripped to a static viewer:
 *   - worldClock → the read-only in-world date (year / month / season) + tick
 *   - dashboard → the realm-arc summary + the simulation-rule scent line
 *   - chronicle → a newest-first headline timeline
 *   - pantheon  → deities grouped by tier with seats + win/loss
 *   - warNetwork → siege / trade-war chips + the public channel network
 *
 * It reads from the SANITIZED snapshot only (the shape produced by
 * domain/display/worldSnapshotPublic.js: worldClock, chronicle, pantheon,
 * warNetwork, dashboard) — never a raw worldState field. When the snapshot or
 * world is null (the owner did not share the living world) it renders nothing,
 * and the parent shows just the realm-arc summary.
 *
 * Pure presentational. No store, no rng, no wall clock, no mutation.
 */

import { Activity, BookOpen, CalendarClock, Globe2, MapPin, Sparkles, Swords } from 'lucide-react';

import {
  BODY,
  BORDER,
  BORDER2,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  GOLD_TXT,
  INK,
  R,
  SECOND,
  SP,
  sans,
} from '../theme.js';

const SECTION_KEYS = Object.freeze(['worldClock', 'dashboard', 'chronicle', 'pantheon', 'warNetwork']);

const TIER_ORDER = ['major', 'minor', 'cult'];
const TIER_LABEL = { major: 'Major Powers', minor: 'Minor Faiths', cult: 'Cults and Remnants' };

/** @param {any} value @returns {string} */
function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

/** A small uppercase section heading with a leading glyph (Inspector scent). */
function SectionHead({ Icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {Icon && <Icon size={13} color={GOLD} aria-hidden />}{children}
    </div>
  );
}

/** A neutral chip token, reused across the war and rule rows. */
function Chip({ children, title }) {
  return (
    <span
      title={title}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: R.sm, background: CARD_ALT, border: `1px solid ${BORDER2}`, color: BODY, padding: `2px ${SP.xs}px`, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}
    >
      {children}
    </span>
  );
}

/** @param {any} value @returns {string} */
function titleCase(value) {
  const text = human(value).trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

/**
 * World clock section — the read-only in-world date and tick. Derived from the
 * sanitized snapshot.worldClock ({ tick, calendar: { year, month, season,
 * elapsedMonths } }). Self-gates to null when the snapshot carries no clock, so
 * a share that enables only this section still renders something rather than an
 * empty living-world panel.
 */
function WorldClockSection({ worldClock }) {
  const clock = worldClock && typeof worldClock === 'object' ? worldClock : null;
  if (!clock) return null;
  const calendar = clock.calendar && typeof clock.calendar === 'object' ? clock.calendar : {};
  const tick = Math.max(0, Math.floor(Number(clock.tick) || 0));
  const year = Math.max(1, Math.floor(Number(calendar.year) || 1));
  const month = Math.max(1, Math.floor(Number(calendar.month) || 1));
  const season = titleCase(calendar.season) || 'Spring';
  return (
    <section style={{ display: 'grid', gap: SP.sm }}>
      <SectionHead Icon={CalendarClock}>World Clock</SectionHead>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
        <Chip title="In-world year">Year {year}</Chip>
        <Chip title="In-world month">Month {month}</Chip>
        <Chip title="In-world season">{season}</Chip>
        <Chip title="Simulation tick">Tick {tick}</Chip>
      </div>
    </section>
  );
}

/**
 * Dashboard section — the simulation-rule scent chips. The realm-arc summary is
 * rendered ONCE, by MapGalleryDetail's "Realm Chronicle" gold callout (always shown
 * for a campaign share), so it is deliberately NOT duplicated here even though the
 * snapshot.dashboard still carries realmArcLines.
 */
function DashboardSection({ dashboard }) {
  const rules = dashboard?.simulationRules && typeof dashboard.simulationRules === 'object' ? dashboard.simulationRules : {};
  const ruleChips = ['propagationMode', 'intensity', 'migrationMode']
    .map(key => (rules[key] != null ? human(rules[key]) : null))
    .filter(Boolean);
  if (ruleChips.length === 0) return null;
  return (
    <section style={{ display: 'grid', gap: SP.sm }}>
      <SectionHead Icon={Globe2}>State of the Realm</SectionHead>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
        {ruleChips.map(chip => <Chip key={chip}>{chip}</Chip>)}
      </div>
    </section>
  );
}

/** One chronicle tick: its headlines, with the affected settlements named. */
function ChronicleTick({ entry }) {
  const headlines = Array.isArray(entry?.headlines) ? entry.headlines : [];
  const names = Array.isArray(entry?.affectedSettlementNames) ? entry.affectedSettlementNames : [];
  if (headlines.length === 0) return null;
  return (
    <article style={{ border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${GOLD}`, borderRadius: R.sm, background: CARD_ALT, padding: '8px 10px', display: 'grid', gap: 5 }}>
      <div style={{ color: GOLD_TXT, fontFamily: sans, fontSize: FS.micro, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Tick {Math.max(0, Math.floor(Number(entry?.tick) || 0))}
      </div>
      {headlines.map((h, i) => (
        <div key={i}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, lineHeight: 1.3 }}>
            {h?.headline || 'World pulse outcome'}
          </div>
          {h?.summary && (
            <p style={{ margin: '3px 0 0', color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.4 }}>
              {h.summary}
            </p>
          )}
        </div>
      ))}
      {names.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 800 }}>
          <MapPin size={10} color={GOLD} aria-hidden /> {names.slice(0, 4).join(', ')}{names.length > 4 ? ` +${names.length - 4}` : ''}
        </div>
      )}
    </article>
  );
}

/**
 * Chronicle section — a newest-first headline timeline. The snapshot already
 * orders ticks newest-first and caps them, so this renders them straight as a
 * read-only scrollback (no scrubber: a published snapshot is static).
 */
function ChronicleSection({ chronicle }) {
  const ticks = (Array.isArray(chronicle) ? chronicle : []).filter(t => Array.isArray(t?.headlines) && t.headlines.length > 0);
  if (ticks.length === 0) return null;
  return (
    <section style={{ display: 'grid', gap: SP.sm }}>
      <SectionHead Icon={BookOpen}>Chronicle</SectionHead>
      <div style={{ display: 'grid', gap: 6 }}>
        {ticks.map((entry, i) => <ChronicleTick key={entry?.tick ?? i} entry={entry} />)}
      </div>
    </section>
  );
}

/** A single deity row: seats + win/loss, grouped under its tier. */
function DeityRow({ deity }) {
  const seats = Math.max(0, Math.floor(Number(deity?.seats) || 0));
  const wins = Math.max(0, Math.floor(Number(deity?.wins) || 0));
  const losses = Math.max(0, Math.floor(Number(deity?.losses) || 0));
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '7px 10px', border: `1px solid ${BORDER2}`, borderRadius: R.sm, background: CARD }}>
      <span style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 800, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {deity?.name || 'Unnamed faith'}
      </span>
      <span style={{ flexShrink: 0, color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>
        {seats} seat{seats === 1 ? '' : 's'} · {wins}W / {losses}L
      </span>
    </div>
  );
}

/**
 * Pantheon section — deities grouped major / minor / cult, each with seats and
 * the conversion win/loss record. Built from the sanitized snapshot.pantheon[].
 */
function PantheonSection({ pantheon }) {
  const deities = (Array.isArray(pantheon) ? pantheon : []).slice()
    .sort((a, b) => (Number(b?.seats) || 0) - (Number(a?.seats) || 0));
  if (deities.length === 0) return null;
  const byTier = { major: [], minor: [], cult: [] };
  for (const d of deities) (byTier[d?.tier] || byTier.cult).push(d);
  return (
    <section style={{ display: 'grid', gap: SP.sm }}>
      <SectionHead Icon={Sparkles}>Pantheon</SectionHead>
      {TIER_ORDER.map(tier => byTier[tier].length > 0 && (
        <div key={tier} style={{ display: 'grid', gap: 5 }}>
          <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {TIER_LABEL[tier]} ({byTier[tier].length})
          </div>
          {byTier[tier].map((d, i) => <DeityRow key={d?.deityId || i} deity={d} />)}
        </div>
      ))}
    </section>
  );
}

/** The siege chips: one per besieged target, naming its coalition. */
function SiegeRow({ siege }) {
  const coalition = Array.isArray(siege?.coalitionNames) ? siege.coalitionNames : [];
  const named = coalition.length > 2
    ? `${coalition.slice(0, 2).join(', ')} +${coalition.length - 2}`
    : coalition.join(' and ');
  return (
    <div style={{ padding: '7px 10px', border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${GOLD}`, borderRadius: R.sm, background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.4 }}>
      <strong>{siege?.targetName || 'A settlement'}</strong> under siege
      {named ? <span style={{ color: BODY }}> by {named}</span> : null}
    </div>
  );
}

/**
 * War and network section — sieges + flipped trade wars as chips, then the
 * public channel network as a compact chip row. Built from the sanitized
 * snapshot.warNetwork ({ sieges, tradeWars, dispositions, channels }).
 */
function WarNetworkSection({ warNetwork }) {
  const sieges = Array.isArray(warNetwork?.sieges) ? warNetwork.sieges : [];
  const tradeWars = Array.isArray(warNetwork?.tradeWars) ? warNetwork.tradeWars : [];
  const channels = Array.isArray(warNetwork?.channels) ? warNetwork.channels : [];
  if (sieges.length === 0 && tradeWars.length === 0 && channels.length === 0) return null;
  return (
    <section style={{ display: 'grid', gap: SP.sm }}>
      <SectionHead Icon={Swords}>War and Network</SectionHead>
      {sieges.length > 0 && (
        <div style={{ display: 'grid', gap: 5 }}>
          {sieges.map((s, i) => <SiegeRow key={s?.targetId || i} siege={s} />)}
        </div>
      )}
      {tradeWars.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
          {tradeWars.map((w, i) => (
            <Chip key={w?.prizeId || i} title={`${w?.winnerName || 'A power'} seized ${w?.buyerName || 'a market'}`}>
              <Globe2 size={11} color={GOLD} aria-hidden /> {w?.commodityLabel || 'Trade war'}
            </Chip>
          ))}
        </div>
      )}
      {channels.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
          {channels.map((c, i) => (
            <Chip key={c?.id || i} title={`${human(c?.type)}: ${c?.from} to ${c?.to}`}>
              {human(c?.type)}
            </Chip>
          ))}
        </div>
      )}
    </section>
  );
}

// Each renderer invokes its section as a plain function (not <Section/>) so a
// dormant section returns null straight through, and the empty-shell guard below
// can actually drop it. Returning an element would always be truthy and defeat
// the self-gate the panel promises (an enabled-but-dataless section then showed
// just the "living world" header with nothing under it).
const SECTION_RENDERERS = {
  worldClock: (snapshot) => WorldClockSection({ worldClock: snapshot?.worldClock }),
  dashboard: (snapshot) => DashboardSection({ dashboard: snapshot?.dashboard }),
  chronicle: (snapshot) => ChronicleSection({ chronicle: snapshot?.chronicle }),
  pantheon: (snapshot) => PantheonSection({ pantheon: snapshot?.pantheon }),
  warNetwork: (snapshot) => WarNetworkSection({ warNetwork: snapshot?.warNetwork }),
};

/**
 * @param {Object} props
 * @param {Record<string, any> | null} [props.snapshot]  the pre-sanitized public
 *   world snapshot (worldSnapshotPublic shape: worldClock, chronicle, pantheon,
 *   warNetwork, dashboard). Null when the owner did not share the living world.
 * @param {string[]} [props.sections]  the owner's enabled section keys (a subset
 *   of worldClock / dashboard / chronicle / pantheon / warNetwork). Only these
 *   render, in the canonical Inspector order, and only when the snapshot carries
 *   their data.
 */
export default function CampaignStatePanel({ snapshot, sections }) {
  // Render nothing when the owner did not share the living world (parent shows
  // just the realm-arc summary). A snapshot must be a real object to render.
  if (!snapshot || typeof snapshot !== 'object') return null;

  const enabled = new Set((Array.isArray(sections) ? sections : []).map(String));
  // Render in the canonical Inspector order, gated to the owner's enabled set.
  // Each renderer self-gates to null when its slice of the snapshot is empty, so
  // an enabled-but-dormant section contributes nothing.
  const rendered = SECTION_KEYS
    .filter(key => enabled.has(key))
    .map(key => ({ key, node: SECTION_RENDERERS[key](snapshot) }))
    .filter(item => item.node);

  if (rendered.length === 0) return null;

  return (
    <section
      data-testid="campaign-state-panel"
      style={{ display: 'grid', gap: SP.lg, border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, padding: SP.lg }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Activity size={15} color={GOLD} aria-hidden />
        <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.md, fontWeight: 900 }}>
          The living world
        </h2>
      </div>
      {rendered.map(item => <div key={item.key}>{item.node}</div>)}
    </section>
  );
}
