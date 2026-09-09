/**
 * Pure admission + policy for the operational-obligation probe.
 *
 * Kept separate from the network runner so CI can pin fail-closed behavior
 * without possessing a production service-role key.
 */

export const OPERATIONAL_SEVERITIES = Object.freeze([
  'healthy',
  'warning',
  'critical',
]);

const RANK = Object.freeze({
  healthy: 0,
  warning: 1,
  critical: 2,
});

export function parseOperationalHealth(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, reason: 'response_not_object' };
  }
  if (value.schemaVersion !== 1) {
    return { ok: false, reason: 'unsupported_schema_version' };
  }
  if (!OPERATIONAL_SEVERITIES.includes(value.severity)) {
    return { ok: false, reason: 'invalid_severity' };
  }
  if (value.healthy !== (value.severity === 'healthy')) {
    return { ok: false, reason: 'severity_health_mismatch' };
  }
  return { ok: true, health: value };
}

export function severityAllowed(severity, maximum = 'healthy') {
  if (!(severity in RANK) || !(maximum in RANK)) return false;
  return RANK[severity] <= RANK[maximum];
}

export function probeExitCode(result, maximum = 'healthy') {
  if (!result?.ok) return 2;
  return severityAllowed(result.health?.severity, maximum) ? 0 : 1;
}

/**
 * Combine the migration 182 obligation report and migration 184 application-
 * command report without allowing either authority to disappear behind the
 * other's healthy state.
 */
export function combineOperationalHealth(obligations, applicationCommands) {
  const obligationResult = parseOperationalHealth(obligations);
  if (!obligationResult.ok) {
    return {
      ok: false,
      reason: `obligations_${obligationResult.reason}`,
    };
  }
  const commandResult = parseOperationalHealth(applicationCommands);
  if (!commandResult.ok) {
    return {
      ok: false,
      reason: `application_commands_${commandResult.reason}`,
    };
  }
  const severity = RANK[obligationResult.health.severity]
    >= RANK[commandResult.health.severity]
    ? obligationResult.health.severity
    : commandResult.health.severity;
  return {
    ok: true,
    health: Object.freeze({
      schemaVersion: 1,
      healthy: severity === 'healthy',
      severity,
      obligations: obligationResult.health,
      applicationCommands: commandResult.health,
    }),
  };
}
