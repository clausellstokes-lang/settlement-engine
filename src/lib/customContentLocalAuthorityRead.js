/**
 * Strict read wall for the browser-local immutable custom-content authority.
 *
 * The flat `sf_custom_content` value is only a compatibility projection. If
 * the revision ledger is corrupt or belongs to an unknown schema, silently
 * replacing it from that projection would destroy history, archive state,
 * environments, and receipts. Preserve the original bytes and require an
 * explicit recovery path instead.
 */

export function readCustomContentLocalAuthority(
  key,
  expectedSchemaVersion,
) {
  let serialized;
  try {
    serialized = localStorage.getItem(key);
  } catch (cause) {
    throw Object.assign(
      new Error('The local custom-content authority could not be read.'),
      { code: 'custom_content_local_ledger_unavailable', cause },
    );
  }
  if (serialized == null) return null;

  let raw;
  try {
    raw = JSON.parse(serialized);
  } catch (cause) {
    throw Object.assign(
      new Error(
        'The local custom-content authority is corrupt and was preserved for recovery.',
      ),
      { code: 'custom_content_local_ledger_corrupt', cause },
    );
  }
  if (
    !raw
    || typeof raw !== 'object'
    || Array.isArray(raw)
    || raw.schemaVersion !== expectedSchemaVersion
  ) {
    throw Object.assign(
      new Error(
        'The local custom-content authority uses an unsupported schema and was preserved for recovery.',
      ),
      {
        code: 'custom_content_local_ledger_schema_unsupported',
        actualSchemaVersion: raw?.schemaVersion ?? null,
      },
    );
  }
  return raw;
}
