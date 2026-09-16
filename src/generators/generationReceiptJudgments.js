/**
 * generationReceiptJudgments.js — independent final-dossier certification.
 *
 * The ordinary generation checks ask whether individual projections agree.
 * This module adds the orthogonal judgments an owner needs before trusting the
 * assembled settlement: does the final graph still join, did chronology and
 * conserved shares survive, was explicit intent honored, is hardship explained,
 * and is the receipt itself backed by reproducible provenance?
 *
 * These checks are intentionally direct. They inspect the final persisted graph
 * instead of trusting producer receipts, so a broken relationship or faction
 * reference cannot certify itself. They never repair or re-interpret the world.
 */

const EPSILON = 0.001;

export const GENERATION_JUDGMENT_IDS = Object.freeze([
  'hard_structural_validity',
  'cross_system_semantic_agreement',
  'user_intent_fulfillment',
  'narrative_realization',
  'dramatic_tension',
  'diversity_and_repetition',
  'confidence_and_provenance',
]);

function finding(path, detail, evidence = null) {
  return {
    path,
    detail,
    ...(evidence != null && evidence !== ''
      ? { evidence: String(evidence) }
      : {}),
  };
}

function normalizedIdentity(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function duplicateFindings(values, path, label) {
  const seen = new Map();
  const findings = [];
  for (const [index, raw] of values.entries()) {
    const key = normalizedIdentity(raw);
    if (!key) continue;
    if (seen.has(key)) {
      findings.push(finding(
        `${path}[${index}]`,
        `Duplicate ${label} in the final settlement.`,
        `${seen.get(key)} / ${raw}`,
      ));
    } else {
      seen.set(key, raw);
    }
  }
  return findings;
}

/**
 * Reference integrity over the final canonical graph.
 */
export function finalGraphFindings(settlement) {
  const findings = [];
  const institutions = settlement?.institutions || [];
  const npcs = settlement?.npcs || [];
  const npcById = new Map(npcs.map(npc => [npc?.id, npc]));
  const npcNames = new Set(
    npcs.map(npc => normalizedIdentity(npc?.name)).filter(Boolean),
  );

  findings.push(...duplicateFindings(
    institutions.map(institution => institution?.name),
    'institutions',
    'institution identity',
  ));
  findings.push(...duplicateFindings(
    npcs.map(npc => npc?.id),
    'npcs',
    'NPC id',
  ));

  for (const [index, relationship] of (
    settlement?.relationships || []
  ).entries()) {
    const first = npcById.get(relationship?.npc1Id);
    const second = npcById.get(relationship?.npc2Id);
    if (!first) {
      findings.push(finding(
        `relationships[${index}].npc1Id`,
        'Relationship references a missing first NPC.',
        relationship?.npc1Id,
      ));
    }
    if (!second) {
      findings.push(finding(
        `relationships[${index}].npc2Id`,
        'Relationship references a missing second NPC.',
        relationship?.npc2Id,
      ));
    }
    if (
      first
      && normalizedIdentity(relationship?.npc1Name)
        !== normalizedIdentity(first?.name)
    ) {
      findings.push(finding(
        `relationships[${index}].npc1Name`,
        'Relationship first-name projection drifted from its canonical NPC.',
        `${relationship?.npc1Name || '(missing)'} / ${first?.name}`,
      ));
    }
    if (
      second
      && normalizedIdentity(relationship?.npc2Name)
        !== normalizedIdentity(second?.name)
    ) {
      findings.push(finding(
        `relationships[${index}].npc2Name`,
        'Relationship second-name projection drifted from its canonical NPC.',
        `${relationship?.npc2Name || '(missing)'} / ${second?.name}`,
      ));
    }
  }

  const prominent = settlement?.prominentRelationship;
  for (const field of ['npc1', 'npc2']) {
    if (
      prominent?.[field]
      && !npcNames.has(normalizedIdentity(prominent[field]))
    ) {
      findings.push(finding(
        `prominentRelationship.${field}`,
        'Prominent relationship references a missing notable NPC.',
        prominent[field],
      ));
    }
  }

  const powerFactions = settlement?.powerStructure?.factions || [];
  const powerFactionNames = powerFactions
    .map(faction => faction?.faction)
    .filter(Boolean);
  findings.push(...duplicateFindings(
    powerFactionNames,
    'powerStructure.factions',
    'power-faction identity',
  ));
  const powerFactionSet = new Set(powerFactionNames);
  for (const [index, npc] of npcs.entries()) {
    if (
      npc?.factionAffiliation
      && !powerFactionSet.has(npc.factionAffiliation)
    ) {
      findings.push(finding(
        `npcs[${index}].factionAffiliation`,
        'NPC references a missing power faction.',
        npc.factionAffiliation,
      ));
    }
  }

  const factions = settlement?.factions || [];
  const factionNames = factions.map(faction => faction?.name).filter(Boolean);
  findings.push(...duplicateFindings(
    factionNames,
    'factions',
    'narrative-faction identity',
  ));
  const factionSet = new Set(factionNames);
  for (const [factionIndex, faction] of factions.entries()) {
    for (const [memberIndex, member] of (faction?.members || []).entries()) {
      if (npcById.has(member?.id)) continue;
      findings.push(finding(
        `factions[${factionIndex}].members[${memberIndex}].id`,
        'Narrative faction references a missing NPC member.',
        member?.id,
      ));
    }
  }
  for (const [conflictIndex, conflict] of (
    settlement?.conflicts || []
  ).entries()) {
    for (const [partyIndex, party] of (conflict?.parties || []).entries()) {
      if (factionSet.has(party)) continue;
      findings.push(finding(
        `conflicts[${conflictIndex}].parties[${partyIndex}]`,
        'Conflict references a missing narrative faction.',
        party,
      ));
    }
  }

  return findings;
}

export function chronologyFindings(settlement) {
  const findings = [];
  const events = settlement?.history?.historicalEvents || [];
  for (let index = 0; index < events.length; index += 1) {
    const yearsAgo = Number(events[index]?.yearsAgo);
    if (!Number.isFinite(yearsAgo) || yearsAgo < 0) {
      findings.push(finding(
        `history.historicalEvents[${index}].yearsAgo`,
        'Historical event has an invalid date.',
        events[index]?.yearsAgo,
      ));
      continue;
    }
    if (index === 0) continue;
    const previous = Number(events[index - 1]?.yearsAgo);
    if (Number.isFinite(previous) && previous < yearsAgo) {
      findings.push(finding(
        `history.historicalEvents[${index}].yearsAgo`,
        'Historical events are not ordered from oldest to newest.',
        `${previous} then ${yearsAgo} years ago`,
      ));
    }
  }
  return findings;
}

function collectNonFiniteNumbers(
  value,
  path,
  findings,
  seen = new WeakSet(),
) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      findings.push(finding(
        path,
        'Final settlement contains a non-finite number.',
        value,
      ));
    }
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((entry, index) => (
      collectNonFiniteNumbers(entry, `${path}[${index}]`, findings, seen)
    ));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    // A recertification call may receive the previous receipt. It is not part
    // of the settlement truth the new receipt is certifying.
    if (key === 'generationCoherenceReceipt') continue;
    collectNonFiniteNumbers(
      child,
      path ? `${path}.${key}` : key,
      findings,
      seen,
    );
  }
}

