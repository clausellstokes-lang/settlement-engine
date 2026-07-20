/**
 * SessionMode.jsx — W-Session. The desktop-width, distraction-free run-of-play
 * surface for a DM mid-session (docs/briefs/SESSION_FOUNDRY_SCOPE.md §D5).
 *
 * Where TableView (P142) is the 380px glance-at-your-phone cheat sheet, this
 * is the second-screen surface: tonight's beats, the live world state, the
 * people at the table's elbow, and the threads to pull — with a quick-nav
 * rail, big serif type, and nothing else.
 *
 * COMPOSITION, NEVER FORKS — every panel renders an existing read-model:
 *   • Tonight   — tonightAtTheTable() (the same pure composer TableView and
 *                 the magazine Summary use).
 *   • State     — the store's hydrated systemState (four dims) + the eventLog
 *                 tail; both empty/absent on a draft settlement, and the
 *                 panels degrade to nothing.
 *   • War       — the WarFaithTab pattern verbatim: the owning campaign's
 *                 worldState fed ONLY to the light war read-models
 *                 (warStatus / mobilizationStatus / occupationStatus — never
 *                 the pantheon, never THEIRS' useSettlementLiveWorld).
 *   • Faith     — FaithSection AS-IS: the constitutional premium seam,
 *                 unchanged. Free/anon never see a latent deity name here.
 *   • NPCs      — settlement.npcs by power (the NotableNPCs ordering).
 *   • Hooks     — collectPlotHooks() (the canonical hook collector).
 *
 * Mounting is the TableView doctrine: the caller (SettlementDetail) gates on
 * flag('sessionMode') and lazy-mounts this chunk only when opened — zero
 * first-paint bytes. Esc closes.
 */

import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { FS, ELEV, swatch } from '../theme.js';
import { formatCount } from '../../domain/formatNumber.js';
import { isFaithEventEntry } from '../../domain/display/faithEventFilter.js';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import { tonightAtTheTable } from '../../domain/summary/tonightAtTheTable.js';
import { collectPlotHooks, PLOT_HOOK_CATEGORIES } from '../../domain/dossier/plotHooks.js';
import { settlementWarStatus, settlementWarExhaustion, warExhaustionBand } from '../../domain/display/warStatus.js';
import { settlementMobilization } from '../../domain/display/mobilizationStatus.js';
import { settlementOccupation, occupierHoldings } from '../../domain/display/occupationStatus.js';
import FaithSection from '../settlement/FaithSection.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Button from '../primitives/Button.jsx';

const GOLD_ACCENT = swatch['#C9A24C'];
const INK = swatch['#1B1408'];
const INK_DEEP = swatch['#2C2210'];
const BODY = swatch['#3A2F18'];
const MUTED = swatch['#9C8068'];
const PARCH = swatch['#FBF5E6'];
const BORDER = swatch['#E8D9B0'];
const GREEN = swatch['#4A7A3A'];
const SLATE = swatch['#5A6E82'];
const AMBER = swatch['#D08020'];
const RED = swatch['#A23434'];

const serif = '"Crimson Text", Georgia, serif';
const sans = '"Nunito", system-ui, sans-serif';

const KIND_ACCENT = { NPC: GREEN, HOOK: AMBER, TWIST: SLATE, RED };

const BAND_TONE = {
  Stable: GREEN, Strained: AMBER, Vulnerable: AMBER, Critical: RED,
};

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: AMBER, marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function Card({ accent = null, children }) {
  return (
    <div style={{
      padding: '10px 12px',
      background: swatch.white,
      border: `1px solid ${BORDER}`,
      borderLeft: accent ? `4px solid ${accent}` : `1px solid ${BORDER}`,
    }}>
      {children}
    </div>
  );
}

