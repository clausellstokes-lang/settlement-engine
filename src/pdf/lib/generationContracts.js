/**
 * Safe owner-facing projections of persisted generation receipts.
 *
 * The PDF view-model is a presentation boundary: it must not hand arbitrary
 * nested save objects to react-pdf, and a partial AI overlay must never replace
 * canonical generation facts. These helpers are intentionally policy-free.
 * Generation owns the meaning of the records; this module only validates and
 * summarizes their persisted shape.
 */

const COHERENCE_JUDGMENT_STATUSES = new Set([
  'pass',
  'pass_with_tension',
  'needs_review',
  'not_applicable',
]);

function culturalIdentityView(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const text = key => (
    typeof value[key] === 'string' && value[key].trim()
      ? value[key].trim()
      : null
  );
  const identity = {
    key: text('key'),
    label: text('label'),
    scope: text('scope'),
    sourceKeys: Array.isArray(value.sourceKeys)
      ? value.sourceKeys.map(String).filter(Boolean)
      : [],
    builtForm: text('builtForm'),
    civicPattern: text('civicPattern'),
    exchangePattern: text('exchangePattern'),
    foodways: text('foodways'),
    sacredLife: text('sacredLife'),
    defensePattern: text('defensePattern'),
    socialTexture: text('socialTexture'),
    architecturalDetail: text('architecturalDetail'),
  };
  return Object.values(identity).some(entry => (
    Array.isArray(entry) ? entry.length > 0 : entry != null
  )) ? identity : null;
}

function coherenceFindingView(finding) {
  return {
    path: typeof finding.path === 'string' ? finding.path : null,
    detail: typeof finding.detail === 'string' ? finding.detail : null,
    evidence: typeof finding.evidence === 'string'
      ? finding.evidence
      : null,
  };
}

function coherenceCheckView(check) {
  return {
    id: typeof check.id === 'string' ? check.id : null,
    label: typeof check.label === 'string' ? check.label : 'Unnamed check',
    status: check.status === 'pass' ? 'pass' : 'fail',
    findings: (Array.isArray(check.findings) ? check.findings : [])
      .filter(finding => finding && typeof finding === 'object')
      .map(coherenceFindingView),
  };
}

function coherenceJudgmentView(judgment) {
  return {
    id: typeof judgment.id === 'string' ? judgment.id : null,
    label: typeof judgment.label === 'string'
      ? judgment.label
      : 'Unnamed judgment',
    status: COHERENCE_JUDGMENT_STATUSES.has(judgment.status)
      ? judgment.status
      : 'needs_review',
    scope: judgment.scope === 'single_settlement'
      ? 'single_settlement'
      : null,
    summary: typeof judgment.summary === 'string'
      ? judgment.summary
      : null,
    findings: (Array.isArray(judgment.findings)
      ? judgment.findings
      : [])
      .filter(finding => finding && typeof finding === 'object')
      .map(coherenceFindingView),
    evidence: (Array.isArray(judgment.evidence)
      ? judgment.evidence
      : [])
      .filter(finding => finding && typeof finding === 'object')
      .map(coherenceFindingView),
  };
}

function generationCoherenceView(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const checks = (Array.isArray(value.checks) ? value.checks : [])
    .filter(check => check && typeof check === 'object')
    .map(coherenceCheckView);
  const judgments = (Array.isArray(value.judgments) ? value.judgments : [])
    .filter(judgment => judgment && typeof judgment === 'object')
    .map(coherenceJudgmentView);
  return {
    version: Number.isFinite(value.version) ? value.version : null,
    status: typeof value.status === 'string' ? value.status : 'needs_review',
    seed: typeof value.seed === 'string' ? value.seed : null,
    worldLawVersion: Number.isFinite(value.worldLawVersion)
      ? value.worldLawVersion
      : null,
    cultureProfile: typeof value.cultureProfile === 'string'
      ? value.cultureProfile
      : null,
    contentProfile: typeof value.contentProfile === 'string'
      ? value.contentProfile
      : null,
    checks,
    passedChecks: checks.filter(check => check.status === 'pass').length,
    totalChecks: checks.length,
    judgments,
    supportedJudgments: judgments.filter(judgment => (
      judgment.status === 'pass'
      || judgment.status === 'pass_with_tension'
    )).length,
    totalJudgments: judgments.length,
    reviewJudgments: judgments.filter(
      judgment => judgment.status === 'needs_review',
    ).length,
    findingCount: checks.reduce(
      (total, check) => total + check.findings.length,
      0,
    ),
    repairCount: Array.isArray(value.repairs) ? value.repairs.length : 0,
    authoredTensions: (Array.isArray(value.authoredTensions)
      ? value.authoredTensions
      : [])
      .filter(tension => tension && typeof tension === 'object')
      .map(tension => ({
        type: typeof tension.type === 'string' ? tension.type : null,
        subject: typeof tension.subject === 'string' ? tension.subject : null,
        reason: typeof tension.reason === 'string' ? tension.reason : null,
      })),
  };
}

/**
 * Project canonical owner facts, falling back only when the canonical save does
 * not carry the new records (for legacy/direct view-model callers).
 *
 * @param {Record<string, any>|null|undefined} canonical
 * @param {Record<string, any>|null|undefined} [fallback]
 */
export function ownerGenerationContracts(canonical, fallback = canonical) {
  return {
    culturalIdentity: culturalIdentityView(
      canonical?.culturalIdentity ?? fallback?.culturalIdentity,
    ),
    generationCoherence: generationCoherenceView(
      canonical?.generationCoherenceReceipt
      ?? fallback?.generationCoherenceReceipt,
    ),
  };
}
