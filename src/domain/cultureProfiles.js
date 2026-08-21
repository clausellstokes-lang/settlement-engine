/**
 * Domain-facing culture-profile boundary.
 *
 * The governed profile corpus lives in src/data; generators, dossier readers,
 * and AI context builders import through this stable domain address so the
 * meaning of the culture dial has one public contract.
 */
export {
  CULTURE_PROFILES,
  CULTURE_PROFILE_KEYS,
  culturalNotesFor,
  cultureInstitutionMultiplier,
  materializeCulturalIdentity,
  resolveCultureProfileKey,
} from '../data/cultureProfiles.js';
