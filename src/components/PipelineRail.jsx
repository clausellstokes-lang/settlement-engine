/**
 * PipelineRail.jsx - "How this was simulated" rail.
 *
 * The single most important new feature in the UI redesign (§7.4): a
 * column beside the dossier output that lists every procedural step
 * the engine ran, with a one-line factual summary of what each step
 * actually decided on this run. Tapping a step expands its full
 * description.
 *
 * Why it matters:
 *   The dossier is the "what". This rail is the "how". Together they
 *   answer the new-user question "is this AI just inventing things?"
 *   with a falsifiable, scrollable receipt of fifteen procedural
 *   decisions that produced the dossier.
 *
 * Implementation:
 *   The rail reads pipelineHistory from the store (populated by
 *   settlementSlice's generate() handler). Each entry has { id, ts,
 *   summary }; metaForStep maps the id to a human label + description.
 *
 *   Procedural steps render with a cog icon (bronze). AI refinement
 *   passes - when the user runs the AI features - render with a quill
 *   icon (violet). The "cog vs quill" visual grammar matches the
 *   §2.4 design system.
 *
 * Flag: `pipelineRail` (default true). Killswitch if a regression is
 * found post-deploy.
 */

import { useState } from 'react';
import { FS, swatch } from './theme.js';
import { Cog, Feather, ChevronRight, ChevronDown } from 'lucide-react';
import { useStore } from '../store/index.js';
import { metaForStep } from '../generators/steps/stepMetadata.js';
import { tracesByStep } from '../domain/trace.js';
import { simulationSpineRows } from '../domain/simulationSpine.js';
import { t } from '../copy/index.js';

// Visual grammar - kept here so the rail's identity is one read.
const COG_COLOR = '#8C6F32';      // gold-700 (procedural, bronze cog)
const QUILL_COLOR = '#7B4FCF';    // violet-500 (AI refinement, quill)
const RAIL_BG = '#FBF5E6';        // parchment-50
const RAIL_BORDER = '#E8D9B0';    // parchment-200
const INK = '#1B1408';
const BODY = '#4A3B22';           // ink-600 (WCAG-passing)
const MUTED = '#6b5340';

