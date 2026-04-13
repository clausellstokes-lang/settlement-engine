// chainMagicSubstitution.js — Magic tradition substitution pass for supply chains
// Upgrades impaired/depleted chains when magical traditions can compensate.
// Called from computeActiveChains after the main chain activation loop.

// Chain ID sets by type
const FOOD_CHAIN_IDS = [
  'grain', 'livestock', 'forage', 'fish', 'salt',
  'fishing', 'river_fishing', 'hunting',
  'brewing', 'beekeeping_wax', 'animal_husbandry',
];
const TIMBER_CHAIN_IDS = ['timber', 'shipbuilding', 'reed_marsh', 'bowyer_fletcher'];
const HEAL_CHAIN_IDS   = ['herbalism', 'hospital', 'divine_healing'];
const EXTRACT_CHAIN_IDS = ['iron', 'smelting', 'petty_mining', 'stone', 'clay', 'fuel'];

const TIER_ORDER_MAGIC = ['thorp','hamlet','village','town','city','metropolis'];

/**
 * Apply magic tradition substitution to active chains (mutates in place).
 * @param {Array}  activeChains  - from computeActiveChains
 * @param {Object} traditions    - { druid, divine, arcane, alchemy, ... }
 * @param {number} magicPriority - 0-100
 * @param {string} tier          - settlement tier
 */
export function applyMagicSubstitution(activeChains, traditions, magicPriority, tier) {
  const tierIdxMC = TIER_ORDER_MAGIC.indexOf(tier);

  activeChains.forEach(chain => {
    const cid = chain.chainId;

    // ── Food chains ─────────────────────────────────────────────────────────
    if (FOOD_CHAIN_IDS.includes(cid) && tierIdxMC >= 1 &&
        (chain.status === 'impaired' || chain.resourceDepleted)) {
      const isFishing = cid === 'fishing' || cid === 'river_fishing';
      const isBrewing = cid === 'brewing';
      const isHunting = cid === 'hunting';
      const isHoney   = cid === 'beekeeping_wax';
      const isAnimal  = cid === 'animal_husbandry';
      let recovery = 0, note = '';
      if (traditions.druid) {
        recovery = Math.max(recovery,
          isFishing ? 0.50 : isHunting ? 0.55 : isHoney ? 0.70 : isAnimal ? 0.45 : 0.65);
        note = isFishing ? 'Druids call fish and bless the waters'
             : isHunting ? 'Druidic beast-callers attract game to supplement depleted grounds'
             : isBrewing ? 'Druidic grain-blessing and water purification sustain brewing'
             : isHoney   ? 'Sacred hive-tending and flower-calling maintains honey production'
             : isAnimal  ? 'Druidic animal husbandry sustains the herd'
             : 'Druidic cultivation supplements depleted farmland';
      }
      if (traditions.divine) {
        const divRate = isFishing ? 0.35 : isBrewing ? 0.30 : 0.40;
        recovery = Math.max(recovery, divRate);
        note = note || (isFishing ? 'Temple fishing rites improve depleted catch'
                      : isBrewing ? 'Temple stores supplement grain shortage'
                      : 'Temple granaries blessed; divine provision fills the gap');
      }
      if (traditions.arcane && magicPriority >= 50) {
        const arcRate = isFishing ? 0.20 : isHunting ? 0.25 : 0.30;
        recovery = Math.max(recovery, arcRate);
        note = note || (isFishing ? 'Conjure Animals produces fish; minor supplement'
                      : 'Arcane Plant Growth provides minor food supplement');
      }
      if (recovery > 0) {
        chain.status      = recovery >= 0.55 ? 'magically_sustained' : 'vulnerable';
        chain.magicNote   = note;
        chain.magicRecovery = recovery;
        chain.exportable  = false;
      }
    }

    // ── Timber chains ───────────────────────────────────────────────────────
    if (TIMBER_CHAIN_IDS.includes(cid) && tierIdxMC >= 1 &&
        (chain.status === 'impaired' || chain.resourceDepleted)) {
      let recovery = 0, note = '';
      if (traditions.druid) {
        recovery = Math.max(recovery, 0.55);
        note = 'Druidic forest management accelerates regrowth and sustainable yield';
      }
      if (traditions.arcane && magicPriority >= 55) {
        recovery = Math.max(recovery, 0.25);
        note = note || 'Fabricate provides processed goods from alternative sources';
      }
      if (recovery > 0) {
        chain.status      = recovery >= 0.5 ? 'magically_sustained' : 'vulnerable';
        chain.magicNote   = note;
        chain.magicRecovery = recovery;
        chain.exportable  = false;
      }
    }

    // ── Healing chains ──────────────────────────────────────────────────────
    if (HEAL_CHAIN_IDS.includes(cid) && chain.status === 'impaired') {
      if (traditions.divine || traditions.alchemy) {
        chain.status    = 'vulnerable';
        chain.magicNote = traditions.divine
          ? 'Divine healing supplements mundane medicine'
          : 'Alchemical remedies supplement treatment';
      }
    }

    // ── Extraction chains ───────────────────────────────────────────────────
    if (EXTRACT_CHAIN_IDS.includes(cid) && tierIdxMC >= 3 &&
        (chain.status === 'impaired' || chain.resourceDepleted) &&
        traditions.arcane && magicPriority >= 65) {
      chain.status      = 'vulnerable';
      chain.magicNote   = 'Arcane Fabricate and Transmute Rock partially offset depleted extraction';
      chain.magicRecovery = 0.25;
      chain.exportable  = false;
    }
  });
}
