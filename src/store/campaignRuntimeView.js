import {
  Component,
  Suspense,
  createElement,
  lazy,
} from 'react';
import { preloadCampaignRuntimeForStore } from './campaignRuntimeBridge.js';

function incompleteCampaignLoadError(detail) {
  return Object.assign(
    new Error(detail?.message || 'Your campaigns could not be loaded. Try again.'),
    {
      name: 'CampaignRuntimeViewLoadError',
      code: detail?.code || 'campaign_load_incomplete',
    },
  );
}

/** Resolve a campaign-capable lazy view only after its synchronous actions exist. */
export async function loadCampaignRuntimeView(
  store,
  importer,
  preload = preloadCampaignRuntimeForStore,
) {
  await preload(store);
  const state = store?.getState?.();
  if (
    state?.auth?.tier !== 'anon'
    && state?.campaignsLoaded !== true
    && typeof state?.loadCampaigns === 'function'
  ) {
    await state.loadCampaigns();
    const refreshedState = store?.getState?.();
    if (
      refreshedState?.auth?.tier !== 'anon'
      && refreshedState?.campaignsLoaded !== true
    ) {
      throw incompleteCampaignLoadError(refreshedState?.campaignLoadError);
    }
  }
  return importer();
}

/**
 * Create a lazy view whose rejected load is retryable.
 *
 * React.lazy caches both fulfilled and rejected loader promises on the lazy
 * component type. Keeping that type at module scope would make an error
 * boundary's "Try again" render the same cached rejection forever. This stable
 * wrapper creates the lazy type per mounted instance instead. Error-boundary
 * recovery unmounts the failed subtree, so its next mount gets a new type and
 * reruns the loader.
 */
export function createRetryableLazy(
  importer,
  {
    fallback = null,
  } = {},
) {
  class RetryableLazyView extends Component {
    /** @param {Record<string, unknown>} props */
    constructor(props) {
      super(props);
      this.View = lazy(importer);
    }

    render() {
      const viewProps = /** @type {{ props: Record<string, unknown> }} */ (
        /** @type {unknown} */ (this)
      ).props;
      // The inner boundary is structural: it lets this wrapper commit while the
      // view suspends. A later loader rejection then unmounts a committed
      // wrapper through the caller's error boundary; retry mounts a new wrapper
      // and therefore a new lazy identity.
      return createElement(
        Suspense,
        { fallback },
        createElement(this.View, viewProps),
      );
    }
  }

  return RetryableLazyView;
}

/** Gate a retryable lazy view on this store's complete campaign runtime. */
export function createRetryableCampaignLazy(
  store,
  importer,
  {
    fallback = null,
    loadView = loadCampaignRuntimeView,
  } = {},
) {
  return createRetryableLazy(
    () => loadView(store, importer),
    { fallback },
  );
}
