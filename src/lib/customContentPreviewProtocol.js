/**
 * Shared identity for the lazy custom-content sample worker protocol.
 *
 * Both sides verify this value. A response from a stale cached worker must not
 * be interpreted as a current sample merely because its request id happens to
 * match.
 */
export const CUSTOM_CONTENT_PREVIEW_WORKER_CONTRACT =
  'settlementforge:custom-content-preview:lazy-v1';
