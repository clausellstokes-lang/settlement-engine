/**
 * Shared bounds for the SettlementForge account-transfer envelope.
 *
 * Export and import must use one contract. Keeping these values in a neutral
 * leaf prevents the former accountData ↔ accountImport dependency cycle and,
 * more importantly, makes it impossible for the exporter to produce a file
 * that the importer rejects solely because the two sides disagree on limits.
 */

export const ACCOUNT_EXPORT_VERSION = 3;
// The constitutional custom-content archive is independently capped at
// 16 MiB. Leave equal bounded headroom for settlements/campaigns and JSON
// envelope overhead so a valid archive is not rejected merely because it was
// placed inside the account-transfer format.
export const MAX_IMPORT_BYTES = 32 * 1024 * 1024;
export const MAX_IMPORT_SETTLEMENTS = 1_000;
export const MAX_IMPORT_CAMPAIGNS = 1_000;

/**
 * Count UTF-8 bytes, not JavaScript UTF-16 code units. Browser File.size and
 * the content-pack parser both operate on bytes, so astral and non-ASCII text
 * must receive the same decision before and after download.
 *
 * @param {unknown} value
 */
export function accountTransferByteLength(value) {
  const text = String(value ?? '');
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(text).length;
  }
  // TextEncoder is present in every supported runtime. Keep a standards-based
  // fallback for narrow test shells without depending on deprecated
  // encodeURIComponent/unescape behavior. Iteration is by Unicode code point;
  // lone surrogates correctly occupy the replacement character's three bytes.
  let bytes = 0;
  for (const character of text) {
    const point = character.codePointAt(0) ?? 0;
    if (point <= 0x7F) bytes += 1;
    else if (point <= 0x7FF) bytes += 2;
    else if (point <= 0xFFFF) bytes += 3;
    else bytes += 4;
  }
  return bytes;
}
