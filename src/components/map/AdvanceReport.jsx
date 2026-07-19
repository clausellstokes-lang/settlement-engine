/**
 * AdvanceReport — THE CHRONICLE advance-report surface (design
 * docs/DESIGN_CHRONICLE_LEGIBILITY.md). The span-scaled zoom pyramid (§1) +
 * delta-first lead (§3) + typed threads (§2) + the deputy's diary (§4) + THE
 * DECREE TRACKER (§5/§5b) — one navigable report after every advance.
 *
 * Pure display: it reads ONLY the durable stores through the chronicle
 * read-models (never the capped wizardNews feed — §6). SELF-GATES TO EMPTY: a
 * fresh campaign (no pulseHistory) renders the empty invitation — byte-identical
 * off-state. The only store write is the map-highlight selection (UI state).
 *
 * TEACHING (design §7 / the whisper criterion): the pyramid is self-explaining —
 * the altitude tabs, the honest labels (standing, "week k of N", the
 * inferred-cone note), and the empty-state invitation ARE the whispers, riding
 * existing organs. A formal guidanceRegistry map-pane surface is deferred to the
 * map-coordinated guidance pass (that registry reserves map surfaces) — a
 * recorded JUDGMENT, not an omission.
 */

import { useMemo, useState } from 'react';
import {
  BookOpen, ChevronLeft, ChevronRight, GitBranch, Landmark, MapPin, ScrollText,
  Scale, Sparkles, TrendingUp, TrendingDown,
} from 'lucide-react';

import { useStore } from '../../store/index.js';
import { advanceEntries } from '../../domain/display/chronicleGraph.js';
import { chronicleForAdvance, hasChronicle } from '../../domain/display/chronicleReadModel.js';
import { decreesForAdvance } from '../../domain/display/decreeTracker.js';
import {
  AMBER, AMBER_BG, BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GOLD_BG, GREEN,
  INK, MUTED, RED, R, SECOND, SP, VIOLET, VIOLET_BG, sans,
} from '../theme.js';
import Button from '../primitives/Button.jsx';

const human = (v) => String(v || '').replace(/_/g, ' ');

const CLASS_LABEL = {
  war: 'War', succession_coup: 'Succession', plague: 'Plague', calamity: 'Calamity',
  schism_contest: 'Schism', economic_shock: 'Economy', boom_flourishing: 'Flourishing',
  reframe: 'Reframe',
};

const STANDING_TONE = {
  held: GREEN, absorbed: SECOND, contested: AMBER, undone: RED, null: MUTED,
};

// ── Small shared cells ───────────────────────────────────────────────────────

function SectionTitle({ icon: Icon, children, tone = GOLD }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: tone, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
      <Icon size={13} /> {children}
    </div>
  );
}

function Chip({ children, tone = SECOND, bg = CARD_ALT }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 7px',
      borderRadius: R.pill || 999, background: bg, color: tone,
      fontFamily: sans, fontSize: FS.micro, fontWeight: 850, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

/** A clickable receipt row → highlights the affected settlement on the map. */
function ReceiptRow({ node, resolveName, onHighlight }) {
  const ids = (node.settlementIds || node.receipt?.settlementIds || []).filter((id) => id && !String(id).includes(':'));
  const names = ids.map(resolveName).filter(Boolean);
  const canHighlight = ids.length > 0;
  const body = (
    <>
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, lineHeight: 1.3 }}>
        {node.headline}
      </div>
      {node.summary ? (
        <p style={{ margin: '2px 0 0', color: BODY, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.4 }}>{node.summary}</p>
      ) : null}
      {names.length > 0 && (
        <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 4, color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 800 }}>
          <MapPin size={9} color={GOLD} /> {names.slice(0, 3).join(', ')}{names.length > 3 ? ` +${names.length - 3}` : ''}
        </div>
      )}
    </>
  );
  const style = { border: `1px solid ${BORDER2}`, borderRadius: R.sm, background: CARD, padding: '6px 8px' };
  if (!canHighlight) return <div data-testid="chronicle-receipt" style={style}>{body}</div>;
  const go = () => onHighlight(ids[0]);
  return (
    <div
      data-testid="chronicle-receipt"
      role="button" tabIndex={0}
      aria-label={`Highlight ${names[0] || 'affected settlement'} on the map`}
      onClick={go}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }}
      style={{ ...style, cursor: 'pointer' }}
    >{body}</div>
  );
}

