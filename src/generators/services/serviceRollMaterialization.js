/**
 * Materialize institution-owned services into the public category buckets.
 *
 * This is the seeded portion of available-service generation. Its ordering is
 * deliberately self-contained: institutions are visited in roster order,
 * each provider resolves its services once, and every probability gate draws
 * in the historical short-circuit sequence. Post-roll criminal overlays remain
 * in the public orchestrator because they consume the completed bucket state.
 */

import { random as rng, getActiveRng } from '../../kernel/rngContext.js';
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
import { birthFactsOf } from '../../domain/facts/factsOf.js';
import { drawDeclared } from '../../domain/facts/drawDeclared.js'; import { SERVICE_DESC_SIBLINGS } from '../../data/institutionServices.js';

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
 * THE PER-DEFINITION SERVICE ROLL, RESOLVED (CENSUS-1f unit 1c; Appendix B site 15, R). A service
 * that SURVIVED its rolls (the catalogue roll in `getServicesForInstitution`, the two gates here —
 * none moved, none added) is resolved through `drawDeclared` against the declarations CENSUS-4c
 * placed on its definition (`institutionServices.js`, 49 rows, carried onto the row by the
 * catalogue's `...rowDef`). Admitted: kept, byte-identical. Refused: its desc's walls twin
 * (CENSUS-1c's `SERVICE_DESC_SIBLINGS`, the same resolution as before) when the record admits it;
 * else the service is NOT materialized (a list printed whole: kind A's filter). A custom service
 * declares nothing and is never touched.
 * @param {Record<string, unknown>} service
 * @param {object | (() => object) | null} facts the birth's facts at the roll
 * @returns {Record<string, unknown> | null}
 */
export function resolveServiceRow(service, facts) {
  if (service.custom === true || service.source === 'custom') return service;
  const r = drawDeclared([service], {
    draw: (p) => p[0],
    facts,
    poolId: `institutionServices:${String(service.svcKey ?? service.institution ?? '')}.${String(service.name ?? '')}`, key: `${getActiveRng()?.seed ?? ''}::institutionServices:${String(service.svcKey ?? service.institution ?? '')}.${String(service.name ?? '')}`, // R-AT (CENSUS-1i unit 5)
    surface: 'services',
    drawKind: 'R',
    twin: (line) => {
      const set = /** @type {Record<string, ReadonlyArray<any>>} */ (SERVICE_DESC_SIBLINGS)[String(line?.desc ?? '')];
      const t = set ? set.find((l) => l && typeof l.twinOf === 'string') : null;
      return t ? { ...line, desc: t.text, needs: [...(t.needs ?? [])], excludes: [...(t.excludes ?? [])], crisis: [...(t.crisis ?? [])] } : null;
    },
  });
  return r.line ?? null;
}

/**
 * Project one catalog-resolution record into the persisted settlement shape
 * without dropping exact custom-definition identity.
 *
 * @param {Record<string, unknown>} service the RESOLVED row (`resolveServiceRow`)
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
 *     portKind?:'maritime'|'river'|'none',
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
    // A-11: the world law's water fact, for a row that names its inland alternative.
    _waterAccess: worldLaw.portKind || '',
  });
  const filteredInstitutions =
    institutions.filter(worldLaw.allowsInstitution);
  // F10 unit 4, CENSUS-1f: the birth's facts at the roll (the roster, the tier, the config's
  // terrain, the world law's water and magic law), read lazily, for the declared rows. Draw-free.
  const facts = () => birthFactsOf({ institutions, config, tier }, worldLaw);

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
        // CENSUS-1f (site 15): resolved AFTER the rolls, so no roll moves.
        const row = resolveServiceRow(service, facts);
        if (!row) continue;
        const projected = projectAvailableService(
          row,
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
            row,
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
