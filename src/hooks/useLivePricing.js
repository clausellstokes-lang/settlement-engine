import { useCallback, useEffect, useState } from 'react';
import { fetchLivePricing, resolveLiveAiCost } from '../config/livePricing.js';
import { useStore } from '../store/index.js';

/**
 * Lazy-surface hook for the server-authoritative AI credit schedule.
 *
 * The first render uses shipped constants. A successful get_ai_pricing read
 * updates both this component and pricing.js's session cache, so synchronous
 * action preflights quote the same number the UI just showed. Failures are
 * intentionally silent and retain the shipped fallback.
 */
export default function useLivePricing() {
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    let active = true;
    fetchLivePricing().then((value) => {
      if (active && value) setPricing(value);
    });
    return () => { active = false; };
  }, []);

  return pricing;
}

/** Reactive feature-cost resolver for lazy action surfaces. */
export function useLiveAiCostResolver() {
  const modelPreference = useStore((state) => state.auth?.modelPreference);
  const pricing = useLivePricing();
  return useCallback(
    (feature) => resolveLiveAiCost(feature, modelPreference, pricing),
    [modelPreference, pricing],
  );
}
