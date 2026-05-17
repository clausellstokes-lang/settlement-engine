import { useState, useCallback } from 'react';

const DEFAULT_CONFIG = {
  settType:              'random',
  population:            1500,
  tradeRouteAccess:      'random_trade',
  culture:               'random_culture',
  monsterThreat:         'random_threat',
  priorityEconomy:       50,
  priorityMilitary:      50,
  priorityMagic:         50,
  priorityReligion:      50,
  priorityCriminal:      50,
  magicExists:             true,   // false = no-magic / historical mode
  nearbyResourcesRandom:   true,
  nearbyResources:         null,          // legacy: explicit list when random=false
  nearbyResourcesDepleted: [],            // legacy: which of nearbyResources are depleted
  nearbyResourcesState:    {},            // new: { [key]: 'allow'|'abundant'|'depleted'|'excluded' }
  selectedStresses:      [],
  selectedStressesRandom: true,
  customName:            '',
  // Duplicate `magicExists: true` (was also declared at line 14) was
  // silently overwriting itself with the same value via JS object
  // literal semantics. Removed 2026-04 after ESLint no-dupe-keys
  // caught it. The earlier declaration is the canonical one.
};

export default function useConfig() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const updateConfig = useCallback(
    (partial) => setConfig(prev => ({ ...prev, ...partial })),
    []
  );

  const resetConfig = useCallback(() => setConfig(DEFAULT_CONFIG), []);

  return { config, updateConfig, resetConfig };
}