export function conservationFindings(settlement) {
  const findings = [];
  const powerFactions = settlement?.powerStructure?.factions || [];
  if (powerFactions.length) {
    const powerTotal = powerFactions.reduce(
      (sum, faction) => sum + Number(faction?.power || 0),
      0,
    );
    if (!Number.isFinite(powerTotal) || Math.abs(powerTotal - 100) > EPSILON) {
      findings.push(finding(
        'powerStructure.factions',
        'Faction power is not conserved at 100%.',
        powerTotal,
      ));
    }
  }

  const incomeSources = settlement?.economicState?.incomeSources || [];
  if (incomeSources.length) {
    const incomeTotal = incomeSources.reduce(
      (sum, source) => sum + Number(source?.percentage || 0),
      0,
    );
    if (!Number.isFinite(incomeTotal) || Math.abs(incomeTotal - 100) > EPSILON) {
      findings.push(finding(
        'economicState.incomeSources',
        'Income shares are not conserved at 100%.',
        incomeTotal,
      ));
    }
  }

  collectNonFiniteNumbers(settlement, '', findings);
  return findings;
}

function stressEntries(settlement) {
  const value = settlement?.stressors ?? settlement?.stress;
  return Array.isArray(value) ? value : value ? [value] : [];
}

function intendedStressTypes(config) {
  const edits = config?.stressorEdits || {};
  const resolved = new Set(
    (edits.resolved || []).map(normalizedIdentity).filter(Boolean),
  );
  return [
    ...(config?.stressTypes || []),
    ...(config?.stressType ? [config.stressType] : []),
    ...(config?.selectedStressesRandom === false
      ? (config?.selectedStresses || [])
      : []),
    ...(edits.added || []).map(entry => entry?.type),
  ]
    .filter(Boolean)
    .filter(type => !resolved.has(normalizedIdentity(type)));
}