/** The war panel — the WarFaithTab read-model set, rendered run-of-play terse. */
function warModel({ saveId, settlement, campaigns, savedSettlements }) {
  const sid = saveId != null ? String(saveId)
    : (settlement?.id != null ? String(settlement.id) : null);
  if (!sid || !Array.isArray(campaigns)) return null;
  const campaign = campaigns.find(c =>
    (c.settlementIds || []).map(String).includes(sid) && c.worldState?.canonizedAt);
  if (!campaign) return null;
  const worldState = campaign.worldState;
  const regionalGraph = campaign.regionalGraph || worldState.regionalGraph || null;
  const byId = new Map();
  (savedSettlements || []).forEach(s => {
    const i = String(s?.id ?? s?.settlement?.id ?? '');
    if (i) byId.set(i, s?.settlement?.name || s?.name || i);
  });
  const nameFor = (id) => byId.get(String(id)) || String(id);
  const status = settlementWarStatus({ settlementId: sid, worldState, regionalGraph });
  const exhaustionRaw = settlementWarExhaustion({ settlementId: sid, worldState });
  const model = {
    status,
    exhaustionRaw,
    exhaustionBand: warExhaustionBand(exhaustionRaw),
    mobilization: settlementMobilization({ settlementId: sid, worldState }),
    occupied: settlementOccupation({ settlementId: sid, worldState, nameFor }),
    holdings: occupierHoldings({ settlementId: sid, worldState, nameFor }),
    nameFor,
  };
  const hasWar = !!(
    status?.besiegedBy?.length || status?.besiegingTargets?.length
    || exhaustionRaw > 0 || model.mobilization || model.occupied || model.holdings
  );
  return hasWar ? model : null;
}

function WarPanel({ war }) {
  const { status, exhaustionBand, mobilization, occupied, holdings, nameFor } = war;
  const rows = [];
  if (status?.besiegedBy?.length) {
    rows.push(['Under siege', RED, `${status.besiegedBy.map(nameFor).join(', ')} at the walls.`]);
  }
  if (status?.besiegingTargets?.length) {
    rows.push(['At war', RED, `Its army besieges ${status.besiegingTargets.map(nameFor).join(', ')}.`]);
  }
  if (occupied) {
    rows.push(['Occupied', RED, occupied.statePhrase
      ? `Held by ${occupied.occupierName}. ${occupied.statePhrase}${occupied.resistancePhrase ? `; the population is ${occupied.resistancePhrase}.` : '.'}`
      : `Held by ${occupied.occupierName || 'an occupier'}.`]);
  }
  if (mobilization) {
    rows.push(['Mobilizing', AMBER, `${mobilization.phrase}${mobilization.ticksToDeploy > 0 ? ` — roughly ${mobilization.ticksToDeploy} ${mobilization.ticksToDeploy === 1 ? 'week' : 'weeks'} from marching.` : '.'}`]);
  }
  if (holdings?.holds?.length) {
    rows.push(['Occupier', AMBER, `Holds ${holdings.holds.map(h => h.name).join(', ')}${holdings.stretchedThin ? ' — stretched thin.' : '.'}`]);
  }
  if (exhaustionBand && exhaustionBand !== 'rested') {
    rows.push(['War-weary', AMBER, `This settlement's war fatigue reads ${exhaustionBand}.`]);
  }
  if (!rows.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map(([labelText, tone, body], i) => (
        <Card key={i} accent={tone}>
          <span style={{ fontFamily: serif, fontWeight: 700, fontSize: FS.md, color: tone, marginRight: 6 }}>{labelText}.</span>
          <span style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>{body}</span>
        </Card>
      ))}
    </div>
  );
}

/**
 * @param {{ settlement: any, saveId?: string|null, onClose: () => void }} props
 *   Presentational takeover: the caller owns the flag gate and mounts this
 *   lazily only while open (the TableView doctrine).
 */
