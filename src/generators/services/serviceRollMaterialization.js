/**
 * Materialize institution-owned services into the public category buckets.
 *
 * This is the seeded portion of available-service generation. Its ordering is
 * deliberately self-contained: institutions are visited in roster order,
 * each provider resolves its services once, and every probability gate draws
 * in the historical short-circuit sequence. Post-roll criminal overlays remain
 * in the public orchestrator because they consume the completed bucket state.
 */

import { random as rng } from '../../kernel/rngContext.js';
import { getInstFlags } from '../helpers.js';
import { classifyService } from './serviceClassifier.js';
import { getServiceTierInfo } from './serviceAvailability.js';
import { getServicesForInstitution } from './institutionServices.js';
import {
  clearCustomDefinitionIdentity,
  mergeCustomDefinitionIdentity,
  projectCustomDefinitionIdentity,
} from '../../domain/content/customDefinitionIdentityProjection.js';
import {
  isMaterializedCustomContent,
  nativeSemanticName,
} from '../../domain/content/customContentSemanticAuthority.js';

const CRIMINAL_INSTITUTION_KEYWORDS = Object.freeze([
  'thieves',
  'black market',
  'smuggl',
  'street gang',
  'front business',
  'assassin',
  'gambling den',
  'underground',
  'red light',
  'criminal faction',
]);

/**
 * The crime-scaled gate models illicit supply from criminal providers. A
 * legitimate provider's service must not disappear merely because the wider
 * settlement is lawful.
 *
 * @param {Record<string, unknown>} institution
 */
function isCriminalProvider(institution) {
  const category = String(institution.category || '').toLowerCase();
  if (
    isMaterializedCustomContent(
      /** @type {unknown} */ (institution),
    )
  ) return false;
  if (category === 'criminal') return true;
  const name = nativeSemanticName(institution).toLowerCase();
  return CRIMINAL_INSTITUTION_KEYWORDS.some(keyword => (
    name.includes(keyword)
  ));
}

/**
 * Project one catalog-resolution record into the persisted settlement shape
 * without dropping exact custom-definition identity.
 *
 * @param {Record<string, unknown>} service
 * @param {string} institutionName
 */
function projectAvailableService(service, institutionName) {
  /** @type {Record<string, unknown>} */
  const projected = {
    name: service.name,
    desc: service.desc,
    institution: institutionName,
    ...projectCustomDefinitionIdentity(service),
  };
  if (service.custom === true) projected.custom = true;
  if (service.source === 'custom') projected.source = 'custom';
  if (typeof service.customDefinitionCategory === 'string') {
    projected.customDefinitionCategory = service.customDefinitionCategory;
  }
  if (
    typeof service.localUid === 'string'
    || typeof service._customServiceLocalUid === 'string'
  ) {
    projected.localUid = service.localUid
      || service._customServiceLocalUid;
  }
  return projected;
}

/**
 * Native services deduplicate by catalog display key. Current custom services
 * deduplicate only by immutable definition identity; a shared presentation
 * label never becomes an identity join.
 *
 * @param {Record<string, unknown>} service
 */
function availableServiceIdentityKey(service) {
  const identity = projectCustomDefinitionIdentity(service);
  if (identity.customDefinitionId) {
    return `custom-definition:${identity.customDefinitionId}`;
  }
  const custom = service.source === 'custom' || service.custom === true;
  if (custom) {
    const localUid = String(
      service.localUid
      || service._customServiceLocalUid
      || '',
    ).trim();
    return localUid
      ? `custom-local:${localUid}`
      : `custom-legacy-name:${String(service.name || '')}`;
  }
  return `native:${String(service.name || '')}`;
}

/**
 * @param {{
 *   buckets:Record<string, Array<Record<string, unknown>>>,
 *   tier:string,
 *   institutions:Array<Record<string, unknown>>,
 *   opts:Record<string, unknown>,
 *   config:Record<string, unknown>,
 *   worldLaw:{
 *     magicFunctions:()=>boolean,
 *     allowsInstitution:(institution:unknown)=>boolean,
 *     allowsService:(service:unknown,provider?:unknown,category?:string)=>boolean,
 *   },
 * }} input
 * @returns {{criminalEffective:number,seen:Set<string>}}
 */