function toggleIntent(key, toggle, tier) {
  if (!toggle || typeof toggle !== 'object') return null;
  const structured = key.includes('::');
  const parts = key.split(structured ? '::' : '_');
  if (parts.length < 3) return null;
  const scope = normalizedIdentity(parts[0]);
  if (scope !== 'all' && scope !== normalizedIdentity(tier)) return null;
  return {
    name: parts.slice(2).join(structured ? '::' : '_'),
    require: toggle.require === true,
    exclude:
      toggle.require !== true
      && (
        toggle.forceExclude === true
        || toggle.allow === false
      ),
  };
}

export function userIntentAssessment(settlement) {
  const findings = [];
  const evidence = [];
  const config = settlement?._config || settlement?.config || {};
  const finalConfig = settlement?.config || {};
  const institutionNames = new Set(
    (settlement?.institutions || [])
      .map(institution => normalizedIdentity(institution?.name))
      .filter(Boolean),
  );
  const toggles =
    config?._institutionToggles
    || config?.institutionToggles
    || {};

  for (const [key, toggle] of Object.entries(toggles)) {
    const intent = toggleIntent(key, toggle, settlement?.tier);
    if (!intent || (!intent.require && !intent.exclude)) continue;
    const name = normalizedIdentity(intent.name);
    const present = institutionNames.has(name);
    if (intent.require && !present) {
      findings.push(finding(
        `_config._institutionToggles.${key}`,
        'Explicitly required institution is absent from the final roster.',
        intent.name,
      ));
    } else if (intent.exclude && present) {
      findings.push(finding(
        `_config._institutionToggles.${key}`,
        'Explicitly excluded institution remains on the final roster.',
        intent.name,
      ));
    } else {
      evidence.push(finding(
        `_config._institutionToggles.${key}`,
        intent.require
          ? 'Required institution is present.'
          : 'Excluded institution is absent.',
        intent.name,
      ));
    }
  }

  const finalStress = new Set(
    stressEntries(settlement)
      .map(entry => normalizedIdentity(entry?.type))
      .filter(Boolean),
  );
  const trace = settlement?.simulationTrace || [];
  for (const type of intendedStressTypes(config)) {
    const normalizedType = normalizedIdentity(type);
    if (finalStress.has(normalizedType)) {
      evidence.push(finding(
        `stress.${type}`,
        'Explicit stress premise is present in the final dossier.',
        type,
      ));
      continue;
    }
    const declined = trace.find(entry => (
      entry?.targetId === `stressor.${type}`
      && entry?.result === 'declined'
      && entry?.causes?.some(cause => cause?.reason)
    ));
    if (declined) {
      evidence.push(finding(
        `simulationTrace.${declined.targetId}`,
        'Explicit stress premise was declined with a recorded reason.',
        declined.causes[0]?.reason,
      ));
    } else {
      findings.push(finding(
        `_config.stressTypes.${type}`,
        'Explicit stress premise is absent without an explained decline.',
        type,
      ));
    }
  }

  const requestedRoute = String(config?.tradeRouteAccess || '');
  if (
    requestedRoute
    && !/^(?:random|custom)/.test(requestedRoute)
  ) {
    const finalRoute = String(finalConfig?.tradeRouteAccess || '');
    if (requestedRoute !== finalRoute) {
      findings.push(finding(
        '_config.tradeRouteAccess',
        'Explicit route intent changed during generation.',
        `${requestedRoute} / ${finalRoute || '(missing)'}`,
      ));
    } else {
      evidence.push(finding(
        '_config.tradeRouteAccess',
        'Explicit route intent is preserved.',
        finalRoute,
      ));
    }
  }

  const requestedProfile = String(config?.contentProfile || '');
  if (requestedProfile) {
    const finalProfile = String(finalConfig?.contentProfile || '');
    if (requestedProfile !== finalProfile) {
      findings.push(finding(
        '_config.contentProfile',
        'Selected content profile changed during generation.',
        `${requestedProfile} / ${finalProfile || '(missing)'}`,
      ));
    } else {
      evidence.push(finding(
        '_config.contentProfile',
        'Selected content profile is preserved.',
        finalProfile,
      ));
    }
  }

  if (!evidence.length && !findings.length) {
    evidence.push(finding(
      'intent',
      'No explicit institution, stress, route, or content-profile override required adjudication.',
    ));
  }
  return { findings, evidence };
}

