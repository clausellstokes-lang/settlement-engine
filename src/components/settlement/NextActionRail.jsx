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
 *
 * RESTORED @ S2r-a (owner's BASE RULING, 2026-07-18): revived from
 * origin/master (d024286e). The ONLY adaptation is copy access: the retired
 * `copy/strings.js` `COPY` map migrated to `copy/en.js` (read via `t()`), so
 * every `COPY.x.y` became `t('x.y')` and the `*HintFn(cost)` calls became
 * `t('ai.*Hint', { cost })` templates. Behavior and store reads are unchanged.
 */

import { useState } from 'react';
import {
  Save, BookMarked, Zap, Sparkles, FileText, MapPin, Edit3, Drama, Image as ImageIcon, Share2, Lock,
} from 'lucide-react';
import { useStore } from '../../store/index.js';
import { getAiCost, getTierDisplayName } from '../../config/pricing.js';
import ActionRail from '../primitives/ActionRail.jsx';
import { ConfirmDialog } from '../primitives/Dialog.jsx';
import { t } from '../../copy/index.js';

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
export default function NextActionRail({ settlement, save, handlers, simulated = false, canEdit = false, galleryPublished = false }) {
  const phase      = useStore(s => s.phase);
  const eventCount = useStore(s => s.eventLog?.length ?? 0);
  const aiSettlement = useStore(s => s.aiSettlement);
  const aiDailyLife  = useStore(s => s.aiDailyLife);
  // "Narrated" means EITHER prose layer exists — the refined-settlement pass or
  // the daily-life pass — in the live store OR the persisted save. The save keeps
  // both under `aiData` (never a top-level `save.aiSettlement`), so a
  // daily-life-only save is correctly treated as narrated and gets the
  // (confirm-gated) Regenerate rung, not the credit-spending first-narrate Polish.
  const narrated = !!(
    aiSettlement || aiDailyLife
    || save?.aiData?.aiSettlement || save?.aiData?.aiDailyLife
  );

  // Regenerate discards the existing prose and re-spends credits, so the rung
  // routes through a discard-confirm before firing the real action. Owning the
  // dialog here keeps the regenerate lifecycle on the rail (and SettlementDetail
  // at its size ratchet).
  const [confirmRegen, setConfirmRegen] = useState(false);
  const railHandlers = handlers.onRegenerateAi
    ? { ...handlers, onRegenerateAi: () => setConfirmRegen(true) }
    : handlers;

  const items = computeItems({ phase, eventCount, narrated, simulated, settlement, save, handlers: railHandlers, canEdit, galleryPublished });
  if (!items.length) return null;
  return (
    <>
      {/* Owner order (2026-07-22): the panel is renamed "Actions" and hosts the
          settlement's verbs (relocated out of the header toolbar). */}
      <ActionRail title="Actions" items={items} />
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
function computeItems({ phase, eventCount, narrated, simulated, settlement, save, handlers, canEdit = false, galleryPublished = false }) {
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
      label: t('save.primary'),
      hint:  'Saving keeps this draft for later editing.',
      onClick: handlers.onSave,
    });
  } else if (phase === 'draft' && handlers.onCanonize) {
    items.push({
      id: 'canonize', primary: true, Icon: BookMarked,
      label: t('detail.canonizeCta'),
      hint:  t('detail.canonizeHint'),
      onClick: handlers.onCanonize,
    });
  } else if (phase === 'canon' && !simulated && handlers.onPlaceOnMap) {
    // The gold lifecycle rung: a canonized settlement that has not yet entered
    // the Realm. Naming the destination gives the next step strong scent (P3/P9).
    items.push({
      id: 'send_to_realm', primary: true, Icon: MapPin,
      label: t('detail.sendToRealmCta'),
      tag:   realmTier,
      hint:  t('detail.sendToRealmHint'),
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
  // Owner order (2026-07-22): the header toolbar's verbs are relocated here.
  // Order after the primary (Mark Canon / lifecycle rung): Session Mode, Edit,
  // then the paid narration + the export / share cluster.
  if (handlers.onSessionMode) {
    items.push({
      id: 'session', Icon: Drama,
      label: 'Session Mode',
      hint:  'A distraction-free run-of-play view for the table.',
      onClick: handlers.onSessionMode,
    });
  }
  // Edit — premium-gated. A non-premium owner still sees the rung (labeled
  // "Edit (Premium)" with a lock) so the upsell survives the move; the handler
  // routes to toggleEditMode or the purchase modal in useNextActionRailHandlers.
  if (handlers.onEdit) {
    items.push({
      id: 'edit', Icon: canEdit ? Edit3 : Lock,
      label: canEdit
        ? (phase === 'canon' ? 'Edit (correction)' : 'Edit Dossier')
        : 'Edit (Premium)',
      hint:  canEdit
        ? (phase === 'canon'
            ? 'Authorial correction outside the timeline.'
            : 'Edit dossier prose in place. Preserved across rerolls.')
        : 'Manual editing is a Cartographer (premium) feature. Click to upgrade.',
      onClick: handlers.onEdit,
    });
  }
  if (!narrated && handlers.onPolishAi) {
    items.push({
      id: 'polish', Icon: Sparkles,
      label: t('ai.polishCta'),
      hint:  t('ai.inlineHint', { cost: getAiCost('narrative') }),
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
      label: t('ai.regenerateCta'),
      hint:  t('ai.regenerateHint', { cost: getAiCost('narrative') }),
      onClick: handlers.onRegenerateAi,
    });
  }
  if (handlers.onExport) {
    items.push({
      id: 'export', Icon: FileText,
      label: t('export.primaryCta'),
      onClick: handlers.onExport,
    });
  }
  // Export Image — the free PNG share card (relocated from the header). Not
  // premium-gated; sharing is the growth loop.
  if (handlers.onExportImage) {
    items.push({
      id: 'export_image', Icon: ImageIcon,
      label: t('export.imageCta'),
      hint:  'A one-card PNG (name, tier, headline stats) for Discord or a forum.',
      onClick: handlers.onExportImage,
    });
  }
  // Share to Gallery — publish / manage the public listing (relocated from the
  // header). Label mirrors the old button (published → manage the listing).
  if (handlers.onShare) {
    items.push({
      id: 'share', Icon: Share2,
      label: galleryPublished ? 'Edit Gallery Listing' : 'Share to Gallery',
      hint:  'Publish this dossier to the public gallery, or manage its listing.',
      onClick: handlers.onShare,
    });
  }
  // Once the settlement is in the Realm, the gold primary above is no longer the
  // realm rung, so offer "Open the Realm" as an anytime secondary to return to it.
  if (phase === 'canon' && simulated && handlers.onPlaceOnMap) {
    items.push({
      id: 'open_realm', Icon: MapPin,
      label: t('detail.openRealmCta'),
      tag:   realmTier,
      hint:  t('detail.openRealmHint'),
      onClick: handlers.onPlaceOnMap,
    });
  }
  return items;
}
