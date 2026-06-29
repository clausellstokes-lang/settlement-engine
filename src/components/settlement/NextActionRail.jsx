/**
 * NextActionRail — Phase-aware "what should I do next?" panel.
 *
 * The audit's single highest-leverage UX win. Every action that
 * matters at the current state is gathered here, with at most one
 * promoted to primary. The primary follows a deterministic ladder:
 *
 *   draft + unsaved        → Save Draft
 *   draft + saved          → Canonize for Campaign
 *   canon + not in Realm   → Send it to the Realm   (the gold lifecycle rung)
 *   canon + in Realm       → Apply an event
 *
 * Secondaries (Polish, Export, Place on Map, Edit) are always offered
 * when applicable. The rail itself enforces a 5-item visible cap; the
 * rest go into a "Show more" disclosure (handled by ActionRail).
 *
 * The rail does NOT do any of the actions. It dispatches into the
 * existing handlers — this is purely an aggregation surface.
 */

import { useState } from 'react';
import {
  Save, BookMarked, Zap, Sparkles, FileText, MapPin, Edit3,
} from 'lucide-react';
import { useStore } from '../../store/index.js';
import { getAiCost, getTierDisplayName } from '../../config/pricing.js';
import ActionRail from '../primitives/ActionRail.jsx';
import { ConfirmDialog } from '../primitives/Dialog.jsx';
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
 * @param {() => void} [props.handlers.onPlaceOnMap]    enters / opens the Realm
 * @param {() => void} [props.handlers.onEdit]
 * @param {boolean} [props.simulated]    whether the settlement's realm is clock-bound (in the Realm)
 */
export default function NextActionRail({ settlement, save, handlers, simulated = false }) {
  const phase      = useStore(s => s.phase);
  const eventCount = useStore(s => s.eventLog?.length ?? 0);
  const aiSettlement = useStore(s => s.aiSettlement);
  const narrated = !!(aiSettlement || save?.aiSettlement);

  // Regenerate discards the existing prose and re-spends credits, so the rung
  // routes through a discard-confirm before firing the real action. Owning the
  // dialog here keeps the regenerate lifecycle on the rail (and SettlementDetail
  // at its size ratchet).
  const [confirmRegen, setConfirmRegen] = useState(false);
  const railHandlers = handlers.onRegenerateAi
    ? { ...handlers, onRegenerateAi: () => setConfirmRegen(true) }
    : handlers;

  const items = computeItems({ phase, eventCount, narrated, simulated, settlement, save, handlers: railHandlers });
  if (!items.length) return null;
  return (
    <>
      <ActionRail title="Next best action" items={items} />
      <ConfirmDialog
        open={confirmRegen}
        tone="warning"
        title="Regenerate the narrative?"
        body="The current narrative and daily-life prose will be replaced by a fresh pass, and this spends credits. Chronicle history is preserved."
        confirmLabel="Regenerate"
        onConfirm={() => { setConfirmRegen(false); handlers.onRegenerateAi?.(); }}
        onCancel={() => setConfirmRegen(false)}
      />
    </>
  );
}

/** Pure derivation — testable without the store. */
function computeItems({ phase, eventCount, narrated, simulated, settlement, save, handlers }) {
  // `settlement` is destructured (previously dropped as `_settlement`) so callers
  // that branch on it can. The current ladder reads phase/event/narrated facts;
  // settlement is kept available for future phase-aware rungs.
  void settlement;
  const items = [];
  // The Realm (map chains) is gated to the Cartographer subscription tier
  // (authSlice TIER_GATE: mapChains is premium-only). We surface the required
  // tier name as a small text tag on the rung that enters the Realm, resolved
  // from the canonical tier display map (never a hardcoded literal).
  const realmTier = getTierDisplayName('premium');

  // ── Primary ladder ──────────────────────────────────────────────────
  // The first applicable rung is promoted; the rest fall through as
  // secondaries.
  //
  // The Save-Draft rung is doubly unreachable on the saved-detail surface: that
  // surface mounts the rail only for an already-saved record (`save` is truthy),
  // and SettlementDetail intentionally never wires `handlers.onSave`. Both the
  // `!save` and the `handlers.onSave` guards below therefore gate it off there.
  // The rung is kept (not dropped) so the rail stays reusable on a future
  // unsaved-draft surface that does pass an onSave handler.
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
  } else if (phase === 'canon' && !simulated && handlers.onPlaceOnMap) {
    // The gold lifecycle rung: a canonized settlement that has not yet entered
    // the Realm. Naming the destination gives the next step strong scent (P3/P9).
    items.push({
      id: 'send_to_realm', primary: true, Icon: MapPin,
      label: COPY.detail.sendToRealmCta,
      tag:   realmTier,
      hint:  COPY.detail.sendToRealmHint,
      onClick: handlers.onPlaceOnMap,
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
  // Once a narrative exists, the first-narrate rung is replaced by Regenerate —
  // the (confirm-gated, credit-spending) re-roll that used to live as a button in
  // the dossier header. Surfacing it here keeps narration's full lifecycle on the
  // rail, decoupled from the dossier/editor.
  if (narrated && handlers.onRegenerateAi) {
    items.push({
      id: 'regenerate', Icon: Sparkles,
      label: COPY.ai.regenerateCta,
      hint:  COPY.ai.regenerateHintFn(getAiCost('narrative')),
      onClick: handlers.onRegenerateAi,
    });
  }
  if (handlers.onExport) {
    items.push({
      id: 'export', Icon: FileText,
      label: COPY.export.primaryCta,
      onClick: handlers.onExport,
    });
  }
  // Once the settlement is in the Realm, the gold primary above is no longer the
  // realm rung, so offer "Open the Realm" as an anytime secondary to return to it.
  if (phase === 'canon' && simulated && handlers.onPlaceOnMap) {
    items.push({
      id: 'open_realm', Icon: MapPin,
      label: COPY.detail.openRealmCta,
      tag:   realmTier,
      hint:  COPY.detail.openRealmHint,
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