export function narrativeRealizationFindings(settlement) {
  const findings = [];
  for (const [index, stress] of stressEntries(settlement).entries()) {
    if (
      stress?.summary
      || stress?.description
      || stress?.crisisHook
      || stress?.viabilityNote
    ) continue;
    findings.push(finding(
      `stress[${index}]`,
      'Active stress has no realized explanatory prose.',
      stress?.type || stress?.label,
    ));
  }
  for (const [index, event] of (
    settlement?.history?.historicalEvents || []
  ).entries()) {
    if (!String(event?.name || '').trim()) {
      findings.push(finding(
        `history.historicalEvents[${index}].name`,
        'Historical event has no realized name.',
      ));
    }
    if (!String(event?.description || '').trim()) {
      findings.push(finding(
        `history.historicalEvents[${index}].description`,
        'Historical event has no realized description.',
        event?.name,
      ));
    }
  }
  for (const [index, tension] of (
    settlement?.history?.currentTensions || []
  ).entries()) {
    if (String(tension?.description || '').trim()) continue;
    findings.push(finding(
      `history.currentTensions[${index}].description`,
      'Current tension has no realized description.',
      tension?.type,
    ));
  }
  return findings;
}

export function dramaticTensionAssessment(settlement, authoredTensions = []) {
  const findings = [];
  const evidence = [];
  const candidates = [
    ...stressEntries(settlement).map((entry, index) => ({
      path: `stress[${index}]`,
      label: entry?.label || entry?.type,
      explanation:
        entry?.summary
        || entry?.description
        || entry?.crisisHook
        || entry?.viabilityNote,
    })),
    ...(settlement?.history?.currentTensions || []).map((entry, index) => ({
      path: `history.currentTensions[${index}]`,
      label: entry?.type,
      explanation: entry?.description,
    })),
    ...(settlement?.conflicts || []).map((entry, index) => ({
      path: `conflicts[${index}]`,
      label: entry?.name || entry?.type || `Conflict ${index + 1}`,
      explanation:
        entry?.description
        || entry?.desc
        || entry?.tension
        || entry?.issue
        || entry?.cause
        || entry?.reason,
    })),
    ...authoredTensions.map((entry, index) => ({
      path: `authoredTensions[${index}]`,
      label: entry?.subject || entry?.type,
      explanation: entry?.reason,
    })),
  ];

  for (const candidate of candidates) {
    if (String(candidate.explanation || '').trim()) {
      evidence.push(finding(
        candidate.path,
        'Dramatic pressure is explained by the final dossier.',
        candidate.label,
      ));
    } else {
      findings.push(finding(
        candidate.path,
        'Dramatic pressure exists without an explanation.',
        candidate.label,
      ));
    }
  }
  return { findings, evidence, tensionCount: candidates.length };
}

export function repetitionFindings(settlement) {
  const findings = [
    ...duplicateFindings(
      (settlement?.institutions || []).map(entry => entry?.name),
      'institutions',
      'institution identity',
    ),
    ...duplicateFindings(
      (settlement?.npcs || []).map(entry => entry?.name),
      'npcs',
      'NPC display identity',
    ),
  ];
  const relationshipPairs = (settlement?.relationships || []).map(entry => (
    [entry?.npc1Id, entry?.npc2Id]
      .filter(Boolean)
      .sort()
      .join('::')
  ));
  findings.push(...duplicateFindings(
    relationshipPairs,
    'relationships',
    'relationship pair',
  ));
  return findings;
}