// ── Delta-first lead (§3) ────────────────────────────────────────────────────

function DeltaLead({ delta, resolveName }) {
  if (!delta?.hasContent) {
    return (
      <div data-testid="chronicle-delta-empty" style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
        Little changed in the standings.
      </div>
    );
  }
  const { population, tiers, relationships } = delta;
  return (
    <div data-testid="chronicle-delta" style={{ display: 'grid', gap: 5 }}>
      <SectionTitle icon={Sparkles}>What is different</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {population.rose.length > 0 && (
          <Chip tone={GREEN} bg={CARD_ALT}><TrendingUp size={10} /> {population.rose.slice(0, 3).map(resolveName).join(', ')}{population.rose.length > 3 ? ` +${population.rose.length - 3}` : ''} grew</Chip>
        )}
        {population.fell.length > 0 && (
          <Chip tone={RED} bg={CARD_ALT}><TrendingDown size={10} /> {population.fell.slice(0, 3).map(resolveName).join(', ')}{population.fell.length > 3 ? ` +${population.fell.length - 3}` : ''} declined</Chip>
        )}
        {tiers.map((t, i) => (
          <Chip key={`t${i}`} tone={SECOND}>{resolveName(t.id)}: tier {String(t.from)} → {String(t.to)}</Chip>
        ))}
        {relationships.map((r, i) => (
          <Chip key={`r${i}`} tone={r.kind === 'war-declared' ? RED : r.kind === 'alliance-formed' ? GREEN : SECOND}>{human(r.kind)}</Chip>
        ))}
      </div>
    </div>
  );
}

// ── Threads (§2) ─────────────────────────────────────────────────────────────