function StepRow({ entry, isLast, traces }) {
  const [open, setOpen] = useState(false);
  const meta = metaForStep(entry.id);
  const isAi = entry.kind === 'ai';
  const Icon = isAi ? Feather : Cog;
  const color = isAi ? QUILL_COLOR : COG_COLOR;
  const Chevron = open ? ChevronDown : ChevronRight;
  const stepTraces = Array.isArray(traces) ? traces : [];

  return (
    <li style={{
      position: 'relative',
      paddingLeft: 28,
      paddingBottom: isLast ? 0 : 14,
    }}>
      {/* Vertical timeline thread */}
      {!isLast && (
        <span style={{
          position: 'absolute', left: 11, top: 22, bottom: 0,
          width: 1, background: RAIL_BORDER,
        }} />
      )}
      {/* Icon */}
      <span style={{
        position: 'absolute', left: 0, top: 2,
        width: 22, height: 22, borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: swatch.white, border: `1px solid ${color}`,
        color,
      }}>
        <Icon size={12} aria-hidden="true" />
      </span>
      {/* Row content (clickable to expand) */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'block', width: '100%', textAlign: 'left',
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: 0, color: INK,
          fontFamily: 'Nunito, system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: FS.md, fontWeight: 600, color: INK }}>
            {meta.label}
          </span>
          <Chevron size={11} color={MUTED} style={{ flexShrink: 0, transform: 'translateY(1px)' }} aria-hidden="true" />
        </div>
        {entry.summary && (
          <div style={{ fontSize: FS.xs, color: BODY, marginTop: 2, lineHeight: 1.45 }}>
            {entry.summary}
          </div>
        )}
        {open && meta.description && (
          <div style={{
            fontSize: FS.xs, fontStyle: 'italic',
            color: MUTED, marginTop: 6,
            fontFamily: 'Crimson Text, Georgia, serif',
            lineHeight: 1.55,
          }}>
            {meta.description}
          </div>
        )}
        {/* Trace decisions - only rendered when the step has emitted
            structured traces (Tier 2.1). Today only assembleInstitutions
            emits these; the rest of the pipeline will adopt incrementally.
            Each trace is rendered as a small block: "what was decided"
            on top, then the bullet causes, then downstream effects. */}
        {open && stepTraces.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {stepTraces.slice(0, 8).map((trace, i) => (
              <div key={i} style={{
                padding: '6px 8px',
                background: swatch.white,
                border: `1px solid ${RAIL_BORDER}`,
                borderRadius: 4,
                fontSize: FS.xs, color: BODY, lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 600, color: INK }}>
                  {trace.targetId} <span style={{ color: MUTED, fontWeight: 400 }}>{trace.result}</span>
                </div>
                {Array.isArray(trace.causes) && trace.causes.length > 0 && (
                  <ul style={{ margin: '3px 0 0', paddingLeft: 14, listStyle: 'square' }}>
                    {trace.causes.map((c, j) => (
                      <li key={j} style={{ marginTop: 2 }}>
                        <span style={{ color: INK }}>{c.source}</span>
                        {c.effect ? <span style={{ color: MUTED }}> · {c.effect}</span> : null}
                        {c.reason ? (
                          <div style={{
                            fontSize: FS['10.5'], fontStyle: 'italic',
                            color: MUTED, marginTop: 1,
                            fontFamily: 'Crimson Text, Georgia, serif',
                          }}>
                            {c.reason}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
                {Array.isArray(trace.downstreamEffects) && trace.downstreamEffects.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: FS.xxs, color: MUTED }}>
                    Downstream:{' '}
                    {trace.downstreamEffects.map((d, k) => (
                      <span key={k}>
                        {k > 0 ? ', ' : ''}
                        <span style={{ color: INK }}>{d.target}</span> {d.effect}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {stepTraces.length > 8 && (
              <div style={{ fontSize: FS.xxs, color: MUTED, fontStyle: 'italic' }}>
                + {stepTraces.length - 8} more decisions in this step
              </div>
            )}
          </div>
        )}
      </button>
    </li>
  );
}

// ── Simulation spine card ──────────────────────────────────────────────────
// Sits at the top of the rail, above the step list. Seven-line distillation
// of the settlement's causal identity (Tier 2.5). Renders only when at
// least one spine line is non-placeholder.

function SimulationSpine({ settlement }) {
  const rows = simulationSpineRows(settlement);
  if (!rows.length) return null;
  return (
    <section
      aria-label="Simulation spine"
      style={{
        marginBottom: 14,
        padding: '10px 12px',
        background: swatch.white,
        border: `1px solid ${RAIL_BORDER}`,
        borderLeft: `3px solid ${COG_COLOR}`,
        borderRadius: 4,
        fontFamily: 'Nunito, system-ui, sans-serif',
      }}
    >
      <div style={{
        fontSize: FS.xxs, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: MUTED,
        marginBottom: 4,
      }}>
        Spine
      </div>
      <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {rows.map(([label, body], i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <dt style={{
              fontSize: FS.xxs, color: MUTED, fontWeight: 600,
              letterSpacing: '0.04em',
            }}>
              {label}
            </dt>
            <dd style={{
              margin: 0, fontSize: FS.sm, color: BODY, lineHeight: 1.5,
              fontFamily: 'Crimson Text, Georgia, serif',
            }}>
              {body}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function PipelineRail({ compact = false }) {
  const history = useStore(s => s.pipelineHistory);
  // Read the active settlement so trace lookups + the spine card have
  // their data source. Subscribes through useStore so a regeneration
  // refreshes the rail.
  const settlement = useStore(s => s.settlement);

  if (!history || history.length === 0) return null;

  return (
    <aside
      aria-label="How this was simulated"
      style={{
        background: RAIL_BG,
        border: `1px solid ${RAIL_BORDER}`,
        borderRadius: 8,
        padding: compact ? '12px 14px' : '16px 18px',
        fontFamily: 'Nunito, system-ui, sans-serif',
      }}
    >
      <header style={{ marginBottom: 12 }}>
        <h3 style={{
          margin: 0,
          fontFamily: 'Crimson Text, Georgia, serif',
          fontSize: FS['18'], fontWeight: 600, color: INK,
        }}>
          {t('pipeline.title')}
        </h3>
        <p style={{
          margin: '4px 0 0',
          fontSize: FS.sm, fontStyle: 'italic', color: BODY,
          fontFamily: 'Crimson Text, Georgia, serif',
          lineHeight: 1.5,
        }}>
          {t('pipeline.subtitle')}
        </p>
        {/* Visual legend - explains the cog vs quill grammar exactly
            once, at the top, so the meaning is set before the user
            reads any step. */}
        <div style={{
          display: 'flex', gap: 14, marginTop: 10,
          fontSize: FS.xxs, color: MUTED, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Cog size={11} color={COG_COLOR} aria-hidden="true" />
            {t('pipeline.cogLabel')}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Feather size={11} color={QUILL_COLOR} aria-hidden="true" />
            {t('pipeline.quillLabel')}
          </span>
        </div>
      </header>

      {/* Simulation spine - the 7-line distillation. Only renders when
          the settlement has the underlying fields populated; tolerant
          of bare settlements via simulationSpineRows. */}
      <SimulationSpine settlement={settlement} />

      <ol style={{
        listStyle: 'none', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        {history.map((entry, i) => (
          <StepRow
            key={`${entry.id}-${i}`}
            entry={entry}
            isLast={i === history.length - 1}
            traces={tracesByStep(settlement, entry.id)}
          />
        ))}
      </ol>
    </aside>
  );
}