export function provenanceAssessment(
  settlement,
  { seed, worldLawVersion, repairs, authoredTensions },
) {
  const findings = [];
  const evidence = [];
  const trace = settlement?.simulationTrace || [];
  const generated = Boolean(
    seed
    || settlement?.generatorVersion
    || trace.length
  );
  if (!generated) {
    return {
      findings,
      evidence: [finding(
        'provenance',
        'No generator provenance was claimed; confidence is not assessed.',
      )],
      applicable: false,
    };
  }

  if (seed) {
    evidence.push(finding(
      'seed',
      'Deterministic replay seed is recorded.',
      seed,
    ));
  } else {
    findings.push(finding(
      'seed',
      'Generated settlement has no deterministic replay seed.',
    ));
  }
  if (Number.isFinite(worldLawVersion)) {
    evidence.push(finding(
      'worldLawVersion',
      'World-law version is recorded.',
      worldLawVersion,
    ));
  } else {
    findings.push(finding(
      'worldLawVersion',
      'Generated settlement has no world-law version provenance.',
    ));
  }
  if (trace.length) {
    evidence.push(finding(
      'simulationTrace',
      'Deterministic generation trace is present.',
      `${trace.length} trace entries`,
    ));
  } else {
    evidence.push(finding(
      'simulationTrace',
      'No step trace was persisted; replay confidence rests on the recorded seed and world-law version.',
    ));
  }

  for (const [index, repair] of (repairs || []).entries()) {
    if (repair?.type && repair?.action && repair?.reason) continue;
    findings.push(finding(
      `repairs[${index}]`,
      'Repair provenance is incomplete.',
      repair?.subject,
    ));
  }
  for (const [index, tension] of (authoredTensions || []).entries()) {
    if (tension?.type && tension?.reason) continue;
    findings.push(finding(
      `authoredTensions[${index}]`,
      'Authored-tension provenance is incomplete.',
      tension?.subject,
    ));
  }
  return { findings, evidence, applicable: true };
}

function freezeFindings(entries) {
  return Object.freeze(entries.map(entry => Object.freeze({ ...entry })));
}

function check(id, label, findings) {
  return Object.freeze({
    id,
    label,
    status: findings.length ? 'fail' : 'pass',
    findings: freezeFindings(findings),
  });
}

function judgment({
  id,
  label,
  findings,
  evidence,
  summary,
  status = null,
  scope = 'single_settlement',
}) {
  const resolvedStatus = status
    || (findings.length ? 'needs_review' : 'pass');
  return Object.freeze({
    id,
    label,
    status: resolvedStatus,
    scope,
    summary,
    findings: freezeFindings(findings),
    evidence: freezeFindings(evidence.length
      ? evidence
      : [finding(id, 'No contradictory evidence was found.')]),
  });
}

function findingsFor(checksById, ids) {
  return ids.flatMap(id => checksById.get(id)?.findings || []);
}

/**
 * Build additive v1 checks and the seven formal judgments.
 */