export default function SessionMode({ settlement, saveId = null, onClose }) {
  // Real modal semantics behind aria-modal: focus moves in, Tab is trapped,
  // Escape dismisses (stacked-aware), and focus restores to the trigger on
  // close — the shared primitive every modal here uses.
  const dialogRef = useDialogFocusTrap(true, onClose);

  const phase = useStore(s => s.phase);
  const systemState = useStore(s => s.systemState);
  const eventLog = useStore(s => s.eventLog);
  const campaigns = useStore(s => s.campaigns);
  const savedSettlements = useStore(s => s.savedSettlements);
  // The FaithSection premium expression, needed here only to decide section /
  // nav PRESENCE (FaithSection itself still owns the content gate).
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const isPremium = tier === 'premium' || elevated;

  const entries = useMemo(() => tonightAtTheTable(settlement), [settlement]);
  const hooks = useMemo(() => collectPlotHooks(settlement || {}), [settlement]);
  const npcs = useMemo(() => (settlement?.npcs || [])
    .slice().sort((a, b) => (b?.power || 0) - (a?.power || 0)).slice(0, 8), [settlement]);
  const war = useMemo(
    () => warModel({ saveId, settlement, campaigns, savedSettlements }),
    [saveId, settlement, campaigns, savedSettlements],
  );

  const dims = systemState ? [
    ['Resilience', systemState.resilience], ['Volatility', systemState.volatility],
    ['Threat', systemState.externalThreat], ['Resources', systemState.resourcePressure],
  ].filter(([, d]) => d) : [];
  // The faith seam applies to the event tail too: the deity event kinds embed
  // the deity's name in their generated narration, so a non-premium viewer's
  // tail drops them (mirrors the Foundry timeline gate).
  const recent = (Array.isArray(eventLog) ? eventLog : [])
    .filter(e => isPremium || !isFaithEventEntry(e))
    .slice(-3).reverse();

  // Faith section PRESENCE mirrors WarFaithTab's faithWillRender: an embed
  // renders to everyone; free/anon get the teaser; premium + deity-free is
  // FaithSection's HIDDEN mode ⇒ no section, no dead nav button.
  const faithVisible = !!(settlement?.config?.primaryDeitySnapshot
    && typeof settlement.config.primaryDeitySnapshot === 'object') || !isPremium;

  // Quick-nav targets are DOM ids (the overlay owns the document while open),
  // which keeps render free of ref reads.
  const nav = [
    entries.length ? ["Tonight", "sf-session-tonight"] : null,
    (dims.length || recent.length || settlement?.pressureSentence) ? ["State", "sf-session-state"] : null,
    war ? ["War", "sf-session-war"] : null,
    faithVisible ? ["Faith", "sf-session-faith"] : null,
    npcs.length ? ["NPCs", "sf-session-npcs"] : null,
    hooks.length ? ["Hooks", "sf-session-hooks"] : null,
  ].filter(Boolean);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Session mode: ${settlement?.name || 'settlement'}`}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: PARCH,
        display: 'flex', flexDirection: 'column',
        fontFamily: sans,
      }}
    >
      {/* Header */}
      <header style={{
        flexShrink: 0,
        padding: '14px 22px',
        background: `linear-gradient(135deg, ${INK} 0%, ${INK_DEEP} 100%)`,
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: ELEV[2],
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            margin: 0, fontFamily: serif, fontWeight: 600, fontSize: FS.xxl,
            color: GOLD_ACCENT, lineHeight: 1.12,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {settlement?.name || 'Untitled settlement'}
          </h1>
          <div style={{ marginTop: 3, fontSize: FS.xxs, color: MUTED, letterSpacing: '0.04em' }}>
            {String(settlement?.tier || 'SETTLEMENT').toUpperCase()}
            {settlement?.population != null && <> · {formatCount(settlement.population)} pop</>}
            {phase === 'canon' && <> · CANON</>}
          </div>
        </div>
        <IconButton Icon={X} label="Close session mode" onClick={onClose} tone="ghost" size="lg" />
      </header>

      {/* Body: quick-nav rail + content column */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center' }}>
        <nav aria-label="Session sections" style={{
          flexShrink: 0, width: 132, padding: '22px 0 22px 18px',
          display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'stretch',
        }}>
          {nav.map(([labelText, sectionId]) => (
            <Button
              key={labelText}
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              style={{
                justifyContent: 'flex-start',
                fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
                letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED,
              }}
            >
              {labelText}
            </Button>
          ))}
        </nav>

        <div style={{
          flex: 1, minWidth: 0, maxWidth: 820, overflowY: 'auto',
          padding: '22px 26px 60px',
          display: 'flex', flexDirection: 'column', gap: 26,
          scrollPaddingTop: 12,
        }}>
          {/* Pressure line — the one-sentence tension, front and center. */}
          {settlement?.pressureSentence && (
            <div style={{
              padding: '12px 16px', background: swatch.white,
              border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD_ACCENT}`,
              fontFamily: serif, fontSize: FS.xl,
              fontStyle: 'italic', color: INK_DEEP, lineHeight: 1.5,
            }}>
              {settlement.pressureSentence}
            </div>
          )}

          {entries.length > 0 && (
            <section id="sf-session-tonight" aria-label="Tonight at the table">
              <SectionTitle>🕯 Tonight at the table</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {entries.map((row, i) => (
                  <Card key={i} accent={KIND_ACCENT[row.kind] || GOLD_ACCENT}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontFamily: serif, fontWeight: 700, fontSize: FS.md, color: INK, minWidth: 0 }}>{row.title}</span>
                      <span style={{ fontSize: FS.nano, fontWeight: 800, color: KIND_ACCENT[row.kind] || GOLD_ACCENT, letterSpacing: '0.08em', flexShrink: 0 }}>{row.kind}</span>
                    </div>
                    <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>{row.body}</div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {(dims.length > 0 || recent.length > 0) && (
            <section id="sf-session-state" aria-label="Settlement state">
              <SectionTitle>Settlement state</SectionTitle>
              {dims.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: recent.length ? 10 : 0 }}>
                  {dims.map(([name, d]) => (
                    <div key={name} style={{
                      flex: '1 1 140px', padding: '8px 10px', background: swatch.white,
                      border: `1px solid ${BORDER}`,
                    }}>
                      <div style={{ fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTED }}>{name}</div>
                      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: FS.lg, color: BAND_TONE[d.band] || INK }}>
                        {d.band || d.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {recent.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {recent.map((en, i) => (
                    <div key={i} style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
                      <strong style={{ color: INK }}>{en?.event?.description || en?.event?.type || 'Event'}</strong>
                      {en?.narrativeSummary ? <> — {en.narrativeSummary}</> : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {war && (
            <section id="sf-session-war" aria-label="Live war state">
              <SectionTitle>⚔ The war right now</SectionTitle>
              <WarPanel war={war} />
            </section>
          )}

          {/* The constitutional faith seam — FaithSection self-gates:
              embeds render to everyone, free/anon get the nameless teaser.
              faithVisible mirrors its HIDDEN mode (premium + deity-free) so
              the section and its nav entry disappear together. */}
          {faithVisible && (
            <section id="sf-session-faith" aria-label="Faith">
              <FaithSection settlement={settlement} />
            </section>
          )}

          {npcs.length > 0 && (
            <section id="sf-session-npcs" aria-label="Key NPCs">
              <SectionTitle>The people at the table&apos;s elbow</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 8 }}>
                {npcs.map((n, i) => {
                  const p = n?.personality;
                  const tell = typeof p === 'object' && p ? (p.tell || p.dominant) : (typeof p === 'string' ? p : null);
                  const goal = typeof n?.goal === 'object' && n.goal ? (n.goal.short || n.goal.long) : n?.goal;
                  const secret = n?.secret && typeof n.secret === 'object' ? n.secret.what : n?.secret;
                  return (
                    <Card key={i} accent={GREEN}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontFamily: serif, fontWeight: 700, fontSize: FS.md, color: INK }}>{n?.name || 'Unnamed'}</span>
                        <span style={{ fontSize: FS.nano, fontWeight: 800, color: MUTED, flexShrink: 0 }}>PWR {n?.power || 0}</span>
                      </div>
                      {(n?.role || n?.title) && <div style={{ fontSize: FS.xs, color: MUTED, marginBottom: 3 }}>{n.role || n.title}</div>}
                      {tell && <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.45 }}>{tell}</div>}
                      {goal && <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.45 }}><em>Wants:</em> {goal}</div>}
                      {secret && (
                        <div style={{ marginTop: 4, fontSize: FS.xs, color: SLATE, lineHeight: 1.45 }}>
                          <span style={{ fontWeight: 800, letterSpacing: '0.06em', fontSize: FS.nano }}>SECRET</span> {secret}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {hooks.length > 0 && (
            <section id="sf-session-hooks" aria-label="Plot hooks">
              <SectionTitle>Threads to pull</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {hooks.slice(0, 12).map((hook, i) => {
                  const cat = PLOT_HOOK_CATEGORIES[hook.category] || PLOT_HOOK_CATEGORIES.tension;
                  return (
                    <Card key={i} accent={cat.color}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontFamily: serif, fontWeight: 700, fontSize: FS.md, color: INK, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hook.source}</span>
                        <span style={{ fontSize: FS.nano, fontWeight: 800, color: cat.color, letterSpacing: '0.08em', flexShrink: 0 }}>{String(cat.label).toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>{hook.text}</div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          <div style={{ marginTop: 'auto', paddingTop: 8, fontSize: FS.xxs, color: MUTED, textAlign: 'center', fontStyle: 'italic' }}>
            Press Esc to return to the dossier
          </div>
        </div>
      </div>
    </div>
  );
}
