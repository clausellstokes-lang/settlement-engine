const ROOT = new URL('./mcr/', import.meta.url);
const { SIMULATION_RULE_PRESETS, normalizeSimulationRules, DEFAULT_SIMULATION_RULES } = await import(new URL('src/domain/worldPulse/simulationRules.js', ROOT).href);
const rows = Object.entries({ DEFAULT: { rules: DEFAULT_SIMULATION_RULES }, ...SIMULATION_RULE_PRESETS }).map(([id, p]) => {
  const r = normalizeSimulationRules(p.rules);
  const flowGate = !['off', 'local'].includes(r.propagationMode) && !!r.migrationFlowsEnabled;
  return { id, migrationFlowsEnabled: r.migrationFlowsEnabled, propagationMode: r.propagationMode, populationDynamicsEnabled: r.populationDynamicsEnabled,
    majorChangesRequireProposal: r.majorChangesRequireProposal, politicalAutonomy: r.politicalAutonomy, intensity: r.intensity, demographicsEnabled: r.demographicsEnabled,
    flowGateLit: flowGate, emigrationGateLit: flowGate && !!r.populationDynamicsEnabled };
});
console.table(rows);