export function materializeInstitutionServiceRolls(input) {
  const {
    buckets,
    tier,
    institutions,
    opts,
    config,
    worldLaw,
  } = input;
  const criminalEffective =
    getInstFlags(config, institutions).criminalEffective;
  const seen = new Set();
  const materializedByIdentity = new Map();
  const ambiguousDefinitionKeys = new Set();
  const mergedOpts = Object.assign({}, opts, {
    _tradeRoute: config._tradeRoute || '',
  });
  const filteredInstitutions =
    institutions.filter(worldLaw.allowsInstitution);

  for (const institution of filteredInstitutions) {
    const services = getServicesForInstitution(
      institution,
      tier,
      mergedOpts,
    );
    for (const service of services) {
      if (!worldLaw.allowsService(
        service,
        institution,
        service.category,
      )) continue;
      const identityKey = availableServiceIdentityKey(service);
      if (seen.has(identityKey)) {
        const materialized = materializedByIdentity.get(identityKey) || [];
        for (const existing of materialized) {
          if (ambiguousDefinitionKeys.has(identityKey)) {
            clearCustomDefinitionIdentity(existing);
            delete existing.customDefinitionCategory;
            continue;
          }
          const mergeResult =
            mergeCustomDefinitionIdentity(existing, service);
          if (mergeResult === 'conflict') {
            ambiguousDefinitionKeys.add(identityKey);
            for (const candidate of materialized) {
              clearCustomDefinitionIdentity(candidate);
              delete candidate.customDefinitionCategory;
            }
            break;
          }
          if (service.custom === true) existing.custom = true;
          if (service.source === 'custom') existing.source = 'custom';
          if (
            mergeResult !== 'absent'
            && typeof service.customDefinitionCategory === 'string'
          ) {
            existing.customDefinitionCategory =
              service.customDefinitionCategory;
          }
        }
        continue;
      }

      seen.add(identityKey);
      const customService =
        service.source === 'custom' || service.custom === true;
      // Current custom services declare their bounded category explicitly.
      // Native name heuristics remain a legacy catalog mechanism, not
      // authority granted by a presentation label.
      const demandMultiplier = customService
        ? 1
        : getServiceTierInfo(
            service.name,
            institution.name,
            config,
            institutions,
          );
      const category = customService
        ? (
            buckets[String(service.category || '')]
              ? String(service.category)
              : 'information'
          )
        : classifyService(service.name, institution.name);
      if (!worldLaw.allowsService(service, institution, category)) continue;

      // Preserve the old short-circuit order: both rng calls are conditional,
      // and changing their sequence would perturb all later seeded output.
      if (
        !(
          category === 'criminal'
          && isCriminalProvider(institution)
          && rng() > Math.min(1, (criminalEffective / 100) * 1.5)
        )
        && !(
          (service.p || 1) < 1
          && demandMultiplier < 1
          && rng() > demandMultiplier
        )
        && buckets[category]
      ) {
        const projected = projectAvailableService(
          service,
          String(institution.name || ''),
        );
        buckets[category].push(projected);
        materializedByIdentity.set(identityKey, [projected]);

        // Cross-list, do not move. Lodging provisions still prove the
        // settlement has food, preventing a contradictory notable absence.
        if (
          !customService
          && category === 'lodging'
          && /food|drink|provision|meal/i.test(String(service.name || ''))
        ) {
          const foodProjection = projectAvailableService(
            service,
            String(institution.name || ''),
          );
          buckets.food.push(foodProjection);
          const tracked = materializedByIdentity.get(identityKey);
          if (tracked) tracked.push(foodProjection);
        }
      }
    }
  }

  return { criminalEffective, seen };
}
