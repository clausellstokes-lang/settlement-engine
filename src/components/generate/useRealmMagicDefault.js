/**
 * useRealmMagicDefault.js — MG-2's ONE consumer of the realm's magic default
 * (docs/DESIGN_REALM_MAGIC_TOGGLE §4).
 *
 * A realm built mundane answered its magic question once, before it existed, and
 * every member was minted under that answer. A settlement generated INTO that
 * realm afterwards should start from the same premise rather than silently
 * arriving magical — so the wizard's "Magic in the World?" control PRE-SELECTS
 * the mundane answer here.
 *
 * IT IS A PRE-SELECTION, NOT A GATE (MG-LAW-1 / MG-LAW-4). Three properties make
 * that true, and each is pinned:
 *
 *   • VISIBLE — the panel renders a line saying the realm has no magic, so the
 *     DM sees WHY the control moved rather than finding it mysteriously off.
 *   • OVERRIDABLE — one click restores magic, and it STICKS. The override is
 *     recorded as authored intent (configExplicitFields.magicExists), which is
 *     this hook's own "hands off" signal: the DM's one strange glowing city in a
 *     mundane realm is a deliberate act the design protects, not a mistake to
 *     correct on the next render.
 *   • NEVER RETROACTIVE — it touches only the config the wizard is about to
 *     generate FROM. No existing settlement, save, or campaign is rewritten.
 *
 * The write goes through updateConfig (the single door onto state.config) with
 * `recordIntent: false`, because a realm default is emphatically NOT the DM's
 * authored choice — recording it as one would make this hook silence itself on
 * the very next realm.
 */
import { useEffect } from 'react';
import { useStore } from '../../store/index.js';
import { realmMagicIsMundane } from '../../domain/worldPulse/simulationRules.js';

/**
 * Does the active campaign declare a mundane realm? Read as a hook so both the
 * pre-selection effect and the panel's explanatory line share one answer.
 * @returns {boolean}
 */
export function useRealmIsMundane() {
  return useStore((s) => {
    const id = s.activeCampaignId;
    if (!id) return false;
    const campaigns = Array.isArray(s.campaigns) ? s.campaigns : [];
    const campaign = campaigns.find((c) => c && String(c.id) === String(id));
    return realmMagicIsMundane(campaign?.worldState?.simulationRules);
  });
}

/**
 * Pre-select the mundane answer for a settlement being generated into a mundane
 * realm. Returns whether the realm is mundane, so the caller can explain itself.
 * @returns {boolean}
 */
export function useRealmMagicDefault() {
  const isMundane = useRealmIsMundane();
  const magicExists = useStore((s) => s.config?.magicExists);
  // The DM's own answer on file. Absent means "never asked, never told" — the
  // only state in which a realm default may speak for them.
  const authored = useStore((s) => s.configExplicitFields?.magicExists === true);
  const updateConfig = useStore((s) => s.updateConfig);

  useEffect(() => {
    if (!isMundane || authored || magicExists === false) return;
    // Both fields together, matching what the panel's own control writes: a
    // magicExists:false config with a live magic dial is the display asymmetry
    // the dead-magic work exists to prevent.
    updateConfig?.({ magicExists: false, priorityMagic: 0 }, { recordIntent: false });
  }, [isMundane, authored, magicExists, updateConfig]);

  return isMundane;
}

export default useRealmMagicDefault;
