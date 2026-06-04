/**
 * useCopy.js - Audience-aware wrapper over t().
 *
 * The plain `t('key')` helper from src/copy/index.js looks up a single
 * string. Many critique findings (X-10 audience-led pricing copy, C-3
 * companion lines, X-9 return-visit copy) need to pick between several
 * candidate strings based on the current user's reader archetype.
 *
 * Usage:
 *   const copy = useCopy();
 *   const pitch = copy.audience('pricingPitch.cartographer.line');
 *
 * `audience(prefix)` reads from `${prefix}New`, `${prefix}Intermediate`,
 * or `${prefix}Worldbuilder` based on the current useReaderAudience()
 * value, falling back to `${prefix}New` if the audience-specific key is
 * absent (so partial migrations don't crash).
 *
 * The hook also exposes the plain `t` and `tx` helpers so a single
 * import covers all copy needs in a component.
 */

import { useMemo } from 'react';
import { t, tx } from '../copy/index.js';
import { useReaderAudience } from './useReaderAudience.js';

const SUFFIX = {
  new:           'New',
  intermediate:  'Intermediate',
  worldbuilder:  'Worldbuilder',
};

export function useCopy() {
  const audience = useReaderAudience();

  return useMemo(() => {
    const suffix = SUFFIX[audience] || SUFFIX.new;

    /** Pick an audience-specific copy string with safe fallback. */
    function pickAudience(prefix, vars) {
      const specific = t(prefix + suffix, vars);
      // The t() helper returns the key string when missing - detect
      // that and fall back to the new-DM line.
      const looksMissing = specific === prefix + suffix;
      return looksMissing ? t(prefix + SUFFIX.new, vars) : specific;
    }

    return {
      t,
      tx,
      audience: pickAudience,
      currentAudience: audience,
    };
  }, [audience]);
}
