/**
 * Export-only loader for operator messages and consent compliance history.
 *
 * These records belong in a member's data export, but they are not portable
 * product state and must never be imported into another account. The database
 * RPC projects only the caller's received messages/receipts and their own
 * consent history; this client normalizer keeps that projection closed even if
 * a future RPC accidentally returns an internal dispatch or actor field.
 */
import { supabase, isConfigured } from './supabase.js';

export const OPERATOR_SERVICE_EXPORT_SCHEMA_VERSION = 1;
const MESSAGE_KINDS = new Set(['broadcast', 'direct']);
const MESSAGE_CLASSES = new Set(['service', 'announcement']);
const SENDER_ROLES = new Set(['admin', 'developer', 'system']);
const EMAIL_STATUSES = new Set(['pending', 'sending', 'sent', 'failed', 'skipped']);
const CONSENT_KEYS = new Set(['essential', 'research', 'ai_prose', 'market']);
const CONSENT_SOURCES = new Set(['account', 'unsubscribe', 'system']);

export function emptyOperatorServiceExport() {
  return {
    schemaVersion: OPERATOR_SERVICE_EXPORT_SCHEMA_VERSION,
    importable: false,
    operatorMessages: [],
    consentChanges: [],
  };
}

function nullableString(value) {
  return typeof value === 'string' && value ? value : null;
}

function normalizeMessage(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
  const id = nullableString(row.id || row.message_id);
  const subject = nullableString(row.subject);
  const body = typeof row.body === 'string' ? row.body : null;
  const kind = row.kind;
  const messageClass = row.class || row.message_class;
  const senderRole = row.sender_role || row.senderRole;
  if (!id || !subject || body == null || !MESSAGE_KINDS.has(kind)
    || !MESSAGE_CLASSES.has(messageClass) || !SENDER_ROLES.has(senderRole)) return null;
  const emailStatus = row.email_status || row.emailStatus;
  return {
    id,
    kind,
    class: messageClass,
    senderRole,
    subject,
    body,
    template: nullableString(row.template || row.template_key),
    createdAt: nullableString(row.created_at || row.createdAt),
    deliveredAt: nullableString(row.delivered_at || row.deliveredAt),
    readAt: nullableString(row.read_at || row.readAt),
    dismissedAt: nullableString(row.dismissed_at || row.dismissedAt),
    emailStatus: EMAIL_STATUSES.has(emailStatus) ? emailStatus : null,
    emailDeliveredAt: nullableString(row.email_delivered_at || row.emailDeliveredAt),
  };
}

function normalizeConsentChange(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
  const consentKey = nullableString(row.consent_key || row.consentKey);
  const source = row.source;
  const priorValue = row.prior_value ?? row.priorValue;
  const newValue = row.new_value ?? row.newValue;
  if (!CONSENT_KEYS.has(consentKey) || !CONSENT_SOURCES.has(source)
    || typeof priorValue !== 'boolean' || typeof newValue !== 'boolean') return null;
  return {
    consentKey,
    priorValue,
    newValue,
    consentModelVersion: Number.isFinite(Number(row.consent_model_version || row.consentModelVersion))
      ? Number(row.consent_model_version || row.consentModelVersion)
      : null,
    source,
    createdAt: nullableString(row.created_at || row.createdAt),
  };
}

/** Normalize the closed export projection returned by migration 194. */
export function normalizeOperatorServiceExport(value) {
  const raw = Array.isArray(value) && value.length === 1 ? value[0] : value;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return emptyOperatorServiceExport();
  }
  const messageRows = Array.isArray(raw.operator_messages)
    ? raw.operator_messages
    : Array.isArray(raw.operatorMessages) ? raw.operatorMessages : [];
  const consentRows = Array.isArray(raw.consent_changes)
    ? raw.consent_changes
    : Array.isArray(raw.consentChanges) ? raw.consentChanges : [];
  return {
    schemaVersion: OPERATOR_SERVICE_EXPORT_SCHEMA_VERSION,
    importable: false,
    operatorMessages: messageRows.map(normalizeMessage).filter(Boolean),
    consentChanges: consentRows.map(normalizeConsentChange).filter(Boolean),
  };
}

/**
 * Load the caller's complete service-record export. A configured backend failure
 * is fatal: silently downloading an archive without these records would make the
 * Data & Privacy promise false. Local/unconfigured builds have no server records.
 */
export async function getMyOperatorServiceExport() {
  if (!isConfigured || !supabase) return emptyOperatorServiceExport();
  const { data, error } = await supabase.rpc('get_my_operator_service_export');
  if (error) {
    throw new Error('Your message and consent records could not be loaded for export. Please try again.');
  }
  return normalizeOperatorServiceExport(data);
}
