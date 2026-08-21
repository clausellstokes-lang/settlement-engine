/**
 * components/surveyor/useSurveyorContext.js — the shared store/route read the Surveyor WRITE
 * panels use to build their edge request context + the visible anchor. Mirrors the reads
 * AiAnalystPanel already performs (the panel follows the page: the anchor derives the default
 * retrieval scope from the current route + selection). Lazy-only (rides the panel chunks).
 */

import { useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { useRoute } from '../../hooks/useRoute.js';
import { deriveAnchor } from '../../domain/ai/contextAnchor.js';

/**
 * @returns {{
 *   creditBalance: number, ownerId: string|null,
 *   activeCampaignId: string|null, activeCampaign: object|null,
 *   activeSaveId: string|null, selectedSettlementId: string|null, settlement: object|null,
 *   savedSettlements: Array<object>, worldState: object|null, anchorLabel: string,
 *   ctx: { view: string, params: object, selectedSettlementId: string|null, settlement: object|null,
 *          savedSettlements: Array<object>, activeCampaign: object|null, worldState: object|null },
 * }}
 */
export function useSurveyorContext() {
  const ownerId = useStore((s) => s.auth?.user?.id || null);
  const settlement = useStore((s) => s.settlement);
  const savedSettlements = useStore((s) => s.savedSettlements);
  const campaigns = useStore((s) => s.campaigns);
  const activeCampaignId = useStore((s) => s.activeCampaignId);
  const selectedSettlementId = useStore((s) => s.selectedSettlementId);
  const activeSaveId = useStore((s) => s.activeSaveId);
  const creditBalance = useStore((s) => s.creditBalance);
  const { view, params } = useRoute();

  const activeCampaign = useMemo(
    () => (Array.isArray(campaigns) ? campaigns.find((c) => c && c.id === activeCampaignId) : null) || null,
    [campaigns, activeCampaignId],
  );
  const worldState = activeCampaign?.worldState || null;
  const saved = useMemo(() => (Array.isArray(savedSettlements) ? savedSettlements : []), [savedSettlements]);

  const anchorLabel = useMemo(() => {
    const anchor = deriveAnchor({
      view, params, selectedSettlementId, settlement, savedSettlements: saved,
      activeCampaign, tick: worldState?.tick ?? null,
    });
    return anchor.label;
  }, [view, params, selectedSettlementId, settlement, saved, activeCampaign, worldState]);

  const ctx = useMemo(
    () => ({ view, params, selectedSettlementId, settlement, savedSettlements: saved, activeCampaign, worldState }),
    [view, params, selectedSettlementId, settlement, saved, activeCampaign, worldState],
  );

  return {
    creditBalance: Number.isFinite(creditBalance) ? creditBalance : 0,
    ownerId: ownerId != null ? String(ownerId) : null,
    activeCampaignId: activeCampaignId != null ? String(activeCampaignId) : null,
    activeCampaign, activeSaveId: activeSaveId != null ? String(activeSaveId) : null,
    selectedSettlementId, settlement, savedSettlements: saved, worldState, anchorLabel, ctx,
  };
}
