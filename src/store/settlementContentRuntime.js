/**
 * Resolve the extension inputs for one settlement-generation transaction.
 *
 * Standalone generation reads the reviewed account environment. An active
 * campaign reads only its pinned binding, never the moving account library.
 * The projector is injected so settlementSlice can keep the comparatively
 * heavy content-environment module behind its generation-time lazy boundary.
 */
export function settlementContentRuntimeOptions(
  state,
  projectCampaignBinding,
  eligibleCustomContent,
) {
  const activeCampaign = state.activeCampaignId == null
    ? null
    : (state.campaigns || []).find(campaign => (
      String(campaign?.id) === String(state.activeCampaignId)
    )) || null;
  const runtime = activeCampaign
    ? projectCampaignBinding(activeCampaign.contentBinding)
    : state.getActiveCustomContentRuntime?.() || {
        customContent: state.customContent || {},
        tunables: {},
      };
  const enabled = state.config?.useCustomContent !== false;
  return {
    customContent: enabled
      ? eligibleCustomContent(runtime.customContent, {
          tier: state.config?.settType,
        })
      : {},
    contentTunables: enabled ? runtime.tunables : {},
    explicitConfigFields: state.configExplicitFields || {},
    contentProvenance: enabled
      ? {
          scope: activeCampaign ? 'campaign' : 'standalone',
          environment: runtime.environment || null,
          bindingHash: activeCampaign?.contentBinding?.bindingHash || null,
        }
      : null,
  };
}

/**
 * Load the two content-domain dependencies only when generation begins. This
 * keeps both the manifest compiler and environment projector out of first paint.
 */
export async function loadSettlementContentRuntimeOptions(state) {
  const [schema, environment] = await Promise.all([
    import('../domain/customContentSchema.js'),
    import('../domain/content/contentEnvironment.js'),
  ]);
  return settlementContentRuntimeOptions(
    state,
    environment.contentRuntimeFromCampaignBinding,
    schema.eligibleCustomContent,
  );
}
