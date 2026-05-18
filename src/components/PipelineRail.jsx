/**
 * PipelineRail.jsx — "How this was simulated" rail.
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
 *   passes — when the user runs the AI features — render with a quill
 *   icon (violet). The "cog vs quill" visual grammar matches the
 *   §2.4 design system.
 *
 * Flag: `pipelineRail` (default true). Killswitch if a regression is
 * found post-deploy.
 */

import React, { useState } from 'react';
import { Cog, Feather, ChevronRight, ChevronDown } from 'lucide-react';
import { useStore } from '../store/index.js';
import { useFlag } from '../lib/flags.js';
import { metaForStep } from '../generators/steps/stepMetadata.js';
import { t } from '../copy/index.js';

// Visual grammar — kept here so the rail's identity is one read.
const COG_COLOR = '#8C6F32';      // gold-700 (procedural, bronze cog)
const QUILL_COLOR = '#7B4FCF';    // violet-500 (AI refinement, quill)
const RAIL_BG = '#FBF5E6';        // parchment-50
const RAIL_BORDER = '#E8D9B0';    // parchment-200
const INK = '#1B1408';
const BODY = '#4A3B22';           // ink-600 (WCAG-passing)
const MUTED = '#6b5340';

function StepRow({ entry, isLast }) {
  const [open, setOpen] = useState(false);
  const meta = metaForStep(entry.id);
  const isAi = entry.kind === 'ai';
  const Icon = isAi ? Feather : Cog;
  const color = isAi ? QUILL_COLOR : COG_COLOR;
  const Chevron = open ? ChevronDown : ChevronRight;

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
        background: '#fff', border: `1px solid ${color}`,
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
          <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>
            {meta.label}
          </span>
          <Chevron size={11} color={MUTED} style={{ flexShrink: 0, transform: 'translateY(1px)' }} aria-hidden="true" />
        </div>
        {entry.summary && (
          <div style={{ fontSize: 11, color: BODY, marginTop: 2, lineHeight: 1.45 }}>
            {entry.summary}
          </div>
        )}
        {open && meta.description && (
          <div style={{
            fontSize: 11, fontStyle: 'italic',
            color: MUTED, marginTop: 6,
            fontFamily: 'Crimson Text, Georgia, serif',
            lineHeight: 1.55,
          }}>
            {meta.description}
          </div>
        )}
      </button>
    </li>
  );
}

export default function PipelineRail({ compact = false }) {
  const enabled = useFlag('pipelineRail');
  const history = useStore(s => s.pipelineHistory);

  if (!enabled) return null;
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
          fontSize: 18, fontWeight: 600, color: INK,
        }}>
          {t('pipeline.title')}
        </h3>
        <p style={{
          margin: '4px 0 0',
          fontSize: 12, fontStyle: 'italic', color: BODY,
          fontFamily: 'Crimson Text, Georgia, serif',
          lineHeight: 1.5,
        }}>
          {t('pipeline.subtitle')}
        </p>
        {/* Visual legend — explains the cog vs quill grammar exactly
            once, at the top, so the meaning is set before the user
            reads any step. */}
        <div style={{
          display: 'flex', gap: 14, marginTop: 10,
          fontSize: 10, color: MUTED, fontWeight: 600,
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

      <ol style={{
        listStyle: 'none', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        {history.map((entry, i) => (
          <StepRow key={`${entry.id}-${i}`} entry={entry} isLast={i === history.length - 1} />
        ))}
      </ol>
    </aside>
  );
}