export function buildGenerationReceiptExtension({
  settlement,
  baseChecks,
  authoredTensions,
  repairs,
  seed,
  worldLawVersion,
}) {
  const graph = finalGraphFindings(settlement);
  const chronology = chronologyFindings(settlement);
  const conservation = conservationFindings(settlement);
  const intent = userIntentAssessment(settlement);
  const narrative = narrativeRealizationFindings(settlement);
  const dramatic = dramaticTensionAssessment(
    settlement,
    authoredTensions,
  );
  const repetition = repetitionFindings(settlement);
  const provenance = provenanceAssessment(settlement, {
    seed,
    worldLawVersion,
    repairs,
    authoredTensions,
  });

  const extensionChecks = [
    check('final_graph', 'Final graph references resolve', graph),
    check('chronology', 'History chronology is valid', chronology),
    check('conservation', 'Numeric state and conserved shares are valid', conservation),
    check('user_intent', 'Explicit user intent is fulfilled or explained', intent.findings),
    check('narrative_realization', 'Active pressures and history are realized in prose', narrative),
    check('dramatic_tension', 'Dramatic tensions are explained', dramatic.findings),
    check('roster_repetition', 'Within-settlement identities and relationships do not repeat', repetition),
    check('provenance', 'Generation confidence is supported by provenance', provenance.findings),
  ];
  const checks = Object.freeze([...baseChecks, ...extensionChecks]);
  const checksById = new Map(checks.map(entry => [entry.id, entry]));
  const graphEvidence = [finding(
    'finalGraph',
    'Canonical relationships, factions, conflicts, and member references were inspected directly.',
    `${(settlement?.npcs || []).length} NPCs / ${(settlement?.relationships || []).length} relationships`,
  )];
  const semanticEvidence = [finding(
    'semanticAgreement',
    'World law, content policy, resources, food, isolation, and conserved shares were compared across final projections.',
  )];
  const narrativeEvidence = [finding(
    'narrative',
    'Template resolution, grammar, chronology, and pressure realization were inspected.',
    `${(settlement?.history?.historicalEvents || []).length} historical events`,
  )];
  const diversityEvidence = [finding(
    'diversityScope',
    'Within-settlement institution, NPC, faction, and relationship repetition was inspected. Cross-corpus repetition is intentionally evaluated only by cohort certification.',
  )];

  const judgments = Object.freeze([
    judgment({
      id: 'hard_structural_validity',
      label: 'Hard structural validity',
      findings: findingsFor(checksById, [
        'structural',
        'isolation_support',
        'final_graph',
      ]),
      evidence: graphEvidence,
      summary: 'Hard violations and broken final-graph references are defects; coherent hardship is not.',
    }),
    judgment({
      id: 'cross_system_semantic_agreement',
      label: 'Cross-system semantic agreement',
      findings: findingsFor(checksById, [
        'world_law_magic',
        'content_boundaries',
        'resource_truth',
        'food_verdict',
        'conservation',
      ]),
      evidence: semanticEvidence,
      summary: 'Canonical world, resource, food, and conserved-share projections must agree.',
    }),
    judgment({
      id: 'user_intent_fulfillment',
      label: 'User-intent fulfillment',
      findings: intent.findings,
      evidence: intent.evidence,
      summary: 'Explicit requirements, exclusions, stresses, routes, and content boundaries are preserved or honestly declined.',
    }),
    judgment({
      id: 'narrative_realization',
      label: 'Narrative realization and grammar',
      findings: findingsFor(checksById, [
        'template_tokens',
        'narrative_quality',
        'chronology',
        'narrative_realization',
      ]),
      evidence: narrativeEvidence,
      summary: 'History and active pressure must be realized as resolved, grammatical, chronologically valid prose.',
    }),
    judgment({
      id: 'dramatic_tension',
      label: 'Explainable dramatic tension',
      findings: dramatic.findings,
      evidence: dramatic.evidence.length
        ? dramatic.evidence
        : [finding(
            'dramaticTension',
            'No active dramatic tension required explanation.',
          )],
      summary: dramatic.tensionCount
        ? 'Hardship is coherent when its cause and consequence are explained.'
        : 'No active dramatic tension was generated.',
      status: dramatic.findings.length
        ? 'needs_review'
        : dramatic.tensionCount
          ? 'pass_with_tension'
          : 'not_applicable',
    }),
    judgment({
      id: 'diversity_and_repetition',
      label: 'Diversity and repetition',
      findings: findingsFor(checksById, [
        'npc_identity',
        'roster_repetition',
      ]),
      evidence: diversityEvidence,
      summary: 'This receipt judges repetition inside one settlement; cohort diversity remains a corpus-level contract.',
    }),
    judgment({
      id: 'confidence_and_provenance',
      label: 'Confidence and provenance',
      findings: provenance.findings,
      evidence: provenance.evidence,
      summary: provenance.applicable
        ? 'Confidence is categorical and evidence-based: replay seed, world-law version, trace, repairs, and authored exceptions.'
        : 'No generator provenance was claimed, so confidence is not inferred.',
      status: provenance.applicable
        ? null
        : 'not_applicable',
    }),
  ]);

  return { checks, judgments };
}
