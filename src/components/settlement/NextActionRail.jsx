/**
 * NextActionRail — Phase-aware "what should I do next?" panel.
 *
 * The audit's single highest-leverage UX win. Every action that
 * matters at the current state is gathered here, with at most one
 * promoted to primary. The primary follows a deterministic ladder:
 *
 *   draft + unsaved   → Save Draft
 *   draft + saved     → Canonize for Campaign
 *   canon + no events → Apply your first event
 *   canon + has events→ Apply another event
 *
 * Secondaries (Polish, Export, Place on Map, Edit) are always offered
 * when applicable. The rail itself enforces a 5-item visible cap; the
 * rest go into a "Show more" disclosure (handled by ActionRail).
 *
 * The rail does NOT do any of the actions. It dispatches into the
 * existing handlers — this is purely an aggregation surface.
 */

import {
  Save, BookMarked, Zap, Sparkles, FileText, MapPin, Edit3,
} from 'lucide-react';
import { useStore } from '../../store/index.js';
import { getAiCost } from '../../config/pricing.js';
import ActionRail from '../primitives/ActionRail.jsx';
import { COPY } from '../../copy/strings.js';

/**
 * @param {Object} props
 * @param {Object} props.settlement              current settlement
 * @param {Object} [props.save]                  saved-settlement record (optional)
 * @param {Object} props.handlers                wired action handlers from SettlementDetail
 * @param {() => void} props.handlers.onSave
 * @param {() => void} props.handlers.onCanonize
 * @param {() => void} props.handlers.onApplyEvent     scrolls to / focuses EventComposer
 * @param {() => void} props.handlers.onPolishAi
 * @param {() => void} props.handlers.onExport
 * @param {() => void} [props.handlers.onPlaceOnMap]
 * @param {() => void} [props.handlers.onEdit]
 */
export default function NextActionRail({ settlement, save, handlers }) {
  const phase      = useStore(s => s.phase);
  const eventCount = useStore(s => s.eventLog?.length ?? 0);
  const aiSettlement = useStore(s => s.aiSettlement);
  const narrated = !!(aiSettlement || save?.aiSettlement);

  const items = computeItems({ phase, eventCount, narrated, settlement, save, handlers });
  if (!items.length) return null;
  return <ActionRail title="Next best action" items={items} />;
}

/** Pure derivation — testable without the store. */
function computeItems({ phase, eventCount, narrated, _settlement, save, handlers }) {
  const items = [];

  // ── Primary ladder ──────────────────────────────────────────────────
  // The first applicable rung is promoted; the rest fall through as
  // secondaries.
  if (phase === 'draft' && !save && handlers.onSave) {
    items.push({
      id: 'save', primary: true, Icon: Save,
      label: COPY.save.primary,
      hint:  'Saving keeps this draft for later editing.',
      onClick: handlers.onSave,
    });
  } else if (phase === 'draft' && handlers.onCanonize) {
    items.push({
      id: 'canonize', primary: true, Icon: BookMarked,
      label: COPY.detail.canonizeCta,
      hint:  COPY.detail.canonizeHint,
      onClick: handlers.onCanonize,
    });
  } else if (phase === 'canon' && handlers.onApplyEvent) {
    items.push({
      id: 'apply_event', primary: true, Icon: Zap,
      label: eventCount === 0 ? 'Apply your first event' : 'Apply an event',
      hint:  eventCount === 0
        ? 'A change in the world becomes part of the timeline.'
        : `Timeline has ${eventCount} entr${eventCount === 1 ? 'y' : 'ies'}.`,
      onClick: handlers.onApplyEvent,
    });
  }

  // ── Secondaries — always offered when applicable ────────────────────
  if (!narrated && handlers.onPolishAi) {
    items.push({
      id: 'polish', Icon: Sparkles,
      label: COPY.ai.polishCta,
      hint:  COPY.ai.inlineHintFn(getAiCost('narrative')),
      onClick: handlers.onPolishAi,
    });
  }
  if (handlers.onExport) {
    items.push({
      id: 'export', Icon: FileText,
      label: COPY.export.primaryCta,
      onClick: handlers.onExport,
    });
  }
  if (phase === 'canon' && handlers.onPlaceOnMap) {
    items.push({
      id: 'place_on_map', Icon: MapPin,
      label: 'Place on World Map',
      hint:  'Track this canon settlement geographically.',
      onClick: handlers.onPlaceOnMap,
    });
  }
  if (handlers.onEdit) {
    items.push({
      id: 'edit', Icon: Edit3,
      label: phase === 'canon' ? 'Edit (correction)' : 'Edit',
      hint:  phase === 'canon'
        ? 'Authorial correction outside the timeline.'
        : 'Tweak settings without rerolling identity.',
      onClick: handlers.onEdit,
    });
  }
  return items;
}
