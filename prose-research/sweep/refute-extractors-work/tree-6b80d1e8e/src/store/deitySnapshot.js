/**
 * Compatibility path for callers that historically imported from the store.
 *
 * The zero-import authority now lives in domain so headless preview and event
 * code can share it without a forbidden domain → store edge.
 */
export { deitySnapshotFrom } from '../domain/deitySnapshot.js';
