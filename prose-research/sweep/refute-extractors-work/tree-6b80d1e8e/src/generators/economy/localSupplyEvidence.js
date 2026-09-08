import {
  institutionMatchesRegex,
} from '../../domain/institutionClassify.js';

const LOCAL_GRAIN_PRODUCER_RE =
  /\b(?:subsistence farming|farmland|grain fields?|common fields?)\b/i;
const LOCAL_GRAZING_PRODUCER_RE = /\bcommon grazing land\b/i;

/**
 * Whether the final institution roster itself proves a local agricultural
 * input that the coarse natural-resource roster does not enumerate.
 *
 * These are land-use institutions, not processors: a mill does not prove
 * grain, while subsistence farms do prove locally worked farmland. Matching
 * delegates to the shared id-first institution classifier so a renamed native
 * institution keeps its capability, legacy unstamped records remain readable,
 * and a custom presentation label cannot impersonate a native producer.
 *
 * @param {unknown} requirement
 * @param {Array<{ catalogId?: string, name?: string }>} institutions
 * @returns {boolean}
 */
export function hasLocalAgriculturalSupply(
  requirement,
  institutions,
) {
  const label = String(requirement || '').toLowerCase();
  if (/\b(?:grain|farmland)\b/.test(label)) {
    return institutions.some(institution => (
      institutionMatchesRegex(institution, LOCAL_GRAIN_PRODUCER_RE)
    ));
  }
  if (/\bgrazing land\b/.test(label)) {
    return institutions.some(institution => (
      institutionMatchesRegex(institution, LOCAL_GRAZING_PRODUCER_RE)
    ));
  }
  return false;
}