function ThreadCard({ thread, resolveName, onHighlight, threadsById }) {
  const [open, setOpen] = useState(false);
  const label = CLASS_LABEL[thread.dramaClass] || 'Thread';
  return (
    <article data-testid="chronicle-thread" style={{
      border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${GOLD}`, borderRadius: R.sm,
      background: CARD_ALT, padding: '8px 10px', display: 'grid', gap: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Chip tone={GOLD} bg={GOLD_BG}>{label}</Chip>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, flex: 1, minWidth: 0 }}>{thread.title}</span>
        <Button variant="ghost" size="sm" aria-expanded={open} aria-label={open ? 'Collapse thread' : 'Expand thread'} onClick={() => setOpen(v => !v)} style={{ minHeight: undefined, padding: 2 }}>
          {open ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
        </Button>
      </div>
      {/* Arc: began → turned → stands-now (a structural summary; the collapse
          removed interior time — see the read-model note). */}
      <div style={{ color: BODY, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.5 }}>
        <strong style={{ color: SECOND }}>Began</strong> {thread.arc.began}
        {thread.arc.turned && thread.arc.turned !== thread.arc.began ? <> · <strong style={{ color: SECOND }}>turned</strong> {thread.arc.turned}</> : null}
        {thread.arc.stands && thread.arc.stands !== thread.arc.turned ? <> · <strong style={{ color: SECOND }}>stands</strong> {thread.arc.stands}</> : null}
      </div>
      {thread.crossLinks?.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', color: VIOLET, fontFamily: sans, fontSize: FS.micro, fontWeight: 800 }}>
          <GitBranch size={10} /> touches
          {thread.crossLinks.slice(0, 3).map((l, i) => (
            <Chip key={i} tone={VIOLET} bg={VIOLET_BG}>{CLASS_LABEL[threadsById.get(l.id)?.dramaClass] || 'thread'}</Chip>
          ))}
          <span style={{ color: MUTED, fontWeight: 700 }}>({thread.crossLinks.some((l) => !l.inferred) ? 'recorded' : 'inferred'})</span>
        </div>
      )}
      {open && (
        <div style={{ display: 'grid', gap: 4, marginTop: 2 }}>
          {thread.beats.map((b) => (
            <ReceiptRow key={b.nodeId} node={{ headline: b.headline, summary: b.summary, settlementIds: [] }} resolveName={resolveName} onHighlight={onHighlight} />
          ))}
        </div>
      )}
    </article>
  );
}

// ── The Deputy's Diary (§4) ──────────────────────────────────────────────────

function DeputyDiary({ diary }) {
  if (!diary || diary.count === 0) return null;
  return (
    <div data-testid="chronicle-deputy-diary" style={{ display: 'grid', gap: 5 }}>
      <SectionTitle icon={Scale} tone={SECOND}>Rulings in your absence</SectionTitle>
      <div style={{ display: 'grid', gap: 4 }}>
        {diary.verdicts.slice(0, 12).map((v, i) => (
          <div key={i} style={{ border: `1px solid ${BORDER2}`, borderRadius: R.sm, background: CARD, padding: '6px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, flex: 1, minWidth: 0 }}>{v.headline}</span>
              <Chip tone={v.reversibility === 'consumed' ? MUTED : GREEN}>
                {v.reversibility === 'consumed' ? 'consumed' : 'still amendable'}
              </Chip>
            </div>
            {v.reversibilityInferred && (
              <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, marginTop: 2 }}>reversibility inferred</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── THE DECREE TRACKER (§5 / §5b) ────────────────────────────────────────────

function StandingBadge({ standing }) {
  return <Chip tone={STANDING_TONE[standing] || MUTED}>{human(standing === 'null' ? 'no effect' : standing)}</Chip>;
}

function DecreeCard({ decree, within }) {
  return (
    <div data-testid="chronicle-decree" style={{ border: `1px solid ${BORDER2}`, borderRadius: R.sm, background: CARD, padding: '7px 9px', display: 'grid', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Chip tone={AMBER} bg={AMBER_BG}><Landmark size={10} /> {human(decree.kind)}</Chip>
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, fontWeight: 800 }}>{decree.landing.label}</span>
        <span style={{ flex: 1 }} />
        <StandingBadge standing={within || decree.standing} />
      </div>
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700 }}>{decree.receipt?.headline || 'Your order'}</div>
      {decree.honestNull ? (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, fontStyle: 'italic' }}>{decree.finding}</div>
      ) : (
        <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro }}>
          {decree.coneSize} downstream {decree.coneSize === 1 ? 'effect' : 'effects'} <span style={{ color: MUTED }}>({decree.coneInferred === false ? 'recorded' : 'inferred'} cone)</span>
          {decree.breakingReason ? <> · <span style={{ color: RED }}>{decree.breakingReason}</span></> : null}
        </div>
      )}
    </div>
  );
}

function DecreeCluster({ cluster }) {
  return (
    <div data-testid="chronicle-decree-cluster" style={{
      border: `1px solid ${cluster.selfConflict ? RED : AMBER}`, borderLeft: `3px solid ${cluster.selfConflict ? RED : AMBER}`,
      borderRadius: R.sm, background: AMBER_BG, padding: '8px 10px', display: 'grid', gap: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Chip tone={cluster.selfConflict ? RED : AMBER} bg={CARD}>{human(cluster.relation)}</Chip>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 850 }}>{cluster.jointStory}</span>
      </div>
      <div style={{ display: 'grid', gap: 4 }}>
        {cluster.decrees.map((d) => (
          <DecreeCard key={d.decreeId} decree={{ ...d, coneSize: d.coneSize ?? 0, honestNull: false, landing: d.landing, receipt: d.receipt, kind: d.kind }} within={d.standingWithin} />
        ))}
      </div>
    </div>
  );
}

function DecreeSection({ decrees }) {
  // ALWAYS present (owner ruling) — even with zero decrees, the section renders
  // its honest empty line so the DM's choices are never lost.
  return (
    <div data-testid="chronicle-decree-section" style={{
      border: `1px solid ${AMBER}`, borderRadius: R.md, background: CARD_ALT, padding: '9px 11px', display: 'grid', gap: 7,
    }}>
      <SectionTitle icon={Landmark} tone={AMBER}>Your decrees</SectionTitle>
      {decrees.total === 0 ? (
        <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
          You issued no orders this advance.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 5 }}>
          {decrees.clusters.map((c) => <DecreeCluster key={c.clusterId} cluster={c} />)}
          {decrees.singletons.map((d) => <DecreeCard key={d.decreeId} decree={d} />)}
          {decrees.nulls.map((d) => <DecreeCard key={d.decreeId} decree={d} />)}
        </div>
      )}
    </div>
  );
}

// ── Altitude navigation (§1 zoom pyramid) ────────────────────────────────────

const ALL_ALTITUDES = ['headline', 'chapters', 'threads', 'events'];
const ALTITUDE_LABEL = { headline: 'Headline', chapters: 'Chapters', threads: 'Threads', events: 'Events' };

// ── The report ───────────────────────────────────────────────────────────────

/**
 * @param {Object} props
 * @param {any} props.campaign
 * @param {(id: any) => string} [props.nameFor]
 */
// H2 · THE FIRST ADVANCE — a session-scoped one-shot for the report slip. The
// advance report lives in the Chronicle section, which the advance flow does not
// auto-open (the inspector opens to Pulse on advance), so the report cannot ride
// the same mount-time signal the pulse page and the medallions use. Instead it
// slips onto the desk (oc-m-slipin) the FIRST time it is viewed with a chronicle
// present this session. This module-scoped flag is presentation-only session
// memory — not persisted, not a store field — and re-evaluates (resets) on a
// full reload, so a returning reader sees the report already at rest.
let reportSlipShown = false;

export default function AdvanceReport({ campaign, nameFor }) {
  const setSelectedSettlementId = useStore(s => s.setSelectedSettlementId);
  const resolveName = nameFor || ((id) => String(id));
  const worldState = campaign?.worldState;

  const entries = useMemo(() => advanceEntries(worldState), [worldState]);
  const [index, setIndex] = useState(0);
  // Consume the session one-shot only when this mount will actually render a
  // chronicle — the `both`-fill slip plays once and rests, so no cleanup timer.
  const [reportSlip] = useState(() => {
    if (!worldState || !hasChronicle(worldState) || reportSlipShown) return false;
    reportSlipShown = true;
    return true;
  });
  const safeIndex = Math.min(index, Math.max(0, entries.length - 1));
  const entry = entries[safeIndex] || null;

  // THE PROVENANCE LEDGER (engine finale): recorded receipt→parent cause-edges. Present
  // only when provenanceLedgerEnabled lit the campaign; absent ⇒ the chronicle infers
  // from shared entities exactly as before. A plain read — no engine import.
  const provenance = worldState?.spatialLedgers?.provenance;
  const hasRecordedEdges = !!provenance && Object.keys(provenance).length > 0;
  const chronicle = useMemo(() => (entry ? chronicleForAdvance(entry, provenance) : null), [entry, provenance]);
  const decrees = useMemo(() => (entry ? decreesForAdvance(entry, provenance) : null), [entry, provenance]);

  // The altitude the reader is viewing — defaults to the span's deepest scaffolding
  // (full descent always AVAILABLE via the tabs).
  const [altitude, setAltitude] = useState(/** @type {string|null} */(null));

  if (!campaign) return null;

  if (!hasChronicle(worldState) || !chronicle) {
    return (
      <div data-testid="advance-report-empty" style={{
        padding: SP.md, border: `1px dashed ${BORDER2}`, borderRadius: R.md,
        color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 750, lineHeight: 1.5,
      }}>
        No advance to report yet. Advance the realm and this report will compress what
        happened — a week, a season, or a year — into headline, chapters, threads, and
        the receipts beneath, and it will track how your decrees fared.
      </div>
    );
  }

  const activeAltitude = altitude || chronicle.altitudes[0];
  const show = (name) => chronicle.altitudes.includes(name) || activeAltitude === name || name === 'events';

  return (
    <div data-testid="advance-report" className={reportSlip ? 'oc-m-slipin' : undefined} style={{ display: 'grid', gap: SP.sm }}>
      {/* ── Advance scrubber ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, padding: `6px ${SP.sm}px`, border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD_ALT }}>
        <Button variant="ghost" size="sm" aria-label="Newer advance" disabled={safeIndex <= 0} onClick={() => setIndex(i => Math.max(0, i - 1))} style={{ minHeight: undefined, padding: 2 }}>
          <ChevronLeft size={15} />
        </Button>
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>{chronicle.headline}</div>
          <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro }}>
            the {chronicle.spanLabel} to tick {chronicle.tick} · {safeIndex + 1} of {entries.length}
          </div>
        </div>
        <Button variant="ghost" size="sm" aria-label="Older advance" disabled={safeIndex >= entries.length - 1} onClick={() => setIndex(i => Math.min(entries.length - 1, i + 1))} style={{ minHeight: undefined, padding: 2 }}>
          <ChevronRight size={15} />
        </Button>
      </div>

      {/* ── Altitude tabs (drill-down; full descent always available) ─────── */}
      <div role="group" aria-label="Zoom altitude" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {ALL_ALTITUDES.map((name) => {
          const isDefault = chronicle.altitudes.includes(name);
          const active = activeAltitude === name;
          return (
            <Button key={name} variant="ghost" size="sm" aria-pressed={active} onClick={() => setAltitude(name)}
              style={{ minHeight: undefined, padding: '2px 8px', border: `1px solid ${active ? GOLD : BORDER2}`, borderRadius: R.sm, background: active ? GOLD : CARD, color: active ? INK : (isDefault ? SECOND : MUTED), fontSize: FS.micro, fontWeight: 850 }}>
              {ALTITUDE_LABEL[name]}
            </Button>
          );
        })}
      </div>

      {/* ── Delta-first lead (always) ────────────────────────────────────── */}
      <DeltaLead delta={chronicle.delta} resolveName={resolveName} />

      {/* ── Chapters (season frame) ──────────────────────────────────────── */}
      {show('chapters') && chronicle.chapters.length > 0 && (
        <div data-testid="chronicle-chapters" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <SectionTitle icon={ScrollText} tone={SECOND}>Chapters</SectionTitle>
          {chronicle.chapters.map((c, i) => <Chip key={i} tone={SECOND}>{c.label}</Chip>)}
        </div>
      )}

      {/* ── Threads ──────────────────────────────────────────────────────── */}
      {show('threads') && chronicle.threads.length > 0 && (
        <div style={{ display: 'grid', gap: 6 }}>
          <SectionTitle icon={BookOpen}>Threads</SectionTitle>
          {chronicle.threads.map((t) => (
            <ThreadCard key={t.id} thread={t} resolveName={resolveName} onHighlight={setSelectedSettlementId} threadsById={new Map(chronicle.threads.map(x => [x.id, x]))} />
          ))}
        </div>
      )}

      {/* ── The deputy's diary ───────────────────────────────────────────── */}
      <DeputyDiary diary={chronicle.deputyDiary} />

      {/* ── Events (the receipts — always the deepest layer) ─────────────── */}
      {show('events') && activeAltitude === 'events' && (
        <div data-testid="chronicle-events" style={{ display: 'grid', gap: 4 }}>
          <SectionTitle icon={Sparkles}>Events</SectionTitle>
          {chronicle.events.map((e) => (
            <ReceiptRow key={e.nodeId} node={{ headline: e.headline, summary: e.summary, settlementIds: e.receipt?.settlementIds || [] }} resolveName={resolveName} onHighlight={setSelectedSettlementId} />
          ))}
        </div>
      )}

      {/* ── THE DECREE TRACKER — always present, never top-forced ────────── */}
      <DecreeSection decrees={decrees} />

      {/* ── Self-explaining footer (the whisper via an existing organ) ───── */}
      <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.5, borderTop: `1px solid ${BORDER2}`, paddingTop: 6 }}>
        This report compresses — never truncates — what unfolded, scaled to the span.
        {hasRecordedEdges
          ? ' Causal links are recorded from the engine’s provenance ledger where marked, inferred from shared entities otherwise; click any receipt to find it on the map.'
          : ' Causal links between events are inferred from what they touched; click any receipt to find it on the map.'}
      </div>
    </div>
  );
}
